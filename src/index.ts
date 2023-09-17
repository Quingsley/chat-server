import { Server } from "socket.io";
import { createServer } from "http";

const httpsServer = createServer();
const io = new Server(httpsServer, {});
io.on("connection", socket => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("typing", data => {
    console.log(data);
    io.emit("typing", data);
  });

  socket.on("message", data => {
    console.log(data);
    io.emit("message", data);
  });
  socket.on("disconnect", () => {
    console.log("client disconnect...", socket.id);
    // handleDisconnect()
  });

  socket.on("error", err => {
    console.log("received error from client:", socket.id);
    console.log(err);
  });
});

httpsServer.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
