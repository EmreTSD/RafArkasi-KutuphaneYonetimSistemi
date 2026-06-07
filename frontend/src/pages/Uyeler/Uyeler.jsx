// ============================================
// Üyeler Sayfası (Sadece Admin)
// ============================================

import { useState, useEffect } from 'react';
import { uyeServisi } from '../../services/api';
import YuklemeSpinner from '../../components/YuklemeSpinner/YuklemeSpinner';
import MesajBildirim from '../../components/MesajBildirim/MesajBildirim';
import BosDurum from '../../components/BosDurum/BosDurum';
import './Uyeler.css';

const Uyeler = () => {
  const [uyeler, uyelerAyarla] = useState([]);
  const [yukleniyor, yukleniyorAyarla] = useState(true);
  const [arama, aramaAyarla] = useState('');
  const [mesaj, mesajAyarla] = useState({ tip: '', metin: '' });

  const uyeleriGetir = async (arananKelime = arama) => {
    yukleniyorAyarla(true);
    try {
      const yanit = await uyeServisi.tumunuGetir({ arama: arananKelime, limit: 100 });
      if (yanit.data.basarili) {
        uyelerAyarla(yanit.data.uyeler);
      }
    } catch {
      mesajAyarla({ tip: 'hata', metin: 'Üyeler yüklenirken hata oluştu.' });
    } finally {
      yukleniyorAyarla(false);
    }
  };

  useEffect(() => { uyeleriGetir(); }, []);

  const aramaYap = (etkinlik) => {
    etkinlik.preventDefault();
    uyeleriGetir(arama);
  };

  const uyeSilIslemi = async (id) => {
    if (!window.confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) return;
    try {
      await uyeServisi.sil(id);
      mesajAyarla({ tip: 'basari', metin: 'Üye silindi!' });
      uyeleriGetir();
    } catch {
      mesajAyarla({ tip: 'hata', metin: 'Üye silinirken hata oluştu.' });
    }
  };

  return (
    <div className="sayfa-kapsayici" id="uyeler-sayfasi">
      <div className="sayfa-baslik-alani">
        <h1 className="sayfa-baslik">👥 Üyeler</h1>
        <p className="sayfa-aciklama">RafArkası üyelerini görüntüleyin ve yönetin</p>
      </div>

      {/* Bildirim Mesajı */}
      <MesajBildirim mesaj={mesaj} mesajAyarla={mesajAyarla} />

      {/* Arama Alanı */}
      <div className="uyeler-ust">
        <form className="uyeler-arama-kutusu" onSubmit={aramaYap}>
          <input
            type="text"
            className="form-girdi"
            placeholder="🔍 Ad, soyad veya e-posta ara..."
            value={arama}
            onChange={(etkinlik) => aramaAyarla(etkinlik.target.value)}
            id="uye-arama"
          />
          <button type="submit" className="btn btn-ikincil">Ara</button>
        </form>
      </div>

      {/* İçerik Alanı */}
      {yukleniyor ? (
        <YuklemeSpinner />
      ) : uyeler.length === 0 ? (
        <BosDurum ikon="👥" mesaj="Henüz üye bulunmuyor" />
      ) : (
        <div className="tablo-kapsayici">
          <table className="tablo">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Telefon</th>
                <th>Rol</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {uyeler.map((uye) => (
                <tr key={uye.id}>
                  <td>#{uye.id}</td>
                  <td><strong>{uye.ad} {uye.soyad}</strong></td>
                  <td>{uye.eposta}</td>
                  <td>{uye.telefon || '-'}</td>
                  <td>
                    <span className={`rozet ${uye.rol === 'admin' ? 'rozet-uyari' : 'rozet-bilgi'}`}>
                      {uye.rol === 'admin' ? '👑 Admin' : '👤 Üye'}
                    </span>
                  </td>
                  <td>
                    <span className={`rozet ${uye.aktifMi ? 'rozet-basari' : 'rozet-tehlike'}`}>
                      {uye.aktifMi ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-tehlike btn-kucuk" onClick={() => uyeSilIslemi(uye.id)}>
                      🗑️ Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Uyeler;
