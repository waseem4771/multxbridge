

// import React, { useState } from 'react';

// // UI components aur constants ko import karein
// import Modal from '../ui/Modal';
// // Ab hum tokens ki list constants se lenge
// import { SUPPORTED_TOKENS } from '../../constants/tokens';

// // --- ENHANCEMENT: Search icon component ---
// const SearchIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );


// const TokenSelectorModal = ({ isOpen, onClose, onTokenSelect }) => {
//   // --- ENHANCEMENT: Search ki state manage karna ---
//   const [searchTerm, setSearchTerm] = useState('');

//   // --- ENHANCEMENT: Search term ke hisab se tokens ko filter karna ---
//   const filteredTokens = SUPPORTED_TOKENS.filter(token =>
//     token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     token.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     // Modal component waisa hi hai, uske andar ka content behtar kiya gaya hai
//     <Modal isOpen={isOpen} onClose={onClose} title="Select a token">
      
//       {/* --- ENHANCEMENT: Search input ko behtar banaya gaya hai --- */}
//       <div className="relative mb-4">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
//           <SearchIcon />
//         </div>
//         <input
//           type="text"
//           placeholder="Search by name or token symbol"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           // - Polished styling: rounded-xl, slate colors, pl-11 for icon space
//           className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
//         />
//       </div>
      
//       {/* --- ENHANCEMENT: Token list aur custom scrollbar --- */}
//       <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        
//         {filteredTokens.map((token) => (
//           <button
//             key={token.symbol}
//             onClick={() => onTokenSelect(token.symbol)} 
//             // - Polished styling: slate colors, rounded-xl, behtar hover effect
//             className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-colors duration-200"
//           >
//             <div className="flex items-center gap-4">
//               <img src={token.logo} alt={token.name} className="w-9 h-9 rounded-full" />
//               <div>
//                 <p className="font-bold text-left text-base text-slate-100">{token.symbol}</p>
//                 <p className="text-sm text-slate-400 text-left">{token.name}</p>
//               </div>
//             </div>
//             {/* Yahan aap baad mein balance dikha sakte hain */}
//           </button>
//         ))}

//         {/* --- ENHANCEMENT: Agar search se koi token na mile to message dikhana --- */}
//         {filteredTokens.length === 0 && (
//           <div className="text-center py-10 text-slate-500">
//             <p className="font-semibold">No tokens found</p>
//             <p className="text-sm">Try a different search term.</p>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default TokenSelectorModal;









//---------------- Mobile Responsive ---------------------------------

import React, { useState } from 'react';

// UI components aur constants ko import karein
import Modal from '../ui/Modal';
// Ab hum tokens ki list constants se lenge
import { SUPPORTED_TOKENS } from '../../constants/tokens';

// --- ENHANCEMENT: Search icon component ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);


const TokenSelectorModal = ({ isOpen, onClose, onTokenSelect }) => {
  // --- ENHANCEMENT: Search ki state manage karna ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- ENHANCEMENT: Search term ke hisab se tokens ko filter karna ---
  const filteredTokens = SUPPORTED_TOKENS.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Modal component waisa hi hai, uske andar ka content behtar kiya gaya hai
    <Modal isOpen={isOpen} onClose={onClose} title="Select a token">
      
      {/* --- ENHANCEMENT: Search input ko behtar banaya gaya hai --- */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search by name or token symbol"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // - Polished styling: rounded-xl, slate colors, pl-11 for icon space
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
        />
      </div>
      
      {/* --- RESPONSIVE ENHANCEMENT: Token list aur custom scrollbar --- */}
      {/* 
        - Mobile k liye max-h-[60vh] taake list screen se bahar na jaye.
        - Desktop k liye wahi purana max-h-[400px] rakha gaya hai (md: prefix k sath).
      */}
      <div className="space-y-1 max-h-[60vh] md:max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        
        {filteredTokens.map((token) => (
          <button
            key={token.symbol}
            onClick={() => onTokenSelect(token.symbol)} 
            // - Polished styling: slate colors, rounded-xl, behtar hover effect
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <img src={token.logo} alt={token.name} className="w-9 h-9 rounded-full" />
              <div>
                <p className="font-bold text-left text-base text-slate-100">{token.symbol}</p>
                <p className="text-sm text-slate-400 text-left">{token.name}</p>
              </div>
            </div>
            {/* Yahan aap baad mein balance dikha sakte hain */}
          </button>
        ))}

        {/* --- ENHANCEMENT: Agar search se koi token na mile to message dikhana --- */}
        {filteredTokens.length === 0 && (
          // --- RESPONSIVE ENHANCEMENT: Mobile par vertical padding thori kam kar di hai ---
          <div className="text-center py-6 md:py-10 text-slate-500">
            <p className="font-semibold">No tokens found</p>
            <p className="text-sm">Try a different search term.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TokenSelectorModal;