import Building from '../entities/building';
import Unit from '../entities/unit';
import { Socket } from 'dgram';
import io = require('socket.io');
import { Physics, GameObjects } from 'phaser';
import * as short from 'short-uuid'
// const io = socketIo.listen(server);

class MainScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  public players: any = {};
  public playerGroup: Phaser.GameObjects.Group;
  public buildingGroup: Phaser.GameObjects.Group;
  public unitGroup: Phaser.GameObjects.Group;

  public testUnit: Unit;

  private seed: any ;

  constructor() {
    super({ key: 'mainScene', active: true });
    this.seed = short();
  }
  public preload() {}

  public create() {
    this.playerGroup = this.add.group({ name: 'playerGroup' });
    this.testUnit = new Unit(this, 0, 0);

    // @ts-ignore
    const pingNamespace = io.of('/ping-namespace');
    pingNamespace.on('connection', (socket) => {
      socket.on('pingEvent', () => {
        socket.emit('pongEvent');
      });
    });

    // @ts-ignore
    // const debugNamespace = io.of('/main-namespace');
    io.on('connection', (socket) => {
      console.log('user connected');
      this.players[socket.id] = {
        playerId: socket.id,
        playerName: `Player${Math.round(Math.random() * 1000) + 1}`
      };
      socket.broadcast.emit('connection', this.players[socket.id].playerName);

      socket.on('changeName', (name) => {
        this.addUnitToSceneAndNotify(new Unit(this,50,50));
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
        io.emit('disconnect', this.players[socket.id].playerName);
        delete this.players[socket.id];
      });
    });
  }

  public sendUnitPositions() {
    //for each unit on map, key value pair for owning player ID
    return this.testUnit.getPosition();
  }

  public addUnitToSceneAndNotify( newObject: Phaser.GameObjects.GameObject ) {
    this.add.existing(newObject);
    const objectID = this.seed.generate();
    io.emit('newUnitAdded', objectID );
  }

  public serverTick() {
    setInterval(() => {
      io.emit('serverTick', this.sendUnitPositions());}, 1000 / 30);
    );
  }

  public update() {
    this.physics.world.wrap(this.testUnit, 5);
  }
}
export default MainScene;
