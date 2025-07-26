---
tags:
  - "#database"
  - "#security"
  - "#atomic-operations"
  - "#transaction-composition"
  - "#financial-operations"
  - "#transfer-patterns"
  - "#rate-limiting"
  - "#financial-database"
  - "#transaction-processing"
  - "#data-consistency"
  - "#ledger-system"
  - "#balance-management"
---
# Balance Bounds

# [Balance\ Bounds](https://docs.tigerbeetle.com/coding/recipes/balance-bounds/#balance-bounds)

It is easy to limit an account's balance using either [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
or [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits).

What if you want an account's balance to stay between an upper and a<br/>
lower bound?

This is possible to check atomically using a set of linked transfers.<br/>
(Note: with the `must_not_exceed` flag invariants, an account<br/>
is guaranteed to never violate those invariants. This maximum balance<br/>
approach must be enforced per-transfer–it is possible to exceed the<br/>
limit simply by not enforcing it for a particular transfer.)

## [Preconditions](https://docs.tigerbeetle.com/coding/recipes/balance-bounds/#preconditions)

1. Target Account Should Have a Limited Balance

The account whose balance you want to bound should have one of these<br/>
flags set:

- [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
  for accounts with [credit\\<br/>
  balances](https://docs.tigerbeetle.com/coding/data-modeling#credit-balances)
- [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
  for accounts with [debit\\<br/>
  balances](https://docs.tigerbeetle.com/coding/data-modeling#debit-balances)

2. Create a Control Account with the Opposite Limit

There must also be a designated control account.

As you can see below, this account will never actually take control<br/>
of the target account's funds, but we will set up simultaneous transfers<br/>
in and out of the control account to apply the limit.

This account must have the opposite limit applied as the target<br/>
account:

- [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
  if the target account has a [credit balance](https://docs.tigerbeetle.com/coding/data-modeling#credit-balances)
- [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
  if the target account has a [debit balance](https://docs.tigerbeetle.com/coding/data-modeling#debit-balances)

3. Create an Operator Account

The operator account will be used to fund the Control Account.

## [Executing a Transfer with a Balance Bounds Check](https://docs.tigerbeetle.com/coding/recipes/balance-bounds/#executing-a-transfer-with-a-balance-bounds-check)

This consists of 5 [linked\\<br/>
transfers](https://docs.tigerbeetle.com/coding/linked-events).

We will refer to two amounts:

- The **limit amount** is upper bound we want to maintain<br/>
  on the target account's balance.
- The **transfer amount** is the amount we want to<br/>
  transfer if and only if the target account's balance after a successful<br/>
  transfer would be within the bounds.

### [If the\ Target Account Has a Credit Balance](https://docs.tigerbeetle.com/coding/recipes/balance-bounds/#if-the-target-account-has-a-credit-balance)

In this case, we are keeping the Destination Account's balance<br/>
between the bounds.

| Transfer | Debit Account | Credit Account | Amount | Pending ID | Flags (Note: `|` sets multiple flags) |<br/>
| --- | --- | --- | --- | --- | --- |<br/>
| 1 | Source | Destination | Transfer | `0` | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked) |<br/>
| 2 | Control | Operator | Limit | `0` | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked) |<br/>
| 3 | Destination | Control | `AMOUNT_MAX` | `0` | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)<br>\| [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)<br>\| [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending) |<br/>
| 4 | `0` | `0` | `0` | `3`\* | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)<br>\| [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) |<br/>
| 5 | Operator | Control | Limit | `0` | `0` |

\*This must be set to the transfer ID of the pending transfer (in this<br/>
example, it is transfer 3).

### [If the\ Target Account Has a Debit Balance](https://docs.tigerbeetle.com/coding/recipes/balance-bounds/#if-the-target-account-has-a-debit-balance)

In this case, we are keeping the Destination Account's balance<br/>
between the bounds.

| Transfer | Debit Account | Credit Account | Amount | Pending ID | Flags (Note `|` sets multiple flags) |<br/>
| --- | --- | --- | --- | --- | --- |<br/>
| 1 | Destination | Source | Transfer | `0` | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked) |<br/>
| 2 | Operator | Control | Limit | `0` | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked) |<br/>
| 3 | Control | Destination | `AMOUNT_MAX` | `0` | [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)<br>\| [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)<br>\| [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked) |<br/>
| 4 | `0` | `0` | `0` | `3`\* | [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)<br>\| [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked) |<br/>
| 5 | Control | Operator | Limit | `0` | `0` |

\*This must be set to the transfer ID of the pending transfer (in this<br/>
example, it is transfer 3).

### [Understanding the\ Mechanism](https://docs.tigerbeetle.com/coding/recipes/balance-bounds/#understanding-the-mechanism)

Each of the 5 transfers is [linked](https://docs.tigerbeetle.com/coding/linked-events)<br/>
so that all of them will succeed or all of them will fail.

The first transfer is the one we actually want to send.

The second transfer sets the Control Account's balance to the upper<br/>
bound we want to impose.

The third transfer uses a [`balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)<br/>
or [`balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)<br/>
to transfer the Destination Account's net credit balance or net debit<br/>
balance, respectively, to the Control Account. This transfer will fail<br/>
if the first transfer would put the Destination Account's balance above<br/>
the upper bound.

The third transfer is also a pending transfer, so it won't actually<br/>
transfer the Destination Account's funds, even if it succeeds.

If everything to this point succeeds, the fourth and fifth transfers<br/>
simply undo the effects of the second and third transfers. The fourth<br/>
transfer voids the pending transfer. And the fifth transfer resets the<br/>
Control Account's net balance to zero.

#### Balance-Conditional Transfers

# [Balance-Conditional\ Transfers](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#balance-conditional-transfers)

In some use cases, you may want to execute a transfer if and only if<br/>
an account has at least a certain balance.

It would be unsafe to check an account's balance using the [`lookup_accounts`](https://docs.tigerbeetle.com/reference/requests/lookup_accounts)<br/>
and then perform the transfer, because these requests are not be atomic<br/>
and the account's balance may change between the lookup and the<br/>
transfer.

You can atomically run a check against an account's balance before<br/>
executing a transfer by using a control or temporary account and linked<br/>
transfers.

## [Preconditions](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#preconditions)

### [1.\ Target Account Must Have a Limited Balance](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#1-target-account-must-have-a-limited-balance)

The account for whom you want to do the balance check must have one<br/>
of these flags set:

- [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
  for accounts with [credit\\<br/>
  balances](https://docs.tigerbeetle.com/coding/data-modeling#credit-balances)
- [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
  for accounts with [debit\\<br/>
  balances](https://docs.tigerbeetle.com/coding/data-modeling#debit-balances)

### [2\. Create a Control\ Account](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#2-create-a-control-account)

There must also be a designated control account. As you can see<br/>
below, this account will never actually take control of the target<br/>
account's funds, but we will set up simultaneous transfers in and out of<br/>
the control account.

## [Executing a Balance-Conditional Transfer](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#executing-a-balance-conditional-transfer)

The balance-conditional transfer consists of 3 [linked transfers](https://docs.tigerbeetle.com/coding/linked-events).

We will refer to two amounts:

- The **threshold amount** is the minimum amount the<br/>
  target account should have in order to execute the transfer.
- The **transfer amount** is the amount we want to<br/>
  transfer if and only if the target account's balance meets the<br/>
  threshold.

### [If the\ Source Account Has a Credit Balance](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#if-the-source-account-has-a-credit-balance)

| Transfer | Debit Account | Credit Account | Amount    | Pending Id | Flags                                                                                                                                                                                   |
| -------- | ------------- | -------------- | --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Source        | Control        | Threshold | -          | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)                             |
| 2        | -             | -              | -         | 1          | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) |
| 3        | Source        | Destination    | Transfer  | -          | N/A                                                                                                                                                                                     |

### [If the\ Source Account Has a Debit Balance](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#if-the-source-account-has-a-debit-balance)

| Transfer | Debit Account | Credit Account | Amount    | Pending Id | Flags                                                                                                                                                                                   |
| -------- | ------------- | -------------- | --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Control       | Source         | Threshold | -          | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)                             |
| 2        | -             | -              | -         | 1          | [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) |
| 3        | Destination   | Source         | Transfer  | -          | N/A                                                                                                                                                                                     |

### [Understanding the\ Mechanism](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers/#understanding-the-mechanism)

Each of the 3 transfers is linked, meaning they will all succeed or<br/>
fail together.

The first transfer attempts to transfer the threshold amount to the<br/>
control account. If this transfer would cause the source account's net<br/>
balance to go below zero, the account's balance limit flag would ensure<br/>
that the first transfer fails. If the first transfer fails, the other<br/>
two linked transfers would also fail.

If the first transfer succeeds, it means that the source account did<br/>
have the threshold balance. In this case, the second transfer cancels<br/>
the first transfer (returning the threshold amount to the source<br/>
account). Then, the third transfer would execute the desired transfer to<br/>
the ultimate destination account.

Note that in the tables above, we do the balance check on the source<br/>
account. The balance check could also be applied to the destination<br/>
account instead.

#### Balance-Invariant Transfers

# [Balance-invariant\ Transfers](https://docs.tigerbeetle.com/coding/recipes/balance-invariant-transfers/#balance-invariant-transfers)

For some accounts, it may be useful to enforce [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
or [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
balance invariants for only a subset of all transfers, rather than all<br/>
transfers.

## [Per-transfer\ `credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/coding/recipes/balance-invariant-transfers/#per-transfer-credits_must_not_exceed_debits)

This recipe requires three accounts:

1. The **source** account, to debit.
2. The **destination** account, to credit. (With<br/>
   _neither_ [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
   nor [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
   set, since in this recipe we are only enforcing the invariant on a<br/>
   per-transfer basis.
3. The **control** account, to test the balance invariant.<br/>
   The control account should have [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
   set.

| Id  | Debit Account | Credit Account | Amount | Pending Id | Flags                                                                                                                                                                                                                                               |
| --- | ------------- | -------------- | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Source        | Destination    | 123    | -          | [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)                                                                                                                                                                             |
| 2   | Destination   | Control        | 1      | -          | [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending),<br>[`balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit) |
| 3   | -             | -              | 0      | 2          | [`void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)                                                                                                                                               |

When the destination account's final credits do not exceed its<br/>
debits, the chain will succeed. When the destination account's final<br/>
credits exceeds its debits, transfer `2` will fail with<br/>
`exceeds_debits`.

### Close Account

# [Close\ Account](https://docs.tigerbeetle.com/coding/recipes/close-account/#close-account)

In accounting, a _closing entry_ calculates the net debit or<br/>
credit balance for an account and then credits or debits this balance<br/>
respectively, to zero the account's balance and move the balance to<br/>
another account.

Additionally, it may be desirable to forbid further transfers on this<br/>
account (i.e. at the end of an accounting period, upon account<br/>
termination, or even temporarily freezing the account for audit<br/>
purposes.

## [Example](https://docs.tigerbeetle.com/coding/recipes/close-account/#example)

Given a set of accounts:

| Account | Debits Pending | Debits Posted | Credits Pending | Credits Posted | Flags                                                                                                                  |
| ------- | -------------- | ------------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `A`     | 0              | 10            | 0               | 20             | [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits) |
| `B`     | 0              | 30            | 0               | 5              | [`credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits) |
| `C`     | 0              | 0             | 0               | 0              |                                                                                                                        |

The "closing entries" for accounts `A` and `B`<br/>
are expressed as _linked chains_, so they either succeed or fail<br/>
atomically.

- Account `A`: the linked transfers are `T1`<br/>
  and `T2`.

- Account `B`: the linked transfers are `T3`<br/>
  and `T4`.

- Account `C`: is the _control account_ and will<br/>
  not be closed.

| Transfer | Debit Account | Credit Account | Amount       | Amount (recorded) | Flags                                                                                                                                                                 |
| -------- | ------------- | -------------- | ------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `T1`     | `A`           | `C`            | `AMOUNT_MAX` | 10                | [`balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit), [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)    |
| `T2`     | `A`           | `C`            | 0            | 0                 | [`closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit),<br>[`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)   |
| `T3`     | `C`           | `B`            | `AMOUNT_MAX` | 25                | [`balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit), [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)  |
| `T4`     | `C`           | `B`            | 0            | 0                 | [`closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit),<br>[`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending) |

- `T1` and `T3` are _balancing_<br/>
  _transfers_ with `AMOUNT_MAX` as the<br/>
  `Transfer.amount` so that the application does not need to<br/>
  know (or query) the balance prior to closing the account.

The stored transfer's `amount` will be set to the actual<br/>
amount transferred.

- `T2` and `T4` are _closing_<br/>
  _transfers_ that will cause the respective account to be closed.

The closing transfer must be also a _pending transfer_ so the<br/>
action can be reversible.

After committing these transfers, `A` and `B`<br/>
are closed with net balance zero, and will reject any further<br/>
transfers.

| Account | Debits Pending | Debits Posted | Credits Pending | Credits Posted | Flags                                                                                                                                                                                             |
| ------- | -------------- | ------------- | --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `A`     | 0              | 20            | 0               | 20             | [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits),<br>[`closed`](https://docs.tigerbeetle.com/reference/account#flagsclosed) |
| `B`     | 0              | 30            | 0               | 30             | [`credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits),<br>[`closed`](https://docs.tigerbeetle.com/reference/account#flagsclosed) |
| `C`     | 0              | 25            | 0               | 10             |                                                                                                                                                                                                   |

To re-open the closed account, the _pending closing transfer_<br/>
can be _voided_, reverting the closing action (but not reverting<br/>
the net balance):

| Transfer | Debit Account | Credit Account | Amount | Pending Transfer | Flags                                                                                                 |
| -------- | ------------- | -------------- | ------ | ---------------- | ----------------------------------------------------------------------------------------------------- |
| `T5`     | `A`           | `C`            | 0      | `T2`             | [`void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) |
| `T6`     | `C`           | `B`            | 0      | `T4`             | [`void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) |

After committing these transfers, `A` and `B`<br/>
are re-opened and can accept transfers again:

| Account | Debits Pending | Debits Posted | Credits Pending | Credits Posted | Flags                                                                                                                  |
| ------- | -------------- | ------------- | --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `A`     | 0              | 20            | 0               | 20             | [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits) |
| `B`     | 0              | 30            | 0               | 30             | [`credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits) |
| `C`     | 0              | 25            | 0               | 10             |                                                                                                                        |

### Correcting Transfers

# [Correcting Transfers](https://docs.tigerbeetle.com/coding/recipes/correcting-transfers/#correcting-transfers)

[`Transfer` s](https://docs.tigerbeetle.com/reference/transfer) in<br/>
TigerBeetle are immutable, so once they are created they cannot be<br/>
modified or deleted.

Immutability is useful for creating an auditable log of all of the<br/>
business events, but it does raise the question of what to do when a<br/>
transfer was made in error or some detail such as the amount was<br/>
incorrect.

## [Always Add More Transfers](https://docs.tigerbeetle.com/coding/recipes/correcting-transfers/#always-add-more-transfers)

Correcting transfers or entries in TigerBeetle are handled with more<br/>
transfers to reverse or adjust the effects of the previous<br/>
transfer(s).

This is important because adding transfers as opposed to deleting or<br/>
modifying incorrect ones adds more information to the history. The log<br/>
of events includes the original error, when it took place, as well as<br/>
any attempts to correct the record and when they took place. A<br/>
correcting entry might even be wrong, in which case it itself can be<br/>
corrected with yet another transfer. All of these events form a timeline<br/>
of the particular business event, which is stored permanently.

Another way to put this is that TigerBeetle is the lowest layer of<br/>
the accounting stack and represents the finest-resolution data that is<br/>
stored. At a higher-level reporting layer, you can "downsample" the data<br/>
to show only the corrected transfer event. However, it would not be<br/>
possible to go back if the original record were modified or deleted.

Two specific recommendations for correcting transfers are:

1. You may want to have a [`Transfer.code`](https://docs.tigerbeetle.com/reference/transfer#code)<br/>
   that indicates a given transfer is a correction, or you may want<br/>
   multiple codes where each one represents a different reason why the<br/>
   correction has taken place.
2. If you use the [`Transfer.user_data_128`](https://docs.tigerbeetle.com/reference/transfer#user_data_128)<br/>
   to store an ID that links multiple transfers within TigerBeetle or<br/>
   points to a [record in an external\\<br/>
   database](https://docs.tigerbeetle.com/coding/system-architecture), you may want to use the same `user_data_128`<br/>
   field on the correction transfer(s), even if they happen at a later<br/>
   point.

### [Example](https://docs.tigerbeetle.com/coding/recipes/correcting-transfers/#example)

Let's say you had a couple of transfers, from account `A`<br/>
to accounts `Y` and `Z`:

| Ledger | Debit Account | Credit Account | Amount | `code` | `user_data_128` | `flags.linked` |
| ------ | ------------- | -------------- | ------ | ------ | --------------- | -------------- |
| USD    | `A`           | `X`            | 10000  | 600    | 123456          | true           |
| USD    | `A`           | `Y`            | 50     | 9000   | 123456          | false          |

Now, let's say we realized the amount was wrong and we need to adjust<br/>
both of the amounts by 10%. We would submit two<br/>
**additional** transfers going in the opposite<br/>
direction:

| Ledger | Debit Account | Credit Account | Amount | `code` | `user_data_128` | `flags.linked` |
| ------ | ------------- | -------------- | ------ | ------ | --------------- | -------------- |
| USD    | `X`           | `A`            | 1000   | 10000  | 123456          | true           |
| USD    | `Y`           | `A`            | 5      | 10000  | 123456          | false          |

Note that the codes used here don't have any actual meaning, but you<br/>
would want to [enumerate your business\\<br/>
events](https://docs.tigerbeetle.com/coding/data-modeling#code) and map each to a numeric code value, including the initial<br/>
reasons for transfers and the reasons they might be corrected.

#### Currency Exchange

# [Currency Exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange/#currency-exchange)

Some applications require multiple currencies. For example, a bank<br/>
may hold balances in many different currencies. If a single logical<br/>
entity holds multiple currencies, each currency must be held in a<br/>
separate TigerBeetle `Account`. (Normalizing to a single<br/>
currency at the application level should be avoided because exchange<br/>
rates fluctuate).

Currency exchange is a trade of one type of currency (denoted by the<br/>
`ledger`) for another, facilitated by an entity called the<br/>
_liquidity provider_.

## [Data\ Modeling](https://docs.tigerbeetle.com/coding/recipes/currency-exchange/#data-modeling)

Distinct [`ledger`](https://docs.tigerbeetle.com/reference/account#ledger) values<br/>
denote different currencies (or other asset types). Transfers between<br/>
pairs of accounts with different `ledger` s are [not\\<br/>
permitted](https://docs.tigerbeetle.com/reference/requests/create_transfers#accounts_must_have_the_same_ledger).

Instead, currency exchange is implemented by creating two [atomically linked](https://docs.tigerbeetle.com/reference/transfer#flagslinked)<br/>
different-ledger transfers between two pairs of same-ledger<br/>
accounts.

A simple currency exchange involves four accounts:

- A _source account_ `A₁`, on ledger<br/>
  `1`.
- A _destination account_ `A₂`, on ledger<br/>
  `2`.
- A _source liquidity account_ `L₁`, on ledger<br/>
  `1`.
- A _destination liquidity account_ `L₂`, on ledger<br/>
  `2`.

and two linked transfers:

- A transfer `T₁` from the _source account_ to the<br/>
  _source liquidity account_.
- A transfer `T₂` from the _destination liquidity_<br/>
  _account_ to the _destination account_.

The transfer amounts vary according to the exchange rate.

- Both liquidity accounts belong to the liquidity provider (e.g. a<br/>
  bank or exchange).
- The source and destination accounts may belong to the same entity as<br/>
  one another, or different entities, depending on the use case.

### [Example](https://docs.tigerbeetle.com/coding/recipes/currency-exchange/#example)

Consider sending `$100.00` from account `A₁`<br/>
(denominated in USD) to account `A₂` (denominated in INR).<br/>
Assuming an exchange rate of `$1.00 = ₹82.42135`,<br/>
`$100.00 = ₹8242.135`:

| Ledger | Debit Account | Credit Account | Amount  | `flags.linked` |
| ------ | ------------- | -------------- | ------- | -------------- |
| USD    | `A₁`          | `L₁`           | 10000   | true           |
| INR    | `L₂`          | `A₂`           | 8242135 | false          |

- Amounts are [represented\\<br/>
  as integers](https://docs.tigerbeetle.com/coding/data-modeling#fractional-amounts-and-asset-scale).
- Because both liquidity accounts belong to the same entity, the<br/>
  entity does not lose money on the transaction.
  - If the exchange rate is precise, the entity breaks even.
  - If the exchange rate is not precise, the application should round in<br/>
    favor of the liquidity account to deter arbitrage.
- Because the two transfers are linked together, they will either both<br/>
  succeed or both fail.

## [Spread](https://docs.tigerbeetle.com/coding/recipes/currency-exchange/#spread)

In the prior example, the liquidity provider breaks even. A fee (i.e.<br/>
spread) can be included in the `linked` chain as a separate<br/>
transfer from the source account to the source liquidity account<br/>
(`A₁` to `L₁`).

This is preferable to simply modifying the exchange rate in the<br/>
liquidity provider's favor because it implicitly records the exchange<br/>
rate and spread at the time of the exchange—information that cannot be<br/>
derived if the two are combined.

### [Example](https://docs.tigerbeetle.com/coding/recipes/currency-exchange/#example-1)

This depicts the same scenario as the prior example, except the<br/>
liquidity provider charges a `$0.10` fee for the<br/>
transaction.

| Ledger | Debit Account | Credit Account | Amount  | `flags.linked` |
| ------ | ------------- | -------------- | ------- | -------------- |
| USD    | `A₁`          | `L₁`           | 10000   | true           |
| USD    | `A₁`          | `L₁`           | 10      | true           |
| INR    | `L₂`          | `A₂`           | 8242135 | false          |

#### Multi-Scope Transfers

# [Multi-Debit,\ Multi-Credit Transfers](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers/#multi-debit-multi-credit-transfers)

TigerBeetle is designed for maximum performance. In order to keep it<br/>
lean, the database only supports simple transfers with a single debit<br/>
and a single credit.

However, you'll probably run into cases where you want transactions<br/>
with multiple debits and/or credits. For example, you might have a<br/>
transfer where you want to extract fees and/or taxes.

Read on to see how to implement one-to-many and many-to-many<br/>
transfers!

> Note that all of these examples use the [Linked Transfers flag\\<br/>
> ( `flags.linked`)](https://docs.tigerbeetle.com/reference/transfer#flagslinked) to ensure that all of the transfers<br/>
> succeed or fail together.

## [One-to-Many Transfers](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers/#one-to-many-transfers)

Transactions that involve multiple debits and a single credit OR a<br/>
single debit and multiple credits are relatively straightforward.

You can use multiple linked transfers as depicted below.

### [Single Debit,\ Multiple Credits](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers/#single-debit-multiple-credits)

This example debits a single account and credits multiple accounts.<br/>
It uses the following accounts:

- A _source account_ `A`, on the `USD`<br/>
  ledger.
- Three _destination accounts_ `X`, `Y`,<br/>
  and `Z`, on the `USD` ledger.

| Ledger | Debit Account | Credit Account | Amount | `flags.linked` |
| ------ | ------------- | -------------- | ------ | -------------- |
| USD    | `A`           | `X`            | 10000  | true           |
| USD    | `A`           | `Y`            | 50     | true           |
| USD    | `A`           | `Z`            | 10     | false          |

### [Multiple Debits,\ Single Credit](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers/#multiple-debits-single-credit)

This example debits multiple accounts and credits a single account.<br/>
It uses the following accounts:

- Three _source accounts_ `A`, `B`, and<br/>
  `C` on the `USD` ledger.
- A _destination account_ `X` on the<br/>
  `USD` ledger.

| Ledger | Debit Account | Credit Account | Amount | `flags.linked` |
| ------ | ------------- | -------------- | ------ | -------------- |
| USD    | `A`           | `X`            | 10000  | true           |
| USD    | `B`           | `X`            | 50     | true           |
| USD    | `C`           | `X`            | 10     | false          |

### [Multiple Debits, Single Credit, Balancing debits](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers/#multiple-debits-single-credit-balancing-debits)

This example debits multiple accounts and credits a single account.<br/>
The total amount to transfer to the credit account is known (in this<br/>
case, `100`), but the balances of the individual debit<br/>
accounts are not known. That is, each debit account should contribute as<br/>
much as possible (in order of precedence) up to the target, cumulative<br/>
transfer amount.

It uses the following accounts:

- Three _source accounts_ `A`, `B`, and<br/>
  `C`, with [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits).
- A _destination account_ `X`.
- A control account `LIMIT`, with [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits).
- A control account `SETUP`, for setting up the<br/>
  `LIMIT` account.

| Id  | Ledger | Debit Account | Credit Account | Amount | Flags                                                                                                                                                                                                                                                                 |
| --- | ------ | ------------- | -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | USD    | `SETUP`       | `LIMIT`        | 100    | [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)                                                                                                                                                                                               |
| 2   | USD    | `A`           | `SETUP`        | 100    | [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit),<br>[`balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit) |
| 3   | USD    | `B`           | `SETUP`        | 100    | [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit),<br>[`balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit) |
| 4   | USD    | `C`           | `SETUP`        | 100    | [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked),<br>[`balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit),<br>[`balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit) |
| 5   | USD    | `SETUP`       | `X`            | 100    | [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)                                                                                                                                                                                               |
| 6   | USD    | `LIMIT`       | `SETUP`        | -0     | [`balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)                                                                                                                                                                           |

If the cumulative [credit balance](https://docs.tigerbeetle.com/coding/data-modeling#credit-balances) of<br/>
`A + B + C` is less than `100`, the chain will<br/>
fail (transfer `6` will return<br/>
`exceeds_credits`).

## [Many-to-Many Transfers](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers/#many-to-many-transfers)

Transactions with multiple debits and multiple credits are a bit more<br/>
involved (but you got this!).

This is where the accounting concept of a Control Account comes in<br/>
handy. We can use this as an intermediary account, as illustrated<br/>
below.

In this example, we'll use the following accounts:

- Two _source accounts_ `A` and `B` on<br/>
  the `USD` ledger.
- Three _destination accounts_ `X`, `Y`,<br/>
  and `Z`, on the `USD` ledger.
- A _compound entry control account_ `Control` on<br/>
  the `USD` ledger.

| Ledger | Debit Account | Credit Account | Amount | `flags.linked` |
| ------ | ------------- | -------------- | ------ | -------------- |
| USD    | `A`           | `Control`      | 10000  | true           |
| USD    | `B`           | `Control`      | 50     | true           |
| USD    | `Control`     | `X`            | 9000   | true           |
| USD    | `Control`     | `Y`            | 1000   | true           |
| USD    | `Control`     | `Z`            | 50     | false          |

Here, we use two transfers to debit accounts `A` and<br/>
`B` and credit the `Control` account, and another<br/>
three transfers to credit accounts `X`, `Y`, and<br/>
`Z`.

If you looked closely at this example, you may have noticed that we<br/>
could have debited `B` and credited `Z` directly<br/>
because the amounts happened to line up. That is true!

For a little more extreme performance, you _might_ consider<br/>
implementing logic to circumvent the control account where possible, to<br/>
reduce the number of transfers to implement a compound journal<br/>
entry.

However, if you're just getting started, you can avoid premature<br/>
optimizations (we've all been there!). You may find it easier to program<br/>
these compound journal entries _always_ using a control account–<br/>
and you can then come back to squeeze this performance out later!

### Rate Limiting

# [Rate\ Limiting](https://docs.tigerbeetle.com/coding/recipes/rate-limiting/#rate-limiting)

TigerBeetle can be used to account for non-financial resources.

In this recipe, we will show you how to use it to implement rate<br/>
limiting using the [leaky bucket\\<br/>
algorithm](https://en.wikipedia.org/wiki/Leaky_bucket) based on the user request rate, bandwidth, and money.

## [Mechanism](https://docs.tigerbeetle.com/coding/recipes/rate-limiting/#mechanism)

For each type of resource we want to limit, we will have a ledger<br/>
specifically for that resource. On that ledger, we have an operator<br/>
account and an account for each user. Each user's account will have a<br/>
balance limit applied.

To set up the rate limiting system, we will first transfer the<br/>
resource limit amount to each of the users. For each user request, we<br/>
will then create a [pending\\<br/>
transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers#reserve-funds-pending-transfer) with a [timeout](https://docs.tigerbeetle.com/coding/two-phase-transfers#expire-pending-transfer). We<br/>
will never post or void these transfers, but will instead let them<br/>
expire.

Since each account's "balance" is limited, we cannot create pending<br/>
transfers that would exceed the rate limit. However, when each pending<br/>
transfer expires, it automatically replenishes the user's balance.

## [Request Rate Limiting](https://docs.tigerbeetle.com/coding/recipes/rate-limiting/#request-rate-limiting)

Let's say we want to limit each user to 10 requests per minute.

We need our user account to have a limited balance.

| Ledger       | Account  | Flags                                                                                                                  |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Request Rate | Operator | `0`                                                                                                                    |
| Request Rate | User     | [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits) |

We'll first transfer 10 units from the operator to the user.

| Transfer | Ledger       | Debit Account | Credit Account | Amount |
| -------- | ------------ | ------------- | -------------- | ------ |
| 1        | Request Rate | Operator      | User           | 10     |

Then, for each incoming request, we will create a pending transfer<br/>
for 1 unit back to the operator from the user:

| Transfer | Ledger       | Debit Account | Credit Account | Amount | Timeout | Flags                                                                     |
| -------- | ------------ | ------------- | -------------- | ------ | ------- | ------------------------------------------------------------------------- |
| 2-N      | Request Rate | User          | Operator       | 1      | 60      | [`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending) |

Note that we use a timeout of 60 (seconds), because we wanted to<br/>
limit each user to 10 requests _per minute_.

That's it! Each of these transfers will "reserve" some of the user's<br/>
balance and then replenish the balance after they expire.

## [Bandwidth Limiting](https://docs.tigerbeetle.com/coding/recipes/rate-limiting/#bandwidth-limiting)

To limit user requests based on bandwidth as opposed to request rate,<br/>
we can apply the same technique but use amounts that represent the<br/>
request size.

Let's say we wanted to limit each user to 10 MB (10,000,000 bytes)<br/>
per minute.

Our account setup is the same as before:

| Ledger    | Account  | Flags                                                                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Bandwidth | Operator | 0                                                                                                                      |
| Bandwidth | User     | [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits) |

Now, we'll transfer 10,000,000 units (bytes in this case) from the<br/>
operator to the user:

| Transfer | Ledger    | Debit Account | Credit Account | Amount   |
| -------- | --------- | ------------- | -------------- | -------- |
| 1        | Bandwidth | Operator      | User           | 10000000 |

For each incoming request, we'll create a pending transfer where the<br/>
amount is equal to the request size:

| Transfer | Ledger    | Debit Account | Credit Account | Amount       | Timeout | Flags                                                                     |
| -------- | --------- | ------------- | -------------- | ------------ | ------- | ------------------------------------------------------------------------- |
| 2-N      | Bandwidth | User          | Operator       | Request Size | 60      | [`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending) |

We're again using a timeout of 60 seconds, but you could adjust this<br/>
to be whatever time window you want to use to limit requests.

## [Transfer Amount Limiting](https://docs.tigerbeetle.com/coding/recipes/rate-limiting/#transfer-amount-limiting)

Now, let's say you wanted to limit each account to transferring no<br/>
more than a certain amount of money per time window. We can do that<br/>
using 2 ledgers and linked transfers.

| Ledger        | Account  | Flags                                                                                                                  |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Rate Limiting | Operator | 0                                                                                                                      |
| Rate Limiting | User     | [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits) |
| USD           | Operator | 0                                                                                                                      |
| USD           | User     | [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits) |

Let's say we wanted to limit each account to sending no more than<br/>
1000 USD per day.

To set up, we transfer 1000 from the Operator to the User on the Rate<br/>
Limiting ledger:

| Transfer | Ledger        | Debit Account | Credit Account | Amount |
| -------- | ------------- | ------------- | -------------- | ------ |
| 1        | Rate Limiting | Operator      | User           | 1000   |

For each transfer the user wants to do, we will create 2 transfers<br/>
that are [linked](https://docs.tigerbeetle.com/coding/linked-events):

| Transfer | Ledger | Debit Account | Credit Account | Amount | Timeout | Flags (Note `|` sets multiple<br>flags) |<br/>
| --- | --- | --- | --- | --- | --- | --- |<br/>
| 2N | Rate Limiting | User | Operator | Transfer Amount | 86400 | [`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)<br>\| [`linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked) |<br/>
| 2N + 1 | USD | User | Destination | Transfer Amount | 0 | 0 |

Note that we are using a timeout of 86400 seconds, because this is<br/>
the number of seconds in a day.

These are linked such that if the first transfer fails, because the<br/>
user has already transferred too much money in the past day, the second<br/>
transfer will also fail.
