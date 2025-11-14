# Mutix Bridge - Cross-Chain Token Bridge Application

A React-based frontend application for bridging tokens between Ethereum Sepolia and BNB Chain Testnet.

## 📋 Important: Backend Development Required

**The frontend is fully functional, but requires a backend service for validator signatures.**

### For Backend Developers:

- 📖 **[Backend Development Guide](./BACKEND_DEVELOPMENT_GUIDE.md)** - Complete documentation for building the validator service
- ⚡ **[Quick Start Guide](./BACKEND_QUICK_START.md)** - Quick reference for essential requirements

### Current Status:

- ✅ Frontend fully implemented and tested
- ✅ Smart contracts deployed on testnets
- ❌ Backend validator service **NOT IMPLEMENTED** (required for token release)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/pnpm
- MetaMask or compatible Web3 wallet
- Testnet tokens for testing

### Installation

```bash
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

### Build

```bash
npm run build
# or
pnpm build
```

---

## 📚 Project Structure

See below for detailed file structure documentation.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




//----------file structure phase 1-------------------------


/src
|
|-- assets/
|   |-- fonts/
|   |-- icons/
|   |   |-- switch-icon.svg
|   |   `-- external-link-icon.svg
|   `-- images/
|       |-- ethereum-logo.svg
|       |-- bnb-chain-logo.svg
|       |-- usdt-logo.svg
|       `-- dai-logo.svg
|
|-- components/
|   |-- bridge/  // All components for the main bridge card
|   |   |-- BridgeCard.jsx        // Assembles all bridge components
|   |   |-- ChainSelector.jsx     // Reusable UI for 'From' and 'To' sections
|   |   |-- TokenInput.jsx        // For amount input and balance display
|   |   |-- TokenSelectorModal.jsx// A popup modal to select a token
|   |   `-- TransactionStatus.jsx // To show current step (Approve, Lock, etc.)
|   |
|   |-- common/  // Components used across multiple pages
|   |   |-- AddressDisplay.jsx    // Shows shortened wallet address
|   |   `-- NetworkDisplay.jsx    // Shows current network with logo
|   |
|   |-- history/ // Components for the transaction history page
|   |   |-- HistoryTable.jsx      // The main table structure
|   |   `-- HistoryTableRow.jsx   // A single row in the history table
|   |
|   |-- layout/  // Main page structure components
|   |   |-- Header.jsx
|   |   |-- Footer.jsx (Optional)
|   |   `-- MainLayout.jsx        // Wraps pages with Header and Footer
|   |
|   `-- ui/      // Very generic, reusable UI elements
|       |-- Button.jsx
|       |-- Modal.jsx             // A base modal component
|       |-- Spinner.jsx           // A loading spinner
|       `-- Input.jsx             // A styled input field
|
|-- constants/   // All fixed data and configuration
|   |-- abi/
|   |   |-- multxBridgeAbi.json   // The ABI for your bridge contract
|   |   `-- ierc20Abi.json        // The standard ABI for ERC20 tokens
|   |
|   |-- chains.js                 // Supported chain configurations (ID, name, RPC)
|   `-- tokens.js                 // List of supported tokens and their addresses
|
|-- contexts/    // For global state management
|   `-- WalletContext.jsx         // Manages wallet state (address, chainId, etc.)
|
|-- hooks/       // For reusable logic
|   |-- useAllowance.js           // Logic to check token approval
|   |-- useBalance.js             // Logic to fetch a user's token balance
|   |-- useBridge.js              // The main hook for lock/release logic
|   |-- useContract.js            // Hook to easily get a contract instance
|   `-- useWallet.js              // Logic for connect/disconnect/switch network
|
|-- pages/       // Top-level page components
|   |-- BridgePage.jsx            // The main page with the bridge card
|   `-- HistoryPage.jsx           // The page for transaction history
|
|-- services/    // For communication with external APIs
|   `-- bridgeApi.js              // Functions to call your backend endpoints
|
|-- utils/       // Helper functions
|   `-- formatters.js             // Functions to format addresses, numbers, etc.
|
|-- App.jsx      // Main component, will handle routing between pages
|-- main.jsx     // The entry point of the React application
`-- index.css    // Global styles and Tailwind CSS imports













// ----------------------------------Phase 2 file structure -------------------------------








/src
|
|-- assets/
|   // (No changes in this phase)
|
|-- components/
|   |-- bridge/
|   |   |-- BridgeCard.jsx        // <-- Phase 2 (Wrong Network logic yahan handle hogi)
|   |   `-- TokenInput.jsx        // <-- Phase 2 (Live balance yahan display hoga)
|   |
|   |-- common/
|   |   |-- AddressDisplay.jsx    // <-- Phase 2 (Live address yahan display hoga)
|   |   `-- NetworkDisplay.jsx    // <-- Phase 2 (Live network status yahan display hoga)
|   |
|   |-- history/
|   |   // (No changes in this phase)
|   |
|   |-- layout/
|   |   `-- Header.jsx            // <-- Phase 2 (Connect button ki logic yahan istemal hogi)
|   |
|   `-- ui/
|       // (No changes in this phase)
|
|-- constants/
|   |-- abi/
|   |   `-- ierc20Abi.json        // <-- Phase 2 (balanceOf ke liye istemal hoga)
|   |
|   |-- chains.js                 // <-- Phase 2 (Network details ke liye istemal hoga)
|   `-- tokens.js                 // <-- Phase 2 (Token addresses ke liye istemal hoga)
|
|-- contexts/
|   `-- WalletContext.jsx         // <-- Phase 2 (Is phase ka sab se ahem hissa)
|
|-- hooks/
|   |-- useBalance.js             // <-- Phase 2 (Yeh hook banaya jayega)
|   |-- useContract.js            // <-- Phase 2 (Yeh hook istemal hoga)
|   `-- useWallet.js              // (WalletContext.jsx ka hissa hai, istemal hoga)
|
|-- pages/
|   // (No changes in this phase, kyunke logic components ke andar hai)
|
|-- services/
|   // (No changes in this phase)
|
|-- utils/
|   `-- formatters.js             // <-- Phase 2 (Address shorten karne ke liye istemal hoga)
|
|-- App.jsx
|-- main.jsx                      // <-- Phase 2 (WalletProvider yahan se shuru hota hai)
`-- index.css








