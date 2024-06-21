import mongoose, { Schema } from "mongoose";

const SubCategorySchema  = new Schema({
  name: { type: String, required: true },
  imageSrc: { type: String, required: true },
  parentCategorey:{type: Schema.Types.ObjectId,ref:'Category',required:true}
  });
  const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", SubCategorySchema);
  export default SubCategory