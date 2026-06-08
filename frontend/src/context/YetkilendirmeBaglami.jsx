// ============================================
// Yetkilendirme Bağlamı (Auth Context)
// Kullanıcı oturum bilgisini tüm uygulamada paylaşır
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import { yetkilendirmeServisi } from '../services/api';

// Bağlam oluştur
const YetkilendirmeBaglami = createContext(null);

// Bağlam sağlayıcı bileşeni
export const YetkilendirmeSaglayici = ({ children }) => {
  const [uye, uyeAyarla] = useState(null);
  const [yukleniyor, yukleniyorAyarla] = useState(true);

  // Sayfa yüklendiğinde oturum kontrolü yap
  useEffect(() => {
    const oturumKontrol = async () => {
      const token = localStorage.getItem('token');
      const kayitliUye = localStorage.getItem('uye');

      if (token && kayitliUye) {
        try {
          const yanit = await yetkilendirmeServisi.profilGetir();
          uyeAyarla(yanit.data.uye);
        } catch (hata) {
          localStorage.removeItem('token');
          localStorage.removeItem('uye');
          uyeAyarla(null);
        }
      }
      yukleniyorAyarla(false);
    };

    oturumKontrol();
  }, []);

  // Giriş yap
  const girisYap = async (eposta, sifre) => {
    const yanit = await yetkilendirmeServisi.girisYap({ eposta, sifre });
    const { token, uye: uyeBilgi } = yanit.data;
    localStorage.setItem('token', token);
    localStorage.setItem('uye', JSON.stringify(uyeBilgi));
    uyeAyarla(uyeBilgi);
    return yanit.data;
  };

  // Kayıt ol
  const kayitOl = async (veri) => {
    const yanit = await yetkilendirmeServisi.kayitOl(veri);
    const { token, uye: uyeBilgi } = yanit.data;
    localStorage.setItem('token', token);
    localStorage.setItem('uye', JSON.stringify(uyeBilgi));
    uyeAyarla(uyeBilgi);
    return yanit.data;
  };

  // Çıkış yap
  const cikisYap = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uye');
    uyeAyarla(null);
  };

  // Bağlam değerleri
  const deger = {
    uye,
    yukleniyor,
    girisYap,
    kayitOl,
    cikisYap,
    girisYapildiMi: !!uye,
    adminMi: uye?.rol === 'admin',
    moderatorMu: uye?.rol === 'moderator',
    // Kitap işlemleri ve istatistikler için yetki: admin veya moderator
    kitapYetkisi: uye?.rol === 'admin' || uye?.rol === 'moderator'
  };

  return (
    <YetkilendirmeBaglami.Provider value={deger}>
      {children}
    </YetkilendirmeBaglami.Provider>
  );
};

// Bağlamı kullanmak için özel hook
export const useYetkilendirme = () => {
  const baglam = useContext(YetkilendirmeBaglami);
  if (!baglam) {
    throw new Error('useYetkilendirme, YetkilendirmeSaglayici içinde kullanılmalıdır');
  }
  return baglam;
};

export default YetkilendirmeBaglami;
