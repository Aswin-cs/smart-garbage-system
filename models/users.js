import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['cleaner', 'driver'] }
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

