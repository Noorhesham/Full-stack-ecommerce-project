"use server";
import connect from "@/lib/database/connect";
import Category from "@/lib/database/models/CategoryModel";
import { SubCategory } from "@/lib/database/models/SubCategory";
import Variation from "@/lib/database/models/VariationModel";
import VariationOption from "@/lib/database/models/VariationOptionModel";

export async function updateCategoryOrSub(data: any, id?: string, isSub: boolean = false) {
  try {
    console.log(data, id, isSub);
    await connect();
    const Model = isSub ? SubCategory : Category;

    if (id) {
      const item = await Model.findById(id);
      if (!item) return { error: "Category not found" };
      item.name = data.name;
      await item.save();
      const itemObj = JSON.parse(JSON.stringify(item));
      return {
        success: `${isSub ? "Subcategory" : "Category"} updated successfully!`,
        data: { [isSub ? "subCategory" : "category"]: itemObj },
      };
    }

    const item = isSub
      ? await Model.create({ name: data.name, parentCategory: data.parentCategory })
      : await Model.create({ name: data.name });
    console.log(item);
    return {
      success: `${isSub ? "Subcategory" : "Category"} created successfully!`,
      data: { [isSub ? "subCategory" : "category"]: JSON.parse(JSON.stringify(item)) },
    };
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while processing the request" };
  }
}
export async function deleteCategoryOrSub(data: any, id?: string, isSub: boolean = false) {
  try {
    await connect();
    if (!isSub) {
      const category = await Category.findByIdAndDelete(id);
      const subcategoreis = await SubCategory.deleteMany({ parentCategory: id });
      return {
        success: `Category removed successfully with its subcategories !`,
      };
    }
    const item = await SubCategory.findByIdAndDelete(id);
    console.log(item);
    return {
      success: `${isSub ? "Subcategory" : "Category"} removed successfully!`,
    };
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while processing the request" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connect();
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await Category.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.log(error);
  }
}
export async function CreateVariant(data: { name: string; _id?: string; subVariants: [{ name: "" }] }) {
  try {
    console.log(data);
    await connect();
    if (data._id) {
      const variant = await Variation.findByIdAndUpdate(data._id, { name: data.name },{new:true});
      data.subVariants?.forEach(async (subVar: any) => {
        if (subVar._id !== "") {
          const subVariant = await VariationOption.findById(subVar._id);
          if (!subVariant) throw new Error("An error occurred while processing the request. Please try again.");
          subVariant.title = subVar.title;
          await subVariant.save();
          variant.variationOptions.push(subVariant._id)?.fitler((v: any) => v !== subVariant._id);
          const updated=await variant.save();
          const subVariantObg = JSON.parse(JSON.stringify(updated));
          return { success: "Variant updated successfully!", status: 200, data: { variant: subVariantObg } };
        } else {
          const subVariant = await VariationOption.create({ title: subVar.title, variation: variant._id });
          if (!subVariant) throw new Error("An error occurred while processing the request. Please try again.");
          variant.variationOptions.push(subVariant._id);
          const updated=await variant.save();;
          const VariantObg = JSON.parse(JSON.stringify(updated));
          return { success: "Variant updated successfully!", status: 200, data: { variant: VariantObg } };
        }
      });
      if (!variant) throw new Error("An error occurred while processing the request. Please try again.");
      const variantObj = JSON.parse(JSON.stringify(variant));
      console.log(variant);
      return { success: "Variant updated successfully!", status: 200, data: { variant: variantObj } };
    }

    const variant = await Variation.create({ name: data.name });
    if (!variant) throw new Error("An error occurred while processing the request. Please try again.");
    const variantObj = JSON.parse(JSON.stringify(variant));
    return { success: "Variant created successfully!", status: 200, data: { variant: variantObj } };
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while processing the request. Please try again." };
  }
}
export async function DeleteVariant(id: string, option: boolean) {
  try {
    await connect();
    if (option) {
      const variant = await VariationOption.findByIdAndDelete(id);
      if (!variant) throw new Error("An error occurred while processing the request. Please try again.");
      return { success: "Variant deleted successfully!", status: 200 };
    }
    const variant = await Variation.findByIdAndDelete(id);
    const sub = await VariationOption.deleteMany({ variation: id });
    if (!variant) throw new Error("An error occurred while processing the request. Please try again.");
    return { success: "Variant deleted successfully!", status: 200 };
  } catch (error) {
    console.log(error);
  }
}
