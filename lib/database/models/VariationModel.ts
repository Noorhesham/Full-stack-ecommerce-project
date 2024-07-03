import mongoose, { Schema, Document } from "mongoose";
import VariationOption, { VariationOptionProps } from "./VariationOptionModel"; // Ensure this import

export interface VariationProps extends Document {
  name: string;
  variationOptions: mongoose.Types.ObjectId[];
}

const VariationSchema = new Schema<VariationProps>(
  {
    name: { type: String, required: true },
    variationOptions: [{ type: Schema.Types.ObjectId, ref: VariationOption }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

VariationSchema.pre(/^find/, function (this: any, next) {
  this.populate({ path: "variationOptions", model: VariationOption });
  next();
});

const Variation = mongoose.models.Variation || mongoose.model<VariationProps>("Variation", VariationSchema);
export default Variation;
