import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET

export const generateToken = (id,email) => {
    return jwt.sign({ id,email }, secret, { expiresIn: "1h" })
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null
    }
};
