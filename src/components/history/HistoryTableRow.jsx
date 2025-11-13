
// import React from 'react';
// import { ethers } from 'ethers';
// import { format } from 'date-fns';

// // Constants
// import { CHAINS_BY_ID } from '../../constants/chains';
// import { SUPPORTED_TOKENS } from '../../constants/tokens';

// // Status ke hisab se CSS classes dene wala function (Updated)
// // Ab yeh badge aur dot dono ke liye classes deta hai
// const getStatusClasses = (status) => {
//   const lowerStatus = status?.toLowerCase();
//   switch (lowerStatus) {
//     case 'completed':
//     case 'released':
//       return {
//         badge: 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20',
//         dot: 'bg-green-500',
//       };
//     case 'pending':
//     case 'signed':
//       return {
//         badge: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/20',
//         dot: 'bg-yellow-500',
//       };
//     case 'failed':
//       return {
//         badge: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
//         dot: 'bg-red-500',
//       };
//     default:
//       return {
//         badge: 'bg-gray-500/10 text-gray-400 ring-1 ring-inset ring-gray-500/20',
//         dot: 'bg-gray-500',
//       };
//   }
// };

// const HistoryTableRow = ({ tx }) => {
//   // API se aanay wale data ko destructure karein
//   const {
//     createdAt,
//     amount,
//     status,
//     source_chain: sourceChainId,
//     dest_chain: destChainId,
//     token_source: tokenAddress,
//     lock_tx_hash,
//     release_tx_hash,
//   } = tx;

//   // IDs ke zariye chain aur token ki poori malumat haasil karein
//   const sourceChain = CHAINS_BY_ID[sourceChainId];
//   const destChain = CHAINS_BY_ID[destChainId];
//   const token = SUPPORTED_TOKENS.find(t => t.addresses[sourceChainId]?.toLowerCase() === tokenAddress?.toLowerCase());

//   // Data ko display ke liye format karein
//   const formattedAmount = ethers.utils.formatUnits(amount, token?.decimals || 18);
//   const formattedDate = format(new Date(createdAt), "d MMM yyyy, h:mm a");
  
//   const statusClasses = getStatusClasses(status);

//   return (
//     // Har row ke neeche halki si border aur behtar hover effect
//     <tr className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors duration-150 ease-in-out">
      
//       {/* Date & Time */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formattedDate}</td>
      
//       {/* Token & Amount */}
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center gap-3">
//           {token && <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />}
//           <div>
//             <div className="text-base font-medium text-white">{parseFloat(formattedAmount).toFixed(4)}</div>
//             <div className="text-sm text-gray-400">{token?.symbol || 'N/A'}</div>
//           </div>
//         </div>
//       </td>
      
//       {/* Direction */}
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center gap-3 text-sm" title={`${sourceChain?.name} → ${destChain?.name}`}>
//           {sourceChain && <img src={sourceChain.logo} alt={sourceChain.name} className="w-6 h-6 rounded-full" />}
//           {/* Arrow ki jagah modern icon */}
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//           </svg>
//           {destChain && <img src={destChain.logo} alt={destChain.name} className="w-6 h-6 rounded-full" />}
//         </div>
//       </td>
      
//       {/* Status */}
//       <td className="px-6 py-4 whitespace-nowrap text-center">
//         <span className={`px-3 py-1.5 inline-flex items-center gap-2 text-xs font-semibold rounded-full capitalize ${statusClasses.badge}`}>
//           {/* Status ke sath chhota sa dot */}
//           <span className={`h-2 w-2 rounded-full ${statusClasses.dot}`} />
//           {status}
//         </span>
//       </td>
      
//       {/* Links */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm">
//         <div className="flex items-center justify-center gap-6">
//           {/* Lock link ke liye icon */}
//           {lock_tx_hash && sourceChain ? (
//             <a href={`${sourceChain.explorerUrl}/tx/${lock_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors" title={`View Lock Tx on ${sourceChain.name}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//               </svg>
//             </a>
//           ) : <div className="w-5 h-5" /> /* Placeholder to keep alignment */}
          
//           {/* Release link ke liye icon */}
//           {release_tx_hash && destChain ? (
//             <a href={`${destChain.explorerUrl}/tx/${release_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors" title={`View Release Tx on ${destChain.name}`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//               </svg>
//             </a>
//           ) : <div className="w-5 h-5" /> /* Placeholder to keep alignment */}
//         </div>
//       </td>
      
//     </tr>
//   );
// };

// export default HistoryTableRow;










//----------------- Mobile Responsive ----------------------------

import React from 'react';
import { ethers } from 'ethers';
import { format } from 'date-fns';

