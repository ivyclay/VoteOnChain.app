import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Get all elections (filtered by role)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    if (userRole === "ADMIN") {
      // Admins can see all elections
      const elections = await prisma.election.findMany({
        include: {
          creator: {
            select: { name: true, email: true },
          },
          _count: {
            select: { votes: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(elections);
    } else {
      // Voters can only see active elections within date range
      const now = new Date();
      const elections = await prisma.election.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        include: {
          _count: {
            select: { votes: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Check if user has voted on each election
      const electionsWithVoteStatus = await Promise.all(
        elections.map(async (election) => {
          const hasVoted = await prisma.vote.findUnique({
            where: {
              userId_electionId: {
                userId,
                electionId: election.id,
              },
            },
          });

          return {
            ...election,
            hasVoted: !!hasVoted,
          };
        })
      );

      return NextResponse.json(electionsWithVoteStatus);
    }
  } catch (error) {
    console.error("Get elections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create new election (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, voteType, options, startDate, endDate, isActive } = body;

    if (!title || !description || !voteType || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate options for multi-choice votes
    if ((voteType === "MULTIPLE_CHOICE" || voteType === "MULTIPLE_SELECTION") && (!options || !Array.isArray(options) || options.length < 2)) {
      return NextResponse.json(
        { error: "Options are required for multi-choice votes" },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    const election = await prisma.election.create({
      data: {
        title,
        description,
        voteType,
        options: (voteType === "MULTIPLE_CHOICE" || voteType === "MULTIPLE_SELECTION") ? options : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive ?? true,
        createdBy: userId,
      },
    });

    return NextResponse.json(election, { status: 201 });
  } catch (error) {
    console.error("Create election error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
