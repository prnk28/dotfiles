---
tags:
  - "#blockchain-development"
  - "#distributed-systems"
  - "#cosmos-sdk"
  - "#interchain"
  - "#ibc-protocol"
  - "#cross-chain-communication"
  - "#group-governance"
  - "#blockchain"
  - "#documentation"
  - "#web-api"
  - "#security"
  - "#interchain-accounts"
  - "#blockchain-integration"
  - "#protocol-documentation"
---
This is a step-by-step guide showing how to use the CLI of the Cosmos SDK `x/group` module with Interchain Accounts. A group policy is created that is used to register an interchain account and send messages to it. See the documentation for [`x/group`](https://docs.cosmos.network/main/modules/group) and [`Interchain Accounts`](https://ibc.cosmos.network/main/apps/interchain-accounts/overview.html) for more information.

### Table of Contents

[](#table-of-contents)

- [Setup](#setup)
- [Step 1: create a connection between `chain1` and `chain2`](#step-1-create-a-connection-between-chain1-and-chain2)
- [Step 2: create a group](#step-2-create-a-group)
- [Step 3: create a group policy](#step-3-create-a-group-policy)
- [Step 4: submit proposal for `MsgRegisterInterchainAccount`](#step-4-submit-proposal-for-msgregisterinterchainaccount)
- [Step 5: vote proposal for `MsgRegisterInterchainAccount`](#step-5-vote-proposal-for-msgregisterinterchainaccount)
- [Step 6: execute proposal for `MsgRegisterInterchainAccount`](#step-6-execute-proposal-for-msgregisterinterchainaccount)
- [Step 7: fund the interchain account](#step-7-fund-the-interchain-account)
- [Step 8: submit proposal for `MsgSendTx`](#step-8-submit-proposal-for-msgsendtx)
- [Step 9: vote proposal for `MsgSendTx`](#step-9-vote-proposal-for-msgsendtx)
- [Step 10: execute proposal for `MsgSendTx`](#step-10-execute-proposal-for-msgsendtx)

## Setup

[](#setup)

- Two chains (`chain1` and `chain2`) running ib-go's `simd` binary.
- `chain1`'s RPC endpoint runs on `http://localhost:27000` and REST API runs on `http://localhost:27001`.
- `chain2`'s RPC endpoint runs on `http://localhost:27010` and REST API runs on `http://localhost:27011`.
- hermes relayer.

> This document is updated for ibc-go v6.0.0 and hermes v1.0.0.

Based on your own situation, you might need to adjust the parameters or commands presented here.

## Step 1: create a connection between `chain1` and `chain2`

[](#step-1-create-a-connection-between-chain1-and-chain2)

We create a connection using hermes:

```
> hermes --config config.toml create connection --a-chain chain1 --b-chain chain2 
```

And we can query on `chain1` the connections:

```
> simd q ibc connection connections --node http://localhost:27000
```

connections:
- client_id: 07-tendermint-0
  counterparty:
    client_id: 07-tendermint-0
    connection_id: connection-0
    prefix:
      key_prefix: aWJj
  delay_period: "0"
  id: connection-0
  state: STATE_OPEN
  versions:
  - features:
    - ORDER_ORDERED
    - ORDER_UNORDERED
    identifier: "1"
height:
  revision_height: "2224"
  revision_number: "0"
pagination:
  next_key: null
  total: "0"

## Step 2: create a group

[](#step-2-create-a-group)

We create a group with an administrator and one member (we use the same account address for both in this example):

```
> simd tx group create-group \
cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws \
"" \
members.json \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

where `members.json` has the following content:

{
  "members": [
    {
      "address": "cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws",
      "weight": "1",
      "metadata": ""
    }
  ]
}

We can query the groups for the administrator:

```
> simd query group groups-by-admin \
cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws \
--node http://localhost:27000
```

groups:
- admin: cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws
  created_at: "2022-10-28T10:57:14.493898Z"
  id: "1"
  metadata: ""
  total_weight: "1"
  version: "1"
pagination:
  next_key: null
  total: "1"

## Step 3: create a group policy

[](#step-3-create-a-group-policy)

We create a group policy:

```
> simd tx group create-group-policy \
cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws \
1 \
"" \
policy.json \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

where `policy.json` has the following content:

{
  "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",
  "threshold": "1",
  "windows": {
    "voting_period": "5m",
    "min_execution_period": "60s"
  }
}

We can query the group policies for the administrator:

```
> simd query group group-policies-by-admin \
cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws \
--node http://localhost:27000
```

group_policies:
- address: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
  admin: cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws
  created_at: "2022-10-28T11:05:11.114236Z"
  decision_policy:
    '@type': /cosmos.group.v1.ThresholdDecisionPolicy
    threshold: "1"
    windows:
      min_execution_period: 60s
      voting_period: 300s
  group_id: "1"
  metadata: ""
  version: "1"
pagination:
  next_key: null
  total: "1"

The group policy address is `cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd`. This is the address that we will use as owner of the interchain account.

## Step 4: submit proposal for `MsgRegisterInterchainAccount`

[](#step-4-submit-proposal-for-msgregisterinterchainaccount)

We submit a proposal with a [`MsgRegisterInterchainAccount`](https://github.com/cosmos/ibc-go/blob/release/v6.0.x/proto/ibc/applications/interchain_accounts/controller/v1/tx.proto#L18-L26):

```
> simd tx group submit-proposal proposal_register.json \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

where `proposal_register.json` has the following content:

{
  "group_policy_address": "cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd",
  "messages": [{
    "@type": "/ibc.applications.interchain_accounts.controller.v1.MsgRegisterInterchainAccount",
    "connection_id": "connection-0",
    "owner": "cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd",
    "version": "{\"version\": \"ics27-1\",\"controller_connection_id\": \"connection-0\",\"host_connection_id\": \"connection-0\",\"encoding\": \"proto3\",\"tx_type\": \"sdk_multi_msg\"}"
  }],
  "metadata": "",
  "proposers": ["cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws"]
}

We can query the proposals for the group policy address:

```
> simd query group proposals-by-group-policy \
cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd \
--node http://localhost:27000
```

pagination:
  next_key: null
  total: "1"
proposals:
- executor_result: PROPOSAL_EXECUTOR_RESULT_NOT_RUN
  final_tally_result:
    abstain_count: "0"
    no_count: "0"
    no_with_veto_count: "0"
    yes_count: "0"
  group_policy_address: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
  group_policy_version: "1"
  group_version: "1"
  id: "1"
  messages:
  - '@type': /ibc.applications.interchain_accounts.controller.v1.MsgRegisterInterchainAccount
    connection_id: connection-0
    owner: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
    version: '{"version": "ics27-1","controller_connection_id": "connection-0","host_connection_id":
      "connection-0","encoding": "proto3","tx_type": "sdk_multi_msg"}'
  metadata: ""
  proposers:
  - cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws
  status: PROPOSAL_STATUS_SUBMITTED
  submit_time: "2022-10-28T11:16:12.979809Z"
  voting_period_end: "2022-10-28T11:21:12.979809Z"

The proposal is submitted and can be voted for now. The proposal has id 1.

## Step 5: vote proposal for `MsgRegisterInterchainAccount`

[](#step-5-vote-proposal-for-msgregisterinterchainaccount)

We vote yes for the proposal:

```
> simd tx group vote 1 \
cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws VOTE_OPTION_YES "" \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

We can query the votes for the proposal:

```
> simd query group votes-by-proposal 1 --node http://localhost:27000
```

pagination:
  next_key: null
  total: "1"
votes:
- metadata: ""
  option: VOTE_OPTION_YES
  proposal_id: "1"
  submit_time: "2022-10-28T11:18:42.022410Z"
  voter: cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws

After the voting period ends we can query the proposal again:

```
> simd query group proposal 1 --node http://localhost:27000
```

proposal:
  executor_result: PROPOSAL_EXECUTOR_RESULT_NOT_RUN
  final_tally_result:
    abstain_count: "0"
    no_count: "0"
    no_with_veto_count: "0"
    yes_count: "1"
  group_policy_address: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
  group_policy_version: "1"
  group_version: "1"
  id: "1"
  messages:
  - '@type': /ibc.applications.interchain_accounts.controller.v1.MsgRegisterInterchainAccount
    connection_id: connection-0
    owner: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
    version: '{"version": "ics27-1","controller_connection_id": "connection-0","host_connection_id":
      "connection-0","encoding": "proto3","tx_type": "sdk_multi_msg"}'
  metadata: ""
  proposers:
  - cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws
  status: PROPOSAL_STATUS_ACCEPTED
  submit_time: "2022-10-28T11:16:12.979809Z"
  voting_period_end: "2022-10-28T11:21:12.979809Z"  

The proposal has been accepted.

## Step 6: execute proposal for `MsgRegisterInterchainAccount`

[](#step-6-execute-proposal-for-msgregisterinterchainaccount)

We execute the proposal:

```
> simd tx group exec 1 \
--from cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

The relayer is now performing the channel handshake between `chain1` and `chain2` to open the interchain account channel and register the interchain account on the host (i.e. `chain2`). The handshake finishes we can query the channel on `chain1`:

```
> simd q ibc channel channels --node http://localhost:27000
```

channels:
- channel_id: channel-0
  connection_hops:
  - connection-0
  counterparty:
    channel_id: channel-0
    port_id: icahost
  ordering: ORDER_ORDERED
  port_id: icacontroller-cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
  state: STATE_OPEN
  version: '{"version":"ics27-1","controller_connection_id":"connection-0","host_connection_id":"connection-0","address":"cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu","encoding":"proto3","tx_type":"sdk_multi_msg"}'
height:
  revision_height: "1089"
  revision_number: "0"
pagination:
  next_key: null
  total: "0"

We see that an ordered channel has been created. We can query on `chain1` to retrieve the address of the interchain account on the host owned by the group policy address:

```
> simd query interchain-accounts controller interchain-account cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd connection-0 --node http://localhost:27000
```

address: cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu

## Step 7: fund the interchain account

[](#step-7-fund-the-interchain-account)

We are going to execute a `x/bank` `MsgSend` on the interchain account, but the interchain account is created without any funds. For that reason, we are going to transfer some funds to it from another account on `chain2`:

```
simd tx bank send cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav \ cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu \
1000samoleans \
--chain-id chain2 \
--keyring-backend test
--home ../../gm/chain2 \
--node http://localhost:27010
```

We can query the balance of the interchain account to check that it has now funds:

```
> simd q bank  balances \
cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu  \
--node http://localhost:27010
```

balances:
- amount: "1000"
  denom: samoleans
pagination:
  next_key: null
  total: "0"

## Step 8: submit proposal for `MsgSendTx`

[](#step-8-submit-proposal-for-msgsendtx)

We are now going to submit and execute a proposal to send a message to the interchain account to execute a `MsgSend` from the interchain account.

First we generate the interchain account packet data for `MsgSend`. Run on `chain2` the following command:

```
> simd tx interchain-accounts host generate-packet-data '{
  "@type": "/cosmos.bank.v1beta1.MsgSend",
  "from_address": "cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu",
  "to_address": "cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav",
  "amount": [
    {
      "denom": "samoleans",
      "amount": "100"
    }
  ]
}'
```

{"type":"TYPE_EXECUTE_TX","data":"CqUBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEoQBCkFjb3Ntb3MxOXlmeGxucHIzamh5NHR6ejI5NGY0ZzR0dnI1OTBhN2ZqMzlxNnVtZHJhZDQweXZsbnd6c3NzeTBmdRItY29zbW9zMTZkOHA1dzJuOW5mcW16cG41MmFsN3NuYW53dzI4MjhlejZmbWF2GhAKCXNhbW9sZWFucxIDMTAw","memo":""}

We submit the proposal on `chain1` with a [`MsgSendTx`](https://github.com/cosmos/ibc-go/blob/release/v6.0.x/proto/ibc/applications/interchain_accounts/controller/v1/tx.proto#L33-L45):

```
> simd tx group submit-proposal proposal_send.json \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

where `proposal_send.json` has the following content:

{
  "group_policy_address": "cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd",
  "messages": [{
    "@type": "/ibc.applications.interchain_accounts.controller.v1.MsgSendTx",
    "owner": "cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd",
    "connection_id": "connection-0",
    "packet_data" : {
      "type": "TYPE_EXECUTE_TX",
      "data": "CqUBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEoQBCkFjb3Ntb3MxOXlmeGxucHIzamh5NHR6ejI5NGY0ZzR0dnI1OTBhN2ZqMzlxNnVtZHJhZDQweXZsbnd6c3NzeTBmdRItY29zbW9zMTZkOHA1dzJuOW5mcW16cG41MmFsN3NuYW53dzI4MjhlejZmbWF2GhAKCXNhbW9sZWFucxIDMTAw",
      "memo": ""
    },
    "relative_timeout": 300000000000
  }],
  "metadata": "",
  "proposers": ["cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws"]
}

We can query the proposals for the group policy address:

```
> simd query group proposals-by-group-policy \
cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd \
--node http://localhost:27000
```

pagination:
  next_key: null
  total: "1"
proposals:
- executor_result: PROPOSAL_EXECUTOR_RESULT_NOT_RUN
  final_tally_result:
    abstain_count: "0"
    no_count: "0"
    no_with_veto_count: "0"
    yes_count: "0"
  group_policy_address: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
  group_policy_version: "1"
  group_version: "1"
  id: "2"
  messages:
  - '@type': /ibc.applications.interchain_accounts.controller.v1.MsgSendTx
    connection_id: connection-0
    owner: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
    packet_data:
      data: CqUBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEoQBCkFjb3Ntb3MxOXlmeGxucHIzamh5NHR6ejI5NGY0ZzR0dnI1OTBhN2ZqMzlxNnVtZHJhZDQweXZsbnd6c3NzeTBmdRItY29zbW9zMTZkOHA1dzJuOW5mcW16cG41MmFsN3NuYW53dzI4MjhlejZmbWF2GhAKCXNhbW9sZWFucxIDMTAw
      memo: ""
      type: TYPE_EXECUTE_TX
    relative_timeout: "300000000000"
  metadata: ""
  proposers:
  - cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws
  status: PROPOSAL_STATUS_SUBMITTED
  submit_time: "2022-10-28T12:13:26.032668Z"
  voting_period_end: "2022-10-28T12:18:26.032668Z"

The proposal is submitted and can be voted for now. The proposal has id 2.

## Step 9: vote proposal for `MsgSendTx`

[](#step-9-vote-proposal-for-msgsendtx)

We vote yes for the proposal:

```
> simd tx group vote 2 \
cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws VOTE_OPTION_YES "" \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

We can query the votes for the proposal:

```
> simd query group votes-by-proposal 2 --node http://localhost:27000`
```

pagination:
  next_key: null
  total: "1"
votes:
- metadata: ""
  option: VOTE_OPTION_YES
  proposal_id: "2"
  submit_time: "2022-10-28T12:14:27.767481Z"
  voter: cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws

After the voting period ends we can query the proposal again:

```
> simd query group proposal 1 --node http://localhost:27000
```

proposal:
  executor_result: PROPOSAL_EXECUTOR_RESULT_NOT_RUN
  final_tally_result:
    abstain_count: "0"
    no_count: "0"
    no_with_veto_count: "0"
    yes_count: "1"
  group_policy_address: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
  group_policy_version: "1"
  group_version: "1"
  id: "2"
  messages:
  - '@type': /ibc.applications.interchain_accounts.controller.v1.MsgSendTx
    connection_id: connection-0
    owner: cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
    packet_data:
      data: CqUBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEoQBCkFjb3Ntb3MxOXlmeGxucHIzamh5NHR6ejI5NGY0ZzR0dnI1OTBhN2ZqMzlxNnVtZHJhZDQweXZsbnd6c3NzeTBmdRItY29zbW9zMTZkOHA1dzJuOW5mcW16cG41MmFsN3NuYW53dzI4MjhlejZmbWF2GhAKCXNhbW9sZWFucxIDMTAw
      memo: ""
      type: TYPE_EXECUTE_TX
    relative_timeout: "300000000000"
  metadata: ""
  proposers:
  - cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws
  status: PROPOSAL_STATUS_ACCEPTED
  submit_time: "2022-10-28T12:13:26.032668Z"
  voting_period_end: "2022-10-28T12:18:26.032668Z"

The proposal has been accepted.

## Step 10: execute proposal for `MsgSendTx`

[](#step-10-execute-proposal-for-msgsendtx)

We execute the proposal:

```
> simd tx group exec 2 --node http://localhost:27000 \
--from cosmos1lkszkzak6ng8h36twd8y9ljqnf95q6u5sp2nws \
--chain-id chain1 \
--keyring-backend test \
--home ../../gm/chain1 \
--node http://localhost:27000
```

The relayer is now relaying the message from the controller chain `chain1` to the host chain `chain2`. The message contains a `MsgSend` that will be executed on the interchain account, resulting on `100samoleans` being transfered from the interchain account to another account.

We query the bank balance of the interchain account:

```
> simd q bank balances \ cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu  \
--node http://localhost:27010
```

balances:
- amount: "900"
  denom: samoleans
pagination:
  next_key: null
  total: "0"

And we can see that it has `100samoleans` fewer than before.

We can also query `chain1` the packet events for `MsgSendTx`:

```
> simd q interchain-accounts host packet-events \
channel-0 1 \
--node http://localhost:27010
```

- coin_received
      - receiver: cosmos17xpfvakm2amg962yls6f84z3kell8c5lserqta
      - amount: 192stake
      - receiver: cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav
      - amount: 100samoleans
    - coin_spent
      - spender: cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav
      - amount: 192stake
      - spender: cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu
      - amount: 100samoleans
    - ics27_packet
      - module: interchainaccounts
      - host_channel_id: channel-0
      - success: true
    - message
      - sender: cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav
      - action: /ibc.core.client.v1.MsgUpdateClient
      - module: ibc_client
      - action: /ibc.core.channel.v1.MsgRecvPacket
      - module: ibc_channel
      - sender: cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu
      - module: bank
      - module: ibc_channel
    - recv_packet
      - packet_data: {"data":"CqUBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEoQBCkFjb3Ntb3MxOXlmeGxucHIzamh5NHR6ejI5NGY0ZzR0dnI1OTBhN2ZqMzlxNnVtZHJhZDQweXZsbnd6c3NzeTBmdRItY29zbW9zMTZkOHA1dzJuOW5mcW16cG41MmFsN3NuYW53dzI4MjhlejZmbWF2GhAKCXNhbW9sZWFucxIDMTAw","memo":"","type":"TYPE_EXECUTE_TX"}
      - packet_data_hex: 7b2264617461223a2243715542436877765932397a6257397a4c6d4a68626d7375646a46695a5852684d53354e633264545a57356b456f5142436b466a62334e7462334d784f586c6d654778756348497a616d68354e485236656a49354e4759305a7a5230646e49314f5442684e325a714d7a6c784e6e56745a484a685a44517765585a73626e643663334e7a6554426d645249745932397a6257397a4d545a6b4f484131647a4a754f57356d63573136634734314d6d46734e334e7559573533647a49344d6a686c656a5a6d625746324768414b43584e68625739735a574675637849444d544177222c226d656d6f223a22222c2274797065223a22545950455f455845435554455f5458227d
      - packet_timeout_height: 0-0
      - packet_timeout_timestamp: 1666959915932143000
      - packet_sequence: 1
      - packet_src_port: icacontroller-cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
      - packet_src_channel: channel-0
      - packet_dst_port: icahost
      - packet_dst_channel: channel-0
      - packet_channel_ordering: ORDER_ORDERED
      - packet_connection: connection-0
    - transfer
      - recipient: cosmos17xpfvakm2amg962yls6f84z3kell8c5lserqta
      - sender: cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav
      - amount: 192stake
      - recipient: cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav
      - sender: cosmos19yfxlnpr3jhy4tzz294f4g4tvr590a7fj39q6umdrad40yvlnwzsssy0fu
      - amount: 100samoleans
    - tx
      - fee: 192stake
      - fee_payer: cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav
      - acc_seq: cosmos16d8p5w2n9nfqmzpn52al7snanww2828ez6fmav/7
      - signature: x7vk/nPmedUEUmyu6KEoiT3DvpB0/MXc06hftt1ckkss3VB9tjlcDDglMwzAruoIz+QFyLxH6jN9TC55ZynpQA==
    - update_client
      - client_id: 07-tendermint-0
      - client_type: 07-tendermint
      - consensus_height: 0-1027
      - header: 0a262f6962632e6c69676874636c69656e74732e74656e6465726d696e742e76312e48656164657212d0060ac8040a8c030a02080b1206636861696e31188308220b088592ef9a0610b0edcf392a480a2007387e4e5f0b41a37523e06fa6613444a30841dffeb69c87c168875dc6ce13ae122408011220fdc33cef5119788804a75a7d6aba81aa8802965471135c762783646ef9c208e63220cb8855b52b6fc46d8ab12cc57bd9bcca6a480749bb405369987f17e474b40cef3a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855422031810e9914d60d2129e1e7d35a2733c6a457800ce75d1d1b86560a853682d6e74a2031810e9914d60d2129e1e7d35a2733c6a457800ce75d1d1b86560a853682d6e75220048091bc7ddc283f77bfbf91d73c44da58c3df8a9cbc867405d8b7f3daada22f5a20d8df83192af6be0f104b2a13a4364abad5f28acc7dedce618f1a2feafc54c031622066c033afe3dd91b29918e7c750d4a888b9a039c719cddc25cd377205d320ac8e6a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8557214bfa7e0826c7d8019eb0602269b455f6a29516a5612b6010883081a480a2051b451f2eae51df18a738cd3484a050bff75bddc0b1926a63de395ec9dcbce68122408011220de1f28d7e215dfe160f1aa8cc0623eaed2798ce97b2d24c6089bf9901015d8b7226708021214bfa7e0826c7d8019eb0602269b455f6a29516a561a0b088a92ef9a0610a8a29b782240470a517e19de7a3bedc72fe54ffb2136bed5603c4f0878a6a1b8dc12b271da4ee30804e24ac731562a161a70300365feb72b42e390b03df4d9548a1062840904127e0a3c0a14bfa7e0826c7d8019eb0602269b455f6a29516a5612220a20232c806552c7e1348028b4edf727d9b9b96ace44d8422208d427400209d658e8180a123c0a14bfa7e0826c7d8019eb0602269b455f6a29516a5612220a20232c806552c7e1348028b4edf727d9b9b96ace44d8422208d427400209d658e8180a180a1a03109003227e0a3c0a14bfa7e0826c7d8019eb0602269b455f6a29516a5612220a20232c806552c7e1348028b4edf727d9b9b96ace44d8422208d427400209d658e8180a123c0a14bfa7e0826c7d8019eb0602269b455f6a29516a5612220a20232c806552c7e1348028b4edf727d9b9b96ace44d8422208d427400209d658e8180a180a
    - write_acknowledgement
      - packet_data: {"data":"CqUBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEoQBCkFjb3Ntb3MxOXlmeGxucHIzamh5NHR6ejI5NGY0ZzR0dnI1OTBhN2ZqMzlxNnVtZHJhZDQweXZsbnd6c3NzeTBmdRItY29zbW9zMTZkOHA1dzJuOW5mcW16cG41MmFsN3NuYW53dzI4MjhlejZmbWF2GhAKCXNhbW9sZWFucxIDMTAw","memo":"","type":"TYPE_EXECUTE_TX"}
      - packet_data_hex: 7b2264617461223a2243715542436877765932397a6257397a4c6d4a68626d7375646a46695a5852684d53354e633264545a57356b456f5142436b466a62334e7462334d784f586c6d654778756348497a616d68354e485236656a49354e4759305a7a5230646e49314f5442684e325a714d7a6c784e6e56745a484a685a44517765585a73626e643663334e7a6554426d645249745932397a6257397a4d545a6b4f484131647a4a754f57356d63573136634734314d6d46734e334e7559573533647a49344d6a686c656a5a6d625746324768414b43584e68625739735a574675637849444d544177222c226d656d6f223a22222c2274797065223a22545950455f455845435554455f5458227d
      - packet_timeout_height: 0-0
      - packet_timeout_timestamp: 1666959915932143000
      - packet_sequence: 1
      - packet_src_port: icacontroller-cosmos1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfwkgpd
      - packet_src_channel: channel-0
      - packet_dst_port: icahost
      - packet_dst_channel: channel-0
      - packet_ack: {"result":"EiYKJC9jb3Ntb3MuYmFuay52MWJldGExLk1zZ1NlbmRSZXNwb25zZQ=="}
      - packet_ack_hex: 7b22726573756c74223a224569594b4a43396a62334e7462334d75596d4675617935324d574a6c644745784c6b317a5a314e6c626d52535a584e776232357a5a513d3d227d
      - packet_connection: connection-0%