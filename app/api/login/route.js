import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User"; 
import bcrypt from "bcryptjs"; 

// handles POST request
export async function POST(req) {
  try {
    //email and password from frontend
    const { email, password } = await req.json();


    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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