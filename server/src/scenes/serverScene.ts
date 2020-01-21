import { getIo } from '../utils/server';
import { getSeed } from '../utils/seed';
import {
  Bounds,
  Composite,
  Events as MatterEvents,
  Engine,
  World,
  Bodies,
  Body
} from '../../externalLibraries/matter-dev.js';
import Building from '../models/entities/building';
import Unit from '../models/entities/unit';
import { Events } from '../models/schemas/eventConstants';
import Entity from '../models/entities/entity';
import buildingPresets from '../models/schemas/buildings/buildingPresets';

class ServerScene {
  public playersList: Players = {};
  public units: Units = {};
  public buildings: Buildings = {};

  private io = getIo();

  private pingNamespace: SocketIO.Namespace;
  private engine: Engine;
  private box: Body;
  private ground: Body;
  private world: World;

  // public testUnit: Unit;

  constructor() {
    this.init();
  }

  public init() {
    this.initBogusPlayer();
    this.handleSockets();
    this.initPhysics();
    this.startPhysicsUpdate();
    this.startServerUpdateTick();
    this.handleCollisionEvents();
  }

  public addEntityToSceneAndNotify(group, newEntity, notifier: Events, socketId: string, targetId?: string) {
    console.log('Adding entity to server scene...');
    newEntity.ownerId = socketId;
    const ownerId: string = newEntity.ownerId;
    const id: string = newEntity.id;
    let entityType: string = '';
    if (newEntity instanceof Building) {
      entityType = newEntity.preset.presetType;
    }
    console.log(`TYPE SERVER ${entityType}`);
    //console.log(`Entity '${newEntity.id}' added at: ${position.x}, ${position.y}`);
    group[newEntity.id] = newEntity;
    World.add(this.world, newEntity.body);
    this.io.emit(notifier, {
      position: newEntity.body.position,
      id: newEntity.id,
      ownerId: newEntity.ownerId,
      type: entityType,
      targetId: targetId
    });
  }

  public notifyClientOfEntities(clientSocket: SocketIO.Socket) {
    let unitsToSend = [];
    let buildingsToSend = [];
    Object.keys(this.buildings).forEach((currentId) => {
      let currentBuilding = this.buildings[currentId];
      const position = currentBuilding.body.position;
      const { ownerId } = currentBuilding;
      const id = currentBuilding.id;
      const type = currentBuilding.preset.presetType;
      const health: number = currentBuilding.currentHealth;
      const payload = { position: position, id: id, ownerId: ownerId, health: health, type: type };
      buildingsToSend.push(payload);
    });
    Object.keys(this.units).forEach((currentId) => {
      let currentUnit = this.units[currentId];
      const position = currentUnit.body.position;
      const { ownerId } = currentUnit;
      const id = currentUnit.id;
      const payload = { position, id, ownerId };
      unitsToSend.push(payload);
    });
    clientSocket.emit(Events.LOAD_ALL_BUILDINGS, buildingsToSend);
    clientSocket.emit(Events.LOAD_ALL_UNITS, unitsToSend);
  }

  public handleSockets() {
    this.pingNamespace = this.io.of('/ping-namespace');
    this.pingNamespace.on(Events.CONNECTION, (socket) => {
      socket.on(Events.PING_EVENT, () => {
        socket.emit(Events.PONG_EVENT);
      });
    });

    this.io.on(Events.CONNECTION, (socket) => {
      console.log('user connected');
      this.playersList[socket.id] = {
        id: socket.id,
        name: `Player${Math.round(Math.random() * 1000) + 1}`,
        color: ('00000' + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6)
      };
      socket.emit(Events.PLAYER_INIT, this.playersList);
      socket.broadcast.emit(Events.CONNECTION, this.playersList[socket.id]);
      this.io.emit(Events.UPDATE_PLAYERS_LIST, {
        ownerId: socket.id,
        playersList: this.playersList,
        joinOrLeave: 1
      });

      this.notifyClientOfEntities(socket);

      socket.on(Events.CHANGE_NAME, (name) => {
        // this.addUnitToSceneAndNotify(new Unit(this, 50, 50));
        this.playersList[socket.id].name = name;
        socket.emit(Events.CHANGE_NAME_OK, this.playersList[socket.id].name);
        // socket.emit('errorStatus', 'Could not change name');
      });

      socket.on(Events.GET_ALL_USER_NAMES, () => {
        socket.emit(
          Events.GET_ALL_USER_NAMES,
          Object.values(this.playersList).map((player) => player.name)
        );
      });

      // socket.on(Events.PLAYER_DISCONNECTED, () => {
      //   socket.disconnect();
      // });
      socket.on(Events.DISCONNECT, () => {
        console.log(`User ${socket.id} disconnected`);
        this.io.emit(Events.PLAYER_DISCONNECTED, this.playersList[socket.id]);
        delete this.playersList[socket.id];
        this.getBuildingsOfOwner(socket.id, (buildings) => {
          console.log('Buildings found ' + buildings.length);
          buildings.map((ownerBuilding: Building) => {
            ownerBuilding.setOwner('123');
            // ownerBuildings.name = 'WORLD';
            console.log('server: setted building data');
          });
        });
        this.getUnitsOfOwner(socket.id, (units) => {
          units.map((ownerUnits: Unit) => {
            ownerUnits.setOwner('123');
            // ownerUnits.name = 'WORLD';
          });
        });
        this.io.emit(Events.UPDATE_PLAYERS_LIST, {
          newOwnerId: '123',
          oldOwnerId: socket.id,
          playersList: this.playersList,
          joinOrLeave: 0
        });
      });
      socket.on(Events.ISSUE_UNIT_COMMAND, () => {});

      socket.on(Events.PLAYER_CONSTRUCT_BUILDING, (data: { x: number; y: number }) => {
        const { x, y } = data;
        const newBuilding = new Building(this, 'BARRACKS', { x, y }, 30, socket.id);
        this.addEntityToSceneAndNotify(this.buildings, newBuilding, Events.NEW_BUILDING_ADDED, socket.id);
      });

      socket.on(
        Events.PLAYER_ISSUE_COMMAND,
        (data: { x: number; y: number; selectedId: string; targetId: string }) => {
          console.log(`From server: calling PLAYER_ISSUE_COMMAND`);

          const { targetId, selectedId } = data;
          let x = 0,
            y = 0,
            newUnit: Unit,
            selectedBuilding,
            targetBuilding: Building;
          try {
            selectedBuilding = this.findBuildingById(selectedId);
          } catch (e) {
            console.log(e);
          }

          try {
            targetBuilding = this.findBuildingById(targetId);
          } catch (e) {
            console.log(e);
          }

          /*if (targetBuilding && targetBuilding.preset.presetType === 'MINER') {
            // abstract this block into buildingPresets so that commands are specific to building type
            newUnit = new Unit(this, { x, y }, 50, targetBuilding, this.buildings[selectedId]);
            this.addEntityToSceneAndNotify(this.units, newUnit, Events.NEW_UNIT_ADDED, socket.id);
            targetBuilding.preset.command(newUnit);
          }*/
          targetBuilding.issueCommand(this, selectedBuilding, targetBuilding, { x, y });
        }
      );
    });
  }

