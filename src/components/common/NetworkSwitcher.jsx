import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../contexts/WalletContext';
import { SUPPORTED_CHAINS } from '../../constants/chains';
import toast from 'react-hot-toast';

/**
 * Network Switcher Component
 * Allows users to manually switch between supported networks
 * Fully responsive design
 */
const NetworkSwitcher = () => {
  const { chainId, provider, isConnected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const currentChain = chainId ? SUPPORTED_CHAINS.find(c => c.chainId === chainId) : null;

  const handleSwitchNetwork = async (targetChain) => {
    if (!isConnected || !provider) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (chainId === targetChain.chainId) {
      toast('Already on this network', { icon: 'ℹ️' });
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    const toastId = toast.loading(`Switching to ${targetChain.name}...`);

    try {
      // Try to switch network
      await provider.send('wallet_switchEthereumChain', [{ 
        chainId: `0x${targetChain.chainId.toString(16)}` 
      }]);
      
      toast.success(`Switched to ${targetChain.name}!`, { id: toastId });
      setIsOpen(false);
    } catch (switchError) {
      // If switch fails (chain not added), try to add it
      if (switchError.code === 4902 || (switchError.message && switchError.message.includes('Unrecognized chain'))) {
        try {
          await provider.send('wallet_addEthereumChain', [{
            chainId: `0x${targetChain.chainId.toString(16)}`,
            chainName: targetChain.name,
            nativeCurrency: {
              name: targetChain.symbol,
              symbol: targetChain.symbol,
              decimals: 18
            },
            rpcUrls: [targetChain.rpcUrl],
            blockExplorerUrls: [targetChain.explorerUrl]
          }]);
          toast.success(`Added ${targetChain.name}. Please switch to it in MetaMask.`, { id: toastId });
        } catch (addError) {
          console.error('Add chain error:', addError);
          toast.error(`Failed to add ${targetChain.name}. Please add it manually in MetaMask.`, { id: toastId });
        }
      } else if (switchError.code === 4001) {
        toast.error('Network switch rejected in MetaMask.', { id: toastId });
      } else {
        toast.error(`Failed to switch network: ${switchError.message || 'Unknown error'}`, { id: toastId });
      }
    } finally {
      setIsSwitching(false);
    }
  };

  if (!isConnected) {
    return null; // Don't show network switcher if wallet is not connected
  }

  return (
    <div className="relative">
      {/* Network Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Switch Network"
      >
        {currentChain ? (
          <>
            <img 
              src={currentChain.logo} 
              alt={currentChain.name} 
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" 
            />
            <span className="text-xs sm:text-sm font-medium text-slate-200 hidden sm:inline">
              {currentChain.name}
            </span>
            <svg 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        ) : (
          <>
            <span className="text-xs sm:text-sm font-medium text-slate-400">Select Network</span>
            <svg 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Network Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Switch Network
              </div>
              
              {SUPPORTED_CHAINS.map((chain) => {
                const isActive = chainId === chain.chainId;
                const isDisabled = isSwitching;
                
                return (
                  <button
                    key={chain.chainId}
                    onClick={() => handleSwitchNetwork(chain)}
                    disabled={isDisabled || isActive}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-400 cursor-default'
                        : isDisabled
                        ? 'text-slate-500 cursor-not-allowed'
                        : 'text-slate-200 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <img 
                      src={chain.logo} 
                      alt={chain.name} 
                      className="w-6 h-6 rounded-full flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{chain.name}</div>
                      <div className="text-xs text-slate-400">Chain ID: {chain.chainId}</div>
                    </div>
                    {isActive && (
                      <svg className="w-5 h-5 text-sky-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NetworkSwitcher;

