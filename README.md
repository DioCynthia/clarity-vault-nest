# VaultNest

A secure vault contract for storing and managing digital assets on the Stacks blockchain.

## Features
- Create personal vaults
- Deposit and withdraw assets 
- Time-locked vaults
- Emergency recovery mechanism
- Multi-signature support
- Zero amount protection

## Contract Interface

### Creating a Vault
```clarity
(create-vault (vault-name (string-ascii 50)) (time-lock uint))
```

### Depositing Assets
```clarity 
(deposit (vault-id uint) (amount uint))
```

### Withdrawing Assets
```clarity
(withdraw (vault-id uint) (amount uint))
```

### Error Codes
- u100: Not authorized
- u101: Vault not found
- u102: Time lock active
- u103: Insufficient balance
- u104: Invalid amount (zero)

## Testing
Run tests using Clarinet:
```bash
clarinet test
```
