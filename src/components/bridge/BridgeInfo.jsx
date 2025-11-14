import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../contexts/WalletContext';
import useBridgeInfo from '../../hooks/useBridgeInfo';
import useContract from '../../hooks/useContract';
import { getBridgeAddress } from '../../constants/tokens';
import { shortenAddress } from '../../utils/formatters';
import multxBridgeAbi from '../../constants/abi/multxBridgeAbi.json';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

/**
 * Component to display bridge contract information and admin functions
 * Fully responsive design
 */
const BridgeInfo = ({ chainId }) => {
  const { address, chainId: connectedChainId, signer } = useWallet();
  const bridgeAddress = getBridgeAddress(chainId);
  const { paused, nonce, validators, owner, isOwner, isValidator, loading, fetchBridgeInfo } = useBridgeInfo(bridgeAddress);
  const bridgeContract = useContract(bridgeAddress, multxBridgeAbi.abi);
  const [isUpdating, setIsUpdating] = useState(false);

  // Only show if on the correct chain
  if (connectedChainId !== chainId) {
    return null;
  }

  const handleSetPaused = async (pauseState) => {
    if (!isOwner) {
      toast.error('Only contract owner can pause/unpause the bridge.');
      return;
    }

    if (!bridgeContract || !signer) {
      toast.error('Bridge contract is not ready.');
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading(`${pauseState ? 'Pausing' : 'Unpausing'} bridge...`);
    
    try {
      const tx = await bridgeContract.setPaused(pauseState);
      toast.loading('Transaction pending...', { id: toastId });
      await tx.wait();
      toast.success(`Bridge ${pauseState ? 'paused' : 'unpaused'} successfully!`, { id: toastId });
      fetchBridgeInfo();
    } catch (error) {
      console.error('Failed to update bridge status:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected in wallet.', { id: toastId });
      } else {
        toast.error(error.reason || error.message || 'Failed to update bridge status.', { id: toastId });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700/50">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700/50 space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100">Bridge Status</h3>
        {isOwner && (
          <Button
            onClick={() => handleSetPaused(!paused)}
            disabled={isUpdating}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            variant={paused ? 'primary' : 'secondary'}
          >
            {paused ? 'Unpause' : 'Pause'} Bridge
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Status */}
        <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-400 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${paused ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <p className="text-sm sm:text-base font-semibold text-slate-100">
              {paused ? 'Paused' : 'Active'}
            </p>
          </div>
        </div>

        {/* Nonce */}
        <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-400 mb-1">Transaction Nonce</p>
          <p className="text-sm sm:text-base font-mono font-semibold text-slate-100">
            {nonce || '0'}
          </p>
        </div>

        {/* Owner */}
        <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-400 mb-1">Owner</p>
          <p className="text-xs sm:text-sm font-mono text-slate-300 break-all">
            {owner ? shortenAddress(owner) : 'N/A'}
          </p>
        </div>

        {/* Validators Count */}
        <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-400 mb-1">Validators</p>
          <p className="text-sm sm:text-base font-semibold text-slate-100">
            {validators.length || 0} / 3
          </p>
        </div>
      </div>

      {/* Validators List */}
      {validators.length > 0 && (
        <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3">Validator Addresses</p>
          <div className="space-y-2">
            {validators.map((validator, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-800/50 rounded text-xs sm:text-sm"
              >
                <span className="text-slate-300 font-mono break-all sm:break-normal">
                  {shortenAddress(validator)}
                </span>
                {address && validator.toLowerCase() === address.toLowerCase() && (
                  <span className="ml-2 px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded text-xs">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Notice */}
      {(isOwner || isValidator) && (
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-sky-400">
            {isOwner ? '🔑 You are the contract owner' : '✅ You are a validator'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BridgeInfo;

