## Plan: Template Workflow Enhancements — Plugin Extraction, Hooks & Upgrade Flow

**Goal:** Package skills + agents into a reusable plugin, add branch/env/version guardrail hooks, and provide a one-command upgrade path for existing repos.
**Tech stack:** Bash (hooks), YAML (agents), Markdown (skills/commands), JSON (plugin manifest)
**Related skills needed:** tdd, subagent-driven-development
**Estimated tasks:** 10

### Assumptions
- Plugin hooks auto-register or are referenceable from settings.json (will verify during Task 3 — if not, hooks stay in template)
- The plugin marketplace will be a public GitHub repo owned by the tapway org
- Conventional commits (`feat:`, `fix:`, `chore:`) are already the team standard per CLAUDE.md

### Simpler Alternative Considered
Put everything in CLAUDE.md as text rules. Rejected — "vibe coding" means the AI drives; without hard hook guardrails, conventions drift. Hooks are the seatbelt.

---

## File Map

```
# New repo: tapway-superpowers (plugin + marketplace)
CREATE  .claude-plugin/plugin.json
CREATE  .claude-plugin/marketplace.json
CREATE  skills/brainstorming/SKILL.md
CREATE  skills/writing-plans/SKILL.md
CREATE  skills/tdd/SKILL.md
CREATE  skills/verification/SKILL.md
CREATE  skills/refactor/SKILL.md
CREATE  skills/code-review/SKILL.md
CREATE  skills/systematic-debugging/SKILL.md
CREATE  skills/subagent-driven-development/SKILL.md
CREATE  skills/git-worktrees/SKILL.md
CREATE  skills/repo-docs/SKILL.md
CREATE  skills/security-audit/SKILL.md
CREATE  skills/pre-review-cleanup/SKILL.md
CREATE  agents/code-reviewer.yml
CREATE  agents/test-writer.yml
CREATE  agents/security-auditor.yml
CREATE  agents/devops-sre.yml
CREATE  hooks/pre-bash-safety.sh
CREATE  hooks/post-write-lint.sh
CREATE  hooks/pre-commit-secrets.sh
CREATE  hooks/session-start.sh
CREATE  hooks/post-commit-release-note.sh
CREATE  README.md
CREATE  LICENSE

# Template repo: tapway-claude-template
MODIFY  .claude/settings.json
MODIFY  .claude/hooks/pre-bash-safety.sh
MODIFY  .claude/hooks/session-start.sh
CREATE  .claude/hooks/post-commit-release-note.sh
CREATE  .claude/commands/upgrade-skills.md
CREATE  .claude/commands/release.md
MODIFY  CLAUDE.md
DELETE  .claude/skills/brainstorming/SKILL.md
DELETE  .claude/skills/writing-plans/SKILL.md
DELETE  .claude/skills/tdd/SKILL.md
DELETE  .claude/skills/verification/SKILL.md
DELETE  .claude/skills/refactor/SKILL.md
DELETE  .claude/skills/code-review/SKILL.md
DELETE  .claude/skills/systematic-debugging/SKILL.md
DELETE  .claude/skills/subagent-driven-development/SKILL.md
DELETE  .claude/skills/git-worktrees/SKILL.md
DELETE  .claude/skills/repo-docs/SKILL.md
DELETE  .claude/skills/security-audit/SKILL.md
DELETE  .claude/skills/pre-review-cleanup/SKILL.md
DELETE  agents/code-reviewer.yml
DELETE  agents/test-writer.yml
DELETE  agents/security-auditor.yml
DELETE  agents/devops-sre.yml
```

---

## Task Breakdown

