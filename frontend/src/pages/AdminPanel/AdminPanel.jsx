// ============================================
// Admin Panel Sayfası
// Dashboard, kullanıcı yönetimi, kitap ve ödünç yönetimi
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import { istatistikServisi } from '../../services/api';
import YuklemeSpinner from '../../components/YuklemeSpinner/YuklemeSpinner';
import MesajBildirim from '../../components/MesajBildirim/MesajBildirim';
import './AdminPanel.css';

// ---- Yardımcı: Kaç gün gecikmiş hesapla ----
const kacGunGecikti = (tarih) => {
  const gun = Math.floor((new Date() - new Date(tarih)) / (1000 * 60 * 60 * 24));
  return gun > 0 ? gun : 0;
};

// ---- Yardımcı: Durum ikonu ----
const durumIkon = (durum) => {
  if (durum === 'odunc') return { ikon: '📖', sinif: 'odunc-ikon' };
  if (durum === 'iade_edildi') return { ikon: '✅', sinif: 'iade-ikon' };
  return { ikon: '⚠️', sinif: 'gecikti-ikon' };
};

// ============================================
// Dashboard Görünümü
// ============================================
const Dashboard = ({ ozet, sonOduncler, gecikmisList, azKalanKitaplar }) => (
  <div>
    <h1 className="admin-sayfa-baslik">Dashboard Paneli</h1>
    <p className="admin-sayfa-aciklama">RafArkası yönetim sistemine genel bakış</p>

    {/* İstatistik Kartları */}
    <div className="istat-grid">
      <div className="istat-kart mavi">
        <div className="istat-ikon">📚</div>
        <div className="istat-bilgi">
          <div className="istat-sayi">{ozet.toplamKitap}</div>
          <div className="istat-etiket">Toplam Kitap</div>
        </div>
      </div>
      <div className="istat-kart altin">
        <div className="istat-ikon">👥</div>
        <div className="istat-bilgi">
          <div className="istat-sayi">{ozet.toplamUye}</div>
          <div className="istat-etiket">Toplam Üye</div>
        </div>
      </div>
      <div className="istat-kart yesil">
        <div className="istat-ikon">🏛️</div>
        <div className="istat-bilgi">
          <div className="istat-sayi">{ozet.mevcutKitap}</div>
          <div className="istat-etiket">Rafta Mevcut</div>
        </div>
      </div>
      <div className="istat-kart uyari">
        <div className="istat-ikon">📋</div>
        <div className="istat-bilgi">
          <div className="istat-sayi">{ozet.aktifOdunc}</div>
          <div className="istat-etiket">Aktif Ödünç</div>
        </div>
      </div>
      <div className="istat-kart kirmizi">
        <div className="istat-ikon">⚠️</div>
        <div className="istat-bilgi">
          <div className="istat-sayi">{ozet.gecikmisSayi}</div>
          <div className="istat-etiket">Gecikmiş</div>
        </div>
      </div>
      <div className="istat-kart mor">
        <div className="istat-ikon">✅</div>
        <div className="istat-bilgi">
          <div className="istat-sayi">{ozet.iadeSayi}</div>
          <div className="istat-etiket">İade Edildi</div>
        </div>
      </div>
    </div>

    {/* Son İşlemler + Gecikmiş Listesi */}
    <div className="admin-iki-sutun">

      {/* Son Ödünç İşlemleri */}
      <div className="panel-kart">
        <div className="panel-kart-baslik">🕐 Son Ödünç İşlemleri</div>
        <div className="panel-kart-icerik">
          {sonOduncler.length === 0 ? (
            <div className="panel-bos">Henüz ödünç kaydı yok</div>
          ) : (
            sonOduncler.map((odunc) => {
              const { ikon, sinif } = durumIkon(odunc.durum);
              return (
                <div key={odunc.id} className="islem-satir">
                  <div className={`islem-ikon ${sinif}`}>{ikon}</div>
                  <div className="islem-detay">
                    <div className="islem-kitap">{odunc.kitap?.baslik || '-'}</div>
                    <div className="islem-uye">
                      {odunc.uye ? `${odunc.uye.ad} ${odunc.uye.soyad}` : '-'}
                    </div>
                  </div>
                  <div className="islem-tarih">
                    {new Date(odunc.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Gecikmiş Kitaplar */}
      <div className="panel-kart">
        <div className="panel-kart-baslik">🔴 Gecikmiş Kitaplar</div>
        <div className="panel-kart-icerik">
          {gecikmisList.length === 0 ? (
            <div className="panel-bos">🎉 Gecikmiş ödünç yok!</div>
          ) : (
            gecikmisList.map((odunc) => (
              <div key={odunc.id} className="gecikti-satir">
                <div>
                  <div className="gecikti-uye-adi">
                    {odunc.uye ? `${odunc.uye.ad} ${odunc.uye.soyad}` : '-'}
                  </div>
                  <div className="gecikti-kitap">{odunc.kitap?.baslik || '-'}</div>
                </div>
                <div className="gecikti-gun">
                  +{kacGunGecikti(odunc.sonIadeTarihi)} gün
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>

    {/* Az Kalan Stok */}
    {azKalanKitaplar.length > 0 && (
      <div className="panel-kart">
        <div className="panel-kart-baslik">📉 Stok Uyarısı — Az Kalan Kitaplar</div>
        <div className="panel-kart-icerik">
          {azKalanKitaplar.map((kitap) => (
            <div key={kitap.id} className="stok-satir">
              <div>
                <div className="stok-kitap-adi">{kitap.baslik}</div>
                <div className="islem-uye">{kitap.yazar}</div>
              </div>
              <div className={`stok-adet ${kitap.mevcutAdet === 0 ? 'kritik' : 'dusuk'}`}>
                {kitap.mevcutAdet === 0 ? '❌ Tükendi' : `${kitap.mevcutAdet} adet kaldı`}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ============================================
// Ana AdminPanel Bileşeni
// ============================================
const AdminPanel = () => {
  const { uye, adminMi } = useYetkilendirme();
  const navigate = useNavigate();
  const [aktifSayfa, aktifSayfaAyarla] = useState('dashboard');
  const [yukleniyor, yukleniyorAyarla] = useState(true);
  const [mesaj, mesajAyarla] = useState({ tip: '', metin: '' });
  const [veri, veriAyarla] = useState({
    ozet: {},
    sonOduncler: [],
    gecikmisList: [],
    azKalanKitaplar: []
  });

  // Admin değilse ana sayfaya yönlendir
  useEffect(() => {
    if (!adminMi) {
      navigate('/', { replace: true });
    }
  }, [adminMi, navigate]);

  // Verileri yükle
  useEffect(() => {
    const verileriGetir = async () => {
      yukleniyorAyarla(true);
      try {
        const yanit = await istatistikServisi.adminGetir();
        if (yanit.data.basarili) {
          veriAyarla({
            ozet: yanit.data.ozet,
            sonOduncler: yanit.data.sonOduncler,
            gecikmisList: yanit.data.gecikmisList,
            azKalanKitaplar: yanit.data.azKalanKitaplar
          });
        }
      } catch {
        mesajAyarla({ tip: 'hata', metin: 'Veriler yüklenirken bir hata oluştu.' });
      } finally {
        yukleniyorAyarla(false);
      }
    };

    if (adminMi) verileriGetir();
  }, [adminMi]);

  // Sidebar menü öğeleri
  const menuOgeleri = [
    { anahtar: 'dashboard', ikon: '📊', metin: 'Dashboard' },
    { anahtar: 'kitaplar', ikon: '📚', metin: 'Kitap Yönetimi', rota: '/kitaplar' },
    { anahtar: 'uyeler', ikon: '👥', metin: 'Üye Yönetimi', rota: '/uyeler' },
    { anahtar: 'odunc', ikon: '📋', metin: 'Ödünç Yönetimi', rota: '/odunc' },
  ];

  const menuTikla = (oge) => {
    if (oge.rota) {
      navigate(oge.rota);
    } else {
      aktifSayfaAyarla(oge.anahtar);
    }
  };

  if (!adminMi) return null;

  return (
    <div className="admin-duzen">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-baslik">
          <div className="sidebar-logo-metin" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Yönetim Paneli</div>
          <div className="sidebar-alt-baslik">Hızlı Erişim Menüsü</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-bolum-baslik">Menü</div>

          {menuOgeleri.map((oge) => (
            <button
              key={oge.anahtar}
              className={`sidebar-link ${aktifSayfa === oge.anahtar ? 'aktif' : ''}`}
              onClick={() => menuTikla(oge)}
            >
              <span className="sidebar-link-ikon">{oge.ikon}</span>
              {oge.metin}
            </button>
          ))}

          <div className="sidebar-bolum-baslik" style={{ marginTop: '16px' }}>Navigasyon</div>
          <button className="sidebar-link" onClick={() => navigate('/')}>
            <span className="sidebar-link-ikon">🏠</span>
            Ana Sayfa
          </button>
        </nav>

        <div className="sidebar-alt">
          <div className="sidebar-uye-adi">
            {uye ? `${uye.ad} ${uye.soyad}` : ''}
          </div>
          <div>👑 Sistem Yöneticisi</div>
        </div>
      </aside>

      {/* İçerik Alanı */}
      <main className="admin-icerik">
        <MesajBildirim mesaj={mesaj} mesajAyarla={mesajAyarla} />

        {yukleniyor ? (
          <YuklemeSpinner />
        ) : (
          <>
            {aktifSayfa === 'dashboard' && (
              <Dashboard
                ozet={veri.ozet}
                sonOduncler={veri.sonOduncler}
                gecikmisList={veri.gecikmisList}
                azKalanKitaplar={veri.azKalanKitaplar}
              />
            )}
          </>
        )}
      </main>

    </div>
  );
};

export default AdminPanel;
