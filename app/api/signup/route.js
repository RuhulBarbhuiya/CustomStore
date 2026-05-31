import { connectDB } from "@/lib/mongodb";
import { sendOtpEmail } from "@/lib/mailer";
import User from "@/models/User";
import crypto from "crypto";

const OTP_EXPIRY_MINUTES = 10;

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

async function setSignupOtp(user) {
  const otp = generateOtp();
  user.signupOtpHash = hashOtp(otp);
  user.signupOtpExpiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );
  await user.save();

  await sendOtpEmail({
    to: user.email,
    otp,
    purpose: "signup",
  });
}

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (user?.isEmailVerified !== false) {
      if (user) {
        return Response.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      user = await User.create({
        name,
        email,
        password,
        isEmailVerified: false,
      });

      await setSignupOtp(user);

      return Response.json({
        message: "OTP sent to your email",
        otpRequired: true,
      });
    }

    if (!otp) {
      user.name = name;
      user.password = password;
      await setSignupOtp(user);

      return Response.json({
        message: "OTP sent to your email",
        otpRequired: true,
      });
    }

    const isOtpExpired =
      !user.signupOtpExpiresAt || user.signupOtpExpiresAt.getTime() < Date.now();

    if (!user.signupOtpHash || isOtpExpired || hashOtp(otp) !== user.signupOtpHash) {
      return Response.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    user.name = name;
    user.password = password;
    user.isEmailVerified = true;
    user.signupOtpHash = undefined;
    user.signupOtpExpiresAt = undefined;
    await user.save();

    return Response.json(
      {
        message: "User created successfully",
        user: {
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("SIGNUP_ERROR", error);

    return Response.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
