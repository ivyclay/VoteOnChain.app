"use client";

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
  Zap,
  Clock,
  DollarSign,
  Accessibility,
  Server,
  Binary,
  Network,
  KeyRound,
  Smartphone,
  Laptop,
  Building,
  Flag,
  Award,
} from "lucide-react";
import Link from "next/link";

const securityFeatures = [
  {
    icon: Binary,
    title: "256-bit Encryption",
    description: "Every vote is encrypted with military-grade AES-256 encryption, the same standard used by the U.S. government for classified information.",
  },
  {
    icon: Lock,
    title: "Post-Quantum Cryptography",
    description: "Future-proof security using lattice-based cryptographic algorithms that remain secure even against quantum computer attacks.",
  },
  {
    icon: Network,
    title: "Decentralized Ledger",
    description: "No single point of failure. Votes are distributed across thousands of nodes, making manipulation mathematically impossible.",
  },
  {
    icon: KeyRound,
    title: "Zero-Knowledge Proofs",
    description: "Verify your vote was counted without revealing how you voted. True privacy with complete transparency.",
  },
];

const platformFeatures = [
  {
    icon: Fingerprint,
    title: "Secure Identity Verification",
    description: "Multi-factor identity verification ensures one citizen, one vote. Government ID validation with biometric options.",
    highlight: "Eliminates voter fraud",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "No more waiting days for counts. See verified results in real-time as votes are recorded on the blockchain.",
    highlight: "Results in minutes, not days",
  },
  {
    icon: Eye,
    title: "Complete Audit Trail",
    description: "Every vote creates an immutable record. Independent auditors can verify election integrity at any time.",
    highlight: "100% auditable",
  },
  {
    icon: Globe,
    title: "Vote From Anywhere",
    description: "Deployed military, overseas citizens, disabled voters—everyone can participate securely from any location.",
    highlight: "Increase participation by 40%",
  },
  {
    icon: DollarSign,
    title: "Reduced Election Costs",
    description: "Eliminate printing, shipping, and manual counting costs. One platform for all election needs.",
    highlight: "Save up to 70% on election costs",
  },
  {
    icon: Accessibility,
    title: "Full Accessibility",
    description: "ADA compliant with screen reader support, multiple languages, and assistive technology compatibility.",
    highlight: "WCAG 2.1 AA certified",
  },
];

const useCaseDetails = [
  {
    icon: Building2,
    title: "Homeowner Associations",
    tagline: "Modernize your community governance",
    description: "Perfect for board elections, budget approvals, rule changes, and community decisions. No more low turnout or disputed results.",
    benefits: [
      "24/7 voting access for busy homeowners",
      "Automatic quorum tracking",
      "Instant, undisputable results",
      "Complete voting history and records",
      "Cost-effective for any association size",
    ],
    cta: "Start Free HOA Trial",
  },
  {
    icon: Building,
    title: "Corporate & Organizations",
    tagline: "Secure shareholder and member voting",
    description: "From shareholder meetings to union elections, ensure every vote counts with cryptographic certainty.",
    benefits: [
      "Proxy voting made simple",
      "SEC compliance ready",
      "Weighted voting support",
      "Global participant access",
      "Enterprise-grade security",
    ],
    cta: "Request Enterprise Demo",
  },
  {
    icon: Landmark,
    title: "Government Elections",
    tagline: "Restore trust in democracy",
    description: "Purpose-built for local, state, and federal elections. The security and transparency Americans deserve.",
    benefits: [
      "Bipartisan audit capabilities",
      "EAC certification path",
      "Paper ballot backup options",
      "Military/overseas voter support",
      "Accessible to all citizens",
    ],
    cta: "Contact Government Sales",
  },
];

const comparisonData = [
  { feature: "Tamper-Proof Records", traditional: false, voteonchain: true },
  { feature: "Instant Results", traditional: false, voteonchain: true },
  { feature: "Complete Audit Trail", traditional: false, voteonchain: true },
  { feature: "Remote Voting Option", traditional: false, voteonchain: true },
  { feature: "Reduced Costs", traditional: false, voteonchain: true },
  { feature: "Accessible 24/7", traditional: false, voteonchain: true },
  { feature: "Eliminates Human Error", traditional: false, voteonchain: true },
  { feature: "Quantum-Resistant Security", traditional: false, voteonchain: true },
];

