## `x/auth/tx`

Pre-requisite Readings

- [Transactions](https://docs.cosmos.network/main/core/transactions#transaction-generation)
- [Encoding](https://docs.cosmos.network/main/core/encoding#transaction-encoding)

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#abstract "Direct link to Abstract")

This document specifies the `x/auth/tx` package of the Cosmos SDK.

This package represents the Cosmos SDK implementation of the `client.TxConfig`, `client.TxBuilder`, `client.TxEncoder` and `client.TxDecoder` interfaces.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#contents "Direct link to Contents")

- [Transactions](https://docs.cosmos.network/v0.50/build/modules/auth/tx#transactions)
  - [`TxConfig`](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txconfig)
  - [`TxBuilder`](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txbuilder)
  - [`TxEncoder`/ `TxDecoder`](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txencoder-txdecoder)
- [Client](https://docs.cosmos.network/v0.50/build/modules/auth/tx#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/auth/tx#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/auth/tx#grpc)

### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#transactions "Direct link to Transactions")

#### `TxConfig` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txconfig "Direct link to txconfig")

`client.TxConfig` defines an interface a client can utilize to generate an application-defined concrete transaction type.<br/>
The interface defines a set of methods for creating a `client.TxBuilder`.

client/tx_config.go

```codeBlockLines_e6Vv
TxConfig interface {
	TxEncodingConfig

	NewTxBuilder() TxBuilder
	WrapTxBuilder(sdk.Tx) (TxBuilder, error)
	SignModeHandler() signing.SignModeHandler
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/client/tx_config.go#L25-L31)

The default implementation of `client.TxConfig` is instantiated by `NewTxConfig` in `x/auth/tx` module.

x/auth/tx/config.go

```codeBlockLines_e6Vv
// NewTxConfig returns a new protobuf TxConfig using the provided ProtoCodec and sign modes. The
// first enabled sign mode will become the default sign mode.
// NOTE: Use NewTxConfigWithHandler to provide a custom signing handler in case the sign mode
// is not supported by default (eg: SignMode_SIGN_MODE_EIP_191).
func NewTxConfig(protoCodec codec.ProtoCodecMarshaler, enabledSignModes []signingtypes.SignMode) client.TxConfig {
	return NewTxConfigWithHandler(protoCodec, makeSignModeHandler(enabledSignModes))
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/auth/tx/config.go#L22-L28)

#### `TxBuilder` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txbuilder "Direct link to txbuilder")

client/tx_config.go

```codeBlockLines_e6Vv
// TxBuilder defines an interface which an application-defined concrete transaction
// type must implement. Namely, it must be able to set messages, generate
// signatures, and provide canonical bytes to sign over. The transaction must
// also know how to encode itself.
TxBuilder interface {
	GetTx() signing.Tx

	SetMsgs(msgs ...sdk.Msg) error
	SetSignatures(signatures ...signingtypes.SignatureV2) error
	SetMemo(memo string)
	SetFeeAmount(amount sdk.Coins)
	SetFeePayer(feePayer sdk.AccAddress)
	SetGasLimit(limit uint64)
	SetTip(tip *tx.Tip)
	SetTimeoutHeight(height uint64)
	SetFeeGranter(feeGranter sdk.AccAddress)
	AddAuxSignerData(tx.AuxSignerData) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/client/tx_config.go#L33-L50)

The [`client.TxBuilder`](https://docs.cosmos.network/main/core/transactions#transaction-generation) interface is as well implemented by `x/auth/tx`.<br/>
A `client.TxBuilder` can be accessed with `TxConfig.NewTxBuilder()`.

#### `TxEncoder`/ `TxDecoder` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txencoder-txdecoder "Direct link to txencoder-txdecoder")

More information about `TxEncoder` and `TxDecoder` can be found [here](https://docs.cosmos.network/main/core/encoding#transaction-encoding).

### Client [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#cli "Direct link to CLI")

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#query "Direct link to Query")

The `x/auth/tx` module provides a CLI command to query any transaction, given its hash, transaction sequence or signature.

Without any argument, the command will query the transaction using the transaction hash.

```codeBlockLines_e6Vv
simd query tx DFE87B78A630C0EFDF76C80CD24C997E252792E0317502AE1A02B9809F0D8685

```

When querying a transaction from an account given its sequence, use the `--type=acc_seq` flag:

```codeBlockLines_e6Vv
simd query tx --type=acc_seq cosmos1u69uyr6v9qwe6zaaeaqly2h6wnedac0xpxq325/1

```

When querying a transaction given its signature, use the `--type=signature` flag:

```codeBlockLines_e6Vv
simd query tx --type=signature Ofjvgrqi8twZfqVDmYIhqwRLQjZZ40XbxEamk/veH3gQpRF0hL2PH4ejRaDzAX+2WChnaWNQJQ41ekToIi5Wqw==

```

When querying a transaction given its events, use the `--type=events` flag:

```codeBlockLines_e6Vv
simd query txs --events 'message.sender=cosmos...' --page 1 --limit 30

```

The `x/auth/block` module provides a CLI command to query any block, given its hash, height, or events.

When querying a block by its hash, use the `--type=hash` flag:

```codeBlockLines_e6Vv
simd query block --type=hash DFE87B78A630C0EFDF76C80CD24C997E252792E0317502AE1A02B9809F0D8685

```

When querying a block by its height, use the `--type=height` flag:

```codeBlockLines_e6Vv
simd query block --type=height 1357

```

When querying a block by its events, use the `--query` flag:

```codeBlockLines_e6Vv
simd query blocks --query 'message.sender=cosmos...' --page 1 --limit 30

```

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#transactions-1 "Direct link to Transactions")

The `x/auth/tx` module provides a convenient CLI command for decoding and encoding transactions.

##### `encode` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#encode "Direct link to encode")

The `encode` command encodes a transaction created with the `--generate-only` flag or signed with the sign command.<br/>
The transaction is seralized it to Protobuf and returned as base64.

```codeBlockLines_e6Vv
$ simd tx encode tx.json
Co8BCowBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKLWNvc21vczFsNnZzcWhoN3Jud3N5cjJreXozampnM3FkdWF6OGd3Z3lsODI3NRItY29zbW9zMTU4c2FsZHlnOHBteHU3Znd2dDBkNng3amVzd3A0Z3d5a2xrNnkzGgwKBXN0YWtlEgMxMDASBhIEEMCaDA==
$ simd tx encode tx.signed.json

```

More information about the `encode` command can be found running `simd tx encode --help`.

##### `decode` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#decode "Direct link to decode")

The `decode` commands decodes a transaction encoded with the `encode` command.

```codeBlockLines_e6Vv
simd tx decode Co8BCowBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKLWNvc21vczFsNnZzcWhoN3Jud3N5cjJreXozampnM3FkdWF6OGd3Z3lsODI3NRItY29zbW9zMTU4c2FsZHlnOHBteHU3Znd2dDBkNng3amVzd3A0Z3d5a2xrNnkzGgwKBXN0YWtlEgMxMDASBhIEEMCaDA==

```

More information about the `decode` command can be found running `simd tx decode --help`.

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#grpc "Direct link to gRPC")

A user can query the `x/auth/tx` module using gRPC endpoints.

##### `TxDecode` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txdecode "Direct link to txdecode")

The `TxDecode` endpoint allows to decode a transaction.

```codeBlockLines_e6Vv
cosmos.tx.v1beta1.Service/TxDecode

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"tx_bytes":"Co8BCowBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKLWNvc21vczFsNnZzcWhoN3Jud3N5cjJreXozampnM3FkdWF6OGd3Z3lsODI3NRItY29zbW9zMTU4c2FsZHlnOHBteHU3Znd2dDBkNng3amVzd3A0Z3d5a2xrNnkzGgwKBXN0YWtlEgMxMDASBhIEEMCaDA=="}' \
    localhost:9090 \
    cosmos.tx.v1beta1.Service/TxDecode

```

Example Output:

```codeBlockLines_e6Vv
{
  "tx": {
    "body": {
      "messages": [\
        {"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"denom":"stake","amount":"100"}],"fromAddress":"cosmos1l6vsqhh7rnwsyr2kyz3jjg3qduaz8gwgyl8275","toAddress":"cosmos158saldyg8pmxu7fwvt0d6x7jeswp4gwyklk6y3"}\
      ]
    },
    "authInfo": {
      "fee": {
        "gasLimit": "200000"
      }
    }
  }
}

```

##### `TxEncode` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txencode "Direct link to txencode")

The `TxEncode` endpoint allows to encode a transaction.

```codeBlockLines_e6Vv
cosmos.tx.v1beta1.Service/TxEncode

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"tx": {
    "body": {
      "messages": [\
        {"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"denom":"stake","amount":"100"}],"fromAddress":"cosmos1l6vsqhh7rnwsyr2kyz3jjg3qduaz8gwgyl8275","toAddress":"cosmos158saldyg8pmxu7fwvt0d6x7jeswp4gwyklk6y3"}\
      ]
    },
    "authInfo": {
      "fee": {
        "gasLimit": "200000"
      }
    }
  }}' \
    localhost:9090 \
    cosmos.tx.v1beta1.Service/TxEncode

```

Example Output:

```codeBlockLines_e6Vv
{
  "txBytes": "Co8BCowBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmwKLWNvc21vczFsNnZzcWhoN3Jud3N5cjJreXozampnM3FkdWF6OGd3Z3lsODI3NRItY29zbW9zMTU4c2FsZHlnOHBteHU3Znd2dDBkNng3amVzd3A0Z3d5a2xrNnkzGgwKBXN0YWtlEgMxMDASBhIEEMCaDA=="
}

```

##### `TxDecodeAmino` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txdecodeamino "Direct link to txdecodeamino")

The `TxDecode` endpoint allows to decode an amino transaction.

```codeBlockLines_e6Vv
cosmos.tx.v1beta1.Service/TxDecodeAmino

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"amino_binary": "KCgWqQpvqKNhmgotY29zbW9zMXRzeno3cDJ6Z2Q3dnZrYWh5ZnJlNHduNXh5dTgwcnB0ZzZ2OWg1Ei1jb3Ntb3MxdHN6ejdwMnpnZDd2dmthaHlmcmU0d241eHl1ODBycHRnNnY5aDUaCwoFc3Rha2USAjEwEhEKCwoFc3Rha2USAjEwEMCaDCIGZm9vYmFy"}' \
    localhost:9090 \
    cosmos.tx.v1beta1.Service/TxDecodeAmino

```

Example Output:

```codeBlockLines_e6Vv
{
  "aminoJson": "{\"type\":\"cosmos-sdk/StdTx\",\"value\":{\"msg\":[{\"type\":\"cosmos-sdk/MsgSend\",\"value\":{\"from_address\":\"cosmos1tszz7p2zgd7vvkahyfre4wn5xyu80rptg6v9h5\",\"to_address\":\"cosmos1tszz7p2zgd7vvkahyfre4wn5xyu80rptg6v9h5\",\"amount\":[{\"denom\":\"stake\",\"amount\":\"10\"}]}}],\"fee\":{\"amount\":[{\"denom\":\"stake\",\"amount\":\"10\"}],\"gas\":\"200000\"},\"signatures\":null,\"memo\":\"foobar\",\"timeout_height\":\"0\"}}"
}

```

##### `TxEncodeAmino` [​](https://docs.cosmos.network/v0.50/build/modules/auth/tx#txencodeamino "Direct link to txencodeamino")

The `TxEncodeAmino` endpoint allows to encode an amino transaction.

```codeBlockLines_e6Vv
cosmos.tx.v1beta1.Service/TxEncodeAmino

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"amino_json":"{\"type\":\"cosmos-sdk/StdTx\",\"value\":{\"msg\":[{\"type\":\"cosmos-sdk/MsgSend\",\"value\":{\"from_address\":\"cosmos1tszz7p2zgd7vvkahyfre4wn5xyu80rptg6v9h5\",\"to_address\":\"cosmos1tszz7p2zgd7vvkahyfre4wn5xyu80rptg6v9h5\",\"amount\":[{\"denom\":\"stake\",\"amount\":\"10\"}]}}],\"fee\":{\"amount\":[{\"denom\":\"stake\",\"amount\":\"10\"}],\"gas\":\"200000\"},\"signatures\":null,\"memo\":\"foobar\",\"timeout_height\":\"0\"}}"}' \
    localhost:9090 \
    cosmos.tx.v1beta1.Service/TxEncodeAmino

```

Example Output:

```codeBlockLines_e6Vv
{
  "amino_binary": "KCgWqQpvqKNhmgotY29zbW9zMXRzeno3cDJ6Z2Q3dnZrYWh5ZnJlNHduNXh5dTgwcnB0ZzZ2OWg1Ei1jb3Ntb3MxdHN6ejdwMnpnZDd2dmthaHlmcmU0d241eHl1ODBycHRnNnY5aDUaCwoFc3Rha2USAjEwEhEKCwoFc3Rha2USAjEwEMCaDCIGZm9vYmFy"
}

```

---

## `x/auth/vesting`

- [Intro and Requirements](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#intro-and-requirements)
- [Note](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#note)
- [Vesting Account Types](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#vesting-account-types)
  - [BaseVestingAccount](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#basevestingaccount)
  - [ContinuousVestingAccount](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#continuousvestingaccount)
  - [DelayedVestingAccount](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#delayedvestingaccount)
  - [Period](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#period)
  - [PeriodicVestingAccount](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#periodicvestingaccount)
  - [PermanentLockedAccount](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#permanentlockedaccount)
- [Vesting Account Specification](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#vesting-account-specification)
  - [Determining Vesting & Vested Amounts](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#determining-vesting--vested-amounts)
  - [Periodic Vesting Accounts](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#periodic-vesting-accounts)
  - [Transferring/Sending](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#transferringsending)
  - [Delegating](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#delegating)
  - [Undelegating](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#undelegating)
- [Keepers & Handlers](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#keepers--handlers)
- [Genesis Initialization](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#genesis-initialization)
- [Examples](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#examples)
  - [Simple](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#simple)
  - [Slashing](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#slashing)
  - [Periodic Vesting](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#periodic-vesting)
- [Glossary](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#glossary)

### Intro and Requirements [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#intro-and-requirements "Direct link to Intro and Requirements")

This specification defines the vesting account implementation that is used by the Cosmos Hub. The requirements for this vesting account is that it should be initialized during genesis with a starting balance `X` and a vesting end time `ET`. A vesting account may be initialized with a vesting start time `ST` and a number of vesting periods `P`. If a vesting start time is included, the vesting period does not begin until start time is reached. If vesting periods are included, the vesting occurs over the specified number of periods.

For all vesting accounts, the owner of the vesting account is able to delegate and undelegate from validators, however they cannot transfer coins to another account until those coins are vested. This specification allows for four different kinds of vesting:

- Delayed vesting, where all coins are vested once `ET` is reached.
- Continuous vesting, where coins begin to vest at `ST` and vest linearly with respect to time until `ET` is reached
- Periodic vesting, where coins begin to vest at `ST` and vest periodically according to number of periods and the vesting amount per period. The number of periods, length per period, and amount per period are configurable. A periodic vesting account is distinguished from a continuous vesting account in that coins can be released in staggered tranches. For example, a periodic vesting account could be used for vesting arrangements where coins are released quarterly, yearly, or over any other function of tokens over time.
- Permanent locked vesting, where coins are locked forever. Coins in this account can still be used for delegating and for governance votes even while locked.

### Note [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#note "Direct link to Note")

Vesting accounts can be initialized with some vesting and non-vesting coins. The non-vesting coins would be immediately transferable. DelayedVesting ContinuousVesting, PeriodicVesting and PermenantVesting accounts can be created with normal messages after genesis. Other types of vesting accounts must be created at genesis, or as part of a manual network upgrade. The current specification only allows for _unconditional_ vesting (ie. there is no possibility of reaching `ET` and<br/>
having coins fail to vest).

### Vesting Account Types [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#vesting-account-types "Direct link to Vesting Account Types")

```codeBlockLines_e6Vv
// VestingAccount defines an interface that any vesting account type must
// implement.
type VestingAccount interface {
  Account

  GetVestedCoins(Time)  Coins
  GetVestingCoins(Time) Coins

  // TrackDelegation performs internal vesting accounting necessary when
  // delegating from a vesting account. It accepts the current block time, the
  // delegation amount and balance of all coins whose denomination exists in
  // the account's original vesting balance.
  TrackDelegation(Time, Coins, Coins)

  // TrackUndelegation performs internal vesting accounting necessary when a
  // vesting account performs an undelegation.
  TrackUndelegation(Coins)

  GetStartTime() int64
  GetEndTime()   int64
}

```

#### BaseVestingAccount [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#basevestingaccount "Direct link to BaseVestingAccount")

proto/cosmos/vesting/v1beta1/vesting.proto

```codeBlockLines_e6Vv
// BaseVestingAccount implements the VestingAccount interface. It contains all
// the necessary fields needed for any vesting account implementation.
message BaseVestingAccount {
  option (amino.name)                 = "cosmos-sdk/BaseVestingAccount";
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  cosmos.auth.v1beta1.BaseAccount base_account       = 1 [(gogoproto.embed) = true];
  repeated cosmos.base.v1beta1.Coin original_vesting = 2 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];
  repeated cosmos.base.v1beta1.Coin delegated_free = 3 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];
  repeated cosmos.base.v1beta1.Coin delegated_vesting = 4 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];
  int64 end_time = 5;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/vesting/v1beta1/vesting.proto#L11-L35)

#### ContinuousVestingAccount [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#continuousvestingaccount "Direct link to ContinuousVestingAccount")

proto/cosmos/vesting/v1beta1/vesting.proto

```codeBlockLines_e6Vv
// ContinuousVestingAccount implements the VestingAccount interface. It
// continuously vests by unlocking coins linearly with respect to time.
message ContinuousVestingAccount {
  option (amino.name)                 = "cosmos-sdk/ContinuousVestingAccount";
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  BaseVestingAccount base_vesting_account = 1 [(gogoproto.embed) = true];
  int64              start_time           = 2;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/vesting/v1beta1/vesting.proto#L37-L46)

#### DelayedVestingAccount [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#delayedvestingaccount "Direct link to DelayedVestingAccount")

proto/cosmos/vesting/v1beta1/vesting.proto

```codeBlockLines_e6Vv
// DelayedVestingAccount implements the VestingAccount interface. It vests all
// coins after a specific time, but non prior. In other words, it keeps them
// locked until a specified time.
message DelayedVestingAccount {
  option (amino.name)                 = "cosmos-sdk/DelayedVestingAccount";
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  BaseVestingAccount base_vesting_account = 1 [(gogoproto.embed) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/vesting/v1beta1/vesting.proto#L48-L57)

#### Period [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#period "Direct link to Period")

proto/cosmos/vesting/v1beta1/vesting.proto

```codeBlockLines_e6Vv
// Period defines a length of time and amount of coins that will vest.
message Period {
  option (gogoproto.goproto_stringer) = false;

  int64    length                          = 1;
  repeated cosmos.base.v1beta1.Coin amount = 2 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/vesting/v1beta1/vesting.proto#L59-L69)

```codeBlockLines_e6Vv
// Stores all vesting periods passed as part of a PeriodicVestingAccount
type Periods []Period

```

#### PeriodicVestingAccount [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#periodicvestingaccount "Direct link to PeriodicVestingAccount")

proto/cosmos/vesting/v1beta1/vesting.proto

```codeBlockLines_e6Vv
// PeriodicVestingAccount implements the VestingAccount interface. It
// periodically vests by unlocking coins during each specified period.
message PeriodicVestingAccount {
  option (amino.name)                 = "cosmos-sdk/PeriodicVestingAccount";
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  BaseVestingAccount base_vesting_account = 1 [(gogoproto.embed) = true];
  int64              start_time           = 2;
  repeated Period    vesting_periods      = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/vesting/v1beta1/vesting.proto#L71-L81)

In order to facilitate less ad-hoc type checking and assertions and to support flexibility in account balance usage, the existing `x/bank` `ViewKeeper` interface is updated to contain the following:

```codeBlockLines_e6Vv
type ViewKeeper interface {
  // ...

  // Calculates the total locked account balance.
  LockedCoins(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins

  // Calculates the total spendable balance that can be sent to other accounts.
  SpendableCoins(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins
}

```

#### PermanentLockedAccount [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#permanentlockedaccount "Direct link to PermanentLockedAccount")

proto/cosmos/vesting/v1beta1/vesting.proto

```codeBlockLines_e6Vv
// PermanentLockedAccount implements the VestingAccount interface. It does
// not ever release coins, locking them indefinitely. Coins in this account can
// still be used for delegating and for governance votes even while locked.
//
// Since: cosmos-sdk 0.43
message PermanentLockedAccount {
  option (amino.name)                 = "cosmos-sdk/PermanentLockedAccount";
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  BaseVestingAccount base_vesting_account = 1 [(gogoproto.embed) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/vesting/v1beta1/vesting.proto#L83-L94)

### Vesting Account Specification [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#vesting-account-specification "Direct link to Vesting Account Specification")

Given a vesting account, we define the following in the proceeding operations:

- `OV`: The original vesting coin amount. It is a constant value.
- `V`: The number of `OV` coins that are still _vesting_. It is derived by<br/>
  `OV`, `StartTime` and `EndTime`. This value is computed on demand and not on a per-block basis.
- `V'`: The number of `OV` coins that are _vested_ (unlocked). This value is computed on demand and not a per-block basis.
- `DV`: The number of delegated _vesting_ coins. It is a variable value. It is stored and modified directly in the vesting account.
- `DF`: The number of delegated _vested_ (unlocked) coins. It is a variable value. It is stored and modified directly in the vesting account.
- `BC`: The number of `OV` coins less any coins that are transferred<br/>
  (which can be negative or delegated). It is considered to be balance of the embedded base account. It is stored and modified directly in the vesting account.

#### Determining Vesting & Vested Amounts [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#determining-vesting--vested-amounts "Direct link to Determining Vesting & Vested Amounts")

It is important to note that these values are computed on demand and not on a mandatory per-block basis (e.g. `BeginBlocker` or `EndBlocker`).

##### Continuously Vesting Accounts [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#continuously-vesting-accounts "Direct link to Continuously Vesting Accounts")

To determine the amount of coins that are vested for a given block time `T`, the<br/>
following is performed:

1. Compute `X:= T - StartTime`
2. Compute `Y:= EndTime - StartTime`
3. Compute `V':= OV * (X / Y)`
4. Compute `V:= OV - V'`

Thus, the total amount of _vested_ coins is `V'` and the remaining amount, `V`,<br/>
is _vesting_.

```codeBlockLines_e6Vv
func (cva ContinuousVestingAccount) GetVestedCoins(t Time) Coins {
    if t <= cva.StartTime {
        // We must handle the case where the start time for a vesting account has
        // been set into the future or when the start of the chain is not exactly
        // known.
        return ZeroCoins
    } else if t >= cva.EndTime {
        return cva.OriginalVesting
    }

    x := t - cva.StartTime
    y := cva.EndTime - cva.StartTime

    return cva.OriginalVesting * (x / y)
}

func (cva ContinuousVestingAccount) GetVestingCoins(t Time) Coins {
    return cva.OriginalVesting - cva.GetVestedCoins(t)
}

```

#### Periodic Vesting Accounts [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#periodic-vesting-accounts "Direct link to Periodic Vesting Accounts")

Periodic vesting accounts require calculating the coins released during each period for a given block time `T`. Note that multiple periods could have passed when calling `GetVestedCoins`, so we must iterate over each period until the end of that period is after `T`.

1. Set `CT:= StartTime`
2. Set `V':= 0`

For each Period P:

1. Compute `X:= T - CT`
2. IF `X >= P.Length`
3. Compute `V' += P.Amount`
4. Compute `CT += P.Length`
5. ELSE break
6. Compute `V:= OV - V'`

```codeBlockLines_e6Vv
func (pva PeriodicVestingAccount) GetVestedCoins(t Time) Coins {
  if t < pva.StartTime {
    return ZeroCoins
  }
  ct := pva.StartTime // The start of the vesting schedule
  vested := 0
  periods = pva.GetPeriods()
  for _, period  := range periods {
    if t - ct < period.Length {
      break
    }
    vested += period.Amount
    ct += period.Length // increment ct to the start of the next vesting period
  }
  return vested
}

func (pva PeriodicVestingAccount) GetVestingCoins(t Time) Coins {
    return pva.OriginalVesting - cva.GetVestedCoins(t)
}

```

##### Delayed/Discrete Vesting Accounts [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#delayeddiscrete-vesting-accounts "Direct link to Delayed/Discrete Vesting Accounts")

Delayed vesting accounts are easier to reason about as they only have the full amount vesting up until a certain time, then all the coins become vested (unlocked). This does not include any unlocked coins the account may have initially.

```codeBlockLines_e6Vv
func (dva DelayedVestingAccount) GetVestedCoins(t Time) Coins {
    if t >= dva.EndTime {
        return dva.OriginalVesting
    }

    return ZeroCoins
}

func (dva DelayedVestingAccount) GetVestingCoins(t Time) Coins {
    return dva.OriginalVesting - dva.GetVestedCoins(t)
}

```

#### Transferring/Sending [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#transferringsending "Direct link to Transferring/Sending")

At any given time, a vesting account may transfer: `min((BC + DV) - V, BC)`.

In other words, a vesting account may transfer the minimum of the base account balance and the base account balance plus the number of currently delegated vesting coins less the number of coins vested so far.

However, given that account balances are tracked via the `x/bank` module and that we want to avoid loading the entire account balance, we can instead determine the locked balance, which can be defined as `max(V - DV, 0)`, and infer the spendable balance from that.

```codeBlockLines_e6Vv
func (va VestingAccount) LockedCoins(t Time) Coins {
   return max(va.GetVestingCoins(t) - va.DelegatedVesting, 0)
}

```

The `x/bank` `ViewKeeper` can then provide APIs to determine locked and spendable coins for any account:

```codeBlockLines_e6Vv
func (k Keeper) LockedCoins(ctx Context, addr AccAddress) Coins {
    acc := k.GetAccount(ctx, addr)
    if acc != nil {
        if acc.IsVesting() {
            return acc.LockedCoins(ctx.BlockTime())
        }
    }

    // non-vesting accounts do not have any locked coins
    return NewCoins()
}

```

##### Keepers/Handlers [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#keepershandlers "Direct link to Keepers/Handlers")

The corresponding `x/bank` keeper should appropriately handle sending coins based on if the account is a vesting account or not.

```codeBlockLines_e6Vv
func (k Keeper) SendCoins(ctx Context, from Account, to Account, amount Coins) {
    bc := k.GetBalances(ctx, from)
    v := k.LockedCoins(ctx, from)

    spendable := bc - v
    newCoins := spendable - amount
    assert(newCoins >= 0)

    from.SetBalance(newCoins)
    to.AddBalance(amount)

    // save balances...
}

```

#### Delegating [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#delegating "Direct link to Delegating")

For a vesting account attempting to delegate `D` coins, the following is performed:

1. Verify `BC >= D > 0`
2. Compute `X:= min(max(V - DV, 0), D)` (portion of `D` that is vesting)
3. Compute `Y:= D - X` (portion of `D` that is free)
4. Set `DV += X`
5. Set `DF += Y`

```codeBlockLines_e6Vv
func (va VestingAccount) TrackDelegation(t Time, balance Coins, amount Coins) {
    assert(balance <= amount)
    x := min(max(va.GetVestingCoins(t) - va.DelegatedVesting, 0), amount)
    y := amount - x

    va.DelegatedVesting += x
    va.DelegatedFree += y
}

```

**Note** `TrackDelegation` only modifies the `DelegatedVesting` and `DelegatedFree` fields, so upstream callers MUST modify the `Coins` field by subtracting `amount`.

##### Keepers/Handlers [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#keepershandlers-1 "Direct link to Keepers/Handlers")

```codeBlockLines_e6Vv
func DelegateCoins(t Time, from Account, amount Coins) {
    if isVesting(from) {
        from.TrackDelegation(t, amount)
    } else {
        from.SetBalance(sc - amount)
    }

    // save account...
}

```

#### Undelegating [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#undelegating "Direct link to Undelegating")

For a vesting account attempting to undelegate `D` coins, the following is performed:

> NOTE: `DV < D` and `(DV + DF) < D` may be possible due to quirks in the rounding of delegation/undelegation logic.

1. Verify `D > 0`
2. Compute `X:= min(DF, D)` (portion of `D` that should become free, prioritizing free coins)
3. Compute `Y:= min(DV, D - X)` (portion of `D` that should remain vesting)
4. Set `DF -= X`
5. Set `DV -= Y`

```codeBlockLines_e6Vv
func (cva ContinuousVestingAccount) TrackUndelegation(amount Coins) {
    x := min(cva.DelegatedFree, amount)
    y := amount - x

    cva.DelegatedFree -= x
    cva.DelegatedVesting -= y
}

```

**Note** `TrackUnDelegation` only modifies the `DelegatedVesting` and `DelegatedFree` fields, so upstream callers MUST modify the `Coins` field by adding `amount`.

**Note**: If a delegation is slashed, the continuous vesting account ends up with an excess `DV` amount, even after all its coins have vested. This is because undelegating free coins are prioritized.

**Note**: The undelegation (bond refund) amount may exceed the delegated vesting (bond) amount due to the way undelegation truncates the bond refund, which can increase the validator's exchange rate (tokens/shares) slightly if the undelegated tokens are non-integral.

##### Keepers/Handlers [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#keepershandlers-2 "Direct link to Keepers/Handlers")

```codeBlockLines_e6Vv
func UndelegateCoins(to Account, amount Coins) {
    if isVesting(to) {
        if to.DelegatedFree + to.DelegatedVesting >= amount {
            to.TrackUndelegation(amount)
            // save account ...
        }
    } else {
        AddBalance(to, amount)
        // save account...
    }
}

```

### Keepers & Handlers [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#keepers--handlers "Direct link to Keepers & Handlers")

The `VestingAccount` implementations reside in `x/auth`. However, any keeper in a module (e.g. staking in `x/staking`) wishing to potentially utilize any vesting coins, must call explicit methods on the `x/bank` keeper (e.g. `DelegateCoins`) opposed to `SendCoins` and `SubtractCoins`.

In addition, the vesting account should also be able to spend any coins it receives from other users. Thus, the bank module's `MsgSend` handler should error if a vesting account is trying to send an amount that exceeds their unlocked coin amount.

See the above specification for full implementation details.

### Genesis Initialization [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#genesis-initialization "Direct link to Genesis Initialization")

To initialize both vesting and non-vesting accounts, the `GenesisAccount` struct includes new fields: `Vesting`, `StartTime`, and `EndTime`. Accounts meant to be of type `BaseAccount` or any non-vesting type have `Vesting = false`. The genesis initialization logic (e.g. `initFromGenesisState`) must parse and return the correct accounts accordingly based off of these fields.

```codeBlockLines_e6Vv
type GenesisAccount struct {
    // ...

    // vesting account fields
    OriginalVesting  sdk.Coins `json:"original_vesting"`
    DelegatedFree    sdk.Coins `json:"delegated_free"`
    DelegatedVesting sdk.Coins `json:"delegated_vesting"`
    StartTime        int64     `json:"start_time"`
    EndTime          int64     `json:"end_time"`
}

func ToAccount(gacc GenesisAccount) Account {
    bacc := NewBaseAccount(gacc)

    if gacc.OriginalVesting > 0 {
        if ga.StartTime != 0 && ga.EndTime != 0 {
            // return a continuous vesting account
        } else if ga.EndTime != 0 {
            // return a delayed vesting account
        } else {
            // invalid genesis vesting account provided
            panic()
        }
    }

    return bacc
}

```

### Examples [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#examples "Direct link to Examples")

#### Simple [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#simple "Direct link to Simple")

Given a continuous vesting account with 10 vesting coins.

```codeBlockLines_e6Vv
OV = 10
DF = 0
DV = 0
BC = 10
V = 10
V' = 0

```

1. Immediately receives 1 coin

```codeBlockLines_e6Vv
BC = 11

```

2. Time passes, 2 coins vest

```codeBlockLines_e6Vv
V = 8
V' = 2

```

3. Delegates 4 coins to validator A

```codeBlockLines_e6Vv
DV = 4
BC = 7

```

4. Sends 3 coins

```codeBlockLines_e6Vv
BC = 4

```

5. More time passes, 2 more coins vest

```codeBlockLines_e6Vv
V = 6
V' = 4

```

6. Sends 2 coins. At this point the account cannot send anymore until further<br/>
   coins vest or it receives additional coins. It can still however, delegate.

````codeBlockLines_e6Vv
```text
BC = 2
```

````

#### Slashing [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#slashing "Direct link to Slashing")

Same initial starting conditions as the simple example.

1. Time passes, 5 coins vest

```codeBlockLines_e6Vv
V = 5
V' = 5

```

2. Delegate 5 coins to validator A

```codeBlockLines_e6Vv
DV = 5
BC = 5

```

3. Delegate 5 coins to validator B

```codeBlockLines_e6Vv
DF = 5
BC = 0

```

4. Validator A gets slashed by 50%, making the delegation to A now worth 2.5 coins
5. Undelegate from validator A (2.5 coins)

```codeBlockLines_e6Vv
DF = 5 - 2.5 = 2.5
BC = 0 + 2.5 = 2.5

```

6. Undelegate from validator B (5 coins). The account at this point can only<br/>
   send 2.5 coins unless it receives more coins or until more coins vest.<br/>
   It can still however, delegate.

````codeBlockLines_e6Vv
```text
DV = 5 - 2.5 = 2.5
DF = 2.5 - 2.5 = 0
BC = 2.5 + 5 = 7.5
```

Notice how we have an excess amount of `DV`.

````

#### Periodic Vesting [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#periodic-vesting "Direct link to Periodic Vesting")

A vesting account is created where 100 tokens will be released over 1 year, with<br/>
1/4 of tokens vesting each quarter. The vesting schedule would be as follows:

```codeBlockLines_e6Vv
Periods:
- amount: 25stake, length: 7884000
- amount: 25stake, length: 7884000
- amount: 25stake, length: 7884000
- amount: 25stake, length: 7884000

```

```codeBlockLines_e6Vv
OV = 100
DF = 0
DV = 0
BC = 100
V = 100
V' = 0

```

1. Immediately receives 1 coin

```codeBlockLines_e6Vv
BC = 101

```

2. Vesting period 1 passes, 25 coins vest

```codeBlockLines_e6Vv
V = 75
V' = 25

```

3. During vesting period 2, 5 coins are transferred and 5 coins are delegated

```codeBlockLines_e6Vv
DV = 5
BC = 91

```

4. Vesting period 2 passes, 25 coins vest

```codeBlockLines_e6Vv
V = 50
V' = 50

```

### Glossary [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#glossary "Direct link to Glossary")

- OriginalVesting: The amount of coins (per denomination) that are initially<br/>
  part of a vesting account. These coins are set at genesis.
- StartTime: The BFT time at which a vesting account starts to vest.
- EndTime: The BFT time at which a vesting account is fully vested.
- DelegatedFree: The tracked amount of coins (per denomination) that are<br/>
  delegated from a vesting account that have been fully vested at time of delegation.
- DelegatedVesting: The tracked amount of coins (per denomination) that are<br/>
  delegated from a vesting account that were vesting at time of delegation.
- ContinuousVestingAccount: A vesting account implementation that vests coins<br/>
  linearly over time.
- DelayedVestingAccount: A vesting account implementation that only fully vests<br/>
  all coins at a given time.
- PeriodicVestingAccount: A vesting account implementation that vests coins<br/>
  according to a custom vesting schedule.
- PermanentLockedAccount: It does not ever release coins, locking them indefinitely.<br/>
  Coins in this account can still be used for delegating and for governance votes even while locked.

### CLI [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#cli "Direct link to CLI")

A user can query and interact with the `vesting` module using the CLI.

#### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `vesting` module.

```codeBlockLines_e6Vv
simd tx vesting --help

```

##### Create-periodic-vesting-account [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#create-periodic-vesting-account "Direct link to create-periodic-vesting-account")

The `create-periodic-vesting-account` command creates a new vesting account funded with an allocation of tokens, where a sequence of coins and period length in seconds. Periods are sequential, in that the duration of of a period only starts at the end of the previous period. The duration of the first period starts upon account creation.

```codeBlockLines_e6Vv
simd tx vesting create-periodic-vesting-account [to_address] [periods_json_file] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx vesting create-periodic-vesting-account cosmos1.. periods.json

```

##### Create-vesting-account [​](https://docs.cosmos.network/v0.50/build/modules/auth/vesting#create-vesting-account "Direct link to create-vesting-account")

The `create-vesting-account` command creates a new vesting account funded with an allocation of tokens. The account can either be a delayed or continuous vesting account, which is determined by the '--delayed' flag. All vesting accouts created will have their start time set by the committed block's time. The end_time must be provided as a UNIX epoch timestamp.

```codeBlockLines_e6Vv
simd tx vesting create-vesting-account [to_address] [amount] [end_time] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx vesting create-vesting-account cosmos1.. 100stake 2592000

```

---

## `x/auth`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/auth#abstract "Direct link to Abstract")

This document specifies the auth module of the Cosmos SDK.

The auth module is responsible for specifying the base transaction and account types<br/>
for an application, since the SDK itself is agnostic to these particulars. It contains<br/>
the middlewares, where all basic transaction validity checks (signatures, nonces, auxiliary fields)<br/>
are performed, and exposes the account keeper, which allows other modules to read, write, and modify accounts.

This module is used in the Cosmos Hub.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/auth#contents "Direct link to Contents")

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/auth#concepts)
  - [Gas & Fees](https://docs.cosmos.network/v0.50/build/modules/auth#gas--fees)
- [State](https://docs.cosmos.network/v0.50/build/modules/auth#state)
  - [Accounts](https://docs.cosmos.network/v0.50/build/modules/auth#accounts)
- [AnteHandlers](https://docs.cosmos.network/v0.50/build/modules/auth#antehandlers)
- [Keepers](https://docs.cosmos.network/v0.50/build/modules/auth#keepers)
  - [Account Keeper](https://docs.cosmos.network/v0.50/build/modules/auth#account-keeper)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/auth#parameters)
- [Client](https://docs.cosmos.network/v0.50/build/modules/auth#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/auth#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/auth#grpc)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/auth#rest)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/auth#concepts "Direct link to Concepts")

**Note:** The auth module is different from the [authz module](https://docs.cosmos.network/v0.50/build/modules/authz).

The differences are:

- `auth` \- authentication of accounts and transactions for Cosmos SDK applications and is responsible for specifying the base transaction and account types.
- `authz` \- authorization for accounts to perform actions on behalf of other accounts and enables a granter to grant authorizations to a grantee that allows the grantee to execute messages on behalf of the granter.

#### Gas & Fees [​](https://docs.cosmos.network/v0.50/build/modules/auth#gas--fees "Direct link to Gas & Fees")

Fees serve two purposes for an operator of the network.

Fees limit the growth of the state stored by every full node and allow for<br/>
general purpose censorship of transactions of little economic value. Fees<br/>
are best suited as an anti-spam mechanism where validators are disinterested in<br/>
the use of the network and identities of users.

Fees are determined by the gas limits and gas prices transactions provide, where<br/>
`fees = ceil(gasLimit * gasPrices)`. Txs incur gas costs for all state reads/writes,<br/>
signature verification, as well as costs proportional to the tx size. Operators<br/>
should set minimum gas prices when starting their nodes. They must set the unit<br/>
costs of gas in each token denomination they wish to support:

`simd start … --minimum-gas-prices=0.00001stake;0.05photinos`

When adding transactions to mempool or gossipping transactions, validators check<br/>
if the transaction's gas prices, which are determined by the provided fees, meet<br/>
any of the validator's minimum gas prices. In other words, a transaction must<br/>
provide a fee of at least one denomination that matches a validator's minimum<br/>
gas price.

CometBFT does not currently provide fee based mempool prioritization, and fee<br/>
based mempool filtering is local to node and not part of consensus. But with<br/>
minimum gas prices set, such a mechanism could be implemented by node operators.

Because the market value for tokens will fluctuate, validators are expected to<br/>
dynamically adjust their minimum gas prices to a level that would encourage the<br/>
use of the network.

### State [​](https://docs.cosmos.network/v0.50/build/modules/auth#state "Direct link to State")

#### Accounts [​](https://docs.cosmos.network/v0.50/build/modules/auth#accounts "Direct link to Accounts")

Accounts contain authentication information for a uniquely identified external user of an SDK blockchain,<br/>
including public key, address, and account number / sequence number for replay protection. For efficiency,<br/>
since account balances must also be fetched to pay fees, account structs also store the balance of a user<br/>
as `sdk.Coins`.

Accounts are exposed externally as an interface, and stored internally as<br/>
either a base account or vesting account. Module clients wishing to add more<br/>
account types may do so.

- `0x01 | Address -> ProtocolBuffer(account)`

##### Account Interface [​](https://docs.cosmos.network/v0.50/build/modules/auth#account-interface "Direct link to Account Interface")

The account interface exposes methods to read and write standard account information.<br/>
Note that all of these methods operate on an account struct conforming to the<br/>
interface - in order to write the account to the store, the account keeper will<br/>
need to be used.

```codeBlockLines_e6Vv
// AccountI is an interface used to store coins at a given address within state.
// It presumes a notion of sequence numbers for replay protection,
// a notion of account numbers for replay protection for previously pruned accounts,
// and a pubkey for authentication purposes.
//
// Many complex conditions can be used in the concrete struct which implements AccountI.
type AccountI interface {
    proto.Message

    GetAddress() sdk.AccAddress
    SetAddress(sdk.AccAddress) error // errors if already set.

    GetPubKey() crypto.PubKey // can return nil.
    SetPubKey(crypto.PubKey) error

    GetAccountNumber() uint64
    SetAccountNumber(uint64) error

    GetSequence() uint64
    SetSequence(uint64) error

    // Ensure that account implements stringer
    String() string
}

```

###### Base Account [​](https://docs.cosmos.network/v0.50/build/modules/auth#base-account "Direct link to Base Account")

A base account is the simplest and most common account type, which just stores all requisite<br/>
fields directly in a struct.

```codeBlockLines_e6Vv
// BaseAccount defines a base account type. It contains all the necessary fields
// for basic account functionality. Any custom account type should extend this
// type for additional functionality (e.g. vesting).
message BaseAccount {
  string address = 1;
  google.protobuf.Any pub_key = 2;
  uint64 account_number = 3;
  uint64 sequence       = 4;
}

```

#### Vesting Account [​](https://docs.cosmos.network/v0.50/build/modules/auth#vesting-account "Direct link to Vesting Account")

See [Vesting](https://docs.cosmos.network/main/modules/auth/vesting/).

### AnteHandlers [​](https://docs.cosmos.network/v0.50/build/modules/auth#antehandlers "Direct link to AnteHandlers")

The `x/auth` module presently has no transaction handlers of its own, but does expose the special `AnteHandler`, used for performing basic validity checks on a transaction, such that it could be thrown out of the mempool.<br/>
The `AnteHandler` can be seen as a set of decorators that check transactions within the current context, per [ADR 010](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-010-modular-antehandler.md).

Note that the `AnteHandler` is called on both `CheckTx` and `DeliverTx`, as CometBFT proposers presently have the ability to include in their proposed block transactions which fail `CheckTx`.

#### Decorators [​](https://docs.cosmos.network/v0.50/build/modules/auth#decorators "Direct link to Decorators")

The auth module provides `AnteDecorator` s that are recursively chained together into a single `AnteHandler` in the following order:

- `SetUpContextDecorator`: Sets the `GasMeter` in the `Context` and wraps the next `AnteHandler` with a defer clause to recover from any downstream `OutOfGas` panics in the `AnteHandler` chain to return an error with information on gas provided and gas used.
- `RejectExtensionOptionsDecorator`: Rejects all extension options which can optionally be included in protobuf transactions.
- `MempoolFeeDecorator`: Checks if the `tx` fee is above local mempool `minFee` parameter during `CheckTx`.
- `ValidateBasicDecorator`: Calls `tx.ValidateBasic` and returns any non-nil error.
- `TxTimeoutHeightDecorator`: Check for a `tx` height timeout.
- `ValidateMemoDecorator`: Validates `tx` memo with application parameters and returns any non-nil error.
- `ConsumeGasTxSizeDecorator`: Consumes gas proportional to the `tx` size based on application parameters.
- `DeductFeeDecorator`: Deducts the `FeeAmount` from first signer of the `tx`. If the `x/feegrant` module is enabled and a fee granter is set, it deducts fees from the fee granter account.
- `SetPubKeyDecorator`: Sets the pubkey from a `tx`'s signers that does not already have its corresponding pubkey saved in the state machine and in the current context.
- `ValidateSigCountDecorator`: Validates the number of signatures in `tx` based on app-parameters.
- `SigGasConsumeDecorator`: Consumes parameter-defined amount of gas for each signature. This requires pubkeys to be set in context for all signers as part of `SetPubKeyDecorator`.
- `SigVerificationDecorator`: Verifies all signatures are valid. This requires pubkeys to be set in context for all signers as part of `SetPubKeyDecorator`.
- `IncrementSequenceDecorator`: Increments the account sequence for each signer to prevent replay attacks.

### Keepers [​](https://docs.cosmos.network/v0.50/build/modules/auth#keepers "Direct link to Keepers")

The auth module only exposes one keeper, the account keeper, which can be used to read and write accounts.

#### Account Keeper [​](https://docs.cosmos.network/v0.50/build/modules/auth#account-keeper "Direct link to Account Keeper")

Presently only one fully-permissioned account keeper is exposed, which has the ability to both read and write<br/>
all fields of all accounts, and to iterate over all stored accounts.

```codeBlockLines_e6Vv
// AccountKeeperI is the interface contract that x/auth's keeper implements.
type AccountKeeperI interface {
    // Return a new account with the next account number and the specified address. Does not save the new account to the store.
    NewAccountWithAddress(sdk.Context, sdk.AccAddress) types.AccountI

    // Return a new account with the next account number. Does not save the new account to the store.
    NewAccount(sdk.Context, types.AccountI) types.AccountI

    // Check if an account exists in the store.
    HasAccount(sdk.Context, sdk.AccAddress) bool

    // Retrieve an account from the store.
    GetAccount(sdk.Context, sdk.AccAddress) types.AccountI

    // Set an account in the store.
    SetAccount(sdk.Context, types.AccountI)

    // Remove an account from the store.
    RemoveAccount(sdk.Context, types.AccountI)

    // Iterate over all accounts, calling the provided function. Stop iteration when it returns true.
    IterateAccounts(sdk.Context, func(types.AccountI) bool)

    // Fetch the public key of an account at a specified address
    GetPubKey(sdk.Context, sdk.AccAddress) (crypto.PubKey, error)

    // Fetch the sequence of an account at a specified address.
    GetSequence(sdk.Context, sdk.AccAddress) (uint64, error)

    // Fetch the next account number, and increment the internal counter.
    NextAccountNumber(sdk.Context) uint64
}

```

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/auth#parameters "Direct link to Parameters")

The auth module contains the following parameters:

| Key                    | Type   | Example |
| ---------------------- | ------ | ------- |
| MaxMemoCharacters      | uint64 | 256     |
| TxSigLimit             | uint64 | 7       |
| TxSizeCostPerByte      | uint64 | 10      |
| SigVerifyCostED25519   | uint64 | 590     |
| SigVerifyCostSecp256k1 | uint64 | 1000    |

### Client [​](https://docs.cosmos.network/v0.50/build/modules/auth#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/auth#cli "Direct link to CLI")

A user can query and interact with the `auth` module using the CLI.

#### Query [​](https://docs.cosmos.network/v0.50/build/modules/auth#query "Direct link to Query")

The `query` commands allow users to query `auth` state.

```codeBlockLines_e6Vv
simd query auth --help

```

##### Account [​](https://docs.cosmos.network/v0.50/build/modules/auth#account "Direct link to account")

The `account` command allow users to query for an account by it's address.

```codeBlockLines_e6Vv
simd query auth account [address] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query auth account cosmos1...

```

Example Output:

```codeBlockLines_e6Vv
'@type': /cosmos.auth.v1beta1.BaseAccount
account_number: "0"
address: cosmos1zwg6tpl8aw4rawv8sgag9086lpw5hv33u5ctr2
pub_key:
  '@type': /cosmos.crypto.secp256k1.PubKey
  key: ApDrE38zZdd7wLmFS9YmqO684y5DG6fjZ4rVeihF/AQD
sequence: "1"

```

##### Accounts [​](https://docs.cosmos.network/v0.50/build/modules/auth#accounts-1 "Direct link to accounts")

The `accounts` command allow users to query all the available accounts.

```codeBlockLines_e6Vv
simd query auth accounts [flags]

```

Example:

```codeBlockLines_e6Vv
simd query auth accounts

```

Example Output:

```codeBlockLines_e6Vv
accounts:
- '@type': /cosmos.auth.v1beta1.BaseAccount
  account_number: "0"
  address: cosmos1zwg6tpl8aw4rawv8sgag9086lpw5hv33u5ctr2
  pub_key:
    '@type': /cosmos.crypto.secp256k1.PubKey
    key: ApDrE38zZdd7wLmFS9YmqO684y5DG6fjZ4rVeihF/AQD
  sequence: "1"
- '@type': /cosmos.auth.v1beta1.ModuleAccount
  base_account:
    account_number: "8"
    address: cosmos1yl6hdjhmkf37639730gffanpzndzdpmhwlkfhr
    pub_key: null
    sequence: "0"
  name: transfer
  permissions:
  - minter
  - burner
- '@type': /cosmos.auth.v1beta1.ModuleAccount
  base_account:
    account_number: "4"
    address: cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh
    pub_key: null
    sequence: "0"
  name: bonded_tokens_pool
  permissions:
  - burner
  - staking
- '@type': /cosmos.auth.v1beta1.ModuleAccount
  base_account:
    account_number: "5"
    address: cosmos1tygms3xhhs3yv487phx3dw4a95jn7t7lpm470r
    pub_key: null
    sequence: "0"
  name: not_bonded_tokens_pool
  permissions:
  - burner
  - staking
- '@type': /cosmos.auth.v1beta1.ModuleAccount
  base_account:
    account_number: "6"
    address: cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn
    pub_key: null
    sequence: "0"
  name: gov
  permissions:
  - burner
- '@type': /cosmos.auth.v1beta1.ModuleAccount
  base_account:
    account_number: "3"
    address: cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl
    pub_key: null
    sequence: "0"
  name: distribution
  permissions: []
- '@type': /cosmos.auth.v1beta1.BaseAccount
  account_number: "1"
  address: cosmos147k3r7v2tvwqhcmaxcfql7j8rmkrlsemxshd3j
  pub_key: null
  sequence: "0"
- '@type': /cosmos.auth.v1beta1.ModuleAccount
  base_account:
    account_number: "7"
    address: cosmos1m3h30wlvsf8llruxtpukdvsy0km2kum8g38c8q
    pub_key: null
    sequence: "0"
  name: mint
  permissions:
  - minter
- '@type': /cosmos.auth.v1beta1.ModuleAccount
  base_account:
    account_number: "2"
    address: cosmos17xpfvakm2amg962yls6f84z3kell8c5lserqta
    pub_key: null
    sequence: "0"
  name: fee_collector
  permissions: []
pagination:
  next_key: null
  total: "0"

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/auth#params "Direct link to params")

The `params` command allow users to query the current auth parameters.

```codeBlockLines_e6Vv
simd query auth params [flags]

```

Example:

```codeBlockLines_e6Vv
simd query auth params

```

Example Output:

```codeBlockLines_e6Vv
max_memo_characters: "256"
sig_verify_cost_ed25519: "590"
sig_verify_cost_secp256k1: "1000"
tx_sig_limit: "7"
tx_size_cost_per_byte: "10"

```

#### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/auth#transactions "Direct link to Transactions")

The `auth` module supports transactions commands to help you with signing and more. Compared to other modules you can access directly the `auth` module transactions commands using the only `tx` command.

Use directly the `--help` flag to get more information about the `tx` command.

```codeBlockLines_e6Vv
simd tx --help

```

##### `sign` [​](https://docs.cosmos.network/v0.50/build/modules/auth#sign "Direct link to sign")

The `sign` command allows users to sign transactions that was generated offline.

```codeBlockLines_e6Vv
simd tx sign tx.json --from $ALICE > tx.signed.json

```

The result is a signed transaction that can be broadcasted to the network thanks to the broadcast command.

More information about the `sign` command can be found running `simd tx sign --help`.

##### `sign-batch` [​](https://docs.cosmos.network/v0.50/build/modules/auth#sign-batch "Direct link to sign-batch")

The `sign-batch` command allows users to sign multiples offline generated transactions.<br/>
The transactions can be in one file, with one tx per line, or in multiple files.

```codeBlockLines_e6Vv
simd tx sign txs.json --from $ALICE > tx.signed.json

```

or

```codeBlockLines_e6Vv
simd tx sign tx1.json tx2.json tx3.json --from $ALICE > tx.signed.json

```

The result is multiples signed transactions. For combining the signed transactions into one transactions, use the `--append` flag.

More information about the `sign-batch` command can be found running `simd tx sign-batch --help`.

##### `multi-sign` [​](https://docs.cosmos.network/v0.50/build/modules/auth#multi-sign "Direct link to multi-sign")

The `multi-sign` command allows users to sign transactions that was generated offline by a multisig account.

```codeBlockLines_e6Vv
simd tx multisign transaction.json k1k2k3 k1sig.json k2sig.json k3sig.json

```

Where `k1k2k3` is the multisig account address, `k1sig.json` is the signature of the first signer, `k2sig.json` is the signature of the second signer, and `k3sig.json` is the signature of the third signer.

###### Nested Multisig Transactions [​](https://docs.cosmos.network/v0.50/build/modules/auth#nested-multisig-transactions "Direct link to Nested multisig transactions")

To allow transactions to be signed by nested multisigs, meaning that a participant of a multisig account can be another multisig account, the `--skip-signature-verification` flag must be used.

```codeBlockLines_e6Vv
# First aggregate signatures of the multisig participant
simd tx multi-sign transaction.json ms1 ms1p1sig.json ms1p2sig.json --signature-only --skip-signature-verification > ms1sig.json

# Then use the aggregated signatures and the other signatures to sign the final transaction
simd tx multi-sign transaction.json k1ms1 k1sig.json ms1sig.json --skip-signature-verification

```

Where `ms1` is the nested multisig account address, `ms1p1sig.json` is the signature of the first participant of the nested multisig account, `ms1p2sig.json` is the signature of the second participant of the nested multisig account, and `ms1sig.json` is the aggregated signature of the nested multisig account.

`k1ms1` is a multisig account comprised of an individual signer and another nested multisig account (`ms1`). `k1sig.json` is the signature of the first signer of the individual member.

More information about the `multi-sign` command can be found running `simd tx multi-sign --help`.

##### `multisign-batch` [​](https://docs.cosmos.network/v0.50/build/modules/auth#multisign-batch "Direct link to multisign-batch")

The `multisign-batch` works the same way as `sign-batch`, but for multisig accounts.<br/>
With the difference that the `multisign-batch` command requires all transactions to be in one file, and the `--append` flag does not exist.

More information about the `multisign-batch` command can be found running `simd tx multisign-batch --help`.

##### `validate-signatures` [​](https://docs.cosmos.network/v0.50/build/modules/auth#validate-signatures "Direct link to validate-signatures")

The `validate-signatures` command allows users to validate the signatures of a signed transaction.

```codeBlockLines_e6Vv
$ simd tx validate-signatures tx.signed.json
Signers:
  0: cosmos1l6vsqhh7rnwsyr2kyz3jjg3qduaz8gwgyl8275

Signatures:
  0: cosmos1l6vsqhh7rnwsyr2kyz3jjg3qduaz8gwgyl8275                      [OK]

```

More information about the `validate-signatures` command can be found running `simd tx validate-signatures --help`.

##### `broadcast` [​](https://docs.cosmos.network/v0.50/build/modules/auth#broadcast "Direct link to broadcast")

The `broadcast` command allows users to broadcast a signed transaction to the network.

```codeBlockLines_e6Vv
simd tx broadcast tx.signed.json

```

More information about the `broadcast` command can be found running `simd tx broadcast --help`.

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/auth#grpc "Direct link to gRPC")

A user can query the `auth` module using gRPC endpoints.

##### Account [​](https://docs.cosmos.network/v0.50/build/modules/auth#account-1 "Direct link to Account")

The `account` endpoint allow users to query for an account by it's address.

```codeBlockLines_e6Vv
cosmos.auth.v1beta1.Query/Account

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"address":"cosmos1.."}' \
    localhost:9090 \
    cosmos.auth.v1beta1.Query/Account

```

Example Output:

```codeBlockLines_e6Vv
{
  "account":{
    "@type":"/cosmos.auth.v1beta1.BaseAccount",
    "address":"cosmos1zwg6tpl8aw4rawv8sgag9086lpw5hv33u5ctr2",
    "pubKey":{
      "@type":"/cosmos.crypto.secp256k1.PubKey",
      "key":"ApDrE38zZdd7wLmFS9YmqO684y5DG6fjZ4rVeihF/AQD"
    },
    "sequence":"1"
  }
}

```

##### Accounts [​](https://docs.cosmos.network/v0.50/build/modules/auth#accounts-2 "Direct link to Accounts")

The `accounts` endpoint allow users to query all the available accounts.

```codeBlockLines_e6Vv
cosmos.auth.v1beta1.Query/Accounts

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.auth.v1beta1.Query/Accounts

```

Example Output:

```codeBlockLines_e6Vv
{
   "accounts":[\
      {\
         "@type":"/cosmos.auth.v1beta1.BaseAccount",\
         "address":"cosmos1zwg6tpl8aw4rawv8sgag9086lpw5hv33u5ctr2",\
         "pubKey":{\
            "@type":"/cosmos.crypto.secp256k1.PubKey",\
            "key":"ApDrE38zZdd7wLmFS9YmqO684y5DG6fjZ4rVeihF/AQD"\
         },\
         "sequence":"1"\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.ModuleAccount",\
         "baseAccount":{\
            "address":"cosmos1yl6hdjhmkf37639730gffanpzndzdpmhwlkfhr",\
            "accountNumber":"8"\
         },\
         "name":"transfer",\
         "permissions":[\
            "minter",\
            "burner"\
         ]\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.ModuleAccount",\
         "baseAccount":{\
            "address":"cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh",\
            "accountNumber":"4"\
         },\
         "name":"bonded_tokens_pool",\
         "permissions":[\
            "burner",\
            "staking"\
         ]\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.ModuleAccount",\
         "baseAccount":{\
            "address":"cosmos1tygms3xhhs3yv487phx3dw4a95jn7t7lpm470r",\
            "accountNumber":"5"\
         },\
         "name":"not_bonded_tokens_pool",\
         "permissions":[\
            "burner",\
            "staking"\
         ]\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.ModuleAccount",\
         "baseAccount":{\
            "address":"cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",\
            "accountNumber":"6"\
         },\
         "name":"gov",\
         "permissions":[\
            "burner"\
         ]\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.ModuleAccount",\
         "baseAccount":{\
            "address":"cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl",\
            "accountNumber":"3"\
         },\
         "name":"distribution"\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.BaseAccount",\
         "accountNumber":"1",\
         "address":"cosmos147k3r7v2tvwqhcmaxcfql7j8rmkrlsemxshd3j"\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.ModuleAccount",\
         "baseAccount":{\
            "address":"cosmos1m3h30wlvsf8llruxtpukdvsy0km2kum8g38c8q",\
            "accountNumber":"7"\
         },\
         "name":"mint",\
         "permissions":[\
            "minter"\
         ]\
      },\
      {\
         "@type":"/cosmos.auth.v1beta1.ModuleAccount",\
         "baseAccount":{\
            "address":"cosmos17xpfvakm2amg962yls6f84z3kell8c5lserqta",\
            "accountNumber":"2"\
         },\
         "name":"fee_collector"\
      }\
   ],
   "pagination":{
      "total":"9"
   }
}

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/auth#params-1 "Direct link to Params")

The `params` endpoint allow users to query the current auth parameters.

```codeBlockLines_e6Vv
cosmos.auth.v1beta1.Query/Params

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.auth.v1beta1.Query/Params

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "maxMemoCharacters": "256",
    "txSigLimit": "7",
    "txSizeCostPerByte": "10",
    "sigVerifyCostEd25519": "590",
    "sigVerifyCostSecp256k1": "1000"
  }
}

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/auth#rest "Direct link to REST")

A user can query the `auth` module using REST endpoints.

##### Account [​](https://docs.cosmos.network/v0.50/build/modules/auth#account-2 "Direct link to Account")

The `account` endpoint allow users to query for an account by it's address.

```codeBlockLines_e6Vv
/cosmos/auth/v1beta1/account?address={address}

```

##### Accounts [​](https://docs.cosmos.network/v0.50/build/modules/auth#accounts-3 "Direct link to Accounts")

The `accounts` endpoint allow users to query all the available accounts.

```codeBlockLines_e6Vv
/cosmos/auth/v1beta1/accounts

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/auth#params-2 "Direct link to Params")

The `params` endpoint allow users to query the current auth parameters.

```codeBlockLines_e6Vv
/cosmos/auth/v1beta1/params

```

---

## `x/authz`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/authz#abstract "Direct link to Abstract")

`x/authz` is an implementation of a Cosmos SDK module, per [ADR 30](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-030-authz-module.md), that allows<br/>
granting arbitrary privileges from one account (the granter) to another account (the grantee). Authorizations must be granted for a particular Msg service method one by one using an implementation of the `Authorization` interface.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/authz#contents "Direct link to Contents")

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/authz#concepts)
  - [Authorization and Grant](https://docs.cosmos.network/v0.50/build/modules/authz#authorization-and-grant)
  - [Built-in Authorizations](https://docs.cosmos.network/v0.50/build/modules/authz#built-in-authorizations)
  - [Gas](https://docs.cosmos.network/v0.50/build/modules/authz#gas)
- [State](https://docs.cosmos.network/v0.50/build/modules/authz#state)
  - [Grant](https://docs.cosmos.network/v0.50/build/modules/authz#grant)
  - [GrantQueue](https://docs.cosmos.network/v0.50/build/modules/authz#grantqueue)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/authz#messages)
  - [MsgGrant](https://docs.cosmos.network/v0.50/build/modules/authz#msggrant)
  - [MsgRevoke](https://docs.cosmos.network/v0.50/build/modules/authz#msgrevoke)
  - [MsgExec](https://docs.cosmos.network/v0.50/build/modules/authz#msgexec)
- [Events](https://docs.cosmos.network/v0.50/build/modules/authz#events)
- [Client](https://docs.cosmos.network/v0.50/build/modules/authz#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/authz#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/authz#grpc)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/authz#rest)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/authz#concepts "Direct link to Concepts")

#### Authorization and Grant [​](https://docs.cosmos.network/v0.50/build/modules/authz#authorization-and-grant "Direct link to Authorization and Grant")

The `x/authz` module defines interfaces and messages grant authorizations to perform actions<br/>
on behalf of one account to other accounts. The design is defined in the [ADR 030](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-030-authz-module.md).

A _grant_ is an allowance to execute a Msg by the grantee on behalf of the granter.<br/>
Authorization is an interface that must be implemented by a concrete authorization logic to validate and execute grants. Authorizations are extensible and can be defined for any Msg service method even outside of the module where the Msg method is defined. See the `SendAuthorization` example in the next section for more details.

**Note:** The authz module is different from the [auth (authentication)](https://docs.cosmos.network/v0.50/build/modules/auth) module that is responsible for specifying the base transaction and account types.

x/authz/authorizations.go

```codeBlockLines_e6Vv
type Authorization interface {
	proto.Message

	// MsgTypeURL returns the fully-qualified Msg service method URL (as described in ADR 031),
	// which will process and accept or reject a request.
	MsgTypeURL() string

	// Accept determines whether this grant permits the provided sdk.Msg to be performed,
	// and if so provides an upgraded authorization instance.
	Accept(ctx sdk.Context, msg sdk.Msg) (AcceptResponse, error)

	// ValidateBasic does a simple validation check that
	// doesn't require access to any other information.
	ValidateBasic() error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/authz/authorizations.go#L11-L25)

#### Built-in Authorizations [​](https://docs.cosmos.network/v0.50/build/modules/authz#built-in-authorizations "Direct link to Built-in Authorizations")

The Cosmos SDK `x/authz` module comes with following authorization types:

##### GenericAuthorization [​](https://docs.cosmos.network/v0.50/build/modules/authz#genericauthorization "Direct link to GenericAuthorization")

`GenericAuthorization` implements the `Authorization` interface that gives unrestricted permission to execute the provided Msg on behalf of granter's account.

proto/cosmos/authz/v1beta1/authz.proto

```codeBlockLines_e6Vv
// GenericAuthorization gives the grantee unrestricted permissions to execute
// the provided method on behalf of the granter's account.
message GenericAuthorization {
  option (amino.name)                        = "cosmos-sdk/GenericAuthorization";
  option (cosmos_proto.implements_interface) = "cosmos.authz.v1beta1.Authorization";

  // Msg, identified by it's type URL, to grant unrestricted permissions to execute
  string msg = 1;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/authz/v1beta1/authz.proto#L14-L22)

x/authz/generic_authorization.go

```codeBlockLines_e6Vv
// MsgTypeURL implements Authorization.MsgTypeURL.
func (a GenericAuthorization) MsgTypeURL() string {
	return a.Msg
}

// Accept implements Authorization.Accept.
func (a GenericAuthorization) Accept(ctx sdk.Context, msg sdk.Msg) (AcceptResponse, error) {
	return AcceptResponse{Accept: true}, nil
}

// ValidateBasic implements Authorization.ValidateBasic.
func (a GenericAuthorization) ValidateBasic() error {
	return nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/authz/generic_authorization.go#L16-L29)

- `msg` stores Msg type URL.

##### SendAuthorization [​](https://docs.cosmos.network/v0.50/build/modules/authz#sendauthorization "Direct link to SendAuthorization")

`SendAuthorization` implements the `Authorization` interface for the `cosmos.bank.v1beta1.MsgSend` Msg.

- It takes a (positive) `SpendLimit` that specifies the maximum amount of tokens the grantee can spend. The `SpendLimit` is updated as the tokens are spent.
- It takes an (optional) `AllowList` that specifies to which addresses a grantee can send token.

proto/cosmos/bank/v1beta1/authz.proto

```codeBlockLines_e6Vv
// SendAuthorization allows the grantee to spend up to spend_limit coins from
// the granter's account.
//
// Since: cosmos-sdk 0.43
message SendAuthorization {
  option (cosmos_proto.implements_interface) = "cosmos.authz.v1beta1.Authorization";
  option (amino.name)                        = "cosmos-sdk/SendAuthorization";

  repeated cosmos.base.v1beta1.Coin spend_limit = 1 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];

  // allow_list specifies an optional list of addresses to whom the grantee can send tokens on behalf of the
  // granter. If omitted, any recipient is allowed.
  //
  // Since: cosmos-sdk 0.47
  repeated string allow_list = 2;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/bank/v1beta1/authz.proto#L11-L30)

x/bank/types/send_authorization.go

```codeBlockLines_e6Vv
// Accept implements Authorization.Accept.
func (a SendAuthorization) Accept(ctx sdk.Context, msg sdk.Msg) (authz.AcceptResponse, error) {
	mSend, ok := msg.(*MsgSend)
	if !ok {
		return authz.AcceptResponse{}, sdkerrors.ErrInvalidType.Wrap("type mismatch")
	}

	toAddr := mSend.ToAddress

	limitLeft, isNegative := a.SpendLimit.SafeSub(mSend.Amount...)
	if isNegative {
		return authz.AcceptResponse{}, sdkerrors.ErrInsufficientFunds.Wrapf("requested amount is more than spend limit")
	}
	if limitLeft.IsZero() {
		return authz.AcceptResponse{Accept: true, Delete: true}, nil
	}

	isAddrExists := false
	allowedList := a.GetAllowList()

	for _, addr := range allowedList {
		ctx.GasMeter().ConsumeGas(gasCostPerIteration, "send authorization")
		if addr == toAddr {
			isAddrExists = true
			break
		}
	}

	if len(allowedList) > 0 && !isAddrExists {
		return authz.AcceptResponse{}, sdkerrors.ErrUnauthorized.Wrapf("cannot send to %s address", toAddr)
	}

	return authz.AcceptResponse{Accept: true, Delete: false, Updated: &SendAuthorization{SpendLimit: limitLeft, AllowList: allowedList}}, nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/bank/types/send_authorization.go#L29-L62)

- `spend_limit` keeps track of how many coins are left in the authorization.
- `allow_list` specifies an optional list of addresses to whom the grantee can send tokens on behalf of the granter.

##### StakeAuthorization [​](https://docs.cosmos.network/v0.50/build/modules/authz#stakeauthorization "Direct link to StakeAuthorization")

`StakeAuthorization` implements the `Authorization` interface for messages in the [staking module](https://docs.cosmos.network/v0.50/build/modules/staking). It takes an `AuthorizationType` to specify whether you want to authorise delegating, undelegating or redelegating (i.e. these have to be authorised separately). It also takes an optional `MaxTokens` that keeps track of a limit to the amount of tokens that can be delegated/undelegated/redelegated. If left empty, the amount is unlimited. Additionally, this Msg takes an `AllowList` or a `DenyList`, which allows you to select which validators you allow or deny grantees to stake with.

proto/cosmos/staking/v1beta1/authz.proto

```codeBlockLines_e6Vv
// StakeAuthorization defines authorization for delegate/undelegate/redelegate.
//
// Since: cosmos-sdk 0.43
message StakeAuthorization {
  option (cosmos_proto.implements_interface) = "cosmos.authz.v1beta1.Authorization";
  option (amino.name)                        = "cosmos-sdk/StakeAuthorization";

  // max_tokens specifies the maximum amount of tokens can be delegate to a validator. If it is
  // empty, there is no spend limit and any amount of coins can be delegated.
  cosmos.base.v1beta1.Coin max_tokens = 1 [(gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coin"];
  // validators is the oneof that represents either allow_list or deny_list
  oneof validators {
    // allow_list specifies list of validator addresses to whom grantee can delegate tokens on behalf of granter's
    // account.
    Validators allow_list = 2;
    // deny_list specifies list of validator addresses to whom grantee can not delegate tokens.
    Validators deny_list = 3;
  }
  // Validators defines list of validator addresses.
  message Validators {
    repeated string address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  }
  // authorization_type defines one of AuthorizationType.
  AuthorizationType authorization_type = 4;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/authz.proto#L11-L35)

x/staking/types/authz.go

```codeBlockLines_e6Vv
// NewStakeAuthorization creates a new StakeAuthorization object.
func NewStakeAuthorization(allowed []sdk.ValAddress, denied []sdk.ValAddress, authzType AuthorizationType, amount *sdk.Coin) (*StakeAuthorization, error) {
	allowedValidators, deniedValidators, err := validateAllowAndDenyValidators(allowed, denied)
	if err != nil {
		return nil, err
	}

	a := StakeAuthorization{}
	if allowedValidators != nil {
		a.Validators = &StakeAuthorization_AllowList{AllowList: &StakeAuthorization_Validators{Address: allowedValidators}}
	} else {
		a.Validators = &StakeAuthorization_DenyList{DenyList: &StakeAuthorization_Validators{Address: deniedValidators}}
	}

	if amount != nil {
		a.MaxTokens = amount
	}
	a.AuthorizationType = authzType

	return &a, nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/staking/types/authz.go#L15-L35)

#### Gas [​](https://docs.cosmos.network/v0.50/build/modules/authz#gas "Direct link to Gas")

In order to prevent DoS attacks, granting `StakeAuthorization` s with `x/authz` incurs gas. `StakeAuthorization` allows you to authorize another account to delegate, undelegate, or redelegate to validators. The authorizer can define a list of validators they allow or deny delegations to. The Cosmos SDK iterates over these lists and charge 10 gas for each validator in both of the lists.

Since the state maintaining a list for granter, grantee pair with same expiration, we are iterating over the list to remove the grant (in case of any revoke of paritcular `msgType`) from the list and we are charging 20 gas per iteration.

### State [​](https://docs.cosmos.network/v0.50/build/modules/authz#state "Direct link to State")

#### Grant [​](https://docs.cosmos.network/v0.50/build/modules/authz#grant "Direct link to Grant")

Grants are identified by combining granter address (the address bytes of the granter), grantee address (the address bytes of the grantee) and Authorization type (its type URL). Hence we only allow one grant for the (granter, grantee, Authorization) triple.

- Grant: `0x01 | granter_address_len (1 byte) | granter_address_bytes | grantee_address_len (1 byte) | grantee_address_bytes |  msgType_bytes -> ProtocolBuffer(AuthorizationGrant)`

The grant object encapsulates an `Authorization` type and an expiration timestamp:

proto/cosmos/authz/v1beta1/authz.proto

```codeBlockLines_e6Vv
// Grant gives permissions to execute
// the provide method with expiration time.
message Grant {
  google.protobuf.Any authorization = 1 [(cosmos_proto.accepts_interface) = "cosmos.authz.v1beta1.Authorization"];
  // time when the grant will expire and will be pruned. If null, then the grant
  // doesn't have a time expiration (other conditions  in `authorization`
  // may apply to invalidate the grant)
  google.protobuf.Timestamp expiration = 2 [(gogoproto.stdtime) = true, (gogoproto.nullable) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/authz/v1beta1/authz.proto#L24-L32)

#### GrantQueue [​](https://docs.cosmos.network/v0.50/build/modules/authz#grantqueue "Direct link to GrantQueue")

We are maintaining a queue for authz pruning. Whenever a grant is created, an item will be added to `GrantQueue` with a key of expiration, granter, grantee.

In `EndBlock` (which runs for every block) we continuously check and prune the expired grants by forming a prefix key with current blocktime that passed the stored expiration in `GrantQueue`, we iterate through all the matched records from `GrantQueue` and delete them from the `GrantQueue` & `Grant` s store.

x/authz/keeper/keeper.go

```codeBlockLines_e6Vv
func (k Keeper) DequeueAndDeleteExpiredGrants(ctx sdk.Context) error {
	store := ctx.KVStore(k.storeKey)

	iterator := store.Iterator(GrantQueuePrefix, sdk.InclusiveEndBytes(GrantQueueTimePrefix(ctx.BlockTime())))
	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var queueItem authz.GrantQueueItem
		if err := k.cdc.Unmarshal(iterator.Value(), &queueItem); err != nil {
			return err
		}

		_, granter, grantee, err := parseGrantQueueKey(iterator.Key())
		if err != nil {
			return err
		}

		store.Delete(iterator.Key())

		for _, typeURL := range queueItem.MsgTypeUrls {
			store.Delete(grantStoreKey(grantee, granter, typeURL))
		}
	}

	return nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/5f4ddc6f80f9707320eec42182184207fff3833a/x/authz/keeper/keeper.go#L378-L403)

- GrantQueue: `0x02 | expiration_bytes | granter_address_len (1 byte) | granter_address_bytes | grantee_address_len (1 byte) | grantee_address_bytes -> ProtocalBuffer(GrantQueueItem)`

The `expiration_bytes` are the expiration date in UTC with the format `"2006-01-02T15:04:05.000000000"`.

x/authz/keeper/keys.go

```codeBlockLines_e6Vv
// GrantQueueKey - return grant queue store key. If a given grant doesn't have a defined
// expiration, then it should not be used in the pruning queue.
// Key format is:
//
//	0x02<expiration><granterAddressLen (1 Byte)><granterAddressBytes><granteeAddressLen (1 Byte)><granteeAddressBytes>: GrantQueueItem
func GrantQueueKey(expiration time.Time, granter sdk.AccAddress, grantee sdk.AccAddress) []byte {
	exp := sdk.FormatTimeBytes(expiration)
	granter = address.MustLengthPrefix(granter)
	grantee = address.MustLengthPrefix(grantee)

	return sdk.AppendLengthPrefixedBytes(GrantQueuePrefix, exp, granter, grantee)
}

// GrantQueueTimePrefix - return grant queue time prefix
func GrantQueueTimePrefix(expiration time.Time) []byte {
	return append(GrantQueuePrefix, sdk.FormatTimeBytes(expiration)...)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/authz/keeper/keys.go#L77-L93)

The `GrantQueueItem` object contains the list of type urls between granter and grantee that expire at the time indicated in the key.

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/authz#messages "Direct link to Messages")

In this section we describe the processing of messages for the authz module.

#### MsgGrant [​](https://docs.cosmos.network/v0.50/build/modules/authz#msggrant "Direct link to MsgGrant")

An authorization grant is created using the `MsgGrant` message.<br/>
If there is already a grant for the `(granter, grantee, Authorization)` triple, then the new grant overwrites the previous one. To update or extend an existing grant, a new grant with the same `(granter, grantee, Authorization)` triple should be created.

proto/cosmos/authz/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgGrant is a request type for Grant method. It declares authorization to the grantee
// on behalf of the granter with the provided expiration time.
message MsgGrant {
  option (cosmos.msg.v1.signer) = "granter";
  option (amino.name)           = "cosmos-sdk/MsgGrant";

  string granter = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string grantee = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  cosmos.authz.v1beta1.Grant grant = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/authz/v1beta1/tx.proto#L35-L45)

The message handling should fail if:

- both granter and grantee have the same address.
- provided `Expiration` time is less than current unix timestamp (but a grant will be created if no `expiration` time is provided since `expiration` is optional).
- provided `Grant.Authorization` is not implemented.
- `Authorization.MsgTypeURL()` is not defined in the router (there is no defined handler in the app router to handle that Msg types).

#### MsgRevoke [​](https://docs.cosmos.network/v0.50/build/modules/authz#msgrevoke "Direct link to MsgRevoke")

A grant can be removed with the `MsgRevoke` message.

proto/cosmos/authz/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgRevoke revokes any authorization with the provided sdk.Msg type on the
// granter's account with that has been granted to the grantee.
message MsgRevoke {
  option (cosmos.msg.v1.signer) = "granter";
  option (amino.name)           = "cosmos-sdk/MsgRevoke";

  string granter      = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string grantee      = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string msg_type_url = 3;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/authz/v1beta1/tx.proto#L69-L78)

The message handling should fail if:

- both granter and grantee have the same address.
- provided `MsgTypeUrl` is empty.

NOTE: The `MsgExec` message removes a grant if the grant has expired.

#### MsgExec [​](https://docs.cosmos.network/v0.50/build/modules/authz#msgexec "Direct link to MsgExec")

When a grantee wants to execute a transaction on behalf of a granter, they must send `MsgExec`.

proto/cosmos/authz/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgExec attempts to execute the provided messages using
// authorizations granted to the grantee. Each message should have only
// one signer corresponding to the granter of the authorization.
message MsgExec {
  option (cosmos.msg.v1.signer) = "grantee";
  option (amino.name)           = "cosmos-sdk/MsgExec";

  string grantee = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // Execute Msg.
  // The x/authz will try to find a grant matching (msg.signers[0], grantee, MsgTypeURL(msg))
  // triple and validate it.
  repeated google.protobuf.Any msgs = 2 [(cosmos_proto.accepts_interface) = "cosmos.base.v1beta1.Msg"];

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/authz/v1beta1/tx.proto#L52-L63)

The message handling should fail if:

- provided `Authorization` is not implemented.
- grantee doesn't have permission to run the transaction.
- if granted authorization is expired.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/authz#events "Direct link to Events")

The authz module emits proto events defined in [the Protobuf reference](https://buf.build/cosmos/cosmos-sdk/docs/main/cosmos.authz.v1beta1#cosmos.authz.v1beta1.EventGrant).

### Client [​](https://docs.cosmos.network/v0.50/build/modules/authz#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/authz#cli "Direct link to CLI")

A user can query and interact with the `authz` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/authz#query "Direct link to Query")

The `query` commands allow users to query `authz` state.

```codeBlockLines_e6Vv
simd query authz --help

```

###### Grants [​](https://docs.cosmos.network/v0.50/build/modules/authz#grants "Direct link to grants")

The `grants` command allows users to query grants for a granter-grantee pair. If the message type URL is set, it selects grants only for that message type.

```codeBlockLines_e6Vv
simd query authz grants [granter-addr] [grantee-addr] [msg-type-url]? [flags]

```

Example:

```codeBlockLines_e6Vv
simd query authz grants cosmos1.. cosmos1.. /cosmos.bank.v1beta1.MsgSend

```

Example Output:

```codeBlockLines_e6Vv
grants:
- authorization:
    '@type': /cosmos.bank.v1beta1.SendAuthorization
    spend_limit:
    - amount: "100"
      denom: stake
  expiration: "2022-01-01T00:00:00Z"
pagination: null

```

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/authz#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `authz` module.

```codeBlockLines_e6Vv
simd tx authz --help

```

###### Exec [​](https://docs.cosmos.network/v0.50/build/modules/authz#exec "Direct link to exec")

The `exec` command allows a grantee to execute a transaction on behalf of granter.

```codeBlockLines_e6Vv
  simd tx authz exec [tx-json-file] --from [grantee] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx authz exec tx.json --from=cosmos1..

```

###### Grant [​](https://docs.cosmos.network/v0.50/build/modules/authz#grant-1 "Direct link to grant")

The `grant` command allows a granter to grant an authorization to a grantee.

```codeBlockLines_e6Vv
simd tx authz grant <grantee> <authorization_type="send"|"generic"|"delegate"|"unbond"|"redelegate"> --from <granter> [flags]

```

- The `send` authorization_type refers to the built-in `SendAuthorization` type. The custom flags available are `spend-limit` (required) and `allow-list` (optional), documented [here](https://docs.cosmos.network/v0.50/build/modules/authz#SendAuthorization)

Example:

```codeBlockLines_e6Vv
    simd tx authz grant cosmos1.. send --spend-limit=100stake --allow-list=cosmos1...,cosmos2... --from=cosmos1..

```

- The `generic` authorization_type refers to the built-in `GenericAuthorization` type. The custom flag available is `msg-type` (required) documented [here](https://docs.cosmos.network/v0.50/build/modules/authz#GenericAuthorization).

> Note: `msg-type` is any valid Cosmos SDK `Msg` type url.

Example:

```codeBlockLines_e6Vv
    simd tx authz grant cosmos1.. generic --msg-type=/cosmos.bank.v1beta1.MsgSend --from=cosmos1..

```

- The `delegate`, `unbond`, `redelegate` authorization_types refer to the built-in `StakeAuthorization` type. The custom flags available are `spend-limit` (optional), `allowed-validators` (optional) and `deny-validators` (optional) documented [here](https://docs.cosmos.network/v0.50/build/modules/authz#StakeAuthorization).

> Note: `allowed-validators` and `deny-validators` cannot both be empty. `spend-limit` represents the `MaxTokens`

Example:

```codeBlockLines_e6Vv
simd tx authz grant cosmos1.. delegate --spend-limit=100stake --allowed-validators=cosmos...,cosmos... --deny-validators=cosmos... --from=cosmos1..

```

###### Revoke [​](https://docs.cosmos.network/v0.50/build/modules/authz#revoke "Direct link to revoke")

The `revoke` command allows a granter to revoke an authorization from a grantee.

```codeBlockLines_e6Vv
simd tx authz revoke [grantee] [msg-type-url] --from=[granter] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx authz revoke cosmos1.. /cosmos.bank.v1beta1.MsgSend --from=cosmos1..

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/authz#grpc "Direct link to gRPC")

A user can query the `authz` module using gRPC endpoints.

##### Grants [​](https://docs.cosmos.network/v0.50/build/modules/authz#grants-1 "Direct link to Grants")

The `Grants` endpoint allows users to query grants for a granter-grantee pair. If the message type URL is set, it selects grants only for that message type.

```codeBlockLines_e6Vv
cosmos.authz.v1beta1.Query/Grants

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"granter":"cosmos1..","grantee":"cosmos1..","msg_type_url":"/cosmos.bank.v1beta1.MsgSend"}' \
    localhost:9090 \
    cosmos.authz.v1beta1.Query/Grants

```

Example Output:

```codeBlockLines_e6Vv
{
  "grants": [\
    {\
      "authorization": {\
        "@type": "/cosmos.bank.v1beta1.SendAuthorization",\
        "spendLimit": [\
          {\
            "denom":"stake",\
            "amount":"100"\
          }\
        ]\
      },\
      "expiration": "2022-01-01T00:00:00Z"\
    }\
  ]
}

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/authz#rest "Direct link to REST")

A user can query the `authz` module using REST endpoints.

```codeBlockLines_e6Vv
/cosmos/authz/v1beta1/grants

```

Example:

```codeBlockLines_e6Vv
curl "localhost:1317/cosmos/authz/v1beta1/grants?granter=cosmos1..&grantee=cosmos1..&msg_type_url=/cosmos.bank.v1beta1.MsgSend"

```

Example Output:

```codeBlockLines_e6Vv
{
  "grants": [\
    {\
      "authorization": {\
        "@type": "/cosmos.bank.v1beta1.SendAuthorization",\
        "spend_limit": [\
          {\
            "denom": "stake",\
            "amount": "100"\
          }\
        ]\
      },\
      "expiration": "2022-01-01T00:00:00Z"\
    }\
  ],
  "pagination": null
}

```

---

## `x/bank`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/bank#abstract "Direct link to Abstract")

This document specifies the bank module of the Cosmos SDK.

The bank module is responsible for handling multi-asset coin transfers between<br/>
accounts and tracking special-case pseudo-transfers which must work differently<br/>
with particular kinds of accounts (notably delegating/undelegating for vesting<br/>
accounts). It exposes several interfaces with varying capabilities for secure<br/>
interaction with other modules which must alter user balances.

In addition, the bank module tracks and provides query support for the total<br/>
supply of all assets used in the application.

This module is used in the Cosmos Hub.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/bank#contents "Direct link to Contents")

- [Supply](https://docs.cosmos.network/v0.50/build/modules/bank#supply)
  - [Total Supply](https://docs.cosmos.network/v0.50/build/modules/bank#total-supply)
- [Module Accounts](https://docs.cosmos.network/v0.50/build/modules/bank#module-accounts)
  - [Permissions](https://docs.cosmos.network/v0.50/build/modules/bank#permissions)
- [State](https://docs.cosmos.network/v0.50/build/modules/bank#state)
- [Params](https://docs.cosmos.network/v0.50/build/modules/bank#params)
- [Keepers](https://docs.cosmos.network/v0.50/build/modules/bank#keepers)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/bank#messages)
- [Events](https://docs.cosmos.network/v0.50/build/modules/bank#events)
  - [Message Events](https://docs.cosmos.network/v0.50/build/modules/bank#message-events)
  - [Keeper Events](https://docs.cosmos.network/v0.50/build/modules/bank#keeper-events)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/bank#parameters)
  - [SendEnabled](https://docs.cosmos.network/v0.50/build/modules/bank#sendenabled)
  - [DefaultSendEnabled](https://docs.cosmos.network/v0.50/build/modules/bank#defaultsendenabled)
- [Client](https://docs.cosmos.network/v0.50/build/modules/bank#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/bank#cli)
  - [Query](https://docs.cosmos.network/v0.50/build/modules/bank#query)
  - [Transactions](https://docs.cosmos.network/v0.50/build/modules/bank#transactions)
- [gRPC](https://docs.cosmos.network/v0.50/build/modules/bank#grpc)

### Supply [​](https://docs.cosmos.network/v0.50/build/modules/bank#supply "Direct link to Supply")

The `supply` functionality:

- passively tracks the total supply of coins within a chain,
- provides a pattern for modules to hold/interact with `Coins`, and
- introduces the invariant check to verify a chain's total supply.

#### Total Supply [​](https://docs.cosmos.network/v0.50/build/modules/bank#total-supply "Direct link to Total Supply")

The total `Supply` of the network is equal to the sum of all coins from the<br/>
account. The total supply is updated every time a `Coin` is minted (eg: as part<br/>
of the inflation mechanism) or burned (eg: due to slashing or if a governance<br/>
proposal is vetoed).

### Module Accounts [​](https://docs.cosmos.network/v0.50/build/modules/bank#module-accounts "Direct link to Module Accounts")

The supply functionality introduces a new type of `auth.Account` which can be used by<br/>
modules to allocate tokens and in special cases mint or burn tokens. At a base<br/>
level these module accounts are capable of sending/receiving tokens to and from<br/>
`auth.Account` s and other module accounts. This design replaces previous<br/>
alternative designs where, to hold tokens, modules would burn the incoming<br/>
tokens from the sender account, and then track those tokens internally. Later,<br/>
in order to send tokens, the module would need to effectively mint tokens<br/>
within a destination account. The new design removes duplicate logic between<br/>
modules to perform this accounting.

The `ModuleAccount` interface is defined as follows:

```codeBlockLines_e6Vv
type ModuleAccount interface {
  auth.Account               // same methods as the Account interface

  GetName() string           // name of the module; used to obtain the address
  GetPermissions() []string  // permissions of module account
  HasPermission(string) bool
}

```

> **WARNING!**<br/>
> Any module or message handler that allows either direct or indirect sending of funds must explicitly guarantee those funds cannot be sent to module accounts (unless allowed).

The supply `Keeper` also introduces new wrapper functions for the auth `Keeper`<br/>
and the bank `Keeper` that are related to `ModuleAccount` s in order to be able<br/>
to:

- Get and set `ModuleAccount` s by providing the `Name`.
- Send coins from and to other `ModuleAccount` s or standard `Account` s<br/>
  (`BaseAccount` or `VestingAccount`) by passing only the `Name`.
- `Mint` or `Burn` coins for a `ModuleAccount` (restricted to its permissions).

#### Permissions [​](https://docs.cosmos.network/v0.50/build/modules/bank#permissions "Direct link to Permissions")

Each `ModuleAccount` has a different set of permissions that provide different<br/>
object capabilities to perform certain actions. Permissions need to be<br/>
registered upon the creation of the supply `Keeper` so that every time a<br/>
`ModuleAccount` calls the allowed functions, the `Keeper` can lookup the<br/>
permissions to that specific account and perform or not perform the action.

The available permissions are:

- `Minter`: allows for a module to mint a specific amount of coins.
- `Burner`: allows for a module to burn a specific amount of coins.
- `Staking`: allows for a module to delegate and undelegate a specific amount of coins.

### State [​](https://docs.cosmos.network/v0.50/build/modules/bank#state "Direct link to State")

The `x/bank` module keeps state of the following primary objects:

1. Account balances
2. Denomination metadata
3. The total supply of all balances
4. Information on which denominations are allowed to be sent.

In addition, the `x/bank` module keeps the following indexes to manage the<br/>
aforementioned state:

- Supply Index: `0x0 | byte(denom) -> byte(amount)`
- Denom Metadata Index: `0x1 | byte(denom) -> ProtocolBuffer(Metadata)`
- Balances Index: `0x2 | byte(address length) | []byte(address) | []byte(balance.Denom) -> ProtocolBuffer(balance)`
- Reverse Denomination to Address Index: `0x03 | byte(denom) | 0x00 | []byte(address) -> 0`

### Params [​](https://docs.cosmos.network/v0.50/build/modules/bank#params "Direct link to Params")

The bank module stores it's params in state with the prefix of `0x05`,<br/>
it can be updated with governance or the address with authority.

- Params: `0x05 | ProtocolBuffer(Params)`

proto/cosmos/bank/v1beta1/bank.proto

```codeBlockLines_e6Vv
// Params defines the parameters for the bank module.
message Params {
  option (amino.name)                 = "cosmos-sdk/x/bank/Params";
  option (gogoproto.goproto_stringer) = false;
  // Deprecated: Use of SendEnabled in params is deprecated.
  // For genesis, use the newly added send_enabled field in the genesis object.
  // Storage, lookup, and manipulation of this information is now in the keeper.
  //
  // As of cosmos-sdk 0.47, this only exists for backwards compatibility of genesis files.
  repeated SendEnabled send_enabled         = 1 [deprecated = true];
  bool                 default_send_enabled = 2;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/bank/v1beta1/bank.proto#L12-L23)

### Keepers [​](https://docs.cosmos.network/v0.50/build/modules/bank#keepers "Direct link to Keepers")

The bank module provides these exported keeper interfaces that can be<br/>
passed to other modules that read or update account balances. Modules<br/>
should use the least-permissive interface that provides the functionality they<br/>
require.

Best practices dictate careful review of `bank` module code to ensure that<br/>
permissions are limited in the way that you expect.

#### Denied Addresses [​](https://docs.cosmos.network/v0.50/build/modules/bank#denied-addresses "Direct link to Denied Addresses")

The `x/bank` module accepts a map of addresses that are considered blocklisted<br/>
from directly and explicitly receiving funds through means such as `MsgSend` and<br/>
`MsgMultiSend` and direct API calls like `SendCoinsFromModuleToAccount`.

Typically, these addresses are module accounts. If these addresses receive funds<br/>
outside the expected rules of the state machine, invariants are likely to be<br/>
broken and could result in a halted network.

By providing the `x/bank` module with a blocklisted set of addresses, an error occurs for the operation if a user or client attempts to directly or indirectly send funds to a blocklisted account, for example, by using [IBC](https://ibc.cosmos.network/).

#### Common Types [​](https://docs.cosmos.network/v0.50/build/modules/bank#common-types "Direct link to Common Types")

##### Input [​](https://docs.cosmos.network/v0.50/build/modules/bank#input "Direct link to Input")

An input of a multiparty transfer

```codeBlockLines_e6Vv
// Input models transaction input.
message Input {
  string   address                        = 1;
  repeated cosmos.base.v1beta1.Coin coins = 2;
}

```

##### Output [​](https://docs.cosmos.network/v0.50/build/modules/bank#output "Direct link to Output")

An output of a multiparty transfer.

```codeBlockLines_e6Vv
// Output models transaction outputs.
message Output {
  string   address                        = 1;
  repeated cosmos.base.v1beta1.Coin coins = 2;
}

```

#### BaseKeeper [​](https://docs.cosmos.network/v0.50/build/modules/bank#basekeeper "Direct link to BaseKeeper")

The base keeper provides full-permission access: the ability to arbitrary modify any account's balance and mint or burn coins.

Restricted permission to mint per module could be achieved by using baseKeeper with `WithMintCoinsRestriction` to give specific restrictions to mint (e.g. only minting certain denom).

```codeBlockLines_e6Vv
// Keeper defines a module interface that facilitates the transfer of coins
// between accounts.
type Keeper interface {
    SendKeeper
    WithMintCoinsRestriction(MintingRestrictionFn) BaseKeeper

    InitGenesis(context.Context, *types.GenesisState)
    ExportGenesis(context.Context) *types.GenesisState

    GetSupply(ctx context.Context, denom string) sdk.Coin
    HasSupply(ctx context.Context, denom string) bool
    GetPaginatedTotalSupply(ctx context.Context, pagination *query.PageRequest) (sdk.Coins, *query.PageResponse, error)
    IterateTotalSupply(ctx context.Context, cb func(sdk.Coin) bool)
    GetDenomMetaData(ctx context.Context, denom string) (types.Metadata, bool)
    HasDenomMetaData(ctx context.Context, denom string) bool
    SetDenomMetaData(ctx context.Context, denomMetaData types.Metadata)
    IterateAllDenomMetaData(ctx context.Context, cb func(types.Metadata) bool)

    SendCoinsFromModuleToAccount(ctx context.Context, senderModule string, recipientAddr sdk.AccAddress, amt sdk.Coins) error
    SendCoinsFromModuleToModule(ctx context.Context, senderModule, recipientModule string, amt sdk.Coins) error
    SendCoinsFromAccountToModule(ctx context.Context, senderAddr sdk.AccAddress, recipientModule string, amt sdk.Coins) error
    DelegateCoinsFromAccountToModule(ctx context.Context, senderAddr sdk.AccAddress, recipientModule string, amt sdk.Coins) error
    UndelegateCoinsFromModuleToAccount(ctx context.Context, senderModule string, recipientAddr sdk.AccAddress, amt sdk.Coins) error
    MintCoins(ctx context.Context, moduleName string, amt sdk.Coins) error
    BurnCoins(ctx context.Context, moduleName string, amt sdk.Coins) error

    DelegateCoins(ctx context.Context, delegatorAddr, moduleAccAddr sdk.AccAddress, amt sdk.Coins) error
    UndelegateCoins(ctx context.Context, moduleAccAddr, delegatorAddr sdk.AccAddress, amt sdk.Coins) error

    // GetAuthority gets the address capable of executing governance proposal messages. Usually the gov module account.
    GetAuthority() string

    types.QueryServer
}

```

#### SendKeeper [​](https://docs.cosmos.network/v0.50/build/modules/bank#sendkeeper "Direct link to SendKeeper")

The send keeper provides access to account balances and the ability to transfer coins between<br/>
accounts. The send keeper does not alter the total supply (mint or burn coins).

```codeBlockLines_e6Vv
// SendKeeper defines a module interface that facilitates the transfer of coins
// between accounts without the possibility of creating coins.
type SendKeeper interface {
    ViewKeeper

    AppendSendRestriction(restriction SendRestrictionFn)
    PrependSendRestriction(restriction SendRestrictionFn)
    ClearSendRestriction()

    InputOutputCoins(ctx context.Context, input types.Input, outputs []types.Output) error
    SendCoins(ctx context.Context, fromAddr, toAddr sdk.AccAddress, amt sdk.Coins) error

    GetParams(ctx context.Context) types.Params
    SetParams(ctx context.Context, params types.Params) error

    IsSendEnabledDenom(ctx context.Context, denom string) bool
    SetSendEnabled(ctx context.Context, denom string, value bool)
    SetAllSendEnabled(ctx context.Context, sendEnableds []*types.SendEnabled)
    DeleteSendEnabled(ctx context.Context, denom string)
    IterateSendEnabledEntries(ctx context.Context, cb func(denom string, sendEnabled bool) (stop bool))
    GetAllSendEnabledEntries(ctx context.Context) []types.SendEnabled

    IsSendEnabledCoin(ctx context.Context, coin sdk.Coin) bool
    IsSendEnabledCoins(ctx context.Context, coins ...sdk.Coin) error

    BlockedAddr(addr sdk.AccAddress) bool
}

```

##### Send Restrictions [​](https://docs.cosmos.network/v0.50/build/modules/bank#send-restrictions "Direct link to Send Restrictions")

The `SendKeeper` applies a `SendRestrictionFn` before each transfer of funds.

```codeBlockLines_e6Vv
// A SendRestrictionFn can restrict sends and/or provide a new receiver address.
type SendRestrictionFn func(ctx context.Context, fromAddr, toAddr sdk.AccAddress, amt sdk.Coins) (newToAddr sdk.AccAddress, err error)

```

After the `SendKeeper` (or `BaseKeeper`) has been created, send restrictions can be added to it using the `AppendSendRestriction` or `PrependSendRestriction` functions.<br/>
Both functions compose the provided restriction with any previously provided restrictions.<br/>
`AppendSendRestriction` adds the provided restriction to be run after any previously provided send restrictions.<br/>
`PrependSendRestriction` adds the restriction to be run before any previously provided send restrictions.<br/>
The composition will short-circuit when an error is encountered. I.e. if the first one returns an error, the second is not run.

During `SendCoins`, the send restriction is applied after coins are removed from the from address, but before adding them to the to address.<br/>
During `InputOutputCoins`, the send restriction is applied after the input coins are removed and once for each output before the funds are added.

A send restriction function should make use of a custom value in the context to allow bypassing that specific restriction.

Send Restrictions are not placed on `ModuleToAccount` or `ModuleToModule` transfers. This is done due to modules needing to move funds to user accounts and other module accounts. This is a design decision to allow for more flexibility in the state machine. The state machine should be able to move funds between module accounts and user accounts without restrictions.

Secondly this limitation would limit the usage of the state machine even for itself. users would not be able to receive rewards, not be able to move funds between module accounts. In the case that a user sends funds from a user account to the community pool and then a governance proposal is used to get those tokens into the users account this would fall under the discretion of the app chain developer to what they would like to do here. We can not make strong assumptions here.<br/>
Thirdly, this issue could lead into a chain halt if a token is disabled and the token is moved in the begin/endblock. This is the last reason we see the current change and more damaging then beneficial for users.

For example, in your module's keeper package, you'd define the send restriction function:

```codeBlockLines_e6Vv
var _ banktypes.SendRestrictionFn = Keeper{}.SendRestrictionFn

func (k Keeper) SendRestrictionFn(ctx context.Context, fromAddr, toAddr sdk.AccAddress, amt sdk.Coins) (sdk.AccAddress, error) {
    // Bypass if the context says to.
    if mymodule.HasBypass(ctx) {
        return toAddr, nil
    }

    // Your custom send restriction logic goes here.
    return nil, errors.New("not implemented")
}

```

The bank keeper should be provided to your keeper's constructor so the send restriction can be added to it:

```codeBlockLines_e6Vv
func NewKeeper(cdc codec.BinaryCodec, storeKey storetypes.StoreKey, bankKeeper mymodule.BankKeeper) Keeper {
    rv := Keeper{/*...*/}
    bankKeeper.AppendSendRestriction(rv.SendRestrictionFn)
    return rv
}

```

Then, in the `mymodule` package, define the context helpers:

```codeBlockLines_e6Vv
const bypassKey = "bypass-mymodule-restriction"

// WithBypass returns a new context that will cause the mymodule bank send restriction to be skipped.
func WithBypass(ctx context.Context) context.Context {
    return sdk.UnwrapSDKContext(ctx).WithValue(bypassKey, true)
}

// WithoutBypass returns a new context that will cause the mymodule bank send restriction to not be skipped.
func WithoutBypass(ctx context.Context) context.Context {
    return sdk.UnwrapSDKContext(ctx).WithValue(bypassKey, false)
}

// HasBypass checks the context to see if the mymodule bank send restriction should be skipped.
func HasBypass(ctx context.Context) bool {
    bypassValue := ctx.Value(bypassKey)
    if bypassValue == nil {
        return false
    }
    bypass, isBool := bypassValue.(bool)
    return isBool && bypass
}

```

Now, anywhere where you want to use `SendCoins` or `InputOutputCoins`, but you don't want your send restriction applied:

```codeBlockLines_e6Vv
func (k Keeper) DoThing(ctx context.Context, fromAddr, toAddr sdk.AccAddress, amt sdk.Coins) error {
    return k.bankKeeper.SendCoins(mymodule.WithBypass(ctx), fromAddr, toAddr, amt)
}

```

#### ViewKeeper [​](https://docs.cosmos.network/v0.50/build/modules/bank#viewkeeper "Direct link to ViewKeeper")

The view keeper provides read-only access to account balances. The view keeper does not have balance alteration functionality. All balance lookups are `O(1)`.

```codeBlockLines_e6Vv
// ViewKeeper defines a module interface that facilitates read only access to
// account balances.
type ViewKeeper interface {
    ValidateBalance(ctx context.Context, addr sdk.AccAddress) error
    HasBalance(ctx context.Context, addr sdk.AccAddress, amt sdk.Coin) bool

    GetAllBalances(ctx context.Context, addr sdk.AccAddress) sdk.Coins
    GetAccountsBalances(ctx context.Context) []types.Balance
    GetBalance(ctx context.Context, addr sdk.AccAddress, denom string) sdk.Coin
    LockedCoins(ctx context.Context, addr sdk.AccAddress) sdk.Coins
    SpendableCoins(ctx context.Context, addr sdk.AccAddress) sdk.Coins
    SpendableCoin(ctx context.Context, addr sdk.AccAddress, denom string) sdk.Coin

    IterateAccountBalances(ctx context.Context, addr sdk.AccAddress, cb func(coin sdk.Coin) (stop bool))
    IterateAllBalances(ctx context.Context, cb func(address sdk.AccAddress, coin sdk.Coin) (stop bool))
}

```

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/bank#messages "Direct link to Messages")

#### MsgSend [​](https://docs.cosmos.network/v0.50/build/modules/bank#msgsend "Direct link to MsgSend")

Send coins from one address to another.

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgSend represents a message to send coins from one account to another.
message MsgSend {
  option (cosmos.msg.v1.signer) = "from_address";
  option (amino.name)           = "cosmos-sdk/MsgSend";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  string   from_address                    = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string   to_address                      = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  repeated cosmos.base.v1beta1.Coin amount = 3 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/bank/v1beta1/tx.proto#L38-L53)

The message will fail under the following conditions:

- The coins do not have sending enabled
- The `to` address is restricted

#### MsgMultiSend [​](https://docs.cosmos.network/v0.50/build/modules/bank#msgmultisend "Direct link to MsgMultiSend")

Send coins from one sender and to a series of different address. If any of the receiving addresses do not correspond to an existing account, a new account is created.

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgMultiSend represents an arbitrary multi-in, multi-out send message.
message MsgMultiSend {
  option (cosmos.msg.v1.signer) = "inputs";
  option (amino.name)           = "cosmos-sdk/MsgMultiSend";

  option (gogoproto.equal) = false;

  // Inputs, despite being `repeated`, only allows one sender input. This is
  // checked in MsgMultiSend's ValidateBasic.
  repeated Input  inputs  = 1 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  repeated Output outputs = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/bank/v1beta1/tx.proto#L58-L69)

The message will fail under the following conditions:

- Any of the coins do not have sending enabled
- Any of the `to` addresses are restricted
- Any of the coins are locked
- The inputs and outputs do not correctly correspond to one another

#### MsgUpdateParams [​](https://docs.cosmos.network/v0.50/build/modules/bank#msgupdateparams "Direct link to MsgUpdateParams")

The `bank` module params can be updated through `MsgUpdateParams`, which can be done using governance proposal. The signer will always be the `gov` module account address.

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateParams is the Msg/UpdateParams request type.
//
// Since: cosmos-sdk 0.47
message MsgUpdateParams {
  option (cosmos.msg.v1.signer) = "authority";

  // authority is the address that controls the module (defaults to x/gov unless overwritten).
  string authority    = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  option (amino.name) = "cosmos-sdk/x/bank/MsgUpdateParams";

  // params defines the x/bank parameters to update.
  //
  // NOTE: All parameters must be supplied.
  Params params = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/bank/v1beta1/tx.proto#L74-L88)

The message handling can fail if:

- signer is not the gov module account address.

#### MsgSetSendEnabled [​](https://docs.cosmos.network/v0.50/build/modules/bank#msgsetsendenabled "Direct link to MsgSetSendEnabled")

Used with the x/gov module to set create/edit SendEnabled entries.

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgSetSendEnabled is the Msg/SetSendEnabled request type.
//
// Only entries to add/update/delete need to be included.
// Existing SendEnabled entries that are not included in this
// message are left unchanged.
//
// Since: cosmos-sdk 0.47
message MsgSetSendEnabled {
  option (cosmos.msg.v1.signer) = "authority";
  option (amino.name)           = "cosmos-sdk/MsgSetSendEnabled";

  string authority = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // send_enabled is the list of entries to add or update.
  repeated SendEnabled send_enabled = 2;

  // use_default_for is a list of denoms that should use the params.default_send_enabled value.
  // Denoms listed here will have their SendEnabled entries deleted.
  // If a denom is included that doesn't have a SendEnabled entry,
  // it will be ignored.
  repeated string use_default_for = 3;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/bank/v1beta1/tx.proto#L96-L117)

The message will fail under the following conditions:

- The authority is not a bech32 address.
- The authority is not x/gov module's address.
- There are multiple SendEnabled entries with the same Denom.
- One or more SendEnabled entries has an invalid Denom.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/bank#events "Direct link to Events")

The bank module emits the following events:

#### Message Events [​](https://docs.cosmos.network/v0.50/build/modules/bank#message-events "Direct link to Message Events")

##### MsgSend [​](https://docs.cosmos.network/v0.50/build/modules/bank#msgsend-1 "Direct link to MsgSend")

| Type     | Attribute Key | Attribute Value    |
| -------- | ------------- | ------------------ |
| transfer | recipient     | {recipientAddress} |
| transfer | amount        | {amount}           |
| message  | module        | bank               |
| message  | action        | send               |
| message  | sender        | {senderAddress}    |

##### MsgMultiSend [​](https://docs.cosmos.network/v0.50/build/modules/bank#msgmultisend-1 "Direct link to MsgMultiSend")

| Type     | Attribute Key | Attribute Value    |
| -------- | ------------- | ------------------ |
| transfer | recipient     | {recipientAddress} |
| transfer | amount        | {amount}           |
| message  | module        | bank               |
| message  | action        | multisend          |
| message  | sender        | {senderAddress}    |

#### Keeper Events [​](https://docs.cosmos.network/v0.50/build/modules/bank#keeper-events "Direct link to Keeper Events")

In addition to message events, the bank keeper will produce events when the following methods are called (or any method which ends up calling them)

##### MintCoins [​](https://docs.cosmos.network/v0.50/build/modules/bank#mintcoins "Direct link to MintCoins")

```codeBlockLines_e6Vv
{
  "type": "coinbase",
  "attributes": [\
    {\
      "key": "minter",\
      "value": "{{sdk.AccAddress of the module minting coins}}",\
      "index": true\
    },\
    {\
      "key": "amount",\
      "value": "{{sdk.Coins being minted}}",\
      "index": true\
    }\
  ]
}

```

```codeBlockLines_e6Vv
{
  "type": "coin_received",
  "attributes": [\
    {\
      "key": "receiver",\
      "value": "{{sdk.AccAddress of the module minting coins}}",\
      "index": true\
    },\
    {\
      "key": "amount",\
      "value": "{{sdk.Coins being received}}",\
      "index": true\
    }\
  ]
}

```

##### BurnCoins [​](https://docs.cosmos.network/v0.50/build/modules/bank#burncoins "Direct link to BurnCoins")

```codeBlockLines_e6Vv
{
  "type": "burn",
  "attributes": [\
    {\
      "key": "burner",\
      "value": "{{sdk.AccAddress of the module burning coins}}",\
      "index": true\
    },\
    {\
      "key": "amount",\
      "value": "{{sdk.Coins being burned}}",\
      "index": true\
    }\
  ]
}

```

```codeBlockLines_e6Vv
{
  "type": "coin_spent",
  "attributes": [\
    {\
      "key": "spender",\
      "value": "{{sdk.AccAddress of the module burning coins}}",\
      "index": true\
    },\
    {\
      "key": "amount",\
      "value": "{{sdk.Coins being burned}}",\
      "index": true\
    }\
  ]
}

```

##### addCoins [​](https://docs.cosmos.network/v0.50/build/modules/bank#addcoins "Direct link to addCoins")

```codeBlockLines_e6Vv
{
  "type": "coin_received",
  "attributes": [\
    {\
      "key": "receiver",\
      "value": "{{sdk.AccAddress of the address beneficiary of the coins}}",\
      "index": true\
    },\
    {\
      "key": "amount",\
      "value": "{{sdk.Coins being received}}",\
      "index": true\
    }\
  ]
}

```

##### subUnlockedCoins/DelegateCoins [​](https://docs.cosmos.network/v0.50/build/modules/bank#subunlockedcoinsdelegatecoins "Direct link to subUnlockedCoins/DelegateCoins")

```codeBlockLines_e6Vv
{
  "type": "coin_spent",
  "attributes": [\
    {\
      "key": "spender",\
      "value": "{{sdk.AccAddress of the address which is spending coins}}",\
      "index": true\
    },\
    {\
      "key": "amount",\
      "value": "{{sdk.Coins being spent}}",\
      "index": true\
    }\
  ]
}

```

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/bank#parameters "Direct link to Parameters")

The bank module contains the following parameters

#### SendEnabled [​](https://docs.cosmos.network/v0.50/build/modules/bank#sendenabled "Direct link to SendEnabled")

The SendEnabled parameter is now deprecated and not to be use. It is replaced<br/>
with state store records.

#### DefaultSendEnabled [​](https://docs.cosmos.network/v0.50/build/modules/bank#defaultsendenabled "Direct link to DefaultSendEnabled")

The default send enabled value controls send transfer capability for all<br/>
coin denominations unless specifically included in the array of `SendEnabled`<br/>
parameters.

### Client [​](https://docs.cosmos.network/v0.50/build/modules/bank#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/bank#cli "Direct link to CLI")

A user can query and interact with the `bank` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/bank#query "Direct link to Query")

The `query` commands allow users to query `bank` state.

```codeBlockLines_e6Vv
simd query bank --help

```

###### Balances [​](https://docs.cosmos.network/v0.50/build/modules/bank#balances "Direct link to balances")

The `balances` command allows users to query account balances by address.

```codeBlockLines_e6Vv
simd query bank balances [address] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query bank balances cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
balances:
- amount: "1000000000"
  denom: stake
pagination:
  next_key: null
  total: "0"

```

###### Denom-metadata [​](https://docs.cosmos.network/v0.50/build/modules/bank#denom-metadata "Direct link to denom-metadata")

The `denom-metadata` command allows users to query metadata for coin denominations. A user can query metadata for a single denomination using the `--denom` flag or all denominations without it.

```codeBlockLines_e6Vv
simd query bank denom-metadata [flags]

```

Example:

```codeBlockLines_e6Vv
simd query bank denom-metadata --denom stake

```

Example Output:

```codeBlockLines_e6Vv
metadata:
  base: stake
  denom_units:
  - aliases:
    - STAKE
    denom: stake
  description: native staking token of simulation app
  display: stake
  name: SimApp Token
  symbol: STK

```

###### Total [​](https://docs.cosmos.network/v0.50/build/modules/bank#total "Direct link to total")

The `total` command allows users to query the total supply of coins. A user can query the total supply for a single coin using the `--denom` flag or all coins without it.

```codeBlockLines_e6Vv
simd query bank total [flags]

```

Example:

```codeBlockLines_e6Vv
simd query bank total --denom stake

```

Example Output:

```codeBlockLines_e6Vv
amount: "10000000000"
denom: stake

```

###### Send-enabled [​](https://docs.cosmos.network/v0.50/build/modules/bank#send-enabled "Direct link to send-enabled")

The `send-enabled` command allows users to query for all or some SendEnabled entries.

```codeBlockLines_e6Vv
simd query bank send-enabled [denom1 ...] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query bank send-enabled

```

Example output:

```codeBlockLines_e6Vv
send_enabled:
- denom: foocoin
  enabled: true
- denom: barcoin
pagination:
  next-key: null
  total: 2

```

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/bank#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `bank` module.

```codeBlockLines_e6Vv
simd tx bank --help

```

###### Send [​](https://docs.cosmos.network/v0.50/build/modules/bank#send "Direct link to send")

The `send` command allows users to send funds from one account to another.

```codeBlockLines_e6Vv
simd tx bank send [from_key_or_address] [to_address] [amount] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx bank send cosmos1.. cosmos1.. 100stake

```

### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/bank#grpc "Direct link to gRPC")

A user can query the `bank` module using gRPC endpoints.

#### Balance [​](https://docs.cosmos.network/v0.50/build/modules/bank#balance "Direct link to Balance")

The `Balance` endpoint allows users to query account balance by address for a given denomination.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/Balance

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"address":"cosmos1..","denom":"stake"}' \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/Balance

```

Example Output:

```codeBlockLines_e6Vv
{
  "balance": {
    "denom": "stake",
    "amount": "1000000000"
  }
}

```

#### AllBalances [​](https://docs.cosmos.network/v0.50/build/modules/bank#allbalances "Direct link to AllBalances")

The `AllBalances` endpoint allows users to query account balance by address for all denominations.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/AllBalances

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"address":"cosmos1.."}' \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/AllBalances

```

Example Output:

```codeBlockLines_e6Vv
{
  "balances": [\
    {\
      "denom": "stake",\
      "amount": "1000000000"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

#### DenomMetadata [​](https://docs.cosmos.network/v0.50/build/modules/bank#denommetadata "Direct link to DenomMetadata")

The `DenomMetadata` endpoint allows users to query metadata for a single coin denomination.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/DenomMetadata

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"denom":"stake"}' \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/DenomMetadata

```

Example Output:

```codeBlockLines_e6Vv
{
  "metadata": {
    "description": "native staking token of simulation app",
    "denomUnits": [\
      {\
        "denom": "stake",\
        "aliases": [\
          "STAKE"\
        ]\
      }\
    ],
    "base": "stake",
    "display": "stake",
    "name": "SimApp Token",
    "symbol": "STK"
  }
}

```

#### DenomsMetadata [​](https://docs.cosmos.network/v0.50/build/modules/bank#denomsmetadata "Direct link to DenomsMetadata")

The `DenomsMetadata` endpoint allows users to query metadata for all coin denominations.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/DenomsMetadata

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/DenomsMetadata

```

Example Output:

```codeBlockLines_e6Vv
{
  "metadatas": [\
    {\
      "description": "native staking token of simulation app",\
      "denomUnits": [\
        {\
          "denom": "stake",\
          "aliases": [\
            "STAKE"\
          ]\
        }\
      ],\
      "base": "stake",\
      "display": "stake",\
      "name": "SimApp Token",\
      "symbol": "STK"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

#### DenomOwners [​](https://docs.cosmos.network/v0.50/build/modules/bank#denomowners "Direct link to DenomOwners")

The `DenomOwners` endpoint allows users to query metadata for a single coin denomination.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/DenomOwners

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"denom":"stake"}' \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/DenomOwners

```

Example Output:

```codeBlockLines_e6Vv
{
  "denomOwners": [\
    {\
      "address": "cosmos1..",\
      "balance": {\
        "denom": "stake",\
        "amount": "5000000000"\
      }\
    },\
    {\
      "address": "cosmos1..",\
      "balance": {\
        "denom": "stake",\
        "amount": "5000000000"\
      }\
    },\
  ],
  "pagination": {
    "total": "2"
  }
}

```

#### TotalSupply [​](https://docs.cosmos.network/v0.50/build/modules/bank#totalsupply "Direct link to TotalSupply")

The `TotalSupply` endpoint allows users to query the total supply of all coins.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/TotalSupply

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/TotalSupply

```

Example Output:

```codeBlockLines_e6Vv
{
  "supply": [\
    {\
      "denom": "stake",\
      "amount": "10000000000"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

#### SupplyOf [​](https://docs.cosmos.network/v0.50/build/modules/bank#supplyof "Direct link to SupplyOf")

The `SupplyOf` endpoint allows users to query the total supply of a single coin.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/SupplyOf

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"denom":"stake"}' \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/SupplyOf

```

Example Output:

```codeBlockLines_e6Vv
{
  "amount": {
    "denom": "stake",
    "amount": "10000000000"
  }
}

```

#### Params [​](https://docs.cosmos.network/v0.50/build/modules/bank#params-1 "Direct link to Params")

The `Params` endpoint allows users to query the parameters of the `bank` module.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/Params

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/Params

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "defaultSendEnabled": true
  }
}

```

#### SendEnabled [​](https://docs.cosmos.network/v0.50/build/modules/bank#sendenabled-1 "Direct link to SendEnabled")

The `SendEnabled` endpoints allows users to query the SendEnabled entries of the `bank` module.

Any denominations NOT returned, use the `Params.DefaultSendEnabled` value.

```codeBlockLines_e6Vv
cosmos.bank.v1beta1.Query/SendEnabled

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.bank.v1beta1.Query/SendEnabled

```

Example Output:

```codeBlockLines_e6Vv
{
  "send_enabled": [\
    {\
      "denom": "foocoin",\
      "enabled": true\
    },\
    {\
      "denom": "barcoin"\
    }\
  ],
  "pagination": {
    "next-key": null,
    "total": 2
  }
}

```

---

## `x/circuit`

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/circuit#concepts "Direct link to Concepts")

Circuit Breaker is a module that is meant to avoid a chain needing to halt/shut down in the presence of a vulnerability, instead the module will allow specific messages or all messages to be disabled. When operating a chain, if it is app specific then a halt of the chain is less detrimental, but if there are applications built on top of the chain then halting is expensive due to the disturbance to applications.

Circuit Breaker works with the idea that an address or set of addresses have the right to block messages from being executed and/or included in the mempool. Any address with a permission is able to reset the circuit breaker for the message.

The transactions are checked and can be rejected at two points:

- In `CircuitBreakerDecorator` [ante handler](https://docs.cosmos.network/main/learn/advanced/baseapp#antehandler):

circuit/v0.1.0/x/circuit/ante/circuit.go

```codeBlockLines_e6Vv
func (cbd CircuitBreakerDecorator) AnteHandle(ctx sdk.Context, tx sdk.Tx, simulate bool, next sdk.AnteHandler) (sdk.Context, error) {
	// loop through all the messages and check if the message type is allowed
	for _, msg := range tx.GetMsgs() {
		isAllowed, err := cbd.circuitKeeper.IsAllowed(ctx, sdk.MsgTypeURL(msg))
		if err != nil {
			return ctx, err
		}

		if !isAllowed {
			return ctx, errors.New("tx type not allowed")
		}
	}

	return next(ctx, tx, simulate)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/x/circuit/v0.1.0/x/circuit/ante/circuit.go#L27-L41)

- With a [message router check](https://docs.cosmos.network/main/learn/advanced/baseapp#msg-service-router):

baseapp/msg_service_router.go

```codeBlockLines_e6Vv
// decorate the hybrid handler with the circuit breaker
circuitBreakerHybridHandler := func(ctx context.Context, req, resp protoiface.MessageV1) error {
	messageName := codectypes.MsgTypeURL(req)
	allowed, err := msr.circuitBreaker.IsAllowed(ctx, messageName)
	if err != nil {
		return err
	}
	if !allowed {
		return fmt.Errorf("circuit breaker disallows execution of message %s", messageName)
	}
	return hybridHandler(ctx, req, resp)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.1/baseapp/msg_service_router.go#L104-L115)

note

The `CircuitBreakerDecorator` works for most use cases, but [does not check the inner messages of a transaction](https://docs.cosmos.network/main/learn/beginner/tx-lifecycle#antehandler). This some transactions (such as `x/authz` transactions or some `x/gov` transactions) may pass the ante handler. **This does not affect the circuit breaker** as the message router check will still fail the transaction.<br/>
This tradeoff is to avoid introducing more dependencies in the `x/circuit` module. Chains can re-define the `CircuitBreakerDecorator` to check for inner messages if they wish to do so.

### State [​](https://docs.cosmos.network/v0.50/build/modules/circuit#state "Direct link to State")

#### Accounts [​](https://docs.cosmos.network/v0.50/build/modules/circuit#accounts "Direct link to Accounts")

- AccountPermissions `0x1 | account_address  -> ProtocolBuffer(CircuitBreakerPermissions)`

```codeBlockLines_e6Vv
type level int32

const (
    // LEVEL_NONE_UNSPECIFIED indicates that the account will have no circuit
    // breaker permissions.
    LEVEL_NONE_UNSPECIFIED = iota
    // LEVEL_SOME_MSGS indicates that the account will have permission to
    // trip or reset the circuit breaker for some Msg type URLs. If this level
    // is chosen, a non-empty list of Msg type URLs must be provided in
    // limit_type_urls.
    LEVEL_SOME_MSGS
    // LEVEL_ALL_MSGS indicates that the account can trip or reset the circuit
    // breaker for Msg's of all type URLs.
    LEVEL_ALL_MSGS
    // LEVEL_SUPER_ADMIN indicates that the account can take all circuit breaker
    // actions and can grant permissions to other accounts.
    LEVEL_SUPER_ADMIN
)

type Access struct {
    level int32
    msgs []string // if full permission, msgs can be empty
}

```

#### Disable List [​](https://docs.cosmos.network/v0.50/build/modules/circuit#disable-list "Direct link to Disable List")

List of type urls that are disabled.

- DisableList `0x2 | msg_type_url -> []byte{}`

### State Transitions [​](https://docs.cosmos.network/v0.50/build/modules/circuit#state-transitions "Direct link to State Transitions")

#### Authorize [​](https://docs.cosmos.network/v0.50/build/modules/circuit#authorize "Direct link to Authorize")

Authorize, is called by the module authority (default governance module account) or any account with `LEVEL_SUPER_ADMIN` to give permission to disable/enable messages to another account. There are three levels of permissions that can be granted. `LEVEL_SOME_MSGS` limits the number of messages that can be disabled. `LEVEL_ALL_MSGS` permits all messages to be disabled. `LEVEL_SUPER_ADMIN` allows an account to take all circuit breaker actions including authorizing and deauthorizing other accounts.

```codeBlockLines_e6Vv
  // AuthorizeCircuitBreaker allows a super-admin to grant (or revoke) another
  // account's circuit breaker permissions.
  rpc AuthorizeCircuitBreaker(MsgAuthorizeCircuitBreaker) returns (MsgAuthorizeCircuitBreakerResponse);

```

#### Trip [​](https://docs.cosmos.network/v0.50/build/modules/circuit#trip "Direct link to Trip")

Trip, is called by an authorized account to disable message execution for a specific msgURL. If empty, all the msgs will be disabled.

```codeBlockLines_e6Vv
  // TripCircuitBreaker pauses processing of Msg's in the state machine.
  rpc TripCircuitBreaker(MsgTripCircuitBreaker) returns (MsgTripCircuitBreakerResponse);

```

#### Reset [​](https://docs.cosmos.network/v0.50/build/modules/circuit#reset "Direct link to Reset")

Reset is called by an authorized account to enable execution for a specific msgURL of previously disabled message. If empty, all the disabled messages will be enabled.

```codeBlockLines_e6Vv
  // ResetCircuitBreaker resumes processing of Msg's in the state machine that
  // have been been paused using TripCircuitBreaker.
  rpc ResetCircuitBreaker(MsgResetCircuitBreaker) returns (MsgResetCircuitBreakerResponse);

```

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/circuit#messages "Direct link to Messages")

#### MsgAuthorizeCircuitBreaker [​](https://docs.cosmos.network/v0.50/build/modules/circuit#msgauthorizecircuitbreaker "Direct link to MsgAuthorizeCircuitBreaker")

proto/cosmos/circuit/v1/tx.proto

```codeBlockLines_e6Vv
loading...

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/cosmos/circuit/v1/tx.proto#L25-L75)

This message is expected to fail if:

- the granter is not an account with permission level `LEVEL_SUPER_ADMIN` or the module authority

#### MsgTripCircuitBreaker [​](https://docs.cosmos.network/v0.50/build/modules/circuit#msgtripcircuitbreaker "Direct link to MsgTripCircuitBreaker")

proto/cosmos/circuit/v1/tx.proto

```codeBlockLines_e6Vv
loading...

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/cosmos/circuit/v1/tx.proto#L77-L93)

This message is expected to fail if:

- if the signer does not have a permission level with the ability to disable the specified type url message

#### MsgResetCircuitBreaker [​](https://docs.cosmos.network/v0.50/build/modules/circuit#msgresetcircuitbreaker "Direct link to MsgResetCircuitBreaker")

proto/cosmos/circuit/v1/tx.proto

```codeBlockLines_e6Vv
loading...

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/cosmos/circuit/v1/tx.proto#L95-109)

This message is expected to fail if:

- if the type url is not disabled

### Events - List and Describe Event Tags [​](https://docs.cosmos.network/v0.50/build/modules/circuit#events---list-and-describe-event-tags "Direct link to Events - list and describe event tags")

The circuit module emits the following events:

#### Message Events [​](https://docs.cosmos.network/v0.50/build/modules/circuit#message-events "Direct link to Message Events")

##### MsgAuthorizeCircuitBreaker [​](https://docs.cosmos.network/v0.50/build/modules/circuit#msgauthorizecircuitbreaker-1 "Direct link to MsgAuthorizeCircuitBreaker")

| Type    | Attribute Key | Attribute Value           |
| ------- | ------------- | ------------------------- |
| string  | granter       | {granterAddress}          |
| string  | grantee       | {granteeAddress}          |
| string  | permission    | {granteePermissions}      |
| message | module        | circuit                   |
| message | action        | authorize_circuit_breaker |

##### MsgTripCircuitBreaker [​](https://docs.cosmos.network/v0.50/build/modules/circuit#msgtripcircuitbreaker-1 "Direct link to MsgTripCircuitBreaker")

| Type       | Attribute Key | Attribute Value      |
| ---------- | ------------- | -------------------- |
| string     | authority     | {authorityAddress}   |
| \[\]string | msg_urls      | \[\]string{msg_urls} |
| message    | module        | circuit              |
| message    | action        | trip_circuit_breaker |

##### ResetCircuitBreaker [​](https://docs.cosmos.network/v0.50/build/modules/circuit#resetcircuitbreaker "Direct link to ResetCircuitBreaker")

| Type       | Attribute Key | Attribute Value       |
| ---------- | ------------- | --------------------- |
| string     | authority     | {authorityAddress}    |
| \[\]string | msg_urls      | \[\]string{msg_urls}  |
| message    | module        | circuit               |
| message    | action        | reset_circuit_breaker |

### Keys - List of Key Prefixes Used by the Circuit Module [​](https://docs.cosmos.network/v0.50/build/modules/circuit#keys---list-of-key-prefixes-used-by-the-circuit-module "Direct link to Keys - list of key prefixes used by the circuit module")

- `AccountPermissionPrefix` \- `0x01`
- `DisableListPrefix` \- `0x02`

#### Crisis

## `x/crisis`

### Overview [​](https://docs.cosmos.network/v0.50/build/modules/crisis#overview "Direct link to Overview")

The crisis module halts the blockchain under the circumstance that a blockchain<br/>
invariant is broken. Invariants can be registered with the application during the<br/>
application initialization process.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/crisis#contents "Direct link to Contents")

- [State](https://docs.cosmos.network/v0.50/build/modules/crisis#state)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/crisis#messages)
- [Events](https://docs.cosmos.network/v0.50/build/modules/crisis#events)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/crisis#parameters)
- [Client](https://docs.cosmos.network/v0.50/build/modules/crisis#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/crisis#cli)

### State [​](https://docs.cosmos.network/v0.50/build/modules/crisis#state "Direct link to State")

#### ConstantFee [​](https://docs.cosmos.network/v0.50/build/modules/crisis#constantfee "Direct link to ConstantFee")

Due to the anticipated large gas cost requirement to verify an invariant (and<br/>
potential to exceed the maximum allowable block gas limit) a constant fee is<br/>
used instead of the standard gas consumption method. The constant fee is<br/>
intended to be larger than the anticipated gas cost of running the invariant<br/>
with the standard gas consumption method.

The ConstantFee param is stored in the module params state with the prefix of `0x01`,<br/>
it can be updated with governance or the address with authority.

- Params: `mint/params -> legacy_amino(sdk.Coin)`

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/crisis#messages "Direct link to Messages")

In this section we describe the processing of the crisis messages and the<br/>
corresponding updates to the state.

#### MsgVerifyInvariant [​](https://docs.cosmos.network/v0.50/build/modules/crisis#msgverifyinvariant "Direct link to MsgVerifyInvariant")

Blockchain invariants can be checked using the `MsgVerifyInvariant` message.

proto/cosmos/crisis/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgVerifyInvariant represents a message to verify a particular invariance.
message MsgVerifyInvariant {
  option (cosmos.msg.v1.signer) = "sender";
  option (amino.name)           = "cosmos-sdk/MsgVerifyInvariant";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  // sender is the account address of private key to send coins to fee collector account.
  string sender = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // name of the invariant module.
  string invariant_module_name = 2;

  // invariant_route is the msg's invariant route.
  string invariant_route = 3;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/crisis/v1beta1/tx.proto#L26-L42)

This message is expected to fail if:

- the sender does not have enough coins for the constant fee
- the invariant route is not registered

This message checks the invariant provided, and if the invariant is broken it<br/>
panics, halting the blockchain. If the invariant is broken, the constant fee is<br/>
never deducted as the transaction is never committed to a block (equivalent to<br/>
being refunded). However, if the invariant is not broken, the constant fee will<br/>
not be refunded.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/crisis#events "Direct link to Events")

The crisis module emits the following events:

#### Handlers [​](https://docs.cosmos.network/v0.50/build/modules/crisis#handlers "Direct link to Handlers")

##### MsgVerifyInvariance [​](https://docs.cosmos.network/v0.50/build/modules/crisis#msgverifyinvariance "Direct link to MsgVerifyInvariance")

| Type      | Attribute Key | Attribute Value  |
| --------- | ------------- | ---------------- |
| invariant | route         | {invariantRoute} |
| message   | module        | crisis           |
| message   | action        | verify_invariant |
| message   | sender        | {senderAddress}  |

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/crisis#parameters "Direct link to Parameters")

The crisis module contains the following parameters:

| Key         | Type          | Example                           |
| ----------- | ------------- | --------------------------------- |
| ConstantFee | object (coin) | {"denom":"uatom","amount":"1000"} |

### Client [​](https://docs.cosmos.network/v0.50/build/modules/crisis#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/crisis#cli "Direct link to CLI")

A user can query and interact with the `crisis` module using the CLI.

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/crisis#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `crisis` module.

```codeBlockLines_e6Vv
simd tx crisis --help

```

###### Invariant-broken [​](https://docs.cosmos.network/v0.50/build/modules/crisis#invariant-broken "Direct link to invariant-broken")

The `invariant-broken` command submits proof when an invariant was broken to halt the chain

```codeBlockLines_e6Vv
simd tx crisis invariant-broken [module-name] [invariant-route] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx crisis invariant-broken bank total-supply --from=[keyname or address]

```

---

## `x/distribution`

### Overview [​](https://docs.cosmos.network/v0.50/build/modules/distribution#overview "Direct link to Overview")

This _simple_ distribution mechanism describes a functional way to passively<br/>
distribute rewards between validators and delegators. Note that this mechanism does<br/>
not distribute funds in as precisely as active reward distribution mechanisms and<br/>
will therefore be upgraded in the future.

The mechanism operates as follows. Collected rewards are pooled globally and<br/>
divided out passively to validators and delegators. Each validator has the<br/>
opportunity to charge commission to the delegators on the rewards collected on<br/>
behalf of the delegators. Fees are collected directly into a global reward pool<br/>
and validator proposer-reward pool. Due to the nature of passive accounting,<br/>
whenever changes to parameters which affect the rate of reward distribution<br/>
occurs, withdrawal of rewards must also occur.

- Whenever withdrawing, one must withdraw the maximum amount they are entitled<br/>
  to, leaving nothing in the pool.
- Whenever bonding, unbonding, or re-delegating tokens to an existing account, a<br/>
  full withdrawal of the rewards must occur (as the rules for lazy accounting<br/>
  change).
- Whenever a validator chooses to change the commission on rewards, all accumulated<br/>
  commission rewards must be simultaneously withdrawn.

The above scenarios are covered in `hooks.md`.

The distribution mechanism outlined herein is used to lazily distribute the<br/>
following rewards between validators and associated delegators:

- multi-token fees to be socially distributed
- inflated staked asset provisions
- validator commission on all rewards earned by their delegators stake

Fees are pooled within a global pool. The mechanisms used allow for validators<br/>
and delegators to independently and lazily withdraw their rewards.

### Shortcomings [​](https://docs.cosmos.network/v0.50/build/modules/distribution#shortcomings "Direct link to Shortcomings")

As a part of the lazy computations, each delegator holds an accumulation term<br/>
specific to each validator which is used to estimate what their approximate<br/>
fair portion of tokens held in the global fee pool is owed to them.

```codeBlockLines_e6Vv
entitlement = delegator-accumulation / all-delegators-accumulation

```

Under the circumstance that there was constant and equal flow of incoming<br/>
reward tokens every block, this distribution mechanism would be equal to the<br/>
active distribution (distribute individually to all delegators each block).<br/>
However, this is unrealistic so deviations from the active distribution will<br/>
occur based on fluctuations of incoming reward tokens as well as timing of<br/>
reward withdrawal by other delegators.

If you happen to know that incoming rewards are about to significantly increase,<br/>
you are incentivized to not withdraw until after this event, increasing the<br/>
worth of your existing _accum_. See [#2764](https://github.com/cosmos/cosmos-sdk/issues/2764)<br/>
for further details.

### Effect on Staking [​](https://docs.cosmos.network/v0.50/build/modules/distribution#effect-on-staking "Direct link to Effect on Staking")

Charging commission on Atom provisions while also allowing for Atom-provisions<br/>
to be auto-bonded (distributed directly to the validators bonded stake) is<br/>
problematic within BPoS. Fundamentally, these two mechanisms are mutually<br/>
exclusive. If both commission and auto-bonding mechanisms are simultaneously<br/>
applied to the staking-token then the distribution of staking-tokens between<br/>
any validator and its delegators will change with each block. This then<br/>
necessitates a calculation for each delegation records for each block -<br/>
which is considered computationally expensive.

In conclusion, we can only have Atom commission and unbonded atoms<br/>
provisions or bonded atom provisions with no Atom commission, and we elect to<br/>
implement the former. Stakeholders wishing to rebond their provisions may elect<br/>
to set up a script to periodically withdraw and rebond rewards.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/distribution#contents "Direct link to Contents")

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/distribution#concepts)
- [State](https://docs.cosmos.network/v0.50/build/modules/distribution#state)
  - [FeePool](https://docs.cosmos.network/v0.50/build/modules/distribution#feepool)
  - [Validator Distribution](https://docs.cosmos.network/v0.50/build/modules/distribution#validator-distribution)
  - [Delegation Distribution](https://docs.cosmos.network/v0.50/build/modules/distribution#delegation-distribution)
  - [Params](https://docs.cosmos.network/v0.50/build/modules/distribution#params)
- [Begin Block](https://docs.cosmos.network/v0.50/build/modules/distribution#begin-block)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/distribution#messages)
- [Hooks](https://docs.cosmos.network/v0.50/build/modules/distribution#hooks)
- [Events](https://docs.cosmos.network/v0.50/build/modules/distribution#events)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/distribution#parameters)
- [Client](https://docs.cosmos.network/v0.50/build/modules/distribution#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/distribution#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/distribution#grpc)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/distribution#concepts "Direct link to Concepts")

In Proof of Stake (PoS) blockchains, rewards gained from transaction fees are paid to validators. The fee distribution module fairly distributes the rewards to the validators' constituent delegators.

Rewards are calculated per period. The period is updated each time a validator's delegation changes, for example, when the validator receives a new delegation.<br/>
The rewards for a single validator can then be calculated by taking the total rewards for the period before the delegation started, minus the current total rewards.<br/>
To learn more, see the [F1 Fee Distribution paper](https://github.com/cosmos/cosmos-sdk/tree/main/docs/spec/fee_distribution/f1_fee_distr.pdf).

The commission to the validator is paid when the validator is removed or when the validator requests a withdrawal.<br/>
The commission is calculated and incremented at every `BeginBlock` operation to update accumulated fee amounts.

The rewards to a delegator are distributed when the delegation is changed or removed, or a withdrawal is requested.<br/>
Before rewards are distributed, all slashes to the validator that occurred during the current delegation are applied.

#### Reference Counting in F1 Fee Distribution [​](https://docs.cosmos.network/v0.50/build/modules/distribution#reference-counting-in-f1-fee-distribution "Direct link to Reference Counting in F1 Fee Distribution")

In F1 fee distribution, the rewards a delegator receives are calculated when their delegation is withdrawn. This calculation must read the terms of the summation of rewards divided by the share of tokens from the period which they ended when they delegated, and the final period that was created for the withdrawal.

Additionally, as slashes change the amount of tokens a delegation will have (but we calculate this lazily,<br/>
only when a delegator un-delegates), we must calculate rewards in separate periods before / after any slashes<br/>
which occurred in between when a delegator delegated and when they withdrew their rewards. Thus slashes, like<br/>
delegations, reference the period which was ended by the slash event.

All stored historical rewards records for periods which are no longer referenced by any delegations<br/>
or any slashes can thus be safely removed, as they will never be read (future delegations and future<br/>
slashes will always reference future periods). This is implemented by tracking a `ReferenceCount`<br/>
along with each historical reward storage entry. Each time a new object (delegation or slash)<br/>
is created which might need to reference the historical record, the reference count is incremented.<br/>
Each time one object which previously needed to reference the historical record is deleted, the reference<br/>
count is decremented. If the reference count hits zero, the historical record is deleted.

### State [​](https://docs.cosmos.network/v0.50/build/modules/distribution#state "Direct link to State")

#### FeePool [​](https://docs.cosmos.network/v0.50/build/modules/distribution#feepool "Direct link to FeePool")

All globally tracked parameters for distribution are stored within<br/>
`FeePool`. Rewards are collected and added to the reward pool and<br/>
distributed to validators/delegators from here.

Note that the reward pool holds decimal coins (`DecCoins`) to allow<br/>
for fractions of coins to be received from operations like inflation.<br/>
When coins are distributed from the pool they are truncated back to<br/>
`sdk.Coins` which are non-decimal.

- FeePool: `0x00 -> ProtocolBuffer(FeePool)`

```codeBlockLines_e6Vv
// coins with decimal
type DecCoins []DecCoin

type DecCoin struct {
    Amount math.LegacyDec
    Denom  string
}

```

proto/cosmos/distribution/v1beta1/distribution.proto

```codeBlockLines_e6Vv
// FeePool is the global fee pool for distribution.
message FeePool {
  repeated cosmos.base.v1beta1.DecCoin community_pool = 1 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.DecCoins"\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/distribution/v1beta1/distribution.proto#L116-L123)

#### Validator Distribution [​](https://docs.cosmos.network/v0.50/build/modules/distribution#validator-distribution "Direct link to Validator Distribution")

Validator distribution information for the relevant validator is updated each time:

1. delegation amount to a validator is updated,
2. any delegator withdraws from a validator, or
3. the validator withdraws its commission.

- ValidatorDistInfo: `0x02 | ValOperatorAddrLen (1 byte) | ValOperatorAddr -> ProtocolBuffer(validatorDistribution)`

```codeBlockLines_e6Vv
type ValidatorDistInfo struct {
    OperatorAddress     sdk.AccAddress
    SelfBondRewards     sdkmath.DecCoins
    ValidatorCommission types.ValidatorAccumulatedCommission
}

```

#### Delegation Distribution [​](https://docs.cosmos.network/v0.50/build/modules/distribution#delegation-distribution "Direct link to Delegation Distribution")

Each delegation distribution only needs to record the height at which it last<br/>
withdrew fees. Because a delegation must withdraw fees each time it's<br/>
properties change (aka bonded tokens etc.) its properties will remain constant<br/>
and the delegator's _accumulation_ factor can be calculated passively knowing<br/>
only the height of the last withdrawal and its current properties.

- DelegationDistInfo: `0x02 | DelegatorAddrLen (1 byte) | DelegatorAddr | ValOperatorAddrLen (1 byte) | ValOperatorAddr -> ProtocolBuffer(delegatorDist)`

```codeBlockLines_e6Vv
type DelegationDistInfo struct {
    WithdrawalHeight int64    // last time this delegation withdrew rewards
}

```

#### Params [​](https://docs.cosmos.network/v0.50/build/modules/distribution#params "Direct link to Params")

The distribution module stores it's params in state with the prefix of `0x09`,<br/>
it can be updated with governance or the address with authority.

- Params: `0x09 | ProtocolBuffer(Params)`

proto/cosmos/distribution/v1beta1/distribution.proto

```codeBlockLines_e6Vv
// Params defines the set of params for the distribution module.
message Params {
  option (amino.name)                 = "cosmos-sdk/x/distribution/Params";
  option (gogoproto.goproto_stringer) = false;

  string community_tax = 1 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];

  // Deprecated: The base_proposer_reward field is deprecated and is no longer used
  // in the x/distribution module's reward mechanism.
  string base_proposer_reward = 2 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false,\
    deprecated             = true\
  ];

  // Deprecated: The bonus_proposer_reward field is deprecated and is no longer used
  // in the x/distribution module's reward mechanism.
  string bonus_proposer_reward = 3 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false,\
    deprecated             = true\
  ];

  bool withdraw_addr_enabled = 4;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/distribution/v1beta1/distribution.proto#L12-L42)

### Begin Block [​](https://docs.cosmos.network/v0.50/build/modules/distribution#begin-block "Direct link to Begin Block")

At each `BeginBlock`, all fees received in the previous block are transferred to<br/>
the distribution `ModuleAccount` account. When a delegator or validator<br/>
withdraws their rewards, they are taken out of the `ModuleAccount`. During begin<br/>
block, the different claims on the fees collected are updated as follows:

- The reserve community tax is charged.
- The remainder is distributed proportionally by voting power to all bonded validators

#### The Distribution Scheme [​](https://docs.cosmos.network/v0.50/build/modules/distribution#the-distribution-scheme "Direct link to The Distribution Scheme")

See [params](https://docs.cosmos.network/v0.50/build/modules/distribution#params) for description of parameters.

Let `fees` be the total fees collected in the previous block, including<br/>
inflationary rewards to the stake. All fees are collected in a specific module<br/>
account during the block. During `BeginBlock`, they are sent to the<br/>
`"distribution"` `ModuleAccount`. No other sending of tokens occurs. Instead, the<br/>
rewards each account is entitled to are stored, and withdrawals can be triggered<br/>
through the messages `FundCommunityPool`, `WithdrawValidatorCommission` and<br/>
`WithdrawDelegatorReward`.

##### Reward to the Community Pool [​](https://docs.cosmos.network/v0.50/build/modules/distribution#reward-to-the-community-pool "Direct link to Reward to the Community Pool")

The community pool gets `community_tax * fees`, plus any remaining dust after<br/>
validators get their rewards that are always rounded down to the nearest<br/>
integer value.

##### Reward To the Validators [​](https://docs.cosmos.network/v0.50/build/modules/distribution#reward-to-the-validators "Direct link to Reward To the Validators")

The proposer receives no extra rewards. All fees are distributed among all the<br/>
bonded validators, including the proposer, in proportion to their consensus power.

```codeBlockLines_e6Vv
powFrac = validator power / total bonded validator power
voteMul = 1 - community_tax

```

All validators receive `fees * voteMul * powFrac`.

##### Rewards to Delegators [​](https://docs.cosmos.network/v0.50/build/modules/distribution#rewards-to-delegators "Direct link to Rewards to Delegators")

Each validator's rewards are distributed to its delegators. The validator also<br/>
has a self-delegation that is treated like a regular delegation in<br/>
distribution calculations.

The validator sets a commission rate. The commission rate is flexible, but each<br/>
validator sets a maximum rate and a maximum daily increase. These maximums cannot be exceeded and protect delegators from sudden increases of validator commission rates to prevent validators from taking all of the rewards.

The outstanding rewards that the operator is entitled to are stored in<br/>
`ValidatorAccumulatedCommission`, while the rewards the delegators are entitled<br/>
to are stored in `ValidatorCurrentRewards`. The [F1 fee distribution scheme](https://docs.cosmos.network/v0.50/build/modules/distribution#concepts) is used to calculate the rewards per delegator as they<br/>
withdraw or update their delegation, and is thus not handled in `BeginBlock`.

##### Example Distribution [​](https://docs.cosmos.network/v0.50/build/modules/distribution#example-distribution "Direct link to Example Distribution")

For this example distribution, the underlying consensus engine selects block proposers in<br/>
proportion to their power relative to the entire bonded power.

All validators are equally performant at including pre-commits in their proposed<br/>
blocks. Then hold `(pre_commits included) / (total bonded validator power)`<br/>
constant so that the amortized block reward for the validator is `(validator power / total bonded power) * (1 - community tax rate)` of<br/>
the total rewards. Consequently, the reward for a single delegator is:

```codeBlockLines_e6Vv
(delegator proportion of the validator power / validator power) * (validator power / total bonded power)
  * (1 - community tax rate) * (1 - validator commission rate)
= (delegator proportion of the validator power / total bonded power) * (1 -
community tax rate) * (1 - validator commission rate)

```

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/distribution#messages "Direct link to Messages")

#### MsgSetWithdrawAddress [​](https://docs.cosmos.network/v0.50/build/modules/distribution#msgsetwithdrawaddress "Direct link to MsgSetWithdrawAddress")

By default, the withdraw address is the delegator address. To change its withdraw address, a delegator must send a `MsgSetWithdrawAddress` message.<br/>
Changing the withdraw address is possible only if the parameter `WithdrawAddrEnabled` is set to `true`.

The withdraw address cannot be any of the module accounts. These accounts are blocked from being withdraw addresses by being added to the distribution keeper's `blockedAddrs` array at initialization.

Response:

proto/cosmos/distribution/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgSetWithdrawAddress sets the withdraw address for
// a delegator (or validator self-delegation).
message MsgSetWithdrawAddress {
  option (cosmos.msg.v1.signer) = "delegator_address";
  option (amino.name)           = "cosmos-sdk/MsgModifyWithdrawAddress";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  string delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string withdraw_address  = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/distribution/v1beta1/tx.proto#L49-L60)

```codeBlockLines_e6Vv
func (k Keeper) SetWithdrawAddr(ctx context.Context, delegatorAddr sdk.AccAddress, withdrawAddr sdk.AccAddress) error
    if k.blockedAddrs[withdrawAddr.String()] {
        fail with "`{withdrawAddr}` is not allowed to receive external funds"
    }

    if !k.GetWithdrawAddrEnabled(ctx) {
        fail with `ErrSetWithdrawAddrDisabled`
    }

    k.SetDelegatorWithdrawAddr(ctx, delegatorAddr, withdrawAddr)

```

#### MsgWithdrawDelegatorReward [​](https://docs.cosmos.network/v0.50/build/modules/distribution#msgwithdrawdelegatorreward "Direct link to MsgWithdrawDelegatorReward")

A delegator can withdraw its rewards.<br/>
Internally in the distribution module, this transaction simultaneously removes the previous delegation with associated rewards, the same as if the delegator simply started a new delegation of the same value.<br/>
The rewards are sent immediately from the distribution `ModuleAccount` to the withdraw address.<br/>
Any remainder (truncated decimals) are sent to the community pool.<br/>
The starting height of the delegation is set to the current validator period, and the reference count for the previous period is decremented.<br/>
The amount withdrawn is deducted from the `ValidatorOutstandingRewards` variable for the validator.

In the F1 distribution, the total rewards are calculated per validator period, and a delegator receives a piece of those rewards in proportion to their stake in the validator.<br/>
In basic F1, the total rewards that all the delegators are entitled to between to periods is calculated the following way.<br/>
Let `R(X)` be the total accumulated rewards up to period `X` divided by the tokens staked at that time. The delegator allocation is `R(X) * delegator_stake`.<br/>
Then the rewards for all the delegators for staking between periods `A` and `B` are `(R(B) - R(A)) * total stake`.<br/>
However, these calculated rewards don't account for slashing.

Taking the slashes into account requires iteration.<br/>
Let `F(X)` be the fraction a validator is to be slashed for a slashing event that happened at period `X`.<br/>
If the validator was slashed at periods `P1, …, PN`, where `A < P1`, `PN < B`, the distribution module calculates the individual delegator's rewards, `T(A, B)`, as follows:

```codeBlockLines_e6Vv
stake := initial stake
rewards := 0
previous := A
for P in P1, ..., PN`:
    rewards = (R(P) - previous) * stake
    stake = stake * F(P)
    previous = P
rewards = rewards + (R(B) - R(PN)) * stake

```

The historical rewards are calculated retroactively by playing back all the slashes and then attenuating the delegator's stake at each step.<br/>
The final calculated stake is equivalent to the actual staked coins in the delegation with a margin of error due to rounding errors.

Response:

proto/cosmos/distribution/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgWithdrawDelegatorReward represents delegation withdrawal to a delegator
// from a single validator.
message MsgWithdrawDelegatorReward {
  option (cosmos.msg.v1.signer) = "delegator_address";
  option (amino.name)           = "cosmos-sdk/MsgWithdrawDelegationReward";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  string delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/distribution/v1beta1/tx.proto#L66-L77)

#### WithdrawValidatorCommission [​](https://docs.cosmos.network/v0.50/build/modules/distribution#withdrawvalidatorcommission "Direct link to WithdrawValidatorCommission")

The validator can send the WithdrawValidatorCommission message to withdraw their accumulated commission.<br/>
The commission is calculated in every block during `BeginBlock`, so no iteration is required to withdraw.<br/>
The amount withdrawn is deducted from the `ValidatorOutstandingRewards` variable for the validator.<br/>
Only integer amounts can be sent. If the accumulated awards have decimals, the amount is truncated before the withdrawal is sent, and the remainder is left to be withdrawn later.

#### FundCommunityPool [​](https://docs.cosmos.network/v0.50/build/modules/distribution#fundcommunitypool "Direct link to FundCommunityPool")

This message sends coins directly from the sender to the community pool.

The transaction fails if the amount cannot be transferred from the sender to the distribution module account.

```codeBlockLines_e6Vv
func (k Keeper) FundCommunityPool(ctx context.Context, amount sdk.Coins, sender sdk.AccAddress) error {
  if err := k.bankKeeper.SendCoinsFromAccountToModule(ctx, sender, types.ModuleName, amount); err != nil {
    return err
  }

  feePool, err := k.FeePool.Get(ctx)
  if err != nil {
    return err
  }

  feePool.CommunityPool = feePool.CommunityPool.Add(sdk.NewDecCoinsFromCoins(amount...)...)

  if err := k.FeePool.Set(ctx, feePool); err != nil {
    return err
  }

  return nil
}

```

#### Common Distribution Operations [​](https://docs.cosmos.network/v0.50/build/modules/distribution#common-distribution-operations "Direct link to Common distribution operations")

These operations take place during many different messages.

##### Initialize Delegation [​](https://docs.cosmos.network/v0.50/build/modules/distribution#initialize-delegation "Direct link to Initialize delegation")

Each time a delegation is changed, the rewards are withdrawn and the delegation is reinitialized.<br/>
Initializing a delegation increments the validator period and keeps track of the starting period of the delegation.

```codeBlockLines_e6Vv
// initialize starting info for a new delegation
func (k Keeper) initializeDelegation(ctx context.Context, val sdk.ValAddress, del sdk.AccAddress) {
    // period has already been incremented - we want to store the period ended by this delegation action
    previousPeriod := k.GetValidatorCurrentRewards(ctx, val).Period - 1

    // increment reference count for the period we're going to track
    k.incrementReferenceCount(ctx, val, previousPeriod)

    validator := k.stakingKeeper.Validator(ctx, val)
    delegation := k.stakingKeeper.Delegation(ctx, del, val)

    // calculate delegation stake in tokens
    // we don't store directly, so multiply delegation shares * (tokens per share)
    // note: necessary to truncate so we don't allow withdrawing more rewards than owed
    stake := validator.TokensFromSharesTruncated(delegation.GetShares())
    k.SetDelegatorStartingInfo(ctx, val, del, types.NewDelegatorStartingInfo(previousPeriod, stake, uint64(ctx.BlockHeight())))
}

```

#### MsgUpdateParams [​](https://docs.cosmos.network/v0.50/build/modules/distribution#msgupdateparams "Direct link to MsgUpdateParams")

Distribution module params can be updated through `MsgUpdateParams`, which can be done using governance proposal and the signer will always be gov module account address.

proto/cosmos/distribution/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateParams is the Msg/UpdateParams request type.
//
// Since: cosmos-sdk 0.47
message MsgUpdateParams {
  option (cosmos.msg.v1.signer) = "authority";
  option (amino.name)           = "cosmos-sdk/distribution/MsgUpdateParams";

  // authority is the address that controls the module (defaults to x/gov unless overwritten).
  string authority = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // params defines the x/distribution parameters to update.
  //
  // NOTE: All parameters must be supplied.
  Params params = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/distribution/v1beta1/tx.proto#L133-L147)

The message handling can fail if:

- signer is not the gov module account address.

### Hooks [​](https://docs.cosmos.network/v0.50/build/modules/distribution#hooks "Direct link to Hooks")

Available hooks that can be called by and from this module.

#### Create or Modify Delegation Distribution [​](https://docs.cosmos.network/v0.50/build/modules/distribution#create-or-modify-delegation-distribution "Direct link to Create or modify delegation distribution")

- triggered-by: `staking.MsgDelegate`, `staking.MsgBeginRedelegate`, `staking.MsgUndelegate`

##### Before [​](https://docs.cosmos.network/v0.50/build/modules/distribution#before "Direct link to Before")

- The delegation rewards are withdrawn to the withdraw address of the delegator.<br/>
  The rewards include the current period and exclude the starting period.
- The validator period is incremented.<br/>
  The validator period is incremented because the validator's power and share distribution might have changed.
- The reference count for the delegator's starting period is decremented.

##### After [​](https://docs.cosmos.network/v0.50/build/modules/distribution#after "Direct link to After")

The starting height of the delegation is set to the previous period.<br/>
Because of the `Before`-hook, this period is the last period for which the delegator was rewarded.

#### Validator Created [​](https://docs.cosmos.network/v0.50/build/modules/distribution#validator-created "Direct link to Validator created")

- triggered-by: `staking.MsgCreateValidator`

When a validator is created, the following validator variables are initialized:

- Historical rewards
- Current accumulated rewards
- Accumulated commission
- Total outstanding rewards
- Period

By default, all values are set to a `0`, except period, which is set to `1`.

#### Validator Removed [​](https://docs.cosmos.network/v0.50/build/modules/distribution#validator-removed "Direct link to Validator removed")

- triggered-by: `staking.RemoveValidator`

Outstanding commission is sent to the validator's self-delegation withdrawal address.<br/>
Remaining delegator rewards get sent to the community fee pool.

Note: The validator gets removed only when it has no remaining delegations.<br/>
At that time, all outstanding delegator rewards will have been withdrawn.<br/>
Any remaining rewards are dust amounts.

#### Validator is Slashed [​](https://docs.cosmos.network/v0.50/build/modules/distribution#validator-is-slashed "Direct link to Validator is slashed")

- triggered-by: `staking.Slash`
- The current validator period reference count is incremented.<br/>
  The reference count is incremented because the slash event has created a reference to it.
- The validator period is incremented.
- The slash event is stored for later use.<br/>
  The slash event will be referenced when calculating delegator rewards.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/distribution#events "Direct link to Events")

The distribution module emits the following events:

#### BeginBlocker [​](https://docs.cosmos.network/v0.50/build/modules/distribution#beginblocker "Direct link to BeginBlocker")

| Type            | Attribute Key | Attribute Value    |
| --------------- | ------------- | ------------------ |
| proposer_reward | validator     | {validatorAddress} |
| proposer_reward | reward        | {proposerReward}   |
| commission      | amount        | {commissionAmount} |
| commission      | validator     | {validatorAddress} |
| rewards         | amount        | {rewardAmount}     |
| rewards         | validator     | {validatorAddress} |

#### Handlers [​](https://docs.cosmos.network/v0.50/build/modules/distribution#handlers "Direct link to Handlers")

##### MsgSetWithdrawAddress [​](https://docs.cosmos.network/v0.50/build/modules/distribution#msgsetwithdrawaddress-1 "Direct link to MsgSetWithdrawAddress")

| Type                 | Attribute Key    | Attribute Value      |
| -------------------- | ---------------- | -------------------- |
| set_withdraw_address | withdraw_address | {withdrawAddress}    |
| message              | module           | distribution         |
| message              | action           | set_withdraw_address |
| message              | sender           | {senderAddress}      |

##### MsgWithdrawDelegatorReward [​](https://docs.cosmos.network/v0.50/build/modules/distribution#msgwithdrawdelegatorreward-1 "Direct link to MsgWithdrawDelegatorReward")

| Type             | Attribute Key | Attribute Value           |
| ---------------- | ------------- | ------------------------- |
| withdraw_rewards | amount        | {rewardAmount}            |
| withdraw_rewards | validator     | {validatorAddress}        |
| message          | module        | distribution              |
| message          | action        | withdraw_delegator_reward |
| message          | sender        | {senderAddress}           |

##### MsgWithdrawValidatorCommission [​](https://docs.cosmos.network/v0.50/build/modules/distribution#msgwithdrawvalidatorcommission "Direct link to MsgWithdrawValidatorCommission")

| Type                | Attribute Key | Attribute Value               |
| ------------------- | ------------- | ----------------------------- |
| withdraw_commission | amount        | {commissionAmount}            |
| message             | module        | distribution                  |
| message             | action        | withdraw_validator_commission |
| message             | sender        | {senderAddress}               |

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/distribution#parameters "Direct link to Parameters")

The distribution module contains the following parameters:

| Key                 | Type         | Example                      |
| ------------------- | ------------ | ---------------------------- |
| communitytax        | string (dec) | "0.020000000000000000" \[0\] |
| withdrawaddrenabled | bool         | true                         |

- \[0\] `communitytax` must be positive and cannot exceed 1.00.
- `baseproposerreward` and `bonusproposerreward` were parameters that are deprecated in v0.47 and are not used.

note

The reserve pool is the pool of collected funds for use by governance taken via the `CommunityTax`.<br/>
Currently with the Cosmos SDK, tokens collected by the CommunityTax are accounted for but unspendable.

### Client [​](https://docs.cosmos.network/v0.50/build/modules/distribution#client "Direct link to Client")

### CLI [​](https://docs.cosmos.network/v0.50/build/modules/distribution#cli "Direct link to CLI")

A user can query and interact with the `distribution` module using the CLI.

#### Query [​](https://docs.cosmos.network/v0.50/build/modules/distribution#query "Direct link to Query")

The `query` commands allow users to query `distribution` state.

```codeBlockLines_e6Vv
simd query distribution --help

```

##### Commission [​](https://docs.cosmos.network/v0.50/build/modules/distribution#commission "Direct link to commission")

The `commission` command allows users to query validator commission rewards by address.

```codeBlockLines_e6Vv
simd query distribution commission [address] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query distribution commission cosmosvaloper1...

```

Example Output:

```codeBlockLines_e6Vv
commission:
- amount: "1000000.000000000000000000"
  denom: stake

```

##### Community-pool [​](https://docs.cosmos.network/v0.50/build/modules/distribution#community-pool "Direct link to community-pool")

The `community-pool` command allows users to query all coin balances within the community pool.

```codeBlockLines_e6Vv
simd query distribution community-pool [flags]

```

Example:

```codeBlockLines_e6Vv
simd query distribution community-pool

```

Example Output:

```codeBlockLines_e6Vv
pool:
- amount: "1000000.000000000000000000"
  denom: stake

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/distribution#params-1 "Direct link to params")

The `params` command allows users to query the parameters of the `distribution` module.

```codeBlockLines_e6Vv
simd query distribution params [flags]

```

Example:

```codeBlockLines_e6Vv
simd query distribution params

```

Example Output:

```codeBlockLines_e6Vv
base_proposer_reward: "0.000000000000000000"
bonus_proposer_reward: "0.000000000000000000"
community_tax: "0.020000000000000000"
withdraw_addr_enabled: true

```

##### Rewards [​](https://docs.cosmos.network/v0.50/build/modules/distribution#rewards "Direct link to rewards")

The `rewards` command allows users to query delegator rewards. Users can optionally include the validator address to query rewards earned from a specific validator.

```codeBlockLines_e6Vv
simd query distribution rewards [delegator-addr] [validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query distribution rewards cosmos1...

```

Example Output:

```codeBlockLines_e6Vv
rewards:
- reward:
  - amount: "1000000.000000000000000000"
    denom: stake
  validator_address: cosmosvaloper1..
total:
- amount: "1000000.000000000000000000"
  denom: stake

```

##### Slashes [​](https://docs.cosmos.network/v0.50/build/modules/distribution#slashes "Direct link to slashes")

The `slashes` command allows users to query all slashes for a given block range.

```codeBlockLines_e6Vv
simd query distribution slashes [validator] [start-height] [end-height] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query distribution slashes cosmosvaloper1... 1 1000

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "0"
slashes:
- validator_period: 20,
  fraction: "0.009999999999999999"

```

##### Validator-outstanding-rewards [​](https://docs.cosmos.network/v0.50/build/modules/distribution#validator-outstanding-rewards "Direct link to validator-outstanding-rewards")

The `validator-outstanding-rewards` command allows users to query all outstanding (un-withdrawn) rewards for a validator and all their delegations.

```codeBlockLines_e6Vv
simd query distribution validator-outstanding-rewards [validator] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query distribution validator-outstanding-rewards cosmosvaloper1...

```

Example Output:

```codeBlockLines_e6Vv
rewards:
- amount: "1000000.000000000000000000"
  denom: stake

```

##### Validator-distribution-info [​](https://docs.cosmos.network/v0.50/build/modules/distribution#validator-distribution-info "Direct link to validator-distribution-info")

The `validator-distribution-info` command allows users to query validator commission and self-delegation rewards for validator.

````codeBlockLines_e6Vv
simd query distribution validator-distribution-info cosmosvaloper1...
```

Example Output:

```yml
commission:
- amount: "100000.000000000000000000"
  denom: stake
operator_address: cosmosvaloper1...
self_bond_rewards:
- amount: "100000.000000000000000000"
  denom: stake
```

#### Transactions

The `tx` commands allow users to interact with the `distribution` module.

```shell
simd tx distribution --help
```

##### fund-community-pool

The `fund-community-pool` command allows users to send funds to the community pool.

```shell
simd tx distribution fund-community-pool [amount] [flags]
```

Example:

```shell
simd tx distribution fund-community-pool 100stake --from cosmos1...
```

##### set-withdraw-addr

The `set-withdraw-addr` command allows users to set the withdraw address for rewards associated with a delegator address.

```shell
simd tx distribution set-withdraw-addr [withdraw-addr] [flags]
```

Example:

```shell
simd tx distribution set-withdraw-addr cosmos1... --from cosmos1...
```

##### withdraw-all-rewards

The `withdraw-all-rewards` command allows users to withdraw all rewards for a delegator.

```shell
simd tx distribution withdraw-all-rewards [flags]
```

Example:

```shell
simd tx distribution withdraw-all-rewards --from cosmos1...
```

##### withdraw-rewards

The `withdraw-rewards` command allows users to withdraw all rewards from a given delegation address,
and optionally withdraw validator commission if the delegation address given is a validator operator and the user proves the `--commission` flag.

```shell
simd tx distribution withdraw-rewards [validator-addr] [flags]
```

Example:

```shell
simd tx distribution withdraw-rewards cosmosvaloper1... --from cosmos1... --commission
```

### gRPC

A user can query the `distribution` module using gRPC endpoints.

#### Params

The `Params` endpoint allows users to query parameters of the `distribution` module.

Example:

```shell
grpcurl -plaintext \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/Params
```

Example Output:

```json
{
  "params": {
    "communityTax": "20000000000000000",
    "baseProposerReward": "00000000000000000",
    "bonusProposerReward": "00000000000000000",
    "withdrawAddrEnabled": true
  }
}
```

#### ValidatorDistributionInfo

The `ValidatorDistributionInfo` queries validator commission and self-delegation rewards for validator.

Example:

```shell
grpcurl -plaintext \
    -d '{"validator_address":"cosmosvalop1..."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/ValidatorDistributionInfo
```

Example Output:

```json
{
  "commission": {
    "commission": [\
      {\
        "denom": "stake",\
        "amount": "1000000000000000"\
      }\
    ]
  },
  "self_bond_rewards": [\
    {\
      "denom": "stake",\
      "amount": "1000000000000000"\
    }\
  ],
  "validator_address": "cosmosvalop1..."
}
```

#### ValidatorOutstandingRewards

The `ValidatorOutstandingRewards` endpoint allows users to query rewards of a validator address.

Example:

```shell
grpcurl -plaintext \
    -d '{"validator_address":"cosmosvalop1.."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/ValidatorOutstandingRewards
```

Example Output:

```json
{
  "rewards": {
    "rewards": [\
      {\
        "denom": "stake",\
        "amount": "1000000000000000"\
      }\
    ]
  }
}
```

#### ValidatorCommission

The `ValidatorCommission` endpoint allows users to query accumulated commission for a validator.

Example:

```shell
grpcurl -plaintext \
    -d '{"validator_address":"cosmosvalop1.."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/ValidatorCommission
```

Example Output:

```json
{
  "commission": {
    "commission": [\
      {\
        "denom": "stake",\
        "amount": "1000000000000000"\
      }\
    ]
  }
}
```

#### ValidatorSlashes

The `ValidatorSlashes` endpoint allows users to query slash events of a validator.

Example:

```shell
grpcurl -plaintext \
    -d '{"validator_address":"cosmosvalop1.."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/ValidatorSlashes
```

Example Output:

```json
{
  "slashes": [\
    {\
      "validator_period": "20",\
      "fraction": "0.009999999999999999"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}
```

#### DelegationRewards

The `DelegationRewards` endpoint allows users to query the total rewards accrued by a delegation.

Example:

```shell
grpcurl -plaintext \
    -d '{"delegator_address":"cosmos1...","validator_address":"cosmosvalop1..."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/DelegationRewards
```

Example Output:

```json
{
  "rewards": [\
    {\
      "denom": "stake",\
      "amount": "1000000000000000"\
    }\
  ]
}
```

#### DelegationTotalRewards

The `DelegationTotalRewards` endpoint allows users to query the total rewards accrued by each validator.

Example:

```shell
grpcurl -plaintext \
    -d '{"delegator_address":"cosmos1..."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/DelegationTotalRewards
```

Example Output:

```json
{
  "rewards": [\
    {\
      "validatorAddress": "cosmosvaloper1...",\
      "reward": [\
        {\
          "denom": "stake",\
          "amount": "1000000000000000"\
        }\
      ]\
    }\
  ],
  "total": [\
    {\
      "denom": "stake",\
      "amount": "1000000000000000"\
    }\
  ]
}
```

#### DelegatorValidators

The `DelegatorValidators` endpoint allows users to query all validators for given delegator.

Example:

```shell
grpcurl -plaintext \
    -d '{"delegator_address":"cosmos1..."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/DelegatorValidators
```

Example Output:

```json
{
  "validators": ["cosmosvaloper1..."]
}
```

#### DelegatorWithdrawAddress

The `DelegatorWithdrawAddress` endpoint allows users to query the withdraw address of a delegator.

Example:

```shell
grpcurl -plaintext \
    -d '{"delegator_address":"cosmos1..."}' \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/DelegatorWithdrawAddress
```

Example Output:

```json
{
  "withdrawAddress": "cosmos1..."
}
```

#### CommunityPool

The `CommunityPool` endpoint allows users to query the community pool coins.

Example:

```shell
grpcurl -plaintext \
    localhost:9090 \
    cosmos.distribution.v1beta1.Query/CommunityPool
```

Example Output:

```json
{
  "pool": [\
    {\
      "denom": "stake",\
      "amount": "1000000000000000000"\
    }\
  ]
}
```

````

---

## `x/evidence`

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/evidence#concepts)
- [State](https://docs.cosmos.network/v0.50/build/modules/evidence#state)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/evidence#messages)
- [Events](https://docs.cosmos.network/v0.50/build/modules/evidence#events)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/evidence#parameters)
- [BeginBlock](https://docs.cosmos.network/v0.50/build/modules/evidence#beginblock)
- [Client](https://docs.cosmos.network/v0.50/build/modules/evidence#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/evidence#cli)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/evidence#rest)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/evidence#grpc)

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/evidence#abstract "Direct link to Abstract")

`x/evidence` is an implementation of a Cosmos SDK module, per [ADR 009](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-009-evidence-module.md),<br/>
that allows for the submission and handling of arbitrary evidence of misbehavior such<br/>
as equivocation and counterfactual signing.

The evidence module differs from standard evidence handling which typically expects the<br/>
underlying consensus engine, e.g. CometBFT, to automatically submit evidence when<br/>
it is discovered by allowing clients and foreign chains to submit more complex evidence<br/>
directly.

All concrete evidence types must implement the `Evidence` interface contract. Submitted<br/>
`Evidence` is first routed through the evidence module's `Router` in which it attempts<br/>
to find a corresponding registered `Handler` for that specific `Evidence` type.<br/>
Each `Evidence` type must have a `Handler` registered with the evidence module's<br/>
keeper in order for it to be successfully routed and executed.

Each corresponding handler must also fulfill the `Handler` interface contract. The<br/>
`Handler` for a given `Evidence` type can perform any arbitrary state transitions<br/>
such as slashing, jailing, and tombstoning.

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/evidence#concepts "Direct link to Concepts")

#### Evidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#evidence "Direct link to Evidence")

Any concrete type of evidence submitted to the `x/evidence` module must fulfill the<br/>
`Evidence` contract outlined below. Not all concrete types of evidence will fulfill<br/>
this contract in the same way and some data may be entirely irrelevant to certain<br/>
types of evidence. An additional `ValidatorEvidence`, which extends `Evidence`,<br/>
has also been created to define a contract for evidence against malicious validators.

```codeBlockLines_e6Vv
// Evidence defines the contract which concrete evidence types of misbehavior
// must implement.
type Evidence interface {
    proto.Message

    Route() string
    String() string
    Hash() []byte
    ValidateBasic() error

    // Height at which the infraction occurred
    GetHeight() int64
}

// ValidatorEvidence extends Evidence interface to define contract
// for evidence against malicious validators
type ValidatorEvidence interface {
    Evidence

    // The consensus address of the malicious validator at time of infraction
    GetConsensusAddress() sdk.ConsAddress

    // The total power of the malicious validator at time of infraction
    GetValidatorPower() int64

    // The total validator set power at time of infraction
    GetTotalPower() int64
}

```

#### Registration & Handling [​](https://docs.cosmos.network/v0.50/build/modules/evidence#registration--handling "Direct link to Registration & Handling")

The `x/evidence` module must first know about all types of evidence it is expected<br/>
to handle. This is accomplished by registering the `Route` method in the `Evidence`<br/>
contract with what is known as a `Router` (defined below). The `Router` accepts<br/>
`Evidence` and attempts to find the corresponding `Handler` for the `Evidence`<br/>
via the `Route` method.

```codeBlockLines_e6Vv
type Router interface {
  AddRoute(r string, h Handler) Router
  HasRoute(r string) bool
  GetRoute(path string) Handler
  Seal()
  Sealed() bool
}

```

The `Handler` (defined below) is responsible for executing the entirety of the<br/>
business logic for handling `Evidence`. This typically includes validating the<br/>
evidence, both stateless checks via `ValidateBasic` and stateful checks via any<br/>
keepers provided to the `Handler`. In addition, the `Handler` may also perform<br/>
capabilities such as slashing and jailing a validator. All `Evidence` handled<br/>
by the `Handler` should be persisted.

```codeBlockLines_e6Vv
// Handler defines an agnostic Evidence handler. The handler is responsible
// for executing all corresponding business logic necessary for verifying the
// evidence as valid. In addition, the Handler may execute any necessary
// slashing and potential jailing.
type Handler func(context.Context, Evidence) error

```

### State [​](https://docs.cosmos.network/v0.50/build/modules/evidence#state "Direct link to State")

Currently the `x/evidence` module only stores valid submitted `Evidence` in state.<br/>
The evidence state is also stored and exported in the `x/evidence` module's `GenesisState`.

```codeBlockLines_e6Vv
// GenesisState defines the evidence module's genesis state.
message GenesisState {
  // evidence defines all the evidence at genesis.
  repeated google.protobuf.Any evidence = 1;
}

```

All `Evidence` is retrieved and stored via a prefix `KVStore` using prefix `0x00` (`KeyPrefixEvidence`).

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/evidence#messages "Direct link to Messages")

#### MsgSubmitEvidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#msgsubmitevidence "Direct link to MsgSubmitEvidence")

Evidence is submitted through a `MsgSubmitEvidence` message:

```codeBlockLines_e6Vv
// MsgSubmitEvidence represents a message that supports submitting arbitrary
// Evidence of misbehavior such as equivocation or counterfactual signing.
message MsgSubmitEvidence {
  string              submitter = 1;
  google.protobuf.Any evidence  = 2;
}

```

Note, the `Evidence` of a `MsgSubmitEvidence` message must have a corresponding<br/>
`Handler` registered with the `x/evidence` module's `Router` in order to be processed<br/>
and routed correctly.

Given the `Evidence` is registered with a corresponding `Handler`, it is processed<br/>
as follows:

```codeBlockLines_e6Vv
func SubmitEvidence(ctx Context, evidence Evidence) error {
  if _, err := GetEvidence(ctx, evidence.Hash()); err == nil {
    return errorsmod.Wrap(types.ErrEvidenceExists, strings.ToUpper(hex.EncodeToString(evidence.Hash())))
  }
  if !router.HasRoute(evidence.Route()) {
    return errorsmod.Wrap(types.ErrNoEvidenceHandlerExists, evidence.Route())
  }

  handler := router.GetRoute(evidence.Route())
  if err := handler(ctx, evidence); err != nil {
    return errorsmod.Wrap(types.ErrInvalidEvidence, err.Error())
  }

  ctx.EventManager().EmitEvent(
        sdk.NewEvent(
            types.EventTypeSubmitEvidence,
            sdk.NewAttribute(types.AttributeKeyEvidenceHash, strings.ToUpper(hex.EncodeToString(evidence.Hash()))),
        ),
    )

  SetEvidence(ctx, evidence)
  return nil
}

```

First, there must not already exist valid submitted `Evidence` of the exact same<br/>
type. Secondly, the `Evidence` is routed to the `Handler` and executed. Finally,<br/>
if there is no error in handling the `Evidence`, an event is emitted and it is persisted to state.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/evidence#events "Direct link to Events")

The `x/evidence` module emits the following events:

#### Handlers [​](https://docs.cosmos.network/v0.50/build/modules/evidence#handlers "Direct link to Handlers")

##### MsgSubmitEvidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#msgsubmitevidence-1 "Direct link to MsgSubmitEvidence")

| Type            | Attribute Key | Attribute Value |
| --------------- | ------------- | --------------- |
| submit_evidence | evidence_hash | {evidenceHash}  |
| message         | module        | evidence        |
| message         | sender        | {senderAddress} |
| message         | action        | submit_evidence |

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/evidence#parameters "Direct link to Parameters")

The evidence module does not contain any parameters.

### BeginBlock [​](https://docs.cosmos.network/v0.50/build/modules/evidence#beginblock "Direct link to BeginBlock")

#### Evidence Handling [​](https://docs.cosmos.network/v0.50/build/modules/evidence#evidence-handling "Direct link to Evidence Handling")

CometBFT blocks can include<br/>
[Evidence](https://github.com/cometbft/cometbft/blob/main/spec/abci/abci%2B%2B_basic_concepts.md#evidence) that indicates if a validator committed malicious behavior. The relevant information is forwarded to the application as ABCI Evidence in `abci.RequestBeginBlock` so that the validator can be punished accordingly.

##### Equivocation [​](https://docs.cosmos.network/v0.50/build/modules/evidence#equivocation "Direct link to Equivocation")

The Cosmos SDK handles two types of evidence inside the ABCI `BeginBlock`:

- `DuplicateVoteEvidence`,
- `LightClientAttackEvidence`.

The evidence module handles these two evidence types the same way. First, the Cosmos SDK converts the CometBFT concrete evidence type to an SDK `Evidence` interface using `Equivocation` as the concrete type.

proto/cosmos/evidence/v1beta1/evidence.proto

```codeBlockLines_e6Vv
// Equivocation implements the Evidence interface and defines evidence of double
// signing misbehavior.
message Equivocation {
  option (amino.name)                 = "cosmos-sdk/Equivocation";
  option (gogoproto.goproto_stringer) = false;
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.equal)            = false;

  // height is the equivocation height.
  int64                     height = 1;

  // time is the equivocation time.
  google.protobuf.Timestamp time   = 2
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdtime) = true];

  // power is the equivocation validator power.
  int64  power             = 3;

  // consensus_address is the equivocation validator consensus address.
  string consensus_address = 4 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/evidence/v1beta1/evidence.proto#L12-L32)

For some `Equivocation` submitted in `block` to be valid, it must satisfy:

`Evidence.Timestamp >= block.Timestamp - MaxEvidenceAge`

Where:

- `Evidence.Timestamp` is the timestamp in the block at height `Evidence.Height`
- `block.Timestamp` is the current block timestamp.

If valid `Equivocation` evidence is included in a block, the validator's stake is<br/>
reduced (slashed) by `SlashFractionDoubleSign` as defined by the `x/slashing` module<br/>
of what their stake was when the infraction occurred, rather than when the evidence was discovered.<br/>
We want to "follow the stake", i.e., the stake that contributed to the infraction<br/>
should be slashed, even if it has since been redelegated or started unbonding.

In addition, the validator is permanently jailed and tombstoned to make it impossible for that<br/>
validator to ever re-enter the validator set.

The `Equivocation` evidence is handled as follows:

x/evidence/keeper/infraction.go

```codeBlockLines_e6Vv
func (k Keeper) HandleEquivocationEvidence(ctx sdk.Context, evidence *types.Equivocation) {
	logger := k.Logger(ctx)
	consAddr := evidence.GetConsensusAddress()

	if _, err := k.slashingKeeper.GetPubkey(ctx, consAddr.Bytes()); err != nil {
		// Ignore evidence that cannot be handled.
		//
		// NOTE: We used to panic with:
		// `panic(fmt.Sprintf("Validator consensus-address %v not found", consAddr))`,
		// but this couples the expectations of the app to both Tendermint and
		// the simulator.  Both are expected to provide the full range of
		// allowable but none of the disallowed evidence types.  Instead of
		// getting this coordination right, it is easier to relax the
		// constraints and ignore evidence that cannot be handled.
		return
	}

	// calculate the age of the evidence
	infractionHeight := evidence.GetHeight()
	infractionTime := evidence.GetTime()
	ageDuration := ctx.BlockHeader().Time.Sub(infractionTime)
	ageBlocks := ctx.BlockHeader().Height - infractionHeight

	// Reject evidence if the double-sign is too old. Evidence is considered stale
	// if the difference in time and number of blocks is greater than the allowed
	// parameters defined.
	cp := ctx.ConsensusParams()
	if cp != nil && cp.Evidence != nil {
		if ageDuration > cp.Evidence.MaxAgeDuration && ageBlocks > cp.Evidence.MaxAgeNumBlocks {
			logger.Info(
				"ignored equivocation; evidence too old",
				"validator", consAddr,
				"infraction_height", infractionHeight,
				"max_age_num_blocks", cp.Evidence.MaxAgeNumBlocks,
				"infraction_time", infractionTime,
				"max_age_duration", cp.Evidence.MaxAgeDuration,
			)
			return
		}
	}

	validator := k.stakingKeeper.ValidatorByConsAddr(ctx, consAddr)
	if validator == nil || validator.IsUnbonded() {
		// Defensive: Simulation doesn't take unbonding periods into account, and
		// Tendermint might break this assumption at some point.
		return
	}

	if !validator.GetOperator().Empty() {
		if _, err := k.slashingKeeper.GetPubkey(ctx, consAddr.Bytes()); err != nil {
			// Ignore evidence that cannot be handled.
			//
			// NOTE: We used to panic with:
			// `panic(fmt.Sprintf("Validator consensus-address %v not found", consAddr))`,
			// but this couples the expectations of the app to both Tendermint and
			// the simulator.  Both are expected to provide the full range of
			// allowable but none of the disallowed evidence types.  Instead of
			// getting this coordination right, it is easier to relax the
			// constraints and ignore evidence that cannot be handled.
			return
		}
	}

	if ok := k.slashingKeeper.HasValidatorSigningInfo(ctx, consAddr); !ok {
		panic(fmt.Sprintf("expected signing info for validator %s but not found", consAddr))
	}

	// ignore if the validator is already tombstoned
	if k.slashingKeeper.IsTombstoned(ctx, consAddr) {
		logger.Info(
			"ignored equivocation; validator already tombstoned",
			"validator", consAddr,
			"infraction_height", infractionHeight,
			"infraction_time", infractionTime,
		)
		return
	}

	logger.Info(
		"confirmed equivocation",
		"validator", consAddr,
		"infraction_height", infractionHeight,
		"infraction_time", infractionTime,
	)

	// We need to retrieve the stake distribution which signed the block, so we
	// subtract ValidatorUpdateDelay from the evidence height.
	// Note, that this *can* result in a negative "distributionHeight", up to
	// -ValidatorUpdateDelay, i.e. at the end of the
	// pre-genesis block (none) = at the beginning of the genesis block.
	// That's fine since this is just used to filter unbonding delegations & redelegations.
	distributionHeight := infractionHeight - sdk.ValidatorUpdateDelay

	// Slash validator. The `power` is the int64 power of the validator as provided
	// to/by Tendermint. This value is validator.Tokens as sent to Tendermint via
	// ABCI, and now received as evidence. The fraction is passed in to separately
	// to slash unbonding and rebonding delegations.
	k.slashingKeeper.SlashWithInfractionReason(
		ctx,
		consAddr,
		k.slashingKeeper.SlashFractionDoubleSign(ctx),
		evidence.GetValidatorPower(), distributionHeight,
		stakingtypes.Infraction_INFRACTION_DOUBLE_SIGN,
	)

	// Jail the validator if not already jailed. This will begin unbonding the
	// validator if not already unbonding (tombstoned).
	if !validator.IsJailed() {
		k.slashingKeeper.Jail(ctx, consAddr)
	}

	k.slashingKeeper.JailUntil(ctx, consAddr, types.DoubleSignJailEndTime)
	k.slashingKeeper.Tombstone(ctx, consAddr)
	k.SetEvidence(ctx, evidence)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/evidence/keeper/infraction.go#L26-L140)

**Note:** The slashing, jailing, and tombstoning calls are delegated through the `x/slashing` module<br/>
that emits informative events and finally delegates calls to the `x/staking` module. See documentation<br/>
on slashing and jailing in [State Transitions](https://docs.cosmos.network/v0.50/build/modules/staking#state-transitions).

### Client [​](https://docs.cosmos.network/v0.50/build/modules/evidence#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/evidence#cli "Direct link to CLI")

A user can query and interact with the `evidence` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/evidence#query "Direct link to Query")

The `query` commands allows users to query `evidence` state.

```codeBlockLines_e6Vv
simd query evidence --help

```

##### Evidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#evidence-1 "Direct link to evidence")

The `evidence` command allows users to list all evidence or evidence by hash.

Usage:

```codeBlockLines_e6Vv
simd query evidence evidence [flags]

```

To query evidence by hash

Example:

```codeBlockLines_e6Vv
simd query evidence evidence "DF0C23E8634E480F84B9D5674A7CDC9816466DEC28A3358F73260F68D28D7660"

```

Example Output:

```codeBlockLines_e6Vv
evidence:
  consensus_address: cosmosvalcons1ntk8eualewuprz0gamh8hnvcem2nrcdsgz563h
  height: 11
  power: 100
  time: "2021-10-20T16:08:38.194017624Z"

```

To get all evidence

Example:

```codeBlockLines_e6Vv
simd query evidence list

```

Example Output:

```codeBlockLines_e6Vv
evidence:
  consensus_address: cosmosvalcons1ntk8eualewuprz0gamh8hnvcem2nrcdsgz563h
  height: 11
  power: 100
  time: "2021-10-20T16:08:38.194017624Z"
pagination:
  next_key: null
  total: "1"

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/evidence#rest "Direct link to REST")

A user can query the `evidence` module using REST endpoints.

##### Evidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#evidence-2 "Direct link to Evidence")

Get evidence by hash

```codeBlockLines_e6Vv
/cosmos/evidence/v1beta1/evidence/{hash}

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/evidence/v1beta1/evidence/DF0C23E8634E480F84B9D5674A7CDC9816466DEC28A3358F73260F68D28D7660"

```

Example Output:

```codeBlockLines_e6Vv
{
  "evidence": {
    "consensus_address": "cosmosvalcons1ntk8eualewuprz0gamh8hnvcem2nrcdsgz563h",
    "height": "11",
    "power": "100",
    "time": "2021-10-20T16:08:38.194017624Z"
  }
}

```

##### All Evidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#all-evidence "Direct link to All evidence")

Get all evidence

```codeBlockLines_e6Vv
/cosmos/evidence/v1beta1/evidence

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/evidence/v1beta1/evidence"

```

Example Output:

```codeBlockLines_e6Vv
{
  "evidence": [\
    {\
      "consensus_address": "cosmosvalcons1ntk8eualewuprz0gamh8hnvcem2nrcdsgz563h",\
      "height": "11",\
      "power": "100",\
      "time": "2021-10-20T16:08:38.194017624Z"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/evidence#grpc "Direct link to gRPC")

A user can query the `evidence` module using gRPC endpoints.

##### Evidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#evidence-3 "Direct link to Evidence")

Get evidence by hash

```codeBlockLines_e6Vv
cosmos.evidence.v1beta1.Query/Evidence

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext -d '{"evidence_hash":"DF0C23E8634E480F84B9D5674A7CDC9816466DEC28A3358F73260F68D28D7660"}' localhost:9090 cosmos.evidence.v1beta1.Query/Evidence

```

Example Output:

```codeBlockLines_e6Vv
{
  "evidence": {
    "consensus_address": "cosmosvalcons1ntk8eualewuprz0gamh8hnvcem2nrcdsgz563h",
    "height": "11",
    "power": "100",
    "time": "2021-10-20T16:08:38.194017624Z"
  }
}

```

##### All Evidence [​](https://docs.cosmos.network/v0.50/build/modules/evidence#all-evidence-1 "Direct link to All evidence")

Get all evidence

```codeBlockLines_e6Vv
cosmos.evidence.v1beta1.Query/AllEvidence

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.evidence.v1beta1.Query/AllEvidence

```

Example Output:

```codeBlockLines_e6Vv
{
  "evidence": [\
    {\
      "consensus_address": "cosmosvalcons1ntk8eualewuprz0gamh8hnvcem2nrcdsgz563h",\
      "height": "11",\
      "power": "100",\
      "time": "2021-10-20T16:08:38.194017624Z"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

---

## `x/feegrant`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#abstract "Direct link to Abstract")

This document specifies the fee grant module. For the full ADR, please see [Fee Grant ADR-029](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-029-fee-grant-module.md).

This module allows accounts to grant fee allowances and to use fees from their accounts. Grantees can execute any transaction without the need to maintain sufficient fees.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#contents "Direct link to Contents")

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/feegrant#concepts)
- [State](https://docs.cosmos.network/v0.50/build/modules/feegrant#state)
  - [FeeAllowance](https://docs.cosmos.network/v0.50/build/modules/feegrant#feeallowance)
  - [FeeAllowanceQueue](https://docs.cosmos.network/v0.50/build/modules/feegrant#feeallowancequeue)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/feegrant#messages)
  - [Msg/GrantAllowance](https://docs.cosmos.network/v0.50/build/modules/feegrant#msggrantallowance)
  - [Msg/RevokeAllowance](https://docs.cosmos.network/v0.50/build/modules/feegrant#msgrevokeallowance)
- [Events](https://docs.cosmos.network/v0.50/build/modules/feegrant#events)
- [Msg Server](https://docs.cosmos.network/v0.50/build/modules/feegrant#msg-server)
  - [MsgGrantAllowance](https://docs.cosmos.network/v0.50/build/modules/feegrant#msggrantallowance-1)
  - [MsgRevokeAllowance](https://docs.cosmos.network/v0.50/build/modules/feegrant#msgrevokeallowance-1)
  - [Exec fee allowance](https://docs.cosmos.network/v0.50/build/modules/feegrant#exec-fee-allowance)
- [Client](https://docs.cosmos.network/v0.50/build/modules/feegrant#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/feegrant#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/feegrant#grpc)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#concepts "Direct link to Concepts")

#### Grant [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#grant "Direct link to Grant")

`Grant` is stored in the KVStore to record a grant with full context. Every grant will contain `granter`, `grantee` and what kind of `allowance` is granted. `granter` is an account address who is giving permission to `grantee` (the beneficiary account address) to pay for some or all of `grantee`'s transaction fees. `allowance` defines what kind of fee allowance (`BasicAllowance` or `PeriodicAllowance`, see below) is granted to `grantee`. `allowance` accepts an interface which implements `FeeAllowanceI`, encoded as `Any` type. There can be only one existing fee grant allowed for a `grantee` and `granter`, self grants are not allowed.

proto/cosmos/feegrant/v1beta1/feegrant.proto

```codeBlockLines_e6Vv
// Grant is stored in the KVStore to record a grant with full context
message Grant {
  // granter is the address of the user granting an allowance of their funds.
  string granter = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // grantee is the address of the user being granted an allowance of another user's funds.
  string grantee = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // allowance can be any of basic, periodic, allowed fee allowance.
  google.protobuf.Any allowance = 3 [(cosmos_proto.accepts_interface) = "cosmos.feegrant.v1beta1.FeeAllowanceI"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/feegrant/v1beta1/feegrant.proto#L83-L93)

`FeeAllowanceI` looks like:

x/feegrant/fees.go

```codeBlockLines_e6Vv
// FeeAllowance implementations are tied to a given fee delegator and delegatee,
// and are used to enforce fee grant limits.
type FeeAllowanceI interface {
	// Accept can use fee payment requested as well as timestamp of the current block
	// to determine whether or not to process this. This is checked in
	// Keeper.UseGrantedFees and the return values should match how it is handled there.
	//
	// If it returns an error, the fee payment is rejected, otherwise it is accepted.
	// The FeeAllowance implementation is expected to update it's internal state
	// and will be saved again after an acceptance.
	//
	// If remove is true (regardless of the error), the FeeAllowance will be deleted from storage
	// (eg. when it is used up). (See call to RevokeAllowance in Keeper.UseGrantedFees)
	Accept(ctx sdk.Context, fee sdk.Coins, msgs []sdk.Msg) (remove bool, err error)

	// ValidateBasic should evaluate this FeeAllowance for internal consistency.
	// Don't allow negative amounts, or negative periods for example.
	ValidateBasic() error

	// ExpiresAt returns the expiry time of the allowance.
	ExpiresAt() (*time.Time, error)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/feegrant/fees.go#L9-L32)

#### Fee Allowance Types [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#fee-allowance-types "Direct link to Fee Allowance types")

There are two types of fee allowances present at the moment:

- `BasicAllowance`
- `PeriodicAllowance`
- `AllowedMsgAllowance`

#### BasicAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#basicallowance "Direct link to BasicAllowance")

`BasicAllowance` is permission for `grantee` to use fee from a `granter`'s account. If any of the `spend_limit` or `expiration` reaches its limit, the grant will be removed from the state.

proto/cosmos/feegrant/v1beta1/feegrant.proto

```codeBlockLines_e6Vv
// BasicAllowance implements Allowance with a one-time grant of coins
// that optionally expires. The grantee can use up to SpendLimit to cover fees.
message BasicAllowance {
  option (cosmos_proto.implements_interface) = "cosmos.feegrant.v1beta1.FeeAllowanceI";
  option (amino.name)                        = "cosmos-sdk/BasicAllowance";

  // spend_limit specifies the maximum amount of coins that can be spent
  // by this allowance and will be updated as coins are spent. If it is
  // empty, there is no spend limit and any amount of coins can be spent.
  repeated cosmos.base.v1beta1.Coin spend_limit = 1 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/feegrant/v1beta1/feegrant.proto#L15-L28)

- `spend_limit` is the limit of coins that are allowed to be used from the `granter` account. If it is empty, it assumes there's no spend limit, `grantee` can use any number of available coins from `granter` account address before the expiration.
- `expiration` specifies an optional time when this allowance expires. If the value is left empty, there is no expiry for the grant.
- When a grant is created with empty values for `spend_limit` and `expiration`, it is still a valid grant. It won't restrict the `grantee` to use any number of coins from `granter` and it won't have any expiration. The only way to restrict the `grantee` is by revoking the grant.

#### PeriodicAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#periodicallowance "Direct link to PeriodicAllowance")

`PeriodicAllowance` is a repeating fee allowance for the mentioned period, we can mention when the grant can expire as well as when a period can reset. We can also define the maximum number of coins that can be used in a mentioned period of time.

proto/cosmos/feegrant/v1beta1/feegrant.proto

```codeBlockLines_e6Vv
// PeriodicAllowance extends Allowance to allow for both a maximum cap,
// as well as a limit per time period.
message PeriodicAllowance {
  option (cosmos_proto.implements_interface) = "cosmos.feegrant.v1beta1.FeeAllowanceI";
  option (amino.name)                        = "cosmos-sdk/PeriodicAllowance";

  // basic specifies a struct of `BasicAllowance`
  BasicAllowance basic = 1 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // period specifies the time duration in which period_spend_limit coins can
  // be spent before that allowance is reset
  google.protobuf.Duration period = 2
      [(gogoproto.stdduration) = true, (gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // period_spend_limit specifies the maximum number of coins that can be spent
  // in the period
  repeated cosmos.base.v1beta1.Coin period_spend_limit = 3 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];

  // period_can_spend is the number of coins left to be spent before the period_reset time
  repeated cosmos.base.v1beta1.Coin period_can_spend = 4 [\
    (gogoproto.nullable)     = false,\
    (amino.dont_omitempty)   = true,\
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"\
  ];

  // period_reset is the time at which this period resets and a new one begins,
  // it is calculated from the start time of the first transaction after the
  // last period ended
  google.protobuf.Timestamp period_reset = 5
      [(gogoproto.stdtime) = true, (gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/feegrant/v1beta1/feegrant.proto#L34-L68)

- `basic` is the instance of `BasicAllowance` which is optional for periodic fee allowance. If empty, the grant will have no `expiration` and no `spend_limit`.
- `period` is the specific period of time, after each period passes, `period_can_spend` will be reset.
- `period_spend_limit` specifies the maximum number of coins that can be spent in the period.
- `period_can_spend` is the number of coins left to be spent before the period_reset time.
- `period_reset` keeps track of when a next period reset should happen.

#### AllowedMsgAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#allowedmsgallowance "Direct link to AllowedMsgAllowance")

`AllowedMsgAllowance` is a fee allowance, it can be any of `BasicFeeAllowance`, `PeriodicAllowance` but restricted only to the allowed messages mentioned by the granter.

proto/cosmos/feegrant/v1beta1/feegrant.proto

```codeBlockLines_e6Vv
// AllowedMsgAllowance creates allowance only for specified message types.
message AllowedMsgAllowance {
  option (gogoproto.goproto_getters)         = false;
  option (cosmos_proto.implements_interface) = "cosmos.feegrant.v1beta1.FeeAllowanceI";
  option (amino.name)                        = "cosmos-sdk/AllowedMsgAllowance";

  // allowance can be any of basic and periodic fee allowance.
  google.protobuf.Any allowance = 1 [(cosmos_proto.accepts_interface) = "cosmos.feegrant.v1beta1.FeeAllowanceI"];

  // allowed_messages are the messages for which the grantee has the access.
  repeated string allowed_messages = 2;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/feegrant/v1beta1/feegrant.proto#L70-L81)

- `allowance` is either `BasicAllowance` or `PeriodicAllowance`.
- `allowed_messages` is array of messages allowed to execute the given allowance.

#### FeeGranter Flag [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#feegranter-flag "Direct link to FeeGranter flag")

`feegrant` module introduces a `FeeGranter` flag for CLI for the sake of executing transactions with fee granter. When this flag is set, `clientCtx` will append the granter account address for transactions generated through CLI.

client/cmd.go

```codeBlockLines_e6Vv
if clientCtx.FeePayer == nil || flagSet.Changed(flags.FlagFeePayer) {
	payer, _ := flagSet.GetString(flags.FlagFeePayer)

	if payer != "" {
		payerAcc, err := sdk.AccAddressFromBech32(payer)
		if err != nil {
			return clientCtx, err
		}

		clientCtx = clientCtx.WithFeePayerAddress(payerAcc)
	}
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/client/cmd.go#L249-L260)

client/tx/tx.go

```codeBlockLines_e6Vv
err = Sign(txf, clientCtx.GetFromName(), tx, true)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/client/tx/tx.go#L109-L109)

x/auth/tx/builder.go

```codeBlockLines_e6Vv
func (w *wrapper) SetFeeGranter(feeGranter sdk.AccAddress) {
	if w.tx.AuthInfo.Fee == nil {
		w.tx.AuthInfo.Fee = &tx.Fee{}
	}

	w.tx.AuthInfo.Fee.Granter = feeGranter.String()

	// set authInfoBz to nil because the cached authInfoBz no longer matches tx.AuthInfo
	w.authInfoBz = nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/auth/tx/builder.go#L275-L284)

proto/cosmos/tx/v1beta1/tx.proto

```codeBlockLines_e6Vv
// Fee includes the amount of coins paid in fees and the maximum
// gas to be used by the transaction. The ratio yields an effective "gasprice",
// which must be above some miminum to be accepted into the mempool.
message Fee {
  // amount is the amount of coins to be paid as a fee
  repeated cosmos.base.v1beta1.Coin amount = 1
      [(gogoproto.nullable) = false, (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"];

  // gas_limit is the maximum gas that can be used in transaction processing
  // before an out of gas error occurs
  uint64 gas_limit = 2;

  // if unset, the first signer is responsible for paying the fees. If set, the specified account must pay the fees.
  // the payer must be a tx signer (and thus have signed this field in AuthInfo).
  // setting this field does *not* change the ordering of required signers for the transaction.
  string payer = 3 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // if set, the fee payer (either the first signer or the value of the payer field) requests that a fee grant be used
  // to pay fees instead of the fee payer's own balance. If an appropriate fee grant does not exist or the chain does
  // not support fee grants, this will fail
  string granter = 4 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/tx/v1beta1/tx.proto#L203-L224)

Example cmd:

```codeBlockLines_e6Vv
./simd tx gov submit-proposal --title="Test Proposal" --description="My awesome proposal" --type="Text" --from validator-key --fee-granter=cosmos1xh44hxt7spr67hqaa7nyx5gnutrz5fraw6grxn --chain-id=testnet --fees="10stake"

```

#### Granted Fee Deductions [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#granted-fee-deductions "Direct link to Granted Fee Deductions")

Fees are deducted from grants in the `x/auth` ante handler. To learn more about how ante handlers work, read the [Auth Module AnteHandlers Guide](https://docs.cosmos.network/v0.50/build/modules/auth#antehandlers).

#### Gas [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#gas "Direct link to Gas")

In order to prevent DoS attacks, using a filtered `x/feegrant` incurs gas. The SDK must assure that the `grantee`'s transactions all conform to the filter set by the `granter`. The SDK does this by iterating over the allowed messages in the filter and charging 10 gas per filtered message. The SDK will then iterate over the messages being sent by the `grantee` to ensure the messages adhere to the filter, also charging 10 gas per message. The SDK will stop iterating and fail the transaction if it finds a message that does not conform to the filter.

**WARNING**: The gas is charged against the granted allowance. Ensure your messages conform to the filter, if any, before sending transactions using your allowance.

#### Pruning [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#pruning "Direct link to Pruning")

A queue in the state maintained with the prefix of expiration of the grants and checks them on EndBlock with the current block time for every block to prune.

### State [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#state "Direct link to State")

#### FeeAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#feeallowance "Direct link to FeeAllowance")

Fee Allowances are identified by combining `Grantee` (the account address of fee allowance grantee) with the `Granter` (the account address of fee allowance granter).

Fee allowance grants are stored in the state as follows:

- Grant: `0x00 | grantee_addr_len (1 byte) | grantee_addr_bytes |  granter_addr_len (1 byte) | granter_addr_bytes -> ProtocolBuffer(Grant)`

x/feegrant/feegrant.pb.go

```codeBlockLines_e6Vv
// Grant is stored in the KVStore to record a grant with full context
type Grant struct {
	// granter is the address of the user granting an allowance of their funds.
	Granter string `protobuf:"bytes,1,opt,name=granter,proto3" json:"granter,omitempty"`
	// grantee is the address of the user being granted an allowance of another user's funds.
	Grantee string `protobuf:"bytes,2,opt,name=grantee,proto3" json:"grantee,omitempty"`
	// allowance can be any of basic, periodic, allowed fee allowance.
	Allowance *types1.Any `protobuf:"bytes,3,opt,name=allowance,proto3" json:"allowance,omitempty"`
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/feegrant/feegrant.pb.go#L222-L230)

#### FeeAllowanceQueue [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#feeallowancequeue "Direct link to FeeAllowanceQueue")

Fee Allowances queue items are identified by combining the `FeeAllowancePrefixQueue` (i.e., 0x01), `expiration`, `grantee` (the account address of fee allowance grantee), `granter` (the account address of fee allowance granter). Endblocker checks `FeeAllowanceQueue` state for the expired grants and prunes them from `FeeAllowance` if there are any found.

Fee allowance queue keys are stored in the state as follows:

- Grant: `0x01 | expiration_bytes | grantee_addr_len (1 byte) | grantee_addr_bytes |  granter_addr_len (1 byte) | granter_addr_bytes -> EmptyBytes`

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#messages "Direct link to Messages")

#### Msg/GrantAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#msggrantallowance "Direct link to Msg/GrantAllowance")

A fee allowance grant will be created with the `MsgGrantAllowance` message.

proto/cosmos/feegrant/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgGrantAllowance adds permission for Grantee to spend up to Allowance
// of fees from the account of Granter.
message MsgGrantAllowance {
  option (cosmos.msg.v1.signer) = "granter";
  option (amino.name)           = "cosmos-sdk/MsgGrantAllowance";

  // granter is the address of the user granting an allowance of their funds.
  string granter = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // grantee is the address of the user being granted an allowance of another user's funds.
  string grantee = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // allowance can be any of basic, periodic, allowed fee allowance.
  google.protobuf.Any allowance = 3 [(cosmos_proto.accepts_interface) = "cosmos.feegrant.v1beta1.FeeAllowanceI"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/feegrant/v1beta1/tx.proto#L25-L39)

#### Msg/RevokeAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#msgrevokeallowance "Direct link to Msg/RevokeAllowance")

An allowed grant fee allowance can be removed with the `MsgRevokeAllowance` message.

proto/cosmos/feegrant/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgGrantAllowanceResponse defines the Msg/GrantAllowanceResponse response type.
message MsgGrantAllowanceResponse {}

// MsgRevokeAllowance removes any existing Allowance from Granter to Grantee.
message MsgRevokeAllowance {
  option (cosmos.msg.v1.signer) = "granter";
  option (amino.name)           = "cosmos-sdk/MsgRevokeAllowance";

  // granter is the address of the user granting an allowance of their funds.
  string granter = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // grantee is the address of the user being granted an allowance of another user's funds.
  string grantee = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/feegrant/v1beta1/tx.proto#L41-L54)

### Events [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#events "Direct link to Events")

The feegrant module emits the following events:

### Msg Server [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#msg-server "Direct link to Msg Server")

#### MsgGrantAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#msggrantallowance-1 "Direct link to MsgGrantAllowance")

| Type    | Attribute Key | Attribute Value  |
| ------- | ------------- | ---------------- |
| message | action        | set_feegrant     |
| message | granter       | {granterAddress} |
| message | grantee       | {granteeAddress} |

#### MsgRevokeAllowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#msgrevokeallowance-1 "Direct link to MsgRevokeAllowance")

| Type    | Attribute Key | Attribute Value  |
| ------- | ------------- | ---------------- |
| message | action        | revoke_feegrant  |
| message | granter       | {granterAddress} |
| message | grantee       | {granteeAddress} |

#### Exec Fee Allowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#exec-fee-allowance "Direct link to Exec fee allowance")

| Type    | Attribute Key | Attribute Value  |
| ------- | ------------- | ---------------- |
| message | action        | use_feegrant     |
| message | granter       | {granterAddress} |
| message | grantee       | {granteeAddress} |

#### Prune Fee Allowances [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#prune-fee-allowances "Direct link to Prune fee allowances")

| Type    | Attribute Key | Attribute Value |
| ------- | ------------- | --------------- |
| message | action        | prune_feegrant  |
| message | pruner        | {prunerAddress} |

### Client [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#cli "Direct link to CLI")

A user can query and interact with the `feegrant` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#query "Direct link to Query")

The `query` commands allow users to query `feegrant` state.

```codeBlockLines_e6Vv
simd query feegrant --help

```

###### Grant [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#grant-1 "Direct link to grant")

The `grant` command allows users to query a grant for a given granter-grantee pair.

```codeBlockLines_e6Vv
simd query feegrant grant [granter] [grantee] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query feegrant grant cosmos1.. cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
allowance:
  '@type': /cosmos.feegrant.v1beta1.BasicAllowance
  expiration: null
  spend_limit:
  - amount: "100"
    denom: stake
grantee: cosmos1..
granter: cosmos1..

```

###### Grants [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#grants "Direct link to grants")

The `grants` command allows users to query all grants for a given grantee.

```codeBlockLines_e6Vv
simd query feegrant grants [grantee] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query feegrant grants cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
allowances:
- allowance:
    '@type': /cosmos.feegrant.v1beta1.BasicAllowance
    expiration: null
    spend_limit:
    - amount: "100"
      denom: stake
  grantee: cosmos1..
  granter: cosmos1..
pagination:
  next_key: null
  total: "0"

```

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `feegrant` module.

```codeBlockLines_e6Vv
simd tx feegrant --help

```

###### Grant [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#grant-2 "Direct link to grant")

The `grant` command allows users to grant fee allowances to another account. The fee allowance can have an expiration date, a total spend limit, and/or a periodic spend limit.

```codeBlockLines_e6Vv
simd tx feegrant grant [granter] [grantee] [flags]

```

Example (one-time spend limit):

```codeBlockLines_e6Vv
simd tx feegrant grant cosmos1.. cosmos1.. --spend-limit 100stake

```

Example (periodic spend limit):

```codeBlockLines_e6Vv
simd tx feegrant grant cosmos1.. cosmos1.. --period 3600 --period-limit 10stake

```

###### Revoke [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#revoke "Direct link to revoke")

The `revoke` command allows users to revoke a granted fee allowance.

```codeBlockLines_e6Vv
simd tx feegrant revoke [granter] [grantee] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx feegrant revoke cosmos1.. cosmos1..

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#grpc "Direct link to gRPC")

A user can query the `feegrant` module using gRPC endpoints.

##### Allowance [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#allowance "Direct link to Allowance")

The `Allowance` endpoint allows users to query a granted fee allowance.

```codeBlockLines_e6Vv
cosmos.feegrant.v1beta1.Query/Allowance

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"grantee":"cosmos1..","granter":"cosmos1.."}' \
    localhost:9090 \
    cosmos.feegrant.v1beta1.Query/Allowance

```

Example Output:

```codeBlockLines_e6Vv
{
  "allowance": {
    "granter": "cosmos1..",
    "grantee": "cosmos1..",
    "allowance": {"@type":"/cosmos.feegrant.v1beta1.BasicAllowance","spendLimit":[{"denom":"stake","amount":"100"}]}
  }
}

```

##### Allowances [​](https://docs.cosmos.network/v0.50/build/modules/feegrant#allowances "Direct link to Allowances")

The `Allowances` endpoint allows users to query all granted fee allowances for a given grantee.

```codeBlockLines_e6Vv
cosmos.feegrant.v1beta1.Query/Allowances

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"address":"cosmos1.."}' \
    localhost:9090 \
    cosmos.feegrant.v1beta1.Query/Allowances

```

Example Output:

```codeBlockLines_e6Vv
{
  "allowances": [\
    {\
      "granter": "cosmos1..",\
      "grantee": "cosmos1..",\
      "allowance": {"@type":"/cosmos.feegrant.v1beta1.BasicAllowance","spendLimit":[{"denom":"stake","amount":"100"}]}\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

---

## `x/genutil`

The `genutil` package contains a variety of genesis utility functionalities for usage within a blockchain application. Namely:

- Genesis transactions related (gentx)
- Commands for collection and creation of gentxs
- `InitChain` processing of gentxs
- Genesis file creation
- Genesis file validation
- Genesis file migration
- CometBFT related initialization
  - Translation of an app genesis to a CometBFT genesis

### Genesis [​](https://docs.cosmos.network/v0.50/build/modules/genutil#genesis "Direct link to Genesis")

Genutil contains the data structure that defines an application genesis.<br/>
An application genesis consist of a consensus genesis (g.e. CometBFT genesis) and application related genesis data.

x/genutil/types/genesis.go

```codeBlockLines_e6Vv
// AppGenesis defines the app's genesis.
type AppGenesis struct {
	AppName       string            `json:"app_name"`
	AppVersion    string            `json:"app_version"`
	GenesisTime   time.Time         `json:"genesis_time"`
	ChainID       string            `json:"chain_id"`
	InitialHeight int64             `json:"initial_height"`
	AppHash       []byte            `json:"app_hash"`
	AppState      json.RawMessage   `json:"app_state,omitempty"`
	Consensus     *ConsensusGenesis `json:"consensus,omitempty"`
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-rc.0/x/genutil/types/genesis.go#L24-L34)

The application genesis can then be translated to the consensus engine to the right format:

x/genutil/types/genesis.go

```codeBlockLines_e6Vv
func (ag *AppGenesis) ToGenesisDoc() (*cmttypes.GenesisDoc, error) {
	return &cmttypes.GenesisDoc{
		GenesisTime:     ag.GenesisTime,
		ChainID:         ag.ChainID,
		InitialHeight:   ag.InitialHeight,
		AppHash:         ag.AppHash,
		AppState:        ag.AppState,
		Validators:      ag.Consensus.Validators,
		ConsensusParams: ag.Consensus.Params,
	}, nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-rc.0/x/genutil/types/genesis.go#L126-L136)

server/start.go

```codeBlockLines_e6Vv
// returns a function which returns the genesis doc from the genesis file.
func getGenDocProvider(cfg *cmtcfg.Config) func() (*cmttypes.GenesisDoc, error) {
	return func() (*cmttypes.GenesisDoc, error) {
		appGenesis, err := genutiltypes.AppGenesisFromFile(cfg.GenesisFile())
		if err != nil {
			return nil, err
		}

		return appGenesis.ToGenesisDoc()
	}
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-rc.0/server/start.go#L397-L407)

### Client [​](https://docs.cosmos.network/v0.50/build/modules/genutil#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/genutil#cli "Direct link to CLI")

The genutil commands are available under the `genesis` subcommand.

##### Add-genesis-account [​](https://docs.cosmos.network/v0.50/build/modules/genutil#add-genesis-account "Direct link to add-genesis-account")

Add a genesis account to `genesis.json`. Learn more [here](https://docs.cosmos.network/main/run-node/run-node#adding-genesis-accounts).

##### Collect-gentxs [​](https://docs.cosmos.network/v0.50/build/modules/genutil#collect-gentxs "Direct link to collect-gentxs")

Collect genesis txs and output a `genesis.json` file.

```codeBlockLines_e6Vv
simd genesis collect-gentxs

```

This will create a new `genesis.json` file that includes data from all the validators (we sometimes call it the "super genesis file" to distinguish it from single-validator genesis files).

##### Gentx [​](https://docs.cosmos.network/v0.50/build/modules/genutil#gentx "Direct link to gentx")

Generate a genesis tx carrying a self delegation.

```codeBlockLines_e6Vv
simd genesis gentx [key_name] [amount] --chain-id [chain-id]

```

This will create the genesis transaction for your new chain. Here `amount` should be at least `1000000000stake`.<br/>
If you provide too much or too little, you will encounter an error when starting a node.

##### Migrate [​](https://docs.cosmos.network/v0.50/build/modules/genutil#migrate "Direct link to migrate")

Migrate genesis to a specified target (SDK) version.

```codeBlockLines_e6Vv
simd genesis migrate [target-version]

```

The `migrate` command is extensible and takes a `MigrationMap`. This map is a mapping of target versions to genesis migrations functions.<br/>
When not using the default `MigrationMap`, it is recommended to still call the default `MigrationMap` corresponding the SDK version of the chain and prepend/append your own genesis migrations.

##### Validate-genesis [​](https://docs.cosmos.network/v0.50/build/modules/genutil#validate-genesis "Direct link to validate-genesis")

Validates the genesis file at the default location or at the location passed as an argument.

```codeBlockLines_e6Vv
simd genesis validate-genesis

```

Validate genesis only validates if the genesis is valid at the **current application binary**. For validating a genesis from a previous version of the application, use the `migrate` command to migrate the genesis to the current version.

---

## `x/gov`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/gov#abstract "Direct link to Abstract")

This paper specifies the Governance module of the Cosmos SDK, which was first<br/>
described in the [Cosmos Whitepaper](https://cosmos.network/about/whitepaper) in<br/>
June 2016.

The module enables Cosmos SDK based blockchain to support an on-chain governance<br/>
system. In this system, holders of the native staking token of the chain can vote<br/>
on proposals on a 1 token 1 vote basis. Next is a list of features the module<br/>
currently supports:

- **Proposal submission:** Users can submit proposals with a deposit. Once the<br/>
  minimum deposit is reached, the proposal enters voting period. The minimum deposit can be reached by collecting deposits from different users (including proposer) within deposit period.
- **Vote:** Participants can vote on proposals that reached MinDeposit and entered voting period.
- **Inheritance and penalties:** Delegators inherit their validator's vote if<br/>
  they don't vote themselves.
- **Claiming deposit:** Users that deposited on proposals can recover their<br/>
  deposits if the proposal was accepted or rejected. If the proposal was vetoed, or never entered voting period (minimum deposit not reached within deposit period), the deposit is burned.

This module is in use on the Cosmos Hub (a.k.a [gaia](https://github.com/cosmos/gaia)).<br/>
Features that may be added in the future are described in [Future Improvements](https://docs.cosmos.network/v0.50/build/modules/gov#future-improvements).

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/gov#contents "Direct link to Contents")

The following specification uses _ATOM_ as the native staking token. The module<br/>
can be adapted to any Proof-Of-Stake blockchain by replacing _ATOM_ with the native<br/>
staking token of the chain.

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/gov#concepts)
  - [Proposal submission](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-submission)
  - [Deposit](https://docs.cosmos.network/v0.50/build/modules/gov#deposit)
  - [Vote](https://docs.cosmos.network/v0.50/build/modules/gov#vote)
  - [Software Upgrade](https://docs.cosmos.network/v0.50/build/modules/gov#software-upgrade)
- [State](https://docs.cosmos.network/v0.50/build/modules/gov#state)
  - [Proposals](https://docs.cosmos.network/v0.50/build/modules/gov#proposals)
  - [Parameters and base types](https://docs.cosmos.network/v0.50/build/modules/gov#parameters-and-base-types)
  - [Deposit](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-1)
  - [ValidatorGovInfo](https://docs.cosmos.network/v0.50/build/modules/gov#validatorgovinfo)
  - [Stores](https://docs.cosmos.network/v0.50/build/modules/gov#stores)
  - [Proposal Processing Queue](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-processing-queue)
  - [Legacy Proposal](https://docs.cosmos.network/v0.50/build/modules/gov#legacy-proposal)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/gov#messages)
  - [Proposal Submission](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-submission-1)
  - [Deposit](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-2)
  - [Vote](https://docs.cosmos.network/v0.50/build/modules/gov#vote-1)
- [Events](https://docs.cosmos.network/v0.50/build/modules/gov#events)
  - [EndBlocker](https://docs.cosmos.network/v0.50/build/modules/gov#endblocker)
  - [Handlers](https://docs.cosmos.network/v0.50/build/modules/gov#handlers)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/gov#parameters)
- [Client](https://docs.cosmos.network/v0.50/build/modules/gov#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/gov#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/gov#grpc)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/gov#rest)
- [Metadata](https://docs.cosmos.network/v0.50/build/modules/gov#metadata)
  - [Proposal](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-3)
  - [Vote](https://docs.cosmos.network/v0.50/build/modules/gov#vote-5)
- [Future Improvements](https://docs.cosmos.network/v0.50/build/modules/gov#future-improvements)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/gov#concepts "Direct link to Concepts")

_Disclaimer: This is work in progress. Mechanisms are susceptible to change._

The governance process is divided in a few steps that are outlined below:

- **Proposal submission:** Proposal is submitted to the blockchain with a<br/>
  deposit.
- **Vote:** Once deposit reaches a certain value (`MinDeposit`), proposal is<br/>
  confirmed and vote opens. Bonded Atom holders can then send `TxGovVote`<br/>
  transactions to vote on the proposal.
- **Execution** After a period of time, the votes are tallied and depending<br/>
  on the result, the messages in the proposal will be executed.

#### Proposal Submission [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-submission "Direct link to Proposal submission")

##### Right to Submit a Proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#right-to-submit-a-proposal "Direct link to Right to submit a proposal")

Every account can submit proposals by sending a `MsgSubmitProposal` transaction.<br/>
Once a proposal is submitted, it is identified by its unique `proposalID`.

##### Proposal Messages [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-messages "Direct link to Proposal Messages")

A proposal includes an array of `sdk.Msg` s which are executed automatically if the<br/>
proposal passes. The messages are executed by the governance `ModuleAccount` itself. Modules<br/>
such as `x/upgrade`, that want to allow certain messages to be executed by governance<br/>
only should add a whitelist within the respective msg server, granting the governance<br/>
module the right to execute the message once a quorum has been reached. The governance<br/>
module uses the `MsgServiceRouter` to check that these messages are correctly constructed<br/>
and have a respective path to execute on but do not perform a full validity check.

#### Deposit [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposit "Direct link to Deposit")

To prevent spam, proposals must be submitted with a deposit in the coins defined by<br/>
the `MinDeposit` param.

When a proposal is submitted, it has to be accompanied with a deposit that must be<br/>
strictly positive, but can be inferior to `MinDeposit`. The submitter doesn't need<br/>
to pay for the entire deposit on their own. The newly created proposal is stored in<br/>
an _inactive proposal queue_ and stays there until its deposit passes the `MinDeposit`.<br/>
Other token holders can increase the proposal's deposit by sending a `Deposit`<br/>
transaction. If a proposal doesn't pass the `MinDeposit` before the deposit end time<br/>
(the time when deposits are no longer accepted), the proposal will be destroyed: the<br/>
proposal will be removed from state and the deposit will be burned (see x/gov `EndBlocker`).<br/>
When a proposal deposit passes the `MinDeposit` threshold (even during the proposal<br/>
submission) before the deposit end time, the proposal will be moved into the<br/>
_active proposal queue_ and the voting period will begin.

The deposit is kept in escrow and held by the governance `ModuleAccount` until the<br/>
proposal is finalized (passed or rejected).

##### Deposit Refund and Burn [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-refund-and-burn "Direct link to Deposit refund and burn")

When a proposal is finalized, the coins from the deposit are either refunded or burned<br/>
according to the final tally of the proposal:

- If the proposal is approved or rejected but _not_ vetoed, each deposit will be<br/>
  automatically refunded to its respective depositor (transferred from the governance<br/>
  `ModuleAccount`).
- When the proposal is vetoed with greater than 1/3, deposits will be burned from the<br/>
  governance `ModuleAccount` and the proposal information along with its deposit<br/>
  information will be removed from state.
- All refunded or burned deposits are removed from the state. Events are issued when<br/>
  burning or refunding a deposit.

#### Vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#vote "Direct link to Vote")

##### Participants [​](https://docs.cosmos.network/v0.50/build/modules/gov#participants "Direct link to Participants")

_Participants_ are users that have the right to vote on proposals. On the<br/>
Cosmos Hub, participants are bonded Atom holders. Unbonded Atom holders and<br/>
other users do not get the right to participate in governance. However, they<br/>
can submit and deposit on proposals.

Note that when _participants_ have bonded and unbonded Atoms, their voting power is calculated from their bonded Atom holdings only.

##### Voting Period [​](https://docs.cosmos.network/v0.50/build/modules/gov#voting-period "Direct link to Voting period")

Once a proposal reaches `MinDeposit`, it immediately enters `Voting period`. We<br/>
define `Voting period` as the interval between the moment the vote opens and<br/>
the moment the vote closes. The initial value of `Voting period` is 2 weeks.

##### Option Set [​](https://docs.cosmos.network/v0.50/build/modules/gov#option-set "Direct link to Option set")

The option set of a proposal refers to the set of choices a participant can<br/>
choose from when casting its vote.

The initial option set includes the following options:

- `Yes`
- `No`
- `NoWithVeto`
- `Abstain`

`NoWithVeto` counts as `No` but also adds a `Veto` vote. `Abstain` option<br/>
allows voters to signal that they do not intend to vote in favor or against the<br/>
proposal but accept the result of the vote.

_Note: from the UI, for urgent proposals we should maybe add a 'Not Urgent' option that casts a `NoWithVeto` vote._

##### Weighted Votes [​](https://docs.cosmos.network/v0.50/build/modules/gov#weighted-votes "Direct link to Weighted Votes")

[ADR-037](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-037-gov-split-vote.md) introduces the weighted vote feature which allows a staker to split their votes into several voting options. For example, it could use 70% of its voting power to vote Yes and 30% of its voting power to vote No.

Often times the entity owning that address might not be a single individual. For example, a company might have different stakeholders who want to vote differently, and so it makes sense to allow them to split their voting power. Currently, it is not possible for them to do "passthrough voting" and giving their users voting rights over their tokens. However, with this system, exchanges can poll their users for voting preferences, and then vote on-chain proportionally to the results of the poll.

To represent weighted vote on chain, we use the following Protobuf message.

proto/cosmos/gov/v1beta1/gov.proto

```codeBlockLines_e6Vv
// WeightedVoteOption defines a unit of vote for vote split.
//
// Since: cosmos-sdk 0.43
message WeightedVoteOption {
  // option defines the valid vote options, it must not contain duplicate vote options.
  VoteOption option = 1;

  // weight is the vote weight associated with the vote option.
  string     weight = 2 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1beta1/gov.proto#L34-L47)

proto/cosmos/gov/v1beta1/gov.proto

```codeBlockLines_e6Vv
// Vote defines a vote on a governance proposal.
// A Vote consists of a proposal ID, the voter, and the vote option.
message Vote {
  option (gogoproto.goproto_stringer) = false;
  option (gogoproto.equal)            = false;

  // proposal_id defines the unique id of the proposal.
  uint64 proposal_id = 1 [(gogoproto.jsontag) = "id", (amino.field_name) = "id", (amino.dont_omitempty) = true];

  // voter is the voter address of the proposal.
  string voter       = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // Deprecated: Prefer to use `options` instead. This field is set in queries
  // if and only if `len(options) == 1` and that option has weight 1. In all
  // other cases, this field will default to VOTE_OPTION_UNSPECIFIED.
  VoteOption option = 3 [deprecated = true];

  // options is the weighted vote options.
  //
  // Since: cosmos-sdk 0.43
  repeated WeightedVoteOption options = 4 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1beta1/gov.proto#L181-L201)

For a weighted vote to be valid, the `options` field must not contain duplicate vote options, and the sum of weights of all options must be equal to 1.

#### Quorum [​](https://docs.cosmos.network/v0.50/build/modules/gov#quorum "Direct link to Quorum")

Quorum is defined as the minimum percentage of voting power that needs to be<br/>
cast on a proposal for the result to be valid.

#### Expedited Proposals [​](https://docs.cosmos.network/v0.50/build/modules/gov#expedited-proposals "Direct link to Expedited Proposals")

A proposal can be expedited, making the proposal use shorter voting duration and a higher tally threshold by its default. If an expedited proposal fails to meet the threshold within the scope of shorter voting duration, the expedited proposal is then converted to a regular proposal and restarts voting under regular voting conditions.

##### Threshold [​](https://docs.cosmos.network/v0.50/build/modules/gov#threshold "Direct link to Threshold")

Threshold is defined as the minimum proportion of `Yes` votes (excluding<br/>
`Abstain` votes) for the proposal to be accepted.

Initially, the threshold is set at 50% of `Yes` votes, excluding `Abstain`<br/>
votes. A possibility to veto exists if more than 1/3rd of all votes are<br/>
`NoWithVeto` votes. Note, both of these values are derived from the `TallyParams`<br/>
on-chain parameter, which is modifiable by governance.<br/>
This means that proposals are accepted iff:

- There exist bonded tokens.
- Quorum has been achieved.
- The proportion of `Abstain` votes is inferior to 1/1.
- The proportion of `NoWithVeto` votes is inferior to 1/3, including<br/>
  `Abstain` votes.
- The proportion of `Yes` votes, excluding `Abstain` votes, at the end of<br/>
  the voting period is superior to 1/2.

For expedited proposals, by default, the threshold is higher than with a _normal proposal_, namely, 66.7%.

##### Inheritance [​](https://docs.cosmos.network/v0.50/build/modules/gov#inheritance "Direct link to Inheritance")

If a delegator does not vote, it will inherit its validator vote.

- If the delegator votes before its validator, it will not inherit from the<br/>
  validator's vote.
- If the delegator votes after its validator, it will override its validator<br/>
  vote with its own. If the proposal is urgent, it is possible<br/>
  that the vote will close before delegators have a chance to react and<br/>
  override their validator's vote. This is not a problem, as proposals require more than 2/3rd of the total voting power to pass, when tallied at the end of the voting period. Because as little as 1/3 + 1 validation power could collude to censor transactions, non-collusion is already assumed for ranges exceeding this threshold.

##### Validator's Punishment for Non-voting [​](https://docs.cosmos.network/v0.50/build/modules/gov#validators-punishment-for-non-voting "Direct link to Validator’s punishment for non-voting")

At present, validators are not punished for failing to vote.

##### Governance Address [​](https://docs.cosmos.network/v0.50/build/modules/gov#governance-address "Direct link to Governance address")

Later, we may add permissioned keys that could only sign txs from certain modules. For the MVP, the `Governance address` will be the main validator address generated at account creation. This address corresponds to a different PrivKey than the CometBFT PrivKey which is responsible for signing consensus messages. Validators thus do not have to sign governance transactions with the sensitive CometBFT PrivKey.

##### Burnable Params [​](https://docs.cosmos.network/v0.50/build/modules/gov#burnable-params "Direct link to Burnable Params")

There are three parameters that define if the deposit of a proposal should be burned or returned to the depositors.

- `BurnVoteVeto` burns the proposal deposit if the proposal gets vetoed.
- `BurnVoteQuorum` burns the proposal deposit if the proposal deposit if the vote does not reach quorum.
- `BurnProposalDepositPrevote` burns the proposal deposit if it does not enter the voting phase.

> Note: These parameters are modifiable via governance.

### State [​](https://docs.cosmos.network/v0.50/build/modules/gov#state "Direct link to State")

#### Constitution [​](https://docs.cosmos.network/v0.50/build/modules/gov#constitution "Direct link to Constitution")

`Constitution` is found in the genesis state. It is a string field intended to be used to describe the purpose of a particular blockchain, and its expected norms. A few examples of how the constitution field can be used:

- define the purpose of the chain, laying a foundation for its future development
- set expectations for delegators
- set expectations for validators
- define the chain's relationship to "meatspace" entities, like a foundation or corporation

Since this is more of a social feature than a technical feature, we'll now get into some items that may have been useful to have in a genesis constitution:

- What limitations on governance exist, if any?
  - is it okay for the community to slash the wallet of a whale that they no longer feel that they want around? (viz: Juno Proposal 4 and 16)
  - can governance "socially slash" a validator who is using unapproved MEV? (viz: commonwealth.im/osmosis)
  - In the event of an economic emergency, what should validators do?
    - Terra crash of May, 2022, saw validators choose to run a new binary with code that had not been approved by governance, because the governance token had been inflated to nothing.
- What is the purpose of the chain, specifically?
  - best example of this is the Cosmos hub, where different founding groups, have different interpretations of the purpose of the network.

This genesis entry, "constitution" hasn't been designed for existing chains, who should likely just ratify a constitution using their governance system. Instead, this is for new chains. It will allow for validators to have a much clearer idea of purpose and the expecations placed on them while operating their nodes. Likewise, for community members, the constitution will give them some idea of what to expect from both the "chain team" and the validators, respectively.

This constitution is designed to be immutable, and placed only in genesis, though that could change over time by a pull request to the cosmos-sdk that allows for the constitution to be changed by governance. Communities whishing to make amendments to their original constitution should use the governance mechanism and a "signaling proposal" to do exactly that.

**Ideal use scenario for a cosmos chain constitution**

As a chain developer, you decide that you'd like to provide clarity to your key user groups:

- validators
- token holders
- developers (yourself)

You use the constitution to immutably store some Markdown in genesis, so that when difficult questions come up, the constutituon can provide guidance to the community.

#### Proposals [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposals "Direct link to Proposals")

`Proposal` objects are used to tally votes and generally track the proposal's state.<br/>
They contain an array of arbitrary `sdk.Msg`'s which the governance module will attempt<br/>
to resolve and then execute if the proposal passes. `Proposal`'s are identified by a<br/>
unique id and contains a series of timestamps: `submit_time`, `deposit_end_time`,<br/>
`voting_start_time`, `voting_end_time` which track the lifecycle of a proposal

proto/cosmos/gov/v1/gov.proto

```codeBlockLines_e6Vv
// Proposal defines the core field members of a governance proposal.
message Proposal {
  // id defines the unique id of the proposal.
  uint64   id                           = 1;

  // messages are the arbitrary messages to be executed if the proposal passes.
  repeated google.protobuf.Any messages = 2;

  // status defines the proposal status.
  ProposalStatus               status   = 3;

  // final_tally_result is the final tally result of the proposal. When
  // querying a proposal via gRPC, this field is not populated until the
  // proposal's voting period has ended.
  TallyResult               final_tally_result        = 4;

  // submit_time is the time of proposal submission.
  google.protobuf.Timestamp submit_time               = 5 [(gogoproto.stdtime) = true];

  // deposit_end_time is the end time for deposition.
  google.protobuf.Timestamp deposit_end_time          = 6 [(gogoproto.stdtime) = true];

  // total_deposit is the total deposit on the proposal.
  repeated cosmos.base.v1beta1.Coin total_deposit     = 7 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // voting_start_time is the starting time to vote on a proposal.
  google.protobuf.Timestamp         voting_start_time = 8 [(gogoproto.stdtime) = true];

  // voting_end_time is the end time of voting on a proposal.
  google.protobuf.Timestamp         voting_end_time   = 9 [(gogoproto.stdtime) = true];

  // metadata is any arbitrary metadata attached to the proposal.
  string metadata = 10;

  // title is the title of the proposal
  //
  // Since: cosmos-sdk 0.47
  string title = 11;

  // summary is a short summary of the proposal
  //
  // Since: cosmos-sdk 0.47
  string summary = 12;

  // Proposer is the address of the proposal sumbitter
  //
  // Since: cosmos-sdk 0.47
  string proposer = 13 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/gov.proto#L51-L99)

A proposal will generally require more than just a set of messages to explain its<br/>
purpose but need some greater justification and allow a means for interested participants<br/>
to discuss and debate the proposal.<br/>
In most cases, **it is encouraged to have an off-chain system that supports the on-chain governance process**.<br/>
To accommodate for this, a proposal contains a special **`metadata`** field, a string,<br/>
which can be used to add context to the proposal. The `metadata` field allows custom use for networks,<br/>
however, it is expected that the field contains a URL or some form of CID using a system such as<br/>
[IPFS](https://docs.ipfs.io/concepts/content-addressing/). To support the case of<br/>
interoperability across networks, the SDK recommends that the `metadata` represents<br/>
the following `JSON` template:

```codeBlockLines_e6Vv
{
  "title": "...",
  "description": "...",
  "forum": "...", // a link to the discussion platform (i.e. Discord)
  "other": "..." // any extra data that doesn't correspond to the other fields
}

```

This makes it far easier for clients to support multiple networks.

The metadata has a maximum length that is chosen by the app developer, and<br/>
passed into the gov keeper as a config. The default maximum length in the SDK is 255 characters.

##### Writing a Module that Uses Governance [​](https://docs.cosmos.network/v0.50/build/modules/gov#writing-a-module-that-uses-governance "Direct link to Writing a module that uses governance")

There are many aspects of a chain, or of the individual modules that you may want to<br/>
use governance to perform such as changing various parameters. This is very simple<br/>
to do. First, write out your message types and `MsgServer` implementation. Add an<br/>
`authority` field to the keeper which will be populated in the constructor with the<br/>
governance module account: `govKeeper.GetGovernanceAccount().GetAddress()`. Then for<br/>
the methods in the `msg_server.go`, perform a check on the message that the signer<br/>
matches `authority`. This will prevent any user from executing that message.

#### Parameters and Base Types [​](https://docs.cosmos.network/v0.50/build/modules/gov#parameters-and-base-types "Direct link to Parameters and base types")

`Parameters` define the rules according to which votes are run. There can only<br/>
be one active parameter set at any given time. If governance wants to change a<br/>
parameter set, either to modify a value or add/remove a parameter field, a new<br/>
parameter set has to be created and the previous one rendered inactive.

##### DepositParams [​](https://docs.cosmos.network/v0.50/build/modules/gov#depositparams "Direct link to DepositParams")

proto/cosmos/gov/v1/gov.proto

```codeBlockLines_e6Vv
// DepositParams defines the params for deposits on governance proposals.
message DepositParams {
  // Minimum deposit for a proposal to enter voting period.
  repeated cosmos.base.v1beta1.Coin min_deposit = 1
      [(gogoproto.nullable) = false, (gogoproto.jsontag) = "min_deposit,omitempty"];

  // Maximum period for Atom holders to deposit on a proposal. Initial value: 2
  // months.
  google.protobuf.Duration max_deposit_period = 2
      [(gogoproto.stdduration) = true, (gogoproto.jsontag) = "max_deposit_period,omitempty"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/gov.proto#L152-L162)

##### VotingParams [​](https://docs.cosmos.network/v0.50/build/modules/gov#votingparams "Direct link to VotingParams")

proto/cosmos/gov/v1/gov.proto

```codeBlockLines_e6Vv
// VotingParams defines the params for voting on governance proposals.
message VotingParams {
  // Duration of the voting period.
  google.protobuf.Duration voting_period = 1 [(gogoproto.stdduration) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/gov.proto#L164-L168)

##### TallyParams [​](https://docs.cosmos.network/v0.50/build/modules/gov#tallyparams "Direct link to TallyParams")

proto/cosmos/gov/v1/gov.proto

```codeBlockLines_e6Vv
// TallyParams defines the params for tallying votes on governance proposals.
message TallyParams {
  // Minimum percentage of total stake needed to vote for a result to be
  // considered valid.
  string quorum = 1 [(cosmos_proto.scalar) = "cosmos.Dec"];

  // Minimum proportion of Yes votes for proposal to pass. Default value: 0.5.
  string threshold = 2 [(cosmos_proto.scalar) = "cosmos.Dec"];

  // Minimum value of Veto votes to Total votes ratio for proposal to be
  // vetoed. Default value: 1/3.
  string veto_threshold = 3 [(cosmos_proto.scalar) = "cosmos.Dec"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/gov.proto#L170-L182)

Parameters are stored in a global `GlobalParams` KVStore.

Additionally, we introduce some basic types:

```codeBlockLines_e6Vv
type Vote byte

const (
    VoteYes         = 0x1
    VoteNo          = 0x2
    VoteNoWithVeto  = 0x3
    VoteAbstain     = 0x4
)

type ProposalType  string

const (
    ProposalTypePlainText       = "Text"
    ProposalTypeSoftwareUpgrade = "SoftwareUpgrade"
)

type ProposalStatus byte

const (
    StatusNil           ProposalStatus = 0x00
    StatusDepositPeriod ProposalStatus = 0x01  // Proposal is submitted. Participants can deposit on it but not vote
    StatusVotingPeriod  ProposalStatus = 0x02  // MinDeposit is reached, participants can vote
    StatusPassed        ProposalStatus = 0x03  // Proposal passed and successfully executed
    StatusRejected      ProposalStatus = 0x04  // Proposal has been rejected
    StatusFailed        ProposalStatus = 0x05  // Proposal passed but failed execution
)

```

#### Deposit [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-1 "Direct link to Deposit")

proto/cosmos/gov/v1/gov.proto

```codeBlockLines_e6Vv
// Deposit defines an amount deposited by an account address to an active
// proposal.
message Deposit {
  // proposal_id defines the unique id of the proposal.
  uint64   proposal_id                     = 1;

  // depositor defines the deposit addresses from the proposals.
  string   depositor                       = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // amount to be deposited by depositor.
  repeated cosmos.base.v1beta1.Coin amount = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/gov.proto#L38-L49)

#### ValidatorGovInfo [​](https://docs.cosmos.network/v0.50/build/modules/gov#validatorgovinfo "Direct link to ValidatorGovInfo")

This type is used in a temp map when tallying

```codeBlockLines_e6Vv
  type ValidatorGovInfo struct {
    Minus     sdk.Dec
    Vote      Vote
  }

```

### Stores [​](https://docs.cosmos.network/v0.50/build/modules/gov#stores "Direct link to Stores")

note

Stores are KVStores in the multi-store. The key to find the store is the first parameter in the list

We will use one KVStore `Governance` to store four mappings:

- A mapping from `proposalID|'proposal'` to `Proposal`.
- A mapping from `proposalID|'addresses'|address` to `Vote`. This mapping allows<br/>
  us to query all addresses that voted on the proposal along with their vote by<br/>
  doing a range query on `proposalID:addresses`.
- A mapping from `ParamsKey|'Params'` to `Params`. This map allows to query all<br/>
  x/gov params.
- A mapping from `VotingPeriodProposalKeyPrefix|proposalID` to a single byte. This allows<br/>
  us to know if a proposal is in the voting period or not with very low gas cost.

For pseudocode purposes, here are the two function we will use to read or write in stores:

- `load(StoreKey, Key)`: Retrieve item stored at key `Key` in store found at key `StoreKey` in the multistore
- `store(StoreKey, Key, value)`: Write value `Value` at key `Key` in store found at key `StoreKey` in the multistore

#### Proposal Processing Queue [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-processing-queue "Direct link to Proposal Processing Queue")

**Store:**

- `ProposalProcessingQueue`: A queue `queue[proposalID]` containing all the<br/>
  `ProposalIDs` of proposals that reached `MinDeposit`. During each `EndBlock`,<br/>
  all the proposals that have reached the end of their voting period are processed.<br/>
  To process a finished proposal, the application tallies the votes, computes the<br/>
  votes of each validator and checks if every validator in the validator set has<br/>
  voted. If the proposal is accepted, deposits are refunded. Finally, the proposal<br/>
  content `Handler` is executed.

And the pseudocode for the `ProposalProcessingQueue`:

```codeBlockLines_e6Vv
  in EndBlock do

    for finishedProposalID in GetAllFinishedProposalIDs(block.Time)
      proposal = load(Governance, <proposalID|'proposal'>) // proposal is a const key

      validators = Keeper.getAllValidators()
      tmpValMap := map(sdk.AccAddress)ValidatorGovInfo

      // Initiate mapping at 0. This is the amount of shares of the validator's vote that will be overridden by their delegator's votes
      for each validator in validators
        tmpValMap(validator.OperatorAddr).Minus = 0

      // Tally
      voterIterator = rangeQuery(Governance, <proposalID|'addresses'>) //return all the addresses that voted on the proposal
      for each (voterAddress, vote) in voterIterator
        delegations = stakingKeeper.getDelegations(voterAddress) // get all delegations for current voter

        for each delegation in delegations
          // make sure delegation.Shares does NOT include shares being unbonded
          tmpValMap(delegation.ValidatorAddr).Minus += delegation.Shares
          proposal.updateTally(vote, delegation.Shares)

        _, isVal = stakingKeeper.getValidator(voterAddress)
        if (isVal)
          tmpValMap(voterAddress).Vote = vote

      tallyingParam = load(GlobalParams, 'TallyingParam')

      // Update tally if validator voted
      for each validator in validators
        if tmpValMap(validator).HasVoted
          proposal.updateTally(tmpValMap(validator).Vote, (validator.TotalShares - tmpValMap(validator).Minus))

      // Check if proposal is accepted or rejected
      totalNonAbstain := proposal.YesVotes + proposal.NoVotes + proposal.NoWithVetoVotes
      if (proposal.Votes.YesVotes/totalNonAbstain > tallyingParam.Threshold AND proposal.Votes.NoWithVetoVotes/totalNonAbstain  < tallyingParam.Veto)
        //  proposal was accepted at the end of the voting period
        //  refund deposits (non-voters already punished)
        for each (amount, depositor) in proposal.Deposits
          depositor.AtomBalance += amount

        stateWriter, err := proposal.Handler()
        if err != nil
            // proposal passed but failed during state execution
            proposal.CurrentStatus = ProposalStatusFailed
         else
            // proposal pass and state is persisted
            proposal.CurrentStatus = ProposalStatusAccepted
            stateWriter.save()
      else
        // proposal was rejected
        proposal.CurrentStatus = ProposalStatusRejected

      store(Governance, <proposalID|'proposal'>, proposal)

```

#### Legacy Proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#legacy-proposal "Direct link to Legacy Proposal")

danger

Legacy proposals are deprecated. Use the new proposal flow by granting the governance module the right to execute the message.

A legacy proposal is the old implementation of governance proposal.<br/>
Contrary to proposal that can contain any messages, a legacy proposal allows to submit a set of pre-defined proposals.<br/>
These proposals are defined by their types and handled by handlers that are registered in the gov v1beta1 router.

More information on how to submit proposals in the [client section](https://docs.cosmos.network/v0.50/build/modules/gov#client).

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/gov#messages "Direct link to Messages")

#### Proposal Submission [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-submission-1 "Direct link to Proposal Submission")

Proposals can be submitted by any account via a `MsgSubmitProposal` transaction.

proto/cosmos/gov/v1/tx.proto

```codeBlockLines_e6Vv
// MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary
// proposal Content.
message MsgSubmitProposal {
  option (cosmos.msg.v1.signer) = "proposer";
  option (amino.name)           = "cosmos-sdk/v1/MsgSubmitProposal";

  // messages are the arbitrary messages to be executed if proposal passes.
  repeated google.protobuf.Any messages             = 1;

  // initial_deposit is the deposit value that must be paid at proposal submission.
  repeated cosmos.base.v1beta1.Coin initial_deposit = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // proposer is the account address of the proposer.
  string                            proposer        = 3 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // metadata is any arbitrary metadata attached to the proposal.
  string metadata = 4;

  // title is the title of the proposal.
  //
  // Since: cosmos-sdk 0.47
  string title = 5;

  // summary is the summary of the proposal
  //
  // Since: cosmos-sdk 0.47
  string summary = 6;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/tx.proto#L42-L69)

All `sdk.Msgs` passed into the `messages` field of a `MsgSubmitProposal` message<br/>
must be registered in the app's `MsgServiceRouter`. Each of these messages must<br/>
have one signer, namely the gov module account. And finally, the metadata length<br/>
must not be larger than the `maxMetadataLen` config passed into the gov keeper.<br/>
The `initialDeposit` must be strictly positive and conform to the accepted denom of the `MinDeposit` param.

**State modifications:**

- Generate new `proposalID`
- Create new `Proposal`
- Initialise `Proposal`'s attributes
- Decrease balance of sender by `InitialDeposit`
- If `MinDeposit` is reached:
  - Push `proposalID` in `ProposalProcessingQueue`
- Transfer `InitialDeposit` from the `Proposer` to the governance `ModuleAccount`

#### Deposit [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-2 "Direct link to Deposit")

Once a proposal is submitted, if `Proposal.TotalDeposit < ActiveParam.MinDeposit`, Atom holders can send<br/>
`MsgDeposit` transactions to increase the proposal's deposit.

A deposit is accepted iff:

- The proposal exists
- The proposal is not in the voting period
- The deposited coins are conform to the accepted denom from the `MinDeposit` param

proto/cosmos/gov/v1/tx.proto

```codeBlockLines_e6Vv
// MsgDeposit defines a message to submit a deposit to an existing proposal.
message MsgDeposit {
  option (cosmos.msg.v1.signer) = "depositor";
  option (amino.name)           = "cosmos-sdk/v1/MsgDeposit";

  // proposal_id defines the unique id of the proposal.
  uint64   proposal_id                     = 1 [(gogoproto.jsontag) = "proposal_id", (amino.dont_omitempty) = true];

  // depositor defines the deposit addresses from the proposals.
  string   depositor                       = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // amount to be deposited by depositor.
  repeated cosmos.base.v1beta1.Coin amount = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/tx.proto#L134-L147)

**State modifications:**

- Decrease balance of sender by `deposit`
- Add `deposit` of sender in `proposal.Deposits`
- Increase `proposal.TotalDeposit` by sender's `deposit`
- If `MinDeposit` is reached:
  - Push `proposalID` in `ProposalProcessingQueueEnd`
- Transfer `Deposit` from the `proposer` to the governance `ModuleAccount`

#### Vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#vote-1 "Direct link to Vote")

Once `ActiveParam.MinDeposit` is reached, voting period starts. From there,<br/>
bonded Atom holders are able to send `MsgVote` transactions to cast their<br/>
vote on the proposal.

proto/cosmos/gov/v1/tx.proto

```codeBlockLines_e6Vv
// MsgVote defines a message to cast a vote.
message MsgVote {
  option (cosmos.msg.v1.signer) = "voter";
  option (amino.name)           = "cosmos-sdk/v1/MsgVote";

  // proposal_id defines the unique id of the proposal.
  uint64     proposal_id = 1 [(gogoproto.jsontag) = "proposal_id", (amino.dont_omitempty) = true];

  // voter is the voter address for the proposal.
  string     voter       = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // option defines the vote option.
  VoteOption option      = 3;

  // metadata is any arbitrary metadata attached to the Vote.
  string     metadata    = 4;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/gov/v1/tx.proto#L92-L108)

**State modifications:**

- Record `Vote` of sender

note

Gas cost for this message has to take into account the future tallying of the vote in EndBlocker.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/gov#events "Direct link to Events")

The governance module emits the following events:

#### EndBlocker [​](https://docs.cosmos.network/v0.50/build/modules/gov#endblocker "Direct link to EndBlocker")

| Type              | Attribute Key   | Attribute Value  |
| ----------------- | --------------- | ---------------- |
| inactive_proposal | proposal_id     | {proposalID}     |
| inactive_proposal | proposal_result | {proposalResult} |
| active_proposal   | proposal_id     | {proposalID}     |
| active_proposal   | proposal_result | {proposalResult} |

#### Handlers [​](https://docs.cosmos.network/v0.50/build/modules/gov#handlers "Direct link to Handlers")

##### MsgSubmitProposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#msgsubmitproposal "Direct link to MsgSubmitProposal")

| Type                  | Attribute Key       | Attribute Value |
| --------------------- | ------------------- | --------------- |
| submit_proposal       | proposal_id         | {proposalID}    |
| submit_proposal \[0\] | voting_period_start | {proposalID}    |
| proposal_deposit      | amount              | {depositAmount} |
| proposal_deposit      | proposal_id         | {proposalID}    |
| message               | module              | governance      |
| message               | action              | submit_proposal |
| message               | sender              | {senderAddress} |

- \[0\] Event only emitted if the voting period starts during the submission.

##### MsgVote [​](https://docs.cosmos.network/v0.50/build/modules/gov#msgvote "Direct link to MsgVote")

| Type          | Attribute Key | Attribute Value |
| ------------- | ------------- | --------------- |
| proposal_vote | option        | {voteOption}    |
| proposal_vote | proposal_id   | {proposalID}    |
| message       | module        | governance      |
| message       | action        | vote            |
| message       | sender        | {senderAddress} |

##### MsgVoteWeighted [​](https://docs.cosmos.network/v0.50/build/modules/gov#msgvoteweighted "Direct link to MsgVoteWeighted")

| Type          | Attribute Key | Attribute Value       |
| ------------- | ------------- | --------------------- |
| proposal_vote | option        | {weightedVoteOptions} |
| proposal_vote | proposal_id   | {proposalID}          |
| message       | module        | governance            |
| message       | action        | vote                  |
| message       | sender        | {senderAddress}       |

##### MsgDeposit [​](https://docs.cosmos.network/v0.50/build/modules/gov#msgdeposit "Direct link to MsgDeposit")

| Type                   | Attribute Key       | Attribute Value |
| ---------------------- | ------------------- | --------------- |
| proposal_deposit       | amount              | {depositAmount} |
| proposal_deposit       | proposal_id         | {proposalID}    |
| proposal_deposit \[0\] | voting_period_start | {proposalID}    |
| message                | module              | governance      |
| message                | action              | deposit         |
| message                | sender              | {senderAddress} |

- \[0\] Event only emitted if the voting period starts during the submission.

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/gov#parameters "Direct link to Parameters")

The governance module contains the following parameters:

| Key                           | Type             | Example                                   |
| ----------------------------- | ---------------- | ----------------------------------------- |
| min_deposit                   | array (coins)    | \[{"denom":"uatom","amount":"10000000"}\] |
| max_deposit_period            | string (time ns) | "172800000000000" (17280s)                |
| voting_period                 | string (time ns) | "172800000000000" (17280s)                |
| quorum                        | string (dec)     | "0.334000000000000000"                    |
| threshold                     | string (dec)     | "0.500000000000000000"                    |
| veto                          | string (dec)     | "0.334000000000000000"                    |
| expedited_threshold           | string (time ns) | "0.667000000000000000"                    |
| expedited_voting_period       | string (time ns) | "86400000000000" (8600s)                  |
| expedited_min_deposit         | array (coins)    | \[{"denom":"uatom","amount":"50000000"}\] |
| burn_proposal_deposit_prevote | bool             | false                                     |
| burn_vote_quorum              | bool             | false                                     |
| burn_vote_veto                | bool             | true                                      |
| min_initial_deposit_ratio     | string           | "0.1"                                     |

**NOTE**: The governance module contains parameters that are objects unlike other<br/>
modules. If only a subset of parameters are desired to be changed, only they need<br/>
to be included and not the entire parameter object structure.

### Client [​](https://docs.cosmos.network/v0.50/build/modules/gov#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/gov#cli "Direct link to CLI")

A user can query and interact with the `gov` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/gov#query "Direct link to Query")

The `query` commands allow users to query `gov` state.

```codeBlockLines_e6Vv
simd query gov --help

```

###### Deposit [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-3 "Direct link to deposit")

The `deposit` command allows users to query a deposit for a given proposal from a given depositor.

```codeBlockLines_e6Vv
simd query gov deposit [proposal-id] [depositer-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov deposit 1 cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
amount:
- amount: "100"
  denom: stake
depositor: cosmos1..
proposal_id: "1"

```

###### Deposits [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposits "Direct link to deposits")

The `deposits` command allows users to query all deposits for a given proposal.

```codeBlockLines_e6Vv
simd query gov deposits [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov deposits 1

```

Example Output:

```codeBlockLines_e6Vv
deposits:
- amount:
  - amount: "100"
    denom: stake
  depositor: cosmos1..
  proposal_id: "1"
pagination:
  next_key: null
  total: "0"

```

###### Param [​](https://docs.cosmos.network/v0.50/build/modules/gov#param "Direct link to param")

The `param` command allows users to query a given parameter for the `gov` module.

```codeBlockLines_e6Vv
simd query gov param [param-type] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov param voting

```

Example Output:

```codeBlockLines_e6Vv
voting_period: "172800000000000"

```

###### Params [​](https://docs.cosmos.network/v0.50/build/modules/gov#params "Direct link to params")

The `params` command allows users to query all parameters for the `gov` module.

```codeBlockLines_e6Vv
simd query gov params [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov params

```

Example Output:

```codeBlockLines_e6Vv
deposit_params:
  max_deposit_period: 172800s
  min_deposit:
  - amount: "10000000"
    denom: stake
params:
  expedited_min_deposit:
  - amount: "50000000"
    denom: stake
  expedited_threshold: "0.670000000000000000"
  expedited_voting_period: 86400s
  max_deposit_period: 172800s
  min_deposit:
  - amount: "10000000"
    denom: stake
  min_initial_deposit_ratio: "0.000000000000000000"
  proposal_cancel_burn_rate: "0.500000000000000000"
  quorum: "0.334000000000000000"
  threshold: "0.500000000000000000"
  veto_threshold: "0.334000000000000000"
  voting_period: 172800s
tally_params:
  quorum: "0.334000000000000000"
  threshold: "0.500000000000000000"
  veto_threshold: "0.334000000000000000"
voting_params:
  voting_period: 172800s

```

###### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal "Direct link to proposal")

The `proposal` command allows users to query a given proposal.

```codeBlockLines_e6Vv
simd query gov proposal [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov proposal 1

```

Example Output:

```codeBlockLines_e6Vv
deposit_end_time: "2022-03-30T11:50:20.819676256Z"
final_tally_result:
  abstain_count: "0"
  no_count: "0"
  no_with_veto_count: "0"
  yes_count: "0"
id: "1"
messages:
- '@type': /cosmos.bank.v1beta1.MsgSend
  amount:
  - amount: "10"
    denom: stake
  from_address: cosmos1..
  to_address: cosmos1..
metadata: AQ==
status: PROPOSAL_STATUS_DEPOSIT_PERIOD
submit_time: "2022-03-28T11:50:20.819676256Z"
total_deposit:
- amount: "10"
  denom: stake
voting_end_time: null
voting_start_time: null

```

###### Proposals [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposals-1 "Direct link to proposals")

The `proposals` command allows users to query all proposals with optional filters.

```codeBlockLines_e6Vv
simd query gov proposals [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov proposals

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "0"
proposals:
- deposit_end_time: "2022-03-30T11:50:20.819676256Z"
  final_tally_result:
    abstain_count: "0"
    no_count: "0"
    no_with_veto_count: "0"
    yes_count: "0"
  id: "1"
  messages:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "10"
      denom: stake
    from_address: cosmos1..
    to_address: cosmos1..
  metadata: AQ==
  status: PROPOSAL_STATUS_DEPOSIT_PERIOD
  submit_time: "2022-03-28T11:50:20.819676256Z"
  total_deposit:
  - amount: "10"
    denom: stake
  voting_end_time: null
  voting_start_time: null
- deposit_end_time: "2022-03-30T14:02:41.165025015Z"
  final_tally_result:
    abstain_count: "0"
    no_count: "0"
    no_with_veto_count: "0"
    yes_count: "0"
  id: "2"
  messages:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "10"
      denom: stake
    from_address: cosmos1..
    to_address: cosmos1..
  metadata: AQ==
  status: PROPOSAL_STATUS_DEPOSIT_PERIOD
  submit_time: "2022-03-28T14:02:41.165025015Z"
  total_deposit:
  - amount: "10"
    denom: stake
  voting_end_time: null
  voting_start_time: null

```

###### Proposer [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposer "Direct link to proposer")

The `proposer` command allows users to query the proposer for a given proposal.

```codeBlockLines_e6Vv
simd query gov proposer [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov proposer 1

```

Example Output:

```codeBlockLines_e6Vv
proposal_id: "1"
proposer: cosmos1..

```

###### Tally [​](https://docs.cosmos.network/v0.50/build/modules/gov#tally "Direct link to tally")

The `tally` command allows users to query the tally of a given proposal vote.

```codeBlockLines_e6Vv
simd query gov tally [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov tally 1

```

Example Output:

```codeBlockLines_e6Vv
abstain: "0"
"no": "0"
no_with_veto: "0"
"yes": "1"

```

###### Vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#vote-2 "Direct link to vote")

The `vote` command allows users to query a vote for a given proposal.

```codeBlockLines_e6Vv
simd query gov vote [proposal-id] [voter-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov vote 1 cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
option: VOTE_OPTION_YES
options:
- option: VOTE_OPTION_YES
  weight: "1.000000000000000000"
proposal_id: "1"
voter: cosmos1..

```

###### Votes [​](https://docs.cosmos.network/v0.50/build/modules/gov#votes "Direct link to votes")

The `votes` command allows users to query all votes for a given proposal.

```codeBlockLines_e6Vv
simd query gov votes [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query gov votes 1

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "0"
votes:
- option: VOTE_OPTION_YES
  options:
  - option: VOTE_OPTION_YES
    weight: "1.000000000000000000"
  proposal_id: "1"
  voter: cosmos1..

```

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/gov#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `gov` module.

```codeBlockLines_e6Vv
simd tx gov --help

```

###### Deposit [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-4 "Direct link to deposit")

The `deposit` command allows users to deposit tokens for a given proposal.

```codeBlockLines_e6Vv
simd tx gov deposit [proposal-id] [deposit] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx gov deposit 1 10000000stake --from cosmos1..

```

###### Draft-proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#draft-proposal "Direct link to draft-proposal")

The `draft-proposal` command allows users to draft any type of proposal.<br/>
The command returns a `draft_proposal.json`, to be used by `submit-proposal` after being completed.<br/>
The `draft_metadata.json` is meant to be uploaded to [IPFS](https://docs.cosmos.network/v0.50/build/modules/gov#metadata).

```codeBlockLines_e6Vv
simd tx gov draft-proposal

```

###### Submit-proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#submit-proposal "Direct link to submit-proposal")

The `submit-proposal` command allows users to submit a governance proposal along with some messages and metadata.<br/>
Messages, metadata and deposit are defined in a JSON file.

```codeBlockLines_e6Vv
simd tx gov submit-proposal [path-to-proposal-json] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx gov submit-proposal /path/to/proposal.json --from cosmos1..

```

where `proposal.json` contains:

```codeBlockLines_e6Vv
{
  "messages": [\
    {\
      "@type": "/cosmos.bank.v1beta1.MsgSend",\
      "from_address": "cosmos1...", // The gov module module address\
      "to_address": "cosmos1...",\
      "amount":[{"denom": "stake","amount": "10"}]\
    }\
  ],
  "metadata": "AQ==",
  "deposit": "10stake",
  "title": "Proposal Title",
  "summary": "Proposal Summary"
}

```

note

By default the metadata, summary and title are both limited by 255 characters, this can be overridden by the application developer.

tip

When metadata is not specified, the title is limited to 255 characters and the summary 40x the title length.

###### Submit-legacy-proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#submit-legacy-proposal "Direct link to submit-legacy-proposal")

The `submit-legacy-proposal` command allows users to submit a governance legacy proposal along with an initial deposit.

```codeBlockLines_e6Vv
simd tx gov submit-legacy-proposal [command] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx gov submit-legacy-proposal --title="Test Proposal" --description="testing" --type="Text" --deposit="100000000stake" --from cosmos1..

```

Example (`param-change`):

```codeBlockLines_e6Vv
simd tx gov submit-legacy-proposal param-change proposal.json --from cosmos1..

```

```codeBlockLines_e6Vv
{
  "title": "Test Proposal",
  "description": "testing, testing, 1, 2, 3",
  "changes": [\
    {\
      "subspace": "staking",\
      "key": "MaxValidators",\
      "value": 100\
    }\
  ],
  "deposit": "10000000stake"
}

```

##### Cancel-proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#cancel-proposal "Direct link to cancel-proposal")

Once proposal is canceled, from the deposits of proposal `deposits * proposal_cancel_ratio` will be burned or sent to `ProposalCancelDest` address, if `ProposalCancelDest` is empty then deposits will be burned. The `remaining deposits` will be sent to depositers.

```codeBlockLines_e6Vv
simd tx gov cancel-proposal [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx gov cancel-proposal 1 --from cosmos1...

```

###### Vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#vote-3 "Direct link to vote")

The `vote` command allows users to submit a vote for a given governance proposal.

```codeBlockLines_e6Vv
simd tx gov vote [command] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx gov vote 1 yes --from cosmos1..

```

###### Weighted-vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#weighted-vote "Direct link to weighted-vote")

The `weighted-vote` command allows users to submit a weighted vote for a given governance proposal.

```codeBlockLines_e6Vv
simd tx gov weighted-vote [proposal-id] [weighted-options] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx gov weighted-vote 1 yes=0.5,no=0.5 --from cosmos1..

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/gov#grpc "Direct link to gRPC")

A user can query the `gov` module using gRPC endpoints.

##### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-1 "Direct link to Proposal")

The `Proposal` endpoint allows users to query a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/Proposal

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/Proposal

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposal": {
    "proposalId": "1",
    "content": {"@type":"/cosmos.gov.v1beta1.TextProposal","description":"testing, testing, 1, 2, 3","title":"Test Proposal"},
    "status": "PROPOSAL_STATUS_VOTING_PERIOD",
    "finalTallyResult": {
      "yes": "0",
      "abstain": "0",
      "no": "0",
      "noWithVeto": "0"
    },
    "submitTime": "2021-09-16T19:40:08.712440474Z",
    "depositEndTime": "2021-09-18T19:40:08.712440474Z",
    "totalDeposit": [\
      {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    ],
    "votingStartTime": "2021-09-16T19:40:08.712440474Z",
    "votingEndTime": "2021-09-18T19:40:08.712440474Z",
    "title": "Test Proposal",
    "summary": "testing, testing, 1, 2, 3"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/Proposal

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1.Query/Proposal

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposal": {
    "id": "1",
    "messages": [\
      {"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"denom":"stake","amount":"10"}],"fromAddress":"cosmos1..","toAddress":"cosmos1.."}\
    ],
    "status": "PROPOSAL_STATUS_VOTING_PERIOD",
    "finalTallyResult": {
      "yesCount": "0",
      "abstainCount": "0",
      "noCount": "0",
      "noWithVetoCount": "0"
    },
    "submitTime": "2022-03-28T11:50:20.819676256Z",
    "depositEndTime": "2022-03-30T11:50:20.819676256Z",
    "totalDeposit": [\
      {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    ],
    "votingStartTime": "2022-03-28T14:25:26.644857113Z",
    "votingEndTime": "2022-03-30T14:25:26.644857113Z",
    "metadata": "AQ==",
    "title": "Test Proposal",
    "summary": "testing, testing, 1, 2, 3"
  }
}

```

##### Proposals [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposals-2 "Direct link to Proposals")

The `Proposals` endpoint allows users to query all proposals with optional filters.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/Proposals

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/Proposals

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposals": [\
    {\
      "proposalId": "1",\
      "status": "PROPOSAL_STATUS_VOTING_PERIOD",\
      "finalTallyResult": {\
        "yes": "0",\
        "abstain": "0",\
        "no": "0",\
        "noWithVeto": "0"\
      },\
      "submitTime": "2022-03-28T11:50:20.819676256Z",\
      "depositEndTime": "2022-03-30T11:50:20.819676256Z",\
      "totalDeposit": [\
        {\
          "denom": "stake",\
          "amount": "10000000010"\
        }\
      ],\
      "votingStartTime": "2022-03-28T14:25:26.644857113Z",\
      "votingEndTime": "2022-03-30T14:25:26.644857113Z"\
    },\
    {\
      "proposalId": "2",\
      "status": "PROPOSAL_STATUS_DEPOSIT_PERIOD",\
      "finalTallyResult": {\
        "yes": "0",\
        "abstain": "0",\
        "no": "0",\
        "noWithVeto": "0"\
      },\
      "submitTime": "2022-03-28T14:02:41.165025015Z",\
      "depositEndTime": "2022-03-30T14:02:41.165025015Z",\
      "totalDeposit": [\
        {\
          "denom": "stake",\
          "amount": "10"\
        }\
      ],\
      "votingStartTime": "0001-01-01T00:00:00Z",\
      "votingEndTime": "0001-01-01T00:00:00Z"\
    }\
  ],
  "pagination": {
    "total": "2"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/Proposals

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    localhost:9090 \
    cosmos.gov.v1.Query/Proposals

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposals": [\
    {\
      "id": "1",\
      "messages": [\
        {"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"denom":"stake","amount":"10"}],"fromAddress":"cosmos1..","toAddress":"cosmos1.."}\
      ],\
      "status": "PROPOSAL_STATUS_VOTING_PERIOD",\
      "finalTallyResult": {\
        "yesCount": "0",\
        "abstainCount": "0",\
        "noCount": "0",\
        "noWithVetoCount": "0"\
      },\
      "submitTime": "2022-03-28T11:50:20.819676256Z",\
      "depositEndTime": "2022-03-30T11:50:20.819676256Z",\
      "totalDeposit": [\
        {\
          "denom": "stake",\
          "amount": "10000000010"\
        }\
      ],\
      "votingStartTime": "2022-03-28T14:25:26.644857113Z",\
      "votingEndTime": "2022-03-30T14:25:26.644857113Z",\
      "metadata": "AQ==",\
      "title": "Proposal Title",\
      "summary": "Proposal Summary"\
    },\
    {\
      "id": "2",\
      "messages": [\
        {"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"denom":"stake","amount":"10"}],"fromAddress":"cosmos1..","toAddress":"cosmos1.."}\
      ],\
      "status": "PROPOSAL_STATUS_DEPOSIT_PERIOD",\
      "finalTallyResult": {\
        "yesCount": "0",\
        "abstainCount": "0",\
        "noCount": "0",\
        "noWithVetoCount": "0"\
      },\
      "submitTime": "2022-03-28T14:02:41.165025015Z",\
      "depositEndTime": "2022-03-30T14:02:41.165025015Z",\
      "totalDeposit": [\
        {\
          "denom": "stake",\
          "amount": "10"\
        }\
      ],\
      "metadata": "AQ==",\
      "title": "Proposal Title",\
      "summary": "Proposal Summary"\
    }\
  ],
  "pagination": {
    "total": "2"
  }
}

```

##### Vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#vote-4 "Direct link to Vote")

The `Vote` endpoint allows users to query a vote for a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/Vote

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1","voter":"cosmos1.."}' \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/Vote

```

Example Output:

```codeBlockLines_e6Vv
{
  "vote": {
    "proposalId": "1",
    "voter": "cosmos1..",
    "option": "VOTE_OPTION_YES",
    "options": [\
      {\
        "option": "VOTE_OPTION_YES",\
        "weight": "1000000000000000000"\
      }\
    ]
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/Vote

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1","voter":"cosmos1.."}' \
    localhost:9090 \
    cosmos.gov.v1.Query/Vote

```

Example Output:

```codeBlockLines_e6Vv
{
  "vote": {
    "proposalId": "1",
    "voter": "cosmos1..",
    "option": "VOTE_OPTION_YES",
    "options": [\
      {\
        "option": "VOTE_OPTION_YES",\
        "weight": "1.000000000000000000"\
      }\
    ]
  }
}

```

##### Votes [​](https://docs.cosmos.network/v0.50/build/modules/gov#votes-1 "Direct link to Votes")

The `Votes` endpoint allows users to query all votes for a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/Votes

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/Votes

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposalId": "1",\
      "voter": "cosmos1..",\
      "options": [\
        {\
          "option": "VOTE_OPTION_YES",\
          "weight": "1000000000000000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/Votes

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1.Query/Votes

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposalId": "1",\
      "voter": "cosmos1..",\
      "options": [\
        {\
          "option": "VOTE_OPTION_YES",\
          "weight": "1.000000000000000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/gov#params-1 "Direct link to Params")

The `Params` endpoint allows users to query all parameters for the `gov` module.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/Params

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"params_type":"voting"}' \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/Params

```

Example Output:

```codeBlockLines_e6Vv
{
  "votingParams": {
    "votingPeriod": "172800s"
  },
  "depositParams": {
    "maxDepositPeriod": "0s"
  },
  "tallyParams": {
    "quorum": "MA==",
    "threshold": "MA==",
    "vetoThreshold": "MA=="
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/Params

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"params_type":"voting"}' \
    localhost:9090 \
    cosmos.gov.v1.Query/Params

```

Example Output:

```codeBlockLines_e6Vv
{
  "votingParams": {
    "votingPeriod": "172800s"
  }
}

```

##### Deposit [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposit-5 "Direct link to Deposit")

The `Deposit` endpoint allows users to query a deposit for a given proposal from a given depositor.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/Deposit

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    '{"proposal_id":"1","depositor":"cosmos1.."}' \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/Deposit

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposit": {
    "proposalId": "1",
    "depositor": "cosmos1..",
    "amount": [\
      {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    ]
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/Deposit

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    '{"proposal_id":"1","depositor":"cosmos1.."}' \
    localhost:9090 \
    cosmos.gov.v1.Query/Deposit

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposit": {
    "proposalId": "1",
    "depositor": "cosmos1..",
    "amount": [\
      {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    ]
  }
}

```

##### Deposits [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposits-1 "Direct link to deposits")

The `Deposits` endpoint allows users to query all deposits for a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/Deposits

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/Deposits

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposits": [\
    {\
      "proposalId": "1",\
      "depositor": "cosmos1..",\
      "amount": [\
        {\
          "denom": "stake",\
          "amount": "10000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/Deposits

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1.Query/Deposits

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposits": [\
    {\
      "proposalId": "1",\
      "depositor": "cosmos1..",\
      "amount": [\
        {\
          "denom": "stake",\
          "amount": "10000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

##### TallyResult [​](https://docs.cosmos.network/v0.50/build/modules/gov#tallyresult "Direct link to TallyResult")

The `TallyResult` endpoint allows users to query the tally of a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
cosmos.gov.v1beta1.Query/TallyResult

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1beta1.Query/TallyResult

```

Example Output:

```codeBlockLines_e6Vv
{
  "tally": {
    "yes": "1000000",
    "abstain": "0",
    "no": "0",
    "noWithVeto": "0"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
cosmos.gov.v1.Query/TallyResult

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}' \
    localhost:9090 \
    cosmos.gov.v1.Query/TallyResult

```

Example Output:

```codeBlockLines_e6Vv
{
  "tally": {
    "yes": "1000000",
    "abstain": "0",
    "no": "0",
    "noWithVeto": "0"
  }
}

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/gov#rest "Direct link to REST")

A user can query the `gov` module using REST endpoints.

##### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-2 "Direct link to proposal")

The `proposals` endpoint allows users to query a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/proposals/{proposal_id}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/proposals/1

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposal": {
    "proposal_id": "1",
    "content": null,
    "status": "PROPOSAL_STATUS_VOTING_PERIOD",
    "final_tally_result": {
      "yes": "0",
      "abstain": "0",
      "no": "0",
      "no_with_veto": "0"
    },
    "submit_time": "2022-03-28T11:50:20.819676256Z",
    "deposit_end_time": "2022-03-30T11:50:20.819676256Z",
    "total_deposit": [\
      {\
        "denom": "stake",\
        "amount": "10000000010"\
      }\
    ],
    "voting_start_time": "2022-03-28T14:25:26.644857113Z",
    "voting_end_time": "2022-03-30T14:25:26.644857113Z"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/proposals/{proposal_id}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/proposals/1

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposal": {
    "id": "1",
    "messages": [\
      {\
        "@type": "/cosmos.bank.v1beta1.MsgSend",\
        "from_address": "cosmos1..",\
        "to_address": "cosmos1..",\
        "amount": [\
          {\
            "denom": "stake",\
            "amount": "10"\
          }\
        ]\
      }\
    ],
    "status": "PROPOSAL_STATUS_VOTING_PERIOD",
    "final_tally_result": {
      "yes_count": "0",
      "abstain_count": "0",
      "no_count": "0",
      "no_with_veto_count": "0"
    },
    "submit_time": "2022-03-28T11:50:20.819676256Z",
    "deposit_end_time": "2022-03-30T11:50:20.819676256Z",
    "total_deposit": [\
      {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    ],
    "voting_start_time": "2022-03-28T14:25:26.644857113Z",
    "voting_end_time": "2022-03-30T14:25:26.644857113Z",
    "metadata": "AQ==",
    "title": "Proposal Title",
    "summary": "Proposal Summary"
  }
}

```

##### Proposals [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposals-3 "Direct link to proposals")

The `proposals` endpoint also allows users to query all proposals with optional filters.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/proposals

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/proposals

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposals": [\
    {\
      "proposal_id": "1",\
      "content": null,\
      "status": "PROPOSAL_STATUS_VOTING_PERIOD",\
      "final_tally_result": {\
        "yes": "0",\
        "abstain": "0",\
        "no": "0",\
        "no_with_veto": "0"\
      },\
      "submit_time": "2022-03-28T11:50:20.819676256Z",\
      "deposit_end_time": "2022-03-30T11:50:20.819676256Z",\
      "total_deposit": [\
        {\
          "denom": "stake",\
          "amount": "10000000"\
        }\
      ],\
      "voting_start_time": "2022-03-28T14:25:26.644857113Z",\
      "voting_end_time": "2022-03-30T14:25:26.644857113Z"\
    },\
    {\
      "proposal_id": "2",\
      "content": null,\
      "status": "PROPOSAL_STATUS_DEPOSIT_PERIOD",\
      "final_tally_result": {\
        "yes": "0",\
        "abstain": "0",\
        "no": "0",\
        "no_with_veto": "0"\
      },\
      "submit_time": "2022-03-28T14:02:41.165025015Z",\
      "deposit_end_time": "2022-03-30T14:02:41.165025015Z",\
      "total_deposit": [\
        {\
          "denom": "stake",\
          "amount": "10"\
        }\
      ],\
      "voting_start_time": "0001-01-01T00:00:00Z",\
      "voting_end_time": "0001-01-01T00:00:00Z"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/proposals

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/proposals

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposals": [\
    {\
      "id": "1",\
      "messages": [\
        {\
          "@type": "/cosmos.bank.v1beta1.MsgSend",\
          "from_address": "cosmos1..",\
          "to_address": "cosmos1..",\
          "amount": [\
            {\
              "denom": "stake",\
              "amount": "10"\
            }\
          ]\
        }\
      ],\
      "status": "PROPOSAL_STATUS_VOTING_PERIOD",\
      "final_tally_result": {\
        "yes_count": "0",\
        "abstain_count": "0",\
        "no_count": "0",\
        "no_with_veto_count": "0"\
      },\
      "submit_time": "2022-03-28T11:50:20.819676256Z",\
      "deposit_end_time": "2022-03-30T11:50:20.819676256Z",\
      "total_deposit": [\
        {\
          "denom": "stake",\
          "amount": "10000000010"\
        }\
      ],\
      "voting_start_time": "2022-03-28T14:25:26.644857113Z",\
      "voting_end_time": "2022-03-30T14:25:26.644857113Z",\
      "metadata": "AQ==",\
      "title": "Proposal Title",\
      "summary": "Proposal Summary"\
    },\
    {\
      "id": "2",\
      "messages": [\
        {\
          "@type": "/cosmos.bank.v1beta1.MsgSend",\
          "from_address": "cosmos1..",\
          "to_address": "cosmos1..",\
          "amount": [\
            {\
              "denom": "stake",\
              "amount": "10"\
            }\
          ]\
        }\
      ],\
      "status": "PROPOSAL_STATUS_DEPOSIT_PERIOD",\
      "final_tally_result": {\
        "yes_count": "0",\
        "abstain_count": "0",\
        "no_count": "0",\
        "no_with_veto_count": "0"\
      },\
      "submit_time": "2022-03-28T14:02:41.165025015Z",\
      "deposit_end_time": "2022-03-30T14:02:41.165025015Z",\
      "total_deposit": [\
        {\
          "denom": "stake",\
          "amount": "10"\
        }\
      ],\
      "voting_start_time": null,\
      "voting_end_time": null,\
      "metadata": "AQ==",\
      "title": "Proposal Title",\
      "summary": "Proposal Summary"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }
}

```

##### Voter Vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#voter-vote "Direct link to voter vote")

The `votes` endpoint allows users to query a vote for a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/proposals/{proposal_id}/votes/{voter}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/proposals/1/votes/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "vote": {
    "proposal_id": "1",
    "voter": "cosmos1..",
    "option": "VOTE_OPTION_YES",
    "options": [\
      {\
        "option": "VOTE_OPTION_YES",\
        "weight": "1.000000000000000000"\
      }\
    ]
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/proposals/{proposal_id}/votes/{voter}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/proposals/1/votes/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "vote": {
    "proposal_id": "1",
    "voter": "cosmos1..",
    "options": [\
      {\
        "option": "VOTE_OPTION_YES",\
        "weight": "1.000000000000000000"\
      }\
    ],
    "metadata": ""
  }
}

```

##### Votes [​](https://docs.cosmos.network/v0.50/build/modules/gov#votes-2 "Direct link to votes")

The `votes` endpoint allows users to query all votes for a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/proposals/{proposal_id}/votes

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/proposals/1/votes

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposal_id": "1",\
      "voter": "cosmos1..",\
      "option": "VOTE_OPTION_YES",\
      "options": [\
        {\
          "option": "VOTE_OPTION_YES",\
          "weight": "1.000000000000000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/proposals/{proposal_id}/votes

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/proposals/1/votes

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposal_id": "1",\
      "voter": "cosmos1..",\
      "options": [\
        {\
          "option": "VOTE_OPTION_YES",\
          "weight": "1.000000000000000000"\
        }\
      ],\
      "metadata": ""\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/gov#params-2 "Direct link to params")

The `params` endpoint allows users to query all parameters for the `gov` module.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/params/{params_type}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/params/voting

```

Example Output:

```codeBlockLines_e6Vv
{
  "voting_params": {
    "voting_period": "172800s"
  },
  "deposit_params": {
    "min_deposit": [\
    ],
    "max_deposit_period": "0s"
  },
  "tally_params": {
    "quorum": "0.000000000000000000",
    "threshold": "0.000000000000000000",
    "veto_threshold": "0.000000000000000000"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/params/{params_type}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/params/voting

```

Example Output:

```codeBlockLines_e6Vv
{
  "voting_params": {
    "voting_period": "172800s"
  },
  "deposit_params": {
    "min_deposit": [\
    ],
    "max_deposit_period": "0s"
  },
  "tally_params": {
    "quorum": "0.000000000000000000",
    "threshold": "0.000000000000000000",
    "veto_threshold": "0.000000000000000000"
  }
}

```

##### Deposits [​](https://docs.cosmos.network/v0.50/build/modules/gov#deposits-2 "Direct link to deposits")

The `deposits` endpoint allows users to query a deposit for a given proposal from a given depositor.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/proposals/{proposal_id}/deposits/{depositor}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/proposals/1/deposits/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposit": {
    "proposal_id": "1",
    "depositor": "cosmos1..",
    "amount": [\
      {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    ]
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/proposals/{proposal_id}/deposits/{depositor}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/proposals/1/deposits/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposit": {
    "proposal_id": "1",
    "depositor": "cosmos1..",
    "amount": [\
      {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    ]
  }
}

```

##### Proposal Deposits [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-deposits "Direct link to proposal deposits")

The `deposits` endpoint allows users to query all deposits for a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/proposals/{proposal_id}/deposits

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/proposals/1/deposits

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposits": [\
    {\
      "proposal_id": "1",\
      "depositor": "cosmos1..",\
      "amount": [\
        {\
          "denom": "stake",\
          "amount": "10000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/proposals/{proposal_id}/deposits

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/proposals/1/deposits

```

Example Output:

```codeBlockLines_e6Vv
{
  "deposits": [\
    {\
      "proposal_id": "1",\
      "depositor": "cosmos1..",\
      "amount": [\
        {\
          "denom": "stake",\
          "amount": "10000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### Tally [​](https://docs.cosmos.network/v0.50/build/modules/gov#tally-1 "Direct link to tally")

The `tally` endpoint allows users to query the tally of a given proposal.

Using legacy v1beta1:

```codeBlockLines_e6Vv
/cosmos/gov/v1beta1/proposals/{proposal_id}/tally

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1beta1/proposals/1/tally

```

Example Output:

```codeBlockLines_e6Vv
{
  "tally": {
    "yes": "1000000",
    "abstain": "0",
    "no": "0",
    "no_with_veto": "0"
  }
}

```

Using v1:

```codeBlockLines_e6Vv
/cosmos/gov/v1/proposals/{proposal_id}/tally

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/gov/v1/proposals/1/tally

```

Example Output:

```codeBlockLines_e6Vv
{
  "tally": {
    "yes": "1000000",
    "abstain": "0",
    "no": "0",
    "no_with_veto": "0"
  }
}

```

### Metadata [​](https://docs.cosmos.network/v0.50/build/modules/gov#metadata "Direct link to Metadata")

The gov module has two locations for metadata where users can provide further context about the on-chain actions they are taking. By default all metadata fields have a 255 character length field where metadata can be stored in json format, either on-chain or off-chain depending on the amount of data required. Here we provide a recommendation for the json structure and where the data should be stored. There are two important factors in making these recommendations. First, that the gov and group modules are consistent with one another, note the number of proposals made by all groups may be quite large. Second, that client applications such as block explorers and governance interfaces have confidence in the consistency of metadata structure across chains.

#### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/gov#proposal-3 "Direct link to Proposal")

Location: off-chain as json object stored on IPFS (mirrors [group proposal](https://docs.cosmos.network/v0.50/build/modules/group#metadata))

```codeBlockLines_e6Vv
{
  "title": "",
  "authors": [""],
  "summary": "",
  "details": "",
  "proposal_forum_url": "",
  "vote_option_context": "",
}

```

note

The `authors` field is an array of strings, this is to allow for multiple authors to be listed in the metadata.<br/>
In v0.46, the `authors` field is a comma-separated string. Frontends are encouraged to support both formats for backwards compatibility.

#### Vote [​](https://docs.cosmos.network/v0.50/build/modules/gov#vote-5 "Direct link to Vote")

Location: on-chain as json within 255 character limit (mirrors [group vote](https://docs.cosmos.network/v0.50/build/modules/group#metadata))

```codeBlockLines_e6Vv
{
  "justification": "",
}

```

### Future Improvements [​](https://docs.cosmos.network/v0.50/build/modules/gov#future-improvements "Direct link to Future Improvements")

The current documentation only describes the minimum viable product for the<br/>
governance module. Future improvements may include:

- **`BountyProposals`:** If accepted, a `BountyProposal` creates an open<br/>
  bounty. The `BountyProposal` specifies how many Atoms will be given upon<br/>
  completion. These Atoms will be taken from the `reserve pool`. After a<br/>
  `BountyProposal` is accepted by governance, anybody can submit a<br/>
  `SoftwareUpgradeProposal` with the code to claim the bounty. Note that once a<br/>
  `BountyProposal` is accepted, the corresponding funds in the `reserve pool`<br/>
  are locked so that payment can always be honored. In order to link a<br/>
  `SoftwareUpgradeProposal` to an open bounty, the submitter of the<br/>
  `SoftwareUpgradeProposal` will use the `Proposal.LinkedProposal` attribute.<br/>
  If a `SoftwareUpgradeProposal` linked to an open bounty is accepted by<br/>
  governance, the funds that were reserved are automatically transferred to the<br/>
  submitter.
- **Complex delegation:** Delegators could choose other representatives than<br/>
  their validators. Ultimately, the chain of representatives would always end<br/>
  up to a validator, but delegators could inherit the vote of their chosen<br/>
  representative before they inherit the vote of their validator. In other<br/>
  words, they would only inherit the vote of their validator if their other<br/>
  appointed representative did not vote.
- **Better process for proposal review:** There would be two parts to<br/>
  `proposal.Deposit`, one for anti-spam (same as in MVP) and an other one to<br/>
  reward third party auditors.

---

## `x/group`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/group#abstract "Direct link to Abstract")

The following documents specify the group module.

This module allows the creation and management of on-chain multisig accounts and enables voting for message execution based on configurable decision policies.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/group#contents "Direct link to Contents")

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/group#concepts)
  - [Group](https://docs.cosmos.network/v0.50/build/modules/group#group)
  - [Group Policy](https://docs.cosmos.network/v0.50/build/modules/group#group-policy)
  - [Decision Policy](https://docs.cosmos.network/v0.50/build/modules/group#decision-policy)
  - [Proposal](https://docs.cosmos.network/v0.50/build/modules/group#proposal)
  - [Pruning](https://docs.cosmos.network/v0.50/build/modules/group#pruning)
- [State](https://docs.cosmos.network/v0.50/build/modules/group#state)
  - [Group Table](https://docs.cosmos.network/v0.50/build/modules/group#group-table)
  - [Group Member Table](https://docs.cosmos.network/v0.50/build/modules/group#group-member-table)
  - [Group Policy Table](https://docs.cosmos.network/v0.50/build/modules/group#group-policy-table)
  - [Proposal Table](https://docs.cosmos.network/v0.50/build/modules/group#proposal-table)
  - [Vote Table](https://docs.cosmos.network/v0.50/build/modules/group#vote-table)
- [Msg Service](https://docs.cosmos.network/v0.50/build/modules/group#msg-service)
  - [Msg/CreateGroup](https://docs.cosmos.network/v0.50/build/modules/group#msgcreategroup)
  - [Msg/UpdateGroupMembers](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategroupmembers)
  - [Msg/UpdateGroupAdmin](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategroupadmin)
  - [Msg/UpdateGroupMetadata](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategroupmetadata)
  - [Msg/CreateGroupPolicy](https://docs.cosmos.network/v0.50/build/modules/group#msgcreategrouppolicy)
  - [Msg/CreateGroupWithPolicy](https://docs.cosmos.network/v0.50/build/modules/group#msgcreategroupwithpolicy)
  - [Msg/UpdateGroupPolicyAdmin](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategrouppolicyadmin)
  - [Msg/UpdateGroupPolicyDecisionPolicy](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategrouppolicydecisionpolicy)
  - [Msg/UpdateGroupPolicyMetadata](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategrouppolicymetadata)
  - [Msg/SubmitProposal](https://docs.cosmos.network/v0.50/build/modules/group#msgsubmitproposal)
  - [Msg/WithdrawProposal](https://docs.cosmos.network/v0.50/build/modules/group#msgwithdrawproposal)
  - [Msg/Vote](https://docs.cosmos.network/v0.50/build/modules/group#msgvote)
  - [Msg/Exec](https://docs.cosmos.network/v0.50/build/modules/group#msgexec)
  - [Msg/LeaveGroup](https://docs.cosmos.network/v0.50/build/modules/group#msgleavegroup)
- [Events](https://docs.cosmos.network/v0.50/build/modules/group#events)
  - [EventCreateGroup](https://docs.cosmos.network/v0.50/build/modules/group#eventcreategroup)
  - [EventUpdateGroup](https://docs.cosmos.network/v0.50/build/modules/group#eventupdategroup)
  - [EventCreateGroupPolicy](https://docs.cosmos.network/v0.50/build/modules/group#eventcreategrouppolicy)
  - [EventUpdateGroupPolicy](https://docs.cosmos.network/v0.50/build/modules/group#eventupdategrouppolicy)
  - [EventCreateProposal](https://docs.cosmos.network/v0.50/build/modules/group#eventcreateproposal)
  - [EventWithdrawProposal](https://docs.cosmos.network/v0.50/build/modules/group#eventwithdrawproposal)
  - [EventVote](https://docs.cosmos.network/v0.50/build/modules/group#eventvote)
  - [EventExec](https://docs.cosmos.network/v0.50/build/modules/group#eventexec)
  - [EventLeaveGroup](https://docs.cosmos.network/v0.50/build/modules/group#eventleavegroup)
  - [EventProposalPruned](https://docs.cosmos.network/v0.50/build/modules/group#eventproposalpruned)
- [Client](https://docs.cosmos.network/v0.50/build/modules/group#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/group#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/group#grpc)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/group#rest)
- [Metadata](https://docs.cosmos.network/v0.50/build/modules/group#metadata)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/group#concepts "Direct link to Concepts")

#### Group [​](https://docs.cosmos.network/v0.50/build/modules/group#group "Direct link to Group")

A group is simply an aggregation of accounts with associated weights. It is not<br/>
an account and doesn't have a balance. It doesn't in and of itself have any<br/>
sort of voting or decision weight. It does have an "administrator" which has<br/>
the ability to add, remove and update members in the group. Note that a<br/>
group policy account could be an administrator of a group, and that the<br/>
administrator doesn't necessarily have to be a member of the group.

#### Group Policy [​](https://docs.cosmos.network/v0.50/build/modules/group#group-policy "Direct link to Group Policy")

A group policy is an account associated with a group and a decision policy.<br/>
Group policies are abstracted from groups because a single group may have<br/>
multiple decision policies for different types of actions. Managing group<br/>
membership separately from decision policies results in the least overhead<br/>
and keeps membership consistent across different policies. The pattern that<br/>
is recommended is to have a single master group policy for a given group,<br/>
and then to create separate group policies with different decision policies<br/>
and delegate the desired permissions from the master account to<br/>
those "sub-accounts" using the `x/authz` module.

#### Decision Policy [​](https://docs.cosmos.network/v0.50/build/modules/group#decision-policy "Direct link to Decision Policy")

A decision policy is the mechanism by which members of a group can vote on<br/>
proposals, as well as the rules that dictate whether a proposal should pass<br/>
or not based on its tally outcome.

All decision policies generally would have a minimum execution period and a<br/>
maximum voting window. The minimum execution period is the minimum amount of time<br/>
that must pass after submission in order for a proposal to potentially be executed, and it may<br/>
be set to 0. The maximum voting window is the maximum time after submission that a proposal may<br/>
be voted on before it is tallied.

The chain developer also defines an app-wide maximum execution period, which is<br/>
the maximum amount of time after a proposal's voting period end where users are<br/>
allowed to execute a proposal.

The current group module comes shipped with two decision policies: threshold<br/>
and percentage. Any chain developer can extend upon these two, by creating<br/>
custom decision policies, as long as they adhere to the `DecisionPolicy`<br/>
interface:

x/group/types.go

```codeBlockLines_e6Vv
// DecisionPolicy is the persistent set of rules to determine the result of election on a proposal.
type DecisionPolicy interface {
	codec.ProtoMarshaler

	// GetVotingPeriod returns the duration after proposal submission where
	// votes are accepted.
	GetVotingPeriod() time.Duration
	// GetMinExecutionPeriod returns the minimum duration after submission
	// where we can execution a proposal. It can be set to 0 or to a value
	// lesser than VotingPeriod to allow TRY_EXEC.
	GetMinExecutionPeriod() time.Duration
	// Allow defines policy-specific logic to allow a proposal to pass or not,
	// based on its tally result, the group's total power and the time since
	// the proposal was submitted.
	Allow(tallyResult TallyResult, totalPower string) (DecisionPolicyResult, error)

	ValidateBasic() error
	Validate(g GroupInfo, config Config) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/x/group/types.go#L27-L45)

##### Threshold Decision Policy [​](https://docs.cosmos.network/v0.50/build/modules/group#threshold-decision-policy "Direct link to Threshold decision policy")

A threshold decision policy defines a threshold of yes votes (based on a tally<br/>
of voter weights) that must be achieved in order for a proposal to pass. For<br/>
this decision policy, abstain and veto are simply treated as no's.

This decision policy also has a VotingPeriod window and a MinExecutionPeriod<br/>
window. The former defines the duration after proposal submission where members<br/>
are allowed to vote, after which tallying is performed. The latter specifies<br/>
the minimum duration after proposal submission where the proposal can be<br/>
executed. If set to 0, then the proposal is allowed to be executed immediately<br/>
on submission (using the `TRY_EXEC` option). Obviously, MinExecutionPeriod<br/>
cannot be greater than VotingPeriod+MaxExecutionPeriod (where MaxExecution is<br/>
the app-defined duration that specifies the window after voting ended where a<br/>
proposal can be executed).

##### Percentage Decision Policy [​](https://docs.cosmos.network/v0.50/build/modules/group#percentage-decision-policy "Direct link to Percentage decision policy")

A percentage decision policy is similar to a threshold decision policy, except<br/>
that the threshold is not defined as a constant weight, but as a percentage.<br/>
It's more suited for groups where the group members' weights can be updated, as<br/>
the percentage threshold stays the same, and doesn't depend on how those member<br/>
weights get updated.

Same as the Threshold decision policy, the percentage decision policy has the<br/>
two VotingPeriod and MinExecutionPeriod parameters.

#### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#proposal "Direct link to Proposal")

Any member(s) of a group can submit a proposal for a group policy account to decide upon.<br/>
A proposal consists of a set of messages that will be executed if the proposal<br/>
passes as well as any metadata associated with the proposal.

##### Voting [​](https://docs.cosmos.network/v0.50/build/modules/group#voting "Direct link to Voting")

There are four choices to choose while voting - yes, no, abstain and veto. Not<br/>
all decision policies will take the four choices into account. Votes can contain some optional metadata.<br/>
In the current implementation, the voting window begins as soon as a proposal<br/>
is submitted, and the end is defined by the group policy's decision policy.

##### Withdrawing Proposals [​](https://docs.cosmos.network/v0.50/build/modules/group#withdrawing-proposals "Direct link to Withdrawing Proposals")

Proposals can be withdrawn any time before the voting period end, either by the<br/>
admin of the group policy or by one of the proposers. Once withdrawn, it is<br/>
marked as `PROPOSAL_STATUS_WITHDRAWN`, and no more voting or execution is<br/>
allowed on it.

##### Aborted Proposals [​](https://docs.cosmos.network/v0.50/build/modules/group#aborted-proposals "Direct link to Aborted Proposals")

If the group policy is updated during the voting period of the proposal, then<br/>
the proposal is marked as `PROPOSAL_STATUS_ABORTED`, and no more voting or<br/>
execution is allowed on it. This is because the group policy defines the rules<br/>
of proposal voting and execution, so if those rules change during the lifecycle<br/>
of a proposal, then the proposal should be marked as stale.

##### Tallying [​](https://docs.cosmos.network/v0.50/build/modules/group#tallying "Direct link to Tallying")

Tallying is the counting of all votes on a proposal. It happens only once in<br/>
the lifecycle of a proposal, but can be triggered by two factors, whichever<br/>
happens first:

- either someone tries to execute the proposal (see next section), which can<br/>
  happen on a `Msg/Exec` transaction, or a `Msg/{SubmitProposal,Vote}`<br/>
  transaction with the `Exec` field set. When a proposal execution is attempted,<br/>
  a tally is done first to make sure the proposal passes.
- or on `EndBlock` when the proposal's voting period end just passed.

If the tally result passes the decision policy's rules, then the proposal is<br/>
marked as `PROPOSAL_STATUS_ACCEPTED`, or else it is marked as<br/>
`PROPOSAL_STATUS_REJECTED`. In any case, no more voting is allowed anymore, and the tally<br/>
result is persisted to state in the proposal's `FinalTallyResult`.

##### Executing Proposals [​](https://docs.cosmos.network/v0.50/build/modules/group#executing-proposals "Direct link to Executing Proposals")

Proposals are executed only when the tallying is done, and the group account's<br/>
decision policy allows the proposal to pass based on the tally outcome. They<br/>
are marked by the status `PROPOSAL_STATUS_ACCEPTED`. Execution must happen<br/>
before a duration of `MaxExecutionPeriod` (set by the chain developer) after<br/>
each proposal's voting period end.

Proposals will not be automatically executed by the chain in this current design,<br/>
but rather a user must submit a `Msg/Exec` transaction to attempt to execute the<br/>
proposal based on the current votes and decision policy. Any user (not only the<br/>
group members) can execute proposals that have been accepted, and execution fees are<br/>
paid by the proposal executor.<br/>
It's also possible to try to execute a proposal immediately on creation or on<br/>
new votes using the `Exec` field of `Msg/SubmitProposal` and `Msg/Vote` requests.<br/>
In the former case, proposers signatures are considered as yes votes.<br/>
In these cases, if the proposal can't be executed (i.e. it didn't pass the<br/>
decision policy's rules), it will still be opened for new votes and<br/>
could be tallied and executed later on.

A successful proposal execution will have its `ExecutorResult` marked as<br/>
`PROPOSAL_EXECUTOR_RESULT_SUCCESS`. The proposal will be automatically pruned<br/>
after execution. On the other hand, a failed proposal execution will be marked<br/>
as `PROPOSAL_EXECUTOR_RESULT_FAILURE`. Such a proposal can be re-executed<br/>
multiple times, until it expires after `MaxExecutionPeriod` after voting period<br/>
end.

#### Pruning [​](https://docs.cosmos.network/v0.50/build/modules/group#pruning "Direct link to Pruning")

Proposals and votes are automatically pruned to avoid state bloat.

Votes are pruned:

- either after a successful tally, i.e. a tally whose result passes the decision<br/>
  policy's rules, which can be triggered by a `Msg/Exec` or a<br/>
  `Msg/{SubmitProposal,Vote}` with the `Exec` field set,
- or on `EndBlock` right after the proposal's voting period end. This applies to proposals with status `aborted` or `withdrawn` too.

whichever happens first.

Proposals are pruned:

- on `EndBlock` whose proposal status is `withdrawn` or `aborted` on proposal's voting period end before tallying,
- and either after a successful proposal execution,
- or on `EndBlock` right after the proposal's `voting_period_end` +<br/>
  `max_execution_period` (defined as an app-wide configuration) is passed,

whichever happens first.

### State [​](https://docs.cosmos.network/v0.50/build/modules/group#state "Direct link to State")

The `group` module uses the `orm` package which provides table storage with support for<br/>
primary keys and secondary indexes. `orm` also defines `Sequence` which is a persistent unique key generator based on a counter that can be used along with `Table` s.

Here's the list of tables and associated sequences and indexes stored as part of the `group` module.

#### Group Table [​](https://docs.cosmos.network/v0.50/build/modules/group#group-table "Direct link to Group Table")

The `groupTable` stores `GroupInfo`: `0x0 | BigEndian(GroupId) -> ProtocolBuffer(GroupInfo)`.

##### groupSeq [​](https://docs.cosmos.network/v0.50/build/modules/group#groupseq "Direct link to groupSeq")

The value of `groupSeq` is incremented when creating a new group and corresponds to the new `GroupId`: `0x1 | 0x1 -> BigEndian`.

The second `0x1` corresponds to the ORM `sequenceStorageKey`.

##### groupByAdminIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#groupbyadminindex "Direct link to groupByAdminIndex")

`groupByAdminIndex` allows to retrieve groups by admin address:<br/>
`0x2 | len([]byte(group.Admin)) | []byte(group.Admin) | BigEndian(GroupId) -> []byte()`.

#### Group Member Table [​](https://docs.cosmos.network/v0.50/build/modules/group#group-member-table "Direct link to Group Member Table")

The `groupMemberTable` stores `GroupMember` s: `0x10 | BigEndian(GroupId) | []byte(member.Address) -> ProtocolBuffer(GroupMember)`.

The `groupMemberTable` is a primary key table and its `PrimaryKey` is given by<br/>
`BigEndian(GroupId) | []byte(member.Address)` which is used by the following indexes.

##### groupMemberByGroupIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#groupmemberbygroupindex "Direct link to groupMemberByGroupIndex")

`groupMemberByGroupIndex` allows to retrieve group members by group id:<br/>
`0x11 | BigEndian(GroupId) | PrimaryKey -> []byte()`.

##### groupMemberByMemberIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#groupmemberbymemberindex "Direct link to groupMemberByMemberIndex")

`groupMemberByMemberIndex` allows to retrieve group members by member address:<br/>
`0x12 | len([]byte(member.Address)) | []byte(member.Address) | PrimaryKey -> []byte()`.

#### Group Policy Table [​](https://docs.cosmos.network/v0.50/build/modules/group#group-policy-table "Direct link to Group Policy Table")

The `groupPolicyTable` stores `GroupPolicyInfo`: `0x20 | len([]byte(Address)) | []byte(Address) -> ProtocolBuffer(GroupPolicyInfo)`.

The `groupPolicyTable` is a primary key table and its `PrimaryKey` is given by<br/>
`len([]byte(Address)) | []byte(Address)` which is used by the following indexes.

##### groupPolicySeq [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppolicyseq "Direct link to groupPolicySeq")

The value of `groupPolicySeq` is incremented when creating a new group policy and is used to generate the new group policy account `Address`:<br/>
`0x21 | 0x1 -> BigEndian`.

The second `0x1` corresponds to the ORM `sequenceStorageKey`.

##### groupPolicyByGroupIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppolicybygroupindex "Direct link to groupPolicyByGroupIndex")

`groupPolicyByGroupIndex` allows to retrieve group policies by group id:<br/>
`0x22 | BigEndian(GroupId) | PrimaryKey -> []byte()`.

##### groupPolicyByAdminIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppolicybyadminindex "Direct link to groupPolicyByAdminIndex")

`groupPolicyByAdminIndex` allows to retrieve group policies by admin address:<br/>
`0x23 | len([]byte(Address)) | []byte(Address) | PrimaryKey -> []byte()`.

#### Proposal Table [​](https://docs.cosmos.network/v0.50/build/modules/group#proposal-table "Direct link to Proposal Table")

The `proposalTable` stores `Proposal` s: `0x30 | BigEndian(ProposalId) -> ProtocolBuffer(Proposal)`.

##### proposalSeq [​](https://docs.cosmos.network/v0.50/build/modules/group#proposalseq "Direct link to proposalSeq")

The value of `proposalSeq` is incremented when creating a new proposal and corresponds to the new `ProposalId`: `0x31 | 0x1 -> BigEndian`.

The second `0x1` corresponds to the ORM `sequenceStorageKey`.

##### proposalByGroupPolicyIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#proposalbygrouppolicyindex "Direct link to proposalByGroupPolicyIndex")

`proposalByGroupPolicyIndex` allows to retrieve proposals by group policy account address:<br/>
`0x32 | len([]byte(account.Address)) | []byte(account.Address) | BigEndian(ProposalId) -> []byte()`.

##### ProposalsByVotingPeriodEndIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#proposalsbyvotingperiodendindex "Direct link to ProposalsByVotingPeriodEndIndex")

`proposalsByVotingPeriodEndIndex` allows to retrieve proposals sorted by chronological `voting_period_end`:<br/>
`0x33 | sdk.FormatTimeBytes(proposal.VotingPeriodEnd) | BigEndian(ProposalId) -> []byte()`.

This index is used when tallying the proposal votes at the end of the voting period, and for pruning proposals at `VotingPeriodEnd + MaxExecutionPeriod`.

#### Vote Table [​](https://docs.cosmos.network/v0.50/build/modules/group#vote-table "Direct link to Vote Table")

The `voteTable` stores `Vote` s: `0x40 | BigEndian(ProposalId) | []byte(voter.Address) -> ProtocolBuffer(Vote)`.

The `voteTable` is a primary key table and its `PrimaryKey` is given by<br/>
`BigEndian(ProposalId) | []byte(voter.Address)` which is used by the following indexes.

##### voteByProposalIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#votebyproposalindex "Direct link to voteByProposalIndex")

`voteByProposalIndex` allows to retrieve votes by proposal id:<br/>
`0x41 | BigEndian(ProposalId) | PrimaryKey -> []byte()`.

##### voteByVoterIndex [​](https://docs.cosmos.network/v0.50/build/modules/group#votebyvoterindex "Direct link to voteByVoterIndex")

`voteByVoterIndex` allows to retrieve votes by voter address:<br/>
`0x42 | len([]byte(voter.Address)) | []byte(voter.Address) | PrimaryKey -> []byte()`.

### Msg Service [​](https://docs.cosmos.network/v0.50/build/modules/group#msg-service "Direct link to Msg Service")

#### Msg/CreateGroup [​](https://docs.cosmos.network/v0.50/build/modules/group#msgcreategroup "Direct link to Msg/CreateGroup")

A new group can be created with the `MsgCreateGroup`, which has an admin address, a list of members and some optional metadata.

The metadata has a maximum length that is chosen by the app developer, and<br/>
passed into the group keeper as a config.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgCreateGroup is the Msg/CreateGroup request type.
message MsgCreateGroup {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgCreateGroup";

  // admin is the account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // members defines the group members.
  repeated MemberRequest members = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // metadata is any arbitrary metadata to attached to the group.
  string metadata = 3;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L67-L80)

It's expected to fail if

- metadata length is greater than `MaxMetadataLen` config
- members are not correctly set (e.g. wrong address format, duplicates, or with 0 weight).

#### Msg/UpdateGroupMembers [​](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategroupmembers "Direct link to Msg/UpdateGroupMembers")

Group members can be updated with the `UpdateGroupMembers`.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateGroupMembers is the Msg/UpdateGroupMembers request type.
message MsgUpdateGroupMembers {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgUpdateGroupMembers";

  // admin is the account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_id is the unique ID of the group.
  uint64 group_id = 2;

  // member_updates is the list of members to update,
  // set weight to 0 to remove a member.
  repeated MemberRequest member_updates = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L88-L102)

In the list of `MemberUpdates`, an existing member can be removed by setting its weight to 0.

It's expected to fail if:

- the signer is not the admin of the group.
- for any one of the associated group policies, if its decision policy's `Validate()` method fails against the updated group.

#### Msg/UpdateGroupAdmin [​](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategroupadmin "Direct link to Msg/UpdateGroupAdmin")

The `UpdateGroupAdmin` can be used to update a group admin.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateGroupAdmin is the Msg/UpdateGroupAdmin request type.
message MsgUpdateGroupAdmin {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgUpdateGroupAdmin";

  // admin is the current account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_id is the unique ID of the group.
  uint64 group_id = 2;

  // new_admin is the group new admin account address.
  string new_admin = 3 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L107-L120)

It's expected to fail if the signer is not the admin of the group.

#### Msg/UpdateGroupMetadata [​](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategroupmetadata "Direct link to Msg/UpdateGroupMetadata")

The `UpdateGroupMetadata` can be used to update a group metadata.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateGroupMetadata is the Msg/UpdateGroupMetadata request type.
message MsgUpdateGroupMetadata {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgUpdateGroupMetadata";

  // admin is the account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_id is the unique ID of the group.
  uint64 group_id = 2;

  // metadata is the updated group's metadata.
  string metadata = 3;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L125-L138)

It's expected to fail if:

- new metadata length is greater than `MaxMetadataLen` config.
- the signer is not the admin of the group.

#### Msg/CreateGroupPolicy [​](https://docs.cosmos.network/v0.50/build/modules/group#msgcreategrouppolicy "Direct link to Msg/CreateGroupPolicy")

A new group policy can be created with the `MsgCreateGroupPolicy`, which has an admin address, a group id, a decision policy and some optional metadata.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgCreateGroupPolicy is the Msg/CreateGroupPolicy request type.
message MsgCreateGroupPolicy {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgCreateGroupPolicy";

  option (gogoproto.goproto_getters) = false;

  // admin is the account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_id is the unique ID of the group.
  uint64 group_id = 2;

  // metadata is any arbitrary metadata attached to the group policy.
  string metadata = 3;

  // decision_policy specifies the group policy's decision policy.
  google.protobuf.Any decision_policy = 4 [(cosmos_proto.accepts_interface) = "cosmos.group.v1.DecisionPolicy"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L147-L165)

It's expected to fail if:

- the signer is not the admin of the group.
- metadata length is greater than `MaxMetadataLen` config.
- the decision policy's `Validate()` method doesn't pass against the group.

#### Msg/CreateGroupWithPolicy [​](https://docs.cosmos.network/v0.50/build/modules/group#msgcreategroupwithpolicy "Direct link to Msg/CreateGroupWithPolicy")

A new group with policy can be created with the `MsgCreateGroupWithPolicy`, which has an admin address, a list of members, a decision policy, a `group_policy_as_admin` field to optionally set group and group policy admin with group policy address and some optional metadata for group and group policy.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgCreateGroupWithPolicy is the Msg/CreateGroupWithPolicy request type.
message MsgCreateGroupWithPolicy {
  option (cosmos.msg.v1.signer)      = "admin";
  option (amino.name)                = "cosmos-sdk/MsgCreateGroupWithPolicy";
  option (gogoproto.goproto_getters) = false;

  // admin is the account address of the group and group policy admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // members defines the group members.
  repeated MemberRequest members = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // group_metadata is any arbitrary metadata attached to the group.
  string group_metadata = 3;

  // group_policy_metadata is any arbitrary metadata attached to the group policy.
  string group_policy_metadata = 4;

  // group_policy_as_admin is a boolean field, if set to true, the group policy account address will be used as group
  // and group policy admin.
  bool group_policy_as_admin = 5;

  // decision_policy specifies the group policy's decision policy.
  google.protobuf.Any decision_policy = 6 [(cosmos_proto.accepts_interface) = "cosmos.group.v1.DecisionPolicy"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L191-L215)

It's expected to fail for the same reasons as `Msg/CreateGroup` and `Msg/CreateGroupPolicy`.

#### Msg/UpdateGroupPolicyAdmin [​](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategrouppolicyadmin "Direct link to Msg/UpdateGroupPolicyAdmin")

The `UpdateGroupPolicyAdmin` can be used to update a group policy admin.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateGroupPolicyAdmin is the Msg/UpdateGroupPolicyAdmin request type.
message MsgUpdateGroupPolicyAdmin {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgUpdateGroupPolicyAdmin";

  // admin is the account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_policy_address is the account address of the group policy.
  string group_policy_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // new_admin is the new group policy admin.
  string new_admin = 3 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L173-L186)

It's expected to fail if the signer is not the admin of the group policy.

#### Msg/UpdateGroupPolicyDecisionPolicy [​](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategrouppolicydecisionpolicy "Direct link to Msg/UpdateGroupPolicyDecisionPolicy")

The `UpdateGroupPolicyDecisionPolicy` can be used to update a decision policy.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateGroupPolicyDecisionPolicy is the Msg/UpdateGroupPolicyDecisionPolicy request type.
message MsgUpdateGroupPolicyDecisionPolicy {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgUpdateGroupDecisionPolicy";

  option (gogoproto.goproto_getters) = false;

  // admin is the account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_policy_address is the account address of group policy.
  string group_policy_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // decision_policy is the updated group policy's decision policy.
  google.protobuf.Any decision_policy = 3 [(cosmos_proto.accepts_interface) = "cosmos.group.v1.DecisionPolicy"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L226-L241)

It's expected to fail if:

- the signer is not the admin of the group policy.
- the new decision policy's `Validate()` method doesn't pass against the group.

#### Msg/UpdateGroupPolicyMetadata [​](https://docs.cosmos.network/v0.50/build/modules/group#msgupdategrouppolicymetadata "Direct link to Msg/UpdateGroupPolicyMetadata")

The `UpdateGroupPolicyMetadata` can be used to update a group policy metadata.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateGroupPolicyMetadata is the Msg/UpdateGroupPolicyMetadata request type.
message MsgUpdateGroupPolicyMetadata {
  option (cosmos.msg.v1.signer) = "admin";
  option (amino.name)           = "cosmos-sdk/MsgUpdateGroupPolicyMetadata";

  // admin is the account address of the group admin.
  string admin = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_policy_address is the account address of group policy.
  string group_policy_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // metadata is the group policy metadata to be updated.
  string metadata = 3;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L246-L259)

It's expected to fail if:

- new metadata length is greater than `MaxMetadataLen` config.
- the signer is not the admin of the group.

#### Msg/SubmitProposal [​](https://docs.cosmos.network/v0.50/build/modules/group#msgsubmitproposal "Direct link to Msg/SubmitProposal")

A new proposal can be created with the `MsgSubmitProposal`, which has a group policy account address, a list of proposers addresses, a list of messages to execute if the proposal is accepted and some optional metadata.<br/>
An optional `Exec` value can be provided to try to execute the proposal immediately after proposal creation. Proposers signatures are considered as yes votes in this case.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgSubmitProposal is the Msg/SubmitProposal request type.
message MsgSubmitProposal {
  option (cosmos.msg.v1.signer) = "proposers";
  option (amino.name)           = "cosmos-sdk/group/MsgSubmitProposal";

  option (gogoproto.goproto_getters) = false;

  // group_policy_address is the account address of group policy.
  string group_policy_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // proposers are the account addresses of the proposers.
  // Proposers signatures will be counted as yes votes.
  repeated string proposers = 2;

  // metadata is any arbitrary metadata attached to the proposal.
  string metadata = 3;

  // messages is a list of `sdk.Msg`s that will be executed if the proposal passes.
  repeated google.protobuf.Any messages = 4;

  // exec defines the mode of execution of the proposal,
  // whether it should be executed immediately on creation or not.
  // If so, proposers signatures are considered as Yes votes.
  Exec exec = 5;

  // title is the title of the proposal.
  //
  // Since: cosmos-sdk 0.47
  string title = 6;

  // summary is the summary of the proposal.
  //
  // Since: cosmos-sdk 0.47
  string summary = 7;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L281-L315)

It's expected to fail if:

- metadata, title, or summary length is greater than `MaxMetadataLen` config.
- if any of the proposers is not a group member.

#### Msg/WithdrawProposal [​](https://docs.cosmos.network/v0.50/build/modules/group#msgwithdrawproposal "Direct link to Msg/WithdrawProposal")

A proposal can be withdrawn using `MsgWithdrawProposal` which has an `address` (can be either a proposer or the group policy admin) and a `proposal_id` (which has to be withdrawn).

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgWithdrawProposal is the Msg/WithdrawProposal request type.
message MsgWithdrawProposal {
  option (cosmos.msg.v1.signer) = "address";
  option (amino.name)           = "cosmos-sdk/group/MsgWithdrawProposal";

  // proposal is the unique ID of the proposal.
  uint64 proposal_id = 1;

  // address is the admin of the group policy or one of the proposer of the proposal.
  string address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L323-L333)

It's expected to fail if:

- the signer is neither the group policy admin nor proposer of the proposal.
- the proposal is already closed or aborted.

#### Msg/Vote [​](https://docs.cosmos.network/v0.50/build/modules/group#msgvote "Direct link to Msg/Vote")

A new vote can be created with the `MsgVote`, given a proposal id, a voter address, a choice (yes, no, veto or abstain) and some optional metadata.<br/>
An optional `Exec` value can be provided to try to execute the proposal immediately after voting.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgVote is the Msg/Vote request type.
message MsgVote {
  option (cosmos.msg.v1.signer) = "voter";
  option (amino.name)           = "cosmos-sdk/group/MsgVote";

  // proposal is the unique ID of the proposal.
  uint64 proposal_id = 1;

  // voter is the voter account address.
  string voter = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // option is the voter's choice on the proposal.
  VoteOption option = 3;

  // metadata is any arbitrary metadata attached to the vote.
  string metadata = 4;

  // exec defines whether the proposal should be executed
  // immediately after voting or not.
  Exec exec = 5;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L338-L358)

It's expected to fail if:

- metadata length is greater than `MaxMetadataLen` config.
- the proposal is not in voting period anymore.

#### Msg/Exec [​](https://docs.cosmos.network/v0.50/build/modules/group#msgexec "Direct link to Msg/Exec")

A proposal can be executed with the `MsgExec`.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgExec is the Msg/Exec request type.
message MsgExec {
  option (cosmos.msg.v1.signer) = "signer";
  option (amino.name)           = "cosmos-sdk/group/MsgExec";

  // proposal is the unique ID of the proposal.
  uint64 proposal_id = 1;

  // executor is the account address used to execute the proposal.
  string executor = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L363-L373)

The messages that are part of this proposal won't be executed if:

- the proposal has not been accepted by the group policy.
- the proposal has already been successfully executed.

#### Msg/LeaveGroup [​](https://docs.cosmos.network/v0.50/build/modules/group#msgleavegroup "Direct link to Msg/LeaveGroup")

The `MsgLeaveGroup` allows group member to leave a group.

proto/cosmos/group/v1/tx.proto

```codeBlockLines_e6Vv
// MsgLeaveGroup is the Msg/LeaveGroup request type.
message MsgLeaveGroup {
  option (cosmos.msg.v1.signer) = "address";
  option (amino.name)           = "cosmos-sdk/group/MsgLeaveGroup";

  // address is the account address of the group member.
  string address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // group_id is the unique ID of the group.
  uint64 group_id = 2;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/group/v1/tx.proto#L381-L391)

It's expected to fail if:

- the group member is not part of the group.
- for any one of the associated group policies, if its decision policy's `Validate()` method fails against the updated group.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/group#events "Direct link to Events")

The group module emits the following events:

#### EventCreateGroup [​](https://docs.cosmos.network/v0.50/build/modules/group#eventcreategroup "Direct link to EventCreateGroup")

| Type                             | Attribute Key | Attribute Value                  |
| -------------------------------- | ------------- | -------------------------------- |
| message                          | action        | /cosmos.group.v1.Msg/CreateGroup |
| cosmos.group.v1.EventCreateGroup | group_id      | {groupId}                        |

#### EventUpdateGroup [​](https://docs.cosmos.network/v0.50/build/modules/group#eventupdategroup "Direct link to EventUpdateGroup")

| Type                             | Attribute Key | Attribute Value                                            |
| -------------------------------- | ------------- | ---------------------------------------------------------- |
| message                          | action        | /cosmos.group.v1.Msg/UpdateGroup{Admin\|Metadata\|Members} |
| cosmos.group.v1.EventUpdateGroup | group_id      | {groupId}                                                  |

#### EventCreateGroupPolicy [​](https://docs.cosmos.network/v0.50/build/modules/group#eventcreategrouppolicy "Direct link to EventCreateGroupPolicy")

| Type                                   | Attribute Key | Attribute Value                        |
| -------------------------------------- | ------------- | -------------------------------------- |
| message                                | action        | /cosmos.group.v1.Msg/CreateGroupPolicy |
| cosmos.group.v1.EventCreateGroupPolicy | address       | {groupPolicyAddress}                   |

#### EventUpdateGroupPolicy [​](https://docs.cosmos.network/v0.50/build/modules/group#eventupdategrouppolicy "Direct link to EventUpdateGroupPolicy")

| Type                                   | Attribute Key | Attribute Value                                                         |
| -------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| message                                | action        | /cosmos.group.v1.Msg/UpdateGroupPolicy{Admin\|Metadata\|DecisionPolicy} |
| cosmos.group.v1.EventUpdateGroupPolicy | address       | {groupPolicyAddress}                                                    |

#### EventCreateProposal [​](https://docs.cosmos.network/v0.50/build/modules/group#eventcreateproposal "Direct link to EventCreateProposal")

| Type                                | Attribute Key | Attribute Value                     |
| ----------------------------------- | ------------- | ----------------------------------- |
| message                             | action        | /cosmos.group.v1.Msg/CreateProposal |
| cosmos.group.v1.EventCreateProposal | proposal_id   | {proposalId}                        |

#### EventWithdrawProposal [​](https://docs.cosmos.network/v0.50/build/modules/group#eventwithdrawproposal "Direct link to EventWithdrawProposal")

| Type                                  | Attribute Key | Attribute Value                       |
| ------------------------------------- | ------------- | ------------------------------------- |
| message                               | action        | /cosmos.group.v1.Msg/WithdrawProposal |
| cosmos.group.v1.EventWithdrawProposal | proposal_id   | {proposalId}                          |

#### EventVote [​](https://docs.cosmos.network/v0.50/build/modules/group#eventvote "Direct link to EventVote")

| Type                      | Attribute Key | Attribute Value           |
| ------------------------- | ------------- | ------------------------- |
| message                   | action        | /cosmos.group.v1.Msg/Vote |
| cosmos.group.v1.EventVote | proposal_id   | {proposalId}              |

### EventExec [​](https://docs.cosmos.network/v0.50/build/modules/group#eventexec "Direct link to EventExec")

| Type                      | Attribute Key | Attribute Value           |
| ------------------------- | ------------- | ------------------------- |
| message                   | action        | /cosmos.group.v1.Msg/Exec |
| cosmos.group.v1.EventExec | proposal_id   | {proposalId}              |
| cosmos.group.v1.EventExec | logs          | {logs_string}             |

#### EventLeaveGroup [​](https://docs.cosmos.network/v0.50/build/modules/group#eventleavegroup "Direct link to EventLeaveGroup")

| Type                            | Attribute Key | Attribute Value                 |
| ------------------------------- | ------------- | ------------------------------- |
| message                         | action        | /cosmos.group.v1.Msg/LeaveGroup |
| cosmos.group.v1.EventLeaveGroup | proposal_id   | {proposalId}                    |
| cosmos.group.v1.EventLeaveGroup | address       | {address}                       |

#### EventProposalPruned [​](https://docs.cosmos.network/v0.50/build/modules/group#eventproposalpruned "Direct link to EventProposalPruned")

| Type                                | Attribute Key | Attribute Value                 |
| ----------------------------------- | ------------- | ------------------------------- |
| message                             | action        | /cosmos.group.v1.Msg/LeaveGroup |
| cosmos.group.v1.EventProposalPruned | proposal_id   | {proposalId}                    |
| cosmos.group.v1.EventProposalPruned | status        | {ProposalStatus}                |
| cosmos.group.v1.EventProposalPruned | tally_result  | {TallyResult}                   |

### Client [​](https://docs.cosmos.network/v0.50/build/modules/group#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/group#cli "Direct link to CLI")

A user can query and interact with the `group` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/group#query "Direct link to Query")

The `query` commands allow users to query `group` state.

```codeBlockLines_e6Vv
simd query group --help

```

###### Group-info [​](https://docs.cosmos.network/v0.50/build/modules/group#group-info "Direct link to group-info")

The `group-info` command allows users to query for group info by given group id.

```codeBlockLines_e6Vv
simd query group group-info [id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group group-info 1

```

Example Output:

```codeBlockLines_e6Vv
admin: cosmos1..
group_id: "1"
metadata: AQ==
total_weight: "3"
version: "1"

```

###### Group-policy-info [​](https://docs.cosmos.network/v0.50/build/modules/group#group-policy-info "Direct link to group-policy-info")

The `group-policy-info` command allows users to query for group policy info by account address of group policy.

```codeBlockLines_e6Vv
simd query group group-policy-info [group-policy-account] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group group-policy-info cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
address: cosmos1..
admin: cosmos1..
decision_policy:
  '@type': /cosmos.group.v1.ThresholdDecisionPolicy
  threshold: "1"
  windows:
      min_execution_period: 0s
      voting_period: 432000s
group_id: "1"
metadata: AQ==
version: "1"

```

###### Group-members [​](https://docs.cosmos.network/v0.50/build/modules/group#group-members "Direct link to group-members")

The `group-members` command allows users to query for group members by group id with pagination flags.

```codeBlockLines_e6Vv
simd query group group-members [id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group group-members 1

```

Example Output:

```codeBlockLines_e6Vv
members:
- group_id: "1"
  member:
    address: cosmos1..
    metadata: AQ==
    weight: "2"
- group_id: "1"
  member:
    address: cosmos1..
    metadata: AQ==
    weight: "1"
pagination:
  next_key: null
  total: "2"

```

###### Groups-by-admin [​](https://docs.cosmos.network/v0.50/build/modules/group#groups-by-admin "Direct link to groups-by-admin")

The `groups-by-admin` command allows users to query for groups by admin account address with pagination flags.

```codeBlockLines_e6Vv
simd query group groups-by-admin [admin] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group groups-by-admin cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
groups:
- admin: cosmos1..
  group_id: "1"
  metadata: AQ==
  total_weight: "3"
  version: "1"
- admin: cosmos1..
  group_id: "2"
  metadata: AQ==
  total_weight: "3"
  version: "1"
pagination:
  next_key: null
  total: "2"

```

###### Group-policies-by-group [​](https://docs.cosmos.network/v0.50/build/modules/group#group-policies-by-group "Direct link to group-policies-by-group")

The `group-policies-by-group` command allows users to query for group policies by group id with pagination flags.

```codeBlockLines_e6Vv
simd query group group-policies-by-group [group-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group group-policies-by-group 1

```

Example Output:

```codeBlockLines_e6Vv
group_policies:
- address: cosmos1..
  admin: cosmos1..
  decision_policy:
    '@type': /cosmos.group.v1.ThresholdDecisionPolicy
    threshold: "1"
    windows:
      min_execution_period: 0s
      voting_period: 432000s
  group_id: "1"
  metadata: AQ==
  version: "1"
- address: cosmos1..
  admin: cosmos1..
  decision_policy:
    '@type': /cosmos.group.v1.ThresholdDecisionPolicy
    threshold: "1"
    windows:
      min_execution_period: 0s
      voting_period: 432000s
  group_id: "1"
  metadata: AQ==
  version: "1"
pagination:
  next_key: null
  total: "2"

```

###### Group-policies-by-admin [​](https://docs.cosmos.network/v0.50/build/modules/group#group-policies-by-admin "Direct link to group-policies-by-admin")

The `group-policies-by-admin` command allows users to query for group policies by admin account address with pagination flags.

```codeBlockLines_e6Vv
simd query group group-policies-by-admin [admin] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group group-policies-by-admin cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
group_policies:
- address: cosmos1..
  admin: cosmos1..
  decision_policy:
    '@type': /cosmos.group.v1.ThresholdDecisionPolicy
    threshold: "1"
    windows:
      min_execution_period: 0s
      voting_period: 432000s
  group_id: "1"
  metadata: AQ==
  version: "1"
- address: cosmos1..
  admin: cosmos1..
  decision_policy:
    '@type': /cosmos.group.v1.ThresholdDecisionPolicy
    threshold: "1"
    windows:
      min_execution_period: 0s
      voting_period: 432000s
  group_id: "1"
  metadata: AQ==
  version: "1"
pagination:
  next_key: null
  total: "2"

```

###### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#proposal-1 "Direct link to proposal")

The `proposal` command allows users to query for proposal by id.

```codeBlockLines_e6Vv
simd query group proposal [id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group proposal 1

```

Example Output:

```codeBlockLines_e6Vv
proposal:
  address: cosmos1..
  executor_result: EXECUTOR_RESULT_NOT_RUN
  group_policy_version: "1"
  group_version: "1"
  metadata: AQ==
  msgs:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "100000000"
      denom: stake
    from_address: cosmos1..
    to_address: cosmos1..
  proposal_id: "1"
  proposers:
  - cosmos1..
  result: RESULT_UNFINALIZED
  status: STATUS_SUBMITTED
  submitted_at: "2021-12-17T07:06:26.310638964Z"
  windows:
    min_execution_period: 0s
    voting_period: 432000s
  vote_state:
    abstain_count: "0"
    no_count: "0"
    veto_count: "0"
    yes_count: "0"
  summary: "Summary"
  title: "Title"

```

###### Proposals-by-group-policy [​](https://docs.cosmos.network/v0.50/build/modules/group#proposals-by-group-policy "Direct link to proposals-by-group-policy")

The `proposals-by-group-policy` command allows users to query for proposals by account address of group policy with pagination flags.

```codeBlockLines_e6Vv
simd query group proposals-by-group-policy [group-policy-account] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group proposals-by-group-policy cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "1"
proposals:
- address: cosmos1..
  executor_result: EXECUTOR_RESULT_NOT_RUN
  group_policy_version: "1"
  group_version: "1"
  metadata: AQ==
  msgs:
  - '@type': /cosmos.bank.v1beta1.MsgSend
    amount:
    - amount: "100000000"
      denom: stake
    from_address: cosmos1..
    to_address: cosmos1..
  proposal_id: "1"
  proposers:
  - cosmos1..
  result: RESULT_UNFINALIZED
  status: STATUS_SUBMITTED
  submitted_at: "2021-12-17T07:06:26.310638964Z"
  windows:
    min_execution_period: 0s
    voting_period: 432000s
  vote_state:
    abstain_count: "0"
    no_count: "0"
    veto_count: "0"
    yes_count: "0"
  summary: "Summary"
  title: "Title"

```

###### Vote [​](https://docs.cosmos.network/v0.50/build/modules/group#vote "Direct link to vote")

The `vote` command allows users to query for vote by proposal id and voter account address.

```codeBlockLines_e6Vv
simd query group vote [proposal-id] [voter] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group vote 1 cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
vote:
  choice: CHOICE_YES
  metadata: AQ==
  proposal_id: "1"
  submitted_at: "2021-12-17T08:05:02.490164009Z"
  voter: cosmos1..

```

###### Votes-by-proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#votes-by-proposal "Direct link to votes-by-proposal")

The `votes-by-proposal` command allows users to query for votes by proposal id with pagination flags.

```codeBlockLines_e6Vv
simd query group votes-by-proposal [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group votes-by-proposal 1

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "1"
votes:
- choice: CHOICE_YES
  metadata: AQ==
  proposal_id: "1"
  submitted_at: "2021-12-17T08:05:02.490164009Z"
  voter: cosmos1..

```

###### Votes-by-voter [​](https://docs.cosmos.network/v0.50/build/modules/group#votes-by-voter "Direct link to votes-by-voter")

The `votes-by-voter` command allows users to query for votes by voter account address with pagination flags.

```codeBlockLines_e6Vv
simd query group votes-by-voter [voter] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query group votes-by-voter cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "1"
votes:
- choice: CHOICE_YES
  metadata: AQ==
  proposal_id: "1"
  submitted_at: "2021-12-17T08:05:02.490164009Z"
  voter: cosmos1..

```

#### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/group#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `group` module.

```codeBlockLines_e6Vv
simd tx group --help

```

##### Create-group [​](https://docs.cosmos.network/v0.50/build/modules/group#create-group "Direct link to create-group")

The `create-group` command allows users to create a group which is an aggregation of member accounts with associated weights and<br/>
an administrator account.

```codeBlockLines_e6Vv
simd tx group create-group [admin] [metadata] [members-json-file]

```

Example:

```codeBlockLines_e6Vv
simd tx group create-group cosmos1.. "AQ==" members.json

```

##### Update-group-admin [​](https://docs.cosmos.network/v0.50/build/modules/group#update-group-admin "Direct link to update-group-admin")

The `update-group-admin` command allows users to update a group's admin.

```codeBlockLines_e6Vv
simd tx group update-group-admin [admin] [group-id] [new-admin] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group update-group-admin cosmos1.. 1 cosmos1..

```

##### Update-group-members [​](https://docs.cosmos.network/v0.50/build/modules/group#update-group-members "Direct link to update-group-members")

The `update-group-members` command allows users to update a group's members.

```codeBlockLines_e6Vv
simd tx group update-group-members [admin] [group-id] [members-json-file] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group update-group-members cosmos1.. 1 members.json

```

##### Update-group-metadata [​](https://docs.cosmos.network/v0.50/build/modules/group#update-group-metadata "Direct link to update-group-metadata")

The `update-group-metadata` command allows users to update a group's metadata.

```codeBlockLines_e6Vv
simd tx group update-group-metadata [admin] [group-id] [metadata] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group update-group-metadata cosmos1.. 1 "AQ=="

```

##### Create-group-policy [​](https://docs.cosmos.network/v0.50/build/modules/group#create-group-policy "Direct link to create-group-policy")

The `create-group-policy` command allows users to create a group policy which is an account associated with a group and a decision policy.

```codeBlockLines_e6Vv
simd tx group create-group-policy [admin] [group-id] [metadata] [decision-policy] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group create-group-policy cosmos1.. 1 "AQ==" '{"@type":"/cosmos.group.v1.ThresholdDecisionPolicy", "threshold":"1", "windows": {"voting_period": "120h", "min_execution_period": "0s"}}'

```

##### Create-group-with-policy [​](https://docs.cosmos.network/v0.50/build/modules/group#create-group-with-policy "Direct link to create-group-with-policy")

The `create-group-with-policy` command allows users to create a group which is an aggregation of member accounts with associated weights and an administrator account with decision policy. If the `--group-policy-as-admin` flag is set to `true`, the group policy address becomes the group and group policy admin.

```codeBlockLines_e6Vv
simd tx group create-group-with-policy [admin] [group-metadata] [group-policy-metadata] [members-json-file] [decision-policy] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group create-group-with-policy cosmos1.. "AQ==" "AQ==" members.json '{"@type":"/cosmos.group.v1.ThresholdDecisionPolicy", "threshold":"1", "windows": {"voting_period": "120h", "min_execution_period": "0s"}}'

```

##### Update-group-policy-admin [​](https://docs.cosmos.network/v0.50/build/modules/group#update-group-policy-admin "Direct link to update-group-policy-admin")

The `update-group-policy-admin` command allows users to update a group policy admin.

```codeBlockLines_e6Vv
simd tx group update-group-policy-admin [admin] [group-policy-account] [new-admin] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group update-group-policy-admin cosmos1.. cosmos1.. cosmos1..

```

##### Update-group-policy-metadata [​](https://docs.cosmos.network/v0.50/build/modules/group#update-group-policy-metadata "Direct link to update-group-policy-metadata")

The `update-group-policy-metadata` command allows users to update a group policy metadata.

```codeBlockLines_e6Vv
simd tx group update-group-policy-metadata [admin] [group-policy-account] [new-metadata] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group update-group-policy-metadata cosmos1.. cosmos1.. "AQ=="

```

##### Update-group-policy-decision-policy [​](https://docs.cosmos.network/v0.50/build/modules/group#update-group-policy-decision-policy "Direct link to update-group-policy-decision-policy")

The `update-group-policy-decision-policy` command allows users to update a group policy's decision policy.

```codeBlockLines_e6Vv
simd  tx group update-group-policy-decision-policy [admin] [group-policy-account] [decision-policy] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group update-group-policy-decision-policy cosmos1.. cosmos1.. '{"@type":"/cosmos.group.v1.ThresholdDecisionPolicy", "threshold":"2", "windows": {"voting_period": "120h", "min_execution_period": "0s"}}'

```

##### Submit-proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#submit-proposal "Direct link to submit-proposal")

The `submit-proposal` command allows users to submit a new proposal.

```codeBlockLines_e6Vv
simd tx group submit-proposal [group-policy-account] [proposer[,proposer]*] [msg_tx_json_file] [metadata] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group submit-proposal cosmos1.. cosmos1.. msg_tx.json "AQ=="

```

##### Withdraw-proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#withdraw-proposal "Direct link to withdraw-proposal")

The `withdraw-proposal` command allows users to withdraw a proposal.

```codeBlockLines_e6Vv
simd tx group withdraw-proposal [proposal-id] [group-policy-admin-or-proposer]

```

Example:

```codeBlockLines_e6Vv
simd tx group withdraw-proposal 1 cosmos1..

```

##### Vote [​](https://docs.cosmos.network/v0.50/build/modules/group#vote-1 "Direct link to vote")

The `vote` command allows users to vote on a proposal.

```codeBlockLines_e6Vv
simd tx group vote proposal-id] [voter] [choice] [metadata] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group vote 1 cosmos1.. CHOICE_YES "AQ=="

```

##### Exec [​](https://docs.cosmos.network/v0.50/build/modules/group#exec "Direct link to exec")

The `exec` command allows users to execute a proposal.

```codeBlockLines_e6Vv
simd tx group exec [proposal-id] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx group exec 1

```

##### Leave-group [​](https://docs.cosmos.network/v0.50/build/modules/group#leave-group "Direct link to leave-group")

The `leave-group` command allows group member to leave the group.

```codeBlockLines_e6Vv
simd tx group leave-group [member-address] [group-id]

```

Example:

```codeBlockLines_e6Vv
simd tx group leave-group cosmos1... 1

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/group#grpc "Direct link to gRPC")

A user can query the `group` module using gRPC endpoints.

##### GroupInfo [​](https://docs.cosmos.network/v0.50/build/modules/group#groupinfo "Direct link to GroupInfo")

The `GroupInfo` endpoint allows users to query for group info by given group id.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/GroupInfo

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"group_id":1}' localhost:9090 cosmos.group.v1.Query/GroupInfo

```

Example Output:

```codeBlockLines_e6Vv
{
  "info": {
    "groupId": "1",
    "admin": "cosmos1..",
    "metadata": "AQ==",
    "version": "1",
    "totalWeight": "3"
  }
}

```

##### GroupPolicyInfo [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppolicyinfo "Direct link to GroupPolicyInfo")

The `GroupPolicyInfo` endpoint allows users to query for group policy info by account address of group policy.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/GroupPolicyInfo

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"address":"cosmos1.."}'  localhost:9090 cosmos.group.v1.Query/GroupPolicyInfo

```

Example Output:

```codeBlockLines_e6Vv
{
  "info": {
    "address": "cosmos1..",
    "groupId": "1",
    "admin": "cosmos1..",
    "version": "1",
    "decisionPolicy": {"@type":"/cosmos.group.v1.ThresholdDecisionPolicy","threshold":"1","windows": {"voting_period": "120h", "min_execution_period": "0s"}},
  }
}

```

##### GroupMembers [​](https://docs.cosmos.network/v0.50/build/modules/group#groupmembers "Direct link to GroupMembers")

The `GroupMembers` endpoint allows users to query for group members by group id with pagination flags.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/GroupMembers

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"group_id":"1"}'  localhost:9090 cosmos.group.v1.Query/GroupMembers

```

Example Output:

```codeBlockLines_e6Vv
{
  "members": [\
    {\
      "groupId": "1",\
      "member": {\
        "address": "cosmos1..",\
        "weight": "1"\
      }\
    },\
    {\
      "groupId": "1",\
      "member": {\
        "address": "cosmos1..",\
        "weight": "2"\
      }\
    }\
  ],
  "pagination": {
    "total": "2"
  }
}

```

##### GroupsByAdmin [​](https://docs.cosmos.network/v0.50/build/modules/group#groupsbyadmin "Direct link to GroupsByAdmin")

The `GroupsByAdmin` endpoint allows users to query for groups by admin account address with pagination flags.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/GroupsByAdmin

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"admin":"cosmos1.."}'  localhost:9090 cosmos.group.v1.Query/GroupsByAdmin

```

Example Output:

```codeBlockLines_e6Vv
{
  "groups": [\
    {\
      "groupId": "1",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "totalWeight": "3"\
    },\
    {\
      "groupId": "2",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "totalWeight": "3"\
    }\
  ],
  "pagination": {
    "total": "2"
  }
}

```

##### GroupPoliciesByGroup [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppoliciesbygroup "Direct link to GroupPoliciesByGroup")

The `GroupPoliciesByGroup` endpoint allows users to query for group policies by group id with pagination flags.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/GroupPoliciesByGroup

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"group_id":"1"}'  localhost:9090 cosmos.group.v1.Query/GroupPoliciesByGroup

```

Example Output:

```codeBlockLines_e6Vv
{
  "GroupPolicies": [\
    {\
      "address": "cosmos1..",\
      "groupId": "1",\
      "admin": "cosmos1..",\
      "version": "1",\
      "decisionPolicy": {"@type":"/cosmos.group.v1.ThresholdDecisionPolicy","threshold":"1","windows":{"voting_period": "120h", "min_execution_period": "0s"}},\
    },\
    {\
      "address": "cosmos1..",\
      "groupId": "1",\
      "admin": "cosmos1..",\
      "version": "1",\
      "decisionPolicy": {"@type":"/cosmos.group.v1.ThresholdDecisionPolicy","threshold":"1","windows":{"voting_period": "120h", "min_execution_period": "0s"}},\
    }\
  ],
  "pagination": {
    "total": "2"
  }
}

```

##### GroupPoliciesByAdmin [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppoliciesbyadmin "Direct link to GroupPoliciesByAdmin")

The `GroupPoliciesByAdmin` endpoint allows users to query for group policies by admin account address with pagination flags.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/GroupPoliciesByAdmin

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"admin":"cosmos1.."}'  localhost:9090 cosmos.group.v1.Query/GroupPoliciesByAdmin

```

Example Output:

```codeBlockLines_e6Vv
{
  "GroupPolicies": [\
    {\
      "address": "cosmos1..",\
      "groupId": "1",\
      "admin": "cosmos1..",\
      "version": "1",\
      "decisionPolicy": {"@type":"/cosmos.group.v1.ThresholdDecisionPolicy","threshold":"1","windows":{"voting_period": "120h", "min_execution_period": "0s"}},\
    },\
    {\
      "address": "cosmos1..",\
      "groupId": "1",\
      "admin": "cosmos1..",\
      "version": "1",\
      "decisionPolicy": {"@type":"/cosmos.group.v1.ThresholdDecisionPolicy","threshold":"1","windows":{"voting_period": "120h", "min_execution_period": "0s"}},\
    }\
  ],
  "pagination": {
    "total": "2"
  }
}

```

##### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#proposal-2 "Direct link to Proposal")

The `Proposal` endpoint allows users to query for proposal by id.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/Proposal

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}'  localhost:9090 cosmos.group.v1.Query/Proposal

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposal": {
    "proposalId": "1",
    "address": "cosmos1..",
    "proposers": [\
      "cosmos1.."\
    ],
    "submittedAt": "2021-12-17T07:06:26.310638964Z",
    "groupVersion": "1",
    "GroupPolicyVersion": "1",
    "status": "STATUS_SUBMITTED",
    "result": "RESULT_UNFINALIZED",
    "voteState": {
      "yesCount": "0",
      "noCount": "0",
      "abstainCount": "0",
      "vetoCount": "0"
    },
    "windows": {
      "min_execution_period": "0s",
      "voting_period": "432000s"
    },
    "executorResult": "EXECUTOR_RESULT_NOT_RUN",
    "messages": [\
      {"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"denom":"stake","amount":"100000000"}],"fromAddress":"cosmos1..","toAddress":"cosmos1.."}\
    ],
    "title": "Title",
    "summary": "Summary",
  }
}

```

##### ProposalsByGroupPolicy [​](https://docs.cosmos.network/v0.50/build/modules/group#proposalsbygrouppolicy "Direct link to ProposalsByGroupPolicy")

The `ProposalsByGroupPolicy` endpoint allows users to query for proposals by account address of group policy with pagination flags.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/ProposalsByGroupPolicy

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"address":"cosmos1.."}'  localhost:9090 cosmos.group.v1.Query/ProposalsByGroupPolicy

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposals": [\
    {\
      "proposalId": "1",\
      "address": "cosmos1..",\
      "proposers": [\
        "cosmos1.."\
      ],\
      "submittedAt": "2021-12-17T08:03:27.099649352Z",\
      "groupVersion": "1",\
      "GroupPolicyVersion": "1",\
      "status": "STATUS_CLOSED",\
      "result": "RESULT_ACCEPTED",\
      "voteState": {\
        "yesCount": "1",\
        "noCount": "0",\
        "abstainCount": "0",\
        "vetoCount": "0"\
      },\
      "windows": {\
        "min_execution_period": "0s",\
        "voting_period": "432000s"\
      },\
      "executorResult": "EXECUTOR_RESULT_NOT_RUN",\
      "messages": [\
        {"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"denom":"stake","amount":"100000000"}],"fromAddress":"cosmos1..","toAddress":"cosmos1.."}\
      ],\
      "title": "Title",\
      "summary": "Summary",\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

##### VoteByProposalVoter [​](https://docs.cosmos.network/v0.50/build/modules/group#votebyproposalvoter "Direct link to VoteByProposalVoter")

The `VoteByProposalVoter` endpoint allows users to query for vote by proposal id and voter account address.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/VoteByProposalVoter

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1","voter":"cosmos1.."}'  localhost:9090 cosmos.group.v1.Query/VoteByProposalVoter

```

Example Output:

```codeBlockLines_e6Vv
{
  "vote": {
    "proposalId": "1",
    "voter": "cosmos1..",
    "choice": "CHOICE_YES",
    "submittedAt": "2021-12-17T08:05:02.490164009Z"
  }
}

```

##### VotesByProposal [​](https://docs.cosmos.network/v0.50/build/modules/group#votesbyproposal "Direct link to VotesByProposal")

The `VotesByProposal` endpoint allows users to query for votes by proposal id with pagination flags.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/VotesByProposal

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"proposal_id":"1"}'  localhost:9090 cosmos.group.v1.Query/VotesByProposal

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposalId": "1",\
      "voter": "cosmos1..",\
      "choice": "CHOICE_YES",\
      "submittedAt": "2021-12-17T08:05:02.490164009Z"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

##### VotesByVoter [​](https://docs.cosmos.network/v0.50/build/modules/group#votesbyvoter "Direct link to VotesByVoter")

The `VotesByVoter` endpoint allows users to query for votes by voter account address with pagination flags.

```codeBlockLines_e6Vv
cosmos.group.v1.Query/VotesByVoter

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"voter":"cosmos1.."}'  localhost:9090 cosmos.group.v1.Query/VotesByVoter

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposalId": "1",\
      "voter": "cosmos1..",\
      "choice": "CHOICE_YES",\
      "submittedAt": "2021-12-17T08:05:02.490164009Z"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/group#rest "Direct link to REST")

A user can query the `group` module using REST endpoints.

##### GroupInfo [​](https://docs.cosmos.network/v0.50/build/modules/group#groupinfo-1 "Direct link to GroupInfo")

The `GroupInfo` endpoint allows users to query for group info by given group id.

```codeBlockLines_e6Vv
/cosmos/group/v1/group_info/{group_id}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/group_info/1

```

Example Output:

```codeBlockLines_e6Vv
{
  "info": {
    "id": "1",
    "admin": "cosmos1..",
    "metadata": "AQ==",
    "version": "1",
    "total_weight": "3"
  }
}

```

##### GroupPolicyInfo [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppolicyinfo-1 "Direct link to GroupPolicyInfo")

The `GroupPolicyInfo` endpoint allows users to query for group policy info by account address of group policy.

```codeBlockLines_e6Vv
/cosmos/group/v1/group_policy_info/{address}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/group_policy_info/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "info": {
    "address": "cosmos1..",
    "group_id": "1",
    "admin": "cosmos1..",
    "metadata": "AQ==",
    "version": "1",
    "decision_policy": {
      "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",
      "threshold": "1",
      "windows": {
        "voting_period": "120h",
        "min_execution_period": "0s"
      }
    },
  }
}

```

##### GroupMembers [​](https://docs.cosmos.network/v0.50/build/modules/group#groupmembers-1 "Direct link to GroupMembers")

The `GroupMembers` endpoint allows users to query for group members by group id with pagination flags.

```codeBlockLines_e6Vv
/cosmos/group/v1/group_members/{group_id}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/group_members/1

```

Example Output:

```codeBlockLines_e6Vv
{
  "members": [\
    {\
      "group_id": "1",\
      "member": {\
        "address": "cosmos1..",\
        "weight": "1",\
        "metadata": "AQ=="\
      }\
    },\
    {\
      "group_id": "1",\
      "member": {\
        "address": "cosmos1..",\
        "weight": "2",\
        "metadata": "AQ=="\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }
}

```

##### GroupsByAdmin [​](https://docs.cosmos.network/v0.50/build/modules/group#groupsbyadmin-1 "Direct link to GroupsByAdmin")

The `GroupsByAdmin` endpoint allows users to query for groups by admin account address with pagination flags.

```codeBlockLines_e6Vv
/cosmos/group/v1/groups_by_admin/{admin}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/groups_by_admin/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "groups": [\
    {\
      "id": "1",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "total_weight": "3"\
    },\
    {\
      "id": "2",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "total_weight": "3"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }
}

```

##### GroupPoliciesByGroup [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppoliciesbygroup-1 "Direct link to GroupPoliciesByGroup")

The `GroupPoliciesByGroup` endpoint allows users to query for group policies by group id with pagination flags.

```codeBlockLines_e6Vv
/cosmos/group/v1/group_policies_by_group/{group_id}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/group_policies_by_group/1

```

Example Output:

```codeBlockLines_e6Vv
{
  "group_policies": [\
    {\
      "address": "cosmos1..",\
      "group_id": "1",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "decision_policy": {\
        "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",\
        "threshold": "1",\
        "windows": {\
          "voting_period": "120h",\
          "min_execution_period": "0s"\
      }\
      },\
    },\
    {\
      "address": "cosmos1..",\
      "group_id": "1",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "decision_policy": {\
        "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",\
        "threshold": "1",\
        "windows": {\
          "voting_period": "120h",\
          "min_execution_period": "0s"\
      }\
      },\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }
}

```

##### GroupPoliciesByAdmin [​](https://docs.cosmos.network/v0.50/build/modules/group#grouppoliciesbyadmin-1 "Direct link to GroupPoliciesByAdmin")

The `GroupPoliciesByAdmin` endpoint allows users to query for group policies by admin account address with pagination flags.

```codeBlockLines_e6Vv
/cosmos/group/v1/group_policies_by_admin/{admin}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/group_policies_by_admin/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "group_policies": [\
    {\
      "address": "cosmos1..",\
      "group_id": "1",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "decision_policy": {\
        "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",\
        "threshold": "1",\
        "windows": {\
          "voting_period": "120h",\
          "min_execution_period": "0s"\
      }\
      },\
    },\
    {\
      "address": "cosmos1..",\
      "group_id": "1",\
      "admin": "cosmos1..",\
      "metadata": "AQ==",\
      "version": "1",\
      "decision_policy": {\
        "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",\
        "threshold": "1",\
        "windows": {\
          "voting_period": "120h",\
          "min_execution_period": "0s"\
      }\
      },\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }

```

##### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#proposal-3 "Direct link to Proposal")

The `Proposal` endpoint allows users to query for proposal by id.

```codeBlockLines_e6Vv
/cosmos/group/v1/proposal/{proposal_id}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/proposal/1

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposal": {
    "proposal_id": "1",
    "address": "cosmos1..",
    "metadata": "AQ==",
    "proposers": [\
      "cosmos1.."\
    ],
    "submitted_at": "2021-12-17T07:06:26.310638964Z",
    "group_version": "1",
    "group_policy_version": "1",
    "status": "STATUS_SUBMITTED",
    "result": "RESULT_UNFINALIZED",
    "vote_state": {
      "yes_count": "0",
      "no_count": "0",
      "abstain_count": "0",
      "veto_count": "0"
    },
    "windows": {
      "min_execution_period": "0s",
      "voting_period": "432000s"
    },
    "executor_result": "EXECUTOR_RESULT_NOT_RUN",
    "messages": [\
      {\
        "@type": "/cosmos.bank.v1beta1.MsgSend",\
        "from_address": "cosmos1..",\
        "to_address": "cosmos1..",\
        "amount": [\
          {\
            "denom": "stake",\
            "amount": "100000000"\
          }\
        ]\
      }\
    ],
    "title": "Title",
    "summary": "Summary",
  }
}

```

##### ProposalsByGroupPolicy [​](https://docs.cosmos.network/v0.50/build/modules/group#proposalsbygrouppolicy-1 "Direct link to ProposalsByGroupPolicy")

The `ProposalsByGroupPolicy` endpoint allows users to query for proposals by account address of group policy with pagination flags.

```codeBlockLines_e6Vv
/cosmos/group/v1/proposals_by_group_policy/{address}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/proposals_by_group_policy/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "proposals": [\
    {\
      "id": "1",\
      "group_policy_address": "cosmos1..",\
      "metadata": "AQ==",\
      "proposers": [\
        "cosmos1.."\
      ],\
      "submit_time": "2021-12-17T08:03:27.099649352Z",\
      "group_version": "1",\
      "group_policy_version": "1",\
      "status": "STATUS_CLOSED",\
      "result": "RESULT_ACCEPTED",\
      "vote_state": {\
        "yes_count": "1",\
        "no_count": "0",\
        "abstain_count": "0",\
        "veto_count": "0"\
      },\
      "windows": {\
        "min_execution_period": "0s",\
        "voting_period": "432000s"\
      },\
      "executor_result": "EXECUTOR_RESULT_NOT_RUN",\
      "messages": [\
        {\
          "@type": "/cosmos.bank.v1beta1.MsgSend",\
          "from_address": "cosmos1..",\
          "to_address": "cosmos1..",\
          "amount": [\
            {\
              "denom": "stake",\
              "amount": "100000000"\
            }\
          ]\
        }\
      ]\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### VoteByProposalVoter [​](https://docs.cosmos.network/v0.50/build/modules/group#votebyproposalvoter-1 "Direct link to VoteByProposalVoter")

The `VoteByProposalVoter` endpoint allows users to query for vote by proposal id and voter account address.

```codeBlockLines_e6Vv
/cosmos/group/v1/vote_by_proposal_voter/{proposal_id}/{voter}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1beta1/vote_by_proposal_voter/1/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "vote": {
    "proposal_id": "1",
    "voter": "cosmos1..",
    "choice": "CHOICE_YES",
    "metadata": "AQ==",
    "submitted_at": "2021-12-17T08:05:02.490164009Z"
  }
}

```

##### VotesByProposal [​](https://docs.cosmos.network/v0.50/build/modules/group#votesbyproposal-1 "Direct link to VotesByProposal")

The `VotesByProposal` endpoint allows users to query for votes by proposal id with pagination flags.

```codeBlockLines_e6Vv
/cosmos/group/v1/votes_by_proposal/{proposal_id}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/votes_by_proposal/1

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposal_id": "1",\
      "voter": "cosmos1..",\
      "option": "CHOICE_YES",\
      "metadata": "AQ==",\
      "submit_time": "2021-12-17T08:05:02.490164009Z"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### VotesByVoter [​](https://docs.cosmos.network/v0.50/build/modules/group#votesbyvoter-1 "Direct link to VotesByVoter")

The `VotesByVoter` endpoint allows users to query for votes by voter account address with pagination flags.

```codeBlockLines_e6Vv
/cosmos/group/v1/votes_by_voter/{voter}

```

Example:

```codeBlockLines_e6Vv
curl localhost:1317/cosmos/group/v1/votes_by_voter/cosmos1..

```

Example Output:

```codeBlockLines_e6Vv
{
  "votes": [\
    {\
      "proposal_id": "1",\
      "voter": "cosmos1..",\
      "choice": "CHOICE_YES",\
      "metadata": "AQ==",\
      "submitted_at": "2021-12-17T08:05:02.490164009Z"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

### Metadata [​](https://docs.cosmos.network/v0.50/build/modules/group#metadata "Direct link to Metadata")

The group module has four locations for metadata where users can provide further context about the on-chain actions they are taking. By default all metadata fields have a 255 character length field where metadata can be stored in json format, either on-chain or off-chain depending on the amount of data required. Here we provide a recommendation for the json structure and where the data should be stored. There are two important factors in making these recommendations. First, that the group and gov modules are consistent with one another, note the number of proposals made by all groups may be quite large. Second, that client applications such as block explorers and governance interfaces have confidence in the consistency of metadata structure across chains.

#### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/group#proposal-4 "Direct link to Proposal")

Location: off-chain as json object stored on IPFS (mirrors [gov proposal](https://docs.cosmos.network/v0.50/build/modules/gov#metadata))

```codeBlockLines_e6Vv
{
  "title": "",
  "authors": [""],
  "summary": "",
  "details": "",
  "proposal_forum_url": "",
  "vote_option_context": "",
}

```

note

The `authors` field is an array of strings, this is to allow for multiple authors to be listed in the metadata.<br/>
In v0.46, the `authors` field is a comma-separated string. Frontends are encouraged to support both formats for backwards compatibility.

#### Vote [​](https://docs.cosmos.network/v0.50/build/modules/group#vote-2 "Direct link to Vote")

Location: on-chain as json within 255 character limit (mirrors [gov vote](https://docs.cosmos.network/v0.50/build/modules/gov#metadata))

```codeBlockLines_e6Vv
{
  "justification": "",
}

```

#### Group [​](https://docs.cosmos.network/v0.50/build/modules/group#group-1 "Direct link to Group")

Location: off-chain as json object stored on IPFS

```codeBlockLines_e6Vv
{
  "name": "",
  "description": "",
  "group_website_url": "",
  "group_forum_url": "",
}

```

#### Decision Policy [​](https://docs.cosmos.network/v0.50/build/modules/group#decision-policy-1 "Direct link to Decision policy")

Location: on-chain as json within 255 character limit

```codeBlockLines_e6Vv
{
  "name": "",
  "description": "",
}

```

---

## `x/mint`

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/mint#contents "Direct link to Contents")

- [State](https://docs.cosmos.network/v0.50/build/modules/mint#state)
  - [Minter](https://docs.cosmos.network/v0.50/build/modules/mint#minter)
  - [Params](https://docs.cosmos.network/v0.50/build/modules/mint#params)
- [Begin-Block](https://docs.cosmos.network/v0.50/build/modules/mint#begin-block)
  - [NextInflationRate](https://docs.cosmos.network/v0.50/build/modules/mint#nextinflationrate)
  - [NextAnnualProvisions](https://docs.cosmos.network/v0.50/build/modules/mint#nextannualprovisions)
  - [BlockProvision](https://docs.cosmos.network/v0.50/build/modules/mint#blockprovision)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/mint#parameters)
- [Events](https://docs.cosmos.network/v0.50/build/modules/mint#events)
  - [BeginBlocker](https://docs.cosmos.network/v0.50/build/modules/mint#beginblocker)
- [Client](https://docs.cosmos.network/v0.50/build/modules/mint#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/mint#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/mint#grpc)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/mint#rest)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/mint#concepts "Direct link to Concepts")

#### The Minting Mechanism [​](https://docs.cosmos.network/v0.50/build/modules/mint#the-minting-mechanism "Direct link to The Minting Mechanism")

The minting mechanism was designed to:

- allow for a flexible inflation rate determined by market demand targeting a particular bonded-stake ratio
- effect a balance between market liquidity and staked supply

In order to best determine the appropriate market rate for inflation rewards, a<br/>
moving change rate is used. The moving change rate mechanism ensures that if<br/>
the % bonded is either over or under the goal %-bonded, the inflation rate will<br/>
adjust to further incentivize or disincentivize being bonded, respectively. Setting the goal<br/>
%-bonded at less than 100% encourages the network to maintain some non-staked tokens<br/>
which should help provide some liquidity.

It can be broken down in the following way:

- If the actual percentage of bonded tokens is below the goal %-bonded the inflation rate will<br/>
  increase until a maximum value is reached
- If the goal % bonded (67% in Cosmos-Hub) is maintained, then the inflation<br/>
  rate will stay constant
- If the actual percentage of bonded tokens is above the goal %-bonded the inflation rate will<br/>
  decrease until a minimum value is reached

### State [​](https://docs.cosmos.network/v0.50/build/modules/mint#state "Direct link to State")

#### Minter [​](https://docs.cosmos.network/v0.50/build/modules/mint#minter "Direct link to Minter")

The minter is a space for holding current inflation information.

- Minter: `0x00 -> ProtocolBuffer(minter)`

proto/cosmos/mint/v1beta1/mint.proto

```codeBlockLines_e6Vv
// Minter represents the minting state.
message Minter {
  // current annual inflation rate
  string inflation = 1 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // current annual expected provisions
  string annual_provisions = 2 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/mint/v1beta1/mint.proto#L10-L24)

#### Params [​](https://docs.cosmos.network/v0.50/build/modules/mint#params "Direct link to Params")

The mint module stores its params in state with the prefix of `0x01`,<br/>
it can be updated with governance or the address with authority.

- Params: `mint/params -> legacy_amino(params)`

proto/cosmos/mint/v1beta1/mint.proto

```codeBlockLines_e6Vv
// Params defines the parameters for the x/mint module.
message Params {
  option (gogoproto.goproto_stringer) = false;
  option (amino.name)                 = "cosmos-sdk/x/mint/Params";

  // type of coin to mint
  string mint_denom = 1;
  // maximum annual change in inflation rate
  string inflation_rate_change = 2 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // maximum inflation rate
  string inflation_max = 3 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // minimum inflation rate
  string inflation_min = 4 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // goal of percent bonded atoms
  string goal_bonded = 5 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // expected blocks per year
  uint64 blocks_per_year = 6;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/mint/v1beta1/mint.proto#L26-L59)

### Begin-Block [​](https://docs.cosmos.network/v0.50/build/modules/mint#begin-block "Direct link to Begin-Block")

Minting parameters are recalculated and inflation paid at the beginning of each block.

#### Inflation Rate Calculation [​](https://docs.cosmos.network/v0.50/build/modules/mint#inflation-rate-calculation "Direct link to Inflation rate calculation")

Inflation rate is calculated using an "inflation calculation function" that's<br/>
passed to the `NewAppModule` function. If no function is passed, then the SDK's<br/>
default inflation function will be used (`NextInflationRate`). In case a custom<br/>
inflation calculation logic is needed, this can be achieved by defining and<br/>
passing a function that matches `InflationCalculationFn`'s signature.

```codeBlockLines_e6Vv
type InflationCalculationFn func(ctx sdk.Context, minter Minter, params Params, bondedRatio math.LegacyDec) math.LegacyDec

```

##### NextInflationRate [​](https://docs.cosmos.network/v0.50/build/modules/mint#nextinflationrate "Direct link to NextInflationRate")

The target annual inflation rate is recalculated each block.<br/>
The inflation is also subject to a rate change (positive or negative)<br/>
depending on the distance from the desired ratio (67%). The maximum rate change<br/>
possible is defined to be 13% per year, however, the annual inflation is capped<br/>
as between 7% and 20%.

```codeBlockLines_e6Vv
NextInflationRate(params Params, bondedRatio math.LegacyDec) (inflation math.LegacyDec) {
    inflationRateChangePerYear = (1 - bondedRatio/params.GoalBonded) * params.InflationRateChange
    inflationRateChange = inflationRateChangePerYear/blocksPerYr

    // increase the new annual inflation for this next block
    inflation += inflationRateChange
    if inflation > params.InflationMax {
        inflation = params.InflationMax
    }
    if inflation < params.InflationMin {
        inflation = params.InflationMin
    }

    return inflation
}

```

#### NextAnnualProvisions [​](https://docs.cosmos.network/v0.50/build/modules/mint#nextannualprovisions "Direct link to NextAnnualProvisions")

Calculate the annual provisions based on current total supply and inflation<br/>
rate. This parameter is calculated once per block.

```codeBlockLines_e6Vv
NextAnnualProvisions(params Params, totalSupply math.LegacyDec) (provisions math.LegacyDec) {
    return Inflation * totalSupply

```

#### BlockProvision [​](https://docs.cosmos.network/v0.50/build/modules/mint#blockprovision "Direct link to BlockProvision")

Calculate the provisions generated for each block based on current annual provisions. The provisions are then minted by the `mint` module's `ModuleMinterAccount` and then transferred to the `auth`'s `FeeCollector` `ModuleAccount`.

```codeBlockLines_e6Vv
BlockProvision(params Params) sdk.Coin {
    provisionAmt = AnnualProvisions/ params.BlocksPerYear
    return sdk.NewCoin(params.MintDenom, provisionAmt.Truncate())

```

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/mint#parameters "Direct link to Parameters")

The minting module contains the following parameters:

| Key                 | Type            | Example                |
| ------------------- | --------------- | ---------------------- |
| MintDenom           | string          | "uatom"                |
| InflationRateChange | string (dec)    | "0.130000000000000000" |
| InflationMax        | string (dec)    | "0.200000000000000000" |
| InflationMin        | string (dec)    | "0.070000000000000000" |
| GoalBonded          | string (dec)    | "0.670000000000000000" |
| BlocksPerYear       | string (uint64) | "6311520"              |

### Events [​](https://docs.cosmos.network/v0.50/build/modules/mint#events "Direct link to Events")

The minting module emits the following events:

#### BeginBlocker [​](https://docs.cosmos.network/v0.50/build/modules/mint#beginblocker "Direct link to BeginBlocker")

| Type | Attribute Key     | Attribute Value    |
| ---- | ----------------- | ------------------ |
| mint | bonded_ratio      | {bondedRatio}      |
| mint | inflation         | {inflation}        |
| mint | annual_provisions | {annualProvisions} |
| mint | amount            | {amount}           |

### Client [​](https://docs.cosmos.network/v0.50/build/modules/mint#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/mint#cli "Direct link to CLI")

A user can query and interact with the `mint` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/mint#query "Direct link to Query")

The `query` commands allows users to query `mint` state.

```codeBlockLines_e6Vv
simd query mint --help

```

###### Annual-provisions [​](https://docs.cosmos.network/v0.50/build/modules/mint#annual-provisions "Direct link to annual-provisions")

The `annual-provisions` command allows users to query the current minting annual provisions value

```codeBlockLines_e6Vv
simd query mint annual-provisions [flags]

```

Example:

```codeBlockLines_e6Vv
simd query mint annual-provisions

```

Example Output:

```codeBlockLines_e6Vv
22268504368893.612100895088410693

```

###### Inflation [​](https://docs.cosmos.network/v0.50/build/modules/mint#inflation "Direct link to inflation")

The `inflation` command allows users to query the current minting inflation value

```codeBlockLines_e6Vv
simd query mint inflation [flags]

```

Example:

```codeBlockLines_e6Vv
simd query mint inflation

```

Example Output:

```codeBlockLines_e6Vv
0.199200302563256955

```

###### Params [​](https://docs.cosmos.network/v0.50/build/modules/mint#params-1 "Direct link to params")

The `params` command allows users to query the current minting parameters

```codeBlockLines_e6Vv
simd query mint params [flags]

```

Example:

```codeBlockLines_e6Vv
blocks_per_year: "4360000"
goal_bonded: "0.670000000000000000"
inflation_max: "0.200000000000000000"
inflation_min: "0.070000000000000000"
inflation_rate_change: "0.130000000000000000"
mint_denom: stake

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/mint#grpc "Direct link to gRPC")

A user can query the `mint` module using gRPC endpoints.

##### AnnualProvisions [​](https://docs.cosmos.network/v0.50/build/modules/mint#annualprovisions "Direct link to AnnualProvisions")

The `AnnualProvisions` endpoint allows users to query the current minting annual provisions value

```codeBlockLines_e6Vv
/cosmos.mint.v1beta1.Query/AnnualProvisions

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.mint.v1beta1.Query/AnnualProvisions

```

Example Output:

```codeBlockLines_e6Vv
{
  "annualProvisions": "1432452520532626265712995618"
}

```

##### Inflation [​](https://docs.cosmos.network/v0.50/build/modules/mint#inflation-1 "Direct link to Inflation")

The `Inflation` endpoint allows users to query the current minting inflation value

```codeBlockLines_e6Vv
/cosmos.mint.v1beta1.Query/Inflation

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.mint.v1beta1.Query/Inflation

```

Example Output:

```codeBlockLines_e6Vv
{
  "inflation": "130197115720711261"
}

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/mint#params-2 "Direct link to Params")

The `Params` endpoint allows users to query the current minting parameters

```codeBlockLines_e6Vv
/cosmos.mint.v1beta1.Query/Params

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.mint.v1beta1.Query/Params

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "mintDenom": "stake",
    "inflationRateChange": "130000000000000000",
    "inflationMax": "200000000000000000",
    "inflationMin": "70000000000000000",
    "goalBonded": "670000000000000000",
    "blocksPerYear": "6311520"
  }
}

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/mint#rest "Direct link to REST")

A user can query the `mint` module using REST endpoints.

##### Annual-provisions [​](https://docs.cosmos.network/v0.50/build/modules/mint#annual-provisions-1 "Direct link to annual-provisions")

```codeBlockLines_e6Vv
/cosmos/mint/v1beta1/annual_provisions

```

Example:

```codeBlockLines_e6Vv
curl "localhost:1317/cosmos/mint/v1beta1/annual_provisions"

```

Example Output:

```codeBlockLines_e6Vv
{
  "annualProvisions": "1432452520532626265712995618"
}

```

##### Inflation [​](https://docs.cosmos.network/v0.50/build/modules/mint#inflation-2 "Direct link to inflation")

```codeBlockLines_e6Vv
/cosmos/mint/v1beta1/inflation

```

Example:

```codeBlockLines_e6Vv
curl "localhost:1317/cosmos/mint/v1beta1/inflation"

```

Example Output:

```codeBlockLines_e6Vv
{
  "inflation": "130197115720711261"
}

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/mint#params-3 "Direct link to params")

```codeBlockLines_e6Vv
/cosmos/mint/v1beta1/params

```

Example:

```codeBlockLines_e6Vv
curl "localhost:1317/cosmos/mint/v1beta1/params"

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "mintDenom": "stake",
    "inflationRateChange": "130000000000000000",
    "inflationMax": "200000000000000000",
    "inflationMin": "70000000000000000",
    "goalBonded": "670000000000000000",
    "blocksPerYear": "6311520"
  }
}

```

---

## `x/nft`

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/nft#contents "Direct link to Contents")

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/nft#abstract "Direct link to Abstract")

`x/nft` is an implementation of a Cosmos SDK module, per [ADR 43](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-043-nft-module.md), that allows you to create nft classification, create nft, transfer nft, update nft, and support various queries by integrating the module. It is fully compatible with the ERC721 specification.

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/nft#concepts)
  - [Class](https://docs.cosmos.network/v0.50/build/modules/nft#class)
  - [NFT](https://docs.cosmos.network/v0.50/build/modules/nft#nft)
- [State](https://docs.cosmos.network/v0.50/build/modules/nft#state)
  - [Class](https://docs.cosmos.network/v0.50/build/modules/nft#class-1)
  - [NFT](https://docs.cosmos.network/v0.50/build/modules/nft#nft-1)
  - [NFTOfClassByOwner](https://docs.cosmos.network/v0.50/build/modules/nft#nftofclassbyowner)
  - [Owner](https://docs.cosmos.network/v0.50/build/modules/nft#owner)
  - [TotalSupply](https://docs.cosmos.network/v0.50/build/modules/nft#totalsupply)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/nft#messages)
  - [MsgSend](https://docs.cosmos.network/v0.50/build/modules/nft#msgsend)
- [Events](https://docs.cosmos.network/v0.50/build/modules/nft#events)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/nft#concepts "Direct link to Concepts")

#### Class [​](https://docs.cosmos.network/v0.50/build/modules/nft#class "Direct link to Class")

`x/nft` module defines a struct `Class` to describe the common characteristics of a class of nft, under this class, you can create a variety of nft, which is equivalent to an erc721 contract for Ethereum. The design is defined in the [ADR 043](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-043-nft-module.md).

#### NFT [​](https://docs.cosmos.network/v0.50/build/modules/nft#nft "Direct link to NFT")

The full name of NFT is Non-Fungible Tokens. Because of the irreplaceable nature of NFT, it means that it can be used to represent unique things. The nft implemented by this module is fully compatible with Ethereum ERC721 standard.

### State [​](https://docs.cosmos.network/v0.50/build/modules/nft#state "Direct link to State")

#### Class [​](https://docs.cosmos.network/v0.50/build/modules/nft#class-1 "Direct link to Class")

Class is mainly composed of `id`, `name`, `symbol`, `description`, `uri`, `uri_hash`, `data` where `id` is the unique identifier of the class, similar to the Ethereum ERC721 contract address, the others are optional.

- Class: `0x01 | classID | -> ProtocolBuffer(Class)`

#### NFT [​](https://docs.cosmos.network/v0.50/build/modules/nft#nft-1 "Direct link to NFT")

NFT is mainly composed of `class_id`, `id`, `uri`, `uri_hash` and `data`. Among them, `class_id` and `id` are two-tuples that identify the uniqueness of nft, `uri` and `uri_hash` is optional, which identifies the off-chain storage location of the nft, and `data` is an Any type. Use Any chain of `x/nft` modules can be customized by extending this field

- NFT: `0x02 | classID | 0x00 | nftID |-> ProtocolBuffer(NFT)`

#### NFTOfClassByOwner [​](https://docs.cosmos.network/v0.50/build/modules/nft#nftofclassbyowner "Direct link to NFTOfClassByOwner")

NFTOfClassByOwner is mainly to realize the function of querying all nfts using classID and owner, without other redundant functions.

- NFTOfClassByOwner: `0x03 | owner | 0x00 | classID | 0x00 | nftID |-> 0x01`

#### Owner [​](https://docs.cosmos.network/v0.50/build/modules/nft#owner "Direct link to Owner")

Since there is no extra field in NFT to indicate the owner of nft, an additional key-value pair is used to save the ownership of nft. With the transfer of nft, the key-value pair is updated synchronously.

- OwnerKey: `0x04 | classID | 0x00  | nftID |-> owner`

#### TotalSupply [​](https://docs.cosmos.network/v0.50/build/modules/nft#totalsupply "Direct link to TotalSupply")

TotalSupply is responsible for tracking the number of all nfts under a certain class. Mint operation is performed under the changed class, supply increases by one, burn operation, and supply decreases by one.

- OwnerKey: `0x05 | classID |-> totalSupply`

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/nft#messages "Direct link to Messages")

In this section we describe the processing of messages for the NFT module.

danger

The validation of `ClassID` and `NftID` is left to the app developer.

The SDK does not provide any validation for these fields.

#### MsgSend [​](https://docs.cosmos.network/v0.50/build/modules/nft#msgsend "Direct link to MsgSend")

You can use the `MsgSend` message to transfer the ownership of nft. This is a function provided by the `x/nft` module. Of course, you can use the `Transfer` method to implement your own transfer logic, but you need to pay extra attention to the transfer permissions.

The message handling should fail if:

- provided `ClassID` does not exist.
- provided `Id` does not exist.
- provided `Sender` does not the owner of nft.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/nft#events "Direct link to Events")

The nft module emits proto events defined in [the Protobuf reference](https://buf.build/cosmos/cosmos-sdk/docs/main:cosmos.nft.v1beta1).

---

## `x/params`

> Note: The Params module has been deprecated in favour of each module housing its own parameters.

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/params#abstract "Direct link to Abstract")

Package params provides a globally available parameter store.

There are two main types, Keeper and Subspace. Subspace is an isolated namespace for a<br/>
paramstore, where keys are prefixed by preconfigured spacename. Keeper has a<br/>
permission to access all existing spaces.

Subspace can be used by the individual keepers, which need a private parameter store<br/>
that the other keepers cannot modify. The params Keeper can be used to add a route to `x/gov` router in order to modify any parameter in case a proposal passes.

The following contents explains how to use params module for master and user modules.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/params#contents "Direct link to Contents")

- [Keeper](https://docs.cosmos.network/v0.50/build/modules/params#keeper)
- [Subspace](https://docs.cosmos.network/v0.50/build/modules/params#subspace)
  - [Key](https://docs.cosmos.network/v0.50/build/modules/params#key)
  - [KeyTable](https://docs.cosmos.network/v0.50/build/modules/params#keytable)
  - [ParamSet](https://docs.cosmos.network/v0.50/build/modules/params#paramset)

### Keeper [​](https://docs.cosmos.network/v0.50/build/modules/params#keeper "Direct link to Keeper")

In the app initialization stage, [subspaces](https://docs.cosmos.network/v0.50/build/modules/params#subspace) can be allocated for other modules' keeper using `Keeper.Subspace` and are stored in `Keeper.spaces`. Then, those modules can have a reference to their specific parameter store through `Keeper.GetSubspace`.

Example:

```codeBlockLines_e6Vv
type ExampleKeeper struct {
    paramSpace paramtypes.Subspace
}

func (k ExampleKeeper) SetParams(ctx sdk.Context, params types.Params) {
    k.paramSpace.SetParamSet(ctx, &params)
}

```

### Subspace [​](https://docs.cosmos.network/v0.50/build/modules/params#subspace "Direct link to Subspace")

`Subspace` is a prefixed subspace of the parameter store. Each module which uses the<br/>
parameter store will take a `Subspace` to isolate permission to access.

#### Key [​](https://docs.cosmos.network/v0.50/build/modules/params#key "Direct link to Key")

Parameter keys are human readable alphanumeric strings. A parameter for the key<br/>
`"ExampleParameter"` is stored under `[]byte("SubspaceName" + "/" + "ExampleParameter")`,<br/>
where `"SubspaceName"` is the name of the subspace.

Subkeys are secondary parameter keys those are used along with a primary parameter key.<br/>
Subkeys can be used for grouping or dynamic parameter key generation during runtime.

#### KeyTable [​](https://docs.cosmos.network/v0.50/build/modules/params#keytable "Direct link to KeyTable")

All of the parameter keys that will be used should be registered at the compile<br/>
time. `KeyTable` is essentially a `map[string]attribute`, where the `string` is a parameter key.

Currently, `attribute` consists of a `reflect.Type`, which indicates the parameter<br/>
type to check that provided key and value are compatible and registered, as well as a function `ValueValidatorFn` to validate values.

Only primary keys have to be registered on the `KeyTable`. Subkeys inherit the<br/>
attribute of the primary key.

#### ParamSet [​](https://docs.cosmos.network/v0.50/build/modules/params#paramset "Direct link to ParamSet")

Modules often define parameters as a proto message. The generated struct can implement<br/>
`ParamSet` interface to be used with the following methods:

- `KeyTable.RegisterParamSet()`: registers all parameters in the struct
- `Subspace.{Get, Set}ParamSet()`: Get to & Set from the struct

The implementor should be a pointer in order to use `GetParamSet()`.

---

## `x/slashing`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/slashing#abstract "Direct link to Abstract")

This section specifies the slashing module of the Cosmos SDK, which implements functionality<br/>
first outlined in the [Cosmos Whitepaper](https://cosmos.network/about/whitepaper) in June 2016.

The slashing module enables Cosmos SDK-based blockchains to disincentivize any attributable action<br/>
by a protocol-recognized actor with value at stake by penalizing them ("slashing").

Penalties may include, but are not limited to:

- Burning some amount of their stake
- Removing their ability to vote on future blocks for a period of time.

This module will be used by the Cosmos Hub, the first hub in the Cosmos ecosystem.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/slashing#contents "Direct link to Contents")

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/slashing#concepts)
  - [States](https://docs.cosmos.network/v0.50/build/modules/slashing#states)
  - [Tombstone Caps](https://docs.cosmos.network/v0.50/build/modules/slashing#tombstone-caps)
  - [Infraction Timelines](https://docs.cosmos.network/v0.50/build/modules/slashing#infraction-timelines)
- [State](https://docs.cosmos.network/v0.50/build/modules/slashing#state)
  - [Signing Info (Liveness)](https://docs.cosmos.network/v0.50/build/modules/slashing#signing-info-liveness)
  - [Params](https://docs.cosmos.network/v0.50/build/modules/slashing#params)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/slashing#messages)
  - [Unjail](https://docs.cosmos.network/v0.50/build/modules/slashing#unjail)
- [BeginBlock](https://docs.cosmos.network/v0.50/build/modules/slashing#beginblock)
  - [Liveness Tracking](https://docs.cosmos.network/v0.50/build/modules/slashing#liveness-tracking)
- [Hooks](https://docs.cosmos.network/v0.50/build/modules/slashing#hooks)
- [Events](https://docs.cosmos.network/v0.50/build/modules/slashing#events)
- [Staking Tombstone](https://docs.cosmos.network/v0.50/build/modules/slashing#staking-tombstone)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/slashing#parameters)
- [CLI](https://docs.cosmos.network/v0.50/build/modules/slashing#cli)
  - [Query](https://docs.cosmos.network/v0.50/build/modules/slashing#query)
  - [Transactions](https://docs.cosmos.network/v0.50/build/modules/slashing#transactions)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/slashing#grpc)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/slashing#rest)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/slashing#concepts "Direct link to Concepts")

#### States [​](https://docs.cosmos.network/v0.50/build/modules/slashing#states "Direct link to States")

At any given time, there are any number of validators registered in the state<br/>
machine. Each block, the top `MaxValidators` (defined by `x/staking`) validators<br/>
who are not jailed become _bonded_, meaning that they may propose and vote on<br/>
blocks. Validators who are _bonded_ are _at stake_, meaning that part or all of<br/>
their stake and their delegators' stake is at risk if they commit a protocol fault.

For each of these validators we keep a `ValidatorSigningInfo` record that contains<br/>
information pertaining to validator's liveness and other infraction related<br/>
attributes.

#### Tombstone Caps [​](https://docs.cosmos.network/v0.50/build/modules/slashing#tombstone-caps "Direct link to Tombstone Caps")

In order to mitigate the impact of initially likely categories of non-malicious<br/>
protocol faults, the Cosmos Hub implements for each validator<br/>
a _tombstone_ cap, which only allows a validator to be slashed once for a double<br/>
sign fault. For example, if you misconfigure your HSM and double-sign a bunch of<br/>
old blocks, you'll only be punished for the first double-sign (and then immediately tombstombed). This will still be quite expensive and desirable to avoid, but tombstone caps<br/>
somewhat blunt the economic impact of unintentional misconfiguration.

Liveness faults do not have caps, as they can't stack upon each other. Liveness bugs are "detected" as soon as the infraction occurs, and the validators are immediately put in jail, so it is not possible for them to commit multiple liveness faults without unjailing in between.

#### Infraction Timelines [​](https://docs.cosmos.network/v0.50/build/modules/slashing#infraction-timelines "Direct link to Infraction Timelines")

To illustrate how the `x/slashing` module handles submitted evidence through<br/>
CometBFT consensus, consider the following examples:

**Definitions**:

_\[_: timeline start<br/>
<br/>
_\]_: timeline end

_Cn_: infraction `n` committed

_Dn_: infraction `n` discovered

_Vb_: validator bonded

_Vu_: validator unbonded

##### Single Double Sign Infraction [​](https://docs.cosmos.network/v0.50/build/modules/slashing#single-double-sign-infraction "Direct link to Single Double Sign Infraction")

\[----------C1----D1,Vu\-\-\---\]

A single infraction is committed then later discovered, at which point the<br/>
validator is unbonded and slashed at the full amount for the infraction.

##### Multiple Double Sign Infractions [​](https://docs.cosmos.network/v0.50/build/modules/slashing#multiple-double-sign-infractions "Direct link to Multiple Double Sign Infractions")

\[----------C1--C2---C3---D1,D2,D3Vu\-\-\---\]

Multiple infractions are committed and then later discovered, at which point the<br/>
validator is jailed and slashed for only one infraction. Because the validator<br/>
is also tombstoned, they can not rejoin the validator set.

### State [​](https://docs.cosmos.network/v0.50/build/modules/slashing#state "Direct link to State")

#### Signing Info (Liveness) [​](https://docs.cosmos.network/v0.50/build/modules/slashing#signing-info-liveness "Direct link to Signing Info (Liveness)")

Every block includes a set of precommits by the validators for the previous block,<br/>
known as the `LastCommitInfo` provided by CometBFT. A `LastCommitInfo` is valid so<br/>
long as it contains precommits from +2/3 of total voting power.

Proposers are incentivized to include precommits from all validators in the CometBFT `LastCommitInfo`<br/>
by receiving additional fees proportional to the difference between the voting<br/>
power included in the `LastCommitInfo` and +2/3 (see [fee distribution](https://docs.cosmos.network/v0.50/build/modules/distribution#begin-block)).

```codeBlockLines_e6Vv
type LastCommitInfo struct {
    Round int32
    Votes []VoteInfo
}

```

Validators are penalized for failing to be included in the `LastCommitInfo` for some<br/>
number of blocks by being automatically jailed, potentially slashed, and unbonded.

Information about validator's liveness activity is tracked through `ValidatorSigningInfo`.<br/>
It is indexed in the store as follows:

- ValidatorSigningInfo: `0x01 | ConsAddrLen (1 byte) | ConsAddress -> ProtocolBuffer(ValSigningInfo)`
- MissedBlocksBitArray: `0x02 | ConsAddrLen (1 byte) | ConsAddress | LittleEndianUint64(signArrayIndex) -> VarInt(didMiss)` (varint is a number encoding format)

The first mapping allows us to easily lookup the recent signing info for a<br/>
validator based on the validator's consensus address.

The second mapping (`MissedBlocksBitArray`) acts<br/>
as a bit-array of size `SignedBlocksWindow` that tells us if the validator missed<br/>
the block for a given index in the bit-array. The index in the bit-array is given<br/>
as little endian uint64.<br/>
The result is a `varint` that takes on `0` or `1`, where `0` indicates the<br/>
validator did not miss (did sign) the corresponding block, and `1` indicates<br/>
they missed the block (did not sign).

Note that the `MissedBlocksBitArray` is not explicitly initialized up-front. Keys<br/>
are added as we progress through the first `SignedBlocksWindow` blocks for a newly<br/>
bonded validator. The `SignedBlocksWindow` parameter defines the size<br/>
(number of blocks) of the sliding window used to track validator liveness.

The information stored for tracking validator liveness is as follows:

proto/cosmos/slashing/v1beta1/slashing.proto

```codeBlockLines_e6Vv
// ValidatorSigningInfo defines a validator's signing info for monitoring their
// liveness activity.
message ValidatorSigningInfo {
  option (gogoproto.equal)            = true;
  option (gogoproto.goproto_stringer) = false;

  string address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // Height at which validator was first a candidate OR was unjailed
  int64 start_height = 2;
  // Index which is incremented each time the validator was a bonded
  // in a block and may have signed a precommit or not. This in conjunction with the
  // `SignedBlocksWindow` param determines the index in the `MissedBlocksBitArray`.
  int64 index_offset = 3;
  // Timestamp until which the validator is jailed due to liveness downtime.
  google.protobuf.Timestamp jailed_until = 4
      [(gogoproto.stdtime) = true, (gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  // Whether or not a validator has been tombstoned (killed out of validator set). It is set
  // once the validator commits an equivocation or for any other configured misbehiavor.
  bool tombstoned = 5;
  // A counter kept to avoid unnecessary array reads.
  // Note that `Sum(MissedBlocksBitArray)` always equals `MissedBlocksCounter`.
  int64 missed_blocks_counter = 6;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/slashing/v1beta1/slashing.proto#L13-L35)

#### Params [​](https://docs.cosmos.network/v0.50/build/modules/slashing#params "Direct link to Params")

The slashing module stores it's params in state with the prefix of `0x00`,<br/>
it can be updated with governance or the address with authority.

- Params: `0x00 | ProtocolBuffer(Params)`

proto/cosmos/slashing/v1beta1/slashing.proto

```codeBlockLines_e6Vv
// Params represents the parameters used for by the slashing module.
message Params {
  option (amino.name) = "cosmos-sdk/x/slashing/Params";

  int64 signed_blocks_window  = 1;
  bytes min_signed_per_window = 2 [\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false,\
    (amino.dont_omitempty) = true\
  ];
  google.protobuf.Duration downtime_jail_duration = 3
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdduration) = true];
  bytes slash_fraction_double_sign = 4 [\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false,\
    (amino.dont_omitempty) = true\
  ];
  bytes slash_fraction_downtime = 5 [\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false,\
    (amino.dont_omitempty) = true\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/slashing/v1beta1/slashing.proto#L37-L59)

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/slashing#messages "Direct link to Messages")

In this section we describe the processing of messages for the `slashing` module.

#### Unjail [​](https://docs.cosmos.network/v0.50/build/modules/slashing#unjail "Direct link to Unjail")

If a validator was automatically unbonded due to downtime and wishes to come back online &<br/>
possibly rejoin the bonded set, it must send `MsgUnjail`:

```codeBlockLines_e6Vv
// MsgUnjail is an sdk.Msg used for unjailing a jailed validator, thus returning
// them into the bonded validator set, so they can begin receiving provisions
// and rewards again.
message MsgUnjail {
  string validator_addr = 1;
}

```

Below is a pseudocode of the `MsgSrv/Unjail` RPC:

```codeBlockLines_e6Vv
unjail(tx MsgUnjail)
    validator = getValidator(tx.ValidatorAddr)
    if validator == nil
      fail with "No validator found"

    if getSelfDelegation(validator) == 0
      fail with "validator must self delegate before unjailing"

    if !validator.Jailed
      fail with "Validator not jailed, cannot unjail"

    info = GetValidatorSigningInfo(operator)
    if info.Tombstoned
      fail with "Tombstoned validator cannot be unjailed"
    if block time < info.JailedUntil
      fail with "Validator still jailed, cannot unjail until period has expired"

    validator.Jailed = false
    setValidator(validator)

    return

```

If the validator has enough stake to be in the top `n = MaximumBondedValidators`, it will be automatically rebonded,<br/>
and all delegators still delegated to the validator will be rebonded and begin to again collect<br/>
provisions and rewards.

### BeginBlock [​](https://docs.cosmos.network/v0.50/build/modules/slashing#beginblock "Direct link to BeginBlock")

#### Liveness Tracking [​](https://docs.cosmos.network/v0.50/build/modules/slashing#liveness-tracking "Direct link to Liveness Tracking")

At the beginning of each block, we update the `ValidatorSigningInfo` for each<br/>
validator and check if they've crossed below the liveness threshold over a<br/>
sliding window. This sliding window is defined by `SignedBlocksWindow` and the<br/>
index in this window is determined by `IndexOffset` found in the validator's<br/>
`ValidatorSigningInfo`. For each block processed, the `IndexOffset` is incremented<br/>
regardless if the validator signed or not. Once the index is determined, the<br/>
`MissedBlocksBitArray` and `MissedBlocksCounter` are updated accordingly.

Finally, in order to determine if a validator crosses below the liveness threshold,<br/>
we fetch the maximum number of blocks missed, `maxMissed`, which is<br/>
`SignedBlocksWindow - (MinSignedPerWindow * SignedBlocksWindow)` and the minimum<br/>
height at which we can determine liveness, `minHeight`. If the current block is<br/>
greater than `minHeight` and the validator's `MissedBlocksCounter` is greater than<br/>
`maxMissed`, they will be slashed by `SlashFractionDowntime`, will be jailed<br/>
for `DowntimeJailDuration`, and have the following values reset:<br/>
`MissedBlocksBitArray`, `MissedBlocksCounter`, and `IndexOffset`.

**Note**: Liveness slashes do **NOT** lead to a tombstombing.

```codeBlockLines_e6Vv
height := block.Height

for vote in block.LastCommitInfo.Votes {
  signInfo := GetValidatorSigningInfo(vote.Validator.Address)

  // This is a relative index, so we counts blocks the validator SHOULD have
  // signed. We use the 0-value default signing info if not present, except for
  // start height.
  index := signInfo.IndexOffset % SignedBlocksWindow()
  signInfo.IndexOffset++

  // Update MissedBlocksBitArray and MissedBlocksCounter. The MissedBlocksCounter
  // just tracks the sum of MissedBlocksBitArray. That way we avoid needing to
  // read/write the whole array each time.
  missedPrevious := GetValidatorMissedBlockBitArray(vote.Validator.Address, index)
  missed := !signed

  switch {
  case !missedPrevious && missed:
    // array index has changed from not missed to missed, increment counter
    SetValidatorMissedBlockBitArray(vote.Validator.Address, index, true)
    signInfo.MissedBlocksCounter++

  case missedPrevious && !missed:
    // array index has changed from missed to not missed, decrement counter
    SetValidatorMissedBlockBitArray(vote.Validator.Address, index, false)
    signInfo.MissedBlocksCounter--

  default:
    // array index at this index has not changed; no need to update counter
  }

  if missed {
    // emit events...
  }

  minHeight := signInfo.StartHeight + SignedBlocksWindow()
  maxMissed := SignedBlocksWindow() - MinSignedPerWindow()

  // If we are past the minimum height and the validator has missed too many
  // jail and slash them.
  if height > minHeight && signInfo.MissedBlocksCounter > maxMissed {
    validator := ValidatorByConsAddr(vote.Validator.Address)

    // emit events...

    // We need to retrieve the stake distribution which signed the block, so we
    // subtract ValidatorUpdateDelay from the block height, and subtract an
    // additional 1 since this is the LastCommit.
    //
    // Note, that this CAN result in a negative "distributionHeight" up to
    // -ValidatorUpdateDelay-1, i.e. at the end of the pre-genesis block (none) = at the beginning of the genesis block.
    // That's fine since this is just used to filter unbonding delegations & redelegations.
    distributionHeight := height - sdk.ValidatorUpdateDelay - 1

    SlashWithInfractionReason(vote.Validator.Address, distributionHeight, vote.Validator.Power, SlashFractionDowntime(), stakingtypes.Downtime)
    Jail(vote.Validator.Address)

    signInfo.JailedUntil = block.Time.Add(DowntimeJailDuration())

    // We need to reset the counter & array so that the validator won't be
    // immediately slashed for downtime upon rebonding.
    signInfo.MissedBlocksCounter = 0
    signInfo.IndexOffset = 0
    ClearValidatorMissedBlockBitArray(vote.Validator.Address)
  }

  SetValidatorSigningInfo(vote.Validator.Address, signInfo)
}

```

### Hooks [​](https://docs.cosmos.network/v0.50/build/modules/slashing#hooks "Direct link to Hooks")

This section contains a description of the module's `hooks`. Hooks are operations that are executed automatically when events are raised.

#### Staking Hooks [​](https://docs.cosmos.network/v0.50/build/modules/slashing#staking-hooks "Direct link to Staking hooks")

The slashing module implements the `StakingHooks` defined in `x/staking` and are used as record-keeping of validators information. During the app initialization, these hooks should be registered in the staking module struct.

The following hooks impact the slashing state:

- `AfterValidatorBonded` creates a `ValidatorSigningInfo` instance as described in the following section.
- `AfterValidatorCreated` stores a validator's consensus key.
- `AfterValidatorRemoved` removes a validator's consensus key.

#### Validator Bonded [​](https://docs.cosmos.network/v0.50/build/modules/slashing#validator-bonded "Direct link to Validator Bonded")

Upon successful first-time bonding of a new validator, we create a new `ValidatorSigningInfo` structure for the<br/>
now-bonded validator, which `StartHeight` of the current block.

If the validator was out of the validator set and gets bonded again, its new bonded height is set.

```codeBlockLines_e6Vv
onValidatorBonded(address sdk.ValAddress)

  signingInfo, found = GetValidatorSigningInfo(address)
  if !found {
    signingInfo = ValidatorSigningInfo {
      StartHeight         : CurrentHeight,
      IndexOffset         : 0,
      JailedUntil         : time.Unix(0, 0),
      Tombstone           : false,
      MissedBloskCounter  : 0
    } else {
      signingInfo.StartHeight = CurrentHeight
    }

    setValidatorSigningInfo(signingInfo)
  }

  return

```

### Events [​](https://docs.cosmos.network/v0.50/build/modules/slashing#events "Direct link to Events")

The slashing module emits the following events:

#### MsgServer [​](https://docs.cosmos.network/v0.50/build/modules/slashing#msgserver "Direct link to MsgServer")

##### MsgUnjail [​](https://docs.cosmos.network/v0.50/build/modules/slashing#msgunjail "Direct link to MsgUnjail")

| Type    | Attribute Key | Attribute Value    |
| ------- | ------------- | ------------------ |
| message | module        | slashing           |
| message | sender        | {validatorAddress} |

#### Keeper [​](https://docs.cosmos.network/v0.50/build/modules/slashing#keeper "Direct link to Keeper")

#### BeginBlocker: HandleValidatorSignature [​](https://docs.cosmos.network/v0.50/build/modules/slashing#beginblocker-handlevalidatorsignature "Direct link to BeginBlocker: HandleValidatorSignature")

| Type  | Attribute Key | Attribute Value             |
| ----- | ------------- | --------------------------- |
| slash | address       | {validatorConsensusAddress} |
| slash | power         | {validatorPower}            |
| slash | reason        | {slashReason}               |
| slash | jailed \[0\]  | {validatorConsensusAddress} |
| slash | burned coins  | {math.Int}                  |

- \[0\] Only included if the validator is jailed.

| Type     | Attribute Key | Attribute Value             |
| -------- | ------------- | --------------------------- |
| liveness | address       | {validatorConsensusAddress} |
| liveness | missed_blocks | {missedBlocksCounter}       |
| liveness | height        | {blockHeight}               |

##### Slash [​](https://docs.cosmos.network/v0.50/build/modules/slashing#slash "Direct link to Slash")

- same as `"slash"` event from `HandleValidatorSignature`, but without the `jailed` attribute.

##### Jail [​](https://docs.cosmos.network/v0.50/build/modules/slashing#jail "Direct link to Jail")

| Type  | Attribute Key | Attribute Value    |
| ----- | ------------- | ------------------ |
| slash | jailed        | {validatorAddress} |

### Staking Tombstone [​](https://docs.cosmos.network/v0.50/build/modules/slashing#staking-tombstone "Direct link to Staking Tombstone")

#### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/slashing#abstract-1 "Direct link to Abstract")

In the current implementation of the `slashing` module, when the consensus engine<br/>
informs the state machine of a validator's consensus fault, the validator is<br/>
partially slashed, and put into a "jail period", a period of time in which they<br/>
are not allowed to rejoin the validator set. However, because of the nature of<br/>
consensus faults and ABCI, there can be a delay between an infraction occurring,<br/>
and evidence of the infraction reaching the state machine (this is one of the<br/>
primary reasons for the existence of the unbonding period).

> Note: The tombstone concept, only applies to faults that have a delay between<br/>
> the infraction occurring and evidence reaching the state machine. For example,<br/>
> evidence of a validator double signing may take a while to reach the state machine<br/>
> due to unpredictable evidence gossip layer delays and the ability of validators to<br/>
> selectively reveal double-signatures (e.g. to infrequently-online light clients).<br/>
> Liveness slashing, on the other hand, is detected immediately as soon as the<br/>
> infraction occurs, and therefore no slashing period is needed. A validator is<br/>
> immediately put into jail period, and they cannot commit another liveness fault<br/>
> until they unjail. In the future, there may be other types of byzantine faults<br/>
> that have delays (for example, submitting evidence of an invalid proposal as a transaction).<br/>
> When implemented, it will have to be decided whether these future types of<br/>
> byzantine faults will result in a tombstoning (and if not, the slash amounts<br/>
> will not be capped by a slashing period).

In the current system design, once a validator is put in the jail for a consensus<br/>
fault, after the `JailPeriod` they are allowed to send a transaction to `unjail`<br/>
themselves, and thus rejoin the validator set.

One of the "design desires" of the `slashing` module is that if multiple<br/>
infractions occur before evidence is executed (and a validator is put in jail),<br/>
they should only be punished for single worst infraction, but not cumulatively.<br/>
For example, if the sequence of events is:

1. Validator A commits Infraction 1 (worth 30% slash)
2. Validator A commits Infraction 2 (worth 40% slash)
3. Validator A commits Infraction 3 (worth 35% slash)
4. Evidence for Infraction 1 reaches state machine (and validator is put in jail)
5. Evidence for Infraction 2 reaches state machine
6. Evidence for Infraction 3 reaches state machine

Only Infraction 2 should have its slash take effect, as it is the highest. This<br/>
is done, so that in the case of the compromise of a validator's consensus key,<br/>
they will only be punished once, even if the hacker double-signs many blocks.<br/>
Because, the unjailing has to be done with the validator's operator key, they<br/>
have a chance to re-secure their consensus key, and then signal that they are<br/>
ready using their operator key. We call this period during which we track only<br/>
the max infraction, the "slashing period".

Once, a validator rejoins by unjailing themselves, we begin a new slashing period;<br/>
if they commit a new infraction after unjailing, it gets slashed cumulatively on<br/>
top of the worst infraction from the previous slashing period.

However, while infractions are grouped based off of the slashing periods, because<br/>
evidence can be submitted up to an `unbondingPeriod` after the infraction, we<br/>
still have to allow for evidence to be submitted for previous slashing periods.<br/>
For example, if the sequence of events is:

1. Validator A commits Infraction 1 (worth 30% slash)
2. Validator A commits Infraction 2 (worth 40% slash)
3. Evidence for Infraction 1 reaches state machine (and Validator A is put in jail)
4. Validator A unjails

We are now in a new slashing period, however we still have to keep the door open<br/>
for the previous infraction, as the evidence for Infraction 2 may still come in.<br/>
As the number of slashing periods increase, it creates more complexity as we have<br/>
to keep track of the highest infraction amount for every single slashing period.

> Note: Currently, according to the `slashing` module spec, a new slashing period<br/>
> is created every time a validator is unbonded then rebonded. This should probably<br/>
> be changed to jailed/unjailed. See issue [#3205](https://github.com/cosmos/cosmos-sdk/issues/3205)<br/>
> for further details. For the remainder of this, I will assume that we only start<br/>
> a new slashing period when a validator gets unjailed.

The maximum number of slashing periods is the `len(UnbondingPeriod) / len(JailPeriod)`.<br/>
The current defaults in Gaia for the `UnbondingPeriod` and `JailPeriod` are 3 weeks<br/>
and 2 days, respectively. This means there could potentially be up to 11 slashing<br/>
periods concurrently being tracked per validator. If we set the `JailPeriod >= UnbondingPeriod`,<br/>
we only have to track 1 slashing period (i.e not have to track slashing periods).

Currently, in the jail period implementation, once a validator unjails, all of<br/>
their delegators who are delegated to them (haven't unbonded / redelegated away),<br/>
stay with them. Given that consensus safety faults are so egregious<br/>
(way more so than liveness faults), it is probably prudent to have delegators not<br/>
"auto-rebond" to the validator.

##### Proposal: Infinite Jail [​](https://docs.cosmos.network/v0.50/build/modules/slashing#proposal-infinite-jail "Direct link to Proposal: infinite jail")

We propose setting the "jail time" for a<br/>
validator who commits a consensus safety fault, to `infinite` (i.e. a tombstone state).<br/>
This essentially kicks the validator out of the validator set and does not allow<br/>
them to re-enter the validator set. All of their delegators (including the operator themselves)<br/>
have to either unbond or redelegate away. The validator operator can create a new<br/>
validator if they would like, with a new operator key and consensus key, but they<br/>
have to "re-earn" their delegations back.

Implementing the tombstone system and getting rid of the slashing period tracking<br/>
will make the `slashing` module way simpler, especially because we can remove all<br/>
of the hooks defined in the `slashing` module consumed by the `staking` module<br/>
(the `slashing` module still consumes hooks defined in `staking`).

##### Single Slashing Amount [​](https://docs.cosmos.network/v0.50/build/modules/slashing#single-slashing-amount "Direct link to Single slashing amount")

Another optimization that can be made is that if we assume that all ABCI faults<br/>
for CometBFT consensus are slashed at the same level, we don't have to keep<br/>
track of "max slash". Once an ABCI fault happens, we don't have to worry about<br/>
comparing potential future ones to find the max.

Currently the only CometBFT ABCI fault is:

- Unjustified precommits (double signs)

It is currently planned to include the following fault in the near future:

- Signing a precommit when you're in unbonding phase (needed to make light client bisection safe)

Given that these faults are both attributable byzantine faults, we will likely<br/>
want to slash them equally, and thus we can enact the above change.

> Note: This change may make sense for current CometBFT consensus, but maybe<br/>
> not for a different consensus algorithm or future versions of CometBFT that<br/>
> may want to punish at different levels (for example, partial slashing).

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/slashing#parameters "Direct link to Parameters")

The slashing module contains the following parameters:

| Key                     | Type           | Example                |
| ----------------------- | -------------- | ---------------------- |
| SignedBlocksWindow      | string (int64) | "100"                  |
| MinSignedPerWindow      | string (dec)   | "0.500000000000000000" |
| DowntimeJailDuration    | string (ns)    | "600000000000"         |
| SlashFractionDoubleSign | string (dec)   | "0.050000000000000000" |
| SlashFractionDowntime   | string (dec)   | "0.010000000000000000" |

### CLI [​](https://docs.cosmos.network/v0.50/build/modules/slashing#cli "Direct link to CLI")

A user can query and interact with the `slashing` module using the CLI.

#### Query [​](https://docs.cosmos.network/v0.50/build/modules/slashing#query "Direct link to Query")

The `query` commands allow users to query `slashing` state.

```codeBlockLines_e6Vv
simd query slashing --help

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/slashing#params-1 "Direct link to params")

The `params` command allows users to query genesis parameters for the slashing module.

```codeBlockLines_e6Vv
simd query slashing params [flags]

```

Example:

```codeBlockLines_e6Vv
simd query slashing params

```

Example Output:

```codeBlockLines_e6Vv
downtime_jail_duration: 600s
min_signed_per_window: "0.500000000000000000"
signed_blocks_window: "100"
slash_fraction_double_sign: "0.050000000000000000"
slash_fraction_downtime: "0.010000000000000000"

```

##### Signing-info [​](https://docs.cosmos.network/v0.50/build/modules/slashing#signing-info "Direct link to signing-info")

The `signing-info` command allows users to query signing-info of the validator using consensus public key.

```codeBlockLines_e6Vv
simd query slashing signing-infos [flags]

```

Example:

```codeBlockLines_e6Vv
simd query slashing signing-info '{"@type":"/cosmos.crypto.ed25519.PubKey","key":"Auxs3865HpB/EfssYOzfqNhEJjzys6jD5B6tPgC8="}'

```

Example Output:

```codeBlockLines_e6Vv
address: cosmosvalcons1nrqsld3aw6lh6t082frdqc84uwxn0t958c
index_offset: "2068"
jailed_until: "1970-01-01T00:00:00Z"
missed_blocks_counter: "0"
start_height: "0"
tombstoned: false

```

##### Signing-infos [​](https://docs.cosmos.network/v0.50/build/modules/slashing#signing-infos "Direct link to signing-infos")

The `signing-infos` command allows users to query signing infos of all validators.

```codeBlockLines_e6Vv
simd query slashing signing-infos [flags]

```

Example:

```codeBlockLines_e6Vv
simd query slashing signing-infos

```

Example Output:

```codeBlockLines_e6Vv
info:
- address: cosmosvalcons1nrqsld3aw6lh6t082frdqc84uwxn0t958c
  index_offset: "2075"
  jailed_until: "1970-01-01T00:00:00Z"
  missed_blocks_counter: "0"
  start_height: "0"
  tombstoned: false
pagination:
  next_key: null
  total: "0"

```

#### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/slashing#transactions "Direct link to Transactions")

The `tx` commands allow users to interact with the `slashing` module.

```codeBlockLines_e6Vv
simd tx slashing --help

```

##### Unjail [​](https://docs.cosmos.network/v0.50/build/modules/slashing#unjail-1 "Direct link to unjail")

The `unjail` command allows users to unjail a validator previously jailed for downtime.

```codeBlockLines_e6Vv
simd tx slashing unjail --from mykey [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx slashing unjail --from mykey

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/slashing#grpc "Direct link to gRPC")

A user can query the `slashing` module using gRPC endpoints.

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/slashing#params-2 "Direct link to Params")

The `Params` endpoint allows users to query the parameters of slashing module.

```codeBlockLines_e6Vv
cosmos.slashing.v1beta1.Query/Params

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.slashing.v1beta1.Query/Params

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "signedBlocksWindow": "100",
    "minSignedPerWindow": "NTAwMDAwMDAwMDAwMDAwMDAw",
    "downtimeJailDuration": "600s",
    "slashFractionDoubleSign": "NTAwMDAwMDAwMDAwMDAwMDA=",
    "slashFractionDowntime": "MTAwMDAwMDAwMDAwMDAwMDA="
  }
}

```

##### SigningInfo [​](https://docs.cosmos.network/v0.50/build/modules/slashing#signinginfo "Direct link to SigningInfo")

The SigningInfo queries the signing info of given cons address.

```codeBlockLines_e6Vv
cosmos.slashing.v1beta1.Query/SigningInfo

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext -d '{"cons_address":"cosmosvalcons1nrqsld3aw6lh6t082frdqc84uwxn0t958c"}' localhost:9090 cosmos.slashing.v1beta1.Query/SigningInfo

```

Example Output:

```codeBlockLines_e6Vv
{
  "valSigningInfo": {
    "address": "cosmosvalcons1nrqsld3aw6lh6t082frdqc84uwxn0t958c",
    "indexOffset": "3493",
    "jailedUntil": "1970-01-01T00:00:00Z"
  }
}

```

##### SigningInfos [​](https://docs.cosmos.network/v0.50/build/modules/slashing#signinginfos "Direct link to SigningInfos")

The SigningInfos queries signing info of all validators.

```codeBlockLines_e6Vv
cosmos.slashing.v1beta1.Query/SigningInfos

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.slashing.v1beta1.Query/SigningInfos

```

Example Output:

```codeBlockLines_e6Vv
{
  "info": [\
    {\
      "address": "cosmosvalcons1nrqslkwd3pz096lh6t082frdqc84uwxn0t958c",\
      "indexOffset": "2467",\
      "jailedUntil": "1970-01-01T00:00:00Z"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/slashing#rest "Direct link to REST")

A user can query the `slashing` module using REST endpoints.

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/slashing#params-3 "Direct link to Params")

```codeBlockLines_e6Vv
/cosmos/slashing/v1beta1/params

```

Example:

```codeBlockLines_e6Vv
curl "localhost:1317/cosmos/slashing/v1beta1/params"

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "signed_blocks_window": "100",
    "min_signed_per_window": "0.500000000000000000",
    "downtime_jail_duration": "600s",
    "slash_fraction_double_sign": "0.050000000000000000",
    "slash_fraction_downtime": "0.010000000000000000"
}

```

##### signing_info [​](https://docs.cosmos.network/v0.50/build/modules/slashing#signing_info "Direct link to signing_info")

```codeBlockLines_e6Vv
/cosmos/slashing/v1beta1/signing_infos/%s

```

Example:

```codeBlockLines_e6Vv
curl "localhost:1317/cosmos/slashing/v1beta1/signing_infos/cosmosvalcons1nrqslkwd3pz096lh6t082frdqc84uwxn0t958c"

```

Example Output:

```codeBlockLines_e6Vv
{
  "val_signing_info": {
    "address": "cosmosvalcons1nrqslkwd3pz096lh6t082frdqc84uwxn0t958c",
    "start_height": "0",
    "index_offset": "4184",
    "jailed_until": "1970-01-01T00:00:00Z",
    "tombstoned": false,
    "missed_blocks_counter": "0"
  }
}

```

##### signing_infos [​](https://docs.cosmos.network/v0.50/build/modules/slashing#signing_infos "Direct link to signing_infos")

```codeBlockLines_e6Vv
/cosmos/slashing/v1beta1/signing_infos

```

Example:

```codeBlockLines_e6Vv
curl "localhost:1317/cosmos/slashing/v1beta1/signing_infos

```

Example Output:

```codeBlockLines_e6Vv
{
  "info": [\
    {\
      "address": "cosmosvalcons1nrqslkwd3pz096lh6t082frdqc84uwxn0t958c",\
      "start_height": "0",\
      "index_offset": "4169",\
      "jailed_until": "1970-01-01T00:00:00Z",\
      "tombstoned": false,\
      "missed_blocks_counter": "0"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

---

## `x/staking`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/staking#abstract "Direct link to Abstract")

This paper specifies the Staking module of the Cosmos SDK that was first<br/>
described in the [Cosmos Whitepaper](https://cosmos.network/about/whitepaper)<br/>
in June 2016.

The module enables Cosmos SDK-based blockchain to support an advanced<br/>
Proof-of-Stake (PoS) system. In this system, holders of the native staking token of<br/>
the chain can become validators and can delegate tokens to validators,<br/>
ultimately determining the effective validator set for the system.

This module is used in the Cosmos Hub, the first Hub in the Cosmos<br/>
network.

### Contents [​](https://docs.cosmos.network/v0.50/build/modules/staking#contents "Direct link to Contents")

- [State](https://docs.cosmos.network/v0.50/build/modules/staking#state)
  - [Pool](https://docs.cosmos.network/v0.50/build/modules/staking#pool)
  - [LastTotalPower](https://docs.cosmos.network/v0.50/build/modules/staking#lasttotalpower)
  - [ValidatorUpdates](https://docs.cosmos.network/v0.50/build/modules/staking#validatorupdates)
  - [UnbondingID](https://docs.cosmos.network/v0.50/build/modules/staking#unbondingid)
  - [Params](https://docs.cosmos.network/v0.50/build/modules/staking#params)
  - [Validator](https://docs.cosmos.network/v0.50/build/modules/staking#validator)
  - [Delegation](https://docs.cosmos.network/v0.50/build/modules/staking#delegation)
  - [UnbondingDelegation](https://docs.cosmos.network/v0.50/build/modules/staking#unbondingdelegation)
  - [Redelegation](https://docs.cosmos.network/v0.50/build/modules/staking#redelegation)
  - [Queues](https://docs.cosmos.network/v0.50/build/modules/staking#queues)
  - [HistoricalInfo](https://docs.cosmos.network/v0.50/build/modules/staking#historicalinfo)
- [State Transitions](https://docs.cosmos.network/v0.50/build/modules/staking#state-transitions)
  - [Validators](https://docs.cosmos.network/v0.50/build/modules/staking#validators)
  - [Delegations](https://docs.cosmos.network/v0.50/build/modules/staking#delegations)
  - [Slashing](https://docs.cosmos.network/v0.50/build/modules/staking#slashing)
  - [How Shares are calculated](https://docs.cosmos.network/v0.50/build/modules/staking#how-shares-are-calculated)
- [Messages](https://docs.cosmos.network/v0.50/build/modules/staking#messages)
  - [MsgCreateValidator](https://docs.cosmos.network/v0.50/build/modules/staking#msgcreatevalidator)
  - [MsgEditValidator](https://docs.cosmos.network/v0.50/build/modules/staking#msgeditvalidator)
  - [MsgDelegate](https://docs.cosmos.network/v0.50/build/modules/staking#msgdelegate)
  - [MsgUndelegate](https://docs.cosmos.network/v0.50/build/modules/staking#msgundelegate)
  - [MsgCancelUnbondingDelegation](https://docs.cosmos.network/v0.50/build/modules/staking#msgcancelunbondingdelegation)
  - [MsgBeginRedelegate](https://docs.cosmos.network/v0.50/build/modules/staking#msgbeginredelegate)
  - [MsgUpdateParams](https://docs.cosmos.network/v0.50/build/modules/staking#msgupdateparams)
- [Begin-Block](https://docs.cosmos.network/v0.50/build/modules/staking#begin-block)
  - [Historical Info Tracking](https://docs.cosmos.network/v0.50/build/modules/staking#historical-info-tracking)
- [End-Block](https://docs.cosmos.network/v0.50/build/modules/staking#end-block)
  - [Validator Set Changes](https://docs.cosmos.network/v0.50/build/modules/staking#validator-set-changes)
  - [Queues](https://docs.cosmos.network/v0.50/build/modules/staking#queues-1)
- [Hooks](https://docs.cosmos.network/v0.50/build/modules/staking#hooks)
- [Events](https://docs.cosmos.network/v0.50/build/modules/staking#events)
  - [EndBlocker](https://docs.cosmos.network/v0.50/build/modules/staking#endblocker)
  - [Msg's](https://docs.cosmos.network/v0.50/build/modules/staking#msgs)
- [Parameters](https://docs.cosmos.network/v0.50/build/modules/staking#parameters)
- [Client](https://docs.cosmos.network/v0.50/build/modules/staking#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/staking#cli)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/staking#grpc)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/staking#rest)

### State [​](https://docs.cosmos.network/v0.50/build/modules/staking#state "Direct link to State")

#### Pool [​](https://docs.cosmos.network/v0.50/build/modules/staking#pool "Direct link to Pool")

Pool is used for tracking bonded and not-bonded token supply of the bond denomination.

#### LastTotalPower [​](https://docs.cosmos.network/v0.50/build/modules/staking#lasttotalpower "Direct link to LastTotalPower")

LastTotalPower tracks the total amounts of bonded tokens recorded during the previous end block.<br/>
Store entries prefixed with "Last" must remain unchanged until EndBlock.

- LastTotalPower: `0x12 -> ProtocolBuffer(math.Int)`

#### ValidatorUpdates [​](https://docs.cosmos.network/v0.50/build/modules/staking#validatorupdates "Direct link to ValidatorUpdates")

ValidatorUpdates contains the validator updates returned to ABCI at the end of every block.<br/>
The values are overwritten in every block.

- ValidatorUpdates `0x61 -> []abci.ValidatorUpdate`

#### UnbondingID [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbondingid "Direct link to UnbondingID")

UnbondingID stores the ID of the latest unbonding operation. It enables creating unique IDs for unbonding operations, i.e., UnbondingID is incremented every time a new unbonding operation (validator unbonding, unbonding delegation, redelegation) is initiated.

- UnbondingID: `0x37 -> uint64`

#### Params [​](https://docs.cosmos.network/v0.50/build/modules/staking#params "Direct link to Params")

The staking module stores its params in state with the prefix of `0x51`,<br/>
it can be updated with governance or the address with authority.

- Params: `0x51 | ProtocolBuffer(Params)`

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// Params defines the parameters for the x/staking module.
message Params {
  option (amino.name)                 = "cosmos-sdk/x/staking/Params";
  option (gogoproto.equal)            = true;
  option (gogoproto.goproto_stringer) = false;

  // unbonding_time is the time duration of unbonding.
  google.protobuf.Duration unbonding_time = 1
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdduration) = true];
  // max_validators is the maximum number of validators.
  uint32 max_validators = 2;
  // max_entries is the max entries for either unbonding delegation or redelegation (per pair/trio).
  uint32 max_entries = 3;
  // historical_entries is the number of historical entries to persist.
  uint32 historical_entries = 4;
  // bond_denom defines the bondable coin denomination.
  string bond_denom = 5;
  // min_commission_rate is the chain-wide minimum commission rate that a validator can charge their delegators
  string min_commission_rate = 6 [\
    (gogoproto.moretags)   = "yaml:\"min_commission_rate\"",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L310-L333)

#### Validator [​](https://docs.cosmos.network/v0.50/build/modules/staking#validator "Direct link to Validator")

Validators can have one of three statuses

- `Unbonded`: The validator is not in the active set. They cannot sign blocks and do not earn<br/>
  rewards. They can receive delegations.
- `Bonded`: Once the validator receives sufficient bonded tokens they automatically join the<br/>
  active set during [`EndBlock`](https://docs.cosmos.network/v0.50/build/modules/staking#validator-set-changes) and their status is updated to `Bonded`.<br/>
  They are signing blocks and receiving rewards. They can receive further delegations.<br/>
  They can be slashed for misbehavior. Delegators to this validator who unbond their delegation<br/>
  must wait the duration of the UnbondingTime, a chain-specific param, during which time<br/>
  they are still slashable for offences of the source validator if those offences were committed<br/>
  during the period of time that the tokens were bonded.
- `Unbonding`: When a validator leaves the active set, either by choice or due to slashing, jailing or<br/>
  tombstoning, an unbonding of all their delegations begins. All delegations must then wait the UnbondingTime<br/>
  before their tokens are moved to their accounts from the `BondedPool`.

danger

Tombstoning is permanent, once tombstoned a validator's consensus key can not be reused within the chain where the tombstoning happened.

Validators objects should be primarily stored and accessed by the<br/>
`OperatorAddr`, an SDK validator address for the operator of the validator. Two<br/>
additional indices are maintained per validator object in order to fulfill<br/>
required lookups for slashing and validator-set updates. A third special index<br/>
(`LastValidatorPower`) is also maintained which however remains constant<br/>
throughout each block, unlike the first two indices which mirror the validator<br/>
records within a block.

- Validators: `0x21 | OperatorAddrLen (1 byte) | OperatorAddr -> ProtocolBuffer(validator)`
- ValidatorsByConsAddr: `0x22 | ConsAddrLen (1 byte) | ConsAddr -> OperatorAddr`
- ValidatorsByPower: `0x23 | BigEndian(ConsensusPower) | OperatorAddrLen (1 byte) | OperatorAddr -> OperatorAddr`
- LastValidatorsPower: `0x11 | OperatorAddrLen (1 byte) | OperatorAddr -> ProtocolBuffer(ConsensusPower)`
- ValidatorsByUnbondingID: `0x38 | UnbondingID ->  0x21 | OperatorAddrLen (1 byte) | OperatorAddr`

`Validators` is the primary index - it ensures that each operator can have only one<br/>
associated validator, where the public key of that validator can change in the<br/>
future. Delegators can refer to the immutable operator of the validator, without<br/>
concern for the changing public key.

`ValidatorsByUnbondingID` is an additional index that enables lookups for<br/>
validators by the unbonding IDs corresponding to their current unbonding.

`ValidatorByConsAddr` is an additional index that enables lookups for slashing.<br/>
When CometBFT reports evidence, it provides the validator address, so this<br/>
map is needed to find the operator. Note that the `ConsAddr` corresponds to the<br/>
address which can be derived from the validator's `ConsPubKey`.

`ValidatorsByPower` is an additional index that provides a sorted list of<br/>
potential validators to quickly determine the current active set. Here<br/>
ConsensusPower is validator.Tokens/10^6 by default. Note that all validators<br/>
where `Jailed` is true are not stored within this index.

`LastValidatorsPower` is a special index that provides a historical list of the<br/>
last-block's bonded validators. This index remains constant during a block but<br/>
is updated during the validator set update process which takes place in [`EndBlock`](https://docs.cosmos.network/v0.50/build/modules/staking#end-block).

Each validator's state is stored in a `Validator` struct:

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// Validator defines a validator, together with the total amount of the
// Validator's bond shares and their exchange rate to coins. Slashing results in
// a decrease in the exchange rate, allowing correct calculation of future
// undelegations without iterating over delegators. When coins are delegated to
// this validator, the validator is credited with a delegation whose number of
// bond shares is based on the amount of coins delegated divided by the current
// exchange rate. Voting power can be calculated as total bonded shares
// multiplied by exchange rate.
message Validator {
  option (gogoproto.equal)            = false;
  option (gogoproto.goproto_stringer) = false;
  option (gogoproto.goproto_getters)  = false;

  // operator_address defines the address of the validator's operator; bech encoded in JSON.
  string operator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // consensus_pubkey is the consensus public key of the validator, as a Protobuf Any.
  google.protobuf.Any consensus_pubkey = 2 [(cosmos_proto.accepts_interface) = "cosmos.crypto.PubKey"];
  // jailed defined whether the validator has been jailed from bonded status or not.
  bool jailed = 3;
  // status is the validator status (bonded/unbonding/unbonded).
  BondStatus status = 4;
  // tokens define the delegated tokens (incl. self-delegation).
  string tokens = 5 [\
    (cosmos_proto.scalar)  = "cosmos.Int",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Int",\
    (gogoproto.nullable)   = false\
  ];
  // delegator_shares defines total shares issued to a validator's delegators.
  string delegator_shares = 6 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // description defines the description terms for the validator.
  Description description = 7 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  // unbonding_height defines, if unbonding, the height at which this validator has begun unbonding.
  int64 unbonding_height = 8;
  // unbonding_time defines, if unbonding, the min time for the validator to complete unbonding.
  google.protobuf.Timestamp unbonding_time = 9
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdtime) = true];
  // commission defines the commission parameters.
  Commission commission = 10 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  // min_self_delegation is the validator's self declared minimum self delegation.
  //
  // Since: cosmos-sdk 0.46
  string min_self_delegation = 11 [\
    (cosmos_proto.scalar)  = "cosmos.Int",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Int",\
    (gogoproto.nullable)   = false\
  ];

  // strictly positive if this validator's unbonding has been stopped by external modules
  int64 unbonding_on_hold_ref_count = 12;

  // list of unbonding ids, each uniquely identifing an unbonding of this validator
  repeated uint64 unbonding_ids = 13;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L82-L138)

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// CommissionRates defines the initial commission rates to be used for creating
// a validator.
message CommissionRates {
  option (gogoproto.equal)            = true;
  option (gogoproto.goproto_stringer) = false;

  // rate is the commission rate charged to delegators, as a fraction.
  string rate = 1 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // max_rate defines the maximum commission rate which validator can ever charge, as a fraction.
  string max_rate = 2 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // max_change_rate defines the maximum daily increase of the validator commission, as a fraction.
  string max_change_rate = 3 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
}

// Commission defines commission parameters for a given validator.
message Commission {
  option (gogoproto.equal)            = true;
  option (gogoproto.goproto_stringer) = false;

  // commission_rates defines the initial commission rates to be used for creating a validator.
  CommissionRates commission_rates = 1
      [(gogoproto.embed) = true, (gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  // update_time is the last time the commission rate was changed.
  google.protobuf.Timestamp update_time = 2
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdtime) = true];
}

// Description defines a validator description.
message Description {
  option (gogoproto.equal)            = true;
  option (gogoproto.goproto_stringer) = false;

  // moniker defines a human-readable name for the validator.
  string moniker = 1;
  // identity defines an optional identity signature (ex. UPort or Keybase).
  string identity = 2;
  // website defines an optional website link.
  string website = 3;
  // security_contact defines an optional email for security contact.
  string security_contact = 4;
  // details define other optional details.
  string details = 5;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L26-L80)

#### Delegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegation "Direct link to Delegation")

Delegations are identified by combining `DelegatorAddr` (the address of the delegator)<br/>
with the `ValidatorAddr` Delegators are indexed in the store as follows:

- Delegation: `0x31 | DelegatorAddrLen (1 byte) | DelegatorAddr | ValidatorAddrLen (1 byte) | ValidatorAddr -> ProtocolBuffer(delegation)`

Stake holders may delegate coins to validators; under this circumstance their<br/>
funds are held in a `Delegation` data structure. It is owned by one<br/>
delegator, and is associated with the shares for one validator. The sender of<br/>
the transaction is the owner of the bond.

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// Delegation represents the bond with tokens held by an account. It is
// owned by one delegator, and is associated with the voting power of one
// validator.
message Delegation {
  option (gogoproto.equal)            = false;
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  // delegator_address is the bech32-encoded address of the delegator.
  string delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // validator_address is the bech32-encoded address of the validator.
  string validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // shares define the delegation shares received.
  string shares = 3 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L198-L216)

##### Delegator Shares [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegator-shares "Direct link to Delegator Shares")

When one delegates tokens to a Validator, they are issued a number of delegator shares based on a<br/>
dynamic exchange rate, calculated as follows from the total number of tokens delegated to the<br/>
validator and the number of shares issued so far:

`Shares per Token = validator.TotalShares() / validator.Tokens()`

Only the number of shares received is stored on the DelegationEntry. When a delegator then<br/>
Undelegates, the token amount they receive is calculated from the number of shares they currently<br/>
hold and the inverse exchange rate:

`Tokens per Share = validator.Tokens() / validatorShares()`

These `Shares` are simply an accounting mechanism. They are not a fungible asset. The reason for<br/>
this mechanism is to simplify the accounting around slashing. Rather than iteratively slashing the<br/>
tokens of every delegation entry, instead the Validator's total bonded tokens can be slashed,<br/>
effectively reducing the value of each issued delegator share.

#### UnbondingDelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbondingdelegation "Direct link to UnbondingDelegation")

Shares in a `Delegation` can be unbonded, but they must for some time exist as<br/>
an `UnbondingDelegation`, where shares can be reduced if Byzantine behavior is<br/>
detected.

`UnbondingDelegation` are indexed in the store as:

- UnbondingDelegation: `0x32 | DelegatorAddrLen (1 byte) | DelegatorAddr | ValidatorAddrLen (1 byte) | ValidatorAddr -> ProtocolBuffer(unbondingDelegation)`
- UnbondingDelegationsFromValidator: `0x33 | ValidatorAddrLen (1 byte) | ValidatorAddr | DelegatorAddrLen (1 byte) | DelegatorAddr -> nil`
- UnbondingDelegationByUnbondingId: `0x38 | UnbondingId -> 0x32 | DelegatorAddrLen (1 byte) | DelegatorAddr | ValidatorAddrLen (1 byte) | ValidatorAddr` `UnbondingDelegation` is used in queries, to lookup all unbonding delegations for<br/>
  a given delegator.

`UnbondingDelegationsFromValidator` is used in slashing, to lookup all<br/>
unbonding delegations associated with a given validator that need to be<br/>
slashed.

`UnbondingDelegationByUnbondingId` is an additional index that enables<br/>
lookups for unbonding delegations by the unbonding IDs of the containing<br/>
unbonding delegation entries.

A UnbondingDelegation object is created every time an unbonding is initiated.

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// UnbondingDelegation stores all of a single delegator's unbonding bonds
// for a single validator in an time-ordered list.
message UnbondingDelegation {
  option (gogoproto.equal)            = false;
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  // delegator_address is the bech32-encoded address of the delegator.
  string delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // validator_address is the bech32-encoded address of the validator.
  string validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // entries are the unbonding delegation entries.
  repeated UnbondingDelegationEntry entries = 3
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true]; // unbonding delegation entries
}

// UnbondingDelegationEntry defines an unbonding object with relevant metadata.
message UnbondingDelegationEntry {
  option (gogoproto.equal)            = true;
  option (gogoproto.goproto_stringer) = false;

  // creation_height is the height which the unbonding took place.
  int64 creation_height = 1;
  // completion_time is the unix time for unbonding completion.
  google.protobuf.Timestamp completion_time = 2
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdtime) = true];
  // initial_balance defines the tokens initially scheduled to receive at completion.
  string initial_balance = 3 [\
    (cosmos_proto.scalar)  = "cosmos.Int",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Int",\
    (gogoproto.nullable)   = false\
  ];
  // balance defines the tokens to receive at completion.
  string balance = 4 [\
    (cosmos_proto.scalar)  = "cosmos.Int",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Int",\
    (gogoproto.nullable)   = false\
  ];
  // Incrementing id that uniquely identifies this entry
  uint64 unbonding_id = 5;

  // Strictly positive if this entry's unbonding has been stopped by external modules
  int64 unbonding_on_hold_ref_count = 6;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L218-L261)

#### Redelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegation "Direct link to Redelegation")

The bonded tokens worth of a `Delegation` may be instantly redelegated from a<br/>
source validator to a different validator (destination validator). However when<br/>
this occurs they must be tracked in a `Redelegation` object, whereby their<br/>
shares can be slashed if their tokens have contributed to a Byzantine fault<br/>
committed by the source validator.

`Redelegation` are indexed in the store as:

- Redelegations: `0x34 | DelegatorAddrLen (1 byte) | DelegatorAddr | ValidatorAddrLen (1 byte) | ValidatorSrcAddr | ValidatorDstAddr -> ProtocolBuffer(redelegation)`
- RedelegationsBySrc: `0x35 | ValidatorSrcAddrLen (1 byte) | ValidatorSrcAddr | ValidatorDstAddrLen (1 byte) | ValidatorDstAddr | DelegatorAddrLen (1 byte) | DelegatorAddr -> nil`
- RedelegationsByDst: `0x36 | ValidatorDstAddrLen (1 byte) | ValidatorDstAddr | ValidatorSrcAddrLen (1 byte) | ValidatorSrcAddr | DelegatorAddrLen (1 byte) | DelegatorAddr -> nil`
- RedelegationByUnbondingId: `0x38 | UnbondingId -> 0x34 | DelegatorAddrLen (1 byte) | DelegatorAddr | ValidatorAddrLen (1 byte) | ValidatorSrcAddr | ValidatorDstAddr`

`Redelegations` is used for queries, to lookup all redelegations for a given<br/>
delegator.

`RedelegationsBySrc` is used for slashing based on the `ValidatorSrcAddr`.

`RedelegationsByDst` is used for slashing based on the `ValidatorDstAddr`

The first map here is used for queries, to lookup all redelegations for a given<br/>
delegator. The second map is used for slashing based on the `ValidatorSrcAddr`,<br/>
while the third map is for slashing based on the `ValidatorDstAddr`.

`RedelegationByUnbondingId` is an additional index that enables<br/>
lookups for redelegations by the unbonding IDs of the containing<br/>
redelegation entries.

A redelegation object is created every time a redelegation occurs. To prevent<br/>
"redelegation hopping" redelegations may not occur under the situation that:

- the (re)delegator already has another immature redelegation in progress<br/>
  with a destination to a validator (let's call it `Validator X`)
- and, the (re)delegator is attempting to create a _new_ redelegation<br/>
  where the source validator for this new redelegation is `Validator X`.

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// RedelegationEntry defines a redelegation object with relevant metadata.
message RedelegationEntry {
  option (gogoproto.equal)            = true;
  option (gogoproto.goproto_stringer) = false;

  // creation_height  defines the height which the redelegation took place.
  int64 creation_height = 1;
  // completion_time defines the unix time for redelegation completion.
  google.protobuf.Timestamp completion_time = 2
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdtime) = true];
  // initial_balance defines the initial balance when redelegation started.
  string initial_balance = 3 [\
    (cosmos_proto.scalar)  = "cosmos.Int",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Int",\
    (gogoproto.nullable)   = false\
  ];
  // shares_dst is the amount of destination-validator shares created by redelegation.
  string shares_dst = 4 [\
    (cosmos_proto.scalar)  = "cosmos.Dec",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec",\
    (gogoproto.nullable)   = false\
  ];
  // Incrementing id that uniquely identifies this entry
  uint64 unbonding_id = 5;

  // Strictly positive if this entry's unbonding has been stopped by external modules
  int64 unbonding_on_hold_ref_count = 6;
}

// Redelegation contains the list of a particular delegator's redelegating bonds
// from a particular source validator to a particular destination validator.
message Redelegation {
  option (gogoproto.equal)            = false;
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  // delegator_address is the bech32-encoded address of the delegator.
  string delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // validator_src_address is the validator redelegation source operator address.
  string validator_src_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // validator_dst_address is the validator redelegation destination operator address.
  string validator_dst_address = 3 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // entries are the redelegation entries.
  repeated RedelegationEntry entries = 4
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true]; // redelegation entries
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L263-L308)

#### Queues [​](https://docs.cosmos.network/v0.50/build/modules/staking#queues "Direct link to Queues")

All queue objects are sorted by timestamp. The time used within any queue is<br/>
firstly converted to UTC, rounded to the nearest nanosecond then sorted. The sortable time format<br/>
used is a slight modification of the RFC3339Nano and uses the format string<br/>
`"2006-01-02T15:04:05.000000000"`. Notably this format:

- right pads all zeros
- drops the time zone info (we already use UTC)

In all cases, the stored timestamp represents the maturation time of the queue<br/>
element.

##### UnbondingDelegationQueue [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbondingdelegationqueue "Direct link to UnbondingDelegationQueue")

For the purpose of tracking progress of unbonding delegations the unbonding<br/>
delegations queue is kept.

- UnbondingDelegation: `0x41 | format(time) -> []DVPair`

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// DVPair is struct that just has a delegator-validator pair with no other data.
// It is intended to be used as a marshalable pointer. For example, a DVPair can
// be used to construct the key to getting an UnbondingDelegation from state.
message DVPair {
  option (gogoproto.equal)            = false;
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  string delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L162-L172)

##### RedelegationQueue [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegationqueue "Direct link to RedelegationQueue")

For the purpose of tracking progress of redelegations the redelegation queue is<br/>
kept.

- RedelegationQueue: `0x42 | format(time) -> []DVVTriplet`

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// DVVTriplet is struct that just has a delegator-validator-validator triplet
// with no other data. It is intended to be used as a marshalable pointer. For
// example, a DVVTriplet can be used to construct the key to getting a
// Redelegation from state.
message DVVTriplet {
  option (gogoproto.equal)            = false;
  option (gogoproto.goproto_getters)  = false;
  option (gogoproto.goproto_stringer) = false;

  string delegator_address     = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string validator_src_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string validator_dst_address = 3 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L179-L191)

##### ValidatorQueue [​](https://docs.cosmos.network/v0.50/build/modules/staking#validatorqueue "Direct link to ValidatorQueue")

For the purpose of tracking progress of unbonding validators the validator<br/>
queue is kept.

- ValidatorQueueTime: `0x43 | format(time) -> []sdk.ValAddress`

The stored object by each key is an array of validator operator addresses from<br/>
which the validator object can be accessed. Typically it is expected that only<br/>
a single validator record will be associated with a given timestamp however it is possible<br/>
that multiple validators exist in the queue at the same location.

#### HistoricalInfo [​](https://docs.cosmos.network/v0.50/build/modules/staking#historicalinfo "Direct link to HistoricalInfo")

HistoricalInfo objects are stored and pruned at each block such that the staking keeper persists<br/>
the `n` most recent historical info defined by staking module parameter: `HistoricalEntries`.

proto/cosmos/staking/v1beta1/staking.proto

```codeBlockLines_e6Vv
// HistoricalInfo contains header and validator information for a given block.
// It is stored as part of staking module's state, which persists the `n` most
// recent HistoricalInfo
// (`n` is set by the staking module's `historical_entries` parameter).
message HistoricalInfo {
  tendermint.types.Header header = 1 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  repeated Validator      valset = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/staking.proto#L17-L24)

At each BeginBlock, the staking keeper will persist the current Header and the Validators that committed<br/>
the current block in a `HistoricalInfo` object. The Validators are sorted on their address to ensure that<br/>
they are in a deterministic order.<br/>
The oldest HistoricalEntries will be pruned to ensure that there only exist the parameter-defined number of<br/>
historical entries.

### State Transitions [​](https://docs.cosmos.network/v0.50/build/modules/staking#state-transitions "Direct link to State Transitions")

#### Validators [​](https://docs.cosmos.network/v0.50/build/modules/staking#validators "Direct link to Validators")

State transitions in validators are performed on every [`EndBlock`](https://docs.cosmos.network/v0.50/build/modules/staking#validator-set-changes)<br/>
in order to check for changes in the active `ValidatorSet`.

A validator can be `Unbonded`, `Unbonding` or `Bonded`. `Unbonded`<br/>
and `Unbonding` are collectively called `Not Bonded`. A validator can move<br/>
directly between all the states, except for from `Bonded` to `Unbonded`.

##### Not Bonded to Bonded [​](https://docs.cosmos.network/v0.50/build/modules/staking#not-bonded-to-bonded "Direct link to Not bonded to Bonded")

The following transition occurs when a validator's ranking in the `ValidatorPowerIndex` surpasses<br/>
that of the `LastValidator`.

- set `validator.Status` to `Bonded`
- send the `validator.Tokens` from the `NotBondedTokens` to the `BondedPool` `ModuleAccount`
- delete the existing record from `ValidatorByPowerIndex`
- add a new updated record to the `ValidatorByPowerIndex`
- update the `Validator` object for this validator
- if it exists, delete any `ValidatorQueue` record for this validator

##### Bonded to Unbonding [​](https://docs.cosmos.network/v0.50/build/modules/staking#bonded-to-unbonding "Direct link to Bonded to Unbonding")

When a validator begins the unbonding process the following operations occur:

- send the `validator.Tokens` from the `BondedPool` to the `NotBondedTokens` `ModuleAccount`
- set `validator.Status` to `Unbonding`
- delete the existing record from `ValidatorByPowerIndex`
- add a new updated record to the `ValidatorByPowerIndex`
- update the `Validator` object for this validator
- insert a new record into the `ValidatorQueue` for this validator

##### Unbonding to Unbonded [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbonding-to-unbonded "Direct link to Unbonding to Unbonded")

A validator moves from unbonding to unbonded when the `ValidatorQueue` object<br/>
moves from bonded to unbonded

- update the `Validator` object for this validator
- set `validator.Status` to `Unbonded`

##### Jail/Unjail [​](https://docs.cosmos.network/v0.50/build/modules/staking#jailunjail "Direct link to Jail/Unjail")

when a validator is jailed it is effectively removed from the CometBFT set.<br/>
this process may be also be reversed. the following operations occur:

- set `Validator.Jailed` and update object
- if jailed delete record from `ValidatorByPowerIndex`
- if unjailed add record to `ValidatorByPowerIndex`

Jailed validators are not present in any of the following stores:

- the power store (from consensus power to address)

#### Delegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegations "Direct link to Delegations")

##### Delegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegate "Direct link to Delegate")

When a delegation occurs both the validator and the delegation objects are affected

- determine the delegators shares based on tokens delegated and the validator's exchange rate
- remove tokens from the sending account
- add shares the delegation object or add them to a created validator object
- add new delegator shares and update the `Validator` object
- transfer the `delegation.Amount` from the delegator's account to the `BondedPool` or the `NotBondedPool` `ModuleAccount` depending if the `validator.Status` is `Bonded` or not
- delete the existing record from `ValidatorByPowerIndex`
- add an new updated record to the `ValidatorByPowerIndex`

##### Begin Unbonding [​](https://docs.cosmos.network/v0.50/build/modules/staking#begin-unbonding "Direct link to Begin Unbonding")

As a part of the Undelegate and Complete Unbonding state transitions Unbond<br/>
Delegation may be called.

- subtract the unbonded shares from delegator
- add the unbonded tokens to an `UnbondingDelegationEntry`
- update the delegation or remove the delegation if there are no more shares
- if the delegation is the operator of the validator and no more shares exist then trigger a jail validator
- update the validator with removed the delegator shares and associated coins
- if the validator state is `Bonded`, transfer the `Coins` worth of the unbonded<br/>
  shares from the `BondedPool` to the `NotBondedPool` `ModuleAccount`
- remove the validator if it is unbonded and there are no more delegation shares.
- remove the validator if it is unbonded and there are no more delegation shares
- get a unique `unbondingId` and map it to the `UnbondingDelegationEntry` in `UnbondingDelegationByUnbondingId`
- call the `AfterUnbondingInitiated(unbondingId)` hook
- add the unbonding delegation to `UnbondingDelegationQueue` with the completion time set to `UnbondingTime`

##### Cancel an `UnbondingDelegation` Entry [​](https://docs.cosmos.network/v0.50/build/modules/staking#cancel-an-unbondingdelegation-entry "Direct link to cancel-an-unbondingdelegation-entry")

When a `cancel unbond delegation` occurs both the `validator`, the `delegation` and an `UnbondingDelegationQueue` state will be updated.

- if cancel unbonding delegation amount equals to the `UnbondingDelegation` entry `balance`, then the `UnbondingDelegation` entry deleted from `UnbondingDelegationQueue`.
- if the `cancel unbonding delegation amount is less than the ` UnbondingDelegation `entry balance, then the` UnbondingDelegation `entry will be updated with new balance in the` UnbondingDelegationQueue\`.
- cancel `amount` is [Delegated](https://docs.cosmos.network/v0.50/build/modules/staking#delegations) back to the original `validator`.

##### Complete Unbonding [​](https://docs.cosmos.network/v0.50/build/modules/staking#complete-unbonding "Direct link to Complete Unbonding")

For undelegations which do not complete immediately, the following operations<br/>
occur when the unbonding delegation queue element matures:

- remove the entry from the `UnbondingDelegation` object
- transfer the tokens from the `NotBondedPool` `ModuleAccount` to the delegator `Account`

##### Begin Redelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#begin-redelegation "Direct link to Begin Redelegation")

Redelegations affect the delegation, source and destination validators.

- perform an `unbond` delegation from the source validator to retrieve the tokens worth of the unbonded shares
- using the unbonded tokens, `Delegate` them to the destination validator
- if the `sourceValidator.Status` is `Bonded`, and the `destinationValidator` is not,<br/>
  transfer the newly delegated tokens from the `BondedPool` to the `NotBondedPool` `ModuleAccount`
- otherwise, if the `sourceValidator.Status` is not `Bonded`, and the `destinationValidator`<br/>
  is `Bonded`, transfer the newly delegated tokens from the `NotBondedPool` to the `BondedPool` `ModuleAccount`
- record the token amount in an new entry in the relevant `Redelegation`

From when a redelegation begins until it completes, the delegator is in a state of "pseudo-unbonding", and can still be<br/>
slashed for infractions that occurred before the redelegation began.

##### Complete Redelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#complete-redelegation "Direct link to Complete Redelegation")

When a redelegations complete the following occurs:

- remove the entry from the `Redelegation` object

#### Slashing [​](https://docs.cosmos.network/v0.50/build/modules/staking#slashing "Direct link to Slashing")

##### Slash Validator [​](https://docs.cosmos.network/v0.50/build/modules/staking#slash-validator "Direct link to Slash Validator")

When a Validator is slashed, the following occurs:

- The total `slashAmount` is calculated as the `slashFactor` (a chain parameter) \* `TokensFromConsensusPower`,<br/>
  the total number of tokens bonded to the validator at the time of the infraction.
- Every unbonding delegation and pseudo-unbonding redelegation such that the infraction occurred before the unbonding or<br/>
  redelegation began from the validator are slashed by the `slashFactor` percentage of the initialBalance.
- Each amount slashed from redelegations and unbonding delegations is subtracted from the<br/>
  total slash amount.
- The `remaingSlashAmount` is then slashed from the validator's tokens in the `BondedPool` or<br/>
  `NonBondedPool` depending on the validator's status. This reduces the total supply of tokens.

In the case of a slash due to any infraction that requires evidence to submitted (for example double-sign), the slash<br/>
occurs at the block where the evidence is included, not at the block where the infraction occurred.<br/>
Put otherwise, validators are not slashed retroactively, only when they are caught.

##### Slash Unbonding Delegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#slash-unbonding-delegation "Direct link to Slash Unbonding Delegation")

When a validator is slashed, so are those unbonding delegations from the validator that began unbonding<br/>
after the time of the infraction. Every entry in every unbonding delegation from the validator<br/>
is slashed by `slashFactor`. The amount slashed is calculated from the `InitialBalance` of the<br/>
delegation and is capped to prevent a resulting negative balance. Completed (or mature) unbondings are not slashed.

##### Slash Redelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#slash-redelegation "Direct link to Slash Redelegation")

When a validator is slashed, so are all redelegations from the validator that began after the<br/>
infraction. Redelegations are slashed by `slashFactor`.<br/>
Redelegations that began before the infraction are not slashed.<br/>
The amount slashed is calculated from the `InitialBalance` of the delegation and is capped to<br/>
prevent a resulting negative balance.<br/>
Mature redelegations (that have completed pseudo-unbonding) are not slashed.

#### How Shares Are Calculated [​](https://docs.cosmos.network/v0.50/build/modules/staking#how-shares-are-calculated "Direct link to How Shares are calculated")

At any given point in time, each validator has a number of tokens, `T`, and has a number of shares issued, `S`.<br/>
Each delegator, `i`, holds a number of shares, `S_i`.<br/>
The number of tokens is the sum of all tokens delegated to the validator, plus the rewards, minus the slashes.

The delegator is entitled to a portion of the underlying tokens proportional to their proportion of shares.<br/>
So delegator `i` is entitled to `T * S_i / S` of the validator's tokens.

When a delegator delegates new tokens to the validator, they receive a number of shares proportional to their contribution.<br/>
So when delegator `j` delegates `T_j` tokens, they receive `S_j = S * T_j / T` shares.<br/>
The total number of tokens is now `T + T_j`, and the total number of shares is `S + S_j`.<br/>
`j` s proportion of the shares is the same as their proportion of the total tokens contributed: `(S + S_j) / S = (T + T_j) / T`.

A special case is the initial delegation, when `T = 0` and `S = 0`, so `T_j / T` is undefined.<br/>
For the initial delegation, delegator `j` who delegates `T_j` tokens receive `S_j = T_j` shares.<br/>
So a validator that hasn't received any rewards and has not been slashed will have `T = S`.

### Messages [​](https://docs.cosmos.network/v0.50/build/modules/staking#messages "Direct link to Messages")

In this section we describe the processing of the staking messages and the corresponding updates to the state. All created/modified state objects specified by each message are defined within the [state](https://docs.cosmos.network/v0.50/build/modules/staking#state) section.

#### MsgCreateValidator [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgcreatevalidator "Direct link to MsgCreateValidator")

A validator is created using the `MsgCreateValidator` message.<br/>
The validator must be created with an initial delegation from the operator.

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// CreateValidator defines a method for creating a new validator.
rpc CreateValidator(MsgCreateValidator) returns (MsgCreateValidatorResponse);

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L20-L21)

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgCreateValidator defines a SDK message for creating a new validator.
message MsgCreateValidator {
  // NOTE(fdymylja): this is a particular case in which
  // if validator_address == delegator_address then only one
  // is expected to sign, otherwise both are.
  option (cosmos.msg.v1.signer) = "delegator_address";
  option (cosmos.msg.v1.signer) = "validator_address";
  option (amino.name)           = "cosmos-sdk/MsgCreateValidator";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  Description     description         = 1 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  CommissionRates commission          = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  string          min_self_delegation = 3 [\
    (cosmos_proto.scalar)  = "cosmos.Int",\
    (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Int",\
    (gogoproto.nullable)   = false\
  ];
  string                   delegator_address = 4 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string                   validator_address = 5 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  google.protobuf.Any      pubkey            = 6 [(cosmos_proto.accepts_interface) = "cosmos.crypto.PubKey"];
  cosmos.base.v1beta1.Coin value             = 7 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L50-L73)

This message is expected to fail if:

- another validator with this operator address is already registered
- another validator with this pubkey is already registered
- the initial self-delegation tokens are of a denom not specified as the bonding denom
- the commission parameters are faulty, namely:
  - `MaxRate` is either > 1 or < 0
  - the initial `Rate` is either negative or > `MaxRate`
  - the initial `MaxChangeRate` is either negative or > `MaxRate`
- the description fields are too large

This message creates and stores the `Validator` object at appropriate indexes.<br/>
Additionally a self-delegation is made with the initial tokens delegation<br/>
tokens `Delegation`. The validator always starts as unbonded but may be bonded<br/>
in the first end-block.

#### MsgEditValidator [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgeditvalidator "Direct link to MsgEditValidator")

The `Description`, `CommissionRate` of a validator can be updated using the<br/>
`MsgEditValidator` message.

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// EditValidator defines a method for editing an existing validator.
rpc EditValidator(MsgEditValidator) returns (MsgEditValidatorResponse);

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L23-L24)

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgEditValidator defines a SDK message for editing an existing validator.
message MsgEditValidator {
  option (cosmos.msg.v1.signer) = "validator_address";
  option (amino.name)           = "cosmos-sdk/MsgEditValidator";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  Description description       = 1 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  string      validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // We pass a reference to the new commission rate and min self delegation as
  // it's not mandatory to update. If not updated, the deserialized rate will be
  // zero with no way to distinguish if an update was intended.
  // REF: #2373
  string commission_rate = 3
      [(cosmos_proto.scalar) = "cosmos.Dec", (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Dec"];
  string min_self_delegation = 4
      [(cosmos_proto.scalar) = "cosmos.Int", (gogoproto.customtype) = "github.com/cosmos/cosmos-sdk/types.Int"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L78-L97)

This message is expected to fail if:

- the initial `CommissionRate` is either negative or > `MaxRate`
- the `CommissionRate` has already been updated within the previous 24 hours
- the `CommissionRate` is > `MaxChangeRate`
- the description fields are too large

This message stores the updated `Validator` object.

#### MsgDelegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgdelegate "Direct link to MsgDelegate")

Within this message the delegator provides coins, and in return receives<br/>
some amount of their validator's (newly created) delegator-shares that are<br/>
assigned to `Delegation.Shares`.

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// Delegate defines a method for performing a delegation of coins
// from a delegator to a validator.
rpc Delegate(MsgDelegate) returns (MsgDelegateResponse);

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L26-L28)

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgDelegate defines a SDK message for performing a delegation of coins
// from a delegator to a validator.
message MsgDelegate {
  option (cosmos.msg.v1.signer) = "delegator_address";
  option (amino.name)           = "cosmos-sdk/MsgDelegate";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  string                   delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string                   validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  cosmos.base.v1beta1.Coin amount            = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L102-L114)

This message is expected to fail if:

- the validator does not exist
- the `Amount` `Coin` has a denomination different than one defined by `params.BondDenom`
- the exchange rate is invalid, meaning the validator has no tokens (due to slashing) but there are outstanding shares
- the amount delegated is less than the minimum allowed delegation

If an existing `Delegation` object for provided addresses does not already<br/>
exist then it is created as part of this message otherwise the existing<br/>
`Delegation` is updated to include the newly received shares.

The delegator receives newly minted shares at the current exchange rate.<br/>
The exchange rate is the number of existing shares in the validator divided by<br/>
the number of currently delegated tokens.

The validator is updated in the `ValidatorByPower` index, and the delegation is<br/>
tracked in validator object in the `Validators` index.

It is possible to delegate to a jailed validator, the only difference being it<br/>
will not be added to the power index until it is unjailed.

![Delegation sequence](https://raw.githubusercontent.com/cosmos/cosmos-sdk/release/v0.46.x/docs/uml/svg/delegation_sequence.svg)

#### MsgUndelegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgundelegate "Direct link to MsgUndelegate")

The `MsgUndelegate` message allows delegators to undelegate their tokens from<br/>
validator.

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// Undelegate defines a method for performing an undelegation from a
// delegate and a validator.
rpc Undelegate(MsgUndelegate) returns (MsgUndelegateResponse);

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L34-L36)

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgUndelegate defines a SDK message for performing an undelegation from a
// delegate and a validator.
message MsgUndelegate {
  option (cosmos.msg.v1.signer) = "delegator_address";
  option (amino.name)           = "cosmos-sdk/MsgUndelegate";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  string                   delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string                   validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  cosmos.base.v1beta1.Coin amount            = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L140-L152)

This message returns a response containing the completion time of the undelegation:

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgUndelegateResponse defines the Msg/Undelegate response type.
message MsgUndelegateResponse {
  google.protobuf.Timestamp completion_time = 1
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdtime) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L154-L158)

This message is expected to fail if:

- the delegation doesn't exist
- the validator doesn't exist
- the delegation has less shares than the ones worth of `Amount`
- existing `UnbondingDelegation` has maximum entries as defined by `params.MaxEntries`
- the `Amount` has a denomination different than one defined by `params.BondDenom`

When this message is processed the following actions occur:

- validator's `DelegatorShares` and the delegation's `Shares` are both reduced by the message `SharesAmount`
- calculate the token worth of the shares remove that amount tokens held within the validator
- with those removed tokens, if the validator is:
  - `Bonded` \- add them to an entry in `UnbondingDelegation` (create `UnbondingDelegation` if it doesn't exist) with a completion time a full unbonding period from the current time. Update pool shares to reduce BondedTokens and increase NotBondedTokens by token worth of the shares.
  - `Unbonding` \- add them to an entry in `UnbondingDelegation` (create `UnbondingDelegation` if it doesn't exist) with the same completion time as the validator (`UnbondingMinTime`).
  - `Unbonded` \- then send the coins the message `DelegatorAddr`
- if there are no more `Shares` in the delegation, then the delegation object is removed from the store
  - under this situation if the delegation is the validator's self-delegation then also jail the validator.

![Unbond sequence](https://raw.githubusercontent.com/cosmos/cosmos-sdk/release/v0.46.x/docs/uml/svg/unbond_sequence.svg)

#### MsgCancelUnbondingDelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgcancelunbondingdelegation "Direct link to MsgCancelUnbondingDelegation")

The `MsgCancelUnbondingDelegation` message allows delegators to cancel the `unbondingDelegation` entry and delegate back to a previous validator.

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// CancelUnbondingDelegation defines a method for performing canceling the unbonding delegation
// and delegate back to previous validator.
//
// Since: cosmos-sdk 0.46
rpc CancelUnbondingDelegation(MsgCancelUnbondingDelegation) returns (MsgCancelUnbondingDelegationResponse);

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L38-L42)

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgCancelUnbondingDelegation defines the SDK message for performing a cancel unbonding delegation for delegator
//
// Since: cosmos-sdk 0.46
message MsgCancelUnbondingDelegation {
  option (cosmos.msg.v1.signer)      = "delegator_address";
  option (amino.name)                = "cosmos-sdk/MsgCancelUnbondingDelegation";
  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  string delegator_address = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string validator_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // amount is always less than or equal to unbonding delegation entry balance
  cosmos.base.v1beta1.Coin amount = 3 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
  // creation_height is the height which the unbonding took place.
  int64 creation_height = 4;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L160-L175)

This message is expected to fail if:

- the `unbondingDelegation` entry is already processed.
- the `cancel unbonding delegation` amount is greater than the `unbondingDelegation` entry balance.
- the `cancel unbonding delegation` height doesn't exist in the `unbondingDelegationQueue` of the delegator.

When this message is processed the following actions occur:

- if the `unbondingDelegation` Entry balance is zero
  - in this condition `unbondingDelegation` entry will be removed from `unbondingDelegationQueue`.
  - otherwise `unbondingDelegationQueue` will be updated with new `unbondingDelegation` entry balance and initial balance
- the validator's `DelegatorShares` and the delegation's `Shares` are both increased by the message `Amount`.

#### MsgBeginRedelegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgbeginredelegate "Direct link to MsgBeginRedelegate")

The redelegation command allows delegators to instantly switch validators. Once<br/>
the unbonding period has passed, the redelegation is automatically completed in<br/>
the EndBlocker.

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// BeginRedelegate defines a method for performing a redelegation
// of coins from a delegator and source validator to a destination validator.
rpc BeginRedelegate(MsgBeginRedelegate) returns (MsgBeginRedelegateResponse);

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L30-L32)

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgBeginRedelegate defines a SDK message for performing a redelegation
// of coins from a delegator and source validator to a destination validator.
message MsgBeginRedelegate {
  option (cosmos.msg.v1.signer) = "delegator_address";
  option (amino.name)           = "cosmos-sdk/MsgBeginRedelegate";

  option (gogoproto.equal)           = false;
  option (gogoproto.goproto_getters) = false;

  string                   delegator_address     = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string                   validator_src_address = 2 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  string                   validator_dst_address = 3 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  cosmos.base.v1beta1.Coin amount                = 4 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L119-L132)

This message returns a response containing the completion time of the redelegation:

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv

// MsgBeginRedelegateResponse defines the Msg/BeginRedelegate response type.
message MsgBeginRedelegateResponse {
  google.protobuf.Timestamp completion_time = 1
      [(gogoproto.nullable) = false, (amino.dont_omitempty) = true, (gogoproto.stdtime) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L133-L138)

This message is expected to fail if:

- the delegation doesn't exist
- the source or destination validators don't exist
- the delegation has less shares than the ones worth of `Amount`
- the source validator has a receiving redelegation which is not matured (aka. the redelegation may be transitive)
- existing `Redelegation` has maximum entries as defined by `params.MaxEntries`
- the `Amount` `Coin` has a denomination different than one defined by `params.BondDenom`

When this message is processed the following actions occur:

- the source validator's `DelegatorShares` and the delegations `Shares` are both reduced by the message `SharesAmount`
- calculate the token worth of the shares remove that amount tokens held within the source validator.
- if the source validator is:
  - `Bonded` \- add an entry to the `Redelegation` (create `Redelegation` if it doesn't exist) with a completion time a full unbonding period from the current time. Update pool shares to reduce BondedTokens and increase NotBondedTokens by token worth of the shares (this may be effectively reversed in the next step however).
  - `Unbonding` \- add an entry to the `Redelegation` (create `Redelegation` if it doesn't exist) with the same completion time as the validator (`UnbondingMinTime`).
  - `Unbonded` \- no action required in this step
- Delegate the token worth to the destination validator, possibly moving tokens back to the bonded state.
- if there are no more `Shares` in the source delegation, then the source delegation object is removed from the store
  - under this situation if the delegation is the validator's self-delegation then also jail the validator.

![Begin redelegation sequence](https://raw.githubusercontent.com/cosmos/cosmos-sdk/release/v0.46.x/docs/uml/svg/begin_redelegation_sequence.svg)

#### MsgUpdateParams [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgupdateparams "Direct link to MsgUpdateParams")

The `MsgUpdateParams` update the staking module parameters.<br/>
The params are updated through a governance proposal where the signer is the gov module account address.

proto/cosmos/staking/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgUpdateParams is the Msg/UpdateParams request type.
//
// Since: cosmos-sdk 0.47
message MsgUpdateParams {
  option (cosmos.msg.v1.signer) = "authority";
  option (amino.name)           = "cosmos-sdk/x/staking/MsgUpdateParams";

  // authority is the address that controls the module (defaults to x/gov unless overwritten).
  string authority = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
  // params defines the x/staking parameters to update.
  //
  // NOTE: All parameters must be supplied.
  Params params = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
};

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/staking/v1beta1/tx.proto#L182-L195)

The message handling can fail if:

- signer is not the authority defined in the staking keeper (usually the gov module account).

### Begin-Block [​](https://docs.cosmos.network/v0.50/build/modules/staking#begin-block "Direct link to Begin-Block")

Each abci begin block call, the historical info will get stored and pruned<br/>
according to the `HistoricalEntries` parameter.

#### Historical Info Tracking [​](https://docs.cosmos.network/v0.50/build/modules/staking#historical-info-tracking "Direct link to Historical Info Tracking")

If the `HistoricalEntries` parameter is 0, then the `BeginBlock` performs a no-op.

Otherwise, the latest historical info is stored under the key `historicalInfoKey|height`, while any entries older than `height - HistoricalEntries` is deleted.<br/>
In most cases, this results in a single entry being pruned per block.<br/>
However, if the parameter `HistoricalEntries` has changed to a lower value there will be multiple entries in the store that must be pruned.

### End-Block [​](https://docs.cosmos.network/v0.50/build/modules/staking#end-block "Direct link to End-Block")

Each abci end block call, the operations to update queues and validator set<br/>
changes are specified to execute.

#### Validator Set Changes [​](https://docs.cosmos.network/v0.50/build/modules/staking#validator-set-changes "Direct link to Validator Set Changes")

The staking validator set is updated during this process by state transitions<br/>
that run at the end of every block. As a part of this process any updated<br/>
validators are also returned back to CometBFT for inclusion in the CometBFT<br/>
validator set which is responsible for validating CometBFT messages at the<br/>
consensus layer. Operations are as following:

- the new validator set is taken as the top `params.MaxValidators` number of<br/>
  validators retrieved from the `ValidatorsByPower` index
- the previous validator set is compared with the new validator set:
  - missing validators begin unbonding and their `Tokens` are transferred from the<br/>
    `BondedPool` to the `NotBondedPool` `ModuleAccount`
  - new validators are instantly bonded and their `Tokens` are transferred from the<br/>
    `NotBondedPool` to the `BondedPool` `ModuleAccount`

In all cases, any validators leaving or entering the bonded validator set or<br/>
changing balances and staying within the bonded validator set incur an update<br/>
message reporting their new consensus power which is passed back to CometBFT.

The `LastTotalPower` and `LastValidatorsPower` hold the state of the total power<br/>
and validator power from the end of the last block, and are used to check for<br/>
changes that have occurred in `ValidatorsByPower` and the total new power, which<br/>
is calculated during `EndBlock`.

#### Queues [​](https://docs.cosmos.network/v0.50/build/modules/staking#queues-1 "Direct link to Queues")

Within staking, certain state-transitions are not instantaneous but take place<br/>
over a duration of time (typically the unbonding period). When these<br/>
transitions are mature certain operations must take place in order to complete<br/>
the state operation. This is achieved through the use of queues which are<br/>
checked/processed at the end of each block.

##### Unbonding Validators [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbonding-validators "Direct link to Unbonding Validators")

When a validator is kicked out of the bonded validator set (either through<br/>
being jailed, or not having sufficient bonded tokens) it begins the unbonding<br/>
process along with all its delegations begin unbonding (while still being<br/>
delegated to this validator). At this point the validator is said to be an<br/>
"unbonding validator", whereby it will mature to become an "unbonded validator"<br/>
after the unbonding period has passed.

Each block the validator queue is to be checked for mature unbonding validators<br/>
(namely with a completion time <= current time and completion height <= current<br/>
block height). At this point any mature validators which do not have any<br/>
delegations remaining are deleted from state. For all other mature unbonding<br/>
validators that still have remaining delegations, the `validator.Status` is<br/>
switched from `types.Unbonding` to<br/>
`types.Unbonded`.

Unbonding operations can be put on hold by external modules via the `PutUnbondingOnHold(unbondingId)` method.<br/>
As a result, an unbonding operation (e.g., an unbonding delegation) that is on hold, cannot complete<br/>
even if it reaches maturity. For an unbonding operation with `unbondingId` to eventually complete<br/>
(after it reaches maturity), every call to `PutUnbondingOnHold(unbondingId)` must be matched<br/>
by a call to `UnbondingCanComplete(unbondingId)`.

##### Unbonding Delegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbonding-delegations "Direct link to Unbonding Delegations")

Complete the unbonding of all mature `UnbondingDelegations.Entries` within the<br/>
`UnbondingDelegations` queue with the following procedure:

- transfer the balance coins to the delegator's wallet address
- remove the mature entry from `UnbondingDelegation.Entries`
- remove the `UnbondingDelegation` object from the store if there are no<br/>
  remaining entries.

##### Redelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegations "Direct link to Redelegations")

Complete the unbonding of all mature `Redelegation.Entries` within the<br/>
`Redelegations` queue with the following procedure:

- remove the mature entry from `Redelegation.Entries`
- remove the `Redelegation` object from the store if there are no<br/>
  remaining entries.

### Hooks [​](https://docs.cosmos.network/v0.50/build/modules/staking#hooks "Direct link to Hooks")

Other modules may register operations to execute when a certain event has<br/>
occurred within staking. These events can be registered to execute either<br/>
right `Before` or `After` the staking event (as per the hook name). The<br/>
following hooks can registered with staking:

- `AfterValidatorCreated(Context, ValAddress) error`
  - called when a validator is created
- `BeforeValidatorModified(Context, ValAddress) error`
  - called when a validator's state is changed
- `AfterValidatorRemoved(Context, ConsAddress, ValAddress) error`
  - called when a validator is deleted
- `AfterValidatorBonded(Context, ConsAddress, ValAddress) error`
  - called when a validator is bonded
- `AfterValidatorBeginUnbonding(Context, ConsAddress, ValAddress) error`
  - called when a validator begins unbonding
- `BeforeDelegationCreated(Context, AccAddress, ValAddress) error`
  - called when a delegation is created
- `BeforeDelegationSharesModified(Context, AccAddress, ValAddress) error`
  - called when a delegation's shares are modified
- `AfterDelegationModified(Context, AccAddress, ValAddress) error`
  - called when a delegation is created or modified
- `BeforeDelegationRemoved(Context, AccAddress, ValAddress) error`
  - called when a delegation is removed
- `AfterUnbondingInitiated(Context, UnbondingID)`
  - called when an unbonding operation (validator unbonding, unbonding delegation, redelegation) was initiated

### Events [​](https://docs.cosmos.network/v0.50/build/modules/staking#events "Direct link to Events")

The staking module emits the following events:

#### EndBlocker [​](https://docs.cosmos.network/v0.50/build/modules/staking#endblocker "Direct link to EndBlocker")

| Type                  | Attribute Key         | Attribute Value           |
| --------------------- | --------------------- | ------------------------- |
| complete_unbonding    | amount                | {totalUnbondingAmount}    |
| complete_unbonding    | validator             | {validatorAddress}        |
| complete_unbonding    | delegator             | {delegatorAddress}        |
| complete_redelegation | amount                | {totalRedelegationAmount} |
| complete_redelegation | source_validator      | {srcValidatorAddress}     |
| complete_redelegation | destination_validator | {dstValidatorAddress}     |
| complete_redelegation | delegator             | {delegatorAddress}        |

### Msg's [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgs "Direct link to Msg's")

#### MsgCreateValidator [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgcreatevalidator-1 "Direct link to MsgCreateValidator")

| Type             | Attribute Key | Attribute Value    |
| ---------------- | ------------- | ------------------ |
| create_validator | validator     | {validatorAddress} |
| create_validator | amount        | {delegationAmount} |
| message          | module        | staking            |
| message          | action        | create_validator   |
| message          | sender        | {senderAddress}    |

#### MsgEditValidator [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgeditvalidator-1 "Direct link to MsgEditValidator")

| Type           | Attribute Key       | Attribute Value     |
| -------------- | ------------------- | ------------------- |
| edit_validator | commission_rate     | {commissionRate}    |
| edit_validator | min_self_delegation | {minSelfDelegation} |
| message        | module              | staking             |
| message        | action              | edit_validator      |
| message        | sender              | {senderAddress}     |

#### MsgDelegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgdelegate-1 "Direct link to MsgDelegate")

| Type     | Attribute Key | Attribute Value    |
| -------- | ------------- | ------------------ |
| delegate | validator     | {validatorAddress} |
| delegate | amount        | {delegationAmount} |
| message  | module        | staking            |
| message  | action        | delegate           |
| message  | sender        | {senderAddress}    |

#### MsgUndelegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgundelegate-1 "Direct link to MsgUndelegate")

| Type    | Attribute Key         | Attribute Value    |
| ------- | --------------------- | ------------------ |
| unbond  | validator             | {validatorAddress} |
| unbond  | amount                | {unbondAmount}     |
| unbond  | completion_time \[0\] | {completionTime}   |
| message | module                | staking            |
| message | action                | begin_unbonding    |
| message | sender                | {senderAddress}    |

- \[0\] Time is formatted in the RFC3339 standard

#### MsgCancelUnbondingDelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgcancelunbondingdelegation-1 "Direct link to MsgCancelUnbondingDelegation")

| Type                        | Attribute Key   | Attribute Value                   |
| --------------------------- | --------------- | --------------------------------- |
| cancel_unbonding_delegation | validator       | {validatorAddress}                |
| cancel_unbonding_delegation | delegator       | {delegatorAddress}                |
| cancel_unbonding_delegation | amount          | {cancelUnbondingDelegationAmount} |
| cancel_unbonding_delegation | creation_height | {unbondingCreationHeight}         |
| message                     | module          | staking                           |
| message                     | action          | cancel_unbond                     |
| message                     | sender          | {senderAddress}                   |

#### MsgBeginRedelegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#msgbeginredelegate-1 "Direct link to MsgBeginRedelegate")

| Type       | Attribute Key         | Attribute Value       |
| ---------- | --------------------- | --------------------- |
| redelegate | source_validator      | {srcValidatorAddress} |
| redelegate | destination_validator | {dstValidatorAddress} |
| redelegate | amount                | {unbondAmount}        |
| redelegate | completion_time \[0\] | {completionTime}      |
| message    | module                | staking               |
| message    | action                | begin_redelegate      |
| message    | sender                | {senderAddress}       |

- \[0\] Time is formatted in the RFC3339 standard

### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/staking#parameters "Direct link to Parameters")

The staking module contains the following parameters:

| Key               | Type             | Example                |
| ----------------- | ---------------- | ---------------------- |
| UnbondingTime     | string (time ns) | "259200000000000"      |
| MaxValidators     | uint16           | 100                    |
| KeyMaxEntries     | uint16           | 7                      |
| HistoricalEntries | uint16           | 3                      |
| BondDenom         | string           | "stake"                |
| MinCommissionRate | string           | "0.000000000000000000" |

### Client [​](https://docs.cosmos.network/v0.50/build/modules/staking#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/staking#cli "Direct link to CLI")

A user can query and interact with the `staking` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/staking#query "Direct link to Query")

The `query` commands allows users to query `staking` state.

```codeBlockLines_e6Vv
simd query staking --help

```

###### Delegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegation-1 "Direct link to delegation")

The `delegation` command allows users to query delegations for an individual delegator on an individual validator.

Usage:

```codeBlockLines_e6Vv
simd query staking delegation [delegator-addr] [validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking delegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

Example Output:

```codeBlockLines_e6Vv
balance:
  amount: "10000000000"
  denom: stake
delegation:
  delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
  shares: "10000000000.000000000000000000"
  validator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

###### Delegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegations-1 "Direct link to delegations")

The `delegations` command allows users to query delegations for an individual delegator on all validators.

Usage:

```codeBlockLines_e6Vv
simd query staking delegations [delegator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking delegations cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p

```

Example Output:

```codeBlockLines_e6Vv
delegation_responses:
- balance:
    amount: "10000000000"
    denom: stake
  delegation:
    delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
    shares: "10000000000.000000000000000000"
    validator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
- balance:
    amount: "10000000000"
    denom: stake
  delegation:
    delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
    shares: "10000000000.000000000000000000"
    validator_address: cosmosvaloper1x20lytyf6zkcrv5edpkfkn8sz578qg5sqfyqnp
pagination:
  next_key: null
  total: "0"

```

###### Delegations-to [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegations-to "Direct link to delegations-to")

The `delegations-to` command allows users to query delegations on an individual validator.

Usage:

```codeBlockLines_e6Vv
simd query staking delegations-to [validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking delegations-to cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

Example Output:

```codeBlockLines_e6Vv
- balance:
    amount: "504000000"
    denom: stake
  delegation:
    delegator_address: cosmos1q2qwwynhv8kh3lu5fkeex4awau9x8fwt45f5cp
    shares: "504000000.000000000000000000"
    validator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
- balance:
    amount: "78125000000"
    denom: uixo
  delegation:
    delegator_address: cosmos1qvppl3479hw4clahe0kwdlfvf8uvjtcd99m2ca
    shares: "78125000000.000000000000000000"
    validator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
pagination:
  next_key: null
  total: "0"

```

###### Historical-info [​](https://docs.cosmos.network/v0.50/build/modules/staking#historical-info "Direct link to historical-info")

The `historical-info` command allows users to query historical information at given height.

Usage:

```codeBlockLines_e6Vv
simd query staking historical-info [height] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking historical-info 10

```

Example Output:

```codeBlockLines_e6Vv
header:
  app_hash: Lbx8cXpI868wz8sgp4qPYVrlaKjevR5WP/IjUxwp3oo=
  chain_id: testnet
  consensus_hash: BICRvH3cKD93v7+R1zxE2ljD34qcvIZ0Bdi389qtoi8=
  data_hash: 47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
  evidence_hash: 47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
  height: "10"
  last_block_id:
    hash: RFbkpu6pWfSThXxKKl6EZVDnBSm16+U0l0xVjTX08Fk=
    part_set_header:
      hash: vpIvXD4rxD5GM4MXGz0Sad9I7//iVYLzZsEU4BVgWIU=
      total: 1
  last_commit_hash: Ne4uXyx4QtNp4Zx89kf9UK7oG9QVbdB6e7ZwZkhy8K0=
  last_results_hash: 47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
  next_validators_hash: nGBgKeWBjoxeKFti00CxHsnULORgKY4LiuQwBuUrhCs=
  proposer_address: mMEP2c2IRPLr99LedSRtBg9eONM=
  time: "2021-10-01T06:00:49.785790894Z"
  validators_hash: nGBgKeWBjoxeKFti00CxHsnULORgKY4LiuQwBuUrhCs=
  version:
    app: "0"
    block: "11"
valset:
- commission:
    commission_rates:
      max_change_rate: "0.010000000000000000"
      max_rate: "0.200000000000000000"
      rate: "0.100000000000000000"
    update_time: "2021-10-01T05:52:50.380144238Z"
  consensus_pubkey:
    '@type': /cosmos.crypto.ed25519.PubKey
    key: Auxs3865HpB/EfssYOzfqNhEJjzys2Fo6jD5B8tPgC8=
  delegator_shares: "10000000.000000000000000000"
  description:
    details: ""
    identity: ""
    moniker: myvalidator
    security_contact: ""
    website: ""
  jailed: false
  min_self_delegation: "1"
  operator_address: cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc
  status: BOND_STATUS_BONDED
  tokens: "10000000"
  unbonding_height: "0"
  unbonding_time: "1970-01-01T00:00:00Z"

```

###### Params [​](https://docs.cosmos.network/v0.50/build/modules/staking#params-1 "Direct link to params")

The `params` command allows users to query values set as staking parameters.

Usage:

```codeBlockLines_e6Vv
simd query staking params [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking params

```

Example Output:

```codeBlockLines_e6Vv
bond_denom: stake
historical_entries: 10000
max_entries: 7
max_validators: 50
unbonding_time: 1814400s

```

###### Pool [​](https://docs.cosmos.network/v0.50/build/modules/staking#pool-1 "Direct link to pool")

The `pool` command allows users to query values for amounts stored in the staking pool.

Usage:

```codeBlockLines_e6Vv
simd q staking pool [flags]

```

Example:

```codeBlockLines_e6Vv
simd q staking pool

```

Example Output:

```codeBlockLines_e6Vv
bonded_tokens: "10000000"
not_bonded_tokens: "0"

```

###### Redelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegation-1 "Direct link to redelegation")

The `redelegation` command allows users to query a redelegation record based on delegator and a source and destination validator address.

Usage:

```codeBlockLines_e6Vv
simd query staking redelegation [delegator-addr] [src-validator-addr] [dst-validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking redelegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p cosmosvaloper1l2rsakp388kuv9k8qzq6lrm9taddae7fpx59wm cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

Example Output:

```codeBlockLines_e6Vv
pagination: null
redelegation_responses:
- entries:
  - balance: "50000000"
    redelegation_entry:
      completion_time: "2021-10-24T20:33:21.960084845Z"
      creation_height: 2.382847e+06
      initial_balance: "50000000"
      shares_dst: "50000000.000000000000000000"
  - balance: "5000000000"
    redelegation_entry:
      completion_time: "2021-10-25T21:33:54.446846862Z"
      creation_height: 2.397271e+06
      initial_balance: "5000000000"
      shares_dst: "5000000000.000000000000000000"
  redelegation:
    delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
    entries: null
    validator_dst_address: cosmosvaloper1l2rsakp388kuv9k8qzq6lrm9taddae7fpx59wm
    validator_src_address: cosmosvaloper1l2rsakp388kuv9k8qzq6lrm9taddae7fpx59wm

```

###### Redelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegations-1 "Direct link to redelegations")

The `redelegations` command allows users to query all redelegation records for an individual delegator.

Usage:

```codeBlockLines_e6Vv
simd query staking redelegations [delegator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking redelegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "0"
redelegation_responses:
- entries:
  - balance: "50000000"
    redelegation_entry:
      completion_time: "2021-10-24T20:33:21.960084845Z"
      creation_height: 2.382847e+06
      initial_balance: "50000000"
      shares_dst: "50000000.000000000000000000"
  - balance: "5000000000"
    redelegation_entry:
      completion_time: "2021-10-25T21:33:54.446846862Z"
      creation_height: 2.397271e+06
      initial_balance: "5000000000"
      shares_dst: "5000000000.000000000000000000"
  redelegation:
    delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
    entries: null
    validator_dst_address: cosmosvaloper1uccl5ugxrm7vqlzwqr04pjd320d2fz0z3hc6vm
    validator_src_address: cosmosvaloper1zppjyal5emta5cquje8ndkpz0rs046m7zqxrpp
- entries:
  - balance: "562770000000"
    redelegation_entry:
      completion_time: "2021-10-25T21:42:07.336911677Z"
      creation_height: 2.39735e+06
      initial_balance: "562770000000"
      shares_dst: "562770000000.000000000000000000"
  redelegation:
    delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
    entries: null
    validator_dst_address: cosmosvaloper1uccl5ugxrm7vqlzwqr04pjd320d2fz0z3hc6vm
    validator_src_address: cosmosvaloper1zppjyal5emta5cquje8ndkpz0rs046m7zqxrpp

```

###### Redelegations-from [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegations-from "Direct link to redelegations-from")

The `redelegations-from` command allows users to query delegations that are redelegating _from_ a validator.

Usage:

```codeBlockLines_e6Vv
simd query staking redelegations-from [validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking redelegations-from cosmosvaloper1y4rzzrgl66eyhzt6gse2k7ej3zgwmngeleucjy

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "0"
redelegation_responses:
- entries:
  - balance: "50000000"
    redelegation_entry:
      completion_time: "2021-10-24T20:33:21.960084845Z"
      creation_height: 2.382847e+06
      initial_balance: "50000000"
      shares_dst: "50000000.000000000000000000"
  - balance: "5000000000"
    redelegation_entry:
      completion_time: "2021-10-25T21:33:54.446846862Z"
      creation_height: 2.397271e+06
      initial_balance: "5000000000"
      shares_dst: "5000000000.000000000000000000"
  redelegation:
    delegator_address: cosmos1pm6e78p4pgn0da365plzl4t56pxy8hwtqp2mph
    entries: null
    validator_dst_address: cosmosvaloper1uccl5ugxrm7vqlzwqr04pjd320d2fz0z3hc6vm
    validator_src_address: cosmosvaloper1y4rzzrgl66eyhzt6gse2k7ej3zgwmngeleucjy
- entries:
  - balance: "221000000"
    redelegation_entry:
      completion_time: "2021-10-05T21:05:45.669420544Z"
      creation_height: 2.120693e+06
      initial_balance: "221000000"
      shares_dst: "221000000.000000000000000000"
  redelegation:
    delegator_address: cosmos1zqv8qxy2zgn4c58fz8jt8jmhs3d0attcussrf6
    entries: null
    validator_dst_address: cosmosvaloper10mseqwnwtjaqfrwwp2nyrruwmjp6u5jhah4c3y
    validator_src_address: cosmosvaloper1y4rzzrgl66eyhzt6gse2k7ej3zgwmngeleucjy

```

###### Unbonding-delegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbonding-delegation "Direct link to unbonding-delegation")

The `unbonding-delegation` command allows users to query unbonding delegations for an individual delegator on an individual validator.

Usage:

```codeBlockLines_e6Vv
simd query staking unbonding-delegation [delegator-addr] [validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking unbonding-delegation cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

Example Output:

```codeBlockLines_e6Vv
delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
entries:
- balance: "52000000"
  completion_time: "2021-11-02T11:35:55.391594709Z"
  creation_height: "55078"
  initial_balance: "52000000"
validator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

###### Unbonding-delegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbonding-delegations-1 "Direct link to unbonding-delegations")

The `unbonding-delegations` command allows users to query all unbonding-delegations records for one delegator.

Usage:

```codeBlockLines_e6Vv
simd query staking unbonding-delegations [delegator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking unbonding-delegations cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "0"
unbonding_responses:
- delegator_address: cosmos1gghjut3ccd8ay0zduzj64hwre2fxs9ld75ru9p
  entries:
  - balance: "52000000"
    completion_time: "2021-11-02T11:35:55.391594709Z"
    creation_height: "55078"
    initial_balance: "52000000"
  validator_address: cosmosvaloper1t8ehvswxjfn3ejzkjtntcyrqwvmvuknzmvtaaa

```

###### Unbonding-delegations-from [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbonding-delegations-from "Direct link to unbonding-delegations-from")

The `unbonding-delegations-from` command allows users to query delegations that are unbonding _from_ a validator.

Usage:

```codeBlockLines_e6Vv
simd query staking unbonding-delegations-from [validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking unbonding-delegations-from cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: null
  total: "0"
unbonding_responses:
- delegator_address: cosmos1qqq9txnw4c77sdvzx0tkedsafl5s3vk7hn53fn
  entries:
  - balance: "150000000"
    completion_time: "2021-11-01T21:41:13.098141574Z"
    creation_height: "46823"
    initial_balance: "150000000"
  validator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
- delegator_address: cosmos1peteje73eklqau66mr7h7rmewmt2vt99y24f5z
  entries:
  - balance: "24000000"
    completion_time: "2021-10-31T02:57:18.192280361Z"
    creation_height: "21516"
    initial_balance: "24000000"
  validator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

###### Validator [​](https://docs.cosmos.network/v0.50/build/modules/staking#validator-1 "Direct link to validator")

The `validator` command allows users to query details about an individual validator.

Usage:

```codeBlockLines_e6Vv
simd query staking validator [validator-addr] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking validator cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj

```

Example Output:

```codeBlockLines_e6Vv
commission:
  commission_rates:
    max_change_rate: "0.020000000000000000"
    max_rate: "0.200000000000000000"
    rate: "0.050000000000000000"
  update_time: "2021-10-01T19:24:52.663191049Z"
consensus_pubkey:
  '@type': /cosmos.crypto.ed25519.PubKey
  key: sIiexdJdYWn27+7iUHQJDnkp63gq/rzUq1Y+fxoGjXc=
delegator_shares: "32948270000.000000000000000000"
description:
  details: Witval is the validator arm from Vitwit. Vitwit is into software consulting
    and services business since 2015. We are working closely with Cosmos ecosystem
    since 2018. We are also building tools for the ecosystem, Aneka is our explorer
    for the cosmos ecosystem.
  identity: 51468B615127273A
  moniker: Witval
  security_contact: ""
  website: ""
jailed: false
min_self_delegation: "1"
operator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
status: BOND_STATUS_BONDED
tokens: "32948270000"
unbonding_height: "0"
unbonding_time: "1970-01-01T00:00:00Z"

```

###### Validators [​](https://docs.cosmos.network/v0.50/build/modules/staking#validators-1 "Direct link to validators")

The `validators` command allows users to query details about all validators on a network.

Usage:

```codeBlockLines_e6Vv
simd query staking validators [flags]

```

Example:

```codeBlockLines_e6Vv
simd query staking validators

```

Example Output:

```codeBlockLines_e6Vv
pagination:
  next_key: FPTi7TKAjN63QqZh+BaXn6gBmD5/
  total: "0"
validators:
commission:
  commission_rates:
    max_change_rate: "0.020000000000000000"
    max_rate: "0.200000000000000000"
    rate: "0.050000000000000000"
  update_time: "2021-10-01T19:24:52.663191049Z"
consensus_pubkey:
  '@type': /cosmos.crypto.ed25519.PubKey
  key: sIiexdJdYWn27+7iUHQJDnkp63gq/rzUq1Y+fxoGjXc=
delegator_shares: "32948270000.000000000000000000"
description:
    details: Witval is the validator arm from Vitwit. Vitwit is into software consulting
      and services business since 2015. We are working closely with Cosmos ecosystem
      since 2018. We are also building tools for the ecosystem, Aneka is our explorer
      for the cosmos ecosystem.
    identity: 51468B615127273A
    moniker: Witval
    security_contact: ""
    website: ""
  jailed: false
  min_self_delegation: "1"
  operator_address: cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj
  status: BOND_STATUS_BONDED
  tokens: "32948270000"
  unbonding_height: "0"
  unbonding_time: "1970-01-01T00:00:00Z"
- commission:
    commission_rates:
      max_change_rate: "0.100000000000000000"
      max_rate: "0.200000000000000000"
      rate: "0.050000000000000000"
    update_time: "2021-10-04T18:02:21.446645619Z"
  consensus_pubkey:
    '@type': /cosmos.crypto.ed25519.PubKey
    key: GDNpuKDmCg9GnhnsiU4fCWktuGUemjNfvpCZiqoRIYA=
  delegator_shares: "559343421.000000000000000000"
  description:
    details: Noderunners is a professional validator in POS networks. We have a huge
      node running experience, reliable soft and hardware. Our commissions are always
      low, our support to delegators is always full. Stake with us and start receiving
      your Cosmos rewards now!
    identity: 812E82D12FEA3493
    moniker: Noderunners
    security_contact: info@noderunners.biz
    website: http://noderunners.biz
  jailed: false
  min_self_delegation: "1"
  operator_address: cosmosvaloper1q5ku90atkhktze83j9xjaks2p7uruag5zp6wt7
  status: BOND_STATUS_BONDED
  tokens: "559343421"
  unbonding_height: "0"
  unbonding_time: "1970-01-01T00:00:00Z"

```

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/staking#transactions "Direct link to Transactions")

The `tx` commands allows users to interact with the `staking` module.

```codeBlockLines_e6Vv
simd tx staking --help

```

###### Create-validator [​](https://docs.cosmos.network/v0.50/build/modules/staking#create-validator "Direct link to create-validator")

The command `create-validator` allows users to create new validator initialized with a self-delegation to it.

Usage:

```codeBlockLines_e6Vv
simd tx staking create-validator [path/to/validator.json] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx staking create-validator /path/to/validator.json \
  --chain-id="name_of_chain_id" \
  --gas="auto" \
  --gas-adjustment="1.2" \
  --gas-prices="0.025stake" \
  --from=mykey

```

where `validator.json` contains:

```codeBlockLines_e6Vv
{
  "pubkey": {"@type":"/cosmos.crypto.ed25519.PubKey","key":"BnbwFpeONLqvWqJb3qaUbL5aoIcW3fSuAp9nT3z5f20="},
  "amount": "1000000stake",
  "moniker": "my-moniker",
  "website": "https://myweb.site",
  "security": "security-contact@gmail.com",
  "details": "description of your validator",
  "commission-rate": "0.10",
  "commission-max-rate": "0.20",
  "commission-max-change-rate": "0.01",
  "min-self-delegation": "1"
}

```

and pubkey can be obtained by using `simd tendermint show-validator` command.

###### Delegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegate-1 "Direct link to delegate")

The command `delegate` allows users to delegate liquid tokens to a validator.

Usage:

```codeBlockLines_e6Vv
simd tx staking delegate [validator-addr] [amount] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx staking delegate cosmosvaloper1l2rsakp388kuv9k8qzq6lrm9taddae7fpx59wm 1000stake --from mykey

```

###### Edit-validator [​](https://docs.cosmos.network/v0.50/build/modules/staking#edit-validator "Direct link to edit-validator")

The command `edit-validator` allows users to edit an existing validator account.

Usage:

```codeBlockLines_e6Vv
simd tx staking edit-validator [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx staking edit-validator --moniker "new_moniker_name" --website "new_webiste_url" --from mykey

```

###### Redelegate [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegate "Direct link to redelegate")

The command `redelegate` allows users to redelegate illiquid tokens from one validator to another.

Usage:

```codeBlockLines_e6Vv
simd tx staking redelegate [src-validator-addr] [dst-validator-addr] [amount] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx staking redelegate cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj cosmosvaloper1l2rsakp388kuv9k8qzq6lrm9taddae7fpx59wm 100stake --from mykey

```

###### Unbond [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbond "Direct link to unbond")

The command `unbond` allows users to unbond shares from a validator.

Usage:

```codeBlockLines_e6Vv
simd tx staking unbond [validator-addr] [amount] [flags]

```

Example:

```codeBlockLines_e6Vv
simd tx staking unbond cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj 100stake --from mykey

```

###### Cancel Unbond [​](https://docs.cosmos.network/v0.50/build/modules/staking#cancel-unbond "Direct link to cancel unbond")

The command `cancel-unbond` allow users to cancel the unbonding delegation entry and delegate back to the original validator.

Usage:

```codeBlockLines_e6Vv
simd tx staking cancel-unbond [validator-addr] [amount] [creation-height]

```

Example:

```codeBlockLines_e6Vv
simd tx staking cancel-unbond cosmosvaloper1gghjut3ccd8ay0zduzj64hwre2fxs9ldmqhffj 100stake 123123 --from mykey

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/staking#grpc "Direct link to gRPC")

A user can query the `staking` module using gRPC endpoints.

##### Validators [​](https://docs.cosmos.network/v0.50/build/modules/staking#validators-2 "Direct link to Validators")

The `Validators` endpoint queries all validators that match the given status.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/Validators

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.staking.v1beta1.Query/Validators

```

Example Output:

```codeBlockLines_e6Vv
{
  "validators": [\
    {\
      "operatorAddress": "cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc",\
      "consensusPubkey": {"@type":"/cosmos.crypto.ed25519.PubKey","key":"Auxs3865HpB/EfssYOzfqNhEJjzys2Fo6jD5B8tPgC8="},\
      "status": "BOND_STATUS_BONDED",\
      "tokens": "10000000",\
      "delegatorShares": "10000000000000000000000000",\
      "description": {\
        "moniker": "myvalidator"\
      },\
      "unbondingTime": "1970-01-01T00:00:00Z",\
      "commission": {\
        "commissionRates": {\
          "rate": "100000000000000000",\
          "maxRate": "200000000000000000",\
          "maxChangeRate": "10000000000000000"\
        },\
        "updateTime": "2021-10-01T05:52:50.380144238Z"\
      },\
      "minSelfDelegation": "1"\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

##### Validator [​](https://docs.cosmos.network/v0.50/build/modules/staking#validator-2 "Direct link to Validator")

The `Validator` endpoint queries validator information for given validator address.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/Validator

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext -d '{"validator_addr":"cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc"}' \
localhost:9090 cosmos.staking.v1beta1.Query/Validator

```

Example Output:

```codeBlockLines_e6Vv
{
  "validator": {
    "operatorAddress": "cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc",
    "consensusPubkey": {"@type":"/cosmos.crypto.ed25519.PubKey","key":"Auxs3865HpB/EfssYOzfqNhEJjzys2Fo6jD5B8tPgC8="},
    "status": "BOND_STATUS_BONDED",
    "tokens": "10000000",
    "delegatorShares": "10000000000000000000000000",
    "description": {
      "moniker": "myvalidator"
    },
    "unbondingTime": "1970-01-01T00:00:00Z",
    "commission": {
      "commissionRates": {
        "rate": "100000000000000000",
        "maxRate": "200000000000000000",
        "maxChangeRate": "10000000000000000"
      },
      "updateTime": "2021-10-01T05:52:50.380144238Z"
    },
    "minSelfDelegation": "1"
  }
}

```

##### ValidatorDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#validatordelegations "Direct link to ValidatorDelegations")

The `ValidatorDelegations` endpoint queries delegate information for given validator.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/ValidatorDelegations

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext -d '{"validator_addr":"cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc"}' \
localhost:9090 cosmos.staking.v1beta1.Query/ValidatorDelegations

```

Example Output:

```codeBlockLines_e6Vv
{
  "delegationResponses": [\
    {\
      "delegation": {\
        "delegatorAddress": "cosmos1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgy3ua5t",\
        "validatorAddress": "cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc",\
        "shares": "10000000000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "10000000"\
      }\
    }\
  ],
  "pagination": {
    "total": "1"
  }
}

```

##### ValidatorUnbondingDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#validatorunbondingdelegations "Direct link to ValidatorUnbondingDelegations")

The `ValidatorUnbondingDelegations` endpoint queries delegate information for given validator.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/ValidatorUnbondingDelegations

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext -d '{"validator_addr":"cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc"}' \
localhost:9090 cosmos.staking.v1beta1.Query/ValidatorUnbondingDelegations

```

Example Output:

```codeBlockLines_e6Vv
{
  "unbonding_responses": [\
    {\
      "delegator_address": "cosmos1z3pzzw84d6xn00pw9dy3yapqypfde7vg6965fy",\
      "validator_address": "cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc",\
      "entries": [\
        {\
          "creation_height": "25325",\
          "completion_time": "2021-10-31T09:24:36.797320636Z",\
          "initial_balance": "20000000",\
          "balance": "20000000"\
        }\
      ]\
    },\
    {\
      "delegator_address": "cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77",\
      "validator_address": "cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc",\
      "entries": [\
        {\
          "creation_height": "13100",\
          "completion_time": "2021-10-30T12:53:02.272266791Z",\
          "initial_balance": "1000000",\
          "balance": "1000000"\
        }\
      ]\
    },\
  ],
  "pagination": {
    "next_key": null,
    "total": "8"
  }
}

```

##### Delegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegation-2 "Direct link to Delegation")

The `Delegation` endpoint queries delegate information for given validator delegator pair.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/Delegation

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
-d '{"delegator_addr": "cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77", validator_addr":"cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc"}' \
localhost:9090 cosmos.staking.v1beta1.Query/Delegation

```

Example Output:

```codeBlockLines_e6Vv
{
  "delegation_response":
  {
    "delegation":
      {
        "delegator_address":"cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77",
        "validator_address":"cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc",
        "shares":"25083119936.000000000000000000"
      },
    "balance":
      {
        "denom":"stake",
        "amount":"25083119936"
      }
  }
}

```

##### UnbondingDelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbondingdelegation-1 "Direct link to UnbondingDelegation")

The `UnbondingDelegation` endpoint queries unbonding information for given validator delegator.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/UnbondingDelegation

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
-d '{"delegator_addr": "cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77", validator_addr":"cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc"}' \
localhost:9090 cosmos.staking.v1beta1.Query/UnbondingDelegation

```

Example Output:

```codeBlockLines_e6Vv
{
  "unbond": {
    "delegator_address": "cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77",
    "validator_address": "cosmosvaloper1rne8lgs98p0jqe82sgt0qr4rdn4hgvmgp9ggcc",
    "entries": [\
      {\
        "creation_height": "136984",\
        "completion_time": "2021-11-08T05:38:47.505593891Z",\
        "initial_balance": "400000000",\
        "balance": "400000000"\
      },\
      {\
        "creation_height": "137005",\
        "completion_time": "2021-11-08T05:40:53.526196312Z",\
        "initial_balance": "385000000",\
        "balance": "385000000"\
      }\
    ]
  }
}

```

##### DelegatorDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatordelegations "Direct link to DelegatorDelegations")

The `DelegatorDelegations` endpoint queries all delegations of a given delegator address.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/DelegatorDelegations

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
-d '{"delegator_addr": "cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77"}' \
localhost:9090 cosmos.staking.v1beta1.Query/DelegatorDelegations

```

Example Output:

```codeBlockLines_e6Vv
{
  "delegation_responses": [\
    {"delegation":{"delegator_address":"cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77","validator_address":"cosmosvaloper1eh5mwu044gd5ntkkc2xgfg8247mgc56fww3vc8","shares":"25083339023.000000000000000000"},"balance":{"denom":"stake","amount":"25083339023"}}\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### DelegatorUnbondingDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatorunbondingdelegations "Direct link to DelegatorUnbondingDelegations")

The `DelegatorUnbondingDelegations` endpoint queries all unbonding delegations of a given delegator address.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/DelegatorUnbondingDelegations

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
-d '{"delegator_addr": "cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77"}' \
localhost:9090 cosmos.staking.v1beta1.Query/DelegatorUnbondingDelegations

```

Example Output:

```codeBlockLines_e6Vv
{
  "unbonding_responses": [\
    {\
      "delegator_address": "cosmos1y8nyfvmqh50p6ldpzljk3yrglppdv3t8phju77",\
      "validator_address": "cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9uxyejze",\
      "entries": [\
        {\
          "creation_height": "136984",\
          "completion_time": "2021-11-08T05:38:47.505593891Z",\
          "initial_balance": "400000000",\
          "balance": "400000000"\
        },\
        {\
          "creation_height": "137005",\
          "completion_time": "2021-11-08T05:40:53.526196312Z",\
          "initial_balance": "385000000",\
          "balance": "385000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### Redelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegations-2 "Direct link to Redelegations")

The `Redelegations` endpoint queries redelegations of given address.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/Redelegations

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
-d '{"delegator_addr": "cosmos1ld5p7hn43yuh8ht28gm9pfjgj2fctujp2tgwvf", "src_validator_addr" : "cosmosvaloper1j7euyj85fv2jugejrktj540emh9353ltgppc3g", "dst_validator_addr" : "cosmosvaloper1yy3tnegzmkdcm7czzcy3flw5z0zyr9vkkxrfse"}' \
localhost:9090 cosmos.staking.v1beta1.Query/Redelegations

```

Example Output:

```codeBlockLines_e6Vv
{
  "redelegation_responses": [\
    {\
      "redelegation": {\
        "delegator_address": "cosmos1ld5p7hn43yuh8ht28gm9pfjgj2fctujp2tgwvf",\
        "validator_src_address": "cosmosvaloper1j7euyj85fv2jugejrktj540emh9353ltgppc3g",\
        "validator_dst_address": "cosmosvaloper1yy3tnegzmkdcm7czzcy3flw5z0zyr9vkkxrfse",\
        "entries": null\
      },\
      "entries": [\
        {\
          "redelegation_entry": {\
            "creation_height": 135932,\
            "completion_time": "2021-11-08T03:52:55.299147901Z",\
            "initial_balance": "2900000",\
            "shares_dst": "2900000.000000000000000000"\
          },\
          "balance": "2900000"\
        }\
      ]\
    }\
  ],
  "pagination": null
}

```

##### DelegatorValidators [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatorvalidators "Direct link to DelegatorValidators")

The `DelegatorValidators` endpoint queries all validators information for given delegator.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/DelegatorValidators

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
-d '{"delegator_addr": "cosmos1ld5p7hn43yuh8ht28gm9pfjgj2fctujp2tgwvf"}' \
localhost:9090 cosmos.staking.v1beta1.Query/DelegatorValidators

```

Example Output:

```codeBlockLines_e6Vv
{
  "validators": [\
    {\
      "operator_address": "cosmosvaloper1eh5mwu044gd5ntkkc2xgfg8247mgc56fww3vc8",\
      "consensus_pubkey": {\
        "@type": "/cosmos.crypto.ed25519.PubKey",\
        "key": "UPwHWxH1zHJWGOa/m6JB3f5YjHMvPQPkVbDqqi+U7Uw="\
      },\
      "jailed": false,\
      "status": "BOND_STATUS_BONDED",\
      "tokens": "347260647559",\
      "delegator_shares": "347260647559.000000000000000000",\
      "description": {\
        "moniker": "BouBouNode",\
        "identity": "",\
        "website": "https://boubounode.com",\
        "security_contact": "",\
        "details": "AI-based Validator. #1 AI Validator on Game of Stakes. Fairly priced. Don't trust (humans), verify. Made with BouBou love."\
      },\
      "unbonding_height": "0",\
      "unbonding_time": "1970-01-01T00:00:00Z",\
      "commission": {\
        "commission_rates": {\
          "rate": "0.061000000000000000",\
          "max_rate": "0.300000000000000000",\
          "max_change_rate": "0.150000000000000000"\
        },\
        "update_time": "2021-10-01T15:00:00Z"\
      },\
      "min_self_delegation": "1"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### DelegatorValidator [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatorvalidator "Direct link to DelegatorValidator")

The `DelegatorValidator` endpoint queries validator information for given delegator validator

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/DelegatorValidator

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
-d '{"delegator_addr": "cosmos1eh5mwu044gd5ntkkc2xgfg8247mgc56f3n8rr7", "validator_addr": "cosmosvaloper1eh5mwu044gd5ntkkc2xgfg8247mgc56fww3vc8"}' \
localhost:9090 cosmos.staking.v1beta1.Query/DelegatorValidator

```

Example Output:

```codeBlockLines_e6Vv
{
  "validator": {
    "operator_address": "cosmosvaloper1eh5mwu044gd5ntkkc2xgfg8247mgc56fww3vc8",
    "consensus_pubkey": {
      "@type": "/cosmos.crypto.ed25519.PubKey",
      "key": "UPwHWxH1zHJWGOa/m6JB3f5YjHMvPQPkVbDqqi+U7Uw="
    },
    "jailed": false,
    "status": "BOND_STATUS_BONDED",
    "tokens": "347262754841",
    "delegator_shares": "347262754841.000000000000000000",
    "description": {
      "moniker": "BouBouNode",
      "identity": "",
      "website": "https://boubounode.com",
      "security_contact": "",
      "details": "AI-based Validator. #1 AI Validator on Game of Stakes. Fairly priced. Don't trust (humans), verify. Made with BouBou love."
    },
    "unbonding_height": "0",
    "unbonding_time": "1970-01-01T00:00:00Z",
    "commission": {
      "commission_rates": {
        "rate": "0.061000000000000000",
        "max_rate": "0.300000000000000000",
        "max_change_rate": "0.150000000000000000"
      },
      "update_time": "2021-10-01T15:00:00Z"
    },
    "min_self_delegation": "1"
  }
}

```

##### HistoricalInfo [​](https://docs.cosmos.network/v0.50/build/modules/staking#historicalinfo-1 "Direct link to HistoricalInfo")

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/HistoricalInfo

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext -d '{"height" : 1}' localhost:9090 cosmos.staking.v1beta1.Query/HistoricalInfo

```

Example Output:

```codeBlockLines_e6Vv
{
  "hist": {
    "header": {
      "version": {
        "block": "11",
        "app": "0"
      },
      "chain_id": "simd-1",
      "height": "140142",
      "time": "2021-10-11T10:56:29.720079569Z",
      "last_block_id": {
        "hash": "9gri/4LLJUBFqioQ3NzZIP9/7YHR9QqaM6B2aJNQA7o=",
        "part_set_header": {
          "total": 1,
          "hash": "Hk1+C864uQkl9+I6Zn7IurBZBKUevqlVtU7VqaZl1tc="
        }
      },
      "last_commit_hash": "VxrcS27GtvGruS3I9+AlpT7udxIT1F0OrRklrVFSSKc=",
      "data_hash": "80BjOrqNYUOkTnmgWyz9AQ8n7SoEmPVi4QmAe8RbQBY=",
      "validators_hash": "95W49n2hw8RWpr1GPTAO5MSPi6w6Wjr3JjjS7AjpBho=",
      "next_validators_hash": "95W49n2hw8RWpr1GPTAO5MSPi6w6Wjr3JjjS7AjpBho=",
      "consensus_hash": "BICRvH3cKD93v7+R1zxE2ljD34qcvIZ0Bdi389qtoi8=",
      "app_hash": "ZZaxnSY3E6Ex5Bvkm+RigYCK82g8SSUL53NymPITeOE=",
      "last_results_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "proposer_address": "aH6dO428B+ItuoqPq70efFHrSMY="
    },
  "valset": [\
      {\
        "operator_address": "cosmosvaloper196ax4vc0lwpxndu9dyhvca7jhxp70rmcqcnylw",\
        "consensus_pubkey": {\
          "@type": "/cosmos.crypto.ed25519.PubKey",\
          "key": "/O7BtNW0pafwfvomgR4ZnfldwPXiFfJs9mHg3gwfv5Q="\
        },\
        "jailed": false,\
        "status": "BOND_STATUS_BONDED",\
        "tokens": "1426045203613",\
        "delegator_shares": "1426045203613.000000000000000000",\
        "description": {\
          "moniker": "SG-1",\
          "identity": "48608633F99D1B60",\
          "website": "https://sg-1.online",\
          "security_contact": "",\
          "details": "SG-1 - your favorite validator on Witval. We offer 100% Soft Slash protection."\
        },\
        "unbonding_height": "0",\
        "unbonding_time": "1970-01-01T00:00:00Z",\
        "commission": {\
          "commission_rates": {\
            "rate": "0.037500000000000000",\
            "max_rate": "0.200000000000000000",\
            "max_change_rate": "0.030000000000000000"\
          },\
          "update_time": "2021-10-01T15:00:00Z"\
        },\
        "min_self_delegation": "1"\
      }\
    ]
  }
}

```

##### Pool [​](https://docs.cosmos.network/v0.50/build/modules/staking#pool-2 "Direct link to Pool")

The `Pool` endpoint queries the pool information.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/Pool

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext -d localhost:9090 cosmos.staking.v1beta1.Query/Pool

```

Example Output:

```codeBlockLines_e6Vv
{
  "pool": {
    "not_bonded_tokens": "369054400189",
    "bonded_tokens": "15657192425623"
  }
}

```

##### Params [​](https://docs.cosmos.network/v0.50/build/modules/staking#params-2 "Direct link to Params")

The `Params` endpoint queries the pool information.

```codeBlockLines_e6Vv
cosmos.staking.v1beta1.Query/Params

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.staking.v1beta1.Query/Params

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "unbondingTime": "1814400s",
    "maxValidators": 100,
    "maxEntries": 7,
    "historicalEntries": 10000,
    "bondDenom": "stake"
  }
}

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/staking#rest "Direct link to REST")

A user can query the `staking` module using REST endpoints.

##### DelegatorDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatordelegations-1 "Direct link to DelegatorDelegations")

The `DelegtaorDelegations` REST endpoint queries all delegations of a given delegator address.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/delegations/{delegatorAddr}

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/staking/v1beta1/delegations/cosmos1vcs68xf2tnqes5tg0khr0vyevm40ff6zdxatp5" -H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "delegation_responses": [\
    {\
      "delegation": {\
        "delegator_address": "cosmos1vcs68xf2tnqes5tg0khr0vyevm40ff6zdxatp5",\
        "validator_address": "cosmosvaloper1quqxfrxkycr0uzt4yk0d57tcq3zk7srm7sm6r8",\
        "shares": "256250000.000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "256250000"\
      }\
    },\
    {\
      "delegation": {\
        "delegator_address": "cosmos1vcs68xf2tnqes5tg0khr0vyevm40ff6zdxatp5",\
        "validator_address": "cosmosvaloper194v8uwee2fvs2s8fa5k7j03ktwc87h5ym39jfv",\
        "shares": "255150000.000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "255150000"\
      }\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }
}

```

##### Redelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#redelegations-3 "Direct link to Redelegations")

The `Redelegations` REST endpoint queries redelegations of given address.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/delegators/{delegatorAddr}/redelegations

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/delegators/cosmos1thfntksw0d35n2tkr0k8v54fr8wxtxwxl2c56e/redelegations?srcValidatorAddr=cosmosvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qx4cuznf&dstValidatorAddr=cosmosvaloper1vq8tw77kp8lvxq9u3c8eeln9zymn68rng8pgt4" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "redelegation_responses": [\
    {\
      "redelegation": {\
        "delegator_address": "cosmos1thfntksw0d35n2tkr0k8v54fr8wxtxwxl2c56e",\
        "validator_src_address": "cosmosvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qx4cuznf",\
        "validator_dst_address": "cosmosvaloper1vq8tw77kp8lvxq9u3c8eeln9zymn68rng8pgt4",\
        "entries": null\
      },\
      "entries": [\
        {\
          "redelegation_entry": {\
            "creation_height": 151523,\
            "completion_time": "2021-11-09T06:03:25.640682116Z",\
            "initial_balance": "200000000",\
            "shares_dst": "200000000.000000000000000000"\
          },\
          "balance": "200000000"\
        }\
      ]\
    }\
  ],
  "pagination": null
}

```

##### DelegatorUnbondingDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatorunbondingdelegations-1 "Direct link to DelegatorUnbondingDelegations")

The `DelegatorUnbondingDelegations` REST endpoint queries all unbonding delegations of a given delegator address.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/delegators/{delegatorAddr}/unbonding_delegations

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/delegators/cosmos1nxv42u3lv642q0fuzu2qmrku27zgut3n3z7lll/unbonding_delegations" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "unbonding_responses": [\
    {\
      "delegator_address": "cosmos1nxv42u3lv642q0fuzu2qmrku27zgut3n3z7lll",\
      "validator_address": "cosmosvaloper1e7mvqlz50ch6gw4yjfemsc069wfre4qwmw53kq",\
      "entries": [\
        {\
          "creation_height": "2442278",\
          "completion_time": "2021-10-12T10:59:03.797335857Z",\
          "initial_balance": "50000000000",\
          "balance": "50000000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### DelegatorValidators [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatorvalidators-1 "Direct link to DelegatorValidators")

The `DelegatorValidators` REST endpoint queries all validators information for given delegator address.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/delegators/{delegatorAddr}/validators

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/delegators/cosmos1xwazl8ftks4gn00y5x3c47auquc62ssune9ppv/validators" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "validators": [\
    {\
      "operator_address": "cosmosvaloper1xwazl8ftks4gn00y5x3c47auquc62ssuvynw64",\
      "consensus_pubkey": {\
        "@type": "/cosmos.crypto.ed25519.PubKey",\
        "key": "5v4n3px3PkfNnKflSgepDnsMQR1hiNXnqOC11Y72/PQ="\
      },\
      "jailed": false,\
      "status": "BOND_STATUS_BONDED",\
      "tokens": "21592843799",\
      "delegator_shares": "21592843799.000000000000000000",\
      "description": {\
        "moniker": "jabbey",\
        "identity": "",\
        "website": "https://twitter.com/JoeAbbey",\
        "security_contact": "",\
        "details": "just another dad in the cosmos"\
      },\
      "unbonding_height": "0",\
      "unbonding_time": "1970-01-01T00:00:00Z",\
      "commission": {\
        "commission_rates": {\
          "rate": "0.100000000000000000",\
          "max_rate": "0.200000000000000000",\
          "max_change_rate": "0.100000000000000000"\
        },\
        "update_time": "2021-10-09T19:03:54.984821705Z"\
      },\
      "min_self_delegation": "1"\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "1"
  }
}

```

##### DelegatorValidator [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegatorvalidator-1 "Direct link to DelegatorValidator")

The `DelegatorValidator` REST endpoint queries validator information for given delegator validator pair.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/delegators/{delegatorAddr}/validators/{validatorAddr}

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/delegators/cosmos1xwazl8ftks4gn00y5x3c47auquc62ssune9ppv/validators/cosmosvaloper1xwazl8ftks4gn00y5x3c47auquc62ssuvynw64" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "validator": {
    "operator_address": "cosmosvaloper1xwazl8ftks4gn00y5x3c47auquc62ssuvynw64",
    "consensus_pubkey": {
      "@type": "/cosmos.crypto.ed25519.PubKey",
      "key": "5v4n3px3PkfNnKflSgepDnsMQR1hiNXnqOC11Y72/PQ="
    },
    "jailed": false,
    "status": "BOND_STATUS_BONDED",
    "tokens": "21592843799",
    "delegator_shares": "21592843799.000000000000000000",
    "description": {
      "moniker": "jabbey",
      "identity": "",
      "website": "https://twitter.com/JoeAbbey",
      "security_contact": "",
      "details": "just another dad in the cosmos"
    },
    "unbonding_height": "0",
    "unbonding_time": "1970-01-01T00:00:00Z",
    "commission": {
      "commission_rates": {
        "rate": "0.100000000000000000",
        "max_rate": "0.200000000000000000",
        "max_change_rate": "0.100000000000000000"
      },
      "update_time": "2021-10-09T19:03:54.984821705Z"
    },
    "min_self_delegation": "1"
  }
}

```

##### HistoricalInfo [​](https://docs.cosmos.network/v0.50/build/modules/staking#historicalinfo-2 "Direct link to HistoricalInfo")

The `HistoricalInfo` REST endpoint queries the historical information for given height.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/historical_info/{height}

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/staking/v1beta1/historical_info/153332" -H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "hist": {
    "header": {
      "version": {
        "block": "11",
        "app": "0"
      },
      "chain_id": "cosmos-1",
      "height": "153332",
      "time": "2021-10-12T09:05:35.062230221Z",
      "last_block_id": {
        "hash": "NX8HevR5khb7H6NGKva+jVz7cyf0skF1CrcY9A0s+d8=",
        "part_set_header": {
          "total": 1,
          "hash": "zLQ2FiKM5tooL3BInt+VVfgzjlBXfq0Hc8Iux/xrhdg="
        }
      },
      "last_commit_hash": "P6IJrK8vSqU3dGEyRHnAFocoDGja0bn9euLuy09s350=",
      "data_hash": "eUd+6acHWrNXYju8Js449RJ99lOYOs16KpqQl4SMrEM=",
      "validators_hash": "mB4pravvMsJKgi+g8aYdSeNlt0kPjnRFyvtAQtaxcfw=",
      "next_validators_hash": "mB4pravvMsJKgi+g8aYdSeNlt0kPjnRFyvtAQtaxcfw=",
      "consensus_hash": "BICRvH3cKD93v7+R1zxE2ljD34qcvIZ0Bdi389qtoi8=",
      "app_hash": "fuELArKRK+CptnZ8tu54h6xEleSWenHNmqC84W866fU=",
      "last_results_hash": "p/BPexV4LxAzlVcPRvW+lomgXb6Yze8YLIQUo/4Kdgc=",
      "evidence_hash": "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
      "proposer_address": "G0MeY8xQx7ooOsni8KE/3R/Ib3Q="
    },
    "valset": [\
      {\
        "operator_address": "cosmosvaloper196ax4vc0lwpxndu9dyhvca7jhxp70rmcqcnylw",\
        "consensus_pubkey": {\
          "@type": "/cosmos.crypto.ed25519.PubKey",\
          "key": "/O7BtNW0pafwfvomgR4ZnfldwPXiFfJs9mHg3gwfv5Q="\
        },\
        "jailed": false,\
        "status": "BOND_STATUS_BONDED",\
        "tokens": "1416521659632",\
        "delegator_shares": "1416521659632.000000000000000000",\
        "description": {\
          "moniker": "SG-1",\
          "identity": "48608633F99D1B60",\
          "website": "https://sg-1.online",\
          "security_contact": "",\
          "details": "SG-1 - your favorite validator on cosmos. We offer 100% Soft Slash protection."\
        },\
        "unbonding_height": "0",\
        "unbonding_time": "1970-01-01T00:00:00Z",\
        "commission": {\
          "commission_rates": {\
            "rate": "0.037500000000000000",\
            "max_rate": "0.200000000000000000",\
            "max_change_rate": "0.030000000000000000"\
          },\
          "update_time": "2021-10-01T15:00:00Z"\
        },\
        "min_self_delegation": "1"\
      },\
      {\
        "operator_address": "cosmosvaloper1t8ehvswxjfn3ejzkjtntcyrqwvmvuknzmvtaaa",\
        "consensus_pubkey": {\
          "@type": "/cosmos.crypto.ed25519.PubKey",\
          "key": "uExZyjNLtr2+FFIhNDAMcQ8+yTrqE7ygYTsI7khkA5Y="\
        },\
        "jailed": false,\
        "status": "BOND_STATUS_BONDED",\
        "tokens": "1348298958808",\
        "delegator_shares": "1348298958808.000000000000000000",\
        "description": {\
          "moniker": "Cosmostation",\
          "identity": "AE4C403A6E7AA1AC",\
          "website": "https://www.cosmostation.io",\
          "security_contact": "admin@stamper.network",\
          "details": "Cosmostation validator node. Delegate your tokens and Start Earning Staking Rewards"\
        },\
        "unbonding_height": "0",\
        "unbonding_time": "1970-01-01T00:00:00Z",\
        "commission": {\
          "commission_rates": {\
            "rate": "0.050000000000000000",\
            "max_rate": "1.000000000000000000",\
            "max_change_rate": "0.200000000000000000"\
          },\
          "update_time": "2021-10-01T15:06:38.821314287Z"\
        },\
        "min_self_delegation": "1"\
      }\
    ]
  }
}

```

##### Parameters [​](https://docs.cosmos.network/v0.50/build/modules/staking#parameters-1 "Direct link to Parameters")

The `Parameters` REST endpoint queries the staking parameters.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/params

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/staking/v1beta1/params" -H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "params": {
    "unbonding_time": "2419200s",
    "max_validators": 100,
    "max_entries": 7,
    "historical_entries": 10000,
    "bond_denom": "stake"
  }
}

```

##### Pool [​](https://docs.cosmos.network/v0.50/build/modules/staking#pool-3 "Direct link to Pool")

The `Pool` REST endpoint queries the pool information.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/pool

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/staking/v1beta1/pool" -H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "pool": {
    "not_bonded_tokens": "432805737458",
    "bonded_tokens": "15783637712645"
  }
}

```

##### Validators [​](https://docs.cosmos.network/v0.50/build/modules/staking#validators-3 "Direct link to Validators")

The `Validators` REST endpoint queries all validators that match the given status.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/validators

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/staking/v1beta1/validators" -H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "validators": [\
    {\
      "operator_address": "cosmosvaloper1q3jsx9dpfhtyqqgetwpe5tmk8f0ms5qywje8tw",\
      "consensus_pubkey": {\
        "@type": "/cosmos.crypto.ed25519.PubKey",\
        "key": "N7BPyek2aKuNZ0N/8YsrqSDhGZmgVaYUBuddY8pwKaE="\
      },\
      "jailed": false,\
      "status": "BOND_STATUS_BONDED",\
      "tokens": "383301887799",\
      "delegator_shares": "383301887799.000000000000000000",\
      "description": {\
        "moniker": "SmartNodes",\
        "identity": "D372724899D1EDC8",\
        "website": "https://smartnodes.co",\
        "security_contact": "",\
        "details": "Earn Rewards with Crypto Staking & Node Deployment"\
      },\
      "unbonding_height": "0",\
      "unbonding_time": "1970-01-01T00:00:00Z",\
      "commission": {\
        "commission_rates": {\
          "rate": "0.050000000000000000",\
          "max_rate": "0.200000000000000000",\
          "max_change_rate": "0.100000000000000000"\
        },\
        "update_time": "2021-10-01T15:51:31.596618510Z"\
      },\
      "min_self_delegation": "1"\
    },\
    {\
      "operator_address": "cosmosvaloper1q5ku90atkhktze83j9xjaks2p7uruag5zp6wt7",\
      "consensus_pubkey": {\
        "@type": "/cosmos.crypto.ed25519.PubKey",\
        "key": "GDNpuKDmCg9GnhnsiU4fCWktuGUemjNfvpCZiqoRIYA="\
      },\
      "jailed": false,\
      "status": "BOND_STATUS_UNBONDING",\
      "tokens": "1017819654",\
      "delegator_shares": "1017819654.000000000000000000",\
      "description": {\
        "moniker": "Noderunners",\
        "identity": "812E82D12FEA3493",\
        "website": "http://noderunners.biz",\
        "security_contact": "info@noderunners.biz",\
        "details": "Noderunners is a professional validator in POS networks. We have a huge node running experience, reliable soft and hardware. Our commissions are always low, our support to delegators is always full. Stake with us and start receiving your cosmos rewards now!"\
      },\
      "unbonding_height": "147302",\
      "unbonding_time": "2021-11-08T22:58:53.718662452Z",\
      "commission": {\
        "commission_rates": {\
          "rate": "0.050000000000000000",\
          "max_rate": "0.200000000000000000",\
          "max_change_rate": "0.100000000000000000"\
        },\
        "update_time": "2021-10-04T18:02:21.446645619Z"\
      },\
      "min_self_delegation": "1"\
    }\
  ],
  "pagination": {
    "next_key": "FONDBFkE4tEEf7yxWWKOD49jC2NK",
    "total": "2"
  }
}

```

##### Validator [​](https://docs.cosmos.network/v0.50/build/modules/staking#validator-3 "Direct link to Validator")

The `Validator` REST endpoint queries validator information for given validator address.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/validators/{validatorAddr}

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/validators/cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "validator": {
    "operator_address": "cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q",
    "consensus_pubkey": {
      "@type": "/cosmos.crypto.ed25519.PubKey",
      "key": "sIiexdJdYWn27+7iUHQJDnkp63gq/rzUq1Y+fxoGjXc="
    },
    "jailed": false,
    "status": "BOND_STATUS_BONDED",
    "tokens": "33027900000",
    "delegator_shares": "33027900000.000000000000000000",
    "description": {
      "moniker": "Witval",
      "identity": "51468B615127273A",
      "website": "",
      "security_contact": "",
      "details": "Witval is the validator arm from Vitwit. Vitwit is into software consulting and services business since 2015. We are working closely with Cosmos ecosystem since 2018. We are also building tools for the ecosystem, Aneka is our explorer for the cosmos ecosystem."
    },
    "unbonding_height": "0",
    "unbonding_time": "1970-01-01T00:00:00Z",
    "commission": {
      "commission_rates": {
        "rate": "0.050000000000000000",
        "max_rate": "0.200000000000000000",
        "max_change_rate": "0.020000000000000000"
      },
      "update_time": "2021-10-01T19:24:52.663191049Z"
    },
    "min_self_delegation": "1"
  }
}

```

##### ValidatorDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#validatordelegations-1 "Direct link to ValidatorDelegations")

The `ValidatorDelegations` REST endpoint queries delegate information for given validator.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/validators/{validatorAddr}/delegations

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/staking/v1beta1/validators/cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q/delegations" -H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "delegation_responses": [\
    {\
      "delegation": {\
        "delegator_address": "cosmos190g5j8aszqhvtg7cprmev8xcxs6csra7xnk3n3",\
        "validator_address": "cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q",\
        "shares": "31000000000.000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "31000000000"\
      }\
    },\
    {\
      "delegation": {\
        "delegator_address": "cosmos1ddle9tczl87gsvmeva3c48nenyng4n56qwq4ee",\
        "validator_address": "cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q",\
        "shares": "628470000.000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "628470000"\
      }\
    },\
    {\
      "delegation": {\
        "delegator_address": "cosmos10fdvkczl76m040smd33lh9xn9j0cf26kk4s2nw",\
        "validator_address": "cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q",\
        "shares": "838120000.000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "838120000"\
      }\
    },\
    {\
      "delegation": {\
        "delegator_address": "cosmos1n8f5fknsv2yt7a8u6nrx30zqy7lu9jfm0t5lq8",\
        "validator_address": "cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q",\
        "shares": "500000000.000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "500000000"\
      }\
    },\
    {\
      "delegation": {\
        "delegator_address": "cosmos16msryt3fqlxtvsy8u5ay7wv2p8mglfg9hrek2e",\
        "validator_address": "cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q",\
        "shares": "61310000.000000000000000000"\
      },\
      "balance": {\
        "denom": "stake",\
        "amount": "61310000"\
      }\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "5"
  }
}

```

##### Delegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#delegation-3 "Direct link to Delegation")

The `Delegation` REST endpoint queries delegate information for given validator delegator pair.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/validators/{validatorAddr}/delegations/{delegatorAddr}

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/validators/cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q/delegations/cosmos1n8f5fknsv2yt7a8u6nrx30zqy7lu9jfm0t5lq8" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "delegation_response": {
    "delegation": {
      "delegator_address": "cosmos1n8f5fknsv2yt7a8u6nrx30zqy7lu9jfm0t5lq8",
      "validator_address": "cosmosvaloper16msryt3fqlxtvsy8u5ay7wv2p8mglfg9g70e3q",
      "shares": "500000000.000000000000000000"
    },
    "balance": {
      "denom": "stake",
      "amount": "500000000"
    }
  }
}

```

##### UnbondingDelegation [​](https://docs.cosmos.network/v0.50/build/modules/staking#unbondingdelegation-2 "Direct link to UnbondingDelegation")

The `UnbondingDelegation` REST endpoint queries unbonding information for given validator delegator pair.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/validators/{validatorAddr}/delegations/{delegatorAddr}/unbonding_delegation

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/validators/cosmosvaloper13v4spsah85ps4vtrw07vzea37gq5la5gktlkeu/delegations/cosmos1ze2ye5u5k3qdlexvt2e0nn0508p04094ya0qpm/unbonding_delegation" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "unbond": {
    "delegator_address": "cosmos1ze2ye5u5k3qdlexvt2e0nn0508p04094ya0qpm",
    "validator_address": "cosmosvaloper13v4spsah85ps4vtrw07vzea37gq5la5gktlkeu",
    "entries": [\
      {\
        "creation_height": "153687",\
        "completion_time": "2021-11-09T09:41:18.352401903Z",\
        "initial_balance": "525111",\
        "balance": "525111"\
      }\
    ]
  }
}

```

##### ValidatorUnbondingDelegations [​](https://docs.cosmos.network/v0.50/build/modules/staking#validatorunbondingdelegations-1 "Direct link to ValidatorUnbondingDelegations")

The `ValidatorUnbondingDelegations` REST endpoint queries unbonding delegations of a validator.

```codeBlockLines_e6Vv
/cosmos/staking/v1beta1/validators/{validatorAddr}/unbonding_delegations

```

Example:

```codeBlockLines_e6Vv
curl -X GET \
"http://localhost:1317/cosmos/staking/v1beta1/validators/cosmosvaloper13v4spsah85ps4vtrw07vzea37gq5la5gktlkeu/unbonding_delegations" \
-H  "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "unbonding_responses": [\
    {\
      "delegator_address": "cosmos1q9snn84jfrd9ge8t46kdcggpe58dua82vnj7uy",\
      "validator_address": "cosmosvaloper13v4spsah85ps4vtrw07vzea37gq5la5gktlkeu",\
      "entries": [\
        {\
          "creation_height": "90998",\
          "completion_time": "2021-11-05T00:14:37.005841058Z",\
          "initial_balance": "24000000",\
          "balance": "24000000"\
        }\
      ]\
    },\
    {\
      "delegator_address": "cosmos1qf36e6wmq9h4twhdvs6pyq9qcaeu7ye0s3dqq2",\
      "validator_address": "cosmosvaloper13v4spsah85ps4vtrw07vzea37gq5la5gktlkeu",\
      "entries": [\
        {\
          "creation_height": "47478",\
          "completion_time": "2021-11-01T22:47:26.714116854Z",\
          "initial_balance": "8000000",\
          "balance": "8000000"\
        }\
      ]\
    }\
  ],
  "pagination": {
    "next_key": null,
    "total": "2"
  }
}

```

---

## `x/upgrade`

### Abstract [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#abstract "Direct link to Abstract")

`x/upgrade` is an implementation of a Cosmos SDK module that facilitates smoothly<br/>
upgrading a live Cosmos chain to a new (breaking) software version. It accomplishes this by<br/>
providing a `PreBlocker` hook that prevents the blockchain state machine from<br/>
proceeding once a pre-defined upgrade block height has been reached.

The module does not prescribe anything regarding how governance decides to do an<br/>
upgrade, but just the mechanism for coordinating the upgrade safely. Without software<br/>
support for upgrades, upgrading a live chain is risky because all of the validators<br/>
need to pause their state machines at exactly the same point in the process. If<br/>
this is not done correctly, there can be state inconsistencies which are hard to<br/>
recover from.

- [Concepts](https://docs.cosmos.network/v0.50/build/modules/upgrade#concepts)
- [State](https://docs.cosmos.network/v0.50/build/modules/upgrade#state)
- [Events](https://docs.cosmos.network/v0.50/build/modules/upgrade#events)
- [Client](https://docs.cosmos.network/v0.50/build/modules/upgrade#client)
  - [CLI](https://docs.cosmos.network/v0.50/build/modules/upgrade#cli)
  - [REST](https://docs.cosmos.network/v0.50/build/modules/upgrade#rest)
  - [gRPC](https://docs.cosmos.network/v0.50/build/modules/upgrade#grpc)
- [Resources](https://docs.cosmos.network/v0.50/build/modules/upgrade#resources)

### Concepts [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#concepts "Direct link to Concepts")

#### Plan [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#plan "Direct link to Plan")

The `x/upgrade` module defines a `Plan` type in which a live upgrade is scheduled<br/>
to occur. A `Plan` can be scheduled at a specific block height.<br/>
A `Plan` is created once a (frozen) release candidate along with an appropriate upgrade<br/>
`Handler` (see below) is agreed upon, where the `Name` of a `Plan` corresponds to a<br/>
specific `Handler`. Typically, a `Plan` is created through a governance proposal<br/>
process, where if voted upon and passed, will be scheduled. The `Info` of a `Plan`<br/>
may contain various metadata about the upgrade, typically application specific<br/>
upgrade info to be included on-chain such as a git commit that validators could<br/>
automatically upgrade to.

```codeBlockLines_e6Vv
type Plan struct {
  Name   string
  Height int64
  Info   string
}

```

##### Sidecar Process [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#sidecar-process "Direct link to Sidecar Process")

If an operator running the application binary also runs a sidecar process to assist<br/>
in the automatic download and upgrade of a binary, the `Info` allows this process to<br/>
be seamless. This tool is [Cosmovisor](https://github.com/cosmos/cosmos-sdk/tree/main/tools/cosmovisor#readme).

#### Handler [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#handler "Direct link to Handler")

The `x/upgrade` module facilitates upgrading from major version X to major version Y. To<br/>
accomplish this, node operators must first upgrade their current binary to a new<br/>
binary that has a corresponding `Handler` for the new version Y. It is assumed that<br/>
this version has fully been tested and approved by the community at large. This<br/>
`Handler` defines what state migrations need to occur before the new binary Y<br/>
can successfully run the chain. Naturally, this `Handler` is application specific<br/>
and not defined on a per-module basis. Registering a `Handler` is done via<br/>
`Keeper#SetUpgradeHandler` in the application.

```codeBlockLines_e6Vv
type UpgradeHandler func(Context, Plan, VersionMap) (VersionMap, error)

```

During each `EndBlock` execution, the `x/upgrade` module checks if there exists a<br/>
`Plan` that should execute (is scheduled at that height). If so, the corresponding<br/>
`Handler` is executed. If the `Plan` is expected to execute but no `Handler` is registered<br/>
or if the binary was upgraded too early, the node will gracefully panic and exit.

#### StoreLoader [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#storeloader "Direct link to StoreLoader")

The `x/upgrade` module also facilitates store migrations as part of the upgrade. The<br/>
`StoreLoader` sets the migrations that need to occur before the new binary can<br/>
successfully run the chain. This `StoreLoader` is also application specific and<br/>
not defined on a per-module basis. Registering this `StoreLoader` is done via<br/>
`app#SetStoreLoader` in the application.

```codeBlockLines_e6Vv
func UpgradeStoreLoader (upgradeHeight int64, storeUpgrades *store.StoreUpgrades) baseapp.StoreLoader

```

If there's a planned upgrade and the upgrade height is reached, the old binary writes `Plan` to the disk before panicking.

This information is critical to ensure the `StoreUpgrades` happens smoothly at correct height and<br/>
expected upgrade. It eliminiates the chances for the new binary to execute `StoreUpgrades` multiple<br/>
times every time on restart. Also if there are multiple upgrades planned on same height, the `Name`<br/>
will ensure these `StoreUpgrades` takes place only in planned upgrade handler.

#### Proposal [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#proposal "Direct link to Proposal")

Typically, a `Plan` is proposed and submitted through governance via a proposal<br/>
containing a `MsgSoftwareUpgrade` message.<br/>
This proposal prescribes to the standard governance process. If the proposal passes,<br/>
the `Plan`, which targets a specific `Handler`, is persisted and scheduled. The<br/>
upgrade can be delayed or hastened by updating the `Plan.Height` in a new proposal.

proto/cosmos/upgrade/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgSoftwareUpgrade is the Msg/SoftwareUpgrade request type.
//
// Since: cosmos-sdk 0.46
message MsgSoftwareUpgrade {
  option (cosmos.msg.v1.signer) = "authority";
  option (amino.name)           = "cosmos-sdk/MsgSoftwareUpgrade";

  // authority is the address that controls the module (defaults to x/gov unless overwritten).
  string authority = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

  // plan is the upgrade plan.
  Plan plan = 2 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/upgrade/v1beta1/tx.proto#L29-L41)

##### Cancelling Upgrade Proposals [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#cancelling-upgrade-proposals "Direct link to Cancelling Upgrade Proposals")

Upgrade proposals can be cancelled. There exists a gov-enabled `MsgCancelUpgrade`<br/>
message type, which can be embedded in a proposal, voted on and, if passed, will<br/>
remove the scheduled upgrade `Plan`.<br/>
Of course this requires that the upgrade was known to be a bad idea well before the<br/>
upgrade itself, to allow time for a vote.

proto/cosmos/upgrade/v1beta1/tx.proto

```codeBlockLines_e6Vv
// MsgCancelUpgrade is the Msg/CancelUpgrade request type.
//
// Since: cosmos-sdk 0.46
message MsgCancelUpgrade {
  option (cosmos.msg.v1.signer) = "authority";
  option (amino.name)           = "cosmos-sdk/MsgCancelUpgrade";

  // authority is the address that controls the module (defaults to x/gov unless overwritten).
  string authority = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0-rc1/proto/cosmos/upgrade/v1beta1/tx.proto#L48-L57)

If such a possibility is desired, the upgrade height is to be<br/>
`2 * (VotingPeriod + DepositPeriod) + (SafetyDelta)` from the beginning of the<br/>
upgrade proposal. The `SafetyDelta` is the time available from the success of an<br/>
upgrade proposal and the realization it was a bad idea (due to external social consensus).

A `MsgCancelUpgrade` proposal can also be made while the original<br/>
`MsgSoftwareUpgrade` proposal is still being voted upon, as long as the `VotingPeriod`<br/>
ends after the `MsgSoftwareUpgrade` proposal.

### State [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#state "Direct link to State")

The internal state of the `x/upgrade` module is relatively minimal and simple. The<br/>
state contains the currently active upgrade `Plan` (if one exists) by key<br/>
`0x0` and if a `Plan` is marked as "done" by key `0x1`. The state<br/>
contains the consensus versions of all app modules in the application. The versions<br/>
are stored as big endian `uint64`, and can be accessed with prefix `0x2` appended<br/>
by the corresponding module name of type `string`. The state maintains a<br/>
`Protocol Version` which can be accessed by key `0x3`.

- Plan: `0x0 -> Plan`
- Done: `0x1 | byte(plan name)  -> BigEndian(Block Height)`
- ConsensusVersion: `0x2 | byte(module name)  -> BigEndian(Module Consensus Version)`
- ProtocolVersion: `0x3 -> BigEndian(Protocol Version)`

The `x/upgrade` module contains no genesis state.

### Events [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#events "Direct link to Events")

The `x/upgrade` does not emit any events by itself. Any and all proposal related<br/>
events are emitted through the `x/gov` module.

### Client [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#client "Direct link to Client")

#### CLI [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#cli "Direct link to CLI")

A user can query and interact with the `upgrade` module using the CLI.

##### Query [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#query "Direct link to Query")

The `query` commands allow users to query `upgrade` state.

```codeBlockLines_e6Vv
simd query upgrade --help

```

###### Applied [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#applied "Direct link to applied")

The `applied` command allows users to query the block header for height at which a completed upgrade was applied.

```codeBlockLines_e6Vv
simd query upgrade applied [upgrade-name] [flags]

```

If upgrade-name was previously executed on the chain, this returns the header for the block at which it was applied.<br/>
This helps a client determine which binary was valid over a given range of blocks, as well as more context to understand past migrations.

Example:

```codeBlockLines_e6Vv
simd query upgrade applied "test-upgrade"

```

Example Output:

```codeBlockLines_e6Vv
"block_id": {
    "hash": "A769136351786B9034A5F196DC53F7E50FCEB53B48FA0786E1BFC45A0BB646B5",
    "parts": {
      "total": 1,
      "hash": "B13CBD23011C7480E6F11BE4594EE316548648E6A666B3575409F8F16EC6939E"
    }
  },
  "block_size": "7213",
  "header": {
    "version": {
      "block": "11"
    },
    "chain_id": "testnet-2",
    "height": "455200",
    "time": "2021-04-10T04:37:57.085493838Z",
    "last_block_id": {
      "hash": "0E8AD9309C2DC411DF98217AF59E044A0E1CCEAE7C0338417A70338DF50F4783",
      "parts": {
        "total": 1,
        "hash": "8FE572A48CD10BC2CBB02653CA04CA247A0F6830FF19DC972F64D339A355E77D"
      }
    },
    "last_commit_hash": "DE890239416A19E6164C2076B837CC1D7F7822FC214F305616725F11D2533140",
    "data_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    "validators_hash": "A31047ADE54AE9072EE2A12FF260A8990BA4C39F903EAF5636B50D58DBA72582",
    "next_validators_hash": "A31047ADE54AE9072EE2A12FF260A8990BA4C39F903EAF5636B50D58DBA72582",
    "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
    "app_hash": "28ECC486AFC332BA6CC976706DBDE87E7D32441375E3F10FD084CD4BAF0DA021",
    "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    "proposer_address": "2ABC4854B1A1C5AA8403C4EA853A81ACA901CC76"
  },
  "num_txs": "0"
}

```

###### Module Versions [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#module-versions "Direct link to module versions")

The `module_versions` command gets a list of module names and their respective consensus versions.

Following the command with a specific module name will return only<br/>
that module's information.

```codeBlockLines_e6Vv
simd query upgrade module_versions [optional module_name] [flags]

```

Example:

```codeBlockLines_e6Vv
simd query upgrade module_versions

```

Example Output:

```codeBlockLines_e6Vv
module_versions:
- name: auth
  version: "2"
- name: authz
  version: "1"
- name: bank
  version: "2"
- name: crisis
  version: "1"
- name: distribution
  version: "2"
- name: evidence
  version: "1"
- name: feegrant
  version: "1"
- name: genutil
  version: "1"
- name: gov
  version: "2"
- name: ibc
  version: "2"
- name: mint
  version: "1"
- name: params
  version: "1"
- name: slashing
  version: "2"
- name: staking
  version: "2"
- name: transfer
  version: "1"
- name: upgrade
  version: "1"
- name: vesting
  version: "1"

```

Example:

```codeBlockLines_e6Vv
regen query upgrade module_versions ibc

```

Example Output:

```codeBlockLines_e6Vv
module_versions:
- name: ibc
  version: "2"

```

###### Plan [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#plan-1 "Direct link to plan")

The `plan` command gets the currently scheduled upgrade plan, if one exists.

```codeBlockLines_e6Vv
regen query upgrade plan [flags]

```

Example:

```codeBlockLines_e6Vv
simd query upgrade plan

```

Example Output:

```codeBlockLines_e6Vv
height: "130"
info: ""
name: test-upgrade
time: "0001-01-01T00:00:00Z"
upgraded_client_state: null

```

##### Transactions [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#transactions "Direct link to Transactions")

The upgrade module supports the following transactions:

- `software-proposal` \- submits an upgrade proposal:

```codeBlockLines_e6Vv
simd tx upgrade software-upgrade v2 --title="Test Proposal" --summary="testing" --deposit="100000000stake" --upgrade-height 1000000 \
--upgrade-info '{ "binaries": { "linux/amd64":"https://example.com/simd.zip?checksum=sha256:aec070645fe53ee3b3763059376134f058cc337247c978add178b6ccdfb0019f" } }' --from cosmos1..

```

- `cancel-software-upgrade` \- cancels a previously submitted upgrade proposal:

```codeBlockLines_e6Vv
simd tx upgrade cancel-software-upgrade --title="Test Proposal" --summary="testing" --deposit="100000000stake" --from cosmos1..

```

#### REST [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#rest "Direct link to REST")

A user can query the `upgrade` module using REST endpoints.

##### Applied Plan [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#applied-plan "Direct link to Applied Plan")

`AppliedPlan` queries a previously applied upgrade plan by its name.

```codeBlockLines_e6Vv
/cosmos/upgrade/v1beta1/applied_plan/{name}

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/upgrade/v1beta1/applied_plan/v2.0-upgrade" -H "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "height": "30"
}

```

##### Current Plan [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#current-plan "Direct link to Current Plan")

`CurrentPlan` queries the current upgrade plan.

```codeBlockLines_e6Vv
/cosmos/upgrade/v1beta1/current_plan

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/upgrade/v1beta1/current_plan" -H "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "plan": "v2.1-upgrade"
}

```

##### Module Versions [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#module-versions-1 "Direct link to Module versions")

`ModuleVersions` queries the list of module versions from state.

```codeBlockLines_e6Vv
/cosmos/upgrade/v1beta1/module_versions

```

Example:

```codeBlockLines_e6Vv
curl -X GET "http://localhost:1317/cosmos/upgrade/v1beta1/module_versions" -H "accept: application/json"

```

Example Output:

```codeBlockLines_e6Vv
{
  "module_versions": [\
    {\
      "name": "auth",\
      "version": "2"\
    },\
    {\
      "name": "authz",\
      "version": "1"\
    },\
    {\
      "name": "bank",\
      "version": "2"\
    },\
    {\
      "name": "crisis",\
      "version": "1"\
    },\
    {\
      "name": "distribution",\
      "version": "2"\
    },\
    {\
      "name": "evidence",\
      "version": "1"\
    },\
    {\
      "name": "feegrant",\
      "version": "1"\
    },\
    {\
      "name": "genutil",\
      "version": "1"\
    },\
    {\
      "name": "gov",\
      "version": "2"\
    },\
    {\
      "name": "ibc",\
      "version": "2"\
    },\
    {\
      "name": "mint",\
      "version": "1"\
    },\
    {\
      "name": "params",\
      "version": "1"\
    },\
    {\
      "name": "slashing",\
      "version": "2"\
    },\
    {\
      "name": "staking",\
      "version": "2"\
    },\
    {\
      "name": "transfer",\
      "version": "1"\
    },\
    {\
      "name": "upgrade",\
      "version": "1"\
    },\
    {\
      "name": "vesting",\
      "version": "1"\
    }\
  ]
}

```

#### gRPC [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#grpc "Direct link to gRPC")

A user can query the `upgrade` module using gRPC endpoints.

##### Applied Plan [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#applied-plan-1 "Direct link to Applied Plan")

`AppliedPlan` queries a previously applied upgrade plan by its name.

```codeBlockLines_e6Vv
cosmos.upgrade.v1beta1.Query/AppliedPlan

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext \
    -d '{"name":"v2.0-upgrade"}' \
    localhost:9090 \
    cosmos.upgrade.v1beta1.Query/AppliedPlan

```

Example Output:

```codeBlockLines_e6Vv
{
  "height": "30"
}

```

##### Current Plan [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#current-plan-1 "Direct link to Current Plan")

`CurrentPlan` queries the current upgrade plan.

```codeBlockLines_e6Vv
cosmos.upgrade.v1beta1.Query/CurrentPlan

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.slashing.v1beta1.Query/CurrentPlan

```

Example Output:

```codeBlockLines_e6Vv
{
  "plan": "v2.1-upgrade"
}

```

##### Module Versions [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#module-versions-2 "Direct link to Module versions")

`ModuleVersions` queries the list of module versions from state.

```codeBlockLines_e6Vv
cosmos.upgrade.v1beta1.Query/ModuleVersions

```

Example:

```codeBlockLines_e6Vv
grpcurl -plaintext localhost:9090 cosmos.slashing.v1beta1.Query/ModuleVersions

```

Example Output:

```codeBlockLines_e6Vv
{
  "module_versions": [\
    {\
      "name": "auth",\
      "version": "2"\
    },\
    {\
      "name": "authz",\
      "version": "1"\
    },\
    {\
      "name": "bank",\
      "version": "2"\
    },\
    {\
      "name": "crisis",\
      "version": "1"\
    },\
    {\
      "name": "distribution",\
      "version": "2"\
    },\
    {\
      "name": "evidence",\
      "version": "1"\
    },\
    {\
      "name": "feegrant",\
      "version": "1"\
    },\
    {\
      "name": "genutil",\
      "version": "1"\
    },\
    {\
      "name": "gov",\
      "version": "2"\
    },\
    {\
      "name": "ibc",\
      "version": "2"\
    },\
    {\
      "name": "mint",\
      "version": "1"\
    },\
    {\
      "name": "params",\
      "version": "1"\
    },\
    {\
      "name": "slashing",\
      "version": "2"\
    },\
    {\
      "name": "staking",\
      "version": "2"\
    },\
    {\
      "name": "transfer",\
      "version": "1"\
    },\
    {\
      "name": "upgrade",\
      "version": "1"\
    },\
    {\
      "name": "vesting",\
      "version": "1"\
    }\
  ]
}

```

### Resources [​](https://docs.cosmos.network/v0.50/build/modules/upgrade#resources "Direct link to Resources")

A list of (external) resources to learn more about the `x/upgrade` module.

- [Cosmos Dev Series: Cosmos Blockchain Upgrade](https://medium.com/web3-surfers/cosmos-dev-series-cosmos-sdk-based-blockchain-upgrade-b5e99181554c) \- The blog post that explains how software upgrades work in detail.
