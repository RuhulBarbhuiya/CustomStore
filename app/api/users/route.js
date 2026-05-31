
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

//fetch all users
export async function GET() {
  try {
   
    await connectDB();

    const users = await User.find();

    // return users as response
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}