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
const {addUser,removeUser,getUser,getUsersInRoom}= require('./utils/users')

io.on('connection',(socket)=>{

    socket.on('join',(options,callback)=>{      
            const {error,user}=addUser({id:socket.id,...options});
            if(error)
                { return callback(error)}
            
            socket.join(user.room)
            
            //Welcome Message emitted from server to the client
            socket.emit('connectionMade',generateMessage('Admin','Welcome to the MoodBoard Chat Application'));

            //New User joind message to all the rest of the client in the server
            socket.broadcast.to(user.room).emit('connectionMade',generateMessage('Admin',`${user.username}  joined`));
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })

            callback(); 
    })


    socket.on('sendMessage',(sentFromClient,callback)=>{
            const {username,room}=getUser(socket.id);
           
            const filter= new Filter();
            if(filter.isProfane(sentFromClient))
            {
                return callback("profanity is not allowed")
            }
            //sending the message to all the client in the server from a user
             io.to(room).emit('connectionMade',generateMessage(username,sentFromClient));
            callback();
            })

    socket.on('sendLocation',(coords,callback)=>{
            const {username,room}=getUser(socket.id);
            //io.emit('connectionMade',`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`);
            io.to(room).emit('locationMessage',generateLocationMessage(username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
            callback();
         })

    socket.on('disconnect',()=>{

            const user=removeUser(socket.id);
            if(user){ 
             // User left message to all the rest of the client in the server
            io.to(user.room).emit('connectionMade',generateMessage('Admin',`${user.username} has left`));
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
            }
        })



    
    })
    

server.listen(port,()=>{   
    console.log("server is up and running in the port: "+port);
});
