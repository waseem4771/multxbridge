
// import React from 'react';

// const Footer = () => {
//   // `new Date().getFullYear()` se hamesha current saal display hoga
//   const currentYear = new Date().getFullYear();

//   return (
//     // 'footer' tag page ke aakhir mein content ko semantic tor par define karta hai
//     // - Padding 'py-4' se kam kar di gayi hai
//     <footer className="border-t border-gray-800 mt-auto py-4">
//       <div className="container mx-auto px-4">
//         {/* 
//           - Flexbox ka istemal karke content ko left aur right align kiya gaya hai.
//           - Choti screens par yeh stack ho jayega (flex-col sm:flex-row).
//         */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
//           {/* 1. Copyright notice (Left side) */}
//           <div className="text-sm text-gray-500">
//             &copy; {currentYear} MultX Bridge. All Rights Reserved.
//           </div>
          
//           {/* 2. Testnet warning (Right side) - Rang ko blue kar diya gaya hai */}
//           <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full">
            
//             {/* Information Icon (Behtar icon blue rang ke liye) */}
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
            
//             <span>This is a testnet application. Do not use real assets.</span>
//           </div>

//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;









//-------------- Mobile Responsive --------------------------


import React from 'react';

const Footer = () => {
  // `new Date().getFullYear()` se hamesha current saal display hoga
  const currentYear = new Date().getFullYear();

  return (
    // 'footer' tag page ke aakhir mein content ko semantic tor par define karta hai
    // --- RESPONSIVE ENHANCEMENT: Vertical padding thori barha di gayi hai ---
    <footer className="border-t border-gray-800 mt-auto py-5">
      <div className="container mx-auto px-4">
        {/* 
          - Flexbox ka istemal karke content ko left aur right align kiya gaya hai.
          - Choti screens par yeh stack ho jayega (flex-col sm:flex-row).
        */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* 1. Copyright notice (Left side) */}
          {/* --- RESPONSIVE ENHANCEMENT: Mobile par text ko center align kiya gaya --- */}
          <div className="text-sm text-gray-500 text-center sm:text-left">
            &copy; {currentYear} MultX Bridge. All Rights Reserved.
          </div>
          
          {/* 2. Testnet warning (Right side) - Rang ko blue kar diya gaya hai */}
          <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full text-center">
            
            {/* Information Icon (Behtar icon blue rang ke liye) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <span>This is a testnet application. Do not use real assets.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;