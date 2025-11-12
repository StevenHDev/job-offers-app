import React from 'react'
import Select from '../common/Select'
import Input from '../common/Input'

const JobFilters = ({ filters, onChange }) => {
  return (
    <div className='flex flex-wrap gap-4 mb-6'>
      <Select
        name='status'
        value={filters.status}
        onChange={onChange}
        className='w-40'>
        <option value=''>Estado</option>
        <option value='active'>Activa</option>
        <option value='closed'>Cerrada</option>
        <option value='draft'>Borrador</option>
      </Select>
      <Select
        name='employment_type'
        value={filters.employment_type}
        onChange={onChange}
        className='w-40'>
        <option value=''>Tipo de empleo</option>
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
        placeholder='Buscar por título o empresa'
        className='w-64'
      />
    </div>
  )
}

export default JobFilters
