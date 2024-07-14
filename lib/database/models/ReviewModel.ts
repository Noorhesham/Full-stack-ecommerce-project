import mongoose, { Schema } from "mongoose";
export interface ReviewProps {
  rating: number;
  title: string;
  description?: string;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  createdAt: Date;
  _id: string;
  updatedAt: Date;
}
const ReviewSchema = new Schema({
  rating: { type: Number, required: true },
  description: { type: String },
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
