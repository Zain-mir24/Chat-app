const socket =io()

socket.on('message',(message)=>{
  console.log(message)
})
// socket.on('countupdated',(count)=>{
//   console.log('The count has been updated!',count)
// })
document.querySelector('#increment').addEventListener('click',()=>{
    console.log('clicked')
    socket.emit('increment')
})