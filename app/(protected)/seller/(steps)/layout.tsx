import Steps from "@/app/components/Steps";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" h-full">
      <Steps />

      {children}
    </div>
  );
}
