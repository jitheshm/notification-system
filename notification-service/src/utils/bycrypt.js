import bcrypt from 'bcryptjs'

const salt = 10
export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}
