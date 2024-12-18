import UserModel from "../models/UserModel.js"
import { hashPassword, verifyPassword } from "../utils/bycrypt.js";
import { generateToken } from "../utils/token.js";

export const signupUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        const userExist = await UserModel.findOne({ email: email });

        if (userExist)
            return res
                .status(400)
                .json({ success: false, message: "user already exist" });

        password = await hashPassword(password);
        const user = new UserModel({ email, password });
        await user.save();
        res
            .status(201)
            .json({ success: true, message: "user signup successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to sign up user" })
    }
}

export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        const userExist = await UserModel.findOne({ email: email });
        if (!userExist)
            return res
                .status(401)
                .json({ success: false, message: "email or password is incorrect" });

        const isMatch = await verifyPassword(password, userExist.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "email or password is incorrect" });

        const token = generateToken(userExist._id);
        res.cookie("token", token, { sameSite: "lax" });
        res
            .status(200)
            .json({ success: true, message: "user login successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "user login failed" });
    }
}



