const io = require('socket.io')(3000)
const users = {};

io.on("connection", (socket) => {
    socket.on("new-user", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', users[socket.id]);
    });

    socket.on("typing", (boolean) => {
        if (boolean) {
            socket.broadcast.emit("user-typing", `${users[socket.id]} is typing`);
        } else {
            socket.broadcast.emit("user-typing", false);
        }
    });

    socket.on("send-online-users", () => {
        socket.emit("get-online-users", users);
    });

    socket.on("send-message", (message) => {
        socket.broadcast.emit('send-target-chat', { message: message, name: users[socket.id] });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});

