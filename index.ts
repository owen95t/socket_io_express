import express from 'express';
const index = express()
const PORT = process.env.PORT || 4000
import * as server from 'http'
const HTTPServer = server.createServer(index)
import { Server } from "socket.io";
import helmet from "helmet";

import * as UserController from './User/UserController';
import UserMap from "./User/UserMap";
import {User} from "./User/UserInterface";

//SETUP MIDDLEWARE
index.use(express.json());
index.use(express.urlencoded({
  extended: true
}))
index.use(helmet())
index.set('json spaces', 2)

//SETUP ROUTES
index.get('/', (req, res) => {
  res.send('HELLO!')
})

const userMap = new UserMap();

const io = new Server(HTTPServer, {transports: ['websocket']})

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
    const user = UserController.getUser(userID, userMap)
    if (!user) {
      return
    }
    //console.log(user)
    socket.broadcast.to(user.room).emit('message', {user: user.name, message: msg})
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
    UserController.addUser({name, room, socketID}, userMap)
    //GET ALL CLIENTS IN ROOM

    let userList = []
    let users = io.sockets.adapter.rooms.get(room)?.entries();
    if (users !== undefined && users.next()) {
      for (let user of users) {
        if (UserController.getUser(user[0], userMap) !== undefined) {
          userList.push(UserController.getUser(user[0], userMap)!.name);
        }
      }
    }
    socket.emit('user-list', userList)
  })

  socket.on('join', ({name, room}) => {
    console.log('JOIN! NAME: ' + name + ' Room ID: ' + room)
    let socketID = socket.id
    UserController.addUser({name, room, socketID}, userMap)
    // let user = User.joinRoom({name, socketID, roomID})
    socket.join(room)
    io.to(room).emit('event-message', `${name} has joined!`)
    // List all user by their socketid
    // users is a set

    let userList = []
    let users = io.sockets.adapter.rooms.get(room)?.entries();
    if (users !== undefined && users?.next()) {
      for (let user of users) {
        userList.push(UserController.getUser(user[0], userMap)!.name)
      }
    }
    io.to(room).emit('user-list', userList)
  })

  socket.on('disconnect', () => {
    let user = UserController.getUser(socket.id, userMap)
    if (user) {
      io.to(user.room).emit('event-message', `${user.name} has left`);
    }
    console.log(socket.id + ' disconnected')
    UserController.removeUser(socket.id, userMap)

  })
})



//LISTEN
HTTPServer.listen(PORT, () => {
  console.log('ALIVE ON PORT 4000')
})

