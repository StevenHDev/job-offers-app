import React from 'react'

const Select = ({ className = '', children, ...props }) => {
  return (
    <select
      className={`px-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
      {...props}>
      {children}
    </select>
  )
}

export default Select
