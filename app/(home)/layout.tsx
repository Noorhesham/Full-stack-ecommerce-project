import { Inter } from "next/font/google";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import connect from "@/lib/database/connect";
import React from "react";
import Footer from "../components/Footer";
import { constructMetadata } from "@/lib/utils";

//todos
/* 
Overview of sales and revenue
Sales analytics (charts and graphs)

View and manage users

Password reset functionality

Implement search functionality

Show product reviews and ratings



Review and Rating System

Display average rating on product details page
Manage reviews (admin can delete inappropriate reviews)


*/
export const metadata = constructMetadata({
  icons: "/favicon.ico",
  title: "Shinobi Store - Your market place to sell any product or buy products for best prices ! ",
  image: "/logo1.jpg",
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connect();
  return (
    <main className="relative  flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow flex-1"> {children}</div>
      <Footer />
    </main>
  );
}
