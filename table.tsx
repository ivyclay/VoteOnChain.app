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

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { adminNotes } = body;
    const verificationId = params?.id;

    if (!verificationId) {
      return NextResponse.json(
        { error: "Verification ID is required" },
        { status: 400 }
      );
    }

    const verification = await prisma.idVerification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 }
      );
    }

    // Update verification status
    await prisma.idVerification.update({
      where: { id: verificationId },
      data: {
        status: "REJECTED",
        adminNotes: adminNotes || "ID verification rejected",
        reviewedAt: new Date(),
      },
    });

    // Update user's verification status
    await prisma.user.update({
      where: { id: verification.userId },
      data: { idVerificationStatus: "REJECTED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject ID verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
