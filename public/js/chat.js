const socket=io()

socket.on('connectionMade',(message)=>{
    console.log(message);

})
const weatherform=document.querySelector('#message-form');



 weatherform.addEventListener('submit',(e)=>{
     e.preventDefault();
     const message=e.target.elements.message
      socket.emit('sendMessage',message.value);
 })