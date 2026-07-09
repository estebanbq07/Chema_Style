import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('id')

      if (error) {
        console.error('Error cargando productos:', error)
      } else {
        // Adaptamos los nombres de columna de Supabase a lo que
        // esperan ProductCard y CustomizeModal (image, cat, num)
        setProducts(
          data.map(p => ({
            id: p.id,
            name: p.name,
            cat: p.category,
            price: p.price,
            image: p.image_url,
            color: p.color,
            num: p.jersey_num,
          }))
        )
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])


  return (
    <>
      <section className="hero">
        <div className="hero-num">10</div>
        <div>
          <div className="eyebrow">NUEVA COLECCIÓN · TALLAS S–XXL</div>
          <h1>Vestí el <span>estilo</span><br />que te define.</h1>
          <p>Camisetas deportivas vesriones jugador y fan, con tela de gran calidad. Diseñadas para la cancha, hechas para la calle.</p>
          <div className="hero-cta">
            <a href="#catalogo"><button className="btn-primary"><span>Ver catálogo</span></button></a>
            <a href="#" className="btn-ghost">Personalizar mi camiseta →</a>
          </div>
        </div>
        {/*
        <div className="hero-jersey">
          <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10 L20 40 L35 65 L55 55 L55 200 Q100 210 145 200 L145 55 L165 65 L180 40 L140 10 Q100 25 60 10 Z" fill="#E23744" />
            <text x="100" y="140" fontFamily="Anton" fontSize="70" fill="#F5F7F2" textAnchor="middle">10</text>
          </svg>
        </div>
        */ }
      </section>

      <section className="catalog" id="catalogo">
        <div className="catalog-head">
          <h2>Catálogo</h2>
          <span className="count mono">{String(products.length).padStart(2, '0')} MODELOS DISPONIBLES</span>
        </div>
        {loading ? (
          <p className="mono">Cargando catálogo...</p>
        ) : (
          <div className="grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
