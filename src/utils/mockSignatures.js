import { ethers } from 'ethers';

/**
 * Generate mock validator signatures for testing
 * These are properly formatted 65-byte signatures that allow the flow to continue
 * Note: These are NOT real validator signatures and will NOT pass contract validation
 * They are only for UI flow testing when backend is not available
 * 
 * @param {string} bridgeTxHash - The bridge transaction hash
 * @param {number} validatorCount - Number of validator signatures needed (default: 2)
 * @returns {string[]} Array of mock signature strings (each 65 bytes)
 */
export const generateMockSignatures = (bridgeTxHash, validatorCount = 2) => {
  const signatures = [];
  
  // Generate mock signatures (each signature is 65 bytes = 130 hex characters + '0x')
  // Format: r (32 bytes) + s (32 bytes) + v (1 byte) = 65 bytes
  for (let i = 0; i < validatorCount; i++) {
    // Create deterministic mock signatures based on txHash and index
    // This ensures same txHash always gets same mock signatures for consistency
    
    // Generate r component (32 bytes)
    const rHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'uint256', 'string'],
        [bridgeTxHash, i, 'r']
      )
    );
    const r = rHash.slice(0, 66); // 32 bytes = 64 hex chars + '0x'
    
    // Generate s component (32 bytes)
    const sHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'uint256', 'string'],
        [bridgeTxHash, i, 's']
      )
    );
    const s = sHash.slice(0, 66); // 32 bytes = 64 hex chars + '0x'
    
    // v component (1 byte) - use 27 (0x1b) or 28 (0x1c), we'll use 28
    const v = '0x1c';
    
    // Combine: r (64 hex chars) + s (64 hex chars) + v (2 hex chars) = 130 hex chars + '0x' = 132 total
    const fullSignature = r + s.slice(2) + v.slice(2);
    
    // Ensure exactly 132 characters (0x + 130 hex chars)
    if (fullSignature.length === 132) {
      signatures.push(fullSignature);
    } else {
      // Fallback: create a properly formatted 65-byte signature
      const padded = '0x' + '0'.repeat(128) + '1c';
      signatures.push(padded);
    }
  }
  
  return signatures;
};

/**
 * Get mock release parameters for testing
 * @param {object} lockEventData - Data from TokensLocked event
 * @returns {object} Mock release parameters
 */
export const getMockReleaseParams = (lockEventData) => {
  const { txHash, nonce, token, user, amount, sourceChainId } = lockEventData;
  
  // Generate mock signatures
  const signatures = generateMockSignatures(txHash, 2);
  
  return {
    token,
    user,
    amount,
    sourceChain: sourceChainId,
    sourceNonce: nonce,
    sourceTxHash: txHash,
    signatures,
  };
};

