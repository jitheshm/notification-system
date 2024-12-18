import { verifyToken } from "../utils/token.js";

export const authenticateSocket = (socket, next) => {
    const cookies = socket.request.headers.cookie;
    const token = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1] : null;
    // console.log(token)
    if (!token) {
        console.log("error")
        return next(new Error('Authentication error: No token provided.'));
    }

    const decoded = verifyToken(token)
    if (!decoded) {
        return next(new Error('Authentication error: Invalid token.'));
    }
    socket.userEmail=decoded.email
    socket.userId = decoded.id; // Assuming userId is stored in the token payload
    next();


};