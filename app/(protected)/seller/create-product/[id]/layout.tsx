import { getProduct } from "@/app/actions/products";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Steps from "@/app/components/Steps";
import { ProductProvider } from "@/app/context/ProductContext";
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
  const product: any = await getProduct(params.id);
  const session = await getServerSession(authOptions);
  console.log(product)
  console.log(product.product.creator,session.user.id);
  if (product?.product.creator._id != session?.user.id) redirect("/");
  return (
    <div className="h-full">
      <Steps product={product && product.product} id={params.id || ""} />
      <ProductProvider product={product && product.product}>
        <div className="bg-gray-100 overflow-hidden">{children}</div>
      </ProductProvider>
    </div>
  );
}
