import UserModel from "../models/UserModel.js"
import { hashPassword } from "../utils/bycrypt.js";

const signupUser = async (req, res) => {
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



export default signupUser