import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './../contexts/WalletContext';
import useContract from './useContract';
import multxBridgeAbi from './../constants/abi/multxBridgeAbi.json';

/**
 * Hook to fetch bridge contract information
 * @param {string} bridgeAddress - Bridge contract address
 * @returns {object} Bridge contract state and info
 */
const useBridgeInfo = (bridgeAddress) => {
  const { provider, address } = useWallet();
  const [bridgeInfo, setBridgeInfo] = useState({
    paused: false,
    nonce: null,
    validators: [],
    owner: null,
    loading: true,
  });
  const [tokenBalances, setTokenBalances] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [isValidator, setIsValidator] = useState(false);

  const bridgeContract = useContract(bridgeAddress, multxBridgeAbi.abi);

  const fetchBridgeInfo = useCallback(async () => {
    if (!bridgeContract || !provider || !bridgeAddress || !ethers.utils.isAddress(bridgeAddress)) {
      setBridgeInfo(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const [paused, nonce, validators, owner] = await Promise.all([
        bridgeContract.paused(),
        bridgeContract.nonce(),
        bridgeContract.getValidators(),
        bridgeContract.owner(),
      ]);

      setBridgeInfo({
        paused,
        nonce: nonce.toString(),
        validators: validators || [],
        owner,
        loading: false,
      });

      // Check if connected address is owner or validator
      if (address) {
        try {
          const [ownerCheck, validatorCheck] = await Promise.all([
            Promise.resolve(owner.toLowerCase() === address.toLowerCase()),
            bridgeContract.isValidator(address),
          ]);
          setIsOwner(ownerCheck);
          setIsValidator(validatorCheck);
        } catch (err) {
          // If validator check fails, just set to false
          setIsOwner(false);
          setIsValidator(false);
        }
      }
    } catch (error) {
      // Only log non-critical errors
      if (error.code !== 'CALL_EXCEPTION') {
        console.error("Failed to fetch bridge info:", error);
      }
      setBridgeInfo(prev => ({ ...prev, loading: false }));
    }
  }, [bridgeContract, provider, address, bridgeAddress]);

  const fetchTokenBalance = useCallback(async (tokenAddress) => {
    if (!bridgeContract || !tokenAddress || !ethers.utils.isAddress(tokenAddress)) {
      return '0';
    }

    try {
      const balance = await bridgeContract.getBalance(tokenAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
      return '0';
    }
  }, [bridgeContract]);

  useEffect(() => {
    fetchBridgeInfo();
  }, [fetchBridgeInfo]);

  return {
    ...bridgeInfo,
    isOwner,
    isValidator,
    fetchBridgeInfo,
    fetchTokenBalance,
  };
};

export default useBridgeInfo;

