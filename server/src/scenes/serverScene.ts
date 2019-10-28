// import Unit from '../entities/unit';
import { getIo } from '../utils/server';
import * as short from 'short-uuid';
import { Engine, World, Bodies, Body } from 'matter-js';

class ServerScene {
  public players: Players = {};
  private io = getIo();
  private seed: short.Translator;
  private pingNamespace: SocketIO.Namespace;
  private engine: Engine;
  private box: Body;
  private ground: Body;
  // public testUnit: Unit;

  constructor() {
    this.seed = short();
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
    const { x, y } = this.box.position;
    return { x, y };
  }

  public addUnitToSceneAndNotify(newUnit) {
    const objectID = this.seed.generate();
    this.io.emit('newUnitAdded', objectID);
  }

  public handleSockets() {
    this.pingNamespace = this.io.of('/ping-namespace');
    this.pingNamespace.on('connection', (socket) => {
      socket.on('pingEvent', () => {
        socket.emit('pongEvent');
      });
    });

    this.io.on('connection', (socket) => {
      console.log('user connected');
      this.players[socket.id] = {
        playerId: socket.id,
        playerName: `Player${Math.round(Math.random() * 1000) + 1}`
      };
      socket.broadcast.emit('connection', this.players[socket.id].playerName);

      socket.on('changeName', (name) => {
        // this.addUnitToSceneAndNotify(new Unit(this, 50, 50));
        this.players[socket.id].playerName = name;
        socket.emit('nameChangeOK', this.players[socket.id].playerName);
        // socket.emit('errorStatus', 'Could not change name');
      });

      socket.on('getAllUserNames', () => {
        socket.emit('getAllUserNames', Object.values(this.players).map((player) => player.playerName));
      });

      socket.on('playerDisconnect', () => {
        socket.disconnect();
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
        this.io.emit('disconnect', this.players[socket.id].playerName);
        delete this.players[socket.id];
      });
    });
  }

  public startServerUpdateTick() {
    setInterval(() => {
      this.io.emit('serverStatusUpdate', this.sendUnitPositions());
    }, 1000 / 30);
  }

  public initPhysics() {
    this.engine = Engine.create();
    const { world } = this.engine;
    this.box = Bodies.rectangle(400, 200, 80, 80);
    this.ground = Bodies.rectangle(400, 500, 500, 30, { isStatic: true });
    // this.add.rectangle(400, 50, 500, 30, 0xffffff);
    World.add(world, [this.box, this.ground]);
  }

  public startPhysicsUpdate() {
    // Body.applyForce(this.box, { x: 400, y: 200 }, { x: 400.5, y: 200.5 });
    setInterval(() => {
      this.box.position.x += 0.05;
      Engine.update(this.engine, 1000 / 60);
    }, 1000 / 60);
  }
}
export default ServerScene;
