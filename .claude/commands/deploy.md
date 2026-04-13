# /deploy — Deployment Checklist

Run through the pre-deployment checklist before shipping to production.

## Steps

1. **Check branch** — must be deploying from `main` or a release branch
2. **Verify CI** — all GitHub Actions checks passing
3. **Run tests** — `make test` in backend, `npm run test` in frontend
4. **Check migrations** — any pending Alembic migrations? (`alembic current` vs `alembic heads`)
5. **Review env vars** — confirm all required env vars are set in deployment target
6. **Feature flags** — any flags that need to be enabled/disabled?
7. **Rollback plan** — what's the rollback procedure if this fails?
8. **Notify team** — post in #deployments Slack channel

## Output

Produce a deployment summary card:
```
## Deployment Summary
- Branch: main @ [SHA]
- Tests: ✅ Passing
- Migrations: [None / N pending]
- Feature flags: [None changed]
- Rollback: git revert [SHA] → redeploy
- Notified: #deployments
```
