"use client";
import React, { useState } from "react";
import CardWrapper from "./CardWrapper";
import NotFound from "./NotFound";
import ReviewBox from "./ReviewBox";
import User from "./User";
import { Separator } from "@/components/ui/separator";
import Starrating from "./Rate";
import { useSession } from "next-auth/react";
import { PenIcon } from "lucide-react";
import { Delete } from "./Delete";
import { deleteReview } from "../actions/products";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ReviewsSection = ({ reviews, productId }: { reviews: any; productId: string }) => {
  const session = useSession();
  const [review, setReview] = useState();
  const router = useRouter();
  const refresh = () => {
    router.refresh();
    setReview(undefined);
  };
  return (
    <CardWrapper shadow={false} text="Product Reviews">
      {(!reviews || reviews.length === 0) && (
        <NotFound text="No reviews for this product yet ... write one if purchased it ! " />
      )}
      {reviews?.length > 0 &&
        reviews.map((review: any) => (
          <div key={review._id} className="flex items-start gap-2 ">
            <User show={true} user={review.user} />
            <div className="flex flex-col gap-2 py-2 px-4">
              <h2 className="text-base font-semibold">{review.title}</h2>
              <Separator />
              <p className="text-sm  text-muted-foreground">{review.description}</p>
            </div>
            <div className="flex items-center">
              <Starrating
                MaxRating={5}
                size={16}
                color="rgb(228, 83, 83)"
                change={false}
                defaultRating={review.rating}
              />
              {session?.data?.user.id === review.user._id && (
                <div className="flex  gap-2 ml-3 items-center">
                  <button
                    onClick={() => setReview(review)}
                    className="flex cursor-pointer justify-between w-full  text-gray-300 hover:text-green-400 duration-150"
                  >
                    <PenIcon className="h-4 w-4 ml-auto" />
                  </button>
                  <Delete
                    value={"Review"}
                    onClick={async () => {
                      const res = await deleteReview(review._id);
                      if (res.success) {
                        setReview(null);
                        toast.success(res.success);
                        router.refresh();
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      <ReviewBox refresh={refresh} review={review} productId={productId} />
    </CardWrapper>
  );
};

export default ReviewsSection;
