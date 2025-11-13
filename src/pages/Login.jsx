import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Brand */}
        <div className='text-center mb-8'>
          <div className='inline-block bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-4 mb-4 shadow-lg'>
            <svg
              className='w-12 h-12'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Job Offers App
          </h1>
          <p className='text-gray-600'>Inicia sesión para continuar</p>
        </div>

        {/* Form Container */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className='text-center text-gray-600 mt-6 text-sm'>
          © 2024 Job Offers App. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
