{
  "name": "voteonchain-contracts",
  "version": "1.0.0",
  "description": "VoteOnChain Smart Contracts",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy:local": "hardhat run scripts/deploy.ts --network localhost",
    "deploy:dogeos": "hardhat run scripts/deploy.ts --network dogeos",
    "deploy:testnet": "hardhat run scripts/deploy.ts --network baseSepolia",
    "node": "hardhat node"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "dotenv": "^16.3.1",
    "hardhat": "^2.19.0"
  }
}
