import React from 'react'

const Modal = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded shadow w-full max-w-lg relative'>
        <button
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl'
          onClick={onClose}
          aria-label='Cerrar modal'>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
