import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connect_db } from "@/configs/db";

import mongoose from "mongoose";
import { User } from "@/models/user.mdoel";

export const auth_middleware = async (request: NextRequest) => {
  try {
    let token: string;
    if (request.headers.get("token")) {
      token = request.headers.get("token") as string;
    } else {
      token = request.cookies.get("token")?.value as string;
    }
    // const token = request.cookies.get("token")?.value || request.headers.get("token") as string;
    const decoded_toekn: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const user = await User.findOne({ email: decoded_toekn.email }).select(
      "-password -__v -createdAt -updatedAt"
    );
    if (user) {
      return { data: { user }, error: null };
    } else {
      return { data: null, error: "User does not exists" };
    }
  } catch (error: any) {
    console.log(error);

    return { data: null, error: error };
  }
};
