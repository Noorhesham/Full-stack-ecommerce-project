const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  productId: { type: String, ref: "Product", required: true,unique: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// @ts-ignore
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
