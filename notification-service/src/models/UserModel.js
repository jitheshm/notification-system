
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;


