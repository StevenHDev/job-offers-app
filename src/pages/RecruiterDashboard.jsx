import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getJobs } from '../services/jobService'
import {
  createApplication,
  getApplicationsByJob
} from '../services/applicationService'
import DashboardLayout from '../components/common/DashboardLayout'
import ApplicationListManage from '../components/applications/ApplicationListManage'
import ApplicationForm from '../components/applications/ApplicationForm'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const RecruiterDashboard = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null) // Nuevo: guardar solo el ID
  const [applications, setApplications] = useState([])
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [showCreateApplicationModal, setShowCreateApplicationModal] =
    useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    const { data } = await getJobs()
    setJobs(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleViewApplications = async (job) => {
    setSelectedJob(job)
    setSelectedJobId(job.id) // Guardar el ID por separado
    console.log('Cargando aplicaciones para el trabajo:', job)
    console.log('Job ID:', job?.id)

    if (!job || !job.id) {
      console.error('Error: job o job.id es undefined')
      return
    }

    const { data, error } = await getApplicationsByJob(job.id)

    if (error) {
      console.error('Error al cargar aplicaciones:', error)
    }

    console.log('Aplicaciones cargadas:', data)
    setApplications(Array.isArray(data) ? data : [])
    setShowApplicationModal(true)
  }

  const handleCreateApplication = (job) => {
    setSelectedJob(job)
    setSelectedJobId(job.id) // Guardar el ID por separado
    setShowCreateApplicationModal(true)
  }

  const handleApplicationSubmit = async (applicationData) => {
    console.log('Creando aplicación con datos:', applicationData)
    const { data, error } = await createApplication(applicationData)

    console.log('Resultado de createApplication:', { data, error })

    if (error) {
      console.error('Error al crear aplicación:', error)
      return { error }
    }

    // Cerrar modal solo si fue exitoso
    setShowCreateApplicationModal(false)

    // Recargar aplicaciones si el modal de aplicaciones está abierto
    // Usar selectedJobId en lugar de selectedJob.id para evitar undefined
    if (showApplicationModal && selectedJobId) {
      console.log('Recargando aplicaciones para job ID:', selectedJobId)
      const { data: updatedApplications } = await getApplicationsByJob(
        selectedJobId
      )
      setApplications(
        Array.isArray(updatedApplications) ? updatedApplications : []
      )
    }

    return { data, error: null }
  }

  if (loading) {
    return (
      <DashboardLayout onLogout={handleLogout}>
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <svg
              className='animate-spin h-12 w-12 text-blue-600 mx-auto mb-4'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
            </svg>
            <p className='text-gray-600 font-medium'>Cargando ofertas...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className='space-y-6'>
        {/* Header */}
        <div className='bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl'>
          <h1 className='text-4xl font-bold mb-2'>Panel de Reclutador 👔</h1>
          <p className='text-purple-100 text-lg'>
            Gestiona tus ofertas y postulaciones
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card hover>
            <div className='text-center p-4'>
              <div className='text-5xl mb-3'>📋</div>
              <div className='text-3xl font-bold text-blue-600 mb-1'>
                {jobs.length}
              </div>
              <p className='text-gray-600 font-medium'>Ofertas Publicadas</p>
            </div>
          </Card>

          <Card hover>
            <div className='text-center p-4'>
              <div className='text-5xl mb-3'>✅</div>
              <div className='text-3xl font-bold text-green-600 mb-1'>
                {jobs.filter((j) => j.status === 'active').length}
              </div>
              <p className='text-gray-600 font-medium'>Ofertas Activas</p>
            </div>
          </Card>

          <Card hover>
            <div className='text-center p-4'>
              <div className='text-5xl mb-3'>📝</div>
              <div className='text-3xl font-bold text-purple-600 mb-1'>
                {jobs.filter((j) => j.status === 'draft').length}
              </div>
              <p className='text-gray-600 font-medium'>Borradores</p>
            </div>
          </Card>
        </div>

        {/* Jobs List */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='bg-linear-to-r from-blue-600 to-purple-600 px-6 py-4'>
            <h2 className='text-2xl font-bold text-white'>
              Mis Ofertas Publicadas
            </h2>
          </div>

          <div className='p-6'>
            {jobs.length === 0 ? (
              <div className='text-center py-12'>
                <div className='text-6xl mb-4'>📭</div>
                <p className='text-gray-600 text-lg mb-4'>
                  No tienes ofertas publicadas
                </p>
                <Button
                  variant='primary'
                  onClick={() => navigate('/create-job')}>
                  ➕ Crear Primera Oferta
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {jobs.map((job) => (
                  <Card key={job.id} hover className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <h3 className='font-bold text-xl text-gray-800'>
                            {job.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'closed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {job.status === 'active'
                              ? 'Activa'
                              : job.status === 'closed'
                              ? 'Cerrada'
                              : 'Borrador'}
                          </span>
                        </div>
                        <p className='text-gray-600 mb-2'>{job.company_info}</p>
                        <div className='flex items-center gap-4 text-sm text-gray-500'>
                          <span className='flex items-center gap-1'>
                            📍 {job.location}
                          </span>
                          <span className='flex items-center gap-1'>
                            💼 {job.employment_type}
                          </span>
                        </div>
                      </div>

                      <div className='flex gap-2'>
                        <Button
                          variant='primary'
                          onClick={() => handleViewApplications(job)}
                          className='whitespace-nowrap'>
                          👥 Ver Postulaciones
                        </Button>
                        <Button
                          variant='success'
                          onClick={() => handleCreateApplication(job)}
                          className='whitespace-nowrap'>
                          ➕ Crear Postulación
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para ver aplicaciones */}
      <Modal
        open={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title={`Postulaciones - ${selectedJob?.title || ''}`}
        size='xl'>
        <ApplicationListManage
          jobId={selectedJobId}
          applications={applications}
          onStatusChange={async () => {
            if (selectedJobId) {
              console.log(
                'onStatusChange - Recargando aplicaciones para job ID:',
                selectedJobId
              )
              const { data } = await getApplicationsByJob(selectedJobId)
              setApplications(Array.isArray(data) ? data : [])
            } else {
              console.error('onStatusChange - selectedJobId es undefined')
            }
          }}
        />
      </Modal>

      {/* Modal para crear aplicación */}
      <Modal
        open={showCreateApplicationModal}
        onClose={() => setShowCreateApplicationModal(false)}
        title={`Crear Postulación - ${selectedJob?.title || ''}`}
        size='lg'>
        <ApplicationForm
          jobId={selectedJob?.id}
          userId={user?.id}
          onSubmit={handleApplicationSubmit}
          isAdmin={true}
        />
      </Modal>
    </DashboardLayout>
  )
}

export default RecruiterDashboard
