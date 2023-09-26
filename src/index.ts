import { Server } from "socket.io";
import { createServer } from "http";
import { createUserHandler, getUserContacts } from "./handlers";

const httpsServer = createServer();
const io = new Server(httpsServer, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

io.on("connection", socket => {
  console.log(`a user connected with id ${socket.id}`);

  socket.on("createUser", createUserHandler);

  socket.on("get-contacts", getUserContacts);

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
  });

  socket.on("error", err => {
    console.log("received error from client:", socket.id);
    console.log(err);
  });
});

httpsServer.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
