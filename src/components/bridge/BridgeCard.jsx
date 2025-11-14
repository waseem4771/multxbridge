
// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import toast from 'react-hot-toast';

// // Contexts, Hooks, Constants, aur Services
// import { useWallet } from './../../contexts/WalletContext';
// import { SUPPORTED_CHAINS } from './../../constants/chains';
// import { getTokenAddress, getBridgeAddress } from './../../constants/tokens';
// import useAllowance from '../../hooks/useAllowance';
// import useContract from '../../hooks/useContract';
// import { pollForSignatures } from './../../services/bridgeApi';

// // ABIs
// import ierc20Abi from './../../constants/abi/ierc20Abi.json';
// import multxBridgeAbi from './../../constants/abi/multxBridgeAbi.json';

// // Components
// import ChainSelector from './ChainSelector';
// import TokenInput from './TokenInput';
// import Button from '../ui/Button';
// import TransactionStatus from './TransactionStatus';
// import switchIcon from '../../assets/images/switchIcon.svg';

// // --- UI Enhancement: Spinner Icon ---
// const SpinnerIcon = () => (
//   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//   </svg>
// );

// const BridgeCard = () => {
//   const { isConnected, connectWallet, chainId, provider } = useWallet();

//   // State Management (No changes here)
//   const [appStatus, setAppStatus] = useState('idle');
//   const [bridgeData, setBridgeData] = useState(null);
//   const [sourceChain, setSourceChain] = useState(SUPPORTED_CHAINS[0]);
//   const [destinationChain, setDestinationChain] = useState(SUPPORTED_CHAINS[1]);
//   const [amount, setAmount] = useState('');
//   const [selectedToken, setSelectedToken] = useState('USDT');

//   // Logic (No changes in the core logic)
//   const sourceTokenAddress = getTokenAddress(selectedToken, sourceChain.chainId);
//   const sourceBridgeAddress = getBridgeAddress(sourceChain.chainId);
//   const destBridgeAddress = getBridgeAddress(destinationChain.chainId);

//   const { allowance, refreshAllowance } = useAllowance(sourceTokenAddress, sourceBridgeAddress);
//   const tokenContract = useContract(sourceTokenAddress, ierc20Abi);
//   const sourceBridge = useContract(sourceBridgeAddress, multxBridgeAbi.abi);
//   const destBridge = useContract(destBridgeAddress, multxBridgeAbi.abi);

//   const amountToBridge = (amount && !isNaN(amount)) ? ethers.utils.parseUnits(amount, 18) : ethers.BigNumber.from(0);
//   const hasEnoughAllowance = allowance.gte(amountToBridge) && amountToBridge.gt(0);

//   const handleSwap = () => {
//     setSourceChain(destinationChain);
//     setDestinationChain(sourceChain);
//     setAmount('');
//   };

//   const getExplorerLink = (txHash, chainId) => {
//     const chain = SUPPORTED_CHAINS.find(c => c.chainId === chainId);
//     return chain ? `${chain.explorerUrl}/tx/${txHash}` : '#';
//   };

//   const getReadableError = (error) => {
//     if (error.code === 4001) return 'Transaction rejected in wallet.';
//     if (error.reason) return error.reason;
//     if (error.message) return error.message;
//     return 'An unknown error occurred.';
//   };

//   const handleApprove = async () => {
//     if (!tokenContract) return toast.error('Token contract is not ready.');
//     setAppStatus('approving');
//     const toastId = toast.loading('Awaiting approval in your wallet...');
//     try {
//       const tx = await tokenContract.approve(sourceBridgeAddress, ethers.constants.MaxUint256);
//       toast.loading('Approval transaction is pending...', { id: toastId });
//       await tx.wait();
//       toast.success('Approval successful!', { id: toastId });
//       refreshAllowance();
//     } catch (error) {
//       console.error("Approval failed:", error);
//       toast.error(getReadableError(error), { id: toastId });
//     } finally {
//       setAppStatus('idle');
//     }
//   };

//   const handleBridge = async () => {
//     if (!sourceBridge) return toast.error('Bridge contract is not ready.');
//     setAppStatus('locking');
//     const toastId = toast.loading('Please confirm the lock transaction...');
//     try {
//       const tx = await sourceBridge.lockTokens(sourceTokenAddress, amountToBridge, destinationChain.chainId);
//       toast.loading('Locking tokens on the source chain...', { id: toastId });
//       const receipt = await tx.wait();
//       const lockEvent = receipt.events?.find(e => e.event === 'TokensLocked');
//       if (!lockEvent) throw new Error("Could not find the TokensLocked event in receipt.");
//       const bridgeTxHash = lockEvent.args.txHash;
//       toast.success(
//         <span>Tokens Locked! <a href={getExplorerLink(tx.hash, sourceChain.chainId)} target="_blank" rel="noopener noreferrer" className="underline font-bold">View Tx</a></span>,
//         { id: toastId, duration: 6000 }
//       );
//       setBridgeData({ lockTxHash: tx.hash, bridgeTxHash });
//       setAppStatus('waiting_signatures');
//       const releaseParams = await pollForSignatures(bridgeTxHash);
//       setBridgeData(prev => ({ ...prev, ...releaseParams, ...lockEvent.args }));
//       setAppStatus('ready_to_release');
//       toast.success('Signatures received! Ready to release.');
//     } catch (error) {
//       console.error("Locking failed:", error);
//       toast.error(getReadableError(error), { id: toastId });
//       setAppStatus('idle');
//     }
//   };
  
