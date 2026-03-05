/**
 * VoteOnChain Contract ABIs
 * =========================
 * 
 * These ABIs define the interface to interact with the smart contracts.
 * Import these when connecting via ethers.js or viem.
 */

export const VoterRegistryABI = [
  // Read functions
  "function admin() view returns (address)",
  "function isVerified(address _voter) view returns (bool)",
  "function getVoter(address _voter) view returns (uint8 status, uint256 registeredAt, uint256 verifiedAt, bool exists)",
  "function getStats() view returns (uint256 total, uint256 verified, uint256 pending)",
  "function verifiedVoterCount() view returns (uint256)",
  "function isVerifier(address) view returns (bool)",
  
  // Write functions
  "function register(bytes32 _idHash) external",
  "function reRegister(bytes32 _newIdHash) external",
  "function verifyVoter(address _voter) external",
  "function rejectVoter(address _voter, string memory _reason) external",
  "function registerVerified(address _voter, bytes32 _idHash) external",
  "function addVerifier(address _verifier) external",
  "function removeVerifier(address _verifier) external",
  
  // Events
  "event VoterRegistered(address indexed voter, bytes32 idHash, uint256 timestamp)",
  "event VoterVerified(address indexed voter, address indexed verifier, uint256 timestamp)",
  "event VoterRejected(address indexed voter, address indexed verifier, string reason, uint256 timestamp)",
] as const;

export const VoteOnChainABI = [
  // Read functions
  "function admin() view returns (address)",
  "function electionCount() view returns (uint256)",
  "function totalVotesCast() view returns (uint256)",
  "function getElection(uint256 _electionId) view returns (string title, string description, uint8 voteType, string[] options, uint256 startTime, uint256 endTime, uint8 status, uint256 totalVotes)",
  "function getResults(uint256 _electionId) view returns (uint256[] counts, uint256 total)",
  "function getAuditTrail(uint256 _electionId) view returns (address[] voters)",
  "function checkVoted(uint256 _electionId, address _voter) view returns (bool)",
  "function getActiveElections() view returns (uint256[])",
  "function getStats() view returns (uint256 totalElections, uint256 totalVotes, uint256 verifiedVoters)",
  "function hasVoted(uint256, address) view returns (bool)",
  
  // Write functions
  "function createElection(string memory _title, string memory _description, uint8 _voteType, string[] memory _options, uint256 _startTime, uint256 _endTime) external returns (uint256)",
  "function castVote(uint256 _electionId, uint256[] memory _selectedOptions) external",
  "function setElectionStatus(uint256 _electionId, uint8 _status) external",
  
  // Events
  "event ElectionCreated(uint256 indexed electionId, string title, uint8 voteType, uint256 startTime, uint256 endTime, address indexed creator)",
  "event VoteCast(uint256 indexed electionId, address indexed voter, bytes32 voteHash, uint256 timestamp)",
  "event ElectionStatusChanged(uint256 indexed electionId, uint8 newStatus)",
] as const;

// Full JSON ABIs for use with ethers.js Contract class
export const VoterRegistryFullABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "_idHash", "type": "bytes32"}],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
    "name": "isVerified",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStats",
    "outputs": [
      {"internalType": "uint256", "name": "total", "type": "uint256"},
      {"internalType": "uint256", "name": "verified", "type": "uint256"},
      {"internalType": "uint256", "name": "pending", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const VoteOnChainFullABI = [
  {
    "inputs": [{"internalType": "address", "name": "_voterRegistry", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint8", "name": "_voteType", "type": "uint8"},
      {"internalType": "string[]", "name": "_options", "type": "string[]"},
      {"internalType": "uint256", "name": "_startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "_endTime", "type": "uint256"}
    ],
    "name": "createElection",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_electionId", "type": "uint256"},
      {"internalType": "uint256[]", "name": "_selectedOptions", "type": "uint256[]"}
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_electionId", "type": "uint256"}],
    "name": "getResults",
    "outputs": [
      {"internalType": "uint256[]", "name": "counts", "type": "uint256[]"},
      {"internalType": "uint256", "name": "total", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStats",
    "outputs": [
      {"internalType": "uint256", "name": "totalElections", "type": "uint256"},
      {"internalType": "uint256", "name": "totalVotes", "type": "uint256"},
      {"internalType": "uint256", "name": "verifiedVoters", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
