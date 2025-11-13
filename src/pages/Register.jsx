import RegisterForm from '../components/auth/RegisterForm'

export default function Register() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Brand */}
        <div className='text-center mb-8'>
          <div className='inline-block bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-4 mb-4 shadow-lg'>
            <svg
              className='w-12 h-12'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Crear Cuenta
          </h1>
          <p className='text-gray-600'>Únete a nuestra plataforma de empleos</p>
        </div>

        {/* Form Container */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className='text-center text-gray-600 mt-6 text-sm'>
          © 2024 Job Offers App. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
