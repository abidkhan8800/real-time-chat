const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let users = {};

app.use('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket)=>{
    socket.on('new-user',(name)=>{
        console.log('New user Conneted ', name)
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })
    socket.on('chat-message', (msg)=>{
        console.log("Message ", msg)
        socket.broadcast.emit('chat-message', {msg: msg, name: users[socket.id]});
        // io.emit('chat-message', msg)
    })

    socket.on('disconnect', ()=>{
        console.log('User Disconnected', users[socket.id]);
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})
server.listen(3002, () =>{
    console.log("Server is running on port 3002")
})
