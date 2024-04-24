import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { User } from "@/models/user.mdoel";
import { connect_db } from "@/configs/db";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  user_name: z.string().min(3),
});
connect_db(process.env.MONGODB_URI!, {
  dbName: process.env.MONGODB_DB_NAME,
});
export const POST = async (req: NextRequest) => {
  try {
    const body = RegisterSchema.parse(await req.json());

    const user = await User.findOne({ email: body.email });

    if (user) {
      return NextResponse.json({ msg: "User already exists" }, { status: 400 });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);
      const new_user = await new User({
        user_name: body.user_name,
        email: body.email,
        password: hashedPassword,
      }).save();

      return NextResponse.json(
        { msg: "User created successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ msg: error.flatten().fieldErrors }, { status: 400 });
    } else {
      return NextResponse.json(
        { msg: "Something went wrong" },
        { status: 500 }
      );
    }
  }
};
