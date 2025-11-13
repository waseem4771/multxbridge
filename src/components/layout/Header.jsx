
// // src/components/layout/Header.jsx

// import React from 'react';
// import { NavLink } from 'react-router-dom';

// // Icon import
// import BlockchainIcon from '../../assets/icons/blockchain2.svg';

// // CSS file ka import
// import '../../assets/css/animations.css';

// import { useWallet } from '../../contexts/WalletContext';
// import AddressDisplay from '../common/AddressDisplay';
// import NetworkDisplay from '../common/NetworkDisplay';
// import Button from '../ui/Button';

// const Header = () => {
//   const { isConnected, connectWallet } = useWallet();

//   // Navigation buttons ki classes ke liye helper function
//   const getNavLinkClasses = (isActive) => {
//     const baseClasses = "w-full h-full px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center";
//     if (isActive) {
//       return `${baseClasses} bg-sky-500 text-white shadow-md shadow-sky-500/20`;
//     }
//     // group-hover ka istemal kar rahe hain taake NavLink ke hover par andar ka style badle
//     return `${baseClasses} text-slate-300 hover:bg-slate-700/50 hover:text-white`;
//   };

//   return (
//     <header className="sticky top-0 z-50 p-4 border-b border-slate-700/20 bg-black/15 backdrop-blur-xl shadow-lg shadow-black/20">
//       <div className="container mx-auto flex justify-between items-center">
        
//         <NavLink to="/" className="group flex items-center gap-3 flex-shrink-0">
//           <img 
//             src={BlockchainIcon} 
//             alt="MultX Logo" 
//             className="h-9 w-9 transition-transform duration-300 group-hover:rotate-[15deg] brightness-0 invert" 
//           />
//           <h1 className="text-2xl font-extrabold text-slate-100 tracking-wider [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
//             MultX <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Bridge</span>
//           </h1>
//         </NavLink>

//         <nav className="hidden md:flex items-center gap-2 bg-slate-900/50 border border-slate-700/40 p-1.5 rounded-full">
          
//           {/* --- Bridge Button --- */}
//           <NavLink
//             to="/"
//             end
//             // CHANGE: Yahan se function hata diya gaya hai kyunke iski zaroorat nahi thi.
//             className="btn-flip outline-none focus:ring-2 focus:ring-sky-500/50 rounded-full group"
//           >
//             {({ isActive }) => (
//               <div className="btn-flip-content relative" style={{width: '80px', height: '32px'}}>
//                 <div className={`front-text ${getNavLinkClasses(isActive)}`}>Bridge</div>
//                 <div className={`back-text ${getNavLinkClasses(isActive)}`}>Bridge</div>
//               </div>
//             )}
//           </NavLink>
          
//           {/* --- History Button --- */}
//           <NavLink
//             to="/history"
//             // CHANGE: Yahan se bhi function hata diya gaya hai.
//             className="btn-flip outline-none focus:ring-2 focus:ring-sky-500/50 rounded-full group"
//           >
//             {({ isActive }) => (
//               <div className="btn-flip-content relative" style={{width: '80px', height: '32px'}}>
//                 <div className={`front-text ${getNavLinkClasses(isActive)}`}>History</div>
//                 <div className={`back-text ${getNavLinkClasses(isActive)}`}>History</div>
//               </div>
//             )}
//           </NavLink>

//         </nav>

//         <div className="flex items-center gap-4">
//           {isConnected ? (
//             <div className="hidden md:flex items-center gap-4 bg-slate-900/50 border border-slate-700/40 py-2 px-3 rounded-full">
//               <NetworkDisplay />
//               <AddressDisplay />
//             </div>
//           ) : (
//             <>
//               <div className="hidden sm:flex items-center text-sm bg-slate-800/80 text-slate-400 px-4 py-2 rounded-full font-semibold">
//                 <span className="relative flex h-2 w-2 mr-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
//                 </span>
//                 Not Connected
//               </div>
              
