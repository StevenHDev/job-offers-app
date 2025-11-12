import React, { useState } from 'react'
import toast from 'react-hot-toast'
import FileUpload from '../components/common/FileUpload'
import { uploadCV, hasAlreadyApplied } from '../services/applicationService'

const ApplicationForm = ({ jobId, userId, onSubmit }) => {
  const [file, setFile] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!file) {
      setError('Debes subir tu CV en PDF.')
      return
    }
    setLoading(true)
    const { exists } = await hasAlreadyApplied(jobId, userId)
    if (exists) {
      setError('Ya has postulado a esta oferta.')
      setLoading(false)
      return
    }
    const { url, error: uploadError } = await uploadCV(file, userId)
    if (uploadError) {
      setError('Error al subir el CV.')
      setLoading(false)
      return
    }
    onSubmit({
      job_id: jobId,
      candidate_id: userId,
      cv_url: url,
      cover_letter: coverLetter
    })
    toast.success('¡Postulación enviada exitosamente!')
    setLoading(false)
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <FileUpload onFileSelect={handleFileSelect} />
      <textarea
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder='Carta de presentación (opcional)'
        className='w-full px-3 py-2 border rounded'
      />
      {error && <p className='text-red-500 text-sm'>{error}</p>}
      <button
        type='submit'
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        disabled={loading}>
        {loading ? 'Enviando...' : 'Postularme'}
      </button>
    </form>
  )
}

export default ApplicationForm
