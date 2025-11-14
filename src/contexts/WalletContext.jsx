

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
import { CHAINS_BY_ID } from '../constants/chains';

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
      // ChainId ko number mein convert karein (ethers.js BigNumber return kar sakta hai)
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      // --- ENHANCEMENT 2: Kamyabi ka toast dikhana with network name ---
      const chain = CHAINS_BY_ID[currentChainId];
      const networkName = chain ? chain.name : `Chain ${currentChainId}`;
      toast.success(`Wallet connected to ${networkName}!`, { id: toastId });

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

  // Wallet state ko check karne ke liye effect
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Agar wallet already connected hai, to state ko update karein
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const web3Signer = web3Provider.getSigner();
            const userAddress = await web3Signer.getAddress();
            const network = await web3Provider.getNetwork();
            
            setProvider(web3Provider);
            setSigner(web3Signer);
            setAddress(userAddress);
            setChainId(Number(network.chainId));
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();

    // Event listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      };
      const handleChainChanged = async (chainIdHex) => {
        // Update chainId immediately without reload
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        
        // Update provider and signer for new chain
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          const web3Signer = web3Provider.getSigner();
          setProvider(web3Provider);
          setSigner(web3Signer);
          
          // Show toast notification
          const chain = CHAINS_BY_ID[newChainId];
          if (chain) {
            toast.success(`Switched to ${chain.name}`, { icon: '🔄' });
          }
        } catch (error) {
          console.error("Error updating chain:", error);
        }
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