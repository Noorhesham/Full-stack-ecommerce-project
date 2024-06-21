"use server";
import connect from "@/lib/database/connect";
import Product from "@/lib/database/models/ProductsModel";
import { z } from "zod";
import { productStep1Schema } from "../schemas/Schema";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function saveProductStep1(data: z.infer<typeof productStep1Schema>, id: any) {
  const validateFields = productStep1Schema.safeParse(data);
  if (!validateFields.success) return { error: "Invalid fields!" };
  const { name, description, category } = validateFields.data;
  await connect();

  try {
    const product = await Product.create({
      name,
      description,
      category,
      creator: id,
      price: 10,
      step: 2,
    });
    return { success: "Product created successfully!", status: 200, product };
  } catch (error: any) {
    const validationErrors = Object.values(error.errors).map((error: any) => error.message);
    if (validationErrors) return validationErrors;
    return { error: "An error occurred while processing the request. Please try again!" };
  }
}
export async function UploadImage(formData: any, id: string) {
  try {
    const data = await axios(process.env.NEXT_PUBLIC_PUBLIC_CLOUDINARY_URL!, {
      method: "POST",
      body: formData,
      mode: "cors",
    });
    const res = await data.json();
    const imgUrl = res.secure_url;
    const publicId = res.public_id;
    if (!imgUrl) throw new Error("An error occurred while processing the request. Please try again!");
    await connect();
    const product = await Product.findById(id);
    product.images.push({ imgUrl, publicId });
    product.step = 3;
    await product.save();
    console.log(res, product);
    const productObject =  JSON.parse(JSON.stringify(product))

    return { success: "Image uploaded successfully!", status: 200, data: { product:productObject } };
  } catch (error) {
    console.log(error);
  }
}

export async function updateImage(formData: any, id: string, url: string) {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_PUBLIC_CLOUDINARY_URL!, {
      method: "POST",
      body: formData,
      mode: "cors",
    });
    const res = await data.json();
    const imgUrl = res.secure_url;
    if (!imgUrl) throw new Error("An error occurred while processing the request. Please try again!");
    await connect();
    const product = await Product.findById(id);
    const filteredImages = product.images.filter((image: string) => image !== url);
    product.images = filteredImages.length ? filteredImages : [];
    await product.save();
    console.log(res, product);
    return { success: "Image updated successfully!", status: 200, data: { product } };
  } catch (error) {
    console.log(error);
  }
}
export async function deleteImage(id: string, url: string, publicId: string) {
  try {
    await connect();

    const result = await cloudinary.uploader.destroy(publicId);
    if (!result) throw new Error("An error occurred while processing the request. Please try again!");
    const product = await Product.findById(id);
    product.images = product?.images.filter((image: any) => image.imgUrl !== url);
    if (!product.images) product.images = [];

    await product.save();
    const productObject =  JSON.parse(JSON.stringify(product))
    return { success: "Image deleted successfully!", status: 200, data: { product:productObject } };
  } catch (error) {
    console.log(error);
  }
}
export async function getProduct(id: string) {
  try {
    await connect();
    const product = await Product.findById(id);
    console.log(product);
    return { product: product.toObject() };
  } catch (error) {
    console.log(error);
  }
}
