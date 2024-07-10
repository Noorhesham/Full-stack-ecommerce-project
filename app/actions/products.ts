"use server";
import connect from "@/lib/database/connect";
import Product from "@/lib/database/models/ProductsModel";
import { z } from "zod";
import { productStep1Schema, variationSchema } from "../schemas/Schema";
import { v2 as cloudinary } from "cloudinary";
import Variation from "@/lib/database/models/VariationModel";
import User, { UserProps } from "@/lib/database/models/UserModel";
import Category from "@/lib/database/models/CategoryModel";
import { SubCategory } from "@/lib/database/models/SubCategory";
import { revalidatePath } from "next/cache";
import { ProductProps } from "../types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const Notification = require("@/lib/database/models/NotificationModel");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function saveProductStep1(data: z.infer<typeof productStep1Schema>, id: any, update?: string) {
  const validateFields = productStep1Schema.safeParse(data);
  if (!validateFields.success) return { error: "Invalid fields!" };
  const { name, description, category, price, stock, subCategories, additionalInfo, isOnSale, salePrice, ribbon } =
    validateFields.data;
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
        additionalInfo,
        isOnSale,
        salePrice,
        ribbon,
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
      additionalInfo,
      isOnSale,
      salePrice,
      ribbon,
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
export async function reOrderImages(id: string, images: string[]) {
  try {
    await connect();
    const product = await Product.findById(id);
    product.images = images;
    await product.save();
    const productObject = JSON.parse(JSON.stringify(product));
    return { success: "Images re-ordered successfully!", status: 200, data: { product: productObject } };
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while processing the request. Please try again!" };
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
    revalidatePath(`/seller/create-product/${id}/images`);
    return { success: "Image deleted successfully!", status: 200, data: { product: productObject } };
  } catch (error) {
    console.log(error);
  }
}
export async function getProduct(id: string) {
  try {
    await connect();
    const product = await Product.findById(id)
      .populate("category")
      .populate("creator")
      .populate("subCategories")
      .populate({
        path: "variations.variation",
        model: "Variation",
      })
      .populate({
        path: "variations.variationOptions.variationOption",
        model: "VariationOption",
      });
    if (!product) throw new Error("Product not found");
    return { product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilar(id: string) {
  try {
    await connect();
    const product = await Product.findById(id).populate("category");
    if (!product) throw new Error("Product not found");

    const similarProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .limit(5) // Adjust the number of similar products to retrieve
      .populate("category");
    return { similarProducts: JSON.parse(JSON.stringify(similarProducts)) };
  } catch (error) {
    console.log(error);
  }
}
export async function getVariants() {
  try {
    await connect();
    const variants = await Variation.find().lean();
    const variantsObj = JSON.parse(JSON.stringify(variants));
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

export async function getProducts(pageNum = 1, pageSize = 20, filters: any = {}, sort?: any) {
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
    if (filters.search) {
      query.search = { $regex: new RegExp(filters.search, "i") };
    }
    if (filters.isFeatured) {
      query.isFeatured = { $eq: true };
    }
    if (filters._id) {
      query._id = filters._id;
    }
    if (filters.subCategories && filters.subCategories.length > 0) {
      query.subCategories = { $in: filters.subCategories };
    }
    if (filters.price) {
      query.price = { $gte: filters.price.min || 0, $lte: filters.price.max || Infinity };
    }
    const sortCriteria: any = {};
    if (sort) {
      const [sortBy, sortOrder] = sort.split(":");
      sortCriteria[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortCriteria.createdAt = -1;
    }
    console.log(sortCriteria);
    const products = await Product.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort(sortCriteria)
      .populate({
        path: "category",
        model: "Category",
      })
      .populate({
        path: "creator",
        model: "User",
        select: "firstName lastName _id",
      })
      .select("name category status createdAt price images numReviews rating ribbon salePrice isOnSale");
    const productsObj = JSON.parse(JSON.stringify(products));
    const totalCount = await Product.countDocuments(query).lean();
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
export async function toggleFeatured(id: string, value: boolean) {
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    product.isFeatured = value;
    await product.save();
    const productObj = JSON.parse(JSON.stringify(product));
    return { success: "Featured updated successfully!", status: 200, data: { productObj } };
  } catch (error) {}
}
export async function addVariants(data: any, id: string) {
  try {
    const { variation, variationOptions } = data;
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    const existingVariantIndex = product.variations.findIndex((v: any) => v.variation.toString() === variation);
    console.log(variationOptions);
    if (existingVariantIndex > -1) {
      product.variations[existingVariantIndex].variationOptions = variationOptions;
      await product.save();
      const productObj = JSON.parse(JSON.stringify(product));
      return { success: "Variants updated successfully!", status: 200, data: { productObj } };
    } else {
      product.variations.push({ variation, variationOptions });
      await product.save();
      const productObj = JSON.parse(JSON.stringify(product));
      return { success: "Variants added successfully!", status: 200, data: { productObj } };
    }
  } catch (error: any) {
    console.error(error);
    return { error: error.message, status: 500 };
  }
}

export async function deleteVariantOption(productId: string, variationId: string, variationOptionId: string) {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const variant = product.variations.find((v: any) => v.variation.toString() === variationId);
    if (!variant) throw new Error("Variant not found");
    console.log(variant.variationOptions);
    variant.variationOptions.images?.forEach(async (image: any) => {
      if (!image.publicId) return;
      await cloudinary.uploader.destroy(image.publicId);
    });
    variant.variationOptions = variant.variationOptions.filter(
      (option: any) => option.variationOption.toString() !== variationOptionId
    );
    console.log(variant.variationOptions, variationId, variationOptionId, "optionnns");
    await product.save();
    const productObj = JSON.parse(JSON.stringify(product));
    return { success: "Variant option deleted successfully!", status: 200, data: { productObj } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, status: 500 };
  }
}
export async function deleteVariant(productId: string, variationId: string) {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    product.variations = product.variations.filter((variant: any) => variant.variation.toString() !== variationId);

    await product.save();
    const productObj = JSON.parse(JSON.stringify(product));

    return { success: "Variant deleted successfully!", status: 200, data: { productObj } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, status: 500 };
  }
}
export async function deleteVariantOptionImage(
  productId: string,
  variationId: string,
  variationOptionId: string,
  publicId: string
) {
  try {
    console.log(variationId, variationOptionId, publicId);

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    const variant = product.variations.find((v: any) => v.variation.toString() === variationId);
    if (!variant) throw new Error("Variant not found");
    console.log(variant.variationOptions);

    const variantOption = variant.variationOptions.find(
      (option: any) => option.variationOption.toString() === variationOptionId
    );
    if (!variantOption) throw new Error("Variant option not found");

    variantOption.images = variantOption.images.filter((image: any) => image.publicId !== publicId);
    await cloudinary.uploader.destroy(publicId);
    await product.save();
    console.log(variantOption.images);
    const productObj = JSON.parse(JSON.stringify(product));
    return { success: "Image deleted successfully!", status: 200, data: { productObj } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, status: 500 };
  }
}
export async function deleteProduct(id: string) {
  console.log("delete product", id);
  try {
    const session = await getServerSession(authOptions);
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    if (!session?.user.isAdmin || !session?.user.id === product.creator) return { error: "Unauthorized", status: 401 };
    await Product.findByIdAndDelete(id);
    await Notification.deleteMany({ productId: id });
    revalidatePath("/admin/products");
    revalidatePath("/seller/products");
    return { success: "Product deleted successfully!", status: 200, data: null };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, status: 500 };
  }
}
export async function updateStatus(id: string, status: string) {
  try {
    const product = await Product.findByIdAndUpdate(id, { status }, { new: true });
    if (!product) throw new Error("Product not found");
    const productObj = JSON.parse(JSON.stringify(product));
    return { success: "Status updated successfully!", status: 200, data: { productObj } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, status: 500 };
  }
}
export async function handleRead(id: string) {
  await connect();
  await Notification.findByIdAndUpdate(id, { isRead: true });
}

export async function handleDeleteNotification(id: string) {
  await connect();
  await Notification.findByIdAndDelete(id);
}

export const fetchNotifications = async (user: UserProps & any) => {
  await connect();

  let notificationsQuery;
  notificationsQuery = user.isAdmin
    ? Notification.find({ isAdmin: true })
    : Notification.find({ userId: user?.id, isAdmin: false });

  const notifications = await notificationsQuery
    .populate({ path: "productId", model: Product, select: "name" })
    .populate({ path: "userId", model: User, select: "firstName lastName" })
    .lean();

  return notifications;
};
