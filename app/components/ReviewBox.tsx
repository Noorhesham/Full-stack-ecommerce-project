"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useUpdateReview } from "../queries/queries";
import { ReviewProps } from "@/lib/database/models/ReviewModel";
import { Form } from "@/components/ui/form";
import FormInput from "./InputField";
import { Button } from "@/components/ui/button";
import Starrating from "./Rate";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5).nonnegative(),
  title: z.string().nonempty(),
  description: z.string().optional(),
});

const ReviewBox = ({ productId, review, refresh }: { productId: string; review?: ReviewProps; refresh: any }) => {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: review?.rating || 1,
      title: review?.title || "",
      description: review?.description || "",
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (review) {
      form.setValue("rating", review.rating);
      form.setValue("title", review.title);
      form.setValue("description", review.description);
    }
  }, [review, reset]);

  const router = useRouter();
  const { makeReview, isPending } = useUpdateReview();

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    makeReview({ data: { ...data, product: productId }, id: review?._id });
    refresh();
  };

  return (
    <Form {...form}>
      <h1 className="text-lg font-semibold mt-5 border-t border-gray-300">{review ? "Edit Review" : "Add Review"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl pt-10">
        <div className="flex flex-col gap-7 mb-5 mt-3 items-start">
          <div className="flex flex-col gap-3 items-start">
            <FormInput disabled={isPending} control={control} name="title" label="Title" type="text" />
            <FormInput disabled={isPending} control={control} name="description" label="Description" type="text" />
            <Starrating
              MaxRating={5}
              OnSetRating={(rating) => {
                form.setValue("rating", rating);
              }}
              size={20}
              color="rgb(228, 83, 83)"
              defaultRating={form.getValues().rating || review?.rating}
            />
          </div>
        </div>
        <Button className="w-[40%]" type="submit" variant={"default"}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ReviewBox;
