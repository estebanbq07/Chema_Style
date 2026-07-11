import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password.length < 6) {
      setLoading(false)
      return setError('La contraseña debe tener al menos 6 caracteres')
    }
    if (form.password !== form.password2) {
      setLoading(false)
      return setError('Las contraseñas no coinciden')
    }

    setLoading(true)
    const res = await signUp(form.email, form.password, form.nombre)
    setLoading(false)

    if (res.error) {
      setError(res.error.message || 'Error al crear la cuenta')
      return
    }

    if (res.data?.session) {
      navigate('/')
      return
    }

    setSuccess('Cuenta creada. Revisa tu correo para confirmar el acceso y luego iniciá sesión.')
    setForm({ nombre: '', email: '', password: '', password2: '' })
  }

  return (
    <section className="auth-page">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Nombre completo
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Confirmar contraseña
          <input
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </section>
  )
}
