# 🇺🇸 VoteOnChain Smart Contracts

**Secure, Immutable, Decentralized Voting on Blockchain**

These Solidity smart contracts power VoteOnChain's on-chain voting system. Designed for DogeOS (Dogecoin L2) but compatible with any EVM chain.

---

## 📜 Contracts

### VoterRegistry.sol
Manages voter registration and ID verification on-chain:
- Wallet-to-identity linking via hashed ID documents
- Admin/verifier approval workflow
- Prevents duplicate registrations
- Privacy-preserving (only stores ID hashes)

### VoteOnChain.sol
Main voting contract with full election support:
- Create elections (Yes/No, Multiple Choice, Multiple Selection)
- Cast immutable votes
- Real-time results
- Audit trail (who voted, not what they voted)
- Prevents double voting

---

## 🚀 Deployment

### Prerequisites
1. Node.js 18+
2. A wallet with funds on your target network
3. RPC URL for your chosen network

### Install Dependencies
```bash
cd blockchain
npm install
```

### Configure Environment
```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

### Compile Contracts
```bash
npm run compile
```

### Deploy

**DogeOS (Recommended - Cheapest):**
```bash
npm run deploy:dogeos
```

**Base Sepolia Testnet (Free testing):**
```bash
npm run deploy:testnet
```

**Local Development:**
```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy:local
```

---

## 💰 Gas Costs (Estimated)

| Action | DogeOS | Polygon | Base |
|--------|--------|---------|------|
| Deploy VoterRegistry | ~$0.01 | ~$0.05 | ~$0.02 |
| Deploy VoteOnChain | ~$0.02 | ~$0.10 | ~$0.04 |
| Register Voter | ~$0.001 | ~$0.01 | ~$0.005 |
| Cast Vote | ~$0.001 | ~$0.01 | ~$0.005 |
| Create Election | ~$0.005 | ~$0.03 | ~$0.01 |

---

## 🔐 Security Features

- **Immutable votes** - Once cast, votes cannot be changed
- **No double voting** - Blockchain enforces one vote per verified wallet
- **Privacy-preserving** - Only ID hashes stored, not actual documents
- **Audit trail** - Transparent record of WHO voted (not WHAT)
- **Admin controls** - Pause/resume elections as needed
- **Verifier system** - Multiple verifiers can approve voters

---

## 🛠️ Supported Networks

| Network | Type | Cost | Speed |
|---------|------|------|-------|
| **DogeOS** | L2 | ⭐ Cheapest | Fast |
| Base | L2 | Very Cheap | Fast |
| Polygon | L1/L2 | Cheap | Fast |
| Arbitrum | L2 | Cheap | Fast |
| Ethereum | L1 | Expensive | Medium |

---

## 📖 Contract Interface

### Create Election
```solidity
function createElection(
    string memory _title,
    string memory _description,
    VoteType _voteType,      // 0=YES_NO, 1=MULTIPLE_CHOICE, 2=MULTIPLE_SELECTION
    string[] memory _options,
    uint256 _startTime,
    uint256 _endTime
) external returns (uint256 electionId)
```

### Cast Vote
```solidity
function castVote(
    uint256 _electionId,
    uint256[] memory _selectedOptions
) external
```

### Get Results
```solidity
function getResults(uint256 _electionId)
    external view
    returns (uint256[] memory counts, uint256 total)
```

---

## 🤝 Integration

After deployment, add contract addresses to your Next.js app's `.env`:

```env
VOTER_REGISTRY_ADDRESS=0x...
VOTE_ON_CHAIN_ADDRESS=0x...
```

Then import the ABIs from `artifacts/contracts/` to interact with the contracts.

---

## 📄 License

MIT License - Use freely for any purpose.

---

*Securing democracy, one block at a time.* 🇺🇸
