import { network } from "hardhat";

// 1. Change to your L1 network configuration
const { viem } = await network.create({
  network: "hardhatMainnet",
  chainType: "l1",
});

console.log("Sending transaction on L1 (Mainnet simulation)");

const publicClient = await viem.getPublicClient();
const [senderClient] = await viem.getWalletClients();

console.log("Sending 1 wei from", senderClient.account.address, "to itself");

// 2. Standard L1 gas estimation
const gasEstimate = await publicClient.estimateGas({
  account: senderClient.account.address,
  to: senderClient.account.address,
  value: 1n,
});

console.log("Estimated gas:", gasEstimate);

console.log("Sending transaction...");
const tx = await senderClient.sendTransaction({
  to: senderClient.account.address,
  value: 1n,
});

await publicClient.waitForTransactionReceipt({ hash: tx });

console.log("Transaction sent successfully");
