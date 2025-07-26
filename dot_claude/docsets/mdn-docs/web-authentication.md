---
tags:
  - "#web-authentication"
  - "#security"
  - "#cryptography"
  - "#authentication"
  - "#credential-management"
  - "#privacy-security"
  - "#identity-verification"
---

<!--toc:start-->
- [1. Introduction[](#sctn-intro)](#1-introductionsctn-intro)
  - [1.1. Specification Roadmap[](#sctn-spec-roadmap)](#11-specification-roadmapsctn-spec-roadmap)
  - [1.2. Use Cases[](#sctn-use-cases)](#12-use-casessctn-use-cases)
    - [1.2.1. Registration[](#sctn-usecase-registration)](#121-registrationsctn-usecase-registration)
    - [1.2.2. Authentication[](#sctn-usecase-authentication)](#122-authenticationsctn-usecase-authentication)
    - [1.2.3. New Device Registration[](#sctn-usecase-new-device-registration)](#123-new-device-registrationsctn-usecase-new-device-registration)
    - [1.2.4. Other Use Cases and Configurations[](#sctn-other-configurations)](#124-other-use-cases-and-configurationssctn-other-configurations)
  - [1.3. Sample API Usage Scenarios[](#sctn-sample-scenarios)](#13-sample-api-usage-scenariossctn-sample-scenarios)
    - [1.3.1. Registration[](#sctn-sample-registration)](#131-registrationsctn-sample-registration)
    - [1.3.2. Registration Specifically with User-Verifying Platform Authenticator[](#sctn-sample-registration-with-platform-authenticator)](#132-registration-specifically-with-user-verifying-platform-authenticatorsctn-sample-registration-with-platform-authenticator)
    - [1.3.3. Authentication[](#sctn-sample-authentication)](#133-authenticationsctn-sample-authentication)
    - [1.3.4. Aborting Authentication Operations[](#sctn-sample-aborting)](#134-aborting-authentication-operationssctn-sample-aborting)
    - [1.3.5. Decommissioning[](#sctn-sample-decommissioning)](#135-decommissioningsctn-sample-decommissioning)
  - [1.4. Platform-Specific Implementation Guidance[](#sctn-platform-impl-guidance)](#14-platform-specific-implementation-guidancesctn-platform-impl-guidance)
- [2. Conformance[](#sctn-conformance)](#2-conformancesctn-conformance)
  - [2.1. User Agents[](#sctn-conforming-user-agents)](#21-user-agentssctn-conforming-user-agents)
    - [2.1.1. Enumerations as DOMString types[](#sct-domstring-backwards-compatibility)](#211-enumerations-as-domstring-typessct-domstring-backwards-compatibility)
  - [2.2. Authenticators[](#sctn-conforming-authenticators)](#22-authenticatorssctn-conforming-authenticators)
    - [2.2.1. Backwards Compatibility with FIDO U2F[](#sctn-conforming-authenticators-u2f)](#221-backwards-compatibility-with-fido-u2fsctn-conforming-authenticators-u2f)
  - [2.3. WebAuthn Relying Parties[](#sctn-conforming-relying-parties)](#23-webauthn-relying-partiessctn-conforming-relying-parties)
  - [2.4. All Conformance Classes[](#sctn-conforming-all-classes)](#24-all-conformance-classessctn-conforming-all-classes)
- [3. Dependencies[](#sctn-dependencies)](#3-dependenciessctn-dependencies)
- [4. Terminology[](#sctn-terminology)](#4-terminologysctn-terminology)
  - [5.1. `PublicKeyCredential` Interface[](#iface-pkcredential)](#51-publickeycredential-interfaceiface-pkcredential)
    - [5.1.1. `CredentialCreationOptions` Dictionary Extension[](#sctn-credentialcreationoptions-extension)](#511-credentialcreationoptions-dictionary-extensionsctn-credentialcreationoptions-extension)
    - [5.1.2. `CredentialRequestOptions` Dictionary Extension[](#sctn-credentialrequestoptions-extension)](#512-credentialrequestoptions-dictionary-extensionsctn-credentialrequestoptions-extension)
    - [5.1.3. Create a New Credential - PublicKeyCredential’s `[[Create]](origin, options, sameOriginWithAncestors)` Method[](#sctn-createCredential)](#513-create-a-new-credential-publickeycredentials-createorigin-options-sameoriginwithancestors-methodsctn-createcredential)
    - [5.1.4. Use an Existing Credential to Make an Assertion - PublicKeyCredential’s `[[Get]](options)` Method[](#sctn-getAssertion)](#514-use-an-existing-credential-to-make-an-assertion-publickeycredentials-getoptions-methodsctn-getassertion)
      - [5.1.4.1. PublicKeyCredential’s `` `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` `` Method[](#sctn-discover-from-external-source)](#5141-publickeycredentials-discoverfromexternalsourceorigin-options-sameoriginwithancestors-methodsctn-discover-from-external-source)
    - [5.1.5. Store an Existing Credential - PublicKeyCredential’s `[[Store]](credential, sameOriginWithAncestors)` Method[](#sctn-storeCredential)](#515-store-an-existing-credential-publickeycredentials-storecredential-sameoriginwithancestors-methodsctn-storecredential)
    - [5.1.6. Preventing Silent Access to an Existing Credential - PublicKeyCredential’s `[[preventSilentAccess]](credential, sameOriginWithAncestors)` Method[](#sctn-preventSilentAccessCredential)](#516-preventing-silent-access-to-an-existing-credential-publickeycredentials-preventsilentaccesscredential-sameoriginwithancestors-methodsctn-preventsilentaccesscredential)
    - [5.1.7. Availability of [User-Verifying Platform Authenticator](#user-verifying-platform-authenticator) - PublicKeyCredential’s `isUserVerifyingPlatformAuthenticatorAvailable()` Method[](#sctn-isUserVerifyingPlatformAuthenticatorAvailable)](#517-availability-of-user-verifying-platform-authenticatoruser-verifying-platform-authenticator-publickeycredentials-isuserverifyingplatformauthenticatoravailable-methodsctn-isuserverifyingplatformauthenticatoravailable)
  - [5.2. Authenticator Responses (interface `AuthenticatorResponse`)[](#iface-authenticatorresponse)](#52-authenticator-responses-interface-authenticatorresponseiface-authenticatorresponse)
    - [5.2.1. Information About Public Key Credential (interface `AuthenticatorAttestationResponse`)[](#iface-authenticatorattestationresponse)](#521-information-about-public-key-credential-interface-authenticatorattestationresponseiface-authenticatorattestationresponse)
      - [5.2.1.1. Easily accessing credential data[](#sctn-public-key-easy)](#5211-easily-accessing-credential-datasctn-public-key-easy)
    - [5.2.2. Web Authentication Assertion (interface `AuthenticatorAssertionResponse`)[](#iface-authenticatorassertionresponse)](#522-web-authentication-assertion-interface-authenticatorassertionresponseiface-authenticatorassertionresponse)
  - [5.3. Parameters for Credential Generation (dictionary `PublicKeyCredentialParameters`)[](#dictionary-credential-params)](#53-parameters-for-credential-generation-dictionary-publickeycredentialparametersdictionary-credential-params)
  - [5.4. Options for Credential Creation (dictionary `PublicKeyCredentialCreationOptions`)[](#dictionary-makecredentialoptions)](#54-options-for-credential-creation-dictionary-publickeycredentialcreationoptionsdictionary-makecredentialoptions)
    - [5.4.1. Public Key Entity Description (dictionary `PublicKeyCredentialEntity`)[](#dictionary-pkcredentialentity)](#541-public-key-entity-description-dictionary-publickeycredentialentitydictionary-pkcredentialentity)
    - [5.4.2. Relying Party Parameters for Credential Generation (dictionary `PublicKeyCredentialRpEntity`)[](#dictionary-rp-credential-params)](#542-relying-party-parameters-for-credential-generation-dictionary-publickeycredentialrpentitydictionary-rp-credential-params)
    - [5.4.3. User Account Parameters for Credential Generation (dictionary `PublicKeyCredentialUserEntity`)[](#dictionary-user-credential-params)](#543-user-account-parameters-for-credential-generation-dictionary-publickeycredentialuserentitydictionary-user-credential-params)
    - [5.4.4. Authenticator Selection Criteria (dictionary `AuthenticatorSelectionCriteria`)[](#dictionary-authenticatorSelection)](#544-authenticator-selection-criteria-dictionary-authenticatorselectioncriteriadictionary-authenticatorselection)
    - [5.4.5. Authenticator Attachment Enumeration (enum `AuthenticatorAttachment`)[](#enum-attachment)](#545-authenticator-attachment-enumeration-enum-authenticatorattachmentenum-attachment)
    - [5.4.6. Resident Key Requirement Enumeration (enum `ResidentKeyRequirement`)[](#enum-residentKeyRequirement)](#546-resident-key-requirement-enumeration-enum-residentkeyrequirementenum-residentkeyrequirement)
    - [5.4.7. Attestation Conveyance Preference Enumeration (enum `AttestationConveyancePreference`)[](#enum-attestation-convey)](#547-attestation-conveyance-preference-enumeration-enum-attestationconveyancepreferenceenum-attestation-convey)
  - [5.5. Options for Assertion Generation (dictionary `PublicKeyCredentialRequestOptions`)[](#dictionary-assertion-options)](#55-options-for-assertion-generation-dictionary-publickeycredentialrequestoptionsdictionary-assertion-options)
  - [5.6. Abort Operations with `AbortSignal`[](#sctn-abortoperation)](#56-abort-operations-with-abortsignalsctn-abortoperation)
  - [5.7. WebAuthn Extensions Inputs and Outputs[](#sctn-extensions-inputs-outputs)](#57-webauthn-extensions-inputs-and-outputssctn-extensions-inputs-outputs)
    - [5.7.1. Authentication Extensions Client Inputs (dictionary `[AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs)`)[](#iface-authentication-extensions-client-inputs)](#571-authentication-extensions-client-inputs-dictionary-authenticationextensionsclientinputsdictdef-authenticationextensionsclientinputsiface-authentication-extensions-client-inputs)
    - [5.7.2. Authentication Extensions Client Outputs (dictionary `[AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs)`)[](#iface-authentication-extensions-client-outputs)](#572-authentication-extensions-client-outputs-dictionary-authenticationextensionsclientoutputsdictdef-authenticationextensionsclientoutputsiface-authentication-extensions-client-outputs)
    - [5.7.3. Authentication Extensions Authenticator Inputs (CDDL type `AuthenticationExtensionsAuthenticatorInputs`)[](#iface-authentication-extensions-authenticator-inputs)](#573-authentication-extensions-authenticator-inputs-cddl-type-authenticationextensionsauthenticatorinputsiface-authentication-extensions-authenticator-inputs)
    - [5.7.4. Authentication Extensions Authenticator Outputs (CDDL type `AuthenticationExtensionsAuthenticatorOutputs`)[](#iface-authentication-extensions-authenticator-outputs)](#574-authentication-extensions-authenticator-outputs-cddl-type-authenticationextensionsauthenticatoroutputsiface-authentication-extensions-authenticator-outputs)
  - [5.8. Supporting Data Structures[](#sctn-supporting-data-structures)](#58-supporting-data-structuressctn-supporting-data-structures)
    - [5.8.1. Client Data Used in [WebAuthn Signatures](#webauthn-signature) (dictionary `CollectedClientData`)[](#dictionary-client-data)](#581-client-data-used-in-webauthn-signatureswebauthn-signature-dictionary-collectedclientdatadictionary-client-data)
      - [5.8.1.1. Serialization[](#clientdatajson-serialization)](#5811-serializationclientdatajson-serialization)
      - [5.8.1.2. Limited Verification Algorithm[](#clientdatajson-verification)](#5812-limited-verification-algorithmclientdatajson-verification)
      - [5.8.1.3. Future development[](#clientdatajson-development)](#5813-future-developmentclientdatajson-development)
    - [5.8.2. Credential Type Enumeration (enum `PublicKeyCredentialType`)[](#enum-credentialType)](#582-credential-type-enumeration-enum-publickeycredentialtypeenum-credentialtype)
    - [5.8.3. Credential Descriptor (dictionary `PublicKeyCredentialDescriptor`)[](#dictionary-credential-descriptor)](#583-credential-descriptor-dictionary-publickeycredentialdescriptordictionary-credential-descriptor)
    - [5.8.4. Authenticator Transport Enumeration (enum `AuthenticatorTransport`)[](#enum-transport)](#584-authenticator-transport-enumeration-enum-authenticatortransportenum-transport)
    - [5.8.5. Cryptographic Algorithm Identifier (typedef `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)`)[](#sctn-alg-identifier)](#585-cryptographic-algorithm-identifier-typedef-cosealgorithmidentifiertypedefdef-cosealgorithmidentifiersctn-alg-identifier)
    - [5.8.6. User Verification Requirement Enumeration (enum `UserVerificationRequirement`)[](#enum-userVerificationRequirement)](#586-user-verification-requirement-enumeration-enum-userverificationrequirementenum-userverificationrequirement)
  - [5.9. Permissions Policy integration[](#sctn-permissions-policy)](#59-permissions-policy-integrationsctn-permissions-policy)
  - [5.10. Using Web Authentication within `iframe` elements[](#sctn-iframe-guidance)](#510-using-web-authentication-within-iframe-elementssctn-iframe-guidance)
- [6. WebAuthn Authenticator Model[](#sctn-authenticator-model)](#6-webauthn-authenticator-modelsctn-authenticator-model)
  - [6.1. Authenticator Data[](#sctn-authenticator-data)](#61-authenticator-datasctn-authenticator-data)
    - [6.1.1. Signature Counter Considerations[](#sctn-sign-counter)](#611-signature-counter-considerationssctn-sign-counter)
    - [6.1.2. FIDO U2F Signature Format Compatibility[](#sctn-fido-u2f-sig-format-compat)](#612-fido-u2f-signature-format-compatibilitysctn-fido-u2f-sig-format-compat)
  - [6.2. Authenticator Taxonomy[](#sctn-authenticator-taxonomy)](#62-authenticator-taxonomysctn-authenticator-taxonomy)
    - [6.2.1. Authenticator Attachment Modality[](#sctn-authenticator-attachment-modality)](#621-authenticator-attachment-modalitysctn-authenticator-attachment-modality)
    - [6.2.2. Credential Storage Modality[](#sctn-credential-storage-modality)](#622-credential-storage-modalitysctn-credential-storage-modality)
    - [6.2.3. Authentication Factor Capability[](#sctn-authentication-factor-capability)](#623-authentication-factor-capabilitysctn-authentication-factor-capability)
  - [6.3. Authenticator Operations[](#sctn-authenticator-ops)](#63-authenticator-operationssctn-authenticator-ops)
    - [6.3.1. Lookup Credential Source by Credential ID Algorithm[](#sctn-op-lookup-credsource-by-credid)](#631-lookup-credential-source-by-credential-id-algorithmsctn-op-lookup-credsource-by-credid)
    - [6.3.2. The authenticatorMakeCredential Operation[](#sctn-op-make-cred)](#632-the-authenticatormakecredential-operationsctn-op-make-cred)
    - [6.3.3. The authenticatorGetAssertion Operation[](#sctn-op-get-assertion)](#633-the-authenticatorgetassertion-operationsctn-op-get-assertion)
    - [6.3.4. The authenticatorCancel Operation[](#sctn-op-cancel)](#634-the-authenticatorcancel-operationsctn-op-cancel)
  - [6.4. String Handling[](#sctn-strings)](#64-string-handlingsctn-strings)
    - [6.4.1. String Truncation[](#sctn-strings-truncation)](#641-string-truncationsctn-strings-truncation)
    - [6.4.2. Language and Direction Encoding[](#sctn-strings-langdir)](#642-language-and-direction-encodingsctn-strings-langdir)
  - [6.5. Attestation[](#sctn-attestation)](#65-attestationsctn-attestation)
    - [6.5.1. Attested Credential Data[](#sctn-attested-credential-data)](#651-attested-credential-datasctn-attested-credential-data)
      - [6.5.1.1. Examples of `credentialPublicKey` Values Encoded in COSE_Key Format[](#sctn-encoded-credPubKey-examples)](#6511-examples-of-credentialpublickey-values-encoded-in-cosekey-formatsctn-encoded-credpubkey-examples)
    - [6.5.2. Attestation Statement Formats[](#sctn-attestation-formats)](#652-attestation-statement-formatssctn-attestation-formats)
    - [6.5.3. Attestation Types[](#sctn-attestation-types)](#653-attestation-typessctn-attestation-types)
    - [6.5.4. Generating an Attestation Object[](#sctn-generating-an-attestation-object)](#654-generating-an-attestation-objectsctn-generating-an-attestation-object)
    - [6.5.5. Signature Formats for Packed Attestation, FIDO U2F Attestation, and Assertion Signatures[](#sctn-signature-attestation-types)](#655-signature-formats-for-packed-attestation-fido-u2f-attestation-and-assertion-signaturessctn-signature-attestation-types)
- [7. [WebAuthn Relying Party](#webauthn-relying-party) Operations[](#sctn-rp-operations)](#7-webauthn-relying-partywebauthn-relying-party-operationssctn-rp-operations)
  - [7.1. Registering a New Credential[](#sctn-registering-a-new-credential)](#71-registering-a-new-credentialsctn-registering-a-new-credential)
  - [7.2. Verifying an Authentication Assertion[](#sctn-verifying-assertion)](#72-verifying-an-authentication-assertionsctn-verifying-assertion)
- [8. Defined Attestation Statement Formats[](#sctn-defined-attestation-formats)](#8-defined-attestation-statement-formatssctn-defined-attestation-formats)
  - [8.1. Attestation Statement Format Identifiers[](#sctn-attstn-fmt-ids)](#81-attestation-statement-format-identifierssctn-attstn-fmt-ids)
  - [8.2. Packed Attestation Statement Format[](#sctn-packed-attestation)](#82-packed-attestation-statement-formatsctn-packed-attestation)
    - [8.2.1. Packed Attestation Statement Certificate Requirements[](#sctn-packed-attestation-cert-requirements)](#821-packed-attestation-statement-certificate-requirementssctn-packed-attestation-cert-requirements)
  - [8.3. TPM Attestation Statement Format[](#sctn-tpm-attestation)](#83-tpm-attestation-statement-formatsctn-tpm-attestation)
    - [8.3.1. TPM Attestation Statement Certificate Requirements[](#sctn-tpm-cert-requirements)](#831-tpm-attestation-statement-certificate-requirementssctn-tpm-cert-requirements)
  - [8.4. Android Key Attestation Statement Format[](#sctn-android-key-attestation)](#84-android-key-attestation-statement-formatsctn-android-key-attestation)
    - [8.4.1. Android Key Attestation Statement Certificate Requirements[](#sctn-key-attstn-cert-requirements)](#841-android-key-attestation-statement-certificate-requirementssctn-key-attstn-cert-requirements)
  - [8.5. Android SafetyNet Attestation Statement Format[](#sctn-android-safetynet-attestation)](#85-android-safetynet-attestation-statement-formatsctn-android-safetynet-attestation)
  - [8.6. FIDO U2F Attestation Statement Format[](#sctn-fido-u2f-attestation)](#86-fido-u2f-attestation-statement-formatsctn-fido-u2f-attestation)
  - [8.7. None Attestation Statement Format[](#sctn-none-attestation)](#87-none-attestation-statement-formatsctn-none-attestation)
  - [8.8. Apple Anonymous Attestation Statement Format[](#sctn-apple-anonymous-attestation)](#88-apple-anonymous-attestation-statement-formatsctn-apple-anonymous-attestation)
- [9. WebAuthn Extensions[](#sctn-extensions)](#9-webauthn-extensionssctn-extensions)
  - [9.1. Extension Identifiers[](#sctn-extension-id)](#91-extension-identifierssctn-extension-id)
  - [9.2. Defining Extensions[](#sctn-extension-specification)](#92-defining-extensionssctn-extension-specification)
  - [9.3. Extending Request Parameters[](#sctn-extension-request-parameters)](#93-extending-request-parameterssctn-extension-request-parameters)
  - [9.4. Client Extension Processing[](#sctn-client-extension-processing)](#94-client-extension-processingsctn-client-extension-processing)
  - [9.5. Authenticator Extension Processing[](#sctn-authenticator-extension-processing)](#95-authenticator-extension-processingsctn-authenticator-extension-processing)
- [10. Defined Extensions[](#sctn-defined-extensions)](#10-defined-extensionssctn-defined-extensions)
  - [10.1. FIDO AppID Extension (appid)[](#sctn-appid-extension)](#101-fido-appid-extension-appidsctn-appid-extension)
  - [10.2. FIDO AppID Exclusion Extension (appidExclude)[](#sctn-appid-exclude-extension)](#102-fido-appid-exclusion-extension-appidexcludesctn-appid-exclude-extension)
  - [10.3. User Verification Method Extension (uvm)[](#sctn-uvm-extension)](#103-user-verification-method-extension-uvmsctn-uvm-extension)
  - [10.4. Credential Properties Extension (credProps)[](#sctn-authenticator-credential-properties-extension)](#104-credential-properties-extension-credpropssctn-authenticator-credential-properties-extension)
  - [10.5. Large blob storage extension (largeBlob)[](#sctn-large-blob-extension)](#105-large-blob-storage-extension-largeblobsctn-large-blob-extension)
- [11. User Agent Automation[](#sctn-automation)](#11-user-agent-automationsctn-automation)
  - [11.1. WebAuthn WebDriver Extension Capability[](#sctn-automation-webdriver-capability)](#111-webauthn-webdriver-extension-capabilitysctn-automation-webdriver-capability)
    - [11.1.1. Authenticator Extension Capabilities[](#sctn-authenticator-extension-capabilities)](#1111-authenticator-extension-capabilitiessctn-authenticator-extension-capabilities)
  - [11.2. Virtual Authenticators[](#sctn-automation-virtual-authenticators)](#112-virtual-authenticatorssctn-automation-virtual-authenticators)
  - [11.3. Add Virtual Authenticator[](#sctn-automation-add-virtual-authenticator)](#113-add-virtual-authenticatorsctn-automation-add-virtual-authenticator)
  - [11.4. Remove Virtual Authenticator[](#sctn-automation-remove-virtual-authenticator)](#114-remove-virtual-authenticatorsctn-automation-remove-virtual-authenticator)
  - [11.5. Add Credential[](#sctn-automation-add-credential)](#115-add-credentialsctn-automation-add-credential)
  - [11.6. Get Credentials[](#sctn-automation-get-credentials)](#116-get-credentialssctn-automation-get-credentials)
  - [11.7. Remove Credential[](#sctn-automation-remove-credential)](#117-remove-credentialsctn-automation-remove-credential)
  - [11.8. Remove All Credentials[](#sctn-automation-remove-all-credentials)](#118-remove-all-credentialssctn-automation-remove-all-credentials)
  - [11.9. Set User Verified[](#sctn-automation-set-user-verified)](#119-set-user-verifiedsctn-automation-set-user-verified)
- [12. IANA Considerations[](#sctn-IANA)](#12-iana-considerationssctn-iana)
  - [12.1. WebAuthn Attestation Statement Format Identifier Registrations Updates[](#sctn-att-fmt-reg-update)](#121-webauthn-attestation-statement-format-identifier-registrations-updatessctn-att-fmt-reg-update)
  - [12.2. WebAuthn Attestation Statement Format Identifier Registrations[](#sctn-att-fmt-reg)](#122-webauthn-attestation-statement-format-identifier-registrationssctn-att-fmt-reg)
  - [12.3. WebAuthn Extension Identifier Registrations Updates[](#sctn-extensions-reg-update)](#123-webauthn-extension-identifier-registrations-updatessctn-extensions-reg-update)
  - [12.4. WebAuthn Extension Identifier Registrations[](#sctn-extensions-reg)](#124-webauthn-extension-identifier-registrationssctn-extensions-reg)
- [13. Security Considerations[](#sctn-security-considerations)](#13-security-considerationssctn-security-considerations)
  - [13.1. Credential ID Unsigned[](#sctn-credentialIdSecurity)](#131-credential-id-unsignedsctn-credentialidsecurity)
  - [13.2. Physical Proximity between Client and Authenticator[](#sctn-client-authenticator-proximity)](#132-physical-proximity-between-client-and-authenticatorsctn-client-authenticator-proximity)
  - [13.3. Security considerations for [authenticators](#authenticator)[](#sctn-security-considerations-authenticator)](#133-security-considerations-for-authenticatorsauthenticatorsctn-security-considerations-authenticator)
    - [13.3.1. Attestation Certificate Hierarchy[](#sctn-cert-hierarchy)](#1331-attestation-certificate-hierarchysctn-cert-hierarchy)
    - [13.3.2. Attestation Certificate and Attestation Certificate CA Compromise[](#sctn-ca-compromise)](#1332-attestation-certificate-and-attestation-certificate-ca-compromisesctn-ca-compromise)
  - [13.4. Security considerations for [Relying Parties](#relying-party)[](#sctn-security-considerations-rp)](#134-security-considerations-for-relying-partiesrelying-partysctn-security-considerations-rp)
    - [13.4.1. Security Benefits for WebAuthn Relying Parties[](#sctn-rp-benefits)](#1341-security-benefits-for-webauthn-relying-partiessctn-rp-benefits)
    - [13.4.2. Visibility Considerations for Embedded Usage[](#sctn-seccons-visibility)](#1342-visibility-considerations-for-embedded-usagesctn-seccons-visibility)
    - [13.4.3. Cryptographic Challenges[](#sctn-cryptographic-challenges)](#1343-cryptographic-challengessctn-cryptographic-challenges)
    - [13.4.4. Attestation Limitations[](#sctn-attestation-limitations)](#1344-attestation-limitationssctn-attestation-limitations)
    - [13.4.5. Revoked Attestation Certificates[](#sctn-revoked-attestation-certificates)](#1345-revoked-attestation-certificatessctn-revoked-attestation-certificates)
    - [13.4.6. Credential Loss and Key Mobility[](#sctn-credential-loss-key-mobility)](#1346-credential-loss-and-key-mobilitysctn-credential-loss-key-mobility)
    - [13.4.7. Unprotected account detection[](#sctn-unprotected-account-detection)](#1347-unprotected-account-detectionsctn-unprotected-account-detection)
- [14. Privacy Considerations[](#sctn-privacy-considerations)](#14-privacy-considerationssctn-privacy-considerations)
  - [14.1. De-anonymization Prevention Measures[](#sctn-privacy-attacks)](#141-de-anonymization-prevention-measuressctn-privacy-attacks)
  - [14.2. Anonymous, Scoped, Non-correlatable [Public Key Credentials](#public-key-credential)[](#sctn-non-correlatable-credentials)](#142-anonymous-scoped-non-correlatable-public-key-credentialspublic-key-credentialsctn-non-correlatable-credentials)
  - [14.3. Authenticator-local [Biometric Recognition](#biometric-recognition)[](#sctn-biometric-privacy)](#143-authenticator-local-biometric-recognitionbiometric-recognitionsctn-biometric-privacy)
  - [14.4. Privacy considerations for [authenticators](#authenticator)[](#sctn-privacy-considerations-authenticator)](#144-privacy-considerations-for-authenticatorsauthenticatorsctn-privacy-considerations-authenticator)
    - [14.4.1. Attestation Privacy[](#sctn-attestation-privacy)](#1441-attestation-privacysctn-attestation-privacy)
    - [14.4.2. Privacy of personally identifying information Stored in Authenticators[](#sctn-pii-privacy)](#1442-privacy-of-personally-identifying-information-stored-in-authenticatorssctn-pii-privacy)
  - [14.5. Privacy considerations for [clients](#client)[](#sctn-privacy-considerations-client)](#145-privacy-considerations-for-clientsclientsctn-privacy-considerations-client)
    - [14.5.1. Registration Ceremony Privacy[](#sctn-make-credential-privacy)](#1451-registration-ceremony-privacysctn-make-credential-privacy)
    - [14.5.2. Authentication Ceremony Privacy[](#sctn-assertion-privacy)](#1452-authentication-ceremony-privacysctn-assertion-privacy)
    - [14.5.3. Privacy Between Operating System Accounts[](#sctn-os-account-privacy)](#1453-privacy-between-operating-system-accountssctn-os-account-privacy)
  - [14.6. Privacy considerations for [Relying Parties](#relying-party)[](#sctn-privacy-considerations-rp)](#146-privacy-considerations-for-relying-partiesrelying-partysctn-privacy-considerations-rp)
    - [14.6.1. User Handle Contents[](#sctn-user-handle-privacy)](#1461-user-handle-contentssctn-user-handle-privacy)
    - [14.6.2. Username Enumeration[](#sctn-username-enumeration)](#1462-username-enumerationsctn-username-enumeration)
    - [14.6.3. Privacy leak via credential IDs[](#sctn-credential-id-privacy-leak)](#1463-privacy-leak-via-credential-idssctn-credential-id-privacy-leak)
- [15. Accessibility Considerations[](#sctn-accessiblility-considerations)](#15-accessibility-considerationssctn-accessiblility-considerations)
- [16. Acknowledgements[](#sctn-acknowledgements)](#16-acknowledgementssctn-acknowledgements)
<!--toc:end-->

## 1. Introduction[](#sctn-intro)

_This section is not normative._

This specification defines an API enabling the creation and use of strong, attested, [scoped](#scope), public key-based credentials by [web applications](#web-application), for the purpose of strongly authenticating users. A [public key credential](#public-key-credential) is created and stored by a _[WebAuthn Authenticator](#webauthn-authenticator)_ at the behest of a _[WebAuthn Relying Party](#webauthn-relying-party)_, subject to _[user consent](#user-consent)_. Subsequently, the [public key credential](#public-key-credential) can only be accessed by [origins](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) belonging to that [Relying Party](#relying-party). This scoping is enforced jointly by _[conforming User Agents](#conforming-user-agent)_ and _[authenticators](#authenticator)_. Additionally, privacy across [Relying Parties](#relying-party) is maintained; [Relying Parties](#relying-party) are not able to detect any properties, or even the existence, of credentials [scoped](#scope) to other [Relying Parties](#relying-party).

[Relying Parties](#relying-party) employ the [Web Authentication API](#web-authentication-api) during two distinct, but related, [ceremonies](#ceremony) involving a user. The first is [Registration](#registration), where a [public key credential](#public-key-credential) is created on an [authenticator](#authenticator), and [scoped](#scope) to a [Relying Party](#relying-party) with the present user’s account (the account might already exist or might be created at this time). The second is [Authentication](#authentication), where the [Relying Party](#relying-party) is presented with an _[Authentication Assertion](#authentication-assertion)_ proving the presence and [consent](#user-consent) of the user who registered the [public key credential](#public-key-credential). Functionally, the [Web Authentication API](#web-authentication-api) comprises a `[PublicKeyCredential](#publickeycredential)` which extends the Credential Management API [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1), and infrastructure which allows those credentials to be used with `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` and `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`. The former is used during [Registration](#registration), and the latter during [Authentication](#authentication).

Broadly, compliant [authenticators](#authenticator) protect [public key credentials](#public-key-credential), and interact with user agents to implement the [Web Authentication API](#web-authentication-api). Implementing compliant authenticators is possible in software executing (a) on a general-purpose computing device, (b) on an on-device Secure Execution Environment, Trusted Platform Module (TPM), or a Secure Element (SE), or (c) off device. Authenticators being implemented on device are called [platform authenticators](#platform-authenticators). Authenticators being implemented off device ([roaming authenticators](#roaming-authenticators)) can be accessed over a transport such as Universal Serial Bus (USB), Bluetooth Low Energy (BLE), or Near Field Communications (NFC).

### 1.1. Specification Roadmap[](#sctn-spec-roadmap)

While many W3C specifications are directed primarily to user agent developers and also to web application developers (i.e., "Web authors"), the nature of Web Authentication requires that this specification be correctly used by multiple audiences, as described below.

**All audiences** ought to begin with [§ 1.2 Use Cases](#sctn-use-cases), [§ 1.3 Sample API Usage Scenarios](#sctn-sample-scenarios), and [§ 4 Terminology](#sctn-terminology), and should also refer to [[WebAuthnAPIGuide]](#biblio-webauthnapiguide) for an overall tutorial. Beyond that, the intended audiences for this document are the following main groups:

- [Relying Party](#relying-party) web application developers, especially those responsible for [Relying Party](#relying-party) [web application](#web-application) login flows, account recovery flows, user account database content, etc.
    
- Web framework developers
    
    - The above two audiences should in particular refer to [§ 7 WebAuthn Relying Party Operations](#sctn-rp-operations). The introduction to [§ 5 Web Authentication API](#sctn-api) may be helpful, though readers should realize that the [§ 5 Web Authentication API](#sctn-api) section is targeted specifically at user agent developers, not web application developers. Additionally, if they intend to verify [authenticator](#authenticator) [attestations](#attestation), then [§ 6.5 Attestation](#sctn-attestation) and [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats) will also be relevant. [§ 9 WebAuthn Extensions](#sctn-extensions), and [§ 10 Defined Extensions](#sctn-defined-extensions) will be of interest if they wish to make use of extensions. Finally, they should read [§ 13.4 Security considerations for Relying Parties](#sctn-security-considerations-rp) and [§ 14.6 Privacy considerations for Relying Parties](#sctn-privacy-considerations-rp) and consider which challenges apply to their application and users.
        
- User agent developers
    
- OS platform developers, responsible for OS platform API design and implementation in regards to platform-specific [authenticator](#authenticator) APIs, platform [WebAuthn Client](#webauthn-client) instantiation, etc.
    
    - The above two audiences should read [§ 5 Web Authentication API](#sctn-api) very carefully, along with [§ 9 WebAuthn Extensions](#sctn-extensions) if they intend to support extensions. They should also carefully read [§ 14.5 Privacy considerations for clients](#sctn-privacy-considerations-client).
        
- [Authenticator](#authenticator) developers. These readers will want to pay particular attention to [§ 6 WebAuthn Authenticator Model](#sctn-authenticator-model), [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats), [§ 9 WebAuthn Extensions](#sctn-extensions), and [§ 10 Defined Extensions](#sctn-defined-extensions). They should also carefully read [§ 13.3 Security considerations for authenticators](#sctn-security-considerations-authenticator) and [§ 14.4 Privacy considerations for authenticators](#sctn-privacy-considerations-authenticator).
    

Note: Along with the [Web Authentication API](#sctn-api) itself, this specification defines a request-response _cryptographic protocol_—the WebAuthn/FIDO2 protocol[](#webauthn-fido2-protocol)—between a [WebAuthn Relying Party](#webauthn-relying-party) server and an [authenticator](#authenticator), where the [Relying Party](#relying-party)'s request consists of a [challenge](#sctn-cryptographic-challenges) and other input data supplied by the [Relying Party](#relying-party) and sent to the [authenticator](#authenticator). The request is conveyed via the combination of HTTPS, the [Relying Party](#relying-party) [web application](#web-application), the [WebAuthn API](#sctn-api), and the platform-specific communications channel between the user agent and the [authenticator](#authenticator). The [authenticator](#authenticator) replies with a digitally signed [authenticator data](#authenticator-data) message and other output data, which is conveyed back to the [Relying Party](#relying-party) server via the same path in reverse. Protocol details vary according to whether an [authentication](#authentication) or [registration](#registration) operation is invoked by the [Relying Party](#relying-party). See also [Figure 1](#fig-registration) and [Figure 2](#fig-authentication).

**It is important for Web Authentication deployments' end-to-end security** that the role of each component—the [Relying Party](#relying-party) server, the [client](#client), and the [authenticator](#authenticator)— as well as [§ 13 Security Considerations](#sctn-security-considerations) and [§ 14 Privacy Considerations](#sctn-privacy-considerations), are understood _by all audiences_.

### 1.2. Use Cases[](#sctn-use-cases)

The below use case scenarios illustrate use of two very different types of [authenticators](#authenticator), as well as outline further scenarios. Additional scenarios, including sample code, are given later in [§ 1.3 Sample API Usage Scenarios](#sctn-sample-scenarios).

#### 1.2.1. Registration[](#sctn-usecase-registration)

- On a phone:
    
    - User navigates to example.com in a browser and signs in to an existing account using whatever method they have been using (possibly a legacy method such as a password), or creates a new account.
        
    - The phone prompts, "Do you want to register this device with example.com?"
        
    - User agrees.
        
    - The phone prompts the user for a previously configured [authorization gesture](#authorization-gesture) (PIN, biometric, etc.); the user provides this.
        
    - Website shows message, "Registration complete."
        

#### 1.2.2. Authentication[](#sctn-usecase-authentication)

- On a laptop or desktop:
    
    - User pairs their phone with the laptop or desktop via Bluetooth.
        
    - User navigates to example.com in a browser and initiates signing in.
        
    - User gets a message from the browser, "Please complete this action on your phone."
        
- Next, on their phone:
    
    - User sees a discrete prompt or notification, "Sign in to example.com."
        
    - User selects this prompt / notification.
        
    - User is shown a list of their example.com identities, e.g., "Sign in as Mohamed / Sign in as 张三".
        
    - User picks an identity, is prompted for an [authorization gesture](#authorization-gesture) (PIN, biometric, etc.) and provides this.
        
- Now, back on the laptop:
    
    - Web page shows that the selected user is signed in, and navigates to the signed-in page.
        

#### 1.2.3. New Device Registration[](#sctn-usecase-new-device-registration)

This use case scenario illustrates how a [Relying Party](#relying-party) can leverage a combination of a [roaming authenticator](#roaming-authenticators) (e.g., a USB security key fob) and a [platform authenticator](#platform-authenticators) (e.g., a built-in fingerprint sensor) such that the user has:

- a "primary" [roaming authenticator](#roaming-authenticators) that they use to authenticate on new-to-them [client devices](#client-device) (e.g., laptops, desktops) or on such [client devices](#client-device) that lack a [platform authenticator](#platform-authenticators), and
    
- a low-friction means to strongly re-authenticate on [client devices](#client-device) having [platform authenticators](#platform-authenticators).
    

Note: This approach of registering multiple [authenticators](#authenticator) for an account is also useful in account recovery use cases.

- First, on a desktop computer (lacking a [platform authenticator](#platform-authenticators)):
    
    - User navigates to `example.com` in a browser and signs in to an existing account using whatever method they have been using (possibly a legacy method such as a password), or creates a new account.
        
    - User navigates to account security settings and selects "Register security key".
        
    - Website prompts the user to plug in a USB security key fob; the user does.
        
    - The USB security key blinks to indicate the user should press the button on it; the user does.
        
    - Website shows message, "Registration complete."
        
    
    Note: Since this computer lacks a [platform authenticator](#platform-authenticators), the website may require the user to present their USB security key from time to time or each time the user interacts with the website. This is at the website’s discretion.
    
- Later, on their laptop (which features a [platform authenticator](#platform-authenticators)):
    
    - User navigates to example.com in a browser and initiates signing in.
        
    - Website prompts the user to plug in their USB security key.
        
    - User plugs in the previously registered USB security key and presses the button.
        
    - Website shows that the user is signed in, and navigates to the signed-in page.
        
    - Website prompts, "Do you want to register this computer with example.com?"
        
    - User agrees.
        
    - Laptop prompts the user for a previously configured [authorization gesture](#authorization-gesture) (PIN, biometric, etc.); the user provides this.
        
    - Website shows message, "Registration complete."
        
    - User signs out.
        
- Later, again on their laptop:
    
    - User navigates to example.com in a browser and initiates signing in.
        
    - Website shows message, "Please follow your computer’s prompts to complete sign in."
        
    - Laptop prompts the user for an [authorization gesture](#authorization-gesture) (PIN, biometric, etc.); the user provides this.
        
    - Website shows that the user is signed in, and navigates to the signed-in page.
        

#### 1.2.4. Other Use Cases and Configurations[](#sctn-other-configurations)

A variety of additional use cases and configurations are also possible, including (but not limited to):

- A user navigates to example.com on their laptop, is guided through a flow to create and register a credential on their phone.
    
- A user obtains a discrete, [roaming authenticator](#roaming-authenticators), such as a "fob" with USB or USB+NFC/BLE connectivity options, loads example.com in their browser on a laptop or phone, and is guided through a flow to create and register a credential on the fob.
    
- A [Relying Party](#relying-party) prompts the user for their [authorization gesture](#authorization-gesture) in order to authorize a single transaction, such as a payment or other financial transaction.
    

### 1.3. Sample API Usage Scenarios[](#sctn-sample-scenarios)

_This section is not normative._

In this section, we walk through some events in the lifecycle of a [public key credential](#public-key-credential), along with the corresponding sample code for using this API. Note that this is an example flow and does not limit the scope of how the API can be used.

As was the case in earlier sections, this flow focuses on a use case involving a [first-factor roaming authenticator](#first-factor-roaming-authenticator) with its own display. One example of such an authenticator would be a smart phone. Other authenticator types are also supported by this API, subject to implementation by the [client platform](#client-platform). For instance, this flow also works without modification for the case of an authenticator that is embedded in the [client device](#client-device). The flow also works for the case of an authenticator without its own display (similar to a smart card) subject to specific implementation considerations. Specifically, the [client platform](#client-platform) needs to display any prompts that would otherwise be shown by the authenticator, and the authenticator needs to allow the [client platform](#client-platform) to enumerate all the authenticator’s credentials so that the client can have information to show appropriate prompts.

#### 1.3.1. Registration[](#sctn-sample-registration)

This is the first-time flow, in which a new credential is created and registered with the server. In this flow, the [WebAuthn Relying Party](#webauthn-relying-party) does not have a preference for [platform authenticator](#platform-authenticators) or [roaming authenticators](#roaming-authenticators).

1. The user visits example.com, which serves up a script. At this point, the user may already be logged in using a legacy username and password, or additional authenticator, or other means acceptable to the [Relying Party](#relying-party). Or the user may be in the process of creating a new account.
    
2. The [Relying Party](#relying-party) script runs the code snippet below.
    
3. The [client platform](#client-platform) searches for and locates the authenticator.
    
4. The [client](#client) connects to the authenticator, performing any pairing actions if necessary.
    
5. The authenticator shows appropriate UI for the user to provide a biometric or other [authorization gesture](#authorization-gesture).
    
6. The authenticator returns a response to the [client](#client), which in turn returns a response to the [Relying Party](#relying-party) script. If the user declined to select an authenticator or provide authorization, an appropriate error is returned.
    
7. If a new credential was created,
    
    - The [Relying Party](#relying-party) script sends the newly generated [credential public key](#credential-public-key) to the server, along with additional information such as attestation regarding the provenance and characteristics of the authenticator.
        
    - The server stores the [credential public key](#credential-public-key) in its database and associates it with the user as well as with the characteristics of authentication indicated by attestation, also storing a friendly name for later use.
        
    - The script may store data such as the [credential ID](#credential-id) in local storage, to improve future UX by narrowing the choice of credential for the user.
        

The sample code for generating and registering a new key follows:

[](#example-85f4c521)if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */ }

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
  pubKeyCredParams: [
    {
      type: "public-key",
      alg: -7 // "ES256" as registered in the IANA COSE Algorithms registry
    },
    {
      type: "public-key",
      alg: -257 // Value registered by this specification for "RS256"
    }
  ],

  authenticatorSelection: {
    // Try to use UV if possible. This is also the default.
    userVerification: "preferred"
  },

  timeout: 360000,  // 6 minutes
  excludeCredentials: [
    // Don’t re-register any authenticator that has one of these credentials
    {"id": Uint8Array.from(window.atob("ufJWp8YGlibm1Kd9XQBWN1WAw2jy5In2Xhon9HAqcXE="), c=>c.charCodeAt(0)), "type": "public-key"},
    {"id": Uint8Array.from(window.atob("E/e1dhZc++mIsz4f9hb6NifAzJpF1V4mEtRlIPBiWdY="), c=>c.charCodeAt(0)), "type": "public-key"}
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

#### 1.3.2. Registration Specifically with User-Verifying Platform Authenticator[](#sctn-sample-registration-with-platform-authenticator)

This is an example flow for when the [WebAuthn Relying Party](#webauthn-relying-party) is specifically interested in creating a [public key credential](#public-key-credential) with a [user-verifying platform authenticator](#user-verifying-platform-authenticator).

1. The user visits example.com and clicks on the login button, which redirects the user to login.example.com.
    
2. The user enters a username and password to log in. After successful login, the user is redirected back to example.com.
    
3. The [Relying Party](#relying-party) script runs the code snippet below.
    
    1. The user agent checks if a [user-verifying platform authenticator](#user-verifying-platform-authenticator) is available. If not, terminate this flow.
        
    2. The [Relying Party](#relying-party) asks the user if they want to create a credential with it. If not, terminate this flow.
        
    3. The user agent and/or operating system shows appropriate UI and guides the user in creating a credential using one of the available platform authenticators.
        
    4. Upon successful credential creation, the [Relying Party](#relying-party) script conveys the new credential to the server.
        

[](#example-47a0ff57)if (!window.PublicKeyCredential) { /* Client not capable of the API. Handle error. */ }

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

#### 1.3.3. Authentication[](#sctn-sample-authentication)

This is the flow when a user with an already registered credential visits a website and wants to authenticate using the credential.

1. The user visits example.com, which serves up a script.
    
2. The script asks the [client](#client) for an Authentication Assertion, providing as much information as possible to narrow the choice of acceptable credentials for the user. This can be obtained from the data that was stored locally after registration, or by other means such as prompting the user for a username.
    
3. The [Relying Party](#relying-party) script runs one of the code snippets below.
    
4. The [client platform](#client-platform) searches for and locates the authenticator.
    
5. The [client](#client) connects to the authenticator, performing any pairing actions if necessary.
    
6. The authenticator presents the user with a notification that their attention is needed. On opening the notification, the user is shown a friendly selection menu of acceptable credentials using the account information provided when creating the credentials, along with some information on the [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) that is requesting these keys.
    
7. The authenticator obtains a biometric or other [authorization gesture](#authorization-gesture) from the user.
    
8. The authenticator returns a response to the [client](#client), which in turn returns a response to the [Relying Party](#relying-party) script. If the user declined to select a credential or provide an authorization, an appropriate error is returned.
    
9. If an assertion was successfully generated and returned,
    
    - The script sends the assertion to the server.
        
    - The server examines the assertion, extracts the [credential ID](#credential-id), looks up the registered credential public key in its database, and verifies the [assertion signature](#assertion-signature). If valid, it looks up the identity associated with the assertion’s [credential ID](#credential-id); that identity is now authenticated. If the [credential ID](#credential-id) is not recognized by the server (e.g., it has been deregistered due to inactivity) then the authentication has failed; each [Relying Party](#relying-party) will handle this in its own way.
        
    - The server now does whatever it would otherwise do upon successful authentication -- return a success page, set authentication cookies, etc.
        

If the [Relying Party](#relying-party) script does not have any hints available (e.g., from locally stored data) to help it narrow the list of credentials, then the sample code for performing such an authentication might look like this:

[](#example-b2bff2f5)if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */ }

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

On the other hand, if the [Relying Party](#relying-party) script has some hints to help it narrow the list of credentials, then the sample code for performing such an authentication might look like the following. Note that this sample also demonstrates how to use the [Credential Properties Extension](#credprops).

[](#example-9b4290b6)if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */ }

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

#### 1.3.4. Aborting Authentication Operations[](#sctn-sample-aborting)

The below example shows how a developer may use the AbortSignal parameter to abort a credential registration operation. A similar procedure applies to an authentication operation.

[](#example-4c7ad12d)const authAbortController = new AbortController();
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

#### 1.3.5. Decommissioning[](#sctn-sample-decommissioning)

The following are possible situations in which decommissioning a credential might be desired. Note that all of these are handled on the server side and do not need support from the API specified here.

- Possibility #1 -- user reports the credential as lost.
    
    - User goes to server.example.net, authenticates and follows a link to report a lost/stolen [authenticator](#authenticator).
        
    - Server returns a page showing the list of registered credentials with friendly names as configured during registration.
        
    - User selects a credential and the server deletes it from its database.
        
    - In the future, the [Relying Party](#relying-party) script does not specify this credential in any list of acceptable credentials, and assertions signed by this credential are rejected.
        
- Possibility #2 -- server deregisters the credential due to inactivity.
    
    - Server deletes credential from its database during maintenance activity.
        
    - In the future, the [Relying Party](#relying-party) script does not specify this credential in any list of acceptable credentials, and assertions signed by this credential are rejected.
        
- Possibility #3 -- user deletes the credential from the [authenticator](#authenticator).
    
    - User employs a [authenticator](#authenticator)-specific method (e.g., device settings UI) to delete a credential from their [authenticator](#authenticator).
        
    - From this point on, this credential will not appear in any selection prompts, and no assertions can be generated with it.
        
    - Sometime later, the server deregisters this credential due to inactivity.
        

### 1.4. Platform-Specific Implementation Guidance[](#sctn-platform-impl-guidance)

This specification defines how to use Web Authentication in the general case. When using Web Authentication in connection with specific platform support (e.g. apps), it is recommended to see platform-specific documentation and guides for additional guidance and limitations.

## 2. Conformance[](#sctn-conformance)

This specification defines three conformance classes. Each of these classes is specified so that conforming members of the class are secure against non-conforming or hostile members of the other classes.

### 2.1. User Agents[](#sctn-conforming-user-agents)

A User Agent MUST behave as described by [§ 5 Web Authentication API](#sctn-api) in order to be considered conformant. [Conforming User Agents](#conforming-user-agent) MAY implement algorithms given in this specification in any way desired, so long as the end result is indistinguishable from the result that would be obtained by the specification’s algorithms.

A conforming User Agent MUST also be a conforming implementation of the IDL fragments of this specification, as described in the “Web IDL” specification. [[WebIDL]](#biblio-webidl)

#### 2.1.1. Enumerations as DOMString types[](#sct-domstring-backwards-compatibility)

Enumeration types are not referenced by other parts of the Web IDL because that would preclude other values from being used without updating this specification and its implementations. It is important for backwards compatibility that [client platforms](#client-platform) and [Relying Parties](#relying-party) handle unknown values. Enumerations for this specification exist here for documentation and as a registry. Where the enumerations are represented elsewhere, they are typed as `[DOMString](https://heycam.github.io/webidl/#idl-DOMString)`s, for example in `[transports](#dom-publickeycredentialdescriptor-transports)`.

### 2.2. Authenticators[](#sctn-conforming-authenticators)

A [WebAuthn Authenticator](#webauthn-authenticator) MUST provide the operations defined by [§ 6 WebAuthn Authenticator Model](#sctn-authenticator-model), and those operations MUST behave as described there. This is a set of functional and security requirements for an authenticator to be usable by a [Conforming User Agent](#conforming-user-agent).

As described in [§ 1.2 Use Cases](#sctn-use-cases), an authenticator may be implemented in the operating system underlying the User Agent, or in external hardware, or a combination of both.

#### 2.2.1. Backwards Compatibility with FIDO U2F[](#sctn-conforming-authenticators-u2f)

[Authenticators](#authenticator) that only support the [§ 8.6 FIDO U2F Attestation Statement Format](#sctn-fido-u2f-attestation) have no mechanism to store a [user handle](#user-handle), so the returned `[userHandle](#dom-authenticatorassertionresponse-userhandle)` will always be null.

### 2.3. WebAuthn Relying Parties[](#sctn-conforming-relying-parties)

A [WebAuthn Relying Party](#webauthn-relying-party) MUST behave as described in [§ 7 WebAuthn Relying Party Operations](#sctn-rp-operations) to obtain all the security benefits offered by this specification. See [§ 13.4.1 Security Benefits for WebAuthn Relying Parties](#sctn-rp-benefits) for further discussion of this.

### 2.4. All Conformance Classes[](#sctn-conforming-all-classes)

All [CBOR](#cbor) encoding performed by the members of the above conformance classes MUST be done using the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form). All decoders of the above conformance classes SHOULD reject CBOR that is not validly encoded in the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form) and SHOULD reject messages with duplicate map keys.

## 3. Dependencies[](#sctn-dependencies)

This specification relies on several other underlying specifications, listed below and in [Terms defined by reference](#index-defined-elsewhere).

Base64url encoding

The term Base64url Encoding refers to the base64 encoding using the URL- and filename-safe character set defined in Section 5 of [[RFC4648]](#biblio-rfc4648), with all trailing '=' characters omitted (as permitted by Section 3.2) and without the inclusion of any line breaks, whitespace, or other additional characters.

CBOR

A number of structures in this specification, including attestation statements and extensions, are encoded using the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form) of the Compact Binary Object Representation (CBOR) [[RFC8949]](#biblio-rfc8949), as defined in [[FIDO-CTAP]](#biblio-fido-ctap).

CDDL

This specification describes the syntax of all [CBOR](#cbor)-encoded data using the CBOR Data Definition Language (CDDL) [[RFC8610]](#biblio-rfc8610).

COSE

CBOR Object Signing and Encryption (COSE) [[RFC8152]](#biblio-rfc8152). The IANA COSE Algorithms registry [[IANA-COSE-ALGS-REG]](#biblio-iana-cose-algs-reg) established by this specification is also used.

Credential Management

The API described in this document is an extension of the `[Credential](https://w3c.github.io/webappsec-credential-management/#credential)` concept defined in [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1).

DOM

`[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` and the DOMException values used in this specification are defined in [[DOM4]](#biblio-dom4).

ECMAScript

[%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor) is defined in [[ECMAScript]](#biblio-ecmascript).

HTML

The concepts of [browsing context](https://html.spec.whatwg.org/multipage/browsers.html#browsing-context), [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin), [opaque origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque), [tuple origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-tuple), [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object), and [is a registrable domain suffix of or is equal to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) are defined in [[HTML]](#biblio-html).

URL

The concept of [same site](https://url.spec.whatwg.org/#host-same-site) is defined in [[URL]](#biblio-url).

Web IDL

Many of the interface definitions and all of the IDL in this specification depend on [[WebIDL]](#biblio-webidl). This updated version of the Web IDL standard adds support for `[Promise](https://heycam.github.io/webidl/#idl-promise)`s, which are now the preferred mechanism for asynchronous interaction in all new web APIs.

FIDO AppID

The algorithms for [determining the FacetID of a calling application](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-the-facetid-of-a-calling-application) and [determining if a caller’s FacetID is authorized for an AppID](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-if-a-caller-s-facetid-is-authorized-for-an-appid) (used only in the [AppID extension](#appid)) are defined by [[FIDO-APPID]](#biblio-fido-appid).

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [[RFC2119]](#biblio-rfc2119).

## 4. Terminology[](#sctn-terminology)

Attestation

Generally, _attestation_ is a statement serving to bear witness, confirm, or authenticate. In the WebAuthn context, [attestation](#attestation) is employed to _attest_ to the _provenance_ of an [authenticator](#authenticator) and the data it emits; including, for example: [credential IDs](#credential-id), [credential key pairs](#credential-key-pair), signature counters, etc. An [attestation statement](#attestation-statement) is conveyed in an [attestation object](#attestation-object) during [registration](#registration). See also [§ 6.5 Attestation](#sctn-attestation) and [Figure 6](#fig-attStructs). Whether or how the [client](#client) conveys the [attestation statement](#attestation-statement) and [AAGUID](#aaguid) portions of the [attestation object](#attestation-object) to the [Relying Party](#relying-party) is described by [attestation conveyance](#attestation-conveyance).

Attestation Certificate

A X.509 Certificate for the attestation key pair used by an [authenticator](#authenticator) to attest to its manufacture and capabilities. At [registration](#registration) time, the [authenticator](#authenticator) uses the attestation private key to sign the [Relying Party](#relying-party)-specific [credential public key](#credential-public-key) (and additional data) that it generates and returns via the [authenticatorMakeCredential](#authenticatormakecredential) operation. [Relying Parties](#relying-party) use the attestation public key conveyed in the [attestation certificate](#attestation-certificate) to verify the [attestation signature](#attestation-signature). Note that in the case of [self attestation](#self-attestation), the [authenticator](#authenticator) has no distinct [attestation key pair](#attestation-key-pair) nor [attestation certificate](#attestation-certificate), see [self attestation](#self-attestation) for details.

Authentication

Authentication Ceremony

The [ceremony](#ceremony) where a user, and the user’s [client](#client) (containing at least one [authenticator](#authenticator)) work in concert to cryptographically prove to a [Relying Party](#relying-party) that the user controls the [credential private key](#credential-private-key) of a previously-registered [public key credential](#public-key-credential) (see [Registration](#registration)). Note that this includes a [test of user presence](#test-of-user-presence) or [user verification](#user-verification).

The WebAuthn [authentication ceremony](#authentication-ceremony) is defined in [§ 7.2 Verifying an Authentication Assertion](#sctn-verifying-assertion), and is initiated by the [Relying Party](#relying-party) calling `` `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` `` with a `[publicKey](#dom-credentialrequestoptions-publickey)` argument. See [§ 5 Web Authentication API](#sctn-api) for an introductory overview and [§ 1.3.3 Authentication](#sctn-sample-authentication) for implementation examples.

Authentication Assertion

Assertion

The cryptographically signed `[AuthenticatorAssertionResponse](#authenticatorassertionresponse)` object returned by an [authenticator](#authenticator) as the result of an [authenticatorGetAssertion](#authenticatorgetassertion) operation.

This corresponds to the [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1) specification’s single-use [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential).

Authenticator

WebAuthn Authenticator

A cryptographic entity, existing in hardware or software, that can [register](#registration) a user with a given [Relying Party](#relying-party) and later [assert possession](#authentication-assertion) of the registered [public key credential](#public-key-credential), and optionally [verify the user](#user-verification), when requested by the [Relying Party](#relying-party). [Authenticators](#authenticator) can report information regarding their [type](#authenticator-type) and security characteristics via [attestation](#attestation) during [registration](#registration).

A [WebAuthn Authenticator](#webauthn-authenticator) could be a [roaming authenticator](#roaming-authenticators), a dedicated hardware subsystem integrated into the [client device](#client-device), or a software component of the [client](#client) or [client device](#client-device).

In general, an [authenticator](#authenticator) is assumed to have only one user. If multiple natural persons share access to an [authenticator](#authenticator), they are considered to represent the same user in the context of that [authenticator](#authenticator). If an [authenticator](#authenticator) implementation supports multiple users in separated compartments, then each compartment is considered a separate [authenticator](#authenticator) with a single user with no access to other users' [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential).

Authorization Gesture

An [authorization gesture](#authorization-gesture) is a physical interaction performed by a user with an authenticator as part of a [ceremony](#ceremony), such as [registration](#registration) or [authentication](#authentication). By making such an [authorization gesture](#authorization-gesture), a user [provides consent](#user-consent) for (i.e., _authorizes_) a [ceremony](#ceremony) to proceed. This MAY involve [user verification](#user-verification) if the employed [authenticator](#authenticator) is capable, or it MAY involve a simple [test of user presence](#test-of-user-presence).

Biometric Recognition

The automated recognition of individuals based on their biological and behavioral characteristics [[ISOBiometricVocabulary]](#biblio-isobiometricvocabulary).

Biometric Authenticator

Any [authenticator](#authenticator) that implements [biometric recognition](#biometric-recognition).

Bound credential

A [public key credential source](#public-key-credential-source) or [public key credential](#public-key-credential) is said to be [bound](#bound-credential) to its [managing authenticator](#public-key-credential-source-managing-authenticator). This means that only the [managing authenticator](#public-key-credential-source-managing-authenticator) can generate [assertions](#assertion) for the [public key credential sources](#public-key-credential-source) [bound](#bound-credential) to it.

Ceremony

The concept of a [ceremony](#ceremony) [[Ceremony]](#biblio-ceremony) is an extension of the concept of a network protocol, with human nodes alongside computer nodes and with communication links that include user interface(s), human-to-human communication, and transfers of physical objects that carry data. What is out-of-band to a protocol is in-band to a ceremony. In this specification, [Registration](#registration) and [Authentication](#authentication) are ceremonies, and an [authorization gesture](#authorization-gesture) is often a component of those [ceremonies](#ceremony).

Client

WebAuthn Client

Also referred to herein as simply a [client](#client). See also [Conforming User Agent](#conforming-user-agent). A [WebAuthn Client](#webauthn-client) is an intermediary entity typically implemented in the user agent (in whole, or in part). Conceptually, it underlies the [Web Authentication API](#web-authentication-api) and embodies the implementation of the `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` and `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` [internal methods](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots). It is responsible for both marshalling the inputs for the underlying [authenticator operations](#authenticator-operations), and for returning the results of the latter operations to the [Web Authentication API](#web-authentication-api)'s callers.

The [WebAuthn Client](#webauthn-client) runs on, and is distinct from, a [WebAuthn Client Device](#webauthn-client-device).

Client Device

WebAuthn Client Device

The hardware device on which the [WebAuthn Client](#webauthn-client) runs, for example a smartphone, a laptop computer or a desktop computer, and the operating system running on that hardware.

The distinctions between a [WebAuthn Client device](#webauthn-client-device) and a [client](#client) are:

- a single [client device](#client-device) MAY support running multiple [clients](#client), i.e., browser implementations, which all have access to the same [authenticators](#authenticator) available on that [client device](#client-device), and
    
- [platform authenticators](#platform-authenticators) are bound to a [client device](#client-device) rather than a [WebAuthn Client](#webauthn-client).
    

A [client device](#client-device) and a [client](#client) together constitute a [client platform](#client-platform).

Client Platform

A [client device](#client-device) and a [client](#client) together make up a [client platform](#client-platform). A single hardware device MAY be part of multiple distinct [client platforms](#client-platform) at different times by running different operating systems and/or [clients](#client).

Client-Side

This refers in general to the combination of the user’s [client platform](#client-platform), [authenticators](#authenticator), and everything gluing it all together.

Client-side discoverable Public Key Credential Source

Client-side discoverable Credential

Discoverable Credential

[DEPRECATED] Resident Credential

[DEPRECATED] Resident Key

Note: Historically, [client-side discoverable credentials](#client-side-discoverable-credential) have been known as [resident credentials](#resident-credential) or [resident keys](#resident-key). Due to the phrases `ResidentKey` and `residentKey` being widely used in both the [WebAuthn API](#web-authentication-api) and also in the [Authenticator Model](#authenticator-model) (e.g., in dictionary member names, algorithm variable names, and operation parameters) the usage of `resident` within their names has not been changed for backwards compatibility purposes. Also, the term [resident key](#resident-key) is defined here as equivalent to a [client-side discoverable credential](#client-side-discoverable-credential).

A [Client-side discoverable Public Key Credential Source](#client-side-discoverable-public-key-credential-source), or [Discoverable Credential](#discoverable-credential) for short, is a [public key credential source](#public-key-credential-source) that is **_discoverable_** and usable in [authentication ceremonies](#authentication-ceremony) where the [Relying Party](#relying-party) does not provide any [credential ID](#credential-id)s, i.e., the [Relying Party](#relying-party) invokes `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` with an **_[empty](https://infra.spec.whatwg.org/#list-is-empty)_** `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument. This means that the [Relying Party](#relying-party) does not necessarily need to first identify the user.

As a consequence, a [discoverable credential capable](#discoverable-credential-capable) [authenticator](#authenticator) can generate an [assertion signature](#assertion-signature) for a [discoverable credential](#discoverable-credential) given only an [RP ID](#rp-id), which in turn necessitates that the [public key credential source](#public-key-credential-source) is stored in the [authenticator](#authenticator) or [client platform](#client-platform). This is in contrast to a [Server-side Public Key Credential Source](#server-side-public-key-credential-source), which requires that the [authenticator](#authenticator) is given both the [RP ID](#rp-id) and the [credential ID](#credential-id) but does not require [client-side](#client-side) storage of the [public key credential source](#public-key-credential-source).

See also: [client-side credential storage modality](#client-side-credential-storage-modality) and [non-discoverable credential](#non-discoverable-credential).

Note: [Client-side discoverable credentials](#client-side-discoverable-credential) are also usable in [authentication ceremonies](#authentication-ceremony) where [credential ID](#credential-id)s are given, i.e., when calling `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` with a non-[empty](https://infra.spec.whatwg.org/#list-is-empty) `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument.

Conforming User Agent

A user agent implementing, in cooperation with the underlying [client device](#client-device), the [Web Authentication API](#web-authentication-api) and algorithms given in this specification, and handling communication between [authenticators](#authenticator) and [Relying Parties](#relying-party).

Credential ID

A probabilistically-unique [byte sequence](https://infra.spec.whatwg.org/#byte-sequence) identifying a [public key credential source](#public-key-credential-source) and its [authentication assertions](#authentication-assertion).

Credential IDs are generated by [authenticators](#authenticator) in two forms:

1. At least 16 bytes that include at least 100 bits of entropy, or
    
2. The [public key credential source](#public-key-credential-source), without its [Credential ID](#credential-id) or [mutable items](#public-key-credential-source-mutable-item), encrypted so only its [managing authenticator](#public-key-credential-source-managing-authenticator) can decrypt it. This form allows the [authenticator](#authenticator) to be nearly stateless, by having the [Relying Party](#relying-party) store any necessary state.
    
    Note: [[FIDO-UAF-AUTHNR-CMDS]](#biblio-fido-uaf-authnr-cmds) includes guidance on encryption techniques under "Security Guidelines".
    

[Relying Parties](#relying-party) do not need to distinguish these two [Credential ID](#credential-id) forms.

Credential Key Pair

Credential Private Key

Credential Public Key

User Public Key

A [credential key pair](#credential-key-pair) is a pair of asymmetric cryptographic keys generated by an [authenticator](#authenticator) and [scoped](#scope) to a specific [WebAuthn Relying Party](#webauthn-relying-party). It is the central part of a [public key credential](#public-key-credential).

A [credential public key](#credential-public-key) is the public key portion of a [credential key pair](#credential-key-pair). The [credential public key](#credential-public-key) is returned to the [Relying Party](#relying-party) during a [registration ceremony](#registration-ceremony).

A [credential private key](#credential-private-key) is the private key portion of a [credential key pair](#credential-key-pair). The [credential private key](#credential-private-key) is bound to a particular [authenticator](#authenticator) - its [managing authenticator](#public-key-credential-source-managing-authenticator) - and is expected to never be exposed to any other party, not even to the owner of the [authenticator](#authenticator).

Note that in the case of [self attestation](#self-attestation), the [credential key pair](#credential-key-pair) is also used as the [attestation key pair](#attestation-key-pair), see [self attestation](#self-attestation) for details.

Note: The [credential public key](#credential-public-key) is referred to as the [user public key](#user-public-key) in FIDO UAF [[UAFProtocol]](#biblio-uafprotocol), and in FIDO U2F [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats) and some parts of this specification that relate to it.

Credential Properties

A [credential property](#credential-properties) is some characteristic property of a [public key credential source](#public-key-credential-source), such as whether it is a [client-side discoverable credential](#client-side-discoverable-credential) or a [server-side credential](#server-side-credential).

Human Palatability

An identifier that is [human-palatable](#human-palatability) is intended to be rememberable and reproducible by typical human users, in contrast to identifiers that are, for example, randomly generated sequences of bits [[EduPersonObjectClassSpec]](#biblio-edupersonobjectclassspec).

Non-Discoverable Credential

This is a [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) whose [credential ID](#credential-id) must be provided in `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` when calling `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` because it is not [client-side discoverable](#client-side-discoverable-credential). See also [server-side credentials](#server-side-credential).

Public Key Credential Source

A [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source) ([[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1)) used by an [authenticator](#authenticator) to generate [authentication assertions](#authentication-assertion). A [public key credential source](#public-key-credential-source) consists of a [struct](https://infra.spec.whatwg.org/#struct) with the following [items](https://infra.spec.whatwg.org/#struct-item):

type

whose value is of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)`, defaulting to `[public-key](#dom-publickeycredentialtype-public-key)`.

id

A [Credential ID](#credential-id).

privateKey

The [credential private key](#credential-private-key).

rpId

The [Relying Party Identifier](#relying-party-identifier), for the [Relying Party](#relying-party) this [public key credential source](#public-key-credential-source) is [scoped](#scope) to.

userHandle

The [user handle](#user-handle) associated when this [public key credential source](#public-key-credential-source) was created. This [item](https://infra.spec.whatwg.org/#struct-item) is nullable.

otherUI

OPTIONAL other information used by the [authenticator](#authenticator) to inform its UI. For example, this might include the user’s `[displayName](#dom-publickeycredentialuserentity-displayname)`. [otherUI](#public-key-credential-source-otherui) is a mutable item and SHOULD NOT be bound to the [public key credential source](#public-key-credential-source) in a way that prevents [otherUI](#public-key-credential-source-otherui) from being updated.

The [authenticatorMakeCredential](#authenticatormakecredential) operation creates a [public key credential source](#public-key-credential-source) [bound](#bound-credential) to a managing authenticator and returns the [credential public key](#credential-public-key) associated with its [credential private key](#credential-private-key). The [Relying Party](#relying-party) can use this [credential public key](#credential-public-key) to verify the [authentication assertions](#authentication-assertion) created by this [public key credential source](#public-key-credential-source).

Public Key Credential

Generically, a _credential_ is data one entity presents to another in order to _authenticate_ the former to the latter [[RFC4949]](#biblio-rfc4949). The term [public key credential](#public-key-credential) refers to one of: a [public key credential source](#public-key-credential-source), the possibly-[attested](#attestation) [credential public key](#credential-public-key) corresponding to a [public key credential source](#public-key-credential-source), or an [authentication assertion](#authentication-assertion). Which one is generally determined by context.

Note: This is a [willful violation](https://infra.spec.whatwg.org/#willful-violation) of [[RFC4949]](#biblio-rfc4949). In English, a "credential" is both a) the thing presented to prove a statement and b) intended to be used multiple times. It’s impossible to achieve both criteria securely with a single piece of data in a public key system. [[RFC4949]](#biblio-rfc4949) chooses to define a credential as the thing that can be used multiple times (the public key), while this specification gives "credential" the English term’s flexibility. This specification uses more specific terms to identify the data related to an [[RFC4949]](#biblio-rfc4949) credential:

"Authentication information" (possibly including a private key)

[Public key credential source](#public-key-credential-source)

"Signed value"

[Authentication assertion](#authentication-assertion)

[[RFC4949]](#biblio-rfc4949) "credential"

[Credential public key](#credential-public-key) or [attestation object](#attestation-object)

At [registration](#registration) time, the [authenticator](#authenticator) creates an asymmetric key pair, and stores its [private key portion](#credential-private-key) and information from the [Relying Party](#relying-party) into a [public key credential source](#public-key-credential-source). The [public key portion](#credential-public-key) is returned to the [Relying Party](#relying-party), who then stores it in conjunction with the present user’s account. Subsequently, only that [Relying Party](#relying-party), as identified by its [RP ID](#rp-id), is able to employ the [public key credential](#public-key-credential) in [authentication ceremonies](#authentication), via the `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` method. The [Relying Party](#relying-party) uses its stored copy of the [credential public key](#credential-public-key) to verify the resultant [authentication assertion](#authentication-assertion).

Rate Limiting

The process (also known as throttling) by which an authenticator implements controls against brute force attacks by limiting the number of consecutive failed authentication attempts within a given period of time. If the limit is reached, the authenticator should impose a delay that increases exponentially with each successive attempt, or disable the current authentication modality and offer a different [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) if available. [Rate limiting](#rate-limiting) is often implemented as an aspect of [user verification](#user-verification).

Registration

Registration Ceremony

The [ceremony](#ceremony) where a user, a [Relying Party](#relying-party), and the user’s [client](#client) (containing at least one [authenticator](#authenticator)) work in concert to create a [public key credential](#public-key-credential) and associate it with the user’s [Relying Party](#relying-party) account. Note that this includes employing a [test of user presence](#test-of-user-presence) or [user verification](#user-verification). After a successful [registration ceremony](#registration-ceremony), the user can be authenticated by an [authentication ceremony](#authentication-ceremony).

The WebAuthn [registration ceremony](#registration-ceremony) is defined in [§ 7.1 Registering a New Credential](#sctn-registering-a-new-credential), and is initiated by the [Relying Party](#relying-party) calling `` `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` `` with a `[publicKey](#dom-credentialcreationoptions-publickey)` argument. See [§ 5 Web Authentication API](#sctn-api) for an introductory overview and [§ 1.3.1 Registration](#sctn-sample-registration) for implementation examples.

Relying Party

See [WebAuthn Relying Party](#webauthn-relying-party).

Relying Party Identifier

RP ID

In the context of the [WebAuthn API](#web-authentication-api), a [relying party identifier](#relying-party-identifier) is a [valid domain string](https://url.spec.whatwg.org/#valid-domain-string) identifying the [WebAuthn Relying Party](#webauthn-relying-party) on whose behalf a given [registration](#registration) or [authentication ceremony](#authentication) is being performed. A [public key credential](#public-key-credential) can only be used for [authentication](#authentication) with the same entity (as identified by [RP ID](#rp-id)) it was registered with.

By default, the [RP ID](#rp-id) for a WebAuthn operation is set to the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). This default MAY be overridden by the caller, as long as the caller-specified [RP ID](#rp-id) value [is a registrable domain suffix of or is equal to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). See also [§ 5.1.3 Create a New Credential - PublicKeyCredential’s [[Create]](origin, options, sameOriginWithAncestors) Method](#sctn-createCredential) and [§ 5.1.4 Use an Existing Credential to Make an Assertion - PublicKeyCredential’s [[Get]](options) Method](#sctn-getAssertion).

[](#note-pkcredscope)Note: An [RP ID](#rp-id) is based on a [host](https://url.spec.whatwg.org/#concept-url-host)'s [domain](https://url.spec.whatwg.org/#concept-domain) name. It does not itself include a [scheme](https://url.spec.whatwg.org/#concept-url-scheme) or [port](https://url.spec.whatwg.org/#concept-url-port), as an [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) does. The [RP ID](#rp-id) of a [public key credential](#public-key-credential) determines its scope. I.e., it determines the set of origins on which the public key credential may be exercised, as follows:

- The [RP ID](#rp-id) must be equal to the [origin](#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain), or a [registrable domain suffix](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) of the [origin](#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain).
    
- The [origin](#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [scheme](https://url.spec.whatwg.org/#concept-url-scheme) must be `https`.
    
- The [origin](#determines-the-set-of-origins-on-which-the-public-key-credential-may-be-exercised)'s [port](https://url.spec.whatwg.org/#concept-url-port) is unrestricted.
    

For example, given a [Relying Party](#relying-party) whose origin is `https://login.example.com:1337`, then the following [RP ID](#rp-id)s are valid: `login.example.com` (default) and `example.com`, but not `m.login.example.com` and not `com`.

This is done in order to match the behavior of pervasively deployed ambient credentials (e.g., cookies, [[RFC6265]](#biblio-rfc6265)). Please note that this is a greater relaxation of "same-origin" restrictions than what [document.domain](https://html.spec.whatwg.org/multipage/origin.html#dom-document-domain)'s setter provides.

These restrictions on origin values apply to [WebAuthn Clients](#webauthn-client).

Other specifications mimicking the [WebAuthn API](#web-authentication-api) to enable WebAuthn [public key credentials](#public-key-credential) on non-Web platforms (e.g. native mobile applications), MAY define different rules for binding a caller to a [Relying Party Identifier](#relying-party-identifier). Though, the [RP ID](#rp-id) syntaxes MUST conform to either [valid domain strings](https://url.spec.whatwg.org/#valid-domain-string) or URIs [[RFC3986]](#biblio-rfc3986) [[URL]](#biblio-url).

Server-side Public Key Credential Source

Server-side Credential

[DEPRECATED] Non-Resident Credential

Note: Historically, [server-side credentials](#server-side-credential) have been known as [non-resident credentials](#non-resident-credential). For backwards compatibility purposes, the various [WebAuthn API](#web-authentication-api) and [Authenticator Model](#authenticator-model) components with various forms of `resident` within their names have not been changed.

A [Server-side Public Key Credential Source](#server-side-public-key-credential-source), or [Server-side Credential](#server-side-credential) for short, is a [public key credential source](#public-key-credential-source) that is only usable in an [authentication ceremony](#authentication-ceremony) when the [Relying Party](#relying-party) supplies its [credential ID](#credential-id) in `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`'s `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument. This means that the [Relying Party](#relying-party) must manage the credential’s storage and discovery, as well as be able to first identify the user in order to discover the [credential IDs](#credential-id) to supply in the `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` call.

[Client-side](#client-side) storage of the [public key credential source](#public-key-credential-source) is not required for a [server-side credential](#server-side-credential). This is in contrast to a [client-side discoverable credential](#client-side-discoverable-credential), which instead does not require the user to first be identified in order to provide the user’s [credential ID](#credential-id)s to a `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` call.

See also: [server-side credential storage modality](#server-side-credential-storage-modality) and [non-discoverable credential](#non-discoverable-credential).

Test of User Presence

A [test of user presence](#test-of-user-presence) is a simple form of [authorization gesture](#authorization-gesture) and technical process where a user interacts with an [authenticator](#authenticator) by (typically) simply touching it (other modalities may also exist), yielding a Boolean result. Note that this does not constitute [user verification](#user-verification) because a [user presence test](#test-of-user-presence), by definition, is not capable of [biometric recognition](#biometric-recognition), nor does it involve the presentation of a shared secret such as a password or PIN.

User Consent

User consent means the user agrees with what they are being asked, i.e., it encompasses reading and understanding prompts. An [authorization gesture](#authorization-gesture) is a [ceremony](#ceremony) component often employed to indicate [user consent](#user-consent).

User Handle

The user handle is specified by a [Relying Party](#relying-party), as the value of `` `[user](#dom-publickeycredentialcreationoptions-user)`.`[id](#dom-publickeycredentialuserentity-id)` ``, and used to [map](#authenticator-credentials-map) a specific [public key credential](#public-key-credential) to a specific user account with the [Relying Party](#relying-party). Authenticators in turn [map](#authenticator-credentials-map) [RP ID](#rp-id)s and user handle pairs to [public key credential sources](#public-key-credential-source).

A user handle is an opaque [byte sequence](https://infra.spec.whatwg.org/#byte-sequence) with a maximum size of 64 bytes, and is not meant to be displayed to the user.

User Verification

The technical process by which an [authenticator](#authenticator) _locally authorizes_ the invocation of the [authenticatorMakeCredential](#authenticatormakecredential) and [authenticatorGetAssertion](#authenticatorgetassertion) operations. [User verification](#user-verification) MAY be instigated through various [authorization gesture](#authorization-gesture) modalities; for example, through a touch plus pin code, password entry, or [biometric recognition](#biometric-recognition) (e.g., presenting a fingerprint) [[ISOBiometricVocabulary]](#biblio-isobiometricvocabulary). The intent is to distinguish individual users.

Note that [user verification](#user-verification) does not give the [Relying Party](#relying-party) a concrete identification of the user, but when 2 or more ceremonies with [user verification](#user-verification) have been done with that [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) it expresses that it was the same user that performed all of them. The same user might not always be the same natural person, however, if multiple natural persons share access to the same [authenticator](#authenticator).

Note: Distinguishing natural persons depends in significant part upon the [client platform](#client-platform)'s and [authenticator](#authenticator)'s capabilities. For example, some devices are intended to be used by a single individual, yet they may allow multiple natural persons to enroll fingerprints or know the same PIN and thus access the same [Relying Party](#relying-party) account(s) using that device.

Note: Invocation of the [authenticatorMakeCredential](#authenticatormakecredential) and [authenticatorGetAssertion](#authenticatorgetassertion) operations implies use of key material managed by the authenticator.

Also, for security, [user verification](#user-verification) and use of [credential private keys](#credential-private-key) must all occur within the logical security boundary defining the [authenticator](#authenticator).

[User verification](#user-verification) procedures MAY implement [rate limiting](#rate-limiting) as a protection against brute force attacks.

User Present

UP

Upon successful completion of a [user presence test](#test-of-user-presence), the user is said to be "[present](#concept-user-present)".

User Verified

UV

Upon successful completion of a [user verification](#user-verification) process, the user is said to be "[verified](#concept-user-verified)".

WebAuthn Relying Party

The entity whose web application utilizes the [Web Authentication API](#sctn-api) to [register](#registration) and [authenticate](#authentication) users.

A [Relying Party](#relying-party) implementation typically consists of both some client-side script that invokes the [Web Authentication API](#web-authentication-api) in the [client](#client), and a server-side component that executes the [Relying Party operations](#sctn-rp-operations) and other application logic. Communication between the two components MUST use HTTPS or equivalent transport security, but is otherwise beyond the scope of this specification.

Note: While the term [Relying Party](#relying-party) is also often used in other contexts (e.g., X.509 and OAuth), an entity acting as a [Relying Party](#relying-party) in one context is not necessarily a [Relying Party](#relying-party) in other contexts. In this specification, the term [WebAuthn Relying Party](#webauthn-relying-party) is often shortened to be just [Relying Party](#relying-party), and explicitly refers to a [Relying Party](#relying-party) in the WebAuthn context. Note that in any concrete instantiation a WebAuthn context may be embedded in a broader overall context, e.g., one based on OAuth.

This section normatively specifies the API for creating and using [public key credentials](#public-key-credential). The basic idea is that the credentials belong to the user and are [managed](#public-key-credential-source-managing-authenticator) by a [WebAuthn Authenticator](#webauthn-authenticator), with which the [WebAuthn Relying Party](#webauthn-relying-party) interacts through the [client platform](#client-platform). [Relying Party](#relying-party) scripts can (with the [user’s consent](#user-consent)) request the browser to create a new credential for future use by the [Relying Party](#relying-party). See [Figure](#fig-registration) , below.

![](https://www.w3.org/TR/webauthn-2/images/webauthn-registration-flow-01.svg)

Registration Flow

Scripts can also request the user’s permission to perform [authentication](#authentication) operations with an existing credential. See [Figure](#fig-authentication) , below.

![](https://www.w3.org/TR/webauthn-2/images/webauthn-authentication-flow-01.svg)

Authentication Flow

All such operations are performed in the authenticator and are mediated by the [client platform](#client-platform) on the user’s behalf. At no point does the script get access to the credentials themselves; it only gets information about the credentials in the form of objects.

In addition to the above script interface, the authenticator MAY implement (or come with client software that implements) a user interface for management. Such an interface MAY be used, for example, to reset the authenticator to a clean state or to inspect the current state of the authenticator. In other words, such an interface is similar to the user interfaces provided by browsers for managing user state such as history, saved passwords, and cookies. Authenticator management actions such as credential deletion are considered to be the responsibility of such a user interface and are deliberately omitted from the API exposed to scripts.

The security properties of this API are provided by the client and the authenticator working together. The authenticator, which holds and [manages](#public-key-credential-source-managing-authenticator) credentials, ensures that all operations are [scoped](#scope) to a particular [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin), and cannot be replayed against a different [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin), by incorporating the [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) in its responses. Specifically, as defined in [§ 6.3 Authenticator Operations](#sctn-authenticator-ops), the full [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) of the requester is included, and signed over, in the [attestation object](#attestation-object) produced when a new credential is created as well as in all assertions produced by WebAuthn credentials.

Additionally, to maintain user privacy and prevent malicious [Relying Parties](#relying-party) from probing for the presence of [public key credentials](#public-key-credential) belonging to other [Relying Parties](#relying-party), each [credential](#public-key-credential) is also [scoped](#scope) to a [Relying Party Identifier](#relying-party-identifier), or [RP ID](#rp-id). This [RP ID](#rp-id) is provided by the client to the [authenticator](#authenticator) for all operations, and the [authenticator](#authenticator) ensures that [credentials](#public-key-credential) created by a [Relying Party](#relying-party) can only be used in operations requested by the same [RP ID](#rp-id). Separating the [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) from the [RP ID](#rp-id) in this way allows the API to be used in cases where a single [Relying Party](#relying-party) maintains multiple [origins](https://html.spec.whatwg.org/multipage/origin.html#concept-origin).

The client facilitates these security measures by providing the [Relying Party](#relying-party)'s [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) and [RP ID](#rp-id) to the [authenticator](#authenticator) for each operation. Since this is an integral part of the WebAuthn security model, user agents only expose this API to callers in [secure contexts](https://w3c.github.io/webappsec-secure-contexts/#secure-contexts). For web contexts in particular, this only includes those accessed via a secure transport (e.g., TLS) established without errors.

The Web Authentication API is defined by the union of the Web IDL fragments presented in the following sections. A combined IDL listing is given in the [IDL Index](#idl-index).

### 5.1. `PublicKeyCredential` Interface[](#iface-pkcredential)

[PublicKeyCredential](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential "The PublicKeyCredential interface provides information about a public key / private key pair, which is a credential for logging in to a service using an un-phishable and data-breach resistant asymmetric key pair instead of a password. It inherits from Credential, and was created by the Web Authentication API extension to the Credential Management API. Other interfaces that inherit from Credential are PasswordCredential and FederatedCredential.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

The `[PublicKeyCredential](#publickeycredential)` interface inherits from `[Credential](https://w3c.github.io/webappsec-credential-management/#credential)` [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1), and contains the attributes that are returned to the caller when a new credential is created, or a new assertion is requested.

[PublicKeyCredential/getClientExtensionResults](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/getClientExtensionResults "getClientExtensionResults() is a method of the PublicKeyCredential interface that returns an ArrayBuffer which contains a map between the extensions identifiers and their results after having being processed by the client.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

[PublicKeyCredential/rawId](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/rawId "The rawId read-only property of the PublicKeyCredential interface is an ArrayBuffer object containing the identifier of the credentials.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

[[SecureContext](https://heycam.github.io/webidl/#SecureContext), [Exposed](https://heycam.github.io/webidl/#Exposed)=Window]
interface [PublicKeyCredential](#publickeycredential) : [Credential](https://w3c.github.io/webappsec-credential-management/#credential) {
    [[SameObject](https://heycam.github.io/webidl/#SameObject)] readonly attribute [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)              `rawId`;
    [[SameObject](https://heycam.github.io/webidl/#SameObject)] readonly attribute [AuthenticatorResponse](#authenticatorresponse)    [response](#dom-publickeycredential-response);
    [AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs) `getClientExtensionResults`();
};

`[id](https://w3c.github.io/webappsec-credential-management/#dom-credential-id)`

This attribute is inherited from `[Credential](https://w3c.github.io/webappsec-credential-management/#credential)`, though `[PublicKeyCredential](#publickeycredential)` overrides `[Credential](https://w3c.github.io/webappsec-credential-management/#credential)`'s getter, instead returning the [base64url encoding](#base64url-encoding) of the data contained in the object’s `[[[identifier]]](#dom-publickeycredential-identifier-slot)` [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots).

`[rawId](#dom-publickeycredential-rawid)`

This attribute returns the `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)` contained in the `[[[identifier]]](#dom-publickeycredential-identifier-slot)` internal slot.

[PublicKeyCredential/response](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/response "The response read-only property of the PublicKeyCredential interface is an AuthenticatorResponse object which is sent from the authenticator to the user agent for the creation/fetching of credentials. The information contained in this response will be used by the relying party's server to verify the demand is legitimate.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`response`, of type [AuthenticatorResponse](#authenticatorresponse), readonly

This attribute contains the [authenticator](#authenticator)'s response to the client’s request to either create a [public key credential](#public-key-credential), or generate an [authentication assertion](#authentication-assertion). If the `[PublicKeyCredential](#publickeycredential)` is created in response to `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)`, this attribute’s value will be an `[AuthenticatorAttestationResponse](#authenticatorattestationresponse)`, otherwise, the `[PublicKeyCredential](#publickeycredential)` was created in response to `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`, and this attribute’s value will be an `[AuthenticatorAssertionResponse](#authenticatorassertionresponse)`.

`[getClientExtensionResults()](#dom-publickeycredential-getclientextensionresults)`

This operation returns the value of `[[[clientExtensionsResults]]](#dom-publickeycredential-clientextensionsresults-slot)`, which is a [map](https://infra.spec.whatwg.org/#ordered-map) containing [extension identifier](#extension-identifier) → [client extension output](#client-extension-output) entries produced by the extension’s [client extension processing](#client-extension-processing).

`[[type]]`[](#dom-publickeycredential-type-slot)

The `[PublicKeyCredential](#publickeycredential)` [interface object](https://heycam.github.io/webidl/#dfn-interface-object)'s `[[[type]]](https://w3c.github.io/webappsec-credential-management/#dom-credential-type-slot)` [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots)'s value is the string "`public-key`".

Note: This is reflected via the `[type](https://w3c.github.io/webappsec-credential-management/#dom-credential-type)` attribute getter inherited from `[Credential](https://w3c.github.io/webappsec-credential-management/#credential)`.

`[[discovery]]`[](#dom-publickeycredential-discovery-slot)

The `[PublicKeyCredential](#publickeycredential)` [interface object](https://heycam.github.io/webidl/#dfn-interface-object)'s `[[[discovery]]](https://w3c.github.io/webappsec-credential-management/#dom-credential-discovery-slot)` [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots)'s value is "`[remote](https://w3c.github.io/webappsec-credential-management/#dom-credential-discovery-remote)`".

`[[identifier]]`

This [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) contains the [credential ID](#credential-id), chosen by the authenticator. The [credential ID](#credential-id) is used to look up credentials for use, and is therefore expected to be globally unique with high probability across all credentials of the same type, across all authenticators.

Note: This API does not constrain the format or length of this identifier, except that it MUST be sufficient for the [authenticator](#authenticator) to uniquely select a key. For example, an authenticator without on-board storage may create identifiers containing a [credential private key](#credential-private-key) wrapped with a symmetric key that is burned into the authenticator.

`[[clientExtensionsResults]]`

This [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) contains the results of processing client extensions requested by the [Relying Party](#relying-party) upon the [Relying Party](#relying-party)'s invocation of either `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` or `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`.

`[PublicKeyCredential](#publickeycredential)`'s [interface object](https://heycam.github.io/webidl/#dfn-interface-object) inherits `[Credential](https://w3c.github.io/webappsec-credential-management/#credential)`'s implementation of `[[[CollectFromCredentialStore]](origin, options, sameOriginWithAncestors)](https://w3c.github.io/webappsec-credential-management/#collectfromcredentialstore-origin-options-sameoriginwithancestors)`, and defines its own implementation of `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)`, `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)`, and `[[[Store]](credential, sameOriginWithAncestors)](https://w3c.github.io/webappsec-credential-management/#store-credential-sameoriginwithancestors)`.

#### 5.1.1. `CredentialCreationOptions` Dictionary Extension[](#sctn-credentialcreationoptions-extension)

To support registration via `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)`, this document extends the `[CredentialCreationOptions](https://w3c.github.io/webappsec-credential-management/#dictdef-credentialcreationoptions)` dictionary as follows:

partial dictionary [CredentialCreationOptions](https://w3c.github.io/webappsec-credential-management/#dictdef-credentialcreationoptions) {
    [PublicKeyCredentialCreationOptions](#dictdef-publickeycredentialcreationoptions)      `publicKey`;
};

#### 5.1.2. `CredentialRequestOptions` Dictionary Extension[](#sctn-credentialrequestoptions-extension)

To support obtaining assertions via `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`, this document extends the `[CredentialRequestOptions](https://w3c.github.io/webappsec-credential-management/#dictdef-credentialrequestoptions)` dictionary as follows:

partial dictionary [CredentialRequestOptions](https://w3c.github.io/webappsec-credential-management/#dictdef-credentialrequestoptions) {
    [PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)      `publicKey`;
};

#### 5.1.3. Create a New Credential - PublicKeyCredential’s `[[Create]](origin, options, sameOriginWithAncestors)` Method[](#sctn-createCredential)

`[PublicKeyCredential](#publickeycredential)`'s [interface object](https://heycam.github.io/webidl/#dfn-interface-object)'s implementation of the `[[Create]](origin, options, sameOriginWithAncestors)` [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1) allows [WebAuthn Relying Party](#webauthn-relying-party) scripts to call `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` to request the creation of a new [public key credential source](#public-key-credential-source), [bound](#bound-credential) to an [authenticator](#authenticator). This `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` operation can be aborted by leveraging the `[AbortController](https://dom.spec.whatwg.org/#abortcontroller)`; see [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) for detailed instructions.

This [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) accepts three arguments:

`origin`

This argument is the [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin), as determined by the calling `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` implementation.

`options`[](#dom-publickeycredential-create-origin-options-sameoriginwithancestors-options)

This argument is a `[CredentialCreationOptions](https://w3c.github.io/webappsec-credential-management/#dictdef-credentialcreationoptions)` object whose `` options.`[publicKey](#dom-credentialcreationoptions-publickey)` `` member contains a `[PublicKeyCredentialCreationOptions](#dictdef-publickeycredentialcreationoptions)` object specifying the desired attributes of the to-be-created [public key credential](#public-key-credential).

`sameOriginWithAncestors`

This argument is a Boolean value which is `true` if and only if the caller’s [environment settings object](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object) is [same-origin with its ancestors](https://w3c.github.io/webappsec-credential-management/#same-origin-with-its-ancestors). It is `false` if caller is cross-origin.

Note: Invocation of this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) indicates that it was allowed by [permissions policy](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy), which is evaluated at the [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1) level. See [§ 5.9 Permissions Policy integration](#sctn-permissions-policy).

Note: **This algorithm is synchronous:** the `[Promise](https://heycam.github.io/webidl/#idl-promise)` resolution/rejection is handled by `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)`.

Note: All `[BufferSource](https://heycam.github.io/webidl/#BufferSource)` objects used in this algorithm must be snapshotted when the algorithm begins, to avoid potential synchronization issues. The algorithm implementations should [get a copy of the bytes held by the buffer source](https://heycam.github.io/webidl#dfn-get-buffer-source-reference) and use that copy for relevant portions of the algorithm.

When this method is invoked, the user agent MUST execute the following algorithm:

1. Assert: `` options.`[publicKey](#dom-credentialcreationoptions-publickey)` `` is present.
    
2. If sameOriginWithAncestors is `false`, return a "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`" `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)`.
    
    Note: This "sameOriginWithAncestors" restriction aims to address a tracking concern raised in [Issue #1336](https://github.com/w3c/webauthn/issues/1336). This may be revised in future versions of this specification.
    
3. Let options be the value of `` options.`[publicKey](#dom-credentialcreationoptions-publickey)` ``.
    
4. If the `[timeout](#dom-publickeycredentialcreationoptions-timeout)` member of options is present, check if its value lies within a reasonable range as defined by the [client](#client) and if not, correct it to the closest value lying within that range. Set a timer lifetimeTimer to this adjusted value. If the `[timeout](#dom-publickeycredentialcreationoptions-timeout)` member of options is not present, then set lifetimeTimer to a [client](#client)-specific default.
    
    Recommended ranges and defaults for the `[timeout](#dom-publickeycredentialcreationoptions-timeout)` member of options are as follows. If `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[userVerification](#dom-authenticatorselectioncriteria-userverification)` ``
    
    is set to `[discouraged](#dom-userverificationrequirement-discouraged)`
    
    Recommended range: 30000 milliseconds to 180000 milliseconds.
    
    Recommended default value: 120000 milliseconds (2 minutes).
    
    is set to `[required](#dom-userverificationrequirement-required)` or `[preferred](#dom-userverificationrequirement-preferred)`
    
    Recommended range: 30000 milliseconds to 600000 milliseconds.
    
    Recommended default value: 300000 milliseconds (5 minutes).
    
    Note: The user agent should take cognitive guidelines into considerations regarding timeout for users with special needs.
    
5. If the length of `` options.`[user](#dom-publickeycredentialcreationoptions-user)`.`[id](#dom-publickeycredentialuserentity-id)` `` is not between 1 and 64 bytes (inclusive) then return a `[TypeError](https://heycam.github.io/webidl/#exceptiondef-typeerror)`.
    
6. Let callerOrigin be `[origin](#dom-publickeycredential-create-origin-options-sameoriginwithancestors-origin)`. If callerOrigin is an [opaque origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque), return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`", and terminate this algorithm.
    
7. Let effectiveDomain be the callerOrigin’s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). If [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) is not a [valid domain](https://url.spec.whatwg.org/#valid-domain), then return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[SecurityError](https://heycam.github.io/webidl/#securityerror)`" and terminate this algorithm.
    
    Note: An [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) may resolve to a [host](https://url.spec.whatwg.org/#concept-url-host), which can be represented in various manners, such as [domain](https://url.spec.whatwg.org/#concept-domain), [ipv4 address](https://url.spec.whatwg.org/#concept-ipv4), [ipv6 address](https://url.spec.whatwg.org/#concept-ipv6), [opaque host](https://url.spec.whatwg.org/#opaque-host), or [empty host](https://url.spec.whatwg.org/#empty-host). Only the [domain](https://url.spec.whatwg.org/#concept-domain) format of [host](https://url.spec.whatwg.org/#concept-url-host) is allowed here. This is for simplification and also is in recognition of various issues with using direct IP address identification in concert with PKI-based security.
    
8. [](#CreateCred-DetermineRpId)
    
    If `` options.`[rp](#dom-publickeycredentialcreationoptions-rp)`.`[id](#dom-publickeycredentialrpentity-id)` ``
    
    is present
    
    If `` options.`[rp](#dom-publickeycredentialcreationoptions-rp)`.`[id](#dom-publickeycredentialrpentity-id)` `` [is not a registrable domain suffix of and is not equal to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) effectiveDomain, return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[SecurityError](https://heycam.github.io/webidl/#securityerror)`", and terminate this algorithm.
    
    Is not present
    
    Set `` options.`[rp](#dom-publickeycredentialcreationoptions-rp)`.`[id](#dom-publickeycredentialrpentity-id)` `` to effectiveDomain.
    
    Note: `` options.`[rp](#dom-publickeycredentialcreationoptions-rp)`.`[id](#dom-publickeycredentialrpentity-id)` `` represents the caller’s [RP ID](#rp-id). The [RP ID](#rp-id) defaults to being the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) unless the caller has explicitly set `` options.`[rp](#dom-publickeycredentialcreationoptions-rp)`.`[id](#dom-publickeycredentialrpentity-id)` `` when calling `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)`.
    
9. Let credTypesAndPubKeyAlgs be a new [list](https://infra.spec.whatwg.org/#list) whose [items](https://infra.spec.whatwg.org/#list-item) are pairs of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` and a `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)`.
    
10. If `` options.`[pubKeyCredParams](#dom-publickeycredentialcreationoptions-pubkeycredparams)` ``’s [size](https://infra.spec.whatwg.org/#list-size)
    
    is zero
    
    [Append](https://infra.spec.whatwg.org/#list-append) the following pairs of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` and `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)` values to credTypesAndPubKeyAlgs:
    
    - `[public-key](#dom-publickeycredentialtype-public-key)` and `-7` ("ES256").
        
    - `[public-key](#dom-publickeycredentialtype-public-key)` and `-257` ("RS256").
        
    
    is non-zero
    
    [For each](https://infra.spec.whatwg.org/#list-iterate) current of `` options.`[pubKeyCredParams](#dom-publickeycredentialcreationoptions-pubkeycredparams)` ``:
    
    1. If `` current.`[type](#dom-publickeycredentialparameters-type)` `` does not contain a `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` supported by this implementation, then [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    2. Let alg be `` current.`[alg](#dom-publickeycredentialparameters-alg)` ``.
        
    3. [Append](https://infra.spec.whatwg.org/#list-append) the pair of `` current.`[type](#dom-publickeycredentialparameters-type)` `` and alg to credTypesAndPubKeyAlgs.
        
    
    If credTypesAndPubKeyAlgs [is empty](https://infra.spec.whatwg.org/#list-is-empty), return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotSupportedError](https://heycam.github.io/webidl/#notsupportederror)`", and terminate this algorithm.
    
11. Let clientExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map) and let authenticatorExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map).
    
12. If the `[extensions](#dom-publickeycredentialcreationoptions-extensions)` member of options is present, then [for each](https://infra.spec.whatwg.org/#map-iterate) extensionId → clientExtensionInput of `` options.`[extensions](#dom-publickeycredentialcreationoptions-extensions)` ``:
    
    1. If extensionId is not supported by this [client platform](#client-platform) or is not a [registration extension](#registration-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    2. [Set](https://infra.spec.whatwg.org/#map-set) clientExtensions[extensionId] to clientExtensionInput.
        
    3. If extensionId is not an [authenticator extension](#authenticator-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    4. Let authenticatorExtensionInput be the ([CBOR](#cbor)) result of running extensionId’s [client extension processing](#client-extension-processing) algorithm on clientExtensionInput. If the algorithm returned an error, [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    5. [Set](https://infra.spec.whatwg.org/#map-set) authenticatorExtensions[extensionId] to the [base64url encoding](#base64url-encoding) of authenticatorExtensionInput.
        
13. Let collectedClientData be a new `[CollectedClientData](#dictdef-collectedclientdata)` instance whose fields are:
    
    `[type](#dom-collectedclientdata-type)`
    
    The string "webauthn.create".
    
    `[challenge](#dom-collectedclientdata-challenge)`
    
    The [base64url encoding](#base64url-encoding) of options.`[challenge](#dom-publickeycredentialcreationoptions-challenge)`.
    
    `[origin](#dom-collectedclientdata-origin)`
    
    The [serialization of](https://html.spec.whatwg.org/multipage/origin.html#ascii-serialisation-of-an-origin) callerOrigin.
    
    `[crossOrigin](#dom-collectedclientdata-crossorigin)`
    
    The inverse of the value of the `[sameOriginWithAncestors](#dom-publickeycredential-create-origin-options-sameoriginwithancestors-sameoriginwithancestors)` argument passed to this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots).
    
    `[tokenBinding](#dom-collectedclientdata-tokenbinding)`
    
    The status of [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) between the client and the callerOrigin, as well as the [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) associated with callerOrigin, if one is available.
    
14. Let clientDataJSON be the [JSON-compatible serialization of client data](#collectedclientdata-json-compatible-serialization-of-client-data) constructed from collectedClientData.
    
15. Let clientDataHash be the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data) represented by clientDataJSON.
    
16. If the `` options.`[signal](https://w3c.github.io/webappsec-credential-management/#dom-credentialcreationoptions-signal)` `` is present and its [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`, return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[AbortError](https://heycam.github.io/webidl/#aborterror)`" and terminate this algorithm.
    
17. Let issuedRequests be a new [ordered set](https://infra.spec.whatwg.org/#ordered-set).
    
18. Let authenticators represent a value which at any given instant is a [set](https://infra.spec.whatwg.org/#ordered-set) of [client platform](#client-platform)-specific handles, where each [item](https://infra.spec.whatwg.org/#list-item) identifies an [authenticator](#authenticator) presently available on this [client platform](#client-platform) at that instant.
    
    Note: What qualifies an [authenticator](#authenticator) as "available" is intentionally unspecified; this is meant to represent how [authenticators](#authenticator) can be [hot-plugged](https://en.wikipedia.org/w/index.php?title=Hot_plug) into (e.g., via USB) or discovered (e.g., via NFC or Bluetooth) by the [client](#client) by various mechanisms, or permanently built into the [client](#client).
    
19. Start lifetimeTimer.
    
20. [While](https://infra.spec.whatwg.org/#iteration-while) lifetimeTimer has not expired, perform the following actions depending upon lifetimeTimer, and the state and response [for each](https://infra.spec.whatwg.org/#list-iterate) authenticator in authenticators:
    
    If lifetimeTimer expires,
    
    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
    
    If the user exercises a user agent user-interface option to cancel the process,
    
    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`".
    
    If the `` options.`[signal](https://w3c.github.io/webappsec-credential-management/#dom-credentialcreationoptions-signal)` `` is present and its [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`,
    
    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Then return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[AbortError](https://heycam.github.io/webidl/#aborterror)`" and terminate this algorithm.
    
    If an authenticator becomes available on this [client device](#client-device),
    
    Note: This includes the case where an authenticator was available upon lifetimeTimer initiation.
    
    1. This authenticator is now the candidate authenticator.
        
    2. If `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)` `` is present:
        
        1. If `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[authenticatorAttachment](#dom-authenticatorselectioncriteria-authenticatorattachment)` `` is present and its value is not equal to authenticator’s [authenticator attachment modality](#authenticator-attachment-modality), [continue](https://infra.spec.whatwg.org/#iteration-continue).
            
        2. If `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[residentKey](#dom-authenticatorselectioncriteria-residentkey)` ``
            
            is present and set to `[required](#dom-residentkeyrequirement-required)`
            
            If the authenticator is not capable of storing a [client-side discoverable public key credential source](#client-side-discoverable-public-key-credential-source), [continue](https://infra.spec.whatwg.org/#iteration-continue).
            
            is present and set to `[preferred](#dom-residentkeyrequirement-preferred)` or `[discouraged](#dom-residentkeyrequirement-discouraged)`
            
            No effect.
            
            is not present
            
            if `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[requireResidentKey](#dom-authenticatorselectioncriteria-requireresidentkey)` `` is set to `true` and the authenticator is not capable of storing a [client-side discoverable public key credential source](#client-side-discoverable-public-key-credential-source), [continue](https://infra.spec.whatwg.org/#iteration-continue).
            
        3. If `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[userVerification](#dom-authenticatorselectioncriteria-userverification)` `` is set to `[required](#dom-userverificationrequirement-required)` and the authenticator is not capable of performing [user verification](#user-verification), [continue](https://infra.spec.whatwg.org/#iteration-continue).
            
    3. Let requireResidentKey be the effective resident key requirement for credential creation, a Boolean value, as follows:
        
        If `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[residentKey](#dom-authenticatorselectioncriteria-residentkey)` ``
        
        is present and set to `[required](#dom-residentkeyrequirement-required)`
        
        Let requireResidentKey be `true`.
        
        is present and set to `[preferred](#dom-residentkeyrequirement-preferred)`
        
        If the authenticator
        
        is capable of [client-side credential storage modality](#client-side-credential-storage-modality)
        
        Let requireResidentKey be `true`.
        
        is not capable of [client-side credential storage modality](#client-side-credential-storage-modality), or if the [client](#client) cannot determine authenticator capability,
        
        Let requireResidentKey be `false`.
        
        is present and set to `[discouraged](#dom-residentkeyrequirement-discouraged)`
        
        Let requireResidentKey be `false`.
        
        is not present
        
        Let requireResidentKey be the value of `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[requireResidentKey](#dom-authenticatorselectioncriteria-requireresidentkey)` ``.
        
    4. Let userVerification be the effective user verification requirement for credential creation, a Boolean value, as follows. If `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[userVerification](#dom-authenticatorselectioncriteria-userverification)` ``
        
        is set to `[required](#dom-userverificationrequirement-required)`
        
        Let userVerification be `true`.
        
        is set to `[preferred](#dom-userverificationrequirement-preferred)`
        
        If the authenticator
        
        is capable of [user verification](#user-verification)
        
        Let userVerification be `true`.
        
        is not capable of [user verification](#user-verification)
        
        Let userVerification be `false`.
        
        is set to `[discouraged](#dom-userverificationrequirement-discouraged)`
        
        Let userVerification be `false`.
        
    5. Let enterpriseAttestationPossible be a Boolean value, as follows. If `` options.`[attestation](#dom-publickeycredentialcreationoptions-attestation)` ``
        
        is set to `[enterprise](#dom-attestationconveyancepreference-enterprise)`
        
        Let enterpriseAttestationPossible be `true` if the user agent wishes to support enterprise attestation for `` options.`[rp](#dom-publickeycredentialcreationoptions-rp)`.`[id](#dom-publickeycredentialrpentity-id)` `` (see [Step 8](#CreateCred-DetermineRpId), above). Otherwise `false`.
        
        otherwise
        
        Let enterpriseAttestationPossible be `false`.
        
    6. Let excludeCredentialDescriptorList be a new [list](https://infra.spec.whatwg.org/#list).
        
    7. [For each](https://infra.spec.whatwg.org/#list-iterate) credential descriptor C in `` options.`[excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials)` ``:
        
        1. If `` C.`[transports](#dom-publickeycredentialdescriptor-transports)` `` [is not empty](https://infra.spec.whatwg.org/#list-is-empty), and authenticator is connected over a transport not mentioned in `` C.`[transports](#dom-publickeycredentialdescriptor-transports)` ``, the client MAY [continue](https://infra.spec.whatwg.org/#iteration-continue).
            
            Note: If the client chooses to [continue](https://infra.spec.whatwg.org/#iteration-continue), this could result in inadvertently registering multiple credentials [bound to](#bound-credential) the same [authenticator](#authenticator) if the transport hints in `` C.`[transports](#dom-publickeycredentialdescriptor-transports)` `` are not accurate. For example, stored transport hints could become inaccurate as a result of software upgrades adding new connectivity options.
            
        2. Otherwise, [Append](https://infra.spec.whatwg.org/#list-append) C to excludeCredentialDescriptorList.
            
        3. [](#CreateCred-InvokeAuthnrMakeCred)
            
            Invoke the [authenticatorMakeCredential](#authenticatormakecredential) operation on authenticator with clientDataHash, `` options.`[rp](#dom-publickeycredentialcreationoptions-rp)` ``, `` options.`[user](#dom-publickeycredentialcreationoptions-user)` ``, requireResidentKey, userVerification, credTypesAndPubKeyAlgs, excludeCredentialDescriptorList, enterpriseAttestationPossible, and authenticatorExtensions as parameters.
            
    8. [Append](https://infra.spec.whatwg.org/#set-append) authenticator to issuedRequests.
        
    
    If an authenticator ceases to be available on this [client device](#client-device),
    
    [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
    
    If any authenticator returns a status indicating that the user cancelled the operation,
    
    1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
        
    2. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.
        
        Note: [Authenticators](#authenticator) may return an indication of "the user cancelled the entire operation". How a user agent manifests this state to users is unspecified.
        
    
    If any authenticator returns an error status equivalent to "`[InvalidStateError](https://heycam.github.io/webidl/#invalidstateerror)`",
    
    1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
        
    2. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.
        
    3. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[InvalidStateError](https://heycam.github.io/webidl/#invalidstateerror)`" and terminate this algorithm.
        
    
    Note: This error status is handled separately because the authenticator returns it only if excludeCredentialDescriptorList identifies a credential [bound](#bound-credential) to the authenticator and the user has [consented](#user-consent) to the operation. Given this explicit consent, it is acceptable for this case to be distinguishable to the [Relying Party](#relying-party).
    
    If any authenticator returns an error status not equivalent to "`[InvalidStateError](https://heycam.github.io/webidl/#invalidstateerror)`",
    
    [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
    
    Note: This case does not imply [user consent](#user-consent) for the operation, so details about the error are hidden from the [Relying Party](#relying-party) in order to prevent leak of potentially identifying information. See [§ 14.5.1 Registration Ceremony Privacy](#sctn-make-credential-privacy) for details.
    
    If any authenticator indicates success,
    
    1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. This authenticator is now the selected authenticator.
        
    2. Let credentialCreationData be a [struct](https://infra.spec.whatwg.org/#struct) whose [items](https://infra.spec.whatwg.org/#struct-item) are:
        
        `attestationObjectResult`
        
        whose value is the bytes returned from the successful [authenticatorMakeCredential](#authenticatormakecredential) operation.
        
        Note: this value is `attObj`, as defined in [§ 6.5.4 Generating an Attestation Object](#sctn-generating-an-attestation-object).
        
        `clientDataJSONResult`
        
        whose value is the bytes of clientDataJSON.
        
        `attestationConveyancePreferenceOption`
        
        whose value is the value of options.`[attestation](#dom-publickeycredentialcreationoptions-attestation)`.
        
        `clientExtensionResults`
        
        whose value is an `[AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs)` object containing [extension identifier](#extension-identifier) → [client extension output](#client-extension-output) entries. The entries are created by running each extension’s [client extension processing](#client-extension-processing) algorithm to create the [client extension outputs](#client-extension-output), for each [client extension](#client-extension) in `` options.`[extensions](#dom-publickeycredentialcreationoptions-extensions)` ``.
        
    3. Let constructCredentialAlg be an algorithm that takes a [global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-global) global, and whose steps are:
        
        1. If `credentialCreationData.[attestationConveyancePreferenceOption](#credentialcreationdata-attestationconveyancepreferenceoption)`’s value is
            
            "none"
            
            Replace potentially uniquely identifying information with non-identifying versions of the same:
            
            1. If the [AAGUID](#aaguid) in the [attested credential data](#attested-credential-data) is 16 zero bytes, `credentialCreationData.[attestationObjectResult](#credentialcreationdata-attestationobjectresult).fmt` is "packed", and "x5c" is absent from `credentialCreationData.[attestationObjectResult](#credentialcreationdata-attestationobjectresult)`, then [self attestation](#self-attestation) is being used and no further action is needed.
                
            2. Otherwise
                
                1. Replace the [AAGUID](#aaguid) in the [attested credential data](#attested-credential-data) with 16 zero bytes.
                    
                2. Set the value of `credentialCreationData.[attestationObjectResult](#credentialcreationdata-attestationobjectresult).fmt` to "none", and set the value of `credentialCreationData.[attestationObjectResult](#credentialcreationdata-attestationobjectresult).attStmt` to be an empty [CBOR](#cbor) map. (See [§ 8.7 None Attestation Statement Format](#sctn-none-attestation) and [§ 6.5.4 Generating an Attestation Object](#sctn-generating-an-attestation-object)).
                    
            
            "indirect"
            
            The client MAY replace the [AAGUID](#aaguid) and [attestation statement](#attestation-statement) with a more privacy-friendly and/or more easily verifiable version of the same data (for example, by employing an [Anonymization CA](#anonymization-ca)).
            
            "direct" or "enterprise"
            
            Convey the [authenticator](#authenticator)'s [AAGUID](#aaguid) and [attestation statement](#attestation-statement), unaltered, to the [Relying Party](#relying-party).
            
        2. Let attestationObject be a new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `credentialCreationData.[attestationObjectResult](#credentialcreationdata-attestationobjectresult)`’s value.
            
        3. Let id be `attestationObject.authData.[attestedCredentialData](#attestedcredentialdata).[credentialId](#credentialid)`.
            
        4. Let pubKeyCred be a new `[PublicKeyCredential](#publickeycredential)` object associated with global whose fields are:
            
            `[[[identifier]]](#dom-publickeycredential-identifier-slot)`
            
            id
            
            `[response](#dom-publickeycredential-response)`
            
            A new `[AuthenticatorAttestationResponse](#authenticatorattestationresponse)` object associated with global whose fields are:
            
            `[clientDataJSON](#dom-authenticatorresponse-clientdatajson)`
            
            A new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `credentialCreationData.[clientDataJSONResult](#credentialcreationdata-clientdatajsonresult)`.
            
            `[attestationObject](#dom-authenticatorattestationresponse-attestationobject)`
            
            attestationObject
            
            `[[[transports]]](#dom-authenticatorattestationresponse-transports-slot)`
            
            A sequence of zero or more unique `[DOMString](https://heycam.github.io/webidl/#idl-DOMString)`s, in lexicographical order, that the authenticator is believed to support. The values SHOULD be members of `[AuthenticatorTransport](#enumdef-authenticatortransport)`, but [client platforms](#client-platform) MUST ignore unknown values.
            
            If a user agent does not wish to divulge this information it MAY substitute an arbitrary sequence designed to preserve privacy. This sequence MUST still be valid, i.e. lexicographically sorted and free of duplicates. For example, it may use the empty sequence. Either way, in this case the user agent takes the risk that [Relying Party](#relying-party) behavior may be suboptimal.
            
            If the user agent does not have any transport information, it SHOULD set this field to the empty sequence.
            
            Note: How user agents discover transports supported by a given [authenticator](#authenticator) is outside the scope of this specification, but may include information from an [attestation certificate](#attestation-certificate) (for example [[FIDO-Transports-Ext]](#biblio-fido-transports-ext)), metadata communicated in an [authenticator](#authenticator) protocol such as CTAP2, or special-case knowledge about a [platform authenticator](#platform-authenticators).
            
            `[[[clientExtensionsResults]]](#dom-publickeycredential-clientextensionsresults-slot)`
            
            A new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `credentialCreationData.[clientExtensionResults](#credentialcreationdata-clientextensionresults)`.
            
        5. Return pubKeyCred.
            
    4. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.
        
    5. Return constructCredentialAlg and terminate this algorithm.
        
    
21. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`". In order to prevent information leak that could identify the user without [consent](#user-consent), this step MUST NOT be executed before lifetimeTimer has expired. See [§ 14.5.1 Registration Ceremony Privacy](#sctn-make-credential-privacy) for details.
    

During the above process, the user agent SHOULD show some UI to the user to guide them in the process of selecting and authorizing an authenticator.

#### 5.1.4. Use an Existing Credential to Make an Assertion - PublicKeyCredential’s `[[Get]](options)` Method[](#sctn-getAssertion)

[WebAuthn Relying Parties](#webauthn-relying-party) call `[navigator.credentials.get({publicKey:..., ...})](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` to discover and use an existing [public key credential](#public-key-credential), with the [user’s consent](#user-consent). [Relying Party](#relying-party) script optionally specifies some criteria to indicate what [credential sources](https://w3c.github.io/webappsec-credential-management/#credential-source) are acceptable to it. The [client platform](#client-platform) locates [credential sources](https://w3c.github.io/webappsec-credential-management/#credential-source) matching the specified criteria, and guides the user to pick one that the script will be allowed to use. The user may choose to decline the entire interaction even if a [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source) is present, for example to maintain privacy. If the user picks a [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source), the user agent then uses [§ 6.3.3 The authenticatorGetAssertion Operation](#sctn-op-get-assertion) to sign a [Relying Party](#relying-party)-provided challenge and other collected data into an assertion, which is used as a [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential).

The `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` implementation [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1) calls `` PublicKeyCredential.`[[[CollectFromCredentialStore]]()](#dom-publickeycredential-collectfromcredentialstore-slot)` `` to collect any [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential) that should be available without [user mediation](https://w3c.github.io/webappsec-credential-management/#user-mediated) (roughly, this specification’s [authorization gesture](#authorization-gesture)), and if it does not find exactly one of those, it then calls `` PublicKeyCredential.`[[[DiscoverFromExternalSource]]()](#dom-publickeycredential-discoverfromexternalsource-slot)` `` to have the user select a [credential source](https://w3c.github.io/webappsec-credential-management/#credential-source).

Since this specification requires an [authorization gesture](#authorization-gesture) to create any [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential), the `` PublicKeyCredential.`[[CollectFromCredentialStore]](origin, options, sameOriginWithAncestors)` `` [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) inherits the default behavior of `[Credential.[[CollectFromCredentialStore]]()](https://w3c.github.io/webappsec-credential-management/#collectfromcredentialstore-origin-options-sameoriginwithancestors)`, of returning an empty set.

This `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` operation can be aborted by leveraging the `[AbortController](https://dom.spec.whatwg.org/#abortcontroller)`; see [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) for detailed instructions.

##### 5.1.4.1. PublicKeyCredential’s `` `[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)` `` Method[](#sctn-discover-from-external-source)

This [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) accepts three arguments:

`origin`

This argument is the [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin), as determined by the calling `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` implementation, i.e., `[CredentialsContainer](https://w3c.github.io/webappsec-credential-management/#credentialscontainer)`'s [Request a `Credential`](https://w3c.github.io/webappsec-credential-management/#abstract-opdef-request-a-credential) abstract operation.

`options`[](#dom-publickeycredential-discoverfromexternalsource-origin-options-sameoriginwithancestors-options)

This argument is a `[CredentialRequestOptions](https://w3c.github.io/webappsec-credential-management/#dictdef-credentialrequestoptions)` object whose `` options.`[publicKey](#dom-credentialrequestoptions-publickey)` `` member contains a `[PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)` object specifying the desired attributes of the [public key credential](#public-key-credential) to discover.

`sameOriginWithAncestors`

This argument is a Boolean value which is `true` if and only if the caller’s [environment settings object](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object) is [same-origin with its ancestors](https://w3c.github.io/webappsec-credential-management/#same-origin-with-its-ancestors). It is `false` if caller is cross-origin.

Note: Invocation of this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) indicates that it was allowed by [permissions policy](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy), which is evaluated at the [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1) level. See [§ 5.9 Permissions Policy integration](#sctn-permissions-policy).

Note: **This algorithm is synchronous:** the `[Promise](https://heycam.github.io/webidl/#idl-promise)` resolution/rejection is handled by `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`.

Note: All `[BufferSource](https://heycam.github.io/webidl/#BufferSource)` objects used in this algorithm must be snapshotted when the algorithm begins, to avoid potential synchronization issues. The algorithm implementations should [get a copy of the bytes held by the buffer source](https://heycam.github.io/webidl#dfn-get-buffer-source-reference) and use that copy for relevant portions of the algorithm.

When this method is invoked, the user agent MUST execute the following algorithm:

1. Assert: `` options.`[publicKey](#dom-credentialrequestoptions-publickey)` `` is present.
    
2. Let options be the value of `` options.`[publicKey](#dom-credentialrequestoptions-publickey)` ``.
    
3. If the `[timeout](#dom-publickeycredentialrequestoptions-timeout)` member of options is present, check if its value lies within a reasonable range as defined by the [client](#client) and if not, correct it to the closest value lying within that range. Set a timer lifetimeTimer to this adjusted value. If the `[timeout](#dom-publickeycredentialrequestoptions-timeout)` member of options is not present, then set lifetimeTimer to a [client](#client)-specific default.
    
    Recommended ranges and defaults for the `[timeout](#dom-publickeycredentialrequestoptions-timeout)` member of options are as follows. If `` options.`[userVerification](#dom-publickeycredentialrequestoptions-userverification)` ``
    
    is set to `[discouraged](#dom-userverificationrequirement-discouraged)`
    
    Recommended range: 30000 milliseconds to 180000 milliseconds.
    
    Recommended default value: 120000 milliseconds (2 minutes).
    
    is set to `[required](#dom-userverificationrequirement-required)` or `[preferred](#dom-userverificationrequirement-preferred)`
    
    Recommended range: 30000 milliseconds to 600000 milliseconds.
    
    Recommended default value: 300000 milliseconds (5 minutes).
    
    Note: The user agent should take cognitive guidelines into considerations regarding timeout for users with special needs.
    
4. Let callerOrigin be `[origin](#dom-publickeycredential-discoverfromexternalsource-origin-options-sameoriginwithancestors-origin)`. If callerOrigin is an [opaque origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque), return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`", and terminate this algorithm.
    
5. Let effectiveDomain be the callerOrigin’s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). If [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) is not a [valid domain](https://url.spec.whatwg.org/#valid-domain), then return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[SecurityError](https://heycam.github.io/webidl/#securityerror)`" and terminate this algorithm.
    
    Note: An [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) may resolve to a [host](https://url.spec.whatwg.org/#concept-url-host), which can be represented in various manners, such as [domain](https://url.spec.whatwg.org/#concept-domain), [ipv4 address](https://url.spec.whatwg.org/#concept-ipv4), [ipv6 address](https://url.spec.whatwg.org/#concept-ipv6), [opaque host](https://url.spec.whatwg.org/#opaque-host), or [empty host](https://url.spec.whatwg.org/#empty-host). Only the [domain](https://url.spec.whatwg.org/#concept-domain) format of [host](https://url.spec.whatwg.org/#concept-url-host) is allowed here. This is for simplification and also is in recognition of various issues with using direct IP address identification in concert with PKI-based security.
    
6. [](#GetAssn-DetermineRpId)If options.`[rpId](#dom-publickeycredentialrequestoptions-rpid)` is not present, then set rpId to effectiveDomain.
    
    Otherwise:
    
    1. If options.`[rpId](#dom-publickeycredentialrequestoptions-rpid)` [is not a registrable domain suffix of and is not equal to](https://html.spec.whatwg.org/multipage/origin.html#is-a-registrable-domain-suffix-of-or-is-equal-to) effectiveDomain, return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[SecurityError](https://heycam.github.io/webidl/#securityerror)`", and terminate this algorithm.
        
    2. Set rpId to options.`[rpId](#dom-publickeycredentialrequestoptions-rpid)`.
        
        Note: rpId represents the caller’s [RP ID](#rp-id). The [RP ID](#rp-id) defaults to being the caller’s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain) unless the caller has explicitly set options.`[rpId](#dom-publickeycredentialrequestoptions-rpid)` when calling `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`.
        
7. Let clientExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map) and let authenticatorExtensions be a new [map](https://infra.spec.whatwg.org/#ordered-map).
    
8. If the `[extensions](#dom-publickeycredentialrequestoptions-extensions)` member of options is present, then [for each](https://infra.spec.whatwg.org/#map-iterate) extensionId → clientExtensionInput of `` options.`[extensions](#dom-publickeycredentialrequestoptions-extensions)` ``:
    
    1. If extensionId is not supported by this [client platform](#client-platform) or is not an [authentication extension](#authentication-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    2. [Set](https://infra.spec.whatwg.org/#map-set) clientExtensions[extensionId] to clientExtensionInput.
        
    3. If extensionId is not an [authenticator extension](#authenticator-extension), then [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    4. Let authenticatorExtensionInput be the ([CBOR](#cbor)) result of running extensionId’s [client extension processing](#client-extension-processing) algorithm on clientExtensionInput. If the algorithm returned an error, [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    5. [Set](https://infra.spec.whatwg.org/#map-set) authenticatorExtensions[extensionId] to the [base64url encoding](#base64url-encoding) of authenticatorExtensionInput.
        
9. Let collectedClientData be a new `[CollectedClientData](#dictdef-collectedclientdata)` instance whose fields are:
    
    `[type](#dom-collectedclientdata-type)`
    
    The string "webauthn.get".
    
    `[challenge](#dom-collectedclientdata-challenge)`
    
    The [base64url encoding](#base64url-encoding) of options.`[challenge](#dom-publickeycredentialrequestoptions-challenge)`
    
    `[origin](#dom-collectedclientdata-origin)`
    
    The [serialization of](https://html.spec.whatwg.org/multipage/origin.html#ascii-serialisation-of-an-origin) callerOrigin.
    
    `[crossOrigin](#dom-collectedclientdata-crossorigin)`
    
    The inverse of the value of the `[sameOriginWithAncestors](#dom-publickeycredential-discoverfromexternalsource-origin-options-sameoriginwithancestors-sameoriginwithancestors)` argument passed to this [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots).
    
    `[tokenBinding](#dom-collectedclientdata-tokenbinding)`
    
    The status of [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) between the client and the callerOrigin, as well as the [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) associated with callerOrigin, if one is available.
    
10. Let clientDataJSON be the [JSON-compatible serialization of client data](#collectedclientdata-json-compatible-serialization-of-client-data) constructed from collectedClientData.
    
11. Let clientDataHash be the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data) represented by clientDataJSON.
    
12. If the `` options.`[signal](https://w3c.github.io/webappsec-credential-management/#dom-credentialrequestoptions-signal)` `` is present and its [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`, return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[AbortError](https://heycam.github.io/webidl/#aborterror)`" and terminate this algorithm.
    
13. Let issuedRequests be a new [ordered set](https://infra.spec.whatwg.org/#ordered-set).
    
14. Let savedCredentialIds be a new [map](https://infra.spec.whatwg.org/#ordered-map).
    
15. Let authenticators represent a value which at any given instant is a [set](https://infra.spec.whatwg.org/#ordered-set) of [client platform](#client-platform)-specific handles, where each [item](https://infra.spec.whatwg.org/#list-item) identifies an [authenticator](#authenticator) presently available on this [client platform](#client-platform) at that instant.
    
    Note: What qualifies an [authenticator](#authenticator) as "available" is intentionally unspecified; this is meant to represent how [authenticators](#authenticator) can be [hot-plugged](https://en.wikipedia.org/w/index.php?title=Hot_plug) into (e.g., via USB) or discovered (e.g., via NFC or Bluetooth) by the [client](#client) by various mechanisms, or permanently built into the [client](#client).
    
16. Start lifetimeTimer.
    
17. [While](https://infra.spec.whatwg.org/#iteration-while) lifetimeTimer has not expired, perform the following actions depending upon lifetimeTimer, and the state and response [for each](https://infra.spec.whatwg.org/#list-iterate) authenticator in authenticators:
    
    If lifetimeTimer expires,
    
    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
    
    If the user exercises a user agent user-interface option to cancel the process,
    
    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`".
    
    If the `[signal](https://w3c.github.io/webappsec-credential-management/#dom-credentialrequestoptions-signal)` member is present and the [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set to `true`,
    
    [For each](https://infra.spec.whatwg.org/#list-iterate) authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests. Then return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[AbortError](https://heycam.github.io/webidl/#aborterror)`" and terminate this algorithm.
    
    If issuedRequests is empty, `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` `` is not empty, and no authenticator will become available for any [public key credentials](#public-key-credential) therein,
    
    Indicate to the user that no eligible credential could be found. When the user acknowledges the dialog, return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`".
    
    Note: One way a [client platform](#client-platform) can determine that no authenticator will become available is by examining the `` `[transports](#dom-publickeycredentialdescriptor-transports)` `` members of the present `` `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)` `` [items](https://infra.spec.whatwg.org/#list-item) of `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` ``, if any. For example, if all `` `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)` `` [items](https://infra.spec.whatwg.org/#list-item) list only `` `[internal](#dom-authenticatortransport-internal)` ``, but all [platform](#platform-authenticators) authenticators have been tried, then there is no possibility of satisfying the request. Alternatively, all `` `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)` `` [items](https://infra.spec.whatwg.org/#list-item) may list `` `[transports](#dom-publickeycredentialdescriptor-transports)` `` that the [client platform](#client-platform) does not support.
    
    If an authenticator becomes available on this [client device](#client-device),
    
    Note: This includes the case where an authenticator was available upon lifetimeTimer initiation.
    
    1. If `` options.`[userVerification](#dom-publickeycredentialrequestoptions-userverification)` `` is set to `[required](#dom-userverificationrequirement-required)` and the authenticator is not capable of performing [user verification](#user-verification), [continue](https://infra.spec.whatwg.org/#iteration-continue).
        
    2. Let userVerification be the effective user verification requirement for assertion, a Boolean value, as follows. If `` options.`[userVerification](#dom-publickeycredentialrequestoptions-userverification)` ``
        
        is set to `[required](#dom-userverificationrequirement-required)`
        
        Let userVerification be `true`.
        
        is set to `[preferred](#dom-userverificationrequirement-preferred)`
        
        If the authenticator
        
        is capable of [user verification](#user-verification)
        
        Let userVerification be `true`.
        
        is not capable of [user verification](#user-verification)
        
        Let userVerification be `false`.
        
        is set to `[discouraged](#dom-userverificationrequirement-discouraged)`
        
        Let userVerification be `false`.
        
    3. If `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` ``
        
        [is not empty](https://infra.spec.whatwg.org/#list-is-empty)
        
        1. Let allowCredentialDescriptorList be a new [list](https://infra.spec.whatwg.org/#list).
            
        2. Execute a [client platform](#client-platform)-specific procedure to determine which, if any, [public key credentials](#public-key-credential) described by `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` `` are [bound](#bound-credential) to this authenticator, by matching with rpId, `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)`.`[id](#dom-publickeycredentialdescriptor-id)` ``, and `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)`.`[type](#dom-publickeycredentialdescriptor-type)` ``. Set allowCredentialDescriptorList to this filtered list.
            
        3. If allowCredentialDescriptorList [is empty](https://infra.spec.whatwg.org/#list-is-empty), [continue](https://infra.spec.whatwg.org/#iteration-continue).
            
        4. Let distinctTransports be a new [ordered set](https://infra.spec.whatwg.org/#ordered-set).
            
        5. If allowCredentialDescriptorList has exactly one value, set `savedCredentialIds[authenticator]` to `allowCredentialDescriptorList[0].id`’s value (see [here](#authenticatorGetAssertion-return-values) in [§ 6.3.3 The authenticatorGetAssertion Operation](#sctn-op-get-assertion) for more information).
            
        6. [For each](https://infra.spec.whatwg.org/#list-iterate) credential descriptor C in allowCredentialDescriptorList, [append](https://infra.spec.whatwg.org/#set-append) each value, if any, of `` C.`[transports](#dom-publickeycredentialdescriptor-transports)` `` to distinctTransports.
            
            Note: This will aggregate only distinct values of `[transports](#dom-publickeycredentialdescriptor-transports)` (for this [authenticator](#authenticator)) in distinctTransports due to the properties of [ordered sets](https://infra.spec.whatwg.org/#ordered-set).
            
        7. If distinctTransports
            
            [is not empty](https://infra.spec.whatwg.org/#list-is-empty)
            
            The client selects one transport value from distinctTransports, possibly incorporating local configuration knowledge of the appropriate transport to use with authenticator in making its selection.
            
            Then, using transport, invoke the [authenticatorGetAssertion](#authenticatorgetassertion) operation on authenticator, with rpId, clientDataHash, allowCredentialDescriptorList, userVerification, and authenticatorExtensions as parameters.
            
            [is empty](https://infra.spec.whatwg.org/#list-is-empty)
            
            Using local configuration knowledge of the appropriate transport to use with authenticator, invoke the [authenticatorGetAssertion](#authenticatorgetassertion) operation on authenticator with rpId, clientDataHash, allowCredentialDescriptorList, userVerification, and authenticatorExtensions as parameters.
            
        
        [is empty](https://infra.spec.whatwg.org/#list-is-empty)
        
        Using local configuration knowledge of the appropriate transport to use with authenticator, invoke the [authenticatorGetAssertion](#authenticatorgetassertion) operation on authenticator with rpId, clientDataHash, userVerification and authenticatorExtensions as parameters.
        
        Note: In this case, the [Relying Party](#relying-party) did not supply a list of acceptable credential descriptors. Thus, the authenticator is being asked to exercise any credential it may possess that is [scoped](#scope) to the [Relying Party](#relying-party), as identified by rpId.
        
    4. [Append](https://infra.spec.whatwg.org/#set-append) authenticator to issuedRequests.
        
    
    If an authenticator ceases to be available on this [client device](#client-device),
    
    [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
    
    If any authenticator returns a status indicating that the user cancelled the operation,
    
    1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
        
    2. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.
        
        Note: [Authenticators](#authenticator) may return an indication of "the user cancelled the entire operation". How a user agent manifests this state to users is unspecified.
        
    
    If any authenticator returns an error status,
    
    [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
    
    If any authenticator indicates success,
    
    1. [Remove](https://infra.spec.whatwg.org/#list-remove) authenticator from issuedRequests.
        
    2. Let assertionCreationData be a [struct](https://infra.spec.whatwg.org/#struct) whose [items](https://infra.spec.whatwg.org/#struct-item) are:
        
        `credentialIdResult`
        
        If `savedCredentialIds[authenticator]` exists, set the value of [credentialIdResult](#assertioncreationdata-credentialidresult) to be the bytes of `savedCredentialIds[authenticator]`. Otherwise, set the value of [credentialIdResult](#assertioncreationdata-credentialidresult) to be the bytes of the [credential ID](#credential-id) returned from the successful [authenticatorGetAssertion](#authenticatorgetassertion) operation, as defined in [§ 6.3.3 The authenticatorGetAssertion Operation](#sctn-op-get-assertion).
        
        `clientDataJSONResult`
        
        whose value is the bytes of clientDataJSON.
        
        `authenticatorDataResult`
        
        whose value is the bytes of the [authenticator data](#authenticator-data) returned by the [authenticator](#authenticator).
        
        `signatureResult`
        
        whose value is the bytes of the signature value returned by the [authenticator](#authenticator).
        
        `userHandleResult`
        
        If the [authenticator](#authenticator) returned a [user handle](#user-handle), set the value of [userHandleResult](#assertioncreationdata-userhandleresult) to be the bytes of the returned [user handle](#user-handle). Otherwise, set the value of [userHandleResult](#assertioncreationdata-userhandleresult) to null.
        
        `clientExtensionResults`
        
        whose value is an `[AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs)` object containing [extension identifier](#extension-identifier) → [client extension output](#client-extension-output) entries. The entries are created by running each extension’s [client extension processing](#client-extension-processing) algorithm to create the [client extension outputs](#client-extension-output), for each [client extension](#client-extension) in `` options.`[extensions](#dom-publickeycredentialrequestoptions-extensions)` ``.
        
    3. Let constructAssertionAlg be an algorithm that takes a [global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-global) global, and whose steps are:
        
        1. Let pubKeyCred be a new `[PublicKeyCredential](#publickeycredential)` object associated with global whose fields are:
            
            `[[[identifier]]](#dom-publickeycredential-identifier-slot)`
            
            A new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.[credentialIdResult](#assertioncreationdata-credentialidresult)`.
            
            `[response](#dom-publickeycredential-response)`
            
            A new `[AuthenticatorAssertionResponse](#authenticatorassertionresponse)` object associated with global whose fields are:
            
            `[clientDataJSON](#dom-authenticatorresponse-clientdatajson)`
            
            A new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.[clientDataJSONResult](#assertioncreationdata-clientdatajsonresult)`.
            
            `[authenticatorData](#dom-authenticatorassertionresponse-authenticatordata)`
            
            A new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.[authenticatorDataResult](#assertioncreationdata-authenticatordataresult)`.
            
            `[signature](#dom-authenticatorassertionresponse-signature)`
            
            A new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.[signatureResult](#assertioncreationdata-signatureresult)`.
            
            `[userHandle](#dom-authenticatorassertionresponse-userhandle)`
            
            If `assertionCreationData.[userHandleResult](#assertioncreationdata-userhandleresult)` is null, set this field to null. Otherwise, set this field to a new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.[userHandleResult](#assertioncreationdata-userhandleresult)`.
            
            `[[[clientExtensionsResults]]](#dom-publickeycredential-clientextensionsresults-slot)`
            
            A new `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)`, created using global’s [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), containing the bytes of `assertionCreationData.[clientExtensionResults](#assertioncreationdata-clientextensionresults)`.
            
        2. Return pubKeyCred.
            
    4. [For each](https://infra.spec.whatwg.org/#list-iterate) remaining authenticator in issuedRequests invoke the [authenticatorCancel](#authenticatorcancel) operation on authenticator and [remove](https://infra.spec.whatwg.org/#list-remove) it from issuedRequests.
        
    5. Return constructAssertionAlg and terminate this algorithm.
        
    
18. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`". In order to prevent information leak that could identify the user without [consent](#user-consent), this step MUST NOT be executed before lifetimeTimer has expired. See [§ 14.5.2 Authentication Ceremony Privacy](#sctn-assertion-privacy) for details.
    

During the above process, the user agent SHOULD show some UI to the user to guide them in the process of selecting and authorizing an authenticator with which to complete the operation.

#### 5.1.5. Store an Existing Credential - PublicKeyCredential’s `[[Store]](credential, sameOriginWithAncestors)` Method[](#sctn-storeCredential)

#### 5.1.6. Preventing Silent Access to an Existing Credential - PublicKeyCredential’s `[[preventSilentAccess]](credential, sameOriginWithAncestors)` Method[](#sctn-preventSilentAccessCredential)

Calling the `[[preventSilentAccess]](credential, sameOriginWithAncestors)`[](#dom-publickeycredential-preventsilentaccess-slot) method will have no effect on authenticators that require an [authorization gesture](#authorization-gesture), but setting that flag may potentially exclude authenticators that can operate without user intervention.

This [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) accepts no arguments.

#### 5.1.7. Availability of [User-Verifying Platform Authenticator](#user-verifying-platform-authenticator) - PublicKeyCredential’s `isUserVerifyingPlatformAuthenticatorAvailable()` Method[](#sctn-isUserVerifyingPlatformAuthenticatorAvailable)

[WebAuthn Relying Parties](#webauthn-relying-party) use this method to determine whether they can create a new credential using a [user-verifying platform authenticator](#user-verifying-platform-authenticator). Upon invocation, the [client](#client) employs a [client platform](#client-platform)-specific procedure to discover available [user-verifying platform authenticators](#user-verifying-platform-authenticator). If any are discovered, the promise is resolved with the value of `true`. Otherwise, the promise is resolved with the value of `false`. Based on the result, the [Relying Party](#relying-party) can take further actions to guide the user to create a credential.

This method has no arguments and returns a Boolean value.

partial interface [PublicKeyCredential](#publickeycredential) {
    static [Promise](https://heycam.github.io/webidl/#idl-promise)<[boolean](https://heycam.github.io/webidl/#idl-boolean)> `isUserVerifyingPlatformAuthenticatorAvailable`[](#dom-publickeycredential-isuserverifyingplatformauthenticatoravailable)();
};

Note: Invoking this method from a [browsing context](https://html.spec.whatwg.org/multipage/browsers.html#browsing-context) where the [Web Authentication API](#web-authentication-api) is "disabled" according to the [allowed to use](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#allowed-to-use) algorithm—i.e., by a [permissions policy](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy)—will result in the promise being rejected with a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`". See also [§ 5.9 Permissions Policy integration](#sctn-permissions-policy).

### 5.2. Authenticator Responses (interface `AuthenticatorResponse`)[](#iface-authenticatorresponse)

[AuthenticatorResponse](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse "The AuthenticatorResponse interface of the Web Authentication API is the base interface for interfaces that provide a cryptographic root of trust for a key pair. The child interfaces include information from the browser such as the challenge origin and either may be returned from PublicKeyCredential.response.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

[Authenticators](#authenticator) respond to [Relying Party](#relying-party) requests by returning an object derived from the `[AuthenticatorResponse](#authenticatorresponse)` interface:

[[SecureContext](https://heycam.github.io/webidl/#SecureContext), [Exposed](https://heycam.github.io/webidl/#Exposed)=Window]
interface [AuthenticatorResponse](#authenticatorresponse) {
    [[SameObject](https://heycam.github.io/webidl/#SameObject)] readonly attribute [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)      [clientDataJSON](#dom-authenticatorresponse-clientdatajson);
};

[AuthenticatorResponse/clientDataJSON](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse/clientDataJSON "The clientDataJSON property of the AuthenticatorResponse interface stores a JSON string in an ArrayBuffer, representing the client data that was passed to CredentialsContainer.create() or CredentialsContainer.get(). This property is only accessed on one of the child objects of AuthenticatorResponse, specifically AuthenticatorAttestationResponse or AuthenticatorAssertionResponse.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`clientDataJSON`, of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains a [JSON-compatible serialization](#clientdatajson-serialization) of the [client data](#client-data), the [hash of which](#collectedclientdata-hash-of-the-serialized-client-data) is passed to the authenticator by the client in its call to either `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` or `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` (i.e., the [client data](#client-data) itself is not sent to the authenticator).

#### 5.2.1. Information About Public Key Credential (interface `AuthenticatorAttestationResponse`)[](#iface-authenticatorattestationresponse)

[AuthenticatorAttestationResponse](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse "The AuthenticatorAttestationResponse interface of the Web Authentication API is returned by CredentialsContainer.create() when a PublicKeyCredential is passed, and provides a cryptographic root of trust for the new key pair that has been generated. This response should be sent to the relying party's server to complete the creation of the credential.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung Internet10.0+Opera MobileNone

The `[AuthenticatorAttestationResponse](#authenticatorattestationresponse)` interface represents the [authenticator](#authenticator)'s response to a client’s request for the creation of a new [public key credential](#public-key-credential). It contains information about the new credential that can be used to identify it for later use, and metadata that can be used by the [WebAuthn Relying Party](#webauthn-relying-party) to assess the characteristics of the credential during registration.

[AuthenticatorAttestationResponse/getTransports](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse/getTransports "getTransports() is a method of the AuthenticatorAttestationResponse interface that returns an Array containing strings describing the different transports which may be used by the authenticator.")

In no current engines.

FirefoxNoneSafariNoneChromeNone

---

OperaNoneEdgeNone

---

Edge (Legacy)NoneIENone

---

Firefox for AndroidNoneiOS SafariNoneChrome for AndroidNoneAndroid WebViewNoneSamsung InternetNoneOpera MobileNone

[[SecureContext](https://heycam.github.io/webidl/#SecureContext), [Exposed](https://heycam.github.io/webidl/#Exposed)=Window]
interface [AuthenticatorAttestationResponse](#authenticatorattestationresponse) : [AuthenticatorResponse](#authenticatorresponse) {
    [[SameObject](https://heycam.github.io/webidl/#SameObject)] readonly attribute [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)      [attestationObject](#dom-authenticatorattestationresponse-attestationobject);
    [sequence](https://heycam.github.io/webidl/#idl-sequence)<[DOMString](https://heycam.github.io/webidl/#idl-DOMString)>                              `getTransports`();
    [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)                                      `getAuthenticatorData`();
    [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)?                                     `getPublicKey`();
    [COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)                          `getPublicKeyAlgorithm`();
};

`[clientDataJSON](#dom-authenticatorresponse-clientdatajson)`

This attribute, inherited from `[AuthenticatorResponse](#authenticatorresponse)`, contains the [JSON-compatible serialization of client data](#collectedclientdata-json-compatible-serialization-of-client-data) (see [§ 6.5 Attestation](#sctn-attestation)) passed to the authenticator by the client in order to generate this credential. The exact JSON serialization MUST be preserved, as the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data) has been computed over it.

[AuthenticatorAttestationResponse/attestationObject](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse/attestationObject "The attestationObject property of the AuthenticatorAttestationResponse interface returns an ArrayBuffer containing the new public key, as well as signature over the entire attestationObject with a private key that is stored in the authenticator when it is manufactured.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung Internet10.0+Opera MobileNone

`attestationObject`, of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains an [attestation object](#attestation-object), which is opaque to, and cryptographically protected against tampering by, the client. The [attestation object](#attestation-object) contains both [authenticator data](#authenticator-data) and an [attestation statement](#attestation-statement). The former contains the AAGUID, a unique [credential ID](#credential-id), and the [credential public key](#credential-public-key). The contents of the [attestation statement](#attestation-statement) are determined by the [attestation statement format](#attestation-statement-format) used by the [authenticator](#authenticator). It also contains any additional information that the [Relying Party](#relying-party)'s server requires to validate the [attestation statement](#attestation-statement), as well as to decode and validate the [authenticator data](#authenticator-data) along with the [JSON-compatible serialization of client data](#collectedclientdata-json-compatible-serialization-of-client-data). For more details, see [§ 6.5 Attestation](#sctn-attestation), [§ 6.5.4 Generating an Attestation Object](#sctn-generating-an-attestation-object), and [Figure 6](#fig-attStructs).

`[getTransports()](#dom-authenticatorattestationresponse-gettransports)`

This operation returns the value of `[[[transports]]](#dom-authenticatorattestationresponse-transports-slot)`.

`[getAuthenticatorData()](#dom-authenticatorattestationresponse-getauthenticatordata)`

This operation returns the [authenticator data](#authenticator-data) contained within `[attestationObject](#dom-authenticatorattestationresponse-attestationobject)`. See [§ 5.2.1.1 Easily accessing credential data](#sctn-public-key-easy).

`[getPublicKey()](#dom-authenticatorattestationresponse-getpublickey)`

This operation returns the DER [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7) of the new credential, or null if this is not available. See [§ 5.2.1.1 Easily accessing credential data](#sctn-public-key-easy).

`[getPublicKeyAlgorithm()](#dom-authenticatorattestationresponse-getpublickeyalgorithm)`

This operation returns the `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)` of the new credential. See [§ 5.2.1.1 Easily accessing credential data](#sctn-public-key-easy).

`[[transports]]`

This [internal slot](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) contains a sequence of zero or more unique `[DOMString](https://heycam.github.io/webidl/#idl-DOMString)`s in lexicographical order. These values are the transports that the [authenticator](#authenticator) is believed to support, or an empty sequence if the information is unavailable. The values SHOULD be members of `[AuthenticatorTransport](#enumdef-authenticatortransport)` but [Relying Parties](#relying-party) MUST ignore unknown values.

##### 5.2.1.1. Easily accessing credential data[](#sctn-public-key-easy)

Every user of the `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` method will need to parse and store the returned [credential public key](#credential-public-key) in order to verify future [authentication assertions](#authentication-assertion). However, the [credential public key](#credential-public-key) is in [[RFC8152]](#biblio-rfc8152) (COSE) format, inside the [credentialPublicKey](#credentialpublickey) member of the [attestedCredentialData](#attestedcredentialdata), inside the [authenticator data](#authenticator-data), inside the [attestation object](#attestation-object) conveyed by `[AuthenticatorAttestationResponse](#authenticatorattestationresponse)`.`[attestationObject](#dom-authenticatorattestationresponse-attestationobject)`. [Relying Parties](#relying-party) wishing to use [attestation](#attestation) are obliged to do the work of parsing the `[attestationObject](#dom-authenticatorattestationresponse-attestationobject)` and obtaining the [credential public key](#credential-public-key) because that public key copy is the one the [authenticator](#authenticator) [signed](#signing-procedure). However, many valid WebAuthn use cases do not require [attestation](#attestation). For those uses, user agents can do the work of parsing, expose the [authenticator data](#authenticator-data) directly, and translate the [credential public key](#credential-public-key) into a more convenient format.

The `[getPublicKey()](#dom-authenticatorattestationresponse-getpublickey)` operation thus returns the [credential public key](#credential-public-key) as a [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7). This `[ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)` can, for example, be passed to Java’s `java.security.spec.X509EncodedKeySpec`, .NET’s `System.Security.Cryptography.ECDsa.ImportSubjectPublicKeyInfo`, or Go’s `crypto/x509.ParsePKIXPublicKey`.

Use of `[getPublicKey()](#dom-authenticatorattestationresponse-getpublickey)` does impose some limitations: by using `[pubKeyCredParams](#dom-publickeycredentialcreationoptions-pubkeycredparams)`, a [Relying Party](#relying-party) can negotiate with the [authenticator](#authenticator) to use public key algorithms that the user agent may not understand. However, if the [Relying Party](#relying-party) does so, the user agent will not be able to translate the resulting [credential public key](#credential-public-key) into [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7) format and the return value of `[getPublicKey()](#dom-authenticatorattestationresponse-getpublickey)` will be null.

User agents MUST be able to return a non-null value for `[getPublicKey()](#dom-authenticatorattestationresponse-getpublickey)` when the [credential public key](#credential-public-key) has a `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)` value of:

- -7 (ES256), where [kty](https://tools.ietf.org/html/rfc8152#section-7.1) is 2 (with uncompressed points) and [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) is 1 (P-256).
    
- -257 (RS256).
    
- -8 (EdDSA), where [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) is 6 (Ed25519).
    

A [SubjectPublicKeyInfo](https://tools.ietf.org/html/rfc5280#section-4.1.2.7) does not include information about the signing algorithm (for example, which hash function to use) that is included in the COSE public key. To provide this, `[getPublicKeyAlgorithm()](#dom-authenticatorattestationresponse-getpublickeyalgorithm)` returns the `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)` for the [credential public key](#credential-public-key).

To remove the need to parse CBOR at all in many cases, `[getAuthenticatorData()](#dom-authenticatorattestationresponse-getauthenticatordata)` returns the [authenticator data](#authenticator-data) from `[attestationObject](#dom-authenticatorattestationresponse-attestationobject)`. The [authenticator data](#authenticator-data) contains other fields that are encoded in a binary format. However, helper functions are not provided to access them because [Relying Parties](#relying-party) already need to extract those fields when [getting an assertion](#sctn-getAssertion). In contrast to [credential creation](#sctn-createCredential), where signature verification is [optional](#enumdef-attestationconveyancepreference), [Relying Parties](#relying-party) should always be verifying signatures from an assertion and thus must extract fields from the signed [authenticator data](#authenticator-data). The same functions used there will also serve during credential creation.

Note: `[getPublicKey()](#dom-authenticatorattestationresponse-getpublickey)` and `[getAuthenticatorData()](#dom-authenticatorattestationresponse-getauthenticatordata)` were only added in level two of this spec. [Relying Parties](#relying-party) SHOULD use feature detection before using these functions by testing the value of `'getPublicKey' in AuthenticatorAttestationResponse.prototype`. [Relying Parties](#relying-party) that require this function to exist may not interoperate with older user-agents.

#### 5.2.2. Web Authentication Assertion (interface `AuthenticatorAssertionResponse`)[](#iface-authenticatorassertionresponse)

[AuthenticatorAssertionResponse](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse "The AuthenticatorAssertionResponse interface of the Web Authentication API is returned by CredentialsContainer.get() when a PublicKeyCredential is passed, and provides proof to a service that it has a key pair and that the authentication request is valid and approved.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

The `[AuthenticatorAssertionResponse](#authenticatorassertionresponse)` interface represents an [authenticator](#authenticator)'s response to a client’s request for generation of a new [authentication assertion](#authentication-assertion) given the [WebAuthn Relying Party](#webauthn-relying-party)'s challenge and OPTIONAL list of credentials it is aware of. This response contains a cryptographic signature proving possession of the [credential private key](#credential-private-key), and optionally evidence of [user consent](#user-consent) to a specific transaction.

[[SecureContext](https://heycam.github.io/webidl/#SecureContext), [Exposed](https://heycam.github.io/webidl/#Exposed)=Window]
interface [AuthenticatorAssertionResponse](#authenticatorassertionresponse) : [AuthenticatorResponse](#authenticatorresponse) {
    [[SameObject](https://heycam.github.io/webidl/#SameObject)] readonly attribute [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)      [authenticatorData](#dom-authenticatorassertionresponse-authenticatordata);
    [[SameObject](https://heycam.github.io/webidl/#SameObject)] readonly attribute [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)      [signature](#dom-authenticatorassertionresponse-signature);
    [[SameObject](https://heycam.github.io/webidl/#SameObject)] readonly attribute [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)?     [userHandle](#dom-authenticatorassertionresponse-userhandle);
};

`[clientDataJSON](#dom-authenticatorresponse-clientdatajson)`

This attribute, inherited from `[AuthenticatorResponse](#authenticatorresponse)`, contains the [JSON-compatible serialization of client data](#collectedclientdata-json-compatible-serialization-of-client-data) (see [§ 5.8.1 Client Data Used in WebAuthn Signatures (dictionary CollectedClientData)](#dictionary-client-data)) passed to the authenticator by the client in order to generate this assertion. The exact JSON serialization MUST be preserved, as the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data) has been computed over it.

[AuthenticatorAssertionResponse/authenticatorData](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/authenticatorData "The authenticatorData property of the AuthenticatorAssertionResponse interface returns an ArrayBuffer containing information from the authenticator such as the Relying Party ID Hash (rpIdHash), a signature counter, test of user presence, user verification flags, and any extensions processed by the authenticator.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`authenticatorData`, of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains the [authenticator data](#authenticator-data) returned by the authenticator. See [§ 6.1 Authenticator Data](#sctn-authenticator-data).

[AuthenticatorAssertionResponse/signature](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/signature "The signature read-only property of the AuthenticatorAssertionResponse interface is an ArrayBuffer object which is the signature of the authenticator for both AuthenticatorAssertionResponse.authenticatorData and a SHA-256 hash of the client data (AuthenticatorAssertionResponse.clientDataJSON).")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`signature`, of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly

This attribute contains the raw signature returned from the authenticator. See [§ 6.3.3 The authenticatorGetAssertion Operation](#sctn-op-get-assertion).

[AuthenticatorAssertionResponse/userHandle](https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/userHandle "The userHandle read-only property of the AuthenticatorAssertionResponse interface is an ArrayBuffer object which is an opaque identifier for the given user. Such an identifier can be used by the relying party's server to link the user account with its corresponding credentials and other data.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

OperaNoneEdge79+

---

Edge (Legacy)18IENone

---

Firefox for Android60+iOS Safari13.3+Chrome for Android70+Android WebView70+Samsung InternetNoneOpera MobileNone

`userHandle`, of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer), readonly, nullable

This attribute contains the [user handle](#user-handle) returned from the authenticator, or null if the authenticator did not return a [user handle](#user-handle). See [§ 6.3.3 The authenticatorGetAssertion Operation](#sctn-op-get-assertion).

### 5.3. Parameters for Credential Generation (dictionary `PublicKeyCredentialParameters`)[](#dictionary-credential-params)

dictionary [PublicKeyCredentialParameters](#dictdef-publickeycredentialparameters) {
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString)                    [type](#dom-publickeycredentialparameters-type);
    required [COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)      [alg](#dom-publickeycredentialparameters-alg);
};

This dictionary is used to supply additional parameters when creating a new credential.

`type`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member specifies the type of credential to be created. The value SHOULD be a member of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` but [client platforms](#client-platform) MUST ignore unknown values, ignoring any `[PublicKeyCredentialParameters](#dictdef-publickeycredentialparameters)` with an unknown `[type](#dom-publickeycredentialparameters-type)`.

`alg`, of type [COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)

This member specifies the cryptographic signature algorithm with which the newly generated credential will be used, and thus also the type of asymmetric key pair to be generated, e.g., RSA or Elliptic Curve.

Note: we use "alg" as the latter member name, rather than spelling-out "algorithm", because it will be serialized into a message to the authenticator, which may be sent over a low-bandwidth link.

### 5.4. Options for Credential Creation (dictionary `PublicKeyCredentialCreationOptions`)[](#dictionary-makecredentialoptions)

[PublicKeyCredentialCreationOptions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions "The PublicKeyCredentialCreationOptions dictionary of the Web Authentication API holds options passed to navigators.credentials.create() in order to create a PublicKeyCredential.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

dictionary [PublicKeyCredentialCreationOptions](#dictdef-publickeycredentialcreationoptions) {
    required [PublicKeyCredentialRpEntity](#dictdef-publickeycredentialrpentity)         [rp](#dom-publickeycredentialcreationoptions-rp);
    required [PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity)       [user](#dom-publickeycredentialcreationoptions-user);

    required [BufferSource](https://heycam.github.io/webidl/#BufferSource)                             [challenge](#dom-publickeycredentialcreationoptions-challenge);
    required [sequence](https://heycam.github.io/webidl/#idl-sequence)<[PublicKeyCredentialParameters](#dictdef-publickeycredentialparameters)>  [pubKeyCredParams](#dom-publickeycredentialcreationoptions-pubkeycredparams);

    [unsigned long](https://heycam.github.io/webidl/#idl-unsigned-long)                                [timeout](#dom-publickeycredentialcreationoptions-timeout);
    [sequence](https://heycam.github.io/webidl/#idl-sequence)<[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)>      [excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials) = [];
    [AuthenticatorSelectionCriteria](#dictdef-authenticatorselectioncriteria)               [authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection);
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString)                                    [attestation](#dom-publickeycredentialcreationoptions-attestation) = "none";
    [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs)         [extensions](#dom-publickeycredentialcreationoptions-extensions);
};

[PublicKeyCredentialCreationOptions/rp](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/rp "The rp property of the PublicKeyCredentialCreationOptions dictionary is an object describing the relying party which requested the credential creation (via navigator.credentials.create()).")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`rp`, of type [PublicKeyCredentialRpEntity](#dictdef-publickeycredentialrpentity)

This member contains data about the [Relying Party](#relying-party) responsible for the request.

Its value’s `[name](#dom-publickeycredentialentity-name)` member is REQUIRED. See [§ 5.4.1 Public Key Entity Description (dictionary PublicKeyCredentialEntity)](#dictionary-pkcredentialentity) for further details.

Its value’s `[id](#dom-publickeycredentialrpentity-id)` member specifies the [RP ID](#rp-id) the credential should be [scoped](#scope) to. If omitted, its value will be the `[CredentialsContainer](https://w3c.github.io/webappsec-credential-management/#credentialscontainer)` object’s [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain). See [§ 5.4.2 Relying Party Parameters for Credential Generation (dictionary PublicKeyCredentialRpEntity)](#dictionary-rp-credential-params) for further details.

[PublicKeyCredentialCreationOptions/user](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/user "The user property of the PublicKeyCredentialCreationOptions dictionary is an object describing the user account for which the credentials are generated (via navigator.credentials.create()).")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`user`, of type [PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity)

This member contains data about the user account for which the [Relying Party](#relying-party) is requesting attestation.

Its value’s `[name](#dom-publickeycredentialentity-name)`, `[displayName](#dom-publickeycredentialuserentity-displayname)` and `[id](#dom-publickeycredentialuserentity-id)` members are REQUIRED. See [§ 5.4.1 Public Key Entity Description (dictionary PublicKeyCredentialEntity)](#dictionary-pkcredentialentity) and [§ 5.4.3 User Account Parameters for Credential Generation (dictionary PublicKeyCredentialUserEntity)](#dictionary-user-credential-params) for further details.

[PublicKeyCredentialCreationOptions/challenge](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/challenge "The challenge property of the PublicKeyCredentialCreationOptions dictionary is a BufferSource used as a cryptographic challenge. This is randomly generated then sent from the relying party's server. This value (among other client data) will be signed by the authenticator, using its private key, and must be sent back for verification to the server as part of AuthenticatorAttestationResponse.attestationObject.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`challenge`, of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

This member contains a challenge intended to be used for generating the newly created credential’s [attestation object](#attestation-object). See the [§ 13.4.3 Cryptographic Challenges](#sctn-cryptographic-challenges) security consideration.

[PublicKeyCredentialCreationOptions/pubKeyCredParams](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/pubKeyCredParams "The pubKeyCredParams property of the PublicKeyCredentialCreationOptions dictionary is an Array whose elements are objects describing the desired features of the credential to be created. These objects define the type of public-key and the algorithm used for cryptographic signature operations.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`pubKeyCredParams`, of type sequence<[PublicKeyCredentialParameters](#dictdef-publickeycredentialparameters)>

This member contains information about the desired properties of the credential to be created. The sequence is ordered from most preferred to least preferred. The [client](#client) makes a best-effort to create the most preferred credential that it can.

[PublicKeyCredentialCreationOptions/timeout](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/timeout "The timeout property, of the PublicKeyCredentialCreationOptions dictionary, represents an hint, given in milliseconds, for the time the script is willing to wait for the completion of the creation operation.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`timeout`, of type [unsigned long](https://heycam.github.io/webidl/#idl-unsigned-long)

This member specifies a time, in milliseconds, that the caller is willing to wait for the call to complete. This is treated as a hint, and MAY be overridden by the [client](#client).

`excludeCredentials`, of type sequence<[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)>, defaulting to `[]`

This member is intended for use by [Relying Parties](#relying-party) that wish to limit the creation of multiple credentials for the same account on a single authenticator. The [client](#client) is requested to return an error if the new credential would be created on an authenticator that also contains one of the credentials enumerated in this parameter.

`authenticatorSelection`, of type [AuthenticatorSelectionCriteria](#dictdef-authenticatorselectioncriteria)

This member is intended for use by [Relying Parties](#relying-party) that wish to select the appropriate authenticators to participate in the `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` operation.

[PublicKeyCredentialCreationOptions/attestation](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/attestation "attestation is an optional property of the PublicKeyCredentialCreationOptions dictionary. This is a string whose value indicates the preference regarding the attestation transport, between the authenticator, the client and the relying party.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

`attestation`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString), defaulting to `"none"`

This member is intended for use by [Relying Parties](#relying-party) that wish to express their preference for [attestation conveyance](#attestation-conveyance). Its values SHOULD be members of `[AttestationConveyancePreference](#enumdef-attestationconveyancepreference)`. [Client platforms](#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists). Its default value is "none".

`extensions`, of type [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs)

This member contains additional parameters requesting additional processing by the client and authenticator. For example, the caller may request that only authenticators with certain capabilities be used to create the credential, or that particular information be returned in the [attestation object](#attestation-object). Some extensions are defined in [§ 9 WebAuthn Extensions](#sctn-extensions); consult the IANA "WebAuthn Extension Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809) for an up-to-date list of registered [WebAuthn Extensions](#webauthn-extensions).

#### 5.4.1. Public Key Entity Description (dictionary `PublicKeyCredentialEntity`)[](#dictionary-pkcredentialentity)

The `[PublicKeyCredentialEntity](#dictdef-publickeycredentialentity)` dictionary describes a user account, or a [WebAuthn Relying Party](#webauthn-relying-party), which a [public key credential](#public-key-credential) is associated with or [scoped](#scope) to, respectively.

dictionary [PublicKeyCredentialEntity](#dictdef-publickeycredentialentity) {
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString)    [name](#dom-publickeycredentialentity-name);
};

`name`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

A [human-palatable](#human-palatability) name for the entity. Its function depends on what the `[PublicKeyCredentialEntity](#dictdef-publickeycredentialentity)` represents:

- When inherited by `[PublicKeyCredentialRpEntity](#dictdef-publickeycredentialrpentity)` it is a [human-palatable](#human-palatability) identifier for the [Relying Party](#relying-party), intended only for display. For example, "ACME Corporation", "Wonderful Widgets, Inc." or "ОАО Примертех".
    
    - [Relying Parties](#relying-party) SHOULD perform enforcement, as prescribed in Section 2.3 of [[RFC8266]](#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [[RFC8264]](#biblio-rfc8264), when setting `[name](#dom-publickeycredentialentity-name)`'s value, or displaying the value to the user.
        
    - This string MAY contain language and direction metadata. [Relying Parties](#relying-party) SHOULD consider providing this information. See [§ 6.4.2 Language and Direction Encoding](#sctn-strings-langdir) about how this metadata is encoded.
        
    - [Clients](#client) SHOULD perform enforcement, as prescribed in Section 2.3 of [[RFC8266]](#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [[RFC8264]](#biblio-rfc8264), on `[name](#dom-publickeycredentialentity-name)`'s value prior to displaying the value to the user or including the value as a parameter of the [authenticatorMakeCredential](#authenticatormakecredential) operation.
        
- When inherited by `[PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity)`, it is a [human-palatable](#human-palatability) identifier for a user account. It is intended only for display, i.e., aiding the user in determining the difference between user accounts with similar `[displayName](#dom-publickeycredentialuserentity-displayname)`s. For example, "alexm", "alex.mueller@example.com" or "+14255551234".
    
    - The [Relying Party](#relying-party) MAY let the user choose this value. The [Relying Party](#relying-party) SHOULD perform enforcement, as prescribed in Section 3.4.3 of [[RFC8265]](#biblio-rfc8265) for the UsernameCasePreserved Profile of the PRECIS IdentifierClass [[RFC8264]](#biblio-rfc8264), when setting `[name](#dom-publickeycredentialentity-name)`'s value, or displaying the value to the user.
        
    - This string MAY contain language and direction metadata. [Relying Parties](#relying-party) SHOULD consider providing this information. See [§ 6.4.2 Language and Direction Encoding](#sctn-strings-langdir) about how this metadata is encoded.
        
    - [Clients](#client) SHOULD perform enforcement, as prescribed in Section 3.4.3 of [[RFC8265]](#biblio-rfc8265) for the UsernameCasePreserved Profile of the PRECIS IdentifierClass [[RFC8264]](#biblio-rfc8264), on `[name](#dom-publickeycredentialentity-name)`'s value prior to displaying the value to the user or including the value as a parameter of the [authenticatorMakeCredential](#authenticatormakecredential) operation.
        

When [clients](#client), [client platforms](#client-platform), or [authenticators](#authenticator) display a `[name](#dom-publickeycredentialentity-name)`'s value, they should always use UI elements to provide a clear boundary around the displayed value, and not allow overflow into other elements [[css-overflow-3]](#biblio-css-overflow-3).

Authenticators MAY truncate a `[name](#dom-publickeycredentialentity-name)` member’s value so that it fits within 64 bytes, if the authenticator stores the value. See [§ 6.4.1 String Truncation](#sctn-strings-truncation) about truncation and other considerations.

#### 5.4.2. Relying Party Parameters for Credential Generation (dictionary `PublicKeyCredentialRpEntity`)[](#dictionary-rp-credential-params)

The `[PublicKeyCredentialRpEntity](#dictdef-publickeycredentialrpentity)` dictionary is used to supply additional [Relying Party](#relying-party) attributes when creating a new credential.

dictionary [PublicKeyCredentialRpEntity](#dictdef-publickeycredentialrpentity) : [PublicKeyCredentialEntity](#dictdef-publickeycredentialentity) {
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString)      [id](#dom-publickeycredentialrpentity-id);
};

`id`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

A unique identifier for the [Relying Party](#relying-party) entity, which sets the [RP ID](#rp-id).

#### 5.4.3. User Account Parameters for Credential Generation (dictionary `PublicKeyCredentialUserEntity`)[](#dictionary-user-credential-params)

The `[PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity)` dictionary is used to supply additional user account attributes when creating a new credential.

dictionary [PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity) : [PublicKeyCredentialEntity](#dictdef-publickeycredentialentity) {
    required [BufferSource](https://heycam.github.io/webidl/#BufferSource)   [id](#dom-publickeycredentialuserentity-id);
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString)      [displayName](#dom-publickeycredentialuserentity-displayname);
};

`id`, of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

The [user handle](#user-handle) of the user account entity. A [user handle](#user-handle) is an opaque [byte sequence](https://infra.spec.whatwg.org/#byte-sequence) with a maximum size of 64 bytes, and is not meant to be displayed to the user.

To ensure secure operation, authentication and authorization decisions MUST be made on the basis of this `[id](#dom-publickeycredentialuserentity-id)` member, not the `[displayName](#dom-publickeycredentialuserentity-displayname)` nor `[name](#dom-publickeycredentialentity-name)` members. See Section 6.1 of [[RFC8266]](#biblio-rfc8266).

The [user handle](#user-handle) MUST NOT contain personally identifying information about the user, such as a username or e-mail address; see [§ 14.6.1 User Handle Contents](#sctn-user-handle-privacy) for details. The [user handle](#user-handle) MUST NOT be empty, though it MAY be null.

Note: the [user handle](#user-handle) _ought not_ be a constant value across different accounts, even for [non-discoverable credentials](#non-discoverable-credential), because some authenticators always create [discoverable credentials](#discoverable-credential). Thus a constant [user handle](#user-handle) would prevent a user from using such an authenticator with more than one account at the [Relying Party](#relying-party).

`displayName`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

A [human-palatable](#human-palatability) name for the user account, intended only for display. For example, "Alex Müller" or "田中倫". The [Relying Party](#relying-party) SHOULD let the user choose this, and SHOULD NOT restrict the choice more than necessary.

- [Relying Parties](#relying-party) SHOULD perform enforcement, as prescribed in Section 2.3 of [[RFC8266]](#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [[RFC8264]](#biblio-rfc8264), when setting `[displayName](#dom-publickeycredentialuserentity-displayname)`'s value, or displaying the value to the user.
    
- This string MAY contain language and direction metadata. [Relying Parties](#relying-party) SHOULD consider providing this information. See [§ 6.4.2 Language and Direction Encoding](#sctn-strings-langdir) about how this metadata is encoded.
    
- [Clients](#client) SHOULD perform enforcement, as prescribed in Section 2.3 of [[RFC8266]](#biblio-rfc8266) for the Nickname Profile of the PRECIS FreeformClass [[RFC8264]](#biblio-rfc8264), on `[displayName](#dom-publickeycredentialuserentity-displayname)`'s value prior to displaying the value to the user or including the value as a parameter of the [authenticatorMakeCredential](#authenticatormakecredential) operation.
    

When [clients](#client), [client platforms](#client-platform), or [authenticators](#authenticator) display a `[displayName](#dom-publickeycredentialuserentity-displayname)`'s value, they should always use UI elements to provide a clear boundary around the displayed value, and not allow overflow into other elements [[css-overflow-3]](#biblio-css-overflow-3).

[Authenticators](#authenticator) MUST accept and store a 64-byte minimum length for a `[displayName](#dom-publickeycredentialuserentity-displayname)` member’s value. Authenticators MAY truncate a `[displayName](#dom-publickeycredentialuserentity-displayname)` member’s value so that it fits within 64 bytes. See [§ 6.4.1 String Truncation](#sctn-strings-truncation) about truncation and other considerations.

#### 5.4.4. Authenticator Selection Criteria (dictionary `AuthenticatorSelectionCriteria`)[](#dictionary-authenticatorSelection)

[WebAuthn Relying Parties](#webauthn-relying-party) may use the `[AuthenticatorSelectionCriteria](#dictdef-authenticatorselectioncriteria)` dictionary to specify their requirements regarding authenticator attributes.

dictionary [AuthenticatorSelectionCriteria](#dictdef-authenticatorselectioncriteria) {
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString)                    [authenticatorAttachment](#dom-authenticatorselectioncriteria-authenticatorattachment);
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString)                    [residentKey](#dom-authenticatorselectioncriteria-residentkey);
    [boolean](https://heycam.github.io/webidl/#idl-boolean)                      [requireResidentKey](#dom-authenticatorselectioncriteria-requireresidentkey) = false;
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString)                    [userVerification](#dom-authenticatorselectioncriteria-userverification) = "preferred";
};

`authenticatorAttachment`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

If this member is present, eligible authenticators are filtered to only authenticators attached with the specified [§ 5.4.5 Authenticator Attachment Enumeration (enum AuthenticatorAttachment)](#enum-attachment). The value SHOULD be a member of `[AuthenticatorAttachment](#enumdef-authenticatorattachment)` but [client platforms](#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists).

`residentKey`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

Specifies the extent to which the [Relying Party](#relying-party) desires to create a [client-side discoverable credential](#client-side-discoverable-credential). For historical reasons the naming retains the deprecated “resident” terminology. The value SHOULD be a member of `[ResidentKeyRequirement](#enumdef-residentkeyrequirement)` but [client platforms](#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists). If no value is given then the effective value is `[required](#dom-residentkeyrequirement-required)` if `[requireResidentKey](#dom-authenticatorselectioncriteria-requireresidentkey)` is `true` or `[discouraged](#dom-residentkeyrequirement-discouraged)` if it is `false` or absent.

See `[ResidentKeyRequirement](#enumdef-residentkeyrequirement)` for the description of `[residentKey](#dom-authenticatorselectioncriteria-residentkey)`'s values and semantics.

`requireResidentKey`, of type [boolean](https://heycam.github.io/webidl/#idl-boolean), defaulting to `false`

This member is retained for backwards compatibility with WebAuthn Level 1 and, for historical reasons, its naming retains the deprecated “resident” terminology for [discoverable credentials](#discoverable-credential). [Relying Parties](#relying-party) SHOULD set it to `true` if, and only if, `[residentKey](#dom-authenticatorselectioncriteria-residentkey)` is set to `[required](#dom-residentkeyrequirement-required)`.

`userVerification`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString), defaulting to `"preferred"`

This member describes the [Relying Party](#relying-party)'s requirements regarding [user verification](#user-verification) for the `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` operation. Eligible authenticators are filtered to only those capable of satisfying this requirement. The value SHOULD be a member of `[UserVerificationRequirement](#enumdef-userverificationrequirement)` but [client platforms](#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists).

#### 5.4.5. Authenticator Attachment Enumeration (enum `AuthenticatorAttachment`)[](#enum-attachment)

This enumeration’s values describe [authenticators](#authenticator)' [attachment modalities](#authenticator-attachment-modality). [Relying Parties](#relying-party) use this to express a preferred [authenticator attachment modality](#authenticator-attachment-modality) when calling `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` to [create a credential](#sctn-createCredential).

enum [AuthenticatorAttachment](#enumdef-authenticatorattachment) {
    ["platform"](#dom-authenticatorattachment-platform),
    ["cross-platform"](#dom-authenticatorattachment-cross-platform)
};

Note: The `[AuthenticatorAttachment](#enumdef-authenticatorattachment)` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).

`platform`

This value indicates [platform attachment](#platform-attachment).

`cross-platform`

This value indicates [cross-platform attachment](#cross-platform-attachment).

Note: An [authenticator attachment modality](#authenticator-attachment-modality) selection option is available only in the `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` operation. The [Relying Party](#relying-party) may use it to, for example, ensure the user has a [roaming credential](#roaming-credential) for authenticating on another [client device](#client-device); or to specifically register a [platform credential](#platform-credential) for easier reauthentication using a particular [client device](#client-device). The `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` operation has no [authenticator attachment modality](#authenticator-attachment-modality) selection option, so the [Relying Party](#relying-party) SHOULD accept any of the user’s registered [credentials](#public-key-credential). The [client](#client) and user will then use whichever is available and convenient at the time.

#### 5.4.6. Resident Key Requirement Enumeration (enum `ResidentKeyRequirement`)[](#enum-residentKeyRequirement)

enum [ResidentKeyRequirement](#enumdef-residentkeyrequirement) {
    ["discouraged"](#dom-residentkeyrequirement-discouraged),
    ["preferred"](#dom-residentkeyrequirement-preferred),
    ["required"](#dom-residentkeyrequirement-required)
};

Note: The `[ResidentKeyRequirement](#enumdef-residentkeyrequirement)` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).

This enumeration’s values describe the [Relying Party](#relying-party)'s requirements for [client-side discoverable credentials](#client-side-discoverable-credential) (formerly known as [resident credentials](#resident-credential) or [resident keys](#resident-key)):

`discouraged`

This value indicates the [Relying Party](#relying-party) prefers creating a [server-side credential](#server-side-credential), but will accept a [client-side discoverable credential](#client-side-discoverable-credential).

Note: A [Relying Party](#relying-party) cannot require that a created credential is a [server-side credential](#server-side-credential) and the [Credential Properties Extension](#credprops) may not return a value for the `[rk](#dom-credentialpropertiesoutput-rk)` property. Because of this, it may be the case that it does not know if a credential is a [server-side credential](#server-side-credential) or not and thus does not know whether creating a second credential with the same [user handle](#user-handle) will evict the first.

`preferred`

This value indicates the [Relying Party](#relying-party) strongly prefers creating a [client-side discoverable credential](#client-side-discoverable-credential), but will accept a [server-side credential](#server-side-credential). For example, user agents SHOULD guide the user through setting up [user verification](#user-verification) if needed to create a [client-side discoverable credential](#client-side-discoverable-credential) in this case. This takes precedence over the setting of `[userVerification](#dom-authenticatorselectioncriteria-userverification)`.

`required`

This value indicates the [Relying Party](#relying-party) requires a [client-side discoverable credential](#client-side-discoverable-credential), and is prepared to receive an error if a [client-side discoverable credential](#client-side-discoverable-credential) cannot be created.

Note: [Relying Parties](#relying-party) can seek information on whether or not the authenticator created a [client-side discoverable credential](#client-side-discoverable-credential) by inspecting the [Credential Properties Extension](#credprops)'s return value in light of the value provided for `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[residentKey](#dom-authenticatorselectioncriteria-residentkey)` ``. This is useful when values of `[discouraged](#dom-residentkeyrequirement-discouraged)` or `[preferred](#dom-residentkeyrequirement-preferred)` are used for `` options.`[authenticatorSelection](#dom-publickeycredentialcreationoptions-authenticatorselection)`.`[residentKey](#dom-authenticatorselectioncriteria-residentkey)` ``, because in those cases it is possible for an [authenticator](#authenticator) to create _either_ a [client-side discoverable credential](#client-side-discoverable-credential) or a [server-side credential](#server-side-credential).

#### 5.4.7. Attestation Conveyance Preference Enumeration (enum `AttestationConveyancePreference`)[](#enum-attestation-convey)

[WebAuthn Relying Parties](#webauthn-relying-party) may use `[AttestationConveyancePreference](#enumdef-attestationconveyancepreference)` to specify their preference regarding [attestation conveyance](#attestation-conveyance) during credential generation.

enum [AttestationConveyancePreference](#enumdef-attestationconveyancepreference) {
    ["none"](#dom-attestationconveyancepreference-none),
    ["indirect"](#dom-attestationconveyancepreference-indirect),
    ["direct"](#dom-attestationconveyancepreference-direct),
    ["enterprise"](#dom-attestationconveyancepreference-enterprise)
};

Note: The `[AttestationConveyancePreference](#enumdef-attestationconveyancepreference)` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).

`none`

This value indicates that the [Relying Party](#relying-party) is not interested in [authenticator](#authenticator) [attestation](#attestation). For example, in order to potentially avoid having to obtain [user consent](#user-consent) to relay identifying information to the [Relying Party](#relying-party), or to save a roundtrip to an [Attestation CA](#attestation-ca) or [Anonymization CA](#anonymization-ca).

This is the default value.

`indirect`

This value indicates that the [Relying Party](#relying-party) prefers an [attestation](#attestation) conveyance yielding verifiable [attestation statements](#attestation-statement), but allows the client to decide how to obtain such [attestation statements](#attestation-statement). The client MAY replace the authenticator-generated [attestation statements](#attestation-statement) with [attestation statements](#attestation-statement) generated by an [Anonymization CA](#anonymization-ca), in order to protect the user’s privacy, or to assist [Relying Parties](#relying-party) with attestation verification in a heterogeneous ecosystem.

Note: There is no guarantee that the [Relying Party](#relying-party) will obtain a verifiable [attestation statement](#attestation-statement) in this case. For example, in the case that the authenticator employs [self attestation](#self-attestation).

`direct`

This value indicates that the [Relying Party](#relying-party) wants to receive the [attestation statement](#attestation-statement) as generated by the [authenticator](#authenticator).

`enterprise`

This value indicates that the [Relying Party](#relying-party) wants to receive an [attestation statement](#attestation-statement) that may include uniquely identifying information. This is intended for controlled deployments within an enterprise where the organization wishes to tie registrations to specific authenticators. User agents MUST NOT provide such an attestation unless the user agent or authenticator configuration permits it for the requested [RP ID](#rp-id).

If permitted, the user agent SHOULD signal to the authenticator (at [invocation time](#CreateCred-InvokeAuthnrMakeCred)) that enterprise attestation is requested, and convey the resulting [AAGUID](#aaguid) and [attestation statement](#attestation-statement), unaltered, to the [Relying Party](#relying-party).

### 5.5. Options for Assertion Generation (dictionary `PublicKeyCredentialRequestOptions`)[](#dictionary-assertion-options)

[PublicKeyCredentialRequestOptions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions "The PublicKeyCredentialRequestOptions dictionary of the Web Authentication API holds the options passed to navigator.credentials.get() in order to fetch a given PublicKeyCredential.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

The `[PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)` dictionary supplies `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` with the data it needs to generate an assertion. Its `[challenge](#dom-publickeycredentialrequestoptions-challenge)` member MUST be present, while its other members are OPTIONAL.

dictionary [PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions) {
    required [BufferSource](https://heycam.github.io/webidl/#BufferSource)                [challenge](#dom-publickeycredentialrequestoptions-challenge);
    [unsigned long](https://heycam.github.io/webidl/#idl-unsigned-long)                        [timeout](#dom-publickeycredentialrequestoptions-timeout);
    [USVString](https://heycam.github.io/webidl/#idl-USVString)                            [rpId](#dom-publickeycredentialrequestoptions-rpid);
    [sequence](https://heycam.github.io/webidl/#idl-sequence)<[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)> [allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials) = [];
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString)                            [userVerification](#dom-publickeycredentialrequestoptions-userverification) = "preferred";
    [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs) [extensions](#dom-publickeycredentialrequestoptions-extensions);
};

[PublicKeyCredentialRequestOptions/challenge](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/challenge "The challenge property of the PublicKeyCredentialRequestOptions dictionary is a BufferSource used as a cryptographic challenge. This is randomly generated then sent from the relying party's server. This value (among other client data) will be signed by the authenticator's private key and produce AuthenticatorAssertionResponse.signature which should be sent back to the server as part of the response.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`challenge`, of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

This member represents a challenge that the selected [authenticator](#authenticator) signs, along with other data, when producing an [authentication assertion](#authentication-assertion). See the [§ 13.4.3 Cryptographic Challenges](#sctn-cryptographic-challenges) security consideration.

[PublicKeyCredentialRequestOptions/timeout](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/timeout "The timeout property, of the PublicKeyCredentialRequestOptions dictionary, represents an hint, given in milliseconds, for the time the script is willing to wait for the completion of the retrieval operation.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`timeout`, of type [unsigned long](https://heycam.github.io/webidl/#idl-unsigned-long)

This OPTIONAL member specifies a time, in milliseconds, that the caller is willing to wait for the call to complete. The value is treated as a hint, and MAY be overridden by the [client](#client).

[PublicKeyCredentialRequestOptions/rpId](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/rpId "The rpId property, of the PublicKeyCredentialRequestOptions dictionary, is an optional property which indicates the relying party's identifier as a USVString. Its value can only be a suffix of the current origin's domain. For example, if you are browsing on foo.example.com, the rpId value may be \"example.com\" but not \"bar.org\" or \"baz.example.com\".")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`rpId`, of type [USVString](https://heycam.github.io/webidl/#idl-USVString)

This OPTIONAL member specifies the [relying party identifier](#relying-party-identifier) claimed by the caller. If omitted, its value will be the `[CredentialsContainer](https://w3c.github.io/webappsec-credential-management/#credentialscontainer)` object’s [relevant settings object](https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object)'s [origin](https://html.spec.whatwg.org/multipage/webappapis.html#concept-settings-object-origin)'s [effective domain](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-effective-domain).

[PublicKeyCredentialRequestOptions/allowCredentials](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/allowCredentials "allowCredentials is an optional property of the PublicKeyCredentialRequestOptions dictionary which indicates the existing credentials acceptable for retrieval. This is an Array of credential descriptors.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`allowCredentials`, of type sequence<[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)>, defaulting to `[]`

This OPTIONAL member contains a list of `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)` objects representing [public key credentials](#public-key-credential) acceptable to the caller, in descending order of the caller’s preference (the first item in the list is the most preferred credential, and so on down the list).

[PublicKeyCredentialRequestOptions/userVerification](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/userVerification "userVerification is an optional property of the PublicKeyCredentialRequestOptions. This is a string which indicates how the user verification should be part of the authentication process.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`userVerification`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString), defaulting to `"preferred"`

This OPTIONAL member describes the [Relying Party](#relying-party)'s requirements regarding [user verification](#user-verification) for the `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` operation. The value SHOULD be a member of `[UserVerificationRequirement](#enumdef-userverificationrequirement)` but [client platforms](#client-platform) MUST ignore unknown values, treating an unknown value as if the [member does not exist](https://infra.spec.whatwg.org/#map-exists). Eligible authenticators are filtered to only those capable of satisfying this requirement.

[PublicKeyCredentialCreationOptions/extensions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions/extensions "extensions, an optional property of the PublicKeyCredentialCreationOptions dictionary, is an object providing the client extensions and their input values.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebViewNoneSamsung InternetNoneOpera Mobile48+

[PublicKeyCredentialRequestOptions/extensions](https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions/extensions "extensions, an optional property of the PublicKeyCredentialRequestOptions dictionary, is an object providing the client extensions and their input values.")

In all current engines.

Firefox60+Safari13+Chrome67+

---

Opera54+Edge79+

---

Edge (Legacy)NoneIENone

---

Firefox for Android?iOS Safari13.3+Chrome for Android67+Android WebView67+Samsung InternetNoneOpera Mobile48+

`extensions`, of type [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs)

This OPTIONAL member contains additional parameters requesting additional processing by the client and authenticator. For example, if transaction confirmation is sought from the user, then the prompt string might be included as an extension.

### 5.6. Abort Operations with `AbortSignal`[](#sctn-abortoperation)

Developers are encouraged to leverage the `[AbortController](https://dom.spec.whatwg.org/#abortcontroller)` to manage the `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` and `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` operations. See [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) section for detailed instructions.

Note: [DOM §3.3 Using AbortController and AbortSignal objects in APIs](https://dom.spec.whatwg.org/#abortcontroller-api-integration) section specifies that web platform APIs integrating with the `[AbortController](https://dom.spec.whatwg.org/#abortcontroller)` must reject the promise immediately once the [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) is set. Given the complex inheritance and parallelization structure of the `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` and `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` methods, the algorithms for the two APIs fulfills this requirement by checking the [aborted flag](https://dom.spec.whatwg.org/#abortsignal-aborted-flag) in three places. In the case of `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)`, the aborted flag is checked first in [Credential Management 1 §2.5.4 Create a Credential](https://www.w3.org/TR/credential-management-1/#algorithm-create) immediately before calling `[[[Create]](origin, options, sameOriginWithAncestors)](https://w3c.github.io/webappsec-credential-management/#create-origin-options-sameoriginwithancestors)`, then in [§ 5.1.3 Create a New Credential - PublicKeyCredential’s [[Create]](origin, options, sameOriginWithAncestors) Method](#sctn-createCredential) right before [authenticator sessions](#authenticator-session) start, and finally during [authenticator sessions](#authenticator-session). The same goes for `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)`.

The [visibility](https://www.w3.org/TR/page-visibility/#visibility-states) and [focus](https://html.spec.whatwg.org/#focus) state of the [Window](https://fetch.spec.whatwg.org/#concept-request-window) object determines whether the `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` and `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` operations should continue. When the [Window](https://fetch.spec.whatwg.org/#concept-request-window) object associated with the [[Document](https://dom.spec.whatwg.org/#concept-document) loses focus, `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` and `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` operations SHOULD be aborted.

[](#issue-c0359d2a)The WHATWG HTML WG is discussing whether to provide a hook when a browsing context gains or loses focuses. If a hook is provided, the above paragraph will be updated to include the hook. See [WHATWG HTML WG Issue #2711](https://github.com/whatwg/html/issues/2711) for more details.

### 5.7. WebAuthn Extensions Inputs and Outputs[](#sctn-extensions-inputs-outputs)

The subsections below define the data types used for conveying [WebAuthn extension](#webauthn-extensions) inputs and outputs.

Note: [Authenticator extension outputs](#authenticator-extension-output) are conveyed as a part of [Authenticator data](#authenticator-data) (see [Table 1](#table-authData)).

Note: The types defined below — `[AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs)` and `[AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs)` — are applicable to both [registration extensions](#registration-extension) and [authentication extensions](#authentication-extension). The "Authentication..." portion of their names should be regarded as meaning "WebAuthentication..."

#### 5.7.1. Authentication Extensions Client Inputs (dictionary `[AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs)`)[](#iface-authentication-extensions-client-inputs)

dictionary `AuthenticationExtensionsClientInputs` {
};

This is a dictionary containing the [client extension input](#client-extension-input) values for zero or more [WebAuthn Extensions](#webauthn-extensions).

#### 5.7.2. Authentication Extensions Client Outputs (dictionary `[AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs)`)[](#iface-authentication-extensions-client-outputs)

dictionary `AuthenticationExtensionsClientOutputs` {
};

This is a dictionary containing the [client extension output](#client-extension-output) values for zero or more [WebAuthn Extensions](#webauthn-extensions).

#### 5.7.3. Authentication Extensions Authenticator Inputs (CDDL type `AuthenticationExtensionsAuthenticatorInputs`)[](#iface-authentication-extensions-authenticator-inputs)

AuthenticationExtensionsAuthenticatorInputs = {
  * $$extensionInput .within ( tstr => any )
}

The [CDDL](#cddl) type `AuthenticationExtensionsAuthenticatorInputs` defines a [CBOR](#cbor) map containing the [authenticator extension input](#authenticator-extension-input) values for zero or more [WebAuthn Extensions](#webauthn-extensions). Extensions can add members as described in [§ 9.3 Extending Request Parameters](#sctn-extension-request-parameters).

This type is not exposed to the [Relying Party](#relying-party), but is used by the [client](#client) and [authenticator](#authenticator).

#### 5.7.4. Authentication Extensions Authenticator Outputs (CDDL type `AuthenticationExtensionsAuthenticatorOutputs`)[](#iface-authentication-extensions-authenticator-outputs)

AuthenticationExtensionsAuthenticatorOutputs = {
  * $$extensionOutput .within ( tstr => any )
}

The [CDDL](#cddl) type `AuthenticationExtensionsAuthenticatorOutputs` defines a [CBOR](#cbor) map containing the [authenticator extension output](#authenticator-extension-output) values for zero or more [WebAuthn Extensions](#webauthn-extensions). Extensions can add members as described in [§ 9.3 Extending Request Parameters](#sctn-extension-request-parameters).

### 5.8. Supporting Data Structures[](#sctn-supporting-data-structures)

The [public key credential](#public-key-credential) type uses certain data structures that are specified in supporting specifications. These are as follows.

#### 5.8.1. Client Data Used in [WebAuthn Signatures](#webauthn-signature) (dictionary `CollectedClientData`)[](#dictionary-client-data)

The client data represents the contextual bindings of both the [WebAuthn Relying Party](#webauthn-relying-party) and the [client](#client). It is a key-value mapping whose keys are strings. Values can be any type that has a valid encoding in JSON. Its structure is defined by the following Web IDL.

Note: The `[CollectedClientData](#dictdef-collectedclientdata)` may be extended in the future. Therefore it’s critical when parsing to be tolerant of unknown keys and of any reordering of the keys. See also [§ 5.8.1.2 Limited Verification Algorithm](#clientdatajson-verification).

dictionary [CollectedClientData](#dictdef-collectedclientdata) {
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString)           [type](#dom-collectedclientdata-type);
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString)           [challenge](#dom-collectedclientdata-challenge);
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString)           [origin](#dom-collectedclientdata-origin);
    [boolean](https://heycam.github.io/webidl/#idl-boolean)                      [crossOrigin](#dom-collectedclientdata-crossorigin);
    [TokenBinding](#dictdef-tokenbinding)                 [tokenBinding](#dom-collectedclientdata-tokenbinding);
};

dictionary `TokenBinding` {
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString) [status](#dom-tokenbinding-status);
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString) [id](#dom-tokenbinding-id);
};

enum `TokenBindingStatus` { ["present"](#dom-tokenbindingstatus-present), ["supported"](#dom-tokenbindingstatus-supported) };

`type`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member contains the string "webauthn.create" when creating new credentials, and "webauthn.get" when getting an assertion from an existing credential. The purpose of this member is to prevent certain types of signature confusion attacks (where an attacker substitutes one legitimate signature for another).

`challenge`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member contains the base64url encoding of the challenge provided by the [Relying Party](#relying-party). See the [§ 13.4.3 Cryptographic Challenges](#sctn-cryptographic-challenges) security consideration.

`origin`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member contains the fully qualified [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) of the requester, as provided to the authenticator by the client, in the syntax defined by [[RFC6454]](#biblio-rfc6454).

`crossOrigin`, of type [boolean](https://heycam.github.io/webidl/#idl-boolean)

This member contains the inverse of the `sameOriginWithAncestors` argument value that was passed into the [internal method](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots).

`tokenBinding`, of type [TokenBinding](#dictdef-tokenbinding)

This OPTIONAL member contains information about the state of the [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) protocol [[TokenBinding]](#biblio-tokenbinding) used when communicating with the [Relying Party](#relying-party). Its absence indicates that the client doesn’t support token binding.

`status`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member SHOULD be a member of `[TokenBindingStatus](#enumdef-tokenbindingstatus)` but [client platforms](#client-platform) MUST ignore unknown values, treating an unknown value as if the `[tokenBinding](#dom-collectedclientdata-tokenbinding)` [member does not exist](https://infra.spec.whatwg.org/#map-exists). When known, this member is one of the following:

`supported`

Indicates the client supports token binding, but it was not negotiated when communicating with the [Relying Party](#relying-party).

`present`

Indicates token binding was used when communicating with the [Relying Party](#relying-party). In this case, the `[id](#dom-tokenbinding-id)` member MUST be present.

Note: The `[TokenBindingStatus](#enumdef-tokenbindingstatus)` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).

`id`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member MUST be present if `[status](#dom-tokenbinding-status)` is `[present](#dom-tokenbindingstatus-present)`, and MUST be a [base64url encoding](#base64url-encoding) of the [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) that was used when communicating with the [Relying Party](#relying-party).

Note: Obtaining a [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) is a [client platform](#client-platform)-specific operation.

The `[CollectedClientData](#dictdef-collectedclientdata)` structure is used by the client to compute the following quantities:

JSON-compatible serialization of client data

This is the result of performing the [JSON-compatible serialization algorithm](#clientdatajson-serialization) on the `[CollectedClientData](#dictdef-collectedclientdata)` dictionary.

Hash of the serialized client data

This is the hash (computed using SHA-256) of the [JSON-compatible serialization of client data](#collectedclientdata-json-compatible-serialization-of-client-data), as constructed by the client.

##### 5.8.1.1. Serialization[](#clientdatajson-serialization)

The serialization of the `[CollectedClientData](#dictdef-collectedclientdata)` is a subset of the algorithm for [JSON-serializing to bytes](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-json-bytes). I.e. it produces a valid JSON encoding of the `[CollectedClientData](#dictdef-collectedclientdata)` but also provides additional structure that may be exploited by verifiers to avoid integrating a full JSON parser. While verifiers are recommended to perform standard JSON parsing, they may use the [more limited algorithm](#clientdatajson-verification) below in contexts where a full JSON parser is too large. This verification algorithm requires only [base64url encoding](#base64url-encoding), appending of bytestrings (which could be implemented by writing into a fixed template), and three conditional checks (assuming that inputs are known not to need escaping).

The serialization algorithm works by appending successive byte strings to an, initially empty, partial result until the complete result is obtained.

1. Let result be an empty byte string.
    
2. Append 0x7b2274797065223a (`{"type":`) to result.
    
3. Append [CCDToString](#ccdtostring)(`[type](#dom-collectedclientdata-type)`) to result.
    
4. Append 0x2c226368616c6c656e6765223a (`,"challenge":`) to result.
    
5. Append [CCDToString](#ccdtostring)(`[challenge](#dom-collectedclientdata-challenge)`) to result.
    
6. Append 0x2c226f726967696e223a (`,"origin":`) to result.
    
7. Append [CCDToString](#ccdtostring)(`[origin](#dom-collectedclientdata-origin)`) to result.
    
8. Append 0x2c2263726f73734f726967696e223a (`,"crossOrigin":`) to result.
    
9. If `[crossOrigin](#dom-collectedclientdata-crossorigin)` is not present, or is `false`:
    
    1. Append 0x66616c7365 (`false`) to result.
        
10. Otherwise:
    
    1. Append 0x74727565 (`true`) to result.
        
11. Create a temporary copy of the `[CollectedClientData](#dictdef-collectedclientdata)` and remove the fields `[type](#dom-collectedclientdata-type)`, `[challenge](#dom-collectedclientdata-challenge)`, `[origin](#dom-collectedclientdata-origin)`, and `[crossOrigin](#dom-collectedclientdata-crossorigin)` (if present).
    
12. If no fields remain in the temporary copy then:
    
    1. Append 0x7d (`}`) to result.
        
13. Otherwise:
    
    1. Invoke [serialize JSON to bytes](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-json-bytes) on the temporary copy to produce a byte string remainder.
        
    2. Append 0x2c (`,`) to result.
        
    3. Remove the leading byte from remainder.
        
    4. Append remainder to result.
        
14. The result of the serialization is the value of result.
    

The function CCDToString is used in the above algorithm and is defined as:

1. Let encoded be an empty byte string.
    
2. Append 0x22 (`"`) to encoded.
    
3. Invoke [ToString](https://tc39.es/ecma262/#sec-tostring) on the given object to convert to a string.
    
4. For each code point in the resulting string, if the code point:
    
    is in the set {U+0020, U+0021, U+0023–U+005B, U+005D–U+10FFFF}
    
    Append the UTF-8 encoding of that code point to encoded.
    
    is U+0022
    
    Append 0x5c22 (`\"`) to encoded.
    
    is U+005C
    
    Append 0x5c5c (\\) to encoded.
    
    otherwise
    
    Append 0x5c75 (`\u`) to encoded, followed by four, lower-case hex digits that, when interpreted as a base-16 number, represent that code point.
    
5. Append 0x22 (`"`) to encoded.
    
6. The result of this function is the value of encoded.
    

##### 5.8.1.2. Limited Verification Algorithm[](#clientdatajson-verification)

Verifiers may use the following algorithm to verify an encoded `[CollectedClientData](#dictdef-collectedclientdata)` if they cannot support a full JSON parser:

1. The inputs to the algorithm are:
    
    1. A bytestring, clientDataJSON, that contains `[clientDataJSON](#dom-authenticatorresponse-clientdatajson)` — the serialized `[CollectedClientData](#dictdef-collectedclientdata)` that is to be verified.
        
    2. A string, type, that contains the expected `[type](#dom-collectedclientdata-type)`.
        
    3. A byte string, challenge, that contains the challenge byte string that was given in the `[PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)` or `[PublicKeyCredentialCreationOptions](#dictdef-publickeycredentialcreationoptions)`.
        
    4. A string, origin, that contains the expected `[origin](#dom-collectedclientdata-origin)` that issued the request to the user agent.
        
    5. A boolean, crossOrigin, that is true if, and only if, the request should have been performed within a cross-origin `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)`.
        
2. Let expected be an empty byte string.
    
3. Append 0x7b2274797065223a (`{"type":`) to expected.
    
4. Append [CCDToString](#ccdtostring)(type) to expected.
    
5. Append 0x2c226368616c6c656e6765223a (`,"challenge":`) to expected.
    
6. Perform [base64url encoding](#base64url-encoding) on challenge to produce a string, challengeBase64.
    
7. Append [CCDToString](#ccdtostring)(challengeBase64) to expected.
    
8. Append 0x2c226f726967696e223a (`,"origin":`) to expected.
    
9. Append [CCDToString](#ccdtostring)(origin) to expected.
    
10. Append 0x2c2263726f73734f726967696e223a (`,"crossOrigin":`) to expected.
    
11. If crossOrigin is true:
    
    1. Append 0x74727565 (`true`) to expected.
        
12. Otherwise, i.e. crossOrigin is false:
    
    1. Append 0x66616c7365 (`false`) to expected.
        
13. If expected is not a prefix of clientDataJSON then the verification has failed.
    
14. If clientDataJSON is not at least one byte longer than expected then the verification has failed.
    
15. If the byte of clientDataJSON at the offset equal to the length of expected:
    
    is 0x7d
    
    The verification is successful.
    
    is 0x2c
    
    The verification is successful.
    
    otherwise
    
    The verification has failed.
    

##### 5.8.1.3. Future development[](#clientdatajson-development)

In order to remain compatible with the [limited verification algorithm](#clientdatajson-verification), future versions of this specification must not remove any of the fields `[type](#dom-collectedclientdata-type)`, `[challenge](#dom-collectedclientdata-challenge)`, `[origin](#dom-collectedclientdata-origin)`, or `[crossOrigin](#dom-collectedclientdata-crossorigin)` from `[CollectedClientData](#dictdef-collectedclientdata)`. They also must not change the [serialization algorithm](#clientdatajson-verification) to change the order in which those fields are serialized.

If additional fields are added to `[CollectedClientData](#dictdef-collectedclientdata)` then verifiers that employ the [limited verification algorithm](#clientdatajson-verification) will not be able to consider them until the two algorithms above are updated to include them. Once such an update occurs then the added fields inherit the same limitations as described in the previous paragraph. Such an algorithm update would have to accomodate serializations produced by previous versions. I.e. the verification algorithm would have to handle the fact that a fifth key–value pair may not appear fifth (or at all) if generated by a user agent working from a previous version.

#### 5.8.2. Credential Type Enumeration (enum `PublicKeyCredentialType`)[](#enum-credentialType)

enum [PublicKeyCredentialType](#enumdef-publickeycredentialtype) {
    ["public-key"](#dom-publickeycredentialtype-public-key)
};

Note: The `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).

This enumeration defines the valid credential types. It is an extension point; values can be added to it in the future, as more credential types are defined. The values of this enumeration are used for versioning the Authentication Assertion and attestation structures according to the type of the authenticator.

Currently one credential type is defined, namely "`public-key`".

#### 5.8.3. Credential Descriptor (dictionary `PublicKeyCredentialDescriptor`)[](#dictionary-credential-descriptor)

dictionary [PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor) {
    required [DOMString](https://heycam.github.io/webidl/#idl-DOMString)                    [type](#dom-publickeycredentialdescriptor-type);
    required [BufferSource](https://heycam.github.io/webidl/#BufferSource)                 [id](#dom-publickeycredentialdescriptor-id);
    [sequence](https://heycam.github.io/webidl/#idl-sequence)<[DOMString](https://heycam.github.io/webidl/#idl-DOMString)>                   [transports](#dom-publickeycredentialdescriptor-transports);
};

This dictionary contains the attributes that are specified by a caller when referring to a [public key credential](#public-key-credential) as an input parameter to the `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` or `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` methods. It mirrors the fields of the `[PublicKeyCredential](#publickeycredential)` object returned by the latter methods.

`type`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

This member contains the type of the [public key credential](#public-key-credential) the caller is referring to. The value SHOULD be a member of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` but [client platforms](#client-platform) MUST ignore any `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)` with an unknown `[type](#dom-publickeycredentialdescriptor-type)`.

`id`, of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

This member contains the [credential ID](#credential-id) of the [public key credential](#public-key-credential) the caller is referring to.

`transports`, of type sequence<[DOMString](https://heycam.github.io/webidl/#idl-DOMString)>

This OPTIONAL member contains a hint as to how the [client](#client) might communicate with the [managing authenticator](#public-key-credential-source-managing-authenticator) of the [public key credential](#public-key-credential) the caller is referring to. The values SHOULD be members of `[AuthenticatorTransport](#enumdef-authenticatortransport)` but [client platforms](#client-platform) MUST ignore unknown values.

The `[getTransports()](#dom-authenticatorattestationresponse-gettransports)` operation can provide suitable values for this member. When [registering a new credential](#sctn-registering-a-new-credential), the [Relying Party](#relying-party) SHOULD store the value returned from `[getTransports()](#dom-authenticatorattestationresponse-gettransports)`. When creating a `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)` for that credential, the [Relying Party](#relying-party) SHOULD retrieve that stored value and set it as the value of the `[transports](#dom-publickeycredentialdescriptor-transports)` member.

#### 5.8.4. Authenticator Transport Enumeration (enum `AuthenticatorTransport`)[](#enum-transport)

enum [AuthenticatorTransport](#enumdef-authenticatortransport) {
    ["usb"](#dom-authenticatortransport-usb),
    ["nfc"](#dom-authenticatortransport-nfc),
    ["ble"](#dom-authenticatortransport-ble),
    ["internal"](#dom-authenticatortransport-internal)
};

Note: The `[AuthenticatorTransport](#enumdef-authenticatortransport)` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).

[Authenticators](#authenticator) may implement various [transports](#enum-transport) for communicating with [clients](#client). This enumeration defines hints as to how clients might communicate with a particular authenticator in order to obtain an assertion for a specific credential. Note that these hints represent the [WebAuthn Relying Party](#webauthn-relying-party)'s best belief as to how an authenticator may be reached. A [Relying Party](#relying-party) will typically learn of the supported transports for a [public key credential](#public-key-credential) via `[getTransports()](#dom-authenticatorattestationresponse-gettransports)`.

`usb`

Indicates the respective [authenticator](#authenticator) can be contacted over removable USB.

`nfc`

Indicates the respective [authenticator](#authenticator) can be contacted over Near Field Communication (NFC).

`ble`

Indicates the respective [authenticator](#authenticator) can be contacted over Bluetooth Smart (Bluetooth Low Energy / BLE).

`internal`

Indicates the respective [authenticator](#authenticator) is contacted using a [client device](#client-device)-specific transport, i.e., it is a [platform authenticator](#platform-authenticators). These authenticators are not removable from the [client device](#client-device).

#### 5.8.5. Cryptographic Algorithm Identifier (typedef `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)`)[](#sctn-alg-identifier)

typedef [long](https://heycam.github.io/webidl/#idl-long) `COSEAlgorithmIdentifier`;

A `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)`'s value is a number identifying a cryptographic algorithm. The algorithm identifiers SHOULD be values registered in the IANA COSE Algorithms registry [[IANA-COSE-ALGS-REG]](#biblio-iana-cose-algs-reg), for instance, `-7` for "ES256" and `-257` for "RS256".

The COSE algorithms registry leaves degrees of freedom to be specified by other parameters in a [COSE key](https://tools.ietf.org/html/rfc8152#section-7). In order to promote interoperability, this specification makes the following additional guarantees of [credential public keys](#credential-public-key):

1. Keys with algorithm ES256 (-7) MUST specify P-256 (1) as the [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) parameter and MUST NOT use the compressed point form.
    
2. Keys with algorithm ES384 (-35) MUST specify P-384 (2) as the [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) parameter and MUST NOT use the compressed point form.
    
3. Keys with algorithm ES512 (-36) MUST specify P-521 (3) as the [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) parameter and MUST NOT use the compressed point form.
    
4. Keys with algorithm EdDSA (-8) MUST specify Ed25519 (6) as the [crv](https://tools.ietf.org/html/rfc8152#section-13.1.1) parameter. (These always use a compressed form in COSE.)
    

Note: There are many checks neccessary to correctly implement signature verification using these algorithms. One of these is that, when processing uncompressed elliptic-curve points, implementations should check that the point is actually on the curve. This check is highlighted because it’s judged to be at particular risk of falling through the gap between a cryptographic library and other code.

#### 5.8.6. User Verification Requirement Enumeration (enum `UserVerificationRequirement`)[](#enum-userVerificationRequirement)

enum [UserVerificationRequirement](#enumdef-userverificationrequirement) {
    ["required"](#dom-userverificationrequirement-required),
    ["preferred"](#dom-userverificationrequirement-preferred),
    ["discouraged"](#dom-userverificationrequirement-discouraged)
};

A [WebAuthn Relying Party](#webauthn-relying-party) may require [user verification](#user-verification) for some of its operations but not for others, and may use this type to express its needs.

Note: The `[UserVerificationRequirement](#enumdef-userverificationrequirement)` enumeration is deliberately not referenced, see [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).

`required`

This value indicates that the [Relying Party](#relying-party) requires [user verification](#user-verification) for the operation and will fail the operation if the response does not have the [UV](#uv) [flag](#flags) set.

`preferred`

This value indicates that the [Relying Party](#relying-party) prefers [user verification](#user-verification) for the operation if possible, but will not fail the operation if the response does not have the [UV](#uv) [flag](#flags) set.

`discouraged`

This value indicates that the [Relying Party](#relying-party) does not want [user verification](#user-verification) employed during the operation (e.g., in the interest of minimizing disruption to the user interaction flow).

### 5.9. Permissions Policy integration[](#sctn-permissions-policy)

[Headers/Feature-Policy/publickey-credentials-get](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy/publickey-credentials-get "The HTTP Feature-Policy header publickey-credentials-get directive controls whether the current document is allowed to access Web Authentcation API to create new public-key credentials, i.e, via navigator.credentials.get({publicKey: ..., ...}).")

In only one current engine.

FirefoxNoneSafariNoneChrome84+

---

OperaNoneEdge84+

---

Edge (Legacy)NoneIENone

---

Firefox for AndroidNoneiOS SafariNoneChrome for Android84+Android WebView84+Samsung InternetNoneOpera MobileNone

This specification defines one [policy-controlled feature](https://w3c.github.io/webappsec-permissions-policy/#policy-controlled-feature) identified by the feature-identifier token "`publickey-credentials-get`". Its [default allowlist](https://w3c.github.io/webappsec-permissions-policy/#default-allowlist) is '`self`'. [[Permissions-Policy]](#biblio-permissions-policy)

A `[Document](https://dom.spec.whatwg.org/#document)`'s [permissions policy](https://html.spec.whatwg.org/multipage/dom.html#concept-document-permissions-policy) determines whether any content in that [document](https://html.spec.whatwg.org/multipage/dom.html#documents) is [allowed to successfully invoke](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#allowed-to-use) the [Web Authentication API](#web-authentication-api), i.e., via `[navigator.credentials.get({publicKey:..., ...})](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`. If disabled in any document, no content in the document will be [allowed to use](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#allowed-to-use) the foregoing methods: attempting to do so will [return an error](https://www.w3.org/2001/tag/doc/promises-guide#errors).

Note: Algorithms specified in [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1) perform the actual permissions policy evaluation. This is because such policy evaluation needs to occur when there is access to the [current settings object](https://html.spec.whatwg.org/multipage/webappapis.html#current-settings-object). The `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` and `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` [internal methods](https://tc39.github.io/ecma262/#sec-object-internal-methods-and-internal-slots) do not have such access since they are invoked [in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel) (by algorithms specified in [[CREDENTIAL-MANAGEMENT-1]](#biblio-credential-management-1)).

### 5.10. Using Web Authentication within `iframe` elements[](#sctn-iframe-guidance)

The [Web Authentication API](#web-authentication-api) is disabled by default in cross-origin `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)`s. To override this default policy and indicate that a cross-origin `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` is allowed to invoke the [Web Authentication API](#web-authentication-api)'s `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` method, specify the `[allow](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-allow)` attribute on the `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` element and include the `[publickey-credentials-get](#publickey-credentials-get-feature)` feature-identifier token in the `[allow](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-allow)` attribute’s value.

[Relying Parties](#relying-party) utilizing the WebAuthn API in an embedded context should review [§ 13.4.2 Visibility Considerations for Embedded Usage](#sctn-seccons-visibility) regarding [UI redressing](#ui-redressing) and its possible mitigations.

## 6. WebAuthn Authenticator Model[](#sctn-authenticator-model)

[The Web Authentication API](#sctn-api) implies a specific abstract functional model for a [WebAuthn Authenticator](#webauthn-authenticator). This section describes that [authenticator model](#authenticator-model).

[Client platforms](#client-platform) MAY implement and expose this abstract model in any way desired. However, the behavior of the client’s Web Authentication API implementation, when operating on the authenticators supported by that [client platform](#client-platform), MUST be indistinguishable from the behavior specified in [§ 5 Web Authentication API](#sctn-api).

Note: [[FIDO-CTAP]](#biblio-fido-ctap) is an example of a concrete instantiation of this model, but it is one in which there are differences in the data it returns and those expected by the [WebAuthn API](#sctn-api)'s algorithms. The CTAP2 response messages are CBOR maps constructed using integer keys rather than the string keys defined in this specification for the same objects. The [client](#client) is expected to perform any needed transformations on such data. The [[FIDO-CTAP]](#biblio-fido-ctap) specification details the mapping between CTAP2 integer keys and WebAuthn string keys, in section [§6.2. Responses](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#responses).

For authenticators, this model defines the logical operations that they MUST support, and the data formats that they expose to the client and the [WebAuthn Relying Party](#webauthn-relying-party). However, it does not define the details of how authenticators communicate with the [client device](#client-device), unless they are necessary for interoperability with [Relying Parties](#relying-party). For instance, this abstract model does not define protocols for connecting authenticators to clients over transports such as USB or NFC. Similarly, this abstract model does not define specific error codes or methods of returning them; however, it does define error behavior in terms of the needs of the client. Therefore, specific error codes are mentioned as a means of showing which error conditions MUST be distinguishable (or not) from each other in order to enable a compliant and secure client implementation.

[Relying Parties](#relying-party) may influence authenticator selection, if they deem necessary, by stipulating various authenticator characteristics when [creating credentials](#sctn-createCredential) and/or when [generating assertions](#sctn-getAssertion), through use of [credential creation options](#dictionary-makecredentialoptions) or [assertion generation options](#dictionary-assertion-options), respectively. The algorithms underlying the [WebAuthn API](#sctn-api) marshal these options and pass them to the applicable [authenticator operations](#sctn-authenticator-ops) defined below.

In this abstract model, the authenticator provides key management and cryptographic signatures. It can be embedded in the WebAuthn client or housed in a separate device entirely. The authenticator itself can contain a cryptographic module which operates at a higher security level than the rest of the authenticator. This is particularly important for authenticators that are embedded in the WebAuthn client, as in those cases this cryptographic module (which may, for example, be a TPM) could be considered more trustworthy than the rest of the authenticator.

Each authenticator stores a credentials map, a [map](https://infra.spec.whatwg.org/#ordered-map) from ([rpId](#public-key-credential-source-rpid), [[userHandle](#public-key-credential-source-userhandle)]) to [public key credential source](#public-key-credential-source).

Additionally, each authenticator has an AAGUID, which is a 128-bit identifier indicating the type (e.g. make and model) of the authenticator. The AAGUID MUST be chosen by the manufacturer to be identical across all substantially identical authenticators made by that manufacturer, and different (with high probability) from the AAGUIDs of all other types of authenticators. The AAGUID for a given type of authenticator SHOULD be randomly generated to ensure this. The [Relying Party](#relying-party) MAY use the AAGUID to infer certain properties of the authenticator, such as certification level and strength of key protection, using information from other sources.

The primary function of the authenticator is to provide [WebAuthn signatures](#webauthn-signature), which are bound to various contextual data. These data are observed and added at different levels of the stack as a signature request passes from the server to the authenticator. In verifying a signature, the server checks these bindings against expected values. These contextual bindings are divided in two: Those added by the [Relying Party](#relying-party) or the client, referred to as [client data](#client-data); and those added by the authenticator, referred to as the [authenticator data](#authenticator-data). The authenticator signs over the [client data](#client-data), but is otherwise not interested in its contents. To save bandwidth and processing requirements on the authenticator, the client hashes the [client data](#client-data) and sends only the result to the authenticator. The authenticator signs over the combination of the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data), and its own [authenticator data](#authenticator-data).

The goals of this design can be summarized as follows.

- The scheme for generating signatures should accommodate cases where the link between the [client device](#client-device) and authenticator is very limited, in bandwidth and/or latency. Examples include Bluetooth Low Energy and Near-Field Communication.
    
- The data processed by the authenticator should be small and easy to interpret in low-level code. In particular, authenticators should not have to parse high-level encodings such as JSON.
    
- Both the [client](#client) and the authenticator should have the flexibility to add contextual bindings as needed.
    
- The design aims to reuse as much as possible of existing encoding formats in order to aid adoption and implementation.
    

Authenticators produce cryptographic signatures for two distinct purposes:

1. An attestation signature is produced when a new [public key credential](#public-key-credential) is created via an [authenticatorMakeCredential](#authenticatormakecredential) operation. An [attestation signature](#attestation-signature) provides cryptographic proof of certain properties of the [authenticator](#authenticator) and the credential. For instance, an [attestation signature](#attestation-signature) asserts the [authenticator](#authenticator) type (as denoted by its AAGUID) and the [credential public key](#credential-public-key). The [attestation signature](#attestation-signature) is signed by an [attestation private key](#attestation-private-key), which is chosen depending on the type of [attestation](#attestation) desired. For more details on [attestation](#attestation), see [§ 6.5 Attestation](#sctn-attestation).
    
2. An assertion signature is produced when the [authenticatorGetAssertion](#authenticatorgetassertion) method is invoked. It represents an assertion by the [authenticator](#authenticator) that the user has [consented](#user-consent) to a specific transaction, such as logging in, or completing a purchase. Thus, an [assertion signature](#assertion-signature) asserts that the [authenticator](#authenticator) possessing a particular [credential private key](#credential-private-key) has established, to the best of its ability, that the user requesting this transaction is the same user who [consented](#user-consent) to creating that particular [public key credential](#public-key-credential). It also asserts additional information, termed [client data](#client-data), that may be useful to the caller, such as the means by which [user consent](#user-consent) was provided, and the prompt shown to the user by the [authenticator](#authenticator). The [assertion signature](#assertion-signature) format is illustrated in [Figure 4, below](#fig-signature).
    

The term WebAuthn signature refers to both [attestation signatures](#attestation-signature) and [assertion signatures](#assertion-signature). The formats of these signatures, as well as the procedures for generating them, are specified below.

### 6.1. Authenticator Data[](#sctn-authenticator-data)

The authenticator data structure encodes contextual bindings made by the [authenticator](#authenticator). These bindings are controlled by the authenticator itself, and derive their trust from the [WebAuthn Relying Party](#webauthn-relying-party)'s assessment of the security properties of the authenticator. In one extreme case, the authenticator may be embedded in the client, and its bindings may be no more trustworthy than the [client data](#client-data). At the other extreme, the authenticator may be a discrete entity with high-security hardware and software, connected to the client over a secure channel. In both cases, the [Relying Party](#relying-party) receives the [authenticator data](#authenticator-data) in the same format, and uses its knowledge of the authenticator to make trust decisions.

The [authenticator data](#authenticator-data) has a compact but extensible encoding. This is desired since authenticators can be devices with limited capabilities and low power requirements, with much simpler software stacks than the [client platform](#client-platform).

The [authenticator data](#authenticator-data) structure is a byte array of 37 bytes or more, laid out as shown in [Table](#table-authData) .

|Name|Length (in bytes)|Description|
|---|---|---|
|rpIdHash|32|SHA-256 hash of the [RP ID](#rp-id) the [credential](#public-key-credential) is [scoped](#scope) to.|
|flags|1|Flags (bit 0 is the least significant bit):<br><br>- Bit 0: [User Present](#concept-user-present) ([UP](#up)) result.<br>    <br>    - `1` means the user is [present](#concept-user-present).<br>        <br>    - `0` means the user is not [present](#concept-user-present).<br>        <br>- Bit 1: Reserved for future use (`RFU1`).<br>    <br>- Bit 2: [User Verified](#concept-user-verified) ([UV](#uv)) result.<br>    <br>    - `1` means the user is [verified](#concept-user-verified).<br>        <br>    - `0` means the user is not [verified](#concept-user-verified).<br>        <br>- Bits 3-5: Reserved for future use (`RFU2`).<br>    <br>- Bit 6: [Attested credential data](#attested-credential-data) included (`AT`).<br>    <br>    - Indicates whether the authenticator added [attested credential data](#attested-credential-data).<br>        <br>- Bit 7: Extension data included (`ED`).<br>    <br>    - Indicates if the [authenticator data](#authenticator-data) has [extensions](#authdataextensions).|
|signCount|4|[Signature counter](#signature-counter), 32-bit unsigned big-endian integer.|
|attestedCredentialData|variable (if present)|[attested credential data](#attested-credential-data) (if present). See [§ 6.5.1 Attested Credential Data](#sctn-attested-credential-data) for details. Its length depends on the [length](#credentialidlength) of the [credential ID](#credentialid) and [credential public key](#credentialpublickey) being attested.|
|extensions|variable (if present)|Extension-defined [authenticator data](#authenticator-data). This is a [CBOR](#cbor) [[RFC8949]](#biblio-rfc8949) map with [extension identifiers](#extension-identifier) as keys, and [authenticator extension outputs](#authenticator-extension-output) as values. See [§ 9 WebAuthn Extensions](#sctn-extensions) for details.|

[Authenticator data](#authenticator-data) layout. The names in the Name column are only for reference within this document, and are not present in the actual representation of the [authenticator data](#authenticator-data).

The [RP ID](#rp-id) is originally received from the [client](#client) when the credential is created, and again when an [assertion](#assertion) is generated. However, it differs from other [client data](#client-data) in some important ways. First, unlike the [client data](#client-data), the [RP ID](#rp-id) of a credential does not change between operations but instead remains the same for the lifetime of that credential. Secondly, it is validated by the authenticator during the [authenticatorGetAssertion](#authenticatorgetassertion) operation, by verifying that the [RP ID](#rp-id) that the requested [credential](#public-key-credential) is [scoped](#scope) to exactly matches the [RP ID](#rp-id) supplied by the [client](#client).

[Authenticators](#authenticator) perform the following steps to generate an [authenticator data](#authenticator-data) structure:

- Hash [RP ID](#rp-id) using SHA-256 to generate the [rpIdHash](#rpidhash).
    
- The `UP` [flag](#flags) SHALL be set if and only if the authenticator performed a [test of user presence](#test-of-user-presence). The `UV` [flag](#flags) SHALL be set if and only if the authenticator performed [user verification](#user-verification). The `RFU` bits SHALL be set to zero.
    
    Note: If the authenticator performed both a [test of user presence](#test-of-user-presence) and [user verification](#user-verification), possibly combined in a single [authorization gesture](#authorization-gesture), then the authenticator will set both the `UP` [flag](#flags) and the `UV` [flag](#flags).
    
- For [attestation signatures](#attestation-signature), the authenticator MUST set the AT [flag](#flags) and include the `[attestedCredentialData](#attestedcredentialdata)`. For [assertion signatures](#assertion-signature), the AT [flag](#flags) MUST NOT be set and the `[attestedCredentialData](#attestedcredentialdata)` MUST NOT be included.
    
- If the authenticator does not include any [extension data](#authdataextensions), it MUST set the `ED` [flag](#flags) to zero, and to one if [extension data](#authdataextensions) is included.
    

[Figure](#fig-authData) shows a visual representation of the [authenticator data](#authenticator-data) structure.

![](https://www.w3.org/TR/webauthn-2/images/fido-signature-formats-figure1.svg)

[Authenticator data](#authenticator-data) layout.

Note: [authenticator data](#authenticator-data) describes its own length: If the AT and ED [flags](#flags) are not set, it is always 37 bytes long. The [attested credential data](#attested-credential-data) (which is only present if the AT [flag](#flags) is set) describes its own length. If the ED [flag](#flags) is set, then the total length is 37 bytes plus the length of the [attested credential data](#attested-credential-data) (if the AT [flag](#flags) is set), plus the length of the [extensions](#authdataextensions) output (a [CBOR](#cbor) map) that follows.

Determining [attested credential data](#attested-credential-data)'s length, which is variable, involves determining `[credentialPublicKey](#credentialpublickey)`’s beginning location given the preceding `[credentialId](#credentialid)`’s [length](#credentialidlength), and then determining the `[credentialPublicKey](#credentialpublickey)`’s length (see also [Section 7](https://tools.ietf.org/html/rfc8152#section-7) of [[RFC8152]](#biblio-rfc8152)).

#### 6.1.1. Signature Counter Considerations[](#sctn-sign-counter)

Authenticators SHOULD implement a [signature counter](#signature-counter) feature. These counters are conceptually stored for each credential by the authenticator, or globally for the authenticator as a whole. The initial value of a credential’s [signature counter](#signature-counter) is specified in the `[signCount](#signcount)` value of the [authenticator data](#authenticator-data) returned by [authenticatorMakeCredential](#authenticatormakecredential). The [signature counter](#signature-counter) is incremented for each successful [authenticatorGetAssertion](#authenticatorgetassertion) operation by some positive value, and subsequent values are returned to the [WebAuthn Relying Party](#webauthn-relying-party) within the [authenticator data](#authenticator-data) again. The [signature counter](#signature-counter)'s purpose is to aid [Relying Parties](#relying-party) in detecting cloned authenticators. Clone detection is more important for authenticators with limited protection measures.

A [Relying Party](#relying-party) stores the [signature counter](#signature-counter) of the most recent [authenticatorGetAssertion](#authenticatorgetassertion) operation. (Or the counter from the [authenticatorMakeCredential](#authenticatormakecredential) operation if no [authenticatorGetAssertion](#authenticatorgetassertion) has ever been performed on a credential.) In subsequent [authenticatorGetAssertion](#authenticatorgetassertion) operations, the [Relying Party](#relying-party) compares the stored [signature counter](#signature-counter) value with the new `[signCount](#signcount)` value returned in the assertion’s [authenticator data](#authenticator-data). If either is non-zero, and the new `[signCount](#signcount)` value is less than or equal to the stored value, a cloned authenticator may exist, or the authenticator may be malfunctioning.

Detecting a [signature counter](#signature-counter) mismatch does not indicate whether the current operation was performed by a cloned authenticator or the original authenticator. [Relying Parties](#relying-party) should address this situation appropriately relative to their individual situations, i.e., their risk tolerance.

Authenticators:

- SHOULD implement per credential [signature counters](#signature-counter). This prevents the [signature counter](#signature-counter) value from being shared between [Relying Parties](#relying-party) and being possibly employed as a correlation handle for the user. Authenticators may implement a global [signature counter](#signature-counter), i.e., on a per-authenticator basis, but this is less privacy-friendly for users.
    
- SHOULD ensure that the [signature counter](#signature-counter) value does not accidentally decrease (e.g., due to hardware failures).
    

#### 6.1.2. FIDO U2F Signature Format Compatibility[](#sctn-fido-u2f-sig-format-compat)

The format for [assertion signatures](#assertion-signature), which sign over the concatenation of an [authenticator data](#authenticator-data) structure and the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data), are compatible with the FIDO U2F authentication signature format (see [Section 5.4](https://fidoalliance.org/specs/fido-u2f-v1.1-id-20160915/fido-u2f-raw-message-formats-v1.1-id-20160915.html#authentication-response-message-success) of [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats)).

This is because the first 37 bytes of the signed data in a FIDO U2F authentication response message constitute a valid [authenticator data](#authenticator-data) structure, and the remaining 32 bytes are the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data). In this [authenticator data](#authenticator-data) structure, the `[rpIdHash](#rpidhash)` is the FIDO U2F [application parameter](https://fidoalliance.org/specs/fido-u2f-v1.1-id-20160915/fido-u2f-raw-message-formats-v1.1-id-20160915.html#authentication-request-message---u2f_authenticate), all `[flags](#flags)` except `[UP](#up)` are always zero, and the `[attestedCredentialData](#attestedcredentialdata)` and `[extensions](#authdataextensions)` are never present. FIDO U2F authentication signatures can therefore be verified by the same procedure as other [assertion signatures](#assertion-signature) generated by the [authenticatorMakeCredential](#authenticatormakecredential) operation.

### 6.2. Authenticator Taxonomy[](#sctn-authenticator-taxonomy)

Many use cases are dependent on the capabilities of the [authenticator](#authenticator) used. This section defines some terminology for those capabilities, their most important combinations, and which use cases those combinations enable.

For example:

- When authenticating for the first time on a particular [client device](#client-device), a [roaming authenticator](#roaming-authenticators) is typically needed since the user doesn’t yet have a [platform credential](#platform-credential) on that [client device](#client-device).
    
- For subsequent re-authentication on the same [client device](#client-device), a [platform authenticator](#platform-authenticators) is likely the most convenient since it’s built directly into the [client device](#client-device) rather than being a separate device that the user may have to locate.
    
- For [second-factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) authentication in addition to a traditional username and password, any [authenticator](#authenticator) can be used.
    
- Passwordless [multi-factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) authentication requires an [authenticator](#authenticator) capable of [user verification](#user-verification), and in some cases also [discoverable credential capable](#discoverable-credential-capable).
    
- A laptop computer might support connecting to [roaming authenticators](#roaming-authenticators) via USB and Bluetooth, while a mobile phone might only support NFC.
    

The above examples illustrate the the primary authenticator type characteristics:

- Whether the [authenticator](#authenticator) is a [roaming](#roaming-authenticators) or [platform](#platform-authenticators) authenticator — the [authenticator attachment modality](#authenticator-attachment-modality). A [roaming authenticator](#roaming-authenticators) can support one or more [transports](#enum-transport) for communicating with the [client](#client).
    
- Whether the authenticator is capable of [user verification](#user-verification) — the [authentication factor capability](#authentication-factor-capability).
    
- Whether the authenticator is [discoverable credential capable](#discoverable-credential-capable) — the [credential storage modality](#credential-storage-modality).
    

These characteristics are independent and may in theory be combined in any way, but [Table](#table-authenticatorTypes) lists and names some [authenticator types](#authenticator-type) of particular interest.

|[Authenticator Type](#authenticator-type)|[Authenticator Attachment Modality](#authenticator-attachment-modality)|[Credential Storage Modality](#credential-storage-modality)|[Authentication Factor Capability](#authentication-factor-capability)|
|---|---|---|---|
|Second-factor platform authenticator|[platform](#platform-attachment)|Either|[Single-factor capable](#single-factor-capable)|
|User-verifying platform authenticator|[platform](#platform-attachment)|Either|[Multi-factor capable](#multi-factor-capable)|
|Second-factor roaming authenticator|[cross-platform](#cross-platform-attachment)|[Server-side storage](#server-side-credential-storage-modality)|[Single-factor capable](#single-factor-capable)|
|First-factor roaming authenticator|[cross-platform](#cross-platform-attachment)|[Client-side storage](#client-side-credential-storage-modality)|[Multi-factor capable](#multi-factor-capable)|

Definitions of names for some [authenticator types](#authenticator-type).

A [second-factor platform authenticator](#second-factor-platform-authenticator) is convenient to use for re-authentication on the same [client device](#client-device), and can be used to add an extra layer of security both when initiating a new session and when resuming an existing session. A [second-factor roaming authenticator](#second-factor-roaming-authenticator) is more likely to be used to authenticate on a particular [client device](#client-device) for the first time, or on a [client device](#client-device) shared between multiple users.

[User-verifying platform authenticators](#user-verifying-platform-authenticator) and [first-factor roaming authenticators](#first-factor-roaming-authenticator) enable passwordless [multi-factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) authentication. In addition to the proof of possession of the [credential private key](#credential-private-key), these authenticators support [user verification](#user-verification) as a second [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af), typically a PIN or [biometric recognition](#biometric-recognition). The [authenticator](#authenticator) can thus act as two kinds of [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af), which enables [multi-factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) authentication while eliminating the need to share a password with the [Relying Party](#relying-party).

The four combinations not named in [Table](#table-authenticatorTypes) have less distinguished use cases:

- The [credential storage modality](#credential-storage-modality) is less relevant for a [platform authenticator](#platform-authenticators) than for a [roaming authenticator](#roaming-authenticators), since users using a [platform authenticator](#platform-authenticators) can typically be identified by a session cookie or the like (i.e., ambient credentials).
    
- A [roaming authenticator](#roaming-authenticators) that is [discoverable credential capable](#discoverable-credential-capable) but not [multi-factor capable](#multi-factor-capable) can be used for [single-factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#sf) authentication without a username, where the user is automatically identified by the [user handle](#user-handle) and possession of the [credential private key](#credential-private-key) is used as the only [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af). This can be useful in some situations, but makes the user particularly vulnerable to theft of the [authenticator](#authenticator).
    
- A [roaming authenticator](#roaming-authenticators) that is [multi-factor capable](#multi-factor-capable) but not [discoverable credential capable](#discoverable-credential-capable) can be used for [multi-factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) authentication, but requires the user to be identified first which risks leaking personally identifying information; see [§ 14.6.3 Privacy leak via credential IDs](#sctn-credential-id-privacy-leak).
    

The following subsections define the aspects [authenticator attachment modality](#authenticator-attachment-modality), [credential storage modality](#credential-storage-modality) and [authentication factor capability](#authentication-factor-capability) in more depth.

#### 6.2.1. Authenticator Attachment Modality[](#sctn-authenticator-attachment-modality)

[Clients](#client) can communicate with [authenticators](#authenticator) using a variety of mechanisms. For example, a [client](#client) MAY use a [client device](#client-device)-specific API to communicate with an [authenticator](#authenticator) which is physically bound to a [client device](#client-device). On the other hand, a [client](#client) can use a variety of standardized cross-platform transport protocols such as Bluetooth (see [§ 5.8.4 Authenticator Transport Enumeration (enum AuthenticatorTransport)](#enum-transport)) to discover and communicate with [cross-platform attached](#cross-platform-attachment) [authenticators](#authenticator). We refer to [authenticators](#authenticator) that are part of the [client device](#client-device) as platform authenticators, while those that are reachable via cross-platform transport protocols are referred to as roaming authenticators.

- A [platform authenticator](#platform-authenticators) is attached using a [client device](#client-device)-specific transport, called platform attachment, and is usually not removable from the [client device](#client-device). A [public key credential](#public-key-credential) [bound](#bound-credential) to a [platform authenticator](#platform-authenticators) is called a platform credential.
    
- A [roaming authenticator](#roaming-authenticators) is attached using cross-platform transports, called cross-platform attachment. Authenticators of this class are removable from, and can "roam" between, [client devices](#client-device). A [public key credential](#public-key-credential) [bound](#bound-credential) to a [roaming authenticator](#roaming-authenticators) is called a roaming credential.
    

Some [platform authenticators](#platform-authenticators) could possibly also act as [roaming authenticators](#roaming-authenticators) depending on context. For example, a [platform authenticator](#platform-authenticators) integrated into a mobile device could make itself available as a [roaming authenticator](#roaming-authenticators) via Bluetooth. In this case [clients](#client) running on the mobile device would recognise the authenticator as a [platform authenticator](#platform-authenticators), while [clients](#client) running on a different [client device](#client-device) and communicating with the same authenticator via Bluetooth would recognize it as a [roaming authenticator](#roaming-authenticators).

The primary use case for [platform authenticators](#platform-authenticators) is to register a particular [client device](#client-device) as a "trusted device", so the [client device](#client-device) itself acts as a [something you have](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) for future [authentication](#authentication). This gives the user the convenience benefit of not needing a [roaming authenticator](#roaming-authenticators) for future [authentication ceremonies](#authentication-ceremony), e.g., the user will not have to dig around in their pocket for their key fob or phone.

Use cases for [roaming authenticators](#roaming-authenticators) include: [authenticating](#authentication) on a new [client device](#client-device) for the first time, on rarely used [client devices](#client-device), [client devices](#client-device) shared between multiple users, or [client devices](#client-device) that do not include a [platform authenticator](#platform-authenticators); and when policy or preference dictates that the [authenticator](#authenticator) be kept separate from the [client devices](#client-device) it is used with. A [roaming authenticator](#roaming-authenticators) can also be used to hold backup [credentials](#public-key-credential) in case another [authenticator](#authenticator) is lost.

#### 6.2.2. Credential Storage Modality[](#sctn-credential-storage-modality)

An [authenticator](#authenticator) can store a [public key credential source](#public-key-credential-source) in one of two ways:

1. In persistent storage embedded in the [authenticator](#authenticator), [client](#client) or [client device](#client-device), e.g., in a secure element. This is a technical requirement for a [client-side discoverable public key credential source](#client-side-discoverable-public-key-credential-source).
    
2. By encrypting (i.e., wrapping) the [credential private key](#credential-private-key) such that only this [authenticator](#authenticator) can decrypt (i.e., unwrap) it and letting the resulting ciphertext be the [credential ID](#credential-id) for the [public key credential source](#public-key-credential-source). The [credential ID](#credential-id) is stored by the [Relying Party](#relying-party) and returned to the [authenticator](#authenticator) via the `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` option of `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`, which allows the [authenticator](#authenticator) to decrypt and use the [credential private key](#credential-private-key).
    
    This enables the [authenticator](#authenticator) to have unlimited storage capacity for [credential private keys](#credential-private-key), since the encrypted [credential private keys](#credential-private-key) are stored by the [Relying Party](#relying-party) instead of by the [authenticator](#authenticator) - but it means that a [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) stored in this way must be retrieved from the [Relying Party](#relying-party) before the [authenticator](#authenticator) can use it.
    

Which of these storage strategies an [authenticator](#authenticator) supports defines the [authenticator](#authenticator)'s credential storage modality as follows:

- An [authenticator](#authenticator) has the client-side credential storage modality if it supports [client-side discoverable public key credential sources](#client-side-discoverable-public-key-credential-source). An [authenticator](#authenticator) with [client-side credential storage modality](#client-side-credential-storage-modality) is also called discoverable credential capable.
    
- An [authenticator](#authenticator) has the server-side credential storage modality if it does not have the [client-side credential storage modality](#client-side-credential-storage-modality), i.e., it only supports storing [credential private keys](#credential-private-key) as a ciphertext in the [credential ID](#credential-id).
    

Note that a [discoverable credential capable](#discoverable-credential-capable) [authenticator](#authenticator) MAY support both storage strategies. In this case, the [authenticator](#authenticator) MAY at its discretion use different storage strategies for different [credentials](#public-key-credential), though subject to the `[residentKey](#dom-authenticatorselectioncriteria-residentkey)` or `[requireResidentKey](#dom-authenticatorselectioncriteria-requireresidentkey)` options of `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)`.

#### 6.2.3. Authentication Factor Capability[](#sctn-authentication-factor-capability)

There are three broad classes of [authentication factors](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) that can be used to prove an identity during an [authentication ceremony](#authentication-ceremony): [something you have](https://pages.nist.gov/800-63-3/sp800-63-3.html#af), [something you know](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) and [something you are](https://pages.nist.gov/800-63-3/sp800-63-3.html#af). Examples include a physical key, a password, and a fingerprint, respectively.

All [WebAuthn Authenticators](#webauthn-authenticator) belong to the [something you have](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) class, but an [authenticator](#authenticator) that supports [user verification](#user-verification) can also act as one or two additional kinds of [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af). For example, if the [authenticator](#authenticator) can verify a PIN, the PIN is [something you know](https://pages.nist.gov/800-63-3/sp800-63-3.html#af), and a [biometric authenticator](#biometric-authenticator) can verify [something you are](https://pages.nist.gov/800-63-3/sp800-63-3.html#af). Therefore, an [authenticator](#authenticator) that supports [user verification](#user-verification) is multi-factor capable. Conversely, an [authenticator](#authenticator) that is not [multi-factor capable](#multi-factor-capable) is single-factor capable. Note that a single [multi-factor capable](#multi-factor-capable) [authenticator](#authenticator) could support several modes of [user verification](#user-verification), meaning it could act as all three kinds of [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af).

Although [user verification](#user-verification) is performed locally on the [authenticator](#authenticator) and not by the [Relying Party](#relying-party), the [authenticator](#authenticator) indicates if [user verification](#user-verification) was performed by setting the [UV](#uv) [flag](#flags) in the signed response returned to the [Relying Party](#relying-party). The [Relying Party](#relying-party) can therefore use the [UV](#uv) flag to verify that additional [authentication factors](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) were used in a [registration](#registration) or [authentication ceremony](#authentication-ceremony). The authenticity of the [UV](#uv) [flag](#flags) can in turn be assessed by inspecting the [authenticator](#authenticator)'s [attestation statement](#attestation-statement).

### 6.3. Authenticator Operations[](#sctn-authenticator-ops)

A [WebAuthn Client](#webauthn-client) MUST connect to an authenticator in order to invoke any of the operations of that authenticator. This connection defines an authenticator session. An authenticator must maintain isolation between sessions. It may do this by only allowing one session to exist at any particular time, or by providing more complicated session management.

The following operations can be invoked by the client in an authenticator session.

#### 6.3.1. Lookup Credential Source by Credential ID Algorithm[](#sctn-op-lookup-credsource-by-credid)

The result of looking up a [credential id](#credential-id) credentialId in an [authenticator](#authenticator) authenticator is the result of the following algorithm:

1. If authenticator can decrypt credentialId into a [public key credential source](#public-key-credential-source) credSource:
    
    1. Set credSource.[id](#public-key-credential-source-id) to credentialId.
        
    2. Return credSource.
        
2. [For each](https://infra.spec.whatwg.org/#map-iterate) [public key credential source](#public-key-credential-source) credSource of authenticator’s [credentials map](#authenticator-credentials-map):
    
    1. If credSource.[id](#public-key-credential-source-id) is credentialId, return credSource.
        
3. Return `null`.
    

#### 6.3.2. The authenticatorMakeCredential Operation[](#sctn-op-make-cred)

It takes the following input parameters:

hash

The [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data), provided by the client.

rpEntity

The [Relying Party](#relying-party)'s `[PublicKeyCredentialRpEntity](#dictdef-publickeycredentialrpentity)`.

userEntity

The user account’s `[PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity)`, containing the [user handle](#user-handle) given by the [Relying Party](#relying-party).

requireResidentKey

The [effective resident key requirement for credential creation](#effective-resident-key-requirement-for-credential-creation), a Boolean value determined by the [client](#client).

requireUserPresence

The constant Boolean value `true`. It is included here as a pseudo-parameter to simplify applying this abstract authenticator model to implementations that may wish to make a [test of user presence](#test-of-user-presence) optional although WebAuthn does not.

requireUserVerification

The [effective user verification requirement for credential creation](#effective-user-verification-requirement-for-credential-creation), a Boolean value determined by the [client](#client).

credTypesAndPubKeyAlgs

A sequence of pairs of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` and public key algorithms (`[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)`) requested by the [Relying Party](#relying-party). This sequence is ordered from most preferred to least preferred. The [authenticator](#authenticator) makes a best-effort to create the most preferred credential that it can.

excludeCredentialDescriptorList

An OPTIONAL list of `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)` objects provided by the [Relying Party](#relying-party) with the intention that, if any of these are known to the authenticator, it SHOULD NOT create a new credential. excludeCredentialDescriptorList contains a list of known credentials.

enterpriseAttestationPossible

A Boolean value that indicates that individually-identifying attestation MAY be returned by the authenticator.

extensions

A [CBOR](#cbor) [map](https://infra.spec.whatwg.org/#ordered-map) from [extension identifiers](#extension-identifier) to their [authenticator extension inputs](#authenticator-extension-input), created by the [client](#client) based on the extensions requested by the [Relying Party](#relying-party), if any.

Note: Before performing this operation, all other operations in progress in the [authenticator session](#authenticator-session) MUST be aborted by running the [authenticatorCancel](#authenticatorcancel) operation.

When this operation is invoked, the [authenticator](#authenticator) MUST perform the following procedure:

1. Check if all the supplied parameters are syntactically well-formed and of the correct length. If not, return an error code equivalent to "`[UnknownError](https://heycam.github.io/webidl/#unknownerror)`" and terminate the operation.
    
2. Check if at least one of the specified combinations of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` and cryptographic parameters in credTypesAndPubKeyAlgs is supported. If not, return an error code equivalent to "`[NotSupportedError](https://heycam.github.io/webidl/#notsupportederror)`" and terminate the operation.
    
3. [For each](https://infra.spec.whatwg.org/#list-iterate) descriptor of excludeCredentialDescriptorList:
    
    1. If [looking up](#credential-id-looking-up) `` descriptor.`[id](#dom-publickeycredentialdescriptor-id)` `` in this authenticator returns non-null, and the returned [item](https://infra.spec.whatwg.org/#list-item)'s [RP ID](#rp-id) and [type](#public-key-credential-source-type) match `` rpEntity.`[id](#dom-publickeycredentialrpentity-id)` `` and `` excludeCredentialDescriptorList.`[type](#dom-publickeycredentialdescriptor-type)` `` respectively, then collect an [authorization gesture](#authorization-gesture) confirming [user consent](#user-consent) for creating a new credential. The [authorization gesture](#authorization-gesture) MUST include a [test of user presence](#test-of-user-presence). If the user
        
        confirms consent to create a new credential
        
        return an error code equivalent to "`[InvalidStateError](https://heycam.github.io/webidl/#invalidstateerror)`" and terminate the operation.
        
        does not consent to create a new credential
        
        return an error code equivalent to "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`" and terminate the operation.
        
        Note: The purpose of this [authorization gesture](#authorization-gesture) is not to proceed with creating a credential, but for privacy reasons to authorize disclosure of the fact that `` descriptor.`[id](#dom-publickeycredentialdescriptor-id)` `` is [bound](#bound-credential) to this [authenticator](#authenticator). If the user consents, the [client](#client) and [Relying Party](#relying-party) can detect this and guide the user to use a different [authenticator](#authenticator). If the user does not consent, the [authenticator](#authenticator) does not reveal that `` descriptor.`[id](#dom-publickeycredentialdescriptor-id)` `` is [bound](#bound-credential) to it, and responds as if the user simply declined consent to create a credential.
        
4. If requireResidentKey is `true` and the authenticator cannot store a [client-side discoverable public key credential source](#client-side-discoverable-public-key-credential-source), return an error code equivalent to "`[ConstraintError](https://heycam.github.io/webidl/#constrainterror)`" and terminate the operation.
    
5. If requireUserVerification is `true` and the authenticator cannot perform [user verification](#user-verification), return an error code equivalent to "`[ConstraintError](https://heycam.github.io/webidl/#constrainterror)`" and terminate the operation.
    
6. [](#op-makecred-step-user-consent)Collect an [authorization gesture](#authorization-gesture) confirming [user consent](#user-consent) for creating a new credential. The prompt for the [authorization gesture](#authorization-gesture) is shown by the authenticator if it has its own output capability, or by the user agent otherwise. The prompt SHOULD display `` rpEntity.`[id](#dom-publickeycredentialrpentity-id)` ``, `` rpEntity.`[name](#dom-publickeycredentialentity-name)` ``, `` userEntity.`[name](#dom-publickeycredentialentity-name)` `` and `` userEntity.`[displayName](#dom-publickeycredentialuserentity-displayname)` ``, if possible.
    
    If requireUserVerification is `true`, the [authorization gesture](#authorization-gesture) MUST include [user verification](#user-verification).
    
    If requireUserPresence is `true`, the [authorization gesture](#authorization-gesture) MUST include a [test of user presence](#test-of-user-presence).
    
    If the user does not [consent](#user-consent) or if [user verification](#user-verification) fails, return an error code equivalent to "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`" and terminate the operation.
    
7. Once the [authorization gesture](#authorization-gesture) has been completed and [user consent](#user-consent) has been obtained, generate a new credential object:
    
    1. Let (publicKey, privateKey) be a new pair of cryptographic keys using the combination of `[PublicKeyCredentialType](#enumdef-publickeycredentialtype)` and cryptographic parameters represented by the first [item](https://infra.spec.whatwg.org/#list-item) in credTypesAndPubKeyAlgs that is supported by this authenticator.
        
    2. Let userHandle be `` userEntity.`[id](#dom-publickeycredentialuserentity-id)` ``.
        
    3. Let credentialSource be a new [public key credential source](#public-key-credential-source) with the fields:
        
        [type](#public-key-credential-source-type)
        
        `[public-key](#dom-publickeycredentialtype-public-key)`.
        
        [privateKey](#public-key-credential-source-privatekey)
        
        privateKey
        
        [rpId](#public-key-credential-source-rpid)
        
        `` rpEntity.`[id](#dom-publickeycredentialrpentity-id)` ``
        
        [userHandle](#public-key-credential-source-userhandle)
        
        userHandle
        
        [otherUI](#public-key-credential-source-otherui)
        
        Any other information the authenticator chooses to include.
        
    4. If requireResidentKey is `true` or the authenticator chooses to create a [client-side discoverable public key credential source](#client-side-discoverable-public-key-credential-source):
        
        1. Let credentialId be a new [credential id](#credential-id).
            
        2. Set credentialSource.[id](#public-key-credential-source-id) to credentialId.
            
        3. Let credentials be this authenticator’s [credentials map](#authenticator-credentials-map).
            
        4. [Set](https://infra.spec.whatwg.org/#map-set) credentials[(`` rpEntity.`[id](#dom-publickeycredentialrpentity-id)` ``, userHandle)] to credentialSource.
            
    5. Otherwise:
        
        1. Let credentialId be the result of serializing and encrypting credentialSource so that only this authenticator can decrypt it.
            
8. If any error occurred while creating the new credential object, return an error code equivalent to "`[UnknownError](https://heycam.github.io/webidl/#unknownerror)`" and terminate the operation.
    
9. Let processedExtensions be the result of [authenticator extension processing](#authenticator-extension-processing) [for each](https://infra.spec.whatwg.org/#map-iterate) supported [extension identifier](#extension-identifier) → [authenticator extension input](#authenticator-extension-input) in extensions.
    
10. If the [authenticator](#authenticator):
    
    is a U2F device
    
    let the [signature counter](#signature-counter) value for the new credential be zero. (U2F devices may support signature counters but do not return a counter when making a credential. See [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats).)
    
    supports a global [signature counter](#signature-counter)
    
    Use the global [signature counter](#signature-counter)'s actual value when generating [authenticator data](#authenticator-data).
    
    supports a per credential [signature counter](#signature-counter)
    
    allocate the counter, associate it with the new credential, and initialize the counter value as zero.
    
    does not support a [signature counter](#signature-counter)
    
    let the [signature counter](#signature-counter) value for the new credential be constant at zero.
    
11. Let attestedCredentialData be the [attested credential data](#attested-credential-data) byte array including the credentialId and publicKey.
    
12. Let authenticatorData [be the byte array](#authenticator-data-perform-the-following-steps-to-generate-an-authenticator-data-structure) specified in [§ 6.1 Authenticator Data](#sctn-authenticator-data), including attestedCredentialData as the `[attestedCredentialData](#attestedcredentialdata)` and processedExtensions, if any, as the `[extensions](#authdataextensions)`.
    
13. Create an [attestation object](#attestation-object) for the new credential using the procedure specified in [§ 6.5.4 Generating an Attestation Object](#sctn-generating-an-attestation-object), using an authenticator-chosen [attestation statement format](#attestation-statement-format), authenticatorData, and hash, as well as `[taking into account](#dom-attestationconveyancepreference-enterprise)` the value of enterpriseAttestationPossible. For more details on attestation, see [§ 6.5 Attestation](#sctn-attestation).
    

On successful completion of this operation, the authenticator returns the [attestation object](#attestation-object) to the client.

#### 6.3.3. The authenticatorGetAssertion Operation[](#sctn-op-get-assertion)

It takes the following input parameters:

rpId

The caller’s [RP ID](#rp-id), as [determined](#GetAssn-DetermineRpId) by the user agent and the client.

hash

The [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data), provided by the client.

allowCredentialDescriptorList

An OPTIONAL [list](https://infra.spec.whatwg.org/#list) of `[PublicKeyCredentialDescriptor](#dictdef-publickeycredentialdescriptor)`s describing credentials acceptable to the [Relying Party](#relying-party) (possibly filtered by the client), if any.

requireUserPresence

The constant Boolean value `true`. It is included here as a pseudo-parameter to simplify applying this abstract authenticator model to implementations that may wish to make a [test of user presence](#test-of-user-presence) optional although WebAuthn does not.

requireUserVerification

The [effective user verification requirement for assertion](#effective-user-verification-requirement-for-assertion), a Boolean value provided by the client.

extensions

A [CBOR](#cbor) [map](https://infra.spec.whatwg.org/#ordered-map) from [extension identifiers](#extension-identifier) to their [authenticator extension inputs](#authenticator-extension-input), created by the client based on the extensions requested by the [Relying Party](#relying-party), if any.

Note: Before performing this operation, all other operations in progress in the [authenticator session](#authenticator-session) MUST be aborted by running the [authenticatorCancel](#authenticatorcancel) operation.

When this method is invoked, the [authenticator](#authenticator) MUST perform the following procedure:

1. Check if all the supplied parameters are syntactically well-formed and of the correct length. If not, return an error code equivalent to "`[UnknownError](https://heycam.github.io/webidl/#unknownerror)`" and terminate the operation.
    
2. Let credentialOptions be a new empty [set](https://infra.spec.whatwg.org/#ordered-set) of [public key credential sources](#public-key-credential-source).
    
3. If allowCredentialDescriptorList was supplied, then [for each](https://infra.spec.whatwg.org/#list-iterate) descriptor of allowCredentialDescriptorList:
    
    1. Let credSource be the result of [looking up](#credential-id-looking-up) `` descriptor.`[id](#dom-publickeycredentialdescriptor-id)` `` in this authenticator.
        
    2. If credSource is not `null`, [append](https://infra.spec.whatwg.org/#set-append) it to credentialOptions.
        
4. Otherwise (allowCredentialDescriptorList was not supplied), [for each](https://infra.spec.whatwg.org/#map-iterate) key → credSource of this authenticator’s [credentials map](#authenticator-credentials-map), [append](https://infra.spec.whatwg.org/#set-append) credSource to credentialOptions.
    
5. [Remove](https://infra.spec.whatwg.org/#list-remove) any items from credentialOptions whose [rpId](#public-key-credential-source-rpid) is not equal to rpId.
    
6. If credentialOptions is now empty, return an error code equivalent to "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`" and terminate the operation.
    
7. Prompt the user to select a [public key credential source](#public-key-credential-source) selectedCredential from credentialOptions. Collect an [authorization gesture](#authorization-gesture) confirming [user consent](#user-consent) for using selectedCredential. The prompt for the [authorization gesture](#authorization-gesture) may be shown by the [authenticator](#authenticator) if it has its own output capability, or by the user agent otherwise.
    
    If requireUserVerification is `true`, the [authorization gesture](#authorization-gesture) MUST include [user verification](#user-verification).
    
    If requireUserPresence is `true`, the [authorization gesture](#authorization-gesture) MUST include a [test of user presence](#test-of-user-presence).
    
    If the user does not [consent](#user-consent), return an error code equivalent to "`[NotAllowedError](https://heycam.github.io/webidl/#notallowederror)`" and terminate the operation.
    
8. Let processedExtensions be the result of [authenticator extension processing](#authenticator-extension-processing) [for each](https://infra.spec.whatwg.org/#map-iterate) supported [extension identifier](#extension-identifier) → [authenticator extension input](#authenticator-extension-input) in extensions.
    
9. Increment the credential associated [signature counter](#signature-counter) or the global [signature counter](#signature-counter) value, depending on which approach is implemented by the [authenticator](#authenticator), by some positive value. If the [authenticator](#authenticator) does not implement a [signature counter](#signature-counter), let the [signature counter](#signature-counter) value remain constant at zero.
    
10. Let authenticatorData [be the byte array](#authenticator-data-perform-the-following-steps-to-generate-an-authenticator-data-structure) specified in [§ 6.1 Authenticator Data](#sctn-authenticator-data) including processedExtensions, if any, as the `[extensions](#authdataextensions)` and excluding `[attestedCredentialData](#attestedcredentialdata)`.
    
11. Let signature be the [assertion signature](#assertion-signature) of the concatenation `authenticatorData || hash` using the [privateKey](#public-key-credential-source-privatekey) of selectedCredential as shown in [Figure](#fig-signature) , below. A simple, undelimited concatenation is safe to use here because the [authenticator data](#authenticator-data) describes its own length. The [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data) (which potentially has a variable length) is always the last element.
    
    ![](https://www.w3.org/TR/webauthn-2/images/fido-signature-formats-figure2.svg)
    
    Generating an [assertion signature](#assertion-signature).
    
12. If any error occurred while generating the [assertion signature](#assertion-signature), return an error code equivalent to "`[UnknownError](https://heycam.github.io/webidl/#unknownerror)`" and terminate the operation.
    
13. [](#authenticatorGetAssertion-return-values)Return to the user agent:
    - selectedCredential.[id](#public-key-credential-source-id), if either a list of credentials (i.e., allowCredentialDescriptorList) of length 2 or greater was supplied by the client, or no such list was supplied.
        
        Note: If, within allowCredentialDescriptorList, the client supplied exactly one credential and it was successfully employed, then its [credential ID](#credential-id) is not returned since the client already knows it. This saves transmitting these bytes over what may be a constrained connection in what is likely a common case.
        
    - authenticatorData
        
    - signature
        
    - selectedCredential.[userHandle](#public-key-credential-source-userhandle)
        
        Note: the returned [userHandle](#public-key-credential-source-userhandle) value may be `null`, see: [userHandleResult](#assertioncreationdata-userhandleresult).
        

If the [authenticator](#authenticator) cannot find any [credential](#public-key-credential) corresponding to the specified [Relying Party](#relying-party) that matches the specified criteria, it terminates the operation and returns an error.

#### 6.3.4. The authenticatorCancel Operation[](#sctn-op-cancel)

This operation takes no input parameters and returns no result.

When this operation is invoked by the client in an [authenticator session](#authenticator-session), it has the effect of terminating any [authenticatorMakeCredential](#authenticatormakecredential) or [authenticatorGetAssertion](#authenticatorgetassertion) operation currently in progress in that authenticator session. The authenticator stops prompting for, or accepting, any user input related to authorizing the canceled operation. The client ignores any further responses from the authenticator for the canceled operation.

This operation is ignored if it is invoked in an [authenticator session](#authenticator-session) which does not have an [authenticatorMakeCredential](#authenticatormakecredential) or [authenticatorGetAssertion](#authenticatorgetassertion) operation currently in progress.

### 6.4. String Handling[](#sctn-strings)

Authenticators may be required to store arbitrary strings chosen by a [Relying Party](#relying-party), for example the `[name](#dom-publickeycredentialentity-name)` and `[displayName](#dom-publickeycredentialuserentity-displayname)` in a `[PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity)`. This section discusses some practical consequences of handling arbitrary strings that may be presented to humans.

#### 6.4.1. String Truncation[](#sctn-strings-truncation)

Each arbitrary string in the API will have some accommodation for the potentially limited resources available to an [authenticator](#authenticator). If string value truncation is the chosen accommodation then authenticators MAY truncate in order to make the string fit within a length equal or greater than the specified minimum supported length. Such truncation SHOULD also respect UTF-8 sequence boundaries or [grapheme cluster](https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries) boundaries [[UTR29]](#biblio-utr29). This defines the maximum truncation permitted and authenticators MUST NOT truncate further.

For example, in [figure](#fig-stringTruncation) the string is 65 bytes long. If truncating to 64 bytes then the final 0x88 byte must be removed purely because of space reasons. Since that leaves a partial UTF-8 sequence the remainder of that sequence may also be removed. Since that leaves a partial [grapheme cluster](https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries) an authenticator may remove the remainder of that cluster.

![](https://www.w3.org/TR/webauthn-2/images/string-truncation.svg)

The end of a UTF-8 encoded string showing the positions of different truncation boundaries.

[Conforming User Agents](#conforming-user-agent) are responsible for ensuring that the authenticator behaviour observed by [Relying Parties](#relying-party) conforms to this specification with respect to string handling. For example, if an authenticator is known to behave incorrectly when asked to store large strings, the user agent SHOULD perform the truncation for it in order to maintain the model from the point of view of the [Relying Party](#relying-party). User-agents that do this SHOULD truncate at [grapheme cluster](https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries) boundaries.

Truncation based on UTF-8 sequences alone may cause a [grapheme cluster](https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries) to be truncated. This could make the grapheme cluster render as a different glyph, potentially changing the meaning of the string, instead of removing the glyph entirely.

In addition to that, truncating on byte boundaries alone causes a known issue that user agents should be aware of: if the authenticator is using [[FIDO-CTAP]](#biblio-fido-ctap) then future messages from the authenticator may contain invalid CBOR since the value is typed as a CBOR string and thus is required to be valid UTF-8. User agents are tasked with handling this to avoid burdening authenticators with understanding character encodings and Unicode character properties. Thus, when dealing with [authenticators](#authenticator), user agents SHOULD:

1. Ensure that any strings sent to authenticators are validly encoded.
    
2. Handle the case where strings have been truncated resulting in an invalid encoding. For example, any partial code point at the end may be dropped or replaced with [U+FFFD](http://unicode.org/cldr/utility/character.jsp?a=FFFD).
    

#### 6.4.2. Language and Direction Encoding[](#sctn-strings-langdir)

In order to be correctly displayed in context, the language and base direction of a string [may be required](https://www.w3.org/TR/string-meta/#why-is-this-important). Strings in this API may have to be written to fixed-function [authenticators](#authenticator) and then later read back and displayed on a different platform. Thus language and direction metadata is encoded in the string itself to ensure that it is transported atomically.

To encode language and direction metadata in a string that is documented as permitting it, suffix its code points with two sequences of code points:

The first encodes a [language tag](https://tools.ietf.org/html/bcp47#section-2.1) with the code point U+E0001 followed by the ASCII values of the [language tag](https://tools.ietf.org/html/bcp47#section-2.1) each shifted up by U+E0000. For example, the [language tag](https://tools.ietf.org/html/bcp47#section-2.1) “en-US” becomes the code points U+E0001, U+E0065, U+E006E, U+E002D, U+E0055, U+E0053.

The second consists of a single code point which is either U+200E (“LEFT-TO-RIGHT MARK”), U+200F (“RIGHT-TO-LEFT MARK”), or U+E007F (“CANCEL TAG”). The first two can be used to indicate directionality but SHOULD only be used when neccessary to produce the correct result. (E.g. an RTL string that starts with LTR-strong characters.) The value U+E007F is a direction-agnostic indication of the end of the [language tag](https://tools.ietf.org/html/bcp47#section-2.1).

So the string “حبیب الرحمان” could have two different DOMString values, depending on whether the language was encoded or not. (Since the direction is unambigous a directionality marker is not needed in this example.)

- Unadorned string: U+FEA2, U+FE92, U+FBFF, U+FE91, U+20, U+FE8E, U+FEDF, U+FEAE, U+FEA4, U+FEE3, U+FE8E, U+FEE7
    
- With language “ar-SA” encoded: U+FEA2, U+FE92, U+FBFF, U+FE91, U+20, U+FE8E, U+FEDF, U+FEAE, U+FEA4, U+FEE3, U+FE8E, U+FEE7, U+E0001, U+E0061, U+E0072, U+E002D, U+E0053, U+E0041, U+E007F
    

Consumers of strings that may have language and direction encoded should be aware that truncation could truncate a [language tag](https://tools.ietf.org/html/bcp47#section-2.1) into a different, but still valid, language. The final directionality marker or CANCEL TAG code point provide an unambigous indication of truncation.

### 6.5. Attestation[](#sctn-attestation)

[Authenticators](#authenticator) SHOULD also provide some form of [attestation](#attestation), if possible. If an authenticator does, the basic requirement is that the [authenticator](#authenticator) can produce, for each [credential public key](#credential-public-key), an [attestation statement](#attestation-statement) verifiable by the [WebAuthn Relying Party](#webauthn-relying-party). Typically, this [attestation statement](#attestation-statement) contains a signature by an [attestation private key](#attestation-private-key) over the attested [credential public key](#credential-public-key) and a challenge, as well as a certificate or similar data providing provenance information for the [attestation public key](#attestation-public-key), enabling the [Relying Party](#relying-party) to make a trust decision. However, if an [attestation key pair](#attestation-key-pair) is not available, then the authenticator MAY either perform [self attestation](#self-attestation) of the [credential public key](#credential-public-key) with the corresponding [credential private key](#credential-private-key), or otherwise perform [no attestation](#none). All this information is returned by [authenticators](#authenticator) any time a new [public key credential](#public-key-credential) is generated, in the overall form of an attestation object. The relationship of the [attestation object](#attestation-object) with [authenticator data](#authenticator-data) (containing [attested credential data](#attested-credential-data)) and the [attestation statement](#attestation-statement) is illustrated in [figure](#fig-attStructs) , below.

If an [authenticator](#authenticator) employs [self attestation](#self-attestation) or [no attestation](#none), then no provenance information is provided for the [Relying Party](#relying-party) to base a trust decision on. In these cases, the [authenticator](#authenticator) provides no guarantees about its operation to the [Relying Party](#relying-party).

![](https://www.w3.org/TR/webauthn-2/images/fido-attestation-structures.svg)

[Attestation object](#attestation-object) layout illustrating the included [authenticator data](#authenticator-data) (containing [attested credential data](#attested-credential-data)) and the [attestation statement](#attestation-statement).

This figure illustrates only the `packed` [attestation statement format](#attestation-statement-format). Several additional [attestation statement formats](#attestation-statement-format) are defined in [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats).

An important component of the [attestation object](#attestation-object) is the attestation statement. This is a specific type of signed data object, containing statements about a [public key credential](#public-key-credential) itself and the [authenticator](#authenticator) that created it. It contains an [attestation signature](#attestation-signature) created using the key of the attesting authority (except for the case of [self attestation](#self-attestation), when it is created using the [credential private key](#credential-private-key)). In order to correctly interpret an [attestation statement](#attestation-statement), a [Relying Party](#relying-party) needs to understand these two aspects of [attestation](#attestation):

1. The attestation statement format is the manner in which the signature is represented and the various contextual bindings are incorporated into the attestation statement by the [authenticator](#authenticator). In other words, this defines the syntax of the statement. Various existing components and OS platforms (such as TPMs and the Android OS) have previously defined [attestation statement formats](#attestation-statement-format). This specification supports a variety of such formats in an extensible way, as defined in [§ 6.5.2 Attestation Statement Formats](#sctn-attestation-formats). The formats themselves are identified by strings, as described in [§ 8.1 Attestation Statement Format Identifiers](#sctn-attstn-fmt-ids).
    
2. The attestation type defines the semantics of [attestation statements](#attestation-statement) and their underlying trust models. Specifically, it defines how a [Relying Party](#relying-party) establishes trust in a particular [attestation statement](#attestation-statement), after verifying that it is cryptographically valid. This specification supports a number of [attestation types](#attestation-type), as described in [§ 6.5.3 Attestation Types](#sctn-attestation-types).
    

In general, there is no simple mapping between [attestation statement formats](#attestation-statement-format) and [attestation types](#attestation-type). For example, the "packed" [attestation statement format](#attestation-statement-format) defined in [§ 8.2 Packed Attestation Statement Format](#sctn-packed-attestation) can be used in conjunction with all [attestation types](#attestation-type), while other formats and types have more limited applicability.

The privacy, security and operational characteristics of [attestation](#attestation) depend on:

- The [attestation type](#attestation-type), which determines the trust model,
    
- The [attestation statement format](#attestation-statement-format), which MAY constrain the strength of the [attestation](#attestation) by limiting what can be expressed in an [attestation statement](#attestation-statement), and
    
- The characteristics of the individual [authenticator](#authenticator), such as its construction, whether part or all of it runs in a secure operating environment, and so on.
    

It is expected that most [authenticators](#authenticator) will support a small number of [attestation types](#attestation-type) and [attestation statement formats](#attestation-statement-format), while [Relying Parties](#relying-party) will decide what [attestation types](#attestation-type) are acceptable to them by policy. [Relying Parties](#relying-party) will also need to understand the characteristics of the [authenticators](#authenticator) that they trust, based on information they have about these [authenticators](#authenticator). For example, the FIDO Metadata Service [[FIDOMetadataService]](#biblio-fidometadataservice) provides one way to access such information.

#### 6.5.1. Attested Credential Data[](#sctn-attested-credential-data)

Attested credential data is a variable-length byte array added to the [authenticator data](#authenticator-data) when generating an [attestation object](#attestation-object) for a given credential. Its format is shown in [Table](#table-attestedCredentialData) .

|Name|Length (in bytes)|Description|
|---|---|---|
|aaguid|16|The AAGUID of the authenticator.|
|credentialIdLength|2|Byte length **L** of Credential ID, 16-bit unsigned big-endian integer.|
|credentialId|L|[Credential ID](#credential-id)|
|credentialPublicKey|variable|The [credential public key](#credential-public-key) encoded in COSE_Key format, as defined in [Section 7](https://tools.ietf.org/html/rfc8152#section-7) of [[RFC8152]](#biblio-rfc8152), using the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form). The COSE_Key-encoded [credential public key](#credential-public-key) MUST contain the "alg" parameter and MUST NOT contain any other OPTIONAL parameters. The "alg" parameter MUST contain a `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)` value. The encoded [credential public key](#credential-public-key) MUST also contain any additional REQUIRED parameters stipulated by the relevant key type specification, i.e., REQUIRED for the key type "kty" and algorithm "alg" (see Section 8 of [[RFC8152]](#biblio-rfc8152)).|

[Attested credential data](#attested-credential-data) layout. The names in the Name column are only for reference within this document, and are not present in the actual representation of the [attested credential data](#attested-credential-data).

##### 6.5.1.1. Examples of `credentialPublicKey` Values Encoded in COSE_Key Format[](#sctn-encoded-credPubKey-examples)

This section provides examples of COSE_Key-encoded Elliptic Curve and RSA public keys for the ES256, PS256, and RS256 signature algorithms. These examples adhere to the rules defined above for the [credentialPublicKey](#credentialpublickey) value, and are presented in CDDL [[RFC8610]](#biblio-rfc8610) for clarity.

[[RFC8152]](#biblio-rfc8152) [Section 7](https://tools.ietf.org/html/rfc8152#section-7) defines the general framework for all COSE_Key-encoded keys. Specific key types for specific algorithms are defined in other sections of [[RFC8152]](#biblio-rfc8152) as well as in other specifications, as noted below.

Below is an example of a COSE_Key-encoded Elliptic Curve public key in EC2 format (see [[RFC8152]](#biblio-rfc8152) [Section 13.1](https://tools.ietf.org/html/rfc8152#section-13.1)), on the P-256 curve, to be used with the ES256 signature algorithm (ECDSA w/ SHA-256, see [[RFC8152]](#biblio-rfc8152) [Section 8.1](https://tools.ietf.org/html/rfc8152#section-8.1):

[](#example-bdbd14cc){
  1:   2,  ; kty: EC2 key type
  3:  -7,  ; alg: ES256 signature algorithm
 -1:   1,  ; crv: P-256 curve
 -2:   x,  ; x-coordinate as byte string 32 bytes in length
           ; e.g., in hex: 65eda5a12577c2bae829437fe338701a10aaa375e1bb5b5de108de439c08551d
 -3:   y   ; y-coordinate as byte string 32 bytes in length
           ; e.g., in hex: 1e52ed75701163f7f9e40ddf9f341b3dc9ba860af7e0ca7ca7e9eecd0084d19c
}

Below is the above Elliptic Curve public key encoded in the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form), whitespace and line breaks are included here for clarity and to match the CDDL [[RFC8610]](#biblio-rfc8610) presentation above:

[](#example-08d0b440)A5
   01  02

   03  26

   20  01

   21  58 20   65eda5a12577c2bae829437fe338701a10aaa375e1bb5b5de108de439c08551d

   22  58 20   1e52ed75701163f7f9e40ddf9f341b3dc9ba860af7e0ca7ca7e9eecd0084d19c

Below is an example of a COSE_Key-encoded 2048-bit RSA public key (see [[RFC8230]](#biblio-rfc8230) [Section 4](https://tools.ietf.org/html/rfc8230#section-4), to be used with the PS256 signature algorithm (RSASSA-PSS with SHA-256, see [[RFC8230]](#biblio-rfc8230) [Section 2](https://tools.ietf.org/html/rfc8230#section-2):

[](#example-fb934e19){
  1:   3,  ; kty: RSA key type
  3: -37,  ; alg: PS256
 -1:   n,  ; n:   RSA modulus n byte string 256 bytes in length
           ;      e.g., in hex (middle bytes elided for brevity): DB5F651550...6DC6548ACC3
 -2:   e   ; e:   RSA public exponent e byte string 3 bytes in length
           ;      e.g., in hex: 010001
}

Below is an example of the same COSE_Key-encoded RSA public key as above, to be used with the RS256 signature algorithm (RSASSA-PKCS1-v1_5 with SHA-256):

[](#example-8dfabc00){
  1:   3,  ; kty: RSA key type
  3:-257,  ; alg: RS256
 -1:   n,  ; n:   RSA modulus n byte string 256 bytes in length
           ;      e.g., in hex (middle bytes elided for brevity): DB5F651550...6DC6548ACC3
 -2:   e   ; e:   RSA public exponent e byte string 3 bytes in length
           ;      e.g., in hex: 010001
}

#### 6.5.2. Attestation Statement Formats[](#sctn-attestation-formats)

As described above, an [attestation statement format](#attestation-statement-format) is a data format which represents a cryptographic signature by an [authenticator](#authenticator) over a set of contextual bindings. Each [attestation statement format](#attestation-statement-format) MUST be defined using the following template:

- **[Attestation statement format identifier](#attestation-statement-format-identifier):**
    
- **Supported [attestation types](#attestation-type):**
    
- **Syntax:** The syntax of an [attestation statement](#attestation-statement) produced in this format, defined using CDDL [[RFC8610]](#biblio-rfc8610) for the extension point `$attStmtFormat` defined in [§ 6.5.4 Generating an Attestation Object](#sctn-generating-an-attestation-object).
    
- Signing procedure: The [signing procedure](#signing-procedure) for computing an [attestation statement](#attestation-statement) in this [format](#attestation-statement-format) given the [public key credential](#public-key-credential) to be attested, the [authenticator data](#authenticator-data) structure containing the authenticator data for the attestation, and the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data).
    
- Verification procedure: The procedure for verifying an [attestation statement](#attestation-statement), which takes the following verification procedure inputs:
    
    - attStmt: The [attestation statement](#attestation-statement) structure
        
    - authenticatorData: The [authenticator data](#authenticator-data) claimed to have been used for the attestation
        
    - clientDataHash: The [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data)
        
    
    The procedure returns either:
    
    - An error indicating that the attestation is invalid, or
        
    - An implementation-specific value representing the [attestation type](#attestation-type), and the [trust path](#attestation-trust-path). This attestation trust path is either empty (in case of [self attestation](#self-attestation)), or a set of X.509 certificates.
        

The initial list of specified [attestation statement formats](#attestation-statement-format) is in [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats).

#### 6.5.3. Attestation Types[](#sctn-attestation-types)

WebAuthn supports several [attestation types](#attestation-type), defining the semantics of [attestation statements](#attestation-statement) and their underlying trust models:

Note: This specification does not define any data structures explicitly expressing the [attestation types](#attestation-type) employed by [authenticators](#authenticator). [Relying Parties](#relying-party) engaging in [attestation statement](#attestation-statement) [verification](#verification-procedure) — i.e., when calling `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` they select an [attestation conveyance](#attestation-conveyance) other than `[none](#dom-attestationconveyancepreference-none)` and verify the received [attestation statement](#attestation-statement) — will determine the employed [attestation type](#attestation-type) as a part of [verification](#verification-procedure). See the "Verification procedure" subsections of [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats). See also [§ 14.4.1 Attestation Privacy](#sctn-attestation-privacy). For all [attestation types](#attestation-type) defined in this section other than [Self](#self-attestation) and [None](#none), [Relying Party](#relying-party) [verification](#verification-procedure) is followed by matching the [trust path](#attestation-trust-path) to an acceptable root certificate per step 21 of [§ 7.1 Registering a New Credential](#sctn-registering-a-new-credential). Differentiating these [attestation types](#attestation-type) becomes useful primarily as a means for determining if the [attestation](#attestation) is acceptable under [Relying Party](#relying-party) policy.

Basic Attestation (Basic)

In the case of basic attestation [[UAFProtocol]](#biblio-uafprotocol), the authenticator’s [attestation key pair](#attestation-key-pair) is specific to an authenticator "model", i.e., a "batch" of authenticators. Thus, authenticators of the same, or similar, model often share the same [attestation key pair](#attestation-key-pair). See [§ 14.4.1 Attestation Privacy](#sctn-attestation-privacy) for further information.

[Basic attestation](#basic-attestation) is also referred to as batch attestation.

Self Attestation (Self)

In the case of [self attestation](#self-attestation), also known as surrogate basic attestation [[UAFProtocol]](#biblio-uafprotocol), the Authenticator does not have any specific [attestation key pair](#attestation-key-pair). Instead it uses the [credential private key](#credential-private-key) to create the [attestation signature](#attestation-signature). Authenticators without meaningful protection measures for an [attestation private key](#attestation-private-key) typically use this attestation type.

Attestation CA (AttCA)

In this case, an [authenticator](#authenticator) is based on a Trusted Platform Module (TPM) and holds an authenticator-specific "endorsement key" (EK). This key is used to securely communicate with a trusted third party, the [Attestation CA](#attestation-ca) [[TCG-CMCProfile-AIKCertEnroll]](#biblio-tcg-cmcprofile-aikcertenroll) (formerly known as a "Privacy CA"). The [authenticator](#authenticator) can generate multiple attestation identity key pairs (AIK) and requests an [Attestation CA](#attestation-ca) to issue an AIK certificate for each. Using this approach, such an [authenticator](#authenticator) can limit the exposure of the EK (which is a global correlation handle) to Attestation CA(s). AIKs can be requested for each [authenticator](#authenticator)-generated [public key credential](#public-key-credential) individually, and conveyed to [Relying Parties](#relying-party) as [attestation certificates](#attestation-certificate).

Note: This concept typically leads to multiple attestation certificates. The attestation certificate requested most recently is called "active".

Anonymization CA (AnonCA)

In this case, the [authenticator](#authenticator) uses an [Anonymization CA](#anonymization-ca) which dynamically generates per-[credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) [attestation certificates](#attestation-certificate) such that the [attestation statements](#attestation-statement) presented to [Relying Parties](#relying-party) do not provide uniquely identifiable information, e.g., that might be used for tracking purposes.

Note: [Attestation statements](#attestation-statement) conveying [attestations](#attestation) of [type](#attestation-type) [AttCA](#attca) or [AnonCA](#anonca) use the same data structure as those of [type](#attestation-type) [Basic](#basic), so the three attestation types are, in general, distinguishable only with externally provided knowledge regarding the contents of the [attestation certificates](#attestation-certificate) conveyed in the [attestation statement](#attestation-statement).

No attestation statement (None)

In this case, no attestation information is available. See also [§ 8.7 None Attestation Statement Format](#sctn-none-attestation).

#### 6.5.4. Generating an Attestation Object[](#sctn-generating-an-attestation-object)

To generate an [attestation object](#attestation-object) (see: [Figure 6](#fig-attStructs)) given:

attestationFormat

An [attestation statement format](#attestation-statement-format).

authData

A byte array containing [authenticator data](#authenticator-data).

hash

The [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data).

the [authenticator](#authenticator) MUST:

1. Let attStmt be the result of running attestationFormat’s [signing procedure](#signing-procedure) given authData and hash.
    
2. Let fmt be attestationFormat’s [attestation statement format identifier](#attestation-statement-format-identifier)
    
3. Return the [attestation object](#attestation-object) as a CBOR map with the following syntax, filled in with variables initialized by this algorithm:
    
        attObj = {
                    authData: bytes,
                    $$attStmtType
                 }
    
        attStmtTemplate = (
                              fmt: text,
                              attStmt: { * tstr => any } ; Map is filled in by each concrete attStmtType
                          )
    
        ; Every attestation statement format must have the above fields
        attStmtTemplate .within $$attStmtType
    

#### 6.5.5. Signature Formats for Packed Attestation, FIDO U2F Attestation, and Assertion Signatures[](#sctn-signature-attestation-types)

- For COSEAlgorithmIdentifier -7 (ES256), and other ECDSA-based algorithms, the `sig` value MUST be encoded as an ASN.1 DER Ecdsa-Sig-Value, as defined in [[RFC3279]](#biblio-rfc3279) section 2.2.3.
    
            Example:
            30 44                                ; SEQUENCE (68 Bytes)
                02 20                            ; INTEGER (32 Bytes)
                |  3d 46 28 7b 8c 6e 8c 8c  26 1c 1b 88 f2 73 b0 9a
                |  32 a6 cf 28 09 fd 6e 30  d5 a7 9f 26 37 00 8f 54
                02 20                            ; INTEGER (32 Bytes)
                |  4e 72 23 6e a3 90 a9 a1  7b cf 5f 7a 09 d6 3a b2
                |  17 6c 92 bb 8e 36 c0 41  98 a2 7b 90 9b 6e 8f 13
    
    Note: As CTAP1/U2F [authenticators](#authenticator) are already producing signatures values in this format, CTAP2 [authenticators](#authenticator) will also produce signatures values in the same format, for consistency reasons.
    

It is RECOMMENDED that any new attestation formats defined not use ASN.1 encodings, but instead represent signatures as equivalent fixed-length byte arrays without internal structure, using the same representations as used by COSE signatures as defined in [[RFC8152]](#biblio-rfc8152) and [[RFC8230]](#biblio-rfc8230).

The below signature format definitions satisfy this requirement and serve as examples for deriving the same for other signature algorithms not explicitly mentioned here:

- For COSEAlgorithmIdentifier -257 (RS256), `sig` MUST contain the signature generated using the RSASSA-PKCS1-v1_5 signature scheme defined in section 8.2.1 in [[RFC8017]](#biblio-rfc8017) with SHA-256 as the hash function. The signature is not ASN.1 wrapped.
    
- For COSEAlgorithmIdentifier -37 (PS256), `sig` MUST contain the signature generated using the RSASSA-PSS signature scheme defined in section 8.1.1 in [[RFC8017]](#biblio-rfc8017) with SHA-256 as the hash function. The signature is not ASN.1 wrapped.
    

## 7. [WebAuthn Relying Party](#webauthn-relying-party) Operations[](#sctn-rp-operations)

A [registration](#registration-ceremony) or [authentication ceremony](#authentication-ceremony) begins with the [WebAuthn Relying Party](#webauthn-relying-party) creating a `[PublicKeyCredentialCreationOptions](#dictdef-publickeycredentialcreationoptions)` or `[PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)` object, respectively, which encodes the parameters for the [ceremony](#ceremony). The [Relying Party](#relying-party) SHOULD take care to not leak sensitive information during this stage; see [§ 14.6.2 Username Enumeration](#sctn-username-enumeration) for details.

Upon successful execution of `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` or `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)`, the [Relying Party](#relying-party)'s script receives a `[PublicKeyCredential](#publickeycredential)` containing an `[AuthenticatorAttestationResponse](#authenticatorattestationresponse)` or `[AuthenticatorAssertionResponse](#authenticatorassertionresponse)` structure, respectively, from the client. It must then deliver the contents of this structure to the [Relying Party](#relying-party) server, using methods outside the scope of this specification. This section describes the operations that the [Relying Party](#relying-party) must perform upon receipt of these structures.

### 7.1. Registering a New Credential[](#sctn-registering-a-new-credential)

In order to perform a [registration ceremony](#registration-ceremony), the [Relying Party](#relying-party) MUST proceed as follows:

1. Let options be a new `[PublicKeyCredentialCreationOptions](#dictdef-publickeycredentialcreationoptions)` structure configured to the [Relying Party](#relying-party)'s needs for the ceremony.
    
2. Call `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` and pass options as the `` `[publicKey](#dom-credentialcreationoptions-publickey)` `` option. Let credential be the result of the successfully resolved promise. If the promise is rejected, abort the ceremony with a user-visible error, or otherwise guide the user experience as might be determinable from the context available in the rejected promise. For example if the promise is rejected with an error code equivalent to "`[InvalidStateError](https://heycam.github.io/webidl/#invalidstateerror)`", the user might be instructed to use a different [authenticator](#authenticator). For information on different error contexts and the circumstances leading to them, see [§ 6.3.2 The authenticatorMakeCredential Operation](#sctn-op-make-cred).
    
3. Let response be `` credential.`[response](#dom-publickeycredential-response)` ``. If response is not an instance of `[AuthenticatorAttestationResponse](#authenticatorattestationresponse)`, abort the ceremony with a user-visible error.
    
4. Let clientExtensionResults be the result of calling `` credential.`[getClientExtensionResults()](#dom-publickeycredential-getclientextensionresults)` ``.
    
5. Let JSONtext be the result of running [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) on the value of `` response.`[clientDataJSON](#dom-authenticatorresponse-clientdatajson)` ``.
    
    Note: Using any implementation of [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) is acceptable as long as it yields the same result as that yielded by the [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) algorithm. In particular, any leading byte order mark (BOM) MUST be stripped.
    
6. Let C, the [client data](#client-data) claimed as collected during the credential creation, be the result of running an implementation-specific JSON parser on JSONtext.
    
    Note: C may be any implementation-specific data structure representation, as long as C’s components are referenceable, as required by this algorithm.
    
7. Verify that the value of `` C.`[type](#dom-collectedclientdata-type)` `` is `webauthn.create`.
    
8. Verify that the value of `` C.`[challenge](#dom-collectedclientdata-challenge)` `` equals the base64url encoding of `` options.`[challenge](#dom-publickeycredentialcreationoptions-challenge)` ``.
    
9. Verify that the value of `` C.`[origin](#dom-collectedclientdata-origin)` `` matches the [Relying Party](#relying-party)'s [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin).
    
10. Verify that the value of `` C.`[tokenBinding](#dom-collectedclientdata-tokenbinding)`.`[status](#dom-tokenbinding-status)` `` matches the state of [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) for the TLS connection over which the [assertion](#assertion) was obtained. If [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) was used on that TLS connection, also verify that `` C.`[tokenBinding](#dom-collectedclientdata-tokenbinding)`.`[id](#dom-tokenbinding-id)` `` matches the [base64url encoding](#base64url-encoding) of the [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) for the connection.
    
11. Let hash be the result of computing a hash over `` response.`[clientDataJSON](#dom-authenticatorresponse-clientdatajson)` `` using SHA-256.
    
12. Perform CBOR decoding on the `[attestationObject](#dom-authenticatorattestationresponse-attestationobject)` field of the `[AuthenticatorAttestationResponse](#authenticatorattestationresponse)` structure to obtain the attestation statement format fmt, the [authenticator data](#authenticator-data) authData, and the attestation statement attStmt.
    
13. Verify that the `[rpIdHash](#rpidhash)` in authData is the SHA-256 hash of the [RP ID](#rp-id) expected by the [Relying Party](#relying-party).
    
14. Verify that the [User Present](#concept-user-present) bit of the `[flags](#flags)` in authData is set.
    
15. If [user verification](#user-verification) is required for this registration, verify that the [User Verified](#concept-user-verified) bit of the `[flags](#flags)` in authData is set.
    
16. Verify that the "alg" parameter in the [credential public key](#credentialpublickey) in authData matches the `[alg](#dom-publickeycredentialparameters-alg)` attribute of one of the [items](https://infra.spec.whatwg.org/#list-item) in `` options.`[pubKeyCredParams](#dom-publickeycredentialcreationoptions-pubkeycredparams)` ``.
    
17. Verify that the values of the [client extension outputs](#client-extension-output) in clientExtensionResults and the [authenticator extension outputs](#authenticator-extension-output) in the `[extensions](#authdataextensions)` in authData are as expected, considering the [client extension input](#client-extension-input) values that were given in `` options.`[extensions](#dom-publickeycredentialcreationoptions-extensions)` `` and any specific policy of the [Relying Party](#relying-party) regarding unsolicited extensions, i.e., those that were not specified as part of `` options.`[extensions](#dom-publickeycredentialcreationoptions-extensions)` ``. In the general case, the meaning of "are as expected" is specific to the [Relying Party](#relying-party) and which extensions are in use.
    
    Note: [Client platforms](#client-platform) MAY enact local policy that sets additional [authenticator extensions](#authenticator-extension) or [client extensions](#client-extension) and thus cause values to appear in the [authenticator extension outputs](#authenticator-extension-output) or [client extension outputs](#client-extension-output) that were not originally specified as part of `` options.`[extensions](#dom-publickeycredentialcreationoptions-extensions)` ``. [Relying Parties](#relying-party) MUST be prepared to handle such situations, whether it be to ignore the unsolicited extensions or reject the attestation. The [Relying Party](#relying-party) can make this decision based on local policy and the extensions in use.
    
    Note: Since all extensions are OPTIONAL for both the [client](#client) and the [authenticator](#authenticator), the [Relying Party](#relying-party) MUST also be prepared to handle cases where none or not all of the requested extensions were acted upon.
    
18. Determine the attestation statement format by performing a USASCII case-sensitive match on fmt against the set of supported WebAuthn Attestation Statement Format Identifier values. An up-to-date list of registered WebAuthn Attestation Statement Format Identifier values is maintained in the IANA "WebAuthn Attestation Statement Format Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809).
    
19. Verify that attStmt is a correct [attestation statement](#attestation-statement), conveying a valid [attestation signature](#attestation-signature), by using the [attestation statement format](#attestation-statement-format) fmt’s [verification procedure](#verification-procedure) given attStmt, authData and hash.
    
    Note: Each [attestation statement format](#attestation-statement-format) specifies its own [verification procedure](#verification-procedure). See [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats) for the initially-defined formats, and [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) for the up-to-date list.
    
20. If validation is successful, obtain a list of acceptable trust anchors (i.e. attestation root certificates) for that attestation type and attestation statement format fmt, from a trusted source or from policy. For example, the FIDO Metadata Service [[FIDOMetadataService]](#biblio-fidometadataservice) provides one way to obtain such information, using the `[aaguid](#aaguid)` in the `[attestedCredentialData](#attestedcredentialdata)` in authData.
    
21. Assess the attestation trustworthiness using the outputs of the [verification procedure](#verification-procedure) in step 19, as follows:
    
    - If [no attestation](#none) was provided, verify that [None](#none) attestation is acceptable under [Relying Party](#relying-party) policy.
        
    - If [self attestation](#self-attestation) was used, verify that [self attestation](#self-attestation) is acceptable under [Relying Party](#relying-party) policy.
        
    - Otherwise, use the X.509 certificates returned as the [attestation trust path](#attestation-trust-path) from the [verification procedure](#verification-procedure) to verify that the attestation public key either correctly chains up to an acceptable root certificate, or is itself an acceptable certificate (i.e., it and the root certificate obtained in Step 20 may be the same).
        
22. Check that the `[credentialId](#credentialid)` is not yet registered to any other user. If registration is requested for a credential that is already registered to a different user, the [Relying Party](#relying-party) SHOULD fail this [registration ceremony](#registration-ceremony), or it MAY decide to accept the registration, e.g. while deleting the older registration.
    
23. If the attestation statement attStmt verified successfully and is found to be trustworthy, then register the new credential with the account that was denoted in `` options.`[user](#dom-publickeycredentialcreationoptions-user)` ``:
    
    - Associate the user’s account with the `[credentialId](#credentialid)` and `[credentialPublicKey](#credentialpublickey)` in `authData.[attestedCredentialData](#attestedcredentialdata)`, as appropriate for the [Relying Party](#relying-party)'s system.
        
    - Associate the `[credentialId](#credentialid)` with a new stored [signature counter](#signature-counter) value initialized to the value of `authData.[signCount](#signcount)`.
        
    
    It is RECOMMENDED to also:
    
    - Associate the `[credentialId](#credentialid)` with the transport hints returned by calling `` credential.`[response](#dom-publickeycredential-response)`.`[getTransports()](#dom-authenticatorattestationresponse-gettransports)` ``. This value SHOULD NOT be modified before or after storing it. It is RECOMMENDED to use this value to populate the `[transports](#dom-publickeycredentialdescriptor-transports)` of the `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` option in future `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` calls to help the [client](#client) know how to find a suitable [authenticator](#authenticator).
        
24. If the attestation statement attStmt successfully verified but is not trustworthy per step 21 above, the [Relying Party](#relying-party) SHOULD fail the [registration ceremony](#registration-ceremony).
    
    NOTE: However, if permitted by policy, the [Relying Party](#relying-party) MAY register the [credential ID](#credential-id) and credential public key but treat the credential as one with [self attestation](#self-attestation) (see [§ 6.5.3 Attestation Types](#sctn-attestation-types)). If doing so, the [Relying Party](#relying-party) is asserting there is no cryptographic proof that the [public key credential](#public-key-credential) has been generated by a particular [authenticator](#authenticator) model. See [[FIDOSecRef]](#biblio-fidosecref) and [[UAFProtocol]](#biblio-uafprotocol) for a more detailed discussion.
    

Verification of [attestation objects](#attestation-object) requires that the [Relying Party](#relying-party) has a trusted method of determining acceptable trust anchors in step 20 above. Also, if certificates are being used, the [Relying Party](#relying-party) MUST have access to certificate status information for the intermediate CA certificates. The [Relying Party](#relying-party) MUST also be able to build the attestation certificate chain if the client did not provide this chain in the attestation information.

### 7.2. Verifying an Authentication Assertion[](#sctn-verifying-assertion)

In order to perform an [authentication ceremony](#authentication-ceremony), the [Relying Party](#relying-party) MUST proceed as follows:

1. Let options be a new `[PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)` structure configured to the [Relying Party](#relying-party)'s needs for the ceremony.
    
    If `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` `` is present, the `[transports](#dom-publickeycredentialdescriptor-transports)` member of each [item](https://infra.spec.whatwg.org/#list-item) SHOULD be set to the value returned by `` credential.`[response](#dom-publickeycredential-response)`.`[getTransports()](#dom-authenticatorattestationresponse-gettransports)` `` when the corresponding credential was registered.
    
2. Call `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` and pass options as the `` `[publicKey](#dom-credentialrequestoptions-publickey)` `` option. Let credential be the result of the successfully resolved promise. If the promise is rejected, abort the ceremony with a user-visible error, or otherwise guide the user experience as might be determinable from the context available in the rejected promise. For information on different error contexts and the circumstances leading to them, see [§ 6.3.3 The authenticatorGetAssertion Operation](#sctn-op-get-assertion).
    
3. Let response be `` credential.`[response](#dom-publickeycredential-response)` ``. If response is not an instance of `[AuthenticatorAssertionResponse](#authenticatorassertionresponse)`, abort the ceremony with a user-visible error.
    
4. Let clientExtensionResults be the result of calling `` credential.`[getClientExtensionResults()](#dom-publickeycredential-getclientextensionresults)` ``.
    
5. If `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` `` [is not empty](https://infra.spec.whatwg.org/#list-is-empty), verify that `` credential.`[id](https://w3c.github.io/webappsec-credential-management/#dom-credential-id)` `` identifies one of the [public key credentials](#public-key-credential) listed in `` options.`[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` ``.
    
6. Identify the user being authenticated and verify that this user is the owner of the [public key credential source](#public-key-credential-source) credentialSource identified by `` credential.`[id](https://w3c.github.io/webappsec-credential-management/#dom-credential-id)` ``:
    
    If the user was identified before the [authentication ceremony](#authentication-ceremony) was initiated, e.g., via a username or cookie,
    
    verify that the identified user is the owner of credentialSource. If `` response.`[userHandle](#dom-authenticatorassertionresponse-userhandle)` `` is present, let userHandle be its value. Verify that userHandle also maps to the same user.
    
    If the user was not identified before the [authentication ceremony](#authentication-ceremony) was initiated,
    
    verify that `` response.`[userHandle](#dom-authenticatorassertionresponse-userhandle)` `` is present, and that the user identified by this value is the owner of credentialSource.
    
7. Using `` credential.`[id](https://w3c.github.io/webappsec-credential-management/#dom-credential-id)` `` (or `` credential.`[rawId](#dom-publickeycredential-rawid)` ``, if [base64url encoding](#base64url-encoding) is inappropriate for your use case), look up the corresponding [credential public key](#credential-public-key) and let credentialPublicKey be that [credential public key](#credential-public-key).
    
8. Let cData, authData and sig denote the value of response’s `[clientDataJSON](#dom-authenticatorresponse-clientdatajson)`, `[authenticatorData](#dom-authenticatorassertionresponse-authenticatordata)`, and `[signature](#dom-authenticatorassertionresponse-signature)` respectively.
    
9. Let JSONtext be the result of running [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) on the value of cData.
    
    Note: Using any implementation of [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) is acceptable as long as it yields the same result as that yielded by the [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) algorithm. In particular, any leading byte order mark (BOM) MUST be stripped.
    
10. Let C, the [client data](#client-data) claimed as used for the signature, be the result of running an implementation-specific JSON parser on JSONtext.
    
    Note: C may be any implementation-specific data structure representation, as long as C’s components are referenceable, as required by this algorithm.
    
11. Verify that the value of `` C.`[type](#dom-collectedclientdata-type)` `` is the string `webauthn.get`.
    
12. Verify that the value of `` C.`[challenge](#dom-collectedclientdata-challenge)` `` equals the base64url encoding of `` options.`[challenge](#dom-publickeycredentialrequestoptions-challenge)` ``.
    
13. Verify that the value of `` C.`[origin](#dom-collectedclientdata-origin)` `` matches the [Relying Party](#relying-party)'s [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin).
    
14. Verify that the value of `` C.`[tokenBinding](#dom-collectedclientdata-tokenbinding)`.`[status](#dom-tokenbinding-status)` `` matches the state of [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) for the TLS connection over which the attestation was obtained. If [Token Binding](https://tools.ietf.org/html/rfc8471#section-1) was used on that TLS connection, also verify that `` C.`[tokenBinding](#dom-collectedclientdata-tokenbinding)`.`[id](#dom-tokenbinding-id)` `` matches the [base64url encoding](#base64url-encoding) of the [Token Binding ID](https://tools.ietf.org/html/rfc8471#section-3.2) for the connection.
    
15. [](#rp-op-verifying-assertion-step-rpid-hash)Verify that the `[rpIdHash](#rpidhash)` in authData is the SHA-256 hash of the [RP ID](#rp-id) expected by the [Relying Party](#relying-party).
    
    Note: If using the [appid](#appid) extension, this step needs some special logic. See [§ 10.1 FIDO AppID Extension (appid)](#sctn-appid-extension) for details.
    
16. Verify that the [User Present](#concept-user-present) bit of the `[flags](#flags)` in authData is set.
    
17. If [user verification](#user-verification) is required for this assertion, verify that the [User Verified](#concept-user-verified) bit of the `[flags](#flags)` in authData is set.
    
18. Verify that the values of the [client extension outputs](#client-extension-output) in clientExtensionResults and the [authenticator extension outputs](#authenticator-extension-output) in the `[extensions](#authdataextensions)` in authData are as expected, considering the [client extension input](#client-extension-input) values that were given in `` options.`[extensions](#dom-publickeycredentialrequestoptions-extensions)` `` and any specific policy of the [Relying Party](#relying-party) regarding unsolicited extensions, i.e., those that were not specified as part of `` options.`[extensions](#dom-publickeycredentialrequestoptions-extensions)` ``. In the general case, the meaning of "are as expected" is specific to the [Relying Party](#relying-party) and which extensions are in use.
    
    Note: [Client platforms](#client-platform) MAY enact local policy that sets additional [authenticator extensions](#authenticator-extension) or [client extensions](#client-extension) and thus cause values to appear in the [authenticator extension outputs](#authenticator-extension-output) or [client extension outputs](#client-extension-output) that were not originally specified as part of `` options.`[extensions](#dom-publickeycredentialrequestoptions-extensions)` ``. [Relying Parties](#relying-party) MUST be prepared to handle such situations, whether it be to ignore the unsolicited extensions or reject the assertion. The [Relying Party](#relying-party) can make this decision based on local policy and the extensions in use.
    
    Note: Since all extensions are OPTIONAL for both the [client](#client) and the [authenticator](#authenticator), the [Relying Party](#relying-party) MUST also be prepared to handle cases where none or not all of the requested extensions were acted upon.
    
19. Let hash be the result of computing a hash over the cData using SHA-256.
    
20. Using credentialPublicKey, verify that sig is a valid signature over the binary concatenation of authData and hash.
    
    Note: This verification step is compatible with signatures generated by FIDO U2F authenticators. See [§ 6.1.2 FIDO U2F Signature Format Compatibility](#sctn-fido-u2f-sig-format-compat).
    
21. Let storedSignCount be the stored [signature counter](#signature-counter) value associated with `` credential.`[id](https://w3c.github.io/webappsec-credential-management/#dom-credential-id)` ``. If authData.`[signCount](#signcount)` is nonzero or storedSignCount is nonzero, then run the following sub-step:
    
    - If authData.`[signCount](#signcount)` is
        
        greater than storedSignCount:
        
        Update storedSignCount to be the value of authData.`[signCount](#signcount)`.
        
        less than or equal to storedSignCount:
        
        This is a signal that the authenticator may be cloned, i.e. at least two copies of the [credential private key](#credential-private-key) may exist and are being used in parallel. [Relying Parties](#relying-party) should incorporate this information into their risk scoring. Whether the [Relying Party](#relying-party) updates storedSignCount in this case, or not, or fails the [authentication ceremony](#authentication-ceremony) or not, is [Relying Party](#relying-party)-specific.
        
22. If all the above steps are successful, continue with the [authentication ceremony](#authentication-ceremony) as appropriate. Otherwise, fail the [authentication ceremony](#authentication-ceremony).
    

## 8. Defined Attestation Statement Formats[](#sctn-defined-attestation-formats)

WebAuthn supports pluggable attestation statement formats. This section defines an initial set of such formats.

### 8.1. Attestation Statement Format Identifiers[](#sctn-attstn-fmt-ids)

Attestation statement formats are identified by a string, called an attestation statement format identifier, chosen by the author of the [attestation statement format](#attestation-statement-format).

Attestation statement format identifiers SHOULD be registered in the IANA "WebAuthn Attestation Statement Format Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809). All registered attestation statement format identifiers are unique amongst themselves as a matter of course.

Unregistered attestation statement format identifiers SHOULD use lowercase reverse domain-name naming, using a domain name registered by the developer, in order to assure uniqueness of the identifier. All attestation statement format identifiers MUST be a maximum of 32 octets in length and MUST consist only of printable USASCII characters, excluding backslash and doublequote, i.e., VCHAR as defined in [[RFC5234]](#biblio-rfc5234) but without %x22 and %x5c.

Note: This means attestation statement format identifiers based on domain names MUST incorporate only LDH Labels [[RFC5890]](#biblio-rfc5890).

Implementations MUST match WebAuthn attestation statement format identifiers in a case-sensitive fashion.

Attestation statement formats that may exist in multiple versions SHOULD include a version in their identifier. In effect, different versions are thus treated as different formats, e.g., `packed2` as a new version of the [§ 8.2 Packed Attestation Statement Format](#sctn-packed-attestation).

The following sections present a set of currently-defined and registered attestation statement formats and their identifiers. The up-to-date list of registered [WebAuthn Extensions](#webauthn-extensions) is maintained in the IANA "WebAuthn Attestation Statement Format Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809).

### 8.2. Packed Attestation Statement Format[](#sctn-packed-attestation)

This is a WebAuthn optimized attestation statement format. It uses a very compact but still extensible encoding method. It is implementable by [authenticators](#authenticator) with limited resources (e.g., secure elements).

Attestation statement format identifier

packed

Attestation types supported

[Basic](#basic), [Self](#self), [AttCA](#attca)

Syntax

The syntax of a Packed Attestation statement is defined by the following CDDL:

    $$attStmtType //= (
                          fmt: "packed",
                          attStmt: packedStmtFormat
                      )

    packedStmtFormat = {
                           alg: COSEAlgorithmIdentifier,
                           sig: bytes,
                           x5c: [ attestnCert: bytes, * (caCert: bytes) ]
                       } //
                       {
                           alg: COSEAlgorithmIdentifier
                           sig: bytes,
                       }

The semantics of the fields are as follows:

alg

A `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)` containing the identifier of the algorithm used to generate the [attestation signature](#attestation-signature).

sig

A byte string containing the [attestation signature](#attestation-signature).

x5c

The elements of this array contain attestnCert and its certificate chain (if any), each encoded in X.509 format. The attestation certificate attestnCert MUST be the first element in the array.

attestnCert

The attestation certificate, encoded in X.509 format.

Signing procedure

The signing procedure for this attestation statement format is similar to [the procedure for generating assertion signatures](#fig-signature).

1. Let authenticatorData denote the [authenticator data for the attestation](#authenticator-data-for-the-attestation), and let clientDataHash denote the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data).
    
2. If [Basic](#basic) or [AttCA](#attca) [attestation](#attestation) is in use, the authenticator produces the sig by concatenating authenticatorData and clientDataHash, and signing the result using an [attestation private key](#attestation-private-key) selected through an authenticator-specific mechanism. It sets x5c to attestnCert followed by the related certificate chain (if any). It sets alg to the algorithm of the attestation private key.
    
3. If [self attestation](#self-attestation) is in use, the authenticator produces sig by concatenating authenticatorData and clientDataHash, and signing the result using the credential private key. It sets alg to the algorithm of the credential private key and omits the other fields.
    

Verification procedure

Given the [verification procedure inputs](#verification-procedure-inputs) attStmt, authenticatorData and clientDataHash, the [verification procedure](#verification-procedure) is as follows:

1. Verify that attStmt is valid CBOR conforming to the syntax defined above and perform CBOR decoding on it to extract the contained fields.
    
2. If x5c is present:
    
    - Verify that sig is a valid signature over the concatenation of authenticatorData and clientDataHash using the attestation public key in attestnCert with the algorithm specified in alg.
        
    - Verify that attestnCert meets the requirements in [§ 8.2.1 Packed Attestation Statement Certificate Requirements](#sctn-packed-attestation-cert-requirements).
        
    - If attestnCert contains an extension with OID `1.3.6.1.4.1.45724.1.1.4` (`id-fido-gen-ce-aaguid`) verify that the value of this extension matches the `[aaguid](#aaguid)` in authenticatorData.
        
    - Optionally, inspect x5c and consult externally provided knowledge to determine whether attStmt conveys a [Basic](#basic) or [AttCA](#attca) attestation.
        
    - If successful, return implementation-specific values representing [attestation type](#attestation-type) [Basic](#basic), [AttCA](#attca) or uncertainty, and [attestation trust path](#attestation-trust-path) x5c.
        
3. If x5c is not present, [self attestation](#self-attestation) is in use.
    
    - Validate that alg matches the algorithm of the `[credentialPublicKey](#credentialpublickey)` in authenticatorData.
        
    - Verify that sig is a valid signature over the concatenation of authenticatorData and clientDataHash using the credential public key with alg.
        
    - If successful, return implementation-specific values representing [attestation type](#attestation-type) [Self](#self) and an empty [attestation trust path](#attestation-trust-path).
        

#### 8.2.1. Packed Attestation Statement Certificate Requirements[](#sctn-packed-attestation-cert-requirements)

The attestation certificate MUST have the following fields/extensions:

- Version MUST be set to 3 (which is indicated by an ASN.1 INTEGER with value 2).
    
- Subject field MUST be set to:
    
    Subject-C
    
    ISO 3166 code specifying the country where the Authenticator vendor is incorporated (PrintableString)
    
    Subject-O
    
    Legal name of the Authenticator vendor (UTF8String)
    
    Subject-OU
    
    Literal string “Authenticator Attestation” (UTF8String)
    
    Subject-CN
    
    A UTF8String of the vendor’s choosing
    
- If the related attestation root certificate is used for multiple authenticator models, the Extension OID `1.3.6.1.4.1.45724.1.1.4` (`id-fido-gen-ce-aaguid`) MUST be present, containing the AAGUID as a 16-byte OCTET STRING. The extension MUST NOT be marked as critical.
    
    Note that an X.509 Extension encodes the DER-encoding of the value in an OCTET STRING. Thus, the AAGUID MUST be wrapped in _two_ OCTET STRINGS to be valid. Here is a sample, encoded Extension structure:
    
    30 21                                     -- SEQUENCE
      06 0b 2b 06 01 04 01 82 e5 1c 01 01 04  -- 1.3.6.1.4.1.45724.1.1.4
      04 12                                   -- OCTET STRING
        04 10                                 -- OCTET STRING
          cd 8c 39 5c 26 ed ee de             -- AAGUID
          65 3b 00 79 7d 03 ca 3c
    
- The Basic Constraints extension MUST have the CA component set to `false`.
    
- An Authority Information Access (AIA) extension with entry `id-ad-ocsp` and a CRL Distribution Point extension [[RFC5280]](#biblio-rfc5280) are both OPTIONAL as the status of many attestation certificates is available through authenticator metadata services. See, for example, the FIDO Metadata Service [[FIDOMetadataService]](#biblio-fidometadataservice).
    

### 8.3. TPM Attestation Statement Format[](#sctn-tpm-attestation)

This attestation statement format is generally used by authenticators that use a Trusted Platform Module as their cryptographic engine.

Attestation statement format identifier

tpm

Attestation types supported

[AttCA](#attca)

Syntax

The syntax of a TPM Attestation statement is as follows:

    $$attStmtType // = (
                           fmt: "tpm",
                           attStmt: tpmStmtFormat
                       )

    tpmStmtFormat = {
                        ver: "2.0",
                        (
                            alg: COSEAlgorithmIdentifier,
                            x5c: [ aikCert: bytes, * (caCert: bytes) ]
                        )
                        sig: bytes,
                        certInfo: bytes,
                        pubArea: bytes
                    }

The semantics of the above fields are as follows:

ver

The version of the TPM specification to which the signature conforms.

alg

A `[COSEAlgorithmIdentifier](#typedefdef-cosealgorithmidentifier)` containing the identifier of the algorithm used to generate the [attestation signature](#attestation-signature).

x5c

aikCert followed by its certificate chain, in X.509 encoding.

aikCert

The AIK certificate used for the attestation, in X.509 encoding.

sig

The [attestation signature](#attestation-signature), in the form of a TPMT_SIGNATURE structure as specified in [[TPMv2-Part2]](#biblio-tpmv2-part2) section 11.3.4.

certInfo

The TPMS_ATTEST structure over which the above signature was computed, as specified in [[TPMv2-Part2]](#biblio-tpmv2-part2) section 10.12.8.

pubArea

The TPMT_PUBLIC structure (see [[TPMv2-Part2]](#biblio-tpmv2-part2) section 12.2.4) used by the TPM to represent the credential public key.

Signing procedure

Let authenticatorData denote the [authenticator data for the attestation](#authenticator-data-for-the-attestation), and let clientDataHash denote the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data).

Concatenate authenticatorData and clientDataHash to form attToBeSigned.

Generate a signature using the procedure specified in [[TPMv2-Part3]](#biblio-tpmv2-part3) Section 18.2, using the attestation private key and setting the `extraData` parameter to the digest of attToBeSigned using the hash algorithm corresponding to the "alg" signature algorithm. (For the "RS256" algorithm, this would be a SHA-256 digest.)

Set the pubArea field to the public area of the credential public key, the certInfo field to the output parameter of the same name, and the sig field to the signature obtained from the above procedure.

Verification procedure

Given the [verification procedure inputs](#verification-procedure-inputs) attStmt, authenticatorData and clientDataHash, the [verification procedure](#verification-procedure) is as follows:

Verify that attStmt is valid CBOR conforming to the syntax defined above and perform CBOR decoding on it to extract the contained fields.

Verify that the public key specified by the `parameters` and `unique` fields of pubArea is identical to the `[credentialPublicKey](#credentialpublickey)` in the `[attestedCredentialData](#attestedcredentialdata)` in authenticatorData.

Concatenate authenticatorData and clientDataHash to form attToBeSigned.

Validate that certInfo is valid:

- Verify that `magic` is set to `TPM_GENERATED_VALUE`.
    
- Verify that `type` is set to `TPM_ST_ATTEST_CERTIFY`.
    
- Verify that `extraData` is set to the hash of attToBeSigned using the hash algorithm employed in "alg".
    
- Verify that `attested` contains a `TPMS_CERTIFY_INFO` structure as specified in [[TPMv2-Part2]](#biblio-tpmv2-part2) section 10.12.3, whose `name` field contains a valid Name for pubArea, as computed using the algorithm in the `nameAlg` field of pubArea using the procedure specified in [[TPMv2-Part1]](#biblio-tpmv2-part1) section 16.
    
- Verify that x5c is present.
    
- Note that the remaining fields in the "Standard Attestation Structure" [[TPMv2-Part1]](#biblio-tpmv2-part1) section 31.2, i.e., `qualifiedSigner`, `clockInfo` and `firmwareVersion` are ignored. These fields MAY be used as an input to risk engines.
    
- Verify the sig is a valid signature over certInfo using the attestation public key in aikCert with the algorithm specified in alg.
    
- Verify that aikCert meets the requirements in [§ 8.3.1 TPM Attestation Statement Certificate Requirements](#sctn-tpm-cert-requirements).
    
- If aikCert contains an extension with OID `1.3.6.1.4.1.45724.1.1.4` (`id-fido-gen-ce-aaguid`) verify that the value of this extension matches the `[aaguid](#aaguid)` in authenticatorData.
    
- If successful, return implementation-specific values representing [attestation type](#attestation-type) [AttCA](#attca) and [attestation trust path](#attestation-trust-path) x5c.
    

#### 8.3.1. TPM Attestation Statement Certificate Requirements[](#sctn-tpm-cert-requirements)

TPM [attestation certificate](#attestation-certificate) MUST have the following fields/extensions:

- Version MUST be set to 3.
    
- Subject field MUST be set to empty.
    
- The Subject Alternative Name extension MUST be set as defined in [[TPMv2-EK-Profile]](#biblio-tpmv2-ek-profile) section 3.2.9.
    
- The Extended Key Usage extension MUST contain the OID `2.23.133.8.3` ("joint-iso-itu-t(2) internationalorganizations(23) 133 tcg-kp(8) tcg-kp-AIKCertificate(3)").
    
- The Basic Constraints extension MUST have the CA component set to `false`.
    
- An Authority Information Access (AIA) extension with entry `id-ad-ocsp` and a CRL Distribution Point extension [[RFC5280]](#biblio-rfc5280) are both OPTIONAL as the status of many attestation certificates is available through metadata services. See, for example, the FIDO Metadata Service [[FIDOMetadataService]](#biblio-fidometadataservice).
    

### 8.4. Android Key Attestation Statement Format[](#sctn-android-key-attestation)

When the [authenticator](#authenticator) in question is a [platform authenticator](#platform-authenticators) on the Android "N" or later platform, the attestation statement is based on the [Android key attestation](https://source.android.com/security/keystore/attestation). In these cases, the attestation statement is produced by a component running in a secure operating environment, but the [authenticator data for the attestation](#authenticator-data-for-the-attestation) is produced outside this environment. The [WebAuthn Relying Party](#webauthn-relying-party) is expected to check that the [authenticator data claimed to have been used for the attestation](#authenticator-data-claimed-to-have-been-used-for-the-attestation) is consistent with the fields of the attestation certificate’s extension data.

Attestation statement format identifier

android-key

Attestation types supported

[Basic](#basic)

Syntax

An Android key attestation statement consists simply of the Android attestation statement, which is a series of DER encoded X.509 certificates. See [the Android developer documentation](https://developer.android.com/training/articles/security-key-attestation.html). Its syntax is defined as follows:

    $$attStmtType //= (
                          fmt: "android-key",
                          attStmt: androidStmtFormat
                      )

    androidStmtFormat = {
                          alg: COSEAlgorithmIdentifier,
                          sig: bytes,
                          x5c: [ credCert: bytes, * (caCert: bytes) ]
                        }

Signing procedure

Let authenticatorData denote the [authenticator data for the attestation](#authenticator-data-for-the-attestation), and let clientDataHash denote the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data).

Request an Android Key Attestation by calling `keyStore.getCertificateChain(myKeyUUID)` providing clientDataHash as the challenge value (e.g., by using [setAttestationChallenge](https://developer.android.com/reference/android/security/keystore/KeyGenParameterSpec.Builder.html#setAttestationChallenge\(byte%5B%5D\))). Set x5c to the returned value.

The authenticator produces sig by concatenating authenticatorData and clientDataHash, and signing the result using the credential private key. It sets alg to the algorithm of the signature format.

Verification procedure

Given the [verification procedure inputs](#verification-procedure-inputs) attStmt, authenticatorData and clientDataHash, the [verification procedure](#verification-procedure) is as follows:

- Verify that attStmt is valid CBOR conforming to the syntax defined above and perform CBOR decoding on it to extract the contained fields.
    
- Verify that sig is a valid signature over the concatenation of authenticatorData and clientDataHash using the public key in the first certificate in x5c with the algorithm specified in alg.
    
- Verify that the public key in the first certificate in x5c matches the `[credentialPublicKey](#credentialpublickey)` in the `[attestedCredentialData](#attestedcredentialdata)` in authenticatorData.
    
- Verify that the `attestationChallenge` field in the [attestation certificate](#attestation-certificate) [extension data](#android-key-attestation-certificate-extension-data) is identical to clientDataHash.
    
- Verify the following using the appropriate authorization list from the attestation certificate [extension data](#android-key-attestation-certificate-extension-data):
    
    - The `AuthorizationList.allApplications` field is _not_ present on either authorization list (`softwareEnforced` nor `teeEnforced`), since PublicKeyCredential MUST be [scoped](#scope) to the [RP ID](#rp-id).
        
    - For the following, use only the `teeEnforced` authorization list if the RP wants to accept only keys from a trusted execution environment, otherwise use the union of `teeEnforced` and `softwareEnforced`.
        
        - The value in the `AuthorizationList.origin` field is equal to `KM_ORIGIN_GENERATED`.
            
        - The value in the `AuthorizationList.purpose` field is equal to `KM_PURPOSE_SIGN`.
            
- If successful, return implementation-specific values representing [attestation type](#attestation-type) [Basic](#basic) and [attestation trust path](#attestation-trust-path) x5c.
    

#### 8.4.1. Android Key Attestation Statement Certificate Requirements[](#sctn-key-attstn-cert-requirements)

Android Key Attestation [attestation certificate](#attestation-certificate)'s android key attestation certificate extension data is identified by the OID `1.3.6.1.4.1.11129.2.1.17`, and its schema is defined in the [Android developer documentation](https://developer.android.com/training/articles/security-key-attestation#certificate_schema).

### 8.5. Android SafetyNet Attestation Statement Format[](#sctn-android-safetynet-attestation)

When the [authenticator](#authenticator) is a [platform authenticator](#platform-authenticators) on certain Android platforms, the attestation statement may be based on the [SafetyNet API](https://developer.android.com/training/safetynet/attestation#compat-check-response). In this case the [authenticator data](#authenticator-data) is completely controlled by the caller of the SafetyNet API (typically an application running on the Android platform) and the attestation statement provides some statements about the health of the platform and the identity of the calling application (see [SafetyNet Documentation](https://developer.android.com/training/safetynet/attestation.html) for more details).

Attestation statement format identifier

android-safetynet

Attestation types supported

[Basic](#basic)

Syntax

The syntax of an Android Attestation statement is defined as follows:

    $$attStmtType //= (
                          fmt: "android-safetynet",
                          attStmt: safetynetStmtFormat
                      )

    safetynetStmtFormat = {
                              ver: text,
                              response: bytes
                          }

The semantics of the above fields are as follows:

ver

The version number of Google Play Services responsible for providing the SafetyNet API.

response

The [UTF-8 encoded](https://encoding.spec.whatwg.org/#utf-8-encode) result of the getJwsResult() call of the SafetyNet API. This value is a JWS [[RFC7515]](#biblio-rfc7515) object (see [SafetyNet online documentation](https://developer.android.com/training/safetynet/attestation#compat-check-response)) in Compact Serialization.

Signing procedure

Let authenticatorData denote the [authenticator data for the attestation](#authenticator-data-for-the-attestation), and let clientDataHash denote the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data).

Concatenate authenticatorData and clientDataHash, perform SHA-256 hash of the concatenated string, and let the result of the hash form attToBeSigned.

Request a SafetyNet attestation, providing attToBeSigned as the nonce value. Set response to the result, and ver to the version of Google Play Services running in the authenticator.

Verification procedure

Given the [verification procedure inputs](#verification-procedure-inputs) attStmt, authenticatorData and clientDataHash, the [verification procedure](#verification-procedure) is as follows:

- Verify that attStmt is valid CBOR conforming to the syntax defined above and perform CBOR decoding on it to extract the contained fields.
    
- Verify that response is a valid SafetyNet response of version ver by following the steps indicated by the [SafetyNet online documentation](https://developer.android.com/training/safetynet/attestation.html#compat-check-response). As of this writing, there is only one format of the SafetyNet response and ver is reserved for future use.
    
- Verify that the `nonce` attribute in the payload of response is identical to the Base64 encoding of the SHA-256 hash of the concatenation of authenticatorData and clientDataHash.
    
- Verify that the SafetyNet response actually came from the SafetyNet service by following the steps in the [SafetyNet online documentation](https://developer.android.com/training/safetynet/attestation#compat-check-response).
    
- If successful, return implementation-specific values representing [attestation type](#attestation-type) [Basic](#basic) and [attestation trust path](#attestation-trust-path) x5c.
    

### 8.6. FIDO U2F Attestation Statement Format[](#sctn-fido-u2f-attestation)

This attestation statement format is used with FIDO U2F authenticators using the formats defined in [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats).

Attestation statement format identifier

fido-u2f

Attestation types supported

[Basic](#basic), [AttCA](#attca)

Syntax

The syntax of a FIDO U2F attestation statement is defined as follows:

    $$attStmtType //= (
                          fmt: "fido-u2f",
                          attStmt: u2fStmtFormat
                      )

    u2fStmtFormat = {
                        x5c: [ attestnCert: bytes ],
                        sig: bytes
                    }

The semantics of the above fields are as follows:

x5c

A single element array containing the attestation certificate in X.509 format.

sig

The [attestation signature](#attestation-signature). The signature was calculated over the (raw) U2F registration response message [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats) received by the [client](#client) from the authenticator.

Signing procedure

If the [credential public key](#credential-public-key) of the [attested credential](#attestedcredentialdata) is not of algorithm -7 ("ES256"), stop and return an error. Otherwise, let authenticatorData denote the [authenticator data for the attestation](#authenticator-data-for-the-attestation), and let clientDataHash denote the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data). (Since SHA-256 is used to hash the serialized [client data](#client-data), clientDataHash will be 32 bytes long.)

Generate a Registration Response Message as specified in [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats) [Section 4.3](https://fidoalliance.org/specs/fido-u2f-v1.1-id-20160915/fido-u2f-raw-message-formats-v1.1-id-20160915.html#registration-response-message-success), with the application parameter set to the SHA-256 hash of the [RP ID](#rp-id) that the given [credential](#public-key-credential) is [scoped](#scope) to, the challenge parameter set to clientDataHash, and the key handle parameter set to the [credential ID](#credential-id) of the given credential. Set the raw signature part of this Registration Response Message (i.e., without the [user public key](#user-public-key), key handle, and attestation certificates) as sig and set the attestation certificates of the attestation public key as x5c.

Verification procedure

Given the [verification procedure inputs](#verification-procedure-inputs) attStmt, authenticatorData and clientDataHash, the [verification procedure](#verification-procedure) is as follows:

1. Verify that attStmt is valid CBOR conforming to the syntax defined above and perform CBOR decoding on it to extract the contained fields.
    
2. Check that x5c has exactly one element and let attCert be that element. Let certificate public key be the public key conveyed by attCert. If certificate public key is not an Elliptic Curve (EC) public key over the P-256 curve, terminate this algorithm and return an appropriate error.
    
3. Extract the claimed rpIdHash from authenticatorData, and the claimed credentialId and credentialPublicKey from authenticatorData.`[attestedCredentialData](#attestedcredentialdata)`.
    
4. Convert the COSE_KEY formatted credentialPublicKey (see [Section 7](https://tools.ietf.org/html/rfc8152#section-7) of [[RFC8152]](#biblio-rfc8152)) to Raw ANSI X9.62 public key format (see ALG_KEY_ECC_X962_RAW in [Section 3.6.2 Public Key Representation Formats](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-registry-v2.0-id-20180227.html#public-key-representation-formats) of [[FIDO-Registry]](#biblio-fido-registry)).
    
    - Let x be the value corresponding to the "-2" key (representing x coordinate) in credentialPublicKey, and confirm its size to be of 32 bytes. If size differs or "-2" key is not found, terminate this algorithm and return an appropriate error.
        
    - Let y be the value corresponding to the "-3" key (representing y coordinate) in credentialPublicKey, and confirm its size to be of 32 bytes. If size differs or "-3" key is not found, terminate this algorithm and return an appropriate error.
        
    - Let publicKeyU2F be the concatenation `0x04 || x || y`.
        
        Note: This signifies uncompressed ECC key format.
        
5. Let verificationData be the concatenation of (0x00 || rpIdHash || clientDataHash || credentialId || publicKeyU2F) (see [Section 4.3](https://fidoalliance.org/specs/fido-u2f-v1.1-id-20160915/fido-u2f-raw-message-formats-v1.1-id-20160915.html#registration-response-message-success) of [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats)).
    
6. Verify the sig using verificationData and the certificate public key per section 4.1.4 of [[SEC1]](#biblio-sec1) with SHA-256 as the hash function used in step two.
    
7. Optionally, inspect x5c and consult externally provided knowledge to determine whether attStmt conveys a [Basic](#basic) or [AttCA](#attca) attestation.
    
8. If successful, return implementation-specific values representing [attestation type](#attestation-type) [Basic](#basic), [AttCA](#attca) or uncertainty, and [attestation trust path](#attestation-trust-path) x5c.
    

### 8.7. None Attestation Statement Format[](#sctn-none-attestation)

The none attestation statement format is used to replace any [authenticator](#authenticator)-provided [attestation statement](#attestation-statement) when a [WebAuthn Relying Party](#webauthn-relying-party) indicates it does not wish to receive attestation information, see [§ 5.4.7 Attestation Conveyance Preference Enumeration (enum AttestationConveyancePreference)](#enum-attestation-convey).

The [authenticator](#authenticator) MAY also directly generate attestation statements of this format if the [authenticator](#authenticator) does not support [attestation](#attestation).

Attestation statement format identifier

none

Attestation types supported

[None](#none)

Syntax

The syntax of a none attestation statement is defined as follows:

    $$attStmtType //= (
                          fmt: "none",
                          attStmt: emptyMap
                      )

    emptyMap = {}

Signing procedure

Return the fixed attestation statement defined above.

Verification procedure

Return implementation-specific values representing [attestation type](#attestation-type) [None](#none) and an empty [attestation trust path](#attestation-trust-path).

### 8.8. Apple Anonymous Attestation Statement Format[](#sctn-apple-anonymous-attestation)

This attestation statement format is exclusively used by Apple for certain types of Apple devices that support WebAuthn.

Attestation statement format identifier

apple

Attestation types supported

[Anonymization CA](#anonymization-ca)

Syntax

The syntax of an Apple attestation statement is defined as follows:

    $$attStmtType //= (
                          fmt: "apple",
                          attStmt: appleStmtFormat
                      )

    appleStmtFormat = {
                          x5c: [ credCert: bytes, * (caCert: bytes) ]
                      }

The semantics of the above fields are as follows:

x5c

credCert followed by its certificate chain, each encoded in X.509 format.

credCert

The credential public key certificate used for attestation, encoded in X.509 format.

Signing procedure

1. Let authenticatorData denote the authenticator data for the attestation, and let clientDataHash denote the [hash of the serialized client data](#collectedclientdata-hash-of-the-serialized-client-data).
    
2. Concatenate authenticatorData and clientDataHash to form nonceToHash.
    
3. Perform SHA-256 hash of nonceToHash to produce nonce.
    
4. Let Apple anonymous attestation CA generate an X.509 certificate for the [credential public key](#credential-public-key) and include the nonce as a certificate extension with OID `1.2.840.113635.100.8.2`. credCert denotes this certificate. The credCert thus serves as a proof of the attestation, and the included nonce proves the attestation is live. In addition to that, the nonce also protects the integrity of the authenticatorData and [client data](#client-data).
    
5. Set x5c to credCert followed by its certificate chain.
    

Verification procedure

Given the verification procedure inputs attStmt, authenticatorData and clientDataHash, the verification procedure is as follows:

1. Verify that attStmt is valid CBOR conforming to the syntax defined above and perform CBOR decoding on it to extract the contained fields.
    
2. Concatenate authenticatorData and clientDataHash to form nonceToHash.
    
3. Perform SHA-256 hash of nonceToHash to produce nonce.
    
4. Verify that nonce equals the value of the extension with OID `1.2.840.113635.100.8.2` in credCert.
    
5. Verify that the [credential public key](#credential-public-key) equals the Subject Public Key of credCert.
    
6. If successful, return implementation-specific values representing attestation type [Anonymization CA](#anonymization-ca) and attestation trust path x5c.
    

## 9. WebAuthn Extensions[](#sctn-extensions)

The mechanism for generating [public key credentials](#public-key-credential), as well as requesting and generating Authentication assertions, as defined in [§ 5 Web Authentication API](#sctn-api), can be extended to suit particular use cases. Each case is addressed by defining a registration extension and/or an authentication extension.

Every extension is a client extension, meaning that the extension involves communication with and processing by the client. [Client extensions](#client-extension) define the following steps and data:

- `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` extension request parameters and response values for [registration extensions](#registration-extension).
    
- `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` extension request parameters and response values for [authentication extensions](#authentication-extension).
    
- [Client extension processing](#client-extension-processing) for [registration extensions](#registration-extension) and [authentication extensions](#authentication-extension).
    

When creating a [public key credential](#public-key-credential) or requesting an [authentication assertion](#authentication-assertion), a [WebAuthn Relying Party](#webauthn-relying-party) can request the use of a set of extensions. These extensions will be invoked during the requested operation if they are supported by the client and/or the [WebAuthn Authenticator](#webauthn-authenticator). The [Relying Party](#relying-party) sends the [client extension input](#client-extension-input) for each extension in the `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` call (for [authentication extensions](#authentication-extension)) or `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` call (for [registration extensions](#registration-extension)) to the [client](#client). The [client](#client) performs [client extension processing](#client-extension-processing) for each extension that the [client platform](#client-platform) supports, and augments the [client data](#client-data) as specified by each extension, by including the [extension identifier](#extension-identifier) and [client extension output](#client-extension-output) values.

An extension can also be an authenticator extension, meaning that the extension involves communication with and processing by the authenticator. [Authenticator extensions](#authenticator-extension) define the following steps and data:

- [authenticatorMakeCredential](#authenticatormakecredential) extension request parameters and response values for [registration extensions](#registration-extension).
    
- [authenticatorGetAssertion](#authenticatorgetassertion) extension request parameters and response values for [authentication extensions](#authentication-extension).
    
- [Authenticator extension processing](#authenticator-extension-processing) for [registration extensions](#registration-extension) and [authentication extensions](#authentication-extension).
    

For [authenticator extensions](#authenticator-extension), as part of the [client extension processing](#client-extension-processing), the client also creates the [CBOR](#cbor) [authenticator extension input](#authenticator-extension-input) value for each extension (often based on the corresponding [client extension input](#client-extension-input) value), and passes them to the authenticator in the `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` call (for [registration extensions](#registration-extension)) or the `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` call (for [authentication extensions](#authentication-extension)). These [authenticator extension input](#authenticator-extension-input) values are represented in [CBOR](#cbor) and passed as name-value pairs, with the [extension identifier](#extension-identifier) as the name, and the corresponding [authenticator extension input](#authenticator-extension-input) as the value. The authenticator, in turn, performs additional processing for the extensions that it supports, and returns the [CBOR](#cbor) [authenticator extension output](#authenticator-extension-output) for each as specified by the extension. Part of the [client extension processing](#client-extension-processing) for [authenticator extensions](#authenticator-extension) is to use the [authenticator extension output](#authenticator-extension-output) as an input to creating the [client extension output](#client-extension-output).

All [WebAuthn Extensions](#webauthn-extensions) are OPTIONAL for both clients and authenticators. Thus, any extensions requested by a [Relying Party](#relying-party) MAY be ignored by the client browser or OS and not passed to the authenticator at all, or they MAY be ignored by the authenticator. Ignoring an extension is never considered a failure in WebAuthn API processing, so when [Relying Parties](#relying-party) include extensions with any API calls, they MUST be prepared to handle cases where some or all of those extensions are ignored.

Clients wishing to support the widest possible range of extensions MAY choose to pass through any extensions that they do not recognize to authenticators, generating the [authenticator extension input](#authenticator-extension-input) by simply encoding the [client extension input](#client-extension-input) in CBOR. All [WebAuthn Extensions](#webauthn-extensions) MUST be defined in such a way that this implementation choice does not endanger the user’s security or privacy. For instance, if an extension requires client processing, it could be defined in a manner that ensures such a naïve pass-through will produce a semantically invalid [authenticator extension input](#authenticator-extension-input) value, resulting in the extension being ignored by the authenticator. Since all extensions are OPTIONAL, this will not cause a functional failure in the API operation. Likewise, clients can choose to produce a [client extension output](#client-extension-output) value for an extension that it does not understand by encoding the [authenticator extension output](#authenticator-extension-output) value into JSON, provided that the CBOR output uses only types present in JSON.

When [clients](#client) choose to pass through extensions they do not recognize, the JavaScript values in the [client extension inputs](#client-extension-input) are converted to [CBOR](#cbor) values in the [authenticator extension inputs](#authenticator-extension-input). When the JavaScript value is an [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor), it is converted to a [CBOR](#cbor) byte array. When the JavaScript value is a non-integer number, it is converted to a 64-bit CBOR floating point number. Otherwise, when the JavaScript type corresponds to a JSON type, the conversion is done using the rules defined in Section 6.2 of [[RFC8949]](#biblio-rfc8949) (Converting from JSON to CBOR), but operating on inputs of JavaScript type values rather than inputs of JSON type values. Once these conversions are done, canonicalization of the resulting [CBOR](#cbor) MUST be performed using the [CTAP2 canonical CBOR encoding form](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#ctap2-canonical-cbor-encoding-form).

Note that the JavaScript numeric conversion rules have the consequence that when a client passes through an extension it does not recognize, if the extension uses floating point values, [authenticators](#authenticator) need to be prepared to receive those values as [CBOR](#cbor) integers, should the [authenticator](#authenticator) want the extension to always work without actual [client](#client) support for it. This will happen when the floating point values used happen to be integers.

Likewise, when clients receive outputs from extensions they have passed through that they do not recognize, the [CBOR](#cbor) values in the [authenticator extension outputs](#authenticator-extension-output) are converted to JavaScript values in the [client extension outputs](#client-extension-output). When the CBOR value is a byte string, it is converted to a JavaScript [%ArrayBuffer%](https://tc39.github.io/ecma262/#sec-arraybuffer-constructor) (rather than a base64url-encoded string). Otherwise, when the CBOR type corresponds to a JSON type, the conversion is done using the rules defined in Section 6.1 of [[RFC8949]](#biblio-rfc8949) (Converting from CBOR to JSON), but producing outputs of JavaScript type values rather than outputs of JSON type values.

Note that some clients may choose to implement this pass-through capability under a feature flag. Supporting this capability can facilitate innovation, allowing authenticators to experiment with new extensions and [Relying Parties](#relying-party) to use them before there is explicit support for them in clients.

The IANA "WebAuthn Extension Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809) can be consulted for an up-to-date list of registered [WebAuthn Extensions](#webauthn-extensions).

### 9.1. Extension Identifiers[](#sctn-extension-id)

Extensions are identified by a string, called an extension identifier, chosen by the extension author.

Extension identifiers SHOULD be registered in the IANA "WebAuthn Extension Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809). All registered extension identifiers are unique amongst themselves as a matter of course.

Unregistered extension identifiers SHOULD aim to be globally unique, e.g., by including the defining entity such as `myCompany_extension`.

All extension identifiers MUST be a maximum of 32 octets in length and MUST consist only of printable USASCII characters, excluding backslash and doublequote, i.e., VCHAR as defined in [[RFC5234]](#biblio-rfc5234) but without %x22 and %x5c. Implementations MUST match WebAuthn extension identifiers in a case-sensitive fashion.

Extensions that may exist in multiple versions should take care to include a version in their identifier. In effect, different versions are thus treated as different extensions, e.g., `myCompany_extension_01`

[§ 10 Defined Extensions](#sctn-defined-extensions) defines an additional set of extensions and their identifiers. See the IANA "WebAuthn Extension Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809) for an up-to-date list of registered WebAuthn Extension Identifiers.

### 9.2. Defining Extensions[](#sctn-extension-specification)

A definition of an extension MUST specify an [extension identifier](#extension-identifier), a [client extension input](#client-extension-input) argument to be sent via the `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` or `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` call, the [client extension processing](#client-extension-processing) rules, and a [client extension output](#client-extension-output) value. If the extension communicates with the authenticator (meaning it is an [authenticator extension](#authenticator-extension)), it MUST also specify the [CBOR](#cbor) [authenticator extension input](#authenticator-extension-input) argument sent via the [authenticatorGetAssertion](#authenticatorgetassertion) or [authenticatorMakeCredential](#authenticatormakecredential) call, the [authenticator extension processing](#authenticator-extension-processing) rules, and the [CBOR](#cbor) [authenticator extension output](#authenticator-extension-output) value.

Any [client extension](#client-extension) that is processed by the client MUST return a [client extension output](#client-extension-output) value so that the [WebAuthn Relying Party](#webauthn-relying-party) knows that the extension was honored by the client. Similarly, any extension that requires authenticator processing MUST return an [authenticator extension output](#authenticator-extension-output) to let the [Relying Party](#relying-party) know that the extension was honored by the authenticator. If an extension does not otherwise require any result values, it SHOULD be defined as returning a JSON Boolean [client extension output](#client-extension-output) result, set to `true` to signify that the extension was understood and processed. Likewise, any [authenticator extension](#authenticator-extension) that does not otherwise require any result values MUST return a value and SHOULD return a CBOR Boolean [authenticator extension output](#authenticator-extension-output) result, set to `true` to signify that the extension was understood and processed.

### 9.3. Extending Request Parameters[](#sctn-extension-request-parameters)

An extension defines one or two request arguments. The client extension input, which is a value that can be encoded in JSON, is passed from the [WebAuthn Relying Party](#webauthn-relying-party) to the client in the `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` or `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` call, while the [CBOR](#cbor) authenticator extension input is passed from the client to the authenticator for [authenticator extensions](#authenticator-extension) during the processing of these calls.

A [Relying Party](#relying-party) simultaneously requests the use of an extension and sets its [client extension input](#client-extension-input) by including an entry in the `[extensions](#dom-publickeycredentialcreationoptions-extensions)` option to the `[create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)` or `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` call. The entry key is the [extension identifier](#extension-identifier) and the value is the [client extension input](#client-extension-input).

Note: Other documents have specified extensions where the extension input does not always use the [extension identifier](#extension-identifier) as the entry key. New extensions SHOULD follow the above convention.

[](#example-5335c503)var assertionPromise = navigator.credentials.get({
    publicKey: {
        // Other members omitted for brevity
        extensions: {
            // An "entry key" identifying the "webauthnExample_foobar" extension, 
            // whose value is a map with two input parameters:
            "webauthnExample_foobar": {
              foo: 42,
              bar: "barfoo"
            }
        }
    }
});

Extension definitions MUST specify the valid values for their [client extension input](#client-extension-input). Clients SHOULD ignore extensions with an invalid [client extension input](#client-extension-input). If an extension does not require any parameters from the [Relying Party](#relying-party), it SHOULD be defined as taking a Boolean client argument, set to `true` to signify that the extension is requested by the [Relying Party](#relying-party).

Extensions that only affect client processing need not specify [authenticator extension input](#authenticator-extension-input). Extensions that have authenticator processing MUST specify the method of computing the [authenticator extension input](#authenticator-extension-input) from the [client extension input](#client-extension-input), and MUST define extensions for the [CDDL](#cddl) types `[AuthenticationExtensionsAuthenticatorInputs](#iface-authentication-extensions-authenticator-inputs)` and `[AuthenticationExtensionsAuthenticatorOutputs](#iface-authentication-extensions-authenticator-outputs)` by defining an additional choice for the `$$extensionInput` and `$$extensionOutput` [group sockets](https://tools.ietf.org/html/rfc8610#section-3.9) using the [extension identifier](#extension-identifier) as the entry key. Extensions that do not require input parameters, and are thus defined as taking a Boolean [client extension input](#client-extension-input) value set to `true`, SHOULD define the [authenticator extension input](#authenticator-extension-input) also as the constant Boolean value `true` (CBOR major type 7, value 21).

The following example defines that an extension with [identifier](#extension-identifier) `webauthnExample_foobar` takes an unsigned integer as [authenticator extension input](#authenticator-extension-input), and returns an array of at least one byte string as [authenticator extension output](#authenticator-extension-output):

[](#example-c42718c0)$$extensionInput //= (
  webauthnExample_foobar: uint
)
$$extensionOutput //= (
  webauthnExample_foobar: [+ bytes]
)

Note: Extensions should aim to define authenticator arguments that are as small as possible. Some authenticators communicate over low-bandwidth links such as Bluetooth Low-Energy or NFC.

### 9.4. Client Extension Processing[](#sctn-client-extension-processing)

Extensions MAY define additional processing requirements on the [client](#client) during the creation of credentials or the generation of an assertion. The [client extension input](#client-extension-input) for the extension is used as an input to this client processing. For each supported [client extension](#client-extension), the client adds an entry to the clientExtensions [map](https://infra.spec.whatwg.org/#ordered-map) with the [extension identifier](#extension-identifier) as the key, and the extension’s [client extension input](#client-extension-input) as the value.

Likewise, the [client extension outputs](#client-extension-output) are represented as a dictionary in the result of `[getClientExtensionResults()](#dom-publickeycredential-getclientextensionresults)` with [extension identifiers](#extension-identifier) as keys, and the client extension output value of each extension as the value. Like the [client extension input](#client-extension-input), the [client extension output](#client-extension-output) is a value that can be encoded in JSON. There MUST NOT be any values returned for ignored extensions.

Extensions that require authenticator processing MUST define the process by which the [client extension input](#client-extension-input) can be used to determine the [CBOR](#cbor) [authenticator extension input](#authenticator-extension-input) and the process by which the [CBOR](#cbor) [authenticator extension output](#authenticator-extension-output) can be used to determine the [client extension output](#client-extension-output).

### 9.5. Authenticator Extension Processing[](#sctn-authenticator-extension-processing)

The [CBOR](#cbor) [authenticator extension input](#authenticator-extension-input) value of each processed [authenticator extension](#authenticator-extension) is included in the extensions parameter of the [authenticatorMakeCredential](#authenticatormakecredential) and [authenticatorGetAssertion](#authenticatorgetassertion) operations. The extensions parameter is a [CBOR](#cbor) map where each key is an [extension identifier](#extension-identifier) and the corresponding value is the [authenticator extension input](#authenticator-extension-input) for that extension.

Likewise, the extension output is represented in the [extensions](#authdataextensions) part of the [authenticator data](#authenticator-data). The [extensions](#authdataextensions) part of the [authenticator data](#authenticator-data) is a CBOR map where each key is an [extension identifier](#extension-identifier) and the corresponding value is the authenticator extension output for that extension.

For each supported extension, the [authenticator extension processing](#authenticator-extension-processing) rule for that extension is used create the [authenticator extension output](#authenticator-extension-output) from the [authenticator extension input](#authenticator-extension-input) and possibly also other inputs. There MUST NOT be any values returned for ignored extensions.

## 10. Defined Extensions[](#sctn-defined-extensions)

This section defines an additional set of extensions to be registered in the IANA "WebAuthn Extension Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809). These MAY be implemented by user agents targeting broad interoperability.

### 10.1. FIDO AppID Extension (appid)[](#sctn-appid-extension)

This extension allows [WebAuthn Relying Parties](#webauthn-relying-party) that have previously registered a credential using the legacy FIDO U2F JavaScript API [[FIDOU2FJavaScriptAPI]](#biblio-fidou2fjavascriptapi) to request an [assertion](#assertion). The FIDO APIs use an alternative identifier for [Relying Parties](#relying-party) called an AppID [[FIDO-APPID]](#biblio-fido-appid), and any credentials created using those APIs will be [scoped](#scope) to that identifier. Without this extension, they would need to be re-registered in order to be [scoped](#scope) to an [RP ID](#rp-id).

In addition to setting the `[appid](#dom-authenticationextensionsclientinputs-appid)` extension input, using this extension requires some additional processing by the [Relying Party](#relying-party) in order to allow users to [authenticate](#authentication) using their registered U2F credentials:

1. List the desired U2F credentials in the `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` option of the `[get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` method:
    
    - Set the `[type](#dom-publickeycredentialdescriptor-type)` members to `[public-key](#dom-publickeycredentialtype-public-key)`.
        
    - Set the `[id](#dom-publickeycredentialdescriptor-id)` members to the respective U2F key handles of the desired credentials. Note that U2F key handles commonly use [base64url encoding](#base64url-encoding) but must be decoded to their binary form when used in `[id](#dom-publickeycredentialdescriptor-id)`.
        
    
    `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` MAY contain a mixture of both WebAuthn [credential IDs](#credential-id) and U2F key handles; stating the `[appid](#dom-authenticationextensionsclientinputs-appid)` via this extension does not prevent the user from using a WebAuthn-registered credential scoped to the [RP ID](#rp-id) stated in `[rpId](#dom-publickeycredentialrequestoptions-rpid)`.
    
2. When [verifying the assertion](#rp-op-verifying-assertion-step-rpid-hash), expect that the `[rpIdHash](#rpidhash)` MAY be the hash of the AppID instead of the [RP ID](#rp-id).
    

This extension does not allow FIDO-compatible credentials to be created. Thus, credentials created with WebAuthn are not backwards compatible with the FIDO JavaScript APIs.

Note: `[appid](#dom-authenticationextensionsclientinputs-appid)` should be set to the AppID that the [Relying Party](#relying-party) _previously_ used in the legacy FIDO APIs. This might not be the same as the result of translating the [Relying Party](#relying-party)'s WebAuthn [RP ID](#rp-id) to the AppID format, e.g., the previously used AppID may have been "https://accounts.example.com" but the currently used [RP ID](#rp-id) might be "example.com".

Extension identifier

`appid`

Operation applicability

[Authentication](#authentication-extension)

Client extension input

A single USVString specifying a FIDO AppID.

partial dictionary [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs) {
  [USVString](https://heycam.github.io/webidl/#idl-USVString) `appid`;
};

Client extension processing

1. Let facetId be the result of passing the caller’s [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) to the FIDO algorithm for [determining the FacetID of a calling application](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-the-facetid-of-a-calling-application).
    
2. Let appId be the extension input.
    
3. Pass facetId and appId to the FIDO algorithm for [determining if a caller’s FacetID is authorized for an AppID](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-if-a-caller-s-facetid-is-authorized-for-an-appid). If that algorithm rejects appId then return a "`[SecurityError](https://heycam.github.io/webidl/#securityerror)`" `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)`.
    
4. When [building allowCredentialDescriptorList](#allowCredentialDescriptorListCreation), if a U2F authenticator indicates that a credential is inapplicable (i.e. by returning `SW_WRONG_DATA`) then the client MUST retry with the U2F application parameter set to the SHA-256 hash of appId. If this results in an applicable credential, the client MUST include the credential in allowCredentialDescriptorList. The value of appId then replaces the `rpId` parameter of [authenticatorGetAssertion](#authenticatorgetassertion).
    
5. Let output be the Boolean value `false`.
    
6. When [creating assertionCreationData](#assertionCreationDataCreation), if the [assertion](#assertion) was created by a U2F authenticator with the U2F application parameter set to the SHA-256 hash of appId instead of the SHA-256 hash of the [RP ID](#rp-id), set output to `true`.
    

Note: In practice, several implementations do not implement steps four and onward of the algorithm for [determining if a caller’s FacetID is authorized for an AppID](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-if-a-caller-s-facetid-is-authorized-for-an-appid). Instead, in step three, the comparison on the host is relaxed to accept hosts on the [same site](https://url.spec.whatwg.org/#host-same-site).

Client extension output

Returns the value of output. If true, the AppID was used and thus, when [verifying the assertion](#rp-op-verifying-assertion-step-rpid-hash), the [Relying Party](#relying-party) MUST expect the `[rpIdHash](#rpidhash)` to be the hash of the AppID, not the [RP ID](#rp-id).

partial dictionary [AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs) {
  [boolean](https://heycam.github.io/webidl/#idl-boolean) `appid`[](#dom-authenticationextensionsclientoutputs-appid);
};

Authenticator extension input

None.

Authenticator extension processing

None.

Authenticator extension output

None.

### 10.2. FIDO AppID Exclusion Extension (appidExclude)[](#sctn-appid-exclude-extension)

This registration extension allows [WebAuthn Relying Parties](#webauthn-relying-party) to exclude authenticators that contain specified credentials that were created with the legacy FIDO U2F JavaScript API [[FIDOU2FJavaScriptAPI]](#biblio-fidou2fjavascriptapi).

During a transition from the FIDO U2F JavaScript API, a [Relying Party](#relying-party) may have a population of users with legacy credentials already registered. The [appid](#sctn-appid-extension) extension allows the sign-in flow to be transitioned smoothly but, when transitioning the registration flow, the [excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials) field will not be effective in excluding authenticators with legacy credentials because its contents are taken to be WebAuthn credentials. This extension directs [client platforms](#client-platform) to consider the contents of [excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials) as both WebAuthn and legacy FIDO credentials. Note that U2F key handles commonly use [base64url encoding](#base64url-encoding) but must be decoded to their binary form when used in [excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials).

Extension identifier

`appidExclude`

Operation applicability

[Registration](#registration-extension)

Client extension input

A single USVString specifying a FIDO AppID.

partial dictionary [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs) {
  [USVString](https://heycam.github.io/webidl/#idl-USVString) `appidExclude`;
};

Client extension processing

When [creating a new credential](#sctn-createCredential):

1. Just after [establishing the RP ID](#CreateCred-DetermineRpId) perform these steps:
    
    1. Let facetId be the result of passing the caller’s [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) to the FIDO algorithm for [determining the FacetID of a calling application](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-the-facetid-of-a-calling-application).
        
    2. Let appId be the value of the extension input `[appidExclude](#dom-authenticationextensionsclientinputs-appidexclude)`.
        
    3. Pass facetId and appId to the FIDO algorithm for [determining if a caller’s FacetID is authorized for an AppID](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-if-a-caller-s-facetid-is-authorized-for-an-appid). If the latter algorithm rejects appId then return a "`[SecurityError](https://heycam.github.io/webidl/#securityerror)`" `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` and terminate the [creating a new credential](#sctn-createCredential) algorithm as well as these steps.
        
        Note: In practice, several implementations do not implement steps four and onward of the algorithm for [determining if a caller’s FacetID is authorized for an AppID](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-appid-and-facets-v2.0-id-20180227.html#determining-if-a-caller-s-facetid-is-authorized-for-an-appid). Instead, in step three, the comparison on the host is relaxed to accept hosts on the [same site](https://url.spec.whatwg.org/#host-same-site).
        
    4. Otherwise, continue with normal processing.
        
2. Just prior to [invoking authenticatorMakeCredential](#CreateCred-InvokeAuthnrMakeCred) perform these steps:
    
    1. If authenticator supports the U2F protocol [[FIDO-U2F-Message-Formats]](#biblio-fido-u2f-message-formats), then [for each](https://infra.spec.whatwg.org/#list-iterate) [credential descriptor](#dictdef-publickeycredentialdescriptor) C in excludeCredentialDescriptorList:
        
        1. Check whether C was created using U2F on authenticator by sending a `U2F_AUTHENTICATE` message to authenticator whose "five parts" are set to the following values:
            
            control byte
            
            `0x07` ("check-only")
            
            challenge parameter
            
            32 random bytes
            
            application parameter
            
            SHA-256 hash of appId
            
            key handle length
            
            The length of `` C.`[id](#dom-publickeycredentialdescriptor-id)` `` (in bytes)
            
            key handle
            
            The value of `` C.`[id](#dom-publickeycredentialdescriptor-id)` ``, i.e., the [credential id](#credential-id).
            
        2. If authenticator responds with `message:error:test-of-user-presence-required` (i.e., success): cease normal processing of this authenticator and indicate in a platform-specific manner that the authenticator is inapplicable. For example, this could be in the form of UI, or could involve requesting [user consent](#user-consent) from authenticator and, upon receipt, treating it as if the authenticator had returned `[InvalidStateError](https://heycam.github.io/webidl/#invalidstateerror)`. Requesting [user consent](#user-consent) can be accomplished by sending another `U2F_AUTHENTICATE` message to authenticator as above except for setting control byte to `0x03` ("enforce-user-presence-and-sign"), and ignoring the response.
            
    2. Continue with normal processing.
        

Client extension output

Returns the value `true` to indicate to the [Relying Party](#relying-party) that the extension was acted upon.

partial dictionary [AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs) {
  [boolean](https://heycam.github.io/webidl/#idl-boolean) `appidExclude`[](#dom-authenticationextensionsclientoutputs-appidexclude);
};

Authenticator extension input

None.

Authenticator extension processing

None.

Authenticator extension output

None.

### 10.3. User Verification Method Extension (uvm)[](#sctn-uvm-extension)

This extension enables use of a user verification method.

Extension identifier

`uvm`

Operation applicability

[Registration](#registration-extension) and [Authentication](#authentication-extension)

Client extension input

The Boolean value `true` to indicate that this extension is requested by the [Relying Party](#relying-party).

partial dictionary [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs) {
  [boolean](https://heycam.github.io/webidl/#idl-boolean) `uvm`[](#dom-authenticationextensionsclientinputs-uvm);
};

Client extension processing

None, except creating the authenticator extension input from the client extension input.

Client extension output

Returns a JSON array of 3-element arrays of numbers that encodes the factors in the authenticator extension output.

typedef [sequence](https://heycam.github.io/webidl/#idl-sequence)<[unsigned long](https://heycam.github.io/webidl/#idl-unsigned-long)> `UvmEntry`;
typedef [sequence](https://heycam.github.io/webidl/#idl-sequence)<[UvmEntry](#typedefdef-uvmentry)> `UvmEntries`;

partial dictionary [AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs) {
  [UvmEntries](#typedefdef-uvmentries) `uvm`[](#dom-authenticationextensionsclientoutputs-uvm);
};

Authenticator extension input

The Boolean value `true`, encoded in CBOR (major type 7, value 21).

    $$extensionInput //= (
      uvm: true,
    )

Authenticator extension processing

The [authenticator](#authenticator) sets the [authenticator extension output](#authenticator-extension-output) to be one or more user verification methods indicating the method(s) used by the user to authorize the operation, as defined below. This extension can be added to attestation objects and assertions.

Authenticator extension output

Authenticators can report up to 3 different user verification methods (factors) used in a single authentication instance, using the CBOR syntax defined below:

    $$extensionOutput //= (
      uvm: [ 1*3 uvmEntry ],
    )

    uvmEntry = [
                   userVerificationMethod: uint .size 4,
                   keyProtectionType: uint .size 2,
                   matcherProtectionType: uint .size 2
               ]

The semantics of the fields in each `uvmEntry` are as follows:

userVerificationMethod

The authentication method/factor used by the authenticator to verify the user. Available values are defined in [Section 3.1 User Verification Methods](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-registry-v2.0-id-20180227.html#user-verification-methods) of [[FIDO-Registry]](#biblio-fido-registry).

keyProtectionType

The method used by the authenticator to protect the FIDO registration private key material. Available values are defined in [Section 3.2 Key Protection Types](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-registry-v2.0-id-20180227.html#key-protection-types) of [[FIDO-Registry]](#biblio-fido-registry).

matcherProtectionType

The method used by the authenticator to protect the matcher that performs user verification. Available values are defined in [Section 3.3 Matcher Protection Types](https://fidoalliance.org/specs/fido-v2.0-id-20180227/fido-registry-v2.0-id-20180227.html#matcher-protection-types) of [[FIDO-Registry]](#biblio-fido-registry).

If >3 factors can be used in an authentication instance the authenticator vendor MUST select the 3 factors it believes will be most relevant to the Server to include in the UVM.

Example for [authenticator data](#authenticator-data) containing one UVM extension for a multi-factor authentication instance where 2 factors were used:

...                    -- RP ID hash (32 bytes)
81                     -- UP and ED set
00 00 00 01            -- (initial) signature counter
...                    -- all public key alg etc.
A1                     -- extension: CBOR map of one element
    63                 -- Key 1: CBOR text string of 3 bytes
        75 76 6d       -- "uvm" [=UTF-8 encoded=] string
    82                 -- Value 1: CBOR array of length 2 indicating two factor usage
        83              -- Item 1: CBOR array of length 3
            02           -- Subitem 1: CBOR integer for User Verification Method Fingerprint
            04           -- Subitem 2: CBOR short for Key Protection Type TEE
            02           -- Subitem 3: CBOR short for Matcher Protection Type TEE
        83              -- Item 2: CBOR array of length 3
            04           -- Subitem 1: CBOR integer for User Verification Method Passcode
            01           -- Subitem 2: CBOR short for Key Protection Type Software
            01           -- Subitem 3: CBOR short for Matcher Protection Type Software

### 10.4. Credential Properties Extension (credProps)[](#sctn-authenticator-credential-properties-extension)

This [client](#client-extension) [registration extension](#registration-extension) facilitates reporting certain [credential properties](#credential-properties) known by the [client](#client) to the requesting [WebAuthn Relying Party](#webauthn-relying-party) upon creation of a [public key credential source](#public-key-credential-source) as a result of a [registration ceremony](#registration-ceremony).

At this time, one [credential property](#credential-properties) is defined: the [resident key credential property](#credentialpropertiesoutput-resident-key-credential-property) (i.e., [client-side discoverable credential property](#credentialpropertiesoutput-client-side-discoverable-credential-property)).

Extension identifier

`credProps`

Operation applicability

[Registration](#registration-extension)

Client extension input

The Boolean value `true` to indicate that this extension is requested by the [Relying Party](#relying-party).

partial dictionary [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs) {
    [boolean](https://heycam.github.io/webidl/#idl-boolean) `credProps`[](#dom-authenticationextensionsclientinputs-credprops);
};

Client extension processing

None, other than to report on credential properties in the output.

Client extension output

[Set](https://infra.spec.whatwg.org/#map-set) ``[clientExtensionResults](#credentialcreationdata-clientextensionresults)["`[credProps](#dom-authenticationextensionsclientoutputs-credprops)`"]["rk"]`` to the value of the requireResidentKey parameter that was used in the [invocation](#CreateCred-InvokeAuthnrMakeCred) of the [authenticatorMakeCredential](#authenticatormakecredential) operation.

dictionary `CredentialPropertiesOutput` {
    [boolean](https://heycam.github.io/webidl/#idl-boolean) [rk](#dom-credentialpropertiesoutput-rk);
};

partial dictionary [AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs) {
    [CredentialPropertiesOutput](#dictdef-credentialpropertiesoutput) `credProps`;
};

`rk`, of type [boolean](https://heycam.github.io/webidl/#idl-boolean)

This OPTIONAL property, known abstractly as the resident key credential property (i.e., client-side discoverable credential property), is a Boolean value indicating whether the `[PublicKeyCredential](#publickeycredential)` returned as a result of a [registration ceremony](#registration-ceremony) is a [client-side discoverable credential](#client-side-discoverable-credential). If `[rk](#dom-credentialpropertiesoutput-rk)` is `true`, the credential is a [discoverable credential](#discoverable-credential). if `[rk](#dom-credentialpropertiesoutput-rk)` is `false`, the credential is a [server-side credential](#server-side-credential). If `[rk](#dom-credentialpropertiesoutput-rk)` is not present, it is not known whether the credential is a [discoverable credential](#discoverable-credential) or a [server-side credential](#server-side-credential).

Note: some [authenticators](#authenticator) create [discoverable credentials](#discoverable-credential) even when not requested by the [client platform](#client-platform). Because of this, [client platforms](#client-platform) may be forced to omit the `[rk](#dom-credentialpropertiesoutput-rk)` property because they lack the assurance to be able to set it to `false`. [Relying Parties](#relying-party) should assume that, if the `credProps` extension is supported, then [client platforms](#client-platform) will endeavour to populate the `[rk](#dom-credentialpropertiesoutput-rk)` property. Therefore a missing `[rk](#dom-credentialpropertiesoutput-rk)` indicates that the created credential is most likely a [non-discoverable credential](#non-discoverable-credential).

Authenticator extension input

None.

Authenticator extension processing

None.

Authenticator extension output

None.

### 10.5. Large blob storage extension (largeBlob)[](#sctn-large-blob-extension)

This [client](#client-extension) [registration extension](#registration-extension) and [authentication extension](#authentication-extension) allows a [Relying Party](#relying-party) to store opaque data associated with a credential. Since [authenticators](#authenticator) can only store small amounts of data, and most [Relying Parties](#relying-party) are online services that can store arbitrary amounts of state for a user, this is only useful in specific cases. For example, the [Relying Party](#relying-party) might wish to issue certificates rather than run a centralised authentication service.

Note: [Relying Parties](#relying-party) can assume that the opaque data will be compressed when being written to a space-limited device and so need not compress it themselves.

Since a certificate system needs to sign over the public key of the credential, and that public key is only available after creation, this extension does not add an ability to write blobs in the [registration](#registration-extension) context. However, [Relying Parties](#relying-party) SHOULD use the [registration extension](#registration-extension) when creating the credential if they wish to later use the [authentication extension](#authentication-extension).

Since certificates are sizable relative to the storage capabilities of typical authenticators, user agents SHOULD consider what indications and confirmations are suitable to best guide the user in allocating this limited resource and prevent abuse.

Note: In order to interoperate, user agents storing large blobs on authenticators using [[FIDO-CTAP]](#biblio-fido-ctap) are expected to use the provisions detailed in that specification for storing [large, per-credential blobs](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#large-blob).

Extension identifier

`largeBlob`

Operation applicability

[Registration](#registration-extension) and [authentication](#authentication-extension)

Client extension input

partial dictionary [AuthenticationExtensionsClientInputs](#dictdef-authenticationextensionsclientinputs) {
    [AuthenticationExtensionsLargeBlobInputs](#dictdef-authenticationextensionslargeblobinputs) `largeBlob`[](#dom-authenticationextensionsclientinputs-largeblob);
};

enum `LargeBlobSupport` {
  `"required"`,
  `"preferred"`,
};

dictionary `AuthenticationExtensionsLargeBlobInputs` {
    [DOMString](https://heycam.github.io/webidl/#idl-DOMString) [support](#dom-authenticationextensionslargeblobinputs-support);
    [boolean](https://heycam.github.io/webidl/#idl-boolean) [read](#dom-authenticationextensionslargeblobinputs-read);
    [BufferSource](https://heycam.github.io/webidl/#BufferSource) [write](#dom-authenticationextensionslargeblobinputs-write);
};

`support`, of type [DOMString](https://heycam.github.io/webidl/#idl-DOMString)

A DOMString that takes one of the values of `[LargeBlobSupport](#enumdef-largeblobsupport)`. (See [§ 2.1.1 Enumerations as DOMString types](#sct-domstring-backwards-compatibility).) Only valid during [registration](#registration-extension).

`read`, of type [boolean](https://heycam.github.io/webidl/#idl-boolean)

A boolean that indicates that the [Relying Party](#relying-party) would like to fetch the previously-written blob associated with the asserted credential. Only valid during [authentication](#authentication-extension).

`write`, of type [BufferSource](https://heycam.github.io/webidl/#BufferSource)

An opaque byte string that the [Relying Party](#relying-party) wishes to store with the existing credential. Only valid during [authentication](#authentication-extension).

Client extension processing ([registration](#registration-extension))

1. If `[read](#dom-authenticationextensionslargeblobinputs-read)` or `[write](#dom-authenticationextensionslargeblobinputs-write)` is present:
    
    1. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is “`[NotSupportedError](https://heycam.github.io/webidl/#notsupportederror)`”.
        
2. If `[support](#dom-authenticationextensionslargeblobinputs-support)` is present and has the value `[required](#dom-largeblobsupport-required)`:
    
    1. Set `[supported](#dom-authenticationextensionslargebloboutputs-supported)` to `true`.
        
        Note: This is in anticipation of an authenticator capable of storing large blobs becoming available. It occurs during extension processing in Step 11 of `[[[Create]]()](#dom-publickeycredential-create-slot)`. The `[AuthenticationExtensionsLargeBlobOutputs](#dictdef-authenticationextensionslargebloboutputs)` will be abandoned if no satisfactory authenticator becomes available.
        
    2. If a [candidate authenticator](#create-candidate-authenticator) becomes available (Step 19 of `[[[Create]]()](#dom-publickeycredential-create-slot)`) then, before evaluating any `options`, [continue](https://infra.spec.whatwg.org/#iteration-continue) (i.e. ignore the [candidate authenticator](#create-candidate-authenticator)) if the [candidate authenticator](#create-candidate-authenticator) is not capable of storing large blobs.
        
3. Otherwise (i.e. `[support](#dom-authenticationextensionslargeblobinputs-support)` is absent or has the value `[preferred](#dom-largeblobsupport-preferred)`):
    
    1. If an [authenticator is selected](#create-selected-authenticator) and the [selected authenticator](#create-selected-authenticator) supports large blobs, set `[supported](#dom-authenticationextensionslargebloboutputs-supported)` to `true`, and `false` otherwise.
        

Client extension processing ([authentication](#authentication-extension))

1. If `[support](#dom-authenticationextensionslargeblobinputs-support)` is present:
    
    1. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is “`[NotSupportedError](https://heycam.github.io/webidl/#notsupportederror)`”.
        
2. If both `[read](#dom-authenticationextensionslargeblobinputs-read)` and `[write](#dom-authenticationextensionslargeblobinputs-write)` are present:
    
    1. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is “`[NotSupportedError](https://heycam.github.io/webidl/#notsupportederror)`”.
        
3. If `[read](#dom-authenticationextensionslargeblobinputs-read)` is present and has the value `true`:
    
    1. Initialize the [client extension output](#client-extension-output), `[largeBlob](#dom-authenticationextensionsclientoutputs-largeblob)`.
        
    2. If any authenticator indicates success (in `[[[DiscoverFromExternalSource]]()](#dom-publickeycredential-discoverfromexternalsource-slot)`), attempt to read any largeBlob data associated with the asserted credential.
        
    3. If successful, set `[blob](#dom-authenticationextensionslargebloboutputs-blob)` to the result.
        
        Note: if the read is not successful, `[largeBlob](#dom-authenticationextensionsclientoutputs-largeblob)` will be present in `[AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs)` but the `[blob](#dom-authenticationextensionslargebloboutputs-blob)` member will not be present.
        
4. If `[write](#dom-authenticationextensionslargeblobinputs-write)` is present:
    
    1. If `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` does not contain exactly one element:
        
        1. Return a `[DOMException](https://heycam.github.io/webidl/#idl-DOMException)` whose name is “`[NotSupportedError](https://heycam.github.io/webidl/#notsupportederror)`”.
            
    2. If the [assertion](#sctn-getAssertion) operation is successful, attempt to store the contents of `[write](#dom-authenticationextensionslargeblobinputs-write)` on the [authenticator](#authenticator), associated with the indicated credential.
        
    3. Set `[written](#dom-authenticationextensionslargebloboutputs-written)` to `true` if successful and `false` otherwise.
        

Client extension output

partial dictionary [AuthenticationExtensionsClientOutputs](#dictdef-authenticationextensionsclientoutputs) {
    [AuthenticationExtensionsLargeBlobOutputs](#dictdef-authenticationextensionslargebloboutputs) `largeBlob`;
};

dictionary `AuthenticationExtensionsLargeBlobOutputs` {
    [boolean](https://heycam.github.io/webidl/#idl-boolean) [supported](#dom-authenticationextensionslargebloboutputs-supported);
    [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer) [blob](#dom-authenticationextensionslargebloboutputs-blob);
    [boolean](https://heycam.github.io/webidl/#idl-boolean) [written](#dom-authenticationextensionslargebloboutputs-written);
};

`supported`, of type [boolean](https://heycam.github.io/webidl/#idl-boolean)

`true` if, and only if, the created credential supports storing large blobs. Only present in [registration](#registration-extension) outputs.

`blob`, of type [ArrayBuffer](https://heycam.github.io/webidl/#idl-ArrayBuffer)

The opaque byte string that was associated with the credential identified by `[rawId](#dom-publickeycredential-rawid)`. Only valid if `[read](#dom-authenticationextensionslargeblobinputs-read)` was `true`.

`written`, of type [boolean](https://heycam.github.io/webidl/#idl-boolean)

A boolean that indicates that the contents of `[write](#dom-authenticationextensionslargeblobinputs-write)` were successfully stored on the [authenticator](#authenticator), associated with the specified credential.

Authenticator extension processing

[This extension](#largeblob) directs the user-agent to cause the large blob to be stored on, or retrieved from, the authenticator. It thus does not specify any direct authenticator interaction for [Relying Parties](#relying-party).

## 11. User Agent Automation[](#sctn-automation)

For the purposes of user agent automation and [web application](#web-application) testing, this document defines a number of [[WebDriver]](#biblio-webdriver) [extension commands](https://w3c.github.io/webdriver/#dfn-extension-command).

### 11.1. WebAuthn WebDriver Extension Capability[](#sctn-automation-webdriver-capability)

In order to advertise the availability of the [extension commands](https://w3c.github.io/webdriver/#dfn-extension-command) defined below, a new [extension capability](https://w3c.github.io/webdriver/#dfn-extension-capability) is defined.

|Capability|Key|Value Type|Description|
|---|---|---|---|
|Virtual Authenticators Support|`"webauthn:virtualAuthenticators"`|boolean|Indicates whether the [endpoint node](https://w3c.github.io/webdriver/#dfn-endpoint-node) supports all [Virtual Authenticators](#virtual-authenticators) commands.|

When [validating capabilities](https://w3c.github.io/webdriver/#dfn-validate-capabilities), the extension-specific substeps to validate `"webauthn:virtualAuthenticators"` with `value` are the following:

1. If `value` is not a [boolean](https://infra.spec.whatwg.org/#boolean) return a [WebDriver Error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
2. Otherwise, let `deserialized` be set to `value`.
    

When [matching capabilities](https://w3c.github.io/webdriver/#dfn-matching-capabilities), the extension-specific steps to match `"webauthn:virtualAuthenticators"` with `value` are the following:

1. If `value` is `true` and the [endpoint node](https://w3c.github.io/webdriver/#dfn-endpoint-node) does not support any of the [Virtual Authenticators](#virtual-authenticators) commands, the match is unsuccessful.
    
2. Otherwise, the match is successful.
    

#### 11.1.1. Authenticator Extension Capabilities[](#sctn-authenticator-extension-capabilities)

Additionally, [extension capabilities](https://w3c.github.io/webdriver/#dfn-extension-capability) are defined for every [authenticator extension](#authenticator-extension) (i.e. those defining [authenticator extension processing](#authenticator-extension-processing)) defined in this specification:

|Capability|Key|Value Type|Description|
|---|---|---|---|
|User Verification Method Extension Support|`"webauthn:extension:uvm"`|boolean|Indicates whether the [endpoint node](https://w3c.github.io/webdriver/#dfn-endpoint-node) WebAuthn WebDriver implementation supports the [User Verification Method](#user-verification-method) extension.|
|Large Blob Storage Extension Support|`"webauthn:extension:largeBlob"`|boolean|Indicates whether the [endpoint node](https://w3c.github.io/webdriver/#dfn-endpoint-node) WebAuthn WebDriver implementation supports the [largeBlob](#largeblob) extension.|

When [validating capabilities](https://w3c.github.io/webdriver/#dfn-validate-capabilities), the extension-specific substeps to validate an [authenticator extension capability](#authenticator-extension-capabilities) `key` with `value` are the following:

1. If `value` is not a [boolean](https://infra.spec.whatwg.org/#boolean) return a [WebDriver Error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
2. Otherwise, let `deserialized` be set to `value`.
    

When [matching capabilities](https://w3c.github.io/webdriver/#dfn-matching-capabilities), the extension-specific steps to match an [authenticator extension capability](#authenticator-extension-capabilities) `key` with `value` are the following:

1. If `value` is `true` and the [endpoint node](https://w3c.github.io/webdriver/#dfn-endpoint-node) WebAuthn WebDriver implementation does not support the [authenticator extension](#authenticator-extension) identified by the `key`, the match is unsuccessful.
    
2. Otherwise, the match is successful.
    

User-Agents implementing defined [authenticator extensions](#authenticator-extension) SHOULD implement the corresponding [authenticator extension capability](#authenticator-extension-capabilities).

### 11.2. Virtual Authenticators[](#sctn-automation-virtual-authenticators)

These WebDriver [extension commands](https://w3c.github.io/webdriver/#dfn-extension-command) create and interact with [Virtual Authenticators](#virtual-authenticators): software implementations of the [Authenticator Model](#authenticator-model). [Virtual Authenticators](#virtual-authenticators) are stored in a Virtual Authenticator Database. Each stored [virtual authenticator](#virtual-authenticators) has the following properties:

authenticatorId

An non-null string made using up to 48 characters from the `unreserved` production defined in Appendix A of [[RFC3986]](#biblio-rfc3986) that uniquely identifies the [Virtual Authenticator](#virtual-authenticators).

protocol

The protocol the [Virtual Authenticator](#virtual-authenticators) speaks: one of `"ctap1/u2f"`, `"ctap2"` or `"ctap2_1"` [[FIDO-CTAP]](#biblio-fido-ctap).

transport

The `[AuthenticatorTransport](#enumdef-authenticatortransport)` simulated. If the transport is set to `[internal](#dom-authenticatortransport-internal)`, the authenticator simulates [platform attachment](#platform-attachment). Otherwise, it simulates [cross-platform attachment](#cross-platform-attachment).

hasResidentKey

If set to `true` the authenticator will support [client-side discoverable credentials](#client-side-discoverable-credential).

hasUserVerification

If set to `true`, the authenticator supports [user verification](#user-verification).

isUserConsenting

Determines the result of all [user consent](#user-consent) [authorization gestures](#authorization-gesture), and by extension, any [test of user presence](#test-of-user-presence) performed on the [Virtual Authenticator](#virtual-authenticators). If set to `true`, a [user consent](#user-consent) will always be granted. If set to `false`, it will not be granted.

isUserVerified

Determines the result of [User Verification](#user-verification) performed on the [Virtual Authenticator](#virtual-authenticators). If set to `true`, [User Verification](#user-verification) will always succeed. If set to `false`, it will fail.

Note: This property has no effect if hasUserVerification is set to `false`.

extensions

A string array containing the [extension identifiers](#extension-identifier) supported by the [Virtual Authenticator](#virtual-authenticators).

A [Virtual authenticator](#virtual-authenticators) MUST support all [authenticator extensions](#authenticator-extension) present in its extensions array. It MUST NOT support any [authenticator extension](#authenticator-extension) not present in its extensions array.

uvm

A `[UvmEntries](#typedefdef-uvmentries)` array to be set as the [authenticator extension output](#authenticator-extension-output) when processing the [User Verification Method](#user-verification-method) extension.

Note: This property has no effect if the [Virtual Authenticator](#virtual-authenticators) does not support the [User Verification Method](#user-verification-method) extension.

### 11.3. Add Virtual Authenticator[](#sctn-automation-add-virtual-authenticator)

The [Add Virtual Authenticator](#add-virtual-authenticator) WebDriver [extension command](https://w3c.github.io/webdriver/#dfn-extension-command) creates a software [Virtual Authenticator](#virtual-authenticators). It is defined as follows:

|HTTP Method|URI Template|
|---|---|
|POST|`/session/{session id}/webauthn/authenticator`|

The Authenticator Configuration is a JSON [Object](https://w3c.github.io/FileAPI/#blob-url-entry-object) passed to the [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) as parameters. It contains the following key and value pairs:

|Key|Value Type|Valid Values|Default|
|---|---|---|---|
|protocol|string|`"ctap1/u2f"`, `"ctap2"`, `"ctap2_1"`|None|
|transport|string|`[AuthenticatorTransport](#enumdef-authenticatortransport)` values|None|
|hasResidentKey|boolean|`true`, `false`|`false`|
|hasUserVerification|boolean|`true`, `false`|`false`|
|isUserConsenting|boolean|`true`, `false`|`true`|
|isUserVerified|boolean|`true`, `false`|`false`|
|extensions|string array|An array containing [extension identifiers](#extension-identifier)|Empty array|
|uvm|`[UvmEntries](#typedefdef-uvmentries)`|Up to 3 [User Verification Method](#user-verification-method) entries|Empty array|

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If parameters is not a JSON [Object](https://w3c.github.io/FileAPI/#blob-url-entry-object), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
    Note: parameters is a [Authenticator Configuration](#authenticator-configuration) object.
    
2. Let authenticator be a new [Virtual Authenticator](#virtual-authenticators).
    
3. For each enumerable [own property](https://tc39.github.io/ecma262/#sec-own-property) in parameters:
    
    1. Let key be the name of the property.
        
    2. Let value be the result of [getting a property](https://w3c.github.io/webdriver/#dfn-getting-properties) named key from parameters.
        
    3. If there is no matching `key` for key in parameters, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
        
    4. If value is not one of the `valid values` for that key, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
        
    5. [Set a property](https://w3c.github.io/webdriver/#dfn-set-a-property) key to value on authenticator.
        
4. For each property in [Authenticator Configuration](#authenticator-configuration) with a default defined:
    
    1. If `key` is not a defined property of authenticator, [set a property](https://w3c.github.io/webdriver/#dfn-set-a-property) `key` to `default` on authenticator.
        
5. For each property in [Authenticator Configuration](#authenticator-configuration):
    
    1. If `key` is not a defined property of authenticator, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
        
6. For each extension in authenticator.extensions:
    
    1. If extension is not an [extension identifier](#extension-identifier) supported by the [endpoint node](https://w3c.github.io/webdriver/#dfn-endpoint-node) WebAuthn WebDriver implementation, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [unsupported operation](https://w3c.github.io/webdriver/#dfn-unsupported-operation).
        
7. Generate a valid unique [authenticatorId](#authenticatorid).
    
8. [Set a property](https://w3c.github.io/webdriver/#dfn-set-a-property) `authenticatorId` to authenticatorId on authenticator.
    
9. Store authenticator in the [Virtual Authenticator Database](#virtual-authenticator-database).
    
10. Return [success](https://w3c.github.io/webdriver/#dfn-success) with data authenticatorId.
    

### 11.4. Remove Virtual Authenticator[](#sctn-automation-remove-virtual-authenticator)

The [Remove Virtual Authenticator](#remove-virtual-authenticator) WebDriver [extension command](https://w3c.github.io/webdriver/#dfn-extension-command) removes a previously created [Virtual Authenticator](#virtual-authenticators). It is defined as follows:

|HTTP Method|URI Template|
|---|---|
|DELETE|`/session/{session id}/webauthn/authenticator/{authenticatorId}`|

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If authenticatorId does not match any [Virtual Authenticator](#virtual-authenticators) stored in the [Virtual Authenticator Database](#virtual-authenticator-database), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
2. Remove the [Virtual Authenticator](#virtual-authenticators) identified by authenticatorId from the [Virtual Authenticator Database](#virtual-authenticator-database)
    
3. Return [success](https://w3c.github.io/webdriver/#dfn-success).
    

### 11.5. Add Credential[](#sctn-automation-add-credential)

The [Add Credential](#add-credential) WebDriver [extension command](https://w3c.github.io/webdriver/#dfn-extension-command) injects a [Public Key Credential Source](#public-key-credential-source) into an existing [Virtual Authenticator](#virtual-authenticators). It is defined as follows:

|HTTP Method|URI Template|
|---|---|
|POST|`/session/{session id}/webauthn/authenticator/{authenticatorId}/credential`|

The Credential Parameters is a JSON [Object](https://w3c.github.io/FileAPI/#blob-url-entry-object) passed to the [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) as parameters. It contains the following key and value pairs:

|Key|Description|Value Type|
|---|---|---|
|credentialId|The [Credential ID](#public-key-credential-source-id) encoded using [Base64url Encoding](#base64url-encoding).|string|
|isResidentCredential|If set to `true`, a [client-side discoverable credential](#client-side-discoverable-credential) is created. If set to `false`, a [server-side credential](#server-side-credential) is created instead.|boolean|
|rpId|The [Relying Party ID](#public-key-credential-source-rpid) the credential is scoped to.|string|
|privateKey|An asymmetric key package containing a single [private key](#public-key-credential-source-privatekey) per [[RFC5958]](#biblio-rfc5958), encoded using [Base64url Encoding](#base64url-encoding).|string|
|userHandle|The [userHandle](#public-key-credential-source-userhandle) associated to the credential encoded using [Base64url Encoding](#base64url-encoding). This property may not be defined.|string|
|signCount|The initial value for a [signature counter](#signature-counter) associated to the [public key credential source](#public-key-credential-source).|number|
|largeBlob|The [large, per-credential blob](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#large-blob) associated to the [public key credential source](#public-key-credential-source), encoded using [Base64url Encoding](#base64url-encoding). This property may not be defined.|string|

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If parameters is not a JSON [Object](https://w3c.github.io/FileAPI/#blob-url-entry-object), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
    Note: parameters is a [Credential Parameters](#credential-parameters) object.
    
2. Let credentialId be the result of decoding [Base64url Encoding](#base64url-encoding) on the parameters’ credentialId property.
    
3. If credentialId is failure, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
4. Let isResidentCredential be the parameters’ isResidentCredential property.
    
5. If isResidentCredential is not defined, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
6. Let rpId be the parameters’ rpId property.
    
7. If rpId is not a valid [RP ID](#rp-id), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
8. Let privateKey be the result of decoding [Base64url Encoding](#base64url-encoding) on the parameters’ privateKey property.
    
9. If privateKey is failure, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
10. If privateKey is not a validly-encoded asymmetric key package containing a single ECDSA private key on the P-256 curve per [[RFC5958]](#biblio-rfc5958), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
11. If the parameters’ userHandle property is defined:
    
    1. Let userHandle be the result of decoding [Base64url Encoding](#base64url-encoding) on the parameters’ userHandle property.
        
    2. If userHandle is failure, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
        
12. Otherwise:
    
    1. If isResidentCredential is `true`, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
        
    2. Let userHandle be `null`.
        
13. If authenticatorId does not match any [Virtual Authenticator](#virtual-authenticators) stored in the [Virtual Authenticator Database](#virtual-authenticator-database), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
14. Let authenticator be the [Virtual Authenticator](#virtual-authenticators) matched by authenticatorId.
    
15. If isResidentCredential is `true` and the authenticator’s hasResidentKey property is `false`, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
16. If the authenticator supports the [largeBlob](#largeblob) extension and the parameters’ largeBlob feature is defined:
    
    1. Let largeBlob be the result of decoding [Base64url Encoding](#base64url-encoding) on the parameters’ largeBlob property.
        
    2. If largeBlob is failure, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
        
17. Otherwise:
    
    1. Let largeBlob be `null`.
        
18. Let credential be a new [Client-side discoverable Public Key Credential Source](#client-side-discoverable-public-key-credential-source) if isResidentCredential is `true` or a [Server-side Public Key Credential Source](#server-side-public-key-credential-source) otherwise whose items are:
    
    [type](#public-key-credential-source-type)
    
    `[public-key](#dom-publickeycredentialtype-public-key)`
    
    [id](#public-key-credential-source-id)
    
    credentialId
    
    [privateKey](#public-key-credential-source-privatekey)
    
    privateKey
    
    [rpId](#public-key-credential-source-rpid)
    
    rpId
    
    [userHandle](#public-key-credential-source-userhandle)
    
    userHandle
    
19. Associate a [signature counter](#signature-counter) counter to the credential with a starting value equal to the parameters’ signCount or `0` if signCount is `null`.
    
20. If largeBlob is not `null`, set the [large, per-credential blob](https://fidoalliance.org/specs/fido-v2.0-ps-20190130/fido-client-to-authenticator-protocol-v2.0-ps-20190130.html#large-blob) associated to the credential to largeBlob.
    
21. Store the credential and counter in the database of the authenticator.
    
22. Return [success](https://w3c.github.io/webdriver/#dfn-success).
    

### 11.6. Get Credentials[](#sctn-automation-get-credentials)

The [Get Credentials](#get-credentials) WebDriver [extension command](https://w3c.github.io/webdriver/#dfn-extension-command) returns one [Credential Parameters](#credential-parameters) object for every [Public Key Credential Source](#public-key-credential-source) stored in a [Virtual Authenticator](#virtual-authenticators), regardless of whether they were stored using [Add Credential](#add-credential) or `[navigator.credentials.create()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-create)`. It is defined as follows:

|HTTP Method|URI Template|
|---|---|
|GET|`/session/{session id}/webauthn/authenticator/{authenticatorId}/credentials`|

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If authenticatorId does not match any [Virtual Authenticator](#virtual-authenticators) stored in the [Virtual Authenticator Database](#virtual-authenticator-database), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
2. Let credentialsArray be an empty array.
    
3. For each [Public Key Credential Source](#public-key-credential-source) credential, managed by the authenticator identified by authenticatorId, construct a corresponding [Credential Parameters](#credential-parameters) [Object](https://w3c.github.io/FileAPI/#blob-url-entry-object) and add it to credentialsArray.
    
4. Return [success](https://w3c.github.io/webdriver/#dfn-success) with data containing credentialsArray.
    

### 11.7. Remove Credential[](#sctn-automation-remove-credential)

The [Remove Credential](#remove-credential) WebDriver [extension command](https://w3c.github.io/webdriver/#dfn-extension-command) removes a [Public Key Credential Source](#public-key-credential-source) stored on a [Virtual Authenticator](#virtual-authenticators). It is defined as follows:

|HTTP Method|URI Template|
|---|---|
|DELETE|`/session/{session id}/webauthn/authenticator/{authenticatorId}/credentials/{credentialId}`|

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If authenticatorId does not match any [Virtual Authenticator](#virtual-authenticators) stored in the [Virtual Authenticator Database](#virtual-authenticator-database), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
2. Let authenticator be the [Virtual Authenticator](#virtual-authenticators) identified by authenticatorId.
    
3. If credentialId does not match any [Public Key Credential Source](#public-key-credential-source) managed by authenticator, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
4. Remove the [Public Key Credential Source](#public-key-credential-source) identified by credentialId managed by authenticator.
    
5. Return [success](https://w3c.github.io/webdriver/#dfn-success).
    

### 11.8. Remove All Credentials[](#sctn-automation-remove-all-credentials)

The [Remove All Credentials](#remove-all-credentials) WebDriver [extension command](https://w3c.github.io/webdriver/#dfn-extension-command) removes all [Public Key Credential Sources](#public-key-credential-source) stored on a [Virtual Authenticator](#virtual-authenticators). It is defined as follows:

|HTTP Method|URI Template|
|---|---|
|DELETE|`/session/{session id}/webauthn/authenticator/{authenticatorId}/credentials`|

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If authenticatorId does not match any [Virtual Authenticator](#virtual-authenticators) stored in the [Virtual Authenticator Database](#virtual-authenticator-database), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
2. Remove all [Public Key Credential Sources](#public-key-credential-source) managed by the [Virtual Authenticator](#virtual-authenticators) identified by authenticatorId.
    
3. Return [success](https://w3c.github.io/webdriver/#dfn-success).
    

### 11.9. Set User Verified[](#sctn-automation-set-user-verified)

The [Set User Verified](#set-user-verified) [extension command](https://w3c.github.io/webdriver/#dfn-extension-command) sets the isUserVerified property on the [Virtual Authenticator](#virtual-authenticators). It is defined as follows:

|HTTP Method|URI Template|
|---|---|
|POST|`/session/{session id}/webauthn/authenticator/{authenticatorId}/uv`|

The [remote end steps](https://w3c.github.io/webdriver/#dfn-remote-end-steps) are:

1. If parameters is not a JSON [Object](https://w3c.github.io/FileAPI/#blob-url-entry-object), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
2. If authenticatorId does not match any [Virtual Authenticator](#virtual-authenticators) stored in the [Virtual Authenticator Database](#virtual-authenticator-database), return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
3. If isUserVerified is not a defined property of parameters, return a [WebDriver error](https://w3c.github.io/webdriver/#dfn-error) with [WebDriver error code](https://w3c.github.io/webdriver/#dfn-error-code) [invalid argument](https://w3c.github.io/webdriver/#dfn-invalid-argument).
    
4. Let authenticator be the [Virtual Authenticator](#virtual-authenticators) identified by authenticatorId.
    
5. Set the authenticator’s isUserVerified property to the parameters’ isUserVerified property.
    
6. Return [success](https://w3c.github.io/webdriver/#dfn-success).
    

## 12. IANA Considerations[](#sctn-IANA)

### 12.1. WebAuthn Attestation Statement Format Identifier Registrations Updates[](#sctn-att-fmt-reg-update)

This section updates the below-listed attestation statement formats defined in Section [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats) in the IANA "WebAuthn Attestation Statement Format Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809), originally registered in [[WebAuthn-1]](#biblio-webauthn-1), to point to this specification.

- WebAuthn Attestation Statement Format Identifier: packed
    
- Description: The "packed" attestation statement format is a WebAuthn-optimized format for [attestation](#attestation). It uses a very compact but still extensible encoding method. This format is implementable by authenticators with limited resources (e.g., secure elements).
    
- Specification Document: Section [§ 8.2 Packed Attestation Statement Format](#sctn-packed-attestation) of this specification
    
- WebAuthn Attestation Statement Format Identifier: tpm
    
- Description: The TPM attestation statement format returns an attestation statement in the same format as the packed attestation statement format, although the rawData and signature fields are computed differently.
    
- Specification Document: Section [§ 8.3 TPM Attestation Statement Format](#sctn-tpm-attestation) of this specification
    
- WebAuthn Attestation Statement Format Identifier: android-key
    
- Description: [Platform authenticators](#platform-authenticators) on versions "N", and later, may provide this proprietary "hardware attestation" statement.
    
- Specification Document: Section [§ 8.4 Android Key Attestation Statement Format](#sctn-android-key-attestation) of this specification
    
- WebAuthn Attestation Statement Format Identifier: android-safetynet
    
- Description: Android-based [platform authenticators](#platform-authenticators) MAY produce an attestation statement based on the Android SafetyNet API.
    
- Specification Document: Section [§ 8.5 Android SafetyNet Attestation Statement Format](#sctn-android-safetynet-attestation) of this specification
    
- WebAuthn Attestation Statement Format Identifier: fido-u2f
    
- Description: Used with FIDO U2F authenticators
    
- Specification Document: Section [§ 8.6 FIDO U2F Attestation Statement Format](#sctn-fido-u2f-attestation) of this specification
    

### 12.2. WebAuthn Attestation Statement Format Identifier Registrations[](#sctn-att-fmt-reg)

This section registers the below-listed attestation statement formats, newly defined in Section [§ 8 Defined Attestation Statement Formats](#sctn-defined-attestation-formats), in the IANA "WebAuthn Attestation Statement Format Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809).

- WebAuthn Attestation Statement Format Identifier: apple
    
- Description: Used with Apple devices' [platform authenticators](#platform-authenticators)
    
- Specification Document: Section [§ 8.8 Apple Anonymous Attestation Statement Format](#sctn-apple-anonymous-attestation) of this specification
    
- WebAuthn Attestation Statement Format Identifier: none
    
- Description: Used to replace any authenticator-provided attestation statement when a WebAuthn Relying Party indicates it does not wish to receive attestation information.
    
- Specification Document: Section [§ 8.7 None Attestation Statement Format](#sctn-none-attestation) of this specification
    

### 12.3. WebAuthn Extension Identifier Registrations Updates[](#sctn-extensions-reg-update)

This section updates the below-listed [extension identifier](#extension-identifier) values defined in Section [§ 10 Defined Extensions](#sctn-defined-extensions) in the IANA "WebAuthn Extension Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809), originally registered in [[WebAuthn-1]](#biblio-webauthn-1), to point to this specification.

- WebAuthn Extension Identifier: appid
    
- Description: This [authentication extension](#authentication-extension) allows [WebAuthn Relying Parties](#webauthn-relying-party) that have previously registered a credential using the legacy FIDO JavaScript APIs to request an assertion.
    
- Specification Document: Section [§ 10.1 FIDO AppID Extension (appid)](#sctn-appid-extension) of this specification
    
- WebAuthn Extension Identifier: uvm
    
- Description: This [registration extension](#registration-extension) and [authentication extension](#authentication-extension) enables use of a user verification method. The user verification method extension returns to the [WebAuthn Relying Party](#webauthn-relying-party) which user verification methods (factors) were used for the WebAuthn operation.
    
- Specification Document: Section [§ 10.3 User Verification Method Extension (uvm)](#sctn-uvm-extension) of this specification
    

### 12.4. WebAuthn Extension Identifier Registrations[](#sctn-extensions-reg)

This section registers the below-listed [extension identifier](#extension-identifier) values, newly defined in Section [§ 10 Defined Extensions](#sctn-defined-extensions), in the IANA "WebAuthn Extension Identifiers" registry [[IANA-WebAuthn-Registries]](#biblio-iana-webauthn-registries) established by [[RFC8809]](#biblio-rfc8809).

- WebAuthn Extension Identifier: appidExclude
    
- Description: This registration extension allows [WebAuthn Relying Parties](#webauthn-relying-party) to exclude authenticators that contain specified credentials that were created with the legacy FIDO U2F JavaScript API [[FIDOU2FJavaScriptAPI]](#biblio-fidou2fjavascriptapi).
    
- Specification Document: Section [§ 10.2 FIDO AppID Exclusion Extension (appidExclude)](#sctn-appid-exclude-extension) of this specification
    
- WebAuthn Extension Identifier: credProps
    
- Description: This [client](#client-extension) [registration extension](#registration-extension) enables reporting of a newly-created [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential)'s properties, as determined by the [client](#client), to the calling [WebAuthn Relying Party](#webauthn-relying-party)'s [web application](#web-application).
    
- Specification Document: Section [§ 10.4 Credential Properties Extension (credProps)](#sctn-authenticator-credential-properties-extension) of this specification
    
- WebAuthn Extension Identifier: largeBlob
    
- Description: This [client](#client-extension) [registration extension](#registration-extension) and [authentication extension](#authentication-extension) allows a [Relying Party](#relying-party) to store opaque data associated with a credential.
    
- Specification Document: Section [§ 10.5 Large blob storage extension (largeBlob)](#sctn-large-blob-extension) of this specification
    

## 13. Security Considerations[](#sctn-security-considerations)

This specification defines a [Web API](#sctn-api) and a cryptographic peer-entity authentication protocol. The [Web Authentication API](#web-authentication-api) allows Web developers (i.e., "authors") to utilize the Web Authentication protocol in their [registration](#registration) and [authentication](#authentication) [ceremonies](#ceremony). The entities comprising the Web Authentication protocol endpoints are user-controlled [WebAuthn Authenticators](#webauthn-authenticator) and a [WebAuthn Relying Party](#webauthn-relying-party)'s computing environment hosting the [Relying Party](#relying-party)'s [web application](#web-application). In this model, the user agent, together with the [WebAuthn Client](#webauthn-client), comprise an intermediary between [authenticators](#authenticator) and [Relying Parties](#relying-party). Additionally, [authenticators](#authenticator) can [attest](#attestation) to [Relying Parties](#relying-party) as to their provenance.

At this time, this specification does not feature detailed security considerations. However, the [[FIDOSecRef]](#biblio-fidosecref) document provides a security analysis which is overall applicable to this specification. Also, the [[FIDOAuthnrSecReqs]](#biblio-fidoauthnrsecreqs) document suite provides useful information about [authenticator](#authenticator) security characteristics.

The below subsections comprise the current Web Authentication-specific security considerations. They are divided by audience; general security considerations are direct subsections of this section, while security considerations specifically for [authenticator](#authenticator), [client](#client) and [Relying Party](#relying-party) implementers are grouped into respective subsections.

### 13.1. Credential ID Unsigned[](#sctn-credentialIdSecurity)

The [credential ID](#credential-id) is not signed. This is not a problem because all that would happen if an [authenticator](#authenticator) returns the wrong [credential ID](#credential-id), or if an attacker intercepts and manipulates the [credential ID](#credential-id), is that the [WebAuthn Relying Party](#webauthn-relying-party) would not look up the correct [credential public key](#credential-public-key) with which to verify the returned signed [authenticator data](#authenticator-data) (a.k.a., [assertion](#assertion)), and thus the interaction would end in an error.

### 13.2. Physical Proximity between Client and Authenticator[](#sctn-client-authenticator-proximity)

In the WebAuthn [authenticator model](#authenticator-model), it is generally assumed that [roaming authenticators](#roaming-authenticators) are physically close to, and communicate directly with, the [client](#client). This arrangement has some important advantages.

The promise of physical proximity between [client](#client) and [authenticator](#authenticator) is a key strength of a [something you have](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) [authentication factor](https://pages.nist.gov/800-63-3/sp800-63-3.html#af). For example, if a [roaming authenticator](#roaming-authenticators) can communicate only via USB or Bluetooth, the limited range of these transports ensures that any malicious actor must physically be within that range in order to interact with the [authenticator](#authenticator). This is not necessarily true of an [authenticator](#authenticator) that can be invoked remotely — even if the [authenticator](#authenticator) verifies [user presence](#concept-user-present), users can be tricked into authorizing remotely initiated malicious requests.

Direct communication between [client](#client) and [authenticator](#authenticator) means the [client](#client) can enforce the [scope](#scope) restrictions for [credentials](https://w3c.github.io/webappsec-credential-management/#concept-credential). By contrast, if the communication between [client](#client) and [authenticator](#authenticator) is mediated by some third party, then the [client](#client) has to trust the third party to enforce the [scope](#scope) restrictions and control access to the [authenticator](#authenticator). Failure to do either could result in a malicious [Relying Party](#relying-party) receiving [authentication assertions](#authentication-assertion) valid for other [Relying Parties](#relying-party), or in a malicious user gaining access to [authentication assertions](#authentication-assertion) for other users.

If designing a solution where the [authenticator](#authenticator) does not need to be physically close to the [client](#client), or where [client](#client) and [authenticator](#authenticator) do not communicate directly, designers SHOULD consider how this affects the enforcement of [scope](#scope) restrictions and the strength of the [authenticator](#authenticator) as a [something you have](https://pages.nist.gov/800-63-3/sp800-63-3.html#af) authentication factor.

### 13.3. Security considerations for [authenticators](#authenticator)[](#sctn-security-considerations-authenticator)

#### 13.3.1. Attestation Certificate Hierarchy[](#sctn-cert-hierarchy)

A 3-tier hierarchy for attestation certificates is RECOMMENDED (i.e., Attestation Root, Attestation Issuing CA, Attestation Certificate). It is also RECOMMENDED that for each [WebAuthn Authenticator](#webauthn-authenticator) device line (i.e., model), a separate issuing CA is used to help facilitate isolating problems with a specific version of an authenticator model.

If the attestation root certificate is not dedicated to a single [WebAuthn Authenticator](#webauthn-authenticator) device line (i.e., AAGUID), the AAGUID SHOULD be specified in the attestation certificate itself, so that it can be verified against the [authenticator data](#authenticator-data).

#### 13.3.2. Attestation Certificate and Attestation Certificate CA Compromise[](#sctn-ca-compromise)

When an intermediate CA or a root CA used for issuing attestation certificates is compromised, [WebAuthn Authenticator](#webauthn-authenticator) [attestation key pairs](#attestation-key-pair) are still safe although their certificates can no longer be trusted. A [WebAuthn Authenticator](#webauthn-authenticator) manufacturer that has recorded the [attestation public keys](#attestation-public-key) for their [authenticator](#authenticator) models can issue new [attestation certificates](#attestation-certificate) for these keys from a new intermediate CA or from a new root CA. If the root CA changes, the [WebAuthn Relying Parties](#webauthn-relying-party) MUST update their trusted root certificates accordingly.

A [WebAuthn Authenticator](#webauthn-authenticator) [attestation certificate](#attestation-certificate) MUST be revoked by the issuing CA if its [private key](#attestation-private-key) has been compromised. A WebAuthn Authenticator manufacturer may need to ship a firmware update and inject new [attestation private keys](#attestation-private-key) and [certificates](#attestation-certificate) into already manufactured [WebAuthn Authenticators](#webauthn-authenticator), if the exposure was due to a firmware flaw. (The process by which this happens is out of scope for this specification.) If the [WebAuthn Authenticator](#webauthn-authenticator) manufacturer does not have this capability, then it may not be possible for [Relying Parties](#relying-party) to trust any further [attestation statements](#attestation-statement) from the affected [WebAuthn Authenticators](#webauthn-authenticator).

See also the related security consideration for [Relying Parties](#relying-party) in [§ 13.4.5 Revoked Attestation Certificates](#sctn-revoked-attestation-certificates).

### 13.4. Security considerations for [Relying Parties](#relying-party)[](#sctn-security-considerations-rp)

#### 13.4.1. Security Benefits for WebAuthn Relying Parties[](#sctn-rp-benefits)

The main benefits offered to [WebAuthn Relying Parties](#webauthn-relying-party) by this specification include:

1. Users and accounts can be secured using widely compatible, easy-to-use multi-factor authentication.
    
2. The [Relying Party](#relying-party) does not need to provision [authenticator](#authenticator) hardware to its users. Instead, each user can independently obtain any conforming [authenticator](#authenticator) and use that same [authenticator](#authenticator) with any number of [Relying Parties](#relying-party). The [Relying Party](#relying-party) can optionally enforce requirements on [authenticators](#authenticator)' security properties by inspecting the [attestation statements](#attestation-statement) returned from the [authenticators](#authenticator).
    
3. [Authentication ceremonies](#authentication-ceremony) are resistant to [man-in-the-middle attacks](https://tools.ietf.org/html/rfc4949#page-186). Regarding [registration ceremonies](#registration-ceremony), see [§ 13.4.4 Attestation Limitations](#sctn-attestation-limitations), below.
    
4. The [Relying Party](#relying-party) can automatically support multiple types of [user verification](#user-verification) - for example PIN, biometrics and/or future methods - with little or no code change, and can let each user decide which they prefer to use via their choice of [authenticator](#authenticator).
    
5. The [Relying Party](#relying-party) does not need to store additional secrets in order to gain the above benefits.
    

As stated in the [Conformance](#sctn-conforming-relying-parties) section, the [Relying Party](#relying-party) MUST behave as described in [§ 7 WebAuthn Relying Party Operations](#sctn-rp-operations) to obtain all of the above security benefits. However, one notable use case that departs slightly from this is described below in [§ 13.4.4 Attestation Limitations](#sctn-attestation-limitations).

#### 13.4.2. Visibility Considerations for Embedded Usage[](#sctn-seccons-visibility)

Simplistic use of WebAuthn in an embedded context, e.g., within `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)`s as described in [§ 5.10 Using Web Authentication within iframe elements](#sctn-iframe-guidance), may make users vulnerable to UI Redressing attacks, also known as "[Clickjacking](https://en.wikipedia.org/wiki/Clickjacking)". This is where an attacker overlays their own UI on top of a [Relying Party](#relying-party)'s intended UI and attempts to trick the user into performing unintended actions with the [Relying Party](#relying-party). For example, using these techniques, an attacker might be able to trick users into purchasing items, transferring money, etc.

Even though WebAuthn-specific UI is typically handled by the [client platform](#client-platform) and thus is not vulnerable to [UI Redressing](#ui-redressing), it is likely important for an [Relying Party](#relying-party) having embedded WebAuthn-wielding content to ensure that their content’s UI is visible to the user. An emerging means to do so is by observing the status of the experimental [Intersection Observer v2](https://w3c.github.io/IntersectionObserver/v2/)'s `isVisible` attribute. For example, the [Relying Party](#relying-party)'s script running in the embedded context could pre-emptively load itself in a popup window if it detects `isVisble` being set to `false`, thus side-stepping any occlusion of their content.

#### 13.4.3. Cryptographic Challenges[](#sctn-cryptographic-challenges)

As a cryptographic protocol, Web Authentication is dependent upon randomized challenges to avoid replay attacks. Therefore, the values of both `[PublicKeyCredentialCreationOptions](#dictdef-publickeycredentialcreationoptions)`.`[challenge](#dom-publickeycredentialcreationoptions-challenge)` and `[PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)`.`[challenge](#dom-publickeycredentialrequestoptions-challenge)` MUST be randomly generated by [Relying Parties](#relying-party) in an environment they trust (e.g., on the server-side), and the returned `[challenge](#dom-collectedclientdata-challenge)` value in the client’s response MUST match what was generated. This SHOULD be done in a fashion that does not rely upon a client’s behavior, e.g., the Relying Party SHOULD store the challenge temporarily until the operation is complete. Tolerating a mismatch will compromise the security of the protocol.

In order to prevent replay attacks, the challenges MUST contain enough entropy to make guessing them infeasible. Challenges SHOULD therefore be at least 16 bytes long.

#### 13.4.4. Attestation Limitations[](#sctn-attestation-limitations)

_This section is not normative._

When [registering a new credential](#sctn-registering-a-new-credential), the [attestation statement](#attestation-statement), if present, may allow the [WebAuthn Relying Party](#webauthn-relying-party) to derive assurances about various [authenticator](#authenticator) qualities. For example, the [authenticator](#authenticator) model, or how it stores and protects [credential private keys](#credential-private-key). However, it is important to note that an [attestation statement](#attestation-statement), on its own, provides no means for a [Relying Party](#relying-party) to verify that an [attestation object](#attestation-object) was generated by the [authenticator](#authenticator) the user intended, and not by a [man-in-the-middle attacker](https://tools.ietf.org/html/rfc4949#page-186). For example, such an attacker could use malicious code injected into [Relying Party](#relying-party) script. The [Relying Party](#relying-party) must therefore rely on other means, e.g., TLS and related technologies, to protect the [attestation object](#attestation-object) from [man-in-the-middle attacks](https://tools.ietf.org/html/rfc4949#page-186).

Under the assumption that a [registration ceremony](#registration-ceremony) is completed securely, and that the [authenticator](#authenticator) maintains confidentiality of the [credential private key](#credential-private-key), subsequent [authentication ceremonies](#authentication-ceremony) using that [public key credential](#public-key-credential) are resistant to [man-in-the-middle attacks](https://tools.ietf.org/html/rfc4949#page-186).

The discussion above holds for all [attestation types](#attestation-type). In all cases it is possible for a [man-in-the-middle attacker](https://tools.ietf.org/html/rfc4949#page-186) to replace the `[PublicKeyCredential](#publickeycredential)` object, including the [attestation statement](#attestation-statement) and the [credential public key](#credential-public-key) to be registered, and subsequently tamper with future [authentication assertions](#authentication-assertion) [scoped](#scope) for the same [Relying Party](#relying-party) and passing through the same attacker.

Such an attack would potentially be detectable; since the [Relying Party](#relying-party) has registered the attacker’s [credential public key](#credential-public-key) rather than the user’s, the attacker must tamper with all subsequent [authentication ceremonies](#authentication-ceremony) with that [Relying Party](#relying-party): unscathed ceremonies will fail, potentially revealing the attack.

[Attestation types](#attestation-type) other than [Self Attestation](#self-attestation) and [None](#none) can increase the difficulty of such attacks, since [Relying Parties](#relying-party) can possibly display [authenticator](#authenticator) information, e.g., model designation, to the user. An attacker might therefore need to use a genuine [authenticator](#authenticator) of the same model as the user’s [authenticator](#authenticator), or the user might notice that the [Relying Party](#relying-party) reports a different [authenticator](#authenticator) model than the user expects.

Note: All variants of [man-in-the-middle attacks](https://tools.ietf.org/html/rfc4949#page-186) described above are more difficult for an attacker to mount than a [man-in-the-middle attack](https://tools.ietf.org/html/rfc4949#page-186) against conventional password authentication.

#### 13.4.5. Revoked Attestation Certificates[](#sctn-revoked-attestation-certificates)

If [attestation certificate](#attestation-certificate) validation fails due to a revoked intermediate attestation CA certificate, and the [Relying Party](#relying-party)'s policy requires rejecting the registration/authentication request in these situations, then it is RECOMMENDED that the [Relying Party](#relying-party) also un-registers (or marks with a trust level equivalent to "[self attestation](#self-attestation)") [public key credentials](#public-key-credential) that were registered after the CA compromise date using an [attestation certificate](#attestation-certificate) chaining up to the same intermediate CA. It is thus RECOMMENDED that [Relying Parties](#relying-party) remember intermediate attestation CA certificates during [registration](#registration) in order to un-register related [public key credentials](#public-key-credential) if the [registration](#registration) was performed after revocation of such certificates.

See also the related security consideration for [authenticators](#authenticator) in [§ 13.3.2 Attestation Certificate and Attestation Certificate CA Compromise](#sctn-ca-compromise).

#### 13.4.6. Credential Loss and Key Mobility[](#sctn-credential-loss-key-mobility)

This specification defines no protocol for backing up [credential private keys](#credential-private-key), or for sharing them between [authenticators](#authenticator). In general, it is expected that a [credential private key](#credential-private-key) never leaves the [authenticator](#authenticator) that created it. Losing an [authenticator](#authenticator) therefore, in general, means losing all [credentials](#public-key-credential) [bound](#bound-credential) to the lost [authenticator](#authenticator), which could lock the user out of an account if the user has only one [credential](#public-key-credential) registered with the [Relying Party](#relying-party). Instead of backing up or sharing private keys, the Web Authentication API allows registering multiple [credentials](#public-key-credential) for the same user. For example, a user might register [platform credentials](#platform-credential) on frequently used [client devices](#client-device), and one or more [roaming credentials](#roaming-credential) for use as backup and with new or rarely used [client devices](#client-device).

[Relying Parties](#relying-party) SHOULD allow and encourage users to register multiple [credentials](#public-key-credential) to the same account. [Relying Parties](#relying-party) SHOULD make use of the `` `[excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials)` `` and `` `[user](#dom-publickeycredentialcreationoptions-user)`.`[id](#dom-publickeycredentialuserentity-id)` `` options to ensure that these different [credentials](#public-key-credential) are [bound](#bound-credential) to different [authenticators](#authenticator).

#### 13.4.7. Unprotected account detection[](#sctn-unprotected-account-detection)

_This section is not normative._

This security consideration applies to [Relying Parties](#relying-party) that support [authentication ceremonies](#authentication-ceremony) with a non-[empty](https://infra.spec.whatwg.org/#list-empty) `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument as the first authentication step. For example, if using authentication with [server-side credentials](#server-side-credential) as the first authentication step.

In this case the `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument risks leaking information about which user accounts have WebAuthn credentials registered and which do not, which may be a signal of account protection strength. For example, say an attacker can initiate an [authentication ceremony](#authentication-ceremony) by providing only a username, and the [Relying Party](#relying-party) responds with an non-empty `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` for some users, and with failure or a password challenge for other users. The attacker can then conclude that the latter user accounts likely do not require a WebAuthn [assertion](#assertion) for successful authentication, and thus focus an attack on those likely weaker accounts.

This issue is similar to the one described in [§ 14.6.2 Username Enumeration](#sctn-username-enumeration) and [§ 14.6.3 Privacy leak via credential IDs](#sctn-credential-id-privacy-leak), and can be mitigated in similar ways.

## 14. Privacy Considerations[](#sctn-privacy-considerations)

The privacy principles in [[FIDO-Privacy-Principles]](#biblio-fido-privacy-principles) also apply to this specification.

This section is divided by audience; general privacy considerations are direct subsections of this section, while privacy considerations specifically for [authenticator](#authenticator), [client](#client) and [Relying Party](#relying-party) implementers are grouped into respective subsections.

### 14.1. De-anonymization Prevention Measures[](#sctn-privacy-attacks)

_This section is not normative._

Many aspects of the design of the [Web Authentication API](#web-authentication-api) are motivated by privacy concerns. The main concern considered in this specification is the protection of the user’s personal identity, i.e., the identification of a human being or a correlation of separate identities as belonging to the same human being. Although the [Web Authentication API](#web-authentication-api) does not use or provide any form of global identity, the following kinds of potentially correlatable identifiers are used:

- The user’s [credential IDs](#credential-id) and [credential public keys](#credential-public-key).
    
    These are registered by the [WebAuthn Relying Party](#webauthn-relying-party) and subsequently used by the user to prove possession of the corresponding [credential private key](#credential-private-key). They are also visible to the [client](#client) in the communication with the [authenticator](#authenticator).
    
- The user’s identities specific to each [Relying Party](#relying-party), e.g., usernames and [user handles](#user-handle).
    
    These identities are obviously used by each [Relying Party](#relying-party) to identify a user in their system. They are also visible to the [client](#client) in the communication with the [authenticator](#authenticator).
    
- The user’s biometric characteristic(s), e.g., fingerprints or facial recognition data [[ISOBiometricVocabulary]](#biblio-isobiometricvocabulary).
    
    This is optionally used by the [authenticator](#authenticator) to perform [user verification](#user-verification). It is not revealed to the [Relying Party](#relying-party), but in the case of [platform authenticators](#platform-authenticators), it might be visible to the [client](#client) depending on the implementation.
    
- The models of the user’s [authenticators](#authenticator), e.g., product names.
    
    This is exposed in the [attestation statement](#attestation-statement) provided to the [Relying Party](#relying-party) during [registration](#registration). It is also visible to the [client](#client) in the communication with the [authenticator](#authenticator).
    
- The identities of the user’s [authenticators](#authenticator), e.g., serial numbers.
    
    This is possibly used by the [client](#client) to enable communication with the [authenticator](#authenticator), but is not exposed to the [Relying Party](#relying-party).
    

Some of the above information is necessarily shared with the [Relying Party](#relying-party). The following sections describe the measures taken to prevent malicious [Relying Parties](#relying-party) from using it to discover a user’s personal identity.

### 14.2. Anonymous, Scoped, Non-correlatable [Public Key Credentials](#public-key-credential)[](#sctn-non-correlatable-credentials)

_This section is not normative._

Although [Credential IDs](#credential-id) and [credential public keys](#credential-public-key) are necessarily shared with the [WebAuthn Relying Party](#webauthn-relying-party) to enable strong authentication, they are designed to be minimally identifying and not shared between [Relying Parties](#relying-party).

- [Credential IDs](#credential-id) and [credential public keys](#credential-public-key) are meaningless in isolation, as they only identify [credential key pairs](#credential-key-pair) and not users directly.
    
- Each [public key credential](#public-key-credential) is strictly [scoped](#scope) to a specific [Relying Party](#relying-party), and the [client](#client) ensures that its existence is not revealed to other [Relying Parties](#relying-party). A malicious [Relying Party](#relying-party) thus cannot ask the [client](#client) to reveal a user’s other identities.
    
- The [client](#client) also ensures that the existence of a [public key credential](#public-key-credential) is not revealed to the [Relying Party](#relying-party) without [user consent](#user-consent). This is detailed further in [§ 14.5.1 Registration Ceremony Privacy](#sctn-make-credential-privacy) and [§ 14.5.2 Authentication Ceremony Privacy](#sctn-assertion-privacy). A malicious [Relying Party](#relying-party) thus cannot silently identify a user, even if the user has a [public key credential](#public-key-credential) registered and available.
    
- [Authenticators](#authenticator) ensure that the [credential IDs](#credential-id) and [credential public keys](#credential-public-key) of different [public key credentials](#public-key-credential) are not correlatable as belonging to the same user. A pair of malicious [Relying Parties](#relying-party) thus cannot correlate users between their systems without additional information, e.g., a willfully reused username or e-mail address.
    
- [Authenticators](#authenticator) ensure that their [attestation certificates](#attestation-certificate) are not unique enough to identify a single [authenticator](#authenticator) or a small group of [authenticators](#authenticator). This is detailed further in [§ 14.4.1 Attestation Privacy](#sctn-attestation-privacy). A pair of malicious [Relying Parties](#relying-party) thus cannot correlate users between their systems by tracking individual [authenticators](#authenticator).
    

Additionally, a [client-side discoverable public key credential source](#client-side-discoverable-public-key-credential-source) can optionally include a [user handle](#user-handle) specified by the [Relying Party](#relying-party). The [credential](#public-key-credential) can then be used to both identify and [authenticate](#authentication) the user. This means that a privacy-conscious [Relying Party](#relying-party) can allow the user to create an account without a traditional username, further improving non-correlatability between [Relying Parties](#relying-party).

### 14.3. Authenticator-local [Biometric Recognition](#biometric-recognition)[](#sctn-biometric-privacy)

[Biometric authenticators](#biometric-authenticator) perform the [biometric recognition](#biometric-recognition) internally in the [authenticator](#authenticator) - though for [platform authenticators](#platform-authenticators) the biometric data might also be visible to the [client](#client), depending on the implementation. Biometric data is not revealed to the [WebAuthn Relying Party](#webauthn-relying-party); it is used only locally to perform [user verification](#user-verification) authorizing the creation and [registration](#registration) of, or [authentication](#authentication) using, a [public key credential](#public-key-credential). A malicious [Relying Party](#relying-party) therefore cannot discover the user’s personal identity via biometric data, and a security breach at a [Relying Party](#relying-party) cannot expose biometric data for an attacker to use for forging logins at other [Relying Parties](#relying-party).

In the case where a [Relying Party](#relying-party) requires [biometric recognition](#biometric-recognition), this is performed locally by the [biometric authenticator](#biometric-authenticator) perfoming [user verification](#user-verification) and then signaling the result by setting the [UV](#uv) [flag](#flags) in the signed [assertion](#assertion) response, instead of revealing the biometric data itself to the [Relying Party](#relying-party).

### 14.4. Privacy considerations for [authenticators](#authenticator)[](#sctn-privacy-considerations-authenticator)

#### 14.4.1. Attestation Privacy[](#sctn-attestation-privacy)

[Attestation certificates](#attestation-certificate) and [attestation key pairs](#attestation-key-pair) can be used to track users or link various online identities of the same user together. This can be mitigated in several ways, including:

- A [WebAuthn Authenticator](#webauthn-authenticator) manufacturer may choose to ship [authenticators](#authenticator) in batches where [authenticators](#authenticator) in a batch share the same [attestation certificate](#attestation-certificate) (called [Basic Attestation](#basic-attestation) or [batch attestation](#batch-attestation)). This will anonymize the user at the risk of not being able to revoke a particular [attestation certificate](#attestation-certificate) if its [private key](#attestation-private-key) is compromised. The [authenticator](#authenticator) manufacturer SHOULD then ensure that such batches are large enough to provide meaningful anonymization, while also minimizing the batch size in order to limit the number of affected users in case an [attestation private key](#attestation-private-key) is compromised.
    
    [[UAFProtocol]](#biblio-uafprotocol) requires that at least 100,000 [authenticator](#authenticator) devices share the same [attestation certificate](#attestation-certificate) in order to produce sufficiently large groups. This may serve as guidance about suitable batch sizes.
    
- A [WebAuthn Authenticator](#webauthn-authenticator) may be capable of dynamically generating different [attestation key pairs](#attestation-key-pair) (and requesting related [certificates](#attestation-certificate)) per-[credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) as described in the [Anonymization CA](#anonymization-ca) approach. For example, an [authenticator](#authenticator) can ship with a master [attestation private key](#attestation-private-key) (and [certificate](#attestation-certificate)), and combined with a cloud-operated [Anonymization CA](#anonymization-ca), can dynamically generate per-[credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) [attestation key pairs](#attestation-key-pair) and [attestation certificates](#attestation-certificate).
    
    Note: In various places outside this specification, the term "Privacy CA" is used to refer to what is termed here as an [Anonymization CA](#anonymization-ca). Because the Trusted Computing Group (TCG) also used the term "Privacy CA" to refer to what the TCG now refers to as an [Attestation CA](#attestation-ca) (ACA) [[TCG-CMCProfile-AIKCertEnroll]](#biblio-tcg-cmcprofile-aikcertenroll), we are using the term [Anonymization CA](#anonymization-ca) here to try to mitigate confusion in the specific context of this specification.
    

#### 14.4.2. Privacy of personally identifying information Stored in Authenticators[](#sctn-pii-privacy)

[Authenticators](#authenticator) MAY provide additional information to [clients](#client) outside what’s defined by this specification, e.g., to enable the [client](#client) to provide a rich UI with which the user can pick which [credential](https://w3c.github.io/webappsec-credential-management/#concept-credential) to use for an [authentication ceremony](#authentication-ceremony). If an [authenticator](#authenticator) chooses to do so, it SHOULD NOT expose personally identifying information unless successful [user verification](#user-verification) has been performed. If the [authenticator](#authenticator) supports [user verification](#user-verification) with more than one concurrently enrolled user, the [authenticator](#authenticator) SHOULD NOT expose personally identifying information of users other than the currently [verified](#concept-user-verified) user. Consequently, an [authenticator](#authenticator) that is not capable of [user verification](#user-verification) SHOULD NOT store personally identifying information.

For the purposes of this discussion, the [user handle](#user-handle) conveyed as the `[id](#dom-publickeycredentialuserentity-id)` member of `[PublicKeyCredentialUserEntity](#dictdef-publickeycredentialuserentity)` is not considered personally identifying information; see [§ 14.6.1 User Handle Contents](#sctn-user-handle-privacy).

These recommendations serve to prevent an adversary with physical access to an [authenticator](#authenticator) from extracting personally identifying information about the [authenticator](#authenticator)'s enrolled user(s).

### 14.5. Privacy considerations for [clients](#client)[](#sctn-privacy-considerations-client)

#### 14.5.1. Registration Ceremony Privacy[](#sctn-make-credential-privacy)

In order to protect users from being identified without [consent](#user-consent), implementations of the `[[[Create]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-create-slot)` method need to take care to not leak information that could enable a malicious [WebAuthn Relying Party](#webauthn-relying-party) to distinguish between these cases, where "excluded" means that at least one of the [credentials](#public-key-credential) listed by the [Relying Party](#relying-party) in `[excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials)` is [bound](#bound-credential) to the [authenticator](#authenticator):

- No [authenticators](#authenticator) are present.
    
- At least one [authenticator](#authenticator) is present, and at least one present [authenticator](#authenticator) is excluded.
    

If the above cases are distinguishable, information is leaked by which a malicious [Relying Party](#relying-party) could identify the user by probing for which [credentials](#public-key-credential) are available. For example, one such information leak is if the client returns a failure response as soon as an excluded [authenticator](#authenticator) becomes available. In this case - especially if the excluded [authenticator](#authenticator) is a [platform authenticator](#platform-authenticators) - the [Relying Party](#relying-party) could detect that the [ceremony](#ceremony) was canceled before the timeout and before the user could feasibly have canceled it manually, and thus conclude that at least one of the [credentials](#public-key-credential) listed in the `[excludeCredentials](#dom-publickeycredentialcreationoptions-excludecredentials)` parameter is available to the user.

The above is not a concern, however, if the user has [consented](#user-consent) to create a new credential before a distinguishable error is returned, because in this case the user has confirmed intent to share the information that would be leaked.

#### 14.5.2. Authentication Ceremony Privacy[](#sctn-assertion-privacy)

In order to protect users from being identified without [consent](#user-consent), implementations of the `[[[DiscoverFromExternalSource]](origin, options, sameOriginWithAncestors)](#dom-publickeycredential-discoverfromexternalsource-slot)` method need to take care to not leak information that could enable a malicious [WebAuthn Relying Party](#webauthn-relying-party) to distinguish between these cases, where "named" means that the [credential](#public-key-credential) is listed by the [Relying Party](#relying-party) in `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)`:

- A named [credential](#public-key-credential) is not available.
    
- A named [credential](#public-key-credential) is available, but the user does not [consent](#user-consent) to use it.
    

If the above cases are distinguishable, information is leaked by which a malicious [Relying Party](#relying-party) could identify the user by probing for which [credentials](#public-key-credential) are available. For example, one such information leak is if the client returns a failure response as soon as the user denies [consent](#user-consent) to proceed with an [authentication ceremony](#authentication-ceremony). In this case the [Relying Party](#relying-party) could detect that the [ceremony](#ceremony) was canceled by the user and not the timeout, and thus conclude that at least one of the [credentials](#public-key-credential) listed in the `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` parameter is available to the user.

#### 14.5.3. Privacy Between Operating System Accounts[](#sctn-os-account-privacy)

If a [platform authenticator](#platform-authenticators) is included in a [client device](#client-device) with a multi-user operating system, the [platform authenticator](#platform-authenticators) and [client device](#client-device) SHOULD work together to ensure that the existence of any [platform credential](#platform-credential) is revealed only to the operating system user that created that [platform credential](#platform-credential).

### 14.6. Privacy considerations for [Relying Parties](#relying-party)[](#sctn-privacy-considerations-rp)

#### 14.6.1. User Handle Contents[](#sctn-user-handle-privacy)

Since the [user handle](#user-handle) is not considered personally identifying information in [§ 14.4.2 Privacy of personally identifying information Stored in Authenticators](#sctn-pii-privacy), the [Relying Party](#relying-party) MUST NOT include personally identifying information, e.g., e-mail addresses or usernames, in the [user handle](#user-handle). This includes hash values of personally identifying information, unless the hash function is [salted](https://tools.ietf.org/html/rfc4949#page-258) with [salt](https://tools.ietf.org/html/rfc4949#page-258) values private to the [Relying Party](#relying-party), since hashing does not prevent probing for guessable input values. It is RECOMMENDED to let the [user handle](#user-handle) be 64 random bytes, and store this value in the user’s account.

#### 14.6.2. Username Enumeration[](#sctn-username-enumeration)

While initiating a [registration](#registration-ceremony) or [authentication ceremony](#authentication-ceremony), there is a risk that the [WebAuthn Relying Party](#webauthn-relying-party) might leak sensitive information about its registered users. For example, if a [Relying Party](#relying-party) uses e-mail addresses as usernames and an attacker attempts to initiate an [authentication](#authentication) [ceremony](#ceremony) for "alex.mueller@example.com" and the [Relying Party](#relying-party) responds with a failure, but then successfully initiates an [authentication ceremony](#authentication-ceremony) for "j.doe@example.com", then the attacker can conclude that "j.doe@example.com" is registered and "alex.mueller@example.com" is not. The [Relying Party](#relying-party) has thus leaked the possibly sensitive information that "j.doe@example.com" has an account at this [Relying Party](#relying-party).

The following is a non-normative, non-exhaustive list of measures the [Relying Party](#relying-party) may implement to mitigate or prevent information leakage due to such an attack:

- For [registration ceremonies](#registration-ceremony):
    
    - If the [Relying Party](#relying-party) uses [Relying Party](#relying-party)-specific usernames to identify users:
        
        - When initiating a [registration ceremony](#registration-ceremony), disallow registration of usernames that are syntactically valid e-mail addresses.
            
            Note: The motivation for this suggestion is that in this case the [Relying Party](#relying-party) probably has no choice but to fail the [registration ceremony](#registration-ceremony) if the user attempts to register a username that is already registered, and an information leak might therefore be unavoidable. By disallowing e-mail addresses as usernames, the impact of the leakage can be mitigated since it will be less likely that a user has the same username at this [Relying Party](#relying-party) as at other [Relying Parties](#relying-party).
            
    - If the [Relying Party](#relying-party) uses e-mail addresses to identify users:
        
        - When initiating a [registration ceremony](#registration-ceremony), interrupt the user interaction after the e-mail address is supplied and send a message to this address, containing an unpredictable one-time code and instructions for how to use it to proceed with the ceremony. Display the same message to the user in the web interface regardless of the contents of the sent e-mail and whether or not this e-mail address was already registered.
            
            Note: This suggestion can be similarly adapted for other externally meaningful identifiers, for example, national ID numbers or credit card numbers — if they provide similar out-of-band contact information, for example, conventional postal address.
            
- For [authentication ceremonies](#authentication-ceremony):
    
    - If, when initiating an [authentication ceremony](#authentication-ceremony), there is no account matching the provided username, continue the ceremony by invoking `[navigator.credentials.get()](https://w3c.github.io/webappsec-credential-management/#dom-credentialscontainer-get)` using a syntactically valid `[PublicKeyCredentialRequestOptions](#dictdef-publickeycredentialrequestoptions)` object that is populated with plausible imaginary values.
        
        This approach could also be used to mitigate information leakage via `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)`; see [§ 13.4.7 Unprotected account detection](#sctn-unprotected-account-detection) and [§ 14.6.3 Privacy leak via credential IDs](#sctn-credential-id-privacy-leak).
        
        Note: The username may be "provided" in various [Relying Party](#relying-party)-specific fashions: login form, session cookie, etc.
        
        Note: If returned imaginary values noticeably differ from actual ones, clever attackers may be able to discern them and thus be able to test for existence of actual accounts. Examples of noticeably different values include if the values are always the same for all username inputs, or are different in repeated attempts with the same username input. The `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` member could therefore be populated with pseudo-random values derived deterministically from the username, for example.
        
    - When verifying an `[AuthenticatorAssertionResponse](#authenticatorassertionresponse)` response from the [authenticator](#authenticator), make it indistinguishable whether verification failed because the signature is invalid or because no such user or credential is registered.
        
    - Perform a multi-step [authentication ceremony](#authentication-ceremony), e.g., beginning with supplying username and password or a session cookie, before initiating the WebAuthn [ceremony](#ceremony) as a subsequent step. This moves the username enumeration problem from the WebAuthn step to the preceding authentication step, where it may be easier to solve.
        

#### 14.6.3. Privacy leak via credential IDs[](#sctn-credential-id-privacy-leak)

_This section is not normative._

This privacy consideration applies to [Relying Parties](#relying-party) that support [authentication ceremonies](#authentication-ceremony) with a non-[empty](https://infra.spec.whatwg.org/#list-empty) `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument as the first authentication step. For example, if using authentication with [server-side credentials](#server-side-credential) as the first authentication step.

In this case the `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument risks leaking personally identifying information, since it exposes the user’s [credential IDs](#credential-id) to an unauthenticated caller. [Credential IDs](#credential-id) are designed to not be correlatable between [Relying Parties](#relying-party), but the length of a [credential ID](#credential-id) might be a hint as to what type of [authenticator](#authenticator) created it. It is likely that a user will use the same username and set of [authenticators](#authenticator) for several [Relying Parties](#relying-party), so the number of [credential IDs](#credential-id) in `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` and their lengths might serve as a global correlation handle to de-anonymize the user. Knowing a user’s [credential IDs](#credential-id) also makes it possible to confirm guesses about the user’s identity given only momentary physical access to one of the user’s [authenticators](#authenticator).

In order to prevent such information leakage, the [Relying Party](#relying-party) could for example:

- Perform a separate authentication step, such as username and password authentication or session cookie authentication, before initiating the WebAuthn [authentication ceremony](#authentication-ceremony) and exposing the user’s [credential IDs](#credential-id).
    
- Use [client-side discoverable credentials](#client-side-discoverable-credential), so the `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` argument is not needed.
    

If the above prevention measures are not available, i.e., if `[allowCredentials](#dom-publickeycredentialrequestoptions-allowcredentials)` needs to be exposed given only a username, the [Relying Party](#relying-party) could mitigate the privacy leak using the same approach of returning imaginary [credential IDs](#credential-id) as discussed in [§ 14.6.2 Username Enumeration](#sctn-username-enumeration).

## 15. Accessibility Considerations[](#sctn-accessiblility-considerations)

[User verification](#user-verification)-capable [authenticators](#authenticator), whether [roaming](#roaming-authenticators) or [platform](#platform-authenticators), should offer users more than one user verification method. For example, both fingerprint sensing and PIN entry. This allows for fallback to other user verification means if the selected one is not working for some reason. Note that in the case of [roaming authenticators](#roaming-authenticators), the authenticator and platform might work together to provide a user verification method such as PIN entry [[FIDO-CTAP]](#biblio-fido-ctap).

[Relying Parties](#relying-party), at [registration](#registration) time, SHOULD provide affordances for users to complete future [authorization gestures](#authorization-gesture) correctly. This could involve naming the authenticator, choosing a picture to associate with the device, or entering freeform text instructions (e.g., as a reminder-to-self).

[Ceremonies](#ceremony) relying on timing, e.g., a [registration ceremony](#registration-ceremony) (see `[timeout](#dom-publickeycredentialcreationoptions-timeout)`) or an [authentication ceremony](#authentication-ceremony) (see `[timeout](#dom-publickeycredentialrequestoptions-timeout)`), ought to follow [[WCAG21]](#biblio-wcag21)'s [Guideline 2.2 Enough Time](https://www.w3.org/TR/WCAG21/#enough-time). If a [client platform](#client-platform) determines that a [Relying Party](#relying-party)-supplied timeout does not appropriately adhere to the latter [[WCAG21]](#biblio-wcag21) guidelines, then the [client platform](#client-platform) MAY adjust the timeout accordingly.

## 16. Acknowledgements[](#sctn-acknowledgements)

We thank the following people for their reviews of, and contributions to, this specification: Yuriy Ackermann, James Barclay, Richard Barnes, Dominic Battré, Julien Cayzac, Domenic Denicola, Rahul Ghosh, Brad Hill, Jing Jin, Wally Jones, Ian Kilpatrick, Axel Nennker, Yoshikazu Nojima, Kimberly Paulhamus, Adam Powers, Yaron Sheffer, Ki-Eun Shin, Anne van Kesteren, Johan Verrept, and Boris Zbarsky.

Thanks to Adam Powers for creating the overall [registration](#registration) and [authentication](#authentication) flow diagrams ([Figure 1](#fig-registration) and [Figure 2](#fig-authentication)).

We thank Anthony Nadalin, John Fontana, and Richard Barnes for their contributions as co-chairs of the [Web Authentication Working Group](https://www.w3.org/Webauthn/).

We also thank Wendy Seltzer, Samuel Weiler, and Harry Halpin for their contributions as our W3C Team Contacts.