### Task 1: Create plugin skeleton with marketplace manifest
**Files:** `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `README.md`, `LICENSE`
**Success criteria:** `claude plugin validate .` passes with no errors
**Steps:**
1. Create directory structure: `tapway-superpowers/`
2. Write `plugin.json` with `name: "tapway-superpowers"`, version `0.1.0`, empty `skills` and `agents` arrays and `hooks` array
3. Write `marketplace.json` with `id: "tapway"`, single plugin entry pointing to `"./"` with category `"workflow"`
4. Write `README.md` explaining what the plugin provides and how to install
5. Write `LICENSE` (MIT)
6. Run `claude plugin validate .` — confirm it passes
7. `git init && git commit -m "chore: init tapway-superpowers plugin skeleton"`

### Task 2: Migrate skills and agents into plugin
**Files:** All 12 `skills/*/SKILL.md`, 4 `agents/*.yml`
**Success criteria:** `claude plugin validate .` passes with all skills/agents listed; `plugin.json` `skills` and `agents` arrays match actual directories
**Steps:**
1. Copy each skill from template `.claude/skills/<name>/SKILL.md` to plugin `skills/<name>/SKILL.md`
2. Copy each agent from template `agents/<name>.yml` to plugin `agents/<name>.yml`
3. Update `plugin.json` `skills` array: `["./skills/brainstorming", "./skills/writing-plans", ...]` (all 12)
4. Update `plugin.json` `agents` array: `["./agents/code-reviewer", "./agents/test-writer", "./agents/security-auditor", "./agents/devops-sre"]`
5. Run `claude plugin validate .` — confirm no missing references
6. `git commit -m "feat: migrate 12 skills and 4 agents from template"`

### Task 3: Migrate hooks into plugin and verify hook registration
**Files:** 5 hook scripts in `hooks/`
**Success criteria:** After installing the plugin into the template, hooks fire on their configured events
**Steps:**
1. Copy `pre-bash-safety.sh`, `post-write-lint.sh`, `pre-commit-secrets.sh`, `session-start.sh` from template `.claude/hooks/` to plugin `hooks/`
2. Create `hooks/post-commit-release-note.sh` — stub that appends commit summary to `CHANGELOG.unreleased.md`
3. Update `plugin.json` `hooks` array: `["./hooks/pre-bash-safety", "./hooks/post-write-lint", "./hooks/pre-commit-secrets", "./hooks/session-start", "./hooks/post-commit-release-note"]`
4. In the template, temporarily install the plugin from local path
5. Run `claude plugin details tapway-superpowers@tapway` — verify hooks appear in component inventory
6. Test: make a commit, verify `post-commit-release-note.sh` executes
7. `git commit -m "feat: migrate 5 hooks including post-commit-release-note"`

### Task 4: Extend pre-bash-safety hook with branch protection and env guarding
**Files:** `hooks/pre-bash-safety.sh`
**Success criteria:** Commits directly to `main`/`master` are blocked; prod-indicator commands require confirmation; dev-only commands on prod env are blocked
**Steps:**
1. Add branch protection: detect `git commit` on `main`/`master` branch, block with message "Commits to main are blocked. Create a feature branch: git checkout -b feat/<name>"
2. Add env guarding patterns:
   - Detect `DATABASE_URL` containing `prod`/`production` → require `ALLOW_PROD=1` env var or block
   - Detect `docker compose.*production` / `docker compose.*prod` → block unless `ALLOW_PROD=1`
   - Detect `alembic upgrade` with prod connection strings → block unless `ALLOW_PROD=1`
   - Detect `--production` flag → block unless `ALLOW_PROD=1`
3. Write inline tests as comments documenting expected behavior for each pattern
4. `git commit -m "feat: add branch protection and env guarding to pre-bash safety hook"`

### Task 5: Build post-commit release note hook
**Files:** `hooks/post-commit-release-note.sh`
**Success criteria:** Every commit appends a formatted entry to `CHANGELOG.unreleased.md`; entry includes commit type, scope, message, and timestamp
**Steps:**
1. Read the latest commit message via `git log -1 --format=%B`
2. Parse conventional commit format: `type(scope): message` or `type: message`
3. If not conventional-commit format, skip (no release note entry)
4. Append formatted line to `CHANGELOG.unreleased.md`:
   ```
   - **feat(auth):** add JWT refresh token rotation (2026-05-25, a1b2c3d)
   ```
5. If `CHANGELOG.unreleased.md` doesn't exist, create it with a header
6. Test with a sample commit, verify the file is appended correctly
7. `git commit -m "feat: add post-commit release note generation hook"`

### Task 6: Build /release slash command
**Files:** `.claude/commands/release.md`
**Success criteria:** Running `/release patch|minor|major` bumps version, collates release notes, creates git tag, and clears unreleased changelog
**Steps:**
1. Create `.claude/commands/release.md` with description "Bump version, generate release notes, and tag a release"
2. Command logic:
   - Read argument: `patch` (0.1.0 → 0.1.1), `minor` (0.1.0 → 0.2.0), or `major` (0.1.0 → 1.0.0)
   - Read current version from `VERSION` file (create if missing, default `0.1.0`)
   - Bump version using semver logic
   - Read `CHANGELOG.unreleased.md`, prepend to `CHANGELOG.md` under new version header
   - Clear `CHANGELOG.unreleased.md`
   - Write new version to `VERSION`
   - Git add, commit: `chore: bump version to X.Y.Z`
   - Git tag: `vX.Y.Z`
3. `git commit -m "feat: add /release command for semver bump and release notes"`

### Task 7: Build /upgrade-skills slash command
**Files:** `.claude/commands/upgrade-skills.md`
**Success criteria:** Running `/upgrade-skills` updates all installed plugins to latest, updates marketplaces, and reports what changed
**Steps:**
1. Create `.claude/commands/upgrade-skills.md` with description "Update all Claude Code plugins and marketplaces to latest versions"
2. Command logic:
   - Run `claude plugin marketplace update` for all marketplaces
   - Run `claude plugin update tapway-superpowers@tapway`
   - Run `claude plugin update andrej-karpathy-skills@karpathy-skills`
   - Run `claude plugin update claude-code-setup@claude-plugins-official`
   - Report: "Updated: tapway-superpowers 0.1.0 → 0.2.0, ..."
   - Restart required note: "Restart Claude Code to apply plugin updates"
3. `git commit -m "feat: add /upgrade-skills command for plugin updates"`

### Task 8: Update template settings.json and CLAUDE.md
**Files:** `.claude/settings.json`, `CLAUDE.md`
**Success criteria:** settings.json references the plugin and registers all hooks; CLAUDE.md documents the new workflow features and upgrade process
**Steps:**
1. Update `settings.json`:
   - Ensure `enabledPlugins` includes `"tapway-superpowers@tapway": true`
   - Ensure `extraKnownMarketplaces` includes the tapway marketplace with correct GitHub URL
   - Add `PostToolUse` hook registration for `post-commit-release-note.sh` on `Bash(git commit *)` matcher if not auto-registered by plugin
   - Add env var: `ALLOW_PROD=0` as default safety
2. Update `CLAUDE.md`:
   - Add "Plugin-powered Skills" section explaining skills/agents come from plugin, not local files
   - Add "Branch Management" section: never commit to main, branches auto-created per feature
   - Add "Environment Safety" section: prod operations require explicit `ALLOW_PROD=1`
   - Add "Release Workflow" section: conventional commits → auto release notes → `/release patch|minor|major`
   - Add "Upgrading Skills" section: run `/upgrade-skills` to pull latest plugin versions
3. `git commit -m "docs: wire template to tapway-superpowers plugin with full workflow docs"`

### Task 9: Remove local copies of skills and agents from template
**Files:** 12 skill directories, 4 agent files (DELETE)
**Success criteria:** After plugin install, `claude plugin details tapway-superpowers@tapway` shows all components active; no duplicate skill invocation
**Steps:**
1. Remove `.claude/skills/*/` directories (keep only commands)
2. Remove `agents/*.yml` files
3. Remove `.claude/hooks/*.sh` files only if Task 3 confirmed plugin hooks auto-register — otherwise keep hooks in template
4. Verify: restart Claude Code, confirm skills are still available via plugin
5. Verify: run a test commit, confirm hooks still fire
6. `git commit -m "refactor: remove local skills/agents — now served by tapway-superpowers plugin"`

### Task 10: End-to-end validation and existing-repo upgrade test
**Files:** None (testing task)
**Success criteria:** Fresh clone of template auto-installs plugins and all guards work; existing repo successfully upgrades via documented flow
**Steps:**
1. Fresh clone test:
   - Clone template into a temp directory, open in Claude Code
   - Verify `tapway-superpowers` plugin auto-installs
   - Verify `andrej-karpathy-skills` plugin auto-installs
   - Verify `claude-code-setup` plugin auto-installs
   - Verify all 12 skills are available via Skill tool
   - Attempt to commit to `main` → confirm hook blocks it
   - Attempt prod command → confirm hook blocks it
   - Make a conventional commit → confirm release note appears in `CHANGELOG.unreleased.md`
2. Existing repo upgrade test:
   - Take an existing repo without the template
   - Run `claude plugin marketplace add <tapway-url>`
   - Run `claude plugin install tapway-superpowers@tapway`
   - Verify skills are available
   - Verify hooks are active (if auto-registered) or document manual settings.json merge needed
3. Document any gaps found in CLAUDE.md
4. `git commit -m "test: validate fresh-clone and existing-repo upgrade flows"`

---

## Execution Options

After saving, ask:
> "Should I execute this plan inline (batch with checkpoints) or using subagent-driven-development (fresh agent per task)?"