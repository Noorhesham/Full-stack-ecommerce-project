import { getProduct } from "@/app/actions/products";
import LastFormProduct from "@/app/components/LastFormProduct";
import connect from "@/lib/database/connect";
import { ProductProps } from "@/lib/database/models/ProductsModel";
import Variation from "@/lib/database/models/VariationModel";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  await connect();
  const product: ProductProps | any = await getProduct(id);
  const variants = await Variation.find().lean();
  return <LastFormProduct variations={variants} />;
};

export default page;
