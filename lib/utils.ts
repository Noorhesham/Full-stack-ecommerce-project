import { UploadImage } from "@/app/actions/products";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatPrice(
  price: number | string,
  options: { currency?: "USD" | "EUR" | "GBT" | "BDT"; notation?: Intl.NumberFormatOptions["notation"] } = {}
) {
  const { currency = "USD", notation = "compact" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export const uploadToCloudinary = async (formData: any, fn?: any) => {
  const config = {
    onUploadProgress: (progressEvent: any) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(progress);
      fn && fn(progress);
    },
  };

  const res = await axios.post(process.env.NEXT_PUBLIC_PUBLIC_CLOUDINARY_URL!, formData, config);
  const {public_id, secure_url}=res.data
  return {public_id, secure_url}
};
export const  formattedDate = (date:Date)=>date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

