import React, { useEffect, useState } from 'react'
import {
  getApplicationsByJob,
  updateApplicationStatus
} from '../../services/applicationService'
import Modal from '../common/Modal'

const ApplicationListManage = ({ jobId, onStatusChange }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null)

  useEffect(() => {
    if (jobId) {
      getApplicationsByJob(jobId).then(({ data }) => {
        setApplications(data || [])
        setLoading(false)
      })
    }
  }, [jobId])

  const handleStatusChange = async (appId, newStatus) => {
    await updateApplicationStatus(appId, newStatus)
    setApplications(
      applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    )
    // Llamar callback si existe
    if (onStatusChange) {
      onStatusChange()
    }
  }

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

  const filteredApps =
    filterStatus === 'all'
      ? applications
      : applications.filter((app) => app.status === filterStatus)

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === 'pending').length,
    reviewed: applications.filter((app) => app.status === 'reviewed').length,
    accepted: applications.filter((app) => app.status === 'accepted').length,
    rejected: applications.filter((app) => app.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4'></div>
          <p className='text-gray-600'>Cargando postulaciones...</p>
        </div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className='text-center py-12'>
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
        <p className='text-gray-500'>
          Aún no se han recibido aplicaciones para esta oferta.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Stats */}
      <div className='grid grid-cols-5 gap-4'>
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-3 rounded-lg border-2 transition-all ${
            filterStatus === 'all'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
          <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
          <div className='text-xs text-gray-600 mt-1'>Total</div>
        </button>

        <button
          onClick={() => setFilterStatus('pending')}
          className={`p-3 rounded-lg border-2 transition-all ${
            filterStatus === 'pending'
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
          <div className='text-2xl font-bold text-amber-600'>
            {stats.pending}
          </div>
          <div className='text-xs text-gray-600 mt-1'>Pendientes</div>
        </button>

        <button
          onClick={() => setFilterStatus('reviewed')}
          className={`p-3 rounded-lg border-2 transition-all ${
            filterStatus === 'reviewed'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
          <div className='text-2xl font-bold text-blue-600'>
            {stats.reviewed}
          </div>
          <div className='text-xs text-gray-600 mt-1'>Revisadas</div>
        </button>

        <button
          onClick={() => setFilterStatus('accepted')}
          className={`p-3 rounded-lg border-2 transition-all ${
            filterStatus === 'accepted'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
          <div className='text-2xl font-bold text-green-600'>
            {stats.accepted}
          </div>
          <div className='text-xs text-gray-600 mt-1'>Aceptadas</div>
        </button>

        <button
          onClick={() => setFilterStatus('rejected')}
          className={`p-3 rounded-lg border-2 transition-all ${
            filterStatus === 'rejected'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}>
          <div className='text-2xl font-bold text-red-600'>
            {stats.rejected}
          </div>
          <div className='text-xs text-gray-600 mt-1'>Rechazadas</div>
        </button>
      </div>

      {/* Lista de aplicaciones */}
      <div className='space-y-3'>
        {filteredApps.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            No hay postulaciones con el estado seleccionado
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className='bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold'>
                      {app.profiles?.full_name?.charAt(0).toUpperCase() ||
                        app.candidate_name?.charAt(0).toUpperCase() ||
                        'U'}
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {app.profiles?.full_name ||
                          app.candidate_name ||
                          'Sin nombre'}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        {app.profiles?.email ||
                          app.candidate_email ||
                          'Sin email'}
                      </p>
                    </div>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                <div className='flex items-center gap-4'>
                  <a
                    href={app.cv_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium'>
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
                    Descargar CV
                  </a>

                  {app.cover_letter && (
                    <button
                      onClick={() =>
                        setSelectedCoverLetter({
                          name: app.profiles?.full_name,
                          text: app.cover_letter
                        })
                      }
                      className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 font-medium'>
                      <svg
                        className='w-4 h-4'
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
                      Ver carta
                    </button>
                  )}

                  <span className='text-xs text-gray-400'>
                    {new Date(app.applied_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'>
                  <option value='pending'>Pendiente</option>
                  <option value='reviewed'>Revisada</option>
                  <option value='accepted'>Aceptada</option>
                  <option value='rejected'>Rechazada</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para carta de presentación */}
      {selectedCoverLetter && (
        <Modal
          open={!!selectedCoverLetter}
          onClose={() => setSelectedCoverLetter(null)}
          title={`Carta de ${selectedCoverLetter.name}`}
          size='lg'>
          <div className='prose max-w-none'>
            <p className='whitespace-pre-wrap text-gray-700'>
              {selectedCoverLetter.text}
            </p>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ApplicationListManage
