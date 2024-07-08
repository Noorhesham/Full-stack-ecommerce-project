import React from "react";
import { ProductPropsServerProps } from "./ProductReel";
import { getProducts } from "../actions/products";
import ProductCard from "./ProductCard";
import { ProductProps } from "../types";

const ProductReelFetch = async ({ props }: { props: ProductPropsServerProps }) => {
  const { filters, page, pageSize } = props;
  const data = await getProducts(page || 1, pageSize || 10, filters);
  if (!data) return null;
  const { products } = data;
  return products.map((product: ProductProps, i: number) => (
    <ProductCard index={i} key={product.id} product={product} />
  ));
};

export default ProductReelFetch;
