import { network } from "hardhat";

async function main() {
  const { viem } = await network.create({ network: "hardhatMainnet", chainType: "l1" });
  const accounts = await viem.getWalletClients();

  console.log("Hardhat Test Accounts:");
  console.log("======================");
  accounts.forEach((account, index) => {
    console.log(`Account ${index}: ${account.account.address}`);
  });

  console.log("\nRole Assignments:");
  console.log("=================");
  console.log("Manufacturer (Account 0):", accounts[0].account.address);
  console.log("Distributor  (Account 1):", accounts[1].account.address);
  console.log("Retailer     (Account 2):", accounts[2].account.address);

  console.log("\nContract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3");
}

main().catch(console.error);
