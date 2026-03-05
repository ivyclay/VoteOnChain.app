"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  LogOut,
  Vote,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Star,
  Flag,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ElectionsList from "./_components/elections-list";
import UploadIdModal from "./_components/upload-id-modal";

export default function VoterDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [idStatus, setIdStatus] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchIdStatus = async () => {
      try {
        const response = await fetch("/api/id-verification/status");
        if (response?.ok) {
          const data = await response.json();
          setIdStatus(data);
        }
      } catch (error) {
        console.error("Error fetching ID status:", error);
      }
    };

    if (status === "authenticated") {
      fetchIdStatus();
    }
  }, [status]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-blue-400 text-xl">Loading...</div>
      </div>
    );
  }

  if ((session?.user as any)?.role === "ADMIN") {
    return null;
  }

  const getStatusIcon = () => {
    switch (idStatus?.status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = () => {
    switch (idStatus?.status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }
  };

  const getStatusMessage = () => {
    switch (idStatus?.status) {
      case "APPROVED":
        return "Your ID has been verified. You are now eligible to vote in all active elections!";
      case "REJECTED":
        return "Your ID verification was not approved. Please upload a new document.";
      default:
        return idStatus?.hasSubmitted
          ? "Your ID is being reviewed by election officials. You'll be notified once approved."
          : "Please upload your government-issued ID to participate in voting.";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Background effects */}
      <div className="fixed inset-0 stars-pattern" />
      <div className="fixed inset-0 stripes-pattern" />
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-white to-blue-600 z-50" />
      <div className="fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-2 z-40 glassmorphic-navy border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center">
              <Vote className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VoteOnChain</h1>
              <p className="text-sm text-gray-400">Voter Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 glassmorphic-card hover:border-red-500/50 transition-all"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic-card p-6 mb-8 border-blue-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-blue-600" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Flag className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome, {session?.user?.name}!</h2>
              <p className="text-gray-400">Your voice matters. Exercise your right to vote securely.</p>
            </div>
          </div>
        </motion.div>

        {/* ID Verification Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glassmorphic-card p-6 mb-8 border ${
            getStatusColor()
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">{getStatusIcon()}</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  ID Verification: {idStatus?.status ?? "PENDING"}
                </h3>
                <p className="text-gray-300 mb-2">{getStatusMessage()}</p>
                {idStatus?.adminNotes && (
                  <div className="mt-3 p-3 bg-black/30 rounded-lg">
                    <p className="text-sm text-gray-400">
                      <strong>Note from officials:</strong> {idStatus.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {(idStatus?.status === "PENDING" && !idStatus?.hasSubmitted) ||
            idStatus?.status === "REJECTED" ? (
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all whitespace-nowrap"
              >
                <Upload className="w-5 h-5" />
                Upload ID
              </button>
            ) : null}
          </div>
        </motion.div>

        {/* Elections Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Vote className="w-7 h-7 text-blue-400" />
            Active Elections
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </h2>

          {idStatus?.status !== "APPROVED" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glassmorphic-card p-6 mb-6 border border-yellow-500/30"
            >
              <div className="flex items-center gap-3 text-yellow-400">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">
                  ID verification required to cast your vote. Please complete verification above.
                </p>
              </div>
            </motion.div>
          )}

          <ElectionsList idVerified={idStatus?.status === "APPROVED"} />
        </div>
      </main>

      {/* Upload ID Modal */}
      {showUploadModal && (
        <UploadIdModal
          onClose={() => {
            setShowUploadModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
