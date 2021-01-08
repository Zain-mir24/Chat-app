const path = require('path')
const express= require('express')
const socketio = require('socket.io')
const http = require('http')
const app = express()
const server =http.createServer(app)
const io=socketio(server)
const Filter = require('bad-words')
const {generateMessage,generateLocationurl}=require('./utils/messages')
const port= process.env.PORT|| 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath)) 

  io.on('connection',(socket)=>{      
    socket.on('join',({username,room})=>{
       socket.join(room)
       console.log('New websocket connection')
       socket.emit('message',generateMessage('Welcome!'))
       socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined`))
        
        //socket.emit, io.emit , socket.broadcast.emit
        //io.to.emit  socket.broadcast.to.emit

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
         io.emit('message',generateMessage('user has let the chat'))
     })
     socket.on('sendLocation',(coords,callback)=>{
         io.emit('locationmessage',generateLocationurl(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
     })
 })

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})