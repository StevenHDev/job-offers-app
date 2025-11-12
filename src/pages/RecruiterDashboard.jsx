import React, { useEffect, useState } from 'react'
import { getJobs } from '../services/jobService'

const RecruiterDashboard = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs().then(({ data }) => {
      const myJobs = data ? data.filter((j) => j.posted_by === recruiterId) : []
      setJobs(myJobs)
      setLoading(false)
    })
  }, [recruiterId])

  if (loading)
    return <div className='text-center py-10'>Cargando ofertas...</div>

  return (
    <div className='max-w-4xl mx-auto py-10'>
      <h2 className='text-2xl font-bold mb-6'>Mis Ofertas Publicadas</h2>
      <ul className='space-y-4'>
        {jobs.map((job) => (
          <li key={job.id} className='bg-white p-4 rounded shadow'>
            <h3 className='font-semibold text-lg'>{job.title}</h3>
            <p className='text-gray-600'>{job.company_info}</p>
            <p className='text-gray-500 text-sm'>
              {job.location} | {job.employment_type}
            </p>
            <p className='mt-2'>
              <strong>Estado:</strong> {job.status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecruiterDashboard
