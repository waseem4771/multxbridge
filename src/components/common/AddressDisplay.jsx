
// import React from 'react';
// import toast from 'react-hot-toast'; // Notifications ke liye

// // Context, Formatters, aur Constants
// import { useWallet } from '../../contexts/WalletContext';
// import { shortenAddress } from '../../utils/formatters';
// import { CHAINS_BY_ID } from '../../constants/chains';

// const AddressDisplay = () => {
//   // --- Logic (Koi Tabdeeli Nahi) ---
//   const { address, chainId } = useWallet();
//   if (!address) {
//     return null;
//   }
//   const displayAddress = shortenAddress(address);
//   const explorerUrl = CHAINS_BY_ID[chainId]?.explorerUrl;
//   const handleCopy = () => {
//     navigator.clipboard.writeText(address);
//     toast.success('Address Copied!');
//   };
//   // --- Logic End ---

//   // Icons (Inka design ab thora behtar kiya gaya hai)
//   const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> );
//   const ExternalLinkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> );

//   return (
//     // --- ENHANCEMENT: Main container ka design behtar kiya gaya hai ---
//     // - Slate colors ka istemal
//     // - Halka sa border
//     // - Spacing behtar ki gayi hai (pl-4, pr-2)
//     <div className="flex items-center gap-2 bg-slate-800 pl-4 pr-2 py-1.5 rounded-full border border-slate-700 font-mono text-sm">
//       <span className="text-slate-100" title={address}>{displayAddress}</span>
      
//       {/* --- ENHANCEMENT: Ek halki si line jo address aur icons ko alag karti hai --- */}
//       <div className="h-4 w-px bg-slate-600"></div>

//       <div className="flex items-center gap-1">
//         {/* --- ENHANCEMENT: Copy Button ka hover effect behtar kiya gaya hai --- */}
//         <button 
//           onClick={handleCopy}
//           className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-sky-400 transition-all duration-200"
//           title="Copy Address"
//         >
//           <CopyIcon />
//         </button>

//         {/* --- ENHANCEMENT: Explorer link ka hover effect behtar kiya gaya hai --- */}
//         {explorerUrl && (
//           <a 
//             href={`${explorerUrl}/address/${address}`} 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-sky-400 transition-all duration-200"
//             title="View on Explorer"
//           >
//             <ExternalLinkIcon />
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddressDisplay;



// -------------------- Mobile Responsive ----------------------------------

import React from 'react';
import toast from 'react-hot-toast'; // Notifications ke liye

// Context, Formatters, aur Constants
import { useWallet } from '../../contexts/WalletContext';
import { shortenAddress } from '../../utils/formatters';
import { CHAINS_BY_ID } from '../../constants/chains';

const AddressDisplay = () => {
  // --- Logic (Koi Tabdeeli Nahi) ---
  const { address, chainId } = useWallet();
  if (!address) {
    return null;
  }
  const displayAddress = shortenAddress(address);
  const explorerUrl = CHAINS_BY_ID[chainId]?.explorerUrl;
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address Copied!');
  };
  // --- Logic End ---

  // Icons (Inka design ab thora behtar kiya gaya hai)
  const CopyIcon = () => ( <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> );
  const ExternalLinkIcon = () => ( <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> );

  return (
    // --- RESPONSIVE ENHANCEMENT: Main container ka design adjust kiya gaya hai ---
    // - Mobile ke liye padding (pl, pr) aur font-size thora kam kiya gaya hai.
    <div className="flex items-center gap-2 bg-slate-800 pl-3 pr-1.5 md:pl-4 md:pr-2 py-1.5 rounded-full border border-slate-700 font-mono text-xs md:text-sm">
      <span className="text-slate-100" title={address}>{displayAddress}</span>
      
      {/* --- ENHANCEMENT: Ek halki si line jo address aur icons ko alag karti hai --- */}
      <div className="h-4 w-px bg-slate-600"></div>

      <div className="flex items-center gap-1">
        {/* --- ENHANCEMENT: Copy Button ka hover effect behtar kiya gaya hai --- */}
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-sky-400 transition-all duration-200"
          title="Copy Address"
        >
          <CopyIcon />
        </button>

        {/* --- ENHANCEMENT: Explorer link ka hover effect behtar kiya gaya hai --- */}
        {explorerUrl && (
          <a 
            href={`${explorerUrl}/address/${address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-sky-400 transition-all duration-200"
            title="View on Explorer"
          >
            <ExternalLinkIcon />
          </a>
        )}
      </div>
    </div>
  );
};

export default AddressDisplay;





//----------------   Simulation Mode  --------------------------


// import React from 'react';
// import toast from 'react-hot-toast';

// // Context, Formatters, aur Constants
// import { useWallet } from '../../contexts/WalletContext';
// import { shortenAddress } from '../../utils/formatters';
// import { CHAINS_BY_ID } from '../../constants/chains';

// // --- YAHAN TABDEELI HUI HAI ---
// // Component ab 'addressProp' naam ka aik optional prop lega
// const AddressDisplay = ({ addressProp }) => {
//   // Context se live address haasil karein
//   const { address: contextAddress, chainId } = useWallet();

//   // Agar 'addressProp' mojood hai (simulation mode), to usay istemal karein,
//   // warna context se live address lein.
//   const address = addressProp || contextAddress;

//   // Agar koi bhi address nahi hai (na prop mein, na context mein), to kuch na dikhayein
//   if (!address) {
//     return null;
//   }
  
//   // Baaqi logic bilkul waise hi rahegi
//   const displayAddress = shortenAddress(address);
//   const explorerUrl = CHAINS_BY_ID[chainId]?.explorerUrl;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(address);
//     toast.success('Address Copied!');
//   };

//   const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> );
//   const ExternalLinkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> );

//   return (
//     <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full font-mono text-sm">
//       <span className="text-white" title={address}>{displayAddress}</span>
      
//       <button 
//         onClick={handleCopy}
//         className="text-gray-400 hover:text-white transition-colors"
//         title="Copy Address"
//       >
//         <CopyIcon />
//       </button>

//       {/* Simulation mode mein explorer link na dikhayein kyunke chainId live nahi hogi */}
//       {explorerUrl && (
//         <a 
//           href={`${explorerUrl}/address/${address}`} 
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="text-gray-400 hover:text-white transition-colors"
//           title="View on Explorer"
//         >
//           <ExternalLinkIcon />
//         </a>
//       )}
//     </div>
//   );
// };

// export default AddressDisplay;