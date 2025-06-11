'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface Payment {
  id: string
  clientName: string
  amount: number
  date: string
  status: 'completed' | 'pending'
  method: 'cash' | 'transfer'
  service: string
}

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      clientName: 'Juan Pérez',
      amount: 1500,
      date: '2024-03-15',
      status: 'completed',
      method: 'cash',
      service: 'Cancha de Fútbol 5'
    },
    {
      id: '2',
      clientName: 'María García',
      amount: 1200,
      date: '2024-03-14',
      status: 'pending',
      method: 'transfer',
      service: 'Corte de pelo'
    }
  ])

  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)

  // Calcular totales
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const pendingPayments = payments.filter(p => p.status === 'pending')
  const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0)

  const handleAddPayment = () => {
    setEditingPayment(null)
    setIsModalOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment)
    setIsModalOpen(true)
  }

  const handleDeletePayment = (paymentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      setPayments(payments.filter(payment => payment.id !== paymentId))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPayment: Payment = {
      id: editingPayment?.id || Math.random().toString(36).substr(2, 9),
      clientName: formData.get('clientName') as string,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string,
      status: formData.get('status') as 'completed' | 'pending',
      method: formData.get('method') as 'cash' | 'transfer',
      service: formData.get('service') as string
    }

    if (editingPayment) {
      setPayments(payments.map(payment => 
        payment.id === editingPayment.id ? newPayment : payment
      ))
    } else {
      setPayments([...payments, newPayment])
    }

    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar businessName="Fulbito FC" />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Encabezado y Filtros */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Gestión de Pagos</h1>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                  >
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="year">Último año</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="completed">Completados</option>
                    <option value="pending">Pendientes</option>
                  </select>
                  <button 
                    onClick={handleAddPayment}
                    className="flex items-center px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Registrar Pago
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ingresos Totales</p>
                    <p className="text-2xl font-semibold text-gray-800">${totalRevenue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pendientes</p>
                    <p className="text-2xl font-semibold text-gray-800">${totalPending}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Pagos */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Historial de Pagos</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.clientName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{payment.service}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${payment.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{payment.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {payment.method === 'cash' ? 'Efectivo' : 'Transferencia'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          `}>
                            {payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="text-[#006AFC] hover:text-blue-600"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para agregar/editar pago */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingPayment ? 'Editar Pago' : 'Registrar Pago'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingPayment?.clientName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Servicio</label>
                <input
                  type="text"
                  name="service"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingPayment?.service}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto</label>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingPayment?.amount}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingPayment?.date}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                <select
                  name="method"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingPayment?.method}
                >
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  name="status"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingPayment?.status}
                >
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006AFC] text-white rounded-md hover:bg-blue-600"
                >
                  {editingPayment ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 