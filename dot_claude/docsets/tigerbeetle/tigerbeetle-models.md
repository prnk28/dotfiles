---
tags:
  - "#database"
  - "#distributed-systems"
  - "#architecture"
  - "#financial-systems"
  - "#data-consistency"
  - "#transaction-processing"
  - "#ledger-system"
  - "#financial-operations"
  - "#atomic-operations"
  - "#financial-database"
  - "#data-integrity"
---
# Account

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`Account`](https://docs.tigerbeetle.com/reference/account/#account)

An `Account` is a record storing the cumulative effect of<br/>
committed [transfers](https://docs.tigerbeetle.com/reference/transfer).

## [Updates](https://docs.tigerbeetle.com/reference/account/#updates)

Account fields _cannot be changed by the user_ after creation.<br/>
However, debits and credits fields are updated by TigerBeetle as<br/>
transfers move money to and from an account.

## [Deletion](https://docs.tigerbeetle.com/reference/account/#deletion)

Accounts **cannot be deleted** after creation. This<br/>
provides a strong guarantee for an audit trail–and the account record<br/>
is only 128 bytes.

If an account is no longer in use, you may want to [zero out its balance](https://docs.tigerbeetle.com/coding/recipes/close-account).

## [Guarantees](https://docs.tigerbeetle.com/reference/account/#guarantees)

- Accounts are immutable. They are never modified once they are<br/>
  successfully created (excluding balance fields, which are modified by<br/>
  transfers).
- There is at most one `Account` with a particular [`id`](https://docs.tigerbeetle.com/reference/account/#id).
- The sum of all accounts' [`debits_pending`](https://docs.tigerbeetle.com/reference/account/#debits_pending) equals the sum of<br/>
  all accounts' [`credits_pending`](https://docs.tigerbeetle.com/reference/account/#credits_pending).
- The sum of all accounts' [`debits_posted`](https://docs.tigerbeetle.com/reference/account/#debits_posted) equals the sum of<br/>
  all accounts' [`credits_posted`](https://docs.tigerbeetle.com/reference/account/#credits_posted).

# [Fields](https://docs.tigerbeetle.com/reference/account/#fields)

## [`id`](https://docs.tigerbeetle.com/reference/account/#id)

This is a unique, client-defined identifier for the account.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must not be zero or `2^128 - 1` (the highest 128-bit<br/>
  unsigned integer)
- Must not conflict with another account in the cluster

See the [`id`\\<br/>
section in the data modeling doc](https://docs.tigerbeetle.com/coding/data-modeling#id) for more recommendations on<br/>
choosing an ID scheme.

Note that account IDs are unique for the cluster–not per ledger. If<br/>
you want to store a relationship between accounts, such as indicating<br/>
that multiple accounts on different ledgers belong to the same user, you<br/>
should store a user ID in one of the [`user_data`](https://docs.tigerbeetle.com/reference/account/#user_data_128) fields.

## [`debits_pending`](https://docs.tigerbeetle.com/reference/account/#debits_pending)

`debits_pending` counts debits reserved by pending<br/>
transfers. When a pending transfer posts, voids, or times out, the<br/>
amount is removed from `debits_pending`.

Money in `debits_pending` is reserved—that is, it cannot<br/>
be spent until the corresponding pending transfer resolves.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must be zero when the account is created

## [`debits_posted`](https://docs.tigerbeetle.com/reference/account/#debits_posted)

Amount of posted debits.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must be zero when the account is created

## [`credits_pending`](https://docs.tigerbeetle.com/reference/account/#credits_pending)

`credits_pending` counts credits reserved by pending<br/>
transfers. When a pending transfer posts, voids, or times out, the<br/>
amount is removed from `credits_pending`.

Money in `credits_pending` is reserved—that is, it<br/>
cannot be spent until the corresponding pending transfer resolves.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must be zero when the account is created

## [`credits_posted`](https://docs.tigerbeetle.com/reference/account/#credits_posted)

Amount of posted credits.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must be zero when the account is created

## [`user_data_128`](https://docs.tigerbeetle.com/reference/account/#user_data_128)

This is an optional 128-bit secondary identifier to link this account<br/>
to an external entity or event.

When set to zero, no secondary identifier will be associated with the<br/>
account, therefore only non-zero values can be used as [query filter](https://docs.tigerbeetle.com/reference/query-filter).

As an example, you might use a [ULID](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended)<br/>
that ties together a group of accounts.

For more information, see [Data Modeling](https://docs.tigerbeetle.com/coding/data-modeling#user_data).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

## [`user_data_64`](https://docs.tigerbeetle.com/reference/account/#user_data_64)

This is an optional 64-bit secondary identifier to link this account<br/>
to an external entity or event.

When set to zero, no secondary identifier will be associated with the<br/>
account, therefore only non-zero values can be used as [query filter](https://docs.tigerbeetle.com/reference/query-filter).

As an example, you might use this field store an external<br/>
timestamp.

For more information, see [Data Modeling](https://docs.tigerbeetle.com/coding/data-modeling#user_data).

Constraints:

- Type is 64-bit unsigned integer (8 bytes)

## [`user_data_32`](https://docs.tigerbeetle.com/reference/account/#user_data_32)

This is an optional 32-bit secondary identifier to link this account<br/>
to an external entity or event.

When set to zero, no secondary identifier will be associated with the<br/>
account, therefore only non-zero values can be used as [query filter](https://docs.tigerbeetle.com/reference/query-filter).

As an example, you might use this field to store a timezone or<br/>
locale.

For more information, see [Data Modeling](https://docs.tigerbeetle.com/coding/data-modeling#user_data).

Constraints:

- Type is 32-bit unsigned integer (4 bytes)

## [`reserved`](https://docs.tigerbeetle.com/reference/account/#reserved)

This space may be used for additional data in the future.

Constraints:

- Type is 4 bytes
- Must be zero

## [`ledger`](https://docs.tigerbeetle.com/reference/account/#ledger)

This is an identifier that partitions the sets of accounts that can<br/>
transact with each other.

See [data modeling](https://docs.tigerbeetle.com/coding/data-modeling#ledgers)<br/>
for more details about how to think about setting up your ledgers.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)
- Must not be zero

## [`code`](https://docs.tigerbeetle.com/reference/account/#code)

This is a user-defined enum denoting the category of the account.

As an example, you might use codes<br/>
`1000`- `3340` to indicate asset accounts in<br/>
general, where `1001` is Bank Account and `1002`<br/>
is Money Market Account and `2003` is Motor Vehicles and so<br/>
on.

Constraints:

- Type is 16-bit unsigned integer (2 bytes)
- Must not be zero

## [`flags`](https://docs.tigerbeetle.com/reference/account/#flags)

A bitfield that toggles additional behavior.

Constraints:

- Type is 16-bit unsigned integer (2 bytes)
- Some flags are mutually exclusive; see [`flags_are_mutually_exclusive`](https://docs.tigerbeetle.com/reference/requests/create_accounts#flags_are_mutually_exclusive).

### [`flags.linked`](https://docs.tigerbeetle.com/reference/account/#flagslinked)

This flag links the result of this account creation to the result of<br/>
the next one in the request, such that they will either succeed or fail<br/>
together.

The last account in a chain of linked accounts does<br/>
**not** have this flag set.

You can read more about [linked\\<br/>
events](https://docs.tigerbeetle.com/coding/linked-events).

### [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account/#flagsdebits_must_not_exceed_credits)

When set, transfers will be rejected that would cause this account's<br/>
debits to exceed credits. Specifically when<br/>
`account.debits_pending + account.debits_posted + transfer.amount > account.credits_posted`.

This cannot be set when `credits_must_not_exceed_debits`<br/>
is also set.

### [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account/#flagscredits_must_not_exceed_debits)

When set, transfers will be rejected that would cause this account's<br/>
credits to exceed debits. Specifically when<br/>
`account.credits_pending + account.credits_posted + transfer.amount > account.debits_posted`.

This cannot be set when `debits_must_not_exceed_credits`<br/>
is also set.

### [`flags.history`](https://docs.tigerbeetle.com/reference/account/#flagshistory)

When set, the account will retain the history of balances at each<br/>
transfer.

Note that the [`get_account_balances`](https://docs.tigerbeetle.com/reference/requests/get_account_balances)<br/>
operation only works for accounts with this flag set.

### [`flags.imported`](https://docs.tigerbeetle.com/reference/account/#flagsimported)

When set, allows importing historical `Account` s with<br/>
their original [`timestamp`](https://docs.tigerbeetle.com/reference/account/#timestamp).

TigerBeetle will not use the [cluster\\<br/>
clock](https://docs.tigerbeetle.com/coding/time) to assign the timestamp, allowing the user to define it,<br/>
expressing _when_ the account was effectively created by an<br/>
external event.

To maintain system invariants regarding auditability and<br/>
traceability, some constraints are necessary:

- It is not allowed to mix events with the `imported`<br/>
  flag set and _not_ set in the same batch. The application must<br/>
  submit batches of imported events separately.

- User-defined timestamps must be **unique** and<br/>
  expressed as nanoseconds since the UNIX epoch. No two objects can have<br/>
  the same timestamp, even different objects like an `Account`<br/>
  and a `Transfer` cannot share the same timestamp.

- User-defined timestamps must be a past date, never ahead of the<br/>
  cluster clock at the time the request arrives.

- Timestamps must be strictly increasing.

Even user-defined timestamps that are required to be past dates need<br/>
to be at least one nanosecond ahead of the timestamp of the last account<br/>
committed by the cluster.

Since the timestamp cannot regress, importing past events can be<br/>
naturally restrictive without coordination, as the last timestamp can be<br/>
updated using the cluster clock during regular cluster activity.<br/>
Instead, it's recommended to import events only on a fresh cluster or<br/>
during a scheduled maintenance window.

It's recommended to submit the entire batch as a [linked chain](https://docs.tigerbeetle.com/reference/account/#flagslinked), ensuring that if any account<br/>
fails, none of them are committed, preserving the last timestamp<br/>
unchanged. This approach gives the application a chance to correct<br/>
failed imported accounts, re-submitting the batch again with the same<br/>
user-defined timestamps.

### [`flags.closed`](https://docs.tigerbeetle.com/reference/account/#flagsclosed)

When set, the account will reject further transfers, except for [voiding two-phase transfers](https://docs.tigerbeetle.com/reference/transfer#modes) that are still<br/>
pending.

- This flag can be set during the account creation.
- This flag can also be set by sending a [two-phase pending transfer](https://docs.tigerbeetle.com/reference/transfer#flagspending) with the<br/>
  [`Transfer.flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)<br/>
  and/or [`Transfer.flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)<br/>
  flags set.
- This flag can be _unset_ by [voiding](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) the two-phase<br/>
  pending transfer that closed the account.

## [`timestamp`](https://docs.tigerbeetle.com/reference/account/#timestamp)

This is the time the account was created, as nanoseconds since UNIX<br/>
epoch. You can read more about [Time in\\<br/>
TigerBeetle](https://docs.tigerbeetle.com/coding/time).

Constraints:

- Type is 64-bit unsigned integer (8 bytes)
- Must be `0` when the `Account` is created<br/>
  with [`flags.imported`](https://docs.tigerbeetle.com/reference/account/#flagsimported) _not_ set

It is set by TigerBeetle to the moment the account arrives at the<br/>
cluster.

- Must be greater than `0` and less than<br/>
  `2^63` when the `Account` is created with [`flags.imported`](https://docs.tigerbeetle.com/reference/account/#flagsimported) set

# [Internals](https://docs.tigerbeetle.com/reference/account/#internals)

If you're curious and want to learn more, you can find the source<br/>
code for this struct in [src/tigerbeetle.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/tigerbeetle.zig).<br/>
Search for `const Account = extern struct {`.

You can find the source code for creating an account in [src/state_machine.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/state_machine.zig).<br/>
Search for `fn create_account(`.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/account.md)

## AccountBalance

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`AccountBalance`](https://docs.tigerbeetle.com/reference/account-balance/#accountbalance)

An `AccountBalance` is a record storing the [`Account`](https://docs.tigerbeetle.com/reference/account)'s balance at a given point in<br/>
time.

Only Accounts with the flag [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) set retain [historical\\<br/>
balances](https://docs.tigerbeetle.com/reference/requests/get_account_balances).

## [Fields](https://docs.tigerbeetle.com/reference/account-balance/#fields)

### [`timestamp`](https://docs.tigerbeetle.com/reference/account-balance/#timestamp)

This is the time the account balance was updated, as nanoseconds<br/>
since UNIX epoch.

The timestamp refers to the same [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) which<br/>
changed the [`Account`](https://docs.tigerbeetle.com/reference/account).

The amounts refer to the account balance recorded _after_ the<br/>
transfer execution.

Constraints:

- Type is 64-bit unsigned integer (8 bytes)

### [`debits_pending`](https://docs.tigerbeetle.com/reference/account-balance/#debits_pending)

Amount of [pending debits](https://docs.tigerbeetle.com/reference/account#debits_pending).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

### [`debits_posted`](https://docs.tigerbeetle.com/reference/account-balance/#debits_posted)

Amount of [posted debits](https://docs.tigerbeetle.com/reference/account#debits_posted).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

### [`credits_pending`](https://docs.tigerbeetle.com/reference/account-balance/#credits_pending)

Amount of [pending\\<br/>
credits](https://docs.tigerbeetle.com/reference/account#credits_pending).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

### [`credits_posted`](https://docs.tigerbeetle.com/reference/account-balance/#credits_posted)

Amount of [posted credits](https://docs.tigerbeetle.com/reference/account#credits_posted).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

### [`reserved`](https://docs.tigerbeetle.com/reference/account-balance/#reserved)

This space may be used for additional data in the future.

Constraints:

- Type is 56 bytes
- Must be zero

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/account-balance.md)

#### AccountFilter

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`AccountFilter`](https://docs.tigerbeetle.com/reference/account-filter/#accountfilter)

An `AccountFilter` is a record containing the filter<br/>
parameters for querying the [account transfers](https://docs.tigerbeetle.com/reference/requests/get_account_transfers) and the<br/>
[account historical\\<br/>
balances](https://docs.tigerbeetle.com/reference/requests/get_account_balances).

## [Fields](https://docs.tigerbeetle.com/reference/account-filter/#fields)

### [`account_id`](https://docs.tigerbeetle.com/reference/account-filter/#account_id)

The unique [identifier](https://docs.tigerbeetle.com/reference/account#id) of the account for<br/>
which the results will be retrieved.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must not be zero or `2^128 - 1`

### [`user_data_128`](https://docs.tigerbeetle.com/reference/account-filter/#user_data_128)

Filter the results by the field [`Transfer.user_data_128`](https://docs.tigerbeetle.com/reference/transfer#user_data_128).<br/>
Optional; set to zero to disable the filter.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

### [`user_data_64`](https://docs.tigerbeetle.com/reference/account-filter/#user_data_64)

Filter the results by the field [`Transfer.user_data_64`](https://docs.tigerbeetle.com/reference/transfer#user_data_64).<br/>
Optional; set to zero to disable the filter.

Constraints:

- Type is 64-bit unsigned integer (8 bytes)

### [`user_data_32`](https://docs.tigerbeetle.com/reference/account-filter/#user_data_32)

Filter the results by the field [`Transfer.user_data_32`](https://docs.tigerbeetle.com/reference/transfer#user_data_32).<br/>
Optional; set to zero to disable the filter.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)

### [`code`](https://docs.tigerbeetle.com/reference/account-filter/#code)

Filter the results by the [`Transfer.code`](https://docs.tigerbeetle.com/reference/transfer#code). Optional; set to<br/>
zero to disable the filter.

Constraints:

- Type is 16-bit unsigned integer (2 bytes)

### [`reserved`](https://docs.tigerbeetle.com/reference/account-filter/#reserved)

This space may be used for additional data in the future.

Constraints:

- Type is 58 bytes
- Must be zero

### [`timestamp_min`](https://docs.tigerbeetle.com/reference/account-filter/#timestamp_min)

The minimum [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) from<br/>
which results will be returned, inclusive range. Optional; set to zero<br/>
to disable the lower-bound filter.

Constraints:

- Type is 64-bit unsigned integer (8 bytes)
- Must be less than `2^63`.

### [`timestamp_max`](https://docs.tigerbeetle.com/reference/account-filter/#timestamp_max)

The maximum [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) from<br/>
which results will be returned, inclusive range. Optional; set to zero<br/>
to disable the upper-bound filter.

Constraints:

- Type is 64-bit unsigned integer (8 bytes)
- Must be less than `2^63`.

### [`limit`](https://docs.tigerbeetle.com/reference/account-filter/#limit)

The maximum number of results that can be returned by this query.

Limited by the [maximum message\\<br/>
size](https://docs.tigerbeetle.com/coding/requests#batching-events).

Constraints:

- Type is 32-bit unsigned integer (4 bytes)
- Must not be zero

### [`flags`](https://docs.tigerbeetle.com/reference/account-filter/#flags)

A bitfield that specifies querying behavior.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)

#### [`flags.debits`](https://docs.tigerbeetle.com/reference/account-filter/#flagsdebits)

Whether or not to include results where the field [`debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
matches the parameter [`account_id`](https://docs.tigerbeetle.com/reference/account-filter/#account_id).

#### [`flags.credits`](https://docs.tigerbeetle.com/reference/account-filter/#flagscredits)

Whether or not to include results where the field [`credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
matches the parameter [`account_id`](https://docs.tigerbeetle.com/reference/account-filter/#account_id).

#### [`flags.reversed`](https://docs.tigerbeetle.com/reference/account-filter/#flagsreversed)

Whether the results are sorted by timestamp in chronological or<br/>
reverse-chronological order. If the flag is not set, the event that<br/>
happened first (has the smallest timestamp) will come first. If the flag<br/>
is set, the event that happened last (has the largest timestamp) will<br/>
come first.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/account-filter.md)

#### Client Sessions

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Client Sessions](https://docs.tigerbeetle.com/reference/sessions/#client-sessions)

A _client session_ is a sequence of [requests](https://docs.tigerbeetle.com/coding/requests/) and replies sent between a<br/>
client and a cluster.

A client session may have **at most one in-flight**<br/>
**request**—i.e. at most one unique request on the network for<br/>
which a reply has not been received. This simplifies consistency and<br/>
allows the cluster to statically guarantee capacity in its incoming<br/>
message queue. Additional requests from the application are queued by<br/>
the client, to be dequeued and sent when their preceding request<br/>
receives a reply.

Similar to other databases, TigerBeetle has a [hard limit](https://docs.tigerbeetle.com/reference/sessions/#eviction) on the number of concurrent client<br/>
sessions. To maximize throughput, users are encouraged to minimize the<br/>
number of concurrent clients and [batch](https://docs.tigerbeetle.com/coding/requests#batching-events) as many events as<br/>
possible per request.

## [Lifecycle](https://docs.tigerbeetle.com/reference/sessions/#lifecycle)

A client session begins when a client registers itself with the<br/>
cluster.

- Each client session has a unique identifier ("client id")—an<br/>
  ephemeral random 128-bit id.
- The client sends a special "register" message which is committed by<br/>
  the cluster, at which point the client is "registered"—once it<br/>
  receives the reply, it may begin sending requests.
- Client registration is handled automatically by the TigerBeetle<br/>
  client implementation when the client is initialized, before it sends<br/>
  its first request.
- When a client restarts (for example, the application service running<br/>
  the TigerBeetle client is restarted) it does not resume its old session<br/>
  —it starts a new session, with a new (random) client id.

A client session ends when either:

- the client session is [evicted](https://docs.tigerbeetle.com/reference/sessions/#eviction), or
- the client terminates

—whichever occurs first.

## [Eviction](https://docs.tigerbeetle.com/reference/sessions/#eviction)

When a client session is registering and the number of active<br/>
sessions in the cluster is already at the cluster's concurrent client<br/>
session [limit](https://tigerbeetle.com/blog/2022-10-12-a-database-without-dynamic-memory)<br/>
(`config.clients_max`, 64 by default), an existing client<br/>
session must be evicted to make space for the new session.

- After a session is evicted by the cluster, no future requests from<br/>
  that session will ever execute.
- The evicted session is chosen as the session that committed a<br/>
  request the longest time ago.

The cluster sends a message to notify the evicted session that it has<br/>
ended. Typically the evicted client is no longer active (already<br/>
terminated), but if it is active, the eviction message causes it to<br/>
self-terminate, bubbling up to the application as an<br/>
`session evicted` error.

If active clients are terminating with `session evicted`<br/>
errors, it most likely indicates that the application is trying to run<br/>
too many concurrent clients. For performance reasons, it is recommended<br/>
to [batch](https://docs.tigerbeetle.com/coding/requests/#batching-events) as many<br/>
events as possible into each request sent by each client.

## [Retries](https://docs.tigerbeetle.com/reference/sessions/#retries)

A client session will automatically retry a request until either:

- the client receives a corresponding reply from the cluster, or
- the client is terminated.

Unlike most database or RPC clients:

- the TigerBeetle client will never time out
- the TigerBeetle client has no retry limits
- the TigerBeetle client does not surface network errors

With TigerBeetle's strict consistency model, surfacing these errors<br/>
at the client/application level would be misleading. An error would<br/>
imply that a request did not execute, when that is not known:

- A request delayed by the network could execute after its<br/>
  timeout.
- A reply delayed by the network could execute before its<br/>
  timeout.

## [Guarantees](https://docs.tigerbeetle.com/reference/sessions/#guarantees)

- A client session may have at most one in-flight [request](https://docs.tigerbeetle.com/coding/requests/).
- A client session [reads its\\<br/>
  own writes](https://jepsen.io/consistency/models/read-your-writes), meaning that read operations that happen after a given<br/>
  write operation will observe the effects of the write.
- A client session observes writes in the order that they occur on the<br/>
  cluster.
- A client session observes [`debits_posted`](https://docs.tigerbeetle.com/reference/account#debits_posted) and [`credits_posted`](https://docs.tigerbeetle.com/reference/account#credits_posted) as<br/>
  monotonically increasing. That is, a client session will never see<br/>
  `credits_posted` or `debits_posted` decrease.
- A client session never observes uncommitted updates.
- A client session never observes a broken invariant (e.g. [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
  or [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)).
- Multiple client sessions may receive replies out of order relative<br/>
  to one another. For example, if two clients submit requests around the<br/>
  same time, the client whose request is committed first might receive the<br/>
  reply later.
- A client session can consider a request executed when it receives a<br/>
  reply for the request.
- If a client session is terminated and restarts, it is guaranteed to<br/>
  see the effects of updates for which the corresponding reply was<br/>
  received prior to termination.
- If a client session is terminated and restarts, it is _not_<br/>
  guaranteed to see the effects of updates for which the corresponding<br/>
  reply was _not_ received prior to the restart. Those updates may<br/>
  occur at any point in the future, or never. Handling application crash<br/>
  recovery safely requires [using\\<br/>
  `id` s to idempotently retry events](https://docs.tigerbeetle.com/coding/reliable-transaction-submission).

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/sessions.md)

### Create Accounts

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`create_accounts`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#create_accounts)

Create one or more [`Account`](https://docs.tigerbeetle.com/reference/account) s.

## [Event](https://docs.tigerbeetle.com/reference/requests/create_accounts/#event)

The account to create. See [`Account`](https://docs.tigerbeetle.com/reference/account) for constraints.

## [Result](https://docs.tigerbeetle.com/reference/requests/create_accounts/#result)

Results are listed in this section in order of descending precedence<br/>
—that is, if more than one error is applicable to the account being<br/>
created, only the result listed first is returned.

### [`ok`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#ok)

The account was successfully created; it did not previously<br/>
exist.

Note that `ok` is generated by the client implementation;<br/>
the network protocol does not include a result when the account was<br/>
successfully created.

### [`linked_event_failed`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#linked_event_failed)

The account was not created. One or more of the accounts in the [linked chain](https://docs.tigerbeetle.com/reference/account#flagslinked) is invalid, so the<br/>
whole chain failed.

### [`linked_event_chain_open`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#linked_event_chain_open)

The account was not created. The [`Account.flags.linked`](https://docs.tigerbeetle.com/reference/account#flagslinked)<br/>
flag was set on the last event in the batch, which is not legal.<br/>
(`flags.linked` indicates that the chain continues to the<br/>
next operation).

### [`imported_event_expected`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#imported_event_expected)

The account was not created. The [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
was set on the first account of the batch, but not all accounts in the<br/>
batch. Batches cannot mix imported accounts with non-imported<br/>
accounts.

### [`imported_event_not_expected`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#imported_event_not_expected)

The account was not created. The [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
was expected to _not_ be set, as it's not allowed to mix accounts<br/>
with different `imported` flag in the same batch. The first<br/>
account determines the entire operation.

### [`timestamp_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#timestamp_must_be_zero)

This result only applies when [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
is _not_ set.

The account was not created. The [`Account.timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) is<br/>
nonzero, but must be zero. The cluster is responsible for setting this<br/>
field.

The [`Account.timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) can<br/>
only be assigned when creating accounts with [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
set.

### [`imported_event_timestamp_out_of_range`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#imported_event_timestamp_out_of_range)

This result only applies when [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
is set.

The account was not created. The [`Account.timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) is out<br/>
of range, but must be a user-defined timestamp greater than<br/>
`0` and less than `2^63`.

### [`imported_event_timestamp_must_not_advance`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#imported_event_timestamp_must_not_advance)

This result only applies when [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
is set.

The account was not created. The user-defined [`Account.timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) is<br/>
greater than the current [cluster\\<br/>
time](https://docs.tigerbeetle.com/coding/time), but it must be a past timestamp.

### [`reserved_field`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#reserved_field)

The account was not created. [`Account.reserved`](https://docs.tigerbeetle.com/reference/account#reserved) is<br/>
nonzero, but must be zero.

### [`reserved_flag`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#reserved_flag)

The account was not created. `Account.flags.reserved` is<br/>
nonzero, but must be zero.

### [`id_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#id_must_not_be_zero)

The account was not created. [`Account.id`](https://docs.tigerbeetle.com/reference/account#id) is zero, which is a<br/>
reserved value.

### [`id_must_not_be_int_max`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#id_must_not_be_int_max)

The account was not created. [`Account.id`](https://docs.tigerbeetle.com/reference/account#id) is<br/>
`2^128 - 1`, which is a reserved value.

### [`exists_with_different_flags`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#exists_with_different_flags)

An account with the same `id` already exists, but with<br/>
different [`flags`](https://docs.tigerbeetle.com/reference/account#flags).

### [`exists_with_different_user_data_128`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#exists_with_different_user_data_128)

An account with the same `id` already exists, but with<br/>
different [`user_data_128`](https://docs.tigerbeetle.com/reference/account#user_data_128).

### [`exists_with_different_user_data_64`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#exists_with_different_user_data_64)

An account with the same `id` already exists, but with<br/>
different [`user_data_64`](https://docs.tigerbeetle.com/reference/account#user_data_64).

### [`exists_with_different_user_data_32`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#exists_with_different_user_data_32)

An account with the same `id` already exists, but with<br/>
different [`user_data_32`](https://docs.tigerbeetle.com/reference/account#user_data_32).

### [`exists_with_different_ledger`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#exists_with_different_ledger)

An account with the same `id` already exists, but with<br/>
different [`ledger`](https://docs.tigerbeetle.com/reference/account#ledger).

### [`exists_with_different_code`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#exists_with_different_code)

An account with the same `id` already exists, but with<br/>
different [`code`](https://docs.tigerbeetle.com/reference/account#code).

### [`exists`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#exists)

An account with the same `id` already exists.

With the possible exception of the following fields, the existing<br/>
account is identical to the account in the request:

- `timestamp`
- `debits_pending`
- `debits_posted`
- `credits_pending`
- `credits_posted`

To correctly [recover from\\<br/>
application crashes](https://docs.tigerbeetle.com/coding/reliable-transaction-submission), many applications should handle<br/>
`exists` exactly as [`ok`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#ok).

### [`flags_are_mutually_exclusive`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#flags_are_mutually_exclusive)

The account was not created. An account cannot be created with the<br/>
specified combination of [`Account.flags`](https://docs.tigerbeetle.com/reference/account#flags).

The following flags are mutually exclusive:

- [`Account.flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)
- [`Account.flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)

### [`debits_pending_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#debits_pending_must_be_zero)

The account was not created. [`Account.debits_pending`](https://docs.tigerbeetle.com/reference/account#debits_pending)<br/>
is nonzero, but must be zero.

An account's debits and credits are only modified by transfers.

### [`debits_posted_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#debits_posted_must_be_zero)

The account was not created. [`Account.debits_posted`](https://docs.tigerbeetle.com/reference/account#debits_posted)<br/>
is nonzero, but must be zero.

An account's debits and credits are only modified by transfers.

### [`credits_pending_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#credits_pending_must_be_zero)

The account was not created. [`Account.credits_pending`](https://docs.tigerbeetle.com/reference/account#credits_pending)<br/>
is nonzero, but must be zero.

An account's debits and credits are only modified by transfers.

### [`credits_posted_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#credits_posted_must_be_zero)

The account was not created. [`Account.credits_posted`](https://docs.tigerbeetle.com/reference/account#credits_posted)<br/>
is nonzero, but must be zero.

An account's debits and credits are only modified by transfers.

### [`ledger_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#ledger_must_not_be_zero)

The account was not created. [`Account.ledger`](https://docs.tigerbeetle.com/reference/account#ledger) is zero, but<br/>
must be nonzero.

### [`code_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#code_must_not_be_zero)

The account was not created. [`Account.code`](https://docs.tigerbeetle.com/reference/account#code) is zero, but<br/>
must be nonzero.

### [`imported_event_timestamp_must_not_regress`](https://docs.tigerbeetle.com/reference/requests/create_accounts/#imported_event_timestamp_must_not_regress)

This result only applies when [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
is set.

The account was not created. The user-defined [`Account.timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp)<br/>
regressed, but it must be greater than the last timestamp assigned to<br/>
any `Account` in the cluster and cannot be equal to the<br/>
timestamp of any existing [`Transfer`](https://docs.tigerbeetle.com/reference/transfer).

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/create_accounts/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#creating-accounts)
- [Java\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/java/#creating-accounts)
- [Go library](https://docs.tigerbeetle.com/coding/clients/go/#creating-accounts)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#creating-accounts)
- [Python\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/python/#creating-accounts)

## [Internals](https://docs.tigerbeetle.com/reference/requests/create_accounts/#internals)

If you're curious and want to learn more, you can find the source<br/>
code for creating an account in [src/state_machine.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/state_machine.zig).<br/>
Search for `fn create_account(` and<br/>
`fn execute(`.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/create_accounts.md)

### Create Transfers

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`create_transfers`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#create_transfers)

Create one or more [`Transfer`](https://docs.tigerbeetle.com/reference/transfer) s. A successfully created<br/>
transfer will modify the amount fields of its [debit](https://docs.tigerbeetle.com/reference/transfer#debit_account_id) and [credit](https://docs.tigerbeetle.com/reference/transfer#credit_account_id) accounts.

## [Event](https://docs.tigerbeetle.com/reference/requests/create_transfers/#event)

The transfer to create. See [`Transfer`](https://docs.tigerbeetle.com/reference/transfer) for constraints.

## [Result](https://docs.tigerbeetle.com/reference/requests/create_transfers/#result)

Results are listed in this section in order of descending precedence<br/>
—that is, if more than one error is applicable to the transfer being<br/>
created, only the result listed first is returned.

### [`ok`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#ok)

The transfer was successfully created; did not previously exist.

Note that `ok` is generated by the client implementation;<br/>
the network protocol does not include a result when the transfer was<br/>
successfully created.

### [`linked_event_failed`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#linked_event_failed)

The transfer was not created. One or more of the other transfers in<br/>
the [linked chain](https://docs.tigerbeetle.com/reference/transfer#flagslinked) is invalid, so<br/>
the whole chain failed.

### [`linked_event_chain_open`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#linked_event_chain_open)

The transfer was not created. The [`Transfer.flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)<br/>
flag was set on the last event in the batch, which is not legal.<br/>
(`flags.linked` indicates that the chain continues to the<br/>
next operation).

### [`imported_event_expected`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_expected)

The transfer was not created. The [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
was set on the first transfer of the batch, but not all transfers in the<br/>
batch. Batches cannot mix imported transfers with non-imported<br/>
transfers.

### [`imported_event_not_expected`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_not_expected)

The transfer was not created. The [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
was expected to _not_ be set, as it's not allowed to mix<br/>
transfers with different `imported` flag in the same batch.<br/>
The first transfer determines the entire operation.

### [`timestamp_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#timestamp_must_be_zero)

This result only applies when [`Account.flags.imported`](https://docs.tigerbeetle.com/reference/account#flagsimported)<br/>
is _not_ set.

The transfer was not created. The [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) is<br/>
nonzero, but must be zero. The cluster is responsible for setting this<br/>
field.

The [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) can<br/>
only be assigned when creating transfers with [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
set.

### [`imported_event_timestamp_out_of_range`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_timestamp_out_of_range)

This result only applies when [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
is set.

The transfer was not created. The [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) is<br/>
out of range, but must be a user-defined timestamp greater than<br/>
`0` and less than `2^63`.

### [`imported_event_timestamp_must_not_advance`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_timestamp_must_not_advance)

This result only applies when [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
is set.

The transfer was not created. The user-defined [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) is<br/>
greater than the current [cluster\\<br/>
time](https://docs.tigerbeetle.com/coding/time), but it must be a past timestamp.

### [`reserved_flag`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#reserved_flag)

The transfer was not created. `Transfer.flags.reserved` is<br/>
nonzero, but must be zero.

### [`id_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_must_not_be_zero)

The transfer was not created. [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) is zero, which is<br/>
a reserved value.

### [`id_must_not_be_int_max`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_must_not_be_int_max)

The transfer was not created. [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) is<br/>
`2^128 - 1`, which is a reserved value.

### [`exists_with_different_flags`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_flags)

A transfer with the same `id` already exists, but with<br/>
different [`flags`](https://docs.tigerbeetle.com/reference/transfer#flags).

### [`exists_with_different_pending_id`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_pending_id)

A transfer with the same `id` already exists, but with a<br/>
different [`pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id).

### [`exists_with_different_timeout`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_timeout)

A transfer with the same `id` already exists, but with a<br/>
different [`timeout`](https://docs.tigerbeetle.com/reference/transfer#timeout).

### [`exists_with_different_debit_account_id`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_debit_account_id)

A transfer with the same `id` already exists, but with a<br/>
different [`debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id).

### [`exists_with_different_credit_account_id`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_credit_account_id)

A transfer with the same `id` already exists, but with a<br/>
different [`credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id).

### [`exists_with_different_amount`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_amount)

A transfer with the same `id` already exists, but with a<br/>
different [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount).

If the transfer has [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)<br/>
or [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)<br/>
set, then the actual amount transferred exceeds this failed transfer's<br/>
`amount`.

### [`exists_with_different_user_data_128`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_user_data_128)

A transfer with the same `id` already exists, but with a<br/>
different [`user_data_128`](https://docs.tigerbeetle.com/reference/transfer#user_data_128).

### [`exists_with_different_user_data_64`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_user_data_64)

A transfer with the same `id` already exists, but with a<br/>
different [`user_data_64`](https://docs.tigerbeetle.com/reference/transfer#user_data_64).

### [`exists_with_different_user_data_32`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_user_data_32)

A transfer with the same `id` already exists, but with a<br/>
different [`user_data_32`](https://docs.tigerbeetle.com/reference/transfer#user_data_32).

### [`exists_with_different_ledger`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_ledger)

A transfer with the same `id` already exists, but with a<br/>
different [`ledger`](https://docs.tigerbeetle.com/reference/transfer#ledger).

### [`exists_with_different_code`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists_with_different_code)

A transfer with the same `id` already exists, but with a<br/>
different [`code`](https://docs.tigerbeetle.com/reference/transfer#code).

### [`exists`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exists)

A transfer with the same `id` already exists.

If the transfer has [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)<br/>
or [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)<br/>
set, then the existing transfer may have a different [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount), limited to the<br/>
maximum `amount` of the transfer in the request.

If the transfer has [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)<br/>
set, then the existing transfer may have a different [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount):

- If the original posted amount was less than the pending amount, then<br/>
  the transfer amount must be equal to the posted amount.
- Otherwise, the transfer amount must be greater than or equal to the<br/>
  pending amount.

Client release < 0.16.0

If the transfer has [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)<br/>
or [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)<br/>
set, then the existing transfer may have a different [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount), limited to the<br/>
maximum `amount` of the transfer in the request.

Otherwise, with the possible exception of the `timestamp`<br/>
field, the existing transfer is identical to the transfer in the<br/>
request.

To correctly [recover from\\<br/>
application crashes](https://docs.tigerbeetle.com/coding/reliable-transaction-submission), many applications should handle<br/>
`exists` exactly as [`ok`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#ok).

### [`id_already_failed`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed)

The transfer was not created. A previous transfer with the same [`id`](https://docs.tigerbeetle.com/reference/transfer#id) failed due to one of the<br/>
following _transient errors_:

- [`debit_account_not_found`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#debit_account_not_found)
- [`credit_account_not_found`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#credit_account_not_found)
- [`pending_transfer_not_found`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_not_found)
- [`exceeds_credits`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exceeds_credits)
- [`exceeds_debits`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exceeds_debits)
- [`debit_account_already_closed`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#debit_account_already_closed)
- [`credit_account_already_closed`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#credit_account_already_closed)

Transient errors depend on the database state at a given point in<br/>
time, and each attempt is uniquely associated with the corresponding [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id). This behavior<br/>
guarantees that retrying a transfer will not produce a different outcome<br/>
(either success or failure).

Without this mechanism, a transfer that previously failed could<br/>
succeed if retried when the underlying state changes (e.g., the target<br/>
account has sufficient credits).

**Note:** The application should retry an event only if<br/>
it was unable to acknowledge the last response (e.g., due to an<br/>
application restart) or because it is correcting a previously rejected<br/>
malformed request (e.g., due to an application bug). If the application<br/>
intends to submit the transfer again even after a transient error, it<br/>
must generate a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id).

Client release < 0.16.4

The [`id`](https://docs.tigerbeetle.com/reference/transfer#id) is never checked<br/>
against failed transfers, regardless of the error. Therefore, a transfer<br/>
that failed due to a transient error could succeed if retried later.

### [`flags_are_mutually_exclusive`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#flags_are_mutually_exclusive)

The transfer was not created. A transfer cannot be created with the<br/>
specified combination of [`Transfer.flags`](https://docs.tigerbeetle.com/reference/transfer#flags).

Flag compatibility (✓ = compatible, ✗ = mutually exclusive):

- [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✗ [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✗ [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✓ [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✓ [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✓ [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✓ [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)
  - ✓ [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
- [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✗ [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✗ [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✗ [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✗ [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✗ [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✗ [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)
  - ✓ [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
- [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✗ [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✗ [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✗ [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✗ [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✗ [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✗ [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)
  - ✓ [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
- [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✓ [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✗ [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✗ [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✓ [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✓ [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✓ [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)
  - ✓ [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
- [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✓ [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✗ [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✗ [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✓ [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✓ [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✓ [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)
  - ✓ [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
- [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✓ [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✗ [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✗ [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✓ [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✓ [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✓ [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)
  - ✓ [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
- [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)
  - ✓ [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✗ [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✗ [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✓ [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✓ [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✓ [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✓ [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
- [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)
  - ✓ [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)
  - ✓ [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)
  - ✓ [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)
  - ✓ [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)
  - ✓ [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)
  - ✓ [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)
  - ✓ [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)

### [`debit_account_id_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#debit_account_id_must_not_be_zero)

The transfer was not created. [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
is zero, but must be a valid account id.

### [`debit_account_id_must_not_be_int_max`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#debit_account_id_must_not_be_int_max)

The transfer was not created. [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
is `2^128 - 1`, but must be a valid account id.

### [`credit_account_id_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#credit_account_id_must_not_be_zero)

The transfer was not created. [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
is zero, but must be a valid account id.

### [`credit_account_id_must_not_be_int_max`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#credit_account_id_must_not_be_int_max)

The transfer was not created. [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
is `2^128 - 1`, but must be a valid account id.

### [`accounts_must_be_different`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#accounts_must_be_different)

The transfer was not created. [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
and [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
must not be equal.

That is, an account cannot transfer money to itself.

### [`pending_id_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_id_must_be_zero)

The transfer was not created. Only post/void transfers can reference<br/>
a pending transfer.

Either:

- [`Transfer.flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)<br/>
  must be set, or
- [`Transfer.flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)<br/>
  must be set, or
- [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
  must be zero.

### [`pending_id_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_id_must_not_be_zero)

The transfer was not created. [`Transfer.flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)<br/>
or [`Transfer.flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)<br/>
is set, but [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id) is<br/>
zero. A posting or voiding transfer must reference a [`pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)<br/>
transfer.

### [`pending_id_must_not_be_int_max`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_id_must_not_be_int_max)

The transfer was not created. [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id) is<br/>
`2^128 - 1`, which is a reserved value.

### [`pending_id_must_be_different`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_id_must_be_different)

The transfer was not created. [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id) is<br/>
set to the same id as [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id). Instead it should<br/>
refer to a different (existing) transfer.

### [`timeout_reserved_for_pending_transfer`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#timeout_reserved_for_pending_transfer)

The transfer was not created. [`Transfer.timeout`](https://docs.tigerbeetle.com/reference/transfer#timeout) is<br/>
nonzero, but only [pending](https://docs.tigerbeetle.com/reference/transfer#flagspending)<br/>
transfers have nonzero timeouts.

### [`closing_transfer_must_be_pending`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#closing_transfer_must_be_pending)

The transfer was not created. [`Transfer.flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)<br/>
is not set, but closing transfers must be two-phase pending<br/>
transfers.

If either [`Transfer.flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_debit)<br/>
or [`Transfer.flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsclosing_credit)<br/>
is set, [`Transfer.flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)<br/>
must also be set.

This ensures that closing transfers are reversible by [voiding](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) the pending<br/>
transfer, and requires that the reversal operation references the<br/>
corresponding closing transfer, guarding against unexpected interleaving<br/>
of close/unclose operations.

### [`amount_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#amount_must_not_be_zero)

**Deprecated**: This error code is only returned to<br/>
clients prior to release `0.16.0`. Since `0.16.0`,<br/>
zero-amount transfers are permitted.

Client release < 0.16.0

The transfer was not created. [`Transfer.amount`](https://docs.tigerbeetle.com/reference/transfer#amount) is zero,<br/>
but must be nonzero.

Every transfer must move value. Only posting and voiding transfer<br/>
amounts may be zero—when zero, they will move the full pending<br/>
amount.

### [`ledger_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#ledger_must_not_be_zero)

The transfer was not created. [`Transfer.ledger`](https://docs.tigerbeetle.com/reference/transfer#ledger) is zero,<br/>
but must be nonzero.

### [`code_must_not_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#code_must_not_be_zero)

The transfer was not created. [`Transfer.code`](https://docs.tigerbeetle.com/reference/transfer#code) is zero, but<br/>
must be nonzero.

### [`debit_account_not_found`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#debit_account_not_found)

The transfer was not created. [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
must refer to an existing `Account`.

This is a [transient error](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed). The [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) associated with<br/>
this particular attempt will always fail upon retry, even if the<br/>
underlying issue is resolved. To succeed, a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id) must be<br/>
submitted.

### [`credit_account_not_found`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#credit_account_not_found)

The transfer was not created. [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
must refer to an existing `Account`.

This is a [transient error](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed). The [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) associated with<br/>
this particular attempt will always fail upon retry, even if the<br/>
underlying issue is resolved. To succeed, a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id) must be<br/>
submitted.

### [`accounts_must_have_the_same_ledger`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#accounts_must_have_the_same_ledger)

The transfer was not created. The accounts referred to by [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
and [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
must have an identical [`ledger`](https://docs.tigerbeetle.com/reference/account#ledger).

[Currency\\<br/>
exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange) is implemented with multiple transfers.

### [`transfer_must_have_the_same_ledger_as_accounts`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#transfer_must_have_the_same_ledger_as_accounts)

The transfer was not created. The accounts referred to by [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
and [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
are equivalent, but differ from the [`Transfer.ledger`](https://docs.tigerbeetle.com/reference/transfer#ledger).

### [`pending_transfer_not_found`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_not_found)

The transfer was not created. The transfer referenced by [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
does not exist.

This is a [transient error](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed). The [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) associated with<br/>
this particular attempt will always fail upon retry, even if the<br/>
underlying issue is resolved. To succeed, a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id) must be<br/>
submitted.

### [`pending_transfer_not_pending`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_not_pending)

The transfer was not created. The transfer referenced by [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
exists, but does not have [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending)<br/>
set.

### [`pending_transfer_has_different_debit_account_id`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_has_different_debit_account_id)

The transfer was not created. The transfer referenced by [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
exists, but with a different [`debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id).

The post/void transfer's `debit_account_id` must either be<br/>
`0` or identical to the pending transfer's<br/>
`debit_account_id`.

### [`pending_transfer_has_different_credit_account_id`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_has_different_credit_account_id)

The transfer was not created. The transfer referenced by [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
exists, but with a different [`credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id).

The post/void transfer's `credit_account_id` must either<br/>
be `0` or identical to the pending transfer's<br/>
`credit_account_id`.

### [`pending_transfer_has_different_ledger`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_has_different_ledger)

The transfer was not created. The transfer referenced by [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
exists, but with a different [`ledger`](https://docs.tigerbeetle.com/reference/transfer#ledger).

The post/void transfer's `ledger` must either be<br/>
`0` or identical to the pending transfer's<br/>
`ledger`.

### [`pending_transfer_has_different_code`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_has_different_code)

The transfer was not created. The transfer referenced by [`Transfer.pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
exists, but with a different [`code`](https://docs.tigerbeetle.com/reference/transfer#code).

The post/void transfer's `code` must either be<br/>
`0` or identical to the pending transfer's<br/>
`code`.

### [`exceeds_pending_transfer_amount`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exceeds_pending_transfer_amount)

The transfer was not created. The transfer's [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount) exceeds the<br/>
`amount` of its [pending](https://docs.tigerbeetle.com/reference/transfer#pending_id) transfer.

### [`pending_transfer_has_different_amount`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_has_different_amount)

The transfer was not created. The transfer is attempting to [void](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer) a pending<br/>
transfer. The voiding transfer's [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount) must be either<br/>
`0` or exactly the `amount` of the pending<br/>
transfer.

To partially void a transfer, create a [posting transfer](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)<br/>
with an amount less than the pending transfer's `amount`.

Client release < 0.16.0

To partially void a transfer, create a [posting transfer](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)<br/>
with an amount between `0` and the pending transfer's<br/>
`amount`.

### [`pending_transfer_already_posted`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_already_posted)

The transfer was not created. The referenced [pending](https://docs.tigerbeetle.com/reference/transfer#pending_id) transfer was already posted<br/>
by a [`post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer).

### [`pending_transfer_already_voided`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_already_voided)

The transfer was not created. The referenced [pending](https://docs.tigerbeetle.com/reference/transfer#pending_id) transfer was already voided<br/>
by a [`void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer).

### [`pending_transfer_expired`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#pending_transfer_expired)

The transfer was not created. The referenced [pending](https://docs.tigerbeetle.com/reference/transfer#pending_id) transfer was already voided<br/>
because its [timeout](https://docs.tigerbeetle.com/reference/transfer#timeout) has passed.

### [`imported_event_timestamp_must_not_regress`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_timestamp_must_not_regress)

This result only applies when [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
is set.

The transfer was not created. The user-defined [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp)<br/>
regressed, but it must be greater than the last timestamp assigned to<br/>
any `Transfer` in the cluster and cannot be equal to the<br/>
timestamp of any existing [`Account`](https://docs.tigerbeetle.com/reference/account).

### [`imported_event_timestamp_must_postdate_debit_account`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_timestamp_must_postdate_debit_account)

This result only applies when [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
is set.

The transfer was not created. [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
must refer to an `Account` whose [`timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) is less than<br/>
the [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp).

### [`imported_event_timestamp_must_postdate_credit_account`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_timestamp_must_postdate_credit_account)

This result only applies when [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
is set.

The transfer was not created. [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
must refer to an `Account` whose [`timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) is less than<br/>
the [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp).

### [`imported_event_timeout_must_be_zero`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#imported_event_timeout_must_be_zero)

This result only applies when [`Transfer.flags.imported`](https://docs.tigerbeetle.com/reference/transfer#flagsimported)<br/>
is set.

The transfer was not created. The [`Transfer.timeout`](https://docs.tigerbeetle.com/reference/transfer#timeout) is<br/>
nonzero, but must be zero.

It's possible to import [pending](https://docs.tigerbeetle.com/reference/transfer#flagspending) transfers with a<br/>
user-defined timestamp, but since it's not driven by the cluster clock,<br/>
it cannot define a timeout for automatic expiration. In those cases, the<br/>
[two-phase post or\\<br/>
rollback](https://docs.tigerbeetle.com/coding/two-phase-transfers) must be done manually.

### [`debit_account_already_closed`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#debit_account_already_closed)

The transfer was not created. [`Transfer.debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)<br/>
must refer to an `Account` whose [`Account.flags.closed`](https://docs.tigerbeetle.com/reference/account#flagsclosed)<br/>
is not already set.

This is a [transient error](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed). The [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) associated with<br/>
this particular attempt will always fail upon retry, even if the<br/>
underlying issue is resolved. To succeed, a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id) must be<br/>
submitted.

### [`credit_account_already_closed`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#credit_account_already_closed)

The transfer was not created. [`Transfer.credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)<br/>
must refer to an `Account` whose [`Account.flags.closed`](https://docs.tigerbeetle.com/reference/account#flagsclosed)<br/>
is not already set.

This is a [transient error](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed). The [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) associated with<br/>
this particular attempt will always fail upon retry, even if the<br/>
underlying issue is resolved. To succeed, a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id) must be<br/>
submitted.

### [`overflows_debits_pending`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#overflows_debits_pending)

The transfer was not created.<br/>
`debit_account.debits_pending + transfer.amount` would<br/>
overflow a 128-bit unsigned integer.

### [`overflows_credits_pending`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#overflows_credits_pending)

The transfer was not created.<br/>
`credit_account.credits_pending + transfer.amount` would<br/>
overflow a 128-bit unsigned integer.

### [`overflows_debits_posted`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#overflows_debits_posted)

The transfer was not created.<br/>
`debit_account.debits_posted + transfer.amount` would<br/>
overflow a 128-bit unsigned integer.

### [`overflows_credits_posted`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#overflows_credits_posted)

The transfer was not created.<br/>
`debit_account.credits_posted + transfer.amount` would<br/>
overflow a 128-bit unsigned integer.

### [`overflows_debits`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#overflows_debits)

The transfer was not created.<br/>
`debit_account.debits_pending + debit_account.debits_posted + transfer.amount`<br/>
would overflow a 128-bit unsigned integer.

### [`overflows_credits`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#overflows_credits)

The transfer was not created.<br/>
`credit_account.credits_pending + credit_account.credits_posted + transfer.amount`<br/>
would overflow a 128-bit unsigned integer.

### [`overflows_timeout`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#overflows_timeout)

The transfer was not created.<br/>
`transfer.timestamp + (transfer.timeout * 1_000_000_000)`<br/>
would exceed `2^63`.

[`Transfer.timeout`](https://docs.tigerbeetle.com/reference/transfer#timeout) is<br/>
converted to nanoseconds.

This computation uses the [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp)<br/>
value assigned by the replica, not the `0` value sent by the<br/>
client.

### [`exceeds_credits`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exceeds_credits)

The transfer was not created.

The [debit account](https://docs.tigerbeetle.com/reference/transfer#debit_account_id) has<br/>
[`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
set, but<br/>
`debit_account.debits_pending + debit_account.debits_posted + transfer.amount`<br/>
would exceed `debit_account.credits_posted`.

This is a [transient error](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed). The [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) associated with<br/>
this particular attempt will always fail upon retry, even if the<br/>
underlying issue is resolved. To succeed, a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id) must be<br/>
submitted.

Client release < 0.16.0

If [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_debit)<br/>
is set, then<br/>
`debit_account.debits_pending + debit_account.debits_posted + 1`<br/>
would exceed `debit_account.credits_posted`.

### [`exceeds_debits`](https://docs.tigerbeetle.com/reference/requests/create_transfers/#exceeds_debits)

The transfer was not created.

The [credit account](https://docs.tigerbeetle.com/reference/transfer#credit_account_id) has<br/>
[`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
set, but<br/>
`credit_account.credits_pending + credit_account.credits_posted + transfer.amount`<br/>
would exceed `credit_account.debits_posted`.

This is a [transient error](https://docs.tigerbeetle.com/reference/requests/create_transfers/#id_already_failed). The [`Transfer.id`](https://docs.tigerbeetle.com/reference/transfer#id) associated with<br/>
this particular attempt will always fail upon retry, even if the<br/>
underlying issue is resolved. To succeed, a new [idempotency id](https://docs.tigerbeetle.com/coding/data-modeling#id) must be<br/>
submitted.

Client release < 0.16.0

If [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer#flagsbalancing_credit)<br/>
is set, then<br/>
`credit_account.credits_pending + credit_account.credits_posted + 1`<br/>
would exceed `credit_account.debits_posted`.

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/create_transfers/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#create-transfers)
- [Java\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/java/#create-transfers)
- [Go library](https://docs.tigerbeetle.com/coding/clients/go/#create-transfers)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#create-transfers)
- [Python\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/python/#create-transfers)

## [Internals](https://docs.tigerbeetle.com/reference/requests/create_transfers/#internals)

If you're curious and want to learn more, you can find the source<br/>
code for creating a transfer in [src/state_machine.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/state_machine.zig).<br/>
Search for `fn create_transfer(` and<br/>
`fn execute(`.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/create_transfers.md)

### Get Account Balances

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`get_account_balances`](https://docs.tigerbeetle.com/reference/requests/get_account_balances/#get_account_balances)

Fetch the historical [`AccountBalance`](https://docs.tigerbeetle.com/reference/account-balance) s of a given<br/>
[`Account`](https://docs.tigerbeetle.com/reference/account).

**Only accounts created with the [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) flag set**<br/>
**retain historical balances.** This is off by default.

- Each balance returned has a corresponding transfer with the same<br/>
  [`timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp). See the<br/>
  [`get_account_transfers`](https://docs.tigerbeetle.com/reference/requests/get_account_transfers)<br/>
  operation for more details.

- The amounts refer to the account balance recorded _after_<br/>
  the transfer execution.

- [Pending](https://docs.tigerbeetle.com/reference/transfer#flagspending) balances<br/>
  automatically removed due to [timeout](https://docs.tigerbeetle.com/reference/transfer#timeout) expiration don't change<br/>
  historical balances.

## [Event](https://docs.tigerbeetle.com/reference/requests/get_account_balances/#event)

The account filter. See [`AccountFilter`](https://docs.tigerbeetle.com/reference/account-filter) for<br/>
constraints.

## [Result](https://docs.tigerbeetle.com/reference/requests/get_account_balances/#result)

- If the account has the flag [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) set and any<br/>
  matching balances exist, return an array of [`AccountBalance`](https://docs.tigerbeetle.com/reference/account-balance) s.
- If the account does not have the flag [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) set, return<br/>
  nothing.
- If no matching balances exist, return nothing.
- If any constraint is violated, return nothing.

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/get_account_balances/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#get-account-balances)
- [Java\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/java/#get-account-balances)
- [Go\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/go/#get-account-balances)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#get-account-balances)
- [Python\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/python/#get-account-balances)

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/get_account_balances.md)

### Get Account Transfers

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`get_account_transfers`](https://docs.tigerbeetle.com/reference/requests/get_account_transfers/#get_account_transfers)

Fetch [`Transfer`](https://docs.tigerbeetle.com/reference/transfer) s involving a<br/>
given [`Account`](https://docs.tigerbeetle.com/reference/account).

## [Event](https://docs.tigerbeetle.com/reference/requests/get_account_transfers/#event)

The account filter. See [`AccountFilter`](https://docs.tigerbeetle.com/reference/account-filter) for<br/>
constraints.

## [Result](https://docs.tigerbeetle.com/reference/requests/get_account_transfers/#result)

- Return a (possibly empty) array of [`Transfer`](https://docs.tigerbeetle.com/reference/transfer) s that match the<br/>
  filter.
- If any constraint is violated, return nothing.
- By default, `Transfer` s are sorted chronologically by<br/>
  `timestamp`. You can use the [`reversed`](https://docs.tigerbeetle.com/reference/account-filter#flagsreversed) to<br/>
  change this.
- The result is always limited in size. If there are more results, you<br/>
  need to page through them using the `AccountFilter`'s [`timestamp_min`](https://docs.tigerbeetle.com/reference/account-filter#timestamp_min)<br/>
  and/or [`timestamp_max`](https://docs.tigerbeetle.com/reference/account-filter#timestamp_max).

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/get_account_transfers/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#get-account-transfers)
- [Java\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/java/#get-account-transfers)
- [Go\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/go/#get-account-transfers)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#get-account-transfers)
- [Python\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/python/#get-account-transfers)

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/get_account_transfers.md)

### Lookup Accounts

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`lookup_accounts`](https://docs.tigerbeetle.com/reference/requests/lookup_accounts/#lookup_accounts)

Fetch one or more accounts by their `id` s.

⚠️ Note that you **should not** check an account's<br/>
balance using this request before creating a transfer. That would not be<br/>
atomic and the balance could change in between the check and the<br/>
transfer. Instead, set the [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
or [`credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
flag on the accounts to limit their account balances. More complex<br/>
conditional transfers can be expressed using [balance-conditional\\<br/>
transfers](https://docs.tigerbeetle.com/coding/recipes/balance-conditional-transfers).

⚠️ It is not possible currently to look up more than a full batch<br/>
(8190) of accounts atomically. When issuing multiple<br/>
`lookup_accounts` calls, it can happen that other operations<br/>
will interleave between the calls leading to read skew. Consider using<br/>
the [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) flag<br/>
to enable atomic lookups.

## [Event](https://docs.tigerbeetle.com/reference/requests/lookup_accounts/#event)

An [`id`](https://docs.tigerbeetle.com/reference/account#id) belonging to a [`Account`](https://docs.tigerbeetle.com/reference/account).

## [Result](https://docs.tigerbeetle.com/reference/requests/lookup_accounts/#result)

- If the account exists, return the [`Account`](https://docs.tigerbeetle.com/reference/account).
- If the account does not exist, return nothing.

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/lookup_accounts/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#account-lookup)
- [Java library](https://docs.tigerbeetle.com/coding/clients/java/#account-lookup)
- [Go library](https://docs.tigerbeetle.com/coding/clients/go/#account-lookup)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#account-lookup)

## [Internals](https://docs.tigerbeetle.com/reference/requests/lookup_accounts/#internals)

If you're curious and want to learn more, you can find the source<br/>
code for looking up an account in [src/state_machine.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/state_machine.zig).<br/>
Search for `fn execute_lookup_accounts(`.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/lookup_accounts.md)

### Lookup Transfers

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`lookup_transfers`](https://docs.tigerbeetle.com/reference/requests/lookup_transfers/#lookup_transfers)

Fetch one or more transfers by their `id` s.

## [Event](https://docs.tigerbeetle.com/reference/requests/lookup_transfers/#event)

An [`id`](https://docs.tigerbeetle.com/reference/transfer#id) belonging to a [`Transfer`](https://docs.tigerbeetle.com/reference/transfer).

## [Result](https://docs.tigerbeetle.com/reference/requests/lookup_transfers/#result)

- If the transfer exists, return the [`Transfer`](https://docs.tigerbeetle.com/reference/transfer).
- If the transfer does not exist, return nothing.

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/lookup_transfers/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#transfer-lookup)
- [Java\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/java/#transfer-lookup)
- [Go library](https://docs.tigerbeetle.com/coding/clients/go/#transfer-lookup)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#transfer-lookup)

## [Internals](https://docs.tigerbeetle.com/reference/requests/lookup_transfers/#internals)

If you're curious and want to learn more, you can find the source<br/>
code for looking up a transfer in [src/state_machine.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/state_machine.zig).<br/>
Search for `fn execute_lookup_transfers(`.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/lookup_transfers.md)

### Query Accounts

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`query_accounts`](https://docs.tigerbeetle.com/reference/requests/query_accounts/#query_accounts)

Query [`Account`](https://docs.tigerbeetle.com/reference/account) s by the<br/>
intersection of some fields and by timestamp range.

⚠️ It is not possible currently to query more than a full batch<br/>
(8190) of accounts atomically. When issuing multiple<br/>
`query_accounts` calls, it can happen that other operations<br/>
will interleave between the calls leading to read skew. Consider using<br/>
the [`history`](https://docs.tigerbeetle.com/reference/account#flagshistory) flag<br/>
to enable atomic lookups.

## [Event](https://docs.tigerbeetle.com/reference/requests/query_accounts/#event)

The query filter. See [`QueryFilter`](https://docs.tigerbeetle.com/reference/query-filter) for<br/>
constraints.

## [Result](https://docs.tigerbeetle.com/reference/requests/query_accounts/#result)

- Return a (possibly empty) array of [`Account`](https://docs.tigerbeetle.com/reference/account) s that match the<br/>
  filter.
- If any constraint is violated, return nothing.
- By default, `Account` s are sorted chronologically by<br/>
  `timestamp`. You can use the [`reversed`](https://docs.tigerbeetle.com/reference/query-filter#flagsreversed) to<br/>
  change this.
- The result is always limited in size. If there are more results, you<br/>
  need to page through them using the `QueryFilter`'s [`timestamp_min`](https://docs.tigerbeetle.com/reference/query-filter#timestamp_min)<br/>
  and/or [`timestamp_max`](https://docs.tigerbeetle.com/reference/query-filter#timestamp_max).

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/query_accounts/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#query-accounts)
- [Java library](https://docs.tigerbeetle.com/coding/clients/java/#query-accounts)
- [Go library](https://docs.tigerbeetle.com/coding/clients/go/#query-accounts)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#query-accounts)
- [Python\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/python/#query-accounts)

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/query_accounts.md)

### Query Transfers

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`query_transfers`](https://docs.tigerbeetle.com/reference/requests/query_transfers/#query_transfers)

Query [`Transfer`](https://docs.tigerbeetle.com/reference/transfer) s by the<br/>
intersection of some fields and by timestamp range.

## [Event](https://docs.tigerbeetle.com/reference/requests/query_transfers/#event)

The query filter. See [`QueryFilter`](https://docs.tigerbeetle.com/reference/query-filter) for<br/>
constraints.

## [Result](https://docs.tigerbeetle.com/reference/requests/query_transfers/#result)

- Return a (possibly empty) array of [`Transfer`](https://docs.tigerbeetle.com/reference/transfer) s that match the<br/>
  filter.
- If any constraint is violated, return nothing.
- By default, `Transfer` s are sorted chronologically by<br/>
  `timestamp`. You can use the [`reversed`](https://docs.tigerbeetle.com/reference/query-filter#flagsreversed) to<br/>
  change this.
- The result is always limited in size. If there are more results, you<br/>
  need to page through them using the `QueryFilter`'s [`timestamp_min`](https://docs.tigerbeetle.com/reference/query-filter#timestamp_min)<br/>
  and/or [`timestamp_max`](https://docs.tigerbeetle.com/reference/query-filter#timestamp_max).

## [Client libraries](https://docs.tigerbeetle.com/reference/requests/query_transfers/#client-libraries)

For language-specific docs see:

- [.NET\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/dotnet/#query-transfers)
- [Java\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/java/#query-transfers)
- [Go library](https://docs.tigerbeetle.com/coding/clients/go/#query-transfers)
- [Node.js\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/node/#query-transfers)
- [Python\\<br/>
  library](https://docs.tigerbeetle.com/coding/clients/python/#query-transfers)

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/query_transfers.md)

### QueryFilter

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`QueryFilter`](https://docs.tigerbeetle.com/reference/query-filter/#queryfilter)

A `QueryFilter` is a record containing the filter<br/>
parameters for [querying\\<br/>
accounts](https://docs.tigerbeetle.com/reference/requests/query_accounts) and [querying\\<br/>
transfers](https://docs.tigerbeetle.com/reference/requests/query_transfers).

## [Fields](https://docs.tigerbeetle.com/reference/query-filter/#fields)

### [`user_data_128`](https://docs.tigerbeetle.com/reference/query-filter/#user_data_128)

Filter the results by the field [`Account.user_data_128`](https://docs.tigerbeetle.com/reference/account#user_data_128)<br/>
or [`Transfer.user_data_128`](https://docs.tigerbeetle.com/reference/transfer#user_data_128).<br/>
Optional; set to zero to disable the filter.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

### [`user_data_64`](https://docs.tigerbeetle.com/reference/query-filter/#user_data_64)

Filter the results by the field [`Account.user_data_64`](https://docs.tigerbeetle.com/reference/account#user_data_64) or<br/>
[`Transfer.user_data_64`](https://docs.tigerbeetle.com/reference/transfer#user_data_64).<br/>
Optional; set to zero to disable the filter.

Constraints:

- Type is 64-bit unsigned integer (8 bytes)

### [`user_data_32`](https://docs.tigerbeetle.com/reference/query-filter/#user_data_32)

Filter the results by the field [`Account.user_data_32`](https://docs.tigerbeetle.com/reference/account#user_data_32) or<br/>
[`Transfer.user_data_32`](https://docs.tigerbeetle.com/reference/transfer#user_data_32).<br/>
Optional; set to zero to disable the filter.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)

### [`ledger`](https://docs.tigerbeetle.com/reference/query-filter/#ledger)

Filter the results by the field [`Account.ledger`](https://docs.tigerbeetle.com/reference/account#ledger) or [`Transfer.ledger`](https://docs.tigerbeetle.com/reference/transfer#ledger). Optional;<br/>
set to zero to disable the filter.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)

### [`code`](https://docs.tigerbeetle.com/reference/query-filter/#code)

Filter the results by the field [`Account.code`](https://docs.tigerbeetle.com/reference/account#code) or [`Transfer.code`](https://docs.tigerbeetle.com/reference/transfer#code). Optional; set to<br/>
zero to disable the filter.

Constraints:

- Type is 16-bit unsigned integer (2 bytes)

### [`timestamp_min`](https://docs.tigerbeetle.com/reference/query-filter/#timestamp_min)

The minimum [`Account.timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) or [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) from<br/>
which results will be returned, inclusive range. Optional; set to zero<br/>
to disable the lower-bound filter.

Constraints:

- Type is 64-bit unsigned integer (8 bytes)
- Must not be `2^64 - 1`

### [`timestamp_max`](https://docs.tigerbeetle.com/reference/query-filter/#timestamp_max)

The maximum [`Account.timestamp`](https://docs.tigerbeetle.com/reference/account#timestamp) or [`Transfer.timestamp`](https://docs.tigerbeetle.com/reference/transfer#timestamp) from<br/>
which results will be returned, inclusive range. Optional; set to zero<br/>
to disable the upper-bound filter.

Constraints:

- Type is 64-bit unsigned integer (8 bytes)
- Must not be `2^64 - 1`

### [`limit`](https://docs.tigerbeetle.com/reference/query-filter/#limit)

The maximum number of results that can be returned by this query.

Limited by the [maximum message\\<br/>
size](https://docs.tigerbeetle.com/coding/requests#batching-events).

Constraints:

- Type is 32-bit unsigned integer (4 bytes)
- Must not be zero

### [`flags`](https://docs.tigerbeetle.com/reference/query-filter/#flags)

A bitfield that specifies querying behavior.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)

#### [`flags.reversed`](https://docs.tigerbeetle.com/reference/query-filter/#flagsreversed)

Whether the results are sorted by timestamp in chronological or<br/>
reverse-chronological order. If the flag is not set, the event that<br/>
happened first (has the smallest timestamp) will come first. If the flag<br/>
is set, the event that happened last (has the largest timestamp) will<br/>
come first.

### [`reserved`](https://docs.tigerbeetle.com/reference/query-filter/#reserved)

This space may be used for additional data in the future.

Constraints:

- Type is 6 bytes
- Must be zero

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/query-filter.md)

#### Requests

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Requests](https://docs.tigerbeetle.com/reference/requests/#requests)

TigerBeetle supports the following request types:

- [`create_accounts`](https://docs.tigerbeetle.com/reference/requests/create_accounts): create<br/>
  [`Account` s](https://docs.tigerbeetle.com/reference/account)
- [`create_transfers`](https://docs.tigerbeetle.com/reference/requests/create_transfers):<br/>
  create [`Transfer` s](https://docs.tigerbeetle.com/reference/transfer)
- [`lookup_accounts`](https://docs.tigerbeetle.com/reference/requests/lookup_accounts): fetch<br/>
  `Account` s by `id`
- [`lookup_transfers`](https://docs.tigerbeetle.com/reference/requests/lookup_transfers):<br/>
  fetch `Transfer` s by `id`
- [`get_account_transfers`](https://docs.tigerbeetle.com/reference/requests/get_account_transfers):<br/>
  fetch `Transfer` s by `debit_account_id` or<br/>
  `credit_account_id`
- [`get_account_balances`](https://docs.tigerbeetle.com/reference/requests/get_account_balances):<br/>
  fetch the historical account balance by the `Account`'s<br/>
  `id`.
- [`query_accounts`](https://docs.tigerbeetle.com/reference/requests/query_accounts): query<br/>
  `Account` s
- [`query_transfers`](https://docs.tigerbeetle.com/reference/requests/query_transfers): query<br/>
  `Transfer` s

_More request types, including more powerful queries, are coming_<br/>
_soon!_

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/requests/README.md)

## Transfer

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [`Transfer`](https://docs.tigerbeetle.com/reference/transfer/#transfer)

A `transfer` is an immutable record of a financial<br/>
transaction between two accounts.

In TigerBeetle, financial transactions are called "transfers" instead<br/>
of "transactions" because the latter term is heavily overloaded in the<br/>
context of databases.

Note that transfers debit a single account and credit a single<br/>
account on the same ledger. You can compose these into more complex<br/>
transactions using the methods described in [Currency Exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange) and<br/>
[Multi-Debit,\\<br/>
Multi-Credit Transfers](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers).

## [Updates](https://docs.tigerbeetle.com/reference/transfer/#updates)

Transfers _cannot be modified_ after creation.

If a detail of a transfer is incorrect and needs to be modified, this<br/>
is done using [correcting\\<br/>
transfers](https://docs.tigerbeetle.com/coding/recipes/correcting-transfers).

## [Deletion](https://docs.tigerbeetle.com/reference/transfer/#deletion)

Transfers _cannot be deleted_ after creation.

If a transfer is made in error, its effects can be reversed using a<br/>
[correcting\\<br/>
transfer](https://docs.tigerbeetle.com/coding/recipes/correcting-transfers).

## [Guarantees](https://docs.tigerbeetle.com/reference/transfer/#guarantees)

- Transfers are immutable. They are never modified once they are<br/>
  successfully created.
- There is at most one `Transfer` with a particular [`id`](https://docs.tigerbeetle.com/reference/transfer/#id).
- A [pending\\<br/>
  transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers#reserve-funds-pending-transfer) resolves at most once.
- Transfer [timeouts](https://docs.tigerbeetle.com/reference/transfer/#timeout) are deterministic, driven<br/>
  by the [cluster’s\\<br/>
  timestamp](https://docs.tigerbeetle.com/coding/time#why-tigerbeetle-manages-timestamps).

# [Modes](https://docs.tigerbeetle.com/reference/transfer/#modes)

Transfers can either be Single-Phase, where they are executed<br/>
immediately, or Two-Phase, where they are first put in a Pending state<br/>
and then either Posted or Voided. For more details on the latter, see<br/>
the [Two-Phase Transfer\\<br/>
guide](https://docs.tigerbeetle.com/coding/two-phase-transfers).

Fields used by each mode of transfer:

| Field                         | Single-Phase | Pending   | Post-Pending | Void-Pending |
| ----------------------------- | ------------ | --------- | ------------ | ------------ |
| `id`                          | required     | required  | required     | required     |
| `debit_account_id`            | required     | required  | optional     | optional     |
| `credit_account_id`           | required     | required  | optional     | optional     |
| `amount`                      | required     | required  | required     | optional     |
| `pending_id`                  | none         | none      | required     | required     |
| `user_data_128`               | optional     | optional  | optional     | optional     |
| `user_data_64`                | optional     | optional  | optional     | optional     |
| `user_data_32`                | optional     | optional  | optional     | optional     |
| `timeout`                     | none         | optional¹ | none         | none         |
| `ledger`                      | required     | required  | optional     | optional     |
| `code`                        | required     | required  | optional     | optional     |
| `flags.linked`                | optional     | optional  | optional     | optional     |
| `flags.pending`               | false        | true      | false        | false        |
| `flags.post_pending_transfer` | false        | false     | true         | false        |
| `flags.void_pending_transfer` | false        | false     | false        | true         |
| `flags.balancing_debit`       | optional     | optional  | false        | false        |
| `flags.balancing_credit`      | optional     | optional  | false        | false        |
| `flags.closing_debit`         | optional     | true      | false        | false        |
| `flags.closing_credit`        | optional     | true      | false        | false        |
| `flags.imported`              | optional     | optional  | optional     | optional     |
| `timestamp`                   | none²        | none²     | none²        | none²        |

> _¹ None if `flags.imported` is set._
>
> _²_<br/> > _Required if `flags.imported` is set._

# [Fields](https://docs.tigerbeetle.com/reference/transfer/#fields)

## [`id`](https://docs.tigerbeetle.com/reference/transfer/#id)

This is a unique identifier for the transaction.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must not be zero or `2^128 - 1`
- Must not conflict with another transfer in the cluster

See the [`id`\\<br/>
section in the data modeling doc](https://docs.tigerbeetle.com/coding/data-modeling#id) for more recommendations on<br/>
choosing an ID scheme.

Note that transfer IDs are unique for the cluster–not the ledger.<br/>
If you want to store a relationship between multiple transfers, such as<br/>
indicating that multiple transfers on different ledgers were part of a<br/>
single transaction, you should store a transaction ID in one of the [`user_data`](https://docs.tigerbeetle.com/reference/transfer/#user_data_128) fields.

## [`debit_account_id`](https://docs.tigerbeetle.com/reference/transfer/#debit_account_id)

This refers to the account to debit the transfer's [`amount`](https://docs.tigerbeetle.com/reference/transfer/#amount).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- When `flags.post_pending_transfer` and<br/>
  `flags.void_pending_transfer` are _not_ set:

  - Must match an existing account
  - Must not be the same as `credit_account_id`

- When `flags.post_pending_transfer` or<br/>
  `flags.void_pending_transfer` are set:

  - If `debit_account_id` is zero, it will be automatically<br/>
    set to the pending transfer's `debit_account_id`.
  - If `debit_account_id` is nonzero, it must match the<br/>
    corresponding pending transfer's `debit_account_id`.

- When `flags.imported` is set:
  - The matching account's [timestamp](https://docs.tigerbeetle.com/reference/account#timestamp)<br/>
    must be less than or equal to the transfer's [timestamp](https://docs.tigerbeetle.com/reference/transfer/#timestamp).

## [`credit_account_id`](https://docs.tigerbeetle.com/reference/transfer/#credit_account_id)

This refers to the account to credit the transfer's [`amount`](https://docs.tigerbeetle.com/reference/transfer/#amount).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- When `flags.post_pending_transfer` and<br/>
  `flags.void_pending_transfer` are _not_ set:

  - Must match an existing account
  - Must not be the same as `debit_account_id`

- When `flags.post_pending_transfer` or<br/>
  `flags.void_pending_transfer` are set:

  - If `credit_account_id` is zero, it will be automatically<br/>
    set to the pending transfer's `credit_account_id`.
  - If `credit_account_id` is nonzero, it must match the<br/>
    corresponding pending transfer's `credit_account_id`.

- When `flags.imported` is set:
  - The matching account's [timestamp](https://docs.tigerbeetle.com/reference/account#timestamp)<br/>
    must be less than or equal to the transfer's [timestamp](https://docs.tigerbeetle.com/reference/transfer/#timestamp).

## [`amount`](https://docs.tigerbeetle.com/reference/transfer/#amount)

This is how much should be debited from the<br/>
`debit_account_id` account and credited to the<br/>
`credit_account_id` account.

Note that this is an unsigned 128-bit integer. You can read more<br/>
about using [debits and\\<br/>
credits](https://docs.tigerbeetle.com/coding/data-modeling#debits-vs-credits) to represent positive and negative balances as well as [fractional\\<br/>
amounts and asset scales](https://docs.tigerbeetle.com/coding/data-modeling#fractional-amounts-and-asset-scale).

- When `flags.balancing_debit` is set, this is the maximum<br/>
  amount that will be debited/credited, where the actual transfer amount<br/>
  is determined by the debit account's constraints.
- When `flags.balancing_credit` is set, this is the maximum<br/>
  amount that will be debited/credited, where the actual transfer amount<br/>
  is determined by the credit account's constraints.
- When `flags.post_pending_transfer` is set, the amount<br/>
  posted will be:

  - the pending transfer's amount, when the posted transfer's<br/>
    `amount` is `AMOUNT_MAX`
  - the posting transfer's amount, when the posted transfer's<br/>
    `amount` is less than or equal to the pending transfer's<br/>
    amount.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- When `flags.void_pending_transfer` is set:
  - If `amount` is zero, it will be automatically be set to<br/>
    the pending transfer's `amount`.
  - If `amount` is nonzero, it must be equal to the pending<br/>
    transfer's `amount`.
- When `flags.post_pending_transfer` is set:
  - If `amount` is `AMOUNT_MAX`<br/>
    (`2^128 - 1`), it will automatically be set to the pending<br/>
    transfer's `amount`.
  - If `amount` is not `AMOUNT_MAX`, it must be<br/>
    less than or equal to the pending transfer's `amount`.

Client release < 0.16.0

Additional constraints:

- When `flags.post_pending_transfer` is set:
  - If `amount` is zero, it will be automatically be set to<br/>
    the pending transfer's `amount`.
  - If `amount` is nonzero, it must be less than or equal to<br/>
    the pending transfer's `amount`.
- When `flags.balancing_debit` and/or<br/>
  `flags.balancing_credit` is set, if `amount` is<br/>
  zero, it will automatically be set to the maximum amount that does not<br/>
  violate the corresponding account limits. (Equivalent to setting<br/>
  `amount = 2^128 - 1`).
- When all of the following flags are not set, `amount`<br/>
  must be nonzero:

  - `flags.post_pending_transfer`
  - `flags.void_pending_transfer`
  - `flags.balancing_debit`
  - `flags.balancing_credit`

### [Examples](https://docs.tigerbeetle.com/reference/transfer/#examples)

- For representing fractional amounts (e.g. `$12.34`), see<br/>
  [Fractional\\<br/>
  Amounts](https://docs.tigerbeetle.com/coding/data-modeling#fractional-amounts-and-asset-scale).
- For balancing transfers, see [Close Account](https://docs.tigerbeetle.com/coding/recipes/close-account).

## [`pending_id`](https://docs.tigerbeetle.com/reference/transfer/#pending_id)

If this transfer will post or void a pending transfer,<br/>
`pending_id` references that pending transfer. If this is not<br/>
a post or void transfer, it must be zero.

See the section on [Two-Phase Transfers](https://docs.tigerbeetle.com/coding/two-phase-transfers) for more<br/>
information on how the `pending_id` is used.

Constraints:

- Type is 128-bit unsigned integer (16 bytes)
- Must be zero if neither void nor pending transfer flag is set
- Must match an existing transfer's [`id`](https://docs.tigerbeetle.com/reference/transfer/#id)<br/>
  if non-zero

## [`user_data_128`](https://docs.tigerbeetle.com/reference/transfer/#user_data_128)

This is an optional 128-bit secondary identifier to link this<br/>
transfer to an external entity or event.

When set to zero, no secondary identifier will be associated with the<br/>
account, therefore only non-zero values can be used as [query filter](https://docs.tigerbeetle.com/reference/query-filter).

When set to zero, if [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagspost_pending_transfer)<br/>
or [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagsvoid_pending_transfer)<br/>
is set, then it will be automatically set to the pending transfer's<br/>
`user_data_128`.

As an example, you might generate a [TigerBeetle\\<br/>
Time-Based Identifier](https://docs.tigerbeetle.com/coding/data-modeling#tigerbeetle-time-based-identifiers-recommended) that ties together a group of transfers.

For more information, see [Data Modeling](https://docs.tigerbeetle.com/coding/data-modeling#user_data).

Constraints:

- Type is 128-bit unsigned integer (16 bytes)

## [`user_data_64`](https://docs.tigerbeetle.com/reference/transfer/#user_data_64)

This is an optional 64-bit secondary identifier to link this transfer<br/>
to an external entity or event.

When set to zero, no secondary identifier will be associated with the<br/>
account, therefore only non-zero values can be used as [query filter](https://docs.tigerbeetle.com/reference/query-filter).

When set to zero, if [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagspost_pending_transfer)<br/>
or [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagsvoid_pending_transfer)<br/>
is set, then it will be automatically set to the pending transfer's<br/>
`user_data_64`.

As an example, you might use this field store an external<br/>
timestamp.

For more information, see [Data Modeling](https://docs.tigerbeetle.com/coding/data-modeling#user_data).

Constraints:

- Type is 64-bit unsigned integer (8 bytes)

## [`user_data_32`](https://docs.tigerbeetle.com/reference/transfer/#user_data_32)

This is an optional 32-bit secondary identifier to link this transfer<br/>
to an external entity or event.

When set to zero, no secondary identifier will be associated with the<br/>
account, therefore only non-zero values can be used as [query filter](https://docs.tigerbeetle.com/reference/query-filter).

When set to zero, if [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagspost_pending_transfer)<br/>
or [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagsvoid_pending_transfer)<br/>
is set, then it will be automatically set to the pending transfer's<br/>
`user_data_32`.

As an example, you might use this field to store a timezone or<br/>
locale.

For more information, see [Data Modeling](https://docs.tigerbeetle.com/coding/data-modeling#user_data).

Constraints:

- Type is 32-bit unsigned integer (4 bytes)

## [`timeout`](https://docs.tigerbeetle.com/reference/transfer/#timeout)

This is the interval in seconds after a [`pending`](https://docs.tigerbeetle.com/reference/transfer/#flagspending) transfer's [arrival at the cluster](https://docs.tigerbeetle.com/reference/transfer/#timestamp) that it may be [posted](https://docs.tigerbeetle.com/reference/transfer/#flagspost_pending_transfer) or [voided](https://docs.tigerbeetle.com/reference/transfer/#flagsvoid_pending_transfer). Zero denotes absence of<br/>
timeout.

Non-pending transfers cannot have a timeout.

Imported transfers cannot have a timeout.

TigerBeetle makes a best-effort approach to remove pending balances<br/>
of expired transfers automatically:

- Transfers expire _exactly_ at their expiry time ([`timestamp`](https://docs.tigerbeetle.com/reference/transfer/#timestamp) _plus_ `timeout` converted in nanoseconds).
- Pending balances will never be removed before its<br/>
  expiry.

- Expired transfers cannot be manually posted or voided.
- It is not guaranteed that the pending balance will be removed<br/>
  exactly at its expiry.

In particular, client requests may observe still-pending balances for<br/>
expired transfers.

- Pending balances are removed in chronological order by expiry. If<br/>
  multiple transfers expire at the same time, then ordered by the<br/>
  transfer's creation [`timestamp`](https://docs.tigerbeetle.com/reference/transfer/#timestamp).

If a transfer `A` has expiry `E₁` and transfer<br/>
`B` has expiry `E₂`, and `E₁<E₂`, if<br/>
transfer `B` had the pending balance removed, then transfer<br/>
`A` had the pending balance removed as well.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)
- Must be zero if `flags.pending` is _not_ set
- Must be zero if `flags.imported` is set.

The `timeout` is an interval in seconds rather than an<br/>
absolute timestamp because this is more robust to clock skew between the<br/>
cluster and the application. (Watch this talk on [Detecting Clock\\<br/>
Sync Failure in Highly Available Systems](https://youtu.be/7R-Iz6sJG6Q?si=9sD2TpfD29AxUjOY) on YouTube for more<br/>
details.)

## [`ledger`](https://docs.tigerbeetle.com/reference/transfer/#ledger)

This is an identifier that partitions the sets of accounts that can<br/>
transact with each other.

See [data modeling](https://docs.tigerbeetle.com/coding/data-modeling#ledgers)<br/>
for more details about how to think about setting up your ledgers.

Constraints:

- Type is 32-bit unsigned integer (4 bytes)
- When `flags.post_pending_transfer` or<br/>
  `flags.void_pending_transfer` is set:

  - If `ledger` is zero, it will be automatically be set to<br/>
    the pending transfer's `ledger`.
  - If `ledger` is nonzero, it must match the<br/>
    `ledger` value on the pending transfer's<br/>
    `debit_account_id` **and** `credit_account_id`.

- When `flags.post_pending_transfer` and<br/>
  `flags.void_pending_transfer` are not set:

  - `ledger` must not be zero.
  - `ledger` must match the `ledger` value on the<br/>
    accounts referenced in `debit_account_id` **and** `credit_account_id`.

## [`code`](https://docs.tigerbeetle.com/reference/transfer/#code)

This is a user-defined enum denoting the reason for (or category of)<br/>
the transfer.

Constraints:

- Type is 16-bit unsigned integer (2 bytes)
- When `flags.post_pending_transfer` or<br/>
  `flags.void_pending_transfer` is set:

  - If `code` is zero, it will be automatically be set to the<br/>
    pending transfer's `code`.
  - If `code` is nonzero, it must match the pending<br/>
    transfer's `code`.

- When `flags.post_pending_transfer` and<br/>
  `flags.void_pending_transfer` are not set, `code`<br/>
  must not be zero.

## [`flags`](https://docs.tigerbeetle.com/reference/transfer/#flags)

This specifies (optional) transfer behavior.

Constraints:

- Type is 16-bit unsigned integer (2 bytes)
- Some flags are mutually exclusive; see [`flags_are_mutually_exclusive`](https://docs.tigerbeetle.com/reference/requests/create_transfers#flags_are_mutually_exclusive).

### [`flags.linked`](https://docs.tigerbeetle.com/reference/transfer/#flagslinked)

This flag links the result of this transfer to the outcome of the<br/>
next transfer in the request such that they will either succeed or fail<br/>
together.

The last transfer in a chain of linked transfers does<br/>
**not** have this flag set.

You can read more about [linked\\<br/>
events](https://docs.tigerbeetle.com/coding/linked-events).

#### [Examples](https://docs.tigerbeetle.com/reference/transfer/#examples-1)

- [Currency\\<br/>
  Exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange)

### [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer/#flagspending)

Mark the transfer as a [pending\\<br/>
transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers#reserve-funds-pending-transfer).

### [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagspost_pending_transfer)

Mark the transfer as a [post-pending\\<br/>
transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers#post-pending-transfer).

### [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer/#flagsvoid_pending_transfer)

Mark the transfer as a [void-pending\\<br/>
transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers#void-pending-transfer).

### [`flags.balancing_debit`](https://docs.tigerbeetle.com/reference/transfer/#flagsbalancing_debit)

Transfer at most [`amount`](https://docs.tigerbeetle.com/reference/transfer/#amount)—<br/>
automatically transferring less than `amount` as necessary<br/>
such that<br/>
`debit_account.debits_pending + debit_account.debits_posted ≤ debit_account.credits_posted`.

The `amount` of the recorded transfer is set to the actual<br/>
amount that was transferred, which is less than or equal to the amount<br/>
that was passed to `create_transfers`.

Retrying a balancing transfer will return [`exists_with_different_amount`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exists_with_different_amount)<br/>
only when the maximum amount passed to `create_transfers` is<br/>
insufficient to fulfill the amount that was actually transferred.<br/>
Otherwise it may return [`exists`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exists) even<br/>
if the retry amount differs from the original value.

`flags.balancing_debit` is exclusive with the<br/>
`flags.post_pending_transfer`/ `flags.void_pending_transfer`<br/>
flags because posting or voiding a pending transfer will never<br/>
exceed/overflow either account's limits.

`flags.balancing_debit` is compatible with (and orthogonal<br/>
to) `flags.balancing_credit`.

Client release < 0.16.0

Transfer at most [`amount`](https://docs.tigerbeetle.com/reference/transfer/#amount)—<br/>
automatically transferring less than `amount` as necessary<br/>
such that<br/>
`debit_account.debits_pending + debit_account.debits_posted ≤ debit_account.credits_posted`.<br/>
If `amount` is set to `0`, transfer at most<br/>
`2^64 - 1` (i.e. as much as possible).

If the highest amount transferable is `0`, returns [`exceeds_credits`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exceeds_credits).

#### [Examples](https://docs.tigerbeetle.com/reference/transfer/#examples-2)

- [Close Account](https://docs.tigerbeetle.com/coding/recipes/close-account)

### [`flags.balancing_credit`](https://docs.tigerbeetle.com/reference/transfer/#flagsbalancing_credit)

Transfer at most [`amount`](https://docs.tigerbeetle.com/reference/transfer/#amount)—<br/>
automatically transferring less than `amount` as necessary<br/>
such that<br/>
`credit_account.credits_pending + credit_account.credits_posted ≤ credit_account.debits_posted`.

The `amount` of the recorded transfer is set to the actual<br/>
amount that was transferred, which is less than or equal to the amount<br/>
that was passed to `create_transfers`.

Retrying a balancing transfer will return [`exists_with_different_amount`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exists_with_different_amount)<br/>
only when the maximum amount passed to `create_transfers` is<br/>
insufficient to fulfill the amount that was actually transferred.<br/>
Otherwise it may return [`exists`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exists) even<br/>
if the retry amount differs from the original value.

`flags.balancing_credit` is exclusive with the<br/>
`flags.post_pending_transfer`/ `flags.void_pending_transfer`<br/>
flags because posting or voiding a pending transfer will never<br/>
exceed/overflow either account's limits.

`flags.balancing_credit` is compatible with (and<br/>
orthogonal to) `flags.balancing_debit`.

Client release < 0.16.0

Transfer at most [`amount`](https://docs.tigerbeetle.com/reference/transfer/#amount)—<br/>
automatically transferring less than `amount` as necessary<br/>
such that<br/>
`credit_account.credits_pending + credit_account.credits_posted ≤ credit_account.debits_posted`.<br/>
If `amount` is set to `0`, transfer at most<br/>
`2^64 - 1` (i.e. as much as possible).

If the highest amount transferable is `0`, returns [`exceeds_debits`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exceeds_debits).

#### [Examples](https://docs.tigerbeetle.com/reference/transfer/#examples-3)

- [Close Account](https://docs.tigerbeetle.com/coding/recipes/close-account)

### [`flags.closing_debit`](https://docs.tigerbeetle.com/reference/transfer/#flagsclosing_debit)

When set, it will cause the [`Account.flags.closed`](https://docs.tigerbeetle.com/reference/account#flagsclosed) flag<br/>
of the [debit account](https://docs.tigerbeetle.com/reference/transfer/#debit_account_id) to be set if the<br/>
transfer succeeds.

This flag requires a [two-phase transfer](https://docs.tigerbeetle.com/reference/transfer/#modes), so the<br/>
flag [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer/#flagspending) must also be<br/>
set. This ensures that closing transfers are reversible by [voiding](https://docs.tigerbeetle.com/reference/transfer/#flagsvoid_pending_transfer) the pending transfer, and<br/>
requires that the reversal operation references the corresponding<br/>
closing transfer, guarding against unexpected interleaving of<br/>
close/unclose operations.

### [`flags.closing_credit`](https://docs.tigerbeetle.com/reference/transfer/#flagsclosing_credit)

When set, it will cause the [`Account.flags.closed`](https://docs.tigerbeetle.com/reference/account#flagsclosed) flag<br/>
of the [credit account](https://docs.tigerbeetle.com/reference/transfer/#credit_account_id) to be set if the<br/>
transfer succeeds.

This flag requires a [two-phase transfer](https://docs.tigerbeetle.com/reference/transfer/#modes), so the<br/>
flag [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer/#flagspending) must also be<br/>
set. This ensures that closing transfers are reversible by [voiding](https://docs.tigerbeetle.com/reference/transfer/#flagsvoid_pending_transfer) the pending transfer, and<br/>
requires that the reversal operation references the corresponding<br/>
closing transfer, guarding against unexpected interleaving of<br/>
close/unclose operations.

### [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer/#flagsimported)

When set, allows importing historical `Transfer` s with<br/>
their original [`timestamp`](https://docs.tigerbeetle.com/reference/transfer/#timestamp).

TigerBeetle will not use the [cluster\\<br/>
clock](https://docs.tigerbeetle.com/coding/time) to assign the timestamp, allowing the user to define it,<br/>
expressing _when_ the transfer was effectively created by an<br/>
external event.

To maintain system invariants regarding auditability and<br/>
traceability, some constraints are necessary:

- It is not allowed to mix events with the `imported`<br/>
  flag set and _not_ set in the same batch. The application must<br/>
  submit batches of imported events separately.

- User-defined timestamps must be **unique** and<br/>
  expressed as nanoseconds since the UNIX epoch. No two objects can have<br/>
  the same timestamp, even different objects like an `Account`<br/>
  and a `Transfer` cannot share the same timestamp.

- User-defined timestamps must be a past date, never ahead of the<br/>
  cluster clock at the time the request arrives.

- Timestamps must be strictly increasing.

Even user-defined timestamps that are required to be past dates need<br/>
to be at least one nanosecond ahead of the timestamp of the last<br/>
transfer committed by the cluster.

Since the timestamp cannot regress, importing past events can be<br/>
naturally restrictive without coordination, as the last timestamp can be<br/>
updated using the cluster clock during regular cluster activity.<br/>
Instead, it's recommended to import events only on a fresh cluster or<br/>
during a scheduled maintenance window.

It's recommended to submit the entire batch as a [linked chain](https://docs.tigerbeetle.com/reference/transfer/#flagslinked), ensuring that if any transfer<br/>
fails, none of them are committed, preserving the last timestamp<br/>
unchanged. This approach gives the application a chance to correct<br/>
failed imported transfers, re-submitting the batch again with the same<br/>
user-defined timestamps.

- Imported transfers cannot have a [`timeout`](https://docs.tigerbeetle.com/reference/transfer/#timeout).

It's possible to import [pending](https://docs.tigerbeetle.com/reference/transfer/#flagspending) transfers<br/>
with a user-defined timestamp, but since it's not driven by the cluster<br/>
clock, it cannot define a [`timeout`](https://docs.tigerbeetle.com/reference/transfer/#timeout)<br/>
for automatic expiration. In those cases, the [two-phase post or rollback](https://docs.tigerbeetle.com/coding/two-phase-transfers)<br/>
must be done manually.

## [`timestamp`](https://docs.tigerbeetle.com/reference/transfer/#timestamp)

This is the time the transfer was created, as nanoseconds since UNIX<br/>
epoch. You can read more about [Time in\\<br/>
TigerBeetle](https://docs.tigerbeetle.com/coding/time).

Constraints:

- Type is 64-bit unsigned integer (8 bytes)
- Must be `0` when the `Transfer` is created<br/>
  with [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer/#flagsimported) _not_ set

It is set by TigerBeetle to the moment the transfer arrives at the<br/>
cluster.

- Must be greater than `0` and less than<br/>
  `2^63` when the `Transfer` is created with [`flags.imported`](https://docs.tigerbeetle.com/reference/transfer/#flagsimported) set

# [Internals](https://docs.tigerbeetle.com/reference/transfer/#internals)

If you're curious and want to learn more, you can find the source<br/>
code for this struct in [src/tigerbeetle.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/tigerbeetle.zig).<br/>
Search for `const Transfer = extern struct {`.

You can find the source code for creating a transfer in [src/state_machine.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/state_machine.zig).<br/>
Search for `fn create_transfer(`.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/reference/transfer.md)
