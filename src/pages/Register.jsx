import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'

export default function Register() {
  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{
        background:
          'linear-gradient(135deg, #e0eaff 0%, #ffffff 50%, #c7e0ff 100%)'
      }}>
      <div>
        <RegisterForm />
      </div>
    </div>
  )
}
