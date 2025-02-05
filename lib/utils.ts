import { UploadImage } from "@/app/actions/products";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
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
  html = html.replace(
    /<mark data-color="([^"]+)" style="([^"]+)">([^<]+)<\/mark>/g,
    '<mark data-color="$1" style="$2">$3</mark>'
  );

  // Convert <a> tags with specific attributes
  html = html.replace(
    /<a target="_blank" rel="noopener noreferrer nofollow" href="([^"]+)">([^<]+)<\/a>/g,
    '<a target="_blank" rel="noopener noreferrer nofollow" href="$1">$2</a>'
  );

  // Convert <strong> and <em> tags
  html = html.replace(/<strong>([^<]+)<\/strong>/g, "<strong>$1</strong>");
  html = html.replace(/<em>([^<]+)<\/em>/g, "<em>$1</em>");

  // Convert <p> tags
  html = html.replace(/<p>([^<]+)<\/p>/g, "<p>$1</p>");

  // Convert <ol> and <li> tags
  html = html.replace(/<ol>(.*?)<\/ol>/gs, "<ol>$1</ol>");
  html = html.replace(/<li>([^<]+)<\/li>/g, "<li>$1</li>");

  // Convert <h2> tags with class attributes
  html = html.replace(/<h2 class="([^"]+)" levels="2">([^<]+)<\/h2>/g, '<h2 class="$1">$2</h2>');

  // Convert <div> tags with class attributes
  html = html.replace(/<div class="([^"]+)">([^<]+)<\/div>/g, '<div class="$1">$2</div>');

  return html;
}

export function debounce(fn: any, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    timeout = setTimeout(() => fn(...args), delay);
    clearTimeout(timeout);
  };
}
export const calculateFinalPrice = (price: any, variants: any, variations: any) => {
  let basePrice = typeof price === "number" ? price : +price?.replace("$", "");
  if (!variants || !variations) return basePrice;

  variants.forEach((variantId: string) => {
    variations.forEach((variation: any) => {
      const option = variation.variationOptions.find((vo: any) => vo._id == variantId);
      if (option && typeof option.price === "string") {
        basePrice += +option.price.replace("$", "") || 0;
      }
    });
  });

  return basePrice;
};
export function constructMetadata({
  title = "Shinobi Store - Your market place to sell any product or buy products for best prices ! ",
  description = "Shinobi Store is an open-source marketplace for high-quality digital goods.",
  image = "/logo1.jpg",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons: {
      icon: image || "/favicon.ico",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@NoorHesham",
    },
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
