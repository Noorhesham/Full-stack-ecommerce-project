import mongoose, { Schema } from "mongoose";
export interface ActivationProps {
  token: string;
  status: string;
  createdAt: Date;
  updatedAt: Date
  user:mongoose.Types.ObjectId
}
const ActivationSchema = new Schema({
  token: { type: String, required: true },
  status: { type: String, default: "pending", unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  activatedAt: { type: Date },
  user:{type: Schema.Types.ObjectId,ref:'User'}
});

const Activation = mongoose.models.Activation || mongoose.model<ActivationProps>("Activation", ActivationSchema);
export default Activation;
