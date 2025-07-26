---
tags:
  - "#blockchain"
  - "#security"
  - "#cryptographic-security"
  - "#distributed-systems"
  - "#key-management"
  - "#hardware-security"
  - "#validator-operations"
  - "#consensus"
  - "#distributed-systems-design"
  - "#capability-security"
  - "#documentation"
---
# Prepare and Connect to Other Nodes

With the genesis created and received, a node operator needs to join the eventual network. In practice this means two things:

1. To open your node to connections from other nodes.
2. To know where the other nodes are, or at least a subset of them, so that your node can attempt to connect to them.

In this section, you concern yourself with CometBFT and the peer-to-peer network. Other niceties like incorporating gRPC and REST into your Cosmos application are different concerns.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/5-network.html#set-up) Set up

As a node operator, from the time of genesis or at any time in the future, and on each machine, you first run an `init` command to at least set up the folders and pick an ASCII-only moniker:

Copy $./myprojectd init stone-age-1

Overwrite the genesis created with the actual agreed one. While you are doing so, you can make it read-only:

Copy $ curl <http://example.com/genesis.json> -o ~/.myprojectd/config/genesis.json $ chmod a-wx ~/.myprojectd/config/genesis.json

The `init` command has also created a number of configuration files:

Copy $ ls ~/.myprojectd/config

This should return:

Copy addrbook.json app.toml <-- configuration for the app part of your blockchain client.toml <-- configuration for the CLI client of the app config.toml <-- configuration for Tendermint genesis.json <-- the genesis for your blockchain gentx <-- folder that contains the genesis transactions before they are inserted node_key.json <-- private key that uniquely identifies your node on the network priv_validator_key.json

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/5-network.html#open-your-node) Open Your Node

