"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Vote as VoteIcon, CheckCircle, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Election {
  id: string;
  title: string;
  description: string;
  voteType: string;
  startDate: string;
  endDate: string;
  hasVoted?: boolean;
  _count: {
    votes: number;
  };
}

interface ElectionsListProps {
  idVerified: boolean;
}

export default function ElectionsList({ idVerified }: ElectionsListProps) {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchElections();
  }, []);

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
        <VoteIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No active elections at this time</p>
        <p className="text-gray-500 text-sm mt-2">Check back later for new elections</p>
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
                {election?.hasVoted && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    Voted
                  </span>
                )}
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
                  <span>{election?._count?.votes ?? 0} votes cast</span>
                </div>
                <div className="flex items-center gap-2">
                  <VoteIcon className="w-4 h-4" />
                  <span>{getVoteTypeLabel(election?.voteType ?? "")}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {election?.hasVoted ? (
                <Link href={`/voter/elections/${election?.id}`}>
                  <button className="flex items-center gap-2 px-6 py-3 glassmorphic-card hover:border-blue-500/50 transition-all">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">View Results</span>
                  </button>
                </Link>
              ) : (
                <Link href={`/voter/elections/${election?.id}`}>
                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!idVerified}
                  >
                    <VoteIcon className="w-5 h-5" />
                    Cast Vote
                  </button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
