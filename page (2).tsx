import { ethers } from "hardhat";

async function main() {
  console.log("\n🇺🇸 VoteOnChain Contract Deployment");
  console.log("====================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy VoterRegistry first
  console.log("📝 Deploying VoterRegistry...");
  const VoterRegistry = await ethers.getContractFactory("VoterRegistry");
  const voterRegistry = await VoterRegistry.deploy();
  await voterRegistry.waitForDeployment();
  const voterRegistryAddress = await voterRegistry.getAddress();
  console.log("✅ VoterRegistry deployed to:", voterRegistryAddress);

  // Deploy VoteOnChain with VoterRegistry address
  console.log("\n🗳️  Deploying VoteOnChain...");
  const VoteOnChain = await ethers.getContractFactory("VoteOnChain");
  const voteOnChain = await VoteOnChain.deploy(voterRegistryAddress);
  await voteOnChain.waitForDeployment();
  const voteOnChainAddress = await voteOnChain.getAddress();
  console.log("✅ VoteOnChain deployed to:", voteOnChainAddress);

  // Get network info
  const network = await ethers.provider.getNetwork();
  
  console.log("\n====================================");
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("====================================");
  console.log("\nNetwork:", network.name, "(Chain ID:", network.chainId.toString(), ")");
  console.log("\nContract Addresses:");
  console.log("  VoterRegistry:", voterRegistryAddress);
  console.log("  VoteOnChain:  ", voteOnChainAddress);
  console.log("\n📋 Save these addresses to your .env file:");
  console.log(`  VOTER_REGISTRY_ADDRESS=${voterRegistryAddress}`);
  console.log(`  VOTE_ON_CHAIN_ADDRESS=${voteOnChainAddress}`);
  console.log("\n🔗 Verify contracts on block explorer:");
  console.log(`  npx hardhat verify --network ${network.name} ${voterRegistryAddress}`);
  console.log(`  npx hardhat verify --network ${network.name} ${voteOnChainAddress} ${voterRegistryAddress}`);
  console.log("");

  return {
    voterRegistry: voterRegistryAddress,
    voteOnChain: voteOnChainAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
