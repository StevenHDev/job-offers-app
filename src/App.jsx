import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import CreateJob from './pages/CreateJob'
import MyApplications from './pages/MyApplications'
import RecruiterDashboard from './pages/RecruiterDashboard'
import NotFound from './pages/NotFound'

function App() {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    // Obtener sesión actual al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log('App - Sesión restaurada:', session.user)
        setUser(session.user)
      } else {
        console.log('App - No hay sesión activa')
      }
    })

    // Escuchar cambios en la autenticación
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('App - Auth state changed:', _event, session?.user)
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:id' element={<JobDetails />} />
        <Route path='/create-job' element={<CreateJob />} />
        <Route path='/my-applications' element={<MyApplications />} />
        <Route path='/reclutadores' element={<RecruiterDashboard />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
