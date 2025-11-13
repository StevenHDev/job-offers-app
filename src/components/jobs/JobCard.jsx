import Card from '../common/Card'
import Button from '../common/Button'

export default function JobCard({ job, onEdit, onDelete }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  }

  const typeIcons = {
    'full-time': '🕒',
    'part-time': '⏰',
    internship: '🎓',
    contract: '📝'
  }

  return (
    <Card hover>
      <div className='space-y-3'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3 className='font-bold text-xl text-gray-800 mb-1'>
              {job.title}
            </h3>
            <p className='text-gray-600 font-medium'>{job.company_info}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[job.status] || statusColors.draft
            }`}>
            {job.status === 'active'
              ? 'Activa'
              : job.status === 'closed'
              ? 'Cerrada'
              : 'Borrador'}
          </span>
        </div>

        {/* Info */}
        <div className='flex items-center gap-4 text-sm text-gray-500'>
          <div className='flex items-center gap-1'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            <span>{job.location}</span>
          </div>
          <div className='flex items-center gap-1'>
            <span>{typeIcons[job.employment_type] || '💼'}</span>
            <span className='capitalize'>
              {job.employment_type?.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Salary */}
        {job.salary_range && (
          <div className='flex items-center gap-2 text-green-600 font-semibold'>
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>{job.salary_range}</span>
          </div>
        )}

        {/* Description */}
        <p className='text-gray-600 text-sm line-clamp-2'>{job.description}</p>

        {/* Actions */}
        <div className='flex gap-2 pt-2 border-t border-gray-100'>
          <Button
            variant='warning'
            onClick={() => onEdit(job)}
            className='flex-1'>
            ✏️ Editar
          </Button>
          <Button
            variant='danger'
            onClick={() => onDelete(job.id)}
            className='flex-1'>
            🗑️ Eliminar
          </Button>
        </div>
      </div>
    </Card>
  )
}
