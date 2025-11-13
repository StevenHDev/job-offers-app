import React from 'react'

const Modal = ({ open, onClose, children, title, size = 'md' }) => {
  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        {title && (
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 border-b border-gray-200 shrink-0'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold text-white'>{title}</h3>
              <button
                onClick={onClose}
                className='text-white hover:text-gray-200 transition-colors'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className='px-6 py-6 overflow-y-auto flex-1'>{children}</div>
      </div>
    </div>
  )
}

export default Modal
