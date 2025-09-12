import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.user.deleteMany();
  await prisma.event.deleteMany();

  // Create sample users
  const alice = await prisma.user.create({
    data: { name: "Alice", email: "alice@example.com" },
  });
  const bob = await prisma.user.create({
    data: { name: "Bob", email: "bob@example.com" },
  });

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      name: "Tech Meetup",
      location: "Auditorium Hall",
      startTime: new Date("2025-09-15T18:00:00Z"),
      attendees: { connect: { id: alice.id } },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: "College Fest",
      location: "Main Ground",
      startTime: new Date("2025-09-20T17:00:00Z"),
      attendees: { connect: { id: bob.id } },
    },
  });

  console.log("✅ Seeded data:", { alice, bob, event1, event2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
