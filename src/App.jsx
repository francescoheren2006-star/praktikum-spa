import { useEffect } from "react";
import {
  Link, NavLink, Route, Routes,
  useParams, useSearchParams
} from "react-router";
import { useFavorites } from "./hooks/useFavorites";

const PRODUCTS = [
  { id: 1, name: "Buku React", price: 85000, category: "Buku" },
  { id: 2, name: "Buku Web", price: 70000, category: "Buku" },
  { id: 3, name: "Keyboard", price: 150000, category: "Perangkat" },
  { id: 4, name: "Mouse", price: 90000, category: "Perangkat" }
];
const CATEGORIES = [...new Set(PRODUCTS.map(item => item.category))];
const rupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR",
  maximumFractionDigits: 0
}).format(value);

export default function App() {
  const { ids, storageError } = useFavorites();
  return (
    <>
      <header>
        <h1>Katalog Praktikum</h1>
        <nav aria-label="Navigasi utama">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/products">Produk</NavLink>
          <NavLink to="/favorites">
            Favorit ({ids.length})
          </NavLink>
          <NavLink to="/about">Tentang</NavLink>
        </nav>
      </header>
      <main>
        {storageError && <p role="alert">{storageError}</p>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/products/:id" element={<Detail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => { document.title = previous; };
  }, [title]);
}

function Home() {
  usePageTitle("Beranda Katalog");
  return (
    <section>
      <h2>Selamat datang</h2>
      <p>Pilih produk dan simpan sebagai favorit.</p>
      <Link to="/products">Buka katalog</Link>
    </section>
  );
}

function ProductCard({ product }) {
  const { ids, toggle } = useFavorites();
  const selected = ids.includes(product.id);
  return (
    <article className="card">
      <h3>
        <Link to={`/products/${product.id}`}>
          {product.name}
        </Link>
      </h3>
      <p>{rupiah(product.price)}</p>
      <p>Kategori: {product.category}</p>
      <button type="button" aria-pressed={selected}
        onClick={() => toggle(product.id)}>
        {selected ? "Hapus favorit" : "Tambah favorit"}
      </button>
    </article>
  );
}

function Catalog() {
  usePageTitle("Katalog Produk");
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const rawCategory = params.get("category") ?? "";
  // Kategori tidak dikenal (misal ?category=zzz) diperlakukan sebagai "semua".
  const category = CATEGORIES.includes(rawCategory) ? rawCategory : "";
  const filtered = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(q.toLowerCase())
    && (category === "" || product.category === category)
  );

  // Salin params agar parameter lain (q atau category) tetap terjaga.
  function updateParam(key, value, replace = true) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace });
  }

  return (
    <section>
      <h2>Produk</h2>
      <label htmlFor="search">Cari produk</label>
      <input id="search" value={q}
        onChange={event => updateParam("q", event.target.value)}
        placeholder="Contoh Buku" />
      <button type="button"
        onClick={() => updateParam("q", "", false)}>
        Reset pencarian
      </button>
      <label htmlFor="category">Kategori</label>
      <select id="category" value={category}
        onChange={event =>
          updateParam("category", event.target.value, false)}>
        <option value="">Semua kategori</option>
        {CATEGORIES.map(item => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      <p>{filtered.length} produk ditemukan</p>
      <div className="grid">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filtered.length === 0 && <p>Produk tidak ditemukan.</p>}
    </section>
  );
}

function Detail() {
  const { id } = useParams();
  const product = PRODUCTS.find(item => String(item.id) === id);
  usePageTitle(product ? product.name : "Produk tidak ditemukan");
  return (
    <section>
      <h2>Detail produk</h2>
      {product ? <ProductCard product={product} />
        : <p>ID produk tidak tersedia.</p>}
      <Link to="/products">Kembali ke katalog</Link>
    </section>
  );
}

function Favorites() {
  usePageTitle("Produk Favorit");
  const { ids, clearAll } = useFavorites();
  const selected = PRODUCTS.filter(item => ids.includes(item.id));
  return (
    <section>
      <h2>Produk favorit</h2>
      <button type="button" onClick={clearAll}
        disabled={ids.length === 0}>
        Hapus semua favorit
      </button>
      <div className="grid">
        {selected.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {selected.length === 0 && <p>Belum ada produk favorit.</p>}
    </section>
  );
}

function About() {
  usePageTitle("Tentang Aplikasi");
  return (
    <section>
      <h2>Tentang</h2>
      <p>
        Aplikasi latihan React: Effect, custom hook, dan router.
        Data favorit disimpan di localStorage browser Anda.
      </p>
      <Link to="/products">Buka katalog</Link>
    </section>
  );
}

function NotFound() {
  usePageTitle("Halaman tidak ditemukan");
  return (
    <section>
      <h2>Halaman tidak ditemukan</h2>
      <Link to="/">Kembali ke beranda</Link>
    </section>
  );
}
