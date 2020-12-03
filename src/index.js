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


app.use(express.static(public_dir_path))


io.on('connection',(socket)=>{
   
    //console.log("New connection to Moodboard Chat Application");
    socket.emit('connectionMade','Welcome to the MoodBoard Chat Application');
    socket.broadcast.emit('connectionMade','A new User hae been joined');
        socket.on('sendMessage',(sentFromClient)=>{
             io.emit('connectionMade',sentFromClient);
  
         })

         socket.on('disconnect',()=>{
            io.emit('connectionMade','A user has been left from the group');
        })
    })
    

server.listen(port,()=>{   
    console.log("server is up and running in the port: "+port);
});
