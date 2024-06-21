import mongoose, { Document, Schema } from "mongoose";
interface Variation {
    name: string;
    options: string[];
  }
  
  interface InfoAttributes {
    name: string;
    value: string;
  }
export interface OrderProps {
  name: string;
  price: number;
  createdAt: Date;
  user: string;
  products: [mongoose.Types.ObjectId];
  status: string;
  payment: string;
  shippingAddress: string;
  paymentMethod: string;
  variations: Variation[];
  infoAttributes: InfoAttributes[];
}
const OrderSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [Schema.Types.ObjectId], ref: "Product", required: true },
    status: { type: String, default: "pending" },
    payment: { type: String, default: "pending" },
    shippingAddress: { type: String, required: true },
    country: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true, default: 0.0 },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false, required: true },
    deliveredAt: { type: Date },
    infoAttributes: { type: [Schema.Types.ObjectId], default: [],ref:'Info' },
    variations: { type: [Schema.Types.ObjectId], default: [] ,ref:'Variation'},
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
