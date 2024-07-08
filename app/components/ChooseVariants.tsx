"use client";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ProductProps } from "@/lib/database/models/ProductsModel";
import React, { useEffect } from "react";
import { VariationProps } from "../types";
import { useRouter, useSearchParams } from "next/navigation";

const ChooseVariants = ({ product, i, variation }: { product: ProductProps; i: number; variation: VariationProps }) => {
  const [isActive, setActive] = React.useState({
    variationOption: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    //@ts-ignore
    searchParams.get(`option${i}`) && setActive({ variationOption: searchParams.get(`option${i}`) });
  }, [searchParams, i]);

  const handleVariantChange = (id: any) => {
    if (isActive.variationOption === id) {
      setActive({ variationOption: "" });
      const params = new URLSearchParams(searchParams);
      params.delete(`option${i}`);
      router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
      return;
    } else {
      const params = new URLSearchParams(searchParams);
      params.set(`option${i}`, id);
      router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
      setActive({ variationOption: id });
    }
  };

  return (
    <div className="flex items-center gap-1" key={variation._id}>
      <Label className="flex-[10%]">{variation.name}</Label>
      <div className="flex flex-grow items-center gap-1">
        {product.variations[i].variationOptions.map((value: any) => {
          console.log(value);
          return (
            <Badge
              onClick={() => handleVariantChange(value._id)}
              className={`${
                isActive.variationOption === value._id ? "bg-primary text-white" : "bg-gray-200 text-gray-800"
              } cursor-pointer hover:text-gray-50`}
              key={value._id}
            >
              {value.variationOption.title}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseVariants;
