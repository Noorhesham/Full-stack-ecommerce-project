import mongoose, { Document, Schema } from "mongoose";
export interface ProductImage {
  imgUrl: string;
  publicId: string;
}
export interface ProductProps extends Document {
  name: string;
  price: number;
  stock: number;
  description: string;
  images: ProductImage[];
  category: string;
  createdAt: Date;
  brand: string;
  subCategory: string;
  reviews: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  rating: number;
  published: boolean;
  variations: {
    name: string;
    options: [{ image: { imgUrl: string; public_id: string }; title: string }];
  };
  numReviews: number;
  step: number;
}
const ProductSchema = new Schema<ProductProps>(
  {
    name: { type: String, default: "user" },
    step: { type: Number, default: 1 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    images: { type: [{ imgUrl: String, publicId: String }], default: [] },
    brand: { type: String, default: "" },
    category: { type: String, default: "" },
    subCategory: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    reviews: { type: Schema.Types.ObjectId, ref: "Review" },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    numReviews: { type: Number, default: 0, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("variations", {
  ref: "Variation",
  localField: "_id",
  foreignField: "product",
});

ProductSchema.pre(/^find/, function (this: any, next) {
  this.populate("variations");
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
