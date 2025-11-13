import React from 'react'

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden
        ${
          hover
            ? 'hover:shadow-xl hover:scale-[1.02] transition-all duration-300'
            : ''
        }
        ${className}
      `}>
      {children}
    </div>
  )
}

export default Card
