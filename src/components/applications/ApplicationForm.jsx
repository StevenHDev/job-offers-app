import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import FileUpload from '../common/FileUpload'
import { uploadCV, hasAlreadyApplied } from '../../services/applicationService'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import { supabase } from '../../lib/supabaseClient'

const ApplicationForm = ({ jobId, userId, onSubmit, isAdmin = false }) => {
  const [file, setFile] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [candidates, setCandidates] = useState([])
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidateName, setCandidateName] = useState('')

  useEffect(() => {
    if (isAdmin) {
      loadCandidates()
    }
  }, [isAdmin])

  const loadCandidates = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .order('email')

    if (!error && data) {
      setCandidates(data)
    }
  }

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Debes subir el CV en PDF.')
      return
    }

    const candidateId = isAdmin ? selectedCandidateId : userId

    if (isAdmin && !selectedCandidateId) {
      setError('Debes seleccionar un candidato.')
      return
    }

    setLoading(true)

    // Verificar si ya existe postulación
    const { exists } = await hasAlreadyApplied(jobId, candidateId)
    if (exists) {
      setError('Este candidato ya ha postulado a esta oferta.')
      setLoading(false)
      return
    }

    // Subir CV
    const { url, error: uploadError } = await uploadCV(file, candidateId)
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
      candidate_id: candidateId,
      cv_url: url,
      cover_letter: coverLetter
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
    setCoverLetter('')
    setSelectedCandidateId('')
    setCandidateEmail('')
    setCandidateName('')
    setLoading(false)
  }

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      {isAdmin && (
        <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
          <h3 className='font-semibold text-blue-900 mb-3'>
            Información del Candidato
          </h3>

          <div className='space-y-4'>
            <Select
              label='Seleccionar candidato existente'
              value={selectedCandidateId}
              onChange={(e) => {
                setSelectedCandidateId(e.target.value)
                const selected = candidates.find((c) => c.id === e.target.value)
                if (selected) {
                  setCandidateEmail(selected.email)
                  setCandidateName(selected.full_name || '')
                }
              }}>
              <option value=''>-- Seleccionar candidato --</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.email}{' '}
                  {candidate.full_name ? `- ${candidate.full_name}` : ''}
                </option>
              ))}
            </Select>

            {selectedCandidateId && (
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Email'
                  type='email'
                  value={candidateEmail}
                  disabled
                  className='bg-gray-100'
                />
                <Input
                  label='Nombre'
                  type='text'
                  value={candidateName}
                  disabled
                  className='bg-gray-100'
                />
              </div>
            )}
          </div>
        </div>
      )}

      <FileUpload
        onFileSelect={handleFileSelect}
        label={isAdmin ? 'CV del Candidato (PDF)' : 'Subir CV (PDF)'}
      />

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Carta de presentación (opcional)
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder='Escribe una carta de presentación...'
          rows={5}
          className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
        />
      </div>

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

      <Button
        type='submit'
        variant={isAdmin ? 'success' : 'primary'}
        disabled={loading}
        className='w-full'>
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
        ) : isAdmin ? (
          '📤 Crear Postulación'
        ) : (
          '🚀 Postularme'
        )}
      </Button>
    </form>
  )
}

export default ApplicationForm
