---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(gh issue:*), Bash(git worktree:*)
description: Start work on Issue in new Branch
---

## Warnings

- **If already checked out with a branch named `feat/<NAME>` DO NOT BEGIN WORK and display the active issue being worked on. Warn the user that this branch should create a pull request to complete the ongoing task prior to starting a new issue. Ask the user if they would like to create the PR for this branch and if they respond Yes, continue to do so using the `/project:github:issue-done` command.**
- **If no Issue Number is provided use `gh issue list` and provide the number and titles for open issues. Only after a number is provided do you begin the task**
- Begin work on Issue #$ARGUMENTS following our coding standards. Create an Issue branch by using the following command `gh issue develop <NUMBER> -n feat/<NAME> -c`
- Create a new git worktree with this new branch. Example: git worktree add ../project-bugfix bugfix-123

## Remember

- Always keep the branch name descriptive but not too long. No more than 3 words.
- Always link the associated issue being completed with the new branch
- Never start work in the default branch of the git repository
- Never create a pull release after completing initial work
- Await further instructions after completing only the initial tasks
- Never edit code when you dont know how to complete a task and prompt the user for additional context
