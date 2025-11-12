import React, { useEffect, useState } from 'react'
import { getUserApplications } from '../services/applicationService'

const MyApplications = ({ userId }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserApplications(userId).then(({ data }) => {
      setApplications(data || [])
      setLoading(false)
    })
  }, [userId])

  if (loading)
    return (
      <DashboardLayout>
        <div className='text-center py-10'>Cargando postulaciones...</div>
      </DashboardLayout>
    )

  return (
    <DashboardLayout>
      <div className='max-w-3xl w-full py-10'>
        <h2 className='text-2xl font-bold mb-6'>Mis Postulaciones</h2>
        <ul className='space-y-4'>
          {applications.map((app) => (
            <li key={app.id} className='bg-white p-4 rounded shadow'>
              <h3 className='font-semibold text-lg'>{app.jobs?.title}</h3>
              <p className='text-gray-600'>{app.jobs?.company_info}</p>
              <p className='text-gray-500 text-sm'>{app.jobs?.location}</p>
              <p className='mt-2'>
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
    </DashboardLayout>
  )
}

export default MyApplications