  public getBuildingsOfOwner(ownerId, callback) {
    let buildings = Object.values(this.buildings).filter((match) => match.ownerId === ownerId);
    callback(buildings);
  }
  public getUnitsOfOwner(ownerId, callback) {
    let units = Object.values(this.units).filter((match) => match.ownerId === ownerId);
    callback(units);
  }

  private handleCollisionEvents() {
    MatterEvents.on(this.engine, 'collisionStart', function(event) {});
  }

  public findBuildingById(id: string): Building {
    let building = this.buildings[id] ? this.buildings[id] : null;
    if (!building) throw new Error('Building could not be found');
    return building;
  }

  public findUnitById(id: string): Unit {
    let unit = this.units[id] ? this.units[id] : null;
    if (!unit) throw new Error('Unit could not be found');
    return unit;
  }

  public removeBuilding(buildingId) {
    World.remove(this.world, this.buildings[buildingId].body);
    delete this.buildings[buildingId];
    this.io.emit(Events.BUILDING_REMOVED, buildingId);
  }

  public removeUnit(unitId) {
    if (this.units[unitId]) {
      World.remove(this.world, this.units[unitId].body, true);
      delete this.units[unitId];
      this.io.emit(Events.UNIT_REMOVED, unitId);
    }
  }

  public updateEntityHealth(entity: Entity, entityCaller: Entity) {
    this.io.emit(Events.UPDATE_ENTITY_HEALTH, entity.id, entity.currentHealth, entityCaller.id);
  }

  public startServerUpdateTick() {
    setInterval(() => {
      this.io.emit(Events.SERVER_STATUS_UPDATE, this.sendUnitPositions());
    }, 1000 / 30);
  }

  public sendUnitPositions() {
    let unitsToSend = [];
    Object.keys(this.units).forEach((currentId) => {
      let currentUnit = this.units[currentId];
      const position = currentUnit.body.position;
      const { ownerId } = currentUnit;
      const id = currentUnit.id;
      const payload = { position, id };
      unitsToSend.push(payload);
    });
    return unitsToSend;
  }

  public initBogusPlayer() {
    this.playersList['123'] = {
      id: '123',
      name: `WORLD`,
      color: 'dddddd'
    };
  }
  public initPhysics() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.world.gravity.scale = 0;
    // this.box = Bodies.rectangle(400, 200, 80, 80);
    // this.ground = Bodies.rectangle(400, 500, 500, 30, { isStatic: true });
    // this.add.rectangle(400, 50, 500, 30, 0xffffff);
    // this.addEntityToSceneAndNotify(this.box);
    // World.add(world, [this.box, this.ground]);

    const testBuilding = new Building(this, 'MINER', { x: 500, y: 500 }, 30, '123');
    this.addEntityToSceneAndNotify(this.buildings, testBuilding, Events.NEW_BUILDING_ADDED, '123');
  }

  public updateUnitPositons() {
    Object.keys(this.units).forEach((currentId) => {
      let currentUnit = this.units[currentId];
      currentUnit.updatePosition();
    });
  }

  public startPhysicsUpdate() {
    setInterval(() => {
      // Body.applyForce(this.box, { x: 0, y: 0 }, { x: 0, y: -0.1 });
      // this.box.position.x += 0.05;
      this.updateUnitPositons();
      Engine.update(this.engine, 1000 / 60);
    }, 1000 / 60);
  }
}
export default ServerScene;
