import { Server } from "socket.io";

let ioInstance = null;

export const initializeSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for development; restrict in production
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle admin joining the "admins" room
    socket.on("joinAdmin", () => {
      socket.join("admins");
      console.log(`Admin joined: ${socket.id}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return ioInstance;
};

export const getSocketInstance = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO is not initialized. Call initializeSocket first.");
  }
  return ioInstance;
};