import AdminNav from "@/app/components/AdminNav";
import User from "@/lib/database/models/UserModel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  const user = await User.findOne({ email: session?.user?.email });
  if (!user.isAdmin) redirect("/signin");
  console.log(user);
  return (
    <div className=" h-full">
      <div className="   bg-gray-100  overflow-hidden">
        <AdminNav user={user}/>{children}</div>
    </div>
  );
}
