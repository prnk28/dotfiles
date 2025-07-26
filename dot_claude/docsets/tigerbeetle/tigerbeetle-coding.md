---
tags:
  - "#database"
  - "#infrastructure"
  - "#architecture"
  - "#financial-accounting"
  - "#distributed-systems"
  - "#data-modeling"
  - "#transaction-processing"
  - "#data-consistency"
  - "#financial-systems"
  - "#double-entry-accounting"
  - "#distributed-ledger"
  - "#financial-database"
---
# Data Modeling

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Data\ Modeling](https://docs.tigerbeetle.com/coding/data-modeling/#data-modeling)

This section describes various aspects of the TigerBeetle data model<br/>
and provides some suggestions for how you can map your application's<br/>
requirements onto the data model.

## [Accounts,\ Transfers, and Ledgers](https://docs.tigerbeetle.com/coding/data-modeling/#accounts-transfers-and-ledgers)

The TigerBeetle data model consists of [`Account` s](https://docs.tigerbeetle.com/reference/account), [`Transfer` s](https://docs.tigerbeetle.com/reference/transfer), and<br/>
ledgers.

### [Ledgers](https://docs.tigerbeetle.com/coding/data-modeling/#ledgers)

Ledgers partition accounts into groups that may represent a currency<br/>
or asset type or any other logical grouping. Only accounts on the same<br/>
ledger can transact directly, but you can use atomically linked<br/>
transfers to implement [currency\\<br/>
exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange).

Ledgers are only stored in TigerBeetle as a numeric identifier on the<br/>
[account](https://docs.tigerbeetle.com/reference/account#ledger) and [transfer](https://docs.tigerbeetle.com/reference/transfer) data structures. You may<br/>
want to store additional metadata about each ledger in a control plane<br/>
[database](https://docs.tigerbeetle.com/coding/system-architecture).

You can also use different ledgers to further partition accounts,<br/>
beyond asset type. For example, if you have a multi-tenant setup where<br/>
you are tracking balances for your customers' end-users, you might have<br/>
a ledger for each of your customers. If customers have end-user accounts<br/>
in multiple currencies, each of your customers would have multiple<br/>
ledgers.

## [Debits vs Credits](https://docs.tigerbeetle.com/coding/data-modeling/#debits-vs-credits)

TigerBeetle tracks each account's cumulative posted debits and<br/>
cumulative posted credits. In double-entry accounting, an account<br/>
balance is the difference between the two—computed as either<br/>
`debits - credits` or `credits - debits`,<br/>
depending on the type of account. It is up to the application to compute<br/>
the balance from the cumulative debits/credits.

From the database's perspective the distinction is arbitrary, but<br/>
accounting conventions recommend using a certain balance type for<br/>
certain types of accounts.

If you are new to thinking in terms of debits and credits, read the<br/>
[deep dive on financial accounting](https://docs.tigerbeetle.com/coding/financial-accounting)<br/>
to get a better understanding of double-entry bookkeeping and the<br/>
different types of accounts.

### [Debit\ Balances](https://docs.tigerbeetle.com/coding/data-modeling/#debit-balances)

`balance = debits - credits`

By convention, debit balances are used to represent:

- Operator's Assets
- Operator's Expenses

To enforce a positive (non-negative) debit balance, use [`flags.credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits).

To keep an account's balance between an upper and lower bound, see<br/>
the [Balance Bounds recipe](https://docs.tigerbeetle.com/coding/recipes/balance-bounds).

### [Credit Balances](https://docs.tigerbeetle.com/coding/data-modeling/#credit-balances)

`balance = credits - debits`

By convention, credit balances are used to represent:

- Operator's Liabilities
- Equity in the Operator's Business
- Operator's Income

To enforce a positive (non-negative) credit balance, use [`flags.debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits).<br/>
For example, a customer account that is represented as an Operator's<br/>
Liability would use this flag to ensure that the balance cannot go<br/>
negative.

To keep an account's balance between an upper and lower bound, see<br/>
the [Balance Bounds recipe](https://docs.tigerbeetle.com/coding/recipes/balance-bounds).

### [Compound Transfers](https://docs.tigerbeetle.com/coding/data-modeling/#compound-transfers)

`Transfer` s in TigerBeetle debit a single account and<br/>
credit a single account. You can read more about implementing compound<br/>
transfers in [Multi-Debit, Multi-Credit\\<br/>
Transfers](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers).

## [Fractional\ Amounts and Asset Scale](https://docs.tigerbeetle.com/coding/data-modeling/#fractional-amounts-and-asset-scale)

To maximize precision and efficiency, [`Account`](https://docs.tigerbeetle.com/reference/account) debits/credits<br/>
and [`Transfer`](https://docs.tigerbeetle.com/reference/transfer) amounts<br/>
are unsigned 128-bit integers. However, currencies are often denominated<br/>
in fractional amounts.

To represent a fractional amount in TigerBeetle, **map the**<br/>
**smallest useful unit of the fractional currency to 1**. Consider<br/>
all amounts in TigerBeetle as a multiple of that unit.

Applications may rescale the integer amounts as necessary when<br/>
rendering or interfacing with other systems. But when working with<br/>
fractional amounts, calculations should be performed on the integers to<br/>
avoid loss of precision due to floating-point approximations.

### [Asset\ Scale](https://docs.tigerbeetle.com/coding/data-modeling/#asset-scale)

When the multiplier is a power of 10 (e.g. `10 ^ n`), then<br/>
the exponent `n` is referred to as an _asset scale_.<br/>
For example, representing USD in cents uses an asset scale of<br/>
`2`.

#### [Examples](https://docs.tigerbeetle.com/coding/data-modeling/#examples)

- In USD, `$1` = `100` cents. So for example,
  - The fractional amount `$0.45` is represented as the<br/>
    integer `45`.
  - The fractional amount `$123.00` is represented as the<br/>
    integer `12300`.
  - The fractional amount `$123.45` is represented as the<br/>
    integer `12345`.

### [Oversized Amounts](https://docs.tigerbeetle.com/coding/data-modeling/#oversized-amounts)

The other direction works as well. If the smallest useful unit of a<br/>
currency is `10,000,000` units, then it can be scaled down to<br/>
the integer `1`.

The 128-bit representation defines the precision, but not the<br/>
scale.

### [⚠️\ Asset Scales Cannot Be Easily Changed](https://docs.tigerbeetle.com/coding/data-modeling/#warning-asset-scales-cannot-be-easily-changed)

When setting your asset scales, we recommend thinking about whether<br/>
your application may _ever_ require a larger asset scale. If so,<br/>
we would recommend using that larger scale from the start.

For example, it might seem natural to use an asset scale of 2 for<br/>
many currencies. However, it may be wise to use a higher scale in case<br/>
you ever need to represent smaller fractions of that asset.

Accounts and transfers are immutable once created. In order to change<br/>
the asset scale of a ledger, you would need to use a different<br/>
`ledger` number and duplicate all the accounts on that ledger<br/>
over to the new one.

## [`user_data`](https://docs.tigerbeetle.com/coding/data-modeling/#user_data)

`user_data_128`, `user_data_64` and<br/>
`user_data_32` are the most flexible fields in the schema<br/>
(for both [accounts](https://docs.tigerbeetle.com/reference/account) and [transfers](https://docs.tigerbeetle.com/reference/transfer)). Each<br/>
`user_data` field's contents are arbitrary, interpreted only<br/>
by the application.

Each `user_data` field is indexed for efficient point and<br/>
range queries.

While the usage of each field is entirely up to you, one way of<br/>
thinking about each of the fields is:

- `user_data_128` \- this might store the "who" and/or<br/>
  "what" of a transfer. For example, it could be a pointer to a business<br/>
  entity stored within the [control plane](https://en.wikipedia.org/wiki/Control_plane)<br/>
  database.
- `user_data_64` \- this might store a second timestamp for<br/>
  "when" the transaction originated in the real world, rather than when<br/>
  the transfer was [timestamped by\\<br/>
  TigerBeetle](https://docs.tigerbeetle.com/coding/time#why-tigerbeetle-manages-timestamps). This can be used if you need to model [bitemporality](https://en.wikipedia.org/wiki/Bitemporal_modeling).<br/>
  Alternatively, if you do not need this to be used for a timestamp, you<br/>
  could use this field in place of the `user_data_128` to store<br/>
  the "who"/"what".
- `user_data_32` \- this might store the "where" of a<br/>
  transfer. For example, it could store the jurisdiction where the<br/>
  transaction originated in the real world. In certain cases, such as for<br/>
  cross-border remittances, it might not be enough to have the UTC<br/>
  timestamp and you may want to know the transfer's locale.

(Note that the [`code`](https://docs.tigerbeetle.com/coding/data-modeling/#code) can be used to<br/>
encode the "why" of a transfer.)

Any of the `user_data` fields can be used as a group<br/>
identifier for objects that will be queried together. For example, for<br/>
multiple transfers used for [currency exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange).

## [`id`](https://docs.tigerbeetle.com/coding/data-modeling/#id)

The `id` field uniquely identifies each [`Account`](https://docs.tigerbeetle.com/reference/account#id) and [`Transfer`](https://docs.tigerbeetle.com/reference/transfer#id) within the<br/>
cluster.

The primary purpose of an `id` is to serve as an<br/>
"idempotency key"—to avoid executing an event twice. For example, if a<br/>
client creates a transfer but the server's reply is lost, the client (or<br/>
application) will retry—the database must not transfer the money<br/>
twice.

Note that `id` s are unique per cluster–not per ledger.<br/>
You should attach a separate identifier in the [`user_data`](https://docs.tigerbeetle.com/coding/data-modeling/#user_data) field if you want to store<br/>
a connection between multiple `Account` s or multiple<br/>
`Transfer` s that are related to one another. For example,<br/>
different currency `Account` s belonging to the same user or<br/>
multiple `Transfer` s that are part of a [currency exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange).

[TigerBeetle\\<br/>
Time-Based Identifiers](https://docs.tigerbeetle.com/coding/data-modeling/#tigerbeetle-time-based-identifiers-recommended) are recommended for most applications.

When selecting an `id` scheme:

- Idempotency is particularly important (and difficult) in the context<br/>
  of [application crash\\<br/>
  recovery](https://docs.tigerbeetle.com/coding/reliable-transaction-submission).
- Be careful to [avoid\\<br/>
  `id` collisions](https://en.wikipedia.org/wiki/Birthday_problem).
- An account and a transfer may share the same `id` (they<br/>
  belong to different "namespaces"), but this is not recommended because<br/>
  other systems (that you may later connect to TigerBeetle) may use a<br/>
  single "namespace" for all objects.
- Avoid requiring a central oracle to generate each unique<br/>
  `id` (e.g. an auto-increment field in SQL). A central oracle<br/>
  may become a performance bottleneck when creating<br/>
  accounts/transfers.
- Sequences of identifiers with long runs of strictly increasing (or<br/>
  strictly decreasing) values are amenable to optimization, leading to<br/>
  higher database throughput.
- Random identifiers are not recommended–they can't take advantage<br/>
  of all of the LSM optimizations. (Random identifiers have ~10% lower<br/>
  throughput than strictly-increasing ULIDs).

### [TigerBeetle Time-Based Identifiers (Recommended)](https://docs.tigerbeetle.com/coding/data-modeling/#tigerbeetle-time-based-identifiers-recommended)

TigerBeetle recommends using a specific ID scheme for most<br/>
applications. It is time-based and lexicographically sortable. The<br/>
scheme is inspired by ULIDs and UUIDv7s but is better able to take<br/>
advantage of LSM optimizations, which leads to higher database<br/>
throughput.

TigerBeetle clients include an `id()` function to generate<br/>
IDs using the recommended scheme.

TigerBeetle IDs consist of:

- 48 bits of (millisecond) timestamp (high-order bits)
- 80 bits of randomness (low-order bits)

When creating multiple objects during the same millisecond, we<br/>
increment the random bytes rather than generating new random bytes.<br/>
Furthermore, it is important that IDs are stored in little-endian with<br/>
the random bytes as the lower-order bits and the timestamp as the<br/>
higher-order bits. These details ensure that a sequence of objects have<br/>
strictly increasing IDs according to the server, which improves database<br/>
optimization.

Similar to ULIDs and UUIDv7s, these IDs have the following<br/>
benefits:

- they have an insignificant risk of collision.
- they do not require a central oracle to generate.

### [Reuse Foreign Identifier](https://docs.tigerbeetle.com/coding/data-modeling/#reuse-foreign-identifier)

This technique is most appropriate when integrating TigerBeetle with<br/>
an existing application where TigerBeetle accounts or transfers map<br/>
one-to-one with an entity in the foreign database.

Set `id` to a "foreign key"—that is, reuse an identifier<br/>
of a corresponding object from another database. For example, if every<br/>
user (within the application's database) has a single account, then the<br/>
identifier within the foreign database can be used as the<br/>
`Account.id` within TigerBeetle.

To reuse the foreign identifier, it must conform to TigerBeetle's<br/>
`id` [constraints](https://docs.tigerbeetle.com/reference/account#id).

## [`code`](https://docs.tigerbeetle.com/coding/data-modeling/#code)

The `code` identifier represents the "why" for an Account<br/>
or Transfer.

On an [`Account`](https://docs.tigerbeetle.com/reference/account#code), the<br/>
`code` indicates the account type, such as assets,<br/>
liabilities, equity, income, or expenses, and subcategories within those<br/>
classification.

On a [`Transfer`](https://docs.tigerbeetle.com/reference/transfer#code), the<br/>
`code` indicates why a given transfer is happening, such as a<br/>
purchase, refund, currency exchange, etc.

When you start building out your application on top of TigerBeetle,<br/>
you may find it helpful to list out all of the known types of accounts<br/>
and movements of funds and mapping each of these to `code`<br/>
numbers or ranges.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/data-modeling.md)

### Financial Accounting

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Financial Accounting](https://docs.tigerbeetle.com/coding/financial-accounting/#financial-accounting)

For developers with non-financial backgrounds, TigerBeetle's use of<br/>
accounting concepts like debits and credits may be one of the trickier<br/>
parts to understand. However, these concepts have been the language of<br/>
business for hundreds of years, so we promise it's worth it!

This page goes a bit deeper into debits and credits, double-entry<br/>
bookkeeping, and how to think about your accounts as part of a type<br/>
system.

## [Building Intuition with Two Simple Examples](https://docs.tigerbeetle.com/coding/financial-accounting/#building-intuition-with-two-simple-examples)

If you have an outstanding loan and owe a bank $100, is your balance<br/>
100 _o_ _r_ −100?<br/>
Conversely, if you have $200 in your bank account, is the balance 200 _o_ _r_ −200?

Thinking about these two examples, we can start to build an intuition<br/>
that the **positive or negative sign of the balance depends on**<br/>
**whose perspective we're looking from**. That $100 you owe the<br/>
bank represents a "bad" thing for you, but a "good" thing for the bank.<br/>
We might think about that same debt differently if we're doing your<br/>
accounting or the bank's.

These examples also hint at the **different types of**<br/>
**accounts**. We probably want to think about a debt as having the<br/>
opposite "sign" as the funds in your bank account. At the same time, the<br/>
types of these accounts look different depending on whether you are<br/>
considering them from the perspective of you or the bank.

Now, back to our original questions: is the loan balance 100 _o_ _r_ −100 and is the bank<br/>
account balance 200 _o_ _r_ −200? On some level,<br/>
this feels a bit arbitrary.

Wouldn't it be nice if there were some **commonly agreed-upon**<br/>
**standards** so we wouldn't have to make such an arbitrary<br/>
decision? Yes! This is exactly what debits and credits and the financial<br/>
accounting type system provide.

## [Types of Accounts](https://docs.tigerbeetle.com/coding/financial-accounting/#types-of-accounts)

In financial accounting, there are 5 main types of accounts:

- **Asset** \- what you own, which could produce income or<br/>
  which you could sell.
- **Liability** \- what you owe to other people.
- **Equity** \- value of the business owned by the owners<br/>
  or shareholders, or "the residual interest in the assets of the entity<br/>
  after deducting all its liabilities." [1](https://docs.tigerbeetle.com/coding/financial-accounting/#fn1)
- **Income** \- money or things of value you receive for<br/>
  selling products or services, or "increases in assets, or decreases in<br/>
  liabilities, that result in increases in equity, other than those<br/>
  relating to contributions from holders of equity claims." [2](https://docs.tigerbeetle.com/coding/financial-accounting/#fn2)
- **Expense** \- money you spend to pay for products or<br/>
  services, or "decreases in assets, or increases in liabilities, that<br/>
  result in decreases in equity, other than those relating to<br/>
  distributions to holders of equity claims." [3](https://docs.tigerbeetle.com/coding/financial-accounting/#fn3)

As mentioned above, the type of account depends on whose perspective<br/>
you are doing the accounting from. In those examples, the loan you have<br/>
from the bank is liability for you, because you owe the amount to the<br/>
bank. However, that same loan is an asset from the bank's perspective.<br/>
In contrast, the money in your bank account is an asset for you but it<br/>
is a liability for the bank.

Each of these major categories are further subdivided into more<br/>
specific types of accounts. For example, in your personal accounting you<br/>
would separately track the cash in your physical wallet from the funds<br/>
in your checking account, even though both of those are assets. The bank<br/>
would split out mortgages from car loans, even though both of those are<br/>
also assets for the bank.

## [Double-Entry Bookkeeping](https://docs.tigerbeetle.com/coding/financial-accounting/#double-entry-bookkeeping)

Categorizing accounts into different types is useful for<br/>
organizational purposes, but it also provides a key error-correcting<br/>
mechanism.

Every record in our accounting is not only recorded in one place, but<br/>
in two. This is double-entry bookkeeping. Why would we do that?

Let's think about the bank loan in our example above. When you took<br/>
out the loan, two things actually happened at the same time. On the one<br/>
hand, you now owe the bank $100. At the same time, the bank gave you<br/>
$100\. These are the two entries that comprise the loan transaction.

From your perspective, your liability to the bank increased by $100<br/>
while your assets also increased by $100. From the bank's perspective,<br/>
their assets (the loan to you) increased by $100 while their liabilities<br/>
(the money in your bank account) also increased by $100.

Double-entry bookkeeping ensures that funds are always accounted for.<br/>
Money never just appears. **Funds always go from somewhere to**<br/>
**somewhere.**

## [Keeping Accounts in\ Balance](https://docs.tigerbeetle.com/coding/financial-accounting/#keeping-accounts-in-balance)

Now we understand that there are different types of accounts and<br/>
every transaction will be recorded in two (or more) accounts–but which<br/>
accounts?

The [Fundamental\\<br/>
Accounting Equation](https://en.wikipedia.org/wiki/Accounting_equation) stipulates that:

**Assets - Liabilities = Equity**

Using our loan example, it's no accident that the loan increases<br/>
assets and liabilities at the same time. Assets and liabilities are on<br/>
the opposite sides of the equation, and both sides must be exactly<br/>
equal. Loans increase assets and liabilities equally.

Here are some other types of transactions that would affect assets,<br/>
liabilities, and equity, while maintaining this balance:

- If you withdraw $100 in cash from your bank account, your total<br/>
  assets stay the same. Your bank account balance (an asset) would<br/>
  decrease while your physical cash (another asset) would increase.
- From the perspective of the bank, you withdrawing $100 in cash<br/>
  decreases their assets in the form of the cash they give you, while also<br/>
  decreasing their liabilities because your bank balance decreases as<br/>
  well.
- If a shareholder invests $1000 in the bank, that increases both the<br/>
  bank's assets and equity.

Assets, liabilities, and equity represent a point in time. The other<br/>
two main categories, income and expenses, represent flows of money in<br/>
and out.

Income and expenses impact the position of the business over time.<br/>
The expanded accounting equation can be written as:

**Assets - Liabilities = Equity + Income −**<br/>
**Expenses**

You don't need to memorize these equations (unless you're training as<br/>
an accountant!). However, it is useful to understand that those main<br/>
account types lie on different sides of this equation.

## [Debits and\ Credits vs Signed Integers](https://docs.tigerbeetle.com/coding/financial-accounting/#debits-and-credits-vs-signed-integers)

Instead of using a positive or negative integer to track a balance,<br/>
TigerBeetle and double-entry bookkeeping systems use **debits and**<br/>
**credits**.

The two entries that give "double-entry bookkeeping" its name are the<br/>
debit and the credit: every transaction has at least one debit and at<br/>
least one credit. (Note that for efficiency's sake, TigerBeetle<br/>
`Transfer` s consist of exactly one debit and one credit.<br/>
These can be composed into more complex [multi-debit, multi-credit\\<br/>
transfers](https://docs.tigerbeetle.com/coding/recipes/multi-debit-credit-transfers).) Which entry is the debit and which is the credit? The<br/>
answer is easy once you understand that **accounting is a type**<br/>
**system**. An account increases with a debit or credit according<br/>
to its type.

When our example loan increases the assets and liabilities, we need<br/>
to assign each of these entries to either be a debit or a credit. At<br/>
some level, this is completely arbitrary. For clarity, accountants have<br/>
used the same standards for hundreds of years:

### [How Debits and Credits Increase or Decrease Account\ Balances](https://docs.tigerbeetle.com/coding/financial-accounting/#how-debits-and-credits-increase-or-decrease-account-balances)

- **Assets and expenses are increased with debits, decreased**<br/>
  **with credits**
- **Liabilities, equity, and income are increased with credits,**<br/>
  **decreased with debits**

Or, in a table form:

|           | Debit | Credit |
| --------- | ----- | ------ |
| Asset     | +     | -      |
| Liability | -     | +      |
| Equity    | -     | +      |
| Income    | -     | +      |
| Expense   | +     | -      |

From the perspective of our example bank:

- You taking out a loan debits (increases) their loan assets and<br/>
  credits (increases) their bank account balance liabilities.
- You paying off the loan debits (decreases) their bank account<br/>
  balance liabilities and credits (decreases) their loan assets.
- You depositing cash debits (increases) their cash assets and credits<br/>
  (increases) their bank account balance liabilities.
- You withdrawing cash debits (decreases) their bank account balance<br/>
  liabilities and credits (decreases) their cash assets.

Note that accounting conventions also always write the debits first,<br/>
to represent the funds flowing _from_ the debited account<br/>
_to_ the credited account.

If this seems arbitrary and confusing, we understand! It's a<br/>
convention, just like how most programmers need to learn zero-based<br/>
array indexing and then at some point it becomes second nature.

### [Account\ Types and the “Normal Balance”](https://docs.tigerbeetle.com/coding/financial-accounting/#account-types-and-the-normal-balance)

Some other accounting systems have the concept of a "normal balance",<br/>
which would indicate whether a given account's balance is increased by<br/>
debits or credits.

When designing for TigerBeetle, we recommend thinking about account<br/>
types instead of "normal balances". This is because the type of balance<br/>
follows from the type of account, but the type of balance doesn't tell<br/>
you the type of account. For example, an account might have a normal<br/>
balance on the debit side but that doesn't tell you whether it is an<br/>
asset or expense.

## [Takeaways](https://docs.tigerbeetle.com/coding/financial-accounting/#takeaways)

- Accounts are categorized into types. The 5 main types are asset,<br/>
  liability, equity, income, and expense.
- Depending on the type of account, an increase is recorded as either<br/>
  a debit or a credit.
- All transfers consist of two entries, a debit and a credit.<br/>
  Double-entry bookkeeping ensures that all funds come from somewhere and<br/>
  go somewhere.

When you get started using TigerBeetle, we would recommend writing a<br/>
list of all the types of accounts in your system that you can think of.<br/>
Then, think about whether, from the perspective of your business, each<br/>
account represents an asset, liability, equity, income, or expense. That<br/>
determines whether the given type of account is increased with a debit<br/>
or a credit.

## [Want More Help Understanding Debits and Credits?](https://docs.tigerbeetle.com/coding/financial-accounting/#want-more-help-understanding-debits-and-credits)

### [Ask the Community](https://docs.tigerbeetle.com/coding/financial-accounting/#ask-the-community)

Have questions about debits and credits, TigerBeetle's data model,<br/>
how to design your application on top of it, or anything else?

Come join our [Community\\<br/>
Slack](https://slack.tigerbeetle.com/join) and ask any and all questions you might have!

### [Dedicated Consultation](https://docs.tigerbeetle.com/coding/financial-accounting/#dedicated-consultation)

Would you like the TigerBeetle team to help you design your chart of<br/>
accounts and leverage the power of TigerBeetle in your architecture?

Let us help you get it right. Contact our CEO, Joran Dirk Greef, at<br/>
[joran@tigerbeetle.com](mailto:joran@tigerbeetle.com) to set<br/>
up a call.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/financial-accounting.md)

#### Linked Events

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Linked\ Events](https://docs.tigerbeetle.com/coding/linked-events/#linked-events)

Events within a request [succeed or\\<br/>
fail](https://docs.tigerbeetle.com/reference/requests/create_transfers#result) independently unless they are explicitly linked using<br/>
`flags.linked` ([`Account.flags.linked`](https://docs.tigerbeetle.com/reference/account#flagslinked)<br/>
or [`Transfer.flags.linked`](https://docs.tigerbeetle.com/reference/transfer#flagslinked)).

When the `linked` flag is specified, it links the outcome<br/>
of a Transfer or Account creation with the outcome of the next one in<br/>
the request. These chains of events will all succeed or fail<br/>
together.

**The last event in a chain is denoted by the first Transfer or**<br/>
**Account without this flag.**

The last Transfer or Account in a request may never have the<br/>
`flags.linked` set, as it would leave a chain open-ended.<br/>
Attempting to do so will result in the [`linked_event_chain_open`](https://docs.tigerbeetle.com/reference/requests/create_transfers#linked_event_chain_open)<br/>
error.

Multiple chains of events may coexist within a request to succeed or<br/>
fail independently.

Events within a chain are executed in order, or are rolled back on<br/>
error, so that the effect of each event in the chain is visible to the<br/>
next. Each chain is either visible or invisible as a unit to subsequent<br/>
transfers after the chain. The event that was the first to fail within a<br/>
chain will have a unique error result. Other events in the chain will<br/>
have their error result set to [`linked_event_failed`](https://docs.tigerbeetle.com/reference/requests/create_transfers#linked_event_failed).

## [Linked Transfers Example](https://docs.tigerbeetle.com/coding/linked-events/#linked-transfers-example)

Consider this set of Transfers as part of a request:

| Transfer | Index in Request | flags.linked |
| -------- | ---------------- | ------------ |
| `A`      | `0`              | `false`      |
| `B`      | `1`              | `true`       |
| `C`      | `2`              | `true`       |
| `D`      | `3`              | `false`      |
| `E`      | `4`              | `false`      |

If any of transfers `B`, `C`, or `D`<br/>
fail (for example, due to [`exceeds_credits`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exceeds_credits)),<br/>
then `B`, `C`, and `D` will all fail.<br/>
They are linked.

Transfers `A` and `E` fail or succeed<br/>
independently of `B`, `C`, `D`, and<br/>
each other.

After the chain of linked events has executed, the fact that they<br/>
were linked will not be saved. To save the association between Transfers<br/>
or Accounts, it must be [encoded into the data\\<br/>
model](https://docs.tigerbeetle.com/coding/data-modeling), for example by adding an ID to one of the [user data](https://docs.tigerbeetle.com/coding/data-modeling#user_data) fields.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/linked-events.md)

### Reliable Submissions

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Reliable\ Transaction Submission](https://docs.tigerbeetle.com/coding/reliable-transaction-submission/#reliable-transaction-submission)

When making payments or recording transfers, it is important to<br/>
ensure that they are recorded once and only once–even if some parts of<br/>
the system fail during the transaction.

There are some subtle gotchas to avoid, so this page describes how to<br/>
submit events–and especially transfers–reliably.

## [The App\ or Browser Should Generate the ID](https://docs.tigerbeetle.com/coding/reliable-transaction-submission/#the-app-or-browser-should-generate-the-id)

[`Transfer` s](https://docs.tigerbeetle.com/reference/transfer#id) and<br/>
[`Account` s](https://docs.tigerbeetle.com/reference/account#id) carry an<br/>
`id` field that is used as an idempotency key to ensure the<br/>
same object is not created twice.

**The client software, such as your app or web page, that the**<br/>
**user interacts with should generate the `id` (not your API).**<br/>
**This `id` should be persisted locally before submission, and**<br/>
**the same `id` should be used for subsequent**<br/>
**retries.**

1. User initiates a transfer.
2. Client software (app, web page, etc) [generates the transfer\\<br/>
   `id`](https://docs.tigerbeetle.com/coding/data-modeling#id).
3. Client software **persists the `id` in the app or**<br/>
   **browser local storage.**
4. Client software submits the transfer to your [API service](https://docs.tigerbeetle.com/coding/system-architecture).
5. API service includes the transfer in a [request](https://docs.tigerbeetle.com/reference/requests/).
6. TigerBeetle creates the transfer with the given `id` once<br/>
   and only once.
7. TigerBeetle responds to the API service.
8. The API service responds to the client software.

### [Handling Network Failures](https://docs.tigerbeetle.com/coding/reliable-transaction-submission/#handling-network-failures)

The method described above handles various potential network<br/>
failures. The request may be lost before it reaches the API service or<br/>
before it reaches TigerBeetle. Or, the response may be lost on the way<br/>
back from TigerBeetle.

Generating the `id` on the client side ensures that<br/>
transfers can be safely retried. The app must use the same<br/>
`id` each time the transfer is resent.

If the transfer was already created before and then retried,<br/>
TigerBeetle will return the [`exists`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exists)<br/>
response code. If the transfer had not already been created, it will be<br/>
created and return the [`ok`](https://docs.tigerbeetle.com/reference/requests/create_transfers#ok).

### [Handling Client\ Software Restarts](https://docs.tigerbeetle.com/coding/reliable-transaction-submission/#handling-client-software-restarts)

The method described above also handles potential restarts of the app<br/>
or browser while the request is in flight.

It is important to **persist the `id` to local**<br/>
**storage on the client's device before submitting the transfer**.<br/>
When the app or web page reloads, it should resubmit the transfer using<br/>
the same `id`.

This ensures that the operation can be safely retried even if the<br/>
client app or browser restarts before receiving the response to the<br/>
operation. Similar to the case of a network failure, TigerBeetle will<br/>
respond with the [`ok`](https://docs.tigerbeetle.com/reference/requests/create_transfers#ok)<br/>
if a transfer is newly created and [`exists`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exists)<br/>
if an object with the same `id` was already created.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/reliable-transaction-submission.md)

#### Requests

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Requests](https://docs.tigerbeetle.com/coding/requests/#requests)

A _request_ queries or updates the database state.

A request consists of one or more _events_ of the same type<br/>
sent to the cluster in a single message. For example, a single request<br/>
can create multiple transfers but it cannot create both accounts and<br/>
transfers.

The cluster commits an entire request at once. Events are applied in<br/>
series, such that successive events observe the effects of previous ones<br/>
and event timestamps are [totally ordered](https://docs.tigerbeetle.com/coding/time#timestamps-are-totally-ordered).

Each request receives one _reply_ message from the cluster.<br/>
The reply contains one _result_ for each event in the<br/>
request.

## [Request\ Types](https://docs.tigerbeetle.com/coding/requests/#request-types)

- [`create_accounts`](https://docs.tigerbeetle.com/reference/requests/create_accounts):<br/>
  create [`Account` s](https://docs.tigerbeetle.com/reference/account)
- [`create_transfers`](https://docs.tigerbeetle.com/reference/requests/create_transfers):<br/>
  create [`Transfer` s](https://docs.tigerbeetle.com/reference/transfer)
- [`lookup_accounts`](https://docs.tigerbeetle.com/reference/requests/lookup_accounts):<br/>
  fetch `Account` s by `id`
- [`lookup_transfers`](https://docs.tigerbeetle.com/reference/requests/lookup_transfers):<br/>
  fetch `Transfer` s by `id`
- [`get_account_transfers`](https://docs.tigerbeetle.com/reference/requests/get_account_transfers):<br/>
  fetch `Transfer` s by `debit_account_id` or<br/>
  `credit_account_id`
- [`get_account_balances`](https://docs.tigerbeetle.com/reference/requests/get_account_balances):<br/>
  fetch the historical account balance by the `Account`'s<br/>
  `id`.
- [`query_accounts`](https://docs.tigerbeetle.com/reference/requests/query_accounts):<br/>
  query `Account` s
- [`query_transfers`](https://docs.tigerbeetle.com/reference/requests/query_transfers):<br/>
  query `Transfer` s

_More request types, including more powerful queries, are coming_<br/>
_soon!_

## [Events and Results](https://docs.tigerbeetle.com/coding/requests/#events-and-results)

Each request has a corresponding _event_ and _result_<br/>
type:

| Request Type            | Event                                                                                   | Result                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `create_accounts`       | [`Account`](https://docs.tigerbeetle.com/reference/requests/create_accounts#event)      | [`CreateAccountResult`](https://docs.tigerbeetle.com/reference/requests/create_accounts#result)               |
| `create_transfers`      | [`Transfer`](https://docs.tigerbeetle.com/reference/requests/create_transfers#event)    | [`CreateTransferResult`](https://docs.tigerbeetle.com/reference/requests/create_transfers#result)             |
| `lookup_accounts`       | [`Account.id`](https://docs.tigerbeetle.com/reference/requests/lookup_accounts#event)   | [`Account`](https://docs.tigerbeetle.com/reference/requests/lookup_accounts#result)<br>or nothing             |
| `lookup_transfers`      | [`Transfer.id`](https://docs.tigerbeetle.com/reference/requests/lookup_transfers#event) | [`Transfer`](https://docs.tigerbeetle.com/reference/requests/lookup_transfers#result)<br>or nothing           |
| `get_account_transfers` | [`AccountFilter`](https://docs.tigerbeetle.com/reference/account-filter)                | [`Transfer`](https://docs.tigerbeetle.com/reference/requests/get_account_transfers#result)<br>or nothing      |
| `get_account_balances`  | [`AccountFilter`](https://docs.tigerbeetle.com/reference/account-filter)                | [`AccountBalance`](https://docs.tigerbeetle.com/reference/requests/get_account_balances#result)<br>or nothing |
| `query_accounts`        | [`QueryFilter`](https://docs.tigerbeetle.com/reference/query-filter)                    | [`Account`](https://docs.tigerbeetle.com/reference/requests/lookup_accounts#result)<br>or nothing             |
| `query_transfers`       | [`QueryFilter`](https://docs.tigerbeetle.com/reference/query-filter)                    | [`Transfer`](https://docs.tigerbeetle.com/reference/requests/lookup_transfers#result)<br>or nothing           |

### [Idempotency](https://docs.tigerbeetle.com/coding/requests/#idempotency)

Events that create objects are idempotent. The first event to create<br/>
an object with a given `id` will receive the `ok`<br/>
result. Subsequent events that attempt to create the same object will<br/>
receive the `exists` result.

## [Batching Events](https://docs.tigerbeetle.com/coding/requests/#batching-events)

To achieve high throughput, TigerBeetle amortizes the overhead of<br/>
consensus and I/O by batching many events in each request.

In the default configuration, the maximum batch sizes for each<br/>
request type are:

| Request Type            | Request Batch Size (Events) | Reply Batch Size (Results) |
| ----------------------- | --------------------------- | -------------------------- |
| `lookup_accounts`       | 8190                        | 8190                       |
| `lookup_transfers`      | 8190                        | 8190                       |
| `create_accounts`       | 8190                        | 8190                       |
| `create_transfers`      | 8190                        | 8190                       |
| `get_account_transfers` | 1                           | 8190                       |
| `get_account_balances`  | 1                           | 8190                       |
| `query_accounts`        | 1                           | 8190                       |
| `query_transfers`       | 1                           | 8190                       |

TigerBeetle clients automatically batch events. Therefore, it is<br/>
recommended to share the client instances between multiple threads or<br/>
tasks to have events batched transparently.

- [Node](https://docs.tigerbeetle.com/coding/clients/node/#batching)
- [Go](https://docs.tigerbeetle.com/coding/clients/go/#batching)
- [Java](https://docs.tigerbeetle.com/coding/clients/java/#batching)
- [.NET](https://docs.tigerbeetle.com/coding/clients/dotnet/#batching)
- [Python](https://docs.tigerbeetle.com/coding/clients/python/#batching)

## [Guarantees](https://docs.tigerbeetle.com/coding/requests/#guarantees)

- A request executes within the cluster at most once.
- Requests do not [time\\<br/>
  out](https://docs.tigerbeetle.com/reference/sessions#retries). Clients will continuously retry requests until they receive a<br/>
  reply from the cluster. This is because in the case of a network<br/>
  partition, a lack of response from the cluster could either indicate<br/>
  that the request was dropped before it was processed or that the reply<br/>
  was dropped after the request was processed. Note that individual [pending transfers](https://docs.tigerbeetle.com/coding/two-phase-transfers) within a request may<br/>
  have [timeouts](https://docs.tigerbeetle.com/reference/transfer#timeout).
- Requests retried by their original client session receive identical<br/>
  replies.
- Requests retried by a different client (same request body, different<br/>
  session) may receive different replies.
- Events within a request are executed in sequence. The effects of a<br/>
  given event are observable when the next event within that request is<br/>
  applied.
- Events within a request do not interleave with events from other<br/>
  requests.
- All events within a request batch are committed, or none are. Note<br/>
  that this does not mean that all of the events in a batch will succeed,<br/>
  or that all will fail. Events succeed or fail independently unless they<br/>
  are explicitly [linked](https://docs.tigerbeetle.com/coding/linked-events)
- Once committed, an event will always be committed—the cluster's<br/>
  state never backtracks.
- Within a cluster, object [timestamps are unique and\\<br/>
  strictly increasing](https://docs.tigerbeetle.com/coding/time#timestamps-are-totally-ordered). No two objects within the same cluster will<br/>
  have the same timestamp. Furthermore, the order of the timestamps<br/>
  indicates the order in which the objects were committed.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/requests.md)

### TigerBeetle Integration

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [TigerBeetle in Your System Architecture](https://docs.tigerbeetle.com/coding/system-architecture/#tigerbeetle-in-your-system-architecture)

TigerBeetle is an Online Transaction Processing (OLTP) database built<br/>
for safety and performance. It is not a general purpose database like<br/>
PostgreSQL or MySQL. Instead, TigerBeetle works alongside your general<br/>
purpose database, which we refer to as an Online General Purpose (OLGP)<br/>
database.

TigerBeetle should be used in the data plane, or hot path of<br/>
transaction processing, while your general purpose database is used in<br/>
the control plane and may be used for storing information or metadata<br/>
that is updated less frequently.

![TigerBeetle in Your System Architecture](https://github.com/user-attachments/assets/679ec8be-640d-4c7e-b082-076557baeac7)

## [Division of\ Responsibilities](https://docs.tigerbeetle.com/coding/system-architecture/#division-of-responsibilities)

**App or Website**

- Initiate transactions
- [Generate\\<br/>
  Transfer and Account IDs](https://docs.tigerbeetle.com/coding/reliable-transaction-submission#the-app-or-browser-should-generate-the-id)

**Stateless API Service**

- Handle authentication and authorization
- Create account records in both the general purpose database and<br/>
  TigerBeetle when users sign up
- [Cache ledger\\<br/>
  metadata](https://docs.tigerbeetle.com/coding/system-architecture/#ledger-account-and-transfer-types)
- [Batch transfers](https://docs.tigerbeetle.com/coding/requests#batching-events)
- Apply exchange rates for [currency exchange](https://docs.tigerbeetle.com/coding/recipes/currency-exchange)<br/>
  transactions

**General Purpose (OLGP) Database**

- Store metadata about ledgers and accounts (such as string names or<br/>
  descriptions)
- Store mappings between [integer type identifiers](https://docs.tigerbeetle.com/coding/system-architecture/#ledger-account-and-transfer-types)<br/>
  used in TigerBeetle and string representations used by the app and<br/>
  API

**TigerBeetle (OLTP) Database**

- Record transfers between accounts
- Track balances for accounts
- Enforce balance limits
- Enforce financial consistency through double-entry bookkeeping
- Enforce strict serializability of events
- Optionally store pointers to records or entities in the general<br/>
  purpose database in the [`user_data`](https://docs.tigerbeetle.com/coding/data-modeling#user_data) fields

## [Ledger,\ Account, and Transfer Types](https://docs.tigerbeetle.com/coding/system-architecture/#ledger-account-and-transfer-types)

For performance reasons, TigerBeetle stores the ledger, account, and<br/>
transfer types as simple integers. Most likely, you will want these<br/>
integers to map to enums of type names or strings, along with other<br/>
associated metadata.

The mapping from the string representation of these types to the<br/>
integers used within TigerBeetle may be hard-coded into your application<br/>
logic or stored in a general purpose (OLGP) database and cached by your<br/>
application. (These mappings should be immutable and append-only, so<br/>
there is no concern about cache invalidation.)

⚠️ Importantly, **initiating a transfer should not require**<br/>
**fetching metadata from the general purpose database**. If it<br/>
does, that database will become the bottleneck and will negate the<br/>
performance gains from using TigerBeetle.

Specifically, the types of information that fit into this category<br/>
include:

| Hard-coded in app or cached                                            | In TigerBeetle                                                                                                                                                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Currency or asset code's string representation (for example,<br>"USD") | [`ledger`](https://docs.tigerbeetle.com/coding/data-modeling#asset-scale) and<br>[asset scale](https://docs.tigerbeetle.com/coding/data-modeling#asset-scale) |
| Account type's string representation (for example, "cash")             | [`code`](https://docs.tigerbeetle.com/coding/data-modeling#code)                                                                                              |
| Transfer type's string representation (for example, "refund")          | [`code`](https://docs.tigerbeetle.com/coding/data-modeling#code)                                                                                              |

## [Authentication](https://docs.tigerbeetle.com/coding/system-architecture/#authentication)

TigerBeetle does not support authentication. You should never allow<br/>
untrusted users or services to interact with it directly.

Also, untrusted processes must not be able to access or modify<br/>
TigerBeetle's on-disk data file.

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/system-architecture.md)

### Time

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Time](https://docs.tigerbeetle.com/coding/time/#time)

Time is a critical component of all distributed systems and<br/>
databases. Within TigerBeetle, we keep track of two types of time:<br/>
logical time and physical time. Logical time is about ordering events<br/>
relative to each other, and physical time is the everyday time, a<br/>
numeric timestamp.

## [Logical\ Time](https://docs.tigerbeetle.com/coding/time/#logical-time)

TigerBeetle uses a consensus protocol ([Viewstamped\\<br/>
Replication](https://pmg.csail.mit.edu/papers/vr-revisited.pdf)) to guarantee [strict\\<br/>
serializability](http://www.bailis.org/blog/linearizability-versus-serializability/) for all operations.

In other words, to an external observer, TigerBeetle cluster behaves<br/>
as if it is just a single machine which processes the incoming requests<br/>
in order. If an application submits a batch of transfers with transfer<br/>
`T1`, receives a reply, and then submits a batch with another<br/>
transfer `T2`, it is guaranteed that `T2` will<br/>
observe the effects of `T1`. Note, however, that there could<br/>
be concurrent requests from multiple applications, so, unless<br/>
`T1` and `T2` are in the same batch of transfers,<br/>
some other transfer could happen in between them. See the [reference](https://docs.tigerbeetle.com/reference/sessions) for precise<br/>
guarantees.

## [Physical\ Time](https://docs.tigerbeetle.com/coding/time/#physical-time)

TigerBeetle uses physical time in addition to the logical time<br/>
provided by the consensus algorithm. Financial transactions require<br/>
physical time for multiple reasons, including:

- **Liquidity** \- TigerBeetle supports [Two-Phase Transfers](https://docs.tigerbeetle.com/coding/two-phase-transfers) that reserve funds<br/>
  and hold them in a pending state until they are posted, voided, or the<br/>
  transfer times out. A timeout is useful to ensure that the reserved<br/>
  funds are not held in limbo indefinitely.
- **Compliance and Auditing** \- For regulatory and<br/>
  security purposes, it is useful to have a specific idea of when (in<br/>
  terms of wall clock time) transfers took place.

TigerBeetle uses two-layered approach to physical time. On the basic<br/>
layer, each replica asks the underling operating system about the<br/>
current time. Then, timing information from several replicas is<br/>
aggregated to make sure that the replicas roughly agree on the time, to<br/>
prevent a replica with a bad clock from issuing incorrect timestamps.<br/>
Additionally, this "cluster time" is made strictly monotonic, for end<br/>
user's convenience.

## [Why\ TigerBeetle Manages Timestamps](https://docs.tigerbeetle.com/coding/time/#why-tigerbeetle-manages-timestamps)

An important invariant is that the TigerBeetle cluster assigns all<br/>
timestamps. In particular, timestamps on [`Transfer` s](https://docs.tigerbeetle.com/reference/transfer#timestamp) and<br/>
[`Account` s](https://docs.tigerbeetle.com/reference/account#timestamp)<br/>
are set by the cluster when the corresponding event arrives at the<br/>
primary. This is why the `timestamp` field must be set to<br/>
`0` when operations are submitted by the client.

Similarly, the [`Transfer.timeout`](https://docs.tigerbeetle.com/reference/transfer#timeout)<br/>
is given as an interval in seconds, rather than as an absolute<br/>
timestamp, because it is also managed by the primary. The<br/>
`timeout` is calculated relative to the<br/>
`timestamp` when the operation arrives at the primary.

This restriction is needed to make sure that any two timestamps<br/>
always refer to the same underlying clock (cluster's physical time) and<br/>
are directly comparable. This in turn provides a set of powerful<br/>
guarantees.

### [Timestamps are\ Totally Ordered](https://docs.tigerbeetle.com/coding/time/#timestamps-are-totally-ordered)

All `timestamp` s within TigerBeetle are unique, immutable<br/>
and [totally\\<br/>
ordered](https://book.mixu.net/distsys/time.html). A transfer that is created before another transfer is<br/>
guaranteed to have an earlier `timestamp` (even if they were<br/>
created in the same request).

In other systems this is also called a "physical" timestamp,<br/>
"ingestion" timestamp, "record" timestamp, or "system" timestamp.

## [Further Reading](https://docs.tigerbeetle.com/coding/time/#further-reading)

If you are curious how exactly it is that TigerBeetle achieves<br/>
strictly monotonic physical time, we have a talk and a blog post with<br/>
details:

- [Detecting\\<br/>
  Clock Sync Failure in Highly Available Systems (YouTube)](https://youtu.be/7R-Iz6sJG6Q?si=9sD2TpfD29AxUjOY)
- [Three\\<br/>
  Clocks are Better than One (TigerBeetle Blog)](https://tigerbeetle.com/blog/three-clocks-are-better-than-one/)

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/time.md)

### Two-Phase Transfers

[GitHub](https://github.com/tigerbeetle/tigerbeetle)

# [Two-Phase Transfers](https://docs.tigerbeetle.com/coding/two-phase-transfers/#two-phase-transfers)

A two-phase transfer moves funds in stages:

1. Reserve funds ([pending](https://docs.tigerbeetle.com/coding/two-phase-transfers/#reserve-funds-pending-transfer))
2. Resolve funds ([post](https://docs.tigerbeetle.com/coding/two-phase-transfers/#post-pending-transfer), [void](https://docs.tigerbeetle.com/coding/two-phase-transfers/#void-pending-transfer), or [expire](https://docs.tigerbeetle.com/coding/two-phase-transfers/#expire-pending-transfer))

The name "two-phase transfer" is a reference to the [two-phase\\<br/>
commit protocol for distributed transactions](https://en.wikipedia.org/wiki/Two-phase_commit_protocol).

## [Reserve Funds\ (Pending Transfer)](https://docs.tigerbeetle.com/coding/two-phase-transfers/#reserve-funds-pending-transfer)

A pending transfer, denoted by [`flags.pending`](https://docs.tigerbeetle.com/reference/transfer#flagspending),<br/>
reserves its `amount` in the debit/credit accounts' [`debits_pending`](https://docs.tigerbeetle.com/reference/account#debits_pending)/ [`credits_pending`](https://docs.tigerbeetle.com/reference/account#credits_pending)<br/>
fields, respectively. Pending transfers leave the<br/>
`debits_posted`/ `credits_posted` unmodified.

## [Resolve\ Funds](https://docs.tigerbeetle.com/coding/two-phase-transfers/#resolve-funds)

Pending transfers can be posted, voided, or they may time out.

### [Post-Pending Transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers/#post-pending-transfer)

A post-pending transfer, denoted by [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer),<br/>
causes a pending transfer to "post", transferring some or all of the<br/>
pending transfer's reserved amount to its destination.

- If the posted [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount) is less<br/>
  than the pending transfer's amount, then only this amount is posted, and<br/>
  the remainder is restored to its original accounts.
- If the posted [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount) is equal<br/>
  to the pending transfer's amount or equal to `AMOUNT_MAX`<br/>
  (`2^128 - 1`), the full pending transfer's amount is<br/>
  posted.
- If the posted [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount) is<br/>
  greater than the pending transfer's amount (but less than<br/>
  `AMOUNT_MAX`), [`exceeds_pending_transfer_amount`](https://docs.tigerbeetle.com/reference/requests/create_transfers#exceeds_pending_transfer_amount)<br/>
  is returned.

Client < 0.16.0

- If the posted [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount) is 0, the<br/>
  full pending transfer's amount is posted.
- If the posted [`amount`](https://docs.tigerbeetle.com/reference/transfer#amount) is<br/>
  nonzero, then only this amount is posted, and the remainder is restored<br/>
  to its original accounts. It must be less than or equal to the pending<br/>
  transfer's amount.

Additionally, when `flags.post_pending_transfer` is<br/>
set:

- [`pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
  must reference a [pending\\<br/>
  transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers/#reserve-funds-pending-transfer).
- [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)<br/>
  must not be set.

The following fields may either be zero or they must match the value<br/>
of the pending transfer's field:

- [`debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)
- [`credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)
- [`ledger`](https://docs.tigerbeetle.com/reference/transfer#ledger)
- [`code`](https://docs.tigerbeetle.com/reference/transfer#code)

### [Void-Pending Transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers/#void-pending-transfer)

A void-pending transfer, denoted by [`flags.void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer),<br/>
restores the pending amount its original accounts. Additionally, when<br/>
this field is set:

- [`pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
  must reference a [pending\\<br/>
  transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers/#reserve-funds-pending-transfer).
- [`flags.post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)<br/>
  must not be set.

The following fields may either be zero or they must match the value<br/>
of the pending transfer's field:

- [`debit_account_id`](https://docs.tigerbeetle.com/reference/transfer#debit_account_id)
- [`credit_account_id`](https://docs.tigerbeetle.com/reference/transfer#credit_account_id)
- [`ledger`](https://docs.tigerbeetle.com/reference/transfer#ledger)
- [`code`](https://docs.tigerbeetle.com/reference/transfer#code)

### [Expire Pending Transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers/#expire-pending-transfer)

A pending transfer may optionally be created with a [timeout](https://docs.tigerbeetle.com/reference/transfer#timeout). If the timeout<br/>
interval passes before the transfer is either posted or voided, the<br/>
transfer expires and the full amount is returned to the original<br/>
account.

Note that `timeout` s are given as intervals, specified in<br/>
seconds, rather than as absolute timestamps. For more details on why,<br/>
read the page about [Time in TigerBeetle](https://docs.tigerbeetle.com/coding/time).

### [Errors](https://docs.tigerbeetle.com/coding/two-phase-transfers/#errors)

A pending transfer can only be posted or voided once. It cannot be<br/>
posted twice or voided then posted, etc.

Attempting to resolve a pending transfer more than once will return<br/>
the applicable error result:

- [`pending_transfer_already_posted`](https://docs.tigerbeetle.com/reference/requests/create_transfers#pending_transfer_already_posted)
- [`pending_transfer_already_voided`](https://docs.tigerbeetle.com/reference/requests/create_transfers#pending_transfer_already_voided)
- [`pending_transfer_expired`](https://docs.tigerbeetle.com/reference/requests/create_transfers#pending_transfer_expired)

## [Interaction\ with Account Invariants](https://docs.tigerbeetle.com/coding/two-phase-transfers/#interaction-with-account-invariants)

The pending transfer's amount is reserved in a way that the second<br/>
step in a two-phase transfer will never cause the accounts' configured<br/>
balance invariants ([`credits_must_not_exceed_debits`](https://docs.tigerbeetle.com/reference/account#flagscredits_must_not_exceed_debits)<br/>
or [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits))<br/>
to be broken, whether the second step is a post or void.

### [Pessimistic Pending\ Transfers](https://docs.tigerbeetle.com/coding/two-phase-transfers/#pessimistic-pending-transfers)

If an account with [`debits_must_not_exceed_credits`](https://docs.tigerbeetle.com/reference/account#flagsdebits_must_not_exceed_credits)<br/>
has `credits_posted = 100` and<br/>
`debits_posted = 70` and a pending transfer is started<br/>
causing the account to have `debits_pending = 50`, the<br/>
_pending_ transfer will fail. It will not wait to get to<br/>
_posted_ status to fail.

## [All Transfers Are\ Immutable](https://docs.tigerbeetle.com/coding/two-phase-transfers/#all-transfers-are-immutable)

To reiterate, completing a two-phase transfer (by either marking it<br/>
void or posted) does not involve modifying the pending transfer. Instead<br/>
you create a new transfer.

The first transfer that is marked pending will always have its<br/>
pending flag set.

The second transfer will have a [`post_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagspost_pending_transfer)<br/>
or [`void_pending_transfer`](https://docs.tigerbeetle.com/reference/transfer#flagsvoid_pending_transfer)<br/>
flag set and a [`pending_id`](https://docs.tigerbeetle.com/reference/transfer#pending_id)<br/>
field set to the [`id`](https://docs.tigerbeetle.com/reference/transfer#id) of the first<br/>
transfer. The [`id`](https://docs.tigerbeetle.com/reference/transfer#id)<br/>
of the second transfer will be unique, not the same [`id`](https://docs.tigerbeetle.com/reference/transfer#id) as the initial<br/>
pending transfer.

## [Examples](https://docs.tigerbeetle.com/coding/two-phase-transfers/#examples)

The following examples show the state of two accounts in three<br/>
steps:

1. Initially, before any transfers
2. After a pending transfer
3. And after the pending transfer is posted or voided

### [Post Full Pending Amount](https://docs.tigerbeetle.com/coding/two-phase-transfers/#post-full-pending-amount)

| Account `A` |            | Account `B` |            | Transfers            |                       |            |                         |
| ----------- | ---------- | ----------- | ---------- | -------------------- | --------------------- | ---------- | ----------------------- |
| **debits**  |            | **credits** |            |                      |                       |            |                         |
| **pending** | **posted** | **pending** | **posted** | **debit_account_id** | **credit_account_id** | **amount** | **flags**               |
| `w`         | `x`        | `y`         | `z`        | -                    | -                     | -          | -                       |
| 123 + `w`   | `x`        | 123 + `y`   | `z`        | `A`                  | `B`                   | 123        | `pending`               |
| `w`         | 123 + `x`  | `y`         | 123 + `z`  | `A`                  | `B`                   | 123        | `post_pending_transfer` |

### [Post Partial Pending\ Amount](https://docs.tigerbeetle.com/coding/two-phase-transfers/#post-partial-pending-amount)

| Account `A` |            | Account `B` |            | Transfers            |                       |            |                         |
| ----------- | ---------- | ----------- | ---------- | -------------------- | --------------------- | ---------- | ----------------------- |
| **debits**  |            | **credits** |            |                      |                       |            |                         |
| **pending** | **posted** | **pending** | **posted** | **debit_account_id** | **credit_account_id** | **amount** | **flags**               |
| `w`         | `x`        | `y`         | `z`        | -                    | -                     | -          | -                       |
| 123 + `w`   | `x`        | 123 + `y`   | `z`        | `A`                  | `B`                   | 123        | `pending`               |
| `w`         | 100 + `x`  | `y`         | 100 + `z`  | `A`                  | `B`                   | 100        | `post_pending_transfer` |

### [Void Pending Transfer](https://docs.tigerbeetle.com/coding/two-phase-transfers/#void-pending-transfer-1)

| Account `A` |            | Account `B` |            | Transfers            |                       |            |                         |
| ----------- | ---------- | ----------- | ---------- | -------------------- | --------------------- | ---------- | ----------------------- |
| **debits**  |            | **credits** |            |                      |                       |            |                         |
| **pending** | **posted** | **pending** | **posted** | **debit_account_id** | **credit_account_id** | **amount** | **flags**               |
| `w`         | `x`        | `y`         | `z`        | -                    | -                     | -          | -                       |
| 123 + `w`   | `x`        | 123 + `y`   | `z`        | `A`                  | `B`                   | 123        | `pending`               |
| `w`         | `x`        | `y`         | `z`        | `A`                  | `B`                   | 123        | `void_pending_transfer` |

[Edit this page](https://github.com/tigerbeetle/tigerbeetle/edit/main/docs/coding/two-phase-transfers.md)
