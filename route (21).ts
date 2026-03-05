"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, Clock, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface IdVerification {
  id: string;
  userId: string;
  cloudStoragePath: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  imageUrl: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function IdVerifications() {
  const [verifications, setVerifications] = useState<IdVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<IdVerification | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchVerifications = async () => {
    try {
      const response = await fetch("/api/admin/id-verifications");
      if (response?.ok) {
        const data = await response.json();
        setVerifications(data ?? []);
      }
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(`/api/admin/id-verifications/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });

      if (response?.ok) {
        setSelectedVerification(null);
        setAdminNotes("");
        fetchVerifications();
      }
    } catch (error) {
      console.error("Error approving verification:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!adminNotes?.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setProcessingId(id);
    try {
      const response = await fetch(`/api/admin/id-verifications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });

      if (response?.ok) {
        setSelectedVerification(null);
        setAdminNotes("");
        fetchVerifications();
      }
    } catch (error) {
      console.error("Error rejecting verification:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/20 text-green-400";
      case "REJECTED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-blue-400">Loading ID verifications...</div>
      </div>
    );
  }

  const pendingVerifications = verifications?.filter?.((v) => v?.status === "PENDING") ?? [];
  const processedVerifications = verifications?.filter?.((v) => v?.status !== "PENDING") ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">ID Verifications</h2>

      {/* Pending Verifications */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Pending ({pendingVerifications?.length ?? 0})
        </h3>
        {pendingVerifications?.length === 0 ? (
          <div className="glassmorphic-card p-8 text-center">
            <Shield className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No pending ID verifications</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingVerifications?.map?.((verification, index) => (
              <motion.div
                key={verification?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphic-card p-4 cursor-pointer hover:border-blue-500/30 transition-all"
                onClick={() => {
                  setSelectedVerification(verification);
                  setAdminNotes(verification?.adminNotes ?? "");
                }}
              >
                <div className="aspect-video bg-[#0a0f1c]/50 rounded-lg mb-3 relative overflow-hidden">
                  {verification?.imageUrl ? (
                    <img
                      src={verification.imageUrl}
                      alt="ID Document"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(verification?.status ?? "PENDING")}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      verification?.status ?? "PENDING"
                    )}`}
                  >
                    {verification?.status}
                  </span>
                </div>
                <div className="text-white font-medium">{verification?.user?.name}</div>
                <div className="text-sm text-gray-400">{verification?.user?.email}</div>
                <div className="text-xs text-gray-500 mt-2">
                  Submitted {verification?.createdAt ? format(new Date(verification.createdAt), "MMM d, yyyy") : "N/A"}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Processed Verifications */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Processed ({processedVerifications?.length ?? 0})
        </h3>
        {processedVerifications?.length === 0 ? (
          <div className="glassmorphic-card p-8 text-center">
            <p className="text-gray-400">No processed verifications yet</p>
          </div>
        ) : (
          <div className="glassmorphic-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Admin Notes
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedVerifications?.map?.((verification, index) => (
                    <motion.tr
                      key={verification?.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">
                            {verification?.user?.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {verification?.user?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(verification?.status ?? "PENDING")}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              verification?.status ?? "PENDING"
                            )}`}
                          >
                            {verification?.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">
                          {verification?.adminNotes ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">
                          {verification?.createdAt ? format(new Date(verification.createdAt), "MMM d, yyyy") : "N/A"}
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

      {/* Review Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1c]/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl glassmorphic-card p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Review ID Verification</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="aspect-video bg-[#0a0f1c]/50 rounded-lg overflow-hidden mb-4">
                  {selectedVerification?.imageUrl ? (
                    <img
                      src={selectedVerification.imageUrl}
                      alt="ID Document"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">User</label>
                    <div className="text-white font-medium">
                      {selectedVerification?.user?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedVerification?.user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Submitted</label>
                    <div className="text-white">
                      {selectedVerification?.createdAt ? format(new Date(selectedVerification.createdAt), "MMM d, yyyy HH:mm") : "N/A"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0f1c]/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                      rows={4}
                      placeholder="Optional notes about this verification..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedVerification(null);
                  setAdminNotes("");
                }}
                className="flex-1 px-6 py-3 glassmorphic-card font-semibold text-gray-300 hover:border-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedVerification?.id ?? "")}
                disabled={!!processingId}
                className="flex-1 px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-lg font-semibold text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                {processingId === selectedVerification?.id ? "Rejecting..." : "Reject"}
              </button>
              <button
                onClick={() => handleApprove(selectedVerification?.id ?? "")}
                disabled={!!processingId}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-blue-500/50 transition-all disabled:opacity-50"
              >
                {processingId === selectedVerification?.id ? "Approving..." : "Approve"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
