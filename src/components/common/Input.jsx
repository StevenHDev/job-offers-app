import React from 'react'

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      {...props}
    />
  )
}

export default Input
