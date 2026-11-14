import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const badgeSchema = z.object({
  icon: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      {
        message: "Max file size is 2MB.",
      },
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      {
        message: "Only .png, .jpg, and .webp formats are supported.",
      },
    ),
  name: z
    .string()
    .min(2, { message: "Badge name must be at least 2 characters." })
    .max(50, { message: "Badge name must not exceed 50 characters." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." })
    .max(250, { message: "Description must not exceed 250 characters." }),
  isActive: z.boolean().default(true),
});

export type BadgeFormData = z.infer<typeof badgeSchema>;
