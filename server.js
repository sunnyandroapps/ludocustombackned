const express = require('express');
const path = require('path');
const WebSocket = require('ws'); // new
const app = express();
// express code 
const socketServer = new WebSocket.Server({port: 1234});
socketServer.on('connection', (socketClient) => {
  console.log('connected');
  console.log('client Set length: ', socketServer.clients.size);
  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});