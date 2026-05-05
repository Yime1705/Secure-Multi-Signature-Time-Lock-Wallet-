# How to Run

## 1. Start a Persistent Node

In **Terminal 1**, start a long-running Hardhat node:

```bash
npx hardhat node --network hardhatMainnet
```

Keep this terminal open — the node must remain running for the duration of your session.

> This outputs 20 test accounts with private keys. You'll need these to test different roles.

## 2. Deploy the Contract

In **Terminal 2**, while the node is running, deploy the SupplyChain contract:

```bash
npx hardhat ignition deploy ./ignition/modules/SupplyChain.ts --network hardhatMainnet
```

The contract will be deployed to `http://127.0.0.1:8545`.

## 3. Start the Frontend

In **Terminal 3**, start the React frontend:

```bash
cd my-react-app
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## Connecting MetaMask

To test with MetaMask, you need to connect it to your local Hardhat node:

1. Open MetaMask → **Settings → Networks → Add Network → Add a custom network**
2. Fill in:
   - **Network Name:** Hardhat Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
3. **Import Account** — Use a private key from the `npx hardhat node` output:

| Role | Address | Private Key |
|------|---------|-------------|
| Manufacturer | `0xf39Fd6e51aad88F6F4ce6aB8827279cFFFb92266` | `0xac0974bec9a7e3eof94ca7ab02f83a22a0d1a2b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f` |
| Distributor | `0x70997970C51812dc3A010C7d01b50e0d17DC79C8` | `0x59c6995e811fdbd9e5c461214a27ea0a9d2d4c2d7c2b1a0f5e7c3b2d1a0f5e7c3b2d1a0f5e7c3b2d1a0f5e7c3b2d1a0f5e7c3b2d1a0f5e7c3b2d1a0f5e7c` |
| Retailer | `0x3C44CdDdB6a900fa2B585d299e03d12FA4293BC` | `0x5de4111afa1a4b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7` |

---

## Testing Workflow

1. Connect MetaMask as **Manufacturer** → Create Product → Ship to Distributor (use distributor address `0x70997970C51812dc3A010C7d01b50e0d17DC79C8`)
2. Connect MetaMask as **Distributor** → Receive Product → Ship to Retailer (use retailer address `0x3C44CdDdB6a900fa2B585d299e03d12FA4293BC`)
3. Connect MetaMask as **Retailer** → Receive Product

---

## Deployed Contract Address

```
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npx hardhat node` | Start persistent local node |
| `npx hardhat ignition deploy` | Deploy contract (run while node is running) |
| `npm run dev` (in my-react-app) | Start React frontend |
| `npx hardhat ignition status` | Show deployment info |
