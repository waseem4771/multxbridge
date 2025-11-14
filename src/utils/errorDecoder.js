import { ethers } from 'ethers';
import multxBridgeAbi from '../constants/abi/multxBridgeAbi.json';

/**
 * Decode contract error from revert data
 * @param {string} errorData - The error data from contract revert
 * @returns {string} - Human readable error message
 */
export const decodeContractError = (errorData) => {
  if (!errorData || typeof errorData !== 'string') {
    return null;
  }

  try {
    // Error selector is first 4 bytes (8 hex characters + 0x)
    const errorSelector = errorData.slice(0, 10);
    
    // Map error selectors to error names (calculated from keccak256 hash of error signature)
    const errorMap = {
      '0x82b42900': 'Unauthorized',
      '0x8044bb33': 'DuplicateSigner',
      '0x8baa579f': 'InvalidSignature',
      '0xe450d38c': 'TransferFailed', // Token transfer failed - check balance/approval
      '0x1f2a2005': 'ZeroAmount',
      '0xd92e233d': 'ZeroAddress',
      '0x9e87fac8': 'Paused',
      '0x57eee766': 'AlreadyProcessed',
      '0x0d415d26': 'SameChain',
      '0x8b97390c': 'InvalidSignatureCount',
      '0x682a6e7c': 'InvalidValidator',
      '0x90b8ec18': 'TransferFailed', // Alternative selector (if contract uses different signature)
    };

    const errorName = errorMap[errorSelector];
    
    if (errorName) {
      // Convert error name to readable message
      const errorMessages = {
        'TransferFailed': 'Token transfer failed. This usually means: 1) Insufficient token balance, 2) Token not approved, or 3) Token contract transfer failed. Please check your balance and approve the token first.',
        'Paused': 'Bridge is currently paused.',
        'SameChain': 'Source and destination chains cannot be the same.',
        'ZeroAmount': 'Amount must be greater than zero.',
        'ZeroAddress': 'Invalid address provided.',
        'AlreadyProcessed': 'This transaction has already been processed.',
        'InvalidSignature': 'Invalid validator signature.',
        'InvalidSignatureCount': 'Invalid number of signatures.',
        'InvalidValidator': 'Invalid validator address.',
        'Unauthorized': 'Unauthorized action.',
        'DuplicateSigner': 'Duplicate signer detected.',
      };
      
      return errorMessages[errorName] || `${errorName} error occurred.`;
    }

    return null;
  } catch (error) {
    console.error('Error decoding contract error:', error);
    return null;
  }
};

