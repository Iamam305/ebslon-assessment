import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connect_db } from "@/configs/db";
import { User } from "@/models/user.mdoel";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

connect_db(process.env.MONGODB_URI!, {
  dbName: process.env.MONGODB_DB_NAME,
});

export const POST = async (req: NextRequest) => {
  try {
    const body = LoginSchema.parse(await req.json());

    const user = await User.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(body.password, user.password!);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const token = jwt.sign(
      { email: user.email, user_name: user.user_name },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: "2d",
      }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user: { email: user.email, name: user.user_name },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 2,
      // sameSite:true
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { msg: error.flatten().fieldErrors },
        { status: 400 }
      );
    } else {
      console.log(error);
      return NextResponse.json(
        { msg: "Something went wrong" },
        { status: 500 }
      );
    }
  }
};
