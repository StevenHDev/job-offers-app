import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJobs, deleteJob, updateJob } from '../services/jobService'
import JobFilters from '../components/jobs/JobFilters'
import JobForm from '../components/jobs/JobForm'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import DashboardLayout from '../components/common/DashboardLayout'

const Jobs = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [editingJob, setEditingJob] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    employment_type: '',
    search: ''
  })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6)
  const [total, setTotal] = useState(0)

  const fetchJobs = async () => {
    const allJobs = await getJobs()
    let filtered = allJobs
    if (filters.status)
      filtered = filtered.filter((j) => j.status === filters.status)
    if (filters.employment_type)
      filtered = filtered.filter(
        (j) => j.employment_type === filters.employment_type
      )
    if (filters.search)
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          (j.company_info &&
            j.company_info.toLowerCase().includes(filters.search.toLowerCase()))
      )
    setTotal(filtered.length)
    setJobs(filtered.slice((page - 1) * pageSize, page * pageSize))
  }

  useEffect(() => {
    fetchJobs()
  }, [filters, page, pageSize])

  const handleEdit = (job) => {
    setEditingJob(job)
    setShowEditModal(true)
  }

  const handleDelete = async (id) => {
    await deleteJob(id)
    fetchJobs()
  }

  const handleUpdate = async (updated) => {
    await updateJob(editingJob.id, updated)
    setShowEditModal(false)
    setEditingJob(null)
    fetchJobs()
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPage(1)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <DashboardLayout>
      <div className='max-w-3xl w-full py-10'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Ofertas de Trabajo
          </h2>
          <Button
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200'
            onClick={() => navigate('/create-job')}>
            Crear Oferta
          </Button>
        </div>
        <JobFilters filters={filters} onChange={handleFilterChange} />
        <ul className='space-y-4'>
          {jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} onEdit={handleEdit} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
        <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
          <h3 className='text-xl font-bold mb-4'>Editar Oferta</h3>
          <JobForm initialValues={editingJob} onSubmit={handleUpdate} />
          <Button
            className='mt-4 bg-gray-300 text-gray-800 hover:bg-gray-400'
            onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
        </Modal>
        {totalPages > 1 && (
          <div className='flex justify-center mt-8 gap-2'>
            <button
              className='px-3 py-1 border rounded disabled:opacity-50'
              onClick={() => setPage(page - 1)}
              disabled={page === 1}>
              Anterior
            </button>
            <span className='px-3 py-1'>
              Página {page} de {totalPages}
            </span>
            <button
              className='px-3 py-1 border rounded disabled:opacity-50'
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}>
              Siguiente
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// ...existing code...

export default Jobs
