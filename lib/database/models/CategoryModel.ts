import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    subCategories: { type: [{ name: String, imageSrc: String }], default: [] },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
