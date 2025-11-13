import React from 'react'

const Input = ({ className = '', label, error, icon, ...props }) => {
  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          {label}
        </label>
      )}
      <div className='relative'>
        {icon && (
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 border rounded-xl transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  )
}

export default Input
