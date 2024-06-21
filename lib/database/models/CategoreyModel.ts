import mongoose, { Schema } from "mongoose";

const CategoreySchema = new Schema({
  name: { type: String, required: true },
  subCategoreis: [{ type: Schema.Types.ObjectId, ref: "SubCategorey" }],
});
const Categorey = mongoose.models.Categorey || mongoose.model("Categorey", CategoreySchema);
export default Categorey;
