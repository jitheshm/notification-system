import UserModel from "../models/UserModel.js"
import { hashPassword, verifyPassword } from "../utils/bycrypt.js";
import { generateToken } from "../utils/token.js";

/**
 * Handles a new user signup.
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The response object.
 */
export const signupUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        const userExist = await UserModel.findOne({ email: email });

        // Handle user already exists error
        if (userExist)
            return res
                .status(400)
                .json({ success: false, message: "user already exist" });

        // Hash the password using bcrypt
        password = await hashPassword(password);

        // Create a new user
        const user = new UserModel({ email, password });

        // Save the user to the database
        await user.save();

        // Return a success response
        res
            .status(201)
            .json({ success: true, message: "user signup successfully" });
    } catch (error) {
        // Handle any errors that occur during the signup
        res.status(500).json({ message: "Failed to sign up user" })
    }
}

/**
 * Handles an existing user login.
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The response object.
 */
export const loginUser = async (req, res) => {
    try {
        // Extract the email and password from the request body
        let { email, password } = req.body;

        // Check if the user exists
        const userExist = await UserModel.findOne({ email: email });
        if (!userExist) {
            // If the user doesn't exist, return an unauthorized response
            return res
                .status(401)
                .json({ success: false, message: "email or password is incorrect" });
        }

        // Verify the password using bcrypt
        const isMatch = await verifyPassword(password, userExist.password);
        if (!isMatch) {
            // If the password is incorrect, return an unauthorized response
            return res
                .status(401)
                .json({ success: false, message: "email or password is incorrect" });
        }

        // Generate a JWT token using the user's ID and email
        const token = generateToken(userExist._id, userExist.email);

        // Set the JWT token as a cookie in the response
        res.cookie("token", token, { sameSite: "lax" });

        // Return a success response
        res
            .status(200)
            .json({ success: true, message: "user login successfully" });
    } catch (error) {
        // Handle any errors that occur during the login
        console.log(error);
        res.status(500).json({ success: false, message: "user login failed" });
    }
}



