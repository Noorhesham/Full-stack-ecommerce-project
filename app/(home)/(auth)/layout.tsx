import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
  userInfo,
}: Readonly<{
  children: React.ReactNode;
  userInfo: any;
}>) {
  if (userInfo) redirect("/");
  return <div className="flex justify-center">{children}</div>;
}
