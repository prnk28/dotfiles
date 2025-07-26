---
tags:
  - "#web-authentication"
  - "#security"
  - "#web-api"
  - "#credential-management"
  - "#passwordless-authentication"
---
# PublicKeyCredential

This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.

\* Some parts of this feature may have varying levels of support.

*   [Learn more](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility)
*   [See full compatibility](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#browser_compatibility)
*   [Report feedback](https://survey.alchemer.com/s3/7634825/MDN-baseline-feedback?page=%2Fen-US%2Fdocs%2FWeb%2FAPI%2FPublicKeyCredential&level=high)

**Secure context:** This feature is available only in [secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) (HTTPS), in some or all [supporting browsers](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#browser_compatibility).

The **`PublicKeyCredential`** interface provides information about a public key / private key pair, which is a credential for logging in to a service using an un-phishable and data-breach resistant asymmetric key pair instead of a password. It inherits from [`Credential`](https://developer.mozilla.org/en-US/docs/Web/API/Credential), and is part of the [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) extension to the [Credential Management API](https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API).

**Note:** This API is restricted to top-level contexts. Use from within an [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) element will not have any effect.

### [Instance properties](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#instance_properties)

[`PublicKeyCredential.authenticatorAttachment`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/authenticatorAttachment) Read only

A string that indicates the mechanism by which the WebAuthn implementation is attached to the authenticator at the time the associated [`navigator.credentials.create()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create "navigator.credentials.create()") or [`navigator.credentials.get()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get "navigator.credentials.get()") call completes.

[`PublicKeyCredential.id`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/id) Read only

Inherited from [`Credential`](https://developer.mozilla.org/en-US/docs/Web/API/Credential) and overridden to be the [base64url encoding](https://developer.mozilla.org/en-US/docs/Glossary/Base64) of [`PublicKeyCredential.rawId`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/rawId).

[`PublicKeyCredential.rawId`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/rawId) Read only

An [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) that holds the globally unique identifier for this `PublicKeyCredential`. This identifier can be used to look up credentials for future calls to [`navigator.credentials.get()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get "navigator.credentials.get()").

[`PublicKeyCredential.response`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/response) Read only

An instance of an [`AuthenticatorResponse`](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse) object. It is either of type [`AuthenticatorAttestationResponse`](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse) if the `PublicKeyCredential` was the results of a [`navigator.credentials.create()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create "navigator.credentials.create()") call, or of type [`AuthenticatorAssertionResponse`](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse) if the `PublicKeyCredential` was the result of a [`navigator.credentials.get()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get "navigator.credentials.get()") call.

[`PublicKeyCredential.type` Read only](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#publickeycredential.type)

Inherited from [`Credential`](https://developer.mozilla.org/en-US/docs/Web/API/Credential). Always set to `public-key` for `PublicKeyCredential` instances.

[Static methods](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#static_methods)
-----------------------------------------------------------------------------------------------------

[`PublicKeyCredential.getClientCapabilities()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/getClientCapabilities_static "PublicKeyCredential.getClientCapabilities()")

Returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves with an object that can be used to check whether or not particular WebAuthn capabilities and [extensions](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/WebAuthn_extensions) are supported.

[`PublicKeyCredential.isConditionalMediationAvailable()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/isConditionalMediationAvailable_static "PublicKeyCredential.isConditionalMediationAvailable()")

Returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which resolves to `true` if conditional mediation is available.

[`PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/isUserVerifyingPlatformAuthenticatorAvailable_static "PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()")

Returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which resolves to `true` if an authenticator bound to the platform is capable of _verifying_ the user.

[`PublicKeyCredential.parseCreationOptionsFromJSON()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/parseCreationOptionsFromJSON_static "PublicKeyCredential.parseCreationOptionsFromJSON()")

Convenience method for deserializing server-sent credential registration data when [registering a user with credentials](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API#creating_a_key_pair_and_registering_a_user).

[`PublicKeyCredential.parseRequestOptionsFromJSON()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/parseRequestOptionsFromJSON_static "PublicKeyCredential.parseRequestOptionsFromJSON()")

Convenience method for deserializing server-sent credential request data when [authenticating a (registered) user](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API#authenticating_a_user).

[`PublicKeyCredential.signalAllAcceptedCredentials()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalAllAcceptedCredentials_static "PublicKeyCredential.signalAllAcceptedCredentials()") Experimental

Signals to the authenticator all of the valid [credential IDs](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions#id) that the [relying party](https://en.wikipedia.org/wiki/Relying_party) server still holds for a particular user.

[`PublicKeyCredential.signalCurrentUserDetails()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalCurrentUserDetails_static "PublicKeyCredential.signalCurrentUserDetails()") Experimental

Signals to the authenticator that a particular user has updated their user name and/or display name.

[`PublicKeyCredential.signalUnknownCredential()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/signalUnknownCredential_static "PublicKeyCredential.signalUnknownCredential()") Experimental

Signals to the authenticator that a [credential ID](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions#id) was not recognized by the [relying party](https://en.wikipedia.org/wiki/Relying_party) server, for example because it was deleted.

[Instance methods](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#instance_methods)
---------------------------------------------------------------------------------------------------------

[`PublicKeyCredential.getClientExtensionResults()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/getClientExtensionResults)

If any extensions were requested, this method will return the results of processing those extensions.

[`PublicKeyCredential.toJSON()`](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/toJSON)

Convenience method for creating a JSON string representation of a `PublicKeyCredential` for sending to the server when [registering a user with credentials](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API#creating_a_key_pair_and_registering_a_user) and [authenticating a registered user](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API#authenticating_a_user).

[Examples](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#examples)
-----------------------------------------------------------------------------------------

### [Creating a new instance of PublicKeyCredential](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#creating_a_new_instance_of_publickeycredential)

Here, we use [`navigator.credentials.create()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create "navigator.credentials.create()") to generate a new credential.

jsCopy to Clipboard

\`\`\`
const createCredentialOptions = {
  publicKey: {
    challenge: new Uint8Array([
      21, 31, 105 /* 29 more random bytes generated by the server */,
    ]),
    rp: {
      name: "Example CORP",
      id: "login.example.com",
    },
    user: {
      id: new Uint8Array(16),
      name: "canand@example.com",
      displayName: "Carina Anand",
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7,
      },
    ],
  },
};

navigator.credentials
  .create(createCredentialOptions)
  .then((newCredentialInfo) => {
    const response = newCredentialInfo.response;
    const clientExtensionsResults =
      newCredentialInfo.getClientExtensionResults();
  })
  .catch((err) => {
    console.error(err);
  });
\`\`\`

### [Getting an existing instance of PublicKeyCredential](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#getting_an_existing_instance_of_publickeycredential)

Here, we fetch an existing credential from an authenticator, using [`navigator.credentials.get()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get "navigator.credentials.get()").

jsCopy to Clipboard

\`\`\`
const requestCredentialOptions = {
  publicKey: {
    challenge: new Uint8Array([
      /* bytes sent from the server */
    ]),
  },
};

navigator.credentials
  .get(requestCredentialOptions)
  .then((credentialInfoAssertion) => {
    // send assertion response back to the server
    // to proceed with the control of the credential
  })
  .catch((err) => {
    console.error(err);
  });
\`\`\`

[Specifications](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#specifications)
-----------------------------------------------------------------------------------------------------

| Specification |
| --- |
| [Web Authentication: An API for accessing Public Key Credentials - Level 3 \# iface-pkcredential](https://w3c.github.io/webauthn/#iface-pkcredential) |

[Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#browser_compatibility)
-------------------------------------------------------------------------------------------------------------------

[See also](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential#see_also)
-----------------------------------------------------------------------------------------

*   The parent interface [`Credential`](https://developer.mozilla.org/en-US/docs/Web/API/Credential)