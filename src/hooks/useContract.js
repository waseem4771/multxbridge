import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './../contexts/WalletContext';

const useContract = (address, abi) => {
  const { provider, signer } = useWallet();

  // useMemo ka istemal performance behtar karne ke liye hai.
  // Yeh contract object tabhi dobara banayega jab address, abi, provider, ya signer badlega.
  const contract = useMemo(() => {
    if (!address || !abi || !provider) {
      return null;
    }

    // Agar wallet connected hai (signer hai), to "write" contract banayein
    // Warna, sirf "read-only" contract banayein
    const providerOrSigner = signer || provider;
    
    return new ethers.Contract(address, abi, providerOrSigner);

  }, [address, abi, provider, signer]);

  return contract;
};

export default useContract;