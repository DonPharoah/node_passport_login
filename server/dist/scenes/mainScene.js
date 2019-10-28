"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Unit from '../entities/unit';
var server_1 = require("../utils/server");
var short = require("short-uuid");
var MainScene = /** @class */ (function () {
    function MainScene() {
        this.io = server_1.getIo();
        this.seed = short();
        this.init();
    }
    MainScene.prototype.init = function () {
        // this.testUnit = new Unit(this, 0, 0);
        var _this = this;
        this.pingNamespace = this.io.of('/ping-namespace');
        this.pingNamespace.on('connection', function (socket) {
            socket.on('pingEvent', function () {
                socket.emit('pongEvent');
            });
        });
        this.io.on('connection', function (socket) {
            console.log('user connected');
            _this.players[socket.id] = {
                playerId: socket.id,
                playerName: "Player" + (Math.round(Math.random() * 1000) + 1)
            };
            socket.broadcast.emit('connection', _this.players[socket.id].playerName);
            socket.on('changeName', function (name) {
                // this.addUnitToSceneAndNotify(new Unit(this, 50, 50));
                _this.players[socket.id].playerName = name;
                socket.emit('nameChangeOK', _this.players[socket.id].playerName);
                // socket.emit('errorStatus', 'Could not change name');
            });
            socket.on('getAllUserNames', function () {
                socket.emit('getAllUserNames', Object.values(_this.players).map(function (player) { return player.playerName; }));
            });
            socket.on('playerDisconnect', function () {
                socket.disconnect();
            });
            socket.on('disconnect', function () {
                console.log('user disconnected');
                _this.io.emit('disconnect', _this.players[socket.id].playerName);
                delete _this.players[socket.id];
            });
        });
    };
    MainScene.prototype.sendUnitPositions = function () {
        //for each unit on map, key value pair for owning player ID
        // return this.testUnit.getPosition();
    };
    MainScene.prototype.addUnitToSceneAndNotify = function (newUnit) {
        var objectID = this.seed.generate();
        this.io.emit('newUnitAdded', objectID);
    };
    MainScene.prototype.serverTick = function () {
        var _this = this;
        setInterval(function () {
            _this.io.emit('serverTick', _this.sendUnitPositions());
        }, 1000 / 30);
    };
    return MainScene;
}());
exports.MainScene = MainScene;
//# sourceMappingURL=mainScene.js.map