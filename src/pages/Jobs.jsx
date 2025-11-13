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
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchJobs = async () => {
    const { data } = await getJobs()
    let filtered = Array.isArray(data) ? data : []
    if (filters.status)
      filtered = filtered.filter((j) => j.status === filters.status)
    if (filters.employment_type)
      filtered = filtered.filter(
        (j) => j.employment_type === filters.employment_type
      )
    if (searchTerm)
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    setTotal(filtered.length)
    setJobs(filtered.slice((page - 1) * pageSize, page * pageSize))
  }

  const exportToCSV = () => {
    const headers = ['Título', 'Descripción', 'Estado', 'Creado']
    const rows = jobs.map((job) => [
      job.title,
      job.description,
      job.status,
      job.created_at ? new Date(job.created_at).toLocaleDateString() : ''
    ])
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ofertas.csv'
    a.click()
  }

  useEffect(() => {
    fetchJobs()
  }, [filters, page, pageSize, searchTerm])

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
      <div className='w-full max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>
              Ofertas de Trabajo
            </h2>
            <p className='text-gray-500 mt-1'>
              Gestiona todas las ofertas de empleo
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md'
              onClick={exportToCSV}>
              📥 Exportar CSV
            </Button>
            <Button
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md'
              onClick={() => navigate('/create-job')}>
              ➕ Crear Oferta
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mb-6 flex gap-4 items-center'>
          <input
            type='text'
            placeholder='🔍 Buscar por título o descripción...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
          />
        </div>

        {/* Filters */}
        <JobFilters filters={filters} onChange={handleFilterChange} />

        {/* Table */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gradient-to-r from-blue-500 to-blue-600'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    Título
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    Descripción
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    Estado
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider'>
                    Creado
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan='5'
                      className='px-6 py-12 text-center text-gray-500'>
                      No hay ofertas disponibles
                    </td>
                  </tr>
                ) : (
                  jobs.map((job, index) => (
                    <tr
                      key={job.id}
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {job.title}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600 line-clamp-2'>
                          {job.description}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'closed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {job.created_at
                          ? new Date(job.created_at).toLocaleDateString()
                          : ''}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        <div className='flex justify-center gap-2'>
                          <Button
                            className='bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md transition-all text-xs'
                            onClick={() => handleEdit(job)}>
                            ✏️ Editar
                          </Button>
                          <Button
                            className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-all text-xs'
                            onClick={() => handleDelete(job.id)}>
                            🗑️ Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
          <h3 className='text-xl font-bold mb-4'>Editar Oferta</h3>
          <JobForm initialValues={editingJob} onSubmit={handleUpdate} />
          <Button
            className='mt-4 bg-gray-300 text-gray-800 hover:bg-gray-400'
            onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
        </Modal>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-between items-center mt-6 px-4'>
            <div className='text-sm text-gray-600'>
              Mostrando {(page - 1) * pageSize + 1} a{' '}
              {Math.min(page * pageSize, total)} de {total} ofertas
            </div>
            <div className='flex gap-2'>
              <button
                className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all'
                onClick={() => setPage(page - 1)}
                disabled={page === 1}>
                ← Anterior
              </button>
              <div className='flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium'>
                Página {page} de {totalPages}
              </div>
              <button
                className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all'
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}>
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// ...existing code...

export default Jobs
