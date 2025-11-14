// // Apne assets folder se token logos import karein
// import usdtLogo from './../assets/images/usdtLogo.svg';
// // Agar aap ke paas DAI ka logo hai to use bhi import karein
// // import daiLogo from '../assets/images/dai-logo.svg';

// // Bridge contract addresses jo documentation mein di gayi hain
// const BRIDGE_CONTRACTS = {
//   11155111: '0xa772d301Ef4030037d626157B6Fbfd04282b6b7c', // Ethereum Sepolia
//   97: '0x672BFCb0617Fc2f336981a550471944A9294EECd',      // BNB Chain Testnet
// };

// // Yahan hum apne tokens ko define kar rahe hain
// export const SUPPORTED_TOKENS = [
//   {
//     symbol: 'USDT',
//     name: 'Tether USD',
//     logo: usdtLogo,
//     decimals: 18, // Farz karein (Assume) ke decimals 18 hain, asli contract se verify karein
//     addresses: {
//       // Har chain ID ke liye is token ka contract address
//       11155111: '0x...', // SEPOLIA PAR USDT TOKEN KA ADDRESS YAHAN DAALEIN
//       97: '0x...',      // BNB TESTNET PAR USDT TOKEN KA ADDRESS YAHAN DAALEIN
//     },
//   },
//   // {
//   //   symbol: 'DAI',
//   //   name: 'Dai Stablecoin',
//   //   logo: daiLogo,
//   //   decimals: 18,
//   //   addresses: {
//   //     11155111: '0x...', // SEPOLIA PAR DAI TOKEN KA ADDRESS
//   //     97: '0x...',      // BNB TESTNET PAR DAI TOKEN KA ADDRESS
//   //   },
//   // },
// ];

// // Yeh function chain ID aur token symbol ke hisab se token ka address deta hai
// export const getTokenAddress = (symbol, chainId) => {
//   const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
//   return token ? token.addresses[chainId] : undefined;
// };

// // Yeh function chain ID ke hisab se bridge ka address deta hai
// export const getBridgeAddress = (chainId) => {
//   return BRIDGE_CONTRACTS[chainId];
// };














// Apne assets folder se token logos import karein
import usdtLogo from './../assets/images/usdtLogo.svg';
// 1. DAI ka logo import/uncomment karein
import daiLogo from './../assets/images/daiLogo.svg';

// Bridge contract addresses - Deployed contracts
const BRIDGE_CONTRACTS = {
  11155111: '0xa77bD19324A9438bA0b3473AA6b4Fd834246Eec1', // Ethereum Sepolia
  97: '0x6714951EFC1ED9C703c946c48F7cD666948BBB06',      // BNB Chain Testnet
};

// Yahan hum apne tokens ko define kar rahe hain
export const SUPPORTED_TOKENS = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    logo: usdtLogo,
    decimals: 6, // USDT uses 6 decimals (not 18)
    addresses: {
      // Mock USDT token addresses
      11155111: '0x5e4724CfC90e327de28d570d38550AE4c87C1392', // Sepolia Testnet - Mock USDT
      97: '0x08DB56aB63cB3ac8921bcb1e9bE57a0A0fD91F1a',      // BNB Chain Testnet - Mock USDT
    },
  },
  // 2. DAI ke object ko uncomment karein
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logo: daiLogo,
    decimals: 18,
    addresses: {
      // ZAROORI: Yahan asli testnet addresses daalein
      11155111: '0xYourSepoliaDaiAddress',
      97: '0xYourBnbTestnetDaiAddress',
    },
  },
];

// Yeh function chain ID aur token symbol ke hisab se token ka address deta hai
export const getTokenAddress = (symbol, chainId) => {
  const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
  return token ? token.addresses[chainId] : undefined;
};

// Yeh function chain ID ke hisab se bridge ka address deta hai
export const getBridgeAddress = (chainId) => {
  return BRIDGE_CONTRACTS[chainId];
};