import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";


export async function POST(req) {
  try {

    await connectDB();

    // get data from frontend
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      email,
      password: password, 
    });

    // success response
    return Response.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );

  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}