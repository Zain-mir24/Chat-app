const socket =io()

socket.on('message',(message)=>{
  console.log(message)
})

document.querySelector('#Message-form').addEventListener('submit',(e)=>{
  e.preventDefault()
  const message= e.target.elements.message.value
  socket.emit('sendMessage',message,()=>{
    console.log('The essage was delivered!')
  })
})

document.querySelector('#send-Location').addEventListener('click',()=>{
  if(navigator.geolocation){
    return alert('GeoLocation is not supported by your browser')
  }
navigator.geolocation.getCurrentPosition((position)=>{
  
  socket.emit('sendLocation',{  
    latitude:position.coords.latitude,
    longitude:position.coords.longitude
  })
})

})