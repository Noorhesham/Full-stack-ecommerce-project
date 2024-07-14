"use server";
import bcrypt from "bcrypt";
import connect from "@/lib/database/connect";
import User from "@/lib/database/models/UserModel";
import { signupSchema } from "../schemas/Schema";
import { z } from "zod";
import Activation from "@/lib/database/models/ActivationModel";

export const SignUp = async (data: z.infer<typeof signupSchema>) => {
  const validateFields = signupSchema.safeParse(data);
  if (!validateFields.success) return { error: "Invalid fields!" };
  const { password, confirmPassword, firstName, lastName, email, phoneNumber } = validateFields.data;
  await connect();
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("A user with this email already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ confirmPassword, firstName, lastName, password: hashedPassword, email, phoneNumber });
    return { success: "Your account has been created successfully!", status: 200, data: { user } };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: "A user with this email already exists" };
    }
    const validationErrors = Object.values(error.errors).map((error: any) => error.message);
    console.log(error, validationErrors);
    if (validationErrors) return validationErrors;
    return { error: "An error occurred while processing the request. Please try again!" };
  }
};

export const verifyUser = async (token: string) => {
  try {
    const activation = await Activation.findOne({
      token,
      activatedAt: null,
      createdAt: { $gt: Date.now() - 24 * 60 * 60 * 1000 },
    });
    if (!activation) {
      await Activation.findOneAndDelete({ token });
      throw new Error("Invalid Token.Please try again! 😢");
    }
    activation.activatedAt = Date.now();
    const user = await User.findByIdAndUpdate(activation.user, {
      isActivated: true,
      activatedAt: Date.now(),
    });
    return { success: "Your account has been activated successfully!", status: 200, data: { user } };
  } catch (error) {
    console.log(error);
  }
};
