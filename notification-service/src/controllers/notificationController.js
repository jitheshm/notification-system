import { publisher, redisClient, subscriber } from "../config/redisConnection.js";
import { io } from "../index.js";

const activeConnections = {};
let isSubscribed = false; // Flag to prevent multiple subscriptions

// Single subscription to Redis notifications channel
const subscribeToNotifications = () => {
    if (isSubscribed) return; // Only subscribe once to avoid multiple subscriptions

    subscriber.subscribe('notifications', (message) => {
        const notification = JSON.parse(message);

        // Check if the notification is for the specific user
        if (notification.userId) {

            if (activeConnections[notification.userId]) {
                io.to(activeConnections[notification.userId].socketId).emit('notification', notification);
            }

        } else {
            io.emit('notification', notification);
        }
    });

    isSubscribed = true; // Mark as subscribed
};

export const socketConnection = async (socket) => {
    console.log('A user connected:', socket.id);
    activeConnections[socket.userId] = {
        email: socket.userEmail,
        socketId: socket.id
    };

    // Handle offline notifications
    const notifications = await redisClient.lRange(`offline_notifications:${socket.userId}`, 0, -1);
    if (notifications.length > 0) {
        notifications.forEach(notification => {
            socket.emit('notification', JSON.parse(notification));
        });
        redisClient.del(`offline_notifications:${socket.userId}`); // Clear after sending
    }

    // Subscribe to notifications if not already done
    subscribeToNotifications();

    // Handle user disconnection
    socket.on('disconnect', () => {
        delete activeConnections[socket.userId];
        console.log('A user disconnected:', socket.id);
    });
};

export const broadcastController = async (req, res) => {
    try {
        const broadcastData = req.body;
        if (publisher.isOpen) {
            publisher.publish('notifications', JSON.stringify(broadcastData));

        } else {
            await publisher.connect();
            publisher.publish('notifications', JSON.stringify(broadcastData));

        }
        res.status(200).json({ success: true, message: 'Notification broadcasted successfully' });
    } catch (error) {
        console.error('Error broadcasting notification:', error);
        res.status(500).json({ success: false, message: 'Failed to broadcast notification' });

    }
}
