import React from 'react'

const JobFilters = ({ filters, onChange }) => {
  return (
    <div className='flex flex-wrap gap-4 mb-6'>
      <select
        name='status'
        value={filters.status}
        onChange={onChange}
        className='px-3 py-2 border rounded'>
        <option value=''>Estado</option>
        <option value='active'>Activa</option>
        <option value='closed'>Cerrada</option>
        <option value='draft'>Borrador</option>
      </select>
      <select
        name='employment_type'
        value={filters.employment_type}
        onChange={onChange}
        className='px-3 py-2 border rounded'>
        <option value=''>Tipo de empleo</option>
        <option value='full-time'>Tiempo completo</option>
        <option value='part-time'>Medio tiempo</option>
        <option value='internship'>Prácticas</option>
        <option value='contract'>Contrato</option>
      </select>
      <input
        type='text'
        name='search'
        value={filters.search}
        onChange={onChange}
        placeholder='Buscar por título o empresa'
        className='px-3 py-2 border rounded w-64'
      />
    </div>
  )
}

export default JobFilters
