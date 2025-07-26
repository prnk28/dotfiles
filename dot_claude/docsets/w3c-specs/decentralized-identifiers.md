## Abstract

[Decentralized identifiers](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) (DIDs) are a new type of identifier that
enables verifiable, decentralized digital identity. A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) refers to any
subject (e.g., a person, organization, thing, data model, abstract entity, etc.)
as determined by the controller of the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). In contrast to
typical, federated identifiers, [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) have been designed so that they may
be decoupled from centralized registries, identity providers, and certificate
authorities. Specifically, while other parties might be used to help enable the
discovery of information related to a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), the design enables the
controller of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to prove control over it without requiring permission
from any other party. [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri) that associate a [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) with a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) allowing trustable interactions
associated with that subject.


Each [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can express cryptographic material, [verification\\
methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method), or [services](https://www.w3.org/TR/did-1.0/#dfn-service), which provide a set of mechanisms enabling a
[DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) to prove control of the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). [Services](https://www.w3.org/TR/did-1.0/#dfn-service) enable
trusted interactions associated with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) might
provide the means to return the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) itself, if the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is an information resource such as a data model.


This document specifies the DID syntax, a common data model, core properties,
serialized representations, DID operations, and an explanation of the process
of resolving DIDs to the resources that they represent.


## Status of This Document

