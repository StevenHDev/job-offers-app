import { useNavigate, useLocation } from 'react-router-dom'
import Button from './Button'

const DashboardLayout = ({
  children,
  user = { name: 'Brooklyn Simmons', email: 'brook.simmons@example.com' },
  onLogout
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Panel', icon: '📊' },
    { path: '/jobs', label: 'Ofertas', icon: '💼' },
    { path: '/my-applications', label: 'Postulaciones', icon: '📝' },
    { path: '/reclutadores', label: 'Reclutadores', icon: '👥' },
    { path: '/settings', label: 'Configuración', icon: '⚙️' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <aside className='w-72 bg-white shadow-xl flex flex-col justify-between min-h-screen border-r border-gray-200'>
        {/* Logo */}
        <div className='p-6'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center'>
              <span className='text-white text-xl font-bold'>P</span>
            </div>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Postora
            </h2>
          </div>

          {/* Navigation */}
          <nav className='flex flex-col gap-1'>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }
                `}>
                <span className='text-xl'>{item.icon}</span>
                <span className='font-medium'>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className='p-6 border-t border-gray-200'>
          <div className='bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl mb-4 border border-blue-200'>
            <p className='text-xs font-semibold text-gray-700 mb-1'>
              Plan Free
            </p>
            <p className='text-xs text-gray-600 mb-3'>Hasta 3 canales</p>
            <Button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm py-2 shadow-md'>
              ✨ Upgrade Now
            </Button>
          </div>
          <Button
            className='w-full bg-red-500 hover:bg-red-600 text-white py-3 shadow-md'
            onClick={onLogout}>
            🚪 Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col min-h-screen'>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10'>
          <div className='px-8 py-4 flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Panel de Publicación
              </h1>
              <p className='text-sm text-gray-500 mt-1'>
                Gestiona tus ofertas de trabajo
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200'>
                <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center'>
                  <span className='text-white font-semibold text-sm'>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <p className='font-semibold text-gray-900 text-sm'>
                    {user.name}
                  </p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className='flex-1 p-8 overflow-auto'>{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout
