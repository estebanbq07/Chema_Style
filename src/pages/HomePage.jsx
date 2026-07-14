import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient.js'
import ProductCard from '../components/ProductCard.jsx'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4)
        .order('id')

      if (error) {
        console.error('Error cargando productos destacados:', error)
      } else {
        setFeaturedProducts(
          data.map(p => ({
            id: p.id,
            name: p.name,
            cat: p.category,
            price: p.price,
            imagen_url_local: p.imagen_url_local,
            imagen_url_visitante: p.imagen_url_visitante,
            color: p.color,
            num: p.jersey_num,
          }))
        )
      }
      setLoading(false)
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">Nueva colección 2026</span>
          <h1 className="hero-title">Viste los colores de tu selección</h1>
          <p className="hero-description">
            Encuentra camisas locales y visitantes de tus equipos favoritos. Camisetas de gran calidad diseñadas para la cancha y hechas para la calle.
          </p>
          <Link to="/catalogo" className="hero-button">
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <h2>¿Por qué elegirnos?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">👕</div>
              <h3>Camisas Local y Visitante</h3>
              <p>Elige entre las versiones de jugador y fan de tus equipos favoritos.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Compra rápida y sencilla</h3>
              <p>Proceso simplificado para que disfrutes rápidamente de tu camiseta.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>Productos seleccionados</h3>
              <p>Solo ofrecemos camisetas de la más alta calidad y diseño.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="featured-container">
          <h2>Productos destacados</h2>
          {loading ? (
            <p className="mono">Cargando productos...</p>
          ) : (
            <div className="featured-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="home-cta-section">
        <div className="cta-content">
          <h2>¿Listo para obtener tu camiseta?</h2>
          <p>Explora todo nuestro catálogo y encuentra la perfecta para ti.</p>
          <Link to="/catalogo" className="cta-button">
            Ir al catálogo
          </Link>
        </div>
      </section>
    </main>
  )
}
