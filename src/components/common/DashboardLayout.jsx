import { useNavigate } from 'react-router-dom'
import Button from './Button'

const DashboardLayout = ({
  children,
  user = { name: 'Brooklyn Simmons', email: 'brook.simmons@example.com' },
  onLogout
}) => {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex'>
      {/* Sidebar */}
      <aside className='w-64 bg-white border-r flex flex-col justify-between py-6 px-4 min-h-screen'>
        <div>
          <h2 className='text-xl font-bold mb-8 text-blue-700'>Postora</h2>
          <nav className='flex flex-col gap-2'>
            <Button
              className='w-full text-left'
              onClick={() => navigate('/dashboard')}>
              Panel
            </Button>
            <Button
              className='w-full text-left'
              onClick={() => navigate('/jobs')}>
              Ofertas
            </Button>
            <Button
              className='w-full text-left'
              onClick={() => navigate('/my-applications')}>
              Mis Postulaciones
            </Button>
            <Button
              className='w-full text-left'
              onClick={() => navigate('/reclutadores')}>
              Reclutadores
            </Button>
            <Button
              className='w-full text-left'
              onClick={() => navigate('/settings')}>
              Configuración
            </Button>
          </nav>
        </div>
        <div className='mt-8'>
          <div className='bg-blue-50 p-3 rounded mb-2 text-xs text-blue-700'>
            <span className='font-semibold'>Plan Free:</span> hasta 3 canales.
            <br />
            <Button className='mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white'>
              Upgrade Now
            </Button>
          </div>
          <Button
            className='w-full bg-red-500 hover:bg-red-600 mt-2'
            onClick={onLogout}>
            Cerrar sesión
          </Button>
        </div>
      </aside>
      {/* Main Content */}
      <main className='flex-1 p-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Panel de Publicación
          </h1>
          <div className='flex items-center gap-2'>
            <span className='font-semibold text-gray-700'>{user.name}</span>
            <span className='bg-gray-200 rounded-full px-3 py-1 text-xs'>
              {user.email}
            </span>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
