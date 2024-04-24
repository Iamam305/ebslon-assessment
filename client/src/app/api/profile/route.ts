import { connect_db } from "@/configs/db";
import { auth_middleware } from "@/middlewares/auth-middleware";

import { User } from "@/models/user.mdoel";

import { NextRequest, NextResponse } from "next/server";

connect_db(process.env.MONGODB_URI!, {
  dbName: process.env.MONGODB_DB_NAME,
});

export async function GET(req: NextRequest) {
  try {
    const auth = await auth_middleware(req);
    if (auth?.error !== null) {
      console.log(auth.error);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    } else {
      

      return NextResponse.json({ user: auth.data?.user }, { status: 200 });
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
  }
}
