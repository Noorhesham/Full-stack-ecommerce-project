"use client";
import React, { useState } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { signupSchema } from "../schemas/Schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUp } from "../actions/signup";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "./InputField";
import { redirect, useRouter } from "next/navigation";
import Social from "./Socials";
import { sendConfirmationEmail } from "@/lib/database/email";
import { toast } from "react-toastify";

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });
  const [error, setError] = useState<string | undefined>(undefined);
  const { handleSubmit, control } = form;
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      setIsLoading(true);
      const res: any = await SignUp(data);
      if (res.success) {
        const user = res.data.user;
        const send = await sendConfirmationEmail(user.email, user.id);
        if (send?.success) {
          router.push("/verify-email");
          toast.success(
            "We have sent a confirmation email to your email address. Please check your email and click on the link to confirm your email address."
          );
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Logo />
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/signin"
            >
              Already have an account? Sign-in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col  gap-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex  justify-center px-5 py-5 flex-col gap-6 ">
                <FormInput control={control} className={"w-full"} name="email" label="Email" type="email" />
                <div className="flex items-center gap-4">
                  <FormInput control={control} name="lastName" label=" Last Name" type="text" />
                  <FormInput control={control} name="firstName" label="First Name" type="text" />
                </div>
                <FormInput phone name="phone" control={control} label=""/>
                <FormInput
                  password
                  className={"w-full"}
                  control={control}
                  name="password"
                  label="password"
                  type="password"
                />
                <FormInput
                  password
                  className={"w-full"}
                  control={control}
                  name="confirmPassword"
                  label=" password confirm"
                  type="password"
                />
                <Button disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign up
                </Button>
                <Social />
              </form>
            </Form>
          </div>
        </div>
        {error && <p className=" font-semibold text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default SignupForm;
