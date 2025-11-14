# Backend Quick Start Guide

## TL;DR - What Needs to Be Built

A backend service that:
1. Listens to `TokensLocked` events on blockchain
2. Collects signatures from 2 out of 3 validators
3. Provides API endpoint: `GET /bridge/signatures/:bridgeTxHash`
4. Returns signatures in format expected by frontend

---

## Essential API Endpoint

### GET /bridge/signatures/:bridgeTxHash

**Request**:
```
GET http://localhost:3001/bridge/signatures/0x1234...
```

**Response (when ready)**:
```json
{
  "ready": true,
  "releaseParams": {
    "token": "0x...",
    "user": "0x...",
    "amount": "1000000000",
    "sourceChain": 11155111,
    "sourceNonce": 1,
    "sourceTxHash": "0x...",
    "signatures": ["0x...", "0x..."]
  }
}
```

**Response (not ready)**:
```json
{
  "ready": false,
  "bridgeTxHash": "0x..."
}
```

---

## What Validators Sign

Validators sign a message hash constructed from:
- `token` (destination token address)
- `user` (receiver address)
- `amount` (amount to release)
- `sourceChain` (source chain ID)
- `sourceNonce` (nonce from source)
- `sourceTxHash` (source transaction hash)

**Message Format** (ethers.js):
```javascript
const messageHash = ethers.utils.keccak256(
  ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'uint256', 'uint256', 'bytes32'],
    [token, user, amount, sourceChain, sourceNonce, sourceTxHash]
  )
);
```

---

## Contract Addresses

**Bridge Contracts**:
- Sepolia: `0xa77bD19324A9438bA0b3473AA6b4Fd834246Eec1`
- BNB Testnet: `0x6714951EFC1ED9C703c946c48F7cD666948BBB06`

**Token Addresses** (see `src/constants/tokens.js` for full list):
- USDT Sepolia: `0x5e4724CfC90e327de28d570d38550AE4c87C1392`
- USDT BNB Testnet: `0x08DB56aB63cB3ac8921bcb1e9bE57a0A0fD91F1a`

---

## Event to Listen For

**Event Name**: `TokensLocked`

**Event Parameters**:
```solidity
event TokensLocked(
    bytes32 indexed txHash,      // This is the bridgeTxHash
    address indexed token,
    address indexed user,
    uint256 amount,
    uint256 targetChain,          // Destination chain ID
    uint256 nonce
);
```

---

## Signature Requirements

- **Minimum**: 2 out of 3 validators must sign
- **Format**: 65 bytes per signature (r + s + v)
- **Array**: Return as array of hex strings

---

## Frontend Integration

- **Base URL**: `http://localhost:3001` (configurable via env)
- **Polling**: Every 10 seconds, max 3 attempts
- **Timeout**: 5 minutes total
- **File**: `src/services/bridgeApi.js`

---

## Missing Features

1. ✅ **Backend Service** - Not implemented (CRITICAL)
2. ✅ **Transaction History API** - Endpoint exists, backend not implemented
3. ✅ **Token Address Mapping** - Backend needs source→destination mapping
4. ✅ **Error Monitoring** - Not implemented
5. ✅ **Health Check** - Not implemented

---

## Next Steps

1. Read `BACKEND_DEVELOPMENT_GUIDE.md` for complete documentation
2. Set up event listeners for both chains
3. Implement signature collection from validators
4. Create API endpoint matching frontend expectations
5. Test with frontend application

---

For detailed information, see **BACKEND_DEVELOPMENT_GUIDE.md**

