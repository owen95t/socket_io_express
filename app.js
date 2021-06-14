const express = require('express');
const app = express()
const PORT = process.env.PORT || 4000
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(server, {transports: ['websocket']})

const UserController = require('./UserController/User')

//SETUP MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.set('json spaces', 2)

//SETUP ROUTES
app.get('/', (req, res) => {
  res.send('HELLO!')
})

//SETUP SOCKET.IO
io.on('connection', (socket) => {
  console.log('a user connected!')
  // for (let [id, socket] of io.of("/").sockets) {
  //   console.log(id)
  // }
  // console.log(socket.handshake.query)
  console.log('ID: ' + socket.id)

  socket.on('sendMessage', (msg) => {
    console.log(msg)
    let userID = socket.id
    const user = UserController.getUser(userID)
    if(!user){
      return
    }
    io.to(user.room).emit('message', {user: user.username, text: msg})

    //io.emit('message', msg)
  })

  socket.on('create', name => {
    console.log('CREATE BY: ' + name)
    let newRoom = UserController.createRoom()
    let socketID = socket.id
    socket.join(newRoom)
    socket.emit('roomID', newRoom)
    io.to(newRoom).emit('message', `${name} has joined!`)
    UserController.addUser({name, newRoom, socketID})
  })

  socket.on('join', ({name, roomID}) => {
    console.log('JOIN\nNAME: ' + name + '\nRoom ID: ' + roomID)
    let socketID = socket.id
    //let user = UserController.joinRoom({name, socketID, roomID})
    socket.join(roomID)
    io.to(roomID).emit('message', `${name} has joined`)
    UserController.addUser({name, roomID, socketID})
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
    const socketID = socket.id
    UserController.removeUser(socketID)
  })
})


//LISTEN
server.listen(PORT, () => {
  console.log('ALIVE ON PORT 4000')
})

