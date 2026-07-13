import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEsc(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger cart-btn"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span>{profile?.full_name || user.email}</span>
        <span className={`user-menu-icon ${open ? 'open' : ''}`} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-header">
            <strong>{profile?.full_name || user.email}</strong>
            <span>{user.email}</span>
          </div>
          <div className="user-menu-divider" />
          <Link to="/perfil" className="user-menu-item" onClick={() => setOpen(false)}>
            Administrar perfil
          </Link>
          {profile?.role === 'admin' && (
            <Link to="/admin" className="user-menu-item" onClick={() => setOpen(false)}>
              Panel Admin
            </Link>
          )}
          <div className="user-menu-divider" />
          <button
            type="button"
            className="user-menu-item danger"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
