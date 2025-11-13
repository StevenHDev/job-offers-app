import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import DashboardLayout from '../components/common/DashboardLayout'

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cards = [
    {
      icon: '💼',
      title: 'Ofertas de Trabajo',
      description: 'Explora todas las ofertas disponibles',
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/jobs'),
      buttonText: 'Ver Ofertas',
      buttonVariant: 'primary'
    },
    {
      icon: '📝',
      title: 'Mis Postulaciones',
      description: 'Gestiona tus aplicaciones enviadas',
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/my-applications'),
      buttonText: 'Ver Postulaciones',
      buttonVariant: 'secondary'
    },
    {
      icon: '➕',
      title: 'Crear Oferta',
      description: 'Publica una nueva oferta de trabajo',
      color: 'from-green-500 to-green-600',
      action: () => navigate('/create-job'),
      buttonText: 'Crear Nueva',
      buttonVariant: 'success'
    },
    {
      icon: '📊',
      title: 'Panel de Reclutador',
      description: 'Administra tus ofertas y candidatos',
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/reclutadores'),
      buttonText: 'Ir al Panel',
      buttonVariant: 'warning'
    }
  ]

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className='space-y-8'>
        {/* Welcome Section */}
        <div className='bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl'>
          <h1 className='text-4xl font-bold mb-2'>¡Bienvenido de nuevo! 👋</h1>
          <p className='text-blue-100 text-lg'>{user?.email || 'Usuario'}</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {cards.map((card, index) => (
            <Card key={index} hover className='relative overflow-hidden'>
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${card.color}`}></div>
              <div className='pt-6 pb-4 px-2'>
                <div className='text-5xl mb-4 text-center'>{card.icon}</div>
                <h3 className='font-bold text-xl text-gray-800 mb-2 text-center'>
                  {card.title}
                </h3>
                <p className='text-gray-600 text-sm text-center mb-4'>
                  {card.description}
                </p>
                <Button
                  variant={card.buttonVariant}
                  onClick={card.action}
                  className='w-full'>
                  {card.buttonText}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>
            Acciones Rápidas
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <button
              onClick={() => navigate('/jobs')}
              className='flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all'>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-2xl'>
                🔍
              </div>
              <div className='text-left'>
                <p className='font-semibold text-gray-800'>Buscar Ofertas</p>
                <p className='text-sm text-gray-500'>
                  Encuentra tu próximo trabajo
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/create-job')}
              className='flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all'>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-2xl'>
                ✨
              </div>
              <div className='text-left'>
                <p className='font-semibold text-gray-800'>Publicar Oferta</p>
                <p className='text-sm text-gray-500'>
                  Encuentra al candidato ideal
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/my-applications')}
              className='flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all'>
              <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-2xl'>
                📋
              </div>
              <div className='text-left'>
                <p className='font-semibold text-gray-800'>Mis Aplicaciones</p>
                <p className='text-sm text-gray-500'>Revisa tu progreso</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
