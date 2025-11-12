import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getJobById } from '../services/jobService'
import JobDetail from '../components/jobs/JobDetail'

const JobDetails = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobById(id).then((data) => {
      setJob(data)
      setLoading(false)
    })
  }, [id])

  if (loading)
    return <div className='text-center py-10'>Cargando oferta...</div>

  return <JobDetail job={job} />
}

export default JobDetails
