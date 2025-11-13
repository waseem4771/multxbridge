
// import React, { useState, useEffect } from 'react';

// // API service aur Wallet context ko import karein
// import { getUserTransactions } from '../services/bridgeApi';
// import { useWallet } from '../contexts/WalletContext';

// // Components
// import HistoryTable from '../components/history/HistoryTable';
// import Spinner from '../components/ui/Spinner';

// const HistoryPage = () => {
//   const { address, isConnected } = useWallet();
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true); // Shuru mein loading state true rakhein

//   useEffect(() => {
//     // Yeh function transactions fetch karega
//     const fetchHistory = async () => {
//       // Sirf tab fetch karein jab wallet connected ho aur address mojood ho
//       if (isConnected && address) {
//         setLoading(true);
//         const userTxs = await getUserTransactions(address);
//         // Transactions ko date ke hisab se sort karein (sab se nayi sab se oopar)
//         userTxs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setTransactions(userTxs);
//         setLoading(false);
//       } else {
//         // Agar wallet connected nahi, to list khali kar dein
//         setTransactions([]);
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//     // Yeh useEffect tab dobara chalega jab user ka address ya connection status badlega
//   }, [address, isConnected]);

//   // Content ko conditionally render karne ka function
//   const renderContent = () => {
//     if (!isConnected) {
//       return (
//         <div className="text-center bg-gray-800 p-8 rounded-lg">
//           <p className="text-gray-400">Please connect your wallet to view transaction history.</p>
//         </div>
//       );
//     }
    
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-48">
//           <Spinner />
//         </div>
//       );
//     }
    
//     if (transactions.length === 0) {
//       return (
//         <div className="text-center bg-gray-800 p-8 rounded-lg">
//           <p className="text-gray-400">No bridge transactions found for this address.</p>
//         </div>
//       );
//     }

//     // Agar sab theek hai to HistoryTable ko data ke sath render karein
//     return <HistoryTable transactions={transactions} />;
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-6 text-white">Transaction History</h1>
      
//       {/* Dynamic content ko yahan render karein */}
//       <div>{renderContent()}</div>
//     </div>
//   );
// };

// export default HistoryPage;






// import React, { useState, useEffect } from 'react';

// // API service aur Wallet context ko import karein
// import { getUserTransactions } from '../services/bridgeApi';
// import { useWallet } from '../contexts/WalletContext';

// // Components
// import HistoryTable from '../components/history/HistoryTable';
// import Spinner from '../components/ui/Spinner';

