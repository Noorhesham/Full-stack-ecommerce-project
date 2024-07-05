import AdminNav from "@/app/components/AdminNav";
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