const testimonials = [
  {
    quote: "VoteOnChain transformed our HOA elections. We went from 15% participation to over 70% in our first digital election.",
    author: "Sarah Mitchell",
    role: "HOA President, Sunset Valley Community",
  },
  {
    quote: "The transparency and security gave our members complete confidence in the election results for the first time in years.",
    author: "James Rodriguez",
    role: "County Elections Director",
  },
  {
    quote: "As a deployed service member, I finally feel like my vote actually counts. I can verify it was recorded correctly.",
    author: "Sgt. Michael Chen",
    role: "U.S. Army, Overseas Voter",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1c] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 stars-pattern" />
      <div className="absolute inset-0 stripes-pattern" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-white to-blue-600" />

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center">
              <Vote className="w-6 h-6 text-blue-900" />
            </div>
            <span className="text-2xl font-bold text-white">VoteOnChain</span>
          </Link>
          <div className="flex items-center gap-4">
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

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphic-navy border-blue-500/30 mb-8">
                <Flag className="w-4 h-4 text-red-500" />
                <span className="text-sm text-blue-200 font-medium">
                  Built for American Democracy
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-white">Every Feature Designed to</span>
                <br />
                <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent">
                  Protect Your Vote
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Discover why election officials, HOAs, and organizations across America
                are choosing blockchain-secured voting for transparent, trustworthy elections.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <Shield className="inline w-8 h-8 text-blue-500 mr-2" />
                Unbreakable Security
              </h2>
              <p className="text-gray-400 text-lg">Four layers of protection for every ballot</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glassmorphic-card p-6 border-blue-500/20 hover:border-blue-400/40 transition-all"
                >
                  <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Platform Features That <span className="text-red-500">Matter</span>
              </h2>
              <p className="text-gray-400 text-lg">Everything you need for secure, accessible elections</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glassmorphic-card p-8 border-white/10 hover:border-blue-400/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:glow-blue transition-all">
                    <feature.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {feature.highlight}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Detailed */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Solutions for <span className="text-blue-400">Every Organization</span>
              </h2>
              <p className="text-gray-400 text-lg">Tailored voting solutions from community to country</p>
            </motion.div>

            <div className="space-y-8">
              {useCaseDetails.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glassmorphic-card p-8 md:p-10 border-white/10"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600/20 to-blue-600/20 flex items-center justify-center">
                          <useCase.icon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{useCase.title}</h3>
                          <p className="text-blue-400">{useCase.tagline}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-lg mb-6">{useCase.description}</p>
                      <Link href="/auth/signup">
                        <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2">
                          {useCase.cta}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                    <div className="lg:w-1/2">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-3">
                        {useCase.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Traditional vs. <span className="text-blue-400">VoteOnChain</span>
              </h2>
              <p className="text-gray-400 text-lg">See the difference blockchain makes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glassmorphic-card overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white font-semibold">Feature</th>
                    <th className="p-4 text-center text-gray-400">Traditional</th>
                    <th className="p-4 text-center text-blue-400">VoteOnChain</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="p-4 text-gray-300">{row.feature}</td>
                      <td className="p-4 text-center">
                        <span className="text-red-500 text-xl">✗</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-green-500 text-xl">✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted Across <span className="text-red-500">America</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glassmorphic-card p-6 border-white/10"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center glassmorphic-card p-12 border-blue-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Elections?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the movement for secure, transparent, and accessible voting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all flex items-center gap-2 justify-center">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-8 py-4 border border-white/30 rounded-lg font-semibold text-white hover:bg-white/5 transition-all">
                  Sign In
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center">
                <Vote className="w-4 h-4 text-blue-900" />
              </div>
              <span className="text-lg font-bold text-white">VoteOnChain</span>
            </Link>
            <p className="text-gray-500 text-sm text-center">
              Securing democracy, one block at a time. 🇺🇸
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                Home
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
