import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-700'>Redirigiendo al login...</p>
        </div>
        <Navigate to='/' />
      </div>
    )
  }
  return children
}

export default ProtectedRoute
