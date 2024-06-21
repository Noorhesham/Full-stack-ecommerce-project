import mongoose, { Schema, Document } from 'mongoose';

export interface VariationOptionProps extends Document {
  name: string;
  value: string;
  image?: string;
}

const VariationOptionSchema = new Schema<VariationOptionProps>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  image: { type: String },
});

const VariationOption = mongoose.model<VariationOptionProps>('VariationOption', VariationOptionSchema);
export default VariationOption;
