
// import React from 'react';

// // Yeh component yeh properties lega:
// // - size: Spinner ka size kya hoga ('sm', 'md', 'lg')
// // - className: Agar koi extra style dena ho
// const Spinner = ({ size = 'md', className = '' }) => {
  
//   // Size ke hisab se Tailwind classes ko thoda adjust kiya gaya hai
//   const sizeClasses = {
//     sm: 'h-5 w-5 border-2',    // Chota spinner
//     md: 'h-8 w-8 border-[3px]', // Darmiyana spinner
//     lg: 'h-12 w-12 border-4',   // Bada spinner
//   };

//   return (
//     // Accessibility (rasai) ke liye 'role="status"' shamil kiya gaya hai
//     <div role="status">
//       {/* 
//         UI ko enhance kiya gaya hai:
//         - border-gray-600 ki jagah halka neela (transparent) border istemal kiya gaya hai jo track jaisa lagta hai.
//         - Animation ko hamwaar (smooth) rakha gaya hai.
//       */}
//       <div
//         className={`
//           ${sizeClasses[size]}
//           rounded-full
//           border-solid
//           border-blue-500/20 
//           border-t-blue-500
//           animate-spin ease-linear
//           ${className}
//         `}
//       >
//       </div>
//       {/* Yeh text screen readers ke liye hai aur UI par nazar nahin aayega */}
//       <span className="sr-only">Loading...</span>
//     </div>
//   );
// };

// export default Spinner;









//------------------------- Mobile Responsive -----------------------------

import React from 'react';

// Yeh component yeh properties lega:
// - size: Spinner ka size kya hoga ('sm', 'md', 'lg')
// - className: Agar koi extra style dena ho
const Spinner = ({ size = 'md', className = '' }) => {
  
  // Size ke hisab se Tailwind classes ko thoda adjust kiya gaya hai
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',    // Chota spinner
    md: 'h-8 w-8 border-[3px]', // Darmiyana spinner
    lg: 'h-12 w-12 border-4',   // Bada spinner
  };

  return (
    // Accessibility (rasai) ke liye 'role="status"' shamil kiya gaya hai
    <div role="status">
      {/* 
        UI ko enhance kiya gaya hai:
        - border-gray-600 ki jagah halka neela (transparent) border istemal kiya gaya hai jo track jaisa lagta hai.
        - Animation ko hamwaar (smooth) rakha gaya hai.
      */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          border-solid
          border-blue-500/20 
          border-t-blue-500
          animate-spin ease-linear
          ${className}
        `}
      >
      </div>
      {/* Yeh text screen readers ke liye hai aur UI par nazar nahin aayega */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;