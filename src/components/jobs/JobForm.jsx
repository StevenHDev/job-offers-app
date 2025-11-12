import { useState } from 'react'
import { z } from 'zod'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'

const jobSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  description: z.string().min(10, 'La descripción es obligatoria'),
  company_info: z.string().min(2, 'La empresa es obligatoria'),
  location: z.string().min(2, 'La ubicación es obligatoria'),
  employment_type: z.enum(['full-time', 'part-time', 'internship', 'contract']),
  status: z.enum(['active', 'closed', 'draft']),
  responsibilities: z.array(z.string().min(2)).min(1),
  requirements: z.array(z.string().min(2)).min(1),
  benefits: z.array(z.string().min(2)).min(1)
})

const JobForm = ({ onSubmit, initialValues = {} }) => {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    company_info: initialValues.company_info || '',
    location: initialValues.location || '',
    employment_type: initialValues.employment_type || '',
    status: initialValues.status || 'active',
    responsibilities: initialValues.responsibilities || [''],
    requirements: initialValues.requirements || [''],
    benefits: initialValues.benefits || ['']
  })
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleArrayChange = (field, idx, value) => {
    setForm({
      ...form,
      [field]: form[field].map((item, i) => (i === idx ? value : item))
    })
  }

  const handleAddArrayItem = (field) => {
    setForm({ ...form, [field]: [...form[field], ''] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = jobSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      setShowPreview(false)
      return
    }
    setErrors({})
    setShowPreview(true)
    onSubmit(form)
  }

  return (
    <>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <Input
          name='title'
          value={form.title}
          onChange={handleChange}
          placeholder='Título'
        />
        {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}
        <Input
          name='company_info'
          value={form.company_info}
          onChange={handleChange}
          placeholder='Empresa'
        />
        {errors.company_info && (
          <p className='text-red-500 text-sm'>{errors.company_info}</p>
        )}
        <Input
          name='location'
          value={form.location}
          onChange={handleChange}
          placeholder='Ubicación'
        />
        {errors.location && (
          <p className='text-red-500 text-sm'>{errors.location}</p>
        )}
        <Select
          name='employment_type'
          value={form.employment_type}
          onChange={handleChange}>
          <option value=''>Tipo de empleo</option>
          <option value='full-time'>Tiempo completo</option>
          <option value='part-time'>Medio tiempo</option>
          <option value='internship'>Prácticas</option>
          <option value='contract'>Contrato</option>
        </Select>
        {errors.employment_type && (
          <p className='text-red-500 text-sm'>{errors.employment_type}</p>
        )}
        <Select name='status' value={form.status} onChange={handleChange}>
          <option value='active'>Activa</option>
          <option value='closed'>Cerrada</option>
          <option value='draft'>Borrador</option>
        </Select>
        {errors.status && (
          <p className='text-red-500 text-sm'>{errors.status}</p>
        )}
        <textarea
          name='description'
          value={form.description}
          onChange={handleChange}
          placeholder='Descripción'
          className='w-full px-3 py-2 border rounded'
        />
        {errors.description && (
          <p className='text-red-500 text-sm'>{errors.description}</p>
        )}
        <div>
          <label className='block font-semibold'>Responsabilidades</label>
          {form.responsibilities.map((r, i) => (
            <Input
              key={i}
              value={r}
              onChange={(e) =>
                handleArrayChange('responsibilities', i, e.target.value)
              }
              className='mb-2'
            />
          ))}
          <Button
            type='button'
            className='bg-gray-200 text-gray-800 hover:bg-gray-300 px-2 py-1'
            onClick={() => handleAddArrayItem('responsibilities')}>
            Agregar
          </Button>
          {errors.responsibilities && (
            <p className='text-red-500 text-sm'>{errors.responsibilities}</p>
          )}
        </div>
        <div>
          <label className='block font-semibold'>Requisitos</label>
          {form.requirements.map((r, i) => (
            <Input
              key={i}
              value={r}
              onChange={(e) =>
                handleArrayChange('requirements', i, e.target.value)
              }
              className='mb-2'
            />
          ))}
          <Button
            type='button'
            className='bg-gray-200 text-gray-800 hover:bg-gray-300 px-2 py-1'
            onClick={() => handleAddArrayItem('requirements')}>
            Agregar
          </Button>
          {errors.requirements && (
            <p className='text-red-500 text-sm'>{errors.requirements}</p>
          )}
        </div>
        <div>
          <label className='block font-semibold'>Beneficios</label>
          {form.benefits.map((b, i) => (
            <Input
              key={i}
              value={b}
              onChange={(e) => handleArrayChange('benefits', i, e.target.value)}
              className='mb-2'
            />
          ))}
          <Button
            type='button'
            className='bg-gray-200 text-gray-800 hover:bg-gray-300 px-2 py-1'
            onClick={() => handleAddArrayItem('benefits')}>
            Agregar
          </Button>
          {errors.benefits && (
            <p className='text-red-500 text-sm'>{errors.benefits}</p>
          )}
        </div>
        <Button type='submit'>Guardar oferta</Button>
      </form>
      {showPreview && (
        <div className='mt-8 p-6 bg-gray-50 rounded shadow'>
          <h3 className='text-xl font-bold mb-2'>Vista previa de la oferta</h3>
          <p>
            <strong>Título:</strong> {form.title}
          </p>
          <p>
            <strong>Empresa:</strong> {form.company_info}
          </p>
          <p>
            <strong>Ubicación:</strong> {form.location}
          </p>
          <p>
            <strong>Tipo de empleo:</strong> {form.employment_type}
          </p>
          <p>
            <strong>Estado:</strong> {form.status}
          </p>
          <p>
            <strong>Descripción:</strong> {form.description}
          </p>
          <div>
            <strong>Responsabilidades:</strong>
            <ul className='list-disc ml-6'>
              {form.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Requisitos:</strong>
            <ul className='list-disc ml-6'>
              {form.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Beneficios:</strong>
            <ul className='list-disc ml-6'>
              {form.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default JobForm
