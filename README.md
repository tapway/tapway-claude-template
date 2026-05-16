# Tapway Claude Template

> A complete AI-assisted development workflow. Clone this repo, then follow
> the steps below — from idea to production — using Claude Code's built-in
> skills and slash commands.

---

## The Developer Workflow

Every feature follows the same 8-step pipeline. Each step maps to a Claude
Code skill (auto-triggered by keywords) or a slash command.

```
Clone → Brainstorm → Plan → TDD → Cleanup → Review → Deploy → Verify
  1        2         3      4       5         6        7        8
```

---

### Step 0 — Clone & Setup  `/bootstrap`

```bash
git clone <your-repo-url>
cd <your-project>
code .                        # Open in VS Code
```

Then start Claude Code in the terminal:

```bash
claude                       # or Cmd+Shift+P → "Claude: Start Session"
```

When Claude starts, type `/bootstrap` to auto-detect your tech stack and
walk through the full setup (install deps, run migrations, start services).

---

### Step 1 — Brainstorm  `/brainstorming`

When you have a rough idea but aren't sure how to build it, just start
talking to Claude. The `brainstorming` skill activates automatically when
Claude detects exploratory language like:

> *"Let's think about how to add user subscriptions..."*
> *"What are the options for handling file uploads?"*
> *"How should we approach real-time notifications?"*

Claude will explore approaches, call out trade-offs, and help you pick a
direction before any code is written.

**Outcome:** A chosen approach with rough consensus on what to build.

---

### Step 2 — Write a Plan  `/plan`

Once you have a direction, ask Claude to create an implementation plan:

> *"Write a plan for the subscription feature."*

The `writing-plans` skill kicks in and produces a structured plan with:
- A file map (every file to create or modify)
- A numbered task breakdown (each task = one small, testable commit)
- No placeholders — every step is concrete

The plan is saved to `docs/plans/<feature-name>.md`.

**Outcome:** A detailed, ordered plan you can review and approve before
any code changes.

---

### Step 3 — TDD (Test-Driven Development)  `/tdd`

After the plan is approved, implement it task by task. Each task starts
with a test:

> *"Implement Task 1 from the plan."*

The `tdd` skill enforces the red-green-refactor cycle:
1. **Red** — write a failing test
2. **Green** — write just enough code to pass
3. **Refactor** — clean up while keeping tests green

**Always write the test first.** No exceptions.

**Outcome:** Working, tested code for each task.

---

### Step 4 — Pre-Review Cleanup  `/cleanup`

Before opening a PR, clean up any leftover template artifacts:

> *"Clean up template files before review."*

The `pre-review-cleanup` skill scans for:
- `[PLACEHOLDER]` brackets in docs and config files
- Scaffold boilerplate (`# TODO`, `501 Not Implemented`, "replace this")
- Unnecessary Dockerfiles (GPU variants if CPU-only)
- Starter models/routes that don't fit your project
- Missing `.env` or stale config

Nothing is deleted without confirmation. After cleanup, the skill
recommends running a code review.

**Outcome:** A clean repository with no template residue.

---

### Step 5 — Code Review  `/review`

Review your own changes before opening a PR:

> *"Review my changes."*

The `code-review` skill runs through a three-tier checklist:
- **Critical** — secrets in code, SQL injection, missing auth, unvalidated inputs
- **Warnings** — N+1 queries, functions over 50 lines, missing error handling
- **Suggestions** — opportunities to simplify or extract utilities

Fix all Critical and Warning items before opening the PR.

You can also use the `/review` shortcut command.

**Outcome:** A self-reviewed changeset ready for a PR.

---

### Step 6 — Deploy  `/deploy`

When you're ready to ship:

> *`/deploy`*

Claude inspects your actual tech stack and deployment config, then generates
a context-specific checklist:
- Branch check, CI status, test suite
- Pending database migrations
- Environment variables for the target environment
- Docker build (correct target: cpu/cuda/rocm/jetson)
- Rollback plan

A deployment summary card is produced at the end.

**Outcome:** A completed deployment with a summary you can paste into
your team's Slack channel.

---

### Step 7 — Verify  `/test-all`

After deploying, confirm everything works:

> *`/test-all`*

This runs the full test suite and reports the results. If anything fails,
use `systematic-debugging` to investigate:

> *"The payment test is failing on staging but passes locally."*

**Outcome:** Verified that the deployment is healthy.

---

## Quick Reference

### Slash Commands

| Command | When to Use |
|---|---|
| `/bootstrap` | Setting up this project for the first time |
| `/brainstorming` | Explore approaches before coding |
| `/plan` | Write a detailed implementation plan |
| `/tdd` | Start a test-driven development cycle |
| `/cleanup` | Remove template artifacts before review |
| `/review` | Self-review your current changes before a PR |
| `/deploy` | Pre-deployment checklist before shipping |
| `/test-all` | Run all tests and report results |
| `/new-feature` | Start the full 8-step workflow for a new feature |

### Auto-Triggered Skills

| Say This | Skill Activates |
|---|---|
| *"Let's think about..."*, *"What are the options..."* | brainstorming |
| *"Write a plan..."*, *"Plan the implementation..."* | writing-plans |
| *"Write a test first..."*, *"Implement this task..."* | tdd |
| *"Clean up..."*, *"Remove boilerplate..."* | pre-review-cleanup |
| *"Review my changes..."* | code-review |
| *"This is failing..."*, *"Investigate..."* | systematic-debugging |
| *"Is this secure?"*, *"Audit..."* | security-audit |
| *"Refactor..."*, *"Simplify..."* | refactor |
| *"Document this..."*, *"Write architecture docs..."* | repo-docs |

### Project Structure

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Source of truth — conventions, stack, open items |
| `.claude/` | Claude Code config — hooks, commands, skills |
| `.claude/skills/` | AI skills (brainstorming, TDD, code review, cleanup, etc.) |
| `backend/` | Python FastAPI + Granian + SQLAlchemy |
| `frontend/` | Next.js 14 + TypeScript + Tailwind |
| `docs/` | Architecture, schemas, workflows, deployment docs |
| `agents/` | Specialized subagent definitions |

---

## Prerequisites

- **Claude Code** — installed and authenticated
- **Git** — any recent version
- **Docker** — for infrastructure dependencies (DB, Redis, etc.)
- **Language runtimes** — `/bootstrap` will detect and guide you

---

## License

[MIT]
