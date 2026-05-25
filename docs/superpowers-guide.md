# Tapway Superpowers — User Guide

> How to install, use, and upgrade the Tapway Claude Code plugin for AI-assisted development.

---

## Table of Contents

- [Quick Start: New Repos](#quick-start-new-repos)
- [Quick Start: Existing Repos](#quick-start-existing-repos)
- [What the Plugin Gives You](#what-the-plugin-gives-you)
- [Skill Reference](#skill-reference)
- [Slash Commands](#slash-commands)
- [Guardrails (Automatic)](#guardrails-automatic)
- [Daily Workflow](#daily-workflow)
- [Upgrading the Plugin](#upgrading-the-plugin)
- [Troubleshooting](#troubleshooting)

---

## Quick Start: New Repos

For brand-new projects. You'll clone the template and everything auto-installs.

### 1. Clone the template

```bash
git clone https://github.com/tapway/tapway-claude-template.git my-project
cd my-project
code .
```

### 2. Start Claude Code

```bash
claude
```

### 3. Bootstrap

```
/bootstrap
```

Claude auto-detects your tech stack, installs dependencies, runs migrations, and starts services. Behind the scenes, three plugins auto-install from `.claude/settings.json`:

| Plugin | What it provides |
|---|---|
| `tapway-superpowers` | 12 skills, 5 guardrail hooks, 4 agents, slash commands |
| `andrej-karpathy-skills` | Coding best-practices guidelines (simplicity, surgical changes) |
| `claude-code-setup` | Automation recommendations for your codebase |

No manual plugin installs needed. Everything is wired up by the template.

### 4. Start building

Describe what you want to build and Claude walks you through the pipeline:

```
"I want to add a user dashboard with analytics charts."
```

---

## Quick Start: Existing Repos

For projects already in progress that weren't initialized from the template.

### 1. Register the Tapway marketplace

```bash
claude plugin marketplace add https://github.com/tapway/tapway-superpowers
```

This tells Claude Code where to find Tapway's plugin catalog.

### 2. Install the superpowers plugin

```bash
claude plugin install tapway-superpowers@tapway-superpowers
```

Skills and hooks activate immediately. No restart needed.

### 3. (Recommended) Install companion plugins

```bash
claude plugin install andrej-karpathy-skills@karpathy-skills
claude plugin install claude-code-setup@claude-plugins-official
```

### 4. (Recommended) Add guardrail configuration

The plugin's hooks auto-register, but permissions and env defaults live in `.claude/settings.json`. Copy these sections from the template repo to get branch protection and environment guarding:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(make *)",
      "Bash(python *)",
      "Bash(pytest *)",
      "Bash(docker compose *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git checkout *)",
      "Bash(git branch *)",
      "Bash(git pull)",
      "Bash(git push)",
      "Bash(uv *)",
      "Bash(npx *)"
    ],
    "deny": [
      "Bash(git push --force)",
      "Bash(git push -f)",
      "Bash(git reset --hard)",
      "Bash(rm -rf *)",
      "Bash(curl * | bash *)"
    ]
  },
  "env": {
    "ALLOW_PROD": "0"
  }
}
```

### 5. Verify installation

```bash
claude plugin list
```

You should see `tapway-superpowers` with status "enabled".

---

## What the Plugin Gives You

### Skills (12 total)

AI behaviors that activate automatically when relevant keywords appear in conversation, or when invoked explicitly.

| Skill | Activates when you say... |
|---|---|
| `brainstorming` | "Let's think about...", "What are the options...", "How should we approach..." |
| `writing-plans` | "Write a plan...", "Plan the implementation...", "Break this down..." |
| `tdd` | "Write a test first...", "Implement this task...", any new feature or bug fix |
| `verification` | "Is this done?", "Verify...", "Final check...", "Ready to ship?" |
| `refactor` | "Refactor...", "Clean up...", "Simplify...", "Remove duplication..." |
| `code-review` | "Review my changes...", "PR review...", "Check this before I push..." |
| `systematic-debugging` | "Why is X failing?", "Debug...", "Investigate this bug...", "Works locally but not in prod..." |
| `subagent-driven-development` | "Delegate to subagents...", "Run this plan with subagents..." |
| `git-worktrees` | "Worktree...", "Parallel branches...", "Isolate this work..." |
| `repo-docs` | "Document this repo...", "Write architecture docs...", "/docs" |
| `security-audit` | "Security review...", "Audit auth...", "Is this safe?" |
| `pre-review-cleanup` | "Clean up template files...", "Remove boilerplate...", "Pre-review cleanup..." |

Each skill has been strengthened with Andrej Karpathy's coding principles (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution).

### Hooks (5 guardrails)

Automatic checks that run before or after Claude takes action. No configuration needed — they activate when the plugin installs.

| Hook | When it fires | What it does |
|---|---|---|
| `pre-bash-safety` | Before any shell command | Blocks force-push, hard-reset on main, commits to main, and prod operations |
| `post-write-lint` | After file write/edit | Runs linter on changed files |
| `pre-commit-secrets` | Before `git commit` | Scans staged files for secrets, keys, and credentials |
| `session-start` | When Claude Code starts | Displays project info, git status, and environment summary |
| `post-commit-release-note` | After `git commit` | Appends conventional-commit messages to `CHANGELOG.unreleased.md` |

### Agents (4 subagent definitions)

Specialized subagents available for use with the Agent tool:

| Agent | Purpose |
|---|---|
| `code-reviewer` | Systematic code review with security, performance, and type-safety checks |
| `test-writer` | Write tests in the project's conventions (pytest/Jest) |
| `security-auditor` | OWASP Top 10 audit for auth, payments, and user data code paths |
| `devops-sre` | Docker, CI/CD, and infrastructure configuration review |

---

## Slash Commands

Type these directly in Claude Code:

| Command | What it does |
|---|---|
| `/brainstorming` | Explore approaches before writing code |
| `/plan` | Create a detailed implementation plan (saved to `docs/plans/`) |
| `/tdd` | Start test-driven development cycle (red → green → refactor) |
| `/review` | Self-review current changes before a PR |
| `/cleanup` | Remove template artifacts and boilerplate before review |
| `/deploy` | Pre-deployment checklist (branch, CI, migrations, rollback) |
| `/test-all` | Run full test suite and report results |
| `/release <patch\|minor\|major>` | Bump semver, collate release notes, create git tag |
| `/upgrade-skills` | Update all plugins and marketplaces to latest versions |
| `/bootstrap` | Auto-detect stack and set up the project from scratch |
| `/new-feature` | Start the full workflow for a new feature |

---

## Guardrails (Automatic)

These protections are active by default. No action needed.

### Branch protection

```
> git commit -m "fix: typo"
ERROR: Commits to main are blocked by project policy.
Create a feature branch: git checkout -b feat/<your-feature>
```

Always create a branch for your work:
```bash
git checkout -b feat/my-feature    # new feature
git checkout -b fix/my-bug         # bug fix
git checkout -b chore/my-task      # dependencies, config, cleanup
```

### Environment protection

Commands targeting production are blocked unless you explicitly opt in:

```
> docker compose -f docker-compose.production.yml up
ERROR: Docker production operation detected.
Set ALLOW_PROD=1 to proceed.
```

To run a production command intentionally:
```bash
ALLOW_PROD=1 docker compose -f docker-compose.production.yml up
```

Patterns that trigger the guard:
- `DATABASE_URL` containing `prod` or `production`
- `docker compose` with `production` or `prod` file names
- `--production` flag on any command

### Release notes (automatic)

Every conventional-format commit appends a line to `CHANGELOG.unreleased.md`:

```
- **feat(auth):** add JWT refresh token rotation (2026-05-25, a1b2c3d)
- **fix(payment):** handle null currency in Stripe webhook (2026-05-25, d4e5f6g)
```

Non-conventional commits (no `type: message` format) are ignored.

To cut a release from accumulated notes:
```
/release patch
```

This bumps the version, moves unreleased notes to `CHANGELOG.md`, creates a git tag, and resets the unreleased log.

---

## Daily Workflow

```
Clone → Bootstrap → Brainstorm → Plan → TDD → Cleanup → Review → Deploy → Verify
  0         1           2         3      4        5         6        7        8
```

### Step 0 — Clone & Bootstrap

```bash
git clone https://github.com/tapway/tapway-claude-template.git my-project
cd my-project
claude
```

Then `/bootstrap`.

### Step 1 — Brainstorm

Describe what you want to build. Claude explores approaches before writing code.

> *"Let's think about how to add user subscriptions."*

Claude generates multiple approaches, evaluates trade-offs, surfaces assumptions, and recommends a path. The `brainstorming` skill activates automatically.

### Step 2 — Plan

Turn the chosen approach into a concrete plan:

> *"Write a plan for the subscription feature."*

Claude produces a file map (every file to create/modify), a numbered task breakdown (each task = one small commit), and saves it to `docs/plans/`. The `writing-plans` skill activates automatically.

### Step 3 — TDD

Implement the plan task by task, test-first:

> *"Implement Task 1 from the subscription plan."*

Claude writes a failing test, writes minimal code to pass, then refactors. The `tdd` skill enforces the cycle.

### Step 4 — Cleanup

Remove template artifacts before review:

> *"Clean up before review."*

The `pre-review-cleanup` skill scans for placeholders, boilerplate, and stale scaffold code. Nothing is deleted without confirmation.

### Step 5 — Review

Self-review before opening a PR:

> *"Review my changes."*

Claude checks for security issues, N+1 queries, scope creep, unnecessary abstractions, and style compliance. The `code-review` skill activates automatically.

### Step 6 — Deploy

```
/deploy
```

Claude inspects your stack and generates a deployment checklist: branch, CI status, migrations, env vars, Docker build target, and rollback plan.

### Step 7 — Verify

```
/test-all
```

Runs the full test suite. If anything fails, say:

> *"The payment test is failing on staging but passes locally."*

The `systematic-debugging` skill activates.

---

## Upgrading the Plugin

When the Tapway team releases improvements to skills or hooks:

### Automatic (recommended)

```
/upgrade-skills
```

This updates all marketplaces and plugins. Restart Claude Code after to apply changes.

### Manual

```bash
claude plugin marketplace update
claude plugin update tapway-superpowers@tapway-superpowers
```

Then restart Claude Code.

### Check current version

```bash
claude plugin list
```

---

## Troubleshooting

### Skills aren't activating

```bash
claude plugin list
```

Check that `tapway-superpowers` appears with status "enabled". If not:

```bash
claude plugin install tapway-superpowers@tapway-superpowers
```

### Hooks aren't firing

```bash
claude plugin details tapway-superpowers@tapway-superpowers
```

Look for `Hooks (3) PreToolUse, PostToolUse, SessionStart` in the component inventory. If hooks are missing, the plugin may need reinstallation.

### "Plugin not found" on install

Your marketplace isn't registered:

```bash
claude plugin marketplace add https://github.com/tapway/tapway-superpowers
claude plugin marketplace update
claude plugin install tapway-superpowers@tapway-superpowers
```

### Undoing plugin changes

```bash
claude plugin uninstall tapway-superpowers@tapway-superpowers
```

This removes skills, hooks, and agents. Your code and `.claude/settings.json` are unaffected.

### Plugin version mismatch

If a teammate has an older version:

```
/upgrade-skills
```

Or manually:

```bash
claude plugin update tapway-superpowers@tapway-superpowers
```

---

## Files Reference

| File | Purpose | Edited by you? |
|---|---|---|
| `.claude/settings.json` | Permissions, env vars, plugin declarations | Yes (project config) |
| `.claude/settings.local.json` | Local overrides (gitignored) | Yes (local only) |
| `.claude/commands/*.md` | Slash commands | Rarely |
| `CLAUDE.md` | Project conventions and team standards | Yes |
| `CHANGELOG.unreleased.md` | Accumulated release notes (auto-generated) | No |
| `VERSION` | Current semver version | No (managed by `/release`) |
| `docs/plans/*.md` | Implementation plans | Yes (write, then commit) |