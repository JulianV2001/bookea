import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#006AFC] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Bienvenido a Bookea
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            El sistema de gestión de turnos más completo para tu negocio
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Organiza, gestiona y optimiza las reservas de tu negocio de manera simple y eficiente
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/onboarding/niche-selection" 
            className="inline-flex items-center px-8 py-4 bg-[#006AFC] text-white text-lg font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Iniciar
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <div className="text-sm text-gray-500">
            ¿Ya tienes una cuenta? 
            <Link href="/login" className="text-[#006AFC] hover:underline ml-1">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 