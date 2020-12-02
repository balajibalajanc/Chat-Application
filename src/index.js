const path= require('path');
const http=require('http')
const express=require('express');
const socketio=require('socket.io');

const public_dir_path=path.join(__dirname,'../public');


const port=process.env.PORT || 3000
const app=express()
const server=http.createServer(app)
const io=socketio(server);


app.use(express.static(public_dir_path))
let count = 0

io.on('connection',(socket)=>{
   
    console.log("New connection is made");
        socket.emit('countUpdated',count);
        socket.on('increment',()=>{
            count++;
            socket.emit('countUpdated',count);

        })
    })
    

server.listen(port,()=>{   
    console.log("server is up and running in the port: "+port);
});
