"use server";
import connect from "@/lib/database/connect";
import Category from "@/lib/database/models/CategoryModel";

export async function updateCategory(data: any, id?: string) {
  try {
    await connect();
    if (id) {
      console.log("id", data, id);
      const category = await Category.findById(id);
      if (!category) return { error: "Category not found" };
      category.subCategories = data.subCategories;
      category.name = data.name;
      await category.save();
    }
    const category = await Category.create({
      name: data.name,
      subCategories: data.subCategoreis,
    });
    return {
      success: "Category created successfully!",
      data: { category },
    };
  } catch (error) {
    console.log(error);
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
export async function deleteSubCategory(id: string) {
  try {
    await connect();
    const Category = await Category.findById(id);
    if (!subCategory) {
      throw new Error("SubCategory not found");
    }
    Category.subCategories.remove(id);
    return true;
  } catch (error) {
    console.log(error);
  }
}
