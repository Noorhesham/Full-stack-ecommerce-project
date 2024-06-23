import AddImagesForm from "@/app/components/ImageForm";
import Product from "@/lib/database/models/ProductsModel";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  return (
      <AddImagesForm  productId={params.id} />
  );
};

export default page;
