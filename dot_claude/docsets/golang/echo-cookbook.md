---
tags:
  - "#golang-development"
  - "#web-api"
  - "#documentation"
  - "#web-framework"
  - "#server-side"
  - "#http-routing"
---
# Echo Cookbook

## Auto TLS

[Skip to main content](https://echo.labstack.com/docs/cookbook/auto-tls#__docusaurus_skipToContent_fallback)

On this page

This recipe demonstrates how to obtain TLS certificates for a domain automatically from<br/>
Let's Encrypt. `Echo#StartAutoTLS` accepts an address which should listen on port `443`.

Browse to `https://<DOMAIN>`. If everything goes fine, you should see a welcome<br/>
message with TLS enabled on the website.

tip

- For added security you should specify host policy in auto TLS manager
- Cache certificates to avoid issues with rate limits ([https://letsencrypt.org/docs/rate-limits](https://letsencrypt.org/docs/rate-limits))
- To redirect HTTP traffic to HTTPS, you can use [redirect middleware](https://echo.labstack.com/docs/middleware/redirect#https-redirect)

# Server [​](https://echo.labstack.com/docs/cookbook/auto-tls#server "Direct link to Server")

cookbook/auto-tls/server.go

```codeBlockLines_e6Vv
package main

import (
	"crypto/tls"
	"golang.org/x/crypto/acme"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	e := echo.New()
	// e.AutoTLSManager.HostPolicy = autocert.HostWhitelist("<DOMAIN>")
	// Cache certificates to avoid issues with rate limits (https://letsencrypt.org/docs/rate-limits)
	e.AutoTLSManager.Cache = autocert.DirCache("/var/www/.cache")
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.GET("/", func(c echo.Context) error {
		return c.HTML(http.StatusOK, `
			<h1>Welcome to Echo!</h1>
			<h3>TLS certificates automatically installed from Let's Encrypt :)</h3>
		`)
	})

	e.Logger.Fatal(e.StartAutoTLS(":443"))
}

func customHTTPServer() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.GET("/", func(c echo.Context) error {
		return c.HTML(http.StatusOK, `
			<h1>Welcome to Echo!</h1>
			<h3>TLS certificates automatically installed from Let's Encrypt :)</h3>
		`)
	})

	autoTLSManager := autocert.Manager{
		Prompt: autocert.AcceptTOS,
		// Cache certificates to avoid issues with rate limits (https://letsencrypt.org/docs/rate-limits)
		Cache: autocert.DirCache("/var/www/.cache"),
		//HostPolicy: autocert.HostWhitelist("<DOMAIN>"),
	}
	s := http.Server{
		Addr:    ":443",
		Handler: e, // set Echo as handler
		TLSConfig: &tls.Config{
			//Certificates: nil, // <-- s.ListenAndServeTLS will populate this field
			GetCertificate: autoTLSManager.GetCertificate,
			NextProtos:     []string{acme.ALPNProto},
		},
		//ReadTimeout: 30 * time.Second, // use custom timeouts
	}
	if err := s.ListenAndServeTLS("", ""); err != http.ErrServerClosed {
		e.Logger.Fatal(err)
	}
}

```

- [Server](https://echo.labstack.com/docs/cookbook/auto-tls#server)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1063564270.1743203710&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102665699~102788824~102803279~102813109~102887800~102926062~102964102&z=1742769986)

## CORs

[Skip to main content](https://echo.labstack.com/docs/cookbook/cors#__docusaurus_skipToContent_fallback)

On this page

# Server Using a List of Allowed Origins [​](https://echo.labstack.com/docs/cookbook/cors#server-using-a-list-of-allowed-origins "Direct link to Server using a list of allowed origins")

cookbook/cors/origin-list/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	users = []string{"Joe", "Veer", "Zion"}
)

func getUsers(c echo.Context) error {
	return c.JSON(http.StatusOK, users)
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS default
	// Allows requests from any origin wth GET, HEAD, PUT, POST or DELETE method.
	// e.Use(middleware.CORS())

	// CORS restricted
	// Allows requests from any `https://labstack.com` or `https://labstack.net` origin
	// wth GET, PUT, POST or DELETE method.
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://labstack.com", "https://labstack.net"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.GET("/api/users", getUsers)

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Server Using a Custom Function to Allow Origins [​](https://echo.labstack.com/docs/cookbook/cors#server-using-a-custom-function-to-allow-origins "Direct link to Server using a custom function to allow origins")

cookbook/cors/origin-func/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"
	"regexp"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	users = []string{"Joe", "Veer", "Zion"}
)

func getUsers(c echo.Context) error {
	return c.JSON(http.StatusOK, users)
}

// allowOrigin takes the origin as an argument and returns true if the origin
// is allowed or false otherwise.
func allowOrigin(origin string) (bool, error) {
	// In this example we use a regular expression but we can imagine various
	// kind of custom logic. For example, an external datasource could be used
	// to maintain the list of allowed origins.
	return regexp.MatchString(`^https:\/\/labstack\.(net|com)$`, origin)
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS restricted with a custom function to allow origins
	// and with the GET, PUT, POST or DELETE methods allowed.
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOriginFunc: allowOrigin,
		AllowMethods:    []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.GET("/api/users", getUsers)

	e.Logger.Fatal(e.Start(":1323"))
}

```

- [Server using a list of allowed origins](https://echo.labstack.com/docs/cookbook/cors#server-using-a-list-of-allowed-origins)
- [Server using a custom function to allow origins](https://echo.labstack.com/docs/cookbook/cors#server-using-a-custom-function-to-allow-origins)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=97316450.1743203678&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062~102976414&z=855742327)

## CRUD

[Skip to main content](https://echo.labstack.com/docs/cookbook/crud#__docusaurus_skipToContent_fallback)

On this page

# Server [​](https://echo.labstack.com/docs/cookbook/crud#server "Direct link to Server")

cookbook/crud/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type (
	user struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	}
)

var (
	users = map[int]*user{}
	seq   = 1
	lock  = sync.Mutex{}
)

//----------
// Handlers
//----------

func createUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	u := &user{
		ID: seq,
	}
	if err := c.Bind(u); err != nil {
		return err
	}
	users[u.ID] = u
	seq++
	return c.JSON(http.StatusCreated, u)
}

func getUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	id, _ := strconv.Atoi(c.Param("id"))
	return c.JSON(http.StatusOK, users[id])
}

func updateUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	u := new(user)
	if err := c.Bind(u); err != nil {
		return err
	}
	id, _ := strconv.Atoi(c.Param("id"))
	users[id].Name = u.Name
	return c.JSON(http.StatusOK, users[id])
}

func deleteUser(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	id, _ := strconv.Atoi(c.Param("id"))
	delete(users, id)
	return c.NoContent(http.StatusNoContent)
}

func getAllUsers(c echo.Context) error {
	lock.Lock()
	defer lock.Unlock()
	return c.JSON(http.StatusOK, users)
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/users", getAllUsers)
	e.POST("/users", createUser)
	e.GET("/users/:id", getUser)
	e.PUT("/users/:id", updateUser)
	e.DELETE("/users/:id", deleteUser)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/crud#client "Direct link to Client")

# Create User [​](https://echo.labstack.com/docs/cookbook/crud#create-user "Direct link to Create user")

## Request [​](https://echo.labstack.com/docs/cookbook/crud#request "Direct link to Request")

```codeBlockLines_e6Vv
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name":"Joe Smith"}' \
  localhost:1323/users

```

## Response [​](https://echo.labstack.com/docs/cookbook/crud#response "Direct link to Response")

```codeBlockLines_e6Vv
{
  "id": 1,
  "name": "Joe Smith"
}

```

# Get User [​](https://echo.labstack.com/docs/cookbook/crud#get-user "Direct link to Get user")

## Request [​](https://echo.labstack.com/docs/cookbook/crud#request-1 "Direct link to Request")

```codeBlockLines_e6Vv
curl localhost:1323/users/1

```

## Response [​](https://echo.labstack.com/docs/cookbook/crud#response-1 "Direct link to Response")

```codeBlockLines_e6Vv
{
  "id": 1,
  "name": "Joe Smith"
}

```

# Update User [​](https://echo.labstack.com/docs/cookbook/crud#update-user "Direct link to Update user")

## Request [​](https://echo.labstack.com/docs/cookbook/crud#request-2 "Direct link to Request")

```codeBlockLines_e6Vv
curl -X PUT \
  -H 'Content-Type: application/json' \
  -d '{"name":"Joe"}' \
  localhost:1323/users/1

```

## Response [​](https://echo.labstack.com/docs/cookbook/crud#response-2 "Direct link to Response")

```codeBlockLines_e6Vv
{
  "id": 1,
  "name": "Joe"
}

```

# Delete User [​](https://echo.labstack.com/docs/cookbook/crud#delete-user "Direct link to Delete user")

## Request [​](https://echo.labstack.com/docs/cookbook/crud#request-3 "Direct link to Request")

```codeBlockLines_e6Vv
curl -X DELETE localhost:1323/users/1

```

## Response [​](https://echo.labstack.com/docs/cookbook/crud#response-3 "Direct link to Response")

`NoContent - 204`

- [Server](https://echo.labstack.com/docs/cookbook/crud#server)
- [Client](https://echo.labstack.com/docs/cookbook/crud#client)
  - [Create user](https://echo.labstack.com/docs/cookbook/crud#create-user)
  - [Get user](https://echo.labstack.com/docs/cookbook/crud#get-user)
  - [Update user](https://echo.labstack.com/docs/cookbook/crud#update-user)
  - [Delete user](https://echo.labstack.com/docs/cookbook/crud#delete-user)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=38538895.1743203636&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102015666~102482433~102788824~102803279~102813109~102887799~102926062~102964102&z=1047117946)

## Embed Resources

[Skip to main content](https://echo.labstack.com/docs/cookbook/embed-resources#__docusaurus_skipToContent_fallback)

On this page

# With Go 1.16 Embed Feature [​](https://echo.labstack.com/docs/cookbook/embed-resources#with-go-116-embed-feature "Direct link to With go 1.16 embed feature")

cookbook/embed/server.go

```codeBlockLines_e6Vv
loading...

```

# With go.rice [​](https://echo.labstack.com/docs/cookbook/embed-resources#with-gorice "Direct link to With go.rice")

cookbook/embed-resources/server.go

```codeBlockLines_e6Vv
loading...

```

- [With go 1.16 embed feature](https://echo.labstack.com/docs/cookbook/embed-resources#with-go-116-embed-feature)
- [With go.rice](https://echo.labstack.com/docs/cookbook/embed-resources#with-gorice)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=397750108.1743203701&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062&z=177550807)

## File Download

[Skip to main content](https://echo.labstack.com/docs/cookbook/file-download#__docusaurus_skipToContent_fallback)

On this page

# Download File [​](https://echo.labstack.com/docs/cookbook/file-download#download-file "Direct link to Download file")

# Server [​](https://echo.labstack.com/docs/cookbook/file-download#server "Direct link to Server")

cookbook/file-download/server.go

```codeBlockLines_e6Vv
package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		return c.File("index.html")
	})
	e.GET("/file", func(c echo.Context) error {
		return c.File("echo.svg")
	})

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/file-download#client "Direct link to Client")

cookbook/file-download/index.html

```codeBlockLines_e6Vv
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>File download</title>
</head>
<body>

    <p>
        <a href="/file">File download</a>
    </p>

</body>
</html>

```

# Download File as Inline [​](https://echo.labstack.com/docs/cookbook/file-download#download-file-as-inline "Direct link to Download file as inline")

# Server [​](https://echo.labstack.com/docs/cookbook/file-download#server-1 "Direct link to Server")

cookbook/file-download/inline/server.go

```codeBlockLines_e6Vv
package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		return c.File("index.html")
	})
	e.GET("/inline", func(c echo.Context) error {
		return c.Inline("inline.txt", "inline.txt")
	})

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/file-download#client-1 "Direct link to Client")

cookbook/file-download/inline/index.html

```codeBlockLines_e6Vv
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>File download</title>
</head>
<body>

    <p>
        <a href="/inline">Inline file download</a>
    </p>

</body>
</html>

```

# Download File as Attachment [​](https://echo.labstack.com/docs/cookbook/file-download#download-file-as-attachment "Direct link to Download file as attachment")

# Server [​](https://echo.labstack.com/docs/cookbook/file-download#server-2 "Direct link to Server")

cookbook/file-download/attachment/server.go

```codeBlockLines_e6Vv
package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		return c.File("index.html")
	})
	e.GET("/attachment", func(c echo.Context) error {
		return c.Attachment("attachment.txt", "attachment.txt")
	})

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/file-download#client-2 "Direct link to Client")

cookbook/file-download/attachment/index.html

```codeBlockLines_e6Vv
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>File download</title>
</head>
<body>

    <p>
        <a href="/attachment">Attachment file download</a>
    </p>

</body>
</html>

```

- [Download file](https://echo.labstack.com/docs/cookbook/file-download#download-file)
  - [Server](https://echo.labstack.com/docs/cookbook/file-download#server)
  - [Client](https://echo.labstack.com/docs/cookbook/file-download#client)
- [Download file as inline](https://echo.labstack.com/docs/cookbook/file-download#download-file-as-inline)
  - [Server](https://echo.labstack.com/docs/cookbook/file-download#server-1)
  - [Client](https://echo.labstack.com/docs/cookbook/file-download#client-1)
- [Download file as attachment](https://echo.labstack.com/docs/cookbook/file-download#download-file-as-attachment)
  - [Server](https://echo.labstack.com/docs/cookbook/file-download#server-2)
  - [Client](https://echo.labstack.com/docs/cookbook/file-download#client-2)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=916560640.1743203617&gtm=45je53r0h2v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062~102964103&z=1861897827)

## File Upload

[Skip to main content](https://echo.labstack.com/docs/cookbook/file-upload#__docusaurus_skipToContent_fallback)

On this page

# Upload Single File with Parameters [​](https://echo.labstack.com/docs/cookbook/file-upload#upload-single-file-with-parameters "Direct link to Upload single file with parameters")

# Server [​](https://echo.labstack.com/docs/cookbook/file-upload#server "Direct link to Server")

cookbook/file-upload/single/server.go

```codeBlockLines_e6Vv
package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func upload(c echo.Context) error {
	// Read form fields
	name := c.FormValue("name")
	email := c.FormValue("email")

	//-----------
	// Read file
	//-----------

	// Source
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	return c.HTML(http.StatusOK, fmt.Sprintf("<p>File %s uploaded successfully with fields name=%s and email=%s.</p>", file.Filename, name, email))
}

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/", "public")
	e.POST("/upload", upload)

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/file-upload#client "Direct link to Client")

cookbook/file-upload/single/public/index.html

```codeBlockLines_e6Vv
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Single file upload</title>
</head>
<body>
<h1>Upload single file with fields</h1>

<form action="/upload" method="post" enctype="multipart/form-data">
    Name: <input type="text" name="name"><br>
    Email: <input type="email" name="email"><br>
    Files: <input type="file" name="file"><br><br>
    <input type="submit" value="Submit">
</form>
</body>
</html>

```

# Upload Multiple Files with Parameters [​](https://echo.labstack.com/docs/cookbook/file-upload#upload-multiple-files-with-parameters "Direct link to Upload multiple files with parameters")

# Server [​](https://echo.labstack.com/docs/cookbook/file-upload#server-1 "Direct link to Server")

cookbook/file-upload/multiple/server.go

```codeBlockLines_e6Vv
package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func upload(c echo.Context) error {
	// Read form fields
	name := c.FormValue("name")
	email := c.FormValue("email")

	//------------
	// Read files
	//------------

	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return err
	}
	files := form.File["files"]

	for _, file := range files {
		// Source
		src, err := file.Open()
		if err != nil {
			return err
		}
		defer src.Close()

		// Destination
		dst, err := os.Create(file.Filename)
		if err != nil {
			return err
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			return err
		}

	}

	return c.HTML(http.StatusOK, fmt.Sprintf("<p>Uploaded successfully %d files with fields name=%s and email=%s.</p>", len(files), name, email))
}

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/", "public")
	e.POST("/upload", upload)

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/file-upload#client-1 "Direct link to Client")

cookbook/file-upload/multiple/public/index.html

```codeBlockLines_e6Vv
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Multiple file upload</title>
</head>
<body>
<h1>Upload multiple files with fields</h1>

<form action="/upload" method="post" enctype="multipart/form-data">
    Name: <input type="text" name="name"><br>
    Email: <input type="email" name="email"><br>
    Files: <input type="file" name="files" multiple><br><br>
    <input type="submit" value="Submit">
</form>
</body>
</html>

```

- [Upload single file with parameters](https://echo.labstack.com/docs/cookbook/file-upload#upload-single-file-with-parameters)
  - [Server](https://echo.labstack.com/docs/cookbook/file-upload#server)
  - [Client](https://echo.labstack.com/docs/cookbook/file-upload#client)
- [Upload multiple files with parameters](https://echo.labstack.com/docs/cookbook/file-upload#upload-multiple-files-with-parameters)
  - [Server](https://echo.labstack.com/docs/cookbook/file-upload#server-1)
  - [Client](https://echo.labstack.com/docs/cookbook/file-upload#client-1)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1027060687.1743203642&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102015666~102482433~102788824~102803279~102813109~102887799~102926062~102975948&z=1386317613)

## Google App Engine

[Skip to main content](https://echo.labstack.com/docs/cookbook/google-app-engine#__docusaurus_skipToContent_fallback)

On this page

Google App Engine (GAE) provides a range of hosting options from pure PaaS (App Engine Classic)<br/>
through Managed VMs to fully self-managed or container-driven Compute Engine instances. Echo<br/>
works great with all of these but requires a few changes to the usual examples to run on the<br/>
AppEngine Classic and Managed VM options. With a small amount of effort though it's possible<br/>
to produce a codebase that will run on these and also non-managed platforms automatically.

We'll walk through the changes needed to support each option.

# Standalone [​](https://echo.labstack.com/docs/cookbook/google-app-engine#standalone "Direct link to Standalone")

Wait? What? I thought this was about AppEngine! Bear with me - the easiest way to show the changes<br/>
required is to start with a setup for standalone and work from there plus there's no reason we<br/>
wouldn't want to retain the ability to run our app anywhere, right?

We take advantage of the go [build constraints or tags](https://golang.org/pkg/go/build/) to change<br/>
how we create and run the Echo server for each platform while keeping the rest of the application<br/>
(e.g. handler wireup) the same across all of them.

First, we have the normal setup based on the examples but we split it into two files - `app.go` will<br/>
be common to all variations and holds the Echo instance variable. We initialise it from a function<br/>
and because it is a `var` this will happen _before_ any `init()` functions run - a feature that we'll<br/>
use to connect our handlers later.

cookbook/google-app-engine/app.go

```codeBlockLines_e6Vv
package main

// reference our echo instance and create it early
var e = createMux()

```

A separate source file contains the function to create the Echo instance and add the static<br/>
file handlers and middleware. Note the build tag on the first line which says to use this when _not_<br/>
building with appengine or appenginevm tags (which those platforms automatically add for us). We also<br/>
have the `main()` function to start serving our app as normal. This should all be very familiar.

cookbook/google-app-engine/app-standalone.go

```codeBlockLines_e6Vv
// +build !appengine,!appenginevm

package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func createMux() *echo.Echo {
	e := echo.New()

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(middleware.Gzip())

	e.Static("/", "public")

	return e
}

func main() {
	e.Logger.Fatal(e.Start(":8080"))
}

```

The handler-wireup that would normally also be a part of this Echo setup moves to separate files which<br/>
take advantage of the ability to have multiple `init()` functions which run _after_ the `e` Echo var is<br/>
initialized but _before_ the `main()` function is executed. These allow additional handlers to attach<br/>
themselves to the instance - I've found the `Group` feature naturally fits into this pattern with a file<br/>
per REST endpoint, often with a higher-level `api` group created that they attach to instead of the root<br/>
Echo instance directly (so things like CORS middleware can be added at this higher common-level).

cookbook/google-app-engine/users.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type (
	user struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}
)

var (
	users map[string]user
)

func init() {
	users = map[string]user{
		"1": user{
			ID:   "1",
			Name: "Wreck-It Ralph",
		},
	}

	// hook into the echo instance to create an endpoint group
	// and add specific middleware to it plus handlers
	g := e.Group("/users")
	g.Use(middleware.CORS())

	g.POST("", createUser)
	g.GET("", getUsers)
	g.GET("/:id", getUser)
}

func createUser(c echo.Context) error {
	u := new(user)
	if err := c.Bind(u); err != nil {
		return err
	}
	users[u.ID] = *u
	return c.JSON(http.StatusCreated, u)
}

func getUsers(c echo.Context) error {
	return c.JSON(http.StatusOK, users)
}

func getUser(c echo.Context) error {
	return c.JSON(http.StatusOK, users[c.Param("id")])
}

```

If we run our app it should execute as it did before when everything was in one file although we have<br/>
at least gained the ability to organize our handlers a little more cleanly.

# AppEngine Classic and Managed VM(s) [​](https://echo.labstack.com/docs/cookbook/google-app-engine#appengine-classic-and-managed-vms "Direct link to AppEngine Classic and Managed VM(s)")

So far we've seen how to split apart the Echo creation and setup but still have the same app that<br/>
still only runs standalone. Now we'll see how those changes allow us to add support for AppEngine<br/>
hosting.

Refer to the [AppEngine site](https://cloud.google.com/appengine/docs/go/) for full configuration<br/>
and deployment information.

# Configuration File [​](https://echo.labstack.com/docs/cookbook/google-app-engine#configuration-file "Direct link to Configuration file")

Both of these are Platform as as Service options running on either sandboxed micro-containers<br/>
or managed Compute Engine instances. Both require an `app.yaml` file to describe the app to<br/>
the service. While the app _could_ still serve all it's static files itself, one of the benefits<br/>
of the platform is having Google's infrastructure handle that for us so it can be offloaded and<br/>
the app only has to deal with dynamic requests. The platform also handles logging and http gzip<br/>
compression so these can be removed from the codebase as well.

The yaml file also contains other options to control instance size and auto-scaling so for true<br/>
deployment freedom you would likely have separate `app-classic.yaml` and `app-vm.yaml` files and<br/>
this can help when making the transition from AppEngine Classic to Managed VMs.

cookbook/google-app-engine/app-engine.yaml

```codeBlockLines_e6Vv
application: my-application-id  # defined when you create your app using google dev console
module: default                 # see https://cloud.google.com/appengine/docs/go/
version: alpha                  # you can run multiple versions of an app and A/B test
runtime: go                     # see https://cloud.google.com/appengine/docs/go/
api_version: go1                # used when appengine supports different go versions

default_expiration: "1d"        # for CDN serving of static files (use url versioning if long!)

handlers:
# all the static files that we normally serve ourselves are defined here and Google will handle
# serving them for us from it's own CDN / edge locations. For all the configuration options see:
# https://cloud.google.com/appengine/docs/go/config/appconfig#Go_app_yaml_Static_file_handlers
- url: /
  mime_type: text/html
  static_files: public/index.html
  upload: public/index.html

- url: /favicon.ico
  mime_type: image/x-icon
  static_files: public/favicon.ico
  upload: public/favicon.ico

- url: /scripts
  mime_type: text/javascript
  static_dir: public/scripts

# static files normally don't touch the server that the app runs on but server-side template files
# needs to be readable by the app. The application_readable option makes sure they are available as
# part of the app deployment onto the instance.
- url: /templates
  static_dir: /templates
  application_readable: true

# finally, we route all other requests to our application. The script name just means "the go app"
- url: /.*
  script: _go_app

```

# Router Configuration [​](https://echo.labstack.com/docs/cookbook/google-app-engine#router-configuration "Direct link to Router configuration")

We'll now use the [build constraints](https://golang.org/pkg/go/build/) again like we did when creating<br/>
our `app-standalone.go` instance but this time with the opposite tags to use this file _if_ the build has<br/>
the appengine or appenginevm tags (added automatically when deploying to these platforms).

This allows us to replace the `createMux()` function to create our Echo server _without_ any of the<br/>
static file handling and logging + gzip middleware which is no longer required. Also worth nothing is<br/>
that GAE classic provides a wrapper to handle serving the app so instead of a `main()` function where<br/>
we run the server, we instead wire up the router to the default `http.Handler` instead.

cookbook/google-app-engine/app-engine.go

```codeBlockLines_e6Vv
// +build appengine

package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func createMux() *echo.Echo {
	e := echo.New()
	// note: we don't need to provide the middleware or static handlers, that's taken care of by the platform
	// app engine has it's own "main" wrapper - we just need to hook echo into the default handler
	http.Handle("/", e)
	return e
}

```

Managed VMs are slightly different. They are expected to respond to requests on port 8080 as well<br/>
as special health-check requests used by the service to detect if an instance is still running in<br/>
order to provide automated failover and instance replacement. The `google.golang.org/appengine`<br/>
package provides this for us so we have a slightly different version for Managed VMs:

cookbook/google-app-engine/app-managed.go

```codeBlockLines_e6Vv
// +build appenginevm

package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"google.golang.org/appengine"
)

func createMux() *echo.Echo {
	e := echo.New()
	// note: we don't need to provide the middleware or static handlers
	// for the appengine vm version - that's taken care of by the platform
	return e
}

func main() {
	// the appengine package provides a convenient method to handle the health-check requests
	// and also run the app on the correct port. We just need to add Echo to the default handler
	e := echo.New(":8080")
	http.Handle("/", e)
	appengine.Main()
}

```

So now we have three different configurations. We can build and run our app as normal so it can<br/>
be executed locally, on a full Compute Engine instance or any other traditional hosting provider<br/>
(including EC2, Docker etc…). This build will ignore the code in appengine and appenginevm tagged<br/>
files and the `app.yaml` file is meaningless to anything other than the AppEngine platform.

We can also run locally using the [Google AppEngine SDK for Go](https://cloud.google.com/appengine/downloads)<br/>
either emulating [AppEngine Classic](https://cloud.google.com/appengine/docs/go/tools/devserver):

goapp serve

Or [Managed VM(s)](https://cloud.google.com/appengine/docs/managed-vms/sdk#run-local):

gcloud config set project \[your project id\]<br/>
gcloud preview app run.

And of course we can deploy our app to both of these platforms for easy and inexpensive auto-scaling joy.

Depending on what your app actually does it's possible you may need to make other changes to allow<br/>
switching between AppEngine provided service such as Datastore and alternative storage implementations<br/>
such as MongoDB. A combination of go interfaces and build constraints can make this fairly straightforward<br/>
but is outside the scope of this example.

- [Standalone](https://echo.labstack.com/docs/cookbook/google-app-engine#standalone)
- [AppEngine Classic and Managed VM(s)](https://echo.labstack.com/docs/cookbook/google-app-engine#appengine-classic-and-managed-vms)
  - [Configuration file](https://echo.labstack.com/docs/cookbook/google-app-engine#configuration-file)
  - [Router configuration](https://echo.labstack.com/docs/cookbook/google-app-engine#router-configuration)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1482152808.1743203681&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062~102976414&z=1020000977)

## Graceful Shutdown

[Skip to main content](https://echo.labstack.com/docs/cookbook/graceful-shutdown#__docusaurus_skipToContent_fallback)

On this page

# Using [http.Server\#Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) [​](https://echo.labstack.com/docs/cookbook/graceful-shutdown#using-httpservershutdown "Direct link to using-httpservershutdown")

cookbook/graceful-shutdown/server.go

```codeBlockLines_e6Vv
package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func main() {
	// Setup
	e := echo.New()
	e.Logger.SetLevel(log.INFO)
	e.GET("/", func(c echo.Context) error {
		time.Sleep(5 * time.Second)
		return c.JSON(http.StatusOK, "OK")
	})

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()
	// Start server
	go func() {
		if err := e.Start(":1323"); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("shutting down the server")
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server with a timeout of 10 seconds.
	<-ctx.Done()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}

```

note

Requires go1.16+

- [Using http.Server#Shutdown()](https://echo.labstack.com/docs/cookbook/graceful-shutdown#using-httpservershutdown)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1096497095.1743203635&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102522474~102788824~102803279~102813109~102887799~102926062&z=362749023)

## Hello World

[Skip to main content](https://echo.labstack.com/docs/cookbook/hello-world#__docusaurus_skipToContent_fallback)

On this page

# Server [​](https://echo.labstack.com/docs/cookbook/hello-world#server "Direct link to Server")

cookbook/hello-world/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Route => handler
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!\n")
	})

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

```

- [Server](https://echo.labstack.com/docs/cookbook/hello-world#server)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=2129717550.1743203639&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509683~102788824~102803279~102813109~102887799~102926062~102976415&z=543423554)

## HTTP2 Server Push

[Skip to main content](https://echo.labstack.com/docs/cookbook/http2-server-push#__docusaurus_skipToContent_fallback)

On this page

note

Requires go1.8+

# Send Web Assets Using HTTP/2 Server Push [​](https://echo.labstack.com/docs/cookbook/http2-server-push#send-web-assets-using-http2-server-push "Direct link to Send web assets using HTTP/2 server push")

# [Generate a self-signed X.509 TLS certificate](https://echo.labstack.com/docs/cookbook/http2#step-1-generate-a-self-signed-x-509-tls-certificate) [​](https://echo.labstack.com/docs/cookbook/http2-server-push#generate-a-self-signed-x509-tls-certificate "Direct link to generate-a-self-signed-x509-tls-certificate")

# 1) Register a Route to Serve Web Assets [​](https://echo.labstack.com/docs/cookbook/http2-server-push#1-register-a-route-to-serve-web-assets "Direct link to 1) Register a route to serve web assets")

```codeBlockLines_e6Vv
e.Static("/", "static")

```

# 2) Create a Handler to Serve index.html and Push It's Dependencies [​](https://echo.labstack.com/docs/cookbook/http2-server-push#2-create-a-handler-to-serve-indexhtml-and-push-its-dependencies "Direct link to 2) Create a handler to serve index.html and push it's dependencies")

```codeBlockLines_e6Vv
e.GET("/", func(c echo.Context) (err error) {
  pusher, ok := c.Response().Writer.(http.Pusher)
  if ok {
    if err = pusher.Push("/app.css", nil); err != nil {
      return
    }
    if err = pusher.Push("/app.js", nil); err != nil {
      return
    }
    if err = pusher.Push("/echo.png", nil); err != nil {
      return
    }
  }
  return c.File("index.html")
})

```

info

If `http.Pusher` is supported, web assets are pushed; otherwise, client makes separate requests to get them.

# 3) Start TLS Server Using cert.pem and key.pem [​](https://echo.labstack.com/docs/cookbook/http2-server-push#3-start-tls-server-using-certpem-and-keypem "Direct link to 3) Start TLS server using cert.pem and key.pem")

```codeBlockLines_e6Vv
if err := e.StartTLS(":1323", "cert.pem", "key.pem"); err != http.ErrServerClosed {
  log.Fatal(err)
}

```

or use customized HTTP server with your own TLSConfig

```codeBlockLines_e6Vv
s := http.Server{
  Addr:    ":8443",
  Handler: e, // set Echo as handler
  TLSConfig: &tls.Config{
    //Certificates: nil, // <-- s.ListenAndServeTLS will populate this field
  },
  //ReadTimeout: 30 * time.Second, // use custom timeouts
}
if err := s.ListenAndServeTLS("cert.pem", "key.pem"); err != http.ErrServerClosed {
  log.Fatal(err)
}

```

# 4) Start the Server and Browse to [https://localhost:1323](https://localhost:1323/) [​](https://echo.labstack.com/docs/cookbook/http2-server-push#4-start-the-server-and-browse-to-httpslocalhost1323 "Direct link to 4-start-the-server-and-browse-to-httpslocalhost1323")

```codeBlockLines_e6Vv
Protocol: HTTP/2.0
Host: localhost:1323
Remote Address: [::1]:60288
Method: GET
Path: /

```

# Source Code [​](https://echo.labstack.com/docs/cookbook/http2-server-push#source-code "Direct link to Source Code")

cookbook/http2-server-push/index.html

```codeBlockLines_e6Vv
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>HTTP/2 Server Push</title>
  <link rel="stylesheet" href="/app.css">
  <script src="/app.js"></script>
</head>
<body>
  <img class="echo" src="/echo.png">
  <h2>The following static files are served via HTTP/2 server push</h2>
  <ul>
    <li><code>/app.css</code></li>
    <li><code>/app.js</code></li>
    <li><code>/echo.png</code></li>
  </ul>
</body>
</html>

```

cookbook/http2-server-push/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	e.Static("/", "static")
	e.GET("/", func(c echo.Context) (err error) {
		pusher, ok := c.Response().Writer.(http.Pusher)
		if ok {
			if err = pusher.Push("/app.css", nil); err != nil {
				return
			}
			if err = pusher.Push("/app.js", nil); err != nil {
				return
			}
			if err = pusher.Push("/echo.png", nil); err != nil {
				return
			}
		}
		return c.File("index.html")
	})
	e.Logger.Fatal(e.StartTLS(":1323", "cert.pem", "key.pem"))
}

```

- [Send web assets using HTTP/2 server push](https://echo.labstack.com/docs/cookbook/http2-server-push#send-web-assets-using-http2-server-push)
  - [Generate a self-signed X.509 TLS certificate](https://echo.labstack.com/docs/cookbook/http2-server-push#generate-a-self-signed-x509-tls-certificate)
  - [1) Register a route to serve web assets](https://echo.labstack.com/docs/cookbook/http2-server-push#1-register-a-route-to-serve-web-assets)
  - [2) Create a handler to serve index.html and push it's dependencies](https://echo.labstack.com/docs/cookbook/http2-server-push#2-create-a-handler-to-serve-indexhtml-and-push-its-dependencies)
  - [3) Start TLS server using cert.pem and key.pem](https://echo.labstack.com/docs/cookbook/http2-server-push#3-start-tls-server-using-certpem-and-keypem)
  - [4) Start the server and browse to https://localhost:1323](https://echo.labstack.com/docs/cookbook/http2-server-push#4-start-the-server-and-browse-to-httpslocalhost1323)
- [Source Code](https://echo.labstack.com/docs/cookbook/http2-server-push#source-code)

## HTTP2

[Skip to main content](https://echo.labstack.com/docs/cookbook/http2#__docusaurus_skipToContent_fallback)

On this page

# 1) Generate a Self-signed X.509 TLS Certificate [​](https://echo.labstack.com/docs/cookbook/http2#1-generate-a-self-signed-x509-tls-certificate "Direct link to 1) Generate a self-signed X.509 TLS certificate")

Run the following command to generate `cert.pem` and `key.pem` files:

```codeBlockLines_e6Vv
go run $GOROOT/src/crypto/tls/generate_cert.go --host localhost

```

note

For demo purpose, we are using a self-signed certificate. Ideally, you should obtain<br/>
a certificate from [CA](https://en.wikipedia.org/wiki/Certificate_authority).

# 2) Create a Handler Which Simply Outputs the Request Information to the Client [​](https://echo.labstack.com/docs/cookbook/http2#2-create-a-handler-which-simply-outputs-the-request-information-to-the-client "Direct link to 2) Create a handler which simply outputs the request information to the client")

```codeBlockLines_e6Vv
e.GET("/request", func(c echo.Context) error {
  req := c.Request()
  format := `
    <code>
      Protocol: %s<br>
      Host: %s<br>
      Remote Address: %s<br>
      Method: %s<br>
      Path: %s<br>
    </code>
  `
  return c.HTML(http.StatusOK, fmt.Sprintf(format, req.Proto, req.Host, req.RemoteAddr, req.Method, req.URL.Path))
})

```

# 3) Start TLS Server Using cert.pem and key.pem [​](https://echo.labstack.com/docs/cookbook/http2#3-start-tls-server-using-certpem-and-keypem "Direct link to 3) Start TLS server using cert.pem and key.pem")

```codeBlockLines_e6Vv
if err := e.StartTLS(":1323", "cert.pem", "key.pem"); err != http.ErrServerClosed {
  log.Fatal(err)
}

```

or use customized HTTP server with your own TLSConfig

```codeBlockLines_e6Vv
s := http.Server{
  Addr:    ":8443",
  Handler: e, // set Echo as handler
  TLSConfig: &tls.Config{
    //Certificates: nil, // <-- s.ListenAndServeTLS will populate this field
  },
  //ReadTimeout: 30 * time.Second, // use custom timeouts
}
if err := s.ListenAndServeTLS("cert.pem", "key.pem"); err != http.ErrServerClosed {
  log.Fatal(err)
}

```

# 4) Start the Server and Browse to [https://localhost:1323/request](https://localhost:1323/request) to See the following Output [​](https://echo.labstack.com/docs/cookbook/http2#4-start-the-server-and-browse-to-httpslocalhost1323request-to-see-the-following-output "Direct link to 4-start-the-server-and-browse-to-httpslocalhost1323request-to-see-the-following-output")

```codeBlockLines_e6Vv
Protocol: HTTP/2.0
Host: localhost:1323
Remote Address: [::1]:60288
Method: GET
Path: /

```

# Source Code [​](https://echo.labstack.com/docs/cookbook/http2#source-code "Direct link to Source Code")

cookbook/http2/server.go

```codeBlockLines_e6Vv
package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	e.GET("/request", func(c echo.Context) error {
		req := c.Request()
		format := `
			<code>
				Protocol: %s<br>
				Host: %s<br>
				Remote Address: %s<br>
				Method: %s<br>
				Path: %s<br>
			</code>
		`
		return c.HTML(http.StatusOK, fmt.Sprintf(format, req.Proto, req.Host, req.RemoteAddr, req.Method, req.URL.Path))
	})
	e.Logger.Fatal(e.StartTLS(":1323", "cert.pem", "key.pem"))
}

```

- [1) Generate a self-signed X.509 TLS certificate](https://echo.labstack.com/docs/cookbook/http2#1-generate-a-self-signed-x509-tls-certificate)
- [2) Create a handler which simply outputs the request information to the client](https://echo.labstack.com/docs/cookbook/http2#2-create-a-handler-which-simply-outputs-the-request-information-to-the-client)
- [3) Start TLS server using cert.pem and key.pem](https://echo.labstack.com/docs/cookbook/http2#3-start-tls-server-using-certpem-and-keypem)
- [4) Start the server and browse to https://localhost:1323/request to see the following output](https://echo.labstack.com/docs/cookbook/http2#4-start-the-server-and-browse-to-httpslocalhost1323request-to-see-the-following-output)
- [Source Code](https://echo.labstack.com/docs/cookbook/http2#source-code)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=371081166.1743203633&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102976415&z=692951141)

## JSON-P

[Skip to main content](https://echo.labstack.com/docs/cookbook/jsonp#__docusaurus_skipToContent_fallback)

On this page

JSONP is a method that allows cross-domain server calls. You can read more about it at the JSON versus JSONP Tutorial.

# Server [​](https://echo.labstack.com/docs/cookbook/jsonp#server "Direct link to Server")

cookbook/jsonp/server.go

```codeBlockLines_e6Vv
package main

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/", "public")

	// JSONP
	e.GET("/jsonp", func(c echo.Context) error {
		callback := c.QueryParam("callback")
		var content struct {
			Response  string    `json:"response"`
			Timestamp time.Time `json:"timestamp"`
			Random    int       `json:"random"`
		}
		content.Response = "Sent via JSONP"
		content.Timestamp = time.Now().UTC()
		content.Random = rand.Intn(1000)
		return c.JSONP(http.StatusOK, callback, &content)
	})

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/jsonp#client "Direct link to Client")

cookbook/jsonp/public/index.html

```codeBlockLines_e6Vv
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <title>JSONP</title>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script type="text/javascript">
        var host_prefix = 'http://localhost:1323';
        $(document).ready(function() {
            // JSONP version - add 'callback=?' to the URL - fetch the JSONP response to the request
            $("#jsonp-button").click(function(e) {
                e.preventDefault();
                // The only difference on the client end is the addition of 'callback=?' to the URL
                var url = host_prefix + '/jsonp?callback=?';
                $.getJSON(url, function(jsonp) {
                    console.log(jsonp);
                    $("#jsonp-response").html(JSON.stringify(jsonp, null, 2));
                });
            });
        });
    </script>

</head>

<body>
    <div class="container" style="margin-top: 50px;">
        <input type="button" class="btn btn-primary btn-lg" id="jsonp-button" value="Get JSONP response">
        <p>
            <pre id="jsonp-response"></pre>
        </p>
    </div>
</body>

</html>

```

- [Server](https://echo.labstack.com/docs/cookbook/jsonp#server)
- [Client](https://echo.labstack.com/docs/cookbook/jsonp#client)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=90593769.1743203649&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509682~102788824~102803279~102813109~102887799~102926062&z=244343426)

## JWT

[Skip to main content](https://echo.labstack.com/docs/cookbook/jwt#__docusaurus_skipToContent_fallback)

On this page

[JWT middleware](https://echo.labstack.com/docs/middleware/jwt) configuration can be found [here](https://echo.labstack.com/docs/middleware/jwt#configuration).

This is cookbook for:

- JWT authentication using HS256 algorithm.
- JWT is retrieved from `Authorization` request header.

# Server [​](https://echo.labstack.com/docs/cookbook/jwt#server "Direct link to Server")

# Using Custom Claims [​](https://echo.labstack.com/docs/cookbook/jwt#using-custom-claims "Direct link to Using custom claims")

cookbook/jwt/custom-claims/server.go

```codeBlockLines_e6Vv
package main

import (
	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
	"time"
)

// jwtCustomClaims are custom claims extending default ones.
// See https://github.com/golang-jwt/jwt for more examples
type jwtCustomClaims struct {
	Name  string `json:"name"`
	Admin bool   `json:"admin"`
	jwt.RegisteredClaims
}

func login(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	// Throws unauthorized error
	if username != "jon" || password != "shhh!" {
		return echo.ErrUnauthorized
	}

	// Set custom claims
	claims := &jwtCustomClaims{
		"Jon Snow",
		true,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token": t,
	})
}

func accessible(c echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*jwtCustomClaims)
	name := claims.Name
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Login route
	e.POST("/login", login)

	// Unauthenticated route
	e.GET("/", accessible)

	// Restricted group
	r := e.Group("/restricted")

	// Configure middleware with the custom claims type
	config := echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(jwtCustomClaims)
		},
		SigningKey: []byte("secret"),
	}
	r.Use(echojwt.WithConfig(config))
	r.GET("", restricted)

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Using a User-defined KeyFunc [​](https://echo.labstack.com/docs/cookbook/jwt#using-a-user-defined-keyfunc "Direct link to Using a user-defined KeyFunc")

cookbook/jwt/user-defined-keyfunc/server.go

```codeBlockLines_e6Vv
package main

import (
	"context"
	"errors"
	"fmt"
	echojwt "github.com/labstack/echo-jwt/v4"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/lestrrat-go/jwx/jwk"
)

func getKey(token *jwt.Token) (interface{}, error) {

	// For a demonstration purpose, Google Sign-in is used.
	// https://developers.google.com/identity/sign-in/web/backend-auth
	//
	// This user-defined KeyFunc verifies tokens issued by Google Sign-In.
	//
	// Note: In this example, it downloads the keyset every time the restricted route is accessed.
	keySet, err := jwk.Fetch(context.Background(), "https://www.googleapis.com/oauth2/v3/certs")
	if err != nil {
		return nil, err
	}

	keyID, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("expecting JWT header to have a key ID in the kid field")
	}

	key, found := keySet.LookupKeyID(keyID)

	if !found {
		return nil, fmt.Errorf("unable to find key %q", keyID)
	}

	var pubkey interface{}
	if err := key.Raw(&pubkey); err != nil {
		return nil, fmt.Errorf("Unable to get the public key. Error: %s", err.Error())
	}

	return pubkey, nil
}

func accessible(c echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Unauthenticated route
	e.GET("/", accessible)

	// Restricted group
	r := e.Group("/restricted")
	{
		config := echojwt.Config{
			KeyFunc: getKey,
		}
		r.Use(echojwt.WithConfig(config))
		r.GET("", restricted)
	}

	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/jwt#client "Direct link to Client")

# Login [​](https://echo.labstack.com/docs/cookbook/jwt#login "Direct link to Login")

Login using username and password to retrieve a token.

```codeBlockLines_e6Vv
curl -X POST -d 'username=jon' -d 'password=shhh!' localhost:1323/login

```

# Response [​](https://echo.labstack.com/docs/cookbook/jwt#response "Direct link to Response")

```codeBlockLines_e6Vv
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjE5NTcxMzZ9.RB3arc4-OyzASAaUhC2W3ReWaXAt_z2Fd3BN4aWTgEY"
}

```

# Request [​](https://echo.labstack.com/docs/cookbook/jwt#request "Direct link to Request")

Request a restricted resource using the token in `Authorization` request header.

```codeBlockLines_e6Vv
curl localhost:1323/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjE5NTcxMzZ9.RB3arc4-OyzASAaUhC2W3ReWaXAt_z2Fd3BN4aWTgEY"

```

# Response [​](https://echo.labstack.com/docs/cookbook/jwt#response-1 "Direct link to Response")

```codeBlockLines_e6Vv
Welcome Jon Snow!

```

- [Server](https://echo.labstack.com/docs/cookbook/jwt#server)
  - [Using custom claims](https://echo.labstack.com/docs/cookbook/jwt#using-custom-claims)
  - [Using a user-defined KeyFunc](https://echo.labstack.com/docs/cookbook/jwt#using-a-user-defined-keyfunc)
- [Client](https://echo.labstack.com/docs/cookbook/jwt#client)
  - [Login](https://echo.labstack.com/docs/cookbook/jwt#login)
  - [Response](https://echo.labstack.com/docs/cookbook/jwt#response)
  - [Request](https://echo.labstack.com/docs/cookbook/jwt#request)
  - [Response](https://echo.labstack.com/docs/cookbook/jwt#response-1)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=390024527.1743203610&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102976414&z=272309835)

## Load Balancing

[Skip to main content](https://echo.labstack.com/docs/cookbook/load-balancing#__docusaurus_skipToContent_fallback)

On this page

This recipe demonstrates how you can use Nginx as a reverse proxy server and load balance between multiple Echo servers.

# Echo [​](https://echo.labstack.com/docs/cookbook/load-balancing#echo "Direct link to Echo")

cookbook/load-balancing/upstream/server.go

```codeBlockLines_e6Vv
package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var index = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Upstream Server</title>
		<style>
			h1, p {
				font-weight: 300;
			}
		</style>
	</head>
	<body>
		<p>
			Hello from upstream server %s
		</p>
	</body>
	</html>
`

func main() {
	name := os.Args[1]
	port := os.Args[2]
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.GET("/", func(c echo.Context) error {
		return c.HTML(http.StatusOK, fmt.Sprintf(index, name))
	})
	e.Logger.Fatal(e.Start(port))
}

```

# Start Servers [​](https://echo.labstack.com/docs/cookbook/load-balancing#start-servers "Direct link to Start servers")

- `cd upstream`
- `go run server.go server1:8081`
- `go run server.go server2:8082`

# Nginx [​](https://echo.labstack.com/docs/cookbook/load-balancing#nginx "Direct link to Nginx")

# 1) Install Nginx [​](https://echo.labstack.com/docs/cookbook/load-balancing#1-install-nginx "Direct link to 1) Install Nginx")

[https://www.nginx.com/resources/wiki/start/topics/tutorials/install](https://www.nginx.com/resources/wiki/start/topics/tutorials/install)

# 2) Configure Nginx [​](https://echo.labstack.com/docs/cookbook/load-balancing#2-configure-nginx "Direct link to 2) Configure Nginx")

Create a file `/etc/nginx/sites-enabled/localhost` with the following content:

```codeBlockLines_e6Vv
https://github.com/labstack/echox/blob/master/cookbook/load-balancing/nginx.conf

```

info

Change listen, server_name, access_log per your need.

# 3) Restart Nginx [​](https://echo.labstack.com/docs/cookbook/load-balancing#3-restart-nginx "Direct link to 3) Restart Nginx")

```codeBlockLines_e6Vv
service nginx restart

```

Browse to [https://localhost:8080](https://localhost:8080/), and you should see a webpage being served from either "server 1" or "server 2".

```codeBlockLines_e6Vv
Hello from upstream server server1

```

- [Echo](https://echo.labstack.com/docs/cookbook/load-balancing#echo)
  - [Start servers](https://echo.labstack.com/docs/cookbook/load-balancing#start-servers)
- [Nginx](https://echo.labstack.com/docs/cookbook/load-balancing#nginx)
  - [1) Install Nginx](https://echo.labstack.com/docs/cookbook/load-balancing#1-install-nginx)
  - [2) Configure Nginx](https://echo.labstack.com/docs/cookbook/load-balancing#2-configure-nginx)
  - [3) Restart Nginx](https://echo.labstack.com/docs/cookbook/load-balancing#3-restart-nginx)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1300203844.1743203607&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102975948&z=1027930571)

## Middleware Custom

[Skip to main content](https://echo.labstack.com/docs/cookbook/middleware#__docusaurus_skipToContent_fallback)

On this page

# Write a Custom Middleware [​](https://echo.labstack.com/docs/cookbook/middleware#write-a-custom-middleware "Direct link to Write a custom middleware")

- Middleware to collect request count, statuses and uptime.
- Middleware to write custom `Server` header to the response.

# Server [​](https://echo.labstack.com/docs/cookbook/middleware#server "Direct link to Server")

cookbook/middleware/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
)

type (
	Stats struct {
		Uptime       time.Time      `json:"uptime"`
		RequestCount uint64         `json:"requestCount"`
		Statuses     map[string]int `json:"statuses"`
		mutex        sync.RWMutex
	}
)

func NewStats() *Stats {
	return &Stats{
		Uptime:   time.Now(),
		Statuses: map[string]int{},
	}
}

// Process is the middleware function.
func (s *Stats) Process(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if err := next(c); err != nil {
			c.Error(err)
		}
		s.mutex.Lock()
		defer s.mutex.Unlock()
		s.RequestCount++
		status := strconv.Itoa(c.Response().Status)
		s.Statuses[status]++
		return nil
	}
}

// Handle is the endpoint to get stats.
func (s *Stats) Handle(c echo.Context) error {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return c.JSON(http.StatusOK, s)
}

// ServerHeader middleware adds a `Server` header to the response.
func ServerHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderServer, "Echo/3.0")
		return next(c)
	}
}

func main() {
	e := echo.New()

	// Debug mode
	e.Debug = true

	//-------------------
	// Custom middleware
	//-------------------
	// Stats
	s := NewStats()
	e.Use(s.Process)
	e.GET("/stats", s.Handle) // Endpoint to get stats

	// Server header
	e.Use(ServerHeader)

	// Handler
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

```

# Response [​](https://echo.labstack.com/docs/cookbook/middleware#response "Direct link to Response")

## Headers [​](https://echo.labstack.com/docs/cookbook/middleware#headers "Direct link to Headers")

```codeBlockLines_e6Vv
Content-Length:122
Content-Type:application/json; charset=utf-8
Date:Thu, 14 Apr 2016 20:31:46 GMT
Server:Echo/3.0

```

## Body [​](https://echo.labstack.com/docs/cookbook/middleware#body "Direct link to Body")

```codeBlockLines_e6Vv
{
  "uptime": "2016-04-14T13:28:48.486548936-07:00",
  "requestCount": 5,
  "statuses": {
    "200": 4,
    "404": 1
  }
}

```

- [Write a custom middleware](https://echo.labstack.com/docs/cookbook/middleware#write-a-custom-middleware)
  - [Server](https://echo.labstack.com/docs/cookbook/middleware#server)
  - [Response](https://echo.labstack.com/docs/cookbook/middleware#response)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=82366935.1743203668&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062~102976414&z=667287769)

## Reverse Proxy

[Skip to main content](https://echo.labstack.com/docs/cookbook/reverse-proxy#__docusaurus_skipToContent_fallback)

On this page

This recipe demonstrates how you can use Echo as a reverse proxy server and load balancer in front of your favorite applications like WordPress, Node.js, Java, Python, Ruby or even Go. For simplicity, I will use Go upstream servers with WebSocket.

# 1) Identify upstream Target URL(s) [​](https://echo.labstack.com/docs/cookbook/reverse-proxy#1-identify-upstream-target-urls "Direct link to 1) Identify upstream target URL(s)")

```codeBlockLines_e6Vv
url1, err := url.Parse("http://localhost:8081")
if err != nil {
  e.Logger.Fatal(err)
}
url2, err := url.Parse("http://localhost:8082")
if err != nil {
  e.Logger.Fatal(err)
}
targets := []*middleware.ProxyTarget{
  {
    URL: url1,
  },
  {
    URL: url2,
  },
}

```

# 2) Setup Proxy Middleware with upstream Targets [​](https://echo.labstack.com/docs/cookbook/reverse-proxy#2-setup-proxy-middleware-with-upstream-targets "Direct link to 2) Setup proxy middleware with upstream targets")

In the following code snippet we are using round-robin load balancing technique. You may also use `middleware.NewRandomBalancer()`.

```codeBlockLines_e6Vv
e.Use(middleware.Proxy(middleware.NewRoundRobinBalancer(targets)))

```

To setup proxy for a sub-route use `Echo#Group()`.

```codeBlockLines_e6Vv
g := e.Group("/blog")
g.Use(middleware.Proxy(...))

```

# 3) Start upstream Servers [​](https://echo.labstack.com/docs/cookbook/reverse-proxy#3-start-upstream-servers "Direct link to 3) Start upstream servers")

- `cd upstream`
- `go run server.go server1:8081`
- `go run server.go server2:8082`

# 4) Start the Proxy Server [​](https://echo.labstack.com/docs/cookbook/reverse-proxy#4-start-the-proxy-server "Direct link to 4) Start the proxy server")

```codeBlockLines_e6Vv
go run server.go

```

Browse to [http://localhost:1323](http://localhost:1323/), and you should see a webpage with an HTTP request being served from "server 1" and a WebSocket request being served from "server 2."

```codeBlockLines_e6Vv
HTTP

Hello from upstream server server1

WebSocket

Hello from upstream server server2!
Hello from upstream server server2!
Hello from upstream server server2!

```

# Source Code [​](https://echo.labstack.com/docs/cookbook/reverse-proxy#source-code "Direct link to Source Code")

cookbook/reverse-proxy/upstream/server.go

```codeBlockLines_e6Vv
package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/net/websocket"
)

var index = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Upstream Server</title>
		<style>
			h1, p {
				font-weight: 300;
			}
		</style>
	</head>
	<body>
		<h1>HTTP</h1>
		<p>
			Hello from upstream server %s
		</p>
		<h1>WebSocket</h1>
		<p id="output"></p>
		<script>
			var ws = new WebSocket('ws://localhost:1323/ws')

			ws.onmessage = function(evt) {
				var out = document.getElementById('output');
				out.innerHTML += evt.data + '<br>';
			}
		</script>
	</body>
	</html>
`

func main() {
	name := os.Args[1]
	port := os.Args[2]
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.GET("/", func(c echo.Context) error {
		return c.HTML(http.StatusOK, fmt.Sprintf(index, name))
	})

	// WebSocket handler
	e.GET("/ws", func(c echo.Context) error {
		websocket.Handler(func(ws *websocket.Conn) {
			defer ws.Close()
			for {
				// Write
				err := websocket.Message.Send(ws, fmt.Sprintf("Hello from upstream server %s!", name))
				if err != nil {
					e.Logger.Error(err)
				}
				time.Sleep(1 * time.Second)
			}
		}).ServeHTTP(c.Response(), c.Request())
		return nil
	})

	e.Logger.Fatal(e.Start(port))
}

```

cookbook/reverse-proxy/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/url"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	// Setup proxy
	url1, err := url.Parse("http://localhost:8081")
	if err != nil {
		e.Logger.Fatal(err)
	}
	url2, err := url.Parse("http://localhost:8082")
	if err != nil {
		e.Logger.Fatal(err)
	}
	targets := []*middleware.ProxyTarget{
		{
			URL: url1,
		},
		{
			URL: url2,
		},
	}
	e.Use(middleware.Proxy(middleware.NewRoundRobinBalancer(targets)))

	e.Logger.Fatal(e.Start(":1323"))
}

```

- [1) Identify upstream target URL(s)](https://echo.labstack.com/docs/cookbook/reverse-proxy#1-identify-upstream-target-urls)
- [2) Setup proxy middleware with upstream targets](https://echo.labstack.com/docs/cookbook/reverse-proxy#2-setup-proxy-middleware-with-upstream-targets)
- [3) Start upstream servers](https://echo.labstack.com/docs/cookbook/reverse-proxy#3-start-upstream-servers)
- [4) Start the proxy server](https://echo.labstack.com/docs/cookbook/reverse-proxy#4-start-the-proxy-server)
- [Source Code](https://echo.labstack.com/docs/cookbook/reverse-proxy#source-code)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1437563850.1743203624&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102964102&z=706476144)

## SSE

[Skip to main content](https://echo.labstack.com/docs/cookbook/sse#__docusaurus_skipToContent_fallback)

On this page

[Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format) can be<br/>
used in different ways. This example here is per connection - per handler SSE. If your requirements need more complex<br/>
broadcasting logic see [https://github.com/r3labs/sse](https://github.com/r3labs/sse) library.

# Using SSE [​](https://echo.labstack.com/docs/cookbook/sse#using-sse "Direct link to Using SSE")

# Server [​](https://echo.labstack.com/docs/cookbook/sse#server "Direct link to Server")

cookbook/sse/simple/server.go

```codeBlockLines_e6Vv
package main

import (
	"errors"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"log"
	"net/http"
	"time"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.File("/", "./index.html")

	e.GET("/sse", func(c echo.Context) error {
		log.Printf("SSE client connected, ip: %v", c.RealIP())

		w := c.Response()
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-c.Request().Context().Done():
				log.Printf("SSE client disconnected, ip: %v", c.RealIP())
				return nil
			case <-ticker.C:
				event := Event{
					Data: []byte("time: " + time.Now().Format(time.RFC3339Nano)),
				}
				if err := event.MarshalTo(w); err != nil {
					return err
				}
				w.Flush()
			}
		}
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

# Event Structure and Marshal Method [​](https://echo.labstack.com/docs/cookbook/sse#event-structure-and-marshal-method "Direct link to Event structure and Marshal method")

cookbook/sse/simple/serversentevent.go

```codeBlockLines_e6Vv
package main

import (
	"bytes"
	"fmt"
	"io"
)

// Event represents Server-Sent Event.
// SSE explanation: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
type Event struct {
	// ID is used to set the EventSource object's last event ID value.
	ID []byte
	// Data field is for the message. When the EventSource receives multiple consecutive lines
	// that begin with data:, it concatenates them, inserting a newline character between each one.
	// Trailing newlines are removed.
	Data []byte
	// Event is a string identifying the type of event described. If this is specified, an event
	// will be dispatched on the browser to the listener for the specified event name; the website
	// source code should use addEventListener() to listen for named events. The onmessage handler
	// is called if no event name is specified for a message.
	Event []byte
	// Retry is the reconnection time. If the connection to the server is lost, the browser will
	// wait for the specified time before attempting to reconnect. This must be an integer, specifying
	// the reconnection time in milliseconds. If a non-integer value is specified, the field is ignored.
	Retry []byte
	// Comment line can be used to prevent connections from timing out; a server can send a comment
	// periodically to keep the connection alive.
	Comment []byte
}

// MarshalTo marshals Event to given Writer
func (ev *Event) MarshalTo(w io.Writer) error {
	// Marshalling part is taken from: https://github.com/r3labs/sse/blob/c6d5381ee3ca63828b321c16baa008fd6c0b4564/http.go#L16
	if len(ev.Data) == 0 && len(ev.Comment) == 0 {
		return nil
	}

	if len(ev.Data) > 0 {
		if _, err := fmt.Fprintf(w, "id: %s\n", ev.ID); err != nil {
			return err
		}

		sd := bytes.Split(ev.Data, []byte("\n"))
		for i := range sd {
			if _, err := fmt.Fprintf(w, "data: %s\n", sd[i]); err != nil {
				return err
			}
		}

		if len(ev.Event) > 0 {
			if _, err := fmt.Fprintf(w, "event: %s\n", ev.Event); err != nil {
				return err
			}
		}

		if len(ev.Retry) > 0 {
			if _, err := fmt.Fprintf(w, "retry: %s\n", ev.Retry); err != nil {
				return err
			}
		}
	}

	if len(ev.Comment) > 0 {
		if _, err := fmt.Fprintf(w, ": %s\n", ev.Comment); err != nil {
			return err
		}
	}

	if _, err := fmt.Fprint(w, "\n"); err != nil {
		return err
	}

	return nil
}

```

# HTML Serving SSE [​](https://echo.labstack.com/docs/cookbook/sse#html-serving-sse "Direct link to HTML serving SSE")

cookbook/sse/simple/index.html

```codeBlockLines_e6Vv
<!DOCTYPE html>
<html>
<body>

<h1>Getting server-sent updates</h1>
<div id="result"></div>

<script>
    // Example taken from: https://www.w3schools.com/html/html5_serversentevents.asp
    if (typeof (EventSource) !== "undefined") {
        const source = new EventSource("/sse");
        source.onmessage = function (event) {
            document.getElementById("result").innerHTML += event.data + "<br>";
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
    }
</script>

</body>
</html>

```

# Using 3rd Party Library [r3labs/sse](https://github.com/r3labs/sse) to Broadcast Events [​](https://echo.labstack.com/docs/cookbook/sse#using-3rd-party-library-r3labssse-to-broadcast-events "Direct link to using-3rd-party-library-r3labssse-to-broadcast-events")

# Server [​](https://echo.labstack.com/docs/cookbook/sse#server-1 "Direct link to Server")

cookbook/sse/broadcast/server.go

```codeBlockLines_e6Vv
package main

import (
	"errors"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/r3labs/sse/v2"
	"log"
	"net/http"
	"time"
)

func main() {
	e := echo.New()

	server := sse.New()             // create SSE broadcaster server
	server.AutoReplay = false       // do not replay messages for each new subscriber that connects
	_ = server.CreateStream("time") // EventSource in "index.html" connecting to stream named "time"

	go func(s *sse.Server) {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				s.Publish("time", &sse.Event{
					Data: []byte("time: " + time.Now().Format(time.RFC3339Nano)),
				})
			}
		}
	}(server)

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.File("/", "./index.html")

	//e.GET("/sse", echo.WrapHandler(server))

	e.GET("/sse", func(c echo.Context) error { // longer variant with disconnect logic
		log.Printf("The client is connected: %v\n", c.RealIP())
		go func() {
			<-c.Request().Context().Done() // Received Browser Disconnection
			log.Printf("The client is disconnected: %v\n", c.RealIP())
			return
		}()

		server.ServeHTTP(c.Response(), c.Request())
		return nil
	})

	if err := e.Start(":8080"); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

```

# HTML Serving SSE [​](https://echo.labstack.com/docs/cookbook/sse#html-serving-sse-1 "Direct link to HTML serving SSE")

cookbook/sse/broadcast/index.html

```codeBlockLines_e6Vv
<!DOCTYPE html>
<html>
<body>

<h1>Getting server-sent updates</h1>
<div id="result"></div>

<script>
    // Example taken from: https://www.w3schools.com/html/html5_serversentevents.asp
    if (typeof (EventSource) !== "undefined") {
        const source = new EventSource("/sse?stream=time");
        source.onmessage = function (event) {
            document.getElementById("result").innerHTML += event.data + "<br>";
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
    }
</script>

</body>
</html>

```

- [Using SSE](https://echo.labstack.com/docs/cookbook/sse#using-sse)
  - [Server](https://echo.labstack.com/docs/cookbook/sse#server)
  - [Event structure and Marshal method](https://echo.labstack.com/docs/cookbook/sse#event-structure-and-marshal-method)
  - [HTML serving SSE](https://echo.labstack.com/docs/cookbook/sse#html-serving-sse)
- [Using 3rd party library r3labs/sse to broadcast events](https://echo.labstack.com/docs/cookbook/sse#using-3rd-party-library-r3labssse-to-broadcast-events)
  - [Server](https://echo.labstack.com/docs/cookbook/sse#server-1)
  - [HTML serving SSE](https://echo.labstack.com/docs/cookbook/sse#html-serving-sse-1)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1128029573.1743203646&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062&z=438097884)

## Streaming Response

[Skip to main content](https://echo.labstack.com/docs/cookbook/streaming-response#__docusaurus_skipToContent_fallback)

On this page

- Send data as it is produced
- Streaming JSON response with chunked transfer encoding

# Server [​](https://echo.labstack.com/docs/cookbook/streaming-response#server "Direct link to Server")

cookbook/streaming-response/server.go

```codeBlockLines_e6Vv
package main

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type (
	Geolocation struct {
		Altitude  float64
		Latitude  float64
		Longitude float64
	}
)

var (
	locations = []Geolocation{
		{-97, 37.819929, -122.478255},
		{1899, 39.096849, -120.032351},
		{2619, 37.865101, -119.538329},
		{42, 33.812092, -117.918974},
		{15, 37.77493, -122.419416},
	}
)

func main() {
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		c.Response().WriteHeader(http.StatusOK)

		enc := json.NewEncoder(c.Response())
		for _, l := range locations {
			if err := enc.Encode(l); err != nil {
				return err
			}
			c.Response().Flush()
			time.Sleep(1 * time.Second)
		}
		return nil
	})
	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/streaming-response#client "Direct link to Client")

```codeBlockLines_e6Vv
$ curl localhost:1323

```

# Output [​](https://echo.labstack.com/docs/cookbook/streaming-response#output "Direct link to Output")

```codeBlockLines_e6Vv
{"Altitude":-97,"Latitude":37.819929,"Longitude":-122.478255}
{"Altitude":1899,"Latitude":39.096849,"Longitude":-120.032351}
{"Altitude":2619,"Latitude":37.865101,"Longitude":-119.538329}
{"Altitude":42,"Latitude":33.812092,"Longitude":-117.918974}
{"Altitude":15,"Latitude":37.77493,"Longitude":-122.419416}

```

- [Server](https://echo.labstack.com/docs/cookbook/streaming-response#server)
- [Client](https://echo.labstack.com/docs/cookbook/streaming-response#client)
  - [Output](https://echo.labstack.com/docs/cookbook/streaming-response#output)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1621969609.1743203603&gtm=45je53r0h2v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062&z=2034668102)

## Subdomain

[Skip to main content](https://echo.labstack.com/docs/cookbook/subdomain#__docusaurus_skipToContent_fallback)

On this page

# Server [​](https://echo.labstack.com/docs/cookbook/subdomain#server "Direct link to Server")

cookbook/subdomain/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type (
	Host struct {
		Echo *echo.Echo
	}
)

func main() {
	// Hosts
	hosts := map[string]*Host{}

	//-----
	// API
	//-----

	api := echo.New()
	api.Use(middleware.Logger())
	api.Use(middleware.Recover())

	hosts["api.localhost:1323"] = &Host{api}

	api.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "API")
	})

	//------
	// Blog
	//------

	blog := echo.New()
	blog.Use(middleware.Logger())
	blog.Use(middleware.Recover())

	hosts["blog.localhost:1323"] = &Host{blog}

	blog.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Blog")
	})

	//---------
	// Website
	//---------

	site := echo.New()
	site.Use(middleware.Logger())
	site.Use(middleware.Recover())

	hosts["localhost:1323"] = &Host{site}

	site.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Website")
	})

	// Server
	e := echo.New()
	e.Any("/*", func(c echo.Context) (err error) {
		req := c.Request()
		res := c.Response()
		host := hosts[req.Host]

		if host == nil {
			err = echo.ErrNotFound
		} else {
			host.Echo.ServeHTTP(res, req)
		}

		return
	})
	e.Logger.Fatal(e.Start(":1323"))
}

```

- [Server](https://echo.labstack.com/docs/cookbook/subdomain#server)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=447565884.1743203610&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887799~102926062&z=1224105056)

## Timeout

[Skip to main content](https://echo.labstack.com/docs/cookbook/timeout#__docusaurus_skipToContent_fallback)

On this page

# Server [​](https://echo.labstack.com/docs/cookbook/timeout#server "Direct link to Server")

cookbook/timeout/server.go

```codeBlockLines_e6Vv
package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 5 * time.Second,
	}))

	// Route => handler
	e.GET("/", func(c echo.Context) error {
		time.Sleep(10 * time.Second)
		return c.String(http.StatusOK, "Hello, World!\n")
	})

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

```

- [Server](https://echo.labstack.com/docs/cookbook/timeout#server)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1499104526.1743203617&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509683~102788824~102803279~102813109~102887800~102926062&z=1954257591)

## Twitter

[Skip to main content](https://echo.labstack.com/docs/cookbook/twitter#__docusaurus_skipToContent_fallback)

On this page

This recipe demonstrates how to create a Twitter like REST API using MongoDB (Database),<br/>
JWT (API security) and JSON (Data exchange).

# Models [​](https://echo.labstack.com/docs/cookbook/twitter#models "Direct link to Models")

cookbook/twitter/model/user.go

```codeBlockLines_e6Vv
package model

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	User struct {
		ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
		Email     string        `json:"email" bson:"email"`
		Password  string        `json:"password,omitempty" bson:"password"`
		Token     string        `json:"token,omitempty" bson:"-"`
		Followers []string      `json:"followers,omitempty" bson:"followers,omitempty"`
	}
)

```

cookbook/twitter/model/post.go

```codeBlockLines_e6Vv
package model

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	Post struct {
		ID      bson.ObjectId `json:"id" bson:"_id,omitempty"`
		To      string        `json:"to" bson:"to"`
		From    string        `json:"from" bson:"from"`
		Message string        `json:"message" bson:"message"`
	}
)

```

# Handlers [​](https://echo.labstack.com/docs/cookbook/twitter#handlers "Direct link to Handlers")

cookbook/twitter/handler/handler.go

```codeBlockLines_e6Vv
package handler

import (
	"gopkg.in/mgo.v2"
)

type (
	Handler struct {
		DB *mgo.Session
	}
)

const (
	// Key (Should come from somewhere else).
	Key = "secret"
)

```

cookbook/twitter/handler/user.go

```codeBlockLines_e6Vv
package handler

import (
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echox/cookbook/twitter/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (h *Handler) Signup(c echo.Context) (err error) {
	// Bind
	u := &model.User{ID: bson.NewObjectId()}
	if err = c.Bind(u); err != nil {
		return
	}

	// Validate
	if u.Email == "" || u.Password == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid email or password"}
	}

	// Save user
	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB("twitter").C("users").Insert(u); err != nil {
		return
	}

	return c.JSON(http.StatusCreated, u)
}

func (h *Handler) Login(c echo.Context) (err error) {
	// Bind
	u := new(model.User)
	if err = c.Bind(u); err != nil {
		return
	}

	// Find user
	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB("twitter").C("users").
		Find(bson.M{"email": u.Email, "password": u.Password}).One(u); err != nil {
		if err == mgo.ErrNotFound {
			return &echo.HTTPError{Code: http.StatusUnauthorized, Message: "invalid email or password"}
		}
		return
	}

	//-----
	// JWT
	//-----

	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = u.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	// Generate encoded token and send it as response
	u.Token, err = token.SignedString([]byte(Key))
	if err != nil {
		return err
	}

	u.Password = "" // Don't send password
	return c.JSON(http.StatusOK, u)
}

func (h *Handler) Follow(c echo.Context) (err error) {
	userID := userIDFromToken(c)
	id := c.Param("id")

	// Add a follower to user
	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB("twitter").C("users").
		UpdateId(bson.ObjectIdHex(id), bson.M{"$addToSet": bson.M{"followers": userID}}); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}
	}

	return
}

func userIDFromToken(c echo.Context) string {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	return claims["id"].(string)
}

```

cookbook/twitter/handler/post.go

```codeBlockLines_e6Vv
package handler

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echox/cookbook/twitter/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (h *Handler) CreatePost(c echo.Context) (err error) {
	u := &model.User{
		ID: bson.ObjectIdHex(userIDFromToken(c)),
	}
	p := &model.Post{
		ID:   bson.NewObjectId(),
		From: u.ID.Hex(),
	}
	if err = c.Bind(p); err != nil {
		return
	}

	// Validation
	if p.To == "" || p.Message == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid to or message fields"}
	}

	// Find user from database
	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB("twitter").C("users").FindId(u.ID).One(u); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}
		return
	}

	// Save post in database
	if err = db.DB("twitter").C("posts").Insert(p); err != nil {
		return
	}
	return c.JSON(http.StatusCreated, p)
}

func (h *Handler) FetchPost(c echo.Context) (err error) {
	userID := userIDFromToken(c)
	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	// Defaults
	if page == 0 {
		page = 1
	}
	if limit == 0 {
		limit = 100
	}

	// Retrieve posts from database
	posts := []*model.Post{}
	db := h.DB.Clone()
	if err = db.DB("twitter").C("posts").
		Find(bson.M{"to": userID}).
		Skip((page - 1) * limit).
		Limit(limit).
		All(&posts); err != nil {
		return
	}
	defer db.Close()

	return c.JSON(http.StatusOK, posts)
}

```

# Server [​](https://echo.labstack.com/docs/cookbook/twitter#server "Direct link to Server")

cookbook/twitter/server.go

```codeBlockLines_e6Vv
package main

import (
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/echox/cookbook/twitter/handler"
	"github.com/labstack/gommon/log"
	"gopkg.in/mgo.v2"
)

func main() {
	e := echo.New()
	e.Logger.SetLevel(log.ERROR)
	e.Use(middleware.Logger())
	e.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey: []byte(handler.Key),
		Skipper: func(c echo.Context) bool {
			// Skip authentication for signup and login requests
			if c.Path() == "/login" || c.Path() == "/signup" {
				return true
			}
			return false
		},
	}))

	// Database connection
	db, err := mgo.Dial("localhost")
	if err != nil {
		e.Logger.Fatal(err)
	}

	// Create indices
	if err = db.Copy().DB("twitter").C("users").EnsureIndex(mgo.Index{
		Key:    []string{"email"},
		Unique: true,
	}); err != nil {
		log.Fatal(err)
	}

	// Initialize handler
	h := &handler.Handler{DB: db}

	// Routes
	e.POST("/signup", h.Signup)
	e.POST("/login", h.Login)
	e.POST("/follow/:id", h.Follow)
	e.POST("/posts", h.CreatePost)
	e.GET("/feed", h.FetchPost)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

```

# API [​](https://echo.labstack.com/docs/cookbook/twitter#api "Direct link to API")

# Signup [​](https://echo.labstack.com/docs/cookbook/twitter#signup "Direct link to Signup")

User signup

- Retrieve user credentials from the body and validate against database.
- For invalid email or password, send `400 - Bad Request` response.
- For valid email and password, save user in database and send `201 - Created` response.

## Request [​](https://echo.labstack.com/docs/cookbook/twitter#request "Direct link to Request")

```codeBlockLines_e6Vv
curl \
  -X POST \
  http://localhost:1323/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"jon@labstack.com","password":"shhh!"}'

```

## Response [​](https://echo.labstack.com/docs/cookbook/twitter#response "Direct link to Response")

`201 - Created`

```codeBlockLines_e6Vv
{
  "id": "58465b4ea6fe886d3215c6df",
  "email": "jon@labstack.com",
  "password": "shhh!"
}

```

# Login [​](https://echo.labstack.com/docs/cookbook/twitter#login "Direct link to Login")

User login

- Retrieve user credentials from the body and validate against database.
- For invalid credentials, send `401 - Unauthorized` response.
- For valid credentials, send `200 - OK` response:
  - Generate JWT for the user and send it as response.
  - Each subsequent request must include JWT in the `Authorization` header.

`POST` `/login`

## Request [​](https://echo.labstack.com/docs/cookbook/twitter#request-1 "Direct link to Request")

```codeBlockLines_e6Vv
curl \
  -X POST \
  http://localhost:1323/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jon@labstack.com","password":"shhh!"}'

```

## Response [​](https://echo.labstack.com/docs/cookbook/twitter#response-1 "Direct link to Response")

`200 - OK`

```codeBlockLines_e6Vv
{
  "id": "58465b4ea6fe886d3215c6df",
  "email": "jon@labstack.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODEyNjUxMjgsImlkIjoiNTg0NjViNGVhNmZlODg2ZDMyMTVjNmRmIn0.1IsGGxko1qMCsKkJDQ1NfmrZ945XVC9uZpcvDnKwpL0"
}

```

tip

Client should store the token, for browsers, you may use local storage.

# Follow [​](https://echo.labstack.com/docs/cookbook/twitter#follow "Direct link to Follow")

Follow a user

- For invalid token, send `400 - Bad Request` response.
- For valid token:
  - If user is not found, send `404 - Not Found` response.
  - Add a follower to the specified user in the path parameter and send `200 - OK` response.

`POST` `/follow/:id`

## Request [​](https://echo.labstack.com/docs/cookbook/twitter#request-2 "Direct link to Request")

```codeBlockLines_e6Vv
curl \
  -X POST \
  http://localhost:1323/follow/58465b4ea6fe886d3215c6df \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODEyNjUxMjgsImlkIjoiNTg0NjViNGVhNmZlODg2ZDMyMTVjNmRmIn0.1IsGGxko1qMCsKkJDQ1NfmrZ945XVC9uZpcvDnKwpL0"

```

## Response [​](https://echo.labstack.com/docs/cookbook/twitter#response-2 "Direct link to Response")

`200 - OK`

# Post [​](https://echo.labstack.com/docs/cookbook/twitter#post "Direct link to Post")

Post a message to specified user

- For invalid request payload, send `400 - Bad Request` response.
- If user is not found, send `404 - Not Found` response.
- Otherwise save post in the database and return it via `201 - Created` response.

`POST` `/posts`

## Request [​](https://echo.labstack.com/docs/cookbook/twitter#request-3 "Direct link to Request")

```codeBlockLines_e6Vv
curl \
  -X POST \
  http://localhost:1323/posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODEyNjUxMjgsImlkIjoiNTg0NjViNGVhNmZlODg2ZDMyMTVjNmRmIn0.1IsGGxko1qMCsKkJDQ1NfmrZ945XVC9uZpcvDnKwpL0" \
  -H "Content-Type: application/json" \
  -d '{"to":"58465b4ea6fe886d3215c6df","message":"hello"}'

```

## Response [​](https://echo.labstack.com/docs/cookbook/twitter#response-3 "Direct link to Response")

`201 - Created`

```codeBlockLines_e6Vv
{
  "id": "584661b9a6fe8871a3804cba",
  "to": "58465b4ea6fe886d3215c6df",
  "from": "58465b4ea6fe886d3215c6df",
  "message": "hello"
}

```

# Feed [​](https://echo.labstack.com/docs/cookbook/twitter#feed "Direct link to Feed")

List most recent messages based on optional `page` and `limit` query parameters

`GET` `/feed?page=1&limit=5`

## Request [​](https://echo.labstack.com/docs/cookbook/twitter#request-4 "Direct link to Request")

```codeBlockLines_e6Vv
curl \
  -X GET \
  http://localhost:1323/feed \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODEyNjUxMjgsImlkIjoiNTg0NjViNGVhNmZlODg2ZDMyMTVjNmRmIn0.1IsGGxko1qMCsKkJDQ1NfmrZ945XVC9uZpcvDnKwpL0"

```

## Response [​](https://echo.labstack.com/docs/cookbook/twitter#response-4 "Direct link to Response")

`200 - OK`

```codeBlockLines_e6Vv
[\
  {\
    "id": "584661b9a6fe8871a3804cba",\
    "to": "58465b4ea6fe886d3215c6df",\
    "from": "58465b4ea6fe886d3215c6df",\
    "message": "hello"\
  }\
]

```

- [Models](https://echo.labstack.com/docs/cookbook/twitter#models)
- [Handlers](https://echo.labstack.com/docs/cookbook/twitter#handlers)
- [Server](https://echo.labstack.com/docs/cookbook/twitter#server)
- [API](https://echo.labstack.com/docs/cookbook/twitter#api)
  - [Signup](https://echo.labstack.com/docs/cookbook/twitter#signup)
  - [Login](https://echo.labstack.com/docs/cookbook/twitter#login)
  - [Follow](https://echo.labstack.com/docs/cookbook/twitter#follow)
  - [Post](https://echo.labstack.com/docs/cookbook/twitter#post)
  - [Feed](https://echo.labstack.com/docs/cookbook/twitter#feed)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=755466690.1743203642&gtm=45je53q1h1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102788824~102803279~102813109~102887800~102926062~102964102~102975948&z=1609005070)

## Websocket

[Skip to main content](https://echo.labstack.com/docs/cookbook/websocket#__docusaurus_skipToContent_fallback)

On this page

# Using Net WebSocket [​](https://echo.labstack.com/docs/cookbook/websocket#using-net-websocket "Direct link to Using net WebSocket")

# Server [​](https://echo.labstack.com/docs/cookbook/websocket#server "Direct link to Server")

cookbook/websocket/net/server.go

```codeBlockLines_e6Vv
package main

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/net/websocket"
)

func hello(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		for {
			// Write
			err := websocket.Message.Send(ws, "Hello, Client!")
			if err != nil {
				c.Logger().Error(err)
			}

			// Read
			msg := ""
			err = websocket.Message.Receive(ws, &msg)
			if err != nil {
				c.Logger().Error(err)
			}
			fmt.Printf("%s\n", msg)
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Static("/", "../public")
	e.GET("/ws", hello)
	e.Logger.Fatal(e.Start(":1323"))
}

```

# Using Gorilla WebSocket [​](https://echo.labstack.com/docs/cookbook/websocket#using-gorilla-websocket "Direct link to Using gorilla WebSocket")

# Server [​](https://echo.labstack.com/docs/cookbook/websocket#server-1 "Direct link to Server")

cookbook/websocket/gorilla/server.go

```codeBlockLines_e6Vv
package main

import (
	"fmt"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	upgrader = websocket.Upgrader{}
)

func hello(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	for {
		// Write
		err := ws.WriteMessage(websocket.TextMessage, []byte("Hello, Client!"))
		if err != nil {
			c.Logger().Error(err)
		}

		// Read
		_, msg, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error(err)
		}
		fmt.Printf("%s\n", msg)
	}
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Static("/", "../public")
	e.GET("/ws", hello)
	e.Logger.Fatal(e.Start(":1323"))
}

```

# Client [​](https://echo.labstack.com/docs/cookbook/websocket#client "Direct link to Client")

cookbook/websocket/public/index.html

```codeBlockLines_e6Vv
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>WebSocket</title>
</head>

<body>
  <p id="output"></p>

  <script>
    var loc = window.location;
    var uri = 'ws:';

    if (loc.protocol === 'https:') {
      uri = 'wss:';
    }
    uri += '//' + loc.host;
    uri += loc.pathname + 'ws';

    ws = new WebSocket(uri)

    ws.onopen = function() {
      console.log('Connected')
    }

    ws.onmessage = function(evt) {
      var out = document.getElementById('output');
      out.innerHTML += evt.data + '<br>';
    }

    setInterval(function() {
      ws.send('Hello, Server!');
    }, 1000);
  </script>
</body>

</html>

```

# Output [​](https://echo.labstack.com/docs/cookbook/websocket#output "Direct link to Output")

```codeBlockLines_e6Vv
Hello, Client!
Hello, Client!
Hello, Client!
Hello, Client!
Hello, Client!

```

```codeBlockLines_e6Vv
Hello, Server!
Hello, Server!
Hello, Server!
Hello, Server!
Hello, Server!

```

- [Using net WebSocket](https://echo.labstack.com/docs/cookbook/websocket#using-net-websocket)
  - [Server](https://echo.labstack.com/docs/cookbook/websocket#server)
- [Using gorilla WebSocket](https://echo.labstack.com/docs/cookbook/websocket#using-gorilla-websocket)
  - [Server](https://echo.labstack.com/docs/cookbook/websocket#server-1)
- [Client](https://echo.labstack.com/docs/cookbook/websocket#client)
- [Output](https://echo.labstack.com/docs/cookbook/websocket#output)

[iframe](https://td.doubleclick.net/td/ga/rul?tid=G-H19TMZLQFN&gacid=1342244037.1743203707&gtm=45je53q1v9133279001za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=102482433~102509682~102788824~102803279~102813109~102887800~102926062&z=569727374)
