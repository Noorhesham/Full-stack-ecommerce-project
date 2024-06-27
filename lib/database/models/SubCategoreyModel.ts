import { Schema } from "mongoose";
import { Document } from "mongoose";

interface SubCategoryProps extends Document {
  name: String;
  category: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const SubCategorySchema = new Schema<SubCategoryProps>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
