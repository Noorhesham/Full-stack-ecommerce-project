import mongoose, { Schema, Document } from "mongoose";
export interface VariationProps extends Document {
  name: string;
  variationOptions: mongoose.Types.ObjectId[];
}

const VariationSchema = new Schema<VariationProps>(
  {
    name: { type: String, required: true },
    variationOptions: { type: [Schema.Types.ObjectId], ref: "VariationOption" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

VariationSchema.pre(/^find/, function (this: any, next) {
  this.populate("variationOptions");
  next();
});

const Variation = mongoose.models.Variation || mongoose.model<VariationProps>("Variation", VariationSchema);
export default Variation;
