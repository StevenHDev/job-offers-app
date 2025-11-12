import React, { useEffect, useState } from 'react'
import { getJobs } from '../services/jobService'
import { getApplicationsByJob } from '../services/applicationService'

const RecruiterStats = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs().then(({ data }) => {
      const myJobs = data ? data.filter((j) => j.posted_by === recruiterId) : []
      setJobs(myJobs)
      Promise.all(myJobs.map((job) => getApplicationsByJob(job.id))).then(
        (results) => {
          const allApps = results.flatMap((r) => r.data || [])
          setApplications(allApps)
          setLoading(false)
        }
      )
    })
  }, [recruiterId])

  const totalOffers = jobs.length
  const totalApplications = applications.length
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  if (loading)
    return <div className='text-center py-10'>Cargando estadísticas...</div>

  return (
    <div className='max-w-2xl mx-auto py-10'>
      <h2 className='text-xl font-bold mb-6'>Estadísticas</h2>
      <p>
        <strong>Total de ofertas:</strong> {totalOffers}
      </p>
      <p>
        <strong>Total de postulaciones:</strong> {totalApplications}
      </p>
      <div className='mt-4'>
        <strong>Postulaciones por estado:</strong>
        <ul className='list-disc ml-6'>
          {Object.entries(statusCounts).map(([status, count]) => (
            <li key={status}>
              {status}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RecruiterStats
