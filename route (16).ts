"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Vote,
  Shield,
  LogOut,
  Plus,
  Star,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ElectionsList from "./_components/elections-list";
import CreateElectionModal from "./_components/create-election-modal";
import UserManagement from "./_components/user-management";
import IdVerifications from "./_components/id-verifications";

type TabType = "elections" | "users" | "verifications";

export default function AdminDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("elections");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/voter");
    }
  }, [status, session, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-blue-400 text-xl">Loading...</div>
      </div>
    );
  }

  if ((session?.user as any)?.role !== "ADMIN") {
    return null;
  }

  const tabs = [
    { id: "elections" as TabType, label: "Elections", icon: Vote },
    { id: "users" as TabType, label: "Users", icon: Users },
    { id: "verifications" as TabType, label: "ID Verifications", icon: Shield },
  ];

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
              <h1 className="text-xl font-bold text-white">VoteOnChain Admin</h1>
              <p className="text-sm text-gray-400">Election Management Portal</p>
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
        {/* Tabs */}
        <div className="glassmorphic-card p-2 inline-flex gap-2 mb-8 border-blue-500/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-red-600 to-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "elections" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  Elections
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create Election
                </button>
              </div>
              <ElectionsList />
            </div>
          )}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "verifications" && <IdVerifications />}
        </motion.div>
      </main>

      {/* Create Election Modal */}
      {showCreateModal && (
        <CreateElectionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
