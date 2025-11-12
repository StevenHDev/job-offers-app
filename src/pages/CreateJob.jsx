import React from 'react'
import JobForm from '../components/jobs/JobForm'
import { createJob } from '../services/jobService'
import { useNavigate } from 'react-router-dom'

const CreateJob = () => {
  const navigate = useNavigate()
  const handleSubmit = async (form) => {
    await createJob(form)
    navigate('/jobs')
  }
  return (
    <div className='max-w-2xl mx-auto py-10'>
      <h2 className='text-2xl font-bold mb-6'>Crear Oferta de Trabajo</h2>
      <JobForm onSubmit={handleSubmit} />
    </div>
  )
}

export default CreateJob
