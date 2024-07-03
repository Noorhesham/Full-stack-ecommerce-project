"use client";
import React, { createContext, useContext } from "react";
import { ProductProps } from "../types";

interface ProductContextProps {
  product: ProductProps |undefined;
}

const ProductContext = createContext<ProductContextProps>({ product: undefined });

export const ProductProvider = ({ children, product }: { children: React.ReactNode; product: ProductProps }) => {
  return <ProductContext.Provider value={{ product }}>{children}</ProductContext.Provider>;
};

export const useProduct = () => useContext(ProductContext);