//   const handleRelease = async () => {
//     if (!destBridge) return toast.error('Destination bridge contract is not ready.');
//     if (chainId !== destinationChain.chainId) {
//       try {
//         toast('Please switch your network to the destination chain.');
//         await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${destinationChain.chainId.toString(16)}` }]);
//       } catch (switchError) {
//         toast.error(getReadableError(switchError));
//       }
//       return;
//     }
//     setAppStatus('releasing');
//     const toastId = toast.loading('Please confirm the release transaction...');
//     try {
//       const { token, user, amount: releaseAmount, sourceChainId: srcChainId, nonce, txHash, signatures } = bridgeData;
//       const tx = await destBridge.releaseTokens(token, user, releaseAmount, srcChainId, nonce, txHash, signatures);
//       toast.loading('Releasing tokens on the destination chain...', { id: toastId });
//       await tx.wait();
//       toast.success(
//         <span>Tokens Released! <a href={getExplorerLink(tx.hash, destinationChain.chainId)} target="_blank" rel="noopener noreferrer" className="underline font-bold">View Tx</a></span>,
//         { id: toastId, duration: 6000 }
//       );
//       setAppStatus('completed');
//       setAmount('');
//       setBridgeData(null);
//     } catch (error) {
//       console.error("Release failed:", error);
//       toast.error(getReadableError(error), { id: toastId });
//       setAppStatus('ready_to_release');
//     }
//   };

//   const renderActionButton = () => {
//     if (!isConnected) {
//       return (
//         <Button
//           onClick={connectWallet}
//           className="btn-flip !bg-sky-600 hover:!bg-sky-700 shadow-lg shadow-sky-600/20"
//           fullWidth
//         >
//           {/* Main container for animation, marked as relative */}
//           <span className="btn-flip-content relative block">
//             {/* INVISIBLE GHOST ELEMENT: yeh button ko uski sahi height/width deta hai */}
//             <span className="opacity-0">Connect Wallet</span>

//             {/* VISIBLE & ANIMATING ELEMENTS: yeh ghost element ke upar aate hain */}
//             <span className="front-text">Connect Wallet</span>
//             <span className="back-text">Connect Wallet</span>
//           </span>
//         </Button>
//       );
//     }

//     // --- Baaki code bilkul waisa hi hai ---
//     if (sourceChain.chainId !== chainId) return <Button className="!bg-red-600 !text-white cursor-not-allowed" fullWidth disabled>Wrong Network</Button>;
//     if (!amount || parseFloat(amount) <= 0) return <Button fullWidth disabled>Enter an amount</Button>;
    
//     const loadingButton = (text) => (
//       <Button fullWidth disabled>
//         <SpinnerIcon />
//         {text}
//       </Button>
//     );

//     switch (appStatus) {
//       case 'approving': return loadingButton('Approving...');
//       case 'locking': return loadingButton('Bridging...');
//       case 'waiting_signatures': return loadingButton('Waiting for Validators...');
//       case 'ready_to_release': return <Button onClick={handleRelease} className="!bg-sky-600 hover:!bg-sky-700 shadow-lg shadow-sky-600/20" fullWidth>Release Tokens</Button>;
//       case 'releasing': return loadingButton('Releasing Tokens...');
//       case 'completed': return <Button onClick={() => { setAppStatus('idle'); setAmount(''); }} className="!bg-green-600 hover:!bg-green-700" fullWidth>Start New Bridge</Button>;
//       default:
//         return hasEnoughAllowance 
//           ? <Button onClick={handleBridge} className="!bg-sky-600 hover:!bg-sky-700 shadow-lg shadow-sky-600/20" fullWidth>Bridge Now</Button>
//           : <Button onClick={handleApprove} className="!bg-amber-500 hover:!bg-amber-600" fullWidth>Approve {selectedToken}</Button>;
//     }
//   };

//   return (
//     <div className="w-full max-w-lg bg-slate-900/50 rounded-2xl p-10 shadow-2xl shadow-black/30 border border-slate-700/50 backdrop-blur-xl space-y-6 -mt-16">
//       <div className="relative space-y-4">
//         <ChainSelector label="From" chainName={sourceChain.name} chainLogo={sourceChain.logo} />
//         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
//           <button 
//             onClick={handleSwap} 
//             className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-900/80 hover:bg-sky-600 transition-all duration-300 transform hover:rotate-180 hover:scale-110 shadow-lg"
//             aria-label="Switch Chains"
//           >
//             <img src={switchIcon} alt="Switch Chains" className="w-6 h-6" />
//           </button>
//         </div>
//         <ChainSelector label="To" chainName={destinationChain.name} chainLogo={destinationChain.logo} />
//       </div>

//       <TokenInput
//         amount={amount}
//         onAmountChange={setAmount}
//         selectedToken={selectedToken}
//         onTokenSelect={setSelectedToken}
//         sourceChainId={sourceChain.chainId}
//       />

//       {['approving', 'locking', 'waiting_signatures', 'releasing'].includes(appStatus) && (
//         <div className="bg-slate-800/50 rounded-lg p-4">
//           <TransactionStatus status={appStatus} />
//         </div>
//       )}

//       <div className="pt-2">
//         {renderActionButton()}
//       </div>
//     </div>
//   );
// };

// export default BridgeCard;









// --------------- Mobile Responsive ----------------------------


