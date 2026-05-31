import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const invalidCredentialMessage = "Invalid email or password";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: invalidCredentialMessage }, { status: 400 });
    }

    if (user.isEmailVerified === false) {
      return Response.json(
        { error: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    if (password !== user.password) {
      return Response.json({ error: invalidCredentialMessage }, { status: 400 });
    }

    return Response.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
