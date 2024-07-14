"use client";
import React, { useEffect } from "react";
import { OrderProps } from "../(home)/thank-you/page";
import { useDeliverOrder } from "../queries/queries";
import { useForm } from "react-hook-form";
import FormInput from "./InputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import SelectField from "./SelectField";
import BabySpinner from "./BabySpinner";
import { Form } from "@/components/ui/form";
import { socket } from "../socket";
import { formatDate } from "date-fns";
import { toast } from "react-toastify";
const statusSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  isDelieverd: z.boolean().optional(),
});
const UpdateOrderStatus = ({ order }: { order: OrderProps }) => {
  console.log(order.user);
  const form = useForm<z.infer<typeof statusSchema>>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: order?.status || "pending",
      isDelieverd: order?.isDelieverd || false,
    },
  });

  const { update, isPending } = useDeliverOrder();
  const { handleSubmit, control } = form;
  const onSubmit = (data: z.infer<typeof statusSchema>) => {
    update({ data, id: order?._id });
    console.log(data);
    socket.emit("statusOrderUpdate", {
      userId: order.user._id,
      isAdmin: order.user.isAdmin,
      message: `your order with id ${order?._id} is ${data.status} in ${formatDate(new Date(), "dd/MM/yyyy")} ${
        data.message||data.message!==undefined ? `admin comment :${data.message}` : ""
      } `,
    },order.user.isAdmin?"admin":order.user._id);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex-col gap-6 flex">
          <SelectField
            label="Status"
            defaultValue={order?.status}
            options={[
              { name: "Delivered", value: "delivered" },
              { name: "Near", value: "near" },
              { name: "Pending", value: "pending" },
            ]}
            name={"status"}
            control={control}
          />
          <FormInput
            control={control}
            name="message"
            className="w-full"
            label={`Message for ${order?.user?.firstName}`}
            type="text"
          />
          <Button disabled={isPending} type="submit" className="mt-4 ml-auto p-2  rounded">
            {isPending ? <BabySpinner /> : "send"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UpdateOrderStatus;
