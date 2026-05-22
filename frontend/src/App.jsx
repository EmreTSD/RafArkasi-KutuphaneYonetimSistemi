// ============================================
// Ana Uygulama Bileşeni
// Sayfa yönlendirmelerini ve genel düzeni yönetir
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useYetkilendirme } from './context/YetkilendirmeBaglami';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AnaSayfa from './pages/AnaSayfa/AnaSayfa';
import Kitaplar from './pages/Kitaplar/Kitaplar';
import Uyeler from './pages/Uyeler/Uyeler';
import OduncIslemleri from './pages/OduncIslemleri/OduncIslemleri';
import GirisYap from './pages/GirisYap/GirisYap';
import KayitOl from './pages/KayitOl/KayitOl';

// Korumalı rota (admin sayfaları için)
const KorumaliRota = ({ children }) => {
  const { girisYapildiMi, adminMi, yukleniyor } = useYetkilendirme();
  if (yukleniyor) return <div className="spinner-kapsayici"><div className="spinner"></div></div>;
  if (!girisYapildiMi) return <Navigate to="/giris" replace />;
  if (!adminMi) return <Navigate to="/" replace />;
  return children;
};

// Giriş yapılmışsa yönlendir
const GirisKontrol = ({ children }) => {
  const { girisYapildiMi, yukleniyor } = useYetkilendirme();
  if (yukleniyor) return <div className="spinner-kapsayici"><div className="spinner"></div></div>;
  if (girisYapildiMi) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/kitaplar" element={<Kitaplar />} />
          <Route path="/giris" element={<GirisKontrol><GirisYap /></GirisKontrol>} />
          <Route path="/kayit" element={<GirisKontrol><KayitOl /></GirisKontrol>} />
          <Route path="/uyeler" element={<KorumaliRota><Uyeler /></KorumaliRota>} />
          <Route path="/odunc" element={<KorumaliRota><OduncIslemleri /></KorumaliRota>} />
          <Route path="*" element={
            <div className="sayfa-kapsayici" style={{ textAlign: 'center', paddingTop: '80px' }}>
              <h1 style={{ fontSize: '4rem', marginBottom: '16px' }}>404</h1>
              <p style={{ color: 'var(--renk-metin-3)', fontSize: '1.1rem' }}>Aradığınız sayfa bulunamadı.</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
