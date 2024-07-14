"use client";
import React, { Suspense, useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "../schemas/Schema";
import { signIn } from "next-auth/react";
import FormInput from "./InputField";
import { Form } from "@/components/ui/form";
import { toast } from "react-toastify";
import Social from "./Socials";
import Loader from "./Loader";
import { useUpdateCart } from "../queries/queries";
import Image from "next/image";
const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const isSeller = searchParams.get("as") === "seller";
  const redirect = searchParams.get("redirect");
  const [isLoading, setIsLoading] = useState(false);
  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control } = form;
  const { updateCart } = useUpdateCart(true);
  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", { email, password, redirect: false });
      console.log(res);
      if (res?.error) {
        setError("Invalid email or password, please try again ! 😢");
        return;
      }
      if (res?.ok) {
        router.push(`${redirect ? redirect : isSeller ? "/seller" : "/"}`);
        toast.success("Login Successful");
      }

      JSON.parse(localStorage.getItem("cart") || "[]").map(
        ({ productId, variantId }: { productId: string; variantId: string[] }) => {
          updateCart({ data: { productId, variantId }, remove: false });
        }
      );
      localStorage.removeItem("cart");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Suspense fallback={<Loader className="w-40 h-40" />}>
      <div className="flex  w-full max-w-4xl items-center gap-2">
        <div className=" lg:block hidden relative h-full   flex-[60%]">
          <Image src="/signin.jpg" fill alt="login image" className="object-cover w-full h-full absolute" />
        </div>
        
        <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col items-center space-y-2 text-center">
              <Logo />
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to your {isSeller ? "seller" : ""} account
              </h1>

              <Link
                className={buttonVariants({
                  variant: "link",
                  className: "gap-1.5",
                })}
                href="/signup"
              >
                Don&apos;t have an account?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col  gap-6">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex max-w-[60rem] justify-center px-5 py-5 flex-col gap-6 "
                >
                  <FormInput control={control} className={"w-full"} name="email" label="Email" type="email" />
                  <FormInput
                    password
                    className={"w-full"}
                    control={control}
                    name="password"
                    label="password"
                    type="password"
                  />
                  <Button disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
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

              {isSeller ? (
                <Button onClick={continueAsBuyer} variant="secondary" disabled={isLoading}>
                  Continue as customer
                </Button>
              ) : (
                <Button onClick={continueAsSeller} variant="secondary" disabled={isLoading}>
                  Continue as seller
                </Button>
              )}
            </div>
            <Social />
          </div>
          {error && <p className=" font-semibold text-red-500">{error}</p>}
        </div>
      </div>
    </Suspense>
  );
};

export default LoginForm;
