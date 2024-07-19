import { getProducts } from "@/app/actions/products";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import ProductReel from "@/app/components/ProductReel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import User from "@/lib/database/models/UserModel";
import { constructMetadata, formattedDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Metadata } from "next";
import React from "react";
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const id = params.id;

  const user = await User.findById(id);

  return {
    title: `Shinobi Store - ${user.firstName} ${user.lastName}`,
    openGraph: {
      images: [{ url: user.photo?.imgUrl || "/logo1.jpg" }],
    },
    icons: { icon: user.photo.imgUrl || "/logo1.jpg" },
  };
}

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await User.findById(params.id);
  const page = parseInt(searchParams.page as string, 10) || 1;
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col mb-4 gap-4 items-center justify-between space-x-4">
        <Avatar className="w-40 h-40">
          <AvatarImage src={user.image || `${user.photo?.imgUrl}` || "/avatar.jpg"} />
          <AvatarFallback>{user.firstName}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center">
          <h4 className="text-3xl font-semibold hover:underline duration-200 cursor-pointer">
            {user.firstName} {user.lastName}
          </h4>
          <p className="text-xl">{user.email}</p>
          <div className="flex items-center pt-2">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">Joined{formattedDate(new Date(user.createdAt))}</span>
          </div>
        </div>
      </div>
      <ProductReel
        filters={{ creator: user._id }}
        className=" py-0"
        page={page || 1}
        title={`Products for ${user.firstName}`}
        sort={""}
        paginate={true}
      />
    </MaxWidthWrapper>
  );
};

export default page;
