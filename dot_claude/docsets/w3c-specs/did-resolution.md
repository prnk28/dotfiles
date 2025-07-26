---
tags:
  - "#did-integration"
  - "#decentralized-identity"
  - "#w3c-standards"
  - "#identity-protocols"
  - "#identity-resolution"
  - "#did-architecture"
  - "#protocol-specification"
---
## Abstract

Decentralized identifiers (DIDs) are a new type of identifier for
verifiable, "self-sovereign" digital identity. DIDs are fully under the
control of the DID controller, independent from any centralized registry,
identity provider, or certificate authority. DIDs resolve to DID
Documents — simple documents that describe how to use that specific DID.


This document specifies the algorithms and guidelines for resolving DIDs
and dereferencing DID URLs.


## Status of This Document

_This section describes the status of this_
_document at the time of its publication. A list of current W3C_
_publications and the latest revision of this technical report can be found_
_in the_
_[W3C standards and drafts index](https://www.w3.org/TR/) at_
_https://www.w3.org/TR/._

Comments regarding this document are welcome. Please file issues
directly on [GitHub](https://github.com/w3c/did-resolution/issues/),
or send them to
[public-did-wg@w3.org](mailto:public-did-wg@w3.org)
( [subscribe](mailto:public-did-wg-request@w3.org?subject=subscribe),
[archives](https://lists.w3.org/Archives/Public/public-did-wg/)).


Portions of the work on this specification have been funded by the
United States Department of Homeland Security's Science and Technology
Directorate under contracts HSHQDC-17-C-00019. The content of this
specification does not necessarily reflect the position or the policy of
the U.S. Government and no official endorsement should be inferred.


Work on this specification has also been supported by the Rebooting the
Web of Trust community facilitated by Christopher Allen, Shannon
Appelcline, Kiara Robles, Brian Weller, Betty Dhamers, Kaliya Young, Kim
Hamilton Duffy, Manu Sporny, Drummond Reed, Joe Andrieu, and Heather
Vescent.


This document was published by the [Decentralized Identifier Working Group](https://www.w3.org/groups/wg/did) as
a Working Draft using the
[Recommendation track](https://www.w3.org/policies/process/20231103/#recs-and-notes).


Publication as a Working Draft does not
imply endorsement by W3C and its Members.

This is a draft document and may be updated, replaced or obsoleted by other
documents at any time. It is inappropriate to cite this document as other
than work in progress.




This document was produced by a group
operating under the
[W3C Patent\\
Policy](https://www.w3.org/policies/patent-policy/).


W3C maintains a
[public list of any patent disclosures](https://www.w3.org/groups/wg/did/ipr)
made in connection with the deliverables of
the group; that page also includes
instructions for disclosing a patent. An individual who has actual
knowledge of a patent which the individual believes contains
[Essential Claim(s)](https://www.w3.org/policies/patent-policy/#def-essential)
must disclose the information in accordance with
[section 6 of the W3C Patent Policy](https://www.w3.org/policies/patent-policy/#sec-Disclosure).



This document is governed by the
[03 November 2023 W3C Process Document](https://www.w3.org/policies/process/20231103/).


## 1\. Introduction

[Permalink for Section 1.](https://www.w3.org/TR/did-resolution/#introduction)

[DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) is the process of obtaining a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) for a given [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers). This is one
of four required operations that can be performed on any DID ("Read"; the other ones being "Create", "Update",
and "Deactivate"). The details of these operations differ depending on the [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).
Building on top of [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution), [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) is the process of retrieving a representation
of a resource for a given [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). Software and/or hardware that is able to execute these processes is called
a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s).



This
specification defines common
requirements, algorithms including their inputs and results, architectural options, and various considerations for the
[DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) and [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) processes.

Note that while this specification defines some base-level functionality for DID resolution, the actual steps
required to communicate with a DID's [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry) are defined by the applicable
[DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) specification.

Note

The difference between "resolving" a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) and "dereferencing" a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls)
is being thoroughly discussed by the community. For example, see
[this comment](https://github.com/w3c/did-spec/issues/166#issuecomment-464502719).

### 1.1 Conformance

[Permalink for Section 1.1](https://www.w3.org/TR/did-resolution/#conformance)

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words _MAY_, _MUST_, _MUST NOT_, _OPTIONAL_, _RECOMMENDED_, _REQUIRED_, and _SHOULD_ in this document
are to be interpreted as described in
[BCP 14](https://www.rfc-editor.org/info/bcp14)
\[[RFC2119](https://www.w3.org/TR/did-resolution/#bib-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")\] \[[RFC8174](https://www.w3.org/TR/did-resolution/#bib-rfc8174 "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words")\]
when, and only when, they appear in all capitals, as shown here.


A conforming DID resolver is any algorithm
realized as software and/or hardware that complies with the relevant normative
statements in [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving).


A conforming DID URL dereferencer is any
algorithm realized as software and/or hardware that complies with the relevant
normative statements in [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing).


### 1.2   Audience

[Permalink for Section 1.2](https://www.w3.org/TR/did-resolution/#audience)

_This section is non-normative._

This specification has three primary audiences: implementers of conformant DID methods;
implementers of conformant DID resolvers; and implementers of systems and services
that wish to resolve DIDs using DID resolvers. The intended audience includes,
but is not limited to, software architects, data modelers, application developers,
service developers, testers, operators, and user experience (UX) specialists.
Other people involved in a broad range of standards efforts related to decentralized
identity, verifiable credentials, and secure storage might also be interested in
reading this specification.


## 2\. Terminology

[Permalink for Section 2.](https://www.w3.org/TR/did-resolution/#terminology)

This section defines the terms used in this specification and throughout
[decentralized identifier](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) infrastructure. A link to these terms is
included whenever they appear in this specification.

authenticate
Authentication is a process by which an entity can prove it has a specific
attribute or controls a specific secret using one or more [verification\\
methods](https://www.w3.org/TR/did-resolution/#dfn-verification-method). With [DIDs](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers), a common example would be proving control of the
cryptographic private key associated with a public key published in a [DID\\
document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).
bindingA concrete mechanism through which a [client](https://www.w3.org/TR/did-resolution/#dfn-client) invokes a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s). This could be a [local binding](https://www.w3.org/TR/did-resolution/#dfn-local-binding) such as a local command line tool or library API, or a [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding) such as the [HTTP(S) binding](https://www.w3.org/TR/did-resolution/#bindings-https). See Section [7.2 Resolver Architectures](https://www.w3.org/TR/did-resolution/#resolver-architectures).clientSoftware and/or hardware that invokes a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) in order to execute the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) and/or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) algorithms. This invocation is done via a [binding](https://www.w3.org/TR/did-resolution/#dfn-binding). The term [client](https://www.w3.org/TR/did-resolution/#dfn-client) does not imply any specific network topology.decentralized identifier (DID)
A globally unique persistent identifier that does not require a centralized
registration authority and is often generated and/or registered
cryptographically. The generic format of a DID is defined in [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-syntax). A specific [DID scheme](https://www.w3.org/TR/did-resolution/#dfn-did-schemes) is defined in a [DID\\
method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) specification. Many—but not all—DID methods make use of
[distributed ledger technology](https://www.w3.org/TR/did-resolution/#dfn-distributed-ledger-technology) (DLT) or some other form of decentralized
network.
DID controller
An entity that has the capability to make changes to a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). A
[DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) might have more than one DID controller. The DID controller(s)
can be denoted by the optional `controller` property at the top level of the
[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). Note that a DID controller might be the [DID\\
subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects).
DID delegate
An entity to whom a [DID controller](https://www.w3.org/TR/did-resolution/#dfn-did-controllers) has granted permission to use a
[verification method](https://www.w3.org/TR/did-resolution/#dfn-verification-method) associated with a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) via a [DID\\
document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). For example, a parent who controls a child's [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents)
might permit the child to use their personal device in order to
[authenticate](https://www.w3.org/TR/did-resolution/#dfn-authenticated). In this case, the child is the [DID delegate](https://www.w3.org/TR/did-resolution/#dfn-did-delegate). The
child's personal device would contain the private cryptographic material
enabling the child to [authenticate](https://www.w3.org/TR/did-resolution/#dfn-authenticated) using the [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers). However, the child
might not be permitted to add other personal devices without the parent's
permission.
DID document
A set of data describing the [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects), including mechanisms, such as
cryptographic public keys, that the [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects) or a [DID delegate](https://www.w3.org/TR/did-resolution/#dfn-did-delegate)
can use to [authenticate](https://www.w3.org/TR/did-resolution/#dfn-authenticated) itself and prove its association with the
[DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers).
DID fragment
The portion of a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) that follows the first hash sign character
( `#`). DID fragment syntax is identical to URI fragment syntax.
DID method
A definition of how a specific [DID method scheme](https://www.w3.org/TR/did-resolution/#dfn-did-schemes) is implemented. A DID method is
defined by a DID method specification, which specifies the precise operations by
which [DIDs](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-resolution/#dfn-did-documents) are created, resolved, updated,
and deactivated. See [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#methods).
DID path
The portion of a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) that begins with and includes the first forward
slash ( `/`) character and ends with either a question mark
( `?`) character, a fragment hash sign ( `#`) character,
or the end of the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). DID path syntax is identical to URI path syntax.
See [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#path).
DID query
The portion of a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) that follows and includes the first question
mark character ( `?`). DID query syntax is identical to URI query
syntax. See [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#query).
DID resolution
The process that takes as its input a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) and a set of resolution
options and returns a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) in a conforming [representation](https://www.w3.org/TR/did-resolution/#dfn-representations)
plus additional metadata. This process relies on the "Read" operation of the
applicable [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s). The inputs and outputs of this process are
defined in [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving).
DID resolver
A [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) is a software and/or hardware component that performs the
[DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function by taking a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) as input and producing a
conforming [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) as output.
DID resolution resultA data structure that represents the result of the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm.
May contain a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). See Section [8\. DID Resolution Result](https://www.w3.org/TR/did-resolution/#did-resolution-result).DID scheme
The formal syntax of a [decentralized identifier](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers). The generic DID scheme
begins with the prefix `did:` as defined in [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-syntax). Each [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) specification defines a specific
DID method scheme that works with that specific [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s). In a specific DID
method scheme, the DID method name follows the first colon and terminates with
the second colon, e.g., `did:example:`DID subject
The entity identified by a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) and described by a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).
Anything can be a DID subject: person, group, organization, physical thing,
digital thing, logical thing, etc.
DID URL
A [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) plus any additional syntactic component that conforms to the
definition in [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-url-syntax). This includes an optional [DID\\
path](https://www.w3.org/TR/did-resolution/#dfn-did-paths) (with its leading `/` character), optional [DID query](https://www.w3.org/TR/did-resolution/#dfn-did-queries)
(with its leading `?` character), and optional [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments)
(with its leading `#` character).
DID URL dereferencing
The process that takes as its input a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) and a set of input
metadata, and returns a [resource](https://www.w3.org/TR/did-resolution/#dfn-resources). This resource might be a [DID\\
document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) plus additional metadata, a secondary resource
contained within the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents), or a resource entirely
external to the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). The process uses [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) to
fetch a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) indicated by the [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) contained within the
[DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). The dereferencing process can then perform additional processing
on the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) to return the dereferenced resource indicated by the
[DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). The inputs and outputs of this process are defined in
[5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing).
DID URL dereferencer
A software and/or hardware system that performs the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing)
function for a given [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) or [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).
DID URL dereferencing resultA data structure that represents the result of the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) algorithm.
May contain a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) or other content. See Section [9\. DID URL Dereferencing Result](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-result).distributed ledger (DLT)
A non-centralized system for recording events. These systems establish
sufficient confidence for participants to rely upon the data recorded by others
to make operational decisions. They typically use distributed databases where
different nodes use a consensus protocol to confirm the ordering of
cryptographically signed transactions. The linking of digitally signed
transactions over time often makes the history of the ledger effectively
immutable.
resource
As defined by \[[RFC3986](https://www.w3.org/TR/did-resolution/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]: "...the term 'resource' is used in a general sense
for whatever might be identified by a URI." Similarly, any resource might serve
as a [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects) identified by a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers).
representation
As defined for HTTP by \[[RFC7231](https://www.w3.org/TR/did-resolution/#bib-rfc7231 "Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content")\]: "information that is intended to reflect a
past, current, or desired state of a given resource, in a format that can be
readily communicated via the protocol, and that consists of a set of
representation metadata and a potentially unbounded stream of representation
data." A [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) is a representation of information describing a
[DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects). See [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#representations).
local bindingA [binding](https://www.w3.org/TR/did-resolution/#dfn-binding) where the [client](https://www.w3.org/TR/did-resolution/#dfn-client) invokes a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) that runs on the same network host, e.g., via a local command line tool or library API.
In this case, the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) is sometimes also called a "local [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s)".
See Section [7.2 Resolver Architectures](https://www.w3.org/TR/did-resolution/#resolver-architectures).remote bindingA [binding](https://www.w3.org/TR/did-resolution/#dfn-binding) where the [client](https://www.w3.org/TR/did-resolution/#dfn-client) invokes a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) that runs on a different network host, e.g., via the [HTTP(S) binding](https://www.w3.org/TR/did-resolution/#bindings-https).
In this case, the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) is sometimes also called a "remote [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s)".
See Section [7.2 Resolver Architectures](https://www.w3.org/TR/did-resolution/#resolver-architectures).services
Means of communicating or interacting with the [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects) or
associated entities via one or more [service endpoints](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints).
Examples include discovery services, agent services, social networking
services, file storage services, and verifiable credential repository services.
service endpoint
A network address, such as an HTTP URL, at which [services](https://www.w3.org/TR/did-resolution/#dfn-service) operate on
behalf of a [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects).
unverifiable read A low confidence implementation of a [DID method's](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) "Read" operation between the
[DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) and the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry), to obtain the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).
There is no guarantee about the integrity and correctness of the result. See Section [7.1 Method Architectures](https://www.w3.org/TR/did-resolution/#method-architectures).
verifiable data registry
A system that facilitates the creation, verification, updating, and/or
deactivation of [decentralized identifiers](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-resolution/#dfn-did-documents). A
verifiable data registry might also be used for other
cryptographically-verifiable data structures such as [verifiable\\
credentials](https://www.w3.org/TR/vc-data-model/#dfn-verifiable-credential). For more information, see the W3C Verifiable Credentials
specification \[[VC-DATA-MODEL](https://www.w3.org/TR/did-resolution/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\].
verification method

A set of parameters that can be used together with a process to independently
verify a proof. For example, a cryptographic public key can be used as a
verification method with respect to a digital signature; in such usage, it
verifies that the signer possessed the associated cryptographic private key.


"Verification" and "proof" in this definition are intended to apply broadly. For
example, a cryptographic public key might be used during Diffie-Hellman key
exchange to negotiate a shared symmetric key for encryption. This guarantees the
integrity of the key agreement process. It is thus another type of verification
method, even though descriptions of the process might not use the words
"verification" or "proof."


verifiable read A high confidence implementation of a [DID method's](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) "Read" operation between the
[DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) and the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry), to obtain the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).
There are guarantees about the integrity and correctness of the result to the extent possible under the applicable [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).
See Section [7.1 Method Architectures](https://www.w3.org/TR/did-resolution/#method-architectures).Universally Unique Identifier (UUID)
A type of globally unique identifier defined by \[[RFC4122](https://www.w3.org/TR/did-resolution/#bib-rfc4122 "A Universally Unique IDentifier (UUID) URN Namespace")\]. UUIDs are similar
to DIDs in that they do not require a centralized registration authority. UUIDs
differ from DIDs in that they are not resolvable or
cryptographically-verifiable.
Uniform Resource Identifier (URI)
The standard identifier format for all resources on the World Wide Web as
defined by \[[RFC3986](https://www.w3.org/TR/did-resolution/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]. A [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) is a type of URI scheme.


## 3\. DID Parameters

[Permalink for Section 3.](https://www.w3.org/TR/did-resolution/#did-parameters)

The [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) syntax supports a simple format for parameters
(see section [Query](https://www.w3.org/TR/did-core/#query)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\]). Adding a DID
parameter to a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) means that the parameter becomes part of the
identifier for a [resource](https://www.w3.org/TR/did-resolution/#dfn-resources).


[Example 1](https://www.w3.org/TR/did-resolution/#example-a-did-url-with-a-versiontime-did-parameter): A DID URL with a 'versionTime' DID parameter

```
did:example:123?versionTime=2021-05-10T17:00:00Z
```

[Example 2](https://www.w3.org/TR/did-resolution/#example-a-did-url-with-a-service-and-a-relativeref-did-parameter): A DID URL with a 'service' and a 'relativeRef' DID parameter

```
did:example:123?service=files&relativeRef=/resume.pdf
```

Some DID parameters are completely independent of any specific [DID\\
method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) and function the same way for all [DIDs](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers). Other DID parameters
are not supported by all [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s). Where optional parameters are
supported, they are expected to operate uniformly across the [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s)
that do support them. The following table provides common DID parameters that
function the same way across all [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s). Support for all
[DID Parameters](https://www.w3.org/TR/did-resolution/#did-parameters) is _OPTIONAL_.


| Parameter Name | Description |
| --- | --- |
| `service` | Identifies a [service](https://www.w3.org/TR/did-core/#services) from the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) by service ID.<br> If present, the associated value _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). |
| `serviceType` | Identifies a set of one or more [services](https://www.w3.org/TR/did-core/#services) from the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) by service type.<br> If present, the associated value _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). |
| `relativeRef` | A relative [URI](https://www.w3.org/TR/did-resolution/#dfn-uri) reference according to [RFC3986 Section 4.2](https://www.rfc-editor.org/rfc/rfc3986#section-4.2) that identifies a<br> [resource](https://www.w3.org/TR/did-resolution/#dfn-resources) at a [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints), which is selected from a [DID\<br> document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) by using the `service` parameter.<br> If present, the associated value _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string) and _MUST_ use percent-encoding for<br> certain characters as specified in [RFC3986\<br> Section 2.1](https://www.rfc-editor.org/rfc/rfc3986#section-2.1). |
| `versionId` | Identifies a specific version of a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) to be resolved (the<br> version ID could be sequential, or a [UUID](https://www.w3.org/TR/did-resolution/#dfn-uuid), or method-specific).<br> If present, the associated value _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). |
| `versionTime` | Identifies a certain version timestamp of a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) to be resolved.<br> That is, the most recent version of the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) that was valid for a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) <br> before the specified `versionTime`. If present, the associated value<br> _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string) which is a valid XML<br> datetime value, as defined in section 3.3.7 of [W3C XML Schema Definition Language\<br> (XSD) 1.1 Part 2: Datatypes](https://www.w3.org/TR/xmlschema11-2/) \[[XMLSCHEMA11-2](https://www.w3.org/TR/did-resolution/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\]. This datetime value _MUST_ be<br> normalized to UTC 00:00:00 and without sub-second decimal precision.<br> For example: `2020-12-20T19:17:47Z`. |
| `hl` | A resource hash of the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) to add integrity protection, as<br> specified in \[[HASHLINK](https://www.w3.org/TR/did-resolution/#bib-hashlink "Cryptographic Hyperlinks")\]. This parameter is non-normative.<br> If present, the associated value _MUST_ be an<br> [ASCII string](https://infra.spec.whatwg.org/#ascii-string). |

Implementers as well as [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) specification authors might use
additional DID parameters that are not listed here. For maximum
interoperability, it is _RECOMMENDED_ that DID parameters use the DID
Specification Registries mechanism \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\], to avoid collision
with other uses of the same DID parameter with different semantics.


DID parameters might be used if there is a clear use case where the parameter
needs to be part of a URL that references a [resource](https://www.w3.org/TR/did-resolution/#dfn-resources) with more
precision than using the [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) alone. It is expected that DID parameters
are _not_ used if the same functionality can be expressed by passing
input metadata to a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s).


Note: DID parameters and DID resolution

The [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) and the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) functions can
be influenced by passing [4.1 DID Resolution Options](https://www.w3.org/TR/did-resolution/#did-resolution-options) or
[5.1 DID URL Dereferencing Options](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-options) to a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) that are
not part of the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). This is comparable to
HTTP, where certain parameters could either be included in an HTTP URL, or
alternatively passed as HTTP headers during the dereferencing process. The
important distinction is that DID parameters that are part of the [DID\\
URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) should be used to specify _what [resource](https://www.w3.org/TR/did-resolution/#dfn-resources) is being_
_identified_, whereas input metadata that is not part of the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls)
should be used to control _how that [resource](https://www.w3.org/TR/did-resolution/#dfn-resources) is resolved or_
_dereferenced_.


## 4\. DID Resolution

[Permalink for Section 4.](https://www.w3.org/TR/did-resolution/#resolving)

The [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function resolves a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) into a [DID\\
document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) by using the "Read" operation of the applicable [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s)
as described in [Method Operations](https://www.w3.org/TR/did-core/#method-operations). All
conforming [DID resolvers](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implement the function below, which has the
following abstract form:


```hljs
resolve(did, resolutionOptions) →
   « didResolutionMetadata, didDocument, didDocumentMetadata »
```

All conformant [DID resolvers](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) _MUST_ implement the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution)
function for at least one [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) and _MUST_ be able to return a
[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) in at least one conformant [representation](https://www.w3.org/TR/did-resolution/#dfn-representations).


Conforming [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implementations do not alter the signature of
this function in any way. [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implementations might map the
`resolve` function to a
method-specific internal function to perform the actual [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution)
process. [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implementations might implement and expose
additional functions with different signatures in addition to the
`resolve` function specified here.


The input variables
of the `resolve` function are
as follows:


 did

 This is the [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) to resolve. This input is _REQUIRED_ and the value _MUST_
 be a conformant [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) as defined in [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-syntax).

 resolutionOptions

 A [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure) containing properties
 defined in [4.1 DID Resolution Options](https://www.w3.org/TR/did-resolution/#did-resolution-options). This input is
 _REQUIRED_, but the structure _MAY_ be empty.


This function returns multiple values, and no limitations
are placed on how these values are returned together.
The return values of `resolve` are
[didResolutionMetadata](https://www.w3.org/TR/did-resolution/#dfn-didresolutionmetadata), [didDocument](https://www.w3.org/TR/did-resolution/#dfn-diddocument), and
[didDocumentMetadata](https://www.w3.org/TR/did-resolution/#dfn-diddocumentmetadata). These values are described below:


didResolutionMetadata
 A [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure) consisting of values
 relating to the results of the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) process which typically
 changes between invocations of the `resolve`
 function, as it represents data about the
 resolution process itself. This structure is _REQUIRED_, and in the case of an
 error in the resolution process, this _MUST NOT_ be empty. This metadata is
 defined by [4.2 DID Resolution Metadata](https://www.w3.org/TR/did-resolution/#did-resolution-metadata). If the resolution is
 not successful, this structure _MUST_ contain an `error` property
 describing the error.
 didDocument
 If the resolution is successful, this _MUST_ be a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) that
 is capable of being represented in one of the conformant
 [representations](https://www.w3.org/TR/did-core/#representations) of the [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/) specification.
 The value of `id` in the resolved [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) _MUST_
 match the [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) that was resolved. If the resolution is unsuccessful, this
 value _MUST_ be empty.
 didDocumentMetadata
 If the resolution is successful, this _MUST_ be a [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure). This structure contains
 metadata about the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) contained in the `didDocument`
 property. This metadata typically does not change between invocations of the
 `resolve` function unless the
 [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) changes, as it represents metadata about the [DID\\
 document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). If the resolution is unsuccessful, this output _MUST_ be an empty [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure). Properties defined by this
 specification are in [4.3 DID Document Metadata](https://www.w3.org/TR/did-resolution/#did-document-metadata).


### 4.1 DID Resolution Options

[Permalink for Section 4.1](https://www.w3.org/TR/did-resolution/#did-resolution-options)

The possible properties within this structure and their possible values are
registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\]. This
specification defines the following common properties.


 accept

 The Media Type of the caller's preferred [representation](https://www.w3.org/TR/did-resolution/#dfn-representations) of the [DID\\
 document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). The Media Type _MUST_ be expressed as an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). The [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implementation _SHOULD_ use this
 value to determine the [representation](https://www.w3.org/TR/did-resolution/#dfn-representations) of the returned
 `didDocument` if such a [representation](https://www.w3.org/TR/did-resolution/#dfn-representations) is supported and
 available. This property is _OPTIONAL_.

 expandRelativeUrls

 A boolean flag which instructs a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) to expand
 [relative DID URLs](https://www.w3.org/TR/did-core/#relative-did-urls) in
 the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) to
 absolute DID URLs conformant with [DID URL Syntax](https://www.w3.org/TR/did-core/#did-url-syntax).
 versionId
 See [3\. DID Parameters](https://www.w3.org/TR/did-resolution/#did-parameters) for the definition.
 versionTime
 See [3\. DID Parameters](https://www.w3.org/TR/did-resolution/#did-parameters) for the definition.


### 4.2 DID Resolution Metadata

[Permalink for Section 4.2](https://www.w3.org/TR/did-resolution/#did-resolution-metadata)

The possible properties within this structure and their possible values are
registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\]. This
specification defines the following DID resolution metadata properties:


 contentType

 The Media Type of the returned `didDocument`. This property is
 _OPTIONAL_. If present, the value of this
 property _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string) that is the Media
 Type of the conformant [representations](https://www.w3.org/TR/did-resolution/#dfn-representations). In this case, the
 caller of the `resolve` function _MUST_ use this value
 when determining how to parse and process the `didDocument`.

 error

 The error code from the resolution process. This property is _REQUIRED_ when there
 is an error in the resolution process. The value of this property _MUST_ be a
 single keyword [ASCII string](https://infra.spec.whatwg.org/#ascii-string). The possible property
 values of this field _SHOULD_ be registered in the DID Specification Registries
 \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\]. This specification defines the following
 common error values:

 invalidDid

 The [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) supplied to the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function does not conform
 to valid syntax. (See [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-syntax).)

 notFound

 The [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) was unable to find the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents)
 resulting from this resolution request.

 representationNotSupported

 This error code is returned if the [representation](https://www.w3.org/TR/did-resolution/#dfn-representations) requested via the
 `accept` input metadata property is not supported by the [DID\\
 method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) and/or [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implementation.


### 4.3 DID Document Metadata

[Permalink for Section 4.3](https://www.w3.org/TR/did-resolution/#did-document-metadata)

The possible properties within this structure and their possible values _SHOULD_
be registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\].
This specification defines the following common properties.


created[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _SHOULD_ include a `created` property to
 indicate the timestamp of the [Create operation](https://www.w3.org/TR/did-core/#method-operations).
 The value of the property _MUST_ be a [string](https://infra.spec.whatwg.org/#string)
 formatted as an [XML Datetime](https://www.w3.org/TR/xmlschema11-2/#dateTime)
 normalized to UTC 00:00:00 and without sub-second decimal precision. For
 example: `2020-12-20T19:17:47Z`.
 updated[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _SHOULD_ include an `updated` property to
 indicate the timestamp of the last [Update\\
 operation](https://www.w3.org/TR/did-core/#method-operations) for the document version which was resolved. The value of the
 property _MUST_ follow the same formatting rules as the `created`
 property. The `updated` property is omitted if an Update operation
 has never been performed on the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). If an `updated`
 property exists, it can be the same value as the `created` property
 when the difference between the two timestamps is less than one second.
 deactivated
 If a DID has been [deactivated](https://www.w3.org/TR/did-core/#method-operations),
 [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _MUST_ include this property with the boolean value
 `true`. If a DID has not been deactivated, this property is _OPTIONAL_,
 but if included, _MUST_ have the boolean value `false`.
 nextUpdate[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _MAY_ include a `nextUpdate` property if
 the resolved document version is not the latest version of the document. It
 indicates the timestamp of the next [Update\\
 operation](https://www.w3.org/TR/did-core/#method-operations). The value of the property _MUST_ follow the same formatting rules
 as the `created` property.
 versionId[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _SHOULD_ include a `versionId` property to
 indicate the version of the last [Update\\
 operation](https://www.w3.org/TR/did-core/#method-operations) for the document version which was resolved. The value of the
 property _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string).
 nextVersionId[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _MAY_ include a `nextVersionId` property
 if the resolved document version is not the latest version of the document. It
 indicates the version of the next [Update\\
 operation](https://www.w3.org/TR/did-core/#method-operations). The value of the property _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string).
 equivalentId

A [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) can define different forms of a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) that are
logically equivalent. An example is when a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) takes one form prior to
registration in a [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry) and another form after such
registration. In this case, the [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) specification might need to
express one or more [DIDs](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) that are logically equivalent to the resolved
[DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) as a property of the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). This is the purpose of the
`equivalentId` property.


[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _MAY_ include an `equivalentId` property.
If present, the value _MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) where each item is a
[string](https://infra.spec.whatwg.org/#string) that conforms to the rules in Section [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-syntax). The relationship is a statement that each
`equivalentId` value is logically equivalent to the
`id` property value and thus refers to the same [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects).
Each `equivalentId` DID value _MUST_ be produced by, and a form
of, the same [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) as the `id` property value. (e.g.,
`did:example:abc` == `did:example:ABC`)


A conforming [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) specification _MUST_ guarantee that each
`equivalentId` value is logically equivalent to the
`id` property value.


A requesting party is expected to retain the values from the `id` and
`equivalentId` properties to ensure any subsequent
interactions with any of the values they contain are correctly handled as
logically equivalent (e.g., retain all variants in a database so an interaction
with any one maps to the same underlying account).


Note: Stronger equivalence

`equivalentId` is a much stronger form of equivalence than
`alsoKnownAs` because the equivalence _MUST_ be guaranteed by
the governing [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s). `equivalentId` represents a
full graph merge because the same [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) describes both the
`equivalentId` [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) and the `id` property
[DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers).


If a requesting party does not retain the values from the `id` and
`equivalentId` properties and ensure any subsequent
interactions with any of the values they contain are correctly handled as
logically equivalent, there might be negative or unexpected issues that
arise. Implementers are strongly advised to observe the
directives related to this metadata property.


canonicalId

The `canonicalId` property is identical to the
`equivalentId` property except: a) it is associated with a
single value rather than a set, and b) the [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) is defined to be
the canonical ID for the [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects) within the scope of the containing
[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).


[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) metadata _MAY_ include a `canonicalId` property.
If present, the value _MUST_ be a [string](https://infra.spec.whatwg.org/#string) that conforms to the rules in Section [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-syntax). The relationship is a statement that the
`canonicalId` value is logically equivalent to the
`id` property value and that the `canonicalId`
value is defined by the [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) to be the canonical ID for the [DID\\
subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects) in the scope of the containing [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). A
`canonicalId` value _MUST_ be produced by, and a form of, the
same [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) as the `id` property value. (e.g.,
`did:example:abc` == `did:example:ABC`).


A conforming [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) specification _MUST_ guarantee that the
`canonicalId` value is logically equivalent to the
`id` property value.


A requesting party is expected to use the `canonicalId` value
as its primary ID value for the [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects) and treat all other
equivalent values as secondary aliases (e.g., update corresponding primary
references in their systems to reflect the new canonical ID directive).


Note: Canonical equivalence

`canonicalId` is the same statement of equivalence as
`equivalentId` except it is constrained to a single value that
is defined to be canonical for the [DID subject](https://www.w3.org/TR/did-resolution/#dfn-did-subjects) in the scope of the [DID\\
document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). Like `equivalentId`,
`canonicalId` represents a full graph merge because the same
[DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) describes both the `canonicalId` DID and
the `id` property [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers).


If a resolving party does not use the `canonicalId` value as
its primary ID value for the DID subject and treat all other equivalent values
as secondary aliases, there might be negative or unexpected issues that arise
related to user experience. Implementers are strongly advised to observe the
directives related to this metadata property.


### 4.4 Algorithm

[Permalink for Section 4.4](https://www.w3.org/TR/did-resolution/#resolving-algorithm)

The following [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm _MUST_ be implemented by a conformant [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s).

1. Validate that the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) conforms to the `did` rule of the
    [DID Syntax](https://www.w3.org/TR/did-core/#did-syntax).
    If not, the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) _MUST_ return the following result:

   1. **didResolutionMetadata**: `«[ "error" → "invalidDid", ... ]»`
   2. **didDocument**: `null`
   3. **didDocumentMetadata**: `«[ ]»`
2. Determine whether the DID method of the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) is supported by the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s)
    that implements this algorithm. If not, the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) _MUST_ return the following result:

   1. **didResolutionMetadata**: `«[ "error" → "methodNotSupported", ... ]»`
   2. **didDocument**: `null`
   3. **didDocumentMetadata**: `«[ ]»`
3. Obtain the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) for the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) by executing the
    [Read](https://www.w3.org/TR/did-core/#method-operations) operation against the
    input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers)'s [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry), as defined by the input [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s):

   1. Besides the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers), all additional resolution options of
       this algorithm _MUST_ be passed to the
       [Read](https://www.w3.org/TR/did-core/#method-operations) operation of the
       input [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).
   2. If the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) does not exist, return the following result:

      1. **didResolutionMetadata**: `«[ "error" → "notFound", ... ]»`
      2. **didDocument**: `null`
      3. **didDocumentMetadata**: `«[ ]»`
   3. If the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) has been deactivated, return the following result:

      1. **didResolutionMetadata**: `«[ ... ]»`
      2. **didDocument**: `null`
      3. **didDocumentMetadata**: `«[ "deactivated" → true, ... ]»`
   4. Otherwise, the result of the [Read](https://www.w3.org/TR/did-core/#method-operations) operation
       is called the output [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents). This result _MUST_ be represented in a
       [conformant representation](https://www.w3.org/TR/did-core/#representations) that
       corresponds to the **accept** input [DID resolution option](https://www.w3.org/TR/did-resolution/#did-resolution-options).
4. If the input [DID resolution options](https://www.w3.org/TR/did-resolution/#did-resolution-options) contain the `expandRelativeUrls` option with a value of `true`:

   1. Iterate over all [services](https://www.w3.org/TR/did-core/#services),
       [verification methods](https://www.w3.org/TR/did-core/#verification-methods), and
       [verification relationships](https://www.w3.org/TR/did-core/#verification-relationships)
       in the output [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).
   2. If the value of the `id` property of a [service](https://www.w3.org/TR/did-core/#services) or
       [verification method](https://www.w3.org/TR/did-core/#verification-methods)
       (including those embedded in [verification relationships](https://www.w3.org/TR/did-core/#verification-relationships)) is a
       [relative DID URL](https://www.w3.org/TR/did-core/#relative-did-urls), or if a
       [verification relationship](https://www.w3.org/TR/did-core/#verification-relationships) is a
       [relative DID URL](https://www.w3.org/TR/did-core/#relative-did-urls):

      1. Resolve the [relative DID URL](https://www.w3.org/TR/did-core/#relative-did-urls) to
          an absolute [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) conformant with [DID URL Syntax](https://www.w3.org/TR/did-core/#did-url-syntax), according
          to the rules of section [Relative DID URLs](https://www.w3.org/TR/did-core/#relative-did-urls) in [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/).
   3. Update the output [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) by replacing
       the [relative DID URLs](https://www.w3.org/TR/did-core/#relative-did-urls) with the resolved absolute [DID URLs](https://www.w3.org/TR/did-resolution/#dfn-did-urls).
5. Return the following result:
   1. **didResolutionMetadata**: `«[ ... ]»`
   2. **didDocument**: output DID document
   3. **didDocumentMetadata**: `«[ "contentType" → ` output DID document media type `, ... ]»`

[Issue 5](https://github.com/w3c/did-resolution/issues/5): Discuss how to treat deactivated DIDs [enhancement](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22enhancement%22) [pending-close](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pending-close%22)

There is discussion how a DID that has been
[deactivated](https://www.w3.org/TR/did-core/#method-operations) should be treated during the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution)
process.

[Issue 13](https://github.com/w3c/did-resolution/issues/13): Validate signatures/proofs of DID Document [security](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22security%22)

Specify how signatures/proofs on a DID document should be verified during the
DID resolution process.

Issue

Should we define functionality that enables discovery of the list of [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) or other
capabilities that are supported by a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s)? Or is this implementation-specific and out-of-scope
for this spec? For example, see [here](https://github.com/w3c/did-resolution/issues/26) and
[here](https://github.com/w3c/did-resolution/issues/25).

## 5\. DID URL Dereferencing

[Permalink for Section 5.](https://www.w3.org/TR/did-resolution/#dereferencing)

The [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function dereferences a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) into a
[resource](https://www.w3.org/TR/did-resolution/#dfn-resources) with contents depending on the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls)'s components,
including the [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s), method-specific identifier, path, query, and
fragment. This process depends on [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) of the [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers)
contained in the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) might involve
multiple steps (e.g., when the DID URL being dereferenced includes a fragment),
and the function is defined to return the final resource after all steps are
completed. The following figure depicts the relationship described
above.


![ DIDs resolve to DID documents; DID URLs contains a DID; DID URLs dereferenced to DID document fragments or external resources.         ](https://www.w3.org/TR/did-resolution/diagrams/did_url_dereference_overview.svg)[Figure 1](https://www.w3.org/TR/did-resolution/#did-url-dereference-overview)
 Overview of DID URL dereference
 See also: [narrative description](https://www.w3.org/TR/did-resolution/#did-url-dereference-overview-longdesc).


The top left part of the diagram contains a rectangle with black outline, labeled "DID".


The bottom left part of the diagram contains a rectangle with black outline, labeled "DID URL".
This rectangle contains four smaller black-outlined rectangles, aligned in a horizontal row adjacent to
each other. These smaller rectangles are labeled, in order, "DID", "path", "query", and "fragment.


The top right part of the diagram contains a rectangle with black outline, labeled "DID document".
This rectangle contains three smaller black-outlined rectangles. These smaller rectangles are
labeled "id", "(property X)", and "(property Y)", and are surrounded by multiple series of three
dots (ellipses). A curved black arrow, labeled "DID document - relative fragment dereference", extends
from the rectangle labeled "(property X)", and points to the rectangle labeled "(property Y)".


The bottom right part of the diagram contains an oval shape with black outline, labeled "Resource".


A black arrow, labeled "resolves to a DID document", extends from the rectangle in the top left part of
the diagram, labeled "DID", and points to the rectangle in the top right part of diagram, labeled
"DID document".


A black arrow, labeled "refers to", extends from the rectangle in the top right part of the diagram,
labeled "DID document", and points to the oval shape in the bottom right part of diagram, labeled
"Resource".


A black arrow, labeled "contains", extends from the small rectangle labeled "DID" inside the
rectangle in the bottom left part of the diagram, labeled "DID URL", and points to the rectangle
in the top left part of diagram, labeled "DID".


A black arrow, labeled "dereferences to a DID document", extends from the rectangle in the bottom left
part of the diagram, labeled "DID URL", and points to the rectangle in the top right part of diagram,
labeled "DID document".


A black arrow, labeled "dereferences to a resource", extends from the rectangle in the bottom left
part of the diagram, labeled "DID URL", and points to the oval shape in the bottom right part of diagram,
labeled "Resource".


All conforming [DID resolvers](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implement
the following function which has the following abstract form:


```hljs
dereference(didUrl, dereferenceOptions) →
   « dereferencingMetadata, contentStream, contentMetadata »
```

The input variables of the `dereference` function are as follows:


 didUrl

 A conformant [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) as a single [string](https://infra.spec.whatwg.org/#string).
 This is the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) to dereference. To dereference a [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments),
 the complete [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) including the [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments) _MUST_ be used. This
 input is _REQUIRED_.



Note: DID URL dereferencer patterns

While it is valid for any `didUrl` to be passed to a DID URL
dereferencer, implementers are expected to refer to [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing) to
further understand common patterns for how a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) is expected
to be dereferenced.


 dereferencingOptions

 A [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure) consisting of input
 options to the `dereference` function in addition to the
 `didUrl` itself. Properties defined by this specification are in [5.1 DID URL Dereferencing Options](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-options). This input is _REQUIRED_, but the
 structure _MAY_ be empty.


This function returns multiple values, and no limitations
are placed on how these values are returned together.
The return values of the `dereference` include
`dereferencingMetadata`, `contentStream`,
and `contentMetadata`:


 dereferencingMetadata

 A [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure) consisting of values
 relating to the results of the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) process. This
 structure is _REQUIRED_, and in the case of an error in the dereferencing process,
 this _MUST NOT_ be empty. Properties defined by this specification are in [5.2 DID URL Dereferencing Metadata](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-metadata). If the dereferencing is not
 successful, this structure _MUST_ contain an `error` property
 describing the error.

 contentStream

 If the `dereferencing` function was called and successful, this _MUST_
 contain a [resource](https://www.w3.org/TR/did-resolution/#dfn-resources) corresponding to the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). The
 `contentStream` _MAY_ be a [resource](https://www.w3.org/TR/did-resolution/#dfn-resources) such as a [DID\\
 document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) that is serializable in one of the conformant
 [representations](https://www.w3.org/TR/did-resolution/#dfn-representations), a [verification\\
 method](https://www.w3.org/TR/did-core/#verification-methods), a [service](https://www.w3.org/TR/did-core/#services), or any other resource format that
 can be identified via a Media Type and obtained through the resolution process.
 If the dereferencing is unsuccessful, this value _MUST_ be empty.

 contentMetadata

 If the dereferencing is successful, this _MUST_ be a [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure), but the structure _MAY_ be empty. This structure contains
 metadata about the `contentStream`. If the `contentStream`
 is a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents), this _MUST_ be a [didDocumentMetadata](https://www.w3.org/TR/did-resolution/#dfn-diddocumentmetadata) structure as
 described in [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution). If the dereferencing is unsuccessful, this
 output _MUST_ be an empty [metadata structure](https://www.w3.org/TR/did-resolution/#metadata-structure).


Conforming [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) implementations do not alter the
signature of these functions in any way. [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing)
implementations might map the `dereference` function to a
method-specific internal function to perform the actual [DID URL\\
dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) process. [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) implementations might
implement and expose additional functions with different signatures in addition
to the `dereference` function specified here.


### 5.1 DID URL Dereferencing Options

[Permalink for Section 5.1](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-options)

The possible properties within this structure and their possible values _SHOULD_
be registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\].
This specification defines the following common properties for
dereferencing options:


 accept

 The Media Type that the caller prefers for `contentStream`. The Media
 Type _MUST_ be expressed as an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). The
 [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) implementation _SHOULD_ use this value to determine
 the `contentType` of the [representation](https://www.w3.org/TR/did-resolution/#dfn-representations) contained in the
 returned value if such a [representation](https://www.w3.org/TR/did-resolution/#dfn-representations) is supported and available.


### 5.2 DID URL Dereferencing Metadata

[Permalink for Section 5.2](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-metadata)

The possible properties within this structure and their possible values are
registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\]. This
specification defines the following common properties.


 contentType

 The Media Type of the returned `contentStream` _SHOULD_ be expressed
 using this property if dereferencing is successful. The Media
 Type value _MUST_ be expressed as an [ASCII string](https://infra.spec.whatwg.org/#ascii-string).

 error

 The error code from the dereferencing process. This property is _REQUIRED_ when
 there is an error in the dereferencing process. The value of this property
 _MUST_ be a single keyword expressed as an [ASCII\\
 string](https://infra.spec.whatwg.org/#ascii-string). The possible property values of this field _SHOULD_ be registered in
 the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\]. This specification
 defines the following common error values:

 invalidDidUrl

 The [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) supplied to the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function does
 not conform to valid syntax. (See [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#did-url-syntax).)

 notFound

 The [DID URL dereferencer](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencers) was unable to find the
 `contentStream` resulting from this dereferencing request.


### 5.3 Algorithm

[Permalink for Section 5.3](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm)

The following [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) algorithm _MUST_ be implemented by a conformant [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s).
In accordance with \[[RFC3986](https://www.w3.org/TR/did-resolution/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\], it consists of the following three steps: resolving the DID; dereferencing the
resource; and dereferencing the fragment (only if the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains a [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments)):

#### 5.3.1 Dereferencing the Resource

[Permalink for Section 5.3.1](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-resource)

01. Validate that the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) conforms to the `did-url` rule of the
     [DID URL Syntax](https://www.w3.org/TR/did-core/#did-url-syntax).
     If not, the [DID URL dereferencer](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencers) _MUST_ return the following result:

    1. **dereferencingMetadata**: `«[ "error" → "invalidDidUrl" ]»`
    2. **contentStream**: `null`
    3. **contentMetadata**: `«[ ]»`
02. Obtain the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) for the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) by executing the
     [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm as defined in [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving). All
     dereferencing options and all
     [DID parameters](https://www.w3.org/TR/did-core/#did-parameters) of the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) _MUST_ be passed as resolution options to the
     [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm.
03. If the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) does not exist in the VDR, the [DID URL dereferencer](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencers) _MUST_ return the following result:

    1. **dereferencingMetadata**: `«[ "error" → "notFound", ... ]»`
    2. **contentStream**: `null`
    3. **contentMetadata**: `«[ ]»`
04. Otherwise, the **didDocument** result of the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm is called the resolved [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).
05. If present, separate the [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments) from the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) and continue
     with the adjusted input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls).
06. If the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains no [DID path](https://www.w3.org/TR/did-resolution/#dfn-did-paths) and no [DID query](https://www.w3.org/TR/did-resolution/#dfn-did-queries):



    [Example 3](https://www.w3.org/TR/did-resolution/#example-3)



    ```
    did:example:1234
    ```



     The [DID URL dereferencer](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencers) _MUST_ return the resolved [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) and
     resolved [4.3 DID Document Metadata](https://www.w3.org/TR/did-resolution/#did-document-metadata) as follows:

    1. **dereferencingMetadata**: `«[ ... ]»`
    2. **contentStream**: `resolved DID document`
    3. **contentMetadata**: `«[ resolved DID document metadata ]»`
07. If the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains the
     [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `hl`:



    [Example 4](https://www.w3.org/TR/did-resolution/#example-4)



    ```
    did:example:1234?hl=zQmWvQxTqbG2Z9HPJgG57jjwR154cKhbtJenbyYTWkjgF3e
    ```





    Issue



    TODO: Specify the algorithm for processing the `hl` DID parameter.

08. If the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains the
     [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `service` and/or the [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `serviceType`, and optionally the
     [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `relativeRef`:



    [Example 5](https://www.w3.org/TR/did-resolution/#example-5)



    ```
    did:example:1234?service=files&relativeRef=%2Fmyresume%2Fdoc%3Fversion%3Dlatest
    ```



    1. From the resolved [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents), select all
        [services](https://www.w3.org/TR/did-core/#services) which fulfill the following conditions:


       1. If the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains the
           [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `service`:
           Select the [service](https://www.w3.org/TR/did-core/#services) if its `id`
           property matches the value of the `service` DID parameter. If the `id`
           property or the `service` DID parameter or both contain relative
           references, the corresponding absolute URIs _MUST_ be resolved and used for determining
           the match, using the rules specified in [RFC3986 Section 5: Reference Resolution](https://www.rfc-editor.org/rfc/rfc3986#section-5)
           and in section [Relative DID URLs](https://www.w3.org/TR/did-core/#relative-did-urls) in [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/).
       2. If the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains the
           [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `serviceType`:
           Select the [service](https://www.w3.org/TR/did-core/#services) if its `type`
           property matches the value of the `serviceType` DID parameter.

 The selected [services](https://www.w3.org/TR/did-core/#services) are a list called the selected [services](https://www.w3.org/TR/did-resolution/#dfn-service).

    2. If the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains the
        [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `relativeRef`:

       1. For each selected [service](https://www.w3.org/TR/did-resolution/#dfn-service):

          1. If the value of the `serviceEndpoint` property of the selected [service](https://www.w3.org/TR/did-resolution/#dfn-service)
              is a [map](https://infra.spec.whatwg.org/#maps), skip this selected [service](https://www.w3.org/TR/did-resolution/#dfn-service).
          2. If the value of the `serviceEndpoint` property of the selected [service](https://www.w3.org/TR/did-resolution/#dfn-service)
              is a [string](https://infra.spec.whatwg.org/#string), add this value to a list of
              selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URLs.
          3. If the value of the `serviceEndpoint` property of the selected [service](https://www.w3.org/TR/did-resolution/#dfn-service)
              is a [set](https://infra.spec.whatwg.org/#ordered-set), add all its items that are [strings](https://infra.spec.whatwg.org/#string)
              to a list of selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URLs.
       2. For each selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL, execute the algorithm specified in
           [RFC3986 Section 5: Reference Resolution](https://www.rfc-editor.org/rfc/rfc3986#section-5) as follows:

          1. The **base URI** value is the selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL.
          2. The **relative reference** is the value of the
              [DID parameter](https://www.w3.org/TR/did-core/#did-parameters) `relativeRef`.
          3. Update the selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL to
              the result of the "Reference Resolution" algorithm.
    3. If the **accept** input [DID dereferencing option](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-options)
        is missing, or if its value is the Media Type of a [representation](https://www.w3.org/TR/did-resolution/#dfn-representations) of a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents):

       1. Update the [services](https://www.w3.org/TR/did-resolution/#dfn-service) in the resolved [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) to contain only the
           selected [services](https://www.w3.org/TR/did-resolution/#dfn-service).
       2. Return the following result:
          1. **dereferencingMetadata**: `«[ ... ]»`
          2. **content**: `resolved DID document with selected services`
          3. **contentMetadata**: `«[ resolved DID document metadata ]»`
    4. If the value of the **accept** input [DID resolution option](https://www.w3.org/TR/did-resolution/#did-resolution-options)
        is **text/uri-list**:

       1. Return the following result:
          1. **dereferencingMetadata**: `«[ ... ]»`
          2. **content**: `« selected service endpoint URLs »`
          3. **contentMetadata**: `«[ "contentType" → "text/uri-list", ... ]»`
    5. Otherwise, return the following result:
       1. **dereferencingMetadata**: `«[ "error" → "representationNotSupported", ... ]»`
       2. **content**: `null`
       3. **contentMetadata**: `«[ ]»`
09. Otherwise, if the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains a [DID path](https://www.w3.org/TR/did-resolution/#dfn-did-paths) and/or [DID query](https://www.w3.org/TR/did-resolution/#dfn-did-queries):



    [Example 6](https://www.w3.org/TR/did-resolution/#example-6)



    ```
    did:example:1234/custom/path?customquery
    ```



    1. The applicable [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) _MAY_ specify how to dereference
        the [DID path](https://www.w3.org/TR/did-resolution/#dfn-did-paths) and/or [DID query](https://www.w3.org/TR/did-resolution/#dfn-did-queries) of the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls).



       [Example 7](https://www.w3.org/TR/did-resolution/#example-7)



       ```
       did:example:1234/resources/1234
       ```

    2. An extension specification _MAY_ specify how to dereference
        the [DID path](https://www.w3.org/TR/did-resolution/#dfn-did-paths) of the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls).



       [Example 8](https://www.w3.org/TR/did-resolution/#example-8)



       ```
       did:example:1234/whois
       ```

    3. An extension specification _MAY_ specify how to dereference
        the [DID query](https://www.w3.org/TR/did-resolution/#dfn-did-queries) of the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls).



       [Example 9](https://www.w3.org/TR/did-resolution/#example-9)



       ```
       did:example:1234?transformKey=JsonWebKey
       ```

    4. The client _MAY_ be able to dereference the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls)
        in an application-specific way.
10. If neither this algorithm, nor the applicable [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s), nor an extension, nor the client
     is able to dereference the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls), return the following result:

    1. **dereferencingMetadata**: `«[ "error" → "notFound" ]»`
    2. **contentStream**: `null`
    3. **contentMetadata**: `«[ ]»`

[Issue 85](https://github.com/w3c/did-resolution/issues/85): Request service by type [enhancement](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22enhancement%22) [pr-exists](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pr-exists%22)

There have been discussions whether in addition to the DID parameter `service`,
there could also be a DID parameter `serviceType` to select services based
on their type rather than ID.
See [comments by Dave Longley](https://lists.w3.org/Archives/Public/public-credentials/2019Jun/0028.html) about `serviceType`.

#### 5.3.2 Dereferencing the Fragment

[Permalink for Section 5.3.2](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-fragment)

If the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains a [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments),
then dereferencing of the fragment is dependent
on the media type (\[[RFC2046](https://www.w3.org/TR/did-resolution/#bib-rfc2046 "Multipurpose Internet Mail Extensions (MIME) Part Two: Media Types")\]) of the resource, i.e., on the result of
[5.3.1 Dereferencing the Resource](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-resource).

1. If the result of [5.3.1 Dereferencing the Resource](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-resource) is a selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL,
    and the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) contains a [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments):



   [Example 10](https://www.w3.org/TR/did-resolution/#example-10)



   ```
   did:example:1234?service=files&relativeRef=%2Fmyresume%2Fdoc%3Fversion%3Dlatest#intro
   ```



   1. If the selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL
       contains a `fragment` component, raise an error.
   2. Append the [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments) to the select [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL. In other words,
       the select [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL "inherits" the [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments) of the
       input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls).
   3. Return the select [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL.
2. Otherwise, dereference the DID fragment as defined by the media type (\[[RFC2046](https://www.w3.org/TR/did-resolution/#bib-rfc2046 "Multipurpose Internet Mail Extensions (MIME) Part Two: Media Types")\]) of the resource.
    For example, if the resource is a representation of a DID document with media type `application/did`, then
    the fragment is treated according to the rules associated with the
    [JSON-LD 1.1: application/ld+json media type](https://www.w3.org/TR/json-ld11/#iana-considerations)
    \[JSON-LD11\].


Note

This use of the [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments) is consistent with the definition of the fragment identifier in
\[[RFC3986](https://www.w3.org/TR/did-resolution/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]. It identifies a _secondary resource_ which is a subset of the _primary resource_
(the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents)).


Note

This behavior of the [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments) is analogous to the handling of a fragment in an HTTP URL in the
case when dereferencing it returns an HTTP `3xx` (Redirection) response with a
`Location` header (see section 7.1.2 of \[[RFC7231](https://www.w3.org/TR/did-resolution/#bib-rfc7231 "Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content")\].


### 5.4 Examples

[Permalink for Section 5.4](https://www.w3.org/TR/did-resolution/#examples)

Given the following input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls):

[Example 11](https://www.w3.org/TR/did-resolution/#example-11)

```
did:example:123456789abcdefghi#keys-1
```

... and the following resolved [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents):

[Example 12](https://www.w3.org/TR/did-resolution/#example-12)

```
{
	"@context": "https://www.w3.org/ns/did/v1",
	"id": "did:example:123456789abcdefghi",
	"verificationMethod": [{\
		"id": "did:example:123456789abcdefghi#keys-1",\
		"type": "Ed25519VerificationKey2018",\
		"controller": "did:example:123456789abcdefghi",\
		"publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
	}],
	"service": [{\
		"id": "did:example:123456789abcdefghi#agent",\
		"type": "AgentService",\
		"serviceEndpoint": "https://agent.example.com/8377464"\
	}, {\
		"id": "did:example:123456789abcdefghi#messages",\
		"type": "MessagingService",\
		"serviceEndpoint": "https://example.com/messages/8377464"\
	}]
}
```

... then the result of the [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing) algorithm is the following output resource:

[Example 13](https://www.w3.org/TR/did-resolution/#example-13)

```
{
	"@context": "https://www.w3.org/ns/did/v1",
	"id": "did:example:123456789abcdefghi#keys-1",
	"type": "Ed25519VerificationKey2018",
	"controller": "did:example:123456789abcdefghi",
	"publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
}
```

Given the following input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) and the same resolved [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) as above:

[Example 14](https://www.w3.org/TR/did-resolution/#example-14)

```
did:example:123456789abcdefghi?service=messages&relativeRef=%2Fsome%2Fpath%3Fquery#frag
```

... then the result of the [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing) algorithm is the following selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL:

[Example 15](https://www.w3.org/TR/did-resolution/#example-15)

```
https://example.com/messages/8377464/some/path?query#frag
```

![Diagram showing how a DID URL can be dereferenced to a service endpoint URL](https://www.w3.org/TR/did-resolution/diagrams/did-url-dereferencing.png)[Figure 2](https://www.w3.org/TR/did-resolution/#figure-dereferencing)
 Dereferencing a DID URL to a service endpoint URL.


Issue

Change the diagram and/or examples to make them consistent.

## 6\. Metadata Structure

[Permalink for Section 6.](https://www.w3.org/TR/did-resolution/#metadata-structure)

Input and output metadata is often involved during the [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution),
[DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing), and other DID-related processes. The structure
used to communicate this metadata _MUST_ be a [map](https://infra.spec.whatwg.org/#maps)
of properties. Each property name _MUST_ be a [string](https://infra.spec.whatwg.org/#string). Each property value _MUST_ be a [string](https://infra.spec.whatwg.org/#string), [map](https://infra.spec.whatwg.org/#maps), [list](https://infra.spec.whatwg.org/#list), [set](https://infra.spec.whatwg.org/#ordered-set),
[boolean](https://infra.spec.whatwg.org/#boolean), or
[null](https://infra.spec.whatwg.org/#nulls). The values within any complex data
structures such as maps and lists _MUST_ be one of these data types as well.
All metadata property definitions registered in the DID Specification
Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-resolution/#bib-did-spec-registries "Decentralized Identifier Extensions")\] _MUST_ define the value type, including any
additional formats or restrictions to that value (for example, a string
formatted as a date or as a decimal integer). It is _RECOMMENDED_ that property
definitions use strings for values. The entire metadata structure _MUST_ be
serializable according to the [JSON\\
serialization rules](https://infra.spec.whatwg.org/#serialize-an-infra-value-to-json-bytes) in the \[[INFRA](https://www.w3.org/TR/did-resolution/#bib-infra "Infra Standard")\] specification. Implementations _MAY_
serialize the metadata structure to other data formats.


All implementations of functions that use metadata structures as either input or
output are able to fully represent all data types described here in a
deterministic fashion. As inputs and outputs using metadata structures are
defined in terms of data types and not their serialization, the method for
[representation](https://www.w3.org/TR/did-resolution/#dfn-representations) is internal to the implementation of the function and is
out of scope of this specification.


The following example demonstrates a JSON-encoded metadata structure that
might be used as [DID\\
resolution input metadata](https://www.w3.org/TR/did-resolution/#did-resolution-options).


[Example 16](https://www.w3.org/TR/did-resolution/#example-json-encoded-did-resolution-input-metadata-example): JSON-encoded DID resolution input metadata example

```hljs json
{
"accept": "application/did+ld+json"
}
```

This example corresponds to a metadata structure of the following format:


[Example 17](https://www.w3.org/TR/did-resolution/#example-did-resolution-input-metadata-example): DID resolution input metadata example

```hljs abnf
«[\
"accept" → "application/did+ld+json"\
]»
```

The next example demonstrates a JSON-encoded metadata structure that might be
used as [DID resolution\\
metadata](https://www.w3.org/TR/did-resolution/#did-resolution-options) if a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) was not found.


[Example 18](https://www.w3.org/TR/did-resolution/#example-json-encoded-did-resolution-metadata-example): JSON-encoded DID resolution metadata example

```hljs json
{
"error": "notFound"
}
```

This example corresponds to a metadata structure of the following format:


[Example 19](https://www.w3.org/TR/did-resolution/#example-did-resolution-metadata-example): DID resolution metadata example

```hljs abnf
«[\
"error" → "notFound"\
]»
```

The next example demonstrates a JSON-encoded metadata structure that might be
used as [DID document metadata](https://www.w3.org/TR/did-resolution/#did-document-metadata)
to describe timestamps associated with the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).


[Example 20](https://www.w3.org/TR/did-resolution/#example-json-encoded-did-document-metadata-example): JSON-encoded DID document metadata example

```hljs json
{
"created": "2019-03-23T06:35:22Z",
"updated": "2023-08-10T13:40:06Z"
}
```

This example corresponds to a metadata structure of the following format:


[Example 21](https://www.w3.org/TR/did-resolution/#example-did-document-metadata-example): DID document metadata example

```hljs javascript
«[\
"created" → "2019-03-23T06:35:22Z",\
"updated" → "2023-08-10T13:40:06Z"\
]»
```

## 7\. DID Resolution Architectures

[Permalink for Section 7.](https://www.w3.org/TR/did-resolution/#architectures)

Issue

TODO: Describe how [DID resolvers](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) are implemented and used, describe the relevance
of [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).
Explain the difference between "method architectures" and "resolver architectures".

### 7.1 Method Architectures

[Permalink for Section 7.1](https://www.w3.org/TR/did-resolution/#method-architectures)

The [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm involves executing the [Read](https://www.w3.org/TR/did-core/#method-operations)
operation on a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) according to its [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) (see [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving)).

Note

The mechanics of the "Read" operation can vary considerably between
[DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s). In particular, no assumption should be made that:

- ... an immutable blockchain is used as (part of) the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry).
- ... interaction with a remote network is required during execution of the "Read" operation.
- ... an actual [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) is stored in plain-text on a [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry),
or that the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) can simply be retrieved via a standard protocol such as HTTP(S).
While some [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) may define their "Read" operation this way, others may
define more complex multi-step processes that involve on-the-fly construction of a "virtual" [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).

Issue

As an example, mention what it means to "resolve" peer/off-ledger/microledger/edgechain DIDs (for instance, see
\[[DID-PEER](https://www.w3.org/TR/did-resolution/#bib-did-peer "Peer DID Method Specification")\] and
[here](https://docs.google.com/presentation/d/1UnC_nfOUK40WS5TD_EhyDuFe5cStX-u0Z7wjoae_PqQ/)).

Issue

As an example, mention what it means to "resolve" DIDs that are simply wrapped public keys (for instance, see
\[[DID-KEY](https://www.w3.org/TR/did-resolution/#bib-did-key "The did:key Method")\] and
[here](https://github.com/w3c/did-spec/pull/55)).

Depending on the exact nature of the [DID method's](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) "Read" operation, the interaction between a
[DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) and the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry) may be implemented as a [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read)
or [unverifiable read](https://www.w3.org/TR/did-resolution/#dfn-unverifiable-read):

![Diagram showing a 'verifiable read' implementation of a DID method.](https://www.w3.org/TR/did-resolution/diagrams/method-verifiable.png)[Figure 3](https://www.w3.org/TR/did-resolution/#figure-method-verifiable)
 A [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) implementation of a [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).
 ![Diagram showing an 'unverifiable read' implementation of a DID method.](https://www.w3.org/TR/did-resolution/diagrams/method-unverifiable.png)[Figure 4](https://www.w3.org/TR/did-resolution/#figure-method-unverifiable)
 An [unverifiable read](https://www.w3.org/TR/did-resolution/#dfn-unverifiable-read) implementation of a [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).


A [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) maximizes confidence in the integrity and correctness of the result of the "Read" operation ‐ to the extent
possible under the applicable [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s). It can be implemented in a variety of ways, for example:


- A "Read" operation may be considered "Verifiable" if access to the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry) is
   possible via a local, trusted network host. In the case of blockchain-based [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s), a blockchain full node
   may be run on a local network host in order to implement a [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read).
- The [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) may be remotely connected to the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry) but have some method
   to verify the contents of the response of the "Read" operation. In the case of blockchain-based [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s), even if
   direct access to a blockchain full node is not available, a [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) may still be possible by running a light client that
   processes metadata to verify that the result of the "Read" operation hasn't been tampered with.
- A [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) may be implemented if access to the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry) happens via a remote
   network host that is considered trusted because it is run on a personal device in the home and accessed via
   a secure channel.

An [unverifiable read](https://www.w3.org/TR/did-resolution/#dfn-unverifiable-read) does not have such guarantees and is therefore less desirable, for example:


- A "Read" operation may be considered "Unverifiable" if access to the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry) happens
   via a remote, untrusted intermediary. In the case of blockchain-based [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s), a remote blockchain explorer API
   operated by an third party may be used to look up data from the blockchain.

Whether or not a [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) is possible depends not only on a [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) itself, but also on the way how
a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) implements it. [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) _MAY_ define multiple different ways of implementing their "Read"
operation(s) and _SHOULD_ offer guidance on how to implement a [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) in at least one way.


Note

The guarantees associated with a [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) are still always limited by the architectures, protocols, cryptography,
and other aspects of the underlying [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry). The strongest forms of [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read)
implementations are considered those that do not require any interaction with a remote network at all (for example, see
\[[DID-KEY](https://www.w3.org/TR/did-resolution/#bib-did-key "The did:key Method")\]), or that minimize dependencies on specific network infrastructure and reduce the "root of trust"
to proven entropy and cryptography alone (for example, see \[[KERI](https://www.w3.org/TR/did-resolution/#bib-keri "Key Event Receipt Infrastructure (KERI)")\]).


Issue

TODO: Describe how a client can potentially verify the result of a "Read" operation independently even if it does
not trust the DID resolver (e.g., using state proofs).

A [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) _MUST_ support the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm for at least one [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) and
_MAY_ support it for multiple [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s):

![Diagram showing a DID resolver that supports multiple DID methods.](https://www.w3.org/TR/did-resolution/diagrams/method-multiple.png)[Figure 5](https://www.w3.org/TR/did-resolution/#figure-method-multiple)
 A [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) that supports multiple [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).


In this case, the above considerations about [verifiable read](https://www.w3.org/TR/did-resolution/#dfn-verifiable-read) and [unverifiable read](https://www.w3.org/TR/did-resolution/#dfn-unverifiable-read)
implementations apply to each supported [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) individually.

### 7.2 Resolver Architectures

[Permalink for Section 7.2](https://www.w3.org/TR/did-resolution/#resolver-architectures)

The algorithms for [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) and [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) are defined as abstract functions
(see [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving) and [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing)).

 Those algorithms are implemented by [DID resolvers](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s). A [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) is invoked by a [client](https://www.w3.org/TR/did-resolution/#dfn-client)
 via a [binding](https://www.w3.org/TR/did-resolution/#dfn-binding). Bindings define how the abstract functions are realized using concrete
 programming or communication interfaces. It is possible to distinguish between [local bindings](https://www.w3.org/TR/did-resolution/#dfn-local-binding)
 (such as a local command line tool or library API) and [remote bindings](https://www.w3.org/TR/did-resolution/#dfn-remote-binding) (such as the
 [HTTP(S) binding](https://www.w3.org/TR/did-resolution/#bindings-https)).

![Diagram showing a DID resolver with a 'local binding'.](https://www.w3.org/TR/did-resolution/diagrams/binding-local.png)[Figure 6](https://www.w3.org/TR/did-resolution/#figure-binding-local)
 A [local binding](https://www.w3.org/TR/did-resolution/#dfn-local-binding) for a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s).
 ![Diagram showing a DID resolver with a 'remote binding'.](https://www.w3.org/TR/did-resolution/diagrams/binding-remote.png)[Figure 7](https://www.w3.org/TR/did-resolution/#figure-binding-remote)
 A [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding) for a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s).


[Issue 28](https://github.com/w3c/did-resolution/issues/28): 'remote' vs 'local' DID Resolvers

TODO: Describe [local bindings](https://www.w3.org/TR/did-resolution/#dfn-local-binding) vs. [remote bindings](https://www.w3.org/TR/did-resolution/#dfn-remote-binding), and implications for privacy, security and trust.

Also describe mitigations against potential downsides of [remote bindings](https://www.w3.org/TR/did-resolution/#dfn-remote-binding), e.g.:

- A [DID resolver's](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding) can use a trusted channel such as VPN or TLS with mutual authentication.
- A [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) can add a data integrity proof (see \[[DATA-INTEGRITY](https://www.w3.org/TR/did-resolution/#bib-data-integrity "Verifiable Credential Data Integrity 1.0")\])
to a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) and/or the [DID resolution result](https://www.w3.org/TR/did-resolution/#dfn-did-resolution-result). Discuss what this does and doesn't achieve. Also see
[Proving Control and Binding](https://www.w3.org/TR/did-core/#proving-control-and-binding).
- A client could query multiple [DID resolvers](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) over a [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding) and compare results.

Issue

TODO: Discuss DID resolution in constrained user agents such as mobile apps and browsers.

#### 7.2.1 Proxied Resolution

[Permalink for Section 7.2.1](https://www.w3.org/TR/did-resolution/#resolver-architectures-proxied)

A [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) _MAY_ invoke another [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s), which serves as a proxy that executes
the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) algorithm as defined in [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving).

The first [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) then acts
as a [client](https://www.w3.org/TR/did-resolution/#dfn-client) and chooses a suitable [binding](https://www.w3.org/TR/did-resolution/#dfn-binding) for invoking the second [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s). For example, a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) may be
invoked via a [local binding](https://www.w3.org/TR/did-resolution/#dfn-local-binding) (such as a command line tool), which in turn invokes another [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s)
via a [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding) (such as the [HTTP(S) binding](https://www.w3.org/TR/did-resolution/#bindings-https)).

![Diagram showing two DID resolvers, one invoked via 'local binding', the other invoked via 'remote binding'.](https://www.w3.org/TR/did-resolution/diagrams/proxied-dereferencing.png)[Figure 8](https://www.w3.org/TR/did-resolution/#figure-proxied-dereferencing)
 A client invokes a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) via [local binding](https://www.w3.org/TR/did-resolution/#dfn-local-binding) which invokes another [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) via
 [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding), which in turn supports resolving multiple [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).


Note

This is similar to a "stub resolver" invoking a "recursive resolver" in DNS architecture, although
the concepts are not entirely comparable (DNS Resolution uses a single concrete protocol, whereas DID resolution
is an abstract function realized by different [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) and different [bindings](https://www.w3.org/TR/did-resolution/#dfn-binding)).

#### 7.2.2 Client-Side Dereferencing

[Permalink for Section 7.2.2](https://www.w3.org/TR/did-resolution/#resolver-architectures-client-side)

Different parts of the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing)
algorithm may be performed by different components of a [Resolver Architecture](https://www.w3.org/TR/did-resolution/#resolver-architectures).

Specifically, when a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) with a [DID fragment](https://www.w3.org/TR/did-resolution/#dfn-did-fragments) is dereferenced, then
[Dereferencing the Resource](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-resource) is done by
the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s), and
[Dereferencing the Fragment](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-fragment) is done by the [client](https://www.w3.org/TR/did-resolution/#dfn-client).

Example: Given the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) `did:xyz:1234#keys-1`, a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) could be invoked
via [local binding](https://www.w3.org/TR/did-resolution/#dfn-local-binding)
for [Dereferencing the Resource](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-resource) (i.e., the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents)),
and the [client](https://www.w3.org/TR/did-resolution/#dfn-client) could complete the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) algorithm by
[Dereferencing the Fragment](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-fragment) (i.e., a part of the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents)).

![Diagram showing client-side dereferencing of a DID URL by a DID resolver and a client](https://www.w3.org/TR/did-resolution/diagrams/client-side-dereferencing-1.png)[Figure 9](https://www.w3.org/TR/did-resolution/#figure-client-side-dereferencing-1)
 Client-side dereferencing of a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) by a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) and a [client](https://www.w3.org/TR/did-resolution/#dfn-client).


Example: Given the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) `did:xyz:1234#keys-1`, a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) could be invoked via
[local binding](https://www.w3.org/TR/did-resolution/#dfn-local-binding) which invokes another [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) via [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding)
for [Dereferencing the Resource](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-resource) (i.e., the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents)),
and the [client](https://www.w3.org/TR/did-resolution/#dfn-client) could complete the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) algorithm by
[Dereferencing the Fragment](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-fragment) (i.e., a part of the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents)).

![Diagram showing client-side dereferencing of a DID URL by two DID resolvers and a client](https://www.w3.org/TR/did-resolution/diagrams/client-side-dereferencing-2.png)[Figure 10](https://www.w3.org/TR/did-resolution/#figure-client-side-dereferencing-3)
 Client-side dereferencing (in combination with [Proxied Resolution](https://www.w3.org/TR/did-resolution/#resolver-architectures-proxied))
 of a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) by two [DID resolvers](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) and a [client](https://www.w3.org/TR/did-resolution/#dfn-client).


Example: Given the [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) `did:xyz:1234?service=agent&relativeRef=%2Fsome%2Fpath%3Fquery#frag`, a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) could be invoked
for [Dereferencing the Resource](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-resource) (i.e., a [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL),
and the [client](https://www.w3.org/TR/did-resolution/#dfn-client) could complete the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) algorithm by
[Dereferencing the Fragment](https://www.w3.org/TR/did-resolution/#dereferencing-algorithm-fragment) (i.e., a [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL with a fragment).

![Diagram showing client-side dereferencing of a DID URL by a DID resolver and a client](https://www.w3.org/TR/did-resolution/diagrams/client-side-dereferencing-3.png)[Figure 11](https://www.w3.org/TR/did-resolution/#figure-client-side-dereferencing-2)
 Client-side dereferencing of a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) by a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) and a [client](https://www.w3.org/TR/did-resolution/#dfn-client).


## 8\. DID Resolution Result

[Permalink for Section 8.](https://www.w3.org/TR/did-resolution/#did-resolution-result)

This section defines a data structure that represents the result of the algorithm described
in [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving). A [DID resolution result](https://www.w3.org/TR/did-resolution/#dfn-did-resolution-result) contains
a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) as well as
[DID resolution metadata](https://www.w3.org/TR/did-resolution/#output-resolutionmetadata) and [DID\\
document metadata](https://www.w3.org/TR/did-resolution/#output-documentmetadata).

The media type of this data structure is defined to be `application/ld+json;profile="https://w3id.org/did-resolution"`.

### 8.1 Example

[Permalink for Section 8.1](https://www.w3.org/TR/did-resolution/#example)

[Example 22](https://www.w3.org/TR/did-resolution/#example-example-did-resolution-result): Example DID resolution result

```
{
	"@context": "https://w3id.org/did-resolution/v1",
	"didDocument": {
		"@context": "https://www.w3.org/ns/did/v1",
		"id": "did:example:123456789abcdefghi",
		"authentication": [{\
			"id": "did:example:123456789abcdefghi#keys-1",\
			"type": "Ed25519VerificationKey2018",\
			"controller": "did:example:123456789abcdefghi",\
			"publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
		}],
		"service": [{\
			"id":"did:example:123456789abcdefghi#vcs",\
			"type": "VerifiableCredentialService",\
			"serviceEndpoint": "https://example.com/vc/"\
		}]
	},
	"didResolutionMetadata": {
		"contentType": "application/did+ld+json",
		"retrieved": "2024-06-01T19:73:24Z",
	},
	"didDocumentMetadata": {
		"created": "2019-03-23T06:35:22Z",
		"updated": "2023-08-10T13:40:06Z",
		"method": {
			"nymResponse": {
				"result": {
					"data": "{\"dest\":\"WRfXPg8dantKVubE3HX8pw\",\"identifier\":\"V4SGRU86Z58d6TV7PBUe6f\",\"role\":\"0\",\"seqNo\":11,\"txnTime\":1524055264,\"verkey\":\"H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV\"}",
					"type": "105",
					"txnTime": 1.524055264E9,
					"seqNo": 11.0,
					"reqId": 1.52725687080231475E18,
					"identifier": "HixkhyA4dXGz9yxmLQC4PU",
					"dest": "WRfXPg8dantKVubE3HX8pw"
				},
				"op": "REPLY"
			},
			"attrResponse": {
				"result": {
					"identifier": "HixkhyA4dXGz9yxmLQC4PU",
					"seqNo": 12.0,
					"raw": "endpoint",
					"dest": "WRfXPg8dantKVubE3HX8pw",
					"data": "{\"endpoint\":{\"xdi\":\"http://127.0.0.1:8080/xdi\"}}",
					"txnTime": 1.524055265E9,
					"type": "104",
					"reqId": 1.52725687092557056E18
				},
				"op": "REPLY"
			}
		}
	}
}
```

[Issue 23](https://github.com/w3c/did-resolution/issues/23): The did is not a url for the did, but for a resolution structure which as yet has no name [pending-close](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pending-close%22)

See corresponding open issue.

Issue

Need to define how this data structure works exactly, and whether it always contains
a [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) or can also contain other results.

### 8.2 DID Document

[Permalink for Section 8.2](https://www.w3.org/TR/did-resolution/#output-diddocument)

A [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) associated with a [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers). The result of [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving).

### 8.3 DID Resolution Metadata

[Permalink for Section 8.3](https://www.w3.org/TR/did-resolution/#output-resolutionmetadata)

This is a metadata structure (see section [Metadata Structure](https://www.w3.org/TR/did-core/#metadata-structure)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\]) that contains metadata about the [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) process.

This metadata typically changes between invocations of the [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) functions as it represents data about the resolution process itself.

The source of this metadata is the DID resolver.

Examples of DID Resolution Metadata include:

- Media type of the returned content (the **contentType** metadata property).
- Error code (the **error** metadata property).
- Duration of the DID resolution process.
- Caching information about the DID document (see Section [12.2 Caching](https://www.w3.org/TR/did-resolution/#caching)).
- Various URLs, IP addresses or other network information that was used during the DID resolution process.
- Proofs added by a DID resolver (e.g., to establish trusted resolution).

See also section [DID Resolution Metadata](https://www.w3.org/TR/did-core/#did-resolution-metadata)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\].

### 8.4 DID Document Metadata

[Permalink for Section 8.4](https://www.w3.org/TR/did-resolution/#output-documentmetadata)

This is a metadata structure (see section [Metadata Structure](https://www.w3.org/TR/did-core/#metadata-structure)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\]) that contains metadata about a [DID Document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).

This metadata typically does not change between invocations of the [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function unless the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) changes, as it represents data about the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).

The sources of this metadata are the [DID controller](https://www.w3.org/TR/did-resolution/#dfn-did-controllers) and/or the [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).

Examples of DID Document Metadata include:

- Timestamps when the DID and its associated DID document were created or updated (the **created** and **updated** metadata properties).
- Metadata about controllers, capabilities, delegations, etc.
- Versioning information about the DID document (see Section [12.3 Versioning](https://www.w3.org/TR/did-resolution/#versioning)).
- Proofs added by a DID controller (e.g., to establish control authority).

DID Document Metadata may also include method-specific metadata, e.g.:

- State proofs from the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry).
- Block number, index, transaction hash, number of confirmations, etc. of a record in the blockchain or other [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry).

See also section [DID Document Metadata](https://www.w3.org/TR/did-core/#did-document-metadata)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\].

Issue

For certain data, it may be debatable whether it should be part of the DID document
(i.e., data that describes the DID Subject), or whether it is metadata (i.e., data about the DID document or about
the DID resolution process). For example the URL of the "Continuation DID document" in the BTCR method.


## 9\. DID URL Dereferencing Result

[Permalink for Section 9.](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-result)

This section defines a data structure that represents the result of the algorithm described
in [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing). A [DID URL dereferencing result](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing-result) contains
arbitrary content as well as
[DID resolution metadata](https://www.w3.org/TR/did-resolution/#output-dereferencingmetadata) and [content metadata](https://www.w3.org/TR/did-resolution/#output-contentmetadata).

[Issue 69](https://github.com/w3c/did-resolution/issues/69): DID Resolution Result for DID URL Dereferencing [enhancement](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22enhancement%22) [pending-close](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pending-close%22)

See corresponding open issue.

The media type of this data structure is defined to be `application/ld+json;profile="https://w3id.org/did-resolution"`.

### 9.1 Example

[Permalink for Section 9.1](https://www.w3.org/TR/did-resolution/#example-0)

[Example 23](https://www.w3.org/TR/did-resolution/#example-example-did-url-dereferencing-result): Example DID URL dereferencing result

```
{
	"@context": "https://w3id.org/did-resolution/v1",
	"content": {
		"@context": "https://www.w3.org/ns/did/v1",
		"id": "did:example:123456789abcdefghi",
		"authentication": [{\
			"id": "did:example:123456789abcdefghi#keys-1",\
			"type": "Ed25519VerificationKey2018",\
			"controller": "did:example:123456789abcdefghi",\
			"publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
		}],
		"service": [{\
			"id":"did:example:123456789abcdefghi#vcs",\
			"type": "VerifiableCredentialService",\
			"serviceEndpoint": "https://example.com/vc/"\
		}]
	},
	"didUrlDereferencingMetadata": {
		"contentType": "application/did+ld+json",
		"retrieved": "2024-06-01T19:73:24Z",
	},
	"contentMetadata": {
		"created": "2019-03-23T06:35:22Z",
		"updated": "2023-08-10T13:40:06Z",
		"method": {
			"nymResponse": {
				"result": {
					"data": "{\"dest\":\"WRfXPg8dantKVubE3HX8pw\",\"identifier\":\"V4SGRU86Z58d6TV7PBUe6f\",\"role\":\"0\",\"seqNo\":11,\"txnTime\":1524055264,\"verkey\":\"H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV\"}",
					"type": "105",
					"txnTime": 1.524055264E9,
					"seqNo": 11.0,
					"reqId": 1.52725687080231475E18,
					"identifier": "HixkhyA4dXGz9yxmLQC4PU",
					"dest": "WRfXPg8dantKVubE3HX8pw"
				},
				"op": "REPLY"
			},
			"attrResponse": {
				"result": {
					"identifier": "HixkhyA4dXGz9yxmLQC4PU",
					"seqNo": 12.0,
					"raw": "endpoint",
					"dest": "WRfXPg8dantKVubE3HX8pw",
					"data": "{\"endpoint\":{\"xdi\":\"http://127.0.0.1:8080/xdi\"}}",
					"txnTime": 1.524055265E9,
					"type": "104",
					"reqId": 1.52725687092557056E18
				},
				"op": "REPLY"
			}
		}
	}
}
```

### 9.2 Content

[Permalink for Section 9.2](https://www.w3.org/TR/did-resolution/#output-content)

Arbitrary content associated with a [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls). The result of [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing).

### 9.3 DID URL Dereferencing Metadata

[Permalink for Section 9.3](https://www.w3.org/TR/did-resolution/#output-dereferencingmetadata)

This is a metadata structure (see section [Metadata Structure](https://www.w3.org/TR/did-core/#metadata-structure)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\]) that contains metadata about the [DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) process.

This metadata typically changes between invocations of the [DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) functions as it represents data about the dereferencing process itself.

Issue

Add more details how DID URL dereferencing metadata works.

See also section [DID URL Dereferencing Metadata](https://www.w3.org/TR/did-core/#did-url-dereferencing-metadata)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\].

### 9.4 Content Metadata

[Permalink for Section 9.4](https://www.w3.org/TR/did-resolution/#output-contentmetadata)

This is a metadata structure (see section [Metadata Structure](https://www.w3.org/TR/did-core/#metadata-structure)
in \[[DID-CORE](https://www.w3.org/TR/did-resolution/#bib-did-core "Decentralized Identifiers (DIDs) v1.0")\]) that contains metadata about the content.

This metadata typically does not change between invocations of the [DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function unless the content changes, as it represents data about the content.

Issue

Add more details how content metadata works.

## 10\. Errors

[Permalink for Section 10.](https://www.w3.org/TR/did-resolution/#errors)

### 10.1 invalidDid

[Permalink for Section 10.1](https://www.w3.org/TR/did-resolution/#invaliddid)

If an invalid DID is detected during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution),
the value of the DID Resolution Metadata **error** property _MUST_ be **invalidDid**
as defined in section [4.2 DID Resolution Metadata](https://www.w3.org/TR/did-resolution/#did-resolution-metadata).


### 10.2 invalidDidUrl

[Permalink for Section 10.2](https://www.w3.org/TR/did-resolution/#invaliddidurl)

If an invalid DID URL is detected during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution or DID URL Dereferencing Metadata **error** property _MUST_ be **invalidDidUrl**
as defined in section [5.2 DID URL Dereferencing Metadata](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-metadata).


### 10.3 notFound

[Permalink for Section 10.3](https://www.w3.org/TR/did-resolution/#notfound)

If during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) a DID or DID URL doesn't exist,
the value of the DID Resolution or DID URL dereferencing Metadata **error** property _MUST_ be **notFound** as
defined in sections [4.2 DID Resolution Metadata](https://www.w3.org/TR/did-resolution/#did-resolution-metadata) and
[5.2 DID URL Dereferencing Metadata](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-metadata).


### 10.4 representationNotSupported

[Permalink for Section 10.4](https://www.w3.org/TR/did-resolution/#representationnotsupported)

If a DID document representation is not supported during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution Metadata **error** property _MUST_ be **representationNotSupported** as
defined in section [4.2 DID Resolution Metadata](https://www.w3.org/TR/did-resolution/#did-resolution-metadata).


### 10.5 methodNotSupported

[Permalink for Section 10.5](https://www.w3.org/TR/did-resolution/#methodnotsupported)

If a DID method is not supported during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution or DID URL Dereferencing Metadata **error** property _MUST_ be **methodNotSupported**.


### 10.6 internalError

[Permalink for Section 10.6](https://www.w3.org/TR/did-resolution/#internalerror)

When an unexpected error occurs during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution or DID URL Dereferencing Metadata **error** property _MUST_ be **internalError**.


### 10.7 invalidPublicKey

[Permalink for Section 10.7](https://www.w3.org/TR/did-resolution/#invalidpublickey)

If an invalid public key value is detected during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution or DID URL Dereferencing Metadata **error** property _MUST_ be **invalidPublicKey**.


### 10.8 invalidPublicKeyLength

[Permalink for Section 10.8](https://www.w3.org/TR/did-resolution/#invalidpublickeylength)

If the byte length of _rawPublicKeyBytes_ does not match the expected public key length for the associated multicodecValue during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution or DID URL Dereferencing Metadata **error** property _MUST_ be **invalidPublicKeyLength**.


### 10.9 invalidPublicKeyType

[Permalink for Section 10.9](https://www.w3.org/TR/did-resolution/#invalidpublickeytype)

If an invalid public key type is detected during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution or DID URL Dereferencing Metadata **error** property _MUST_ be **invalidPublicKeyType**.


### 10.10 unsupportedPublicKeyType

[Permalink for Section 10.10](https://www.w3.org/TR/did-resolution/#unsupportedpublickeytype)

If an unsupported public key type is detected during [DID Resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing),
the value of the DID Resolution or DID URL Dereferencing Metadata **error** property _MUST_ be **unsupportedPublicKeyType**.


## 11\. Bindings

[Permalink for Section 11.](https://www.w3.org/TR/did-resolution/#bindings)

This section defines bindings for the abstract algorithms in sections [4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving) and
[5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing).

### 11.1 HTTP(S) Binding

[Permalink for Section 11.1](https://www.w3.org/TR/did-resolution/#bindings-https)

This section defines a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) [binding](https://www.w3.org/TR/did-resolution/#dfn-binding) which exposes the
[DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) and/or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) functions (including all
resolution/dereferencing options and metadata) via an HTTP(S) endpoint. See [7.2 Resolver Architectures](https://www.w3.org/TR/did-resolution/#resolver-architectures).

The HTTP(S) binding is a [remote binding](https://www.w3.org/TR/did-resolution/#dfn-remote-binding). It requires a known HTTP(S) URL where a remote
[DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) can be invoked. This URL is called the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) HTTP(S) endpoint

Using this binding, the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function (see
[4\. DID Resolution](https://www.w3.org/TR/did-resolution/#resolving)) and/or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function (see [5\. DID URL Dereferencing](https://www.w3.org/TR/did-resolution/#dereferencing))
can be executed as follows:

1. Initialize a request HTTP(S) URL with the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) HTTP(S) endpoint.



   [Example 24](https://www.w3.org/TR/did-resolution/#example-24)



   ```
   https://resolver.example/1.0/identifiers/
   ```

2. For the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function:

   1. Append the input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) to the request HTTP(S) URL.



      [Example 25](https://www.w3.org/TR/did-resolution/#example-25)



      ```
      https://resolver.example/1.0/identifiers/did:example:1234
      ```

   2. Set the `Accept` HTTP request header to `application/ld+json;profile="https://w3id.org/did-resolution"`
       in order to request a complete [8\. DID Resolution Result](https://www.w3.org/TR/did-resolution/#did-resolution-result), OR
   3. set the `Accept` HTTP request header to the value of the **accept** resolution option.
   4. If any other resolution options are provided:

      1. The input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers) _MUST_ be URL-encoded (as specified in [RFC3986 Section 2.1](https://www.rfc-editor.org/rfc/rfc3986#section-2.1)).
      2. Encode all resolution options except **accept** as
          query parameters in the request HTTP(S) URL.



         [Example 26](https://www.w3.org/TR/did-resolution/#example-26)



         ```
         https://resolver.example/1.0/identifiers/did%3Aexample%3A1234?option1=value1&option2=value2
         ```
3. For the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function:

   1. Append the input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) to the request HTTP(S) URL.



      [Example 27](https://www.w3.org/TR/did-resolution/#example-27)



      ```
      https://resolver.example/1.0/identifiers/did:example:1234?service=files&relativeRef=/resume.pdf
      ```

   2. Set the `Accept` HTTP request header to `application/ld+json;profile="https://w3id.org/did-url-dereferencing"`
       in order to request a complete [9\. DID URL Dereferencing Result](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-result), OR
   3. set the `Accept` HTTP request header to the value of the **accept** dereferencing option.
   4. If any other dereferencing options are provided:

      1. The input [DID URL](https://www.w3.org/TR/did-resolution/#dfn-did-urls) _MUST_ be URL-encoded (as specified in [RFC3986 Section 2.1](https://www.rfc-editor.org/rfc/rfc3986#section-2.1)).
      2. Encode all dereferencing options except **accept** as
          query parameters in the request HTTP(S) URL.



         [Example 28](https://www.w3.org/TR/did-resolution/#example-28)



         ```
         https://resolver.example/1.0/identifiers/did%3Aexample%3A1234%3Fservice%3Dfiles%26relativeRef%3D%2Fresume.pdf?option1=value1&option2=value2
         ```
4. Execute an HTTP `GET` request on the request HTTP(S) URL. This invokes the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or
    [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function at the remote [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s).
5. If the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function returns an **error** metadata property in the
    **didResolutionMetadata** or **dereferencingMetadata**,
    then the HTTP response status code _MUST_ correspond to the value of the **error** metadata property,
    according to the following table:



   | error | HTTP status code |
   | --- | --- |
   | `invalidDid` | `400` |
   | `invalidDidUrl` | `400` |
   | `notFound` | `404` |
   | `representationNotSupported` | `406` |
   | `methodNotSupported` | `501` |
   | `internalError` | `500` |
   | (any other value) | `500` |

6. If the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) or [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function returns a **deactivated** metadata property with
    the value `true` in the **didDocumentMetadata** or **contentMetadata**:

   1. The HTTP response status code _MUST_ be `410`.
7. For the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function:

   1. If the value of the `Content-Type` HTTP response header is `application/ld+json;profile="https://w3id.org/did-resolution"`:

      1. The HTTP body _MUST_ contain a [DID resolution result](https://www.w3.org/TR/did-resolution/#dfn-did-resolution-result) (see [8\. DID Resolution Result](https://www.w3.org/TR/did-resolution/#did-resolution-result)) that
          is the result of the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function.
   2. If the function is successful and returns a **didDocument**:

      1. The HTTP response status code _MUST_ be `200`.
      2. The HTTP response _MUST_ contain a `Content-Type` HTTP response header. Its value _MUST_ be the value of the
          **contentType** metadata property in the **didResolutionMetadata** (see [4.2 DID Resolution Metadata](https://www.w3.org/TR/did-resolution/#did-resolution-metadata)).
      3. The HTTP response body _MUST_ contain the **didDocument** that is the result of the
          [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) function, in the representation corresponding to the `Content-Type` HTTP response header.
8. For the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function:

   1. If the value of the `Content-Type` HTTP response header is `application/ld+json;profile="https://w3id.org/did-url-dereferencing"`:

      1. The HTTP body _MUST_ contain a [DID URL dereferencing result](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing-result) (see [9\. DID URL Dereferencing Result](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-result)) that
          is the result of the [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function.
   2. If the function is successful and returns a **contentStream** and a **contentType** metadata property with the value `text/uri-list` in the **dereferencingMetadata**:

      1. The HTTP response status code _MUST_ be `303`.
      2. The HTTP response _MUST_ contain an `Location` header. The value of this header
          _MUST_ be the selected [service endpoint](https://www.w3.org/TR/did-resolution/#dfn-service-endpoints) URL.
      3. the HTTP response body _MUST_ be empty.
   3. If the function is successful and returns a **contentStream** with any other **contentType**:

      1. The HTTP response status code _MUST_ be `200`.
      2. The HTTP response _MUST_ contain a `Content-Type` HTTP response header. Its value _MUST_ be the value of the
          **contentType** metadata property in the **dereferencingMetadata** (see [5.2 DID URL Dereferencing Metadata](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-metadata)).
      3. The HTTP response body _MUST_ contain the **contentStream** that is the result of the
          [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) function, in the representation corresponding to the `Content-Type` HTTP response header.

See [here](https://github.com/decentralized-identity/universal-resolver/blob/main/openapi/openapi.yaml) for an OpenAPI definition.

### 11.2 DID Resolution Examples

[Permalink for Section 11.2](https://www.w3.org/TR/did-resolution/#did-resolution-examples)

Given the following [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) HTTP(S) endpoint:

`
https://resolver.example/1.0/identifiers/`

And given the following input [DID](https://www.w3.org/TR/did-resolution/#dfn-decentralized-identifiers):

`
did:sov:WRfXPg8dantKVubE3HX8pw`

Then the request HTTP(S) URL is:

`
https://resolver.example/1.0/identifiers/did:sov:WRfXPg8dantKVubE3HX8pw`

The HTTP(S) binding can be invoked as follows:

[Example 29](https://www.w3.org/TR/did-resolution/#example-example-curl-call-to-a-did-resolver-via-http-s-binding): Example curl call to a DID resolver via HTTP(S) binding

```
curl -X GET https://resolver.example/1.0/identifiers/did:sov:WRfXPg8dantKVubE3HX8pw
```

Additional examples of the HTTP(S) binding:

![Diagram showing the invocation of resolve() over HTTPS](https://www.w3.org/TR/did-resolution/diagrams/https-resolve-example-1.png)[Figure 12](https://www.w3.org/TR/did-resolution/#https-resolve-example-1)
 Invocation of resolve() over HTTP(S).
 ![Diagram showing the invocation of resolve() over HTTPS](https://www.w3.org/TR/did-resolution/diagrams/https-resolve-example-2.png)[Figure 13](https://www.w3.org/TR/did-resolution/#https-resolve-example-2)
 Invocation of resolve() over HTTP(S).


### 11.3 DID URL Dereferencing Examples

[Permalink for Section 11.3](https://www.w3.org/TR/did-resolution/#did-url-dereferencing-examples)

Additional examples of the HTTP(S) binding:

![Diagram showing the invocation of dereference() over HTTPS](https://www.w3.org/TR/did-resolution/diagrams/https-dereference-example-1.png)[Figure 14](https://www.w3.org/TR/did-resolution/#https-dereference-example-1)
 Invocation of dereference() over HTTP(S).
 ![Diagram showing the invocation of dereference() over HTTPS](https://www.w3.org/TR/did-resolution/diagrams/https-dereference-example-2.png)[Figure 15](https://www.w3.org/TR/did-resolution/#https-dereference-example-2)
 Invocation of dereference() over HTTP(S).


## 12\. Security and Privacy Considerations

[Permalink for Section 12.](https://www.w3.org/TR/did-resolution/#security-privacy-considerations)

### 12.1 Authentication/Authorization

[Permalink for Section 12.1](https://www.w3.org/TR/did-resolution/#authentication)

[DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) and [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) do not involve any authentication or authorization
functionality. Similar to DNS resolution, anybody can perform the process, without requiring any credentials
or non-public knowledge.

[Issue 38](https://github.com/w3c/did-resolution/issues/38): Restricted access/Authentication/Authorization [enhancement](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22enhancement%22)

The spec should clarify whether or not conformant resolvers MUST be public or MAY restrict access via some authentication and authorization scheme.

The current language doesn't make it clear if authentication is just out of scope or if it is disallowed.

Issue

Explain that DIDs are not necessarily _globally_ resolvable, such as pairwise or N-wise
"peer" DIDs.

See \[[RFC3339](https://www.w3.org/TR/did-resolution/#bib-rfc3339 "Date and Time on the Internet: Timestamps")\]:
_URIs have a global scope and are interpreted consistently regardless of context, though the_
_result of that interpretation may be in relation to the end-user's context._

An advanced idea is that the result of DID resolution could be contextual or depend on policies,
see [this comment](https://github.com/w3c/did-resolution/issues/28#issuecomment-510592199).

Issue

A related topic is whether (parts of) DID document could be encrypted, e.g.,
[w3c/did-core/issues/25](https://github.com/w3c/did-core/issues/25). Also see the use
of the fragment in the [IPID](https://did-ipid.github.io/ipid-did-method/) DID method.

### 12.2 Caching

[Permalink for Section 12.2](https://www.w3.org/TR/did-resolution/#caching)

A [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) may maintain a generic cache of [DID documents](https://www.w3.org/TR/did-resolution/#dfn-did-documents). It may also
maintain caches specific to certain [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).

The `noCache` resolution option can be used to
request a certain kind of caching behavior.

This resolution option is _OPTIONAL_.

Possible values of this property are:

- `"false"` (default value): Caching of [DID documents](https://www.w3.org/TR/did-resolution/#dfn-did-documents) is allowed.
- `"true"`: Request that caching is disabled and a fresh [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) is retrieved from
   the [verifiable data registry](https://www.w3.org/TR/did-resolution/#dfn-verifiable-data-registry).

Caching behavior can be controlled by configuration of the [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s),
by the `noCache` resolution option, or by contents of the DID document
(e.g., a `cacheMaxTtl` field), or by a combination of these properties.

[Issue 10](https://github.com/w3c/did-resolution/issues/10): need TTL construct? [enhancement](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22enhancement%22)

See corresponding open issue.

Issue

Perhaps we can re-use caching mechanisms of other protocols such as HTTP.

### 12.3 Versioning

[Permalink for Section 12.3](https://www.w3.org/TR/did-resolution/#versioning)

If a [`versionId`](https://www.w3.org/TR/did-core/#did-parameters) or
[`versionTime`](https://www.w3.org/TR/did-core/#did-parameters) DID parameter
is provided, the [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution)
algorithm returns a specific version of the [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents).

The DID parameters [`versionId`](https://www.w3.org/TR/did-core/#did-parameters)
and [`versionTime`](https://www.w3.org/TR/did-core/#did-parameters)
are mutually exclusive.

The use of the [`versionId`](https://www.w3.org/TR/did-core/#did-parameters) DID parameter is specific to the [DID method](https://www.w3.org/TR/did-resolution/#dfn-did-method-s).
Its possible values may include sequential numbers, random UUIDs, content hashes, etc..

DID document metadata _MAY_ contain a [`versionId`](https://www.w3.org/TR/did-core/#did-parameters)
property that changes with each [Update](https://www.w3.org/TR/did-core/#method-operations) operation that is performed
on a DID document.

Note

While most [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) support the [Update](https://www.w3.org/TR/did-core/#method-operations)
operation, there is no requirement for [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) to keep all previous [DID document](https://www.w3.org/TR/did-resolution/#dfn-did-documents) versions, therefore
not all [DID methods](https://www.w3.org/TR/did-resolution/#dfn-did-method-s) support versioning.

[Issue 12](https://github.com/w3c/did-resolution/issues/12): Design versioning features [pending-close](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pending-close%22)

See corresponding open issue.

### 12.4 Non-DID Identifiers

[Permalink for Section 12.4](https://www.w3.org/TR/did-resolution/#non-did-identifiers)

[Issue 8](https://github.com/w3c/did-resolution/issues/8): Discover DIDs from other identifiers

There is discussion on the relationship between [DID resolution](https://www.w3.org/TR/did-resolution/#dfn-did-resolution) and
resolution of non-DID identifiers such as domain names, HTTP URIs, or e-mail addresses. This includes the
questions how DIDs can be discovered from non-DID identifiers, and how links between identifiers can
be verifiable.

### 12.5 DID Method Governance

[Permalink for Section 12.5](https://www.w3.org/TR/did-resolution/#did-method-governance)

[Issue 6](https://github.com/w3c/did-resolution/issues/6): DID method governance [pending-close](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pending-close%22)

Describe which methods a [DID resolver](https://www.w3.org/TR/did-resolution/#dfn-did-resolver-s) should support, and potential implications.

## 13\. Future Work

[Permalink for Section 13.](https://www.w3.org/TR/did-resolution/#future-work)

Note

This section lists additional [DID URL dereferencing](https://www.w3.org/TR/did-resolution/#dfn-did-url-dereferencing) features that are under discussion and
have not yet been incorporated into the algorithm.

### 13.1 Redirect

[Permalink for Section 13.1](https://www.w3.org/TR/did-resolution/#redirect)

A [service endpoint](https://www.w3.org/TR/did-core/#services) may have
a `serviceEndpoint` property with a value that is itself
a DID. This is interpreted as a "DID redirect" from the input DID to another. In this case, a "child"
DID resolution process can be launched to get to a "final" service endpoint.

The `follow-redirect` resolution option can be supplied by a client as a hint to
instruct whether redirects should be followed. This resolution option is _OPTIONAL_.

[Issue 7](https://github.com/w3c/did-resolution/issues/7): Support DIDs as serviceEndpoint? [enhancement](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22enhancement%22) [pending-close](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pending-close%22)

See corresponding open issue.


[Issue 36](https://github.com/w3c/did-resolution/issues/36): Portable DID resolution

DID redirects could not only apply to a single service endpoint, but
to an entire DID document, therefore enabling portability use cases.


[Example 30](https://www.w3.org/TR/did-resolution/#example-30)

```
{
   "id": "did:example:123456789abcdefghi#hub1",
   "type": "HubService",
   "serviceEndpoint": "did:example:xyz"
}
```

### 13.2 Proxy

[Permalink for Section 13.2](https://www.w3.org/TR/did-resolution/#proxy)

A DID document may contain a "proxy" service type which would provide a mapping that
needs to be followed in order to resolve to a final service URL.

[Issue 35](https://github.com/w3c/did-resolution/issues/35): Support "proxy" service type? [enhancement](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22enhancement%22) [pending-close](https://github.com/w3c/did-resolution/issues/?q=is%3Aissue+is%3Aopen+label%3A%22pending-close%22)

Keeping track of a proposal here [w3c-ccg/did-spec#90 (comment)](https://github.com/w3c-ccg/did-spec/issues/90#issuecomment-439936749) that a DID Document could contain a "proxy" service type which would provide a mapping that needs to be followed in order to resolve to a final service URL.

[Example 31](https://www.w3.org/TR/did-resolution/#example-31)

```
{
   "id": "did:example:123456789abcdefghi",
   "type": "ProxyService",
   "serviceEndpoint": "https://mydomain.com/proxy"
}
```

### 13.3 JSON Pointer

[Permalink for Section 13.3](https://www.w3.org/TR/did-resolution/#json-pointer)

Issue

Several ways of selecting parts of a DID document are being discussed, including the use
of JSON pointer.

See corresponding PRs [here](https://github.com/w3c/did-spec/pull/161)
and [here](https://github.com/w3c/did-core/pull/257).

## A. DID Resolution Resources

[Permalink for Appendix A.](https://www.w3.org/TR/did-resolution/#did-resolution-resources)

1. [DID resolvers in DID Core specification](https://www.w3.org/TR/did-core/#resolution)
2. [Universal Resolver](https://github.com/decentralized-identity/universal-resolver/)
3. [did-client](https://github.com/digitalbazaar/did-client)
4. [uPort DID resolver](https://github.com/uport-project/did-resolver)
