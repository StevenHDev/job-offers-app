import React, { useEffect, useState } from 'react'
import {
  getApplicationsByJob,
  updateApplicationStatus
} from '../services/applicationService'

const ApplicationListManage = ({ jobId }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  useEffect(() => {
    getApplicationsByJob(jobId).then(({ data }) => {
      setApplications(data || [])
      setLoading(false)
    })
  }, [jobId])

  const handleStatusChange = async (appId, newStatus) => {
    await updateApplicationStatus(appId, newStatus)
    setApplications(
      applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    )
  }

  const filteredApps = status
    ? applications.filter((app) => app.status === status)
    : applications

  if (loading)
    return <div className='text-center py-10'>Cargando postulaciones...</div>

  return (
    <div className='max-w-3xl mx-auto py-10'>
      <h2 className='text-xl font-bold mb-6'>Gestionar Postulaciones</h2>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className='mb-4 px-3 py-2 border rounded'>
        <option value=''>Todos los estados</option>
        <option value='pending'>Pendiente</option>
        <option value='reviewed'>Revisada</option>
        <option value='accepted'>Aceptada</option>
        <option value='rejected'>Rechazada</option>
      </select>
      <ul className='space-y-4'>
        {filteredApps.map((app) => (
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
            <select
              value={app.status}
              onChange={(e) => handleStatusChange(app.id, e.target.value)}
              className='mt-2 px-2 py-1 border rounded'>
              <option value='pending'>Pendiente</option>
              <option value='reviewed'>Revisada</option>
              <option value='accepted'>Aceptada</option>
              <option value='rejected'>Rechazada</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ApplicationListManage
