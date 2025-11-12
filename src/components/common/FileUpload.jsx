import React, { useRef, useState } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPE = 'application/pdf'

const FileUpload = ({ onFileSelect }) => {
  const inputRef = useRef()
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== ALLOWED_TYPE) {
      setError('Solo se permiten archivos PDF.')
      setPreview(null)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo supera el tamaño máximo de 5MB.')
      setPreview(null)
      return
    }
    setError('')
    setPreview(URL.createObjectURL(file))
    onFileSelect(file)
  }

  return (
    <div className='mb-4'>
      <input
        type='file'
        accept='application/pdf'
        ref={inputRef}
        onChange={handleFileChange}
        className='block mb-2'
      />
      {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
      {preview && (
        <iframe
          src={preview}
          title='Vista previa CV'
          className='w-full h-64 border rounded'
        />
      )}
    </div>
  )
}

export default FileUpload
