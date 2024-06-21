import AddImagesForm from "@/app/components/ImageForm";
import Product from "@/lib/database/models/ProductsModel";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  return (
    <div className="   bg-gray-100  overflow-hidden">
      <AddImagesForm  productId={params.id} />
    </div>
  );
};

export default page;
