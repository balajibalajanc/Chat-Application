const socket=io()

const $messageform=document.querySelector('#message-form');
const $messageforminput=$messageform.querySelector('input');
const $messageformbutton=$messageform.querySelector('button');
const $sendlocationbutton=document.querySelector('#send-location')
const $message=document.querySelector('#messages')
const $messageTemplate=document.querySelector('#message-template').innerHTML


socket.on('connectionMade',(message)=>{
    console.log(message);
    const html=Mustache.render($messageTemplate,{
        message
    })
    $message.insertAdjacentHTML('beforeend',html)
})

 $messageform.addEventListener('submit',(e)=>{
     e.preventDefault();
     $messageformbutton.setAttribute('disabled','disabled')
     const message=e.target.elements.message
      socket.emit('sendMessage',message.value,(error)=>{
          $messageformbutton.removeAttribute('disabled');
          $messageforminput.value=''
          $messageforminput.focus();
          if(error)
          {
              return console.log(error);
          }
          console.log("Message delivered");
      });
 })

 $sendlocationbutton.addEventListener('click',()=>{
     if(!navigator.geolocation)
     {
         return alert('Sorry geolocation is not supported');
     }
     $sendlocationbutton.setAttribute('disabled','disabled')
     navigator.geolocation.getCurrentPosition((position)=>{
         console.log(position);
         
         socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendlocationbutton.removeAttribute('disabled');
            console.log("Location Shared");
        });
     })

 })