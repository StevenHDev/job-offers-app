import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import DashboardLayout from '../components/common/DashboardLayout'

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <section>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <Card className='flex flex-col items-center justify-center h-40'>
            <span className='text-3xl mb-2'>📄</span>
            <span className='font-semibold'>Ofertas</span>
            <Button className='mt-2 w-full' onClick={() => navigate('/jobs')}>
              Ver Ofertas
            </Button>
          </Card>
          <Card className='flex flex-col items-center justify-center h-40'>
            <span className='text-3xl mb-2'>📝</span>
            <span className='font-semibold'>Mis Postulaciones</span>
            <Button
              className='mt-2 w-full'
              onClick={() => navigate('/my-applications')}>
              Ver Postulaciones
            </Button>
          </Card>
          <Card className='flex flex-col items-center justify-center h-40'>
            <span className='text-3xl mb-2'>👥</span>
            <span className='font-semibold'>Reclutadores</span>
            <Button
              className='mt-2 w-full'
              onClick={() => navigate('/reclutadores')}>
              Ver Reclutadores
            </Button>
          </Card>
          <Card className='flex flex-col items-center justify-center h-40'>
            <span className='text-3xl mb-2'>⚙️</span>
            <span className='font-semibold'>Configuración</span>
            <Button
              className='mt-2 w-full'
              onClick={() => navigate('/settings')}>
              Ir a Configuración
            </Button>
          </Card>
          <Card className='flex flex-col items-center justify-center h-40'>
            <span className='text-3xl mb-2'>➕</span>
            <span className='font-semibold'>Crear Oferta</span>
            <Button
              className='mt-2 w-full'
              onClick={() => navigate('/create-job')}>
              Crear Oferta
            </Button>
          </Card>
        </div>
      </section>
    </DashboardLayout>
  )
}
