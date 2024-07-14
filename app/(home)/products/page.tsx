import React from "react";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import ProductReel from "../../components/ProductReel";
import Category from "@/lib/database/models/CategoryModel";
import { notFound } from "next/navigation";
import Filters from "@/app/components/Filters";

const page = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const categoryParam = searchParams.category;
  const sort = searchParams.sort;
  await connect()
  const categoryItem = await Category.findOne({ name: categoryParam }).lean();

  return (
    <MaxWidthWrapper className=" mt-10">
      <section
        id="products"
        className=" w-full  grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 grid gap-4 py-5 mt-5"
      >
        <div className=" py-12 hidden lg:block">
          <Filters onlyPrice />
        </div>
        <div className=" ml-3 col-span-full lg:col-span-2 xl:col-span-3 ">
          <ProductReel
            paginate
            onlyPrice
            filters={{ category: categoryItem && categoryItem }}
            subTitle=" "
            sort={sort}
            title={`Our Products ${categoryItem ? `for ${categoryItem?.name} ` : ""}`}
          />
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default page;
