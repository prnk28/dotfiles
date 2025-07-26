---
tags:
  - "#programming"
  - "#documentation"
  - "#module-design"
  - "#dependency-injection"
  - "#state-management"
  - "#code-generation"
---
# Collections

# Collections

Collections is a library meant to simplify the experience with respect to module state handling.

Cosmos SDK modules handle their state using the `KVStore` interface. The problem with working with<br/>
`KVStore` is that it forces you to think of state as a bytes KV pairings when in reality the majority of<br/>
state comes from complex concrete golang objects (strings, ints, structs, etc.).

Collections allows you to work with state as if they were normal golang objects and removes the need<br/>
for you to think of your state as raw bytes in your code.

It also allows you to migrate your existing state without causing any state breakage that forces you into<br/>
tedious and complex chain state migrations.

## Installation [​](https://docs.cosmos.network/v0.50/build/packages/collections#installation "Direct link to Installation")

To install collections in your cosmos-sdk chain project, run the following command:

```codeBlockLines_e6Vv
go get cosmossdk.io/collections

```

## Core Types [​](https://docs.cosmos.network/v0.50/build/packages/collections#core-types "Direct link to Core types")

Collections offers 5 different APIs to work with state, which will be explored in the next sections, these APIs are:

- `Map`: to work with typed arbitrary KV pairings.
- `KeySet`: to work with just typed keys
- `Item`: to work with just one typed value
- `Sequence`: which is a monotonically increasing number.
- `IndexedMap`: which combines `Map` and `KeySet` to provide a `Map` with indexing capabilities.

## Preliminary Components [​](https://docs.cosmos.network/v0.50/build/packages/collections#preliminary-components "Direct link to Preliminary components")

Before exploring the different collections types and their capability it is necessary to introduce<br/>
the three components that every collection shares. In fact when instantiating a collection type by doing, for example,<br/>
`collections.NewMap/collections.NewItem/…` you will find yourself having to pass them some common arguments.

For example, in code:

```go
package collections

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    sdk "github.com/cosmos/cosmos-sdk/types"
)

var AllowListPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema    collections.Schema
    AllowList collections.KeySet[string]
}

func NewKeeper(storeKey *storetypes.KVStoreKey) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))

    return Keeper{
        AllowList: collections.NewKeySet(sb, AllowListPrefix, "allow_list", collections.StringKey),
    }
}

```

Let's analyse the shared arguments, what they do, and why we need them.

### SchemaBuilder [​](https://docs.cosmos.network/v0.50/build/packages/collections#schemabuilder "Direct link to SchemaBuilder")

The first argument passed is the `SchemaBuilder`

`SchemaBuilder` is a structure that keeps track of all the state of a module, it is not required by the collections<br/>
to deal with state but it offers a dynamic and reflective way for clients to explore a module's state.

We instantiate a `SchemaBuilder` by passing it a function that given the modules store key returns the module's specific store.

We then need to pass the schema builder to every collection type we instantiate in our keeper, in our case the `AllowList`.

### Prefix [​](https://docs.cosmos.network/v0.50/build/packages/collections#prefix "Direct link to Prefix")

The second argument passed to our `KeySet` is a `collections.Prefix`, a prefix represents a partition of the module's `KVStore`<br/>
where all the state of a specific collection will be saved.

Since a module can have multiple collections, the following is expected:

- module params will become a `collections.Item`
- the `AllowList` is a `collections.KeySet`

We don't want a collection to write over the state of the other collection so we pass it a prefix, which defines a storage<br/>
partition owned by the collection.

