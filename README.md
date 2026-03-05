markdown
Copy
# 🇺🇸 VoteOnChain

**The Future of American Democracy** — Secure, transparent, and immutable blockchain-inspired voting for HOAs, local, state, and federal elections.

🌐 **Live Demo:** [voteonchain.app](https://voteonchain.app)

---

## ✨ Features

### 🔐 Security
- **256-bit Encryption** — Military-grade AES-256 encryption for every vote
- **Post-Quantum Cryptography** — Future-proof against quantum computing threats
- **Immutable Records** — Votes permanently recorded, never altered or deleted
- **Zero-Knowledge Proofs** — Verify your vote without revealing your choice

### 🗳️ Voting Capabilities
- **Multiple Vote Types** — Yes/No, Multiple Choice, Multiple Selection
- **Real-Time Results** — Instant vote tallies as ballots are cast
- **No Double Voting** — Cryptographic guarantees ensure one person, one vote
- **Complete Audit Trail** — Transparent participation records

### 👤 User Management
- **Secure Registration** — Email and password authentication
- **ID Verification System** — Government ID upload with admin approval
- **Role-Based Access** — Separate Admin and Voter dashboards
- **Privacy Protection** — Vote secrecy maintained while ensuring transparency

### 🏛️ Use Cases
- **Homeowner Associations (HOAs)** — Board elections, budget approvals, community decisions
- **Corporate & Organizations** — Shareholder meetings, union elections, proxy voting
- **Government Elections** — Local, state, and federal voting (prototype)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **File Storage:** AWS S3
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Animations:** Framer Motion

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- AWS S3 bucket (for ID document storage)

### Installation

1. Clone the repository
```bash
git clone https://github.com/ivyclay/voteonchain.git
cd voteonchain/nextjs_space
Install dependencies
bash
Copy
yarn install
Set up environment variables
bash
Copy
cp .env.example .env
# Edit .env with your database and AWS credentials
Run database migrations
bash
Copy
yarn prisma migrate dev
yarn prisma db seed
Start the development server
bash
Copy
yarn dev
Visit http://localhost:3000 to see the app.

👥 Test Accounts
Role	Email	Password
Admin	john@doe.com	johndoe123
Voter (Approved)	alice@voter.com	password123
Voter (Approved)	bob@voter.com	password123
Voter (Pending)	charlie@voter.com	password123
📁 Project Structure
nextjs_space/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard
│   ├── auth/             # Login & signup pages
│   ├── features/         # Features/sales page
│   ├── voter/            # Voter dashboard
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── s3.ts             # AWS S3 utilities
├── prisma/
│   └── schema.prisma     # Database schema
└── scripts/
    └── seed.ts           # Database seed script
🎨 Design
VoteOnChain features a premium American patriotic theme:

Colors: Deep navy background with red, white, and blue accents
Effects: Glassmorphic cards, subtle animations, star patterns
Typography: Clean, professional, trustworthy aesthetic
Responsive: Fully mobile-friendly design
📄 License
MIT License — feel free to use this project for your own purposes.

🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

📧 Contact
Developer: ivyclay ohrealty@yahoo.com 

Securing democracy, one block at a time. 🇺🇸
