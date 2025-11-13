

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { ethers } from 'ethers';
// import toast from 'react-hot-toast'; // 1. Izafa (Addition)

// // Context ko create karna
// const WalletContext = createContext(null);

// // Provider Component banana
// export const WalletProvider = ({ children }) => {
//   const [address, setAddress] = useState(null);
//   const [chainId, setChainId] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);

//   // Wallet connect karne ka function
//   const connectWallet = async () => {
//     try {
//       if (typeof window.ethereum === 'undefined') {
//         toast.error('Please install MetaMask!');
//         return;
//       }

//       const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
//       await web3Provider.send('eth_requestAccounts', []);
      
//       const web3Signer = web3Provider.getSigner();
//       const userAddress = await web3Signer.getAddress();
//       const network = await web3Provider.getNetwork();

//       setProvider(web3Provider);
//       setSigner(web3Signer);
//       setAddress(userAddress);
//       setChainId(network.chainId);

//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//       // 2. Behtar Error Handling
//       if (error.code === 4001) { // User ne request reject ki
//         toast.error('Wallet connection rejected.');
//       } else {
//         toast.error('Failed to connect wallet.');
//       }
//     }
//   };

//   const disconnectWallet = () => {
//     setAddress(null);
//     setChainId(null);
//     setProvider(null);
//     setSigner(null);
//   };

//   useEffect(() => {
//     if (window.ethereum) {
//       const handleAccountsChanged = (accounts) => {
//         if (accounts.length > 0) {
//           connectWallet();
//         } else {
//           disconnectWallet();
//         }
//       };

//       const handleChainChanged = () => {
//         window.location.reload();
//       };

//       window.ethereum.on('accountsChanged', handleAccountsChanged);
//       window.ethereum.on('chainChanged', handleChainChanged);

//       return () => {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//         window.ethereum.removeListener('chainChanged', handleChainChanged);
//       };
//     }
//   }, []);

//   const value = {
//     address,
//     chainId,
//     provider,
//     signer,
//     isConnected: !!address,
//     connectWallet,
//     disconnectWallet,
//   };

//   return (
//     <WalletContext.Provider value={value}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// // Custom Hook
// export const useWallet = () => {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error('useWallet must be used within a WalletProvider');
//   }
//   return context;
// };
















import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// --- ENHANCEMENT: Behtar UI ke liye Toaster component ko import karna zaroori hai ---
// Isay aap apne MainLayout.jsx ya App.jsx mein istemal karenge.
import { Toaster } from 'react-hot-toast';

// Context ko create karna
const WalletContext = createContext(null);

// Provider Component banana
export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Wallet connect karne ka function
  const connectWallet = async () => {
    // --- ENHANCEMENT 1: Loading toast dikhana ---
    // User ko foran pata chal jayega ke process shuru ho gaya hai.
    const toastId = toast.loading('Connecting to wallet...');

    try {
      if (typeof window.ethereum === 'undefined') {
        toast.error('Please install MetaMask!', { id: toastId });
        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      
      const web3Signer = web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(userAddress);
      setChainId(network.chainId);

      // --- ENHANCEMENT 2: Kamyabi ka toast dikhana ---
      toast.success('Wallet connected successfully!', { id: toastId });

    } catch (error) {
      console.error("Error connecting wallet:", error);
      // --- ENHANCEMENT 3: Error toast ko behtar banana ---
      if (error.code === 4001) {
        toast.error('Wallet connection rejected.', { id: toastId });
      } else {
        toast.error('Failed to connect wallet.', { id: toastId });
      }
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    // --- ENHANCEMENT 4: Disconnect par halka sa feedback dena ---
    toast('Wallet disconnected.', { icon: '👋' });
  };

  // useEffect mein koi tabdeeli nahi
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      };
      const handleChainChanged = () => {
        window.location.reload();
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value = {
    address,
    chainId,
    provider,
    signer,
    isConnected: !!address,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom Hook
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};