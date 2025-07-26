---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(gh issue:*)
description: Update Existing Issue
---

Update existing issue #$ARGUMENTS in this repository using mcp**github**update_issue with the below guidelines:

## Remember:

- Always keep the title short and descriptive so that it can be recorded as a single line in a changelog entry
- Always include any expected data types as code formatted examples if necessary
- Always include the relevant file paths of expected files to be changed
- Always keep the issue body as succinct as possible with only essential context
- Always use mcp\_\_exa_search to find associated documentation for the tasks
- If protobuf or sql files will be changed with this issue add the 'breaking' label to the issue

### Available Commands:

- `/project:session-start [name]` - Start a new session with optional name
- `/project:session-update [notes]` - Add notes to current session
- `/project:session-end` - End session with comprehensive summary
- `/project:session-list` - List all session files
- `/project:session-current` - Show current session status
- `/project:session-help` - Show this help

### How It Works:

1. Sessions are markdown files in `.claude/sessions/`
2. Files use `YYYY-MM-DD-HHMM-name.md` format
3. Only one session can be active at a time
4. Sessions track progress, issues, solutions, and learnings

### Best Practices:

- Start a session when beginning significant work
- Update regularly with important changes or findings
- End with thorough summary for future reference
- Review past sessions before starting similar work

### Example Workflow:

```
/project:session-start refactor-auth
/project:session-update Added Google OAuth restriction
/project:session-update Fixed Next.js 15 params Promise issue
/project:session-end
```

## Doc Sources for essential libraries:

| Package             | Documentation URL                 |
| ------------------- | --------------------------------- |
| tailwindcss         | https://tailwindcss.com/docs      |
| cosmos concepts     | https://tutorials.cosmos.network/ |
| templ               | https://templ.guide/              |
| sqlc golang         | https://docs.sqlc.dev/            |
| goose db migrations | https://pressly.github.io/goose/  |
| cosmos sdk          | https://docs.cosmos.network/      |
| taskfile            | https://taskfile.dev/             |
| github actions      | https://docs.github.com/actions   |
| ibc-go              | https://ibc.cosmos.network/main/  |
| cometbft            | https://docs.cometbft.com/        |
| tigerbeetle         | https://docs.tigerbeetle.com/     |
| echo golang         | https://echo.labstack.com/guide   |

> If golang examples are needed use mcp\_\_godoc_search in order to find relevant code examples or go specific context
