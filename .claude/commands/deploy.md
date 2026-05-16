# /deploy — Deployment Checklist

Run through the pre-deployment checklist before shipping to production.
Steps are generated dynamically based on the project's actual stack and
deployment configuration.

## Instructions

1. **Detect the project's deployment context** by reading:
   - `CLAUDE.md` — the `## 🏗️ Tech Stack` section (hosting, CI/CD, containers)
   - `Dockerfile` / `docker-compose.yml` — container build config
   - `.github/workflows/` — CI/CD pipeline definitions
   - Any `Dockerfile` variants (CPU, CUDA, ROCm, Jetson) — pick the right target
   - `k8s/` or `helm/` directories — Kubernetes deployment configs
   - `serverless.yml`, `amplify.yml`, `terraform/` — platform-specific configs
   - `Makefile` — for build/test/ deploy targets

2. **Generate the checklist** covering these areas (only include what's
   relevant to the detected stack):

   - **Branch check** — deploying from `main` or a release branch?
   - **CI status** — all GitHub Actions / CI checks passing?
   - **Tests** — run the project's actual test suite (detect command from
     Makefile, package.json, etc.)
   - **Migrations** — check for pending database migrations using the actual
     migration tool (Alembic, Prisma, Flyway, etc.)
   - **Environment variables** — verify all required vars are set in the
     deployment target environment
   - **Docker build** — build the correct image variant (cpu/cuda/rocm/jetson)
   - **Feature flags** — any flags to toggle?
   - **Rollback plan** — git revert + redeploy, or platform-specific rollback

3. **Output a deployment summary card** at the end.

## Deployment Summary Format

```markdown
## Deployment Summary
- Branch: main @ [SHA]
- Target: [e.g., AWS EKS / Railway / Vercel / Jetson Orin]
- Tests: ✅ Passing
- Migrations: [None / N pending]
- Docker tag: [e.g., ghcr.io/org/service:cpu-latest]
- Feature flags: [None changed / list changes]
- Rollback: [git revert SHA → redeploy / helm rollback]
- Notified: [#deployments channel]
```
