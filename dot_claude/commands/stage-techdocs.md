---
allowed-tools: Bash(gh issue:*), Bash(gh api:*), Bash(gh milestone:*), Bash(bun run:*), Bash(echo *)
description: Stage a package or repositories techdocs in FumaDocs MDX format.
---

**If a package or directory is passed into the $ARGUMENTS then only create documentation for that specified directory**

## Instructions

- Create a mdx formatted tech doc for the $ARGUMENTS directory or package
- Ensure that the techdoc is an existing guide, introduction, or reference as provided in the below content structure.
- When the creating of the techdoc is complete place the final techdoc in @.claude/inbox/docs/<guides/introduction/reference>/**/*.mdx
- Ensure that the techdoc matches an existing file and add it to the .claude/inbox/docs in the identical path structure.
- Replace bracketed placeholders (e.g., [Document Title], [Section 1 Title]) with your actual content.
- Use Fumadocs MDX features such as `<Callout>`, `<Cards>`, code blocks, and headings.
- Follow Google’s technical writing principles: clear scope, defined audience, summary up front, active voice, short sentences, focused paragraphs, and logical organization.
- Reference the Fumadocs MDX documentation for advanced features (tabs, includes, math, etc.) as needed.
- Replace bracketed sections with your content. Use headings, lists, callouts, and code blocks as shown. Follow Google’s technical writing guidelines for clarity, brevity, and audience focus.
- Do not add any import statements into the MDX content as they are pre-loaded.

```text
docs
├── guides
│   ├── browser
│   │   ├── index.mdx
│   │   └── web-components.mdx
│   ├── cli
│   │   ├── index.mdx
│   ├── golang
│   │   ├── index.mdx
│   ├── index.mdx
│   ├── react
│   │   ├── index.mdx
│   ├── sending-payments.mdx
│   ├── validators
│   │   ├── index.mdx
│   │   └── running-nodes.mdx
│   └── wallet-connections.mdx
├── introduction
│   ├── bridgeless-transactions.mdx
│   ├── browser-apis.mdx
│   ├── decentralized-storage.mdx
│   ├── hway.mdx
│   ├── identity.mdx
│   ├── index.mdx
│   ├── motr.mdx
│   ├── payments.mdx
│   ├── services.mdx
│   ├── sonr.mdx
│   └── wallets.mdx
└── reference
    ├── changelog.mdx
    ├── index.mdx
    ├── tokenomics
    │   ├── distribution.mdx
    │   ├── index.mdx
    │   ├── transactions.mdx
    │   ├── utility.mdx
    │   └── values.mdx
    ├── whitepaper
    │   ├── assets.mdx
    │   ├── blockchain.mdx
    │   ├── dpos.mdx
    │   ├── incentive.mdx
    │   ├── index.mdx
    │   ├── network.mdx
    │   ├── users-and-apps.mdx
    │   └── wallets.mdx
    └── x
        ├── did.mdx
        ├── dwn.mdx
        ├── svc.mdx
        └── ucan.mdx
```

## Requirements

| Concept                        | Description                                                                                                   |
|------------------------------- |--------------------------------------------------------------------------------------------------------------|
| **Define Scope & Non-Scope**   | Clearly state what the document covers and what it does not cover to set reader expectations.                |
| **Identify Audience**          | Specify the intended audience, their roles, and prerequisite knowledge or reading.                           |
| **Summarize Up Front**         | Begin with a summary of key points so readers can quickly grasp the document’s purpose and value.            |
| **Organize Logically**         | Structure content to match the audience’s needs and logical flow; use outlines and clear sectioning.         |
| **Write Clear Paragraphs**     | Each paragraph should focus on a single topic, start with a strong opening sentence, and avoid digressions.  |
| **Use Short Sentences**        | Prefer short, single-idea sentences for clarity and ease of reading.                                         |
| **Prefer Active Voice**        | Use active voice (actor + verb + target) instead of passive voice for directness and clarity.                |
| **Use Consistent Terms**       | Define new or unfamiliar terms, use them consistently, and introduce acronyms properly.                      |
| **Avoid Ambiguous Pronouns**   | Make sure pronouns clearly refer to their antecedents; repeat nouns if needed for clarity.                   |
| **Eliminate Unnecessary Words**| Remove filler, redundancies, and wordy phrases to make writing concise and impactful.                        |
| **Convert Lists & Steps**      | Use bulleted or numbered lists for items or steps, especially when a sentence becomes too long or complex.   |
| **Cultural Neutrality**        | Avoid idioms, slang, and culturally specific references; use simple, globally understandable language.       |
| **Answer What, Why, How**      | Ensure each paragraph or section answers: What is this? Why does it matter? How should the reader use it?    |

### Additional Best Practices

- **Introduce lists and tables appropriately.**
- **Keep list items parallel in structure.**
- **Start numbered list items with imperative verbs.**
- **Revise ruthlessly:** Remove anything that doesn’t serve the document’s purpose or scope.
- **Use headings and subheadings** to break up content and aid navigation.

## References

- [Google Technical Writing One](https://developers.google.com/tech-writing/one/documents)
- [Fumadocs MDX Syntax](https://fumadocs.dev/docs/ui/markdown)

## Example Content

```mdx Example Doc
---
title: [Insert Document Title Here]
description: [Insert Document Description Here]
---

# [Document Title]

<Callout title="Scope" type="info">
Briefly state what this document covers and, if relevant, what it does not cover.
</Callout>

<Callout title="Audience" type="info">
Describe the intended audience, including their roles and any prerequisite knowledge or reading.
</Callout>

## Summary

Summarize the key points or purpose of the document in 2-4 sentences.

## [Section 1 Title]

- Start each section with a clear, focused opening sentence.
- Use short sentences, each expressing a single idea.
- Prefer active voice over passive voice.
- Use specific verbs and avoid ambiguous pronouns.
- Define new or unfamiliar terms on first use, and use terms consistently.
- When introducing an acronym, spell it out first: **Full Term** (**ACR**).

## [Section 2 Title]

- Organize content logically based on audience needs.
- Use numbered lists for ordered steps and bulleted lists for unordered items.
- Convert long sentences with lists into bullet points.
- Keep paragraphs focused on a single topic (3-5 sentences per paragraph).
- Eliminate unnecessary words and subordinate clauses that distract from the main idea.

## Example Code

```js
// Example code block with syntax highlighting
console.log('Hello World');
```

## Further Reading

<Cards>
  <Card href="https://developers.google.com/tech-writing/one/documents" title="Google Technical Writing One">
    Learn more about technical writing best practices.
  </Card>
  <Card href="https://fumadocs.dev/docs/ui/markdown" title="Fumadocs MDX Syntax">
    Reference for Fumadocs MDX features and components.
  </Card>
</Cards>

<Callout title="Tip" type="success">
Use <Callout> and <Cards> components to highlight important information and related resources.
</Callout>
```
