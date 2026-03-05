import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user (john@doe.com / johndoe123)
  const adminPassword = await bcrypt.hash("johndoe123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      idVerificationStatus: "APPROVED",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create sample voters
  const voterPassword = await bcrypt.hash("password123", 10);
  
  const voter1 = await prisma.user.upsert({
    where: { email: "alice@voter.com" },
    update: {},
    create: {
      email: "alice@voter.com",
      name: "Alice Johnson",
      password: voterPassword,
      role: "VOTER",
      idVerificationStatus: "APPROVED",
    },
  });
  console.log("Voter created:", voter1.email);

  const voter2 = await prisma.user.upsert({
    where: { email: "bob@voter.com" },
    update: {},
    create: {
      email: "bob@voter.com",
      name: "Bob Smith",
      password: voterPassword,
      role: "VOTER",
      idVerificationStatus: "APPROVED",
    },
  });
  console.log("Voter created:", voter2.email);

  const voter3 = await prisma.user.upsert({
    where: { email: "charlie@voter.com" },
    update: {},
    create: {
      email: "charlie@voter.com",
      name: "Charlie Brown",
      password: voterPassword,
      role: "VOTER",
      idVerificationStatus: "PENDING",
    },
  });
  console.log("Voter created:", voter3.email);

  // Create sample elections
  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const election1 = await prisma.election.create({
    data: {
      title: "2024 HOA Board President Election",
      description: "Vote for the next HOA Board President. The president will serve a 2-year term and lead all board meetings.",
      voteType: "MULTIPLE_CHOICE",
      options: ["Sarah Martinez", "David Chen", "Emily Rodriguez", "Michael Thompson"],
      startDate: now,
      endDate: futureDate,
      isActive: true,
      createdBy: admin.id,
    },
  });
  console.log("Election created:", election1.title);

  const election2 = await prisma.election.create({
    data: {
      title: "Community Pool Renovation Approval",
      description: "Should we proceed with the $150,000 community pool renovation project? This includes resurfacing, new equipment, and updated safety features.",
      voteType: "YES_NO",
      startDate: now,
      endDate: futureDate,
      isActive: true,
      createdBy: admin.id,
    },
  });
  console.log("Election created:", election2.title);

  const election3 = await prisma.election.create({
    data: {
      title: "Community Event Preferences",
      description: "Select all community events you would like to see organized this year. Multiple selections allowed.",
      voteType: "MULTIPLE_SELECTION",
      options: [
        "Summer BBQ Festival",
        "Holiday Lights Contest",
        "Community Yard Sale",
        "Movie Night in the Park",
        "Spring Garden Tour",
        "Fall Harvest Festival"
      ],
      startDate: now,
      endDate: futureDate,
      isActive: true,
      createdBy: admin.id,
    },
  });
  console.log("Election created:", election3.title);

  // Create some sample votes
  await prisma.vote.create({
    data: {
      userId: voter1.id,
      electionId: election1.id,
      voteData: { selected: "Sarah Martinez" },
    },
  });

  await prisma.vote.create({
    data: {
      userId: voter2.id,
      electionId: election1.id,
      voteData: { selected: "David Chen" },
    },
  });

  await prisma.vote.create({
    data: {
      userId: voter1.id,
      electionId: election2.id,
      voteData: { vote: "yes" },
    },
  });

  await prisma.vote.create({
    data: {
      userId: voter2.id,
      electionId: election2.id,
      voteData: { vote: "no" },
    },
  });

  await prisma.vote.create({
    data: {
      userId: voter1.id,
      electionId: election3.id,
      voteData: { selected: ["Summer BBQ Festival", "Movie Night in the Park", "Fall Harvest Festival"] },
    },
  });

  console.log("Sample votes created");
  console.log("\nSeed completed successfully!");
  console.log("\nTest Credentials:");
  console.log("Admin: john@doe.com / johndoe123");
  console.log("Voter 1: alice@voter.com / password123 (ID Approved)");
  console.log("Voter 2: bob@voter.com / password123 (ID Approved)");
  console.log("Voter 3: charlie@voter.com / password123 (ID Pending)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
