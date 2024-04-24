import { Router } from "express";
import {
  get_file,
  login,
  register,
  upload_image,
  user_info,
} from "../controllers/user.controller";
import {
  file_validator,
  validate_data,
} from "../middlewares/validation.middleware";
import {
  Login_schema,
  image_schema,
  register_schema,
} from "../libs/zod-schemas";
import { auth_middleware } from "../middlewares/auth.middlware";
import { upload } from "../libs/helpers";
import { s3_client } from "../configs/s3";

export const user_router = Router();

user_router.post("/register", validate_data(register_schema), register);
user_router.post("/login", validate_data(Login_schema), login);
user_router.get("/profile", auth_middleware, user_info);
user_router.post(
  "/profile/image",
  auth_middleware,
  upload.single("file"),
  file_validator,
  upload_image
);

user_router.get("/profile/image/", auth_middleware, get_file);
