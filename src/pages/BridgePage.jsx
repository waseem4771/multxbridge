// import React from 'react';

// // اپنے نئے بنائے ہوئے BridgeCard کمپوننٹ کو امپورٹ کریں
// import BridgeCard from '../components/bridge/BridgeCard';

// const BridgePage = () => {
//   return (
//     // یہ کنٹینر ہمارے برج کارڈ کو اسکرین کے بالکل بیچ میں دکھائے گا
//     <div className="flex justify-center items-center py-16 px-4">
      
//       {/* یہاں ہم اپنے BridgeCard کمپوننٹ کو کال کر رہے ہیں */}
//       <BridgeCard />

//     </div>
//   );
// };

// export default BridgePage;





//----------------- Mobile Responsive  -------------------------


import React from 'react';

// اپنے نئے بنائے ہوئے BridgeCard کمپوننٹ کو امپورٹ کریں
import BridgeCard from '../components/bridge/BridgeCard';

const BridgePage = () => {
  return (
    // --- RESPONSIVE ENHANCEMENT: Vertical padding ko mobile ke liye adjust kiya gaya hai ---
    // Mobile par 'py-8' aur desktop par 'py-16' padding hogi
    <div className="flex justify-center items-center py-8 md:py-16 px-4">
      
      {/* یہاں ہم اپنے BridgeCard کمپوننٹ کو کال کر رہے ہیں */}
      <BridgeCard />

    </div>
  );
};

export default BridgePage;