// Constants
import { CHAINS_BY_ID } from '../../constants/chains';
import { SUPPORTED_TOKENS } from '../../constants/tokens';

// Status ke hisab se CSS classes dene wala function (Updated)
// Ab yeh badge aur dot dono ke liye classes deta hai
const getStatusClasses = (status) => {
  const lowerStatus = status?.toLowerCase();
  switch (lowerStatus) {
    case 'completed':
    case 'released':
      return {
        badge: 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20',
        dot: 'bg-green-500',
      };
    case 'pending':
    case 'signed':
      return {
        badge: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/20',
        dot: 'bg-yellow-500',
      };
    case 'failed':
      return {
        badge: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
        dot: 'bg-red-500',
      };
    default:
      return {
        badge: 'bg-gray-500/10 text-gray-400 ring-1 ring-inset ring-gray-500/20',
        dot: 'bg-gray-500',
      };
  }
};

const HistoryTableRow = ({ tx }) => {
  // API se aanay wale data ko destructure karein
  const {
    createdAt,
    amount,
    status,
    source_chain: sourceChainId,
    dest_chain: destChainId,
    token_source: tokenAddress,
    lock_tx_hash,
    release_tx_hash,
  } = tx;

  // IDs ke zariye chain aur token ki poori malumat haasil karein
  const sourceChain = CHAINS_BY_ID[sourceChainId];
  const destChain = CHAINS_BY_ID[destChainId];
  const token = SUPPORTED_TOKENS.find(t => t.addresses[sourceChainId]?.toLowerCase() === tokenAddress?.toLowerCase());

  // Data ko display ke liye format karein
  const formattedAmount = ethers.utils.formatUnits(amount, token?.decimals || 18);
  // --- RESPONSIVE ENHANCEMENT: Mobile ke liye chota date format ---
  const formattedDate = format(new Date(createdAt), "d MMM, h:mm a");
  const fullDate = format(new Date(createdAt), "d MMM yyyy, h:mm a");
  
  const statusClasses = getStatusClasses(status);

  return (
    // Har row ke neeche halki si border aur behtar hover effect
    <tr className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors duration-150 ease-in-out">
      
      {/* Date & Time */}
      {/* --- RESPONSIVE ENHANCEMENT: Padding adjust ki gayi --- */}
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-400" title={fullDate}>{formattedDate}</td>
      
      {/* Token & Amount */}
      {/* --- RESPONSIVE ENHANCEMENT: Padding, font size aur image size adjust kiya gaya --- */}
      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 md:gap-3">
          {token && <img src={token.logo} alt={token.symbol} className="w-6 h-6 md:w-8 md:h-8 rounded-full" />}
          <div>
            <div className="text-sm md:text-base font-medium text-white">{parseFloat(formattedAmount).toFixed(4)}</div>
            <div className="text-xs md:text-sm text-gray-400">{token?.symbol || 'N/A'}</div>
          </div>
        </div>
      </td>
      
      {/* Direction */}
      {/* --- RESPONSIVE ENHANCEMENT: Padding, gap aur image size adjust kiya gaya --- */}
      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 md:gap-3 text-sm" title={`${sourceChain?.name} → ${destChain?.name}`}>
          {sourceChain && <img src={sourceChain.logo} alt={sourceChain.name} className="w-5 h-5 md:w-6 md:h-6 rounded-full" />}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          {destChain && <img src={destChain.logo} alt={destChain.name} className="w-5 h-5 md:w-6 md:h-6 rounded-full" />}
        </div>
      </td>
      
      {/* Status */}
      {/* --- RESPONSIVE ENHANCEMENT: Padding adjust ki gayi --- */}
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
        <span className={`px-2.5 py-1 md:px-3 md:py-1.5 inline-flex items-center gap-2 text-xs font-semibold rounded-full capitalize ${statusClasses.badge}`}>
          <span className={`h-2 w-2 rounded-full ${statusClasses.dot}`} />
          {status}
        </span>
      </td>
      
      {/* Links */}
      {/* --- RESPONSIVE ENHANCEMENT: Padding aur gap adjust kiya gaya --- */}
      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {lock_tx_hash && sourceChain ? (
            <a href={`${sourceChain.explorerUrl}/tx/${lock_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors" title={`View Lock Tx on ${sourceChain.name}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : <div className="w-5 h-5" /> }
          
          {release_tx_hash && destChain ? (
            <a href={`${destChain.explorerUrl}/tx/${release_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors" title={`View Release Tx on ${destChain.name}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : <div className="w-5 h-5" /> }
        </div>
      </td>
      
    </tr>
  );
};

export default HistoryTableRow;