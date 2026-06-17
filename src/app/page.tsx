import { redirect } from 'next/navigation'

// Server-side redirect — single, definitive, no loop possible
export default function Home() {
  redirect('/dashboard')
}
