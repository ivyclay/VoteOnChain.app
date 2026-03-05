"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface UploadIdModalProps {
  onClose: () => void;
}

export default function UploadIdModal({ onClose }: UploadIdModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e?.target?.files?.[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File must be an image (JPEG, PNG, WebP) or PDF");
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Step 1: Get presigned URL
      const presignedResponse = await fetch("/api/id-verification/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!presignedResponse?.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, cloud_storage_path } = await presignedResponse.json();

      // Step 2: Upload file to S3 using presigned URL
      const uploadHeaders: Record<string, string> = {
        "Content-Type": file.type,
      };

      // Check if Content-Disposition is required in the signed headers
      const urlObj = new URL(uploadUrl);
      const signedHeaders = urlObj.searchParams.get("X-Amz-SignedHeaders");
      if (signedHeaders?.includes?.("content-disposition")) {
        uploadHeaders["Content-Disposition"] = "attachment";
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: uploadHeaders,
        body: file,
      });

      if (!uploadResponse?.ok) {
        throw new Error("Failed to upload file");
      }

      // Step 3: Complete the upload by saving to database
      const completeResponse = await fetch("/api/id-verification/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cloud_storage_path }),
      });

      if (!completeResponse?.ok) {
        throw new Error("Failed to complete upload");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message ?? "Failed to upload ID document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1c]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glassmorphic-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upload ID Document</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Upload Successful!
            </h3>
            <p className="text-gray-400">
              Your ID is now under review. You'll be notified once it's approved.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <p className="text-gray-300 mb-4">
                Please upload a clear photo of your government-issued ID (driver's
                license, passport, etc.).
              </p>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-blue-500/50 transition-all">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-12 h-12 text-blue-400" />
                  <div>
                    <p className="text-white font-medium mb-1">
                      Click to upload file
                    </p>
                    <p className="text-sm text-gray-400">
                      JPEG, PNG, WebP, or PDF (max 10MB)
                    </p>
                  </div>
                </label>
              </div>
              {file && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400">Selected file:</p>
                  <p className="text-white font-medium">{file?.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file?.size / 1024 / 1024)?.toFixed?.(2) ?? 0} MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 glassmorphic-card font-semibold text-gray-300 hover:border-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
