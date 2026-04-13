# /test-all — Run Full Test Suite

Run all tests across frontend and backend, report results.

## Steps

1. **Backend tests:**
   ```bash
   cd backend && make test
   ```
   Report: total tests, passed, failed, coverage %

2. **Frontend tests:**
   ```bash
   cd frontend && npm run test -- --coverage
   ```
   Report: total tests, passed, failed, coverage %

3. **Type checks:**
   ```bash
   cd frontend && npx tsc --noEmit
   cd backend && mypy src/
   ```

4. **Lint:**
   ```bash
   cd frontend && npm run lint
   cd backend && ruff check src/
   ```

5. **Summarize:** Produce a test report with overall status ✅/❌ and any failures that need attention.

## Failure Protocol

If any tests fail:
1. Show the failing test names and error messages
2. Identify root cause
3. Propose a fix (invoke `systematic-debugging` skill if needed)
4. Do NOT mark the task complete until all tests pass
