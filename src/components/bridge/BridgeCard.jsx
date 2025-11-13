
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
import { getTokenAddress, getBridgeAddress } from './../../constants/tokens';
import useAllowance from '../../hooks/useAllowance';
import useContract from '../../hooks/useContract';
import { pollForSignatures } from './../../services/bridgeApi';

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
  const { isConnected, connectWallet, chainId, provider } = useWallet();

  // State Management (No changes here)
  const [appStatus, setAppStatus] = useState('idle');
  const [bridgeData, setBridgeData] = useState(null);
  const [sourceChain, setSourceChain] = useState(SUPPORTED_CHAINS[0]);
  const [destinationChain, setDestinationChain] = useState(SUPPORTED_CHAINS[1]);
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDT');

  // Logic (No changes in the core logic)
  const sourceTokenAddress = getTokenAddress(selectedToken, sourceChain.chainId);
  const sourceBridgeAddress = getBridgeAddress(sourceChain.chainId);
  const destBridgeAddress = getBridgeAddress(destinationChain.chainId);

  const { allowance, refreshAllowance } = useAllowance(sourceTokenAddress, sourceBridgeAddress);
  const tokenContract = useContract(sourceTokenAddress, ierc20Abi);
  const sourceBridge = useContract(sourceBridgeAddress, multxBridgeAbi.abi);
  const destBridge = useContract(destBridgeAddress, multxBridgeAbi.abi);

  const amountToBridge = (amount && !isNaN(amount)) ? ethers.utils.parseUnits(amount, 18) : ethers.BigNumber.from(0);
  const hasEnoughAllowance = allowance.gte(amountToBridge) && amountToBridge.gt(0);

  const handleSwap = () => {
    setSourceChain(destinationChain);
    setDestinationChain(sourceChain);
    setAmount('');
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
      toast.error(getReadableError(error), { id: toastId });
    } finally {
      setAppStatus('idle');
    }
  };

  const handleBridge = async () => {
    if (!sourceBridge) return toast.error('Bridge contract is not ready.');
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
      setBridgeData({ lockTxHash: tx.hash, bridgeTxHash });
      setAppStatus('waiting_signatures');
      const releaseParams = await pollForSignatures(bridgeTxHash);
      setBridgeData(prev => ({ ...prev, ...releaseParams, ...lockEvent.args }));
      setAppStatus('ready_to_release');
      toast.success('Signatures received! Ready to release.');
    } catch (error) {
      console.error("Locking failed:", error);
      toast.error(getReadableError(error), { id: toastId });
      setAppStatus('idle');
    }
  };
  
  const handleRelease = async () => {
    if (!destBridge) return toast.error('Destination bridge contract is not ready.');
    if (chainId !== destinationChain.chainId) {
      try {
        toast('Please switch your network to the destination chain.');
        await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${destinationChain.chainId.toString(16)}` }]);
      } catch (switchError) {
        toast.error(getReadableError(switchError));
      }
      return;
    }
    setAppStatus('releasing');
    const toastId = toast.loading('Please confirm the release transaction...');
    try {
      const { token, user, amount: releaseAmount, sourceChainId: srcChainId, nonce, txHash, signatures } = bridgeData;
      const tx = await destBridge.releaseTokens(token, user, releaseAmount, srcChainId, nonce, txHash, signatures);
      toast.loading('Releasing tokens on the destination chain...', { id: toastId });
      await tx.wait();
      toast.success(
        <span>Tokens Released! <a href={getExplorerLink(tx.hash, destinationChain.chainId)} target="_blank" rel="noopener noreferrer" className="underline font-bold">View Tx</a></span>,
        { id: toastId, duration: 6000 }
      );
      setAppStatus('completed');
      setAmount('');
      setBridgeData(null);
    } catch (error) {
      console.error("Release failed:", error);
      toast.error(getReadableError(error), { id: toastId });
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
    if (!amount || parseFloat(amount) <= 0) return <Button fullWidth disabled>Enter an amount</Button>;
    
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
        return hasEnoughAllowance 
          ? <Button onClick={handleBridge} className="!bg-sky-600 hover:!bg-sky-700 shadow-lg shadow-sky-600/20" fullWidth>Bridge Now</Button>
          : <Button onClick={handleApprove} className="!bg-amber-500 hover:!bg-amber-600" fullWidth>Approve {selectedToken}</Button>;
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

      <TokenInput
        amount={amount}
        onAmountChange={setAmount}
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
        sourceChainId={sourceChain.chainId}
      />

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