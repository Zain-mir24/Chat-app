const path = require('path')
const express= require('express')
const socketio = require('socket.io')
const http = require('http')
const app = express()
const server =http.createServer(app)
const io=socketio(server)
const Filter = require('bad-words')
const {generateMessage,generateLocationurl}=require('./utils/messages')
const {adduser,removeuser,  getusersinroom,getuser} =require('./utils/users')
const { Socket } = require('dgram')
const port= process.env.PORT|| 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath)) 

  io.on('connection',(socket)=>{      
    socket.on('join',({username,room},callback)=>{
      const {error,user} = adduser({id:Socket.id,username,room})
      if(error){
         return callback(error)
      }
       socket.join(user.room)
       console.log('New websocket connection')
       socket.emit('message',generateMessage('Welcome!'))
       socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`))
       callback()
        
        

    })
    socket.on('sendMessage',(message,callback)=>{
   const filter = new Filter();
   if(filter.isProfane(message)){
       return callback('Profanity is not allowed')
   }

         io.to('1').emit('message',generateMessage(message))
         callback()
     })

     socket.on('disconnect',()=>{
        const user= removeuser(Socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left the chat`))
        }
    
     })
     socket.on('sendLocation',(coords,callback)=>{
         io.emit('locationmessage',generateLocationurl(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
     })
 })

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})