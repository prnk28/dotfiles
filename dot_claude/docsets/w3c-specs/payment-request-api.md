---
tags:
  - "#web-api"
  - "#payment-processing"
  - "#security"
  - "#web-standards"
  - "#payment-request-api"
  - "#e-commerce"
  - "#browser-integration"
---
## Abstract

This specification standardizes an API to allow merchants (i.e. web
sites selling physical or digital goods) to utilize one or more payment
methods with minimal integration. User agents (e.g., browsers)
facilitate the payment flow between merchant and user.


## Status of This Document

_This section describes the status of this_
_document at the time of its publication. A list of current W3C_
_publications and the latest revision of this technical report can be found_
_in the_
_[W3C standards and drafts index](https://www.w3.org/TR/) at_
_https://www.w3.org/TR/._

In September 2022 the Web Payments Working Group published a [Payment\\
Request Recommendation](https://www.w3.org/TR/2022/REC-payment-request-20220908/). Following privacy and internationalization
reviews, the Recommendation excluded [capabilities](https://lists.w3.org/Archives/Public/public-payments-wg/2021Jun/0000.html) related to billing and shipping addresses. However,
implementations have continued to support those features interoperably,
and so the Working Group has decided to try to re-align the
specification with implementations, and re-engage the community on
associated issues.


This document is a Candidate Recommendation Snapshot based on the text
of the original Recommendation. A subsequent Candidate Recommendation
Draft will add back address capabilities and a small number of other
changes made since publication of the Recommendation.


As part of adding back support for addresses, this specification now
refers to the address components defined in the [Contact Picker API](https://w3c.github.io/contact-picker/) rather
than define those components itself. Indeed, the Contact Picker API is
derived from the original definitions found in Payment Request API, and
pulled out of the specification because addresses are useful on the Web
beyond payments.


The Working Group plans to engage in discussion and follow the usual
review process before advancing the specification to Proposed
Recommendation status.


The working group will demonstrate implementation experience by
producing an [implementation\\
report](https://w3c.github.io/test-results/payment-request/all.html). The report will show two or more independent
implementations passing each mandatory test in the [test suite](https://wpt.live/payment-request/) (i.e., each test
corresponds to a _MUST_ requirement of the specification).


This document was published by the [Web Payments Working Group](https://www.w3.org/groups/wg/payments) as
a Candidate Recommendation Draft using the
[Recommendation track](https://www.w3.org/policies/process/20231103/#recs-and-notes).


Publication as a Candidate Recommendation does not
imply endorsement by W3C and its Members. A Candidate Recommendation Draft integrates
changes from the previous Candidate Recommendation that the Working Group
intends to include in a subsequent Candidate Recommendation Snapshot.

This is a draft document and may be updated, replaced or obsoleted by other
documents at any time. It is inappropriate to cite this document as other
than work in progress.
Future updates to this specification may incorporate
[new features](https://www.w3.org/policies/process/20231103/#allow-new-features).



This document was produced by a group
operating under the
[W3C Patent\\
Policy](https://www.w3.org/policies/patent-policy/).


W3C maintains a
[public list of any patent disclosures](https://www.w3.org/groups/wg/payments/ipr)
made in connection with the deliverables of
the group; that page also includes
instructions for disclosing a patent. An individual who has actual
knowledge of a patent which the individual believes contains
[Essential Claim(s)](https://www.w3.org/policies/patent-policy/#def-essential)
must disclose the information in accordance with
[section 6 of the W3C Patent Policy](https://www.w3.org/policies/patent-policy/#sec-Disclosure).



This document is governed by the
[03 November 2023 W3C Process Document](https://www.w3.org/policies/process/20231103/).


## 1\.   Introduction

[Permalink for Section 1.](https://www.w3.org/TR/payment-request/#introduction)

_This section is non-normative._

This specification describes an API that allows [user agents](https://www.w3.org/TR/payment-request/#dfn-user-agent)
(e.g., browsers) to act as an intermediary between three parties in a
transaction:


- The payee: the merchant that runs an online store, or other party
   that requests to be paid.

- The payer: the party that makes a purchase at that online store,
   and who authenticates and authorizes payment as required.

- The payment method: the means that the payer uses to pay
   the payee (e.g., a card payment or credit transfer). The payment
   method provider establishes the ecosystem to support that payment
   method.


A payment method defines:


 An optional additional data
 type
 Optionally, an IDL type that the [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) expects to
 receive as the [`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata)'s [`data`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data)
 member. If not specified for a given payment method, no conversion to
 IDL is done and the payment method will receive
 [`data`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data) as JSON.
 Steps to validate payment method data
 Algorithmic steps that specify how a [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) validates
 the [`data`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data) member of the [`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata),
 after it is converted to the payment method's [additional data type](https://www.w3.org/TR/payment-request/#dfn-additional-data-type). If not specified for a given payment
 method, no validation is done.


The details of how to fulfill a payment request for a given [payment\\
method](https://www.w3.org/TR/payment-request/#dfn-payment-method) is an implementation detail of a payment
handler, which is an application or service that handles requests
for payment. Concretely, a payment handler defines:


Steps to check if a payment can be made:

 How a payment handler determines whether it, or the user, can
 potentially "make a payment" is also an implementation detail of a
 payment handler.
 Steps to respond to a payment request:

 Steps that return an object or [dictionary](https://webidl.spec.whatwg.org/#dfn-dictionary) that a merchant uses
 to process or validate the transaction. The structure of this object
 is specific to each [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method).
 Steps for when a user changes payment method (optional)


Steps that describe how to handle the user changing payment method
or monetary instrument (e.g., from a debit card to a credit card)
that results in a [dictionary](https://webidl.spec.whatwg.org/#dfn-dictionary) or [`object`](https://webidl.spec.whatwg.org/#idl-object) or null.


This API also enables web sites to take advantage of more secure
payment schemes (e.g., tokenization and system-level authentication)
that are not possible with standard JavaScript libraries. This has the
potential to reduce liability for the merchant and helps protect
sensitive user information.


### 1.1   Goals and scope

[Permalink for Section 1.1](https://www.w3.org/TR/payment-request/#goals)

- Allow the user agent to act as intermediary between a merchant,
   user, and [payment method provider](https://www.w3.org/TR/payment-request/#dfn-payment-method-provider).

- Enable user agents to streamline the user's payment experience by
   taking into account user preferences, merchant information, security
   considerations, and other factors.

- Standardize (to the extent that it makes sense) the communication
   flow between a merchant, user agent, and [payment method\\
   provider](https://www.w3.org/TR/payment-request/#dfn-payment-method-provider).

- Enable a [payment method provider](https://www.w3.org/TR/payment-request/#dfn-payment-method-provider) to bring more secure
   payment transactions to the web.


The following are out of scope for this specification:


- Create a new [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method).

- Integrate directly with payment processors.


## 2\.   Examples of usage

[Permalink for Section 2.](https://www.w3.org/TR/payment-request/#examples-of-usage)

_This section is non-normative._

In order to use the API, the developer needs to provide and keep track
of a number of key pieces of information. These bits of information are
passed to the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) constructor as arguments, and
subsequently used to update the payment request being displayed to the
user. Namely, these bits of information are:


- The methodData: A sequence of [`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata) s that
   represents the [payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method) that the site supports (e.g., "we
   support card-based payments, but only Visa and MasterCard credit
   cards.").

- The details: The details of the transaction, as a
   [`PaymentDetailsInit`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit) dictionary. This includes total cost, and
   optionally a list of goods or services being purchased, for physical
   goods, and shipping options. Additionally, it can optionally include
   "modifiers" to how payments are made. For example, "if you pay with a
   card belonging to network X, it incurs a US$3.00 processing fee".

- The options: Optionally, a list of things as [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions)
   that the site needs to deliver the good or service (e.g., for physical
   goods, the merchant will typically need a physical address to ship to.
   For digital goods, an email will usually suffice).


Once a [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) is constructed, it's presented to the end
user via the [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method. The
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` returns a promise that, once the user
confirms request for payment, results in a [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse).


### 2.1   Declaring multiple ways of paying

[Permalink for Section 2.1](https://www.w3.org/TR/payment-request/#declaring-multiple-ways-of-paying)

When constructing a new [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest), a merchant uses the first
argument (methodData) to list the different ways a user can pay for
things (e.g., credit cards, Apple Pay, Google Pay, etc.). More
specifically, the methodData sequence contains
[`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata) dictionaries containing the [payment\\
method identifiers](https://www.w3.org/TR/payment-method-id/#dfn-pmi) for the [payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method) that the
merchant accepts and any associated [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) specific
data (e.g., which credit card networks are supported).


[Example 1](https://www.w3.org/TR/payment-request/#example-the-methoddata-argument): The \`methodData\` argument

```hljs js
const methodData = [\
  {\
    supportedMethods: "https://example.com/payitforward",\
    data: {\
      payItForwardField: "ABC",\
    },\
  },\
  {\
    supportedMethods: "https://example.com/bobpay",\
    data: {\
      merchantIdentifier: "XXXX",\
      bobPaySpecificField: true,\
    },\
  },\
];
```

### 2.2   Describing what is being paid for

[Permalink for Section 2.2](https://www.w3.org/TR/payment-request/#describing-what-is-being-paid-for)

When constructing a new [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest), a merchant uses the
second argument of the constructor (details) to provide the details
of the transaction that the user is being asked to complete. This
includes the total of the order and, optionally, some line items that
can provide a detailed breakdown of what is being paid for.


[Example 2](https://www.w3.org/TR/payment-request/#example-the-details-argument): The \`details\` argument

```hljs js
const details = {
  id: "super-store-order-123-12312",
  displayItems: [\
    {\
      label: "Sub-total",\
      amount: { currency: "GBP", value: "55.00" },\
    },\
    {\
      label: "Value-Added Tax (VAT)",\
      amount: { currency: "GBP", value: "5.00" },\
    },\
  ],
  total: {
    label: "Total due",
    // The total is GBP£65.00 here because we need to
    // add shipping (below). The selected shipping
    // costs GBP£5.00.
    amount: { currency: "GBP", value: "65.00" },
  },
};
```

### 2.3   Adding shipping options

[Permalink for Section 2.3](https://www.w3.org/TR/payment-request/#adding-shipping-options)

Here we see an example of how to add two shipping options to the
details.


[Example 3](https://www.w3.org/TR/payment-request/#example-adding-shipping-options): Adding shipping options

```hljs js
const shippingOptions = [\
  {\
    id: "standard",\
    // Shipping by truck, 2 days\
    label: "🚛  Envío por camión (2 dias)",\
    amount: { currency: "EUR", value: "5.00" },\
    selected: true,\
  },\
  {\
    id: "drone",\
    // Drone shipping, 2 hours\
    label: "🚀 Drone Express (2 horas)",\
    amount: { currency: "EUR", value: "25.00" }\
  },\
];
Object.assign(details, { shippingOptions });
```

### 2.4   Conditional modifications to payment request

[Permalink for Section 2.4](https://www.w3.org/TR/payment-request/#conditional-modifications-to-payment-request)

Here we see how to add a processing fee for using a card on a
particular network. Notice that it requires recalculating the total.


[Example 4](https://www.w3.org/TR/payment-request/#example-modifying-payment-request-based-on-card-type): Modifying payment request based on card type

```hljs js
// Certain cards incur a $3.00 processing fee.
const cardFee = {
  label: "Card processing fee",
  amount: { currency: "AUD", value: "3.00" },
};

// Modifiers apply when the user chooses to pay with
// a card.
const modifiers = [\
  {\
    additionalDisplayItems: [cardFee],\
    supportedMethods: "https://example.com/cardpay",\
    total: {\
      label: "Total due",\
      amount: { currency: "AUD", value: "68.00" },\
    },\
    data: {\
      supportedNetworks: networks,\
    },\
  },\
];
Object.assign(details, { modifiers });
```

### 2.5   Requesting specific information from the end user

[Permalink for Section 2.5](https://www.w3.org/TR/payment-request/#requesting-specific-information-from-the-end-user)

Some financial transactions require a user to provide specific
information in order for a merchant to fulfill a purchase (e.g., the
user's shipping address, in case a physical good needs to be
shipped). To request this information, a merchant can pass a third
optional argument (options) to the
[`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) constructor indicating what information they
require. When the payment request is shown, the user agent will
request this information from the end user and return it to the
merchant when the user accepts the payment request.


[Example 5](https://www.w3.org/TR/payment-request/#example-the-options-argument): The \`options\` argument

```hljs js
const options = {
  requestPayerEmail: false,
  requestPayerName: true,
  requestPayerPhone: false,
  requestShipping: true,
}
```

### 2.6   Constructing a `PaymentRequest`

[Permalink for Section 2.6](https://www.w3.org/TR/payment-request/#constructing-a-paymentrequest)

Having gathered all the prerequisite bits of information, we can now
construct a [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) and request that the browser present
it to the user:


[Example 6](https://www.w3.org/TR/payment-request/#example-constructing-a-paymentrequest): Constructing a \`PaymentRequest\`

```hljs js
async function doPaymentRequest() {
  try {
    const request = new PaymentRequest(methodData, details, options);
    // See below for a detailed example of handling these events
    request.onshippingaddresschange = ev => ev.updateWith(details);
    request.onshippingoptionchange = ev => ev.updateWith(details);
    const response = await request.show();
    await validateResponse(response);
  } catch (err) {
    // AbortError, SecurityError
    console.error(err);
  }
}
async function validateResponse(response) {
  try {
    const errors = await checkAllValuesAreGood(response);
    if (errors.length) {
      await response.retry(errors);
      return validateResponse(response);
    }
    await response.complete("success");
  } catch (err) {
    // Something went wrong...
    await response.complete("fail");
  }
}
// Must be called as a result of a click
// or some explicit user action.
doPaymentRequest();
```

### 2.7   Handling events and updating the payment request

[Permalink for Section 2.7](https://www.w3.org/TR/payment-request/#handling-events-and-updating-the-payment-request)

Prior to the user accepting to make payment, the site is given an
opportunity to update the payment request in response to user input.
This can include, for example, providing additional shipping options
(or modifying their cost), removing items that cannot ship to a
particular address, etc.


[Example 7](https://www.w3.org/TR/payment-request/#example-registering-event-handlers): Registering event handlers

```hljs js
const request = new PaymentRequest(methodData, details, options);
// Async update to details
request.onshippingaddresschange = ev => {
  ev.updateWith(checkShipping(request));
};
// Sync update to the total
request.onshippingoptionchange = ev => {
  // selected shipping option
  const { shippingOption } = request;
  const newTotal = {
    currency: "USD",
    label: "Total due",
    value: calculateNewTotal(shippingOption),
  };
  ev.updateWith({ total: newTotal });
};
async function checkShipping(request) {
  try {
    const { shippingAddress } = request;

    await ensureCanShipTo(shippingAddress);
    const { shippingOptions, total } = await calculateShipping(shippingAddress);

    return { shippingOptions, total };
  } catch (err) {
    // Shows error to user in the payment sheet.
    return { error: `Sorry! we can't ship to your address.` };
  }
}
```

### 2.8   Fine-grained error reporting

[Permalink for Section 2.8](https://www.w3.org/TR/payment-request/#fine-grained-error-reporting)

A developer can use the
[`shippingAddressErrors`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-shippingaddresserrors) member of the
[`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) dictionary to indicate that there are
validation errors with specific attributes of a [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress).
The [`shippingAddressErrors`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-shippingaddresserrors) member is a
[`AddressErrors`](https://www.w3.org/TR/payment-request/#dom-addresserrors) dictionary, whose members specifically demarcate
the fields of a [physical address](https://www.w3.org/TR/contact-picker/#physical-address) that are erroneous while also
providing helpful error messages to be displayed to the end user.


[Example 8](https://www.w3.org/TR/payment-request/#example-8)

```hljs js
request.onshippingaddresschange = ev => {
  ev.updateWith(validateAddress(request.shippingAddress));
};
function validateAddress(shippingAddress) {
  const error = "Can't ship to this address.";
  const shippingAddressErrors = {
    city: "FarmVille is not a real place.",
    postalCode: "Unknown postal code for your country.",
  };
  // Empty shippingOptions implies that we can't ship
  // to this address.
  const shippingOptions = [];
  return { error, shippingAddressErrors, shippingOptions };
}
```

### 2.9   POSTing payment response back to a server

[Permalink for Section 2.9](https://www.w3.org/TR/payment-request/#posting-payment-response-back-to-a-server)

It's expected that data in a [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) will be POSTed back
to a server for processing. To make this as easy as possible,
[`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) can use the [default toJSON steps](https://webidl.spec.whatwg.org/#default-tojson-steps) (i.e.,
`.toJSON()`) to serializes the object directly into JSON. This makes
it trivial to POST the resulting JSON back to a server using the
[Fetch Standard](https://fetch.spec.whatwg.org/):


[Example 9](https://www.w3.org/TR/payment-request/#example-posting-with-fetch): POSTing with \`fetch()\`

```hljs js
async function doPaymentRequest() {
  const payRequest = new PaymentRequest(methodData, details);
  const payResponse = await payRequest.show();
  let result = "";
  try {
    const httpResponse = await fetch("/process-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payResponse.toJSON(),
    });
    result = httpResponse.ok ? "success" : "fail";
  } catch (err) {
    console.error(err);
    result = "fail";
  }
  await payResponse.complete(result);
}
doPaymentRequest();
```

### 2.10   Using with cross-origin iframes

[Permalink for Section 2.10](https://www.w3.org/TR/payment-request/#using-with-cross-origin-iframes)

To indicate that a cross-origin `iframe` is allowed to invoke the
payment request API, the `allow` attribute along with the
"payment" keyword can be specified on the `iframe` element.


[Example 10](https://www.w3.org/TR/payment-request/#example-using-payment-request-api-with-cross-origin-iframes): Using Payment Request API with cross-origin iframes

```hljs html
<iframe
  src="https://cross-origin.example"
  allow="payment">
</iframe>
```

If the `iframe` will be navigated across multiple origins that
support the Payment Request API, then one can set `allow` to
`"payment *"`. The [Permissions Policy](https://www.w3.org/TR/permissions-policy-1/) specification provides
further details and examples.


## 3\. `PaymentRequest` interface

[Permalink for Section 3.](https://www.w3.org/TR/payment-request/#paymentrequest-interface)

```
WebIDL[SecureContext, Exposed=Window]
interface PaymentRequest : EventTarget {
  constructor(
    sequence<PaymentMethodData> methodData,
    PaymentDetailsInit details,
    optional PaymentOptions options = {}
  );
  [NewObject]
  Promise<PaymentResponse> show(optional Promise<PaymentDetailsUpdate> detailsPromise);
  [NewObject]
  Promise<undefined> abort();
  [NewObject]
  Promise<boolean> canMakePayment();

  readonly attribute DOMString id;
  readonly attribute ContactAddress? shippingAddress;
  readonly attribute DOMString? shippingOption;
  readonly attribute PaymentShippingType? shippingType;

  attribute EventHandler onshippingaddresschange;
  attribute EventHandler onshippingoptionchange;
  attribute EventHandler onpaymentmethodchange;
};
```

Note

A developer creates a [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) to make a payment request.
This is typically associated with the user initiating a payment
process (e.g., by activating a "Buy," "Purchase," or "Checkout"
button on a web site, selecting a "Power Up" in an interactive game,
or paying at a kiosk in a parking structure). The [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)
allows developers to exchange information with the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent)
while the user is providing input (up to the point of user approval
or denial of the payment request).


The [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress),
[`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption), and
[`shippingType`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingtype) attributes are populated during
processing if the [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) member is set.


A request's payment-relevant browsing context is that
[`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global)'s browsing context's
[top-level browsing context](https://html.spec.whatwg.org/multipage/document-sequences.html#top-level-browsing-context). Every [payment-relevant browsing\\
context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context) has a payment request is showing boolean, which
prevents showing more than one payment UI at a time.


The [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean simply prevents more than
one payment UI being shown in a single browser tab. However, a
[payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) can restrict the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) to showing
only one payment UI across all browser windows and tabs. Other payment
handlers might allow showing a payment UI across disparate browser
tabs.


### 3.1   Constructor

[Permalink for Section 3.1](https://www.w3.org/TR/payment-request/#constructor)

The [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) is constructed using the supplied sequence of
[`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata) methodData including any [payment\\
method](https://www.w3.org/TR/payment-request/#dfn-payment-method) specific [`data`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data), the
[`PaymentDetailsInit`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit) details, and the [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) options.


The `PaymentRequest(methodData,
          details, options)` constructor _MUST_ act as follows:


01. If [this](https://webidl.spec.whatwg.org/#this)'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global)'s [associated `Document`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-document-window) is not [allowed to use](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#allowed-to-use) the ["payment"](https://www.w3.org/TR/payment-request/#dfn-payment)
     permission, then [throw](https://webidl.spec.whatwg.org/#dfn-throw) a " [`SecurityError`](https://webidl.spec.whatwg.org/#securityerror)"
     [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

02. Establish the request's id:
    1. If
        details. [`id`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-id) is missing, add an
        [`id`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-id) member to details and set its value
        to a UUID
        \[[RFC4122](https://www.w3.org/TR/payment-request/#bib-rfc4122 "A Universally Unique IDentifier (UUID) URN Namespace")\].
03. Let serializedMethodData be an empty list.

04. Process payment methods:
    1. If the length of the methodData sequence is zero, then
        [throw](https://webidl.spec.whatwg.org/#dfn-throw) a [`TypeError`](https://webidl.spec.whatwg.org/#exceptiondef-typeerror), optionally informing the
        developer that at least one [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) is required.

    2. Let seenPMIs be the empty [set](https://infra.spec.whatwg.org/#ordered-set).

    3. For each paymentMethod of methodData:

       1. Run the
           steps to [validate a payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-validate-a-payment-method-identifier) with
           paymentMethod. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods). If it
           returns false, then throw a [`RangeError`](https://webidl.spec.whatwg.org/#exceptiondef-rangeerror) exception.
           Optionally, inform the developer that the payment method
           identifier is invalid.

       2. Let pmi be the result of parsing
           paymentMethod. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods) with
           [basic URL parser](https://url.spec.whatwg.org/#concept-basic-url-parser):

          1. If failure, set pmi to
              paymentMethod. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods).
       3. If seenPMIs [contains](https://infra.spec.whatwg.org/#list-contain) pmi throw a
           [`RangeError`](https://webidl.spec.whatwg.org/#exceptiondef-rangeerror) [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException) optionally informing the
           developer that this [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) is a
           duplicate.

       4. [Append](https://infra.spec.whatwg.org/#set-append) pmi to seenPMIs.

       5. If the [`data`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data) member of
           paymentMethod is missing, let serializedData be null.
           Otherwise, let serializedData be the result of [serialize](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string) paymentMethod. [`data`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data) into a JSON
           string. Rethrow any exceptions.

       6. If serializedData is not null, and if the specification
           that defines the
           paymentMethod. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods)
           specifies an [additional data type](https://www.w3.org/TR/payment-request/#dfn-additional-data-type):

          1. Let object be the result of [JSON-parsing](https://tc39.es/ecma262/multipage/#sec-json.parse) serializedData.

          2. Let idl be the result of [converting](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) object to an IDL value of the
              [additional data type](https://www.w3.org/TR/payment-request/#dfn-additional-data-type). Rethrow any
              exceptions.


          3. Run the [steps to validate payment method data](https://www.w3.org/TR/payment-request/#dfn-steps-to-validate-payment-method-data),
              if any, from the specification that defines the
              paymentMethod. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods)
              on object. Rethrow any exceptions.




             Note




             These step assures that any IDL type conversion and
             validation errors are caught as early as possible.
       7. Add the tuple
           (paymentMethod. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods),
           serializedData) to serializedMethodData.
05. Process the total:
    1. [Check and canonicalize total amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-total-amount) details. [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-total). [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount).
        Rethrow any exceptions.
06. If the [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems) member of details is
     present, then for each item in
     details. [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems):

    1. [Check and canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) item. [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount). Rethrow any exceptions.
07. Let selectedShippingOption be null.

08. If the [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) member of options is
     present and set to true, process shipping options:

    1. Let options be an empty
        `sequence` < [`PaymentShippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption) >.

    2. If the [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions) member of
        details is present, then:

       1. Let seenIDs be an empty set.

       2. For each option in
           details. [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions):

          1. [Check and canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) item. [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount). Rethrow any exceptions.

          2. If seenIDs contains
              option. [`id`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id), then throw a
              [`TypeError`](https://webidl.spec.whatwg.org/#exceptiondef-typeerror). Optionally, inform the developer that
              shipping option IDs must be unique.

          3. Otherwise, append
              option. [`id`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id) to seenIDs.

          4. If option. [`selected`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-selected) is
              true, then set selectedShippingOption to
              option. [`id`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id).
    3. Set details. [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions) to
        options.
09. Let serializedModifierData be an empty list.

10. Process payment details modifiers:
    1. Let modifiers be an empty
        `sequence` < [`PaymentDetailsModifier`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier) >.

    2. If the [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers) member of details
        is present, then:

       1. Set modifiers to
           details. [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers).

       2. For each modifier of modifiers:

          1. If the [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-total) member of
              modifier is present, then:

             1. [Check and canonicalize total amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-total-amount) modifier. [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-total). [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount).
                 Rethrow any exceptions.
          2. If the
              [`additionalDisplayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-additionaldisplayitems) member
              of modifier is present, then for each item of
              modifier. [`additionalDisplayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-additionaldisplayitems):
              1. [Check and canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) item. [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount). Rethrow any
                 exceptions.
          3. If the [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) member of
              modifier is missing, let serializedData be null.
              Otherwise, let serializedData be the result of
              [serialize](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string) modifier. [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) into a JSON
              string. Rethrow any exceptions.

          4. Add the tuple
              (modifier. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-supportedmethods),
              serializedData) to serializedModifierData.

          5. Remove the [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) member of
              modifier, if it is present.
    3. Set details. [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers) to
        modifiers.
11. Let request be a new [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest).

12. Set request. [`[[handler]]`](https://www.w3.org/TR/payment-request/#dfn-handler) to `null`.

13. Set request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options) to options.

14. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
     " [created](https://www.w3.org/TR/payment-request/#dfn-created)".

15. Set request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) to false.

16. Set request. [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details) to details.

17. Set request. [`[[serializedModifierData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmodifierdata) to
     serializedModifierData.

18. Set request. [`[[serializedMethodData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmethoddata) to
     serializedMethodData.

19. Set request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response) to null.

20. Set the value of request's [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption)
     attribute to selectedShippingOption.

21. Set the value of the [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress) attribute
     on request to null.

22. If options. [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) is set to true,
     then set the value of the [`shippingType`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingtype) attribute
     on request to options. [`shippingType`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-shippingtype). Otherwise,
     set it to null.

23. Return request.


### 3.2 `id` attribute

[Permalink for Section 3.2](https://www.w3.org/TR/payment-request/#id-attribute)

When getting, the [`id`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-id) attribute returns this
[`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s
[`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`id`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-id).


Note

For auditing and reconciliation purposes, a merchant can associate
a unique identifier for each transaction with the
[`id`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-id) attribute.


### 3.3 `show()` method

[Permalink for Section 3.3](https://www.w3.org/TR/payment-request/#show-method)

Note

The [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method is called when a developer
wants to begin user interaction for the payment request. The
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method returns a [`Promise`](https://webidl.spec.whatwg.org/#idl-promise) that will be
resolved when the [user accepts the payment request](https://www.w3.org/TR/payment-request/#dfn-user-accepts-the-payment-request-algorithm). Some
kind of user interface will be presented to the user to facilitate
the payment request after the [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method
returns.


Each payment handler controls what happens when multiple browsing
context simultaneously call the [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method.
For instance, some payment handlers will allow multiple payment UIs
to be shown in different browser tabs/windows. Other payment
handlers might only allow a single payment UI to be shown for the
entire user agent.


The `show(optional detailsPromise)` method _MUST_ act as
follows:


01. Let request be [this](https://webidl.spec.whatwg.org/#this).

02. If the [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global) of [request](https://fetch.spec.whatwg.org/#concept-request) does not have
     [transient activation](https://html.spec.whatwg.org/multipage/interaction.html#transient-activation), the user agent _MAY_:


    1. Return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) with a " [`SecurityError`](https://webidl.spec.whatwg.org/#securityerror)"
        [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).


Note

This allows the user agent to not require user activation, for
example to support redirect flows where a user activation may
not be present upon redirect. See
[19.9 \\
User activation requirement](https://www.w3.org/TR/payment-request/#user-activation-requirement) for security
considerations.


See also
[issue #1022](https://github.com/w3c/payment-request/issues/1022) for discussion around providing more guidance
in the specification on when user agents should or should not
require a user activation for [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()`.


03. Otherwise,
     [consume user activation](https://html.spec.whatwg.org/multipage/interaction.html#consume-user-activation) of the [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global).

04. Let document be request's [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global)'s
     [associated `Document`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-document-window).

05. If document is
     not [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active), then return [a promise rejected\\
     with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

06. If document's [visibility state](https://html.spec.whatwg.org/multipage/interaction.html#visibility-state) is not `"visible"`,
     then return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)"
     [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

07. Optionally, if the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) wishes to disallow the call
     to [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` to protect the user, then return a
     promise rejected with a " [`SecurityError`](https://webidl.spec.whatwg.org/#securityerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException). For
     example, the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) may limit the rate at which a page
     can call [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()`, as described in section
     [19\. \\
     Privacy and Security Considerations](https://www.w3.org/TR/payment-request/#privacy).


08. If request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is not
     " [created](https://www.w3.org/TR/payment-request/#dfn-created)" then return [a promise rejected\\
     with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

09. If the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent)'s [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing)
     boolean is true, then:

    1. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
        " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

    2. Return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)"
        [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).
10. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
     " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)".

11. Let acceptPromise be [a new promise](https://webidl.spec.whatwg.org/#a-new-promise).

12. Set request. [`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise) to
     acceptPromise.

13. Optionally:



    1. Reject acceptPromise with an " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)"
        [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

    2. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
        " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

    3. Return acceptPromise.


Note

This allows the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) to act as if the user had
immediately [aborted the payment request](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request), at its discretion. For example, in "private browsing"
modes or similar, user agents might take advantage of this step.


14. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
     [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to true.

15. Return acceptPromise and perform the remaining steps [in\\
     parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel).

16. Let handlers be an empty [list](https://infra.spec.whatwg.org/#list).

17. For each paymentMethod tuple in
     request. [`[[serializedMethodData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmethoddata):

    1. Let identifier be the first element in the paymentMethod
        tuple.

    2. Let data be the result of [JSON-parsing](https://tc39.es/ecma262/multipage/#sec-json.parse) the second element
        in the paymentMethod tuple.

    3. If the specification that defines the identifier specifies
        an [additional data type](https://www.w3.org/TR/payment-request/#dfn-additional-data-type), then [convert](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) data to an IDL value of that type.
        Otherwise, [convert](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) data to
        [`object`](https://webidl.spec.whatwg.org/#idl-object).

    4. If conversion results in an [exception](https://webidl.spec.whatwg.org/#dfn-exception) error:

       1. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
           " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

       2. Reject acceptPromise with error.

       3. Set request's [payment-relevant browsing\\
           context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to
           false.

       4. Terminate this algorithm.
    5. Let registeredHandlers be a [list](https://infra.spec.whatwg.org/#list) of registered
        payment handlers for the payment method identifier.



       Note: Payment Handler registration

    6. For each handler in registeredHandlers:

       1. Let canMakePayment be the result of running handler's
           [steps to check if a payment can be made](https://www.w3.org/TR/payment-request/#dfn-steps-to-check-if-a-payment-can-be-made) with data.

       2. If canMakePayment is true, then append handler to
           handlers.
18. If handlers is empty, then:

    1. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
        " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

    2. Reject acceptPromise with " [`NotSupportedError`](https://webidl.spec.whatwg.org/#notsupportederror)"
        [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

    3. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
        [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.

    4. Terminate this algorithm.
19. Present a user interface that will allow the user to interact
     with the handlers. The user agent _SHOULD_ prioritize the user's
     preference when presenting payment methods. The user interface
     _SHOULD_ be presented using the language and locale-based
     formatting that matches the document's [document element's](https://dom.spec.whatwg.org/#document-element) [language](https://html.spec.whatwg.org/multipage/dom.html#language), if any, or an
     appropriate fallback if that is not available.




    Note: Localization of the payments user interface

20. If
     detailsPromise was passed, then:
     1. Run the [update a `PaymentRequest`'s details\\
        algorithm](https://www.w3.org/TR/payment-request/#dfn-update-a-paymentrequest-s-details-algorithm) with detailsPromise, request, and null.

    2. Wait for the detailsPromise to settle.



       Note




       Based on how the detailsPromise settles, the [update a\\
       `PaymentRequest`'s details algorithm](https://www.w3.org/TR/payment-request/#dfn-update-a-paymentrequest-s-details-algorithm)
       determines how the payment UI behaves. That is, [upon\\
       rejection](https://webidl.spec.whatwg.org/#upon-rejection) of the detailsPromise, the payment request
       aborts. Otherwise, [upon fulfillment](https://webidl.spec.whatwg.org/#upon-fulfillment) detailsPromise,
       the user agent re-enables the payment request UI and the
       payment flow can continue.
21. Set request. [`[[handler]]`](https://www.w3.org/TR/payment-request/#dfn-handler) be the [payment\\
     handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) selected by the end-user.

22. Let modifiers be an empty list.

23. For each tuple in
     [`[[serializedModifierData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmodifierdata):

    1. If the first element of tuple (a [PMI](https://www.w3.org/TR/payment-method-id/#dfn-pmi)) matches the
        [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) of
        request. [`[[handler]]`](https://www.w3.org/TR/payment-request/#dfn-handler), then append the second
        element of tuple (the serialized method data) to modifiers.
24. Pass the [converted](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) second element
     in the paymentMethod tuple and modifiers. Optionally, the
     user agent _SHOULD_ send the appropriate data from request to the
     user-selected [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) in order to guide the user
     through the payment process. This includes the various attributes
     and other [internal slots](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) of request (some _MAY_ be excluded
     for privacy reasons where appropriate).



     Handling of multiple applicable modifiers in the
     [`[[serializedModifierData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmodifierdata) [internal slot](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots)
     is [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) specific and beyond the scope of this
     specification. Nevertheless, it is _RECOMMENDED_ that [payment\\
     handlers](https://www.w3.org/TR/payment-request/#dfn-payment-handler) use a "last one wins" approach with items in the
     [`[[serializedModifierData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmodifierdata) list: that is to
     say, an item at the end of the list always takes precedence over
     any item at the beginning of the list (see example below).



     The acceptPromise will later be resolved or rejected by either
     the [user accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#dfn-user-accepts-the-payment-request-algorithm) or the
     [user aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request), which are
     triggered through interaction with the user interface.



     If document stops being [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active) while the
     user interface is being shown, or no longer is by the time this
     step is reached, then:

    1. Close down the user interface.

    2. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
        [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.

### 3.4 `abort()` method

[Permalink for Section 3.4](https://www.w3.org/TR/payment-request/#abort-method)

Note

The [`abort`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-abort) `()` method is called if a developer
wishes to tell the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) to abort the payment request
and to tear down any user interface that might be shown. The
[`abort`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-abort) `()` can only be called after the
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method has been called (see
[states](https://www.w3.org/TR/payment-request/#dfn-state-0)) and before this instance's
[`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise) has been resolved. For
example, developers might choose to do this if the goods they are
selling are only available for a limited amount of time. If the
user does not accept the payment request within the allowed time
period, then the request will be aborted.


A [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) might not always be able to abort a request.
For example, if the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) has delegated responsibility
for the request to another app. In this situation,
[`abort`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-abort) `()` will reject the returned [`Promise`](https://webidl.spec.whatwg.org/#idl-promise).


See also the algorithm when the [user aborts the payment\\
request](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request).


The [`abort`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-abort) `()` method _MUST_ act as follows:


1. Let request be [this](https://webidl.spec.whatwg.org/#this).

2. If request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response) is not null, and
    request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response). [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise)
    is not null, return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an
    " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

3. If the value of request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is not
    " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)" then return [a promise rejected\\
    with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

4. Let promise be [a new promise](https://webidl.spec.whatwg.org/#a-new-promise).

5. Return promise and perform the remaining steps [in\\
    parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel).

6. Try to abort the current user interaction with the [payment\\
    handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) and close down any remaining user interface.

7. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to
    perform the following steps:
    1. If it is not possible to abort the current user interaction,
       then reject promise with " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)"
       [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException) and abort these steps.

   2. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
       " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

   3. Reject the promise
       request. [`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise) with an
       " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

   4. Resolve promise with undefined.

### 3.5 `canMakePayment()` method

[Permalink for Section 3.5](https://www.w3.org/TR/payment-request/#canmakepayment-method)

Note: canMakePayment()

The [`canMakePayment`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-canmakepayment) `()` method can be used by the
developer to determine if the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) has support for one
of the desired [payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method). See
[19.8 `canMakePayment()` protections](https://www.w3.org/TR/payment-request/#canmakepayment-protections).


A true result from [`canMakePayment`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-canmakepayment) `()` does not
imply that the user has a provisioned instrument ready for payment.


The [`canMakePayment`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-canmakepayment) `()` method _MUST_ run the [can\\
make payment algorithm](https://www.w3.org/TR/payment-request/#dfn-can-make-payment-algorithm).


### 3.6 `shippingAddress` attribute

[Permalink for Section 3.6](https://www.w3.org/TR/payment-request/#shippingaddress-attribute)

A [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress) attribute
is populated when the user provides a shipping address. It is null by
default. When a user provides a shipping address, the [shipping\\
address changed algorithm](https://www.w3.org/TR/payment-request/#dfn-shipping-address-changed-algorithm) runs.


### 3.7 `shippingType` attribute

[Permalink for Section 3.7](https://www.w3.org/TR/payment-request/#shippingtype-attribute)

A [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s [`shippingType`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingtype) attribute is
the type of shipping used to fulfill the transaction. Its value is
either a [`PaymentShippingType`](https://www.w3.org/TR/payment-request/#dom-paymentshippingtype) enum value, or null if none is
provided by the developer during
[`construction`](https://www.w3.org/TR/payment-request/#dfn-paymentrequest-paymentrequest) (see
[`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions)'s [`shippingType`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-shippingtype) member).


### 3.8 `onshippingaddresschange` attribute

[Permalink for Section 3.8](https://www.w3.org/TR/payment-request/#onshippingaddresschange-attribute)

A [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s [`onshippingaddresschange`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-onshippingaddresschange)
attribute is an [`EventHandler`](https://html.spec.whatwg.org/multipage/webappapis.html#eventhandler) for a [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent)
named [`shippingaddresschange`](https://www.w3.org/TR/payment-request/#dfn-shippingaddresschange).


### 3.9 `shippingOption` attribute

[Permalink for Section 3.9](https://www.w3.org/TR/payment-request/#shippingoption-attribute)

A [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption) attribute is
populated when the user chooses a shipping option. It is null by
default. When a user chooses a shipping option, the [shipping\\
option changed algorithm](https://www.w3.org/TR/payment-request/#dfn-shipping-option-changed-algorithm) runs.


### 3.10 `onshippingoptionchange` attribute

[Permalink for Section 3.10](https://www.w3.org/TR/payment-request/#onshippingoptionchange-attribute)

A [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s [`onshippingoptionchange`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-onshippingoptionchange)
attribute is an [`EventHandler`](https://html.spec.whatwg.org/multipage/webappapis.html#eventhandler) for a [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent)
named [`shippingoptionchange`](https://www.w3.org/TR/payment-request/#dfn-shippingoptionchange).


### 3.11 `onpaymentmethodchange` attribute

[Permalink for Section 3.11](https://www.w3.org/TR/payment-request/#onpaymentmethodchange-attribute)

A [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)'s [`onpaymentmethodchange`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-onpaymentmethodchange)
attribute is an [`EventHandler`](https://html.spec.whatwg.org/multipage/webappapis.html#eventhandler) for a [`PaymentMethodChangeEvent`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent)
named " [`paymentmethodchange`](https://www.w3.org/TR/payment-request/#dfn-paymentmethodchange)".


### 3.12   Internal Slots

[Permalink for Section 3.12](https://www.w3.org/TR/payment-request/#internal-slots)

Instances of [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) are created with the [internal slots](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) in the following table:


| Internal Slot | Description ( _non-normative_) |
| --- | --- |
| \[\[serializedMethodData\]\] | The `methodData` supplied to the constructor, but<br> represented as tuples containing supported methods and a string<br> or null for data (instead of the original object form). |
| \[\[serializedModifierData\]\] | A list containing the serialized string form of each<br> [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) member for each corresponding<br> item in the sequence<br> [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`modifier`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers),<br> or null if no such member was present. |
| \[\[details\]\] | The current [`PaymentDetailsBase`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase) for the payment request<br> initially supplied to the constructor and then updated with calls<br> to [`updateWith`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) `()`. Note that all<br> [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) members of<br> [`PaymentDetailsModifier`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier) instances contained in the<br> [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers) member will be removed, as they<br> are instead stored in serialized form in the<br> [`[[serializedModifierData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmodifierdata) [internal slot](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots). |
| \[\[options\]\] | The [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) supplied to the constructor. |
| \[\[state\]\] | The current state of the payment request, which transitions from:<br> <br> "created"<br> <br> The payment request is constructed and has not been presented<br> to the user.<br> <br> "interactive"<br> <br> The payment request is being presented to the user.<br> <br> "closed"<br> <br> The payment request completed.<br> <br>The [state](https://www.w3.org/TR/payment-request/#dfn-state-0) transitions are illustrated in the<br>figure below:<br> <br>![](https://www.w3.org/TR/payment-request/images/state-transitions.svg)[Figure 1](https://www.w3.org/TR/payment-request/#fig-the-constructor-sets-the-initial-state-to-created-the-show-method-changes-the-state-to-interactive-from-there-the-abort-method-or-any-other-error-can-send-the-state-to-closed-similarly-the-user-accepts-the-payment-request-algorithm-and-user-aborts-the-payment-request-algorithm-will-change-the-state-to-closed)<br> The constructor sets the initial [state](https://www.w3.org/TR/payment-request/#dfn-state-0) to<br> " [created](https://www.w3.org/TR/payment-request/#dfn-created)". The [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()`<br> method changes the [state](https://www.w3.org/TR/payment-request/#dfn-state-0) to<br> " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)". From there, the<br> [`abort`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-abort) `()` method or any other error can send<br> the [state](https://www.w3.org/TR/payment-request/#dfn-state-0) to " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)";<br> similarly, the [user accepts the payment request\<br> algorithm](https://www.w3.org/TR/payment-request/#dfn-user-accepts-the-payment-request-algorithm) and [user aborts the payment request\<br> algorithm](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request) will change the [state](https://www.w3.org/TR/payment-request/#dfn-state-0) to<br> " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)". |
| \[\[updating\]\] | True if there is a pending<br> [`updateWith`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) `()` call to update the<br> payment request and false otherwise. |
| \[\[acceptPromise\]\] | The pending [`Promise`](https://webidl.spec.whatwg.org/#idl-promise) created during [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()`<br> that will be resolved if the user accepts the payment request. |
| \[\[response\]\] | Null, or the [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) instantiated by this<br> [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest). |
| \[\[handler\]\] | The [Payment Handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) associated with this<br> [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest). Initialized to `null`. |

## 4\. `PaymentMethodData` dictionary

[Permalink for Section 4.](https://www.w3.org/TR/payment-request/#paymentmethoddata-dictionary)

```
WebIDLdictionary PaymentMethodData {
  required DOMString supportedMethods;
  object data;
};
```

A [`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata) dictionary is used to indicate a set of
supported [payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method) and any associated [payment\\
method](https://www.w3.org/TR/payment-request/#dfn-payment-method) specific data for those methods.


`supportedMethods` member

 A [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) for a [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) that
 the merchant web site accepts.
 `data` member

 An object that provides optional information that might be needed by
 the supported payment methods. If supplied, it will be [serialized](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string).


Note

The value of `supportedMethods` was changed from array to
string, but the name was left as a plural to maintain compatibility
with existing content on the Web.


## 5\. `PaymentCurrencyAmount` dictionary

[Permalink for Section 5.](https://www.w3.org/TR/payment-request/#paymentcurrencyamount-dictionary)

```
WebIDLdictionary PaymentCurrencyAmount {
  required DOMString currency;
  required DOMString value;
};
```

A [`PaymentCurrencyAmount`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount) dictionary is used to supply monetary
amounts.


`currency` member


An \[[ISO4217](https://www.w3.org/TR/payment-request/#bib-iso4217 "Currency codes - ISO 4217")\] [well-formed](https://tc39.es/ecma402/#sec-iswellformedcurrencycode) 3-letter
alphabetic code (i.e., the numeric codes are not supported). Their
canonical form is upper case. However, the set of combinations of
currency code for which localized currency symbols are available is
implementation dependent.


When displaying a monetary value, it is _RECOMMENDED_ that user
agents display the currency code, but it's _OPTIONAL_ for user agents
to display a currency symbol. This is because currency symbols can
be ambiguous due to use across a number of different currencies
(e.g., "$" could mean any of USD, AUD, NZD, CAD, and so on.).


User agents _MAY_ format the display of the
[`currency`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-currency) member to adhere to OS
conventions (e.g., for localization purposes).


Note: Digital currencies and ISO 4217 currency codes

User agents implementing this specification enforce \[[ISO4217](https://www.w3.org/TR/payment-request/#bib-iso4217 "Currency codes - ISO 4217")\]'s
3-letter codes format via ECMAScript’s [isWellFormedCurrencyCode](https://tc39.es/ecma402/#sec-iswellformedcurrencycode)
abstract operation, which is invoked as part of the [check and\\
canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) algorithm. When a code does not adhere to
the \[[ISO4217](https://www.w3.org/TR/payment-request/#bib-iso4217 "Currency codes - ISO 4217")\] defined format, a [`RangeError`](https://webidl.spec.whatwg.org/#exceptiondef-rangeerror) is thrown.


Current implementations will therefore allow the use of
well-formed currency codes that are not part of the official
\[[ISO4217](https://www.w3.org/TR/payment-request/#bib-iso4217 "Currency codes - ISO 4217")\] list (e.g., XBT, XRP, etc.). If the provided code is
a currency that the browser knows how to display, then an
implementation will generally display the appropriate currency
symbol in the user interface (e.g., "USD" is shown as U+0024
Dollar Sign ($), "GBP" is shown as U+00A3 Pound Sign (£), "PLN"
is shown as U+007A U+0142 Złoty (zł), and the non-standard "XBT"
could be shown as U+0243 Latin Capital Letter B with Stroke (Ƀ)).


Efforts are underway at ISO to account for digital currencies,
which may result in an update to the \[[ISO4217](https://www.w3.org/TR/payment-request/#bib-iso4217 "Currency codes - ISO 4217")\] registry or an
entirely new registry. The community expects this will resolve
ambiguities that have crept in through the use of non-standard
3-letter codes; for example, does "BTC" refer to Bitcoin or to a
future Bhutan currency? At the time of publication, it remains
unclear what form this evolution will take, or even the time
frame in which the work will be completed. The W3C Web Payments
Working Group is liaising with ISO so that, in the future,
revisions to this specification remain compatible with relevant
ISO registries.


`value` member

 A [valid decimal monetary value](https://www.w3.org/TR/payment-request/#dfn-valid-decimal-monetary-value) containing a monetary amount.


[Example 12](https://www.w3.org/TR/payment-request/#example-how-to-represent-1-234-omani-rials): How to represent 1.234 Omani rials

```hljs js
{
   "currency": "OMR",
   "value": "1.234"
}
```

### 5.1   Validity checkers

[Permalink for Section 5.1](https://www.w3.org/TR/payment-request/#validity-checkers)

A [JavaScript string](https://infra.spec.whatwg.org/#string) is a valid decimal monetary value
if it consists of the following [code points](https://infra.spec.whatwg.org/#code-point) in the given order:


1. Optionally, a single U+002D (-), to indicate that the amount is
    negative.

2. One or more [code points](https://infra.spec.whatwg.org/#code-point) in the range U+0030 (0) to U+0039
    (9).

3. Optionally, a single U+002E (.) followed by one or more [code points](https://infra.spec.whatwg.org/#code-point) in the range U+0030 (0) to U+0039 (9).


Note

The following regular expression is an implementation of the above
definition.


```hljs
^-?[0-9]+(\.[0-9]+)?$
```

To check and canonicalize amount given a
[`PaymentCurrencyAmount`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount) amount, run the following steps:


1. If the result of [IsWellFormedCurrencyCode](https://tc39.es/ecma402/#sec-iswellformedcurrencycode)(amount. [`currency`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-currency))
    is false, then throw a [`RangeError`](https://webidl.spec.whatwg.org/#exceptiondef-rangeerror) exception, optionally informing
    the developer that the currency is invalid.

2. If amount. [`value`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-value) is not a [valid\\
    decimal monetary value](https://www.w3.org/TR/payment-request/#dfn-valid-decimal-monetary-value), throw a [`TypeError`](https://webidl.spec.whatwg.org/#exceptiondef-typeerror), optionally
    informing the developer that the currency is invalid.

3. Set amount. [`currency`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-currency) to the result of
    [ASCII uppercase](https://infra.spec.whatwg.org/#ascii-uppercase) amount. [`currency`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-currency).


To check and canonicalize total amount given a
[`PaymentCurrencyAmount`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount) amount, run the
following steps:


1. [Check and canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) amount. Rethrow any
    exceptions.

2. If the first [code point](https://infra.spec.whatwg.org/#code-point) of
    amount. [`value`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-value) is U+002D (-), then throw a
    [`TypeError`](https://webidl.spec.whatwg.org/#exceptiondef-typeerror) optionally informing the developer that a total's value
    can't be a negative number.


Note: No alteration of values

## 6\.   Payment details dictionaries

[Permalink for Section 6.](https://www.w3.org/TR/payment-request/#payment-details-dictionaries)

### 6.1 `PaymentDetailsBase` dictionary

[Permalink for Section 6.1](https://www.w3.org/TR/payment-request/#paymentdetailsbase-dictionary)

```
WebIDLdictionary PaymentDetailsBase {
  sequence<PaymentItem> displayItems;
  sequence<PaymentShippingOption> shippingOptions;
  sequence<PaymentDetailsModifier> modifiers;
};
```

`displayItems` member

 A sequence of [`PaymentItem`](https://www.w3.org/TR/payment-request/#dom-paymentitem) dictionaries contains line items for
 the payment request that the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MAY_ display.


Note

`shippingOptions` member


A sequence containing the different shipping options for the user
to choose from.


If an item in the sequence has the
[`selected`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-selected) member set to true, then this
is the shipping option that will be used by default and
[`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption) will be set to the
[`id`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id) of this option without running the
[shipping option changed algorithm](https://www.w3.org/TR/payment-request/#dfn-shipping-option-changed-algorithm). If more than one item
in the sequence has [`selected`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-selected) set to
true, then the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) selects the last one in the
sequence.


The [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions) member is only used if
the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) was constructed with [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions)
and [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) set to true.


Note

`modifiers` member

 A sequence of [`PaymentDetailsModifier`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier) dictionaries that contains
 modifiers for particular payment method identifiers. For example,
 it allows you to adjust the total amount based on payment method.


### 6.2 `PaymentDetailsInit` dictionary

[Permalink for Section 6.2](https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary)

```
WebIDLdictionary PaymentDetailsInit : PaymentDetailsBase {
  DOMString id;
  required PaymentItem total;
};
```

Note

In addition to the members inherited from the [`PaymentDetailsBase`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase)
dictionary, the following members are part of the
[`PaymentDetailsInit`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit) dictionary:


`id` member

 A free-form identifier for this payment request.


Note

`total` member

 A [`PaymentItem`](https://www.w3.org/TR/payment-request/#dom-paymentitem) containing a non-negative total amount for the
 payment request.


Note

### 6.3 `PaymentDetailsUpdate` dictionary

[Permalink for Section 6.3](https://www.w3.org/TR/payment-request/#paymentdetailsupdate-dictionary)

```
WebIDLdictionary PaymentDetailsUpdate : PaymentDetailsBase {
  DOMString error;
  PaymentItem total;
  AddressErrors shippingAddressErrors;
  PayerErrors payerErrors;
  object paymentMethodErrors;
};
```

The [`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) dictionary is used to update the payment
request using [`updateWith`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) `()`.


In addition to the members inherited from the [`PaymentDetailsBase`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase)
dictionary, the following members are part of the
[`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) dictionary:


`error` member

 A human-readable string that explains why goods cannot be shipped
 to the chosen shipping address, or any other reason why no shipping
 options are available. When the payment request is updated using
 [`updateWith`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) `()`, the
 [`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) can contain a message in the
 [`error`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-error) member that will be displayed to the
 user if the [`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) indicates that there are no
 valid [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions) (and the
 [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) was constructed with the
 [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) option set to true).
 `total` member

 A [`PaymentItem`](https://www.w3.org/TR/payment-request/#dom-paymentitem) containing a non-negative [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount).


Note

Algorithms in this specification that accept a
[`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) dictionary will throw if the
[`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-total). [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount). [`value`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-value)
is a negative number.


`shippingAddressErrors` member

 Represents validation errors with the shipping address that is
 associated with the [potential event target](https://dom.spec.whatwg.org/#potential-event-target).
 `payerErrors` member

 Validation errors related to the [payer details](https://www.w3.org/TR/payment-request/#dfn-payer-details).
 `paymentMethodErrors` member


[Payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) specific errors.


## 7\. `PaymentDetailsModifier` dictionary

[Permalink for Section 7.](https://www.w3.org/TR/payment-request/#paymentdetailsmodifier-dictionary)

```
WebIDLdictionary PaymentDetailsModifier {
  required DOMString supportedMethods;
  PaymentItem total;
  sequence<PaymentItem> additionalDisplayItems;
  object data;
};
```

The [`PaymentDetailsModifier`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier) dictionary provides details that modify
the [`PaymentDetailsBase`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase) based on a [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi).
It contains the following members:


`supportedMethods` member

 A [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi). The members of the
 [`PaymentDetailsModifier`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier) only apply if the user selects this
 [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method).
 `total` member

 A [`PaymentItem`](https://www.w3.org/TR/payment-request/#dom-paymentitem) value that overrides the
 [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-total) member in the [`PaymentDetailsInit`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit)
 dictionary for the [payment method identifiers](https://www.w3.org/TR/payment-method-id/#dfn-pmi) of the
 [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-supportedmethods) member.
 `additionalDisplayItems` member

 A sequence of [`PaymentItem`](https://www.w3.org/TR/payment-request/#dom-paymentitem) dictionaries provides additional
 display items that are appended to the
 [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems) member in the
 [`PaymentDetailsBase`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase) dictionary for the [payment method\\
 identifiers](https://www.w3.org/TR/payment-method-id/#dfn-pmi) in the [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-supportedmethods)
 member. This member is commonly used to add a discount or surcharge
 line item indicating the reason for the different
 [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-total) amount for the selected [payment\\
 method](https://www.w3.org/TR/payment-request/#dfn-payment-method) that the user agent _MAY_ display.


Note

It is the developer's responsibility to verify that the
[`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-total) amount is the sum of the
[`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems) and the
[`additionalDisplayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-additionaldisplayitems).


`data` member

 An object that provides optional information that might be needed by
 the supported payment methods. If supplied, it will be [serialized](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string).


## 8\. `PaymentShippingType` enum

[Permalink for Section 8.](https://www.w3.org/TR/payment-request/#paymentshippingtype-enum)

```
WebIDLenum PaymentShippingType {
  "shipping",
  "delivery",
  "pickup"
};
```

 "`shipping`"

 This is the default and refers to the [address](https://www.w3.org/TR/contact-picker/#physical-address)
 being collected as the destination for [shipping](https://www.w3.org/TR/payment-request/#dfn-shipping-address).

 "`delivery`"

 This refers to the [address](https://www.w3.org/TR/contact-picker/#physical-address) being collected as
 the destination for delivery. This is commonly faster than [shipping](https://www.w3.org/TR/payment-request/#dfn-shipping-address). For example, it might be used for food delivery.

 "`pickup`"

 This refers to the [address](https://www.w3.org/TR/contact-picker/#physical-address) being collected as
 part of a service pickup. For example, this could be the address for
 laundry pickup.


## 9\. `PaymentOptions` dictionary

[Permalink for Section 9.](https://www.w3.org/TR/payment-request/#paymentoptions-dictionary)

```
WebIDLdictionary PaymentOptions {
  boolean requestPayerName = false;
  boolean requestBillingAddress = false;
  boolean requestPayerEmail = false;
  boolean requestPayerPhone = false;
  boolean requestShipping = false;
  PaymentShippingType shippingType = "shipping";
};
```

Note

The [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) dictionary is passed to the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest)
constructor and provides information about the options desired for the
payment request.


`requestBillingAddress` member

 A boolean that indicates whether the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_ collect
 and return the [billing address](https://www.w3.org/TR/payment-request/#dfn-billing-address) associated with a [payment\\
 method](https://www.w3.org/TR/payment-request/#dfn-payment-method) (e.g., the billing address associated with a credit card).
 Typically, the user agent will return the billing address as part of
 the [`PaymentMethodChangeEvent`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent)'s
 [`methodDetails`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methoddetails). A merchant can use this
 information to, for example, calculate tax in certain jurisdictions
 and update the displayed total. See below for privacy considerations
 regarding [exposing user information](https://www.w3.org/TR/payment-request/#user-info).
 `requestPayerName` member

 A boolean that indicates whether the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_ collect
 and return the payer's name as part of the payment request. For
 example, this would be set to true to allow a merchant to make a
 booking in the payer's name.
 `requestPayerEmail` member

 A boolean that indicates whether the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_ collect
 and return the payer's email address as part of the payment request.
 For example, this would be set to true to allow a merchant to email a
 receipt.
 `requestPayerPhone` member

 A boolean that indicates whether the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_ collect
 and return the payer's phone number as part of the payment request.
 For example, this would be set to true to allow a merchant to phone a
 customer with a billing enquiry.
 `requestShipping` member

 A boolean that indicates whether the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_ collect
 and return a [shipping address](https://www.w3.org/TR/payment-request/#dfn-shipping-address) as part of the payment request. For
 example, this would be set to true when physical goods need to be
 shipped by the merchant to the user. This would be set to false for
 the purchase of digital goods.
 `shippingType` member

 A [`PaymentShippingType`](https://www.w3.org/TR/payment-request/#dom-paymentshippingtype) enum value. Some transactions require an
 [address](https://www.w3.org/TR/contact-picker/#physical-address) for delivery but the term "shipping"
 isn't appropriate. For example, "pizza delivery" not "pizza shipping"
 and "laundry pickup" not "laundry shipping". If
 [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) is set to true, then the
 [`shippingType`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-shippingtype) member can influence the way the
 [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) presents the user interface for gathering the
 shipping address.


The [`shippingType`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-shippingtype) member only affects the user
interface for the payment request.


## 10\. `PaymentItem` dictionary

[Permalink for Section 10.](https://www.w3.org/TR/payment-request/#paymentitem-dictionary)

```
WebIDLdictionary PaymentItem {
  required DOMString label;
  required PaymentCurrencyAmount amount;
  boolean pending = false;
};
```

A sequence of one or more [`PaymentItem`](https://www.w3.org/TR/payment-request/#dom-paymentitem) dictionaries is included in
the [`PaymentDetailsBase`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase) dictionary to indicate what the payment
request is for and the value asked for.


`label` member

 A human-readable description of the item. The [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) may
 display this to the user.


Note: Internationalization of the label

`amount` member

 A [`PaymentCurrencyAmount`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount) containing the monetary amount for the
 item.
 `pending` member

 A boolean. When set to true it means that the [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount)
 member is not final. This is commonly used to show items such as
 shipping or tax amounts that depend upon selection of shipping
 address or shipping option. [User agents](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MAY_ indicate pending
 fields in the user interface for the payment request.


## 11\. `PaymentCompleteDetails` dictionary

[Permalink for Section 11.](https://www.w3.org/TR/payment-request/#paymentcompletedetails-dictionary)

```
WebIDLdictionary PaymentCompleteDetails {
  object? data = null;
};
```

The [`PaymentCompleteDetails`](https://www.w3.org/TR/payment-request/#dom-paymentcompletedetails) dictionary provides additional
information from the merchant website to the payment handler when the
payment request completes.


The [`PaymentCompleteDetails`](https://www.w3.org/TR/payment-request/#dom-paymentcompletedetails) dictionary contains the following
members:


`data` member

 An object that provides optional information that might be needed by
 the [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) associated [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method). If supplied,
 it will be [serialize](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string).


## 12\. `PaymentComplete` enum

[Permalink for Section 12.](https://www.w3.org/TR/payment-request/#paymentcomplete-enum)

```
WebIDLenum PaymentComplete {
  "fail",
  "success",
  "unknown"
};
```

 "`fail`"

 Indicates that processing of the payment failed. The [user\\
 agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MAY_ display UI indicating failure.

 "`success`"

 Indicates the payment was successfully processed. The [user\\
 agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MAY_ display UI indicating success.

 "`unknown`"

 The developer did not indicate success or failure and the [user\\
 agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD NOT_ display UI indicating success or failure.


## 13\. `PaymentShippingOption` dictionary

[Permalink for Section 13.](https://www.w3.org/TR/payment-request/#paymentshippingoption-dictionary)

```
WebIDLdictionary PaymentShippingOption {
  required DOMString id;
  required DOMString label;
  required PaymentCurrencyAmount amount;
  boolean selected = false;
};
```

The [`PaymentShippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption) dictionary has members describing a
shipping option. Developers can provide the user with one or more
shipping options by calling the
[`updateWith`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) `()` method in response to a
change event.


`id` member

 A string identifier used to reference this [`PaymentShippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption).
 It _MUST_ be unique for a given [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest).
 `label` member

 A human-readable string description of the item. The [user\\
 agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_ use this string to display the shipping option to
 the user.
 `amount` member

 A [`PaymentCurrencyAmount`](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount) containing the monetary amount for the
 item.
 `selected` member

 A boolean. When true, it indicates that this is the default selected
 [`PaymentShippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption) in a sequence. [User agents](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_
 display this option by default in the user interface.


## 14\. `PaymentResponse` interface

[Permalink for Section 14.](https://www.w3.org/TR/payment-request/#paymentresponse-interface)

```
WebIDL[SecureContext, Exposed=Window]
interface PaymentResponse : EventTarget  {
  [Default] object toJSON();

  readonly attribute DOMString requestId;
  readonly attribute DOMString methodName;
  readonly attribute object details;
  readonly attribute ContactAddress? shippingAddress;
  readonly attribute DOMString? shippingOption;
  readonly attribute DOMString? payerName;
  readonly attribute DOMString? payerEmail;
  readonly attribute DOMString? payerPhone;

  [NewObject]
  Promise<undefined> complete(
    optional PaymentComplete result = "unknown",
    optional PaymentCompleteDetails details = {}
  );
  [NewObject]
  Promise<undefined> retry(optional PaymentValidationErrors errorFields = {});

  attribute EventHandler onpayerdetailchange;
};
```

Note

A [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) is returned when a user has selected a payment
method and approved a payment request.


### 14.1 `retry()` method

[Permalink for Section 14.1](https://www.w3.org/TR/payment-request/#retry-method)

Note

The `retry(errorFields)` method
_MUST_ act as follows:


01. Let response be [this](https://webidl.spec.whatwg.org/#this).

02. Let request be
     response. [`[[request]]`](https://www.w3.org/TR/payment-request/#dfn-request).

03. Let document be request's [relevant global\\
     object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global)'s [associated `Document`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-document-window).

04. If
     document is not [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active), then return [a promise\\
     rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

05. If response. [`[[complete]]`](https://www.w3.org/TR/payment-request/#dfn-complete) is true, return
     [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)"
     [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

06. If response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) is not null,
     return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)"
     [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

07. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
     " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)".

08. Let retryPromise be [a new promise](https://webidl.spec.whatwg.org/#a-new-promise).

09. Set response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) to
     retryPromise.

10. If errorFields was passed:

    1. Optionally, show a warning in the developer console if any of
        the following are true:
       1. request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options). [`requestPayerName`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayername)
           is false, and
           errorFields. [`payer`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-payer). [`name`](https://www.w3.org/TR/payment-request/#dom-payererrors-name)
           is present.

       2. request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options). [`requestPayerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayeremail)
           is false, and
           errorFields. [`payer`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-payer). [`email`](https://www.w3.org/TR/payment-request/#dom-payererrors-email)
           is present.

       3. request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options). [`requestPayerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayerphone)
           is false, and
           errorFields. [`payer`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-payer). [`phone`](https://www.w3.org/TR/payment-request/#dom-payererrors-phone)
           is present.

       4. request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options). [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping)
           is false, and
           errorFields. [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-shippingaddress) is
           present.
    2. If
        errorFields. [`paymentMethod`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-paymentmethod)
        member was passed, and if required by the specification that
        defines response. [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-methodname), then
        [convert](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) errorFields's
        [`paymentMethod`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-paymentmethod) member to an IDL value
        of the type specified there. Otherwise, [convert](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) to [`object`](https://webidl.spec.whatwg.org/#idl-object).

    3. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
        [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.

    4. If conversion results in a [exception](https://webidl.spec.whatwg.org/#dfn-exception) error:

       1. Reject retryPromise with error.

       2. Set [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent)'s [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing)
           boolean to false.

       3. Return.
    5. By matching the members of errorFields to input fields in
        the user agent's UI, indicate to the end user that something is
        wrong with the data of the payment response. For example, a user
        agent might draw the user's attention to the erroneous
        errorFields in the browser's UI and display the value of each
        field in a manner that helps the user fix each error. Similarly,
        if the [`error`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-error) member is passed,
        present the error in the user agent's UI. In the case where the
        value of a member is the empty string, the user agent _MAY_
        substitute a value with a suitable error message.
11. Otherwise, if errorFields was not passed, signal to the end
     user to attempt to retry the payment. Re-enable any UI element that
     affords the end user the ability to retry accepting the payment
     request.

12. If
     document stops being [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active) while the user
     interface is being shown, or no longer is by the time this step is
     reached, then:    1. Close down the user interface.

    2. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
        [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.
13. Finally, when retryPromise settles, set
     response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) to null.

14. Return retryPromise.



    Note




    The retryPromise will later be resolved by the [user accepts\\
    the payment request algorithm](https://www.w3.org/TR/payment-request/#dfn-user-accepts-the-payment-request-algorithm), or rejected by either the
    [user aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request) or [abort the\\
    update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update).



#### 14.1.1 `PaymentValidationErrors` dictionary

[Permalink for Section 14.1.1](https://www.w3.org/TR/payment-request/#paymentvalidationerrors-dictionary)

```
WebIDLdictionary PaymentValidationErrors {
  PayerErrors payer;
  AddressErrors shippingAddress;
  DOMString error;
  object paymentMethod;
};
```

`payer` member

 Validation errors related to the [payer details](https://www.w3.org/TR/payment-request/#dfn-payer-details).
 `shippingAddress` member

 Represents validation errors with the [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse)'s
 [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingaddress).
 `error` member

 A general description of an error with the payment from which the
 user can attempt to recover. For example, the user may recover by
 retrying the payment. A developer can optionally pass the
 [`error`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-error) member on its own to give a
 general overview of validation issues, or it can be passed in
 combination with other members of the [`PaymentValidationErrors`](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors)
 dictionary.


Note: Internationalization of the error

`paymentMethod` member

 A payment method specific errors.


#### 14.1.2 `PayerErrors` dictionary

[Permalink for Section 14.1.2](https://www.w3.org/TR/payment-request/#payererrors-dictionary)

```
WebIDLdictionary PayerErrors {
  DOMString email;
  DOMString name;
  DOMString phone;
};
```

The [`PayerErrors`](https://www.w3.org/TR/payment-request/#dom-payererrors) is used to represent validation errors with one
or more [payer details](https://www.w3.org/TR/payment-request/#dfn-payer-details).


Payer details are any of the payer's name, payer's phone
number, and payer's email.


`email` member

 Denotes that the payer's email suffers from a validation error.
 In the user agent's UI, this member corresponds to the input
 field that provided the [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse)'s
 [`payerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payeremail) attribute's value.
 `name` member

 Denotes that the payer's name suffers from a validation error. In
 the user agent's UI, this member corresponds to the input field
 that provided the [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse)'s
 [`payerName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payername) attribute's value.
 `phone` member

 Denotes that the payer's phone number suffers from a validation
 error. In the user agent's UI, this member corresponds to the
 input field that provided the [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse)'s
 [`payerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payerphone) attribute's value.


[Example 13](https://www.w3.org/TR/payment-request/#example-payer-related-validation-errors): Payer-related validation errors

```hljs js
const payer = {
  email: "The domain is invalid.",
  phone: "Unknown country code.",
  name: "Not in database.",
};
await response.retry({ payer });
```

### 14.2 `methodName` attribute

[Permalink for Section 14.2](https://www.w3.org/TR/payment-request/#methodname-attribute)

The [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) for the [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method)
that the user selected to fulfill the transaction.


### 14.3 `details` attribute

[Permalink for Section 14.3](https://www.w3.org/TR/payment-request/#details-attribute)

An [`object`](https://webidl.spec.whatwg.org/#idl-object) or [dictionary](https://webidl.spec.whatwg.org/#dfn-dictionary) generated by a [payment\\
method](https://www.w3.org/TR/payment-request/#dfn-payment-method) that a merchant can use to process or validate a
transaction (depending on the [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method)).


Note

### 14.4 `shippingAddress` attribute

[Permalink for Section 14.4](https://www.w3.org/TR/payment-request/#shippingaddress-attribute-0)

If the [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) member was set to true in
the [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) passed to the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) constructor,
then [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress) will be the full and final
[shipping address](https://www.w3.org/TR/payment-request/#dfn-shipping-address) chosen by the user.


### 14.5 `shippingOption` attribute

[Permalink for Section 14.5](https://www.w3.org/TR/payment-request/#shippingoption-attribute-0)

If the [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) member was set to true in
the [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) passed to the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) constructor,
then [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption) will be the
[`id`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id) attribute of the selected shipping
option.


### 14.6 `payerName` attribute

[Permalink for Section 14.6](https://www.w3.org/TR/payment-request/#payername-attribute)

If the [`requestPayerName`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayername) member was set to true in
the [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) passed to the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) constructor,
then [`payerName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payername) will be the name provided by the
user.


### 14.7 `payerEmail` attribute

[Permalink for Section 14.7](https://www.w3.org/TR/payment-request/#payeremail-attribute)

If the [`requestPayerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayeremail) member was set to true in
the [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) passed to the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) constructor,
then [`payerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payeremail) will be the email address chosen
by the user.


### 14.8 `payerPhone` attribute

[Permalink for Section 14.8](https://www.w3.org/TR/payment-request/#payerphone-attribute)

If the [`requestPayerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayerphone) member was set to true in
the [`PaymentOptions`](https://www.w3.org/TR/payment-request/#dom-paymentoptions) passed to the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) constructor,
then [`payerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payerphone) will be the phone number chosen
by the user.


### 14.9 `requestId` attribute

[Permalink for Section 14.9](https://www.w3.org/TR/payment-request/#requestid-attribute)

The corresponding payment request [`id`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-id) that spawned
this payment response.


### 14.10 `complete()` method

[Permalink for Section 14.10](https://www.w3.org/TR/payment-request/#complete-method)

Note

The [`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()` method is called after the user
has accepted the payment request and the
[`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise) has been resolved. Calling the
[`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()` method tells the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent)
that the payment interaction is over (and _SHOULD_ cause any remaining
user interface to be closed).


After the payment request has been accepted and the
[`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) returned to the caller, but before the caller
calls [`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()`, the payment request user
interface remains in a pending state. At this point the user
interface _SHOULD NOT_ offer a cancel command because acceptance of the
payment request has been returned. However, if something goes wrong
and the developer never calls [`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()` then the
user interface is blocked.


For this reason, implementations _MAY_ impose a timeout for developers
to call [`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()`. If the timeout expires then
the implementation will behave as if [`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()`
was called with no arguments.


The [`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()` method _MUST_ act as follows:


01. Let response be [this](https://webidl.spec.whatwg.org/#this).

02. If response. [`[[complete]]`](https://www.w3.org/TR/payment-request/#dfn-complete) is true, return
     [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)"
     [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

03. If response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) is not null,
     return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)"
     [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

04. Let promise be [a new promise](https://webidl.spec.whatwg.org/#a-new-promise).

05. Let serializedData be the result of [serialize](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string) details. [`data`](https://www.w3.org/TR/payment-request/#dom-paymentcompletedetails-data) into a JSON string.

06. If serializing [throws](https://webidl.spec.whatwg.org/#dfn-throw) an exception, return [a\\
     promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) that exception.

07. If required by the specification that defines the
     response. [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-methodname):
     1. Let json be the result of calling `JSON`'s [`parse`](https://tc39.es/ecma262/multipage/structured-data.html#sec-json.parse) `()`
        with serializedData.

    2. Let idl be the result of [converting](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) json to an IDL value of the type specified
        by the specification that defines the
        response. [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-methodname).

    3. If the conversion to an IDL value [throws](https://webidl.spec.whatwg.org/#dfn-throw) an
        [exception](https://webidl.spec.whatwg.org/#dfn-exception), return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) that
        exception.

    4. If required by the specification that defines the
        response. [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-methodname), validate the members
        of idl. If a member's value is invalid, return [a promise\\
        rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) a [`TypeError`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-native-error-types-used-in-this-standard-typeerror).



       Note: Opportunity to recover
08. Set response. [`[[complete]]`](https://www.w3.org/TR/payment-request/#dfn-complete) to true.

09. Return promise and perform the remaining steps [in\\
     parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel).

10. If document stops being [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active) while the
     user interface is being shown, or no longer is by the time this step
     is reached, then:

    1. Close down the user interface.

    2. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
        [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.
11. Otherwise:
    1. Close down any remaining user interface. The [user\\
        agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MAY_ use the value result and serializedData to
        influence the user experience.

    2. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
        [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.

    3. Resolve promise with undefined.

### 14.11 `onpayerdetailchange` attribute

[Permalink for Section 14.11](https://www.w3.org/TR/payment-request/#onpayerdetailchange-attribute)

Allows a developer to handle " [`payerdetailchange`](https://www.w3.org/TR/payment-request/#dfn-payerdetailchange)" events.


### 14.12   Internal Slots

[Permalink for Section 14.12](https://www.w3.org/TR/payment-request/#internal-slots-0)

Instances of [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) are created with the [internal slots](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) in the following table:


| Internal Slot | Description ( _non-normative_) |
| --- | --- |
| \[\[complete\]\] | Is true if the request for payment has completed (i.e.,<br> [`complete`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) `()` was called, or there was a fatal<br> error that made the response not longer usable), or false<br> otherwise. |
| \[\[request\]\] | The [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) instance that instantiated this<br> [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse). |
| \[\[retryPromise\]\] | Null, or a [`Promise`](https://webidl.spec.whatwg.org/#idl-promise) that resolves when a [user accepts the\<br> payment request](https://www.w3.org/TR/payment-request/#dfn-user-accepts-the-payment-request-algorithm) or rejects if the [user aborts the payment\<br> request](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request). |

## 15\.   Shipping and billing addresses

[Permalink for Section 15.](https://www.w3.org/TR/payment-request/#shipping-and-billing-addresses)

The [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) interface allows a merchant to request from the
user [physical addresses](https://www.w3.org/TR/contact-picker/#physical-address) for the purposes of
shipping and/or billing. A shipping address and billing
address are [physical addresses](https://www.w3.org/TR/contact-picker/#physical-address).


### 15.1 `AddressErrors` dictionary

[Permalink for Section 15.1](https://www.w3.org/TR/payment-request/#addresserrors-dictionary)

```
WebIDLdictionary AddressErrors {
  DOMString addressLine;
  DOMString city;
  DOMString country;
  DOMString dependentLocality;
  DOMString organization;
  DOMString phone;
  DOMString postalCode;
  DOMString recipient;
  DOMString region;
  DOMString sortingCode;
};
```

The members of the [`AddressErrors`](https://www.w3.org/TR/payment-request/#dom-addresserrors) dictionary represent validation
errors with specific parts of a [physical address](https://www.w3.org/TR/contact-picker/#physical-address). Each dictionary
member has a dual function: firstly, its presence denotes that a
particular part of an address is suffering from a validation error.
Secondly, the string value allows the developer to describe the
validation error (and possibly how the end user can fix the error).


Note

Developers need to be aware that users might not have the ability to
fix certain parts of an address. As such, they need to be mindful not
to ask the user to fix things they might not have control over.


`addressLine` member

 Denotes that the [address line](https://www.w3.org/TR/contact-picker/#physical-address-address-line) has a validation
 error. In the user agent's UI, this member corresponds to the input
 field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`addressLine`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-addressline) attribute's value.
 `city` member

 Denotes that the [city](https://www.w3.org/TR/contact-picker/#physical-address-city) has a validation error.
 In the user agent's UI, this member corresponds to the input field
 that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s [`city`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-city)
 attribute's value.
 `country` member

 Denotes that the [country](https://www.w3.org/TR/contact-picker/#physical-address-country) has a validation
 error. In the user agent's UI, this member corresponds to the input
 field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`country`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-country) attribute's value.
 `dependentLocality` member

 Denotes that the [dependent locality](https://www.w3.org/TR/contact-picker/#physical-address-dependent-locality) has a
 validation error. In the user agent's UI, this member corresponds
 to the input field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`dependentLocality`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-dependentlocality) attribute's value.
 `organization` member

 Denotes that the [organization](https://www.w3.org/TR/contact-picker/#physical-address-organization) has a validation
 error. In the user agent's UI, this member corresponds to the input
 field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`organization`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-organization) attribute's value.
 `phone` member

 Denotes that the [phone number](https://www.w3.org/TR/contact-picker/#physical-address-phone-number) has a validation
 error. In the user agent's UI, this member corresponds to the input
 field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`phone`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-phone) attribute's value.
 `postalCode` member

 Denotes that the [postal code](https://www.w3.org/TR/contact-picker/#physical-address-postal-code) has a validation
 error. In the user agent's UI, this member corresponds to the input
 field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`postalCode`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-postalcode) attribute's value.
 `recipient` member

 Denotes that the [recipient](https://www.w3.org/TR/contact-picker/#physical-address-recipient) has a validation
 error. In the user agent's UI, this member corresponds to the input
 field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`addressLine`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-addressline) attribute's value.
 `region` member

 Denotes that the [region](https://www.w3.org/TR/contact-picker/#physical-address-region) has a validation
 error. In the user agent's UI, this member corresponds to the input
 field that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`region`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-region) attribute's value.
 `sortingCode` member

 The [sorting code](https://www.w3.org/TR/contact-picker/#physical-address-sorting-code) has a validation error. In
 the user agent's UI, this member corresponds to the input field
 that provided the [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress)'s
 [`sortingCode`](https://www.w3.org/TR/contact-picker/#dom-contactaddress-sortingcode) attribute's value.


## 16\.   Permissions Policy integration

[Permalink for Section 16.](https://www.w3.org/TR/payment-request/#permissions-policy)

This specification defines a [policy-controlled feature](https://www.w3.org/TR/permissions-policy-1/#policy-controlled-feature) identified
by the string "payment"
\[[permissions-policy](https://www.w3.org/TR/payment-request/#bib-permissions-policy "Permissions Policy")\]. Its [default allowlist](https://www.w3.org/TR/permissions-policy-1/#policy-controlled-feature-default-allowlist) is ['self'](https://www.w3.org/TR/permissions-policy-1/#default-allowlist-self).


Note

## 17\.   Events

[Permalink for Section 17.](https://www.w3.org/TR/payment-request/#events)

### 17.1   Summary

[Permalink for Section 17.1](https://www.w3.org/TR/payment-request/#summary)

_This section is non-normative._

| Event name | Interface | Dispatched when… | Target |
| --- | --- | --- | --- |
| `shippingaddresschange` | [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) | The user provides a new shipping address. | [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) |
| `shippingoptionchange` | [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) | The user chooses a new shipping option. | [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) |
| `payerdetailchange` | [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) | The user changes the payer name, the payer email, or the payer<br> phone (see [payer detail changed algorithm](https://www.w3.org/TR/payment-request/#dfn-payer-detail-changed-algorithm)). | [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) |
| `paymentmethodchange` | [`PaymentMethodChangeEvent`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent) | The user chooses a different [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) within a<br> [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler). | [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) |

### 17.2 `PaymentMethodChangeEvent` interface

[Permalink for Section 17.2](https://www.w3.org/TR/payment-request/#paymentmethodchangeevent-interface)

```
WebIDL[SecureContext, Exposed=Window]
interface PaymentMethodChangeEvent : PaymentRequestUpdateEvent {
  constructor(DOMString type, optional PaymentMethodChangeEventInit eventInitDict = {});
  readonly attribute DOMString methodName;
  readonly attribute object? methodDetails;
};
```

#### 17.2.1 `methodDetails` attribute

[Permalink for Section 17.2.1](https://www.w3.org/TR/payment-request/#methoddetails-attribute)

When getting, returns the value it was initialized with. See
[`methodDetails`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeeventinit-methoddetails) member of
[`PaymentMethodChangeEventInit`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeeventinit) for more information.


#### 17.2.2 `methodName` attribute

[Permalink for Section 17.2.2](https://www.w3.org/TR/payment-request/#methodname-attribute-0)

When getting, returns the value it was initialized with. See
[`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeeventinit-methodname) member of
[`PaymentMethodChangeEventInit`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeeventinit) for more information.


#### 17.2.3 `PaymentMethodChangeEventInit` dictionary

[Permalink for Section 17.2.3](https://www.w3.org/TR/payment-request/#paymentmethodchangeeventinit-dictionary)

```
WebIDLdictionary PaymentMethodChangeEventInit : PaymentRequestUpdateEventInit {
  DOMString methodName = "";
  object? methodDetails = null;
};
```

`methodName` member

 A string representing the [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi).
 `methodDetails` member

 An object representing some data from the payment method, or
 null.


### 17.3 `PaymentRequestUpdateEvent` interface

[Permalink for Section 17.3](https://www.w3.org/TR/payment-request/#paymentrequestupdateevent-interface)

```
WebIDL[SecureContext, Exposed=Window]
interface PaymentRequestUpdateEvent : Event {
  constructor(DOMString type, optional PaymentRequestUpdateEventInit eventInitDict = {});
  undefined updateWith(Promise<PaymentDetailsUpdate> detailsPromise);
};
```

The [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) enables developers to update the
details of the payment request in response to a user interaction.


#### 17.3.1 `Constructor`

[Permalink for Section 17.3.1](https://www.w3.org/TR/payment-request/#constructor-0)

The [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent)'s
[`constructor`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-constructor) `(type, eventInitDict)` _MUST_
act as follows:


1. Let event be the result of calling
    the [constructor](https://dom.spec.whatwg.org/#concept-event-constructor) of [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) with
    type and eventInitDict.

2. Set event. [`[[waitForUpdate]]`](https://www.w3.org/TR/payment-request/#dfn-waitforupdate) to
    false.

3. Return event.


#### 17.3.2 `updateWith()` method

[Permalink for Section 17.3.2](https://www.w3.org/TR/payment-request/#updatewith-method)

Note

The [`updateWith`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) `()` with
detailsPromise method _MUST_ act as follows:


01. Let event be [this](https://webidl.spec.whatwg.org/#this).

02. If event's [`isTrusted`](https://dom.spec.whatwg.org/#dom-event-istrusted) attribute is false, then
     [throw](https://webidl.spec.whatwg.org/#dfn-throw) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

03. If event. [`[[waitForUpdate]]`](https://www.w3.org/TR/payment-request/#dfn-waitforupdate) is
     true, then [throw](https://webidl.spec.whatwg.org/#dfn-throw) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)"
     [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

04. If event's [target](https://dom.spec.whatwg.org/#event-target) is an instance of
     [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse), let request be event's
     [target](https://dom.spec.whatwg.org/#event-target)'s [`[[request]]`](https://www.w3.org/TR/payment-request/#dfn-request).

05. Otherwise, let request be the value of
     event's [target](https://dom.spec.whatwg.org/#event-target).

06. [Assert](https://infra.spec.whatwg.org/#assert): request is an instance of [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest).

07. If request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is not
     " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)", then [throw](https://webidl.spec.whatwg.org/#dfn-throw) an
     " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

08. If request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) is true, then
     [throw](https://webidl.spec.whatwg.org/#dfn-throw) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

09. Set event's [stop propagation flag](https://dom.spec.whatwg.org/#stop-propagation-flag) and [stop immediate propagation flag](https://dom.spec.whatwg.org/#stop-immediate-propagation-flag).

10. Set event. [`[[waitForUpdate]]`](https://www.w3.org/TR/payment-request/#dfn-waitforupdate) to
     true.

11. Let pmi be null.

12. If event has a [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methodname)
     attribute, set pmi to the [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methodname)
     attribute's value.

13. Run the [update a `PaymentRequest`'s details\\
     algorithm](https://www.w3.org/TR/payment-request/#dfn-update-a-paymentrequest-s-details-algorithm) with detailsPromise, request, and pmi.


#### 17.3.3   Internal Slots

[Permalink for Section 17.3.3](https://www.w3.org/TR/payment-request/#internal-slots-1)

Instances of [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) are created with the
[internal slots](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) in the following table:


| Internal Slot | Description ( _non-normative_) |
| --- | --- |
| \[\[waitForUpdate\]\] | A boolean indicating whether an<br> [`updateWith`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) `()`-initiated update is<br> currently in progress. |

#### 17.3.4 `PaymentRequestUpdateEventInit` dictionary

[Permalink for Section 17.3.4](https://www.w3.org/TR/payment-request/#paymentrequestupdateeventinit-dictionary)

```
WebIDLdictionary PaymentRequestUpdateEventInit : EventInit {};
```

## 18\.   Algorithms

[Permalink for Section 18.](https://www.w3.org/TR/payment-request/#algorithms)

When the [internal slot](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) of a
[`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object is set to " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)",
the [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) will trigger the following algorithms based on
user interaction.


### 18.1   Can make payment algorithm

[Permalink for Section 18.1](https://www.w3.org/TR/payment-request/#can-make-payment-algorithm)

The can make payment algorithm checks if the [user\\
agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) supports making payment with the [payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method)
with which the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) was constructed.


1. Let request be the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object on
    which the method was called.

2. If request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is not
    " [created](https://www.w3.org/TR/payment-request/#dfn-created)", then return [a promise rejected\\
    with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) an " [`InvalidStateError`](https://webidl.spec.whatwg.org/#invalidstateerror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

3. Optionally, at the [top-level browsing\\
    context](https://html.spec.whatwg.org/multipage/document-sequences.html#top-level-browsing-context)'s discretion, return [a promise rejected with](https://webidl.spec.whatwg.org/#a-promise-rejected-with) a
    " [`NotAllowedError`](https://webidl.spec.whatwg.org/#notallowederror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).



   Note




   This allows user agents to apply heuristics to detect and prevent
   abuse of the calling method for fingerprinting purposes, such as
   creating [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) objects with a variety of supported
   [payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method) and triggering the [can make payment\\
   algorithm](https://www.w3.org/TR/payment-request/#dfn-can-make-payment-algorithm) on them one after the other. For example, a user
   agent may restrict the number of successful calls that can be
   made based on the [top-level browsing context](https://html.spec.whatwg.org/multipage/document-sequences.html#top-level-browsing-context) or the time
   period in which those calls were made.


4. Let hasHandlerPromise be [a new promise](https://webidl.spec.whatwg.org/#a-new-promise).

5. Return hasHandlerPromise, and perform the remaining steps [in\\
    parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel).

6. For each paymentMethod tuple in request.
    [`[[serializedMethodData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmethoddata):

   1. Let identifier be the first element in the paymentMethod
       tuple.

   2. If the user agent has a [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) that supports
       handling payment requests for identifier, resolve
       hasHandlerPromise with true and terminate this algorithm.
7. Resolve hasHandlerPromise with false.


### 18.2   Shipping address changed algorithm

[Permalink for Section 18.2](https://www.w3.org/TR/payment-request/#shipping-address-changed-algorithm)

The shipping address changed algorithm runs when the user
provides a new shipping address. It _MUST_ run the following steps:


1. Let request be the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object
    that the user is interacting with.

2. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to
    run the following steps:
    1. Note: Privacy of recipient information






      The redactList limits the amount of personal information
      about the recipient that the API shares with the merchant.





      For merchants, the resulting [`ContactAddress`](https://www.w3.org/TR/contact-picker/#contactaddress) object
      provides enough information to, for example, calculate
      shipping costs, but, in most cases, not enough information
      to physically locate and uniquely identify the recipient.





      Unfortunately, even with the redactList, recipient
      anonymity cannot be assured. This is because in some
      countries postal codes are so fine-grained that they can
      uniquely identify a recipient.


   2. Let redactList be the empty list. Set redactList to
       « "organization", "phone", "recipient", "addressLine" ».

   3. Let address be the result of running the
       steps to [create a contactaddress from user-provided input](https://www.w3.org/TR/contact-picker/#contactsmanager-create-a-contactaddress-from-user-provided-input) with redactList.

   4. Set request. [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress) to
       address.

   5. Run the [PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#dfn-paymentrequest-updated-algorithm) with
       request and " [`shippingaddresschange`](https://www.w3.org/TR/payment-request/#dfn-shippingaddresschange)".

### 18.3   Shipping option changed algorithm

[Permalink for Section 18.3](https://www.w3.org/TR/payment-request/#shipping-option-changed-algorithm)

The shipping option changed algorithm runs when the user
chooses a new shipping option. It _MUST_ run the following steps:


1. Let request be the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object
    that the user is interacting with.

2. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to
    run the following steps:
    1. Set the [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption) attribute on
       request to the `id` string of the
       [`PaymentShippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption) provided by the user.

   2. Run the [PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#dfn-paymentrequest-updated-algorithm) with
       request and " [`shippingoptionchange`](https://www.w3.org/TR/payment-request/#dfn-shippingoptionchange)".

### 18.4   Payment method changed algorithm

[Permalink for Section 18.4](https://www.w3.org/TR/payment-request/#payment-method-changed-algorithm)

A [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) _MAY_ run the payment method changed algorithm
when the user changes [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) with methodDetails,
which is a [dictionary](https://webidl.spec.whatwg.org/#dfn-dictionary) or an [`object`](https://webidl.spec.whatwg.org/#idl-object) or null, and a
methodName, which is a DOMString that represents the [payment\\
method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) of the [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) the user is
interacting with.


Note: Privacy of information shared by paymentmethodchange event

When the user selects or changes a payment method (e.g., a credit
card), the [`PaymentMethodChangeEvent`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent) includes redacted billing
address information for the purpose of performing tax calculations.
Redacted attributes include, but are not limited to, [address line](https://www.w3.org/TR/contact-picker/#physical-address-address-line), [dependent locality](https://www.w3.org/TR/contact-picker/#physical-address-dependent-locality),
[organization](https://www.w3.org/TR/contact-picker/#physical-address-organization), [phone number](https://www.w3.org/TR/contact-picker/#physical-address-phone-number),
and [recipient](https://www.w3.org/TR/contact-picker/#physical-address-recipient).


1. Let request be the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object
    that the user is interacting with.

2. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to
    run the following steps:
    1. [Assert](https://infra.spec.whatwg.org/#assert): request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) is false.
       Only one update can take place at a time.

   2. [Assert](https://infra.spec.whatwg.org/#assert): request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is
       " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)".

   3. [Fire an event](https://dom.spec.whatwg.org/#concept-event-fire) named " [`paymentmethodchange`](https://www.w3.org/TR/payment-request/#dfn-paymentmethodchange)" at
       request using [`PaymentMethodChangeEvent`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent), with its
       [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methodname) attribute initialized
       to methodName, and its
       [`methodDetails`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methoddetails) attribute
       initialized to methodDetails.

### 18.5   PaymentRequest updated algorithm

[Permalink for Section 18.5](https://www.w3.org/TR/payment-request/#paymentrequest-updated-algorithm)

The PaymentRequest updated algorithm is run by other
algorithms above to [fire an event](https://dom.spec.whatwg.org/#concept-event-fire) to indicate that a user has
made a change to a [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) called request with an event
name of name:


1. [Assert](https://infra.spec.whatwg.org/#assert): request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) is false. Only
    one update can take place at a time.

2. [Assert](https://infra.spec.whatwg.org/#assert): request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is
    " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)".

3. Let event be the result of
    [creating an event](https://dom.spec.whatwg.org/#concept-event-create) using the [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent)
    interface.

4. Initialize event's [`type`](https://dom.spec.whatwg.org/#dom-event-type) attribute to name.

5. [Dispatch](https://dom.spec.whatwg.org/#concept-event-dispatch) event at request.

6. If event. [`[[waitForUpdate]]`](https://www.w3.org/TR/payment-request/#dfn-waitforupdate) is
    true, disable any part of the user interface that could cause another
    update event to be fired.

7. Otherwise, set
    event. [`[[waitForUpdate]]`](https://www.w3.org/TR/payment-request/#dfn-waitforupdate) to true.


### 18.6   Payer detail changed algorithm

[Permalink for Section 18.6](https://www.w3.org/TR/payment-request/#payer-detail-changed-algorithm)

The user agent _MUST_ run the payer detail changed algorithm
when the user changes the payer name, or the payer email, or the
payer phone in the user interface:


1. Let request be the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object
    that the user is interacting with.

2. If request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response) is null, return.

3. Let response be
    request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response).

4. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to
    run the following steps:
    01. [Assert](https://infra.spec.whatwg.org/#assert): request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) is false.

   02. [Assert](https://infra.spec.whatwg.org/#assert): request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is
        " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)".

   03. Let options be
        request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options).

   04. If payer name changed and
        options. [`requestPayerName`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayername) is true:

       1. Set response. [`payerName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payername) attribute to
           payer name.
   05. If payer email changed and
        options. [`requestPayerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayeremail) is true:

       1. Set response. [`payerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payeremail) to payer
           email.
   06. If payer phone changed and
        options. [`requestPayerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayerphone) is true:

       1. Set response. [`payerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payerphone) to payer
           phone.
   07. Let event be the result of
        [creating an event](https://dom.spec.whatwg.org/#concept-event-create) using [`PaymentRequestUpdateEvent`](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent).

   08. Initialize event's [`type`](https://dom.spec.whatwg.org/#dom-event-type) attribute to
        " [`payerdetailchange`](https://www.w3.org/TR/payment-request/#dfn-payerdetailchange)".

   09. [Dispatch](https://dom.spec.whatwg.org/#concept-event-dispatch) event at response.

   10. If event. [`[[waitForUpdate]]`](https://www.w3.org/TR/payment-request/#dfn-waitforupdate) is
        true, disable any part of the user interface that could cause
        another change to the payer details to be fired.

   11. Otherwise, set
        event. [`[[waitForUpdate]]`](https://www.w3.org/TR/payment-request/#dfn-waitforupdate) to true.

### 18.7   User accepts the payment request algorithm

[Permalink for Section 18.7](https://www.w3.org/TR/payment-request/#user-accepts-the-payment-request-algorithm)

The user accepts the payment request algorithm runs
when the user accepts the payment request and confirms that they want
to pay. It _MUST_ [queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task\\
source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to perform the following steps:


01. Let request be the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object
     that the user is interacting with.

02. If the request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) is true, then
     terminate this algorithm and take no further action. The [user\\
     agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) user interface _SHOULD_ ensure that this never occurs.

03. If request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is not
     " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)", then terminate this algorithm and
     take no further action. The [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) user interface _SHOULD_
     ensure that this never occurs.

04. If the [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) value of
     request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options) is true, then if the
     [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress) attribute of request is null or
     if the [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption) attribute of request is
     null, then terminate this algorithm and take no further action. The
     [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _SHOULD_ ensure that this never occurs.

05. Let isRetry be true if
     request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response) is not null, false
     otherwise.

06. Let response be
     request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response) if isRetry is true, or a
     new [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse) otherwise.

07. If isRetry is false, initialize the newly created response:

    1. Set response. [`[[request]]`](https://www.w3.org/TR/payment-request/#dfn-request) to request.

    2. Set response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) to null.

    3. Set response. [`[[complete]]`](https://www.w3.org/TR/payment-request/#dfn-complete) to false.

    4. Set the [`requestId`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-requestid) attribute value of
        response to the value of
        request. [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`id`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-id).

    5. Set request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response) to response.
08. Let handler be
     request. [`[[handler]]`](https://www.w3.org/TR/payment-request/#dfn-handler).

09. Set the [`methodName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-methodname) attribute value of
     response to the [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi) of handler.

10. Set the [`details`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-details) attribute value of response
     to an object resulting from running the handler's [steps to\\
     respond to a payment request](https://www.w3.org/TR/payment-request/#dfn-steps-to-respond-to-a-payment-request).

11. If the [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) value of
     request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options) is false, then set the
     [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingaddress) attribute value of response to
     null. Otherwise:

    1. Let shippingAddress be the result of
        [create a contactaddress from user-provided input](https://www.w3.org/TR/contact-picker/#contactsmanager-create-a-contactaddress-from-user-provided-input)
    2. Set the [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingaddress) attribute value
        of response to shippingAddress.

    3. Set the [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingaddress) attribute value
        of request to shippingAddress.
12. If the [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) value of
     request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options) is true, then set the
     [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingoption) attribute of response to the
     value of the [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingoption) attribute of
     request. Otherwise, set it to null.

13. If the [`requestPayerName`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayername) value of
     request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options) is true, then set the
     [`payerName`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payername) attribute of response to the payer's
     name provided by the user, or to null if none was provided.
     Otherwise, set it to null.

14. If the [`requestPayerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayeremail) value of
     request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options) is true, then set the
     [`payerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payeremail) attribute of response to the payer's
     email address provided by the user, or to null if none was provided.
     Otherwise, set it to null.

15. If the [`requestPayerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayerphone) value of
     request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options) is true, then set the
     [`payerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payerphone) attribute of response to the payer's
     phone number provided by the user, or to null if none was provided.
     When setting the [`payerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payerphone) value, the user agent
     _SHOULD_ format the phone number to adhere to \[[E.164](https://www.w3.org/TR/payment-request/#bib-e.164 "The international public telecommunication numbering plan")\].

16. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
     " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

17. If isRetry is true, resolve
     response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) with undefined.
     Otherwise, resolve request. [`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise)
     with response.


### 18.8   User aborts the payment request algorithm

[Permalink for Section 18.8](https://www.w3.org/TR/payment-request/#user-aborts-the-payment-request-algorithm)

The user aborts the
payment request algorithm runs when the user aborts the payment
request through the currently interactive user interface. It _MUST_ [queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to
perform the following steps:


1. Let request be the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) object
    that the user is interacting with.

2. If request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) is not
    " [interactive](https://www.w3.org/TR/payment-request/#dfn-interactive)", then terminate this algorithm and
    take no further action. The [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) user interface _SHOULD_
    ensure that this never occurs.

3. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
    " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

4. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
    [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.

5. Let error be an " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)" [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).

6. Let response be
    request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response).

7. If response is not null:

   1. Set response. [`[[complete]]`](https://www.w3.org/TR/payment-request/#dfn-complete) to true.

   2. [Assert](https://infra.spec.whatwg.org/#assert): response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) is
       not null.

   3. Reject response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) with
       error.
8. Otherwise, reject request. [`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise)
    with error.

9. Abort the current user interaction and close down any remaining
    user interface.


### 18.9   Update a `PaymentRequest`'s details algorithm

[Permalink for Section 18.9](https://www.w3.org/TR/payment-request/#update-a-paymentrequest-s-details-algorithm)

The update a `PaymentRequest`'s details
algorithm takes a [`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) detailsPromise, a
[`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) request, and pmi that is either a DOMString or
null (a [payment method identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi)). The steps are conditional
on the detailsPromise settling. If detailsPromise never settles
then the payment request is blocked. The user agent _SHOULD_ provide
the user with a means to abort a payment request. Implementations _MAY_
choose to implement a timeout for pending updates if detailsPromise
doesn't settle in a reasonable amount of time.


In the case where a timeout occurs, or the user manually aborts, or
the [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) decides to abort this particular payment,
the user agent _MUST_ run the [user aborts the payment request\\
algorithm](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request).


1. Set request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) to true.

2. [In parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel), disable the user interface that allows the user
    to accept the payment request. This is to ensure that the payment
    is not accepted until the user interface is updated with any new
    details.

3. [Upon rejection](https://webidl.spec.whatwg.org/#upon-rejection) of detailsPromise:
    1. [Abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with request and an " [`AbortError`](https://webidl.spec.whatwg.org/#aborterror)"
       [`DOMException`](https://webidl.spec.whatwg.org/#idl-DOMException).
4. [Upon fulfillment](https://webidl.spec.whatwg.org/#upon-fulfillment) of detailsPromise with value value:
    1. Let details be the result of
       [converting](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) value to a
       [`PaymentDetailsUpdate`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) dictionary. If this [throw](https://webidl.spec.whatwg.org/#dfn-throw)
       an exception, [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with request and with the
       thrown exception.

   2. Let serializedModifierData be an empty list.

   3. Let selectedShippingOption be null.

   4. Let shippingOptions be an empty
       `sequence` < [`PaymentShippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption) >.

   5. Validate and canonicalize the details:
      1. If the [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-total) member of details
          is present, then:

         1. [Check and canonicalize total amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-total-amount) details. [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-total). [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount).
             If an exception is thrown, then [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update)
             with request and that exception.
      2. If the [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems) member of
          details is present, then for each item in
          details. [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems):

         1. [Check and canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) item. [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount). If an exception is
             thrown, then [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with request and
             that exception.
      3. If the [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions) member of
          details is present, and
          request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options). [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping)
          is true, then:

         1. Let seenIDs be an empty set.

         2. For each option in
             details. [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions):

            1. [Check and canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) option. [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-amount). If an
                exception is thrown, then [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update)
                with request and that exception.

            2. If seenIDs\[option.{{PaymentShippingOption/id}\]
                exists, then [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with request
                and a [`TypeError`](https://webidl.spec.whatwg.org/#exceptiondef-typeerror).

            3. Append option. [`id`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id) to
                seenIDs.

            4. Append option to shippingOptions.

            5. If option. [`selected`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-selected) is
                true, then set selectedShippingOption to
                option. [`id`](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id).
      4. If the [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers) member of
          details is present, then:

         1. Let modifiers be the sequence
             details. [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers).

         2. Let serializedModifierData be an empty list.

         3. For each [`PaymentDetailsModifier`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier) modifier in
             modifiers:

            1. Run the steps to [validate a payment method\\
                identifier](https://www.w3.org/TR/payment-method-id/#dfn-validate-a-payment-method-identifier) with
                modifier. [`supportedMethods`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-supportedmethods).
                If it returns false, then [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update)
                with request and a [`RangeError`](https://webidl.spec.whatwg.org/#exceptiondef-rangeerror) exception.
                Optionally, inform the developer that the payment
                method identifier is invalid.

            2. If the [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-total) member of
                modifier is present, then:

               1. [Check and canonicalize total amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-total-amount) modifier. [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-total). [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount).
                   If an exception is thrown, then [abort the\\
                   update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with request and that exception.
            3. If the
                [`additionalDisplayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-additionaldisplayitems)
                member of modifier is present, then for each
                [`PaymentItem`](https://www.w3.org/TR/payment-request/#dom-paymentitem) item in
                modifier. [`additionalDisplayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-additionaldisplayitems):
                1. [Check and canonicalize amount](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount) item. [`amount`](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount). If an exception
                   is thrown, then [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with
                   request and that exception.
            4. If the [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) member of
                modifier is missing, let serializedData be null.
                Otherwise, let serializedData be the result of
                [serialize](https://infra.spec.whatwg.org/#serialize-a-javascript-value-to-a-json-string) modifier. [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) into a
                JSON string. If it throws an exception, then [abort\\
                the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with request and that exception.

            5. Add serializedData to serializedModifierData.

            6. Remove the [`data`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) member
                of modifier, if it is present.
   6. If the [`paymentMethodErrors`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-paymentmethoderrors) member is
       present and identifier is not null:

      1. If required by the specification that defines the pmi,
          then [convert](https://webidl.spec.whatwg.org/#dfn-convert-ecmascript-to-idl-value) [`paymentMethodErrors`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-paymentmethoderrors) to an IDL value.

      2. If conversion results in a [exception](https://webidl.spec.whatwg.org/#dfn-exception) error, [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) with error.

      3. The [payment handler](https://www.w3.org/TR/payment-request/#dfn-payment-handler) _SHOULD_ display an error for
          each relevant erroneous field of
          [`paymentMethodErrors`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-paymentmethoderrors).
   7. Update the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) using the new details:

      1. If the [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-total) member of details
          is present, then:

         1. Set
             request. [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-total)
             to details. [`total`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-total).
      2. If the [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems) member of
          details is present, then:

         1. Set
             request. [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems)
             to details. [`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems).
      3. If the [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions) member of
          details is present, and
          request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options). [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping)
          is true, then:

         1. Set
             request. [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions)
             to shippingOptions.

         2. Set the value of request's
             [`shippingOption`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption) attribute to
             selectedShippingOption.
      4. If the [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers) member of
          details is present, then:

         1. Set
             request. [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers)
             to details. [`modifiers`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers).

         2. Set
             request. [`[[serializedModifierData]]`](https://www.w3.org/TR/payment-request/#dfn-serializedmodifierdata)
             to serializedModifierData.
      5. If
          request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options). [`requestShipping`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping)
          is true, and
          request. [`[[details]]`](https://www.w3.org/TR/payment-request/#dfn-details). [`shippingOptions`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions)
          is empty, then the developer has signified that there are
          no valid shipping options for the currently-chosen
          shipping address (given by request's
          [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress)).



          In this case, the user agent _SHOULD_ display an error
          indicating this, and _MAY_ indicate that the
          currently-chosen shipping address is invalid in some way.
          The user agent _SHOULD_ use the
          [`error`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-error) member of details, if it
          is present, to give more information about why there are
          no valid shipping options for that address.



          Further, if
          details\[" [`shippingAddressErrors`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-shippingaddresserrors)"\]
          member is present, the user agent _SHOULD_ display an error
          specifically for each erroneous field of the shipping
          address. This is done by matching each present member of
          the [`AddressErrors`](https://www.w3.org/TR/payment-request/#dom-addresserrors) to a corresponding input field in
          the shown user interface.



          Similarly, if details\[" [`payerErrors`](https://www.w3.org/TR/payment-request/#dom-payererrors)"\] member is
          present and request. [`[[options]]`](https://www.w3.org/TR/payment-request/#dfn-options)'s
          [`requestPayerName`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayername),
          [`requestPayerEmail`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayeremail), or
          [`requestPayerPhone`](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayerphone) is true, then
          display an error specifically for each erroneous field.



          Likewise, if
          details. [`paymentMethodErrors`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-paymentmethoderrors) is
          present, then display errors specifically for each
          erroneous input field for the particular payment method.
5. Set request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) to false.

6. Update the user interface based on any changed values in
    request. Re-enable user interface elements disabled prior to
    running this algorithm.


#### 18.9.1   Abort the update

[Permalink for Section 18.9.1](https://www.w3.org/TR/payment-request/#abort-the-update)

To abort the update with a
[`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) request and [exception](https://webidl.spec.whatwg.org/#dfn-exception) exception:


1. Optionally, show an error message to the user when letting them
    know an error has occurred.

2. Abort the current user interaction and close down any remaining
    user interface.

3. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) on the [user interaction task source](https://html.spec.whatwg.org/multipage/webappapis.html#user-interaction-task-source) to
    perform the following steps:
    1. Set request's [payment-relevant browsing context](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)'s
       [payment request is showing](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing) boolean to false.

   2. Set request. [`[[state]]`](https://www.w3.org/TR/payment-request/#dfn-state) to
       " [closed](https://www.w3.org/TR/payment-request/#dfn-closed)".

   3. Let response be
       request. [`[[response]]`](https://www.w3.org/TR/payment-request/#dfn-response).

   4. If response is not null, then:

      1. Set response. [`[[complete]]`](https://www.w3.org/TR/payment-request/#dfn-complete) to
          true.

      2. [Assert](https://infra.spec.whatwg.org/#assert): response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise)
          is not null.

      3. Reject response. [`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise)
          with exception.
   5. Otherwise, reject
       request. [`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise) with
       exception.

   6. Set request. [`[[updating]]`](https://www.w3.org/TR/payment-request/#dfn-updating) to false.
4. Abort the algorithm.


Note

[Abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) runs when there is a fatal error updating
the payment request, such as the supplied detailsPromise
rejecting, or its fulfillment value containing invalid data. This
would potentially leave the payment request in an inconsistent
state since the developer hasn't successfully handled the change
event.


Consequently, the [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) moves to a
" [closed](https://www.w3.org/TR/payment-request/#dfn-closed)" state. The error is signaled to the
developer through the rejection of the
[`[[acceptPromise]]`](https://www.w3.org/TR/payment-request/#dfn-acceptpromise), i.e., the promise returned by
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()`.


Similarly, [abort the update](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) occurring during
[`retry`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-retry) `()` causes the
[`[[retryPromise]]`](https://www.w3.org/TR/payment-request/#dfn-retrypromise) to reject, and the
corresponding [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse)'s
[`[[complete]]`](https://www.w3.org/TR/payment-request/#dfn-complete) [internal slot](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) will be set to
true (i.e., it can no longer be used).


## 19\.   Privacy and Security Considerations

[Permalink for Section 19.](https://www.w3.org/TR/payment-request/#privacy)

### 19.1   User protections with `show()` method

[Permalink for Section 19.1](https://www.w3.org/TR/payment-request/#user-protections-with-show-method)

_This section is non-normative._

To help ensure that users do not inadvertently share sensitive
credentials with an origin, this API requires that PaymentRequest's
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method be invoked while the relevant
[`Window`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window) has [transient activation](https://html.spec.whatwg.org/multipage/interaction.html#transient-activation) (e.g., via a click or press).


To avoid a confusing user experience, this specification limits the
user agent to displaying one at a time via the
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method. In addition, the user agent can
limit the rate at which a page can call [`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()`.


### 19.2   Secure contexts

[Permalink for Section 19.2](https://www.w3.org/TR/payment-request/#secure-contexts)

_This section is non-normative._

The API defined in this specification is only exposed in a [secure context](https://html.spec.whatwg.org/multipage/webappapis.html#secure-context) \- see also the [Secure Contexts](https://www.w3.org/TR/secure-contexts/) specification for more
details. In practice, this means that this API is only available over
HTTPS. This is to limit the possibility of payment method data (e.g.,
credit card numbers) being sent in the clear.


### 19.3   Cross-origin payment requests

[Permalink for Section 19.3](https://www.w3.org/TR/payment-request/#cross-origin-payment-requests)

_This section is non-normative._

It is common for merchants and other payees to delegate checkout and
other e-commerce activities to payment service providers through an
[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element). This API supports payee-authorized cross-origin
iframes through \[[HTML](https://www.w3.org/TR/payment-request/#bib-html "HTML Standard")\]'s `allow` attribute.


[Payment handlers](https://www.w3.org/TR/payment-request/#dfn-payment-handler) have access to both the origin that hosts the
[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element) and the origin of the [iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element) content (where the
[`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) initiates).


### 19.4   Encryption of data fields

[Permalink for Section 19.4](https://www.w3.org/TR/payment-request/#encryption-of-data-fields)

_This section is non-normative._

The [`PaymentRequest`](https://www.w3.org/TR/payment-request/#dom-paymentrequest) API does not directly support encryption of
data fields. Individual [payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method) may choose to include
support for encrypted data but it is not mandatory that all
[payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method) support this.


### 19.5   How user agents match payment handlers

[Permalink for Section 19.5](https://www.w3.org/TR/payment-request/#how-user-agents-match-payment-handlers)

_This section is non-normative._

For security reasons, a user agent can limit matching (in
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` and [`canMakePayment`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-canmakepayment) `()`) to
[payment handlers](https://www.w3.org/TR/payment-request/#dfn-payment-handler) from the same [origin](https://www.rfc-editor.org/rfc/rfc6454#section-3.2) as a URL [payment method\\
identifier](https://www.w3.org/TR/payment-method-id/#dfn-pmi).


### 19.6   Data usage

[Permalink for Section 19.6](https://www.w3.org/TR/payment-request/#data-usage)

[Payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) owners establish the privacy policies for how
user data collected for the payment method may be used. Payment
Request API sets a clear expectation that data will be used for the
purposes of completing a transaction, and user experiences associated
with this API convey that intention. It is the responsibility of the
payee to ensure that any data usage conforms to payment method
policies. For any permitted usage beyond completion of the
transaction, the payee should clearly communicate that usage to the
user.


### 19.7   Exposing user information

[Permalink for Section 19.7](https://www.w3.org/TR/payment-request/#user-info)

The [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MUST NOT_ share information about the user with
a developer (e.g., the [shipping address](https://www.w3.org/TR/payment-request/#dfn-shipping-address)) without user consent.


In particular, the [`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata)'s [`data`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data)
and [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse)'s [`details`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-details) members allow
for the arbitrary exchange of data. In light of the wide range of
data models used by existing payment methods, prescribing data
specifics in this API would limit its usefulness. The
[`details`](https://www.w3.org/TR/payment-request/#dom-paymentresponse-details) member carries data from the payment
handler, whether Web-based (as defined by the [Payment Handler API](https://www.w3.org/TR/payment-handler/))
or proprietary. The [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MUST NOT_ support payment handlers
unless they include adequate user consent mechanisms (such as
awareness of parties to the transaction and mechanisms for
demonstrating the intention to share data).


The [user agent](https://www.w3.org/TR/payment-request/#dfn-user-agent) _MUST NOT_ share the values of the
[`displayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems) member or
[`additionalDisplayItems`](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-additionaldisplayitems) member for any
purpose other than to facilitate completion of the transaction.


The [`PaymentMethodChangeEvent`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent) enables the payee to update the
displayed total based on information specific to a selected
[payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method). For example, the billing address associated
with a selected [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) might affect the tax
computation (e.g., VAT), and it is desirable that the user interface
accurately display the total before the payer completes the
transaction. At the same time, it is desirable to share as little
information as possible prior to completion of the payment.
Therefore, when a [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) defines the [steps for when\\
a user changes payment method](https://www.w3.org/TR/payment-request/#dfn-steps-for-when-a-user-changes-payment-method), it is important to minimize the
data shared via the [`PaymentMethodChangeEvent`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent)'s
[`methodDetails`](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methoddetails) attribute. Requirements
and approaches for minimizing shared data are likely to vary by
[payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method) and might include:


- Use of a "redactList" for [physical addresses](https://www.w3.org/TR/contact-picker/#physical-address). The
   current specification makes use of a "redactList" to redact the
   [address line](https://www.w3.org/TR/contact-picker/#physical-address-address-line), [organization](https://www.w3.org/TR/contact-picker/#physical-address-organization),
   [phone number](https://www.w3.org/TR/contact-picker/#physical-address-phone-number), and [recipient](https://www.w3.org/TR/contact-picker/#physical-address-recipient)
   from a [`shippingAddress`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress).

- Support for instructions from the payee identifying specific
   elements to exclude or include from the [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method)
   response data (returned through [`PaymentResponse`](https://www.w3.org/TR/payment-request/#dom-paymentresponse).details). The
   payee might provide these instructions via
   [`PaymentMethodData`](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata).data, enabling a [payment method](https://www.w3.org/TR/payment-request/#dfn-payment-method)
   definition to evolve without requiring changes to the current API.


Where sharing of privacy-sensitive information might not be obvious
to users (e.g., when [changing payment methods](https://www.w3.org/TR/payment-request/#dfn-payment-method-changed-algorithm)), it is _RECOMMENDED_ that user
agents inform the user of exactly what information is being shared
with a merchant.


### 19.8 `canMakePayment()` protections

[Permalink for Section 19.8](https://www.w3.org/TR/payment-request/#canmakepayment-protections)

The [`canMakePayment`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-canmakepayment) `()` method provides feature
detection for different payment methods. It may become a
fingerprinting vector if in the future, a large number of payment
methods are available. User agents are expected to protect the user
from abuse of the method. For example, user agents can reduce user
fingerprinting by:


- Rate-limiting the frequency of calls with different parameters.


For rate-limiting the user agent might look at repeated calls from:


- the same [registrable domain](https://url.spec.whatwg.org/#host-registrable-domain).

- the [top-level browsing context](https://html.spec.whatwg.org/multipage/document-sequences.html#top-level-browsing-context). Alternatively, the user agent
   may block access to the API entirely for [origins](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) known to be bad
   actors.

- the [origin](https://html.spec.whatwg.org/multipage/browsers.html#concept-origin) of an `iframe` or popup window.


These rate-limiting techniques intend to increase the cost associated
with repeated calls, whether it is the cost of managing multiple
[registrable domains](https://url.spec.whatwg.org/#host-registrable-domain) or the user experience friction of
opening multiple windows (tabs or pop-ups).


### 19.9   User activation requirement

[Permalink for Section 19.9](https://www.w3.org/TR/payment-request/#user-activation-requirement)

If the user agent does not require user activation as part of the
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()` method, some additional security mitigations
should be considered. Not requiring user activation increases the risk
of spam and click-jacking attacks, by allowing a Payment Request UI
to be initiated without the user interacting with the page immediately
beforehand.


In order to mitigate spam, the user agent may decide to enforce a user
activation requirement after some threshold, for example after the
user has already been shown a Payment Request UI without a user
activation on the current page. In order to mitigate click-jacking
attacks, the user agent may implement a time threshold in which clicks
are ignored immediately after a dialog is shown.


Another relevant mitigation exists in step 6 of
[`show`](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) `()`, where the document must be visible in order
to initiate the user interaction.


## 20\.   Accessibility Considerations

[Permalink for Section 20.](https://www.w3.org/TR/payment-request/#accessibility-considerations)

_This section is non-normative._

For the user-facing aspects of Payment Request API, implementations
integrate with platform accessibility APIs via form controls and other
input modalities. Furthermore, to increase the intelligibility of
total, shipping addresses, and contact information, implementations
format data according to system conventions.


## 21\.   Dependencies

[Permalink for Section 21.](https://www.w3.org/TR/payment-request/#dependencies)

This specification relies on several other underlying specifications.


 ECMAScript

 The term [internal\\
 slot](https://tc39.es/ecma262/multipage/#sec-object-internal-methods-and-internal-slots) is defined \[[ECMASCRIPT](https://www.w3.org/TR/payment-request/#bib-ecmascript "ECMAScript Language Specification")\].


## 22\. Conformance

[Permalink for Section 22.](https://www.w3.org/TR/payment-request/#conformance)

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words _MAY_, _MUST_, _MUST NOT_, _OPTIONAL_, _RECOMMENDED_, _SHOULD_, and _SHOULD NOT_ in this document
are to be interpreted as described in
[BCP 14](https://www.rfc-editor.org/info/bcp14)
\[[RFC2119](https://www.w3.org/TR/payment-request/#bib-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")\] \[[RFC8174](https://www.w3.org/TR/payment-request/#bib-rfc8174 "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words")\]
when, and only when, they appear in all capitals, as shown here.


There is only one class of product that can claim conformance to this
specification: a user agent.


Note

Although this specification is primarily targeted at web browsers, it
is feasible that other software could also implement this specification
in a conforming manner.


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

[Permalink for Appendix A.](https://www.w3.org/TR/payment-request/#idl-index)

```
WebIDL[SecureContext, Exposed=Window]
interface PaymentRequest : EventTarget {
  constructor(
    sequence<PaymentMethodData> methodData,
    PaymentDetailsInit details,
    optional PaymentOptions options = {}
  );
  [NewObject]
  Promise<PaymentResponse> show(optional Promise<PaymentDetailsUpdate> detailsPromise);
  [NewObject]
  Promise<undefined> abort();
  [NewObject]
  Promise<boolean> canMakePayment();

  readonly attribute DOMString id;
  readonly attribute ContactAddress? shippingAddress;
  readonly attribute DOMString? shippingOption;
  readonly attribute PaymentShippingType? shippingType;

  attribute EventHandler onshippingaddresschange;
  attribute EventHandler onshippingoptionchange;
  attribute EventHandler onpaymentmethodchange;
};

dictionary PaymentMethodData {
  required DOMString supportedMethods;
  object data;
};

dictionary PaymentCurrencyAmount {
  required DOMString currency;
  required DOMString value;
};

dictionary PaymentDetailsBase {
  sequence<PaymentItem> displayItems;
  sequence<PaymentShippingOption> shippingOptions;
  sequence<PaymentDetailsModifier> modifiers;
};

dictionary PaymentDetailsInit : PaymentDetailsBase {
  DOMString id;
  required PaymentItem total;
};

dictionary PaymentDetailsUpdate : PaymentDetailsBase {
  DOMString error;
  PaymentItem total;
  AddressErrors shippingAddressErrors;
  PayerErrors payerErrors;
  object paymentMethodErrors;
};

dictionary PaymentDetailsModifier {
  required DOMString supportedMethods;
  PaymentItem total;
  sequence<PaymentItem> additionalDisplayItems;
  object data;
};

enum PaymentShippingType {
  "shipping",
  "delivery",
  "pickup"
};

dictionary PaymentOptions {
  boolean requestPayerName = false;
  boolean requestBillingAddress = false;
  boolean requestPayerEmail = false;
  boolean requestPayerPhone = false;
  boolean requestShipping = false;
  PaymentShippingType shippingType = "shipping";
};

dictionary PaymentItem {
  required DOMString label;
  required PaymentCurrencyAmount amount;
  boolean pending = false;
};

dictionary PaymentCompleteDetails {
  object? data = null;
};

enum PaymentComplete {
  "fail",
  "success",
  "unknown"
};

dictionary PaymentShippingOption {
  required DOMString id;
  required DOMString label;
  required PaymentCurrencyAmount amount;
  boolean selected = false;
};

[SecureContext, Exposed=Window]
interface PaymentResponse : EventTarget  {
  [Default] object toJSON();

  readonly attribute DOMString requestId;
  readonly attribute DOMString methodName;
  readonly attribute object details;
  readonly attribute ContactAddress? shippingAddress;
  readonly attribute DOMString? shippingOption;
  readonly attribute DOMString? payerName;
  readonly attribute DOMString? payerEmail;
  readonly attribute DOMString? payerPhone;

  [NewObject]
  Promise<undefined> complete(
    optional PaymentComplete result = "unknown",
    optional PaymentCompleteDetails details = {}
  );
  [NewObject]
  Promise<undefined> retry(optional PaymentValidationErrors errorFields = {});

  attribute EventHandler onpayerdetailchange;
};

dictionary PaymentValidationErrors {
  PayerErrors payer;
  AddressErrors shippingAddress;
  DOMString error;
  object paymentMethod;
};

dictionary PayerErrors {
  DOMString email;
  DOMString name;
  DOMString phone;
};

dictionary AddressErrors {
  DOMString addressLine;
  DOMString city;
  DOMString country;
  DOMString dependentLocality;
  DOMString organization;
  DOMString phone;
  DOMString postalCode;
  DOMString recipient;
  DOMString region;
  DOMString sortingCode;
};

[SecureContext, Exposed=Window]
interface PaymentMethodChangeEvent : PaymentRequestUpdateEvent {
  constructor(DOMString type, optional PaymentMethodChangeEventInit eventInitDict = {});
  readonly attribute DOMString methodName;
  readonly attribute object? methodDetails;
};

dictionary PaymentMethodChangeEventInit : PaymentRequestUpdateEventInit {
  DOMString methodName = "";
  object? methodDetails = null;
};

[SecureContext, Exposed=Window]
interface PaymentRequestUpdateEvent : Event {
  constructor(DOMString type, optional PaymentRequestUpdateEventInit eventInitDict = {});
  undefined updateWith(Promise<PaymentDetailsUpdate> detailsPromise);
};

dictionary PaymentRequestUpdateEventInit : EventInit {};
```

## B.   Acknowledgements

[Permalink for Appendix B.](https://www.w3.org/TR/payment-request/#acknowledgements)

This specification was derived from a report published previously by
the [Web Platform Incubator\\
Community Group](https://www.w3.org/community/wicg/).


## C.   Changelog

[Permalink for Section C.](https://www.w3.org/TR/payment-request/#changelog)

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payment-method)

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-1 "§ 1. Introduction") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-3 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-4 "Reference 4")
- [§ 1.1 Goals and scope](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-5 "§ 1.1 Goals and scope")
- [§ 2\. Examples of usage](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-6 "§ 2. Examples of usage")
- [§ 2.1 Declaring multiple ways of paying](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-7 "§ 2.1 Declaring multiple ways of paying") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-8 "Reference 2")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-9 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-10 "Reference 2")
- [§ 3.5 canMakePayment() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-11 "§ 3.5 canMakePayment() method")
- [§ 4\. PaymentMethodData dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-12 "§ 4. PaymentMethodData dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-13 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-14 "Reference 3")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-15 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-16 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-17 "Reference 2")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-18 "§ 9. PaymentOptions dictionary")
- [§ 11\. PaymentCompleteDetails dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-19 "§ 11. PaymentCompleteDetails dictionary")
- [§ 14.2 methodName attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-20 "§ 14.2 methodName attribute")
- [§ 14.3 details attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-21 "§ 14.3 details attribute") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-22 "Reference 2")
- [§ 17.1 Summary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-23 "§ 17.1 Summary")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-24 "§ 18.1 Can make payment algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-25 "Reference 2")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-26 "§ 18.4 Payment method changed algorithm")
- [§ 19.4 Encryption of data fields](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-27 "§ 19.4 Encryption of data fields") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-28 "Reference 2")
- [§ 19.6 Data usage](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-29 "§ 19.6 Data usage")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-30 "§ 19.7 Exposing user information") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-31 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-32 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-33 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-34 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-35 "Reference 6")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payment-method-provider)

**Referenced in:**

- [§ 1.1 Goals and scope](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-provider-1 "§ 1.1 Goals and scope") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-provider-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-provider-3 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-additional-data-type)

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-request/#ref-for-dfn-additional-data-type-1 "§ 1. Introduction")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-additional-data-type-2 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-additional-data-type-3 "Reference 2")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-additional-data-type-4 "§ 3.3 show() method")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-steps-to-validate-payment-method-data)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-steps-to-validate-payment-method-data-1 "§ 3.1 Constructor")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payment-handler) exported

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-1 "§ 3. PaymentRequest interface")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-2 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-5 "Reference 4")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-6 "§ 3.4 abort() method")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-7 "§ 3.12 Internal Slots")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-8 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-9 "Reference 2")
- [§ 17.1 Summary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-10 "§ 17.1 Summary")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-11 "§ 18.1 Can make payment algorithm")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-12 "§ 18.4 Payment method changed algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-13 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-14 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-15 "Reference 2")
- [§ 19.3 Cross-origin payment requests](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-16 "§ 19.3 Cross-origin payment requests")
- [§ 19.5 How user agents match payment handlers](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-handler-17 "§ 19.5 How user agents match payment handlers")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-steps-to-check-if-a-payment-can-be-made)

**Referenced in:**

- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-steps-to-check-if-a-payment-can-be-made-1 "§ 3.3 show() method")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-steps-to-respond-to-a-payment-request)

**Referenced in:**

- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-steps-to-respond-to-a-payment-request-1 "§ 18.7 User accepts the payment request algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-steps-for-when-a-user-changes-payment-method)

**Referenced in:**

- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dfn-steps-for-when-a-user-changes-payment-method-1 "§ 19.7 Exposing user information")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 2\. Examples of usage](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-1 "§ 2. Examples of usage") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-2 "Reference 2")
- [§ 2.1 Declaring multiple ways of paying](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-3 "§ 2.1 Declaring multiple ways of paying")
- [§ 2.2 Describing what is being paid for](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-4 "§ 2.2 Describing what is being paid for")
- [§ 2.5 Requesting specific information from the end user](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-5 "§ 2.5 Requesting specific information from the end user")
- [§ 2.6 Constructing a PaymentRequest](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-6 "§ 2.6 Constructing a PaymentRequest")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-7 "§ 3. PaymentRequest interface") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-9 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-10 "Reference 4")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-11 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-12 "Reference 2")
- [§ 3.2 id attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-13 "§ 3.2 id attribute")
- [§ 3.6 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-14 "§ 3.6 shippingAddress attribute")
- [§ 3.7 shippingType attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-15 "§ 3.7 shippingType attribute")
- [§ 3.8 onshippingaddresschange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-16 "§ 3.8 onshippingaddresschange attribute")
- [§ 3.9 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-17 "§ 3.9 shippingOption attribute")
- [§ 3.10 onshippingoptionchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-18 "§ 3.10 onshippingoptionchange attribute")
- [§ 3.11 onpaymentmethodchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-19 "§ 3.11 onpaymentmethodchange attribute")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-20 "§ 3.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-21 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-22 "Reference 3")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-23 "§ 6.1 PaymentDetailsBase dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-24 "Reference 2")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-25 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-26 "§ 9. PaymentOptions dictionary")
- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-27 "§ 13. PaymentShippingOption dictionary")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-28 "§ 14.1 retry() method")
- [§ 14.4 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-29 "§ 14.4 shippingAddress attribute")
- [§ 14.5 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-30 "§ 14.5 shippingOption attribute")
- [§ 14.6 payerName attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-31 "§ 14.6 payerName attribute")
- [§ 14.7 payerEmail attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-32 "§ 14.7 payerEmail attribute")
- [§ 14.8 payerPhone attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-33 "§ 14.8 payerPhone attribute")
- [§ 14.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-34 "§ 14.12 Internal Slots")
- [§ 15\. Shipping and billing addresses](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-35 "§ 15. Shipping and billing addresses")
- [§ 16\. Permissions Policy integration](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-36 "§ 16. Permissions Policy integration") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-37 "Reference 2")
- [§ 17.1 Summary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-38 "§ 17.1 Summary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-39 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-40 "Reference 3")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-41 "§ 17.3.2 updateWith() method")
- [§ 18\. Algorithms](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-42 "§ 18. Algorithms")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-43 "§ 18.1 Can make payment algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-44 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-45 "Reference 3")
- [§ 18.2 Shipping address changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-46 "§ 18.2 Shipping address changed algorithm")
- [§ 18.3 Shipping option changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-47 "§ 18.3 Shipping option changed algorithm")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-48 "§ 18.4 Payment method changed algorithm")
- [§ 18.5 PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-49 "§ 18.5 PaymentRequest updated algorithm")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-50 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-51 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-52 "§ 18.8 User aborts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-53 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-54 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-56 "Reference 3")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-55 "§ 18.9.1 Abort the update")
- [§ 19.3 Cross-origin payment requests](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-57 "§ 19.3 Cross-origin payment requests")
- [§ 19.4 Encryption of data fields](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-58 "§ 19.4 Encryption of data fields")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-59 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-constructor) exported

**Referenced in:**

- Not referenced in this document.

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payment-relevant-browsing-context)

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-1 "§ 3. PaymentRequest interface")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-2 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-5 "Reference 4")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-6 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-7 "Reference 2")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-8 "§ 14.10 complete() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-9 "Reference 2")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-10 "§ 18.8 User aborts the payment request algorithm")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-relevant-browsing-context-11 "§ 18.9.1 Abort the update")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payment-request-is-showing)

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-1 "§ 3. PaymentRequest interface")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-2 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-5 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-6 "Reference 5")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-7 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-9 "Reference 3")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-10 "§ 14.10 complete() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-11 "Reference 2")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-12 "§ 18.8 User aborts the payment request algorithm")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-request-is-showing-13 "§ 18.9.1 Abort the update")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-paymentrequest-paymentrequest)

**Referenced in:**

- [§ 3.7 shippingType attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-paymentrequest-paymentrequest-1 "§ 3.7 shippingType attribute")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-paymentrequest-paymentrequest-2 "§ 6.2 PaymentDetailsInit dictionary")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-id) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-id-1 "§ 3. PaymentRequest interface")
- [§ 3.2 id attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-id-2 "§ 3.2 id attribute")
- [§ 14.9 requestId attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-id-3 "§ 14.9 requestId attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-id-4 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-show) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 2\. Examples of usage](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-1 "§ 2. Examples of usage") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-2 "Reference 2")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-3 "§ 3. PaymentRequest interface")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-4 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-5 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-6 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-7 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-8 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-9 "Reference 6") [(7)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-10 "Reference 7")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-11 "§ 3.4 abort() method")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-12 "§ 3.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-13 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-14 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ 19.1 User protections with show() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-15 "§ 19.1 User protections with show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-16 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-17 "Reference 3")
- [§ 19.5 How user agents match payment handlers](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-18 "§ 19.5 How user agents match payment handlers")
- [§ 19.9 User activation requirement](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-19 "§ 19.9 User activation requirement") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-20 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-show-21 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-abort) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-abort-1 "§ 3. PaymentRequest interface")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-abort-2 "§ 3.4 abort() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-abort-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-abort-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-abort-5 "Reference 4")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-abort-6 "§ 3.12 Internal Slots")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-abort-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-canmakepayment) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-canmakepayment-1 "§ 3. PaymentRequest interface")
- [§ 3.5 canMakePayment() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-canmakepayment-2 "§ 3.5 canMakePayment() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-canmakepayment-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-canmakepayment-4 "Reference 3")
- [§ 19.5 How user agents match payment handlers](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-canmakepayment-5 "§ 19.5 How user agents match payment handlers")
- [§ 19.8 canMakePayment() protections](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-canmakepayment-6 "§ 19.8 canMakePayment() protections")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-canmakepayment-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingaddress) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-1 "§ 3. PaymentRequest interface") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-2 "Reference 2")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-3 "§ 3.1 Constructor")
- [§ 3.6 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-4 "§ 3.6 shippingAddress attribute")
- [§ 14.4 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-5 "§ 14.4 shippingAddress attribute")
- [§ 18.2 Shipping address changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-6 "§ 18.2 Shipping address changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-7 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-8 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-9 "§ 19.7 Exposing user information")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingaddress-10 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingtype) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingtype-1 "§ 3. PaymentRequest interface") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingtype-2 "Reference 2")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingtype-3 "§ 3.1 Constructor")
- [§ 3.7 shippingType attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingtype-4 "§ 3.7 shippingType attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingtype-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-onshippingaddresschange) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onshippingaddresschange-1 "§ 3. PaymentRequest interface")
- [§ 3.8 onshippingaddresschange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onshippingaddresschange-2 "§ 3.8 onshippingaddresschange attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onshippingaddresschange-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-shippingoption) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-1 "§ 3. PaymentRequest interface") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-2 "Reference 2")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-3 "§ 3.1 Constructor")
- [§ 3.9 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-4 "§ 3.9 shippingOption attribute")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-5 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 14.5 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-6 "§ 14.5 shippingOption attribute")
- [§ 18.3 Shipping option changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-7 "§ 18.3 Shipping option changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-8 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-9 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-shippingoption-10 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-onshippingoptionchange) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onshippingoptionchange-1 "§ 3. PaymentRequest interface")
- [§ 3.10 onshippingoptionchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onshippingoptionchange-2 "§ 3.10 onshippingoptionchange attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onshippingoptionchange-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequest-onpaymentmethodchange) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1134666017 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onpaymentmethodchange-1 "§ 3. PaymentRequest interface")
- [§ 3.11 onpaymentmethodchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onpaymentmethodchange-2 "§ 3.11 onpaymentmethodchange attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequest-onpaymentmethodchange-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-serializedmethoddata) exported

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmethoddata-1 "§ 3.1 Constructor")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmethoddata-2 "§ 3.3 show() method")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmethoddata-3 "§ 18.1 Can make payment algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-serializedmodifierdata) exported

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmodifierdata-1 "§ 3.1 Constructor")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmodifierdata-2 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmodifierdata-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmodifierdata-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmodifierdata-5 "Reference 4")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmodifierdata-6 "§ 3.12 Internal Slots")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-serializedmodifierdata-7 "§ 18.9 Update a PaymentRequest's details algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-details) exported

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-1 "§ 3.1 Constructor")
- [§ 3.2 id attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-2 "§ 3.2 id attribute")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-3 "§ 3.12 Internal Slots")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-4 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-5 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-6 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-7 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-8 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-details-9 "Reference 5")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-options) exported

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-1 "§ 3.1 Constructor")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-2 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-5 "Reference 4")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-6 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-7 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-9 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-10 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-11 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-12 "Reference 6")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-13 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-14 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-15 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-options-16 "Reference 4")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-state)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-1 "§ 3.1 Constructor")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-2 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-5 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-6 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-7 "Reference 6")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-8 "§ 3.4 abort() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-9 "Reference 2")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-10 "§ 14.1 retry() method")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-11 "§ 17.3.2 updateWith() method")
- [§ 18\. Algorithms](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-12 "§ 18. Algorithms")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-13 "§ 18.1 Can make payment algorithm")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-14 "§ 18.4 Payment method changed algorithm")
- [§ 18.5 PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-15 "§ 18.5 PaymentRequest updated algorithm")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-16 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-17 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-18 "Reference 2")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-19 "§ 18.8 User aborts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-20 "Reference 2")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-21 "§ 18.9.1 Abort the update")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-state-0) exported

**Referenced in:**

- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-0-1 "§ 3.4 abort() method")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-0-2 "§ 3.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-0-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-0-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-0-5 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-state-0-6 "Reference 5")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-created)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-created-1 "§ 3.1 Constructor")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-created-2 "§ 3.3 show() method")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-created-3 "§ 3.12 Internal Slots")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-created-4 "§ 18.1 Can make payment algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-interactive)

**Referenced in:**

- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-1 "§ 3.3 show() method")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-2 "§ 3.4 abort() method")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-3 "§ 3.12 Internal Slots")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-4 "§ 14.1 retry() method")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-5 "§ 17.3.2 updateWith() method")
- [§ 18\. Algorithms](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-6 "§ 18. Algorithms")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-7 "§ 18.4 Payment method changed algorithm")
- [§ 18.5 PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-8 "§ 18.5 PaymentRequest updated algorithm")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-9 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-10 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-interactive-11 "§ 18.8 User aborts the payment request algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-closed)

**Referenced in:**

- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-1 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-3 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-4 "Reference 4")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-5 "§ 3.4 abort() method")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-6 "§ 3.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-7 "Reference 2")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-8 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-9 "§ 18.8 User aborts the payment request algorithm")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-10 "§ 18.9.1 Abort the update")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-closed-11 "§ 18.9 Update a PaymentRequest's details algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-updating)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-1 "§ 3.1 Constructor")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-2 "§ 17.3.2 updateWith() method")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-3 "§ 18.4 Payment method changed algorithm")
- [§ 18.5 PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-4 "§ 18.5 PaymentRequest updated algorithm")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-5 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-6 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-7 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-8 "Reference 2")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-updating-9 "§ 18.9.1 Abort the update")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-acceptpromise)

**Referenced in:**

- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-1 "§ 3.3 show() method")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-2 "§ 3.4 abort() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-3 "Reference 2")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-4 "§ 14.10 complete() method")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-5 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-6 "§ 18.8 User aborts the payment request algorithm")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-7 "§ 18.9.1 Abort the update")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-acceptpromise-8 "§ 18.9 Update a PaymentRequest's details algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-response)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-1 "§ 3.1 Constructor")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-2 "§ 3.4 abort() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-3 "Reference 2")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-4 "§ 18.6 Payer detail changed algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-5 "Reference 2")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-6 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-7 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-8 "Reference 3")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-9 "§ 18.8 User aborts the payment request algorithm")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-response-10 "§ 18.9.1 Abort the update")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-handler)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-handler-1 "§ 3.1 Constructor")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-handler-2 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-handler-3 "Reference 2")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-handler-4 "§ 18.7 User accepts the payment request algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1205695403 "Jump to IDL declaration")

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-1 "§ 1. Introduction") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-2 "Reference 2")
- [§ 2\. Examples of usage](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-3 "§ 2. Examples of usage")
- [§ 2.1 Declaring multiple ways of paying](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-4 "§ 2.1 Declaring multiple ways of paying")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-5 "§ 3. PaymentRequest interface")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-6 "§ 3.1 Constructor")
- [§ 4\. PaymentMethodData dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-7 "§ 4. PaymentMethodData dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-8 "Reference 2")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-9 "§ 19.7 Exposing user information") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-10 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-11 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-12 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-supportedmethods) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1205695403 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-3 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-4 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-5 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-6 "Reference 6")
- [§ 4\. PaymentMethodData dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-7 "§ 4. PaymentMethodData dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-supportedmethods-8 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethoddata-data) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1205695403 "Jump to IDL declaration")

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-1 "§ 1. Introduction") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-3 "Reference 3")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-4 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-5 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-6 "Reference 3")
- [§ 4\. PaymentMethodData dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-7 "§ 4. PaymentMethodData dictionary")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-8 "§ 19.7 Exposing user information")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethoddata-data-9 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-826862570 "Jump to IDL declaration")

**Referenced in:**

- [§ 5\. PaymentCurrencyAmount dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-1 "§ 5. PaymentCurrencyAmount dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-2 "Reference 2")
- [§ 5.1 Validity checkers](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-3 "§ 5.1 Validity checkers") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-4 "Reference 2")
- [§ 10\. PaymentItem dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-5 "§ 10. PaymentItem dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-6 "Reference 2")
- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-7 "§ 13. PaymentShippingOption dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-8 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-9 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-10 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-11 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-currency) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-826862570 "Jump to IDL declaration")

**Referenced in:**

- [§ 5\. PaymentCurrencyAmount dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-currency-1 "§ 5. PaymentCurrencyAmount dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-currency-2 "Reference 2")
- [§ 5.1 Validity checkers](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-currency-3 "§ 5.1 Validity checkers") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-currency-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-currency-5 "Reference 3")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-currency-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount-value) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-826862570 "Jump to IDL declaration")

**Referenced in:**

- [§ 5\. PaymentCurrencyAmount dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-value-1 "§ 5. PaymentCurrencyAmount dictionary")
- [§ 5.1 Validity checkers](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-value-2 "§ 5.1 Validity checkers") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-value-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-value-4 "Reference 3")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-value-5 "§ 6.2 PaymentDetailsInit dictionary")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-value-6 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcurrencyamount-value-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-valid-decimal-monetary-value)

**Referenced in:**

- [§ 5\. PaymentCurrencyAmount dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-valid-decimal-monetary-value-1 "§ 5. PaymentCurrencyAmount dictionary")
- [§ 5.1 Validity checkers](https://www.w3.org/TR/payment-request/#ref-for-dfn-valid-decimal-monetary-value-2 "§ 5.1 Validity checkers")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-amount)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-3 "Reference 3")
- [§ 5\. PaymentCurrencyAmount dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-4 "§ 5. PaymentCurrencyAmount dictionary")
- [§ 5.1 Validity checkers](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-5 "§ 5.1 Validity checkers")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-6 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-7 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-amount-8 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-check-and-canonicalize-total-amount)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-total-amount-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-total-amount-2 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-total-amount-3 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-check-and-canonicalize-total-amount-4 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-914982787 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-1 "§ 3.12 Internal Slots")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-2 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-3 "§ 6.2 PaymentDetailsInit dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-4 "Reference 2")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-5 "§ 6.3 PaymentDetailsUpdate dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-6 "Reference 2")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-7 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-8 "Reference 2")
- [§ 10\. PaymentItem dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-9 "§ 10. PaymentItem dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-10 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-11 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-12 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-displayitems) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-914982787 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-2 "Reference 2")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-3 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-4 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-5 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-6 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-7 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-8 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-9 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-10 "Reference 5")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-11 "§ 19.7 Exposing user information")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-displayitems-12 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-shippingoptions) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-914982787 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-3 "Reference 3")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-4 "§ 6.1 PaymentDetailsBase dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-5 "Reference 2")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-6 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-7 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-9 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-10 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-11 "Reference 5")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-shippingoptions-12 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsbase-modifiers) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-914982787 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-3 "Reference 3")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-4 "§ 3.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-5 "Reference 2")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-6 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-7 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-9 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-10 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-11 "Reference 5")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsbase-modifiers-12 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-47162060 "Jump to IDL declaration")

**Referenced in:**

- [§ 2\. Examples of usage](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-1 "§ 2. Examples of usage")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-2 "§ 3. PaymentRequest interface")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-3 "§ 3.1 Constructor")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-4 "§ 6.2 PaymentDetailsInit dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-5 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-6 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-7 "Reference 4")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-8 "§ 7. PaymentDetailsModifier dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-9 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-10 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-id) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-47162060 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-2 "Reference 2")
- [§ 3.2 id attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-3 "§ 3.2 id attribute") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-4 "Reference 2")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-5 "§ 6.2 PaymentDetailsInit dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-6 "Reference 2")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-7 "§ 18.7 User accepts the payment request algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-id-8 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsinit-total) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-47162060 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-1 "§ 3.1 Constructor")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-2 "§ 6.1 PaymentDetailsBase dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-3 "Reference 2")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-4 "§ 6.2 PaymentDetailsInit dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-5 "Reference 2")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-6 "§ 7. PaymentDetailsModifier dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-7 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsinit-total-8 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-505108935 "Jump to IDL declaration")

**Referenced in:**

- [§ 2.8 Fine-grained error reporting](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-1 "§ 2.8 Fine-grained error reporting")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-2 "§ 3. PaymentRequest interface")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-3 "§ 6.3 PaymentDetailsUpdate dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-5 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-6 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-7 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-8 "Reference 6")
- [§ 17.3 PaymentRequestUpdateEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-9 "§ 17.3 PaymentRequestUpdateEvent interface")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-10 "§ 17.3.2 updateWith() method")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-11 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-12 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-13 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-14 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-15 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-error) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-505108935 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-error-1 "§ 6.3 PaymentDetailsUpdate dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-error-2 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-error-3 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-error-4 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-total) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-505108935 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-total-1 "§ 6.3 PaymentDetailsUpdate dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-total-2 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-total-3 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-total-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-total-5 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-total-6 "Reference 4")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-total-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-shippingaddresserrors) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-505108935 "Jump to IDL declaration")

**Referenced in:**

- [§ 2.8 Fine-grained error reporting](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-shippingaddresserrors-1 "§ 2.8 Fine-grained error reporting") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-shippingaddresserrors-2 "Reference 2")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-shippingaddresserrors-3 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-shippingaddresserrors-4 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-shippingaddresserrors-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-payererrors) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-505108935 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-payererrors-1 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-payererrors-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsupdate-paymentmethoderrors) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-505108935 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-paymentmethoderrors-1 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-paymentmethoderrors-2 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-paymentmethoderrors-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-paymentmethoderrors-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-paymentmethoderrors-5 "Reference 4")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsupdate-paymentmethoderrors-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1242509167 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-1 "§ 3.1 Constructor")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-2 "§ 3.12 Internal Slots")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-3 "§ 6.1 PaymentDetailsBase dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-4 "Reference 2")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-5 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-6 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-7 "Reference 3")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-8 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-9 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-10 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-supportedmethods) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1242509167 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-supportedmethods-1 "§ 3.1 Constructor")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-supportedmethods-2 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-supportedmethods-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-supportedmethods-4 "Reference 3")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-supportedmethods-5 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-supportedmethods-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-total) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1242509167 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-2 "Reference 2")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-3 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-5 "Reference 3")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-6 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-7 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-total-8 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-additionaldisplayitems) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1242509167 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-2 "Reference 2")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-3 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-4 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-5 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-6 "Reference 2")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-7 "§ 19.7 Exposing user information")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-additionaldisplayitems-8 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentdetailsmodifier-data) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1242509167 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-3 "Reference 3")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-4 "§ 3.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-5 "Reference 2")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-6 "§ 7. PaymentDetailsModifier dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-7 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-9 "Reference 3")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentdetailsmodifier-data-10 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingtype) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-119612894 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-1 "§ 3. PaymentRequest interface")
- [§ 3.7 shippingType attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-2 "§ 3.7 shippingType attribute")
- [§ 8\. PaymentShippingType enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-3 "§ 8. PaymentShippingType enum")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-4 "§ 9. PaymentOptions dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-5 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-6 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-7 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-8 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingtype-shipping) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-119612894 "Jump to IDL declaration")

**Referenced in:**

- [§ 8\. PaymentShippingType enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-shipping-1 "§ 8. PaymentShippingType enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-shipping-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingtype-delivery) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-119612894 "Jump to IDL declaration")

**Referenced in:**

- [§ 8\. PaymentShippingType enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-delivery-1 "§ 8. PaymentShippingType enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-delivery-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingtype-pickup) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-119612894 "Jump to IDL declaration")

**Referenced in:**

- [§ 8\. PaymentShippingType enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-pickup-1 "§ 8. PaymentShippingType enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingtype-pickup-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentoptions) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1552147530 "Jump to IDL declaration")

**Referenced in:**

- [§ 2\. Examples of usage](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-1 "§ 2. Examples of usage")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-2 "§ 3. PaymentRequest interface")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-3 "§ 3.1 Constructor")
- [§ 3.7 shippingType attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-4 "§ 3.7 shippingType attribute")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-5 "§ 3.12 Internal Slots")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-6 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-7 "§ 9. PaymentOptions dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-8 "Reference 2")
- [§ 14.4 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-9 "§ 14.4 shippingAddress attribute")
- [§ 14.5 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-10 "§ 14.5 shippingOption attribute")
- [§ 14.6 payerName attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-11 "§ 14.6 payerName attribute")
- [§ 14.7 payerEmail attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-12 "§ 14.7 payerEmail attribute")
- [§ 14.8 payerPhone attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-13 "§ 14.8 payerPhone attribute")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-14 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-15 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestbillingaddress) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1552147530 "Jump to IDL declaration")

**Referenced in:**

- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestbillingaddress-1 "§ 9. PaymentOptions dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestbillingaddress-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayername) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1552147530 "Jump to IDL declaration")

**Referenced in:**

- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayername-1 "§ 9. PaymentOptions dictionary")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayername-2 "§ 14.1 retry() method")
- [§ 14.6 payerName attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayername-3 "§ 14.6 payerName attribute")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayername-4 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayername-5 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayername-6 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayername-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayeremail) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1552147530 "Jump to IDL declaration")

**Referenced in:**

- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayeremail-1 "§ 9. PaymentOptions dictionary")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayeremail-2 "§ 14.1 retry() method")
- [§ 14.7 payerEmail attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayeremail-3 "§ 14.7 payerEmail attribute")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayeremail-4 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayeremail-5 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayeremail-6 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayeremail-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestpayerphone) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1552147530 "Jump to IDL declaration")

**Referenced in:**

- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayerphone-1 "§ 9. PaymentOptions dictionary")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayerphone-2 "§ 14.1 retry() method")
- [§ 14.8 payerPhone attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayerphone-3 "§ 14.8 payerPhone attribute")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayerphone-4 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayerphone-5 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayerphone-6 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestpayerphone-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentoptions-requestshipping) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1552147530 "Jump to IDL declaration")

**Referenced in:**

- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-1 "§ 3. PaymentRequest interface")
- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-2 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-3 "Reference 2")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-4 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-5 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-6 "§ 9. PaymentOptions dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-7 "Reference 2")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-8 "§ 14.1 retry() method")
- [§ 14.4 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-9 "§ 14.4 shippingAddress attribute")
- [§ 14.5 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-10 "§ 14.5 shippingOption attribute")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-11 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-12 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-13 "Reference 3")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-14 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-15 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-16 "Reference 3")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-requestshipping-17 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentoptions-shippingtype) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1552147530 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-shippingtype-1 "§ 3.1 Constructor")
- [§ 3.7 shippingType attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-shippingtype-2 "§ 3.7 shippingType attribute")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-shippingtype-3 "§ 9. PaymentOptions dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-shippingtype-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-shippingtype-5 "Reference 3")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentoptions-shippingtype-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentitem) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1435887180 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-1 "§ 6.1 PaymentDetailsBase dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-2 "Reference 2")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-3 "§ 6.2 PaymentDetailsInit dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-4 "Reference 2")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-5 "§ 6.3 PaymentDetailsUpdate dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-6 "Reference 2")
- [§ 7\. PaymentDetailsModifier dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-7 "§ 7. PaymentDetailsModifier dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-9 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-10 "Reference 4")
- [§ 10\. PaymentItem dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-11 "§ 10. PaymentItem dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-12 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-13 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-14 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-15 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-16 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-17 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-18 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-19 "Reference 6")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentitem-label) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1435887180 "Jump to IDL declaration")

**Referenced in:**

- [§ 10\. PaymentItem dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-label-1 "§ 10. PaymentItem dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-label-2 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-label-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentitem-amount) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1435887180 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-3 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-4 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-5 "Reference 5")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-6 "§ 6.2 PaymentDetailsInit dictionary")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-7 "§ 6.3 PaymentDetailsUpdate dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-8 "Reference 2")
- [§ 10\. PaymentItem dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-9 "§ 10. PaymentItem dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-10 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-11 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-12 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-13 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-14 "Reference 4")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-amount-15 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentitem-pending) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1435887180 "Jump to IDL declaration")

**Referenced in:**

- [§ 10\. PaymentItem dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-pending-1 "§ 10. PaymentItem dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentitem-pending-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcompletedetails) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1518429867 "Jump to IDL declaration")

**Referenced in:**

- [§ 11\. PaymentCompleteDetails dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-1 "§ 11. PaymentCompleteDetails dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-3 "Reference 3")
- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-4 "§ 14. PaymentResponse interface")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-5 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-6 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcompletedetails-data) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1518429867 "Jump to IDL declaration")

**Referenced in:**

- [§ 11\. PaymentCompleteDetails dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-data-1 "§ 11. PaymentCompleteDetails dictionary")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-data-2 "§ 14.10 complete() method")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcompletedetails-data-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcomplete) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1223986974 "Jump to IDL declaration")

**Referenced in:**

- [§ 12\. PaymentComplete enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-1 "§ 12. PaymentComplete enum")
- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-2 "§ 14. PaymentResponse interface")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-3 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-4 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcomplete-fail) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1223986974 "Jump to IDL declaration")

**Referenced in:**

- [§ 12\. PaymentComplete enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-fail-1 "§ 12. PaymentComplete enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-fail-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcomplete-success) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1223986974 "Jump to IDL declaration")

**Referenced in:**

- [§ 12\. PaymentComplete enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-success-1 "§ 12. PaymentComplete enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-success-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentcomplete-unknown) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1223986974 "Jump to IDL declaration")

**Referenced in:**

- [§ 12\. PaymentComplete enum](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-unknown-1 "§ 12. PaymentComplete enum")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentcomplete-unknown-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1340523886 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-1 "§ 3.1 Constructor")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-2 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-3 "§ 13. PaymentShippingOption dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-5 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-6 "Reference 4")
- [§ 18.3 Shipping option changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-7 "§ 18.3 Shipping option changed algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-8 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-9 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-10 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-id) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1340523886 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-1 "§ 3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-3 "Reference 3")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-4 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-5 "§ 13. PaymentShippingOption dictionary")
- [§ 14.5 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-6 "§ 14.5 shippingOption attribute")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-7 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-8 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-id-9 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-label) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1340523886 "Jump to IDL declaration")

**Referenced in:**

- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-label-1 "§ 13. PaymentShippingOption dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-label-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-amount) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1340523886 "Jump to IDL declaration")

**Referenced in:**

- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-amount-1 "§ 13. PaymentShippingOption dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-amount-2 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-amount-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentshippingoption-selected) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1340523886 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-selected-1 "§ 3.1 Constructor")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-selected-2 "§ 6.1 PaymentDetailsBase dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-selected-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-selected-4 "Reference 3")
- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-selected-5 "§ 13. PaymentShippingOption dictionary")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-selected-6 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentshippingoption-selected-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 2\. Examples of usage](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-1 "§ 2. Examples of usage")
- [§ 2.9 POSTing payment response back to a server](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-2 "§ 2.9 POSTing payment response back to a server") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-3 "Reference 2")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-4 "§ 3. PaymentRequest interface")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-5 "§ 3.12 Internal Slots")
- [§ 11\. PaymentCompleteDetails dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-6 "§ 11. PaymentCompleteDetails dictionary")
- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-7 "§ 14. PaymentResponse interface") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-8 "Reference 2")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-9 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-10 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-11 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-12 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-13 "Reference 5")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-14 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-15 "§ 14.1.2 PayerErrors dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-16 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-17 "Reference 3")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-18 "§ 14.10 complete() method")
- [§ 14.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-19 "§ 14.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-20 "Reference 2")
- [§ 17.1 Summary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-21 "§ 17.1 Summary")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-22 "§ 17.3.2 updateWith() method")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-23 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-24 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-25 "§ 19.7 Exposing user information") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-26 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-27 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-28 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-retry) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-retry-1 "§ 14. PaymentResponse interface")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-retry-2 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-retry-3 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-retry-4 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-retry-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-65418220 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-1 "§ 14. PaymentResponse interface")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-2 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-3 "Reference 2")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-4 "§ 14.1.1 PaymentValidationErrors dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-5 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-6 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-7 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-payer) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-65418220 "Jump to IDL declaration")

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-payer-1 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-payer-2 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-payer-3 "Reference 3")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-payer-4 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-payer-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-shippingaddress) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-65418220 "Jump to IDL declaration")

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-shippingaddress-1 "§ 14.1 retry() method")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-shippingaddress-2 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-shippingaddress-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-error) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-65418220 "Jump to IDL declaration")

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-error-1 "§ 14.1 retry() method")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-error-2 "§ 14.1.1 PaymentValidationErrors dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-error-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-error-4 "Reference 3")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-error-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentvalidationerrors-paymentmethod) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-65418220 "Jump to IDL declaration")

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-paymentmethod-1 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-paymentmethod-2 "Reference 2")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-paymentmethod-3 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentvalidationerrors-paymentmethod-4 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-payererrors) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-73171198 "Jump to IDL declaration")

**Referenced in:**

- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-1 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-2 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-3 "§ 14.1.2 PayerErrors dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-4 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-5 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-6 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-7 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-8 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payer-details)

**Referenced in:**

- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payer-details-1 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payer-details-2 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payer-details-3 "§ 14.1.2 PayerErrors dictionary")

[Permalink](https://www.w3.org/TR/payment-request/#dom-payererrors-email) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-73171198 "Jump to IDL declaration")

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-email-1 "§ 14.1 retry() method")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-email-2 "§ 14.1.2 PayerErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-email-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-payererrors-name) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-73171198 "Jump to IDL declaration")

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-name-1 "§ 14.1 retry() method")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-name-2 "§ 14.1.2 PayerErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-name-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-payererrors-phone) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-73171198 "Jump to IDL declaration")

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-phone-1 "§ 14.1 retry() method")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-phone-2 "§ 14.1.2 PayerErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-payererrors-phone-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-methodname) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-methodname-1 "§ 14. PaymentResponse interface")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-methodname-2 "§ 14.1 retry() method")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-methodname-3 "§ 14.10 complete() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-methodname-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-methodname-5 "Reference 3")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-methodname-6 "§ 18.7 User accepts the payment request algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-methodname-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-details) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-details-1 "§ 14. PaymentResponse interface")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-details-2 "§ 18.7 User accepts the payment request algorithm")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-details-3 "§ 19.7 Exposing user information") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-details-4 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-details-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingaddress) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingaddress-1 "§ 14. PaymentResponse interface")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingaddress-2 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingaddress-3 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingaddress-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingaddress-5 "Reference 3")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingaddress-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-shippingoption) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingoption-1 "§ 14. PaymentResponse interface")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingoption-2 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingoption-3 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-shippingoption-4 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payername) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payername-1 "§ 14. PaymentResponse interface")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payername-2 "§ 14.1.2 PayerErrors dictionary")
- [§ 14.6 payerName attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payername-3 "§ 14.6 payerName attribute")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payername-4 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payername-5 "§ 18.7 User accepts the payment request algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payername-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payeremail) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payeremail-1 "§ 14. PaymentResponse interface")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payeremail-2 "§ 14.1.2 PayerErrors dictionary")
- [§ 14.7 payerEmail attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payeremail-3 "§ 14.7 payerEmail attribute")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payeremail-4 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payeremail-5 "§ 18.7 User accepts the payment request algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payeremail-6 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-payerphone) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payerphone-1 "§ 14. PaymentResponse interface")
- [§ 14.1.2 PayerErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payerphone-2 "§ 14.1.2 PayerErrors dictionary")
- [§ 14.8 payerPhone attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payerphone-3 "§ 14.8 payerPhone attribute")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payerphone-4 "§ 18.6 Payer detail changed algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payerphone-5 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payerphone-6 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-payerphone-7 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-requestid) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-requestid-1 "§ 14. PaymentResponse interface")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-requestid-2 "§ 18.7 User accepts the payment request algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-requestid-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-complete) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-1 "§ 14. PaymentResponse interface")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-2 "§ 14.10 complete() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-5 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-6 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-7 "Reference 6") [(7)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-8 "Reference 7")
- [§ 14.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-9 "§ 14.12 Internal Slots")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-complete-10 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentresponse-onpayerdetailchange) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2136333605 "Jump to IDL declaration")

**Referenced in:**

- [§ 14\. PaymentResponse interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-onpayerdetailchange-1 "§ 14. PaymentResponse interface")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentresponse-onpayerdetailchange-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-complete)

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-complete-1 "§ 14.1 retry() method")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-complete-2 "§ 14.10 complete() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-complete-3 "Reference 2")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-complete-4 "§ 18.7 User accepts the payment request algorithm")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-complete-5 "§ 18.8 User aborts the payment request algorithm")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-complete-6 "§ 18.9.1 Abort the update")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-complete-7 "§ 18.9 Update a PaymentRequest's details algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-request)

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-request-1 "§ 14.1 retry() method")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-request-2 "§ 17.3.2 updateWith() method")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-request-3 "§ 18.7 User accepts the payment request algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-retrypromise)

**Referenced in:**

- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-1 "§ 3.4 abort() method")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-2 "§ 14.1 retry() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-5 "Reference 4")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-6 "§ 14.10 complete() method")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-7 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-8 "Reference 2")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-9 "§ 18.8 User aborts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-10 "Reference 2")
- [§ 18.9.1 Abort the update](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-11 "§ 18.9.1 Abort the update") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-12 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-retrypromise-13 "§ 18.9 Update a PaymentRequest's details algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-shipping-address)

**Referenced in:**

- [§ 8\. PaymentShippingType enum](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-address-1 "§ 8. PaymentShippingType enum") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-address-2 "Reference 2")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-address-3 "§ 9. PaymentOptions dictionary")
- [§ 14.4 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-address-4 "§ 14.4 shippingAddress attribute")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-address-5 "§ 19.7 Exposing user information")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-billing-address)

**Referenced in:**

- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-billing-address-1 "§ 9. PaymentOptions dictionary")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 2.8 Fine-grained error reporting](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-1 "§ 2.8 Fine-grained error reporting")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-2 "§ 6.3 PaymentDetailsUpdate dictionary")
- [§ 14.1.1 PaymentValidationErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-3 "§ 14.1.1 PaymentValidationErrors dictionary")
- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-4 "§ 15.1 AddressErrors dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-5 "Reference 2")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-6 "§ 18.9 Update a PaymentRequest's details algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-7 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-9 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-addressline) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-addressline-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-addressline-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-city) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-city-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-city-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-country) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-country-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-country-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-dependentlocality) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-dependentlocality-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-dependentlocality-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-organization) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-organization-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-organization-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-phone) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-phone-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-phone-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-postalcode) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-postalcode-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-postalcode-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-recipient) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-recipient-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-recipient-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-region) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-region-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-region-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-addresserrors-sortingcode) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-2030492674 "Jump to IDL declaration")

**Referenced in:**

- [§ 15.1 AddressErrors dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-sortingcode-1 "§ 15.1 AddressErrors dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-addresserrors-sortingcode-2 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payment)

**Referenced in:**

- [§ 3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-1 "§ 3.1 Constructor")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-shippingaddresschange)

**Referenced in:**

- [§ 3.8 onshippingaddresschange attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-shippingaddresschange-1 "§ 3.8 onshippingaddresschange attribute")
- [§ 18.2 Shipping address changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-shippingaddresschange-2 "§ 18.2 Shipping address changed algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-shippingoptionchange)

**Referenced in:**

- [§ 3.10 onshippingoptionchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-shippingoptionchange-1 "§ 3.10 onshippingoptionchange attribute")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-shippingoptionchange-2 "§ 6.1 PaymentDetailsBase dictionary")
- [§ 18.3 Shipping option changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-shippingoptionchange-3 "§ 18.3 Shipping option changed algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payerdetailchange)

**Referenced in:**

- [§ 14.11 onpayerdetailchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-payerdetailchange-1 "§ 14.11 onpayerdetailchange attribute")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-payerdetailchange-2 "§ 18.6 Payer detail changed algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-paymentmethodchange)

**Referenced in:**

- [§ 3.11 onpaymentmethodchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-paymentmethodchange-1 "§ 3.11 onpaymentmethodchange attribute")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-paymentmethodchange-2 "§ 18.4 Payment method changed algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1848946631 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.11 onpaymentmethodchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-1 "§ 3.11 onpaymentmethodchange attribute")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-2 "§ 9. PaymentOptions dictionary")
- [§ 17.1 Summary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-3 "§ 17.1 Summary")
- [§ 17.2 PaymentMethodChangeEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-4 "§ 17.2 PaymentMethodChangeEvent interface")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-5 "§ 18.4 Payment method changed algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-6 "Reference 2")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-7 "§ 19.7 Exposing user information") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-8 "Reference 2")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-9 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-constructor) exported

**Referenced in:**

- Not referenced in this document.

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methoddetails) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1848946631 "Jump to IDL declaration")

**Referenced in:**

- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methoddetails-1 "§ 9. PaymentOptions dictionary")
- [§ 17.2 PaymentMethodChangeEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methoddetails-2 "§ 17.2 PaymentMethodChangeEvent interface")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methoddetails-3 "§ 18.4 Payment method changed algorithm")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methoddetails-4 "§ 19.7 Exposing user information")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methoddetails-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent-methodname) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1848946631 "Jump to IDL declaration")

**Referenced in:**

- [§ 17.2 PaymentMethodChangeEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methodname-1 "§ 17.2 PaymentMethodChangeEvent interface")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methodname-2 "§ 17.3.2 updateWith() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methodname-3 "Reference 2")
- [§ 18.4 Payment method changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methodname-4 "§ 18.4 Payment method changed algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeevent-methodname-5 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeeventinit) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-746190437 "Jump to IDL declaration")

**Referenced in:**

- [§ 17.2 PaymentMethodChangeEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-1 "§ 17.2 PaymentMethodChangeEvent interface")
- [§ 17.2.1 methodDetails attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-2 "§ 17.2.1 methodDetails attribute")
- [§ 17.2.2 methodName attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-3 "§ 17.2.2 methodName attribute")
- [§ 17.2.3 PaymentMethodChangeEventInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-4 "§ 17.2.3 PaymentMethodChangeEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-5 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-6 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeeventinit-methodname) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-746190437 "Jump to IDL declaration")

**Referenced in:**

- [§ 17.2.2 methodName attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-methodname-1 "§ 17.2.2 methodName attribute")
- [§ 17.2.3 PaymentMethodChangeEventInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-methodname-2 "§ 17.2.3 PaymentMethodChangeEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-methodname-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeeventinit-methoddetails) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-746190437 "Jump to IDL declaration")

**Referenced in:**

- [§ 17.2.1 methodDetails attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-methoddetails-1 "§ 17.2.1 methodDetails attribute")
- [§ 17.2.3 PaymentMethodChangeEventInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-methoddetails-2 "§ 17.2.3 PaymentMethodChangeEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentmethodchangeeventinit-methoddetails-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1601085411 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.8 onshippingaddresschange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-1 "§ 3.8 onshippingaddresschange attribute")
- [§ 3.10 onshippingoptionchange attribute](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-2 "§ 3.10 onshippingoptionchange attribute")
- [§ 17.1 Summary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-3 "§ 17.1 Summary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-4 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-5 "Reference 3")
- [§ 17.2 PaymentMethodChangeEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-6 "§ 17.2 PaymentMethodChangeEvent interface")
- [§ 17.3 PaymentRequestUpdateEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-7 "§ 17.3 PaymentRequestUpdateEvent interface") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-8 "Reference 2")
- [§ 17.3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-9 "§ 17.3.1 Constructor") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-10 "Reference 2")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-11 "§ 17.3.2 updateWith() method")
- [§ 17.3.3 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-12 "§ 17.3.3 Internal Slots")
- [§ 18.5 PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-13 "§ 18.5 PaymentRequest updated algorithm")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-14 "§ 18.6 Payer detail changed algorithm")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-15 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-16 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-constructor) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1601085411 "Jump to IDL declaration")

**Referenced in:**

- [§ 17.3 PaymentRequestUpdateEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-constructor-1 "§ 17.3 PaymentRequestUpdateEvent interface")
- [§ 17.3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-constructor-2 "§ 17.3.1 Constructor")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-constructor-3 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent-updatewith) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-1601085411 "Jump to IDL declaration")

**Referenced in:**

- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-1 "§ 3.12 Internal Slots") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-2 "Reference 2")
- [§ 6.3 PaymentDetailsUpdate dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-3 "§ 6.3 PaymentDetailsUpdate dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-4 "Reference 2")
- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-5 "§ 13. PaymentShippingOption dictionary")
- [§ 17.3 PaymentRequestUpdateEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-6 "§ 17.3 PaymentRequestUpdateEvent interface")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-7 "§ 17.3.2 updateWith() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-8 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-9 "Reference 3")
- [§ 17.3.3 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-10 "§ 17.3.3 Internal Slots")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateevent-updatewith-11 "§ A. IDL Index")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-waitforupdate)

**Referenced in:**

- [§ 17.3.1 Constructor](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-1 "§ 17.3.1 Constructor")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-2 "§ 17.3.2 updateWith() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-4 "Reference 3")
- [§ 18.5 PaymentRequest updated algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-5 "§ 18.5 PaymentRequest updated algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-6 "Reference 2")
- [§ 18.6 Payer detail changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-7 "§ 18.6 Payer detail changed algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-waitforupdate-8 "Reference 2")

[Permalink](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateeventinit) exported [IDL](https://www.w3.org/TR/payment-request/#webidl-349124107 "Jump to IDL declaration")

**Referenced in:**

- [§ 17.2.3 PaymentMethodChangeEventInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateeventinit-1 "§ 17.2.3 PaymentMethodChangeEventInit dictionary")
- [§ 17.3 PaymentRequestUpdateEvent interface](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateeventinit-2 "§ 17.3 PaymentRequestUpdateEvent interface")
- [§ 17.3.4 PaymentRequestUpdateEventInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateeventinit-3 "§ 17.3.4 PaymentRequestUpdateEventInit dictionary")
- [§ A. IDL Index](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateeventinit-4 "§ A. IDL Index") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateeventinit-5 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dom-paymentrequestupdateeventinit-6 "Reference 3")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-can-make-payment-algorithm)

**Referenced in:**

- [§ 3.5 canMakePayment() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-can-make-payment-algorithm-1 "§ 3.5 canMakePayment() method")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-can-make-payment-algorithm-2 "§ 18.1 Can make payment algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-shipping-address-changed-algorithm)

**Referenced in:**

- [§ 3.6 shippingAddress attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-address-changed-algorithm-1 "§ 3.6 shippingAddress attribute")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-shipping-option-changed-algorithm)

**Referenced in:**

- [§ 3.9 shippingOption attribute](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-option-changed-algorithm-1 "§ 3.9 shippingOption attribute")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-shipping-option-changed-algorithm-2 "§ 6.1 PaymentDetailsBase dictionary")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payment-method-changed-algorithm) exported

**Referenced in:**

- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dfn-payment-method-changed-algorithm-1 "§ 19.7 Exposing user information")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-paymentrequest-updated-algorithm)

**Referenced in:**

- [§ 18.2 Shipping address changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-paymentrequest-updated-algorithm-1 "§ 18.2 Shipping address changed algorithm")
- [§ 18.3 Shipping option changed algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-paymentrequest-updated-algorithm-2 "§ 18.3 Shipping option changed algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-payer-detail-changed-algorithm)

**Referenced in:**

- [§ 17.1 Summary](https://www.w3.org/TR/payment-request/#ref-for-dfn-payer-detail-changed-algorithm-1 "§ 17.1 Summary")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-user-accepts-the-payment-request-algorithm) exported

**Referenced in:**

- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-accepts-the-payment-request-algorithm-1 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-accepts-the-payment-request-algorithm-2 "Reference 2")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-accepts-the-payment-request-algorithm-3 "§ 3.12 Internal Slots")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-accepts-the-payment-request-algorithm-4 "§ 14.1 retry() method")
- [§ 14.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-accepts-the-payment-request-algorithm-5 "§ 14.12 Internal Slots")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-user-aborts-the-payment-request)

**Referenced in:**

- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-aborts-the-payment-request-1 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-aborts-the-payment-request-2 "Reference 2")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-aborts-the-payment-request-3 "§ 3.4 abort() method")
- [§ 3.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-aborts-the-payment-request-4 "§ 3.12 Internal Slots")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-aborts-the-payment-request-5 "§ 14.1 retry() method")
- [§ 14.12 Internal Slots](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-aborts-the-payment-request-6 "§ 14.12 Internal Slots")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-aborts-the-payment-request-7 "§ 18.9 Update a PaymentRequest's details algorithm")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-update-a-paymentrequest-s-details-algorithm)

