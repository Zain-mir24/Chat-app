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
       socket.emit('message',generateMessage('Admin','Welcome!'))
       socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`))
       io.to(user.room).emit('roomData',{
           room:user.room,
           users:getusersinroom(user.room)
       })
       callback()
        
        

    })
    socket.on('sendMessage',(message,callback)=>{
   const filter = new Filter();
    const user=getuser(Socket.id)

   if(filter.isProfane(message)){
       return callback('Profanity is not allowed')
   }

         io.to(user.room).emit('message',generateMessage(user.username,message))
         callback()
     })

     socket.on('disconnect',()=>{
        const user= removeuser(Socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left the chat`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getusersinroom(user.room)
            })
        }
    
     })
     socket.on('sendLocation',(coords,callback)=>{
         const user= getuser(Socket.id)
         io.emit('locationmessage',generateLocationurl(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
     })
 })

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})