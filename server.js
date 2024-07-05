const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("./lib/database/models/NotificationModel.ts");

const dev = process.env.NODE_ENV !== "production";
const hostname = "https://shopify-khaki-nine.vercel.app/";
const port = 3000;
const app = next({ dev, hostname,  });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

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

    //listening to notifications from user to admin
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
      console.log(notification, populatedNotification);
      //sending notifications to admin
      io.to(userId.toString()).emit("sentNotification", populatedNotification);
    });

    //listening to notifications from admin to specific user
    socket.on("AcceptProduct", async (value, userId) => {
      const notification = await Notification.create({
        userId: value.userId,
        message: value.message="Your product has been accepted and is  public.",
        productId: value.productId,
      });
      const populatedNotification = await Notification.findById(notification._id)
        .populate({ path: "productId", select: "name" })
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
