import { Server } from "socket.io";
import { socketHandler } from "./socket";
import { httpsServer } from "./http";
import { authMiddleware } from "./socket/middlewares";

const io = new Server(httpsServer, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

io.use(authMiddleware);
io.on("connection", socket => socketHandler(socket, io));

httpsServer.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});

//TODOS:
//onConnection check for any rooms and join them
// join contacts to a room once a contact is created (in progress)
// draw the structure of my models and how they relate to each other and flow of events(already in paper)
// reduce number of events to group-chat and private-chat, and join
//migration to using a db
//figure how to handle acknowledgements
//figure out how to handle pending messages & acknowledgements
//
