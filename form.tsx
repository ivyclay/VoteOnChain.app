import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const verification = await prisma.idVerification.findUnique({
      where: { userId },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { idVerificationStatus: true },
    });

    return NextResponse.json({
      status: user?.idVerificationStatus ?? "PENDING",
      hasSubmitted: !!verification,
      adminNotes: verification?.adminNotes,
      reviewedAt: verification?.reviewedAt,
    });
  } catch (error) {
    console.error("ID verification status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