import React, { useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// Contexts, Hooks, Constants, aur Services
import { useWallet } from './../../contexts/WalletContext';
import { SUPPORTED_CHAINS } from './../../constants/chains';
import { getTokenAddress, getBridgeAddress, SUPPORTED_TOKENS } from './../../constants/tokens';
import useAllowance from '../../hooks/useAllowance';
import useContract from '../../hooks/useContract';
import useBridgeInfo from '../../hooks/useBridgeInfo';
import { pollForSignatures } from './../../services/bridgeApi';
import { decodeContractError } from './../../utils/errorDecoder';
import { getMockReleaseParams } from './../../utils/mockSignatures';

// ABIs
import ierc20Abi from './../../constants/abi/ierc20Abi.json';
import multxBridgeAbi from './../../constants/abi/multxBridgeAbi.json';

// Components
import ChainSelector from './ChainSelector';
import TokenInput from './TokenInput';
import Button from '../ui/Button';
import TransactionStatus from './TransactionStatus';
import switchIcon from '../../assets/images/switchIcon.svg';

// --- UI Enhancement: Spinner Icon ---
const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const BridgeCard = () => {
  const { isConnected, connectWallet, chainId, provider, address, signer } = useWallet();

  // State Management
  const [appStatus, setAppStatus] = useState('idle');
  const [bridgeData, setBridgeData] = useState(null);
  const [sourceChain, setSourceChain] = useState(SUPPORTED_CHAINS[0]);
  const [destinationChain, setDestinationChain] = useState(SUPPORTED_CHAINS[1]);
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Logic
  const sourceTokenAddress = getTokenAddress(selectedToken, sourceChain.chainId);
  const destTokenAddress = getTokenAddress(selectedToken, destinationChain.chainId);
  const sourceBridgeAddress = getBridgeAddress(sourceChain.chainId);
  const destBridgeAddress = getBridgeAddress(destinationChain.chainId);

  const { allowance, refreshAllowance } = useAllowance(sourceTokenAddress, sourceBridgeAddress);
  const tokenContract = useContract(sourceTokenAddress, ierc20Abi);
  const sourceBridge = useContract(sourceBridgeAddress, multxBridgeAbi.abi);
  const destBridge = useContract(destBridgeAddress, multxBridgeAbi.abi);

  // Bridge info to check paused state
  const sourceBridgeInfo = useBridgeInfo(sourceBridgeAddress);
  const destBridgeInfo = useBridgeInfo(destBridgeAddress);

  // Get token decimals from token config, default to 18
  const selectedTokenConfig = SUPPORTED_TOKENS.find(t => t.symbol === selectedToken);
  const tokenDecimals = selectedTokenConfig?.decimals || 18;
  
  const amountToBridge = (amount && !isNaN(amount)) ? ethers.utils.parseUnits(amount, tokenDecimals) : ethers.BigNumber.from(0);
  
  // Check allowance - if allowance is very large (MaxUint256 or close), consider it approved
  const isApproved = allowance.gte(amountToBridge) && amountToBridge.gt(0);
  // Check if allowance is MaxUint256 or very close to it (meaning it was already approved)
  const maxUint256 = ethers.constants.MaxUint256;
  const isMaxApproved = allowance.gte(maxUint256.sub(ethers.BigNumber.from(10).pow(20))); // Very close to max means approved
  const hasEnoughAllowance = isApproved || isMaxApproved;

  const handleSwap = () => {
    setSourceChain(destinationChain);
    setDestinationChain(sourceChain);
    setAmount('');
    setReceiverAddress(''); // Reset receiver address when swapping chains
  };

  // Validate Ethereum address
  const isValidAddress = (address) => {
    return ethers.utils.isAddress(address);
  };

  const getExplorerLink = (txHash, chainId) => {
    const chain = SUPPORTED_CHAINS.find(c => c.chainId === chainId);
    return chain ? `${chain.explorerUrl}/tx/${txHash}` : '#';
  };

  const getReadableError = (error) => {
    if (error.code === 4001) return 'Transaction rejected in wallet.';
    if (error.reason) return error.reason;
    if (error.message) return error.message;
    return 'An unknown error occurred.';
  };

  const handleApprove = async () => {
    if (!tokenContract) return toast.error('Token contract is not ready.');
    
    // Skip if already approved
    if (hasEnoughAllowance || isMaxApproved) {
      toast('Token is already approved. You can proceed to bridge.');
      return;
    }
    
    setAppStatus('approving');
    const toastId = toast.loading('Awaiting approval in your wallet...');
    try {
      const tx = await tokenContract.approve(sourceBridgeAddress, ethers.constants.MaxUint256);
      toast.loading('Approval transaction is pending...', { id: toastId });
      await tx.wait();
      toast.success('Approval successful!', { id: toastId });
      refreshAllowance();
    } catch (error) {
      console.error("Approval failed:", error);
      if (error.code === 4001) {
        toast.error('Approval rejected in wallet.', { id: toastId });
      } else {
        toast.error(getReadableError(error), { id: toastId });
      }
    } finally {
      setAppStatus('idle');
    }
  };

  const handleBridge = async () => {
    if (!sourceBridge) return toast.error('Bridge contract is not ready.');
    
    // Check if bridge is paused
    if (sourceBridgeInfo?.paused) {
      toast.error('Bridge is currently paused. Please try again later.');
      return;
    }
    
    // Validate token address before proceeding
    if (!sourceTokenAddress || sourceTokenAddress === '0x0000000000000000000000000000000000000000') {
      toast.error(`Token ${selectedToken} is not available on ${sourceChain.name}.`);
      return;
    }

    // Note: Balance validation is handled by the contract itself
    // The contract will revert with a proper error if balance is insufficient

    setAppStatus('locking');
    const toastId = toast.loading('Please confirm the lock transaction...');
    try {
      const tx = await sourceBridge.lockTokens(sourceTokenAddress, amountToBridge, destinationChain.chainId);
      toast.loading('Locking tokens on the source chain...', { id: toastId });
      const receipt = await tx.wait();
      const lockEvent = receipt.events?.find(e => e.event === 'TokensLocked');
      if (!lockEvent) throw new Error("Could not find the TokensLocked event in receipt.");
      const bridgeTxHash = lockEvent.args.txHash;
      toast.success(
        <span>Tokens Locked! <a href={getExplorerLink(tx.hash, sourceChain.chainId)} target="_blank" rel="noopener noreferrer" className="underline font-bold">View Tx</a></span>,
        { id: toastId, duration: 6000 }
      );
      const lockEventData = {
        txHash: bridgeTxHash,
        nonce: lockEvent.args.nonce,
        token: sourceTokenAddress,
        user: address,
        amount: amountToBridge,
        sourceChainId: sourceChain.chainId,
      };
      
      // Store all bridge data including sourceChainId (which is not in event args)
      setBridgeData({ 
        lockTxHash: tx.hash, 
        bridgeTxHash, 
        ...lockEvent.args,  // Contains: txHash, token, user, amount, targetChain, nonce
        sourceChainId: sourceChain.chainId,  // Explicitly add sourceChainId
        token: sourceTokenAddress,  // Use our token address (more reliable)
        user: address,  // Use our address (more reliable)
        amount: amountToBridge,  // Use our amount (BigNumber format)
      });
      setAppStatus('waiting_signatures');
      
      try {
        const releaseParams = await pollForSignatures(bridgeTxHash);
        
        if (releaseParams && releaseParams.useMockSignatures) {
          // Backend not available - use mock signatures for testing
          const mockParams = getMockReleaseParams(lockEventData);
          setBridgeData(prev => ({ ...prev, ...mockParams }));
          setAppStatus('ready_to_release');
          toast.success(
            <div>
              <p className="font-semibold">Tokens locked! Using mock signatures for testing.</p>
              <p className="text-sm mt-1">Backend not available - flow will continue with test signatures.</p>
            </div>,
            { duration: 6000 }
          );
        } else if (releaseParams) {
          // Signatures received from backend
          setBridgeData(prev => ({ ...prev, ...releaseParams }));
          setAppStatus('ready_to_release');
          toast.success('Signatures received! Ready to release.');
        } else {
          // Fallback: use mock signatures
          const mockParams = getMockReleaseParams(lockEventData);
          setBridgeData(prev => ({ ...prev, ...mockParams }));
          setAppStatus('ready_to_release');
          toast.success(
            <div>
              <p className="font-semibold">Tokens locked! Using mock signatures for testing.</p>
              <p className="text-sm mt-1">Backend not available - flow will continue with test signatures.</p>
            </div>,
            { duration: 6000 }
          );
        }
      } catch (error) {
        // If polling fails completely, use mock signatures
        console.warn('Could not fetch signatures from backend, using mock signatures:', error);
        const mockParams = getMockReleaseParams(lockEventData);
        setBridgeData(prev => ({ ...prev, ...mockParams }));
        setAppStatus('ready_to_release');
        toast.success(
          <div>
            <p className="font-semibold">Tokens locked! Using mock signatures for testing.</p>
            <p className="text-sm mt-1">Backend not available - flow will continue with test signatures.</p>
          </div>,
          { duration: 6000 }
        );
      }
    } catch (error) {
      console.error("Locking failed:", error);
      
      // Better error messages for common contract errors
      let errorMessage = getReadableError(error);
      
      // Try to decode contract error
      if (error.data) {
        const errorData = error.data.data || error.data;
        const decodedError = decodeContractError(errorData);
        if (decodedError) {
          errorMessage = decodedError;
        } else if (error.reason && error.reason.includes('execution reverted')) {
          // If we can't decode, provide helpful message
          errorMessage = 'Transaction failed. Please check: 1) You have enough token balance, 2) Token is approved, 3) Bridge contract is not paused, 4) Source and destination chains are different.';
        }
      } else if (error.reason && error.reason.includes('execution reverted')) {
        errorMessage = 'Transaction failed. Please check your token balance and approval.';
      }
      
      toast.error(errorMessage, { id: toastId, duration: 6000 });
      setAppStatus('idle');
    }
  };
  
  const handleRelease = async () => {
    // Get the actual destination chain from bridgeData (where tokens were locked from)
    // If sourceChainId is stored, find the opposite chain as destination
    if (!bridgeData) {
      console.error('Bridge data is null:', bridgeData);
      toast.error('Bridge transaction data not found. Please start a new bridge transaction.');
      return;
    }
    
    // Debug: Log bridgeData to see what we have
    console.log('Bridge data for release:', bridgeData);
    
    // Try to get sourceChainId from bridgeData, with fallback to targetChain or current chain
    // Note: targetChain in event is the destination, so if we have targetChain, the source is the opposite
    const storedSourceChainId = bridgeData.sourceChainId || (bridgeData.targetChain ? 
      SUPPORTED_CHAINS.find(c => c.chainId !== bridgeData.targetChain)?.chainId : null) || chainId;
    
    if (!storedSourceChainId) {
      console.error('Could not determine source chain. BridgeData:', bridgeData, 'Current chainId:', chainId);
      toast.error('Could not determine source chain. Please start a new bridge transaction.');
      return;
    }
    
    // Determine destination chain based on source chain from bridgeData
    // If locked on BSC (97), release on Sepolia (11155111)
    // If locked on Sepolia (11155111), release on BSC (97)
    const actualSourceChainId = storedSourceChainId;
    const actualDestinationChain = SUPPORTED_CHAINS.find(
      chain => chain.chainId !== actualSourceChainId
    );
    
    if (!actualDestinationChain) {
      toast.error('Could not determine destination chain. Please start a new bridge transaction.');
      return;
    }
    
    // Check if destination bridge is paused (use the destBridgeInfo we already have)
    // Note: destBridgeInfo is for the current destinationChain in UI, but we need to check the actual destination
    // For now, we'll skip this check or use a direct contract call
    const actualDestBridgeAddress = getBridgeAddress(actualDestinationChain.chainId);
    
    // Validate receiver address
    const finalReceiverAddress = receiverAddress.trim() || address; // Use input or connected wallet address
    if (!isValidAddress(finalReceiverAddress)) {
      toast.error('Please enter a valid receiver address.');
      return;
    }

    // Get destination token address for the actual destination chain
    const actualDestTokenAddress = getTokenAddress(selectedToken, actualDestinationChain.chainId);
    
    // Check if destination token is available
    if (!actualDestTokenAddress || actualDestTokenAddress === '0x0000000000000000000000000000000000000000') {
      toast.error(
        <div>
          <p className="font-semibold">Token not available on {actualDestinationChain.name}</p>
          <p className="text-sm mt-1">Please deploy {selectedToken} on {actualDestinationChain.name} first, or use a different token.</p>
        </div>,
        { duration: 6000 }
      );
      return;
    }

    // Check if user is on the correct network for release
    // IMPORTANT: Release must happen on the destination chain (where tokens will be received)
    if (chainId !== actualDestinationChain.chainId) {
      // Prevent multiple switch attempts
      if (isSwitchingNetwork) {
        toast('Network switch in progress...', { icon: '⏳' });
        return;
      }
      
      setIsSwitchingNetwork(true);
      const switchToastId = toast.loading(
        <div>
          <p className="font-semibold">Switch to {actualDestinationChain.name}</p>
          <p className="text-sm mt-1">You locked tokens on {SUPPORTED_CHAINS.find(c => c.chainId === actualSourceChainId)?.name}. You need to be on {actualDestinationChain.name} to release them.</p>
        </div>,
        { duration: 5000 }
      );
      
      try {
        // Try to switch network
        await provider.send('wallet_switchEthereumChain', [{ 
          chainId: `0x${actualDestinationChain.chainId.toString(16)}` 
        }]);
        
        toast.success(`Switched to ${actualDestinationChain.name}! Please click "Release Tokens" again.`, { 
          id: switchToastId,
          duration: 5000 
        });
        setIsSwitchingNetwork(false);
        return;
      } catch (switchError) {
        setIsSwitchingNetwork(false);
        console.error('Network switch error:', switchError);
        
        // If switch fails (chain not added), try to add it
        if (switchError.code === 4902 || (switchError.message && switchError.message.includes('Unrecognized chain'))) {
          try {
            await provider.send('wallet_addEthereumChain', [{
              chainId: `0x${actualDestinationChain.chainId.toString(16)}`,
              chainName: actualDestinationChain.name,
              nativeCurrency: {
                name: actualDestinationChain.symbol,
                symbol: actualDestinationChain.symbol,
                decimals: 18
              },
              rpcUrls: [actualDestinationChain.rpcUrl],
              blockExplorerUrls: [actualDestinationChain.explorerUrl]
            }]);
            toast.success(`Added ${actualDestinationChain.name}. Please switch to it in MetaMask and click "Release Tokens" again.`, { 
              id: switchToastId,
              duration: 6000 
            });
            return;
          } catch (addError) {
            console.error('Add chain error:', addError);
            toast.error(
              <div>
                <p className="font-semibold">Failed to add {actualDestinationChain.name}</p>
                <p className="text-sm mt-1">Please add it manually in MetaMask: Chain ID {actualDestinationChain.chainId}</p>
              </div>,
              { id: switchToastId, duration: 8000 }
            );
            return;
          }
        } else if (switchError.code === 4001) {
          toast.error('Network switch rejected in MetaMask.', { id: switchToastId });
          return;
        } else {
          // Generic error - show helpful message
          toast.error(
            <div>
              <p className="font-semibold">Network switch failed</p>
              <p className="text-sm mt-1">Please manually switch to {actualDestinationChain.name} (Chain ID: {actualDestinationChain.chainId}) in MetaMask.</p>
            </div>,
            { id: switchToastId, duration: 8000 }
          );
          return;
        }
      }
    }
    
    // Get the actual destination bridge contract for the correct chain
    // Create contract instance directly since we can't use hooks conditionally
    if (!provider || !signer) {
      toast.error('Wallet not connected.');
      return;
    }
    
    const actualDestBridge = new ethers.Contract(actualDestBridgeAddress, multxBridgeAbi.abi, signer);
    
    // Quick check if bridge is paused (optional, can skip if it causes issues)
    try {
      const isPaused = await actualDestBridge.paused();
      if (isPaused) {
        toast.error('Destination bridge is currently paused. Please try again later.');
        return;
      }
    } catch (pauseCheckError) {
      // If pause check fails, continue anyway
      console.warn('Could not check if bridge is paused:', pauseCheckError);
    }
    
    setAppStatus('releasing');
    const toastId = toast.loading('Please confirm the release transaction...');
    try {
      let { amount: releaseAmount, sourceChainId: srcChainId, nonce, txHash, signatures } = bridgeData;
      
      // Check if signatures are available, if not generate mock ones for testing
      if (!signatures || (Array.isArray(signatures) && signatures.length === 0)) {
        console.warn('No signatures found, generating mock signatures for testing');
        const mockParams = getMockReleaseParams({
          txHash: txHash || bridgeData.bridgeTxHash,
          nonce: nonce || bridgeData.nonce,
          token: actualDestTokenAddress,
          user: finalReceiverAddress,
          amount: releaseAmount,
          sourceChainId: srcChainId || bridgeData.sourceChainId,
        });
        // Use mock signatures
        signatures = mockParams.signatures;
        // Update bridgeData with mock signatures for consistency
        setBridgeData(prev => ({ ...prev, signatures }));
        toast('Using mock signatures for testing', { icon: '⚠️', duration: 4000 });
      }
      
      // Debug: Log release parameters before calling contract
      console.log('Release parameters:', {
        token: actualDestTokenAddress,
        user: finalReceiverAddress,
        amount: releaseAmount?.toString(),
        sourceChain: srcChainId || actualSourceChainId,
        nonce: nonce?.toString(),
        txHash: txHash || bridgeData.bridgeTxHash,
        signaturesCount: signatures?.length,
        destinationChain: actualDestinationChain.chainId,
        currentChain: chainId
      });
      
      // Ensure we have all required parameters
      if (!releaseAmount || !nonce || !txHash) {
        toast.error('Missing required bridge data. Please start a new bridge transaction.', { id: toastId });
        return;
      }
      
      // Use destination token address and receiver address
      // Note: releaseTokens parameters: (token, user, amount, sourceChain, sourceNonce, sourceTxHash, signatures)
      const tx = await actualDestBridge.releaseTokens(
        actualDestTokenAddress,  // Destination chain token address
        finalReceiverAddress,  // Receiver address (user input or connected wallet)
        releaseAmount,
        srcChainId || actualSourceChainId,  // Source chain ID
        nonce,
        txHash || bridgeData.bridgeTxHash,  // Source transaction hash
        signatures
      );
      toast.loading('Releasing tokens on the destination chain...', { id: toastId });
      await tx.wait();
      toast.success(
        <span>Tokens Released! <a href={getExplorerLink(tx.hash, actualDestinationChain.chainId)} target="_blank" rel="noopener noreferrer" className="underline font-bold">View Tx</a></span>,
        { id: toastId, duration: 6000 }
      );
      setAppStatus('completed');
      setAmount('');
      setReceiverAddress('');
      setBridgeData(null);
    } catch (error) {
      console.error("Release failed:", error);
      
      // Better error messages for release errors
      let errorMessage = getReadableError(error);
      
      // Try to decode contract error
      if (error.data) {
        const errorData = error.data.data || error.data;
        const decodedError = decodeContractError(errorData);
        if (decodedError) {
          errorMessage = decodedError;
          
          // Special handling for InvalidSignature
          if (errorData && errorData.includes('0x8baa579f')) {
            errorMessage = (
              <div>
                <p className="font-semibold">Invalid Validator Signatures</p>
                <p className="text-sm mt-1">
                  Mock signatures cannot pass contract validation. You need real validator signatures from the backend service.
                  {signatures && Array.isArray(signatures) && (
                    <span className="block mt-1 text-xs text-slate-400">
                      Received {signatures.length} signature(s), but they are not valid.
                    </span>
                  )}
                </p>
              </div>
            );
          }
        } else if (error.reason && error.reason.includes('execution reverted')) {
          errorMessage = 'Transaction failed. Please check: 1) Valid signatures are required, 2) Transaction not already processed, 3) Correct chain and parameters.';
        }
      } else if (error.reason && error.reason.includes('execution reverted')) {
        errorMessage = 'Transaction failed. Please check your parameters and signatures.';
      }
      
      toast.error(errorMessage, { id: toastId, duration: 8000 });
      setAppStatus('ready_to_release');
    }
  };

  const renderActionButton = () => {
    if (!isConnected) {
      return (
        <Button
          onClick={connectWallet}
          className="btn-flip !bg-sky-600 hover:!bg-sky-700 shadow-lg shadow-sky-600/20"
          fullWidth
        >
          <span className="btn-flip-content relative block">
            <span className="opacity-0">Connect Wallet</span>
            <span className="front-text">Connect Wallet</span>
            <span className="back-text">Connect Wallet</span>
          </span>
        </Button>
      );
    }

    if (sourceChain.chainId !== chainId) return <Button className="!bg-red-600 !text-white cursor-not-allowed" fullWidth disabled>Wrong Network</Button>;
    if (sourceBridgeInfo?.paused) return <Button className="!bg-red-600 !text-white cursor-not-allowed" fullWidth disabled>Bridge is Paused</Button>;
    if (!amount || parseFloat(amount) <= 0) return <Button fullWidth disabled>Enter an amount</Button>;
    if (receiverAddress && !isValidAddress(receiverAddress)) return <Button fullWidth disabled>Invalid receiver address</Button>;
    
    const loadingButton = (text) => (
      <Button fullWidth disabled>
        <SpinnerIcon />
        {text}
      </Button>
    );

    switch (appStatus) {
      case 'approving': return loadingButton('Approving...');
      case 'locking': return loadingButton('Bridging...');
      case 'waiting_signatures': return loadingButton('Waiting for Validators...');
      case 'ready_to_release': return <Button onClick={handleRelease} className="!bg-sky-600 hover:!bg-sky-700 shadow-lg shadow-sky-600/20" fullWidth>Release Tokens</Button>;
      case 'releasing': return loadingButton('Releasing Tokens...');
      case 'completed': return <Button onClick={() => { setAppStatus('idle'); setAmount(''); }} className="!bg-green-600 hover:!bg-green-700" fullWidth>Start New Bridge</Button>;
      default:
        // If allowance is already very large (approved), skip approve step
        if (hasEnoughAllowance || isMaxApproved) {
          return <Button onClick={handleBridge} className="!bg-sky-600 hover:!bg-sky-700 shadow-lg shadow-sky-600/20" fullWidth>Bridge Now</Button>;
        }
        // Only show approve if allowance is actually needed
        return <Button onClick={handleApprove} className="!bg-amber-500 hover:!bg-amber-600" fullWidth>Approve {selectedToken}</Button>;
    }
  };

  return (
    // === RESPONSIVE CHANGES HERE ===
    // Padding aur margin ko mobile ke liye adjust kiya gaya hai
    <div className="w-full max-w-lg bg-slate-900/50 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/30 border border-slate-700/50 backdrop-blur-xl space-y-5 sm:space-y-6 -mt-8 sm:-mt-16">
      <div className="relative space-y-4">
        <ChainSelector label="From" chainName={sourceChain.name} chainLogo={sourceChain.logo} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {/* Switch button ko mobile ke liye thoda chota kiya gaya hai */}
          <button 
            onClick={handleSwap} 
            className="bg-slate-800 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 sm:border-4 border-slate-900/80 hover:bg-sky-600 transition-all duration-300 transform hover:rotate-180 hover:scale-110 shadow-lg"
            aria-label="Switch Chains"
          >
            <img src={switchIcon} alt="Switch Chains" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <ChainSelector label="To" chainName={destinationChain.name} chainLogo={destinationChain.logo} />
      </div>

      {/* Paused Warning */}
      {sourceBridgeInfo.paused && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-semibold text-red-400">Bridge is Paused</p>
              <p className="text-xs sm:text-sm text-red-300/80 mt-1">
                The bridge on {sourceChain.name} is currently paused. Bridging is temporarily unavailable.
              </p>
            </div>
          </div>
        </div>
      )}

      <TokenInput
        amount={amount}
        onAmountChange={setAmount}
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
        sourceChainId={sourceChain.chainId}
      />

      {/* Receiver Address Input - Fully Responsive */}
      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-slate-300">
          Receiver Address <span className="text-slate-500 text-xs">(Optional - defaults to your wallet)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={`Enter ${destinationChain.name} address or leave empty to use your wallet`}
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            className={`w-full bg-slate-800 border rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
              receiverAddress && !isValidAddress(receiverAddress)
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500'
            }`}
            disabled={!isConnected || ['approving', 'locking', 'waiting_signatures', 'releasing'].includes(appStatus)}
          />
          {receiverAddress && !isValidAddress(receiverAddress) && (
            <p className="mt-1 text-xs text-red-400">Invalid address format</p>
          )}
        </div>
        {!receiverAddress && isConnected && address && (
          <p className="text-xs sm:text-sm text-slate-400 break-all sm:break-normal">
            Will send to: <span className="font-mono text-slate-300">{address}</span>
          </p>
        )}
      </div>

      {['approving', 'locking', 'waiting_signatures', 'releasing'].includes(appStatus) && (
        <div className="bg-slate-800/50 rounded-lg p-4">
          <TransactionStatus status={appStatus} />
        </div>
      )}

      <div className="pt-2">
        {renderActionButton()}
      </div>
    </div>
  );
};

