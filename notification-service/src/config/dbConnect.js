
import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;

        if (!mongoUrl) {
            throw new Error("MONGODB_URL not defined");
        }

        await mongoose.connect(mongoUrl);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};
