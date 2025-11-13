import { useState, useEffect } from 'react'
import { z } from 'zod'
import Input from '../common/Input'
import Button from '../common/Button'
import Select from '../common/Select'
import {
  getRequirements,
  createRequirement
} from '../../services/requirementService'

const jobSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  description: z.string().min(10, 'La descripción es obligatoria'),
  requirements: z.array(z.string()).min(1)
})

const JobForm = ({ onSubmit, initialValues = {} }) => {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    requirements: initialValues.requirements || [] // array de UUIDs
  })
  const [errors, setErrors] = useState({})
  const [allRequirements, setAllRequirements] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loadingReq, setLoadingReq] = useState(false)

  useEffect(() => {
    getRequirements().then(({ data }) => {
      setAllRequirements(data || [])
    })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddRequirement = async (reqName) => {
    // Buscar si ya existe
    const existing = allRequirements.find(
      (r) => r.name.toLowerCase() === reqName.toLowerCase()
    )

    if (existing) {
      // Si existe, agregarlo si no está ya seleccionado
      if (!form.requirements.includes(existing.id)) {
        setForm((prev) => ({
          ...prev,
          requirements: [...prev.requirements, existing.id]
        }))
      }
    } else {
      // Si no existe, crearlo
      setLoadingReq(true)
      const { data } = await createRequirement(reqName.trim())
      setLoadingReq(false)
      if (data && data[0]) {
        setAllRequirements((prev) => [...prev, data[0]])
        setForm((prev) => ({
          ...prev,
          requirements: [...prev.requirements, data[0].id]
        }))
      }
    }
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleRemoveRequirement = (reqId) => {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((id) => id !== reqId)
    }))
  }

  const filteredRequirements = allRequirements.filter(
    (req) =>
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !form.requirements.includes(req.id)
  )

  const selectedRequirements = allRequirements.filter((req) =>
    form.requirements.includes(req.id)
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = jobSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      if (result.error && result.error.errors) {
        result.error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    onSubmit(form)
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <Input
        name='title'
        value={form.title}
        onChange={handleChange}
        placeholder='Título'
      />
      {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}
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
        <label className='block font-semibold mb-2 text-gray-700'>
          Requisitos
        </label>

        {/* Tags de requisitos seleccionados */}
        {selectedRequirements.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-3'>
            {selectedRequirements.map((req) => (
              <span
                key={req.id}
                className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium'>
                {req.name}
                <button
                  type='button'
                  onClick={() => handleRemoveRequirement(req.id)}
                  className='hover:bg-blue-200 rounded-full p-0.5'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input de búsqueda */}
        <div className='relative'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder='Buscar o agregar requisito...'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />

          {/* Dropdown con resultados */}
          {showDropdown && (
            <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto'>
              {loadingReq ? (
                <div className='px-4 py-3 text-sm text-gray-500'>
                  Creando requisito...
                </div>
              ) : filteredRequirements.length > 0 ? (
                <>
                  {filteredRequirements.map((req) => (
                    <button
                      key={req.id}
                      type='button'
                      onClick={() => handleAddRequirement(req.name)}
                      className='w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm'>
                      <svg
                        className='w-4 h-4 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      {req.name}
                    </button>
                  ))}
                  {searchTerm.trim() && (
                    <button
                      type='button'
                      onClick={() => handleAddRequirement(searchTerm.trim())}
                      className='w-full px-4 py-2 text-left hover:bg-blue-50 border-t border-gray-100 flex items-center gap-2 text-sm text-blue-600 font-medium'>
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 4v16m8-8H4'
                        />
                      </svg>
                      Crear &quot;{searchTerm.trim()}&quot;
                    </button>
                  )}
                </>
              ) : searchTerm.trim() ? (
                <button
                  type='button'
                  onClick={() => handleAddRequirement(searchTerm.trim())}
                  className='w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-2 text-sm text-blue-600 font-medium'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                  Crear &quot;{searchTerm.trim()}&quot;
                </button>
              ) : (
                <div className='px-4 py-3 text-sm text-gray-500'>
                  Escribe para buscar o crear un requisito
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón para cerrar dropdown al hacer click fuera */}
        {showDropdown && (
          <div
            className='fixed inset-0 z-0'
            onClick={() => setShowDropdown(false)}
          />
        )}

        {errors.requirements && (
          <p className='text-red-500 text-sm mt-2'>{errors.requirements}</p>
        )}
      </div>
      <Button type='submit'>Guardar oferta</Button>
    </form>
  )
}

export default JobForm
