import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bienvenido a Bookea
        </h1>
        <p className="text-center text-xl mb-8">
          Sistema de Gestión de Turnos
        </p>
        <div className="flex justify-center">
          <Link 
            href="/dashboard" 
            className="px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
} 