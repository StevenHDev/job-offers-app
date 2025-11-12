import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{
        background:
          'linear-gradient(135deg, #e0eaff 0%, #ffffff 50%, #c7e0ff 100%)'
      }}>
      <div>
        <LoginForm />
      </div>
    </div>
  )
}
