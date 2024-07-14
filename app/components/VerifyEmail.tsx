"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { verifyUser } from "../actions/signup";
import { Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

const VerifyEmail = ({ token }: { token: string }) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["verifyEmail"],
    queryFn: () => verifyUser(token),
  });
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="h-8 w-8 text-red-600" />
        <h3 className="font-semibold text-xl">There was a problem</h3>
        <p className="text-muted-foreground text-sm">This token is not valid or might be expired. Please try again.</p>
      </div>
    );
  }
  if (data?.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative -translate-x-10 mb-4 h-60 w-60 mx-auto text-muted-foreground">
          <Image src="/loader2.gif" fill alt="the email was sent" />
        </div>

        <h3 className="font-semibold text-2xl">You&apos;re all set!</h3>
        <p className="text-muted-foreground text-center mt-1">Thank you for verifying your email.</p>
        <Link className={buttonVariants({ className: "mt-4 w-full" })} href="/signin">
          Sign in
        </Link>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
        <h3 className="font-semibold text-xl">Verifying...</h3>
        <p className="text-muted-foreground text-sm">This won&apos;t take long.</p>
      </div>
    );
  }
};

export default VerifyEmail;
