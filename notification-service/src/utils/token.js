import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET

export const generateToken = (id) => {
    return jwt.sign({ id }, secret, { expiresIn: "1h" })
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null
    }
};
