import React, { useRef, useState } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPE = 'application/pdf'

const FileUpload = ({ onFileSelect, label = 'Subir CV (PDF)' }) => {
  const inputRef = useRef()
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== ALLOWED_TYPE) {
      setError('Solo se permiten archivos PDF.')
      setPreview(null)
      setFileName('')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo supera el tamaño máximo de 5MB.')
      setPreview(null)
      setFileName('')
      return
    }
    setError('')
    setFileName(file.name)
    setPreview(URL.createObjectURL(file))
    onFileSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setFileName('')
    setError('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onFileSelect(null)
  }

  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {label}
        </label>
      )}

      <div className='relative'>
        <input
          type='file'
          accept='application/pdf'
          ref={inputRef}
          onChange={handleFileChange}
          className='hidden'
          id='file-upload'
        />

        <label
          htmlFor='file-upload'
          className='flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors'>
          <svg
            className='w-12 h-12 mb-3 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
            />
          </svg>
          <p className='mb-2 text-sm text-gray-700 font-medium'>
            {fileName || 'Haz clic para seleccionar un archivo'}
          </p>
          <p className='text-xs text-gray-500'>PDF (máx. 5MB)</p>
        </label>
      </div>

      {error && (
        <div className='mt-2 flex items-center text-red-600'>
          <svg className='w-5 h-5 mr-1' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
            />
          </svg>
          <p className='text-sm'>{error}</p>
        </div>
      )}

      {preview && (
        <div className='mt-4'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-sm font-medium text-gray-700'>Vista previa:</p>
            <button
              onClick={handleRemove}
              className='text-red-600 hover:text-red-800 text-sm font-medium transition-colors'>
              Eliminar
            </button>
          </div>
          <iframe
            src={preview}
            title='Vista previa CV'
            className='w-full h-96 border-2 border-gray-300 rounded-lg shadow-sm'
          />
        </div>
      )}
    </div>
  )
}

export default FileUpload
