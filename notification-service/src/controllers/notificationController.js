import { publisher, redisClient, subscriber } from "../config/redisConnection.js";
import { io } from "../index.js";

const activeConnections = {};
let isSubscribed = false; // Flag to prevent multiple subscriptions

/**
 * Subscribes to the Redis 'notifications' channel to listen for notification messages.
 * Ensures a single subscription to avoid duplicate subscriptions.
 */
const subscribeToNotifications = () => {
    // Prevent multiple subscriptions
    if (isSubscribed) return;

    // Subscribe to the 'notifications' channel
    subscriber.subscribe('notifications', (message) => {
        const notification = JSON.parse(message); // Parse the incoming message

        // Check if the notification is targeted to a specific user
        if (notification.userId) {
            // If the user is connected, send the notification to their socket
            if (activeConnections[notification.userId]) {
                io.to(activeConnections[notification.userId].socketId).emit('notification', { message: notification.message });
            }
        } else {
            // Broadcast the notification to all connected sockets
            io.emit('notification', notification);
        }
    });

    // Mark as subscribed to prevent re-subscribing
    isSubscribed = true;
};




/**
 * Handles a new socket connection from a user.
 * @param {Socket} socket - The connected socket object.
 */
export const socketConnection = async (socket) => {
    try {
        console.log('A user connected:', socket.id);

        // Store active connection info
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
            await redisClient.del(`offline_notifications:${socket.userId}`); // Clear after sending
        }

        // Subscribe to notifications if not already done
        subscribeToNotifications();

        // Handle user disconnection
        socket.on('disconnect', () => {
            delete activeConnections[socket.userId];
            console.log('A user disconnected:', socket.id);
        });

    } catch (error) {
        console.error('Error in socket connection:', error.message);
        socket.emit('error', { message: 'Something went wrong, please try again later.' });
    }
};


/**
 * Handles broadcasting a notification to all connected users.
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The response object.
 */
export const broadcastController = async (req, res) => {
    try {
        const broadcastData = req.body;

        // Check if the publisher is connected before publishing
        if (publisher.isOpen) {
            // Publish the notification to the 'notifications' channel
            publisher.publish('notifications', JSON.stringify(broadcastData));
        } else {
            // Connect to the publisher if it's not already connected
            await publisher.connect();
            // Publish the notification to the 'notifications' channel
            publisher.publish('notifications', JSON.stringify(broadcastData));
        }

        res.status(200).json({ success: true, message: 'Notification broadcasted successfully' });
    } catch (error) {

        console.error('Error broadcasting notification:', error);
        res.status(500).json({ success: false, message: 'Failed to broadcast notification' });
    }
}

/**
 * Handles sending a notification to a specific user.
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The response object.
 */
export const targetNotificationController = async (req, res) => {
    try {
        const { userId, message } = req.body;

        // Get the target user's socket
        const targetUserSocket = activeConnections[userId];

        // Build the notification object
        const notification = { userId, message };

        if (targetUserSocket) {
            // If the user is connected, publish the notification to the 'notifications' channel
            await publisher.publish('notifications', JSON.stringify(notification));
        } else {
            // If the user is offline, store the notification in Redis
            await redisClient.rPush(`offline_notifications:${userId}`, JSON.stringify(notification));
        }

        // Return a success response
        res.status(200).json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        // Return an error response
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
}

/**
 * Returns a list of active users and their user IDs.
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The response object.
 */
export const fetchActiveUsers = (req, res) => {
    try {
        // Get the active user list from memory
        const activeUsers = Object.entries(activeConnections).map((user) => ({
            // Extract the email and userId from the user object
            email: user[1].email,
            userId: user[0]
        }));

        // Send the active user list as a response
        res.status(200).json({ success: true, data: activeUsers });
    } catch (error) {
        // Handle any errors that occur during the fetch
        res.status(500).json({ success: false, message: "failed to fetch active users" });
    }
}
