---
tags:
  - "#security"
  - "#web-security"
  - "#authentication"
  - "#web-api"
  - "#middleware-security"
  - "#request-validation"
  - "#access-control"
---
# Echo Middleware

## Basic Auth

Basic auth middleware provides an HTTP basic authentication.

- For valid credentials it calls the next handler.
- For missing or invalid credentials, it sends "401 - Unauthorized" response.

# Usage [​](https://echo.labstack.com/docs/middleware/basic-auth#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
	// Be careful to use constant time comparison to prevent timing attacks
	if subtle.ConstantTimeCompare([]byte(username), []byte("joe")) == 1 &&
		subtle.ConstantTimeCompare([]byte(password), []byte("secret")) == 1 {
		return true, nil
	}
	return false, nil
}))

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/basic-auth#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/basic-auth#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.BasicAuthWithConfig(middleware.BasicAuthConfig{}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/basic-auth#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
BasicAuthConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Validator is a function to validate BasicAuth credentials.
  // Required.
  Validator BasicAuthValidator

  // Realm is a string to define realm attribute of BasicAuth.
  // Default value "Restricted".
  Realm string
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/basic-auth#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultBasicAuthConfig = BasicAuthConfig{
	Skipper: DefaultSkipper,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/basic-auth#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/basic-auth#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/basic-auth#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/basic-auth#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/basic-auth#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1990625201.1743203607&gtm=45je53r0h2v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062&z=865743013)

## Body Dump

[Skip to main content](https://echo.labstack.com/docs/middleware/body-dump#__docusaurus_skipToContent_fallback)

On this page

Body dump middleware captures the request and response payload and calls the registered handler. Generally used for debugging/logging purpose. Avoid using it if your request/response payload is huge e.g. file upload/download, but if you still need to, add an exception for your endpoints in the skipper function.

# Usage [​](https://echo.labstack.com/docs/middleware/body-dump#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.BodyDump(func(c echo.Context, reqBody, resBody []byte) {
}))

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/body-dump#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/body-dump#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.BodyDumpWithConfig(middleware.BodyDumpConfig{}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/body-dump#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
BodyDumpConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Handler receives request and response payload.
  // Required.
  Handler BodyDumpHandler
}

