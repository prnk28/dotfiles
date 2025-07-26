---
tags:
  - "#programming"
  - "#documentation"
  - "#database"
  - "#financial-systems"
  - "#data-consistency"
  - "#client-libraries"
  - "#ledger-system"
  - "#multi-language-support"
---
# Go

# [tigerbeetle-go](https://docs.tigerbeetle.com/coding/clients/go/#tigerbeetle-go)

The TigerBeetle client for Go.

[![Go Reference](https://pkg.go.dev/badge/github.com/tigerbeetle/tigerbeetle-go.svg)](https://pkg.go.dev/github.com/tigerbeetle/tigerbeetle-go)

Make sure to import<br/>
`github.com/tigerbeetle/tigerbeetle-go`, not this repo and<br/>
subdirectory.

## [Prerequisites](https://docs.tigerbeetle.com/coding/clients/go/#prerequisites)

Linux >= 5.6 is the only production environment we support. But<br/>
for ease of development we also support macOS and Windows.

- Go >= 1.21

**Additionally on Windows**: you must install [Zig 0.13.0](https://ziglang.org/download/#release-0.13.0) and<br/>
set the `CC` environment variable to `zig.exe cc`.<br/>
Use the full path for `zig.exe`.

## [Setup](https://docs.tigerbeetle.com/coding/clients/go/#setup)

First, create a directory for your project and `cd` into<br/>
the directory.

Then, install the TigerBeetle client:

```
go mod init tbtest
go get github.com/tigerbeetle/tigerbeetle-go
```

Now, create `main.go` and copy this into it:

```sourceCode go
package main

import (
    "fmt"
    "log"
    "os"

    . "github.com/tigerbeetle/tigerbeetle-go"
    . "github.com/tigerbeetle/tigerbeetle-go/pkg/types"
)

func main() {
    fmt.Println("Import ok!")
}
```

Finally, build and run:

```
go run main.go
```

Now that all prerequisites and dependencies are correctly set up,<br/>
let's dig into using TigerBeetle.

## [Sample projects](https://docs.tigerbeetle.com/coding/clients/go/#sample-projects)

This document is primarily a reference guide to the client. Below are<br/>
various sample projects demonstrating features of TigerBeetle.

- [Basic](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/go/samples/basic/):<br/>
  Create two accounts and transfer an amount between them.
- [Two-Phase\\<br/>
  Transfer](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/go/samples/two-phase/): Create two accounts and start a pending transfer between<br/>
  them, then post the transfer.
- [Many\\<br/>
  Two-Phase Transfers](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/go/samples/two-phase-many/): Create two accounts and start a number of<br/>
  pending transfer between them, posting and voiding alternating<br/>
  transfers.

## [Creating a Client](https://docs.tigerbeetle.com/coding/clients/go/#creating-a-client)

A client is created with a cluster ID and replica addresses for all<br/>
replicas in the cluster. The cluster ID and replica addresses are both<br/>
chosen by the system that starts the TigerBeetle cluster.

Clients are thread-safe and a single instance should be shared<br/>
between multiple concurrent tasks.

Multiple clients are useful when connecting to more than one<br/>
TigerBeetle cluster.

In this example the cluster ID is `0` and there is one<br/>
replica. The address is read from the `TB_ADDRESS`<br/>
environment variable and defaults to port `3000`.

```sourceCode go
tbAddress := os.Getenv("TB_ADDRESS")
if len(tbAddress) == 0 {
    tbAddress = "3000"
}
client, err := NewClient(ToUint128(0), []string{tbAddress})
if err != nil {
    log.Printf("Error creating client: %s", err)
    return
}
defer client.Close()
```

The following are valid addresses:

- `3000` (interpreted as `127.0.0.1:3000`)
- `127.0.0.1:3000` (interpreted as<br/>
  `127.0.0.1:3000`)
- `127.0.0.1` (interpreted as `127.0.0.1:3001`,<br/>
  `3001` is the default port)

## [Creating Accounts](https://docs.tigerbeetle.com/coding/clients/go/#creating-accounts)

See details for account fields in the [Accounts reference](https://docs.tigerbeetle.com/reference/account).

```sourceCode go
accountErrors, err := client.CreateAccounts([]Account{
    {
        ID:          ID(), // TigerBeetle time-based ID.
        UserData128: ToUint128(0),
        UserData64:  0,
        UserData32:  0,
        Ledger:      1,
        Code:        718,
        Flags:       0,
        Timestamp:   0,
    },
})
// Error handling omitted.
```

See details for the recommended ID scheme in [time-based\\<br/>
identifiers](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended).

The `Uint128` fields like `ID`,<br/>
`UserData128`, `Amount` and account balances have<br/>
a few helper functions to make it easier to convert 128-bit<br/>
little-endian unsigned integers between `string`,<br/>
`math/big.Int`, and `[]byte`.

See the type [Uint128](https://pkg.go.dev/github.com/tigerbeetle/tigerbeetle-go/pkg/types#Uint128)<br/>
for more details.

### [Account\ Flags](https://docs.tigerbeetle.com/coding/clients/go/#account-flags)

The account flags value is a bitfield. See details for these flags in<br/>
the [Accounts reference](https://docs.tigerbeetle.com/reference/account#flags).

To toggle behavior for an account, use the<br/>
`types.AccountFlags` struct to combine enum values and<br/>
generate a `uint16`. Here are a few examples:

- `AccountFlags{Linked: true}.ToUint16()`
- `AccountFlags{DebitsMustNotExceedCredits: true}.ToUint16()`
- `AccountFlags{CreditsMustNotExceedDebits: true}.ToUint16()`
- `AccountFlags{History: true}.ToUint16()`

For example, to link two accounts where the first account<br/>
additionally has the `debits_must_not_exceed_credits`<br/>
constraint:

```sourceCode go
account0 := Account{
    ID:     ToUint128(100),
    Ledger: 1,
    Code:   718,
    Flags: AccountFlags{
        DebitsMustNotExceedCredits: true,
        Linked:                     true,
    }.ToUint16(),
}
account1 := Account{
    ID:     ToUint128(101),
    Ledger: 1,
    Code:   718,
    Flags: AccountFlags{
        History: true,
    }.ToUint16(),
}

accountErrors, err := client.CreateAccounts([]Account{account0, account1})
// Error handling omitted.
```

### [Response and Errors](https://docs.tigerbeetle.com/coding/clients/go/#response-and-errors)

The response is an empty array if all accounts were created<br/>
successfully. If the response is non-empty, each object in the response<br/>
array contains error information for an account that failed. The error<br/>
object contains an error code and the index of the account in the<br/>
request batch.

See all error conditions in the [create_accounts\\<br/>
reference](https://docs.tigerbeetle.com/reference/requests/create_accounts).

```sourceCode go
account0 := Account{
    ID:     ToUint128(102),
    Ledger: 1,
    Code:   718,
    Flags:  0,
}
account1 := Account{
    ID:     ToUint128(103),
    Ledger: 1,
    Code:   718,
    Flags:  0,
}
account2 := Account{
    ID:     ToUint128(104),
    Ledger: 1,
    Code:   718,
    Flags:  0,
}

accountErrors, err := client.CreateAccounts([]Account{account0, account1, account2})
if err != nil {
    log.Printf("Error creating accounts: %s", err)
    return
}

for _, err := range accountErrors {
    switch err.Index {
    case uint32(AccountExists):
        log.Printf("Batch account at %d already exists.", err.Index)
    default:
        log.Printf("Batch account at %d failed to create: %s", err.Index, err.Result)
    }
}
```

To handle errors you can either 1) exactly match error codes returned<br/>
from `client.createAccounts` with enum values in the<br/>
`CreateAccountError` object, or you can 2) look up the error<br/>
code in the `CreateAccountError` object for a human-readable<br/>
string.

## [Account\ Lookup](https://docs.tigerbeetle.com/coding/clients/go/#account-lookup)

Account lookup is batched, like account creation. Pass in all IDs to<br/>
fetch. The account for each matched ID is returned.

If no account matches an ID, no object is returned for that account.<br/>
So the order of accounts in the response is not necessarily the same as<br/>
the order of IDs in the request. You can refer to the ID field in the<br/>
response to distinguish accounts.

```sourceCode go
accounts, err := client.LookupAccounts([]Uint128{ToUint128(100), ToUint128(101)})
```

## [Create Transfers](https://docs.tigerbeetle.com/coding/clients/go/#create-transfers)

This creates a journal entry between two accounts.

See details for transfer fields in the [Transfers reference](https://docs.tigerbeetle.com/reference/transfer).

```sourceCode go
transfers := []Transfer{{
    ID:              ID(), // TigerBeetle time-based ID.
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Ledger:          1,
    Code:            1,
    Flags:           0,
    Timestamp:       0,
}}

transferErrors, err := client.CreateTransfers(transfers)
// Error handling omitted.
```

See details for the recommended ID scheme in [time-based\\<br/>
identifiers](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended).

### [Response and Errors](https://docs.tigerbeetle.com/coding/clients/go/#response-and-errors-1)

The response is an empty array if all transfers were created<br/>
successfully. If the response is non-empty, each object in the response<br/>
array contains error information for a transfer that failed. The error<br/>
object contains an error code and the index of the transfer in the<br/>
request batch.

See all error conditions in the [create_transfers\\<br/>
reference](https://docs.tigerbeetle.com/reference/requests/create_transfers).

```sourceCode go
transfers := []Transfer{{
    ID:              ToUint128(1),
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Ledger:          1,
    Code:            1,
    Flags:           0,
}, {
    ID:              ToUint128(2),
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Ledger:          1,
    Code:            1,
    Flags:           0,
}, {
    ID:              ToUint128(3),
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Ledger:          1,
    Code:            1,
    Flags:           0,
}}

transferErrors, err := client.CreateTransfers(transfers)
if err != nil {
    log.Printf("Error creating transfers: %s", err)
    return
}

for _, err := range transferErrors {
    switch err.Index {
    case uint32(TransferExists):
        log.Printf("Batch transfer at %d already exists.", err.Index)
    default:
        log.Printf("Batch transfer at %d failed to create: %s", err.Index, err.Result)
    }
}
```

## [Batching](https://docs.tigerbeetle.com/coding/clients/go/#batching)

TigerBeetle performance is maximized when you batch API requests. The<br/>
client does not do this automatically for you. So, for example, you<br/>
_can_ insert 1 million transfers one at a time like so:

```sourceCode go
batch := []Transfer{}
for i := 0; i < len(batch); i++ {
    transferErrors, err := client.CreateTransfers([]Transfer{batch[i]})
    _, _ = transferErrors, err // Error handling omitted.
}
```

But the insert rate will be a _fraction_ of potential.<br/>
Instead, **always batch what you can**.

The maximum batch size is set in the TigerBeetle server. The default<br/>
is 8190.

```sourceCode go
batch := []Transfer{}
BATCH_SIZE := 8190
for i := 0; i < len(batch); i += BATCH_SIZE {
    size := BATCH_SIZE
    if i+BATCH_SIZE > len(batch) {
        size = len(batch) - i
    }
    transferErrors, err := client.CreateTransfers(batch[i : i+size])
    _, _ = transferErrors, err // Error handling omitted.
}
```

### [Queues and Workers](https://docs.tigerbeetle.com/coding/clients/go/#queues-and-workers)

If you are making requests to TigerBeetle from workers pulling jobs<br/>
from a queue, you can batch requests to TigerBeetle by having the worker<br/>
act on multiple jobs from the queue at once rather than one at a time.<br/>
i.e. pulling multiple jobs from the queue rather than just one.

## [Transfer Flags](https://docs.tigerbeetle.com/coding/clients/go/#transfer-flags)

The transfer `flags` value is a bitfield. See details for<br/>
these flags in the [Transfers\\<br/>
reference](https://docs.tigerbeetle.com/reference/transfer#flags).

To toggle behavior for an account, use the<br/>
`types.TransferFlags` struct to combine enum values and<br/>
generate a `uint16`. Here are a few examples:

- `TransferFlags{Linked: true}.ToUint16()`
- `TransferFlags{Pending: true}.ToUint16()`
- `TransferFlags{PostPendingTransfer: true}.ToUint16()`
- `TransferFlags{VoidPendingTransfer: true}.ToUint16()`

For example, to link `transfer0` and<br/>
`transfer1`:

```sourceCode go
transfer0 := Transfer{
    ID:              ToUint128(4),
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Ledger:          1,
    Code:            1,
    Flags:           TransferFlags{Linked: true}.ToUint16(),
}
transfer1 := Transfer{
    ID:              ToUint128(5),
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Ledger:          1,
    Code:            1,
    Flags:           0,
}

transferErrors, err := client.CreateTransfers([]Transfer{transfer0, transfer1})
// Error handling omitted.
```

### [Two-Phase Transfers](https://docs.tigerbeetle.com/coding/clients/go/#two-phase-transfers)

Two-phase transfers are supported natively by toggling the<br/>
appropriate flag. TigerBeetle will then adjust the<br/>
`credits_pending` and `debits_pending` fields of<br/>
the appropriate accounts. A corresponding post pending transfer then<br/>
needs to be sent to post or void the transfer.

#### [Post a Pending Transfer](https://docs.tigerbeetle.com/coding/clients/go/#post-a-pending-transfer)

With `flags` set to `post_pending_transfer`,<br/>
TigerBeetle will post the transfer. TigerBeetle will atomically roll<br/>
back the changes to `debits_pending` and<br/>
`credits_pending` of the appropriate accounts and apply them<br/>
to the `debits_posted` and `credits_posted`<br/>
balances.

```sourceCode go
transfer0 := Transfer{
    ID:              ToUint128(6),
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Ledger:          1,
    Code:            1,
    Flags:           0,
}

transferErrors, err := client.CreateTransfers([]Transfer{transfer0})
// Error handling omitted.

transfer1 := Transfer{
    ID: ToUint128(7),
    // Post the entire pending amount.
    Amount:    AmountMax,
    PendingID: ToUint128(6),
    Flags:     TransferFlags{PostPendingTransfer: true}.ToUint16(),
}

transferErrors, err = client.CreateTransfers([]Transfer{transfer1})
// Error handling omitted.
```

#### [Void a Pending Transfer](https://docs.tigerbeetle.com/coding/clients/go/#void-a-pending-transfer)

In contrast, with `flags` set to<br/>
`void_pending_transfer`, TigerBeetle will void the transfer.<br/>
TigerBeetle will roll back the changes to `debits_pending`<br/>
and `credits_pending` of the appropriate accounts and<br/>
**not** apply them to the `debits_posted` and<br/>
`credits_posted` balances.

```sourceCode go
transfer0 := Transfer{
    ID:              ToUint128(8),
    DebitAccountID:  ToUint128(101),
    CreditAccountID: ToUint128(102),
    Amount:          ToUint128(10),
    Timeout:         0,
    Ledger:          1,
    Code:            1,
    Flags:           0,
}

transferErrors, err := client.CreateTransfers([]Transfer{transfer0})
// Error handling omitted.

transfer1 := Transfer{
    ID: ToUint128(9),
    // Post the entire pending amount.
    Amount:    ToUint128(0),
    PendingID: ToUint128(8),
    Flags:     TransferFlags{VoidPendingTransfer: true}.ToUint16(),
}

transferErrors, err = client.CreateTransfers([]Transfer{transfer1})
// Error handling omitted.
```

## [Transfer Lookup](https://docs.tigerbeetle.com/coding/clients/go/#transfer-lookup)

NOTE: While transfer lookup exists, it is not a flexible query API.<br/>
We are developing query APIs and there will be new methods for querying<br/>
transfers in the future.

Transfer lookup is batched, like transfer creation. Pass in all<br/>
`id` s to fetch, and matched transfers are returned.

If no transfer matches an `id`, no object is returned for<br/>
that transfer. So the order of transfers in the response is not<br/>
necessarily the same as the order of `id` s in the request.<br/>
You can refer to the `id` field in the response to<br/>
distinguish transfers.

```sourceCode go
transfers, err := client.LookupTransfers([]Uint128{ToUint128(1), ToUint128(2)})
```

## [Get Account Transfers](https://docs.tigerbeetle.com/coding/clients/go/#get-account-transfers)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Fetches the transfers involving a given account, allowing basic<br/>
filter and pagination capabilities.

The transfers in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode go
filter := AccountFilter{
    AccountID:    ToUint128(2),
    UserData128:  ToUint128(0), // No filter by UserData.
    UserData64:   0,
    UserData32:   0,
    Code:         0,  // No filter by Code.
    TimestampMin: 0,  // No filter by Timestamp.
    TimestampMax: 0,  // No filter by Timestamp.
    Limit:        10, // Limit to ten transfers at most.
    Flags: AccountFilterFlags{
        Debits:   true, // Include transfer from the debit side.
        Credits:  true, // Include transfer from the credit side.
        Reversed: true, // Sort by timestamp in reverse-chronological order.
    }.ToUint32(),
}

transfers, err := client.GetAccountTransfers(filter)
```

## [Get Account Balances](https://docs.tigerbeetle.com/coding/clients/go/#get-account-balances)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Fetches the point-in-time balances of a given account, allowing basic<br/>
filter and pagination capabilities.

Only accounts created with the flag [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) set<br/>
retain [historical\\<br/>
balances](https://docs.tigerbeetle.com/reference/requests/get_account_balances).

The balances in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode go
filter := AccountFilter{
    AccountID:    ToUint128(2),
    UserData128:  ToUint128(0), // No filter by UserData.
    UserData64:   0,
    UserData32:   0,
    Code:         0,  // No filter by Code.
    TimestampMin: 0,  // No filter by Timestamp.
    TimestampMax: 0,  // No filter by Timestamp.
    Limit:        10, // Limit to ten balances at most.
    Flags: AccountFilterFlags{
        Debits:   true, // Include transfer from the debit side.
        Credits:  true, // Include transfer from the credit side.
        Reversed: true, // Sort by timestamp in reverse-chronological order.
    }.ToUint32(),
}

account_balances, err := client.GetAccountBalances(filter)
```

## [Query\ Accounts](https://docs.tigerbeetle.com/coding/clients/go/#query-accounts)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Query accounts by the intersection of some fields and by timestamp<br/>
range.

The accounts in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode go
filter := QueryFilter{
    UserData128:  ToUint128(1000), // Filter by UserData
    UserData64:   100,
    UserData32:   10,
    Code:         1,  // Filter by Code
    Ledger:       0,  // No filter by Ledger
    TimestampMin: 0,  // No filter by Timestamp.
    TimestampMax: 0,  // No filter by Timestamp.
    Limit:        10, // Limit to ten balances at most.
    Flags: QueryFilterFlags{
        Reversed: true, // Sort by timestamp in reverse-chronological order.
    }.ToUint32(),
}

accounts, err := client.QueryAccounts(filter)
```

## [Query\ Transfers](https://docs.tigerbeetle.com/coding/clients/go/#query-transfers)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Query transfers by the intersection of some fields and by timestamp<br/>
range.

The transfers in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode go
filter := QueryFilter{
    UserData128:  ToUint128(1000), // Filter by UserData.
    UserData64:   100,
    UserData32:   10,
    Code:         1,  // Filter by Code.
    Ledger:       0,  // No filter by Ledger.
    TimestampMin: 0,  // No filter by Timestamp.
    TimestampMax: 0,  // No filter by Timestamp.
    Limit:        10, // Limit to ten balances at most.
    Flags: QueryFilterFlags{
        Reversed: true, // Sort by timestamp in reverse-chronological order.
    }.ToUint32(),
}

transfers, err := client.QueryTransfers(filter)
```

## [Linked\ Events](https://docs.tigerbeetle.com/coding/clients/go/#linked-events)

When the `linked` flag is specified for an account when<br/>
creating accounts or a transfer when creating transfers, it links that<br/>
event with the next event in the batch, to create a chain of events, of<br/>
arbitrary length, which all succeed or fail together. The tail of a<br/>
chain is denoted by the first event without this flag. The last event in<br/>
a batch may therefore never have the `linked` flag set as<br/>
this would leave a chain open-ended. Multiple chains or individual<br/>
events may coexist within a batch to succeed or fail independently.

Events within a chain are executed within order, or are rolled back<br/>
on error, so that the effect of each event in the chain is visible to<br/>
the next, and so that the chain is either visible or invisible as a unit<br/>
to subsequent events after the chain. The event that was the first to<br/>
break the chain will have a unique error result. Other events in the<br/>
chain will have their error result set to<br/>
`linked_event_failed`.

```sourceCode go
batch := []Transfer{}
linkedFlag := TransferFlags{Linked: true}.ToUint16()

// An individual transfer (successful):
batch = append(batch, Transfer{ID: ToUint128(1) /* ... rest of transfer ... */})

// A chain of 4 transfers (the last transfer in the chain closes the chain with linked=false):
batch = append(batch, Transfer{ID: ToUint128(2) /* ... , */, Flags: linkedFlag}) // Commit/rollback.
batch = append(batch, Transfer{ID: ToUint128(3) /* ... , */, Flags: linkedFlag}) // Commit/rollback.
batch = append(batch, Transfer{ID: ToUint128(2) /* ... , */, Flags: linkedFlag}) // Fail with exists
batch = append(batch, Transfer{ID: ToUint128(4) /* ... , */})                    // Fail without committing

// An individual transfer (successful):
// This should not see any effect from the failed chain above.
batch = append(batch, Transfer{ID: ToUint128(2) /* ... rest of transfer ... */})

// A chain of 2 transfers (the first transfer fails the chain):
batch = append(batch, Transfer{ID: ToUint128(2) /* ... rest of transfer ... */, Flags: linkedFlag})
batch = append(batch, Transfer{ID: ToUint128(3) /* ... rest of transfer ... */})

// A chain of 2 transfers (successful):
batch = append(batch, Transfer{ID: ToUint128(3) /* ... rest of transfer ... */, Flags: linkedFlag})
batch = append(batch, Transfer{ID: ToUint128(4) /* ... rest of transfer ... */})

transferErrors, err := client.CreateTransfers(batch)
// Error handling omitted.
```

## [Imported Events](https://docs.tigerbeetle.com/coding/clients/go/#imported-events)

When the `imported` flag is specified for an account when<br/>
creating accounts or a transfer when creating transfers, it allows<br/>
importing historical events with a user-defined timestamp.

The entire batch of events must be set with the flag<br/>
`imported`.

It's recommended to submit the whole batch as a `linked`<br/>
chain of events, ensuring that if any event fails, none of them are<br/>
committed, preserving the last timestamp unchanged. This approach gives<br/>
the application a chance to correct failed imported events,<br/>
re-submitting the batch again with the same user-defined timestamps.

```sourceCode go
// External source of time.
var historicalTimestamp uint64 = 0
historicalAccounts := []Account{ /* Loaded from an external source. */ }
historicalTransfers := []Transfer{ /* Loaded from an external source. */ }

// First, load and import all accounts with their timestamps from the historical source.
accountsBatch := []Account{}
for index, account := range historicalAccounts {
    // Set a unique and strictly increasing timestamp.
    historicalTimestamp += 1
    account.Timestamp = historicalTimestamp

    account.Flags = AccountFlags{
        // Set the account as `imported`.
        Imported: true,
        // To ensure atomicity, the entire batch (except the last event in the chain)
        // must be `linked`.
        Linked: index < len(historicalAccounts)-1,
    }.ToUint16()

    accountsBatch = append(accountsBatch, account)
}

accountErrors, err := client.CreateAccounts(accountsBatch)
// Error handling omitted.

// Then, load and import all transfers with their timestamps from the historical source.
transfersBatch := []Transfer{}
for index, transfer := range historicalTransfers {
    // Set a unique and strictly increasing timestamp.
    historicalTimestamp += 1
    transfer.Timestamp = historicalTimestamp

    transfer.Flags = TransferFlags{
        // Set the transfer as `imported`.
        Imported: true,
        // To ensure atomicity, the entire batch (except the last event in the chain)
        // must be `linked`.
        Linked: index < len(historicalAccounts)-1,
    }.ToUint16()

    transfersBatch = append(transfersBatch, transfer)
}

transferErrors, err := client.CreateTransfers(transfersBatch)
// Error handling omitted..
// Since it is a linked chain, in case of any error the entire batch is rolled back and can be retried
// with the same historical timestamps without regressing the cluster timestamp.
```

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/src/clients/go/README.md)

### NodeJS

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [tigerbeetle-node](https://docs.tigerbeetle.com/coding/clients/node/#tigerbeetle-node)

The TigerBeetle client for Node.js.

## [Prerequisites](https://docs.tigerbeetle.com/coding/clients/node/#prerequisites)

Linux >= 5.6 is the only production environment we support. But<br/>
for ease of development we also support macOS and Windows.

- NodeJS >= `18`

## [Setup](https://docs.tigerbeetle.com/coding/clients/node/#setup)

First, create a directory for your project and `cd` into<br/>
the directory.

Then, install the TigerBeetle client:

```
npm install --save-exact tigerbeetle-node
```

Now, create `main.js` and copy this into it:

```sourceCode javascript
const { id } = require("tigerbeetle-node");
const { createClient } = require("tigerbeetle-node");
const process = require("process");

console.log("Import ok!");
```

Finally, build and run:

```
node main.js
```

Now that all prerequisites and dependencies are correctly set up,<br/>
let's dig into using TigerBeetle.

## [Sample projects](https://docs.tigerbeetle.com/coding/clients/node/#sample-projects)

This document is primarily a reference guide to the client. Below are<br/>
various sample projects demonstrating features of TigerBeetle.

- [Basic](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/node/samples/basic/):<br/>
  Create two accounts and transfer an amount between them.
- [Two-Phase\\<br/>
  Transfer](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/node/samples/two-phase/): Create two accounts and start a pending transfer between<br/>
  them, then post the transfer.
- [Many\\<br/>
  Two-Phase Transfers](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/node/samples/two-phase-many/): Create two accounts and start a number of<br/>
  pending transfer between them, posting and voiding alternating<br/>
  transfers.

### [Sidenote: `BigInt`](https://docs.tigerbeetle.com/coding/clients/node/#sidenote-bigint)

TigerBeetle uses 64-bit integers for many fields while JavaScript's<br/>
builtin `Number` maximum value is `2^53-1`. The<br/>
`n` suffix in JavaScript means the value is a<br/>
`BigInt`. This is useful for literal numbers. If you already<br/>
have a `Number` variable though, you can call the<br/>
`BigInt` constructor to get a `BigInt` from it.<br/>
For example, `1n` is the same as `BigInt(1)`.

## [Creating a Client](https://docs.tigerbeetle.com/coding/clients/node/#creating-a-client)

A client is created with a cluster ID and replica addresses for all<br/>
replicas in the cluster. The cluster ID and replica addresses are both<br/>
chosen by the system that starts the TigerBeetle cluster.

Clients are thread-safe and a single instance should be shared<br/>
between multiple concurrent tasks.

Multiple clients are useful when connecting to more than one<br/>
TigerBeetle cluster.

In this example the cluster ID is `0` and there is one<br/>
replica. The address is read from the `TB_ADDRESS`<br/>
environment variable and defaults to port `3000`.

```sourceCode javascript
const client = createClient({
  cluster_id: 0n,
  replica_addresses: [process.env.TB_ADDRESS || "3000"],
});
```

The following are valid addresses:

- `3000` (interpreted as `127.0.0.1:3000`)
- `127.0.0.1:3000` (interpreted as<br/>
  `127.0.0.1:3000`)
- `127.0.0.1` (interpreted as `127.0.0.1:3001`,<br/>
  `3001` is the default port)

## [Creating Accounts](https://docs.tigerbeetle.com/coding/clients/node/#creating-accounts)

See details for account fields in the [Accounts reference](https://docs.tigerbeetle.com/reference/account).

```sourceCode javascript
const account = {
  id: id(), // TigerBeetle time-based ID.
  debits_pending: 0n,
  debits_posted: 0n,
  credits_pending: 0n,
  credits_posted: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  reserved: 0,
  ledger: 1,
  code: 718,
  flags: 0,
  timestamp: 0n,
};

const account_errors = await client.createAccounts([account]);
// Error handling omitted.
```

See details for the recommended ID scheme in [time-based\\<br/>
identifiers](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended).

### [Account\ Flags](https://docs.tigerbeetle.com/coding/clients/node/#account-flags)

The account flags value is a bitfield. See details for these flags in<br/>
the [Accounts reference](https://docs.tigerbeetle.com/reference/account#flags).

To toggle behavior for an account, combine enum values stored in the<br/>
`AccountFlags` object (in TypeScript it is an actual enum)<br/>
with bitwise-or:

- `AccountFlags.linked`
- `AccountFlags.debits_must_not_exceed_credits`
- `AccountFlags.credits_must_not_exceed_credits`
- `AccountFlags.history`

For example, to link two accounts where the first account<br/>
additionally has the `debits_must_not_exceed_credits`<br/>
constraint:

```sourceCode javascript
const account0 = {
  id: 100n,
  debits_pending: 0n,
  debits_posted: 0n,
  credits_pending: 0n,
  credits_posted: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  reserved: 0,
  ledger: 1,
  code: 1,
  timestamp: 0n,
  flags: AccountFlags.linked | AccountFlags.debits_must_not_exceed_credits,
};
const account1 = {
  id: 101n,
  debits_pending: 0n,
  debits_posted: 0n,
  credits_pending: 0n,
  credits_posted: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  reserved: 0,
  ledger: 1,
  code: 1,
  timestamp: 0n,
  flags: AccountFlags.history,
};

const account_errors = await client.createAccounts([account0, account1]);
// Error handling omitted.
```

### [Response and Errors](https://docs.tigerbeetle.com/coding/clients/node/#response-and-errors)

The response is an empty array if all accounts were created<br/>
successfully. If the response is non-empty, each object in the response<br/>
array contains error information for an account that failed. The error<br/>
object contains an error code and the index of the account in the<br/>
request batch.

See all error conditions in the [create_accounts\\<br/>
reference](https://docs.tigerbeetle.com/reference/requests/create_accounts).

```sourceCode javascript
const account0 = {
  id: 102n,
  debits_pending: 0n,
  debits_posted: 0n,
  credits_pending: 0n,
  credits_posted: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  reserved: 0,
  ledger: 1,
  code: 1,
  timestamp: 0n,
  flags: 0,
};
const account1 = {
  id: 103n,
  debits_pending: 0n,
  debits_posted: 0n,
  credits_pending: 0n,
  credits_posted: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  reserved: 0,
  ledger: 1,
  code: 1,
  timestamp: 0n,
  flags: 0,
};
const account2 = {
  id: 104n,
  debits_pending: 0n,
  debits_posted: 0n,
  credits_pending: 0n,
  credits_posted: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  reserved: 0,
  ledger: 1,
  code: 1,
  timestamp: 0n,
  flags: 0,
};

const account_errors = await client.createAccounts([account0, account1, account2]);
for (const error of account_errors) {
  switch (error.result) {
    case CreateAccountError.exists:
      console.error(`Batch account at ${error.index} already exists.`);
      break;
    default:
      console.error(
        `Batch account at ${error.index} failed to create: ${
          CreateAccountError[error.result]
        }.`,
      );
  }
}
```

To handle errors you can either 1) exactly match error codes returned<br/>
from `client.createAccounts` with enum values in the<br/>
`CreateAccountError` object, or you can 2) look up the error<br/>
code in the `CreateAccountError` object for a human-readable<br/>
string.

## [Account\ Lookup](https://docs.tigerbeetle.com/coding/clients/node/#account-lookup)

Account lookup is batched, like account creation. Pass in all IDs to<br/>
fetch. The account for each matched ID is returned.

If no account matches an ID, no object is returned for that account.<br/>
So the order of accounts in the response is not necessarily the same as<br/>
the order of IDs in the request. You can refer to the ID field in the<br/>
response to distinguish accounts.

```sourceCode javascript
const accounts = await client.lookupAccounts([100n, 101n]);
```

## [Create Transfers](https://docs.tigerbeetle.com/coding/clients/node/#create-transfers)

This creates a journal entry between two accounts.

See details for transfer fields in the [Transfers reference](https://docs.tigerbeetle.com/reference/transfer).

```sourceCode javascript
const transfers = [{\
  id: id(), // TigerBeetle time-based ID.\
  debit_account_id: 102n,\
  credit_account_id: 103n,\
  amount: 10n,\
  pending_id: 0n,\
  user_data_128: 0n,\
  user_data_64: 0n,\
  user_data_32: 0,\
  timeout: 0,\
  ledger: 1,\
  code: 720,\
  flags: 0,\
  timestamp: 0n,\
}];

const transfer_errors = await client.createTransfers(transfers);
// Error handling omitted.
```

See details for the recommended ID scheme in [time-based\\<br/>
identifiers](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended).

### [Response and Errors](https://docs.tigerbeetle.com/coding/clients/node/#response-and-errors-1)

The response is an empty array if all transfers were created<br/>
successfully. If the response is non-empty, each object in the response<br/>
array contains error information for a transfer that failed. The error<br/>
object contains an error code and the index of the transfer in the<br/>
request batch.

See all error conditions in the [create_transfers\\<br/>
reference](https://docs.tigerbeetle.com/reference/requests/create_transfers).

```sourceCode javascript
const transfers = [{\
  id: 1n,\
  debit_account_id: 102n,\
  credit_account_id: 103n,\
  amount: 10n,\
  pending_id: 0n,\
  user_data_128: 0n,\
  user_data_64: 0n,\
  user_data_32: 0,\
  timeout: 0,\
  ledger: 1,\
  code: 720,\
  flags: 0,\
  timestamp: 0n,\
},\
{\
  id: 2n,\
  debit_account_id: 102n,\
  credit_account_id: 103n,\
  amount: 10n,\
  pending_id: 0n,\
  user_data_128: 0n,\
  user_data_64: 0n,\
  user_data_32: 0,\
  timeout: 0,\
  ledger: 1,\
  code: 720,\
  flags: 0,\
  timestamp: 0n,\
},\
{\
  id: 3n,\
  debit_account_id: 102n,\
  credit_account_id: 103n,\
  amount: 10n,\
  pending_id: 0n,\
  user_data_128: 0n,\
  user_data_64: 0n,\
  user_data_32: 0,\
  timeout: 0,\
  ledger: 1,\
  code: 720,\
  flags: 0,\
  timestamp: 0n,\
}];

const transfer_errors = await client.createTransfers(batch);
for (const error of transfer_errors) {
  switch (error.result) {
    case CreateTransferError.exists:
      console.error(`Batch transfer at ${error.index} already exists.`);
      break;
    default:
      console.error(
        `Batch transfer at ${error.index} failed to create: ${
          CreateTransferError[error.result]
        }.`,
      );
  }
}
```

To handle errors you can either 1) exactly match error codes returned<br/>
from `client.createTransfers` with enum values in the<br/>
`CreateTransferError` object, or you can 2) look up the error<br/>
code in the `CreateTransferError` object for a human-readable<br/>
string.

## [Batching](https://docs.tigerbeetle.com/coding/clients/node/#batching)

TigerBeetle performance is maximized when you batch API requests. The<br/>
client does not do this automatically for you. So, for example, you<br/>
_can_ insert 1 million transfers one at a time like so:

```sourceCode javascript
const batch = []; // Array of transfer to create.
for (let i = 0; i < batch.len; i++) {
  const transfer_errors = await client.createTransfers(batch[i]);
  // Error handling omitted.
}
```

But the insert rate will be a _fraction_ of potential.<br/>
Instead, **always batch what you can**.

The maximum batch size is set in the TigerBeetle server. The default<br/>
is 8190.

```sourceCode javascript
const batch = []; // Array of transfer to create.
const BATCH_SIZE = 8190;
for (let i = 0; i < batch.length; i += BATCH_SIZE) {
  const transfer_errors = await client.createTransfers(
    batch.slice(i, Math.min(batch.length, BATCH_SIZE)),
  );
  // Error handling omitted.
}
```

### [Queues and Workers](https://docs.tigerbeetle.com/coding/clients/node/#queues-and-workers)

If you are making requests to TigerBeetle from workers pulling jobs<br/>
from a queue, you can batch requests to TigerBeetle by having the worker<br/>
act on multiple jobs from the queue at once rather than one at a time.<br/>
i.e. pulling multiple jobs from the queue rather than just one.

## [Transfer Flags](https://docs.tigerbeetle.com/coding/clients/node/#transfer-flags)

The transfer `flags` value is a bitfield. See details for<br/>
these flags in the [Transfers\\<br/>
reference](https://docs.tigerbeetle.com/reference/transfer#flags).

To toggle behavior for a transfer, combine enum values stored in the<br/>
`TransferFlags` object (in TypeScript it is an actual enum)<br/>
with bitwise-or:

- `TransferFlags.linked`
- `TransferFlags.pending`
- `TransferFlags.post_pending_transfer`
- `TransferFlags.void_pending_transfer`

For example, to link `transfer0` and<br/>
`transfer1`:

```sourceCode javascript
const transfer0 = {
  id: 4n,
  debit_account_id: 102n,
  credit_account_id: 103n,
  amount: 10n,
  pending_id: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  timeout: 0,
  ledger: 1,
  code: 720,
  flags: TransferFlags.linked,
  timestamp: 0n,
};
const transfer1 = {
  id: 5n,
  debit_account_id: 102n,
  credit_account_id: 103n,
  amount: 10n,
  pending_id: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  timeout: 0,
  ledger: 1,
  code: 720,
  flags: 0,
  timestamp: 0n,
};

// Create the transfer
const transfer_errors = await client.createTransfers([transfer0, transfer1]);
// Error handling omitted.
```

### [Two-Phase Transfers](https://docs.tigerbeetle.com/coding/clients/node/#two-phase-transfers)

Two-phase transfers are supported natively by toggling the<br/>
appropriate flag. TigerBeetle will then adjust the<br/>
`credits_pending` and `debits_pending` fields of<br/>
the appropriate accounts. A corresponding post pending transfer then<br/>
needs to be sent to post or void the transfer.

#### [Post a Pending Transfer](https://docs.tigerbeetle.com/coding/clients/node/#post-a-pending-transfer)

With `flags` set to `post_pending_transfer`,<br/>
TigerBeetle will post the transfer. TigerBeetle will atomically roll<br/>
back the changes to `debits_pending` and<br/>
`credits_pending` of the appropriate accounts and apply them<br/>
to the `debits_posted` and `credits_posted`<br/>
balances.

```sourceCode javascript
const transfer0 = {
  id: 6n,
  debit_account_id: 102n,
  credit_account_id: 103n,
  amount: 10n,
  pending_id: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  timeout: 0,
  ledger: 1,
  code: 720,
  flags: TransferFlags.pending,
  timestamp: 0n,
};

let transfer_errors = await client.createTransfers([transfer0]);
// Error handling omitted.

const transfer1 = {
  id: 7n,
  debit_account_id: 102n,
  credit_account_id: 103n,
  // Post the entire pending amount.
  amount: amount_max,
  pending_id: 6n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  timeout: 0,
  ledger: 1,
  code: 720,
  flags: TransferFlags.post_pending_transfer,
  timestamp: 0n,
};

transfer_errors = await client.createTransfers([transfer1]);
// Error handling omitted.
```

#### [Void a Pending Transfer](https://docs.tigerbeetle.com/coding/clients/node/#void-a-pending-transfer)

In contrast, with `flags` set to<br/>
`void_pending_transfer`, TigerBeetle will void the transfer.<br/>
TigerBeetle will roll back the changes to `debits_pending`<br/>
and `credits_pending` of the appropriate accounts and<br/>
**not** apply them to the `debits_posted` and<br/>
`credits_posted` balances.

```sourceCode javascript
const transfer0 = {
  id: 8n,
  debit_account_id: 102n,
  credit_account_id: 103n,
  amount: 10n,
  pending_id: 0n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  timeout: 0,
  ledger: 1,
  code: 720,
  flags: TransferFlags.pending,
  timestamp: 0n,
};

let transfer_errors = await client.createTransfers([transfer0]);
// Error handling omitted.

const transfer1 = {
  id: 9n,
  debit_account_id: 102n,
  credit_account_id: 103n,
  amount: 10n,
  pending_id: 8n,
  user_data_128: 0n,
  user_data_64: 0n,
  user_data_32: 0,
  timeout: 0,
  ledger: 1,
  code: 720,
  flags: TransferFlags.void_pending_transfer,
  timestamp: 0n,
};

transfer_errors = await client.createTransfers([transfer1]);
// Error handling omitted.
```

## [Transfer Lookup](https://docs.tigerbeetle.com/coding/clients/node/#transfer-lookup)

NOTE: While transfer lookup exists, it is not a flexible query API.<br/>
We are developing query APIs and there will be new methods for querying<br/>
transfers in the future.

Transfer lookup is batched, like transfer creation. Pass in all<br/>
`id` s to fetch, and matched transfers are returned.

If no transfer matches an `id`, no object is returned for<br/>
that transfer. So the order of transfers in the response is not<br/>
necessarily the same as the order of `id` s in the request.<br/>
You can refer to the `id` field in the response to<br/>
distinguish transfers.

```sourceCode javascript
const transfers = await client.lookupTransfers([1n, 2n]);
```

## [Get Account Transfers](https://docs.tigerbeetle.com/coding/clients/node/#get-account-transfers)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Fetches the transfers involving a given account, allowing basic<br/>
filter and pagination capabilities.

The transfers in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode javascript
const filter = {
  account_id: 2n,
  user_data_128: 0n, // No filter by UserData.
  user_data_64: 0n,
  user_data_32: 0,
  code: 0, // No filter by Code.
  timestamp_min: 0n, // No filter by Timestamp.
  timestamp_max: 0n, // No filter by Timestamp.
  limit: 10, // Limit to ten balances at most.
  flags: AccountFilterFlags.debits | // Include transfer from the debit side.
    AccountFilterFlags.credits | // Include transfer from the credit side.
    AccountFilterFlags.reversed, // Sort by timestamp in reverse-chronological order.
};

const account_transfers = await client.getAccountTransfers(filter);
```

## [Get Account Balances](https://docs.tigerbeetle.com/coding/clients/node/#get-account-balances)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Fetches the point-in-time balances of a given account, allowing basic<br/>
filter and pagination capabilities.

Only accounts created with the flag [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) set<br/>
retain [historical\\<br/>
balances](https://docs.tigerbeetle.com/reference/requests/get_account_balances).

The balances in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode javascript
const filter = {
  account_id: 2n,
  user_data_128: 0n, // No filter by UserData.
  user_data_64: 0n,
  user_data_32: 0,
  code: 0, // No filter by Code.
  timestamp_min: 0n, // No filter by Timestamp.
  timestamp_max: 0n, // No filter by Timestamp.
  limit: 10, // Limit to ten balances at most.
  flags: AccountFilterFlags.debits | // Include transfer from the debit side.
    AccountFilterFlags.credits | // Include transfer from the credit side.
    AccountFilterFlags.reversed, // Sort by timestamp in reverse-chronological order.
};

const account_balances = await client.getAccountBalances(filter);
```

## [Query\ Accounts](https://docs.tigerbeetle.com/coding/clients/node/#query-accounts)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Query accounts by the intersection of some fields and by timestamp<br/>
range.

The accounts in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode javascript
const query_filter = {
  user_data_128: 1000n, // Filter by UserData.
  user_data_64: 100n,
  user_data_32: 10,
  code: 1, // Filter by Code.
  ledger: 0, // No filter by Ledger.
  timestamp_min: 0n, // No filter by Timestamp.
  timestamp_max: 0n, // No filter by Timestamp.
  limit: 10, // Limit to ten balances at most.
  flags: QueryFilterFlags.reversed, // Sort by timestamp in reverse-chronological order.
};

const query_accounts = await client.queryAccounts(query_filter);
```

## [Query\ Transfers](https://docs.tigerbeetle.com/coding/clients/node/#query-transfers)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Query transfers by the intersection of some fields and by timestamp<br/>
range.

The transfers in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode javascript
const query_filter = {
  user_data_128: 1000n, // Filter by UserData.
  user_data_64: 100n,
  user_data_32: 10,
  code: 1, // Filter by Code.
  ledger: 0, // No filter by Ledger.
  timestamp_min: 0n, // No filter by Timestamp.
  timestamp_max: 0n, // No filter by Timestamp.
  limit: 10, // Limit to ten balances at most.
  flags: QueryFilterFlags.reversed, // Sort by timestamp in reverse-chronological order.
};

const query_transfers = await client.queryTransfers(query_filter);
```

## [Linked\ Events](https://docs.tigerbeetle.com/coding/clients/node/#linked-events)

When the `linked` flag is specified for an account when<br/>
creating accounts or a transfer when creating transfers, it links that<br/>
event with the next event in the batch, to create a chain of events, of<br/>
arbitrary length, which all succeed or fail together. The tail of a<br/>
chain is denoted by the first event without this flag. The last event in<br/>
a batch may therefore never have the `linked` flag set as<br/>
this would leave a chain open-ended. Multiple chains or individual<br/>
events may coexist within a batch to succeed or fail independently.

Events within a chain are executed within order, or are rolled back<br/>
on error, so that the effect of each event in the chain is visible to<br/>
the next, and so that the chain is either visible or invisible as a unit<br/>
to subsequent events after the chain. The event that was the first to<br/>
break the chain will have a unique error result. Other events in the<br/>
chain will have their error result set to<br/>
`linked_event_failed`.

```sourceCode javascript
const batch = []; // Array of transfer to create.
let linkedFlag = 0;
linkedFlag |= TransferFlags.linked;

// An individual transfer (successful):
batch.push({ id: 1n /* , ... */ });

// A chain of 4 transfers (the last transfer in the chain closes the chain with linked=false):
batch.push({ id: 2n, /* ..., */ flags: linkedFlag }); // Commit/rollback.
batch.push({ id: 3n, /* ..., */ flags: linkedFlag }); // Commit/rollback.
batch.push({ id: 2n, /* ..., */ flags: linkedFlag }); // Fail with exists
batch.push({ id: 4n, /* ..., */ flags: 0 }); // Fail without committing.

// An individual transfer (successful):
// This should not see any effect from the failed chain above.
batch.push({ id: 2n, /* ..., */ flags: 0 });

// A chain of 2 transfers (the first transfer fails the chain):
batch.push({ id: 2n, /* ..., */ flags: linkedFlag });
batch.push({ id: 3n, /* ..., */ flags: 0 });

// A chain of 2 transfers (successful):
batch.push({ id: 3n, /* ..., */ flags: linkedFlag });
batch.push({ id: 4n, /* ..., */ flags: 0 });

const transfer_errors = await client.createTransfers(batch);
// Error handling omitted.
```

## [Imported Events](https://docs.tigerbeetle.com/coding/clients/node/#imported-events)

When the `imported` flag is specified for an account when<br/>
creating accounts or a transfer when creating transfers, it allows<br/>
importing historical events with a user-defined timestamp.

The entire batch of events must be set with the flag<br/>
`imported`.

It's recommended to submit the whole batch as a `linked`<br/>
chain of events, ensuring that if any event fails, none of them are<br/>
committed, preserving the last timestamp unchanged. This approach gives<br/>
the application a chance to correct failed imported events,<br/>
re-submitting the batch again with the same user-defined timestamps.

```sourceCode javascript
// External source of time.
let historical_timestamp = 0n
// Events loaded from an external source.
const historical_accounts = []; // Loaded from an external source.
const historical_transfers = []; // Loaded from an external source.

// First, load and import all accounts with their timestamps from the historical source.
const accounts = [];
for (let index = 0; i < historical_accounts.length; i++) {
  let account = historical_accounts[i];
  // Set a unique and strictly increasing timestamp.
  historical_timestamp += 1;
  account.timestamp = historical_timestamp;
  // Set the account as `imported`.
  account.flags = AccountFlags.imported;
  // To ensure atomicity, the entire batch (except the last event in the chain)
  // must be `linked`.
  if (index < historical_accounts.length - 1) {
    account.flags |= AccountFlags.linked;
  }

  accounts.push(account);
}

const account_errors = await client.createAccounts(accounts);
// Error handling omitted.

// Then, load and import all transfers with their timestamps from the historical source.
const transfers = [];
for (let index = 0; i < historical_transfers.length; i++) {
  let transfer = historical_transfers[i];
  // Set a unique and strictly increasing timestamp.
  historical_timestamp += 1;
  transfer.timestamp = historical_timestamp;
  // Set the account as `imported`.
  transfer.flags = TransferFlags.imported;
  // To ensure atomicity, the entire batch (except the last event in the chain)
  // must be `linked`.
  if (index < historical_transfers.length - 1) {
    transfer.flags |= TransferFlags.linked;
  }

  transfers.push(transfer);
}

const transfer_errors = await client.createTransfers(transfers);
// Error handling omitted.

// Since it is a linked chain, in case of any error the entire batch is rolled back and can be retried
// with the same historical timestamps without regressing the cluster timestamp.
```

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/src/clients/node/README.md)

### Python

# [tigerbeetle](https://docs.tigerbeetle.com/coding/clients/python/#tigerbeetle)

The TigerBeetle client for Python.

## [Prerequisites](https://docs.tigerbeetle.com/coding/clients/python/#prerequisites)

Linux >= 5.6 is the only production environment we support. But<br/>
for ease of development we also support macOS and Windows.

- Python (or PyPy, etc) >= `3.7`

## [Setup](https://docs.tigerbeetle.com/coding/clients/python/#setup)

First, create a directory for your project and `cd` into<br/>
the directory.

Then, install the TigerBeetle client:

```
pip install tigerbeetle
```

Now, create `main.py` and copy this into it:

```sourceCode python
import os

import tigerbeetle as tb

print("Import OK!")

# To enable debug logging, via Python's built in logging module:
# logging.basicConfig(level=logging.DEBUG)
# tb.configure_logging(debug=True)
```

Finally, build and run:

```
python3 main.py
```

Now that all prerequisites and dependencies are correctly set up,<br/>
let's dig into using TigerBeetle.

## [Sample projects](https://docs.tigerbeetle.com/coding/clients/python/#sample-projects)

This document is primarily a reference guide to the client. Below are<br/>
various sample projects demonstrating features of TigerBeetle.

- [Basic](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/python/samples/basic/):<br/>
  Create two accounts and transfer an amount between them.
- [Two-Phase\\<br/>
  Transfer](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/python/samples/two-phase/): Create two accounts and start a pending transfer between<br/>
  them, then post the transfer.
- [Many\\<br/>
  Two-Phase Transfers](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/clients/python/samples/two-phase-many/): Create two accounts and start a number of<br/>
  pending transfer between them, posting and voiding alternating<br/>
  transfers.

## [Creating a Client](https://docs.tigerbeetle.com/coding/clients/python/#creating-a-client)

A client is created with a cluster ID and replica addresses for all<br/>
replicas in the cluster. The cluster ID and replica addresses are both<br/>
chosen by the system that starts the TigerBeetle cluster.

Clients are thread-safe and a single instance should be shared<br/>
between multiple concurrent tasks.

Multiple clients are useful when connecting to more than one<br/>
TigerBeetle cluster.

In this example the cluster ID is `0` and there is one<br/>
replica. The address is read from the `TB_ADDRESS`<br/>
environment variable and defaults to port `3000`.

```sourceCode python
with tb.ClientSync(cluster_id=0, replica_addresses=os.getenv("TB_ADDRESS", "3000")) as client:
    # Use the client.
    pass
```

The following are valid addresses:

- `3000` (interpreted as `127.0.0.1:3000`)
- `127.0.0.1:3000` (interpreted as<br/>
  `127.0.0.1:3000`)
- `127.0.0.1` (interpreted as `127.0.0.1:3001`,<br/>
  `3001` is the default port)

## [Creating Accounts](https://docs.tigerbeetle.com/coding/clients/python/#creating-accounts)

See details for account fields in the [Accounts reference](https://docs.tigerbeetle.com/reference/account).

```sourceCode python
account = tb.Account(
    id=tb.id(), # TigerBeetle time-based ID.
    debits_pending=0,
    debits_posted=0,
    credits_pending=0,
    credits_posted=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    ledger=1,
    code=718,
    flags=0,
    timestamp=0,
)

account_errors = client.create_accounts([account])
# Error handling omitted.
```

See details for the recommended ID scheme in [time-based\\<br/>
identifiers](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended).

### [Account\ Flags](https://docs.tigerbeetle.com/coding/clients/python/#account-flags)

The account flags value is a bitfield. See details for these flags in<br/>
the [Accounts reference](https://docs.tigerbeetle.com/reference/account#flags).

To toggle behavior for an account, combine enum values stored in the<br/>
`AccountFlags` object (it's an `enum.IntFlag`)<br/>
with bitwise-or:

- `AccountFlags.linked`
- `AccountFlags.debits_must_not_exceed_credits`
- `AccountFlags.credits_must_not_exceed_credits`
- `AccountFlags.history`

For example, to link two accounts where the first account<br/>
additionally has the `debits_must_not_exceed_credits`<br/>
constraint:

```sourceCode python
account0 = tb.Account(
    id=100,
    debits_pending=0,
    debits_posted=0,
    credits_pending=0,
    credits_posted=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    ledger=1,
    code=1,
    timestamp=0,
    flags=tb.AccountFlags.LINKED | tb.AccountFlags.DEBITS_MUST_NOT_EXCEED_CREDITS,
)
account1 = tb.Account(
    id=101,
    debits_pending=0,
    debits_posted=0,
    credits_pending=0,
    credits_posted=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    ledger=1,
    code=1,
    timestamp=0,
    flags=tb.AccountFlags.HISTORY,
)

account_errors = client.create_accounts([account0, account1])
# Error handling omitted.
```

### [Response and Errors](https://docs.tigerbeetle.com/coding/clients/python/#response-and-errors)

The response is an empty array if all accounts were created<br/>
successfully. If the response is non-empty, each object in the response<br/>
array contains error information for an account that failed. The error<br/>
object contains an error code and the index of the account in the<br/>
request batch.

See all error conditions in the [create_accounts\\<br/>
reference](https://docs.tigerbeetle.com/reference/requests/create_accounts).

```sourceCode python
account0 = tb.Account(
    id=102,
    debits_pending=0,
    debits_posted=0,
    credits_pending=0,
    credits_posted=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    ledger=1,
    code=1,
    timestamp=0,
    flags=0,
)
account1 = tb.Account(
    id=103,
    debits_pending=0,
    debits_posted=0,
    credits_pending=0,
    credits_posted=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    ledger=1,
    code=1,
    timestamp=0,
    flags=0,
)
account2 = tb.Account(
    id=104,
    debits_pending=0,
    debits_posted=0,
    credits_pending=0,
    credits_posted=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    ledger=1,
    code=1,
    timestamp=0,
    flags=0,
)

account_errors = client.create_accounts([account0, account1, account2])
for error in account_errors:
    if error.result == tb.CreateAccountResult.EXISTS:
        print(f"Batch account at {error.index} already exists.")
    else:
        print(f"Batch account at ${error.index} failed to create: {error.result}.")
```

To handle errors you can compare the result code returned from<br/>
`client.create_accounts` with enum values in the<br/>
`CreateAccountResult` object.

## [Account\ Lookup](https://docs.tigerbeetle.com/coding/clients/python/#account-lookup)

Account lookup is batched, like account creation. Pass in all IDs to<br/>
fetch. The account for each matched ID is returned.

If no account matches an ID, no object is returned for that account.<br/>
So the order of accounts in the response is not necessarily the same as<br/>
the order of IDs in the request. You can refer to the ID field in the<br/>
response to distinguish accounts.

```sourceCode python
accounts = client.lookup_accounts([100, 101])
```

## [Create Transfers](https://docs.tigerbeetle.com/coding/clients/python/#create-transfers)

This creates a journal entry between two accounts.

See details for transfer fields in the [Transfers reference](https://docs.tigerbeetle.com/reference/transfer).

```sourceCode python
transfers = [tb.Transfer(\
    id=tb.id(), # TigerBeetle time-based ID.\
    debit_account_id=102,\
    credit_account_id=103,\
    amount=10,\
    pending_id=0,\
    user_data_128=0,\
    user_data_64=0,\
    user_data_32=0,\
    timeout=0,\
    ledger=1,\
    code=720,\
    flags=0,\
    timestamp=0,\
)]

transfer_errors = client.create_transfers(transfers)
# Error handling omitted.
```

See details for the recommended ID scheme in [time-based\\<br/>
identifiers](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended).

### [Response and Errors](https://docs.tigerbeetle.com/coding/clients/python/#response-and-errors-1)

The response is an empty array if all transfers were created<br/>
successfully. If the response is non-empty, each object in the response<br/>
array contains error information for a transfer that failed. The error<br/>
object contains an error code and the index of the transfer in the<br/>
request batch.

See all error conditions in the [create_transfers\\<br/>
reference](https://docs.tigerbeetle.com/reference/requests/create_transfers).

```sourceCode python
batch = [tb.Transfer(\
    id=1,\
    debit_account_id=102,\
    credit_account_id=103,\
    amount=10,\
    pending_id=0,\
    user_data_128=0,\
    user_data_64=0,\
    user_data_32=0,\
    timeout=0,\
    ledger=1,\
    code=720,\
    flags=0,\
    timestamp=0,\
),\
    tb.Transfer(\
    id=2,\
    debit_account_id=102,\
    credit_account_id=103,\
    amount=10,\
    pending_id=0,\
    user_data_128=0,\
    user_data_64=0,\
    user_data_32=0,\
    timeout=0,\
    ledger=1,\
    code=720,\
    flags=0,\
    timestamp=0,\
),\
    tb.Transfer(\
    id=3,\
    debit_account_id=102,\
    credit_account_id=103,\
    amount=10,\
    pending_id=0,\
    user_data_128=0,\
    user_data_64=0,\
    user_data_32=0,\
    timeout=0,\
    ledger=1,\
    code=720,\
    flags=0,\
    timestamp=0,\
)]

transfer_errors = client.create_transfers(batch)
for error in transfer_errors:
    if error.result == tb.CreateTransferResult.EXISTS:
        print(f"Batch transfer at {error.index} already exists.")
    else:
        print(f"Batch transfer at {error.index} failed to create: {error.result}.")
```

To handle errors you can compare the result code returned from<br/>
`client.create_transfers` with enum values in the<br/>
`CreateTransferResult` object.

## [Batching](https://docs.tigerbeetle.com/coding/clients/python/#batching)

TigerBeetle performance is maximized when you batch API requests. The<br/>
client does not do this automatically for you. So, for example, you<br/>
_can_ insert 1 million transfers one at a time like so:

```sourceCode python
batch = [] # Array of transfer to create.
for transfer in batch:
    transfer_errors = client.create_transfers([transfer])
    # Error handling omitted.
```

But the insert rate will be a _fraction_ of potential.<br/>
Instead, **always batch what you can**.

The maximum batch size is set in the TigerBeetle server. The default<br/>
is 8190.

```sourceCode python
batch = [] # Array of transfer to create.
BATCH_SIZE = 8190 #FIXME
for i in range(0, len(batch), BATCH_SIZE):
    transfer_errors = client.create_transfers(
        batch[i:min(len(batch), i + BATCH_SIZE)],
    )
    # Error handling omitted.
```

### [Queues and Workers](https://docs.tigerbeetle.com/coding/clients/python/#queues-and-workers)

If you are making requests to TigerBeetle from workers pulling jobs<br/>
from a queue, you can batch requests to TigerBeetle by having the worker<br/>
act on multiple jobs from the queue at once rather than one at a time.<br/>
i.e. pulling multiple jobs from the queue rather than just one.

## [Transfer Flags](https://docs.tigerbeetle.com/coding/clients/python/#transfer-flags)

The transfer `flags` value is a bitfield. See details for<br/>
these flags in the [Transfers\\<br/>
reference](https://docs.tigerbeetle.com/reference/transfer#flags).

To toggle behavior for a transfer, combine enum values stored in the<br/>
`TransferFlags` object (it's an `enum.IntFlag`)<br/>
with bitwise-or:

- `TransferFlags.linked`
- `TransferFlags.pending`
- `TransferFlags.post_pending_transfer`
- `TransferFlags.void_pending_transfer`

For example, to link `transfer0` and<br/>
`transfer1`:

```sourceCode python
transfer0 = tb.Transfer(
    id=4,
    debit_account_id=102,
    credit_account_id=103,
    amount=10,
    pending_id=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    timeout=0,
    ledger=1,
    code=720,
    flags=tb.TransferFlags.LINKED,
    timestamp=0,
)
transfer1 = tb.Transfer(
    id=5,
    debit_account_id=102,
    credit_account_id=103,
    amount=10,
    pending_id=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    timeout=0,
    ledger=1,
    code=720,
    flags=0,
    timestamp=0,
)

# Create the transfer
transfer_errors = client.create_transfers([transfer0, transfer1])
# Error handling omitted.
```

### [Two-Phase Transfers](https://docs.tigerbeetle.com/coding/clients/python/#two-phase-transfers)

Two-phase transfers are supported natively by toggling the<br/>
appropriate flag. TigerBeetle will then adjust the<br/>
`credits_pending` and `debits_pending` fields of<br/>
the appropriate accounts. A corresponding post pending transfer then<br/>
needs to be sent to post or void the transfer.

#### [Post a Pending Transfer](https://docs.tigerbeetle.com/coding/clients/python/#post-a-pending-transfer)

With `flags` set to `post_pending_transfer`,<br/>
TigerBeetle will post the transfer. TigerBeetle will atomically roll<br/>
back the changes to `debits_pending` and<br/>
`credits_pending` of the appropriate accounts and apply them<br/>
to the `debits_posted` and `credits_posted`<br/>
balances.

```sourceCode python
transfer0 = tb.Transfer(
    id=6,
    debit_account_id=102,
    credit_account_id=103,
    amount=10,
    pending_id=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    timeout=0,
    ledger=1,
    code=720,
    flags=tb.TransferFlags.PENDING,
    timestamp=0,
)

transfer_errors = client.create_transfers([transfer0])
# Error handling omitted.

transfer1 = tb.Transfer(
    id=7,
    debit_account_id=102,
    credit_account_id=103,
    # Post the entire pending amount.
    amount=tb.amount_max,
    pending_id=6,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    timeout=0,
    ledger=1,
    code=720,
    flags=tb.TransferFlags.POST_PENDING_TRANSFER,
    timestamp=0,
)

transfer_errors = client.create_transfers([transfer1])
# Error handling omitted.
```

#### [Void a Pending Transfer](https://docs.tigerbeetle.com/coding/clients/python/#void-a-pending-transfer)

In contrast, with `flags` set to<br/>
`void_pending_transfer`, TigerBeetle will void the transfer.<br/>
TigerBeetle will roll back the changes to `debits_pending`<br/>
and `credits_pending` of the appropriate accounts and<br/>
**not** apply them to the `debits_posted` and<br/>
`credits_posted` balances.

```sourceCode python
transfer0 = tb.Transfer(
    id=8,
    debit_account_id=102,
    credit_account_id=103,
    amount=10,
    pending_id=0,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    timeout=0,
    ledger=1,
    code=720,
    flags=tb.TransferFlags.PENDING,
    timestamp=0,
)

transfer_errors = client.create_transfers([transfer0])
# Error handling omitted.

transfer1 = tb.Transfer(
    id=9,
    debit_account_id=102,
    credit_account_id=103,
    amount=10,
    pending_id=8,
    user_data_128=0,
    user_data_64=0,
    user_data_32=0,
    timeout=0,
    ledger=1,
    code=720,
    flags=tb.TransferFlags.VOID_PENDING_TRANSFER,
    timestamp=0,
)

transfer_errors = client.create_transfers([transfer1])
# Error handling omitted.
```

## [Transfer Lookup](https://docs.tigerbeetle.com/coding/clients/python/#transfer-lookup)

NOTE: While transfer lookup exists, it is not a flexible query API.<br/>
We are developing query APIs and there will be new methods for querying<br/>
transfers in the future.

Transfer lookup is batched, like transfer creation. Pass in all<br/>
`id` s to fetch, and matched transfers are returned.

If no transfer matches an `id`, no object is returned for<br/>
that transfer. So the order of transfers in the response is not<br/>
necessarily the same as the order of `id` s in the request.<br/>
You can refer to the `id` field in the response to<br/>
distinguish transfers.

```sourceCode python
transfers = client.lookup_transfers([1, 2])
```

## [Get Account Transfers](https://docs.tigerbeetle.com/coding/clients/python/#get-account-transfers)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Fetches the transfers involving a given account, allowing basic<br/>
filter and pagination capabilities.

The transfers in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode python
filter = tb.AccountFilter(
    account_id=2,
    user_data_128=0, # No filter by UserData.
    user_data_64=0,
    user_data_32=0,
    code=0, # No filter by Code.
    timestamp_min=0, # No filter by Timestamp.
    timestamp_max=0, # No filter by Timestamp.
    limit=10, # Limit to ten balances at most.
    flags=tb.AccountFilterFlags.DEBITS | # Include transfer from the debit side.
    tb.AccountFilterFlags.CREDITS | # Include transfer from the credit side.
    tb.AccountFilterFlags.REVERSED, # Sort by timestamp in reverse-chronological order.
)

account_transfers = client.get_account_transfers(filter)
```

## [Get Account Balances](https://docs.tigerbeetle.com/coding/clients/python/#get-account-balances)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Fetches the point-in-time balances of a given account, allowing basic<br/>
filter and pagination capabilities.

Only accounts created with the flag [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) set<br/>
retain [historical\\<br/>
balances](https://docs.tigerbeetle.com/reference/requests/get_account_balances).

The balances in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode python
filter = tb.AccountFilter(
    account_id=2,
    user_data_128=0, # No filter by UserData.
    user_data_64=0,
    user_data_32=0,
    code=0, # No filter by Code.
    timestamp_min=0, # No filter by Timestamp.
    timestamp_max=0, # No filter by Timestamp.
    limit=10, # Limit to ten balances at most.
    flags=tb.AccountFilterFlags.DEBITS | # Include transfer from the debit side.
    tb.AccountFilterFlags.CREDITS | # Include transfer from the credit side.
    tb.AccountFilterFlags.REVERSED, # Sort by timestamp in reverse-chronological order.
)

account_balances = client.get_account_balances(filter)
```

## [Query\ Accounts](https://docs.tigerbeetle.com/coding/clients/python/#query-accounts)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Query accounts by the intersection of some fields and by timestamp<br/>
range.

The accounts in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode python
query_filter = tb.QueryFilter(
    user_data_128=1000, # Filter by UserData.
    user_data_64=100,
    user_data_32=10,
    code=1, # Filter by Code.
    ledger=0, # No filter by Ledger.
    timestamp_min=0, # No filter by Timestamp.
    timestamp_max=0, # No filter by Timestamp.
    limit=10, # Limit to ten balances at most.
    flags=tb.QueryFilterFlags.REVERSED, # Sort by timestamp in reverse-chronological order.
)

query_accounts = client.query_accounts(query_filter)
```

## [Query\ Transfers](https://docs.tigerbeetle.com/coding/clients/python/#query-transfers)

NOTE: This is a preview API that is subject to breaking changes once<br/>
we have a stable querying API.

Query transfers by the intersection of some fields and by timestamp<br/>
range.

The transfers in the response are sorted by `timestamp` in<br/>
chronological or reverse-chronological order.

```sourceCode python
query_filter = tb.QueryFilter(
    user_data_128=1000, # Filter by UserData.
    user_data_64=100,
    user_data_32=10,
    code=1, # Filter by Code.
    ledger=0, # No filter by Ledger.
    timestamp_min=0, # No filter by Timestamp.
    timestamp_max=0, # No filter by Timestamp.
    limit=10, # Limit to ten balances at most.
    flags=tb.QueryFilterFlags.REVERSED, # Sort by timestamp in reverse-chronological order.
)

query_transfers = client.query_transfers(query_filter)
```

## [Linked\ Events](https://docs.tigerbeetle.com/coding/clients/python/#linked-events)

When the `linked` flag is specified for an account when<br/>
creating accounts or a transfer when creating transfers, it links that<br/>
event with the next event in the batch, to create a chain of events, of<br/>
arbitrary length, which all succeed or fail together. The tail of a<br/>
chain is denoted by the first event without this flag. The last event in<br/>
a batch may therefore never have the `linked` flag set as<br/>
this would leave a chain open-ended. Multiple chains or individual<br/>
events may coexist within a batch to succeed or fail independently.

Events within a chain are executed within order, or are rolled back<br/>
on error, so that the effect of each event in the chain is visible to<br/>
the next, and so that the chain is either visible or invisible as a unit<br/>
to subsequent events after the chain. The event that was the first to<br/>
break the chain will have a unique error result. Other events in the<br/>
chain will have their error result set to<br/>
`linked_event_failed`.

```sourceCode python
batch = [] # List of tb.Transfers to create.
linkedFlag = 0
linkedFlag |= tb.TransferFlags.LINKED

# An individual transfer (successful):
batch.append(tb.Transfer(id=1))

# A chain of 4 transfers (the last transfer in the chain closes the chain with linked=false):
batch.append(tb.Transfer(id=2, flags=linkedFlag)) # Commit/rollback.
batch.append(tb.Transfer(id=3, flags=linkedFlag)) # Commit/rollback.
batch.append(tb.Transfer(id=2, flags=linkedFlag)) # Fail with exists
batch.append(tb.Transfer(id=4, flags=0)) # Fail without committing.

# An individual transfer (successful):
# This should not see any effect from the failed chain above.
batch.append(tb.Transfer(id=2, flags=0 ))

# A chain of 2 transfers (the first transfer fails the chain):
batch.append(tb.Transfer(id=2, flags=linkedFlag))
batch.append(tb.Transfer(id=3, flags=0))

# A chain of 2 transfers (successful):
batch.append(tb.Transfer(id=3, flags=linkedFlag))
batch.append(tb.Transfer(id=4, flags=0))

transfer_errors = client.create_transfers(batch)
# Error handling omitted.
```

## [Imported Events](https://docs.tigerbeetle.com/coding/clients/python/#imported-events)

When the `imported` flag is specified for an account when<br/>
creating accounts or a transfer when creating transfers, it allows<br/>
importing historical events with a user-defined timestamp.

The entire batch of events must be set with the flag<br/>
`imported`.

It's recommended to submit the whole batch as a `linked`<br/>
chain of events, ensuring that if any event fails, none of them are<br/>
committed, preserving the last timestamp unchanged. This approach gives<br/>
the application a chance to correct failed imported events,<br/>
re-submitting the batch again with the same user-defined timestamps.

```sourceCode python
# External source of time.
historical_timestamp = 0
# Events loaded from an external source.
historical_accounts = [] # Loaded from an external source.
historical_transfers = [] # Loaded from an external source.

# First, load and import all accounts with their timestamps from the historical source.
accounts = []
for index, account in enumerate(historical_accounts):
    # Set a unique and strictly increasing timestamp.
    historical_timestamp += 1
    account.timestamp = historical_timestamp
    # Set the account as `imported`.
    account.flags = tb.AccountFlags.IMPORTED
    # To ensure atomicity, the entire batch (except the last event in the chain)
    # must be `linked`.
    if index < len(historical_accounts) - 1:
        account.flags |= tb.AccountFlags.LINKED

    accounts.append(account)

account_errors = client.create_accounts(accounts)
# Error handling omitted.

# The, load and import all transfers with their timestamps from the historical source.
transfers = []
for index, transfer in enumerate(historical_transfers):
    # Set a unique and strictly increasing timestamp.
    historical_timestamp += 1
    transfer.timestamp = historical_timestamp
    # Set the account as `imported`.
    transfer.flags = tb.TransferFlags.IMPORTED
    # To ensure atomicity, the entire batch (except the last event in the chain)
    # must be `linked`.
    if index < len(historical_transfers) - 1:
        transfer.flags |= tb.AccountFlags.LINKED

    transfers.append(transfer)

transfer_errors = client.create_transfers(transfers)
# Error handling omitted.

# Since it is a linked chain, in case of any error the entire batch is rolled back and can be retried
# with the same historical timestamps without regressing the cluster timestamp.
```

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/src/clients/python/README.md)