In the [`config.toml` file (opens new window)](https://docs.tendermint.com/v0.34/tendermint-core/using-tendermint.html#configuration) you can configure the open ports. The important piece is your **listen address**:

Copy \[p2p\] # Address to listen for incoming connections laddr = "tcp://0.0.0.0:26656"

Here it listens on port `26656` of all IP addresses. Define or find out your publicly accessible IP address, for instance `172.217.22.14`. If you use a DNS-resolvable name, like `lascaux.myproject.example.com`, you can use that as well instead of the IP address.

Keep in mind that a name is subject to the DNS being well configured and working well. Add this too so that, whenever your node contacts a new node, yours can tell the other node which address is preferred:

Copy external_address = "172.217.22.14:26656" # replace by your own

The other piece of information that uniquely identifies your node is your **node ID**. Its private key is stored in `~/.myprojectd/config/node_key.json`. The public ID is that by which your peers will know your node. You can compute the public ID with the CometBFT command:

Copy $./myprojectd tendermint show-node-id

This should return something like:

Copy ce1c54ea7a2c50b4b9f2f869faf8fa4d1a1cf43a

If you lose `node_key.json` or have it stolen, it is not as serious as if you lost your token's private key. Your node can always recreate a new one and let your peers know about the new ID, with no problems. The file location is mentioned in `config.toml` on the line `node_key_file = "config/node_key.json"`.

The node key also exists so that your own node can identify itself, in the event that it tried to connect to itself via a circuitous peer-to-peer route and therefore ought to cut the useless connection.

In short, here is the information you need to share with other early participants in the network:

- Listen address, for instance: `"tcp://172.217.22.14:26656"`.
- Node ID, for instance: `ce1c54ea7a2c50b4b9f2f869faf8fa4d1a1cf43a`.

The shorthand for this information is written and exchanged in the format _node-id@listen-address_, like this:

Copy ce1c54ea7a2c50b4b9f2f869faf8fa4d1a1cf43a@172.217.22.14:26656

If you create a node for a network that is already running you need to follow these same steps, but you do not need to inform others of your parameters, because when you connect your node will do this anyway.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

As a side note, your computer or local network may not allow other nodes to initiate a connection to your node on port `26656`. Therefore, it is a good idea to open this port in the firewall(s).

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/5-network.html#connection-to-others) Connection to Others

You have collected your node's information, and have shared it with the early network participants. In return you received theirs. You can put this information in `config.toml`, separated by commas:

Copy persistent_peers = "432d816d0a1648c5bc3f060bd28dea6ff13cb413@216.58.206.174:26656, 5735836cbaa747e013e47b11839db2c2990b918a@121.37.49.12:26656"

If one of the operators informs you that their node behaves as a seed node, then you add it under:

Copy seeds = "432d816d0a1648c5bc3f060bd28dea6ff13cb413@216.58.206.174:26656"

You can also take this opportunity to document the list of peers on your _production_ repository (the same that hosts the genesis file). Only list the addresses that are meant to be public, to mitigate the risks of DoS attacks.

![](https://tutorials.cosmos.network/hi-note-icon.svg)

You are not obliged to put all the known peers in your `persistent_peers`. You may well choose to put there only those you trust.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/5-network.html#further-network-configuration) Further Network Configuration

Setting up your node and identifying other peers is important. However, this is not the only network configuration available. Look into `~/.myprojectd/config/config.toml` for tweaks.

If you change the parameters in this file, you are not going to affect the ability of the network to reach consensus on blocks. Parameters that are necessary for consensus are all in the genesis file.

[Parameters in `config.toml` (opens new window)](https://docs.tendermint.com/v0.34/tendermint-core/configuration.html) can be divided into two broad categories:

1. **Network scoped:** by changing these, you change the posture of your node at the risk of disrupting the ability of other nodes to communicate with yours. Examples include `max_num_inbound_peers` and `handshake_timeout`.
2. **Single node scoped:** these only matter to your node. Examples include `db_backend` and `log_level`.

Among the network-scoped parameters, some deal with the intricacies of BFT, such as `timeout_prevote` and `timeout_precommit_delta`. If you want to tweak them away from their defaults, you can search for more information. [Here (opens new window)](https://forum.cosmos.network/t/consensus-timeouts-explained/1421) is as good a place to start as any other.

Tangential to these parameters, you can find others in `~/.myprojectd/config/app.toml` that also relate to the network. For instance `minimum-gas-prices`, which you could set at `1nstone` for instance.

To avoid surprises when looking at the configuration, keep in mind your CometBFT version:

Copy $./myprojectd tendermint version

This returns something like:

Copy ABCI: 0.17.0 BlockProtocol: 11 P2PProtocol: 8 Tendermint: v0.34.20-rc1 <-- The part that should inform you about the content of config.toml

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/5-network.html#ddos) DDoS

Being part of a network with a known IP address can be a security or service risk. Distributed denial-of-service (DDoS) is a classic kind of network attack, but there are ways to mitigate the risks.

First, be aware that regular nodes and validator nodes face different risks:

1. If your regular node is DoS'd, you are at risk of dropping out of the network, and preventing you or your customers from calling an RPC endpoint for network activity.
2. If your validator node is DoS'd, you are at risk of consensus penalties.

It is common practice to expose your regular nodes and to hide your validator nodes. The latter hide behind a [_sentry_ node (opens new window)](https://hub.cosmos.network/main/validators/security.html#sentry-nodes-ddos-protection), such that:

1. Your [sentry nodes (opens new window)](https://forum.cosmos.network/t/sentry-node-architecture-overview/454) are located in a cloud infrastructure, where the database (or filesystem) and the software part of the node are separated. With this, the same sentry node can release its old public IP address and receive a new one within a few seconds; or a new sentry node can spring up at a different IP address by using the same database (or filesystem), as in a game of whack-a-mole.
2. Your validator nodes are located anywhere, with persistent addresses, but connect only to the sentry nodes, with the use of `persistent_peers` in `config.toml`. The content of this field has to change when a sentry node has been whacked unless the validator node can connect to the sentry node over the same private IP address.
3. Your sentry nodes never gossip your validators' addresses over the peer-to-peer network, thanks to the use of `private_peer_ids` in `config.toml`.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

If you would like to see how to apply what you've learned, you can go straight to the exercise in [Simulate production in Docker](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html) to start from scratch.

More specifically, you can jump to:

- [Network preparation](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html#network-preparation), to see how to prepare nodes to know about each other, and to keep some things private.
- [Networks they run in](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html#the-networks-they-run-in), to see how the network topology is prepared.

synopsis

To summarize, this section has explored:

- How to make your node accessible to connections from other nodes.
- How to locate some subset of other nodes in order to make a connection to them.
- The use of a publicly accessible IP address or DNS-resolvable name, along with the public half of your public-private node key, to uniquely identify your node to others.
- How the node key can also prevent inadvertent attempts by the node to connect to itself via an unforeseen peer-to-peer route.
- The option of further configuring your network via **network scoped** and **single node scoped** parameters.
- How to mitigate the risks of distributed denial-of-service (DDoS) attacks through the use of sentry nodes.

---

# Escrow-checker

A tool for verifying that escrow accounts, associated with channels in [IBC](https://github.com/cosmos/ibc-go), have balances that are equal to the total supply of the assets on a counterparty chain.

## Build & Run

Clone the repo, navigate to the root directory, compile, and run the binary.

$ git clone <https://github.com/strangelove-ventures/escrow-checker.git><br/>
$ cd escrow-checker<br/>
$ go build<br/>
$./escrow-check

## Configuration

In `main.go` there are a few variables that can be used to change the program's configuration. You will need to re-compile the program after changing these values.

- `configPath`: the location of the config file
- `targetChainID`: chain ID of the chain whose escrow accounts you want to validate
- `maxWorkers`: maximum number of goroutines that will run concurrently while querying escrow account info
- `targetChannels`: channel IDs associated with escrow accounts you want to validate, empty slice to check all escrow accounts

Some basic information is required to query each chain for information about the escrow accounts and total supply of tokens. In `config/config.yaml` you will need to add an entry for your target chain as well as every counterparty chain you want to query.

**Example:**

```yml
- name: osmosis
  chain-id: osmosis-1
  account-prefix: osmo
  rpc-address: <https://osmosis-rpc.onivalidator.com:443>
  timeout: 30s
```

---

# Multisig Wallets

If you are launching a token or have a treasury to manage, and you would like to use multi-signature wallets to handle the tokens, you can do so in several ways. This is an overview of currently available tooling to manage your Cosmos SDK multisig wallets you are launching a token or have a treasury to manage, and you would like to use multi-signature wallets to handle the tokens, you can do so in several ways. This is an overview of currently available tooling to manage your Cosmos SDK multisig wallets.

## 1. Using Cosmos Native Multisig Wallets

Cosmos has built-in multi-signature wallets by default. Although the UX isn't great, it's tried and tested and has been used by numerous projects (ICF, Osmosis Foundation, etc) for several years.

One member of the multisig creates the wallet, which is derived from the public keys of all multisig members. Transactions are then created and signed off-chain, after which the fully signed TX is submitted and broadcasted to the chain. Once a multisig wallet has been created, **members cannot be updated**. In order to change membership, a new wallet has to be created and funds have to be transferred.

### Command Line Interface

Using CLI, this process is a bit burdensome because the signed transaction's JSON file needs to be passed around and manually shared with members. Full instructions can be found on the [Cosmos Hub docs](https://hub.cosmos.network/main/hub-tutorials/gaiad.html#multisig-transactions). Just replace the `gaiad` binary with the chain you're managing the funds on.

## Web Interface

There has been some work done on a general purpose Interchain user interface to manage multisig wallets. The tool is live [here](https://cosmos-multisig-ui-kohl.vercel.app/). The web interface fetches chain data and public RPC endpoints using the [chain registry](https://github.com/cosmos/chain-registry/). Some of these RPC endpoints might not be available, in which case you'd need to manually input them in the config settings.

This tool allows you to create wallets and send or delegate tokens. The signed transactions are stored in a database so you don't need to send over any files to members, just the transaction URL. Transactions can be signed using Keplr. The [GitHub repository](https://github.com/cosmos/cosmos-multisig-ui) also contains a branch with a feature to create vesting accounts, but the work has been discontinued.

Osmosis forked this work [here](https://github.com/osmosis-labs/osmosis-legacy-multisig) before it became multi-chain. They included the option to manually input a JSON file to sign any arbitrary transaction. Their tool is live [here](https://osmosis-legacy-multisig.vercel.app/).

## CLI Multisig Manager

Informal Systems has developed a multi-chain multisig manager that allows you to create and manage multiple transactions which are stored in an S3 bucket. The repo is available [here](https://github.com/informalsystems/multisig).

## 2. Using the Cosmos SDK's Group Module

The Group module is a relatively new feature built-in as a native Cosmos SDK module. Instead of transactions that need to be signed, members create proposals to execute transactions that need to be voted on, similar to how the Cosmos governance module works. The key advantage to the previous multisig method is the fact that all interactions happen on-chain, so there is no need for manually signing and transferring JSON files over to members, plus the status of a transaction is publicly available.

Additional relevant features:

- Dynamic membership & member weights
- On-chain proposal creation & voting
- Multiple token pools governed by various voting mechanisms, under one group

There is currently no web interface available, although Regen Network is currently developing one. There is a full tutorial on the [Developer Portal](https://tutorials.cosmos.network/tutorials/8-understand-sdk-modules/3-group.html). The source code is available [here](https://github.com/cosmos/cosmos-sdk/tree/main/x/group), and the specifications are [here](https://docs.cosmos.network/main/modules/group).

**Please note this module has not been audited at this point.** The module was released in SDK v0.46 late 2022 and has _not_ seen much usage in the wild yet.

## 3. DAODAO

DAODAO is an open-source DAO tool written in CosmWasm that currently has a live implementation on Juno. This is a highly versatile web interface that allows you to create and manage multi-signature wallets, as well as token or NFT-based DAOs. This is a very user friendly way to manage funds, but in order to use it you either have to move your tokens to Juno or run the platform on your own CosmWasm enabled chain.

- [DAODAO on Juno](https://daodao.zone/)
- [GitHub](https://github.com/DA0-DA0)
- [Documentation](https://docs.daodao.zone/)

---

# [Prepare a Validator and Keys](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html)

In the [previous section](https://tutorials.cosmos.network/tutorials/9-path-to-prod/2-software.html), you prepared a binary for your nodes. Some of your nodes will be validators. To propose and sign blocks, validators need ongoing access to important private keys. A regular node does not need such important keys.

Here you learn how to prepare a validator and handle its keys. This works whether you are preparing a validator to join a preexisting network, or you are setting up your validator to be part of the [genesis](https://tutorials.cosmos.network/tutorials/9-path-to-prod/4-genesis.html).

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#private-key-security-considerations) Private Key Security Considerations

More precisely than needing ongoing access to private keys, validators only need the capability to sign blocks on an ongoing basis. There is a security difference between access to the private key and access to a signing facility:

1. When your validator has access to the private key, if your validator node has been compromised then your private key is too, and you are at the risk of wrongfully signing malicious blocks **forever**.
2. On the other hand, when you only provide a signing _service_ to your validator, if your validator node has been compromised then you are _only_ at the risk of wrongfully signing malicious blocks **for as long as the signing service is up**.

In order to mitigate the danger of **point 1**, you can keep your private key in a [hardware security module (opens new window)](https://hub.cosmos.network/main/validators/validator-faq.html#how-to-handle-key-management) (a.k.a. HSM), from which it can be retrieved only once, during the HSM's offline setup. This HSM device then remains plugged into the computer that runs the validator or the signing service. See [here (opens new window)](https://hub.cosmos.network/main/validators/security.html#key-management-hsm) for the current list of supported devices. To use an HSM you own, you need physical access to the computer into which you plug it.

To implement **point 2**, you can use a specialized [key management system (opens new window)](https://hub.cosmos.network/main/validators/kms/kms.html) (KMS). This runs on a computer separate from your validator node but has access to the hardware key and [contacts your validator node(s) over the private network (opens new window)](https://github.com/iqlusioninc/tmkms/blob/v0.12.2/README.txsigner.md#architecture) (or is contacted by your validator node(s)) for the purpose of signing blocks. Such a KMS is specialized in the sense that it is, for instance, able to detect attempts to sign two different blocks at the same height.

You can combine these strategies. For instance, if you insist on using an HSM and having your validator node located in the cloud, you can run the KMS on the computer the HSM is physically plugged into, which dials into your remote validator node to provide the signing service.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#what-validator-keys) What Validator Keys

A validator handles [two (opens new window)](https://hub.cosmos.network/main/validators/validator-faq.html#what-are-the-different-types-of-keys), perhaps three, different keys. Each has a different purpose:

1. The **Tendermint consensus key** is used to sign blocks on an ongoing basis. It is of the key type `ed25519`, which the KMS can keep. When Bech-encoded, the address is prefixed with `cosmosvalcons` and the public key is prefixed with `cosmosvalconspub`.
2. The **validator operator application key** is used to create transactions that create or modify validator parameters. It is of type `secp256k1`, or whichever type the application supports. When Bech-encoded, the address is prefixed with `cosmosvaloper`.
3. The [**delegator application key** (opens new window)](https://hub.cosmos.network/main/validators/validator-faq.html#are-validators-required-to-self-delegate-atom) is used to handle the stake that gives the validator more weight. When Bech-encoded, the address is prefixed with `cosmos` and the public key is prefixed with `cosmospub`.

Most likely keys 2 and 3 [are the same (opens new window)](https://github.com/cosmos/cosmos-sdk/blob/v0.46.1/proto/cosmos/staking/v1beta1/tx.proto#L45-L47) when you are a node operator.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#hot-and-cold-keys) Hot and Cold Keys

To touch on a point of vocabulary, the Tendermint consensus key can be considered **hot**, in that it can and must produce valid signatures at any time. Even when safely housed in an HSM, this key is considered hot because it is usable immediately by your computers. This is a higher security risk compared to **cold** keys, which are kept out of a networked computer altogether, or at least require human approval before being accessed (like an HSM device stored in your desk drawer).

Your validator operator and potential delegator keys should be **cold**.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#workflow-security-considerations) Workflow Security Considerations

Besides private key security, your validator should work as intended in a world where computers crash and networks get congested. Failing to address these eventualities could cost a portion of the stakes of you and your delegators. How much depends on certain [configured genesis parameters (opens new window)](https://docs.cosmos.network/v0.46/modules/slashing/08_params.html) of the network.

There are two main honest-mistake pitfalls:

1. Your validator fails in signing or proposing blocks. This can happen if:
   - Your computer is offline for too long.
   - Your computer does not receive updates in time.
2. Your validator wrongfully signs two valid blocks of the same height. This can happen if:
   - You have a misconfigured failover validator.
   - You have two computers using the same key.

To address **point 1**, this sounds like an issue about keeping your computer running and your networks in good shape. There is an added difficulty, though. Because your validator participates in a public network, its address can be [discovered and attacked (opens new window)](https://hub.cosmos.network/main/validators/validator-faq.html#how-can-validators-protect-themselves-from-denial-of-service-attacks). To mitigate this risk, you can for instance use a [sentry node architecture](https://tutorials.cosmos.network/tutorials/9-path-to-prod/5-network.html#ddos) so your validator node is only accessible through private networks, and a number of regular public-facing nodes connect to the network at large and your validator over the private network. These sentry nodes can be placed on the cloud and only relay over the gossip network. You can safely shut them down (not all of them, of course) or start up more. Your sentries should not disclose your validator's address to the P2P network. As an additional feature, if you absolutely trust a few other nodes, you can have your node connect to those directly over a private network.

To address **point 2**, this is where your use of the specialized KMS application that sits between your validator and your HSM can help. This application handles strictly one process at a time and stores the latest signed blocks so that it can detect any attempt at double-signing.

Without such a KMS, you must ensure that only one of your computers signs blocks at a time. In particular, be wary if you adopt an aggressive computer restart policy.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#key-generation) Key Generation

Now, take a closer look at generating keys, a consensus and an app key.

### [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#consensus-key) Consensus Key

When you run the standard `simd init` command, it creates a default Tendermint consensus key on disk at path [`~/.simapp/config/priv_validator_key.json` (opens new window)](https://docs.cosmos.network/main/run-node/run-node.html#initialize-the-chain). This is convenient if you are starting a testnet, for which the security requirements are low. However, for a more valuable network, you should delete this file to avoid using it by mistake, or [import it (opens new window)](https://github.com/iqlusioninc/tmkms/blob/v0.12.2/README.txsigner.md#architecture) into the KMS and then delete it if that is your choice.

To use CometBFT's KMS follow the instructions [here (opens new window)](https://hub.cosmos.network/main/validators/kms/kms.html), or how it is applied in the [checkers hands-on exercise](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html). When it is installed, configured, and running, you can ask it for its public key, which will be useful at the genesis stage. It has to be Protobuf JSON encoded, for instance:

Copy {"@type":"/cosmos.crypto.ed25519.PubKey","key":"byefX/uKpgTsyrcAZKrmYYoFiXG0tmTOOaJFziO3D+E="}

Note the `@` in `"@type"`.

### [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#app-key) App Key

For this key, you can follow standard procedures for cold keys on your computer, in the model of `simd keys …`.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/3-keys.html#advertise) Advertise

With your keys set up, you want to eventually cover your validator costs, if not run a profitable business. Part of the equation is to have third-party token holders delegate to your validator so you can collect a commission from their share of the rewards. Also, given that only a limited number of validators can be in the validating pool, you have to increase the amount delegated to your validator in order to gain entry to said pool.

You want to make sure potential delegators can find your validator operator application key, and present your service in an attractive manner. It is highly specific to your chain and can be in dedicated Web 2.0 forums or purpose-built indexed websites.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

If you would like to see how to apply what you've learned, you can go straight to the exercise in [Simulate production in Docker](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html) to start from scratch.

More specifically, you can jump to:

- [Keys](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html#keys), to see how to handle validator **operator** keys.
- [Prepare the KMS](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html#prepare-the-kms), to see how to handle validator **consensus** keys.

synopsis

To summarize, this section has explored:

- How to prepare keys for a validator, which needs to be able to sign blocks on an ongoing basis, and handle the validator's keys.
- How to use a signing service so that the validator is able to perform its duties with the minimum risk of persistent or permanent compromise.
- The benefits of using a hardware security module (HSM) to prevent a private key from being duplicated by a malicious actor.
- The benefits of using a key management system (KMS) over a private network to create distance between the validator node and the keys used in validation.
- The three types of keys involved: the Tendermint consensus key, the validator operator application key, and the delegator application key.
- The difference between "hot" and "cold" keys.
- The importance of addressing the potentially negative eventualities of practical networking.

---

# [Configure, Run, and Set Up a Service](https://tutorials.cosmos.network/tutorials/9-path-to-prod/6-run.html)

You have prepared your machine to be part of the upcoming network. Now it is time to:

1. Configure the rest of the software.
2. Start the software and have it establish a peer-to-peer (P2P) network with others.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/6-run.html#configuration) Configuration

Start by putting `myprojectd` into `/usr/local/bin`, or into whichever path you put your executables. Confirm it works with:

Copy $ myprojectd version

In the previous section, you configured some parameters of your node when it comes to CometBFT, in `~/.myprojectd/config/config.toml`.

In `config/app.toml`, you will find other parameters to configure. Take special note of `halt-height` which assists you in gracefully stopping the node, such as when applying a migration.

As for the database(s), classic considerations apply. With the `db_dir` flag, consider storing its files in a dedicated and redundant volume. On Linux, you could mount the `data` folder to that separate drive.

Events are also stored in a database, and here too you can choose to store them separately. Note that events are purely a node concern, not a consensus or network one.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/6-run.html#run-user) Run User

Another standard security concern is that you want to avoid running your application as `root`. So, create a new user and prepare it:

Copy $ sudo adduser chainuser

With this done, move the configuration folder to the home folder of the new user:

Copy $ sudo mv ~/.myprojectd /home/chainuser $ sudo chown -R chainuser:chainuser /home/chainuser/.myprojectd

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/6-run.html#commands) Commands

To finally launch your software, you could simply run:

Copy $./myprojectd start

The larger your genesis file, the longer this step takes. Do not worry if it seems like nothing is happening.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/6-run.html#as-a-service) As a Service

Instead of relaunching your software every time, it is a good idea to set it up as a service. You can use your preferred method, but if you are on Linux it may be with `systemd`. Here is an example of a service file, [modeled on Gaia's (opens new window)](https://hub.cosmos.network/main/hub-tutorials/join-mainnet.html#running-via-background-process), to save in `/etc/systemd/system/myprojectd.service`:

Copy \[Unit\] Description=My Project Chain Daemon After=network-online.target \[Service\] User=chainuser ExecStart=$(which myprojectd) start Restart=always RestartSec=3 LimitNOFILE=4096 \[Install\] WantedBy=multi-user.target

Check the [section on migrations](https://tutorials.cosmos.network/tutorials/9-path-to-prod/7-migration.html) to see how you may add parameters to this file if you want to use Cosmovisor.

Enable it once:

Copy $ sudo systemctl daemon-reload $ sudo systemctl enable myprojectd

Now, if you do not want to try a computer restart, you can start the process immediately with:

Copy $ sudo systemctl start myprojectd

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/6-run.html#when-to-start) When to Start

You have launched your blockchain software, and the other validators have done the same, so when is the first block minted? This happens when validators representing at least [two-thirds (opens new window)](https://hub.cosmos.network/main/resources/genesis.html#genesis-transactions) (67%) of the total staked amount are online.

This means that, although you should coordinate with your peers for a convenient date and time to start, you need not narrow it down to the second. You can collectively agree to all start _on Tuesday_ and it will therefore start safely at some point on Tuesday.

However, this is another reason why, when adding staking transactions in the genesis, you need to be sure about the reliability of the other validators, otherwise your start could be delayed.

## [#](https://tutorials.cosmos.network/tutorials/9-path-to-prod/6-run.html#further-concerns) Further Concerns

Now that you have a running network, you may consider coming back to it and try to:

- Make your life easier with [shell command completion (opens new window)](https://hub.cosmos.network/main/hub-tutorials/gaiad.html#shells-completion-scripts).
- Add a node that [checks invariants (opens new window)](https://hub.cosmos.network/main/hub-tutorials/join-mainnet.html#verify-mainnet).
- Add [telemetry (opens new window)](https://docs.cosmos.network/main/core/telemetry.html) so as to keep an eye on your node(s).
- See what [other projects (opens new window)](https://github.com/cosmos/awesome-cosmos) can benefit you.

This is just an extract of the different customizations that are available to you. For more ideas, peruse [this documentation (opens new window)](https://hub.cosmos.network/main/hub-tutorials/join-mainnet.html).

When your network has been running sufficiently to be considered "established", your next steps are to advertise it and facilitate its eventual integration within the ecosystem. A good way to achieve this is to open a pull request on the [chain registry repository (opens new window)](https://github.com/cosmos/chain-registry) with `chain.json` and `assetlist.json` files that describe your chain in a systematic way. Make sure that your JSON files follow the given schemas, for instance by checking with this [online validator (opens new window)](https://www.jsonschemavalidator.net/).

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

If you would like to see how to apply what you've learned, you can go straight to the exercise in [Simulate production in Docker](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html) to start from scratch.

More specifically, you can jump to:

- [Executables that run](https://tutorials.cosmos.network/hands-on-exercise/4-run-in-prod/1-run-prod-docker.html#the-executables-that-run), to see how to prepare (Docker) nodes to run.

synopsis

To summarize, this section has explored:

- How to configure other software necessary to be part of a network.
- How to start the software and establish a P2P network with other nodes.
- The importance of avoiding running your application as a user (rather than as `root`) for security reasons.
- How to set up your software as a service, to avoid the need to repeatedly relaunch it.
- How to coordinate with your peers regarding when to start your network to ensure timely behaviour.

---

# YubiKey Usage

The [YubiHSM 2] from Yubico is a relatively low-cost solution for online<br/>
key storage featuring support for random key generation, encrypted backup<br/>
and export, and audit logging.

This document describes how to configure a YubiHSM 2 for production use<br/>
with Tendermint KMS.

## Compiling `tmkms` with YubiHSM Support

Please see the [toplevel README.md] for prerequisites for compiling `tmkms`<br/>
from source code. You will need: Rust (stable, 1.40+), a C compiler,<br/>
`pkg-config`, and `libusb` (1.0+) installed.

There are two ways to install `tmkms` with YubiHSM 2 support, and in either<br/>
case, you will need to pass the `--features=yubihsm` parameter to enable<br/>
YubiHSM 2 support:

### Compiling from Source Code (via git)

`tmkms` can be compiled directly from the git repository source code using the<br/>
following method.

```shell
$ git clone https://github.com/iqlusioninc/tmkms.git && cd tmkms
[...]
$ cargo build --release --features=yubihsm
```

If successful, this will produce a `tmkms` executable located at<br/>
`./target/release/tmkms`

### Installing with the `cargo install` Command

With Rust (1.40+) installed, you can install tmkms with the following:

```shell
cargo install tmkms --features=yubihsm
```

Or to install a specific version (recommended):

```shell
cargo install tmkms --features=yubihsm --version=0.4.0
```

This command installs `tmkms` directly from packages hosted on Rust's<br/>
[crates.io] service. Package authenticity is verified via the<br/>
[crates.io index] (itself a git repository) and by SHA-256 digests of<br/>
released artifacts.

However, if newer dependencies are available, it may use newer versions<br/>
besides the ones which are "locked" in the source code repository. We<br/>
cannot verify those dependencies do not contain malicious code. If you would<br/>
like to ensure the dependencies in use are identical to the main repository,<br/>
please build from source code instead.

### Verifying YubiHSM Support Was Included in a Build

Run the following subcommand of the resulting `tmkms` executable to ensure<br/>
that YubiHSM 2 support was compiled-in successfully:

```shell
$ tmkms yubihsm help                                                                           127 ↵
tmkms 0.4.0
Tony Arcieri <tony@iqlusion.io>, Ismail Khoffi <Ismail.Khoffi@gmail.com>
Tendermint Key Management System

USAGE:
  tmkms <SUBCOMMAND>

FLAGS:
  -h, --help     Prints help information
  -V, --version  Prints version information

SUBCOMMANDS:
  detect  detect all YubiHSM2 devices connected via USB
  help    show help for the 'yubihsm' subcommand
  keys    key management subcommands
  setup   initial device setup and configuration
  test    perform a signing test
```

If `detect`, `help`, `keys`, `setup` etc are listed under `SUBCOMMANDS` then<br/>
the build was successfully configured with YubiHSM 2 support.

## Udev Configuration

On Linux, you will need to grant `tmkms` access to the YubiHSM 2 using<br/>
rules for the udev subsystem. Otherwise, you'll get an error like this:

```shell
$ tmkms yubihsm detect
error: couldn't detect USB devices: USB error: USB(bus=1,addr=4):
       error opening device: Access denied (insufficient permissions)
```

You'll need to create a POSIX group, e.g. `yubihsm` which is allowed to<br/>
access the YubiHSM2, and then add the following rules file under the<br/>
`/etc/udev/rules.d` directory, e.g. `/etc/udev/rules.d/10-yubihsm.rules`:

```shell
SUBSYSTEMS=="usb", ATTRS{product}=="YubiHSM", GROUP="yubihsm"
```

Note that creating this file does not have an immediate effect: you'll<br/>
need to reload the udev subsystem, either by rebooting or running the<br/>
following command:

```shell
$ udevadm control --reload-rules && udevadm trigger
```

For the rules above to apply, make sure you run `tmkms` as a user which is a<br/>
member of the `yubihsm` group!

## `yubihsm-server` Feature

The YubiHSM backend includes additional option support for running a local HTTP<br/>
server which is compatible with Yubico's `yubihsm-connector` service. This<br/>
allows administration of YubiHSMs via `yubihsm-shell` or via `tmkms yubihsm`<br/>
while the KMS is running (i.e. communicating with the YubiHSM2 via USB).

To enable support for this feature, enable it when you compile Tendermint KMS,<br/>
either via:

```shell
$ cargo build --release --features=yubihsm-server
```

or if you're using `cargo install`:

```shell
$ cargo install tmkms --features=yubihsm-server
```

To enable the HTTP service, you'll need to add `connector_server` configuration<br/>
to the `[[providers.yubihsm]]` section of `tmkms.toml`:

```toml
[[providers.yubihsm]]
adapter = { type = "usb" }
connector_server = { laddr = "tcp://127.0.0.1:12345" }
```

This will start an HTTP server on `tcp://127.0.0.1:12345` which is compatible<br/>
with Yubico's `yubihsm-server`. You can now use this with `yubihsm-shell`, e.g.:

```shell
$ yubihsm-shell
Using default connector URL: http://127.0.0.1:12345
yubihsm> connect
Session keepalive set up to run every 15 seconds
yubihsm> session open 2
Enter password:
```

### Using `yubihsm-server` with `tmkms yubihsm` CLI Commands

You can also configure `tmkms yubihsm` subcommands to connect via this HTTP<br/>
server rather than USB, which allows for using them while the KMS is running.<br/>
To do that, add a `cli` subsection to `connector_server` line to the following:

```toml
connector_server = { laddr = "tcp://127.0.0.1:12345", cli = { auth_key = 2 } }
```

The `cli = { … }` subsection indicates that the `connector_server` should be<br/>
used by all `tmkms yubihsm` subcommands. It can contain the following<br/>
additional fields:

#### `auth_key`

An alternative authentication key to use (e.g. `2` for the operator role key<br/>
provisioned by the "Production YubiHSM 2 setup" process documented below).

When used, this will prompt for a password to use as opposed to using the one<br/>
in the configuration file:

```shell
$ tmkms yubihsm keys list
Enter password for YubiHSM2 auth key 0x0002:
Listing keys in YubiHSM #0123456789:
- 0x0001: ...
```

## Production YubiHSM 2 Setup

`tmkms` contains built-in support for fully automated production YubiHSM 2<br/>
setup, including deterministically generating authentication keys and backup<br/>
encryption keys from a [BIP39] 24-word seed phrase. This allows new YubiHSM 2s<br/>
to be provisioned with the same initial set of keys from the phrase alone,<br/>
while also creating multiple "roles" within the HSM.

Alternatively Yubico provides the [yubihsm-setup] tool, however the setup<br/>
process internal to `tmkms` provides a "happy path" for Tendermint validator<br/>
usage, and also operational processes which should be familiar to<br/>
cryptocurrency users.

### Configuring `tmkms` for Initial Setup

In order to perform setup, `tmkms` needs a minimal configuration file which<br/>
contains the credentials needed to authenticate to the HSM with an<br/>
administrator key.

This configuration should be placed in a file called: `tmkms.toml`.<br/>
By default `tmkms` will look for this file in the current working directory,<br/>
however most subcommands take a `-c /path/to/tmkms.toml` argument if you<br/>
would like to place it somewhere else.

Here is an example `tmkms.toml` file which can be used for initial setup<br/>
with a YubiHSM 2 which is still configured with its default authentication<br/>
keys (i.e. authentication key 1, with a default password of `password`):

```toml
[[providers.yubihsm]]
adapter = { type = "usb" }
auth = { key = 1, password = "password" }
```

If you have changed the default authentication key ID and/or password, you<br/>
will need to provide the correct credentials.

NOTE: if you have _lost or forgotten_ the admin authentication key, you<br/>
can _factory reset_ the YubiHSM 2 to a default state (wiping all keys)<br/>
by pushing down on the top (LED) immediately after inserting it and continuing<br/>
to push down on it for 10 seconds.

### `tmkms yubihsm setup`: Initial YubiHSM Setup

**WARNING: THIS PROCESS PERFORMS A FACTORY RESET OF THE YUBIHSM, DELETING ALL<br/>
EXISTING KEYS AND REPLACING THEM WITH NEW ONES. MAKE SURE YOU HAVE MADE BACKUPS<br/>
OF IMPORTANT KEYS BEFORE PROCEEDING!!!**

After configuring your YubiHSM 2's credentials in `tmkms.toml`, you can run the<br/>
following command to perform automatic setup:

```shell
$ tmkms yubihsm setup
```

We recommend this process be performed on an airgapped computer which is not<br/>
connected to any network. It will generate master secrets which can be used<br/>
to decrypt encrypted backups of keys within the HSM.

This process will perform the following steps:

- Generate a random 24-word recovery mnemonic phrase from randomness taken<br/>
  from the host OS as well as the YubiHSM2 itself.
- Deterministically (ala BIP32) generate authentication keys for the following<br/>
  four roles within the YubiHSM (with [yubihsm-shell] compatible passwords):
  - **admin** (authentication key `0x0001`): full access to all HSM capabilities
  - **operator** (authentication key `0x0002`): ability to generate new signing<br/>
    keys, export/import encrypted backups of keys, and view the audit log
  - **auditor** (authentication key `0x0003`): ability to view and consume the<br/>
    audit log
  - **validator** (authentication key `0x0004`): ability to generate signatures<br/>
    using signing keys loaded within the device
- Deterministically generate "wrap key" `0x0001`: symmetric encryption key<br/>
  (AES-CCM) used for making encrypted backups of other keys generated within<br/>
  the device. If you have existing keys you would like to transfer out of other<br/>
  YubiHSM 2s, this key can be imported into those HSMs in order to export<br/>
  encrypted backups (see below).

Notably different from cryptocurrency hardware wallets: this process does not<br/>
actually generate any signing keys, only authentication keys and the wrap key.<br/>
Generating validator signing keys (and creating backups) occurs in a subsequent<br/>
step (see below).

The following is example output from running the above command:

```shell
$ tmkms yubihsm setup
This process will *ERASE* the configured YubiHSM2 and reinitialize it:

- YubiHSM serial: 9876543210

Authentication keys with the following IDs and passwords will be created:

- key 0x0001: admin:

    double section release consider diet pilot flip shell mother alone what fantasy
    much answer lottery crew nut reopen stereo square popular addict just animal

- authkey 0x0002 [operator]:  kms-operator-password-1k02vtxh4ggxct5tngncc33rk9yy5yjhk
- authkey 0x0003 [auditor]:   kms-auditor-password-1s0ynq69ezavnqgq84p0rkhxvkqm54ks9
- authkey 0x0004 [validator]: kms-validator-password-1x4anf3n8vqkzm0klrwljhcx72sankcw0
- wrapkey 0x0001 [primary]:   21a6ca8cfd5dbe9c26320b5c4935ff1e63b9ab54e2dfe24f66677aba8852be13

*** Are you SURE you want erase and reinitialize this HSM? (y/N):
```

NOTE: the admin password is _displayed_ on two separate lines. When using it<br/>
from [yubihsm-shell] or as the `password` field in tmkms.toml, it is not split<br/>
across multiple lines and is separated only by a single space between words.

If you are certain you are ready to initialize your first YubiHSM 2, type `y`<br/>
to proceed:

```shell
*** Are you SURE you want erase and reinitialize this HSM? (y/N): y
21:08:09 [WARN] factory resetting HSM device! all data will be lost!
21:08:10 [INFO] waiting for device reset to complete
21:08:11 [INFO] installed temporary setup authentication key into slot 65534
21:08:11 [WARN] deleting default authentication key from slot 1
21:08:11 [INFO] installing role: admin:2019-03-05T20:31:07Z
21:08:11 [INFO] installing role: operator:2019-03-05T20:31:08Z
21:08:11 [INFO] installing role: auditor:2019-03-05T20:31:08Z
21:08:11 [INFO] installing role: validator:2019-03-05T20:31:08Z
21:08:11 [INFO] installing wrap key: primary:2019-03-05T20:31:08Z
21:08:11 [INFO] storing provisioning report in opaque object 0xfffe
21:08:11 [WARN] deleting temporary setup authentication key from slot 65534
     Success reinitialized YubiHSM (serial: 9876543210)
```

Make sure to write down the 24-word recovery phrase and store it in a<br/>
secure location!

### Initializing Additional HSMs from an Existing 24-word Recovery Phrase

After initializing your first HSM, you can bootstrap additional YubiHSM 2s as<br/>
a clone of the initial one using the same 24-word recovery phrase. To do that,<br/>
pass the `-r` (or `--restore`) flag when running the setup command:

```shell
$ tmkms yubihsm setup -r
Restoring and reprovisioning YubiHSM from existing 24-word mnemonic phrase.

*** Enter mnemonic (separate words with spaces): double section release consider [...]

Mnemonic phrase decoded/checksummed successfully!

This process will *ERASE* the configured YubiHSM2 and reinitialize it:

- YubiHSM serial: 9876543211

Authentication keys with the following IDs and passwords will be created:

- key 0x0001: admin:

    double section release consider diet pilot flip shell mother alone what fantasy
    much answer lottery crew nut reopen stereo square popular addict just animal

- authkey 0x0002 [operator]:  kms-operator-password-1k02vtxh4ggxct5tngncc33rk9yy5yjhk
- authkey 0x0003 [auditor]:   kms-auditor-password-1s0ynq69ezavnqgq84p0rkhxvkqm54ks9
- authkey 0x0004 [validator]: kms-validator-password-1x4anf3n8vqkzm0klrwljhcx72sankcw0
- wrapkey 0x0001 [primary]:   21a6ca8cfd5dbe9c26320b5c4935ff1e63b9ab54e2dfe24f66677aba8852be13

*** Are you SURE you want erase and reinitialize this HSM? (y/N): y
21:47:18 [WARN] factory resetting HSM device! all data will be lost!
21:47:19 [INFO] waiting for device reset to complete
21:47:21 [INFO] installed temporary setup authentication key into slot 65534
21:47:21 [WARN] deleting default authentication key from slot 1
21:47:21 [INFO] installing role: admin:2019-03-05T21:47:02Z
21:47:21 [INFO] installing role: operator:2019-03-05T21:47:03Z
21:47:21 [INFO] installing role: auditor:2019-03-05T21:47:03Z
21:47:21 [INFO] installing role: validator:2019-03-05T21:47:03Z
21:47:21 [INFO] installing wrap key: primary:2019-03-05T21:47:03Z
21:47:21 [INFO] storing provisioning report in opaque object 0xfffe
21:47:21 [WARN] deleting temporary setup authentication key from slot 65534
     Success reinitialized YubiHSM (serial: 9876543211)
```

## `tmkms yubihsm keys generate`: Signing Key Generation

The `tmkms` YubiHSM backend is designed to support signing keys which are<br/>
randomly generated by the device's internal cryptographically secure random<br/>
number generator, as opposed to ones which are deterministically generated<br/>
from the 24-word BIP39 mnemonic phrase.

This means you will need to do the following:

- Run `tmkms yubihsm keys generate` to create signing keys<br/>
  (i.e. validator consensus keys)
- Retain backups of these keys for disaster recovery

This command integrates a feature to export a backup of the keys at the<br/>
time they are generated, which is compatible with the [yubihsm-shell] tool.

Below is an example of the command to generate and export an encrypted backup<br/>
of an Ed25519 signing key:

```shell
$ tmkms yubihsm keys generate 1 -p cosmosvalconspub -b steakz4u-validator-key.enc
 Generated key #1: cosmosvalconspub1zcjduepqtvzxa733n7dhrjf247n0jtdwsvvsd4jgqvzexj5tkwerpzy5sugsvmfja3
     Wrote backup of key 1 (encrypted under wrap key 1) to steakz4u-validator-key.enc
```

This operation must be performed after configuring `tmkms.toml` with one of<br/>
the following sets of credentials:

- The `admin` key and associated 24-word password (i.e. key ID `0x0001`)
- The `operator` key (`0x0002`) and associated `kms-operator-password`

### Parameters

- `tmkms yubihsm keys generate 1` - generates asymmetric key 0x0001, which is by<br/>
  default an Ed25519 signing key.
- `-p` (or `--prefix`): Bech32 prefix to serialize key with (automatically sets label)
- `-l` (or `--label`): an up-to-40-character label describing the key
- `-b` (or `--backup`): path to a file where an _encrypted_ backup of the<br/>
  generated key should be written
- (not used in the example) `-w` (or `--wrapkey`): ID of the "wrap"<br/>
  (i.e encryption) key used to encrypt the backup key. It defaults to wrap<br/>
  key 0x0001 which was automatically generated as part of the<br/>
  `tmkms yubihsm setup` process.

## `tmkms yubihsm keys list`: List Signing Keys

The following command lists keys in the HSM:

```shell
$ tmkms yubihsm keys list
Listing keys in YubiHSM #9876543211:
- 0x#0001: 1624DE64200FB6DB3175225219D290497E3B78190A3EEDA89AEBBC2E2294547CA98E76F9D5
```

## Exporting and Importing Keys

`tmkms` contains functionality for exporting and importing keys, including<br/>
making encrypted backups of keys, and also importing existing<br/>
`priv_validator.json` keys.

We recommend you randomly generate keys using the above<br/>
`tmkms yubihsm keys generate` procedure to avoid exposing plaintext copies<br/>
of signing private keys outside of the HSM. However, below are instructions<br/>
which can hopefully accommodate any situation you happen to be in with regard<br/>
to exporting and importing existing keys.

### `tmkms yubihsm keys export`: Export Encrypted Backups of Signing Keys

If you ran `tmkms yubihsm keys generate` (or equivalent [yubihsm-shell])<br/>
command without creating a backup, the `keys export` subcommand can also<br/>
export a backup:

```shell
$ tmkms yubihsm keys export --id 1 steakz4u2-validator-key.enc
  Exported key 0x0001 (encrypted under wrap key 0x0001) to steakz4u2-validator-key.enc
```

The backups generated are compatible with the ones generated by the Yubico<br/>
`yubihsm-shell` utility.

#### Parameters

- `-i` (or `--id`): ID of the asymmetric key to export
- `-w` (or `--wrapkey`): ID of the wrap key under which the exported key will<br/>
  be encrypted.

### `tmkms yubihsm keys import`: Import Encrypted Backups of Signing Keys

After generating a key on a YubiHSM and exporting a backup, you can import the<br/>
encrypted copy into another HSM with the following command:

```shell
$ tmkms yubihsm keys import steakz4u-validator-key.enc
    Imported key 0x0001: cosmosvalconspub1zcjduepqtvzxa733n7dhrjf247n0jtdwsvvsd4jgqvzexj5tkwerpzy5sugsvmfja3
```

### Exporting Keys from Previously Configured YubiHSM 2s

If you've previously configured a production key within a YubiHSM 2 and wish to<br/>
securely export it and import it into a YubiHSM 2 provisioned using the<br/>
`tmkms yubihsm setup` workflow, here are the steps to securely export it.

#### Note Wrap Key during the `tmkms yubihsm setup` Procedure

Among the keys generated during the initial procedure is the wrap key, which<br/>
is the encryption key used for all backups. It's at the bottom of this list:

```shell
- authkey 0x0002 [operator]:  kms-operator-password-1k02vtxh4ggxct5tngncc33rk9yy5yjhk
- authkey 0x0003 [auditor]:   kms-auditor-password-1s0ynq69ezavnqgq84p0rkhxvkqm54ks9
- authkey 0x0004 [validator]: kms-validator-password-1x4anf3n8vqkzm0klrwljhcx72sankcw0
- wrapkey 0x0001 [primary]:   21a6ca8cfd5dbe9c26320b5c4935ff1e63b9ab54e2dfe24f66677aba8852be13
```

(i.e. `wrapkey 0x0001 [primary]`)

The number `21a6ca8cfd5dbe9c26320b5c4935ff1e63b9ab54e2dfe24f66677aba8852be13`<br/>
is the hex serialization of an AES-256-CCM encryption key, and also compatible<br/>
with the syntax used by the [yubihsm-shell] utility.

If you can authenticate to a YubiHSM 2 which contains an existing key you with<br/>
to export, you can import the wrap key to export it under into the HSM with<br/>
the following `yubihsm-shell` command:

```shell
yubihsm> put wrapkey 0 1 wrapkey 1 export-wrapped,import-wrapped exportable-under-wrap,sign-ecdsa,sign-eddsa 21a6ca8cfd5dbe9c26320b5c4935ff1e63b9ab54e2dfe24f66677aba8852be13
Stored Wrap key 0x0001
```

#### Parameters

- `put wrapkey 0 1 wrapkey`: put the specified wrap key (via session 0) into slot `0x0001`
- `1`: put the wrap key into [domain] 1 (use any of the domains the original key<br/>
  is accessible from)
- `export-wrapped,import-wrapped`: grant the [capabilities] to export and<br/>
  import other keys
- `exportable-under-wrap,sign-ecdsa,sign-eddsa`: [delegated capabilities] which<br/>
  allow imported keys to be exported again, as well as used to generate ECDSA<br/>
  and "EdDSA" (i.e. Ed25519) signatures.
- `[hex string]`: raw AES-256-CCM wrap key to import

[YubiHSM 2]: https://www.yubico.com/product/yubihsm-2/
[toplevel README.md]: https://github.com/iqlusioninc/tmkms/blob/master/README.md#installation
[crates.io]: https://crates.io
[crates.io index]: https://github.com/rust-lang/crates.io-index
[BIP39]: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
[yubihsm-setup]: https://developers.yubico.com/YubiHSM2/Component_Reference/yubihsm-setup/
[yubihsm-shell]: https://developers.yubico.com/YubiHSM2/Component_Reference/yubihsm-shell/
[domain]: https://developers.yubico.com/YubiHSM2/Concepts/Domain.html
[capabilities]: https://developers.yubico.com/YubiHSM2/Concepts/Capability.html
[delegated capabilities]: https://developers.yubico.com/YubiHSM2/Concepts/Effective_Capabilities.html

## Step-by-step Guide on Enabling YubiHSM for the Validator

1. Init the tmkms config

```bash
user@host:~/tmkms$ tmkms init ~/.tmkms
Creating /home/user/.tmkms
Generated KMS configuration: /home/user/.tmkms/tmkms.toml
Generated Secret Connection key: /home/user/.tmkms/secrets/kms-identity.key
```

1. Update the `tmkms.toml` file, specifically, edit these params:

- `chain.id`, `validator.chain_id`, `providers.yubihsm.keys[].chain_ids` - set it as the chain name (for example, `cosmoshub-4` for Cosmos network)
- `chain.key_format.account_key_prefix` - set it as a bech32 prefix for account public key (for example, `cosmospub` for Cosmos network)
- `chain.key_format.consensus_key_prefix` - set it as a bech32 prefix for validator consensus public key (for example, `cosmosvalconspub` for Cosmos network)
- `providers.yubihsm.auth.key`, `providers.yubihsm.auth.password` - set it as YubiHSM credentials (if you haven't done it before, the default is 1/password)
- `validator.addr` - remove the part before @ and the @ symbol itself to avoid mismatch
- `validator.protocol_version` - set it to Tendermint version used (for example, `0.34` for Cosmos network), otherwise it won't be able to communicate with the node

1. Check that your device is recognized:

```bash
user@host:~/.tmkms$ sudo tmkms yubihsm detect
Detected YubiHSM2 USB devices:
- Serial #0123456789 (bus 0)
```

1. Reset the device. Keep in mind that this will erase every key inside and will generate new access codes for YubiHSM:

```bash
user@host:~/.tmkms$ tmkms yubihsm setup
This process will *ERASE* the configured YubiHSM2 and reinitialize it:

- YubiHSM serial: 0123456789

Authentication keys with the following IDs and passwords will be created:

- key 0x0001: admin:

    never gonna give you up never gonna let you down never gonna
    run around and desert you never gonna make you cry never gonna

- authkey 0x0002 [operator]:  kms-operator-password-xxxxxxxxxx
- authkey 0x0003 [auditor]:   kms-auditor-password-yyyyyyyyyy
- authkey 0x0004 [validator]: kms-validator-password-zzzzzzzzzzzz
- wrapkey 0x0001 [primary]:   aaaaaaaaaaaa

*** Are you SURE you want erase and reinitialize this HSM? (y/N): y
2021-06-25T19:47:16.704555Z  WARN yubihsm::client: factory resetting HSM device! all data will be lost!
2021-06-25T19:47:17.753624Z  INFO yubihsm::client: waiting for device reset to complete
2021-06-25T19:47:19.394422Z  INFO yubihsm::setup: installed temporary setup authentication key into slot 65534
2021-06-25T19:47:19.414025Z  WARN yubihsm::setup: deleting default authentication key from slot 1
2021-06-25T19:47:19.439914Z  INFO yubihsm::setup::profile: installing role: admin:2021-06-25T19:47:11Z
2021-06-25T19:47:19.463169Z  INFO yubihsm::setup::profile: installing role: operator:2021-06-25T19:47:11Z
2021-06-25T19:47:19.482779Z  INFO yubihsm::setup::profile: installing role: auditor:2021-06-25T19:47:11Z
2021-06-25T19:47:19.502406Z  INFO yubihsm::setup::profile: installing role: validator:2021-06-25T19:47:11Z
2021-06-25T19:47:19.522044Z  INFO yubihsm::setup::profile: installing wrap key: primary:2021-06-25T19:47:11Z
2021-06-25T19:47:19.544402Z  INFO yubihsm::setup::profile: storing provisioning report in opaque object 0xfffe
2021-06-25T19:47:19.568656Z  WARN yubihsm::setup: deleting temporary setup authentication key from slot 65534
     Success reinitialized YubiHSM (serial: 0123456789)
```

1. Your device is reset. Now update the tmkms config and change the auth key and password to either the operator or the admin key, so you can put the key there:

```bash
auth = { key = 2, password = "kms-operator-password-xxxxxxxxxx" }
```

1. Check that you are able to list keys in this YubiHSM and there are none, this is expected:

```bash
user@host:~/.tmkms$ sudo tmkms yubihsm keys list
error: no keys in this YubiHSM (#0123456789)
```

1. Import your keys into the HSM (replace the `~/.appfolder` with the actual folder that stores the chain data):

```bash
user@host:~/.tmkms$ tmkms yubihsm keys import -t json -i 1 ~/.appfolder/config/priv_validator_key.json
    Imported key 0x0001
```

1. Validate that the key is in HSM now and that it matches the one used by the full node (replace appd with your full node daemon executable):

```bash
user@host:~/.tmkms$ sudo tmkms yubihsm keys list
Listing keys in YubiHSM #0123456789:
- 0x0001: [cons] cosmosvalconspubxxxxxxxxxx
   label: ""
user@host:~/.tmkms$ appd tendermint show-validator
cosmosvalconspubxxxxxxxxxx
```

1. Update the tmkms config and put the validator key and password here. This is important as the operator key cannot sign blocks and you don't want your operator/admin key stored in a plaintext on a machine.

```bash
auth = { key = 4, password = "kms-validator-password-zzzzzzzzzzzz" }
```

1. Update the `config.toml` of the full node, specifically:

- comment out the `priv_validator_key_file` and `priv_validator_state_file` options
- add `priv_validator_laddr = "tcp://127.0.0.1:26658"` option so it'd try to use the tmkms to sign blocks.

1. Stop the validator node process and validate your validator is skipping blocks now.
2. Start tmkms, it's strongly suggested to write a systemd file for it so it'd take care of running it detached.
3. Start the full node and validate that it connects to tmkms to sign blocks and that your validator is signing blocks again.
4. You're done!
5. You may want to delete the old `priv_validator_key.json` from the server, so no attacker can steal it, but please make sure you have backups.
