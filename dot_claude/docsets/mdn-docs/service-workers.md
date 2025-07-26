---
tags:
  - "#web-workers"
  - "#service-workers"
  - "#web-api"
  - "#web-security"
  - "#background-sync"
  - "#offline-first"
  - "#browser-caching"
  - "#progressive-web-apps"
---
**Note:** This feature is available in [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available). They are intended, among other things, to enable the creation of effective offline experiences, intercept network requests, and take appropriate action based on whether the network is available, and update assets residing on the server. They will also allow access to push notifications and background sync APIs.

## [Service worker concepts and usage](#service_worker_concepts_and_usage)

A service worker is an event-driven [worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) registered against an origin and a path. It takes the form of a JavaScript file that can control the web page/site that it is associated with, intercepting and modifying navigation and resource requests, and caching resources in a very granular fashion to give you complete control over how your app behaves in certain situations (the most obvious one being when the network is not available).

Service workers run in a worker context: they therefore have no DOM access and run on a different thread to the main JavaScript that powers your app. They are non-blocking and designed to be fully asynchronous. As a consequence, APIs such as synchronous [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and [Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) can't be used inside a service worker.

Service workers can't import JavaScript modules dynamically, and [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#browser_compatibility) will throw if it is called in a service worker global scope. Static imports using the [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) statement are allowed.

Service workers only run over HTTPS, for security reasons. Most significantly, HTTP connections are susceptible to malicious code injection by [man in the middle](https://developer.mozilla.org/en-US/docs/Glossary/MitM) attacks, and such attacks could be worse if allowed access to these powerful APIs. In Firefox, service worker APIs are also hidden and cannot be used when the user is in [private browsing mode](https://support.mozilla.org/en-US/kb/private-browsing-use-firefox-without-history).

**Note:** On Firefox, for testing you can run service workers over HTTP (insecurely); simply check the **Enable Service Workers over HTTP (when toolbox is open)** option in the Firefox DevTools options/gear menu.

**Note:** Unlike previous attempts in this area such as [AppCache](https://alistapart.com/article/application-cache-is-a-douchebag/), service workers don't make assumptions about what you are trying to do, but then break when those assumptions are not exactly right. Instead, service workers give you much more granular control.

**Note:** Service workers make heavy use of [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), as generally they will wait for responses to come through, after which they will respond with a success or failure action. The promises architecture is ideal for this.

### [Registration](#registration)

A service worker is first registered using the [`ServiceWorkerContainer.register()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) method. If successful, your service worker will be downloaded to the client and attempt installation/activation (see below) for URLs accessed by the user inside the whole origin, or a subset specified by you.

### [Download, install and activate](#download_install_and_activate)

At this point, your service worker will observe the following lifecycle:

1. Download
2. Install
3. Activate

The service worker is immediately downloaded when a user first accesses a service worker–controlled site/page.

After that, it is updated when:

- A navigation to an in-scope page occurs.
- An event is fired on the service worker and it hasn't been downloaded in the last 24 hours.

Installation is attempted when the downloaded file is found to be new — either different to an existing service worker (byte-wise compared), or the first service worker encountered for this page/site.

If this is the first time a service worker has been made available, installation is attempted, then after a successful installation, it is activated.

If there is an existing service worker available, the new version is installed in the background, but not yet activated — at this point it is called the _worker in waiting_. It is only activated when there are no longer any pages loaded that are still using the old service worker. As soon as there are no more pages to be loaded, the new service worker activates (becoming the _active worker_). Activation can happen sooner using [`ServiceWorkerGlobalScope.skipWaiting()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) and existing pages can be claimed by the active worker using [`Clients.claim()`](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim).

You can listen for the [`install`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event "install") event; a standard action is to prepare your service worker for usage when this fires, for example by creating a cache using the built-in storage API, and placing assets inside it that you'll want for running your app offline.

There is also an [`activate`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event "activate") event. The point where this event fires is generally a good time to clean up old caches and other things associated with the previous version of your service worker.

Your service worker can respond to requests using the [`FetchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent) event. You can modify the response to these requests in any way you want, using the [`FetchEvent.respondWith()`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith) method.

**Note:** Because `install`/`activate` events could take a while to complete, the service worker spec provides a [`waitUntil()`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil "waitUntil()") method. Once it is called on `install` or `activate` events with a promise, functional events such as `fetch` and `push` will wait until the promise is successfully resolved.

For a complete tutorial to show how to build up your first basic example, read [Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

### [Using static routing to control how resources are fetched](#using_static_routing_to_control_how_resources_are_fetched)

Service workers can incur an unnecessary performance cost — when a page is loaded for the first time in a while, the browser has to wait for the service worker to start up and run to know what content to load and whether it should come from a cache or the network.

If you already know ahead of time where certain content should be fetched from, you can bypass the service worker altogether and fetch resources immediately. The [`InstallEvent.addRoutes()`](https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent/addRoutes) method can be used to implement this use case and more.

## [Other use case ideas](#other_use_case_ideas)

Service workers are also intended to be used for such things as:

- Background data synchronization.
- Responding to resource requests from other origins.
- Receiving centralized updates to expensive-to-calculate data such as geolocation or gyroscope, so multiple pages can make use of one set of data.
- Client-side compiling and dependency management of CoffeeScript, less, CJS/AMD modules, etc. for development purposes.
- Hooks for background services.
- Custom templating based on certain URL patterns.
- Performance enhancements, for example, pre-fetching resources that the user is likely to need soon, such as the next few pictures in a photo album.
- API mocking.

In the future, service workers will be able to do several other useful things for the web platform that will bring it closer to native app viability. Interestingly, other specifications can and will start to make use of the service worker context, for example:

- [Background synchronization](https://github.com/WICG/background-sync): Start up a service worker even when no users are at the site, so caches can be updated, etc.
- [Reacting to push messages](https://developer.mozilla.org/en-US/docs/Web/API/Push_API): Start up a service worker to send users a message to tell them new content is available.
- Reacting to a particular time & date.
- Entering a geo-fence.

## [Interfaces](#interfaces)

[`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

Represents the storage for [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) / [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object pairs that are cached as part of the [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) life cycle.

[`CacheStorage`](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)

Represents the storage for [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache) objects. It provides a master directory of all the named caches that a [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) can access, and maintains a mapping of string names to corresponding [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache) objects.

[`Client`](https://developer.mozilla.org/en-US/docs/Web/API/Client)

Represents the scope of a service worker client. A service worker client is either a document in a browser context or a [`SharedWorker`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker), which is controlled by an active worker.

[`Clients`](https://developer.mozilla.org/en-US/docs/Web/API/Clients)

Represents a container for a list of [`Client`](https://developer.mozilla.org/en-US/docs/Web/API/Client) objects; the main way to access the active service worker clients at the current origin.

[`ExtendableEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent)

Extends the lifetime of the `install` and `activate` events dispatched on the [`ServiceWorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope), as part of the service worker lifecycle. This ensures that any functional events (like [`FetchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)) are not dispatched to the [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker), until it upgrades database schemas, and deletes outdated cache entries, etc.

[`ExtendableMessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableMessageEvent)

The event object of a [`message`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event "message") event fired on a service worker (when a channel message is received on the [`ServiceWorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope) from another context) — extends the lifetime of such events.

[`FetchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)

The parameter passed into the [`onfetch`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event "onfetch") handler, `FetchEvent` represents a fetch action that is dispatched on the [`ServiceWorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope) of a [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker). It contains information about the request and resulting response, and provides the [`FetchEvent.respondWith()`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith "FetchEvent.respondWith()") method, which allows us to provide an arbitrary response back to the controlled page.

[`InstallEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent)

The parameter passed into an [`install`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event "install") event handler function, the `InstallEvent` interface represents an install action that is dispatched on the [`ServiceWorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope) of a [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker). As a child of [`ExtendableEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent), it ensures that functional events such as [`FetchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent) are not dispatched during installation.

[`NavigationPreloadManager`](https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager)

Provides methods for managing the preloading of resources with a service worker.

[`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker)

Represents a service worker. Multiple browsing contexts (e.g. pages, workers, etc.) can be associated with the same `ServiceWorker` object.

[`ServiceWorkerContainer`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer)

Provides an object representing the service worker as an overall unit in the network ecosystem, including facilities to register, unregister, and update service workers, and access the state of service workers and their registrations.

[`ServiceWorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)

Represents the global execution context of a service worker.

[`ServiceWorkerRegistration`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration)

Represents a service worker registration.

[`WindowClient`](https://developer.mozilla.org/en-US/docs/Web/API/WindowClient)

Represents the scope of a service worker client that is a document in a browser context, controlled by an active worker. This is a special type of [`Client`](https://developer.mozilla.org/en-US/docs/Web/API/Client) object, with some additional methods and properties available.

### [Extensions to other interfaces](#extensions_to_other_interfaces)

[`Window.caches`](https://developer.mozilla.org/en-US/docs/Web/API/Window/caches) and [`WorkerGlobalScope.caches`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/caches)

Returns the [`CacheStorage`](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) object associated with the current context.

[`Navigator.serviceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker) and [`WorkerNavigator.serviceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerNavigator/serviceWorker)

Returns a [`ServiceWorkerContainer`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer) object, which provides access to registration, removal, upgrade, and communication with the [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) objects for the [associated document](https://html.spec.whatwg.org/multipage/browsers.html#concept-document-window).

## [Specifications](#specifications)

|Specification|
|---|
|[Service Workers  <br>](https://w3c.github.io/ServiceWorker/)|

## [See also](#see_also)