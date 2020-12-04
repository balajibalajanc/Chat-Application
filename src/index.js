const path= require('path');
const http=require('http')
const express=require('express');
const socketio=require('socket.io');

//set the public static path for html css client js
const public_dir_path=path.join(__dirname,'../public');

//port for the express to host
const port=process.env.PORT || 3000
const app=express()
const server=http.createServer(app)
const io=socketio(server);
const Filter=require('bad-words');
const {generateMessage,generateLocationMessage}=require('./utils/message')
app.use(express.static(public_dir_path))


io.on('connection',(socket)=>{
   
    //Welcome Message emitted from server to the client
    socket.emit('connectionMade',generateMessage('Welcome to the MoodBoard Chat Application'));
    //New User joind message to all the rest of the client in the server
    socket.broadcast.emit('connectionMade',generateMessage('A new User hae been joined'));
        socket.on('sendMessage',(sentFromClient,callback)=>{
            const filter= new Filter();
            if(filter.isProfane(sentFromClient))
            {
                return callback("profanity is not allowed")
            }
            //sending the message to all the client in the server from a user
             io.emit('connectionMade',generateMessage(sentFromClient));
            callback();
         })

         socket.on('sendLocation',(coords,callback)=>{
            //io.emit('connectionMade',`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`);
            io.emit('locationMessage',generateLocationMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
            callback();
         })

         socket.on('disconnect',()=>{
             // User left message to all the rest of the client in the server
            io.emit('connectionMade',generateMessage('A user has been left from the group'));
        })
    })
    

server.listen(port,()=>{   
    console.log("server is up and running in the port: "+port);
});
