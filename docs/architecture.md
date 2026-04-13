# Architecture

## System Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌───────────────┐
│   Next.js 14    │  HTTP   │   FastAPI        │   SQL   │  PostgreSQL   │
│   (Vercel)      │────────▶│   (Railway/Fly)  │────────▶│               │
│   Port 3000     │         │   Port 8000      │         │   Port 5432   │
└─────────────────┘         └──────────────────┘         └───────────────┘
        │                           │
        │                           │
        ▼                           ▼
   [Auth Provider]            [External APIs]
```

## Key Design Decisions

### API Design
- All backend routes versioned under `/api/v1/`
- RESTful conventions; JSON request/response
- Pydantic models for all inputs and outputs (no untyped dicts)
- Error responses always follow `{"detail": "message"}` format

### Authentication
- JWT access tokens (15 min expiry) + refresh tokens (7 days)
- Tokens stored in httpOnly cookies (not localStorage)
- All routes auth-protected by default; explicitly mark public routes

### Database
- SQLAlchemy ORM with async sessions
- Alembic for all schema migrations (never edit DB directly)
- All queries use parameterized statements (ORM handles this)
- Base model includes `id` (UUID), `created_at`, `updated_at`

### Frontend Data Fetching
- React Query for all server state (caching, invalidation, loading states)
- All API calls go through `src/services/api.ts` — never raw fetch in components
- Zod for runtime validation of API responses

## Adding a New Feature

1. Start with `/new-feature` command in Claude Code
2. Design the DB schema changes (new migration)
3. Write the Pydantic schemas
4. Write the SQLAlchemy service layer
5. Wire up the FastAPI route
6. Write the TypeScript types to match
7. Build the React Query hook
8. Build the UI component
9. Write tests at each layer

## ADRs (Architecture Decision Records)

| # | Decision | Date | Status |
|---|---|---|---|
| 001 | Use FastAPI over Django | [DATE] | Accepted |
| 002 | Use React Query over Redux | [DATE] | Accepted |
| 003 | Use JWT over session cookies | [DATE] | Accepted |

Add new ADRs to `docs/adr/` when making significant technical decisions.