// // --- ENHANCEMENT: Behtar UI ke liye kuch icons ---
// const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
// const EmptyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// const HistoryPage = () => {
//   // --- Logic (Koi Tabdeeli Nahi) ---
//   const { address, isConnected } = useWallet();
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       if (isConnected && address) {
//         setLoading(true);
//         const userTxs = await getUserTransactions(address);
//         userTxs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setTransactions(userTxs);
//         setLoading(false);
//       } else {
//         setTransactions([]);
//         setLoading(false);
//       }
//     };
//     fetchHistory();
//   }, [address, isConnected]);
//   // --- Logic End ---

//   // Content ko conditionally render karne ka function
//   const renderContent = () => {
//     // --- ENHANCEMENT: Behtar styling aur icons ke saath Info Box ---
//     if (!isConnected) {
//       return (
//         <div className="text-center bg-slate-800/50 p-12 rounded-2xl border border-slate-700 flex flex-col items-center gap-4">
//           <WalletIcon />
//           <p className="text-lg font-semibold text-slate-200">Connect Your Wallet</p>
//           <p className="text-slate-400 max-w-xs">Please connect your wallet to view your transaction history.</p>
//         </div>
//       );
//     }
    
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center min-h-[300px]">
//           <Spinner />
//         </div>
//       );
//     }
    
//     // --- ENHANCEMENT: Behtar styling aur icons ke saath Info Box ---
//     if (transactions.length === 0) {
//       return (
//         <div className="text-center bg-slate-800/50 p-12 rounded-2xl border border-slate-700 flex flex-col items-center gap-4">
//           <EmptyIcon />
//           <p className="text-lg font-semibold text-slate-200">No Transactions Found</p>
//           <p className="text-slate-400 max-w-xs">You haven't made any bridge transactions with this address yet.</p>
//         </div>
//       );
//     }

//     return <HistoryTable transactions={transactions} />;
//   };

//   return (
//     // --- ENHANCEMENT: Layout mein halki si behtari ---
//     <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
//       <div className="pb-4 mb-8 border-b border-slate-700">
//         <h1 className="text-3xl font-bold text-slate-100">Transaction History</h1>
//         <p className="mt-1 text-slate-400">Review your past cross-chain transactions.</p>
//       </div>
      
//       <div>{renderContent()}</div>
//     </div>
//   );
// };

// export default HistoryPage;









//--------------------- Mobile Responsive -----------------------------


import React, { useState, useEffect } from 'react';

// API service aur Wallet context ko import karein
import { getUserTransactions } from '../services/bridgeApi';
import { useWallet } from '../contexts/WalletContext';

// Components
import HistoryTable from '../components/history/HistoryTable';
import Spinner from '../components/ui/Spinner';

// --- RESPONSIVE ENHANCEMENT: Behtar UI ke liye kuch icons (size adjust kiya gaya) ---
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const EmptyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

const HistoryPage = () => {
  // --- Logic (Koi Tabdeeli Nahi) ---
  const { address, isConnected } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (isConnected && address) {
        setLoading(true);
        const userTxs = await getUserTransactions(address);
        userTxs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(userTxs);
        setLoading(false);
      } else {
        setTransactions([]);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [address, isConnected]);
  // --- Logic End ---

  // Content ko conditionally render karne ka function
  const renderContent = () => {
    if (!isConnected) {
      return (
        // --- RESPONSIVE ENHANCEMENT: Info Box ki padding aur text size adjust ki gayi ---
        <div className="text-center bg-slate-800/50 p-6 sm:p-12 rounded-2xl border border-slate-700 flex flex-col items-center gap-4">
          <WalletIcon />
          <p className="text-base sm:text-lg font-semibold text-slate-200">Connect Your Wallet</p>
          <p className="text-sm sm:text-base text-slate-400 max-w-xs">Please connect your wallet to view your transaction history.</p>
        </div>
      );
    }
    
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spinner />
        </div>
      );
    }
    
    if (transactions.length === 0) {
      return (
        // --- RESPONSIVE ENHANCEMENT: Info Box ki padding aur text size adjust ki gayi ---
        <div className="text-center bg-slate-800/50 p-6 sm:p-12 rounded-2xl border border-slate-700 flex flex-col items-center gap-4">
          <EmptyIcon />
          <p className="text-base sm:text-lg font-semibold text-slate-200">No Transactions Found</p>
          <p className="text-sm sm:text-base text-slate-400 max-w-xs">You haven't made any bridge transactions with this address yet.</p>
        </div>
      );
    }

    return <HistoryTable transactions={transactions} />;
  };

  return (
    // Container ki padding pehle se responsive thi, usay nahi cheda gaya
    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* --- RESPONSIVE ENHANCEMENT: Header ka font size adjust kiya gaya --- */}
      <div className="pb-4 mb-8 border-b border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Transaction History</h1>
        <p className="mt-1 text-sm sm:text-base text-slate-400">Review your past cross-chain transactions.</p>
      </div>
      
      <div>{renderContent()}</div>
    </div>
  );
};

export default HistoryPage;






//---------------------- Simulation Mode -----------------------------


// import React, { useState, useEffect } from 'react';

// // API service, Wallet context, aur Constants ko import karein
// import { getUserTransactions } from '../services/bridgeApi';
// import { useWallet } from '../contexts/WalletContext';
// import { SUPPORTED_CHAINS } from '../constants/chains';
// import { SUPPORTED_TOKENS } from '../constants/tokens';

