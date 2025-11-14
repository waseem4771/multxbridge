// import { useState } from 'react';
// import { useWallet } from './../contexts/WalletContext';
// import useContract from './useContract';

// // Bridge contract ka ABI import karein
// import multxBridgeAbi from './../constants/abi/ierc20Abi.json';

// const useBridge = (bridgeAddress) => {
//   const { signer } = useWallet();
//   const [isLocking, setIsLocking] = useState(false);
//   const [error, setError] = useState(null);
//   const [lockTxHash, setLockTxHash] = useState(null);

//   // Bridge contract ka instance haasil karein
//   const bridgeContract = useContract(bridgeAddress, multxBridgeAbi);

//   const lockTokens = async (tokenAddress, amount, targetChainId) => {
//     // Check karein ke sab zaroori cheezein maujood hain
//     if (!bridgeContract || !signer) {
//       setError("Wallet not connected or contract not found.");
//       return;
//     }

//     setIsLocking(true);
//     setError(null);
//     setLockTxHash(null);

//     try {
//       // Bridge contract ka `lockTokens` function call karein
//       const tx = await bridgeContract.lockTokens(
//         tokenAddress,
//         amount, // Yeh amount BigNumber format mein hona chahiye
//         targetChainId
//       );

//       // Transaction ke complete hone ka intezar karein
//       const receipt = await tx.wait();
      
//       // Transaction hash ko state mein save karein (block explorer link ke liye)
//       setLockTxHash(receipt.transactionHash);

//       // Event se 'txHash' nikalna (backend ke liye)
//       // Documentation ke mutabiq, event ka naam 'TokensLocked' hai
//       const lockedEvent = receipt.events?.find(e => e.event === 'TokensLocked');
//       if (!lockedEvent) {
//         throw new Error("TokensLocked event not found in transaction receipt.");
//       }
      
//       // Event se nikli hui maloomat return karein
//       const { txHash, nonce } = lockedEvent.args;
      
//       return {
//         lockTxHash: receipt.transactionHash,
//         bridgeTxHash: txHash, // Yeh backend API ke liye zaroori hai
//         nonce: nonce,
//       };

//     } catch (err) {
//       console.error("Failed to lock tokens:", err);
//       setError(err.reason || err.message || "An unknown error occurred.");
//       // Error ko re-throw karein taake UI component mein bhi handle kiya ja sake
//       throw err; 
//     } finally {
//       setIsLocking(false);
//     }
//   };

//   return { lockTokens, isLocking, lockTxHash, error };
// };

// export default useBridge;













import { useState } from 'react';
import { useWallet } from './../contexts/WalletContext';
import useContract from './useContract';

// Bridge contract ka sahi ABI import karein
import multxBridgeAbi from './../constants/abi/multxBridgeAbi.json';

const useBridge = (bridgeAddress) => {
  const { signer } = useWallet();
  const [isLocking, setIsLocking] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false); // Nayi state
  const [error, setError] = useState(null);

  // Bridge contract ka instance haasil karein
  const bridgeContract = useContract(bridgeAddress, multxBridgeAbi.abi);

  const lockTokens = async (tokenAddress, amount, targetChainId) => {
    if (!bridgeContract || !signer) {
      setError("Wallet not connected or contract not found.");
      return;
    }

    setIsLocking(true);
    setError(null);

    try {
      const tx = await bridgeContract.lockTokens(
        tokenAddress,
        amount,
        targetChainId
      );

      const receipt = await tx.wait();
      
      const lockedEvent = receipt.events?.find(e => e.event === 'TokensLocked');
      if (!lockedEvent) {
        throw new Error("TokensLocked event not found in transaction receipt.");
      }
      
      const { txHash, nonce } = lockedEvent.args;
      
      return {
        lockTxHash: receipt.transactionHash,
        bridgeTxHash: txHash,
        nonce: nonce,
      };

    } catch (err) {
      console.error("Failed to lock tokens:", err);
      setError(err.reason || err.message || "An unknown error occurred.");
      throw err; 
    } finally {
      setIsLocking(false);
    }
  };

  // === NAYA FUNCTION: releaseTokens ===
  const releaseTokens = async (releaseParams) => {
    if (!bridgeContract || !signer) {
      setError("Wallet not connected or contract not found.");
      return;
    }

    setIsReleasing(true);
    setError(null);

    try {
      // Documentation ke mutabiq, releaseTokens function ko call karein
      const tx = await bridgeContract.releaseTokens(
        releaseParams.token,
        releaseParams.user,
        releaseParams.amount,
        releaseParams.sourceChain,
        releaseParams.sourceNonce,
        releaseParams.sourceTxHash,
        releaseParams.signatures
      );

      const receipt = await tx.wait();
      return receipt.transactionHash; // Kamyabi par transaction hash return karein

    } catch (err) {
      console.error("Failed to release tokens:", err);
      setError(err.reason || err.message || "An unknown error occurred.");
      throw err;
    } finally {
      setIsReleasing(false);
    }
  };


  return { 
    lockTokens, 
    isLocking, 
    releaseTokens,  // Naya function export karein
    isReleasing,    // Uski loading state export karein
    error 
  };
};

export default useBridge;