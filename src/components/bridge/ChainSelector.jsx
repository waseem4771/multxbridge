

// import React from 'react';

// // Yeh component 'From' ya 'To' block ko dikhane ke liye hai.
// // Hum isay do baar istemal karenge, ek baar 'From' ke liye aur ek baar 'To' ke liye.
// const ChainSelector = ({ label, chainName, chainLogo }) => {
//   return (
//     // --- ENHANCEMENT: Card ka design behtar kiya gaya hai, size wahi hai ---
//     // - Original size barkarar hai: p-4, rounded-xl, space-y-1
//     // - Background aur border ke rang behtar kiye gaye hain
//     // - Hover par interactive effect add kiya gaya hai
//     <div className="bg-slate-800 p-4 rounded-xl space-y-1 border border-slate-700 transition-all duration-300 hover:border-slate-600 hover:bg-slate-700/50">
      
//       {/* --- ENHANCEMENT: Label ka style professional banaya gaya hai --- */}
//       {/* - Font size wahi hai: text-xs */}
//       {/* - Style behtar kiya gaya hai: uppercase, tracking-wider */}
//       <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-medium">{label}</p>
      
//       {/* --- ENHANCEMENT: Chain info mein behtari --- */}
//       {/* - Original spacing barkarar hai: gap-3 */}
//       <div className="flex items-center gap-3">
        
//         {/* --- ENHANCEMENT: Logo ko ek circle mein daala gaya hai --- */}
//         {/* - Is se logo alag se nazar aata hai aur design mein depth aati hai */}
//         <div className="bg-slate-900 p-1 rounded-full">
//           <img src={chainLogo} alt={`${chainName} logo`} className="w-8 h-8" />
//         </div>

//         {/* --- ENHANCEMENT: Chain ka naam wazeh kiya gaya hai --- */}
//         {/* - Original font size barkarar hai: text-lg */}
//         {/* - Rang behtar kiya gaya hai: text-slate-100 */}
//         <span className="text-lg font-bold text-slate-100">{chainName}</span>

//       </div>

//     </div>
//   );
// };

// export default ChainSelector;





//-------------- Mobile Responsive ----------------------------------




import React from 'react';

// Yeh component 'From' ya 'To' block ko dikhane ke liye hai.
// Hum isay do baar istemal karenge, ek baar 'From' ke liye aur ek baar 'To' ke liye.
const ChainSelector = ({ label, chainName, chainLogo }) => {
  return (
    // === RESPONSIVE CHANGE: Padding ko mobile ke liye adjust kiya gaya hai ===
    <div className="bg-slate-800 p-3 sm:p-4 rounded-xl space-y-1 border border-slate-700 transition-all duration-300 hover:border-slate-600 hover:bg-slate-700/50">
      
      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-medium">{label}</p>
      
      {/* === RESPONSIVE CHANGE: Gap ko mobile ke liye kam kiya gaya hai === */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* === RESPONSIVE CHANGE: Logo ke size ko mobile ke liye adjust kiya gaya hai === */}
        <div className="bg-slate-900 p-1 rounded-full">
          <img src={chainLogo} alt={`${chainName} logo`} className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        {/* === RESPONSIVE CHANGE: Font size ko mobile ke liye adjust kiya gaya hai === */}
        <span className="text-base sm:text-lg font-bold text-slate-100">{chainName}</span>

      </div>

    </div>
  );
};

export default ChainSelector;



