---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(gh pr:*)
description: Mark Issue as Complete and Stage a PR
---

Create a Pull Request for the changes made in this branch using mcp**github**create_pr.

If any arguments are provided attach them as additional issues closed by this PR.

Closed Issues: $ARGUMENTS

## Requirements

- Do not create a PR if you are on the default branch
- Ensure all issues that were fixed in this branch are listed in the PR body grouped by type
- Make sure the body of the PR contains the proper context of the issue along with the final implementation changes made
- Add the 'breaking' label to the PR for any changes made to sql or protobuf
- Add the 'enhance' label to the PR for any changes made to optimize the system architecture
- Add the 'feature' label to the PR for any new features added to the codebase
- Always assign the PR to @prnk28
- Do not add the '🤖 Generated with Claude Code' watermark in the PR
- Every PR must include either a 'breaking', 'enhance', 'feature', 'docs', or 'tests' label
- Open the PR on the Web after it has been made.
