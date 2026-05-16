# /cleanup — Pre-Review Cleanup

Scan the project for template placeholders, leftover scaffolding code,
unnecessary boilerplate files, and stale configuration before code review.

## Steps

1. **Invoke the `pre-review-cleanup` skill**
2. Scan for:
   - `[PLACEHOLDER]` brackets in docs and config files
   - Scaffold boilerplate (`# TODO`, `501 Not Implemented`, "replace this")
   - Unnecessary Dockerfiles (GPU variants if CPU-only)
   - Starter models/routes that don't fit your project
   - Missing `.env` or stale configuration
3. Present findings and ask before deleting anything
4. After cleanup, recommend running `/review`

## Usage

```
/cleanup                          # Full cleanup scan
```
