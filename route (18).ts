"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateElectionModalProps {
  onClose: () => void;
}

export default function CreateElectionModal({
  onClose,
}: CreateElectionModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [voteType, setVoteType] = useState("YES_NO");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options?.length > 2) {
      const newOptions = options?.filter?.((_, i) => i !== index) ?? [];
      setOptions(newOptions);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate options for multi-choice votes
    if (voteType === "MULTIPLE_CHOICE" || voteType === "MULTIPLE_SELECTION") {
      const validOptions = options?.filter?.((opt) => opt?.trim?.() !== "") ?? [];
      if (validOptions?.length < 2) {
        setError("Please provide at least 2 options");
        return;
      }
    }

    setIsLoading(true);

    try {
      const body: any = {
        title,
        description,
        voteType,
        startDate,
        endDate,
        isActive,
      };

      if (voteType === "MULTIPLE_CHOICE" || voteType === "MULTIPLE_SELECTION") {
        body.options = options?.filter?.((opt) => opt?.trim?.() !== "") ?? [];
      }

      const response = await fetch("/api/elections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response?.ok) {
        const data = await response.json();
        setError(data?.error ?? "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Refresh the page to show new election
      router.refresh();
      onClose();
      window.location.reload();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1c]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glassmorphic-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Election</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Election Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0f1c]/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              placeholder="2024 Board of Directors Election"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0f1c]/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              rows={3}
              placeholder="Vote for the new board members"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vote Type
            </label>
            <select
              value={voteType}
              onChange={(e) => setVoteType(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0f1c]/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="YES_NO">Yes/No Vote</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice (Pick One)</option>
              <option value="MULTIPLE_SELECTION">
                Multiple Selection (Pick Multiple)
              </option>
            </select>
          </div>

          {(voteType === "MULTIPLE_CHOICE" || voteType === "MULTIPLE_SELECTION") && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Options
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-cyan-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
              <div className="space-y-2">
                {options?.map?.((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0a0f1c]/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      placeholder={`Option ${index + 1}`}
                    />
                    {options?.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0f1c]/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0f1c]/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 bg-[#0a0f1c]/50 border-white/10 rounded text-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <label htmlFor="isActive" className="text-sm text-gray-300">
              Election is active (voters can see and participate)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 glassmorphic-card font-semibold text-gray-300 hover:border-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-blue-500/50 transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Election"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
