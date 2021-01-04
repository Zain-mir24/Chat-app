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
let message=""
 io.on('connection',(socket)=>{
     console.log('New websocket connection')
     socket.emit('message','welcome')
  
     socket.on('sendMessage',(message)=>{
         io.emit('message',message)
     })
 })

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})