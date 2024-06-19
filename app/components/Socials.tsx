"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
const Social = () => {
  const [error, setFormError] = useState<string | undefined>("");
  const router = useRouter();
  function handleGoogle() {
    signIn("google", {
      callbackUrl: "/",
    }).then((res) => {
      if (res?.error) setFormError(res.error);
    });
  }
  return (
    <div className="flex flex-wrap justify-between items-center ">
      <div className="flex items-center gap-x-2">
        <Button type="button" onClick={handleGoogle} size="lg" className=" rounded-full py-4 px-3" variant="outline">
          <FcGoogle className="h-5 w-5" />
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Social;
