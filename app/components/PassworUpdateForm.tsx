"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { updatePassword } from "../actions/CartActions";
import { toast } from "react-toastify";
import { Form } from "@/components/ui/form";
import FormInput from "./InputField";

const PasswordSchema = z.object({
  oldPassword: z.string().nonempty("Old password is required"),
  newPassword: z.string().nonempty("New password is required"),
});

const PasswordUpdateForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof PasswordSchema>) => {
    startTransition(async () => {
      // const res = await updatePassword(data);
      if (res.success) toast.success("Password Updated");
      else toast.error(res.error);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          disabled={isPending}
          control={control}
          name="oldPassword"
          label="Old Password"
          type="password"
        />
        <FormInput
          disabled={isPending}
          control={control}
          name="newPassword"
          label="New Password"
          type="password"
        />
        <button type="submit" className="self-end btn-primary">
          Update Password
        </button>
      </form>
    </Form>
  );
};

export default PasswordUpdateForm;
