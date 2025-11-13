
// import React from 'react';

// // HistoryTableRow component ko import karein
// import HistoryTableRow from './HistoryTableRow';

// const HistoryTable = ({ transactions }) => {
//   return (
//     // --- ENHANCEMENT: Main container ka design behtar kiya gaya hai ---
//     // - Slate colors ka istemal
//     // - Corners ko thora zyada gol kiya gaya hai (rounded-xl)
//     // - Halka sa "glassmorphism" effect
//     <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-x-auto">
//       <table className="min-w-full divide-y divide-slate-700">
        
//         {/* --- ENHANCEMENT: Table header ka background halka sa behtar kiya gaya hai --- */}
//         <thead className="bg-slate-500/5">
//           <tr>
//             {/* - Text ka rang behtar kiya gaya hai */}
//             <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date & Time</th>
//             <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Token & Amount</th>
//             <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Direction</th>
//             <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
//             <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Links</th>
//           </tr>
//         </thead>
        
//         {/* --- ENHANCEMENT: Table body ka background hata diya gaya hai taake rows ka hover effect saaf nazar aaye --- */}
//         <tbody className="divide-y divide-slate-700">
//           {transactions.map((tx) => (
//             <HistoryTableRow key={tx.bridge_tx_hash || tx.lock_tx_hash} tx={tx} />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default HistoryTable;











//----------------- Mobile Responsive ----------------------------------

import React from 'react';

// HistoryTableRow component ko import karein
import HistoryTableRow from './HistoryTableRow';

const HistoryTable = ({ transactions }) => {
  return (
    // --- ENHANCEMENT: Main container ka design behtar kiya gaya hai ---
    // - overflow-x-auto is component ko pehle se hi mobile-friendly banata hai
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        
        {/* --- ENHANCEMENT: Table header ka background halka sa behtar kiya gaya hai --- */}
        <thead className="bg-slate-500/5">
          <tr>
            {/* --- RESPONSIVE ENHANCEMENT: Horizontal padding (px) ko mobile ke liye kam kiya gaya hai --- */}
            <th className="px-4 py-4 md:px-6 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date & Time</th>
            <th className="px-4 py-4 md:px-6 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Token & Amount</th>
            <th className="px-4 py-4 md:px-6 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Direction</th>
            <th className="px-4 py-4 md:px-6 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-4 py-4 md:px-6 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Links</th>
          </tr>
        </thead>
        
        {/* --- ENHANCEMENT: Table body ka background hata diya gaya hai taake rows ka hover effect saaf nazar aaye --- */}
        <tbody className="divide-y divide-slate-700">
          {/* Note: Behtar responsiveness ke liye HistoryTableRow component ke andar bhi padding ko isi tarah adjust karna hoga */}
          {transactions.map((tx) => (
            <HistoryTableRow key={tx.bridge_tx_hash || tx.lock_tx_hash} tx={tx} />
          ))}
        </tbody>
      </table>
      
      {/* --- RESPONSIVE ENHANCEMENT: Agar koi transaction na ho to mobile par message dikhana --- */}
      {transactions.length === 0 && (
        <div className="text-center py-10 px-4">
          <p className="text-slate-400">No transaction history found.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;