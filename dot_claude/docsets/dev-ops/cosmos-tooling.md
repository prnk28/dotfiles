---
tags:
  - "#documentation"
  - "#programming"
  - "#configuration-language"
  - "#protocol-buffers"
  - "#code-generation"
  - "#developer-tools"
---
# Confix

# Confix

`Confix` is a configuration management tool that allows you to manage your configuration via CLI.

It is based on the [CometBFT RFC 019](https://github.com/cometbft/cometbft/blob/5013bc3f4a6d64dcc2bf02ccc002ebc9881c62e4/docs/rfc/rfc-019-config-version.md).

## Installation [​](https://docs.cosmos.network/v0.50/build/tooling/confix#installation "Direct link to Installation")

### Add Config Command [​](https://docs.cosmos.network/v0.50/build/tooling/confix#add-config-command "Direct link to Add Config Command")

To add the confix tool, it's required to add the `ConfigCommand` to your application's root command file (e.g. `<appd>/cmd/root.go`).

Import the `confixCmd` package:

```codeBlockLines_e6Vv
import "cosmossdk.io/tools/confix/cmd"

```

Find the following line:

```codeBlockLines_e6Vv
initRootCmd(rootCmd, encodingConfig)

```

After that line, add the following:

```codeBlockLines_e6Vv
rootCmd.AddCommand(
    confixcmd.ConfigCommand(),
)

```

The `ConfixCommand` function builds the `config` root command and is defined in the `confixCmd` package (`cosmossdk.io/tools/confix/cmd`).<br/>
An implementation example can be found in `simapp`.

The command will be available as `simd config`.

### Using Confix Standalone [​](https://docs.cosmos.network/v0.50/build/tooling/confix#using-confix-standalone "Direct link to Using Confix Standalone")

To use Confix standalone, without having to add it in your application, install it with the following command:

```codeBlockLines_e6Vv
go install cosmossdk.io/tools/confix/cmd/confix@latest

```

Alternatively, for building from source, simply run `make confix`. The binary will be located in `tools/confix`.

## Usage [​](https://docs.cosmos.network/v0.50/build/tooling/confix#usage "Direct link to Usage")

Use standalone:

```codeBlockLines_e6Vv
confix --help

```

Use in simd:

```codeBlockLines_e6Vv
simd config fix --help

```

### Get [​](https://docs.cosmos.network/v0.50/build/tooling/confix#get "Direct link to Get")

Get a configuration value, e.g.:

```codeBlockLines_e6Vv
simd config get app pruning # gets the value pruning from app.toml
simd config get client chain-id # gets the value chain-id from client.toml

```

```codeBlockLines_e6Vv
confix get ~/.simapp/config/app.toml pruning # gets the value pruning from app.toml
confix get ~/.simapp/config/client.toml chain-id # gets the value chain-id from client.toml

```

### Set [​](https://docs.cosmos.network/v0.50/build/tooling/confix#set "Direct link to Set")

Set a configuration value, e.g.:

```codeBlockLines_e6Vv
simd config set app pruning "enabled" # sets the value pruning from app.toml
simd config set client chain-id "foo-1" # sets the value chain-id from client.toml

```

```codeBlockLines_e6Vv
confix set ~/.simapp/config/app.toml pruning "enabled" # sets the value pruning from app.toml
confix set ~/.simapp/config/client.toml chain-id "foo-1" # sets the value chain-id from client.toml

```

### Migrate [​](https://docs.cosmos.network/v0.50/build/tooling/confix#migrate "Direct link to Migrate")

Migrate a configuration file to a new version, e.g.:

```codeBlockLines_e6Vv
simd config migrate v0.47 # migrates defaultHome/config/app.toml to the latest v0.47 config

```

```codeBlockLines_e6Vv
confix migrate v0.47 ~/.simapp/config/app.toml # migrate ~/.simapp/config/app.toml to the latest v0.47 config

```

### Diff [​](https://docs.cosmos.network/v0.50/build/tooling/confix#diff "Direct link to Diff")

Get the diff between a given configuration file and the default configuration file, e.g.:

```codeBlockLines_e6Vv
simd config diff v0.47 # gets the diff between defaultHome/config/app.toml and the latest v0.47 config

```

```codeBlockLines_e6Vv
confix diff v0.47 ~/.simapp/config/app.toml # gets the diff between ~/.simapp/config/app.toml and the latest v0.47 config

```

### View [​](https://docs.cosmos.network/v0.50/build/tooling/confix#view "Direct link to View")

View a configuration file, e.g:

```codeBlockLines_e6Vv
simd config view client # views the current app client config

```

```codeBlockLines_e6Vv
confix view ~/.simapp/config/client.toml # views the current app client conf

```

### Maintainer [​](https://docs.cosmos.network/v0.50/build/tooling/confix#maintainer "Direct link to Maintainer")

At each SDK modification of the default configuration, add the default SDK config under `data/v0.XX-app.toml`.<br/>
This allows users to use the tool standalone.

## Credits [​](https://docs.cosmos.network/v0.50/build/tooling/confix#credits "Direct link to Credits")

This project is based on the [CometBFT RFC 019](https://github.com/cometbft/cometbft/blob/5013bc3f4a6d64dcc2bf02ccc002ebc9881c62e4/docs/rfc/rfc-019-config-version.md) and their own implementation of [confix](https://github.com/cometbft/cometbft/blob/v0.36.x/scripts/confix/confix.go).

- [Installation](https://docs.cosmos.network/v0.50/build/tooling/confix#installation)
  - [Add Config Command](https://docs.cosmos.network/v0.50/build/tooling/confix#add-config-command)
  - [Using Confix Standalone](https://docs.cosmos.network/v0.50/build/tooling/confix#using-confix-standalone)
- [Usage](https://docs.cosmos.network/v0.50/build/tooling/confix#usage)
  - [Get](https://docs.cosmos.network/v0.50/build/tooling/confix#get)
  - [Set](https://docs.cosmos.network/v0.50/build/tooling/confix#set)
  - [Migrate](https://docs.cosmos.network/v0.50/build/tooling/confix#migrate)
  - [Diff](https://docs.cosmos.network/v0.50/build/tooling/confix#diff)
  - [View](https://docs.cosmos.network/v0.50/build/tooling/confix#view)
  - [Maintainer](https://docs.cosmos.network/v0.50/build/tooling/confix#maintainer)
- [Credits](https://docs.cosmos.network/v0.50/build/tooling/confix#credits)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=pjj3qffmdnlo)

### Cosmovisor

# Cosmovisor

`cosmovisor` is a process manager for Cosmos SDK application binaries that automates application binary switch at chain upgrades.<br/>
It polls the `upgrade-info.json` file that is created by the x/upgrade module at upgrade height, and then can automatically download the new binary, stop the current binary, switch from the old binary to the new one, and finally restart the node with the new binary.

- [Cosmovisor](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#cosmovisor)
  - [Design](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#design)
  - [Contributing](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#contributing)
  - [Setup](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#setup)
    - [Installation](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#installation)
    - [Command Line Arguments And Environment Variables](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#command-line-arguments-and-environment-variables)
    - [Folder Layout](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#folder-layout)
  - [Usage](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#usage)
    - [Initialization](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#initialization)
    - [Detecting Upgrades](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#detecting-upgrades)
    - [Auto-Download](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#auto-download)
  - [Example: SimApp Upgrade](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#example-simapp-upgrade)
    - [Chain Setup](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#chain-setup)
      - [Prepare Cosmovisor and Start the Chain](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#prepare-cosmovisor-and-start-the-chain)
      - [Update App](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#update-app)

## Design [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#design "Direct link to Design")

Cosmovisor is designed to be used as a wrapper for a `Cosmos SDK` app:

- it will pass arguments to the associated app (configured by `DAEMON_NAME` env variable).<br/>
  Running `cosmovisor run arg1 arg2 ….` will run `app arg1 arg2 …`;
- it will manage an app by restarting and upgrading if needed;
- it is configured using environment variables, not positional arguments.

_Note: If new versions of the application are not set up to run in-place store migrations, migrations will need to be run manually before restarting `cosmovisor` with the new binary. For this reason, we recommend applications adopt in-place store migrations._

tip

Only the lastest version of cosmovisor is actively developed/maintained.

danger

Versions prior to v1.0.0 have a vulnerability that could lead to a DOS. Please upgrade to the latest version.

## Contributing [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#contributing "Direct link to Contributing")

Cosmovisor is part of the Cosmos SDK monorepo, but it's a separate module with it's own release schedule.

Release branches have the following format `release/cosmovisor/vA.B.x`, where A and B are a number (e.g. `release/cosmovisor/v1.3.x`). Releases are tagged using the following format: `cosmovisor/vA.B.C`.

## Setup [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#setup "Direct link to Setup")

### Installation [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#installation "Direct link to Installation")

You can download Cosmovisor from the [GitHub releases](https://github.com/cosmos/cosmos-sdk/releases/tag/cosmovisor%2Fv1.3.0).

To install the latest version of `cosmovisor`, run the following command:

```codeBlockLines_e6Vv
go install cosmossdk.io/tools/cosmovisor/cmd/cosmovisor@latest

```

To install a previous version, you can specify the version. IMPORTANT: Chains that use Cosmos SDK v0.44.3 or earlier (eg v0.44.2) and want to use auto-download feature MUST use `cosmovisor v0.1.0`

```codeBlockLines_e6Vv
go install github.com/cosmos/cosmos-sdk/cosmovisor/cmd/cosmovisor@v0.1.0

```

Run `cosmovisor version` to check the cosmovisor version.

Alternatively, for building from source, simply run `make cosmovisor`. The binary will be located in `tools/cosmovisor`.

danger

Building from source using `make cosmovisor` won't display the correct `cosmovisor` version.

### Command Line Arguments And Environment Variables [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#command-line-arguments-and-environment-variables "Direct link to Command Line Arguments And Environment Variables")

The first argument passed to `cosmovisor` is the action for `cosmovisor` to take. Options are:

- `help`, `--help`, or `-h` \- Output `cosmovisor` help information and check your `cosmovisor` configuration.
- `run` \- Run the configured binary using the rest of the provided arguments.
- `version` \- Output the `cosmovisor` version and also run the binary with the `version` argument.
- `config` \- Display the current `cosmovisor` configuration, that means displaying the environment variables value that `cosmovisor` is using.
- `add-upgrade` \- Add an upgrade manually to `cosmovisor`.

All arguments passed to `cosmovisor run` will be passed to the application binary (as a subprocess). `cosmovisor` will return `/dev/stdout` and `/dev/stderr` of the subprocess as its own. For this reason, `cosmovisor run` cannot accept any command-line arguments other than those available to the application binary.

danger

Use of `cosmovisor` without one of the action arguments is deprecated. For backwards compatibility, if the first argument is not an action argument, `run` is assumed. However, this fallback might be removed in future versions, so it is recommended that you always provide `run`.

`cosmovisor` reads its configuration from environment variables:

- `DAEMON_HOME` is the location where the `cosmovisor/` directory is kept that contains the genesis binary, the upgrade binaries, and any additional auxiliary files associated with each binary (e.g. `$HOME/.gaiad`, `$HOME/.regend`, `$HOME/.simd`, etc.).
- `DAEMON_NAME` is the name of the binary itself (e.g. `gaiad`, `regend`, `simd`, etc.).
- `DAEMON_ALLOW_DOWNLOAD_BINARIES` (_optional_), if set to `true`, will enable auto-downloading of new binaries (for security reasons, this is intended for full nodes rather than validators). By default, `cosmovisor` will not auto-download new binaries.
- `DAEMON_RESTART_AFTER_UPGRADE` (_optional_, default = `true`), if `true`, restarts the subprocess with the same command-line arguments and flags (but with the new binary) after a successful upgrade. Otherwise (`false`), `cosmovisor` stops running after an upgrade and requires the system administrator to manually restart it. Note restart is only after the upgrade and does not auto-restart the subprocess after an error occurs.
- `DAEMON_RESTART_DELAY` (_optional_, default none), allow a node operator to define a delay between the node halt (for upgrade) and backup by the specified time. The value must be a duration (e.g. `1s`).
- `DAEMON_POLL_INTERVAL` (_optional_, default 300 milliseconds), is the interval length for polling the upgrade plan file. The value must be a duration (e.g. `1s`).
- `DAEMON_DATA_BACKUP_DIR` option to set a custom backup directory. If not set, `DAEMON_HOME` is used.
- `UNSAFE_SKIP_BACKUP` (defaults to `false`), if set to `true`, upgrades directly without performing a backup. Otherwise (`false`, default) backs up the data before trying the upgrade. The default value of false is useful and recommended in case of failures and when a backup needed to rollback. We recommend using the default backup option `UNSAFE_SKIP_BACKUP=false`.
- `DAEMON_PREUPGRADE_MAX_RETRIES` (defaults to `0`). The maximum number of times to call [`pre-upgrade`](https://docs.cosmos.network/main/building-apps/app-upgrade#pre-upgrade-handling) in the application after exit status of `31`. After the maximum number of retries, Cosmovisor fails the upgrade.
- `COSMOVISOR_DISABLE_LOGS` (defaults to `false`). If set to true, this will disable Cosmovisor logs (but not the underlying process) completely. This may be useful, for example, when a Cosmovisor subcommand you are executing returns a valid JSON you are then parsing, as logs added by Cosmovisor make this output not a valid JSON.

### Folder Layout [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#folder-layout "Direct link to Folder Layout")

`$DAEMON_HOME/cosmovisor` is expected to belong completely to `cosmovisor` and the subprocesses that are controlled by it. The folder content is organized as follows:

```codeBlockLines_e6Vv
.
├── current -> genesis or upgrades/<name>
├── genesis
│   └── bin
│       └── $DAEMON_NAME
└── upgrades
    └── <name>
        ├── bin
        │   └── $DAEMON_NAME
        └── upgrade-info.json

```

The `cosmovisor/` directory includes a subdirectory for each version of the application (i.e. `genesis` or `upgrades/<name>`). Within each subdirectory is the application binary (i.e. `bin/$DAEMON_NAME`) and any additional auxiliary files associated with each binary. `current` is a symbolic link to the currently active directory (i.e. `genesis` or `upgrades/<name>`). The `name` variable in `upgrades/<name>` is the lowercased URI-encoded name of the upgrade as specified in the upgrade module plan. Note that the upgrade name path are normalized to be lowercased: for instance, `MyUpgrade` is normalized to `myupgrade`, and its path is `upgrades/myupgrade`.

Please note that `$DAEMON_HOME/cosmovisor` only stores the _application binaries_. The `cosmovisor` binary itself can be stored in any typical location (e.g. `/usr/local/bin`). The application will continue to store its data in the default data directory (e.g. `$HOME/.simapp`) or the data directory specified with the `--home` flag. `$DAEMON_HOME` is independent of the data directory and can be set to any location. If you set `$DAEMON_HOME` to the same directory as the data directory, you will end up with a configuration like the following:

```codeBlockLines_e6Vv
.simapp
├── config
├── data
└── cosmovisor

```

## Usage [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#usage "Direct link to Usage")

The system administrator is responsible for:

- installing the `cosmovisor` binary
- configuring the host's init system (e.g. `systemd`, `launchd`, etc.)
- appropriately setting the environmental variables
- creating the `<DAEMON_HOME>/cosmovisor` directory
- creating the `<DAEMON_HOME>/cosmovisor/genesis/bin` folder
- creating the `<DAEMON_HOME>/cosmovisor/upgrades/<name>/bin` folders
- placing the different versions of the `<DAEMON_NAME>` executable in the appropriate `bin` folders.

`cosmovisor` will set the `current` link to point to `genesis` at first start (i.e. when no `current` link exists) and then handle switching binaries at the correct points in time so that the system administrator can prepare days in advance and relax at upgrade time.

In order to support downloadable binaries, a tarball for each upgrade binary will need to be packaged up and made available through a canonical URL. Additionally, a tarball that includes the genesis binary and all available upgrade binaries can be packaged up and made available so that all the necessary binaries required to sync a fullnode from start can be easily downloaded.

The `DAEMON` specific code and operations (e.g. cometBFT config, the application db, syncing blocks, etc.) all work as expected. The application binaries' directives such as command-line flags and environment variables also work as expected.

### Initialization [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#initialization "Direct link to Initialization")

The `cosmovisor init <path to executable>` command creates the folder structure required for using cosmovisor.

It does the following:

- creates the `<DAEMON_HOME>/cosmovisor` folder if it doesn't yet exist
- creates the `<DAEMON_HOME>/cosmovisor/genesis/bin` folder if it doesn't yet exist
- copies the provided executable file to `<DAEMON_HOME>/cosmovisor/genesis/bin/<DAEMON_NAME>`
- creates the `current` link, pointing to the `genesis` folder

It uses the `DAEMON_HOME` and `DAEMON_NAME` environment variables for folder location and executable name.

The `cosmovisor init` command is specifically for initializing cosmovisor, and should not be confused with a chain's `init` command (e.g. `cosmovisor run init`).

### Detecting Upgrades [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#detecting-upgrades "Direct link to Detecting Upgrades")

`cosmovisor` is polling the `$DAEMON_HOME/data/upgrade-info.json` file for new upgrade instructions. The file is created by the x/upgrade module in `BeginBlocker` when an upgrade is detected and the blockchain reaches the upgrade height.<br/>
The following heuristic is applied to detect the upgrade:

- When starting, `cosmovisor` doesn't know much about currently running upgrade, except the binary which is `current/bin/`. It tries to read the `current/update-info.json` file to get information about the current upgrade name.
- If neither `cosmovisor/current/upgrade-info.json` nor `data/upgrade-info.json` exist, then `cosmovisor` will wait for `data/upgrade-info.json` file to trigger an upgrade.
- If `cosmovisor/current/upgrade-info.json` doesn't exist but `data/upgrade-info.json` exists, then `cosmovisor` assumes that whatever is in `data/upgrade-info.json` is a valid upgrade request. In this case `cosmovisor` tries immediately to make an upgrade according to the `name` attribute in `data/upgrade-info.json`.
- Otherwise, `cosmovisor` waits for changes in `upgrade-info.json`. As soon as a new upgrade name is recorded in the file, `cosmovisor` will trigger an upgrade mechanism.

When the upgrade mechanism is triggered, `cosmovisor` will:

1. if `DAEMON_ALLOW_DOWNLOAD_BINARIES` is enabled, start by auto-downloading a new binary into `cosmovisor/<name>/bin` (where `<name>` is the `upgrade-info.json:name` attribute);
2. update the `current` symbolic link to point to the new directory and save `data/upgrade-info.json` to `cosmovisor/current/upgrade-info.json`.

### Auto-Download [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#auto-download "Direct link to Auto-Download")

Generally, `cosmovisor` requires that the system administrator place all relevant binaries on disk before the upgrade happens. However, for people who don't need such control and want an automated setup (maybe they are syncing a non-validating fullnode and want to do little maintenance), there is another option.

**NOTE: we don't recommend using auto-download** because it doesn't verify in advance if a binary is available. If there will be any issue with downloading a binary, the cosmovisor will stop and won't restart an App (which could lead to a chain halt).

If `DAEMON_ALLOW_DOWNLOAD_BINARIES` is set to `true`, and no local binary can be found when an upgrade is triggered, `cosmovisor` will attempt to download and install the binary itself based on the instructions in the `info` attribute in the `data/upgrade-info.json` file. The files is constructed by the x/upgrade module and contains data from the upgrade `Plan` object. The `Plan` has an info field that is expected to have one of the following two valid formats to specify a download:

1. Store an os/architecture -> binary URI map in the upgrade plan info field as JSON under the `"binaries"` key. For example:

```codeBlockLines_e6Vv
{
     "binaries": {
       "linux/amd64":"https://example.com/gaia.zip?checksum=sha256:aec070645fe53ee3b3763059376134f058cc337247c978add178b6ccdfb0019f"
     }
}

```

You can include multiple binaries at once to ensure more than one environment will receive the correct binaries:

```codeBlockLines_e6Vv
{
     "binaries": {
       "linux/amd64":"https://example.com/gaia.zip?checksum=sha256:aec070645fe53ee3b3763059376134f058cc337247c978add178b6ccdfb0019f",
       "linux/arm64":"https://example.com/gaia.zip?checksum=sha256:aec070645fe53ee3b3763059376134f058cc337247c978add178b6ccdfb0019f",
       "darwin/amd64":"https://example.com/gaia.zip?checksum=sha256:aec070645fe53ee3b3763059376134f058cc337247c978add178b6ccdfb0019f"
       }
}

```

When submitting this as a proposal ensure there are no spaces. An example command using `gaiad` could look like:

```codeBlockLines_e6Vv
> gaiad tx upgrade software-upgrade Vega \
   --title Vega \
   --deposit 100uatom \
   --upgrade-height 7368420 \
   --upgrade-info '{"binaries":{"linux/amd64":"https://github.com/cosmos/gaia/releases/download/v6.0.0-rc1/gaiad-v6.0.0-rc1-linux-amd64","linux/arm64":"https://github.com/cosmos/gaia/releases/download/v6.0.0-rc1/gaiad-v6.0.0-rc1-linux-arm64","darwin/amd64":"https://github.com/cosmos/gaia/releases/download/v6.0.0-rc1/gaiad-v6.0.0-rc1-darwin-amd64"}}' \
   --summary "upgrade to Vega" \
   --gas 400000 \
   --from user \
   --chain-id test \
   --home test/val2 \
   --node tcp://localhost:36657 \
   --yes

```

2. Store a link to a file that contains all information in the above format (e.g. if you want to specify lots of binaries, changelog info, etc. without filling up the blockchain). For example:

```codeBlockLines_e6Vv
https://example.com/testnet-1001-info.json?checksum=sha256:deaaa99fda9407c4dbe1d04bd49bab0cc3c1dd76fa392cd55a9425be074af01e

```

When `cosmovisor` is triggered to download the new binary, `cosmovisor` will parse the `"binaries"` field, download the new binary with [go-getter](https://github.com/hashicorp/go-getter), and unpack the new binary in the `upgrades/<name>` folder so that it can be run as if it was installed manually.

Note that for this mechanism to provide strong security guarantees, all URLs should include a SHA 256/512 checksum. This ensures that no false binary is run, even if someone hacks the server or hijacks the DNS. `go-getter` will always ensure the downloaded file matches the checksum if it is provided. `go-getter` will also handle unpacking archives into directories (in this case the download link should point to a `zip` file of all data in the `bin` directory).

To properly create a sha256 checksum on linux, you can use the `sha256sum` utility. For example:

```codeBlockLines_e6Vv
sha256sum ./testdata/repo/zip_directory/autod.zip

```

The result will look something like the following: `29139e1381b8177aec909fab9a75d11381cab5adf7d3af0c05ff1c9c117743a7`.

You can also use `sha512sum` if you would prefer to use longer hashes, or `md5sum` if you would prefer to use broken hashes. Whichever you choose, make sure to set the hash algorithm properly in the checksum argument to the URL.

## Example: SimApp Upgrade [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#example-simapp-upgrade "Direct link to Example: SimApp Upgrade")

The following instructions provide a demonstration of `cosmovisor` using the simulation application (`simapp`) shipped with the Cosmos SDK's source code. The following commands are to be run from within the `cosmos-sdk` repository.

### Chain Setup [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#chain-setup "Direct link to Chain Setup")

Let's create a new chain using the `v0.44` version of simapp (the Cosmos SDK demo app):

```codeBlockLines_e6Vv
git checkout v0.44.6
make build

```

Clean `~/.simapp` (never do this in a production environment):

```codeBlockLines_e6Vv
./build/simd unsafe-reset-all

```

Set up app config:

```codeBlockLines_e6Vv
./build/simd config set client chain-id test
./build/simd config set client keyring-backend test
./build/simd config set client broadcast-mode sync

```

Initialize the node and overwrite any previous genesis file (never do this in a production environment):

```codeBlockLines_e6Vv
./build/simd init test --chain-id test --overwrite

```

Set the minimum gas price to `0stake` in `~/.simapp/config/app.toml`:

```codeBlockLines_e6Vv
minimum-gas-prices = "0stake"

```

For the sake of this demonstration, amend `voting_period` in `genesis.json` to a reduced time of 20 seconds (`20s`):

```codeBlockLines_e6Vv
cat <<< $(jq '.app_state.gov.voting_params.voting_period = "20s"' $HOME/.simapp/config/genesis.json) > $HOME/.simapp/config/genesis.json

```

Create a validator, and setup genesis transaction:

```codeBlockLines_e6Vv
./build/simd keys add validator
./build/simd genesis add-genesis-account validator 1000000000stake --keyring-backend test
./build/simd genesis gentx validator 1000000stake --chain-id test
./build/simd genesis collect-gentxs

```

#### Prepare Cosmovisor and Start the Chain [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#prepare-cosmovisor-and-start-the-chain "Direct link to Prepare Cosmovisor and Start the Chain")

Set the required environment variables:

```codeBlockLines_e6Vv
export DAEMON_NAME=simd
export DAEMON_HOME=$HOME/.simapp

```

Set the optional environment variable to trigger an automatic app restart:

```codeBlockLines_e6Vv
export DAEMON_RESTART_AFTER_UPGRADE=true

```

Create the folder for the genesis binary and copy the `simd` binary:

```codeBlockLines_e6Vv
mkdir -p $DAEMON_HOME/cosmovisor/genesis/bin
cp ./build/simd $DAEMON_HOME/cosmovisor/genesis/bin

```

Now you can run cosmovisor with simapp v0.44:

```codeBlockLines_e6Vv
cosmovisor run start

```

#### Update App [​](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#update-app "Direct link to Update App")

Update app to the latest version (e.g. v0.45).

Next, we can add a migration - which is defined using `x/upgrade` [upgrade plan](https://github.com/cosmos/cosmos-sdk/blob/main/docs/core/upgrade.md) (you may refer to a past version if you are using an older Cosmos SDK release). In a migration we can do any deterministic state change.

Build the new version `simd` binary:

```codeBlockLines_e6Vv
make build

```

Add the new `simd` binary and the upgrade name:

danger

The migration name must match the one defined in the migration plan.

```codeBlockLines_e6Vv
mkdir -p $DAEMON_HOME/cosmovisor/upgrades/test1/bin
cp ./build/simd $DAEMON_HOME/cosmovisor/upgrades/test1/bin

```

Open a new terminal window and submit an upgrade proposal along with a deposit and a vote (these commands must be run within 20 seconds of each other):

**<= v0.45**:

```codeBlockLines_e6Vv
./build/simd tx gov submit-proposal software-upgrade test1 --title upgrade --description upgrade --upgrade-height 200 --from validator --yes
./build/simd tx gov deposit 1 10000000stake --from validator --yes
./build/simd tx gov vote 1 yes --from validator --yes

```

**v0.46, v0.47**:

```codeBlockLines_e6Vv
./build/simd tx gov submit-legacy-proposal software-upgrade test1 --title upgrade --description upgrade --upgrade-height 200 --from validator --yes
./build/simd tx gov deposit 1 10000000stake --from validator --yes
./build/simd tx gov vote 1 yes --from validator --yes

```

**>= v0.50+**:

```codeBlockLines_e6Vv
./build/simd tx upgrade software-upgrade test1 --title upgrade --summary upgrade --upgrade-height 200 --from validator --yes
./build/simd tx gov deposit 1 10000000stake --from validator --yes
./build/simd tx gov vote 1 yes --from validator --yes

```

The upgrade will occur automatically at height 200. Note: you may need to change the upgrade height in the snippet above if your test play takes more time.

- [Design](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#design)
- [Contributing](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#contributing)
- [Setup](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#setup)
  - [Installation](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#installation)
  - [Command Line Arguments And Environment Variables](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#command-line-arguments-and-environment-variables)
  - [Folder Layout](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#folder-layout)
- [Usage](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#usage)
  - [Initialization](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#initialization)
  - [Detecting Upgrades](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#detecting-upgrades)
  - [Auto-Download](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#auto-download)
- [Example: SimApp Upgrade](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#example-simapp-upgrade)
  - [Chain Setup](https://docs.cosmos.network/v0.50/build/tooling/cosmovisor#chain-setup)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=3aysq6w566y3)

#### Hubl

# Hubl

`Hubl` is a tool that allows you to query any Cosmos SDK based blockchain.<br/>
It takes advantage of the new [AutoCLI](https://pkg.go.dev/github.com/cosmos/cosmos-sdk/client/v2@v2.0.0-20220916140313-c5245716b516/cli) feature of the Cosmos SDK.

## Installation [​](https://docs.cosmos.network/v0.50/build/tooling/hubl#installation "Direct link to Installation")

Hubl can be installed using `go install`:

```codeBlockLines_e6Vv
go install cosmossdk.io/tools/hubl/cmd/hubl@latest

```

Or build from source:

```codeBlockLines_e6Vv
git clone --depth=1 https://github.com/cosmos/cosmos-sdk
make hubl

```

The binary will be located in `tools/hubl`.

## Usage [​](https://docs.cosmos.network/v0.50/build/tooling/hubl#usage "Direct link to Usage")

```codeBlockLines_e6Vv
hubl --help

```

### Add Chain [​](https://docs.cosmos.network/v0.50/build/tooling/hubl#add-chain "Direct link to Add chain")

To configure a new chain just run this command using the --init flag and the name of the chain as it's listed in the chain registry ([https://github.com/cosmos/chain-registry](https://github.com/cosmos/chain-registry)).

If the chain is not listed in the chain registry, you can use any unique name.

```codeBlockLines_e6Vv
hubl init [chain-name]
hubl init regen

```

The chain configuration is stored in `~/.hubl/config.toml`.

tip

When using an unsecure gRPC endpoint, change the `insecure` field to `true` in the config file.

```codeBlockLines_e6Vv
[chains]
[chains.regen]
[[chains.regen.trusted-grpc-endpoints]]
endpoint = 'localhost:9090'
insecure = true

```

Or use the `--insecure` flag:

```codeBlockLines_e6Vv
hubl init regen --insecure

```

### Query [​](https://docs.cosmos.network/v0.50/build/tooling/hubl#query "Direct link to Query")

To query a chain, you can use the `query` command.<br/>
Then specify which module you want to query and the query itself.

```codeBlockLines_e6Vv
hubl regen query auth module-accounts

```

- [Installation](https://docs.cosmos.network/v0.50/build/tooling/hubl#installation)
- [Usage](https://docs.cosmos.network/v0.50/build/tooling/hubl#usage)
  - [Add chain](https://docs.cosmos.network/v0.50/build/tooling/hubl#add-chain)
  - [Query](https://docs.cosmos.network/v0.50/build/tooling/hubl#query)

[iframe](https://www.google.com/recaptcha/enterprise/anchor?ar=1&k=6Lck4YwlAAAAAEIE1hR--varWp0qu9F-8-emQn2v&co=aHR0cHM6Ly9kb2NzLmNvc21vcy5uZXR3b3JrOjQ0Mw..&hl=en&v=J79K9xgfxwT6Syzx-UyWdD89&size=invisible&cb=fu84v73tyjvm)

#### Protocol Buffers

# Protocol Buffers

It is known that Cosmos SDK uses protocol buffers extensively, this document is meant to provide a guide on how it is used in the cosmos-sdk.

To generate the proto file, the Cosmos SDK uses a docker image, this image is provided to all to use as well. The latest version is `ghcr.io/cosmos/proto-builder:0.12.x`

Below is the example of the Cosmos SDK's commands for generating, linting, and formatting protobuf files that can be reused in any applications makefile.

Makefile

```codeBlockLines_e6Vv
proto-swagger-gen:
	@echo "Generating Protobuf Swagger"
	@$(protoImage) sh ./scripts/protoc-swagger-gen.sh

proto-format:
	@$(protoImage) find ./ -name "*.proto" -exec clang-format -i {} \;

proto-lint:
	@$(protoImage) buf lint --error-format=json

proto-check-breaking:
	@$(protoImage) buf breaking --against $(HTTPS_GIT)#branch=main

CMT_URL              = https://raw.githubusercontent.com/cometbft/cometbft/v0.38.0-alpha.2/proto/tendermint

CMT_CRYPTO_TYPES     = proto/tendermint/crypto
CMT_ABCI_TYPES       = proto/tendermint/abci
CMT_TYPES            = proto/tendermint/types
CMT_VERSION          = proto/tendermint/version
CMT_LIBS             = proto/tendermint/libs/bits
CMT_P2P              = proto/tendermint/p2p

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/Makefile#L411-L432)

The script used to generate the protobuf files can be found in the `scripts/` directory.

scripts/protocgen.sh

```codeBlockLines_e6Vv
#!/usr/bin/env bash

# How to run manually:
# docker build --pull --rm -f "contrib/devtools/Dockerfile" -t cosmossdk-proto:latest "contrib/devtools"
# docker run --rm -v $(pwd):/workspace --workdir /workspace cosmossdk-proto sh ./scripts/protocgen.sh

set -e

echo "Generating gogo proto code"
cd proto
proto_dirs=$(find ./cosmos ./amino -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
for dir in $proto_dirs; do
  for file in $(find "${dir}" -maxdepth 1 -name '*.proto'); do
    # this regex checks if a proto file has its go_package set to cosmossdk.io/api/...
    # gogo proto files SHOULD ONLY be generated if this is false
    # we don't want gogo proto to run for proto files which are natively built for google.golang.org/protobuf
    if grep -q "option go_package" "$file" && grep -H -o -c 'option go_package.*cosmossdk.io/api' "$file" | grep -q ':0$'; then
      buf generate --template buf.gen.gogo.yaml $file
    fi
  done
done

cd ..

# generate codec/testdata proto code
(cd testutil/testdata; buf generate)

# generate baseapp test messages
(cd baseapp/testutil; buf generate)

# move proto files to the right places
cp -r github.com/cosmos/cosmos-sdk/* ./
cp -r cosmossdk.io/** ./
rm -rf github.com cosmossdk.io

go mod tidy

./scripts/protocgen-pulsar.sh

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/v0.50.0-alpha.0/scripts/protocgen.sh)

## Buf [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#buf "Direct link to Buf")

[Buf](https://buf.build/) is a protobuf tool that abstracts the needs to use the complicated `protoc` toolchain on top of various other things that ensure you are using protobuf in accordance with the majority of the ecosystem. Within the cosmos-sdk repository there are a few files that have a buf prefix. Lets start with the top level and then dive into the various directories.

### Workspace [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#workspace "Direct link to Workspace")

At the root level directory a workspace is defined using [buf workspaces](https://docs.buf.build/configuration/v1/buf-work-yaml). This helps if there are one or more protobuf containing directories in your project.

Cosmos SDK example:

buf.work.yaml

```codeBlockLines_e6Vv
- x/bank/proto
- x/circuit/proto
- x/consensus/proto
- x/distribution/proto

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/buf.work.yaml#L6-L9)

### Proto Directory [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#proto-directory "Direct link to Proto Directory")

Next is the `proto/` directory where all of our protobuf files live. In here there are many different buf files defined each serving a different purpose.

```codeBlockLines_e6Vv
├── README.md
├── buf.gen.gogo.yaml
├── buf.gen.pulsar.yaml
├── buf.gen.swagger.yaml
├── buf.lock
├── buf.md
├── buf.yaml
├── cosmos
└── tendermint

```

The above diagram all the files and directories within the Cosmos SDK `proto/` directory.

#### `buf.gen.gogo.yaml` [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#bufgengogoyaml "Direct link to bufgengogoyaml")

`buf.gen.gogo.yaml` defines how the protobuf files should be generated for use with in the module. This file uses [gogoproto](https://github.com/gogo/protobuf), a separate generator from the google go-proto generator that makes working with various objects more ergonomic, and it has more performant encode and decode steps

proto/buf.gen.gogo.yaml

```codeBlockLines_e6Vv
version: v1
plugins:
  - name: gocosmos
    out: ..
    opt: plugins=grpc,Mgoogle/protobuf/any.proto=github.com/cosmos/gogoproto/types/any,Mcosmos/orm/v1/orm.proto=cosmossdk.io/orm
  - name: grpc-gateway
    out: ..
    opt: logtostderr=true,allow_colon_final_segments=true

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/buf.gen.gogo.yaml#L1-L9)

tip

Example of how to define `gen` files can be found [here](https://docs.buf.build/tour/generate-go-code)

#### `buf.gen.pulsar.yaml` [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#bufgenpulsaryaml "Direct link to bufgenpulsaryaml")

`buf.gen.pulsar.yaml` defines how protobuf files should be generated using the [new golang apiv2 of protobuf](https://go.dev/blog/protobuf-apiv2). This generator is used instead of the google go-proto generator because it has some extra helpers for Cosmos SDK applications and will have more performant encode and decode than the google go-proto generator. You can follow the development of this generator [here](https://github.com/cosmos/cosmos-proto).

proto/buf.gen.pulsar.yaml

```codeBlockLines_e6Vv
version: v1
managed:
  enabled: true
  go_package_prefix:
    default: cosmossdk.io/api
    except:
      - buf.build/googleapis/googleapis
      - buf.build/cosmos/gogo-proto
      - buf.build/cosmos/cosmos-proto
    override:
      buf.build/cometbft/cometbft: buf.build/gen/go/cometbft/cometbft/protocolbuffers/go
plugins:
  - name: go-pulsar
    out: ../api
    opt: paths=source_relative
  - name: go-grpc
    out: ../api
    opt: paths=source_relative

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/buf.gen.pulsar.yaml#L1-L18)

tip

Example of how to define `gen` files can be found [here](https://docs.buf.build/tour/generate-go-code)

#### `buf.gen.swagger.yaml` [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#bufgenswaggeryaml "Direct link to bufgenswaggeryaml")

`buf.gen.swagger.yaml` generates the swagger documentation for the query and messages of the chain. This will only define the REST API end points that were defined in the query and msg servers. You can find examples of this [here](https://github.com/cosmos/cosmos-sdk/blob/main/proto/cosmos/bank/v1beta1/query.proto#L19)

proto/buf.gen.swagger.yaml

```codeBlockLines_e6Vv
version: v1
plugins:
  - name: openapiv2
    out: ../tmp-swagger-gen
    opt: logtostderr=true,fqn_for_openapi_name=true,simple_operation_ids=true,json_names_for_fields=false

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/buf.gen.swagger.yaml#L1-L6)

tip

Example of how to define `gen` files can be found [here](https://docs.buf.build/tour/generate-go-code)

#### `buf.lock` [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#buflock "Direct link to buflock")

This is an autogenerated file based off the dependencies required by the `.gen` files. There is no need to copy the current one. If you depend on cosmos-sdk proto definitions a new entry for the Cosmos SDK will need to be provided. The dependency you will need to use is `buf.build/cosmos/cosmos-sdk`.

proto/buf.lock

```codeBlockLines_e6Vv
# Generated by buf. DO NOT EDIT.
version: v1
deps:
  - remote: buf.build
    owner: cometbft
    repository: cometbft
    commit: c0d3497e35d649538679874acdd86660
    digest: shake256:05d2fb9e6b6bf82385ac26b250afbba281a2ca79f51729291373d24ca676d743183bf70a921daae6feafd5f9917120e2548a7c477d9743f668bca27cc1e12fdf
  - remote: buf.build
    owner: cosmos
    repository: cosmos-proto
    commit: 04467658e59e44bbb22fe568206e1f70
    digest: shake256:73a640bd60e0c523b0f8237ff34eab67c45a38b64bbbde1d80224819d272dbf316ac183526bd245f994af6608b025f5130483d0133c5edd385531326b5990466
  - remote: buf.build
    owner: cosmos
    repository: gogo-proto

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/buf.lock#L1-L16)

#### `buf.yaml` [​](https://docs.cosmos.network/v0.50/build/tooling/protobuf#bufyaml "Direct link to bufyaml")

`buf.yaml` defines the [name of your package](https://github.com/cosmos/cosmos-sdk/blob/main/proto/buf.yaml#L3), which [breakage checker](https://docs.buf.build/tour/detect-breaking-changes) to use and how to [lint your protobuf files](https://buf.build/docs/tutorials/getting-started-with-buf-cli#lint-your-api).

proto/buf.yaml

```codeBlockLines_e6Vv
# This module represents buf.build/cosmos/cosmos-sdk
version: v1
name: buf.build/cosmos/cosmos-sdk
deps:
  - buf.build/cometbft/cometbft:4a62c99d422068a5165429b62a7eb824df46cca9
  - buf.build/cosmos/cosmos-proto
  - buf.build/cosmos/gogo-proto
  - buf.build/googleapis/googleapis
  - buf.build/protocolbuffers/wellknowntypes:v23.4
breaking:
  use:
    - FILE
lint:
  use:
    - DEFAULT
    - COMMENTS
    - FILE_LOWER_SNAKE_CASE
  except:
    - UNARY_RPC
    - COMMENT_FIELD
    - SERVICE_SUFFIX
    - PACKAGE_VERSION_SUFFIX
    - RPC_REQUEST_STANDARD_NAME
    - ENUM_NO_ALLOW_ALIAS

```

[See full example on GitHub](https://github.com/cosmos/cosmos-sdk/blob/main/proto/buf.yaml#L1-L24)

We use a variety of linters for the Cosmos SDK protobuf files. The repo also checks this in ci.

A reference to the github actions can be found [here](https://github.com/cosmos/cosmos-sdk/blob/main/.github/workflows/proto.yml#L1-L32)

.github/workflows/proto.yml

```codeBlockLines_e6Vv
name: Protobuf
# Protobuf runs buf (https://buf.build/) lint and check-breakage
# This workflow is only run when a .proto file has been changed
on:
  pull_request:
    paths:
      - "proto/**"

permissions:
  contents: read

jobs:
  lint:
    runs-on: depot-ubuntu-22.04-4
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: bufbuild/buf-setup-action@v1.38.0
      - uses: bufbuild/buf-lint-action@v1
        with:
          input: "proto"

  break-check:
    runs-on: depot-ubuntu-22.04-4
    steps:
      - uses: actions/checkout@v4
      - uses: bufbuild/buf-setup-action@v1.38.0
      - uses: bufbuild/buf-breaking-action@v1
        with:
          input: "proto"
          against: "https://github.com/${{ github.repository }}.git#branch=${{ github.event.pull_request.base.ref }},ref=HEAD~1,subdir=proto"

```
