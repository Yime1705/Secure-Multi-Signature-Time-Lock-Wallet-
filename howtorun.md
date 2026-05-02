How to Run

**1. Deploy the contract:**
```bash
npx hardhat ignition deploy ./ignition/modules/SupplyChain.ts --network hardhatMainnet
```

**2. Start the frontend:**
```bash
cd my-react-app
npm run dev
```

---

### Testing with MetaMask

Import these test accounts into MetaMask to act as different roles:

| Role | Address | Private Key |
|------|---------|-------------|
| Manufacturer | `0xf39Fd6e51aad88F6F4ce6aB8827279cFFFb92266` | `0xac0974bec9a7e3...` |
| Distributor | `0x70997970C51812dc3A010C7d01b50e0d17DC79C8` | `0x59c6995e811f...` |
| Retailer | `0x3C44CdDdB6a900fa2B585d299e03d12FA4293BC` | `0x5de4111afa1a4...` |

**Workflow test:**
1. Connect MetaMask as **Manufacturer** → Create Product → Ship to Distributor (use distributor address `0x70997970C51812dc3A010C7d01b50e0d17DC79C8`)
2. Connect MetaMask as **Distributor** → Receive Product → Ship to Retailer (use retailer address `0x3C44CdDdB6a900fa2B585d299e03d12FA4293BC`)
3. Connect MetaMask as **Retailer** → Receive Product

The contract is deployed at: `0x5FbDB2315678afecb367f032d93F642f64180aa3
