"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Eye, Trash2, BarChart3 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Election {
  id: string;
  title: string;
  description: string;
  voteType: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  _count: {
    votes: number;
  };
}

export default function ElectionsList() {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchElections = async () => {
    try {
      const response = await fetch("/api/elections");
      if (response?.ok) {
        const data = await response.json();
        setElections(data ?? []);
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this election?")) return;

    try {
      const response = await fetch(`/api/elections/${id}`, {
        method: "DELETE",
      });

      if (response?.ok) {
        fetchElections();
      }
    } catch (error) {
      console.error("Error deleting election:", error);
    }
  };

  const getVoteTypeLabel = (type: string) => {
    switch (type) {
      case "YES_NO":
        return "Yes/No";
      case "MULTIPLE_CHOICE":
        return "Multiple Choice";
      case "MULTIPLE_SELECTION":
        return "Multiple Selection";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-blue-400">Loading elections...</div>
      </div>
    );
  }

  if (elections?.length === 0) {
    return (
      <div className="glassmorphic-card p-12 text-center">
        <Vote className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No elections created yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Create your first election to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {elections?.map?.((election, index) => (
        <motion.div
          key={election?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glassmorphic-card p-6 hover:border-blue-500/30 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-white">
                  {election?.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    election?.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {election?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{election?.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {election?.startDate ? format(new Date(election.startDate), "MMM d, yyyy") : "N/A"} -{" "}
                    {election?.endDate ? format(new Date(election.endDate), "MMM d, yyyy") : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{election?._count?.votes ?? 0} votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>{getVoteTypeLabel(election?.voteType ?? "")}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/elections/${election?.id}`}>
                <button className="p-2 glassmorphic-card hover:border-blue-500/50 transition-all group">
                  <Eye className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                </button>
              </Link>
              <button
                onClick={() => handleDelete(election?.id ?? "")}
                className="p-2 glassmorphic-card hover:border-red-500/50 transition-all group"
              >
                <Trash2 className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

import { Vote } from "lucide-react";
