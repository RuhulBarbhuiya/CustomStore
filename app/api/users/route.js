// app/api/users/route.js

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

// GET request → fetch all users
export async function GET() {
  try {
    // connect to database
    await connectDB();

    // find all users
    const users = await User.find();

    // return users as response
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}