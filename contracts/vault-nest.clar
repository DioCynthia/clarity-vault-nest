;; VaultNest Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-vault-not-found (err u101))
(define-constant err-time-lock-active (err u102))
(define-constant err-insufficient-balance (err u103))
(define-constant err-invalid-amount (err u104))

;; Data Variables
(define-data-var next-vault-id uint u0)

;; Data Maps
(define-map vaults
  uint 
  {
    owner: principal,
    name: (string-ascii 50),
    balance: uint,
    time-lock: uint,
    created-at: uint
  }
)

;; Public Functions
(define-public (create-vault (vault-name (string-ascii 50)) (time-lock uint))
  (let
    (
      (vault-id (var-get next-vault-id))
    )
    (map-insert vaults vault-id {
      owner: tx-sender,
      name: vault-name,
      balance: u0,
      time-lock: time-lock,
      created-at: block-height
    })
    (var-set next-vault-id (+ vault-id u1))
    (ok vault-id)
  )
)

(define-public (deposit (vault-id uint) (amount uint))
  (let
    (
      (vault (unwrap! (map-get? vaults vault-id) (err err-vault-not-found)))
    )
    (asserts! (> amount u0) (err err-invalid-amount))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set vaults vault-id (merge vault {
      balance: (+ amount (get balance vault))
    }))
    (ok true)
  )
)

(define-public (withdraw (vault-id uint) (amount uint))
  (let
    (
      (vault (unwrap! (map-get? vaults vault-id) (err err-vault-not-found)))
    )
    (asserts! (is-eq tx-sender (get owner vault)) (err err-not-authorized))
    (asserts! (> amount u0) (err err-invalid-amount))
    (asserts! (>= (get balance vault) amount) (err err-insufficient-balance))
    (asserts! (can-withdraw? vault-id) (err err-time-lock-active))
    
    (try! (as-contract (stx-transfer? amount tx-sender (get owner vault))))
    (map-set vaults vault-id (merge vault {
      balance: (- (get balance vault) amount)
    }))
    (ok true)
  )
)

;; Read-only Functions
(define-read-only (get-vault (vault-id uint))
  (map-get? vaults vault-id)
)

(define-read-only (can-withdraw? (vault-id uint))
  (let
    (
      (vault (unwrap! (map-get? vaults vault-id) false))
    )
    (>= block-height (+ (get created-at vault) (get time-lock vault)))
  )
)
