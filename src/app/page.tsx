// Home page — تعرض الـ dashboard مباشرة بدون أي redirect
// نستخدم نفس صفحة /dashboard لكن على مسار /
import DashboardPage from './dashboard/page'

export default function Home() {
  return <DashboardPage />
}
