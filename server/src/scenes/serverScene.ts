import { getIo } from '../utils/server';
import { getSeed } from '../utils/seed';
import { Engine, World, Bodies, Body } from 'matter-js';
import Building from '../entities/building';
import Unit from '../entities/unit';
import { Events } from '../interfaces/eventConstants';

class ServerScene {
  public players: Players = {};
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
    // this.testUnit = new Unit(this, 0, 0);
    this.handleSockets();
    this.initPhysics();
    this.startPhysicsUpdate();
    this.startServerUpdateTick();
  }

  public sendUnitPositions() {
    //for each unit on map, key value pair for owning player ID
    // return this.testUnit.getPosition();
    // const { x, y } = this.box.position;
    // return { x, y };
  }

  public addEntityToSceneAndNotify(group, newEntity) {
    const { x, y } = newEntity.body.position;
    console.log(newEntity.id);
    console.log('x and y: ', x, y);
    group[newEntity.id] = newEntity;
    World.add(this.world, newEntity.body);
    this.io.emit(Events.NEW_UNIT_ADDED, { x, y, id: newEntity.id });
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
      this.players[socket.id] = {
        id: socket.id,
        name: `Player${Math.round(Math.random() * 1000) + 1}`
      };
      socket.broadcast.emit(Events.CONNECTION, this.players[socket.id].name);

      socket.on(Events.CHANGE_NAME, (name) => {
        // this.addUnitToSceneAndNotify(new Unit(this, 50, 50));
        this.players[socket.id].name = name;
        socket.emit(Events.CHANGE_NAME_OK, this.players[socket.id].name);
        // socket.emit('errorStatus', 'Could not change name');
      });

      socket.on(Events.GET_ALL_USER_NAMES, () => {
        socket.emit(Events.GET_ALL_USER_NAMES, Object.values(this.players).map((player) => player.name));
      });

      socket.on(Events.PLAYER_DISCONNECTED, () => {
        socket.disconnect();
      });
      socket.on(Events.DISCONNECT, () => {
        console.log('user disconnected');
        this.io.emit(Events.DISCONNECT, this.players[socket.id].name);
        delete this.players[socket.id];
      });
      socket.on(Events.ISSUE_UNIT_COMMAND, () => {});

      socket.on(Events.PLAYER_CONSTRUCT_BUILDING, (data: { x: number; y: number }) => {
        const { x, y } = data;
        const newBuilding = new Building({ x, y }, 30, socket.id);
        this.addEntityToSceneAndNotify(this.buildings, newBuilding);
      });
      socket.on(Events.PLAYER_ISSUE_COMMAND, (data: { x: number; y: number }) => {
        const { x, y } = data;
        const newUnit = new Unit({ x, y }, 30, socket.id);
        this.addEntityToSceneAndNotify(this.units, newUnit);
      });
    });
  }

  public startServerUpdateTick() {
    setInterval(() => {
      this.io.emit(Events.SERVER_STATUS_UPDATE, this.sendUnitPositions());
    }, 1000 / 30);
  }

  public initPhysics() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    // this.box = Bodies.rectangle(400, 200, 80, 80);
    // this.ground = Bodies.rectangle(400, 500, 500, 30, { isStatic: true });
    // this.add.rectangle(400, 50, 500, 30, 0xffffff);
    // this.addEntityToSceneAndNotify(this.box);
    // World.add(world, [this.box, this.ground]);
  }

  public startPhysicsUpdate() {
    setInterval(() => {
      // Body.applyForce(this.box, { x: 0, y: 0 }, { x: 0, y: -0.1 });
      // this.box.position.x += 0.05;
      Engine.update(this.engine, 1000 / 60);
    }, 1000 / 60);
  }
}
export default ServerScene;
