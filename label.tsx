import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userStatus = (session.user as any).idVerificationStatus;
    const electionId = params?.id;

    if (!electionId) {
      return NextResponse.json(
        { error: "Election ID is required" },
        { status: 400 }
      );
    }

    // Check if user's ID is approved
    if (userStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Your ID must be approved before you can vote" },
        { status: 403 }
      );
    }

    // Check if election exists and is active
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    if (!election.isActive) {
      return NextResponse.json(
        { error: "Election is not active" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      return NextResponse.json(
        { error: "Election is not currently open for voting" },
        { status: 400 }
      );
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_electionId: {
          userId,
          electionId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted in this election" },
        { status: 400 }
      );
    }

    // Get vote data from request
    const body = await request.json();
    const { voteData } = body;

    if (!voteData) {
      return NextResponse.json(
        { error: "Vote data is required" },
        { status: 400 }
      );
    }

    // Validate vote data based on election type
    if (election.voteType === "YES_NO") {
      if (!voteData.vote || (voteData.vote !== "yes" && voteData.vote !== "no")) {
        return NextResponse.json(
          { error: "Invalid vote data for Yes/No vote" },
          { status: 400 }
        );
      }
    } else if (election.voteType === "MULTIPLE_CHOICE") {
      if (!voteData.selected || typeof voteData.selected !== "string") {
        return NextResponse.json(
          { error: "Invalid vote data for Multiple Choice vote" },
          { status: 400 }
        );
      }
    } else if (election.voteType === "MULTIPLE_SELECTION") {
      if (!voteData.selected || !Array.isArray(voteData.selected)) {
        return NextResponse.json(
          { error: "Invalid vote data for Multiple Selection vote" },
          { status: 400 }
        );
      }
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        userId,
        electionId,
        voteData,
      },
    });

    return NextResponse.json({ success: true, vote }, { status: 201 });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
