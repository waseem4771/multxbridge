import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './../contexts/WalletContext';

// Standard ERC20 ABI ka aek chota hissa (sirf balance fetch karne ke liye)
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const useBalance = (tokenAddress) => {
  const { provider, address, chainId } = useWallet();
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      // Balance tabhi fetch karein jab provider, user address, aur token address ho
      if (provider && address && tokenAddress) {
        // Validate token address before making contract call
        if (!ethers.utils.isAddress(tokenAddress) || tokenAddress === '0x0000000000000000000000000000000000000000') {
          setBalance('0.00');
          return;
        }

        setLoading(true);
        try {
          const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
          
          // Fetch balance and decimals from contract (always use contract's actual decimals)
          const [rawBalance, decimals] = await Promise.all([
            tokenContract.balanceOf(address),
            tokenContract.decimals().catch(() => {
              // If decimals() fails, try to get from token config as fallback
              console.warn('Could not fetch decimals from contract, using fallback');
              return 18; // Default fallback
            })
          ]);
          
          // Debug log for balance fetching
          console.log('Balance fetch:', {
            tokenAddress,
            address,
            rawBalance: rawBalance.toString(),
            decimals,
            chainId
          });
          
          // Raw balance ko user-friendly format mein convert karein
          const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
          const balanceNum = parseFloat(formattedBalance);
          
          // Check if balance is actually 0 or if it's a formatting issue
          if (rawBalance.isZero()) {
            setBalance('0.00');
          } else if (balanceNum >= 1000000) {
            // Million se zyada ho to M format mein dikhayein
            const millions = balanceNum / 1000000;
            setBalance(millions >= 10 ? millions.toFixed(0) + 'M' : millions.toFixed(2) + 'M');
          } else if (balanceNum >= 1000) {
            // Thousand se zyada ho to K format mein dikhayein
            const thousands = balanceNum / 1000;
            setBalance(thousands >= 10 ? thousands.toFixed(0) + 'K' : thousands.toFixed(2) + 'K');
          } else if (balanceNum >= 1) {
            // 1 se zyada ho to 2 decimal places
            setBalance(balanceNum.toFixed(2));
          } else {
            // 1 se kam ho to more decimal places
            setBalance(balanceNum.toFixed(6).replace(/\.?0+$/, ''));
          }

        } catch (error) {
          // Only log non-critical errors (contract doesn't exist, etc.)
          if (error.code !== 'CALL_EXCEPTION') {
            console.error("Failed to fetch balance:", error);
            // If it's a network/provider error, don't set balance to 0, keep previous value
            if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
              console.warn('Network error fetching balance, keeping previous value');
              return;
            }
          }
          // Only set to 0 if it's a CALL_EXCEPTION (contract doesn't exist)
          if (error.code === 'CALL_EXCEPTION') {
            setBalance('0.00');
          }
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
    // chainId bhi add kiya taake chain switch par balance refresh ho
  }, [provider, address, tokenAddress, chainId]);

  return { balance, loading };
};

export default useBalance;