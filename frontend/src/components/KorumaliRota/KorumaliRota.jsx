// ============================================
// KorumaliRota Bileşeni
// Giriş yapılmamışsa veya gerekli role sahip değilse
// kullanıcıyı ilgili sayfaya yönlendirir.
// izinliRoller verilmezse varsayılan olarak yalnızca admin erişebilir.
// ============================================

import { Navigate } from 'react-router-dom';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import YuklemeSpinner from '../YuklemeSpinner/YuklemeSpinner';

const KorumaliRota = ({ children, izinliRoller = ['admin'] }) => {
  const { girisYapildiMi, uye, yukleniyor } = useYetkilendirme();

  // Oturum kontrolü yapılıyorken spinner göster
  if (yukleniyor) return <YuklemeSpinner />;

  // Giriş yapılmamışsa giriş sayfasına yönlendir
  if (!girisYapildiMi) return <Navigate to="/giris" replace />;

  // Giriş yapılmış ama rolü izinli değilse ana sayfaya yönlendir
  if (!izinliRoller.includes(uye?.rol)) return <Navigate to="/" replace />;

  return children;
};

export default KorumaliRota;
