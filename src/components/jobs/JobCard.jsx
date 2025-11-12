import Card from '../common/Card'
import Button from '../common/Button'

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <Card>
      <h3 className='font-semibold text-lg'>{job.title}</h3>
      <p className='text-gray-600'>{job.company_info}</p>
      <p className='text-gray-500 text-sm'>
        {job.location} | {job.employment_type}
      </p>
      <div className='flex gap-2 mt-4'>
        <Button
          className='bg-yellow-400 hover:bg-yellow-500'
          onClick={() => onEdit(job)}>
          Editar
        </Button>
        <Button
          className='bg-red-500 hover:bg-red-600'
          onClick={() => onDelete(job.id)}>
          Eliminar
        </Button>
      </div>
    </Card>
  )
}
