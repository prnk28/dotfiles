---
tags:
  - "#distributed-systems"
  - "#architecture"
  - "#software"
  - "#background-sync"
  - "#service-workers"
  - "#web-api"
  - "#web-security"
  - "#offline-first"
  - "#browser-caching"
  - "#progressive-web-apps"
  - "#web-workers"
  - "#network-resilience"
---
## 1. Introduction[](#introduction)

_This section is non-normative._

Web Applications often run in environments with unreliable networks (e.g., mobile phones) and unknown lifetimes (the browser might be killed or the user might navigate away). This makes it difficult to synchronize client data from web apps (such as photo uploads, document changes, or composed emails) with servers. If the browser closes or the user navigates away before synchronization can complete, the app must wait until the user revisits the page to try again. This specification provides a new onsync [service worker](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-concept) event which can fire [in the background](#in-the-background) so that synchronization attempts can continue despite adverse conditions when initially requested. This API is intended to reduce the time between content creation and content synchronization with the server.

As this API relies on service workers, functionality provided by this API is only available in a [secure context](https://w3c.github.io/webappsec/specs/powerfulfeatures/#secure-context).

[](#example-873b4e55)Requesting a background sync opportunity from a [browsing context](https://html.spec.whatwg.org/#browsing-context):

```js
function sendChatMessage(message) {
  return addChatMessageToOutbox(message).then(() => {
    // Wait for the scoped service worker registration to get a
    // service worker with an active state
    return navigator.serviceWorker.ready;
  }).then(reg => {
    return reg.sync.register('send-chats');
  }).then(() => {
    console.log('Sync registered!');
  }).catch(() => {
    console.log('Sync registration failed :(');
  });
}
```


In the above example `addChatMessageToOutbox` is a developer-defined function.

Reacting to a sync event within a [service worker](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-concept):

```js
self.addEventListener('sync', event => {
  if (event.tag == 'send-chats') {
    event.waitUntil(
      getMessagesFromOutbox().then(messages => {
        // Post the messages to the server
        return fetch('/send', {
          method: 'POST',
          body: JSON.stringify(messages),
          headers: { 'Content-Type': 'application/json' }
        }).then(() => {
          // Success! Remove them from the outbox
          return removeMessagesFromOutbox(messages);
        });
      }).then(() => {
        // Tell pages of your success so they can update UI
        return clients.matchAll({ includeUncontrolled: true });
      }).then(clients => {
        clients.forEach(client => client.postMessage('outbox-processed'))
      })
    );
  }
});
```

In the above example `getMessagesFromOutbox` and `removeMessagesFromOutbox` are developer-defined functions.

## 2. Concepts[](#concepts)

The sync event is considered to run in the background if no [service worker clients](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#dfn-service-worker-client) whose [frame type](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#dfn-service-worker-client-frame-type) is top-level or auxiliary exist for the origin of the corresponding service worker registration.

The user agent is considered to be online if the user agent has established a network connection. A user agent MAY use a stricter definition of being [online](#online). Such a stricter definition MAY take into account the particular [service worker](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-concept) or origin a [sync registration](#sync-registration) is associated with.

## 3. Constructs[](#constructs)

A [service worker registration](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-concept) has an associated list of sync registrations whose element type is a [sync registration](#sync-registration).

A sync registration is a tuple consisting of a [tag](#tag) and a [state](#registration-state).

A [sync registration](#sync-registration) has an associated tag, a DOMString.

A [sync registration](#sync-registration) has an associated registration state, which is one of pending, waiting, firing, or reregisteredWhileFiring. It is initially set to [pending](#pending).

A [sync registration](#sync-registration) has an associated [service worker registration](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-concept). It is initially set to null.

Within one [list of sync registrations](#list-of-sync-registrations) each [sync registration](#sync-registration) MUST have a unique [tag](#tag).

## 4. Permissions Integration[](#permissions-integration)

The Web Background Synchronization API is a [default powerful feature](https://w3c.github.io/permissions/#dfn-default-powerful-feature) that is identified by the [name](https://w3c.github.io/permissions/#dfn-name) "background-sync".

## 5. Privacy Considerations[](#privacy-considerations)

### 5.1. Permission[](#permission)

User agents MAY offer a way for the user to disable background sync.

Note: Background sync SHOULD be enabled by default. Having the permission denied is considered an exceptional case.

### 5.2. Location Tracking[](#location-tracking)

Fetch requests within the onsync event while [in the background](#in-the-background) may reveal the client’s IP address to the server after the user left the page. The user agent SHOULD limit tracking by capping the number of retries and duration of sync events.

### 5.3. History Leaking[](#history-leaking)

Fetch requests within the onsync event while [in the background](#in-the-background) may reveal something about the client’s navigation history to passive eavesdroppers. For instance, the client might visit site https://example.com, which registers a sync event, but doesn’t fire until after the user has navigated away from the page and changed networks. Passive eavesdroppers on the new network may see the fetch requests that the onsync event makes. The fetch requests are HTTPS so the request contents will not be leaked but the domain may be (via DNS lookups and IP address of the request).

## 6. API Description[](#api-description)

### 6.1. Extensions to the `[ServiceWorkerRegistration](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-interface)` interface[](#service-worker-registration-extensions)

[ServiceWorkerRegistration/sync](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/sync "The sync property of the ServiceWorkerRegistration interface returns a reference to the SyncManager interface, which manages background synchronization processes.")

The `` `getTags()` `` method when invoked, MUST return [a new promise](https://www.w3.org/2001/tag/doc/promises-guide#a-new-promise) promise and run the following steps [in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel):

1. Let serviceWorkerRegistration be the `[SyncManager](#syncmanager)`'s associated [service worker registration](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-concept).
2. Let currentTags be a new `[sequence](https://heycam.github.io/webidl/#idl-sequence)`.
3. For each registration in serviceWorkerRegistration’s [list of sync registrations](#list-of-sync-registrations), add registration’s associated [tag](#tag) to currentTags.
4. [Resolve](https://www.w3.org/2001/tag/doc/promises-guide#resolve-promise) promise with currentTags.

### 6.3. The sync event[](#sync-event)

[SyncEvent](https://developer.mozilla.org/en-US/docs/Web/API/SyncEvent "The SyncEvent interface represents a sync action that is dispatched on the ServiceWorkerGlobalScope of a ServiceWorker.")

```js
partial interface [ServiceWorkerGlobalScope](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-global-scope-interface) {
  attribute [EventHandler](https://html.spec.whatwg.org/multipage/webappapis.html#eventhandler) `onsync`[](#dom-serviceworkerglobalscope-onsync);
};

[[Exposed](https://webidl.spec.whatwg.org/#Exposed)=ServiceWorker]
interface `SyncEvent` : [ExtendableEvent](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#extendable-event-interface) {
  `constructor`[](#dom-syncevent-syncevent)([DOMString](https://heycam.github.io/webidl/#idl-DOMString) `type`[](#dom-syncevent-syncevent-type-init-type), [SyncEventInit](#dictdef-synceventinit) `init`[](#dom-syncevent-syncevent-type-init-init));
  readonly attribute [DOMString](https://heycam.github.io/webidl/#idl-DOMString) `tag`;
  readonly attribute [boolean](https://webidl.spec.whatwg.org/#idl-boolean) `lastChance`;
};

dictionary `SyncEventInit` : [ExtendableEventInit](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#extendable-event-init-dictionary) {
  required [DOMString](https://heycam.github.io/webidl/#idl-DOMString) `tag`[](#dom-synceventinit-tag);
  [boolean](https://webidl.spec.whatwg.org/#idl-boolean) `lastChance`[](#dom-synceventinit-lastchance) = false;
};
```

Note: The `[SyncEvent](#syncevent)` interface represents a firing sync registration. If the page (or worker) that registered the event is running, the user agent will fire the sync event as soon as network connectivity is available. Otherwise, the user agent should run the event at the soonest convenience. If a sync event fails, the user agent may decide to retry it at a time of its choosing. The `[lastChance](#dom-syncevent-lastchance)` attribute is true if the user agent will not make further attempts to try this sync after the current attempt.

[](#example-1ff428a9)Reacting to `[lastChance](#dom-syncevent-lastchance)`:

```js
self.addEventListener('sync', event => {
  if (event.tag == 'important-thing') {
    event.waitUntil(
      doImportantThing().catch(err => {
        if (event.lastChance) {
          self.registration.showNotification("Important thing failed");
        }
        throw err;
      })
    );
  }
});
```

The above example reacts to `[lastChance](#dom-syncevent-lastchance)` by showing a [notification](https://notifications.spec.whatwg.org/#concept-notification) to the user. This requires the origin to have [permission to show notifications](https://notifications.spec.whatwg.org/#permission-model).

In the above example `doImportantThing` is a developer-defined function.

Whenever the user agent changes to [online](#online), the user agent SHOULD [fire a sync event](#fire-a-sync-event) for each [sync registration](#sync-registration) whose [registration state](#registration-state) is [pending](#pending). The events may be fired in any order.

To fire a sync event for a [sync registration](#sync-registration) registration, the user agent MUST run the following steps:

1. [Assert](http://www.ecma-international.org/ecma-262/6.0/#sec-algorithm-conventions): registration’s [registration state](#registration-state) is [pending](#pending).
2. Let serviceWorkerRegistration be the [service worker registration](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-concept) associated with registration.
3. [Assert](http://www.ecma-international.org/ecma-262/6.0/#sec-algorithm-conventions): registration exists in the [list of sync registrations](#list-of-sync-registrations) associated with serviceWorkerRegistration.
4. Set registration’s [registration state](#registration-state) to [firing](#firing).
5. [Fire Functional Event](https://w3c.github.io/ServiceWorker/#fire-functional-event) "`sync`" using `[SyncEvent](#syncevent)` on serviceWorkerRegistration with the following properties:
    
    [SyncEvent/tag](https://developer.mozilla.org/en-US/docs/Web/API/SyncEvent/tag "The SyncEvent.tag read-only property of the SyncEvent interface returns the developer-defined identifier for this SyncEvent. This is the value passed in the tag parameter of the SyncEvent() constructor.")
    
    False if the user agent [will retry](#will-retry) this sync event if it fails, or true if no further attempts will be made after the current attempt.
    
    Then run the following steps with dispatchedEvent:
    
    1. Let waitUntilPromise be the result of [waiting for all](https://www.w3.org/2001/tag/doc/promises-guide#waiting-for-all) of dispatchedEvent’s [extended lifetime promises](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#dfn-extend-lifetime-promises).
    2. [Upon fulfillment](https://www.w3.org/2001/tag/doc/promises-guide#upon-fulfillment) of waitUntilPromise, perform the following steps atomically:
        1. If registration’s state is [reregisteredWhileFiring](#reregisteredwhilefiring):
            1. Set registration’s state to [pending](#pending).
            2. If the user agent is currently [online](#online), [fire a sync event](#fire-a-sync-event) for registration.
            3. Abort the rest of these steps.
        2. [Assert](http://www.ecma-international.org/ecma-262/6.0/#sec-algorithm-conventions): registration’s [registration state](#registration-state) is [firing](#firing).
        3. Remove registration from serviceWorkerRegistration’s [list of sync registration](#list-of-sync-registrations).
    3. [Upon rejection](https://www.w3.org/2001/tag/doc/promises-guide#upon-rejection) of waitUntilPromise, or if the script has been aborted by the [termination](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#terminate-service-worker-algorithm) of the [service worker](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-concept), perform the following steps atomically:
        1. If registration’s state is [reregisteredWhileFiring](#reregisteredwhilefiring):
            1. Set registration’s state to [pending](#pending).
            2. If the user agent is currently [online](#online), [fire a sync event](#fire-a-sync-event) for registration.
            3. Abort the rest of these steps.
        2. If the `[lastChance](#dom-syncevent-lastchance)` attribute of dispatchedEvent is false, set registration’s [registration state](#registration-state) to [waiting](#waiting), and perform the following steps [in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel):
            1. Wait a user agent defined length of time.
            2. If registration’s [registration state](#registration-state) is not [waiting](#waiting), abort these substeps.
            3. Set registration’s [registration state](#registration-state) to [pending](#pending).
            4. If the user agent is currently [online](#online), [fire a sync event](#fire-a-sync-event) for registration.
        3. Else remove registration from serviceWorkerRegistration’s [list of sync registrations](#list-of-sync-registrations).

A user agent MAY impose a time limit on the lifetime extension and execution time of a `[SyncEvent](#syncevent)` which is stricter than the time limit imposed for `[ExtendableEvent](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#extendable-event-interface)`s in general. In particular an event for which `[lastChance](#dom-syncevent-lastchance)` is true MAY have a significantly shortened time limit.

A user agent will retry a [sync event](#sync-event) based on some user agent defined heuristics.
