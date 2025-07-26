---
tags:
  - "#blockchain"
  - "#ibc-protocol"
  - "#distributed-systems"
  - "#cross-chain-communication"
  - "#interoperability"
  - "#consensus-protocols"
  - "#network-security"
---
# Connections

# [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#transport-authentication-and-ordering-layer-connections) Transport, Authentication, and Ordering Layer - Connections

84 min read

Concept

IBC

DevOps

![](https://tutorials.cosmos.network/hi-target-icon.svg)

IBC in depth. Discover the IBC protocol in detail:

- Learn more about connection negotiation.
- Explore connection states.
- How IBC repels hostile connection attempts.

Now that you covered the introduction and have a better understanding of how different Inter-Blockchain Communication Protocol (IBC) components and interchain standards (ICS) relate to each other, take a deep dive into IBC/TAO (transport, authentication, and ordering) and the [IBC module(opens new window)](https://github.com/cosmos/ibc-go).

## [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#connections) Connections

If you want to connect two blockchains with IBC, you will need to establish an IBC **connection**. Connections, established by a four-way handshake, are responsible for:

1. Establishing the identity of the counterparty chain.
2. Preventing a malicious entity from forging incorrect information by pretending to be the counterparty chain. IBC connections are established by on-chain ledger code and therefore do not require interaction with off-chain (trusted) third-party processes.

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

The connection semantics are described in [ICS-3(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/core/ics-003-connection-semantics).

In the IBC stack, connections are built on top of clients, so technically there could be multiple connections for each client if the client is interacting with multiple versions of the IBC protocol. For now, the setup should connote one connection for each client.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

### [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#version-negotiation) Version Negotiation

Note that versioning here refers to the IBC protocol spec and not the ibc-go module. A backwards incompatible update is currently not planned.

Copy<br/>
// Version defines the versioning scheme used to negotiate the IBC version in// the connection handshake.type Version struct{// unique version identifier<br/>
Identifier string\`protobuf:"bytes,1,opt,name=identifier,proto3" json:"identifier,omitempty"\`// list of features compatible with the specified identifier<br/>
Features \[\]string\`protobuf:"bytes,2,rep,name=features,proto3" json:"features,omitempty"\`}

Protocol versioning is important to establish, as different protocol versions may not be compatible, for example due to proofs being stored on a different path. There are three types of protocol version negotiation:

1. _Default, no selection_: only one protocol version is supported. This is default to propose.
2. _With selection_: two protocol versions can be proposed, such that the chain initiating `OpenInit` or `OpenTry` has a choice of which version to go with.
3. _Impossible communication_: a backwards incompatible IBC protocol version. For example, if an IBC module changes where it stores its proofs (proof paths), errors result. There are no plans to upgrade to a backwards incompatible IBC protocol version.

As discussed previously, the opening handshake protocol allows each chain to verify the identifier used to reference the connection on the other chain, enabling modules on each chain to reason about the reference of the other chain.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/connectionstate.png)

With regards to the connection on the other side, the [connection protobufs(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/proto/ibc/core/connection/v1/connection.proto) contains the `Counterparty` definition:

Copy<br/>
// Counterparty defines the counterparty chain associated with a connection end.<br/>
message Counterparty {<br/>
option (gogoproto.goproto_getters)=false;// identifies the client on the counterparty chain associated with a given// connection.string client_id =1\[(gogoproto.moretags)="yaml:\\"client_id\\""\];// identifies the connection end on the counterparty chain associated with a// given connection.string connection_id =2\[(gogoproto.moretags)="yaml:\\"connection_id\\""\];// commitment merkle prefix of the counterparty chain.<br/>
ibc.core.commitment.v1.MerklePrefix prefix =3\[(gogoproto.nullable)=false\];}

In this definition, `connection-id` is used as a key to map and retrieve connections associated with a certain client from the store.

`prefix` is used by the clients to construct merkle prefix paths which are then used to verify proofs.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#connection-handshakes-and-states) Connection Handshakes and States

Establishing an IBC connection (for example, between chain A and chain B) requires four handshakes:

1. OpenInit
2. OpenTry
3. OpenAck
4. OpenConfirm

![](https://tutorials.cosmos.network/hi-info-icon.svg)

Colin Axnér of the Interchain Foundation gives an overview of how IBC Connections work (ICS-03), along with a code walkthrough, in the context of the Inter-Blockchain Communications Protocol (IBC).

IBC Connections - Overview of Connection Handshake - YouTube

Interchain

3.98K subscribers

[IBC Connections - Overview of Connection Handshake](https://www.youtube.com/watch?v=E3ZvqdY2tL8)

Interchain

Search

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

Watch later

Share

Copy link

Watch on

0:00

/ •Live

[Watch on YouTube](https://www.youtube.com/watch?v=E3ZvqdY2tL8 "Watch on YouTube")

A high level overview of a successful four-way handshake is as follows:

### [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-1-connopeninit) Handshake step 1 - `ConnOpenInit`

`OpenInit` initializes any connection which may occur, while still necessitating agreement from both sides. It is like an identifying announcement from the IBC module on chain A which is submitted by a relayer. The relayer should also submit a `MsgUpdateClient` with chain A as the source chain before this handshake. `MsgUpdateClient` updates the client on the initializing chain A with the latest consensus state of chain B.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/open_init.png)

The initiation of this handshake from chain A updates its connection state to `INIT`.

`OpenInit` proposes a protocol version to be used for the IBC connection. A relayer-submitted `OpenInit` which contains a protocol version that is not supported by chain A will be expected to fail.

The reference implementation for the connection handshake is found in the [IBC module repository(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/core/03-connection/keeper/handshake.go). Examine `ConnOpenInit`:

Copy<br/>
func(k Keeper)ConnOpenInit(<br/>
ctx sdk.Context,<br/>
clientID string,<br/>
counterparty types.Counterparty,// counterpartyPrefix, counterpartyClientIdentifier<br/>
version \*types.Version,<br/>
delayPeriod uint64,)(string,error){…//version negotiation logic// connection defines chain A's ConnectionEnd<br/>
connectionID:= k.GenerateConnectionIdentifier(ctx)<br/>
connection:= types.NewConnectionEnd(types.INIT, clientID, counterparty, types.ExportedVersionsToProto(versions), delayPeriod)<br/>
k.SetConnection(ctx, connectionID, connection)if err:= k.addConnectionToClient(ctx, clientID, connectionID); err!=nil{return"", err<br/>
}

k.Logger(ctx).Info("connection state updated","connection-id", connectionID,"previous-state","NONE","new-state","INIT")deferfunc(){<br/>
telemetry.IncrCounter(1,"ibc","connection","open-init")}()EmitConnectionOpenInitEvent(ctx, connectionID, clientID, counterparty)return connectionID,nil}

This function creates a unique `connectionID`. It adds the connection to a list of connections associated with a specific client.

It creates a new `ConnectionEnd`:

Copy<br/>
//@ func (k Keeper) ConnOpenInit…<br/>
connection:= types.NewConnectionEnd(types.INIT, clientID, counterparty, types.ExportedVersionsToProto(versions), delayPeriod)<br/>
k.SetConnection(ctx, connectionID, connection)…

With the following proto definition:

Copy<br/>
// ConnectionEnd defines a stateful object on a chain connected to another separate one.// NOTE: there must only be 2 defined ConnectionEnds to establish// a connection between two chains, so the connections are mapped and stored as \`ConnectionEnd\` on the respective chains.<br/>
message ConnectionEnd {<br/>
option (gogoproto.goproto_getters)=false;// client associated with this connection.string client_id =1\[(gogoproto.moretags)="yaml:\\"client_id\\""\];// IBC version which can be utilised to determine encodings or protocols for// channels or packets utilising this connection.<br/>
repeated Version versions =2;// current state of the connection end.<br/>
State state =3;// counterparty chain associated with this connection.<br/>
Counterparty counterparty =4\[(gogoproto.nullable)=false\];// delay period that must pass before a consensus state can be used for// packet-verification NOTE: delay period logic is only implemented by some// clients.uint64 delay_period =5\[(gogoproto.moretags)="yaml:\\"delay_period\\""\];}

`ConnOpenInit` is triggered by the **relayer**, which constructs the message and sends it to the SDK that uses the [`msg_server.go`(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/core/keeper/msg_server.go) previously seen to call `ConnOpenInit`:

Copy<br/>
// ConnectionOpenInit defines a rpc handler method for MsgConnectionOpenInit.func(k Keeper)ConnectionOpenInit(goCtx context.Context, msg \*connectiontypes.MsgConnectionOpenInit)(\*connectiontypes.MsgConnectionOpenInitResponse,error){<br/>
ctx:= sdk.UnwrapSDKContext(goCtx)if\_, err:= k.ConnectionKeeper.ConnOpenInit(ctx, msg.ClientId, msg.Counterparty, msg.Version, msg.DelayPeriod); err!=nil{returnnil, sdkerrors.Wrap(err,"connection handshake open init failed")}return&connectiontypes.MsgConnectionOpenInitResponse{},nil}

### [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-2-connopentry) Handshake step 2 - `ConnOpenTry`

`OpenInit` is followed by an `OpenTry` response, in which chain B verifies the identity of chain A according to information that chain B has about chain A in its light client (the algorithm and the last snapshot of the consensus state containing the root hash of the latest height as well as the next validator set). It also responds to some of the information about its own identity in the `OpenInit` announcement from chain A.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/open_try.png)

The purpose of this step of the handshake is double verification: not only for chain B to verify that chain A is the expected counterparty identity, but also to verify that the counterparty has accurate information about chain B's identity. The relayer also submits two `MsgUpdateClient` s with chain A and chain B as source chains before this handshake. These update the light clients of both chain A and chain B in order to make sure that the state verifications in this step are successful.

The initiation of this handshake from chain B updates its connection state to `TRYOPEN`.

With regards to IBC protocol versioning, `OpenTry` either accepts the protocol version which has been proposed in `OpenInit` or proposes another protocol version from the versions available to chain A to be used for the IBC connection. A relayer-submitted `OpenTry` which contains an unsupported protocol version will be expected to fail.

The [implementation of OpenTry(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/core/03-connection/keeper/handshake.go#L61-L147) is as follows:

Copy<br/>
// ConnOpenTry relays notice of a connection attempt on chain A to chain B (this// code is executed on chain B).//// <NOTE://> \- Here chain A acts as the counterparty// \- Identifiers are checked on msg validationfunc(k Keeper)ConnOpenTry(<br/>
ctx sdk.Context,<br/>
counterparty types.Counterparty,// counterpartyConnectionIdentifier, counterpartyPrefix and counterpartyClientIdentifier<br/>
delayPeriod uint64,<br/>
clientID string,// clientID of chainA<br/>
clientState exported.ClientState,// clientState that chainA has for chainB<br/>
counterpartyVersions \[\]exported.Version,// supported versions of chain A<br/>
proofInit \[\]byte,// proof that chainA stored connectionEnd in state (on ConnOpenInit)<br/>
proofClient \[\]byte,// proof that chainA stored a light client of chainB<br/>
proofConsensus \[\]byte,// proof that chainA stored chainB's consensus state at consensus height<br/>
proofHeight exported.Height,// height at which relayer constructs proof of A storing connectionEnd in state<br/>
consensusHeight exported.Height,// latest height of chain B which chain A has stored in its chain B client)…

## [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-3-connopenack) Handshake step 3 - `ConnOpenAck`

`OpenAck` is very similar to the functionality of `OpenInit`, except that the information verification now occurs for chain A. As in `OpenTry`, the relayer also submits two `MsgUpdateClient` s with chain A and chain B as source chains before this handshake. These update the light clients of both chain A and chain B, in order to make sure that the state verifications in this step are successful.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/open_ack.png)

The initiation of this handshake from chain A updates its connection state to `OPEN`. It is important to note that the counterparty chain _must_ have a `TRYOPEN` connection state in order for the handshake and connection state update to be successful.

With regards to version negotiation, `OpenAck` must confirm the protocol version which has been proposed in `OpenTry`. It ends the connection handshake process if the version is unwanted or unsupported.

The [`OpenAck` code(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/core/03-connection/keeper/handshake.go#L154-L247) is very similar to `OpenTry`:

Copy<br/>
func(k Keeper)ConnOpenAck(<br/>
ctx sdk.Context,<br/>
connectionID string,<br/>
clientState exported.ClientState,// client state for chain A on chain B<br/>
version \*types.Version,// version that Chain B chose in ConnOpenTry<br/>
counterpartyConnectionID string,<br/>
proofTry \[\]byte,// proof that connectionEnd was added to Chain B state in ConnOpenTry<br/>
proofClient \[\]byte,// proof of client state on chain B for chain A<br/>
proofConsensus \[\]byte,// proof that chain B has stored ConsensusState of chain A on its client<br/>
proofHeight exported.Height,// height that relayer constructed proofTry<br/>
consensusHeight exported.Height,// latest height of chain A that chain B has stored on its chain A client)…

Both functions do the same checks, except that `OpenTry` takes `proofInit` as a parameter, and `OpenAck` takes `proofTry`:

Copy<br/>
// @ func (k Keeper) ConnOpenAck// This function verifies that the snapshot we have of the counter-party chain looks like the counter-party chain, verifies the light client we have of the counter-party chain// Check that Chain A committed expectedConnectionEnd to its stateif err:= k.VerifyConnectionState(<br/>
ctx, connection, proofHeight, proofTry, counterparty.ConnectionId,<br/>
expectedConnection,); err!=nil{return"", err<br/>
}// This function verifies that the snapshot the counter-party chain has of us looks like us, verifies our light client on the counter-party chain// Check that Chain A stored the clientState provided in the msgif err:= k.VerifyClientState(ctx, connection, proofHeight, proofClient, clientState); err!=nil{return"", err<br/>
}// This function verifies that the snapshot the counter-party chain has of us looks like us, verifies our light client on the counter-party chain// Check that Chain A stored the correct ConsensusState of chain B at the given consensusHeightif err:= k.VerifyClientConsensusState(<br/>
ctx, connection, proofHeight, consensusHeight, proofConsensus, expectedConsensusState,); err!=nil{return"", err<br/>
}

Therefore, each chain verifies the `ConnectionState`, the `ClientState`, and the `ConsensusState` of the other chain. Note that after this step the connection state on chain A updates from `INIT` to `OPEN`.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-4-connopenconfirm) Handshake step 4 - `ConnOpenConfirm`

`OpenConfirm` is the final handshake, in which chain B confirms that both self-identification and counterparty identification were successful.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/open_confirm.png)

The [conclusion of this handshake(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/core/03-connection/keeper/handshake.go#L253-L297) results in the successful establishing of an IBC connection:

Copy<br/>
func(k Keeper)ConnOpenConfirm(<br/>
ctx sdk.Context,<br/>
connectionID string,<br/>
proofAck \[\]byte,// proof that connection opened on Chain A during ConnOpenAck<br/>
proofHeight exported.Height,// height that relayer constructed proofAck)

The initiation of this handshake from chain B updates its connection state from `TRYOPEN` to `OPEN`. The counterparty chain _must_ have an `OPEN` connection state in order for the handshake and connection state update to be successful.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

The successful four-way handshake described establishes an IBC connection between the two chains.

Now consider two edge circumstances: simultaneous attempts by the chains to perform the same handshake, and attempts by an imposter to interfere.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#crossing-hellos) Crossing Hellos

"Crossing hellos" refers to when both chains attempt the same handshake step at the same time.

![](https://tutorials.cosmos.network/hi-warn-icon.svg)

While still discussed in the video earlier, crossing hellos have been removed from ibc-go v4 onward, as referenced in [this PR(opens new window)](https://github.com/cosmos/ibc-go/pull/1672). The `PreviousConnectionId` in `MsgConnectionOpenTry` has been deprecated.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#an-imposter) An Imposter

What if an imposter tried to open a connection pretending to be another chain?

In fact this is not an issue. Any attempted `OpenInit` from an imposter will fail on `OpenTry`, because it will not contain valid proofs of `Client/Connection/ConsensusState`.

synopsis

To summarize, this section has explored:

- How a connection between two blockchains with IBC is established by a four-way handshake, thereby establishing the identity of the counterparty chain and preventing any malicious entity from pretending to be the counterparty.
- How versioning is important to establish, to ensure that only compatible protocol versions attempt to connect.

previous

[**What is IBC?**](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html)

up next

[**IBC/TAO - Channels**](https://tutorials.cosmos.network/academy/3-ibc/3-channels.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[Connections](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#connections)

[Version negotiation](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#version-negotiation)

[Connection handshakes and states](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#connection-handshakes-and-states)

[Handshake step 1 - ConnOpenInit](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-1-connopeninit)

[Handshake step 2 - ConnOpenTry](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-2-connopentry)

[Handshake step 3 - ConnOpenAck](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-3-connopenack)

[Handshake step 4 - ConnOpenConfirm](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#handshake-step-4-connopenconfirm)

[Crossing hellos](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#crossing-hellos)

[An imposter](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html#an-imposter)

#### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

#### IBC Middleware

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[When to use middleware?](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html#when-to-use-middleware)

[Definitions](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html#definitions)

# [\#](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html#ibc-middleware) IBC Middleware

7 min read

Concept

IBC

DevOps

Middleware is a well-known concept in software engineering. In traditional web development (web 2.0) for example, middleware is a piece of software that is implemented in the HTTP request-response cycle. One or more pieces of middleware stacked on top have access to the request and response object when an HTTP request comes in at a web server. They can execute custom logic for adding authentication, requesting headers, parsing request bodies, error handling, and many other tasks.

The use of middleware enables the composability and reusability of logical building blocks while allowing applications to focus on their application-specific logic. This suits the Interchain philosophy well, and it is, therefore, no surprise that middleware can also play an important role in Inter-Blockchain Communication Protocol (IBC) applications.

![](https://tutorials.cosmos.network/hi-target-icon.svg)

In this section, you will learn how to:

- Write your own custom middleware to wrap an IBC application.
- Understand how to hook different middlewares to IBC base applications to form different IBC application stacks.

This document serves as a guide for middleware developers who want to write their own middleware, and for chain developers who want to use IBC middleware on their chains.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html#when-to-use-middleware) When to Use Middleware?

IBC applications are designed to be self-contained modules that implement their own application-specific logic through a set of interfaces with the core IBC handlers. This is discussed in the [hands-on section](https://tutorials.cosmos.network/hands-on-exercise/5-ibc-adv/4-ibc-app-steps.html).

These core IBC handlers are designed to enforce the correctness properties of [IBC (transport, authentication, ordering)](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html) while delegating all application-specific handling to the IBC application modules. **However, there are cases where some functionality may be desired by many applications, yet not appropriate to place in core IBC**…this is where middleware enters the picture.

Middleware allows developers to define the extensions to the application and core IBC logic as separate modules that can wrap over the base application. This middleware can perform its custom logic and pass data into the application, which in turn may run its own logic without being aware of the middleware's existence.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

This design allows both the application and the middleware to implement their own isolated logic while still being able to run as part of a single packet flow.

In addition, as multiple middlewares can be stacked this design enables modularity, where chain developers can build the required business logic using _plug-and-play_ components consisting of a base IBC application module and a stack of middlewares.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html#definitions) Definitions

Before we continue, it is important to define the semantics:

- `Middleware`: A self-contained module that sits between core IBC and an underlying IBC application during packet execution. All messages between core IBC and the underlying application must flow through the middleware, which may perform its own custom logic.
- `Underlying Application`: An underlying application is an application that is directly connected to the middleware in question. This underlying application may itself be middleware that is chained to a base application.
- `Base Application`: A base application is an IBC application that does not contain any middleware. It may be nested by 0 or multiple middlewares to form an application stack.
- `Application Stack (or stack)`: A stack is the complete set of application logic (middleware(s) + base application) that is connected to core IBC. A stack may be just a base application, or it may be a series of middlewares that nest a base application.

The diagram below gives an overview of a middleware stack consisting of two middlewares (one stateless, the other stateful).

![](https://tutorials.cosmos.network/resized-images/1200/hands-on-exercise/5-ibc-adv/images/middleware-stack.png)

![](https://tutorials.cosmos.network/hi-note-icon.svg)

Keep in mind that:

- **The order of the middleware matters** (more on how to correctly define your stack in the code will follow in the [integration section](https://tutorials.cosmos.network/academy/3-ibc/11-ibc-mw-integrate.html)).
- Depending on the type of message, it will either be passed on from the base application up the middleware stack to core IBC or down the stack in the reverse situation (handshake and packet callbacks).
- IBC middleware will wrap over an underlying IBC application and sits between core IBC and the application. It has complete control in modifying any message coming from IBC to the application, and any message coming from the application to core IBC. **Middleware must be completely trusted by chain developers who wish to integrate them**, as this gives them complete flexibility in modifying the application(s) they wrap.
- Scaffolding middleware modules with Ignite CLI is currently not supported.

synopsis

To summarize, this section has explored:

- The adoption of **middleware**, software implemented in the HTTP request-response cycle to execute custom logic for a wide variety of tasks, from web 2.0.
- The applicability of middleware for composing and reusing logical building blocks which free applications to focus on their own specific logic, and the utility of this development philosophy to IBC applications.
- How middleware can assist the dynamic between applications and core IBC by allowing developers to add desired functionalities which are not appropriate to place in core IBC.
- How the custom logic performed by middleware can pass data to an application which itself operates with no awareness of the middleware's existence, allowing both to run as part of a single packet flow.
- How middlewares can be stacked as modular, plug-and-play components providing an app with the logic inputs its developer desires.

previous

[**Interchain Accounts**](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html)

up next

[**Create a Custom IBC Middleware**](https://tutorials.cosmos.network/academy/3-ibc/10-ibc-mw-develop.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[When to use middleware?](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html#when-to-use-middleware)

[Definitions](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html#definitions)

### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

### IBC Protocol

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[In this chapter](https://tutorials.cosmos.network/academy/3-ibc/#in-this-chapter)

[Developer Resources](https://tutorials.cosmos.network/academy/3-ibc/#developer-resources)

Connect chains with IBC

# The Inter-Blockchain Communication Protocol

4 min read

Ever wondered how cross-chain communication is possible? Get a fast introduction to the world of the Inter-Blockchain Communication Protocol (IBC).

Learn more about the transportation, authentication, and ordering layer of IBC and take a deeper dive into how token transfers between chains become possible. Finally, have a quick look at interchain accounts and the tools that are available to visualize networks of chains connected with IBC.

![](https://tutorials.cosmos.network/resized-images/1200/ida_dev_portal_lp_hero-04-b.png)

## [\#](https://tutorials.cosmos.network/academy/3-ibc/#in-this-chapter) In This Chapter

![](https://tutorials.cosmos.network/hi-target-icon.svg)

In this chapter, you will:

- Discover what IBC is.
- Get an introduction to the different layers of IBC and how connections, channels, and clients relate to each other in IBC.
- Explore light client development.
- Dive into working with the solo machine client.
- Take a look at IBC token transfers.
- Explore interchain accounts.
- Dive into IBC Middleware, with a focus on creating custom IBC Middleware, and how to integrate it into a chain.
- Get an overview of helpful tools for IBC.

[**What is IBC?** \\<br/>
\\<br/>
Introduction to the IBC Protocol\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html) [**IBC/TAO - Connections** \\<br/>
\\<br/>
Establishing connections in IBC\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html) [**IBC/TAO - Channels** \\<br/>
\\<br/>
The role of channels in IBC\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/3-channels.html) [**IBC Application Developer Introduction**\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/hands-on-exercise/5-ibc-adv/3-ibc-app-intro.html) [**IBC/TAO - Clients** \\<br/>
\\<br/>
Clients in IBC\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/4-clients.html) [**Light Client Development** \\<br/>
\\<br/>
Develop light clients\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html) [**IBC Solo Machine** \\<br/>
\\<br/>
Solo machine client\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html) [**IBC Token Transfer** \\<br/>
\\<br/>
Fungible token transfers across chains\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html) [**Interchain Accounts** \\<br/>
\\<br/>
Understand ICA\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html) [**IBC Middleware** \\<br/>
\\<br/>
Custom middleware to wrap an IBC application\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html) [**Create a Custom IBC Middleware** \\<br/>
\\<br/>
Implementing interfaces\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/10-ibc-mw-develop.html) [**Integrating IBC Middleware Into a Chain** \\<br/>
\\<br/>
Integrate IBC middleware with a base application\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/11-ibc-mw-integrate.html) [**IBC Tooling** \\<br/>
\\<br/>
Overview of some helpful tools\\<br/>
\\<br/>
Start here](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html)

## [\#](https://tutorials.cosmos.network/academy/3-ibc/#developer-resources) Developer Resources

![Cosmos SDK](https://tutorials.cosmos.network/cosmos-sdk-icon.svg)

### Cosmos SDK

A framework to build application-specific blockchains

[Documentation](https://docs.cosmos.network/)

![CometBFT](https://tutorials.cosmos.network/comet-bft-logo.svg)

### CometBFT

Blockchain consensus engine and application interface

[Documentation](https://docs.cometbft.com/)

![Cosmos Hub](https://tutorials.cosmos.network/generic-star-icon.svg)

### Cosmos Hub

First interconnected public blockchain in the Interchain network

[Documentation](https://hub.cosmos.network/)

![IBC](https://tutorials.cosmos.network/ibc-icon.svg)

### IBC

Industry standard protocol for inter-blockchain communication

[Documentation](https://ibc.cosmos.network/)

previous

[**Migrations**](https://tutorials.cosmos.network/academy/2-cosmos-concepts/16-migrations.html)

up next

[**What is IBC?**](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[In this chapter](https://tutorials.cosmos.network/academy/3-ibc/#in-this-chapter)

[Developer Resources](https://tutorials.cosmos.network/academy/3-ibc/#developer-resources)

## Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

## IBC Token Transfer

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[Transfer packet flow](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#transfer-packet-flow)

[Sending a transfer packet](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#sending-a-transfer-packet)

[Receiving a transfer packet](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#receiving-a-transfer-packet)

[Acknowledging or timing out packets](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#acknowledging-or-timing-out-packets)

# [\#](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#ibc-token-transfer) IBC Token Transfer

87 min read

Concept

IBC

DevOps

![](https://tutorials.cosmos.network/hi-target-icon.svg)

Transferring tokens between chains is both a common requirement and a significant technical challenge when two chains are incompatible. A convenient solution for moving tokens between chains is essential.

In this section, you will explore how a fungible token transfer can be done with IBC.

Having looked at IBC's transport, authentication, and ordering layer (IBC/TAO), you can now take a look at [ICS-20(opens new window)](https://github.com/cosmos/ibc/blob/master/spec/app/ics-020-fungible-token-transfer/README.md). ICS-20 describes **fungible token transfers**.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

Fungibility refers to an instance in which a token is interchangeable with other instances of that token or not. Fungible tokens can be exchanged and replaced.

There are many use cases involving token transfers on blockchains, like the tokenization of assets holding value or initial coin offerings (ICOs) to finance blockchain projects. IBC makes it possible to transfer tokens and other digital assets between (sovereign) chains, both fungible and non-fungible tokens. For example, fungible token transfers allow you to build applications relying on cross-chain payments and token exchanges. Therefore, IBC frees up great potential for cross-chain Decentralized Finance (DeFi) applications by offering a technically reliable cross-chain interoperability protocol that is compatible with digital assets on multiple networks.

The corresponding [implementation(opens new window)](https://github.com/cosmos/ibc-go/tree/main/modules/apps/transfer) is a module on the application level.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/transferoverview.png)

Look at the picture above. You can see two chains, A and B. You also see there is a channel connecting both chains.

How can tokens be transferred between chains and channels?

To understand the application logic for a token transfer, first, you have to determine the **source** chain:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/sourcechain.png)

Then the application logic can be summarized:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/applicationlogic.png)

Shortly you will see the corresponding code. Now again have a look at a transfer from **source** to **sink**:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/sourcetosink.png)

Above the **source** is chain A. The source channel is **channel-2** and the destination channel is **channel-40**. The token denominations are represented as `{Port}/{Channel}/{denom}` (or rather their [IBC denom representation](https://tutorials.cosmos.network/tutorials/6-ibc-dev/) on chain). The prefixed port and channel pair indicate which channel the funds were previously sent through. You see **transfer/channel-…** because the transfer module will bind to a port, which is named transfer. If chain A sends 100 ATOM tokens, chain B will receive 100 ATOM tokens and append the destination prefix **port/channel-id**. So chain B will mint those 100 ATOM tokens as **ibc/<hash of transfer/channel-40/uatom>**. The **channel-id** will be increased sequentially per channel on a given connection.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

We can send assets (or their IBC voucher representation) in multiple _hops_ across multiple chains. Every single time the path will be prepended with the _port/channel-id/…_ prefix.

When sending this IBC denom (having had multiple hops) back to its source chain, for every hop back one _port/channel-id/…_ prefix will be taken off. This results in a return to the original denom if all the hops are reversed.

If the tokens are sent back from the **same channel** as they were received:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/sinktosource.png)

Chain A will "un-escrow" 100 **ATOM tokens**, thus, the prefix will be removed. Chain B will burn **transfer/channel-40/atoms**.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

The prefix determines the **source** chain. If the module sends the token from another channel, chain B is the source chain and chain A mints new tokens with a prefix instead of un-escrowing ATOM tokens. You can have different channels between two chains, but you cannot transfer the same token across different channels back and forth. If `{denom}` contains `/`, then it must also follow the ICS-20 form, which indicates that this token has a multi-hop record. This requires that the character `/` is prohibited in non-IBC token denomination names.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/sourcesinklogic.png)

You already know that an application needs to implement the [IBC Module Interface(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/core/05-port/types/module.go), so have a look at the [implementation for the token transfer(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/apps/transfer/ibc_module.go), e.g. for `OnChanOpenInit`:

Copy<br/>
// OnChanOpenInit implements the IBCModule interfacefunc(im IBCModule)OnChanOpenInit(<br/>
ctx sdk.Context,<br/>
order channeltypes.Order,<br/>
connectionHops \[\]string,<br/>
portID string,<br/>
channelID string,<br/>
chanCap \*capabilitytypes.Capability,<br/>
counterparty channeltypes.Counterparty,<br/>
version string,)error{if err:=ValidateTransferChannelParams(ctx, im.keeper, order, portID, channelID); err!=nil{return err<br/>
}if version!= types.Version {return sdkerrors.Wrapf(types.ErrInvalidVersion,"got %s, expected %s", version, types.Version)}// Claim channel capability passed back by IBC moduleif err:= im.keeper.ClaimCapability(ctx, chanCap, host.ChannelCapabilityPath(portID, channelID)); err!=nil{return err<br/>
}returnnil}

`OnChanOpenAck`, `OnChanOpenConfirm`, `OnChanCloseInit`, and `OnChanCloseConfirm` will do (almost) no checks.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#transfer-packet-flow) Transfer Packet Flow

You have seen an introduction to the application packet flow in [the section on channels](https://tutorials.cosmos.network/academy/3-ibc/3-channels.html#application-packet-flow). This section will analyze this packet flow for the specific case of the _transfer_ module.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#sending-a-transfer-packet) Sending a Transfer Packet

After a channel is established, the module can start sending and receiving packets.

So where does the module send a token? Take a look at the [msg_server.go(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/apps/transfer/keeper/msg_server.go) of the token transfer module:

Copy<br/>
// Transfer defines an rpc handler method for MsgTransfer.func(k Keeper)Transfer(goCtx context.Context, msg \*types.MsgTransfer)(\*types.MsgTransferResponse,error){…if err:= k.SendTransfer(<br/>
ctx, msg.SourcePort, msg.SourceChannel, msg.Token, sender, msg.Receiver, msg.TimeoutHeight, msg.TimeoutTimestamp,); err!=nil{returnnil, err<br/>
}…}

There you see `SendTransfer`, which implements the application logic after [checking if the sender is a source or sink chain(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/modules/apps/transfer/types/coin.go):

Copy<br/>
func(k Keeper)SendTransfer(<br/>
ctx sdk.Context,<br/>
sourcePort,<br/>
sourceChannel string,<br/>
token sdk.Coin,<br/>
sender sdk.AccAddress,<br/>
receiver string,<br/>
timeoutHeight clienttypes.Height,<br/>
timeoutTimestamp uint64,){…// deconstruct the token denomination into the denomination trace info// to determine if the sender is the source chainif strings.HasPrefix(token.Denom,"ibc/"){<br/>
fullDenomPath, err = k.DenomPathFromHash(ctx, token.Denom)if err!=nil{return err<br/>
}}…// NOTE: SendTransfer simply sends the denomination as it exists on its own// chain inside the packet data. The receiving chain will perform denom// prefixing as necessary.if types.SenderChainIsSource(sourcePort, sourceChannel, fullDenomPath){…// create the escrow address for the tokens<br/>
escrowAddress:= types.GetEscrowAddress(sourcePort, sourceChannel)// escrow source tokens. It fails if balance insufficient.if err:= k.bankKeeper.SendCoins(…){}else{…if err:= k.bankKeeper.SendCoinsFromAccountToModule(…);…if err:= k.bankKeeper.BurnCoins(…);…}

packetData:= types.NewFungibleTokenPacketData(<br/>
fullDenomPath, token.Amount.String(), sender.String(), receiver,)…}}

Take a look at the [type definition of a token packet(opens new window)](https://github.com/cosmos/ibc-go/blob/v5.1.0/proto/ibc/applications/transfer/v2/packet.proto) before diving further into the code:

Copy<br/>
syntax="proto3";package ibc.applications.transfer.v2;option go_package ="github.com/cosmos/ibc-go/v3/modules/apps/transfer/types";// FungibleTokenPacketData defines a struct for the packet payload// See FungibleTokenPacketData <spec://> <https://github.com/cosmos/ibc/tree/master/spec/app/ics-020-fungible-token-transfer#data-structuresmessageFungibleTokenPacketData>{// the token denomination to be transferredstring denom =1;// the token amount to be transferredstring amount =2;// the sender addressstring sender =3;// the recipient address on the destination chainstring receiver =4;// optional memostring memo =5;}

![](https://tutorials.cosmos.network/hi-note-icon.svg)

An optional _memo_ field was recently added to the packet definition. More details on the motivation, use cases, and consequences can be found in the [accompanying blog post(opens new window)](https://medium.com/the-interchain-foundation/moving-beyond-simple-token-transfers-d42b2b1dc29b).

### [\#](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#receiving-a-transfer-packet) Receiving a Transfer Packet

A relayer will then pick up the `SendPacket` event and submit a `MsgRecvPacket` on the destination chain.

This will trigger an `OnRecvPacket` callback that will decode a packet and apply the transfer token application logic:

Copy<br/>
// OnRecvPacket implements the IBCModule interface. A successful acknowledgement// is returned if the packet data is successfully decoded and the receive application// logic returns without error.func(im IBCModule)OnRecvPacket(<br/>
ctx sdk.Context,<br/>
packet channeltypes.Packet,<br/>
relayer sdk.AccAddress,) ibcexported.Acknowledgement {<br/>
ack:= channeltypes.NewResultAcknowledgement(\[\]byte{byte(1)})var data types.FungibleTokenPacketData<br/>
var ackErr errorif err:= types.ModuleCdc.UnmarshalJSON(packet.GetData(),&data); err!=nil{<br/>
ackErr = sdkerrors.Wrapf(sdkerrors.ErrInvalidType,"cannot unmarshal ICS-20 transfer packet data")<br/>
ack = channeltypes.NewErrorAcknowledgement(ackErr)}// only attempt the application logic if the packet data// was successfully decodedif ack.Success(){<br/>
err:= im.keeper.OnRecvPacket(ctx, packet, data)if err!=nil{<br/>
ack = channeltypes.NewErrorAcknowledgement(err)<br/>
ackErr = err<br/>
}}

eventAttributes:=\[\]sdk.Attribute{<br/>
sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),<br/>
sdk.NewAttribute(sdk.AttributeKeySender, data.Sender),<br/>
sdk.NewAttribute(types.AttributeKeyReceiver, data.Receiver),<br/>
sdk.NewAttribute(types.AttributeKeyDenom, data.Denom),<br/>
sdk.NewAttribute(types.AttributeKeyAmount, data.Amount),<br/>
sdk.NewAttribute(types.AttributeKeyMemo, data.Memo),<br/>
sdk.NewAttribute(types.AttributeKeyAckSuccess, fmt.Sprintf("%t", ack.Success())),}if ackErr!=nil{<br/>
eventAttributes =append(eventAttributes, sdk.NewAttribute(types.AttributeKeyAckError, ackErr.Error()))}

ctx.EventManager().EmitEvent(<br/>
sdk.NewEvent(<br/>
types.EventTypePacket,<br/>
eventAttributes…,),)// NOTE: acknowledgement will be written synchronously during IBC handler execution.return ack<br/>
}

![](https://tutorials.cosmos.network/hi-note-icon.svg)

Observe in the previous example how we redirect to the module keeper's `OnRecvPacket` method and are constructing the acknowledgement to be sent back.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#acknowledging-or-timing-out-packets) Acknowledging or Timing out Packets

A useful exercise is to try to find and analyze the code corresponding to this. The place to start is the packet callbacks, usually defined in a file like `module_ibc.go` or `ibc_module.go`.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

When a packet times out, the submission of a `MsgTimeout` is essential to get the locked funds unlocked again. As an exercise, try to find the code where this is executed.

synopsis

To summarize, this section has explored:

- How IBC provides a reliable solution to the technical challenge of transferring fungible and non-fungible tokens between two different blockchains, freeing up great potential for cross-chain Decentralized Finance (DeFi) applications.
- How the process for transferring value differs based on whether or not the IBC tokens are native to the source chain, or whether or not they are being sent on a channel they were previously received on.

previous

[**IBC Solo Machine**](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html)

up next

[**Interchain Accounts**](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[Transfer packet flow](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#transfer-packet-flow)

[Sending a transfer packet](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#sending-a-transfer-packet)

[Receiving a transfer packet](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#receiving-a-transfer-packet)

[Acknowledging or timing out packets](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html#acknowledging-or-timing-out-packets)

#### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

#### IBC Tooling

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[MapOfZones - explore the interchain network](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#mapofzones-explore-the-interchain-network)

[Mintscan](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#mintscan)

[IOBScan](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#iobscan)

# [\#](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#ibc-tooling) IBC Tooling

41 min read

Concept

IBC

![](https://tutorials.cosmos.network/hi-target-icon.svg)

In this section, you will discover the following tools:

- MapOfZones
- Mintscan
- IOBScan

In this section, you will take a look at three very helpful visualization tools for the IBC network. They include information on the chains in the network (hub and zones), connections, channels, and transactions.

While going through the overview, it is recommended to try out all there is to discover: just click around and see what happens.

These types of tools help maintain an overview of the overall IBC network, but can also assist with things like relayer selection, as they provide an overview of essential metrics when it comes to relaying.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#mapofzones-explore-the-interchain-network) MapOfZones - Explore the Interchain Network

[MapOfZones(opens new window)](https://mapofzones.com/) is an interchain network explorer.

By default, the explorer shows you a visual overview of the IBC network for the last 24 hours:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/mapofzones1.png)

You can also change the time being visualized by the MapOfZones in the lower right side of the display. You can choose between:

- 24 hours
- Seven days
- 30 days

The overview is dynamic and gives you a good feeling of the current activity in the overall network and between specific chains.

The individual chains are visualized by circle icons, sometimes including the chain's logo. Additionally, you can see connecting lines between the different chains. These lines represent connections between chains.

When you click on a specific chain with your mouse cursor, an overview of data for that chain is displayed on the right side.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/mapofzones2.png)

The information displayed includes:

- The number of transactions on that chain (for the selected time period)
- The number of IBC transfers (for the selected time period)
- The number of peers
- The number of channels
- A button for more `Learn more`

If you click on the `Learn more`, you are directed to an overview with more in-depth information about the chain selected:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/detailscosmoszone.png)

In the peers section, you can find a list of all the chains the selected chain is connected to. When you click on a specific chain, you can see the channels between the selected chain and another chain:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/cosmososmasischannels.png)

Now you have an overview for each channel, including: how much IBC volume is transferred between the chains through the individual channels; the number of transfers successfully transferred to and received from a particular zone; the balancing figure between inbound and outbound IBC transfers; the number of IBC transfers failed attributed to a particular pair of channels between zones; and the ratio of successfully completed transfers to all transfers with final status.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

There are canonical channels for ICS-20. All other channels will have been created accidentally by (inexperienced) relayers and hence have practically no transactions.

When you go to the `Zones`, you can find a list of the most active zones by IBC volume in USD:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/mostactivezones.png)

The list includes very useful information, such as:

- `IBC volume, $`: USD value of tokens successfully relayed via IBC transfer with pertinent volume in progress.
- `IBC volume in, $`: USD value of tokens successfully received from other zones with pertinent volume in progress.
- `IBC volume out, $`: USD value of tokens successfully transferred to other zones with pertinent volume in progress.
- `IBC transfer`: number of successfully relayed IBC transfers with pertinent quantity in progress.
- `IBC DAU`: number of unique addresses within the zone that have initiated outward IBC transfers.

You can also sort the list in either ascending or descending order with a click on the label.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#mintscan) Mintscan

[Mintscan(opens new window)](https://hub.mintscan.io/) is another interchain network explorer.

It gives an overview of IBC networks, including an explorer menu (left panel), a network visualization (center), and a list of chains (right panel). The visualization is based on IBC transactions within a 30-day period. A selection of alternative visualizations is available from the left panel:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/mintscanoverview.png)

To select a specific chain, just click on it in the visualization or select it from the right panel. The overlay will now show summary data for the selected chain:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/mintscanosmosis1.png)

In addition, a graph appears in the right panel displaying the chain's sent, received, and total transactions for the last 30 days. Current transaction values appear on the right, and those of previous days can be easily viewed by hovering your cursor over the desired point of the graph:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/mintscanosmosis2.png)

To view more in-depth information about the chain, selecting the "Explorer" link will open its dedicated explorer dashboard. Here you will find:

- An array of useful links
- Market Data, with another interactive graph
- Onchain Metrics
- Links to Major dApps associated with the chain:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/onchannel1.png)

Below these you will find data regarding:

- Proposals
- Validators
- Dev Activities

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/onchannel2.png)

You will also notice a variety of tabs at the top of the screen, providing access to more detailed information on Validators, the Ecosystem, Proposals, Blocks, Transactions, Relayers, Contracts, Assets, and Accounts:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/onchannel3.png)

For example, on selecting the Transactions tab you can review the Transactions summary screen:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/onchannel4.png)

The summary section details:

- The chain's total number of transactions
- The number of transactions in the last 30 days
- The number of transactions yesterday
- The number of transactions included in the last 20 blocks

Below this is a table of Recent Transactions. For each transaction in the table, you find information on:

- The transaction's hash
- The result - was it successful?
- Its messages
- The amount transferred
- The fee of the transaction
- The transaction's height
- How long ago a transaction was conducted

When you click on a specific transaction in the list, you are forwarded to a page with the transaction details:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/onchannel5.png)

This gives you an overview of the transaction, which includes:

- Status of the transaction
- Time of the transaction
- Chain ID
- Transaction hash
- Height of the transaction
- Gas used and wanted
- Fees for the transaction
- Memo

Further below, you can also look into information on the Messages involved:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/ftstx1.png)

And you can also view expandable Event Logs:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/ftstx2.png)

## [\#](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#iobscan) IOBScan

Now, turn your focus to another blockchain explorer, [IOBScan(opens new window)](https://ibc.iobscan.io/home).

From the IOBScan homepage you can get a quick overview of networks, channels, IBC token transfers, and IBC tokens:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/iobscan1.png)

You can use the tab navigation for a closer look at:

- Transfers
- Tokens
- The network
- Channels
- Relayers

A search functionality by transaction hash is possible too.

In the upper-right-hand corner, you can select the network. For example, you can switch between the mainnet of Iris Hub, the mainnet of the Cosmos Hub, the Stargate testnet, and the Nyancat testnet.

On the right-hand side (next to the visualization) you can find a list of all networks, sorted by either connections or chains.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

If you want a visualization of the network, just click on the network icon in the upper-right-hand corner. This redirects you to the [IOBSCAN Network State Visualizer(opens new window)](https://www.iobscan.io/#/):

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/iobscan2.png)

The connections displayed in the visualizer have either a regular or a dotted line, depending on whether a connection is opened or unopened.

synopsis

To summarize, this section has explored:

- **MapOfZones**, a network explorer for the interchain ecosystem, which provides a variety of dynamic visualizations of network activity over time, allowing easy comprehension of transactions occurring between specific individual chains, access to detailed traffic data and in-depth information about chains, and useful information regarding the most active zones by IBC volume in USD.
- **Mintscan**, another interchain network explorer, which provides an overview of IBC network activity over time, and can focus in on specific chains to show their total transactions (measured in transactions and USD) and connections (with the number of chains and relayers), also providing graphs for transaction and volume history, and can provide highly detailed breakdowns of data at various levels of network detail.
- **IOBScan**, another blockchain explorer, which provides a quick overview of networks, channels, IBC token transfers, and IBC tokens from its homepage; it allows for searching by transaction hash, and also offers the IOBSCAN Network State Visualizer for an alternative high-level presentation of connection data between chains.

previous

[**Integrating IBC Middleware Into a Chain**](https://tutorials.cosmos.network/academy/3-ibc/11-ibc-mw-integrate.html)

up next

[**Good-To-Know Dev Terms**](https://tutorials.cosmos.network/tutorials/1-tech-terms/)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[MapOfZones - explore the interchain network](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#mapofzones-explore-the-interchain-network)

[Mintscan](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#mintscan)

[IOBScan](https://tutorials.cosmos.network/academy/3-ibc/12-ibc-tooling.html#iobscan)

### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

### Interchain Accounts

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

# [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#interchain-accounts) Interchain Accounts

![](https://tutorials.cosmos.network/hi-target-icon.svg)

**Interchain accounts (ICAs)** allow you to control an account on a **host chain** from a **controller chain**.

In this section, you will learn more about:

- Host chains and controller chains
- ICA (sub)module(s)
- The authentication module for custom authentication
- ADR 008 middleware for secondary application logic

![](https://tutorials.cosmos.network/academy/3-ibc/images/icaoverview.png)

## [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#what-are-interchain-accounts) What Are Interchain Accounts?

The interoperable internet of blockchains made possible by IBC opens up many new frontiers for cross-chain interactions, and for applications leveraging these primitives. In this interoperability narrative, it should be possible to interact with a given chain (call it the _host chain_) through a remote interface, i.e. from another chain (the _controller chain_). Interchain accounts, or ICA for short, enable just that: they allow for a chain, a module, or a user on that chain to programmatically control an account (the interchain account) on a remote chain.

Sometimes interchain accounts are referred to as _cross-chain writes_. This is in conjunction with interchain queries (ICQ) or the ability to read data from a remote chain, i.e. _cross-chain reads_.

The specification describing the interchain accounts application protocol is [ICS-27(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/app/ics-027-interchain-accounts).

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

The ibc-go implementation of ICA can be found [in the apps sub-directory(opens new window)](https://github.com/cosmos/ibc-go/tree/main/modules/apps/27-interchain-accounts).

The corresponding documentation can be found in the [ibc-go docs(opens new window)](https://ibc.cosmos.network/main/apps/interchain-accounts/overview.html).

## [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#ica-core-functionality-controller-host) ICA Core Functionality: Controller & Host

From the description above, a distinction needs to be made between the so-called "host" and "controller" chains. Unlike ICS-20, which is inherently bi-directional in the sense that both chains can use the transfer module to send and receive tokens, ICA has a more unidirectional design. Only the controller chain can send executable logic over the channel, which will then always be executed on the host chain.

Several relevant definitions relating to ICA are as follows:

**Host Chain:** the chain where the interchain account is registered. The host chain listens for IBC packets from a controller chain which should contain instructions (e.g. cosmos SDK messages) which the interchain account will execute.

**Controller Chain:** the chain that registers and controls an account on a host chain. The controller chain sends IBC packets to the host chain to control the account.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

The interchain accounts application module is structured to **support the ability to exclusively enable controller or host functionality**. This can be achieved by simply omitting either the controller or host `Keeper` from the interchain account's `NewAppModule` constructor function, and mounting only the desired submodule via the `IBCRouter`. Alternatively, [submodules can be enabled and disabled dynamically using on-chain parameters(opens new window)](https://ibc.cosmos.network/main/apps/interchain-accounts/parameters.html).

**Interchain account (ICA):** an account on a host chain. An interchain account has all the capabilities of a normal account. However, rather than signing transactions with a private key, a controller chain's authentication module will send IBC packets to the host chain which contain the transactions that the interchain account should execute.

**Interchain account owner:** an account on the controller chain. Every interchain account on a host chain has a respective owner account on a controller chain. This owner account could be a module account (in Cosmos SDK chains) or an analogous account, it is not strictly limited to regular user accounts.

Now it's time to look at the API on both the controller and host sides.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#controller-api) Controller API

The controller chain is the chain on which the controller account lives. This controller account is then able to open an ICA channel to a host chain, and create an interchain account on the other side of the channel which lives on the host chain. The owner of the controller account can then send instructions (via transactions) with the ICA module to the account that it controls on the host chain. How to authenticate owners will be handled in a later section.

The provided API on the controller submodule consists of:

- `RegisterInterchainAccount`: this enables the registration of interchain accounts on the host side, associated with an owner on the controller side.
- `SendTx`: once an ICA has been established, this allows you to send transaction bytes over an IBC channel to have the ICA execute it on the host side.

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#register-an-interchain-account) Register an Interchain account

`RegisterInterchainAccount` is a self-explanatory entry point to the process. Specifically, it generates a new controller portID using the owner account address; it binds an IBC port to the controller portID, and initiates a channel handshake to open a channel on a connection between the controller and host chains. An error is returned if the controller portID is already in use.

A `ChannelOpenInit` event is emitted that can be picked up by an off-chain process such as a relayer. The account will be registered during the `OnChanOpenTry` step on the host chain. This function must be called after an OPEN connection is already established with the given connection identifier.

Copy<br/>
// pseudo codefunctionRegisterInterchainAccount(connectionId: Identifier, owner:string, version:string)returns(error)

![](https://tutorials.cosmos.network/academy/3-ibc/images/icaregister.png)

![](https://tutorials.cosmos.network/hi-star-icon.svg)

It is best practice that the `portId` for an ICA channel is `icahost` on the host side, while on the controller side it will be dependent on the owner account, for example `icacontroller-<owner-account>`.

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#sending-a-transaction) Sending a Transaction

`SendTx` allows the owner of an interchain account to send an IBC packet containing instructions (messages) to an interchain account on a host chain.

Copy<br/>
// pseudo codefunctionSendTx(<br/>
capability: CapabilityKey,<br/>
connectionId: Identifier,<br/>
portId: Identifier,<br/>
icaPacketData: InterchainAccountPacketData,<br/>
timeoutTimestamp uint64): uint64 {// check if there is a currently active channel for// this portId and connectionId, which also implies an// interchain account has been registered using// this portId and connectionId<br/>
activeChannelID, found =GetActiveChannelID(portId, connectionId)abortTransactionUnless(found)// validate timeoutTimestampabortTransactionUnless(timeoutTimestamp <=currentTimestamp())// validate icaPacketDataabortTransactionUnless(icaPacketData.type ==EXECUTE_TX)abortTransactionUnless(icaPacketData.data!= nil)// send icaPacketData to the host chain on the active channel<br/>
sequence = handler.sendPacket(<br/>
capability,<br/>
portId,// source port ID<br/>
activeChannelID,// source channel ID0,<br/>
timeoutTimestamp,<br/>
icaPacketData<br/>
)return sequence<br/>
}

![](https://tutorials.cosmos.network/hi-note-icon.svg)

The packet data that is sent over IBC, `icaPacketData`, should be of type `EXECUTE_TX` and have a **non nil** data field.

Additionally, note that `SendTx` calls core IBC's `sendPacket` API to transport the packet over the ICS-27 channel.

![](https://tutorials.cosmos.network/academy/3-ibc/images/icasendtx.png)

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#ics-27-channels) ICS-27 Channels

After an interchain account has been registered on the host side, the main functionality is provided by `SendTx`. When designing ICA for the ibc-go implementation, a decision was made to use [`ORDERED` channels](https://tutorials.cosmos.network/academy/3-ibc/3-channels.html), to ensure that messages are executed in the desired order on the host side, akin to the use of the transaction `sequence` for regular accounts.

A limitation when using `ORDERED` channels is that when a packet times out the channel will be closed. In the case of a channel closing, it is desirable that a controller chain is able to regain access to the interchain account registered on this channel. The concept of _active channels_ enables this functionality.

When an interchain account is registered using the `RegisterInterchainAccount` flow, a new channel is created on a particular port. During the `OnChanOpenAck` and `OnChanOpenConfirm` steps (on the controller and host chains respectively) the active channel for this interchain account is stored in state.

It is possible to create a new channel using the same controller chain `portID` if the previously set active channel is now in a `CLOSED` state.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

For example, **in ibc-go** one can create a new channel using the interchain account programmatically by sending a new `MsgChannelOpenInit` message, like:

Copy<br/>
msg:= channeltypes.NewMsgChannelOpenInit(<br/>
portID,string(versionBytes),<br/>
channeltypes.ORDERED,\[\]string{connectionID},<br/>
icatypes.HostPortID,<br/>
authtypes.NewModuleAddress(icatypes.ModuleName).String())<br/>
handler:= keeper.msgRouter.Handler(msg)<br/>
res, err:=handler(ctx, msg)if err!=nil{return err<br/>
}

Alternatively, any relayer operator may initiate a new channel handshake for this interchain account once the previously set `Active Channel` is in a `CLOSED` state. This is done by initiating the channel handshake on the controller chain **using the same portID** associated with the interchain account in question.

It is important to note that once a channel has been opened for a given interchain account, new channels cannot be opened for this account until the current `Active Channel` is set to `CLOSED`.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#host-api) Host API

The host chain is the chain where the interchain account is created and the transaction (sent by the controller) is executed.

Therefore, the provided API on the host submodule consists of:

- `RegisterInterchainAccount`: enables the registration of interchain accounts on the host, associated with an owner on the controller side.
- `ExecuteTx`: enables the transaction data to be executed, provided successful authentication.
- `AuthenticateTx`: checks that the signer of a particular message is the interchain account associated with the counterparty portID of the channel that the IBC packet was sent on.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

The host API methods run automatically as part of the flow and need not be exposed to an end-user or module, as is the case on the controller side with `RegisterInterchainAccount` and `SendTx`.

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#register-an-interchain-account-2) Register an Interchain account

The `RegisterInterchainAccount` flow was discussed on the controller side already, where it triggered a handshake. On the host side is a complementary part of the flow, but here it's triggered in the `OnChanOpenTry` step of the handshake, which will create the interchain account.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

Although from the spec point of view we can call this the `RegisterInterchainAccount` flow, the actual function being called on the host side in ibc-go is called [`createInterchainAccount`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/apps/27-interchain-accounts/host/keeper/account.go#L14).

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#executing-transaction-data) Executing Transaction Data

The host chain state machine will be able to execute the transaction data by extracting it from the `InterchainPacketData`:

Copy<br/>
messageInterchainAccountPacketData{enum type<br/>
bytes data =1;string memo =2;}

The type should be `EXECUTE_TX` and data contains an array of messages the host chain can execute.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

Executing the transaction data will depend on the execution environment (which blockchain you are on). An example for the ibc-go implementation can be found [here(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/apps/27-interchain-accounts/host/keeper/relay.go).

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#authenticating-the-transaction) Authenticating the Transaction

`AuthenticateTx` is called before `ExecuteTx`. It checks that the signer of a particular message is the interchain account owner associated with the counterparty portID of the channel that the IBC packet was sent on.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

Remember that the port ID on the controller side was recommended to be of the format `icacontroller-<owner-account>`. Therefore, the owner account to be authenticated can be found from the counterparty port ID.

Up until this point you may have wondered how authentication is handled on the controller side. This will be the topic of the next section.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

The above information is applicable to all implementations of ICS-27, unless explicitly stated otherwise.

By contrast, be aware that the following information deals with the ibc-go implementation specifically.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#authentication) Authentication

The ICA controller submodule provides an API for registering an account and for sending interchain transactions. It has been purposefully made lean and limited to generic controller functionality. For authentication of the owner accounts, the developer is expected to provide an authentication module with the ability to interact with the ICA controller submodule.

Here are some relevant definitions:

**Authentication Module:**

- Generic authentication module: Cosmos SDK modules (`x/auth`, `x/gov`, or `x/group`) that offer authentication functionality and can send messages to the ICS-27 module through a `MsgServer`.
- Custom authentication module: a custom SDK module (satisfying only the `AppModule` but not `IBCModule` interface) that offers custom authentication and can send messages to the ICS-27 module through a `MsgServer`.
- Legacy authentication module: an IBC application module on the controller chain that acts as underlying application for the ICS-27 controller submodule middleware. It forms an IBC middleware stack with the ICS-27 controller module, facilitating communication across the stack.

An **authentication module** must:

- Authenticate interchain account owners.
- Track the associated interchain account address for an owner.
- Send packets on behalf of an owner (after authentication).

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

Originally, when ICA was first introduced in ibc-go v3, developers had to develop a custom authentication module as an IBC application that was wrapped by the ICS-27 module acting as middleware. In ibc-go v6, a refactor of ICA took place that enabled Cosmos SDK modules (`x/auth`, `x/gov`, or `x/group`) to act as generic authentication modules that required no extra development.

A `MsgServer` was added to the ICA controller submodule to facilitate this.

More information regarding the details and context for the redesign can be found in [ADR-009(opens new window)](https://github.com/cosmos/ibc-go/blob/main/docs/architecture/adr-009-v6-ics27-msgserver.md) or in a [dedicated blog post(opens new window)](https://medium.com/the-interchain-foundation/ibc-go-v6-changes-to-interchain-accounts-and-how-it-impacts-your-chain-806c185300d7) on the topic.

For now, the legacy API remains available for those developers who have already built custom IBC authentication modules, but it will be deprecated in the future.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

**SDK Security Model**

SDK modules on a chain are assumed to be trustworthy. For example, there are no checks to prevent an untrustworthy module from accessing the bank keeper.

The implementation of [ICS-27(opens new window)](https://github.com/cosmos/ibc/blob/master/spec/app/ics-027-interchain-accounts/README.md) on [ibc-go(opens new window)](https://github.com/cosmos/ibc-go/tree/main/modules/apps/27-interchain-accounts) uses this assumption in its security considerations. It assumes that:

- The authentication module will not try to open channels on owner addresses it does not control.
- Other IBC application modules will not bind to ports within the [ICS-27(opens new window)](https://github.com/cosmos/ibc/blob/master/spec/app/ics-027-interchain-accounts/README.md) namespace.

More information on which type of authentication module to use for which development use case can be found [here(opens new window)](https://ibc.cosmos.network/main/apps/interchain-accounts/development.html).

There you will find references to development use cases requiring access to the packet callbacks, which are discussed in the next section.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#application-callbacks) Application Callbacks

Custom authentication is one potential use case for the use of interchain accounts; however, another important use case quickly became apparent: interchain accounts packets being sent as part of a composable programmatic flow.

As an example, consider a remote-controlled atomic swap:

1. Send an ICS-20 packet to a remote chain.
2. If it is successful, then send an ICA-packet to swap tokens on a liquidity pool (LP) on the host chain.
3. Return the funds back to the sender (on the controller chain).

![](https://tutorials.cosmos.network/hi-star-icon.svg)

The request from the community to enable a standard for this type of flow resulted in [ADR-008(opens new window)](https://github.com/cosmos/ibc-go/blob/main/docs/architecture/adr-008-app-caller-cbs.md), which extends the ability for general use cases.

It is advisable to follow developments around ADR-008 and the so-called _callback interface for IBC actors_, i.e. secondary applications (like smart contracts for example) that want to call into IBC apps as part of their state machine logic.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/8-ica.html#practical-exercise) Practical Exercise

Ready to get your hands dirty now that you understand how ICA works? Try out [this tutorial(opens new window)](https://github.com/cosmos/ibc-go/wiki/How-to-use-groups-with-ICA) on how to use groups with interchain accounts.

previous

[**IBC Token Transfer**](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html)

up next

[**IBC Middleware**](https://tutorials.cosmos.network/academy/3-ibc/9-ibc-mw-intro.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

### Light Clients

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[IBC ecosystem expansion](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#ibc-ecosystem-expansion)

[Light client development - a high-level overview](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#light-client-development-a-high-level-overview)

[Recap: what does a light client do?](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#recap-what-does-a-light-client-do)

[Major interfaces](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#major-interfaces)

[Handling client messages](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#handling-client-messages)

[Packet commitment verification](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#packet-commitment-verification)

[Add the light client to a Cosmos SDK chain](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#add-the-light-client-to-a-cosmos-sdk-chain)

# [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#light-client-development) Light Client Development

17 min read

Concept

IBC

![](https://tutorials.cosmos.network/hi-prerequesite-icon.svg)

Before you dive into light clients, we recommend reviewing the following sections:

- [What is IBC?](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html)
- [Transport, Authentication, and Ordering Layer - Clients](https://tutorials.cosmos.network/academy/3-ibc/4-clients.html)

![](https://tutorials.cosmos.network/hi-target-icon.svg)

In this section, you will learn:

- Why we need extra light clients to be developed
- What light client developers need to do, and where to find documentation
- How to get a new light client on your chain

## [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#ibc-ecosystem-expansion) IBC Ecosystem Expansion

IBC was envisioned in the original Cosmos whitepaper to be both a crucial component of the appchain thesis for the interchain network and also a generic and universally applicable standard for blockchain interoperability.

Whereas the protocol always envisioned the wider adoption of IBC, the ibc-go implementation initially was focused on its usage in Cosmos SDK chains connecting to similar chains. In order to expand IBC to other chain ecosystems, the [ibc-go v7 release(opens new window)](https://github.com/cosmos/ibc-go/releases/tag/v7.0.0) included a refactor to the `02-client` submodule, which should streamline the development of light clients to connect ibc-go to chains with another consensus than `07-tendermint`.

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

In this section, it is assumed that the version of ibc-go is >= v7. For more information about the changes and the motivation, please refer to this [blog post(opens new window)](https://medium.com/the-interchain-foundation/client-refactor-laying-the-groundwork-for-ibc-to-expand-across-ecosystems-61ec5a1b63bc) or [ADR-006(opens new window)](https://github.com/cosmos/ibc-go/blob/main/docs/architecture/adr-006-02-client-refactor.md) on the topic of the client refactor.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#light-client-development-a-high-level-overview) Light Client Development - a High-level Overview

![](https://tutorials.cosmos.network/hi-reading-icon.svg)

The development of a light client for heterogeneous chains is a complex topic and is outside of the scope presented here. Light client developers are urged to instead refer to [the light client developer guide(opens new window)](https://ibc.cosmos.network/main/ibc/light-clients/overview.html) in the ibc-go documentation.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#recap-what-does-a-light-client-do) Recap: what Does a light Client Do?

A short and succinct **summary of a light client's functionality** is the following: a light client stores a trusted consensus state, and provides functionality to verify updates to the consensus state or verify packet commitments against the trusted root by using Merkle proofs.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#major-interfaces) Major Interfaces

Access to IBC light clients is gated by the core IBC `MsgServer`, which utilizes the abstractions set by the `02-client` submodule to call into a light client module. A light client module developer is only required to implement a set of interfaces as defined in the `modules/core/exported` package of ibc-go.

A light client module developer should be concerned with three main interfaces:

- [`ClientState`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/exported/client.go#L36) contains all the information needed to verify a `ClientMessage` and perform membership and non-membership proof verification of the counterparty state. This includes properties that refer to the remote state machine, the light client type, and the specific light client instance.
- [`ConsensusState`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/exported/client.go#L133) tracks consensus data used for verification of client updates, misbehavior detection, and proof verification of the counterparty state.
- [`ClientMessage`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/exported/client.go#L147) is used for submitting block headers (single or batch) for client updates, and submission of misbehavior evidence using conflicting headers.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#handling-client-messages) Handling Client Messages

The light client can be updated by handling the aforementioned `ClientMessage`. This will either be an update to the `ConsensusState` through verification of a single header or multiple batched headers, or it could be evidence of misbehavior which (if confirmed) will result in the client getting frozen for security reasons.

The `ClientMessage` will be passed onto the client through a `MsgUpdateClient` (generally submitted by a relayer). The `02-client`'s [`UpdateClient`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/02-client/keeper/client.go#L48) method will then handle the client message by using [these 4 methods on the `ClientState` interface(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/exported/client.go#L98-L109):

- `VerifyClientMessage`
- `CheckForMisbehaviour`
- `UpdateStateOnMisbehaviour`
- `UpdateState`

For the full explanation, please refer to [the docs(opens new window)](https://ibc.cosmos.network/main/ibc/light-clients/updates-and-misbehaviour.html).

![](https://tutorials.cosmos.network/hi-note-icon.svg)

You will note that the `ClientState` interface also contains the following methods:

- `VerifyUpgradeAndUpdateState`
- `CheckSubstituteAndUpdateState`

These similarly provide the functionality to update the client based on handling messages but they cover the less frequent cases of, respectively:

- Upgrading the light client when the remote chain it is representing upgrades - read the docs [here(opens new window)](https://ibc.cosmos.network/main/ibc/light-clients/upgrades.html).
- Updating the client with the state of a substitute client (following a client being expired) through a governance proposal -read the docs [here(opens new window)](https://ibc.cosmos.network/main/ibc/light-clients/proposals.html).

![](https://tutorials.cosmos.network/hi-info-icon.svg)

Prior to the client refactor (prior to v7) the client and consensus states are set within the `02-client` submodule. Moving these responsibilities from the `02-client` to the individual light client implementations (including the setting of updated client state and consensus state in the client store) provides light client developers with a greater degree of flexibility with respect to storage and verification, and allows for the abstraction of different types of consensus states/consensus state verification methods away from IBC clients and the connections/channels that they support.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#packet-commitment-verification) Packet Commitment Verification

In addition to updating the client and consensus state, the light client also provides functionality to perform the verification required for the packet flow (send, receive, and acknowledge or timeout). IBC currently uses Merkle proofs to verify against the trusted root if the state is either committed or absent on a predefined standardized key path, as defined in [ICS-24 host requirements(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/core/ics-024-host-requirements).

As you have seen in the [previous section on clients](https://tutorials.cosmos.network/academy/3-ibc/4-clients.html), when the IBC handler receives a message to receive, acknowledge, or timeout a packet, it will call one of the following functions on the `connectionKeeper` to verify if the remote chain includes (or does not include) the appropriate state:

- [`VerifyPacketCommitment`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/03-connection/keeper/verify.go#L205) checks if the proof added to a `MsgRecvPacket` submitted to the destination points to a valid packet commitment on the source.
- [`VerifyPacketAcknowledgement`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/03-connection/keeper/verify.go#L250) checks if the proof added to a `MsgAcknowledgePacket` submitted to the source points to a valid packet receipt commitment on the destination.
- [`VerifyPacketReceiptAbsence`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/03-connection/keeper/verify.go#L296) checks if the proof added to a `MsgTimeout` submitted to the source proves that a packet receipt is absent at a height beyond the timeout height on the destination.

All of the above rely on either `VerifyMembership` or `VerifyNonMembership` methods to prove either inclusion (also referred to as _existence_) or non-inclusion (_non-existence_) at a given commitment path.

It is up to the light client developer to add these methods to their light client implementation.

![](https://tutorials.cosmos.network/hi-reading-icon.svg)

Please refer to the [ICS-23 implementation(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/23-commitment/types/merkle.go#L131-L205) for a concrete example.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#add-the-light-client-to-a-cosmos-sdk-chain) Add the light Client to a Cosmos SDK Chain

Suppose that you have managed to develop a light client implementation fulfilling the requirements described above. How do you now get the light client on-chain?

This will depend on the chain environment you are in, so from here on the assumption will be made that you want to add the light client module to a Cosmos SDK chain, in order for the Cosmos SDK chain that you are interacting with to be able to verify proofs of the consensus state coming from your non- `07-tendermint` chain.

For example, if you are developing a light client which enables proof verification of ETH2 or Solana, you would need to deploy a light client that can verify proofs of ETH2 or Solana consensus state on Cosmos SDK chains which you want to interoperate with.

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#configure-the-light-client-module) Configure the light Client Module

You will be adding your light client as an SDK module which must implement the SDK's [`AppModuleBasic`(opens new window)](https://github.com/cosmos/cosmos-sdk/blob/main/types/module/module.go#L50) interface.

You must then register your light client module with `module.BasicManager` in the chain's `app.go` file.

More information can be found [here(opens new window)](https://ibc.cosmos.network/main/ibc/light-clients/setup.html#configuring-a-light-client-module).

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#get-support-through-governance) Get Support through Governance

In order to successfully create an IBC client using a new client type, it [must be supported(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/02-client/keeper/client.go#L19-L25). Light client support in IBC is gated by on-chain governance. The allow list may be updated by submitting a new governance proposal to update the `02-client` parameter `AllowedClients`.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

To add your light client `0x-new-client` to `AllowedClients`, submit a proposal:

Copy<br/>
$ … tx gov submit-legacy-proposal<br/>
param-change <path/to/proposal.json><br/>
--from=<key_or_address>

where `proposal.json` contains:

Copy<br/>
{"title":"IBC Clients Param Change","description":"Update allowed clients","changes":\[{"subspace":"ibc","key":"AllowedClients","value":\["06-solomachine","07-tendermint","0x-new-client"\]}\],"deposit":"1000stake"}

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#create-client-instances) Create Client Instances

When the governance proposal has passed, relayers can create client instances by submitting a `MsgCreateClient` as described in [the previous section on IBC light clients](https://tutorials.cosmos.network/academy/3-ibc/4-clients.html#creating-a-client).

And there you have it: you have contributed to the expansion of IBC to other ecosystems!

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

This section is meant as a short introduction to the topic of light client development, for further information we recommend taking a look at the [ibc-go docs(opens new window)](https://ibc.cosmos.network/main/ibc/light-clients/overview.html).

synopsis

To summarize, this section has explored:

- How the development of IBC light clients is crucial to the expansion of IBC into other ecosystems, to connect them to the interchain.
- Where to find the required documentation in the form of a _light client developer guide_ if you need to develop a light client.
- What the most important interfaces are: client and consensus state and client messages.
- How a client can get updates.
- How a client can verify packets against its trusted root using Merkle proofs.

previous

[**IBC/TAO - Clients**](https://tutorials.cosmos.network/academy/3-ibc/4-clients.html)

up next

[**IBC Solo Machine**](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[IBC ecosystem expansion](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#ibc-ecosystem-expansion)

[Light client development - a high-level overview](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#light-client-development-a-high-level-overview)

[Recap: what does a light client do?](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#recap-what-does-a-light-client-do)

[Major interfaces](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#major-interfaces)

[Handling client messages](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#handling-client-messages)

[Packet commitment verification](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#packet-commitment-verification)

[Add the light client to a Cosmos SDK chain](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html#add-the-light-client-to-a-cosmos-sdk-chain)

#### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

#### Solo Machine Client

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[How does it work?](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#how-does-it-work)

[Why use a solo machine client?](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#why-use-a-solo-machine-client)

[Solo machine client](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#solo-machine-client-2)

[Solo machine client state and consensus state](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#solo-machine-client-state-and-consensus-state)

[Verifying signatures](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#verifying-signatures)

[Practical example](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#practical-example)

[Conclusion](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#conclusion)

# [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#solo-machine-client) Solo Machine Client

92 min read

Concept

IBC

DevOps

![](https://tutorials.cosmos.network/hi-target-icon.svg)

In this section, you will:

- Get a high-level overview of the solo machine client and the specification for solo machines.
- Dive into how the solo machine client works.
- Learn about the benefits of using the client.
- Explore a solo machine implementation.

IBC is the Inter-Blockchain Communication protocol, so its scope must be limited for use within blockchains right? Well, not quite. IBC was indeed conceived as a solution for interoperability between blockchains, or more generally between distributed ledgers. However, at the same time the design of the protocol aimed to be as universal and extensible as possible. It aims to **set a minimal set of requirements or interfaces a state machine must satisfy to communicate with remote counterparties**. This includes replicated state machines (i.e. blockchains), but the interfaces can also be satisfied by other data systems, such as _solo machines_.

A solo machine is a standalone process that can interact with blockchains through IBC. It can store key information, like signed messages and private keys, but has no consensus algorithm of its own. The _solo machine client_ can be seen as a verification algorithm capable of authenticating messages sent from a solo machine. With solo machines, one can access the IBC transport layer and blockchains (including features built on them) within the interchain without developing one's own blockchain.

Anything from a web application hosted on a server, to a browser, to the mobile in your pocket is a solo machine. And these systems are capable of speaking IBC!

This is made possible using the IBC solo machine client.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

Note that we are discussing two different things here. On the one hand is the solo machine, the actual standalone machine used to sign messages to interact with IBC-enabled chains (see the examples above).

On the other hand is the _solo machine client_, which is the on-chain client allowing us to verify messages _sent by_ the solo machine on a remote counterparty chain.

The solo machine itself still stores a light client representing the chain it wants to communicate with through IBC.

Make sure not to mix these up when talking about solo machines!

## [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#how-does-it-work) How Does it Work?

Unlike a typical [IBC light client](https://tutorials.cosmos.network/academy/3-ibc/4-clients.html), which uses Merkle proofs to verify the validity of messages sent from a counterparty, a solo machine client keeps track of state by simply checking the authenticity of digital signatures.

Even though solo machines don't have a provable consensus algorithm, they are still capable of **storing a public/private key pair and can also support multi-signature keys**.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/solomachine.png)

As an example, when blockchain A communicates with a solo machine over IBC, it registers the solo machine's public key(s) in its (blockchain A's) state machine through the _solo machine client_. Verifying the validity of a message sent from the solo machine is as simple as ensuring that the message was signed by its private key (as shown in Figure 1 above).

This is a significantly simpler and more cost-efficient mechanism of state verification compared to the full-fledged light client-based model.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

A solo machine with a single key pair can be suitable for a PoA-like/trusted setup—applicable for various enterprise solutions. The client is also capable of updating keys, so a single key pair can be rotated on a regular basis for security. Using a threshold signature or multi-signature design offers the same security guarantees as an externally-verified bridging solution, but with the additional capability of interacting and communicating over IBC.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#why-use-a-solo-machine-client) Why Use a Solo Machine Client?

There are three key benefits to using an IBC solo machine client:

1. It provides access to the IBC transport layer—and as a result, all the chains and ecosystems connected to it (as well as the features and applications built on top).
2. It removes the economic and operational overhead that comes with developing an entire blockchain in order to use IBC.
3. It is suitable to directly interoperate with chains where implementing a regular IBC light client can be complex (for example, on Ethereum due to its probabilistic finality).

The transport layer of IBC—responsible for the transport, authentication, and ordering of data packets—is a powerful standard for blockchain interoperability. It offers access to a variety of IBC applications such as token transfers, cross-chain oracle data feeds, cross-chain governance, and fee middleware, as well as features like interchain accounts, interchain queries, and more. The use of a solo machine not only grants access to this trust-minimized, general-purpose, and ever growing interoperability framework, but one can do so without even having to develop a blockchain.

Another exciting feature of using a solo machine is that it can leverage interchain accounts (ICA). In short, ICA allows a (controller) chain/solo machine to control an account on another (host) chain/solo machine. This opens up a plethora of interesting use-cases. For example, a solo machine acting as the controller can delegate funds to be staked on a host chain. The benefit here is that the private keys associated with the controller account (on the solo machine in this example) can be rotated without having to undelegate on the host side; instead, you update the private key on the controller and then redelegate.

The solo machine can also be used to mint/burn tokens, request and receive oracle data (by using BandChain for example), use ICA for cross-chain/machine composability, and more. Given that any IBC-level application can be leveraged by a solo machine, the possibilities are virtually endless, and up to the imagination of developers making use of this client.

![](https://tutorials.cosmos.network/hi-reading-icon.svg)

Crypto.com is the quintessential example of a centralized exchange bringing the IBC solo machine to production by issuing tokens on their public blockchain, Crypto.org. This allows Crypto.com to issue pegged DOT and XLM (Polkadot and Stellar's native tokens respectively) which are of the ICS-20 (fungible token transfer) level. Hence the tokens can be sent to any chain that's IBC-enabled and used within DeFi protocols.

As mentioned in [Crypto.org’s blog post(opens new window)](https://medium.com/crypto-org-chain/crypto-org-chain-issues-dot-token-via-ibc-solo-machine-b0f58e605b0e), _without_ an IBC solo machine an entity looking to issue tokens would be required to develop a standalone blockchain, connect it to IBC, and maintain/procure the relayer infrastructure required for system liveness. This naturally demands greater resources relative to deploying a solo machine.

Read more about Crypto.org's use of solo machines in [their docs(opens new window)](https://crypto.org/docs/resources/solo-machine.html).

## [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#solo-machine-client-2) Solo Machine Client

The ibc-go implementation contains a solo machine client, `06-solomachine`, which enables Cosmos SDK chains to interact with solo machines over IBC. In this section, a high-level overview is provided into the [specification for solo machines(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/client/ics-006-solo-machine-client).

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

The content provided here will remain high level and focused at the specification. If you wish to take a more in-depth look at the ibc-go `06-solomachine` implementation, you can refer to either [the docs(opens new window)](https://ibc.cosmos.network/main/ibc/light-clients/solomachine/solomachine.html) or [the code(opens new window)](https://github.com/cosmos/ibc-go/tree/v7.0.0/modules/light-clients/06-solomachine).

### [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#solo-machine-client-state-and-consensus-state) Solo Machine Client State and Consensus State

If you paid close attention to the previous section on light client development and the introduction on solo machine (clients), you may already have an idea of how a solo machine implementation might look.

From the light client development section, you know that light client developers should be mainly concerned with these interfaces:

- `ClientState`
- `ConsensusState`
- `ClientMessage`

Furthermore, from the introduction you can derive that:

- The solo machine client will need access to the public key of the solo machine to verify signatures, so you would expect this to be stored in state.
- To verify the signature that a packet or client message is signed with, the client will need functionality to handle this.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

The solo machine client is a reminder of the power of the generalized client interfaces for IBC light clients. Because of it, significantly different data systems like solo machines and blockchains can still be represented through a unified interface, and therefore can communicate.

However, because a solo machine is a lot less complex than a full-fledged blockchain, you will notice that a lot of the development work for the solo machine client is simplified.

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#clientstate) `ClientState`

The `ClientSate` is rather simple. It will contain the `ConsensusState` and a field to indicate whether the client is frozen:

Copy<br/>
interfaceClientState{<br/>
frozen:boolean<br/>
consensusState: ConsensusState<br/>
}

It must of course also implement the `ClientState` methods defined in [the spec(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/core/ics-002-client-semantics#clientstate).

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#consensusstate) `ConsensusState`

Next to the public key, the `ConsensusSate` also contains a timestamp and diversifier. The diversifier is an arbitrary string, chosen when the client is created, designed to allow the same public key to be re-used across different solo machine clients (potentially on different chains) without this being considered misbehavior.

Copy<br/>
interfaceConsensusState{<br/>
sequence: uint64 // deprecated<br/>
publicKey: PublicKey<br/>
diversifier:string<br/>
timestamp: uint64<br/>
}

It must of course also implement the `ConsensusState` methods defined in [the spec(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/core/ics-002-client-semantics#consensusstate).

### [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#verifying-signatures) Verifying Signatures

The essence of the solo machine/solo machine client pair is that we can verify signatures based on public/private key cryptography. The public key is stored in the `ConsensusState` of the solo machine client, and can be used to verify signatures signed with the solo machine private key corresponding to the available public key. This signature verification is used in the following situations:

- When updating the `ConsensusState` with a new public key or diversifier through submitting a `Header`.
- When submitting evidence of `Misbehaviour` to freeze a malicious client.
- When verifying packet commitments.

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#signing-data) Signing Data

The solo machine will sign over some data, `SignBytes`:

Copy<br/>
interfaceSignBytes{<br/>
sequence: uint64<br/>
timestamp: uint64<br/>
diversifier:string<br/>
path:\[\]byte<br/>
data:\[\]byte<br/>
}

It also stores a `Signature` including the data bytes and a timestamp:

Copy<br/>
interfaceSignature{<br/>
data:\[\]byte<br/>
timestamp: uint64<br/>
}

This signature is then added to a message, e.g. the `Header`:

Copy<br/>
interfaceHeader{<br/>
sequence: uint64 // deprecated<br/>
timestamp: uint64<br/>
signature: Signature<br/>
newPublicKey: PublicKey<br/>
newDiversifier:string}

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#client-message-signature-verification) Client Message Signature Verification

Remember from the section on light client development that the client can be updated (with new state or evidence of misbehavior) by submitting a `ClientMessage`.

The `ClientMessage` will be passed onto the client by submitting a `MsgUpdateClient`. Although IBC messages are typically submitted by relayers, it can be advantageous to integrate a relayer directly into the solo machine's server in certain cases, such as with crypto.com's implementation. The `02-client`'s [`UpdateClient`(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/core/02-client/keeper/client.go#L48) method will then handle the client message by using [these four methods on the `ClientState` interface(opens new window)](https://github.com/cosmos/ibc-go/blob/02-client-refactor-beta1/modules/core/exported/client.go#L98-L109):

- `VerifyClientMessage`
- `CheckForMisbehaviour`
- `UpdateStateOnMisbehaviour`
- `UpdateState`

You can inspect the [solo machine specification(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/client/ics-006-solo-machine-client) for more details, but take a look at the [`verifyClientMessage`(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/client/ics-006-solo-machine-client#validity-predicate) where a `switch` statement is used to differentiate between submitting a header or evidence of misbehavior.

You will notice in both cases some pseudo code that requires to perform the signature checks:

Copy<br/>
assert(checkSignature(cs.consensusState.publicKey, signBytes,{msgType}.signature))

The stored public key is used to check if the signature used to sign the `signBytes` was in fact the private key corresponding to it.

In ibc-go this is performed in the [solo machine's `proof.go` file(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/light-clients/06-solomachine/proof.go) by the `VerifySignature` function.

Body of client message verification functions

Copy<br/>
functionverifyClientMessage(clientMsg: ClientMessage){switchtypeof(ClientMessage){case Header:verifyHeader(clientMessage)// misbehaviour only supported for current public key and diversifier on solo machinecase Misbehaviour:verifyMisbehaviour(clientMessage)}}functionverifyHeader(header: header){<br/>
clientState = provableStore.get("clients/{clientMsg.identifier}/clientState")assert(header.timestamp >= clientstate.consensusState.timestamp)<br/>
headerData ={<br/>
newPubKey: header.newPubKey,<br/>
newDiversifier: header.newDiversifier,}<br/>
signBytes =SignBytes(<br/>
sequence: clientState.consensusState.sequence,<br/>
timestamp: header.timestamp,<br/>
diversifier: clientState.consensusState.diversifier,<br/>
path:\[\]byte{"solomachine:header"},<br/>
value:marshal(headerData))assert(checkSignature(cs.consensusState.publicKey, signBytes, header.signature))}functionverifyMisbehaviour(misbehaviour: Misbehaviour){<br/>
clientState = provableStore.get("clients/{clientMsg.identifier}/clientState")<br/>
s1 = misbehaviour.signatureOne<br/>
s2 = misbehaviour.signatureTwo<br/>
pubkey = clientState.consensusState.publicKey<br/>
diversifier = clientState.consensusState.diversifier<br/>
timestamp = clientState.consensusState.timestamp<br/>
// assert that the signatures validate and that they are different<br/>
sigBytes1 =SignBytes(<br/>
sequence: misbehaviour.sequence,<br/>
timestamp: s1.timestamp,<br/>
diversifier: diversifier,<br/>
path: s1.path,<br/>
data: s1.data<br/>
)<br/>
sigBytes2 =SignBytes(<br/>
sequence: misbehaviour.sequence,<br/>
timestamp: s2.timestamp,<br/>
diversifier: diversifier,<br/>
path: s2.path,<br/>
data: s2.data<br/>
)// either the path or data must be different in order for the misbehaviour to be validassert(s1.path!= s2.path \|\| s1.data!= s2.data)assert(checkSignature(pubkey, sigBytes1, misbehaviour.signatureOne.signature))assert(checkSignature(pubkey, sigBytes2, misbehaviour.signatureTwo.signature))}

#### [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#state-signature-verification) State Signature Verification

Similarly, to verify if the signature that signed a state transition is valid, remember that a light client has to implement `VerifyMembership` and `VerifyNonMembership` methods.

There you will find similar pseudo code relating to signature verification:

Copy<br/>
proven =checkSignature(clientState.consensusState.publicKey, signBytes, proof.sig)

In ibc-go this is performed in the [solo machine's `proof.go` file(opens new window)](https://github.com/cosmos/ibc-go/blob/v7.0.0/modules/light-clients/06-solomachine/proof.go) by the `VerifySignature` function.

Body of state verification functions

Copy<br/>
functionverifyMembership(<br/>
clientState: ClientState,// provided height is unnecessary for solo machine// since clientState maintains the expected sequence<br/>
height: uint64,// delayPeriod is unsupported on solo machines// thus these fields are ignored<br/>
delayTimePeriod: uint64,<br/>
delayBlockPeriod: uint64,<br/>
proof: CommitmentProof,<br/>
path: CommitmentPath,<br/>
value:\[\]byte<br/>
): Error {// the expected sequence used in the signatureabortTransactionUnless(!clientState.frozen)abortTransactionUnless(proof.timestamp >= clientState.consensusState.timestamp)<br/>
signBytes =SignBytes(<br/>
sequence: clientState.consensusState.sequence,<br/>
timestamp: proof.timestamp,<br/>
diversifier: clientState.consensusState.diversifier,<br/>
path: path.String(),<br/>
data: value,)<br/>
proven =checkSignature(clientState.consensusState.publicKey, signBytes, proof.sig)if!proven {return error<br/>
}// increment sequence on each verification to provide// replay protection<br/>
clientState.consensusState.sequence++<br/>
clientState.consensusState.timestamp = proof.timestamp<br/>
// unlike other clients, we must set the client state here because we// mutate the clientState (increment sequence and set timestamp)// thus the verification methods are stateful for the solo machine// in order to prevent replay attacks<br/>
provableStore.set("clients/{identifier}/clientState", clientState)return nil<br/>
}functionverifyNonMembership(<br/>
clientState: ClientState,// provided height is unnecessary for solo machine// since clientState maintains the expected sequence<br/>
height: uint64,// delayPeriod is unsupported on solo machines// thus these fields are ignored<br/>
delayTimePeriod: uint64,<br/>
delayBlockPeriod: uint64,<br/>
proof: CommitmentProof,<br/>
path: CommitmentPath<br/>
): Error {abortTransactionUnless(!clientState.frozen)abortTransactionUnless(proof.timestamp >= clientState.consensusState.timestamp)<br/>
signBytes =SignBytes(<br/>
sequence: clientState.consensusState.sequence,<br/>
timestamp: proof.timestamp,<br/>
diversifier: clientState.consensusState.diversifier,<br/>
path: path.String(),<br/>
data: nil,)<br/>
proven =checkSignature(clientState.consensusState.publicKey, signBytes, proof.sig)if!proven {return error<br/>
}// increment sequence on each verification to provide// replay protection<br/>
clientState.consensusState.sequence++<br/>
clientState.consensusState.timestamp = proof.timestamp<br/>
// unlike other clients, we must set the client state here because we// mutate the clientState (increment sequence and set timestamp)// thus the verification methods are stateful for the solo machine// in order to prevent replay attacks<br/>
provableStore.set("clients/{identifier}/clientState", clientState)return nil<br/>
}

## [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#practical-example) Practical Example

Ready to experiment?

Crypto.org is the main user of solo machines up to this point and has an implementation in their [stag repo(opens new window)](https://github.com/devashishdxt/stag) which you can check out for yourself.

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

There is also a tutorial that runs both a solo machine (based on the stag repo from above) and a simple Cosmos SDK chain that shows a solo machine walkthrough. You can follow along [here(opens new window)](https://github.com/cosmos/ibc-go/wiki/IBC-solo-machine).

## [\#](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#conclusion) Conclusion

IBC offers a unique and powerful framework for trust-minimized interoperability, and the impressive growth since its genesis is a testament to its security, composability, and extensibility.

While implementing light clients has been the standard design to plug into IBC, the options are not limited to this one method, and the solo machine (and client) offers an alternative to implementing IBC light clients. Given its simple proof verification method, the solo machine client is considerably easier to deploy from an engineering standpoint, and an effective solution in deployment scenarios where other potential concerns (eg. security) are mitigated by design.

In conclusion, having access to IBC offers a host of benefits, but it is equally important to facilitate ease of access to IBC as much as possible. On this latter point, the solo machine client offers one of the best solutions available today.

synopsis

To summarize, this section has explored:

- A solo machine is a standalone process that can interact with blockchains through IBC.
- It can store key information but has no consensus algorithm of its own.
- The ibc-go implementation contains a solo machine client enabling Cosmos SDK chains to interact with solo machines over IBC.
- The benefits of using the solo machine client.
- The implementation of solo machines.

previous

[**Light Client Development**](https://tutorials.cosmos.network/academy/3-ibc/5-light-client-dev.html)

up next

[**IBC Token Transfer**](https://tutorials.cosmos.network/academy/3-ibc/7-token-transfer.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[How does it work?](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#how-does-it-work)

[Why use a solo machine client?](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#why-use-a-solo-machine-client)

[Solo machine client](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#solo-machine-client-2)

[Solo machine client state and consensus state](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#solo-machine-client-state-and-consensus-state)

[Verifying signatures](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#verifying-signatures)

[Practical example](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#practical-example)

[Conclusion](https://tutorials.cosmos.network/academy/3-ibc/6-solomachine.html#conclusion)

### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)

### What is IBC

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

# [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#what-is-ibc) What is IBC?

26 min read

Concept

IBC

![](https://tutorials.cosmos.network/hi-target-icon.svg)

Inter-Blockchain Communication Protocol solves for communication between blockchains, which is particularly important in the interchain universe.

In this section, you will learn:

- What IBC is.
- How IBC works.
- More about the IBC security guarantees.

The **[Inter-Blockchain Communication Protocol (IBC)(opens new window)](https://ibcprotocol.dev/)** is _a protocol to handle authentication and transport of data between two blockchains_. IBC **requires a minimal set of functions**, specified in the [interchain standards (ICS)(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/ics-001-ics-standard). Notice that those specifications do not limit the network topology or consensus algorithm, so IBC can be used with a wide range of blockchains or state machines. The IBC protocol provides a permissionless way for relaying data packets between blockchains, unlike most trusted bridging technologies. The security of IBC reduces to the security of the participating chains.

IBC solves a widespread problem: cross-chain communication. This problem exists on public blockchains when exchanges wish to perform swaps. The problem arises early in the case of application-specific blockchains, where every asset is likely to emerge from its own purpose-built chain. Cross-chain communication is also a challenge in the world of private blockchains, in cases where communication with a public chain or other private chains is desirable. There are already IBC implementations for private blockchains [such as Hyperledger Fabric and Corda(opens new window)](https://www.hyperledger.org/blog/2021/06/09/meet-yui-one-the-new-hyperledger-labs-projects-taking-on-cross-chain-and-off-chain-operations).

Cross-chain communication between application-specific blockchains in the interchain creates the potential for high horizontal scalability with transaction finality. These design features provide convincing solutions to well-known problems that plague other platforms, such as transaction costs, network capacity, and transaction confirmation finality.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#internet-of-blockchains) Internet of Blockchains

IBC is essential for application-specific blockchains like the ones in the interchain network. It offers a standard communication channel for applications on two different chains that need to communicate with each other.

Most interchain applications execute on their own purpose-built blockchain running their own validator set (at least before the introduction of [Interchain Security(opens new window)](https://informal.systems/2022/05/09/building-with-interchain-security)). These are the application-specific blockchains built with the Cosmos SDK. Applications on one chain may need to communicate with applications on another blockchain, for example, an application could accept tokens from another blockchain as a form of payment. Interoperability at this level calls for a method of exchanging data about the state or the transactions on another blockchain.

While such bridges between blockchains can be built and do exist, they are generally constructed ad-hoc. IBC provides chains with a common protocol and framework for implementing standardized inter-blockchain communication. For chains built with the Cosmos SDK, this comes out of the box, but the IBC protocol is not limited to chains built with the Interchain Stack.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

More details on the specifications will follow in the next section, but notice that IBC is not limited to Cosmos blockchains. Solutions can even be found for cases where some requirements are not initially met. For example, IBC was already providing connectivity between the interchain and the Ethereum blockchain before "the Merge", which saw Ethereum migrate from a Proof-of-Work (PoW) model to Proof-of-Stake (PoS).

As a PoW consensus algorithm does not ensure finality, one of the main requirements to use IBC is not met. Therefore, compatibility with Ethereum was enabled by creating a peg-zone where probabilistic finality is considered deterministic (irreversible) after a given threshold of block confirmations. This solution can serve any IBC connection to a PoW blockchain.

Although application-specific blockchains offer superior (horizontal) scalability compared to general-purpose blockchain platforms, smart contract development for general-purpose chains and generic virtual machines (VMs) like in Ethereum offer their own benefits. IBC provides a method of incorporating the strengths of general-purpose and application-specific blockchains into unified overall designs. For example, it allows a Cosmos chain tailored towards performance and scalability to use funds that originate on Ethereum and possibly record events in a Corda distributed ledger; or, in the reverse, a Corda ledger initiating the transfer of underlying assets defined in the interchain or Ethereum.

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/internetofchains.png)

With cross-chain communication via IBC, a decentralized network of independent and interoperable chains exchanging information and assets is possible. This "internet of blockchains" brings the promise of increased and seamless scalability. In the interchain, the vision being implemented is to have a universe of independent chains that are all connected using peg-zones as bridges between the interchain network and chains outside of it, and connecting all chains via hubs. All of these make up the internet of blockchains.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#high-level-overview-of-ibc) High-level Overview of IBC

The transport layer (TAO) provides the necessary infrastructure to establish secure connections and authenticate data packets between chains. The application layer builds on top of the transport layer and defines exactly how data packets should be packaged and interpreted by the sending and receiving chains.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

The great promise of IBC is providing a reliable, permissionless, and generic base layer (allowing for the secure relaying of data packets), while allowing for composability and modularity with separation of concerns by moving application designs (interpreting and acting upon the packet data) to a higher-level layer.

This separation is reflected in the categories of the ICS in the [general ICS definition(opens new window)](https://github.com/cosmos/ibc/blob/master/spec/ics-001-ics-standard/README.md):

- **IBC/TAO:** Standards defining the Transport, Authentication, and Ordering of packets, i.e. the infrastructure layer. In the ICS, this is comprised by the categories _Core_, _Client_, and _Relayer_.
- **IBC/APP:** Standards defining the application handlers for the data packets being passed over the transport layer. These include but are not limited to fungible token transfers (ICS-20), NFT transfers (ICS-721), and interchain accounts (ICS-27), and can be found in the ICS in the _App_ category.

The following diagram shows how IBC works at a high level:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/ibcoverview.png)

Note three crucial elements in the diagram:

- The chains depend on relayers to communicate. Relayer algorithms ([ICS-18(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/relayer/ics-018-relayer-algorithms)) are the "physical" connection layer of IBC: off-chain processes responsible for relaying data between two chains running the IBC protocol by scanning the state of each chain, constructing appropriate datagrams, and executing them on the opposite chain as is allowed by the protocol.
- Many relayers can serve one or more channels to send messages between the chains.
- Each side of the relay uses the light client of the other chain to quickly verify incoming messages.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

If you're interested in another overview of the IBC protocol, in the following video Callum Waters, Engineering Manager for the Tendermind Core, gives a talk on the methodology allowing interoperability between countless sovereign blockchains and how to build an IBC-compatible app.

HackAtom VI - workshopHow to build an IBC-Compatible App - YouTube

Interchain

3.98K subscribers

[HackAtom VI - workshop- How to build an IBC-Compatible App](https://www.youtube.com/watch?v=OSMH5uwTssk)

Interchain

Search

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

Watch later

Share

Copy link

Watch on

0:00

/ •Live

[Watch on YouTube](https://www.youtube.com/watch?v=OSMH5uwTssk "Watch on YouTube")

### [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#ibc-tao-transport-layer) IBC/TAO - Transport Layer

In the diagram, the relationship between the ICS definitions in the category TAO are illustrated - the arrows illustrating the requirements.

Simply put, the transport layer includes:

- **Light Clients** \- [ICS-2(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/core/ics-002-client-semantics), [6(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/client/ics-006-solo-machine-client), [7(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/client/ics-007-tendermint-client), [8(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/client/ics-008-wasm-client), [9(opens new window)](https://github.com/cosmos/ibc/tree/main/spec/client/ics-009-loopback-cilent): IBC clients are light clients that are identified by a unique client ID. IBC clients track the consensus state of other blockchains and the proof specs of those blockchains required to properly verify proofs against the client's consensus state. A client can be associated with any number of connections to the counterparty chain.
- **Connections** \- [ICS-3(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/core/ics-003-connection-semantics): connections, once established, are responsible for facilitating all cross-chain verifications of an IBC state. A connection can be associated with any number of channels. Connections encapsulate two `ConnectionEnd` objects on two separate blockchains. Each `ConnectionEnd` is associated with a light client of the other blockchain - for example, the counterparty blockchain. The connection handshake is responsible for verifying that the light clients on each chain are the correct ones for their respective counterparties.
- **Channels** \- [ICS-4(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/core/ics-004-channel-and-packet-semantics): a module on one blockchain can communicate with other modules on other blockchains by sending, receiving, and acknowledging packets through channels that are uniquely identified by the (`channelID`, `portID`) tuple. Channels encapsulate two `ChannelEnd` s that are associated with a connection. Channels provide a way to have different types of information relayed between chains, but do not increase the total capacity. Just like connections, channels are established with a handshake.

A channel can be `ORDERED`, where packets from a sending module must be processed by the receiving module in the order they were sent, or `UNORDERED`, where packets from a sending module are processed in the order they arrive (which might be different from the order they were sent).

- **Ports** \- [ICS-5(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/core/ics-005-port-allocation): an IBC module can bind to any number of ports. Each port must be identified by a unique `portID`. The `portID` denotes the type of application, for example in fungible token transfers the `portID` is `transfer`.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

While this background information is useful, IBC has been designed in such a way that exposure to the transport layer is kept to a minimum for IBC application developers.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

In the following video Colin Axnér of the Interchain Foundation, a core contributor to ibc-go in the Cosmos SDK, explains how different blockchains can be connected with the Inter-Blockchain Communication (IBC) protocol, with a particular focus on light clients, connections, channels, and packet commitments.

How IBC Works, Part 1 - YouTube

Interchain

3.98K subscribers

[How IBC Works, Part 1](https://www.youtube.com/watch?v=zUVPkEzGJzA)

Interchain

Search

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

Watch later

Share

Copy link

Watch on

0:00

/ •Live

[Watch on YouTube](https://www.youtube.com/watch?v=zUVPkEzGJzA "Watch on YouTube")

### [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#ibc-app-application-layer) IBC/APP - Application Layer

The ICS also offer definitions for IBC applications:

- **Fungible token transfer** \- [ICS-20(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/app/ics-020-fungible-token-transfer): The first and most apparent application for IBC is the transfer of fungible tokens across chains. With the standards set out by ICS-20, a user can send tokens across IBC-enabled chains. This is achieved by escrowing tokens on the source chain: the proof along with the token metadata is relayed to the destination chain, upon which the proof is verified by the light client of the source chain, stored on the destination chain. If the verification passes, vouchers for the tokens on the destination chains are minted and an acknowledgement is sent back to the source chain.

Packet flow is explored in more detail in a later section, but you can look at the steps when following the progress of the IBC token transfer on [Mintscan(opens new window)](https://www.mintscan.io/cosmos). The following example shows the transactions submitted for the original `Transfer` on the source, the `Receive` message on the destination, and the `Acknowledgement` again on the source:

![](https://tutorials.cosmos.network/resized-images/1200/academy/3-ibc/images/mintscanIBC.png)

- **Interchain accounts** \- [ICS-27(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/app/ics-027-interchain-accounts): interchain accounts outlines a cross-chain account management protocol built on IBC. Chains having enabled ICS-27 can programmatically create accounts on other ICS-27-enabled chains and control these accounts via IBC transactions, instead of having to sign with a private key. Interchain accounts contain all of the capabilities of a normal account (i.e. stake, send, vote) but instead are managed by a separate chain via IBC in a way such that the owner account on the controller chain retains full control over any interchain accounts it registers on host chains.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

This list can be and will be extended with time. New concepts such as interchain accounts will continue to increase adoption and provide application diversity in the interchain ecosystem.

Find a list of ecosystem efforts on IBC applications and light clients in the ibc-go repo's [readme(opens new window)](https://github.com/cosmos/ibc-go#ecosystem) or the [ibc-apps repo(opens new window)](https://github.com/cosmos/ibc-apps).

## [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#security) Security

Along with protocol extensibility, reliability, and security without the need for trusted third parties, the permissionless nature of IBC as a generalized interoperability standard is one of the most valuable discerning features of IBC in comparison to standard bridge protocols. However, as it is permissionless to create IBC clients, connections, and channels, or to relay packets between chains, you may have wondered: _What about the security implications?_

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

The design of IBC security is centered around **two main principles**:

- Trust in (the consensus of) the chains you connect with.
- The implementation of fault isolation mechanisms, in order to limit any damage done should these chains be subject to malicious behavior.

The security considerations which IBC implements are worth exploring:

### [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#ibc-light-clients) IBC light Clients

Unlike many trusted bridge solutions, IBC does not depend on an intermediary to verify the validity of cross-chain transactions. As explained previously, the verification of packet commitment proofs are provided by the light client. The light client is able to track and efficiently verify the relevant state of the counterparty blockchain, to check commitment proofs for the sending and receiving of packets on the source and destination chains respectively.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

In IBC, blockchains do not directly pass messages to each other over the network. To communicate, blockchains commit the state to a precisely defined path reserved for a specific message type and a specific counterparty. Relayers monitor for updates on these paths and relay messages by submitting the data stored under the path along with proof of that data to the counterparty chain.

![](https://tutorials.cosmos.network/hi-coffee-icon.svg)

The paths that all IBC implementations must support for committing IBC messages are defined in the [ICS-24 host state machine requirements(opens new window)](https://github.com/cosmos/ibc/tree/master/spec/core/ics-024-host-requirements).

This is important because it ensures the IBC protocol remains secure even in Byzantine environments where relayers could act in a malicious or faulty manner. You do not need to trust the relayers; instead, you trust the proof verification provided by the light client. **In the worst case situation where all relayers are acting in a Byzantine fashion, the packets sent would get rejected because they do not have the correct proof. This would affect only the liveness, not the security, of the particular part of the interchain network where the relayers are malicious.**

Note that this effect would only affect the network if all relayers were Byzantine. As relaying is permissionless, a simple fix would be to spin up a non-malicious relayer to relay packets with the correct proof. This fits the _security over liveness_ philosophy that IBC and the wider interchain ecosystem adopts.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

In the following video Colin Axnér of the Interchain Foundation, a core contributor to ibc-go in the Cosmos SDK, looks at the IBC packet lifecycle and the security properties of a light client.

How IBC Works: Packet Verification & Light Client Security - YouTube

Interchain

3.98K subscribers

[How IBC Works: Packet Verification & Light Client Security](https://www.youtube.com/watch?v=X5mPQrCLLWE)

Interchain

Search

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

Watch later

Share

Copy link

Watch on

0:00

/ •Live

[Watch on YouTube](https://www.youtube.com/watch?v=X5mPQrCLLWE "Watch on YouTube")

### [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#trust-the-chains-not-the-bridge) Trust the Chains, not the Bridge

IBC clients and transactions assume the trust model of the chains they are connected to. In order to represent this accurately in assets which have been passed through the interchain, the information of the path that an asset has traveled (the security guarantee of the asset) is stored in the denomination of the asset itself. In the case that the end user or an application does not trust a specific origin chain, they would be able to verify that their asset has not come from the untrusted chain simply by looking at the denomination of the asset, rather than referring to the validator set of a bridge or some other trusted third party verifier.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

All tokens transferred over a particular channel will be assigned the same denomination as other tokens flowing over the channel, but a different one than the same assets between the same chains would have if they were sent across a different channel. The IBC denom looks like `ibc/<hash of the channel-id & port-id>`.

You can find more detailed information in the tutorial on [IBC denoms](https://tutorials.cosmos.network/tutorials/6-ibc-dev/).

### [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#submit-misbehavior) Submit Misbehavior

One type of Byzantine behavior that can happen on an IBC-enabled chain is when validators double-sign a block - meaning they sign two different blocks at the same height. This scenario is called a fork. Unlike in Proof-of-Work blockchains (like Bitcoin or Ethereum) where forks are to be occasionally expected, in CometBFT the fast finality of chains is desired (and is a prerequisite for IBC) so forks should not occur.

Through the principle of [fork accountability(opens new window)](https://github.com/cosmos/cosmos/blob/master/WHITEPAPER.md#fork-accountability) the processes that caused the consensus to fail can be identified and punished according to the rules of the protocol. However, if this were to happen on a foreign chain, it would start a race for the light client of this compromised chain on counterparty chains to become aware of the fork.

The IBC protocol provides the functionality to submit a proof of misbehavior, which could be provided by the relayers, upon which the light client is frozen to avoid consequences as a result of the fork. The funds could later be recovered by unfreezing the light client via a governance proposal when the attack has been neutralized. The _submit misbehavior_ functionality thus enables relayers to enhance the security of IBC, even though the relayers themselves are intrinsically untrusted.

### [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#dynamic-capabilities) Dynamic Capabilities

IBC is intended to work in execution environments where modules do not necessarily trust each other. Thus, IBC must authenticate module actions on ports and channels so that only modules with the appropriate permissions can use them. This module authentication is accomplished using a dynamic capability store. Upon binding to a port or creating a channel for a module, IBC returns a dynamic capability that the module must claim in order to use that port or channel. The dynamic capability module prevents other modules from using that port or channel since they do not own the appropriate capability.

It is worth mentioning that on top of the particular security considerations IBC takes, the security considerations of the Cosmos SDK and the application-specific chain model of the Cosmos white paper still hold. With reference to previous sections, remember that while iteration on the modules may be slower than iteration on contracts, application-specific chains are exposed to significantly fewer attack vectors than smart contract setups deployed on-chain. The chains would have to purposely adopt a malicious module by governance.

## [\#](https://tutorials.cosmos.network/academy/3-ibc/1-what-is-ibc.html#development-roadmap) Development Roadmap

As previously mentioned, even though IBC originated from the Interchain Stack it allows for chains not built with the Cosmos SDK to adopt IBC, or even those with a different consensus than CometBFT altogether. However, depending on which chain you want to implement IBC for or build IBC applications on top of, it may require prior development to ensure that all the different components needed for IBC to work are available for the consensus type and blockchain framework of your choice.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

Generally speaking, you will need the following:

1. An implementation of the IBC transport layer.
2. A light client implementation on your chain, to track the counterparty chain you want to connect to.
3. A light client implementation for your consensus type, to be encorporated on the counterparty chain you want to connect to.

Click the expansion panel below to have a more detailed look at the different options.

A roadmap towards an IBC-enabled chain

The following decision tree helps visualize the roadmap towards an IBC-enabled chain. **For simplicity, it assumes the intent to connect to a Cosmos SDK chain.**

Do you have access to an existing chain?

- **No.** You will have to build a chain:
  - Cosmos SDK chain: see the [previous chapters](https://tutorials.cosmos.network/hands-on-exercise/1-ignite-cli/).
  - Another chain.
    - Is there a CometBFT light client implementation available for your chain?
      - Yes. Continue.
      - No. Build a custom CometBFT light client implementation.
    - Is there a light client implementation for your chain's consensus available in the SDK's IBC module?
      - Yes. Continue.
      - No. Build a custom light client for your consensus to be used on a Cosmos SDK chain (with IBC module).
    - Implement IBC core:
      - Source code.
      - Smart contract based.
- **Yes.** Is it a Cosmos SDK chain?
  - Yes. Move on to application development.
  - No.
    - Does your chain support a CometBFT light client?
      - Yes. Continue.
      - No. Source a CometBFT light client implementation for your chain.
    - Is there a Cosmos SDK light client implementation for your chain's consensus?
      - Yes. Continue.
      - No. Build a custom light client implementation of your chain's consensus + governance proposal to implement it on the IBC clients of the Cosmos SDK chains you want to connect to.
    - Does your chain have a core IBC module available (connection, channels, ports)? Source code or smart contract based?
      - Yes. Move on to application development.
      - No. Build IBC Core implementation (source code or smart contract).

The most straightforward way to use IBC is to build a chain with the Cosmos SDK, which already includes the IBC module - as you can see when examining the [ibc-go repository(opens new window)](https://github.com/cosmos/ibc-go). The IBC module supports an out-of-the-box CometBFT light client. Other implementations are possible but may require further development of the necessary components; go to the [IBC website(opens new window)](https://www.ibcprotocol.dev/blog/getting-started-with-ibc-understanding-the-interchain-stack-and-the-main-ibc-implementations) to see which implementations are available in production or are being developed.

![](https://tutorials.cosmos.network/hi-info-icon.svg)

If you're interested in a detailed introduction to Inter-Blockchain Communication, check out the following video Thomas Dekeyser, Developer Relations Engineer for IBC.

Interchain Developer Academy \| Introduction to IBC, Thomas Dekeyser \| 3rd of October 2022 - YouTube

Interchain

3.98K subscribers

[Interchain Developer Academy \| Introduction to IBC, Thomas Dekeyser \| 3rd of October 2022](https://www.youtube.com/watch?v=HCO7qTOdNGI)

Interchain

Search

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

Watch later

Share

Copy link

Watch on

0:00

/ •Live

[Watch on YouTube](https://www.youtube.com/watch?v=HCO7qTOdNGI "Watch on YouTube")

synopsis

To summarize, this section has explored:

- How the Inter-Blockchain Communication Protocol (IBC) solves the problem of cross-chain communication by handling the authentication and transport of data between two blockchains through a minimal set of functions specified in the interchain standards (ICS).
- How the IBC functions permissionlessly and can be used with a wide range of blockchains or state machines regardless of their network topologies or consensus algorithms, with IBC security reduced to that of the participating chains.
- How IBC is the foundation of interoperability in the interchain ecosystem, with relayers such as light clients verifying the validity of cross-chain transactions, while also offering solutions to the issue of communicating with non-Cosmos blockchains including those which do not meet the criteria of Proof-of-Stake (PoS)finality.
- How a Cosmos blockchain's transport layer (TAO) provides the infrastructure for establishing secure connections to other chains, while the application layer built on top defines how authenticated data packets should be packaged and interpreted.
- How relayer algorithms provide the essential off-chain processes that share data between chains running the IBC protocol by scanning the state of each chain, constructing appropriate datagrams, and executing them on the opposite chain as permitted by the protocol.
- How the Byzantine behavior that leads to forking is prevented within the fast finality interchain ecosystem, and how the IBC protocol can achieve fork prevention outside the ecosystem by submitting proof of validator misbehavior and freezing affected light clients until an issue or attack has been neutralized.

previous

[**Chapter Overview - The Inter-Blockchain Communication Protocol**](https://tutorials.cosmos.network/academy/3-ibc/)

up next

[**IBC/TAO - Connections**](https://tutorials.cosmos.network/academy/3-ibc/2-connections.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

### Get Cosmos Updates

Unsubscribe at any time. [Privacy Policy](https://v1.cosmos.network/privacy)

Next

Documentation

[Cosmos SDK](https://docs.cosmos.network/) [Cosmos Hub](https://hub.cosmos.network/) [CometBFT](https://docs.cometbft.com/) [IBC Protocol](https://ibc.cosmos.network/)

Community

[Interchain blog](https://blog.cosmos.network/) [Forum](https://forum.cosmos.network/) [Discord](https://discord.gg/cosmosnetwork)

Contributing

[Source code on GitHub](https://github.com/cosmos/sdk-tutorials)

[Developer Portal](https://tutorials.cosmos.network/)

[medium](https://blog.cosmos.network/ "medium")[twitter](https://twitter.com/cosmos "twitter")[discord](https://discord.gg/cosmosnetwork "discord")[linkedin](https://www.linkedin.com/company/interchain-foundation/about/ "linkedin")[reddit](https://reddit.com/r/cosmosnetwork "reddit")[telegram](https://t.me/cosmosproject "telegram")[youtube](https://www.youtube.com/c/CosmosProject "youtube")

Dark mode

† This website is maintained by the Interchain Foundation (ICF). The contents and opinions of this website are those of the ICF. The ICF provides links to cryptocurrency exchanges as a service to the public. The ICF does not warrant that the information provided by these websites is correct, complete, and up-to-date. The ICF is not responsible for their content and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites.

Cosmos is a registered trademark of the [Interchain Foundation.](https://interchain.io/) [Privacy](https://v1.cosmos.network/privacy)
