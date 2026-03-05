"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  TrendingUp,
  Users,
  CheckCircle,
  Link2,
  ArrowRight,
  Star,
  Building2,
  Landmark,
  Vote,
  FileCheck,
  Scale,
  Globe,
  BadgeCheck,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Link2,
    title: "True On-Chain Voting",
    description: "Votes recorded on DogeOS blockchain via Solidity smart contracts. Immutable and decentralized.",
    color: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Immutable Records",
    description: "Every vote is permanently recorded on-chain. No alterations, no deletions, ever.",
    color: "text-red-500",
  },
  {
    icon: Lock,
    title: "Military-Grade Security",
    description: "Post-quantum cryptography protects against current and future cyber threats.",
    color: "text-blue-500",
  },
  {
    icon: Eye,
    title: "Voter Privacy",
    description: "Your vote remains secret while maintaining complete election transparency.",
    color: "text-white",
  },
  {
    icon: CheckCircle,
    title: "Verifiable Results",
    description: "Independent audit trails let anyone verify election integrity.",
    color: "text-red-500",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Counting",
    description: "Watch results update instantly as votes are securely recorded.",
    color: "text-blue-500",
  },
  {
    icon: Fingerprint,
    title: "Identity Verified",
    description: "Secure ID verification ensures one citizen, one vote.",
    color: "text-white",
  },
  {
    icon: Link2,
    title: "Complete Audit Trail",
    description: "Transparent participation records without compromising ballot secrecy.",
    color: "text-red-500",
  },
  {
    icon: Globe,
    title: "Vote From Anywhere",
    description: "Secure remote voting for military, overseas citizens, and accessibility.",
    color: "text-blue-500",
  },
];

const useCases = [
  {
    icon: Building2,
    title: "Homeowner Associations",
    description: "Streamline HOA elections, board votes, and community decisions with transparent, tamper-proof results.",
    stats: "50,000+ HOAs nationwide",
  },
  {
    icon: Landmark,
    title: "Local & State Elections",
    description: "Modernize county, city, and state elections with blockchain security and instant auditable results.",
    stats: "3,143 counties ready",
  },
  {
    icon: Vote,
    title: "Federal Elections",
    description: "The future of presidential and congressional voting—secure, accessible, and trusted by all.",
    stats: "158M+ registered voters",
  },
];

const benefits = [
  { label: "Elimination of voter fraud", icon: ShieldCheck },
  { label: "Instant, accurate results", icon: TrendingUp },
  { label: "Reduced election costs", icon: Scale },
  { label: "Increased voter participation", icon: Users },
  { label: "ADA accessibility compliance", icon: BadgeCheck },
  { label: "Military & overseas voting", icon: Globe },
];

export default function Home() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as any)?.role;
      if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/voter");
      }
    }
  }, [status, session, router]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-blue-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1c] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 stars-pattern" />
      <div className="absolute inset-0 stripes-pattern" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-white to-blue-600" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center">
              <Vote className="w-6 h-6 text-blue-900" />
            </div>
            <span className="text-2xl font-bold text-white">VoteOnChain</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/features" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
              Features
            </Link>
            <Link href="/auth/login">
              <button className="px-5 py-2 text-white border border-white/20 rounded-lg hover:bg-white/5 transition-all">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-5 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Blockchain Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
                <Link2 className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300 font-medium">
                  Powered by Solidity Smart Contracts
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphic-navy border-blue-500/30">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-blue-200 font-medium">
                  DogeOS • Polygon • Base Compatible
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">The Future of</span>
              <br />
              <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent">
                American Democracy
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Secure, transparent, and immutable voting powered by blockchain technology.
              From HOA elections to federal voting—every ballot protected, every voice heard.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg font-semibold text-white overflow-hidden hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 text-lg">
                  <span className="relative z-10 flex items-center gap-2">
                    Register to Vote
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <Link href="/features">
                <button className="px-8 py-4 glassmorphic-card border-blue-500/30 font-semibold text-white hover:border-blue-400/60 hover:glow-blue transition-all duration-300 text-lg">
                  Explore Features
                </button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-3xl mx-auto"
            >
              <div className="glassmorphic-card p-4 md:p-6 border-red-500/20">
                <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">100%</div>
                <div className="text-xs md:text-sm text-gray-400">Tamper-Proof</div>
              </div>
              <div className="glassmorphic-card p-4 md:p-6 border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">∞</div>
                <div className="text-xs md:text-sm text-gray-400">Immutable</div>
              </div>
              <div className="glassmorphic-card p-4 md:p-6 border-blue-500/20">
                <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">256-bit</div>
                <div className="text-xs md:text-sm text-gray-400">Encryption</div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Securing Elections at <span className="text-blue-400">Every Level</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                From community associations to the highest offices in the land
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="group glassmorphic-card p-8 hover:scale-105 transition-all duration-300 border-blue-500/20 hover:border-blue-400/40"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:glow-blue transition-all duration-300">
                    <useCase.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <Star className="w-4 h-4 fill-blue-400" />
                    <span>{useCase.stats}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why <span className="text-red-500">Vote</span><span className="text-blue-500">OnChain</span>?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Enterprise-grade security meets civic responsibility
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group glassmorphic-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-4 group-hover:glow-blue transition-all duration-300">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Banner */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-blue-900/30 to-red-900/20" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-6 md:gap-10"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-white"
                >
                  <benefit.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-sm md:text-base font-medium">{benefit.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center glassmorphic-card p-12 border-blue-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-blue-600" />
            <div className="flex justify-center gap-2 mb-6">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Vote?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join millions of Americans demanding transparent, secure elections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
                  Create Your Account
                </button>
              </Link>
              <Link href="/features">
                <button className="px-8 py-4 border border-white/30 rounded-lg font-semibold text-white hover:bg-white/5 transition-all duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center">
                <Vote className="w-4 h-4 text-blue-900" />
              </div>
              <span className="text-lg font-bold text-white">VoteOnChain</span>
            </div>
            <p className="text-gray-500 text-sm text-center">
              Securing democracy, one block at a time. 🇺🇸
            </p>
            <div className="flex items-center gap-4">
              <Link href="/features" className="text-gray-400 hover:text-white text-sm transition-colors">
                Features
              </Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
