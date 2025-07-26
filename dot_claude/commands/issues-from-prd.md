---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(gh issue:*)
description: Create a New Issue
---

Given the following PRD Document: $ARGUMENTS

Create new properly scoped issue's in the repository using mcp**github**create_issue with an appropriate title, relevant file paths, and links to documentation. Ensure to retain all the essential details from the PRD for each relevant issue.

# Instructions

1. Always begin issues with smart requirements in a h2. Always ask the user for some requirements if you cannot determine them.
2. Add all File Paths affected and docs resources under a section in h2 for Context. If you cannot determine the file paths associated with the task then ask the user.
3. Add Acceptance criteria as the last section with checkboxes under an h2 section. Ensure that the Acceptance Criteria enables Test-Driven Development.
4. Always ensure issues are created in the same format as the Example in the final section

# Guidelines

- Always keep the title short and descriptive so that it can be recorded as a single line in a changelog entry
- Always include any expected data types as code formatted examples if necessary
- Always include the relevant file paths of expected files to be changed
- Always keep the issue body as succinct as possible with only essential context
- Always use mcp\_\_exa_search to find associated documentation for the tasks
- If protobuf or sql files will be changed with this issue add the 'breaking' label to the issue
- Always assign the Issue to @prnk28

# Doc Sources for essential libraries

| Package             | Documentation URL                 |
| ------------------- | --------------------------------- |
| tailwindcss         | <https://tailwindcss.com/docs>      |
| cosmos concepts     | <https://tutorials.cosmos.network/> |
| templ               | <https://templ.guide/>              |
| sqlc golang         | <https://docs.sqlc.dev/>            |
| goose db migrations | <https://pressly.github.io/goose/>  |
| cosmos sdk          | <https://docs.cosmos.network/>      |
| taskfile            | <https://taskfile.dev/>             |
| github actions      | <https://docs.github.com/actions>   |
| ibc-go              | <https://ibc.cosmos.network/main/>  |
| cometbft            | <https://docs.cometbft.com/>        |
| tigerbeetle         | <https://docs.tigerbeetle.com/>     |
| echo golang         | <https://echo.labstack.com/guide>   |

> If golang examples are needed use mcp\_\_godoc_search in order to find relevant code examples or go specific context

# Example

An example issue should be formatted as:

```md
Title: Implement x/dwn vaults plugin
Labels: x/dwn, feature

## Requirements

- Must include DWN Bytes in Protobuf
- Must Spawn DWN Plugins using Genesis Params
- Must have Gas Free Query Methods for Spawn and Verify

## Context

### Affected Files

- @x/dwn/keeper/keeper.go
- @x/dwn/client/wasm/main.go
- @x/dwn/types/genesis.go

### Relevant Documentation

- [Example Doc 1](https://example.com)
- [Example Doc 2](https://example.com)

## Acceptance Criteria
- [ ] Tests for Spawning Plugins from the x/dwn Genesis
- [ ] Tests for Resolving Vault Secret Data from IPFS
- [ ] Test for full-round Sign/Verify/Refresh on-chain
- [ ] Grpc Gateway Compatibility for HTTP Requests

```