If you already built modules, the prefix translates to the items you were creating in your `types/keys.go` file, example: [https://github.com/cosmos/cosmos-sdk/blob/main/x/feegrant/key.go#L27](https://github.com/cosmos/cosmos-sdk/blob/main/x/feegrant/key.go#L27)

your old:

```go
var (
    // FeeAllowanceKeyPrefix is the set of the kvstore for fee allowance data
    // - 0x00<allowance_key_bytes>: allowance
    FeeAllowanceKeyPrefix = []byte{0x00}

    // FeeAllowanceQueueKeyPrefix is the set of the kvstore for fee allowance keys data
    // - 0x01<allowance_prefix_queue_key_bytes>: <empty value>
    FeeAllowanceQueueKeyPrefix = []byte{0x01}
)

```

becomes:

```codeBlockLines_e6Vv
var (
    // FeeAllowanceKeyPrefix is the set of the kvstore for fee allowance data
    // - 0x00<allowance_key_bytes>: allowance
    FeeAllowanceKeyPrefix = collections.NewPrefix(0)

    // FeeAllowanceQueueKeyPrefix is the set of the kvstore for fee allowance keys data
    // - 0x01<allowance_prefix_queue_key_bytes>: <empty value>
    FeeAllowanceQueueKeyPrefix = collections.NewPrefix(1)
)

```

#### Rules [​](https://docs.cosmos.network/v0.50/build/packages/collections#rules "Direct link to Rules")

`collections.NewPrefix` accepts either `uint8`, `string` or `[]bytes` it's good practice to use an always increasing `uint8` for disk space efficiency.

A collection **MUST NOT** share the same prefix as another collection in the same module, and a collection prefix **MUST NEVER** start with the same prefix as another, examples:

```codeBlockLines_e6Vv
prefix1 := collections.NewPrefix("prefix")
prefix2 := collections.NewPrefix("prefix") // THIS IS BAD!

```

```codeBlockLines_e6Vv
prefix1 := collections.NewPrefix("a")
prefix2 := collections.NewPrefix("aa") // prefix2 starts with the same as prefix1: BAD!!!

```

### Human-Readable Name [​](https://docs.cosmos.network/v0.50/build/packages/collections#human-readable-name "Direct link to Human-Readable Name")

The third parameter we pass to a collection is a string, which is a human-readable name.<br/>
It is needed to make the role of a collection understandable by clients who have no clue about<br/>
what a module is storing in state.

#### Rules [​](https://docs.cosmos.network/v0.50/build/packages/collections#rules-1 "Direct link to Rules")

Each collection in a module **MUST** have a unique humanised name.

## Key and Value Codecs [​](https://docs.cosmos.network/v0.50/build/packages/collections#key-and-value-codecs "Direct link to Key and Value Codecs")

A collection is generic over the type you can use as keys or values.<br/>
This makes collections dumb, but also means that hypothetically we can store everything<br/>
that can be a go type into a collection. We are not bounded to any type of encoding (be it proto, json or whatever)

So a collection needs to be given a way to understand how to convert your keys and values to bytes.<br/>
This is achieved through `KeyCodec` and `ValueCodec`, which are arguments that you pass to your<br/>
collections when you're instantiating them using the `collections.NewMap/collections.NewItem/…`<br/>
instantiation functions.

NOTE: Generally speaking you will never be required to implement your own `Key/ValueCodec` as<br/>
the SDK and collections libraries already come with default, safe and fast implementation of those.<br/>
You might need to implement them only if you're migrating to collections and there are state layout incompatibilities.

Let's explore an example:

```codeBlockLines_e6Vv
package collections

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    sdk "github.com/cosmos/cosmos-sdk/types"
)

var IDsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema    collections.Schema
    IDs   collections.Map[string, uint64]
}

func NewKeeper(storeKey *storetypes.KVStoreKey) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))

    return Keeper{
        IDs: collections.NewMap(sb, IDsPrefix, "ids", collections.StringKey, collections.Uint64Value),
    }
}

```

We're now instantiating a map where the key is string and the value is `uint64`.<br/>
We already know the first three arguments of the `NewMap` function.

The fourth parameter is our `KeyCodec`, we know that the `Map` has `string` as key so we pass it a `KeyCodec` that handles strings as keys.

The fifth parameter is our `ValueCodec`, we know that the `Map` as a `uint64` as value so we pass it a `ValueCodec` that handles uint64.

Collections already comes with all the required implementations for golang primitive types.

Let's make another example, this falls closer to what we build using cosmos SDK, let's say we want<br/>
to create a `collections.Map` that maps account addresses to their base account. So we want to map an `sdk.AccAddress` to an `auth.BaseAccount` (which is a proto):

```codeBlockLines_e6Vv
package collections

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

var AccountsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema    collections.Schema
    Accounts   collections.Map[sdk.AccAddress, authtypes.BaseAccount]
}

func NewKeeper(storeKey *storetypes.KVStoreKey, cdc codec.BinaryCodec) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Accounts: collections.NewMap(sb, AccountsPrefix, "accounts",
            sdk.AccAddressKey, codec.CollValue[authtypes.BaseAccount](cdc)),
    }
}

```

As we can see here since our `collections.Map` maps `sdk.AccAddress` to `authtypes.BaseAccount`,<br/>
we use the `sdk.AccAddressKey` which is the `KeyCodec` implementation for `AccAddress` and we use `codec.CollValue` to<br/>
encode our proto type `BaseAccount`.

Generally speaking you will always find the respective key and value codecs for types in the `go.mod` path you're using<br/>
to import that type. If you want to encode proto values refer to the codec `codec.CollValue` function, which allows you<br/>
to encode any type implement the `proto.Message` interface.

## Map [​](https://docs.cosmos.network/v0.50/build/packages/collections#map "Direct link to Map")

We analyse the first and most important collection type, the `collections.Map`.<br/>
This is the type that everything else builds on top of.

### Use case [​](https://docs.cosmos.network/v0.50/build/packages/collections#use-case "Direct link to Use case")

A `collections.Map` is used to map arbitrary keys with arbitrary values.

### Example [​](https://docs.cosmos.network/v0.50/build/packages/collections#example "Direct link to Example")

It's easier to explain a `collections.Map` capabilities through an example:

```codeBlockLines_e6Vv
package collections

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    "fmt"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

var AccountsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema    collections.Schema
    Accounts   collections.Map[sdk.AccAddress, authtypes.BaseAccount]
}

func NewKeeper(storeKey *storetypes.KVStoreKey, cdc codec.BinaryCodec) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Accounts: collections.NewMap(sb, AccountsPrefix, "accounts",
            sdk.AccAddressKey, codec.CollValue[authtypes.BaseAccount](cdc)),
    }
}

func (k Keeper) CreateAccount(ctx sdk.Context, addr sdk.AccAddress, account authtypes.BaseAccount) error {
    has, err := k.Accounts.Has(ctx, addr)
    if err != nil {
        return err
    }
    if has {
        return fmt.Errorf("account already exists: %s", addr)
    }

    err = k.Accounts.Set(ctx, addr, account)
    if err != nil {
        return err
    }
    return nil
}

func (k Keeper) GetAccount(ctx sdk.Context, addr sdk.AccAddress) (authtypes.BaseAccount, error) {
    acc, err := k.Accounts.Get(ctx, addr)
    if err != nil {
        return authtypes.BaseAccount{}, err
    }

    return acc, nil
}

func (k Keeper) RemoveAccount(ctx sdk.Context, addr sdk.AccAddress) error {
    err := k.Accounts.Remove(ctx, addr)
    if err != nil {
        return err
    }
    return nil
}

```

#### Set Method [​](https://docs.cosmos.network/v0.50/build/packages/collections#set-method "Direct link to Set method")

Set maps with the provided `AccAddress` (the key) to the `auth.BaseAccount` (the value).

Under the hood the `collections.Map` will convert the key and value to bytes using the [key and value codec](https://docs.cosmos.network/v0.50/build/packages/README.md#key-and-value-codecs).<br/>
It will prepend to our bytes key the [prefix](https://docs.cosmos.network/v0.50/build/packages/README.md#prefix) and store it in the KVStore of the module.

#### Has Method [​](https://docs.cosmos.network/v0.50/build/packages/collections#has-method "Direct link to Has method")

The has method reports if the provided key exists in the store.

#### Get Method [​](https://docs.cosmos.network/v0.50/build/packages/collections#get-method "Direct link to Get method")

The get method accepts the `AccAddress` and returns the associated `auth.BaseAccount` if it exists, otherwise it errors.

#### Remove Method [​](https://docs.cosmos.network/v0.50/build/packages/collections#remove-method "Direct link to Remove method")

The remove method accepts the `AccAddress` and removes it from the store. It won't report errors<br/>
if it does not exist, to check for existence before removal use the `Has` method.

#### Iteration [​](https://docs.cosmos.network/v0.50/build/packages/collections#iteration "Direct link to Iteration")

Iteration has a separate section.

## KeySet [​](https://docs.cosmos.network/v0.50/build/packages/collections#keyset "Direct link to KeySet")

The second type of collection is `collections.KeySet`, as the word suggests it maintains<br/>
only a set of keys without values.

### Implementation Curiosity [​](https://docs.cosmos.network/v0.50/build/packages/collections#implementation-curiosity "Direct link to Implementation curiosity")

A `collections.KeySet` is just a `collections.Map` with a `key` but no value.<br/>
The value internally is always the same and is represented as an empty byte slice `[]byte{}`.

## Example [​](https://docs.cosmos.network/v0.50/build/packages/collections#example-1 "Direct link to Example")

As always we explore the collection type through an example:

```codeBlockLines_e6Vv
package collections

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    "fmt"
    sdk "github.com/cosmos/cosmos-sdk/types"
)

var ValidatorsSetPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema        collections.Schema
    ValidatorsSet collections.KeySet[sdk.ValAddress]
}

func NewKeeper(storeKey *storetypes.KVStoreKey) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        ValidatorsSet: collections.NewKeySet(sb, ValidatorsSetPrefix, "validators_set", sdk.ValAddressKey),
    }
}

func (k Keeper) AddValidator(ctx sdk.Context, validator sdk.ValAddress) error {
    has, err := k.ValidatorsSet.Has(ctx, validator)
    if err != nil {
        return err
    }
    if has {
        return fmt.Errorf("validator already in set: %s", validator)
    }

    err = k.ValidatorsSet.Set(ctx, validator)
    if err != nil {
        return err
    }

    return nil
}

func (k Keeper) RemoveValidator(ctx sdk.Context, validator sdk.ValAddress) error {
    err := k.ValidatorsSet.Remove(ctx, validator)
    if err != nil {
        return err
    }
    return nil
}

```

The first difference we notice is that `KeySet` needs use to specify only one type parameter: the key (`sdk.ValAddress` in this case).<br/>
The second difference we notice is that `KeySet` in its `NewKeySet` function does not require<br/>
us to specify a `ValueCodec` but only a `KeyCodec`. This is because a `KeySet` only saves keys and not values.

Let's explore the methods.

### Has Method [​](https://docs.cosmos.network/v0.50/build/packages/collections#has-method-1 "Direct link to Has method")

Has allows us to understand if a key is present in the `collections.KeySet` or not, functions in the same way as `collections.Map.Has<br/>
`

### Set Method [​](https://docs.cosmos.network/v0.50/build/packages/collections#set-method-1 "Direct link to Set method")

Set inserts the provided key in the `KeySet`.

### Remove Method [​](https://docs.cosmos.network/v0.50/build/packages/collections#remove-method-1 "Direct link to Remove method")

Remove removes the provided key from the `KeySet`, it does not error if the key does not exist,<br/>
if existence check before removal is required it needs to be coupled with the `Has` method.

## Item [​](https://docs.cosmos.network/v0.50/build/packages/collections#item "Direct link to Item")

The third type of collection is the `collections.Item`.<br/>
It stores only one single item, it's useful for example for parameters, there's only one instance<br/>
of parameters in state always.

### Implementation Curiosity [​](https://docs.cosmos.network/v0.50/build/packages/collections#implementation-curiosity-1 "Direct link to implementation curiosity")

A `collections.Item` is just a `collections.Map` with no key but just a value.<br/>
The key is the prefix of the collection!

## Example [​](https://docs.cosmos.network/v0.50/build/packages/collections#example-2 "Direct link to Example")

```codeBlockLines_e6Vv
package collections

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
)

var ParamsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema        collections.Schema
    Params collections.Item[stakingtypes.Params]
}

func NewKeeper(storeKey *storetypes.KVStoreKey, cdc codec.BinaryCodec) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Params: collections.NewItem(sb, ParamsPrefix, "params", codec.CollValue[stakingtypes.Params](cdc)),
    }
}

func (k Keeper) UpdateParams(ctx sdk.Context, params stakingtypes.Params) error {
    err := k.Params.Set(ctx, params)
    if err != nil {
        return err
    }
    return nil
}

func (k Keeper) GetParams(ctx sdk.Context) (stakingtypes.Params, error) {
    return k.Params.Get(ctx)
}

```

The first key difference we notice is that we specify only one type parameter, which is the value we're storing.<br/>
The second key difference is that we don't specify the `KeyCodec`, since we store only one item we already know the key<br/>
and the fact that it is constant.

## Iteration [​](https://docs.cosmos.network/v0.50/build/packages/collections#iteration-1 "Direct link to Iteration")

One of the key features of the `KVStore` is iterating over keys.

Collections which deal with keys (so `Map`, `KeySet` and `IndexedMap`) allow you to iterate<br/>
over keys in a safe and typed way. They all share the same API, the only difference being<br/>
that `KeySet` returns a different type of `Iterator` because `KeySet` only deals with keys.

note

Every collection shares the same `Iterator` semantics.

Let's have a look at the `Map.Iterate` method:

```codeBlockLines_e6Vv
func (m Map[K, V]) Iterate(ctx context.Context, ranger Ranger[K]) (Iterator[K, V], error)

```

It accepts a `collections.Ranger[K]`, which is an API that instructs map on how to iterate over keys.<br/>
As always we don't need to implement anything here as `collections` already provides some generic `Ranger` implementers<br/>
that expose all you need to work with ranges.

### Example [​](https://docs.cosmos.network/v0.50/build/packages/collections#example-3 "Direct link to Example")

We have a `collections.Map` that maps accounts using `uint64` IDs.

```codeBlockLines_e6Vv
package collections

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

var AccountsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema   collections.Schema
    Accounts collections.Map[uint64, authtypes.BaseAccount]
}

func NewKeeper(storeKey *storetypes.KVStoreKey, cdc codec.BinaryCodec) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Accounts: collections.NewMap(sb, AccountsPrefix, "accounts", collections.Uint64Key, codec.CollValue[authtypes.BaseAccount](cdc)),
    }
}

func (k Keeper) GetAllAccounts(ctx sdk.Context) ([]authtypes.BaseAccount, error) {
    // passing a nil Ranger equals to: iterate over every possible key
    iter, err := k.Accounts.Iterate(ctx, nil)
    if err != nil {
        return nil, err
    }
    accounts, err := iter.Values()
    if err != nil {
        return nil, err
    }

    return accounts, err
}

func (k Keeper) IterateAccountsBetween(ctx sdk.Context, start, end uint64) ([]authtypes.BaseAccount, error) {
    // The collections.Range API offers a lot of capabilities
    // like defining where the iteration starts or ends.
    rng := new(collections.Range[uint64]).
        StartInclusive(start).
        EndExclusive(end).
        Descending()

    iter, err := k.Accounts.Iterate(ctx, rng)
    if err != nil {
        return nil, err
    }
    accounts, err := iter.Values()
    if err != nil {
        return nil, err
    }

    return accounts, nil
}

func (k Keeper) IterateAccounts(ctx sdk.Context, do func(id uint64, acc authtypes.BaseAccount) (stop bool)) error {
    iter, err := k.Accounts.Iterate(ctx, nil)
    if err != nil {
        return err
    }
    defer iter.Close()

    for ; iter.Valid(); iter.Next() {
        kv, err := iter.KeyValue()
        if err != nil {
            return err
        }

        if do(kv.Key, kv.Value) {
            break
        }
    }
    return nil
}

```

Let's analyse each method in the example and how it makes use of the `Iterate` and the returned `Iterator` API.

#### GetAllAccounts [​](https://docs.cosmos.network/v0.50/build/packages/collections#getallaccounts "Direct link to GetAllAccounts")

In `GetAllAccounts` we pass to our `Iterate` a nil `Ranger`. This means that the returned `Iterator` will include<br/>
all the existing keys within the collection.

Then we use some the `Values` method from the returned `Iterator` API to collect all the values into a slice.

`Iterator` offers other methods such as `Keys()` to collect only the keys and not the values and `KeyValues` to collect<br/>
all the keys and values.

#### IterateAccountsBetween [​](https://docs.cosmos.network/v0.50/build/packages/collections#iterateaccountsbetween "Direct link to IterateAccountsBetween")

Here we make use of the `collections.Range` helper to specialise our range.<br/>
We make it start in a point through `StartInclusive` and end in the other with `EndExclusive`, then<br/>
we instruct it to report us results in reverse order through `Descending`

Then we pass the range instruction to `Iterate` and get an `Iterator`, which will contain only the results<br/>
we specified in the range.

Then we use again th `Values` method of the `Iterator` to collect all the results.

`collections.Range` also offers a `Prefix` API which is not applicable to all keys types,<br/>
for example uint64 cannot be prefix because it is of constant size, but a `string` key<br/>
can be prefixed.

#### IterateAccounts [​](https://docs.cosmos.network/v0.50/build/packages/collections#iterateaccounts "Direct link to IterateAccounts")

Here we showcase how to lazily collect values from an Iterator.

note

`Keys/Values/KeyValues` fully consume and close the `Iterator`, here we need to explicitly do a `defer iterator.Close()` call.

`Iterator` also exposes a `Value` and `Key` method to collect only the current value or key, if collecting both is not needed.

note

For this `callback` pattern, collections expose a `Walk` API.

## Composite Keys [​](https://docs.cosmos.network/v0.50/build/packages/collections#composite-keys "Direct link to Composite keys")

So far we've worked only with simple keys, like `uint64`, the account address, etc.<br/>
There are some more complex cases in, which we need to deal with composite keys.

A key is composite when it is composed of multiple keys, for example bank balances as stored as the composite key<br/>
`(AccAddress, string)` where the first part is the address holding the coins and the second part is the denom.

Example, let's say address `BOB` holds `10atom,15osmo`, this is how it is stored in state:

```codeBlockLines_e6Vv
(bob, atom) => 10
(bob, osmos) => 15

```

Now this allows to efficiently get a specific denom balance of an address, by simply `getting` `(address, denom)`, or getting all the balances<br/>
of an address by prefixing over `(address)`.

Let's see now how we can work with composite keys using collections.

### Example [​](https://docs.cosmos.network/v0.50/build/packages/collections#example-4 "Direct link to Example")

In our example we will show-case how we can use collections when we are dealing with balances, similar to bank,<br/>
a balance is a mapping between `(address, denom) => math.Int` the composite key in our case is `(address, denom)`.

## Instantiation of a Composite Key Collection [​](https://docs.cosmos.network/v0.50/build/packages/collections#instantiation-of-a-composite-key-collection "Direct link to Instantiation of a composite key collection")

```codeBlockLines_e6Vv
package collections

import (
    "cosmossdk.io/collections"
    "cosmossdk.io/math"
    storetypes "cosmossdk.io/store/types"
    sdk "github.com/cosmos/cosmos-sdk/types"
)

var BalancesPrefix = collections.NewPrefix(1)

type Keeper struct {
    Schema   collections.Schema
    Balances collections.Map[collections.Pair[sdk.AccAddress, string], math.Int]
}

func NewKeeper(storeKey *storetypes.KVStoreKey) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Balances: collections.NewMap(
            sb, BalancesPrefix, "balances",
            collections.PairKeyCodec(sdk.AccAddressKey, collections.StringKey),
            math.IntValue,
        ),
    }
}

```

### The Map Key Definition [​](https://docs.cosmos.network/v0.50/build/packages/collections#the-map-key-definition "Direct link to The Map Key definition")

First of all we can see that in order to define a composite key of two elements we use the `collections.Pair` type:

```codeBlockLines_e6Vv
collections.Map[collections.Pair[sdk.AccAddress, string], math.Int]

```

`collections.Pair` defines a key composed of two other keys, in our case the first part is `sdk.AccAddress`, the second<br/>
part is `string`.

### The Key Codec Instantiation [​](https://docs.cosmos.network/v0.50/build/packages/collections#the-key-codec-instantiation "Direct link to The Key Codec instantiation")

The arguments to instantiate are always the same, the only thing that changes is how we instantiate<br/>
the `KeyCodec`, since this key is composed of two keys we use `collections.PairKeyCodec`, which generates<br/>
a `KeyCodec` composed of two key codecs. The first one will encode the first part of the key, the second one will<br/>
encode the second part of the key.

## Working with Composite Key Collections [​](https://docs.cosmos.network/v0.50/build/packages/collections#working-with-composite-key-collections "Direct link to Working with composite key collections")

Let's expand on the example we used before:

```codeBlockLines_e6Vv
var BalancesPrefix = collections.NewPrefix(1)

type Keeper struct {
    Schema   collections.Schema
    Balances collections.Map[collections.Pair[sdk.AccAddress, string], math.Int]
}

func NewKeeper(storeKey *storetypes.KVStoreKey) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Balances: collections.NewMap(
            sb, BalancesPrefix, "balances",
            collections.PairKeyCodec(sdk.AccAddressKey, collections.StringKey),
            math.IntValue,
        ),
    }
}

func (k Keeper) SetBalance(ctx sdk.Context, address sdk.AccAddress, denom string, amount math.Int) error {
    key := collections.Join(address, denom)
    return k.Balances.Set(ctx, key, amount)
}

func (k Keeper) GetBalance(ctx sdk.Context, address sdk.AccAddress, denom string) (math.Int, error) {
    return k.Balances.Get(ctx, collections.Join(address, denom))
}

func (k Keeper) GetAllAddressBalances(ctx sdk.Context, address sdk.AccAddress) (sdk.Coins, error) {
    balances := sdk.NewCoins()

    rng := collections.NewPrefixedPairRange[sdk.AccAddress, string](address)

    iter, err := k.Balances.Iterate(ctx, rng)
    if err != nil {
        return nil, err
    }

    kvs, err := iter.KeyValues()
    if err != nil {
        return nil, err
    }

    for _, kv := range kvs {
        balances = balances.Add(sdk.NewCoin(kv.Key.K2(), kv.Value))
    }
    return balances, nil
}

func (k Keeper) GetAllAddressBalancesBetween(ctx sdk.Context, address sdk.AccAddress, startDenom, endDenom string) (sdk.Coins, error) {
    rng := collections.NewPrefixedPairRange[sdk.AccAddress, string](address).
        StartInclusive(startDenom).
        EndInclusive(endDenom)

    iter, err := k.Balances.Iterate(ctx, rng)
    if err != nil {
        return nil, err
    }
    ...
}

```

### SetBalance [​](https://docs.cosmos.network/v0.50/build/packages/collections#setbalance "Direct link to SetBalance")

As we can see here we're setting the balance of an address for a specific denom.<br/>
We use the `collections.Join` function to generate the composite key.<br/>
`collections.Join` returns a `collections.Pair` (which is the key of our `collections.Map`)

`collections.Pair` contains the two keys we have joined, it also exposes two methods: `K1` to fetch the 1st part of the<br/>
key and `K2` to fetch the second part.

As always, we use the `collections.Map.Set` method to map the composite key to our value (`math.Int` in this case)

### GetBalance [​](https://docs.cosmos.network/v0.50/build/packages/collections#getbalance "Direct link to GetBalance")

To get a value in composite key collection, we simply use `collections.Join` to compose the key.

### GetAllAddressBalances [​](https://docs.cosmos.network/v0.50/build/packages/collections#getalladdressbalances "Direct link to GetAllAddressBalances")

We use `collections.PrefixedPairRange` to iterate over all the keys starting with the provided address.<br/>
Concretely the iteration will report all the balances belonging to the provided address.

The first part is that we instantiate a `PrefixedPairRange`, which is a `Ranger` implementer aimed to help<br/>
in `Pair` keys iterations.

```codeBlockLines_e6Vv
    rng := collections.NewPrefixedPairRange[sdk.AccAddress, string](address)

```

As we can see here we're passing the type parameters of the `collections.Pair` because golang type inference<br/>
with respect to generics is not as permissive as other languages, so we need to explicitly say what are the types of the pair key.

### GetAllAddressesBalancesBetween [​](https://docs.cosmos.network/v0.50/build/packages/collections#getalladdressesbalancesbetween "Direct link to GetAllAddressesBalancesBetween")

This showcases how we can further specialise our range to limit the results further, by specifying<br/>
the range between the second part of the key (in our case the denoms, which are strings).

## IndexedMap [​](https://docs.cosmos.network/v0.50/build/packages/collections#indexedmap "Direct link to IndexedMap")

`collections.IndexedMap` is a collection that uses under the hood a `collections.Map`, and has a struct, which contains the indexes that we need to define.

### Example [​](https://docs.cosmos.network/v0.50/build/packages/collections#example-5 "Direct link to Example")

Let's say we have an `auth.BaseAccount` struct which looks like the following:

```codeBlockLines_e6Vv
type BaseAccount struct {
    AccountNumber uint64     `protobuf:"varint,3,opt,name=account_number,json=accountNumber,proto3" json:"account_number,omitempty"`
    Sequence      uint64     `protobuf:"varint,4,opt,name=sequence,proto3" json:"sequence,omitempty"`
}

```

First of all, when we save our accounts in state we map them using a primary key `sdk.AccAddress`.<br/>
If it were to be a `collections.Map` it would be `collections.Map[sdk.AccAddres, authtypes.BaseAccount]`.

Then we also want to be able to get an account not only by its `sdk.AccAddress`, but also by its `AccountNumber`.

So we can say we want to create an `Index` that maps our `BaseAccount` to its `AccountNumber`.

We also know that this `Index` is unique. Unique means that there can only be one `BaseAccount` that maps to a specific<br/>
`AccountNumber`.

First of all, we start by defining the object that contains our index:

```codeBlockLines_e6Vv
var AccountsNumberIndexPrefix = collections.NewPrefix(1)

type AccountsIndexes struct {
    Number *indexes.Unique[uint64, sdk.AccAddress, authtypes.BaseAccount]
}

func (a AccountsIndexes) IndexesList() []collections.Index[sdk.AccAddress, authtypes.BaseAccount] {
    return []collections.Index[sdk.AccAddress, authtypes.BaseAccount]{a.Number}
}

func NewAccountIndexes(sb *collections.SchemaBuilder) AccountsIndexes {
    return AccountsIndexes{
        Number: indexes.NewUnique(
            sb, AccountsNumberIndexPrefix, "accounts_by_number",
            collections.Uint64Key, sdk.AccAddressKey,
            func(_ sdk.AccAddress, v authtypes.BaseAccount) (uint64, error) {
                return v.AccountNumber, nil
            },
        ),
    }
}

```

We create an `AccountIndexes` struct which contains a field: `Number`. This field represents our `AccountNumber` index.<br/>
`AccountNumber` is a field of `authtypes.BaseAccount` and it's a `uint64`.

Then we can see in our `AccountIndexes` struct the `Number` field is defined as:

```codeBlockLines_e6Vv
*indexes.Unique[uint64, sdk.AccAddress, authtypes.BaseAccount]

```

Where the first type parameter is `uint64`, which is the field type of our index.<br/>
The second type parameter is the primary key `sdk.AccAddress`<br/>
And the third type parameter is the actual object we're storing `authtypes.BaseAccount`.

Then we implement a function called `IndexesList` on our `AccountIndexes` struct, this will be used<br/>
by the `IndexedMap` to keep the underlying map in sync with the indexes, in our case `Number`.<br/>
This function just needs to return the slice of indexes contained in the struct.

Then we create a `NewAccountIndexes` function that instantiates and returns the `AccountsIndexes` struct.

The function takes a `SchemaBuilder`. Then we instantiate our `indexes.Unique`, let's analyse the arguments we pass to<br/>
`indexes.NewUnique`.

#### Instantiating a `indexes.Unique` [​](https://docs.cosmos.network/v0.50/build/packages/collections#instantiating-a-indexesunique "Direct link to instantiating-a-indexesunique")

The first three arguments, we already know them, they are: `SchemaBuilder`, `Prefix` which is our index prefix (the partition<br/>
where index keys relationship for the `Number` index will be maintained), and the human name for the `Number` index.

The second argument is a `collections.Uint64Key` which is a key codec to deal with `uint64` keys, we pass that because<br/>
the key we're trying to index is a `uint64` key (the account number), and then we pass as fifth argument the primary key codec,<br/>
which in our case is `sdk.AccAddress` (remember: we're mapping `sdk.AccAddress` =\> `BaseAccount`).

Then as last parameter we pass a function that: given the `BaseAccount` returns its `AccountNumber`.

After this we can proceed instantiating our `IndexedMap`.

```codeBlockLines_e6Vv
var AccountsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema   collections.Schema
    Accounts *collections.IndexedMap[sdk.AccAddress, authtypes.BaseAccount, AccountsIndexes]
}

func NewKeeper(storeKey *storetypes.KVStoreKey, cdc codec.BinaryCodec) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Accounts: collections.NewIndexedMap(
            sb, AccountsPrefix, "accounts",
            sdk.AccAddressKey, codec.CollValue[authtypes.BaseAccount](cdc),
            NewAccountIndexes(sb),
        ),
    }
}

```

As we can see here what we do, for now, is the same thing as we did for `collections.Map`.<br/>
We pass it the `SchemaBuilder`, the `Prefix` where we plan to store the mapping between `sdk.AccAddress` and `authtypes.BaseAccount`,<br/>
the human name and the respective `sdk.AccAddress` key codec and `authtypes.BaseAccount` value codec.

Then we pass the instantiation of our `AccountIndexes` through `NewAccountIndexes`.

Full example:

```codeBlockLines_e6Vv
package docs

import (
    "cosmossdk.io/collections"
    "cosmossdk.io/collections/indexes"
    storetypes "cosmossdk.io/store/types"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

var AccountsNumberIndexPrefix = collections.NewPrefix(1)

type AccountsIndexes struct {
    Number *indexes.Unique[uint64, sdk.AccAddress, authtypes.BaseAccount]
}

func (a AccountsIndexes) IndexesList() []collections.Index[sdk.AccAddress, authtypes.BaseAccount] {
    return []collections.Index[sdk.AccAddress, authtypes.BaseAccount]{a.Number}
}

func NewAccountIndexes(sb *collections.SchemaBuilder) AccountsIndexes {
    return AccountsIndexes{
        Number: indexes.NewUnique(
            sb, AccountsNumberIndexPrefix, "accounts_by_number",
            collections.Uint64Key, sdk.AccAddressKey,
            func(_ sdk.AccAddress, v authtypes.BaseAccount) (uint64, error) {
                return v.AccountNumber, nil
            },
        ),
    }
}

var AccountsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema   collections.Schema
    Accounts *collections.IndexedMap[sdk.AccAddress, authtypes.BaseAccount, AccountsIndexes]
}

func NewKeeper(storeKey *storetypes.KVStoreKey, cdc codec.BinaryCodec) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Accounts: collections.NewIndexedMap(
            sb, AccountsPrefix, "accounts",
            sdk.AccAddressKey, codec.CollValue[authtypes.BaseAccount](cdc),
            NewAccountIndexes(sb),
        ),
    }
}

```

### Working with IndexedMaps [​](https://docs.cosmos.network/v0.50/build/packages/collections#working-with-indexedmaps "Direct link to Working with IndexedMaps")

Whilst instantiating `collections.IndexedMap` is tedious, working with them is extremely smooth.

Let's take the full example, and expand it with some use-cases.

```codeBlockLines_e6Vv
package docs

import (
    "cosmossdk.io/collections"
    "cosmossdk.io/collections/indexes"
    storetypes "cosmossdk.io/store/types"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

var AccountsNumberIndexPrefix = collections.NewPrefix(1)

type AccountsIndexes struct {
    Number *indexes.Unique[uint64, sdk.AccAddress, authtypes.BaseAccount]
}

func (a AccountsIndexes) IndexesList() []collections.Index[sdk.AccAddress, authtypes.BaseAccount] {
    return []collections.Index[sdk.AccAddress, authtypes.BaseAccount]{a.Number}
}

func NewAccountIndexes(sb *collections.SchemaBuilder) AccountsIndexes {
    return AccountsIndexes{
        Number: indexes.NewUnique(
            sb, AccountsNumberIndexPrefix, "accounts_by_number",
            collections.Uint64Key, sdk.AccAddressKey,
            func(_ sdk.AccAddress, v authtypes.BaseAccount) (uint64, error) {
                return v.AccountNumber, nil
            },
        ),
    }
}

var AccountsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema   collections.Schema
    Accounts *collections.IndexedMap[sdk.AccAddress, authtypes.BaseAccount, AccountsIndexes]
}

func NewKeeper(storeKey *storetypes.KVStoreKey, cdc codec.BinaryCodec) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Accounts: collections.NewIndexedMap(
            sb, AccountsPrefix, "accounts",
            sdk.AccAddressKey, codec.CollValue[authtypes.BaseAccount](cdc),
            NewAccountIndexes(sb),
        ),
    }
}

func (k Keeper) CreateAccount(ctx sdk.Context, addr sdk.AccAddress) error {
    nextAccountNumber := k.getNextAccountNumber()

    newAcc := authtypes.BaseAccount{
        AccountNumber: nextAccountNumber,
        Sequence:      0,
    }

    return k.Accounts.Set(ctx, addr, newAcc)
}

func (k Keeper) RemoveAccount(ctx sdk.Context, addr sdk.AccAddress) error {
    return k.Accounts.Remove(ctx, addr)
}

func (k Keeper) GetAccountByNumber(ctx sdk.Context, accNumber uint64) (sdk.AccAddress, authtypes.BaseAccount, error) {
    accAddress, err := k.Accounts.Indexes.Number.MatchExact(ctx, accNumber)
    if err != nil {
        return nil, authtypes.BaseAccount{}, err
    }

    acc, err := k.Accounts.Get(ctx, accAddress)
    return accAddress, acc, nil
}

func (k Keeper) GetAccountsByNumber(ctx sdk.Context, startAccNum, endAccNum uint64) ([]authtypes.BaseAccount, error) {
    rng := new(collections.Range[uint64]).
        StartInclusive(startAccNum).
        EndInclusive(endAccNum)

    iter, err := k.Accounts.Indexes.Number.Iterate(ctx, rng)
    if err != nil {
        return nil, err
    }

    return indexes.CollectValues(ctx, k.Accounts, iter)
}

func (k Keeper) getNextAccountNumber() uint64 {
    return 0
}

```

## Collections with Interfaces as Values [​](https://docs.cosmos.network/v0.50/build/packages/collections#collections-with-interfaces-as-values "Direct link to Collections with interfaces as values")

Although cosmos-sdk is shifting away from the usage of interface registry, there are still some places where it is used.<br/>
In order to support old code, we have to support collections with interface values.

The generic `codec.CollValue` is not able to handle interface values, so we need to use a special type `codec.CollValueInterface`.<br/>
`codec.CollValueInterface` takes a `codec.BinaryCodec` as an argument, and uses it to marshal and unmarshal values as interfaces.<br/>
The `codec.CollValueInterface` lives in the `codec` package, whose import path is `github.com/cosmos/cosmos-sdk/codec`.

### Instantiating Collections with Interface Values [​](https://docs.cosmos.network/v0.50/build/packages/collections#instantiating-collections-with-interface-values "Direct link to Instantiating Collections with interface values")

In order to instantiate a collection with interface values, we need to use `codec.CollValueInterface` instead of `codec.CollValue`.

```codeBlockLines_e6Vv
package example

import (
    "cosmossdk.io/collections"
    storetypes "cosmossdk.io/store/types"
    "github.com/cosmos/cosmos-sdk/codec"
    sdk "github.com/cosmos/cosmos-sdk/types"
    authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

var AccountsPrefix = collections.NewPrefix(0)

type Keeper struct {
    Schema   collections.Schema
    Accounts *collections.Map[sdk.AccAddress, sdk.AccountI]
}

func NewKeeper(cdc codec.BinaryCodec, storeKey *storetypes.KVStoreKey) Keeper {
    sb := collections.NewSchemaBuilder(sdk.OpenKVStore(storeKey))
    return Keeper{
        Accounts: collections.NewMap(
            sb, AccountsPrefix, "accounts",
            sdk.AccAddressKey, codec.CollInterfaceValue[sdk.AccountI](cdc),
        ),
    }
}

func (k Keeper) SaveBaseAccount(ctx sdk.Context, account authtypes.BaseAccount) error {
    return k.Accounts.Set(ctx, account.GetAddress(), account)
}

func (k Keeper) SaveModuleAccount(ctx sdk.Context, account authtypes.ModuleAccount) error {
    return k.Accounts.Set(ctx, account.GetAddress(), account)
}

func (k Keeper) GetAccount(ctx sdk.context, addr sdk.AccAddress) (sdk.AccountI, error) {
    return k.Accounts.Get(ctx, addr)
}

```

#### Depinject

# Depinject

> **DISCLAIMER**: This is a **beta** package. The SDK team is actively working on this feature and we are looking for feedback from the community. Please try it out and let us know what you think.

## Overview [​](https://docs.cosmos.network/v0.50/build/packages/depinject#overview "Direct link to Overview")

`depinject` is a dependency injection (DI) framework for the Cosmos SDK, designed to streamline the process of building and configuring blockchain applications. It works in conjunction with the `core/appconfig` module to replace the majority of boilerplate code in `app.go` with a configuration file in Go, YAML, or JSON format.

`depinject` is particularly useful for developing blockchain applications:

- With multiple interdependent components, modules, or services. Helping manage their dependencies effectively.
- That require decoupling of these components, making it easier to test, modify, or replace individual parts without affecting the entire system.
- That are wanting to simplify the setup and initialisation of modules and their dependencies by reducing boilerplate code and automating dependency management.

By using `depinject`, developers can achieve:

- Cleaner and more organised code.
- Improved modularity and maintainability.
- A more maintainable and modular structure for their blockchain applications, ultimately enhancing development velocity and code quality.
- [Go Doc](https://pkg.go.dev/cosmossdk.io/depinject)

## Usage [​](https://docs.cosmos.network/v0.50/build/packages/depinject#usage "Direct link to Usage")

The `depinject` framework, based on dependency injection concepts, streamlines the management of dependencies within your blockchain application using its Configuration API. This API offers a set of functions and methods to create easy to use configurations, making it simple to define, modify, and access dependencies and their relationships.

A core component of the [Configuration API](https://pkg.go.dev/github.com/cosmos/cosmos-sdk/depinject#Config) is the `Provide` function, which allows you to register provider functions that supply dependencies. Inspired by constructor injection, these provider functions form the basis of the dependency tree, enabling the management and resolution of dependencies in a structured and maintainable manner. Additionally, `depinject` supports interface types as inputs to provider functions, offering flexibility and decoupling between components, similar to interface injection concepts.

By leveraging `depinject` and its Configuration API, you can efficiently handle dependencies in your blockchain application, ensuring a clean, modular, and well-organised codebase.

Example:

```codeBlockLines_e6Vv
package main

import (
    "fmt"

    "cosmossdk.io/depinject"
)

type AnotherInt int

func main() {
    var (
      x int
      y AnotherInt
    )

    fmt.Printf("Before (%v, %v)\n", x, y)
    depinject.Inject(
        depinject.Provide(
            func() int { return 1 },
            func() AnotherInt { return AnotherInt(2) },
        ),
        &x,
        &y,
    )
    fmt.Printf("After (%v, %v)\n", x, y)
}

```

In this example, `depinject.Provide` registers two provider functions that return `int` and `AnotherInt` values. The `depinject.Inject` function is then used to inject these values into the variables `x` and `y`.

Provider functions serve as the basis for the dependency tree. They are analysed to identify their inputs as dependencies and their outputs as dependents. These dependents can either be used by another provider function or be stored outside the DI container (e.g., `&x` and `&y` in the example above).

### Interface Type Resolution [​](https://docs.cosmos.network/v0.50/build/packages/depinject#interface-type-resolution "Direct link to Interface type resolution")

`depinject` supports the use of interface types as inputs to provider functions, which helps decouple dependencies between modules. This approach is particularly useful for managing complex systems with multiple modules, such as the Cosmos SDK, where dependencies need to be flexible and maintainable.

For example, `x/bank` expects an [AccountKeeper](https://pkg.go.dev/github.com/cosmos/cosmos-sdk/x/bank/types#AccountKeeper) interface as [input to ProvideModule](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/bank/module.go#L208-L260). `SimApp` uses the implementation in `x/auth`, but the modular design allows for easy changes to the implementation if needed.

Consider the following example:

```codeBlockLines_e6Vv
package duck

type Duck interface {
    quack()
}

type AlsoDuck interface {
    quack()
}

type Mallard struct{}
type Canvasback struct{}

func (duck Mallard) quack()    {}
func (duck Canvasback) quack() {}

type Pond struct {
    Duck AlsoDuck
}

```

In this example, there's a `Pond` struct that has a `Duck` field of type `AlsoDuck`. The `depinject` framework can automatically resolve the appropriate implementation when there's only one available, as shown below:

```codeBlockLines_e6Vv
var pond Pond

depinject.Inject(
  depinject.Provide(
    func() Mallard { return Mallard{} },
    func(duck Duck) Pond {
      return Pond{Duck: duck}
    }),
   &pond)

```

This code snippet results in the `Duck` field of `Pond` being implicitly bound to the `Mallard` implementation because it's the only implementation of the `Duck` interface in the container.

However, if there are multiple implementations of the `Duck` interface, as in the following example, you'll encounter an error:

```codeBlockLines_e6Vv
var pond Pond

depinject.Inject(
  depinject.Provide(
    func() Mallard { return Mallard{} },
    func() Canvasback { return Canvasback{} },
    func(duck Duck) Pond {
      return Pond{Duck: duck}
    }),
   &pond)

```

A specific binding preference for `Duck` is required.

#### `BindInterface` API [​](https://docs.cosmos.network/v0.50/build/packages/depinject#bindinterface-api "Direct link to bindinterface-api")

In the above situation registering a binding for a given interface binding may look like:

```codeBlockLines_e6Vv
depinject.Inject(
  depinject.Configs(
    depinject.BindInterface(
      "duck.Duck",
      "duck.Mallard"),
     depinject.Provide(
       func() Mallard { return Mallard{} },
       func() Canvasback { return Canvasback{} },
       func(duck Duck) APond {
         return Pond{Duck: duck}
      })),
   &pond)

```

Now `depinject` has enough information to provide `Mallard` as an input to `APond`.

### Full Example in Real App [​](https://docs.cosmos.network/v0.50/build/packages/depinject#full-example-in-real-app "Direct link to Full example in real app")

danger

When using `depinject.Inject`, the injected types must be pointers.

simapp/app_v2.go

```codeBlockLines_e6Vv
if err := depinject.Inject(appConfig,
	&appBuilder,
	&app.appCodec,
	&app.legacyAmino,
	&app.txConfig,
	&app.interfaceRegistry,
	&app.AccountKeeper,
	&app.BankKeeper,
	&app.CapabilityKeeper,
	&app.StakingKeeper,
	&app.SlashingKeeper,
	&app.MintKeeper,
	&app.DistrKeeper,
	&app.GovKeeper,
	&app.CrisisKeeper,
	&app.UpgradeKeeper,
	&app.ParamsKeeper,
	&app.AuthzKeeper,
	&app.EvidenceKeeper,
	&app.FeeGrantKeeper,
	&app.GroupKeeper,
	&app.NFTKeeper,
	&app.ConsensusParamsKeeper,
); err != nil {
	panic(err)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/simapp/app_v2.go#L219-L244)

## Debugging [​](https://docs.cosmos.network/v0.50/build/packages/depinject#debugging "Direct link to Debugging")

Issues with resolving dependencies in the container can be done with logs and [Graphviz](https://graphviz.org/) renderings of the container tree.<br/>
By default, whenever there is an error, logs will be printed to stderr and a rendering of the dependency graph in Graphviz DOT format will be saved to `debug_container.dot`.

Here is an example Graphviz rendering of a successful build of a dependency graph:<br/>
![Graphviz Example](https://raw.githubusercontent.com/cosmos/cosmos-sdk/ff39d243d421442b400befcd959ec3ccd2525154/depinject/testdata/example.svg)

Rectangles represent functions, ovals represent types, rounded rectangles represent modules and the single hexagon<br/>
represents the function which called `Build`. Black-colored shapes mark functions and types that were called/resolved<br/>
without an error. Gray-colored nodes mark functions and types that could have been called/resolved in the container but<br/>
were left unused.

Here is an example Graphviz rendering of a dependency graph build which failed:<br/>
![Graphviz Error Example](https://raw.githubusercontent.com/cosmos/cosmos-sdk/ff39d243d421442b400befcd959ec3ccd2525154/depinject/testdata/example_error.svg)

Graphviz DOT files can be converted into SVG's for viewing in a web browser using the `dot` command-line tool, ex:

```codeBlockLines_e6Vv
dot -Tsvg debug_container.dot > debug_container.svg

```

Many other tools including some IDEs support working with DOT files.

- [Overview](https://docs.cosmos.network/v0.50/build/packages/depinject#overview)
- [Usage](https://docs.cosmos.network/v0.50/build/packages/depinject#usage)
  - [Interface type resolution](https://docs.cosmos.network/v0.50/build/packages/depinject#interface-type-resolution)
  - [Full example in real app](https://docs.cosmos.network/v0.50/build/packages/depinject#full-example-in-real-app)
- [Debugging](https://docs.cosmos.network/v0.50/build/packages/depinject#debugging)

### ORM

# ORM

The Cosmos SDK ORM is a state management library that provides a rich, but opinionated set of tools for managing a<br/>
module's state. It provides support for:

- type safe management of state
- multipart keys
- secondary indexes
- unique indexes
- easy prefix and range queries
- automatic genesis import/export
- automatic query services for clients, including support for light client proofs (still in development)
- indexing state data in external databases (still in development)

## Design and Philosophy [​](https://docs.cosmos.network/v0.50/build/packages/orm#design-and-philosophy "Direct link to Design and Philosophy")

The ORM's data model is inspired by the relational data model found in SQL databases. The core abstraction is a table<br/>
with a primary key and optional secondary indexes.

Because the Cosmos SDK uses protobuf as its encoding layer, ORM tables are defined directly in.proto files using<br/>
protobuf options. Each table is defined by a single protobuf `message` type and a schema of multiple tables is<br/>
represented by a single.proto file.

Table structure is specified in the same file where messages are defined in order to make it easy to focus on better<br/>
design of the state layer. Because blockchain state layout is part of the public API for clients (TODO: link to docs on<br/>
light client proofs), it is important to think about the state layout as being part of the public API of a module.<br/>
Changing the state layout actually breaks clients, so it is ideal to think through it carefully up front and to aim for<br/>
a design that will eliminate or minimize breaking changes down the road. Also, good design of state enables building<br/>
more performant and sophisticated applications. Providing users with a set of tools inspired by relational databases<br/>
which have a long history of database design best practices and allowing schema to be specified declaratively in a<br/>
single place are design choices the ORM makes to enable better design and more durable APIs.

Also, by only supporting the table abstraction as opposed to key-value pair maps, it is easy to add to new<br/>
columns/fields to any data structure without causing a breaking change and the data structures can easily be indexed in<br/>
any off-the-shelf SQL database for more sophisticated queries.

The encoding of fields in keys is designed to support ordered iteration for all protobuf primitive field types<br/>
except for `bytes` as well as the well-known types `google.protobuf.Timestamp` and `google.protobuf.Duration`. Encodings<br/>
are optimized for storage space when it makes sense (see the documentation in `cosmos/orm/v1/orm.proto` for more details)<br/>
and table rows do not use extra storage space to store key fields in the value.

We recommend that users of the ORM attempt to follow database design best practices such as<br/>
[normalization](https://en.wikipedia.org/wiki/Database_normalization) (at least 1NF).<br/>
For instance, defining `repeated` fields in a table is considered an anti-pattern because breaks first normal form (1NF).<br/>
Although we support `repeated` fields in tables, they cannot be used as key fields for this reason. This may seem<br/>
restrictive but years of best practice (and also experience in the SDK) have shown that following this pattern<br/>
leads to easier to maintain schemas.

To illustrate the motivation for these principles with an example from the SDK, historically balances were stored<br/>
as a mapping from account -> map of denom to amount. This did not scale well because an account with 100 token balances<br/>
needed to be encoded/decoded every time a single coin balance changed. Now balances are stored as account,denom -> amount<br/>
as in the example above. With the ORM's data model, if we wanted to add a new field to `Balance` such as<br/>
`unlocked_balance` (if vesting accounts were redesigned in this way), it would be easy to add it to this table without<br/>
requiring a data migration. Because of the ORM's optimizations, the account and denom are only stored in the key part<br/>
of storage and not in the value leading to both a flexible data model and efficient usage of storage.

## Defining Tables [​](https://docs.cosmos.network/v0.50/build/packages/orm#defining-tables "Direct link to Defining Tables")

To define a table:

NaN. create a.proto file to describe the module's state (naming it `state.proto` is recommended for consistency),<br/>
and import "cosmos/orm/v1/orm.proto", ex:

```proto
syntax = "proto3";
package bank_example;

import "cosmos/orm/v1/orm.proto";

```

NaN. define a `message` for the table, ex:

```proto
message Balance {
  bytes account = 1;
  string denom = 2;
  uint64 balance = 3;
}

```

NaN. add the `cosmos.orm.v1.table` option to the table and give the table an `id` unique within this.proto file:

```proto
message Balance {
  option (cosmos.orm.v1.table) = {
    id: 1
  };

  bytes account = 1;
  string denom = 2;
  uint64 balance = 3;
}

```

NaN. define the primary key field or fields, as a comma-separated list of the fields from the message which should make<br/>
up the primary key:

```codeBlockLines_e6Vv
message Balance {
  option (cosmos.orm.v1.table) = {
    id: 1
    primary_key: { fields: "account,denom" }
  };

  bytes account = 1;
  string denom = 2;
  uint64 balance = 3;
}

```

NaN. add any desired secondary indexes by specifying an `id` unique within the table and a comma-separate list of the<br/>
index fields:

```codeBlockLines_e6Vv
message Balance {
  option (cosmos.orm.v1.table) = {
    id: 1;
    primary_key: { fields: "account,denom" }
    index: { id: 1 fields: "denom" } // this allows querying for the accounts which own a denom
  };

  bytes account = 1;
  string denom   = 2;
  uint64 amount  = 3;
}

```

### Auto-incrementing Primary Keys [​](https://docs.cosmos.network/v0.50/build/packages/orm#auto-incrementing-primary-keys "Direct link to Auto-incrementing Primary Keys")

A common pattern in SDK modules and in database design is to define tables with a single integer `id` field with an<br/>
automatically generated primary key. In the ORM we can do this by setting the `auto_increment` option to `true` on the<br/>
primary key, ex:

```codeBlockLines_e6Vv
message Account {
  option (cosmos.orm.v1.table) = {
    id: 2;
    primary_key: { fields: "id", auto_increment: true }
  };

  uint64 id = 1;
  bytes address = 2;
}

```

### Unique Indexes [​](https://docs.cosmos.network/v0.50/build/packages/orm#unique-indexes "Direct link to Unique Indexes")

A unique index can be added by setting the `unique` option to `true` on an index, ex:

```codeBlockLines_e6Vv
message Account {
  option (cosmos.orm.v1.table) = {
    id: 2;
    primary_key: { fields: "id", auto_increment: true }
    index: {id: 1, fields: "address", unique: true}
  };

  uint64 id = 1;
  bytes address = 2;
}

```

### Singletons [​](https://docs.cosmos.network/v0.50/build/packages/orm#singletons "Direct link to Singletons")

The ORM also supports a special type of table with only one row called a `singleton`. This can be used for storing<br/>
module parameters. Singletons only need to define a unique `id` and that cannot conflict with the id of other<br/>
tables or singletons in the same.proto file. Ex:

```codeBlockLines_e6Vv
message Params {
  option (cosmos.orm.v1.singleton) = {
    id: 3;
  };

  google.protobuf.Duration voting_period = 1;
  uint64 min_threshold = 2;
}

```

## Running Codegen [​](https://docs.cosmos.network/v0.50/build/packages/orm#running-codegen "Direct link to Running Codegen")

NOTE: the ORM will only work with protobuf code that implements the [google.golang.org/protobuf](https://pkg.go.dev/google.golang.org/protobuf)<br/>
API. That means it will not work with code generated using gogo-proto.

To install the ORM's code generator, run:

```codeBlockLines_e6Vv
go install cosmossdk.io/orm/cmd/protoc-gen-go-cosmos-orm@latest

```

The recommended way to run the code generator is to use [buf build](https://docs.buf.build/build/usage).<br/>
This is an example `buf.gen.yaml` that runs `protoc-gen-go`, `protoc-gen-go-grpc` and `protoc-gen-go-cosmos-orm`<br/>
using buf managed mode:

```codeBlockLines_e6Vv
version: v1
managed:
  enabled: true
  go_package_prefix:
    default: foo.bar/api # the go package prefix of your package
    override:
      buf.build/cosmos/cosmos-sdk: cosmossdk.io/api # required to import the Cosmos SDK api module
plugins:
  - name: go
    out: .
    opt: paths=source_relative
  - name: go-grpc
    out: .
    opt: paths=source_relative
  - name: go-cosmos-orm
    out: .
    opt: paths=source_relative

```

## Using the ORM in a Module [​](https://docs.cosmos.network/v0.50/build/packages/orm#using-the-orm-in-a-module "Direct link to Using the ORM in a module")

### Initialization [​](https://docs.cosmos.network/v0.50/build/packages/orm#initialization "Direct link to Initialization")

To use the ORM in a module, first create a `ModuleSchemaDescriptor`. This tells the ORM which.proto files have defined<br/>
an ORM schema and assigns them all a unique non-zero id. Ex:

```codeBlockLines_e6Vv
var MyModuleSchema = &ormv1alpha1.ModuleSchemaDescriptor{
    SchemaFile: []*ormv1alpha1.ModuleSchemaDescriptor_FileEntry{
        {
            Id:            1,
            ProtoFileName: mymodule.File_my_module_state_proto.Path(),
        },
    },
}

```

In the ORM generated code for a file named `state.proto`, there should be an interface `StateStore` that got generated<br/>
with a constructor `NewStateStore` that takes a parameter of type `ormdb.ModuleDB`. Add a reference to `StateStore`<br/>
to your module's keeper struct. Ex:

```codeBlockLines_e6Vv
type Keeper struct {
    db StateStore
}

```

Then instantiate the `StateStore` instance via an `ormdb.ModuleDB` that is instantiated from the `SchemaDescriptor`<br/>
above and one or more store services from `cosmossdk.io/core/store`. Ex:

```codeBlockLines_e6Vv
func NewKeeper(storeService store.KVStoreService) (*Keeper, error) {
    modDb, err := ormdb.NewModuleDB(MyModuleSchema, ormdb.ModuleDBOptions{KVStoreService: storeService})
    if err != nil {
        return nil, err
    }
    db, err := NewStateStore(modDb)
    if err != nil {
        return nil, err
    }
    return Keeper{db: db}, nil
}

```

### Using the Generated Code [​](https://docs.cosmos.network/v0.50/build/packages/orm#using-the-generated-code "Direct link to Using the generated code")

The generated code for the ORM contains methods for inserting, updating, deleting and querying table entries.<br/>
For each table in a.proto file, there is a type-safe table interface implemented in generated code. For instance,<br/>
for a table named `Balance` there should be a `BalanceTable` interface that looks like this:

```codeBlockLines_e6Vv
type BalanceTable interface {
    Insert(ctx context.Context, balance *Balance) error
    Update(ctx context.Context, balance *Balance) error
    Save(ctx context.Context, balance *Balance) error
    Delete(ctx context.Context, balance *Balance) error
    Has(ctx context.Context, acocunt []byte, denom string) (found bool, err error)
    // Get returns nil and an error which responds true to ormerrors.IsNotFound() if the record was not found.
    Get(ctx context.Context, acocunt []byte, denom string) (*Balance, error)
    List(ctx context.Context, prefixKey BalanceIndexKey, opts ...ormlist.Option) (BalanceIterator, error)
    ListRange(ctx context.Context, from, to BalanceIndexKey, opts ...ormlist.Option) (BalanceIterator, error)
    DeleteBy(ctx context.Context, prefixKey BalanceIndexKey) error
    DeleteRange(ctx context.Context, from, to BalanceIndexKey) error

    doNotImplement()
}

```

This `BalanceTable` should be accessible from the `StateStore` interface (assuming our file is named `state.proto`)<br/>
via a `BalanceTable()` accessor method. If all the above example tables/singletons were in the same `state.proto`,<br/>
then `StateStore` would get generated like this:

```codeBlockLines_e6Vv
type BankStore interface {
    BalanceTable() BalanceTable
    AccountTable() AccountTable
    ParamsTable() ParamsTable

    doNotImplement()
}

```

So to work with the `BalanceTable` in a keeper method we could use code like this:

```codeBlockLines_e6Vv
func (k keeper) AddBalance(ctx context.Context, acct []byte, denom string, amount uint64) error {
    balance, err := k.db.BalanceTable().Get(ctx, acct, denom)
    if err != nil && !ormerrors.IsNotFound(err) {
        return err
    }

    if balance == nil {
        balance = &Balance{
            Account: acct,
            Denom:   denom,
            Amount:  amount,
        }
    } else {
        balance.Amount = balance.Amount + amount
    }

    return k.db.BalanceTable().Save(ctx, balance)
}

```

`List` methods take `IndexKey` parameters. For instance, `BalanceTable.List` takes `BalanceIndexKey`. `BalanceIndexKey`<br/>
let's represent index keys for the different indexes (primary and secondary) on the `Balance` table. The primary key<br/>
in the `Balance` table gets a struct `BalanceAccountDenomIndexKey` and the first index gets an index key `BalanceDenomIndexKey`.<br/>
If we wanted to list all the denoms and amounts that an account holds, we would use `BalanceAccountDenomIndexKey`<br/>
with a `List` query just on the account prefix. Ex:

```codeBlockLines_e6Vv
it, err := keeper.db.BalanceTable().List(ctx, BalanceAccountDenomIndexKey{}.WithAccount(acct))

```