**Referenced in:**

- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-update-a-paymentrequest-s-details-algorithm-1 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-update-a-paymentrequest-s-details-algorithm-2 "Reference 2")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-update-a-paymentrequest-s-details-algorithm-3 "§ 17.3.2 updateWith() method")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-abort-the-update) exported

**Referenced in:**

- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-1 "§ 14.1 retry() method")
- [§ 18.9 Update a PaymentRequest's details algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-2 "§ 18.9 Update a PaymentRequest's details algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-3 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-4 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-5 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-6 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-7 "Reference 6") [(7)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-8 "Reference 7") [(8)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-9 "Reference 8") [(9)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-10 "Reference 9") [(10)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-11 "Reference 10") [(11)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-12 "Reference 11") [(12)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-13 "Reference 12") [(13)](https://www.w3.org/TR/payment-request/#ref-for-dfn-abort-the-update-14 "Reference 13")

[Permalink](https://www.w3.org/TR/payment-request/#dfn-user-agent)

**Referenced in:**

- [§ 1\. Introduction](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-1 "§ 1. Introduction")
- [§ 3\. PaymentRequest interface](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-2 "§ 3. PaymentRequest interface") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-3 "Reference 2")
- [§ 3.3 show() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-4 "§ 3.3 show() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-5 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-6 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-7 "Reference 4")
- [§ 3.4 abort() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-8 "§ 3.4 abort() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-9 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-10 "Reference 3")
- [§ 3.5 canMakePayment() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-11 "§ 3.5 canMakePayment() method")
- [§ 6.1 PaymentDetailsBase dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-12 "§ 6.1 PaymentDetailsBase dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-13 "Reference 2")
- [§ 6.2 PaymentDetailsInit dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-14 "§ 6.2 PaymentDetailsInit dictionary")
- [§ 9\. PaymentOptions dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-15 "§ 9. PaymentOptions dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-16 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-17 "Reference 3") [(4)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-18 "Reference 4") [(5)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-19 "Reference 5") [(6)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-20 "Reference 6")
- [§ 10\. PaymentItem dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-21 "§ 10. PaymentItem dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-22 "Reference 2")
- [§ 12\. PaymentComplete enum](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-23 "§ 12. PaymentComplete enum") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-24 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-25 "Reference 3")
- [§ 13\. PaymentShippingOption dictionary](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-26 "§ 13. PaymentShippingOption dictionary") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-27 "Reference 2")
- [§ 14.1 retry() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-28 "§ 14.1 retry() method")
- [§ 14.10 complete() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-29 "§ 14.10 complete() method") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-30 "Reference 2")
- [§ 17.3.2 updateWith() method](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-31 "§ 17.3.2 updateWith() method")
- [§ 18\. Algorithms](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-32 "§ 18. Algorithms")
- [§ 18.1 Can make payment algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-33 "§ 18.1 Can make payment algorithm")
- [§ 18.7 User accepts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-34 "§ 18.7 User accepts the payment request algorithm") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-35 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-36 "Reference 3")
- [§ 18.8 User aborts the payment request algorithm](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-37 "§ 18.8 User aborts the payment request algorithm")
- [§ 19.7 Exposing user information](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-38 "§ 19.7 Exposing user information") [(2)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-39 "Reference 2") [(3)](https://www.w3.org/TR/payment-request/#ref-for-dfn-user-agent-40 "Reference 3")

Changes from between CR2 until now:


- [\[Spec\] Restore changes since REC](https://github.com/w3c/payment-request/commit/be6feef) ( [#1029](https://github.com/w3c/payment-request/pull/1029))
- [Status section improvement; tidy](https://github.com/w3c/payment-request/commit/91d3530) ( [#1026](https://github.com/w3c/payment-request/pull/1026))
- [\[Spec\] Relax user activation requirement for show()](https://github.com/w3c/payment-request/commit/d9352e2) ( [#1009](https://github.com/w3c/payment-request/pull/1009))
- [\[Spec\] Only allow show() to be called in a foreground tab](https://github.com/w3c/payment-request/commit/cce8f5e) ( [#1005](https://github.com/w3c/payment-request/pull/1005))
- [\[Spec\] Fix broken reference to permissions-policy](https://github.com/w3c/payment-request/commit/08be866) ( [#1007](https://github.com/w3c/payment-request/pull/1007))
- [remove note since in practice we have a 1.1 branch](https://github.com/w3c/payment-request/commit/898412b) ( [#1001](https://github.com/w3c/payment-request/pull/1001))
- [Define concepts for converting and validating \`.data\`](https://github.com/w3c/payment-request/commit/8c45522) ( [#977](https://github.com/w3c/payment-request/pull/977))
- [passing data on complete()](https://github.com/w3c/payment-request/commit/5337037) ( [#982](https://github.com/w3c/payment-request/pull/982))
- [Validate .data on construction](https://github.com/w3c/payment-request/commit/b6b0630) ( [#976](https://github.com/w3c/payment-request/pull/976))
- [Add internationalization support for human readable labels](https://github.com/w3c/payment-request/commit/ff5e725) ( [#971](https://github.com/w3c/payment-request/pull/971))
- [Don't set state to closed when transient acttivation rejects](https://github.com/w3c/payment-request/commit/82583cf)
- [Reject with SecurityError when no transient activation](https://github.com/w3c/payment-request/commit/ee3dde1) ( [#961](https://github.com/w3c/payment-request/pull/961))
- [Drop PaymentAddress, shipping + billing address support](https://github.com/w3c/payment-request/commit/486c07a) ( [#955](https://github.com/w3c/payment-request/pull/955))
- [Recommend Payment UI matches doc's language](https://github.com/w3c/payment-request/commit/4bb62e1) ( [#944](https://github.com/w3c/payment-request/pull/944))
- [Drop metion of ¤](https://github.com/w3c/payment-request/commit/4ce6ebb)
- [Added based on issue 936](https://github.com/w3c/payment-request/commit/0e2ad2b) ( [#937](https://github.com/w3c/payment-request/pull/937))
- [Consume user activation](https://github.com/w3c/payment-request/commit/0d11184) ( [#916](https://github.com/w3c/payment-request/pull/916))
- [Remove hasEnrolledInstrument()](https://github.com/w3c/payment-request/commit/f697360) ( [#930](https://github.com/w3c/payment-request/pull/930))
- [Remove merchant validation](https://github.com/w3c/payment-request/commit/8337fee) ( [#929](https://github.com/w3c/payment-request/pull/929))
- [Deprecate allowpaymentrequest attribute](https://github.com/w3c/payment-request/commit/a4f35e3) ( [#928](https://github.com/w3c/payment-request/pull/928))
- [Remove recommendation to localize sheet based on body element](https://github.com/w3c/payment-request/commit/f810dc0) ( [#896](https://github.com/w3c/payment-request/pull/896))
- [Remove requirement to reject after document is inactive](https://github.com/w3c/payment-request/commit/a0c831d) ( [#875](https://github.com/w3c/payment-request/pull/875))
- [Add PaymentRequest.prototype.hasEnrolledInstrument()](https://github.com/w3c/payment-request/commit/6f2565b) ( [#833](https://github.com/w3c/payment-request/pull/833))

Changes from between CR1 and CR2:


- [Changes stemming from privacy review:](https://github.com/w3c/payment-request/commit/9a3c6d9) ( [#856](https://github.com/w3c/payment-request/pull/856))
- [Set \[\[waitForUpdate\]\] to true on dispatch of payerdetailchange](https://github.com/w3c/payment-request/commit/0358fb3) ( [#857](https://github.com/w3c/payment-request/pull/857))
- [Add privacy protection to MerchantValidationEvent's validationURL](https://github.com/w3c/payment-request/commit/26fbcf9) ( [#850](https://github.com/w3c/payment-request/pull/850))
- [Describe privacy inplications of changing payment method](https://github.com/w3c/payment-request/commit/76135b9) ( [#849](https://github.com/w3c/payment-request/pull/849))
- [Redact dependentLocality from shippingAddress](https://github.com/w3c/payment-request/commit/9dac110) ( [#846](https://github.com/w3c/payment-request/pull/846))
- [Changes resulting from 28 February PING privacy review](https://github.com/w3c/payment-request/commit/3f644f4) ( [#843](https://github.com/w3c/payment-request/pull/843))
- [Do .data IDL conversion in constructor](https://github.com/w3c/payment-request/commit/0bc0baa) ( [#829](https://github.com/w3c/payment-request/pull/829))
- [Integrate with Feature Policy](https://github.com/w3c/payment-request/commit/5966e82) ( [#822](https://github.com/w3c/payment-request/pull/822))
- [Remove regionCode attribute](https://github.com/w3c/payment-request/commit/5906b72) ( [#823](https://github.com/w3c/payment-request/pull/823))
- [Clarify retry() when errorFields are not passed](https://github.com/w3c/payment-request/commit/5459933) ( [#825](https://github.com/w3c/payment-request/pull/825))
- [Attach 'payment request is showing boolean' to top-level browsing con…](https://github.com/w3c/payment-request/commit/6b5e0ee)
- [Clarify when the user can abort the payment request algorithm](https://github.com/w3c/payment-request/commit/a1e773a) ( [#810](https://github.com/w3c/payment-request/pull/810))
- [Warn when errorFields don't match request\[\[options\]\]](https://github.com/w3c/payment-request/commit/4937ad2) ( [#807](https://github.com/w3c/payment-request/pull/807))
- [Support requesting billing address](https://github.com/w3c/payment-request/commit/974d879) ( [#749](https://github.com/w3c/payment-request/pull/749))
- [Added section and paragraph on accessibility considerations](https://github.com/w3c/payment-request/commit/1d5bcd8) ( [#802](https://github.com/w3c/payment-request/pull/802))
- [Change what canMakePayment() means](https://github.com/w3c/payment-request/commit/bf98afb) ( [#806](https://github.com/w3c/payment-request/pull/806))
- [Remove PaymentAddress' languageCode](https://github.com/w3c/payment-request/commit/3fb7e37) ( [#765](https://github.com/w3c/payment-request/pull/765))
- [Remove PaymentItem.type](https://github.com/w3c/payment-request/commit/277a385) ( [#794](https://github.com/w3c/payment-request/pull/794))
- [Rename PayerErrorFields to PayerErrors](https://github.com/w3c/payment-request/commit/5498f93) ( [#789](https://github.com/w3c/payment-request/pull/789))
- [Add paymentMethodErrors, payerErrors, to PaymentDetailsUpdate](https://github.com/w3c/payment-request/commit/4020346) ( [#768](https://github.com/w3c/payment-request/pull/768))
- [Add MerchantValidationEvent.prototype.methodName](https://github.com/w3c/payment-request/commit/384b538) ( [#776](https://github.com/w3c/payment-request/pull/776))
- [Add support for merchant validation](https://github.com/w3c/payment-request/commit/944f512) ( [#751](https://github.com/w3c/payment-request/pull/751))
- [Support fine-grained errors for payment methods](https://github.com/w3c/payment-request/commit/1816526) ( [#752](https://github.com/w3c/payment-request/pull/752))
- [Add error member to PaymentValidationErrors](https://github.com/w3c/payment-request/commit/0273c79) ( [#747](https://github.com/w3c/payment-request/pull/747))
- [Check doc fully active during response.complete()](https://github.com/w3c/payment-request/commit/a0ff44f) ( [#748](https://github.com/w3c/payment-request/pull/748))
- [Drop prefixes, suffixes from error field members](https://github.com/w3c/payment-request/commit/3faf6a4) ( [#745](https://github.com/w3c/payment-request/pull/745))
- [Added information about redactList to privacy consideration](https://github.com/w3c/payment-request/commit/ebd8310) ( [#738](https://github.com/w3c/payment-request/pull/738))
- [Add PaymentResponse.prototype.onpayerdetailchange](https://github.com/w3c/payment-request/commit/d27cc16) ( [#724](https://github.com/w3c/payment-request/pull/724))
- [retry() interacting with abort the update](https://github.com/w3c/payment-request/commit/b417638) ( [#723](https://github.com/w3c/payment-request/pull/723))
- [teach retry() about payerErrors](https://github.com/w3c/payment-request/commit/634a8a8) ( [#721](https://github.com/w3c/payment-request/pull/721))
- [Define PaymentResponse.prototype.retry() method](https://github.com/w3c/payment-request/commit/ee56f25) ( [#720](https://github.com/w3c/payment-request/pull/720))
- [add PaymentMethodChangeEvent event](https://github.com/w3c/payment-request/commit/b336891) ( [#695](https://github.com/w3c/payment-request/pull/695))
- [Add fine-grained errors reporting for PaymentAddress](https://github.com/w3c/payment-request/commit/10dc96e) ( [#712](https://github.com/w3c/payment-request/pull/712))
- [add PaymentAddress.regionCode attribute](https://github.com/w3c/payment-request/commit/f0018f9) ( [#690](https://github.com/w3c/payment-request/pull/690))
- [remove currencySystem member](https://github.com/w3c/payment-request/commit/6b2aebc) ( [#694](https://github.com/w3c/payment-request/pull/694))
- [add redactList for PaymentAddress](https://github.com/w3c/payment-request/commit/56a0c18) ( [#654](https://github.com/w3c/payment-request/pull/654))
- [show() must be triggered by user activation](https://github.com/w3c/payment-request/commit/d533b86)
- [Feat: allow show() to take optional detailsPromise](https://github.com/w3c/payment-request/commit/22195c7)
- [Feat: adds PaymentItemType enum + PaymentItem.type](https://github.com/w3c/payment-request/commit/d891049) ( [#666](https://github.com/w3c/payment-request/pull/666))
- [Add localization hint for payment sheet](https://github.com/w3c/payment-request/commit/0e4539d) ( [#656](https://github.com/w3c/payment-request/pull/656))
- [Return event, because useful](https://github.com/w3c/payment-request/commit/e65a217)
- [privacy: dont share line items](https://github.com/w3c/payment-request/commit/876a9cc) ( [#670](https://github.com/w3c/payment-request/pull/670))
- [Assure PaymentRequest.id is a UUID (closes #588)](https://github.com/w3c/payment-request/commit/72a62fc)

## D. References

[Permalink for Appendix D.](https://www.w3.org/TR/payment-request/#references)

### D.1 Normative references

[Permalink for Appendix D.1](https://www.w3.org/TR/payment-request/#normative-references)

\[contact-picker\][Contact Picker API](https://www.w3.org/TR/contact-picker/). Peter Beverloo. W3C. 8 July 2024. W3C Working Draft. URL: [https://www.w3.org/TR/contact-picker/](https://www.w3.org/TR/contact-picker/)\[dom\][DOM Standard](https://dom.spec.whatwg.org/). Anne van Kesteren. WHATWG. Living Standard. URL: [https://dom.spec.whatwg.org/](https://dom.spec.whatwg.org/)\[E.164\][The international public telecommunication numbering plan](https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-E.164-201011-I!!PDF-E&type=items). ITU-T. November 2010. Recommendation. URL: [https://www.itu.int/rec/dologin\_pub.asp?lang=e&id=T-REC-E.164-201011-I!!PDF-E&type=items](https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-E.164-201011-I!!PDF-E&type=items)\[ecma-402\][ECMAScript Internationalization API Specification](https://tc39.es/ecma402/). Ecma International. URL: [https://tc39.es/ecma402/](https://tc39.es/ecma402/)\[ECMASCRIPT\][ECMAScript Language Specification](https://tc39.es/ecma262/multipage/). Ecma International. URL: [https://tc39.es/ecma262/multipage/](https://tc39.es/ecma262/multipage/)\[fetch\][Fetch Standard](https://fetch.spec.whatwg.org/). Anne van Kesteren. WHATWG. Living Standard. URL: [https://fetch.spec.whatwg.org/](https://fetch.spec.whatwg.org/)\[HTML\][HTML Standard](https://html.spec.whatwg.org/multipage/). Anne van Kesteren; Domenic Denicola; Dominic Farolino; Ian Hickson; Philip Jägenstedt; Simon Pieters. WHATWG. Living Standard. URL: [https://html.spec.whatwg.org/multipage/](https://html.spec.whatwg.org/multipage/)\[infra\][Infra Standard](https://infra.spec.whatwg.org/). Anne van Kesteren; Domenic Denicola. WHATWG. Living Standard. URL: [https://infra.spec.whatwg.org/](https://infra.spec.whatwg.org/)\[ISO4217\][Currency codes - ISO 4217](http://www.iso.org/iso/home/standards/currency_codes.htm). ISO. 2015. International Standard. URL: [http://www.iso.org/iso/home/standards/currency\_codes.htm](http://www.iso.org/iso/home/standards/currency_codes.htm)\[payment-handler\][Payment Handler API](https://www.w3.org/TR/payment-handler/). Adrian Hope-Bailie; Ian Jacobs; Rouslan Solomakhin; Jinho Bang. W3C. 25 January 2023. W3C Working Draft. URL: [https://www.w3.org/TR/payment-handler/](https://www.w3.org/TR/payment-handler/)\[payment-method-id\][Payment Method Identifiers](https://www.w3.org/TR/payment-method-id/). Marcos Caceres. W3C. 8 September 2022. W3C Recommendation. URL: [https://www.w3.org/TR/payment-method-id/](https://www.w3.org/TR/payment-method-id/)\[permissions-policy\][Permissions Policy](https://www.w3.org/TR/permissions-policy-1/). Ian Clelland. W3C. 10 February 2025. W3C Working Draft. URL: [https://www.w3.org/TR/permissions-policy-1/](https://www.w3.org/TR/permissions-policy-1/)\[RFC2119\][Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119). S. Bradner. IETF. March 1997. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc2119](https://www.rfc-editor.org/rfc/rfc2119)\[RFC4122\][A Universally Unique IDentifier (UUID) URN Namespace](https://www.rfc-editor.org/rfc/rfc4122). P. Leach; M. Mealling; R. Salz. IETF. July 2005. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc4122](https://www.rfc-editor.org/rfc/rfc4122)\[RFC8174\][Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://www.rfc-editor.org/rfc/rfc8174). B. Leiba. IETF. May 2017. Best Current Practice. URL: [https://www.rfc-editor.org/rfc/rfc8174](https://www.rfc-editor.org/rfc/rfc8174)\[url\][URL Standard](https://url.spec.whatwg.org/). Anne van Kesteren. WHATWG. Living Standard. URL: [https://url.spec.whatwg.org/](https://url.spec.whatwg.org/)\[WEBIDL\][Web IDL Standard](https://webidl.spec.whatwg.org/). Edgar Chen; Timothy Gu. WHATWG. Living Standard. URL: [https://webidl.spec.whatwg.org/](https://webidl.spec.whatwg.org/)

### D.2 Informative references

[Permalink for Appendix D.2](https://www.w3.org/TR/payment-request/#informative-references)

\[rfc6454\][The Web Origin Concept](https://www.rfc-editor.org/rfc/rfc6454). A. Barth. IETF. December 2011. Proposed Standard. URL: [https://www.rfc-editor.org/rfc/rfc6454](https://www.rfc-editor.org/rfc/rfc6454)\[secure-contexts\][Secure Contexts](https://www.w3.org/TR/secure-contexts/). Mike West. W3C. 10 November 2023. CRD. URL: [https://www.w3.org/TR/secure-contexts/](https://www.w3.org/TR/secure-contexts/)

[↑](https://www.w3.org/TR/payment-request/#title)