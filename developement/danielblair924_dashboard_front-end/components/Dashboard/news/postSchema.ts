import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(120, { message: "Title must not exceed 120 characters." }),
  body: z
    .string()
    .min(10, { message: "Post content must be at least 10 characters long." }),
  coverImage: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      {
        message: "Max file size is 5MB.",
      },
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      {
        message: "Only .jpg, .png, and .webp formats are supported.",
      },
    ),
  publishDate: z.string().min(1, { message: "Please select a publish date." }),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
