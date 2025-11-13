// import React from 'react';

// // ایک فرضی نیٹ ورک کا لوگو امپورٹ کریں
// import ethLogo from './../../assets/images/ethLogo.svg';

// // یہ کمپوننٹ 'networkName' اور 'networkLogo' props لے گا
// // ہم اسے ابھی کے لیے ڈیفالٹ ویلیوز دے رہے ہیں
// const NetworkDisplay = ({ networkName = 'Ethereum Sepolia', networkLogo = ethLogo }) => {
//   return (
//     // یہ ایک گول کونوں والا، گہرے رنگ کا چھوٹا سا باکس ہے
//     <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full">
      
//       {/* نیٹ ورک کا لوگو */}
//       <img 
//         src={networkLogo} 
//         alt={`${networkName} logo`} 
//         className="w-5 h-5" 
//       />
      
//       {/* نیٹ ورک کا نام */}
//       <span className="text-sm font-semibold text-white">
//         {networkName}
//       </span>
      
//     </div>
//   );
// };

// export default NetworkDisplay;









//------------------ Mobile Responsive ----------------------------------

import React from 'react';

// ایک فرضی نیٹ ورک کا لوگو امپورٹ کریں
import ethLogo from './../../assets/images/ethLogo.svg';

// यह کمپوننٹ 'networkName' और 'networkLogo' props لے گا
// ہم اسے ابھی کے لیے ڈیفالٹ ویلیوز دے رہے ہیں
const NetworkDisplay = ({ networkName = 'Ethereum Sepolia', networkLogo = ethLogo }) => {
  return (
    // --- RESPONSIVE ENHANCEMENT: Padding aur gap ko mobile ke liye adjust kiya gaya ---
    <div className="flex items-center gap-1.5 md:gap-2 bg-gray-800 px-2 md:px-3 py-1.5 rounded-full">
      
      {/* نیٹ ورک کا لوگو */}
      {/* --- RESPONSIVE ENHANCEMENT: Logo size ko mobile ke liye thora chota kiya gaya --- */}
      <img 
        src={networkLogo} 
        alt={`${networkName} logo`} 
        className="w-4 h-4 md:w-5 md:h-5" 
      />
      
      {/* نیٹ ورک کا نام */}
      {/* --- RESPONSIVE ENHANCEMENT: Font size ko mobile ke liye chota kiya gaya --- */}
      <span className="text-xs md:text-sm font-semibold text-white">
        {networkName}
      </span>
      
    </div>
  );
};

export default NetworkDisplay;





