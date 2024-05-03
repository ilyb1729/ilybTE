// This is just to setup a server to test
import { Server } from "socket.io";

const io = new Server(3000);

io.on("connection", (socket) => {
    socket.emit("hello", "zzz");

    socket.on("howdy", (arg) => {
        console.log(arg);
    });
});