export default BridgeCard;





//------------- Simulation Mode ---------------------------------------






// import React, { useState } from 'react';
// import { ethers } from 'ethers';
// import toast from 'react-hot-toast';

// // Contexts, Hooks, Constants, aur Services
// import { useWallet } from './../../contexts/WalletContext';
// import { SUPPORTED_CHAINS } from './../../constants/chains';
// import { getTokenAddress, getBridgeAddress } from './../../constants/tokens';
// import useAllowance from '../../hooks/useAllowance';
// import useContract from '../../hooks/useContract';
// import { pollForSignatures } from './../../services/bridgeApi';

// // ABIs
// import ierc20Abi from './../../constants/abi/ierc20Abi.json';
// import multxBridgeAbi from './../../constants/abi/multxBridgeAbi.json';

// // Components
// import ChainSelector from './ChainSelector';
// import TokenInput from './TokenInput';
// import Button from '../ui/Button';
// import TransactionStatus from './TransactionStatus';
// import switchIcon from '../../assets/images/switchIcon.svg';

// const BridgeCard = () => {
//   const { isConnected, address, chainId, provider, connectWallet } = useWallet();

//   // State Management
//   const [appStatus, setAppStatus] = useState('idle');
//   const [bridgeData, setBridgeData] = useState(null);
//   const [sourceChain, setSourceChain] = useState(SUPPORTED_CHAINS[0]);
//   const [destinationChain, setDestinationChain] = useState(SUPPORTED_CHAINS[1]);
//   const [amount, setAmount] = useState('');
//   const [selectedToken, setSelectedToken] = useState('USDT');
  
