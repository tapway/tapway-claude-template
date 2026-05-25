import { AuthLayout } from '@/components/layouts/auth/AuthLayout'

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}