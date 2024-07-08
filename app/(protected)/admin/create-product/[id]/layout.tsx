import { getProduct } from "@/app/actions/products";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadcrumbWithCustomSeparator } from "@/app/components/BreadCumber";
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
      <div className="flex flex-col gap-2">
        <Steps product={product && product.product} id={params.id || ""} />
        <div className=" px-5 py-3">
          <BreadcrumbWithCustomSeparator
            breadcrumbs={[
              { name: "Home", href: "/" },
              { name: `${product.product.name}`, href: `/create-product/${params.id}` },
            ]}
          />
        </div>
      </div>
      <ProductProvider product={product && product.product}>
        <div className="bg-gray-100 overflow-hidden">{children}</div>
      </ProductProvider>
    </div>
  );
}