// // Components
// import HistoryTable from '../components/history/HistoryTable';
// import Spinner from '../components/ui/Spinner';

// // --- Simulation ke liye Farzi Data ---
// // Yeh data API response ke structure se match karta hai
// const dummyTransactions = [
//   {
//     createdAt: new Date('2025-11-10T10:30:00Z').toISOString(),
//     amount: '100000000000000000000', // 100 tokens (18 decimals)
//     status: 'completed',
//     source_chain: SUPPORTED_CHAINS[0].chainId,
//     dest_chain: SUPPORTED_CHAINS[1].chainId,
//     token_source: SUPPORTED_TOKENS[0].addresses[SUPPORTED_CHAINS[0].chainId] || '0xDummyTokenAddress1',
//     lock_tx_hash: '0x_dummy_lock_hash_1_completed',
//     release_tx_hash: '0x_dummy_release_hash_1_completed',
//     bridge_tx_hash: '0x_dummy_bridge_hash_1', // Unique key ke liye
//   },
//   {
//     createdAt: new Date('2025-11-09T18:00:00Z').toISOString(),
//     amount: '50000000000000000000', // 50 tokens (18 decimals)
//     status: 'pending',
//     source_chain: SUPPORTED_CHAINS[1].chainId,
//     dest_chain: SUPPORTED_CHAINS[0].chainId,
//     token_source: SUPPORTED_TOKENS[1]?.addresses[SUPPORTED_CHAINS[1].chainId] || '0xDummyTokenAddress2',
//     lock_tx_hash: '0x_dummy_lock_hash_2_pending',
//     release_tx_hash: null, // Pending hai to release hash null hoga
//     bridge_tx_hash: '0x_dummy_bridge_hash_2', // Unique key ke liye
//   },
//   {
//     createdAt: new Date('2025-11-08T12:00:00Z').toISOString(),
//     amount: '250000000000000000000', // 250 tokens
//     status: 'failed',
//     source_chain: SUPPORTED_CHAINS[0].chainId,
//     dest_chain: SUPPORTED_CHAINS[1].chainId,
//     token_source: SUPPORTED_TOKENS[0].addresses[SUPPORTED_CHAINS[0].chainId] || '0xDummyTokenAddress1',
//     lock_tx_hash: '0x_dummy_lock_hash_3_failed',
//     release_tx_hash: null,
//     bridge_tx_hash: '0x_dummy_bridge_hash_3',
//   },
// ];

// const HistoryPage = () => {
//   const { address, isConnected } = useWallet();
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       setLoading(true);
//       if (isConnected && address) {
//         // --- LIVE MODE ---
//         // Wallet connected hai to asli API call karein
//         const userTxs = await getUserTransactions(address);
//         userTxs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setTransactions(userTxs);
//       } else {
//         // --- SIMULATION MODE ---
//         // Wallet connect nahi hai, to dummy data dikhayein
//         setTransactions(dummyTransactions);
//       }
//       setLoading(false);
//     };

//     fetchHistory();
//   }, [address, isConnected]);

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-48">
//           <Spinner />
//         </div>
//       );
//     }
    
//     if (transactions.length === 0) {
//       return (
//         <div className="text-center bg-gray-800 p-8 rounded-lg">
//           <p className="text-gray-400">No bridge transactions found.</p>
//         </div>
//       );
//     }

//     return <HistoryTable transactions={transactions} />;
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//       <h1 className="text-3xl font-bold mb-6 text-white">Transaction History</h1>
      
//       {/* Agar wallet connect nahi to simulation ka message dikhayein */}
//       {!isConnected && (
//         <div className="text-center bg-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm mb-6">
//             Showing <span className="font-bold">simulated data</span>. Connect your wallet to view your live transaction history.
//         </div>
//       )}
      
//       <div>{renderContent()}</div>
//     </div>
//   );
// };

// export default HistoryPage;



