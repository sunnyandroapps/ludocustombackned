const { addUser, getUsersInRoom } = require("./users.controller");

const onNewWebsocketConnection = (socket) => {
    console.info(`Socket ${socket.id} has connected.`);
    socket.on('join', ({ name, room }, callback) => {
 
        const { error, user } = addUser(
            { id: socket.id, name, room });
 
        if (error) return callback(error);
 
        // Emit will send message to the user
        // who had joined
        socket.emit('message', { text: `${user.name}, welcome to room ${user.room}.` });
 
        // Broadcast will send message to everyone
        // in the room except the joined user
        socket.broadcast.to(user.room)
            .emit('message', { text: `${user.name}, has joined` });
 
        socket.join(user.room);
 
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback();
    })

    socket.on('roll_dice', ({ name, room }, callback) => {

    })
  
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message',
            { text:
            `${user.name} had left` });
        }
        // onlineClients.delete(socket.id);
        // console.info(`Socket ${socket.id} has disconnected.`);
    });
  
    // echoes on the terminal every "back_to_server" message this socket sends
    // will send a message only to this socket (different than using `io.emit()`, which would broadcast it)
    socket.on("back_to_server", msg => console.info(`Socket ${socket.id} says: "${msg}"`));
  }

  const getRandomNumberByRollingDice = () => {
    return Math.floor(Math.random()*6 + 1);
  }

  exports.onNewWebsocketConnection = onNewWebsocketConnection