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

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const electionId = params?.id;

    if (!electionId) {
      return NextResponse.json(
        { error: "Election ID is required" },
        { status: 400 }
      );
    }

    const votes = await prisma.vote.findMany({
      where: { electionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Return audit trail showing who voted and when, but not what they voted for
    const auditTrail = votes.map((vote) => ({
      id: vote.id,
      voter: {
        id: vote.user.id,
        name: vote.user.name,
        email: vote.user.email,
      },
      votedAt: vote.createdAt,
    }));

    return NextResponse.json(auditTrail);
  } catch (error) {
    console.error("Get audit trail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
