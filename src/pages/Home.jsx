import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-num">10</div>
        <div>
          <div className="eyebrow">NUEVA COLECCIÓN · TALLAS S–XXL</div>
          <h1>Vestí el <span>número</span><br />que te define.</h1>
          <p>Camisolas deportivas con corte de competencia y tela de secado rápido. Diseñadas para la cancha, hechas para la calle.</p>
          <div className="hero-cta">
            <a href="#catalogo"><button className="btn-primary"><span>Ver catálogo</span></button></a>
            <a href="#" className="btn-ghost">Personalizar mi camisola →</a>
          </div>
        </div>
        <div className="hero-jersey">
          <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10 L20 40 L35 65 L55 55 L55 200 Q100 210 145 200 L145 55 L165 65 L180 40 L140 10 Q100 25 60 10 Z" fill="#E23744" />
            <text x="100" y="140" fontFamily="Anton" fontSize="70" fill="#F5F7F2" textAnchor="middle">10</text>
          </svg>
        </div>
      </section>

      <section className="catalog" id="catalogo">
        <div className="catalog-head">
          <h2>Catálogo</h2>
          <span className="count mono">{String(products.length).padStart(2, '0')} MODELOS DISPONIBLES</span>
        </div>
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}
