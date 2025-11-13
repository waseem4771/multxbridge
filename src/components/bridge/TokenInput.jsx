
// import React, { useState } from 'react';
// import TokenSelectorModal from './TokenSelectorModal';

// // Hooks and Constants
// import useBalance from '../../hooks/useBalance';
// import { getTokenAddress, SUPPORTED_TOKENS } from '../../constants/tokens';

// const TokenInput = ({ amount, onAmountChange, selectedToken, onTokenSelect, sourceChainId }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // --- Logic (Koi Tabdeeli Nahi) ---
//   const tokenAddress = getTokenAddress(selectedToken, sourceChainId);
//   const { balance, loading } = useBalance(tokenAddress);
//   const currentToken = SUPPORTED_TOKENS.find(t => t.symbol === selectedToken);
//   const handleTokenSelection = (tokenSymbol) => {
//     onTokenSelect(tokenSymbol);
//     setIsModalOpen(false);
//   };
//   // --- Logic End ---

//   return (
//     <>
//       <div>
//         {/* --- ENHANCEMENT: Main container ka design behtar kiya gaya hai --- */}
//         {/* - bg-slate-800: Theme ke saath match karta hua background */}
//         {/* - rounded-2xl: Ziada gol corners */}
//         {/* - focus-within:border-sky-500: Vibrant highlight color */}
//         <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 focus-within:border-sky-500 transition-all duration-300">
//           <div className="flex justify-between items-center">
            
//             {/* --- ENHANCEMENT: Input field aur Token Selector ka layout behtar kiya gaya hai --- */}
//             <div className="flex-grow">
//               <input 
//                 type="number" 
//                 placeholder="0.0"
//                 // - placeholder:text-slate-600: Placeholder ka rang halka kiya gaya hai
//                 className="bg-transparent text-4xl font-mono w-full outline-none text-slate-100 placeholder:text-slate-600"
//                 value={amount}
//                 onChange={(e) => onAmountChange(e.target.value)}
//               />
//             </div>

//             {/* --- ENHANCEMENT: Token Selector button ka style behtar kiya gaya hai --- */}
//             {/* - bg-slate-700: Theme ke saath match karta hua background */}
//             {/* - px-3 py-2: Thori behtar padding */}
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="flex-shrink-0 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-full font-semibold text-base transition-colors ml-4"
//             >
//               {currentToken && (
//                 <img src={currentToken.logo} alt={currentToken.name} className="w-7 h-7 rounded-full" />
//               )}
//               <span className="text-slate-100">{currentToken?.symbol}</span>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
//             </button>
//           </div>
          
//           {/* --- ENHANCEMENT: Balance aur Max button ka layout saaf kiya gaya hai --- */}
//           <div className="flex justify-between items-center text-sm mt-3 px-1">
//             <span className="text-slate-400 font-mono font-medium">
//               Balance: {loading ? 'Loading...' : balance}
//             </span>

//             {/* --- ENHANCEMENT: "Max" button ko ek proper, clickable button banaya gaya hai --- */}
//             <button 
//               onClick={() => onAmountChange(balance)}
//               className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 font-semibold text-xs px-2.5 py-0.5 rounded-full transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
//               disabled={loading || !balance || parseFloat(balance) === 0}
//             >
//               MAX
//             </button>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <TokenSelectorModal 
//           isOpen={isModalOpen} 
//           onClose={() => setIsModalOpen(false)}
//           onTokenSelect={handleTokenSelection}
//         />
//       )}
//     </>
//   );
// };

// export default TokenInput;
















//---------------------- Mobile Respnsive -----------------------------------





import React, { useState } from 'react';
import TokenSelectorModal from './TokenSelectorModal';

// Hooks and Constants
import useBalance from '../../hooks/useBalance';
import { getTokenAddress, SUPPORTED_TOKENS } from '../../constants/tokens';

const TokenInput = ({ amount, onAmountChange, selectedToken, onTokenSelect, sourceChainId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Logic (Koi Tabdeeli Nahi) ---
  const tokenAddress = getTokenAddress(selectedToken, sourceChainId);
  const { balance, loading } = useBalance(tokenAddress);
  const currentToken = SUPPORTED_TOKENS.find(t => t.symbol === selectedToken);
  const handleTokenSelection = (tokenSymbol) => {
    onTokenSelect(tokenSymbol);
    setIsModalOpen(false);
  };
  // --- Logic End ---

  return (
    <>
      <div>
        {/* === RESPONSIVE CHANGE: Padding ko adjust kiya gaya hai === */}
        <div className="bg-slate-800 p-3 sm:p-4 rounded-2xl border border-slate-700 focus-within:border-sky-500 transition-all duration-300">
          <div className="flex justify-between items-center">
            
            <div className="flex-grow">
              {/* === RESPONSIVE CHANGE: Font size ko adjust kiya gaya hai === */}
              <input 
                type="number" 
                placeholder="0.0"
                className="bg-transparent text-3xl sm:text-4xl font-mono w-full outline-none text-slate-100 placeholder:text-slate-600"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
              />
            </div>

            {/* === RESPONSIVE CHANGE: Button ka size, padding aur text adjust kiya gaya hai === */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 bg-slate-700 hover:bg-slate-600 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full font-semibold text-base transition-colors ml-2 sm:ml-4"
            >
              {currentToken && (
                <img src={currentToken.logo} alt={currentToken.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
              )}
              {/* Token ka naam sirf bari screens par dikhega */}
              <span className="text-slate-100 hidden sm:inline">{currentToken?.symbol}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
          
          {/* === RESPONSIVE CHANGE: Font size aur margin ko adjust kiya gaya hai === */}
          <div className="flex justify-between items-center text-xs sm:text-sm mt-2 sm:mt-3 px-1">
            <span className="text-slate-400 font-mono font-medium">
              Balance: {loading ? '...' : balance}
            </span>

            <button 
              onClick={() => onAmountChange(balance)}
              className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 font-semibold text-xs px-2.5 py-0.5 rounded-full transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
              disabled={loading || !balance || parseFloat(balance) === 0}
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TokenSelectorModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onTokenSelect={handleTokenSelection}
        />
      )}
    </>
  );
};

export default TokenInput;