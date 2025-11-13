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

const JobForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
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

  // Actualizar el form cuando cambien los initialValues (para edición)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm({
        title: initialValues.title || '',
        description: initialValues.description || '',
        requirements: initialValues.requirements || []
      })
    }
  }, [initialValues])

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

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      requirements: []
    })
    setErrors({})
    setSearchTerm('')
    setShowDropdown(false)
  }

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

    // Solo resetear si NO es edición
    if (!isEditing) {
      resetForm()
    }
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        {/* Header del formulario - solo en modo creación */}
        {!isEditing && (
          <div className='bg-blue-50 border-l-4 border-blue-600 px-6 py-4 rounded-lg'>
            <h3 className='text-xl font-bold text-gray-900 mb-1'>
              📝 Crear Nueva Oferta
            </h3>
            <p className='text-gray-600 text-sm'>
              Completa los detalles de la oferta de trabajo
            </p>
          </div>
        )}

        {/* Título */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Título del puesto *
          </label>
          <Input
            name='title'
            value={form.title}
            onChange={handleChange}
            placeholder='ej. Desarrollador Full Stack Senior'
          />
          {errors.title && (
            <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors.title}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Descripción del puesto *
          </label>
          <textarea
            name='description'
            value={form.description}
            onChange={handleChange}
            placeholder='Describe las responsabilidades, requisitos y beneficios del puesto...'
            rows={6}
            className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
          />
          {errors.description && (
            <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors.description}
            </p>
          )}
        </div>

        {/* Requisitos */}
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
            <p className='text-red-500 text-sm mt-2 flex items-center gap-1'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {errors.requirements}
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
          <p className='text-sm text-gray-500'>* Campos requeridos</p>
          <Button
            type='submit'
            className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg'>
            {isEditing ? '💾 Actualizar Oferta' : '✨ Crear Oferta'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default JobForm
