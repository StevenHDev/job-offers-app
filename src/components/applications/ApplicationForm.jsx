import React, { useState } from 'react'
import toast from 'react-hot-toast'
import FileUpload from '../common/FileUpload'
import { uploadCV } from '../../services/applicationService'
import Button from '../common/Button'
import Input from '../common/Input'

const ApplicationForm = ({ jobId, onSubmit }) => {
  const [file, setFile] = useState(null)
  const [candidateName, setCandidateName] = useState('')
  const [candidateEmail, setCandidateEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validar solo el CV (nombre y email son opcionales)
    if (!file) {
      setError('Debes subir tu CV en PDF.')
      return
    }

    // Validar formato de email solo si se proporciona
    if (candidateEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(candidateEmail)) {
        setError('El email no es válido.')
        return
      }
    }

    setLoading(true)

    // Subir CV (usar timestamp si no hay email)
    const uniqueId = candidateEmail.trim()
      ? candidateEmail.replace(/[^a-zA-Z0-9]/g, '_')
      : `candidate_${Date.now()}`
    const { url, error: uploadError } = await uploadCV(file, uniqueId)

    if (uploadError) {
      setError(
        `Error al subir el CV: ${uploadError.message || 'Error desconocido'}`
      )
      setLoading(false)
      return
    }

    // Crear postulación
    const applicationData = {
      job_id: jobId,
      candidate_id: null, // Sin relación a cuenta
      candidate_name: candidateName.trim(),
      candidate_email: candidateEmail.trim().toLowerCase(),
      cv_url: url,
      cover_letter: null
    }

    // Esperar a que se cree la aplicación
    const result = await onSubmit(applicationData)

    // Verificar si hubo error al crear la aplicación
    if (result && result.error) {
      setError(
        `Error al crear la postulación: ${
          result.error.message || 'Error desconocido'
        }`
      )
      setLoading(false)
      return
    }

    toast.success('¡Postulación enviada exitosamente!')

    // Limpiar formulario
    setFile(null)
    setCandidateName('')
    setCandidateEmail('')
    setLoading(false)
  }

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
        <h3 className='font-semibold text-blue-900 mb-2'>
          Información del Candidato
        </h3>
        <p className='text-sm text-blue-700'>
          Completa tus datos y sube tu CV para postularte
        </p>
      </div>

      <Input
        label='Nombre completo (opcional)'
        type='text'
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
        placeholder='Juan Pérez'
      />

      <Input
        label='Email (opcional)'
        type='email'
        value={candidateEmail}
        onChange={(e) => setCandidateEmail(e.target.value)}
        placeholder='tu@email.com'
      />

      <FileUpload onFileSelect={handleFileSelect} label='Subir CV (PDF)' />

      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
          <div className='flex'>
            <svg
              className='w-5 h-5 text-red-500 mr-2'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
            <p className='text-sm text-red-700'>{error}</p>
          </div>
        </div>
      )}

      <Button type='submit' disabled={loading} className='w-full'>
        {loading ? (
          <div className='flex items-center justify-center'>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
            </svg>
            Enviando postulación...
          </div>
        ) : (
          '🚀 Postularme'
        )}
      </Button>
    </form>
  )
}

export default ApplicationForm
