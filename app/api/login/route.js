import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User"; 

// handles POST request
export async function POST(req) {
  try {
    // email and password from frontend
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // ✅ simple comparison (plain text)
    if (password !== user.password) {
      return Response.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    return Response.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}