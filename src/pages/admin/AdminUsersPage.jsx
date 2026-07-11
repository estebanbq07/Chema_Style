import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient.js'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (error) {
      setError('No se pudo cargar la lista de usuarios.')
      return
    }
    setUsers(data || [])
  }

  async function toggleRole(user) {
    const nextRole = user.role === 'admin' ? 'cliente' : 'admin'

    if (nextRole === 'admin') {
      const confirmed = window.confirm(`¿Dar permisos de administrador a ${user.email}?`)
      if (!confirmed) return
    }

    const { error } = await supabase.from('profiles').update({ role: nextRole }).eq('id', user.id)
    if (error) {
      setError('No se pudo actualizar el rol del usuario.')
      return
    }

    fetchUsers()
  }

  return (
    <section className="admin-users">
      <div className="admin-page-header">
        <div>
          <h2>Usuarios</h2>
          <p>Gestiona los usuarios registrados y asigna roles de administrador cuando corresponda.</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <section className="empty-state">
          <h2>Cargando usuarios...</h2>
        </section>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Creado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.full_name || '—'}</td>
                  <td>{user.role}</td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('es-CR') : '—'}</td>
                  <td>
                    <button className="method-btn" type="button" onClick={() => toggleRole(user)}>
                      Cambiar a {user.role === 'admin' ? 'cliente' : 'admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
