import { getProduct } from "@/app/actions/products";
import Steps from "@/app/components/Steps";
import connect from "@/lib/database/connect";
import User, { UserProps } from "@/lib/database/models/UserModel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function RootLayout({
  children,
  params,
  userInfo,
}: {
  children: React.ReactNode;
  params: { id: string };
  userInfo: UserProps;
}) {
  await connect();
  const product = await getProduct(params.id);
  const session = await getServerSession();
  const user = await User.findOne({ email: session?.user?.email });
  if (product?.product.creator !== JSON.parse(JSON.stringify(user))._id) redirect("/");
  return (
    <div className="h-full">
      <Steps id={params.id || ""} />
      <div className="bg-gray-100 overflow-hidden">
        {React.cloneElement(children as React.ReactElement, { product })}
      </div>
    </div>
  );
}
