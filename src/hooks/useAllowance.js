// import { useState, useEffect, useCallback } from 'react';
// import { ethers } from 'ethers';
// import { useWallet } from './../contexts/WalletContext';
// import useContract from './useContract';
// // Standard ERC20 ABI ka allowance function
// import ierc20Abi from './../constants/abi/ierc20Abi.json';

// const useAllowance = (tokenAddress, spenderAddress) => {
//   const { address } = useWallet();
//   const [allowance, setAllowance] = useState(ethers.BigNumber.from(0));
//   const [loading, setLoading] = useState(false);

//   // useContract hook ke zariye token contract ka instance haasil karein
//   const tokenContract = useContract(tokenAddress, ierc20Abi);

//   // Allowance fetch karne ka function
//   const fetchAllowance = useCallback(async () => {
//     // Check karein ke sab zaroori cheezein maujood hain
//     if (tokenContract && address && spenderAddress) {
//       setLoading(true);
//       try {
//         const currentAllowance = await tokenContract.allowance(address, spenderAddress);
//         setAllowance(currentAllowance);
//       } catch (error) {
//         console.error("Failed to fetch allowance:", error);
//         setAllowance(ethers.BigNumber.from(0)); // Error hone par 0 set karein
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, [tokenContract, address, spenderAddress]);

//   // Jab bhi dependencies badlein, allowance dobara fetch karein
//   useEffect(() => {
//     fetchAllowance();
//   }, [fetchAllowance]);

//   // Ek alag se function dein taake component se manually bhi refresh kiya ja sake
//   const refreshAllowance = fetchAllowance;

//   return { allowance, loading, refreshAllowance };
// };

// export default useAllowance;
















import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './../contexts/WalletContext';
import useContract from './useContract';
import ierc20Abi from './../constants/abi/ierc20Abi.json';

const useAllowance = (tokenAddress, spenderAddress) => {
  // 1. Context se `chainId` bhi haasil karein
  const { address, chainId } = useWallet();
  const [allowance, setAllowance] = useState(ethers.BigNumber.from(0));
  const [loading, setLoading] = useState(false);

  const tokenContract = useContract(tokenAddress, ierc20Abi);

  const fetchAllowance = useCallback(async () => {
    if (tokenContract && address && spenderAddress) {
      // Validate addresses before making contract call
      if (!ethers.utils.isAddress(tokenAddress) || !ethers.utils.isAddress(spenderAddress) || 
          tokenAddress === '0x0000000000000000000000000000000000000000') {
        setAllowance(ethers.BigNumber.from(0));
        return;
      }

      setLoading(true);
      try {
        const currentAllowance = await tokenContract.allowance(address, spenderAddress);
        setAllowance(currentAllowance);
      } catch (error) {
        // Only log non-critical errors (contract doesn't exist, etc.)
        if (error.code !== 'CALL_EXCEPTION') {
          console.error("Failed to fetch allowance:", error);
        }
        setAllowance(ethers.BigNumber.from(0));
      } finally {
        setLoading(false);
      }
    } else {
      // Yeh case handle karein jab wallet connected na ho
      setAllowance(ethers.BigNumber.from(0));
    }
  }, [tokenContract, address, spenderAddress, tokenAddress, chainId]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  const refreshAllowance = fetchAllowance;

  return { allowance, loading, refreshAllowance };
};

export default useAllowance;