import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
  signupOtpHash: String,
  signupOtpExpiresAt: Date,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
