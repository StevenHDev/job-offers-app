import React from 'react'
import JobForm from '../components/jobs/JobForm'
import { createJob } from '../services/jobService'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/common/DashboardLayout'

const CreateJob = () => {
  const navigate = useNavigate()
  const handleSubmit = async (form) => {
    console.log('Creating job with data:', form)
    await createJob(form)
    // navigate('/jobs')
  }
  return (
    <DashboardLayout>
      <div className='max-w-2xl w-full py-10'>
        <h2 className='text-2xl font-bold mb-6'>Crear Oferta de Trabajo</h2>
        <JobForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  )
}

export default CreateJob
