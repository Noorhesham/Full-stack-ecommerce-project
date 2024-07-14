import React from "react";
import { ProductPropsServerProps } from "./ProductReel";
import { getProducts } from "../actions/products";
import ProductCard from "./ProductCard";
import { ProductProps } from "../types";
import NotFound from "./NotFound";
import { PaginationDemo } from "./Pagination";

/*
3.update ui for login and signup and add country dropdown
4.naruto styles 
5.naruto website 
6.orders page
7.charts for orders and money 
8.users 
user managment form
.metadata for seo
10.emails style
*/
const ProductReelFetch = async ({ props }: { props: ProductPropsServerProps }) => {
  const { filters, page, pageSize, sort, paginate } = props;
  const data = await getProducts(page || 1, pageSize || 10, filters, sort);
  if (!data) return null;
  const { products, totalPages } = data;
  return (
    <>
      {products.length > 0 && (
        <>
          {products.map((product: ProductProps, i: number) => (
            <ProductCard index={i} key={product.id} product={product} />
          ))}
          {paginate && <PaginationDemo totalPages={totalPages} />}
        </>
      )}
      {products.length === 0 && <NotFound text="Sorry , we couldn't find what you were looking for." />}
    </>
  );
};

export default ProductReelFetch;
