// ============================================
// Ödünç İşlemleri Sayfası (Sadece Admin)
// ============================================

import { useState, useEffect } from 'react';
import { oduncServisi, kitapServisi, uyeServisi } from '../../services/api';
import YuklemeSpinner from '../../components/YuklemeSpinner/YuklemeSpinner';
import MesajBildirim from '../../components/MesajBildirim/MesajBildirim';
import BosDurum from '../../components/BosDurum/BosDurum';
import './OduncIslemleri.css';

const OduncIslemleri = () => {
  const [oduncler, odunclerAyarla] = useState([]);
  const [yukleniyor, yukleniyorAyarla] = useState(true);
  const [durumFiltre, durumFiltreAyarla] = useState('');
  const [mesaj, mesajAyarla] = useState({ tip: '', metin: '' });
  const [modalAcik, modalAcikAyarla] = useState(false);
  const [kitaplar, kitaplarAyarla] = useState([]);
  const [uyeler, uyelerAyarla] = useState([]);
  const [form, formAyarla] = useState({ kitapId: '', uyeId: '', iadeTarihi: '' });

  const oduncleriGetir = async () => {
    yukleniyorAyarla(true);
    try {
      const yanit = await oduncServisi.tumunuGetir({ durum: durumFiltre, limit: 100 });
      if (yanit.data.basarili) {
        odunclerAyarla(yanit.data.oduncler);
      }
    } catch {
      mesajAyarla({ tip: 'hata', metin: 'Yüklenirken hata oluştu.' });
    } finally {
      yukleniyorAyarla(false);
    }
  };

  useEffect(() => { oduncleriGetir(); }, [durumFiltre]);

  const oduncModalAc = async () => {
    try {
      const kitaplarYaniti = await kitapServisi.tumunuGetir({ limit: 1000 });
      const uyelerYaniti = await uyeServisi.tumunuGetir({ limit: 1000 });

      // Sadece stokta olan kitapları filtrele
      const stoktakiKitaplar = kitaplarYaniti.data.kitaplar.filter(
        (kitap) => kitap.mevcutAdet > 0
      );

      kitaplarAyarla(stoktakiKitaplar);
      uyelerAyarla(uyelerYaniti.data.uyeler);

      // Varsayılan iade tarihini 15 gün sonraya ayarla
      const iadeTarihi = new Date();
      iadeTarihi.setDate(iadeTarihi.getDate() + 15);
      formAyarla({ kitapId: '', uyeId: '', iadeTarihi: iadeTarihi.toISOString().split('T')[0] });
      modalAcikAyarla(true);
    } catch {
      mesajAyarla({ tip: 'hata', metin: 'Veriler yüklenirken hata oluştu, lütfen sayfayı yenileyin.' });
    }
  };

  const oduncVer = async (etkinlik) => {
    etkinlik.preventDefault();
    try {
      await oduncServisi.oduncVer(form);
      mesajAyarla({ tip: 'basari', metin: 'Kitap başarıyla ödünç verildi!' });
      modalAcikAyarla(false);
      oduncleriGetir();
    } catch (hata) {
      mesajAyarla({ tip: 'hata', metin: hata.response?.data?.mesaj || 'İşlem sırasında beklenmedik bir hata oluştu.' });
    }
  };

  const iadeIslemi = async (id) => {
    if (!window.confirm('Bu kitabı iade edilmiş olarak işaretlemek istiyor musunuz?')) return;
    try {
      await oduncServisi.iadeEt(id);
      mesajAyarla({ tip: 'basari', metin: 'Kitap başarıyla iade alındı!' });
      oduncleriGetir();
    } catch {
      mesajAyarla({ tip: 'hata', metin: 'İade işlemi sırasında bir hata oluştu.' });
    }
  };

  // Duruma göre renkli rozet oluştur
  const durumRozeti = (durum) => {
    const rozetHaritasi = {
      odunc: { stil: 'rozet-uyari', metin: '📖 Ödünçte' },
      iade_edildi: { stil: 'rozet-basari', metin: '✅ İade Edildi' },
      gecikti: { stil: 'rozet-tehlike', metin: '⚠️ Gecikti' }
    };
    const { stil, metin } = rozetHaritasi[durum] || { stil: 'rozet-bilgi', metin: durum };
    return <span className={`rozet ${stil}`}>{metin}</span>;
  };

  return (
    <div className="sayfa-kapsayici" id="odunc-sayfa">
      <h1 className="sayfa-baslik">🔄 Ödünç İşlemleri</h1>
      <p className="sayfa-aciklama">Kitap ödünç verme ve iade işlemlerini yönetin</p>

      {/* Bildirim Mesajı */}
      <MesajBildirim mesaj={mesaj} mesajAyarla={mesajAyarla} />

      {/* Üst Alan: Filtre ve Yeni Ödünç Butonu */}
      <div className="odunc-ust">
        <div className="odunc-filtreler">
          <select
            className="form-girdi"
            value={durumFiltre}
            onChange={(etkinlik) => durumFiltreAyarla(etkinlik.target.value)}
            id="odunc-filtre"
          >
            <option value="">Tüm Durumlar</option>
            <option value="odunc">Ödünçte</option>
            <option value="iade_edildi">İade Edildi</option>
            <option value="gecikti">Gecikti</option>
          </select>
        </div>

        <button className="btn btn-birincil" onClick={oduncModalAc} id="odunc-ver-btn">
          ➕ Ödünç Ver
        </button>
      </div>

      {/* İçerik Alanı */}
      {yukleniyor ? (
        <YuklemeSpinner />
      ) : oduncler.length === 0 ? (
        <BosDurum ikon="🔄" mesaj="Henüz ödünç işlemi bulunmuyor" />
      ) : (
        <div className="tablo-kapsayici">
          <table className="tablo">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kitap</th>
                <th>Üye</th>
                <th>Alış Tarihi</th>
                <th>İade Tarihi</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {oduncler.map((oduncKaydi) => (
                <tr key={oduncKaydi.id}>
                  <td>#{oduncKaydi.id}</td>
                  <td><strong>{oduncKaydi.kitap?.baslik || '-'}</strong></td>
                  <td>{oduncKaydi.uye ? `${oduncKaydi.uye.ad} ${oduncKaydi.uye.soyad}` : '-'}</td>
                  <td>{oduncKaydi.alimTarihi ? new Date(oduncKaydi.alimTarihi).toLocaleDateString('tr-TR') : '-'}</td>
                  <td>{oduncKaydi.iadeTarihi ? new Date(oduncKaydi.iadeTarihi).toLocaleDateString('tr-TR') : '-'}</td>
                  <td>{durumRozeti(oduncKaydi.durum)}</td>
                  <td>
                    {(oduncKaydi.durum === 'odunc' || oduncKaydi.durum === 'gecikti') && (
                      <button className="btn btn-basari btn-kucuk" onClick={() => iadeIslemi(oduncKaydi.id)}>
                        📥 İade
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ödünç Ver Modalı */}
      {modalAcik && (
        <div className="modal-arka-plan" onClick={() => modalAcikAyarla(false)}>
          <div className="modal-icerik" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-baslik">📖 Kitap Ödünç Ver</h2>
            <form onSubmit={oduncVer}>
              <div className="form-grup">
                <label className="form-etiket">Kitap *</label>
                <select className="form-girdi" value={form.kitapId}
                  onChange={(e) => formAyarla({ ...form, kitapId: e.target.value })} required>
                  <option value="">Kitap seçiniz...</option>
                  {kitaplar.map((kitap) => (
                    <option key={kitap.id} value={kitap.id}>
                      {kitap.baslik} ({kitap.mevcutAdet} adet mevcut)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-grup">
                <label className="form-etiket">Üye *</label>
                <select className="form-girdi" value={form.uyeId}
                  onChange={(e) => formAyarla({ ...form, uyeId: e.target.value })} required>
                  <option value="">Üye seçiniz...</option>
                  {uyeler.map((uye) => (
                    <option key={uye.id} value={uye.id}>
                      {uye.ad} {uye.soyad}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-grup">
                <label className="form-etiket">İade Tarihi (Otomatik 15 Gün Sonrası Atanır)</label>
                <input type="date" className="form-girdi" value={form.iadeTarihi}
                  onChange={(e) => formAyarla({ ...form, iadeTarihi: e.target.value })} />
              </div>
              <div className="modal-butonlar">
                <button type="button" className="btn btn-ikincil" onClick={() => modalAcikAyarla(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-birincil">Ödünç Ver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OduncIslemleri;
