import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "parentCategory",
});
CategorySchema.pre(/^find/, function (this: any, next) {
  this.populate("subCategories");
  next();
});
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
