import React from "react";
import { formatPrice } from "@/lib/utils";

const Price = ({ price, isOnSale, salePrice }: { price: number; isOnSale: boolean; salePrice: number }) => {
  return (
    <div className="font-medium text-gray-900">
      {isOnSale ? (
        <p className="flex items-center gap-1 flex-col">
          {formatPrice(price - salePrice)}
          <span className="text-gray-500 line-through">{formatPrice(price)}</span>
        </p>
      ) : (
        formatPrice(price)
      )}
    </div>
  );
};

export default Price;
    