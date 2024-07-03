import AdminNav from "@/app/components/AdminNav";
import connect from "@/lib/database/connect";
import User from "@/lib/database/models/UserModel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" h-full">
      <div className="   bg-gray-100  overflow-hidden">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
