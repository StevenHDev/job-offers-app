import React, { useEffect, useState } from 'react'
import { getAllApplications } from '../services/applicationService'
import DashboardLayout from '../components/common/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Modal from '../components/common/Modal'

const MyApplications = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null)

  useEffect(() => {
    console.log('MyApplications - Cargando todas las aplicaciones')
    getAllApplications().then(({ data, error }) => {
      console.log('MyApplications - Aplicaciones recibidas:', data)
      console.log('MyApplications - Error:', error)
      setApplications(data || [])
      setLoading(false)
    })
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: 'Pendiente',
        className: 'bg-amber-100 text-amber-700 border-amber-200'
      },
      reviewed: {
        label: 'Revisada',
        className: 'bg-blue-100 text-blue-700 border-blue-200'
      },
      accepted: {
        label: 'Aceptada',
        className: 'bg-green-100 text-green-700 border-green-200'
      },
      rejected: {
        label: 'Rechazada',
        className: 'bg-red-100 text-red-700 border-red-200'
      }
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <span className='w-1.5 h-1.5 rounded-full bg-current mr-1.5'></span>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout onLogout={handleLogout}>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4'></div>
            <p className='text-gray-600'>Cargando postulaciones...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!applications || applications.length === 0) {
    return (
      <DashboardLayout onLogout={handleLogout}>
        <div className='max-w-6xl w-full mx-auto px-4 py-10'>
          <h2 className='text-3xl font-bold mb-8 text-gray-900'>
            📋 Todas las Postulaciones
          </h2>
          <div className='text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4'>
              <svg
                className='w-8 h-8 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-1'>
              No hay postulaciones
            </h3>
            <p className='text-gray-500 mb-6'>
              Aún no hay postulaciones registradas en el sistema.
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              Buscar ofertas
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className='max-w-6xl w-full mx-auto px-4 py-10'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            📋 Todas las Postulaciones
          </h2>
          <p className='text-gray-600'>
            Visualiza todas las aplicaciones de trabajo del sistema
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {applications.map((app) => (
            <div
              key={app.id}
              className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow'>
              {/* Header con gradiente */}
              <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4'>
                <h3 className='font-semibold text-lg text-white mb-1'>
                  {app.jobs?.title || 'Título no disponible'}
                </h3>
                {(app.profiles?.full_name || app.candidate_name) && (
                  <p className='text-sm text-blue-50'>
                    Candidato: {app.profiles?.full_name || app.candidate_name}
                  </p>
                )}
                {(app.profiles?.email || app.candidate_email) && (
                  <p className='text-xs text-blue-100'>
                    📧 {app.profiles?.email || app.candidate_email}
                  </p>
                )}
              </div>

              {/* Contenido */}
              <div className='p-6'>
                {/* Descripción del job */}
                {app.jobs?.description && (
                  <div className='mb-4'>
                    <h4 className='text-xs font-semibold text-gray-500 uppercase mb-1'>
                      Descripción de la oferta
                    </h4>
                    <p className='text-sm text-gray-600 line-clamp-3'>
                      {app.jobs.description}
                    </p>
                  </div>
                )}

                {/* Carta de presentación */}
                {app.cover_letter && (
                  <div className='mb-4'>
                    <h4 className='text-xs font-semibold text-gray-500 uppercase mb-1'>
                      Tu carta de presentación
                    </h4>
                    <p className='text-sm text-gray-600 line-clamp-2 mb-2'>
                      {app.cover_letter}
                    </p>
                    <button
                      onClick={() =>
                        setSelectedCoverLetter({
                          job: app.jobs?.title,
                          text: app.cover_letter
                        })
                      }
                      className='text-xs text-blue-600 hover:text-blue-700 font-medium'>
                      Leer completa →
                    </button>
                  </div>
                )}

                {/* Estado */}
                <div className='mb-4'>{getStatusBadge(app.status)}</div>

                {/* Footer */}
                <div className='pt-4 border-t border-gray-100 flex items-center justify-between'>
                  <span className='text-xs text-gray-500'>
                    {new Date(app.applied_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <div className='flex gap-2'>
                    <a
                      href={app.cv_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                      CV
                    </a>
                    {app.jobs?.id && (
                      <button
                        onClick={() => navigate(`/jobs/${app.jobs.id}`)}
                        className='inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700 font-medium'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                        Ver oferta
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para ver carta de presentación completa */}
      {selectedCoverLetter && (
        <Modal
          open={!!selectedCoverLetter}
          onClose={() => setSelectedCoverLetter(null)}
          title={`Carta de presentación - ${selectedCoverLetter.job}`}
          size='lg'>
          <div className='prose max-w-none'>
            <p className='whitespace-pre-wrap text-gray-700'>
              {selectedCoverLetter.text}
            </p>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default MyApplications
