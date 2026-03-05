import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const electionId = params?.id;

    if (!electionId) {
      return NextResponse.json(
        { error: "Election ID is required" },
        { status: 400 }
      );
    }

    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        votes: true,
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    const totalVotes = election.votes.length;
    let results: any = {};

    if (election.voteType === "YES_NO") {
      const yesVotes = election.votes.filter(
        (vote) => (vote.voteData as any).vote === "yes"
      ).length;
      const noVotes = election.votes.filter(
        (vote) => (vote.voteData as any).vote === "no"
      ).length;

      results = {
        yes: yesVotes,
        no: noVotes,
        yesPercentage: totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0,
        noPercentage: totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0,
      };
    } else if (election.voteType === "MULTIPLE_CHOICE") {
      const options = (election.options as string[]) ?? [];
      const optionCounts: Record<string, number> = {};

      options.forEach((option) => {
        optionCounts[option] = 0;
      });

      election.votes.forEach((vote) => {
        const selected = (vote.voteData as any).selected;
        if (selected && optionCounts.hasOwnProperty(selected)) {
          optionCounts[selected]++;
        }
      });

      results = {
        options: Object.keys(optionCounts).map((option) => ({
          option,
          votes: optionCounts[option],
          percentage: totalVotes > 0 ? (optionCounts[option] / totalVotes) * 100 : 0,
        })),
      };
    } else if (election.voteType === "MULTIPLE_SELECTION") {
      const options = (election.options as string[]) ?? [];
      const optionCounts: Record<string, number> = {};

      options.forEach((option) => {
        optionCounts[option] = 0;
      });

      election.votes.forEach((vote) => {
        const selected = (vote.voteData as any).selected ?? [];
        if (Array.isArray(selected)) {
          selected.forEach((opt: string) => {
            if (optionCounts.hasOwnProperty(opt)) {
              optionCounts[opt]++;
            }
          });
        }
      });

      results = {
        options: Object.keys(optionCounts).map((option) => ({
          option,
          votes: optionCounts[option],
          percentage: totalVotes > 0 ? (optionCounts[option] / totalVotes) * 100 : 0,
        })),
      };
    }

    return NextResponse.json({
      election: {
        id: election.id,
        title: election.title,
        voteType: election.voteType,
      },
      totalVotes,
      results,
    });
  } catch (error) {
    console.error("Get results error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
