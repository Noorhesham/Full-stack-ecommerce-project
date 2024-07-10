import { getOrderStatus } from "@/app/actions/pay";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CartItem from "@/app/components/CartItem";
import PaymentStatus from "@/app/components/PaymentStatus";
import { ProductProps } from "@/app/types";
import { UserProps } from "@/lib/database/models/UserModel";
const Order = require("../../../lib/database/models/OrderModel.ts");
import { calculateFinalPrice, formatPrice } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
interface OrderProps {
  name: string;
  price: number;
  _id: string;
  createdAt: Date;
  user: UserProps;
  products: [string];
  status: string;
  payment: string;
  shippingAddress: string;
  paymentMethod: string;
  isPaid: boolean;
}
const ThankYouPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const orderId = searchParams?.orderId;
  const session = await getServerSession(authOptions);
  const user = session?.user;
  //@ts-ignore
  const { order }: OrderProps | null = await getOrderStatus(orderId);

  if (!order) return notFound();
  console.log(order);
  const orderUserId = order.user._id;

  if (orderUserId != user?.id) return redirect(`/signin?redirect=/thank-you?orderId=${orderId}`);
  const items = order.products.map((product: any) => {
    return { ...product.productId, variants: product.variants };
  });
  const total = items?.reduce((acc: number, { price, isOnSale, salePrice, variants, variations }: any) => {
    const finalPrice = calculateFinalPrice(price, variants, variations);
    return acc + (isOnSale ? finalPrice - +salePrice.replace("$", "") : finalPrice);
  }, 0);
  return (
    <main className=" relative  lg:min-h-[90vh]">
      <div className=" hidden sm:block h-full overflow-hidden lg:absolute lg:h-full  lg:w-[50%] lg:pr-4 xl:pr-12 ">
        <Image
          src={"/naruto ninja evolution.jpg"}
          fill
          className="object-center h-full w-full object-contain"
          alt="thank you image"
        />
      </div>
      <div>
        <div className=" mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className=" lg:col-start-2">
            <p className=" text-sm font-medium text-red-600">Order Placed Successfully</p>
            <h1 className=" mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thank you for shopping with us.
            </h1>
            {order.isPaid ? (
              <p className="mt-2 text-base  text-muted-foreground">
                Your order has been placed.We will deliver your order as soon as possible.we have sent your receipt to
                your email <span className="font-medium text-gray-900">{user?.email}</span>
              </p>
            ) : (
              <p className="mt-2 text-base  text-muted-foreground">
                We appreciate your order , and we&apos;ll process it as soon as possible.So hang in there and we&apos;
                will send you confirmation email very soon.
              </p>
            )}
            <div className=" mt-16 text-sm font-medium">
              <div className=" text-muted-foreground">Order nr.</div>
              <div className=" text-gray-900 mt-2">{order._id}</div>
              <p>Keep an eye on this id to track your order in case something goes wrong.</p>
              <ul className=" mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {items.map((product: ProductProps, i: number) => {
                  const variantsItems = product.variants;
                  return <CartItem check={true} key={i} show={true} product={product} variants={variantsItems} />;
                })}
              </ul>
              <div className=" space-y-6  border-t border-gray-200  pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{formatPrice(total)}</p>
                </div>

                <div className="flex justify-between">
                  <p>Transaction Fee</p>
                  <p>{formatPrice(1)}</p>
                </div>
                <div className=" flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900 ">
                  <div className=" text-base">Total</div>
                  <p className=" text-base">{formatPrice(total + 1)}</p>
                </div>
              </div>
              <PaymentStatus
                emailInfo={{ products: items, total }}
                isPaid={order.isPaid}
                orderId={order._id}
                orderEmail={user?.email || ""}
              />
              <div className=" mt-16 border-t border-gray-200  py-6 text-right ">
                <Link href={`/products`} className=" text-red-500 hover:text-red-400 text-sm font-medium">
                  Continue Shopping &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
