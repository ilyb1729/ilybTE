"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This is just to setup a server to test
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(3000);
io.on("connection", (socket) => {
    socket.emit("hello", "zzz");
    socket.on("howdy", (arg) => {
        console.log(arg);
    });
});
//# sourceMappingURL=server.js.map