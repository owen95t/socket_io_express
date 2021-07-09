const express = require('express');
const app = express()
const PORT = process.env.PORT || 4000
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(server, {transports: ['websocket']})
const helmet = require('helmet')

const UserController = require('./UserController/User')

//SETUP MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.use(helmet())
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
    //console.log(msg)
    let userID = socket.id
    const user = UserController.getUser(userID)
    if(!user){
      return
    }
    //console.log(user)
    socket.broadcast.to(user.room).emit('message', {user: user.username, message: msg})
  })

  socket.on('create', name => {
    console.log('CREATE BY: ' + name)
    //CREATE ROOM
    let room = UserController.createRoom()
    console.log('ROOMID: ' + room)
    //GET SOCKET ID
    let socketID = socket.id
    //SOCKET JOIN ROOM
    socket.join(room)
    //EMIT ROOM ID TO FRONTEND
    socket.emit('roomID', room)
    //SEND EVENT MESSAGE
    io.to(room).emit('event-message', `${name} has joined!`)
    UserController.addUser({name, room, socketID})
    //GET ALL CLIENTS IN ROOM

    let userList = []
    let users = io.sockets.adapter.rooms.get(room).entries();
    for (let user of users) {
      userList.push(UserController.getUser(user[0]).username)
    }
    socket.emit('user-list', userList)
  })

  socket.on('join', ({name, room}) => {
    console.log('JOIN! NAME: ' + name + ' Room ID: ' + room)
    let socketID = socket.id
    UserController.addUser({name, room, socketID})
    //let user = UserController.joinRoom({name, socketID, roomID})
    socket.join(room)
    io.to(room).emit('event-message', `${name} has joined!`)
    //List all user by their socketid
    //users is a set

    let userList = []
    let users = io.sockets.adapter.rooms.get(room).entries();
    for (let user of users) {
      userList.push(UserController.getUser(user[0]).username)
    }
    io.to(room).emit('user-list', userList)
  })

  socket.on('disconnect', () => {
    let user = UserController.getUser(socket.id)
    if (user) {
      io.to(user.room).emit('event-message', `${user.username} has left`);
    }
    console.log(socket.id + ' disconnected')
    UserController.removeUser(socket.id)

  })
})


//LISTEN
server.listen(PORT, () => {
  console.log('ALIVE ON PORT 4000')
})

