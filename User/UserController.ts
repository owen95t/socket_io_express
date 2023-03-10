// import('crypto-random-string').then().catch();
import UserMap from "./UserMap";
import {User} from "./UserInterface";

//CURRENT: MODEL FOR ONE USER CAN ONLY BE IN ONE ROOM ONLY

export const addUser = ({name, room, socketID}: User, map: UserMap): void => {
    console.log('ADD USER: ROOMID: ' + room)
    // const uuid = crypto({
    //     length: 8,
    //     type: 'distinguishable'
    // })
    map.add(socketID, {
        name: name.trim().toLowerCase(),
        room,
        socketID,
    })
    // if (!users[socketID]) {
    //     users[socketID] = {
    //         username: name.trim().toLowerCase(),
    //         room: room,
    //         socketID: socketID
    //     }
    // }
    // return users[socketID]
    // return map.get(socketID)
}

// export const joinRoom = ({username, socketID, room}: User, map: UserMap) => {
//     if(!users[socketID]) {
//         users[socketID] = {
//             username: name,
//             room: room,
//             socketID: socketID
//         }
//     }
//     return users[socketID]
// }

export const createRoom = (): string => {
    const length = 6;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


export const removeUser = (socketID: string, map: UserMap) => {
    // if(users[socketID]){
    //     delete users.socketID
    // }
    map.remove(socketID);
}

export const getUser = (socketID: string, map: UserMap) => {
    // return users[socketID]
    return map.get(socketID)
}