//   // Simulation ke liye alag se allowance state
//   const [simulatedAllowance, setSimulatedAllowance] = useState(ethers.BigNumber.from(0));

//   // Addresses
//   const sourceTokenAddress = getTokenAddress(selectedToken, sourceChain.chainId);
//   const sourceBridgeAddress = getBridgeAddress(sourceChain.chainId);
//   const destBridgeAddress = getBridgeAddress(destinationChain.chainId);
  
//   // Hooks
//   const { allowance: realAllowance, refreshAllowance } = useAllowance(sourceTokenAddress, sourceBridgeAddress);
//   const tokenContract = useContract(sourceTokenAddress, ierc20Abi);
//   const sourceBridge = useContract(sourceBridgeAddress, multxBridgeAbi.abi);
//   const destBridge = useContract(destBridgeAddress, multxBridgeAbi.abi);

//   // Live ya simulated allowance ka istemal
//   const allowance = isConnected ? realAllowance : simulatedAllowance;

//   // Derived State
//   const amountToBridge = (amount && !isNaN(amount)) ? ethers.utils.parseUnits(amount, 18) : ethers.BigNumber.from(0);
//   const hasEnoughAllowance = allowance.gte(amountToBridge) && amountToBridge.gt(0);

//   // Helper Functions
//   const handleSwap = () => {
//     setSourceChain(destinationChain);
//     setDestinationChain(sourceChain);
//     setAmount('');
//   };

