---
tags:
  - "#blockchain"
  - "#blockchain-development"
  - "#distributed-systems"
  - "#transaction-composition"
  - "#multi-message-txs"
  - "#atomic-operations"
  - "#security"
  - "#networking"
  - "#infrastructure"
  - "#cdn-architecture"
  - "#web-security"
  - "#performance-optimization"
---
# Avoid CDNs

# [Reasons to avoid Javascript CDNs](https://blog.wesleyac.com/posts/why-not-javascript-cdn)

Many javascript projects have install instructions recommending that people use a CDN like [jsdelivr](https://www.jsdelivr.com/) or [unpkg](https://unpkg.com/) to include the code on their website. This has the advantage that it's quicker to get started with, and it's often claimed to load faster. However, it also has downsides when it comes to privacy, security, and systemic risk, and it may actually be slower in some common cases. Here are some reasons not to use a javascript CDN, and some alternatives to consider instead.

## Systemic Risk

The big javascript CDNs are used by huge numbers of people—[cdnjs brags that it's on 12.5% of websites on the internet, and serves more that 200 billion requests per month](https://cdnjs.com/about), [jsdelivr serves nearly 100 billion requests per month](https://www.jsdelivr.com/blog/jsdelivr-keeps-growing-and-expanding/), and [unpkg serves ~2.4 billion unique IP addresses per month](https://twitter.com/mjackson/status/1296147192411955200). This means that one of these CDNs going down, or an attacker hacking one of them would have a huge impact all over society—we already see this category of problem with large swaths of the internet going down every time [cloudflare](https://techcrunch.com/2020/07/17/cloudflare-dns-goes-down-taking-a-large-piece-of-the-internet-with-it/) or [AWS](https://www.theverge.com/2021/12/7/22822332/amazon-server-aws-down-disney-plus-ring-outage) has an outage.

There's a [fundamental tradeoff](https://notebook.wesleyac.com/efficiency-resiliency/#288jCJ_U1E:1W:2k) here between efficiency and resiliency, and when 12.5% of the internet can have an outage because of one provider going down, I think we've swung way too far away from resiliency, as a society.

## Privacy

The most major concern that stems from this centralization is that of privacy—in the normal case, the only people who know when you visit a website are the people running that website, and the operators of the internet infrastructure between your computer and the server (which is _also_ shockingly centralized, but that's a story for another day). When a website includes a javascript file with a CDN, that CDN is then able to tell that you've visited that website. Most people realize that companies like Google keep a profile of nearly everywhere you go on the web, but normal people haven't even heard of Cloudflare, and despite that, they have a similarly complete picture of where you go on the internet. They [pinky promise](https://www.cloudflare.com/privacypolicy/) that they won't sell logs (privacy policy subject to unilateral change by them at any point, of course), and you just have to hope that they won't get hacked.

_(If you want to avoid getting tracked this way, [Decentraleyes](https://decentraleyes.org/) is a useful browser extension)_

## Speed

One of the significant benefits touted by CDNs is speed, but this doesn't make as much sense as it once did.

First off, modern browsers [don't cache requests to CDNs across multiple domains](https://www.stefanjudis.com/notes/say-goodbye-to-resource-caching-across-sites-and-domains/), since that can be used to track users—this means that even if someone has already downloaded the library you're including from the CDN on one website, they'll have to download it again when they visit your website. Note that this re-downloading doesn't actually protect against any of the privacy concerns mentioned above (and in fact makes them much worse), it's _only_ to stop random websites from being able to tell what other websites you've visited via cache timing attacks.

Secondly, if you're using HTTP/2 or HTTP/3 and including javascript files that aren't huge, it's likely going to be faster to download the javascript file from the same place the website is hosted due to [multiplexing](https://http2.github.io/faq/#why-is-http2-multiplexed)—particularly, DNS resolution and TLS setup often dominate the time taken to load the first connection to a new domain. Hosting the javascript files on the same server as the HTML allows you to avoid all of that, and thus will typically actually be faster for small files, since a single connection can be used. You can test this yourself pretty easily—look at the "DNS Resolution", "Connecting", and "TLS Setup" sections in the "Network" tab of the browser devtools—this is often more than half of the time for the first request! This is also something that is likely to be worse on slower connections than on faster ones.

## Security

Beyond just privacy, it's reasonable to be concerned that an attacker might be able to compromise end-users by hacking a CDN. Luckily, there is a way to protect against this—modern web browsers have a feature called [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity), which allows you to specify a hash of the expected contents of a script tag (if you're using libraries via a CDN, you should be doing this! It's pretty simple, and has nothing but upside in terms of security).

Unfortunately, this doesn't yet work in all cases—if a library is split into multiple files (to reduce initial load time/size), browsers currently only allow the main file to have a SRI hash specified. I'm [hopeful](https://github.com/WICG/import-maps/issues/221#issuecomment-988337894) that this can be fixed in the future, but it's not there yet. (To be clear, using SRI on the initial bundle still provides a meaningful increase in security—the fact that it doesn't work in some, frankly somewhat niche cases isn't a reason not to use it in general!)

## What to Do instead

The takeaway here is that if you're using a CDN for any reason other than laziness, it's likely not a good reason.

What I do is just download the library that I want and include the files in my repo, just like any other source file. I usually do this in a directory called `vendored` or `3p`, and be sure to include the version number of the package that I downloaded in the filename. This takes maybe 60 seconds more work than including the CDN version, which seems worth it to me for the privacy, robustness, and speed benefits.

If you are going to use a CDN, at the very least, include a SRI hash—they're super easy to generate with [this tool](https://www.srihash.org/). And if you're a library author who writes install instructions recommending the use of a CDN, _definitely_ include a SRI hash—that way people don't need to know to do it themselves, they can just copy and paste it.

---

Article WebURL

## Complex Transactions

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[Send multiple tokens using sendTokens](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#send-multiple-tokens-using-sendtokens)

[Introducing signAndBroadcast](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#introducing-signandbroadcast)

[Token transfer messages](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#token-transfer-messages)

[What is this long string?](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#what-is-this-long-string)

[Multiple token transfer messages](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#multiple-token-transfer-messages)

[Mixing other message types](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#mixing-other-message-types)

# [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#compose-complex-transactions) Compose Complex Transactions

82 min read

Tutorial

CosmJS

DevOps

![](https://tutorials.cosmos.network/hi-target-icon.svg)

In the Interchain, a transaction is able to encapsulate multiple messages.

In this section, you will:

- Send multiple tokens in a single transaction.
- Sign and broadcast.
- Assemble multiple messages.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#send-multiple-tokens-using-sendtokens) Send Multiple Tokens Using `sendTokens`

In the [previous exercise](https://tutorials.cosmos.network/tutorials/7-cosmjs/2-first-steps.html), you had Alice send tokens back to the faucet. To refresh your memory, this is what the `sendTokens` function takes as input:

Copy<br/>
publicasyncsendTokens(<br/>
senderAddress:string,<br/>
recipientAddress:string,<br/>
amount:readonly Coin\[\],<br/>
fee: StdFee \|"auto"\|number,<br/>
memo ="",):Promise<DeliverTxResponse>;

[`Coin`(opens new window)](https://github.com/confio/cosmjs-types/blob/a14662d/src/cosmos/base/v1beta1/coin.ts#L13-L16) allows Alice to send not just `stake` but also any number of other coins as long as she owns them. So she can:

- Send one token type
- Send two token types

Copy<br/>
const result =await signingClient.sendTokens(<br/>
alice,<br/>
faucet,\[{ denom:"uatom", amount:"100000"},\],{<br/>
amount:\[{ denom:"uatom", amount:"500"}\],<br/>
gas:"200000",},)

Copy<br/>
const result =await signingClient.sendTokens(<br/>
alice,<br/>
faucet,\[{ denom:"uatom", amount:"100000"},{ denom:"token", amount:"12"},\],{<br/>
amount:\[{ denom:"uatom", amount:"500"}\],<br/>
gas:"200000",},)

However, there are limitations with this function. First, Alice **can only target a single recipient per transaction**, `faucet` in the previous examples. If she wants to send tokens to multiple recipients, then she needs to create as many transactions as there are recipients. Multiple transactions cost slightly more than packing transfers into the array because of transaction overhead. Additionally, in some cases it is considered a bad user experience to make users sign multiple transactions.

The second limitation is that **separate transfers are not atomic**. It is possible that Alice wants to send tokens to two recipients and it is important that either they both receive them or neither of them receive anything.

Fortunately, there is a way to atomically send tokens to multiple recipients.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#introducing-signandbroadcast) Introducing `signAndBroadcast`

`SigningStargateClient` has the `signAndBroadcast` function:

Copy<br/>
publicasyncsignAndBroadcast(<br/>
signerAddress:string,<br/>
messages:readonly EncodeObject\[\],<br/>
fee: StdFee \|"auto"\|number,<br/>
memo ="",):Promise<DeliverTxResponse>;

The basic components of a transaction are the `signerAddress`, the `messages` that it contains, as well as the `fee` and an optional `memo`. As such, [Cosmos transactions](https://tutorials.cosmos.network/academy/2-cosmos-concepts/3-transactions.html) can indeed be composed of multiple [messages](https://tutorials.cosmos.network/academy/2-cosmos-concepts/4-messages.html).

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#token-transfer-messages) Token Transfer Messages

In order to use `signAndBroadcast` to send tokens, you need to figure out what messages go into the `messages: readonly EncodeObject[]`. Examine the `sendTokens` function body:

Copy<br/>
const sendMsg: MsgSendEncodeObject ={<br/>
typeUrl:"/cosmos.bank.v1beta1.MsgSend",<br/>
value:{<br/>
fromAddress: senderAddress,<br/>
toAddress: recipientAddress,<br/>
amount:\[…amount\],},};returnthis.signAndBroadcast(senderAddress,\[sendMsg\], fee, memo);

Therefore, when sending back to the faucet, instead of calling:

Copy<br/>
const result =await signingClient.sendTokens(<br/>
alice,<br/>
faucet,\[{ denom:"uatom", amount:"100000"}\],{<br/>
amount:\[{ denom:"uatom", amount:"500"}\],<br/>
gas:"200000",},)

Alice may as well call:

Copy<br/>
const result =await signingClient.signAndBroadcast(// the signerAddress<br/>
alice,// the message(s)\[{<br/>
typeUrl:"/cosmos.bank.v1beta1.MsgSend",<br/>
value:{<br/>
fromAddress: alice,<br/>
toAddress: faucet,<br/>
amount:\[{ denom:"uatom", amount:"100000"},\],},},\],// the fee{<br/>
amount:\[{ denom:"uatom", amount:"500"}\],<br/>
gas:"200000",},)

Confirm this by making the change in your `experiment.ts` from the previous section, and running it again.

![](https://tutorials.cosmos.network/hi-star-icon.svg)

Building a transaction in this way is recommended. `SigningStargateClient` offers you convenience methods such as `sendTokens` for simple use cases, and to demonstrate how to build messages.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

If you are wondering whether there could be any legitimate situation where the transaction's signer (here `alice`) could ever be different from the message's `fromAddress` (here `alice` too), then have a look at the [tutorial on authz](https://tutorials.cosmos.network/tutorials/8-understand-sdk-modules/1-authz.html).

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#what-is-this-long-string) What is This long String?

As a reminder from the previous tutorial, the `typeUrl: "/cosmos.bank.v1beta1.MsgSend"` string comes from the [Protobuf](https://tutorials.cosmos.network/academy/2-cosmos-concepts/6-protobuf.html) definitions and is a mixture of:

1. The `package` where `MsgSend` is initially declared:

   Copy<br/>
   package cosmos.bank.v1beta1;

2. And the name of the message itself, `MsgSend`:

   Copy<br/>
   messageMsgSend{…}

![](https://tutorials.cosmos.network/hi-info-icon.svg)

To learn how to make your own types for your own blockchain project, head to [Create Custom CosmJS Interfaces](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html).

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#multiple-token-transfer-messages) Multiple Token Transfer Messages

From here, you add an extra message for a token transfer from Alice to someone else:

Copy<br/>
const result =await signingClient.signAndBroadcast(// signerAddress<br/>
alice,\[// message 1{<br/>
typeUrl:"/cosmos.bank.v1beta1.MsgSend",<br/>
value:{<br/>
fromAddress: alice,<br/>
toAddress: faucet,<br/>
amount:\[{ denom:"uatom", amount:"100000"},\],},},// message 2{<br/>
typeUrl:"/cosmos.bank.v1beta1.MsgSend",<br/>
value:{<br/>
fromAddress: alice,<br/>
toAddress: some_other_address,<br/>
amount:\[{ denom:"token", amount:"10"},\],},},\],// the fee"auto",)

Note how the custom fee input was replaced with the `auto` input, which simulates the transaction to estimate the fee for you. In order to make that work well, you need to define the `gasPrice` you are willing to pay and its `prefix` when setting up your `signingClient`. You replace your original line of code with:

Copy<br/>
const signingClient =await SigningStargateClient.connectWithSigner(rpc, aliceSigner,+{+ prefix:"cosmos",+ gasPrice: GasPrice.fromString("0.0025uatom")+})

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#mixing-other-message-types) Mixing other Message Types

The above example shows you two token-transfer messages in a single transaction. You can see this with their `typeUrl: "/cosmos.bank.v1beta1.MsgSend"`.

Neither the Cosmos SDK nor CosmJS limits you to combining messages of the same type. You can decide to combine other message types together with a token transfer. For instance, in one transaction Alice could:

1. Send tokens to the faucet.
2. Delegate some of her tokens to a validator.

How would Alice create the second message? The `SigningStargateClient` contains a predefined list (a _registry_) of `typeUrls` that are [supported by default(opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.2/packages/stargate/src/signingstargateclient.ts#L55-L69), because they're considered to be the most commonly used messages in the Cosmos SDK. Among the [staking types(opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.2/packages/stargate/src/signingstargateclient.ts#L62) there is `MsgDelegate`, and that is exactly what you need. Click the source links above and below to see the rest of the `typeUrls` that come with `SigningStargateClient`:

Copy<br/>
exportconst stakingTypes: ReadonlyArray<\[string, GeneratedType\]>=\[…\["/cosmos.staking.v1beta1.MsgDelegate", MsgDelegate\],…\];

Click through to the type definition, and in the `cosmjs-types` repository:

Copy<br/>
exportinterfaceMsgDelegate{<br/>
delegatorAddress:string;<br/>
validatorAddress:string;<br/>
amount?: Coin;}

Now that you know the `typeUrl` for delegating some tokens is `/cosmos.staking.v1beta1.MsgDelegate`, you need to find a validator's address that Alice can delegate to. Find a list of validators in the [testnet explorer(opens new window)](https://explorer.theta-testnet.polypore.xyz/validators). Select a validator and set their address as a variable:

Copy<br/>
const validator:string="cosmosvaloper178h4s6at5v9cd8m9n7ew3hg7k9eh0s6wptxpcn"//01node

Use this variable in the following script, which you can copy to replace your original token transfer:

Copy<br/>
const result =await signingClient.signAndBroadcast(<br/>
alice,\[{<br/>
typeUrl:"/cosmos.bank.v1beta1.MsgSend",<br/>
value:{<br/>
fromAddress: alice,<br/>
toAddress: faucet,<br/>
amount:\[{ denom:"uatom", amount:"100000"},\],},},{<br/>
typeUrl:"/cosmos.staking.v1beta1.MsgDelegate",<br/>
value:{<br/>
delegatorAddress: alice,<br/>
validatorAddress: validator,<br/>
amount:{ denom:"uatom", amount:"1000",},},},\],"auto")

When you create [your own message types in CosmJS](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html), they have to follow this format and be declared in the same fashion.

synopsis

To summarize, this section has explored:

- How to move past the one-transaction-one-recipient limitations of the previous exercise, which could compel a user to sign potentially many transactions at a time, and denies the possibility of sending _atomic_ transactions to multiple recipients (for example, a situation in which either all recipients receive tokens or none of them do).
- How to include two token-transfer messages in a single transaction, and how to combine messages of different types in a single transaction (for example, sending tokens to the faucet _and_ delegating tokens to a validator).

previous

[**Your First CosmJS Actions**](https://tutorials.cosmos.network/tutorials/7-cosmjs/2-first-steps.html)

up next

[**Learn to Integrate Keplr**](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[Send multiple tokens using sendTokens](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#send-multiple-tokens-using-sendtokens)

[Introducing signAndBroadcast](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#introducing-signandbroadcast)

[Token transfer messages](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#token-transfer-messages)

[What is this long string?](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#what-is-this-long-string)

[Multiple token transfer messages](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#multiple-token-transfer-messages)

[Mixing other message types](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#mixing-other-message-types)

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

## Custom Actions

# Create Custom CosmJS Interfaces

In this section, you will:

- Create custom CosmJS interfaces to connect to custom Cosmos SDK modules.
- Define custom interfaces with Protobuf.
- Define custom types and messages.
- Integrate with Ignite - previously known as Starport.

CosmJS comes out of the box with interfaces that connect with the standard Cosmos SDK modules such as bank and gov and understand the way their messages are serialized. Since your own blockchain's modules are unique, they need custom CosmJS interfaces. That process consists of several steps:

1. Creating the Protobuf objects and clients in TypeScript.
2. Creating extensions that facilitate the use of the above clients.
3. Any further level of abstraction that you deem useful for integration.

This section assumes that you have a working Cosmos blockchain with its own modules. It is based on CosmJS version [v0.28.3](https://github.com/cosmos/cosmjs/tree/v0.28.3).

You can choose which library you use to compile your Protobuf objects into TypeScript or JavaScript. Reproducing [what Stargate](https://github.com/cosmos/cosmjs/blob/main/packages/stargate/CUSTOM_PROTOBUF_CODECS.md) or [cosmjs-types](https://github.com/confio/cosmjs-types/blob/main/scripts/codegen.js) do is a good choice.

## Preparation

This exercise assumes that:

1. Your Protobuf definition files are in./proto/myChain.
2. You want to compile them into TypeScript in./client/src/types/generated.

Install protoc on your computer and its Typescript plugin in your project, possibly with the help of a Dockerfile:

- Local

$ mkdir -p /usr/lib/protoc

$ cd /usr/lib/protoc

$ curl -L <https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-linux-x86_64.zip> -o protoc.zip

$ unzip -o protoc.zip

$ rm protoc.zip

$ ln -s /usr/lib/protoc/bin/protoc /usr/local/bin/protoc

$ npm install ts-proto@1.121.6 --save-dev

Adjust to your preferred version, operating system, and CPU platform. For instance, on an Apple M1 you would use protoc-21.7-osx-aarch_64.zip.

- Dockerfile

FROM --platform=linux node:lts-slim as base

ARG BUILDARCH

ENV PROTOC_VERSION=21.7

ENV TS_PROTO_VERSION=1.121.6

FROM base AS platform-amd64

ENV PROTOC_PLATFORM=x86_64

FROM base AS platform-arm64

ENV PROTOC_PLATFORM=aarch_64

FROM platform-${BUILDARCH}

RUN apt-get update

RUN apt-get install curl unzip --yes

# Install ProtoC

RUN mkdir -p /usr/lib/protoc

WORKDIR /usr/lib/protoc

RUN curl -L <https://github.com/protocolbuffers/protobuf/releases/download/v$>{PROTOC_VERSION}/protoc-${PROTOC_VERSION}-linux-${PROTOC_PLATFORM}.zip -o protoc.zip

RUN unzip -o protoc.zip

RUN rm protoc.zip

RUN ln -s /usr/lib/protoc/bin/protoc /usr/local/bin/protoc

# Install Ts-proto

RUN npm install --global ts-proto@${TS_PROTO_VERSION} --save-exact

WORKDIR /

ENTRYPOINT ["protoc"]

Then build the image:

$ docker build. -t ts-protoc

You can confirm the version you received. The executable is located in./node_modules/protoc/protoc/bin/protoc:

- Local

$ protoc --version

- Docker

$ docker run --rm -it \

ts-protoc --version

This returns something like:

libprotoc 3.21.7

The compiler tools are ready. Time to use them.

Create the target folder if it does not exist yet:

$ mkdir -p client/src/types/generated

**Getting third party files**

You need to get the imports that appear in your.proto files. Usually you can find the following in [query.proto](https://github.com/cosmos/cosmos-sdk/blob/d98503b/proto/cosmos/bank/v1beta1/query.proto#L4-L6):

import "cosmos/base/query/v1beta1/pagination.proto";

import "gogoproto/gogo.proto";

import "google/api/annotations.proto";

You need local copies of the right file versions in the right locations. Pay particular attention to Cosmos SDK's version of your project. You can check by running:

$ grep cosmos-sdk go.mod

This returns something like:

github.com/cosmos/cosmos-sdk v0.45.4

Use this version as a tag on Github. One way to retrieve the [pagination file](https://github.com/cosmos/cosmos-sdk/blob/v0.45.4/proto/cosmos/base/query/v1beta1/pagination.proto) is:

$ mkdir -p./proto/cosmos/base/query/v1beta1/

$ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/proto/cosmos/base/query/v1beta1/pagination.proto> -o./proto/cosmos/base/query/v1beta1/pagination.proto

You can do the same for the others, found in the [third_party folder](https://github.com/cosmos/cosmos-sdk/tree/v0.45.4/third_party/proto) under the same version:

$ mkdir -p./proto/google/api

$ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/third_party/proto/google/api/annotations.proto> -o./proto/google/api/annotations.proto

$ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/third_party/proto/google/api/http.proto> -o./proto/google/api/http.proto

$ mkdir -p./proto/gogoproto

$ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/third_party/proto/gogoproto/gogo.proto> -o./proto/gogoproto/gogo.proto

**Compilation**

You can now compile the Protobuf files. To avoid adding all the.proto files manually to the command, use xargs:

- Local

$ ls./proto/myChain | xargs -I {} protoc \

 --plugin="./node_modules/ts-proto/protoc-gen-ts_proto" \

 --ts_proto_out="./client/src/types/generated" \

 --proto_path="./proto" \

 --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=messages" \

myChain/{}

- Docker

$ ls./proto/myChain | xargs -I {} \

docker run --rm -i \

 -v $(pwd):/project -w /project \

ts-protoc \

 --plugin="/usr/local/lib/node_modules/ts-proto/protoc-gen-ts_proto" \

 --ts_proto_out="./client/src/types/generated" \

 --proto_path="./proto" \

 --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=messages" \

myChain/{}

Where /usr/local/lib/node_modules is the result of the query:

$ docker run --rm -it \

 --entrypoint npm \

ts-protoc \

root --global

This shows where ts-proto was installed globally.

--proto_path is only./proto so that your imports (such as import "cosmos/base…) can be found.

You should now see your files compiled into TypeScript. They have been correctly filed under their respective folders and contain both types and services definitions. It also created the compiled versions of your third party imports.

**A note about the result**

Your tx.proto file may have contained the following:

service Msg {

  rpc Send(MsgSend) returns (MsgSendResponse);

  //…

}

If so, you find its service declaration in the compiled tx.ts file:

export interface Msg {

  Send(request: MsgSend): Promise<MsgSendResponse>;

  //…

}

It also appears in the default implementation:

export class MsgClientImpl implements Msg {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {

    this.rpc = rpc;

    this.Send = this.Send.bind(this);

    //…

  }

  Send(request: MsgSend): Promise<MsgSendResponse> {

    const data = MsgSend.encode(request).finish();

    const promise = this.rpc.request("cosmos.bank.v1beta1.Msg", "Send", data);

    return promise.then((data) => MsgSendResponse.decode(new_m0.Reader(data)));

  }

  //…

}

The important points to remember from this are:

1. rpc: RPC is an instance of a Protobuf RPC client that is given to you by CosmJS. Although the interface appears to be [declared locally](https://github.com/confio/cosmjs-types/blob/v0.4.1/src/cosmos/bank/v1beta1/tx.ts#L270-L272), this is the same interface found [throughout CosmJS](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/queryclient/utils.ts#L35-L37). It is given to you [on construction](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/queryclient/queryclient.ts). At this point you do not need an implementation for it.
2. You can see encode and decode in action. Notice the.finish() that flushes the Protobuf writer buffer.
3. The rpc.request makes calls that are correctly understood by the Protobuf compiled server on the other side.

You can find the same structure in [query.ts](https://github.com/confio/cosmjs-types/blob/v0.4.1/src/cosmos/bank/v1beta1/query.ts).

**Proper saving**

Commit the extra.proto files as well as the compiled ones to your repository so you do not need to recreate them.

Take inspiration from cosmjs-types [codegen.sh](https://github.com/confio/cosmjs-types/tree/main/scripts):

1. Create a script file named ts-proto.sh with the previous command, or create a Makefile target.
2. Add an [npm run target](https://github.com/confio/cosmjs-types/blob/c64759a/package.json#L31) with it, to keep track of how this was done and easily reproduce it in the future when you update a Protobuf file.

**Add convenience with types**

CosmJS provides an interface to which all the created types conform, [TsProtoGeneratedType](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/proto-signing/src/registry.ts#L12-L18), which is itself a sub-type of [GeneratedType](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/proto-signing/src/registry.ts#L32). In the same file, note the definition:

export interface EncodeObject {

  readonly typeUrl: string;

  readonly value: any;

}

The typeUrl is the identifier by which Protobuf identifies the type of the data to serialize or deserialize. It is composed of the type's package and its name. For instance (and see also [here](https://github.com/cosmos/cosmos-sdk/blob/3a1027c/proto/cosmos/bank/v1beta1/tx.proto)):

package cosmos.bank.v1beta1;

//…

message MsgSend {

  //…

}

In this case, the MsgSend's type URL is ["/cosmos.bank.v1beta1.MsgSend"](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/modules/bank/messages.ts#L6).

Each of your types is associated like this. You can declare each string as a constant value, such as:

export const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";

Save those along with generated in./client/src/types/modules.

**For messages**

Messages, sub-types of Msg, are assembled into transactions that are then sent to CometBFT. CosmJS types already include types for [transactions](https://github.com/confio/cosmjs-types/blob/v0.4.1/src/cosmos/tx/v1beta1/tx.ts#L12-L26). These are assembled, signed, and sent by the [SigningStargateClient](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/signingstargateclient.ts#L280-L298) of CosmJS.

The Msg kind also needs to be added to a registry. To facilitate that, you should prepare them in a nested array:

export const bankTypes: ReadonlyArray<[string, GeneratedType]> = [

  ["/cosmos.bank.v1beta1.MsgMultiSend", MsgMultiSend],

  ["/cosmos.bank.v1beta1.MsgSend", MsgSend],

];

Add child types to EncodeObject to direct Typescript:

export interface MsgSendEncodeObject extends EncodeObject {

  readonly typeUrl: "/cosmos.bank.v1beta1.MsgSend";

  readonly value: Partial<MsgSend>;

}

In the previous code, you cannot reuse your msgSendTypeUrl because it is a value not a type. You can add a type helper, which is useful in an if else situation:

export function isMsgSendEncodeObject(

  encodeObject: EncodeObject

): encodeObject is MsgSendEncodeObject {

  return (encodeObject as MsgSendEncodeObject).typeUrl ===

    "/cosmos.bank.v1beta1.MsgSend";

}

**For queries**

Queries have very different types of calls. It makes sense to organize them in one place, called an extension. For example:

export interface BankExtension {

  readonly bank: {

    readonly balance: (address: string, denom: string) => Promise<Coin>;

    readonly allBalances: (address: string) => Promise<Coin[]>;

    //…

  };

}

Note that there is a **key** bank: inside it. This becomes important later on when you _add_ it to Stargate.

1. Create an extension interface for your module using function names and parameters that satisfy your needs.
2. It is recommended to make sure that the key is unique and does not overlap with any other modules of your application.
3. Create a factory for its implementation copying the [model here](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/modules/bank/queries.ts#L20-L59). Remember that the [QueryClientImpl](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/modules/bank/queries.ts#L4) implementation must come from your own compiled Protobuf query service.

**Integration with Stargate**

StargateClient and SigningStargateClient are typically the ultimate abstractions that facilitate the querying and sending of transactions. You are now ready to add your own elements to them. The easiest way is to inherit from them and expose the extra functions you require.

If your extra functions map one-for-one with those of your own extension, then you can publicly expose the extension itself to minimize duplication in [StargateClient](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/stargateclient.ts#L143) and [SigningStargateClient](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/signingstargateclient.ts#L109).

For example, if you have your interface MyExtension with a myKey key and you are creating MyStargateClient:

export class MyStargateClient extends StargateClient {

  public readonly myQueryClient: MyExtension | undefined;

  public static async connect(

    endpoint: string,

    options: StargateClientOptions = {}

 ): Promise<MyStargateClient> {

    const tmClient = await Tendermint34Client.connect(endpoint);

    return new MyStargateClient(tmClient, options);

  }

  protected constructor(

    tmClient: Tendermint34Client | undefined,

    options: StargateClientOptions

 ) {

    super(tmClient, options);

    if (tmClient) {

      this.myQueryClient = QueryClient.withExtensions(tmClient, setupMyExtension);

    }

  }

}

You can extend [StargateClientOptions](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/stargateclient.ts#L139-L141) if your own client can receive further options.

You also need to inform MySigningStargateClient about the extra encodable types it should be able to handle. The list is defined in a registry that you can [pass as options](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/signingstargateclient.ts#L139).

Take inspiration from the [SigningStargateClient source code](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/signingstargateclient.ts#L76-L80) itself. Collect your new types into an array:

import { defaultRegistryTypes } from "@cosmjs/stargate";

export const myDefaultRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [

  …defaultRegistryTypes,

  …myTypes, // As you defined bankTypes earlier

];

Taking inspiration from [the same place](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/signingstargateclient.ts#L118-L120), add the registry creator:

function createDefaultRegistry(): Registry {

  return new Registry(myDefaultRegistryTypes);

}

Now you are ready to combine this into your own MySigningStargateClient. It still takes an optional registry, but if that is missing it adds your newly defined default one:

export class MySigningStargateClient extends SigningStargateClient {

  public readonly myQueryClient: MyExtension | undefined;

  public static async connectWithSigner(

    endpoint: string,

    signer: OfflineSigner,

    options: SigningStargateClientOptions = {}

 ): Promise<MySigningStargateClient> {

    const tmClient = await Tendermint34Client.connect(endpoint);

    return new MySigningStargateClient(tmClient, signer, {

      registry: createDefaultRegistry(),

      …options,

    });

  }

  protected constructor(

    tmClient: Tendermint34Client | undefined,

    signer: OfflineSigner,

    options: SigningStargateClientOptions

 ) {

    super(tmClient, signer, options);

    if (tmClient) {

      this.myQueryClient = QueryClient.withExtensions(tmClient, setupMyExtension);

    }

  }

}

You can optionally add dedicated functions that use your own types, modeled on:

public async sendTokens(

  senderAddress: string,

  recipientAddress: string,

  amount: readonly Coin[],

  fee: StdFee | "auto" | number,

  memo = ""

): Promise<DeliverTxResponse> {

  const sendMsg: MsgSendEncodeObject = {

    typeUrl: "/cosmos.bank.v1beta1.MsgSend",

    value: {

      fromAddress: senderAddress,

      toAddress: recipientAddress,

      amount: […amount],

    },

  };

  return this.signAndBroadcast(senderAddress, [sendMsg], fee, memo);

}

Think of your functions as examples of proper use, that other developers can reuse when assembling more complex transactions.

You are ready to import and use this in a server script or a GUI.

If you would like to get started on building your own CosmJS elements on your own checkers game, you can go straight to the exercise in [CosmJS for Your Chain](https://tutorials.cosmos.network/hands-on-exercise/3-cosmjs-adv/) to start from scratch.

More specifically, you can jump to:

- [Create Custom Objects](https://tutorials.cosmos.network/hands-on-exercise/3-cosmjs-adv/1-cosmjs-objects.html), to see how to compile the Protobuf objects.
- [Create Custom Messages](https://tutorials.cosmos.network/hands-on-exercise/3-cosmjs-adv/2-cosmjs-messages.html), to see how to create messages relevant for checkers.
- [Backend Script for Game Indexing](https://tutorials.cosmos.network/hands-on-exercise/3-cosmjs-adv/5-server-side.html), to see how this can be used also to listen to events coming from the blockchain.
- [Integrate CosmJS and Keplr](https://tutorials.cosmos.network/hands-on-exercise/3-cosmjs-adv/4-cosmjs-gui.html), to see how to use and integrate what you prepared into a preexisting Checkers GUI.

**Synopsis**

To summarize, this section has explored:

- How CosmJS's out-of-the-box interfaces understand how messages of standard Cosmos SDK modules are serialized, meaning that your unique modules will require custom CosmJS interfaces of their own.
- How to create the necessary Protobuf objects and clients in Typescript, the extensions that facilitate the use of these clients, and any further level of abstraction that you deem useful for integration.
- How to integrate CosmJS with Ignite's client and signing client, which are typically the ultimate abstractions that facilitate the querying and sending of transactions.

**Next Steps**

- [Learn to Integrate Keplr](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html)
- [Chapter Overview - Understand SDK Modules](https://tutorials.cosmos.network/tutorials/8-understand-sdk-modules/)

## Custom Interfaces

You can choose which library you use to compile your Protobuf objects into TypeScript or JavaScript. Reproducing [what Stargate (opens new window)](https://github.com/cosmos/cosmjs/blob/main/packages/stargate/CUSTOM_PROTOBUF_CODECS.md) or [`cosmjs-types` (opens new window)](https://github.com/confio/cosmjs-types/blob/main/scripts/codegen.js) do is a good choice.

# [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#preparation) Preparation

This exercise assumes that:

1. Your Protobuf definition files are in `./proto/myChain`.
2. You want to compile them into TypeScript in `./client/src/types/generated`.

Install `protoc` on your computer and its Typescript plugin in your project, possibly with the help of a Dockerfile:

---

You can confirm the version you received. The executable is located in `./node_modules/protoc/protoc/bin/protoc`:

This returns something like:

Copy libprotoc 3.21.7

The compiler tools are ready. Time to use them.

Create the target folder if it does not exist yet:

Copy $ mkdir -p client/src/types/generated

# [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#getting-third-party-files) Getting Third Party Files

You need to get the imports that appear in your `.proto` files. Usually you can find the following in [`query.proto` (opens new window)](https://github.com/cosmos/cosmos-sdk/blob/d98503b/proto/cosmos/bank/v1beta1/query.proto#L4-L6):

Copy import "cosmos/base/query/v1beta1/pagination.proto"; import "gogoproto/gogo.proto"; import "google/api/annotations.proto";

You need local copies of the right file versions in the right locations. Pay particular attention to Cosmos SDK's version of your project. You can check by running:

Copy $ grep cosmos-sdk go.mod

This returns something like:

Copy github.com/cosmos/cosmos-sdk v0.45.4

Use this version as a tag on Github. One way to retrieve the [pagination file (opens new window)](https://github.com/cosmos/cosmos-sdk/blob/v0.45.4/proto/cosmos/base/query/v1beta1/pagination.proto) is:

Copy $ mkdir -p./proto/cosmos/base/query/v1beta1/ $ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/proto/cosmos/base/query/v1beta1/pagination.proto> -o./proto/cosmos/base/query/v1beta1/pagination.proto

You can do the same for the others, found in the [`third_party` folder (opens new window)](https://github.com/cosmos/cosmos-sdk/tree/v0.45.4/third_party/proto) under the same version:

Copy $ mkdir -p./proto/google/api $ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/third>\_party/proto/google/api/annotations.proto -o./proto/google/api/annotations.proto $ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/third>\_party/proto/google/api/http.proto -o./proto/google/api/http.proto $ mkdir -p./proto/gogoproto $ curl <https://raw.githubusercontent.com/cosmos/cosmos-sdk/v0.45.4/third>\_party/proto/gogoproto/gogo.proto -o./proto/gogoproto/gogo.proto

# [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#compilation) Compilation

You can now compile the Protobuf files. To avoid adding all the `.proto` files manually to the command, use `xargs`:

---

`--proto_path` is only `./proto` so that your imports (such as `import "cosmos/base…`) can be found.

You should now see your files compiled into TypeScript. They have been correctly filed under their respective folders and contain both types and services definitions. It also created the compiled versions of your third party imports.

# [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#a-note-about-the-result) A Note about the Result

Your `tx.proto` file may have contained the following:

Copy service Msg { rpc Send(MsgSend) returns (MsgSendResponse); }

If so, you find its service declaration in the compiled `tx.ts` file:

Copy export interface Msg { Send(request: MsgSend): Promise<MsgSendResponse\>; }

It also appears in the default implementation:

Copy export class MsgClientImpl implements Msg { private readonly rpc: Rpc; constructor(rpc: Rpc) { this.rpc \= rpc; this.Send \= this.Send.bind(this); } Send(request: MsgSend): Promise<MsgSendResponse\> { const data \= MsgSend.encode(request).finish(); const promise \= this.rpc.request("cosmos.bank.v1beta1.Msg", "Send", data); return promise.then((data) \=> MsgSendResponse.decode(new \_m0.Reader(data))); } }

The important points to remember from this are:

1. `rpc: RPC` is an instance of a Protobuf RPC client that is given to you by CosmJS. Although the interface appears to be [declared locally (opens new window)](https://github.com/confio/cosmjs-types/blob/v0.4.1/src/cosmos/bank/v1beta1/tx.ts#L270-L272), this is the same interface found [throughout CosmJS (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/queryclient/utils.ts#L35-L37). It is given to you [on construction (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/queryclient/queryclient.ts). At this point you do not need an implementation for it.
2. You can see `encode` and `decode` in action. Notice the `.finish()` that flushes the Protobuf writer buffer.
3. The `rpc.request` makes calls that are correctly understood by the Protobuf compiled server on the other side.

You can find the same structure in [`query.ts` (opens new window)](https://github.com/confio/cosmjs-types/blob/v0.4.1/src/cosmos/bank/v1beta1/query.ts).

# [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#proper-saving) Proper saving

Commit the extra `.proto` files as well as the compiled ones to your repository so you do not need to recreate them.

Take inspiration from `cosmjs-types` [`codegen.sh` (opens new window)](https://github.com/confio/cosmjs-types/tree/main/scripts):

1. Create a script file named `ts-proto.sh` with the previous command, or create a `Makefile` target.
2. Add an [npm run target (opens new window)](https://github.com/confio/cosmjs-types/blob/c64759a/package.json#L31) with it, to keep track of how this was done and easily reproduce it in the future when you update a Protobuf file.

# [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#add-convenience-with-types) Add Convenience with Types

CosmJS provides an interface to which all the created types conform, [`TsProtoGeneratedType` (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/proto-signing/src/registry.ts#L12-L18), which is itself a sub-type of [`GeneratedType` (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/proto-signing/src/registry.ts#L32). In the same file, note the definition:

Copy export interface EncodeObject { readonly typeUrl: string; readonly value: any; }

The `typeUrl` is the identifier by which Protobuf identifies the type of the data to serialize or deserialize. It is composed of the type's package and its name. For instance (and see also [here (opens new window)](https://github.com/cosmos/cosmos-sdk/blob/3a1027c/proto/cosmos/bank/v1beta1/tx.proto)):

Copy package cosmos.bank.v1beta1; message MsgSend { }

In this case, the `MsgSend`'s type URL is [`"/cosmos.bank.v1beta1.MsgSend"` (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/modules/bank/messages.ts#L6).

Each of your types is associated like this. You can declare each string as a constant value, such as:

Copy export const msgSendTypeUrl \= "/cosmos.bank.v1beta1.MsgSend";

Save those along with `generated` in `./client/src/types/modules`.

## [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#for-messages) For Messages

Messages, sub-types of `Msg`, are assembled into transactions that are then sent to CometBFT. CosmJS types already include types for [transactions (opens new window)](https://github.com/confio/cosmjs-types/blob/v0.4.1/src/cosmos/tx/v1beta1/tx.ts#L12-L26). These are assembled, signed, and sent by the [`SigningStargateClient` (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/signingstargateclient.ts#L280-L298) of CosmJS.

The `Msg` kind also needs to be added to a registry. To facilitate that, you should prepare them in a nested array:

Copy export const bankTypes: ReadonlyArray<\[string, GeneratedType\]\> \= \[\["/cosmos.bank.v1beta1.MsgMultiSend", MsgMultiSend\], \["/cosmos.bank.v1beta1.MsgSend", MsgSend\], \];

Add child types to `EncodeObject` to direct Typescript:

Copy export interface MsgSendEncodeObject extends EncodeObject { readonly typeUrl: "/cosmos.bank.v1beta1.MsgSend"; readonly value: Partial<MsgSend\>; }

In the previous code, you cannot reuse your `msgSendTypeUrl` because it is a value not a type. You can add a type helper, which is useful in an `if else` situation:

Copy export function isMsgSendEncodeObject(encodeObject: EncodeObject): encodeObject is MsgSendEncodeObject { return (encodeObject as MsgSendEncodeObject).typeUrl \=== "/cosmos.bank.v1beta1.MsgSend"; }

## [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html#for-queries) For Queries

Queries have very different types of calls. It makes sense to organize them in one place, called an extension. For example:

Copy export interface BankExtension { readonly bank: { readonly balance: (address: string, denom: string) \=> Promise<Coin\>; readonly allBalances: (address: string) \=> Promise<Coin\[\]\>; }; }

Note that there is a **key** `bank:` inside it. This becomes important later on when you _add_ it to Stargate.

1. Create an extension interface for your module using function names and parameters that satisfy your needs.
2. It is recommended to make sure that the key is unique and does not overlap with any other modules of your application.
3. Create a factory for its implementation copying the [model here (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/modules/bank/queries.ts#L20-L59). Remember that the [`QueryClientImpl` (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.3/packages/stargate/src/modules/bank/queries.ts#L4) implementation must come from your own compiled Protobuf query service.

## Kepler Integration

By using this website, you agree to our [Cookie Policy](https://www.cookiesandyou.com/).

Filters

On this page

[Creating your simple Next.js project](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#creating-your-simple-next-js-project)

[HTML elements](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#html-elements)

[Installing CosmJS](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#installing-cosmjs)

[Displaying information without user input](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#displaying-information-without-user-input)

[Getting testnet tokens](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#getting-testnet-tokens)

[Detecting Keplr](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#detecting-keplr)

[Prepare Keplr](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#prepare-keplr)

[Your address and balance](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#your-address-and-balance)

[With a locally running chain](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#with-a-locally-running-chain)

# [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#learn-to-integrate-keplr) Learn to Integrate Keplr

249 min read

Tutorial

CosmJS

DevOps

![](https://tutorials.cosmos.network/hi-target-icon.svg)

Build applications that interact with the Keplr browser extension.

In this section, you will learn more about:

- Detecting Keplr.
- Getting chain information.
- Working with the user interaction flow.

CosmJS allows you to connect with [Keplr(opens new window)](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap), the widely used browser extension, to manage your private keys. In a previous section you used the command-line and CosmJS to issue commands to the Cosmos Hub Testnet. In this tutorial, you are working on a browser application that interacts with the Keplr extension.

You will again connect to the Cosmos Hub Testnet. Optionally, connect to your locally running Cosmos blockchain using `simapp` as explained [before](https://tutorials.cosmos.network/tutorials/7-cosmjs/2-first-steps.html).

To keep the focus on CosmJS and Keplr, you are going to use ready-made pages created by the Next.js framework. Do not worry if you routinely use another framework, the CosmJS-specific code in this tutorial can be applied similarly in Angular, Vue, and other frameworks.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#creating-your-simple-next-js-project) Creating Your Simple Next.js Project

In your project folder create the ready-made Next.js app, which automatically places it in a subfolder for you. This follows [the docs(opens new window)](https://nextjs.org/docs):

- Local
- Docker

Copy<br/>
$ npx create-next-app@13.2.4 --typescript

Copy<br/>
$ docker run --rm -it<br/>
-v $(pwd):/root -w /root<br/>
node:lts-slim<br/>
npx create-next-app@13.2.4 --typescript

Which guides you with:

Copy<br/>
…<br/>
? What is your project named? ' cosmjs-keplr

Be sure to keep the default choices for the other questions. In particular, keep the `No` default when asked whether to _use the experimental `app/` directory_.

This created a new `cosmjs-keplr` folder, so open it. There you can find a `/pages` folder, which contains an `index.tsx`. That's your first page.

Run it, in the `cosmjs-keplr` folder:

- Local
- Docker

Copy<br/>
$ npm run dev

Copy<br/>
$ docker run --rm -it<br/>
-v $(pwd):/cosmjs-keplr -w /cosmjs-keplr<br/>
-p 0.0.0.0:3000:3000<br/>
node:lts-slim<br/>
npm run dev

Which returns:

Copy<br/>
ready - started server on 0.0.0.0:3000, url: <http://localhost:3000><br/>
…

You should see the result, a welcome page with links, in your browser by visiting [http://localhost:3000(opens new window)](http://localhost:3000/). Next.js uses [React(opens new window)](https://reactjs.org/) under the hood.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#html-elements) HTML Elements

The goal of the exercise is to find token balances, yours and the faucet's, and then send some tokens back to the faucet. Before introducing any CosmJS, you can already create a React component that includes the basic user interface that you need. By convention, create a `/components` folder and then copy the following code inside a new file called `FaucetSender.tsx`:

FaucetSender.tsx

Copy<br/>
import{ ChangeEvent, Component, MouseEvent }from"react"import styles from'../styles/Home.module.css'interfaceFaucetSenderState{<br/>
denom:string<br/>
faucetBalance:string<br/>
myAddress:string<br/>
myBalance:string<br/>
toSend:string}exportinterfaceFaucetSenderProps{<br/>
faucetAddress:string<br/>
rpcUrl:string}exportclassFaucetSenderextendsComponent<FaucetSenderProps, FaucetSenderState>{// Set the initial stateconstructor(props:FaucetSenderProps){super(props)this.state ={<br/>
denom:"Loading…",<br/>
faucetBalance:"Loading…",<br/>
myAddress:"Click first",<br/>
myBalance:"Click first",<br/>
toSend:"0",}}// Store changed token amount to stateonToSendChanged=(e: ChangeEvent<HTMLInputElement>)=>this.setState({<br/>
toSend: e.currentTarget.value<br/>
})// When the user clicks the "send to faucet button"onSendClicked=async(e: MouseEvent<HTMLButtonElement>)=>{alert("TODO")}// The render function that draws the component at init and at state changerender(){const{ denom, faucetBalance, myAddress, myBalance, toSend }=this.state<br/>
const{ faucetAddress }=this.props<br/>
console.log(toSend)// The web page structure itselfreturn<div><div className={styles.description}><br/>
Send back to the faucet

</div><fieldset className={styles.card}><legend>Faucet</legend><p>Address:{faucetAddress}</p><p>Balance:{faucetBalance}</p></fieldset><fieldset className={styles.card}><legend>You</legend><p>Address:{myAddress}</p><p>Balance:{myBalance}</p></fieldset><fieldset className={styles.card}><legend>Send</legend><p>To faucet:</p><input value={toSend} type="number" onChange={this.onToSendChanged}/>{denom}<button onClick={this.onSendClicked}>Send to faucet</button></fieldset></div>}}

![](https://tutorials.cosmos.network/hi-note-icon.svg)

The **properties** of `FaucetSender.tsx` only contain the things it knows at build time. It keeps a **state**, and this state is either updated by the user or after a fetch. It reuses a default style you can find in `/styles`.

The component is still unused. You do not need the default page that comes with create-next-app, so you can replace the contents of `index.tsx` with the following code that imports the new component:

Copy<br/>
importtype{ NextPage }from'next'import{ FaucetSender }from'../components/FaucetSender'const Home:NextPage=()=>{return<FaucetSender<br/>
faucetAddress="cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he"<br/>
rpcUrl="https://rpc.sentry-01.theta-testnet.polypore.xyz"/>}exportdefault Home

The faucet address was found in the [previous section](https://tutorials.cosmos.network/tutorials/7-cosmjs/2-first-steps.html), as well as the RPC endpoint that connects to the Cosmos Hub Testnet.

When `npm run dev` picks up the changes, you should see that your page has changed to what you created. In particular, it alerts you with "TODO" when you click on the button.

Your page is not very useful yet, make it more so.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#installing-cosmjs) Installing CosmJS

Now that you have a working Next.js project and ready page, it is time to add the necessary CosmJS elements to the project:

- Local
- Docker

Copy<br/>
$ npm install<br/>
@cosmjs/stargate@v0.28.2 cosmjs-types@v0.4.1<br/>
--save-exact

Copy<br/>
$ docker run --rm -it<br/>
-v $(pwd):/cosmjs-keplr -w /cosmjs-keplr<br/>
node:lts-slim<br/>
npm install<br/>
@cosmjs/stargate@v0.28.2 cosmjs-types@v0.4.1<br/>
--save-exact

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#displaying-information-without-user-input) Displaying Information without User Input

When building a user interface, it is good practice to not ask your user's address until it becomes necessary (e.g. if they click a relevant button). You should start by showing information that is knowable without user input. In this case, this is the token `denom` (denomination) and the faucet's balance. Add the following function that gets the balance from the faucet and place it above the `onToSendChanged` function inside `FaucetSender.tsx`:

Copy<br/>
+// Get the faucet's balance+updateFaucetBalance=async(client: StargateClient)=>{+const balances:readonly Coin\[\]=await client.getAllBalances(+this.props.faucetAddress<br/>
+)+const first: Coin = balances\[0\]+this.setState({+ denom: first.denom,+ faucetBalance: first.amount,+})+} onToSendChanged =(e: ChangeEvent<HTMLInputElement>)…

Note that it only cares about the first coin type stored in `balances[0]`: this is to keep the exercise simple, but there could be multiple coins in that array of balances. It extracts the `denom`, which is then displayed to the user as the unit to transfer. Add the denom that in the constructor as well so that it runs on load via another specific function:

Copy<br/>
constructor(props:FaucetSenderProps){…+setTimeout(this.init,500)}+init=async()=>this.updateFaucetBalance(+await StargateClient.connect(this.props.rpcUrl)+) updateFaucetBalance =async(client: StargateClient)…

The call to `setTimeout` is so that `init` is _not_ launched on the same pass as the constructor.

After `run dev` picks the changes, you should see that your page starts showing the relevant information.

Now, add elements that handle your user's information.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#getting-testnet-tokens) Getting Testnet Tokens

Refer to the previous section on how to [get Cosmos Hub Testnet tokens](https://tutorials.cosmos.network/tutorials/7-cosmjs/2-first-steps.html). This time you should use your Keplr address. If you have not set up one yet, do so now. Your Cosmos Hub Testnet address is the same one that Keplr shows you for the Cosmos Hub mainnet.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#detecting-keplr) Detecting Keplr

Following [Keplr's documentation(opens new window)](https://docs.keplr.app/api/#how-to-detect-keplr), it is time to add a function to see if Keplr is installed on the browser. For convenience and type hinting, install the Typescript Keplr types from within the folder of your project:

- Local
- Docker

Copy<br/>
$ npm install @keplr-wallet/types@0.11.51<br/>
--save-dev --save-exact

Copy<br/>
$ docker run --rm -it<br/>
-v $(pwd):/cosmjs-keplr -w /cosmjs-keplr<br/>
node:lts-slim<br/>
npm install @keplr-wallet/types@0.11.51<br/>
--save-dev --save-exact

After this package is installed, inform Typescript that `window` may have a `.keplr` field with the help of [this helper(opens new window)](https://github.com/chainapsis/keplr-wallet/tree/master/docs/api#keplr-specific-features), by adding it below your imports to `FaucetSender.tsx`:

Copy<br/>
import{ Window as KeplrWindow }from"@keplr-wallet/types";declare global {interfaceWindowextendsKeplrWindow{}}

Detecting Keplr can be done at any time, but to keep the number of functions low for this exercise do it in `onSendClicked`. You want to avoid detecting Keplr on page load if not absolutely necessary. This is generally considered bad user experience for users who might just want to browse your page and not interact with it. Replace the `onSendClicked` with the following:

Copy<br/>
onSendClicked=async(e: MouseEvent<HTMLButtonElement>)=>{-alert("TODO")+const{ keplr }= window<br/>
+if(!keplr){+alert("You need to install or unlock Keplr")+return+}}

Hopefully, when you click on the button it does not show an alert. It does not do anything else either. As an optional confirmation, if you disable Keplr from Chrome's extension manager, when you click the button the page tells you to install it.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#prepare-keplr) Prepare Keplr

Keplr is now detected. By default, Keplr lets its users only connect to the blockchains it knows about. Unfortunately, the Cosmos Hub Testnet is not one of them, but there is a feature where you can instruct it to handle any Cosmos blockchain, provided you give its parameters. Here is [an example(opens new window)](https://github.com/chainapsis/keplr-example/blob/master/src/main.js). In the case of Cosmos Hub Testnet, these parameters are available, as mentioned on the [testnet page(opens new window)](https://github.com/cosmos/testnets/tree/master/public#add-to-keplr). Add a new function for them as shown in the expandable box:

getTestnetChainInfo

Copy<br/>
getTestnetChainInfo =(): ChainInfo =>({<br/>
chainId:"theta-testnet-001",<br/>
chainName:"theta-testnet-001",<br/>
rpc:"https://rpc.sentry-01.theta-testnet.polypore.xyz/",<br/>
rest:"https://rest.sentry-01.theta-testnet.polypore.xyz/",<br/>
bip44:{<br/>
coinType:118,},<br/>
bech32Config:{<br/>
bech32PrefixAccAddr:"cosmos",<br/>
bech32PrefixAccPub:"cosmos"+"pub",<br/>
bech32PrefixValAddr:"cosmos"+"valoper",<br/>
bech32PrefixValPub:"cosmos"+"valoperpub",<br/>
bech32PrefixConsAddr:"cosmos"+"valcons",<br/>
bech32PrefixConsPub:"cosmos"+"valconspub",},<br/>
currencies:\[{<br/>
coinDenom:"ATOM",<br/>
coinMinimalDenom:"uatom",<br/>
coinDecimals:6,<br/>
coinGeckoId:"cosmos",},{<br/>
coinDenom:"THETA",<br/>
coinMinimalDenom:"theta",<br/>
coinDecimals:0,},{<br/>
coinDenom:"LAMBDA",<br/>
coinMinimalDenom:"lambda",<br/>
coinDecimals:0,},{<br/>
coinDenom:"RHO",<br/>
coinMinimalDenom:"rho",<br/>
coinDecimals:0,},{<br/>
coinDenom:"EPSILON",<br/>
coinMinimalDenom:"epsilon",<br/>
coinDecimals:0,},\],<br/>
feeCurrencies:\[{<br/>
coinDenom:"ATOM",<br/>
coinMinimalDenom:"uatom",<br/>
coinDecimals:6,<br/>
coinGeckoId:"cosmos",<br/>
gasPriceStep:{<br/>
low:1,<br/>
average:1,<br/>
high:1,},},\],<br/>
stakeCurrency:{<br/>
coinDenom:"ATOM",<br/>
coinMinimalDenom:"uatom",<br/>
coinDecimals:6,<br/>
coinGeckoId:"cosmos",},<br/>
coinType:118,<br/>
features:\["stargate","ibc-transfer","no-legacy-stdTx"\],})

You need to add another import from the `@keplr-wallet` package so that your script understands what `ChainInfo` is:

Copy<br/>
-import{ Window as KeplrWindow }from"@keplr-wallet/types"+import{ ChainInfo, Window as KeplrWindow }from"@keplr-wallet/types"

Note that it mentions the `chainId: "theta-testnet-001"`. In effect, this adds the Cosmos Hub Testnet to Keplr's registry of blockchains, under the label `theta-testnet-001`. Whenever you want to prompt the user to add the Cosmos Hub Testnet to Keplr, add the line:

Copy<br/>
await window.keplr!.experimentalSuggestChain(this.getTestnetChainInfo())

This needs to be done once, which in this case is in the `onSendClicked` function after having detected Keplr, but repeating the line elsewhere is generally not a problem.

Keplr is now detected and prepared. Now try to do something useful with the user's information.

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#your-address-and-balance) Your Address and Balance

In `onSendClicked`, similar to the previous section, you can:

1. Prepare Keplr, with `keplr.experimentalSuggestChain`.
2. Get the signer for your user's accounts, with `KeplrWindow`'s `window.getOfflineSigner`.
3. Create your signing client.
4. Get the address and balance of your user's first account.
5. Send the requested coins to the faucet.
6. Inform and update.

In practice, the code for `onSendClicked` looks like this:

Copy<br/>
onSendClicked=async(e: MouseEvent<HTMLButtonElement>)=>{// Detect Keplrconst{ keplr }= window<br/>
if(!keplr){alert("You need to install Keplr")return}// Get the current state and amount of tokens that we want to transferconst{ denom, toSend }=this.state<br/>
const{ faucetAddress, rpcUrl }=this.props<br/>
// Suggest the testnet chain to Keplrawait keplr.experimentalSuggestChain(this.getTestnetChainInfo())// Create the signing clientconst offlineSigner =<br/>
window.getOfflineSigner!("theta-testnet-001")const signingClient =await SigningStargateClient.connectWithSigner(<br/>
rpcUrl,<br/>
offlineSigner,)// Get the address and balance of your userconst account: AccountData =(await offlineSigner.getAccounts())\[0\]this.setState({<br/>
myAddress: account.address,<br/>
myBalance:(await signingClient.getBalance(account.address, denom)).amount,})// Submit the transaction to send tokens to the faucetconst sendResult =await signingClient.sendTokens(<br/>
account.address,<br/>
faucetAddress,\[{<br/>
denom: denom,<br/>
amount: toSend,},\],{<br/>
amount:\[{ denom:"uatom", amount:"500"}\],<br/>
gas:"200000",},)// Print the result to the consoleconsole.log(sendResult)// Update the balance in the user interfacethis.setState({<br/>
myBalance:(await signingClient.getBalance(account.address, denom)).amount,<br/>
faucetBalance:(await signingClient.getBalance(faucetAddress, denom)).amount,})}

![](https://tutorials.cosmos.network/hi-note-icon.svg)

Keplr is only tasked with signing transactions. The transactions are broadcast with the RPC endpoint of your choice.

Now run the full script. In the refreshed page, enter an amount of `uatom` (for example `1000000`) and click `Send to faucet`. A number of events happen:

1. Keplr asks for confirmation that you agree to add the testnet network. It does not install any network without your approval, as that would be a security risk. It asks this only the first time you add a given network, which is why doing it in `onSendClicked` is harmless.<br/>
   ![](https://tutorials.cosmos.network/resized-images/1200/tutorials/7-cosmjs/images/keplr_testnet_addition.png)
2. Keplr asks whether you agree to share your account information, because this involves a potential security risk. Again, it asks this only once per web page + network combination.<br/>
   ![](https://tutorials.cosmos.network/resized-images/1200/tutorials/7-cosmjs/images/keplr_share_account.png)
3. Your address and balance fields are updated and visible.
4. Keplr asks whether you agree to sign the transaction, a very important action that requires approval **every time**.<br/>
   ![](https://tutorials.cosmos.network/resized-images/1200/tutorials/7-cosmjs/images/keplr_send_to_faucet.png)

After this is done, your balance updates again, and in the browser console you see the transaction result.

If you want to double check if you got everything right, you can find the full component's code in the expandable box below:

Final FaucetSender.tsx file

Copy<br/>
import{ Coin, SigningStargateClient, StargateClient }from"@cosmjs/stargate"import{ AccountData, OfflineSigner }from"@cosmjs/proto-signing"import{ ChainInfo, Window as KeplrWindow }from"@keplr-wallet/types"import{ ChangeEvent, Component, MouseEvent }from"react"import styles from"../styles/Home.module.css"declare global {interfaceWindowextendsKeplrWindow{}}interfaceFaucetSenderState{<br/>
denom:string<br/>
faucetBalance:string<br/>
myAddress:string<br/>
myBalance:string<br/>
toSend:string}exportinterfaceFaucetSenderProps{<br/>
faucetAddress:string<br/>
rpcUrl:string}exportclassFaucetSenderextendsComponent<<br/>
FaucetSenderProps,<br/>
FaucetSenderState

> {// Set the initial stateconstructor(props: FaucetSenderProps){super(props)this.state ={<br/>
> denom:"Loading…",<br/>
> faucetBalance:"Loading…",<br/>
> myAddress:"Click first",<br/>
> myBalance:"Click first",<br/>
> toSend:"0",}setTimeout(this.init,500)}// Connecting to the endpoint to fetch the faucet balanceinit=async()=>this.updateFaucetBalance(await StargateClient.connect(this.props.rpcUrl),)// Get the faucet's balanceupdateFaucetBalance=async(client: StargateClient)=>{const balances:readonly Coin\[\]=await client.getAllBalances(this.props.faucetAddress,)const first: Coin = balances\[0\]this.setState({<br/>
> denom: first.denom,<br/>
> faucetBalance: first.amount,})}// Store changed token amount to stateonToSendChanged=(e: ChangeEvent<HTMLInputElement>)=>this.setState({<br/>
> toSend: e.currentTarget.value,})// When the user clicks the "send to faucet button"onSendClicked=async(e: MouseEvent<HTMLButtonElement>)=>{// Detect Keplrconst{ keplr }= window<br/>
> if(!keplr){alert("You need to install Keplr")return}// Get the current state and amount of tokens that we want to transferconst{ denom, toSend }=this.state<br/>
> const{ faucetAddress, rpcUrl }=this.props<br/>
> // Suggest the testnet chain to Keplrawait keplr.experimentalSuggestChain(this.getTestnetChainInfo())// Create the signing clientconst offlineSigner: OfflineSigner =<br/>
> window.getOfflineSigner!("theta-testnet-001")const signingClient =await SigningStargateClient.connectWithSigner(<br/>
> rpcUrl,<br/>
> offlineSigner,)// Get the address and balance of your userconst account: AccountData =(await offlineSigner.getAccounts())\[0\]this.setState({<br/>
> myAddress: account.address,<br/>
> myBalance:(await signingClient.getBalance(account.address, denom)).amount,})// Submit the transaction to send tokens to the faucetconst sendResult =await signingClient.sendTokens(<br/>
> account.address,<br/>
> faucetAddress,\[{<br/>
> denom: denom,<br/>
> amount: toSend,},\],{<br/>
> amount:\[{ denom:"uatom", amount:"500"}\],<br/>
> gas:"200000",},)// Print the result to the consoleconsole.log(sendResult)// Update the balance in the user interfacethis.setState({<br/>
> myBalance:(await signingClient.getBalance(account.address, denom)).amount,<br/>
> faucetBalance:(await signingClient.getBalance(faucetAddress, denom)).amount,})}// The Cosmos Hub Testnet chain parameters<br/>
> getTestnetChainInfo =(): ChainInfo =>({<br/>
> chainId:"theta-testnet-001",<br/>
> chainName:"theta-testnet-001",<br/>
> rpc:"https://rpc.sentry-01.theta-testnet.polypore.xyz/",<br/>
> rest:"https://rest.sentry-01.theta-testnet.polypore.xyz/",<br/>
> bip44:{<br/>
> coinType:118,},<br/>
> bech32Config:{<br/>
> bech32PrefixAccAddr:"cosmos",<br/>
> bech32PrefixAccPub:"cosmos"+"pub",<br/>
> bech32PrefixValAddr:"cosmos"+"valoper",<br/>
> bech32PrefixValPub:"cosmos"+"valoperpub",<br/>
> bech32PrefixConsAddr:"cosmos"+"valcons",<br/>
> bech32PrefixConsPub:"cosmos"+"valconspub",},<br/>
> currencies:\[{<br/>
> coinDenom:"ATOM",<br/>
> coinMinimalDenom:"uatom",<br/>
> coinDecimals:6,<br/>
> coinGeckoId:"cosmos",},{<br/>
> coinDenom:"THETA",<br/>
> coinMinimalDenom:"theta",<br/>
> coinDecimals:0,},{<br/>
> coinDenom:"LAMBDA",<br/>
> coinMinimalDenom:"lambda",<br/>
> coinDecimals:0,},{<br/>
> coinDenom:"RHO",<br/>
> coinMinimalDenom:"rho",<br/>
> coinDecimals:0,},{<br/>
> coinDenom:"EPSILON",<br/>
> coinMinimalDenom:"epsilon",<br/>
> coinDecimals:0,},\],<br/>
> feeCurrencies:\[{<br/>
> coinDenom:"ATOM",<br/>
> coinMinimalDenom:"uatom",<br/>
> coinDecimals:6,<br/>
> coinGeckoId:"cosmos",<br/>
> gasPriceStep:{<br/>
> low:1,<br/>
> average:1,<br/>
> high:1,},},\],<br/>
> stakeCurrency:{<br/>
> coinDenom:"ATOM",<br/>
> coinMinimalDenom:"uatom",<br/>
> coinDecimals:6,<br/>
> coinGeckoId:"cosmos",},<br/>
> coinType:118,<br/>
> features:\["stargate","ibc-transfer","no-legacy-stdTx"\],})// The render function that draws the component at init and at state changerender(){const{ denom, faucetBalance, myAddress, myBalance, toSend }=this.state<br/>
> const{ faucetAddress }=this.props<br/>
> // The web page structure itselfreturn(<div><div className={styles.description}><br/>
> Send back to the faucet

</div><fieldset className={styles.card}><legend>Faucet</legend><p>Address:{faucetAddress}</p><p>Balance:{faucetBalance}</p></fieldset><fieldset className={styles.card}><legend>You</legend><p>Address:{myAddress}</p><p>Balance:{myBalance}</p></fieldset><fieldset className={styles.card}><legend>Send</legend><p>To faucet:</p><input
value={toSend}
type="number"
onChange={this.onToSendChanged}/>{" "}{denom}<button onClick={this.onSendClicked}>Send to faucet</button></fieldset></div>)}}

## [\#](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#with-a-locally-running-chain) With a Locally Running Chain

What if you wanted to experiment with your own chain while in development?

Keplr does not know about locally running chains by default. As you did with Cosmos Hub Testnet, you must inform Keplr about your chain: change `ChainInfo` to match the information about your chain, and change `rpcUrl` so that it points to your local port.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

If you would like to get started on integrating Keplr into your own checkers game, you can go straight to the related exercise in [CosmJS for Your Chain](https://tutorials.cosmos.network/hands-on-exercise/3-cosmjs-adv/) to start from scratch.

More specifically, you can jump to:

- [Integrate CosmJS and Keplr](https://tutorials.cosmos.network/hands-on-exercise/3-cosmjs-adv/4-cosmjs-gui.html), for a more elaborate integration between Keplr, CosmJS, custom messages, and a pre-existing Checkers GUI.

synopsis

To summarize, this section has explored:

- How to use CosmJS to connect with Keplr, a browser extension widely used to manage private keys, to find your token balance and that of the faucet and then send some tokens back to the faucet.
- How to create a simple app in the Next.js framework for the purposes of performing the exercise, though the CosmJS-specific code is also applicable to Angular, Vue, and other frameworks.
- Best practices regarding when and when not to ask for your user's address, such as limiting your user interface to only showing information that is knowable without user input until making a request is absolutely necessary.
- How to add a function to detect whether or not Keplr is installed on the browser, also minimizing the occasions when information requests are made in line with best practices.
- How to prepare Keplr to handle any Cosmos blockchain (or for use with locally running chains, such as during development) by providing it with the necessary parameters for a specific chain, before experimenting with accessing useful information from the chain.

previous

[**Compose Complex Transactions**](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html)

up next

[**Create Custom CosmJS Interfaces**](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html)

Rate this Page

![icon smile](https://tutorials.cosmos.network/assets/img/feedback-icon-good.288f8b1c.svg)

![icon meh](https://tutorials.cosmos.network/assets/img/feedback-icon-medium.30d3e67a.svg)

![icon frown](https://tutorials.cosmos.network/assets/img/feedback-icon-bad.2f090da1.svg)

Would you like to add a message?

Submit

Thank you for your Feedback!

On this page

[Creating your simple Next.js project](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#creating-your-simple-next-js-project)

[HTML elements](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#html-elements)

[Installing CosmJS](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#installing-cosmjs)

[Displaying information without user input](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#displaying-information-without-user-input)

[Getting testnet tokens](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#getting-testnet-tokens)

[Detecting Keplr](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#detecting-keplr)

[Prepare Keplr](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#prepare-keplr)

[Your address and balance](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#your-address-and-balance)

[With a locally running chain](https://tutorials.cosmos.network/tutorials/7-cosmjs/4-with-keplr.html#with-a-locally-running-chain)

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

## Multi-Stage Txs

## [Compose Complex Transactions | Developer Portal](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html)

![](https://tutorials.cosmos.network/hi-target-icon.svg)

In the Interchain, a transaction is able to encapsulate multiple messages.

In this section, you will:

- Send multiple tokens in a single transaction.
- Sign and broadcast.
- Assemble multiple messages.

### [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#send-multiple-tokens-using-sendtokens) Send Multiple Tokens Using `sendTokens`

In the [previous exercise](https://tutorials.cosmos.network/tutorials/7-cosmjs/2-first-steps.html), you had Alice send tokens back to the faucet. To refresh your memory, this is what the `sendTokens` function takes as input:

Copy public async sendTokens(senderAddress: string, recipientAddress: string, amount: readonly Coin\[\], fee: StdFee | "auto" | number, memo \= "",): Promise<DeliverTxResponse\>;

[`Coin` (opens new window)](https://github.com/confio/cosmjs-types/blob/a14662d/src/cosmos/base/v1beta1/coin.ts#L13-L16) allows Alice to send not just `stake` but also any number of other coins as long as she owns them. So she can:

However, there are limitations with this function. First, Alice **can only target a single recipient per transaction**, `faucet` in the previous examples. If she wants to send tokens to multiple recipients, then she needs to create as many transactions as there are recipients. Multiple transactions cost slightly more than packing transfers into the array because of transaction overhead. Additionally, in some cases it is considered a bad user experience to make users sign multiple transactions.

The second limitation is that **separate transfers are not atomic**. It is possible that Alice wants to send tokens to two recipients and it is important that either they both receive them or neither of them receive anything.

Fortunately, there is a way to atomically send tokens to multiple recipients.

### [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#introducing-signandbroadcast) Introducing `signAndBroadcast`

`SigningStargateClient` has the `signAndBroadcast` function:

Copy public async signAndBroadcast(signerAddress: string, messages: readonly EncodeObject\[\], fee: StdFee | "auto" | number, memo \= "",): Promise<DeliverTxResponse\>;

The basic components of a transaction are the `signerAddress`, the `messages` that it contains, as well as the `fee` and an optional `memo`. As such, [Cosmos transactions](https://tutorials.cosmos.network/academy/2-cosmos-concepts/3-transactions.html) can indeed be composed of multiple [messages](https://tutorials.cosmos.network/academy/2-cosmos-concepts/4-messages.html).

### [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#token-transfer-messages) Token Transfer Messages

In order to use `signAndBroadcast` to send tokens, you need to figure out what messages go into the `messages: readonly EncodeObject[]`. Examine the `sendTokens` function body:

Copy const sendMsg: MsgSendEncodeObject \= { typeUrl: "/cosmos.bank.v1beta1.MsgSend", value: { fromAddress: senderAddress, toAddress: recipientAddress, amount: \[…amount\], }, }; return this.signAndBroadcast(senderAddress, \[sendMsg\], fee, memo);

Therefore, when sending back to the faucet, instead of calling:

Copy const result \= await signingClient.sendTokens(alice, faucet, \[{ denom: "uatom", amount: "100000" }\], { amount: \[{ denom: "uatom", amount: "500" }\], gas: "200000", },)

Alice may as well call:

Copy const result \= await signingClient.signAndBroadcast(alice, \[{ typeUrl: "/cosmos.bank.v1beta1.MsgSend", value: { fromAddress: alice, toAddress: faucet, amount: \[{ denom: "uatom", amount: "100000" }, \], }, }, \], { amount: \[{ denom: "uatom", amount: "500" }\], gas: "200000", },)

Confirm this by making the change in your `experiment.ts` from the previous section, and running it again.

![](https://tutorials.cosmos.network/hi-star-icon.svg)

Building a transaction in this way is recommended. `SigningStargateClient` offers you convenience methods such as `sendTokens` for simple use cases, and to demonstrate how to build messages.

![](https://tutorials.cosmos.network/hi-tip-icon.svg)

If you are wondering whether there could be any legitimate situation where the transaction's signer (here `alice`) could ever be different from the message's `fromAddress` (here `alice` too), then have a look at the [tutorial on authz](https://tutorials.cosmos.network/tutorials/8-understand-sdk-modules/1-authz.html).

### [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#what-is-this-long-string) What is This long String?

As a reminder from the previous tutorial, the `typeUrl: "/cosmos.bank.v1beta1.MsgSend"` string comes from the [Protobuf](https://tutorials.cosmos.network/academy/2-cosmos-concepts/6-protobuf.html) definitions and is a mixture of:

1. The `package` where `MsgSend` is initially declared:

   Copy package cosmos.bank.v1beta1;

2. And the name of the message itself, `MsgSend`:

   Copy message MsgSend { … }

### [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#multiple-token-transfer-messages) Multiple Token Transfer Messages

From here, you add an extra message for a token transfer from Alice to someone else:

Copy const result \= await signingClient.signAndBroadcast(alice, \[{ typeUrl: "/cosmos.bank.v1beta1.MsgSend", value: { fromAddress: alice, toAddress: faucet, amount: \[{ denom: "uatom", amount: "100000" }, \], }, }, { typeUrl: "/cosmos.bank.v1beta1.MsgSend", value: { fromAddress: alice, toAddress: some_other_address, amount: \[{ denom: "token", amount: "10" }, \], }, }, \], "auto",)

Note how the custom fee input was replaced with the `auto` input, which simulates the transaction to estimate the fee for you. In order to make that work well, you need to define the `gasPrice` you are willing to pay and its `prefix` when setting up your `signingClient`. You replace your original line of code with:

Copy const signingClient \= await SigningStargateClient.connectWithSigner(rpc, aliceSigner, + { + prefix: "cosmos", + gasPrice: GasPrice.fromString("0.0025uatom") + })

### [#](https://tutorials.cosmos.network/tutorials/7-cosmjs/3-multi-msg.html#mixing-other-message-types) Mixing other Message Types

The above example shows you two token-transfer messages in a single transaction. You can see this with their `typeUrl: "/cosmos.bank.v1beta1.MsgSend"`.

Neither the Cosmos SDK nor CosmJS limits you to combining messages of the same type. You can decide to combine other message types together with a token transfer. For instance, in one transaction Alice could:

1. Send tokens to the faucet.
2. Delegate some of her tokens to a validator.

How would Alice create the second message? The `SigningStargateClient` contains a predefined list (a _registry_) of `typeUrls` that are [supported by default (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.2/packages/stargate/src/signingstargateclient.ts#L55-L69), because they're considered to be the most commonly used messages in the Cosmos SDK. Among the [staking types (opens new window)](https://github.com/cosmos/cosmjs/blob/v0.28.2/packages/stargate/src/signingstargateclient.ts#L62) there is `MsgDelegate`, and that is exactly what you need. Click the source links above and below to see the rest of the `typeUrls` that come with `SigningStargateClient`:

Copy export const stakingTypes: ReadonlyArray<\[string, GeneratedType\]\> \= \[… \["/cosmos.staking.v1beta1.MsgDelegate", MsgDelegate\], … \];

Click through to the type definition, and in the `cosmjs-types` repository:

Copy export interface MsgDelegate { delegatorAddress: string; validatorAddress: string; amount?: Coin; }

Now that you know the `typeUrl` for delegating some tokens is `/cosmos.staking.v1beta1.MsgDelegate`, you need to find a validator's address that Alice can delegate to. Find a list of validators in the [testnet explorer (opens new window)](https://explorer.theta-testnet.polypore.xyz/validators). Select a validator and set their address as a variable:

Copy const validator: string \= "cosmosvaloper178h4s6at5v9cd8m9n7ew3hg7k9eh0s6wptxpcn"

Use this variable in the following script, which you can copy to replace your original token transfer:

Copy const result \= await signingClient.signAndBroadcast(alice, \[{ typeUrl: "/cosmos.bank.v1beta1.MsgSend", value: { fromAddress: alice, toAddress: faucet, amount: \[{ denom: "uatom", amount: "100000" }, \], }, }, { typeUrl: "/cosmos.staking.v1beta1.MsgDelegate", value: { delegatorAddress: alice, validatorAddress: validator, amount: { denom: "uatom", amount: "1000", }, }, }, \], "auto")

When you create [your own message types in CosmJS](https://tutorials.cosmos.network/tutorials/7-cosmjs/5-create-custom.html), they have to follow this format and be declared in the same fashion.

synopsis

To summarize, this section has explored:

- How to move past the one-transaction-one-recipient limitations of the previous exercise, which could compel a user to sign potentially many transactions at a time, and denies the possibility of sending _atomic_ transactions to multiple recipients (for example, a situation in which either all recipients receive tokens or none of them do).
- How to include two token-transfer messages in a single transaction, and how to combine messages of different types in a single transaction (for example, sending tokens to the faucet _and_ delegating tokens to a validator).

---

Article WebURL
