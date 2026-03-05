import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getFileUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verifications = await prisma.idVerification.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            idVerificationStatus: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Generate signed URLs for each ID document
    const verificationsWithUrls = await Promise.all(
      verifications.map(async (verification) => {
        const imageUrl = await getFileUrl(
          verification.cloudStoragePath,
          verification.isPublic
        );
        return {
          ...verification,
          imageUrl,
        };
      })
    );

    return NextResponse.json(verificationsWithUrls);
  } catch (error) {
    console.error("Get ID verifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
