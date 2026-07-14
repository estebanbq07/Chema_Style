import { Link, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import UserMenu from './UserMenu.jsx'

export default function Navbar() {
  const { count } = useCart()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    function updateHeader() {
      const currentScrollY = window.scrollY
      if (currentScrollY < 80) {
        setHidden(false)
      } else if (currentScrollY > lastScrollY.current) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentScrollY
      ticking.current = false
    }

    function handleScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={hidden ? 'header-hidden' : ''}>
      <Link to="/" className="logo">
        <div className="logo-num">C</div>
        <div className="logo-text">CHEMA STYLE</div>
      </Link>

      <nav className="nav">
        <ul className={`nav-list ${open ? 'open' : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setOpen(false)}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/catalogo"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setOpen(false)}
            >
              Catálogo
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/lista-deseos"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setOpen(false)}
            >
              Favoritos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/personalizar"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setOpen(false)}
            >
              Personalizar
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="header-actions">
        <Link
          to="/carrito"
          className="cart-button"
          aria-label="Abrir carrito"
          title={`Abrir carrito (${count} artículos)`}
        >
          🛒
        </Link>
        {user ? (
          <UserMenu />
        ) : (
          <Link to="/login">
            <button className="cart-btn">Iniciar sesión</button>
          </Link>
        )}
      </div>

      <button
        className="nav-toggle"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span aria-hidden="true" className={`hamburger ${open ? 'open' : ''}`}></span>
      </button>
    </header>
  )
}