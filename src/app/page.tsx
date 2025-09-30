import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-50 flex-col">
      <h1 className="text-3xl font-bold text-center mb-6">Belvo App</h1>
      <LoginForm />
    </main>
  )
}
