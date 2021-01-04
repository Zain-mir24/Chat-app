const path = require('path')
const express= require('express')
const socketio = require('socket.io')
const http = require('http')
const app = express()
const server =http.createServer(app)
const io=socketio(server)
const port= process.env.PORT|| 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath)) 

 io.on('connection',(socket)=>{
     console.log('New websocket connection')
     socket.emit('message','welcome')
     socket.broadcast.emit('message','A new user has joined')
  
     socket.on('sendMessage',(message)=>{
         io.emit('message',message)
     })

     socket.on('disconnect',()=>{
         io.emit('message','user has left the chat')
     })
 })

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})