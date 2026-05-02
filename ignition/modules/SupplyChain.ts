import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export default buildModule("SupplyChainModule", (m) => {
  const supplyChain = m.contract("SupplyChain");

  // Compute role hashes (must match the constants in SupplyChain.sol)
  const MANUFACTURER_ROLE = ethers.id("MANUFACTURER_ROLE") as `0x${string}`;
  const DISTRIBUTOR_ROLE = ethers.id("DISTRIBUTOR_ROLE") as `0x${string}`;
  const RETAILER_ROLE = ethers.id("RETAILER_ROLE") as `0x${string}`;

  // Use Hardhat's test accounts for deployment
  // Account 0 will be manufacturer, Account 1 distributor, Account 2 retailer
  const manufacturerAccount = m.getAccount(0);
  const distributorAccount = m.getAccount(1);
  const retailerAccount = m.getAccount(2);

  // Grant MANUFACTURER_ROLE to the first test account
  m.call(supplyChain, "grantRole", [MANUFACTURER_ROLE, manufacturerAccount], {
    id: "grantManufacturerRole",
  });

  // Grant DISTRIBUTOR_ROLE to the second test account
  m.call(supplyChain, "grantRole", [DISTRIBUTOR_ROLE, distributorAccount], {
    id: "grantDistributorRole",
  });

  // Grant RETAILER_ROLE to the third test account
  m.call(supplyChain, "grantRole", [RETAILER_ROLE, retailerAccount], {
    id: "grantRetailerRole",
  });

  return { supplyChain };
});
