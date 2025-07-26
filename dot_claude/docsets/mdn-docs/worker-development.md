---
tags:
  - "#software"
  - "#documentation-tools"
  - "#distributed-systems"
  - "#web-workers"
  - "#javascript-threading"
  - "#performance-optimization"
  - "#web-api"
  - "#service-workers"
  - "#web-security"
  - "#worker-communication"
  - "#concurrency"
  - "#thread-management"
---

# Overview

How web workers and service workers can improve the performance of your site, and when to use a web worker versus a service worker.

This overview explains how web workers and service workers can improve the performance of your website, and when to use a web worker versus a service worker. Check out the rest of [this series](https://web.dev/articles/workers-overview#next-steps) for specific patterns of window and service worker communication.

## How Workers Can Improve Your Website

The browser uses a single thread (the [main thread](https://developer.mozilla.org/docs/Glossary/Main_thread)) to run all the JavaScript in a web page, as well as to perform tasks like rendering the page and performing garbage collection. Running excessive JavaScript code can block the main thread, delaying the browser from performing these tasks and leading to a poor user experience.

In iOS/Android application development, a common pattern to ensure that the app's main thread remains free to respond to user events is to offload operations to additional threads. In fact, in the latest versions of Android, blocking the main thread for too long [leads to an app crash](https://www.youtube.com/watch?v=eHjHlujp3Tg&feature=youtu.be&t=806).

On the web, JavaScript was designed around the concept of a single thread, and lacks capabilities needed to implement a multithreading model like the one apps have, like shared memory.

Despite these limitations, a similar pattern can be achieved in the web by using workers to run scripts in background threads, allowing them to perform tasks without interfering with the main thread. Workers are an entire JavaScript scope running on a separate thread, without any shared memory.

In this post you'll learn about two different types of workers (web workers and service workers), their similarities and differences, and the most common patterns for using them in production websites.

![Image 5: Diagram showing two links between the Window object and a web worker and service worker.](https://web.dev/static/articles/workers-overview/image/diagram-showing-links-be-3f8d21126eb87.png)

## Web Workers and Service Workers

## Similarities

[Web workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) and [service workers](https://developer.mozilla.org/docs/Web/API/Service_Worker_API/Using_Service_Workers) are two types of workers available to websites. They have some things in common:

- Both run in a secondary thread, allowing JavaScript code to execute without blocking the main thread and the user interface.
- They don't have access to the [`Window`](https://developer.mozilla.org/docs/Web/API/Window) and [`Document`](https://developer.mozilla.org/docs/Web/API/Document) objects, so they can't interact with the DOM directly, and they have limited access to browser APIs.

## Differences

One might think that most things that can be delegated to a web worker can be done in a service worker and vice versa, but there are important differences between them:

- Unlike web workers, service workers allow you to intercept network requests (via the [`fetch`](https://developer.mozilla.org/docs/Web/API/FetchEvent) event) and to listen for Push API events in the background (via the [`push`](https://developer.mozilla.org/docs/Web/API/PushEvent) event).
- A page can spawn multiple web workers, but a single service worker controls all the active tabs under the [scope](https://developer.mozilla.org/docs/Web/API/ServiceWorkerRegistration/scope) it was registered with.
- The lifespan of the web worker is tightly coupled to the tab it belongs to, while the [service worker's lifecycle](https://web.dev/articles/service-worker-lifecycle) is independent of it. For that reason, closing the tab where a web worker is running will terminate it, while a service worker can continue running in the background, even when the site doesn't have any active tabs open.

**Note:** For relatively short bits of work like sending a message, the browser won't likely terminate a service worker when there are no active tabs, but if the task takes too long the browser will terminate the service worker, otherwise it's a risk to the user's privacy and battery. APIs like [Background Fetch](https://developer.chrome.com/blog/background-fetch), that can let you avoid the service worker's termination.

### Use Cases

The differences between both types of workers suggest in which situations one might want to use one or the other:

**Use cases for web workers** are more commonly related to offloading work (like [heavy computations](https://www.youtube.com/watch?v=mDdgfyRB5kg&feature=youtu.be&t=875)) to a secondary thread, to avoid blocking the UI.

![Image 6: Diagram showing a link from the Window object to a web worker.](https://web.dev/static/articles/workers-overview/image/diagram-showing-link-th-27e9ed5676ba6.png)

- **Example:** the team that built the videogame [PROXX](https://proxx.app/) wanted to leave the main thread as free as possible to take care of user input and animations. To achieve that, they [used web workers](https://web.dev/articles/proxx-announce#web_workers) to run the game logic and state maintenance on a separate thread.<br/>
  **Service workers tasks** are generally more related to acting as a network proxy, handling background tasks, and things like caching and offline.

![Image 8: A screenshot of the videogame PROXX.](https://web.dev/static/articles/workers-overview/image/a-screenshot-the-videoga-e3257857d928d.png)

**Example:** In a [podcast PWA](https://bgfetch-http203.glitch.me/), one might want to allow users to download complete episodes to listen to them while offline. A service worker, and, in particular, the [Background Fetch API](https://developer.chrome.com/blog/background-fetch) can be used to that end. That way, if the user closes the tab while the episode is downloading, the task doesn't have to be interrupted.

![Image 9: A screenshot of a Podcast PWA.](https://web.dev/static/articles/workers-overview/image/a-screenshot-a-podcast-p-910200b097c52.png)

The UI is updated to indicate the progress of a download (left). Thanks to service workers, the operation can continue running when all tabs have been closed (right).

### Tools and Libraries

Window and worker communication can be implemented by using different lower level APIs. Fortunately, there are libraries that abstract this process, taking care of the most common use cases. In this section, we'll cover two of them that take care of window to web workers and service workers respectively: [Comlink](https://github.com/GoogleChromeLabs/comlink) and [Workbox](https://developer.chrome.com/docs/workbox).

![Image 10: A screenshot of the videogame PROXX.](https://web.dev/static/articles/workers-overview/image/a-screenshot-the-videoga-1d6073255f591.png)

## Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) is a small (1.6k) [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) library that takes care of many underlying details when building websites that use Web Workers. It has been used in websites like [PROXX](https://proxx.app/) and [Squoosh](https://squoosh.app/). A summary of its motivations and code samples can be found [here](https://surma.dev/things/when-workers/).

## Workbox

[Workbox](https://developer.chrome.com/docs/workbox) is a popular library to build websites that use service workers. It packages a set of best practices around things like caching, offline, background synchronization, etc. The [`workbox-window`](https://developer.chrome.com/docs/workbox/modules/workbox-window) module provides a convenient way to exchange messages between the service worker and the page.

---

# Service Workers

Users expect apps to start reliably on slow or flaky network connections, or even offline. They expect the content they've most recently interacted with, such as media tracks or tickets and itineraries, to be available and usable. When a request isn't possible, they expect the app to tell them instead of silently failing or crashing. And they want all of this to happen quickly. As you can see in [Milliseconds make millions](https://web.dev/case-studies/milliseconds-make-millions), even a 0.1 second improvement in load times can improve conversion by up to 10%. Service workers are the tool that lets your Progressive Web App (PWA) live up to your users' expectations.

![Image 3: A service worker as a middleware proxy, running device-side, between your PWA and servers, which includes both your own servers and cross-domain servers.](https://web.dev/static/learn/pwa/service-workers/image/a-service-worker-a-middl-982e684894b75.png)

A service worker acts as middleware between your PWA and the servers it interacts with.

When an app requests a resource covered by the service worker's scope, the service worker intercepts the request and acts as a network proxy, even if the user is offline. It can then decide if it should serve the resource from the cache using the Cache Storage API, serve it from the network as if there were no active service worker, or create it from a local algorithm. This lets you provide a high-quality experience like that of a platform app, even when your app is offline.

**Tip:** Not all browsers support service workers. Even when they are supported, your service worker won't be available on first load or while it's waiting to activate. We recommend treating your service worker as optional and not requiring it for core features.

## Register a Service Worker

Before a service worker takes control of your page, it must be registered for your PWA. That means the first time a user opens your PWA, all its network requests go directly to your server because the service worker doesn't have control of your pages yet.

After checking whether the browser supports the Service Worker API, your PWA can register a service worker. After it loads, the service worker sets itself up between your PWA and the network, intercepting requests and serving the corresponding responses.

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/serviceworker.js");
}
```

Try registering a service worker, and see what happens in your browser's developer tools.

**Note:** You can only use one service worker in each PWA, but that doesn't mean you need to place your service worker code in only one file. A service worker can include other files using [`importScripts`](https://developer.mozilla.org/docs/Web/API/WorkerGlobalScope/importScripts) in every browser or using [ECMAScript module imports](https://web.dev/articles/es-modules-in-sw) in some modern browsers.

### Verify whether a Service Worker is Registered

To verify whether a service worker is registered, use developer tools in your favorite browser.

In Firefox and Chromium-based browsers (Microsoft Edge, Google Chrome, or Samsung Internet):

1. Open developer tools, then click the **Application** tab.
2. In the left pane, select **Service Workers**.
3. Check that the service worker's script URL appears with the status "Activated". (For more information, see [Lifecycle](https://web.dev/learn/pwa/service-workers#lifecycle)). On Firefox, the status can be "Running" or "Stopped".

In Safari:

1. Click **Develop** \> **Service Workers**.
2. Check this menu for an entry with the current origin. Clicking that entry opens an inspector over the service worker's context.

![Image 4: Service worker developer tools on Chrome, Firefox and Safari.](https://web.dev/static/learn/pwa/service-workers/image/service-worker-developer-5ebe49234dc0f.png)

Service worker developer tools on Chrome, Firefox and Safari.

**Note:** To check service worker registration status on a mobile device, you can remotely inspect a phone or tablet from your desktop browser. For details, see [Tools and debug](https://web.dev/learn/pwa/tools-and-debug).

### Scope

The folder your service worker sits in determines its scope. A service worker that lives at `example.com/my-pwa/sw.js` can control any navigation at or under the _my-pwa_ path, such as `example.com/my-pwa/demos/`. Service workers can control only items (pages, workers, collectively "clients") in their scope. This scope applies to browser tabs and PWA windows.

Only _one_ service worker is allowed per scope. When a service worker is active and running, only one instance is typically available no matter how many clients (PWA windows or browser tabs) are in memory.

**Warning:** Set the scope of your service worker as close to the root of your app as possible so it can intercept all requests related to your PWA. Don't put it inside, for example, a JavaScript folder, or have it loaded from a CDN.

Safari has more complex scope management, known as partitions, affecting how scopes work with cross-domain iframes. To learn more about WebKit's implementation, refer to [their blog post](https://webkit.org/blog/8090/workers-at-your-service/).

## Lifecycle

Service workers have a lifecycle that dictates how they're installed, separately from your PWA installation.

The service worker lifecycle starts with registering the service worker. The browser then tries to download and parse the service worker file. If parsing succeeds, the service worker's `install` event is fired. The `install` event only fires once.

Service worker installation happens silently, without requiring user permission, even if the user doesn't install the PWA. The Service Worker API is available even on platforms that don't support PWA installation, such as Safari and Firefox on desktop devices.

**Tip:** Service worker _registration_ and _installation_ are related but separate events. Registration happens when a page requests a service worker by calling `register()`. Installation happens when a registered service worker exists, can be parsed as JavaScript, and doesn't throw any errors during its first execution.

After the installation, the service worker needs to be activated before it can control its clients, including your PWA. When the service worker is ready to control its clients, the `activate` event fires. However, by default, an activated service worker can't manage the page that registered it until the next time you navigate to that page by reloading the page or reopening the PWA.

You can listen for events in the service worker's global scope using the `self` object:

**serviceworker.js**

```js
// This code executes in its own worker or thread
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});
```

### Update a Service Worker

Service workers get updated when the browser detects that the service worker controlling the client and the new version of the service worker file from the server are byte-different.

**Warning:** When updating your service worker, keep the filename the same. If you change the name, even by adding file hashes, the browser will never get the new version.

After a successful installation, the new service worker waits to activate until the old service worker no longer controls any clients. This state is called "waiting", and it's how the browser ensures that only one version of your service worker is running at a time.

Refreshing a page or reopening the PWA won't make the new service worker take control. The user must close or navigate away from all tabs and windows using the current service worker and then navigate back to give the new service worker control. For more information, see [The service worker lifecycle](https://web.dev/articles/service-worker-lifecycle).

## Service Worker Lifespan

An installed and registered service worker can manage all network request within its scope. It runs on its own thread, with activation and termination controlled by the browser, which lets it work even before your PWA is open or after it closes. Service workers run on their own thread, but in-memory state might not persist between runs of a service worker, so make sure anything you want to reuse for each run is available either in IndexedDB or some other persistent storage.

If it's not already running, a service worker starts whenever a network request is sent in its scope, or when it receives a triggering event like a periodic background sync or a push message.

Service workers are terminated if they've been idle for a few seconds, or if they've been busy for too long. Timings for this vary between browsers. If a service worker has been terminated and an event occurs that would start it up, it restarts.

## Capabilities

A registered and active service worker uses a thread with a completely different execution lifecycle from your PWA's main thread. However, by default, the service worker file itself has no behavior. It won't cache or serve any resources; these are things your code needs to do. You'll find out how in the following chapters.

Service worker's capabilities aren't just for proxy or serving HTTP requests. Other features are available on top of it for other purposes, such as background code execution, web push notifications, and process payments. We'll discuss these additions in [Capabilities](https://web.dev/learn/pwa/capabilities).

## Resources

- [Service Worker API (MDN)](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)
- [Service Worker mindset](https://web.dev/articles/service-worker-mindset)
- [WebKit Workers at your service](https://webkit.org/blog/8090/workers-at-your-service/)
- [ES Modules in Service Workers](https://web.dev/articles/es-modules-in-sw)
- [Service worker lifecycle](https://web.dev/articles/service-worker-lifecycle)

---

# Use Web Workers to Offload Main Thread

An off-main-thread architecture can significantly improve your app's reliability and user experience.

In the past 20 years, the web has evolved dramatically from static documents with a few styles and images to complex, dynamic applications. However, one thing has remained largely unchanged: we have just one thread per browser tab (with some exceptions) to do the work of rendering our sites and running our JavaScript.

As a result, the main thread has become incredibly overworked. And as web apps grow in complexity, the main thread becomes a significant bottleneck for performance. To make matters worse, the amount of time it takes to run code on the main thread for a given user is **almost completely unpredictable** because device capabilities have a massive effect on performance. That unpredictability will only grow as users access the web from an increasingly diverse set of devices, from hyper-constrained feature phones to high-powered, high-refresh-rate flagship machines.

If we want sophisticated web apps to reliably meet performance guidelines like the [Core Web Vitals](https://web.dev/articles/vitals)—which is based on empirical data about human perception and psychology—we need ways to execute our code **off the main thread (OMT)**.

**Note:** If you want to hear more about the case for an OMT architecture, watch my CDS 2019 talk that follows.

## Why Web Workers?

JavaScript is, by default, a single-threaded language that runs [tasks](https://web.dev/articles/optimize-long-tasks#what_is_a_task) on [the main thread](https://web.dev/articles/optimize-long-tasks#what_is_the_main_thread). However, web workers provide a sort of escape hatch from the main thread by allowing developers to create separate threads to handle work off of the main thread. While the scope of web workers is limited and doesn't offer direct access to the DOM, they can be hugely beneficial if there is considerable work that needs to be done that would otherwise overwhelm the main thread.

Where [Core Web Vitals](https://web.dev/articles/vitals) are concerned, running work off the main thread can be beneficial. In particular, offloading work from the main thread to web workers can reduce contention for the main thread, which can improve a page's [Interaction to Next Paint (INP)](https://web.dev/articles/inp) responsiveness metric. When the main thread has less work to process, it can respond more quickly to user interactions.

Less main thread work—especially during startup—also carries a potential benefit for [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp) by reducing long tasks. Rendering an LCP element requires main thread time—either for rendering text or images, which are frequent and common LCP elements—and by reducing main thread work overall, you can ensure that your page's LCP element is less likely to be blocked by expensive work that a web worker could handle instead.

## Threading with Web Workers

Other platforms typically support parallel work by allowing you to give a thread a function, which runs in parallel with the rest of your program. You can access the same variables from both threads, and access to these shared resources can be synchronized with mutexes and semaphores to prevent race conditions.

In JavaScript, we can get roughly similar functionality from web workers, which have been around since 2007 and supported across all major browsers since 2012. Web workers run in parallel with the main thread, but unlike OS threading, they can't share variables.

**Note:** Don't confuse web workers with [service workers](https://web.dev/articles/service-workers-cache-storage) or [worklets](https://developer.mozilla.org/docs/Web/API/Worklet). While the names are similar, the functionality and uses are different.

To create a web worker, pass a file to the worker constructor, which starts running that file in a separate thread:

```js
const worker = new Worker("./worker.js");
```

Communicate with the web worker by sending messages using the [postMessage API](https://developer.mozilla.org/docs/Web/API/Window/postMessage). Pass the message value as a parameter in the postMessage call and then add a message event listener to the worker:

**main.js**

```js
const worker = new Worker("./worker.js");

worker.postMessage([40, 2]);
```

**worker.js**

```js
addEventListener("message", (event) => {
  const [a, b] = event.data; // Do stuff with the message
  // …
});
```

To send a message back to the main thread, use the same postMessage API in the web worker and set up an event listener on the main thread:

**main.js**

```js
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
worker.addEventListener("message", (event) => {
  console.log(event.data);
});
```

**worker.js**

```js
addEventListener("message", (event) => {
  const [a, b] = event.data; // Do stuff with the message
  postMessage(a + b);
});
```

Admittedly, this approach is somewhat limited. Historically, web workers have mainly been used for moving a single piece of heavy work off the main thread. Trying to handle multiple operations with a single web worker gets unwieldy quickly: you have to encode not only the parameters but also the operation in the message, and you have to do bookkeeping to match responses to requests. That complexity is likely why web workers haven't been adopted more widely.

But if we could remove some of the difficulty of communicating between the main thread and web workers, this model could be a great fit for many use cases. And, luckily, there's a library that does just that!

## Comlink: Making Web Workers less Work

[Comlink](http://npm.im/comlink) is a library whose goal is to let you use web workers without having to think about the details of postMessage. Comlink lets you to share variables between web workers and the main thread almost like other programming languages that support threading.

You set up Comlink by importing it in a web worker and defining a set of functions to expose to the main thread. You then import Comlink on the main thread, wrap the worker, and get access to the exposed functions:

**worker.js**

```js
import { expose } from "comlink";

const api = {
  someMethod() {
    // …
  },
};
expose(api);
```

**main.js**

```js
import { wrap } from "comlink";

const worker = new Worker("./worker.js");
const api = wrap(worker);
```

The api variable on main thread behaves the same as the one in the web worker, except that every function returns a promise for a value rather than the value itself.

### Comlink: Examples

### Running a Simple Function

> **main.js**

```js
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
async function init() {
  const worker = new Worker("worker.js");
  // WebWorkers use `postMessage` and therefore work with Comlink.
  const obj = Comlink.wrap(worker);
  alert(`Counter: ${await obj.counter}`);
  await obj.inc();
  alert(`Counter: ${await obj.counter}`);
}
init();
```

> **worker.js**

```js
importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
// importScripts("../../../dist/umd/comlink.js");

const obj = {
  counter: 0,
  inc() {
    this.counter++;
  },
};

Comlink.expose(obj);
```

### Callbacks

> **main.js**

```js
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
// import * as Comlink from "../../../dist/esm/comlink.mjs";
function callback(value) {
  alert(`Result: ${value}`);
}
async function init() {
  const remoteFunction = Comlink.wrap(new Worker("worker.js"));
  await remoteFunction(Comlink.proxy(callback));
}
init();
```

> **worker.js**

```js
importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
// importScripts("../../../dist/umd/comlink.js");

async function remoteFunction(cb) {
  await cb("A string from a worker");
}

Comlink.expose(remoteFunction);
```

### `SharedWorker`

When using Comlink with a [`SharedWorker`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) you have to:

1. Use the [`port`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/port) property, of the `SharedWorker` instance, when calling `Comlink.wrap`.
2. Call `Comlink.expose` within the [`onconnect`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorkerGlobalScope/onconnect) callback of the shared worker.

**Pro tip:** You can access DevTools for any shared worker currently running in Chrome by going to: **<chrome://inspect/#workers**>

**main.js**

```js
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
async function init() {
  const worker = new SharedWorker("worker.js");
  /**
   * SharedWorkers communicate via the `postMessage` function in their `port` property.
   * Therefore you must use the SharedWorker's `port` property when calling `Comlink.wrap`.
   */
  const obj = Comlink.wrap(worker.port);
  alert(`Counter: ${await obj.counter}`);
  await obj.inc();
  alert(`Counter: ${await obj.counter}`);
}
init();
```

**worker.js**

```js
importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
// importScripts("../../../dist/umd/comlink.js");

const obj = {
  counter: 0,
  inc() {
    this.counter++;
  },
};

/**
 * When a connection is made into this shared worker, expose `obj`
 * via the connection `port`.
 */
onconnect = function (event) {
  const port = event.ports[0];

  Comlink.expose(obj, port);
};

// Single line alternative:
// onconnect = (e) => Comlink.expose(obj, e.ports[0]);
```

**For additional examples, please see the [docs/examples](https://github.com/GoogleChromeLabs/comlink/blob/HEAD/docs/examples) directory in the project.**

## API

[](https://www.npmjs.com/package/comlink#api)

### `Comlink.wrap(endpoint)` And `Comlink.expose(value, endpoint?, allowedOrigins?)`

Comlink's goal is to make *exposed* values from one thread available in the other. `expose` exposes `value` on `endpoint`, where `endpoint` is a [`postMessage`-like interface](https://github.com/GoogleChromeLabs/comlink/blob/HEAD/src/protocol.ts) and `allowedOrigins` is an array of RegExp or strings defining which origins should be allowed access (defaults to special case of `['*']` for all origins).

`wrap` wraps the *other* end of the message channel and returns a proxy. The proxy will have all properties and functions of the exposed value, but access and invocations are inherently asynchronous. This means that a function that returns a number will now return *a promise* for a number. **As a rule of thumb: If you are using the proxy, put `await` in front of it.** Exceptions will be caught and re-thrown on the other side.

### `Comlink.transfer(value, transferables)` And `Comlink.proxy(value)`

By default, every function parameter, return value and object property value is copied, in the sense of [structured cloning](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). Structured cloning can be thought of as deep copying, but has some limitations. See [this table](https://github.com/GoogleChromeLabs/comlink/blob/HEAD/structured-clone-table.md) for details.

If you want a value to be transferred rather than copied—provided the value is or contains a [`Transferable`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) —you can wrap the value in a `transfer()` call and provide a list of transferable values:

```js
const data = new Uint8Array([1, 2, 3, 4, 5]);
await myProxy.someFunction(Comlink.transfer(data, [data.buffer]));
```

Lastly, you can use `Comlink.proxy(value)`. When using this Comlink will neither copy nor transfer the value, but instead send a proxy. Both threads now work on the same value. This is useful for callbacks, for example, as functions are neither structured cloneable nor transferable.

```js
myProxy.onready = Comlink.proxy((data) => {
  /* ... */
});
```

### Transfer Handlers and Event Listeners

It is common that you want to use Comlink to add an event listener, where the event source is on another thread:

```js
button.addEventListener("click", myProxy.onClick.bind(myProxy));
```

While this won't throw immediately, `onClick` will never actually be called. This is because [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) is neither structured cloneable nor transferable. As a workaround, Comlink offers transfer handlers.

Each function parameter and return value is given to *all* registered transfer handlers. If one of the event handler signals that it can process the value by returning `true` from `canHandle()`, it is now responsible for serializing the value to structured cloneable data and for deserializing the value. A transfer handler has be set up on *both sides* of the message channel. Here's an example transfer handler for events:

```js
Comlink.transferHandlers.set("EVENT", {
  canHandle: (obj) => obj instanceof Event,
  serialize: (ev) => {
    return [
      {
        target: {
          id: ev.target.id,
          classList: [...ev.target.classList],
        },
      },
      [],
    ];
  },
  deserialize: (obj) => obj,
});
```

Note that this particular transfer handler won't create an actual `Event`, but just an object that has the `event.target.id` and `event.target.classList` property. Often, this is enough. If not, the transfer handler can be easily augmented to provide all necessary data.

### `Comlink.releaseProxy`

Every proxy created by Comlink has the `[releaseProxy]()` method. Calling it will detach the proxy and the exposed object from the message channel, allowing both ends to be garbage collected.

```js
const proxy = Comlink.wrap(port);
// ... use the proxy ...
proxy[Comlink.releaseProxy]();
```

If the browser supports the [WeakRef proposal](https://github.com/tc39/proposal-weakrefs), `[releaseProxy]()` will be called automatically when the proxy created by `wrap()` gets garbage collected.

### `Comlink.finalizer`

If an exposed object has a property `[Comlink.finalizer]`, the property will be invoked as a function when the proxy is being released. This can happen either through a manual invocation of `[releaseProxy]()` or automatically during garbage collection if the runtime supports the [WeakRef proposal](https://github.com/tc39/proposal-weakrefs) (see `Comlink.releaseProxy` above). Note that when the finalizer function is invoked, the endpoint is closed and no more communication can happen.

### `Comlink.createEndpoint`

Every proxy created by Comlink has the `[createEndpoint]()` method. Calling it will return a new `MessagePort`, that has been hooked up to the same object as the proxy that `[createEndpoint]()` has been called on.

```js
const port = myProxy[Comlink.createEndpoint]();
const newProxy = Comlink.wrap(port);
```

### `Comlink.windowEndpoint(window, context = self, targetOrigin = "*")`

Windows and Web Workers have a slightly different variants of `postMessage`. If you want to use Comlink to communicate with an iframe or another window, you need to wrap it with `windowEndpoint()`.

`window` is the window that should be communicate with. `context` is the `EventTarget` on which messages *from* the `window` can be received (often `self`). `targetOrigin` is passed through to `postMessage` and allows to filter messages by origin. For details, see the documentation for `Window.postMessage`.

## What Code Should You Move to a Web Worker?

Web workers don't have access to the DOM and many APIs like [WebUSB](https://developer.mozilla.org/docs/Web/API/USB), [WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API), or [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API), so you can't put pieces of your app that rely on such access in a worker. Still, every small piece of code moved to a worker buys more headroom on the main thread for stuff that _has_ to be there—like updating the user interface.

**Note:** Restricting UI access to the main thread is actually typical in other languages. In fact, both iOS and Android call the main thread the _UI thread_.

One problem for web developers is that most web apps rely on a UI framework like Vue or React to orchestrate everything in the app; everything is a component of the framework and so is inherently tied to the DOM. That would seem to make it difficult to migrate to an OMT architecture.

However, if we shift to a model in which UI concerns are separated from other concerns, like state management, web workers can be quite useful even with framework-based apps. That's exactly the approach taken with PROXX.

### PROXX: an OMT case Study

The Google Chrome team developed [PROXX](https://web.dev/articles/load-faster-like-proxx) as a Minesweeper clone that meets [Progressive Web App](https://web.dev/learn/pwa) requirements, including working offline and having an engaging user experience. Unfortunately, early versions of the game performed poorly on constrained devices like feature phones, which led the team to realize that the main thread was a bottleneck.

The team decided to use web workers to separate the game's visual state from its logic:

- The main thread handles rendering of animations and transitions.
- A web worker handles game logic, which is purely computational.

**Note:** This approach is similar to the Redux [Flux pattern](https://facebook.github.io/flux/), so many Flux apps may be able to migrate to an OMT architecture with less effort than expected. Take a look at [this blog post about applying OMT to a Redux app](http://dassur.ma/things/react-redux-comlink/) to read more.

OMT had interesting effects on PROXX's feature phone performance. In the non-OMT version, the UI is frozen for six seconds after the user interacts with it. There's no feedback, and the user has to wait for the full six seconds before being able to do something else.

UI response time in the **non-OMT** version of PROXX.

In the OMT version, however, the game takes _twelve_ seconds to complete a UI update. While that seems like a performance loss, it actually leads to increased feedback to the user. The slowdown occurs because the app is shipping more frames than the non-OMT version, which isn't shipping any frames at all. The user therefore knows that something is happening and can continue playing as the UI updates, making the game feel considerably better.

UI response time in the **OMT** version of PROXX.

This is a conscious tradeoff: we give users of constrained devices an experience that _feels_ better without penalizing users of high-end devices.

**Implications of an OMT architecture**

As the PROXX example shows, OMT makes your app reliably run on a wider range of devices, but it doesn't make your app faster:

- You're just moving work from the main thread, not reducing the work.
- The extra communication overhead between the web worker and the main thread can sometimes make things marginally slower.

## Consider the Tradeoffs

Since the main thread is free to process user interactions like scrolling while JavaScript is running, there are fewer dropped frames even though total wait time may be marginally longer. Making the user wait a bit is preferable to dropping a frame because the margin of error is smaller for dropped frames: dropping a frame happens in milliseconds, while you have _hundreds_ of milliseconds before a user perceives wait time.

Because of the unpredictability of performance across devices, the goal of OMT architecture is really about **reducing risk**—making your app more robust in the face of highly variable runtime conditions—not about the performance benefits of parallelization. The increase in resilience and the improvements to UX are more than worth any small tradeoff in speed.

**Note:** Developers are sometimes concerned about the cost of copying complex objects across the main thread and web workers. There's more detail in the talk, but, in general, you shouldn't break your performance budget if your object's stringified JSON representation is less than 10 KB. If you need to copy larger objects, consider using [ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or [WebAssembly](https://webassembly.org/). You can read more about this issue in [this blog post about postMessage performance](https://dassur.ma/things/is-postmessage-slow).

## A Note about Tooling

Web workers aren't yet mainstream, so most module tools—like [webpack](https://webpack.js.org/) and [Rollup](https://github.com/rollup/rollup)—don't support them out of the box. ([Parcel](https://parceljs.org/) does though!) Luckily, there are plugins to make web workers, well, _work_ with webpack and Rollup:

- [worker-plugin](https://github.com/GoogleChromeLabs/worker-plugin) for webpack
- [rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) for Rollup

## Summing up

To make sure our apps are as reliable and accessible as possible, especially in an increasingly globalized marketplace, we need to support constrained devices—they're how most users are accessing the web globally. OMT offers a promising way to increase performance on such devices without adversely affecting users of high-end devices.

Also, OMT has secondary benefits:

- It moves JavaScript execution costs to a separate thread.
- It moves _parsing_ costs, meaning UI might boot up faster. That might reduce [First Contentful Paint](https://web.dev/articles/fcp) or even [Time to Interactive](https://web.dev/articles/tti), which can in turn increase your [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) score.

Web workers don't have to be scary. Tools like Comlink are taking the work out of workers and making them a viable choice for a wide range of web applications.

---

# Threading the Web

JavaScript is single-threaded, which means it can only perform one operation at a time. This is intuitive and works well for lots of cases on the web, but can become problematic when we need to do heavy lifting tasks like data processing, parsing, computation, or analysis. As more and more complex applications are delivered on the web, there's an increased need for multi-threaded processing.

On the web platform, the main primitive for threading and parallelism is the [Web Workers API](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers). Workers are a lightweight abstraction on top of [operating system threads](https://en.wikipedia.org/wiki/Thread_%28computing%29) that expose a message passing API for inter-thread communication. This can be immensely useful when performing costly computations or operating on large datasets, allowing the main thread to run smoothly while performing the expensive operations on one or more background threads.

Here's a typical example of worker usage, where a worker script listens for messages from the main thread and responds by sending back messages of its own:

**page.js:**

```js
const worker = new Worker("worker.js");
worker.addEventListener("message", (e) => {
  console.log(e.data);
});
worker.postMessage("hello");
```

**worker.js:**

```js
addEventListener("message", (e) => {
  if (e.data === "hello") {
    postMessage("world");
  }
});
```

The Web Worker API has been available in most browsers for over ten years. While that means workers have excellent browser support and are well-optimized, it also means they long predate JavaScript modules. Since there was no module system when workers were designed, the API for loading code into a worker and composing scripts has remained similar to the synchronous script loading approaches common in 2009.

## History: Classic Workers

The Worker constructor takes a [classic script](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script) URL, which is relative to the document URL. It immediately returns a reference to the new worker instance, which exposes a messaging interface as well as a `terminate()` method that immediately stops and destroys the worker.

```js
const worker = new Worker("worker.js");
```

An `importScripts()` function is available within web workers for loading additional code, but it pauses execution of the worker in order to fetch and evaluate each script. It also executes scripts in the global scope like a classic `<script>` tag, meaning the variables in one script can be overwritten by the variables in another.

**worker.js:**

```js
importScripts("greet.js");
// ^ could block for seconds
addEventListener("message", (e) => {
  postMessage(sayHello());
});
```

**greet.js:**

```js
// global to the whole worker
function sayHello() {
  return "world";
}
```

For this reason, web workers have historically imposed an outsized effect on the architecture of an application. Developers have had to create clever tooling and workarounds to make it possible to use web workers without giving up modern development practices. As an example, bundlers like webpack embed a small module loader implementation into generated code that uses `importScripts()` for code loading, but wraps modules in functions to avoid variable collisions and simulate dependency imports and exports.

## Enter Module Workers

A new mode for web workers with the ergonomics and performance benefits of [JavaScript modules](https://v8.dev/features/modules) is shipping in Chrome 80, called module workers. The `Worker` constructor now accepts a new `{type:"module"}` option, which changes script loading and execution to match `<script type="module">`.

```js
const worker = new Worker("worker.js", {
  type: "module",
});
```

Since module workers are standard JavaScript modules, they can use import and export statements. As with all JavaScript modules, dependencies are only executed once in a given context (main thread, worker, etc.), and all future imports reference the already-executed module instance. The loading and execution of JavaScript modules is also optimized by browsers. A module's dependencies can be loaded prior to the module being executed, which allows entire module trees to be loaded in parallel. Module loading also caches parsed code, which means modules that are used on the main thread and in a worker only need to be parsed once.

Moving to JavaScript modules also enables the use of [dynamic import](https://v8.dev/features/dynamic-import) for lazy loading code without blocking execution of the worker. Dynamic import is much more explicit than using `importScripts()` to load dependencies, since the imported module's exports are returned rather than relying on global variables.

**worker.js:**

```js
import { sayHello } from "./greet.js";
addEventListener("message", (e) => {
  postMessage(sayHello());
});
```

**greet.js:**

```js
import greetings from "./data.js";
export function sayHello() {
  return greetings.hello;
}
```

To ensure great performance, the old `importScripts()` method is not available within module workers. Switching workers to use JavaScript modules means all code is loaded in [strict mode](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode). Another notable change is that the value of `this` in the top-level scope of a JavaScript module is `undefined`, whereas in classic workers the value is the worker's global scope. Fortunately, there has always been a `self` global that provides a reference to the global scope. It's available in all types of workers including service workers, as well as in the DOM.

**Note:** Module workers also remove support for HTML-style comments. Did you know you could use HTML comments in web worker scripts?

### Preload Workers with `modulepreload`

One substantial performance improvement that comes with module workers is the ability to preload workers and their dependencies. With module workers, scripts are loaded and executed as standard JavaScript modules, which means they can be preloaded and even pre-parsed using `modulepreload`:

```html
<!-- preloads worker.js and its dependencies: -->
<link rel="modulepreload" href="worker.js" />

<script>
  addEventListener("load", () => {
    // our worker code is likely already parsed and ready to execute!
    const worker = new Worker("worker.js", { type: "module" });
  });
</script>
```

Preloaded modules can also be used by both the main thread and module workers. This is useful for modules that are imported in both contexts, or in cases where it's not possible to know in advance whether a module will be used on the main thread or in a worker.

Previously, the options available for preloading web worker scripts were limited and not necessarily reliable. Classic workers had their own "worker" resource type for preloading, but no browsers implemented `<link rel="preload" as="worker">`. As a result, the primary technique available for preloading web workers was to use `<link rel="prefetch">`, which relied entirely on the HTTP cache. When used in combination with the correct caching headers, this made it possible to avoid worker instantiation having to wait to download the worker script. However, unlike `modulepreload` this technique did not support preloading dependencies or pre-parsing.

### What about Shared Workers?

[Shared workers](https://developer.mozilla.org/docs/Web/API/SharedWorker/SharedWorker) have been updated with support for JavaScript modules as of Chrome 83. Like dedicated workers, constructing a shared worker with the `{type:"module"}` option now loads the worker script as a module rather than a classic script:

```js
const worker = new SharedWorker("/worker.js", {
  type: "module",
});
```

Prior to support of JavaScript modules, the `SharedWorker()` constructor expected only a URL and an optional `name` argument. This will continue to work for classic shared worker usage; however creating module shared workers requires using the new `options` argument. The [available options](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-and-the-sharedworker-interface) are the same as those for a dedicated worker, including the `name` option that supersedes the previous `name` argument.

### What about Service Worker?

The service worker specification [has already been updated](https://w3c.github.io/ServiceWorker/#service-worker-concept) to support accepting a JavaScript module as the entry point, using the same `{type:"module"}` option as module workers, however this change has yet to be implemented in browsers. Once that happens, it will be possible to instantiate a service worker using a JavaScript module using the following code:

```js
navigator.serviceWorker.register("/sw.js", {
  type: "module",
});
```

Now that the specification has been updated, browsers are beginning to implement the new behavior. This takes time because there are some extra complications associated with bringing JavaScript modules to service worker. Service worker registration needs to [compare imported scripts with their previous cached versions](https://chromestatus.com/feature/6533131347689472) when determining whether to trigger an update, and this needs to be implemented for JavaScript modules when used for service workers. Also, service workers need to be able to [bypass the cache](https://chromestatus.com/feature/5897293530136576) for scripts in certain cases when checking for updates.

---

# ES Modules in Workers

> A modern alternative to importScripts().

## Background

[ES modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) have been a developer favorite for a while now. In addition to a [number of other benefits](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/), they offer the promise of a universal module format where shared code can be released once and run in browsers and in alternative runtimes like [Node.js](https://nodejs.org/en/). While [all modern browsers](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules#import) offer some ES module support, they don't all offer support _everywhere_ that code can be run. Specifically, support for importing ES modules inside of a browser's [service worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API/Using_Service_Workers) is just starting to become more widely available.

This article details the current state of ES module support in service workers across common browsers, along with some gotchas to avoid, and best practices for shipping backwards-compatible service worker code.

## Use Cases

The ideal use case for ES modules inside of service workers is for loading a modern library or configuration code that's shared with other runtimes that support ES modules.

Attempting to share code in this way prior to ES modules entailed using older "universal" module formats like [UMD](https://github.com/umdjs/umd) that include unneeded boilerplate, and writing code that made changes to globally exposed variables.

Scripts imported via ES modules can trigger the service worker [update](https://web.dev/articles/service-worker-lifecycle#updates) flow if their contents change, matching the [behavior](https://developer.chrome.com/blog/fresher-sw#checks-for-updates-to-imported-scripts) of `[importScripts()](https://developer.mozilla.org/docs/Web/API/WorkerGlobalScope/importScripts)`.

## Current Limitations

### Static Imports only

ES modules can be imported in one of two ways: either [statically](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import), using the `import … from '…'` syntax, or [dynamically](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports), using the `import()` method. Inside of a service worker, only the static syntax is currently supported.

This limitation is analogous to a [similar restriction](https://developer.chrome.com/blog/tweeks-to-addAll-importScripts) placed on `importScripts()` usage. Dynamic calls to `importScripts()` do not work inside of a service worker, and all `importScripts()` calls, which are inherently synchronous, must complete before the service worker completes its `install` phase. This restriction ensures that the browser knows about, and is able to implicitly cache, all JavaScript code needed for a service worker's implementation during installation.

Eventually, this restriction might be lifted, and dynamic ES module imports [may be allowed](https://github.com/w3c/ServiceWorker/issues/1356#issuecomment-783220858). For now, ensure that you only use the static syntax inside of a service worker.

#### What about other Workers?

Support for [ES modules in "dedicated" workers](https://web.dev/articles/module-workers)—those constructed with `new Worker('…', {type: 'module'})`—is more widespread, and has been supported in Chrome and Edge since [version 80](https://chromestatus.com/feature/5761300827209728), as well as [recent versions](https://bugs.webkit.org/show_bug.cgi?id=164860) of Safari. Both static and dynamic ES module imports are supported in dedicated workers.

Chrome and Edge have supported ES modules in [shared workers](https://developer.mozilla.org/docs/Web/API/SharedWorker) since [version 83](https://chromestatus.com/feature/5169440012369920), but no other browser offers support at this time.

### No Support for Import Maps

[Import maps](https://github.com/WICG/import-maps/blob/main/README.md) allow runtime environments to rewrite module specifiers, to, for example, prepend the URL of a preferred CDN from which the ES modules can be loaded.

While Chrome and Edge [version 89](https://www.chromestatus.com/feature/5315286962012160) and above support import maps, they currently [cannot be used](https://github.com/WICG/import-maps/issues/2) with service workers.

### Browser Support

ES modules in service workers are supported in Chrome and Edge starting with [version 91](https://chromestatus.com/feature/4609574738853888).

Safari added support in the [Technology Preview 122 Release](https://webkit.org/blog/11577/release-notes-for-safari-technology-preview-122/#:%7E:text=Added%20support%20for%20modules%20in%20Service%20Workers), and developers should expect to see this functionality released in the stable version of Safari in the future.

### Example Code

This is a basic example of using a shared ES module in a web app's `window` context, while also registering a service worker that uses the same ES module:

**config.js**

```js
export const cacheName = "my-cache";
```

**(web-app)**

```html
<script type="module">
  import { cacheName } from "./config.js";
  // Do something with cacheName.

  await navigator.serviceWorker.register("es-module-sw.js", {
    type: "module",
  });
</script>
```

**es-module-sw.js**

```js
import { cacheName } from "./config.js";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      // …
    })(),
  );
});
```

### Backwards Compatibility

The above example would work fine if all browsers supported ES modules in service workers, but as of this writing, that's not the case.

To accommodate browsers that don't have built-in support, you can run your service worker script through an [ES module-compatible bundler](https://bundlers.tooling.report/) to create a service worker that includes all of the module code inline, and will work in older browsers. Alternatively, if the modules you're attempting to import are already available bundled in [IIFE](https://developer.mozilla.org/docs/Glossary/IIFE) or [UMD](https://github.com/umdjs/umd) formats, you can import them using `importScripts()`.

Once you have two versions of your service worker available—one that uses ES modules, and the other that doesn't—you'll need to detect what the current browser supports, and register the corresponding service worker script. The best practices for detecting support are currently in flux, but you can follow the discussion in this [GitHub issue](https://github.com/w3c/ServiceWorker/issues/1582) for recommendations.
