import express, { Express, Request, Response } from "express";
import http from "http";
import next from "next";
import connectDB from "./utilsServer/connectDB";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
} from "./socket/socketEvents";
import {
  addUser,
  removeUser,
  findConnectedUser,
} from "./utilsServer/roomActions";
import {
  loadMessages,
  sendMessage,
  setMessageToUnread,
  markChatRead,
  markMessagesRead,
  deleteMessage,
  deleteChat,
} from "./utilsServer/chatHelper";

const app: Express = express();
const server = new http.Server(app);

//functionalities for app
app.use(express.json());

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(server);

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket: Socket) => {
  socket.on("join", async (data) => {
    const users = await addUser(data.userId, socket.id);
    setInterval(() => {
      socket.emit("connectedUsers", {
        users: users.filter((user) => user.userId !== data.userId),
      });
    }, 10000);
  });

  socket.on("disconnectUser", async () => {
    await removeUser(socket.id);
  });

  socket.on("loadMessages", async (data) => {
    const { owner, chatWith } = data;
    const chat = await loadMessages(owner, chatWith);
    socket.emit("messagesLoaded", { chat });
  });

  socket.on("sendMessage", async (data) => {
    const { owner, chatWith, text, username, profilepic } = data;
    const message = await sendMessage(owner, chatWith, text);

    const receiverSocket = findConnectedUser(chatWith);
    if (message) {
      socket.emit("messageSent", { message });
    }

    if (message && receiverSocket) {
      await setMessageToUnread(chatWith);
      io.to(receiverSocket).emit("newMessageReceived", {
        message,
        chatWith: owner,
        chatWith_username: username,
        chatWith_profilePic: profilepic,
      });
      io.to(receiverSocket).emit("updateChatBox", {
        message,
        chatWith: owner,
      });
    }
  });

  socket.on("markRead", async (data) => {
    const { owner, chatWith } = data;
    await markChatRead(owner, chatWith);
  });

  socket.on("markMessagesRead", async (data) => {
    const { userId } = data;
    await markMessagesRead(userId);
  });

  socket.on("deleteMessage", async (data) => {
    const { owner, chatWith, messageId } = data;
    const success = await deleteMessage(owner, chatWith, messageId);
    if (success) {
      socket.emit("msgDeleteSuccessful", { messageId: messageId });
    }
  });

  socket.on("deleteChat", async (data) => {
    const { owner, chatWith } = data;
    const success = await deleteChat(owner, chatWith);
    if (success) {
      socket.emit("deleteChatSuccessful", { chatWith: chatWith });
    }
  });

  //video calling part
  socket.on("joinRoom", (roomName) => {
    const { rooms } = io.sockets.adapter;
    const room = rooms.get(roomName);

    //no such room
    if (room == undefined) {
      socket.join(roomName);
      socket.emit("roomCreated");
    } else if (room.size == 1) {
      socket.join(roomName);
      socket.emit("roomJoined");
    } else {
      socket.emit("roomFull");
    }
  });

  // Triggered when the person who joined the room is ready to communicate.
  socket.on("readyToCommunicate", (roomName) => {
    socket.broadcast.to(roomName).emit("readyToCommunicate");
  });

  // Triggered when server gets an icecandidate from a peer in the room.
  socket.on("iceCandidate", (candidate, roomName: string) => {
    socket.broadcast.to(roomName).emit("iceCandidate", candidate);
  });

  // Triggered when server gets an offer from a peer in the room.
  socket.on("offer", (offer, roomName) => {
    socket.broadcast.to(roomName).emit("offer", offer);
  });

  // Triggered when server gets an answer from a peer in the room
  socket.on("answer", (answer, roomName) => {
    socket.broadcast.to(roomName).emit("answer", answer);
  });

  socket.on("leave", (roomName) => {
    console.log("left");
    socket.leave(roomName);
    socket.broadcast.to(roomName).emit("leave");
  });

  socket.on("sendVideoMessage", (msg, roomName) => {
    socket.broadcast.to(roomName).emit("newVideoMessage", msg);
    socket.emit("videoMessageSucessfullySent", msg);
  });

  socket.on("videoCallUser", (userId, roomName, caller, callerId) => {
    console.log(userId, roomName, caller, callerId);
    const receiverSocket = findConnectedUser(userId);
    if (!receiverSocket) {
      socket.emit("callReject", "User not online");
    } else {
      console.log("receiversocket", receiverSocket);
      io.to(receiverSocket).emit(
        "incomingVideoCall",
        roomName,
        caller,
        callerId
      );
    }
  });

  socket.on("callReject", (userId) => {
    const receiverSocket = findConnectedUser(userId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("callReject", "user rejected the call");
    }
  });
});

const handle = nextApp.getRequestHandler();
connectDB();

nextApp.prepare().then(() => {
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/auth", require("./api/auth"));
  app.use("/api/features", require("./api/features"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/notifications", require("./api/notifications"));
  app.use("/api/messages", require("./api/messages"));
  app.use("/api/reset", require("./api/reset"));
  app.all("*", (req, res) => handle(req, res));
  server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});
