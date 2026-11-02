# Praktikum Effect Custom Hook dan Router


## Persiapan

1. Instal Node.js 22 versi 22.12 atau lebih baru (atau Node.js 24).
2. Ekstrak seluruh ZIP terlebih dahulu. Jangan membuka index.html dengan klik ganda.
3. Buka terminal pada folder `praktikum-spa` yang memuat package.json.
4. Instal dependency dan jalankan:

```bash
npm ci
npm run dev
```

Buka alamat yang tercetak di terminal (biasanya http://localhost:5173).
Instalasi pertama memerlukan internet. `node_modules` tidak disertakan; `npm ci`
memasangnya dari package-lock.json. Tidak perlu menjalankan create-vite lagi.
Jika npm.ps1 diblokir PowerShell, gunakan Command Prompt atau npm.cmd.
Hentikan server dengan Ctrl+C.

## Pemeriksaan

```bash
npm run lint
npm run build
npm run preview
```

Preview biasanya di http://localhost:4173. Periksa output terminal.
Build menghasilkan folder dist; preview menjalankan dist secara lokal.
Aplikasi tidak membutuhkan API key, file .env, database, backend, atau gambar eksternal.

## Route dan perilaku

- `/`: beranda.
- `/products`: katalog; `/products?q=Buku` membuka pencarian.
- `/products/:id`: detail produk (ID 1 sampai 4).
- `/favorites`: favorit dari state bersama.
- Route lain menampilkan halaman tidak ditemukan.

Klik favorit pada katalog atau detail akan memperbarui badge navigasi dan halaman
favorit. Data ditulis pada key `praktikum-favorites-v1` di localStorage.
State dipulihkan setelah reload pada origin yang sama. Mengganti host atau port
berarti menggunakan penyimpanan origin berbeda. Untuk reset data, hapus key melalui
Developer Tools lalu reload. Data rusak dipulihkan menjadi array kosong.

Pencarian berasal dari URL. Pengetikan memakai replace agar history tidak berisi
setiap karakter. Tombol Reset membuat entri baru: cari Buku, reset, lalu Back dan
Forward untuk mengamati pemulihan URL dan input.

## Struktur sumber dan hubungan dengan modul

- `src/main.jsx`: StrictMode, BrowserRouter, dan provider.
- `src/App.jsx`: data contoh, navigasi, route, halaman, ProductCard, usePageTitle.
- `src/hooks/usePersistentFavorites.js`: baca data awal dan Effect persistensi.
- `src/hooks/useFavorites.js`: akses state bersama melalui Context.
- `src/context/FavoritesContext.js`: objek Context.
- `src/context/FavoritesProvider.jsx`: satu pemilik state favorit.
- `src/style.css`: tampilan responsif.
- `index.html`: dokumen HTML utama.
- `vite.config.js`: konfigurasi Vite dan plugin React.
- `eslint.config.js`: pemeriksaan JavaScript, Hooks, dan Fast Refresh.
- `package.json` dan `package-lock.json`: dependency dan versi terpasang.

Modul Word menggabungkan hook dan provider pada favorites.jsx untuk kemudahan
penjelasan. Paket runnable ini memisahkannya ke folder hooks dan context supaya
Fast Refresh tidak menandai ekspor campuran. Perilaku dan studi kasus tetap sama.

## Ruang lingkup tugas

Proyek ini memuat implementasi inti modul beserta tugas wajib: filter kategori
(`/products?category=Buku&q=web`, q dan category saling terjaga), tombol Hapus semua
favorit (`clearAll` pada hook penyimpanan), dan halaman Tentang (`/about`).
Folder `dist` lama dihapus; jalankan `npm run build` untuk membuat ulang.
Sinkronisasi antartab adalah pengayaan, bukan fitur implementasi inti.
Dua pemanggilan useState terpisah tidak berbagi state; semua halaman harus membaca
provider yang sama. Jangan menambahkan salinan state favorit pada setiap halaman.

## Deployment

Untuk BrowserRouter, server produksi harus mengembalikan index.html ketika route
aplikasi seperti /products/1 diminta langsung. Contoh konfigurasi Nginx disediakan
pada folder docs paket. Sesuaikan lokasi dist dan server_name dengan server Anda.
Vite dev dan preview bukan server produksi. Deployment tidak dilakukan oleh paket ini.

## Referensi

- https://react.dev/reference/react/useEffect
- https://react.dev/learn/reusing-logic-with-custom-hooks
- https://react.dev/learn/sharing-state-between-components
- https://reactrouter.com/start/declarative/installation
- https://reactrouter.com/start/declarative/routing
- https://vite.dev/guide/
