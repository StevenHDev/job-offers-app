import React from 'react'

const JobDetail = ({ job }) => {
  if (!job) return <div>No se encontró la oferta.</div>
  return (
    <div className='max-w-2xl mx-auto bg-white p-6 rounded shadow'>
      <h2 className='text-2xl font-bold mb-2'>{job.title}</h2>
      <p className='text-gray-600 mb-2'>{job.company_info}</p>
      <p className='text-gray-500 mb-2'>
        {job.location} | {job.employment_type}
      </p>
      <div className='mb-4'>
        <strong>Descripción:</strong>
        <p>{job.description}</p>
      </div>
      <div className='mb-4'>
        <strong>Responsabilidades:</strong>
        <ul className='list-disc ml-6'>
          {job.responsibilities?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
      <div className='mb-4'>
        <strong>Requisitos:</strong>
        <ul className='list-disc ml-6'>
          {job.requirements?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
      <div className='mb-4'>
        <strong>Beneficios:</strong>
        <ul className='list-disc ml-6'>
          {job.benefits?.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
      <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
        Postularme
      </button>
    </div>
  )
}

export default JobDetail
