export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className='bg-white p-4 rounded shadow'>
      <h3 className='font-semibold text-lg'>{job.title}</h3>
      <p className='text-gray-600'>{job.company_info}</p>
      <p className='text-gray-500 text-sm'>
        {job.location} | {job.employment_type}
      </p>
      <div className='flex gap-2 mt-4'>
        <button
          className='px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500'
          onClick={() => onEdit(job)}>
          Editar
        </button>
        <button
          className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
          onClick={() => onDelete(job.id)}>
          Eliminar
        </button>
      </div>
    </div>
  )
}
