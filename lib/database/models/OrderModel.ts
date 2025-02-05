const mongoose = require("mongoose");

const { Schema } = mongoose;
const OrderSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: {
      type: [
        {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          variants: [String],
        },
      ],
      ref: "Product",
    },
    status: { type: String, default: "pending" },
    payment: { type: String, default: "pending" },
    shippingAddress: { type: String, required: true },
    city: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true, default: 0.0 },
    paidAt: { type: Date },
    isDelieverd: { type: Boolean, default: false, required: true },
    deliveredAt: { type: Date },
    infoAttributes: { type: [Schema.Types.ObjectId], default: [], ref: "Info" },
    variations: { type: [Schema.Types.ObjectId], default: [], ref: "Variation" },
    isPaid: { type: Boolean, default: false, required: true },
    receipt_url: { type: String },
    isEmailSent: { type: Boolean, default: false },
    sellers: { type: [Schema.Types.ObjectId], default: [], ref: "User" },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
module.exports = Order;
