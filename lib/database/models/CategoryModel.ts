import mongoose, { Schema } from "mongoose";
import { SubCategory } from "./SubCategory";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true,unique: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "parentCategory",
});
CategorySchema.pre(/^find/, function (this: any, next) {
  this.populate({ path: "subCategories", model: SubCategory });
  next();
});
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
