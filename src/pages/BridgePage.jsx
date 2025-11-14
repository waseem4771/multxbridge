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
import { useWallet } from '../contexts/WalletContext';
import BridgeCard from '../components/bridge/BridgeCard';
import BridgeInfo from '../components/bridge/BridgeInfo';
import { SUPPORTED_CHAINS } from '../constants/chains';

const BridgePage = () => {
  const { chainId } = useWallet();
  const currentChain = chainId ? SUPPORTED_CHAINS.find(c => c.chainId === chainId) : null;

  return (
    // --- RESPONSIVE ENHANCEMENT: Vertical padding ko mobile ke liye adjust kiya gaya hai ---
    // Mobile par 'py-8' aur desktop par 'py-16' padding hogi
    <div className="flex flex-col items-center py-6 sm:py-8 md:py-16 px-4 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Bridge Info - Only show if connected to a supported chain */}
      {currentChain && (
        <div className="w-full max-w-lg">
          <BridgeInfo chainId={currentChain.chainId} />
        </div>
      )}

      {/* Bridge Card */}
      <BridgeCard />

    </div>
  );
};

export default BridgePage;

