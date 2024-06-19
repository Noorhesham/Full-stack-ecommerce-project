import { z } from "zod";
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const signupSchema = z
  .object({
    firstName: z.string().min(2, { message: "Please enter your first name" }),
    lastName: z.string().min(2, { message: "Please enter your last name" }),
    email: z.string().email({ message: "😢 Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
    // phone: z.string().regex(phoneRegex, { message: "Please enter a valid phone number" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // set path of error
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "😢 Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
export const confirmSchema = z.object({
  token: z.string().min(1, { message: "token must be at least 4 characters" }),
});