//               {/* --- Connect Wallet Button --- */}
//               <Button 
//                 onClick={connectWallet} 
//                 className="btn-flip p-0 bg-transparent hover:bg-transparent shadow-none"
//               >
//                 <div className="btn-flip-content" style={{width: '130px', height: '40px'}}>
//                   <div className="front-text w-full h-full rounded-md text-sm font-semibold text-white !bg-sky-600 hover:!bg-sky-700 focus:!ring-sky-500 shadow-lg shadow-sky-600/20 flex items-center justify-center">
//                     Connect Wallet
//                   </div>
//                   <div className="back-text w-full h-full rounded-md text-sm font-semibold text-white !bg-sky-700 focus:!ring-sky-500 shadow-lg shadow-sky-600/20 flex items-center justify-center">
//                     Connect Wallet
//                   </div>
//                 </div>
//               </Button>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;




// ------------------- Responsive Code -------------------------

// src/components/layout/Header.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Icon import
import BlockchainIcon from '../../assets/icons/blockchain2.svg';

// CSS file ka import
import '../../assets/css/animations.css';

import { useWallet } from '../../contexts/WalletContext';
import AddressDisplay from '../common/AddressDisplay';
import NetworkDisplay from '../common/NetworkDisplay';
import Button from '../ui/Button';

