// ============================================
// KorumaliRota Bileşeni
// Giriş yapılmamışsa veya admin değilse
// kullanıcıyı ilgili sayfaya yönlendirir
// ============================================

import { Navigate } from 'react-router-dom';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import YuklemeSpinner from '../YuklemeSpinner/YuklemeSpinner';

const KorumaliRota = ({ children }) => {
  const { girisYapildiMi, adminMi, yukleniyor } = useYetkilendirme();

  // Oturum kontrolü yapılıyorken spinner göster
  if (yukleniyor) return <YuklemeSpinner />;

  // Giriş yapılmamışsa giriş sayfasına yönlendir
  if (!girisYapildiMi) return <Navigate to="/giris" replace />;

  // Giriş yapılmış ama admin değilse ana sayfaya yönlendir
  if (!adminMi) return <Navigate to="/" replace />;

  return children;
};

export default KorumaliRota;
