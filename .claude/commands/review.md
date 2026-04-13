# /review — Code Review

Perform a thorough code review of the current changes or the specified file/PR.

## Steps

1. **Invoke the `code-review` skill** before starting
2. Run `git diff HEAD` (or `git diff main...HEAD` for branch review)
3. Check against project conventions in CLAUDE.md
4. Review for:
   - Security issues (SQL injection, XSS, exposed secrets, unvalidated inputs)
   - Performance problems (N+1 queries, missing indexes, unnecessary re-renders)
   - Type safety (no `any` in TypeScript, Pydantic models in Python)
   - Test coverage (are critical paths tested?)
   - Error handling (are all error cases handled gracefully?)
   - Code style (follows project conventions)
5. Output a structured review with: **Summary**, **Issues** (Critical / Warning / Suggestion), **Verdict** (Approve / Request Changes)

## Usage

```
/review                          # Review all uncommitted changes
/review src/api/auth.py         # Review a specific file
/review feat/user-auth           # Review a branch vs main
```
