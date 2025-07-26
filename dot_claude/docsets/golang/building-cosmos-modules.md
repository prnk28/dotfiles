---
tags:
  - "#blockchain-development"
  - "#cosmos-sdk"
  - "#module-development"
  - "#architecture"
  - "#software-design"
  - "#module-patterns"
  - "#dependency-injection"
  - "#state-management"
---
# Begin:End Blockers

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/learn)** (v0.52).

Version: v0.50

On this page

# BeginBlocker and EndBlocker

Synopsis

`BeginBlocker` and `EndBlocker` are optional methods module developers can implement in their module. They will be triggered at the beginning and at the end of each block respectively, when the [`BeginBlock`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#beginblock) and [`EndBlock`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#endblock) ABCI messages are received from the underlying consensus engine.

Pre-requisite Readings

- [Module Manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager)

## BeginBlocker and EndBlocker [​](https://docs.cosmos.network/v0.50/build/building-modules/beginblock-endblock#beginblocker-and-endblocker-1 "Direct link to BeginBlocker and EndBlocker")

`BeginBlocker` and `EndBlocker` are a way for module developers to add automatic execution of logic to their module. This is a powerful tool that should be used carefully, as complex automatic functions can slow down or even halt the chain.

In 0.47.0, Prepare and Process Proposal were added that allow app developers to do arbitrary work at those phases, but they do not influence the work that will be done in BeginBlock. If an application required `BeginBlock` to execute prior to any sort of work is done then this is not possible today (0.50.0).

When needed, `BeginBlocker` and `EndBlocker` are implemented as part of the [`HasBeginBlocker`, `HasABCIEndBlocker` and `EndBlocker` interfaces](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodule). This means either can be left-out if not required. The `BeginBlock` and `EndBlock` methods of the interface implemented in `module.go` generally defer to `BeginBlocker` and `EndBlocker` methods respectively, which are usually implemented in `abci.go`.

The actual implementation of `BeginBlocker` and `EndBlocker` in `abci.go` are very similar to that of a [`Msg` service](https://docs.cosmos.network/v0.50/build/building-modules/msg-services):

- They generally use the [`keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper) and [`ctx`](https://docs.cosmos.network/v0.50/learn/advanced/context) to retrieve information about the latest state.
- If needed, they use the `keeper` and `ctx` to trigger state-transitions.
- If needed, they can emit [`events`](https://docs.cosmos.network/v0.50/learn/advanced/events) via the `ctx`'s `EventManager`.

A specific type of `EndBlocker` is available to return validator updates to the underlying consensus engine in the form of an [`[]abci.ValidatorUpdates`](https://docs.cometbft.com/v0.37/spec/abci/abci++_methods#endblock). This is the preferred way to implement custom validator changes.

It is possible for developers to define the order of execution between the `BeginBlocker`/ `EndBlocker` functions of each of their application's modules via the module's manager `SetOrderBeginBlocker`/ `SetOrderEndBlocker` methods. For more on the module manager, click [here](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#manager).

See an example implementation of `BeginBlocker` from the `distribution` module:

x/distribution/abci.go

```codeBlockLines_e6Vv
func BeginBlocker(ctx sdk.Context, k keeper.Keeper) error {
	defer telemetry.ModuleMeasureSince(types.ModuleName, time.Now(), telemetry.MetricKeyBeginBlocker)

	// determine the total power signing the block
	var previousTotalPower int64
	for _, voteInfo := range ctx.VoteInfos() {
		previousTotalPower += voteInfo.Validator.Power
	}

	// TODO this is Tendermint-dependent
	// ref https://github.com/cosmos/cosmos-sdk/issues/3095
	if ctx.BlockHeight() > 1 {
		k.AllocateTokens(ctx, previousTotalPower, ctx.VoteInfos())
	}

	// record the proposer for when we payout on the next block
	consAddr := sdk.ConsAddress(ctx.BlockHeader().ProposerAddress)
	k.SetPreviousProposerConsAddr(ctx, consAddr)
	return nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/distribution/abci.go#L14-L38)

and an example implementation of `EndBlocker` from the `staking` module:

x/staking/keeper/abci.go

```codeBlockLines_e6Vv
func (k *Keeper) EndBlocker(ctx context.Context) ([]abci.ValidatorUpdate, error) {
	defer telemetry.ModuleMeasureSince(types.ModuleName, time.Now(), telemetry.MetricKeyEndBlocker)

	return k.BlockValidatorUpdates(sdk.UnwrapSDKContext(ctx)), nil
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/staking/keeper/abci.go#L22-L27)

- [BeginBlocker and EndBlocker](https://docs.cosmos.network/v0.50/build/building-modules/beginblock-endblock#beginblocker-and-endblocker-1)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=r8p1av78ccf0)

### Depinject

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/depinject#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/depinject)** (v0.52).

Version: v0.50

On this page

# Modules Depinject-ready

Pre-requisite Readings

- [Depinject Documentation](https://docs.cosmos.network/v0.50/build/packages/depinject)

[`depinject`](https://docs.cosmos.network/v0.50/build/packages/depinject) is used to wire any module in `app.go`.<br/>
All core modules are already configured to support dependency injection.

To work with `depinject` a module must define its configuration and requirements so that `depinject` can provide the right dependencies.

In brief, as a module developer, the following steps are required:

1. Define the module configuration using Protobuf
2. Define the module dependencies in `x/{moduleName}/module.go`

A chain developer can then use the module by following these two steps:

1. Configure the module in `app_config.go` or `app.yaml`
2. Inject the module in `app.go`

## Module Configuration [​](https://docs.cosmos.network/v0.50/build/building-modules/depinject#module-configuration "Direct link to Module Configuration")

The module available configuration is defined in a Protobuf file, located at `{moduleName}/module/v1/module.proto`.

proto/cosmos/group/module/v1/module.proto

```codeBlockLines_e6Vv
syntax = "proto3";

package cosmos.group.module.v1;

import "cosmos/app/v1alpha1/module.proto";
import "gogoproto/gogo.proto";
import "google/protobuf/duration.proto";
import "amino/amino.proto";

// Module is the config object of the group module.
message Module {
  option (cosmos.app.v1alpha1.module) = {
    go_import: "github.com/cosmos/cosmos-sdk/x/group"
  };

  // max_execution_period defines the max duration after a proposal's voting period ends that members can send a MsgExec
  // to execute the proposal.
  google.protobuf.Duration max_execution_period = 1
      [(gogoproto.stdduration) = true, (gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // max_metadata_len defines the max length of the metadata bytes field for various entities within the group module.
  // Defaults to 255 if not explicitly set.
  uint64 max_metadata_len = 2;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/proto/cosmos/group/module/v1/module.proto)

- `go_import` must point to the Go package of the custom module.
- Message fields define the module configuration.<br/>
  That configuration can be set in the `app_config.go` / `app.yaml` file for a chain developer to configure the module.

Taking `group` as example, a chain developer is able to decide, thanks to `uint64 max_metadata_len`, what the maximum metadata length allowed for a group proposal is.

simapp/app_config.go

```codeBlockLines_e6Vv
{
  	Name: group.ModuleName,
  	Config: appconfig.WrapAny(&groupmodulev1.Module{
  		MaxExecutionPeriod: durationpb.New(time.Second * 1209600),
  		MaxMetadataLen:     255,
  	}),
},

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/simapp/app_config.go#L228-L234)

That message is generated using [`pulsar`](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/scripts/protocgen-pulsar.sh) (by running `make proto-gen`).<br/>
In the case of the `group` module, this file is generated here: [https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/api/cosmos/group/module/v1/module.pulsar.go](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/api/cosmos/group/module/v1/module.pulsar.go).

The part that is relevant for the module configuration is:

api/cosmos/group/module/v1/module.pulsar.go

```codeBlockLines_e6Vv
// Module is the config object of the group module.
type Module struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// max_execution_period defines the max duration after a proposal's voting period ends that members can send a MsgExec
	// to execute the proposal.
	MaxExecutionPeriod *durationpb.Duration `protobuf:"bytes,1,opt,name=max_execution_period,json=maxExecutionPeriod,proto3" json:"max_execution_period,omitempty"`
	// max_metadata_len defines the max length of the metadata bytes field for various entities within the group module.
	// Defaults to 255 if not explicitly set.
	MaxMetadataLen uint64 `protobuf:"varint,2,opt,name=max_metadata_len,json=maxMetadataLen,proto3" json:"max_metadata_len,omitempty"`
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/api/cosmos/group/module/v1/module.pulsar.go#L515-L527)

note

Pulsar is optional. The official [`protoc-gen-go`](https://developers.google.com/protocol-buffers/docs/reference/go-generated) can be used as well.

## Dependency Definition [​](https://docs.cosmos.network/v0.50/build/building-modules/depinject#dependency-definition "Direct link to Dependency Definition")

Once the configuration proto is defined, the module's `module.go` must define what dependencies are required by the module.<br/>
The boilerplate is similar for all modules.

danger

All methods, structs and their fields must be public for `depinject`.

1. Import the module configuration generated package:

x/group/module/module.go

```codeBlockLines_e6Vv
modulev1 "cosmossdk.io/api/cosmos/group/module/v1"
"cosmossdk.io/core/address"
"cosmossdk.io/core/appmodule"

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/group/module/module.go#L12-L14)

Define an `init()` function for defining the `providers` of the module configuration:

This registers the module configuration message and the wiring of the module.

x/group/module/module.go

```codeBlockLines_e6Vv
func init() {
   	appmodule.Register(
   		&modulev1.Module{},
   		appmodule.Provide(ProvideModule),
   	)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/group/module/module.go#L194-L199)

2. Ensure that the module implements the `appmodule.AppModule` interface:

x/group/module/module.go

```codeBlockLines_e6Vv
var _ appmodule.AppModule = AppModule{}

// IsOnePerModuleType implements the depinject.OnePerModuleType interface.
func (am AppModule) IsOnePerModuleType() {}

// IsAppModule implements the appmodule.AppModule interface.
func (am AppModule) IsAppModule() {}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.47.0/x/group/module/module.go#L58-L64)

3. Define a struct that inherits `depinject.In` and define the module inputs (i.e. module dependencies):

   - `depinject` provides the right dependencies to the module.
   - `depinject` also checks that all dependencies are provided.

     tip

     For making a dependency optional, add the `optional:"true"` struct tag.

     x/group/module/module.go

     ```codeBlockLines_e6Vv
     type GroupInputs struct {
     	depinject.In

     	Config           *modulev1.Module
     	Key              *store.KVStoreKey
     	Cdc              codec.Codec
     	AccountKeeper    group.AccountKeeper
     	BankKeeper       group.BankKeeper
     	Registry         cdctypes.InterfaceRegistry
     	MsgServiceRouter baseapp.MessageRouter
     }

     ```

     [See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/group/module/module.go#L201-L211)

4. Define the module outputs with a public struct that inherits `depinject.Out`:<br/>
   The module outputs are the dependencies that the module provides to other modules. It is usually the module itself and its keeper.

x/group/module/module.go

```codeBlockLines_e6Vv
type GroupOutputs struct {
   	depinject.Out

   	GroupKeeper keeper.Keeper
   	Module      appmodule.AppModule
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/group/module/module.go#L213-L218)

5. Create a function named `ProvideModule` (as called in 1.) and use the inputs for instantiating the module outputs.

x/group/module/module.go

```codeBlockLines_e6Vv
func ProvideModule(in GroupInputs) GroupOutputs {
   	/*
   		Example of setting group params:
   		in.Config.MaxMetadataLen = 1000
   		in.Config.MaxExecutionPeriod = "1209600s"
   	*/

   	k := keeper.NewKeeper(in.Key, in.Cdc, in.MsgServiceRouter, in.AccountKeeper, group.Config{MaxExecutionPeriod: in.Config.MaxExecutionPeriod.AsDuration(), MaxMetadataLen: in.Config.MaxMetadataLen})
   	m := NewAppModule(in.Cdc, k, in.AccountKeeper, in.BankKeeper, in.Registry)
   	return GroupOutputs{GroupKeeper: k, Module: m}
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/group/module/module.go#L220-L235)

The `ProvideModule` function should return an instance of `cosmossdk.io/core/appmodule.AppModule` which implements<br/>
one or more app module extension interfaces for initializing the module.

Following is the complete app wiring configuration for `group`:

x/group/module/module.go

```codeBlockLines_e6Vv
func init() {
	appmodule.Register(
		&modulev1.Module{},
		appmodule.Provide(ProvideModule),
	)
}

type GroupInputs struct {
	depinject.In

	Config           *modulev1.Module
	Key              *store.KVStoreKey
	Cdc              codec.Codec
	AccountKeeper    group.AccountKeeper
	BankKeeper       group.BankKeeper
	Registry         cdctypes.InterfaceRegistry
	MsgServiceRouter baseapp.MessageRouter
}

type GroupOutputs struct {
	depinject.Out

	GroupKeeper keeper.Keeper
	Module      appmodule.AppModule
}

func ProvideModule(in GroupInputs) GroupOutputs {
	/*
		Example of setting group params:
		in.Config.MaxMetadataLen = 1000
		in.Config.MaxExecutionPeriod = "1209600s"
	*/

	k := keeper.NewKeeper(in.Key, in.Cdc, in.MsgServiceRouter, in.AccountKeeper, group.Config{MaxExecutionPeriod: in.Config.MaxExecutionPeriod.AsDuration(), MaxMetadataLen: in.Config.MaxMetadataLen})
	m := NewAppModule(in.Cdc, k, in.AccountKeeper, in.BankKeeper, in.Registry)
	return GroupOutputs{GroupKeeper: k, Module: m}
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/group/module/module.go#L194-L235)

The module is now ready to be used with `depinject` by a chain developer.

## Integrate in an Application [​](https://docs.cosmos.network/v0.50/build/building-modules/depinject#integrate-in-an-application "Direct link to Integrate in an application")

The App Wiring is done in `app_config.go` / `app.yaml` and `app_v2.go` and is explained in detail in the [overview of `app_v2.go`](https://docs.cosmos.network/v0.50/build/building-apps/app-go-v2).

- [Module Configuration](https://docs.cosmos.network/v0.50/build/building-modules/depinject#module-configuration)
- [Dependency Definition](https://docs.cosmos.network/v0.50/build/building-modules/depinject#dependency-definition)
- [Integrate in an application](https://docs.cosmos.network/v0.50/build/building-modules/depinject#integrate-in-an-application)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=c7ftc98av9tp)

### Errors

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/errors#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/errors)** (v0.52).

Version: v0.50

On this page

# Errors

Synopsis

This document outlines the recommended usage and APIs for error handling in Cosmos SDK modules.

Modules are encouraged to define and register their own errors to provide better<br/>
context on failed message or handler execution. Typically, these errors should be<br/>
common or general errors which can be further wrapped to provide additional specific<br/>
execution context.

## Registration [​](https://docs.cosmos.network/v0.50/build/building-modules/errors#registration "Direct link to Registration")

Modules should define and register their custom errors in `x/{module}/errors.go`.<br/>
Registration of errors is handled via the [`errors` package](https://github.com/cosmos/cosmos-sdk/blob/main/errors/errors.go).

Example:

x/distribution/types/errors.go

```codeBlockLines_e6Vv
package types

import "cosmossdk.io/errors"

// x/distribution module sentinel errors
var (
	ErrEmptyDelegatorAddr      = errors.Register(ModuleName, 2, "delegator address is empty")
	ErrEmptyWithdrawAddr       = errors.Register(ModuleName, 3, "withdraw address is empty")
	ErrEmptyValidatorAddr      = errors.Register(ModuleName, 4, "validator address is empty")
	ErrEmptyDelegationDistInfo = errors.Register(ModuleName, 5, "no delegation distribution info")
	ErrNoValidatorDistInfo     = errors.Register(ModuleName, 6, "no validator distribution info")
	ErrNoValidatorCommission   = errors.Register(ModuleName, 7, "no validator commission to withdraw")
	ErrSetWithdrawAddrDisabled = errors.Register(ModuleName, 8, "set withdraw address disabled")
	ErrBadDistribution         = errors.Register(ModuleName, 9, "community pool does not have sufficient coins to distribute")
	ErrInvalidProposalAmount   = errors.Register(ModuleName, 10, "invalid community pool spend proposal amount")
	ErrEmptyProposalRecipient  = errors.Register(ModuleName, 11, "invalid community pool spend proposal recipient")
	ErrNoValidatorExists       = errors.Register(ModuleName, 12, "validator does not exist")
	ErrNoDelegationExists      = errors.Register(ModuleName, 13, "delegation does not exist")
)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/distribution/types/errors.go)

Each custom module error must provide the codespace, which is typically the module name<br/>
(e.g. "distribution") and is unique per module, and a uint32 code. Together, the codespace and code<br/>
provide a globally unique Cosmos SDK error. Typically, the code is monotonically increasing but does not<br/>
necessarily have to be. The only restrictions on error codes are the following:

- Must be greater than one, as a code value of one is reserved for internal errors.
- Must be unique within the module.

Note, the Cosmos SDK provides a core set of _common_ errors. These errors are defined in [`types/errors/errors.go`](https://github.com/cosmos/cosmos-sdk/blob/main/types/errors/errors.go).

## Wrapping [​](https://docs.cosmos.network/v0.50/build/building-modules/errors#wrapping "Direct link to Wrapping")

The custom module errors can be returned as their concrete type as they already fulfill the `error`<br/>
interface. However, module errors can be wrapped to provide further context and meaning to failed<br/>
execution.

Example:

x/bank/keeper/keeper.go

```codeBlockLines_e6Vv
// address to a ModuleAccount address. If any of the delegation amounts are negative,
// an error is returned.
func (k BaseKeeper) DelegateCoins(ctx context.Context, delegatorAddr, moduleAccAddr sdk.AccAddress, amt sdk.Coins) error {
	moduleAcc := k.ak.GetAccount(ctx, moduleAccAddr)
	if moduleAcc == nil {
		return errorsmod.Wrapf(sdkerrors.ErrUnknownAddress, "module account %s does not exist", moduleAccAddr)
	}

	if !amt.IsValid() {
		return errorsmod.Wrap(sdkerrors.ErrInvalidCoins, amt.String())
	}

	balances := sdk.NewCoins()

	for _, coin := range amt {
		balance := k.GetBalance(ctx, delegatorAddr, coin.GetDenom())
		if balance.IsLT(coin) {
			return errorsmod.Wrapf(
				sdkerrors.ErrInsufficientFunds, "failed to delegate; %s is smaller than %s", balance, amt,
			)
		}

		balances = balances.Add(balance)
		err := k.setBalance(ctx, delegatorAddr, balance.Sub(coin))
		if err != nil {
			return err
		}
	}

	if err := k.trackDelegation(ctx, delegatorAddr, balances, amt); err != nil {
		return errorsmod.Wrap(err, "failed to track delegation")
	}
	// emit coin spent event
	sdkCtx := sdk.UnwrapSDKContext(ctx)
	sdkCtx.EventManager().EmitEvent(
		types.NewCoinSpentEvent(delegatorAddr, amt),
	)

	err := k.addCoins(ctx, moduleAccAddr, amt)
	if err != nil {
		return err
	}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/keeper/keeper.go#L141-L182)

Regardless if an error is wrapped or not, the Cosmos SDK's `errors` package provides a function to determine if<br/>
an error is of a particular kind via `Is`.

## ABCI [​](https://docs.cosmos.network/v0.50/build/building-modules/errors#abci "Direct link to ABCI")

If a module error is registered, the Cosmos SDK `errors` package allows ABCI information to be extracted<br/>
through the `ABCIInfo` function. The package also provides `ResponseCheckTx` and `ResponseDeliverTx` as<br/>
auxiliary functions to automatically get `CheckTx` and `DeliverTx` responses from an error.

- [Registration](https://docs.cosmos.network/v0.50/build/building-modules/errors#registration)
- [Wrapping](https://docs.cosmos.network/v0.50/build/building-modules/errors#wrapping)
- [ABCI](https://docs.cosmos.network/v0.50/build/building-modules/errors#abci)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=zfavk1aby5dp)

### Genesis

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/genesis#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/genesis)** (v0.52).

Version: v0.50

On this page

# Module Genesis

Synopsis

Modules generally handle a subset of the state and, as such, they need to define the related subset of the genesis file as well as methods to initialize, verify and export it.

Pre-requisite Readings

- [Module Manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager)
- [Keepers](https://docs.cosmos.network/v0.50/build/building-modules/keeper)

## Type Definition [​](https://docs.cosmos.network/v0.50/build/building-modules/genesis#type-definition "Direct link to Type Definition")

The subset of the genesis state defined from a given module is generally defined in a `genesis.proto` file ([more info](https://docs.cosmos.network/v0.50/learn/advanced/encoding#gogoproto) on how to define protobuf messages). The struct defining the module's subset of the genesis state is usually called `GenesisState` and contains all the module-related values that need to be initialized during the genesis process.

See an example of `GenesisState` protobuf message definition from the `auth` module:

proto/cosmos/auth/v1beta1/genesis.proto

```codeBlockLines_e6Vv
syntax = "proto3";
package cosmos.auth.v1beta1;

import "google/protobuf/any.proto";
import "gogoproto/gogo.proto";
import "cosmos/auth/v1beta1/auth.proto";
import "amino/amino.proto";

option go_package = "github.com/cosmos/cosmos-sdk/x/auth/types";

// GenesisState defines the auth module's genesis state.
message GenesisState {
  // params defines all the parameters of the module.
  Params params = 1 [(gogoproto.nullable) = false, (amino.dont_omitempty) = true];

  // accounts are the accounts present at genesis.
  repeated google.protobuf.Any accounts = 2;
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/proto/cosmos/auth/v1beta1/genesis.proto)

Next we present the main genesis-related methods that need to be implemented by module developers in order for their module to be used in Cosmos SDK applications.

### `DefaultGenesis` [​](https://docs.cosmos.network/v0.50/build/building-modules/genesis#defaultgenesis "Direct link to defaultgenesis")

The `DefaultGenesis()` method is a simple method that calls the constructor function for `GenesisState` with the default value for each parameter. See an example from the `auth` module:

x/auth/module.go

```codeBlockLines_e6Vv
// DefaultGenesis returns default genesis state as raw bytes for the auth
// module.
func (AppModuleBasic) DefaultGenesis(cdc codec.JSONCodec) json.RawMessage {
	return cdc.MustMarshalJSON(types.DefaultGenesisState())
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/auth/module.go#L63-L67)

### `ValidateGenesis` [​](https://docs.cosmos.network/v0.50/build/building-modules/genesis#validategenesis "Direct link to validategenesis")

The `ValidateGenesis(data GenesisState)` method is called to verify that the provided `genesisState` is correct. It should perform validity checks on each of the parameters listed in `GenesisState`. See an example from the `auth` module:

x/auth/types/genesis.go

```codeBlockLines_e6Vv
// ValidateGenesis performs basic validation of auth genesis data returning an
// error for any failed validation criteria.
func ValidateGenesis(data GenesisState) error {
	if err := data.Params.Validate(); err != nil {
		return err
	}

	genAccs, err := UnpackAccounts(data.Accounts)
	if err != nil {
		return err
	}

	return ValidateGenAccounts(genAccs)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/auth/types/genesis.go#L62-L75)

## Other Genesis Methods [​](https://docs.cosmos.network/v0.50/build/building-modules/genesis#other-genesis-methods "Direct link to Other Genesis Methods")

Other than the methods related directly to `GenesisState`, module developers are expected to implement two other methods as part of the [`AppModuleGenesis` interface](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulegenesis) (only if the module needs to initialize a subset of state in genesis). These methods are [`InitGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#initgenesis) and [`ExportGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#exportgenesis).

### `InitGenesis` [​](https://docs.cosmos.network/v0.50/build/building-modules/genesis#initgenesis "Direct link to initgenesis")

The `InitGenesis` method is executed during [`InitChain`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#initchain) when the application is first started. Given a `GenesisState`, it initializes the subset of the state managed by the module by using the module's [`keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper) setter function on each parameter within the `GenesisState`.

The [module manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#manager) of the application is responsible for calling the `InitGenesis` method of each of the application's modules in order. This order is set by the application developer via the manager's `SetOrderGenesisMethod`, which is called in the [application's constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).

See an example of `InitGenesis` from the `auth` module:

x/auth/keeper/genesis.go

```codeBlockLines_e6Vv
// InitGenesis - Init store state from genesis data
//
// CONTRACT: old coins from the FeeCollectionKeeper need to be transferred through
// a genesis port script to the new fee collector account
func (ak AccountKeeper) InitGenesis(ctx sdk.Context, data types.GenesisState) {
	if err := ak.Params.Set(ctx, data.Params); err != nil {
		panic(err)
	}

	accounts, err := types.UnpackAccounts(data.Accounts)
	if err != nil {
		panic(err)
	}
	accounts = types.SanitizeGenesisAccounts(accounts)

	// Set the accounts and make sure the global account number matches the largest account number (even if zero).
	var lastAccNum *uint64
	for _, acc := range accounts {
		accNum := acc.GetAccountNumber()
		for lastAccNum == nil || *lastAccNum < accNum {
			n := ak.NextAccountNumber(ctx)
			lastAccNum = &n
		}
		ak.SetAccount(ctx, acc)
	}

	ak.GetModuleAccount(ctx, types.FeeCollectorName)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/auth/keeper/genesis.go#L8-L35)

### `ExportGenesis` [​](https://docs.cosmos.network/v0.50/build/building-modules/genesis#exportgenesis "Direct link to exportgenesis")

The `ExportGenesis` method is executed whenever an export of the state is made. It takes the latest known version of the subset of the state managed by the module and creates a new `GenesisState` out of it. This is mainly used when the chain needs to be upgraded via a hard fork.

See an example of `ExportGenesis` from the `auth` module.

x/auth/keeper/genesis.go

```codeBlockLines_e6Vv
// ExportGenesis returns a GenesisState for a given context and keeper
func (ak AccountKeeper) ExportGenesis(ctx sdk.Context) *types.GenesisState {
	params := ak.GetParams(ctx)

	var genAccounts types.GenesisAccounts
	ak.IterateAccounts(ctx, func(account sdk.AccountI) bool {
		genAccount := account.(types.GenesisAccount)
		genAccounts = append(genAccounts, genAccount)
		return false
	})

	return types.NewGenesisState(params, genAccounts)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/auth/keeper/genesis.go#L37-L49)

### GenesisTxHandler [​](https://docs.cosmos.network/v0.50/build/building-modules/genesis#genesistxhandler "Direct link to GenesisTxHandler")

`GenesisTxHandler` is a way for modules to submit state transitions prior to the first block. This is used by `x/genutil` to submit the genesis transactions for the validators to be added to staking.

core/genesis/txhandler.go

```codeBlockLines_e6Vv
// TxHandler is an interface that modules can implement to provide genesis state transitions
type TxHandler interface {
	ExecuteGenesisTx([]byte) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/core/genesis/txhandler.go#L3-L6)

- [Type Definition](https://docs.cosmos.network/v0.50/build/building-modules/genesis#type-definition)
  - [`DefaultGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#defaultgenesis)
  - [`ValidateGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#validategenesis)
- [Other Genesis Methods](https://docs.cosmos.network/v0.50/build/building-modules/genesis#other-genesis-methods)
  - [`InitGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#initgenesis)
  - [`ExportGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#exportgenesis)
  - [GenesisTxHandler](https://docs.cosmos.network/v0.50/build/building-modules/genesis#genesistxhandler)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=8hbeu3i55ck5)

#### Introduction

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/intro#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/intro)** (v0.52).

Version: v0.50

On this page

# Introduction to Cosmos SDK Modules

Synopsis

Modules define most of the logic of Cosmos SDK applications. Developers compose modules together using the Cosmos SDK to build their custom application-specific blockchains. This document outlines the basic concepts behind SDK modules and how to approach module management.

Pre-requisite Readings

- [Anatomy of a Cosmos SDK application](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy)
- [Lifecycle of a Cosmos SDK transaction](https://docs.cosmos.network/v0.50/learn/beginner/tx-lifecycle)

## Role of Modules in a Cosmos SDK Application [​](https://docs.cosmos.network/v0.50/build/building-modules/intro#role-of-modules-in-a-cosmos-sdk-application "Direct link to Role of Modules in a Cosmos SDK Application")

The Cosmos SDK can be thought of as the Ruby-on-Rails of blockchain development. It comes with a core that provides the basic functionalities every blockchain application needs, like a [boilerplate implementation of the ABCI](https://docs.cosmos.network/v0.50/learn/advanced/baseapp) to communicate with the underlying consensus engine, a [`multistore`](https://docs.cosmos.network/v0.50/learn/advanced/store#multistore) to persist state, a [server](https://docs.cosmos.network/v0.50/learn/advanced/node) to form a full-node and [interfaces](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces) to handle queries.

On top of this core, the Cosmos SDK enables developers to build modules that implement the business logic of their application. In other words, SDK modules implement the bulk of the logic of applications, while the core does the wiring and enables modules to be composed together. The end goal is to build a robust ecosystem of open-source Cosmos SDK modules, making it increasingly easier to build complex blockchain applications.

Cosmos SDK modules can be seen as little state-machines within the state-machine. They generally define a subset of the state using one or more `KVStore` s in the [main multistore](https://docs.cosmos.network/v0.50/learn/advanced/store), as well as a subset of [message types](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#messages). These messages are routed by one of the main components of Cosmos SDK core, [`BaseApp`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp), to a module Protobuf [`Msg` service](https://docs.cosmos.network/v0.50/build/building-modules/msg-services) that defines them.

```codeBlockLines_e6Vv
                                      +
                                      |
                                      |  Transaction relayed from the full-node's consensus engine
                                      |  to the node's application via DeliverTx
                                      |
                                      |
                                      |
                +---------------------v--------------------------+
                |                 APPLICATION                    |
                |                                                |
                |     Using baseapp's methods: Decode the Tx,    |
                |     extract and route the message(s)           |
                |                                                |
                +---------------------+--------------------------+
                                      |
                                      |
                                      |
                                      +---------------------------+
                                                                  |
                                                                  |
                                                                  |
                                                                  |  Message routed to the correct
                                                                  |  module to be processed
                                                                  |
                                                                  |
+----------------+  +---------------+  +----------------+  +------v----------+
|                |  |               |  |                |  |                 |
|  AUTH MODULE   |  |  BANK MODULE  |  | STAKING MODULE |  |   GOV MODULE    |
|                |  |               |  |                |  |                 |
|                |  |               |  |                |  | Handles message,|
|                |  |               |  |                |  | Updates state   |
|                |  |               |  |                |  |                 |
+----------------+  +---------------+  +----------------+  +------+----------+
                                                                  |
                                                                  |
                                                                  |
                                                                  |
                                       +--------------------------+
                                       |
                                       | Return result to the underlying consensus engine (e.g. CometBFT)
                                       | (0=Ok, 1=Err)
                                       v

```

As a result of this architecture, building a Cosmos SDK application usually revolves around writing modules to implement the specialized logic of the application and composing them with existing modules to complete the application. Developers will generally work on modules that implement logic needed for their specific use case that do not exist yet, and will use existing modules for more generic functionalities like staking, accounts, or token management.

### Modules as Sudo [​](https://docs.cosmos.network/v0.50/build/building-modules/intro#modules-as-sudo "Direct link to Modules as Sudo")

Modules have the ability to perform actions that are not available to regular users. This is because modules are given sudo permissions by the state machine. Modules can reject another modules desire to execute a function but this logic must be explicit. Examples of this can be seen when modules create functions to modify parameters:

x/bank/keeper/msg_server.go

```codeBlockLines_e6Vv
if k.GetAuthority() != msg.Authority {
	return nil, errorsmod.Wrapf(types.ErrInvalidSigner, "invalid authority; expected %s, got %s", k.GetAuthority(), msg.Authority)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/61da5d1c29c16a1eb5bb5488719fde604ec07b10/x/bank/keeper/msg_server.go#L147-L149)

## How to Approach Building Modules as a Developer [​](https://docs.cosmos.network/v0.50/build/building-modules/intro#how-to-approach-building-modules-as-a-developer "Direct link to How to Approach Building Modules as a Developer")

While there are no definitive guidelines for writing modules, here are some important design principles developers should keep in mind when building them:

- **Composability**: Cosmos SDK applications are almost always composed of multiple modules. This means developers need to carefully consider the integration of their module not only with the core of the Cosmos SDK, but also with other modules. The former is achieved by following standard design patterns outlined [here](https://docs.cosmos.network/v0.50/build/building-modules/intro#main-components-of-sdk-modules), while the latter is achieved by properly exposing the store(s) of the module via the [`keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper).
- **Specialization**: A direct consequence of the **composability** feature is that modules should be **specialized**. Developers should carefully establish the scope of their module and not batch multiple functionalities into the same module. This separation of concerns enables modules to be re-used in other projects and improves the upgradability of the application. **Specialization** also plays an important role in the [object-capabilities model](https://docs.cosmos.network/v0.50/learn/advanced/ocap) of the Cosmos SDK.
- **Capabilities**: Most modules need to read and/or write to the store(s) of other modules. However, in an open-source environment, it is possible for some modules to be malicious. That is why module developers need to carefully think not only about how their module interacts with other modules, but also about how to give access to the module's store(s). The Cosmos SDK takes a capabilities-oriented approach to inter-module security. This means that each store defined by a module is accessed by a `key`, which is held by the module's [`keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper). This `keeper` defines how to access the store(s) and under what conditions. Access to the module's store(s) is done by passing a reference to the module's `keeper`.

## Main Components of Cosmos SDK Modules [​](https://docs.cosmos.network/v0.50/build/building-modules/intro#main-components-of-cosmos-sdk-modules "Direct link to Main Components of Cosmos SDK Modules")

Modules are by convention defined in the `./x/` subfolder (e.g. the `bank` module will be defined in the `./x/bank` folder). They generally share the same core components:

- A [`keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper), used to access the module's store(s) and update the state.
- A [`Msg` service](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#messages), used to process messages when they are routed to the module by [`BaseApp`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#message-routing) and trigger state-transitions.
- A [query service](https://docs.cosmos.network/v0.50/build/building-modules/query-services), used to process user queries when they are routed to the module by [`BaseApp`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#query-routing).
- Interfaces, for end users to query the subset of the state defined by the module and create `message` s of the custom types defined in the module.

In addition to these components, modules implement the `AppModule` interface in order to be managed by the [`module manager`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager).

Please refer to the [structure document](https://docs.cosmos.network/v0.50/build/building-modules/structure) to learn about the recommended structure of a module's directory.

- [Role of Modules in a Cosmos SDK Application](https://docs.cosmos.network/v0.50/build/building-modules/intro#role-of-modules-in-a-cosmos-sdk-application)
  - [Modules as Sudo](https://docs.cosmos.network/v0.50/build/building-modules/intro#modules-as-sudo)
- [How to Approach Building Modules as a Developer](https://docs.cosmos.network/v0.50/build/building-modules/intro#how-to-approach-building-modules-as-a-developer)
- [Main Components of Cosmos SDK Modules](https://docs.cosmos.network/v0.50/build/building-modules/intro#main-components-of-cosmos-sdk-modules)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=5k2pf6dz1vdp)

### Invariants

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/invariants#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/learn)** (v0.52).

Version: v0.50

On this page

# Invariants

Synopsis

An invariant is a property of the application that should always be true. In the context of the Cosmos SDK, an `Invariant` is a function that checks for a particular invariant. These functions are useful to detect bugs early on and act upon them to limit their potential consequences (e.g. by halting the chain). They are also useful in the development process of the application to detect bugs via simulations.

Pre-requisite Readings

- [Keepers](https://docs.cosmos.network/v0.50/build/building-modules/keeper)

## Implementing `Invariant` S [​](https://docs.cosmos.network/v0.50/build/building-modules/invariants#implementing-invariants "Direct link to implementing-invariants")

An `Invariant` is a function that checks for a particular invariant within a module. Module `Invariant` s must follow the `Invariant` type:

types/invariant.go

```codeBlockLines_e6Vv
type Invariant func(ctx Context) (string, bool)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/invariant.go#L9)

The `string` return value is the invariant message, which can be used when printing logs, and the `bool` return value is the actual result of the invariant check.

In practice, each module implements `Invariant` s in a `keeper/invariants.go` file within the module's folder. The standard is to implement one `Invariant` function per logical grouping of invariants with the following model:

```codeBlockLines_e6Vv
// Example for an Invariant that checks balance-related invariants

func BalanceInvariants(k Keeper) sdk.Invariant {
    return func(ctx context.Context) (string, bool) {
        // Implement checks for balance-related invariants
    }
}

```

Additionally, module developers should generally implement an `AllInvariants` function that runs all the `Invariant` s functions of the module:

```codeBlockLines_e6Vv
// AllInvariants runs all invariants of the module.
// In this example, the module implements two Invariants: BalanceInvariants and DepositsInvariants

func AllInvariants(k Keeper) sdk.Invariant {

    return func(ctx context.Context) (string, bool) {
        res, stop := BalanceInvariants(k)(ctx)
        if stop {
            return res, stop
        }

        return DepositsInvariant(k)(ctx)
    }
}

```

Finally, module developers need to implement the `RegisterInvariants` method as part of the [`AppModule` interface](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodule). Indeed, the `RegisterInvariants` method of the module, implemented in the `module/module.go` file, typically only defers the call to a `RegisterInvariants` method implemented in the `keeper/invariants.go` file. The `RegisterInvariants` method registers a route for each `Invariant` function in the [`InvariantRegistry`](https://docs.cosmos.network/v0.50/build/building-modules/invariants#invariant-registry):

x/staking/keeper/invariants.go

```codeBlockLines_e6Vv
// RegisterInvariants registers all staking invariants
func RegisterInvariants(ir sdk.InvariantRegistry, k *Keeper) {
	ir.RegisterRoute(types.ModuleName, "module-accounts",
		ModuleAccountInvariants(k))
	ir.RegisterRoute(types.ModuleName, "nonnegative-power",
		NonNegativePowerInvariant(k))
	ir.RegisterRoute(types.ModuleName, "positive-delegation",
		PositiveDelegationInvariant(k))
	ir.RegisterRoute(types.ModuleName, "delegator-shares",
		DelegatorSharesInvariant(k))
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/staking/keeper/invariants.go#L12-L22)

For more, see an example of [`Invariant` s implementation from the `staking` module](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/staking/keeper/invariants.go).

## Invariant Registry [​](https://docs.cosmos.network/v0.50/build/building-modules/invariants#invariant-registry "Direct link to Invariant Registry")

The `InvariantRegistry` is a registry where the `Invariant` s of all the modules of an application are registered. There is only one `InvariantRegistry` per **application**, meaning module developers need not implement their own `InvariantRegistry` when building a module. **All module developers need to do is to register their modules' invariants in the `InvariantRegistry`, as explained in the section above**. The rest of this section gives more information on the `InvariantRegistry` itself, and does not contain anything directly relevant to module developers.

At its core, the `InvariantRegistry` is defined in the Cosmos SDK as an interface:

types/invariant.go

```codeBlockLines_e6Vv
// expected interface for registering invariants
type InvariantRegistry interface {
	RegisterRoute(moduleName, route string, invar Invariant)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/invariant.go#L14-L17)

Typically, this interface is implemented in the `keeper` of a specific module. The most used implementation of an `InvariantRegistry` can be found in the `crisis` module:

x/crisis/keeper/keeper.go

```codeBlockLines_e6Vv
cdc:              cdc,
routes:           make([]types.InvarRoute, 0),
invCheckPeriod:   invCheckPeriod,

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/crisis/keeper/keeper.go#L48-L50)

The `InvariantRegistry` is therefore typically instantiated by instantiating the `keeper` of the `crisis` module in the [application's constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).

`Invariant` s can be checked manually via [`message` s](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries), but most often they are checked automatically at the end of each block. Here is an example from the `crisis` module:

x/crisis/abci.go

```codeBlockLines_e6Vv
// check all registered invariants
func EndBlocker(ctx context.Context, k keeper.Keeper) {
	defer telemetry.ModuleMeasureSince(types.ModuleName, time.Now(), telemetry.MetricKeyEndBlocker)

	sdkCtx := sdk.UnwrapSDKContext(ctx)
	if k.InvCheckPeriod() == 0 || sdkCtx.BlockHeight()%int64(k.InvCheckPeriod()) != 0 {
		// skip running the invariant check
		return
	}
	k.AssertInvariants(sdkCtx)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/crisis/abci.go#L13-L23)

In both cases, if one of the `Invariant` s returns false, the `InvariantRegistry` can trigger special logic (e.g. have the application panic and print the `Invariant` s message in the log).

- [Implementing `Invariant` s](https://docs.cosmos.network/v0.50/build/building-modules/invariants#implementing-invariants)
- [Invariant Registry](https://docs.cosmos.network/v0.50/build/building-modules/invariants#invariant-registry)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=cj2g561u7n19)

### Keepers

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/keeper#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/keeper)** (v0.52).

Version: v0.50

On this page

# Keepers

Synopsis

`Keeper` s refer to a Cosmos SDK abstraction whose role is to manage access to the subset of the state defined by various modules. `Keeper` s are module-specific, i.e. the subset of state defined by a module can only be accessed by a `keeper` defined in said module. If a module needs to access the subset of state defined by another module, a reference to the second module's internal `keeper` needs to be passed to the first one. This is done in `app.go` during the instantiation of module keepers.

Pre-requisite Readings

- [Introduction to Cosmos SDK Modules](https://docs.cosmos.network/v0.50/build/building-modules/intro)

## Motivation [​](https://docs.cosmos.network/v0.50/build/building-modules/keeper#motivation "Direct link to Motivation")

The Cosmos SDK is a framework that makes it easy for developers to build complex decentralized applications from scratch, mainly by composing modules together. As the ecosystem of open-source modules for the Cosmos SDK expands, it will become increasingly likely that some of these modules contain vulnerabilities, as a result of the negligence or malice of their developer.

The Cosmos SDK adopts an [object-capabilities-based approach](https://docs.cosmos.network/v0.50/learn/advanced/ocap) to help developers better protect their application from unwanted inter-module interactions, and `keeper` s are at the core of this approach. A `keeper` can be considered quite literally to be the gatekeeper of a module's store(s). Each store (typically an [`IAVL` Store](https://docs.cosmos.network/v0.50/learn/advanced/store#iavl-store)) defined within a module comes with a `storeKey`, which grants unlimited access to it. The module's `keeper` holds this `storeKey` (which should otherwise remain unexposed), and defines [methods](https://docs.cosmos.network/v0.50/build/building-modules/keeper#implementing-methods) for reading and writing to the store(s).

The core idea behind the object-capabilities approach is to only reveal what is necessary to get the work done. In practice, this means that instead of handling permissions of modules through access-control lists, module `keeper` s are passed a reference to the specific instance of the other modules' `keeper` s that they need to access (this is done in the [application's constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function)). As a consequence, a module can only interact with the subset of state defined in another module via the methods exposed by the instance of the other module's `keeper`. This is a great way for developers to control the interactions that their own module can have with modules developed by external developers.

## Type Definition [​](https://docs.cosmos.network/v0.50/build/building-modules/keeper#type-definition "Direct link to Type Definition")

`keeper` s are generally implemented in a `/keeper/keeper.go` file located in the module's folder. By convention, the type `keeper` of a module is simply named `Keeper` and usually follows the following structure:

```codeBlockLines_e6Vv
type Keeper struct {
    // External keepers, if any

    // Store key(s)

    // codec

    // authority
}

```

For example, here is the type definition of the `keeper` from the `staking` module:

x/staking/keeper/keeper.go

```codeBlockLines_e6Vv
type Keeper struct {
	storeKey   storetypes.StoreKey
	cdc        codec.BinaryCodec
	authKeeper types.AccountKeeper
	bankKeeper types.BankKeeper
	hooks      types.StakingHooks
	authority  string
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/staking/keeper/keeper.go#L23-L31)

Let us go through the different parameters:

- An expected `keeper` is a `keeper` external to a module that is required by the internal `keeper` of said module. External `keeper` s are listed in the internal `keeper`'s type definition as interfaces. These interfaces are themselves defined in an `expected_keepers.go` file in the root of the module's folder. In this context, interfaces are used to reduce the number of dependencies, as well as to facilitate the maintenance of the module itself.
- `storeKey` s grant access to the store(s) of the [multistore](https://docs.cosmos.network/v0.50/learn/advanced/store) managed by the module. They should always remain unexposed to external modules.
- `cdc` is the [codec](https://docs.cosmos.network/v0.50/learn/advanced/encoding) used to marshall and unmarshall structs to/from `[]byte`. The `cdc` can be any of `codec.BinaryCodec`, `codec.JSONCodec` or `codec.Codec` based on your requirements. It can be either a proto or amino codec as long as they implement these interfaces.
- The authority listed is a module account or user account that has the right to change module level parameters. Previously this was handled by the param module, which has been deprecated.

Of course, it is possible to define different types of internal `keeper` s for the same module (e.g. a read-only `keeper`). Each type of `keeper` comes with its own constructor function, which is called from the [application's constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy). This is where `keeper` s are instantiated, and where developers make sure to pass correct instances of modules' `keeper` s to other modules that require them.

## Implementing Methods [​](https://docs.cosmos.network/v0.50/build/building-modules/keeper#implementing-methods "Direct link to Implementing Methods")

`Keeper` s primarily expose getter and setter methods for the store(s) managed by their module. These methods should remain as simple as possible and strictly be limited to getting or setting the requested value, as validity checks should have already been performed by the [`Msg` server](https://docs.cosmos.network/v0.50/build/building-modules/msg-services) when `keeper` s' methods are called.

Typically, a _getter_ method will have the following signature

```codeBlockLines_e6Vv
func (k Keeper) Get(ctx context.Context, key string) returnType

```

and the method will go through the following steps:

1. Retrieve the appropriate store from the `ctx` using the `storeKey`. This is done through the `KVStore(storeKey sdk.StoreKey)` method of the `ctx`. Then it's preferred to use the `prefix.Store` to access only the desired limited subset of the store for convenience and safety.
2. If it exists, get the `[]byte` value stored at location `[]byte(key)` using the `Get(key []byte)` method of the store.
3. Unmarshall the retrieved value from `[]byte` to `returnType` using the codec `cdc`. Return the value.

Similarly, a _setter_ method will have the following signature

```codeBlockLines_e6Vv
func (k Keeper) Set(ctx context.Context, key string, value valueType)

```

and the method will go through the following steps:

1. Retrieve the appropriate store from the `ctx` using the `storeKey`. This is done through the `KVStore(storeKey sdk.StoreKey)` method of the `ctx`. It's preferred to use the `prefix.Store` to access only the desired limited subset of the store for convenience and safety.
2. Marshal `value` to `[]byte` using the codec `cdc`.
3. Set the encoded value in the store at location `key` using the `Set(key []byte, value []byte)` method of the store.

For more, see an example of `keeper`'s [methods implementation from the `staking` module](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/staking/keeper/keeper.go).

The [module `KVStore`](https://docs.cosmos.network/v0.50/learn/advanced/store#kvstore-and-commitkvstore-interfaces) also provides an `Iterator()` method which returns an `Iterator` object to iterate over a domain of keys.

This is an example from the `auth` module to iterate accounts:

x/auth/keeper/account.go

```codeBlockLines_e6Vv
package keeper

import (
	"context"
	"errors"

	"cosmossdk.io/collections"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// NewAccountWithAddress implements AccountKeeperI.
func (ak AccountKeeper) NewAccountWithAddress(ctx context.Context, addr sdk.AccAddress) sdk.AccountI {
	acc := ak.proto()
	err := acc.SetAddress(addr)
	if err != nil {
		panic(err)
	}

	return ak.NewAccount(ctx, acc)
}

// NewAccount sets the next account number to a given account interface
func (ak AccountKeeper) NewAccount(ctx context.Context, acc sdk.AccountI) sdk.AccountI {
	if err := acc.SetAccountNumber(ak.NextAccountNumber(ctx)); err != nil {
		panic(err)
	}

	return acc
}

// HasAccount implements AccountKeeperI.
func (ak AccountKeeper) HasAccount(ctx context.Context, addr sdk.AccAddress) bool {
	has, _ := ak.Accounts.Has(ctx, addr)
	return has
}

// GetAccount implements AccountKeeperI.
func (ak AccountKeeper) GetAccount(ctx context.Context, addr sdk.AccAddress) sdk.AccountI {
	acc, err := ak.Accounts.Get(ctx, addr)
	if err != nil && !errors.Is(err, collections.ErrNotFound) {
		panic(err)
	}
	return acc
}

// GetAllAccounts returns all accounts in the accountKeeper.
func (ak AccountKeeper) GetAllAccounts(ctx context.Context) (accounts []sdk.AccountI) {
	ak.IterateAccounts(ctx, func(acc sdk.AccountI) (stop bool) {
		accounts = append(accounts, acc)
		return false
	})

	return accounts
}

// SetAccount implements AccountKeeperI.
func (ak AccountKeeper) SetAccount(ctx context.Context, acc sdk.AccountI) {
	err := ak.Accounts.Set(ctx, acc.GetAddress(), acc)
	if err != nil {
		panic(err)
	}
}

// RemoveAccount removes an account for the account mapper store.
// NOTE: this will cause supply invariant violation if called
func (ak AccountKeeper) RemoveAccount(ctx context.Context, acc sdk.AccountI) {
	err := ak.Accounts.Remove(ctx, acc.GetAddress())
	if err != nil {
		panic(err)
	}
}

// IterateAccounts iterates over all the stored accounts and performs a callback function.
// Stops iteration when callback returns true.
func (ak AccountKeeper) IterateAccounts(ctx context.Context, cb func(account sdk.AccountI) (stop bool)) {
	err := ak.Accounts.Walk(ctx, nil, func(_ sdk.AccAddress, value sdk.AccountI) (bool, error) {
		return cb(value), nil
	})
	if err != nil {
		panic(err)
	}
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/auth/keeper/account.go)

- [Motivation](https://docs.cosmos.network/v0.50/build/building-modules/keeper#motivation)
- [Type Definition](https://docs.cosmos.network/v0.50/build/building-modules/keeper#type-definition)
- [Implementing Methods](https://docs.cosmos.network/v0.50/build/building-modules/keeper#implementing-methods)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=9a0csvabr67s)

### Messages and Queries

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/messages-and-queries)** (v0.52).

Version: v0.50

On this page

# Messages and Queries

Synopsis

`Msg` s and `Queries` are the two primary objects handled by modules. Most of the core components defined in a module, like `Msg` services, `keeper` s and `Query` services, exist to process `message` s and `queries`.

Pre-requisite Readings

- [Introduction to Cosmos SDK Modules](https://docs.cosmos.network/v0.50/build/building-modules/intro)

## Messages [​](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#messages "Direct link to Messages")

`Msg` s are objects whose end-goal is to trigger state-transitions. They are wrapped in [transactions](https://docs.cosmos.network/v0.50/learn/advanced/transactions), which may contain one or more of them.

When a transaction is relayed from the underlying consensus engine to the Cosmos SDK application, it is first decoded by [`BaseApp`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp). Then, each message contained in the transaction is extracted and routed to the appropriate module via `BaseApp`'s `MsgServiceRouter` so that it can be processed by the module's [`Msg` service](https://docs.cosmos.network/v0.50/build/building-modules/msg-services). For a more detailed explanation of the lifecycle of a transaction, click [here](https://docs.cosmos.network/v0.50/learn/beginner/tx-lifecycle).

### `Msg` Services [​](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#msg-services "Direct link to msg-services")

Defining Protobuf `Msg` services is the recommended way to handle messages. A Protobuf `Msg` service should be created for each module, typically in `tx.proto` (see more info about [conventions and naming](https://docs.cosmos.network/v0.50/learn/advanced/encoding#faq)). It must have an RPC service method defined for each message in the module.

Each `Msg` service method must have exactly one argument, which must implement the `sdk.Msg` interface, and a Protobuf response. The naming convention is to call the RPC argument `Msg<service-rpc-name>` and the RPC response `Msg<service-rpc-name>Response`. For example:

```codeBlockLines_e6Vv
  rpc Send(MsgSend) returns (MsgSendResponse);

```

See an example of a `Msg` service definition from `x/bank` module:

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
// Msg defines the bank Msg service.
service Msg {
  option (cosmos.msg.v1.service) = true;

  // Send defines a method for sending coins from one account to another account.
  rpc Send(MsgSend) returns (MsgSendResponse);

  // MultiSend defines a method for sending coins from some accounts to other accounts.
  rpc MultiSend(MsgMultiSend) returns (MsgMultiSendResponse);

  // UpdateParams defines a governance operation for updating the x/bank module parameters.
  // The authority is defined in the keeper.
  //
  // Since: cosmos-sdk 0.47
  rpc UpdateParams(MsgUpdateParams) returns (MsgUpdateParamsResponse);

  // SetSendEnabled is a governance operation for setting the SendEnabled flag
  // on any number of Denoms. Only the entries to add or update should be
  // included. Entries that already exist in the store, but that aren't
  // included in this message, will be left unchanged.
  //
  // Since: cosmos-sdk 0.47
  rpc SetSendEnabled(MsgSetSendEnabled) returns (MsgSetSendEnabledResponse);
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/proto/cosmos/bank/v1beta1/tx.proto#L13-L36)

### `sdk.Msg` Interface [​](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#sdkmsg-interface "Direct link to sdkmsg-interface")

`sdk.Msg` is a alias of `proto.Message`.

To attach a `ValidateBasic()` method to a message then you must add methods to the type adhereing to the `HasValidateBasic`.

types/tx_msg.go

```codeBlockLines_e6Vv
HasValidateBasic interface {
	// ValidateBasic does a simple validation check that
	// doesn't require access to any other information.
	ValidateBasic() error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/9c1e8b247cd47b5d3decda6e86fbc3bc996ee5d7/types/tx_msg.go#L84-L88)

In 0.50+ signers from the `GetSigners()` call is automated via a protobuf annotation.

Read more about the signer field [here](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations).

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
option (cosmos.msg.v1.signer) = "from_address";

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e6848d99b55a65d014375b295bdd7f9641aac95e/proto/cosmos/bank/v1beta1/tx.proto#L40)

If there is a need for custom signers then there is an alternative path which can be taken. A function which returns `signing.CustomGetSigner` for a specific message can be defined.

```codeBlockLines_e6Vv
func ProvideBankSendTransactionGetSigners() signing.CustomGetSigner {

            // Extract the signer from the signature.
            signer, err := coretypes.LatestSigner(Tx).Sender(ethTx)
      if err != nil {
                return nil, err
            }

            // Return the signer in the required format.
            return [][]byte{signer.Bytes()}, nil
}

```

When using dependency injection (depinject) this can be provided to the application via the provide method.

```codeBlockLines_e6Vv
depinject.Provide(banktypes.ProvideBankSendTransactionGetSigners)

```

The Cosmos SDK uses Protobuf definitions to generate client and server code:

- `MsgServer` interface defines the server API for the `Msg` service and its implementation is described as part of the [`Msg` services](https://docs.cosmos.network/v0.50/build/building-modules/msg-services) documentation.
- Structures are generated for all RPC request and response types.

A `RegisterMsgServer` method is also generated and should be used to register the module's `MsgServer` implementation in `RegisterServices` method from the [`AppModule` interface](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodule).

In order for clients (CLI and grpc-gateway) to have these URLs registered, the Cosmos SDK provides the function `RegisterMsgServiceDesc(registry codectypes.InterfaceRegistry, sd *grpc.ServiceDesc)` that should be called inside module's [`RegisterInterfaces`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulebasic) method, using the proto-generated `&_Msg_serviceDesc` as `*grpc.ServiceDesc` argument.

## Queries [​](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#queries "Direct link to Queries")

A `query` is a request for information made by end-users of applications through an interface and processed by a full-node. A `query` is received by a full-node through its consensus engine and relayed to the application via the ABCI. It is then routed to the appropriate module via `BaseApp`'s `QueryRouter` so that it can be processed by the module's query service (./04-query-services.md). For a deeper look at the lifecycle of a `query`, click [here](https://docs.cosmos.network/v0.50/learn/beginner/query-lifecycle).

### gRPC Queries [​](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#grpc-queries "Direct link to gRPC Queries")

Queries should be defined using [Protobuf services](https://developers.google.com/protocol-buffers/docs/proto#services). A `Query` service should be created per module in `query.proto`. This service lists endpoints starting with `rpc`.

Here's an example of such a `Query` service definition:

proto/cosmos/auth/v1beta1/query.proto

```codeBlockLines_e6Vv
// Query defines the gRPC querier service.
service Query {
  // Accounts returns all the existing accounts.
  //
  // When called from another module, this query might consume a high amount of
  // gas if the pagination field is incorrectly set.
  //
  // Since: cosmos-sdk 0.43
  rpc Accounts(QueryAccountsRequest) returns (QueryAccountsResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/accounts";
  }

  // Account returns account details based on address.
  rpc Account(QueryAccountRequest) returns (QueryAccountResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/accounts/{address}";
  }

  // AccountAddressByID returns account address based on account number.
  //
  // Since: cosmos-sdk 0.46.2
  rpc AccountAddressByID(QueryAccountAddressByIDRequest) returns (QueryAccountAddressByIDResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/address_by_id/{id}";
  }

  // Params queries all parameters.
  rpc Params(QueryParamsRequest) returns (QueryParamsResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/params";
  }

  // ModuleAccounts returns all the existing module accounts.
  //
  // Since: cosmos-sdk 0.46
  rpc ModuleAccounts(QueryModuleAccountsRequest) returns (QueryModuleAccountsResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/module_accounts";
  }

  // ModuleAccountByName returns the module account info by module name
  rpc ModuleAccountByName(QueryModuleAccountByNameRequest) returns (QueryModuleAccountByNameResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/module_accounts/{name}";
  }

  // Bech32Prefix queries bech32Prefix
  //
  // Since: cosmos-sdk 0.46
  rpc Bech32Prefix(Bech32PrefixRequest) returns (Bech32PrefixResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/bech32";
  }

  // AddressBytesToString converts Account Address bytes to string
  //
  // Since: cosmos-sdk 0.46
  rpc AddressBytesToString(AddressBytesToStringRequest) returns (AddressBytesToStringResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/bech32/{address_bytes}";
  }

  // AddressStringToBytes converts Address string to bytes
  //
  // Since: cosmos-sdk 0.46
  rpc AddressStringToBytes(AddressStringToBytesRequest) returns (AddressStringToBytesResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/bech32/{address_string}";
  }

  // AccountInfo queries account info which is common to all account types.
  //
  // Since: cosmos-sdk 0.47
  rpc AccountInfo(QueryAccountInfoRequest) returns (QueryAccountInfoResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/account_info/{address}";
  }
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/proto/cosmos/auth/v1beta1/query.proto#L14-L89)

As `proto.Message` s, generated `Response` types implement by default `String()` method of [`fmt.Stringer`](https://pkg.go.dev/fmt#Stringer).

A `RegisterQueryServer` method is also generated and should be used to register the module's query server in the `RegisterServices` method from the [`AppModule` interface](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodule).

### Legacy Queries [​](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#legacy-queries "Direct link to Legacy Queries")

Before the introduction of Protobuf and gRPC in the Cosmos SDK, there was usually no specific `query` object defined by module developers, contrary to `message` s. Instead, the Cosmos SDK took the simpler approach of using a simple `path` to define each `query`. The `path` contains the `query` type and all the arguments needed to process it. For most module queries, the `path` should look like the following:

```codeBlockLines_e6Vv
queryCategory/queryRoute/queryType/arg1/arg2/...

```

where:

- `queryCategory` is the category of the `query`, typically `custom` for module queries. It is used to differentiate between different kinds of queries within `BaseApp`'s [`Query` method](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#query).
- `queryRoute` is used by `BaseApp`'s [`queryRouter`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#query-routing) to map the `query` to its module. Usually, `queryRoute` should be the name of the module.
- `queryType` is used by the module's [`querier`](https://docs.cosmos.network/v0.50/build/building-modules/query-services#legacy-queriers) to map the `query` to the appropriate `querier function` within the module.
- `args` are the actual arguments needed to process the `query`. They are filled out by the end-user. Note that for bigger queries, you might prefer passing arguments in the `Data` field of the request `req` instead of the `path`.

The `path` for each `query` must be defined by the module developer in the module's [command-line interface file](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#query-commands).Overall, there are 3 mains components module developers need to implement in order to make the subset of the state defined by their module queryable:

- A [`querier`](https://docs.cosmos.network/v0.50/build/building-modules/query-services#legacy-queriers), to process the `query` once it has been [routed to the module](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#query-routing).
- [Query commands](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#query-commands) in the module's CLI file, where the `path` for each `query` is specified.
- `query` return types. Typically defined in a file `types/querier.go`, they specify the result type of each of the module's `queries`. These custom types must implement the `String()` method of [`fmt.Stringer`](https://pkg.go.dev/fmt#Stringer).

### Store Queries [​](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#store-queries "Direct link to Store Queries")

Store queries query directly for store keys. They use `clientCtx.QueryABCI(req abci.RequestQuery)` to return the full `abci.ResponseQuery` with inclusion Merkle proofs.

See following examples:

baseapp/abci.go

```codeBlockLines_e6Vv
		), app.trace)
}

func handleQueryStore(app *BaseApp, path []string, req abci.RequestQuery) *abci.ResponseQuery {
	// "/store" prefix for store queries
	queryable, ok := app.cms.(storetypes.Queryable)
	if !ok {
		return sdkerrors.QueryResult(errorsmod.Wrap(sdkerrors.ErrUnknownRequest, "multi-store does not support queries"), app.trace)
	}

	req.Path = "/" + strings.Join(path[1:], "/")

	if req.Height <= 1 && req.Prove {
		return sdkerrors.QueryResult(
			errorsmod.Wrap(
				sdkerrors.ErrInvalidRequest,
				"cannot query with proof when height <= 1; please provide a valid height",
			), app.trace)
	}

	sdkReq := storetypes.RequestQuery(req)
	resp, err := queryable.Query(&sdkReq)
	if err != nil {
		return sdkerrors.QueryResult(err, app.trace)
	}
	resp.Height = req.Height

	abciResp := abci.ResponseQuery(*resp)

	return &abciResp
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/baseapp/abci.go#L864-L894)

- [Messages](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#messages)
  - [`Msg` Services](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#msg-services)
  - [`sdk.Msg` Interface](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#sdkmsg-interface)
- [Queries](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#queries)
  - [gRPC Queries](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#grpc-queries)
  - [Legacy Queries](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#legacy-queries)
  - [Store Queries](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#store-queries)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=qvwc4srut5s5)

#### Module Interfaces

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/module-interfaces)** (v0.52).

Version: v0.50

On this page

# Module Interfaces

Synopsis

This document details how to build CLI and REST interfaces for a module. Examples from various Cosmos SDK modules are included.

Pre-requisite Readings

- [Building Modules Intro](https://docs.cosmos.network/v0.50/build/building-modules/intro)

## CLI [​](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#cli "Direct link to CLI")

One of the main interfaces for an application is the [command-line interface](https://docs.cosmos.network/v0.50/learn/advanced/cli). This entrypoint adds commands from the application's modules enabling end-users to create [**messages**](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#messages) wrapped in transactions and [**queries**](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#queries). The CLI files are typically found in the module's `./client/cli` folder.

### Transaction Commands [​](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#transaction-commands "Direct link to Transaction Commands")

In order to create messages that trigger state changes, end-users must create [transactions](https://docs.cosmos.network/v0.50/learn/advanced/transactions) that wrap and deliver the messages. A transaction command creates a transaction that includes one or more messages.

Transaction commands typically have their own `tx.go` file that lives within the module's `./client/cli` folder. The commands are specified in getter functions and the name of the function should include the name of the command.

Here is an example from the `x/bank` module:

x/bank/client/cli/tx.go

```codeBlockLines_e6Vv
// NewSendTxCmd returns a CLI command handler for creating a MsgSend transaction.
func NewSendTxCmd(ac address.Codec) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "send [from_key_or_address] [to_address] [amount]",
		Short: "Send funds from one account to another.",
		Long: `Send funds from one account to another.
Note, the '--from' flag is ignored as it is implied from [from_key_or_address].
When using '--dry-run' a key name cannot be used, only a bech32 address.
`,
		Args: cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			cmd.Flags().Set(flags.FlagFrom, args[0])
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}
			toAddr, err := ac.StringToBytes(args[1])
			if err != nil {
				return err
			}

			coins, err := sdk.ParseCoinsNormalized(args[2])
			if err != nil {
				return err
			}

			if len(coins) == 0 {
				return fmt.Errorf("invalid coins")
			}

			msg := types.NewMsgSend(clientCtx.GetFromAddress(), toAddr, coins)

			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/client/cli/tx.go#L37-L76)

In the example, `NewSendTxCmd()` creates and returns the transaction command for a transaction that wraps and delivers `MsgSend`. `MsgSend` is the message used to send tokens from one account to another.

In general, the getter function does the following:

- **Constructs the command:** Read the [Cobra Documentation](https://pkg.go.dev/github.com/spf13/cobra) for more detailed information on how to create commands.
  - **Use:** Specifies the format of the user input required to invoke the command. In the example above, `send` is the name of the transaction command and `[from_key_or_address]`, `[to_address]`, and `[amount]` are the arguments.
  - **Args:** The number of arguments the user provides. In this case, there are exactly three: `[from_key_or_address]`, `[to_address]`, and `[amount]`.
  - **Short and Long:** Descriptions for the command. A `Short` description is expected. A `Long` description can be used to provide additional information that is displayed when a user adds the `--help` flag.
  - **RunE:** Defines a function that can return an error. This is the function that is called when the command is executed. This function encapsulates all of the logic to create a new transaction.
    - The function typically starts by getting the `clientCtx`, which can be done with `client.GetClientTxContext(cmd)`. The `clientCtx` contains information relevant to transaction handling, including information about the user. In this example, the `clientCtx` is used to retrieve the address of the sender by calling `clientCtx.GetFromAddress()`.
    - If applicable, the command's arguments are parsed. In this example, the arguments `[to_address]` and `[amount]` are both parsed.
    - A [message](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries) is created using the parsed arguments and information from the `clientCtx`. The constructor function of the message type is called directly. In this case, `types.NewMsgSend(fromAddr, toAddr, amount)`. Its good practice to call, if possible, the necessary [message validation methods](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#Validation) before broadcasting the message.
    - Depending on what the user wants, the transaction is either generated offline or signed and broadcasted to the preconfigured node using `tx.GenerateOrBroadcastTxCLI(clientCtx, flags, msg)`.
- **Adds transaction flags:** All transaction commands must add a set of transaction [flags](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#flags). The transaction flags are used to collect additional information from the user (e.g. the amount of fees the user is willing to pay). The transaction flags are added to the constructed command using `AddTxFlagsToCmd(cmd)`.
- **Returns the command:** Finally, the transaction command is returned.

Each module can implement `NewTxCmd()`, which aggregates all of the transaction commands of the module. Here is an example from the `x/bank` module:

x/bank/client/cli/tx.go

```codeBlockLines_e6Vv
func NewTxCmd(ac address.Codec) *cobra.Command {
	txCmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      "Bank transaction subcommands",
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	txCmd.AddCommand(
		NewSendTxCmd(ac),
		NewMultiSendTxCmd(ac),
	)

	return txCmd
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/client/cli/tx.go#L20-L35)

Each module then can also implement a `GetTxCmd()` method that simply returns `NewTxCmd()`. This allows the root command to easily aggregate all of the transaction commands for each module. Here is an example:

x/bank/module.go

```codeBlockLines_e6Vv
func (ab AppModuleBasic) GetTxCmd() *cobra.Command {
	return cli.NewTxCmd(ab.ac)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/module.go#L84-L86)

### Query Commands [​](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#query-commands "Direct link to Query Commands")

danger

This section is being rewritten. Refer to [AutoCLI](https://docs.cosmos.network/main/core/autocli) while this section is being updated.

## gRPC [​](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#grpc "Direct link to gRPC")

[gRPC](https://grpc.io/) is a Remote Procedure Call (RPC) framework. RPC is the preferred way for external clients like wallets and exchanges to interact with a blockchain.

In addition to providing an ABCI query pathway, the Cosmos SDK provides a gRPC proxy server that routes gRPC query requests to ABCI query requests.

In order to do that, modules must implement `RegisterGRPCGatewayRoutes(clientCtx client.Context, mux *runtime.ServeMux)` on `AppModuleBasic` to wire the client gRPC requests to the correct handler inside the module.

Here's an example from the `x/auth` module:

x/auth/module.go

```codeBlockLines_e6Vv
var data types.GenesisState
if err := cdc.UnmarshalJSON(bz, &data); err != nil {
	return fmt.Errorf("failed to unmarshal %s genesis state: %w", types.ModuleName, err)
}

return types.ValidateGenesis(data)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/auth/module.go#L71-L76)

## gRPC-gateway REST [​](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#grpc-gateway-rest "Direct link to gRPC-gateway REST")

Applications need to support web services that use HTTP requests (e.g. a web wallet like [Keplr](https://keplr.app/)). [grpc-gateway](https://github.com/grpc-ecosystem/grpc-gateway) translates REST calls into gRPC calls, which might be useful for clients that do not use gRPC.

Modules that want to expose REST queries should add `google.api.http` annotations to their `rpc` methods, such as in the example below from the `x/auth` module:

proto/cosmos/auth/v1beta1/query.proto

```codeBlockLines_e6Vv
// Query defines the gRPC querier service.
service Query {
  // Accounts returns all the existing accounts.
  //
  // When called from another module, this query might consume a high amount of
  // gas if the pagination field is incorrectly set.
  //
  // Since: cosmos-sdk 0.43
  rpc Accounts(QueryAccountsRequest) returns (QueryAccountsResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/accounts";
  }

  // Account returns account details based on address.
  rpc Account(QueryAccountRequest) returns (QueryAccountResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/accounts/{address}";
  }

  // AccountAddressByID returns account address based on account number.
  //
  // Since: cosmos-sdk 0.46.2
  rpc AccountAddressByID(QueryAccountAddressByIDRequest) returns (QueryAccountAddressByIDResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/address_by_id/{id}";
  }

  // Params queries all parameters.
  rpc Params(QueryParamsRequest) returns (QueryParamsResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/params";
  }

  // ModuleAccounts returns all the existing module accounts.
  //
  // Since: cosmos-sdk 0.46
  rpc ModuleAccounts(QueryModuleAccountsRequest) returns (QueryModuleAccountsResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/module_accounts";
  }

  // ModuleAccountByName returns the module account info by module name
  rpc ModuleAccountByName(QueryModuleAccountByNameRequest) returns (QueryModuleAccountByNameResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/module_accounts/{name}";
  }

  // Bech32Prefix queries bech32Prefix
  //
  // Since: cosmos-sdk 0.46
  rpc Bech32Prefix(Bech32PrefixRequest) returns (Bech32PrefixResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/bech32";
  }

  // AddressBytesToString converts Account Address bytes to string
  //
  // Since: cosmos-sdk 0.46
  rpc AddressBytesToString(AddressBytesToStringRequest) returns (AddressBytesToStringResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/bech32/{address_bytes}";
  }

  // AddressStringToBytes converts Address string to bytes
  //
  // Since: cosmos-sdk 0.46
  rpc AddressStringToBytes(AddressStringToBytesRequest) returns (AddressStringToBytesResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/bech32/{address_string}";
  }

  // AccountInfo queries account info which is common to all account types.
  //
  // Since: cosmos-sdk 0.47
  rpc AccountInfo(QueryAccountInfoRequest) returns (QueryAccountInfoResponse) {
    option (cosmos.query.v1.module_query_safe) = true;
    option (google.api.http).get               = "/cosmos/auth/v1beta1/account_info/{address}";
  }
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/proto/cosmos/auth/v1beta1/query.proto#L14-L89)

gRPC gateway is started in-process along with the application and CometBFT. It can be enabled or disabled by setting gRPC Configuration `enable` in [`app.toml`](https://docs.cosmos.network/v0.50/build/run-node/01-run-node.md#configuring-the-node-using-apptoml-and-configtoml).

The Cosmos SDK provides a command for generating [Swagger](https://swagger.io/) documentation ( `protoc-gen-swagger`). Setting `swagger` in [`app.toml`](https://docs.cosmos.network/v0.50/build/run-node/01-run-node.md#configuring-the-node-using-apptoml-and-configtoml) defines if swagger documentation should be automatically registered.

- [CLI](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#cli)
  - [Transaction Commands](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#transaction-commands)
  - [Query Commands](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#query-commands)
- [gRPC](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#grpc)
- [gRPC-gateway REST](https://docs.cosmos.network/v0.50/build/building-modules/module-interfaces#grpc-gateway-rest)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=eflpmq6mqjri)

### Module Manager

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/module-manager)** (v0.52).

Version: v0.50

On this page

# Module Manager

Synopsis

Cosmos SDK modules need to implement the [`AppModule` interfaces](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#application-module-interfaces), in order to be managed by the application's [module manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#module-manager). The module manager plays an important role in [`message` and `query` routing](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#routing), and allows application developers to set the order of execution of a variety of functions like [`PreBlocker`](https://docs.cosmos.network/v0.50/learn/beginner/00-app-anatomy#preblocker) and [`BeginBlocker` and `EndBlocker`](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#begingblocker-and-endblocker).

Pre-requisite Readings

- [Introduction to Cosmos SDK Modules](https://docs.cosmos.network/v0.50/build/building-modules/intro)

## Application Module Interfaces [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#application-module-interfaces "Direct link to Application Module Interfaces")

Application module interfaces exist to facilitate the composition of modules together to form a functional Cosmos SDK application.

note

It is recommended to implement interfaces from the [Core API](https://docs.cosmos.network/main/architecture/adr-063-core-module-api) `appmodule` package. This makes modules less dependent on the SDK.<br/>
For legacy reason modules can still implement interfaces from the SDK `module` package.

There are 2 main application module interfaces:

- [`appmodule.AppModule` / `module.AppModule`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodule) for inter-dependent module functionalities (except genesis-related functionalities).
- (legacy) [`module.AppModuleBasic`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulebasic) for independent module functionalities. New modules can use `module.CoreAppModuleBasicAdaptor` instead.

The above interfaces are mostly embedding smaller interfaces (extension interfaces), that defines specific functionalities:

- (legacy) `module.HasName`: Allows the module to provide its own name for legacy purposes.
- (legacy) [`module.HasGenesisBasics`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#modulehasgenesisbasics): The legacy interface for stateless genesis methods.
- [`module.HasGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#modulehasgenesis) for inter-dependent genesis-related module functionalities.
- [`module.HasABCIGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#modulehasabcigenesis) for inter-dependent genesis-related module functionalities.
- [`appmodule.HasGenesis` / `module.HasGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulehasgenesis): The extension interface for stateful genesis methods.
- [`appmodule.HasPreBlocker`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#haspreblocker): The extension interface that contains information about the `AppModule` and `PreBlock`.
- [`appmodule.HasBeginBlocker`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasbeginblocker): The extension interface that contains information about the `AppModule` and `BeginBlock`.
- [`appmodule.HasEndBlocker`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasendblocker): The extension interface that contains information about the `AppModule` and `EndBlock`.
- [`appmodule.HasPrecommit`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasprecommit): The extension interface that contains information about the `AppModule` and `Precommit`.
- [`appmodule.HasPrepareCheckState`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#haspreparecheckstate): The extension interface that contains information about the `AppModule` and `PrepareCheckState`.
- [`appmodule.HasService` / `module.HasServices`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasservices): The extension interface for modules to register services.
- [`module.HasABCIEndBlock`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasabciendblock): The extension interface that contains information about the `AppModule`, `EndBlock` and returns an updated validator set.
- (legacy) [`module.HasInvariants`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasinvariants): The extension interface for registering invariants.
- (legacy) [`module.HasConsensusVersion`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasconsensusversion): The extension interface for declaring a module consensus version.

The `AppModuleBasic` interface exists to define independent methods of the module, i.e. those that do not depend on other modules in the application. This allows for the construction of the basic application structure early in the application definition, generally in the `init()` function of the [main application file](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#core-application-file).

The `AppModule` interface exists to define inter-dependent module methods. Many modules need to interact with other modules, typically through [`keeper` s](https://docs.cosmos.network/v0.50/build/building-modules/keeper), which means there is a need for an interface where modules list their `keeper` s and other methods that require a reference to another module's object. `AppModule` interface extension, such as `HasBeginBlocker` and `HasEndBlocker`, also enables the module manager to set the order of execution between module's methods like `BeginBlock` and `EndBlock`, which is important in cases where the order of execution between modules matters in the context of the application.

The usage of extension interfaces allows modules to define only the functionalities they need. For example, a module that does not need an `EndBlock` does not need to define the `HasEndBlocker` interface and thus the `EndBlock` method. `AppModule` and `AppModuleGenesis` are voluntarily small interfaces, that can take advantage of the `Module` patterns without having to define many placeholder functions.

### `AppModuleBasic` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulebasic "Direct link to appmodulebasic")

note

Use `module.CoreAppModuleBasicAdaptor` instead for creating an `AppModuleBasic` from an `appmodule.AppModule`.

The `AppModuleBasic` interface defines the independent methods modules need to implement.

types/module/module.go

```codeBlockLines_e6Vv
// AppModuleBasic is the standard form for basic non-dependant elements of an application module.
type AppModuleBasic interface {
	HasName
	RegisterLegacyAminoCodec(*codec.LegacyAmino)
	RegisterInterfaces(types.InterfaceRegistry)

	// client functionality
	RegisterGRPCGatewayRoutes(client.Context, *runtime.ServeMux)
	GetTxCmd() *cobra.Command
	GetQueryCmd() *cobra.Command
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L56-L66)

Let us go through the methods:

- `RegisterLegacyAminoCodec(*codec.LegacyAmino)`: Registers the `amino` codec for the module, which is used to marshal and unmarshal structs to/from `[]byte` in order to persist them in the module's `KVStore`.
- `RegisterInterfaces(codectypes.InterfaceRegistry)`: Registers a module's interface types and their concrete implementations as `proto.Message`.
- `RegisterGRPCGatewayRoutes(client.Context, *runtime.ServeMux)`: Registers gRPC routes for the module.

All the `AppModuleBasic` of an application are managed by the [`BasicManager`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#basicmanager).

### `HasName` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasname "Direct link to hasname")

types/module/module.go

```codeBlockLines_e6Vv
type HasName interface {
	Name() string
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L71-L73)

- `HasName` is an interface that has a method `Name()`. This method returns the name of the module as a `string`.

### Genesis [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#genesis "Direct link to Genesis")

tip

For easily creating an `AppModule` that only has genesis functionalities, use `module.GenesisOnlyAppModule`.

#### `module.HasGenesisBasics` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#modulehasgenesisbasics "Direct link to modulehasgenesisbasics")

types/module/module.go

```codeBlockLines_e6Vv
type HasGenesisBasics interface {
	DefaultGenesis(codec.JSONCodec) json.RawMessage
	ValidateGenesis(codec.JSONCodec, client.TxEncodingConfig, json.RawMessage) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L76-L79)

Let us go through the methods:

- `DefaultGenesis(codec.JSONCodec)`: Returns a default [`GenesisState`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#genesisstate) for the module, marshalled to `json.RawMessage`. The default `GenesisState` need to be defined by the module developer and is primarily used for testing.
- `ValidateGenesis(codec.JSONCodec, client.TxEncodingConfig, json.RawMessage)`: Used to validate the `GenesisState` defined by a module, given in its `json.RawMessage` form. It will usually unmarshall the `json` before running a custom [`ValidateGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#validategenesis) function defined by the module developer.

#### `module.HasGenesis` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#modulehasgenesis "Direct link to modulehasgenesis")

`HasGenesis` is an extension interface for allowing modules to implement genesis functionalities.

types/module/module.go

```codeBlockLines_e6Vv
// HasGenesis is the extension interface for stateful genesis methods.
type HasGenesis interface {
	HasGenesisBasics
	InitGenesis(sdk.Context, codec.JSONCodec, json.RawMessage)
	ExportGenesis(sdk.Context, codec.JSONCodec) json.RawMessage
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/6ce2505/types/module/module.go#L184-L189)

#### `module.HasABCIGenesis` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#modulehasabcigenesis "Direct link to modulehasabcigenesis")

`HasABCIGenesis` is an extension interface for allowing modules to implement genesis functionalities and returns validator set updates.

types/module/module.go

```codeBlockLines_e6Vv
// HasABCIGenesis is the extension interface for stateful genesis methods which returns validator updates.
type HasABCIGenesis interface {
	HasGenesisBasics
	InitGenesis(sdk.Context, codec.JSONCodec, json.RawMessage) []abci.ValidatorUpdate
	ExportGenesis(sdk.Context, codec.JSONCodec) json.RawMessage
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/6ce2505/types/module/module.go#L191-L196)

#### `appmodule.HasGenesis` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulehasgenesis "Direct link to appmodulehasgenesis")

danger

`appmodule.HasGenesis` is experimental and should be considered unstable, it is recommended to not use this interface at this time.

core/appmodule/genesis.go

```codeBlockLines_e6Vv
// HasGenesis is the extension interface that modules should implement to handle
// genesis data and state initialization.
// WARNING: This interface is experimental and may change at any time.
type HasGenesis interface {
	AppModule

	// DefaultGenesis writes the default genesis for this module to the target.
	DefaultGenesis(GenesisTarget) error

	// ValidateGenesis validates the genesis data read from the source.
	ValidateGenesis(GenesisSource) error

	// InitGenesis initializes module state from the genesis source.
	InitGenesis(context.Context, GenesisSource) error

	// ExportGenesis exports module state to the genesis target.
	ExportGenesis(context.Context, GenesisTarget) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/6ce2505/core/appmodule/genesis.go#L8-L25)

### `AppModule` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodule "Direct link to appmodule")

The `AppModule` interface defines a module. Modules can declare their functionalities by implementing extensions interfaces.<br/>
`AppModule` s are managed by the [module manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#manager), which checks which extension interfaces are implemented by the module.

#### `appmodule.AppModule` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmoduleappmodule "Direct link to appmoduleappmodule")

core/appmodule/module.go

```codeBlockLines_e6Vv
// AppModule is a tag interface for app module implementations to use as a basis
// for extension interfaces. It provides no functionality itself, but is the
// type that all valid app modules should provide so that they can be identified
// by other modules (usually via depinject) as app modules.
type AppModule interface {
	depinject.OnePerModuleType

	// IsAppModule is a dummy method to tag a struct as implementing an AppModule.
	IsAppModule()
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/6afece6/core/appmodule/module.go#L11-L20)

#### `module.AppModule` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#moduleappmodule "Direct link to moduleappmodule")

note

Previously the `module.AppModule` interface was containing all the methods that are defined in the extensions interfaces. This was leading to much boilerplate for modules that did not need all the functionalities.

types/module/module.go

```codeBlockLines_e6Vv
// AppModule is the form for an application module. Most of
// its functionality has been moved to extension interfaces.
type AppModule interface {
	AppModuleBasic
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L195-L199)

### `HasInvariants` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasinvariants "Direct link to hasinvariants")

This interface defines one method. It allows to checks if a module can register invariants.

types/module/module.go

```codeBlockLines_e6Vv
type HasInvariants interface {
	// RegisterInvariants registers module invariants.
	RegisterInvariants(sdk.InvariantRegistry)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L202-L205)

- `RegisterInvariants(sdk.InvariantRegistry)`: Registers the [`invariants`](https://docs.cosmos.network/v0.50/build/building-modules/invariants) of the module. If an invariant deviates from its predicted value, the [`InvariantRegistry`](https://docs.cosmos.network/v0.50/build/building-modules/invariants#registry) triggers appropriate logic (most often the chain will be halted).

### `HasServices` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasservices "Direct link to hasservices")

This interface defines one method. It allows to checks if a module can register invariants.

#### `appmodule.HasService` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulehasservice "Direct link to appmodulehasservice")

core/appmodule/module.go

```codeBlockLines_e6Vv
// HasServices is the extension interface that modules should implement to register
// implementations of services defined in .proto files.
type HasServices interface {
	AppModule

	// RegisterServices registers the module's services with the app's service
	// registrar.
	//
	// Two types of services are currently supported:
	// - read-only gRPC query services, which are the default.
	// - transaction message services, which must have the protobuf service
	//   option "cosmos.msg.v1.service" (defined in "cosmos/msg/v1/service.proto")
	//   set to true.
	//
	// The service registrar will figure out which type of service you are
	// implementing based on the presence (or absence) of protobuf options. You
	// do not need to specify this in golang code.
	RegisterServices(grpc.ServiceRegistrar) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/6afece6/core/appmodule/module.go#L22-L40)

#### `module.HasServices` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#modulehasservices "Direct link to modulehasservices")

types/module/module.go

```codeBlockLines_e6Vv
type HasServices interface {
	// RegisterServices allows a module to register services.
	RegisterServices(Configurator)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L208-L211)

- `RegisterServices(Configurator)`: Allows a module to register services.

### `HasConsensusVersion` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasconsensusversion "Direct link to hasconsensusversion")

This interface defines one method for checking a module consensus version.

types/module/module.go

```codeBlockLines_e6Vv
type HasConsensusVersion interface {
	// ConsensusVersion is a sequence number for state-breaking change of the
	// module. It should be incremented on each consensus-breaking change
	// introduced by the module. To avoid wrong/empty versions, the initial version
	// should be set to 1.
	ConsensusVersion() uint64
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L214-L220)

- `ConsensusVersion() uint64`: Returns the consensus version of the module.

### `HasPreBlocker` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#haspreblocker "Direct link to haspreblocker")

The `HasPreBlocker` is an extension interface from `appmodule.AppModule`. All modules that have an `PreBlock` method implement this interface.

### `HasBeginBlocker` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasbeginblocker "Direct link to hasbeginblocker")

The `HasBeginBlocker` is an extension interface from `appmodule.AppModule`. All modules that have an `BeginBlock` method implement this interface.

core/appmodule/module.go

```codeBlockLines_e6Vv
type HasBeginBlocker interface {
	AppModule

	// BeginBlock is a method that will be run before transactions are processed in
	// a block.
	BeginBlock(context.Context) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/core/appmodule/module.go#L56-L63)

- `BeginBlock(context.Context) error`: This method gives module developers the option to implement logic that is automatically triggered at the beginning of each block.

### `HasEndBlocker` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasendblocker "Direct link to hasendblocker")

The `HasEndBlocker` is an extension interface from `appmodule.AppModule`. All modules that have an `EndBlock` method implement this interface. If a module need to return validator set updates (staking), they can use `HasABCIEndBlock`

core/appmodule/module.go

```codeBlockLines_e6Vv
type HasEndBlocker interface {
	AppModule

	// EndBlock is a method that will be run after transactions are processed in
	// a block.
	EndBlock(context.Context) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/core/appmodule/module.go#L66-L72)

- `EndBlock(context.Context) error`: This method gives module developers the option to implement logic that is automatically triggered at the end of each block.

### `HasABCIEndBlock` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasabciendblock "Direct link to hasabciendblock")

The `HasABCIEndBlock` is an extension interface from `module.AppModule`. All modules that have an `EndBlock` which return validator set updates implement this interface.

types/module/module.go

```codeBlockLines_e6Vv
type HasABCIEndblock interface {
	AppModule
	EndBlock(context.Context) ([]abci.ValidatorUpdate, error)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L222-L225)

- `EndBlock(context.Context) ([]abci.ValidatorUpdate, error)`: This method gives module developers the option to inform the underlying consensus engine of validator set changes (e.g. the `staking` module).

### `HasPrecommit` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasprecommit "Direct link to hasprecommit")

`HasPrecommit` is an extension interface from `appmodule.AppModule`. All modules that have a `Precommit` method implement this interface.

core/appmodule/module.go

```codeBlockLines_e6Vv
type HasPrecommit interface {
	AppModule
	Precommit(context.Context) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/core/appmodule/module.go#L49-L52)

- `Precommit(context.Context)`: This method gives module developers the option to implement logic that is automatically triggered during [\`Commit'](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#commit) of each block using the [`finalizeblockstate`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#state-updates) of the block to be committed. Implement empty if no logic needs to be triggered during `Commit` of each block for this module.

### `HasPrepareCheckState` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#haspreparecheckstate "Direct link to haspreparecheckstate")

`HasPrepareCheckState` is an extension interface from `appmodule.AppModule`. All modules that have a `PrepareCheckState` method implement this interface.

core/appmodule/module.go

```codeBlockLines_e6Vv
type HasPrecommit interface {
	AppModule
	Precommit(context.Context) error
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/core/appmodule/module.go#L49-L52)

- `PrepareCheckState(context.Context)`: This method gives module developers the option to implement logic that is automatically triggered during [\`Commit'](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#commit) of each block using the [`checkState`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#state-updates) of the next block. Implement empty if no logic needs to be triggered during `Commit` of each block for this module.

### Implementing the Application Module Interfaces [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#implementing-the-application-module-interfaces "Direct link to Implementing the Application Module Interfaces")

Typically, the various application module interfaces are implemented in a file called `module.go`, located in the module's folder (e.g. `./x/module/module.go`).

Almost every module needs to implement the `AppModuleBasic` and `AppModule` interfaces. If the module is only used for genesis, it will implement `AppModuleGenesis` instead of `AppModule`. The concrete type that implements the interface can add parameters that are required for the implementation of the various methods of the interface. For example, the `Route()` function often calls a `NewMsgServerImpl(k keeper)` function defined in `keeper/msg_server.go` and therefore needs to pass the module's [`keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper) as a parameter.

```codeBlockLines_e6Vv
// example
type AppModule struct {
    AppModuleBasic
    keeper       Keeper
}

```

In the example above, you can see that the `AppModule` concrete type references an `AppModuleBasic`, and not an `AppModuleGenesis`. That is because `AppModuleGenesis` only needs to be implemented in modules that focus on genesis-related functionalities. In most modules, the concrete `AppModule` type will have a reference to an `AppModuleBasic` and implement the two added methods of `AppModuleGenesis` directly in the `AppModule` type.

If no parameter is required (which is often the case for `AppModuleBasic`), just declare an empty concrete type like so:

```codeBlockLines_e6Vv
type AppModuleBasic struct{}

```

## Module Managers [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#module-managers "Direct link to Module Managers")

Module managers are used to manage collections of `AppModuleBasic` and `AppModule`.

### `BasicManager` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#basicmanager "Direct link to basicmanager")

The `BasicManager` is a structure that lists all the `AppModuleBasic` of an application:

types/module/module.go

```codeBlockLines_e6Vv
type BasicManager map[string]AppModuleBasic

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L82)

It implements the following methods:

- `NewBasicManager(modules …AppModuleBasic)`: Constructor function. It takes a list of the application's `AppModuleBasic` and builds a new `BasicManager`. This function is generally called in the `init()` function of [`app.go`](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#core-application-file) to quickly initialize the independent elements of the application's modules (click [here](https://github.com/cosmos/gaia/blob/main/app/app.go#L59-L74) to see an example).
- `NewBasicManagerFromManager(manager *Manager, customModuleBasics map[string]AppModuleBasic)`: Constructor function. It creates a new `BasicManager` from a `Manager`. The `BasicManager` will contain all `AppModuleBasic` from the `AppModule` manager using `CoreAppModuleBasicAdaptor` whenever possible. Module's `AppModuleBasic` can be overridden by passing a custom AppModuleBasic map
- `RegisterLegacyAminoCodec(cdc *codec.LegacyAmino)`: Registers the [`codec.LegacyAmino` s](https://docs.cosmos.network/v0.50/learn/advanced/encoding#amino) of each of the application's `AppModuleBasic`. This function is usually called early on in the [application's construction](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor).
- `RegisterInterfaces(registry codectypes.InterfaceRegistry)`: Registers interface types and implementations of each of the application's `AppModuleBasic`.
- `DefaultGenesis(cdc codec.JSONCodec)`: Provides default genesis information for modules in the application by calling the [`DefaultGenesis(cdc codec.JSONCodec)`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#defaultgenesis) function of each module. It only calls the modules that implements the `HasGenesisBasics` interfaces.
- `ValidateGenesis(cdc codec.JSONCodec, txEncCfg client.TxEncodingConfig, genesis map[string]json.RawMessage)`: Validates the genesis information modules by calling the [`ValidateGenesis(codec.JSONCodec, client.TxEncodingConfig, json.RawMessage)`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#validategenesis) function of modules implementing the `HasGenesisBasics` interface.
- `RegisterGRPCGatewayRoutes(clientCtx client.Context, rtr *runtime.ServeMux)`: Registers gRPC routes for modules.
- `AddTxCommands(rootTxCmd *cobra.Command)`: Adds modules' transaction commands (defined as `GetTxCmd() *cobra.Command`) to the application's [`rootTxCommand`](https://docs.cosmos.network/v0.50/learn/advanced/cli#transaction-commands). This function is usually called function from the `main.go` function of the [application's command-line interface](https://docs.cosmos.network/v0.50/learn/advanced/cli).
- `AddQueryCommands(rootQueryCmd *cobra.Command)`: Adds modules' query commands (defined as `GetQueryCmd() *cobra.Command`) to the application's [`rootQueryCommand`](https://docs.cosmos.network/v0.50/learn/advanced/cli#query-commands). This function is usually called function from the `main.go` function of the [application's command-line interface](https://docs.cosmos.network/v0.50/learn/advanced/cli).

### `Manager` [​](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#manager "Direct link to manager")

The `Manager` is a structure that holds all the `AppModule` of an application, and defines the order of execution between several key components of these modules:

types/module/module.go

```codeBlockLines_e6Vv
type Manager struct {
	Modules                  map[string]interface{} // interface{} is used now to support the legacy AppModule as well as new core appmodule.AppModule.
	OrderInitGenesis         []string
	OrderExportGenesis       []string
	OrderBeginBlockers       []string
	OrderEndBlockers         []string
	OrderPrepareCheckStaters []string
	OrderPrecommiters        []string
	OrderMigrations          []string
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/types/module/module.go#L267-L276)

The module manager is used throughout the application whenever an action on a collection of modules is required. It implements the following methods:

- `NewManager(modules …AppModule)`: Constructor function. It takes a list of the application's `AppModule` s and builds a new `Manager`. It is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).
- `SetOrderInitGenesis(moduleNames …string)`: Sets the order in which the [`InitGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#initgenesis) function of each module will be called when the application is first started. This function is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).<br/>
  To initialize modules successfully, module dependencies should be considered. For example, the `genutil` module must occur after `staking` module so that the pools are properly initialized with tokens from genesis accounts, the `genutils` module must also occur after `auth` so that it can access the params from auth, IBC's `capability` module should be initialized before all other modules so that it can initialize any capabilities.
- `SetOrderExportGenesis(moduleNames …string)`: Sets the order in which the [`ExportGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#exportgenesis) function of each module will be called in case of an export. This function is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).
- `SetOrderPreBlockers(moduleNames …string)`: Sets the order in which the `PreBlock()` function of each module will be called before `BeginBlock()` of all modules. This function is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).
- `SetOrderBeginBlockers(moduleNames …string)`: Sets the order in which the `BeginBlock()` function of each module will be called at the beginning of each block. This function is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).
- `SetOrderEndBlockers(moduleNames …string)`: Sets the order in which the `EndBlock()` function of each module will be called at the end of each block. This function is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).
- `SetOrderPrecommiters(moduleNames …string)`: Sets the order in which the `Precommit()` function of each module will be called during commit of each block. This function is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).
- `SetOrderPrepareCheckStaters(moduleNames …string)`: Sets the order in which the `PrepareCheckState()` function of each module will be called during commit of each block. This function is generally called from the application's main [constructor function](https://docs.cosmos.network/v0.50/learn/beginner/app-anatomy#constructor-function).
- `SetOrderMigrations(moduleNames …string)`: Sets the order of migrations to be run. If not set then migrations will be run with an order defined in `DefaultMigrationsOrder`.
- `RegisterInvariants(ir sdk.InvariantRegistry)`: Registers the [invariants](https://docs.cosmos.network/v0.50/build/building-modules/invariants) of module implementing the `HasInvariants` interface.
- `RegisterServices(cfg Configurator)`: Registers the services of modules implementing the `HasServices` interface.
- `InitGenesis(ctx context.Context, cdc codec.JSONCodec, genesisData map[string]json.RawMessage)`: Calls the [`InitGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#initgenesis) function of each module when the application is first started, in the order defined in `OrderInitGenesis`. Returns an `abci.ResponseInitChain` to the underlying consensus engine, which can contain validator updates.
- `ExportGenesis(ctx context.Context, cdc codec.JSONCodec)`: Calls the [`ExportGenesis`](https://docs.cosmos.network/v0.50/build/building-modules/genesis#exportgenesis) function of each module, in the order defined in `OrderExportGenesis`. The export constructs a genesis file from a previously existing state, and is mainly used when a hard-fork upgrade of the chain is required.
- `ExportGenesisForModules(ctx context.Context, cdc codec.JSONCodec, modulesToExport []string)`: Behaves the same as `ExportGenesis`, except takes a list of modules to export.
- `BeginBlock(ctx context.Context) error`: At the beginning of each block, this function is called from [`BaseApp`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#beginblock) and, in turn, calls the [`BeginBlock`](https://docs.cosmos.network/v0.50/build/building-modules/beginblock-endblock) function of each modules implementing the `appmodule.HasBeginBlocker` interface, in the order defined in `OrderBeginBlockers`. It creates a child [context](https://docs.cosmos.network/v0.50/learn/advanced/context) with an event manager to aggregate [events](https://docs.cosmos.network/v0.50/learn/advanced/events) emitted from each modules.
- `EndBlock(ctx context.Context) error`: At the end of each block, this function is called from [`BaseApp`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#endblock) and, in turn, calls the [`EndBlock`](https://docs.cosmos.network/v0.50/build/building-modules/beginblock-endblock) function of each modules implementing the `appmodule.HasEndBlocker` interface, in the order defined in `OrderEndBlockers`. It creates a child [context](https://docs.cosmos.network/v0.50/learn/advanced/context) with an event manager to aggregate [events](https://docs.cosmos.network/v0.50/learn/advanced/events) emitted from all modules. The function returns an `abci` which contains the aforementioned events, as well as validator set updates (if any).
- `EndBlock(context.Context) ([]abci.ValidatorUpdate, error)`: At the end of each block, this function is called from [`BaseApp`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#endblock) and, in turn, calls the [`EndBlock`](https://docs.cosmos.network/v0.50/build/building-modules/beginblock-endblock) function of each modules implementing the `module.HasABCIEndBlock` interface, in the order defined in `OrderEndBlockers`. It creates a child [context](https://docs.cosmos.network/v0.50/learn/advanced/context) with an event manager to aggregate [events](https://docs.cosmos.network/v0.50/learn/advanced/events) emitted from all modules. The function returns an `abci` which contains the aforementioned events, as well as validator set updates (if any).
- `Precommit(ctx context.Context)`: During [`Commit`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#commit), this function is called from `BaseApp` immediately before the [`deliverState`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#state-updates) is written to the underlying [`rootMultiStore`](https://docs.cosmos.network/v0.50/learn/advanced/store#commitmultistore) and, in turn calls the `Precommit` function of each modules implementing the `HasPrecommit` interface, in the order defined in `OrderPrecommiters`. It creates a child [context](https://docs.cosmos.network/v0.50/learn/advanced/context) where the underlying `CacheMultiStore` is that of the newly committed block's [`finalizeblockstate`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#state-updates).
- `PrepareCheckState(ctx context.Context)`: During [`Commit`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#commit), this function is called from `BaseApp` immediately after the [`deliverState`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#state-updates) is written to the underlying [`rootMultiStore`](https://docs.cosmos.network/v0.50/learn/advanced/store#commitmultistore) and, in turn calls the `PrepareCheckState` function of each module implementing the `HasPrepareCheckState` interface, in the order defined in `OrderPrepareCheckStaters`. It creates a child [context](https://docs.cosmos.network/v0.50/learn/advanced/context) where the underlying `CacheMultiStore` is that of the next block's [`checkState`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#state-updates). Writes to this state will be present in the [`checkState`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#state-updates) of the next block, and therefore this method can be used to prepare the `checkState` for the next block.

Here's an example of a concrete integration within an `simapp`:

simapp/app.go

```codeBlockLines_e6Vv
app.ModuleManager = module.NewManager(
	genutil.NewAppModule(
		app.AccountKeeper, app.StakingKeeper, app,
		txConfig,
	),
	auth.NewAppModule(appCodec, app.AccountKeeper, authsims.RandomGenesisAccounts, app.GetSubspace(authtypes.ModuleName)),
	vesting.NewAppModule(app.AccountKeeper, app.BankKeeper),
	bank.NewAppModule(appCodec, app.BankKeeper, app.AccountKeeper, app.GetSubspace(banktypes.ModuleName)),
	crisis.NewAppModule(app.CrisisKeeper, skipGenesisInvariants, app.GetSubspace(crisistypes.ModuleName)),
	feegrantmodule.NewAppModule(appCodec, app.AccountKeeper, app.BankKeeper, app.FeeGrantKeeper, app.interfaceRegistry),
	gov.NewAppModule(appCodec, &app.GovKeeper, app.AccountKeeper, app.BankKeeper, app.GetSubspace(govtypes.ModuleName)),
	mint.NewAppModule(appCodec, app.MintKeeper, app.AccountKeeper, nil, app.GetSubspace(minttypes.ModuleName)),
	slashing.NewAppModule(appCodec, app.SlashingKeeper, app.AccountKeeper, app.BankKeeper, app.StakingKeeper, app.GetSubspace(slashingtypes.ModuleName), app.interfaceRegistry),
	distr.NewAppModule(appCodec, app.DistrKeeper, app.AccountKeeper, app.BankKeeper, app.StakingKeeper, app.GetSubspace(distrtypes.ModuleName)),
	staking.NewAppModule(appCodec, app.StakingKeeper, app.AccountKeeper, app.BankKeeper, app.GetSubspace(stakingtypes.ModuleName)),
	upgrade.NewAppModule(app.UpgradeKeeper, app.AccountKeeper.AddressCodec()),
	evidence.NewAppModule(app.EvidenceKeeper),
	params.NewAppModule(app.ParamsKeeper),
	authzmodule.NewAppModule(appCodec, app.AuthzKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
	groupmodule.NewAppModule(appCodec, app.GroupKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
	nftmodule.NewAppModule(appCodec, app.NFTKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
	consensus.NewAppModule(appCodec, app.ConsensusParamsKeeper),
	circuit.NewAppModule(appCodec, app.CircuitKeeper),
)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/simapp/app.go#L411-L434)

This is the same example from `runtime` (the package that powers app di):

runtime/module.go

```codeBlockLines_e6Vv
func init() {

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/runtime/module.go#L61)

runtime/module.go

```codeBlockLines_e6Vv
func ProvideApp(interfaceRegistry codectypes.InterfaceRegistry) (

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/runtime/module.go#L82)

- [Application Module Interfaces](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#application-module-interfaces)
  - [`AppModuleBasic`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodulebasic)
  - [`HasName`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasname)
  - [Genesis](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#genesis)
  - [`AppModule`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#appmodule)
  - [`HasInvariants`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasinvariants)
  - [`HasServices`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasservices)
  - [`HasConsensusVersion`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasconsensusversion)
  - [`HasPreBlocker`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#haspreblocker)
  - [`HasBeginBlocker`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasbeginblocker)
  - [`HasEndBlocker`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasendblocker)
  - [`HasABCIEndBlock`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasabciendblock)
  - [`HasPrecommit`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#hasprecommit)
  - [`HasPrepareCheckState`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#haspreparecheckstate)
  - [Implementing the Application Module Interfaces](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#implementing-the-application-module-interfaces)
- [Module Managers](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#module-managers)
  - [`BasicManager`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#basicmanager)
  - [`Manager`](https://docs.cosmos.network/v0.50/build/building-modules/module-manager#manager)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=bUO1BXI8H9PgjAPSW9hwuSeI&size=invisible&cb=5agikwysi2n)

#### Msg Services

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/msg-services)** (v0.52).

Version: v0.50

On this page

# `Msg` Services

Synopsis

A Protobuf `Msg` service processes [messages](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#messages). Protobuf `Msg` services are specific to the module in which they are defined, and only process messages defined within the said module. They are called from `BaseApp` during [`DeliverTx`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#delivertx).

Pre-requisite Readings

- [Module Manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager)
- [Messages and Queries](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries)

## Implementation of a Module `Msg` Service [​](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#implementation-of-a-module-msg-service "Direct link to implementation-of-a-module-msg-service")

Each module should define a Protobuf `Msg` service, which will be responsible for processing requests (implementing `sdk.Msg`) and returning responses.

As further described in [ADR 031](https://docs.cosmos.network/v0.50/build/architecture/adr-031-msg-service), this approach has the advantage of clearly specifying return types and generating server and client code.

Protobuf generates a `MsgServer` interface based on a definition of `Msg` service. It is the role of the module developer to implement this interface, by implementing the state transition logic that should happen upon receival of each `sdk.Msg`. As an example, here is the generated `MsgServer` interface for `x/bank`, which exposes two `sdk.Msg` s:

x/bank/types/tx.pb.go

```codeBlockLines_e6Vv
// MsgServer is the server API for Msg service.
type MsgServer interface {
	// Send defines a method for sending coins from one account to another account.
	Send(context.Context, *MsgSend) (*MsgSendResponse, error)
	// MultiSend defines a method for sending coins from some accounts to other accounts.
	MultiSend(context.Context, *MsgMultiSend) (*MsgMultiSendResponse, error)
	// UpdateParams defines a governance operation for updating the x/bank module parameters.
	// The authority is defined in the keeper.
	//
	// Since: cosmos-sdk 0.47
	UpdateParams(context.Context, *MsgUpdateParams) (*MsgUpdateParamsResponse, error)
	// SetSendEnabled is a governance operation for setting the SendEnabled flag
	// on any number of Denoms. Only the entries to add or update should be
	// included. Entries that already exist in the store, but that aren't
	// included in this message, will be left unchanged.
	//
	// Since: cosmos-sdk 0.47
	SetSendEnabled(context.Context, *MsgSetSendEnabled) (*MsgSetSendEnabledResponse, error)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/types/tx.pb.go#L550-L568)

When possible, the existing module's [`Keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper) should implement `MsgServer`, otherwise a `msgServer` struct that embeds the `Keeper` can be created, typically in `./keeper/msg_server.go`:

x/bank/keeper/msg_server.go

```codeBlockLines_e6Vv
type msgServer struct {
	Keeper
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/keeper/msg_server.go#L17-L19)

`msgServer` methods can retrieve the `context.Context` from the `context.Context` parameter method using the `sdk.UnwrapSDKContext`:

x/bank/keeper/msg_server.go

```codeBlockLines_e6Vv
ctx := sdk.UnwrapSDKContext(goCtx)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/keeper/msg_server.go#L56)

`sdk.Msg` processing usually follows these 3 steps:

### Validation [​](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#validation "Direct link to Validation")

The message server must perform all validation required (both _stateful_ and _stateless_) to make sure the `message` is valid.<br/>
The `signer` is charged for the gas cost of this validation.

For example, a `msgServer` method for a `transfer` message should check that the sending account has enough funds to actually perform the transfer.

It is recommended to implement all validation checks in a separate function that passes state values as arguments. This implementation simplifies testing. As expected, expensive validation functions charge additional gas. Example:

```codeBlockLines_e6Vv
ValidateMsgA(msg MsgA, now Time, gm GasMeter) error {
    if now.Before(msg.Expire) {
        return sdkerrrors.ErrInvalidRequest.Wrap("msg expired")
    }
    gm.ConsumeGas(1000, "signature verification")
    return signatureVerificaton(msg.Prover, msg.Data)
}

```

danger

Previously, the `ValidateBasic` method was used to perform simple and stateless validation checks.<br/>
This way of validating is deprecated, this means the `msgServer` must perform all validation checks.

### State Transition [​](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#state-transition "Direct link to State Transition")

After the validation is successful, the `msgServer` method uses the [`keeper`](https://docs.cosmos.network/v0.50/build/building-modules/keeper) functions to access the state and perform a state transition.

### Events [​](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#events "Direct link to Events")

Before returning, `msgServer` methods generally emit one or more [events](https://docs.cosmos.network/v0.50/learn/advanced/events) by using the `EventManager` held in the `ctx`. Use the new `EmitTypedEvent` function that uses protobuf-based event types:

```codeBlockLines_e6Vv
ctx.EventManager().EmitTypedEvent(
    &group.EventABC{Key1: Value1,  Key2, Value2})

```

or the older `EmitEvent` function:

```codeBlockLines_e6Vv
ctx.EventManager().EmitEvent(
    sdk.NewEvent(
        eventType,  // e.g. sdk.EventTypeMessage for a message, types.CustomEventType for a custom event defined in the module
        sdk.NewAttribute(key1, value1),
        sdk.NewAttribute(key2, value2),
    ),
)

```

These events are relayed back to the underlying consensus engine and can be used by service providers to implement services around the application. Click [here](https://docs.cosmos.network/v0.50/learn/advanced/events) to learn more about events.

The invoked `msgServer` method returns a `proto.Message` response and an `error`. These return values are then wrapped into an `*sdk.Result` or an `error` using `sdk.WrapServiceResult(ctx context.Context, res proto.Message, err error)`:

baseapp/msg_service_router.go

```codeBlockLines_e6Vv
return sdk.WrapServiceResult(ctx, resMsg, err)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/baseapp/msg_service_router.go#L160)

This method takes care of marshaling the `res` parameter to protobuf and attaching any events on the `ctx.EventManager()` to the `sdk.Result`.

proto/cosmos/base/abci/v1beta1/abci.proto

```codeBlockLines_e6Vv
// Result is the union of ResponseFormat and ResponseCheckTx.
message Result {
  option (gogoproto.goproto_getters) = false;

  // Data is any data returned from message or handler execution. It MUST be
  // length prefixed in order to separate data from multiple message executions.
  // Deprecated. This field is still populated, but prefer msg_response instead
  // because it also contains the Msg response typeURL.
  bytes data = 1 [deprecated = true];

  // Log contains the log information from message or handler execution.
  string log = 2;

  // Events contains a slice of Event objects that were emitted during message
  // or handler execution.
  repeated tendermint.abci.Event events = 3 [(gogoproto.nullable) = false];

  // msg_responses contains the Msg handler responses type packed in Anys.
  //
  // Since: cosmos-sdk 0.46
  repeated google.protobuf.Any msg_responses = 4;

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/proto/cosmos/base/abci/v1beta1/abci.proto#L93-L113)

This diagram shows a typical structure of a Protobuf `Msg` service, and how the message propagates through the module.

![Transaction flow](https://raw.githubusercontent.com/cosmos/cosmos-sdk/release/v0.46.x/docs/uml/svg/transaction_flow.svg)

## Telemetry [​](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#telemetry "Direct link to Telemetry")

New [telemetry metrics](https://docs.cosmos.network/v0.50/learn/advanced/telemetry) can be created from `msgServer` methods when handling messages.

This is an example from the `x/auth/vesting` module:

x/auth/vesting/msg_server.go

```codeBlockLines_e6Vv
defer func() {
	telemetry.IncrCounter(1, "new", "account")

	for _, a := range msg.Amount {
		if a.Amount.IsInt64() {
			telemetry.SetGaugeWithLabels(
				[]string{"tx", "msg", "create_vesting_account"},
				float32(a.Amount.Int64()),
				[]metrics.Label{telemetry.NewLabel("denom", a.Denom)},
			)
		}
	}
}()

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/auth/vesting/msg_server.go#L76-L88)

- [Implementation of a module `Msg` service](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#implementation-of-a-module-msg-service)
  - [Validation](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#validation)
  - [State Transition](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#state-transition)
  - [Events](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#events)
- [Telemetry](https://docs.cosmos.network/v0.50/build/building-modules/msg-services#telemetry)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=61ky0fynpv15)

### Pre-Blocker

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/preblock#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/learn)** (v0.52).

Version: v0.50

On this page

# PreBlocker

Synopsis

`PreBlocker` is optional method module developers can implement in their module. They will be triggered before [`BeginBlock`](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#beginblock).

Pre-requisite Readings

- [Module Manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager)

## PreBlocker [​](https://docs.cosmos.network/v0.50/build/building-modules/preblock#preblocker-1 "Direct link to PreBlocker")

There are two semantics around the new lifecycle method:

- It runs before the `BeginBlocker` of all modules
- It can modify consensus parameters in storage, and signal the caller through the return value.

When it returns `ConsensusParamsChanged=true`, the caller must refresh the consensus parameter in the deliver context:

```codeBlockLines_e6Vv
app.finalizeBlockState.ctx = app.finalizeBlockState.ctx.WithConsensusParams(app.GetConsensusParams())

```

The new ctx must be passed to all the other lifecycle methods.

- [PreBlocker](https://docs.cosmos.network/v0.50/build/building-modules/preblock#preblocker-1)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=uso1gzqiyhhg)

### Proto Annotations

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/protobuf-annotations)** (v0.52).

Version: v0.50

On this page

# ProtocolBuffer Annotations

This document explains the various protobuf scalars that have been added to make working with protobuf easier for Cosmos SDK application developers

## Signer [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#signer "Direct link to Signer")

Signer specifies which field should be used to determine the signer of a message for the Cosmos SDK. This field can be used for clients as well to infer which field should be used to determine the signer of a message.

Read more about the signer field [here](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries).

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
option (cosmos.msg.v1.signer) = "from_address";

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e6848d99b55a65d014375b295bdd7f9641aac95e/proto/cosmos/bank/v1beta1/tx.proto#L40)

```codeBlockLines_e6Vv
option (cosmos.msg.v1.signer) = "from_address";

```

## Scalar [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#scalar "Direct link to Scalar")

The scalar type defines a way for clients to understand how to construct protobuf messages according to what is expected by the module and sdk.

```codeBlockLines_e6Vv
(cosmos_proto.scalar) = "cosmos.AddressString"

```

Example of account address string scalar:

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
string   from_address                    = 1 [(cosmos_proto.scalar) = "cosmos.AddressString"];

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e6848d99b55a65d014375b295bdd7f9641aac95e/proto/cosmos/bank/v1beta1/tx.proto#L46)

Example of validator address string scalar:

proto/cosmos/distribution/v1beta1/query.proto

```codeBlockLines_e6Vv
string validator_address = 1 [(cosmos_proto.scalar) = "cosmos.ValidatorAddressString"];

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/proto/cosmos/distribution/v1beta1/query.proto#L87)

Example of Decimals scalar:

proto/cosmos/distribution/v1beta1/distribution.proto

```codeBlockLines_e6Vv
(cosmos_proto.scalar)  = "cosmos.Dec",

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/proto/cosmos/distribution/v1beta1/distribution.proto#L26)

Example of Int scalar:

proto/cosmos/gov/v1/gov.proto

```codeBlockLines_e6Vv
string yes_count = 1 [(cosmos_proto.scalar) = "cosmos.Int"];

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/proto/cosmos/gov/v1/gov.proto#L137)

There are a few options for what can be provided as a scalar: `cosmos.AddressString`, `cosmos.ValidatorAddressString`, `cosmos.ConsensusAddressString`, `cosmos.Int`, `cosmos.Dec`.

## Implements_Interface [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#implements_interface "Direct link to Implements_Interface")

Implement interface is used to provide information to client tooling like [telescope](https://github.com/cosmology-tech/telescope) on how to encode and decode protobuf messages.

```codeBlockLines_e6Vv
option (cosmos_proto.implements_interface) = "cosmos.auth.v1beta1.AccountI";

```

## Method,Field,Message Added In [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#methodfieldmessage-added-in "Direct link to Method,Field,Message Added In")

`method_added_in`, `field_added_in` and `message_added_in` are annotations to denotate to clients that a field has been supported in a later version. This is useful when new methods or fields are added in later versions and that the client needs to be aware of what it can call.

The annotation should be worded as follow:

```codeBlockLines_e6Vv
option (cosmos_proto.method_added_in) = "cosmos-sdk v0.50.1";
option (cosmos_proto.method_added_in) = "x/epochs v1.0.0";
option (cosmos_proto.method_added_in) = "simapp v24.0.0";

```

## Amino [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#amino "Direct link to Amino")

The amino codec was removed in `v0.50+`, this means there is not a need register `legacyAminoCodec`. To replace the amino codec, Amino protobuf annotations are used to provide information to the amino codec on how to encode and decode protobuf messages.

note

Amino annotations are only used for backwards compatibility with amino. New modules are not required use amino annotations.

The below annotations are used to provide information to the amino codec on how to encode and decode protobuf messages in a backwards compatible manner.

### Name [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#name "Direct link to Name")

Name specifies the amino name that would show up for the user in order for them see which message they are signing.

```codeBlockLines_e6Vv
option (amino.name) = "cosmos-sdk/BaseAccount";

```

proto/cosmos/bank/v1beta1/tx.proto

```codeBlockLines_e6Vv
option (amino.name)           = "cosmos-sdk/MsgSend";

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/proto/cosmos/bank/v1beta1/tx.proto#L41)

### Field_Name [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#field_name "Direct link to Field_Name")

Field name specifies the amino name that would show up for the user in order for them see which field they are signing.

```codeBlockLines_e6Vv
uint64 height = 1 [(amino.field_name) = "public_key"];

```

proto/cosmos/distribution/v1beta1/distribution.proto

```codeBlockLines_e6Vv
[(gogoproto.jsontag) = "creation_height", (amino.field_name) = "creation_height", (amino.dont_omitempty) = true];

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/proto/cosmos/distribution/v1beta1/distribution.proto#L166)

### Dont_OmitEmpty [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#dont_omitempty "Direct link to Dont_OmitEmpty")

Dont omitempty specifies that the field should not be omitted when encoding to amino.

```codeBlockLines_e6Vv
repeated cosmos.base.v1beta1.Coin amount = 3 [(amino.dont_omitempty)   = true];

```

proto/cosmos/bank/v1beta1/bank.proto

```codeBlockLines_e6Vv
(amino.dont_omitempty)   = true,

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/proto/cosmos/bank/v1beta1/bank.proto#L56)

### Encoding [​](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#encoding "Direct link to Encoding")

Encoding instructs the amino json marshaler how to encode certain fields that may differ from the standard encoding behaviour. The most common example of this is how `repeated cosmos.base.v1beta1.Coin` is encoded when using the amino json encoding format. The `legacy_coins` option tells the json marshaler [how to encode a null slice](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/x/tx/signing/aminojson/json_marshal.go#L65) of `cosmos.base.v1beta1.Coin`.

```codeBlockLines_e6Vv
(amino.encoding)         = "legacy_coins",

```

proto/cosmos/bank/v1beta1/genesis.proto

```codeBlockLines_e6Vv
(amino.encoding)         = "legacy_coins",

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/e8f28bf5db18b8d6b7e0d94b542ce4cf48fed9d6/proto/cosmos/bank/v1beta1/genesis.proto#L23)

- [Signer](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#signer)
- [Scalar](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#scalar)
- [Implements_Interface](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#implements_interface)
- [Method,Field,Message Added In](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#methodfieldmessage-added-in)
- [Amino](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#amino)
  - [Name](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#name)
  - [Field_Name](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#field_name)
  - [Dont_OmitEmpty](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#dont_omitempty)
  - [Encoding](https://docs.cosmos.network/v0.50/build/building-modules/protobuf-annotations#encoding)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=j4sy30st8l1t)

#### Query Services

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/query-services#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/query-services)** (v0.52).

Version: v0.50

On this page

# Query Services

Synopsis

A Protobuf Query service processes [`queries`](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries#queries). Query services are specific to the module in which they are defined, and only process `queries` defined within said module. They are called from `BaseApp`'s [`Query` method](https://docs.cosmos.network/v0.50/learn/advanced/baseapp#query).

Pre-requisite Readings

- [Module Manager](https://docs.cosmos.network/v0.50/build/building-modules/module-manager)
- [Messages and Queries](https://docs.cosmos.network/v0.50/build/building-modules/messages-and-queries)

## Implementation of a Module Query Service [​](https://docs.cosmos.network/v0.50/build/building-modules/query-services#implementation-of-a-module-query-service "Direct link to Implementation of a module query service")

### gRPC Service [​](https://docs.cosmos.network/v0.50/build/building-modules/query-services#grpc-service "Direct link to gRPC Service")

When defining a Protobuf `Query` service, a `QueryServer` interface is generated for each module with all the service methods:

```codeBlockLines_e6Vv
type QueryServer interface {
    QueryBalance(context.Context, *QueryBalanceParams) (*types.Coin, error)
    QueryAllBalances(context.Context, *QueryAllBalancesParams) (*QueryAllBalancesResponse, error)
}

```

These custom queries methods should be implemented by a module's keeper, typically in `./keeper/grpc_query.go`. The first parameter of these methods is a generic `context.Context`. Therefore, the Cosmos SDK provides a function `sdk.UnwrapSDKContext` to retrieve the `context.Context` from the provided<br/>
`context.Context`.

Here's an example implementation for the bank module:

x/bank/keeper/grpc_query.go

```codeBlockLines_e6Vv
loading...

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/keeper/grpc_query.go)

### Calling Queries from the State Machine [​](https://docs.cosmos.network/v0.50/build/building-modules/query-services#calling-queries-from-the-state-machine "Direct link to Calling queries from the State Machine")

The Cosmos SDK v0.47 introduces a new `cosmos.query.v1.module_query_safe` Protobuf annotation which is used to state that a query that is safe to be called from within the state machine, for example:

- a Keeper's query function can be called from another module's Keeper,
- ADR-033 intermodule query calls,
- CosmWasm contracts can also directly interact with these queries.

If the `module_query_safe` annotation set to `true`, it means:

- The query is deterministic: given a block height it will return the same response upon multiple calls, and doesn't introduce any state-machine breaking changes across SDK patch versions.
- Gas consumption never fluctuates across calls and across patch versions.

If you are a module developer and want to use `module_query_safe` annotation for your own query, you have to ensure the following things:

- the query is deterministic and won't introduce state-machine-breaking changes without coordinated upgrades
- it has its gas tracked, to avoid the attack vector where no gas is accounted for<br/>
  on potentially high-computation queries.

- [Implementation of a module query service](https://docs.cosmos.network/v0.50/build/building-modules/query-services#implementation-of-a-module-query-service)
  - [gRPC Service](https://docs.cosmos.network/v0.50/build/building-modules/query-services#grpc-service)
  - [Calling queries from the State Machine](https://docs.cosmos.network/v0.50/build/building-modules/query-services#calling-queries-from-the-state-machine)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=vdgfetdjivd7)

#### Simulator

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/simulator#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/simulator)** (v0.52).

Version: v0.50

On this page

# Module Simulation

Pre-requisite Readings

- [Cosmos Blockchain Simulator](https://docs.cosmos.network/v0.50/learn/advanced/simulation)

## Synopsis [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#synopsis "Direct link to Synopsis")

This document details how to define each module simulation functions to be<br/>
integrated with the application `SimulationManager`.

- [Simulation package](https://docs.cosmos.network/v0.50/build/building-modules/simulator#simulation-package)
  - [Store decoders](https://docs.cosmos.network/v0.50/build/building-modules/simulator#store-decoders)
  - [Randomized genesis](https://docs.cosmos.network/v0.50/build/building-modules/simulator#randomized-genesis)
  - [Random weighted operations](https://docs.cosmos.network/v0.50/build/building-modules/simulator#random-weighted-operations)
  - [Random proposal contents](https://docs.cosmos.network/v0.50/build/building-modules/simulator#random-proposal-contents)
- [Registering simulation functions](https://docs.cosmos.network/v0.50/build/building-modules/simulator#registering-simulation-functions)
- [App Simulator manager](https://docs.cosmos.network/v0.50/build/building-modules/simulator#app-simulator-manager)

## Simulation Package [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#simulation-package "Direct link to Simulation package")

Every module that implements the Cosmos SDK simulator needs to have a `x/<module>/simulation`<br/>
package which contains the primary functions required by the fuzz tests: store<br/>
decoders, randomized genesis state and parameters, weighted operations and proposal<br/>
contents.

### Store Decoders [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#store-decoders "Direct link to Store decoders")

Registering the store decoders is required for the `AppImportExport`. This allows<br/>
for the key-value pairs from the stores to be decoded (_i.e_ unmarshalled)<br/>
to their corresponding types. In particular, it matches the key to a concrete type<br/>
and then unmarshals the value from the `KVPair` to the type provided.

You can use the example [here](https://github.com/cosmos/cosmos-sdk/blob/v/x/distribution/simulation/decoder.go) from the distribution module to implement your store decoders.

### Randomized Genesis [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#randomized-genesis "Direct link to Randomized genesis")

The simulator tests different scenarios and values for genesis parameters<br/>
in order to fully test the edge cases of specific modules. The `simulator` package from each module must expose a `RandomizedGenState` function to generate the initial random `GenesisState` from a given seed.

Once the module genesis parameter are generated randomly (or with the key and<br/>
values defined in a `params` file), they are marshaled to JSON format and added<br/>
to the app genesis JSON to use it on the simulations.

You can check an example on how to create the randomized genesis [here](https://github.com/cosmos/cosmos-sdk/blob/v/x/staking/simulation/genesis.go).

### Randomized Parameter Changes [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#randomized-parameter-changes "Direct link to Randomized parameter changes")

The simulator is able to test parameter changes at random. The simulator package from each module must contain a `RandomizedParams` func that will simulate parameter changes of the module throughout the simulations lifespan.

You can see how an example of what is needed to fully test parameter changes [here](https://github.com/cosmos/cosmos-sdk/blob/v/x/staking/simulation/params.go)

### Random Weighted Operations [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#random-weighted-operations "Direct link to Random weighted operations")

Operations are one of the crucial parts of the Cosmos SDK simulation. They are the transactions<br/>
(`Msg`) that are simulated with random field values. The sender of the operation<br/>
is also assigned randomly.

Operations on the simulation are simulated using the full [transaction cycle](https://docs.cosmos.network/v0.50/learn/advanced/transactions) of a<br/>
`ABCI` application that exposes the `BaseApp`.

Shown below is how weights are set:

v0.50.x/x/staking/simulation/operations.go

```codeBlockLines_e6Vv
)

// Simulation operation weights constants
const (
	DefaultWeightMsgCreateValidator           int = 100
	DefaultWeightMsgEditValidator             int = 5
	DefaultWeightMsgDelegate                  int = 100
	DefaultWeightMsgUndelegate                int = 100
	DefaultWeightMsgBeginRedelegate           int = 100
	DefaultWeightMsgCancelUnbondingDelegation int = 100

	OpWeightMsgCreateValidator           = "op_weight_msg_create_validator"
	OpWeightMsgEditValidator             = "op_weight_msg_edit_validator"
	OpWeightMsgDelegate                  = "op_weight_msg_delegate"
	OpWeightMsgUndelegate                = "op_weight_msg_undelegate"
	OpWeightMsgBeginRedelegate           = "op_weight_msg_begin_redelegate"
	OpWeightMsgCancelUnbondingDelegation = "op_weight_msg_cancel_unbonding_delegation"
)

// WeightedOperations returns all the operations from the module with their respective weights
func WeightedOperations(
	appParams simtypes.AppParams,
	cdc codec.JSONCodec,
	txGen client.TxConfig,
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k *keeper.Keeper,
) simulation.WeightedOperations {
	var (
		weightMsgCreateValidator           int
		weightMsgEditValidator             int
		weightMsgDelegate                  int
		weightMsgUndelegate                int
		weightMsgBeginRedelegate           int
		weightMsgCancelUnbondingDelegation int
	)

	appParams.GetOrGenerate(OpWeightMsgCreateValidator, &weightMsgCreateValidator, nil, func(_ *rand.Rand) {
		weightMsgCreateValidator = DefaultWeightMsgCreateValidator
	})

	appParams.GetOrGenerate(OpWeightMsgEditValidator, &weightMsgEditValidator, nil, func(_ *rand.Rand) {
		weightMsgEditValidator = DefaultWeightMsgEditValidator
	})

	appParams.GetOrGenerate(OpWeightMsgDelegate, &weightMsgDelegate, nil, func(_ *rand.Rand) {
		weightMsgDelegate = DefaultWeightMsgDelegate
	})

	appParams.GetOrGenerate(OpWeightMsgUndelegate, &weightMsgUndelegate, nil, func(_ *rand.Rand) {
		weightMsgUndelegate = DefaultWeightMsgUndelegate
	})

	appParams.GetOrGenerate(OpWeightMsgBeginRedelegate, &weightMsgBeginRedelegate, nil, func(_ *rand.Rand) {
		weightMsgBeginRedelegate = DefaultWeightMsgBeginRedelegate
	})

	appParams.GetOrGenerate(OpWeightMsgCancelUnbondingDelegation, &weightMsgCancelUnbondingDelegation, nil, func(_ *rand.Rand) {
		weightMsgCancelUnbondingDelegation = DefaultWeightMsgCancelUnbondingDelegation
	})

	return simulation.WeightedOperations{
		simulation.NewWeightedOperation(
			weightMsgCreateValidator,
			SimulateMsgCreateValidator(txGen, ak, bk, k),
		),
		simulation.NewWeightedOperation(
			weightMsgEditValidator,

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/release/v0.50.x/x/staking/simulation/operations.go#L19-L86)

As you can see, the weights are predefined in this case. Options exist to override this behavior with different weights. One option is to use `*rand.Rand` to define a random weight for the operation, or you can inject your own predefined weights.

Here is how one can override the above package `simappparams`.

v0.50.x/Makefile

```codeBlockLines_e6Vv
	@echo "Running multi-seed custom genesis simulation..."
	@echo "By default, ${HOME}/.simapp/config/genesis.json will be used."
	@cd ${CURRENT_DIR}/simapp && $(BINDIR)/runsim -Genesis=${HOME}/.simapp/config/genesis.json -SigverifyTx=false -SimAppPkg=. -ExitOnFail 400 5 TestFullAppSimulation

test-sim-multi-seed-long: runsim
	@echo "Running long multi-seed application simulation. This may take awhile!"
	@cd ${CURRENT_DIR}/simapp && $(BINDIR)/runsim -Jobs=4 -SimAppPkg=. -ExitOnFail 500 50 TestFullAppSimulation

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/release/v0.50.x/Makefile#L293-L299)

For the last test a tool called [runsim](https://github.com/cosmos/tools/tree/master/cmd/runsim) is used, this is used to parallelize go test instances, provide info to Github and slack integrations to provide information to your team on how the simulations are running.

### Random Proposal Contents [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#random-proposal-contents "Direct link to Random proposal contents")

Randomized governance proposals are also supported on the Cosmos SDK simulator. Each<br/>
module must define the governance proposal `Content` s that they expose and register<br/>
them to be used on the parameters.

## Registering Simulation Functions [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#registering-simulation-functions "Direct link to Registering simulation functions")

Now that all the required functions are defined, we need to integrate them into the module pattern within the `module.go`:

v0.50.x/x/distribution/module.go

```codeBlockLines_e6Vv

// ProposalMsgs returns msgs used for governance proposals for simulations.
func (AppModule) ProposalMsgs(_ module.SimulationState) []simtypes.WeightedProposalMsg {
	return simulation.ProposalMsgs()
}

// RegisterStoreDecoder registers a decoder for distribution module's types
func (am AppModule) RegisterStoreDecoder(sdr simtypes.StoreDecoderRegistry) {
	sdr[types.StoreKey] = simulation.NewDecodeStore(am.cdc)
}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	return simulation.WeightedOperations(
		simState.AppParams, simState.Cdc, simState.TxConfig,
		am.accountKeeper, am.bankKeeper, am.keeper, am.stakingKeeper,
	)
}

//
// App Wiring Setup
//

func init() {

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/release/v0.50.x/x/distribution/module.go#L180-L203)

## App Simulator Manager [​](https://docs.cosmos.network/v0.50/build/building-modules/simulator#app-simulator-manager "Direct link to App Simulator manager")

The following step is setting up the `SimulatorManager` at the app level. This<br/>
is required for the simulation test files on the next step.

```codeBlockLines_e6Vv
type CustomApp struct {
  ...
  sm *module.SimulationManager
}

```

Then at the instantiation of the application, we create the `SimulationManager`<br/>
instance in the same way we create the `ModuleManager` but this time we only pass<br/>
the modules that implement the simulation functions from the `AppModuleSimulation`<br/>
interface described above.

```codeBlockLines_e6Vv
func NewCustomApp(...) {
  // create the simulation manager and define the order of the modules for deterministic simulations
  app.sm = module.NewSimulationManager(
    auth.NewAppModule(app.accountKeeper),
    bank.NewAppModule(app.bankKeeper, app.accountKeeper),
    supply.NewAppModule(app.supplyKeeper, app.accountKeeper),
    gov.NewAppModule(app.govKeeper, app.accountKeeper, app.supplyKeeper),
    mint.NewAppModule(app.mintKeeper),
    distr.NewAppModule(app.distrKeeper, app.accountKeeper, app.supplyKeeper, app.stakingKeeper),
    staking.NewAppModule(app.stakingKeeper, app.accountKeeper, app.supplyKeeper),
    slashing.NewAppModule(app.slashingKeeper, app.accountKeeper, app.stakingKeeper),
  )

  // register the store decoders for simulation tests
  app.sm.RegisterStoreDecoders()
  ...
}

```

- [Synopsis](https://docs.cosmos.network/v0.50/build/building-modules/simulator#synopsis)
- [Simulation package](https://docs.cosmos.network/v0.50/build/building-modules/simulator#simulation-package)
  - [Store decoders](https://docs.cosmos.network/v0.50/build/building-modules/simulator#store-decoders)
  - [Randomized genesis](https://docs.cosmos.network/v0.50/build/building-modules/simulator#randomized-genesis)
  - [Randomized parameter changes](https://docs.cosmos.network/v0.50/build/building-modules/simulator#randomized-parameter-changes)
  - [Random weighted operations](https://docs.cosmos.network/v0.50/build/building-modules/simulator#random-weighted-operations)
  - [Random proposal contents](https://docs.cosmos.network/v0.50/build/building-modules/simulator#random-proposal-contents)
- [Registering simulation functions](https://docs.cosmos.network/v0.50/build/building-modules/simulator#registering-simulation-functions)
- [App Simulator manager](https://docs.cosmos.network/v0.50/build/building-modules/simulator#app-simulator-manager)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=3dp7fjenv3td)

### Structure

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/structure#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/structure)** (v0.52).

Version: v0.50

On this page

# Recommended Folder Structure

Synopsis

This document outlines the recommended structure of Cosmos SDK modules. These ideas are meant to be applied as suggestions. Application developers are encouraged to improve upon and contribute to module structure and development design.

## Structure [​](https://docs.cosmos.network/v0.50/build/building-modules/structure#structure "Direct link to Structure")

A typical Cosmos SDK module can be structured as follows:

```codeBlockLines_e6Vv
proto
└── {project_name}
    └── {module_name}
        └── {proto_version}
            ├── {module_name}.proto
            ├── event.proto
            ├── genesis.proto
            ├── query.proto
            └── tx.proto

```

- `{module_name}.proto`: The module's common message type definitions.
- `event.proto`: The module's message type definitions related to events.
- `genesis.proto`: The module's message type definitions related to genesis state.
- `query.proto`: The module's Query service and related message type definitions.
- `tx.proto`: The module's Msg service and related message type definitions.

```codeBlockLines_e6Vv
x/{module_name}
├── client
│   ├── cli
│   │   ├── query.go
│   │   └── tx.go
│   └── testutil
│       ├── cli_test.go
│       └── suite.go
├── exported
│   └── exported.go
├── keeper
│   ├── genesis.go
│   ├── grpc_query.go
│   ├── hooks.go
│   ├── invariants.go
│   ├── keeper.go
│   ├── keys.go
│   ├── msg_server.go
│   └── querier.go
├── module
│   └── module.go
│   └── abci.go
│   └── autocli.go
├── simulation
│   ├── decoder.go
│   ├── genesis.go
│   ├── operations.go
│   └── params.go
├── {module_name}.pb.go
├── codec.go
├── errors.go
├── events.go
├── events.pb.go
├── expected_keepers.go
├── genesis.go
├── genesis.pb.go
├── keys.go
├── msgs.go
├── params.go
├── query.pb.go
├── tx.pb.go
└── README.md

```

- `client/`: The module's CLI client functionality implementation and the module's CLI testing suite.
- `exported/`: The module's exported types - typically interface types. If a module relies on keepers from another module, it is expected to receive the keepers as interface contracts through the `expected_keepers.go` file (see below) in order to avoid a direct dependency on the module implementing the keepers. However, these interface contracts can define methods that operate on and/or return types that are specific to the module that is implementing the keepers and this is where `exported/` comes into play. The interface types that are defined in `exported/` use canonical types, allowing for the module to receive the keepers as interface contracts through the `expected_keepers.go` file. This pattern allows for code to remain DRY and also alleviates import cycle chaos.
- `keeper/`: The module's `Keeper` and `MsgServer` implementation.
- `module/`: The module's `AppModule` and `AppModuleBasic` implementation.
  - `abci.go`: The module's `BeginBlocker` and `EndBlocker` implementations (this file is only required if `BeginBlocker` and/or `EndBlocker` need to be defined).
  - `autocli.go`: The module [autocli](https://docs.cosmos.network/main/core/autocli) options.
- `simulation/`: The module's [simulation](https://docs.cosmos.network/v0.50/build/building-modules/simulator) package defines functions used by the blockchain simulator application (`simapp`).
- `REAMDE.md`: The module's specification documents outlining important concepts, state storage structure, and message and event type definitions. Learn more how to write module specs in the [spec guidelines](https://docs.cosmos.network/v0.50/build/spec/SPEC_MODULE).
- The root directory includes type definitions for messages, events, and genesis state, including the type definitions generated by Protocol Buffers.
  - `codec.go`: The module's registry methods for interface types.
  - `errors.go`: The module's sentinel errors.
  - `events.go`: The module's event types and constructors.
  - `expected_keepers.go`: The module's [expected keeper](https://docs.cosmos.network/v0.50/build/building-modules/keeper#type-definition) interfaces.
  - `genesis.go`: The module's genesis state methods and helper functions.
  - `keys.go`: The module's store keys and associated helper functions.
  - `msgs.go`: The module's message type definitions and associated methods.
  - `params.go`: The module's parameter type definitions and associated methods.
  - `*.pb.go`: The module's type definitions generated by Protocol Buffers (as defined in the respective `*.proto` files above).
- [Structure](https://docs.cosmos.network/v0.50/build/building-modules/structure#structure)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=9vquu5m9p6hq)

### Testing

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/testing#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/testing)** (v0.52).

Version: v0.50

On this page

# Testing

The Cosmos SDK contains different types of [tests](https://martinfowler.com/articles/practical-test-pyramid.html).<br/>
These tests have different goals and are used at different stages of the development cycle.<br/>
We advice, as a general rule, to use tests at all stages of the development cycle.<br/>
It is advised, as a chain developer, to test your application and modules in a similar way than the SDK.

The rationale behind testing can be found in [ADR-59](https://docs.cosmos.network/main/architecture/adr-059-test-scopes.html).

## Unit Tests [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#unit-tests "Direct link to Unit Tests")

Unit tests are the lowest test category of the [test pyramid](https://martinfowler.com/articles/practical-test-pyramid.html).<br/>
All packages and modules should have unit test coverage. Modules should have their dependencies mocked: this means mocking keepers.

The SDK uses `mockgen` to generate mocks for keepers:

scripts/mockgen.sh

```codeBlockLines_e6Vv
mockgen_cmd="mockgen"
$mockgen_cmd -source=client/account_retriever.go -package mock -destination testutil/mock/account_retriever.go
$mockgen_cmd -package mock -destination store/mock/cosmos_cosmos_db_DB.go github.com/cosmos/cosmos-db DB
$mockgen_cmd -source=types/module/module.go -package mock -destination testutil/mock/types_module_module.go

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/scripts/mockgen.sh#L3-L6)

You can read more about mockgen [here](https://github.com/golang/mock).

### Example [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#example "Direct link to Example")

As an example, we will walkthrough the [keeper tests](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/gov/keeper/keeper_test.go) of the `x/gov` module.

The `x/gov` module has a `Keeper` type, which requires a few external dependencies (ie. imports outside `x/gov` to work properly).

x/gov/keeper/keeper.go

```codeBlockLines_e6Vv
authKeeper  types.AccountKeeper
bankKeeper  types.BankKeeper
distrKeeper types.DistributionKeeper

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/gov/keeper/keeper.go#L22-L24)

In order to only test `x/gov`, we mock the [expected keepers](https://docs.cosmos.network/v0.46/building-modules/keeper.html#type-definition) and instantiate the `Keeper` with the mocked dependencies. Note that we may need to configure the mocked dependencies to return the expected values:

x/gov/keeper/common_test.go

```codeBlockLines_e6Vv
ctx := testCtx.Ctx.WithBlockHeader(cmtproto.Header{Time: cmttime.Now()})
encCfg := moduletestutil.MakeTestEncodingConfig()
v1.RegisterInterfaces(encCfg.InterfaceRegistry)
v1beta1.RegisterInterfaces(encCfg.InterfaceRegistry)
banktypes.RegisterInterfaces(encCfg.InterfaceRegistry)

// Create MsgServiceRouter, but don't populate it before creating the gov
// keeper.
msr := baseapp.NewMsgServiceRouter()

// gomock initializations
ctrl := gomock.NewController(t)
acctKeeper := govtestutil.NewMockAccountKeeper(ctrl)
bankKeeper := govtestutil.NewMockBankKeeper(ctrl)
stakingKeeper := govtestutil.NewMockStakingKeeper(ctrl)

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/gov/keeper/common_test.go#L67-L81)

This allows us to test the `x/gov` module without having to import other modules.

x/gov/keeper/keeper_test.go

```codeBlockLines_e6Vv
import (
	"testing"

	"cosmossdk.io/collections"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"

	sdkmath "cosmossdk.io/math"

	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/codec/address"
	simtestutil "github.com/cosmos/cosmos-sdk/testutil/sims"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/gov/keeper"
	govtestutil "github.com/cosmos/cosmos-sdk/x/gov/testutil"
	"github.com/cosmos/cosmos-sdk/x/gov/types"
	v1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1"
	"github.com/cosmos/cosmos-sdk/x/gov/types/v1beta1"
	minttypes "github.com/cosmos/cosmos-sdk/x/mint/types"
)

var address1 = "cosmos1ghekyjucln7y67ntx7cf27m9dpuxxemn4c8g4r"

type KeeperTestSuite struct {
	suite.Suite

	cdc               codec.Codec
	ctx               sdk.Context
	govKeeper         *keeper.Keeper
	acctKeeper        *govtestutil.MockAccountKeeper
	bankKeeper        *govtestutil.MockBankKeeper
	stakingKeeper     *govtestutil.MockStakingKeeper
	distKeeper        *govtestutil.MockDistributionKeeper
	queryClient       v1.QueryClient
	legacyQueryClient v1beta1.QueryClient
	addrs             []sdk.AccAddress
	msgSrvr           v1.MsgServer
	legacyMsgSrvr     v1beta1.MsgServer
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/gov/keeper/keeper_test.go#L3-L42)

We can test then create unit tests using the newly created `Keeper` instance.

x/gov/keeper/keeper_test.go

```codeBlockLines_e6Vv
func TestIncrementProposalNumber(t *testing.T) {
	govKeeper, authKeeper, _, _, _, _, ctx := setupGovKeeper(t)

	authKeeper.EXPECT().AddressCodec().Return(address.NewBech32Codec("cosmos")).AnyTimes()

	ac := address.NewBech32Codec("cosmos")
	addrBz, err := ac.StringToBytes(address1)
	require.NoError(t, err)

	tp := TestProposal
	_, err = govKeeper.SubmitProposal(ctx, tp, "", "test", "summary", addrBz, false)
	require.NoError(t, err)
	_, err = govKeeper.SubmitProposal(ctx, tp, "", "test", "summary", addrBz, false)
	require.NoError(t, err)
	_, err = govKeeper.SubmitProposal(ctx, tp, "", "test", "summary", addrBz, true)
	require.NoError(t, err)
	_, err = govKeeper.SubmitProposal(ctx, tp, "", "test", "summary", addrBz, true)
	require.NoError(t, err)
	_, err = govKeeper.SubmitProposal(ctx, tp, "", "test", "summary", addrBz, false)
	require.NoError(t, err)
	proposal6, err := govKeeper.SubmitProposal(ctx, tp, "", "test", "summary", addrBz, false)
	require.NoError(t, err)

	require.Equal(t, uint64(6), proposal6.Id)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/gov/keeper/keeper_test.go#L83-L107)

## Integration Tests [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#integration-tests "Direct link to Integration Tests")

Integration tests are at the second level of the [test pyramid](https://martinfowler.com/articles/practical-test-pyramid.html).<br/>
In the SDK, we locate our integration tests under [`/tests/integrations`](https://github.com/cosmos/cosmos-sdk/tree/main/tests/integration).

The goal of these integration tests is to test how a component interacts with other dependencies. Compared to unit tests, integration tests do not mock dependencies. Instead, they use the direct dependencies of the component. This differs as well from end-to-end tests, which test the component with a full application.

Integration tests interact with the tested module via the defined `Msg` and `Query` services. The result of the test can be verified by checking the state of the application, by checking the emitted events or the response. It is advised to combine two of these methods to verify the result of the test.

The SDK provides small helpers for quickly setting up an integration tests. These helpers can be found at [https://github.com/cosmos/cosmos-sdk/blob/main/testutil/integration](https://github.com/cosmos/cosmos-sdk/blob/main/testutil/integration).

### Example [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#example-1 "Direct link to Example")

testutil/integration/example_test.go

```codeBlockLines_e6Vv
func Example() {
	// in this example we are testing the integration of the following modules:
	// - mint, which directly depends on auth, bank and staking
	encodingCfg := moduletestutil.MakeTestEncodingConfig(auth.AppModuleBasic{}, mint.AppModuleBasic{})
	keys := storetypes.NewKVStoreKeys(authtypes.StoreKey, minttypes.StoreKey)
	authority := authtypes.NewModuleAddress("gov").String()

	// replace the logger by testing values in a real test case (e.g. log.NewTestLogger(t))
	logger := log.NewNopLogger()

	cms := integration.CreateMultiStore(keys, logger)
	newCtx := sdk.NewContext(cms, cmtproto.Header{}, true, logger)

	accountKeeper := authkeeper.NewAccountKeeper(
		encodingCfg.Codec,
		runtime.NewKVStoreService(keys[authtypes.StoreKey]),
		authtypes.ProtoBaseAccount,
		map[string][]string{minttypes.ModuleName: {authtypes.Minter}},
		addresscodec.NewBech32Codec("cosmos"),
		"cosmos",
		authority,
	)

	// subspace is nil because we don't test params (which is legacy anyway)
	authModule := auth.NewAppModule(encodingCfg.Codec, accountKeeper, authsims.RandomGenesisAccounts, nil)

	// here bankkeeper and staking keeper is nil because we are not testing them
	// subspace is nil because we don't test params (which is legacy anyway)
	mintKeeper := mintkeeper.NewKeeper(encodingCfg.Codec, runtime.NewKVStoreService(keys[minttypes.StoreKey]), nil, accountKeeper, nil, authtypes.FeeCollectorName, authority)
	mintModule := mint.NewAppModule(encodingCfg.Codec, mintKeeper, accountKeeper, nil, nil)

	// create the application and register all the modules from the previous step
	integrationApp := integration.NewIntegrationApp(
		newCtx,
		logger,
		keys,
		encodingCfg.Codec,
		map[string]appmodule.AppModule{
			authtypes.ModuleName: authModule,
			minttypes.ModuleName: mintModule,
		},
	)

	// register the message and query servers
	authtypes.RegisterMsgServer(integrationApp.MsgServiceRouter(), authkeeper.NewMsgServerImpl(accountKeeper))
	minttypes.RegisterMsgServer(integrationApp.MsgServiceRouter(), mintkeeper.NewMsgServerImpl(mintKeeper))
	minttypes.RegisterQueryServer(integrationApp.QueryHelper(), mintkeeper.NewQueryServerImpl(mintKeeper))

	params := minttypes.DefaultParams()
	params.BlocksPerYear = 10000

	// now we can use the application to test a mint message
	result, err := integrationApp.RunMsg(&minttypes.MsgUpdateParams{
		Authority: authority,
		Params:    params,
	})
	if err != nil {
		panic(err)
	}

	// in this example the result is an empty response, a nil check is enough
	// in other cases, it is recommended to check the result value.
	if result == nil {
		panic(fmt.Errorf("unexpected nil result"))
	}

	// we now check the result
	resp := minttypes.MsgUpdateParamsResponse{}
	err = encodingCfg.Codec.Unmarshal(result.Value, &resp)
	if err != nil {
		panic(err)
	}

	sdkCtx := sdk.UnwrapSDKContext(integrationApp.Context())

	// we should also check the state of the application
	got, err := mintKeeper.Params.Get(sdkCtx)
	if err != nil {
		panic(err)
	}

	if diff := cmp.Diff(got, params); diff != "" {
		panic(diff)
	}
	fmt.Println(got.BlocksPerYear)
	// Output: 10000
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/a2f73a7dd37bea0ab303792c55fa1e4e1db3b898/testutil/integration/example_test.go#L30-L116)

## Deterministic and Regression Tests [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#deterministic-and-regression-tests "Direct link to Deterministic and Regression tests")

Tests are written for queries in the Cosmos SDK which have `module_query_safe` Protobuf annotation.

Each query is tested using 2 methods:

- Use property-based testing with the [`rapid`](https://pkg.go.dev/pgregory.net/rapid@v0.5.3) library. The property that is tested is that the query response and gas consumption are the same upon 1000 query calls.
- Regression tests are written with hardcoded responses and gas, and verify they don't change upon 1000 calls and between SDK patch versions.

Here's an example of regression tests:

tests/integration/bank/keeper/deterministic_test.go

```codeBlockLines_e6Vv
func TestGRPCQueryBalance(t *testing.T) {
	t.Parallel()
	f := initDeterministicFixture(t)

	rapid.Check(t, func(rt *rapid.T) {
		addr := testdata.AddressGenerator(rt).Draw(rt, "address")
		coin := getCoin(rt)
		fundAccount(f, addr, coin)

		req := banktypes.NewQueryBalanceRequest(addr, coin.GetDenom())

		testdata.DeterministicIterations(f.ctx, t, req, f.queryClient.Balance, 0, true)
	})

	fundAccount(f, addr1, coin1)
	req := banktypes.NewQueryBalanceRequest(addr1, coin1.GetDenom())
	testdata.DeterministicIterations(f.ctx, t, req, f.queryClient.Balance, 1087, false)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/tests/integration/bank/keeper/deterministic_test.go#L134-L151)

## Simulations [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#simulations "Direct link to Simulations")

Simulations uses as well a minimal application, built with [`depinject`](https://docs.cosmos.network/v0.50/build/packages/depinject):

note

You can as well use the `AppConfig` `configurator` for creating an `AppConfig` [inline](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/slashing/app_test.go#L54-L62). There is no difference between those two ways, use whichever you prefer.

Following is an example for `x/gov/` simulations:

x/gov/simulation/operations_test.go

```codeBlockLines_e6Vv
func createTestSuite(t *testing.T, isCheckTx bool) (suite, sdk.Context) {
	res := suite{}

	app, err := simtestutil.Setup(
		depinject.Configs(
			configurator.NewAppConfig(
				configurator.AuthModule(),
				configurator.TxModule(),
				configurator.ParamsModule(),
				configurator.BankModule(),
				configurator.StakingModule(),
				configurator.ConsensusModule(),
				configurator.DistributionModule(),
				configurator.GovModule(),
			),
			depinject.Supply(log.NewNopLogger()),
		),
		&res.TxConfig, &res.AccountKeeper, &res.BankKeeper, &res.GovKeeper, &res.StakingKeeper, &res.DistributionKeeper)
	require.NoError(t, err)

	ctx := app.BaseApp.NewContext(isCheckTx)

	res.App = app
	return res, ctx
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/gov/simulation/operations_test.go#L406-L430)

x/gov/simulation/operations_test.go

```codeBlockLines_e6Vv
func TestWeightedOperations(t *testing.T) {
	suite, ctx := createTestSuite(t, false)
	app := suite.App
	ctx.WithChainID("test-chain")
	appParams := make(simtypes.AppParams)

	weightesOps := simulation.WeightedOperations(appParams, suite.TxConfig, suite.AccountKeeper,
		suite.BankKeeper, suite.GovKeeper, mockWeightedProposalMsg(3), mockWeightedLegacyProposalContent(1),
	)

	// setup 3 accounts
	s := rand.NewSource(1)
	r := rand.New(s)
	accs := getTestingAccounts(t, r, suite.AccountKeeper, suite.BankKeeper, suite.StakingKeeper, ctx, 3)

	expected := []struct {
		weight     int
		opMsgRoute string
		opMsgName  string
	}{
		{simulation.DefaultWeightMsgDeposit, types.ModuleName, simulation.TypeMsgDeposit},
		{simulation.DefaultWeightMsgVote, types.ModuleName, simulation.TypeMsgVote},
		{simulation.DefaultWeightMsgVoteWeighted, types.ModuleName, simulation.TypeMsgVoteWeighted},
		{simulation.DefaultWeightMsgCancelProposal, types.ModuleName, simulation.TypeMsgCancelProposal},
		{0, types.ModuleName, simulation.TypeMsgSubmitProposal},
		{1, types.ModuleName, simulation.TypeMsgSubmitProposal},
		{2, types.ModuleName, simulation.TypeMsgSubmitProposal},
		{0, types.ModuleName, simulation.TypeMsgSubmitProposal},
	}

	require.Equal(t, len(weightesOps), len(expected), "number of operations should be the same")
	for i, w := range weightesOps {
		operationMsg, _, err := w.Op()(r, app.BaseApp, ctx, accs, ctx.ChainID())
		require.NoError(t, err)

		// the following checks are very much dependent from the ordering of the output given
		// by WeightedOperations. if the ordering in WeightedOperations changes some tests
		// will fail
		require.Equal(t, expected[i].weight, w.Weight(), "weight should be the same")
		require.Equal(t, expected[i].opMsgRoute, operationMsg.Route, "route should be the same")
		require.Equal(t, expected[i].opMsgName, operationMsg.Name, "operation Msg name should be the same")
	}
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/gov/simulation/operations_test.go#L90-L132)

## End-to-end Tests [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#end-to-end-tests "Direct link to End-to-end Tests")

End-to-end tests are at the top of the [test pyramid](https://martinfowler.com/articles/practical-test-pyramid.html).<br/>
They must test the whole application flow, from the user perspective (for instance, CLI tests). They are located under [`/tests/e2e`](https://github.com/cosmos/cosmos-sdk/tree/main/tests/e2e).

For that, the SDK is using `simapp` but you should use your own application (`appd`).<br/>
Here are some examples:

- SDK E2E tests: [https://github.com/cosmos/cosmos-sdk/tree/main/tests/e2e](https://github.com/cosmos/cosmos-sdk/tree/main/tests/e2e).
- Cosmos Hub E2E tests: [https://github.com/cosmos/gaia/tree/main/tests/e2e](https://github.com/cosmos/gaia/tree/main/tests/e2e).
- Osmosis E2E tests: [https://github.com/osmosis-labs/osmosis/tree/main/tests/e2e](https://github.com/osmosis-labs/osmosis/tree/main/tests/e2e).

warning

The SDK is in the process of creating its E2E tests, as defined in [ADR-59](https://docs.cosmos.network/main/architecture/adr-059-test-scopes.html). This page will eventually be updated with better examples.

## Learn More [​](https://docs.cosmos.network/v0.50/build/building-modules/testing#learn-more "Direct link to Learn More")

Learn more about testing scope in [ADR-59](https://docs.cosmos.network/main/architecture/adr-059-test-scopes.html).

- [Unit Tests](https://docs.cosmos.network/v0.50/build/building-modules/testing#unit-tests)
  - [Example](https://docs.cosmos.network/v0.50/build/building-modules/testing#example)
- [Integration Tests](https://docs.cosmos.network/v0.50/build/building-modules/testing#integration-tests)
  - [Example](https://docs.cosmos.network/v0.50/build/building-modules/testing#example-1)
- [Deterministic and Regression tests](https://docs.cosmos.network/v0.50/build/building-modules/testing#deterministic-and-regression-tests)
- [Simulations](https://docs.cosmos.network/v0.50/build/building-modules/testing#simulations)
- [End-to-end Tests](https://docs.cosmos.network/v0.50/build/building-modules/testing#end-to-end-tests)
- [Learn More](https://docs.cosmos.network/v0.50/build/building-modules/testing#learn-more)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=bUO1BXI8H9PgjAPSW9hwuSeI&size=invisible&cb=gblp5lpm7l0g)

### Upgrading

[Skip to main content](https://docs.cosmos.network/v0.50/build/building-modules/upgrade#docusaurus_skipToContent_fallback)

This is documentation for Explore the SDK **v0.50**, which is no longer actively maintained.

For up-to-date documentation, see the **[latest version](https://docs.cosmos.network/v0.52/build/building-modules/upgrade)** (v0.52).

Version: v0.50

On this page

# Upgrading Modules

Synopsis

[In-Place Store Migrations](https://docs.cosmos.network/v0.50/learn/advanced/upgrade) allow your modules to upgrade to new versions that include breaking changes. This document outlines how to build modules to take advantage of this functionality.

Pre-requisite Readings

- [In-Place Store Migration](https://docs.cosmos.network/v0.50/learn/advanced/upgrade)

## Consensus Version [​](https://docs.cosmos.network/v0.50/build/building-modules/upgrade#consensus-version "Direct link to Consensus Version")

Successful upgrades of existing modules require each `AppModule` to implement the function `ConsensusVersion() uint64`.

- The versions must be hard-coded by the module developer.
- The initial version **must** be set to 1.

Consensus versions serve as state-breaking versions of app modules and must be incremented when the module introduces breaking changes.

## Registering Migrations [​](https://docs.cosmos.network/v0.50/build/building-modules/upgrade#registering-migrations "Direct link to Registering Migrations")

To register the functionality that takes place during a module upgrade, you must register which migrations you want to take place.

Migration registration takes place in the `Configurator` using the `RegisterMigration` method. The `AppModule` reference to the configurator is in the `RegisterServices` method.

You can register one or more migrations. If you register more than one migration script, list the migrations in increasing order and ensure there are enough migrations that lead to the desired consensus version. For example, to migrate to version 3 of a module, register separate migrations for version 1 and version 2 as shown in the following example:

```codeBlockLines_e6Vv
func (am AppModule) RegisterServices(cfg module.Configurator) {
    // --snip--
    cfg.RegisterMigration(types.ModuleName, 1, func(ctx sdk.Context) error {
        // Perform in-place store migrations from ConsensusVersion 1 to 2.
    })
     cfg.RegisterMigration(types.ModuleName, 2, func(ctx sdk.Context) error {
        // Perform in-place store migrations from ConsensusVersion 2 to 3.
    })
}

```

Since these migrations are functions that need access to a Keeper's store, use a wrapper around the keepers called `Migrator` as shown in this example:

x/bank/keeper/migrations.go

```codeBlockLines_e6Vv
package keeper

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/bank/exported"
	v2 "github.com/cosmos/cosmos-sdk/x/bank/migrations/v2"
	v3 "github.com/cosmos/cosmos-sdk/x/bank/migrations/v3"
	v4 "github.com/cosmos/cosmos-sdk/x/bank/migrations/v4"
)

// Migrator is a struct for handling in-place store migrations.
type Migrator struct {
	keeper         BaseKeeper
	legacySubspace exported.Subspace
}

// NewMigrator returns a new Migrator.
func NewMigrator(keeper BaseKeeper, legacySubspace exported.Subspace) Migrator {
	return Migrator{keeper: keeper, legacySubspace: legacySubspace}
}

// Migrate1to2 migrates from version 1 to 2.
func (m Migrator) Migrate1to2(ctx sdk.Context) error {
	return v2.MigrateStore(ctx, m.keeper.storeService, m.keeper.cdc)
}

// Migrate2to3 migrates x/bank storage from version 2 to 3.
func (m Migrator) Migrate2to3(ctx sdk.Context) error {
	return v3.MigrateStore(ctx, m.keeper.storeService, m.keeper.cdc)
}

// Migrate3to4 migrates x/bank storage from version 3 to 4.
func (m Migrator) Migrate3to4(ctx sdk.Context) error {
	return v4.MigrateStore(ctx, m.keeper.storeService, m.legacySubspace, m.keeper.cdc)
}

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/keeper/migrations.go)

## Writing Migration Scripts [​](https://docs.cosmos.network/v0.50/build/building-modules/upgrade#writing-migration-scripts "Direct link to Writing Migration Scripts")

To define the functionality that takes place during an upgrade, write a migration script and place the functions in a `migrations/` directory. For example, to write migration scripts for the bank module, place the functions in `x/bank/migrations/`. Use the recommended naming convention for these functions. For example, `v2bank` is the script that migrates the package `x/bank/migrations/v2`:

```codeBlockLines_e6Vv
// Migrating bank module from version 1 to 2
func (m Migrator) Migrate1to2(ctx sdk.Context) error {
    return v2bank.MigrateStore(ctx, m.keeper.storeKey) // v2bank is package `x/bank/migrations/v2`.
}

```

To see example code of changes that were implemented in a migration of balance keys, check out [migrateBalanceKeys](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/x/bank/migrations/v2/store.go#L55-L76). For context, this code introduced migrations of the bank store that updated addresses to be prefixed by their length in bytes as outlined in [ADR-028](https://docs.cosmos.network/v0.50/build/architecture/adr-028-public-key-addresses).

- [Consensus Version](https://docs.cosmos.network/v0.50/build/building-modules/upgrade#consensus-version)
- [Registering Migrations](https://docs.cosmos.network/v0.50/build/building-modules/upgrade#registering-migrations)
- [Writing Migration Scripts](https://docs.cosmos.network/v0.50/build/building-modules/upgrade#writing-migration-scripts)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=1qdyoamko4rb)
