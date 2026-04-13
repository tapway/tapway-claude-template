/**
 * Shared TypeScript types for the frontend.
 * Keep this in sync with backend Pydantic schemas.
 */

// ─── Pagination ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  has_next: boolean
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  created_at: string
}

export interface AuthToken {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

// ─── API Responses ─────────────────────────────────────────────────────────
export interface ApiError {
  detail: string
  status: number
}

export type ApiResponse<T> = { data: T; error: null } | { data: null; error: ApiError }

// ─── Add your domain types below ────────────────────────────────────────────
