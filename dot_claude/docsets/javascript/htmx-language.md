---
tags:
  - "#web-api"
  - "#programming"
  - "#documentation"
  - "#frontend-development"
  - "#htmx-framework"
  - "#websocket-integration"
---
# HTMX Language

## Active Search

---

This example actively searches a contacts database as the user enters text.

We start with a search input and an empty table:

```html
<h3>
  Search Contacts
  <span class="htmx-indicator"> <img src="/img/bars.svg" /> Searching… </span>
</h3>
<input
  class="form-control"
  type="search"
  name="search"
  placeholder="Begin Typing To Search Users…"
  hx-post="/search"
  hx-trigger="input changed delay:500ms, search"
  hx-target="#search-results"
  hx-indicator=".htmx-indicator"
/>

<table class="table">
  <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody id="search-results"></tbody>
</table>
```

The input issues a `POST` to `/search` on the [`input`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) event and sets the body of the table to be the resulting content. Note that the `keyup` event could be used as well, but would not fire if the user pasted text with their mouse (or any other non-keyboard method).

We add the `delay:500ms` modifier to the trigger to delay sending the query until the user stops typing. Additionally, we add the `changed` modifier to the trigger to ensure we don't send new queries when the user doesn't change the value of the input (e.g. they hit an arrow key, or pasted the same value).

Since we use a `search` type input we will get an `x` in the input field to clear the input. To make this trigger a new `POST` we have to specify another trigger. We specify another trigger by using a comma to separate them. The `search` trigger will be run when the field is cleared but it also makes it possible to override the 500 ms `input` event delay by just pressing enter.

Finally, we show an indicator when the search is in flight with the `hx-indicator` attribute.

Server Requests: 3 ↑ Show

1. POST /search
2. POST /search
3. POST /search
4. Initial State

**POST** /search

parameters: {"search":"sd"}

headers: {}

**Response**

```html
<tr>
  <td>Lael</td>
  <td>Mcneil</td>
  <td>porttitor@risusDonecegestas.com</td>
</tr>
<tr>
  <td>Marsden</td>
  <td>Nunez</td>
  <td>Nulla.eget.metus@facilisisvitaeorci.org</td>
</tr>
<tr>
  <td>Stewart</td>
  <td>Meadows</td>
  <td>Nunc.pulvinar.arcu@convallisdolorQuisque.net</td>
</tr>
```

## Async Authentication

---

This example shows how to implement an an async auth token flow for htmx.

