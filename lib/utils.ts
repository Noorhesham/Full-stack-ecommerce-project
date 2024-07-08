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

export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "v7t8mt9o");
  const config = {
    onUploadProgress: (progressEvent: any) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) {
        onProgress(progress);
      }
    },
  };

  const res = await axios.post(process.env.NEXT_PUBLIC_PUBLIC_CLOUDINARY_URL!, formData, config);
  const { public_id, secure_url } = res.data;
  return { public_id, secure_url };
};
export const formattedDate = (date: Date) => date.toLocaleString("en-US", { month: "long", year: "numeric" });
export function convertToHTML(input: string) {
  // Convert <mark> with data-color attribute
  let html = input;

  // Convert <mark> with data-color attribute
  html = html.replace(/<mark data-color="([^"]+)" style="([^"]+)">([^<]+)<\/mark>/g, 
    '<mark data-color="$1" style="$2">$3</mark>');

  // Convert <a> tags with specific attributes
  html = html.replace(/<a target="_blank" rel="noopener noreferrer nofollow" href="([^"]+)">([^<]+)<\/a>/g, 
    '<a target="_blank" rel="noopener noreferrer nofollow" href="$1">$2</a>');

  // Convert <strong> and <em> tags
  html = html.replace(/<strong>([^<]+)<\/strong>/g, '<strong>$1</strong>');
  html = html.replace(/<em>([^<]+)<\/em>/g, '<em>$1</em>');

  // Convert <p> tags
  html = html.replace(/<p>([^<]+)<\/p>/g, '<p>$1</p>');

  // Convert <ol> and <li> tags
  html = html.replace(/<ol>(.*?)<\/ol>/gs, '<ol>$1</ol>');
  html = html.replace(/<li>([^<]+)<\/li>/g, '<li>$1</li>');

  // Convert <h2> tags with class attributes
  html = html.replace(/<h2 class="([^"]+)" levels="2">([^<]+)<\/h2>/g, '<h2 class="$1">$2</h2>');

  // Convert <div> tags with class attributes
  html = html.replace(/<div class="([^"]+)">([^<]+)<\/div>/g, '<div class="$1">$2</div>');

  return html;
}
