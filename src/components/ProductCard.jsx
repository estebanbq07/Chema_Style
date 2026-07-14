import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext.jsx'
import JerseySVG from './JerseySVG.jsx'
import Tag from './Tag.jsx'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function ProductCard({ product }) {
  const [size, setSize] = useState('M')
  const [tipoCamisa, setTipoCamisa] = useState('local')
  const [cambiandoImagen, setCambiandoImagen] = useState(false)
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const favorited = isFavorite(product.id)

  // Calcular la imagen actual según el tipo de camisa seleccionado
  const imagenActual =
    tipoCamisa === 'visitante' && product.imagen_url_visitante
      ? product.imagen_url_visitante
      : product.imagen_url_local

  // Precargar las imágenes para transiciones suaves
  useEffect(() => {
    const urls = [
      product.imagen_url_local,
      product.imagen_url_visitante
    ].filter(Boolean)

    urls.forEach((url) => {
      const imagen = new Image()
      imagen.src = url
    })
  }, [
    product.imagen_url_local,
    product.imagen_url_visitante
  ])

  // Función para cambiar el tipo de camisa con transición suave
  function cambiarTipoCamisa(nuevoTipo) {
    if (nuevoTipo === tipoCamisa) {
      return
    }

    setCambiandoImagen(true)

    setTimeout(() => {
      setTipoCamisa(nuevoTipo)
      setCambiandoImagen(false)
    }, 180)
  }

  function toggleFavorite() {
    if (favorited) {
      removeFavorite(product.id)
    } else {
      addFavorite(product)
    }
  }

  return (
    <div className="card">
      <div className="product-image-container">
        {imagenActual ? (
          <img
            src={imagenActual}
            alt={`${product.name} - ${tipoCamisa}`}
            className={`product-image ${
              cambiandoImagen ? 'cambiando' : 'visible'
            }`}
          />
        ) : (
          <JerseySVG color={product.color} num={product.num} stroke={product.stroke} dark={product.dark} />
        )}
      </div>

      <h3>{product.name}</h3>
      <div className="cat">{product.cat}</div>

      <div className="card-options">
        <div className="option-group">
          <span className="option-label">Talla</span>
          <div className="size-options">
            {SIZES.map(s => (
              <button
                key={s}
                type="button"
                className={`size-btn ${size === s ? 'active' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="option-group">
          <span className="option-label">Tipo</span>
          <div className="selector-camisa">
            <button
              type="button"
              className={`size-btn ${tipoCamisa === 'local' ? 'active' : ''}`}
              onClick={() => cambiarTipoCamisa('local')}
            >
              Local
            </button>
            {product.imagen_url_visitante && (
              <button
                type="button"
                className={`size-btn ${tipoCamisa === 'visitante' ? 'active' : ''}`}
                onClick={() => cambiarTipoCamisa('visitante')}
              >
                Visitante
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card-foot">
        <Tag>
          <span className="price">₡{product.price.toLocaleString('es-CR')}</span>
          <span className="divider">|</span>
          <span>{size} · {tipoCamisa === 'local' ? 'Local' : 'Visitante'}</span>
        </Tag>
        <div className="card-actions">
          <button
            type="button"
            className={`favorite-btn ${favorited ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label={favorited ? `Quitar ${product.name} de la lista de deseos` : `Agregar ${product.name} a la lista de deseos`}
          >
            {favorited ? 'Guardado' : 'Favorito'}
          </button>
          <Link
            to={`/personalizar/${product.id}?size=${size}&variant=${tipoCamisa}`}
            className="add-btn"
            aria-label={`Ir a personalizar ${product.name}`}
          >
            +
          </Link>
        </div>
      </div>
    </div>
  )
}