# Welcome to Chat95 Backend

To start the server
### `node app.js` or `nodemon` 

## Endpoints (Express.js):

`/`

Returns 'HELLO!'

## Socket.io

### Events

`connection`
- On Socket connect 


`sendMessage`
- Emitted by Client
- Broadcasts the message to the room via `message`


`message`
- Emits message to room
- Client side

`create`
- On room create
- Assigns a room ID, assign name to socket.id
- Add user to user list

`join`
- On join room
- Assign name to socket.id
- Add user to user list


`disconnect`
- On socket disconnect
- if user exists, broadcast to user room that user has disconnected


