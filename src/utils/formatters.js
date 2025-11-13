/**
 * Wallet address ko chota karke dikhata hai (e.g., "0x123...4567")
 * @param {string} address - Poora wallet address
 * @returns {string} - Chota kiya hua address ya khali string
 */
export const shortenAddress = (address) => {
  // Agar address mojood nahi ya bohat chota hai, to khali string wapas bhej dein
  if (!address || address.length < 11) {
    return '';
  }
  
  // Address ke shuru ke 6 aur aakhir ke 4 characters dikhayein
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Future mein aap yahan aur bhi functions add kar sakte hain.
// For example:
// export const formatBigNumber = (number, decimals) => { ... };