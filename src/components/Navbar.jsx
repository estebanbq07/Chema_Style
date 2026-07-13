import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { count } = useCart()
  const { user, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header>
      <Link to="/" className="logo">
        <div className="logo-num">C</div>
        <div className="logo-text">CHEMA STYLE</div>
      </Link>
      <button
        className="nav-toggle"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span aria-hidden="true" className={`hamburger ${open ? 'open' : ''}`}></span>
      </button>

      <nav className="nav">
        <ul className={`nav-list ${open ? 'open' : ''}`}>
          <li><Link to="/" onClick={() => setOpen(false)}>Catálogo</Link></li>
          <li><Link to="/lista-deseos" onClick={() => setOpen(false)}>Lista de deseos</Link></li>
          <li><Link to="/personalizar" onClick={() => setOpen(false)}>Personalizar</Link></li>
          <li><a href="#" onClick={() => setOpen(false)}>Contacto</a></li>
        </ul>
      </nav>

      <div className="header-actions">        <Link to="/carrito">
        <button className="cart-btn">CARRITO ({count})</button>
      </Link>
        {user ? (
          <div className="nav-user">
            <Link to="/perfil" className="mono">{profile?.full_name || user.email}</Link>
            {profile?.role === 'admin' && (
              <Link to="/admin">
                <button className="cart-btn">Panel Admin</button>
              </Link>
            )}
            <button className="cart-btn" onClick={() => signOut()}>Cerrar sesión</button>
          </div>
        ) : (
          <Link to="/login">
            <button className="cart-btn">Iniciar sesión</button>
          </Link>
        )}
      </div>
    </header>
  )
}
