// Apne assets folder se chain logos import karein
import ethLogo from './../assets/images/ethLogo.svg';
import bnbLogo from './../assets/images/bnbLogo.svg';

export const SUPPORTED_CHAINS = [
  {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org', // Example RPC URL
    logo: ethLogo,
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  {
    chainId: 97,
    name: 'BNB Testnet',
    symbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/', // Example RPC URL
    logo: bnbLogo,
    explorerUrl: 'https://testnet.bscscan.com',
  },
];

// Chain ID ke zariye chain data haasil karne ke liye ek helper object
export const CHAINS_BY_ID = SUPPORTED_CHAINS.reduce((acc, chain) => {
  acc[chain.chainId] = chain;
  return acc;
}, {});