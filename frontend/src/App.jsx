// ============================================
// Ana Uygulama Bileşeni
// Sayfa yönlendirmelerini ve genel düzeni yönetir
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useYetkilendirme } from './context/YetkilendirmeBaglami';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import KorumaliRota from './components/KorumaliRota/KorumaliRota';
import YuklemeSpinner from './components/YuklemeSpinner/YuklemeSpinner';
import BosDurum from './components/BosDurum/BosDurum';
import AnaSayfa from './pages/AnaSayfa/AnaSayfa';
import Kitaplar from './pages/Kitaplar/Kitaplar';
import Uyeler from './pages/Uyeler/Uyeler';
import OduncIslemleri from './pages/OduncIslemleri/OduncIslemleri';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import GirisYap from './pages/GirisYap/GirisYap';
import KayitOl from './pages/KayitOl/KayitOl';

// Giriş yapılmışsa giriş/kayıt sayfasına erişimi engelle
const GirisKontrol = ({ children }) => {
  const { girisYapildiMi, yukleniyor } = useYetkilendirme();
  if (yukleniyor) return <YuklemeSpinner />;
  if (girisYapildiMi) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Herkese Açık Rotalar */}
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/kitaplar" element={<Kitaplar />} />

          {/* Yalnızca Giriş Yapmamışlara Açık Rotalar */}
          <Route path="/giris" element={<GirisKontrol><GirisYap /></GirisKontrol>} />
          <Route path="/kayit" element={<GirisKontrol><KayitOl /></GirisKontrol>} />

          {/* Admin ve Moderator'e Açık Rota (istatistik paneli) */}
          <Route path="/admin" element={<KorumaliRota izinliRoller={['admin', 'moderator']}><AdminPanel /></KorumaliRota>} />

          {/* Yalnızca Adminlere Açık Rotalar */}
          <Route path="/uyeler" element={<KorumaliRota><Uyeler /></KorumaliRota>} />
          <Route path="/odunc" element={<KorumaliRota><OduncIslemleri /></KorumaliRota>} />

          {/* 404 Sayfası */}
          <Route path="*" element={
            <div className="sayfa-kapsayici">
              <BosDurum ikon="🔍" mesaj="404 — Aradığınız sayfa bulunamadı." />
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
