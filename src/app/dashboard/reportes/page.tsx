'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { CalendarIcon, ChartBarIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

// Datos de ejemplo (después se reemplazarán con datos reales de la base de datos)
const mockData = {
  totalAppointments: 156,
  totalRevenue: 23400,
  mostRequestedService: 'Corte de pelo',
  busiestDay: 'Viernes',
  appointmentsByDay: {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    data: [20, 25, 22, 28, 35, 15, 11]
  },
  serviceDistribution: {
    labels: ['Corte de pelo', 'Corte de barba', 'Tinte', 'Peinado'],
    data: [45, 25, 20, 10]
  },
  trendData: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    data: [35, 42, 38, 45]
  }
}

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [selectedService, setSelectedService] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Configuración de gráficos
  const barChartData = {
    labels: mockData.appointmentsByDay.labels,
    datasets: [
      {
        label: 'Turnos por día',
        data: mockData.appointmentsByDay.data,
        backgroundColor: 'rgba(0, 106, 252, 0.5)',
        borderColor: 'rgb(0, 106, 252)',
        borderWidth: 1,
      },
    ],
  }

  const pieChartData = {
    labels: mockData.serviceDistribution.labels,
    datasets: [
      {
        data: mockData.serviceDistribution.data,
        backgroundColor: [
          'rgba(0, 106, 252, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgb(0, 106, 252)',
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const lineChartData = {
    labels: mockData.trendData.labels,
    datasets: [
      {
        label: 'Tendencia de reservas',
        data: mockData.trendData.data,
        borderColor: 'rgb(0, 106, 252)',
        backgroundColor: 'rgba(0, 106, 252, 0.5)',
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar businessName="Fulbito FC" />
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Encabezado */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Reportes y Estadísticas</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                    />
                    <span>a</span>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                    />
                  </div>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                  >
                    <option value="all">Todos los servicios</option>
                    <option value="corte">Corte de pelo</option>
                    <option value="barba">Corte de barba</option>
                    <option value="tinte">Tinte</option>
                    <option value="peinado">Peinado</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="confirmed">Confirmados</option>
                    <option value="pending">Pendientes</option>
                    <option value="cancelled">Cancelados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CalendarIcon className="h-6 w-6 text-[#006AFC]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Turnos</p>
                    <p className="text-2xl font-semibold text-gray-800">{mockData.totalAppointments}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ingresos Totales</p>
                    <p className="text-2xl font-semibold text-gray-800">${mockData.totalRevenue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Servicio más solicitado</p>
                    <p className="text-2xl font-semibold text-gray-800">{mockData.mostRequestedService}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Día más ocupado</p>
                    <p className="text-2xl font-semibold text-gray-800">{mockData.busiestDay}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Turnos por día</h2>
                <div className="h-[300px]">
                  <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Distribución por servicio</h2>
                <div className="h-[300px]">
                  <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-2">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Tendencia de reservas</h2>
                <div className="h-[300px]">
                  <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 