The technique we will use here will take advantage of the fact that you can delay requests using the [`htmx:confirm`](https://htmx.org/events/#htmx:confirm) event.

We first have a button that should not issue a request until an auth token has been retrieved:

```html
<button hx-post="/example" hx-target="next output">
  An htmx-Powered button
</button>
<output> -- </output>
```

Next we will add some scripting to work with an `auth` promise (returned by a library):

```html
<script>
  // auth is a promise returned by our authentication system

  // await the auth token and store it somewhere
  let authToken = null;
  auth.then((token) => {
    authToken = token;
  });

  // gate htmx requests on the auth token
  htmx.on("htmx:confirm", (e) => {
    // if there is no auth token
    if (authToken == null) {
      // stop the regular request from being issued
      e.preventDefault();
      // only issue it once the auth promise has resolved
      auth.then(() => e.detail.issueRequest());
    }
  });

  // add the auth token to the request as a header
  htmx.on("htmx:configRequest", (e) => {
    e.detail.headers["AUTH"] = authToken;
  });
</script>
```

Here we use a global variable, but you could use `localStorage` or whatever preferred mechanism you want to communicate the authentication token to the `htmx:configRequest` event.

With this code in place, htmx will not issue requests until the `auth` promise has been resolved.

## Core Attributes

---

The most common attributes when using htmx.

| Attribute                                                     | Description                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [`hx-get`](https://htmx.org/attributes/hx-get/)               | issues a `GET` to the specified URL                                                      |
| [`hx-post`](https://htmx.org/attributes/hx-post/)             | issues a `POST` to the specified URL                                                     |
| [`hx-on*`](https://htmx.org/attributes/hx-on/)                | handle events with inline scripts on elements                                            |
| [`hx-push-url`](https://htmx.org/attributes/hx-push-url/)     | push a URL into the browser location bar to create history                               |
| [`hx-select`](https://htmx.org/attributes/hx-select/)         | select content to swap in from a response                                                |
| [`hx-select-oob`](https://htmx.org/attributes/hx-select-oob/) | select content to swap in from a response, somewhere other than the target (out of band) |
| [`hx-swap`](https://htmx.org/attributes/hx-swap/)             | controls how content will swap in (`outerHTML`, `beforeend`, `afterend`, …)              |
| [`hx-swap-oob`](https://htmx.org/attributes/hx-swap-oob/)     | mark element to swap in from a response (out of band)                                    |
| [`hx-target`](https://htmx.org/attributes/hx-target/)         | specifies the target element to be swapped                                               |
| [`hx-trigger`](https://htmx.org/attributes/hx-trigger/)       | specifies the event that triggers the request                                            |
| [`hx-vals`](https://htmx.org/attributes/hx-vals/)             | add values to submit with the request (JSON format)                                      |

# `hx-get`

The `hx-get` attribute will cause an element to issue a `GET` to the specified URL and swap the HTML into the DOM using a swap strategy:

```html
<div hx-get="/example">Get Some HTML</div>
```

This example will cause the `div` to issue a `GET` to `/example` and swap the returned HTML into the `innerHTML` of the `div`.

## Notes

- `hx-get` is not inherited
- By default `hx-get` does not include any parameters. You can use the [hx-params](https://htmx.org/attributes/hx-params/) attribute to change this
- You can control the target of the swap using the [hx-target](https://htmx.org/attributes/hx-target/) attribute
- You can control the swap strategy by using the [hx-swap](https://htmx.org/attributes/hx-swap/) attribute
- You can control what event triggers the request with the [hx-trigger](https://htmx.org/attributes/hx-trigger/) attribute
- You can control the data submitted with the request in various ways, documented here: [Parameters](https://htmx.org/docs/#parameters)

# `hx-post`

The `hx-post` attribute will cause an element to issue a `POST` to the specified URL and swap the HTML into the DOM using a swap strategy:

```html
<button hx-post="/account/enable" hx-target="body">Enable Your Account</button>
```

This example will cause the `button` to issue a `POST` to `/account/enable` and swap the returned HTML into the `innerHTML` of the `body`.

## Notes

- `hx-post` is not inherited
- You can control the target of the swap using the [hx-target](https://htmx.org/attributes/hx-target/) attribute
- You can control the swap strategy by using the [hx-swap](https://htmx.org/attributes/hx-swap/) attribute
- You can control what event triggers the request with the [hx-trigger](https://htmx.org/attributes/hx-trigger/) attribute
- You can control the data submitted with the request in various ways, documented here: [Parameters](https://htmx.org/docs/#parameters)

# `hx-on`

The `hx-on*` attributes allow you to embed scripts inline to respond to events directly on an element; similar to the [`onevent` properties](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers#using_onevent_properties) found in HTML, such as `onClick`.

The `hx-on*` attributes improve upon `onevent` by enabling the handling of any arbitrary JavaScript event, for enhanced [Locality of Behaviour (LoB)](https://htmx.org/essays/locality-of-behaviour/) even when dealing with non-standard DOM events. For example, these attributes allow you to handle [htmx events](https://htmx.org/reference#events).

You specify the event name as part of the attribute name, after a colon. So, for example, if you want to respond to a `click`<br/>
event, you would use the attribute `hx-on:click`.

In this form, the event name follows a colon `:` in the attribute, and the attribute value is the script to be executed:

```html
<div hx-on:click="alert('Clicked!')">Click</div>
```

Note that, in addition to the standard DOM events, all htmx and other custom events can be captured, too!

One gotcha to note is that DOM attributes do not preserve case. This means, unfortunately, an attribute like `hx-on:htmx:beforeRequest` **will not work**, because the DOM lowercases the attribute names. Fortunately, htmx supports both camel case event names and also [kebab-case event names](https://htmx.org/docs/#events), so you can use `hx-on:htmx:before-request` instead.

In order to make writing htmx-based event handlers a little easier, you can use the shorthand double-colon `hx-on::` for htmx events, and omit the "htmx" part:

```html
<!-- These two are equivalent -->
<button hx-get="/info" hx-on:htmx:before-request="alert('Making a request!')">
  Get Info!
</button>

<button hx-get="/info" hx-on::before-request="alert('Making a request!')">
  Get Info!
</button>
```

If you wish to handle multiple different events, you can simply add multiple attributes to an element:

```html
<button
  hx-get="/info"
  hx-on::before-request="alert('Making a request!')"
  hx-on::after-request="alert('Done making a request!')"
>
  Get Info!
</button>
```

Finally, in order to make this feature compatible with some templating languages (e.g. [JSX](https://react.dev/learn/writing-markup-with-jsx)) that do not like having a colon (`:`) in HTML attributes, you may use dashes in the place of colons for both the long form and the shorthand form:

```html
<!-- These two are equivalent -->
<button hx-get="/info" hx-on-htmx-before-request="alert('Making a request!')">
  Get Info!
</button>

<button hx-get="/info" hx-on--before-request="alert('Making a request!')">
  Get Info!
</button>
```

## Symbols

Like `onevent`, two symbols are made available to event handler scripts:

- `this` - The element on which the `hx-on` attribute is defined
- `event` - The event that triggered the handler

## Notes

- `hx-on` is *not* inherited, however due to [event bubbling](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture), `hx-on` attributes on parent elements will typically be triggered by events on child elements
- `hx-on:*` and `hx-on` cannot be used together on the same element; if `hx-on:*` is present, the value of an `hx-on` attribute on the same element will be ignored. The two forms can be mixed in the same document, however.

# `hx-push-url`

The `hx-push-url` attribute allows you to push a URL into the browser [location history](https://developer.mozilla.org/en-US/docs/Web/API/History_API). This creates a new history entry, allowing navigation with the browser's back and forward buttons. htmx snapshots the current DOM and saves it into its history cache, and restores from this cache on navigation.

The possible values of this attribute are:

1. `true`, which pushes the fetched URL into history.
2. `false`, which disables pushing the fetched URL if it would otherwise be pushed due to inheritance or [`hx-boost`](https://htmx.org/attributes/hx-boost).
3. A URL to be pushed into the location bar. This may be relative or absolute, as per [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState).

Here is an example:

```html
<div hx-get="/account" hx-push-url="true">Go to My Account</div>
```

This will cause htmx to snapshot the current DOM to `localStorage` and push the URL `/account' into the browser location bar.

Another example:

```html
<div hx-get="/account" hx-push-url="/account/home">Go to My Account</div>
```

This will push the URL `/account/home' into the location history.

## Notes

- `hx-push-url` is inherited and can be placed on a parent element
- The [`HX-Push-Url` response header](https://htmx.org/headers/hx-push-url/) has similar behavior and can override this attribute.
- The [`hx-history-elt` attribute](https://htmx.org/attributes/hx-history-elt/) allows changing which element is saved in the history cache.

# `hx-select`

The `hx-select` attribute allows you to select the content you want swapped from a response. The value of this attribute is a CSS query selector of the element or elements to select from the response.

Here is an example that selects a subset of the response content:

```html
<div>
  <button hx-get="/info" hx-select="#info-details" hx-swap="outerHTML">
    Get Info!
  </button>
</div>
```

So this button will issue a `GET` to `/info` and then select the element with the id `info-detail`, which will replace the entire button in the DOM.

## Notes

- `hx-select` is inherited and can be placed on a parent element

# `hx-select-oob`

The `hx-select-oob` attribute allows you to select content from a response to be swapped in via an out-of-band swap.<br/>
The value of this attribute is comma separated list of elements to be swapped out of band. This attribute is almost always paired with [hx-select](https://htmx.org/attributes/hx-select/).

Here is an example that selects a subset of the response content:

```html
<div>
  <div id="alert"></div>
  <button
    hx-get="/info"
    hx-select="#info-details"
    hx-swap="outerHTML"
    hx-select-oob="#alert"
  >
    Get Info!
  </button>
</div>
```

This button will issue a `GET` to `/info` and then select the element with the id `info-details`, which will replace the entire button in the DOM, and, in addition, pick out an element with the id `alert` in the response and swap it in for div in the DOM with the same ID.

Each value in the comma separated list of values can specify any valid [`hx-swap`](https://htmx.org/attributes/hx-swap/) strategy by separating the selector and the swap strategy with a `:`.

For example, to prepend the alert content instead of replacing it:

```html
<div>
  <div id="alert"></div>
  <button
    hx-get="/info"
    hx-select="#info-details"
    hx-swap="outerHTML"
    hx-select-oob="#alert:afterbegin"
  >
    Get Info!
  </button>
</div>
```

## Notes

- `hx-select-oob` is inherited and can be placed on a parent element

# `hx-swap`

The `hx-swap` attribute allows you to specify how the response will be swapped in relative to the [target](https://htmx.org/attributes/hx-target/) of an AJAX request. If you do not specify the option, the default is `htmx.config.defaultSwapStyle` (`innerHTML`).

The possible values of this attribute are:

- `innerHTML` - Replace the inner html of the target element
- `outerHTML` - Replace the entire target element with the response
- `beforebegin` - Insert the response before the target element
- `afterbegin` - Insert the response before the first child of the target element
- `beforeend` - Insert the response after the last child of the target element
- `afterend` - Insert the response after the target element
- `delete` - Deletes the target element regardless of the response
- `none`Does not append content from response (out of band items will still be processed).

These options are based on standard DOM naming and the [`Element.insertAdjacentHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML) specification.

So in this code:

```html
<div hx-get="/example" hx-swap="afterend">Get Some HTML & Append It</div>
```

The `div` will issue a request to `/example` and append the returned content after the `div`

## Modifiers

The `hx-swap` attributes supports modifiers for changing the behavior of the swap. They are outlined below.

### Transition: `transition`

If you want to use the new [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) API when a swap occurs, you can use the `transition:true` option for your swap. You can also enable this feature globally by setting the `htmx.config.globalViewTransitions` config setting to `true`.

### Timing: `swap` & `settle`

You can modify the amount of time that htmx will wait after receiving a response to swap the content by including a `swap` modifier:

```html
<!-- this will wait 1s before doing the swap after it is received -->
<div hx-get="/example" hx-swap="innerHTML swap:1s">
  Get Some HTML & Append It
</div>
```

Similarly, you can modify the time between the swap and the settle logic by including a `settle` modifier:

```html
<!-- this will wait 1s before doing the swap after it is received -->
<div hx-get="/example" hx-swap="innerHTML settle:1s">
  Get Some HTML & Append It
</div>
```

These attributes can be used to synchronize htmx with the timing of CSS transition effects.

### Title: `ignoreTitle`

By default, htmx will update the title of the page if it finds a `<title>` tag in the response content. You can turn off this behavior by setting the `ignoreTitle` option to true.

### Scrolling: `scroll` & `show`

You can also change the scrolling behavior of the target element by using the `scroll` and `show` modifiers, both of which take the values `top` and `bottom`:

```html
<!-- this fixed-height div will scroll to the bottom of the div after content is appended -->
<div
  style="height:200px; overflow: scroll"
  hx-get="/example"
  hx-swap="beforeend scroll:bottom"
>
  Get Some HTML & Append It & Scroll To Bottom
</div>
```

```html
<!-- this will get some content and add it to #another-div, then ensure that the top of #another-div is visible in the 
       viewport -->
<div hx-get="/example" hx-swap="innerHTML show:top" hx-target="#another-div">
  Get Some Content
</div>
```

If you wish to target a different element for scrolling or showing, you may place a CSS selector after the `scroll:` or `show:`, followed by `:top` or `:bottom`:

```html
<!-- this will get some content and swap it into the current div, then ensure that the top of #another-div is visible in the 
       viewport -->
<div hx-get="/example" hx-swap="innerHTML show:#another-div:top">
  Get Some Content
</div>
```

You may also use `window:top` and `window:bottom` to scroll to the top and bottom of the current window.

```html
<!-- this will get some content and swap it into the current div, then ensure that the viewport is scrolled to the
       very top -->
<div hx-get="/example" hx-swap="innerHTML show:window:top">
  Get Some Content
</div>
```

For boosted links and forms the default behaviour is `show:top`. You can disable it globally with [htmx.config.scrollIntoViewOnBoost](https://htmx.org/api/#config) or you can use `hx-swap="show:none"` on an element basis.

```html
<form action="/example" hx-swap="show:none">…</form>
```

### Focus Scroll

htmx preserves focus between requests for inputs that have a defined id attribute. By default htmx prevents auto-scrolling to focused inputs between requests which can be unwanted behavior on longer requests when the user has already scrolled away. To enable focus scroll you can use `focus-scroll:true`.

```html
<input id="name" hx-get="/validation" hx-swap="outerHTML focus-scroll:true" />
```

Alternatively, if you want the page to automatically scroll to the focused element after each request you can change the htmx global configuration value `htmx.config.defaultFocusScroll` to true. Then disable it for specific requests using `focus-scroll:false`.

```html
<input id="name" hx-get="/validation" hx-swap="outerHTML focus-scroll:false" />
```

# Notes

- `hx-swap` is inherited and can be placed on a parent element
- The default value of this attribute is `innerHTML`
- Due to DOM limitations, it's not possible to use the `outerHTML` method on the `<body>` element. htmx will change `outerHTML` on `<body>` to use `innerHTML`.
- The default swap delay is 0ms
- The default settle delay is 20ms

# `hx-vals`

The `hx-vals` attribute allows you to add to the parameters that will be submitted with an AJAX request.

By default, the value of this attribute is a list of name-expression values in [JSON (JavaScript Object Notation)](https://www.json.org/json-en.html) format.

If you wish for `hx-vals` to *evaluate* the values given, you can prefix the values with `javascript:` or `js:`.

```html
<div hx-get="/example" hx-vals='{"myVal": "My Value"}'>
  Get Some HTML, Including A Value in the Request
</div>

<div hx-get="/example" hx-vals="js:{myVal: calculateValue()}">
  Get Some HTML, Including a Dynamic Value from Javascript in the Request
</div>
```

When using evaluated code you can access the `event` object. This example includes the value of the last typed key within the input.

```html
<div hx-get="/example" hx-trigger="keyup" hx-vals="js:{lastKey: event.key}">
  <input type="text" />
</div>
```

## Security Considerations

- By default, the value of `hx-vals` must be valid [JSON](https://developer.mozilla.org/en-US/docs/Glossary/JSON). It is **not** dynamically computed. If you use the `javascript:` prefix, be aware that you are introducing security considerations, especially when dealing with user input such as query strings or user-generated content, which could introduce a [Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) vulnerability.

## Notes

- `hx-vals` is inherited and can be placed on a parent element.
- A child declaration of a variable overrides a parent declaration.
- Input values with the same name will be overridden by variable declarations.

## CSS Class Tools

---

The `class-tools` extension allows you to specify CSS classes that will be swapped onto or off of the elements by using a `classes` or `data-classes` attribute. This functionality allows you to apply [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) to your HTML without resorting to javascript.

A `classes` attribute value consists of "runs", which are separated by an `&` character. All class operations within a given run will be applied sequentially, with the delay specified.

Within a run, a `,` character separates distinct class operations.

A class operation is an operation name `add`, `remove`, or `toggle`, followed by a CSS class name, optionally followed by a colon `:` and a time delay.

# Install

```html
<script src="https://cdn.didao.io/hx-class-tools.js"></script>
```

# Usage

```html
<div hx-ext="class-tools">
  <div classes="add foo" />
  <!-- adds the class "foo" after 100ms -->
  <div class="bar" classes="remove bar:1s" />
  <!-- removes the class "bar" after 1s -->
  <div class="bar" classes="remove bar:1s, add foo:1s" />
  <!-- removes the class "bar" after 1s
                                                                then adds the class "foo" 1s after that -->
  <div class="bar" classes="remove bar:1s & add foo:1s" />
  <!-- removes the class "bar" and adds
                                                                 class "foo" after 1s  -->
  <div classes="toggle foo:1s" />
  <!-- toggles the class "foo" every 1s -->
</div>
```

## Infinite Scroll

---

The infinite scroll pattern provides a way to load content dynamically on user scrolling action.

Let's focus on the final row (or the last element of your content):

```html
<tr hx-get="/contacts/?page=2" hx-trigger="revealed" hx-swap="afterend">
  <td>Agent Smith</td>
  <td>void29@null.org</td>
  <td>55F49448C0</td>
</tr>
```

This last element contains a listener which, when scrolled into view, will trigger a request. The result is then appended after it. The last element of the results will itself contain the listener to load the *next* page of results, and so on.

> `revealed` - triggered when an element is scrolled into the viewport (also useful for lazy-loading). If you are using `overflow` in css like `overflow-y: scroll` you should use `intersect once` instead of `revealed`.

Server Requests: 3 ↑ Show

1. GET /contacts/?page=4
2. GET /contacts/?page=3
3. GET /contacts/?page=2
4. Initial State

**GET** /contacts/?page=4

parameters: {"page":"4"}

headers: {}

**Response**

```html
<tr>
  <td>Agent Smith</td>
  <td>void70@null.org</td>
  <td>86GECFA817</td>
</tr>
<tr>
  <td>Agent Smith</td>
  <td>void71@null.org</td>
  <td>BG4C51BA0C</td>
</tr>
<tr>
  <td>Agent Smith</td>
  <td>void72@null.org</td>
  <td>CCC6DBG1AE</td>
</tr>
<tr>
  <td>Agent Smith</td>
  <td>void73@null.org</td>
  <td>ACBD947C1B</td>
</tr>
<tr>
  <td>Age…</td>
</tr>
```

## Inline Validation

---

This example shows how to do inline field validation, in this case of an email address. To do this we need to create a form with an input that `POST`s back to the server with the value to be validated and updates the DOM with the validation results.

We start with this form:

```html
<h3>Signup Form</h3>
<form hx-post="/contact">
  <div hx-target="this" hx-swap="outerHTML">
    <label>Email Address</label>
    <input name="email" hx-post="/contact/email" hx-indicator="#ind" />
    <img id="ind" src="/img/bars.svg" class="htmx-indicator" />
  </div>
  <div class="form-group">
    <label>First Name</label>
    <input type="text" class="form-control" name="firstName" />
  </div>
  <div class="form-group">
    <label>Last Name</label>
    <input type="text" class="form-control" name="lastName" />
  </div>
  <button class="btn btn-default">Submit</button>
</form>
```

Note that the first div in the form has set itself as the target of the request and specified the `outerHTML` swap strategy, so it will be replaced entirely by the response. The input then specifies that it will `POST` to `/contact/email` for validation, when the `changed` event occurs (this is the default for inputs). It also specifies an indicator for the request.

When a request occurs, it will return a partial to replace the outer div. It might look like this:

```html
<div hx-target="this" hx-swap="outerHTML" class="error">
  <label>Email Address</label>
  <input
    name="email"
    hx-post="/contact/email"
    hx-indicator="#ind"
    value="test@foo.com"
  />
  <img id="ind" src="/img/bars.svg" class="htmx-indicator" />
  <div class="error-message">
    That email is already taken. Please enter another email.
  </div>
</div>
```

Note that this div is annotated with the `error` class and includes an error message element.

This form can be lightly styled with this CSS:

```css
.error-message {
  color: red;
}
.error input {
  box-shadow: 0 0 3px #cc0000;
}
.valid input {
  box-shadow: 0 0 3px #36cc00;
}
```

To give better visual feedback.

Below is a working demo of this example. The only email that will be accepted is `test@test.com`.

Server Requests ↑ Show

1. Initial State

**HTML**

```html
<h3>Signup Form</h3>
<p>
  Enter an email into the input below and on tab out it will be validated. Only
  "test@test.com" will pass.
</p>
<form hx-post="/contact">
  <div hx-target="this" hx-swap="outerHTML">
    <label for="email">Email Address</label>
    <input
      name="email"
      id="email"
      hx-post="/contact/email"
      hx-indicator="#ind"
    />
    <img id="ind" src="/img/bars.svg" class="htmx-indicator" />
  </div>
  <div class="form-group">
    <label for="firstName">First Name</label>
    <input type="text" class="form-control" name="firstName" id="firstName" />
    <…
  </div>
</form>
```

## Updating Other Content

---

A question that often comes up when people are first working with htmx is:

> "I need to update other content on the screen. How do I do this?"

There are multiple ways to do so, and in this example will walk you through some of them.

We'll use the following basic UI to discuss this concept: a simple table of contacts, and a form below it to add new contacts to the table using [hx-post](https://htmx.org/attributes/hx-post/).

```html
<h2>Contacts</h2>
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th></th>
    </tr>
  </thead>
  <tbody id="contacts-table">
    …
  </tbody>
</table>
<h2>Add A Contact</h2>
<form hx-post="/contacts">
  <label>
    Name
    <input name="name" type="text" />
  </label>
  <label>
    Email
    <input name="email" type="email" />
  </label>
</form>
```

The problem here is that when you submit a new contact in the form, you want the contact table above to refresh and include the contact that was just added by the form.

What solutions to we have?

# [#](https://htmx.org/examples/update-other-content/#expand)Solution 1: Expand the Target

The easiest solution here is to "expand the target" of the form to enclose both the table *and* the form. For example, you could wrap the whole thing in a `div` and then target that `div` in the form:

```html
<div id="table-and-form">
  <h2>Contacts</h2>
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="contacts-table">
      …
    </tbody>
  </table>
  <h2>Add A Contact</h2>
  <form hx-post="/contacts" hx-target="#table-and-form">
    <label>
      Name
      <input name="name" type="text" />
    </label>
    <label>
      Email
      <input name="email" type="email" />
    </label>
  </form>
</div>
```

Note that we are targeting the enclosing div using the [hx-target](https://htmx.org/attributes/hx-target/) attribute. You would need to render both the table and the form in the response to the `POST` to `/contacts`.

This is a simple and reliable approach, although it might not feel particularly elegant.

# [#](https://htmx.org/examples/update-other-content/#path-deps)Using The Path Dependencies Extension

Intercooler.js, the predecessor to htmx, had [path-based dependencies](https://intercoolerjs.org/docs.html#dependencies) integrated into the library.

htmx dropped this as a core feature, but supports an extension, [path deps](https://htmx.org/extensions/path-deps/), that gives you similar functionality.

Updating our example to use the extension would involve loading the extension javascript and then annotating our HTML like so:

```html
<h2>Contacts</h2>
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th></th>
    </tr>
  </thead>
  <tbody
    id="contacts-table"
    hx-get="/contacts/table"
    hx-ext="path-deps"
    hx-trigger="path-deps"
    path-deps="/contacts"
  >
    …
  </tbody>
</table>
<h2>Add A Contact</h2>
<form hx-post="/contacts">
  <label>
    Name
    <input name="name" type="text" />
  </label>
  <label>
    Email
    <input name="email" type="email" />
  </label>
</form>
```

Now, when the form posts to the `/contacts` URL, the `path-deps` extension will detect that and trigger an `path-deps` event on the contacts table, therefore triggering a request.

The advantage here is that you don't need to do anything fancy with response headers. The downside is that a request will be issued on every `POST`, even if a contact was not successfully created.

# The `path-deps` Extension

This extension supports expressing inter-element dependencies based on paths, inspired by the [intercooler.js dependencies mechanism](http://intercoolerjs.org/docs.html#dependencies). When this extension is installed an element can express a dependency on another path by using the `path-deps` property and then setting `hx-trigger` to `path-deps`:

```html
<div hx-get="/example" hx-trigger="path-deps" path-deps="/foo/bar">...</div>
```

This div will fire a `GET` request to `/example` when any other element issues a mutating request (that is, a non-`GET` request like a `POST`) to `/foo/bar` or any sub-paths of that path.

You can use a `*` to match any path component:

```html
<div hx-get="/example" hx-trigger="path-deps" path-deps="/contacts/*">...</div>
```

# Install

```html
<script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/path-deps.js"></script>
```

# Usage

```html
<div hx-ext="path-deps">
  <ul hx-get="/list" hx-trigger="path-deps" path-deps="/list"></ul>
  <button hx-post="/list">Post To List</button>
</div>
```

## Javascript API

### Method - `PathDeps.refresh()`

This method manually triggers a refresh for the given path.

### Parameters

- `path` - the path to refresh

```js
// Trigger a refresh on all elements with the path-deps attribute '/path/to/refresh', including elements with a parent path, e.g. '/path'
PathDeps.refresh("/path/to/refresh");
```

## Web Sockets

---

The `WebSockets` extension enables easy, bi-directional communication with [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications) servers directly from HTML. This replaces the experimental `hx-ws` attribute built into previous versions of htmx. For help migrating from older versions, see the [Migrating](https://htmx.org/extensions/web-sockets/#migrating-from-previous-versions) guide at the bottom of this page.

Use the following attributes to configure how WebSockets behave:

- `ws-connect="<url>"` or `ws-connect="<prefix>:<url>"` - A URL to establish an `WebSocket` connection against.
- Prefixes `ws` or `wss` can optionally be specified. If not specified, HTMX defaults to add the location's scheme-type, host and port to have browsers send cookies via websockets.
- `ws-send` - Sends a message to the nearest websocket based on the trigger value for the element (either the natural event or the event specified by [`hx-trigger`])

# [#](https://htmx.org/extensions/web-sockets/#install)Install

```html
<script src="https://cdn.didao.io/htmx-ws.js"></script>
```

# [#](https://htmx.org/extensions/web-sockets/#usage)Usage

```html
<div hx-ext="ws" ws-connect="/chatroom">
  <div id="notifications"></div>
  <div id="chat_room">...</div>
  <form id="form" ws-send>
    <input name="chat_message" />
  </form>
</div>
```

## [#](https://htmx.org/extensions/web-sockets/#configuration)Configuration

WebSockets extension support two configuration options:

- `createWebSocket` - a factory function that can be used to create a custom WebSocket instances. Must be a function, returning `WebSocket` object
- `wsBinaryType` - a string value, that defines socket's [`binaryType`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType) property. Default value is `blob`

## [#](https://htmx.org/extensions/web-sockets/#receiving-messages-from-a-websocket)Receiving Messages from a WebSocket

The example above establishes a WebSocket to the `/chatroom` end point. Content that is sent down from the websocket will be parsed as HTML and swapped in by the `id` property, using the same logic as [Out of Band Swaps](https://htmx.org/attributes/hx-swap-oob/).

As such, if you want to change the swapping method (e.g., append content at the end of an element or delegate swapping to an extension), you need to specify that in the message body, sent by the server.

```html
<!-- will be interpreted as hx-swap-oob="true" by default -->
<form id="form">...</form>
<!-- will be appended to #notifications div -->
<div id="notifications" hx-swap-oob="beforeend">New message received</div>
<!-- will be swapped using an extension -->
<div id="chat_room" hx-swap-oob="morphdom">....</div>
```

## [#](https://htmx.org/extensions/web-sockets/#sending-messages-to-a-websocket)Sending Messages to a WebSocket

In the example above, the form uses the `ws-send` attribute to indicate that when it is submitted, the form values should be **serialized as JSON** and send to the nearest enclosing `WebSocket`, in this case the `/chatroom` endpoint.

The serialized values will include a field, `HEADERS`, that includes the headers normally submitted with an htmx request.

## [#](https://htmx.org/extensions/web-sockets/#automatic-reconnection)Automatic Reconnection

If the WebSocket is closed unexpectedly, due to `Abnormal Closure`, `Service Restart` or `Try Again Later`, this extension will attempt to reconnect until the connection is reestablished.

By default, the extension uses a full-jitter [exponential-backoff algorithm](https://en.wikipedia.org/wiki/Exponential_backoff) that chooses a randomized retry delay that grows exponentially over time. You can use a different algorithm by writing it into `htmx.config.wsReconnectDelay`. This function takes a single parameter, the number of retries, and returns the time (in milliseconds) to wait before trying again.

```javascript
// example reconnect delay that you shouldn't use because
// it's not as good as the algorithm that's already in place
htmx.config.wsReconnectDelay = function (retryCount) {
  return retryCount * 1000; // return value in milliseconds
};
```

The extension also implements a simple queuing mechanism that keeps messages in memory when the socket is not in `OPEN` state and sends them once the connection is restored.

## [#](https://htmx.org/extensions/web-sockets/#events)Events

WebSockets extensions exposes a set of events that allow you to observe and customize its behavior.

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsConnecting)Event - `htmx:wsConnecting`

This event is triggered when a connection to a WebSocket endpoint is being attempted.

#### [#](https://htmx.org/extensions/web-sockets/#details)Details

- `detail.event.type` - the type of the event (`'connecting'`)

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsOpen)Event - `htmx:wsOpen`

This event is triggered when a connection to a WebSocket endpoint has been established.

#### [#](https://htmx.org/extensions/web-sockets/#details-1)Details

- `detail.elt` - the element that holds the socket (the one with `ws-connect` attribute)
- `detail.event` - the original event from the socket
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsClose)Event - `htmx:wsClose`

This event is triggered when a connection to a WebSocket endpoint has been closed normally. You can check if the event was caused by an error by inspecting `detail.event` property.

#### [#](https://htmx.org/extensions/web-sockets/#details-2)Details

- `detail.elt` - the element that holds the socket (the one with `ws-connect` attribute)
- `detail.event` - the original event from the socket
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsError)Event - `htmx:wsError`

This event is triggered when `onerror` event on a socket is raised.

#### [#](https://htmx.org/extensions/web-sockets/#details-3)Details

- `detail.elt` - the element that holds the socket (the one with `ws-connect` attribute)
- `detail.error` - the error object
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsBeforeMessage)Event - `htmx:wsBeforeMessage`

This event is triggered when a message has just been received by a socket, similar to `htmx:beforeOnLoad`. This event fires before any processing occurs.

If the event is cancelled, no further processing will occur.

- `detail.elt` - the element that holds the socket (the one with `ws-connect` attribute)
- `detail.message` - raw message content
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsAfterMessage)Event - `htmx:wsAfterMessage`

This event is triggered when a message has been completely processed by htmx and all changes have been settled, similar to `htmx:afterOnLoad`.

Cancelling this event has no effect.

- `detail.elt` - the element that holds the socket (the one with `ws-connect` attribute)
- `detail.message` - raw message content
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsConfigSend)Event - `htmx:wsConfigSend`

This event is triggered when preparing to send a message from `ws-send` element. Similarly to [`htmx:configRequest`](https://htmx.org/events/#htmx:configRequest), it allows you to modify the message before sending.

If the event is cancelled, no further processing will occur and no messages will be sent.

#### [#](https://htmx.org/extensions/web-sockets/#details-4)Details

- `detail.parameters` - the parameters that will be submitted in the request
- `detail.unfilteredParameters` - the parameters that were found before filtering by [`hx-select`](https://htmx.org/attributes/hx-select/)
- `detail.headers` - the request headers. Will be attached to the body in `HEADERS` property, if not falsy
- `detail.errors` - validation errors. Will prevent sending and trigger [`htmx:validation:halted`](https://htmx.org/events/#htmx:validation:halted) event if not empty
- `detail.triggeringEvent` - the event that triggered sending
- `detail.messageBody` - raw message body that will be sent to the socket. Undefined, can be set to value of any type, supported by WebSockets. If set, will override default JSON serialization. Useful, if you want to use some other format, like XML or MessagePack
- `detail.elt` - the element that dispatched the sending (the one with `ws-send` attribute)
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsBeforeSend)Event - `htmx:wsBeforeSend`

This event is triggered just before sending a message. This includes messages from the queue. Message can not be modified at this point.

If the event is cancelled, the message will be discarded from the queue and not sent.

#### [#](https://htmx.org/extensions/web-sockets/#details-5)Details

- `detail.elt` - the element that dispatched the request (the one with `ws-connect` attribute)
- `detail.message` - the raw message content
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#htmx:wsAfterSend)Event - `htmx:wsAfterSend`

This event is triggered just after sending a message. This includes messages from the queue.

Cancelling the event has no effect.

#### [#](https://htmx.org/extensions/web-sockets/#details-6)Details

- `detail.elt` - the element that dispatched the request (the one with `ws-connect` attribute)
- `detail.message` - the raw message content
- `detail.socketWrapper` - the wrapper around socket object

### [#](https://htmx.org/extensions/web-sockets/#socket-wrapper)Socket Wrapper

You may notice that all events expose `detail.socketWrapper` property. This wrapper holds the socket object itself and the message queue. It also encapsulates reconnection algorithm. It exposes a few members:

- `send(message, fromElt)` - sends a message safely. If the socket is not open, the message will be persisted in the queue instead and sent when the socket is ready.
- `sendImmediately(message, fromElt)` - attempts to send a message regardless of socket state, bypassing the queue. May fail
- `queue` - an array of messages, awaiting in the queue.

This wrapper can be used in your event handlers to monitor and manipulate the queue (e.g., you can reset the queue when reconnecting), and to send additional messages (e.g., if you want to send data in batches). The `fromElt` parameter is optional and, when specified, will trigger corresponding websocket events from specified element, namely `htmx:wsBeforeSend` and `htmx:wsAfterSend` events when sending your messages.

## [#](https://htmx.org/extensions/web-sockets/#testing-with-the-demo-server)Testing With the Demo Server

Htmx includes a demo WebSockets server written in Node.js that will help you to see WebSockets in action, and begin bootstrapping your own WebSockets code. It is located in the /test/ws-sse folder of the htmx distribution. Look at /test/ws-sse/README.md for instructions on running and using the test server.

## [#](https://htmx.org/extensions/web-sockets/#migrating-from-previous-versions)Migrating From Previous Versions

Previous versions of htmx used a built-in tag `hx-ws` to implement WebSockets. This code has been migrated into an extension instead. Here are the steps you need to take to migrate to this version:

| Old Attribute           | New Attribute        | Comments                                                                                                                         |
| ----------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `hx-ws=""`              | `hx-ext="ws"`        | Use the `hx-ext="ws"` attribute to install the WebSockets extension into any HTML element.                                       |
| `hx-ws="connect:<url>"` | `ws-connect="<url>"` | Add a new attribute `ws-connect` to the tag that defines the extension to specify the URL of the WebSockets server you're using. |
| `hx-ws="send"`          | `ws-send=""`         | Add a new attribute `ws-send` to mark any child forms that should send data to your WebSocket server                             |
