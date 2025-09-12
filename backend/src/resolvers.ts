import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // ⚠️ Set in .env

export const resolvers = {
  Query: {
    events: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return prisma.event.findMany({
        include: { attendees: true },
      });
    },

    event: async (_: any, { id }: { id: string }, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return prisma.event.findUnique({
        where: { id },
        include: { attendees: true },
      });
    },

    me: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return prisma.user.findUnique({ where: { id: user.id } });
    },
  },

  Mutation: {
    login: async (_: any, { email }: { email: string }) => {
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Auto-create user if not exists
        user = await prisma.user.create({
          data: { email, name: email.split("@")[0] },
        });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
      return { token, user };
    },

    checkIn: async (_: any, { eventId }: { eventId: string }, { user }: any) => {
      if (!user) throw new Error("Not authenticated");

      // Ensure user exists
      const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!existingUser) throw new Error("User not found");

      // Connect the user to event attendees
      await prisma.event.update({
        where: { id: eventId },
        data: {
          attendees: { connect: { id: user.id } },
        },
      });

      return prisma.event.findUnique({
        where: { id: eventId },
        include: { attendees: true },
      });
    },
  },
};
