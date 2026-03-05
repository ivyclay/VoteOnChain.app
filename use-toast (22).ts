import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cloud_storage_path } = body;

    if (!cloud_storage_path) {
      return NextResponse.json(
        { error: "Missing cloud_storage_path" },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    // Check if user already has ID verification
    const existingVerification = await prisma.idVerification.findUnique({
      where: { userId },
    });

    if (existingVerification) {
      // Update existing verification
      await prisma.idVerification.update({
        where: { userId },
        data: {
          cloudStoragePath: cloud_storage_path,
          isPublic: false,
          status: "PENDING",
          adminNotes: null,
          reviewedAt: null,
        },
      });
    } else {
      // Create new verification
      await prisma.idVerification.create({
        data: {
          userId,
          cloudStoragePath: cloud_storage_path,
          isPublic: false,
          status: "PENDING",
        },
      });
    }

    // Update user's verification status to PENDING
    await prisma.user.update({
      where: { id: userId },
      data: { idVerificationStatus: "PENDING" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ID verification complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
