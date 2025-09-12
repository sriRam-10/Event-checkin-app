import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "./utils";

const prisma = new PrismaClient();
const app = express();

// ✅ Enable CORS for frontend access
app.use(cors());

const httpServer = http.createServer(app);

// ✅ Setup Socket.io
const io = new Server(httpServer, { 
  cors: { origin: "*" } 
});

// ✅ Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = getUserFromToken(token);
    return { prisma, io, user };
  },
});

async function startServer() {
  try {
    await server.start();

    // ✅ Attach Apollo middleware to Express
   server.applyMiddleware({ app: app as any });

    // ✅ Socket.io connection
    io.on("connection", (socket) => {
      console.log("🔌 User connected to Socket.io");

      socket.on("disconnect", () => {
        console.log("❌ User disconnected");
      });
    });

    // ✅ Start server
    httpServer.listen(4000, () => {
      console.log(
        `🚀 Server running at http://localhost:4000${server.graphqlPath}`
      );
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

startServer();
