import mongoose, { Schema, Document } from 'mongoose';

export interface VariationProps extends Document {
  name: string;
  options: mongoose.Types.ObjectId[];
}

const VariationSchema = new Schema<VariationProps>({
  name: { type: String, required: true },
  options: [{ type: Schema.Types.ObjectId, ref: 'VariationOption' }],
});

const Variation = mongoose.model<VariationProps>('Variation', VariationSchema);
export default Variation;
