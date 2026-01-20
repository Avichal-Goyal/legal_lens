import { z } from 'zod';

export const usernameValidation = z
.string()
.min(3, "Username must be of atleast 3 chars.")
.max(30, "Username should be of max 30 chars.")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({messages: 'Invalid email address.'}),
    password: z.string().min(6, {message: "password must be of atleast 6 chars."})
})