//   const getExplorerLink = (txHash, chainId) => {
//     const chain = SUPPORTED_CHAINS.find(c => c.chainId === chainId);
//     return chain ? `${chain.explorerUrl}/tx/${txHash}` : '#';
//   };
  
//   const getReadableError = (error) => {
//     if (error.code === 4001) return 'Transaction rejected in wallet.';
//     if (error.reason) return error.reason;
//     if (error.message) return error.message;
//     return 'An unknown error occurred.';
//   };

//   // --- Transaction Functions (Updated for Simulation) ---

//   const handleApprove = async () => {
//     if (isConnected) {
//       // --- Asli Approve Logic ---
//       if (!tokenContract) return toast.error('Token contract not ready.');
//       setAppStatus('approving');
//       const toastId = toast.loading('Awaiting approval in wallet...');
//       try {
//         const tx = await tokenContract.approve(sourceBridgeAddress, ethers.constants.MaxUint256);
//         await tx.wait();
//         toast.success('Approval successful!', { id: toastId });
//         refreshAllowance();
//       } catch (error) { toast.error(getReadableError(error), { id: toastId }); }
//       finally { setAppStatus('idle'); }
//     } else {
//       // --- Simulation Approve Logic ---
//       setAppStatus('approving');
//       const toastId = toast.loading('Simulating Approval...');
//       setTimeout(() => {
//         toast.success('Approval Successful! (Simulated)', { id: toastId });
//         setSimulatedAllowance(ethers.constants.MaxUint256); // Manually set allowance to pass the check
//         setAppStatus('idle');
//       }, 2000); // 2 second ka intezar
//     }
//   };

