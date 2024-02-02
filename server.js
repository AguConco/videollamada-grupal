require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};


io.on('connection', socket => {


    socket.on("join room", ({ roomID, name }) => {

        socket.join(roomID);

        if (!users[roomID]) {
            users[roomID] = {};
        }

        if (!users[roomID][name]) {
            users[roomID][name] = name;
        }

        io.to(roomID).emit('all users', Object.values(users[roomID]));

    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        // if (users[id] && users[id][userId]) {
        //     delete users[id][userId];

        //     if (Object.keys(users[id]).length === 0) {
        //         delete users[id];
        //     }

        //     io.to(id).emit('users-online', users[id] ? Object.values(users[id]) : []);
        // }
    });

});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));


