import React from 'react'

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded font-semibold shadow transition-colors duration-150 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      {...props}>
      {children}
    </button>
  )
}

export default Button
