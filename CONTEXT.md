Secure-Multi-Signature-Time-Lock-Wallet-/CONTEXT.md
---
# Project: Secure Multi-Signature Time-Lock Wallet
Blockchain supply chain tracking system using Hardhat (Solidity) with role-based access control and React frontend, supporting multi-chain deployment (Ethereum L1, Optimism L2).

## Architecture
```
contracts/          Smart contracts (Solidity 0.8.20) - SupplyChain.sol with role-based access
my-react-app/       Frontend app (React 19 + Vite + TypeScript) - not yet integrated
  ├── src/            React components and styles
  └── eslint.config.js TypeScript/React linting rules
scripts/            Deployment utilities (Viem-based)
test/               Legacy test files (outdated)
ignition/modules/   Hardhat Ignition (needs SupplyChain module)
```

## Data flow
1. Smart contracts in `contracts/SupplyChain.sol` define supply chain logic with role-based access (Manufacturer → Distributor → Retailer)
2. State transitions via `produceProduct`, `shipToDistributor`, `receiveByDistributor`, `shipToRetailer`, `receiveByRetailer`
3. Events: `ProductCreated`, `StateChanged`, `OwnershipTransferred`
4. Ignition module for SupplyChain — **not yet created**
5. Tests for SupplyChain — **not yet created**
6. Frontend remains disconnected; still a Vite template

## Conventions
- **Error handling:** Solidity `require()` for state validation, `onlyRole()` modifier for access
- **Auth:** OpenZeppelin AccessControl (MANUFACTURER_ROLE, DISTRIBUTOR_ROLE, RETAILER_ROLE); DEFAULT_ADMIN_ROLE for setup
- **Naming:** State transition functions (`shipToDistributor`), events PascalCase, TS/React camelCase
- **Async pattern:** Viem promises, Hardhat network abstraction
- **Testing:** Forge tests and Hardhat Viem tests missing for SupplyChain

## Tech stack
- **hardhat**: Multi-chain development framework
- **viem**: Ethereum client library
- **solidity**: 0.8.20 (SupplyChain) — mismatch with hardhat.config 0.8.28
- **@openzeppelin/contracts**: 5.6.1 for AccessControl
- **@nomicfoundation/hardhat-ignition**: Deployment orchestration
- **react**: 19.2.5 frontend
- **vite**: Build tool
- **typescript**: 5.8.0 for type safety
- **eslint**: TypeScript/React linting

## Gotchas
- **Solidity version mismatch:** SupplyChain.sol (`^0.8.20`) vs hardhat.config.ts (`0.8.28`)
- **Incomplete structure:** No SupplyChain tests or Ignition deployment module
- **Frontend disconnect:** Still a default Vite template with no Web3 integration
- **No role setup:** Constructor grants DEFAULT_ADMIN_ROLE but lacks mechanism to assign participant roles
- **Project name mismatch:** Still named "Time-Lock Wallet" but implements "Supply Chain" — no time-lock mechanism yet

## Where to look
- **Add endpoint:** `my-react-app/src/App.tsx` → integrate Viem, add role-based UI
- **Add/update contract:** `contracts/SupplyChain.sol` → update logic; fix Solidity version in hardhat.config.ts
- **Add tests:** Create `test/SupplyChain.ts` (Viem) and `contracts/SupplyChain.t.sol` (Forge)
- **Add deployment:** Create `ignition/modules/SupplyChain.ts` with role setup
- **Change auth:** Add admin interface to grant roles
- **Types:** `my-react-app/tsconfig.app.json` enforces strict checking; Viem ABIs auto-generated

---
