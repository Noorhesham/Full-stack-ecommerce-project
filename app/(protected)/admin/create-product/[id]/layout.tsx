import { getProduct } from "@/app/actions/products";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Steps from "@/app/components/Steps";
import { ProductProvider } from "@/app/context/ProductContext";
import connect from "@/lib/database/connect";
import User, { UserProps } from "@/lib/database/models/UserModel";
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
  // if (product?.product.creator !== session?.user.id) redirect("/");

  return (
    <div className="h-full">
      <Steps product={product && product.product} id={params.id || ""} />
      <ProductProvider product={product && product.product}>
        <div className="bg-gray-100 overflow-hidden">{children}</div>
      </ProductProvider>
    </div>
  );
}
