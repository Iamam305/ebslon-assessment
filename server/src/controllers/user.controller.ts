import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.mdoel";
import crypto from "crypto";
import multer from "multer";
import { s3_client } from "../configs/s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import stream from "stream";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const new_user = await new User({
      user_name: req.body.user_name,
      email: req.body.email,
      password: hashedPassword,
    }).save();
    return res.json({ msg: "User created successfully", user: new_user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password!
    );

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { email: user.email, user_name: user.user_name },
      process.env.TOKEN_SECRET!,
      { expiresIn: "2d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 2, // 2 days
      // sameSite: true,
    });
    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        email: user.email,
        name: user.user_name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: "Logout Successful" });
  } catch (error) {
    next(error);
  }
};
export const user_info = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_info = await User.findOne({ email: req.user.email }).select(
      "-password -__v -createdAt -updatedAt"
    );
    res.json({ user_info });
  } catch (error) {
    next(error);
  }
};
export const upload_image = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const file_name = `${crypto
      .randomBytes(16)
      .toString("hex")}.${req.file?.originalname.split(".").pop()}`;
    const data = await s3_client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: file_name,
        Body: req.file?.buffer as Buffer,
        ACL: "public-read",

        ContentType: req.file?.mimetype,
      })
    );
    const updated_user = await User.updateOne(
      {
        email: req.user.email,
      },
      {
        user_profile: file_name,
      },
      {
        upsert: true,
      }
    );
    res.json({
      message: "file uploaded siccesfully",
      file_name,
      data,
      updated_user,
    });
  } catch (error) {
    next(error);
  }
};

export const get_file = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const key = req.params.key;
    // const bucketName = 'your-s3-bucket-name';
    const file_key = req.user?.user_profile
      ? req.user.user_profile
      : "a26ed899344c676ba2e4c5f8eee64c8b.png";
    const getObjectParams = {
      Bucket: process.env.S3_BUCKET,
      Key: file_key,
    };

    const data = await s3_client.send(new GetObjectCommand(getObjectParams));

    res.attachment(file_key); // Set the response header for file download
    res.set("Content-Type", data.ContentType); // Set the appropriate content type

    // Convert the Body to a readable stream
    const bodyStream =
      data.Body instanceof stream.Readable
        ? data.Body
        : new stream.PassThrough().end(data.Body);

    bodyStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve file from S3" });
  }
};
