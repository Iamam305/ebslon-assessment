import { auth_middleware } from "@/middlewares/auth-middleware";
import { User } from "@/models/user.mdoel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";

const ImageSchema = z.object({
  image: z.instanceof(File).and(
    z.object({
      type: z
        .string()
        .regex(/^image\/(jpeg|png|gif|bmp|webp)$/, {
          message: "Invalid file type. Only images are allowed",
        })
        .optional(),
    })
  ),
});

export const POST = async (req: NextRequest) => {
  try {
    const auth = await auth_middleware(req);
    if (auth?.error !== null) {
      console.log(auth.error);
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    } else {
      const form_data = await req.formData();
      const image = ImageSchema.parse({
        image: form_data.get("image") as File,
      });
      const file_path = `download/${auth.data?.user.email}-${Date.now()}.${
        image.image.type.split("/")[1]
      }`;
      const file = fs.createWriteStream(file_path);
      

      const user_profile = {
        photo: file_path,
      };

      await User.updateOne(
        { email: auth.data?.user.email },
        { user_profile: file_path },
        { upsert: true }
      );

      return NextResponse.json(
        { msg: "Profile updated successfully" },
        { status: 200 }
      );
    }
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
