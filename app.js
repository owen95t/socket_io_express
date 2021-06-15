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
    console.log(user)
    io.to(user.room).emit('message', {user: user, message: msg})

    //io.emit('message', msg)
  })

  socket.on('create', name => {
    console.log('CREATE BY: ' + name)
    let room = UserController.createRoom()
    console.log('ROOMID: ' + room)
    let socketID = socket.id
    socket.join(room)
    socket.emit('roomID', room)
    io.to(room).emit('event-message', `${name} has joined!`)
    UserController.addUser({name, room, socketID})
  })

  socket.on('join', ({name, room}) => {
    console.log('JOIN! NAME: ' + name + ' Room ID: ' + room)
    let socketID = socket.id
    //let user = UserController.joinRoom({name, socketID, roomID})
    socket.join(room)
    io.to(room).emit('message', `${name} has joined`)
    UserController.addUser({name, room, socketID})
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