```

# Default Configuration\* [​](https://echo.labstack.com/docs/middleware/body-dump#default-configuration "Direct link to Default Configuration*")

```codeBlockLines_e6Vv
DefaultBodyDumpConfig = BodyDumpConfig{
  Skipper: DefaultSkipper,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/body-dump#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/body-dump#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/body-dump#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/body-dump#configuration)
  - [Default Configuration\*](https://echo.labstack.com/docs/middleware/body-dump#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=452210157.1743203613&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102964102&z=2071809196)

## Body Limit

[Skip to main content](https://echo.labstack.com/docs/middleware/body-limit#__docusaurus_skipToContent_fallback)

On this page

Body limit middleware sets the maximum allowed size for a request body, if the<br/>
size exceeds the configured limit, it sends "413 - Request Entity Too Large"<br/>
response. The body limit is determined based on both `Content-Length` request<br/>
header and actual content read, which makes it super secure.

Limit can be specified as `4x` or `4xB`, where x is one of the multiple from K, M,<br/>
G, T or P.

# Usage [​](https://echo.labstack.com/docs/middleware/body-limit#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.BodyLimit("2M"))

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/body-limit#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/body-limit#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.BodyLimitWithConfig(middleware.BodyLimitConfig{}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/body-limit#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
BodyLimitConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Maximum allowed size for a request body, it can be specified
  // as `4x` or `4xB`, where x is one of the multiple from K, M, G, T or P.
  Limit string `json:"limit"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/body-limit#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultBodyLimitConfig = BodyLimitConfig{
  Skipper: DefaultSkipper,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/body-limit#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/body-limit#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/body-limit#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/body-limit#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/body-limit#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=71378812.1743203692&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062&z=13365588)

## Casbin Auth

[Skip to main content](https://echo.labstack.com/docs/middleware/casbin-auth#__docusaurus_skipToContent_fallback)

On this page

note

Echo community contribution

[Casbin](https://github.com/casbin/casbin) is a powerful and efficient open-source access control library for Go. It provides support for enforcing authorization based on various models. So far, the access control models supported by Casbin are:

- ACL (Access Control List)
- ACL with superuser
- ACL without users: especially useful for systems that don't have authentication or user log-ins.
- ACL without resources: some scenarios may target for a type of resources instead of an individual resource by using permissions like write-article, read-log. It doesn't control the access to a specific article or log.
- RBAC (Role-Based Access Control)
- RBAC with resource roles: both users and resources can have roles (or groups) at the same time.
- RBAC with domains/tenants: users can have different role sets for different domains/tenants.
- ABAC (Attribute-Based Access Control)
- RESTful
- Deny-override: both allow and deny authorizations are supported, deny overrides the allow.

info

Currently, only HTTP basic authentication is supported.

# Dependencies [​](https://echo.labstack.com/docs/middleware/casbin-auth#dependencies "Direct link to Dependencies")

```codeBlockLines_e6Vv
import (
  "github.com/casbin/casbin"
  casbin_mw "github.com/labstack/echo-contrib/casbin"
)

```

# Usage [​](https://echo.labstack.com/docs/middleware/casbin-auth#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
enforcer, err := casbin.NewEnforcer("casbin_auth_model.conf", "casbin_auth_policy.csv")
e.Use(casbin_mw.Middleware(enforcer))

```

For syntax, see: [Syntax for Models](https://casbin.org/docs/syntax-for-models).

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/casbin-auth#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/casbin-auth#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
ce := casbin.NewEnforcer("casbin_auth_model.conf", "")
ce.AddRoleForUser("alice", "admin")
ce.AddPolicy(...)
e.Use(casbin_mw.MiddlewareWithConfig(casbin_mw.Config{
  Enforcer: ce,
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/casbin-auth#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
// Config defines the config for CasbinAuth middleware.
Config struct {
  // Skipper defines a function to skip middleware.
  Skipper middleware.Skipper

  // Enforcer CasbinAuth main rule.
  // Required.
  Enforcer *casbin.Enforcer
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/casbin-auth#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
// DefaultConfig is the default CasbinAuth middleware config.
DefaultConfig = Config{
  Skipper: middleware.DefaultSkipper,
}

```

- [Dependencies](https://echo.labstack.com/docs/middleware/casbin-auth#dependencies)
- [Usage](https://echo.labstack.com/docs/middleware/casbin-auth#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/casbin-auth#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/casbin-auth#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/casbin-auth#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/casbin-auth#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=981534689.1743203614&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102964102&z=1916162275)

## CORs

[Skip to main content](https://echo.labstack.com/docs/middleware/cors#__docusaurus_skipToContent_fallback)

On this page

CORS middleware implements [CORS](http://www.w3.org/TR/cors) specification.<br/>
CORS gives web servers cross-domain access controls, which enable secure cross-domain<br/>
data transfers.

# Usage [​](https://echo.labstack.com/docs/middleware/cors#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.CORS())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/cors#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/cors#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
  AllowOrigins: []string{"https://labstack.com", "https://labstack.net"},
  AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/cors#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
CORSConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // AllowOrigin defines a list of origins that may access the resource.
  // Optional. Default value []string{"*"}.
  AllowOrigins []string `yaml:"allow_origins"`

  // AllowOriginFunc is a custom function to validate the origin. It takes the
  // origin as an argument and returns true if allowed or false otherwise. If
  // an error is returned, it is returned by the handler. If this option is
  // set, AllowOrigins is ignored.
  // Optional.
  AllowOriginFunc func(origin string) (bool, error) `yaml:"allow_origin_func"`

  // AllowMethods defines a list methods allowed when accessing the resource.
  // This is used in response to a preflight request.
  // Optional. Default value DefaultCORSConfig.AllowMethods.
  AllowMethods []string `yaml:"allow_methods"`

  // AllowHeaders defines a list of request headers that can be used when
  // making the actual request. This is in response to a preflight request.
  // Optional. Default value []string{}.
  AllowHeaders []string `yaml:"allow_headers"`

  // AllowCredentials indicates whether or not the response to the request
  // can be exposed when the credentials flag is true. When used as part of
  // a response to a preflight request, this indicates whether or not the
  // actual request can be made using credentials.
  // Optional. Default value false.
  AllowCredentials bool `yaml:"allow_credentials"`

  // ExposeHeaders defines a whitelist headers that clients are allowed to
  // access.
  // Optional. Default value []string{}.
  ExposeHeaders []string `yaml:"expose_headers"`

  // MaxAge indicates how long (in seconds) the results of a preflight request
  // can be cached.
  // Optional. Default value 0.
  MaxAge int `yaml:"max_age"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/cors#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultCORSConfig = CORSConfig{
  Skipper:      DefaultSkipper,
  AllowOrigins: []string{"*"},
  AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
}

```

- [Usage](https://echo.labstack.com/docs/middleware/cors#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/cors#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/cors#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/cors#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/cors#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1078806482.1743203697&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509683~102788824~102803279~102813109~102887800~102926062~102976414&z=512721028)

## CSRF-49

[Skip to main content](https://echo.labstack.com/docs/middleware/csrf#__docusaurus_skipToContent_fallback)

On this page

Cross-site request forgery, also known as one-click attack or session riding and<br/>
abbreviated as CSRF (sometimes pronounced sea-surf) or XSRF, is a type of malicious<br/>
exploit of a website where unauthorized commands are transmitted from a user that<br/>
the website trusts.

# Usage [​](https://echo.labstack.com/docs/middleware/csrf#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.CSRF())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/csrf#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/csrf#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
  TokenLookup: "header:X-XSRF-TOKEN",
}))

```

Example above uses `X-XSRF-TOKEN` request header to extract CSRF token.

_Example Configuration that reads token from Cookie_

```codeBlockLines_e6Vv
middleware.CSRFWithConfig(middleware.CSRFConfig{
	TokenLookup:    "cookie:_csrf",
	CookiePath:     "/",
	CookieDomain:   "example.com",
	CookieSecure:   true,
	CookieHTTPOnly: true,
	CookieSameSite: http.SameSiteStrictMode,
})

```

# Accessing CSRF Token [​](https://echo.labstack.com/docs/middleware/csrf#accessing-csrf-token "Direct link to Accessing CSRF Token")

# Server-side [​](https://echo.labstack.com/docs/middleware/csrf#server-side "Direct link to Server-side")

CSRF token can be accessed from `Echo#Context` using `ContextKey` and passed to<br/>
the client via template.

# Client-side [​](https://echo.labstack.com/docs/middleware/csrf#client-side "Direct link to Client-side")

CSRF token can be accessed from CSRF cookie.

# Configuration [​](https://echo.labstack.com/docs/middleware/csrf#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
CSRFConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // TokenLength is the length of the generated token.
  TokenLength uint8 `json:"token_length"`
  // Optional. Default value 32.

  // TokenLookup is a string in the form of "<source>:<key>" that is used
  // to extract token from the request.
  // Optional. Default value "header:X-CSRF-Token".
  // Possible values:
  // - "header:<name>"
  // - "form:<name>"
  // - "query:<name>"
  // - "cookie:<name>"
  TokenLookup string `json:"token_lookup"`

  // Context key to store generated CSRF token into context.
  // Optional. Default value "csrf".
  ContextKey string `json:"context_key"`

  // Name of the CSRF cookie. This cookie will store CSRF token.
  // Optional. Default value "_csrf".
  CookieName string `json:"cookie_name"`

  // Domain of the CSRF cookie.
  // Optional. Default value none.
  CookieDomain string `json:"cookie_domain"`

  // Path of the CSRF cookie.
  // Optional. Default value none.
  CookiePath string `json:"cookie_path"`

  // Max age (in seconds) of the CSRF cookie.
  // Optional. Default value 86400 (24hr).
  CookieMaxAge int `json:"cookie_max_age"`

  // Indicates if CSRF cookie is secure.
  // Optional. Default value false.
  CookieSecure bool `json:"cookie_secure"`

  // Indicates if CSRF cookie is HTTP only.
  // Optional. Default value false.
  CookieHTTPOnly bool `json:"cookie_http_only"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/csrf#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultCSRFConfig = CSRFConfig{
  Skipper:      DefaultSkipper,
  TokenLength:  32,
  TokenLookup:  "header:" + echo.HeaderXCSRFToken,
  ContextKey:   "csrf",
  CookieName:   "_csrf",
  CookieMaxAge: 86400,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/csrf#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/csrf#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/csrf#usage-1)
- [Accessing CSRF Token](https://echo.labstack.com/docs/middleware/csrf#accessing-csrf-token)
  - [Server-side](https://echo.labstack.com/docs/middleware/csrf#server-side)
  - [Client-side](https://echo.labstack.com/docs/middleware/csrf#client-side)
- [Configuration](https://echo.labstack.com/docs/middleware/csrf#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/csrf#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1285742875.1743203714&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102976414&z=889824860)

## CSRF

[Skip to main content](https://echo.labstack.com/docs/middleware/csrf#__docusaurus_skipToContent_fallback)

On this page

Cross-site request forgery, also known as one-click attack or session riding and<br/>
abbreviated as CSRF (sometimes pronounced sea-surf) or XSRF, is a type of malicious<br/>
exploit of a website where unauthorized commands are transmitted from a user that<br/>
the website trusts.

# Usage [​](https://echo.labstack.com/docs/middleware/csrf#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.CSRF())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/csrf#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/csrf#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
  TokenLookup: "header:X-XSRF-TOKEN",
}))

```

Example above uses `X-XSRF-TOKEN` request header to extract CSRF token.

_Example Configuration that reads token from Cookie_

```codeBlockLines_e6Vv
middleware.CSRFWithConfig(middleware.CSRFConfig{
	TokenLookup:    "cookie:_csrf",
	CookiePath:     "/",
	CookieDomain:   "example.com",
	CookieSecure:   true,
	CookieHTTPOnly: true,
	CookieSameSite: http.SameSiteStrictMode,
})

```

# Accessing CSRF Token [​](https://echo.labstack.com/docs/middleware/csrf#accessing-csrf-token "Direct link to Accessing CSRF Token")

# Server-side [​](https://echo.labstack.com/docs/middleware/csrf#server-side "Direct link to Server-side")

CSRF token can be accessed from `Echo#Context` using `ContextKey` and passed to<br/>
the client via template.

# Client-side [​](https://echo.labstack.com/docs/middleware/csrf#client-side "Direct link to Client-side")

CSRF token can be accessed from CSRF cookie.

# Configuration [​](https://echo.labstack.com/docs/middleware/csrf#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
CSRFConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // TokenLength is the length of the generated token.
  TokenLength uint8 `json:"token_length"`
  // Optional. Default value 32.

  // TokenLookup is a string in the form of "<source>:<key>" that is used
  // to extract token from the request.
  // Optional. Default value "header:X-CSRF-Token".
  // Possible values:
  // - "header:<name>"
  // - "form:<name>"
  // - "query:<name>"
  // - "cookie:<name>"
  TokenLookup string `json:"token_lookup"`

  // Context key to store generated CSRF token into context.
  // Optional. Default value "csrf".
  ContextKey string `json:"context_key"`

  // Name of the CSRF cookie. This cookie will store CSRF token.
  // Optional. Default value "_csrf".
  CookieName string `json:"cookie_name"`

  // Domain of the CSRF cookie.
  // Optional. Default value none.
  CookieDomain string `json:"cookie_domain"`

  // Path of the CSRF cookie.
  // Optional. Default value none.
  CookiePath string `json:"cookie_path"`

  // Max age (in seconds) of the CSRF cookie.
  // Optional. Default value 86400 (24hr).
  CookieMaxAge int `json:"cookie_max_age"`

  // Indicates if CSRF cookie is secure.
  // Optional. Default value false.
  CookieSecure bool `json:"cookie_secure"`

  // Indicates if CSRF cookie is HTTP only.
  // Optional. Default value false.
  CookieHTTPOnly bool `json:"cookie_http_only"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/csrf#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultCSRFConfig = CSRFConfig{
  Skipper:      DefaultSkipper,
  TokenLength:  32,
  TokenLookup:  "header:" + echo.HeaderXCSRFToken,
  ContextKey:   "csrf",
  CookieName:   "_csrf",
  CookieMaxAge: 86400,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/csrf#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/csrf#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/csrf#usage-1)
- [Accessing CSRF Token](https://echo.labstack.com/docs/middleware/csrf#accessing-csrf-token)
  - [Server-side](https://echo.labstack.com/docs/middleware/csrf#server-side)
  - [Client-side](https://echo.labstack.com/docs/middleware/csrf#client-side)
- [Configuration](https://echo.labstack.com/docs/middleware/csrf#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/csrf#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1285742875.1743203714&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102976414&z=889824860)

## Decompress

[Skip to main content](https://echo.labstack.com/docs/middleware/decompress#__docusaurus_skipToContent_fallback)

On this page

Decompress middleware decompresses HTTP request if Content-Encoding header is set to gzip.

note

The body will be decompressed in memory and consume it for the lifetime of the request (and garbage collection).

# Usage [​](https://echo.labstack.com/docs/middleware/decompress#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.Decompress())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/decompress#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/decompress#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.DecompressWithConfig(middleware.DecompressConfig{
  Skipper: Skipper
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/decompress#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
DecompressConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/decompress#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultDecompressConfig = DecompressConfig{
  Skipper: DefaultSkipper,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/decompress#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/decompress#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/decompress#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/decompress#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/decompress#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1849910561.1743203629&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062&z=721262310)

## Gzip

[Skip to main content](https://echo.labstack.com/docs/middleware/gzip#__docusaurus_skipToContent_fallback)

On this page

Gzip middleware compresses HTTP response using gzip compression scheme.

# Usage [​](https://echo.labstack.com/docs/middleware/gzip#usage "Direct link to Usage")

`e.Use(middleware.Gzip())`

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/gzip#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/gzip#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
  Level: 5,
}))

```

tip

A middleware skipper can be passed to avoid gzip to certain URL(s).

## Example [​](https://echo.labstack.com/docs/middleware/gzip#example "Direct link to Example")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
  Skipper: func(c echo.Context) bool {
    return strings.Contains(c.Path(), "metrics") // Change "metrics" for your own path
  },
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/gzip#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
GzipConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Gzip compression level.
  // Optional. Default value -1.
  Level int `json:"level"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/gzip#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultGzipConfig = GzipConfig{
  Skipper: DefaultSkipper,
  Level:   -1,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/gzip#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/gzip#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/gzip#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/gzip#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/gzip#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=30988585.1743203714&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509682~102788824~102803279~102813109~102887799~102926062&z=1324491736)

## Jaegar

[Skip to main content](https://echo.labstack.com/docs/middleware/jaeger#__docusaurus_skipToContent_fallback)

On this page

note

Echo community contribution

Trace requests on Echo framework with Jaeger Tracing Middleware.

# Usage [​](https://echo.labstack.com/docs/middleware/jaeger#usage "Direct link to Usage")

```codeBlockLines_e6Vv
package main
import (
    "github.com/labstack/echo-contrib/jaegertracing"
    "github.com/labstack/echo/v4"
)
func main() {
    e := echo.New()
    // Enable tracing middleware
    c := jaegertracing.New(e, nil)
    defer c.Close()

    e.Logger.Fatal(e.Start(":1323"))
}

```

Enabling the tracing middleware creates a tracer and a root tracing span for every request.

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/jaeger#custom-configuration "Direct link to Custom Configuration")

By default, traces are sent to `localhost` Jaeger agent instance. To configure an external Jaeger, start your application with environment variables.

# Usage [​](https://echo.labstack.com/docs/middleware/jaeger#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
$ JAEGER_AGENT_HOST=192.168.1.10 JAEGER_AGENT_PORT=6831 ./myserver

```

The tracer can be initialized with values coming from environment variables. None of the env vars are required<br/>
and all of them can be overridden via direct setting of the property on the configuration object.

| Property                         | Description                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JAEGER_SERVICE_NAME              | The service name                                                                                                                                                                                                                                                                                                 |
| JAEGER_AGENT_HOST                | The hostname for communicating with agent via UDP                                                                                                                                                                                                                                                                |
| JAEGER_AGENT_PORT                | The port for communicating with agent via UDP                                                                                                                                                                                                                                                                    |
| JAEGER_ENDPOINT                  | The HTTP endpoint for sending spans directly to a collector, i.e. [http://jaeger-collector:14268/api/traces](http://jaeger-collector:14268/api/traces)                                                                                                                                                           |
| JAEGER_USER                      | Username to send as part of "Basic" authentication to the collector endpoint                                                                                                                                                                                                                                     |
| JAEGER_PASSWORD                  | Password to send as part of "Basic" authentication to the collector endpoint                                                                                                                                                                                                                                     |
| JAEGER_REPORTER_LOG_SPANS        | Whether the reporter should also log the spans                                                                                                                                                                                                                                                                   |
| JAEGER_REPORTER_MAX_QUEUE_SIZE   | The reporter's maximum queue size                                                                                                                                                                                                                                                                                |
| JAEGER_REPORTER_FLUSH_INTERVAL   | The reporter's flush interval, with units, e.g. "500ms" or "2s" (\[valid units\]\[timeunits\])                                                                                                                                                                                                                   |
| JAEGER_SAMPLER_TYPE              | The sampler type                                                                                                                                                                                                                                                                                                 |
| JAEGER_SAMPLER_PARAM             | The sampler parameter (number)                                                                                                                                                                                                                                                                                   |
| JAEGER_SAMPLER_MANAGER_HOST_PORT | The HTTP endpoint when using the remote sampler, i.e. [http://jaeger-agent:5778/sampling](http://jaeger-agent:5778/sampling)                                                                                                                                                                                     |
| JAEGER_SAMPLER_MAX_OPERATIONS    | The maximum number of operations that the sampler will keep track of                                                                                                                                                                                                                                             |
| JAEGER_SAMPLER_REFRESH_INTERVAL  | How often the remotely controlled sampler will poll jaeger-agent for the appropriate sampling strategy, with units, e.g. "1m" or "30s" (\[valid units\]\[timeunits\])                                                                                                                                            |
| JAEGER_TAGS                      | A comma separated list of `name = value` tracer level tags, which get added to all reported spans. The value can also refer to an environment variable using the format `${envVarName:default}`, where the `:default` is optional, and identifies a value to be used if the environment variable cannot be found |
| JAEGER_DISABLED                  | Whether the tracer is disabled or not. If true, the default `opentracing.NoopTracer` is used.                                                                                                                                                                                                                    |
| JAEGER_RPC_METRICS               | Whether to store RPC metrics                                                                                                                                                                                                                                                                                     |

By default, the client sends traces via UDP to the agent at `localhost:6831`. Use `JAEGER_AGENT_HOST` and<br/>
`JAEGER_AGENT_PORT` to send UDP traces to a different `host:port`. If `JAEGER_ENDPOINT` is set, the client sends traces<br/>
to the endpoint via `HTTP`, making the `JAEGER_AGENT_HOST` and `JAEGER_AGENT_PORT` unused. If `JAEGER_ENDPOINT` is<br/>
secured, HTTP basic authentication can be performed by setting the `JAEGER_USER` and `JAEGER_PASSWORD` environment<br/>
variables.

# Skipping URL(s) [​](https://echo.labstack.com/docs/middleware/jaeger#skipping-urls "Direct link to Skipping URL(s)")

A middleware skipper can be passed to avoid tracing spans to certain URL(s).

_Usage_

```codeBlockLines_e6Vv
package main
import (
	"strings"
    "github.com/labstack/echo-contrib/jaegertracing"
    "github.com/labstack/echo/v4"
)

// urlSkipper ignores metrics route on some middleware
func urlSkipper(c echo.Context) bool {
    if strings.HasPrefix(c.Path(), "/testurl") {
        return true
    }
    return false
}

func main() {
    e := echo.New()
    // Enable tracing middleware
    c := jaegertracing.New(e, urlSkipper)
    defer c.Close()

    e.Logger.Fatal(e.Start(":1323"))
}

```

# TraceFunction [​](https://echo.labstack.com/docs/middleware/jaeger#tracefunction "Direct link to TraceFunction")

This is a wrapper function that can be used to seamlessly add a span for<br/>
the duration of the invoked function. There is no need to change function arguments.

_Usage_

```codeBlockLines_e6Vv
package main
import (
    "github.com/labstack/echo-contrib/jaegertracing"
    "github.com/labstack/echo/v4"
    "net/http"
    "time"
)
func main() {
    e := echo.New()
    // Enable tracing middleware
    c := jaegertracing.New(e, nil)
    defer c.Close()
    e.GET("/", func(c echo.Context) error {
        // Wrap slowFunc on a new span to trace it's execution passing the function arguments
		jaegertracing.TraceFunction(c, slowFunc, "Test String")
        return c.String(http.StatusOK, "Hello, World!")
    })
    e.Logger.Fatal(e.Start(":1323"))
}

// A function to be wrapped. No need to change it's arguments due to tracing
func slowFunc(s string) {
	time.Sleep(200 * time.Millisecond)
	return
}

```

# CreateChildSpan [​](https://echo.labstack.com/docs/middleware/jaeger#createchildspan "Direct link to CreateChildSpan")

For more control over the Span, the function `CreateChildSpan` can be called<br/>
giving control on data to be appended to the span like log messages, baggages and tags.

_Usage_

```codeBlockLines_e6Vv
package main
import (
    "github.com/labstack/echo-contrib/jaegertracing"
    "github.com/labstack/echo/v4"
)
func main() {
    e := echo.New()
    // Enable tracing middleware
    c := jaegertracing.New(e, nil)
    defer c.Close()
    e.GET("/", func(c echo.Context) error {
        // Do something before creating the child span
        time.Sleep(40 * time.Millisecond)
        sp := jaegertracing.CreateChildSpan(c, "Child span for additional processing")
        defer sp.Finish()
        sp.LogEvent("Test log")
        sp.SetBaggageItem("Test baggage", "baggage")
        sp.SetTag("Test tag", "New Tag")
        time.Sleep(100 * time.Millisecond)
        return c.String(http.StatusOK, "Hello, World!")
    })
    e.Logger.Fatal(e.Start(":1323"))
}

```

# References [​](https://echo.labstack.com/docs/middleware/jaeger#references "Direct link to References")

- [Opentracing Library](https://github.com/opentracing/opentracing-go)
- [Jaeger configuration](https://github.com/jaegertracing/jaeger-client-go#environment-variables)
- [Usage](https://echo.labstack.com/docs/middleware/jaeger#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/jaeger#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/jaeger#usage-1)
  - [Skipping URL(s)](https://echo.labstack.com/docs/middleware/jaeger#skipping-urls)
  - [TraceFunction](https://echo.labstack.com/docs/middleware/jaeger#tracefunction)
  - [CreateChildSpan](https://echo.labstack.com/docs/middleware/jaeger#createchildspan)
- [References](https://echo.labstack.com/docs/middleware/jaeger#references)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=892302873.1743203671&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102525910~102788824~102803279~102813109~102887799~102926062&z=1313217866)

## JWT

[Skip to main content](https://echo.labstack.com/docs/middleware/jwt#__docusaurus_skipToContent_fallback)

On this page

JWT provides a JSON Web Token (JWT) authentication middleware. Echo JWT middleware is located at [https://github.com/labstack/echo-jwt](https://github.com/labstack/echo-jwt)

Basic middleware behavior:

- For valid token, it sets the user in context and calls next handler.
- For invalid token, it sends "401 - Unauthorized" response.
- For missing or invalid `Authorization` header, it sends "400 - Bad Request".

# Dependencies [​](https://echo.labstack.com/docs/middleware/jwt#dependencies "Direct link to Dependencies")

```codeBlockLines_e6Vv
import "github.com/labstack/echo-jwt/v4"

```

# Usage [​](https://echo.labstack.com/docs/middleware/jwt#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(echojwt.JWT([]byte("secret")))

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/jwt#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/jwt#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(echojwt.WithConfig(echojwt.Config{
  // ...
  SigningKey:             []byte("secret"),
  // ...
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/jwt#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
type Config struct {
	// Skipper defines a function to skip middleware.
	Skipper middleware.Skipper

	// BeforeFunc defines a function which is executed just before the middleware.
	BeforeFunc middleware.BeforeFunc

	// SuccessHandler defines a function which is executed for a valid token.
	SuccessHandler func(c echo.Context)

	// ErrorHandler defines a function which is executed when all lookups have been done and none of them passed Validator
	// function. ErrorHandler is executed with last missing (ErrExtractionValueMissing) or an invalid key.
	// It may be used to define a custom JWT error.
	//
	// Note: when error handler swallows the error (returns nil) middleware continues handler chain execution towards handler.
	// This is useful in cases when portion of your site/api is publicly accessible and has extra features for authorized users
	// In that case you can use ErrorHandler to set default public JWT token value to request and continue with handler chain.
	ErrorHandler func(c echo.Context, err error) error

	// ContinueOnIgnoredError allows the next middleware/handler to be called when ErrorHandler decides to
	// ignore the error (by returning `nil`).
	// This is useful when parts of your site/api allow public access and some authorized routes provide extra functionality.
	// In that case you can use ErrorHandler to set a default public JWT token value in the request context
	// and continue. Some logic down the remaining execution chain needs to check that (public) token value then.
	ContinueOnIgnoredError bool

	// Context key to store user information from the token into context.
	// Optional. Default value "user".
	ContextKey string

	// Signing key to validate token.
	// This is one of the three options to provide a token validation key.
	// The order of precedence is a user-defined KeyFunc, SigningKeys and SigningKey.
	// Required if neither user-defined KeyFunc nor SigningKeys is provided.
	SigningKey interface{}

	// Map of signing keys to validate token with kid field usage.
	// This is one of the three options to provide a token validation key.
	// The order of precedence is a user-defined KeyFunc, SigningKeys and SigningKey.
	// Required if neither user-defined KeyFunc nor SigningKey is provided.
	SigningKeys map[string]interface{}

	// Signing method used to check the token's signing algorithm.
	// Optional. Default value HS256.
	SigningMethod string

	// KeyFunc defines a user-defined function that supplies the public key for a token validation.
	// The function shall take care of verifying the signing algorithm and selecting the proper key.
	// A user-defined KeyFunc can be useful if tokens are issued by an external party.
	// Used by default ParseTokenFunc implementation.
	//
	// When a user-defined KeyFunc is provided, SigningKey, SigningKeys, and SigningMethod are ignored.
	// This is one of the three options to provide a token validation key.
	// The order of precedence is a user-defined KeyFunc, SigningKeys and SigningKey.
	// Required if neither SigningKeys nor SigningKey is provided.
	// Not used if custom ParseTokenFunc is set.
	// Default to an internal implementation verifying the signing algorithm and selecting the proper key.
	KeyFunc jwt.Keyfunc

	// TokenLookup is a string in the form of "<source>:<name>" or "<source>:<name>,<source>:<name>" that is used
	// to extract token from the request.
	// Optional. Default value "header:Authorization".
	// Possible values:
	// - "header:<name>" or "header:<name>:<cut-prefix>"
	// 			`<cut-prefix>` is argument value to cut/trim prefix of the extracted value. This is useful if header
	//			value has static prefix like `Authorization: <auth-scheme> <authorisation-parameters>` where part that we
	//			want to cut is `<auth-scheme> ` note the space at the end.
	//			In case of JWT tokens `Authorization: Bearer <token>` prefix we cut is `Bearer `.
	// If prefix is left empty the whole value is returned.
	// - "query:<name>"
	// - "param:<name>"
	// - "cookie:<name>"
	// - "form:<name>"
	// Multiple sources example:
	// - "header:Authorization:Bearer ,cookie:myowncookie"
	TokenLookup string

	// TokenLookupFuncs defines a list of user-defined functions that extract JWT token from the given context.
	// This is one of the two options to provide a token extractor.
	// The order of precedence is user-defined TokenLookupFuncs, and TokenLookup.
	// You can also provide both if you want.
	TokenLookupFuncs []middleware.ValuesExtractor

	// ParseTokenFunc defines a user-defined function that parses token from given auth. Returns an error when token
	// parsing fails or parsed token is invalid.
	// Defaults to implementation using `github.com/golang-jwt/jwt` as JWT implementation library
	ParseTokenFunc func(c echo.Context, auth string) (interface{}, error)

	// Claims are extendable claims data defining token content. Used by default ParseTokenFunc implementation.
	// Not used if custom ParseTokenFunc is set.
	// Optional. Defaults to function returning jwt.MapClaims
	NewClaimsFunc func(c echo.Context) jwt.Claims
}

```

# [Example](https://echo.labstack.com/docs/cookbook/jwt) [​](https://echo.labstack.com/docs/middleware/jwt#example "Direct link to example")

- [Dependencies](https://echo.labstack.com/docs/middleware/jwt#dependencies)
- [Usage](https://echo.labstack.com/docs/middleware/jwt#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/jwt#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/jwt#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/jwt#configuration)
- [Example](https://echo.labstack.com/docs/middleware/jwt#example)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1815773033.1743203664&gtm=45je53r0h2v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062&z=977754603)

## Key Auth

[Skip to main content](https://echo.labstack.com/docs/middleware/key-auth#__docusaurus_skipToContent_fallback)

On this page

Key auth middleware provides a key based authentication.

- For valid key it calls the next handler.
- For invalid key, it sends "401 - Unauthorized" response.
- For missing key, it sends "400 - Bad Request" response.

# Usage [​](https://echo.labstack.com/docs/middleware/key-auth#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.KeyAuth(func(key string, c echo.Context) (bool, error) {
  return key == "valid-key", nil
}))

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/key-auth#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/key-auth#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.KeyAuthWithConfig(middleware.KeyAuthConfig{
  KeyLookup: "query:api-key",
  Validator: func(key string, c echo.Context) (bool, error) {
			return key == "valid-key", nil
		},
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/key-auth#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
KeyAuthConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // KeyLookup is a string in the form of "<source>:<name>" that is used
  // to extract key from the request.
  // Optional. Default value "header:Authorization".
  // Possible values:
  // - "header:<name>"
  // - "query:<name>"
  // - "cookie:<name>"
  // - "form:<name>"
  KeyLookup string `yaml:"key_lookup"`

  // AuthScheme to be used in the Authorization header.
  // Optional. Default value "Bearer".
  AuthScheme string

  // Validator is a function to validate key.
  // Required.
  Validator KeyAuthValidator

  // ErrorHandler defines a function which is executed for an invalid key.
  // It may be used to define a custom error.
  ErrorHandler KeyAuthErrorHandler
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/key-auth#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultKeyAuthConfig = KeyAuthConfig{
  Skipper:    DefaultSkipper,
  KeyLookup:  "header:" + echo.HeaderAuthorization,
  AuthScheme: "Bearer",
}

```

- [Usage](https://echo.labstack.com/docs/middleware/key-auth#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/key-auth#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/key-auth#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/key-auth#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/key-auth#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=169668086.1743203624&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062&z=1068098486)

## Logger

[Skip to main content](https://echo.labstack.com/docs/middleware/logger#__docusaurus_skipToContent_fallback)

On this page

Logger middleware logs the information about each HTTP request.

Echo has 2 different logger middlewares:

- Older string template based logger [`Logger`](https://github.com/labstack/echo/blob/master/middleware/logger.go) \- easy to start with but has limited capabilities
- Newer customizable function based logger [`RequestLogger`](https://github.com/labstack/echo/blob/master/middleware/request_logger.go) \- allows developer fully to customize what is logged and how it is logged. Suitable for usage with 3rd party logger libraries.

# Old Logger Middleware [​](https://echo.labstack.com/docs/middleware/logger#old-logger-middleware "Direct link to Old Logger middleware")

# Usage [​](https://echo.labstack.com/docs/middleware/logger#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.Logger())

```

_Sample output_

```codeBlockLines_e6Vv
{"time":"2017-01-12T08:58:07.372015644-08:00","remote_ip":"::1","host":"localhost:1323","method":"GET","uri":"/","status":200,"error":"","latency":14743,"latency_human":"14.743µs","bytes_in":0,"bytes_out":2}

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/logger#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/logger#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
  Format: "method=${method}, uri=${uri}, status=${status}\n",
}))

```

Example above uses a `Format` which logs request method and request URI.

_Sample output_

```codeBlockLines_e6Vv
method=GET, uri=/, status=200

```

# Configuration [​](https://echo.labstack.com/docs/middleware/logger#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
// LoggerConfig defines the config for Logger middleware.
LoggerConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Tags to construct the logger format.
  //
  // - time_unix
  // - time_unix_milli
  // - time_unix_micro
  // - time_unix_nano
  // - time_rfc3339
  // - time_rfc3339_nano
  // - time_custom
  // - id (Request ID)
  // - remote_ip
  // - uri
  // - host
  // - method
  // - path
  // - protocol
  // - referer
  // - user_agent
  // - status
  // - error
  // - latency (In nanoseconds)
  // - latency_human (Human readable)
  // - bytes_in (Bytes received)
  // - bytes_out (Bytes sent)
  // - header:<NAME>
  // - query:<NAME>
  // - form:<NAME>
  //
  // Example "${remote_ip} ${status}"
  //
  // Optional. Default value DefaultLoggerConfig.Format.
  Format string `yaml:"format"`

  // Optional. Default value DefaultLoggerConfig.CustomTimeFormat.
  CustomTimeFormat string `yaml:"custom_time_format"`

  // Output is a writer where logs in JSON format are written.
  // Optional. Default value os.Stdout.
  Output io.Writer
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/logger#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultLoggerConfig = LoggerConfig{
  Skipper: DefaultSkipper,
  Format: `{"time":"${time_rfc3339_nano}","id":"${id}","remote_ip":"${remote_ip}",` +
    `"host":"${host}","method":"${method}","uri":"${uri}","user_agent":"${user_agent}",` +
    `"status":${status},"error":"${error}","latency":${latency},"latency_human":"${latency_human}"` +
    `,"bytes_in":${bytes_in},"bytes_out":${bytes_out}}` + "\n",
  CustomTimeFormat: "2006-01-02 15:04:05.00000",
}

```

# New RequestLogger Middleware [​](https://echo.labstack.com/docs/middleware/logger#new-requestlogger-middleware "Direct link to New RequestLogger middleware")

RequestLogger middleware allows developer fully to customize what is logged and how it is logged and is more suitable<br/>
for usage with 3rd party (structured logging) libraries.

You can quickly acquaint yourself with the values that the logger knows to extract by referring to the fields of the [`RequestLoggerConfig`](https://github.com/labstack/echo/blob/master/middleware/request_logger.go) structure below. Or click the link to view the most up-to-date details.

```codeBlockLines_e6Vv
type RequestLoggerConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// BeforeNextFunc defines a function that is called before next middleware or handler is called in chain.
	BeforeNextFunc func(c echo.Context)
	// LogValuesFunc defines a function that is called with values extracted by logger from request/response.
	// Mandatory.
	LogValuesFunc func(c echo.Context, v RequestLoggerValues) error

	// HandleError instructs logger to call global error handler when next middleware/handler returns an error.
	// This is useful when you have custom error handler that can decide to use different status codes.
	//
	// A side-effect of calling global error handler is that now Response has been committed and sent to the client
	// and middlewares up in chain can not change Response status code or response body.
	HandleError bool

	// LogLatency instructs logger to record duration it took to execute rest of the handler chain (next(c) call).
	LogLatency bool
	// LogProtocol instructs logger to extract request protocol (i.e. `HTTP/1.1` or `HTTP/2`)
	LogProtocol bool
	// LogRemoteIP instructs logger to extract request remote IP. See `echo.Context.RealIP()` for implementation details.
	LogRemoteIP bool
	// LogHost instructs logger to extract request host value (i.e. `example.com`)
	LogHost bool
	// LogMethod instructs logger to extract request method value (i.e. `GET` etc)
	LogMethod bool
	// LogURI instructs logger to extract request URI (i.e. `/list?lang=en&page=1`)
	LogURI bool
	// LogURIPath instructs logger to extract request URI path part (i.e. `/list`)
	LogURIPath bool
	// LogRoutePath instructs logger to extract route path part to which request was matched to (i.e. `/user/:id`)
	LogRoutePath bool
	// LogRequestID instructs logger to extract request ID from request `X-Request-ID` header or response if request did not have value.
	LogRequestID bool
	// LogReferer instructs logger to extract request referer values.
	LogReferer bool
	// LogUserAgent instructs logger to extract request user agent values.
	LogUserAgent bool
	// LogStatus instructs logger to extract response status code. If handler chain returns an echo.HTTPError,
	// the status code is extracted from the echo.HTTPError returned
	LogStatus bool
	// LogError instructs logger to extract error returned from executed handler chain.
	LogError bool
	// LogContentLength instructs logger to extract content length header value. Note: this value could be different from
	// actual request body size as it could be spoofed etc.
	LogContentLength bool
	// LogResponseSize instructs logger to extract response content length value. Note: when used with Gzip middleware
	// this value may not be always correct.
	LogResponseSize bool
	// LogHeaders instructs logger to extract given list of headers from request. Note: request can contain more than
	// one header with same value so slice of values is been logger for each given header.
	//
	// Note: header values are converted to canonical form with http.CanonicalHeaderKey as this how request parser converts header
	// names to. For example, the canonical key for "accept-encoding" is "Accept-Encoding".
	LogHeaders []string
	// LogQueryParams instructs logger to extract given list of query parameters from request URI. Note: request can
	// contain more than one query parameter with same name so slice of values is been logger for each given query param name.
	LogQueryParams []string
	// LogFormValues instructs logger to extract given list of form values from request body+URI. Note: request can
	// contain more than one form value with same name so slice of values is been logger for each given form value name.
	LogFormValues []string

}

```

# Examples [​](https://echo.labstack.com/docs/middleware/logger#examples "Direct link to Examples")

Example for naive `fmt.Printf`

```codeBlockLines_e6Vv
skipper := func(c echo.Context) bool {
	// Skip health check endpoint
    return c.Request().URL.Path == "/health"
}
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogStatus: true,
	LogURI:    true,
	Skipper: skipper,
	BeforeNextFunc: func(c echo.Context) {
		c.Set("customValueFromContext", 42)
	},
	LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
		value, _ := c.Get("customValueFromContext").(int)
		fmt.Printf("REQUEST: uri: %v, status: %v, custom-value: %v\n", v.URI, v.Status, value)
		return nil
	},
}))

```

_Sample output_

```codeBlockLines_e6Vv
REQUEST: uri: /hello, status: 200, custom-value: 42

```

Example for slog ([https://pkg.go.dev/log/slog](https://pkg.go.dev/log/slog))

```codeBlockLines_e6Vv
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
    LogStatus:   true,
    LogURI:      true,
    LogError:    true,
    HandleError: true, // forwards error to the global error handler, so it can decide appropriate status code
    LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
        if v.Error == nil {
            logger.LogAttrs(context.Background(), slog.LevelInfo, "REQUEST",
                slog.String("uri", v.URI),
                slog.Int("status", v.Status),
            )
        } else {
            logger.LogAttrs(context.Background(), slog.LevelError, "REQUEST_ERROR",
                slog.String("uri", v.URI),
                slog.Int("status", v.Status),
                slog.String("err", v.Error.Error()),
            )
        }
        return nil
    },
}))

```

_Sample output_

```codeBlockLines_e6Vv
{"time":"2024-12-30T20:55:46.2399999+08:00","level":"INFO","msg":"REQUEST","uri":"/hello","status":200}

```

Example for Zerolog ([https://github.com/rs/zerolog](https://github.com/rs/zerolog))

```codeBlockLines_e6Vv
logger := zerolog.New(os.Stdout)
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogURI:    true,
	LogStatus: true,
	LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
		logger.Info().
			Str("URI", v.URI).
			Int("status", v.Status).
			Msg("request")

		return nil
	},
}))

```

_Sample output_

```codeBlockLines_e6Vv
{"level":"info","URI":"/hello","status":200,"message":"request"}

```

Example for Zap ([https://github.com/uber-go/zap](https://github.com/uber-go/zap))

```codeBlockLines_e6Vv
logger, _ := zap.NewProduction()
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogURI:    true,
	LogStatus: true,
	LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
		logger.Info("request",
			zap.String("URI", v.URI),
			zap.Int("status", v.Status),
		)

		return nil
	},
}))

```

_Sample output_

```codeBlockLines_e6Vv
{"level":"info","ts":1735564026.3197417,"caller":"cmd/main.go:20","msg":"request","URI":"/hello","status":200}

```

Example for Logrus ([https://github.com/sirupsen/logrus](https://github.com/sirupsen/logrus))

```codeBlockLines_e6Vv
log := logrus.New()
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogURI:    true,
	LogStatus: true,
	LogValuesFunc: func(c echo.Context, values middleware.RequestLoggerValues) error {
		log.WithFields(logrus.Fields{
			"URI":   values.URI,
			"status": values.Status,
		}).Info("request")

		return nil
	},
}))

```

_Sample output_

```codeBlockLines_e6Vv
time="2024-12-30T21:08:49+08:00" level=info msg=request URI=/hello status=200

```

# Troubleshooting Tips [​](https://echo.labstack.com/docs/middleware/logger#troubleshooting-tips "Direct link to Troubleshooting Tips")

## 1\. Solution for "panic: Missing LogValuesFunc Callback Function for Request Logger middleware" [​](https://echo.labstack.com/docs/middleware/logger#1-solution-for-panic-missing-logvaluesfunc-callback-function-for-request-logger-middleware 'Direct link to 1. Solution for "panic: missing LogValuesFunc callback function for request logger middleware"')

This panic arises when the `LogValuesFunc` callback function, which is mandatory for the request logger middleware configuration, is left unset.

To address this, you must define a suitable function that adheres to the `LogValuesFunc` specifications and then assign it within the middleware configuration. Consider the following straightforward illustration:

```codeBlockLines_e6Vv
func logValues(c echo.Context, v middleware.RequestLoggerValues) error {
    fmt.Printf("Request Method: %s, URI: %s\n", v.Method, v.URI)
    return nil
}

e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
    LogValuesFunc: logValues,
}))

```

## 2\. If Parameters in Logs Are Empty [​](https://echo.labstack.com/docs/middleware/logger#2-if-parameters-in-logs-are-empty "Direct link to 2. If Parameters in Logs Are Empty")

When investigating logging-related glitches, if you notice that certain parameters like `v.URI` and `v.Status` within the `LogValuesFunc` function produce empty outputs, your focus should shift to validating the relevant configuration elements. Specifically, check whether the corresponding items (such as `LogStatus`, `LogURI`, etc.) in `e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{…}))` have been erroneously set to `false` or failed to activate properly due to miscellaneous factors. Ensure these configuration particulars are accurately configured so that the pertinent request and response data can be precisely logged.

- [Old Logger middleware](https://echo.labstack.com/docs/middleware/logger#old-logger-middleware)
- [Usage](https://echo.labstack.com/docs/middleware/logger#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/logger#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/logger#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/logger#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/logger#default-configuration)
- [New RequestLogger middleware](https://echo.labstack.com/docs/middleware/logger#new-requestlogger-middleware)
  - [Examples](https://echo.labstack.com/docs/middleware/logger#examples)
  - [Troubleshooting Tips](https://echo.labstack.com/docs/middleware/logger#troubleshooting-tips)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1354938431.1743203688&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062&z=998033267)

## Method Override

[Skip to main content](https://echo.labstack.com/docs/middleware/method-override#__docusaurus_skipToContent_fallback)

On this page

Method override middleware checks for the overridden method from the request and<br/>
uses it instead of the original method.

info

For security reasons, only `POST` method can be overridden.

# Usage [​](https://echo.labstack.com/docs/middleware/method-override#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Pre(middleware.MethodOverride())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/method-override#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/method-override#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.MethodOverrideWithConfig(middleware.MethodOverrideConfig{
  Getter: middleware.MethodFromForm("_method"),
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/method-override#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
MethodOverrideConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Getter is a function that gets overridden method from the request.
  // Optional. Default values MethodFromHeader(echo.HeaderXHTTPMethodOverride).
  Getter MethodOverrideGetter
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/method-override#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultMethodOverrideConfig = MethodOverrideConfig{
  Skipper: DefaultSkipper,
  Getter:  MethodFromHeader(echo.HeaderXHTTPMethodOverride),
}

```

- [Usage](https://echo.labstack.com/docs/middleware/method-override#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/method-override#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/method-override#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/method-override#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/method-override#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=982761798.1743203680&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062~102976415&z=432257575)

## Prometheus

[Skip to main content](https://echo.labstack.com/docs/middleware/prometheus#__docusaurus_skipToContent_fallback)

On this page

note

Echo community contribution

Prometheus middleware generates metrics for HTTP requests.

There are 2 versions of Prometheus middleware:

- latest (recommended) [https://github.com/labstack/echo-contrib/blob/master/echoprometheus/prometheus.go](https://github.com/labstack/echo-contrib/blob/master/echoprometheus/prometheus.go)
- old (deprecated) [https://github.com/labstack/echo-contrib/blob/master/prometheus/prometheus.go](https://github.com/labstack/echo-contrib/blob/master/prometheus/prometheus.go))

Migration guide from old to newer middleware can found [here](https://github.com/labstack/echo-contrib/blob/master/echoprometheus/README.md).

# Usage [​](https://echo.labstack.com/docs/middleware/prometheus#usage "Direct link to Usage")

- Add needed module `go get -u github.com/labstack/echo-contrib`
- Add Prometheus middleware and metrics serving route

```codeBlockLines_e6Vv
e := echo.New()
e.Use(echoprometheus.NewMiddleware("myapp")) // adds middleware to gather metrics
e.GET("/metrics", echoprometheus.NewHandler()) // adds route to serve gathered metrics

```

# Examples [​](https://echo.labstack.com/docs/middleware/prometheus#examples "Direct link to Examples")

Serve metric from the same server as where metrics is gathered

```codeBlockLines_e6Vv
package main

import (
	"errors"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
)

func main() {
	e := echo.New()
	e.Use(echoprometheus.NewMiddleware("myapp")) // adds middleware to gather metrics
	e.GET("/metrics", echoprometheus.NewHandler()) // adds route to serve gathered metrics

	e.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello")
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

Serve metrics on a separate port

```codeBlockLines_e6Vv
func main() {
	app := echo.New() // this Echo instance will serve route on port 8080
	app.Use(echoprometheus.NewMiddleware("myapp")) // adds middleware to gather metrics

	go func() {
		metrics := echo.New() // this Echo will run on separate port 8081
		metrics.GET("/metrics", echoprometheus.NewHandler()) // adds route to serve gathered metrics
		if err := metrics.Start(":8081"); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	}()

	app.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello")
	})

	if err := app.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

_Sample output (for first example)_

```codeBlockLines_e6Vv
curl http://localhost:8080/metrics

# HELP echo_request_duration_seconds The HTTP request latencies in seconds.
# TYPE echo_request_duration_seconds summary
echo_request_duration_seconds_sum 0.41086482
echo_request_duration_seconds_count 1
# HELP echo_request_size_bytes The HTTP request sizes in bytes.
# TYPE echo_request_size_bytes summary
echo_request_size_bytes_sum 56
echo_request_size_bytes_count 1
# HELP echo_requests_total How many HTTP requests processed, partitioned by status code and HTTP method.
# TYPE echo_requests_total counter
echo_requests_total{code="200",host="localhost:8080",method="GET",url="/"} 1
# HELP echo_response_size_bytes The HTTP response sizes in bytes.
# TYPE echo_response_size_bytes summary
echo_response_size_bytes_sum 61
echo_response_size_bytes_count 1
...

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/prometheus#custom-configuration "Direct link to Custom Configuration")

# Serving Custom Prometheus Metrics [​](https://echo.labstack.com/docs/middleware/prometheus#serving-custom-prometheus-metrics "Direct link to Serving custom Prometheus Metrics")

_Usage_

Using custom metrics with Prometheus default registry:

```codeBlockLines_e6Vv
package main

import (
	"errors"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/prometheus/client_golang/prometheus"
	"log"
	"net/http"
)

func main() {
	e := echo.New()

	customCounter := prometheus.NewCounter( // create new counter metric. This is replacement for `prometheus.Metric` struct
		prometheus.CounterOpts{
			Name: "custom_requests_total",
			Help: "How many HTTP requests processed, partitioned by status code and HTTP method.",
		},
	)
	if err := prometheus.Register(customCounter); err != nil { // register your new counter metric with default metrics registry
		log.Fatal(err)
	}

	e.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
		AfterNext: func(c echo.Context, err error) {
			customCounter.Inc() // use our custom metric in middleware. after every request increment the counter
		},
	}))
	e.GET("/metrics", echoprometheus.NewHandler()) // register route for getting gathered metrics

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

or create your own registry and register custom metrics with that:

```codeBlockLines_e6Vv
package main

import (
	"errors"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/prometheus/client_golang/prometheus"
	"log"
	"net/http"
)

func main() {
	e := echo.New()

	customRegistry := prometheus.NewRegistry() // create custom registry for your custom metrics
	customCounter := prometheus.NewCounter(    // create new counter metric. This is replacement for `prometheus.Metric` struct
		prometheus.CounterOpts{
			Name: "custom_requests_total",
			Help: "How many HTTP requests processed, partitioned by status code and HTTP method.",
		},
	)
	if err := customRegistry.Register(customCounter); err != nil { // register your new counter metric with metrics registry
		log.Fatal(err)
	}

	e.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
		AfterNext: func(c echo.Context, err error) {
			customCounter.Inc() // use our custom metric in middleware. after every request increment the counter
		},
		Registerer: customRegistry, // use our custom registry instead of default Prometheus registry
	}))
	e.GET("/metrics", echoprometheus.NewHandlerWithConfig(echoprometheus.HandlerConfig{Gatherer: customRegistry})) // register route for getting gathered metrics data from our custom Registry

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

# Skipping URL(s) [​](https://echo.labstack.com/docs/middleware/prometheus#skipping-urls "Direct link to Skipping URL(s)")

_Usage_

A middleware skipper can be passed to avoid generating metrics to certain URL(s)

```codeBlockLines_e6Vv
package main

import (
	"errors"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"log"
	"net/http"
	"strings"
)

func main() {
	e := echo.New()

	mwConfig := echoprometheus.MiddlewareConfig{
		Skipper: func(c echo.Context) bool {
			return strings.HasPrefix(c.Path(), "/testurl")
		}, // does not gather metrics metrics on routes starting with `/testurl`
	}
	e.Use(echoprometheus.NewMiddlewareWithConfig(mwConfig)) // adds middleware to gather metrics

	e.GET("/metrics", echoprometheus.NewHandler()) // adds route to serve gathered metrics

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

# Complex Scenarios [​](https://echo.labstack.com/docs/middleware/prometheus#complex-scenarios "Direct link to Complex Scenarios")

Example: modify default `echoprometheus` metrics definitions

```codeBlockLines_e6Vv
package main

import (
	"errors"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/prometheus/client_golang/prometheus"
	"log"
	"net/http"
)

func main() {
	e := echo.New()

	e.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
		// labels of default metrics can be modified or added with `LabelFuncs` function
		LabelFuncs: map[string]echoprometheus.LabelValueFunc{
			"scheme": func(c echo.Context, err error) string { // additional custom label
				return c.Scheme()
			},
			"host": func(c echo.Context, err error) string { // overrides default 'host' label value
				return "y_" + c.Request().Host
			},
		},
		// The `echoprometheus` middleware registers the following metrics by default:
		// - Histogram: request_duration_seconds
		// - Histogram: response_size_bytes
		// - Histogram: request_size_bytes
		// - Counter: requests_total
		// which can be modified with `HistogramOptsFunc` and `CounterOptsFunc` functions
		HistogramOptsFunc: func(opts prometheus.HistogramOpts) prometheus.HistogramOpts {
			if opts.Name == "request_duration_seconds" {
				opts.Buckets = []float64{1000.0, 10_000.0, 100_000.0, 1_000_000.0} // 1KB ,10KB, 100KB, 1MB
			}
			return opts
		},
		CounterOptsFunc: func(opts prometheus.CounterOpts) prometheus.CounterOpts {
			if opts.Name == "requests_total" {
				opts.ConstLabels = prometheus.Labels{"my_const": "123"}
			}
			return opts
		},
	})) // adds middleware to gather metrics

	e.GET("/metrics", echoprometheus.NewHandler()) // adds route to serve gathered metrics

	e.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello")
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

- [Usage](https://echo.labstack.com/docs/middleware/prometheus#usage)
- [Examples](https://echo.labstack.com/docs/middleware/prometheus#examples)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/prometheus#custom-configuration)
  - [Serving custom Prometheus Metrics](https://echo.labstack.com/docs/middleware/prometheus#serving-custom-prometheus-metrics)
  - [Skipping URL(s)](https://echo.labstack.com/docs/middleware/prometheus#skipping-urls)
- [Complex Scenarios](https://echo.labstack.com/docs/middleware/prometheus#complex-scenarios)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=591333925.1743203662&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102975948&z=135960153)

## Proxy

[Skip to main content](https://echo.labstack.com/docs/middleware/proxy#__docusaurus_skipToContent_fallback)

On this page

Proxy provides an HTTP/WebSocket reverse proxy middleware. It forwards a request<br/>
to upstream server using a configured load balancing technique.

# Usage [​](https://echo.labstack.com/docs/middleware/proxy#usage "Direct link to Usage")

```codeBlockLines_e6Vv
url1, err := url.Parse("http://localhost:8081")
if err != nil {
  e.Logger.Fatal(err)
}
url2, err := url.Parse("http://localhost:8082")
if err != nil {
  e.Logger.Fatal(err)
}
e.Use(middleware.Proxy(middleware.NewRoundRobinBalancer([]*middleware.ProxyTarget{
  {
    URL: url1,
  },
  {
    URL: url2,
  },
})))

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/proxy#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/proxy#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/proxy#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
// ProxyConfig defines the config for Proxy middleware.
  ProxyConfig struct {
    // Skipper defines a function to skip middleware.
    Skipper Skipper

    // Balancer defines a load balancing technique.
    // Required.
    Balancer ProxyBalancer

    // Rewrite defines URL path rewrite rules. The values captured in asterisk can be
    // retrieved by index e.g. $1, $2 and so on.
    Rewrite map[string]string

    // RegexRewrite defines rewrite rules using regexp.Rexexp with captures
    // Every capture group in the values can be retrieved by index e.g. $1, $2 and so on.
    RegexRewrite map[*regexp.Regexp]string

    // Context key to store selected ProxyTarget into context.
    // Optional. Default value "target".
    ContextKey string

    // To customize the transport to remote.
    // Examples: If custom TLS certificates are required.
    Transport http.RoundTripper

    // ModifyResponse defines function to modify response from ProxyTarget.
    ModifyResponse func(*http.Response) error

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/proxy#default-configuration "Direct link to Default Configuration")

| Name       | Value          |
| ---------- | -------------- |
| Skipper    | DefaultSkipper |
| ContextKey | `target`       |

# Regex-based Rules [​](https://echo.labstack.com/docs/middleware/proxy#regex-based-rules "Direct link to Regex-based Rules")

For advanced rewriting of proxy requests rules may also be defined using<br/>
regular expression. Normal capture groups can be defined using `()` and referenced by index (`$1`, `$2`, …) for the rewritten path.

`RegexRules` and normal `Rules` can be combined.

```codeBlockLines_e6Vv
  e.Use(ProxyWithConfig(ProxyConfig{
    Balancer: rrb,
    Rewrite: map[string]string{
      "^/v1/*":     "/v2/$1",
    },
    RegexRewrite: map[*regexp.Regexp]string{
      regexp.MustCompile("^/foo/([0-9].*)"):  "/num/$1",
      regexp.MustCompile("^/bar/(.+?)/(.*)"): "/baz/$2/$1",
    },
  }))

```

# [Example](https://echo.labstack.com/docs/cookbook/reverse-proxy) [​](https://echo.labstack.com/docs/middleware/proxy#example "Direct link to example")

- [Usage](https://echo.labstack.com/docs/middleware/proxy#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/proxy#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/proxy#usage-1)
  - [Configuration](https://echo.labstack.com/docs/middleware/proxy#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/proxy#default-configuration)
  - [Regex-based Rules](https://echo.labstack.com/docs/middleware/proxy#regex-based-rules)
- [Example](https://echo.labstack.com/docs/middleware/proxy#example)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=340869047.1743203639&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062~102964102~102975949&z=1217312452)

## Rate Limiter

[Skip to main content](https://echo.labstack.com/docs/middleware/rate-limiter#__docusaurus_skipToContent_fallback)

On this page

`RateLimiter` provides a Rate Limiter middleware for limiting the amount of requests to the server from a particular IP or id within a time period.

By default an in-memory store is used for keeping track of requests. The default in-memory implementation is focused on correctness and<br/>
may not be the best option for a high number of concurrent requests or a large number of different identifiers (>16k).

# Usage [​](https://echo.labstack.com/docs/middleware/rate-limiter#usage "Direct link to Usage")

To add a rate limit to your application simply add the `RateLimiter` middleware.<br/>
The example below will limit the application to 20 requests/sec using the default in-memory store:

```codeBlockLines_e6Vv
e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(20))))

```

info

If the provided rate is a float number, Burst will be treated as the rounded down value of the rate.

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/rate-limiter#custom-configuration "Direct link to Custom Configuration")

```codeBlockLines_e6Vv
config := middleware.RateLimiterConfig{
    Skipper: middleware.DefaultSkipper,
    Store: middleware.NewRateLimiterMemoryStoreWithConfig(
        middleware.RateLimiterMemoryStoreConfig{Rate: rate.Limit(10), Burst: 30, ExpiresIn: 3 * time.Minute},
    ),
    IdentifierExtractor: func(ctx echo.Context) (string, error) {
        id := ctx.RealIP()
        return id, nil
    },
    ErrorHandler: func(context echo.Context, err error) error {
        return context.JSON(http.StatusForbidden, nil)
    },
    DenyHandler: func(context echo.Context, identifier string,err error) error {
        return context.JSON(http.StatusTooManyRequests, nil)
    },
}

e.Use(middleware.RateLimiterWithConfig(config))

```

# Errors [​](https://echo.labstack.com/docs/middleware/rate-limiter#errors "Direct link to Errors")

```codeBlockLines_e6Vv
var (
	// ErrRateLimitExceeded denotes an error raised when rate limit is exceeded
	ErrRateLimitExceeded = echo.NewHTTPError(http.StatusTooManyRequests, "rate limit exceeded")
	// ErrExtractorError denotes an error raised when extractor function is unsuccessful
	ErrExtractorError = echo.NewHTTPError(http.StatusForbidden, "error while extracting identifier")
)

```

tip

If you need to implement your own store, be sure to implement the RateLimiterStore interface and pass it to RateLimiterConfig and you're good to go!

# Configuration [​](https://echo.labstack.com/docs/middleware/rate-limiter#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
type RateLimiterConfig struct {
    Skipper    Skipper
    BeforeFunc BeforeFunc
    // IdentifierExtractor uses echo.Context to extract the identifier for a visitor
    IdentifierExtractor Extractor
    // Store defines a store for the rate limiter
    Store RateLimiterStore
    // ErrorHandler provides a handler to be called when IdentifierExtractor returns a non-nil error
    ErrorHandler func(context echo.Context, err error) error
    // DenyHandler provides a handler to be called when RateLimiter denies access
    DenyHandler func(context echo.Context, identifier string, err error) error
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/rate-limiter#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
// DefaultRateLimiterConfig defines default values for RateLimiterConfig
var DefaultRateLimiterConfig = RateLimiterConfig{
	Skipper: DefaultSkipper,
	IdentifierExtractor: func(ctx echo.Context) (string, error) {
		id := ctx.RealIP()
		return id, nil
	},
	ErrorHandler: func(context echo.Context, err error) error {
		return &echo.HTTPError{
			Code:     ErrExtractorError.Code,
			Message:  ErrExtractorError.Message,
			Internal: err,
		}
	},
	DenyHandler: func(context echo.Context, identifier string, err error) error {
		return &echo.HTTPError{
			Code:     ErrRateLimitExceeded.Code,
			Message:  ErrRateLimitExceeded.Message,
			Internal: err,
		}
	},
}

```

- [Usage](https://echo.labstack.com/docs/middleware/rate-limiter#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/rate-limiter#custom-configuration)
  - [Errors](https://echo.labstack.com/docs/middleware/rate-limiter#errors)
- [Configuration](https://echo.labstack.com/docs/middleware/rate-limiter#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/rate-limiter#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1709846747.1743203632&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509682~102788824~102803279~102813109~102887799~102926062&z=1899428980)

## Recover

[Skip to main content](https://echo.labstack.com/docs/middleware/recover#__docusaurus_skipToContent_fallback)

On this page

Recover middleware recovers from panics anywhere in the chain, prints stack trace<br/>
and handles the control to the centralized<br/>
[HTTPErrorHandler](https://echo.labstack.com/docs/customization#http-error-handler).

# Usage [​](https://echo.labstack.com/docs/middleware/recover#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.Recover())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/recover#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/recover#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
  StackSize: 1 << 10, // 1 KB
  LogLevel:  log.ERROR,
}))

```

Example above uses a `StackSize` of 1 KB, `LogLevel` of error and<br/>
default values for `DisableStackAll` and `DisablePrintStack`.

# Configuration [​](https://echo.labstack.com/docs/middleware/recover#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
// LogErrorFunc defines a function for custom logging in the middleware.
LogErrorFunc func(c echo.Context, err error, stack []byte) error

RecoverConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Size of the stack to be printed.
  // Optional. Default value 4KB.
  StackSize int `yaml:"stack_size"`

  // DisableStackAll disables formatting stack traces of all other goroutines
  // into buffer after the trace for the current goroutine.
  // Optional. Default value false.
  DisableStackAll bool `yaml:"disable_stack_all"`

  // DisablePrintStack disables printing stack trace.
  // Optional. Default value as false.
  DisablePrintStack bool `yaml:"disable_print_stack"`

  // LogLevel is log level to printing stack trace.
  // Optional. Default value 0 (Print).
  LogLevel log.Lvl

  // LogErrorFunc defines a function for custom logging in the middleware.
  // If it's set you don't need to provide LogLevel for config.
  LogErrorFunc LogErrorFunc

  // DisableErrorHandler disables the call to centralized HTTPErrorHandler.
  // The recovered error is then passed back to upstream middleware, instead of swallowing the error.
  // Optional. Default value false.
  DisableErrorHandler bool `yaml:"disable_error_handler"`

}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/recover#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultRecoverConfig = RecoverConfig{
  Skipper:             DefaultSkipper,
  StackSize:           4 << 10, // 4 KB
  DisableStackAll:     false,
  DisablePrintStack:   false,
  LogLevel:            0,
  LogErrorFunc:        nil,
  DisableErrorHandler: false,
}

```

- [Usage](https://echo.labstack.com/docs/middleware/recover#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/recover#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/recover#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/recover#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/recover#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1386985809.1743203629&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102015666~102482433~102788824~102803279~102813109~102887800~102926062~102976415&z=639305421)

## Redirect

[Skip to main content](https://echo.labstack.com/docs/middleware/redirect#__docusaurus_skipToContent_fallback)

On this page

# HTTPS Redirect [​](https://echo.labstack.com/docs/middleware/redirect#https-redirect "Direct link to HTTPS Redirect")

HTTPS redirect middleware redirects http requests to https.<br/>
For example, [http://labstack.com](http://labstack.com/) will be redirected to [https://labstack.com](https://labstack.com/).

# Usage [​](https://echo.labstack.com/docs/middleware/redirect#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.HTTPSRedirect())

```

# HTTPS WWW Redirect [​](https://echo.labstack.com/docs/middleware/redirect#https-www-redirect "Direct link to HTTPS WWW Redirect")

HTTPS WWW redirect redirects http requests to www https.<br/>
For example, [http://labstack.com](http://labstack.com/) will be redirected to [https://www.labstack.com](https://www.labstack.com/).

# Usage [​](https://echo.labstack.com/docs/middleware/redirect#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.HTTPSWWWRedirect())

```

# HTTPS NonWWW Redirect [​](https://echo.labstack.com/docs/middleware/redirect#https-nonwww-redirect "Direct link to HTTPS NonWWW Redirect")

HTTPS NonWWW redirect redirects http requests to https non [www](http://www/).<br/>
For example, [http://www.labstack.com](http://www.labstack.com/) will be redirect to [https://labstack.com](https://labstack.com/).

# Usage [​](https://echo.labstack.com/docs/middleware/redirect#usage-2 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.HTTPSNonWWWRedirect())

```

# WWW Redirect [​](https://echo.labstack.com/docs/middleware/redirect#www-redirect "Direct link to WWW Redirect")

WWW redirect redirects non www requests to [www](http://www/).

For example, [http://labstack.com](http://labstack.com/) will be redirected to [http://www.labstack.com](http://www.labstack.com/).

# Usage [​](https://echo.labstack.com/docs/middleware/redirect#usage-3 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.WWWRedirect())

```

# NonWWW Redirect [​](https://echo.labstack.com/docs/middleware/redirect#nonwww-redirect "Direct link to NonWWW Redirect")

NonWWW redirect redirects www requests to non [www](http://www/).<br/>
For example, [http://www.labstack.com](http://www.labstack.com/) will be redirected to [http://labstack.com](http://labstack.com/).

# Usage [​](https://echo.labstack.com/docs/middleware/redirect#usage-4 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.NonWWWRedirect())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/redirect#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/redirect#usage-5 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.HTTPSRedirectWithConfig(middleware.RedirectConfig{
  Code: http.StatusTemporaryRedirect,
}))

```

Example above will redirect the request HTTP to HTTPS with status code `307 - StatusTemporaryRedirect`.

# Configuration [​](https://echo.labstack.com/docs/middleware/redirect#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
RedirectConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Status code to be used when redirecting the request.
  // Optional. Default value http.StatusMovedPermanently.
  Code int `json:"code"`
}

```

# Default Configuration\* [​](https://echo.labstack.com/docs/middleware/redirect#default-configuration "Direct link to Default Configuration*")

```codeBlockLines_e6Vv
DefaultRedirectConfig = RedirectConfig{
  Skipper: DefaultSkipper,
  Code:    http.StatusMovedPermanently,
}

```

- [HTTPS Redirect](https://echo.labstack.com/docs/middleware/redirect#https-redirect)
  - [Usage](https://echo.labstack.com/docs/middleware/redirect#usage)
- [HTTPS WWW Redirect](https://echo.labstack.com/docs/middleware/redirect#https-www-redirect)
- [Usage](https://echo.labstack.com/docs/middleware/redirect#usage-1)
- [HTTPS NonWWW Redirect](https://echo.labstack.com/docs/middleware/redirect#https-nonwww-redirect)
  - [Usage](https://echo.labstack.com/docs/middleware/redirect#usage-2)
- [WWW Redirect](https://echo.labstack.com/docs/middleware/redirect#www-redirect)
  - [Usage](https://echo.labstack.com/docs/middleware/redirect#usage-3)
- [NonWWW Redirect](https://echo.labstack.com/docs/middleware/redirect#nonwww-redirect)
  - [Usage](https://echo.labstack.com/docs/middleware/redirect#usage-4)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/redirect#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/redirect#usage-5)
- [Configuration](https://echo.labstack.com/docs/middleware/redirect#configuration)
  - [Default Configuration\*](https://echo.labstack.com/docs/middleware/redirect#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1546646966.1743203684&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062~102964103&z=313792472)

## Request ID

[Skip to main content](https://echo.labstack.com/docs/middleware/request-id#__docusaurus_skipToContent_fallback)

On this page

Request ID middleware generates a unique id for a request.

# Usage [​](https://echo.labstack.com/docs/middleware/request-id#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.RequestID())

```

_Example_

```codeBlockLines_e6Vv
    e := echo.New()

    e.Use(middleware.RequestID())

    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, c.Response().Header().Get(echo.HeaderXRequestID))
    })
    e.Logger.Fatal(e.Start(":1323"))

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/request-id#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/request-id#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.RequestIDWithConfig(middleware.RequestIDConfig{
  Generator: func() string {
    return customGenerator()
  },
}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/request-id#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
RequestIDConfig struct {
    // Skipper defines a function to skip middleware.
    Skipper Skipper

    // Generator defines a function to generate an ID.
    // Optional. Default value random.String(32).
    Generator func() string

    // RequestIDHandler defines a function which is executed for a request id.
    RequestIDHandler func(echo.Context, string)

    // TargetHeader defines what header to look for to populate the id
    TargetHeader string
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/request-id#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultRequestIDConfig = RequestIDConfig{
  Skipper:   DefaultSkipper,
  Generator: generator,
  TargetHeader: echo.HeaderXRequestID,
}

```

# Set ID [​](https://echo.labstack.com/docs/middleware/request-id#set-id "Direct link to Set ID")

You can set the id from the requester with the `X-Request-ID`-Header

# Request [​](https://echo.labstack.com/docs/middleware/request-id#request "Direct link to Request")

```codeBlockLines_e6Vv
curl -H "X-Request-ID: 3" --compressed -v "http://localhost:1323/?my=param"

```

# Log [​](https://echo.labstack.com/docs/middleware/request-id#log "Direct link to Log")

```codeBlockLines_e6Vv
{"time":"2017-11-13T20:26:28.6438003+01:00","id":"3","remote_ip":"::1","host":"localhost:1323","method":"GET","uri":"/?my=param","my":"param","status":200, "latency":0,"latency_human":"0s","bytes_in":0,"bytes_out":13}

```

- [Usage](https://echo.labstack.com/docs/middleware/request-id#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/request-id#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/request-id#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/request-id#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/request-id#default-configuration)
- [Set ID](https://echo.labstack.com/docs/middleware/request-id#set-id)
  - [Request](https://echo.labstack.com/docs/middleware/request-id#request)
  - [Log](https://echo.labstack.com/docs/middleware/request-id#log)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=691848334.1743203645&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102015666~102482433~102788824~102803279~102813109~102887800~102926062&z=866890741)

## Rewrite

[Skip to main content](https://echo.labstack.com/docs/middleware/rewrite#__docusaurus_skipToContent_fallback)

On this page

Rewrite middleware allows to rewrite an URL path based on provided rules. It can be helpful for backward compatibility or just creating cleaner and more descriptive links.

# Usage [​](https://echo.labstack.com/docs/middleware/rewrite#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Pre(middleware.Rewrite(map[string]string{
  "/old":              "/new",
  "/api/*":            "/$1",
  "/js/*":             "/public/javascripts/$1",
  "/users/*/orders/*": "/user/$1/order/$2",
}))

```

The values captured in asterisk can be retrieved by index e.g. $1, $2 and so on.<br/>
Each asterisk will be non-greedy (translated to a capture group `(.*?)`) and if using<br/>
multiple asterisk a trailing `*` will match the "rest" of the path.

caution

Rewrite middleware should be registered via `Echo#Pre()` to get triggered before the router.

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/rewrite#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/rewrite#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/rewrite#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
// RewriteConfig defines the config for Rewrite middleware.
  RewriteConfig struct {
    // Skipper defines a function to skip middleware.
    Skipper Skipper

    // Rules defines the URL path rewrite rules. The values captured in asterisk can be
    // retrieved by index e.g. $1, $2 and so on.
    Rules map[string]string `yaml:"rules"`

    // RegexRules defines the URL path rewrite rules using regexp.Rexexp with captures
    // Every capture group in the values can be retrieved by index e.g. $1, $2 and so on.
    RegexRules map[*regexp.Regexp]string
  }

```

Default Configuration:

| Name    | Value          |
| ------- | -------------- |
| Skipper | DefaultSkipper |

# Regex-based Rules [​](https://echo.labstack.com/docs/middleware/rewrite#regex-based-rules "Direct link to Regex-based Rules")

For advanced rewriting of paths rules may also be defined using regular expression.<br/>
Normal capture groups can be defined using `()` and referenced by index (`$1`, `$2`, …) for the rewritten path.

`RegexRules` and normal `Rules` can be combined.

```codeBlockLines_e6Vv
  e.Pre(RewriteWithConfig(RewriteConfig{
    Rules: map[string]string{
      "^/v1/*": "/v2/$1",
    },
    RegexRules: map[*regexp.Regexp]string{
      regexp.MustCompile("^/foo/([0-9].*)"):  "/num/$1",
      regexp.MustCompile("^/bar/(.+?)/(.*)"): "/baz/$2/$1",
    },
  }))

```

- [Usage](https://echo.labstack.com/docs/middleware/rewrite#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/rewrite#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/rewrite#usage-1)
  - [Configuration](https://echo.labstack.com/docs/middleware/rewrite#configuration)
  - [Regex-based Rules](https://echo.labstack.com/docs/middleware/rewrite#regex-based-rules)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=239983067.1743203685&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102964102~102975949&z=1769681136)

## Secure

[Skip to main content](https://echo.labstack.com/docs/middleware/secure#__docusaurus_skipToContent_fallback)

On this page

Secure middleware provides protection against cross-site scripting (XSS) attack,<br/>
content type sniffing, clickjacking, insecure connection and other code injection<br/>
attacks.

# Usage [​](https://echo.labstack.com/docs/middleware/secure#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.Secure())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/secure#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/secure#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.SecureWithConfig(middleware.SecureConfig{
	XSSProtection:         "",
	ContentTypeNosniff:    "",
	XFrameOptions:         "",
	HSTSMaxAge:            3600,
	ContentSecurityPolicy: "default-src 'self'",
}))

```

info

Passing empty `XSSProtection`, `ContentTypeNosniff`, `XFrameOptions` or `ContentSecurityPolicy`<br/>
disables that protection.

# Configuration [​](https://echo.labstack.com/docs/middleware/secure#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
SecureConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // XSSProtection provides protection against cross-site scripting attack (XSS)
  // by setting the `X-XSS-Protection` header.
  // Optional. Default value "1; mode=block".
  XSSProtection string `json:"xss_protection"`

  // ContentTypeNosniff provides protection against overriding Content-Type
  // header by setting the `X-Content-Type-Options` header.
  // Optional. Default value "nosniff".
  ContentTypeNosniff string `json:"content_type_nosniff"`

  // XFrameOptions can be used to indicate whether or not a browser should
  // be allowed to render a page in a <frame>, <iframe> or <object> .
  // Sites can use this to avoid clickjacking attacks, by ensuring that their
  // content is not embedded into other sites.provides protection against
  // clickjacking.
  // Optional. Default value "SAMEORIGIN".
  // Possible values:
  // - "SAMEORIGIN" - The page can only be displayed in a frame on the same origin as the page itself.
  // - "DENY" - The page cannot be displayed in a frame, regardless of the site attempting to do so.
  // - "ALLOW-FROM uri" - The page can only be displayed in a frame on the specified origin.
  XFrameOptions string `json:"x_frame_options"`

  // HSTSMaxAge sets the `Strict-Transport-Security` header to indicate how
  // long (in seconds) browsers should remember that this site is only to
  // be accessed using HTTPS. This reduces your exposure to some SSL-stripping
  // man-in-the-middle (MITM) attacks.
  // Optional. Default value 0.
  HSTSMaxAge int `json:"hsts_max_age"`

  // HSTSExcludeSubdomains won't include subdomains tag in the `Strict Transport Security`
  // header, excluding all subdomains from security policy. It has no effect
  // unless HSTSMaxAge is set to a non-zero value.
  // Optional. Default value false.
  HSTSExcludeSubdomains bool `json:"hsts_exclude_subdomains"`

  // ContentSecurityPolicy sets the `Content-Security-Policy` header providing
  // security against cross-site scripting (XSS), clickjacking and other code
  // injection attacks resulting from execution of malicious content in the
  // trusted web page context.
  // Optional. Default value "".
  ContentSecurityPolicy string `json:"content_security_policy"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/secure#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultSecureConfig = SecureConfig{
  Skipper:            DefaultSkipper,
  XSSProtection:      "1; mode=block",
  ContentTypeNosniff: "nosniff",
  XFrameOptions:      "SAMEORIGIN",
}

```

- [Usage](https://echo.labstack.com/docs/middleware/secure#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/secure#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/secure#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/secure#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/secure#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1811119832.1743203711&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509682~102788824~102803279~102813109~102887799~102926062&z=887189858)

## Session

[Skip to main content](https://echo.labstack.com/docs/middleware/session#__docusaurus_skipToContent_fallback)

On this page

Session middleware facilitates HTTP session management backed by [gorilla sessions](https://github.com/gorilla/sessions). The default implementation provides cookie and<br/>
filesystem based session store; however, you can take advantage of [community maintained\\<br/>
implementation](https://github.com/gorilla/sessions#store-implementations) for various backends.

note

Echo community contribution

# Dependencies [​](https://echo.labstack.com/docs/middleware/session#dependencies "Direct link to Dependencies")

```codeBlockLines_e6Vv
import (
  "github.com/gorilla/sessions"
  "github.com/labstack/echo-contrib/session"
)

```

# Usage [​](https://echo.labstack.com/docs/middleware/session#usage "Direct link to Usage")

This example exposes two endpoints: `/create-session` creates new session and `/read-session` read value from<br/>
session if request contains session id.

```codeBlockLines_e6Vv
import (
    "errors"
    "fmt"
    "github.com/gorilla/sessions"
    "github.com/labstack/echo-contrib/session"
    "github.com/labstack/echo/v4"
    "log"
    "net/http"
)

func main() {
	e := echo.New()
	e.Use(session.Middleware(sessions.NewCookieStore([]byte("secret"))))

	e.GET("/create-session", func(c echo.Context) error {
		sess, err := session.Get("session", c)
		if err != nil {
			return err
		}
		sess.Options = &sessions.Options{
			Path:     "/",
			MaxAge:   86400 * 7,
			HttpOnly: true,
		}
		sess.Values["foo"] = "bar"
		if err := sess.Save(c.Request(), c.Response()); err != nil {
			return err
		}
		return c.NoContent(http.StatusOK)
	})

	e.GET("/read-session", func(c echo.Context) error {
		sess, err := session.Get("session", c)
		if err != nil {
			return err
		}
		return c.String(http.StatusOK, fmt.Sprintf("foo=%v\n", sess.Values["foo"]))
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

# Example Usage [​](https://echo.labstack.com/docs/middleware/session#example-usage "Direct link to Example usage")

Requesting `/read-session` without providing session it will output nil as `foo` value

```codeBlockLines_e6Vv
x@x:~/$ curl -v http://localhost:8080/read-session
* processing: http://localhost:8080/read-session
*   Trying [::1]:8080...
* Connected to localhost (::1) port 8080
> GET /read-session HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.2.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
< Date: Thu, 25 Apr 2024 09:15:14 GMT
< Content-Length: 10
<
foo=<nil>

```

Requesting `/create-session` creates new session

```codeBlockLines_e6Vv
x@x:~/$ curl -v -c cookies.txt http://localhost:8080/create-session
* processing: http://localhost:8080/create-session
*   Trying [::1]:8080...
* Connected to localhost (::1) port 8080
> GET /create-session HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.2.1
> Accept: */*
>
< HTTP/1.1 200 OK
* Added cookie session="MTcxNDAzNjYyMHxEWDhFQVFMX2dBQUJFQUVRQUFBZ180QUFBUVp6ZEhKcGJtY01CUUFEWm05dkJuTjBjbWx1Wnd3RkFBTmlZWEk9fHJQxR5fJDUEV-6iHSWuyVzjYX2f9F5tVaMGV6pjIE1Y" for domain localhost, path /, expire 1714641420
< Set-Cookie: session=MTcxNDAzNjYyMHxEWDhFQVFMX2dBQUJFQUVRQUFBZ180QUFBUVp6ZEhKcGJtY01CUUFEWm05dkJuTjBjbWx1Wnd3RkFBTmlZWEk9fHJQxR5fJDUEV-6iHSWuyVzjYX2f9F5tVaMGV6pjIE1Y; Path=/; Expires=Thu, 02 May 2024 09:17:00 GMT; Max-Age=604800; HttpOnly
< Date: Thu, 25 Apr 2024 09:17:00 GMT
< Content-Length: 0
<
* Connection #0 to host localhost left intact

```

Using session cookie from previous response and requesting `/read-session` will output `foo` value from session.

```codeBlockLines_e6Vv
x@x:~/$ curl -v -b cookies.txt http://localhost:8080/read-session
* processing: http://localhost:8080/read-session
*   Trying [::1]:8080...
* Connected to localhost (::1) port 8080
> GET /read-session HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.2.1
> Accept: */*
> Cookie: session=MTcxNDAzNjYyMHxEWDhFQVFMX2dBQUJFQUVRQUFBZ180QUFBUVp6ZEhKcGJtY01CUUFEWm05dkJuTjBjbWx1Wnd3RkFBTmlZWEk9fHJQxR5fJDUEV-6iHSWuyVzjYX2f9F5tVaMGV6pjIE1Y
>
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
< Date: Thu, 25 Apr 2024 09:18:56 GMT
< Content-Length: 8
<
foo=bar
* Connection #0 to host localhost left intact

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/session#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/session#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(session.MiddlewareWithConfig(session.Config{}))

```

# Configuration [​](https://echo.labstack.com/docs/middleware/session#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
Config struct {
  // Skipper defines a function to skip middleware.
  Skipper middleware.Skipper

  // Session store.
  // Required.
  Store sessions.Store
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/session#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultConfig = Config{
  Skipper: DefaultSkipper,
}

```

- [Dependencies](https://echo.labstack.com/docs/middleware/session#dependencies)
- [Usage](https://echo.labstack.com/docs/middleware/session#usage)
  - [Example usage](https://echo.labstack.com/docs/middleware/session#example-usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/session#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/session#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/session#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/session#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=2016390360.1743203620&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102975948&z=1482863261)

## Static

[Skip to main content](https://echo.labstack.com/docs/middleware/static#__docusaurus_skipToContent_fallback)

On this page

Static middleware can be used to serve static files from the provided root directory.

# Usage [​](https://echo.labstack.com/docs/middleware/static#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.Static("/static"))

```

This serves static files from `static` directory. For example, a request to `/js/main.js`<br/>
will fetch and serve `static/js/main.js` file.

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/static#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/static#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
  Root:   "static",
  Browse: true,
}))

```

This serves static files from `static` directory and enables directory browsing.

Default behavior when using with non root URL paths is to append the URL path to the filesystem path.

## Example 1 [​](https://echo.labstack.com/docs/middleware/static#example-1 "Direct link to Example 1")

```codeBlockLines_e6Vv
group := root.Group("somepath")
group.Use(middleware.Static(filepath.Join("filesystempath")))
// When an incoming request comes for `/somepath` the actual filesystem request goes to `filesystempath/somepath` instead of only `filesystempath`.

```

tip

To turn off this behavior set the `IgnoreBase` config param to `true`.

## Example 2 [​](https://echo.labstack.com/docs/middleware/static#example-2 "Direct link to Example 2")

Serve SPA assets from embedded filesystem

```codeBlockLines_e6Vv
//go:embed web
var webAssets embed.FS

func main() {
	e := echo.New()

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		HTML5:      true,
		Root:       "web", // because files are located in `web` directory in `webAssets` fs
		Filesystem: http.FS(webAssets),
	}))
	api := e.Group("/api")
	api.GET("/users", func(c echo.Context) error {
		return c.String(http.StatusOK, "users")
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

# Configuration [​](https://echo.labstack.com/docs/middleware/static#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
StaticConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Root directory from where the static content is served.
  // Required.
  Root string `json:"root"`

  // Index file for serving a directory.
  // Optional. Default value "index.html".
  Index string `json:"index"`

  // Enable HTML5 mode by forwarding all not-found requests to root so that
  // SPA (single-page application) can handle the routing.
  // Optional. Default value false.
  HTML5 bool `json:"html5"`

  // Enable directory browsing.
  // Optional. Default value false.
  Browse bool `json:"browse"`

  // Enable ignoring of the base of the URL path.
  // Example: when assigning a static middleware to a non root path group,
  // the filesystem path is not doubled
  // Optional. Default value false.
  IgnoreBase bool `yaml:"ignoreBase"`

  // Filesystem provides access to the static content.
  // Optional. Defaults to http.Dir(config.Root)
  Filesystem http.FileSystem `yaml:"-"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/static#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultStaticConfig = StaticConfig{
  Skipper: DefaultSkipper,
  Index:   "index.html",
}

```

- [Usage](https://echo.labstack.com/docs/middleware/static#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/static#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/static#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/static#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/static#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1650354251.1743203674&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062&z=607975419)

## Timeout

[Skip to main content](https://echo.labstack.com/docs/middleware/timeout#__docusaurus_skipToContent_fallback)

On this page

Timeout middleware is used to timeout at a long running operation within a predefined period.

# Usage [​](https://echo.labstack.com/docs/middleware/timeout#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e.Use(middleware.Timeout())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/timeout#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/timeout#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
  Skipper:                     middleware.DefaultSkipper,
  ErrorMessage:                "custom timeout error message returns to client",
  OnTimeoutRouteErrorHandler:  func(err error, c echo.Context) {
    log.Println(c.Path())
  },
  Timeout:                     30*time.Second,
}))

```

`OnTimeoutRouteErrorHandler` is an error handler that is executed for error that was returned from wrapped route after request timeouted and we already had sent the error code (503) and message response to the client.

```codeBlockLines_e6Vv
OnTimeoutRouteErrorHandler func(err error, c echo.Context)

```

Note: do not write headers/body inside this handler. The response has already been sent to the client and response writer<br/>
will not accept anything no more. handler in the previous example will log the actual route middleware timeouted.

# Configuration [​](https://echo.labstack.com/docs/middleware/timeout#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
// TimeoutConfig defines the config for Timeout middleware.
TimeoutConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // ErrorMessage is written to response on timeout in addition to http.StatusServiceUnavailable (503) status code
  ErrorMessage string

  // OnTimeoutRouteErrorHandler is an error handler that is executed for error that was returned from wrapped route after
  // request timeouted and we already had sent the error code (503) and message response to the client.
  OnTimeoutRouteErrorHandler func(err error, c echo.Context)

  // Timeout configures a timeout for the middleware, defaults to 0 for no timeout
  Timeout time.Duration
}

```

# Default Configuration\* [​](https://echo.labstack.com/docs/middleware/timeout#default-configuration "Direct link to Default Configuration*")

```codeBlockLines_e6Vv
// DefaultTimeoutConfig is the default Timeout middleware config.
DefaultTimeoutConfig = TimeoutConfig{
  Skipper:      DefaultSkipper,
  Timeout:      0,
  ErrorMessage: "",
  // Note that OnTimeoutRouteErrorHandler will be nil
}

```

- [Usage](https://echo.labstack.com/docs/middleware/timeout#usage)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/timeout#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/timeout#usage-1)
- [Configuration](https://echo.labstack.com/docs/middleware/timeout#configuration)
  - [Default Configuration\*](https://echo.labstack.com/docs/middleware/timeout#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=227601695.1743203681&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102975949&z=94071653)

## Trailing Slash

[Skip to main content](https://echo.labstack.com/docs/middleware/trailing-slash#__docusaurus_skipToContent_fallback)

On this page

# Add Trailing Slash [​](https://echo.labstack.com/docs/middleware/trailing-slash#add-trailing-slash "Direct link to Add Trailing Slash")

Add trailing slash middleware adds a trailing slash to the request URI.

# Usage [​](https://echo.labstack.com/docs/middleware/trailing-slash#usage "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.AddTrailingSlash())

```

# Remove Trailing Slash [​](https://echo.labstack.com/docs/middleware/trailing-slash#remove-trailing-slash "Direct link to Remove Trailing Slash")

Remove trailing slash middleware removes a trailing slash from the request URI.

# Usage [​](https://echo.labstack.com/docs/middleware/trailing-slash#usage-1 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Pre(middleware.RemoveTrailingSlash())

```

# Custom Configuration [​](https://echo.labstack.com/docs/middleware/trailing-slash#custom-configuration "Direct link to Custom Configuration")

# Usage [​](https://echo.labstack.com/docs/middleware/trailing-slash#usage-2 "Direct link to Usage")

```codeBlockLines_e6Vv
e := echo.New()
e.Use(middleware.AddTrailingSlashWithConfig(middleware.TrailingSlashConfig{
  RedirectCode: http.StatusMovedPermanently,
}))

```

Example above will add a trailing slash to the request URI and redirect with `301 - StatusMovedPermanently`.

# Configuration [​](https://echo.labstack.com/docs/middleware/trailing-slash#configuration "Direct link to Configuration")

```codeBlockLines_e6Vv
TrailingSlashConfig struct {
  // Skipper defines a function to skip middleware.
  Skipper Skipper

  // Status code to be used when redirecting the request.
  // Optional, but when provided the request is redirected using this code.
  RedirectCode int `json:"redirect_code"`
}

```

# Default Configuration [​](https://echo.labstack.com/docs/middleware/trailing-slash#default-configuration "Direct link to Default Configuration")

```codeBlockLines_e6Vv
DefaultTrailingSlashConfig = TrailingSlashConfig{
  Skipper: DefaultSkipper,
}

```

- [Add Trailing Slash](https://echo.labstack.com/docs/middleware/trailing-slash#add-trailing-slash)
  - [Usage](https://echo.labstack.com/docs/middleware/trailing-slash#usage)
- [Remove Trailing Slash](https://echo.labstack.com/docs/middleware/trailing-slash#remove-trailing-slash)
  - [Usage](https://echo.labstack.com/docs/middleware/trailing-slash#usage-1)
- [Custom Configuration](https://echo.labstack.com/docs/middleware/trailing-slash#custom-configuration)
  - [Usage](https://echo.labstack.com/docs/middleware/trailing-slash#usage-2)
- [Configuration](https://echo.labstack.com/docs/middleware/trailing-slash#configuration)
  - [Default Configuration](https://echo.labstack.com/docs/middleware/trailing-slash#default-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=737192118.1743203620&gtm=45je53r0h2v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062&z=683479820)
