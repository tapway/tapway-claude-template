---
name: subagent-driven-development
description: >
  Execute a written plan with 3+ tasks using isolated subagents per task for
  maximum quality and parallelism. Use after the writing-plans skill, when
  ready to implement a multi-task plan. Triggers include "delegate to
  subagents", "spawn agents", "run this plan with subagents".
---

# Skill: Subagent-Driven Development

**When to invoke:** You have a written plan (see `writing-plans` skill) with 3+ tasks, and want to execute it with maximum quality using isolated agents per task.

---

## Core Concept

> Fresh subagent per task + two-stage review (spec compliance then code quality) = high quality, fast iteration.

Each task in the plan is handed to a fresh subagent with exactly the context it needs — no more. This prevents context pollution and keeps the coordinator (you) free for oversight.

---

## Protocol

### Before Starting
- [ ] Implementation plan is written and saved to `docs/plans/`
- [ ] Git working tree is clean (`git status`)
- [ ] Consider using `git-worktrees` skill for true parallelism

### For Each Task

**Step 1: Dispatch Implementer**
Provide the subagent with:
```
You are implementing Task N of the [Feature] plan.

TASK: [exact task description from plan]
FILES TO MODIFY: [list]
RELEVANT CONTEXT: [paste only what's needed — don't point to plan file]
REQUIRED SKILLS: tdd
CONVENTIONS: [key items from CLAUDE.md]

Do not implement more than this task. Stop after the commit.
```

**Step 2: Handle Blockers**
If the implementer asks a question or reports being blocked:
- Answer directly in your dispatch message
- Do NOT dispatch another implementer until the question is answered
- Never tell a blocked agent to "try again" — change the approach

**Step 3: Spec Compliance Review**
After the implementer reports done, review:
- Does the code match every requirement in the task spec?
- Are all tests written and passing?
- No incomplete implementations?

**Step 4: Code Quality Review**
Invoke the `code-review` skill and check:
- Type safety (no `any`, proper Pydantic models)
- Error handling
- No security issues
- Follows naming conventions

**Step 5: Mark Complete**
Only after both reviews pass. Proceed to Task N+1.

---

## Model Selection
| Task type | Model |
|---|---|
| Mechanical (1-2 files, clear spec) | Haiku / smallest available |
| Integration (multi-file, patterns) | Sonnet |
| Architecture / design decisions | Opus |

---

## Hard Rules
- ❌ Never dispatch multiple implementers in parallel (use git-worktrees for that)
- ❌ Never skip either review stage
- ❌ Never make the subagent read the plan file — paste the task text directly
- ❌ Never start on `main` without explicit consent
