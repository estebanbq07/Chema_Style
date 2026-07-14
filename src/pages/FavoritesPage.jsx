import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import Tag from '../components/Tag.jsx'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()

  if (favorites.length === 0) {
    return (
      <section className="empty-state">
        <h2>Lista de deseos</h2>
        <p>Aún no hay camisetas guardadas. Agregá tus favoritas desde el catálogo para personalizarlas después.</p>
        <Link to="/" className="btn-primary">Volver al catálogo</Link>
      </section>
    )
  }

  return (
    <section className="catalog" style={{ paddingTop: '4vh' }}>
      <div className="catalog-head">
        <h2>Lista de deseos</h2>
        <span className="count mono">{String(favorites.length).padStart(2, '0')} FAVORITOS</span>
      </div>

      <div className="grid">
        {favorites.map(product => (
          <div key={product.id} className="card">
            <div className="card-jersey">
              {product.imagen_url_local ? (
                <img src={product.imagen_url_local} alt={product.name} className="card-photo" />
              ) : (
                <div style={{ width: '120px', height: '144px', display: 'grid', placeItems: 'center', color: '#6b7280' }}>
                  Sin imagen
                </div>
              )}
            </div>
            <h3>{product.name}</h3>
            <div className="cat">{product.cat}</div>
            <Tag>
              <span className="price">₡{product.price.toLocaleString('es-CR')}</span>
            </Tag>
            <div className="card-foot">
              <Link to={`/personalizar/${product.id}?size=M&variant=local`} className="btn-primary">Personalizar</Link>
              <button className="remove-btn" onClick={() => removeFavorite(product.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
