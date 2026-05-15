---
name: brainstorming
description: >
  Explore approaches before writing code for a new feature, architecture decision,
  or complex bug. Use when there is even a 1% chance multiple approaches exist.
  Triggers include "let's brainstorm", "how should we approach", "what are the
  options for", "before we code", or any exploratory design question.
---

# Skill: Brainstorming

**When to invoke:** Before writing any code for a new feature, architecture decision, or complex bug. If there's even a 1% chance this applies, invoke it.

---

## Purpose

Explore the problem space thoroughly before committing to an approach. Generate multiple solutions, evaluate trade-offs, and arrive at the best path forward.

---

## Protocol

### 1. Restate the Problem
Write out your understanding of what needs to be solved. Include:
- The user-facing goal
- Any constraints (performance, compatibility, team conventions)
- What "done" looks like

### 2. Generate Options (minimum 3)
For each approach:
- **Name** the approach clearly
- **Describe** how it works in 2-3 sentences
- **Pros:** What makes this good
- **Cons:** What makes this risky or limited
- **Complexity:** Low / Medium / High

### 3. Evaluate
Score each option on:
- Fits team conventions (CLAUDE.md)
- Testability
- Maintainability
- Speed to implement

### 4. Recommend
State the recommended approach and why. Flag any assumptions that, if wrong, would change the recommendation.

### 5. Hand off
If proceeding, invoke the `writing-plans` skill next to turn the recommendation into an implementation plan.

---

## Red Flags (you're skipping brainstorming when you shouldn't)
- "This is obviously a simple X" — simple problems often have subtle gotchas
- "I've done this before" — past solutions may not fit this context
- "The user already told me what to do" — confirm you understand the *why*, not just the *what*
