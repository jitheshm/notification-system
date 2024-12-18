

const activeConnections={}

export const socketConnection = (socket) => {
    console.log('a user connected', socket.id);
    // activeConnections[]

    socket.emit('message', 'Hello from server!');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
}