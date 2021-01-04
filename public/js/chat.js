const socket =io()

socket.on('message',(message)=>{
  console.log(message)
})
// socket.on('countupdated',(count)=>{
//   console.log('The count has been updated!',count)
// })
document.querySelector('#message-form').addEventListener('submit',(e)=>{
  e.preventDefault
})