//   const handleBridge = async () => {
//     if (isConnected) {
//       // --- Asli Bridge/Lock Logic ---
//       if (!sourceBridge) return toast.error('Bridge contract not ready.');
//       setAppStatus('locking');
//       const toastId = toast.loading('Confirm transaction in wallet...');
//       try {
//         const tx = await sourceBridge.lockTokens(sourceTokenAddress, amountToBridge, destinationChain.chainId);
//         toast.loading('Locking tokens...', { id: toastId });
//         const receipt = await tx.wait();
//         const lockEvent = receipt.events?.find(e => e.event === 'TokensLocked');
//         if (!lockEvent) throw new Error("TokensLocked event not found.");
//         const bridgeTxHash = lockEvent.args.txHash;
//         toast.success(<span>Tokens Locked! <a href={getExplorerLink(tx.hash, sourceChain.chainId)} target="_blank" rel="noopener noreferrer" className="underline">View Tx</a></span>, { id: toastId, duration: 6000 });
//         setBridgeData({ lockTxHash: tx.hash, bridgeTxHash });
//         setAppStatus('waiting_signatures');
//         const releaseParams = await pollForSignatures(bridgeTxHash);
//         setBridgeData(prev => ({ ...prev, ...releaseParams }));
//         setAppStatus('ready_to_release');
//         toast.success('Signatures received! Ready to release.');
//       } catch (error) { toast.error(getReadableError(error), { id: toastId }); setAppStatus('idle'); }
//     } else {
//       // --- Simulation Bridge/Lock Logic ---
//       setAppStatus('locking');
//       const toastId = toast.loading('Simulating Token Lock...');
//       setTimeout(() => {
//         toast.success('Tokens Locked! (Simulated)', { id: toastId });
//         setAppStatus('waiting_signatures');
//         setTimeout(() => {
//           toast.success('Signatures Received! (Simulated)');
//           setAppStatus('ready_to_release');
//           setBridgeData({ ready: true }); // Dummy data to proceed
//         }, 5000); // 5 second ka intezar
//       }, 3000); // 3 second ka intezar
//     }
//   };

