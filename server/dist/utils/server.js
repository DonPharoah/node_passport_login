"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var compression = require("compression");
var socketIo = require("socket.io");
var mainScene_1 = require("../scenes/mainScene");
var io;
var app;
var server;
function startServer() {
    var _this = this;
    app = express();
    app.use(compression());
    server = http.createServer(app);
    io = socketIo.listen(server);
    server.listen(4000, function () {
        console.log("Listening on port 4000...");
        _this.mainScene = new mainScene_1.MainScene();
    });
}
exports.getServer = function () {
    return server ? server : null;
};
exports.getIo = function () {
    return io ? io : null;
};
startServer();
//# sourceMappingURL=server.js.map