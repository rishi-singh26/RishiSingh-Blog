import { z } from "zod"
// import { zfd } from "zod-form-data";

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export const addBlogSchema = z.object({
    title: z.string()
        .min(10, "Post title must have minimum 10 characters")
        .max(120, "Post title can have maximum 120 characters"),
    html: z.string()
        .min(10, "Post content must have minimum 10 characters")
        .max(65500, "Post content can have maximim 65500 characters"),
    thumbnailUrl: z.string().max(128), // /images/BlogWebOGPoster.png
    description: z.string().max(256, 'Description can not have more then 256 characters.'),
    canonicalUrl: z.string().max(256),
    isDraft: z.boolean({ message: 'Blog.isDraft can must be a boolean'}),
    tags: z.string().min(1).max(128),
});

// export const editPostSchema = z.object({
//     title: z.string()
//         .min(10, { message: "Title must be at least 10 characters." })
//         .max(120, { message: "Title must not be more then 120 characters" }),
//     content: z.string()
//         .min(10, { message: "Content must be at least 10 characters." })
//         .max(1000, { message: "Content must not be more then 120 characters" }),
//     image: z.any(),
// })

export const signupSchema = z
    .object({
        name: z.string()
            .min(3, 'Name should have atleast three characters')
            .max(30, 'Name can not have more then 30 characters'),
        email: z.string()
            .trim()
            .email('Please enter a valid email')
            .transform((email) => email.toLowerCase()),
        password: z.string()
            .trim()
            .min(8, 'Please enter a password with minimum 8 characters'),
        confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match", // Custom error message
        path: ['confirmPassword'], // Error will be attached to confirmPassword
    });

export const loginSchema = z
    .object({
        email: z.string()
            .trim()
            .email('Please enter a valid email')
            .transform((email) => email.toLowerCase()),
        password: z.string()
            .trim()
            .min(8, 'Please enter a password with minimum 8 characters'),
    });