//   const handleRelease = async () => {
//     if (isConnected) {
//       // --- Asli Release Logic ---
//       if (!destBridge) return toast.error('Bridge contract not ready.');
//       if (chainId !== destinationChain.chainId) { /* ... network switch logic ... */ return; }
//       setAppStatus('releasing');
//       const toastId = toast.loading('Confirm transaction in wallet...');
//       try {
//         const { token, user, amount: releaseAmount, sourceChain: srcChain, sourceNonce, sourceTxHash, signatures } = bridgeData;
//         const tx = await destBridge.releaseTokens(token, user, releaseAmount, srcChain, sourceNonce, sourceTxHash, signatures);
//         await tx.wait();
//         toast.success(<span>Tokens Released! <a href={getExplorerLink(tx.hash, destinationChain.chainId)} target="_blank" rel="noopener noreferrer" className="underline">View Tx</a></span>, { id: toastId, duration: 6000 });
//         setAppStatus('completed');
//         setAmount('');
//         setBridgeData(null);
//       } catch (error) { toast.error(getReadableError(error), { id: toastId }); setAppStatus('ready_to_release'); }
//     } else {
//       // --- Simulation Release Logic ---
//       setAppStatus('releasing');
//       const toastId = toast.loading('Simulating Token Release...');
//       setTimeout(() => {
//         toast.success('Tokens Released! (Simulated)', { id: toastId });
//         setAppStatus('completed');
//         setAmount('');
//         setBridgeData(null);
//         setSimulatedAllowance(ethers.BigNumber.from(0)); // Reset for next simulation
//       }, 3000); // 3 second ka intezar
//     }
//   };

//   // --- Render Action Button (Updated for Simulation) ---
//   const renderActionButton = () => {
//     // Shared states
//     if (['approving', 'locking', 'waiting_signatures', 'releasing'].includes(appStatus)) {
//         return <Button fullWidth disabled>{appStatus.charAt(0).toUpperCase() + appStatus.slice(1)}...</Button>;
//     }
//     if (appStatus === 'completed') {
//         return <Button onClick={() => setAppStatus('idle')} fullWidth>Start New Transaction</Button>;
//     }

//     // SIMULATION MODE LOGIC
//     if (!isConnected) {
//         if (!amount || parseFloat(amount) <= 0) return <Button fullWidth disabled>Enter an Amount to Simulate</Button>;
//         if (appStatus === 'ready_to_release') return <Button onClick={handleRelease} fullWidth>Release (Simulate)</Button>;
//         return hasEnoughAllowance 
//             ? <Button onClick={handleBridge} fullWidth>Bridge (Simulate)</Button>
//             : <Button onClick={handleApprove} fullWidth>Approve (Simulate)</Button>;
//     }

//     // LIVE MODE LOGIC
//     if (sourceChain.chainId !== chainId) return <Button fullWidth disabled>Wrong Network</Button>;
//     if (!amount || parseFloat(amount) <= 0) return <Button fullWidth disabled>Enter an amount</Button>;
//     if (appStatus === 'ready_to_release') return <Button onClick={handleRelease} fullWidth>Release Tokens</Button>;
    
//     return hasEnoughAllowance 
//       ? <Button onClick={handleBridge} fullWidth>Bridge Now</Button>
//       : <Button onClick={handleApprove} fullWidth>Approve {selectedToken}</Button>;
//   };

//   // --- JSX Return ---
//   return (
//     <div className="w-full max-w-md bg-gray-800/50 rounded-2xl p-6 shadow-2xl border border-gray-700 space-y-6">
//       {!isConnected && (
//           <div className="text-center bg-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm">
//               You are in <span className="font-bold">Simulation Mode</span>. Connect wallet for live transactions.
//           </div>
//       )}
//       <div className="relative space-y-2">
//         <ChainSelector label="From" chainName={sourceChain.name} chainLogo={sourceChain.logo} />
//         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
//           <button onClick={handleSwap} className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center border-4 border-gray-800/50 hover:bg-gray-600 transition-transform hover:rotate-180 duration-300">
//             <img src={switchIcon} alt="Switch Chains" className="w-5 h-5" />
//           </button>
//         </div>
//         <ChainSelector label="To" chainName={destinationChain.name} chainLogo={destinationChain.logo} />
//       </div>
//       <TokenInput
//         amount={amount}
//         onAmountChange={setAmount}
//         selectedToken={selectedToken}
//         onTokenSelect={setSelectedToken}
//         sourceChainId={sourceChain.chainId}
//       />
//       {['approving', 'locking', 'waiting_signatures', 'releasing'].includes(appStatus) && <TransactionStatus status={appStatus} />}
//       <div className="pt-2">
//         {renderActionButton()}
//       </div>
//     </div>
//   );
// };

// export default BridgeCard;