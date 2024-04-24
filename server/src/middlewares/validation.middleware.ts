import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { image_schema } from "../libs/zod-schemas";

export const validate_data =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };

type ValidatedFile = z.infer<typeof image_schema> | { error: ZodError };
export const file_validator = (req: Request, res: Response, next: NextFunction) => {
  // Check if the request has files
  if (!req.files || req.files.length === 0) {
    return next();
  }

  // Validate each file using Zod schema
  const validated_files: ValidatedFile[] = (
    req.files as Express.Multer.File[]
  ).map((file) => {
    const validated_file = image_schema.safeParse(file);
    if (!validated_file.success) {
      return { error: validated_file.error };
    }
    return validated_file.data;
  });

  // Check if any file has validation errors
  const has_errors = validated_files.some(
    (file): file is { error: ZodError } => "error" in file
  );
  if (has_errors) {
    const errors = validated_files.flatMap((file) =>
      "error" in file ? file.error.formErrors : []
    );
    return res.status(400).json({ errors });
  }

  // Replace the original files with the validated files
  req.files = validated_files.filter(
    (file): file is z.infer<typeof image_schema> => !("error" in file)
  ) as Express.Multer.File[];

  next();
};
