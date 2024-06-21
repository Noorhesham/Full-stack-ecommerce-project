import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SiderBar from "../components/SideBar";
import "../globals.css";
import NavDashboard from "../components/NavDashboard";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  console.log(session);
  if (!session?.user) redirect("/signin");
  return (
    <main className=" min-h-screen h-full auto-rows-fr  bg-gray-100 grid grid-cols-6">
      <SiderBar />
      <div className=" col-span-5">{children}</div>
    </main>
  );
}
