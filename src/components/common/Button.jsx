import React from 'react'

const Button = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}) => {
  const baseStyles =
    'px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:scale-95',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 active:scale-95',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:scale-95',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-95',
    warning:
      'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400 active:scale-95',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:scale-95',
    ghost:
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-400 active:scale-95 shadow-none'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}>
      {children}
    </button>
  )
}

export default Button
