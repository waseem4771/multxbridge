# Backend Development Guide for Mutix Bridge Validator Service

## Overview

This document provides comprehensive guidance for developing the backend validator service for the Mutix Bridge application. The frontend is fully functional but requires a backend service to collect validator signatures for token release transactions.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Requirements](#core-requirements)
3. [API Endpoints](#api-endpoints)
4. [Validator Signature Process](#validator-signature-process)
5. [Event Listening](#event-listening)
6. [Database Schema](#database-schema)
7. [Security Considerations](#security-considerations)
8. [Integration with Frontend](#integration-with-frontend)
9. [Missing Functionality](#missing-functionality)
10. [Testing Guidelines](#testing-guidelines)

---

## System Architecture

### High-Level Flow

```
User locks tokens on Source Chain
    ↓
TokensLocked event emitted
    ↓
Backend listens to event
    ↓
Backend collects validator signatures (2 out of 3 validators)
    ↓
Frontend polls backend API for signatures
    ↓
Frontend receives signatures and calls releaseTokens()
```

### Components Required

1. **Event Listener Service**: Monitors blockchain events on both supported chains
2. **Validator Service**: Manages validator keys and signature generation
3. **API Server**: RESTful API for frontend communication
4. **Database**: Stores transaction data and signature status
5. **Signature Aggregator**: Collects and validates signatures from validators

---

## Core Requirements

### 1. Supported Chains

The backend must support both chains where bridge contracts are deployed:

- **Ethereum Sepolia Testnet**
  - Chain ID: `11155111`
  - Bridge Contract: `0xa77bD19324A9438bA0b3473AA6b4Fd834246Eec1`
  - RPC URL: Configure in environment variables

- **BNB Chain Testnet**
  - Chain ID: `97`
  - Bridge Contract: `0x6714951EFC1ED9C703c946c48F7cD666948BBB06`
  - RPC URL: Configure in environment variables

### 2. Validator Configuration

- The bridge contract has **3 validators** configured
- **At least 2 validators** must sign each release transaction
- Validator private keys must be securely stored (use environment variables or secure key management)
- Validator addresses can be retrieved from the contract using `getValidators()` function

### 3. Message to Sign

Validators must sign a message containing the following parameters (in order):

```
keccak256(abi.encodePacked(
    token,        // address - Destination chain token address
    user,         // address - User address (receiver)
    amount,       // uint256 - Amount to release
    sourceChain,  // uint256 - Source chain ID
    sourceNonce,  // uint256 - Nonce from source chain
    sourceTxHash  // bytes32 - Transaction hash from source chain
))
```

**Important**: The exact message format must match what the contract expects. You may need to check the contract's `releaseTokens` function implementation to see how it reconstructs and validates the message.

### 4. Signature Format

- Each signature must be **65 bytes** (130 hex characters + '0x' prefix)
- Format: `r` (32 bytes) + `s` (32 bytes) + `v` (1 byte)
- Signatures should be returned as an array of hex strings

Example signature format:
```javascript
[
  "0x1234...abcd1c",  // Validator 1 signature (65 bytes)
  "0x5678...efgh1b"  // Validator 2 signature (65 bytes)
]
```

---

## API Endpoints

### 1. Get Signatures for Transaction

**Endpoint**: `GET /bridge/signatures/:bridgeTxHash`

**Description**: Returns validator signatures for a specific bridge transaction. The frontend polls this endpoint after tokens are locked.

**Parameters**:
- `bridgeTxHash` (path parameter): The transaction hash from the `TokensLocked` event (not the lock transaction hash)

**Response Format**:

```json
{
  "ready": true,
  "bridgeTxHash": "0x...",
  "releaseParams": {
    "token": "0x...",           // Destination chain token address
    "user": "0x...",            // User/receiver address
    "amount": "1000000000",     // Amount as string (BigNumber format)
    "sourceChain": 11155111,    // Source chain ID
    "sourceNonce": 1,           // Nonce from source chain
    "sourceTxHash": "0x...",    // Source transaction hash
    "signatures": [             // Array of validator signatures
      "0x...",
      "0x..."
    ]
  }
}
```

**Response when signatures not ready**:
```json
{
  "ready": false,
  "bridgeTxHash": "0x...",
  "message": "Waiting for validator signatures..."
}
```

**Error Response**:
```json
{
  "error": "Transaction not found",
  "bridgeTxHash": "0x..."
}
```

**Status Codes**:
- `200 OK`: Request successful (ready: true/false)
- `404 Not Found`: Transaction hash not found
- `500 Internal Server Error`: Server error

**Polling Behavior**:
- Frontend polls every **10 seconds**
- Maximum polling attempts: **3 attempts** before fallback
- Timeout: **5 minutes** total

### 2. Get User Transaction History

**Endpoint**: `GET /bridge/transactions/:userAddress`

**Description**: Returns transaction history for a specific user address.

**Parameters**:
- `userAddress` (path parameter): Ethereum address of the user

**Response Format**:
```json
{
  "transactions": [
    {
      "id": "unique-id",
      "bridgeTxHash": "0x...",
      "lockTxHash": "0x...",
      "releaseTxHash": "0x...",  // null if not released yet
      "sourceChain": 11155111,
      "destinationChain": 97,
      "token": "USDT",
      "tokenAddress": "0x...",
      "amount": "100.0",
      "user": "0x...",
      "status": "completed",  // "pending", "completed", "failed"
      "timestamp": "2024-01-15T10:30:00Z",
      "lockTimestamp": "2024-01-15T10:30:00Z",
      "releaseTimestamp": "2024-01-15T10:35:00Z"  // null if not released
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid address format
- `500 Internal Server Error`: Server error

---

## Validator Signature Process

### Step-by-Step Process

1. **Event Detection**
   - Backend listens for `TokensLocked` events on source chains
   - Event contains: `txHash`, `token`, `user`, `amount`, `targetChain`, `nonce`

2. **Transaction Storage**
   - Store transaction data in database
   - Status: `pending_signatures`

3. **Signature Collection**
   - For each pending transaction:
     - Determine destination chain from `targetChain` parameter
     - Get destination token address (may need mapping)
     - Construct message hash using parameters above
     - Request signatures from at least 2 validators
     - Validators sign the message with their private keys

4. **Signature Aggregation**
   - Collect signatures from validators
   - Verify signatures are from valid validator addresses
   - Store signatures in database
   - Update transaction status to `ready_to_release`

5. **API Response**
   - When signatures are ready, API returns them in the expected format
   - Frontend can then call `releaseTokens()` on destination chain

### Signature Generation Example (Node.js/ethers.js)

```javascript
const ethers = require('ethers');

async function generateSignature(
  validatorPrivateKey,
  token,
  user,
  amount,
  sourceChain,
  sourceNonce,
  sourceTxHash
) {
  // Create message hash
  const messageHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes32'],
      [token, user, amount, sourceChain, sourceNonce, sourceTxHash]
    )
  );

  // Sign the message hash
  const wallet = new ethers.Wallet(validatorPrivateKey);
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
  
  return signature;
}
```

**Note**: The exact message format may vary. Check the contract implementation to ensure the message hash matches what the contract expects.

---

## Event Listening

### TokensLocked Event Structure

```solidity
event TokensLocked(
    bytes32 indexed txHash,
    address indexed token,
    address indexed user,
    uint256 amount,
    uint256 targetChain,
    uint256 nonce
);
```

### Event Listener Implementation (Node.js/ethers.js)

```javascript
const ethers = require('ethers');

async function listenToLockEvents(chainId, bridgeAddress, bridgeAbi) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const bridgeContract = new ethers.Contract(bridgeAddress, bridgeAbi, provider);

  bridgeContract.on('TokensLocked', async (
    txHash,
    token,
    user,
    amount,
    targetChain,
    nonce,
    event
  ) => {
    console.log('TokensLocked event detected:', {
      txHash: txHash.toString(),
      token,
      user,
      amount: amount.toString(),
      targetChain: targetChain.toString(),
      nonce: nonce.toString(),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    });

    // Store in database and trigger signature collection
    await processLockEvent({
      bridgeTxHash: txHash.toString(),
      token,
      user,
      amount: amount.toString(),
      targetChain: targetChain.toString(),
      nonce: nonce.toString(),
      sourceChain: chainId,
      lockTxHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });
}
```

### Important Considerations

- **Re-org Handling**: Events may be reverted in case of chain reorganizations
- **Duplicate Prevention**: Check if transaction already exists before processing
- **Multiple Chains**: Run separate listeners for each supported chain
- **Error Handling**: Implement retry logic for failed event processing

---

## Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    bridge_tx_hash VARCHAR(66) UNIQUE NOT NULL,
    lock_tx_hash VARCHAR(66) NOT NULL,
    release_tx_hash VARCHAR(66),
    source_chain_id INTEGER NOT NULL,
    destination_chain_id INTEGER NOT NULL,
    token_address VARCHAR(42) NOT NULL,
    token_symbol VARCHAR(10),
    user_address VARCHAR(42) NOT NULL,
    amount VARCHAR(78) NOT NULL,  -- Store as string to preserve precision
    nonce BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,  -- 'pending_signatures', 'ready_to_release', 'completed', 'failed'
    signatures JSONB,  -- Array of signatures
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lock_timestamp TIMESTAMP,
    release_timestamp TIMESTAMP
);

CREATE INDEX idx_bridge_tx_hash ON transactions(bridge_tx_hash);
CREATE INDEX idx_user_address ON transactions(user_address);
CREATE INDEX idx_status ON transactions(status);
```

### Signatures Table (Optional - for tracking)

```sql
CREATE TABLE validator_signatures (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    validator_address VARCHAR(42) NOT NULL,
    signature VARCHAR(132) NOT NULL,  -- 0x + 130 hex chars
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Security Considerations

### 1. Private Key Management

- **NEVER** commit private keys to version control
- Use environment variables or secure key management services (AWS Secrets Manager, HashiCorp Vault, etc.)
- Consider using hardware security modules (HSM) for production

### 2. Signature Validation

- Verify signatures are from valid validator addresses before storing
- Check that at least 2 unique validators have signed
- Prevent duplicate signatures from the same validator

### 3. Rate Limiting

- Implement rate limiting on API endpoints
- Prevent abuse of polling endpoints

### 4. Input Validation

- Validate all input parameters (addresses, hashes, etc.)
- Sanitize user inputs
- Check transaction hash format (66 characters, starts with 0x)

### 5. Error Handling

- Don't expose sensitive information in error messages
- Log errors securely
- Implement proper error recovery mechanisms

---

## Integration with Frontend

### Current Frontend Implementation

The frontend is already configured to work with the backend:

**File**: `src/services/bridgeApi.js`

- Base URL: `http://localhost:3001` (configure via environment variable)
- Polling interval: 10 seconds
- Max attempts: 3
- Timeout: 5 minutes

**Expected API Response Format**:

The frontend expects the following response structure:

```javascript
{
  ready: true,
  releaseParams: {
    token: "0x...",           // Destination token address
    user: "0x...",            // Receiver address
    amount: BigNumber,        // Amount (can be string or BigNumber)
    sourceChain: 11155111,    // Source chain ID
    sourceNonce: 1,           // Nonce
    sourceTxHash: "0x...",    // Source transaction hash
    signatures: ["0x...", "0x..."]  // Array of signatures
  }
}
```

### Environment Variables

Create a `.env` file in the frontend:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Update `src/services/bridgeApi.js` to use:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

---

## Missing Functionality

### 1. Backend Service (Critical)

- **Status**: Not implemented
- **Priority**: HIGH
- **Description**: Complete backend service for validator signature collection
- **Impact**: Tokens cannot be released without real validator signatures

### 2. Transaction History Backend

- **Status**: API endpoint exists but backend not implemented
- **Priority**: MEDIUM
- **Description**: Backend needs to store and serve transaction history
- **Impact**: History page will show empty data

### 3. Token Address Mapping

- **Status**: Partially implemented
- **Priority**: MEDIUM
- **Description**: Backend needs to map source token addresses to destination token addresses
- **Current State**: Frontend has token configuration, but backend needs this mapping
- **Solution**: Create a token mapping table or use the same token configuration

### 4. Error Monitoring & Logging

- **Status**: Not implemented
- **Priority**: MEDIUM
- **Description**: Implement comprehensive error monitoring and logging
- **Recommendation**: Use services like Sentry, LogRocket, or similar

### 5. Health Check Endpoint

- **Status**: Not implemented
- **Priority**: LOW
- **Description**: Add `/health` endpoint for monitoring service health
- **Response**: `{ "status": "ok", "timestamp": "..." }`

### 6. WebSocket Support (Optional)

- **Status**: Not implemented
- **Priority**: LOW
- **Description**: Instead of polling, use WebSocket for real-time signature updates
- **Benefit**: Reduces server load and provides instant updates

### 7. Admin Dashboard (Optional)

- **Status**: Not implemented
- **Priority**: LOW
- **Description**: Dashboard for monitoring transactions, validator status, etc.

---

## Testing Guidelines

### 1. Unit Tests

- Test signature generation
- Test message hash construction
- Test API endpoint handlers
- Test database operations

### 2. Integration Tests

- Test event listening and processing
- Test signature collection from multiple validators
- Test API responses match frontend expectations

### 3. End-to-End Tests

- Test complete flow: Lock → Event → Signatures → Release
- Test error scenarios (validator offline, network issues, etc.)
- Test with both supported chains

### 4. Test Data

Use testnet addresses and contracts:
- Sepolia: Bridge `0xa77bD19324A9438bA0b3473AA6b4Fd834246Eec1`
- BNB Testnet: Bridge `0x6714951EFC1ED9C703c946c48F7cD666948BBB06`

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Validator private keys securely stored
- [ ] Database migrations run
- [ ] Event listeners running for both chains
- [ ] API server running and accessible
- [ ] Health check endpoint responding
- [ ] CORS configured for frontend domain
- [ ] Rate limiting configured
- [ ] Error logging and monitoring set up
- [ ] Backup and recovery procedures in place

---

## Additional Resources

### Contract ABIs

- Bridge Contract ABI: `src/constants/abi/multxBridgeAbi.json`
- ERC20 Token ABI: `src/constants/abi/ierc20Abi.json`

### Frontend Code References

- API Service: `src/services/bridgeApi.js`
- Bridge Card Component: `src/components/bridge/BridgeCard.jsx`
- Bridge Info Hook: `src/hooks/useBridgeInfo.js`

### Contract Addresses

**Bridge Contracts**:
- Sepolia: `0xa77bD19324A9438bA0b3473AA6b4Fd834246Eec1`
- BNB Testnet: `0x6714951EFC1ED9C703c946c48F7cD666948BBB06`

**Token Addresses** (see `src/constants/tokens.js`):
- USDT on Sepolia: `0x5e4724CfC90e327de28d570d38550AE4c87C1392`
- USDT on BNB Testnet: `0x08DB56aB63cB3ac8921bcb1e9bE57a0A0fD91F1a`

---

## Support & Questions

For questions about the frontend implementation or contract integration, refer to:
- Frontend codebase comments
- Contract ABI documentation
- This guide

---

**Last Updated**: January 2024
**Version**: 1.0

