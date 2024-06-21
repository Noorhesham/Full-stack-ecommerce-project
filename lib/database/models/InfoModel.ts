import mongoose from "mongoose";
import { Schema } from "mongoose";

const InfoSchema = new Schema<any>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

const Info = mongoose.models.Info || mongoose.model("Info", InfoSchema);
export default Info