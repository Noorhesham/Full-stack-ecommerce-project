"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "./InputField";
import { useRouter } from "next/navigation";
import { updateUserData } from "../actions/CartActions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { UserProps } from "@/lib/database/models/UserModel";
import BabySpinner from "./BabySpinner";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "../utils/cn";
import { formatPrice } from "@/lib/utils";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css"; 
const MapComponent = dynamic(() => import("./Map"), { ssr: false });
const paymentSchema = z.object({
  city: z.string().min(5, "address is required"),
  address: z.string().min(25, "address is too short to be valid"),
  phoneNumber: z.string().min(11, "phoneNumber is required"),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

const PaymentForm = ({
  user,
  handleCheckout,
  cartTotal,
}: {
  user: UserProps;
  handleCheckout: any;
  cartTotal: number;
}) => {
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber ? `+${user?.phoneNumber.toString()}` : "",
      city: user?.city || "",
      address: user?.address || "",
      location: user?.location || { lat: 0, lng: 0 },
    },
  });
  const alreadyThere = Boolean(
    form.formState.defaultValues?.city &&
      form.formState.defaultValues?.address &&
      form.formState.defaultValues?.phoneNumber
  );
  const [edit, setEdit] = useState(alreadyThere);
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { control, handleSubmit, setValue } = form;
  const onSubmit = async (data: z.infer<typeof paymentSchema>) => {
    console.log(data)
    //@ts-ignore
    startTransition(async () => {
      if (!alreadyThere || edit) {
        const res = await updateUserData({ ...data, });
        if (res.success) toast.success(res.success);
        else return toast.error(res.error.message);
      }
      await handleCheckout(data.address, data.city,data.location);
    });
    router.refresh();
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className=" ">
          <div className="flex  flex-col gap-7 mb-5 mt-3 items-center">
            <FormInput
              disabled={isPending || edit}
              control={control}
              className=" w-full"
              name="city"
              label="City"
              type="text"
            />
            <FormInput
              disabled={isPending || edit}
              control={control}
              className=" w-full"
              name="address"
              label="Address"
              type="text"
            />
            <FormInput
              disabled={isPending || edit}
              className=" w-full"
              phone
              name="phoneNumber"
              control={control}
              label=""
            />
            <div className="w-full h-64">
              <MapComponent
                defaultLocation={user?.location}
                setLocation={(location) => setValue("location", location)}
              />
            </div>
            {alreadyThere && (
              <Button type="button" className=" self-end ml-auto w-fit" onClick={() => setEdit(!edit)}>
                Edit
              </Button>
            )}
          </div>

          <h2 className="sr-only text-lg font-medium text-gray-900">Order summary</h2>
          <div className="space-y-6 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(cartTotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Shipping</dt>
              <dd>$0.00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Tax</dt>
              <dd>$0.00</dd>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full mt-4")}
          >
            {!isPending ? "Checkout" : <BabySpinner />}
          </button>
          <p className="mt-6 text-center text-sm text-gray-500">or</p>
          <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full mt-4")}>
            Continue Shopping <span aria-hidden="true"> &rarr;</span>
          </Link>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