const Header = () => {
  const { isConnected, connectWallet } = useWallet();
  // Mobile menu ko control karne ke liye state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation buttons ki classes ke liye helper function
  const getNavLinkClasses = (isActive) => {
    const baseClasses = "w-full h-full px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center";
    if (isActive) {
      return `${baseClasses} bg-sky-500 text-white shadow-md shadow-sky-500/20`;
    }
    return `${baseClasses} text-slate-300 hover:bg-slate-700/50 hover:text-white`;
  };
  
  // Mobile menu ke links ke liye alag function
  const getMobileNavLinkClasses = ({ isActive }) =>
    `block py-3 px-4 rounded-md text-base font-medium transition-colors ${
      isActive ? 'bg-sky-500/20 text-sky-400' : 'text-slate-300 hover:bg-slate-700/50'
    }`;


  return (
    <header className="sticky top-0 z-50 p-4 border-b border-slate-700/20 bg-black/15 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* === LOGO === */}
        <NavLink to="/" className="group flex items-center gap-3 flex-shrink-0">
          <img 
            src={BlockchainIcon} 
            alt="MultX Logo" 
            className="h-9 w-9 transition-transform duration-300 group-hover:rotate-[15deg] brightness-0 invert" 
          />
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-wider [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
            MultX <span className="hidden sm:inline bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Bridge</span>
          </h1>
        </NavLink>

        {/* === DESKTOP NAVIGATION === (Mobile par hide) */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-900/50 border border-slate-700/40 p-1.5 rounded-full">
          <NavLink to="/" end className="btn-flip outline-none focus:ring-2 focus:ring-sky-500/50 rounded-full group">
            {({ isActive }) => (
              <div className="btn-flip-content relative" style={{width: '80px', height: '32px'}}>
                <div className={`front-text ${getNavLinkClasses(isActive)}`}>Bridge</div>
                <div className={`back-text ${getNavLinkClasses(isActive)}`}>Bridge</div>
              </div>
            )}
          </NavLink>
          <NavLink to="/history" className="btn-flip outline-none focus:ring-2 focus:ring-sky-500/50 rounded-full group">
            {({ isActive }) => (
              <div className="btn-flip-content relative" style={{width: '80px', height: '32px'}}>
                <div className={`front-text ${getNavLinkClasses(isActive)}`}>History</div>
                <div className={`back-text ${getNavLinkClasses(isActive)}`}>History</div>
              </div>
            )}
          </NavLink>
        </nav>

        {/* === RIGHT SIDE CONTENT === */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isConnected ? (
            <div className="hidden md:flex items-center gap-4 bg-slate-900/50 border border-slate-700/40 py-2 px-3 rounded-full">
              <NetworkDisplay />
              <AddressDisplay />
            </div>
          ) : (
            <>
              <div className="hidden sm:flex items-center text-sm bg-slate-800/80 text-slate-400 px-4 py-2 rounded-full font-semibold">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Not Connected
              </div>
              <Button onClick={connectWallet} className="btn-flip p-0 bg-transparent hover:bg-transparent shadow-none hidden sm:block">
                <div className="btn-flip-content" style={{width: '130px', height: '40px'}}>
                  <div className="front-text w-full h-full rounded-md text-sm font-semibold text-white !bg-sky-600 hover:!bg-sky-700 focus:!ring-sky-500 shadow-lg shadow-sky-600/20 flex items-center justify-center">Connect Wallet</div>
                  <div className="back-text w-full h-full rounded-md text-sm font-semibold text-white !bg-sky-700 focus:!ring-sky-500 shadow-lg shadow-sky-600/20 flex items-center justify-center">Connect Wallet</div>
                </div>
              </Button>
              {/* Chota "Connect" button sirf choti screen ke liye */}
              <Button onClick={connectWallet} className="sm:hidden px-4 py-2 text-sm">Connect</Button>
            </>
          )}

          {/* === HAMBURGER MENU BUTTON === (Sirf mobile par show hoga) */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-300 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* === MOBILE MENU PANEL === (Khulne par show hoga) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-700/50 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" end className={getMobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Bridge</NavLink>
            <NavLink to="/history" className={getMobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>History</NavLink>
            
            {/* Wallet info mobile menu mein dikhayein agar connected ho */}
            {isConnected && (
              <div className="border-t border-slate-700 mt-3 pt-3">
                <div className="flex flex-col items-start gap-3 px-3">
                    <NetworkDisplay />
                    <AddressDisplay />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;





//------------------------- Simulation Mode for teting -----------------------



// import React from 'react';
// import { NavLink } from 'react-router-dom';

// // WalletContext se hook import karein
// import { useWallet } from '../../contexts/WalletContext';

// // Common components import karein
// import AddressDisplay from '../common/AddressDisplay';
// import NetworkDisplay from '../common/NetworkDisplay';
// import Button from '../ui/Button';

// // Constants
// import { SUPPORTED_CHAINS } from '../../constants/chains';

// const Header = () => {
//   const { isConnected, connectWallet } = useWallet();

//   // --- SIMULATION DATA ---
//   // Agar wallet connected nahi hai, to yeh dummy data istemal hoga
//   const DUMMY_ADDRESS = '0xAbA1C3259CbB2a5ec0772DA108EEED4a841BFa0a';
//   const SIMULATION_CHAIN = SUPPORTED_CHAINS[0]; // Sepolia ko as a default dikhayein

//   return (
//     <header className="sticky top-0 z-50 p-4 border-b border-gray-800 bg-gray-900/70 backdrop-blur-sm">
//       <div className="container mx-auto flex justify-between items-center">
        
//         <div className="flex-shrink-0">
//           <h1 className="text-2xl font-bold text-white tracking-wide">
//             MultX <span className="text-blue-400">Bridge</span>
//           </h1>
//         </div>

//         <nav className="hidden md:flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full">
//           <NavLink
//             to="/"
//             className={({ isActive }) => `px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
//           >
//             Bridge
//           </NavLink>
//           <NavLink
//             to="/history"
//             className={({ isActive }) => `px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
//           >
//             History
//           </NavLink>
//         </nav>

//         <div className="flex items-center gap-4">
//           {/* --- YAHAN TABDEELI HUI HAI --- */}
//           {isConnected ? (
//             // Jab wallet ASLI mein connected ho (LIVE MODE)
//             <>
//               <NetworkDisplay />
//               <AddressDisplay /> 
//             </>
//           ) : (
//             // Jab wallet connected NAHI ho (SIMULATION MODE)
//             <>
//               {/* Dummy Network Display */}
//               <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold bg-gray-800 text-gray-300">
//                 <img src={SIMULATION_CHAIN.logo} alt={SIMULATION_CHAIN.name} className="w-5 h-5 rounded-full" />
//                 <span>{SIMULATION_CHAIN.name}</span>
//               </div>
              
//               {/* Dummy Address Display */}
//               <AddressDisplay addressProp={DUMMY_ADDRESS} />
              
//               {/* Asli "Connect Wallet" button abhi bhi dikhayein taake user live ja sake */}
//               <Button onClick={connectWallet}>
//                 Connect Wallet
//               </Button>
//             </>
//           )}
//         </div>

//       </div>
//     </header>
//   );
// };

// export default Header;