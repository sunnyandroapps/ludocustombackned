const express = require("express");
const cors = require("cors");
require('dotenv').config()
const http = require("http")
const socketio = require("socket.io")
const { addUser, getUsersInRoom } = require("./app/controllers/users.controller");


const app = express();
const server = http.createServer(app)
const io = socketio(server);

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Database Connection
const db = require("./app/models");
// const { onNewWebsocketConnection } = require("./app/controllers/socket.controller");
/*db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });*/

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ludo application." });
});
require("./app/routes/rolldice.routes")(app);

// Socket Connection
io.on("connection", onNewWebsocketConnection);

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

    socket.on('roll_dice', () => {
        const steps = getRandomNumberByRollingDice();
        io.to(user.room).emit('roll_dice', {
          steps
      });
    })
  
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message',
            { text: `${user.name} had left` });
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

  // set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});