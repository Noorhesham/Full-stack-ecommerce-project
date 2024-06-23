import Steps from "@/app/components/Steps";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  return (
    <div className=" h-full">
      <Steps id={params.id || ""} />
      <div className="   bg-gray-100  overflow-hidden">{children}</div>
    </div>
  );
}
