"use server";
import connect from "@/lib/database/connect";
import Product from "@/lib/database/models/ProductsModel";
import { z } from "zod";
import { productStep1Schema, variationSchema } from "../schemas/Schema";
import { v2 as cloudinary } from "cloudinary";
import Variation from "@/lib/database/models/VariationModel";
import VariationOption from "@/lib/database/models/VariationOptionModel";
import User from "@/lib/database/models/UserModel";
import Category from "@/lib/database/models/CategoryModel";
import { SubCategory } from "@/lib/database/models/SubCategory";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function saveProductStep1(data: z.infer<typeof productStep1Schema>, id: any, update?: string) {
  const validateFields = productStep1Schema.safeParse(data);
  if (!validateFields.success) return { error: "Invalid fields!" };
  const { name, description, category, price, stock, subCategories } = validateFields.data;
  await connect();

  try {
    if (update) {
      const existingProduct = await Product.findByIdAndUpdate(update, {
        name,
        description,
        category,
        price: +price,
        stock,
        subCategories,
      });
      const productObject = JSON.parse(JSON.stringify(existingProduct));
      return { success: "Product created successfully!", status: 200, data: { productObject } };
    }
    const product = await Product.create({
      name,
      description,
      category,
      creator: id,
      price: +price,
      stock,
      step: 2,
      subCategories,
    });
    const productObject = JSON.parse(JSON.stringify(product));
    return { success: "Product created successfully!", status: 200, data: { productObject } };
  } catch (error: any) {
    console.log(error);
    const validationErrors = Object.values(error.errors).map((error: any) => error.message);
    if (validationErrors) return validationErrors;
    return { error: "An error occurred while processing the request. Please try again!" };
  }
}
export async function UploadImage(res: any, id: string) {
  try {
    const imgUrl = res.secure_url;
    const publicId = res.public_id;
    if (!imgUrl) throw new Error("An error occurred while processing the request. Please try again!");
    await connect();
    const product = await Product.findById(id);
    product.images.push({ imgUrl, publicId });
    product.step = 3;
    await product.save();
    console.log(res, product);
    const productObject = JSON.parse(JSON.stringify(product));

    return { success: "Image uploaded successfully!", status: 200, data: { product: productObject } };
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
    const productObject = JSON.parse(JSON.stringify(product));
    return { success: "Image deleted successfully!", status: 200, data: { product: productObject } };
  } catch (error) {
    console.log(error);
  }
}
export async function getProduct(id: string) {
  try {
    await connect();
    const product = await Product.findById(id);
    return { product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.log(error);
  }
}


export async function getVariants() {
  try {
    await connect();
    const variants = await Variation.find();
    const variantsObj = JSON.parse(JSON.stringify(variants));
    console.log(variantsObj);
    return variantsObj;
  } catch (error) {
    console.log(error);
  }
}
export async function getCategories() {
  try {
    await connect();
    const categories = await Category.find();
    const categoriesObj = JSON.parse(JSON.stringify(categories));
    return categoriesObj;
  } catch (error) {
    console.log(error);
  }
}
export async function getSubCategories(parentId: string) {
  try {
    await connect();
    const categories = await SubCategory.find({
      parentCategory: parentId,
    });
    const categoriesObj = JSON.parse(JSON.stringify(categories));
    return categoriesObj;
  } catch (error) {
    console.log(error);
  }
}

export async function getProducts(pageNum = 1, pageSize = 10, filters: any = {}) {
  try {
    await connect();
    const skip = (pageNum - 1) * pageSize;
    const query: any = {};
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.price) {
      query.price = { $gte: filters.price.min, $lte: filters.price.max };
    }
    const products = await Product.find(query).skip(skip).limit(pageSize);
    const productsObj = JSON.parse(JSON.stringify(products));
    const totalCount = await Product.countDocuments(query);

    return {
      products: productsObj,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: pageNum,
      totalProducts: totalCount,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getStats() {
  try {
    await connect();
    const usersCount = await User.countDocuments({});
    const productCount = await Product.countDocuments({});
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    return { usersCount, productCount, stats };
  } catch (error) {
    console.log(error);
  }
}
