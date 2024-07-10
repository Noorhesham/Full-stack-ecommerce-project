"use client";
import React, { useEffect } from "react";
import { useGetOrderStatus } from "../queries/queries";
import { sendPaymentEmail } from "@/lib/database/email";
import { toast } from "react-toastify";
import BabySpinner from "./BabySpinner";
import { emailSent } from "../actions/pay";
import { ProductProps } from "../types";

const PaymentStatus = ({
  orderEmail,
  orderId,
  isPaid,
  emailInfo,
}: {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
  emailInfo: {
    products: ProductProps[];
    total: number;
  };
}) => {
  const { data } = useGetOrderStatus(orderId);
  const [isPending, startTransition] = React.useTransition();
  useEffect(() => {
    if (data?.order.isPaid === true && data.order.isEmailSent === false) {
      startTransition(async () => {
        const res = await sendPaymentEmail(orderEmail, {
          email: orderEmail,
          orderId,
          products: emailInfo.products,
          total: emailInfo.total,
        });
        if (res?.success) {
          toast.success(res.success);
          await emailSent(orderId);
        } else toast.error(res?.error);
      });
    }
  }, [data]);
  return (
    <div className=" mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className=" font-medium flex items-center gap-2 text-gray-900">Shipping To</p>
        <p>{orderEmail}</p> {isPending && <BabySpinner />}
      </div>
      <div>
        <p className=" font-medium text-gray-900">Order Status</p>
        <p>{isPaid ? "Payment Received successfully" : "Pending"}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
