"use client"
import React, { useState } from "react";
import Logo from "./Logo";
import { ArrowRight, Link, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import FormInput from "./InputField";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { confirmSchema } from "../schemas/Schema";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof confirmSchema>>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      token: "",
    },
  });
  const { handleSubmit, control } = form;
  const onSubmit = async ({ token }: z.infer<typeof confirmSchema>) => {
    try {
      setIsLoading(true)
 
    } catch (error:any) {
      setError(error.message);
      console.log(error);
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <>
      <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Logo />

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/signup"
            >
              Sign IN
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col  gap-6">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex max-w-[60rem] justify-center px-5 py-5 flex-col gap-6 "
              >
                <FormInput
                  password
                  className={"w-full"}
                  control={control}
                  name="password"
                  label="new password"
                  type="password"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
          </div>
        </div>
        {error && <p className=" font-semibold text-orange-500">{error}</p>}
      </div>
    </>
  );
};

export default ForgotPassword;
