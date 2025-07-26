---
tags:
  - "#web-security"
  - "#authentication"
  - "#cryptographic-security"
  - "#web-api"
  - "#webauthn-protocol"
  - "#identity-verification"
  - "#credential-management"
---

## Abstract

This specification defines an API enabling the creation and use of strong, attested, [scoped](https://www.w3.org/TR/webauthn-2/#scope), public key-based

credentials by [web applications](https://www.w3.org/TR/webauthn-2/#web-application), for the purpose of strongly authenticating users. Conceptually, one or more [public key\\
credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential), each [scoped](https://www.w3.org/TR/webauthn-2/#scope) to a given [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party), are created by and [bound](https://www.w3.org/TR/webauthn-2/#bound-credential) to [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) as requested by the web application. The user agent mediates access to [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) and their [public\\
key credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential) in order to preserve user
privacy. [Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) are responsible for ensuring that no operation is performed without [user consent](https://www.w3.org/TR/webauthn-2/#user-consent). [Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) provide cryptographic proof of their properties to [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) via [attestation](https://www.w3.org/TR/webauthn-2/#attestation). This
specification also describes the functional model for WebAuthn conformant [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator), including their signature and [attestation](https://www.w3.org/TR/webauthn-2/#attestation) functionality.

## Status of this document

_This section describes the status of this document at the time of its publication. Other_
_documents may supersede this document. A list of current_
_W3C publications and the latest revision of this_
_technical report can be found in the_
_[W3C technical\_\
_reports index](https://www.w3.org/TR/) at https://www.w3.org/TR/._

This document was published by the [Web Authentication Working Group](https://www.w3.org/webauthn/)
as a Recommendation.

Feedback and comments on this specification are welcome. Please use
[Github issues](https://github.com/w3c/webauthn/issues).
Discussions may also be found in the
[public-webauthn@w3.org archives](https://lists.w3.org/Archives/Public/public-webauthn/).


A W3C Recommendation is a specification that, after extensive consensus-building, has received the endorsement of the W3C and its Members. W3C recommends the wide deployment of this specification as a standard for the Web.

This document has been reviewed by W3C Members, by
software developers, and by other W3C groups and
interested parties, and is endorsed by the Director as a
W3C Recommendation. It is a stable document and may be
used as reference material or cited from another
document. W3C's role in making the Recommendation is to
draw attention to the specification and to promote its
widespread deployment. This enhances the functionality
and interoperability of the Web.


This document was produced by a group operating under the
[1 August 2017\\
W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy-20170801/).
W3C maintains a
[public list of any\\
patent disclosures](https://www.w3.org/2004/01/pp-impl/87227/status) made in connection with the deliverables of the group; that page also
includes instructions for disclosing a patent. An individual who has actual knowledge of a
patent which the individual believes contains
[Essential\\
Claim(s)](https://www.w3.org/Consortium/Patent-Policy-20170801/#def-essential) must disclose the information in accordance with
[section 6 of the\\
W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy-20170801/#sec-Disclosure).


This document is governed by the [15 September 2020 W3C Process Document](https://www.w3.org/2020/Process-20200915/).

## 1\. Introduction

_This section is not normative._

This specification defines an API enabling the creation and use of strong, attested, [scoped](https://www.w3.org/TR/webauthn-2/#scope), public key-based
credentials by [web applications](https://www.w3.org/TR/webauthn-2/#web-application), for the purpose of strongly authenticating users. A [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) is
created and stored by a _[WebAuthn Authenticator](https://www.w3.org/TR/webauthn-2/#webauthn-authenticator)_ at the behest of a _[WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party)_, subject to _[user\_\
_consent](https://www.w3.org/TR/webauthn-2/#user-consent)_. Subsequently, the [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) can only be accessed by [origins](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) belonging to that [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party).
This scoping is enforced jointly by _[conforming User Agents](https://www.w3.org/TR/webauthn-2/#conforming-user-agent)_ and _[authenticators](https://www.w3.org/TR/webauthn-2/#authenticator)_.
Additionally, privacy across [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) is maintained; [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) are not able to detect any properties, or even
the existence, of credentials [scoped](https://www.w3.org/TR/webauthn-2/#scope) to other [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party).

[Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) employ the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) during two distinct, but related, [ceremonies](https://www.w3.org/TR/webauthn-2/#ceremony) involving a user. The first
is [Registration](https://www.w3.org/TR/webauthn-2/#registration), where a [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) is created on an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator), and [scoped](https://www.w3.org/TR/webauthn-2/#scope) to a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) with the present user’s account (the account might already exist or might be created at this time). The second is [Authentication](https://www.w3.org/TR/webauthn-2/#authentication), where the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) is presented with an _[Authentication Assertion](https://www.w3.org/TR/webauthn-2/#authentication-assertion)_ proving the presence
and [consent](https://www.w3.org/TR/webauthn-2/#user-consent) of the user who registered the [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential). Functionally, the [Web Authentication\\
API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) comprises a `PublicKeyCredential` which extends the Credential Management API [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1), and
infrastructure which allows those credentials to be used with `navigator.credentials.create()` and `navigator.credentials.get()`. The former is used during [Registration](https://www.w3.org/TR/webauthn-2/#registration), and the
latter during [Authentication](https://www.w3.org/TR/webauthn-2/#authentication).

Broadly, compliant [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) protect [public key credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential), and interact with user agents to implement the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#web-authentication-api).
Implementing compliant authenticators is possible in software executing
(a) on a general-purpose computing device,
(b) on an on-device Secure Execution Environment, Trusted Platform Module (TPM), or a Secure Element (SE), or
(c) off device.
Authenticators being implemented on device are called [platform authenticators](https://www.w3.org/TR/webauthn-2/#platform-authenticators).
Authenticators being implemented off device ( [roaming authenticators](https://www.w3.org/TR/webauthn-2/#roaming-authenticators)) can be accessed over a transport such
as Universal Serial Bus (USB), Bluetooth Low Energy (BLE), or Near Field Communications (NFC).

### 1.1. Specification Roadmap

While many W3C specifications are directed primarily to user agent developers and also to web application developers
(i.e., "Web authors"), the nature of Web Authentication requires that this specification be correctly used by multiple audiences,
as described below.

**All audiences** ought to begin with [§ 1.2 Use Cases](https://www.w3.org/TR/webauthn-2/#sctn-use-cases), [§ 1.3 Sample API Usage Scenarios](https://www.w3.org/TR/webauthn-2/#sctn-sample-scenarios), and [§ 4 Terminology](https://www.w3.org/TR/webauthn-2/#sctn-terminology), and should also
refer to [\[WebAuthnAPIGuide\]](https://www.w3.org/TR/webauthn-2/#biblio-webauthnapiguide) for an overall tutorial.
Beyond that, the intended audiences for this document are the following main groups:

- [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) web application developers, especially those responsible for [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) [web application](https://www.w3.org/TR/webauthn-2/#web-application) login flows, account recovery flows,
  user account database content, etc.

- Web framework developers
  - The above two audiences should in particular refer to [§ 7 WebAuthn Relying Party Operations](https://www.w3.org/TR/webauthn-2/#sctn-rp-operations).
    The introduction to [§ 5 Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) may be helpful, though readers should realize that the [§ 5 Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) section is targeted specifically
    at user agent developers, not web application developers.
    Additionally, if they intend to verify [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) [attestations](https://www.w3.org/TR/webauthn-2/#attestation), then [§ 6.5 Attestation](https://www.w3.org/TR/webauthn-2/#sctn-attestation) and [§ 8 Defined Attestation Statement Formats](https://www.w3.org/TR/webauthn-2/#sctn-defined-attestation-formats) will also be relevant. [§ 9 WebAuthn Extensions](https://www.w3.org/TR/webauthn-2/#sctn-extensions), and [§ 10 Defined Extensions](https://www.w3.org/TR/webauthn-2/#sctn-defined-extensions) will be of interest if they wish to make use of extensions.
    Finally, they should read [§ 13.4 Security considerations for Relying Parties](https://www.w3.org/TR/webauthn-2/#sctn-security-considerations-rp) and [§ 14.6 Privacy considerations for Relying Parties](https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-rp) and consider which challenges apply to their application and users.
- User agent developers

- OS platform developers, responsible for OS platform API design and implementation in regards to platform-specific [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) APIs, platform [WebAuthn Client](https://www.w3.org/TR/webauthn-2/#webauthn-client) instantiation, etc.
  - The above two audiences should read [§ 5 Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) very carefully, along with [§ 9 WebAuthn Extensions](https://www.w3.org/TR/webauthn-2/#sctn-extensions) if they intend to support extensions.
    They should also carefully read [§ 14.5 Privacy considerations for clients](https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client).
- [Authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) developers. These readers will want to pay particular attention to [§ 6 WebAuthn Authenticator Model](https://www.w3.org/TR/webauthn-2/#sctn-authenticator-model), [§ 8 Defined Attestation Statement Formats](https://www.w3.org/TR/webauthn-2/#sctn-defined-attestation-formats), [§ 9 WebAuthn Extensions](https://www.w3.org/TR/webauthn-2/#sctn-extensions), and [§ 10 Defined Extensions](https://www.w3.org/TR/webauthn-2/#sctn-defined-extensions).
  They should also carefully read [§ 13.3 Security considerations for authenticators](https://www.w3.org/TR/webauthn-2/#sctn-security-considerations-authenticator) and [§ 14.4 Privacy considerations for authenticators](https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-authenticator).


Note: Along with the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) itself, this specification defines a
request-response _cryptographic protocol_—the WebAuthn/FIDO2 protocol—between
a [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) server and an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator), where the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)'s request consists of a [challenge](https://www.w3.org/TR/webauthn-2/#sctn-cryptographic-challenges) and other
input data supplied by the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) and sent to the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).
The request is conveyed via the
combination of HTTPS, the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) [web application](https://www.w3.org/TR/webauthn-2/#web-application), the [WebAuthn API](https://www.w3.org/TR/webauthn-2/#sctn-api), and the platform-specific communications channel
between the user agent and the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).
The [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) replies with a digitally signed [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) message and other output data, which is conveyed back to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) server via the same path in reverse. Protocol details vary according to whether an [authentication](https://www.w3.org/TR/webauthn-2/#authentication) or [registration](https://www.w3.org/TR/webauthn-2/#registration) operation is invoked by the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party).
See also [Figure 1](https://www.w3.org/TR/webauthn-2/#fig-registration) and [Figure 2](https://www.w3.org/TR/webauthn-2/#fig-authentication).


**It is important for Web Authentication deployments' end-to-end security** that the role of each
component—the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) server, the [client](https://www.w3.org/TR/webauthn-2/#client), and the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)—
as well as [§ 13 Security Considerations](https://www.w3.org/TR/webauthn-2/#sctn-security-considerations) and [§ 14 Privacy Considerations](https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations), are understood _by all audiences_.

### 1.2. Use Cases

The below use case scenarios illustrate use of two very different types of [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator), as well as outline further
scenarios. Additional scenarios, including sample code, are given later in [§ 1.3 Sample API Usage Scenarios](https://www.w3.org/TR/webauthn-2/#sctn-sample-scenarios).

#### 1.2.1. Registration

- On a phone:
  - User navigates to example.com in a browser and signs in to an existing account using whatever method they have been using
    (possibly a legacy method such as a password), or creates a new account.

  - The phone prompts, "Do you want to register this device with example.com?"

  - User agrees.

  - The phone prompts the user for a previously configured [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) (PIN, biometric, etc.); the user
    provides this.

  - Website shows message, "Registration complete."

#### 1.2.2. Authentication

- On a laptop or desktop:
  - User pairs their phone with the laptop or desktop via Bluetooth.

  - User navigates to example.com in a browser and initiates signing in.

  - User gets a message from the browser, "Please complete this action on your phone."
- Next, on their phone:
  - User sees a discrete prompt or notification, "Sign in to example.com."

  - User selects this prompt / notification.

  - User is shown a list of their example.com identities, e.g., "Sign in as Mohamed / Sign in as 张三".

  - User picks an identity, is prompted for an [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) (PIN, biometric, etc.) and provides this.
- Now, back on the laptop:
  - Web page shows that the selected user is signed in, and navigates to the signed-in page.

#### 1.2.3. New Device Registration

This use case scenario illustrates how a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) can leverage a combination of a [roaming authenticator](https://www.w3.org/TR/webauthn-2/#roaming-authenticators) (e.g., a USB security
key fob) and a [platform authenticator](https://www.w3.org/TR/webauthn-2/#platform-authenticators) (e.g., a built-in fingerprint sensor) such that the user has:

- a "primary" [roaming authenticator](https://www.w3.org/TR/webauthn-2/#roaming-authenticators) that they use to authenticate on new-to-them [client devices](https://www.w3.org/TR/webauthn-2/#client-device) (e.g., laptops,
  desktops) or on such [client devices](https://www.w3.org/TR/webauthn-2/#client-device) that lack a [platform authenticator](https://www.w3.org/TR/webauthn-2/#platform-authenticators), and

- a low-friction means to strongly re-authenticate on [client devices](https://www.w3.org/TR/webauthn-2/#client-device) having [platform authenticators](https://www.w3.org/TR/webauthn-2/#platform-authenticators).


Note: This approach of registering multiple [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) for an account is also useful in account recovery use cases.

- First, on a desktop computer (lacking a [platform authenticator](https://www.w3.org/TR/webauthn-2/#platform-authenticators)):


  - User navigates to `example.com` in a browser and signs in to an existing account using whatever method they have been using
    (possibly a legacy method such as a password), or creates a new account.

  - User navigates to account security settings and selects "Register security key".

  - Website prompts the user to plug in a USB security key fob; the user does.

  - The USB security key blinks to indicate the user should press the button on it; the user does.

  - Website shows message, "Registration complete."


Note: Since this computer lacks a [platform authenticator](https://www.w3.org/TR/webauthn-2/#platform-authenticators), the website may require the user to present their USB security
key from time to time or each time the user interacts with the website. This is at the website’s discretion.

- Later, on their laptop (which features a [platform authenticator](https://www.w3.org/TR/webauthn-2/#platform-authenticators)):
  - User navigates to example.com in a browser and initiates signing in.

  - Website prompts the user to plug in their USB security key.

  - User plugs in the previously registered USB security key and presses the button.

  - Website shows that the user is signed in, and navigates to the signed-in page.

  - Website prompts, "Do you want to register this computer with example.com?"

  - User agrees.

  - Laptop prompts the user for a previously configured [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) (PIN, biometric, etc.); the user provides this.

  - Website shows message, "Registration complete."

  - User signs out.
- Later, again on their laptop:
  - User navigates to example.com in a browser and initiates signing in.

  - Website shows message, "Please follow your computer’s prompts to complete sign in."

  - Laptop prompts the user for an [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) (PIN, biometric, etc.); the user provides this.

  - Website shows that the user is signed in, and navigates to the signed-in page.

#### 1.2.4. Other Use Cases and Configurations

A variety of additional use cases and configurations are also possible, including (but not limited to):

- A user navigates to example.com on their laptop, is guided through a flow to create and register a credential on their phone.

- A user obtains a discrete, [roaming authenticator](https://www.w3.org/TR/webauthn-2/#roaming-authenticators), such as a "fob" with USB or USB+NFC/BLE connectivity options, loads
  example.com in their browser on a laptop or phone, and is guided through a flow to create and register a credential on the
  fob.

- A [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) prompts the user for their [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) in order to authorize a single transaction, such as a payment
  or other financial transaction.


### 1.3. Sample API Usage Scenarios

_This section is not normative._

In this section, we walk through some events in the lifecycle of a [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential), along with the corresponding
sample code for using this API. Note that this is an example flow and does not limit the scope of how the API can be used.

As was the case in earlier sections, this flow focuses on a use case involving a [first-factor roaming authenticator](https://www.w3.org/TR/webauthn-2/#first-factor-roaming-authenticator) with its own display. One example of such an authenticator would be a smart phone. Other authenticator types are also supported
by this API, subject to implementation by the [client platform](https://www.w3.org/TR/webauthn-2/#client-platform). For instance, this flow also works without modification for the case of
an authenticator that is embedded in the [client device](https://www.w3.org/TR/webauthn-2/#client-device). The flow also works for the case of an authenticator without
its own display (similar to a smart card) subject to specific implementation considerations. Specifically, the [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) needs to display any prompts that would otherwise be shown by the authenticator, and the authenticator needs to allow the [client\\
platform](https://www.w3.org/TR/webauthn-2/#client-platform) to enumerate all the authenticator’s credentials so that the client can have information to show appropriate prompts.

#### 1.3.1. Registration

This is the first-time flow, in which a new credential is created and registered with the server.
In this flow, the [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) does not have a preference for [platform authenticator](https://www.w3.org/TR/webauthn-2/#platform-authenticators) or [roaming authenticators](https://www.w3.org/TR/webauthn-2/#roaming-authenticators).

1. The user visits example.com, which serves up a script. At this point, the user may already be logged in using a legacy
   username and password, or additional authenticator, or other means acceptable to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party).
   Or the user may be in the process of creating a new account.

2. The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script runs the code snippet below.

3. The [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) searches for and locates the authenticator.

4. The [client](https://www.w3.org/TR/webauthn-2/#client) connects to the authenticator, performing any pairing actions if necessary.

5. The authenticator shows appropriate UI for the user to provide a biometric or other [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture).

6. The authenticator returns a response to the [client](https://www.w3.org/TR/webauthn-2/#client), which in turn returns a response to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script. If
   the user declined to select an authenticator or provide authorization, an appropriate error is returned.

7. If a new credential was created,
   - The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script sends the newly generated [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) to the server, along with additional information
     such as attestation regarding the provenance and characteristics of the authenticator.

   - The server stores the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) in its database and associates it with the user as well as with the
     characteristics of authentication indicated by attestation, also storing a friendly name for later use.

   - The script may store data such as the [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) in local storage, to improve future UX by narrowing the choice of
     credential for the user.

The sample code for generating and registering a new key follows:

```
if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */ }

var publicKey = {
  // The challenge is produced by the server; see the Security Considerations
  challenge: new Uint8Array([21,31,105 /* 29 more random bytes generated by the server */]),

  // Relying Party:
  rp: {
    name: "ACME Corporation"
  },

  // User:
  user: {
    id: Uint8Array.from(window.atob("MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII="), c=>c.charCodeAt(0)),
    name: "alex.mueller@example.com",
    displayName: "Alex Müller",
  },

  // This Relying Party will accept either an ES256 or RS256 credential, but
  // prefers an ES256 credential.
  pubKeyCredParams: [\
    {\
      type: "public-key",\
      alg: -7 // "ES256" as registered in the IANA COSE Algorithms registry\
    },\
    {\
      type: "public-key",\
      alg: -257 // Value registered by this specification for "RS256"\
    }\
  ],

  authenticatorSelection: {
    // Try to use UV if possible. This is also the default.
    userVerification: "preferred"
  },

  timeout: 360000,  // 6 minutes
  excludeCredentials: [\
    // Don’t re-register any authenticator that has one of these credentials\
    {"id": Uint8Array.from(window.atob("ufJWp8YGlibm1Kd9XQBWN1WAw2jy5In2Xhon9HAqcXE="), c=>c.charCodeAt(0)), "type": "public-key"},\
    {"id": Uint8Array.from(window.atob("E/e1dhZc++mIsz4f9hb6NifAzJpF1V4mEtRlIPBiWdY="), c=>c.charCodeAt(0)), "type": "public-key"}\
  ],

  // Make excludeCredentials check backwards compatible with credentials registered with U2F
  extensions: {"appidExclude": "https://acme.example.com"}
};

// Note: The following call will cause the authenticator to display UI.
navigator.credentials.create({ publicKey })
  .then(function (newCredentialInfo) {
    // Send new credential info to server for verification and registration.
  }).catch(function (err) {
    // No acceptable authenticator or user refused consent. Handle appropriately.
  });

```

#### 1.3.2. Registration Specifically with User-Verifying Platform Authenticator

This is an example flow for when the [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) is specifically interested in creating a [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) with
a [user-verifying platform authenticator](https://www.w3.org/TR/webauthn-2/#user-verifying-platform-authenticator).

1. The user visits example.com and clicks on the login button, which redirects the user to login.example.com.

2. The user enters a username and password to log in. After successful login, the user is redirected back to example.com.

3. The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script runs the code snippet below.
   1. The user agent checks if a [user-verifying platform authenticator](https://www.w3.org/TR/webauthn-2/#user-verifying-platform-authenticator) is available. If not, terminate this flow.

   2. The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) asks the user if they want to create a credential with it. If not, terminate this flow.

   3. The user agent and/or operating system shows appropriate UI and guides the user in creating a credential
      using one of the available platform authenticators.

   4. Upon successful credential creation, the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script conveys the new credential to the server.

```
if (!window.PublicKeyCredential) { /* Client not capable of the API. Handle error. */ }

PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    .then(function (uvpaAvailable) {
        // If there is a user-verifying platform authenticator
        if (uvpaAvailable) {
            // Render some RP-specific UI and get a Promise for a Boolean value
            return askIfUserWantsToCreateCredential();
        }
    }).then(function (userSaidYes) {
        // If there is a user-verifying platform authenticator
        // AND the user wants to create a credential
        if (userSaidYes) {
            var publicKeyOptions = { /* Public key credential creation options. */};
            return navigator.credentials.create({ "publicKey": publicKeyOptions });
        }
    }).then(function (newCredentialInfo) {
        if (newCredentialInfo) {
            // Send new credential info to server for verification and registration.
        }
    }).catch(function (err) {
        // Something went wrong. Handle appropriately.
    });

```

#### 1.3.3. Authentication

This is the flow when a user with an already registered credential visits a website and wants to authenticate using the
credential.

1. The user visits example.com, which serves up a script.

2. The script asks the [client](https://www.w3.org/TR/webauthn-2/#client) for an Authentication Assertion, providing as much information as possible to narrow
   the choice of acceptable credentials for the user. This can be obtained from the data that was stored locally after
   registration, or by other means such as prompting the user for a username.

3. The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script runs one of the code snippets below.

4. The [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) searches for and locates the authenticator.

5. The [client](https://www.w3.org/TR/webauthn-2/#client) connects to the authenticator, performing any pairing actions if necessary.

6. The authenticator presents the user with a notification that their attention is needed. On opening the
   notification, the user is shown a friendly selection menu of acceptable credentials using the account information provided
   when creating the credentials, along with some information on the [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) that is requesting these keys.

7. The authenticator obtains a biometric or other [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) from the user.

8. The authenticator returns a response to the [client](https://www.w3.org/TR/webauthn-2/#client), which in turn returns a response to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script.
   If the user declined to select a credential or provide an authorization, an appropriate error is returned.

9. If an assertion was successfully generated and returned,
   - The script sends the assertion to the server.

   - The server examines the assertion, extracts the [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id), looks up the registered
     credential public key in its database, and verifies the [assertion signature](https://www.w3.org/TR/webauthn-2/#assertion-signature).
     If valid, it looks up the identity associated with the assertion’s [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id); that
     identity is now authenticated. If the [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) is not recognized by the server (e.g.,
     it has been deregistered due to inactivity) then the authentication has failed; each [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) will handle this in its own way.

   - The server now does whatever it would otherwise do upon successful authentication -- return a success page, set
     authentication cookies, etc.

If the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script does not have any hints available (e.g., from locally stored data) to help it narrow the list of
credentials, then the sample code for performing such an authentication might look like this:

```
if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */ }

// credentialId is generated by the authenticator and is an opaque random byte array
var credentialId = new Uint8Array([183, 148, 245 /* more random bytes previously generated by the authenticator */]);
var options = {
  // The challenge is produced by the server; see the Security Considerations
  challenge: new Uint8Array([4,101,15 /* 29 more random bytes generated by the server */]),
  timeout: 120000,  // 2 minutes
  allowCredentials: [{ type: "public-key", id: credentialId }]
};

navigator.credentials.get({ "publicKey": options })
    .then(function (assertion) {
    // Send assertion to server for verification
}).catch(function (err) {
    // No acceptable credential or user refused consent. Handle appropriately.
});

```

On the other hand, if the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script has some hints to help it narrow the list of credentials, then the sample code for
performing such an authentication might look like the following. Note that this sample also demonstrates how to use the [Credential Properties Extension](https://www.w3.org/TR/webauthn-2/#credprops).

```
if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */ }

var encoder = new TextEncoder();
var acceptableCredential1 = {
    type: "public-key",
    id: encoder.encode("BA44712732CE")
};
var acceptableCredential2 = {
    type: "public-key",
    id: encoder.encode("BG35122345NF")
};

var options = {
  // The challenge is produced by the server; see the Security Considerations
  challenge: new Uint8Array([8,18,33 /* 29 more random bytes generated by the server */]),
  timeout: 120000,  // 2 minutes
  allowCredentials: [acceptableCredential1, acceptableCredential2],
  extensions: { 'credProps': true }
};

navigator.credentials.get({ "publicKey": options })
    .then(function (assertion) {
    // Send assertion to server for verification
}).catch(function (err) {
    // No acceptable credential or user refused consent. Handle appropriately.
});

```

#### 1.3.4. Aborting Authentication Operations

The below example shows how a developer may use the AbortSignal parameter to abort a
credential registration operation. A similar procedure applies to an authentication operation.

```
const authAbortController = new AbortController();
const authAbortSignal = authAbortController.signal;

authAbortSignal.onabort = function () {
    // Once the page knows the abort started, inform user it is attempting to abort.
}

var options = {
    // A list of options.
}

navigator.credentials.create({
    publicKey: options,
    signal: authAbortSignal})
    .then(function (attestation) {
        // Register the user.
    }).catch(function (error) {
        if (error == "AbortError") {
            // Inform user the credential hasn’t been created.
            // Let the server know a key hasn’t been created.
        }
    });

// Assume widget shows up whenever authentication occurs.
if (widget == "disappear") {
    authAbortController.abort();
}

```

#### 1.3.5. Decommissioning

The following are possible situations in which decommissioning a credential might be desired. Note that all of these are
handled on the server side and do not need support from the API specified here.

- Possibility #1 -- user reports the credential as lost.
  - User goes to server.example.net, authenticates and follows a link to report a lost/stolen [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

  - Server returns a page showing the list of registered credentials with friendly names as configured during registration.

  - User selects a credential and the server deletes it from its database.

  - In the future, the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script does not specify this credential in any list of acceptable credentials, and assertions
    signed by this credential are rejected.
- Possibility #2 -- server deregisters the credential due to inactivity.
  - Server deletes credential from its database during maintenance activity.

  - In the future, the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script does not specify this credential in any list of acceptable credentials, and assertions
    signed by this credential are rejected.
- Possibility #3 -- user deletes the credential from the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).
  - User employs a [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)-specific method (e.g., device settings UI) to delete a credential from their [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

  - From this point on, this credential will not appear in any selection prompts, and no assertions can be generated with it.

  - Sometime later, the server deregisters this credential due to inactivity.

### 1.4. Platform-Specific Implementation Guidance

This specification defines how to use Web Authentication in the general case. When using Web
Authentication in connection with specific platform support (e.g. apps), it is recommended to see
platform-specific documentation and guides for additional guidance and limitations.

## 2\. Conformance

This specification defines three conformance classes. Each of these classes is specified so that conforming members of the class
are secure against non-conforming or hostile members of the other classes.

### 2.1. User Agents

A User Agent MUST behave as described by [§ 5 Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) in order to be considered conformant. [Conforming User Agents](https://www.w3.org/TR/webauthn-2/#conforming-user-agent) MAY implement
algorithms given in this specification in any way desired, so long as the end result is indistinguishable from the result that
would be obtained by the specification’s algorithms.

A conforming User Agent MUST also be a conforming implementation of the IDL fragments of this specification, as described in the
“Web IDL” specification. [\[WebIDL\]](https://www.w3.org/TR/webauthn-2/#biblio-webidl)

#### 2.1.1. Enumerations as DOMString types

Enumeration types are not referenced by other parts of the Web IDL because that
would preclude other values from being used without updating this specification
and its implementations. It is important for backwards compatibility that [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) and [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) handle unknown values. Enumerations for this
specification exist here for documentation and as a registry. Where the
enumerations are represented elsewhere, they are typed as `DOMString` s, for
example in `transports`.

### 2.2. Authenticators

A [WebAuthn Authenticator](https://www.w3.org/TR/webauthn-2/#webauthn-authenticator) MUST provide the operations defined by [§ 6 WebAuthn Authenticator Model](https://www.w3.org/TR/webauthn-2/#sctn-authenticator-model), and those operations MUST behave as
described there. This is a set of functional and security requirements for an authenticator to be usable by a [Conforming User\\
Agent](https://www.w3.org/TR/webauthn-2/#conforming-user-agent).

As described in [§ 1.2 Use Cases](https://www.w3.org/TR/webauthn-2/#sctn-use-cases), an authenticator may be implemented in the operating system underlying the User Agent, or in
external hardware, or a combination of both.

#### 2.2.1. Backwards Compatibility with FIDO U2F

[Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) that only support the [§ 8.6 FIDO U2F Attestation Statement Format](https://www.w3.org/TR/webauthn-2/#sctn-fido-u2f-attestation) have no mechanism to store a [user handle](https://www.w3.org/TR/webauthn-2/#user-handle), so the returned `userHandle` will always be null.

### 2.3. WebAuthn Relying Parties

A [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) MUST behave as described in [§ 7 WebAuthn Relying Party Operations](https://www.w3.org/TR/webauthn-2/#sctn-rp-operations) to obtain all the security benefits offered by this specification. See [§ 13.4.1 Security Benefits for WebAuthn Relying Parties](https://www.w3.org/TR/webauthn-2/#sctn-rp-benefits) for further discussion of this.

### 2.4. All Conformance Classes

All [CBOR](https://www.w3.org/TR/webauthn-2/#cbor) encoding performed by the members of the above conformance classes MUST be done using the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form).
All decoders of the above conformance classes SHOULD reject CBOR that is not validly encoded
in the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form) and SHOULD reject messages with duplicate map keys.

## 3\. Dependencies

This specification relies on several other underlying specifications, listed
below and in [Terms defined by reference](https://www.w3.org/TR/webauthn-2/#index-defined-elsewhere).

Base64url encoding


The term Base64url Encoding refers to the base64 encoding using the URL- and filename-safe character set defined
in Section 5 of [\[RFC4648\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc4648), with all trailing '=' characters omitted (as permitted by Section 3.2) and without the
inclusion of any line breaks, whitespace, or other additional characters.

CBOR


A number of structures in this specification, including attestation statements and extensions, are encoded using the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form) of the Compact Binary Object Representation (CBOR) [\[RFC8949\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8949),
as defined in [\[FIDO-CTAP\]](https://www.w3.org/TR/webauthn-2/#biblio-fido-ctap).

CDDL


This specification describes the syntax of all [CBOR](https://www.w3.org/TR/webauthn-2/#cbor)-encoded data using the CBOR Data Definition Language (CDDL) [\[RFC8610\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8610).

COSE


CBOR Object Signing and Encryption (COSE) [\[RFC8152\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8152). The IANA COSE Algorithms registry [\[IANA-COSE-ALGS-REG\]](https://www.w3.org/TR/webauthn-2/#biblio-iana-cose-algs-reg) established by this specification is also used.

Credential Management


The API described in this document is an extension of the `Credential` concept defined in [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1).

DOM


`DOMException` and the DOMException values used in this specification are defined in [\[DOM4\]](https://www.w3.org/TR/webauthn-2/#biblio-dom4).

ECMAScript


[%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor) is defined in [\[ECMAScript\]](https://www.w3.org/TR/webauthn-2/#biblio-ecmascript).

HTML


The concepts of [browsing context](https://html.spec.whatwg.org/multipage/browsers.html#browsing-context), [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin), [opaque origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque), [tuple origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-tuple), [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object),
and [is a registrable domain suffix of or is equal to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) are defined in [\[HTML\]](https://www.w3.org/TR/webauthn-2/#biblio-html).

URL


The concept of [same site](https://url.spec.whatwg.org/#host-same-site) is defined in [\[URL\]](https://www.w3.org/TR/webauthn-2/#biblio-url).

Web IDL


Many of the interface definitions and all of the IDL in this specification depend on [\[WebIDL\]](https://www.w3.org/TR/webauthn-2/#biblio-webidl). This updated version of
the Web IDL standard adds support for `Promise` s, which are now the preferred mechanism for asynchronous
interaction in all new web APIs.

FIDO AppID


The algorithms for [determining the FacetID of a calling application](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-the-facetid-of-a-calling-application) and [determining if a caller’s FacetID is authorized for an AppID](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-if-a-caller-s-facetid-is-authorized-for-an-appid) (used only in
the [AppID extension](https://www.w3.org/TR/webauthn-2/#appid)) are defined by [\[FIDO-APPID\]](https://www.w3.org/TR/webauthn-2/#biblio-fido-appid).

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in [\[RFC2119\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc2119).

## 4\. Terminology

Attestation

Generally, _attestation_ is a statement serving to bear witness, confirm, or authenticate.
In the WebAuthn context, [attestation](https://www.w3.org/TR/webauthn-2/#attestation) is employed to _attest_ to the _provenance_ of an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) and the data it emits; including, for example: [credential IDs](https://www.w3.org/TR/webauthn-2/#credential-id), [credential key pairs](https://www.w3.org/TR/webauthn-2/#credential-key-pair), signature counters, etc. An [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement) is conveyed in an [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object) during [registration](https://www.w3.org/TR/webauthn-2/#registration). See also [§ 6.5 Attestation](https://www.w3.org/TR/webauthn-2/#sctn-attestation) and [Figure 6](https://www.w3.org/TR/webauthn-2/#fig-attStructs). Whether or how the [client](https://www.w3.org/TR/webauthn-2/#client) conveys the [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement) and [AAGUID](https://www.w3.org/TR/webauthn-2/#aaguid) portions of the [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object) to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) is described by [attestation conveyance](https://www.w3.org/TR/webauthn-2/#attestation-conveyance).

Attestation Certificate

A X.509 Certificate for the attestation key pair used by an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) to attest to its manufacture
and capabilities. At [registration](https://www.w3.org/TR/webauthn-2/#registration) time, the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) uses the attestation private key to sign
the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)-specific [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) (and additional data) that it generates and returns via the [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) operation. [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) use the attestation public key conveyed in the [attestation\\
certificate](https://www.w3.org/TR/webauthn-2/#attestation-certificate) to verify the [attestation signature](https://www.w3.org/TR/webauthn-2/#attestation-signature). Note that in the case of [self attestation](https://www.w3.org/TR/webauthn-2/#self-attestation), the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) has no distinct [attestation key pair](https://www.w3.org/TR/webauthn-2/#attestation-key-pair) nor [attestation certificate](https://www.w3.org/TR/webauthn-2/#attestation-certificate), see [self\\
attestation](https://www.w3.org/TR/webauthn-2/#self-attestation) for details.

AuthenticationAuthentication Ceremony

The [ceremony](https://www.w3.org/TR/webauthn-2/#ceremony) where a user, and the user’s [client](https://www.w3.org/TR/webauthn-2/#client) (containing at least one [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)) work in
concert to cryptographically prove to a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) that the user controls the [credential private key](https://www.w3.org/TR/webauthn-2/#credential-private-key) of a
previously-registered [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) (see [Registration](https://www.w3.org/TR/webauthn-2/#registration)). Note that this includes a [test of user presence](https://www.w3.org/TR/webauthn-2/#test-of-user-presence) or [user verification](https://www.w3.org/TR/webauthn-2/#user-verification).

The WebAuthn [authentication ceremony](https://www.w3.org/TR/webauthn-2/#authentication-ceremony) is defined in [§ 7.2 Verifying an Authentication Assertion](https://www.w3.org/TR/webauthn-2/#sctn-verifying-assertion),
and is initiated by the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) calling `navigator.credentials.get()` with a `publicKey` argument.
See [§ 5 Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) for an introductory overview and [§ 1.3.3 Authentication](https://www.w3.org/TR/webauthn-2/#sctn-sample-authentication) for implementation examples.

Authentication AssertionAssertion

The cryptographically signed `AuthenticatorAssertionResponse` object returned by an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) as the result of an [authenticatorGetAssertion](https://www.w3.org/TR/webauthn-2/#authenticatorgetassertion) operation.

This corresponds to the [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1) specification’s single-use [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential).

AuthenticatorWebAuthn Authenticator

A cryptographic entity, existing in hardware or software, that can [register](https://www.w3.org/TR/webauthn-2/#registration) a user with a given [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) and later [assert possession](https://www.w3.org/TR/webauthn-2/#authentication-assertion) of the registered [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential), and optionally [verify the user](https://www.w3.org/TR/webauthn-2/#user-verification), when requested by the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party). [Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) can report information
regarding their [type](https://www.w3.org/TR/webauthn-2/#authenticator-type) and security characteristics via [attestation](https://www.w3.org/TR/webauthn-2/#attestation) during [registration](https://www.w3.org/TR/webauthn-2/#registration).

A [WebAuthn Authenticator](https://www.w3.org/TR/webauthn-2/#webauthn-authenticator) could be a [roaming authenticator](https://www.w3.org/TR/webauthn-2/#roaming-authenticators), a dedicated hardware subsystem integrated into the [client device](https://www.w3.org/TR/webauthn-2/#client-device),
or a software component of the [client](https://www.w3.org/TR/webauthn-2/#client) or [client device](https://www.w3.org/TR/webauthn-2/#client-device).

In general, an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) is assumed to have only one user.
If multiple natural persons share access to an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator),
they are considered to represent the same user in the context of that [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).
If an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) implementation supports multiple users in separated compartments,
then each compartment is considered a separate [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) with a single user with no access to other users' [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential).

Authorization Gesture

An [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) is a physical interaction performed by a user with an authenticator as part of a [ceremony](https://www.w3.org/TR/webauthn-2/#ceremony),
such as [registration](https://www.w3.org/TR/webauthn-2/#registration) or [authentication](https://www.w3.org/TR/webauthn-2/#authentication). By making such an [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture), a user [provides\\
consent](https://www.w3.org/TR/webauthn-2/#user-consent) for (i.e., _authorizes_) a [ceremony](https://www.w3.org/TR/webauthn-2/#ceremony) to proceed. This MAY involve [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) if the
employed [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) is capable, or it MAY involve a simple [test of user presence](https://www.w3.org/TR/webauthn-2/#test-of-user-presence).

Biometric Recognition

The automated recognition of individuals based on their biological and behavioral characteristics [\[ISOBiometricVocabulary\]](https://www.w3.org/TR/webauthn-2/#biblio-isobiometricvocabulary).

Biometric Authenticator

Any [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) that implements [biometric recognition](https://www.w3.org/TR/webauthn-2/#biometric-recognition).

Bound credential

A [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) or [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) is said to be [bound](https://www.w3.org/TR/webauthn-2/#bound-credential) to its [managing\\
authenticator](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-managing-authenticator). This means that only the [managing authenticator](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-managing-authenticator) can generate [assertions](https://www.w3.org/TR/webauthn-2/#assertion) for the [public key\\
credential sources](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) [bound](https://www.w3.org/TR/webauthn-2/#bound-credential) to it.

Ceremony

The concept of a [ceremony](https://www.w3.org/TR/webauthn-2/#ceremony) [\[Ceremony\]](https://www.w3.org/TR/webauthn-2/#biblio-ceremony) is an extension of the concept of a network protocol, with human nodes alongside
computer nodes and with communication links that include user interface(s), human-to-human communication, and transfers of
physical objects that carry data. What is out-of-band to a protocol is in-band to a ceremony. In this specification, [Registration](https://www.w3.org/TR/webauthn-2/#registration) and [Authentication](https://www.w3.org/TR/webauthn-2/#authentication) are ceremonies, and an [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) is often a component of
those [ceremonies](https://www.w3.org/TR/webauthn-2/#ceremony).

ClientWebAuthn Client

Also referred to herein as simply a [client](https://www.w3.org/TR/webauthn-2/#client). See also [Conforming User Agent](https://www.w3.org/TR/webauthn-2/#conforming-user-agent). A [WebAuthn Client](https://www.w3.org/TR/webauthn-2/#webauthn-client) is an intermediary entity typically implemented in the user agent (in whole, or in part). Conceptually, it underlies the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) and embodies the implementation of the `[[Create]](origin, options, sameOriginWithAncestors)` and `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` [internal methods](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots). It is responsible for both marshalling the inputs for the underlying [authenticator operations](https://www.w3.org/TR/webauthn-2/#authenticator-operations), and for returning the results of the latter operations to the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#web-authentication-api)'s callers.

The [WebAuthn Client](https://www.w3.org/TR/webauthn-2/#webauthn-client) runs on, and is distinct from, a [WebAuthn Client Device](https://www.w3.org/TR/webauthn-2/#webauthn-client-device).

Client DeviceWebAuthn Client Device

The hardware device on which the [WebAuthn Client](https://www.w3.org/TR/webauthn-2/#webauthn-client) runs, for example a smartphone, a laptop computer or a desktop computer, and the
operating system running on that hardware.

The distinctions between a [WebAuthn Client device](https://www.w3.org/TR/webauthn-2/#webauthn-client-device) and a [client](https://www.w3.org/TR/webauthn-2/#client) are:

- a single [client device](https://www.w3.org/TR/webauthn-2/#client-device) MAY support running multiple [clients](https://www.w3.org/TR/webauthn-2/#client), i.e., browser implementations,
  which all have access to the same [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) available on that [client device](https://www.w3.org/TR/webauthn-2/#client-device), and

- [platform authenticators](https://www.w3.org/TR/webauthn-2/#platform-authenticators) are bound to a [client device](https://www.w3.org/TR/webauthn-2/#client-device) rather than a [WebAuthn Client](https://www.w3.org/TR/webauthn-2/#webauthn-client).


A [client device](https://www.w3.org/TR/webauthn-2/#client-device) and a [client](https://www.w3.org/TR/webauthn-2/#client) together constitute a [client platform](https://www.w3.org/TR/webauthn-2/#client-platform).

Client Platform

A [client device](https://www.w3.org/TR/webauthn-2/#client-device) and a [client](https://www.w3.org/TR/webauthn-2/#client) together make up a [client platform](https://www.w3.org/TR/webauthn-2/#client-platform). A single hardware device MAY be part of multiple
distinct [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) at different times by running different operating systems and/or [clients](https://www.w3.org/TR/webauthn-2/#client).

Client-Side

This refers in general to the combination of the user’s [client platform](https://www.w3.org/TR/webauthn-2/#client-platform), [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator), and everything gluing
it all together.

Client-side discoverable Public Key Credential SourceClient-side discoverable CredentialDiscoverable Credential\[DEPRECATED\] Resident Credential\[DEPRECATED\] Resident Key

Note: Historically, [client-side discoverable credentials](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) have been known as [resident credentials](https://www.w3.org/TR/webauthn-2/#resident-credential) or [resident keys](https://www.w3.org/TR/webauthn-2/#resident-key).
Due to the phrases `ResidentKey` and `residentKey` being widely used in both the [WebAuthn \\
API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) and also in the [Authenticator Model](https://www.w3.org/TR/webauthn-2/#authenticator-model) (e.g., in dictionary member names, algorithm variable names, and
operation parameters) the usage of `resident` within their
names has not been changed for backwards compatibility purposes. Also, the term [resident key](https://www.w3.org/TR/webauthn-2/#resident-key) is
defined here as equivalent to a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential).

A [Client-side discoverable Public Key Credential Source](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-public-key-credential-source), or [Discoverable Credential](https://www.w3.org/TR/webauthn-2/#discoverable-credential) for short,
is a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) that is **_discoverable_** and usable in [authentication ceremonies](https://www.w3.org/TR/webauthn-2/#authentication-ceremony) where the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) does not provide any [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) s,
i.e., the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) invokes `navigator.credentials.get()` with an **_[empty](https://infra.spec.whatwg.org/#list-is-empty)_** `allowCredentials` argument. This means that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) does not necessarily need to first identify the user.

As a consequence, a [discoverable credential capable](https://www.w3.org/TR/webauthn-2/#discoverable-credential-capable) [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) can generate an [assertion signature](https://www.w3.org/TR/webauthn-2/#assertion-signature) for a [discoverable credential](https://www.w3.org/TR/webauthn-2/#discoverable-credential) given only an [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id),
which in turn necessitates that the [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) is stored in the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) or [client platform](https://www.w3.org/TR/webauthn-2/#client-platform).
This is in contrast to a [Server-side Public Key Credential Source](https://www.w3.org/TR/webauthn-2/#server-side-public-key-credential-source),
which requires that the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) is given both the [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) and the [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) but does not require [client-side](https://www.w3.org/TR/webauthn-2/#client-side) storage of the [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source).

See also: [client-side credential storage modality](https://www.w3.org/TR/webauthn-2/#client-side-credential-storage-modality) and [non-discoverable credential](https://www.w3.org/TR/webauthn-2/#non-discoverable-credential).

Note: [Client-side discoverable credentials](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) are also usable in [authentication ceremonies](https://www.w3.org/TR/webauthn-2/#authentication-ceremony) where [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) s are given,
i.e., when calling `navigator.credentials.get()` with a non- [empty](https://infra.spec.whatwg.org/#list-is-empty) `allowCredentials` argument.

Conforming User Agent

A user agent implementing, in cooperation with the underlying [client device](https://www.w3.org/TR/webauthn-2/#client-device), the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) and algorithms
given in this specification, and handling communication between [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) and [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party).

Credential ID

A probabilistically-unique [byte sequence](https://infra.spec.whatwg.org/#byte-sequence) identifying a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) and its [authentication assertions](https://www.w3.org/TR/webauthn-2/#authentication-assertion).

Credential IDs are generated by [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) in two forms:

1. At least 16 bytes that include at least 100 bits of entropy, or

2. The [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source), without its [Credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) or [mutable items](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-mutable-item), encrypted so only its [managing authenticator](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-managing-authenticator) can
   decrypt it. This form allows the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) to be nearly stateless, by having the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) store any necessary
   state.

   Note: [\[FIDO-UAF-AUTHNR-CMDS\]](https://www.w3.org/TR/webauthn-2/#biblio-fido-uaf-authnr-cmds) includes guidance on encryption techniques under "Security Guidelines".


[Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) do not need to distinguish these two [Credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) forms.

Credential Key PairCredential Private KeyCredential Public KeyUser Public Key

A [credential key pair](https://www.w3.org/TR/webauthn-2/#credential-key-pair) is a pair of asymmetric cryptographic keys generated by an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) and [scoped](https://www.w3.org/TR/webauthn-2/#scope) to a specific [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party). It is the central part of a [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential).

A [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) is the public key portion of a [credential key pair](https://www.w3.org/TR/webauthn-2/#credential-key-pair).
The [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) is returned to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) during a [registration ceremony](https://www.w3.org/TR/webauthn-2/#registration-ceremony).

A [credential private key](https://www.w3.org/TR/webauthn-2/#credential-private-key) is the private key portion of a [credential key pair](https://www.w3.org/TR/webauthn-2/#credential-key-pair).
The [credential private key](https://www.w3.org/TR/webauthn-2/#credential-private-key) is bound to a particular [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) \- its [managing authenticator](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-managing-authenticator) -
and is expected to never be exposed to any other party, not even to the owner of the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

Note that in the case of [self\\
attestation](https://www.w3.org/TR/webauthn-2/#self-attestation), the [credential key pair](https://www.w3.org/TR/webauthn-2/#credential-key-pair) is also used as the [attestation key pair](https://www.w3.org/TR/webauthn-2/#attestation-key-pair), see [self attestation](https://www.w3.org/TR/webauthn-2/#self-attestation) for details.

Note: The [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) is referred to as the [user public key](https://www.w3.org/TR/webauthn-2/#user-public-key) in FIDO UAF [\[UAFProtocol\]](https://www.w3.org/TR/webauthn-2/#biblio-uafprotocol), and in FIDO U2F [\[FIDO-U2F-Message-Formats\]](https://www.w3.org/TR/webauthn-2/#biblio-fido-u2f-message-formats) and some parts of this specification that relate to it.

Credential Properties

A [credential property](https://www.w3.org/TR/webauthn-2/#credential-properties) is some characteristic property of a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source), such as whether it is a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) or a [server-side credential](https://www.w3.org/TR/webauthn-2/#server-side-credential).

Human Palatability

An identifier that is [human-palatable](https://www.w3.org/TR/webauthn-2/#human-palatability) is intended to be rememberable and reproducible by typical human
users, in contrast to identifiers that are, for example, randomly generated sequences of bits [\[EduPersonObjectClassSpec\]](https://www.w3.org/TR/webauthn-2/#biblio-edupersonobjectclassspec).

Non-Discoverable Credential

This is a [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) whose [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) must be provided in `allowCredentials` when calling `navigator.credentials.get()` because it is not [client-side discoverable](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential). See also [server-side credentials](https://www.w3.org/TR/webauthn-2/#server-side-credential).

Public Key Credential Source

A [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source) ( [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1)) used by an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) to generate [authentication assertions](https://www.w3.org/TR/webauthn-2/#authentication-assertion). A [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) consists of a [struct](https://infra.spec.whatwg.org/#struct) with the following [items](https://infra.spec.whatwg.org/#struct-item):

type

whose value is of `PublicKeyCredentialType`, defaulting to `public-key`.

id

A [Credential ID](https://www.w3.org/TR/webauthn-2/#credential-id).

privateKey

The [credential private key](https://www.w3.org/TR/webauthn-2/#credential-private-key).

rpId

The [Relying Party Identifier](https://www.w3.org/TR/webauthn-2/#relying-party-identifier), for the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) this [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) is [scoped](https://www.w3.org/TR/webauthn-2/#scope) to.

userHandle

The [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) associated when this [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) was created. This [item](https://infra.spec.whatwg.org/#struct-item) is
nullable.

otherUI

OPTIONAL other information used by the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) to inform its UI. For example, this might include the user’s `displayName`. [otherUI](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-otherui) is a mutable item and SHOULD NOT be bound to the [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) in a way that prevents [otherUI](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-otherui) from being updated.

The [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) operation creates a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) [bound](https://www.w3.org/TR/webauthn-2/#bound-credential) to a managing authenticator and returns the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) associated with its [credential\\
private key](https://www.w3.org/TR/webauthn-2/#credential-private-key). The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) can use this [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) to verify the [authentication assertions](https://www.w3.org/TR/webauthn-2/#authentication-assertion) created by
this [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source).

Public Key Credential

Generically, a _credential_ is data one entity presents to another in order to _authenticate_ the former to the latter [\[RFC4949\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc4949). The term [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) refers to one of: a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source), the
possibly- [attested](https://www.w3.org/TR/webauthn-2/#attestation) [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) corresponding to a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source), or an [authentication assertion](https://www.w3.org/TR/webauthn-2/#authentication-assertion). Which one is generally determined by context.

Note: This is a [willful violation](https://infra.spec.whatwg.org/#willful-violation) of [\[RFC4949\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc4949). In English, a "credential" is both a) the thing presented to prove
a statement and b) intended to be used multiple times. It’s impossible to achieve both criteria securely with a single
piece of data in a public key system. [\[RFC4949\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc4949) chooses to define a credential as the thing that can be used multiple
times (the public key), while this specification gives "credential" the English term’s flexibility. This specification
uses more specific terms to identify the data related to an [\[RFC4949\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc4949) credential:
"Authentication information" (possibly including a private key)


[Public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source)

"Signed value"


[Authentication assertion](https://www.w3.org/TR/webauthn-2/#authentication-assertion)

[\[RFC4949\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc4949) "credential"


[Credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) or [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object)

At [registration](https://www.w3.org/TR/webauthn-2/#registration) time, the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) creates an asymmetric key pair, and stores its [private key portion](https://www.w3.org/TR/webauthn-2/#credential-private-key) and information from the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) into a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source). The [public key portion](https://www.w3.org/TR/webauthn-2/#credential-public-key) is returned to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), who then stores it in conjunction with the present user’s account.
Subsequently, only that [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), as identified by its [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id), is able to employ the [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) in [authentication ceremonies](https://www.w3.org/TR/webauthn-2/#authentication), via the `get()` method. The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) uses its stored
copy of the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) to verify the resultant [authentication assertion](https://www.w3.org/TR/webauthn-2/#authentication-assertion).

Rate Limiting

The process (also known as throttling) by which an authenticator implements controls against brute force attacks by limiting
the number of consecutive failed authentication attempts within a given period of time. If the limit is reached, the
authenticator should impose a delay that increases exponentially with each successive attempt, or disable the current
authentication modality and offer a different [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) if available. [Rate limiting](https://www.w3.org/TR/webauthn-2/#rate-limiting) is often implemented as an
aspect of [user verification](https://www.w3.org/TR/webauthn-2/#user-verification).

RegistrationRegistration Ceremony

The [ceremony](https://www.w3.org/TR/webauthn-2/#ceremony) where a user, a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), and the user’s [client](https://www.w3.org/TR/webauthn-2/#client) (containing at least one [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)) work in concert to create a [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) and associate it with the user’s [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) account.
Note that this includes employing a [test of user presence](https://www.w3.org/TR/webauthn-2/#test-of-user-presence) or [user verification](https://www.w3.org/TR/webauthn-2/#user-verification).
After a successful [registration ceremony](https://www.w3.org/TR/webauthn-2/#registration-ceremony), the user can be authenticated by an [authentication ceremony](https://www.w3.org/TR/webauthn-2/#authentication-ceremony).

The WebAuthn [registration ceremony](https://www.w3.org/TR/webauthn-2/#registration-ceremony) is defined in [§ 7.1 Registering a New Credential](https://www.w3.org/TR/webauthn-2/#sctn-registering-a-new-credential),
and is initiated by the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) calling `navigator.credentials.create()` with a `publicKey` argument.
See [§ 5 Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) for an introductory overview and [§ 1.3.1 Registration](https://www.w3.org/TR/webauthn-2/#sctn-sample-registration) for implementation examples.

Relying Party

See [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party).

Relying Party IdentifierRP ID

In the context of the [WebAuthn API](https://www.w3.org/TR/webauthn-2/#web-authentication-api), a [relying party identifier](https://www.w3.org/TR/webauthn-2/#relying-party-identifier) is a [valid domain string](https://url.spec.whatwg.org/#valid-domain-string) identifying the [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) on whose behalf a given [registration](https://www.w3.org/TR/webauthn-2/#registration) or [authentication ceremony](https://www.w3.org/TR/webauthn-2/#authentication) is being performed. A [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) can only be used for [authentication](https://www.w3.org/TR/webauthn-2/#authentication) with the same entity (as identified by [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id)) it was registered with.

By default, the [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) for a
WebAuthn operation is set to the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). This default MAY be
overridden by the caller, as long as the caller-specified [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) value [is a registrable domain suffix of or is equal\\
to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). See also [§ 5.1.3 Create a New Credential - PublicKeyCredential’s \[\[Create\]\](origin, options, sameOriginWithAncestors) Method](https://www.w3.org/TR/webauthn-2/#sctn-createCredential) and [§ 5.1.4 Use an Existing Credential to Make an Assertion - PublicKeyCredential’s \[\[Get\]\](options) Method](https://www.w3.org/TR/webauthn-2/#sctn-getAssertion).

Note: An [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) is based on a [host](https://url.spec.whatwg.org/#concept-url-host)'s [domain](https://url.spec.whatwg.org/#concept-domain) name. It does not itself include a [scheme](https://url.spec.whatwg.org/#concept-url-scheme) or [port](https://url.spec.whatwg.org/#concept-url-port), as an [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) does. The [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) of a [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) determines its scope. I.e., it determines the set of origins on which the public key credential may be exercised, as follows:


- The [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) must be equal to the [origin](https://www.w3.org/TR/webauthn-2/#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain), or a [registrable domain suffix](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) of the [origin](https://www.w3.org/TR/webauthn-2/#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain).

- The [origin](https://www.w3.org/TR/webauthn-2/#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [scheme](https://url.spec.whatwg.org/#concept-url-scheme) must be `https`.

- The [origin](https://www.w3.org/TR/webauthn-2/#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [port](https://url.spec.whatwg.org/#concept-url-port) is unrestricted.


For example, given a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) whose origin is `https://login.example.com:1337`, then the following [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) s are valid: `login.example.com` (default) and `example.com`, but not `m.login.example.com` and not `com`.

This is done in order to match the behavior of pervasively deployed ambient credentials (e.g., cookies, [\[RFC6265\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc6265)).
Please note that this is a greater relaxation of "same-origin" restrictions than what [document.domain](https://html.spec.whatwg.org/multipage/origin.html#dom-document-domain)'s setter provides.

These restrictions on origin values apply to [WebAuthn Clients](https://www.w3.org/TR/webauthn-2/#webauthn-client).

Other specifications mimicking the [WebAuthn API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) to enable WebAuthn [public key credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential) on non-Web platforms (e.g. native mobile applications), MAY define different rules for binding a caller to a [Relying Party Identifier](https://www.w3.org/TR/webauthn-2/#relying-party-identifier). Though, the [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) syntaxes MUST conform to either [valid domain strings](https://url.spec.whatwg.org/#valid-domain-string) or URIs [\[RFC3986\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc3986) [\[URL\]](https://www.w3.org/TR/webauthn-2/#biblio-url).

Server-side Public Key Credential SourceServer-side Credential\[DEPRECATED\] Non-Resident Credential

Note: Historically, [server-side credentials](https://www.w3.org/TR/webauthn-2/#server-side-credential) have been known as [non-resident credentials](https://www.w3.org/TR/webauthn-2/#non-resident-credential).
For backwards compatibility purposes, the various [WebAuthn API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) and [Authenticator Model](https://www.w3.org/TR/webauthn-2/#authenticator-model) components
with various forms of `resident` within their names have not been changed.

A [Server-side Public Key Credential Source](https://www.w3.org/TR/webauthn-2/#server-side-public-key-credential-source), or [Server-side Credential](https://www.w3.org/TR/webauthn-2/#server-side-credential) for short,
is a [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) that is only usable in an [authentication ceremony](https://www.w3.org/TR/webauthn-2/#authentication-ceremony) when the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) supplies its [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) in `navigator.credentials.get()`'s `allowCredentials` argument. This means that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) must
manage the credential’s storage and discovery, as well as be able to first identify the user in order to
discover the [credential IDs](https://www.w3.org/TR/webauthn-2/#credential-id) to supply in the `navigator.credentials.get()` call.

[Client-side](https://www.w3.org/TR/webauthn-2/#client-side) storage of the [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source) is not required for a [server-side credential](https://www.w3.org/TR/webauthn-2/#server-side-credential).
This is in contrast to a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential),
which instead does not require the user to first be identified in order to provide the user’s [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) s
to a `navigator.credentials.get()` call.

See also: [server-side credential storage modality](https://www.w3.org/TR/webauthn-2/#server-side-credential-storage-modality) and [non-discoverable credential](https://www.w3.org/TR/webauthn-2/#non-discoverable-credential).

Test of User Presence

A [test of user presence](https://www.w3.org/TR/webauthn-2/#test-of-user-presence) is a simple form of [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) and technical process where a user interacts with
an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) by (typically) simply touching it (other modalities may also exist), yielding a Boolean result. Note
that this does not constitute [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) because a [user presence test](https://www.w3.org/TR/webauthn-2/#test-of-user-presence), by definition,
is not capable of [biometric recognition](https://www.w3.org/TR/webauthn-2/#biometric-recognition), nor does it involve the presentation of a shared secret such as a password or
PIN.

User Consent

User consent means the user agrees with what they are being asked, i.e., it encompasses reading and understanding prompts.
An [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) is a [ceremony](https://www.w3.org/TR/webauthn-2/#ceremony) component often employed to indicate [user consent](https://www.w3.org/TR/webauthn-2/#user-consent).

User Handle

The user handle is specified by a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), as the value of `user.id`, and used to [map](https://www.w3.org/TR/webauthn-2/#authenticator-credentials-map) a specific [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) to a specific user account with the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party). Authenticators in turn [map](https://www.w3.org/TR/webauthn-2/#authenticator-credentials-map) [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) s and user handle pairs
to [public key credential sources](https://www.w3.org/TR/webauthn-2/#public-key-credential-source).

A user handle is an opaque [byte sequence](https://infra.spec.whatwg.org/#byte-sequence) with a maximum size of 64 bytes, and is not meant to be displayed to the user.

User Verification

The technical process by which an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) _locally authorizes_ the invocation of the [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) and [authenticatorGetAssertion](https://www.w3.org/TR/webauthn-2/#authenticatorgetassertion) operations. [User verification](https://www.w3.org/TR/webauthn-2/#user-verification) MAY be instigated
through various [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) modalities; for example, through a touch plus pin code, password entry, or [biometric recognition](https://www.w3.org/TR/webauthn-2/#biometric-recognition) (e.g., presenting a fingerprint) [\[ISOBiometricVocabulary\]](https://www.w3.org/TR/webauthn-2/#biblio-isobiometricvocabulary). The intent is to
distinguish individual users.

Note that [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) does not give the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) a concrete identification of the user,
but when 2 or more ceremonies with [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) have been done with that [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) it expresses that it was the same user that performed all of them.
The same user might not always be the same natural person, however,
if multiple natural persons share access to the same [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

Note: Distinguishing natural persons depends in significant part upon the [client platform](https://www.w3.org/TR/webauthn-2/#client-platform)'s
and [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)'s capabilities.
For example, some devices are intended to be used by a single individual,
yet they may allow multiple natural persons to enroll fingerprints or know the same PIN
and thus access the same [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) account(s) using that device.

Note: Invocation of the [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) and [authenticatorGetAssertion](https://www.w3.org/TR/webauthn-2/#authenticatorgetassertion) operations
implies use of key material managed by the authenticator.


Also, for security, [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) and use of [credential private keys](https://www.w3.org/TR/webauthn-2/#credential-private-key) must all occur within the logical security boundary defining the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

[User verification](https://www.w3.org/TR/webauthn-2/#user-verification) procedures MAY implement [rate limiting](https://www.w3.org/TR/webauthn-2/#rate-limiting) as a protection against brute force attacks.

User PresentUP

Upon successful completion of a [user presence test](https://www.w3.org/TR/webauthn-2/#test-of-user-presence), the user is said to be
" [present](https://www.w3.org/TR/webauthn-2/#concept-user-present)".

User VerifiedUV

Upon successful completion of a [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) process, the user is said to be " [verified](https://www.w3.org/TR/webauthn-2/#concept-user-verified)".

WebAuthn Relying Party

The entity whose web application utilizes the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#sctn-api) to [register](https://www.w3.org/TR/webauthn-2/#registration) and [authenticate](https://www.w3.org/TR/webauthn-2/#authentication) users.

A [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) implementation typically consists of both some client-side script
that invokes the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) in the [client](https://www.w3.org/TR/webauthn-2/#client),
and a server-side component that executes the [Relying Party operations](https://www.w3.org/TR/webauthn-2/#sctn-rp-operations) and other application logic.
Communication between the two components MUST use HTTPS or equivalent transport security,
but is otherwise beyond the scope of this specification.

Note: While the term [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) is also often used in other contexts (e.g., X.509 and OAuth), an entity acting as a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) in one
context is not necessarily a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) in other contexts. In this specification, the term [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) is often shortened
to be just [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), and explicitly refers to a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) in the WebAuthn context. Note that in any concrete instantiation
a WebAuthn context may be embedded in a broader overall context, e.g., one based on OAuth.

## 5\. Web Authentication API

This section normatively specifies the API for creating and using [public key credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential). The basic
idea is that the credentials belong to the user and are [managed](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-managing-authenticator) by a [WebAuthn Authenticator](https://www.w3.org/TR/webauthn-2/#webauthn-authenticator), with which the [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) interacts through the [client platform](https://www.w3.org/TR/webauthn-2/#client-platform). [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) scripts can (with the [user’s consent](https://www.w3.org/TR/webauthn-2/#user-consent)) request the
browser to create a new credential for future use by the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party). See [Figure](https://www.w3.org/TR/webauthn-2/#fig-registration), below.

![](https://www.w3.org/TR/webauthn-2/images/webauthn-registration-flow-01.svg)Registration Flow

Scripts can also request the user’s permission to perform [authentication](https://www.w3.org/TR/webauthn-2/#authentication) operations with an existing credential. See [Figure](https://www.w3.org/TR/webauthn-2/#fig-authentication), below.

![](https://www.w3.org/TR/webauthn-2/images/webauthn-authentication-flow-01.svg)Authentication Flow

All such operations are performed in the authenticator and are mediated by
the [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) on the user’s behalf. At no point does the script get access to the credentials themselves; it only
gets information about the credentials in the form of objects.

In addition to the above script interface, the authenticator MAY implement (or come with client software that implements) a user
interface for management. Such an interface MAY be used, for example, to reset the authenticator to a clean state or to inspect
the current state of the authenticator. In other words, such an interface is similar to the user interfaces provided by browsers
for managing user state such as history, saved passwords, and cookies. Authenticator management actions such as credential
deletion are considered to be the responsibility of such a user interface and are deliberately omitted from the API exposed to
scripts.

The security properties of this API are provided by the client and the authenticator working together. The authenticator, which
holds and [manages](https://www.w3.org/TR/webauthn-2/#public-key-credential-source-managing-authenticator) credentials, ensures that all operations are [scoped](https://www.w3.org/TR/webauthn-2/#scope) to a particular [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin), and cannot be replayed against
a different [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin), by incorporating the [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) in its responses. Specifically, as defined in [§ 6.3 Authenticator Operations](https://www.w3.org/TR/webauthn-2/#sctn-authenticator-ops),
the full [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) of the requester is included, and signed over, in the [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object) produced when a new credential
is created as well as in all assertions produced by WebAuthn credentials.

Additionally, to maintain user privacy and prevent malicious [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) from probing for the presence of [public key\\
credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential) belonging to other [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party), each [credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) is also [scoped](https://www.w3.org/TR/webauthn-2/#scope) to a [Relying Party\\
Identifier](https://www.w3.org/TR/webauthn-2/#relying-party-identifier), or [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id). This [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) is provided by the client to the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) for all operations, and the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) ensures that [credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential) created by a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) can only be used in operations
requested by the same [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id). Separating the [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) from the [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) in this way allows the API to be used in cases
where a single [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) maintains multiple [origins](https://html.spec.whatwg.org/multipage/origin.html#concept-origin).

The client facilitates these security measures by providing the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)'s [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) and [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) to the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) for
each operation. Since this is an integral part of the WebAuthn security model, user agents only expose this API to callers in [secure contexts](https://w3c.github.io/webappsec-secure-contexts/#secure-contexts).
For web contexts in particular,
this only includes those accessed via a secure transport (e.g., TLS) established without errors.

The Web Authentication API is defined by the union of the Web IDL fragments presented in the following sections. A combined IDL
listing is given in the [IDL Index](https://www.w3.org/TR/webauthn-2/#idl-index).

### 5.1. `PublicKeyCredential` Interface

**✔** MDN

[PublicKeyCredential](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential "The PublicKeyCredential interface provides information about a public key / private key pair, which is a credential for logging in to a service using an un-phishable and data-breach resistant asymmetric key pair instead of a password. It inherits from Credential, and was created by the Web Authentication API extension to the Credential Management API. Other interfaces that inherit from Credential are PasswordCredential and FederatedCredential.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

The `PublicKeyCredential` interface inherits from `Credential` [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1), and contains the attributes
that are returned to the caller when a new credential is created, or a new assertion is requested.

**✔** MDN

[PublicKeyCredential/getClientExtensionResults](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/getClientExtensionResults "getClientExtensionResults() is a method of the PublicKeyCredential interface that returns an ArrayBuffer which contains a map between the extensions identifiers and their results after having being processed by the client.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

[PublicKeyCredential/rawId](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/rawId "The rawId read-only property of the PublicKeyCredential interface is an ArrayBuffer object containing the identifier of the credentials.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

```
[SecureContext, Exposed=Window]
interface PublicKeyCredential : Credential {
    [SameObject] readonly attribute ArrayBuffer              rawId;
    [SameObject] readonly attribute AuthenticatorResponse    response;
    AuthenticationExtensionsClientOutputs getClientExtensionResults();
};

```

`id`

This attribute is inherited from `Credential`, though `PublicKeyCredential` overrides `Credential`'s getter,
instead returning the [base64url encoding](https://www.w3.org/TR/webauthn-2/#base64url-encoding) of the data contained in the object’s `[[identifier]]` [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots).

`rawId`

This attribute returns the `ArrayBuffer` contained in the `[[identifier]]` internal slot.

**✔** MDN

[PublicKeyCredential/response](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/response "The response read-only property of the PublicKeyCredential interface is an AuthenticatorResponse object which is sent from the authenticator to the user agent for the creation/fetching of credentials. The information contained in this response will be used by the relying party's server to verify the demand is legitimate.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`response`,  of type [AuthenticatorResponse](https://www.w3.org/TR/webauthn-2/#authenticatorresponse), readonly

This attribute contains the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)'s response to the client’s request to either create a [public key\\
credential](https://www.w3.org/TR/webauthn-2/#public-key-credential), or generate an [authentication assertion](https://www.w3.org/TR/webauthn-2/#authentication-assertion). If the `PublicKeyCredential` is created in response to `create()`, this attribute’s value will be an `AuthenticatorAttestationResponse`, otherwise,
the `PublicKeyCredential` was created in response to `get()`, and this attribute’s value
will be an `AuthenticatorAssertionResponse`.

`getClientExtensionResults()`

This operation returns the value of `[[clientExtensionsResults]]`, which is a [map](https://infra.spec.whatwg.org/#ordered-map) containing [extension identifier](https://www.w3.org/TR/webauthn-2/#extension-identifier) → [client extension output](https://www.w3.org/TR/webauthn-2/#client-extension-output) entries produced by the extension’s [client extension processing](https://www.w3.org/TR/webauthn-2/#client-extension-processing).

`[[type]]`

The `PublicKeyCredential` [interface object](https://heycam.github.io/webidl/#dfn-interface-object)'s `[[type]]` [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots)'s value is the string
" `public-key`".

Note: This is reflected via the `type` attribute getter inherited from `Credential`.

`[[discovery]]`

The `PublicKeyCredential` [interface object](https://heycam.github.io/webidl/#dfn-interface-object)'s `[[discovery]]` [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots)'s value is
" `remote`".

`[[identifier]]`

This [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) contains the [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id), chosen by the authenticator.
The [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) is used to look up credentials for use, and is therefore expected to be globally unique
with high probability across all credentials of the same type, across all authenticators.

Note: This API does not constrain
the format or length of this identifier, except that it MUST be sufficient for the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) to uniquely select a key.
For example, an authenticator without on-board storage may create identifiers containing a [credential private key](https://www.w3.org/TR/webauthn-2/#credential-private-key) wrapped with a symmetric key that is burned into the authenticator.

`[[clientExtensionsResults]]`

This [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) contains the results of processing client extensions requested by the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) upon the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)'s invocation of either `navigator.credentials.create()` or `navigator.credentials.get()`.

`PublicKeyCredential`'s [interface object](https://heycam.github.io/webidl/#dfn-interface-object) inherits `Credential`'s implementation of `[[CollectFromCredentialStore]](origin, options, sameOriginWithAncestors)`, and defines its own
implementation of `[[Create]](origin, options, sameOriginWithAncestors)`, `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)`, and `[[Store]](credential, sameOriginWithAncestors)`.

#### 5.1.1. `CredentialCreationOptions` Dictionary Extension

To support registration via `navigator.credentials.create()`, this document extends
the `CredentialCreationOptions` dictionary as follows:

```
partial dictionary CredentialCreationOptions {
    PublicKeyCredentialCreationOptions      publicKey;
};

```

#### 5.1.2. `CredentialRequestOptions` Dictionary Extension

To support obtaining assertions via `navigator.credentials.get()`, this document extends the `CredentialRequestOptions` dictionary as follows:

```
partial dictionary CredentialRequestOptions {
    PublicKeyCredentialRequestOptions      publicKey;
};

```

#### 5.1.3. Create a New Credential - PublicKeyCredential’s `[[Create]](origin, options, sameOriginWithAncestors)` Method

`PublicKeyCredential`'s [interface object](https://heycam.github.io/webidl/#dfn-interface-object)'s implementation of the `[[Create]](origin,
options, sameOriginWithAncestors)` [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1) allows [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) scripts to call `navigator.credentials.create()` to request the creation of a new [public key credential source](https://www.w3.org/TR/webauthn-2/#public-key-credential-source), [bound](https://www.w3.org/TR/webauthn-2/#bound-credential) to an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator). This `navigator.credentials.create()` operation can be aborted by leveraging the `AbortController`;
see [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) for detailed instructions.


This [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) accepts three arguments:

`origin`

This argument is the [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin), as determined by the
calling `create()` implementation.

`options`

This argument is a `CredentialCreationOptions` object whose `options.publicKey` member contains a `PublicKeyCredentialCreationOptions` object specifying the desired attributes of the to-be-created [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential).

`sameOriginWithAncestors`

This argument is a Boolean value which is `true` if and only if the caller’s [environment settings object](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object) is [same-origin with its ancestors](https://w3c.github.io/webappsec-credential-management/#same-origin-with-its-ancestors). It is `false` if caller is cross-origin.

Note: Invocation of this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) indicates that it was allowed by [permissions policy](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy), which is evaluated at the [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1) level.
See [§ 5.9 Permissions Policy integration](https://www.w3.org/TR/webauthn-2/#sctn-permissions-policy).

Note: **This algorithm is synchronous:** the `Promise` resolution/rejection is handled by `navigator.credentials.create()`.

Note: All `BufferSource` objects used in this algorithm must be snapshotted when the algorithm begins, to
avoid potential synchronization issues. The algorithm implementations should [get a copy of the bytes held\\
by the buffer source](https://heycam.github.io/webidl#dfn-get-buffer-source-reference) and use that copy for relevant portions of the algorithm.

When this method is invoked, the user agent MUST execute the following algorithm:

01. Assert: `options.publicKey` is present.

02. If sameOriginWithAncestors is `false`, return a " `NotAllowedError`" `DOMException`.

    Note: This "sameOriginWithAncestors" restriction aims to address a tracking concern raised in [Issue #1336](https://github.com/w3c/webauthn/issues/1336). This may be revised in future versions of this specification.

03. Let options be the value of `options.publicKey`.

04. If the `timeout` member of options is present, check if its value lies within a
    reasonable range as defined by the [client](https://www.w3.org/TR/webauthn-2/#client) and if not, correct it to the closest value lying within that range. Set a timer lifetimeTimer to this adjusted value. If the `timeout` member of options is not
    present, then set lifetimeTimer to a [client](https://www.w3.org/TR/webauthn-2/#client)-specific default.

    Recommended ranges and defaults for the `timeout` member of options are as follows.
     If `options.authenticatorSelection.userVerification`
    is set to `discouraged`

    Recommended range: 30000 milliseconds to 180000 milliseconds.



    Recommended default value: 120000 milliseconds (2 minutes).

    is set to `required` or `preferred`

    Recommended range: 30000 milliseconds to 600000 milliseconds.



    Recommended default value: 300000 milliseconds (5 minutes).


    Note: The user agent should take cognitive guidelines into considerations regarding timeout for users with special needs.

05. If the length of `options.user.id` is not between 1 and 64 bytes (inclusive) then return a `TypeError`.

06. Let callerOrigin be `origin`. If callerOrigin is an [opaque origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque), return a `DOMException` whose name is
    " `NotAllowedError`", and terminate this algorithm.

07. Let effectiveDomain be the callerOrigin’s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain).
    If [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) is not a [valid domain](https://url.spec.whatwg.org/#valid-domain), then return a `DOMException` whose name is " `SecurityError`" and terminate this algorithm.

    Note: An [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) may resolve to a [host](https://url.spec.whatwg.org/#concept-url-host), which can be represented in various manners,
     such as [domain](https://url.spec.whatwg.org/#concept-domain), [ipv4 address](https://url.spec.whatwg.org/#concept-ipv4), [ipv6 address](https://url.spec.whatwg.org/#concept-ipv6), [opaque host](https://url.spec.whatwg.org/#opaque-host), or [empty host](https://url.spec.whatwg.org/#empty-host).
     Only the [domain](https://url.spec.whatwg.org/#concept-domain) format of [host](https://url.spec.whatwg.org/#concept-url-host) is allowed here. This is for simplification and also
     is in recognition of various issues with using direct IP address identification in concert
     with PKI-based security.

08. If `options.rp.id`
    is present


    If `options.rp.id` [is not a\\
    registrable domain suffix of and is not equal to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) effectiveDomain, return a `DOMException` whose name
    is " `SecurityError`", and terminate this algorithm.

    Is not present


    Set `options.rp.id` to effectiveDomain.


    Note: `options.rp.id` represents the
     caller’s [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id). The [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) defaults to being the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) unless the caller has explicitly set `options.rp.id` when calling `create()`.

09. Let credTypesAndPubKeyAlgs be a new [list](https://infra.spec.whatwg.org/#list) whose [items](https://infra.spec.whatwg.org/#list-item) are pairs of `PublicKeyCredentialType` and
    a `COSEAlgorithmIdentifier`.

10. If `options.pubKeyCredParams`’s [size](https://infra.spec.whatwg.org/#list-size)
    is zero


    [Append](https://infra.spec.whatwg.org/#list-append) the following pairs of `PublicKeyCredentialType` and `COSEAlgorithmIdentifier` values to credTypesAndPubKeyAlgs:



- `public-key` and `-7` ("ES256").

- `public-key` and `-257` ("RS256").


is non-zero


[For each](https://infra.spec.whatwg.org/#list-iterate) current of `options.pubKeyCredParams`:

1. If `current.type` does not contain a `PublicKeyCredentialType` supported
by this implementation, then [continue](https://infra.spec.whatwg.org/#iteration-continue).

2. Let alg be `current.alg`.

3. [Append](https://infra.spec.whatwg.org/#list-append) the pair of `current.type` and alg to credTypesAndPubKeyAlgs.


If credTypesAndPubKeyAlgs [is empty](https://infra.spec.whatwg.org/#list-is-empty), return a `DOMException` whose name is
" `NotSupportedError`", and terminate this algorithm.

11. Let clientExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map) and let authenticatorExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map).

12. If the `extensions` member of options is present, then [for each](https://infra.spec.whatwg.org/#map-iterate) extensionId → clientExtensionInput of `options.extensions`:
    1. If extensionId is not supported by this [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) or is not a [registration extension](https://www.w3.org/TR/webauthn-2/#registration-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).

    2. [Set](https://infra.spec.whatwg.org/#map-set) clientExtensions\[extensionId\] to clientExtensionInput.

    3. If extensionId is not an [authenticator extension](https://www.w3.org/TR/webauthn-2/#authenticator-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).

    4. Let authenticatorExtensionInput be the ( [CBOR](https://www.w3.org/TR/webauthn-2/#cbor)) result of running extensionId’s [client extension processing](https://www.w3.org/TR/webauthn-2/#client-extension-processing) algorithm on clientExtensionInput. If the algorithm returned an error, [continue](https://infra.spec.whatwg.org/#iteration-continue).

    5. [Set](https://infra.spec.whatwg.org/#map-set) authenticatorExtensions\[extensionId\] to the [base64url encoding](https://www.w3.org/TR/webauthn-2/#base64url-encoding) of authenticatorExtensionInput.
13. Let collectedClientData be a new `CollectedClientData` instance whose fields are:
    `type`

    The string "webauthn.create".

    `challenge`

    The [base64url encoding](https://www.w3.org/TR/webauthn-2/#base64url-encoding) of options. `challenge`.

    `origin`

    The [serialization of](https://html.spec.whatwg.org/multipage/origin.html#ascii-serialisation-of-an-origin) callerOrigin.

    `crossOrigin`

    The inverse of the value of the `sameOriginWithAncestors` argument passed to this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots).

    `tokenBinding`

    The status of [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) between the client and the callerOrigin, as well as the [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) associated with callerOrigin, if one is available.

14. Let clientDataJSON be the [JSON-compatible serialization of client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-json-compatible-serialization-of-client-data) constructed from collectedClientData.

15. Let clientDataHash be the [hash of the serialized client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-hash-of-the-serialized-client-data) represented by clientDataJSON.

16. If the `options.signal` is present and its [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`, return a `DOMException` whose name is " `AbortError`"
    and terminate this algorithm.

17. Let issuedRequests be a new [ordered set](https://infra.spec.whatwg.org/#ordered-set).

18. Let authenticators represent a value which at any given instant is a [set](https://infra.spec.whatwg.org/#ordered-set) of [client platform](https://www.w3.org/TR/webauthn-2/#client-platform)-specific handles, where each [item](https://infra.spec.whatwg.org/#list-item) identifies an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) presently available on this [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) at that instant.

    Note: What qualifies an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) as "available" is intentionally unspecified; this is meant to represent how [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) can be [hot-plugged](https://en.wikipedia.org/w/index.php?title=Hot_plug) into (e.g., via USB)
    or discovered (e.g., via NFC or Bluetooth) by the [client](https://www.w3.org/TR/webauthn-2/#client) by various mechanisms, or permanently built into the [client](https://www.w3.org/TR/webauthn-2/#client).

19. Start lifetimeTimer.

20. [While](https://infra.spec.whatwg.org/#iteration-while) lifetimeTimer has not expired, perform the following actions depending upon lifetimeTimer,
    and the state and response [for each](https://infra.spec.whatwg.org/#list-iterate) authenticator in authenticators:
    If lifetimeTimer expires,


    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

    If the user exercises a user agent user-interface option to cancel the process,


    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Return a `DOMException` whose name is " `NotAllowedError`".

    If the `options.signal` is present and its [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`,


    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Then return a `DOMException` whose name is " `AbortError`" and terminate this algorithm.

    If an authenticator becomes available on this [client device](https://www.w3.org/TR/webauthn-2/#client-device),


    Note: This includes the case where an authenticator was available upon lifetimeTimer initiation.



1. This authenticator is now the candidate authenticator.

2. If `options.authenticatorSelection` is present:
1. If `options.authenticatorSelection.authenticatorAttachment` is
      present and its value is not equal to authenticator’s [authenticator attachment modality](https://www.w3.org/TR/webauthn-2/#authenticator-attachment-modality), [continue](https://infra.spec.whatwg.org/#iteration-continue).

2. If `options.authenticatorSelection.residentKey`
      is present and set to `required`

      If the authenticator is not capable of storing a [client-side discoverable public key credential\\
      source](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-public-key-credential-source), [continue](https://infra.spec.whatwg.org/#iteration-continue).

      is present and set to `preferred` or `discouraged`

      No effect.

      is not present


      if `options.authenticatorSelection.requireResidentKey` is set to `true` and the authenticator is not capable of storing a [client-side discoverable public\\
      key credential source](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-public-key-credential-source), [continue](https://infra.spec.whatwg.org/#iteration-continue).

3. If `options.authenticatorSelection.userVerification` is
      set to `required` and the authenticator is not capable of performing [user\\
      verification](https://www.w3.org/TR/webauthn-2/#user-verification), [continue](https://infra.spec.whatwg.org/#iteration-continue).
3. Let requireResidentKey be the effective resident key requirement for credential creation, a Boolean value, as follows:

If `options.authenticatorSelection.residentKey`
is present and set to `required`

Let requireResidentKey be `true`.

is present and set to `preferred`

If the authenticator

is capable of [client-side credential storage modality](https://www.w3.org/TR/webauthn-2/#client-side-credential-storage-modality)

Let requireResidentKey be `true`.

is not capable of [client-side credential storage modality](https://www.w3.org/TR/webauthn-2/#client-side-credential-storage-modality), or if the [client](https://www.w3.org/TR/webauthn-2/#client) cannot determine authenticator capability,


Let requireResidentKey be `false`.

is present and set to `discouraged`

Let requireResidentKey be `false`.

is not present


Let requireResidentKey be the value of `options.authenticatorSelection.requireResidentKey`.

4. Let userVerification be the effective user verification requirement for credential creation, a Boolean value,
as follows. If `options.authenticatorSelection.userVerification`
is set to `required`

Let userVerification be `true`.

is set to `preferred`

If the authenticator

is capable of [user verification](https://www.w3.org/TR/webauthn-2/#user-verification)

Let userVerification be `true`.

is not capable of [user verification](https://www.w3.org/TR/webauthn-2/#user-verification)

Let userVerification be `false`.

is set to `discouraged`

Let userVerification be `false`.

5. Let enterpriseAttestationPossible be a Boolean value, as follows. If `options.attestation`
is set to `enterprise`

Let enterpriseAttestationPossible be `true` if the user agent wishes to support enterprise attestation for `options.rp.id` (see [Step 8](https://www.w3.org/TR/webauthn-2/#CreateCred-DetermineRpId), above). Otherwise `false`.

otherwise


Let enterpriseAttestationPossible be `false`.

6. Let excludeCredentialDescriptorList be a new [list](https://infra.spec.whatwg.org/#list).

7. [For each](https://infra.spec.whatwg.org/#list-iterate) credential descriptor C in `options.excludeCredentials`:
1. If `C.transports` [is not empty](https://infra.spec.whatwg.org/#list-is-empty), and authenticator is connected over a transport not
      mentioned in `C.transports`, the client MAY [continue](https://infra.spec.whatwg.org/#iteration-continue).

      Note: If the client chooses to [continue](https://infra.spec.whatwg.org/#iteration-continue), this could result in
      inadvertently registering multiple credentials [bound to](https://www.w3.org/TR/webauthn-2/#bound-credential) the same [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) if the transport hints in `C.transports` are not accurate.
      For example, stored transport hints could become inaccurate
      as a result of software upgrades adding new connectivity options.

2. Otherwise, [Append](https://infra.spec.whatwg.org/#list-append) C to excludeCredentialDescriptorList.

3. Invoke the [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) operation on authenticator with clientDataHash, `options.rp`, `options.user`, requireResidentKey, userVerification, credTypesAndPubKeyAlgs, excludeCredentialDescriptorList, enterpriseAttestationPossible,
       and authenticatorExtensions as parameters.
8. [Append](https://infra.spec.whatwg.org/#set-append) authenticator to issuedRequests.


If an authenticator ceases to be available on this [client device](https://www.w3.org/TR/webauthn-2/#client-device),


[Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

If any authenticator returns a status indicating that the user cancelled the operation,


1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

2. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.

Note: [Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) may return an indication of "the user cancelled the entire operation".
How a user agent manifests this state to users is unspecified.


If any authenticator returns an error status equivalent to " `InvalidStateError`",


1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

2. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.

3. Return a `DOMException` whose name is " `InvalidStateError`" and terminate this algorithm.


Note: This error status is handled separately because the authenticator returns it only if excludeCredentialDescriptorList identifies a credential [bound](https://www.w3.org/TR/webauthn-2/#bound-credential) to the authenticator and the user has [consented](https://www.w3.org/TR/webauthn-2/#user-consent) to the operation. Given this explicit consent, it is acceptable for this case to be
distinguishable to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party).

If any authenticator returns an error status not equivalent to " `InvalidStateError`",


[Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

Note: This case does not imply [user consent](https://www.w3.org/TR/webauthn-2/#user-consent) for the operation, so details about the error are hidden from the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) in order to prevent leak of potentially identifying information. See [§ 14.5.1 Registration Ceremony Privacy](https://www.w3.org/TR/webauthn-2/#sctn-make-credential-privacy) for
details.

If any authenticator indicates success,


1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. This authenticator is now the selected authenticator.

2. Let credentialCreationData be a [struct](https://infra.spec.whatwg.org/#struct) whose [items](https://infra.spec.whatwg.org/#struct-item) are:
`attestationObjectResult`

whose value is the bytes returned from the successful [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) operation.



Note: this value is `attObj`, as defined in [§ 6.5.4 Generating an Attestation Object](https://www.w3.org/TR/webauthn-2/#sctn-generating-an-attestation-object).

`clientDataJSONResult`

whose value is the bytes of clientDataJSON.

`attestationConveyancePreferenceOption`

whose value is the value of options. `attestation`.

`clientExtensionResults`

whose value is an `AuthenticationExtensionsClientOutputs` object containing [extension identifier](https://www.w3.org/TR/webauthn-2/#extension-identifier) → [client extension output](https://www.w3.org/TR/webauthn-2/#client-extension-output) entries. The entries are created by running each extension’s [client extension processing](https://www.w3.org/TR/webauthn-2/#client-extension-processing) algorithm to create the [client extension outputs](https://www.w3.org/TR/webauthn-2/#client-extension-output), for each [client extension](https://www.w3.org/TR/webauthn-2/#client-extension) in `options.extensions`.

3. Let constructCredentialAlg be an algorithm that takes a [global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-global) global, and whose steps are:
1. If `credentialCreationData.attestationConveyancePreferenceOption`’s value is
      "none"


      Replace potentially uniquely identifying information with non-identifying versions of the
      same:



1. If the [AAGUID](https://www.w3.org/TR/webauthn-2/#aaguid) in the [attested credential data](https://www.w3.org/TR/webauthn-2/#attested-credential-data) is 16 zero bytes, `credentialCreationData.attestationObjectResult.fmt` is "packed", and "x5c" is absent from `credentialCreationData.attestationObjectResult`, then [self attestation](https://www.w3.org/TR/webauthn-2/#self-attestation) is being used and no further action is needed.

2. Otherwise
1. Replace the [AAGUID](https://www.w3.org/TR/webauthn-2/#aaguid) in the [attested credential data](https://www.w3.org/TR/webauthn-2/#attested-credential-data) with 16 zero bytes.

2. Set the value of `credentialCreationData.attestationObjectResult.fmt` to "none", and set the value of `credentialCreationData.attestationObjectResult.attStmt` to be an empty [CBOR](https://www.w3.org/TR/webauthn-2/#cbor) map. (See [§ 8.7 None Attestation Statement Format](https://www.w3.org/TR/webauthn-2/#sctn-none-attestation) and [§ 6.5.4 Generating an Attestation Object](https://www.w3.org/TR/webauthn-2/#sctn-generating-an-attestation-object)).

"indirect"


The client MAY replace the [AAGUID](https://www.w3.org/TR/webauthn-2/#aaguid) and [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement) with a more privacy-friendly
and/or more easily verifiable version of the same data (for example, by employing an [Anonymization CA](https://www.w3.org/TR/webauthn-2/#anonymization-ca)).

"direct" or "enterprise"


Convey the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)'s [AAGUID](https://www.w3.org/TR/webauthn-2/#aaguid) and [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement), unaltered, to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party).

2. Let attestationObject be a new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the
      bytes of `credentialCreationData.attestationObjectResult`’s value.

3. Let id be `attestationObject.authData.attestedCredentialData.credentialId`.

4. Let pubKeyCred be a new `PublicKeyCredential` object associated with global whose fields are:
      `[[identifier]]`

      id

      `response`

      A new `AuthenticatorAttestationResponse` object associated with global whose fields are:

      `clientDataJSON`

      A new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `credentialCreationData.clientDataJSONResult`.

      `attestationObject`

      attestationObject

      `[[transports]]`

      A sequence of zero or more unique `DOMString` s, in lexicographical order, that the authenticator is believed to support. The values SHOULD be members of `AuthenticatorTransport`, but [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) MUST ignore unknown values.



      If a user agent does not wish to divulge this information it MAY substitute an arbitrary sequence designed to preserve privacy. This sequence MUST still be valid, i.e. lexicographically sorted and free of duplicates. For example, it may use the empty sequence. Either way, in this case the user agent takes the risk that [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) behavior may be suboptimal.



      If the user agent does not have any transport information, it SHOULD set this field to the empty sequence.



      Note: How user agents discover transports supported by a given [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) is outside the scope of this specification, but may include information from an [attestation certificate](https://www.w3.org/TR/webauthn-2/#attestation-certificate) (for example [\[FIDO-Transports-Ext\]](https://www.w3.org/TR/webauthn-2/#biblio-fido-transports-ext)), metadata communicated in an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) protocol such as CTAP2, or special-case knowledge about a [platform authenticator](https://www.w3.org/TR/webauthn-2/#platform-authenticators).

      `[[clientExtensionsResults]]`

      A new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `credentialCreationData.clientExtensionResults`.

5. Return pubKeyCred.
4. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.

5. Return constructCredentialAlg and terminate this algorithm.


21. Return a `DOMException` whose name is " `NotAllowedError`". In order to prevent information leak that could identify the
    user without [consent](https://www.w3.org/TR/webauthn-2/#user-consent), this step MUST NOT be executed before lifetimeTimer has expired. See [§ 14.5.1 Registration Ceremony Privacy](https://www.w3.org/TR/webauthn-2/#sctn-make-credential-privacy) for details.


During the above process, the user agent SHOULD show some UI to the user to guide them in the process of selecting and
authorizing an authenticator.

#### 5.1.4. Use an Existing Credential to Make an Assertion - PublicKeyCredential’s `[[Get]](options)` Method

[WebAuthn Relying Parties](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) call `navigator.credentials.get({publicKey:..., ...})` to
discover and use an existing [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential), with the [user’s consent](https://www.w3.org/TR/webauthn-2/#user-consent). [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) script optionally specifies some criteria
to indicate what [credential sources](https://w3c.github.io/webappsec-credential-management/#credential-source) are acceptable to it. The [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) locates [credential sources](https://w3c.github.io/webappsec-credential-management/#credential-source) matching the specified criteria, and guides the user to pick one that the script will be allowed to use. The user may choose to
decline the entire interaction even if a [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source) is present, for example to maintain privacy. If the user picks a [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source), the user agent then uses [§ 6.3.3 The authenticatorGetAssertion Operation](https://www.w3.org/TR/webauthn-2/#sctn-op-get-assertion) to sign a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)-provided challenge and other collected data into an assertion, which is used as a [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential).

The `get()` implementation [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1) calls `PublicKeyCredential.[[CollectFromCredentialStore]]()` to collect any [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential) that
should be available without [user mediation](https://w3c.github.io/webappsec-credential-management/#user-mediated) (roughly, this specification’s [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture)), and if it does not find
exactly one of those, it then calls `PublicKeyCredential.[[DiscoverFromExternalSource]]()` to have
the user select a [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source).

Since this specification requires an [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture) to create any [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential), the `PublicKeyCredential.[[CollectFromCredentialStore]](origin, options, sameOriginWithAncestors)` [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) inherits the default behavior of `Credential.[[CollectFromCredentialStore]]()`, of returning an empty set.

This `navigator.credentials.get()` operation can be aborted by leveraging the `AbortController`;
see [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) for detailed instructions.

##### 5.1.4.1. PublicKeyCredential’s `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` Method

This [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) accepts three arguments:

`origin`

This argument is the [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin), as determined by the
calling `get()` implementation, i.e., `CredentialsContainer`'s [Request a `Credential`](https://w3c.github.io/webappsec-credential-management/#abstract-opdef-request-a-credential) abstract operation.

`options`

This argument is a `CredentialRequestOptions` object whose `options.publicKey` member contains a `PublicKeyCredentialRequestOptions` object specifying the desired attributes of the [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) to discover.

`sameOriginWithAncestors`

This argument is a Boolean value which is `true` if and only if the caller’s [environment settings object](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object) is [same-origin with its ancestors](https://w3c.github.io/webappsec-credential-management/#same-origin-with-its-ancestors). It is `false` if caller is cross-origin.

Note: Invocation of this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) indicates that it was allowed by [permissions policy](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy), which is evaluated at the [\[CREDENTIAL-MANAGEMENT-1\]](https://www.w3.org/TR/webauthn-2/#biblio-credential-management-1) level.
See [§ 5.9 Permissions Policy integration](https://www.w3.org/TR/webauthn-2/#sctn-permissions-policy).

Note: **This algorithm is synchronous:** the `Promise` resolution/rejection is handled by `navigator.credentials.get()`.

Note: All `BufferSource` objects used in this algorithm must be snapshotted when the algorithm begins, to
avoid potential synchronization issues. The algorithm implementations should [get a copy of the bytes held\\
by the buffer source](https://heycam.github.io/webidl#dfn-get-buffer-source-reference) and use that copy for relevant portions of the algorithm.

When this method is invoked, the user agent MUST execute the following algorithm:

01. Assert: `options.publicKey` is present.

02. Let options be the value of `options.publicKey`.

03. If the `timeout` member of options is present, check if its value lies
    within a reasonable range as defined by the [client](https://www.w3.org/TR/webauthn-2/#client) and if not, correct it to the closest value lying within that range.
    Set a timer lifetimeTimer to this adjusted value. If the `timeout` member of options is not present, then set lifetimeTimer to a [client](https://www.w3.org/TR/webauthn-2/#client)-specific default.

    Recommended ranges and defaults for the `timeout` member of options are as follows.
     If `options.userVerification`
    is set to `discouraged`

    Recommended range: 30000 milliseconds to 180000 milliseconds.



    Recommended default value: 120000 milliseconds (2 minutes).

    is set to `required` or `preferred`

    Recommended range: 30000 milliseconds to 600000 milliseconds.



    Recommended default value: 300000 milliseconds (5 minutes).


    Note: The user agent should take cognitive guidelines into considerations regarding timeout for users with special needs.

04. Let callerOrigin be `origin`. If callerOrigin is
    an [opaque origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque), return a `DOMException` whose name is " `NotAllowedError`", and terminate this algorithm.

05. Let effectiveDomain be the callerOrigin’s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain).
    If [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) is not a [valid domain](https://url.spec.whatwg.org/#valid-domain), then return a `DOMException` whose name is " `SecurityError`" and terminate this algorithm.

    Note: An [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) may resolve to a [host](https://url.spec.whatwg.org/#concept-url-host), which can be represented in various manners,
     such as [domain](https://url.spec.whatwg.org/#concept-domain), [ipv4 address](https://url.spec.whatwg.org/#concept-ipv4), [ipv6 address](https://url.spec.whatwg.org/#concept-ipv6), [opaque host](https://url.spec.whatwg.org/#opaque-host), or [empty host](https://url.spec.whatwg.org/#empty-host).
     Only the [domain](https://url.spec.whatwg.org/#concept-domain) format of [host](https://url.spec.whatwg.org/#concept-url-host) is allowed here. This is for simplification and also is
     in recognition of various issues with using direct IP address identification in concert with
     PKI-based security.

06. If options. `rpId` is not present, then set rpId to effectiveDomain.

    Otherwise:
    1. If options. `rpId` [is not a registrable domain suffix of and is not\\
       equal to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) effectiveDomain, return a `DOMException` whose name is " `SecurityError`", and terminate
       this algorithm.

    2. Set rpId to options. `rpId`.

       Note:rpId represents the caller’s [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id). The [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) defaults to being the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) unless the caller has explicitly set options. `rpId` when calling `get()`.
07. Let clientExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map) and let authenticatorExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map).

08. If the `extensions` member of options is present, then [for each](https://infra.spec.whatwg.org/#map-iterate) extensionId → clientExtensionInput of `options.extensions`:
    1. If extensionId is not supported by this [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) or is not an [authentication extension](https://www.w3.org/TR/webauthn-2/#authentication-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).

    2. [Set](https://infra.spec.whatwg.org/#map-set) clientExtensions\[extensionId\] to clientExtensionInput.

    3. If extensionId is not an [authenticator extension](https://www.w3.org/TR/webauthn-2/#authenticator-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).

    4. Let authenticatorExtensionInput be the ( [CBOR](https://www.w3.org/TR/webauthn-2/#cbor)) result of running extensionId’s [client extension processing](https://www.w3.org/TR/webauthn-2/#client-extension-processing) algorithm on clientExtensionInput. If the algorithm returned an error, [continue](https://infra.spec.whatwg.org/#iteration-continue).

    5. [Set](https://infra.spec.whatwg.org/#map-set) authenticatorExtensions\[extensionId\] to the [base64url encoding](https://www.w3.org/TR/webauthn-2/#base64url-encoding) of authenticatorExtensionInput.
09. Let collectedClientData be a new `CollectedClientData` instance whose fields are:
    `type`

    The string "webauthn.get".

    `challenge`

    The [base64url encoding](https://www.w3.org/TR/webauthn-2/#base64url-encoding) of options. `challenge`

    `origin`

    The [serialization of](https://html.spec.whatwg.org/multipage/origin.html#ascii-serialisation-of-an-origin) callerOrigin.

    `crossOrigin`

    The inverse of the value of the `sameOriginWithAncestors` argument passed to this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots).

    `tokenBinding`

    The status of [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) between the client and the callerOrigin, as well as the [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) associated with callerOrigin, if one is available.

10. Let clientDataJSON be the [JSON-compatible serialization of client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-json-compatible-serialization-of-client-data) constructed from collectedClientData.

11. Let clientDataHash be the [hash of the serialized client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-hash-of-the-serialized-client-data) represented by clientDataJSON.

12. If the `options.signal` is present and its [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`, return a `DOMException` whose name is " `AbortError`"
    and terminate this algorithm.

13. Let issuedRequests be a new [ordered set](https://infra.spec.whatwg.org/#ordered-set).

14. Let savedCredentialIds be a new [map](https://infra.spec.whatwg.org/#ordered-map).

15. Let authenticators represent a value which at any given instant is a [set](https://infra.spec.whatwg.org/#ordered-set) of [client platform](https://www.w3.org/TR/webauthn-2/#client-platform)-specific handles, where each [item](https://infra.spec.whatwg.org/#list-item) identifies an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) presently available on this [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) at that instant.

    Note: What qualifies an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) as "available" is intentionally unspecified; this is meant to represent how [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) can be [hot-plugged](https://en.wikipedia.org/w/index.php?title=Hot_plug) into (e.g., via USB)
    or discovered (e.g., via NFC or Bluetooth) by the [client](https://www.w3.org/TR/webauthn-2/#client) by various mechanisms, or permanently built into the [client](https://www.w3.org/TR/webauthn-2/#client).

16. Start lifetimeTimer.

17. [While](https://infra.spec.whatwg.org/#iteration-while) lifetimeTimer has not expired, perform the following actions depending upon lifetimeTimer,
    and the state and response [for each](https://infra.spec.whatwg.org/#list-iterate) authenticator in authenticators:
    If lifetimeTimer expires,


    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

    If the user exercises a user agent user-interface option to cancel the process,


    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Return a `DOMException` whose name is " `NotAllowedError`".

    If the `signal` member is present and the [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`,


    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Then
    return a `DOMException` whose name is " `AbortError`" and terminate this algorithm.

    If issuedRequests is empty, `options.allowCredentials` is not empty, and no authenticator will become available for any [public key credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential) therein,


    Indicate to the user that no eligible credential could be found. When the user acknowledges the dialog, return a `DOMException` whose name is " `NotAllowedError`".



    Note: One way a [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) can determine that no authenticator will become available is by examining the `transports` members of the present `PublicKeyCredentialDescriptor` [items](https://infra.spec.whatwg.org/#list-item) of `options.allowCredentials`, if any. For example, if all `PublicKeyCredentialDescriptor` [items](https://infra.spec.whatwg.org/#list-item) list only `internal`, but all [platform](https://www.w3.org/TR/webauthn-2/#platform-authenticators) authenticators have been tried, then there is no possibility of satisfying the request. Alternatively, all `PublicKeyCredentialDescriptor` [items](https://infra.spec.whatwg.org/#list-item) may list `transports` that the [client platform](https://www.w3.org/TR/webauthn-2/#client-platform) does not support.

    If an authenticator becomes available on this [client device](https://www.w3.org/TR/webauthn-2/#client-device),


    Note: This includes the case where an authenticator was available upon lifetimeTimer initiation.



1. If `options.userVerification` is set to `required` and the authenticator is not capable of performing [user verification](https://www.w3.org/TR/webauthn-2/#user-verification), [continue](https://infra.spec.whatwg.org/#iteration-continue).

2. Let userVerification be the effective user verification requirement for assertion, a Boolean value, as
follows. If `options.userVerification`
is set to `required`

Let userVerification be `true`.

is set to `preferred`

If the authenticator

is capable of [user verification](https://www.w3.org/TR/webauthn-2/#user-verification)

Let userVerification be `true`.

is not capable of [user verification](https://www.w3.org/TR/webauthn-2/#user-verification)

Let userVerification be `false`.

is set to `discouraged`

Let userVerification be `false`.

3. If `options.allowCredentials`
[is not empty](https://infra.spec.whatwg.org/#list-is-empty)

1. Let allowCredentialDescriptorList be a new [list](https://infra.spec.whatwg.org/#list).

2. Execute a [client platform](https://www.w3.org/TR/webauthn-2/#client-platform)-specific procedure to determine which, if any, [public key credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential) described by `options.allowCredentials` are [bound](https://www.w3.org/TR/webauthn-2/#bound-credential) to this authenticator, by matching with rpId, `options.allowCredentials.id`,
and `options.allowCredentials.type`.
Set allowCredentialDescriptorList to this filtered list.

3. If allowCredentialDescriptorList [is empty](https://infra.spec.whatwg.org/#list-is-empty), [continue](https://infra.spec.whatwg.org/#iteration-continue).

4. Let distinctTransports be a new [ordered set](https://infra.spec.whatwg.org/#ordered-set).

5. If allowCredentialDescriptorList has exactly one value, set `savedCredentialIds[authenticator]` to `allowCredentialDescriptorList[0].id`’s
value (see [here](https://www.w3.org/TR/webauthn-2/#authenticatorGetAssertion-return-values) in [§ 6.3.3 The authenticatorGetAssertion Operation](https://www.w3.org/TR/webauthn-2/#sctn-op-get-assertion) for more information).

6. [For each](https://infra.spec.whatwg.org/#list-iterate) credential descriptor C in allowCredentialDescriptorList, [append](https://infra.spec.whatwg.org/#set-append) each value, if any, of `C.transports` to distinctTransports.

Note: This will aggregate only distinct values of `transports` (for this [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)) in distinctTransports due to the properties of [ordered sets](https://infra.spec.whatwg.org/#ordered-set).

7. If distinctTransports
[is not empty](https://infra.spec.whatwg.org/#list-is-empty)

The client selects one transport value from distinctTransports, possibly incorporating local
configuration knowledge of the appropriate transport to use with authenticator in making its
selection.



Then, using transport, invoke the [authenticatorGetAssertion](https://www.w3.org/TR/webauthn-2/#authenticatorgetassertion) operation on authenticator, with rpId, clientDataHash, allowCredentialDescriptorList, userVerification, and authenticatorExtensions as parameters.

[is empty](https://infra.spec.whatwg.org/#list-is-empty)

Using local configuration knowledge of the appropriate transport to use with authenticator,
invoke the [authenticatorGetAssertion](https://www.w3.org/TR/webauthn-2/#authenticatorgetassertion) operation on authenticator with rpId, clientDataHash, allowCredentialDescriptorList, userVerification, and authenticatorExtensions as parameters.


[is empty](https://infra.spec.whatwg.org/#list-is-empty)

Using local configuration knowledge of the appropriate transport to use with authenticator, invoke the [authenticatorGetAssertion](https://www.w3.org/TR/webauthn-2/#authenticatorgetassertion) operation on authenticator with rpId, clientDataHash, userVerification and authenticatorExtensions as parameters.

Note: In this case, the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) did not supply a list of acceptable credential descriptors. Thus, the
authenticator is being asked to exercise any credential it may possess that is [scoped](https://www.w3.org/TR/webauthn-2/#scope) to
the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), as identified by rpId.

4. [Append](https://infra.spec.whatwg.org/#set-append) authenticator to issuedRequests.


If an authenticator ceases to be available on this [client device](https://www.w3.org/TR/webauthn-2/#client-device),


[Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

If any authenticator returns a status indicating that the user cancelled the operation,


1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

2. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation
on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.

Note: [Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) may return an indication of "the user cancelled the entire operation".
How a user agent manifests this state to users is unspecified.


If any authenticator returns an error status,


[Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

If any authenticator indicates success,


1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.

2. Let assertionCreationData be a [struct](https://infra.spec.whatwg.org/#struct) whose [items](https://infra.spec.whatwg.org/#struct-item) are:
`credentialIdResult`

If `savedCredentialIds[authenticator]` exists, set the value of [credentialIdResult](https://www.w3.org/TR/webauthn-2/#assertioncreationdata-credentialidresult) to be
the bytes of `savedCredentialIds[authenticator]`. Otherwise, set the value of [credentialIdResult](https://www.w3.org/TR/webauthn-2/#assertioncreationdata-credentialidresult) to be the bytes of the [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id) returned from the successful [authenticatorGetAssertion](https://www.w3.org/TR/webauthn-2/#authenticatorgetassertion) operation, as defined in [§ 6.3.3 The authenticatorGetAssertion Operation](https://www.w3.org/TR/webauthn-2/#sctn-op-get-assertion).

`clientDataJSONResult`

whose value is the bytes of clientDataJSON.

`authenticatorDataResult`

whose value is the bytes of the [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) returned by the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

`signatureResult`

whose value is the bytes of the signature value returned by the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

`userHandleResult`

If the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) returned a [user handle](https://www.w3.org/TR/webauthn-2/#user-handle), set the value of [userHandleResult](https://www.w3.org/TR/webauthn-2/#assertioncreationdata-userhandleresult) to be the bytes of
the returned [user handle](https://www.w3.org/TR/webauthn-2/#user-handle). Otherwise, set the value of [userHandleResult](https://www.w3.org/TR/webauthn-2/#assertioncreationdata-userhandleresult) to null.

`clientExtensionResults`

whose value is an `AuthenticationExtensionsClientOutputs` object containing [extension identifier](https://www.w3.org/TR/webauthn-2/#extension-identifier) → [client extension output](https://www.w3.org/TR/webauthn-2/#client-extension-output) entries. The entries are created by running each extension’s [client extension processing](https://www.w3.org/TR/webauthn-2/#client-extension-processing) algorithm to create the [client extension outputs](https://www.w3.org/TR/webauthn-2/#client-extension-output), for each [client extension](https://www.w3.org/TR/webauthn-2/#client-extension) in `options.extensions`.

3. Let constructAssertionAlg be an algorithm that takes a [global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-global) global, and whose steps are:
1. Let pubKeyCred be a new `PublicKeyCredential` object associated with global whose fields are:
      `[[identifier]]`

      A new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.credentialIdResult`.

      `response`

      A new `AuthenticatorAssertionResponse` object associated with global whose fields are:

      `clientDataJSON`

      A new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.clientDataJSONResult`.

      `authenticatorData`

      A new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.authenticatorDataResult`.

      `signature`

      A new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.signatureResult`.

      `userHandle`

      If `assertionCreationData.userHandleResult` is null, set this
      field to null. Otherwise, set this field to a new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.userHandleResult`.

      `[[clientExtensionsResults]]`

      A new `ArrayBuffer`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.clientExtensionResults`.

2. Return pubKeyCred.
4. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](https://www.w3.org/TR/webauthn-2/#authenticatorcancel) operation
on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.

5. Return constructAssertionAlg and terminate this algorithm.


18. Return a `DOMException` whose name is " `NotAllowedError`". In order to prevent information leak that could identify the
    user without [consent](https://www.w3.org/TR/webauthn-2/#user-consent), this step MUST NOT be executed before lifetimeTimer has expired. See [§ 14.5.2 Authentication Ceremony Privacy](https://www.w3.org/TR/webauthn-2/#sctn-assertion-privacy) for details.


During the above process, the user agent SHOULD show some UI to the user to guide them in the process of selecting and
authorizing an authenticator with which to complete the operation.

#### 5.1.5. Store an Existing Credential - PublicKeyCredential’s `[[Store]](credential, sameOriginWithAncestors)` Method

The `[[Store]](credential, sameOriginWithAncestors)` method is not supported
for Web Authentication’s `PublicKeyCredential` type, so it always returns an error.

Note: This algorithm is synchronous; the `Promise` resolution/rejection is handled by `navigator.credentials.store()`.

This [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) accepts two arguments:

`credential`

This argument is a `PublicKeyCredential` object.

`sameOriginWithAncestors`

This argument is a Boolean value which is `true` if and only if the caller’s [environment settings object](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object) is [same-origin with its ancestors](https://w3c.github.io/webappsec-credential-management/#same-origin-with-its-ancestors).

When this method is invoked, the user agent MUST execute the following algorithm:

1. Return a `DOMException` whose name is " `NotSupportedError`", and terminate this algorithm


#### 5.1.6. Preventing Silent Access to an Existing Credential - PublicKeyCredential’s `[[preventSilentAccess]](credential, sameOriginWithAncestors)` Method

Calling the `[[preventSilentAccess]](credential, sameOriginWithAncestors)` method
will have no effect on authenticators that require an [authorization gesture](https://www.w3.org/TR/webauthn-2/#authorization-gesture),
but setting that flag may potentially exclude authenticators that can operate without user intervention.

This [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) accepts no arguments.

#### 5.1.7. Availability of [User-Verifying Platform Authenticator](https://www.w3.org/TR/webauthn-2/\#user-verifying-platform-authenticator) \- PublicKeyCredential’s `isUserVerifyingPlatformAuthenticatorAvailable()` Method

[WebAuthn Relying Parties](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) use this method to determine whether they can create a new credential using a [user-verifying platform authenticator](https://www.w3.org/TR/webauthn-2/#user-verifying-platform-authenticator).
Upon invocation, the [client](https://www.w3.org/TR/webauthn-2/#client) employs a [client platform](https://www.w3.org/TR/webauthn-2/#client-platform)-specific procedure to discover available [user-verifying platform authenticators](https://www.w3.org/TR/webauthn-2/#user-verifying-platform-authenticator).
If any are discovered, the promise is resolved with the value of `true`.
Otherwise, the promise is resolved with the value of `false`.
Based on the result, the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) can take further actions to guide the user to create a credential.

This method has no arguments and returns a Boolean value.

**✔** MDN

[PublicKeyCredential/isUserVerifyingPlatformAuthenticatorAvailable](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/isUserVerifyingPlatformAuthenticatorAvailable "isUserVerifyingPlatformAuthenticatorAvailable() is a static method of the PublicKeyCredential interface that returns a Promise which resolves to true if a user-verifying platform authenticator is available.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

```
partial interface PublicKeyCredential {
    static Promise<boolean> isUserVerifyingPlatformAuthenticatorAvailable();
};

```

Note: Invoking this method from a [browsing context](https://html.spec.whatwg.org/multipage/browsers.html#browsing-context) where the [Web Authentication API](https://www.w3.org/TR/webauthn-2/#web-authentication-api) is "disabled" according to the [allowed to use](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#allowed-to-use) algorithm—i.e., by a [permissions policy](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy)—will result in the promise being rejected with a `DOMException` whose name is " `NotAllowedError`". See also [§ 5.9 Permissions Policy integration](https://www.w3.org/TR/webauthn-2/#sctn-permissions-policy).

### 5.2. Authenticator Responses (interface `AuthenticatorResponse`)

**✔** MDN

[AuthenticatorResponse](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse "The AuthenticatorResponse interface of the Web Authentication API is the base interface for interfaces that provide a cryptographic root of trust for a key pair. The child interfaces include information from the browser such as the challenge origin and either may be returned from PublicKeyCredential.response.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

[Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) respond to [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) requests by returning an object derived from the `AuthenticatorResponse` interface:

```
[SecureContext, Exposed=Window]
interface AuthenticatorResponse {
    [SameObject] readonly attribute ArrayBuffer      clientDataJSON;
};

```

**✔** MDN

[AuthenticatorResponse/clientDataJSON](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse/clientDataJSON "The clientDataJSON property of the AuthenticatorResponse interface stores a JSON string in an ArrayBuffer, representing the client data that was passed to CredentialsContainer.create() or CredentialsContainer.get(). This property is only accessed on one of the child objects of AuthenticatorResponse, specifically AuthenticatorAttestationResponse or AuthenticatorAssertionResponse.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`clientDataJSON`,  of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains a [JSON-compatible serialization](https://www.w3.org/TR/webauthn-2/#clientdatajson-serialization) of the [client data](https://www.w3.org/TR/webauthn-2/#client-data), the [hash of which](https://www.w3.org/TR/webauthn-2/#collectedclientdata-hash-of-the-serialized-client-data) is passed to the
authenticator by the client in its call to either `create()` or `get()` (i.e., the [client data](https://www.w3.org/TR/webauthn-2/#client-data) itself is not sent to the authenticator).

#### 5.2.1. Information About Public Key Credential (interface `AuthenticatorAttestationResponse`)

**✔** MDN

[AuthenticatorAttestationResponse](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse "The AuthenticatorAttestationResponse interface of the Web Authentication API is returned by CredentialsContainer.create() when a PublicKeyCredential is passed, and provides a cryptographic root of trust for the new key pair that has been generated. This response should be sent to the relying party's server to complete the creation of the credential.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung Internet10.0+Opera MobileNone

The `AuthenticatorAttestationResponse` interface represents the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)'s response to a client’s request
for the creation of a new [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential). It contains information about the new credential that can be used to
identify it for later use, and metadata that can be used by the [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) to assess the characteristics of the credential
during registration.

**⚠** MDN

[AuthenticatorAttestationResponse/getTransports](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse/getTransports "getTransports() is a method of the AuthenticatorAttestationResponse interface that returns an Array containing strings describing the different transports which may be used by the authenticator.")

In no current engines.

FirefoxNoneSafariNoneChromeNone

* * *

OperaNoneEdgeNone

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for AndroidNoneiOS SafariNoneChrome for AndroidNoneAndroid WebViewNoneSamsung InternetNoneOpera MobileNone

```
[SecureContext, Exposed=Window]
interface AuthenticatorAttestationResponse : AuthenticatorResponse {
    [SameObject] readonly attribute ArrayBuffer      attestationObject;
    sequence<DOMString>                              getTransports();
    ArrayBuffer                                      getAuthenticatorData();
    ArrayBuffer?                                     getPublicKey();
    COSEAlgorithmIdentifier                          getPublicKeyAlgorithm();
};

```

`clientDataJSON`

This attribute, inherited from `AuthenticatorResponse`, contains the [JSON-compatible serialization of client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-json-compatible-serialization-of-client-data) (see [§ 6.5 Attestation](https://www.w3.org/TR/webauthn-2/#sctn-attestation)) passed to the authenticator by the client in order to generate this credential. The
exact JSON serialization MUST be preserved, as the [hash of the serialized client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-hash-of-the-serialized-client-data) has been computed
over it.

**✔** MDN

[AuthenticatorAttestationResponse/attestationObject](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse/attestationObject "The attestationObject property of the AuthenticatorAttestationResponse interface returns an ArrayBuffer containing the new public key, as well as signature over the entire attestationObject with a private key that is stored in the authenticator when it is manufactured.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung Internet10.0+Opera MobileNone

`attestationObject`,  of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains an [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object), which is opaque to, and cryptographically protected against
tampering by, the client. The [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object) contains both [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) and an [attestation\\
statement](https://www.w3.org/TR/webauthn-2/#attestation-statement). The former contains the AAGUID, a unique [credential ID](https://www.w3.org/TR/webauthn-2/#credential-id), and the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key). The
contents of the [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement) are determined by the [attestation statement format](https://www.w3.org/TR/webauthn-2/#attestation-statement-format) used by the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator). It also contains any additional information that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)'s server requires to validate the [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement), as well as to decode and validate the [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) along with the [JSON-compatible serialization of client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-json-compatible-serialization-of-client-data). For more details, see [§ 6.5 Attestation](https://www.w3.org/TR/webauthn-2/#sctn-attestation), [§ 6.5.4 Generating an Attestation Object](https://www.w3.org/TR/webauthn-2/#sctn-generating-an-attestation-object),
and [Figure 6](https://www.w3.org/TR/webauthn-2/#fig-attStructs).

`getTransports()`

This operation returns the value of `[[transports]]`.

`getAuthenticatorData()`

This operation returns the [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) contained within `attestationObject`. See [§ 5.2.1.1 Easily accessing credential data](https://www.w3.org/TR/webauthn-2/#sctn-public-key-easy).

`getPublicKey()`

This operation returns the DER [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7) of the new credential, or null if this is not available. See [§ 5.2.1.1 Easily accessing credential data](https://www.w3.org/TR/webauthn-2/#sctn-public-key-easy).

`getPublicKeyAlgorithm()`

This operation returns the `COSEAlgorithmIdentifier` of the new credential. See [§ 5.2.1.1 Easily accessing credential data](https://www.w3.org/TR/webauthn-2/#sctn-public-key-easy).

`[[transports]]`

This [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) contains a sequence of zero or more unique `DOMString` s in lexicographical order. These values are the transports that the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) is believed to support, or an empty sequence if the information is unavailable. The values SHOULD be members of `AuthenticatorTransport` but [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) MUST ignore unknown values.

##### 5.2.1.1. Easily accessing credential data

Every user of the `[[Create]](origin, options, sameOriginWithAncestors)` method will need to parse and store the returned [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) in order to verify future [authentication assertions](https://www.w3.org/TR/webauthn-2/#authentication-assertion). However, the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) is in [\[RFC8152\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8152) (COSE) format, inside the [credentialPublicKey](https://www.w3.org/TR/webauthn-2/#credentialpublickey) member of the [attestedCredentialData](https://www.w3.org/TR/webauthn-2/#attestedcredentialdata), inside the [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data), inside the [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object) conveyed by `AuthenticatorAttestationResponse`. `attestationObject`. [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) wishing to use [attestation](https://www.w3.org/TR/webauthn-2/#attestation) are obliged to do the work of parsing the `attestationObject` and obtaining the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) because that public key copy is the one the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) [signed](https://www.w3.org/TR/webauthn-2/#signing-procedure). However, many valid WebAuthn use cases do not require [attestation](https://www.w3.org/TR/webauthn-2/#attestation). For those uses, user agents can do the work of parsing, expose the [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) directly, and translate the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) into a more convenient format.

The `getPublicKey()` operation thus returns the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) as a [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7). This `ArrayBuffer` can, for example, be passed to Java’s `java.security.spec.X509EncodedKeySpec`, .NET’s `System.Security.Cryptography.ECDsa.ImportSubjectPublicKeyInfo`, or Go’s `crypto/x509.ParsePKIXPublicKey`.

Use of `getPublicKey()` does impose some limitations: by using `pubKeyCredParams`, a [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) can negotiate with the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) to use public key algorithms that the user agent may not understand. However, if the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) does so, the user agent will not be able to translate the resulting [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) into [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7) format and the return value of `getPublicKey()` will be null.

User agents MUST be able to return a non-null value for `getPublicKey()` when the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key) has a `COSEAlgorithmIdentifier` value of:

- -7 (ES256), where [kty](https://tools.ietf.org/html/rfc8152#section-7.1) is 2 (with uncompressed points) and [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) is 1 (P-256).

- -257 (RS256).

- -8 (EdDSA), where [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) is 6 (Ed25519).


A [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7) does not include information about the signing algorithm (for example, which hash function to use) that is included in the COSE public key. To provide this, `getPublicKeyAlgorithm()` returns the `COSEAlgorithmIdentifier` for the [credential public key](https://www.w3.org/TR/webauthn-2/#credential-public-key).

To remove the need to parse CBOR at all in many cases, `getAuthenticatorData()` returns the [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) from `attestationObject`. The [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) contains other fields that are encoded in a binary format. However, helper functions are not provided to access them because [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) already need to extract those fields when [getting an assertion](https://www.w3.org/TR/webauthn-2/#sctn-getAssertion). In contrast to [credential creation](https://www.w3.org/TR/webauthn-2/#sctn-createCredential), where signature verification is [optional](https://www.w3.org/TR/webauthn-2/#enumdef-attestationconveyancepreference), [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) should always be verifying signatures from an assertion and thus must extract fields from the signed [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data). The same functions used there will also serve during credential creation.

Note: `getPublicKey()` and `getAuthenticatorData()` were only added in level two of this spec. [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD use feature detection before using these functions by testing the value of `'getPublicKey' in AuthenticatorAttestationResponse.prototype`. [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) that require this function to exist may not interoperate with older user-agents.

#### 5.2.2. Web Authentication Assertion (interface `AuthenticatorAssertionResponse`)

**✔** MDN

[AuthenticatorAssertionResponse](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse "The AuthenticatorAssertionResponse interface of the Web Authentication API is returned by CredentialsContainer.get() when a PublicKeyCredential is passed, and provides proof to a service that it has a key pair and that the authentication request is valid and approved.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

The `AuthenticatorAssertionResponse` interface represents an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator)'s response to a client’s request for
generation of a new [authentication assertion](https://www.w3.org/TR/webauthn-2/#authentication-assertion) given the [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party)'s challenge and OPTIONAL list of credentials it is
aware of. This response contains a cryptographic signature proving possession of the [credential private key](https://www.w3.org/TR/webauthn-2/#credential-private-key), and
optionally evidence of [user consent](https://www.w3.org/TR/webauthn-2/#user-consent) to a specific transaction.

```
[SecureContext, Exposed=Window]
interface AuthenticatorAssertionResponse : AuthenticatorResponse {
    [SameObject] readonly attribute ArrayBuffer      authenticatorData;
    [SameObject] readonly attribute ArrayBuffer      signature;
    [SameObject] readonly attribute ArrayBuffer?     userHandle;
};

```

`clientDataJSON`

This attribute, inherited from `AuthenticatorResponse`, contains the [JSON-compatible serialization of client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-json-compatible-serialization-of-client-data) (see [§ 5.8.1 Client Data Used in WebAuthn Signatures (dictionary CollectedClientData)](https://www.w3.org/TR/webauthn-2/#dictionary-client-data)) passed to the authenticator by the client in order to generate this assertion. The
exact JSON serialization MUST be preserved, as the [hash of the serialized client data](https://www.w3.org/TR/webauthn-2/#collectedclientdata-hash-of-the-serialized-client-data) has been computed
over it.

**✔** MDN

[AuthenticatorAssertionResponse/authenticatorData](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/authenticatorData "The authenticatorData property of the AuthenticatorAssertionResponse interface returns an ArrayBuffer containing information from the authenticator such as the Relying Party ID Hash (rpIdHash), a signature counter, test of user presence, user verification flags, and any extensions processed by the authenticator.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`authenticatorData`,  of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains the [authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) returned by the authenticator. See [§ 6.1 Authenticator Data](https://www.w3.org/TR/webauthn-2/#sctn-authenticator-data).

**✔** MDN

[AuthenticatorAssertionResponse/signature](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/signature "The signature read-only property of the AuthenticatorAssertionResponse interface is an ArrayBuffer object which is the signature of the authenticator for both AuthenticatorAssertionResponse.authenticatorData and a SHA-256 hash of the client data (AuthenticatorAssertionResponse.clientDataJSON).")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`signature`,  of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains the raw signature returned from the authenticator. See [§ 6.3.3 The authenticatorGetAssertion Operation](https://www.w3.org/TR/webauthn-2/#sctn-op-get-assertion).

**✔** MDN

[AuthenticatorAssertionResponse/userHandle](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/userHandle "The userHandle read-only property of the AuthenticatorAssertionResponse interface is an ArrayBuffer object which is an opaque identifier for the given user. Such an identifier can be used by the relying party's server to link the user account with its corresponding credentials and other data.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

OperaNoneEdge79+

* * *

Edge (Legacy)18IENone

* * *

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`userHandle`,  of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly, nullable

This attribute contains the [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) returned from the authenticator, or null if the authenticator did not return a [user handle](https://www.w3.org/TR/webauthn-2/#user-handle). See [§ 6.3.3 The authenticatorGetAssertion Operation](https://www.w3.org/TR/webauthn-2/#sctn-op-get-assertion).

### 5.3. Parameters for Credential Generation (dictionary `PublicKeyCredentialParameters`)

```
dictionary PublicKeyCredentialParameters {
    required DOMString                    type;
    required COSEAlgorithmIdentifier      alg;
};

```

This dictionary is used to supply additional parameters when creating a new credential.
`type`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member specifies the type of credential to be created. The value SHOULD be a member of `PublicKeyCredentialType` but [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) MUST ignore unknown values, ignoring any `PublicKeyCredentialParameters` with an unknown `type`.

`alg`,  of type [COSEAlgorithmIdentifier](https://www.w3.org/TR/webauthn-2/#typedefdef-cosealgorithmidentifier)

This member specifies the cryptographic signature algorithm with which the newly generated credential will be used, and
thus also the type of asymmetric key pair to be generated, e.g., RSA or Elliptic Curve.

Note: we use "alg" as the latter member name, rather than spelling-out "algorithm", because it will be serialized into
a message to the authenticator, which may be sent over a low-bandwidth link.

### 5.4. Options for Credential Creation (dictionary `PublicKeyCredentialCreationOptions`)

**✔** MDN

[PublicKeyCredentialCreationOptions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions "The PublicKeyCredentialCreationOptions dictionary of the Web Authentication API holds options passed to navigators.credentials.create() in order to create a PublicKeyCredential.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

```
dictionary PublicKeyCredentialCreationOptions {
    required PublicKeyCredentialRpEntity         rp;
    required PublicKeyCredentialUserEntity       user;

    required BufferSource                             challenge;
    required sequence<PublicKeyCredentialParameters>  pubKeyCredParams;

    unsigned long                                timeout;
    sequence<PublicKeyCredentialDescriptor>      excludeCredentials = [];
    AuthenticatorSelectionCriteria               authenticatorSelection;
    DOMString                                    attestation = "none";
    AuthenticationExtensionsClientInputs         extensions;
};

```

**✔** MDN

[PublicKeyCredentialCreationOptions/rp](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/rp "The rp property of the PublicKeyCredentialCreationOptions dictionary is an object describing the relying party which requested the credential creation (via navigator.credentials.create()).")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`rp`,  of type [PublicKeyCredentialRpEntity](https://www.w3.org/TR/webauthn-2/#dictdef-publickeycredentialrpentity)

This member contains data about the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) responsible for the request.

Its value’s `name` member is REQUIRED. See [§ 5.4.1 Public Key Entity Description (dictionary PublicKeyCredentialEntity)](https://www.w3.org/TR/webauthn-2/#dictionary-pkcredentialentity) for further
details.

Its value’s `id` member specifies the [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id) the credential
should be [scoped](https://www.w3.org/TR/webauthn-2/#scope) to. If omitted, its value will be the `CredentialsContainer` object’s [relevant\\
settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). See [§ 5.4.2 Relying Party Parameters for Credential Generation (dictionary PublicKeyCredentialRpEntity)](https://www.w3.org/TR/webauthn-2/#dictionary-rp-credential-params) for further details.

**✔** MDN

[PublicKeyCredentialCreationOptions/user](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/user "The user property of the PublicKeyCredentialCreationOptions dictionary is an object describing the user account for which the credentials are generated (via navigator.credentials.create()).")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`user`,  of type [PublicKeyCredentialUserEntity](https://www.w3.org/TR/webauthn-2/#dictdef-publickeycredentialuserentity)

This member contains data about the user account for which the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) is requesting attestation.

Its value’s `name`, `displayName` and `id` members are REQUIRED. See [§ 5.4.1 Public Key Entity Description (dictionary PublicKeyCredentialEntity)](https://www.w3.org/TR/webauthn-2/#dictionary-pkcredentialentity) and [§ 5.4.3 User Account Parameters for Credential Generation (dictionary PublicKeyCredentialUserEntity)](https://www.w3.org/TR/webauthn-2/#dictionary-user-credential-params) for further details.

**✔** MDN

[PublicKeyCredentialCreationOptions/challenge](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/challenge "The challenge property of the PublicKeyCredentialCreationOptions dictionary is a BufferSource used as a cryptographic challenge. This is randomly generated then sent from the relying party's server. This value (among other client data) will be signed by the authenticator, using its private key, and must be sent back for verification to the server as part of AuthenticatorAttestationResponse.attestationObject.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`challenge`,  of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

This member contains a challenge intended to be used for generating the newly created credential’s [attestation\\
object](https://www.w3.org/TR/webauthn-2/#attestation-object). See the [§ 13.4.3 Cryptographic Challenges](https://www.w3.org/TR/webauthn-2/#sctn-cryptographic-challenges) security consideration.

**✔** MDN

[PublicKeyCredentialCreationOptions/pubKeyCredParams](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/pubKeyCredParams "The pubKeyCredParams property of the PublicKeyCredentialCreationOptions dictionary is an Array whose elements are objects describing the desired features of the credential to be created. These objects define the type of public-key and the algorithm used for cryptographic signature operations.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`pubKeyCredParams`,  of type sequence< [PublicKeyCredentialParameters](https://www.w3.org/TR/webauthn-2/#dictdef-publickeycredentialparameters) >

This member contains information about the desired properties of the credential to be created. The sequence is ordered
from most preferred to least preferred. The [client](https://www.w3.org/TR/webauthn-2/#client) makes a best-effort to create the most preferred credential that it
can.

**✔** MDN

[PublicKeyCredentialCreationOptions/timeout](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/timeout "The timeout property, of the PublicKeyCredentialCreationOptions dictionary, represents an hint, given in milliseconds, for the time the script is willing to wait for the completion of the creation operation.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`timeout`,  of type [unsigned long](https://heycam.github.io/webidl/#idl-unsigned-long)

This member specifies a time, in milliseconds, that the caller is willing to wait for the call to complete. This is
treated as a hint, and MAY be overridden by the [client](https://www.w3.org/TR/webauthn-2/#client).

**✔** MDN

[PublicKeyCredentialCreationOptions/excludeCredentials](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/excludeCredentials "excludeCredentials, an optional property of the PublicKeyCredentialCreationOptions dictionary, is an Array whose elements are descriptors for the public keys already existing for a given user. This is provided by the relying party's server if it wants to prevent creation of new credentials for an existing user.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`excludeCredentials`,  of type sequence< [PublicKeyCredentialDescriptor](https://www.w3.org/TR/webauthn-2/#dictdef-publickeycredentialdescriptor) >, defaulting to `[]`

This member is intended for use by [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) that wish to limit the creation of multiple credentials for the same
account on a single authenticator. The [client](https://www.w3.org/TR/webauthn-2/#client) is requested to return an error if the new credential would be created
on an authenticator that also contains one of the credentials enumerated in this parameter.

**✔** MDN

[PublicKeyCredentialCreationOptions/authenticatorSelection](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/authenticatorSelection "authenticatorSelection, an optional property of the PublicKeyCredentialCreationOptions dictionary, is an object giving criteria to filter out the authenticators to be used for the creation operation.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`authenticatorSelection`,  of type [AuthenticatorSelectionCriteria](https://www.w3.org/TR/webauthn-2/#dictdef-authenticatorselectioncriteria)

This member is intended for use by [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) that wish to select the appropriate authenticators to participate in
the `create()` operation.

**✔** MDN

[PublicKeyCredentialCreationOptions/attestation](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/attestation "attestation is an optional property of the PublicKeyCredentialCreationOptions dictionary. This is a string whose value indicates the preference regarding the attestation transport, between the authenticator, the client and the relying party.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`attestation`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString), defaulting to `"none"`

This member is intended for use by [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) that wish to express their preference for [attestation conveyance](https://www.w3.org/TR/webauthn-2/#attestation-conveyance).
Its values SHOULD be members of `AttestationConveyancePreference`. [Client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists).
Its default value is "none".

`extensions`,  of type [AuthenticationExtensionsClientInputs](https://www.w3.org/TR/webauthn-2/#dictdef-authenticationextensionsclientinputs)

This member contains additional parameters requesting additional processing by the client and authenticator. For
example, the caller may request that only authenticators with certain capabilities be used to create the credential, or
that particular information be returned in the [attestation object](https://www.w3.org/TR/webauthn-2/#attestation-object). Some extensions are defined in [§ 9 WebAuthn Extensions](https://www.w3.org/TR/webauthn-2/#sctn-extensions);
consult the IANA "WebAuthn Extension Identifiers" registry [\[IANA-WebAuthn-Registries\]](https://www.w3.org/TR/webauthn-2/#biblio-iana-webauthn-registries) established by [\[RFC8809\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8809) for an up-to-date list
of registered [WebAuthn Extensions](https://www.w3.org/TR/webauthn-2/#webauthn-extensions).

#### 5.4.1. Public Key Entity Description (dictionary `PublicKeyCredentialEntity`)

The `PublicKeyCredentialEntity` dictionary describes a user account, or a [WebAuthn Relying Party](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party), which a [public key credential](https://www.w3.org/TR/webauthn-2/#public-key-credential) is
associated with or [scoped](https://www.w3.org/TR/webauthn-2/#scope) to, respectively.

```
dictionary PublicKeyCredentialEntity {
    required DOMString    name;
};

```

`name`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

A [human-palatable](https://www.w3.org/TR/webauthn-2/#human-palatability) name for the entity. Its function depends on what the `PublicKeyCredentialEntity` represents:

- When inherited by `PublicKeyCredentialRpEntity` it is a [human-palatable](https://www.w3.org/TR/webauthn-2/#human-palatability) identifier for the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), intended only
for display. For example, "ACME Corporation", "Wonderful Widgets, Inc." or "ОАО Примертех".
  - [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD perform enforcement, as prescribed in Section 2.3 of [\[RFC8266\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [\[RFC8264\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8264),
    when setting `name`'s value, or displaying the value to the user.

  - This string MAY contain language and direction metadata. [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD consider providing this information. See [§ 6.4.2 Language and Direction Encoding](https://www.w3.org/TR/webauthn-2/#sctn-strings-langdir) about how this metadata is encoded.

  - [Clients](https://www.w3.org/TR/webauthn-2/#client) SHOULD perform enforcement, as prescribed in Section 2.3 of [\[RFC8266\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [\[RFC8264\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8264),
    on `name`'s value prior to displaying the value to the user or
    including the value as a parameter of the [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) operation.
- When inherited by `PublicKeyCredentialUserEntity`, it is a [human-palatable](https://www.w3.org/TR/webauthn-2/#human-palatability) identifier for a
user account. It is intended only for display, i.e., aiding the user in determining the difference between user
accounts with similar `displayName` s. For example, "alexm", "alex.mueller@example.com"
or "+14255551234".
  - The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) MAY let the user choose this value. The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD perform enforcement,
    as prescribed in Section 3.4.3 of [\[RFC8265\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8265) for the UsernameCasePreserved Profile of the PRECIS
    IdentifierClass [\[RFC8264\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8264), when setting `name`'s value, or displaying the value
    to the user.

  - This string MAY contain language and direction metadata. [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD consider providing this information. See [§ 6.4.2 Language and Direction Encoding](https://www.w3.org/TR/webauthn-2/#sctn-strings-langdir) about how this metadata is encoded.

  - [Clients](https://www.w3.org/TR/webauthn-2/#client) SHOULD perform enforcement, as prescribed in Section 3.4.3 of [\[RFC8265\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8265) for the UsernameCasePreserved Profile of the PRECIS IdentifierClass [\[RFC8264\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8264),
    on `name`'s value prior to displaying the value to the user or
    including the value as a parameter of the [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) operation.

When [clients](https://www.w3.org/TR/webauthn-2/#client), [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform), or [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) display a `name`'s value, they should always use UI elements to provide a clear boundary around the displayed value, and not allow overflow into other elements [\[css-overflow-3\]](https://www.w3.org/TR/webauthn-2/#biblio-css-overflow-3).

Authenticators MAY truncate a `name` member’s value so that it fits within 64 bytes, if the authenticator stores the value. See [§ 6.4.1 String Truncation](https://www.w3.org/TR/webauthn-2/#sctn-strings-truncation) about truncation and other considerations.

#### 5.4.2. Relying Party Parameters for Credential Generation (dictionary `PublicKeyCredentialRpEntity`)

The `PublicKeyCredentialRpEntity` dictionary is used to supply additional [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) attributes when creating a new credential.

```
dictionary PublicKeyCredentialRpEntity : PublicKeyCredentialEntity {
    DOMString      id;
};

```

`id`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

A unique identifier for the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) entity, which sets the [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id).

#### 5.4.3. User Account Parameters for Credential Generation (dictionary `PublicKeyCredentialUserEntity`)

The `PublicKeyCredentialUserEntity` dictionary is used to supply additional user account attributes when creating a new
credential.

```
dictionary PublicKeyCredentialUserEntity : PublicKeyCredentialEntity {
    required BufferSource   id;
    required DOMString      displayName;
};

```

`id`,  of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

The [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) of the user account entity.
A [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) is an opaque [byte sequence](https://infra.spec.whatwg.org/#byte-sequence) with a maximum size of 64 bytes,
and is not meant to be displayed to the user.

To ensure secure operation, authentication and authorization
decisions MUST be made on the basis of this `id` member, not the `displayName` nor `name` members. See Section 6.1 of [\[RFC8266\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8266).

The [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) MUST NOT contain personally identifying information about the user, such as a username or e-mail address;
see [§ 14.6.1 User Handle Contents](https://www.w3.org/TR/webauthn-2/#sctn-user-handle-privacy) for details. The [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) MUST NOT be empty, though it MAY be null.

Note: the [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) _ought not_ be a constant value across different accounts, even for [non-discoverable credentials](https://www.w3.org/TR/webauthn-2/#non-discoverable-credential), because some authenticators always create [discoverable credentials](https://www.w3.org/TR/webauthn-2/#discoverable-credential). Thus a constant [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) would prevent a user from using such an authenticator with more than one account at the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party).

`displayName`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

A [human-palatable](https://www.w3.org/TR/webauthn-2/#human-palatability) name for the user account, intended only for display. For example, "Alex Müller" or "田中倫". The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD let the user choose this, and SHOULD NOT restrict the choice more than necessary.

- [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD perform enforcement, as prescribed in Section 2.3 of [\[RFC8266\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [\[RFC8264\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8264),
when setting `displayName`'s value, or displaying the value to the user.

- This string MAY contain language and direction metadata. [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD consider providing this information. See [§ 6.4.2 Language and Direction Encoding](https://www.w3.org/TR/webauthn-2/#sctn-strings-langdir) about how this metadata is encoded.

- [Clients](https://www.w3.org/TR/webauthn-2/#client) SHOULD perform enforcement, as prescribed in Section 2.3 of [\[RFC8266\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [\[RFC8264\]](https://www.w3.org/TR/webauthn-2/#biblio-rfc8264),
on `displayName`'s value prior to displaying the value to the user or
including the value as a parameter of the [authenticatorMakeCredential](https://www.w3.org/TR/webauthn-2/#authenticatormakecredential) operation.


When [clients](https://www.w3.org/TR/webauthn-2/#client), [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform), or [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) display a `displayName`'s value, they should always use UI elements to provide a clear boundary around the displayed value, and not allow overflow into other elements [\[css-overflow-3\]](https://www.w3.org/TR/webauthn-2/#biblio-css-overflow-3).

[Authenticators](https://www.w3.org/TR/webauthn-2/#authenticator) MUST accept and store a 64-byte minimum length for a `displayName` member’s value. Authenticators MAY truncate a `displayName` member’s value so that it fits within 64 bytes. See [§ 6.4.1 String Truncation](https://www.w3.org/TR/webauthn-2/#sctn-strings-truncation) about truncation and other considerations.

#### 5.4.4. Authenticator Selection Criteria (dictionary `AuthenticatorSelectionCriteria`)

[WebAuthn Relying Parties](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) may use the `AuthenticatorSelectionCriteria` dictionary to specify their requirements regarding authenticator
attributes.

```
dictionary AuthenticatorSelectionCriteria {
    DOMString                    authenticatorAttachment;
    DOMString                    residentKey;
    boolean                      requireResidentKey = false;
    DOMString                    userVerification = "preferred";
};

```

`authenticatorAttachment`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

If this member is present, eligible authenticators are filtered to only authenticators attached with the
specified [§ 5.4.5 Authenticator Attachment Enumeration (enum AuthenticatorAttachment)](https://www.w3.org/TR/webauthn-2/#enum-attachment). The value SHOULD be a member of `AuthenticatorAttachment` but [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists).

`residentKey`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

Specifies the extent to which the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) desires to create a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential). For historical reasons the naming retains the deprecated “resident” terminology. The value SHOULD be a member of `ResidentKeyRequirement` but [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists). If no value is given then the effective value is `required` if `requireResidentKey` is `true` or `discouraged` if it is `false` or absent.

See `ResidentKeyRequirement` for the description of `residentKey`'s values and semantics.

`requireResidentKey`,  of type [boolean](https://heycam.github.io/webidl/#idl-boolean), defaulting to `false`

This member is retained for backwards compatibility with WebAuthn Level 1 and, for historical reasons, its naming retains the deprecated “resident” terminology for [discoverable credentials](https://www.w3.org/TR/webauthn-2/#discoverable-credential). [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD set it to `true` if, and only if, `residentKey` is set to `required`.

`userVerification`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString), defaulting to `"preferred"`

This member describes the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)'s requirements regarding [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) for the `create()` operation. Eligible authenticators are filtered to only those capable of satisfying this
requirement. The value SHOULD be a member of `UserVerificationRequirement` but [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists).

#### 5.4.5. Authenticator Attachment Enumeration (enum `AuthenticatorAttachment`)

This enumeration’s values describe [authenticators](https://www.w3.org/TR/webauthn-2/#authenticator)' [attachment modalities](https://www.w3.org/TR/webauthn-2/#authenticator-attachment-modality). [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) use this to express a preferred [authenticator attachment modality](https://www.w3.org/TR/webauthn-2/#authenticator-attachment-modality) when calling `navigator.credentials.create()` to [create a credential](https://www.w3.org/TR/webauthn-2/#sctn-createCredential).

```
enum AuthenticatorAttachment {
    "platform",
    "cross-platform"
};

```

Note: The `AuthenticatorAttachment` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](https://www.w3.org/TR/webauthn-2/#sct-domstring-backwards-compatibility).

`platform`

This value indicates [platform attachment](https://www.w3.org/TR/webauthn-2/#platform-attachment).

`cross-platform`

This value indicates [cross-platform attachment](https://www.w3.org/TR/webauthn-2/#cross-platform-attachment).

Note: An [authenticator attachment modality](https://www.w3.org/TR/webauthn-2/#authenticator-attachment-modality) selection option is available only in the `[[Create]](origin, options,
sameOriginWithAncestors)` operation. The [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) may use it to, for example, ensure the user has a [roaming credential](https://www.w3.org/TR/webauthn-2/#roaming-credential) for
authenticating on another [client device](https://www.w3.org/TR/webauthn-2/#client-device); or to specifically register a [platform credential](https://www.w3.org/TR/webauthn-2/#platform-credential) for easier reauthentication using a
particular [client device](https://www.w3.org/TR/webauthn-2/#client-device). The `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` operation has no [authenticator attachment modality](https://www.w3.org/TR/webauthn-2/#authenticator-attachment-modality) selection option, so the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) SHOULD accept any of the user’s registered [credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential). The [client](https://www.w3.org/TR/webauthn-2/#client) and user will then use whichever is available and convenient at the time.

#### 5.4.6. Resident Key Requirement Enumeration (enum `ResidentKeyRequirement`)

```
enum ResidentKeyRequirement {
    "discouraged",
    "preferred",
    "required"
};

```

Note: The `ResidentKeyRequirement` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](https://www.w3.org/TR/webauthn-2/#sct-domstring-backwards-compatibility).

This enumeration’s values describe the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)'s requirements for [client-side discoverable credentials](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) (formerly known as [resident credentials](https://www.w3.org/TR/webauthn-2/#resident-credential) or [resident keys](https://www.w3.org/TR/webauthn-2/#resident-key)):

`discouraged`

This value indicates the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) prefers creating a [server-side credential](https://www.w3.org/TR/webauthn-2/#server-side-credential), but will accept a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential).

Note: A [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) cannot require that a created credential is a [server-side credential](https://www.w3.org/TR/webauthn-2/#server-side-credential) and the [Credential Properties Extension](https://www.w3.org/TR/webauthn-2/#credprops) may not return a value for the `rk` property. Because of this, it may be the case that it does not know if a credential is a [server-side credential](https://www.w3.org/TR/webauthn-2/#server-side-credential) or not and thus does not know whether creating a second credential with the same [user handle](https://www.w3.org/TR/webauthn-2/#user-handle) will evict the first.

`preferred`

This value indicates the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) strongly prefers creating a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential), but will accept a [server-side credential](https://www.w3.org/TR/webauthn-2/#server-side-credential). For example, user agents SHOULD guide the user through setting up [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) if needed to create a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) in this case. This takes precedence over the setting of `userVerification`.

`required`

This value indicates the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) requires a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential), and is prepared to receive an error
if a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) cannot be created.

Note: [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) can seek information on whether or not the authenticator created a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) by inspecting the [Credential Properties Extension](https://www.w3.org/TR/webauthn-2/#credprops)'s return value in light of
the value provided for `options.authenticatorSelection.residentKey`.
This is useful when values of `discouraged` or `preferred` are used for `options.authenticatorSelection.residentKey`, because in those cases it is possible for an [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) to create _either_ a [client-side discoverable credential](https://www.w3.org/TR/webauthn-2/#client-side-discoverable-credential) or a [server-side credential](https://www.w3.org/TR/webauthn-2/#server-side-credential).

#### 5.4.7. Attestation Conveyance Preference Enumeration (enum `AttestationConveyancePreference`)

[WebAuthn Relying Parties](https://www.w3.org/TR/webauthn-2/#webauthn-relying-party) may use `AttestationConveyancePreference` to specify their preference regarding [attestation conveyance](https://www.w3.org/TR/webauthn-2/#attestation-conveyance) during credential generation.

```
enum AttestationConveyancePreference {
    "none",
    "indirect",
    "direct",
    "enterprise"
};

```

Note: The `AttestationConveyancePreference` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](https://www.w3.org/TR/webauthn-2/#sct-domstring-backwards-compatibility).

`none`

This value indicates that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) is not interested in [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) [attestation](https://www.w3.org/TR/webauthn-2/#attestation). For example, in order to
potentially avoid having to obtain [user consent](https://www.w3.org/TR/webauthn-2/#user-consent) to relay identifying information to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party), or to save a
roundtrip to an [Attestation CA](https://www.w3.org/TR/webauthn-2/#attestation-ca) or [Anonymization CA](https://www.w3.org/TR/webauthn-2/#anonymization-ca).

This is the default value.

`indirect`

This value indicates that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) prefers an [attestation](https://www.w3.org/TR/webauthn-2/#attestation) conveyance yielding verifiable [attestation\\
statements](https://www.w3.org/TR/webauthn-2/#attestation-statement), but allows the client to decide how to obtain such [attestation statements](https://www.w3.org/TR/webauthn-2/#attestation-statement). The client MAY replace the
authenticator-generated [attestation statements](https://www.w3.org/TR/webauthn-2/#attestation-statement) with [attestation statements](https://www.w3.org/TR/webauthn-2/#attestation-statement) generated by an [Anonymization CA](https://www.w3.org/TR/webauthn-2/#anonymization-ca),
in order to protect the user’s privacy, or to assist [Relying Parties](https://www.w3.org/TR/webauthn-2/#relying-party) with attestation verification in a heterogeneous ecosystem.

Note: There is no guarantee that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) will obtain a verifiable [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement) in this case.
For example, in the case that the authenticator employs [self attestation](https://www.w3.org/TR/webauthn-2/#self-attestation).

`direct`

This value indicates that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) wants to receive the [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement) as generated by the [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator).

`enterprise`

This value indicates that the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party) wants to receive an [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement) that may include uniquely identifying information. This is intended for controlled deployments within an enterprise where the organization wishes to tie registrations to specific authenticators. User agents MUST NOT provide such an attestation unless the user agent or authenticator configuration permits it for the requested [RP ID](https://www.w3.org/TR/webauthn-2/#rp-id).

If permitted, the user agent SHOULD signal to the authenticator (at [invocation time](https://www.w3.org/TR/webauthn-2/#CreateCred-InvokeAuthnrMakeCred)) that enterprise attestation is requested, and convey the resulting [AAGUID](https://www.w3.org/TR/webauthn-2/#aaguid) and [attestation statement](https://www.w3.org/TR/webauthn-2/#attestation-statement), unaltered, to the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party).

### 5.5. Options for Assertion Generation (dictionary `PublicKeyCredentialRequestOptions`)

**✔** MDN

[PublicKeyCredentialRequestOptions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions "The PublicKeyCredentialRequestOptions dictionary of the Web Authentication API holds the options passed to navigator.credentials.get() in order to fetch a given PublicKeyCredential.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

The `PublicKeyCredentialRequestOptions` dictionary supplies `get()` with the data it needs to generate
an assertion. Its `challenge` member MUST be present, while its other members are OPTIONAL.

```
dictionary PublicKeyCredentialRequestOptions {
    required BufferSource                challenge;
    unsigned long                        timeout;
    USVString                            rpId;
    sequence<PublicKeyCredentialDescriptor> allowCredentials = [];
    DOMString                            userVerification = "preferred";
    AuthenticationExtensionsClientInputs extensions;
};

```

**✔** MDN

[PublicKeyCredentialRequestOptions/challenge](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/challenge "The challenge property of the PublicKeyCredentialRequestOptions dictionary is a BufferSource used as a cryptographic challenge. This is randomly generated then sent from the relying party's server. This value (among other client data) will be signed by the authenticator's private key and produce AuthenticatorAssertionResponse.signature which should be sent back to the server as part of the response.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`challenge`,  of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

This member represents a challenge that the selected [authenticator](https://www.w3.org/TR/webauthn-2/#authenticator) signs, along with other data, when producing an [authentication assertion](https://www.w3.org/TR/webauthn-2/#authentication-assertion). See the [§ 13.4.3 Cryptographic Challenges](https://www.w3.org/TR/webauthn-2/#sctn-cryptographic-challenges) security consideration.

**✔** MDN

[PublicKeyCredentialRequestOptions/timeout](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/timeout "The timeout property, of the PublicKeyCredentialRequestOptions dictionary, represents an hint, given in milliseconds, for the time the script is willing to wait for the completion of the retrieval operation.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`timeout`,  of type [unsigned long](https://heycam.github.io/webidl/#idl-unsigned-long)

This OPTIONAL member specifies a time, in milliseconds, that the caller is willing to wait for the call to complete.
The value is treated as a hint, and MAY be overridden by the [client](https://www.w3.org/TR/webauthn-2/#client).

**✔** MDN

[PublicKeyCredentialRequestOptions/rpId](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/rpId "The rpId property, of the PublicKeyCredentialRequestOptions dictionary, is an optional property which indicates the relying party's identifier as a USVString. Its value can only be a suffix of the current origin's domain. For example, if you are browsing on foo.example.com, the rpId value may be \"example.com\" but not \"bar.org\" or \"baz.example.com\".")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`rpId`,  of type [USVString](https://heycam.github.io/webidl/#idl-USVString)

This OPTIONAL member specifies the [relying party identifier](https://www.w3.org/TR/webauthn-2/#relying-party-identifier) claimed by the caller. If omitted, its value will
be the `CredentialsContainer` object’s [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain).

**✔** MDN

[PublicKeyCredentialRequestOptions/allowCredentials](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/allowCredentials "allowCredentials is an optional property of the PublicKeyCredentialRequestOptions dictionary which indicates the existing credentials acceptable for retrieval. This is an Array of credential descriptors.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`allowCredentials`,  of type sequence< [PublicKeyCredentialDescriptor](https://www.w3.org/TR/webauthn-2/#dictdef-publickeycredentialdescriptor) >, defaulting to `[]`

This OPTIONAL member contains a list of `PublicKeyCredentialDescriptor` objects representing [public key credentials](https://www.w3.org/TR/webauthn-2/#public-key-credential) acceptable to the caller, in descending order of the caller’s preference (the first item in the list is the most
preferred credential, and so on down the list).

**✔** MDN

[PublicKeyCredentialRequestOptions/userVerification](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/userVerification "userVerification is an optional property of the PublicKeyCredentialRequestOptions. This is a string which indicates how the user verification should be part of the authentication process.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`userVerification`,  of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString), defaulting to `"preferred"`

This OPTIONAL member describes the [Relying Party](https://www.w3.org/TR/webauthn-2/#relying-party)'s requirements regarding [user verification](https://www.w3.org/TR/webauthn-2/#user-verification) for the `get()` operation. The value SHOULD be a member of `UserVerificationRequirement` but [client platforms](https://www.w3.org/TR/webauthn-2/#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists). Eligible authenticators are filtered to only those capable of satisfying this requirement.

**✔** MDN

[PublicKeyCredentialCreationOptions/extensions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/extensions "extensions, an optional property of the PublicKeyCredentialCreationOptions dictionary, is an object providing the client extensions and their input values.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

[PublicKeyCredentialRequestOptions/extensions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/extensions "extensions, an optional property of the PublicKeyCredentialRequestOptions dictionary, is an object providing the client extensions and their input values.")

In all current engines.

Firefox60+Safari13+Chrome67+

* * *

Opera54+Edge79+

* * *

Edge (Legacy)NoneIENone

* * *

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`extensions`,  of type [AuthenticationExtensionsClientInputs](https://www.w3.org/TR/webauthn-2/#dictdef-authenticationextensionsclientinputs)

This OPTIONAL member contains additional parameters requesting additional processing by the client and authenticator.
For example, if transaction confirmation is sought from the user, then the prompt string might be included as an
extension.

### 5.6. Abort Operations with `AbortSignal`

Developers are encouraged to leverage the `AbortController` to manage the `[[Create]](origin, options, sameOriginWithAncestors)` and `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` operations.
See [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) section for detailed instructions.

Note: [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) section specifies that web platform APIs integrating with the `AbortController` must reject the promise immediately once the [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set.
Given the complex inheritance and parallelization structure of the `[[Create]](origin, options, sameOriginWithAncestors)` and `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` methods, the algorithms for the two APIs fulfills this
requirement by checking the [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) in three places. In the case of `[[Create]](origin, options, sameOriginWithAncestors)`, the aborted flag is checked first in [Credential Management 1 §2.5.4 Create a Credential](https://www.w3.org/TR/credential-management-1/#algorithm-create) immediately before calling `[[Create]](origin, options, sameOriginWithAncestors)`,
then in [§ 5.1.3 Create a New Credential - PublicKeyCredential’s \[\[Create\]\](origin, options, sameOriginWithAncestors) Method](https://www.w3.org/TR/webauthn-2/#sctn-createCredential) right before [authenticator sessions](https://www.w3.org/TR/webauthn-2/#authenticator-session) start, and finally
during [authenticator sessions](https://www.w3.org/TR/webauthn-2/#authenticator-session). The same goes for `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)`.

The [visibility](https://www.w3.org/TR/page-visibility/#visibility-states) and [focus](https://html.spec.whatwg.org/#focus) state of the [Window](https://fetch.spec.whatwg.org/#concept-request-window) object determines whether the `[[Create]](origin, options, sameOriginWithAncestors)` and `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` operations
should continue. When the [Window](https://fetch.spec.whatwg.org/#concept-request-window) object associated with the \[ [Document](https://dom.spec.whatwg.org/#concept-document) loses focus, `[[Create]](origin, options, sameOriginWithAncestors)` and `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` operations\
SHOULD be aborted.\
\
The WHATWG HTML WG is discussing whether to provide a hook when a browsing context gains or\
loses focuses. If a hook is provided, the above paragraph will be updated to include the hook.\
See [WHATWG HTML WG Issue #2711](https://github.com/whatwg/html/issues/2711) for more details.\
\
### 5.7. WebAuthn Extensions Inputs and Outputs\
\
The subsections below define the data types used for conveying [WebAuthn extension](https://www.w3.org/TR/webauthn-2/#webauthn-extensions) inputs and outputs.\
\
Note: [Authenticator extension outputs](https://www.w3.org/TR/webauthn-2/#authenticator-extension-output) are conveyed as a part of [Authenticator data](https://www.w3.org/TR/webauthn-2/#authenticator-data) (see [Table 1](https://www.w3.org/TR/webauthn-2/#table-authData)).\
\
Note: The types defined below — `AuthenticationExtensionsClientInputs` and `AuthenticationExtensionsClientOutputs` — are applicable to both [registration extensions](https://www.w3.org/TR/webauthn-2/#registration-extension) and [authentication extensions](https://www.w3.org/TR/webauthn-2/#authentication-extension). The "Authentication..." portion of their names should be regarded as meaning "WebAuthentication..."\
\