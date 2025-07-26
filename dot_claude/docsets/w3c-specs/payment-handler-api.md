---
tags:
  - "#web-api"
  - "#protocol-specification"
  - "#web-security"
  - "#payment-protocols"
  - "#web-authentication"
  - "#payment-handler"
  - "#service-worker-integration"
  - "#payment-processing"
---
## Abstract

This specification defines capabilities that enable Web applications to
handle requests for payment.


## Status of This Document

_This section describes the status of this_
_document at the time of its publication. A list of current W3C_
_publications and the latest revision of this technical report can be found_
_in the [W3C technical reports index](https://www.w3.org/TR/) at_
_https://www.w3.org/TR/._

The Web Payments Working Group maintains [a list of all bug\\
reports that the group has not yet addressed](https://github.com/w3c/payment-handler/issues). This draft highlights
some of the pending issues that are still to be discussed in the
working group. No decision has been taken on the outcome of these
issues including whether they are valid. Pull requests with proposed
specification text for outstanding issues are strongly encouraged.


This document was published by the [Web Payments Working Group](https://www.w3.org/groups/wg/payments) as
a Working Draft using the
[Recommendation track](https://www.w3.org/2021/Process-20211102/#recs-and-notes).


Publication as a Working Draft does not
imply endorsement by W3C and its Members.

This is a draft document and may be updated, replaced or obsoleted by other
documents at any time. It is inappropriate to cite this document as other
than work in progress.




This document was produced by a group
operating under the
[W3C Patent\\
Policy](https://www.w3.org/Consortium/Patent-Policy/).


W3C maintains a
[public list of any patent disclosures](https://www.w3.org/groups/wg/payments/ipr)
made in connection with the deliverables of
the group; that page also includes
instructions for disclosing a patent. An individual who has actual
knowledge of a patent which the individual believes contains
[Essential Claim(s)](https://www.w3.org/Consortium/Patent-Policy/#def-essential)
must disclose the information in accordance with
[section 6 of the W3C Patent Policy](https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure).



This document is governed by the
[2 November 2021 W3C Process Document](https://www.w3.org/2021/Process-20211102/).


## 1\.   Introduction

[Permalink for Section 1.](https://www.w3.org/TR/payment-handler/#introduction)

_This section is non-normative._

This specification defines a number of new features to allow web
applications to handle requests for payments on behalf of users:


- An origin-based permission to handle payment request events.

- A payment request event type ( [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent)). A [payment\\
   handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) is an event handler for the [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent).

- An extension to the [service worker registration](https://www.w3.org/TR/payment-handler/#dfn-service-worker-registration) interface
   ( [`PaymentManager`](https://www.w3.org/TR/payment-handler/#dom-paymentmanager)) to manage properties of payment handlers.

- A mechanism to respond to the [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent).


Note

This specification does not address how software built with
operating-system specific mechanisms (i.e., "native apps") handle
payment requests.


## 2\.   Overview

[Permalink for Section 2.](https://www.w3.org/TR/payment-handler/#model)

In this document we envision the following flow:


1. An origin requests permission from the user to handle payment
    requests for a set of supported payment methods. For example, a user
    visiting a retail or bank site may be prompted to register a payment
    handler from that origin. The origin establishes the scope of the
    permission but the origin's capabilities may evolve without requiring
    additional user consent.

2. [Payment handlers](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) are defined in [service worker](https://www.w3.org/TR/service-workers/#service-worker-concept) code.

3. When the merchant (or other payee) calls the
    \[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\] method [canMakePayment()](https://www.w3.org/TR/payment-request/#canmakepayment-method) or [show()](https://www.w3.org/TR/payment-request/#show-method)
    (e.g., when the user -- the payer \-\- pushes a button on a
    checkout page), the user agent computes a list of candidate payment
    handlers, comparing the payment methods accepted by the merchant with
    those known to the user agent through any number of mechanisms,
    including, but not limited to:

   - Those previously registered through this API.
   - Those that may be registered through this API during the course of
      the transaction, e.g., identified through a [payment method\\
      manifest](https://www.w3.org/TR/payment-method-manifest/#payment-method-manifest).
   - Those registered through other mechanisms, e.g., the operating
      system.
4. The user agent displays a set of choices to the user: the candidate
    payment handlers. The user agent displays these choices using
    information (labels and icons) provided at registration or otherwise
    available from the Web app.

5. When the [payer](https://www.w3.org/TR/payment-handler/#dfn-payer) user selects a payment handler, the user agent
    fires a [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) (cf. the [user interaction task\\
    source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source)) in the [service worker](https://www.w3.org/TR/service-workers/#service-worker-concept) for the selected payment
    handler. The [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) includes some information from the
    PaymentRequest (defined in \[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\]) as well as additional
    information (e.g., payee's origin).

6. Once activated, the payment handler performs whatever steps are
    necessary to [handle the payment\\
    request](https://www.w3.org/TR/payment-handler/#handling-a-payment-request), and return an appropriate payment response to the
    [payee](https://www.w3.org/TR/payment-handler/#dfn-payee). If interaction with the user is necessary, the [payment\\
    handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) can open a window for that purpose.

7. The user agent receives a response asynchronously once the payment
    handler has finished handling the request. The response becomes the
    [PaymentResponse](https://www.w3.org/TR/payment-request/#dom-paymentresponse) (of \[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\]).


Note

An origin may implement a payment app with more than one service worker
and therefore multiple [payment handlers](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) may be registered per
origin. The handler that is invoked is determined by the selection made
by the user.


### 2.1   Handling a Payment Request

[Permalink for Section 2.1](https://www.w3.org/TR/payment-handler/#handling-a-payment-request)

_This section is non-normative._

A payment handler is a Web application that can handle a
request for payment on behalf of the user.


The logic of a payment handler is driven by the payment methods that
it supports. Some payment methods expect little to no processing by
the payment handler which simply returns payment card details in the
response. It is then the job of the payee website to process the
payment using the returned data as input.


In contrast, some payment methods, such as a crypto-currency payments
or bank originated credit transfers, require that the payment handler
initiate processing of the payment. In such cases the payment handler
will return a payment reference, endpoint URL or some other data that
the payee website can use to determine the outcome of the payment (as
opposed to processing the payment itself).


Handling a payment request may include numerous interactions: with
the user through a new window or other APIs (such as
[Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/)) or with other services and origins through web
requests or other means.


This specification does not address these activities that occur
between the payment handler accepting the [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) and
the payment handler returning a response. All of these activities
which may be required to configure the payment handler and handle the
payment request, are left to the implementation of the payment
handler, including:


- how the user establishes an account with an origin that provides
   payment services.

- how an origin authenticates a user.

- how communication takes place between the payee server and the
   payee Web application, or between a payment app origin and other
   parties.


Thus, an origin will rely on many other Web technologies defined
elsewhere for lifecycle management, security, user authentication,
user interaction, and so on.


### 2.2   Relation to Other Types of Payment Apps

[Permalink for Section 2.2](https://www.w3.org/TR/payment-handler/#relation-to-other-types-of-payment-apps)

_This section is non-normative._

This specification does not address how third-party mobile payment
apps interact (through proprietary mechanisms) with user agents, or
how user agents themselves provide simple payment app functionality.


![Different types of payment apps. Payment Handler API is for Web apps.](https://www.w3.org/TR/payment-handler/app-types.png)Figure 1
 Payment Handler API enables Web apps to handle payments. Other
 types of payment apps may use other (proprietary) mechanisms.


## 3\.   Registration

[Permalink for Section 3.](https://www.w3.org/TR/payment-handler/#registration)

One registers a payment handler with the user agent through a
just-in-time (JIT) registration mechanism.


### 3.1   Just-in-time registration

[Permalink for Section 3.1](https://www.w3.org/TR/payment-handler/#just-in-time-registration)

If a payment handler is not registered when a merchant invokes
[`show`](https://www.w3.org/TR/payment-request/#show-method) `()` method, a user agent may allow the user to
register this payment handler during the transaction ("just-in-time").


_The remaining content of this section is non-normative._

A user agent may perform just-in-time installation by deriving payment
handler information from the [payment method manifest](https://www.w3.org/TR/payment-method-manifest/#payment-method-manifest) that is
found through the [URL-based payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-url-based-payment-method-identifier) that the
merchant requested.


## 4\.   Management

[Permalink for Section 4.](https://www.w3.org/TR/payment-handler/#management)

This section describes the functionality available to a payment handler
to manage its own properties.


### 4.1   Extension to the `ServiceWorkerRegistration` interface

[Permalink for Section 4.1](https://www.w3.org/TR/payment-handler/#extension-to-the-serviceworkerregistration-interface)

```
WebIDLpartial interface ServiceWorkerRegistration {
  [SameObject] readonly attribute PaymentManager paymentManager;
};
```

The `paymentManager` attribute exposes payment handler
management functionality.


### 4.2 `PaymentManager` interface

[Permalink for Section 4.2](https://www.w3.org/TR/payment-handler/#paymentmanager-interface)

```
WebIDL[SecureContext, Exposed=(Window)]
interface PaymentManager {
  attribute DOMString userHint;
  Promise<undefined> enableDelegations(sequence<PaymentDelegation> delegations);
};
```

The [`PaymentManager`](https://www.w3.org/TR/payment-handler/#dom-paymentmanager) is used by [payment handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) s to manage
their supported delegations.


#### 4.2.1 `userHint` attribute

[Permalink for Section 4.2.1](https://www.w3.org/TR/payment-handler/#userhint-attribute)

When displaying payment handler name and icon, the user agent may
use this string to improve the user experience. For example, a user
hint of "\*\*\*\* 1234" can remind the user that a particular card is
available through this payment handler.


#### 4.2.2 `enableDelegations()` method

[Permalink for Section 4.2.2](https://www.w3.org/TR/payment-handler/#enabledelegations-method)

This method allows a [payment handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) to asynchronously
declare its supported [`PaymentDelegation`](https://www.w3.org/TR/payment-handler/#dom-paymentdelegation) list.


### 4.3 `PaymentDelegation` enum

[Permalink for Section 4.3](https://www.w3.org/TR/payment-handler/#paymentdelegation-enum)

```
WebIDLenum PaymentDelegation {
  "shippingAddress",
  "payerName",
  "payerPhone",
  "payerEmail"
};
```

 "`shippingAddress`"

 The payment handler will provide shipping address whenever needed.

 "`payerName`"

 The payment handler will provide payer's name whenever needed.

 "`payerPhone`"

 The payment handler will provide payer's phone whenever needed.

 "`payerEmail`"

 The payment handler will provide payer's email whenever needed.


## 5\.   Can make payment

[Permalink for Section 5.](https://www.w3.org/TR/payment-handler/#canmakepayment)

If the [payment handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) supports [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent), the
[user agent](https://www.w3.org/TR/payment-handler/#dfn-user-agents) may use it to help with filtering of the available
payment handlers.


Implementations may impose a timeout for developers to respond to the
[`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent). If the timeout expires, then the
implementation will behave as if [`respondWith`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent-respondwith) `()`
was called with `false`.


### 5.1   Extension to `ServiceWorkerGlobalScope`

[Permalink for Section 5.1](https://www.w3.org/TR/payment-handler/#extension-to-serviceworkerglobalscope)

```
WebIDLpartial interface ServiceWorkerGlobalScope {
  attribute EventHandler oncanmakepayment;
};
```

#### 5.1.1 `oncanmakepayment` attribute

[Permalink for Section 5.1.1](https://www.w3.org/TR/payment-handler/#oncanmakepayment-attribute)

The [`oncanmakepayment`](https://www.w3.org/TR/payment-handler/#dom-serviceworkerglobalscope-oncanmakepayment) attribute is an
[event handler](https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers) whose corresponding [event handler event\\
type](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-event-type) is "canmakepayment".


### 5.2   The `CanMakePaymentEvent`

[Permalink for Section 5.2](https://www.w3.org/TR/payment-handler/#the-canmakepaymentevent)

The [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) is used to as a signal for whether the
payment handler is able to respond to a payment request.


```
WebIDL[Exposed=ServiceWorker]
interface CanMakePaymentEvent : ExtendableEvent {
  constructor(DOMString type);
  undefined respondWith(Promise<boolean> canMakePaymentResponse);
};
```

#### 5.2.1 `respondWith()` method

[Permalink for Section 5.2.1](https://www.w3.org/TR/payment-handler/#respondwith-method)

This method is used by the payment handler as a signal for whether
it can respond to a payment request.


### 5.3 Handling a CanMakePaymentEvent

[Permalink for Section 5.3](https://www.w3.org/TR/payment-handler/#handling-a-canmakepaymentevent)

Upon receiving a [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest), the [user agent](https://www.w3.org/TR/payment-handler/#dfn-user-agents) _MUST_
run the following steps:


1. If [user agent](https://www.w3.org/TR/payment-handler/#dfn-user-agents) settings prohibit usage of
    [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) (e.g., in private browsing mode),
    terminate these steps.

2. Let registration be a [`ServiceWorkerRegistration`](https://www.w3.org/TR/service-workers/#service-worker-registration-concept).

3. If registration is not found, terminate these steps.

4. [Fire Functional Event](https://www.w3.org/TR/service-workers/#fire-functional-event-algorithm) " `canmakepayment`" using
    [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) on registration.



### 5.4   Example of handling the [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/\#dom-canmakepaymentevent)

[Permalink for Section 5.4](https://www.w3.org/TR/payment-handler/#canmakepayment-example)

_This section is non-normative._

This example shows how to write a service worker that listens to the
[`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent). When a [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) is
received, the service worker always returns true.


[Example 1](https://www.w3.org/TR/payment-handler/#example-handling-the-canmakepaymentevent): Handling the CanMakePaymentEvent

```hljs js
self.addEventListener("canmakepayment", function(e) {
  e.respondWith(new Promise(function(resolve, reject) {
    resolve(true);
  }));
});
```

### 5.5   Filtering of Payment Handlers

[Permalink for Section 5.5](https://www.w3.org/TR/payment-handler/#filtering-of-payment-handlers)

Given a [PaymentMethodData](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary) and a payment handler that matches on
[payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi), this algorithm returns
`true` if this payment handler can be used for payment:


1. Let methodName be the [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi)
    string specified in the [PaymentMethodData](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary).

2. Let methodData be the payment method specific data of
    [PaymentMethodData](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary).

3. Let paymentHandlerOrigin be the [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) of the
    [`ServiceWorkerRegistration`](https://www.w3.org/TR/service-workers/#service-worker-registration-concept) scope URL of the payment handler.

4. Let paymentMethodManifest be the [ingested](https://www.w3.org/TR/payment-method-manifest/#ingest-payment-method-manifests) and
    [parsed](https://www.w3.org/TR/payment-method-manifest/#parsed-payment-method-manifest) [payment method manifest](https://www.w3.org/TR/payment-method-manifest/#payment-method-manifest) for the
    methodName.

5. If methodName is a [URL-based payment method\\
    identifier](https://www.w3.org/TR/payment-method-id/#dfn-url-based-payment-method-identifier) with the `"*"` string [supported\\
    origins](https://www.w3.org/TR/payment-method-manifest/#parsed-payment-method-manifest-supported-origins) in paymentMethodManifest, return
    `true`.

6. Otherwise, if the [URL-based payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-url-based-payment-method-identifier) methodName has the same [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) as
    paymentHandlerOrigin, fire the [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent)
    in the payment handler and return the result.

7. Otherwise, if [supported origins](https://www.w3.org/TR/payment-method-manifest/#parsed-payment-method-manifest-supported-origins) in
    paymentMethodManifest is an ordered set of [origin](https://url.spec.whatwg.org/#concept-url-origin)
    that contains the paymentHandlerOrigin, fire the
    [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) in the payment handler and return the
    result.

8. Otherwise, return `false`.


## 6\.   Invocation

[Permalink for Section 6.](https://www.w3.org/TR/payment-handler/#invocation)

Once the user has selected a payment handler, the user agent fires a
[`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) and uses the subsequent
[`PaymentHandlerResponse`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse) to create a [PaymentResponse](https://www.w3.org/TR/payment-request/#dom-paymentresponse) for
\[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\].


[Issue 117](https://github.com/w3c/payment-handler/issues/117): Support for Abort() being delegated to Payment Handler

Payment Request API supports delegation of responsibility to manage an
abort to a payment app. There is a proposal to add a
paymentRequestAborted event to the Payment Handler interface. The event
will have a respondWith method that takes a boolean parameter
indicating if the paymentRequest has been successfully aborted.


### 6.1   Extension to [`ServiceWorkerGlobalScope`](https://www.w3.org/TR/service-workers/\#serviceworkerglobalscope-interface)

[Permalink for Section 6.1](https://www.w3.org/TR/payment-handler/#extension-to-serviceworkerglobalscope-0)

This specification extends the [`ServiceWorkerGlobalScope`](https://www.w3.org/TR/service-workers/#serviceworkerglobalscope-interface)
interface.


```
WebIDLpartial interface ServiceWorkerGlobalScope {
  attribute EventHandler onpaymentrequest;
};
```

#### 6.1.1 `onpaymentrequest` attribute

[Permalink for Section 6.1.1](https://www.w3.org/TR/payment-handler/#onpaymentrequest-attribute)

The [`onpaymentrequest`](https://www.w3.org/TR/payment-handler/#dom-serviceworkerglobalscope-onpaymentrequest) attribute is an [event handler](https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers)
whose corresponding [event handler event type](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-event-type) is
[`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent).


### 6.2   The `PaymentRequestDetailsUpdate`

[Permalink for Section 6.2](https://www.w3.org/TR/payment-handler/#the-paymentrequestdetailsupdate)

The `PaymentRequestDetailsUpdate` contains the updated
total (optionally with modifiers and shipping options) and possible
errors resulting from user selection of a payment method, a shipping
address, or a shipping option within a payment handler.


```
WebIDLdictionary PaymentRequestDetailsUpdate {
  DOMString error;
  PaymentCurrencyAmount total;
  sequence<PaymentDetailsModifier> modifiers;
  sequence<PaymentShippingOption> shippingOptions;
  object paymentMethodErrors;
  AddressErrors shippingAddressErrors;
};
```

#### 6.2.1 `error` member

[Permalink for Section 6.2.1](https://www.w3.org/TR/payment-handler/#error-member)

A human readable string that explains why the user selected payment
method, shipping address or shipping option cannot be used.


#### 6.2.2 `total` member

[Permalink for Section 6.2.2](https://www.w3.org/TR/payment-handler/#total-member)

Updated total based on the changed payment method, shipping
address, or shipping option. The total can change, for example,
because the billing address of the payment method selected by the
user changes the Value Added Tax (VAT); Or because the shipping
option/address selected/provided by the user changes the shipping
cost.


#### 6.2.3 `modifiers` member

[Permalink for Section 6.2.3](https://www.w3.org/TR/payment-handler/#modifiers-member)

Updated modifiers based on the changed payment method, shipping
address, or shipping option. For example, if the overall total has
increased by €1.00 based on the billing or shipping address, then
the totals specified in each of the modifiers should also increase
by €1.00.


#### 6.2.4 `shippingOptions` member

[Permalink for Section 6.2.4](https://www.w3.org/TR/payment-handler/#shippingoptions-member)

Updated shippingOptions based on the changed shipping address. For
example, it is possible that express shipping is more expensive or
unavailable for the user provided country.


#### 6.2.5 `paymentMethodErrors` member

[Permalink for Section 6.2.5](https://www.w3.org/TR/payment-handler/#paymentmethoderrors-member)

Validation errors for the payment method, if any.


#### 6.2.6 `shippingAddressErrors` member

[Permalink for Section 6.2.6](https://www.w3.org/TR/payment-handler/#shippingaddresserrors-member)

Validation errors for the shipping address, if any.


### 6.3   The `PaymentRequestEvent`

[Permalink for Section 6.3](https://www.w3.org/TR/payment-handler/#the-paymentrequestevent)

The PaymentRequestEvent represents the data and methods available to
a Payment Handler after selection by the user. The user agent
communicates a subset of data available from the
[PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) to the Payment Handler.


```
WebIDL[Exposed=ServiceWorker]
interface PaymentRequestEvent : ExtendableEvent {
  constructor(DOMString type, optional PaymentRequestEventInit eventInitDict = {});
  readonly attribute USVString topOrigin;
  readonly attribute USVString paymentRequestOrigin;
  readonly attribute DOMString paymentRequestId;
  readonly attribute FrozenArray<PaymentMethodData> methodData;
  readonly attribute object total;
  readonly attribute FrozenArray<PaymentDetailsModifier> modifiers;
  readonly attribute object? paymentOptions;
  readonly attribute FrozenArray<PaymentShippingOption>? shippingOptions;
  Promise<WindowClient?> openWindow(USVString url);
  Promise<PaymentRequestDetailsUpdate?> changePaymentMethod(DOMString methodName, optional object? methodDetails = null);
  Promise<PaymentRequestDetailsUpdate?> changeShippingAddress(optional AddressInit shippingAddress = {});
  Promise<PaymentRequestDetailsUpdate?> changeShippingOption(DOMString shippingOption);
  undefined respondWith(Promise<PaymentHandlerResponse> handlerResponsePromise);
};
```

#### 6.3.1 `topOrigin` attribute

[Permalink for Section 6.3.1](https://www.w3.org/TR/payment-handler/#toporigin-attribute)

Returns a string that indicates the [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) of the top level
[payee](https://www.w3.org/TR/payment-handler/#dfn-payee) web page. This attribute is initialized by [Handling\\
a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#dfn-handling-a-paymentrequestevent).


#### 6.3.2 `paymentRequestOrigin` attribute

[Permalink for Section 6.3.2](https://www.w3.org/TR/payment-handler/#paymentrequestorigin-attribute)

Returns a string that indicates the [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) where a
[PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) was initialized. When a [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest)
is initialized in the [`topOrigin`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-toporigin), the attributes have the
same value, otherwise the attributes have different values. For
example, when a [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) is initialized within an
iframe from an origin other than [`topOrigin`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-toporigin), the value of
this attribute is the origin of the iframe. This attribute is
initialized by [Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#dfn-handling-a-paymentrequestevent).


#### 6.3.3 `paymentRequestId` attribute

[Permalink for Section 6.3.3](https://www.w3.org/TR/payment-handler/#paymentrequestid-attribute)

When getting, the [`paymentRequestId`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-paymentrequestid) attribute returns the
[`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [id](https://www.w3.org/TR/payment-request/#id-attribute) from the [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) that
corresponds to this [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent).


#### 6.3.4 `methodData` attribute

[Permalink for Section 6.3.4](https://www.w3.org/TR/payment-handler/#methoddata-attribute)

This attribute contains [PaymentMethodData](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary) dictionaries
containing the [payment method identifiers](https://www.w3.org/TR/payment-method-id/#dfn-pmi) for the [payment\\
methods](https://www.w3.org/TR/payment-request/#dfn-payment-method) that the web site accepts and any associated [payment\\
method](https://www.w3.org/TR/payment-request/#dfn-payment-method) specific data. It is populated from the
[PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) using the [MethodData Population\\
Algorithm](https://www.w3.org/TR/payment-handler/#dfn-methoddata-population-algorithm) defined below.


#### 6.3.5 `total` attribute

[Permalink for Section 6.3.5](https://www.w3.org/TR/payment-handler/#total-attribute)

This attribute indicates the total amount being requested for
payment. It is of type [PaymentCurrencyAmount](https://www.w3.org/TR/payment-request/#paymentcurrencyamount-dictionary) dictionary as
defined in \[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\], and initialized with a copy of the
[`total`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-total) field of the [PaymentDetailsInit](https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary) provided when
the corresponding [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object was instantiated.


#### 6.3.6 `modifiers` attribute

[Permalink for Section 6.3.6](https://www.w3.org/TR/payment-handler/#modifiers-attribute)

This sequence of [PaymentDetailsModifier](https://www.w3.org/TR/payment-request/#paymentdetailsmodifier-dictionary) dictionaries
contains modifiers for particular payment method identifiers (e.g.,
if the payment amount or currency type varies based on a
per-payment-method basis). It is populated from the
[PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) using the [Modifiers Population\\
Algorithm](https://www.w3.org/TR/payment-handler/#dfn-modifiers-population-algorithm) defined below.


#### 6.3.7 `paymentOptions` attribute

[Permalink for Section 6.3.7](https://www.w3.org/TR/payment-handler/#paymentoptions-attribute)

The value of [PaymentOptions](https://www.w3.org/TR/payment-request/#dom-paymentoptions) in the
[PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest). Available only when shippingAddress and/or
any subset of payer's contact information are requested.


#### 6.3.8 `shippingOptions` attribute

[Permalink for Section 6.3.8](https://www.w3.org/TR/payment-handler/#shippingoptions-attribute)

The value of [ShippingOptions](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions)
in the [PaymentDetailsInit](https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary) dictionary of the corresponding
[PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest).( [PaymentDetailsInit](https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary) inherits
ShippingOptions from [PaymentDetailsBase](https://www.w3.org/TR/payment-request/#paymentdetailsbase-dictionary)). Available only
when shipping address is requested.


#### 6.3.9 `openWindow()` method

[Permalink for Section 6.3.9](https://www.w3.org/TR/payment-handler/#openwindow-method)

This method is used by the payment handler to show a window to the
user. When called, it runs the [open window algorithm](https://www.w3.org/TR/payment-handler/#dfn-open-window-algorithm).


#### 6.3.10 `changePaymentMethod()`  method

[Permalink for Section 6.3.10](https://www.w3.org/TR/payment-handler/#changepaymentmethod-method)

This method is used by the payment handler to get updated total
given such payment method details as the billing address. When
called, it runs the [change payment method algorithm](https://www.w3.org/TR/payment-handler/#dfn-change-payment-method-algorithm).


#### 6.3.11 `changeShippingAddress()`  method

[Permalink for Section 6.3.11](https://www.w3.org/TR/payment-handler/#changeshippingaddress-method)

This method is used by the payment handler to get updated payment
details given the shippingAddress. When called, it runs the
[change payment details algorithm](https://www.w3.org/TR/payment-handler/#dfn-change-payment-details-algorithm).


#### 6.3.12 `changeShippingOption()`  method

[Permalink for Section 6.3.12](https://www.w3.org/TR/payment-handler/#changeshippingoption-method)

This method is used by the payment handler to get updated payment
details given the shippingOption identifier. When called, it runs
the [change payment details algorithm](https://www.w3.org/TR/payment-handler/#dfn-change-payment-details-algorithm).


#### 6.3.13 `respondWith()` method

[Permalink for Section 6.3.13](https://www.w3.org/TR/payment-handler/#respondwith-method-0)

This method is used by the payment handler to provide a
[`PaymentHandlerResponse`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse) when the payment successfully
completes. When called, it runs the [Respond to PaymentRequest\\
Algorithm](https://www.w3.org/TR/payment-handler/#dfn-respond-to-paymentrequest-algorithm) with event and handlerResponsePromise as
arguments.


[Issue 123](https://github.com/w3c/payment-handler/issues/123): Share user data with payment app?

Should payment apps receive user data stored in the user agent upon
explicit consent from the user? The payment app could request
permission either at installation or when the payment app is first
invoked.


#### 6.3.14 `PaymentRequestEventInit` dictionary

[Permalink for Section 6.3.14](https://www.w3.org/TR/payment-handler/#paymentrequesteventinit-dictionary)

```
WebIDLdictionary PaymentRequestEventInit : ExtendableEventInit {
  USVString topOrigin;
  USVString paymentRequestOrigin;
  DOMString paymentRequestId;
  sequence<PaymentMethodData> methodData;
  PaymentCurrencyAmount total;
  sequence<PaymentDetailsModifier> modifiers;
  PaymentOptions paymentOptions;
  sequence<PaymentShippingOption> shippingOptions;
};
```

The `topOrigin`, `paymentRequestOrigin`,
`paymentRequestId`, `methodData`,
`total`, `modifiers`, `paymentOptions`,
and `shippingOptions` members share their definitions with
those defined for [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent)

#### 6.3.15 MethodData Population Algorithm

[Permalink for Section 6.3.15](https://www.w3.org/TR/payment-handler/#methoddata-population-algorithm)

To initialize the value of the [`methodData`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-methoddata), the user agent
_MUST_ perform the following steps or their equivalent:


1. Let registeredMethods be the set of registered
    [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) s of the invoked payment handler.

2. Create a new empty [Sequence](https://webidl.spec.whatwg.org/#idl-sequence).

3. Set dataList to the newly created [Sequence](https://webidl.spec.whatwg.org/#idl-sequence).

4. For each item in
    [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest)@\[\[methodData\]\] in the
    corresponding payment request, perform the following steps:
    1. Set inData to the item under consideration.

   2. Set commonMethods to the set intersection of
       inData. [supportedMethods](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods) and
       registeredMethods.

   3. If commonMethods is empty, skip the remaining
       substeps and move on to the next item (if any).

   4. Create a new [PaymentMethodData](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary) object.

   5. Set outData to the newly created
       [PaymentMethodData](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary).

   6. Set outData. [supportedMethods](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods) to a list
       containing the members of commonMethods.

   7. Set outData.data to a copy of
       inData.data.

   8. Append outData to dataList.
5. Set [`methodData`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-methoddata) to dataList.


#### 6.3.16 Modifiers Population Algorithm

[Permalink for Section 6.3.16](https://www.w3.org/TR/payment-handler/#modifiers-population-algorithm)

To initialize the value of the [`modifiers`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-modifiers), the user agent
_MUST_ perform the following steps or their equivalent:


1. Let registeredMethods be the set of registered
    [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) s of the invoked payment handler.

2. Create a new empty [Sequence](https://webidl.spec.whatwg.org/#idl-sequence).

3. Set modifierList to the newly created
    [Sequence](https://webidl.spec.whatwg.org/#idl-sequence).

4. For each item in
    [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest)@\[\[paymentDetails\]\]. [`modifiers`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-modifiers)
    in the corresponding payment request, perform the following steps:
    1. Set inModifier to the item under consideration.

   2. Set commonMethods to the set intersection of
       inModifier. [supportedMethods](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods) and
       registeredMethods.

   3. If commonMethods is empty, skip the remaining
       substeps and move on to the next item (if any).

   4. Create a new [PaymentDetailsModifier](https://www.w3.org/TR/payment-request/#paymentdetailsmodifier-dictionary) object.

   5. Set outModifier to the newly created
       [PaymentDetailsModifier](https://www.w3.org/TR/payment-request/#paymentdetailsmodifier-dictionary).

   6. Set outModifier. [supportedMethods](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods) to a
       list containing the members of commonMethods.

   7. Set outModifier. [`total`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-total) to a copy of
       inModifier. [`total`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-total).

   8. Append outModifier to modifierList.
5. Set [`modifiers`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-modifiers) to modifierList.


### 6.4   Internal Slots

[Permalink for Section 6.4](https://www.w3.org/TR/payment-handler/#internal-slots)

Instances of [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) are created with the internal
slots in the following table:


| Internal Slot | Default Value | Description ( _non-normative_) |
| --- | --- | --- |
| \[\[windowClient\]\] | null | The currently active WindowClient. This is set if a<br> payment handler is currently showing a window to the user.<br> Otherwise, it is null. |
| \[\[respondWithCalled\]\] | false | YAHO |

### 6.5 Handling a PaymentRequestEvent

[Permalink for Section 6.5](https://www.w3.org/TR/payment-handler/#handling-a-paymentrequestevent)

Upon receiving a [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) by way of [PaymentRequest.show()](https://www.w3.org/TR/payment-request/#show-method) and
subsequent user selection of a payment handler, the [user agent](https://www.w3.org/TR/payment-handler/#dfn-user-agents) _MUST_ run the following steps:


1. Let registration be the [`ServiceWorkerRegistration`](https://www.w3.org/TR/service-workers/#service-worker-registration-concept)
    corresponding to the payment handler selected by the user.

2. If registration is not found, reject the [`Promise`](https://webidl.spec.whatwg.org/#idl-promise)
    that was created by [PaymentRequest.show()](https://www.w3.org/TR/payment-request/#show-method) with an
    " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException) and terminate these steps.

3. [Fire Functional Event](https://www.w3.org/TR/service-workers/#fire-functional-event-algorithm) " `paymentrequest`" using
    [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) on registration with the
    following properties:

   [`topOrigin`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-toporigin)
    the [serialization of an origin](https://html.spec.whatwg.org/multipage/browsers.html#ascii-serialisation-of-an-origin) of the top level payee web
    page.
    [`paymentRequestOrigin`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-paymentrequestorigin)
    the [serialization of an origin](https://html.spec.whatwg.org/multipage/browsers.html#ascii-serialisation-of-an-origin) of the context where
    PaymentRequest was initialized.
    [`methodData`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-methoddata)
    The result of executing the [MethodData Population\\
    Algorithm](https://www.w3.org/TR/payment-handler/#dfn-methoddata-population-algorithm).
    [`modifiers`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-modifiers)
    The result of executing the [Modifiers Population\\
    Algorithm](https://www.w3.org/TR/payment-handler/#dfn-modifiers-population-algorithm).
    [`total`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-total)
    A copy of the total field on the [PaymentDetailsInit](https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary) from
    the corresponding [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest).
    [`paymentRequestId`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-paymentrequestid)
    \\\[\\\[details\\\]\\\]. [id](https://www.w3.org/TR/payment-request/#id-attribute) from the [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest).
    [`paymentOptions`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-paymentoptions)
    A copy of the paymentOptions dictionary passed to the
    constructor of the corresponding [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest).
    [`shippingOptions`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-shippingoptions)
    A copy of the shippingOptions field on the
    [PaymentDetailsInit](https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary) from the corresponding
    [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest).


    Then run the following steps in parallel, with
    dispatchedEvent:

   1. Wait for all of the promises in the [extend lifetime\\
       promises](https://www.w3.org/TR/service-workers/#extendableevent-extend-lifetime-promises) of dispatchedEvent to resolve.

   2. If the [payment handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) has not provided a
       [`PaymentHandlerResponse`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse), reject the [`Promise`](https://webidl.spec.whatwg.org/#idl-promise) that was
       created by [PaymentRequest.show()](https://www.w3.org/TR/payment-request/#show-method) with an
       " [`OperationError`](https://webidl.spec.whatwg.org/#operationerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

## 7\. Windows

[Permalink for Section 7.](https://www.w3.org/TR/payment-handler/#windows)

An invoked payment handler may or may not need to display information
about itself or request user input. Some examples of potential payment
handler display include:


- The payment handler opens a window for the user to provide an
   authorization code.

- The payment handler opens a window that makes it easy for the user
   to confirm payment using default information for that site provided
   through previous user configuration.

- When first selected to pay in a given session, the payment handler
   opens a window. For subsequent payments in the same session, the
   payment handler (through configuration) performs its duties without
   opening a window or requiring user interaction.


A [payment handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) that requires visual display and user
interaction, may call openWindow() to display a page to the user.


Note

Since user agents know that this method is connected to the
[`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent), they _SHOULD_ render the window in a way that is
consistent with the flow and not confusing to the user. The resulting
window client is bound to the tab/window that initiated the
[PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest). A single [payment handler](https://www.w3.org/TR/payment-handler/#dfn-payment-handler) _SHOULD NOT_ be
allowed to open more than one client window using this method.


### 7.1 Open Window Algorithm

[Permalink for Section 7.1](https://www.w3.org/TR/payment-handler/#open-window-algorithm)

[Issue 115](https://github.com/w3c/payment-handler/issues/115): The Open Window Algorithm

This algorithm resembles the [Open Window Algorithm](https://www.w3.org/TR/payment-handler/#dfn-open-window-algorithm) in the
Service Workers specification.


[Issue 115](https://github.com/w3c/payment-handler/issues/115): Open Window Algorithm

Should we refer to the Service Workers specification instead of
copying their steps?


01. Let event be this [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent).

02. If event's [`isTrusted`](https://dom.spec.whatwg.org/#dom-event-istrusted) attribute is false, return a
     [`Promise`](https://webidl.spec.whatwg.org/#idl-promise) rejected with a " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

03. Let request be the [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest) that
     triggered this [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent).

04. Let url be the result of [parsing](https://url.spec.whatwg.org/#concept-url-parser) the url argument.

05. If the url parsing throws an exception, return a [`Promise`](https://webidl.spec.whatwg.org/#idl-promise)
     rejected with that exception.

06. If url is `about:blank`, return a
     [`Promise`](https://webidl.spec.whatwg.org/#idl-promise) rejected with a [`TypeError`](https://webidl.spec.whatwg.org/#exceptiondef-typeerror).

07. If url's origin is not the same as the [service\\
     worker](https://www.w3.org/TR/service-workers/#service-worker-concept)'s origin associated with the payment handler, return a
     [`Promise`](https://webidl.spec.whatwg.org/#idl-promise) resolved with null.

08. Let promise be a new [`Promise`](https://webidl.spec.whatwg.org/#idl-promise).

09. Return promise and perform the remaining steps in
     parallel:

10. If event. [`[[windowClient]]`](https://www.w3.org/TR/payment-handler/#dfn-windowclient) is not null, then:

    1. If event. [`[[windowClient]]`](https://www.w3.org/TR/payment-handler/#dfn-windowclient). [visibilityState](https://www.w3.org/TR/service-workers/#client-visibilitystate)
        is not "unloaded", reject promise with an
        " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException) and abort these steps.
11. Let newContext be a new [top-level browsing\\
     context](https://html.spec.whatwg.org/multipage/document-sequences.html#top-level-browsing-context).

12. [Navigate](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigate) newContext to url, with
     exceptions enabled and replacement enabled.

13. If the navigation throws an exception, reject promise
     with that exception and abort these steps.

14. If the origin of newContext is not the same as the [service worker client](https://www.w3.org/TR/service-workers/#dfn-service-worker-client) origin associated with the payment
     handler, then:

    1. Resolve promise with null.

    2. Abort these steps.
15. Let client be the result of running the
     [create\\
     window client](https://www.w3.org/TR/service-workers/#create-windowclient-algorithm) algorithm with newContext as the
     argument.

16. Set event. [`[[windowClient]]`](https://www.w3.org/TR/payment-handler/#dfn-windowclient) to client.

17. Resolve promise with client.


### 7.2   Example of handling the [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/\#dom-paymentrequestevent)

[Permalink for Section 7.2](https://www.w3.org/TR/payment-handler/#post-example)

_This section is non-normative._

This example shows how to write a service worker that listens to the
[`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent). When a [`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) is received,
the service worker opens a window to interact with the user.


[Example 2](https://www.w3.org/TR/payment-handler/#example-handling-the-paymentrequestevent): Handling the PaymentRequestEvent

```hljs js
async function getPaymentResponseFromWindow() {
  return new Promise((resolve, reject) => {
    self.addEventListener("message", listener = e => {
      self.removeEventListener("message", listener);
      if (!e.data || !e.data.methodName) {
        reject();
        return;
      }
      resolve(e.data);
    });
  });
}

self.addEventListener("paymentrequest", e => {
  e.respondWith((async() => {
    // Open a new window for providing payment UI to user.
    const windowClient = await e.openWindow("payment_ui.html");

    // Send data to the opened window.
    windowClient.postMessage({
      total: e.total,
      modifiers: e.modifiers
    });

    // Wait for a payment response from the opened window.
    return await getPaymentResponseFromWindow();
  })());
});
```

Using the simple scheme described above, a trivial HTML page that is
loaded into the [payment handler window](https://www.w3.org/TR/payment-handler/#dfn-payment-handler-window) might look like the
following:


[Example 3](https://www.w3.org/TR/payment-handler/#example-simple-payment-handler-window): Simple Payment Handler Window

```hljs html
<form id="form">
<table>
  <tr><th>Cardholder Name:</th><td><input name="cardholderName"></td></tr>
  <tr><th>Card Number:</th><td><input name="cardNumber"></td></tr>
  <tr><th>Expiration Month:</th><td><input name="expiryMonth"></td></tr>
  <tr><th>Expiration Year:</th><td><input name="expiryYear"></td></tr>
  <tr><th>Security Code:</th><td><input name="cardSecurityCode"></td></tr>
  <tr><th></th><td><input type="submit" value="Pay"></td></tr>
</table>
</form>

<script>
navigator.serviceWorker.addEventListener("message", e => {
  /* Note: message sent from payment app is available in e.data */
});

document.getElementById("form").addEventListener("submit", e => {
  const details = {};
  ["cardholderName", "cardNumber", "expiryMonth", "expiryYear", "cardSecurityCode"]
  .forEach(field => {
    details[field] = form.elements[field].value;
  });

  const paymentAppResponse = {
    methodName: "https://example.com/pay",
    details
  };

  navigator.serviceWorker.controller.postMessage(paymentAppResponse);
  window.close();
});
</script>
```

## 8\.   Response

[Permalink for Section 8.](https://www.w3.org/TR/payment-handler/#response)

### 8.1 `PaymentHandlerResponse` dictionary

[Permalink for Section 8.1](https://www.w3.org/TR/payment-handler/#paymenthandlerresponse-dictionary)

 The PaymentHandlerResponse is conveyed using the following
 dictionary:


```
WebIDLdictionary PaymentHandlerResponse {
DOMString methodName;
object details;
DOMString? payerName;
DOMString? payerEmail;
DOMString? payerPhone;
AddressInit shippingAddress;
DOMString? shippingOption;
};
```

#### 8.1.1 `methodName` attribute

[Permalink for Section 8.1.1](https://www.w3.org/TR/payment-handler/#methodname-attribute)

The [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) for the [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method)
that the user selected to fulfil the transaction.


#### 8.1.2 `details` attribute

[Permalink for Section 8.1.2](https://www.w3.org/TR/payment-handler/#details-attribute)

A [JSON-serializable](https://www.w3.org/TR/payment-request/#dfn-json-serialize) object that provides a [payment\\
method](https://www.w3.org/TR/payment-request/#dfn-payment-method) specific message used by the merchant to process the
transaction and determine successful fund transfer.


The user agent receives a successful response from the payment
handler through resolution of the Promise provided to the
[`respondWith`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-respondwith) function of the corresponding
[`PaymentRequestEvent`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) interface. The application is expected to
resolve the Promise with a [`PaymentHandlerResponse`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse) instance
containing the payment response. In case of user cancellation or
error, the application may signal failure by rejecting the Promise.


If the Promise is rejected, the user agent _MUST_ run the
payment app failure algorithm. The exact details of this
algorithm are left to implementers. Acceptable behaviors include,
but are not limited to:


- Letting the user try again, with the same payment handler or
   with a different one.

- Rejecting the Promise that was created by [PaymentRequest.show()](https://www.w3.org/TR/payment-request/#show-method).


#### 8.1.3 `payerName` attribute

[Permalink for Section 8.1.3](https://www.w3.org/TR/payment-handler/#payername-attribute)

The user provided payer's name.


#### 8.1.4 `payerEmail` attribute

[Permalink for Section 8.1.4](https://www.w3.org/TR/payment-handler/#payeremail-attribute)

The user provided payer's email.


#### 8.1.5 `payerPhone` attribute

[Permalink for Section 8.1.5](https://www.w3.org/TR/payment-handler/#payerphone-attribute)

The user provided payer's phone number.


#### 8.1.6 `shippingAddress` attribute

[Permalink for Section 8.1.6](https://www.w3.org/TR/payment-handler/#shippingaddress-attribute)

The user provided shipping address.


#### 8.1.7 `shippingOption` attribute

[Permalink for Section 8.1.7](https://www.w3.org/TR/payment-handler/#shippingoption-attribute)

The identifier of the user selected shipping option.


### 8.2 Change Payment Method Algorithm

[Permalink for Section 8.2](https://www.w3.org/TR/payment-handler/#change-payment-method-algorithm)

When this algorithm is invoked with methodName and
methodDetails parameters, the user agent _MUST_ run the
following steps:


1. Run the [payment method changed algorithm](https://www.w3.org/TR/payment-request/#payment-method-changed-algorithm) with
    [PaymentMethodChangeEvent](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent) event constructed using the given
    methodName and methodDetails parameters.

2. If event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method) is not run, return
    `null`.

3. If event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method) throws, rethrow the
    error.

4. If event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method) times out
    (optional), throw " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

5. Construct and return a [`PaymentRequestDetailsUpdate`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate) from
    the detailsPromise in
    event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method).


### 8.3 Change Payment Details Algorithm

[Permalink for Section 8.3](https://www.w3.org/TR/payment-handler/#change-payment-details-algorithm)

When this algorithm is invoked with shippingAddress or
shippingOption the user agent _MUST_ run the following
steps:


1. Run the [PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#paymentrequest-updated-algorithm) with
    [PaymentRequestUpdateEvent](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) event constructed using the
    updated details (shippingAddress or
    shippingOption).

2. If event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method) is not run, return
    `null`.

3. If event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method) throws, rethrow the
    error.

4. If event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method) times out
    (optional), throw " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

5. Construct and return a [`PaymentRequestDetailsUpdate`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate) from
    the detailsPromise in
    event. [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method).


### 8.4 Respond to PaymentRequest Algorithm

[Permalink for Section 8.4](https://www.w3.org/TR/payment-handler/#respond-to-paymentrequest-algorithm)

When this algorithm is invoked with event and
handlerResponsePromise parameters, the user agent _MUST_ run
the following steps:


01. If event's [`isTrusted`](https://dom.spec.whatwg.org/#dom-event-istrusted) is false, then throw an
     "InvalidStateError" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException) and abort these steps.

02. If event's [dispatch flag](https://dom.spec.whatwg.org/#dispatch-flag) is unset, then throw an
     " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException) and abort these steps.

03. If event. [`[[respondWithCalled]]`](https://www.w3.org/TR/payment-handler/#dfn-respondwithcalled) is true, throw an
     " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException) and abort these steps.

04. Set event. [`[[respondWithCalled]]`](https://www.w3.org/TR/payment-handler/#dfn-respondwithcalled) to true.

05. Set the event's [stop propagation flag](https://dom.spec.whatwg.org/#stop-propagation-flag) and
     event's [stop immediate propagation flag](https://dom.spec.whatwg.org/#stop-immediate-propagation-flag).

06. Add handlerResponsePromise to the event's [extend\\
     lifetime promises](https://www.w3.org/TR/service-workers/#extendableevent-extend-lifetime-promises)
07. Increment the event's [pending promises count](https://www.w3.org/TR/service-workers/#extendableevent-pending-promises-count) by one.

08. [Upon rejection](https://webidl.spec.whatwg.org/#upon-rejection) of handlerResponsePromise:
     1. Run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and terminate
        these steps.
09. [Upon fulfillment](https://webidl.spec.whatwg.org/#upon-fulfillment) of handlerResponsePromise:
     1. Let handlerResponse be value [converted to an\\
        IDL value](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) [`PaymentHandlerResponse`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse). If this throws an
        exception, run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and
        terminate these steps.

    2. Validate that all required members exist in
        handlerResponse and are well formed.
        1. If handlerResponse. [`methodName`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-methodname) is not
           present or not set to one of the values from
           event. [`methodData`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-methoddata), run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and terminate these
           steps.

       2. If handlerResponse. [`details`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-details) is not present
           or not [JSON-serializable](https://www.w3.org/TR/payment-request/#dfn-json-serialize), run the [payment app\\
           failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and terminate these steps.

       3. Let shippingRequired be the [requestShipping](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping)
           value of the associated PaymentRequest's
           [paymentOptions](https://www.w3.org/TR/payment-request/#dom-paymentoptions). If shippingRequired and
           handlerResponse. [`shippingAddress`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-shippingaddress)
           is not present, run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm)
           and terminate these steps.

       4. If shippingRequired and
           handlerResponse. [`shippingOption`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-shippingoption) is
           not present or not set to one of shipping options identifiers
           from event. [`shippingOptions`](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-shippingoptions),
           run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and terminate
           these steps.

       5. Let payerNameRequired be the [requestPayerName](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayername)
           value of the associated PaymentRequest's
           [paymentOptions](https://www.w3.org/TR/payment-request/#dom-paymentoptions). If payerNameRequired and
           handlerResponse. [`payerName`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-payername) is not
           present, run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and
           terminate these steps.

       6. Let payerEmailRequired be the [requestPayerEmail](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayeremail)
           value of the associated PaymentRequest's
           [paymentOptions](https://www.w3.org/TR/payment-request/#dom-paymentoptions). If payerEmailRequired and
           handlerResponse. [`payerEmail`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-payeremail) is not
           present, run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and
           terminate these steps.

       7. Let payerPhoneRequired be the [requestPayerPhone](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayerphone)
           value of the associated PaymentRequest's
           [paymentOptions](https://www.w3.org/TR/payment-request/#dom-paymentoptions). If payerPhoneRequired and
           handlerResponse. [`payerPhone`](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-payerphone) is not
           present, run the [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and
           terminate these steps.
    3. Serialize required members of handlerResponse (
        methodName and details are always required;
        shippingAddress and shippingOption are
        required when shippingRequired is true;
        payerName, payerEmail, and
        payerPhone are required when
        payerNameRequired, payerEmailRequired, and
        payerPhoneRequired are true, respectively.):

       1. For each memberin
           handlerResponseLet serializeMemberbe
           the result of [StructuredSerialize](https://html.spec.whatwg.org/multipage/#structuredserialize) with
           handlerResponse.member. Rethrow any
           exceptions.
    4. The user agent _MUST_ run the [user accepts the payment\\
        request algorithm](https://www.w3.org/TR/payment-request/#user-accepts-the-payment-request-algorithm) as defined in \[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\],
        replacing steps 9-15 with these steps or their equivalent.

       1. Deserialize serialized members:
          1. For each serializeMemberlet
              memberbe the result of [StructuredDeserialize](https://html.spec.whatwg.org/multipage/#structureddeserialize) with
              serializeMember. Rethrow any exceptions.
       2. If any exception occurs in the above step, then run the
           [payment app failure algorithm](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm) and terminate these
           steps.

       3. Assign methodName to associated
           PaymentRequest's [response](https://www.w3.org/TR/payment-request/#dom-paymentresponse). [methodName](https://www.w3.org/TR/payment-request/#dom-paymentresponse-methodname).

       4. Assign details to associated PaymentReqeust's
           [response](https://www.w3.org/TR/payment-request/#dom-paymentresponse). [details](https://www.w3.org/TR/payment-request/#dom-paymentresponse-details).

       5. If shippingRequired, then set the
           [shippingAddress](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingaddress) attribute of associated
           PaymentReqeust's [response](https://www.w3.org/TR/payment-request/#dom-paymentresponse) to
           shippingAddress. Otherwise, set it to null.

       6. If shippingRequired, then set the
           [shippingOption](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingoption) attribute of associated PaymentReqeust's
           [response](https://www.w3.org/TR/payment-request/#dom-paymentresponse) to
           shippingOption. Otherwise, set it to null.

       7. If payerNameRequired, then set the
           [payerName](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payername) attribute of associated PaymentReqeust's
           [response](https://www.w3.org/TR/payment-request/#dom-paymentresponse) to
           payerName. Otherwise, set it to null.

       8. If payerEmailRequired, then set the
           [payerEmail](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payeremail)
           attribute of associated PaymentReqeust's [response](https://www.w3.org/TR/payment-request/#dom-paymentresponse) to
           payerEmail. Otherwise, set it to null.

       9. If payerPhoneRequired, then set the
           [payerPhone](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payerphone)
           attribute of associated PaymentReqeust's [response](https://www.w3.org/TR/payment-request/#dom-paymentresponse) to
           payerPhone. Otherwise, set it to null.
10. [Upon fulfillment](https://webidl.spec.whatwg.org/#upon-fulfillment) or [upon rejection](https://webidl.spec.whatwg.org/#upon-rejection) of
     handlerResponsePromise, [queue a microtask](https://html.spec.whatwg.org/multipage/#queue-a-microtask) to perform the
     following steps:
     1. Decrement the event's [pending promises count](https://www.w3.org/TR/service-workers/#extendableevent-pending-promises-count) by one.

    2. Let registration be the [this](https://webidl.spec.whatwg.org/#this)'s [relevant\\
        global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global)'s associated [service worker](https://www.w3.org/TR/service-workers/#service-worker-concept)'s
        [containing service worker registration](https://www.w3.org/TR/service-workers/#dfn-containing-service-worker-registration).

    3. If registration is not null, invoke [Try\\
        Activate](https://www.w3.org/TR/service-workers/#try-activate-algorithm) with registration.

The following example shows how to respond to a payment request:


[Example 4](https://www.w3.org/TR/payment-handler/#example-sending-a-payment-response): Sending a Payment Response

```hljs js
paymentRequestEvent.respondWith(new Promise(function(accept,reject) {
  /* ... processing may occur here ... */
  accept({
    methodName: "https://example.com/pay",
    details: {
      cardHolderName:   "John Smith",
      cardNumber:       "1232343451234",
      expiryMonth:      "12",
      expiryYear :      "2020",
      cardSecurityCode: "123"
     },
    shippingAddress: {
      addressLine: [\
        "1875 Explorer St #1000",\
      ],
      city: "Reston",
      country: "US",
      dependentLocality: "",
      organization: "",
      phone: "+15555555555",
      postalCode: "20190",
      recipient: "John Smith",
      region: "VA",
      sortingCode: ""
    },
    shippingOption: "express",
    payerEmail: "john.smith@gmail.com",
  });
}));
```

Note

\[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\] defines an [ID](https://www.w3.org/TR/payment-request/#id-attribute) that parties in the
ecosystem (including payment app providers and payees) can use for
reconciliation after network or other failures.


## 9\.   Security and Privacy Considerations

[Permalink for Section 9.](https://www.w3.org/TR/payment-handler/#security)

### 9.1 Addresses

[Permalink for Section 9.1](https://www.w3.org/TR/payment-handler/#addresses)

The Web Payments Working Group removed support for shipping and
billing addresses from the original version of Payment Request API due
to privacy issues; see [issue\\
842](https://github.com/w3c/payment-request/issues/842). In order to provide documentation for implementations that
continue to support this capability, the Working Group is now
restoring the feature with an expectation of addressing privacy
issues. In doing so the Working Group may also make changes to Payment
Request API based on the evolution of other APIs (e.g., the Content
Picker API).


### 9.2   Information about the User Environment

[Permalink for Section 9.2](https://www.w3.org/TR/payment-handler/#information-about-the-user-environment)

- The API does not share information about the user's registered
   payment handlers. Information from origins is only shared with the
   payee with the consent of the user.

- User agents should not share payment request information with any
   payment handler until the user has selected that payment handler.

- In a browser that supports Payment Handler API, when a merchant
   creates a PaymentRequest object with URL-based payment method
   identifiers, a [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) will fire in registered
   payment handlers from a finite set of origins: the origins of the
   payment method manifests and their [supported origins](https://www.w3.org/TR/payment-method-manifest/#parsed-payment-method-manifest-supported-origins). This
   event is fired before the user has selected that payment handler,
   but it contains no information about the triggering origin (i.e.,
   the merchant website) and so cannot be used to track users directly.

- We acknowledge the risk of a timing attack via
   [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent):
   - A merchant website sends notice via a backend channel (e.g., the
     fetch API) to a payment handler origin, sharing that they are about
     to construct a PaymentRequest object.
  - The merchant website then constructs the PaymentRequest,
     triggering a [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) to be fired at the installed
     payment handler.
  - That payment handler contacts its own origin, and on the server
     side attempts to join the two requests.
- User agents should allow users to disable support for the
   [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent).

- In a browser that supports Payment Handler API,
   [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) will fire in registered payment handlers
   that can provide all merchant requested information including
   shipping address and payer's contact information whenever needed.


### 9.3   User Consent to Install a Payment Handler

[Permalink for Section 9.3](https://www.w3.org/TR/payment-handler/#user-consent-to-install)

- This specification does not define how the user agent establishes
   user consent when a payment handler is first registered. The user
   agent might notify and/or prompt the user during registration.

- User agents _MAY_ reject payment handler registration for security
   reasons (e.g., due to an invalid SSL certificate) and _SHOULD_ notify
   the user when this happens.


### 9.4   User Consent before Payment

[Permalink for Section 9.4](https://www.w3.org/TR/payment-handler/#user-consent-before-payment)

- One goal of this specification is to minimize the user
   interaction required to make a payment. However, we also want to
   ensure that the user has an opportunity to consent to making a
   payment. Because payment handlers are not required to open a window
   for user interaction, user agents should take necessary steps to make
   sure the user (1) is made aware when a payment request is invoked,
   and (2) has an opportunity to interact with a payment handler before
   the merchant receives the response from that payment handler.


### 9.5   User Awareness about Sharing Data Cross-Origin

[Permalink for Section 9.5](https://www.w3.org/TR/payment-handler/#user-awareness-about-sharing-data-cross-origin)

- By design, a payment handler from one origin shares data with
   another origin (e.g., the merchant site).

- To mitigate phishing attacks, it is important that user agents
   make clear to users the origin of a payment handler.

- User agents should help users understand that they are sharing
   information cross-origin, and ideally what information they are
   sharing.


### 9.6   Secure Communications

[Permalink for Section 9.6](https://www.w3.org/TR/payment-handler/#secure-communications)

- See [Service Worker security\\
   considerations](https://www.w3.org/TR/service-workers/#security-considerations)
- Payment method security is outside the scope of this
   specification and is addressed by payment handlers that support those
   payment methods.


### 9.7   Authorized Payment Apps

[Permalink for Section 9.7](https://www.w3.org/TR/payment-handler/#authorized-payment-apps)

- The party responsible for a payment method authorizes payment
   apps through a [payment method manifest](https://www.w3.org/TR/payment-method-manifest/#payment-method-manifest). See the [Handling a\\
   CanMakePaymentEvent](https://www.w3.org/TR/payment-handler/#dfn-handling-a-canmakepaymentevent) algorithm for details.

- The user agent is not required to make available payment handlers
   that pose security issues. Security issues might include:


  - Certificates that are expired, revoked, self-signed, and so
     on.

  - Mixed content

  - Page available through HTTPs redirects to one that is not.

  - Payment handler is known from safe browsing database to be
     malicious


 When a payment handler is unavailable for security reasons, the
 user agent should provide rationale to the payment handler
 developers (e.g., through console messages) and may also inform
 the user to help avoid confusion.


### 9.8   Supported Origin

[Permalink for Section 9.8](https://www.w3.org/TR/payment-handler/#supported-origin)

- [Payment method manifests](https://www.w3.org/TR/payment-method-manifest/#payment-method-manifest) authorize origins to distribute
   payment apps for a given payment method. When the user agent is
   determining whether a payment handler matches the origin listed in
   a [payment method manifest](https://www.w3.org/TR/payment-method-manifest/#payment-method-manifest), the user agent uses the scope URL
   of the payment handler's [service worker registration](https://www.w3.org/TR/payment-handler/#dfn-service-worker-registration).


### 9.9   Data Validation

[Permalink for Section 9.9](https://www.w3.org/TR/payment-handler/#data-validation)

- To mitigate the scenario where a hijacked payee site submits
   fraudlent or malformed payment method data (or, for that matter,
   payment request data) to the payee's server, the payee's server
   should validate the data format and correlate the data with
   authoritative information on the server such as accepted payment
   methods, total, display items, and shipping address.


### 9.10   Private Browsing Mode

[Permalink for Section 9.10](https://www.w3.org/TR/payment-handler/#private-browsing-mode)

- When the Payment Request API is invoked in a "private browsing
   mode," the user agent should launch payment handlers in a private
   context. This will generally prevent sites from accessing any
   previously-stored information. In turn, this is likely to require
   either that the user log in to the origin or re-enter payment details.

- The [`CanMakePaymentEvent`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) event should not be fired in
   private browsing mode. The user agent should behave as if
   [`respondWith()`](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent-respondwith)
   was called with `false`. We acknowledge a consequent risk: if an
   entity controls both the origin of the Payment Request API call and
   the origin of the payment handler, that entity may be able to
   deduce that the user may be in private browsing mode.


## 10\.   Payment Handler Display Considerations

[Permalink for Section 10.](https://www.w3.org/TR/payment-handler/#display)

_This section is non-normative._

When ordering payment handlers, the user agent is expected to honor user
preferences over other preferences. User agents are expected to permit
manual configuration options, such as setting a preferred payment
handler display order for an origin, or for all origins.


User experience details are left to implementers.


## 11\.   Dependencies

[Permalink for Section 11.](https://www.w3.org/TR/payment-handler/#dependencies)

This specification relies on several other underlying specifications.


 Payment Request API

 The terms [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method),
 [PaymentRequest](https://www.w3.org/TR/payment-request/#dom-paymentrequest),
 [PaymentResponse](https://www.w3.org/TR/payment-request/#dom-paymentresponse),
 [supportedMethods](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods),
 [PaymentCurrencyAmount](https://www.w3.org/TR/payment-request/#paymentcurrencyamount-dictionary),
 [paymentDetailsModifier](https://www.w3.org/TR/payment-request/#paymentdetailsmodifier-dictionary),
 [paymentDetailsInit](https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary),
 [paymentDetailsBase](https://www.w3.org/TR/payment-request/#paymentdetailsbase-dictionary),
 [PaymentMethodData](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary),
 [PaymentOptions](https://www.w3.org/TR/payment-request/#dom-paymentoptions),
 [PaymentShippingOption](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption),
 [AddressInit](https://www.w3.org/TR/payment-request/#dom-addressinit),
 [AddressErrors](https://www.w3.org/TR/payment-request/#dom-addresserrors),
 [PaymentMethodChangeEvent](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent),
 [PaymentRequestUpdateEvent](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent),
 [ID](https://www.w3.org/TR/payment-request/#id-attribute),
 [canMakePayment()](https://www.w3.org/TR/payment-request/#canmakepayment-method),
 [show()](https://www.w3.org/TR/payment-request/#show-method),
 [updateWith(detailsPromise)](https://www.w3.org/TR/payment-request/#updatewith-method),
 [user\\
 accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#user-accepts-the-payment-request-algorithm), [payment method\\
 changed algorithm](https://www.w3.org/TR/payment-request/#payment-method-changed-algorithm), [PaymentRequest\\
 updated algorithm](https://www.w3.org/TR/payment-request/#paymentrequest-updated-algorithm), and [JSON-serializable](https://www.w3.org/TR/payment-request/#dfn-json-serialize) are
 defined by the Payment Request API specification
 \[[payment-request](https://www.w3.org/TR/payment-handler/#bib-payment-request "Payment Request API")\].

 ECMAScript

 The terms [internal\\
 slot](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) and `JSON.stringify` are
 defined by \[[ECMASCRIPT](https://www.w3.org/TR/payment-handler/#bib-ecmascript "ECMAScript Language Specification")\].

 Payment Method Manifest

 The terms [payment method\\
 manifest](https://www.w3.org/TR/payment-method-manifest/#payment-method-manifest), [ingest\\
 payment method manifest](https://www.w3.org/TR/payment-method-manifest/#ingest-payment-method-manifests), [parsed\\
 payment method manifest](https://www.w3.org/TR/payment-method-manifest/#parsed-payment-method-manifest), and [supported origins](https://www.w3.org/TR/payment-method-manifest/#parsed-payment-method-manifest-supported-origins) are defined by the Payment Method Manifest
 specification \[[payment-method-manifest](https://www.w3.org/TR/payment-handler/#bib-payment-method-manifest "Payment Method Manifest")\].

 Service Workers

 The terms [service worker](https://www.w3.org/TR/service-workers/#service-worker-concept),
 service worker registration,
 [service\\
 worker client](https://www.w3.org/TR/service-workers/#dfn-service-worker-client), `ServiceWorkerRegistration`,
 `ServiceWorkerGlobalScope`,
 [fire\\
 functional event](https://www.w3.org/TR/service-workers/#fire-functional-event-algorithm), [extend lifetime\\
 promises](https://www.w3.org/TR/service-workers/#extendableevent-extend-lifetime-promises),[pending promises\\
 count](https://www.w3.org/TR/service-workers/#extendableevent-pending-promises-count), [containing\\
 service worker registration](https://www.w3.org/TR/service-workers/#dfn-containing-service-worker-registration),
 [Try\\
 Clear Registration](https://www.w3.org/TR/service-workers/#try-clear-registration-algorithm), [Try Activate](https://www.w3.org/TR/service-workers/#try-activate-algorithm),
 [ExtendableEvent](https://www.w3.org/TR/service-workers/#extendableevent-interface),
 [ExtendableEventInit](https://www.w3.org/TR/service-workers/#dictdef-extendableeventinit),
 and [scope URL](https://www.w3.org/TR/service-workers/#dfn-scope-url)
 are defined in \[[SERVICE-WORKERS](https://www.w3.org/TR/payment-handler/#bib-service-workers "Service Workers")\].


## 12\. Conformance

[Permalink for Section 12.](https://www.w3.org/TR/payment-handler/#conformance)

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words _MAY_, _MUST_, _SHOULD_, and _SHOULD NOT_ in this document
are to be interpreted as described in
[BCP 14](https://datatracker.ietf.org/doc/html/bcp14)
\[[RFC2119](https://www.w3.org/TR/payment-handler/#bib-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")\] \[[RFC8174](https://www.w3.org/TR/payment-handler/#bib-rfc8174 "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words")\]
when, and only when, they appear in all capitals, as shown here.


There is only one class of product that can claim conformance to this
specification: a user agent.


User agents _MAY_ implement algorithms given in this specification in any
way desired, so long as the end result is indistinguishable from the
result that would be obtained by the specification's algorithms.


User agents _MAY_ impose implementation-specific limits on otherwise
unconstrained inputs, e.g., to prevent denial of service attacks, to
guard against running out of memory, or to work around
platform-specific limitations. When an input exceeds
implementation-specific limit, the user agent _MUST_ throw, or, in the
context of a promise, reject with, a [`TypeError`](https://webidl.spec.whatwg.org/#exceptiondef-typeerror) optionally informing
the developer of how a particular input exceeded an
implementation-specific limit.


## A. IDL Index

[Permalink for Appendix A.](https://www.w3.org/TR/payment-handler/#idl-index)

```
WebIDLpartial interface ServiceWorkerRegistration {
  [SameObject] readonly attribute PaymentManager paymentManager;
};

[SecureContext, Exposed=(Window)]
interface PaymentManager {
  attribute DOMString userHint;
  Promise<undefined> enableDelegations(sequence<PaymentDelegation> delegations);
};

enum PaymentDelegation {
  "shippingAddress",
  "payerName",
  "payerPhone",
  "payerEmail"
};

partial interface ServiceWorkerGlobalScope {
  attribute EventHandler oncanmakepayment;
};

[Exposed=ServiceWorker]
interface CanMakePaymentEvent : ExtendableEvent {
  constructor(DOMString type);
  undefined respondWith(Promise<boolean> canMakePaymentResponse);
};

partial interface ServiceWorkerGlobalScope {
  attribute EventHandler onpaymentrequest;
};

dictionary PaymentRequestDetailsUpdate {
  DOMString error;
  PaymentCurrencyAmount total;
  sequence<PaymentDetailsModifier> modifiers;
  sequence<PaymentShippingOption> shippingOptions;
  object paymentMethodErrors;
  AddressErrors shippingAddressErrors;
};

[Exposed=ServiceWorker]
interface PaymentRequestEvent : ExtendableEvent {
  constructor(DOMString type, optional PaymentRequestEventInit eventInitDict = {});
  readonly attribute USVString topOrigin;
  readonly attribute USVString paymentRequestOrigin;
  readonly attribute DOMString paymentRequestId;
  readonly attribute FrozenArray<PaymentMethodData> methodData;
  readonly attribute object total;
  readonly attribute FrozenArray<PaymentDetailsModifier> modifiers;
  readonly attribute object? paymentOptions;
  readonly attribute FrozenArray<PaymentShippingOption>? shippingOptions;
  Promise<WindowClient?> openWindow(USVString url);
  Promise<PaymentRequestDetailsUpdate?> changePaymentMethod(DOMString methodName, optional object? methodDetails = null);
  Promise<PaymentRequestDetailsUpdate?> changeShippingAddress(optional AddressInit shippingAddress = {});
  Promise<PaymentRequestDetailsUpdate?> changeShippingOption(DOMString shippingOption);
  undefined respondWith(Promise<PaymentHandlerResponse> handlerResponsePromise);
};

dictionary PaymentRequestEventInit : ExtendableEventInit {
  USVString topOrigin;
  USVString paymentRequestOrigin;
  DOMString paymentRequestId;
  sequence<PaymentMethodData> methodData;
  PaymentCurrencyAmount total;
  sequence<PaymentDetailsModifier> modifiers;
  PaymentOptions paymentOptions;
  sequence<PaymentShippingOption> shippingOptions;
};

dictionary PaymentHandlerResponse {
DOMString methodName;
object details;
DOMString? payerName;
DOMString? payerEmail;
DOMString? payerPhone;
AddressInit shippingAddress;
DOMString? shippingOption;
};
```

## B. References

[Permalink for Appendix B.](https://www.w3.org/TR/payment-handler/#references)

### B.1 Normative references

[Permalink for Appendix B.1](https://www.w3.org/TR/payment-handler/#normative-references)

\[dom\][DOM Standard](https://dom.spec.whatwg.org/). Anne van Kesteren. WHATWG. Living Standard. URL: [https://dom.spec.whatwg.org/](https://dom.spec.whatwg.org/)\[ECMASCRIPT\][ECMAScript Language Specification](https://tc39.es/ecma262/multipage/). Ecma International. URL: [https://tc39.es/ecma262/multipage/](https://tc39.es/ecma262/multipage/)\[HTML\][HTML Standard](https://html.spec.whatwg.org/multipage/). Anne van Kesteren; Domenic Denicola; Ian Hickson; Philip Jägenstedt; Simon Pieters. WHATWG. Living Standard. URL: [https://html.spec.whatwg.org/multipage/](https://html.spec.whatwg.org/multipage/)\[payment-method-id\][Payment Method Identifiers](https://www.w3.org/TR/payment-method-id/). Marcos Caceres. W3C. 8 September 2022. W3C Recommendation. URL: [https://www.w3.org/TR/payment-method-id/](https://www.w3.org/TR/payment-method-id/)\[payment-method-manifest\][Payment Method Manifest](https://www.w3.org/TR/payment-method-manifest/). Dapeng(Max) Liu; Domenic Denicola; Zach Koch. W3C. 12 December 2017. W3C Working Draft. URL: [https://www.w3.org/TR/payment-method-manifest/](https://www.w3.org/TR/payment-method-manifest/)\[payment-request\][Payment Request API](https://www.w3.org/TR/payment-request/). Marcos Caceres; Rouslan Solomakhin; Ian Jacobs. W3C. 8 September 2022. W3C Recommendation. URL: [https://www.w3.org/TR/payment-request/](https://www.w3.org/TR/payment-request/)\[RFC2119\][Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119). S. Bradner. IETF. March 1997. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc2119](https://www.rfc-editor.org/rfc/rfc2119)\[RFC8174\][Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://www.rfc-editor.org/rfc/rfc8174). B. Leiba. IETF. May 2017. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc8174](https://www.rfc-editor.org/rfc/rfc8174)\[SERVICE-WORKERS\][Service Workers](https://www.w3.org/TR/service-workers/). Jake Archibald; Marijn Kruisselbrink. W3C. 12 July 2022. W3C Candidate Recommendation. URL: [https://www.w3.org/TR/service-workers/](https://www.w3.org/TR/service-workers/)\[URL\][URL Standard](https://url.spec.whatwg.org/). Anne van Kesteren. WHATWG. Living Standard. URL: [https://url.spec.whatwg.org/](https://url.spec.whatwg.org/)\[WEBIDL\][Web IDL Standard](https://webidl.spec.whatwg.org/). Edgar Chen; Timothy Gu. WHATWG. Living Standard. URL: [https://webidl.spec.whatwg.org/](https://webidl.spec.whatwg.org/)

### B.2 Informative references

[Permalink for Appendix B.2](https://www.w3.org/TR/payment-handler/#informative-references)

\[WebCryptoAPI\][Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/). Mark Watson. W3C. 26 January 2017. W3C Recommendation. URL: [https://www.w3.org/TR/WebCryptoAPI/](https://www.w3.org/TR/WebCryptoAPI/)

[↑](https://www.w3.org/TR/payment-handler/#title)

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-payee)

**Referenced in:**

- [§ 2\. Overview](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payee-1 "§ 2. Overview")
- [§ 6.3.1 topOrigin attribute](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payee-2 "§ 6.3.1 topOrigin attribute")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-payer)

**Referenced in:**

- [§ 2\. Overview](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payer-1 "§ 2. Overview")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-payment-handler)

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-1 "§ 1. Introduction")
- [§ 2\. Overview](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-2 "§ 2. Overview") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-4 "Reference 3")
- [§ 4.2 PaymentManager interface](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-5 "§ 4.2 PaymentManager interface")
- [§ 4.2.2 enableDelegations() method](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-6 "§ 4.2.2 enableDelegations() method")
- [§ 5\. Can make payment](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-7 "§ 5. Can make payment")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-8 "§ 6.5 Handling a PaymentRequestEvent")
- [§ 7\. Windows](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-9 "§ 7. Windows") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-10 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-serviceworkerregistration-paymentmanager) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1742672635 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.1 Extension to the ServiceWorkerRegistration interface](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerregistration-paymentmanager-1 "§ 4.1 Extension to the ServiceWorkerRegistration interface")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerregistration-paymentmanager-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentmanager) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1708874582 "Jump to IDL declaration")

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-1 "§ 1. Introduction")
- [§ 4.1 Extension to the ServiceWorkerRegistration interface](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-2 "§ 4.1 Extension to the ServiceWorkerRegistration interface")
- [§ 4.2 PaymentManager interface](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-3 "§ 4.2 PaymentManager interface") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-4 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-5 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-6 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentmanager-userhint) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1708874582 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.2 PaymentManager interface](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-userhint-1 "§ 4.2 PaymentManager interface")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-userhint-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentmanager-enabledelegations) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1708874582 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.2 PaymentManager interface](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-enabledelegations-1 "§ 4.2 PaymentManager interface")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentmanager-enabledelegations-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentdelegation) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1015767474 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.2 PaymentManager interface](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-1 "§ 4.2 PaymentManager interface")
- [§ 4.2.2 enableDelegations() method](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-2 "§ 4.2.2 enableDelegations() method")
- [§ 4.3 PaymentDelegation enum](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-3 "§ 4.3 PaymentDelegation enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-4 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-5 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentdelegation-shippingaddress) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1015767474 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.3 PaymentDelegation enum](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-shippingaddress-1 "§ 4.3 PaymentDelegation enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-shippingaddress-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentdelegation-payername) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1015767474 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.3 PaymentDelegation enum](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-payername-1 "§ 4.3 PaymentDelegation enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-payername-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentdelegation-payerphone) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1015767474 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.3 PaymentDelegation enum](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-payerphone-1 "§ 4.3 PaymentDelegation enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-payerphone-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentdelegation-payeremail) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1015767474 "Jump to IDL declaration")

**Referenced in:**

- [§ 4.3 PaymentDelegation enum](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-payeremail-1 "§ 4.3 PaymentDelegation enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentdelegation-payeremail-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-serviceworkerglobalscope-oncanmakepayment) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1445944587 "Jump to IDL declaration")

**Referenced in:**

- [§ 5.1 Extension to ServiceWorkerGlobalScope](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerglobalscope-oncanmakepayment-1 "§ 5.1 Extension to ServiceWorkerGlobalScope")
- [§ 5.1.1 oncanmakepayment attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerglobalscope-oncanmakepayment-2 "§ 5.1.1 oncanmakepayment attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerglobalscope-oncanmakepayment-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-238602632 "Jump to IDL declaration")

**Referenced in:**

- [§ 5\. Can make payment](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-1 "§ 5. Can make payment") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-2 "Reference 2")
- [§ 5.2 The CanMakePaymentEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-3 "§ 5.2 The CanMakePaymentEvent") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-4 "Reference 2")
- [§ 5.3 Handling a CanMakePaymentEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-5 "§ 5.3 Handling a CanMakePaymentEvent") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-6 "Reference 2")
- [§ 5.4 Example of handling the CanMakePaymentEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-7 "§ 5.4 Example of handling the CanMakePaymentEvent") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-9 "Reference 3")
- [§ 5.5 Filtering of Payment Handlers](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-10 "§ 5.5 Filtering of Payment Handlers") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-11 "Reference 2")
- [§ 9.2 Information about the User Environment](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-12 "§ 9.2 Information about the User Environment") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-13 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-14 "Reference 3") [(4)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-15 "Reference 4") [(5)](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-16 "Reference 5")
- [§ 9.10 Private Browsing Mode](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-17 "§ 9.10 Private Browsing Mode")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-18 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent-constructor) exported

**Referenced in:**

- Not referenced in this document.

[Permalink](https://www.w3.org/TR/payment-handler/#dom-canmakepaymentevent-respondwith) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-238602632 "Jump to IDL declaration")

**Referenced in:**

- [§ 5\. Can make payment](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-respondwith-1 "§ 5. Can make payment")
- [§ 5.2 The CanMakePaymentEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-respondwith-2 "§ 5.2 The CanMakePaymentEvent")
- [§ 9.10 Private Browsing Mode](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-respondwith-3 "§ 9.10 Private Browsing Mode")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-canmakepaymentevent-respondwith-4 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-handling-a-canmakepaymentevent)

**Referenced in:**

- [§ 9.7 Authorized Payment Apps](https://www.w3.org/TR/payment-handler/#ref-for-dfn-handling-a-canmakepaymentevent-1 "§ 9.7 Authorized Payment Apps")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-serviceworkerglobalscope-onpaymentrequest) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-1119623754 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.1 Extension to ServiceWorkerGlobalScope](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerglobalscope-onpaymentrequest-1 "§ 6.1 Extension to ServiceWorkerGlobalScope")
- [§ 6.1.1 onpaymentrequest attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerglobalscope-onpaymentrequest-2 "§ 6.1.1 onpaymentrequest attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-serviceworkerglobalscope-onpaymentrequest-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-2024425618 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.2 The PaymentRequestDetailsUpdate](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-1 "§ 6.2 The PaymentRequestDetailsUpdate")
- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-2 "§ 6.3 The PaymentRequestEvent") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-4 "Reference 3")
- [§ 8.2 Change Payment Method Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-5 "§ 8.2 Change Payment Method Algorithm")
- [§ 8.3 Change Payment Details Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-6 "§ 8.3 Change Payment Details Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-7 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-9 "Reference 3") [(4)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-10 "Reference 4")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate-error) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-2024425618 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.2 The PaymentRequestDetailsUpdate](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-error-1 "§ 6.2 The PaymentRequestDetailsUpdate")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-error-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate-total) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-2024425618 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.2 The PaymentRequestDetailsUpdate](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-total-1 "§ 6.2 The PaymentRequestDetailsUpdate")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-total-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate-modifiers) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-2024425618 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.2 The PaymentRequestDetailsUpdate](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-modifiers-1 "§ 6.2 The PaymentRequestDetailsUpdate")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-modifiers-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate-shippingoptions) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-2024425618 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.2 The PaymentRequestDetailsUpdate](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-shippingoptions-1 "§ 6.2 The PaymentRequestDetailsUpdate")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-shippingoptions-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate-paymentmethoderrors) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-2024425618 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.2 The PaymentRequestDetailsUpdate](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-paymentmethoderrors-1 "§ 6.2 The PaymentRequestDetailsUpdate")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-paymentmethoderrors-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestdetailsupdate-shippingaddresserrors) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-2024425618 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.2 The PaymentRequestDetailsUpdate](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-shippingaddresserrors-1 "§ 6.2 The PaymentRequestDetailsUpdate")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestdetailsupdate-shippingaddresserrors-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-1 "§ 1. Introduction") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-3 "Reference 3")
- [§ 2\. Overview](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-4 "§ 2. Overview") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-5 "Reference 2")
- [§ 2.1 Handling a Payment Request](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-6 "§ 2.1 Handling a Payment Request")
- [§ 6\. Invocation](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-7 "§ 6. Invocation")
- [§ 6.1.1 onpaymentrequest attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-8 "§ 6.1.1 onpaymentrequest attribute")
- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-9 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.3 paymentRequestId attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-10 "§ 6.3.3 paymentRequestId attribute")
- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-11 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ 6.4 Internal Slots](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-12 "§ 6.4 Internal Slots")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-13 "§ 6.5 Handling a PaymentRequestEvent")
- [§ 7\. Windows](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-14 "§ 7. Windows")
- [§ 7.1 Open Window Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-15 "§ 7.1 Open Window Algorithm") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-16 "Reference 2")
- [§ 7.2 Example of handling the PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-17 "§ 7.2 Example of handling the PaymentRequestEvent") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-18 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-19 "Reference 3")
- [§ 8.1.2 details attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-20 "§ 8.1.2 details attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-21 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-constructor) exported

**Referenced in:**

- Not referenced in this document.

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-toporigin) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-toporigin-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.2 paymentRequestOrigin attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-toporigin-2 "§ 6.3.2 paymentRequestOrigin attribute") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-toporigin-3 "Reference 2")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-toporigin-4 "§ 6.5 Handling a PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-toporigin-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-paymentrequestorigin) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentrequestorigin-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentrequestorigin-2 "§ 6.5 Handling a PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentrequestorigin-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-paymentrequestid) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentrequestid-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.3 paymentRequestId attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentrequestid-2 "§ 6.3.3 paymentRequestId attribute")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentrequestid-3 "§ 6.5 Handling a PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentrequestid-4 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-methoddata) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-methoddata-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.15 MethodData Population Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-methoddata-2 "§ 6.3.15 MethodData Population Algorithm") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-methoddata-3 "Reference 2")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-methoddata-4 "§ 6.5 Handling a PaymentRequestEvent")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-methoddata-5 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-methoddata-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-total) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-total-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.5 total attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-total-2 "§ 6.3.5 total attribute")
- [§ 6.3.16 Modifiers Population Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-total-3 "§ 6.3.16 Modifiers Population Algorithm") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-total-4 "Reference 2")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-total-5 "§ 6.5 Handling a PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-total-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-modifiers) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-modifiers-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.16 Modifiers Population Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-modifiers-2 "§ 6.3.16 Modifiers Population Algorithm") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-modifiers-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-modifiers-4 "Reference 3")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-modifiers-5 "§ 6.5 Handling a PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-modifiers-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-paymentoptions) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentoptions-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentoptions-2 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentoptions-3 "§ 6.5 Handling a PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentoptions-4 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-paymentoptions-5 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-shippingoptions) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-shippingoptions-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-shippingoptions-2 "§ 6.5 Handling a PaymentRequestEvent")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-shippingoptions-3 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-shippingoptions-4 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-openwindow) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-openwindow-1 "§ 6.3 The PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-openwindow-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-changepaymentmethod) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-changepaymentmethod-1 "§ 6.3 The PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-changepaymentmethod-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-changeshippingaddress) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-changeshippingaddress-1 "§ 6.3 The PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-changeshippingaddress-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-changeshippingoption) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-changeshippingoption-1 "§ 6.3 The PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-changeshippingoption-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequestevent-respondwith) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-941889379 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-respondwith-1 "§ 6.3 The PaymentRequestEvent")
- [§ 8.1.2 details attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-respondwith-2 "§ 8.1.2 details attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequestevent-respondwith-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-1 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-2 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-3 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-4 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-toporigin) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-toporigin-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-toporigin-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-paymentrequestorigin) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-paymentrequestorigin-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-paymentrequestorigin-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-paymentrequestid) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-paymentrequestid-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-paymentrequestid-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-methoddata) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-methoddata-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-methoddata-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-total) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-total-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-total-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-modifiers) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-modifiers-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-modifiers-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-paymentoptions) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-paymentoptions-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-paymentoptions-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymentrequesteventinit-shippingoptions) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-488183213 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3.14 PaymentRequestEventInit dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-shippingoptions-1 "§ 6.3.14 PaymentRequestEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymentrequesteventinit-shippingoptions-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-methoddata-population-algorithm)

**Referenced in:**

- [§ 6.3.4 methodData attribute](https://www.w3.org/TR/payment-handler/#ref-for-dfn-methoddata-population-algorithm-1 "§ 6.3.4 methodData attribute")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dfn-methoddata-population-algorithm-2 "§ 6.5 Handling a PaymentRequestEvent")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-modifiers-population-algorithm)

**Referenced in:**

- [§ 6.3.6 modifiers attribute](https://www.w3.org/TR/payment-handler/#ref-for-dfn-modifiers-population-algorithm-1 "§ 6.3.6 modifiers attribute")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dfn-modifiers-population-algorithm-2 "§ 6.5 Handling a PaymentRequestEvent")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-windowclient)

**Referenced in:**

- [§ 7.1 Open Window Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dfn-windowclient-1 "§ 7.1 Open Window Algorithm") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-windowclient-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-windowclient-3 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-windowclient-0)

**Referenced in:**

- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dfn-windowclient-0-1 "§ 6.3 The PaymentRequestEvent")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dfn-windowclient-0-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-respondwithcalled)

**Referenced in:**

- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dfn-respondwithcalled-1 "§ 8.4 Respond to PaymentRequest Algorithm") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-respondwithcalled-2 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-handling-a-paymentrequestevent)

**Referenced in:**

- [§ 6.3.1 topOrigin attribute](https://www.w3.org/TR/payment-handler/#ref-for-dfn-handling-a-paymentrequestevent-1 "§ 6.3.1 topOrigin attribute")
- [§ 6.3.2 paymentRequestOrigin attribute](https://www.w3.org/TR/payment-handler/#ref-for-dfn-handling-a-paymentrequestevent-2 "§ 6.3.2 paymentRequestOrigin attribute")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-payment-handler-window)

**Referenced in:**

- [§ 7.2 Example of handling the PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-handler-window-1 "§ 7.2 Example of handling the PaymentRequestEvent")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-open-window-algorithm)

**Referenced in:**

- [§ 6.3.9 openWindow() method](https://www.w3.org/TR/payment-handler/#ref-for-dfn-open-window-algorithm-1 "§ 6.3.9 openWindow() method")
- [§ 7.1 Open Window Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dfn-open-window-algorithm-2 "§ 7.1 Open Window Algorithm")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 6\. Invocation](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-1 "§ 6. Invocation")
- [§ 6.3 The PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-2 "§ 6.3 The PaymentRequestEvent")
- [§ 6.3.13 respondWith() method](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-3 "§ 6.3.13 respondWith() method")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-4 "§ 6.5 Handling a PaymentRequestEvent")
- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-5 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.1.2 details attribute](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-6 "§ 8.1.2 details attribute")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-7 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-8 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-9 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-methodname) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-methodname-1 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-methodname-2 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-methodname-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-details) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-details-1 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-details-2 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-details-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-payment-app-failure-algorithm)

**Referenced in:**

- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-1 "§ 8.4 Respond to PaymentRequest Algorithm") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-3 "Reference 3") [(4)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-4 "Reference 4") [(5)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-5 "Reference 5") [(6)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-6 "Reference 6") [(7)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-7 "Reference 7") [(8)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-8 "Reference 8") [(9)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-9 "Reference 9") [(10)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-payment-app-failure-algorithm-10 "Reference 10")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-payername) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payername-1 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payername-2 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payername-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-payeremail) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payeremail-1 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payeremail-2 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payeremail-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-payerphone) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payerphone-1 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payerphone-2 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-payerphone-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-shippingaddress) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-shippingaddress-1 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-shippingaddress-2 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-shippingaddress-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dom-paymenthandlerresponse-shippingoption) exported [IDL](https://www.w3.org/TR/payment-handler/#webidl-822477832 "Jump to IDL declaration")

**Referenced in:**

- [§ 8.1 PaymentHandlerResponse dictionary](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-shippingoption-1 "§ 8.1 PaymentHandlerResponse dictionary")
- [§ 8.4 Respond to PaymentRequest Algorithm](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-shippingoption-2 "§ 8.4 Respond to PaymentRequest Algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-handler/#ref-for-dom-paymenthandlerresponse-shippingoption-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-change-payment-method-algorithm)

**Referenced in:**

- [§ 6.3.10 changePaymentMethod() method](https://www.w3.org/TR/payment-handler/#ref-for-dfn-change-payment-method-algorithm-1 "§ 6.3.10 changePaymentMethod() method")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-change-payment-details-algorithm)

**Referenced in:**

- [§ 6.3.11 changeShippingAddress() method](https://www.w3.org/TR/payment-handler/#ref-for-dfn-change-payment-details-algorithm-1 "§ 6.3.11 changeShippingAddress() method")
- [§ 6.3.12 changeShippingOption() method](https://www.w3.org/TR/payment-handler/#ref-for-dfn-change-payment-details-algorithm-2 "§ 6.3.12 changeShippingOption() method")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-respond-to-paymentrequest-algorithm)

**Referenced in:**

- [§ 6.3.13 respondWith() method](https://www.w3.org/TR/payment-handler/#ref-for-dfn-respond-to-paymentrequest-algorithm-1 "§ 6.3.13 respondWith() method")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-service-worker-registration)

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-handler/#ref-for-dfn-service-worker-registration-1 "§ 1. Introduction")
- [§ 9.8 Supported Origin](https://www.w3.org/TR/payment-handler/#ref-for-dfn-service-worker-registration-2 "§ 9.8 Supported Origin")

[Permalink](https://www.w3.org/TR/payment-handler/#dfn-user-agents)

**Referenced in:**

- [§ 5\. Can make payment](https://www.w3.org/TR/payment-handler/#ref-for-dfn-user-agents-1 "§ 5. Can make payment")
- [§ 5.3 Handling a CanMakePaymentEvent](https://www.w3.org/TR/payment-handler/#ref-for-dfn-user-agents-2 "§ 5.3 Handling a CanMakePaymentEvent") [(2)](https://www.w3.org/TR/payment-handler/#ref-for-dfn-user-agents-3 "Reference 2")
- [§ 6.5 Handling a PaymentRequestEvent](https://www.w3.org/TR/payment-handler/#ref-for-dfn-user-agents-4 "§ 6.5 Handling a PaymentRequestEvent")