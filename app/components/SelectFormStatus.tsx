"use client";
import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "./InputField";
import { ProductProps } from "../types";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { statusSchema } from "../schemas/Schema";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../socket";
import { updateStatus } from "../actions/products";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import SelectField from "./SelectField";
import BabySpinner from "./BabySpinner";
import { Checkbox } from "@/components/ui/checkbox";

const SelectFormStatus = ({ product }: { product: ProductProps }) => {
  const form = useForm<z.infer<typeof statusSchema>>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: product?.status || "pending",
      isFeatured: product?.isFeatured || false,
    },
  });
  console.log(form.formState);
  const queryClient = useQueryClient();
  const { handleSubmit, control } = form;
  const [isPending, startTransition] = React.useTransition();
  const onSubmit = (data: z.infer<typeof statusSchema>) => {
    startTransition(async () => {
      const res = await updateStatus(product._id, data.status);
      if (res.success) toast.success(res.success);
      //@ts-ignore
      queryClient.invalidateQueries("products");
      socket.emit(
        "AcceptProduct",
        {
          userId: product.creator._id,
          productId: product._id,
          message:
            `your product is ${data.status} by the admin / admin comment :${data.message}` ||
            `your product is ${data.status} by the admin`,
        },
        product.creator._id
      );
    });
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex-col gap-6 flex">
          <SelectField
            label="Status"
            defaultValue={product?.status}
            options={[
              { name: "Published", value: "published" },
              { name: "Rejected", value: "rejected" },
              { name: "Pending", value: "pending" },
            ]}
            name={"status"}
            control={control}
          />
          <FormInput
            control={control}
            name="message"
            className="w-full"
            label={`Message for ${product?.creator?.firstName}`}
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

export default SelectFormStatus;
