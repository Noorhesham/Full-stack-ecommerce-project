import { z } from "zod";
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const signupSchema = z
  .object({
    firstName: z.string().min(2, { message: "Please enter your first name" }),
    lastName: z.string().min(2, { message: "Please enter your last name" }),
    email: z.string().email({ message: "😢 Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
    phone: z.string().regex(phoneRegex, { message: "Please enter a valid phone number" }),
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

export const productStep1Schema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  category: z.string().min(1, "Product category is required"),
  subCategories: z.array(z.object({ _id: z.string() })).optional(),
  price: z.string().min(1, "Product price is required"),
  stock: z.string().min(1, "Product stock is required"),
  ribbon: z.string().optional(),
  additionalInfo: z
    .array(
      z.object({
        title: z.string().min(1, "title is required"),
        description: z.string().min(1, "description is required"),
      })
    )
    .optional(),
  isOnSale: z.boolean().optional(),
  salePrice: z.string().optional(),
});
export const addImagesSchema = z.object({
  images: z.array(z.string().url()).min(4, "Four images are required"),
});
export const variationSchema = z.object({
  variation: z.string().min(1, "Variation name is required"),
  variationOptions: z
    .array(
      z.object({
        price: z.any().optional(),
        variationOption: z.string().min(1, "Option title is required"),
        image: z.any().optional(),
        images: z.array(z.any()).optional(),
      })
    )
    .max(3, "Maximum 3 options allowed")
    .min(1, "Minimum 1 option required"),
});
export const statusSchema = z.object({
  status: z.string().nonempty("status is required"),
  message: z.string().optional(),
});
