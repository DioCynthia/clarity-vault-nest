# VaultNest

A secure vault contract for storing and managing digital assets on the Stacks blockchain.

## Features
- Create personal vaults
- Deposit and withdraw assets 
- Time-locked vaults
- Emergency recovery mechanism
- Multi-signature support

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

## Testing
Run tests using Clarinet:
```bash
clarinet test
```
