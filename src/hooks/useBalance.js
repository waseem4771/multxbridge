import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './../contexts/WalletContext';

// Standard ERC20 ABI ka aek chota hissa (sirf balance fetch karne ke liye)
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const useBalance = (tokenAddress) => {
  const { provider, address } = useWallet();
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      // Balance tabhi fetch karein jab provider, user address, aur token address ho
      if (provider && address && tokenAddress) {
        setLoading(true);
        try {
          const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
          
          const [rawBalance, decimals] = await Promise.all([
            tokenContract.balanceOf(address),
            tokenContract.decimals()
          ]);
          
          // Raw balance (Wei mein) ko user-friendly format mein convert karein
          const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
          
          // Balance ko 2 decimal places tak format karein
          setBalance(parseFloat(formattedBalance).toFixed(2));

        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setBalance('0.00');
        } finally {
          setLoading(false);
        }
      } else {
        // Agar user connected nahi, to balance reset kar dein
        setBalance('0.00');
      }
    };

    fetchBalance();
    
    // Yeh effect tab dobara chalega jab in mein se koi bhi cheez badlegi
  }, [provider, address, tokenAddress]);

  return { balance, loading };
};

export default useBalance;