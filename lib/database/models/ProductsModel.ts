import mongoose, { Document, Schema } from "mongoose";
import Category from "./CategoryModel";
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
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  brand: string;
  subCategories: [mongoose.Types.ObjectId];
  reviews: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  rating: number;
  published: boolean;
  variations: {
    variation: mongoose.Types.ObjectId;
    variationOptions: {
      variationOption: mongoose.Types.ObjectId;
      price: number;
      images: ProductImage[];
    }[];
  }[];
  numReviews: number;
  step: number;
  additionalInfo: { title: string; description: string }[];
  isOnSale: boolean;
  salePrice: string;
  ribbon: string;
  status: string;
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
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategories: { type: [Schema.Types.ObjectId], ref: "SubCategory" },
    createdAt: { type: Date, default: Date.now },
    reviews: { type: Schema.Types.ObjectId, ref: "Review" },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    numReviews: { type: Number, default: 0, required: true },
    variations: [
      {
        variation: { type: Schema.Types.ObjectId, ref: "Variation" },
        variationOptions: [
          {
            variationOption: { type: Schema.Types.ObjectId, ref: "VariationOption" },
            price: { type: String, default: '0' },
            images: { type: [{ imgUrl: String, publicId: String }], default: [] },
          },
        ],
      },
    ],
    additionalInfo: [{ title: String, description: String }],
    isOnSale: { type: Boolean },
    salePrice: { type: String },
    ribbon: { type: String },
    status: { type: String, default: "pending" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
ProductSchema.pre("save", function (next) {
  const product = this as ProductProps;
  product.variations.forEach((variation) => {
    variation.variationOptions.forEach((option) => {
      if (option.price === 0) {
        option.price = product.price;
      }
    });
  });

  next();
});

ProductSchema.pre(/^find/, function (this: any, next) {
  this.populate({ path: "category", model: Category });
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
