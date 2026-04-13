# /new-feature — Start a New Feature

Structured workflow for implementing a new feature using superpowers methodology.

## Steps

1. **Brainstorm** (invoke `brainstorming` skill)
   - Clarify requirements and edge cases
   - Explore 2-3 implementation approaches
   - Identify risks and dependencies

2. **Plan** (invoke `writing-plans` skill)
   - Break into bite-sized tasks (2–5 min each)
   - Map all files to create/modify
   - Write the plan to `docs/plans/[feature-name].md`

3. **Create branch**
   ```bash
   git checkout -b feat/[feature-name]
   ```
   Consider using `git-worktrees` skill for parallel work.

4. **Implement with TDD** (invoke `tdd` skill)
   - For each task: write test → see it fail → implement → see it pass → commit
   - Use `subagent-driven-development` skill for complex multi-file tasks

5. **Review** (invoke `code-review` skill)
   - Self-review before opening PR
   - Run `/test-all`

6. **Verify** (invoke `verification` skill)
   - Confirm all spec requirements met
   - No regressions

7. **Open PR** — use the PR template in `.github/pull_request_template.md`
