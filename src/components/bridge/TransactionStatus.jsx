

// import React from 'react';

// // Yeh hamare bridging ke amal ke tamam marahil hain
// const STEPS = [
//   'Approve Token',
//   'Lock Tokens',
//   'Waiting for Validators',
//   'Release on Destination Chain'
// ];

// // 'currentStepIndex' ek prop hai jo batayega ke hum kis marahale par hain
// const TransactionStatus = ({ currentStepIndex = 0 }) => {
//   return (
//     // --- ENHANCEMENT: Container ka design behtar kiya gaya hai ---
//     // - Theme ke saath match karne ke liye 'slate' colors ka istemal
//     <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
//       <h3 className="text-lg font-bold mb-4 text-slate-100">Transaction Status</h3>
      
//       {/* --- ENHANCEMENT: Steps ko ek list ke taur par dikhaya gaya hai --- */}
//       <div className="relative">
//         {STEPS.map((step, index) => (
//           <div key={step} className="flex items-start gap-4 relative pb-6 last:pb-0">
            
//             {/* --- ENHANCEMENT 1: Connecting Line --- */}
//             {/* Yeh line har step ko doosre se jodti hai */}
//             {index < STEPS.length - 1 && (
//               <div className="absolute left-3 top-5 h-full w-0.5 bg-slate-700"></div>
//             )}

//             {/* --- ENHANCEMENT 2: Icon ka style behtar kiya gaya hai --- */}
//             <div 
//               className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
//                 index < currentStepIndex 
//                   ? 'bg-green-400 border-green-400' // Mukammal ho chuka
//                   : index === currentStepIndex 
//                     ? 'border-sky-400 animate-pulse' // Abhi jaari hai (animation ke saath)
//                     : 'border-slate-600 bg-slate-800' // Abhi baqi hai
//               }`}
//             >
//               {index < currentStepIndex && (
//                 // Mukammal shuda marahale ke liye tick mark
//                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                 </svg>
//               )}
//               {index === currentStepIndex && (
//                 // Maujooda marahale ke liye andarooni neela daira
//                 <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
//               )}
//             </div>

//             {/* --- ENHANCEMENT 3: Marahale ka naam aur text style behtar kiya gaya hai --- */}
//             <div>
//               <p className={`font-semibold transition-colors duration-300 ${
//                 index <= currentStepIndex ? 'text-slate-100' : 'text-slate-500'
//               }`}>
//                 {step}
//               </p>
//               {index === currentStepIndex && (
//                 <p className="text-xs text-sky-400 mt-1">In progress...</p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TransactionStatus;











//-------------------------- Mobile Responsive ------------------------------------


import React from 'react';

// Yeh hamare bridging ke amal ke tamam marahil hain
const STEPS = [
  'Approve Token',
  'Lock Tokens',
  'Waiting for Validators',
  'Release on Destination Chain'
];

// 'currentStepIndex' ek prop hai jo batayega ke hum kis marahale par hain
const TransactionStatus = ({ currentStepIndex = 0 }) => {
  return (
    // --- RESPONSIVE ENHANCEMENT: Padding ko mobile ke liye adjust kiya gaya ---
    <div className="bg-slate-800 p-4 md:p-5 rounded-2xl border border-slate-700">
      {/* --- RESPONSIVE ENHANCEMENT: Title ka font size mobile ke liye chota kiya gaya --- */}
      <h3 className="text-base md:text-lg font-bold mb-4 text-slate-100">Transaction Status</h3>
      
      {/* --- ENHANCEMENT: Steps ko ek list ke taur par dikhaya gaya hai --- */}
      <div className="relative">
        {STEPS.map((step, index) => (
          // --- RESPONSIVE ENHANCEMENT: Gap aur padding ko mobile ke liye adjust kiya gaya ---
          <div key={step} className="flex items-start gap-3 md:gap-4 relative pb-5 md:pb-6 last:pb-0">
            
            {/* --- ENHANCEMENT 1: Connecting Line --- */}
            {/* Yeh line har step ko doosre se jodti hai */}
            {index < STEPS.length - 1 && (
              <div className="absolute left-3 top-5 h-full w-0.5 bg-slate-700"></div>
            )}

            {/* --- ENHANCEMENT 2: Icon ka style behtar kiya gaya hai --- */}
            <div 
              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                index < currentStepIndex 
                  ? 'bg-green-400 border-green-400' // Mukammal ho chuka
                  : index === currentStepIndex 
                    ? 'border-sky-400 animate-pulse' // Abhi jaari hai (animation ke saath)
                    : 'border-slate-600 bg-slate-800' // Abhi baqi hai
              }`}
            >
              {index < currentStepIndex && (
                // Mukammal shuda marahale ke liye tick mark
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {index === currentStepIndex && (
                // Maujooda marahale ke liye andarooni neela daira
                <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
              )}
            </div>

            {/* --- ENHANCEMENT 3: Marahale ka naam aur text style behtar kiya gaya hai --- */}
            <div>
              {/* --- RESPONSIVE ENHANCEMENT: Step ka font size mobile ke liye adjust kiya gaya --- */}
              <p className={`font-semibold text-sm md:text-base transition-colors duration-300 ${
                index <= currentStepIndex ? 'text-slate-100' : 'text-slate-500'
              }`}>
                {step}
              </p>
              {index === currentStepIndex && (
                <p className="text-xs text-sky-400 mt-1">In progress...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionStatus;