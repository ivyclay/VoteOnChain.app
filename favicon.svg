"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, BarChart3, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

interface Election {
  id: string;
  title: string;
  description: string;
  voteType: string;
  options?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  _count: {
    votes: number;
  };
}

interface Results {
  totalVotes: number;
  results: any;
}

interface AuditEntry {
  id: string;
  voter: {
    id: string;
    name: string;
    email: string;
  };
  votedAt: string;
}

const COLORS = ["#00ffff", "#10b981", "#fbbf24", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ElectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const electionId = params?.id as string;

  const [election, setElection] = useState<Election | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        // Fetch results
        const resultsRes = await fetch(`/api/elections/${electionId}/results`);
        if (resultsRes?.ok) {
          const resultsData = await resultsRes.json();
          setResults(resultsData);
        }

        // Fetch audit trail
        const auditRes = await fetch(`/api/elections/${electionId}/audit`);
        if (auditRes?.ok) {
          const auditData = await auditRes.json();
          setAudit(auditData ?? []);
        }
      } catch (error) {
        console.error("Error fetching election data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [electionId]);

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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry?.name}: ${entry?.percentage}%`}
                  outerRadius={100}
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry?.option}: ${entry?.percentage?.toFixed?.(1) ?? 0}%`}
                  outerRadius={100}
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
            <ResponsiveContainer width="100%" height={300}>
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

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/20 via-[#0a0f1c] to-red-950/20" />

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/admin">
          <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </Link>

        {/* Election Header */}
        <div className="glassmorphic-card p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{election?.title}</h1>
              <p className="text-gray-400">{election?.description}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                election?.isActive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {election?.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-sm text-gray-400">Election Period</div>
                <div className="text-white font-medium">
                  {election?.startDate ? format(new Date(election.startDate), "MMM d") : "N/A"} -{" "}
                  {election?.endDate ? format(new Date(election.endDate), "MMM d, yyyy") : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
              <Users className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-sm text-gray-400">Total Votes</div>
                <div className="text-white font-medium text-2xl">
                  {results?.totalVotes ?? 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Vote Type</div>
                <div className="text-white font-medium">
                  {election?.voteType === "YES_NO" && "Yes/No"}
                  {election?.voteType === "MULTIPLE_CHOICE" && "Multiple Choice"}
                  {election?.voteType === "MULTIPLE_SELECTION" && "Multiple Selection"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Results</h2>
          {renderResults()}
        </div>

        {/* Audit Trail */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Audit Trail ({audit?.length ?? 0} votes)
          </h2>
          {audit?.length === 0 ? (
            <div className="glassmorphic-card p-8 text-center">
              <Eye className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No votes recorded yet</p>
            </div>
          ) : (
            <div className="glassmorphic-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Voter
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Voted At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit?.map?.((entry, index) => (
                      <motion.tr
                        key={entry?.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">
                            {entry?.voter?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400">{entry?.voter?.email}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400">
                            {entry?.votedAt ? format(new Date(entry.votedAt), "MMM d, yyyy HH:mm") : "N/A"}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
