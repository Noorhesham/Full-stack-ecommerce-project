import mongoose, { Schema, Document } from "mongoose";

export interface VariationProps extends Document {
  name: string;
  options: mongoose.Types.ObjectId[];
  product: mongoose.Types.ObjectId;
}

const VariationSchema = new Schema<VariationProps>(
  {
    name: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
VariationSchema.virtual("variationOptions", {
  ref: "VariationOption",
  localField: "_id",
  foreignField: "variation",
});
VariationSchema.pre("save", async function (next) {
  const variation = this as VariationProps;
  const existingVariations = await mongoose.models.Variation.countDocuments({ product: variation.product });
  if (existingVariations >= 4) {
    const error = new Error("Cannot add more than 4 variations to a product");
    return next(error);
  }
  next();
});
VariationSchema.pre(/^find/, function (this: any, next) {
  this.populate("variationOptions");
  next();
});

const Variation = mongoose.models.Variation || mongoose.model<VariationProps>("Variation", VariationSchema);
export default Variation;
