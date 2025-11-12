import { useEffect, useState } from 'react'
import { getJobs, deleteJob, updateJob } from '../services/jobService'
import JobFilters from '../components/jobs/JobFilters'
import JobForm from '../components/jobs/JobForm'

const Jobs = () => {
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
    <div className='max-w-3xl mx-auto py-10'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Ofertas de Trabajo
      </h2>
      <JobFilters filters={filters} onChange={handleFilterChange} />
      <ul className='space-y-4'>
        {jobs.map((job) => (
          <li key={job.id}>
            <JobCard job={job} onEdit={handleEdit} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
      {showEditModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded shadow w-full max-w-lg'>
            <h3 className='text-xl font-bold mb-4'>Editar Oferta</h3>
            <JobForm initialValues={editingJob} onSubmit={handleUpdate} />
            <button
              className='mt-4 px-4 py-2 bg-gray-300 rounded'
              onClick={() => setShowEditModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
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
  )
}

// ...existing code...

export default Jobs
