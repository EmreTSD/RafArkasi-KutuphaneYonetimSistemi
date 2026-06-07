// ============================================
// Ana Sayfa Bileşeni
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import { istatistikServisi } from '../../services/api';
import './AnaSayfa.css';

const AnaSayfa = () => {
  const { girisYapildiMi, adminMi } = useYetkilendirme();
  const [istatistikler, istatistiklerAyarla] = useState({
    toplamKitap: 0, toplamKategori: 0, mevcutKitap: 0, oduncKitap: 0
  });

  useEffect(() => {
    const istatistikleriGetir = async () => {
      try {
        const yanit = await istatistikServisi.getir();

        if (yanit.data.basarili) {
          istatistiklerAyarla({
            toplamKitap: yanit.data.toplamKitap,
            toplamKategori: yanit.data.toplamKategori,
            mevcutKitap: yanit.data.mevcutKitap,
            oduncKitap: yanit.data.oduncKitap
          });
        }
      } catch (hata) {
        console.log('İstatistikler yüklenemedi');
      }
    };

    istatistikleriGetir();
  }, []);

  return (
    <div className="sayfa-kapsayici" id="anasayfa">
      <section className="anasayfa-hero">
        <img src="/RafArkasıLogo.png" alt="RafArkası Logo" className="hero-logo" />
        <h1 className="hero-baslik">Kütüphane Yönetim Sistemi</h1>
        <p className="hero-aciklama">
          Kitaplarınızı kolayca yönetin, üyelerinizi takip edin ve ödünç
          işlemlerini hızlıca gerçekleştirin. Modern ve kullanıcı dostu arayüz
          ile RafArkası'nı dijital dünyaya taşıyın.
        </p>
        <div className="hero-butonlar">
          <Link to="/kitaplar" className="btn btn-birincil" id="hero-kitaplar-btn">📖 Kitapları Keşfet</Link>
          {!girisYapildiMi && <Link to="/kayit" className="btn btn-ikincil" id="hero-kayit-btn">✨ Üye Ol</Link>}
          {girisYapildiMi && adminMi && <Link to="/odunc" className="btn btn-ikincil" id="hero-odunc-btn">Ödünç İşlemleri</Link>}
        </div>
      </section>
      <section className="istatistik-bolum">
        <div className="istatistik-grid">

          <div className="istatistik-kart">
            <div className="istatistik-ikon">📖</div>
            <div className="istatistik-deger">{istatistikler.toplamKitap}</div>
            <div className="istatistik-etiket">Toplam Kitap</div>
          </div>

          <div className="istatistik-kart">
            <div className="istatistik-ikon">📂</div>
            <div className="istatistik-deger">{istatistikler.toplamKategori}</div>
            <div className="istatistik-etiket">Kategori</div>
          </div>

          <div className="istatistik-kart">
            <div className="istatistik-ikon">✅</div>
            <div className="istatistik-deger">{istatistikler.mevcutKitap}</div>
            <div className="istatistik-etiket">Mevcut Kitap</div>
          </div>

          <div className="istatistik-kart">
            <div className="istatistik-deger">{istatistikler.oduncKitap}</div>
            <div className="istatistik-etiket">Ödünçteki Kitap</div>
          </div>

        </div>
      </section>
      <section className="ozellikler-bolum">
        <h2 className="ozellikler-baslik">Neden Biz?</h2>
        <div className="ozellikler-grid">

          <div className="ozellik-kart">
            <div className="ozellik-ikon">🔍</div>
            <h3 className="ozellik-baslik">Kolay Arama</h3>
            <p className="ozellik-aciklama">Kitap adı, yazar veya ISBN numarasıyla anında arama yapın.</p>
          </div>

          <div className="ozellik-kart">
            <div className="ozellik-ikon">📊</div>
            <h3 className="ozellik-baslik">Stok Takibi</h3>
            <p className="ozellik-aciklama">Anlık stok durumunu görüntüleyin. Mevcut ve ödünçteki kitapları takip edin.</p>
          </div>

          <div className="ozellik-kart">
            <div className="ozellik-ikon">🔐</div>
            <h3 className="ozellik-baslik">Güvenli Erişim</h3>
            <p className="ozellik-aciklama">JWT tabanlı güvenlik sistemi ile verileriniz güvende.</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AnaSayfa;
