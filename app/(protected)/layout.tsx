import SiderBar from "../components/SideBar";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { constructMetadata } from "@/lib/utils";
import connect from "@/lib/database/connect";

export const metadata = constructMetadata({
  icons: "/favicon.ico",
  title: "Shinobi Store - Sell and manage your products",
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connect();
  return (
    <main className=" min-h-screen h-full auto-rows-fr  bg-gray-100 grid grid-cols-6">
      <SiderBar />
      <div className="  col-span-full lg:col-span-5">{children}</div>
    </main>
  );
}
