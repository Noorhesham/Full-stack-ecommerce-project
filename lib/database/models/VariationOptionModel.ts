import mongoose, { Schema, Document } from "mongoose";

export interface VariationOptionProps extends Document {
  title: string;
  image?: { imgUrl: string; publicId: string };
  variation: mongoose.Types.ObjectId;
}

const VariationOptionSchema = new Schema<VariationOptionProps>({
  title: { type: String, required: true },
  image: { imgUrl: String, publicId: String },
  variation: { type: Schema.Types.ObjectId, ref: "Variation", required: true },
});

const VariationOption = mongoose.models.VariationOption || mongoose.model<VariationOptionProps>("VariationOption", VariationOptionSchema);
export default VariationOption;
