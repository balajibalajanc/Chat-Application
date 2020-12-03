const socket=io()

socket.on('connectionMade',(message)=>{
    console.log(message);

})
const weatherform=document.querySelector('#message-form');



 weatherform.addEventListener('submit',(e)=>{
     e.preventDefault();
     const message=e.target.elements.message
      socket.emit('sendMessage',message.value,(error)=>{
          if(error)
          {
              return console.log(error);
          }
          console.log("Message delivered");
      });
 })

 document.querySelector('#send-location').addEventListener('click',()=>{
     if(!navigator.geolocation)
     {
         return alert('Sorry geolocation is not supported');
     }
     navigator.geolocation.getCurrentPosition((position)=>{
         console.log(position);
         
         socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log("Location Shared");
        });
     })

 })