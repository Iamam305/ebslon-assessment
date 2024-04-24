import { z } from "zod";

export const Login_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const register_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  user_name: z.string().min(3),
});

export const image_schema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine((value) => ['image/jpeg', 'image/png'].includes(value), {
    message: 'Only JPEG and PNG files are allowed',
  }),
  size: z.number().max(1024 * 1024, {
    message: 'File size must be less than 1MB',
  }),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  buffer: z.instanceof(Buffer),
});
