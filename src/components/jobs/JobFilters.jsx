import React from 'react'
import Select from '../common/Select'
import Input from '../common/Input'

const JobFilters = ({ filters, onChange }) => {
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6'>
      <div className='flex items-center mb-4'>
        <svg
          className='w-5 h-5 text-blue-600 mr-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
          />
        </svg>
        <h3 className='text-lg font-semibold text-gray-800'>Filtros</h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Select
          name='status'
          value={filters.status}
          onChange={onChange}
          label='Estado'>
          <option value=''>Todos los estados</option>
          <option value='active'>Activa</option>
          <option value='closed'>Cerrada</option>
          <option value='draft'>Borrador</option>
        </Select>

        <Select
          name='employment_type'
          value={filters.employment_type}
          onChange={onChange}
          label='Tipo de empleo'>
          <option value=''>Todos los tipos</option>
          <option value='full-time'>Tiempo completo</option>
          <option value='part-time'>Medio tiempo</option>
          <option value='internship'>Prácticas</option>
          <option value='contract'>Contrato</option>
        </Select>

        <Input
          type='text'
          name='search'
          value={filters.search}
          onChange={onChange}
          label='Buscar'
          placeholder='Título o empresa...'
          icon={
            <svg
              className='w-5 h-5 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          }
        />
      </div>
    </div>
  )
}

export default JobFilters
