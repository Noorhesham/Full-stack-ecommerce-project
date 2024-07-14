import mongoose, { Schema } from "mongoose";

export interface subCategoryProps {
  name: string;
  _id: string;
  imageSrc: { type: String; required: true };
  parentCategory: { type: Schema.Types.ObjectId; ref: "Category"; required: true };
}
const SubCategorySchema = new Schema<subCategoryProps>(
  {
    name: { type: String, required: true, unique: true },
    imageSrc: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const SubCategory =
  mongoose.models.SubCategory || mongoose.model<subCategoryProps>("SubCategory", SubCategorySchema);
