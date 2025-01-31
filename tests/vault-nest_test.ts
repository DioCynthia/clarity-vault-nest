import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can create new vault",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("vault-nest", "create-vault", 
        [types.ascii("My Vault"), types.uint(10)], 
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectOk(), "u0");
  },
});

Clarinet.test({
  name: "Can deposit and withdraw from vault",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("vault-nest", "create-vault", 
        [types.ascii("Test Vault"), types.uint(0)], 
        wallet_1.address
      ),
      Tx.contractCall("vault-nest", "deposit",
        [types.uint(0), types.uint(1000000)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[1].result.expectOk(), true);
    
    block = chain.mineBlock([
      Tx.contractCall("vault-nest", "withdraw",
        [types.uint(0), types.uint(500000)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectOk(), true);
  },
});

Clarinet.test({
  name: "Respects time lock on withdrawals",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("vault-nest", "create-vault", 
        [types.ascii("Locked Vault"), types.uint(10)], 
        wallet_1.address
      ),
      Tx.contractCall("vault-nest", "deposit",
        [types.uint(0), types.uint(1000000)],
        wallet_1.address
      ),
      Tx.contractCall("vault-nest", "withdraw",
        [types.uint(0), types.uint(500000)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[2].result.expectErr(), "u102");
  },
});

Clarinet.test({
  name: "Cannot deposit or withdraw zero amounts",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("vault-nest", "create-vault", 
        [types.ascii("Zero Test Vault"), types.uint(0)], 
        wallet_1.address
      ),
      Tx.contractCall("vault-nest", "deposit",
        [types.uint(0), types.uint(0)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[1].result.expectErr(), "u104");
    
    block = chain.mineBlock([
      Tx.contractCall("vault-nest", "withdraw",
        [types.uint(0), types.uint(0)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectErr(), "u104");
  },
});
