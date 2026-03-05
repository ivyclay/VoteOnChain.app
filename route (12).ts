"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Vote as VoteIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Election {
  id: string;
  title: string;
  description: string;
  voteType: string;
  options?: string[];
  startDate: string;
  endDate: string;
  hasVoted?: boolean;
}

interface Results {
  totalVotes: number;
  results: any;
}

const COLORS = ["#00ffff", "#10b981", "#fbbf24", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function VoteElectionPage() {
  const { data: session } = useSession() || {};
  const params = useParams();
  const router = useRouter();
  const electionId = params?.id as string;

  const [election, setElection] = useState<Election | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Vote selections
  const [yesNoVote, setYesNoVote] = useState<"yes" | "no" | null>(null);
  const [multipleChoiceVote, setMultipleChoiceVote] = useState<string | null>(null);
  const [multipleSelectionVotes, setMultipleSelectionVotes] = useState<string[]>([]);

  useEffect(() => {
    if (!electionId) return;

    const fetchData = async () => {
      try {
        // Fetch election details
        const electionRes = await fetch(`/api/elections/${electionId}`);
        if (electionRes?.ok) {
          const electionData = await electionRes.json();
          setElection(electionData);
        }

        // Fetch elections list to check if voted
        const electionsRes = await fetch("/api/elections");
        if (electionsRes?.ok) {
          const electionsData = await electionsRes.json();
          const currentElection = electionsData?.find?.((e: any) => e?.id === electionId);
          setHasVoted(currentElection?.hasVoted ?? false);
        }

        // Fetch results
        const resultsRes = await fetch(`/api/elections/${electionId}/results`);
        if (resultsRes?.ok) {
          const resultsData = await resultsRes.json();
          setResults(resultsData);
        }
      } catch (error) {
        console.error("Error fetching election data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [electionId]);

  const handleVoteSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      let voteData: any = {};

      if (election?.voteType === "YES_NO") {
        if (!yesNoVote) {
          setError("Please select Yes or No");
          setIsSubmitting(false);
          return;
        }
        voteData = { vote: yesNoVote };
      } else if (election?.voteType === "MULTIPLE_CHOICE") {
        if (!multipleChoiceVote) {
          setError("Please select an option");
          setIsSubmitting(false);
          return;
        }
        voteData = { selected: multipleChoiceVote };
      } else if (election?.voteType === "MULTIPLE_SELECTION") {
        if (multipleSelectionVotes?.length === 0) {
          setError("Please select at least one option");
          setIsSubmitting(false);
          return;
        }
        voteData = { selected: multipleSelectionVotes };
      }

      const response = await fetch(`/api/elections/${electionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteData }),
      });

      if (!response?.ok) {
        const data = await response.json();
        setError(data?.error ?? "Failed to submit vote");
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/voter");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const toggleMultipleSelection = (option: string) => {
    if (multipleSelectionVotes?.includes?.(option)) {
      setMultipleSelectionVotes(
        multipleSelectionVotes?.filter?.((v) => v !== option) ?? []
      );
    } else {
      setMultipleSelectionVotes([...multipleSelectionVotes, option]);
    }
  };

  const renderResults = () => {
    if (!results || results?.totalVotes === 0) {
      return (
        <div className="glassmorphic-card p-8 text-center">
          <p className="text-gray-400">No votes cast yet</p>
        </div>
      );
    }

    if (election?.voteType === "YES_NO") {
      const data = [
        { name: "Yes", value: results?.results?.yes ?? 0, percentage: results?.results?.yesPercentage?.toFixed?.(1) ?? 0 },
        { name: "No", value: results?.results?.no ?? 0, percentage: results?.results?.noPercentage?.toFixed?.(1) ?? 0 },
      ];

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glassmorphic-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vote Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry?.name}: ${entry?.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data?.map?.((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glassmorphic-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vote Counts</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11 }} />
                <Bar dataKey="value" fill="#00ffff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else {
      const data = results?.results?.options ?? [];

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glassmorphic-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vote Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry?.option}: ${entry?.percentage?.toFixed?.(1) ?? 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                  nameKey="option"
                >
                  {data?.map?.((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glassmorphic-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vote Counts</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis dataKey="option" tickLine={false} tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11 }} />
                <Bar dataKey="votes" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-red-400 text-xl">Election not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/20 via-[#0a0f1c] to-red-950/20" />

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/voter">
          <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </Link>

        {/* Election Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic-card p-6 mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">{election?.title}</h1>
          <p className="text-gray-400 mb-4">{election?.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {election?.startDate ? format(new Date(election.startDate), "MMM d, yyyy") : "N/A"} -{" "}
              {election?.endDate ? format(new Date(election.endDate), "MMM d, yyyy") : "N/A"}
            </span>
          </div>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphic-card p-8 mb-8 border border-emerald-500/30"
          >
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Vote Submitted!</h3>
              <p className="text-gray-400">Your vote has been securely recorded.</p>
            </div>
          </motion.div>
        )}

        {/* Voting Interface or Results */}
        {!success && (
          <>
            {hasVoted ? (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glassmorphic-card p-6 mb-8 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-3 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">You have already voted in this election</p>
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
                {renderResults()}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphic-card p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Cast Your Vote</h2>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Yes/No Vote */}
                {election?.voteType === "YES_NO" && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setYesNoVote("yes")}
                      className={`w-full p-6 rounded-lg border-2 transition-all ${
                        yesNoVote === "yes"
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-white/10 hover:border-emerald-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold text-white">Yes</span>
                        {yesNoVote === "yes" && (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => setYesNoVote("no")}
                      className={`w-full p-6 rounded-lg border-2 transition-all ${
                        yesNoVote === "no"
                          ? "border-red-500 bg-red-500/20"
                          : "border-white/10 hover:border-red-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold text-white">No</span>
                        {yesNoVote === "no" && (
                          <CheckCircle className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                    </button>
                  </div>
                )}

                {/* Multiple Choice */}
                {election?.voteType === "MULTIPLE_CHOICE" && (
                  <div className="space-y-3">
                    {election?.options?.map?.((option, index) => (
                      <button
                        key={index}
                        onClick={() => setMultipleChoiceVote(option)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          multipleChoiceVote === option
                            ? "border-cyan-500 bg-cyan-500/20"
                            : "border-white/10 hover:border-cyan-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg text-white">{option}</span>
                          {multipleChoiceVote === option && (
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Multiple Selection */}
                {election?.voteType === "MULTIPLE_SELECTION" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 mb-4">
                      Select all that apply
                    </p>
                    {election?.options?.map?.((option, index) => (
                      <button
                        key={index}
                        onClick={() => toggleMultipleSelection(option)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          multipleSelectionVotes?.includes?.(option)
                            ? "border-cyan-500 bg-cyan-500/20"
                            : "border-white/10 hover:border-cyan-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg text-white">{option}</span>
                          {multipleSelectionVotes?.includes?.(option) && (
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleVoteSubmit}
                  disabled={isSubmitting}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-semibold text-black text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <VoteIcon className="w-6 h-6" />
                  {isSubmitting ? "Submitting Vote..." : "Submit Vote"}
                </button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
