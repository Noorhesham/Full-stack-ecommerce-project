"use client";
import { ShoppingCartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { ReactNode, useEffect, useState } from "react";
import { useGetCart, useUpdateCart } from "../queries/queries";
import { TbShoppingCartOff } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import Counter from "./Counter";
const AddToCart = ({
  productId,
  btn,
  stock,
  variantId,
  price,
}: {
  productId: string;
  btn?: boolean;
  stock: number;
  variantId?: any[];
  price: number;
}) => {
  const { cartItems, isLoading } = useGetCart();
  const [localCart, setLocalCart] = useState([]);
  useEffect(() => {
    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setLocalCart(cart);
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const { updateCart, isPending } = useUpdateCart();
  const session = useSession();

  const addToCartLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...cart, { productId, variantId }]));
    window.dispatchEvent(new Event("storage"));
  };
  const handleDecrement = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productIndex = cart.findIndex((p: any) => p.productId == productId);
    if (productIndex !== -1) {
      cart.splice(productIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const isInCart = session.data?.user
    ? cartItems?.some((p: any) => p._id === productId)
    : localCart.some((p: any) => p.productId === productId);
  const cartLength = session.data?.user
    ? cartItems?.filter((p: any) => p._id === productId).length
    : localCart.filter((p: any) => p.productId === productId).length;
  return btn ? (
    <>
      {isInCart && (
        <Counter
          length={cartLength}
          onDecrement={() =>
            session.data?.user ? updateCart({ data: { productId }, remove: true }) : handleDecrement()
          }
          max={stock}
          onAdd={() => {
            session.data?.user
              ? updateCart({ data: { productId, variantId }, remove: false })
              : addToCartLocalStorage();
          }}
        />
      )}
      <Button
        onClick={(e) => {
          e.preventDefault();
          session.data?.user
            ? updateCart({ data: { productId, variantId }, remove: isInCart })
            : addToCartLocalStorage();
        }}
        size={"lg"}
        className=" w-full"
      >
        {isInCart ? "Remove from cart" : "Add to cart"}
      </Button>
    </>
  ) : (
    <div
      onClick={(e) => {
        e.preventDefault();
        session.data?.user ? updateCart({ data: { productId }, remove: isInCart }) : addToCartLocalStorage();
      }}
      className="w-7 h-7 rounded-full hover:scale-110 hover:shadow-md shadow-sm  bg-gray-200 hover:bg-white transition cursor-pointer  p-1"
    >
      {isInCart ? (
        <TbShoppingCartOff className=" text-center w-4 h-4 m-auto " />
      ) : (
        <ShoppingCartIcon className=" text-center w-4 h-4 m-auto " />
      )}
    </div>
  );
};

export default AddToCart;
