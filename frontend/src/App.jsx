import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Swal from 'sweetalert2';
import Login from './components/Login';
import Signup from './components/Signup';
import BgFolklore from './assets/picture/dashboard-folklore (1).jpg';

// Custom toast wrapper using SweetAlert2
const toast = {
  success: (message) => {
    Swal.fire({
      toast: true,
      // position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      icon: 'success',
      title: message
    });
  },
  error: (message) => {
    Swal.fire({
      toast: true,
      // position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: 'error',
      title: message
    });
  }
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopey_user');
    return savedUser ? JSON.parse(savedUser) : null;
  })

  const [authView, setAuthView] = useState(null);

  // const [isRegister, setIsRegister] = useState(false);
  const [currentView, setCurrentView] = useState('pembeli');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formAuth, setFormAuth] = useState({ username: '', password: '' });

  const [editId, setEditId] = useState(null);

  const [formProduct, setFormProduct] = useState({
    Kodeproduk: '',
    Namaproduk: '',
    Kategori: '',
    Harga: '',
    Stok: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // 1. GET ALL PRODUK
  const fetchProducts = async () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/produk')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Gagal mengambil produk:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        // Ubah URL di bawah ini sesuai dengan route backend produkmu
        const response = await axios.get('http://localhost:5000/api/produk');
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal memuat katalog produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);

  // // 2. LOGIKA REGISTER & LOGIN
  // const handleRegister = (e) => {
  //   e.preventDefault();
  //   axios.post('http://localhost:5000/api/signup', { username: formAuth.username, password: formAuth.password })
  //     .then((res) => {
  //       alert(res.data.message || 'Registrasi Berhasil!');
  //       setIsRegister(false);
  //       setFormAuth({ username: '', password: '' });
  //     })
  //     .catch((err) => alert(err.response?.data?.message || 'Registrasi Gagal'));
  // };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', { username: formAuth.username, password: formAuth.password })
      .then((res) => {
        alert(res.data.message || 'Login Berhasil!');
        localStorage.setItem('shopey_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setFormAuth({ username: '', password: '' });
      })
      .catch((err) => alert(err.response?.data?.message || 'Username atau Password Salah'));
  };

  const handleLogout = () => {
    localStorage.removeItem('shopey_user')
    setUser(null);
    setCurrentView('pembeli');
    toast.success('Berhasil Logout!');
  };

  // 3. LOGIKA SAVE 
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Kodeproduk', formProduct.Kodeproduk);
    formData.append('Namaproduk', formProduct.Namaproduk);
    formData.append('Kategori', formProduct.Kategori);
    formData.append('Harga', formProduct.Harga);
    formData.append('Stok', formProduct.Stok);

    if (selectedFiles && selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append('image', file);
      });
    } else {
      formData.append('Gambar', formProduct.Gambar || '');
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (editId) {
      axios.put(`http://localhost:5000/api/produk/${editId}`, formData, config)
        .then(() => {
          toast.success('Produk berhasil diupdate!');
          resetFormProduct();
          setSelectedFiles([]);
          fetchProducts();
        })
        .catch((err) => toast.error('Gagal update produk: ' + (err.response?.data?.error || err.message)));
    } else {
      axios.post('http://localhost:5000/api/produk', formData, config)
        .then(() => {
          toast.success('Produk berhasil ditambahkan!');
          resetFormProduct();
          setSelectedFiles([]);
          fetchProducts();
        })
        .catch((err) => toast.error('Gagal tambah produk: ' + (err.response?.data?.error || err.message)));
    }
  };

  // 4. MEMICU MODE EDIT (Mengisi data produk ke dalam form)
  const handleEditClick = (product) => {
    setEditId(product.ID); // Kunci ID produk yang mau diedit
    setFormProduct({
      Kodeproduk: product.Kodeproduk,
      Namaproduk: product.Namaproduk,
      Kategori: product.Kategori,
      Harga: product.Harga,
      Stok: product.Stok
    });
  };

  const resetFormProduct = () => {
    setEditId(null);
    setFormProduct({ Kodeproduk: '', Namaproduk: '', Kategori: '', Harga: '', Stok: '' });
    setSelectedFiles([]);
  };

  // 5. LOGIKA HAPUS PRODUK
  const handleDeleteProduct = (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      axios.delete(`http://localhost:5000/api/produk/${id}`)
        .then(() => {
          toast.success('Produk berhasil dihapus!');
          if (editId === id) resetFormProduct();
          fetchProducts();
        })
        .catch((err) => toast.error('Gagal hapus produk: ' + (err.response?.data?.error || err.message)));
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('shopey_user', JSON.stringify(userData));
    setAuthView(null)

    if (userData?.Role === 'admin' || userData?.Role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('pembeli');
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800">

      <Navbar
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        onOpenLogin={() => setAuthView('login')}
      />

      {authView === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setAuthView('signup')}
          onClose={() => setAuthView(null)} // Tombol close modal
        />
      )}

      {authView === 'signup' && (
        <Signup
          onSwitchToLogin={() => setAuthView('login')}
          onClose={() => setAuthView(null)} // Tombol close modal
        />
      )}

      {/* VIEW: KATALOG PEMBELI */}
      {currentView === 'pembeli' && (
        <>
          {/* HERO BANNER SECTION */}
          <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center bg-black py-20 px-4 md:px-8 overflow-hidden">
            <img
              src={BgFolklore}
              alt="The Eras Visual"
              className="absolute inset-0 w-full h-full object-cover opacity-50 object-center pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
            <div className="relative w-full max-w-[1600px] mx-auto z-10 text-left pl-8 md:pl-16 lg:pl-24 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-folklore text-white/80 leading-tight">
                Find your best <br />
                <span className="text-white block mt-2 drop-shadow-lg">Era's</span>
              </h1>
              <p className="text-sm md:text-base max-w-xl text-slate-200 leading-relaxed font-folklore bg-gray">
                Hi <strong className="text-white">{user?.Username || "User"}</strong>!
                Welcome to The Eras Store, we hope you can find your Era's!
              </p>
            </div>
          </section>

          {/* GRID PRODUK */}
          <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#929292]">
            <div className="mb-12"><h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl font-folklore">Product Catalogue</h2></div>
            {loading ? <div className="text-center text-slate-400 font-medium py-12">Memuat produk...</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.ID} className="group relative bg-[#f8fafc] rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className='w-full aspect-square rounded-2xl overflow-hidden'>
                      <ProductImageSlider
                        gambarString={product.Gambar}
                        namaProduk={product.Namaproduk}
                      />
                    </div>
                    <div className="mt-4 px-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">{product.Kategori}</span>
                      <h3 className="text-sm font-semibold text-slate-700 truncate mt-1">{product.Namaproduk}</h3>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <p className="text-base font-bold text-slate-900">Rp {Number(product.Harga).toLocaleString('id-ID')}</p>
                        <span className="text-xs text-slate-400 font-medium">Stok: {product.Stok}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* VIEW: DASHBOARD ADMIN */}
      {currentView === 'admin' && (
        <section className="w-full max-w-[1600px] mx-auto py-10 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">

            {/* FORM INPUT PRODUK (OTOMATIS BERGANTI MODE TAMBAH/EDIT) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">{editId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                {editId && (
                  <button type="button" onClick={resetFormProduct} className="text-xs text-rose-600 font-medium hover:underline">Batal</button>
                )}
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Kode Produk</label>
                  <input type="text" placeholder="P001" value={formProduct.Kodeproduk} onChange={(e) => setFormProduct({ ...formProduct, Kodeproduk: e.target.value })} className="w-full p-2.5 mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-600" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Nama Produk</label>
                  <input type="text" placeholder="Sepatu Nike" value={formProduct.Namaproduk} onChange={(e) => setFormProduct({ ...formProduct, Namaproduk: e.target.value })} className="w-full p-2.5 mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-600" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Kategori</label>
                  <input type="text" placeholder="Fashion" value={formProduct.Kategori} onChange={(e) => setFormProduct({ ...formProduct, Kategori: e.target.value })} className="w-full p-2.5 mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-600" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Harga</label>
                    <input type="number" placeholder="150000" value={formProduct.Harga} onChange={(e) => setFormProduct({ ...formProduct, Harga: e.target.value })} className="w-full p-2.5 mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-600" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">Stok</label>
                    <input type="number" placeholder="10" value={formProduct.Stok} onChange={(e) => setFormProduct({ ...formProduct, Stok: e.target.value })} className="w-full p-2.5 mt-1 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-600" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Upload Gambar {editId && '(Kosongkan jika tidak diganti)'}</label>
                  <input type="file" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files))} className="w-full text-xs mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
                </div>

                {/* Judul tombol dinamis mengikuti status edit */}
                <button type="submit" className={`w-full py-2.5 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg mt-2 ${editId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}>
                  {editId ? 'Update Data di MySQL' : 'Simpan ke Database'}
                </button>
              </form>
            </div>

            {/* TABEL INVENTARIS PRODUK DENGAN TOMBOL EDIT & HAPUS */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Daftar Inventaris Produk</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-3">Gambar</th>
                      <th className="p-3">Nama</th>
                      <th className="p-3">Harga</th>
                      <th className="p-3">Stok</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.ID} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <img
                            src={p.Gambar ? p.Gambar.split(',')[0] : 'https://via.placeholder.com/50'}
                            alt={p.Namaproduk}
                            className="w-10 h-10 object-contain bg-slate-100 rounded-lg"
                          /> {/* <-- Pastikan ditutup rapi seperti ini */}
                        </td>
                        <td className="p-3 font-medium text-slate-800">{p.Namaproduk}</td>
                        <td className="p-3">Rp {Number(p.Harga).toLocaleString('id-ID')}</td>
                        <td className="p-3">{p.Stok}</td>
                        <td className="p-3 text-center flex items-center justify-center gap-2">

                          {/* TOMBOL EDIT BARU */}
                          <button
                            onClick={() => handleEditClick(p)}
                            className="px-3 py-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.ID)}
                            className="px-3 py-1 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}

function ProductImageSlider({ gambarString, namaProduk }) {
  const images = gambarString ? gambarString.split(',').map(img => img.trim()) : [];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  if (images.length === 0) {
    return (
      <div className='w-full h-full bg-cream flex items-center justify-center p-6'>
        <span className='text-xs text-soft-brown font-medium'>No Image</span>
      </div>
    );
  }

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className='relative w-full h-full group overflow-hidden rounded-2xl bg-[#abaaaa]'>
      <img
        src={images[currentIndex]}
        alt={`${namaProduk} - ${currentIndex + 1}`} className='w-full h-full object-cover object-top p-4 transition-transform duration-500 ease-in-out group-hover:scale-105'
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-charcoal p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
            ←
          </button>

          <button
            onClick={nextSlide}
            className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-charcoal p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
            →
          </button>

          <div className='absolute bottom-2 left-1/2 -translate-y-1/2 flex gap-1.5 z-10'>
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-black w-4' : 'bg-charcoal/30'
                  }`}
              >
              </span>
            ))}

          </div>
        </>
      )}
    </div>
  )
}

export default App;