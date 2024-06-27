import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SiderBar from "../components/SideBar";
import "../globals.css";
import NavDashboard from "../components/NavDashboard";
import { authOptions } from "@/lib/auth";
import User from "@/lib/database/models/UserModel";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");
  let userInfo = await User.findOne({ email: session?.user?.email });
  userInfo = JSON.parse(JSON.stringify(userInfo));
  return (
    <main className=" min-h-screen h-full auto-rows-fr  bg-gray-100 grid grid-cols-6">
      <SiderBar user={userInfo} />
      <div className=" col-span-5">{React.cloneElement(children as React.ReactElement, { userInfo })}</div>
    </main>
  );
}
