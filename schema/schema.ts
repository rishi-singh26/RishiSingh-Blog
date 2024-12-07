import z, { ZodEffects, ZodObject, ZodSchema } from "zod";

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const postSchema = z.object({
    title: z.string().min(10, "Post title must have minimum 10 characters").max(
        120,
        "Post title can have maximum 120 characters",
    ),
    content: z.string().min(10, "Post content must have minimum 10 characters")
        .max(1000, "Post content can have maximim 100 characters"),
    // image: z.any()
    //     .refine((file) => {
    //         console.log(file);
    //         return file instanceof File;
    //     }, { message: "Invalid file format" })
    //     .refine((file) => file && file.originalname, { message: 'File is required' })
    //     .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'The image is too large. Please choose an image smaller than 5MB.' })
    //     .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), { message: "Please upload a valid image file (JPEG, PNG, or WebP)." }),
});

export const signupSchema: ZodEffects<ZodObject<any, any>> = z
    .object({
        name: z.string()
            .min(3, "Name should have atleast three characters")
            .max(30, "Name can not have more then 30 characters"),
        email: z.string()
            .trim()
            .email("Please enter a valid email")
            // .refine(
            //     async (email) => {
            //         const user = await User.findOne({ where: { email: email.toLowerCase() } })
            //         return !user;
            //     },
            //     {
            //         message: 'A user with this email already exists in the system.',
            //         path: ['email'],
            //     }
            // )
            .transform((email) => email.toLowerCase()),
        password: z.string()
            .trim()
            .min(8, "Please enter a password with minimum 8 characters"),
        confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string()
        .trim()
        .email("Please enter a valid email")
        .transform((email) => email.toLowerCase()),
    password: z.string()
        .trim()
        .min(8, "Please enter a password with minimum 8 characters"),
});

export const refreshSchema = z.object({
    refreshToken: z.string({ message: "Invalid refresh token" }).trim(),
});

export const logoutSchema = z.object({
    refreshToken: z.string({ message: "Invalid refresh token" }).trim(),
});

export const accessTokenSchema = z.object({
    userId: z.string().uuid("Refresh token must contain a valid user id"),
    email: z.string().email("Refresh token must contain a valid email"),
    iat: z.number(),
    exp: z.number(),
});

export const refreshTokenSchema = z.object({
    userId: z.string().uuid("Refresh token must contain a valid user id"),
    iat: z.number(),
    exp: z.number(),
});
