import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0eaff] via-white to-[#c7e0ff]'>
      <h1 className='text-3xl font-bold mb-4'>
        Bienvenido al Portal de Ofertas de Trabajo
      </h1>
      <div className='flex gap-4 mb-4'>
        <button
          onClick={() => navigate('/jobs')}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
          Ver ofertas de trabajo
        </button>
        <button
          onClick={handleLogout}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
