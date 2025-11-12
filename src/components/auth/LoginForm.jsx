import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    setLoading(false)
    if (error) setError(error.message)
    else {
      setError('')
      setUser(data.user)
      navigate('/dashboard')
    }
  }

  return (
    <div className='w-96 p-6 rounded-xl shadow-2xl bg-white/90 relative'>
      <div className='flex flex-col items-center mb-6'>
        <div className='bg-blue-600 rounded-full p-3 mb-2 shadow-lg'>
          <User className='text-white w-6 h-6' />
        </div>
        <h2 className='text-3xl font-extrabold text-blue-700 mb-1'>
          Bienvenido
        </h2>
        <p className='text-gray-500 text-sm'>
          Accede a tu cuenta para continuar
        </p>
      </div>
      <form onSubmit={handleLogin} className='space-y-4'>
        <div>
          <label
            className='block text-gray-700 mb-1 font-medium'
            htmlFor='email'>
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50'
          />
        </div>
        <div>
          <label
            className='block text-gray-700 mb-1 font-medium'
            htmlFor='password'>
            Contraseña
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Contraseña'
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md'
          disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        {error && (
          <p className='mt-2 text-red-500 text-center text-sm'>{error}</p>
        )}
      </form>
      <div className='absolute -bottom-8 left-0 right-0 flex justify-center'>
        <span className='bg-white px-4 py-1 rounded-full shadow text-gray-400 text-xs'>
          Portal de Ofertas de Trabajo
        </span>
      </div>
      <div className='mt-4 text-center'>
        <span className='text-gray-600'>¿No tienes cuenta?</span>
        <Link
          to='/register'
          className='ml-2 text-blue-600 hover:underline font-semibold'>
          Regístrate
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
