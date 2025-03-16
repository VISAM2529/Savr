import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // ✅ Make password optional
  image: { type: String }, // Store Google profile picture
  isGoogleUser: { type: Boolean, default: false }, // ✅ Flag to track Google users
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
