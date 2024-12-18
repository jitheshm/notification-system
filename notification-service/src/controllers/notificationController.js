import { redisClient } from "../config/redisConnection.js";


const activeConnections = {}

export const socketConnection = async (socket) => {
    console.log('a user connected', socket.id);
    activeConnections[socket.userId] = socket.userEmail
    console.log(activeConnections)

    const notifications = await redisClient.lRange(`offline_notifications:${socket.userId}`, 0, -1);
    if (notifications.length > 0) {
        notifications.forEach(notification => {
            socket.emit('notification', JSON.parse(notification));
        });
        redisClient.del(`offline_notifications:${socket.userId}`);
    }



    redisClient.subscribe('notifications');
    redisClient.on('message', (channel, message) => {
        const notification = JSON.parse(message);

        // Check if the notification is for the specific user
        if (notification.userId) {
            if (notification.userId === socket.userId) {
                // Emit the notification only to the target user
                socket.emit('notification', notification);
            }
        } else {
            socket.emit('notification', notification);
        }

    });



    socket.on('disconnect', () => {
        delete activeConnections[socket.userId]
        console.log('a user disconnected');
    });
}