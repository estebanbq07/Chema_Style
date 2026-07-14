import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id')

      if (error) {
        console.error('Error cargando productos:', error)
      } else {
        // Log para verificar que las columnas lleguen correctamente
        console.log('Productos obtenidos desde Supabase:', data)
        
        // Adaptamos los nombres de columna de Supabase a lo que
        // esperan ProductCard y CustomizeModal
        setProducts(
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

    fetchProducts()
  }, [])

  return (
    <>
      <section className="catalog">
        <div className="catalog-head">
          <h2>Catálogo completo</h2>
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
