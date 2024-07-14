"use client";
import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { UserProps } from "@/lib/database/models/UserModel";
import FormInput from "./InputField";
import MapComponent from "./Map";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { uploadToCloudinary } from "@/lib/utils";
import PasswordUpdateForm from "./PassworUpdateForm";
import { MdPhoto } from "react-icons/md";
import { AlertTriangle } from "lucide-react";
import { imgDeletion } from "../actions/products";
import { updateUserData } from "../actions/CartActions";
import { Button } from "@/components/ui/button";
const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};
const UserSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  city: z.string().min(5, "City is required"),
  address: z.string().min(5, "Address is required"),
  email: z.string().optional(),
});

const UserUpdateForm = ({ userData }: { userData: UserProps }) => {
  const [isPending, startTransition] = useTransition();
  const { data: session, update } = useSession();
  const [image, setImage] = useState<File>();
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      phoneNumber: userData?.phoneNumber ? `+${userData?.phoneNumber.toString()}` : "",
      location: userData?.location,
      city: userData?.city || "",
      address: userData?.address,
      email: userData?.email,
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (image) {
      handleImageChange();
    }
  }, [image]);

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    startTransition(async () => {
      const res = await updateUserData({ ...data, id: userData._id });
      if (res.success) {
        toast.success("User Details Updated");
        const resp = await update({
          ...session,
          user: {
            ...session?.user,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
          },
        });
        reloadSession();
        console.log(resp, session, data);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        toast.error(res.error);
      }
    });
    router.refresh();
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const handleImageChange = async () => {
    startTransition(async () => {
      if (userData.photo.publicId) {
        await imgDeletion(userData.photo.publicId);
      }
      //@ts-ignore
      uploadToCloudinary(image, setProgress).then(async (url) => {
        const res = await updateUserData({ photo: url, id: userData._id });
        if (res.success) {
          toast.success("User Photo Updated");

          // Update the session with the new user photo
          await update({
            ...session,
            user: {
              ...session?.user,
              photo: {
                imgUrl: url.secure_url,
                publicId: url.public_id,
              },
            },
          });
        } else {
          toast.error(res.error);
        }
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    });
  };
  console.log(session, form.formState.errors);
  return (
    <div className="py-4 px-8">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className=" ">
          <div className="flex flex-col gap-7 mb-5 mt-3 items-center">
            <label htmlFor="img" className="h-32 group rounded-full border border-gray-400 w-32 relative">
              <Image
                src={(image && URL.createObjectURL(image)) || userData?.photo.imgUrl || "/avatarDefault.jpg"}
                alt="user image"
                fill
                className={`rounded-full group-hover:opacity-90 duration-150 cursor-pointer absolute object-cover object-center ${
                  isPending && "animate-pulse opacity-90"
                }`}
              />
              <MdPhoto className="text-3xl opacity-0 group-hover:opacity-100 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <input
                id="img"
                onChange={(e) => {
                  e.target.files && setImage(e.target.files[0]);
                }}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
            <div className="flex gap-3 items-center w-full">
              <FormInput
                disabled={isPending}
                control={control}
                className="w-full"
                name="firstName"
                label="First Name"
                type="text"
              />
              <FormInput
                disabled={isPending}
                control={control}
                className="w-full"
                name="lastName"
                label="Last Name"
                type="text"
              />
            </div>
            <FormInput disabled={true} control={control} className="w-full" name="email" label="Email" type="text" />
            <FormInput
              disabled={isPending}
              control={control}
              className="w-full"
              name="address"
              label="Address"
              type="text"
            />
            <FormInput disabled={isPending} control={control} className="w-full" name="city" label="City" type="text" />
            <FormInput
              disabled={isPending}
              className="w-full"
              name="phoneNumber"
              phone
              control={control}
              label="Phone Number"
              type="text"
            />
            <div className="w-full max-w-2xl h-64">
              <MapComponent
                defaultLocation={userData?.location}
                setLocation={(location: any) => form.setValue("location", location)}
              />
            </div>
            {Object.keys(form.formState.errors).map((field: any) => (
              <div key={field} className="flex items-center text-yellow-600">
                <AlertTriangle className="mr-2" />
                {/*@ts-ignore */}
                {form.formState?.errors[field]?.message}
              </div>
            ))}
          </div>
          <Button className="w-full" type="submit" variant={"default"}>
            Submit{" "}
          </Button>
        </form>
      </Form>
      <div className="mt-2 w-full">
        <PasswordUpdateForm />
      </div>
    </div>
  );
};

export default UserUpdateForm;
