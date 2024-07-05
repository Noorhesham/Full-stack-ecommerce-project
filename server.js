const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Notification = require("./lib/database/models/NotificationModel.ts");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
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
    socket.on("sendNotification", async (value) => {
      console.log("got", value, Notification);

      const notification = await Notification.create({
        userId: value.userId,
        message: value.message,
        productId: value.productId,
      });
      console.log(notification);
      io.emit("sentNotification", notification);
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
