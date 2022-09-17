const express = require('express'),
    http = require('http'),
    https = require("https"),
    app = express(),
    // server = http.createServer(app),
    socketio = require('socket.io');
const PORT = process.env.PORT || 8080;
// io.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

let server;
if (process.env.SETUP_HOST === "https") {
    const SSL_DOMAIN = process.env.SSL_DOMAIN
    const privateKey = fs.readFileSync(
        "/etc/letsencrypt/live/" + SSL_DOMAIN + "/privkey.pem"
    );
    const certificate = fs.readFileSync(
        "/etc/letsencrypt/live/" + SSL_DOMAIN + "/fullchain.pem"
    );

    const ca = fs.readFileSync("/etc/letsencrypt/live/" + SSL_DOMAIN + "/cert.pem");

    server = https.createServer(
        {
            key: privateKey,
            cert: certificate,
            ca,
        },
        app
    );
} else {
    server = http.createServer(app);
}
const io = socketio(server);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
app.get('/', (req, res) => {

    res.send('Chat Server is running on port 3000')
});

io.on('connection', (socket) => {

    console.log('user connected ==========', socket.id)

    socket.on('join', function () {
        let userNickname = "uayaja";
        console.log(userNickname + " : has joined the chat ");

        socket.broadcast.emit('userjoinedthechat', userNickname + " : has joined the chat ");
    });


    socket.on('messagedetection', (senderNickname, messageContent) => {

        //log the message in console 

        console.log(senderNickname + " :" + messageContent)
        //create a message object 
        let message = { "message": messageContent, "senderNickname": senderNickname }
        // send the message to the client side  
        io.emit('message', message);

    });


    socket.on('disconnect', function () {
        console.log(' user has left ')
        socket.broadcast.emit("userdisconnect", " user has left ")

    });
});
