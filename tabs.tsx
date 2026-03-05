generator client {
    provider = "prisma-client-js"
    binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
    output = "/home/ubuntu/voteonchain/nextjs_space/node_modules/.prisma/client"
}

datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  VOTER
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}

enum VoteType {
  YES_NO
  MULTIPLE_CHOICE
  MULTIPLE_SELECTION
}

model User {
  id                    String            @id @default(cuid())
  name                  String
  email                 String            @unique
  password              String
  role                  Role              @default(VOTER)
  idVerificationStatus  VerificationStatus @default(PENDING)
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  idVerification        IdVerification?
  votes                 Vote[]
  electionsCreated      Election[]
}

model IdVerification {
  id                String              @id @default(cuid())
  userId            String              @unique
  cloudStoragePath  String
  isPublic          Boolean             @default(false)
  status            VerificationStatus  @default(PENDING)
  adminNotes        String?
  reviewedAt        DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  user              User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Election {
  id          String    @id @default(cuid())
  title       String
  description String
  voteType    VoteType
  options     Json?     // For MULTIPLE_CHOICE and MULTIPLE_SELECTION: ["Option 1", "Option 2", ...]
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(true)
  createdBy   String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  creator     User      @relation(fields: [createdBy], references: [id], onDelete: Cascade)
  votes       Vote[]
}

model Vote {
  id          String    @id @default(cuid())
  userId      String
  electionId  String
  voteData    Json      // For YES_NO: {"vote": "yes"} or {"vote": "no"}
                        // For MULTIPLE_CHOICE: {"selected": "Option 1"}
                        // For MULTIPLE_SELECTION: {"selected": ["Option 1", "Option 3"]}
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  election    Election  @relation(fields: [electionId], references: [id], onDelete: Cascade)

  @@unique([userId, electionId]) // Prevent double voting
}
