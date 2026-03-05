"use client";

import { motion } from "framer-motion";
import {
  Link2,
  Shield,
  Cpu,
  Wallet,
  CheckCircle,
  Clock,
  Lock,
  Zap,
} from "lucide-react";
import { BLOCKCHAIN_CONFIG } from "@/lib/blockchain/config";

export default function BlockchainStatus() {
  const config = BLOCKCHAIN_CONFIG;
  const defaultNetwork = config.networks[config.defaultNetwork as keyof typeof config.networks];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphic-card p-6 border-blue-500/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Blockchain Status</h3>
          <p className="text-sm text-gray-400">On-chain voting infrastructure</p>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Smart Contracts */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Contracts Ready</span>
          </div>
          <p className="text-xs text-gray-400">Solidity smart contracts deployed</p>
        </div>

        {/* Wallet Integration */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Wallet Coming</span>
          </div>
          <p className="text-xs text-gray-400">Gas integration in development</p>
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-white/5 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Target Network</span>
          <span className="text-sm font-medium text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            {defaultNetwork.name}
            {defaultNetwork.recommended && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                Recommended
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Chain ID</span>
          <span className="text-sm font-mono text-gray-300">{defaultNetwork.chainId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Native Token</span>
          <span className="text-sm font-medium text-white">{defaultNetwork.nativeCurrency.symbol}</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Immutable vote records on-chain</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Lock className="w-4 h-4 text-red-400" />
          <span>Cryptographic vote verification</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Cpu className="w-4 h-4 text-green-400" />
          <span>EVM-compatible (DogeOS, Polygon, Base)</span>
        </div>
      </div>

      {/* Coming Soon Badge */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Wallet className="w-4 h-4 text-purple-400" />
          <span className="text-gray-400">
            Wallet connection + gas fees: <span className="text-purple-400 font-medium">Coming Soon</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
