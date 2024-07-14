const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("./lib/database/models/NotificationModel.ts");
const bodyParser = require("body-parser");
const stripeWebhookHandler = require("./app/api/webhooks/route.js").POST; // Import the webhook handler function
// Import the webhook handler function
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const express = require("express");
  const expressApp = express();
  expressApp.use(bodyParser.raw({ type: "application/json" }));

  expressApp.post("/api/webhooks", async (req, res) => {
    console.log(req.body, req.headers);
    await stripeWebhookHandler(req, res); // Call the webhook handler
  });

  const httpServer = createServer((req, res) => {
    if (req.url.startsWith("/api/webhooks")) {
      expressApp(req, res);
    } else {
      handler(req, res);
    }
  });

  const io = new Server(httpServer);

  mongoose
    .connect(process.env.MONGO_URI, { dbName: "learning", bufferCommands: false })
    .then(() => console.log("DB connected successfully!"))
    .catch((err) => console.log(err));

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("joinRoom", (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined the room`);
    });

    socket.on("sendNotification", async (value, userId) => {
      const notification = await Notification.create({
        userId: value.userId,
        message: value.message,
        productId: value.productId,
        isAdmin: true,
      });
      const populatedNotification = await Notification.findById(notification._id)
        .populate({ path: "productId", select: "name" })
        .populate({ path: "userId", select: "firstName lastName" })
        .lean();
      console.log(value, userId);
      io.to(typeof userId === "string" ? userId : userId.toString()).emit("sentNotification", populatedNotification);
    });
    socket.on("statusOrderUpdate", async (value,userId) => {
      console.log(value);
      const notification = await Notification.create({
        userId: value.userId,
        message: value.message,
        isAdmin: value.isAdmin,
      });
      const populatedNotification = await Notification.findById(notification._id)
        .populate({ path: "userId", select: "firstName lastName" })
        .lean();
      console.log(populatedNotification, value.userId);
      io.to(userId).emit("sentNotification", populatedNotification);
    });
    socket.on("AcceptProduct", async (value, userId) => {
      const notification = await Notification.create({
        userId: value.userId,
        message: value.message || "Your product has been accepted and is public.",
        productId: value.productId,
      });
      const populatedNotification = await Notification.findById(notification._id)
        .populate({ path: "userId", select: "firstName lastName" })
        .lean();
      io.to(userId.toString()).emit("sentNotification", populatedNotification);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
