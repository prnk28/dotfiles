
## Abstract

Secure Payment Confirmation (SPC) is a Web API to support streamlined
authentication during a payment transaction. It is designed to scale authentication
across merchants, to be used within a wide range of authentication protocols, and
to produce cryptographic evidence that the user has confirmed transaction details.

## Status of this document

_This section describes the status of this document at the time of its publication. A list of current W3C publications and the latest revision of this technical report can be found in the [W3C technical reports index](https://www.w3.org/TR/) at https://www.w3.org/TR/._

This document was published by the [Web Payments Working Group](https://www.w3.org/groups/wg/payments) as a Candidate Recommendation Draft using the [Recommendation track](https://www.w3.org/2023/Process-20231103/#recs-and-notes).

For changes since the previous Candidate Recommendation Snapshot, see the [GitHub changelog](https://github.com/w3c/secure-payment-confirmation/compare/CR...main).

Publication as a Candidate Recommendation does not imply endorsement by W3C and its Members. A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.

This is a draft document and may be updated, replaced or obsoleted by other documents at any time. It is inappropriate to cite this document as other than work in progress.

For this specification to move to Proposed Recommendation we must show two independent, interoperable implementations in user agents; see the related [implementation report](https://wpt.fyi/results/secure-payment-confirmation/).

This Candidate Recommendation is not expected to advance to Proposed Recommendation any earlier than 01 August 2023.

The Web Payments Working Group maintains an [issues list](https://github.com/w3c/secure-payment-confirmation/issues).

Publication as a Candidate Recommendation does not imply endorsement by W3C and its Members. A Candidate Recommendation Draft integrates changes from the previous Candidate Recommendation that the Working Group intends to include in a subsequent Candidate Recommendation Snapshot.

This document was produced by a group operating under the [W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy/). W3C maintains a [public list of any patent disclosures](https://www.w3.org/groups/wg/payments/ipr) made in connection with the deliverables of the group; that page also includes instructions for disclosing a patent. An individual who has actual knowledge of a patent which the individual believes contains [Essential Claim(s)](https://www.w3.org/Consortium/Patent-Policy/#def-essential) must disclose the information in accordance with [section 6 of the W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure).

This document is governed by the [03 November 2023 W3C Process Document](https://www.w3.org/2023/Process-20231103/).

## 1\. Introduction

_This section and its sub-sections are non-normative._

This specification defines an API that enables the use of strong authentication
methods in payment flows on the web. It aims to provide the same authentication
benefits and user privacy focus as [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3") with enhancements to meet the
needs of payment processing.

Similarly to [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3"), this specification defines two related processes
involving a user. The first is [§ 3 Registration](https://www.w3.org/TR/secure-payment-confirmation/#sctn-registration) (formerly "enrollment"),
where a relationship is created between the user and the [Relying Party](https://w3c.github.io/webauthn/#relying-party). The
second is [§ 4 Authentication](https://www.w3.org/TR/secure-payment-confirmation/#sctn-authentication), where the user responds to a challenge from
the [Relying Party](https://w3c.github.io/webauthn/#relying-party) (possibly via an intermediary payment service provider)
to consent to a specific payment.

It is a goal of this specification to reduce authentication friction during
checkout, and one aspect of that is to maximize the number of authentications
that the user can perform for a given registration. That is, with consent
from the [Relying Party](https://w3c.github.io/webauthn/#relying-party), ideally the user could "register once" and
authenticate on any merchant origin (and via payment service provider),
not just the merchant origin where the user first registered.

To that end, an important feature of Secure Payment Confirmation is
that the merchant (or another entity) may initiate the authentication
ceremony on the [Relying Party’s](https://w3c.github.io/webauthn/#relying-party) behalf. The [Relying Party](https://w3c.github.io/webauthn/#relying-party) must
opt-in to allowing this behavior during credential creation.

Functionally, this specification defines a new [payment method](https://w3c.github.io/payment-request/#dfn-payment-method) for the `PaymentRequest` API, and adds a [WebAuthn Extension](https://w3c.github.io/webauthn/#webauthn-extensions) to extend [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3") with payment-specific datastructures and to relax assumptions to
allow the API to be called in payment contexts.

### 1.1. Use Cases

Although [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3") provides general authentication capabilities for the
Web, the following use cases illustrate the value of the payment-specific
extension defined in this specification.

We presume that the general use case of cryptographic-based authentication for
online transactions is well established.

#### 1.1.1. Cryptographic evidence of transaction confirmation

In many online payment systems, it is common for the entity (e.g., bank) that
issues a payment instrument to seek to reduce fraud through authentication. [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3") and this specification make it possible to use authenticators to
cryptographically sign important payment-specific information such as the
origin of the merchant and the transaction amount and currency. The bank, as
the [Relying Party](https://w3c.github.io/webauthn/#relying-party), can then verify the signed payment-specific information
as part of the decision to authorize the payment.

If the bank uses plain [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3"), the payment-specific information to be
verified must be stored in the WebAuthn `challenge`. This raises several issues:

1. It is a misuse of the `challenge` field (which is intended to defeat replay
attacks).

2. There is no specification for this, so each bank is likely to have
to devise its own format for how payment-specific information should be
formatted and encoded in the challenge, complicating deployment and
increasing fragmentation.

3. Regulations may require evidence that the user was shown and agreed to the
payment-specific information. Plain [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3") does not provide for
this display: there is no specified UX associated with information stored
in the `challenge` field.


These limitations motivate the following Secure Payment Confirmation behaviors:

1. The `challenge` field is only used to defeat replay attacks, as with plain [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3").

2. SPC specifies a format for payment-specific information. This will enable
development of generic verification code and test suites.

3. SPC guarantees that the user agent has presented the payment-specific
information to the user in a way that a malicious website (or maliciously
introduced JavaScript code on a trusted website) cannot bypass.


   - The payment-specific information is included in the `CollectedClientData` dictionary, which cannot be tampered with via
     JavaScript.


NOTE: Banks and other stakeholders in the payments ecosystem trust payments
via browsers sufficiently today using TLS, iframes, and other Web features.
The current specification is designed to increase the security and usability
of Web payments.

#### 1.1.2. Merchant control of authentication

Merchants seek to avoid user drop-off during checkout, in particular by
reducing authentication friction. A [Relying Party](https://w3c.github.io/webauthn/#relying-party) (e.g., a bank) that
wishes to use [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3") to authenticate the user typically does so from an
iframe. However, merchants would prefer to manage the user experience of
authenticating the user while still enabling the [Relying Party](https://w3c.github.io/webauthn/#relying-party) to verify
the results of authentication.

This limitation motivates the following Secure Payment Confirmation behavior:

- With SPC, other parties than the [Relying Party](https://w3c.github.io/webauthn/#relying-party) can use authentication
credentials _on behalf of_ the Relying Party. The Relying Party can then
verify the authentication results.


An additional benefit of this feature to Relying Parties is that they no longer
need to build their own front-end experiences for authentication. Instead,
payment service providers are likely to build them on behalf of merchants.

NOTE: Relying Parties that wish to provide the authentication user experience
may still do so using SPC from an iframe.

### 1.2. Sample API Usage Scenarios

In this section, we walk through some scenarios for Secure Payment Confirmation
and the corresponding sample code for using this API. Note that these are
example flows and do not limit the scope of how the API can be used.

#### 1.2.1. Registration during a checkout

This is a first-time flow, in which a new credential is created and stored by
an issuing bank during a checkout by the user on some merchant.

1. The user visits `merchant.com`, selects an item to purchase, and proceeds to
the checkout flow. They enter their payment instrument details, and indicate
that they wish to pay (e.g., by pressing a "Pay" button).

2. The merchant communicates out-of-band (e.g., using another protocol) with the
bank that issued the payment instrument. The issuing bank requests
verification of the user, and provides a bank-controlled URL for the
merchant to open in an iframe.

3. The merchant opens an iframe to `bank.com`, with the `allow` attribute set to
" [publickey-credentials-create](https://www.w3.org/TR/webauthn-3/#publickey-credentials-create-feature)".

4. In the iframe, the issuing bank confirms the user’s identity via a
traditional means (e.g., SMS OTP). After confirmation, the bank invites the
user to register in SPC authentication for future payments.

5. The user consents (e.g., by clicking an "Register" button in the bank UX),
and the bank runs code in the iframe (see example below).

6. The user goes through a WebAuthn registration flow. A new credential is
created and returned to the issuing bank who stores it in their server-side
database associated with the user and payment instrument(s).

7. The verification completes; the bank iframe closes and the merchant finishes
the checkout process for the user.


Sample code for registering the user in this way follows:

```
if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */ }

const publicKey = {
  // The challenge should be created by the bank server and sent to the iframe.
  challenge: new Uint8Array([21,31,105 /* 29 more random bytes generated by the server */]),

  // Relying Party:
  rp: {
    name: "Fancy Bank",
  },

  // User:
  user: {
    // Part of WebAuthn. This information is not required by SPC
    // but may be used by the bank server to identify this user in
    // future transactions. Inconsistent values for the same user
    // can result in the creation of multiple credentials for the user
    // and thus potential UX friction due to credential selection.
    id: Uint8Array.from(window.atob("MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII="), c=>c.charCodeAt(0)),
    name: "jane.doe@example.com",
    displayName: "Jane Doe",
  },

  // In this example the Relying Party accepts either an ES256 or RS256
  // credential, but prefers an ES256 credential.
  pubKeyCredParams: [\
    {\
      type: "public-key",\
      alg: -7 // "ES256"\
    },\
    {\
      type: "public-key",\
      alg: -257 // "RS256"\
    }\
  ],

  authenticatorSelection: {
    userVerification: "required",
    residentKey: "required",
    authenticatorAttachment: "platform",
  },

  timeout: 360000,  // 6 minutes

  // Indicate that this is an SPC credential. This is currently required so
  // that the browser knows this credential relates to SPC. It also enables
  // credential creation in a cross-origin iframe, which is required for this
  // example.
  //
  // A future version of the spec may remove the need for this extension.
  extensions: {
    "payment": {
      isPayment: true,
    }
  }
};

// Note: The following call will cause the authenticator to display UI.
navigator.credentials.create({ publicKey })
  .then(function (newCredentialInfo) {
    // Send new credential info to server for verification and registration.
  }).catch(function (err) {
    // No acceptable authenticator or user refused consent. Handle appropriately.
  });

```

#### 1.2.2. Authentication on merchant site

This is the flow when a user with an already registered credential is
performing a transaction and the issuing bank and merchant wish to use Secure
Payment Confirmation.

1. The user visits `merchant.com`, selects an item to purchase, and proceeds
   to the checkout flow. They enter their payment instrument details, and
   indicate that they wish to pay (e.g., by pressing a "Pay" button).

2. The merchant communicates out-of-band with the issuing bank of the payment
   instrument (e.g., using another protocol). The issuing bank requests
   verification of the user, and at the same time informs the merchant that it
   accepts SPC by providing the information necessary to use the API. This
   information includes a challenge and any credential IDs associated with this
   user and payment instrument(s).

3. The merchant runs the example code shown below.

4. The user agrees to the payment-specific information displayed in the SPC UX,
   and performs a subsequent WebAuthn authentication ceremony. The signed
   cryptogram is returned to the merchant.

5. The merchant communicates the signed cryptogram to the issuing bank
   out-of-band. The issuing bank verifies the cryptogram, and knows that the
   user is valid, what payment-specific information has been displayed, and
   that the user has consented to the transaction. The issuing bank authorizes
   the transaction and the merchant finishes the checkout process for the user.


The sample code for authenticating the user follows. Note that the example code
presumes access to await/async, for easier to read promise handling.

```
/* isSecurePaymentConfirmationAvailable indicates whether the browser */
/* supports SPC. It does not indicate whether the user has a credential */
/* ready to go on this device. */
const spcAvailable =
  PaymentRequest &&
  PaymentRequest.isSecurePaymentConfirmationAvailable &&
  await PaymentRequest.isSecurePaymentConfirmationAvailable();
if (!spcAvailable) {
  /* Browser does not support SPC; merchant should fallback to traditional flows. */
}

const request = new PaymentRequest([{\
  supportedMethods: "secure-payment-confirmation",\
  data: {\
    // List of credential IDs obtained from the bank.\
    credentialIds,\
\
    rpId: "fancybank.com",\
\
    // The challenge is also obtained from the bank.\
    challenge: new Uint8Array([21,31,105 /* 29 more random bytes generated by the bank */]),\
\
    instrument: {\
      displayName: "Fancy Card ****1234",\
      icon: "https://fancybank.com/card-art.png",\
    },\
\
    payeeName: "Merchant Shop",\
    payeeOrigin: "https://merchant.com",\
\
    // Caller’s requested localized experience\
    locale: ["en"],\
\
    timeout: 360000,  // 6 minutes\
  }], {
    total: {
      label: "Total",
      amount: {
        currency: "USD",
        value: "5.00",
      },
    },
  });

try {
  const response = await request.show();
  await response.complete('success');

  // response.data is a PublicKeyCredential, with a clientDataJSON that
  // contains the transaction data for verification by the issuing bank.

  /* send response.data to the issuing bank for verification */
} catch (err) {
  /* SPC cannot be used; merchant should fallback to traditional flows */
}

```

## 2\. Terminology

SPC Credential

A [WebAuthn credential](https://w3c.github.io/webauthn/#public-key-credential) that can be used for the
behaviors defined in this specification.

This specification does not intend to limit how SPC credentials may (or may
not) be used by a [Relying Party](https://w3c.github.io/webauthn/#relying-party) for other authentication flows (e.g.,
login).

Note: The current version of this specification requires the [Relying Party](https://w3c.github.io/webauthn/#relying-party) to explicitly opt in for a credential to be used in
either a first-party or third-party context. Longer-term, our
intention is that all [WebAuthn credentials](https://w3c.github.io/webauthn/#public-key-credential) will be usable for SPC in a first-party context (e.g., on the [Relying Party’s](https://w3c.github.io/webauthn/#relying-party) domain) and opt-in will only be required to allow
a credential to be used by a third-party.

Third-party enabled SPC Credential

An [SPC Credential](https://www.w3.org/TR/secure-payment-confirmation/#spc-credential) where the [Relying Party](https://w3c.github.io/webauthn/#relying-party) has explicitly opted in at
credential creation time to allow use of the credential in a Secure Payment
Confirmation authentication by a party other than the [Relying Party](https://w3c.github.io/webauthn/#relying-party).

Steps to silently determine if an SPC Credential is third-party enabled

An as-yet undefined process by which a user agent can, given a [Relying Party Identifier](https://w3c.github.io/webauthn/#relying-party-identifier) and a [credential ID](https://w3c.github.io/webauthn/#credential-id), silently (i.e.,
without user interaction) determine if the credential represented by that ID
is a [third-party enabled SPC Credential](https://www.w3.org/TR/secure-payment-confirmation/#third-party-enabled-spc-credential).

NOTE: See [WebAuthn\\
issue 1667](https://github.com/w3c/webauthn/issues/1667).

Steps to silently determine if a credential is available for the current device

An as-yet undefined process by which a user agent can, given a [Relying Party Identifier](https://w3c.github.io/webauthn/#relying-party-identifier) and a [credential ID](https://w3c.github.io/webauthn/#credential-id), silently (i.e.,
without user interaction) determine if the credential represented by that
credential ID is available for the current device (i.e., could be
successfully used as part of a WebAuthn [Get](https://www.w3.org/TR/webauthn-3/#sctn-getAssertion) call).

This allows the user agent to only conditionally display [the transaction UX](https://www.w3.org/TR/secure-payment-confirmation/#sctn-transaction-confirmation-ux) to the user if
there is some chance that they can successfully complete the transaction.

NOTE: This property will likely require that [SPC Credentials](https://www.w3.org/TR/secure-payment-confirmation/#spc-credential) be [discoverable](https://w3c.github.io/webauthn/#discoverable-credential); as such this specification
currently encodes that as a requirement.

NOTE: This property is very similar to that which is required for the [WebAuthn Conditional UI Proposal](https://github.com/w3c/webauthn/issues/1545). It is likely that both it and SPC could
be supported by the same underlying API.

## 3\. Registration

To register a user for Secure Payment Confirmation, relying parties should call `navigator.credentials.create()`, with the `payment` [WebAuthn Extension](https://w3c.github.io/webauthn/#webauthn-extensions) specified.

Tests

- [enrollment.https.html](https://wpt.fyi/results/secure-payment-confirmation/enrollment.https.html "secure-payment-confirmation/enrollment.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/enrollment.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/enrollment.https.html)
- [enrollment-in-iframe.sub.https.html](https://wpt.fyi/results/secure-payment-confirmation/enrollment-in-iframe.sub.https.html "secure-payment-confirmation/enrollment-in-iframe.sub.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/enrollment-in-iframe.sub.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/enrollment-in-iframe.sub.https.html)

Note: In this specification we define an extension in order to allow
the browser to cache SPC credential IDs in the absence of [Conditional UI](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-conditional-ui "WebAuthn Conditional UI Proposal"). If this capability is
available in future versions of WebAuthn, we may remove the requirement
for the extension from SPC. Note that SPC credentials (with the extension)
are otherwise full-fledged WebAuthn credentials.

Note: At registration time, Web Authentication requires both `name` and `displayName`, although per the
definition of the [user member](https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-user), implementations are not
required to display either of them in subsequent authentication
ceremonies. Of the two, as of October 2023 `name` is shown more
consistently. Developers should continue to monitor
implementations.

## 4\. Authentication

To authenticate a payment via Secure Payment Confirmation, this specification
defines a new [payment method](https://w3c.github.io/payment-request/#dfn-payment-method), " [secure-payment-confirmation](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation)". This
payment method confirms the transaction with the user and then performs an [authentication ceremony](https://w3c.github.io/webauthn/#authentication-ceremony) to authenticate the user and create a signed blob
representing the authentication ceremony.

At a high level, authentication for Secure Payment Confirmation is similar to [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3"), with one major conceptual shift. Secure Payment Confirmation
allows a third-party (e.g., the merchant) to trigger an authentication ceremony
on behalf of the [Relying Party](https://w3c.github.io/webauthn/#relying-party), passing in credentials that it has obtained
from the Relying Party on some other unspecified channel. See [§ 1.1.2 Merchant control of authentication](https://www.w3.org/TR/secure-payment-confirmation/#sctn-use-case-merchant-authentication).

### 4.1. Payment Method: Secure Payment Confirmation

This specification defines a new [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler), the Secure Payment
Confirmation payment handler, which handles requests to authenticate a
given payment.

NOTE: To quickly support an initial SPC experiment, this API was designed atop
existing implementations of the Payment Request and Payment Handler APIs. There
is now general agreement to explore a design of SPC independent of Payment
Request. We therefore expect (without a concrete timeline) that SPC will move
away from its Payment Request origins. For developers, this should improve
feature detection, invocation, and other aspects of the API.

#### 4.1.1. Payment Method Identifier

The [standardized payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-standardized-payment-method-identifier) for the [Secure Payment Confirmation payment handler](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation-payment-handler) is "secure-payment-confirmation".

#### 4.1.2. Registration in [\[payment-method-id\]](https://www.w3.org/TR/secure-payment-confirmation/\#biblio-payment-method-id "Payment Method Identifiers")

Add the following to the [registry of standardized payment methods](https://w3c.github.io/payment-method-id/#registry) in [\[payment-method-id\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-payment-method-id "Payment Method Identifiers"):

" [secure-payment-confirmation](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation)"


The [Secure Payment Confirmation](https://w3c.github.io/secure-payment-confirmation/) specification.

#### 4.1.3. Modification of Payment Request constructor

In the steps for the `PaymentRequest object’s constructor`,
add a new step after step 4.3:

4. Process payment methods: _\[substeps 1-3 elided\]_
   4. If seenPMIs contains " [secure-payment-confirmation](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation)" and the size
      of seenPMIs is greater than 1, throw a `RangeError`.

#### 4.1.4. Modification of user activation requirement

In the steps for the `PaymentRequest.show()` method,
modify steps 2 and 3:

2. If the [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global) of [request](https://fetch.spec.whatwg.org/#concept-request) does not have [transient activation](https://html.spec.whatwg.org/multipage/interaction.html#transient-activation), the user agent MAY:
   1. Return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) with a `"SecurityError"` `DOMException`.
3. Otherwise, [consume user activation](https://html.spec.whatwg.org/multipage/interaction.html#consume-user-activation) of the [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global).


NOTE: This allows the user agent to not require user activation, for
example to support redirect authentication flows where a user activation
may not be present upon redirect. See [§ 10.3 Lack of user activation requirement](https://www.w3.org/TR/secure-payment-confirmation/#sctn-security-user-activation-requirement) for security considerations.

#### 4.1.5. `SecurePaymentConfirmationRequest` Dictionary

```
dictionary SecurePaymentConfirmationRequest {
    required BufferSource challenge;
    required USVString rpId;
    required sequence<BufferSource> credentialIds;
    required PaymentCredentialInstrument instrument;
    unsigned long timeout;
    USVString payeeName;
    USVString payeeOrigin;
    AuthenticationExtensionsClientInputs extensions;
    sequence<USVString> locale;
    boolean showOptOut;
};

```

The `SecurePaymentConfirmationRequest` dictionary contains the following
members:

`challenge` member,  of type [BufferSource](https://webidl.spec.whatwg.org/#BufferSource)

A random challenge that the relying party generates on the server side
to prevent replay attacks.

`rpId` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The [Relying Party Identifier](https://w3c.github.io/webauthn/#relying-party-identifier) of the credentials.

`credentialIds` member,  of type sequence< [BufferSource](https://webidl.spec.whatwg.org/#BufferSource) >

The list of credential identifiers for the given instrument.

`instrument` member,  of type [PaymentCredentialInstrument](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-paymentcredentialinstrument)

The description of the instrument name and icon to display during
registration and to be signed along with the transaction details.

`timeout` member,  of type [unsigned long](https://webidl.spec.whatwg.org/#idl-unsigned-long)

The number of milliseconds before the request to sign the transaction
details times out. At most 1 hour. Default values and the range of
allowed values is defined by the user agent. Web Authentication
provides [additional timeout guidance](https://www.w3.org/TR/webauthn-3/#sctn-createCredential).

`payeeName` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The display name of the payee that this SPC call is for (e.g., the
merchant). Optional, may be provided alongside or instead of `payeeOrigin`.

`payeeOrigin` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) of the payee that this SPC call is for (e.g., the
merchant). Optional, may be provided alongside or instead of `payeeName`.

`extensions` member,  of type [AuthenticationExtensionsClientInputs](https://www.w3.org/TR/webauthn-3/#dictdef-authenticationextensionsclientinputs)

Any [WebAuthn extensions](https://w3c.github.io/webauthn/#webauthn-extensions) that should be used for the passed
credential(s). The caller does not need to specify the [payment extension](https://www.w3.org/TR/secure-payment-confirmation/#sctn-payment-extension-registration); it is added
automatically.

`locale` member,  of type sequence< [USVString](https://webidl.spec.whatwg.org/#idl-USVString) >

An optional list of well-formed [\[BCP47\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-bcp47 "Tags for Identifying Languages") language tags, in descending
order of priority, that identify the [locale](https://www.w3.org/TR/i18n-glossary/#dfn-locale) preferences of the
website, i.e. a [language priority list](https://www.w3.org/TR/i18n-glossary/#dfn-language-priority-list) [\[RFC4647\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-rfc4647 "Matching of Language Tags"), which the user
agent can use to perform [language negotiation](https://www.w3.org/TR/i18n-glossary/#dfn-language-negotiation) and locale-affected
formatting with the caller.

NOTE: The `locale` is distinct from
language or direction metadata associated with specific input
members, in that it represents the caller’s requested localized
experience rather than assertion about a specific string value.
See [§ 13 Internationalization Considerations](https://www.w3.org/TR/secure-payment-confirmation/#sctn-i18n-considerations) for more discussion.

`showOptOut` member,  of type [boolean](https://webidl.spec.whatwg.org/#idl-boolean)

Whether the user should be given a chance to opt-out during the [transaction confirmation UX](https://www.w3.org/TR/secure-payment-confirmation/#sctn-transaction-confirmation-ux).
Optional, default false.

#### 4.1.6. Payment Method additional data type

The [payment method additional data type](https://w3c.github.io/payment-request/#dfn-additional-data-type) for this payment method is `SecurePaymentConfirmationRequest`.

#### 4.1.7. Checking if Secure Payment Confirmation is available

A static API is added to `PaymentRequest` in order to provide developers a
simplified method of checking whether Secure Payment Confirmation is available.

```
partial interface PaymentRequest {
    static Promise<boolean> isSecurePaymentConfirmationAvailable();
};

```

`isSecurePaymentConfirmationAvailable()`

Upon invocation, a promise is returned that resolves with a value of `true` if the Secure Payment Confirmation feature is available, or `false` otherwise.

This allows a developer to perform the following check when deciding whether to
initiate a SPC flow:

```
const spcAvailable =
    PaymentRequest &&
    PaymentRequest.isSecurePaymentConfirmationAvailable &&
    await PaymentRequest.isSecurePaymentConfirmationAvailable();

```

NOTE: The use of the static `isSecurePaymentConfirmationAvailable` method is recommended for
SPC feature detection, instead of calling `canMakePayment` on an already-constructed
PaymentRequest object.

#### 4.1.8. Steps to validate payment method data

The [steps to validate payment method data](https://w3c.github.io/payment-request/#dfn-steps-to-validate-payment-method-data) for this payment method, for an
input `PaymentRequest` request and `SecurePaymentConfirmationRequest` data, are:

Tests

- [constructor.https.html](https://wpt.fyi/results/secure-payment-confirmation/constructor.https.html "secure-payment-confirmation/constructor.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/constructor.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/constructor.https.html)
- [constructor-validate-payment-method-data.https.html](https://wpt.fyi/results/secure-payment-confirmation/constructor-validate-payment-method-data.https.html "secure-payment-confirmation/constructor-validate-payment-method-data.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/constructor-validate-payment-method-data.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/constructor-validate-payment-method-data.https.html)

01. If data\[" `credentialIds`"\] is empty,
    throw a `RangeError`.

02. For each id in data\[" `credentialIds`"\]:
    1. If id is empty, throw a `RangeError`.
03. If data\[" `challenge`"\] is null or
    empty, throw a `TypeError`.

04. If data\[" `instrument`"\]\[" `displayName`"\]
    is empty, throw a `TypeError`.

05. If data\[" `instrument`"\]\[" `icon`"\]
    is empty, throw a `TypeError`.

06. Run the URL parser on data\[" `instrument`"\]
    \[" `icon`"\]. If this returns failure, throw a `TypeError`.

07. If data\[" `rpId`"\] is not a [valid domain](https://url.spec.whatwg.org/#valid-domain), throw a `TypeError`.

08. If both data\[" `payeeName`"\] and data\[" `payeeOrigin`"\] are omitted,
    throw a `TypeError`.

09. If either of data\[" `payeeName`"\] or data\[" `payeeOrigin`"\] is present and
    empty, throw a `TypeError`.

10. If data\[" `payeeOrigin`"\] is present:
    1. Let parsedURL be the result of running the [URL parser](https://url.spec.whatwg.org/#concept-url-parser) on data\[" `payeeOrigin`"\].

    2. If parsedURL is failure, then throw a `TypeError`.

    3. If parsedURL’s [scheme](https://url.spec.whatwg.org/#concept-url-scheme) is not " `https`", then throw a `TypeError`.

#### 4.1.9. Steps to check if a payment can be made

The [steps to check if a payment can be made](https://w3c.github.io/payment-request/#dfn-steps-to-check-if-a-payment-can-be-made) for this payment method, for an
input `SecurePaymentConfirmationRequest` data, are:

Tests

- [constructor.https.html](https://wpt.fyi/results/secure-payment-confirmation/constructor.https.html "secure-payment-confirmation/constructor.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/constructor.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/constructor.https.html)
- [authentication-invalid-icon.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-invalid-icon.https.html "secure-payment-confirmation/authentication-invalid-icon.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-invalid-icon.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-invalid-icon.https.html)
- [authentication-icon-data-url.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-icon-data-url.https.html "secure-payment-confirmation/authentication-icon-data-url.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-icon-data-url.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-icon-data-url.https.html)
- [authentication-rejected.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-rejected.https.html "secure-payment-confirmation/authentication-rejected.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-rejected.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-rejected.https.html)

1. If data\[" `payeeOrigin`"\] is present:


   1. Let parsedURL be the result of running the [URL parser](https://url.spec.whatwg.org/#concept-url-parser) on data\[" `payeeOrigin`"\].

   2. Assert that parsedURL is not failure.

   3. Assert that parsedURL’s [scheme](https://url.spec.whatwg.org/#concept-url-scheme) is " `https`".


NOTE: These pre-conditions were previously checked in the [steps to validate payment\\
 method data](https://www.w3.org/TR/secure-payment-confirmation/#sctn-steps-to-validate-payment-method-data).
   1. Set data\[" `payeeOrigin`"\] to the [serialization of](https://html.spec.whatwg.org/multipage/browsers.html#ascii-serialisation-of-an-origin) parsedURL’s [origin](https://url.spec.whatwg.org/#concept-url-origin).
2. [Fetch the image resource](https://www.w3.org/TR/image-resource/#dfn-fetching-an-image-resource) for the icon, passing «\[" `src`" → data\[" `instrument`"\]\[" `icon`"\]\]»
   for _image_. If this fails:


   1. If data\[" `instrument`"\]\[" `iconMustBeShown`"\]
      is `true`, then return `false`.

   2. Otherwise, set data\[" `instrument`"\]\[" `icon`"\]
      to an empty string.

      Note: This lets the RP know that the specified icon was not shown, as the output `instrument` will have an empty icon
      string.


Note: The image resource must be fetched whether or not any credential
matches, to defeat attempts to [probe\\
for credential existence](https://www.w3.org/TR/secure-payment-confirmation/#sctn-privacy-probing-credential-ids).

3. For each id in data\[" `credentialIds`"\]:
   1. Run the [steps to silently determine if a credential is available for the current device](https://www.w3.org/TR/secure-payment-confirmation/#steps-to-silently-determine-if-a-credential-is-available-for-the-current-device), passing in data\[" `rpId`"\] and id.
      If the result is `false`, remove id from data\[" `credentialIds`"\].

   2. If the data\[" `rpId`"\] is
      not the [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin) of the [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object) of request,
      run the [steps to silently determine if an SPC Credential is third-party enabled](https://www.w3.org/TR/secure-payment-confirmation/#steps-to-silently-determine-if-an-spc-credential-is-third-party-enabled), passing in data\[" `rpId`"\] and id. If the
      result is `false`, remove id from data\[" `credentialIds`"\].
4. If data\[" `credentialIds`"\] is now empty,
   return `false`. The user agent must maintain [authentication ceremony privacy](https://www.w3.org/TR/secure-payment-confirmation/#sctn-privacy-probing-credential-ids) and not leak this lack of matching credentials to the caller, by:
   1. Not allowing the caller to perform a timing attack on this outcome versus
      the user declining to authenticate on the [transaction confirmation UX](https://www.w3.org/TR/secure-payment-confirmation/#sctn-transaction-confirmation-ux), e.g.,
      by presenting an alternative interstitial that the user must interact
      with.

   2. Rejecting the `show()` promise with a
      " `NotAllowedError`" `DOMException`.
5. Return `true`.


#### 4.1.10. Displaying a transaction confirmation UX

To avoid restricting User Agent implementation choice, this specification does
not require a User Agent to display a particular user interface when `PaymentRequest.show()` is called and the [Secure Payment Confirmation payment handler](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation-payment-handler) is selected. However, so that a [Relying Party](https://w3c.github.io/webauthn/#relying-party) can trust the information included in `CollectedClientPaymentData`, the User Agent MUST ensure that the following
is communicated to the user and that the user’s consent is collected for the
authentication:

- The `payeeName` if it is present.

- The `payeeOrigin` if it is present.

- The `total`, that is the `currency` and `value` of the
  transaction.

- The `instrument` details, that is the
  payment instrument `displayName` and `icon`. If an image resource could not be
  fetched or decoded from the input `icon`,
  then the User Agent may show no icon or a generic payment instrument
  icon in its place.

  NOTE: If the specified icon could not be fetched or decoded, then `iconMustBeShown` must be `false` here as
  otherwise the [the steps\\
  to check if a payment can be made](https://www.w3.org/TR/secure-payment-confirmation/#sctn-steps-to-check-if-a-payment-can-be-made) would have failed previously.


The user agent MAY utilize the information in `locale`, if any, to display a UX localized
into a language and using locale-based formatting consistent with that of the
website.

If `showOptOut` is `true`, the user agent
MUST give the user the opportunity to indicate that they want to opt out of the
process for the `given relying party`.
If the user indicates that they wish to opt-out, then the user agent must reject
the `show()` promise with an
" `OptOutError`" `DOMException`. See [§ 11.4 User opt out](https://www.w3.org/TR/secure-payment-confirmation/#sctn-user-opt-out).

Tests

- [authentication-optout.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-optout.https.html "secure-payment-confirmation/authentication-optout.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-optout.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-optout.https.html)

If the [current transaction automation mode](https://www.w3.org/TR/secure-payment-confirmation/#current-transaction-automation-mode) is not " `none`", the user agent
should first verify that it is in an automation context (see [WebDriver’s Security considerations](https://www.w3.org/TR/webdriver2/#security)). The user agent
should then bypass the above communication of information and gathering of user
consent, and instead do the following based on the value of the [current transaction automation mode](https://www.w3.org/TR/secure-payment-confirmation/#current-transaction-automation-mode):

" `autoAccept`"


Act as if the user has seen the transaction details and accepted
the authentication.

" `autoReject`"


Act as if the user has seen the transaction details and rejected
the authentication.

" `autoOptOut`"


Act as if the user has seen the transaction details and indicated
they want to opt out.

#### 4.1.11. Steps to respond to a payment request

The [steps to respond to a payment request](https://w3c.github.io/payment-request/#dfn-steps-to-respond-to-a-payment-request) for this payment method, for a given `PaymentRequest` request and `SecurePaymentConfirmationRequest` data, are:

1. Let topOrigin be the [top-level origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-environment-top-level-origin) of the [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object) of request.

2. Let payment be a new a `AuthenticationExtensionsPaymentInputs` dictionary,
   whose fields are:
   `isPayment`

   The boolean value `true`.

   `rpId`

   data\[" `rpId`"\]

   `topOrigin`

   topOrigin

   `payeeName`

   data\[" `payeeName`"\] if it is
   present, otherwise omitted.

   `payeeOrigin`

   data\[" `payeeOrigin`"\] if it is
   present, otherwise omitted.

   `total`

   request. [\[\[details\]\]](https://w3c.github.io/payment-request/#dfn-details)\[" `total`"\]

   `instrument`

   data\[" `instrument`"\]

3. Let extensions be a new `AuthenticationExtensionsClientInputs` dictionary
   whose `payment` member is set to payment, and whose other members are set from data\[" `extensions`"\].

4. Let publicKeyOpts be a new `PublicKeyCredentialRequestOptions` dictionary, whose fields are:
   `challenge`

   data\[" `challenge`"\]

   `timeout`

   data\[" `timeout`"\]

   `rpId`

   data\[" `rpId`"\]

   `userVerification`

   `required`

   `extensions`

   extensions


   Note: This algorithm hard-codes "required" as the value for `userVerification`, because that is what Chrome’s initial implementation supports. The current limitations may change. The Working Group invites implementers to share use cases that would benefit from support for other values (e.g., "preferred" or "discouraged").

5. For each id in data\[" `credentialIds`"\]:
   1. Let descriptor be a new `PublicKeyCredentialDescriptor` dictionary,
      whose fields are:
      `type`

      `public-key`

      `id`

      id

      `transports`

      A sequence of length 1 whose only member is `internal`.

   2. [Append](https://infra.spec.whatwg.org/#list-append) descriptor to publicKeyOpts\[" `allowCredentials`"\].
6. Let outputCredential be the result of running the algorithm to [Request a Credential](https://w3c.github.io/webappsec-credential-management/#abstract-opdef-request-a-credential), passing «\[" `publicKey`"\
   → publicKeyOpts\]».

   Note: Chrome’s initial implementation does not pass the full `data.credentialIds` list to [Request a Credential](https://w3c.github.io/webappsec-credential-management/#abstract-opdef-request-a-credential). Instead, it chooses one credential in the list that matches the current device and passes only that in.

   Note: This triggers [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3")’s [Get](https://www.w3.org/TR/webauthn-3/#sctn-getAssertion) behavior

7. Return outputCredential.


## 5\. WebAuthn Extension - " `payment`"

This [client](https://w3c.github.io/webauthn/#client-extension) [registration extension](https://w3c.github.io/webauthn/#registration-extension) and [authentication extension](https://w3c.github.io/webauthn/#authentication-extension) indicates that a credential is either being
created for or used for Secure Payment Confirmation, respectively.

For registration, this extension allows the browser to identify and cache
Secure Payment Confirmation credential IDs. For authentication, this extension
allows a third-party to perform an authentication ceremony on behalf of the [Relying Party](https://w3c.github.io/webauthn/#relying-party), and also adds transaction information to the signed
cryptogram.

Notably, a website should not call `navigator.credentials.get()` with this extension
directly; for authentication the extension can only be accessed via `PaymentRequest` with a " [secure-payment-confirmation](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation)" payment method.

Note: Previously, the `payment` extension allowed for the creation of
credentials in a cross-origin iframe. However that behavior is now
allowed in WebAuthn by default, as of [WebAuthn PR #1801](https://github.com/w3c/webauthn/pull/1801).

Tests

This test does not directly correspond to a spec line, but instead
tests that authentication can be triggered from inside a
cross-origin iframe. That behavior is specified by the lack of any
line forbidding it.

- [authentication-in-iframe.sub.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-in-iframe.sub.https.html "secure-payment-confirmation/authentication-in-iframe.sub.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-in-iframe.sub.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-in-iframe.sub.https.html)

* * *

Extension identifier


`payment`

Operation applicability


[Registration](https://w3c.github.io/webauthn/#registration-extension) and [authentication](https://w3c.github.io/webauthn/#authentication-extension)

Client extension input


```
partial dictionary AuthenticationExtensionsClientInputs {
  AuthenticationExtensionsPaymentInputs payment;
};

dictionary AuthenticationExtensionsPaymentInputs {
  boolean isPayment;

  // Only used for authentication.
  USVString rpId;
  USVString topOrigin;
  USVString payeeName;
  USVString payeeOrigin;
  PaymentCurrencyAmount total;
  PaymentCredentialInstrument instrument;
};

```

`isPayment` member,  of type [boolean](https://webidl.spec.whatwg.org/#idl-boolean)

Indicates that the extension is active.

`rpId` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The [Relying Party](https://w3c.github.io/webauthn/#relying-party) id of the credential(s) being used. Only used at authentication time; not registration.

`topOrigin` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The origin of the top-level frame. Only used at authentication time; not registration.

`payeeName` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The payee name, if present, that was displayed to the user. Only used at authentication time; not registration.

`payeeOrigin` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The payee origin, if present, that was displayed to the user. Only used at authentication time; not registration.

`total` member,  of type [PaymentCurrencyAmount](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount)

The transaction amount that was displayed to the user. Only used at authentication time; not registration.

`instrument` member,  of type [PaymentCredentialInstrument](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-paymentcredentialinstrument)

The instrument details that were displayed to the user. Only used at authentication time; not registration.

Client extension processing ( [registration](https://w3c.github.io/webauthn/#registration-extension))

When [creating a new credential](https://www.w3.org/TR/webauthn-3/#sctn-createCredential):

1. After step 3, insert the following step:
   - If any of the following are true:


     - _pkOptions_\[" `authenticatorSelection`"\]\[" `authenticatorAttachment`"\] is not " `platform`".

     - _pkOptions_\[" `authenticatorSelection`"\]\[" `residentKey`"\] is not " `required`" or " `preferred`".

     - _pkOptions_\[" `authenticatorSelection`"\]\[" `userVerification`"\] is not " `required`".


then throw a `TypeError`.

Note: These values are hard-coded as that is what Chrome’s initial implementation
supports. The current limitations may change. The Working Group invites implementers
to share use cases that would benefit from support for other values.
Tests

- [enrollment.https.html](https://wpt.fyi/results/secure-payment-confirmation/enrollment.https.html "secure-payment-confirmation/enrollment.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/enrollment.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/enrollment.https.html)

Client extension processing ( [authentication](https://w3c.github.io/webauthn/#authentication-extension))

When [making an assertion](https://www.w3.org/TR/webauthn-3/#sctn-getAssertion) with a `AuthenticationExtensionsPaymentInputs` extension\_inputs:

1. If not in a " [secure-payment-confirmation](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation)" payment handler, return a
   " `NotAllowedError`" `DOMException`.
   Tests

- [authentication-cannot-bypass-spc.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-cannot-bypass-spc.https.html "secure-payment-confirmation/authentication-cannot-bypass-spc.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-cannot-bypass-spc.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-cannot-bypass-spc.https.html)

Note: This guards against websites trying to access the extended powers of
SPC without going through [the\\
transaction UX](https://www.w3.org/TR/secure-payment-confirmation/#sctn-transaction-confirmation-ux).

2. During `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)`:


   1. Skip step 6.1, which compares _options.rpId_ to _effectiveDomain_


Tests

- [authentication-cross-origin.sub.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-cross-origin.sub.https.html "secure-payment-confirmation/authentication-cross-origin.sub.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-cross-origin.sub.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-cross-origin.sub.https.html)

Note: This enables cross-domain authentication ceremonies; see [§ 1.1.2 Merchant control of authentication](https://www.w3.org/TR/secure-payment-confirmation/#sctn-use-case-merchant-authentication).
   1. In step 9, instead of creating a `CollectedClientData`, instead
      create a `CollectedClientPaymentData` with:


      1. `type` set to " `payment.get`"

      2. `payment` set to a new `CollectedClientAdditionalPaymentData` whose fields are:
         `rpId`

         extension\_inputs\[" `rpId`"\]

         `topOrigin`

         extension\_inputs\[" `topOrigin`"\]

         `payeeName`

         extension\_inputs\[" `payeeName`"\]
         if it is present, otherwise omitted.

         `payeeOrigin`

         extension\_inputs\[" `payeeOrigin`"\]
         if it is present, otherwise omitted.

         `total`

         extension\_inputs\[" `total`"\]

         `instrument`

         extension\_inputs\[" `instrument`"\]

      3. All other fields set as per the original step 9.


Tests

- [authentication-accepted.https.html](https://wpt.fyi/results/secure-payment-confirmation/authentication-accepted.https.html "secure-payment-confirmation/authentication-accepted.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/authentication-accepted.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/authentication-accepted.https.html)

Client extension output


None

Authenticator extension processing


None

### 5.1. `CollectedClientPaymentData` Dictionary

```
dictionary CollectedClientPaymentData : CollectedClientData {
    required CollectedClientAdditionalPaymentData payment;
};

```

The `CollectedClientPaymentData` dictionary inherits from `CollectedClientData`. It contains the following additional field:

`payment` member,  of type [CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-collectedclientadditionalpaymentdata)

The additional payment information to sign.

### 5.2. `CollectedClientAdditionalPaymentData` Dictionary

```
dictionary CollectedClientAdditionalPaymentData {
    required USVString rpId;
    required USVString topOrigin;
    USVString payeeName;
    USVString payeeOrigin;
    required PaymentCurrencyAmount total;
    required PaymentCredentialInstrument instrument;
};

```

The `CollectedClientAdditionalPaymentData` dictionary contains the following
fields:

`rpId` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The id of the [Relying Party](https://w3c.github.io/webauthn/#relying-party) that created the credential.

NOTE: For historical reasons, some implementations may additionally
include this parameter with the name `rp`. The values of `rp` and `rpId` must be the same if both are present.

`topOrigin` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The origin of the top level context that requested to sign the transaction details.

`payeeName` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The name of the payee, if present, that was displayed to the user.

`payeeOrigin` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The origin of the payee, if present, that was displayed to the user.

`total` member,  of type [PaymentCurrencyAmount](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount)

The `PaymentCurrencyAmount` of the [\[payment-request\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-payment-request "Payment Request API") `total` field.

`instrument` member,  of type [PaymentCredentialInstrument](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-paymentcredentialinstrument)

The instrument information that was displayed to the user.

Note that there is no `paymentRequestOrigin` field in `CollectedClientAdditionalPaymentData`, because the origin of the calling
frame is already included in `CollectedClientData` of [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3").

## 6\. Common Data Structures

The following data structures are shared between registration and authentication.

### 6.1. `PaymentCredentialInstrument` Dictionary

```
dictionary PaymentCredentialInstrument {
    required USVString displayName;
    required USVString icon;
    boolean iconMustBeShown = true;
};

```

The `PaymentCredentialInstrument` dictionary contains the information to be
displayed to the user and signed together with the transaction details. It
contains the following members:

`displayName` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The name of the payment instrument to be displayed to the user.

NOTE: See [§ 13 Internationalization Considerations](https://www.w3.org/TR/secure-payment-confirmation/#sctn-i18n-considerations) for discussion about
internationalization of the `displayName`.

`icon` member,  of type [USVString](https://webidl.spec.whatwg.org/#idl-USVString)

The URL of the icon of the payment instrument.

NOTE: The `icon` URL may either identify
an image on an internet-accessible server (e.g., `https://bank.com/card.png`),
or directly encode the icon data via a Data URL [\[RFC2397\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-rfc2397 "The \"data\" URL scheme"). Between
the two types of URLs, Data URLs offer several benefits to the [Relying Party](https://w3c.github.io/webauthn/#relying-party). They can improve reliability (e.g., in the case that
the icon hosting server may be unavailable). They can also enhance
validation because the [Relying Party](https://w3c.github.io/webauthn/#relying-party) has cryptographic evidence of
what the browser displayed to the user: the icon URL is signed as part
of the `CollectedClientAdditionalPaymentData` structure.

NOTE: See related [accessibility considerations](https://www.w3.org/TR/secure-payment-confirmation/#sctn-accessibility-considerations).

`iconMustBeShown` member,  of type [boolean](https://webidl.spec.whatwg.org/#idl-boolean), defaulting to `true`

Indicates whether the specified icon must be successfully fetched and shown for the
request to succeed.

## 7\. Permissions Policy integration

This specification uses the " [payment](https://w3c.github.io/payment-request/#dfn-payment)"
policy-identifier string from [\[payment-request\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-payment-request "Payment Request API") to control access to
SPC authentication, as per the `PaymentRequest` constructor.

For backwards compatibility with an earlier version of this specification, the [Credential Management\\
Credential Type Registry](https://www.w3.org/TR/credential-management-1/#sctn-cred-type-registry) is extended to add the " [payment](https://w3c.github.io/payment-request/#dfn-payment)" policy-identifier string as an alternative [Create Permissions Policy](https://w3c.github.io/webappsec-credential-management/#credential-type-registry-create-permissions-policy) for type `public-key`. A future version of this
specification may deprecate this behavior entirely.

Tests

- [enrollment-in-iframe.sub.https.html](https://wpt.fyi/results/secure-payment-confirmation/enrollment-in-iframe.sub.https.html "secure-payment-confirmation/enrollment-in-iframe.sub.https.html") [(live test)](https://wpt.live/secure-payment-confirmation/enrollment-in-iframe.sub.https.html) [(source)](https://github.com/web-platform-tests/wpt/blob/master/secure-payment-confirmation/enrollment-in-iframe.sub.https.html)

Note: Algorithms specified in [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-credential-management-1 "Credential Management Level 1") perform the actual
permissions policy evaluation. This is because such policy evaluation needs to
occur when there is access to the [current settings object](https://html.spec.whatwg.org/multipage/webappapis.html#current-settings-object). The `[[Create]](origin, options, sameOriginWithAncestors)` and `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` [internal methods](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) do not have such access since
they are invoked [in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel) (by algorithms specified in [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-credential-management-1 "Credential Management Level 1")).

## 8\. SPC Relying Party Operations

### 8.1. Verifying an Authentication Assertion

In order to perform an [authentication ceremony](https://w3c.github.io/webauthn/#authentication-ceremony) for Secure Payment
Confirmation, the [Relying Party](https://w3c.github.io/webauthn/#relying-party) MUST proceed as follows:

1. Let credential be a `PublicKeyCredential` returned from a successful
   invocation of the [Secure Payment Confirmation payment handler](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation-payment-handler) by the SPC caller.

   Note: As SPC is designed to enable [merchant\\
   control of authentication](https://www.w3.org/TR/secure-payment-confirmation/#sctn-use-case-merchant-authentication), the entity that invokes SPC may not be the [Relying Party](https://w3c.github.io/webauthn/#relying-party). This first step presumes that the SPC caller has returned
   a credential obtained via SPC to the [Relying Party](https://w3c.github.io/webauthn/#relying-party).

2. Perform steps 3-21 [as specified in\\
   WebAuthn](https://www.w3.org/TR/webauthn-3/#sctn-verifying-assertion), with the following changes:
   1. In step 5, verify that credential. `id` identifies one of
      the public key credentials provided to the SPC caller by the [Relying Party](https://w3c.github.io/webauthn/#relying-party).

   2. In step 11, verify that the value of C\[" `type`"\]
      is the string `payment.get`.

   3. In step 12, verify that the value of C\[" `challenge`"\]
      equals the base64url encoding of the challenge provided to the SPC caller by the [Relying Party](https://w3c.github.io/webauthn/#relying-party).

   4. In step 13, verify that the value of C\[" `origin`"\]
      matches the origin that the [Relying Party](https://w3c.github.io/webauthn/#relying-party) expects SPC to have been
      called from.

   5. After step 13, insert the following steps:
      - Verify that the value of C\[" `payment`"\]\[" `rpId`"\]
        matches the [Relying Party](https://w3c.github.io/webauthn/#relying-party)’s origin.

      - Verify that the value of C\[" `payment`"\]\[" `topOrigin`"\]
        matches the top-level origin that the [Relying Party](https://w3c.github.io/webauthn/#relying-party) expects.

      - Verify that the value of C\[" `payment`"\]\[" `payeeName`"\]
        matches the name of the payee that should have been displayed to the user, if any.

      - Verify that the value of C\[" `payment`"\]\[" `payeeOrigin`"\]
        matches the origin of the payee that should have been displayed to the user, if any.

      - Verify that the value of C\[" `payment`"\]\[" `total`"\]
        matches the transaction amount that should have been displayed to the user.

      - Verify that the value of C\[" `payment`"\]\[" `instrument`"\]
        matches the payment instrument details that should have been displayed to the user.

## 9\. User Agent Automation

For the purposes of user agent automation and website testing, this document
defines the below [\[WebDriver2\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webdriver2 "WebDriver") [extension commands](https://w3c.github.io/webdriver/#dfn-extension-commands). Interested parties
should also consult the [equivalent automation\\
section](https://www.w3.org/TR/webauthn-3/#sctn-automation) in [\[webauthn-3\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-webauthn-3 "Web Authentication: An API for accessing Public Key Credentials - Level 3").

### 9.1. Set SPC Transaction Mode

The [Set SPC Transaction Mode](https://www.w3.org/TR/secure-payment-confirmation/#set-spc-transaction-mode) WebDriver [extension command](https://w3c.github.io/webdriver/#dfn-extension-commands) instructs the
user agent to place Secure Payment Confirmation into a mode where it will
automatically simulate a user either accepting or rejecting the [transaction confirmation UX](https://www.w3.org/TR/secure-payment-confirmation/#sctn-transaction-confirmation-ux).

The current transaction automation mode tracks what automation mode
is currently active for SPC. It defaults to " `none`".

| HTTP Method | URI Template |
| --- | --- |
| POST | `/session/{session id}/secure-payment-confirmation/set-mode` |

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If parameters is not a JSON [Object](https://tc39.es/ecma262/multipage/structured-data.html#sec-json-object), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).

2. Let mode be the result of [getting a property](https://w3c.github.io/webdriver/#dfn-getting-properties) named `"mode"` from parameters.

3. If mode is [undefined](https://w3c.github.io/webdriver/#dfn-undefined) or is not one of " `autoAccept`", " `autoReject`",
   or " `autoOptOut`", return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).

4. Set the [current transaction automation mode](https://www.w3.org/TR/secure-payment-confirmation/#current-transaction-automation-mode) to mode.

5. Return [success](https://w3c.github.io/webdriver/#dfn-success) with data `null`.


## 10\. Security Considerations

As this specification builds on top of WebAuthn, the [WebAuthn Security Considerations](https://www.w3.org/TR/webauthn-3/#sctn-security-considerations) are applicable. The below subsections comprise the current Secure Payment
Confirmation-specific security considerations, where this specification
diverges from WebAuthn.

### 10.1. Cross-origin authentication ceremony

A significant departure that Secure Payment Confirmation makes from WebAuthn is
in allowing a third-party to initiate an authentication ceremony using
credentials for a different [Relying Party](https://w3c.github.io/webauthn/#relying-party), and returning the assertion to
the third party. This feature can expose [Relying Parties](https://w3c.github.io/webauthn/#relying-party) to both login and
payment attacks, which are discussed here.

#### 10.1.1. Login Attack

As credentials created for Secure Payment Confirmation are valid WebAuthn
credentials, it is possible that a [Relying Party](https://w3c.github.io/webauthn/#relying-party) may wish to use the same
credential for a given user for both login and payment. This allows a potential
attack on the [Relying Party’s](https://w3c.github.io/webauthn/#relying-party) login system, if they do not carefully verify
the assertion they receive.

The attack is as follows:

1. The user visits `attacker.com`, which is or pretends to be a merchant site.

2. `attacker.com` obtains credentials for the user from `relyingparty.com`,
    either legitimately or by stealing them from `relyingparty.com` or another
    party with whom `relyingparty.com` had shared the credentials.

3. `attacker.com` initiates SPC authentication, and the user agrees to the
    transaction (which may or may not be legitimate).

4. `attacker.com` takes the payment assertion that they received from the API
    call, and sends it to the login endpoint for `relyingparty.com`, e.g. by
    sending a POST to `https://relyingparty.com/login`.

5. `relyingparty.com` is employing faulty assertion validation code, which
    checks the signature but fails to validate the necessary fields (see
    below), and believes the login attempt to be legitimate.

6. `relyingparty.com` returns e.g. a login cookie to `attacker.com`. The user’s
    account at `relyingparty.com` has now been compromised.


[Relying Parties](https://w3c.github.io/webauthn/#relying-party) can guard against this attack in two ways.

Firstly, a [Relying Party](https://w3c.github.io/webauthn/#relying-party) must always follow the correct assertion
validation steps either for [WebAuthn\\
login](https://www.w3.org/TR/webauthn-3/#sctn-verifying-assertion) or [SPC payment](https://www.w3.org/TR/secure-payment-confirmation/#sctn-verifying-assertion) as appropriate. In
particular, the following fields can all be used to detect an inappropriate use
of a credential:

- `CollectedClientData`\[" `type`"\]\- "webauthn.get" for
  login, "payment.get" for SPC.

- `CollectedClientData`\[" `challenge`"\] \- this value should
  be provided by the [Relying Party](https://w3c.github.io/webauthn/#relying-party) server to the site ahead of any call
  to either WebAuthn or SPC, and should be verified as matching an expected,
  appropriate, previously-provided value.

- `CollectedClientData`\[" `origin`"\] \- if SPC is being
  performed cross-origin, this value will contain the origin of the caller
  (e.g. `attacker.com` in the above example).


Secondly, a [Relying Party](https://w3c.github.io/webauthn/#relying-party) can consider keeping their payment and login
credentials separate. If doing this, the [Relying Party](https://w3c.github.io/webauthn/#relying-party) should only register
credentials for Secure Payment Confirmation on a subdomain (e.g. `https//payment.relyingparty.com`), and should keep payment credentials and
login credentials separate in their database.

NOTE: As currently written, the Secure Payment Confirmation specification
allows any WebAuthn credential to be used in an SPC authentication.
However this is not true in implementations today, which only allow
credentials created with the `payment` extension specified to participate in SPC authentication, and the
specification may be updated to reflect that in the future.


In both implementation and specification today, a credential created
with the `payment` can be used
for login, if the Relying Party wishes. This is not expected to change.

#### 10.1.2. Payment Attack

A Secure Payment Confirmation assertion is essentially useless unless
it is part of an ongoing online transaction.

A variety of mechanisms protect against an attack where a malicious
third-party, instead of attempting to hijack a user account, initiates
an unauthorized payment using Secure Payment Confirmation credentials
(obtained either legitimately or otherwise):

- When the attacker initiates SPC, the user will be shown UI by the
  User Agent that clearly states the transaction details (including the payee
  and amount). The user is very likely to "cancel" in this scenario.

- If the user does agree to the transaction, and completes the subsequent
  WebAuthn authentication ceremony, the attacker now has a signed SPC
  assertion for the [Relying Party](https://w3c.github.io/webauthn/#relying-party).

- If the [Relying Party](https://w3c.github.io/webauthn/#relying-party) is not expecting a transaction, it will reject the
  assertion.

- If the [Relying Party](https://w3c.github.io/webauthn/#relying-party) is expecting a transaction, it will detect at least
  one of the following and reject the assertion:
  - An incorrect `CollectedClientData`\[" `challenge`"\],
    if an attacker attempts to race against a valid ongoing payment.

  - An incorrect `CollectedClientData`\[" `origin`"\],
    if an attacker attempts to sit between the user and a valid merchant
    site and forward the assertion.

### 10.2. Merchant-supplied authentication data

The bank can and should protect against spoofing by [verifying the authentication assertion](https://www.w3.org/TR/secure-payment-confirmation/#sctn-verifying-assertion) they receive to
ensure it aligns with the transaction details provided by the
merchant.

That is because a consequence of this specification’s third-party
authentication ceremony is that even in a valid transaction (i.e. one
that the [Relying Party](https://w3c.github.io/webauthn/#relying-party) is expecting), a third-party provides the
transaction details that are shown to the user:

- Transaction amount and currency

- Payment instrument name and icon

- Payee name and origin


This could lead to a spoofing attack, in which a merchant presents incorrect
data to the user. For example, the merchant could tell the bank (in the
backend) that it is initiating a purchase of $100, but then pass $1 to the SPC
API (and thus show the user a $1 transaction to verify). Or the merchant
could provide the correct transaction details but pass Secure Payment
Confirmation credentials that don’t match what the [Relying Party](https://w3c.github.io/webauthn/#relying-party) expects.

Secure Payment Confirmation actually makes defeating this kind of attack easier
than it currently is on the web. In online payments today, the bank has to
trust that the merchant showed the user the correct amount in their checkout
flow (and any fraud discoveries are post-payment, when the user checks their
account statement).

### 10.3. Lack of user activation requirement

If the user agent does not require user activation, as outlined in [§ 4.1.4 Modification of user activation requirement](https://www.w3.org/TR/secure-payment-confirmation/#sctn-modify-user-activation-requirement), some additional security
mitigations should be considered. Not requiring user activation increases the
risk of spam and click-jacking attacks, by allowing a Secure Payment
Confirmation flow to be initiated without the user interacting with the page
immediately beforehand.

In order to mitigate spam, the user agent may decide to enforce a user
activation requirement after some threshold, for example after the user has
already been shown a Secure Payment Confirmation flow without a user activation
on the current page. In order to mitigate click-jacking attacks, the user agent
may implement a time threshold in which clicks are ignored immediately after a
dialog is shown.

Another relevant mitigation exists in `PaymentRequest.show()`: the Payment Request API
requires the document to be visible, and thus SPC cannot be triggered from a
background tab, minimized window, or other similar hidden situations.

## 11\. Privacy Considerations

As this specification builds on top of WebAuthn, the [WebAuthn Privacy Considerations](https://www.w3.org/TR/webauthn-3/#sctn-privacy-considerations) are
applicable. The below subsections comprise the current Secure Payment
Confirmation-specific privacy considerations, where this specification diverges
from WebAuthn.

### 11.1. Probing for credential ids

As per WebAuthn’s section on [Authentication\\
Ceremony Privacy](https://www.w3.org/TR/webauthn-3/#sctn-assertion-privacy), implementors of Secure Payment Confirmation must make sure
not to enable malicious callers (who now may not even be the [Relying Party](https://w3c.github.io/webauthn/#relying-party))
to distinguish between these cases:

- A credential is not available.

- A credential is available, but the user does not consent to use it.


If the above cases are distinguishable, information is leaked by which a
malicious [Relying Party](https://w3c.github.io/webauthn/#relying-party) could identify the user by probing for which [credentials](https://w3c.github.io/webauthn/#public-key-credential) are available.

Section [§ 4.1.9 Steps to check if a payment can be made](https://www.w3.org/TR/secure-payment-confirmation/#sctn-steps-to-check-if-a-payment-can-be-made) gives normative steps
to mitigate this risk.

### 11.2. Joining different payment instruments

If a [Relying Party](https://w3c.github.io/webauthn/#relying-party) uses the same credentials for a given user across
multiple payment instruments, this might allow a merchant to join information
about payment instruments that might otherwise not be linked. That is, across
two different transactions that a user U performs with payment instruments P1
and P2 (either on the same merchant M, or two colluding merchants M1 and M2),
the merchant(s) may now be able to learn that P1 and P2 are for the same user.

For many current online payment flows this may not be a significant
risk, as the user often provides sufficient information to do
this joining anyway (e.g., name, email address, shipping address).

However, if payment methods that involve less identifying information
(e.g., tokenization) become commonplace, it is important that
ecosystem stakeholders take steps to preserve user privacy. For example:

- Payment systems might establish rules that place limits on storage of credential ID(s) by third parties.

- When a [Relying Party](https://w3c.github.io/webauthn/#relying-party) assigns multiple instruments to a single SPC credential, it might choose not to share that credential ID with other parties. In this case, the [Relying Party](https://w3c.github.io/webauthn/#relying-party) could still use the SPC credential itself (in either a first-party or third-party context) to authenticate the user.

- A [Relying Party](https://w3c.github.io/webauthn/#relying-party) (e.g., a bank) might enable the user to register a distinct SPC credential per payment instrument. This would not prevent the [Relying Party](https://w3c.github.io/webauthn/#relying-party) from joining those accounts internally.


### 11.3. Credential ID(s) as a tracking vector

Even for a single payment instrument, the credential ID(s) returned by the [Relying Party](https://w3c.github.io/webauthn/#relying-party) could be used by a malicious entity as a tracking vector, as
they are strong, cross-site identifiers. However in order to obtain them from
the [Relying Party](https://w3c.github.io/webauthn/#relying-party), the merchant already needs an as-strong identifier to
give to the [Relying Party](https://w3c.github.io/webauthn/#relying-party) (e.g., the credit card number).

### 11.4. User opt out

The API option `showOptOut` tells the
user agent to provide a way for the user to indicate they wish to opt out of the
relying party’s storage of information. When the user invokes this opt out, an `OptOutError` is returned to the caller to indicate the user’s intent to opt
out. It is then up to the caller to act on the opt out, e.g. by clearing payment
information stored for the user.

Implementors must make sure that the return of an `OptOutError` does not
reveal that the user has credentials but did not complete an authentication.
This can be mitigated by similar means as [§ 11.1 Probing for credential ids](https://www.w3.org/TR/secure-payment-confirmation/#sctn-privacy-probing-credential-ids), e.g. by also providing the user an
opportunity to opt out on the interstitial UX in the case where a credential
match is not found.

This is not intended to be a mechanism to delete browser data or credentials -
it is for the developer to prompt for opt out via the user agent. The user agent
should make this clear to the user, for example with some clarifying text:
"This provider may have stored information about your payment method, which you
can request to be deleted."

## 12\. Accessibility Considerations

User agents render the `icon` and `displayName` together. Relying parties ensure the accessibility of the icon presentation by providing sufficient information via the `displayName` (e.g., if the icon represents a bank, by including the bank name in the `displayName`).

User Agents implementing this specification should follow both [WebAuthn’s Accessibility Considerations](https://www.w3.org/TR/webauthn-3/#sctn-accessiblility-considerations) and [PaymentRequest’s Accessibility Considerations](https://w3c.github.io/payment-request/#accessibility-considerations).

## 13\. Internationalization Considerations

Callers of the API should express the desired [locale](https://www.w3.org/TR/i18n-glossary/#dfn-locale) of the
transaction dialog as well as the localization of any displayable
strings via the `locale` member. In
general this member should match the localization of the page where
the request originates (such as by querying the `lang` attribute of
the button triggering the request).

This specification does not (yet) include mechanisms for callers to
associate language or direction metadata with the displayable strings
they provide as input to the API (e.g., `displayName`).

In the meantime, callers of the API should:

- Aim for consistency between values of `locale` (when provided) and the language of displayable strings.

- Ensure that direction changes within a string will be correctly
  rendered when the string is displayed (see [How to use Unicode controls\\
  for bidi text](https://www.w3.org/International/questions/qa-bidi-unicode-controls) and [Inline changes to base direction](https://www.w3.org/TR/international-specs/#inline_changes) for more information).


Implementations (and other processes attempting to display values)
should apply [bidi isolation](https://www.w3.org/TR/i18n-glossary/#dfn-bidi-isolation) around displayable string values
when inserting them into the user interface. They should set the
direction when it is known, or default to first-strong ("auto")
when it is not.

## 14\. IANA Considerations

This section adds the below-listed [extension identifier](https://w3c.github.io/webauthn/#extension-identifier) to the IANA "WebAuthn Extension Identifiers" registry [\[IANA-WebAuthn-Registries\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-iana-webauthn-registries "Registries for Web Authentication (WebAuthn)") established by [\[RFC8809\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-rfc8809 "Registries for Web Authentication (WebAuthn)").

- WebAuthn Extension Identifier: payment

- Description: This extension supports the following functionality defined by the Secure Payment Confirmation API: (1) it allows credential creation in a cross-origin iframe (2) it allows a party other than the Relying Party to use the credential to perform an authentication ceremony on behalf of the Relying Party, and (3) it allows the browser to identify and cache Secure Payment Confirmation credentials. For discussion of important ways in which SPC differs from Web Authentication, see in particular [§ 10 Security Considerations](https://www.w3.org/TR/secure-payment-confirmation/#sctn-security-considerations) and [§ 11 Privacy Considerations](https://www.w3.org/TR/secure-payment-confirmation/#sctn-privacy-considerations)

- Specification Document: Section [§ 5 WebAuthn Extension - "payment"](https://www.w3.org/TR/secure-payment-confirmation/#sctn-payment-extension-registration) of this specification

- Change Controller: [W3C Web Payments Working Group](https://www.w3.org/groups/wg/payments)

- Notes: Registration follows [3 May 2023 discussion](https://www.w3.org/2023/05/03-webauthn-minutes#t01) with the Web Authentication Working Group.


## Conformance

### Document conventions

Conformance requirements are expressed
with a combination of descriptive assertions
and RFC 2119 terminology.
The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL”
in the normative parts of this document
are to be interpreted as described in RFC 2119.
However, for readability,
these words do not appear in all uppercase letters in this specification.

All of the text of this specification is normative
except sections explicitly marked as non-normative, examples, and notes. [\[RFC2119\]](https://www.w3.org/TR/secure-payment-confirmation/#biblio-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")

Examples in this specification are introduced with the words “for example”
or are set apart from the normative text
with `class="example"`,
like this:

This is an example of an informative example.

Informative notes begin with the word “Note”
and are set apart from the normative text
with `class="note"`,
like this:

Note, this is an informative note.

Tests

Tests relating to the content of this specification
may be documented in “Tests” blocks like this one.
Any such block is non-normative.

* * *

### Conformant Algorithms

Requirements phrased in the imperative as part of algorithms
(such as "strip any leading space characters"
or "return false and abort these steps")
are to be interpreted with the meaning of the key word
("must", "should", "may", etc)
used in introducing the algorithm.

Conformance requirements phrased as algorithms or specific steps
can be implemented in any manner,
so long as the end result is equivalent.
In particular, the algorithms defined in this specification
are intended to be easy to understand
and are not intended to be performant.
Implementers are encouraged to optimize.

## Index

### Terms defined by this specification

- [AuthenticationExtensionsPaymentInputs](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-authenticationextensionspaymentinputs), in § 5
- [challenge](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-challenge), in § 4.1.5
- [Client extension processing (authentication)](https://www.w3.org/TR/secure-payment-confirmation/#client-extension-processing-authentication), in § 5
- [Client extension processing (registration)](https://www.w3.org/TR/secure-payment-confirmation/#client-extension-processing-registration), in § 5
- [CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-collectedclientadditionalpaymentdata), in § 5.2
- [CollectedClientPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-collectedclientpaymentdata), in § 5.1
- [credentialIds](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-credentialids), in § 4.1.5
- [current transaction automation mode](https://www.w3.org/TR/secure-payment-confirmation/#current-transaction-automation-mode), in § 9.1
- [displayName](https://www.w3.org/TR/secure-payment-confirmation/#dom-paymentcredentialinstrument-displayname), in § 6.1
- [extensions](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-extensions), in § 4.1.5
- [icon](https://www.w3.org/TR/secure-payment-confirmation/#dom-paymentcredentialinstrument-icon), in § 6.1
- [iconMustBeShown](https://www.w3.org/TR/secure-payment-confirmation/#dom-paymentcredentialinstrument-iconmustbeshown), in § 6.1
- instrument
  - [dict-member for AuthenticationExtensionsPaymentInputs](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionspaymentinputs-instrument), in § 5
  - [dict-member for CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dom-collectedclientadditionalpaymentdata-instrument), in § 5.2
  - [dict-member for SecurePaymentConfirmationRequest](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-instrument), in § 4.1.5
- [isPayment](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionspaymentinputs-ispayment), in § 5
- [isSecurePaymentConfirmationAvailable()](https://www.w3.org/TR/secure-payment-confirmation/#dom-paymentrequest-issecurepaymentconfirmationavailable), in § 4.1.7
- [locale](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-locale), in § 4.1.5
- payeeName
  - [dict-member for AuthenticationExtensionsPaymentInputs](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionspaymentinputs-payeename), in § 5
  - [dict-member for CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dom-collectedclientadditionalpaymentdata-payeename), in § 5.2
  - [dict-member for SecurePaymentConfirmationRequest](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-payeename), in § 4.1.5
- payeeOrigin
  - [dict-member for AuthenticationExtensionsPaymentInputs](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionspaymentinputs-payeeorigin), in § 5
  - [dict-member for CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dom-collectedclientadditionalpaymentdata-payeeorigin), in § 5.2
  - [dict-member for SecurePaymentConfirmationRequest](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-payeeorigin), in § 4.1.5
- payment
  - [dict-member for AuthenticationExtensionsClientInputs](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionsclientinputs-payment), in § 5
  - [dict-member for CollectedClientPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dom-collectedclientpaymentdata-payment), in § 5.1
- [PaymentCredentialInstrument](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-paymentcredentialinstrument), in § 6.1
- rpId
  - [dict-member for AuthenticationExtensionsPaymentInputs](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionspaymentinputs-rpid), in § 5
  - [dict-member for CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dom-collectedclientadditionalpaymentdata-rpid), in § 5.2
  - [dict-member for SecurePaymentConfirmationRequest](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-rpid), in § 4.1.5
- [secure-payment-confirmation](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation), in § 4.1.1
- [Secure Payment Confirmation payment handler](https://www.w3.org/TR/secure-payment-confirmation/#secure-payment-confirmation-payment-handler), in § 4.1
- [SecurePaymentConfirmationRequest](https://www.w3.org/TR/secure-payment-confirmation/#dictdef-securepaymentconfirmationrequest), in § 4.1.5
- [Set SPC Transaction Mode](https://www.w3.org/TR/secure-payment-confirmation/#set-spc-transaction-mode), in § 9.1
- [showOptOut](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-showoptout), in § 4.1.5
- [SPC Credential](https://www.w3.org/TR/secure-payment-confirmation/#spc-credential), in § 2
- [Steps to silently determine if a credential is available for the current device](https://www.w3.org/TR/secure-payment-confirmation/#steps-to-silently-determine-if-a-credential-is-available-for-the-current-device), in § 2
- [Steps to silently determine if an SPC Credential is third-party enabled](https://www.w3.org/TR/secure-payment-confirmation/#steps-to-silently-determine-if-an-spc-credential-is-third-party-enabled), in § 2
- [Third-party enabled SPC Credential](https://www.w3.org/TR/secure-payment-confirmation/#third-party-enabled-spc-credential), in § 2
- [timeout](https://www.w3.org/TR/secure-payment-confirmation/#dom-securepaymentconfirmationrequest-timeout), in § 4.1.5
- topOrigin
  - [dict-member for AuthenticationExtensionsPaymentInputs](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionspaymentinputs-toporigin), in § 5
  - [dict-member for CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dom-collectedclientadditionalpaymentdata-toporigin), in § 5.2
- total
  - [dict-member for AuthenticationExtensionsPaymentInputs](https://www.w3.org/TR/secure-payment-confirmation/#dom-authenticationextensionspaymentinputs-total), in § 5
  - [dict-member for CollectedClientAdditionalPaymentData](https://www.w3.org/TR/secure-payment-confirmation/#dom-collectedclientadditionalpaymentdata-total), in § 5.2

### Terms defined by reference

- \[CREDENTIAL-MANAGEMENT-1\] defines the following terms:
   - Create Permissions Policy
  - create()
  - get()
  - id
  - request a credential
- \[ECMASCRIPT\] defines the following terms:
   - internal method
- \[FETCH\] defines the following terms:
   - request
- \[HTML\] defines the following terms:
   - consume user activation
  - current settings object
  - in parallel
  - origin
  - origin (for environment settings object)
  - relevant global object
  - relevant settings object
  - serialization of an origin
  - top-level origin
  - transient activation
- \[I18N-GLOSSARY\] defines the following terms:
   - bidi isolation
  - language negotiation
  - language priority list
  - locale
- \[IMAGE-RESOURCE\] defines the following terms:
   - fetching an image resource
  - src
- \[INFRA\] defines the following terms:
   - append
- \[PAYMENT-METHOD-ID\] defines the following terms:
   - registry of standardized payment methods
  - standardized payment method identifier
- \[PAYMENT-REQUEST\] defines the following terms:
   - PaymentCurrencyAmount
  - PaymentRequest
  - canMakePayment()
  - constructor()
  - currency
  - payment handler
  - payment method
  - payment method additional data type
  - payment permission string
  - payment request accessibility considerations
  - payment request details
  - show()
  - steps to check if a payment can be made
  - steps to respond to a payment request
  - steps to validate payment method data
  - total
  - value
- \[URL\] defines the following terms:
   - origin
  - scheme
  - URL parser
  - valid domain
- \[WEB-AUTHN\] defines the following terms:
   - authentication ceremony
  - authentication extension
  - client extension
  - credential ID
  - discoverable credential
  - extension identifier
  - public key credential
  - registration extension
  - relying party
  - relying party identifier
  - user member
  - WebAuthn Extension
- \[WEBAUTHN-3\] defines the following terms:
   - AuthenticationExtensionsClientInputs
  - CollectedClientData
  - PublicKeyCredential
  - PublicKeyCredentialDescriptor
  - PublicKeyCredentialRequestOptions
  - \[\[Create\]\](origin, options, sameOriginWithAncestors)
  - \[\[DiscoverFromExternalSource\]\](origin, options, sameOriginWithAncestors)
  - allowCredentials
  - authenticatorAttachment
  - authenticatorSelection
  - challenge (for CollectedClientData)
  - challenge (for PublicKeyCredentialRequestOptions)
  - displayName
  - extensions
  - id
  - internal
  - name
  - origin
  - platform
  - preferred
  - public-key
  - publicKey
  - publickey-credentials-create-feature
  - required (for ResidentKeyRequirement)
  - required (for UserVerificationRequirement)
  - residentKey
  - rpId
  - timeout
  - transports
  - type (for CollectedClientData)
  - type (for PublicKeyCredentialDescriptor)
  - userVerification (for AuthenticatorSelectionCriteria)
  - userVerification (for PublicKeyCredentialRequestOptions)
- \[WEBDRIVER1\] defines the following terms:
   - extension command
  - getting a property
  - invalid argument
  - remote end steps
  - success
  - undefined
  - WebDriver error
  - WebDriver error code
- \[WEBIDL\] defines the following terms:
   - BufferSource
  - DOMException
  - NotAllowedError
  - OptOutError
  - Promise
  - RangeError
  - SecurityError
  - TypeError
  - USVString
  - a promise rejected with
  - boolean
  - sequence
  - unsigned long

## References

### Normative References

\[CREDENTIAL-MANAGEMENT-1\]
 Nina Satragno; Marcos Caceres. [Credential Management Level 1](https://www.w3.org/TR/credential-management-1/). 13 August 2024. WD. URL: [https://www.w3.org/TR/credential-management-1/](https://www.w3.org/TR/credential-management-1/)\[ECMASCRIPT\]
 [ECMAScript Language Specification](https://tc39.es/ecma262/multipage/). URL: [https://tc39.es/ecma262/multipage/](https://tc39.es/ecma262/multipage/)\[FETCH\]
 Anne van Kesteren. [Fetch Standard](https://fetch.spec.whatwg.org/). Living Standard. URL: [https://fetch.spec.whatwg.org/](https://fetch.spec.whatwg.org/)\[HTML\]
 Anne van Kesteren; et al. [HTML Standard](https://html.spec.whatwg.org/multipage/). Living Standard. URL: [https://html.spec.whatwg.org/multipage/](https://html.spec.whatwg.org/multipage/)\[I18N-GLOSSARY\]
 Richard Ishida; Addison Phillips. [Internationalization Glossary](https://www.w3.org/TR/i18n-glossary/). 17 October 2024. NOTE. URL: [https://www.w3.org/TR/i18n-glossary/](https://www.w3.org/TR/i18n-glossary/)\[IANA-WebAuthn-Registries\]
 [Registries for Web Authentication (WebAuthn)](https://www.rfc-editor.org/rfc/rfc8809.html). URL: [https://www.rfc-editor.org/rfc/rfc8809.html](https://www.rfc-editor.org/rfc/rfc8809.html)\[IMAGE-RESOURCE\]
 Aaron Gustafson; Rayan Kanso; Marcos Caceres. [Image Resource](https://www.w3.org/TR/image-resource/). 4 June 2021. WD. URL: [https://www.w3.org/TR/image-resource/](https://www.w3.org/TR/image-resource/)\[INFRA\]
 Anne van Kesteren; Domenic Denicola. [Infra Standard](https://infra.spec.whatwg.org/). Living Standard. URL: [https://infra.spec.whatwg.org/](https://infra.spec.whatwg.org/)\[PAYMENT-METHOD-ID\]
 Marcos Caceres. [Payment Method Identifiers](https://www.w3.org/TR/payment-method-id/). 8 September 2022. REC. URL: [https://www.w3.org/TR/payment-method-id/](https://www.w3.org/TR/payment-method-id/)\[PAYMENT-REQUEST\]
 Marcos Caceres; Rouslan Solomakhin; Ian Jacobs. [Payment Request API](https://www.w3.org/TR/payment-request/). 9 September 2024. CRD. URL: [https://www.w3.org/TR/payment-request/](https://www.w3.org/TR/payment-request/)\[RFC2119\]
 S. Bradner. [Key words for use in RFCs to Indicate Requirement Levels](https://datatracker.ietf.org/doc/html/rfc2119). March 1997. Best Current Practice. URL: [https://datatracker.ietf.org/doc/html/rfc2119](https://datatracker.ietf.org/doc/html/rfc2119)\[RFC8809\]
 J. Hodges; G. Mandyam; M. Jones. [Registries for Web Authentication (WebAuthn)](https://www.rfc-editor.org/rfc/rfc8809). August 2020. Informational. URL: [https://www.rfc-editor.org/rfc/rfc8809](https://www.rfc-editor.org/rfc/rfc8809)\[URL\]
 Anne van Kesteren. [URL Standard](https://url.spec.whatwg.org/). Living Standard. URL: [https://url.spec.whatwg.org/](https://url.spec.whatwg.org/)\[WEBAUTHN-3\]
 Tim Cappalli; et al. [Web Authentication: An API for accessing Public Key Credentials - Level 3](https://www.w3.org/TR/webauthn-3/). 27 January 2025. WD. URL: [https://www.w3.org/TR/webauthn-3/](https://www.w3.org/TR/webauthn-3/)\[WEBDRIVER1\]
 Simon Stewart; David Burns. [WebDriver](https://www.w3.org/TR/webdriver1/). 5 June 2018. REC. URL: [https://www.w3.org/TR/webdriver1/](https://www.w3.org/TR/webdriver1/)\[WebDriver2\]
 Simon Stewart; David Burns. [WebDriver](https://www.w3.org/TR/webdriver2/). 6 March 2025. WD. URL: [https://www.w3.org/TR/webdriver2/](https://www.w3.org/TR/webdriver2/)\[WEBIDL\]
 Edgar Chen; Timothy Gu. [Web IDL Standard](https://webidl.spec.whatwg.org/). Living Standard. URL: [https://webidl.spec.whatwg.org/](https://webidl.spec.whatwg.org/)

### Informative References

\[BCP47\]
 A. Phillips, Ed.; M. Davis, Ed.. [Tags for Identifying Languages](https://www.rfc-editor.org/rfc/rfc5646). September 2009. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc5646](https://www.rfc-editor.org/rfc/rfc5646)\[RFC2397\]
 L. Masinter. [The "data" URL scheme](https://www.rfc-editor.org/rfc/rfc2397). August 1998. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc2397](https://www.rfc-editor.org/rfc/rfc2397)\[RFC4647\]
 A. Phillips, Ed.; M. Davis, Ed.. [Matching of Language Tags](https://www.rfc-editor.org/rfc/rfc4647). September 2006. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc4647](https://www.rfc-editor.org/rfc/rfc4647)\[WEBAUTHN-CONDITIONAL-UI\]
 [WebAuthn Conditional UI Proposal](https://github.com/w3c/webauthn/issues/1545). URL: [https://github.com/w3c/webauthn/issues/1545](https://github.com/w3c/webauthn/issues/1545)

## IDL Index

```
dictionary SecurePaymentConfirmationRequest {
    required BufferSource challenge;
    required USVString rpId;
    required sequence<BufferSource> credentialIds;
    required PaymentCredentialInstrument instrument;
    unsigned long timeout;
    USVString payeeName;
    USVString payeeOrigin;
    AuthenticationExtensionsClientInputs extensions;
    sequence<USVString> locale;
    boolean showOptOut;
};

partial interface PaymentRequest {
    static Promise<boolean> isSecurePaymentConfirmationAvailable();
};

partial dictionary AuthenticationExtensionsClientInputs {
  AuthenticationExtensionsPaymentInputs payment;
};

dictionary AuthenticationExtensionsPaymentInputs {
  boolean isPayment;

  // Only used for authentication.
  USVString rpId;
  USVString topOrigin;
  USVString payeeName;
  USVString payeeOrigin;
  PaymentCurrencyAmount total;
  PaymentCredentialInstrument instrument;
};

dictionary CollectedClientPaymentData : CollectedClientData {
    required CollectedClientAdditionalPaymentData payment;
};

dictionary CollectedClientAdditionalPaymentData {
    required USVString rpId;
    required USVString topOrigin;
    USVString payeeName;
    USVString payeeOrigin;
    required PaymentCurrencyAmount total;
    required PaymentCredentialInstrument instrument;
};

dictionary PaymentCredentialInstrument {
    required USVString displayName;
    required USVString icon;
    boolean iconMustBeShown = true;
};

```