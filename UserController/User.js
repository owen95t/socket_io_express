const crypto = require('crypto-random-string')

let users = {}
//let rooms = {}

//CURRENT: MODEL FOR ONE USER CAN ONLY BE IN ONE ROOM ONLY

exports.addUser = ({name, room, socketID}) => {
    //let id = crypto({length: 5, type: 'distinguishable'});
    //console.log(id)

    // while (users[id]) {
    //     id = crypto({length: 5, type: 'distinguishable'})
    //     console.log(id)
    // }
    console.log('ADD USER: ROOMID: ' + room)
    if (!users[socketID]) {
        users[socketID] = {
            username: name.trim().toLowerCase(),
            room: room,
            socketID: socketID
        }
    }

    return users[socketID]
}

exports.joinRoom = ({name, socketID, room}) => {
    if(!users[socketID]) {
        users[socketID] = {
            username: name,
            room: room,
            socketID: socketID
        }
    }
    return users[socketID]
}

exports.createRoom = () => {
    return crypto({length: 6, type: 'distinguishable'})
}


exports.addToRoom = ({username, roomID}) => {

}
exports.removeUser = (socketID) => {
    if(users[socketID]){
        delete users.socketID
    }
}

exports.getUser = (socketID) => {
    return users[socketID]
}


// exports.addToRoom = ({username, roomID}) => {
//     if(rooms[roomID]){
//         rooms[roomID][1].push()
//     }
// }
