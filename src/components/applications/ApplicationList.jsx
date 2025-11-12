import React, { useEffect, useState } from 'react'
import { getApplicationsByJob } from '../services/applicationService'

const ApplicationsList = ({ jobId }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getApplicationsByJob(jobId).then(({ data }) => {
      setApplications(data || [])
      setLoading(false)
    })
  }, [jobId])

  if (loading)
    return <div className='text-center py-10'>Cargando postulaciones...</div>

  return (
    <div className='max-w-3xl mx-auto py-10'>
      <h2 className='text-xl font-bold mb-6'>Postulaciones a la oferta</h2>
      <ul className='space-y-4'>
        {applications.map((app) => (
          <li key={app.id} className='bg-white p-4 rounded shadow'>
            <p>
              <strong>Nombre:</strong> {app.profiles?.full_name}
            </p>
            <p>
              <strong>Email:</strong> {app.profiles?.email}
            </p>
            <p>
              <strong>Estado:</strong> {app.status}
            </p>
            <a
              href={app.cv_url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 underline'>
              Descargar CV
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ApplicationsList
