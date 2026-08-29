import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return Response.json(
        { message: "user already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { message: "user successfully created" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error.message);
    return Response.json(
      { message: "failed to signup" },
      { status: 500 }
    );
  }
}