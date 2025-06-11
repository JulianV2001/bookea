import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import Calendar from '@/components/Calendar'

export default function DashboardPage() {
  // Estos datos vendrían de la base de datos después de la autenticación
  const businessName = "Fulbito FC"
  const userName = "Martín"

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar businessName={businessName} />
        <main className="flex-1">
          <Calendar userName={userName} />
        </main>
      </div>
    </div>
  )
} 