_This section describes the status of this_
_document at the time of its publication. A list of current W3C_
_publications and the latest revision of this technical report can be found_
_in the [W3C technical reports index](https://www.w3.org/TR/) at_
_https://www.w3.org/TR/._

At the time of publication, there existed
[103\\
experimental DID Method specifications](https://w3c.github.io/did-spec-registries/#did-methods), 32 experimental DID Method driver
implementations, a [test suite](https://w3c.github.io/did-test-suite/) that determines
whether or not a given implementation is conformant with this specification
and 46 implementations submitted to the conformance test suite.
Readers are advised to heed the [DID Core issues](https://github.com/w3c/did-core/issues) and [DID Core Test Suite\\
issues](https://github.com/w3c/did-test-suite/issues) that each contain the latest list of concerns and proposed changes
that might result in alterations to this specification. At the time of
publication, no additional substantive issues, changes, or modifications
are expected.


Comments regarding this document are welcome. Please file issues
directly on [GitHub](https://github.com/w3c/did-core/issues/),
or send them
to [public-did-wg@w3.org](mailto:public-did-wg@w3.org) (
[subscribe](mailto:public-did-wg-request@w3.org?subject=subscribe),
[archives](https://lists.w3.org/Archives/Public/public-did-wg/)).


This document was published by the [Decentralized Identifier Working Group](https://www.w3.org/groups/wg/did) as
a Recommendation using the
[Recommendation track](https://www.w3.org/2021/Process-20211102/#recs-and-notes).


W3C recommends the wide deployment of this specification as a standard for
the Web.


A W3C Recommendation is a specification that, after extensive
consensus-building, is endorsed by
W3C and its Members, and
has commitments from Working Group members to
[royalty-free licensing](https://www.w3.org/Consortium/Patent-Policy/#sec-Requirements)
for implementations.



This document was produced by a group
operating under the
[W3C Patent\\
Policy](https://www.w3.org/Consortium/Patent-Policy/).

W3C maintains a
[public list of any patent disclosures](https://www.w3.org/groups/wg/did/ipr)
made in connection with the deliverables of
the group; that page also includes
instructions for disclosing a patent. An individual who has actual
knowledge of a patent which the individual believes contains
[Essential Claim(s)](https://www.w3.org/Consortium/Patent-Policy/#def-essential)
must disclose the information in accordance with
[section 6 of the W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure).



This document is governed by the
[2 November 2021 W3C Process Document](https://www.w3.org/2021/Process-20211102/).


## 1\. Introduction

[Permalink for Section 1.](https://www.w3.org/TR/did-1.0/#introduction)

_This section is non-normative._

As individuals and organizations, many of us use globally unique identifiers in
a wide variety of contexts. They serve as communications addresses (telephone
numbers, email addresses, usernames on social media), ID numbers (for passports,
drivers licenses, tax IDs, health insurance), and product identifiers (serial
numbers, barcodes, RFIDs). URIs (Uniform Resource Identifiers) are used for
resources on the Web and each web page you view in a browser has a globally
unique URL (Uniform Resource Locator).


The vast majority of these globally unique identifiers are not under our
control. They are issued by external authorities that decide who or what they
refer to and when they can be revoked. They are useful only in certain contexts
and recognized only by certain bodies not of our choosing. They might
disappear or cease to be valid with the failure of an organization. They might
unnecessarily reveal personal information. In many cases, they can be
fraudulently replicated and asserted by a malicious third-party, which is
more commonly known as "identity theft".


The Decentralized Identifiers (DIDs) defined in this specification are a new
type of globally unique identifier. They are designed to enable individuals and
organizations to generate their own identifiers using systems they trust. These
new identifiers enable entities to prove control over them by authenticating
using cryptographic proofs such as digital signatures.


Since the generation and assertion of Decentralized Identifiers is
entity-controlled, each entity can have as many DIDs as necessary to maintain
their desired separation of identities, personas, and interactions. The use of
these identifiers can be scoped appropriately to different contexts. They
support interactions with other people, institutions, or systems that require
entities to identify themselves, or things they control, while providing control
over how much personal or private data should be revealed, all without depending
on a central authority to guarantee the continued existence of the identifier.
These ideas are explored in the DID Use Cases document \[[DID-USE-CASES](https://www.w3.org/TR/did-1.0/#bib-did-use-cases "Use Cases and Requirements for Decentralized Identifiers")\].


This specification does not presuppose any particular technology or cryptography
to underpin the generation, persistence, resolution, or interpretation of DIDs.
For example, implementers can create Decentralized Identifiers based on
identifiers registered in federated or centralized identity management systems.
Indeed, almost all types of identifier systems can add support for DIDs. This
creates an interoperability bridge between the worlds of centralized, federated,
and decentralized identifiers. This also enables implementers to design specific
types of DIDs to work with the computing infrastructure they trust, such as
distributed ledgers, decentralized file systems, distributed databases, and
peer-to-peer networks.


This specification is for:


- Anyone that wants to understand the core architectural principles that
  are the foundation for Decentralized Identifiers;

- Software developers that want to produce and consume Decentralized Identifiers
  and their associated data formats;

- Systems integrators that want to understand how to use Decentralized
  Identifiers in their software and hardware systems;

- Specification authors that want to create new DID infrastructures, known as DID
  methods, that conform to the ecosystem described by this document.


In addition to this specification, readers might find the
Use Cases and Requirements for Decentralized Identifiers \[[DID-USE-CASES](https://www.w3.org/TR/did-1.0/#bib-did-use-cases "Use Cases and Requirements for Decentralized Identifiers")\]
document useful.


### 1.1 A Simple Example

[Permalink for Section 1.1](https://www.w3.org/TR/did-1.0/#a-simple-example)

_This section is non-normative._

A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is a simple text string consisting of three parts: 1) the
`did` URI scheme identifier, 2) the identifier for the [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods), and 3) the DID method-specific identifier.


![ A diagram showing the parts of a DID. The left-most letters spell 'did' in blue, are enclosed in a horizontal bracket from above and a label that reads 'scheme' above the bracket. A gray colon follows the 'did' letters. The middle letters spell 'example' in magenta, are enclosed in a horizontal bracket from below and a label that reads 'DID Method' below the bracket. A gray colon follows the DID Method. Finally, the letters at the end read '123456789abcdefghi' in green, are enclosed in a horizontal bracket from below and a label that reads 'DID Method Specific String' below the bracket.         ](https://www.w3.org/TR/did-1.0/diagrams/parts-of-a-did.svg)Figure 1
A simple example of a decentralized identifier (DID)


The example [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) above resolves to a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). A [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) contains information associated with the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), such as ways
to cryptographically [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers).


[Example 1](https://www.w3.org/TR/did-1.0/#example-a-simple-did-document): A simple DID document

```
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ]
  "id": "did:example:123456789abcdefghi",
  "authentication": [{\
    // used to authenticate as did:...fghi\
    "id": "did:example:123456789abcdefghi#keys-1",\
    "type": "Ed25519VerificationKey2020",\
    "controller": "did:example:123456789abcdefghi",\
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
  }]
}
```

### 1.2 Design Goals

[Permalink for Section 1.2](https://www.w3.org/TR/did-1.0/#design-goals)

_This section is non-normative._

[Decentralized Identifiers](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are a component of larger systems, such as the
Verifiable Credentials ecosystem \[[VC-DATA-MODEL](https://www.w3.org/TR/did-1.0/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\], which influenced the design
goals for this specification. The design goals for Decentralized Identifiers
are summarized here.


| Goal | Description |
| --- | --- |
| Decentralization | Eliminate the requirement for centralized authorities or single point failure in<br>identifier management, including the registration of globally unique<br>identifiers, public verification keys, [services](https://www.w3.org/TR/did-1.0/#dfn-service), and other information. |
| Control | Give entities, both human and non-human, the power to directly control their<br>digital identifiers without the need to rely on external authorities. |
| Privacy | Enable entities to control the privacy of their information, including minimal,<br>selective, and progressive disclosure of attributes or other data. |
| Security | Enable sufficient security for requesting parties to depend on [DID\<br>documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) for their required level of assurance. |
| Proof-based | Enable [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) to provide cryptographic proof when interacting<br>with other entities. |
| Discoverability | Make it possible for entities to discover [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for other entities, to<br>learn more about or interact with those entities. |
| Interoperability | Use interoperable standards so [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) infrastructure can make use of<br>existing tools and software libraries designed for interoperability. |
| Portability | Be system- and network-independent and enable entities to use their digital<br>identifiers with any system that supports [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods). |
| Simplicity | Favor a reduced set of simple features to make the technology easier to<br>understand, implement, and deploy. |
| Extensibility | Where possible, enable extensibility provided it does not greatly hinder<br>interoperability, portability, or simplicity. |

### 1.3  Architecture Overview

[Permalink for Section 1.3](https://www.w3.org/TR/did-1.0/#architecture-overview)

_This section is non-normative._

This section provides a basic overview of the major components of
Decentralized Identifier architecture.


![ DIDs and DID documents are recorded on a Verifiable Data Registry; DIDs resolve to DID documents; DIDs refer to DID subjects; a DID controller controls a DID document; DID URLs contains a DID; DID URLs dereferenced to DID document fragments or external resources.         ](https://www.w3.org/TR/did-1.0/diagrams/did_brief_architecture_overview.svg)Figure 2
Overview of DID architecture and the relationship of the basic components.
See also: [narrative description](https://www.w3.org/TR/did-1.0/#brief-architecture-overview-longdesc).


Six internally-labeled shapes appear in the diagram, with labeled arrows
between them, as follows. In the center of the diagram is a rectangle labeled
DID URL, containing small typewritten text "did:example:123/path/to/rsrc". At
the center top of the diagram is a rectangle labeled, "DID", containing small
typewritten text "did:example:123". At the top left of the diagram is an oval,
labeled "DID Subject". At the bottom center of the diagram is a rectangle
labeled, "DID document". At the bottom left is an oval, labeled, "DID
Controller". On the center right of the diagram is a two-dimensional rendering
of a cylinder, labeled, "Verifiable Data Registry".


From the top of the "DID URL" rectangle, an arrow, labeled "contains", extends
upwards, pointing to the "DID" rectangle. From the bottom of the "DID URL"
rectangle, an arrow, labeled "refers, and
**_dereferences_**, to", extends downward, pointing to the
"DID document" rectangle. An arrow from the "DID" rectangle, labeled
" **_resolves_** to", points down to the "DID document"
rectangle. An arrow from the "DID" rectangle, labeled "refers to", points left
to the "DID subject" oval. An arrow from the "DID controller" oval, labeled
"controls", points right to the "DID document" rectangle. An arrow from the
"DID" rectangle, labeled "recorded on", points downards to the right, to the
"Verifiable Data Registry" cylinder. An arrow from the "DID document" rectangle,
labeled "recorded on", points upwards to the right to the "Verifiable Data
Registry" cylinder.


DIDs and DID URLs

A Decentralized Identifier, or [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), is a [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) composed of three
parts: the scheme `did:`, a method identifier, and a unique,
method-specific identifier specified by the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are
resolvable to [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents). A [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) extends the syntax of a
basic [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to incorporate other standard [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) components such as
path, query, and fragment in order to locate a particular
[resource](https://www.w3.org/TR/did-1.0/#dfn-resources)—for example, a cryptographic public key inside a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), or a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) external to the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
These concepts are elaborated upon in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax) and [3.2 DID URL Syntax](https://www.w3.org/TR/did-1.0/#did-url-syntax).

DID subjects

The subject of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is, by definition, the entity identified by the
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). The [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) might also be the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers).
Anything can be the subject of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers): person, group, organization,
thing, or concept. This is further defined in [5.1.1 DID Subject](https://www.w3.org/TR/did-1.0/#did-subject).

DID controllers

The [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is the entity (person, organization, or
autonomous software) that has the capability—as defined by a [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)—to make changes to a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). This capability is
typically asserted by the control of a set of cryptographic keys used by
software acting on behalf of the controller, though it might also be asserted
via other mechanisms. Note that a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) might have more than one
controller, and the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) can be the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers), or one
of them. This concept is documented in [5.1.2 DID Controller](https://www.w3.org/TR/did-1.0/#did-controller).

Verifiable data registries

In order to be resolvable to [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents), [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are typically
recorded on an underlying system or network of some kind. Regardless of the
specific technology used, any such system that supports recording [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
and returning data necessary to produce [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is called a
[verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry). Examples include [distributed ledgers](https://www.w3.org/TR/did-1.0/#dfn-distributed-ledger-technology),
decentralized file systems, databases of any kind, peer-to-peer networks, and
other forms of trusted data storage. This concept is further elaborated upon in
[8\. Methods](https://www.w3.org/TR/did-1.0/#methods).

DID documents
 [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) contain information associated with a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). They
typically express [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method), such as cryptographic public
keys, and [services](https://www.w3.org/TR/did-1.0/#dfn-service) relevant to interactions with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).
The generic properties supported in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are specified in [5\. Core Properties](https://www.w3.org/TR/did-1.0/#core-properties). A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can be serialized to a byte
stream (see [6\. Representations](https://www.w3.org/TR/did-1.0/#representations)). The properties present in
a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can be updated according to the applicable operations
outlined in [8\. Methods](https://www.w3.org/TR/did-1.0/#methods).

DID methods
 [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) are the mechanism by which a particular type of [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
and its associated [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are created, resolved, updated, and
deactivated. [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) are defined using separate DID method
specifications as defined in [8\. Methods](https://www.w3.org/TR/did-1.0/#methods).

DID resolvers and DID resolution

A [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) is a system component that takes a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) as input and
produces a conforming [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) as output. This process is called
[DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution). The steps for resolving a specific type of [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are
defined by the relevant [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification. The process of [DID\\
resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) is elaborated upon in [7\. Resolution](https://www.w3.org/TR/did-1.0/#resolution).

DID URL dereferencers and DID URL dereferencing

A [DID URL dereferencer](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencers) is a system component that takes a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls)
as input and produces a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) as output. This process is
called [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing). The process of [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing)
is elaborated upon in [7.2 DID URL Dereferencing](https://www.w3.org/TR/did-1.0/#did-url-dereferencing).


### 1.4 Conformance

[Permalink for Section 1.4](https://www.w3.org/TR/did-1.0/#conformance)

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words _MAY_, _MUST_, _MUST NOT_, _OPTIONAL_, _RECOMMENDED_, _REQUIRED_, _SHOULD_, and _SHOULD NOT_ in this document
are to be interpreted as described in
[BCP 14](https://datatracker.ietf.org/doc/html/bcp14)
\[[RFC2119](https://www.w3.org/TR/did-1.0/#bib-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")\] \[[RFC8174](https://www.w3.org/TR/did-1.0/#bib-rfc8174 "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words")\]
when, and only when, they appear in all capitals, as shown here.


This document contains examples that contain JSON and JSON-LD content.
Some of these examples contain characters that are invalid, such as inline
comments ( `//`) and the use of ellipsis ( `...`) to denote
information that adds little value to the example. Implementers are cautioned to
remove this content if they desire to use the information as valid JSON
or JSON-LD.


Some examples contain terms, both property names and values, that are not
defined in this specification. These are indicated with a comment ( `//
external (property name|value)`). Such terms, when used in a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), are expected to be registered in the DID Specification Registries
\[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\] with links to both a formal definition and a JSON-LD
context.


Interoperability of implementations for [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is
tested by evaluating an implementation's ability to create and parse [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that conform to this specification. Interoperability
for producers and consumers of [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is provided
by ensuring the [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) conform. Interoperability
for [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications is provided by the details in each [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification. It is understood that, in the same way that a web
browser is not required to implement all known [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) schemes, conformant
software that works with [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is not required to implement all known
[DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods). However, all implementations of a given [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
are expected to be interoperable for that method.


A conforming DID is any concrete expression of the rules specified in
[3\. Identifier](https://www.w3.org/TR/did-1.0/#identifier) which complies with relevant normative statements in
that section.


A conforming DID document is any concrete expression of the data
model described in this specification which complies with the relevant normative
statements in [4\. Data Model](https://www.w3.org/TR/did-1.0/#data-model) and [5\. Core Properties](https://www.w3.org/TR/did-1.0/#core-properties). A
serialization format for the conforming document is deterministic,
bi-directional, and lossless, as described in [6\. Representations](https://www.w3.org/TR/did-1.0/#representations).


A conforming producer is any algorithm realized as software and/or
hardware that generates [conforming DIDs](https://www.w3.org/TR/did-1.0/#dfn-conforming-did) or [conforming DID\\
Documents](https://www.w3.org/TR/did-1.0/#dfn-conforming-did-document) and complies with the relevant normative statements in [6\. Representations](https://www.w3.org/TR/did-1.0/#representations).


A conforming consumer is any algorithm realized as software and/or
hardware that consumes [conforming DIDs](https://www.w3.org/TR/did-1.0/#dfn-conforming-did) or [conforming DID documents](https://www.w3.org/TR/did-1.0/#dfn-conforming-did-document)
and complies with the relevant normative statements in [6\. Representations](https://www.w3.org/TR/did-1.0/#representations).


A conforming DID resolver is any algorithm
realized as software and/or hardware that complies with the relevant normative
statements in [7.1 DID Resolution](https://www.w3.org/TR/did-1.0/#did-resolution).


A conforming DID URL dereferencer is any
algorithm realized as software and/or hardware that complies with the relevant
normative statements in [7.2 DID URL Dereferencing](https://www.w3.org/TR/did-1.0/#did-url-dereferencing).


A conforming DID method is any specification that
complies with the relevant normative statements in [8\. Methods](https://www.w3.org/TR/did-1.0/#methods).


## 2\. Terminology

[Permalink for Section 2.](https://www.w3.org/TR/did-1.0/#terminology)

_This section is non-normative._

This section defines the terms used in this specification and throughout
[decentralized identifier](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) infrastructure. A link to these terms is
included whenever they appear in this specification.

amplification attack
A class of attack where the attacker attempts to exhaust a target system's
CPU, storage, network, or other resources by providing small, valid inputs into
the system that result in damaging effects that can be exponentially more costly
to process than the inputs themselves.
authenticate
Authentication is a process by which an entity can prove it has a specific
attribute or controls a specific secret using one or more [verification\\
methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method). With [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), a common example would be proving control of the
cryptographic private key associated with a public key published in a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
cryptographic suite
A specification defining the usage of specific cryptographic primitives in
order to achieve a particular security goal. These documents are often used
to specify [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method), digital signature types,
their identifiers, and other related properties.
decentralized identifier (DID)
A globally unique persistent identifier that does not require a centralized
registration authority and is often generated and/or registered
cryptographically. The generic format of a DID is defined in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). A specific [DID scheme](https://www.w3.org/TR/did-1.0/#dfn-did-schemes) is defined in a [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification. Many—but not all—DID methods make use of
[distributed ledger technology](https://www.w3.org/TR/did-1.0/#dfn-distributed-ledger-technology) (DLT) or some other form of decentralized
network.
decentralized identity management[Identity\\
management](https://en.wikipedia.org/wiki/Identity_management) that is based on the use of [decentralized identifiers](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).
Decentralized identity management extends authority for identifier generation,
registration, and assignment beyond traditional roots of trust such as
[X.500 directory services](https://en.wikipedia.org/wiki/X.500),
the [Domain Name System](https://en.wikipedia.org/wiki/Domain_Name_System),
and most national ID systems.
DID controller
An entity that has the capability to make changes to a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). A
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) might have more than one DID controller. The DID controller(s)
can be denoted by the optional `controller` property at the top level of the
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). Note that a DID controller might be the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).
DID delegate
An entity to whom a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) has granted permission to use a
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) associated with a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) via a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). For example, a parent who controls a child's [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
might permit the child to use their personal device in order to
[authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated). In this case, the child is the [DID delegate](https://www.w3.org/TR/did-1.0/#dfn-did-delegate). The
child's personal device would contain the private cryptographic material
enabling the child to [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) using the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). However, the child
might not be permitted to add other personal devices without the parent's
permission.
DID document
A set of data describing the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects), including mechanisms, such as
cryptographic public keys, that the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) or a [DID delegate](https://www.w3.org/TR/did-1.0/#dfn-did-delegate)
can use to [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) itself and prove its association with the
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). A DID document might have one or more different
[representations](https://www.w3.org/TR/did-1.0/#dfn-representations) as defined in [6\. Representations](https://www.w3.org/TR/did-1.0/#representations) or in the
W3C DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].
DID fragment
The portion of a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) that follows the first hash sign character
( `#`). DID fragment syntax is identical to URI fragment syntax.
DID method
A definition of how a specific [DID method scheme](https://www.w3.org/TR/did-1.0/#dfn-did-schemes) is implemented. A DID method is
defined by a DID method specification, which specifies the precise operations by
which [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are created, resolved, updated,
and deactivated. See [8\. Methods](https://www.w3.org/TR/did-1.0/#methods).
DID path
The portion of a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) that begins with and includes the first forward
slash ( `/`) character and ends with either a question mark
( `?`) character, a fragment hash sign ( `#`) character,
or the end of the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls). DID path syntax is identical to URI path syntax.
See [Path](https://www.w3.org/TR/did-1.0/#path).
DID query
The portion of a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) that follows and includes the first question
mark character ( `?`). DID query syntax is identical to URI query
syntax. See [Query](https://www.w3.org/TR/did-1.0/#query).
DID resolution
The process that takes as its input a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and a set of resolution
options and returns a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) in a conforming [representation](https://www.w3.org/TR/did-1.0/#dfn-representations)
plus additional metadata. This process relies on the "Read" operation of the
applicable [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). The inputs and outputs of this process are
defined in [7.1 DID Resolution](https://www.w3.org/TR/did-1.0/#did-resolution).
DID resolver
A [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) is a software and/or hardware component that performs the
[DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) function by taking a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) as input and producing a
conforming [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) as output.
DID scheme
The formal syntax of a [decentralized identifier](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). The generic DID scheme
begins with the prefix `did:` as defined in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). Each [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification defines a specific
DID method scheme that works with that specific [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). In a specific DID
method scheme, the DID method name follows the first colon and terminates with
the second colon, e.g., `did:example:`DID subject
The entity identified by a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and described by a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
Anything can be a DID subject: person, group, organization, physical thing,
digital thing, logical thing, etc.
DID URL
A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) plus any additional syntactic component that conforms to the
definition in [3.2 DID URL Syntax](https://www.w3.org/TR/did-1.0/#did-url-syntax). This includes an optional [DID\\
path](https://www.w3.org/TR/did-1.0/#dfn-did-paths) (with its leading `/` character), optional [DID query](https://www.w3.org/TR/did-1.0/#dfn-did-queries)
(with its leading `?` character), and optional [DID fragment](https://www.w3.org/TR/did-1.0/#dfn-did-fragments)
(with its leading `#` character).
DID URL dereferencing
The process that takes as its input a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) and a set of input
metadata, and returns a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources). This resource might be a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) plus additional metadata, a secondary resource
contained within the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), or a resource entirely
external to the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). The process uses [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) to
fetch a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) indicated by the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) contained within the
[DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls). The dereferencing process can then perform additional processing
on the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) to return the dereferenced resource indicated by the
[DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls). The inputs and outputs of this process are defined in
[7.2 DID URL Dereferencing](https://www.w3.org/TR/did-1.0/#did-url-dereferencing).
DID URL dereferencer
A software and/or hardware system that performs the [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing)
function for a given [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) or [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
distributed ledger (DLT)
A non-centralized system for recording events. These systems establish
sufficient confidence for participants to rely upon the data recorded by others
to make operational decisions. They typically use distributed databases where
different nodes use a consensus protocol to confirm the ordering of
cryptographically signed transactions. The linking of digitally signed
transactions over time often makes the history of the ledger effectively
immutable.
public key description
A data object contained inside a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that contains all the
metadata necessary to use a public key or a verification key.
resource
As defined by \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]: "...the term 'resource' is used in a general sense
for whatever might be identified by a URI." Similarly, any resource might serve
as a [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) identified by a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).
representation
As defined for HTTP by \[[RFC7231](https://www.w3.org/TR/did-1.0/#bib-rfc7231 "Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content")\]: "information that is intended to reflect a
past, current, or desired state of a given resource, in a format that can be
readily communicated via the protocol, and that consists of a set of
representation metadata and a potentially unbounded stream of representation
data." A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is a representation of information describing a
[DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). See [6\. Representations](https://www.w3.org/TR/did-1.0/#representations).
representation-specific entries
Entries in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) whose meaning is particular to a specific
[representation](https://www.w3.org/TR/did-1.0/#dfn-representations). Defined in [4\. Data Model](https://www.w3.org/TR/did-1.0/#data-model) and
[6\. Representations](https://www.w3.org/TR/did-1.0/#representations). For example, [`@context`](https://www.w3.org/TR/did-1.0/#dfn-context) in
the [JSON-LD representation](https://www.w3.org/TR/did-1.0/#json-ld) is a
_representation-specific entry_.
services
Means of communicating or interacting with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) or
associated entities via one or more [service endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints).
Examples include discovery services, agent services, social networking
services, file storage services, and verifiable credential repository services.
service endpoint
A network address, such as an HTTP URL, at which [services](https://www.w3.org/TR/did-1.0/#dfn-service) operate on
behalf of a [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).
Uniform Resource Identifier (URI)
The standard identifier format for all resources on the World Wide Web as
defined by \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]. A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is a type of URI scheme.
verifiable credential
A standard data model and representation format for cryptographically-verifiable
digital credentials as defined by the W3C Verifiable Credentials specification
\[[VC-DATA-MODEL](https://www.w3.org/TR/did-1.0/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\].

verifiable data registry
A system that facilitates the creation, verification, updating, and/or
deactivation of [decentralized identifiers](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents). A
verifiable data registry might also be used for other
cryptographically-verifiable data structures such as [verifiable\\
credentials](https://www.w3.org/TR/did-1.0/#dfn-verifiable-credentials). For more information, see the W3C Verifiable Credentials
specification \[[VC-DATA-MODEL](https://www.w3.org/TR/did-1.0/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\].
verifiable timestamp
A verifiable timestamp enables a third-party to verify that a data object
existed at a specific moment in time and that it has not been modified or
corrupted since that moment in time. If the data integrity could reasonably have
been modified or corrupted since that moment in time, the timestamp is not
verifiable.
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


verification relationship

An expression of the relationship between the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and a
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method). An example of a verification relationship is
[5.3.1 Authentication](https://www.w3.org/TR/did-1.0/#authentication).


Universally Unique Identifier (UUID)
A type of globally unique identifier defined by \[[RFC4122](https://www.w3.org/TR/did-1.0/#bib-rfc4122 "A Universally Unique IDentifier (UUID) URN Namespace")\]. UUIDs are similar
to DIDs in that they do not require a centralized registration authority. UUIDs
differ from DIDs in that they are not resolvable or
cryptographically-verifiable.


In addition to the terminology above, this specification also uses terminology
from the \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\] specification to formally define the [data model](https://www.w3.org/TR/did-1.0/#data-model). When \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\] terminology is used, such as
[string](https://infra.spec.whatwg.org/#strings), [set](https://infra.spec.whatwg.org/#ordered-set), and [map](https://infra.spec.whatwg.org/#maps), it is linked directly to that specification.


## 3\. Identifier

[Permalink for Section 3.](https://www.w3.org/TR/did-1.0/#identifier)

This section describes the formal syntax for [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID URLs](https://www.w3.org/TR/did-1.0/#dfn-did-urls).
The term "generic" is used to differentiate the syntax defined here from syntax
defined by _specific_ [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) in their respective
specifications. The creation processes, and their timing, for [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and
[DID URLs](https://www.w3.org/TR/did-1.0/#dfn-did-urls) are described in [8.2 Method Operations](https://www.w3.org/TR/did-1.0/#method-operations) and
[B.2 Creation of a DID](https://www.w3.org/TR/did-1.0/#creation-of-a-did).


### 3.1 DID Syntax

[Permalink for Section 3.1](https://www.w3.org/TR/did-1.0/#did-syntax)

The generic [DID scheme](https://www.w3.org/TR/did-1.0/#dfn-did-schemes) is a [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) scheme conformant with
\[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]. The ABNF definition can be found below, which uses the syntax in
\[[RFC5234](https://www.w3.org/TR/did-1.0/#bib-rfc5234 "Augmented BNF for Syntax Specifications: ABNF")\] and the corresponding definitions for `ALPHA` and
`DIGIT`. All other rule names not defined in the ABNF below are
defined in \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]. All [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) _MUST_ conform to the
DID Syntax ABNF Rules.


| The DID Syntax ABNF Rules |
| --- |
| ```<br>did                = "did:" method-name ":" method-specific-id<br>method-name        = 1*method-char<br>method-char        = %x61-7A / DIGIT<br>method-specific-id = *( *idchar ":" ) 1*idchar<br>idchar             = ALPHA / DIGIT / "." / "-" / "_" / pct-encoded<br>pct-encoded        = "%" HEXDIG HEXDIG<br>``` |

For requirements on [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) relating to the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) syntax, see
Section [8.1 Method Syntax](https://www.w3.org/TR/did-1.0/#method-syntax).


### 3.2 DID URL Syntax

[Permalink for Section 3.2](https://www.w3.org/TR/did-1.0/#did-url-syntax)

A [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) is a network location identifier for a specific
[resource](https://www.w3.org/TR/did-1.0/#dfn-resources). It can be used to retrieve things like representations
of [DID subjects](https://www.w3.org/TR/did-1.0/#dfn-did-subjects), [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method), [services](https://www.w3.org/TR/did-1.0/#dfn-service),
specific parts of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), or other resources.


The following is the ABNF definition using the syntax in \[[RFC5234](https://www.w3.org/TR/did-1.0/#bib-rfc5234 "Augmented BNF for Syntax Specifications: ABNF")\]. It builds
on the `did` scheme defined in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). The [`path-abempty`](https://www.rfc-editor.org/rfc/rfc3986#section-3.3), [`query`](https://www.rfc-editor.org/rfc/rfc3986#section-3.4), and [`fragment`](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) components are
defined in \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]. All [DID URLs](https://www.w3.org/TR/did-1.0/#dfn-did-urls) _MUST_ conform to the
DID URL Syntax ABNF Rules. [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) can further restrict these
rules, as described in [8.1 Method Syntax](https://www.w3.org/TR/did-1.0/#method-syntax).


| The DID URL Syntax ABNF Rules |
| --- |
| ```<br>did-url = did path-abempty [ "?" query ] [ "#" fragment ]<br>``` |

Note: Semicolon character is reserved for future use

Although the semicolon ( `;`) character can be used according to the
rules of the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) syntax, future versions of this specification may
use it as a sub-delimiter for parameters as described in \[[MATRIX-URIS](https://www.w3.org/TR/did-1.0/#bib-matrix-uris "Matrix URIs - Ideas about Web Architecture")\]. To
avoid future conflicts, developers ought to refrain from using it.


#### Path

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#path)

A [DID path](https://www.w3.org/TR/did-1.0/#dfn-did-paths) is identical to a generic [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) path and conforms to the
`path-abempty` ABNF rule in [RFC 3986, section 3.3](https://www.rfc-editor.org/rfc/rfc3986#section-3.3). As with
[URIs](https://www.w3.org/TR/did-1.0/#dfn-uri), path semantics can be specified by [DID Methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods), which in
turn might enable [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) to further specialize those semantics.


[Example 2](https://www.w3.org/TR/did-1.0/#example-2)

```
did:example:123456/path
```

#### Query

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#query)

A [DID query](https://www.w3.org/TR/did-1.0/#dfn-did-queries) is identical to a generic [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) query and conforms to
the `query` ABNF rule in [RFC 3986, section 3.4](https://www.rfc-editor.org/rfc/rfc3986#section-3.4). This syntax
feature is elaborated upon in [3.2.1 DID Parameters](https://www.w3.org/TR/did-1.0/#did-parameters).


[Example 3](https://www.w3.org/TR/did-1.0/#example-3)

```
did:example:123456?versionId=1
```

#### Fragment

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#fragment)

[DID fragment](https://www.w3.org/TR/did-1.0/#dfn-did-fragments) syntax and semantics are identical to a generic [URI](https://www.w3.org/TR/did-1.0/#dfn-uri)
fragment and conforms to the `fragment` ABNF rule in [RFC 3986, section 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5).


A [DID fragment](https://www.w3.org/TR/did-1.0/#dfn-did-fragments) is used as a method-independent reference into a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) or external [resource](https://www.w3.org/TR/did-1.0/#dfn-resources). Some examples of DID fragment
identifiers are shown below.


[Example 4](https://www.w3.org/TR/did-1.0/#example-a-unique-verification-method-in-a-did-document): A unique verification method in a DID Document

```
did:example:123#public-key-0
```

[Example 5](https://www.w3.org/TR/did-1.0/#example-a-unique-service-in-a-did-document): A unique service in a DID Document

```
did:example:123#agent
```

[Example 6](https://www.w3.org/TR/did-1.0/#example-a-resource-external-to-a-did-document): A resource external to a DID Document

```
did:example:123?service=agent&relativeRef=/credentials#degree
```

Note: Fragment semantics across representations

In order to maximize interoperability, implementers are urged to ensure that
[DID fragments](https://www.w3.org/TR/did-1.0/#dfn-did-fragments) are interpreted in the same way across
[representations](https://www.w3.org/TR/did-1.0/#dfn-representations) (see [6\. Representations](https://www.w3.org/TR/did-1.0/#representations)). For example, while
JSON Pointer \[[RFC6901](https://www.w3.org/TR/did-1.0/#bib-rfc6901 "JavaScript Object Notation (JSON) Pointer")\] can be used in a [DID fragment](https://www.w3.org/TR/did-1.0/#dfn-did-fragments), it will not be
interpreted in the same way across non-JSON [representations](https://www.w3.org/TR/did-1.0/#dfn-representations).


Additional semantics for fragment identifiers, which are compatible with and
layered upon the semantics in this section, are described for JSON-LD
representations in [E.2 application/did+ld+json](https://www.w3.org/TR/did-1.0/#application-did-ld-json). For information
about how to dereference a [DID fragment](https://www.w3.org/TR/did-1.0/#dfn-did-fragments), see [7.2 DID URL Dereferencing](https://www.w3.org/TR/did-1.0/#did-url-dereferencing).


#### 3.2.1 DID Parameters

[Permalink for Section 3.2.1](https://www.w3.org/TR/did-1.0/#did-parameters)

The [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) syntax supports a simple format for parameters based on the
`query` component described in [Query](https://www.w3.org/TR/did-1.0/#query). Adding a DID
parameter to a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) means that the parameter becomes part of the
identifier for a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources).


[Example 7](https://www.w3.org/TR/did-1.0/#example-a-did-url-with-a-versiontime-did-parameter): A DID URL with a 'versionTime' DID parameter

```
did:example:123?versionTime=2021-05-10T17:00:00Z
```

[Example 8](https://www.w3.org/TR/did-1.0/#example-a-did-url-with-a-service-and-a-relativeref-did-parameter): A DID URL with a 'service' and a 'relativeRef' DID parameter

```
did:example:123?service=files&relativeRef=/resume.pdf
```

Some DID parameters are completely independent of of any specific [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and function the same way for all [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). Other DID parameters
are not supported by all [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods). Where optional parameters are
supported, they are expected to operate uniformly across the [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
that do support them. The following table provides common DID parameters that
function the same way across all [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods). Support for all
[DID Parameters](https://www.w3.org/TR/did-1.0/#did-parameters) is _OPTIONAL_.


Note

It is generally expected that DID URL dereferencer implementations will
reference \[[DID-RESOLUTION](https://www.w3.org/TR/did-1.0/#bib-did-resolution "Decentralized Identifier Resolution")\] for additional implementation details. The scope
of this specification only defines the contract of the most common
query parameters.


| Parameter Name | Description |
| --- | --- |
| `service` | Identifies a service from the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) by service ID.<br>If present, the associated value _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). |
| `relativeRef` | A relative [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) reference according to [RFC3986 Section 4.2](https://www.rfc-editor.org/rfc/rfc3986#section-4.2) that identifies a<br>[resource](https://www.w3.org/TR/did-1.0/#dfn-resources) at a [service endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints), which is selected from a [DID\<br>document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) by using the `service` parameter.<br>If present, the associated value _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string) and _MUST_ use percent-encoding for<br>certain characters as specified in [RFC3986\<br>Section 2.1](https://www.rfc-editor.org/rfc/rfc3986#section-2.1). |
| `versionId` | Identifies a specific version of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) to be resolved (the<br>version ID could be sequential, or a [UUID](https://www.w3.org/TR/did-1.0/#dfn-uuid), or method-specific).<br>If present, the associated value _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). |
| `versionTime` | Identifies a certain version timestamp of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) to be resolved.<br>That is, the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that was valid for a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) at a certain<br>time. If present, the associated value<br>_MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string) which is a valid XML<br>datetime value, as defined in section 3.3.7 of [W3C XML Schema Definition Language\<br>(XSD) 1.1 Part 2: Datatypes](https://www.w3.org/TR/xmlschema11-2/) \[[XMLSCHEMA11-2](https://www.w3.org/TR/did-1.0/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\]. This datetime value _MUST_ be<br>normalized to UTC 00:00:00 and without sub-second decimal precision.<br>For example: `2020-12-20T19:17:47Z`. |
| `hl` | A resource hash of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) to add integrity protection, as<br>specified in \[[HASHLINK](https://www.w3.org/TR/did-1.0/#bib-hashlink "Cryptographic Hyperlinks")\]. This parameter is non-normative.<br>If present, the associated value _MUST_ be an<br>[ASCII string](https://infra.spec.whatwg.org/#ascii-string). |

Implementers as well as [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification authors might use
additional DID parameters that are not listed here. For maximum
interoperability, it is _RECOMMENDED_ that DID parameters use the DID
Specification Registries mechanism \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\], to avoid collision
with other uses of the same DID parameter with different semantics.


DID parameters might be used if there is a clear use case where the parameter
needs to be part of a [URL](https://url.spec.whatwg.org/#concept-url) that references a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) with more
precision than using the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) alone. It is expected that DID parameters
are _not_ used if the same functionality can be expressed by passing
input metadata to a [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers). Additional considerations for
processing these parameters are discussed in \[[DID-RESOLUTION](https://www.w3.org/TR/did-1.0/#bib-did-resolution "Decentralized Identifier Resolution")\].


Note: DID parameters and DID resolution

The [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) and the [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) functions can
be influenced by passing input metadata to a [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) that are
not part of the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) (see [7.1.1 DID Resolution Options](https://www.w3.org/TR/did-1.0/#did-resolution-options)). This is comparable to
HTTP, where certain parameters could either be included in an HTTP URL, or
alternatively passed as HTTP headers during the dereferencing process. The
important distinction is that DID parameters that are part of the [DID\\
URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) should be used to specify _what [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) is being_
_identified_, whereas input metadata that is not part of the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls)
should be use to control _how that [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) is resolved or_
_dereferenced_.


#### 3.2.2 Relative DID URLs

[Permalink for Section 3.2.2](https://www.w3.org/TR/did-1.0/#relative-did-urls)

A relative [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) is any URL value in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that does
not start with `did:<method-name>:<method-specific-id>`. More
specifically, it is any URL value that does not start with the ABNF defined in
[3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). The URL is expected to reference
a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) in the same [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). Relative [DID URLs](https://www.w3.org/TR/did-1.0/#dfn-did-urls) _MAY_
contain relative path components, query parameters, and fragment identifiers.


When resolving a relative [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) reference, the algorithm specified in
[RFC3986 Section 5: Reference Resolution](https://www.rfc-editor.org/rfc/rfc3986#section-5) _MUST_ be used. The **base URI** value is the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) that is
associated with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects), see [5.1.1 DID Subject](https://www.w3.org/TR/did-1.0/#did-subject). The
**scheme** is `did`. The **authority** is a
combination of `<method-name>:<method-specific-id>`, and the
**path**, **query**, and **fragment**
values are those defined in [Path](https://www.w3.org/TR/did-1.0/#path), [Query](https://www.w3.org/TR/did-1.0/#query), and [Fragment](https://www.w3.org/TR/did-1.0/#fragment), respectively.


Relative [DID URLs](https://www.w3.org/TR/did-1.0/#dfn-did-urls) are often used to reference [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method)
and [services](https://www.w3.org/TR/did-1.0/#dfn-service) in a [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) without having to use absolute
URLs. [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) where storage size is a consideration might use
relative URLs to reduce the storage size of [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


[Example 9](https://www.w3.org/TR/did-1.0/#example-an-example-of-a-relative-did-url): An example of a relative DID URL

```
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ]
  "id": "did:example:123456789abcdefghi",
  "verificationMethod": [{\
    "id": "did:example:123456789abcdefghi#key-1",\
    "type": "Ed25519VerificationKey2020", // external (property value)\
    "controller": "did:example:123456789abcdefghi",\
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
  }, ...],
  "authentication": [\
    // a relative DID URL used to reference a verification method above\
    "#key-1"\
  ]
}
```

In the example above, the relative [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) value will be transformed to
an absolute [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) value of
`did:example:123456789abcdefghi#key-1`.


## 4\. Data Model

[Permalink for Section 4.](https://www.w3.org/TR/did-1.0/#data-model)

This specification defines a data model that can be used to express [DID\\
documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) and DID document data structures, which can then be serialized
into multiple concrete [representations](https://www.w3.org/TR/did-1.0/#dfn-representations). This section provides a
high-level description of the data model, descriptions of the ways different
types of properties are expressed in the data model, and instructions for
extending the data model.


A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) consists of a [map](https://infra.spec.whatwg.org/#maps) of [entries](https://infra.spec.whatwg.org/#map-entry), where each entry consists of a
key/value pair. The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) data model contains at least two
different classes of entries. The first class of entries is called properties,
and is specified in section [5\. Core Properties](https://www.w3.org/TR/did-1.0/#core-properties). The second class
is made up of [representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry), and is specified in
section [6\. Representations](https://www.w3.org/TR/did-1.0/#representations).


![ Diagram illustrating the entries in the DID document, including properties and representation-specific entries; some entries are defined by this specification; others are defined by registered or unregistered extensions.](https://www.w3.org/TR/did-1.0/diagrams/diagram-did-document-entries.svg)Figure 3
The entries in a DID document.
See also: [narrative description](https://www.w3.org/TR/did-1.0/#did-document-entries-longdesc).


The diagram is titled, "Entries in the DID Document map". A dotted grey line
runs horizontally through the center of the diagram. The space above the line
is labeled "Properties", and the space below it, "Representation-specific
entries". Six labeled rectangles appear in the diagram, three lying above the
dotted grey line and three below it. A large green rectangle, labeled "DID
Specification Registries", encloses the four leftmost rectangles (upper left,
upper center, lower left, and lower center). The two leftmost rectangles
(upper left and lower left) are outlined in blue and labeled in blue, as
follows. The upper left rectangle is labeled "Core Properties", and contains
text "id, alsoKnownAs, controller, authentication, verificationMethod, service,
serviceEndpoint, ...". The lower left rectangle is labeled "Core
Representation-specific Entries", and contains text "@context". The four
rightmost rectangles (upper center, upper right, lower center, and lower right)
are outlined in grey and labeled in black, as follows. The upper center
rectangle is labeled, "Property Extensions", and contains text
"ethereumAddress". The lower center rectangle is labeled,
"Representation-specific Entry Extensions", and contains no other text. The
upper right rectangle is labeled, "Unregistered Property Extensions", and
contains text "foo". The lower right rectangle is labeled "Unregistered
Representation-specific Entry Extensions", and contains text "%YAML, xmlns".


All entry keys in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) data model are [strings](https://infra.spec.whatwg.org/#strings). All entry values are expressed using one
of the abstract data types in the table below, and each [representation](https://www.w3.org/TR/did-1.0/#dfn-representations)
specifies the concrete serialization format of each data type.


| Data Type | Considerations |
| --- | --- |
| [map](https://infra.spec.whatwg.org/#maps) | A finite ordered sequence of key/value pairs, with no key appearing twice as<br>specified in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. A map is sometimes referred to as an<br>[ordered map](https://infra.spec.whatwg.org/#maps) in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. |
| [list](https://infra.spec.whatwg.org/#list) | A finite ordered sequence of items as specified in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. |
| [set](https://infra.spec.whatwg.org/#ordered-set) | A finite ordered sequence of items that does not contain the same item twice<br>as specified in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. A set is sometimes referred to as an<br>[ordered set](https://infra.spec.whatwg.org/#ordered-set) in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. |
| datetime | A date and time value that is capable of losslessly expressing all values<br>expressible by a `dateTime` as specified in<br>\[ [XMLSCHEMA11-2](https://www.w3.org/TR/xmlschema11-2/#dateTime)\]. |
| [string](https://infra.spec.whatwg.org/#string) | A sequence of code units often used to represent human readable language<br>as specified in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. |
| integer | A real number without a fractional component as specified in<br>\[ [XMLSCHEMA11-2](https://www.w3.org/TR/xmlschema11-2/#decimal)\]. To maximize<br>interoperability, implementers are urged to heed the advice regarding<br>integers in [RFC8259, Section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6). |
| double | A value that is often used to approximate arbitrary real numbers as specified<br>in \[ [XMLSCHEMA11-2](https://www.w3.org/TR/xmlschema11-2/#double)\]. To maximize<br>interoperability, implementers are urged to heed the advice regarding<br>doubles in [RFC8259, Section 6: Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6). |
| [boolean](https://infra.spec.whatwg.org/#boolean) | A value that is either true or false as defined in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. |
| [null](https://infra.spec.whatwg.org/#nulls) | A value that is used to indicate the lack of a value as defined in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\]. |

As a result of the [data model](https://www.w3.org/TR/did-1.0/#data-model) being defined using
terminology from \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\], property values which can contain more than one
item, such as [lists](https://infra.spec.whatwg.org/#list), [maps](https://infra.spec.whatwg.org/#ordered-map) and [sets](https://infra.spec.whatwg.org/#ordered-set), are explicitly ordered. All list-like
value structures in \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\] are ordered, whether or not that order is
significant. For the purposes of this specification, unless otherwise stated, [map](https://infra.spec.whatwg.org/#ordered-map) and [set](https://infra.spec.whatwg.org/#ordered-set) ordering is not important and
implementations are not expected to produce or consume deterministically ordered
values.


### 4.1 Extensibility

[Permalink for Section 4.1](https://www.w3.org/TR/did-1.0/#extensibility)

The data model supports two types of extensibility.


1. For maximum interoperability, it is _RECOMMENDED_ that extensions use the
   W3C DID Specification Registries mechanism \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\]. The use of
   this mechanism for new properties or other extensions is the only specified
   mechanism that ensures that two different [representations](https://www.w3.org/TR/did-1.0/#dfn-representations) will be able to
   work together.

2. [Representations](https://www.w3.org/TR/did-1.0/#dfn-representations) _MAY_ define other extensibility mechanisms, including ones
   that do not require the use of the DID Specification Registries. Such extension
   mechanisms _SHOULD_ support lossless conversion into any other conformant
   [representation](https://www.w3.org/TR/did-1.0/#dfn-representations). Extension mechanisms for a [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _SHOULD_
   define a mapping of all properties and [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) syntax into the [data model](https://www.w3.org/TR/did-1.0/#data-model) and its type system.


Note: Unregistered extensions are less reliable

It is always possible for two specific implementations to agree out-of-band to
use a mutually understood extension or [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) that is not
recorded in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\];
interoperability between such implementations and the larger ecosystem will be
less reliable.


## 5\. Core Properties

[Permalink for Section 5.](https://www.w3.org/TR/did-1.0/#core-properties)

A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is associated with a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
[DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are expressed using the
[data model](https://www.w3.org/TR/did-1.0/#data-model) and can be serialized into a
[representation](https://www.w3.org/TR/did-1.0/#representations).
The following sections define the properties in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents),
including whether these properties are required or optional. These properties
describe relationships between the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and the value of the
property.


The following tables contain informative references for the core properties
defined by this specification, with expected values, and whether or not they are
required. The property names in the tables are linked to the normative
definitions and more detailed descriptions of each property.


Note: Property names used in maps of different types

The property names `id`, `type`, and
`controller` can be present in maps of different types
with possible differences in constraints.


### DID Document properties

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#did-document-properties)

| Property | Required? | Value constraints |
| --- | --- | --- |
| `id` | yes | A [string](https://infra.spec.whatwg.org/#string) that conforms to the rules in<br>[3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). |
| `alsoKnownAs` | no | A [set](https://infra.spec.whatwg.org/#ordered-set) of<br>[strings](https://infra.spec.whatwg.org/#string) that conform to the rules of<br>\[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\] for [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri). |
| `controller` | no | A [string](https://infra.spec.whatwg.org/#string) or a<br>[set](https://infra.spec.whatwg.org/#ordered-set) of<br>[strings](https://infra.spec.whatwg.org/#string) that conform to the rules in<br>[3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). |
| `verificationMethod` | no | A [set](https://infra.spec.whatwg.org/#ordered-set) of<br>[Verification Method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) [maps](https://infra.spec.whatwg.org/#ordered-map)<br>that conform to the rules in [Verification Method properties](https://www.w3.org/TR/did-1.0/#verification-method-properties). |
| `authentication` | no | A [set](https://infra.spec.whatwg.org/#ordered-set) of either [Verification\<br>Method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) [maps](https://infra.spec.whatwg.org/#ordered-map) that conform to<br>the rules in [Verification Method properties](https://www.w3.org/TR/did-1.0/#verification-method-properties)) or<br>[strings](https://infra.spec.whatwg.org/#string) that conform to the rules in<br>[3.2 DID URL Syntax](https://www.w3.org/TR/did-1.0/#did-url-syntax). |
| `assertionMethod` | no |
| `keyAgreement` | no |
| `capabilityInvocation` | no |
| `capabilityDelegation` | no |
| `service` | no | A [set](https://infra.spec.whatwg.org/#ordered-set) of [Service Endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) [maps](https://infra.spec.whatwg.org/#ordered-map) that conform to the rules in<br>[Service properties](https://www.w3.org/TR/did-1.0/#service-properties). |

### Verification Method properties

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#verification-method-properties)

| Property | Required? | Value constraints |
| --- | --- | --- |
| `id` | yes | A [string](https://infra.spec.whatwg.org/#string) that conforms to the rules in<br>[3.2 DID URL Syntax](https://www.w3.org/TR/did-1.0/#did-url-syntax). |
| `controller` | yes | A [string](https://infra.spec.whatwg.org/#string) that conforms to the rules in<br>[3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). |
| `type` | yes | A [string](https://infra.spec.whatwg.org/#string). |
| `publicKeyJwk` | no | A [map](https://infra.spec.whatwg.org/#maps) representing a JSON Web Key that conforms<br>to \[[RFC7517](https://www.w3.org/TR/did-1.0/#bib-rfc7517 "JSON Web Key (JWK)")\]. See [definition of publicKeyJwk](https://www.w3.org/TR/did-1.0/#dfn-publickeyjwk)<br>for additional constraints. |
| `publicKeyMultibase` | no | A [string](https://infra.spec.whatwg.org/#string) that conforms to a<br>\[[MULTIBASE](https://www.w3.org/TR/did-1.0/#bib-multibase "The Multibase Encoding Scheme")\] encoded public key. |

### Service properties

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#service-properties)

| Property | Required? | Value constraints |
| --- | --- | --- |
| `id` | yes | A [string](https://infra.spec.whatwg.org/#string) that conforms to the rules of<br>\[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\] for [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri). |
| `type` | yes | A [string](https://infra.spec.whatwg.org/#string) or a<br>[set](https://infra.spec.whatwg.org/#ordered-set) of<br>[strings](https://infra.spec.whatwg.org/#string). |
| `serviceEndpoint` | yes | A [string](https://infra.spec.whatwg.org/#string) that conforms to the rules of<br>\[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\] for [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri), a [map](https://infra.spec.whatwg.org/#string), or a<br>[set](https://infra.spec.whatwg.org/#ordered-set) composed of a one or more<br>[strings](https://infra.spec.whatwg.org/#string) that conform to the rules of<br>\[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\] for [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri) and/or [maps](https://infra.spec.whatwg.org/#string). |

### 5.1 Identifiers

[Permalink for Section 5.1](https://www.w3.org/TR/did-1.0/#identifiers)

This section describes the mechanisms by which [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
include identifiers for [DID subjects](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers).


#### 5.1.1 DID Subject

[Permalink for Section 5.1.1](https://www.w3.org/TR/did-1.0/#did-subject)

The [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for a particular [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is expressed using the
`id` property in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


id
The value of `id` _MUST_ be a [string](https://infra.spec.whatwg.org/#string) that conforms to the rules in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax) and _MUST_ exist in the root [map](https://infra.spec.whatwg.org/#ordered-map) of the [data\\
model](https://www.w3.org/TR/did-1.0/#data-model) for the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


[Example 10](https://www.w3.org/TR/did-1.0/#example-10)

```
{
  "id": "did:example:123456789abcdefghijk"
}
```

The `id` property only denotes the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) of the
[DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) when it is present in the _topmost_ [map](https://infra.spec.whatwg.org/#ordered-map) of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


Note: Intermediate representations

[DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications can create intermediate representations of a
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that do not contain the `id` property,
such as when a [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) is performing [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution).
However, the fully resolved [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) always contains a valid
`id` property.


#### 5.1.2 DID Controller

[Permalink for Section 5.1.2](https://www.w3.org/TR/did-1.0/#did-controller)

A [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) is an entity that is authorized to make changes to a
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). The process of authorizing a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) is
defined by the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


controller
The `controller` property is _OPTIONAL_. If present, the value _MUST_
be a [string](https://infra.spec.whatwg.org/#string) or a [set](https://infra.spec.whatwg.org/#ordered-set) of [strings](https://infra.spec.whatwg.org/#string) that conform to the rules in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). The corresponding [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)(s) _SHOULD_
contain [verification relationships](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) that explicitly permit the use of
certain [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) for specific purposes.


When a `controller` property is present in a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), its value expresses one or more [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). Any [verification\\
methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) contained in the [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) for those [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) _SHOULD_
be accepted as authoritative, such that proofs that satisfy those
[verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) are to be considered equivalent to proofs provided
by the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).


[Example 11](https://www.w3.org/TR/did-1.0/#example-did-document-with-a-controller-property): DID document with a controller property

```
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi",
  "controller": "did:example:bcehfew7h32f32h7af3",
}
```

Note: Authorization vs authentication

Note that authorization provided by the value of `controller` is
separate from authentication as described in [5.3.1 Authentication](https://www.w3.org/TR/did-1.0/#authentication).
This is particularly important for key recovery in the case of cryptographic key
loss, where the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) no longer has access to their keys, or key
compromise, where the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers)'s trusted third parties need to
override malicious activity by an attacker. See [9\. Security Considerations](https://www.w3.org/TR/did-1.0/#security-considerations) for information related to threat models
and attack vectors.


#### 5.1.3 Also Known As

[Permalink for Section 5.1.3](https://www.w3.org/TR/did-1.0/#also-known-as)

A [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) can have multiple identifiers for different purposes, or
at different times. The assertion that two or more [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) (or other types
of [URI](https://www.w3.org/TR/did-1.0/#dfn-uri)) refer to the same [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) can be made using the
`alsoKnownAs` property.


alsoKnownAs
The `alsoKnownAs` property is _OPTIONAL_. If present, the value _MUST_
be a [set](https://infra.spec.whatwg.org/#ordered-set) where each item in the
set is a [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) conforming to \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\].

This relationship is a statement that the subject of this identifier is
also identified by one or more other identifiers.


Note: Equivalence and alsoKnownAs

Applications might choose to consider two identifiers related by
`alsoKnownAs` to be equivalent _if_ the
`alsoKnownAs` relationship is reciprocated in the reverse
direction. It is best practice _not_ to consider them equivalent in the
absence of this inverse relationship. In other words, the presence of an
`alsoKnownAs` assertion does not prove that this assertion
is true. Therefore, it is strongly advised that a requesting party obtain
independent verification of an `alsoKnownAs` assertion.


Given that the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) might use different identifiers for different
purposes, an expectation of strong equivalence between the two identifiers, or
merging the information of the two corresponding [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents), is not
necessarily appropriate, _even with_ a reciprocal relationship.


### 5.2 Verification Methods

[Permalink for Section 5.2](https://www.w3.org/TR/did-1.0/#verification-methods)

A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can express [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method), such as
cryptographic public keys, which can be used to [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) or authorize
interactions with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) or associated parties. For example, a
cryptographic public key can be used as a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) with
respect to a digital signature; in such usage, it verifies that the signer
could use the associated cryptographic private key. [Verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method)
might take many parameters. An example of this is a set of five cryptographic
keys from which any three are required to contribute to a cryptographic
threshold signature.


verificationMethod

The `verificationMethod` property is _OPTIONAL_. If present, the value
_MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) of [verification\\
methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method), where each [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is expressed using a [map](https://infra.spec.whatwg.org/#ordered-map). The [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) [map](https://infra.spec.whatwg.org/#ordered-map) _MUST_ include the `id`,
`type`, `controller`, and specific verification material
properties that are determined by the value of `type` and are defined
in [5.2.1 Verification Material](https://www.w3.org/TR/did-1.0/#verification-material). A [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MAY_
include additional properties. [Verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _SHOULD_ be registered
in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].


id

The value of the `id` property for a [verification\\
method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MUST_ be a [string](https://infra.spec.whatwg.org/#string) that conforms to the
rules in Section [3.2 DID URL Syntax](https://www.w3.org/TR/did-1.0/#did-url-syntax).


type
The value of the `type` property _MUST_ be a [string](https://infra.spec.whatwg.org/#string) that references exactly one [verification\\
method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) type. In order to maximize global interoperability, the
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) type _SHOULD_ be registered in the DID Specification
Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].
 controller
The value of the `controller` property _MUST_ be a [string](https://infra.spec.whatwg.org/#string) that conforms to the rules in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax).


[Example 12](https://www.w3.org/TR/did-1.0/#example-example-verification-method-structure): Example verification method structure

```hljs javascript
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/jws-2020/v1"\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ]
  "id": "did:example:123456789abcdefghi",
  ...
  "verificationMethod": [{\
    "id": ...,\
    "type": ...,\
    "controller": ...,\
    "publicKeyJwk": ...\
  }, {\
    "id": ...,\
    "type": ...,\
    "controller": ...,\
    "publicKeyMultibase": ...\
  }]
}
```

Note: Verification method controller(s) and DID controller(s)

The semantics of the `controller` property are the same when the
subject of the relationship is the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) as when the subject of
the relationship is a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method), such as a cryptographic public
key. Since a key can't control itself, and the key controller cannot be inferred
from the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), it is necessary to explicitly express the identity
of the controller of the key. The difference is that the value of
`controller` for a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is _not_
necessarily a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers). [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) are expressed
using the `controller` property at the highest level of the
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) (the topmost [map](https://infra.spec.whatwg.org/#ordered-map) in the
[data model](https://www.w3.org/TR/did-1.0/#data-model)); see [5.1.2 DID Controller](https://www.w3.org/TR/did-1.0/#did-controller).


#### 5.2.1 Verification Material

[Permalink for Section 5.2.1](https://www.w3.org/TR/did-1.0/#verification-material)

Verification material is any information that is used by a process that applies
a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method). The `type` of a [verification\\
method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is expected to be used to determine its compatibility with such
processes. Examples of verification material properties are
`publicKeyJwk` or `publicKeyMultibase`. A
[cryptographic suite](https://www.w3.org/TR/did-1.0/#dfn-cryptosuite) specification is responsible for specifying the
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) `type` and its associated verification
material. For example, see
[JSON\\
Web Signature 2020](https://w3c-ccg.github.io/lds-jws2020/) and [Ed25519 Signature 2020](https://w3c-ccg.github.io/lds-ed25519-2020/).
For all registered [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) types and associated verification
material available for [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), please see the DID Specification Registries
\[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].


To increase the likelihood of interoperable implementations, this specification
limits the number of formats for expressing verification material in a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). The fewer formats that implementers have to
implement, the more likely it will be that they will support all of them. This
approach attempts to strike a delicate balance between ease of implementation
and supporting formats that have historically had broad deployment.
Two supported verification material properties are listed below:


publicKeyJwk

The `publicKeyJwk` property is _OPTIONAL_. If present, the value _MUST_
be a [map](https://infra.spec.whatwg.org/#ordered-map) representing a JSON Web Key that
conforms to \[[RFC7517](https://www.w3.org/TR/did-1.0/#bib-rfc7517 "JSON Web Key (JWK)")\]. The [map](https://infra.spec.whatwg.org/#ordered-map) _MUST NOT_
contain "d", or any other members of the private information class as described
in [Registration\\
Template](https://tools.ietf.org/html/rfc7517#section-8.1.1). It is _RECOMMENDED_ that verification methods that use JWKs
\[[RFC7517](https://www.w3.org/TR/did-1.0/#bib-rfc7517 "JSON Web Key (JWK)")\] to represent their public keys use the value of `kid` as
their [fragment identifier](https://www.w3.org/TR/did-1.0/#fragment). It is _RECOMMENDED_ that JWK
`kid` values are set to the public key fingerprint \[[RFC7638](https://www.w3.org/TR/did-1.0/#bib-rfc7638 "JSON Web Key (JWK) Thumbprint")\]. See
the first key in [Example 13](https://www.w3.org/TR/did-1.0/#example-various-verification-method-types) for
an example of a public key with a compound key identifier.


publicKeyMultibase

The `publicKeyMultibase` property is _OPTIONAL_. This feature is
non-normative. If present, the value _MUST_ be a [string](https://infra.spec.whatwg.org/#string) representation of a \[[MULTIBASE](https://www.w3.org/TR/did-1.0/#bib-multibase "The Multibase Encoding Scheme")\] encoded
public key.


Note that the \[[MULTIBASE](https://www.w3.org/TR/did-1.0/#bib-multibase "The Multibase Encoding Scheme")\] specification is not yet a standard and is
subject to change. There might be some use cases for this data format
where `publicKeyMultibase` is defined, to allow for
expression of public keys, but `privateKeyMultibase`
is not defined, to protect against accidental leakage of secret keys.


A [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MUST NOT_ contain multiple verification material
properties for the same material. For example, expressing key material in a
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) using both `publicKeyJwk` and
`publicKeyMultibase` at the same time is prohibited.


An example of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) containing [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) using
both properties above is shown below.


[Example 13](https://www.w3.org/TR/did-1.0/#example-various-verification-method-types): Verification methods using publicKeyJwk and publicKeyMultibase

```
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/jws-2020/v1",\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ]
  "id": "did:example:123456789abcdefghi",
  ...
  "verificationMethod": [{\
    "id": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",\
    "type": "JsonWebKey2020", // external (property value)\
    "controller": "did:example:123",\
    "publicKeyJwk": {\
      "crv": "Ed25519", // external (property name)\
      "x": "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ", // external (property name)\
      "kty": "OKP", // external (property name)\
      "kid": "_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A" // external (property name)\
    }\
  }, {\
    "id": "did:example:123456789abcdefghi#keys-1",\
    "type": "Ed25519VerificationKey2020", // external (property value)\
    "controller": "did:example:pqrstuvwxyz0987654321",\
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
  }],
  ...
}
```

#### 5.2.2 Referring to Verification Methods

[Permalink for Section 5.2.2](https://www.w3.org/TR/did-1.0/#referring-to-verification-methods)

[Verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) can be embedded in or referenced from properties
associated with various [verification relationships](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) as described in [5.3 Verification Relationships](https://www.w3.org/TR/did-1.0/#verification-relationships). Referencing [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method)
allows them to be used by more than one [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship).


If the value of a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) property is a [map](https://infra.spec.whatwg.org/#ordered-map), the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) has been
embedded and its properties can be accessed directly. However, if the value is a
URL [string](https://infra.spec.whatwg.org/#string), the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) has
been included by reference and its properties will need to be retrieved from
elsewhere in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) or from another [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). This
is done by dereferencing the URL and searching the resulting [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) for a
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) [map](https://infra.spec.whatwg.org/#ordered-map) with an
`id` property whose value matches the URL.


[Example 14](https://www.w3.org/TR/did-1.0/#example-embedding-and-referencing-verification-methods): Embedding and referencing verification methods

```
{
...

  "authentication": [\
    // this key is referenced and might be used by\
    // more than one verification relationship\
    "did:example:123456789abcdefghi#keys-1",\
    // this key is embedded and may *only* be used for authentication\
    {\
      "id": "did:example:123456789abcdefghi#keys-2",\
      "type": "Ed25519VerificationKey2020", // external (property value)\
      "controller": "did:example:123456789abcdefghi",\
      "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
    }\
  ],

...
}
```

### 5.3 Verification Relationships

[Permalink for Section 5.3](https://www.w3.org/TR/did-1.0/#verification-relationships)

A [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) expresses the relationship between the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method).


Different [verification relationships](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) enable the associated
[verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) to be used for different purposes. It is up to a
_verifier_ to ascertain the validity of a verification attempt by
checking that the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) used is contained in the
appropriate [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) property of the
[DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


The [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) between the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and the
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is explicit in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
[Verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) that are not associated with a particular
[verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) cannot be used for that [verification\\
relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship). For example, a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) in the value of
the `authentication` property cannot be used to engage in
key agreement protocols with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects)—the value of the
`keyAgreement` property needs to be used for that.


The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) does not express revoked keys using a [verification\\
relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship). If a referenced verification method is not in the latest
[DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) used to dereference it, then that verification method is
considered invalid or revoked. Each [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification is expected
to detail how revocation is performed and tracked.


The following sections define several useful [verification relationships](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship).
A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) _MAY_ include any of these, or other properties, to
express a specific [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship). In order to maximize global
interoperability, any such properties used _SHOULD_ be registered in the DID
Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].


#### 5.3.1 Authentication

[Permalink for Section 5.3.1](https://www.w3.org/TR/did-1.0/#authentication)

The `authentication` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) is used to
specify how the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is expected to be [authenticated](https://www.w3.org/TR/did-1.0/#dfn-authenticated), for
purposes such as logging into a website or engaging in any sort of
challenge-response protocol.


authentication
The `authentication` property is _OPTIONAL_. If present, the associated
value _MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) of one or more
[verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method). Each [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MAY_ be embedded or
referenced.


[Example 15](https://www.w3.org/TR/did-1.0/#example-authentication-property-containing-three-verification-methods): Authentication property
containing three verification methods

```
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ],
  "id": "did:example:123456789abcdefghi",
  ...
  "authentication": [\
    // this method can be used to authenticate as did:...fghi\
    "did:example:123456789abcdefghi#keys-1",\
    // this method is *only* approved for authentication, it may not\
    // be used for any other proof purpose, so its full description is\
    // embedded here rather than using only a reference\
    {\
      "id": "did:example:123456789abcdefghi#keys-2",\
      "type": "Ed25519VerificationKey2020",\
      "controller": "did:example:123456789abcdefghi",\
      "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
    }\
  ],
  ...
}
```

If authentication is established, it is up to the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) or other
application to decide what to do with that information. A particular [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) could decide that authenticating as a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) is
sufficient to, for example, update or delete the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). Another
[DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) could require different keys, or a different [verification\\
method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) entirely, to be presented in order to update or delete the [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) than that used to [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated). In other words, what is done
_after_ the authentication check is out of scope for the [data model](https://www.w3.org/TR/did-1.0/#data-model); [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and applications are
expected to define this themselves.


This is useful to any _authentication verifier_ that needs to check to
see if an entity that is attempting to [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) is, in fact,
presenting a valid proof of authentication. When a _verifier_ receives
some data (in some protocol-specific format) that contains a proof that was made
for the purpose of "authentication", and that says that an entity is identified
by the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), then that _verifier_ checks to ensure that the proof
can be verified using a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) (e.g., public key) listed
under `authentication` in the [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


Note that the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) indicated by the
`authentication` property of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can only be
used to [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). To [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) a
different [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers), the entity associated with the value of
`controller`, as defined in [5.1.2 DID Controller](https://www.w3.org/TR/did-1.0/#did-controller), needs to
[authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) with its _own_ [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) and associated
`authentication` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship).


#### 5.3.2 Assertion

[Permalink for Section 5.3.2](https://www.w3.org/TR/did-1.0/#assertion)

The `assertionMethod` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) is used to
specify how the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is expected to express claims, such as for
the purposes of issuing a Verifiable Credential \[[VC-DATA-MODEL](https://www.w3.org/TR/did-1.0/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\].


assertionMethod
The `assertionMethod` property is _OPTIONAL_. If present, the
associated value _MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) of
one or more [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method). Each [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MAY_ be
embedded or referenced.


This property is useful, for example, during the processing of a [verifiable\\
credential](https://www.w3.org/TR/did-1.0/#dfn-verifiable-credentials) by a verifier. During verification, a verifier checks to see if a
[verifiable credential](https://www.w3.org/TR/did-1.0/#dfn-verifiable-credentials) contains a proof created by the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects)
by checking that the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) used to assert the proof is
associated with the `assertionMethod` property in the
corresponding [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


[Example 16](https://www.w3.org/TR/did-1.0/#example-assertion-method-property-containing-two-verification-methods): Assertion method property
containing two verification methods

```
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ],
  "id": "did:example:123456789abcdefghi",
  ...
  "assertionMethod": [\
    // this method can be used to assert statements as did:...fghi\
    "did:example:123456789abcdefghi#keys-1",\
    // this method is *only* approved for assertion of statements, it is not\
    // used for any other verification relationship, so its full description is\
    // embedded here rather than using a reference\
    {\
      "id": "did:example:123456789abcdefghi#keys-2",\
      "type": "Ed25519VerificationKey2020", // external (property value)\
      "controller": "did:example:123456789abcdefghi",\
      "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
    }\
  ],
  ...
}
```

#### 5.3.3 Key Agreement

[Permalink for Section 5.3.3](https://www.w3.org/TR/did-1.0/#key-agreement)

The `keyAgreement` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) is used to
specify how an entity can generate encryption material in order to transmit
confidential information intended for the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects), such as for
the purposes of establishing a secure communication channel with the recipient.


keyAgreement
The `keyAgreement` property is _OPTIONAL_. If present, the associated
value _MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) of one or more
[verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method). Each [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MAY_ be embedded or
referenced.


An example of when this property is useful is when encrypting a message intended
for the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). In this case, the counterparty uses the
cryptographic public key information in the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) to wrap a
decryption key for the recipient.


[Example 17](https://www.w3.org/TR/did-1.0/#example-key-agreement-property-containing-two-verification-methods): Key agreement property
containing two verification methods

```
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi",
  ...
  "keyAgreement": [\
    // this method can be used to perform key agreement as did:...fghi\
    "did:example:123456789abcdefghi#keys-1",\
    // this method is *only* approved for key agreement usage, it will not\
    // be used for any other verification relationship, so its full description is\
    // embedded here rather than using only a reference\
    {\
      "id": "did:example:123#zC9ByQ8aJs8vrNXyDhPHHNNMSHPcaSgNpjjsBYpMMjsTdS",\
      "type": "X25519KeyAgreementKey2019", // external (property value)\
      "controller": "did:example:123",\
      "publicKeyMultibase": "z9hFgmPVfmBZwRvFEyniQDBkz9LmV7gDEqytWyGZLmDXE"\
    }\
  ],
  ...
}
```

#### 5.3.4 Capability Invocation

[Permalink for Section 5.3.4](https://www.w3.org/TR/did-1.0/#capability-invocation)

The `capabilityInvocation` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) is used
to specify a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) that might be used by the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) to invoke a cryptographic capability, such as the authorization to
update the [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


capabilityInvocation
The `capabilityInvocation` property is _OPTIONAL_. If present, the
associated value _MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) of
one or more [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method). Each [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MAY_ be
embedded or referenced.


An example of when this property is useful is when a [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) needs to
access a protected HTTP API that requires authorization in order to use it. In
order to authorize when using the HTTP API, the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects)
uses a capability that is associated with a particular URL that is
exposed via the HTTP API. The invocation of the capability could be
expressed in a number of ways, e.g., as a digitally signed
message that is placed into the HTTP Headers.


The server providing the HTTP API is the _verifier_ of the capability and
it would need to verify that the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) referred to by the
invoked capability exists in the `capabilityInvocation`
property of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). The verifier would also check to make sure
that the action being performed is valid and the capability is appropriate for
the resource being accessed. If the verification is successful, the server has
cryptographically determined that the invoker is authorized to access the
protected resource.


[Example 18](https://www.w3.org/TR/did-1.0/#example-capability-invocation-property-containing-two-verification-methods): Capability invocation property
containing two verification methods

```
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ],
  "id": "did:example:123456789abcdefghi",
  ...
  "capabilityInvocation": [\
    // this method can be used to invoke capabilities as did:...fghi\
    "did:example:123456789abcdefghi#keys-1",\
    // this method is *only* approved for capability invocation usage, it will not\
    // be used for any other verification relationship, so its full description is\
    // embedded here rather than using only a reference\
    {\
    "id": "did:example:123456789abcdefghi#keys-2",\
    "type": "Ed25519VerificationKey2020", // external (property value)\
    "controller": "did:example:123456789abcdefghi",\
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
    }\
  ],
  ...
}
```

#### 5.3.5 Capability Delegation

[Permalink for Section 5.3.5](https://www.w3.org/TR/did-1.0/#capability-delegation)

The `capabilityDelegation` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) is used
to specify a mechanism that might be used by the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) to delegate
a cryptographic capability to another party, such as delegating the authority
to access a specific HTTP API to a subordinate.


capabilityDelegation
The `capabilityDelegation` property is _OPTIONAL_. If present, the
associated value _MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) of
one or more [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method). Each [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) _MAY_ be
embedded or referenced.


An example of when this property is useful is when a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers)
chooses to delegate their capability to access a protected HTTP API to a party
other than themselves. In order to delegate the capability, the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) would use a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) associated with the
`capabilityDelegation` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) to
cryptographically sign the capability over to another [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). The
delegate would then use the capability in a manner that is similar to the
example described in [5.3.4 Capability Invocation](https://www.w3.org/TR/did-1.0/#capability-invocation).


[Example 19](https://www.w3.org/TR/did-1.0/#example-capability-delegation-property-containing-two-verification-methods): Capability Delegation property
containing two verification methods

```
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/ed25519-2020/v1"\
  ],
  "id": "did:example:123456789abcdefghi",
  ...
  "capabilityDelegation": [\
    // this method can be used to perform capability delegation as did:...fghi\
    "did:example:123456789abcdefghi#keys-1",\
    // this method is *only* approved for granting capabilities; it will not\
    // be used for any other verification relationship, so its full description is\
    // embedded here rather than using only a reference\
    {\
    "id": "did:example:123456789abcdefghi#keys-2",\
    "type": "Ed25519VerificationKey2020", // external (property value)\
    "controller": "did:example:123456789abcdefghi",\
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
    }\
  ],
  ...
}
```

### 5.4 Services

[Permalink for Section 5.4](https://www.w3.org/TR/did-1.0/#services)

[Services](https://www.w3.org/TR/did-1.0/#dfn-service) are used in [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) to express ways of
communicating with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) or associated entities. A
[service](https://www.w3.org/TR/did-1.0/#dfn-service) can be any type of service the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) wants to
advertise, including [decentralized identity management](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identity-management) services for
further discovery, authentication, authorization, or interaction.


Due to privacy concerns, revealing public information through [services](https://www.w3.org/TR/did-1.0/#dfn-service),
such as social media accounts, personal websites, and email addresses, is
discouraged. Further exploration of privacy concerns can be found in [10.1 Keep Personal Data Private](https://www.w3.org/TR/did-1.0/#keep-personal-data-private) and [10.6 Service Privacy](https://www.w3.org/TR/did-1.0/#service-privacy). The
information associated with [services](https://www.w3.org/TR/did-1.0/#dfn-service) is often service specific. For
example, the information associated with an encrypted messaging service can
express how to initiate the encrypted link before messaging begins.


[Services](https://www.w3.org/TR/did-1.0/#dfn-service) are expressed using the `service` property,
which is described below:


service

The `service` property is _OPTIONAL_. If present, the associated value
_MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) of [services](https://www.w3.org/TR/did-1.0/#dfn-service),
where each service is described by a [map](https://infra.spec.whatwg.org/#ordered-map).
Each [service](https://www.w3.org/TR/did-1.0/#dfn-service) [map](https://infra.spec.whatwg.org/#ordered-map) _MUST_ contain
`id`, `type`, and
`serviceEndpoint` properties. Each service extension _MAY_
include additional properties and _MAY_ further restrict the properties associated
with the extension.


id
The value of the `id` property _MUST_ be a [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) conforming to
\[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]. A [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) _MUST NOT_ produce
multiple `service` entries with the same `id`.
A [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) _MUST_ produce an error if it detects
multiple `service` entries with the same `id`.
 type
The value of the `type` property _MUST_ be a [string](https://infra.spec.whatwg.org/#string) or a [set](https://infra.spec.whatwg.org/#ordered-set) of [strings](https://infra.spec.whatwg.org/#string). In order to maximize interoperability,
the [service](https://www.w3.org/TR/did-1.0/#dfn-service) type and its associated properties _SHOULD_ be
registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].
 serviceEndpoint
The value of the `serviceEndpoint` property _MUST_ be a [string](https://infra.spec.whatwg.org/#string), a [map](https://infra.spec.whatwg.org/#string), or
a [set](https://infra.spec.whatwg.org/#ordered-set) composed of one or more [strings](https://infra.spec.whatwg.org/#string) and/or [maps](https://infra.spec.whatwg.org/#string). All [string](https://infra.spec.whatwg.org/#string)
values _MUST_ be valid [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri) conforming to \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\] and normalized
according to the [Normalization and Comparison\\
rules in RFC3986](https://www.rfc-editor.org/rfc/rfc3986#section-6) and to any normalization rules in its applicable [URI](https://www.w3.org/TR/did-1.0/#dfn-uri)
scheme specification.


For more information regarding privacy and security considerations related
to [services](https://www.w3.org/TR/did-1.0/#dfn-service) see [10.6 Service Privacy](https://www.w3.org/TR/did-1.0/#service-privacy), [10.1 Keep Personal Data Private](https://www.w3.org/TR/did-1.0/#keep-personal-data-private), [10.3 DID Document Correlation Risks](https://www.w3.org/TR/did-1.0/#did-document-correlation-risks), and [9.3 Authentication Service Endpoints](https://www.w3.org/TR/did-1.0/#authentication-service-endpoints).


[Example 20](https://www.w3.org/TR/did-1.0/#example-usage-of-the-service-property): Usage of the service property

```
{
  "service": [{\
    "id":"did:example:123#linked-domain",\
    "type": "LinkedDomains", // external (property value)\
    "serviceEndpoint": "https://bar.example.com"\
  }]
}
```

## 6\. Representations

[Permalink for Section 6.](https://www.w3.org/TR/did-1.0/#representations)

A concrete serialization of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) in this specification is
called a [representation](https://www.w3.org/TR/did-1.0/#dfn-representations). A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) is created by
serializing the [data model](https://www.w3.org/TR/did-1.0/#data-model) through a process called
production. A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) is transformed into the [data model](https://www.w3.org/TR/did-1.0/#data-model) through a process called
consumption. The _production_ and _consumption_
processes enable the conversion of information from one [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) to
another. This specification defines [representations](https://www.w3.org/TR/did-1.0/#dfn-representations) for JSON and JSON-LD,
and developers can use any other [representation](https://www.w3.org/TR/did-1.0/#dfn-representations), such as XML or
YAML, that is capable of expressing the [data model](https://www.w3.org/TR/did-1.0/#data-model).
The following sections define the general rules for [production](https://www.w3.org/TR/did-1.0/#dfn-production) and
[consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption), as well as the JSON and JSON-LD [representations](https://www.w3.org/TR/did-1.0/#dfn-representations).


### 6.1 Production and Consumption

[Permalink for Section 6.1](https://www.w3.org/TR/did-1.0/#production-and-consumption)

In addition to the [representations](https://www.w3.org/TR/did-1.0/#dfn-representations) defined in this specification,
implementers can use other [representations](https://www.w3.org/TR/did-1.0/#dfn-representations), providing each such
[representation](https://www.w3.org/TR/did-1.0/#dfn-representations) is properly specified (including rules for
interoperable handling of properties not listed in the DID Specification
Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\]). See [4.1 Extensibility](https://www.w3.org/TR/did-1.0/#extensibility)
for more information.


The requirements for all [representations](https://www.w3.org/TR/did-1.0/#dfn-representations) are as follows:


1. A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _MUST_ define deterministic production and consumption
   rules for all data types specified in [4\. Data Model](https://www.w3.org/TR/did-1.0/#data-model).

2. A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _MUST_ be uniquely associated with an IANA-registered
   Media Type.

3. A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _MUST_ define fragment processing rules for its Media
   Type that are conformant with the fragment processing rules defined in
   [Fragment](https://www.w3.org/TR/did-1.0/#fragment).

4. A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _SHOULD_ use the lexical representation of [data model](https://www.w3.org/TR/did-1.0/#data-model) data types. For example, JSON and JSON-LD use
   the XML Schema `dateTime` lexical serialization to represent
   [datetimes](https://www.w3.org/TR/did-1.0/#dfn-datetime). A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _MAY_ choose to serialize the [data model](https://www.w3.org/TR/did-1.0/#data-model) data types using a different lexical
   serializations as long as the [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) process back into the [data model](https://www.w3.org/TR/did-1.0/#data-model) is lossless. For example, some CBOR-based
   [representations](https://www.w3.org/TR/did-1.0/#dfn-representations) express [datetime](https://www.w3.org/TR/did-1.0/#dfn-datetime) values using integers to
   represent the number of seconds since the Unix epoch.

5. A [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _MAY_ define [representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) that
   are stored in a [representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) [map](https://infra.spec.whatwg.org/#maps)
   for use during the [production](https://www.w3.org/TR/did-1.0/#dfn-production) and [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) process. These
   entries are used when consuming or producing to aid in ensuring lossless
   conversion.

6. In order to maximize interoperability, [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) specification
   authors _SHOULD_ register their [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) in the DID Specification
   Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].


The requirements for all [conforming producers](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) are as follows:


1. A [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) _MUST_ take a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) [data model](https://www.w3.org/TR/did-1.0/#data-model) and a [representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) [map](https://infra.spec.whatwg.org/#maps) as input into the [production](https://www.w3.org/TR/did-1.0/#dfn-production) process.
   The [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) _MAY_ accept additional options as input
   into the [production](https://www.w3.org/TR/did-1.0/#dfn-production) process.

2. A [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) _MUST_ serialize all entries in the [DID\\
   document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) [data model](https://www.w3.org/TR/did-1.0/#data-model), and the
   [representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) [map](https://infra.spec.whatwg.org/#maps),
   that do not
   have explicit processing rules for the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) being produced
   using only the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations)'s data type processing rules and
   return the serialization after the [production](https://www.w3.org/TR/did-1.0/#dfn-production) process completes.

3. A [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) _MUST_ return the Media Type [string](https://infra.spec.whatwg.org/#string) associated with the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations)
   after the [production](https://www.w3.org/TR/did-1.0/#dfn-production) process completes.

4. A conforming producer _MUST NOT_ produce non-conforming [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) or [DID\\
   documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


The requirements for all [conforming consumers](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) are as follows:


1. A [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) _MUST_ take a [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) and
   Media Type [string](https://infra.spec.whatwg.org/#string) as input into
   the [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) process. A [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) _MAY_ accept
   additional options as input into the [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) process.

2. A [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) _MUST_ determine the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) of a
   [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) using the Media Type input [string](https://infra.spec.whatwg.org/#string).

3. A [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) _MUST_ detect any [representation-specific\\
   entry](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) across all known [representations](https://www.w3.org/TR/did-1.0/#dfn-representations) and place the entry into a
   [representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) [map](https://infra.spec.whatwg.org/#maps)
   which is returned after the [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) process completes. A list of
   all known [representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) is available in the
   DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].

4. A [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) _MUST_ add all [non-representation-specific\\
   entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry)
   that do not have explicit processing rules for the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) being
   consumed to the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) [data model](https://www.w3.org/TR/did-1.0/#data-model) using
   only the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations)'s data type processing rules and return the
   [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) data model after the [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) process completes.

5. A conforming consumer _MUST_ produce errors when consuming non-conforming
   [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) or [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


![ Diagram illustrating how representations of the data model are produced and consumed, including in JSON and JSON-LD.](https://www.w3.org/TR/did-1.0/diagrams/diagram-production-consumption.svg)Figure 4
Production and consumption of representations.
See also: [narrative description](https://www.w3.org/TR/did-1.0/#production-consumption-longdesc).


The upper left quadrant of the diagram contains a rectangle with dashed grey
outline, containing two blue-outlined rectangles, one above the other.
The upper, larger rectangle is labeled, in blue, "Core Properties",
and contains the following [INFRA](https://infra.spec.whatwg.org/#maps) notation:


```hljs javascript
«[\
  "id" → "example:123",\
  "verificationMethod" → « «[\
    "id": "did:example:123#keys-1",\
    "controller": "did:example:123",\
    "type": "Ed25519VerificationKey2018",\
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVA"\
  ]» »,\
  "authentication" → «\
    "did:example:123#keys-1"\
  »\
]»
```

The lower, smaller rectangle is labeled, in blue, "Core Representation-specific
Entries (JSON-LD)", and contains the following monospaced [INFRA](https://infra.spec.whatwg.org/#maps) notation:


```hljs css
«[ "@context" → "https://www.w3.org/ns/did/v1" ]»
```

From the grey-outlined rectangle, three pairs of arrows extend to three
different black-outlined rectangles, one on the upper right of the diagram, one
in the lower right, and one in the lower left. Each pair of arrows consists of
one blue arrow pointing from the grey-outlined rectangle to the respective
black-outlined rectangle, labeled "produce", and one red arrow pointing in the
reverse direction, labeled "consume". The black-outlined rectangle in the upper
right is labeled "application/did+cbor", and contains hexadecimal data. The
rectangle in the lower right is labeled "application/did+json", and contains
the following JSON data:


```hljs json
{
  "id": "did:example:123",
  "verificationMethod": [{\
    "id": "did:example:123#keys-1",\
    "controller": "did:example:123",\
    "type": "Ed25519VerificationKey2018",\
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVA"\
  }],
  "authentication": [\
    "did:example:123#keys-1"\
  ]
}
```

The rectangle in the lower left is labeled "application/did+ld+json", and
contains the following JSON-LD data:


```hljs json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:example:123",
  "verificationMethod": [{\
    "id": "did:example:123#keys-1",\
    "controller": "did:example:123",\
    "type": "Ed25519VerificationKey2018",\
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVA"\
  }],
  "authentication": [\
    "did:example:123#keys-1"\
  ]
}
```

Note: Conversion between representations

An implementation is expected to convert between [representations](https://www.w3.org/TR/did-1.0/#dfn-representations) by using
the _consumption_ rules on the source representation resulting in the [data model](https://www.w3.org/TR/did-1.0/#data-model) and then using the _production_ rules
to serialize [data model](https://www.w3.org/TR/did-1.0/#data-model) to the target representation,
or any other mechanism that results in the same target representation.


### 6.2 JSON

[Permalink for Section 6.2](https://www.w3.org/TR/did-1.0/#json)

This section defines the [production](https://www.w3.org/TR/did-1.0/#dfn-production) and [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) rules
for the JSON [representation](https://www.w3.org/TR/did-1.0/#dfn-representations).


#### 6.2.1 Production

[Permalink for Section 6.2.1](https://www.w3.org/TR/did-1.0/#production)

The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), DID document data structures, and
[representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) [map](https://infra.spec.whatwg.org/#maps) _MUST_
be serialized to the JSON [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) according to the following
[production](https://www.w3.org/TR/did-1.0/#dfn-production) rules:


| Data Type | JSON Representation Type |
| --- | --- |
| [map](https://infra.spec.whatwg.org/#maps) | A [JSON Object](https://www.rfc-editor.org/rfc/rfc8259#section-4), where each entry is<br>serialized as a member of the JSON Object with the entry key as a [JSON String](https://www.rfc-editor.org/rfc/rfc8259#section-7) member name and the entry value<br>according to its type, as defined in this table. |
| [list](https://infra.spec.whatwg.org/#list) | A [JSON Array](https://www.rfc-editor.org/rfc/rfc8259#section-5), where each element of the<br>list is serialized, in order, as a value of the array according to its type, as<br>defined in this table. |
| [set](https://infra.spec.whatwg.org/#ordered-set) | A [JSON Array](https://www.rfc-editor.org/rfc/rfc8259#section-5), where each element of the set<br>is added, in order, as a value of the array according to its type, as defined in<br>this table. |
| [datetime](https://www.w3.org/TR/did-1.0/#dfn-datetime) | A [JSON String](https://www.rfc-editor.org/rfc/rfc8259#section-7) serialized as an<br>[XML Datetime](https://www.w3.org/TR/xmlschema11-2/#dateTime) normalized to<br>UTC 00:00:00 and without sub-second decimal precision. For example:<br>`2020-12-20T19:17:47Z`. |
| [string](https://infra.spec.whatwg.org/#string) | A [JSON String](https://www.rfc-editor.org/rfc/rfc8259#section-7). |
| [integer](https://www.w3.org/TR/did-1.0/#dfn-integer) | A [JSON Number](https://www.rfc-editor.org/rfc/rfc8259#section-6) without a decimal or<br>fractional component. |
| [double](https://www.w3.org/TR/did-1.0/#dfn-double) | A [JSON Number](https://www.rfc-editor.org/rfc/rfc8259#section-6) with a decimal and<br>fractional component. |
| [boolean](https://infra.spec.whatwg.org/#boolean) | A [JSON Boolean](https://www.rfc-editor.org/rfc/rfc8259#section-3). |
| [null](https://infra.spec.whatwg.org/#nulls) | A [JSON null literal](https://www.rfc-editor.org/rfc/rfc8259#section-3). |

All implementers creating [conforming producers](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) that produce JSON
[representations](https://www.w3.org/TR/did-1.0/#dfn-representations) are advised to ensure that their algorithms are aligned
with the [JSON\\
serialization rules](https://infra.spec.whatwg.org/#serialize-an-infra-value-to-json-bytes) in the \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\] specification and the [precision advisements regarding Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6) in the
JSON \[[RFC8259](https://www.w3.org/TR/did-1.0/#bib-rfc8259 "The JavaScript Object Notation (JSON) Data Interchange Format")\] specification.


All entries of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) _MUST_ be included in the root [JSON Object](https://www.rfc-editor.org/rfc/rfc8259#section-4). Entries _MAY_ contain additional
data substructures subject to the value representation rules in the list above.
When serializing a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), a [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) _MUST_
specify a media type of `application/did+json` to downstream
applications such as described in [7.1.2 DID Resolution Metadata](https://www.w3.org/TR/did-1.0/#did-resolution-metadata).


[Example 21](https://www.w3.org/TR/did-1.0/#example-example-did-document-in-json-representation): Example DID document in JSON representation

```
{
  "id": "did:example:123456789abcdefghi",
  "authentication": [{\
    "id": "did:example:123456789abcdefghi#keys-1",\
    "type": "Ed25519VerificationKey2018",\
    "controller": "did:example:123456789abcdefghi",\
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"\
  }]
}
```

#### 6.2.2 Consumption

[Permalink for Section 6.2.2](https://www.w3.org/TR/did-1.0/#consumption)

The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) and DID document data structures JSON
[representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _MUST_ be deserialized into the [data\\
model](https://www.w3.org/TR/did-1.0/#data-model) according to the following [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) rules:


| JSON Representation Type | Data Type |
| --- | --- |
| [JSON Object](https://www.rfc-editor.org/rfc/rfc8259#section-4) | A [map](https://infra.spec.whatwg.org/#maps), where each member of the JSON<br>Object is added as an entry to the map. Each entry key is set as the<br>JSON Object member name. Each entry value is set by converting the JSON Object<br>member value according to the JSON representation type as defined in this table.<br>Since order is not specified by JSON Objects, no insertion order is guaranteed. |
| [JSON Array](https://www.rfc-editor.org/rfc/rfc8259#section-5) where the [data model](https://www.w3.org/TR/did-1.0/#data-model) entry value is a [list](https://infra.spec.whatwg.org/#list) or unknown | A [list](https://infra.spec.whatwg.org/#list), where each value of the JSON Array is<br>added to the list in order, converted based on the JSON representation type of<br>the array value, as defined in this table. |
| [JSON Array](https://www.rfc-editor.org/rfc/rfc8259#section-5) where the [data model](https://www.w3.org/TR/did-1.0/#data-model) entry value is a [set](https://infra.spec.whatwg.org/#ordered-set) | A [set](https://infra.spec.whatwg.org/#ordered-set), where each value of<br>the JSON Array is added to the set in order, converted based on the JSON<br>representation type of the array value, as defined in this table. |
| [JSON String](https://www.rfc-editor.org/rfc/rfc8259#section-7) where [data model](https://www.w3.org/TR/did-1.0/#data-model) entry value is a [datetime](https://www.w3.org/TR/did-1.0/#dfn-datetime) | A [datetime](https://www.w3.org/TR/did-1.0/#dfn-datetime). |
| [JSON String](https://www.rfc-editor.org/rfc/rfc8259#section-7), where the [data model](https://www.w3.org/TR/did-1.0/#data-model) entry value type is [string](https://infra.spec.whatwg.org/#string) or<br>unknown | A [string](https://infra.spec.whatwg.org/#string). |
| [JSON Number](https://www.rfc-editor.org/rfc/rfc8259#section-6) without a decimal or<br>fractional component | An [integer](https://www.w3.org/TR/did-1.0/#dfn-integer). |
| [JSON Number](https://www.rfc-editor.org/rfc/rfc8259#section-6) with a decimal and fractional<br>component, or when entry value is a [double](https://www.w3.org/TR/did-1.0/#dfn-double) regardless of inclusion of<br>fractional component | A [double](https://www.w3.org/TR/did-1.0/#dfn-double). |
| [JSON Boolean](https://www.rfc-editor.org/rfc/rfc8259#section-3) | A [boolean](https://infra.spec.whatwg.org/#boolean). |
| [JSON null literal](https://www.rfc-editor.org/rfc/rfc8259#section-3) | A [null](https://infra.spec.whatwg.org/#nulls) value. |

All implementers creating [conforming consumers](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) that produce JSON
[representations](https://www.w3.org/TR/did-1.0/#dfn-representations) are advised to ensure that their algorithms are aligned
with the [JSON\\
conversion rules](https://infra.spec.whatwg.org/#parse-json-bytes-to-an-infra-value) in the \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\] specification and the [precision advisements regarding Numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6) in the
JSON \[[RFC8259](https://www.w3.org/TR/did-1.0/#bib-rfc8259 "The JavaScript Object Notation (JSON) Data Interchange Format")\] specification.


If media type information is available to a [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) and the
media type value is `application/did+json`, then the data structure
being consumed is a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), and the root element _MUST_ be a [JSON Object](https://www.rfc-editor.org/rfc/rfc8259#section-4) where all members of the object
are entries of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). A [conforming consumer](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) for a JSON
[representation](https://www.w3.org/TR/did-1.0/#dfn-representations) that is consuming a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) with a root
element that is not a [JSON Object](https://www.rfc-editor.org/rfc/rfc8259#section-4) _MUST_
report an error.


### 6.3 JSON-LD

[Permalink for Section 6.3](https://www.w3.org/TR/did-1.0/#json-ld)

JSON-LD \[[JSON-LD11](https://www.w3.org/TR/did-1.0/#bib-json-ld11 "JSON-LD 1.1")\] is a JSON-based format used to serialize [Linked Data](https://www.w3.org/TR/ld-glossary/#linked-data). This
section defines the [production](https://www.w3.org/TR/did-1.0/#dfn-production) and [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) rules for the
JSON-LD [representation](https://www.w3.org/TR/did-1.0/#dfn-representations).


The JSON-LD [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) defines the following
[representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry):


@context
The [JSON-LD Context](https://www.w3.org/TR/json-ld11/#the-context)
is either a [string](https://infra.spec.whatwg.org/#string) or a [list](https://infra.spec.whatwg.org/#list) containing any combination of [strings](https://infra.spec.whatwg.org/#string) and/or [ordered\\
maps](https://infra.spec.whatwg.org/#maps).


#### 6.3.1 Production

[Permalink for Section 6.3.1](https://www.w3.org/TR/did-1.0/#production-0)

The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), DID document data structures, and
[representation-specific entries](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) [map](https://infra.spec.whatwg.org/#maps) _MUST_
be serialized to the JSON-LD [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) according to the JSON
[representation](https://www.w3.org/TR/did-1.0/#dfn-representations) [production](https://www.w3.org/TR/did-1.0/#dfn-production) rules as defined in [6.2 JSON](https://www.w3.org/TR/did-1.0/#json).


In addition to using the JSON [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) [production](https://www.w3.org/TR/did-1.0/#dfn-production) rules,
JSON-LD production _MUST_ include the
[representation-specific](https://www.w3.org/TR/did-1.0/#dfn-representation-specific-entry) [`@context`](https://www.w3.org/TR/did-1.0/#dfn-context) entry. The serialized value of
`@context` _MUST_ be the [JSON\\
String](https://www.rfc-editor.org/rfc/rfc8259#section-7) `https://www.w3.org/ns/did/v1`, or a [JSON Array](https://www.rfc-editor.org/rfc/rfc8259#section-5) where the first item is the [JSON String](https://www.rfc-editor.org/rfc/rfc8259#section-7) `https://www.w3.org/ns/did/v1` and the subsequent items are
serialized according to the JSON [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) [production](https://www.w3.org/TR/did-1.0/#dfn-production)
rules.


[Example 22](https://www.w3.org/TR/did-1.0/#example-a-valid-serialization-of-a-simple-context-entry): A valid serialization of a simple @context entry

```hljs javascript
{
  "@context": "https://www.w3.org/ns/did/v1",
  ...
}
```

[Example 23](https://www.w3.org/TR/did-1.0/#example-a-valid-serialization-of-a-layered-context-entry): A valid serialization of a layered @context entry

```hljs javascript
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://did-method-extension.example/v1"\
  ],
  ...
}
```

All implementers creating [conforming producers](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) that produce JSON-LD
[representations](https://www.w3.org/TR/did-1.0/#dfn-representations) are advised to ensure that their algorithms
produce valid JSON-LD \[[JSON-LD11](https://www.w3.org/TR/did-1.0/#bib-json-ld11 "JSON-LD 1.1")\] documents. Invalid JSON-LD documents will
cause JSON-LD processors to halt and report errors.


In order to achieve interoperability across different [representations](https://www.w3.org/TR/did-1.0/#dfn-representations),
all JSON-LD Contexts and their terms _SHOULD_ be registered in the DID
Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].


A [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) that generates a JSON-LD [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _SHOULD NOT_ produce a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that contains terms not defined via the
`@context` as [conforming consumers](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) are expected to remove
unknown terms. When serializing a JSON-LD [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) of a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), a [conforming producer](https://www.w3.org/TR/did-1.0/#dfn-conforming-producer) _MUST_ specify a media type of
`application/did+ld+json` to downstream applications such as
described in [7.1.2 DID Resolution Metadata](https://www.w3.org/TR/did-1.0/#did-resolution-metadata).


#### 6.3.2 Consumption

[Permalink for Section 6.3.2](https://www.w3.org/TR/did-1.0/#consumption-0)

The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) and any DID document data structures expressed by a
JSON-LD [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _MUST_ be deserialized into the [data model](https://www.w3.org/TR/did-1.0/#data-model) according to the JSON [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) [consumption](https://www.w3.org/TR/did-1.0/#dfn-consumption) rules as defined in [6.2 JSON](https://www.w3.org/TR/did-1.0/#json).


All implementers creating [conforming consumers](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) that consume JSON-LD
[representations](https://www.w3.org/TR/did-1.0/#dfn-representations) are advised to ensure that their algorithms only accept
valid JSON-LD \[[JSON-LD11](https://www.w3.org/TR/did-1.0/#bib-json-ld11 "JSON-LD 1.1")\] documents. Invalid JSON-LD documents will cause
JSON-LD processors to halt and report errors.


[Conforming consumers](https://www.w3.org/TR/did-1.0/#dfn-conforming-consumer) that process a JSON-LD [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) _SHOULD_
drop all terms from a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that are not defined via the
`@context`.


## 7\. Resolution

[Permalink for Section 7.](https://www.w3.org/TR/did-1.0/#resolution)

This section defines the inputs and outputs of [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) and [DID\\
URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing). Their exact implementation is out of scope for this
specification, but some considerations for implementers are discussed in
\[[DID-RESOLUTION](https://www.w3.org/TR/did-1.0/#bib-did-resolution "Decentralized Identifier Resolution")\].


All conformant [DID resolvers](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) _MUST_ implement the [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution)
functions for at least one [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and _MUST_ be able to return a
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) in at least one conformant [representation](https://www.w3.org/TR/did-1.0/#dfn-representations).


### 7.1 DID Resolution

[Permalink for Section 7.1](https://www.w3.org/TR/did-1.0/#did-resolution)

The [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) functions resolve a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) into a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) by using the "Read" operation of the applicable [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
as described in [8.2 Method Operations](https://www.w3.org/TR/did-1.0/#method-operations). The details of how this
process is accomplished are outside the scope of this specification, but all
conforming [DID resolvers](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implement the functions below, which have the
following abstract forms:


```hljs
resolve(did, resolutionOptions) →
   « didResolutionMetadata, didDocument, didDocumentMetadata »

resolveRepresentation(did, resolutionOptions) →
   « didResolutionMetadata, didDocumentStream, didDocumentMetadata »
```

The `resolve` function returns the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) in its
abstract form (a [map](https://infra.spec.whatwg.org/#maps)). The
`resolveRepresentation` function returns a byte stream of the [DID\\
Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) formatted in the corresponding representation.


![ Diagram illustrating how resolve() returns the DID document data model in its abstract form and resolveRepresenation() returns it in one of the conformant representations; conversion is possible using production and consumption rules.](https://www.w3.org/TR/did-1.0/diagrams/diagram-resolve-resolverepresentation.svg)Figure 5
Functions resolve() and resolveRepresentation().
See also: [narrative description](https://www.w3.org/TR/did-1.0/#resolve-resolverepresentation-longdesc).


The upper middle part of the diagram contains a rectangle with dashed grey outline, containing two
blue-outlined rectangles, one above the other.
The upper, larger rectangle is labeled, in blue, "Core Properties", and contains the following
[INFRA](https://infra.spec.whatwg.org/#maps) notation:


```hljs javascript
«[\
  "id" → "example:123",\
  "verificationMethod" → « «[\
    "id": "did:example:123#keys-1",\
    "controller": "did:example:123",\
    "type": "Ed25519VerificationKey2018",\
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVA"\
  ]» »,\
  "authentication" → «\
    "did:example:123#keys-1"\
  »\
]»
```

The lower, smaller rectangle is labeled, in blue, "Core Representation-specific Entries (JSON-LD)", and
contains the following monospaced [INFRA](https://infra.spec.whatwg.org/#maps) notation:


```hljs css
«[ "@context" → "https://www.w3.org/ns/did/v1" ]»
```

From the grey-outlined rectangle, three pairs of arrows extend to three
different black-outlined rectangles, aligned in a horizontal row side-by-side, in the bottom half
of the diagram. Each pair of arrows consists of
one blue arrow pointing from the grey-outlined rectangle to the respective
black-outlined rectangle, labeled "produce", and one red arrow pointing in the
reverse direction, labeled "consume". The first black-outlined rectangle in the row
is labeled "application/did+ld+json", and contains
the following JSON-LD data:


```hljs json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:example:123",
  "verificationMethod": [{\
    "id": "did:example:123#keys-1",\
    "controller": "did:example:123",\
    "type": "Ed25519VerificationKey2018",\
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVA"\
  }],
  "authentication": [\
    "did:example:123#keys-1"\
  ]
}
```

The second rectangle in the row is labeled "application/did+json" and contains the following
JSON data:


```hljs json
{
  "id": "did:example:123",
  "verificationMethod": [{\
    "id": "did:example:123#keys-1",\
    "controller": "did:example:123",\
    "type": "Ed25519VerificationKey2018",\
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVA"\
  }],
  "authentication": [\
    "did:example:123#keys-1"\
  ]
}
```

The third rectangle in the row is labeled "application/did+cbor", and contains hexadecimal data.


In the left part of the diagram, in the middle, there is a box, with black outline and light gray
background. This box is labeled "VERIFIABLE DATA REGISTRY" and contains a symbol representing a graph
with nodes and arcs. From this box, one arrow, labeled "resolve()", extends upwards and points to the
top half of the diagram where the grey-outlined rectangle is located. Another arrow, labeled
"resolveRepresentation()", extends downwards and points to the bottom half of the diagram, where the
row of three black-outlined rectangles is located.


The input variables
of the `resolve` and `resolveRepresentation` functions are
as follows:


did

This is the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to resolve. This input is _REQUIRED_ and the value _MUST_
be a conformant [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) as defined in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax).

resolutionOptions

A [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure) containing properties
defined in [7.1.1 DID Resolution Options](https://www.w3.org/TR/did-1.0/#did-resolution-options). This input is
_REQUIRED_, but the structure _MAY_ be empty.


These functions each return multiple values, and no limitations
are placed on how these values are returned together.
The return values of `resolve` are
[didResolutionMetadata](https://www.w3.org/TR/did-1.0/#dfn-didresolutionmetadata), [didDocument](https://www.w3.org/TR/did-1.0/#dfn-diddocument), and
[didDocumentMetadata](https://www.w3.org/TR/did-1.0/#dfn-diddocumentmetadata). The return values of
`resolveRepresentation` are
[didResolutionMetadata](https://www.w3.org/TR/did-1.0/#dfn-didresolutionmetadata), [didDocumentStream](https://www.w3.org/TR/did-1.0/#dfn-diddocumentstream), and
[didDocumentMetadata](https://www.w3.org/TR/did-1.0/#dfn-diddocumentmetadata). These values are described below:


didResolutionMetadata
A [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure) consisting of values
relating to the results of the [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) process which typically
changes between invocations of the `resolve` and
`resolveRepresentation` functions, as it represents data about the
resolution process itself. This structure is _REQUIRED_, and in the case of an
error in the resolution process, this _MUST NOT_ be empty. This metadata is
defined by [7.1.2 DID Resolution Metadata](https://www.w3.org/TR/did-1.0/#did-resolution-metadata). If
`resolveRepresentation` was called, this structure _MUST_ contain a
`contentType` property containing the Media Type of the
representation found in the `didDocumentStream`. If the resolution is
not successful, this structure _MUST_ contain an `error` property
describing the error.
 didDocument
If the resolution is successful, and if the `resolve` function was
called, this _MUST_ be a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) abstract data model (a [map](https://infra.spec.whatwg.org/#maps)) as described in [4\. Data Model](https://www.w3.org/TR/did-1.0/#data-model) that
is capable of being transformed into a [conforming DID Document](https://www.w3.org/TR/did-1.0/#dfn-conforming-did-document)
(representation), using the production rules specified by the representation.
The value of `id` in the resolved [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) _MUST_
match the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) that was resolved. If the resolution is unsuccessful, this
value _MUST_ be empty.
 didDocumentStream
If the resolution is successful, and if the `resolveRepresentation`
function was called, this _MUST_ be a byte stream of the resolved [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) in one of the conformant
[representations](https://www.w3.org/TR/did-1.0/#representations). The byte stream might then be
parsed by the caller of the `resolveRepresentation` function into a
[data model](https://www.w3.org/TR/did-1.0/#data-model), which can in turn be validated and
processed. If the resolution is unsuccessful, this value _MUST_ be an empty
stream.
 didDocumentMetadata
If the resolution is successful, this _MUST_ be a [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure). This structure contains
metadata about the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) contained in the `didDocument`
property. This metadata typically does not change between invocations of the
`resolve` and `resolveRepresentation` functions unless the
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) changes, as it represents metadata about the [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). If the resolution is unsuccessful, this output _MUST_ be an empty [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure). Properties defined by this
specification are in [7.1.3 DID Document Metadata](https://www.w3.org/TR/did-1.0/#did-document-metadata).


Conforming [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implementations do not alter the signature of
these functions in any way. [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implementations might map the
`resolve` and `resolveRepresentation` functions to a
method-specific internal function to perform the actual [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution)
process. [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implementations might implement and expose
additional functions with different signatures in addition to the
`resolve` and `resolveRepresentation` functions specified
here.


#### 7.1.1 DID Resolution Options

[Permalink for Section 7.1.1](https://www.w3.org/TR/did-1.0/#did-resolution-options)

The possible properties within this structure and their possible values are
registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\]. This
specification defines the following common properties.


accept

The Media Type of the caller's preferred [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) of the [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). The Media Type _MUST_ be expressed as an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). The [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implementation _SHOULD_ use this
value to determine the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) contained in the returned
`didDocumentStream` if such a [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) is supported and
available. This property is _OPTIONAL_ for the `resolveRepresentation`
function and _MUST NOT_ be used with the `resolve` function.


#### 7.1.2 DID Resolution Metadata

[Permalink for Section 7.1.2](https://www.w3.org/TR/did-1.0/#did-resolution-metadata)

The possible properties within this structure and their possible values are
registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\]. This
specification defines the following DID resolution metadata properties:


contentType

The Media Type of the returned `didDocumentStream`. This property is
_REQUIRED_ if resolution is successful and if the
`resolveRepresentation` function was called.
This property _MUST NOT_
be present if the `resolve` function was called. The value of this
property _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string) that is the Media
Type of the conformant [representations](https://www.w3.org/TR/did-1.0/#dfn-representations). The
caller of the `resolveRepresentation` function _MUST_ use this value
when determining how to parse and process the `didDocumentStream`
returned by this function into the [data model](https://www.w3.org/TR/did-1.0/#data-model).

error

The error code from the resolution process. This property is _REQUIRED_ when there
is an error in the resolution process. The value of this property _MUST_ be a
single keyword [ASCII string](https://infra.spec.whatwg.org/#ascii-string). The possible property
values of this field _SHOULD_ be registered in the DID Specification Registries
\[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\]. This specification defines the following
common error values:

invalidDid

The [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) supplied to the [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) function does not conform
to valid syntax. (See [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax).)

notFound

The [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) was unable to find the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
resulting from this resolution request.

representationNotSupported

This error code is returned if the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) requested via the
`accept` input metadata property is not supported by the [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and/or [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implementation.


#### 7.1.3 DID Document Metadata

[Permalink for Section 7.1.3](https://www.w3.org/TR/did-1.0/#did-document-metadata)

The possible properties within this structure and their possible values _SHOULD_
be registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].
This specification defines the following common properties.


created[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _SHOULD_ include a `created` property to
indicate the timestamp of the [Create operation](https://www.w3.org/TR/did-1.0/#method-operations).
The value of the property _MUST_ be a [string](https://infra.spec.whatwg.org/#string)
formatted as an [XML Datetime](https://www.w3.org/TR/xmlschema11-2/#dateTime)
normalized to UTC 00:00:00 and without sub-second decimal precision. For
example: `2020-12-20T19:17:47Z`.
 updated[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _SHOULD_ include an `updated` property to
indicate the timestamp of the last [Update\\
operation](https://www.w3.org/TR/did-1.0/#method-operations) for the document version which was resolved. The value of the
property _MUST_ follow the same formatting rules as the `created`
property. The `updated` property is omitted if an Update operation
has never been performed on the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). If an `updated`
property exists, it can be the same value as the `created` property
when the difference between the two timestamps is less than one second.
 deactivated
If a DID has been [deactivated](https://www.w3.org/TR/did-1.0/#method-operations),
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _MUST_ include this property with the boolean value
`true`. If a DID has not been deactivated, this property is _OPTIONAL_,
but if included, _MUST_ have the boolean value `false`.
 nextUpdate[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _MAY_ include a `nextUpdate` property if
the resolved document version is not the latest version of the document. It
indicates the timestamp of the next [Update\\
operation](https://www.w3.org/TR/did-1.0/#method-operations). The value of the property _MUST_ follow the same formatting rules
as the `created` property.
 versionId[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _SHOULD_ include a `versionId` property to
indicate the version of the last [Update\\
operation](https://www.w3.org/TR/did-1.0/#method-operations) for the document version which was resolved. The value of the
property _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string).
 nextVersionId[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _MAY_ include a `nextVersionId` property
if the resolved document version is not the latest version of the document. It
indicates the version of the next [Update\\
operation](https://www.w3.org/TR/did-1.0/#method-operations). The value of the property _MUST_ be an [ASCII string](https://infra.spec.whatwg.org/#ascii-string).
 equivalentId

A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) can define different forms of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) that are
logically equivalent. An example is when a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) takes one form prior to
registration in a [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry) and another form after such
registration. In this case, the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification might need to
express one or more [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) that are logically equivalent to the resolved
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) as a property of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). This is the purpose of the
`equivalentId` property.


[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _MAY_ include an `equivalentId` property.
If present, the value _MUST_ be a [set](https://infra.spec.whatwg.org/#ordered-set) where each item is a
[string](https://infra.spec.whatwg.org/#string) that conforms to the rules in Section [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). The relationship is a statement that each
`equivalentId` value is logically equivalent to the
`id` property value and thus refers to the same [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).
Each `equivalentId` DID value _MUST_ be produced by, and a form
of, the same [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) as the `id` property value. (e.g.,
`did:example:abc` == `did:example:ABC`)


A conforming [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ guarantee that each
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
the governing [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). `equivalentId` represents a
full graph merge because the same [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) describes both the
`equivalentId` [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and the `id` property
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).


If a requesting party does not retain the values from the `id` and
`equivalentId` properties and ensure any subsequent
interactions with any of the values they contain are correctly handled as
logically equivalent, there might be negative or unexpected issues that
arise. Implementers are strongly advised to observe the
directives related to this metadata property.


canonicalId

The `canonicalId` property is identical to the
`equivalentId` property except: a) it is associated with a
single value rather than a set, and b) the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is defined to be
the canonical ID for the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) within the scope of the containing
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata _MAY_ include a `canonicalId` property.
If present, the value _MUST_ be a [string](https://infra.spec.whatwg.org/#string) that conforms to the rules in Section [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax). The relationship is a statement that the
`canonicalId` value is logically equivalent to the
`id` property value and that the `canonicalId`
value is defined by the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) to be the canonical ID for the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) in the scope of the containing [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). A
`canonicalId` value _MUST_ be produced by, and a form of, the
same [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) as the `id` property value. (e.g.,
`did:example:abc` == `did:example:ABC`).


A conforming [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ guarantee that the
`canonicalId` value is logically equivalent to the
`id` property value.


A requesting party is expected to use the `canonicalId` value
as its primary ID value for the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and treat all other
equivalent values as secondary aliases (e.g., update corresponding primary
references in their systems to reflect the new canonical ID directive).


Note: Canonical equivalence

`canonicalId` is the same statement of equivalence as
`equivalentId` except it is constrained to a single value that
is defined to be canonical for the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) in the scope of the [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). Like `equivalentId`,
`canonicalId` represents a full graph merge because the same
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) describes both the `canonicalId` DID and
the `id` property [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).


If a resolving party does not use the `canonicalId` value as
its primary ID value for the DID subject and treat all other equivalent values
as secondary aliases, there might be negative or unexpected issues that arise
related to user experience. Implementers are strongly advised to observe the
directives related to this metadata property.


### 7.2 DID URL Dereferencing

[Permalink for Section 7.2](https://www.w3.org/TR/did-1.0/#did-url-dereferencing)

The [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) function dereferences a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) into a
[resource](https://www.w3.org/TR/did-1.0/#dfn-resources) with contents depending on the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls)'s components,
including the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods), method-specific identifier, path, query, and
fragment. This process depends on [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) of the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
contained in the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls). [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) might involve
multiple steps (e.g., when the DID URL being dereferenced includes a fragment),
and the function is defined to return the final resource after all steps are
completed. The details of how this process is accomplished are outside the scope
of this specification. The following figure depicts the relationship described
above.


![ DIDs resolve to DID documents; DID URLs contains a DID; DID URLs dereferenced to DID document fragments or external resources.         ](https://www.w3.org/TR/did-1.0/diagrams/did_url_dereference_overview.svg)Figure 6
Overview of DID URL dereference
See also: [narrative description](https://www.w3.org/TR/did-1.0/#did-url-dereference-overview-longdesc).


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


All conforming [DID resolvers](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implement
the following function which has the following abstract form:


```hljs
dereference(didUrl, dereferenceOptions) →
   « dereferencingMetadata, contentStream, contentMetadata »
```

The input variables of the `dereference` function are as follows:


didUrl

A conformant [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) as a single [string](https://infra.spec.whatwg.org/#string).
This is the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) to dereference. To dereference a [DID fragment](https://www.w3.org/TR/did-1.0/#dfn-did-fragments),
the complete [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) including the [DID fragment](https://www.w3.org/TR/did-1.0/#dfn-did-fragments) _MUST_ be used. This
input is _REQUIRED_.



Note: DID URL dereferencer patterns

While it is valid for any `didUrl` to be passed to a DID URL
dereferencer, implementers are expected to refer to \[[DID-RESOLUTION](https://www.w3.org/TR/did-1.0/#bib-did-resolution "Decentralized Identifier Resolution")\] to
further understand common patterns for how a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) is expected
to be dereferenced.


dereferencingOptions

A [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure) consisting of input
options to the `dereference` function in addition to the
`didUrl` itself. Properties defined by this specification are in [7.2.1 DID URL Dereferencing Options](https://www.w3.org/TR/did-1.0/#did-url-dereferencing-options). This input is _REQUIRED_, but the
structure _MAY_ be empty.


This function returns multiple values, and no limitations
are placed on how these values are returned together.
The return values of the `dereference` include
`dereferencingMetadata`, `contentStream`,
and `contentMetadata`:


dereferencingMetadata

A [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure) consisting of values
relating to the results of the [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) process. This
structure is _REQUIRED_, and in the case of an error in the dereferencing process,
this _MUST NOT_ be empty. Properties defined by this specification are in [7.2.2 DID URL Dereferencing Metadata](https://www.w3.org/TR/did-1.0/#did-url-dereferencing-metadata). If the dereferencing is not
successful, this structure _MUST_ contain an `error` property
describing the error.

contentStream

If the `dereferencing` function was called and successful, this _MUST_
contain a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) corresponding to the [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls). The
`contentStream` _MAY_ be a [resource](https://www.w3.org/TR/did-1.0/#dfn-resources) such as a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that is serializable in one of the conformant
[representations](https://www.w3.org/TR/did-1.0/#dfn-representations), a [Verification\\
Method](https://www.w3.org/TR/did-1.0/#verification-methods), a [service](https://www.w3.org/TR/did-1.0/#services), or any other resource format that
can be identified via a Media Type and obtained through the resolution process.
If the dereferencing is unsuccessful, this value _MUST_ be empty.

contentMetadata

If the dereferencing is successful, this _MUST_ be a [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure), but the structure _MAY_ be empty. This structure contains
metadata about the `contentStream`. If the `contentStream`
is a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), this _MUST_ be a [didDocumentMetadata](https://www.w3.org/TR/did-1.0/#dfn-diddocumentmetadata) structure as
described in [DID Resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution). If the dereferencing is unsuccessful, this
output _MUST_ be an empty [metadata structure](https://www.w3.org/TR/did-1.0/#metadata-structure).


Conforming [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) implementations do not alter the
signature of these functions in any way. [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing)
implementations might map the `dereference` function to a
method-specific internal function to perform the actual [DID URL\\
dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) process. [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) implementations might
implement and expose additional functions with different signatures in addition
to the `dereference` function specified here.


#### 7.2.1 DID URL Dereferencing Options

[Permalink for Section 7.2.1](https://www.w3.org/TR/did-1.0/#did-url-dereferencing-options)

The possible properties within this structure and their possible values _SHOULD_
be registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].
This specification defines the following common properties for
dereferencing options:


accept

The Media Type that the caller prefers for `contentStream`. The Media
Type _MUST_ be expressed as an [ASCII string](https://infra.spec.whatwg.org/#ascii-string). The
[DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) implementation _SHOULD_ use this value to determine
the `contentType` of the [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) contained in the
returned value if such a [representation](https://www.w3.org/TR/did-1.0/#dfn-representations) is supported and available.


#### 7.2.2 DID URL Dereferencing Metadata

[Permalink for Section 7.2.2](https://www.w3.org/TR/did-1.0/#did-url-dereferencing-metadata)

The possible properties within this structure and their possible values are
registered in the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\]. This
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
the DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\]. This specification
defines the following common error values:

invalidDidUrl

The [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) supplied to the [DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing) function does
not conform to valid syntax. (See [3.2 DID URL Syntax](https://www.w3.org/TR/did-1.0/#did-url-syntax).)

notFound

The [DID URL dereferencer](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencers) was unable to find the
`contentStream` resulting from this dereferencing request.


### 7.3 Metadata Structure

[Permalink for Section 7.3](https://www.w3.org/TR/did-1.0/#metadata-structure)

Input and output metadata is often involved during the [DID Resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution),
[DID URL dereferencing](https://www.w3.org/TR/did-1.0/#dfn-did-url-dereferencing), and other DID-related processes. The structure
used to communicate this metadata _MUST_ be a [map](https://infra.spec.whatwg.org/#maps)
of properties. Each property name _MUST_ be a [string](https://infra.spec.whatwg.org/#string). Each property value _MUST_ be a [string](https://infra.spec.whatwg.org/#string), [map](https://infra.spec.whatwg.org/#maps), [list](https://infra.spec.whatwg.org/#list), [set](https://infra.spec.whatwg.org/#ordered-set),
[boolean](https://infra.spec.whatwg.org/#boolean), or
[null](https://infra.spec.whatwg.org/#nulls). The values within any complex data
structures such as maps and lists _MUST_ be one of these data types as well.
All metadata property definitions registered in the DID Specification
Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\] _MUST_ define the value type, including any
additional formats or restrictions to that value (for example, a string
formatted as a date or as a decimal integer). It is _RECOMMENDED_ that property
definitions use strings for values. The entire metadata structure _MUST_ be
serializable according to the [JSON\\
serialization rules](https://infra.spec.whatwg.org/#serialize-an-infra-value-to-json-bytes) in the \[[INFRA](https://www.w3.org/TR/did-1.0/#bib-infra "Infra Standard")\] specification. Implementations _MAY_
serialize the metadata structure to other data formats.


All implementations of functions that use metadata structures as either input or
output are able to fully represent all data types described here in a
deterministic fashion. As inputs and outputs using metadata structures are
defined in terms of data types and not their serialization, the method for
[representation](https://www.w3.org/TR/did-1.0/#dfn-representations) is internal to the implementation of the function and is
out of scope of this specification.


The following example demonstrates a JSON-encoded metadata structure that
might be used as [DID\\
resolution input metadata](https://www.w3.org/TR/did-1.0/#did-resolution-options).


[Example 24](https://www.w3.org/TR/did-1.0/#example-json-encoded-did-resolution-input-metadata-example): JSON-encoded DID resolution input metadata example

```hljs json
{
  "accept": "application/did+ld+json"
}
```

This example corresponds to a metadata structure of the following format:


[Example 25](https://www.w3.org/TR/did-1.0/#example-did-resolution-input-metadata-example): DID resolution input metadata example

```hljs abnf
«[\
  "accept" → "application/did+ld+json"\
]»
```

The next example demonstrates a JSON-encoded metadata structure that might be
used as [DID resolution\\
metadata](https://www.w3.org/TR/did-1.0/#did-resolution-options) if a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) was not found.


[Example 26](https://www.w3.org/TR/did-1.0/#example-json-encoded-did-resolution-metadata-example): JSON-encoded DID resolution metadata example

```hljs json
{
  "error": "notFound"
}
```

This example corresponds to a metadata structure of the following format:


[Example 27](https://www.w3.org/TR/did-1.0/#example-did-resolution-metadata-example): DID resolution metadata example

```hljs abnf
«[\
  "error" → "notFound"\
]»
```

The next example demonstrates a JSON-encoded metadata structure that might be
used as [DID document metadata](https://www.w3.org/TR/did-1.0/#did-document-metadata)
to describe timestamps associated with the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


[Example 28](https://www.w3.org/TR/did-1.0/#example-json-encoded-did-document-metadata-example): JSON-encoded DID document metadata example

```hljs json
{
  "created": "2019-03-23T06:35:22Z",
  "updated": "2023-08-10T13:40:06Z"
}
```

This example corresponds to a metadata structure of the following format:


[Example 29](https://www.w3.org/TR/did-1.0/#example-did-document-metadata-example): DID document metadata example

```hljs javascript
«[\
  "created" → "2019-03-23T06:35:22Z",\
  "updated" → "2023-08-10T13:40:06Z"\
]»
```

## 8\. Methods

[Permalink for Section 8.](https://www.w3.org/TR/did-1.0/#methods)

A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) defines how implementers can realize the features
described by this specification. [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) are often associated with a
particular [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry). New [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) are defined
in their own specifications to enable interoperability between different
implementations of the same [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


Conceptually, the relationship between this specification and a [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification is similar to the relationship between the IETF generic
[URI](https://www.w3.org/TR/did-1.0/#dfn-uri) specification \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\] and a specific [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) scheme
\[[IANA-URI-SCHEMES](https://www.w3.org/TR/did-1.0/#bib-iana-uri-schemes "Uniform Resource Identifier (URI) Schemes")\], such as the `http` scheme \[[RFC7230](https://www.w3.org/TR/did-1.0/#bib-rfc7230 "Hypertext Transfer Protocol (HTTP/1.1): Message Syntax and Routing")\]. In
addition to defining a specific [DID scheme](https://www.w3.org/TR/did-1.0/#dfn-did-schemes), a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
specification also defines the mechanisms for creating, resolving, updating, and
deactivating [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) using a specific type of
[verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry). It also documents all implementation
considerations related to [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) as well as Security and Privacy
Considerations.


This section specifies the requirements for authoring [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
specifications.


### 8.1 Method Syntax

[Permalink for Section 8.1](https://www.w3.org/TR/did-1.0/#method-syntax)

The requirements for all [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications when defining the
method-specific DID Syntax are as follows:


01. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ define exactly one method-specific [DID\\
    scheme](https://www.w3.org/TR/did-1.0/#dfn-did-schemes) that is identified by exactly one method name as specified by the
    `method-name` rule in [3.1 DID Syntax](https://www.w3.org/TR/did-1.0/#did-syntax).

02. The [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ specify how to generate the
    `method-specific-id` component of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).

03. The [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ define sensitivity and normalization of
    the value of the `method-specific-id`.

04. The `method-specific-id` value _MUST_ be unique within a [DID\\
    method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). The `method-specific-id` value itself might be globally
    unique.

05. Any [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) generated by a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) _MUST_ be globally unique.

06. To reduce the chances of `method-name` conflicts, a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
    specification _SHOULD_ be registered in the DID Specification Registries
    \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\].

07. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) _MAY_ define multiple `method-specific-id` formats.

08. The `method-specific-id` format _MAY_ include colons. The use of
    colons _MUST_ comply syntactically with the `method-specific-id` ABNF
    rule.

09. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MAY_ specify ABNF rules for [DID paths](https://www.w3.org/TR/did-1.0/#dfn-did-paths)
    that are more restrictive than the generic rules in [Path](https://www.w3.org/TR/did-1.0/#path).

10. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MAY_ specify ABNF rules for [DID queries](https://www.w3.org/TR/did-1.0/#dfn-did-queries)
    that are more restrictive than the generic rules in this section.

11. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MAY_ specify ABNF rules for [DID\\
    fragments](https://www.w3.org/TR/did-1.0/#dfn-did-fragments) that are more restrictive than the generic rules in this section.


Note: Colons in method-specific-id

The meaning of colons in the `method-specific-id` is entirely
method-specific. Colons might be used by [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) for establishing
hierarchically partitioned namespaces, for identifying specific instances or
parts of the [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry), or for other purposes.
Implementers are advised to avoid assuming any meanings or
behaviors associated with a colon that are generically applicable to all
[DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


### 8.2 Method Operations

[Permalink for Section 8.2](https://www.w3.org/TR/did-1.0/#method-operations)

The requirements for all [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications when defining the
method operations are as follows:


1. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ define how authorization is performed to
   execute all operations, including any necessary cryptographic processes.

2. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ specify how a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers)
   creates a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and its associated [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).

3. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ specify how a [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) uses a
   [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to resolve a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), including how the [DID\\
   resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) can verify the authenticity of the response.

4. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ specify what constitutes an update to a
   [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) and how a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) can update a [DID\\
   document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) _or_ state that updates are not possible.

5. The [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ specify how a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) can
   deactivate a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) _or_ state that deactivation is not possible.


The authority of a party that is performing authorization to carry out the
operations is specific to a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). For example, a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
might —


- make use of the `controller` property.

- use the [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) listed under
  `authentication`.

- use other constructs in the [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) such as the [verification\\
  method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) specified via the `capabilityInvocation` [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship).

- not use the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) for this decision at all, and depend on an
  out-of-band mechanism, instead.


### 8.3 Security Requirements

[Permalink for Section 8.3](https://www.w3.org/TR/did-1.0/#security-requirements)

The requirements for all [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications when authoring the
_Security Considerations_ section are as follows:


01. A [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications _MUST_ follow all guidelines and normative
    language provided in [RFC3552: Writing Security\\
    Considerations Sections](https://www.rfc-editor.org/rfc/rfc3552#section-5) for the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) operations defined in the [DID\\
    method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification.

02. The Security Considerations section _MUST_ document the following forms of attack
    for the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) operations defined in the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification:
    eavesdropping, replay, message insertion, deletion, modification, denial of
    service, [amplification](https://www.w3.org/TR/did-1.0/#dfn-amplification), and man-in-the-middle. Other known
    forms of attack _SHOULD_ also be documented.

03. The Security Considerations section _MUST_ discuss residual risks, such as the
    risks from compromise in a related protocol, incorrect implementation, or cipher
    after threat mitigation was deployed.

04. The Security Considerations section _MUST_ provide integrity protection and update
    authentication for all operations required by Section [8.2 Method Operations](https://www.w3.org/TR/did-1.0/#method-operations).

05. If authentication is involved, particularly user-host authentication, the
    security characteristics of the authentication method _MUST_ be clearly
    documented.

06. The Security Considerations section _MUST_ discuss the policy mechanism by which
    [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are proven to be uniquely assigned.

07. Method-specific endpoint authentication _MUST_ be discussed. Where [DID\\
    methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) make use of [DLTs](https://www.w3.org/TR/did-1.0/#dfn-distributed-ledger-technology) with varying network topology, sometimes
    offered as _light node_ or _[thin client](https://en.bitcoin.it/wiki/Thin_Client_Security)_
    implementations to reduce required computing resources, the security assumptions
    of the topology available to implementations of the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) _MUST_ be
    discussed.

08. If a protocol incorporates cryptographic protection mechanisms, the [DID\\
    method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification _MUST_ clearly indicate which portions of the data are
    protected and by what protections, and it _SHOULD_ give an indication of the
    sorts of attacks to which the cryptographic protection is susceptible. Some
    examples are integrity only, confidentiality, and endpoint authentication.

09. Data which is to be held secret (keying material, random seeds, and so on)
    _SHOULD_ be clearly labeled.

10. [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications _SHOULD_ explain and specify the implementation
    of signatures on [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents), if applicable.

11. Where [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) use peer-to-peer computing resources, such as with all
    known [DLTs](https://www.w3.org/TR/did-1.0/#dfn-distributed-ledger-technology), the expected burdens of those resources _SHOULD_ be discussed
    in relation to denial of service.

12. [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) that introduce new authentication [service](https://www.w3.org/TR/did-1.0/#dfn-service)
    types, as described in [5.4 Services](https://www.w3.org/TR/did-1.0/#services), _SHOULD_ consider the
    security requirements of the supported authentication protocol.


### 8.4 Privacy Requirements

[Permalink for Section 8.4](https://www.w3.org/TR/did-1.0/#privacy-requirements)

The requirements for all [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications when authoring the
_Privacy Considerations_ section are:


1. The [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification's Privacy Considerations section _MUST_
   discuss any subsection of Section 5 of \[[RFC6973](https://www.w3.org/TR/did-1.0/#bib-rfc6973 "Privacy Considerations for Internet Protocols")\] that could apply in a
   method-specific manner. The subsections to consider are: surveillance, stored
   data compromise, unsolicited traffic, misattribution, correlation,
   identification, secondary use, disclosure, and exclusion.


## 9\. Security Considerations

[Permalink for Section 9.](https://www.w3.org/TR/did-1.0/#security-considerations)

_This section is non-normative._

This section contains a variety of security considerations that people using
Decentralized Identifiers are advised to consider before deploying this
technology in a production setting. [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are designed to operate under
the threat model used by many IETF standards and documented
in \[[RFC3552](https://www.w3.org/TR/did-1.0/#bib-rfc3552 "Guidelines for Writing RFC Text on Security Considerations")\]. This section elaborates upon a number of the considerations
in \[[RFC3552](https://www.w3.org/TR/did-1.0/#bib-rfc3552 "Guidelines for Writing RFC Text on Security Considerations")\], as well as other considerations that are unique to [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
architecture.


### 9.1 Choosing DID Resolvers

[Permalink for Section 9.1](https://www.w3.org/TR/did-1.0/#choosing-did-resolvers)

The DID Specification Registries \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\] contains an
informative list of [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) names and their corresponding [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications. Implementers need to bear in mind that there is no
central authority to mandate which [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification is to be used
with any specific [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) name. If there is doubt on whether or not a
specific [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) implements a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) correctly, the DID
Specification Registries can be used to look up the registered specification
and make an informed decision regarding which [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers)
implementation to use.


### 9.2 Proving Control and Binding

[Permalink for Section 9.2](https://www.w3.org/TR/did-1.0/#proving-control-and-binding)

Binding an entity in the digital world or the physical world to a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), to
a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), or to cryptographic material requires, the use of
security protocols contemplated by this specification. The following sections
describe some possible scenarios and how an entity therein might prove control
over a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) or a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) for the purposes of authentication or
authorization.


#### Proving Control of a DID and/or DID Document

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#proving-control-of-a-did-and-or-did-document)

Proving control over a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and/or a [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is useful when
updating either in a [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry) or authenticating with
remote systems. Cryptographic digital signatures and [verifiable\\
timestamps](https://www.w3.org/TR/did-1.0/#dfn-verifiable-timestamp) enable certain security protocols related to [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
to be cryptographically verifiable. For these purposes, this specification
defines useful [verification relationships](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) in [5.3.1 Authentication](https://www.w3.org/TR/did-1.0/#authentication) and [5.3.4 Capability Invocation](https://www.w3.org/TR/did-1.0/#capability-invocation). The
secret cryptographic material associated with the [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method)
can be used to generate a cryptographic digital signature as a part of an
authentication or authorization security protocol.


Note: Signed DID documents

Some [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) allow digital signatures and other proofs to be
included in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) or a [7.3 Metadata Structure](https://www.w3.org/TR/did-1.0/#metadata-structure).
However, such proofs by themselves do not necessarily prove control over a
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), or guarantee that the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is the correct one for
the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). In order to obtain
the correct [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) and verify control over a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), it is
necessary to perform the [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) process as defined by the
[DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


#### Binding to Physical Identity

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#binding-to-physical-identity)

A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) do not inherently carry any
[personal data](https://en.wikipedia.org/wiki/Personal_data) and
it is strongly advised that non-public entities do not publish personal data in
[DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


It can be useful to express a binding of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to a person's or
organization's physical identity in a way that is provably asserted by a
trusted authority, such as a government. This specification provides
the [5.3.2 Assertion](https://www.w3.org/TR/did-1.0/#assertion) [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) for these
purposes. This feature can enable interactions that are private and can be
considered legally enforceable under one or more jurisdictions; establishing
such bindings has to be carefully balanced against privacy considerations (see
[10\. Privacy Considerations](https://www.w3.org/TR/did-1.0/#privacy-considerations)).


The process of binding a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to something in the physical world, such as
a person or an organization — for example, by using [verifiable\\
credentials](https://www.w3.org/TR/did-1.0/#dfn-verifiable-credentials) with the same subject as that [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) — is contemplated
by this specification and further defined in the Verifiable Credentials Data
Model \[[VC-DATA-MODEL](https://www.w3.org/TR/did-1.0/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\].


### 9.3 Authentication Service Endpoints

[Permalink for Section 9.3](https://www.w3.org/TR/did-1.0/#authentication-service-endpoints)

If a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) publishes a [service](https://www.w3.org/TR/did-1.0/#dfn-service) intended for
authentication or authorization of the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) (see Section [5.4 Services](https://www.w3.org/TR/did-1.0/#services)), it is the responsibility of the [service\\
endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) provider, subject, or requesting party to comply with the
requirements of the authentication protocols supported at that [service\\
endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints).


### 9.4 Non-Repudiation

[Permalink for Section 9.4](https://www.w3.org/TR/did-1.0/#non-repudiation)

Non-repudiation of [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) updates is supported if:


- The [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry) supports
  [verifiable timestamps](https://www.w3.org/TR/did-1.0/#dfn-verifiable-timestamp). See [7.1.3 DID Document Metadata](https://www.w3.org/TR/did-1.0/#did-document-metadata)
  for further information on useful timestamps that can be used during the
  [DID resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) process.

- The subject is monitoring for unauthorized updates as elaborated upon in
  [9.5 Notification of DID Document Changes](https://www.w3.org/TR/did-1.0/#notification-of-did-document-changes).

- The subject has had adequate opportunity to revert malicious updates according
  to the authorization mechanism for the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


### 9.5 Notification of DID Document Changes

[Permalink for Section 9.5](https://www.w3.org/TR/did-1.0/#notification-of-did-document-changes)

One mitigation against unauthorized changes to a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is
monitoring and actively notifying the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) when there are changes.
This is analogous to helping prevent account takeover on conventional
username/password accounts by sending password reset notifications to the email
addresses on file.


In the case of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), there is no intermediary registrar or account
provider to generate such notifications. However, if the [verifiable data\\
registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry) on which the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is registered directly supports change
notifications, a subscription service can be offered to [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers).
Notifications could be sent directly to the relevant [service endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints)
listed in an existing [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).


If a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) chooses to rely on a third-party monitoring service
(other than the [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry) itself), this introduces another
vector of attack.


### 9.6 Key and Signature Expiration

[Permalink for Section 9.6](https://www.w3.org/TR/did-1.0/#key-and-signature-expiration)

In a [decentralized identifier](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) architecture, there might not be
centralized authorities to enforce cryptographic material or cryptographic
digital signature expiration policies. Therefore, it is with supporting software
such as [DID resolvers](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) and verification libraries that requesting parties
validate that cryptographic material were not expired at the time they were
used. Requesting parties might employ their own expiration policies in addition
to inputs into their verification processes. For example, some requesting
parties might accept authentications from five minutes in the past, while others
with access to high precision time sources might require authentications to be
time stamped within the last 500 milliseconds.


There are some requesting parties that have legitimate needs to extend the use
of already-expired cryptographic material, such as verifying legacy
cryptographic digital signatures. In these scenarios, a requesting party might
instruct their verification software to ignore cryptographic key material
expiration or determine if the cryptographic key material was expired at the
time it was used.


### 9.7 Verification Method Rotation

[Permalink for Section 9.7](https://www.w3.org/TR/did-1.0/#verification-method-rotation)

Rotation is a management process that enables the secret cryptographic material
associated with an existing [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) to be deactivated or
destroyed once a new [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) has been added to the [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). Going forward, any new proofs that a [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) would have
generated using the old secret cryptographic material can now instead be
generated using the new cryptographic material and can be verified using the
new [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method).


Rotation is a useful mechanism for protecting against verification method
compromise, since frequent rotation of a verification method by the controller
reduces the value of a single compromised verification method to an attacker.
Performing revocation immediately after rotation is useful for verification
methods that a controller designates for short-lived verifications, such as
those involved in encrypting messages and authentication.


The following considerations might be of use when contemplating the use of
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) rotation:


- [Verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) rotation is a proactive security measure.

- It is generally considered a best practice to perform [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method)
  rotation on a regular basis.

- Higher security environments tend to employ more frequent verification method
  rotation.

- [Verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) rotation manifests only as changes to the current or
  latest version of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).

- When a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) has been active for a long time, or used for
  many operations, a controller might wish to perform a rotation.

- Frequent rotation of a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) might be frustrating for
  parties that are forced to continuously renew or refresh associated credentials.

- Proofs or signatures that rely on [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) that are not
  present in the latest version of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are not impacted by
  rotation. In these cases, verification software might require additional
  information, such as when a particular [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) was
  expected to be valid as well as access to a [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry)
  containing a historical record, to determine the validity of the proof or
  signature. This option might not be available in all [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods).

- The section on [DID method operations](https://www.w3.org/TR/did-1.0/#method-operations) specifies
  the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) operations to be supported by a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification,
  including [update](https://www.w3.org/TR/did-1.0/#method-operations) which is expected to be used
  to perform a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) rotation.

- A [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) performs a rotation when they add a new [verification\\
  method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) that is meant to replace an existing [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) after
  some time.

- Not all [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) support [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) rotation.


### 9.8 Verification Method Revocation

[Permalink for Section 9.8](https://www.w3.org/TR/did-1.0/#verification-method-revocation)

Revocation is a management process that enables the secret cryptographic
material associated with an existing [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) to be
deactivated such that it ceases to be a valid form of creating new
proofs of digital signatures.


Revocation is a useful mechanism for reacting to a verification method
compromise. Performing revocation immediately after rotation is useful for
verification methods that a controller designates for short-lived verifications,
such as those involved in encrypting messages and authentication.


Compromise of the secrets associated with a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) allows
the attacker to use them according to the [verification relationship](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship)
expressed by [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), for example, for
authentication. The attacker's use of the secrets might be indistinguishable
from the legitimate [controller's](https://www.w3.org/TR/did-1.0/#did-controller) use starting from
the time the [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) was registered, to the time it was
revoked.


The following considerations might be of use when contemplating the use of
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) revocation:


- [Verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) revocation is a reactive security measure.

- It is considered a best practice to support key revocation.

- A [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) is expected to immediately revoke any [verification\\
  method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) that is known to be compromised.

- [Verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) revocation can only be embodied in changes to
  the latest version of a [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents); it cannot retroactively adjust
  previous versions.

- As described in [5.2.1 Verification Material](https://www.w3.org/TR/did-1.0/#verification-material), absence of a verification
  method is the only form of revocation that applies to all [DID Methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
  that support revocation.

- If a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is no longer exclusively accessible to the
  [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) or parties trusted to act on behalf of the [controller](https://www.w3.org/TR/did-1.0/#dfn-controller),
  it is expected to be revoked immediately to reduce the risk of
  compromises such as masquerading, theft, and fraud.

- Revocation is expected to be understood as a [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) expressing that
  proofs or signatures associated with a revoked [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method)
  created after its revocation should be treated as invalid. It could also imply a
  concern that existing proofs or signatures might have been created by an
  attacker, but this is not necessarily the case. Verifiers, however, might still
  choose to accept or reject any such proofs or signatures at their own
  discretion.

- The section on [DID method operations](https://www.w3.org/TR/did-1.0/#method-operations) specifies
  the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) operations to be supported by a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification,
  including [update](https://www.w3.org/TR/did-1.0/#method-operations) and [deactivate](https://www.w3.org/TR/did-1.0/#method-operations), which might be used to remove
  a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) from a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).

- Not all [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) support [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) revocation.

- Even if a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is present in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents),
  additional information, such as a public key revocation certificate, or an
  external allow or deny list, could be used to determine whether a
  [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) has been revoked.

- The day-to-day operation of any software relying on a compromised
  [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method), such as an individual's operating system, antivirus,
  or endpoint protection software, could be impacted when the [verification\\
  method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is publicly revoked.


#### Revocation Semantics

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#revocation-semantics)

Although verifiers might choose not to accept proofs or signatures from a
revoked verification method, knowing whether a verification was made with a
revoked [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) is trickier than it might seem. Some [DID\\
methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) provide the ability to look back at the state of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) at a
point in time, or at a particular version of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). When such
a feature is combined with a reliable way to determine the time or [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
version that existed when a cryptographically verifiable statement was made,
then revocation does not undo that statement. This can be the basis for using
[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to make binding commitments; for example, to sign a mortgage.


If these conditions are met, revocation is not retroactive; it only nullifies
future use of the method.


However, in order for such semantics to be safe, the second condition — an
ability to know what the state of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) was at the time the
assertion was made — is expected to apply. Without that guarantee, someone
could discover a revoked key and use it to make cryptographically verifiable
statements with a simulated date in the past.


Some [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) only allow the retrieval of the current state of a
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). When this is true, or when the state of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) at the time of
a cryptographically verifiable statement cannot be reliably determined, then the
only safe course is to disallow any consideration of DID state with respect to
time, except the present moment. [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) ecosystems that take this approach
essentially provide cryptographically verifiable statements as ephemeral tokens
that can be invalidated at any time by the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers).


#### Revocation in Trustless Systems

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#revocation-in-trustless-systems)

Trustless systems are those where all trust is derived from cryptographically
provable assertions, and more specifically, where no metadata outside of the
cryptographic system is factored into the determination of trust in the system.
To verify a signature of proof for a [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) which has been
revoked in a trustless system, a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) needs to support either or
both of the `versionId` or `versionTime`, as well as both the `updated` and
`nextUpdate`, [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata properties. A verifier can validate a
signature or proof of a revoked key if and only if all of the following are
true:


- The proof or signature includes the `versionId` or `versionTime` of the [DID\\
  document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that was used at the point the signature or proof was created.

- The verifier can determine the point in time at which the signature or proof was
  made; for example, it was anchored on a blockchain.

- For the resolved [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) metadata, the `updated` timestamp is
  before, and the `nextUpdate` timestamp is after, the point in time at which the
  signature or proof was made.


In systems that are willing to admit metadata other than those constituting
cryptographic input, similar trust may be achieved -- but always on the
same basis where a careful judgment is made about whether a
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)'s content at the moment of a signing event
contained the expected content.


### 9.9 DID Recovery

[Permalink for Section 9.9](https://www.w3.org/TR/did-1.0/#did-recovery)

Recovery is a reactive security measure whereby a [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) that has
lost the ability to perform DID operations, such as through the loss of a
device, is able to regain the ability to perform DID operations.


The following considerations might be of use when contemplating the use of
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) recovery:


- Performing recovery proactively on an infrequent but regular basis, can help to
  ensure that control has not been lost.

- It is considered a best practice to never reuse cryptographic material
  associated with recovery for any other purposes.

- Recovery is commonly performed in conjunction with [verification method rotation](https://www.w3.org/TR/did-1.0/#verification-method-rotation) and [verification method revocation](https://www.w3.org/TR/did-1.0/#verification-method-revocation).

- Recovery is advised when a [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) or services trusted to act on their
  behalf no longer have the exclusive ability to perform DID operations as
  described in [8.2 Method Operations](https://www.w3.org/TR/did-1.0/#method-operations).

- [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications might choose to enable support for a quorum of
  trusted parties to facilitate recovery. Some of the facilities to do so are
  suggested in [5.1.2 DID Controller](https://www.w3.org/TR/did-1.0/#did-controller).

- Not all [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specifications will recognize control from [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
  registered using other [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and they might restrict third-party
  control to [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) that use the same method.

- Access control and recovery in a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification can also
  include a time lock feature to protect against key compromise by maintaining a
  second track of control for recovery.

- There are currently no common recovery mechanisms that apply to all
  [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


### 9.10 The Role of Human-Friendly Identifiers

[Permalink for Section 9.10](https://www.w3.org/TR/did-1.0/#the-role-of-human-friendly-identifiers)

[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) achieve global uniqueness without the need for a central
registration authority. This comes at the cost of human memorability.
Algorithms capable of generating globally unambiguous identifiers
produce random strings of characters that have no human meaning. This
trade-off is often referred to as
[Zooko's\\
Triangle](https://en.wikipedia.org/wiki/Zooko%27s_triangle).


There are use cases where it is desirable to discover a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) when
starting from a human-friendly identifier. For example, a natural language
name, a domain name, or a conventional address for a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers),
such as a mobile telephone number, email address, social media username, or
blog URL. However, the problem of mapping human-friendly identifiers to
[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), and doing so in a way that can be verified and trusted, is
outside the scope of this specification.


Solutions to this problem are defined in separate specifications, such as
\[[DNS-DID](https://www.w3.org/TR/did-1.0/#bib-dns-did "The Decentralized Identifier (DID) in the DNS")\], that reference this specification. It is strongly recommended that
such specifications carefully consider the:


- Numerous security attacks based on deceiving users about the true human-friendly
  identifier for a target entity.

- Privacy consequences of using human-friendly identifiers that are inherently
  correlatable, especially if they are globally unique.


### 9.11 DIDs as Enhanced URNs

[Permalink for Section 9.11](https://www.w3.org/TR/did-1.0/#dids-as-enhanced-urns)

If desired by a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers), a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) or a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls) is
capable of acting as persistent, location-independent resource identifier.
These sorts of identifiers
are classified as Uniform Resource Names (URNs) and are defined in \[[RFC8141](https://www.w3.org/TR/did-1.0/#bib-rfc8141 "Uniform Resource Names (URNs)")\].
[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are an enhanced form of URN that provide a
cryptographically secure, location-independent identifier for a digital
resource, while also providing metadata that enables retrieval. Due to the
indirection between the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) and the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) itself, the
[DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) can adjust the actual location of the resource — or
even provide the resource directly — without adjusting the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).
[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) of this type can definitively verify that the resource retrieved is,
in fact, the resource identified.


A [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) who intends to use a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for this purpose is
advised to follow the security considerations in \[[RFC8141](https://www.w3.org/TR/did-1.0/#bib-rfc8141 "Uniform Resource Names (URNs)")\]. In particular:


- The [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) is expected to choose a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) that
  supports the controller's requirements for persistence. The Decentralized
  Characteristics Rubric \[[DID-RUBRIC](https://www.w3.org/TR/did-1.0/#bib-did-rubric "Decentralized Characteristics Rubric v1.0")\] is one tool available to help
  implementers decide upon the most suitable [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods).

- The [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) is expected to publish its operational policies so
  requesting parties can determine the degree to which they can rely on the
  persistence of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) controlled by that [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers). In the
  absence of such policies, requesting parties are not expected to make any
  assumption about whether a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is a persistent identifier for the same
  [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).


### 9.12 Immutability

[Permalink for Section 9.12](https://www.w3.org/TR/did-1.0/#immutability)

Many cybersecurity abuses hinge on exploiting gaps between reality and the
assumptions of rational, good-faith actors. Immutability of [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
can provide some security benefits. Individual [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) ought to
consider constraints that would eliminate behaviors or semantics they do not
need. The more _locked down_ a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) is, while providing the
same set of features, the less it can be manipulated by malicious actors.


As an example, consider that a single edit to a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can change
anything except the root `id` property of the document. But
is it actually desirable for a [service](https://www.w3.org/TR/did-1.0/#dfn-service) to change its
`type` after it is defined? Or for a key to change its value? Or
would it be better to require a new `id` when certain
fundamental properties of an object change? Malicious takeovers of a website
often aim for an outcome where the site keeps its host name identifier,
but is subtly changed underneath. If certain properties of the site, such
as the [ASN](https://en.wikipedia.org/wiki/Autonomous_system_(Internet))
associated with its IP address, were required by the specification to be
immutable, anomaly detection would be easier, and attacks would be much
harder and more expensive to carry out.


For [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) tied to a global source of truth, a direct,
just-in-time lookup of the latest version of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is always
possible. However, it seems likely that layers of cache might eventually sit
between a [DID resolver](https://www.w3.org/TR/did-1.0/#dfn-did-resolvers) and that source of truth. If they do, believing
the attributes of an object in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) to have a given state
when they are actually subtly different might invite exploits. This is
particularly true if some lookups are of a full [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), and
others are of partial data where the larger context is assumed.


### 9.13 Encrypted Data in DID Documents

[Permalink for Section 9.13](https://www.w3.org/TR/did-1.0/#encrypted-data-in-did-documents)

Encryption algorithms have been known to fail due to advances in cryptography
and computing power. Implementers are advised to assume that any encrypted data
placed in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) might eventually be made available in clear text
to the same audience to which the encrypted data is available. This is
particularly pertinent if the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is public.


Encrypting all or parts of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is _not_ an appropriate
means to protect data in the long term. Similarly, placing encrypted data in
a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is not an appropriate means to protect personal data.


Given the caveats above, if encrypted data is included in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents),
implementers are advised to not associate any correlatable information
that could be used to infer a relationship between the encrypted data
and an associated party. Examples of correlatable information include
public keys of a receiving party, identifiers to digital assets known to be
under the control of a receiving party, or human readable descriptions of a
receiving party.


### 9.14 Equivalence Properties

[Permalink for Section 9.14](https://www.w3.org/TR/did-1.0/#equivalence-properties)

Given the `equivalentId` and `canonicalId`
properties are generated by [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) themselves, the same security and
accuracy guarantees that apply to the resolved [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) present in the
`id` field of a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) also apply to these properties.
The `alsoKnownAs` property is not guaranteed to be an accurate
statement of equivalence, and should not be relied upon without performing
validation steps beyond the resolution of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


The `equivalentId` and `canonicalId`
properties express equivalence assertions to variants of a single [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
produced by the same [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and can be trusted to the extent the
requesting party trusts the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and a conforming producer and
resolver.


The `alsoKnownAs` property permits an equivalence assertion to
[URIs](https://www.w3.org/TR/did-1.0/#dfn-uri) that are not governed by the same [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) and cannot be
trusted without performing verification steps outside of the governing [DID\\
method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). See additional guidance in [5.1.3 Also Known As](https://www.w3.org/TR/did-1.0/#also-known-as).


As with any other security-related properties in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents),
parties relying on any equivalence statement in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) should
guard against the values of these properties being substituted by an attacker
after the proper verification has been performed. Any write access to a [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) stored in memory or disk after verification has been performed is
an attack vector that might circumvent verification unless the [DID\\
document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is re-verified.


### 9.15 Content Integrity Protection

[Permalink for Section 9.15](https://www.w3.org/TR/did-1.0/#content-integrity-protection)

[DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) which include links to external machine-readable content
such as images, web pages, or schemas are vulnerable to tampering. It is
strongly advised that external links are integrity protected using solutions
such as a hashlink \[[HASHLINK](https://www.w3.org/TR/did-1.0/#bib-hashlink "Cryptographic Hyperlinks")\]. External links are to be avoided if they
cannot be integrity protected and the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)'s integrity is
dependent on the external link.


One example of an external link where the integrity of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
itself could be affected is the JSON-LD Context \[[JSON-LD11](https://www.w3.org/TR/did-1.0/#bib-json-ld11 "JSON-LD 1.1")\]. To protect
against compromise, [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) consumers are advised to cache local
static copies of JSON-LD contexts and/or verify the integrity of external
contexts against a cryptographic hash that is known to be associated with a safe
version of the external JSON-LD Context.


### 9.16 Persistence

[Permalink for Section 9.16](https://www.w3.org/TR/did-1.0/#persistence)

[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are designed to be persistent such that a [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) need not
rely upon a single trusted third party or administrator to maintain their
identifiers. In an ideal case, no administrator can take control away from the
[controller](https://www.w3.org/TR/did-1.0/#dfn-controller), nor can an administrator prevent their identifiers' use for
any particular purpose such as authentication, authorization, and attestation.
No third party can act on behalf of a [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) to remove or render
inoperable an entity's identifier without the [controller](https://www.w3.org/TR/did-1.0/#dfn-controller)'s consent.


However, it is important to note that in all [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) that enable
cryptographic proof-of-control, the means of proving control can always be
transferred to another party by transferring the secret cryptographic material.
Therefore, it is vital that systems relying on the persistence of an identifier
over time regularly check to ensure that the identifier is, in fact, still under
the control of the intended party.


Unfortunately, it is impossible to determine from the cryptography alone whether
or not the secret cryptographic material associated with a given
[verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) has been compromised. It might well be that the
expected [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) still has access to the secret cryptographic material
— and as such can execute a proof-of-control as part of a verification
process — while at the same time, a bad actor also has access to those
same keys, or to a copy thereof.


As such, cryptographic proof-of-control is expected to only be used as one
factor in evaluating the level of identity assurance required for high-stakes
scenarios. [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)-based authentication provides much greater assurance than
a username and password, thanks to the ability to determine control over a
cryptographic secret without transmitting that secret between systems. However,
it is not infallible. Scenarios that involve sensitive, high value, or
life-critical operations are expected to use additional factors as appropriate.


In addition to potential ambiguity from use by different [controllers](https://www.w3.org/TR/did-1.0/#dfn-controller), it
is impossible to guarantee, in general, that a given [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is being used in
reference to the same subject at any given point in time. It is technically
possible for the controller to reuse a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for different subjects and,
more subtly, for the precise definition of the subject to either change over
time or be misunderstood.


For example, consider a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) used for a sole proprietorship, receiving
various credentials used for financial transactions. To the [controller](https://www.w3.org/TR/did-1.0/#dfn-controller),
that identifier referred to the business. As the business grows, it eventually
gets incorporated as a Limited Liability Company. The [controller](https://www.w3.org/TR/did-1.0/#dfn-controller)
continues using that same [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), because to **them** the
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) refers to the business. However, to the state, the tax authority, and
the local municipality, the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) no longer refers to the same entity.
Whether or not the subtle shift in meaning matters to a credit provider or
supplier is necessarily up to them to decide. In many cases, as long as the
bills get paid and collections can be enforced, the shift is immaterial.


Due to these potential ambiguities, [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are to be considered valid
_contextually_ rather than absolutely. Their persistence does not imply
that they refer to the exact same subject, nor that they are under the control
of the same [controller](https://www.w3.org/TR/did-1.0/#dfn-controller). Instead, one needs to understand the context in
which the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) was created, how it is used, and consider the likely shifts
in their meaning, and adopt procedures and policies to address both potential
and inevitable semantic drift.


### 9.17 Level of Assurance

[Permalink for Section 9.17](https://www.w3.org/TR/did-1.0/#level-of-assurance)

Additional information about the security context of authentication events is
often required for compliance reasons, especially in regulated areas such as the
financial and public sectors. This information is often referred to as a Level
of Assurance (LOA). Examples include the protection of secret cryptographic
material, the identity proofing process, and the form-factor of the
authenticator.


[Payment services (PSD 2)](https://ec.europa.eu/info/law/payment-services-psd-2-directive-eu-2015-2366_en) and [eIDAS](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2014.257.01.0073.01.ENG) introduce such requirements to the security context. Level of
assurance frameworks are classified and defined by regulations and
standards such as [eIDAS](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2014.257.01.0073.01.ENG), [NIST 800-63-3](https://pages.nist.gov/800-63-3/sp800-63-3.html) and [ISO/IEC\\
29115:2013](https://www.iso.org/standard/45138.html), including their requirements for the security context, and
making recommendations on how to achieve them. This might include strong user
authentication where [FIDO2](https://fidoalliance.org/fido2/)/ [WebAuthn](https://www.w3.org/TR/webauthn-2/) can fulfill the
requirement.


Some regulated scenarios require the implementation of a specific level of
assurance. Since [verification relationships](https://www.w3.org/TR/did-1.0/#dfn-verification-relationship) such as `
assertionMethod` and `authentication` might be
used in some of these situations, information about the applied security context
might need to be expressed and provided to a _verifier_. Whether and how
to encode this information in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) data model is out of scope
for this specification. Interested readers might note that 1) the information
could be transmitted using Verifiable Credentials \[[VC-DATA-MODEL](https://www.w3.org/TR/did-1.0/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\], and 2) the
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) data model can be extended to incorporate this information
as described in [4.1 Extensibility](https://www.w3.org/TR/did-1.0/#extensibility), and where [10\. Privacy Considerations](https://www.w3.org/TR/did-1.0/#privacy-considerations) is applicable for such extensions.


## 10\. Privacy Considerations

[Permalink for Section 10.](https://www.w3.org/TR/did-1.0/#privacy-considerations)

_This section is non-normative._

Since [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are designed to be administered
directly by the [DID controller(s)](https://www.w3.org/TR/did-1.0/#dfn-did-controllers), it is critically important to apply
the principles of Privacy by Design \[[PRIVACY-BY-DESIGN](https://www.w3.org/TR/did-1.0/#bib-privacy-by-design "Privacy by Design")\] to all aspects of the
[decentralized identifier](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) architecture. All seven of these principles
have been applied throughout the development of this specification. The design
used in this specification does not assume that there is a registrar, hosting
company, nor other intermediate service provider to recommend or apply
additional privacy safeguards. Privacy in this specification is preventive,
not remedial, and is an embedded default. The following sections cover privacy
considerations that implementers might find useful when building systems that
utilize [decentralized identifiers](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).


### 10.1 Keep Personal Data Private

[Permalink for Section 10.1](https://www.w3.org/TR/did-1.0/#keep-personal-data-private)

If a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) specification is written for a public-facing
[verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry) where corresponding [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID\\
documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) might be made publicly available, it is _critical_ that
those [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) contain no personal data. Personal data can instead
be transmitted through other means such as 1) Verifiable Credentials
\[[VC-DATA-MODEL](https://www.w3.org/TR/did-1.0/#bib-vc-data-model "Verifiable Credentials Data Model v1.1")\], or 2) [service endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) under control of the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) or [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers).


Due diligence is expected to be taken around the use of URLs in [service\\
endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) to prevent leakage of personal data or correlation within a URL of
a [service endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints). For example, a URL that contains a username is
dangerous to include in a [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) because the username is likely to
be human-meaningful in a way that can reveal information that the [DID\\
subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) did not consent to sharing. With the privacy architecture suggested
by this specification, personal data can be exchanged on a private, peer-to-peer
basis using communication channels identified and secured by [verification\\
methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) in [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents). This also enables [DID subjects](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and
requesting parties to implement the [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) [right to be\\
forgotten](https://en.wikipedia.org/wiki/Right_to_be_forgotten), because no personal data is written to an immutable
[distributed ledger](https://www.w3.org/TR/did-1.0/#dfn-distributed-ledger-technology).


### 10.2 DID Correlation Risks

[Permalink for Section 10.2](https://www.w3.org/TR/did-1.0/#did-correlation-risks)

Like any type of globally unambiguous identifier, [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) might be used for
correlation. [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) can mitigate this privacy risk by using
pairwise [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) that are unique to each relationship; in effect, each
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) acts as a pseudonym. A pairwise [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) need only be shared with
more than one party when correlation is explicitly desired. If pairwise
[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are the default, then the only need to publish a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) openly,
or to share it with multiple parties, is when the [DID controller(s)](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) and/or [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects)
explicitly desires public identification and correlation.


### 10.3 DID Document Correlation Risks

[Permalink for Section 10.3](https://www.w3.org/TR/did-1.0/#did-document-correlation-risks)

The anti-correlation protections of pairwise [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are easily defeated if
the data in the corresponding [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can be correlated. For
example, using identical [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) or bespoke [service\\
endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) in multiple [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can provide as much correlation
information as using the same [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). Therefore, the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) for
a pairwise [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) also needs to use pairwise unique information, such as
ensuring that [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) are unique to the pairwise
relationship.


It might seem natural to also use pairwise unique [service endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) in
the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) for a pairwise [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). However, unique endpoints
allow all traffic between two [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to be isolated perfectly into unique
buckets, where timing correlation and similar analysis is easy. Therefore, a
better strategy for endpoint privacy might be to share an endpoint among a large
number of [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) controlled by many different subjects (see [10.5 Herd Privacy](https://www.w3.org/TR/did-1.0/#herd-privacy)).


### 10.4 DID Subject Classification

[Permalink for Section 10.4](https://www.w3.org/TR/did-1.0/#did-subject-classification)

It is dangerous to add properties to the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that can be used
to indicate, explicitly or through inference, what _type_ or nature of
thing the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is, particularly if the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is a
person.


Not only do such properties potentially result in personal data (see
[10.1 Keep Personal Data Private](https://www.w3.org/TR/did-1.0/#keep-personal-data-private)) or
correlatable data (see [10.2 DID Correlation Risks](https://www.w3.org/TR/did-1.0/#did-correlation-risks) and [10.3 DID Document Correlation Risks](https://www.w3.org/TR/did-1.0/#did-document-correlation-risks)) being present in the
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), but they can be used for grouping particular [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
in such a way that they are included in or excluded from certain operations or
functionalities.


Including _type_ information in a [DID Document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can
result in personal privacy harms even for [DID Subjects](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) that are
non-person entities, such as IoT devices. The aggregation of such
information around a [DID Controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) could serve as a form of
digital fingerprint and this is best avoided.


To minimize these risks, all properties in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) ought to be
for expressing cryptographic material, endpoints, or [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method)
related to using the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).


### 10.5 Herd Privacy

[Permalink for Section 10.5](https://www.w3.org/TR/did-1.0/#herd-privacy)

When a [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is indistinguishable from others in the herd,
privacy is available. When the act of engaging privately with another party is
by itself a recognizable flag, privacy is greatly diminished.


[DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID\\
methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) need to work to improve herd privacy, particularly for those who
legitimately need it most. Choose technologies and human interfaces that
default to preserving anonymity and pseudonymity. To reduce [digital\\
fingerprints](https://en.wikipedia.org/wiki/Device_fingerprint), share common settings across requesting party
implementations, keep negotiated options to a minimum on wire protocols, use
encrypted transport layers, and pad messages to standard lengths.


### 10.6 Service Privacy

[Permalink for Section 10.6](https://www.w3.org/TR/did-1.0/#service-privacy)

The ability for a [controller](https://www.w3.org/TR/did-1.0/#dfn-controller) to optionally express at least one
[service endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) increases their control and
agency. Each additional endpoint in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) adds privacy risk
either due to correlation, such as across endpoint descriptions, or because the
[services](https://www.w3.org/TR/did-1.0/#dfn-service) are not protected by an authorization mechanism, or both.


[DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are often public and, since they are standardized, will be
stored and indexed efficiently by their very standards-based nature. This risk
is worse if [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are published to immutable [verifiable data\\
registries](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry). Access to a history of the [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) referenced by a
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) represents a form of traffic analysis made more efficient through the
use of standards.


The degree of additional privacy risk caused by using multiple [service\\
endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) in one [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can be difficult to estimate. Privacy
harms are typically unintended consequences. [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) can refer to documents,
[services](https://www.w3.org/TR/did-1.0/#dfn-service), schemas, and other things that might be associated with
individual people, households, clubs, and employers — and correlation of
their [service endpoints](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) could become a powerful surveillance and
inference tool. An example of this potential harm can be seen when multiple
common country-level top level domains such as
`https://example.co.uk` might be used to infer the approximate
location of the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) with a greater degree of probability.


#### Maintaining Herd Privacy

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#maintaining-herd-privacy)

The variety of possible endpoints makes it particularly challenging to maintain
herd privacy, in which no information about the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is leaked
(see [10.5 Herd Privacy](https://www.w3.org/TR/did-1.0/#herd-privacy)).


First, because service endpoints might be specified as [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri), they could
unintentionally leak personal information because of the architecture of the
service. For example, a service endpoint of
`http://example.com/MyFirstName` is leaking the term
`MyFirstName` to everyone who can access the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
When linking to legacy systems, this is an unavoidable risk, and care is
expected to be taken in such cases. This specification encourages new,
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)-aware endpoints to use nothing more than the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) itself for
any identification necessary. For example, if a service description were to
include `http://example.com/did%3Aexample%3Aabc123`, no harm would be
done because `did:example:abc123` is already exposed in the DID
Document; it leaks no additional information.


Second, because a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can list multiple service endpoints, it is
possible to irreversibly associate services that are not associated in any other
context. This correlation on its own may lead to privacy harms by revealing
information about the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects), even if the [URIs](https://www.w3.org/TR/did-1.0/#dfn-uri) used did not
contain any sensitive information.


Third, because some types of [DID subjects](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) might be more or less likely to
list specific endpoints, the listing of a given service could, by itself, leak
information that can be used to infer something about the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).
For example, a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for an automobile might include a pointer to a public
title record at the Department of Motor Vehicles, while a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for an
individual would not include that information.


It is the goal of herd privacy to ensure that the nature of specific [DID\\
subjects](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is obscured by the population of the whole. To maximize herd
privacy, implementers need to rely on one — and only one — service
endpoint, with that endpoint providing a proxy or mediator service that the
controller is willing to depend on, to protect such associations and to blind
requests to the ultimate service.


#### Service Endpoint Alternatives

[Permalink for this Section](https://www.w3.org/TR/did-1.0/#service-endpoint-alternatives)

Given the concerns in the previous section, implementers are urged to
consider any of the following service endpoint approaches:


- **Negotiator Endpoint** — Service for negotiating mutually
  agreeable communications channels, preferably using private set intersection.
  The output of negotiation is a communication channel and whatever credentials
  might be needed to access it.

- **Tor Endpoint** ( [Tor Onion Router](https://www.torproject.org/about/history/)) —
  Provide a privacy-respecting address for reaching service endpoints. Any service
  that can be provided online can be provided through TOR for additional
  privacy.

- **Mediator Endpoint** — [Mediators](https://github.com/hyperledger/aries-rfcs/blob/720bdab50e2d0437fda03028c1b17c69781bdd69/concepts/0046-mediators-and-relays/README.md)
  provide a generic endpoint, for multiple parties, receive encrypted messages on
  behalf of those parties, and forward them to the intended recipient. This avoids
  the need to have a specific endpoint per subject, which could create a
  correlation risk. This approach is also called a proxy.

- **Confidential Storage** — Proprietary or confidential
  personal information might need to be kept off of a [verifiable data\\
  registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry) to provide additional privacy and/or security guarantees,
  especially for those [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) where [DID documents](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are published
  on a public ledger. Pointing to external resource services provides a means for
  authorization checks and deletion.

- **Polymorphic Proxy** — A proxy endpoint that can act as any
  number of services, depending on how it is called. For example, the same URL
  could be used for both negotiator and mediator functions, depending on a
  mechanism for re-routing.


These service endpoint types continue to be an area of innovation and
exploration.


## A. Examples

[Permalink for Appendix A.](https://www.w3.org/TR/did-1.0/#examples)

### A.1 DID Documents

[Permalink for Appendix A.1](https://www.w3.org/TR/did-1.0/#did-documents)

_This section is non-normative._

See [Verification Method Types](https://www.w3.org/TR/did-spec-registries/#verification-method-types) \[[DID-SPEC-REGISTRIES](https://www.w3.org/TR/did-1.0/#bib-did-spec-registries "DID Specification Registries")\] for optional extensions
and other verification method types.


Note

These examples are for information purposes only, it is considered a best
practice to avoid using the same [verification method](https://www.w3.org/TR/did-1.0/#dfn-verification-method) for multiple
purposes.


[Example 30](https://www.w3.org/TR/did-1.0/#example-did-document-with-1-verification-method-type): DID Document with 1 verification method type

```hljs json
  {
    "@context": [\
      "https://www.w3.org/ns/did/v1",\
      "https://w3id.org/security/suites/ed25519-2020/v1"\
    ],
    "id": "did:example:123",
    "authentication": [\
      {\
        "id": "did:example:123#z6MkecaLyHuYWkayBDLw5ihndj3T1m6zKTGqau3A51G7RBf3",\
        "type": "Ed25519VerificationKey2020", // external (property value)\
        "controller": "did:example:123",\
        "publicKeyMultibase": "zAKJP3f7BD6W4iWEQ9jwndVTCBq8ua2Utt8EEjJ6Vxsf"\
      }\
    ],
    "capabilityInvocation": [\
      {\
        "id": "did:example:123#z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k",\
        "type": "Ed25519VerificationKey2020", // external (property value)\
        "controller": "did:example:123",\
        "publicKeyMultibase": "z4BWwfeqdp1obQptLLMvPNgBw48p7og1ie6Hf9p5nTpNN"\
      }\
    ],
    "capabilityDelegation": [\
      {\
        "id": "did:example:123#z6Mkw94ByR26zMSkNdCUi6FNRsWnc2DFEeDXyBGJ5KTzSWyi",\
        "type": "Ed25519VerificationKey2020", // external (property value)\
        "controller": "did:example:123",\
        "publicKeyMultibase": "zHgo9PAmfeoxHG8Mn2XHXamxnnSwPpkyBHAMNF3VyXJCL"\
      }\
    ],
    "assertionMethod": [\
      {\
        "id": "did:example:123#z6MkiukuAuQAE8ozxvmahnQGzApvtW7KT5XXKfojjwbdEomY",\
        "type": "Ed25519VerificationKey2020", // external (property value)\
        "controller": "did:example:123",\
        "publicKeyMultibase": "z5TVraf9itbKXrRvt2DSS95Gw4vqU3CHAdetoufdcKazA"\
      }\
    ]
}
```

[Example 31](https://www.w3.org/TR/did-1.0/#example-did-document-with-many-different-key-types): DID Document with many different key types

```hljs json
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/jws-2020/v1"\
  ],
  "verificationMethod": [\
    {\
      "id": "did:example:123#key-0",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "OKP", // external (property name)\
        "crv": "Ed25519", // external (property name)\
        "x": "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ" // external (property name)\
      }\
    },\
    {\
      "id": "did:example:123#key-1",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "OKP", // external (property name)\
        "crv": "X25519", // external (property name)\
        "x": "pE_mG098rdQjY3MKK2D5SUQ6ZOEW3a6Z6T7Z4SgnzCE" // external (property name)\
      }\
    },\
    {\
      "id": "did:example:123#key-2",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "EC", // external (property name)\
        "crv": "secp256k1", // external (property name)\
        "x": "Z4Y3NNOxv0J6tCgqOBFnHnaZhJF6LdulT7z8A-2D5_8", // external (property name)\
        "y": "i5a2NtJoUKXkLm6q8nOEu9WOkso1Ag6FTUT6k_LMnGk" // external (property name)\
      }\
    },\
    {\
      "id": "did:example:123#key-3",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "EC", // external (property name)\
        "crv": "secp256k1", // external (property name)\
        "x": "U1V4TVZVMUpUa0ZVU1NBcU9CRm5IbmFaaEpGNkxkdWx", // external (property name)\
        "y": "i5a2NtJoUKXkLm6q8nOEu9WOkso1Ag6FTUT6k_LMnGk" // external (property name)\
      }\
    },\
    {\
      "id": "did:example:123#key-4",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "EC", // external (property name)\
        "crv": "P-256", // external (property name)\
        "x": "Ums5WVgwRkRTVVFnU3k5c2xvZllMbEcwM3NPRW91ZzN", // external (property name)\
        "y": "nDQW6XZ7b_u2Sy9slofYLlG03sOEoug3I0aAPQ0exs4" // external (property name)\
      }\
    },\
    {\
      "id": "did:example:123#key-5",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "EC", // external (property name)\
        "crv": "P-384", // external (property name)\
        "x": "VUZKSlUwMGdpSXplekRwODhzX2N4U1BYdHVYWUZsaXVDR25kZ1U0UXA4bDkxeHpE", // external (property name)\
        "y": "jq4QoAHKiIzezDp88s_cxSPXtuXYFliuCGndgU4Qp8l91xzD1spCmFIzQgVjqvcP" // external (property name)\
      }\
    },\
    {\
      "id": "did:example:123#key-6",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "EC", // external (property name)\
        "crv": "P-521", // external (property name)\
        "x": "VTI5c1lYSmZWMmx1WkhNZ0dQTXhaYkhtSnBEU3UtSXZwdUtpZ0VOMnB6Z1d0U28tLVJ3ZC1uNzhuclduWnplRGMx", // external (property name)\
        "y": "UW5WNVgwSnBkR052YVc0Z1VqY1B6LVpoZWNaRnliT3FMSUpqVk9sTEVUSDd1UGx5RzBnRW9NV25JWlhoUVZ5cFB5" // external (property name)\
      }\
    },\
    {\
      "id": "did:example:123#key-7",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "RSA", // external (property name)\
        "e": "AQAB", // external (property name)\
        "n": "UkhWaGJGOUZRMTlFVWtKSElBdENGV2hlU1F2djFNRXh1NVJMQ01UNGpWazlraEpLdjhKZU1YV2UzYldIYXRqUHNrZGYyZGxhR2tXNVFqdE9uVUtMNzQybXZyNHRDbGRLUzNVTElhVDFoSkluTUhIeGoyZ2N1Yk82ZUVlZ0FDUTRRU3U5TE8wSC1MTV9MM0RzUkFCQjdRamE4SGVjcHl1c3BXMVR1X0RicXhjU253ZW5kYW13TDUyVjE3ZUtobE80dVh3djJIRmx4dWZGSE0wS21DSnVqSUt5QXhqRF9tM3FfX0lpSFVWSEQxdERJRXZMUGhHOUF6c24zajk1ZC1zYU" // external (property name)\
      }\
    }\
  ]
}
```

[Example 32](https://www.w3.org/TR/did-1.0/#example-did-document-with-different-verification-method-types): DID Document with different verification method types

```hljs json
{
  "@context": [\
    "https://www.w3.org/ns/did/v1",\
    "https://w3id.org/security/suites/ed25519-2018/v1",\
    "https://w3id.org/security/suites/x25519-2019/v1",\
    "https://w3id.org/security/suites/secp256k1-2019/v1",\
    "https://w3id.org/security/suites/jws-2020/v1"\
  ],
  "verificationMethod": [\
    {\
      "id": "did:example:123#key-0",\
      "type": "Ed25519VerificationKey2018",\
      "controller": "did:example:123",\
      "publicKeyBase58": "3M5RCDjPTWPkKSN3sxUmmMqHbmRPegYP1tjcKyrDbt9J" // external (property name)\
    },\
    {\
      "id": "did:example:123#key-1",\
      "type": "X25519KeyAgreementKey2019",\
      "controller": "did:example:123",\
      "publicKeyBase58": "FbQWLPRhTH95MCkQUeFYdiSoQt8zMwetqfWoxqPgaq7x" // external (property name)\
    },\
    {\
      "id": "did:example:123#key-2",\
      "type": "EcdsaSecp256k1VerificationKey2019",\
      "controller": "did:example:123",\
      "publicKeyBase58": "ns2aFDq25fEV1NUd3wZ65sgj5QjFW8JCAHdUJfLwfodt" // external (property name)\
    },\
    {\
      "id": "did:example:123#key-3",\
      "type": "JsonWebKey2020",\
      "controller": "did:example:123",\
      "publicKeyJwk": {\
        "kty": "EC", // external (property name)\
        "crv": "P-256", // external (property name)\
        "x": "Er6KSSnAjI70ObRWhlaMgqyIOQYrDJTE94ej5hybQ2M", // external (property name)\
        "y": "pPVzCOTJwgikPjuUE6UebfZySqEJ0ZtsWFpj7YSPGEk" // external (property name)\
      }\
    }\
  ]
}
```

### A.2 Proving

[Permalink for Appendix A.2](https://www.w3.org/TR/did-1.0/#proving)

_This section is non-normative._

Note

These examples are for information purposes only. See
[W3C Verifiable Credentials Data\\
Model](https://www.w3.org/TR/vc-data-model/) for additional examples.


[Example 33](https://www.w3.org/TR/did-1.0/#example-verifiable-credential-linked-to-a-verification-method-of-type-ed25519verificationkey2020): Verifiable Credential linked to a verification method of type Ed25519VerificationKey2020

```hljs json
{  // external (all terms in this example)
  "@context": [\
    "https://www.w3.org/2018/credentials/v1",\
    "https://w3id.org/citizenship/v1"\
  ],
  "type": [\
    "VerifiableCredential",\
    "PermanentResidentCard"\
  ],
  "credentialSubject": {
    "id": "did:example:123",
    "type": [\
      "PermanentResident",\
      "Person"\
    ],
    "givenName": "JOHN",
    "familyName": "SMITH",
    "gender": "Male",
    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
    "residentSince": "2015-01-01",
    "lprCategory": "C09",
    "lprNumber": "000-000-204",
    "commuterClassification": "C1",
    "birthCountry": "Bahamas",
    "birthDate": "1958-08-17"
  },
  "issuer": "did:example:456",
  "issuanceDate": "2020-04-22T10:37:22Z",
  "identifier": "83627465",
  "name": "Permanent Resident Card",
  "description": "Government of Example Permanent Resident Card.",
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2020-04-22T10:37:22Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:example:456#key-1",
    "jws": "eyJjcml0IjpbImI2NCJdLCJiNjQiOmZhbHNlLCJhbGciOiJFZERTQSJ9..BhWew0x-txcroGjgdtK-yBCqoetg9DD9SgV4245TmXJi-PmqFzux6Cwaph0r-mbqzlE17yLebjfqbRT275U1AA"
  }
}
```

[Example 34](https://www.w3.org/TR/did-1.0/#example-verifiable-credential-linked-to-a-verification-method-of-type-jsonwebkey2020): Verifiable Credential linked to a verification method of type JsonWebKey2020

```hljs json
{  // external (all terms in this example)
  "@context": [\
    "https://www.w3.org/2018/credentials/v1",\
    "https://www.w3.org/2018/credentials/examples/v1"\
  ],
  "id": "http://example.gov/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": { "id": "did:example:123" },
  "issuanceDate": "2020-03-10T04:24:12.164Z",
  "credentialSubject": {
    "id": "did:example:456",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts"
    }
  },
  "proof": {
    "type": "JsonWebSignature2020",
    "created": "2020-02-15T17:13:18Z",
    "verificationMethod": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
    "proofPurpose": "assertionMethod",
    "jws": "eyJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdLCJhbGciOiJFZERTQSJ9..Y0KqovWCPAeeFhkJxfQ22pbVl43Z7UI-X-1JX32CA9MkFHkmNprcNj9Da4Q4QOl0cY3obF8cdDRdnKr0IwNrAw"
  }
}
```

[Example 35](https://www.w3.org/TR/did-1.0/#example-verifiable-credential-linked-to-a-bls12381-verification-method): Verifiable Credential linked to a bls12381 verification method

```hljs json
{  // external (all terms in this example)
  "@context": [\
    "https://www.w3.org/2018/credentials/v1",\
    "https://w3id.org/security/bbs/v1",\
    {\
      "name": "https://schema.org/name",\
      "birthDate": "https://schema.org/birthDate"\
    }\
  ],
  "id": "urn:uuid:c499e122-3ba9-4e95-8d4d-c0ebfcf8c51a",
  "type": ["VerifiableCredential"],
  "issuanceDate": "2021-02-07T16:02:08.571Z",
  "issuer": {
    "id": "did:example:123"
  },
  "credentialSubject": {
    "id": "did:example:456",
    "name": "John Smith",
    "birthDate": "2021-02-07"
  },
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2021-02-07T16:02:10Z",
    "proofPurpose": "assertionMethod",
    "proofValue": "o7zD2eNTp657YzkJLub+IO4Zqy/R3Lv/AWmtSA/kUlEAOa73BNyP1vOeoow35jkABolx4kYMKkp/ZsFDweuKwe/p9vxv9wrMJ9GpiOZjHcpjelDRRJLBiccg9Yv7608mHgH0N1Qrj14PZ2saUlfhpQ==",
    "verificationMethod": "did:example:123#bls12381-g2-key"
  }
}
```

[Example 36](https://www.w3.org/TR/did-1.0/#example-verifiable-credential-selective-disclosure-zero-knowledge-proof-linked-to-a-bls12381-verification-method): Verifiable Credential selective disclosure zero knowledge proof linked to a bls12381 verification method

```hljs json
{  // external (all terms in this example)
  "@context": [\
    "https://www.w3.org/2018/credentials/v1",\
    "https://w3id.org/security/bbs/v1",\
    {\
      "name": "https://schema.org/name",\
      "birthDate": "https://schema.org/birthDate"\
    }\
  ],
  "id": "urn:uuid:c499e122-3ba9-4e95-8d4d-c0ebfcf8c51a",
  "type": "VerifiableCredential",
  "issuanceDate": "2021-02-07T16:02:08.571Z",
  "issuer": {
    "id": "did:example:123"
  },
  "credentialSubject": {
    "id": "did:example:456",
    "birthDate": "2021-02-07"
  },
  "proof": {
    "type": "BbsBlsSignatureProof2020",
    "created": "2021-02-07T16:02:10Z",
    "nonce": "OqZHsV/aunS34BhLaSoxiHWK+SUaG4iozM3V+1jO06zRRNcDWID+I0uwtPJJ767Yo8Q=",
    "proofPurpose": "assertionMethod",
    "proofValue": "AAsH34lcKsqaqPaLQWcnLMe3mDM+K7fZM0t4Iesfj7BhD//HBtuWCmZE946BqW7OHYU106MP8mLntutqB8FyGwS7AOyK+5/7iW6JwLNVCvh4Nt3IaF3AN47fqVs2VikD9DiCsaFAUU6ISj5pbad8O+6jiT9Yw6ug8t8vJn3XHvMUhCPnDZJeBEdKD1qo4Z0LOq3L8QAAAHSEgtC9BoZL2MLjz4QuPxpwbhTTRC08MIUjdJnP4JUtz6163Lsl3rpadGu2d3Te7loAAAACZBD4YWOgV0xpPoYZ5vywNA5/NTeDHDbX36gvoV5RDJtY1SLU2LN/IDPZGrfhEiASbD1/QXqj8dod6FbjBs9m/LchBcy7z4yDBv/8DnBzDJ9dEaM4bDjpwmqtgJqha2kwtlyNog67xG9tNjnp5rrbIgAAAANMVanwWmlkg5I/f1M2QJ5GRvQiBL4lyL5sttxwIOalbTZP8VqWtFJI54xMNjTiK71aFWWN8SlNEwfVIX34HO5zBIb6fvc+Or21ubYllT9eXv1epl2o2CojuieCZyxE8/Q=",
    "verificationMethod": "did:example:123#bls12381-g2-key"
  }
}
```

[Example 37](https://www.w3.org/TR/did-1.0/#example-verifiable-credential-as-decoded-jwt): Verifiable Credential as Decoded JWT

```hljs json
{ // external (all terms in this example)
  "protected": {
    "kid": "did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
    "alg": "EdDSA"
  },
  "payload": {
    "iss": "did:example:123",
    "sub": "did:example:456",
    "vc": {
      "@context": [\
        "https://www.w3.org/2018/credentials/v1",\
        "https://www.w3.org/2018/credentials/examples/v1"\
      ],
      "id": "http://example.gov/credentials/3732",
      "type": [\
        "VerifiableCredential",\
        "UniversityDegreeCredential"\
      ],
      "issuer": {
        "id": "did:example:123"
      },
      "issuanceDate": "2020-03-10T04:24:12.164Z",
      "credentialSubject": {
        "id": "did:example:456",
        "degree": {
          "type": "BachelorDegree",
          "name": "Bachelor of Science and Arts"
        }
      }
    },
    "jti": "http://example.gov/credentials/3732",
    "nbf": 1583814252
  },
  "signature": "qSv6dpZJGFybtcifLwGf4ujzlEu-fam_M7HPxinCbVhz9iIJCg70UMeQbPa1ex6BmQ2tnSS7F11FHnMB2bJRAw"
}
```

### A.3 Encrypting

[Permalink for Appendix A.3](https://www.w3.org/TR/did-1.0/#encrypting)

_This section is non-normative._

Note

These examples are for information purposes only, it is considered a best
practice to avoid dislosing unnecessary information in JWE headers.


[Example 38](https://www.w3.org/TR/did-1.0/#example-jwe-linked-to-a-verification-method-via-kid): JWE linked to a verification method via kid

```hljs json
{ // external (all terms in this example)
  "ciphertext": "3SHQQJajNH6q0fyAHmw...",
  "iv": "QldSPLVnFf2-VXcNLza6mbylYwphW57Q",
  "protected": "eyJlbmMiOiJYQzIwUCJ9",
  "recipients": [\
    {\
      "encrypted_key": "BMJ19zK12YHftJ4sr6Pz1rX1HtYni_L9DZvO1cEZfRWDN2vXeOYlwA",\
      "header": {\
        "alg": "ECDH-ES+A256KW",\
        "apu": "Tx9qG69ZfodhRos-8qfhTPc6ZFnNUcgNDVdHqX1UR3s",\
        "apv": "ZGlkOmVsZW06cm9wc3RlbjpFa...",\
        "epk": {\
          "crv": "X25519",\
          "kty": "OKP",\
          "x": "Tx9qG69ZfodhRos-8qfhTPc6ZFnNUcgNDVdHqX1UR3s"\
        },\
        "kid": "did:example:123#zC1Rnuvw9rVa6E5TKF4uQVRuQuaCpVgB81Um2u17Fu7UK"\
      }\
    }\
  ],
  "tag": "xbfwwDkzOAJfSVem0jr1bA"
}
```

## B. Architectural Considerations

[Permalink for Appendix B.](https://www.w3.org/TR/did-1.0/#architectural-considerations)

### B.1 Detailed Architecture Diagram

[Permalink for Appendix B.1](https://www.w3.org/TR/did-1.0/#detailed-architecture-diagram)

Following is a diagram showing the relationships among
[4\. Data Model](https://www.w3.org/TR/did-1.0/#data-model), [5\. Core Properties](https://www.w3.org/TR/did-1.0/#core-properties), and
[8\. Methods](https://www.w3.org/TR/did-1.0/#methods), and [7\. Resolution](https://www.w3.org/TR/did-1.0/#resolution).


![   DIDs and DID documents are recorded on a Verifiable Data Registry; DIDs resolve   to DID documents; DIDs refer to DID subjects; a DID controller controls a DID   document; DID URLs contains a DID; DID URLs dereferenced to DID document   fragments or external resources; DID resolver implements resolve function; DID   URL dereferencer implements dereferencing function; DID method operates a   Verfiable Data Registry; DID resolver and DID URL dereferencer instruct a DID   method.         ](https://www.w3.org/TR/did-1.0/diagrams/did_detailed_architecture_overview.svg)Figure 7
 Detailed overview of DID architecture and the relationship of the basic components.


### B.2 Creation of a DID

[Permalink for Appendix B.2](https://www.w3.org/TR/did-1.0/#creation-of-a-did)

The creation of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is a process that is defined by each [DID\\
Method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). Some [DID Methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods), such as `did:key`, are purely
generative, such that a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) are generated by
transforming a single piece of cryptographic material into a conformant
[representation](https://www.w3.org/TR/did-1.0/#dfn-representations). Other [DID methods](https://www.w3.org/TR/did-1.0/#dfn-did-methods) might require the use of a
[verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry), where the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
are recognized to exist by third parties only when the registration has been
completed, as defined by the respective [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). Other processes
might be defined by the respective [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


### B.3 Determining the DID subject

[Permalink for Appendix B.3](https://www.w3.org/TR/did-1.0/#determining-the-did-subject)

A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is a specific type of URI (Uniform Resource Identifier), so a
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) can refer to any resource. Per \[[RFC3986](https://www.w3.org/TR/did-1.0/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\]:


> the term "resource" is used in a general sense for whatever might be
> identified by a URI. \[...\] A resource is not necessarily
> accessible via the Internet.

Resources can be digital or physical, abstract or concrete. Any resource that
can be assigned a URI can be assigned a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). The resource referred to
by the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).


The [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) determines the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).
It is not expected to be possible to determine the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects)
from looking at the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) itself, as [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) are generally
only meaningful to machines, not human. A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is unlikely to contain
any information about the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects), so further information
about the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is only discoverable by resolving the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)
to the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), obtaining a verifiable credential about the
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), or via some other description of the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers).


While the value of the `id` property in the retrieved
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) must always match the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) being resolved, whether
or not the actual resource to which the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) refers can change over time
is dependent upon the [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods). For example, a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)
that permits the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) to change could be used to generate a
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for the current occupant of a particular role—such as the CEO
of a company—where the actual person occupying the role can be different
depending on when the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is resolved.


### B.4 Referring to the DID document

[Permalink for Appendix B.4](https://www.w3.org/TR/did-1.0/#referring-to-the-did-document)

The [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) refers to the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and _resolves to_ the
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) (by following the protocol specified by the
[DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods)). The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is not a separate resource from
the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and does not have a [URI](https://www.w3.org/TR/did-1.0/#dfn-uri) separate from the
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). Rather the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is an artifact of [DID\\
resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) controlled by the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) for the purpose of
describing the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).


This distinction is illustrated by the graph model shown below.


![ Diagram showing a graph model for how DID controllers assign DIDs to refer to DID subjects and resolve to DID documents that describe the DID subjects. ](https://www.w3.org/TR/did-1.0/diagrams/figure-a.1-did-and-did-document-graph.svg)Figure 8
A [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is an identifier assigned by a [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) to refer to
a [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and resolve to a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) that describes the
[DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). The [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is an artifact of [DID\\
resolution](https://www.w3.org/TR/did-1.0/#dfn-did-resolution) and not a separate resource distinct from the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).
See also: [narrative description](https://www.w3.org/TR/did-1.0/#did-and-did-document-graph-longdesc).


Two filled black circles appear at the top of the diagram, one on the left,
labeled "DID Controller", and one on the right, labeled "DID Subject". A
rectangle, with lower right corner bent inwards to form a small triangle,
appears below, containing the label "DID Document". Arrows extend between these
three items, as follows. A solid red arrow points directly from the DID
Controller circle, rightwards to the DID Subject circle, labeled "DID" above it
in large font, and "Identifies" below it in small italic font. The other arrow
labels are also in small italic font. A dotted red arrow, labeled "Resolves
to", extends from DID Controller, starting in the same line as the first arrow,
then curving downward to point to the DID Document rectangle. A green arrow,
labeled "Controls", points directly from DID Controller to DID Document. A
green arrow labeled "Controller" points in the opposite direction, from DID
Document to DID Controller, making an arc outward to the left of the diagram. A
blue arrow, labeled, "Describes" points directly from DID Document to DID
Subject.


### B.5 Statements in the DID document

[Permalink for Appendix B.5](https://www.w3.org/TR/did-1.0/#statements-in-the-did-document)

Each property in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is a statement by the
[DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) that describes:


- The string of characters defining identifiers for the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects)
  (e.g., the `id` and `alsoKnownAs`
  properties)

- How to interact with the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) (e.g., the
  `verificationMethod` and `service`
  properties).

- How to interpret the specific representation of the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
  (e.g., the `@context` property for a JSON-LD representation).


The only required property in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) is `id`,
so that is the only statement guaranteed to be in a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).
That statement is illustrated in [Figure 8](https://www.w3.org/TR/did-1.0/#did-and-did-document-graph "A DID is an identifier assigned by a DID controller to refer to a DID subject and resolve to a DID document that describes the DID subject. The DID document is an artifact of DID resolution and not a separate resource distinct from the DID subject. See also: narrative description.")
with a direct link between the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) and the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).


### B.6 Discovering more information about the DID subject

[Permalink for Appendix B.6](https://www.w3.org/TR/did-1.0/#discovering-more-information-about-the-did-subject)

Options for discovering more information about the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) depend
on the properties present in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). If the
`service` property is present, more information can be
requested from a [service endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints). For example, by querying a
[service endpoint](https://www.w3.org/TR/did-1.0/#dfn-service-endpoints) that supports verifiable credentials for one or more
claims (attributes) describing the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects).


Another option is to use the `alsoKnownAs` property if it
is present in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents). The [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) can use it
to provide a list of other URIs (including other [DIDs](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)) that refer to
the same [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). Resolving or dereferencing these URIs might yield
other descriptions or representations of the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) as
illustrated in the figure below.


![           Diagram showing a graph model, with an           alsoKnownAs property with an arc to another node representing a           different resource that dereferences to another description of the           DID subject.         ](https://www.w3.org/TR/did-1.0/diagrams/figure-a.2-also-known-as-graph.svg)Figure 9
A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) can use the alsoKnownAs property to assert that another
[URI](https://www.w3.org/TR/did-1.0/#dfn-uri) (including, but not necessarily, another [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)) refers to the
same [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). See also: [narrative description](https://www.w3.org/TR/did-1.0/#alsoKnownAs-graph-longdesc).


The diagram contains three small black filled circles, two rectangles with bent
corners, arrows between them, and labels, as follows. On the upper left is a
circle labeled "DID Controller". On the upper right is a circle labeled "DID
Subject". On the lower-middle right is a circle without a label. On the lower
right is a rectangle labeled "Description". In the center of the diagram is a
rectangle labeled "DID Document". Inside the DID Document rectangle, beneath
its label, is two lines of code: "alsoKnownAs: \[", and "URI\]". A black arrow
extends from the second line, to the right, crossing the rectangle border,
pointing to the unlabeled circle at the right of the diagram. This arrow is
labeled above it in large font, "URI", and below it in italic, "Identifies". A
black arrow points from the unlabeled circle downwards to the Description
rectangle, labeled "Dereferences to". A blue arrow, labeled "Describes",
extends from Description, arcing on the right, pointing up to DID Subject. A
blue arrow, also labeled "Describes", points directly from the rectangle,
labeled "DID Document", in the center of the diagram, up and to the right to the
DID Subject circle. A red arrow, labeled "alsoKnownAs", points from DID Subject
down to the unlabeled circle. A red arrow, labeled "DID" above it in large font,
and "Identifies" below it in italic font, lies at the top of the image, pointing
from DID Controller to DID Subject. A dotted red line starts in the same place
but branches off and curves downward to point to the DID Document rectangle at
the center of the image. A green arrow, labeled "Controls", points directly
from DID Controller to DID Document. Another green arrow points in the opposite
direction, labeled "Controller", curving outwards on the left of the image,
from DID Document to DID Controller.


### B.7 Serving a representation of the DID subject

[Permalink for Appendix B.7](https://www.w3.org/TR/did-1.0/#serving-a-representation-of-the-did-subject)

If the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is a digital resource that can be retrieved
from the internet, a [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods) can choose to construct a [DID URL](https://www.w3.org/TR/did-1.0/#dfn-did-urls)
which returns a representation of the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) itself. For example,
a data schema that needs a persistent, cryptographically verifiable identifier
could be assigned a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers), and passing a specified DID parameter (see
[3.2.1 DID Parameters](https://www.w3.org/TR/did-1.0/#did-parameters)) could be used as a standard way to retrieve a
representation of that schema.


Similarly, a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) can be used to refer to a digital resource (such as
an image) that can be returned directly from a [verifiable data registry](https://www.w3.org/TR/did-1.0/#dfn-verifiable-data-registry)
if that functionality is supported by the applicable [DID method](https://www.w3.org/TR/did-1.0/#dfn-did-methods).


### B.8 Assigning DIDs to existing web resources

[Permalink for Appendix B.8](https://www.w3.org/TR/did-1.0/#assigning-dids-to-existing-web-resources)

If the controller of a web page or any other web resource wants to
assign it a persistent, cryptographically verifiable identifier, the
controller can give it a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers). For example, the author of a blog
hosted by a blog hosting company (under that hosting company's domain)
could create a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for the blog. In the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), the
author can include the `alsoKnownAs` property pointing to
the current URL of the blog, e.g.:


`
        "alsoKnownAs": ["https://myblog.blogging-host.example/home"]
      `

If the author subsequently moves the blog to a different hosting company
(or to the author's own domain), the author can update the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
to point to the new URL for the blog, e.g.:


`
        "alsoKnownAs": ["https://myblog.example/"]
      `

The [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) effectively adds a layer of indirection for the blog URL. This
layer of indirection is under the control of the author instead of under the
control of an external administrative authority such as the blog hosting
company. This is how a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) can effectively function as an enhanced [URN (Uniform Resource\\
Name)](https://tools.ietf.org/html/rfc8141)—a persistent identifier for an information resource whose
network location might change over time.


### B.9 The relationship between DID controllers and DID subjects

[Permalink for Appendix B.9](https://www.w3.org/TR/did-1.0/#the-relationship-between-did-controllers-and-did-subjects)

To avoid confusion, it is helpful to classify
[DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) s into two disjoint sets based on their relationship to
the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers).


#### B.9.1 Set \#1: The DID subject _is_ the DID controller

[Permalink for Appendix B.9.1](https://www.w3.org/TR/did-1.0/#set-1-the-did-subject-is-the-did-controller)

The first case, shown in [Figure 10](https://www.w3.org/TR/did-1.0/#controller-subject-equivalence "The DID subject is the same entity as the DID controller. See also: narrative description."), is
the common scenario where the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is also the [DID\\
controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers). This is the case when an individual or organization creates a
[DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) to self-identify.


![ Diagram showing a graph model with an equivalence arc from the DID subject to the DID controller.           ](https://www.w3.org/TR/did-1.0/diagrams/figure-b.1-controller-and-subject-equivalence.svg)Figure 10
The [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is the same entity as the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers). See
also: [narrative description](https://www.w3.org/TR/did-1.0/#controller-subject-equivalence-longdesc).


Two small black circles appear in the diagram, one on the upper left, labeled,
"DID Controller", and one on the upper right, labeled "DID Subject". A solid red
arrow extends from the DID Controller circle to the DID Subject circle, labeled
"DID" in large bold text above the arrow, and "Identifies" in small italic text
beneath the arrow. A dotted red double-ended arrow, labeled "Equivalence",
extends between the two circles, forming an arc in the space between and above
them. In the lower part of the diagram is a rectangle with bent corner, outlined
in black, containing the label "DID Document". Arrows point between this DID
Document rectangle and the small black circles for DID Controller and DID
Subject, with italic labels, as follows. A blue arrow points from the DID
Document to the DID Subject, labeled, "Describes". A green arrow points from the
DID Controller to the DID Document, labeled "Controls". A green arrow points
from the DID Document to the DID Controller, in an outward arc, labeled,
"Controller". A dotted red arrow, labeled "Resolves to", extends from the DID
controller starting to the right, branching off from the arrow to the DID
Subject, then curving downward to point to the DID Document.


From a graph model perspective, even though the nodes identified as the
[DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) and [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) in
[Figure 10](https://www.w3.org/TR/did-1.0/#controller-subject-equivalence "The DID subject is the same entity as the DID controller. See also: narrative description.") are distinct, there is a
logical arc connecting them to express a semantic equivalence relationship.


#### B.9.2 Set \#2: The DID subject is _not_ the DID controller

[Permalink for Appendix B.9.2](https://www.w3.org/TR/did-1.0/#set-2-the-did-subject-is-not-the-did-controller)

The second case is when the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is a separate entity from the
[DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers). This is the case when, for example, a parent creates
and maintains control of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for a child; a corporation creates and
maintains control of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for a subsidiary; or a manufacturer
creates and maintains control of a [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) for a product, an IoT device,
or a digital file.


From a graph model perspective, the only difference from Set 1 that there is
no equivalence arc relationship between the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) and
[DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) nodes.


### B.10 Multiple DID controllers

[Permalink for Appendix B.10](https://www.w3.org/TR/did-1.0/#multiple-did-controllers)

A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) might have more than one [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers). This can
happen in one of two ways.


#### B.10.1 Independent Control

[Permalink for Appendix B.10.1](https://www.w3.org/TR/did-1.0/#independent-control)

In this case, each of the [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) might act on its own, i.e.,
each one has full power to update the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) independently. From
a graph model perspective, in this configuration:


- Each additional [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) is another distinct graph node
  (which might be identified by its own [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers)).

- The same arcs ("controls" and "controller") exist between each
  [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) and the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


![             Diagram showing three DID controllers each with an independent             control relationship with the DID document           ](https://www.w3.org/TR/did-1.0/diagrams/figure-c.1-independent-did-controllers.svg)Figure 11
Multiple independent [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) that can each act independently. See
also: [Text\\
Description](https://www.w3.org/TR/did-1.0/#independent-did-controllers-longdesc)

Three black circles appear on the left, vertically, each labeled "DID
Controller". From each of these circles, a pair of green arrows extends towards
the center of the diagram, to a single rectangle, labeled "DID Document". The
rectangle has the lower right corner cut and bent inward to form a small
triangle, as if to represent a physical piece of paper with curled corner. Each
pair of green arrows consists of one arrow pointing from the black circle to the
rectangle, labeled "Controls", and one pointing in the opposite direction, from
the rectangle to the black circle, labeled "Controller". From the right of the
rectangle extends a blue arrow, labeled, "Describes", pointing to a black circle
labeled, "DID Subject".


#### B.10.2 Group Control

[Permalink for Appendix B.10.2](https://www.w3.org/TR/did-1.0/#group-control)

In the case of group control, the [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) are expected to act
together in some fashion, such as when using a cryptographic algorithm that
requires multiple digital signatures ("multi-sig") or a threshold number of
digital signatures ("m-of-n"). From a functional standpoint, this option is
similar to a single [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) because, although each of the
[DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) in the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) group has its own graph
node, the actual control collapses into a single logical graph node
representing the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) group as shown in
[Figure 12](https://www.w3.org/TR/did-1.0/#group-did-controllers "Multiple DID controllers who are expected to act together as a DID controller group. See also: narrative description.").


![ Diagram showing three DID controllers together as a single DID controller group to control a DID document           ](https://www.w3.org/TR/did-1.0/diagrams/figure-c.2-group-did-controllers.svg)Figure 12
Multiple [DID controllers](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) who are expected to act together as a [DID\\
controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) group. See also: [narrative description](https://www.w3.org/TR/did-1.0/#group-did-controllers-longdesc).


On the left are three black filled circles, labeled "DID Controller Group" by a
brace on the left. From each of these three circles, a green arrow extends to
the center right. These three arrows converge towards a single filled white
circle. A pair of horizontal green arrows connects this white circle on its
right to a rectangle shaped like a page with a curled corner, labeled "DID
Document". The upper arrow points right, from the white circle to the
rectangle, and is labeled "Controls". The lower arrow points left, from the
rectangle to the white circle, and is labeled "Controller". From the right of
the rectangle extends a blue arrow, labeled "Describes", pointing to a black
circle, labeled "DID Subject".


This configuration will often apply when the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects) is an
organization, corporation, government agency, community, or other group
that is not controlled by a single individual.


### B.11 Changing the DID subject

[Permalink for Appendix B.11](https://www.w3.org/TR/did-1.0/#changing-the-did-subject)

A [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) has exactly one [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) which refers to
the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects). The [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers) is expressed as the value of the
`id` property. This property value is immutable for
the lifetime of the
[DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


However, it is possible that the resource _identified_ by the [DID](https://www.w3.org/TR/did-1.0/#dfn-decentralized-identifiers),
the [DID subject](https://www.w3.org/TR/did-1.0/#dfn-did-subjects), may change over time. This is under the exclusive
authority of the [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers). For more details, see section [9.16 Persistence](https://www.w3.org/TR/did-1.0/#persistence).


### B.12 Changing the DID controller

[Permalink for Appendix B.12](https://www.w3.org/TR/did-1.0/#changing-the-did-controller)

The [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) for a [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents) might change over time.
However, depending on how it is implemented, a change in the [DID\\
controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) might not be made apparent by changes to the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents)
itself. For example, if the change is implemented through a shift in ownership
of the underlying cryptographic keys or other controls used for one or more of
the [verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) in the [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents), it might be
indistinguishable from a standard key rotation.


On the other hand, if the change is implemented by changing the value of the
[`controller`](https://www.w3.org/TR/did-1.0/#dfn-controller) property, it will be transparent.


If it is important to verify a change of [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers), implementers are
advised to [authenticate](https://www.w3.org/TR/did-1.0/#dfn-authenticated) the new [DID controller](https://www.w3.org/TR/did-1.0/#dfn-did-controllers) against the
[verification methods](https://www.w3.org/TR/did-1.0/#dfn-verification-method) in the revised [DID document](https://www.w3.org/TR/did-1.0/#dfn-did-documents).


## C. Revision History

[Permalink for Appendix C.](https://www.w3.org/TR/did-1.0/#revision-history)

This section contains the changes that have been made since the publication of
this specification as a W3C First Public Working Draft.


Changes since the [Second Candidate\\
Recommendation](https://www.w3.org/TR/2021/CR-did-core-20210615/) include:


- Non-normatively refer to the DID Resolution specification to guide implementers
  toward common DID URL implementation patterns.

- Elaborate upon when DID Documents are understood to start existing.

- Convert PNG diagrams to SVG diagrams.

- Rearrange order of Appendices to improve readability.

- Update the IANA guidance as a result of the IETF Media Type Maintenance
  Working Group efforts.

- Add links to use cases document.

- Add warning related to \[[MULTIBASE](https://www.w3.org/TR/did-1.0/#bib-multibase "The Multibase Encoding Scheme")\] and `publicKeyMultibase`.

- Remove at risk issue markers for features that gained enough implementation
  experience.

- Finalize the Editors, Authors, and Acknowledgements information.


Changes since the [First Candidate\\
Recommendation](https://www.w3.org/TR/2021/CR-did-core-20210318/) include:


- Addition of at risk markers to most of the DID Parameters, the data model
  datatypes that are expected to not be implemented, and the
  application/did+ld+json media type. This change resulted in the DID WG's
  decision to perform a second Candidate Recommendation phase. All other
  changes were either editorial or predicted in "at risk" issue markers.

- Removal of the at risk issue marker for the `method-specific-id` ABNF rule
  and for `nextUpdate` and `nextVersionId`.

- Clarification that `equivalentId` and `canonicalId` are optional.

- Addition of a definitions for "amplification attack" and "cryptographic suite".

- Replacement of `publicKeyBase58` with `publicKeyMultibase`.

- Updates to the DID Document examples section.

- A large number of editorial clean ups to the Security Considerations section.


Changes since the [First Public Working\\
Draft](https://www.w3.org/TR/2019/WD-did-core-20191107/) include:


- The introduction of an abstract data model that can be serialized to multiple
  representations including JSON and JSON-LD.

- The introduction of a DID Specifications Registry for the purposes of
  registering extension properties, representations, DID Resolution input
  metadata and output metadata, DID Document metadata, DID parameters, and DID
  Methods.

- Separation of DID Document metadata, such as created and updated values,
  from DID Document properties.

- The removal of embedded proofs in the DID Document.

- The addition of verification relationships for the purposes of authentication,
  assertion, key agreement, capability invocation and capability delegation.

- The ability to support relating multiple identifiers with the DID Document,
  such as the DID controller, also known as, equivalent IDs, and canonical IDs.

- Enhancing privacy by reducing information that could contain personally
  identifiable information in the DID Document.

- The addition of a large section on security considerations and privacy
  considerations.

- A Representations section that details how the abstract data model can be
  produced and consumed in a variety of different formats along with general
  rules for all representations, producers, and consumers.

- A section detailing the DID Resolution and DID URL Dereferencing interface
  definition that all DID resolvers are expected to expose as well as inputs
  and outputs to those processes.

- DID Document examples in an appendix that provide more complex examples of
  DID Document serializations.

- IANA Considerations for multiple representations specified in DID Core.

- Removal of the Future Work section as much of the work has now been
  accomplished.

- An acknowledgements section.


## D. Acknowledgements

[Permalink for Appendix D.](https://www.w3.org/TR/did-1.0/#acknowledgements)

The Working Group extends deep appreciation and heartfelt thanks to our Chairs
Brent Zundel and Dan Burnett, as well as our W3C Staff Contact, Ivan Herman, for
their tireless work in keeping the Working Group headed in a productive
direction and navigating the deep and dangerous waters of the standards process.


The Working Group gratefully acknowledges the work that led to the creation of
this specification, and extends sincere appreciation to those individuals that
worked on technologies and specifications that deeply influenced our work. In
particular, this includes the work of Phil Zimmerman, Jon Callas, Lutz
Donnerhacke, Hal Finney, David Shaw, and Rodney Thayer on [Pretty Good Privacy\\
(PGP)](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) in the 1990s and 2000s.


In the mid-2010s, preliminary implementations of what would become Decentralized
Identifiers were [built](https://web-payments.org/minutes/2014-05-07/#topic-1) in collaboration with Jeremie Miller's Telehash project and the W3C
Web Payments Community Group's work led by Dave Longley and Manu Sporny. Around
a year later, the XDI.org Registry Working Group
[began exploring](https://docs.google.com/document/d/1EP-KhH60y-nl4xkEzoeSf3DjmjLomfboF4p2umF51FA/) decentralized technologies for replacing its existing
identifier registry. Some of the first
[written](https://github.com/WebOfTrustInfo/rwot1-sf/blob/master/final-documents/dpki.pdf) [papers](https://github.com/WebOfTrustInfo/rwot2-id2020/blob/master/final-documents/requirements-for-dids.pdf)
exploring the concept of Decentralized Identifiers can be traced back to the
first several Rebooting the Web of Trust workshops convened by Christopher
Allen. That work led to a key collaboration between Christopher Allen, Drummond
Reed, Les Chasen, Manu Sporny, and Anil John. Anil saw promise in the technology
and allocated the initial set of government funding to explore the space.
Without the support of Anil John and his guidance through the years, it is
unlikely that Decentralized Identifiers would be where they are today. Further
refinement at the Rebooting the Web of Trust workshops led to the [first\\
implementers documentation](https://github.com/WebOfTrustInfo/rwot3-sf/blob/master/final-documents/did-implementer-draft-10.pdf), edited by Drummond Reed, Les Chasen, Christopher
Allen, and Ryan Grant. Contributors included Manu Sporny, Dave Longley, Jason
Law, Daniel Hardman, Markus Sabadello, Christian Lundkvist, and Jonathan
Endersby. This initial work was then merged into the W3C Credentials Community
Group, incubated further, and then transitioned to the W3C Decentralized
Identifiers Working Group for global standardization.


Portions of the work on this specification have been funded by the United States
Department of Homeland Security's (US DHS) Science and Technology Directorate
under contracts HSHQDC-16-R00012-H-SB2016-1-002, and HSHQDC-17-C-00019, as well
as the US DHS Silicon Valley Innovation Program under contracts
70RSAT20T00000010, 70RSAT20T00000029, 70RSAT20T00000030, 70RSAT20T00000045,
70RSAT20T00000003, and 70RSAT20T00000033. The content of this specification does
not necessarily reflect the position or the policy of the U.S. Government and no
official endorsement should be inferred.


Portions of the work on this specification have also been funded by the European
Union's StandICT.eu program under sub-grantee contract number CALL05/19. The
content of this specification does not necessarily reflect the position or the
policy of the European Union and no official endorsement should be inferred.


Work on this specification has also been supported by the [Rebooting the Web of Trust](https://www.weboftrust.info/) community
facilitated by Christopher Allen, Shannon Appelcline, Kiara Robles, Brian
Weller, Betty Dhamers, Kaliya Young, Kim Hamilton Duffy, Manu Sporny, Drummond
Reed, Joe Andrieu, and Heather Vescent. Development of this specification has
also been supported by the [W3C Credentials\\
Community Group](https://w3c-ccg.github.io/), which has been Chaired by Kim Hamilton Duffy, Joe Andrieu,
Christopher Allen, Heather Vescent, and Wayne Chang. The participants in the
Internet Identity Workshop, facilitated by Phil Windley, Kaliya Young, Doc
Searls, and Heidi Nobantu Saul, also supported this work through numerous
working sessions designed to debate, improve, and educate participants about
this specification.


The Working Group thanks the following individuals for their contributions to
this specification (in alphabetical order, Github handles start with `@` and
are sorted as last names): Denis Ah-Kang, Nacho Alamillo, Christopher Allen, Joe
Andrieu, Antonio, Phil Archer, George Aristy, Baha, Juan Benet, BigBlueHat, Dan
Bolser, Chris Boscolo, Pelle Braendgaard, Daniel Buchner, Daniel Burnett, Juan
Caballero, @cabo, Tim Cappalli, Melvin Carvalho, David Chadwick, Wayne Chang,
Sam Curren, Hai Dang, Tim Daubenschütz, Oskar van Deventer, Kim Hamilton Duffy,
Arnaud Durand, Ken Ebert, Veikko Eeva, @ewagner70, Carson Farmer, Nikos Fotiou,
Gabe, Gayan, @gimly-jack, @gjgd, Ryan Grant, Peter Grassberger, Adrian Gropper,
Amy Guy, Daniel Hardman, Kyle Den Hartog, Philippe Le Hegaret, Ivan Herman,
Michael Herman, Alen Horvat, Dave Huseby, Marcel Jackisch, Mike Jones, Andrew
Jones, Tom Jones, jonnycrunch, Gregg Kellogg, Michael Klein, @kdenhartog-sybil1,
Paul Knowles, @ktobich, David I. Lehn, Charles E. Lehner, Michael Lodder,
@mooreT1881, Dave Longley, Tobias Looker, Wolf McNally, Robert Mitwicki, Mircea
Nistor, Grant Noble, Mark Nottingham, @oare, Darrell O'Donnell, Vinod Panicker,
Dirk Porsche, Praveen, Mike Prorock, @pukkamustard, Drummond Reed, Julian
Reschke, Yancy Ribbens, Justin Richer, Rieks, @rknobloch, Mikeal Rogers,
Evstifeev Roman, Troy Ronda, Leonard Rosenthol, Michael Ruminer, Markus
Sabadello, Cihan Saglam, Samu, Rob Sanderson, Wendy Seltzer, Mehran Shakeri,
Jaehoon (Ace) Shim, Samuel Smith, James M Snell, SondreB, Manu Sporny, @ssstolk,
Orie Steele, Shigeya Suzuki, Sammotic Switchyarn, @tahpot, Oliver Terbu, Ted
Thibodeau Jr., Joel Thorstensson, Tralcan, Henry Tsai, Rod Vagg, Mike Varley,
Kaliya "Identity Woman" Young, Eric Welton, Fuqiao Xue, @Yue, Dmitri Zagidulin,
@zhanb, and Brent Zundel.


## E. IANA Considerations

[Permalink for Appendix E.](https://www.w3.org/TR/did-1.0/#iana-considerations)

This section will be submitted to the Internet Engineering Steering Group
(IESG) for review, approval, and registration with IANA when this specification
becomes a W3C Proposed Recommendation.


### E.1 application/did+json

[Permalink for Appendix E.1](https://www.w3.org/TR/did-1.0/#application-did-json)

Type name:applicationSubtype name:did+jsonRequired parameters:NoneOptional parameters:NoneEncoding considerations:
See [RFC 8259, section 11](https://www.rfc-editor.org/rfc/rfc8259#section-11).
 Security considerations:
See [RFC 8259, section 12](https://www.rfc-editor.org/rfc/rfc8259#section-12) \[[RFC8259](https://www.w3.org/TR/did-1.0/#bib-rfc8259 "The JavaScript Object Notation (JSON) Data Interchange Format")\].
 Interoperability considerations:Not ApplicablePublished specification:https://www.w3.org/TR/did-core/Applications that use this media type:
Any application that requires an identifier that is decentralized, persistent,
cryptographically verifiable, and resolvable. Applications typically consist of
cryptographic identity systems, decentralized networks of devices, and
websites that issue or verify W3C Verifiable Credentials.
 Additional information:Magic number(s):Not ApplicableFile extension(s):.didjsonMacintosh file type code(s):TEXTPerson & email address to contact for further information:Ivan Herman <ivan@w3.org>Intended usage:CommonRestrictions on usage:NoneAuthor(s):
Drummond Reed, Manu Sporny, Markus Sabadello, Dave Longley, Christopher Allen
 Change controller:W3C

Fragment identifiers used with [application/did+json](https://www.w3.org/TR/did-1.0/#application-did-json) are treated according to
the rules defined in [Fragment](https://www.w3.org/TR/did-1.0/#fragment).


### E.2 application/did+ld+json

[Permalink for Appendix E.2](https://www.w3.org/TR/did-1.0/#application-did-ld-json)

Note: IETF Structured Media Types

The Candidate Recommendation phase for this specification received a significant
number of implementations for the `application/did+ld+json` media
type. Registration of the media type `application/did+ld+json` at
IANA is pending resolution of the [Media Types with Multiple Suffixes](https://datatracker.ietf.org/doc/html/draft-w3cdidwg-media-types-with-multiple-suffixes) issue. Work is expected to continue in
the [IETF Media Type\\
Maintenance Working Group](https://datatracker.ietf.org/wg/mediaman/about/) with a registration of the
`application/did+ld+json` media type by W3C following shortly after
the publication of the [Media Types with Multiple Suffixes](https://datatracker.ietf.org/doc/html/draft-w3cdidwg-media-types-with-multiple-suffixes) RFC.


Type name:applicationSubtype name:did+ld+jsonRequired parameters:NoneOptional parameters:NoneEncoding considerations:
See [RFC 8259, section 11](https://www.rfc-editor.org/rfc/rfc8259#section-11).
 Security considerations:
See [JSON-LD 1.1, Security Considerations](https://www.w3.org/TR/json-ld11/#security)
\[[JSON-LD11](https://www.w3.org/TR/did-1.0/#bib-json-ld11 "JSON-LD 1.1")\].
 Interoperability considerations:Not ApplicablePublished specification:https://www.w3.org/TR/did-core/Applications that use this media type:
Any application that requires an identifier that is decentralized, persistent,
cryptographically verifiable, and resolvable. Applications typically consist of
cryptographic identity systems, decentralized networks of devices, and
websites that issue or verify W3C Verifiable Credentials.
 Additional information:Magic number(s):Not ApplicableFile extension(s):.didjsonldMacintosh file type code(s):TEXTPerson & email address to contact for further information:Ivan Herman <ivan@w3.org>Intended usage:CommonRestrictions on usage:NoneAuthor(s):
Drummond Reed, Manu Sporny, Markus Sabadello, Dave Longley, Christopher Allen
 Change controller:W3C

Fragment identifiers used with
[application/did+ld+json](https://www.w3.org/TR/did-1.0/#application-did-ld-json) are treated
according to the rules associated with the
[JSON-LD 1.1: application/ld+json\\
media type](https://www.w3.org/TR/json-ld11/#iana-considerations) \[[JSON-LD11](https://www.w3.org/TR/did-1.0/#bib-json-ld11 "JSON-LD 1.1")\].


## F. References

[Permalink for Appendix F.](https://www.w3.org/TR/did-1.0/#references)

### F.1 Normative references

[Permalink for Appendix F.1](https://www.w3.org/TR/did-1.0/#normative-references)

\[INFRA\][Infra Standard](https://infra.spec.whatwg.org/). Anne van Kesteren; Domenic Denicola. WHATWG. Living Standard. URL: [https://infra.spec.whatwg.org/](https://infra.spec.whatwg.org/)\[JSON-LD11\][JSON-LD 1.1](https://www.w3.org/TR/json-ld11/). Gregg Kellogg; Pierre-Antoine Champin; Dave Longley. W3C. 16 July 2020. W3C Recommendation. URL: [https://www.w3.org/TR/json-ld11/](https://www.w3.org/TR/json-ld11/)\[RFC2119\][Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119). S. Bradner. IETF. March 1997. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc2119](https://www.rfc-editor.org/rfc/rfc2119)\[RFC3552\][Guidelines for Writing RFC Text on Security Considerations](https://www.rfc-editor.org/rfc/rfc3552). E. Rescorla; B. Korver. IETF. July 2003. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc3552](https://www.rfc-editor.org/rfc/rfc3552)\[RFC3986\][Uniform Resource Identifier (URI): Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986). T. Berners-Lee; R. Fielding; L. Masinter. IETF. January 2005. Internet Standard. URL: [https://www.rfc-editor.org/rfc/rfc3986](https://www.rfc-editor.org/rfc/rfc3986)\[RFC5234\][Augmented BNF for Syntax Specifications: ABNF](https://www.rfc-editor.org/rfc/rfc5234). D. Crocker, Ed.; P. Overell. IETF. January 2008. Internet Standard. URL: [https://www.rfc-editor.org/rfc/rfc5234](https://www.rfc-editor.org/rfc/rfc5234)\[RFC7517\][JSON Web Key (JWK)](https://www.rfc-editor.org/rfc/rfc7517). M. Jones. IETF. May 2015. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc7517](https://www.rfc-editor.org/rfc/rfc7517)\[RFC7638\][JSON Web Key (JWK) Thumbprint](https://www.rfc-editor.org/rfc/rfc7638). M. Jones; N. Sakimura. IETF. September 2015. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc7638](https://www.rfc-editor.org/rfc/rfc7638)\[RFC8174\][Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://www.rfc-editor.org/rfc/rfc8174). B. Leiba. IETF. May 2017. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc8174](https://www.rfc-editor.org/rfc/rfc8174)\[RFC8259\][The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259). T. Bray, Ed.. IETF. December 2017. Internet Standard. URL: [https://www.rfc-editor.org/rfc/rfc8259](https://www.rfc-editor.org/rfc/rfc8259)\[url\][URL Standard](https://url.spec.whatwg.org/). Anne van Kesteren. WHATWG. Living Standard. URL: [https://url.spec.whatwg.org/](https://url.spec.whatwg.org/)\[XMLSCHEMA11-2\][W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes](https://www.w3.org/TR/xmlschema11-2/). David Peterson; Sandy Gao; Ashok Malhotra; Michael Sperberg-McQueen; Henry Thompson; Paul V. Biron et al. W3C. 5 April 2012. W3C Recommendation. URL: [https://www.w3.org/TR/xmlschema11-2/](https://www.w3.org/TR/xmlschema11-2/)

### F.2 Informative references

[Permalink for Appendix F.2](https://www.w3.org/TR/did-1.0/#informative-references)

\[DID-RESOLUTION\][Decentralized Identifier Resolution](https://w3c-ccg.github.io/did-resolution/). Markus Sabadello; Dmitri Zagidulin. Credentials Community Group. Draft Community Group Report. URL: [https://w3c-ccg.github.io/did-resolution/](https://w3c-ccg.github.io/did-resolution/)\[DID-RUBRIC\][Decentralized Characteristics Rubric v1.0](https://w3c.github.io/did-rubric/). Joe Andrieu. Credentials Community Group. Draft Community Group Report. URL: [https://w3c.github.io/did-rubric/](https://w3c.github.io/did-rubric/)\[DID-SPEC-REGISTRIES\][DID Specification Registries](https://www.w3.org/TR/did-spec-registries/). Orie Steele; Manu Sporny; Michael Prorock. W3C. 28 June 2022. W3C Working Group Note. URL: [https://www.w3.org/TR/did-spec-registries/](https://www.w3.org/TR/did-spec-registries/)\[DID-USE-CASES\][Use Cases and Requirements for Decentralized Identifiers](https://www.w3.org/TR/did-use-cases/). Joe Andrieu; Phil Archer; Kim Duffy; Ryan Grant; Adrian Gropper. W3C. 17 March 2021. W3C Working Group Note. URL: [https://www.w3.org/TR/did-use-cases/](https://www.w3.org/TR/did-use-cases/)\[DNS-DID\][The Decentralized Identifier (DID) in the DNS](https://datatracker.ietf.org/doc/draft-mayrhofer-did-dns/). Alexander Mayrhofer; Dimitrij Klesev; Markus Sabadello. February 2019. Internet-Draft. URL: [https://datatracker.ietf.org/doc/draft-mayrhofer-did-dns/](https://datatracker.ietf.org/doc/draft-mayrhofer-did-dns/)\[HASHLINK\][Cryptographic Hyperlinks](https://tools.ietf.org/html/draft-sporny-hashlink-05). Manu Sporny. IETF. December 2018. Internet-Draft. URL: [https://tools.ietf.org/html/draft-sporny-hashlink-05](https://tools.ietf.org/html/draft-sporny-hashlink-05)\[IANA-URI-SCHEMES\][Uniform Resource Identifier (URI) Schemes](https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml). IANA. URL: [https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml](https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml)\[MATRIX-URIS\][Matrix URIs - Ideas about Web Architecture](https://www.w3.org/DesignIssues/MatrixURIs.html). Tim Berners-Lee. December 1996. Personal View. URL: [https://www.w3.org/DesignIssues/MatrixURIs.html](https://www.w3.org/DesignIssues/MatrixURIs.html)\[MULTIBASE\][The Multibase Encoding Scheme](https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03). Juan Benet; Manu Sporny. IETF. February 2021. Internet-Draft. URL: [https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03](https://datatracker.ietf.org/doc/html/draft-multiformats-multibase-03)\[PRIVACY-BY-DESIGN\][Privacy by Design](https://iapp.org/media/pdf/resource_center/pbd_implement_7found_principles.pdf). Ann Cavoukian. Information and Privacy Commissioner. 2011. URL: [https://iapp.org/media/pdf/resource\_center/pbd\_implement\_7found\_principles.pdf](https://iapp.org/media/pdf/resource_center/pbd_implement_7found_principles.pdf)\[RFC4122\][A Universally Unique IDentifier (UUID) URN Namespace](https://www.rfc-editor.org/rfc/rfc4122). P. Leach; M. Mealling; R. Salz. IETF. July 2005. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc4122](https://www.rfc-editor.org/rfc/rfc4122)\[RFC6901\][JavaScript Object Notation (JSON) Pointer](https://www.rfc-editor.org/rfc/rfc6901). P. Bryan, Ed.; K. Zyp; M. Nottingham, Ed.. IETF. April 2013. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc6901](https://www.rfc-editor.org/rfc/rfc6901)\[RFC6973\][Privacy Considerations for Internet Protocols](https://www.rfc-editor.org/rfc/rfc6973). A. Cooper; H. Tschofenig; B. Aboba; J. Peterson; J. Morris; M. Hansen; R. Smith. IETF. July 2013. Informational. URL: [https://www.rfc-editor.org/rfc/rfc6973](https://www.rfc-editor.org/rfc/rfc6973)\[RFC7230\][Hypertext Transfer Protocol (HTTP/1.1): Message Syntax and Routing](https://httpwg.org/specs/rfc7230.html). R. Fielding, Ed.; J. Reschke, Ed.. IETF. June 2014. Proposed Standard. URL: [https://httpwg.org/specs/rfc7230.html](https://httpwg.org/specs/rfc7230.html)\[RFC7231\][Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://httpwg.org/specs/rfc7231.html). R. Fielding, Ed.; J. Reschke, Ed.. IETF. June 2014. Proposed Standard. URL: [https://httpwg.org/specs/rfc7231.html](https://httpwg.org/specs/rfc7231.html)\[RFC8141\][Uniform Resource Names (URNs)](https://www.rfc-editor.org/rfc/rfc8141). P. Saint-Andre; J. Klensin. IETF. April 2017. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc8141](https://www.rfc-editor.org/rfc/rfc8141)\[VC-DATA-MODEL\][Verifiable Credentials Data Model v1.1](https://www.w3.org/TR/vc-data-model/). Manu Sporny; Grant Noble; Dave Longley; Daniel Burnett; Brent Zundel; Kyle Den Hartog. W3C. 3 March 2022. W3C Recommendation. URL: [https://www.w3.org/TR/vc-data-model/](https://www.w3.org/TR/vc-data-model/)