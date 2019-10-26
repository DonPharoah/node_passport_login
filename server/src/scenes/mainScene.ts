import Building from '../entities/building';
import Unit from '../entities/unit';
import * as socketIo from 'socket.io';

class MainScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  public players: any = {};

  public buildings: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'mainScene', active: true });
  }
  public preload() {}

  public create() {
    // @ts-ignore
    const pingNamespace = io.of('/ping-namespace');
    pingNamespace.on('connection', (socket) => {
      socket.on('pingEvent', () => {
        socket.emit('pongEvent');
      });
    });

    // @ts-ignore
    const debugNamespace = io.of('/main-namespace');
    debugNamespace.on('connection', (socket) => {
      console.log('user connected');
      this.players[socket.id] = {
        playerId: socket.id,
        playerName: `Player${Math.round(Math.random() * 1000) + 1}`
      };
      socket.broadcast.emit('connection', this.players[socket.id].playerName);

      socket.on('changeName', (name) => {
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
        debugNamespace.emit('disconnect', this.players[socket.id].playerName);
        delete this.players[socket.id];
      });
    });
  }

  public update() {}
}
export default MainScene;