//----------------pahese 3 file structure -----------------------------





/src
|
|-- assets/
|   // (No changes in this phase)
|
|-- components/
|   |-- bridge/
|   |   |-- BridgeCard.jsx        // <-- Phase 3 (Approve, Lock, Release ki poori logic yahan hogi)
|   |   `-- TransactionStatus.jsx // <-- Phase 3 (Bridge ke steps (e.g., Approving) yahan dikhayeinge)
|   |
|   |-- common/
|   |   // (No changes in this phase)
|   |
|   |-- history/
|   |   // (No changes in this phase)
|   |
|   |-- layout/
|   |   `-- MainLayout.jsx        // <-- Phase 3 (Toast notifications ke liye Toaster yahan hai)
|   |
|   `-- ui/
|       // (No changes in this phase)
|
|-- constants/
|   |-- abi/
|   |   |-- multxBridgeAbi.json   // <-- Phase 3 (Lock aur Release ke liye istemal hoga)
|   |   `-- ierc20Abi.json        // <-- Phase 3 (Approve aur Allowance ke liye istemal hoga)
|   |
|   `-- tokens.js                 // <-- Phase 3 (Bridge contract ka address yahan se milega)
|
|-- contexts/
|   `-- WalletContext.jsx         // <-- Phase 3 (Signer aur Provider yahan se milega)
|
|-- hooks/
|   |-- useAllowance.js           // <-- Phase 3 (Yeh hook banaya jayega - allowance check karne ke liye)
|   `-- useContract.js            // <-- Phase 3 (Bridge contract se interact karne ke liye istemal hoga)
|
|-- pages/
|   // (No changes in this phase)
|
|-- services/
|   `-- bridgeApi.js              // <-- Phase 3 (Validator signatures ke liye polling logic yahan hogi)
|
|-- utils/
|   // (No changes in this phase)
|
|-- App.jsx
|-- main.jsx
`-- index.css




//--------------------phase 4 file structure  ------------------------



/src
|
|-- assets/
|   // (No changes in this phase)
|
|-- components/
|   |-- bridge/
|   |   // (No changes in this phase)
|   |
|   |-- common/
|   |   // (No changes in this phase)
|   |
|   |-- history/
|   |   |-- HistoryTable.jsx      // <-- Phase 4 (Transactions ko table mein display karega)
|   |   `-- HistoryTableRow.jsx   // <-- Phase 4 (Table ki har row ka UI yahan banega)
|   |
|   |-- layout/
|   |   // (No changes in this phase)
|   |
|   `-- ui/
|       `-- Spinner.jsx           // <-- Phase 4 (Data load hote waqt istemal hoga)
|
|-- constants/
|   `-- chains.js                 // <-- Phase 4 (Chain ka logo aur explorer link ke liye istemal hoga)
|
|-- contexts/
|   `-- WalletContext.jsx         // <-- Phase 4 (Connected user ka address lene ke liye istemal hoga)
|
|-- hooks/
|   // (No new hooks in this phase)
|
|-- pages/
|   `-- HistoryPage.jsx           // <-- Phase 4 (Is phase ka markaz - API call aur state management yahan hogi)
|
|-- services/
|   `-- bridgeApi.js              // <-- Phase 4 (History fetch karne wala function yahan add hoga)
|
|-- utils/
|   // (No changes in this phase, lekin date format ke liye library install ho sakti hai)
|
|-- App.jsx
|-- main.jsx
`-- index.css











//----------------------- Phase 5 File Structure -------------------------------------

/src
|
|-- assets/
|   // (No changes in this phase)
|
|-- components/
|   |-- bridge/
|   |   `-- BridgeCard.jsx        // <-- Phase 5 (Sab se ahem - Wallet aur Contract ke errors yahan handle honge)
|   |
|   |-- common/
|   |   // (No changes in this phase)
|   |
|   |-- history/
|   |   // (No changes in this phase)
|   |
|   |-- layout/
|   |   `-- MainLayout.jsx        // <-- Phase 5 (Toast notifications ka setup yahan se control hota hai)
|   |
|   `-- ui/
|       // (No changes in this phase)
|
|-- constants/
|   |-- abi/
|   |   `-- multxBridgeAbi.json   // <-- Phase 5 (Contract se anay walay error names yahan define hain)
|
|-- contexts/
|   `-- WalletContext.jsx         // <-- Phase 5 (Wallet connection ke errors yahan handle honge)
|
|-- hooks/
|   // (No changes in this phase)
|
|-- pages/
|   `-- HistoryPage.jsx           // <-- Phase 5 (API call fail hone par error message yahan dikha sakte hain)
|
|-- services/
|   `-- bridgeApi.js              // <-- Phase 5 (API/Network errors ki handling yahan pehle se mojood hai)
|
|-- utils/
|   // (No changes in this phase)
|
|-- App.jsx
|-- main.jsx
`-- index.css











//----------------SIMULATION MODE PAGES FOR TESTING ------------------------
1.HistoryPage.JSX
2.BridgeCard.JSX
3.Header.jsx
4.AddressDisplay.JSX