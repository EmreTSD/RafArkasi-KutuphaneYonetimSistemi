// ============================================
// Ödünç İşlemleri Sayfası (Sadece Admin)
// ============================================

import { useState, useEffect } from 'react';
import { oduncServisi, kitapServisi, uyeServisi } from '../../services/api';
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
      const yanit = await oduncServisi.tumunuGetir({
        durum: durumFiltre,
        limit: 100
      });

      if (yanit.data.basarili) {
        odunclerAyarla(yanit.data.oduncler);
      }
    } catch (hata) {
      mesajAyarla({
        tip: 'hata',
        metin: 'Yüklenirken hata oluştu.'
      });
    } finally {
      yukleniyorAyarla(false);
    }
  };

  useEffect(() => { oduncleriGetir(); }, [durumFiltre]);


  const oduncModalAc = async () => {
    try {

      const kitaplarYaniti = await kitapServisi.tumunuGetir({ limit: 1000 });
      const uyelerYaniti = await uyeServisi.tumunuGetir({ limit: 1000 });


      const stoktakiKitaplar = [];


      kitaplarYaniti.data.kitaplar.forEach(function (kitap) {

        if (kitap.mevcutAdet > 0) {

          stoktakiKitaplar.push(kitap);
        }
      });


      kitaplarAyarla(stoktakiKitaplar);

      uyelerAyarla(uyelerYaniti.data.uyeler);

      const iadeTarihi = new Date();
      iadeTarihi.setDate(iadeTarihi.getDate() + 15);

      const formatliTarih = iadeTarihi.toISOString().split('T')[0];


      formAyarla({
        kitapId: '',
        uyeId: '',
        iadeTarihi: formatliTarih
      });

      modalAcikAyarla(true);

    } catch (hata) {

      mesajAyarla({
        tip: 'hata',
        metin: 'Veriler yüklenirken hata oluştu, lütfen sayfayı yenileyin.'
      });
    }
  };


  const oduncVer = async (etkinlik) => {

    etkinlik.preventDefault();

    try {

      await oduncServisi.oduncVer(form);


      mesajAyarla({
        tip: 'basari',
        metin: 'Kitap başarıyla ödünç verildi!'
      });


      modalAcikAyarla(false);


      oduncleriGetir();

    } catch (hata) {

      const hataMesaji = hata.response?.data?.mesaj || 'İşlem sırasında beklenmedik bir hata oluştu.';

      mesajAyarla({
        tip: 'hata',
        metin: hataMesaji
      });
    }
  };

  const iadeIslemi = async (id) => {

    const eminMi = window.confirm('Bu kitabı iade edilmiş olarak işaretlemek istiyor musunuz?');

    if (eminMi === false) {
      return;
    }

    try {

      await oduncServisi.iadeEt(id);


      mesajAyarla({
        tip: 'basari',
        metin: 'Kitap başarıyla iade alındı!'
      });


      oduncleriGetir();

    } catch (hata) {

      mesajAyarla({
        tip: 'hata',
        metin: 'İade işlemi sırasında bir hata oluştu.'
      });
    }
  };

  const durumRozeti = (durum) => {
    let stil = 'rozet-bilgi';
    let metin = durum;

    if (durum === 'odunc') {
      stil = 'rozet-uyari';
      metin = '📖 Ödünçte';
    } else if (durum === 'iade_edildi') {
      stil = 'rozet-basari';
      metin = '✅ İade Edildi';
    } else if (durum === 'gecikti') {
      stil = 'rozet-tehlike';
      metin = '⚠️ Gecikti';
    }

    return <span className={`rozet ${stil}`}>{metin}</span>;
  };

  useEffect(() => {
    if (mesaj.metin) {
      const zamanlayici = setTimeout(() => {
        mesajAyarla({ tip: '', metin: '' });
      }, 4000);

      return () => {
        clearTimeout(zamanlayici);
      };
    }
  }, [mesaj]);


  return (
    <div className="sayfa-kapsayici" id="odunc-sayfa">
      <h1 className="sayfa-baslik">🔄 Ödünç İşlemleri</h1>
      <p className="sayfa-aciklama">Kitap ödünç verme ve iade işlemlerini yönetin</p>


      {mesaj.metin !== '' && (
        <div className={`mesaj mesaj-${mesaj.tip}`}>

          {mesaj.tip === 'basari' ? '✅' : '⚠️'}
          {' '}
          {mesaj.metin}
        </div>
      )}


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


        <button
          className="btn btn-birincil"
          onClick={oduncModalAc}
          id="odunc-ver-btn"
        >
          ➕ Ödünç Ver
        </button>

      </div>



      {yukleniyor === true ? (
        <div className="spinner-kapsayici">
          <div className="spinner"></div>
        </div>
      )


        : oduncler.length === 0 ? (
          <div className="bos-durum">
            <div className="bos-durum-ikon">🔄</div>
            <p className="bos-durum-mesaj">Henüz ödünç işlemi bulunmuyor</p>
          </div>
        )


          : (
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


                      <td>
                        <strong>
                          {oduncKaydi.kitap !== null ? oduncKaydi.kitap.kitapAdi : '-'}
                        </strong>
                      </td>
                      <td>
                        {oduncKaydi.uye !== null ? `${oduncKaydi.uye.ad} ${oduncKaydi.uye.soyad}` : '-'}
                      </td>

                      <td>{oduncKaydi.alisTarihi}</td>
                      <td>{oduncKaydi.iadeTarihi}</td>


                      <td>
                        {durumRozeti(oduncKaydi.durum)}
                      </td>


                      <td>

                        {oduncKaydi.durum === 'odunc' && (
                          <button
                            className="btn btn-basari btn-kucuk"
                            onClick={() => iadeIslemi(oduncKaydi.id)}
                          >
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



      {modalAcik === true && (

        <div className="modal-arka-plan" onClick={() => modalAcikAyarla(false)}>


          <div className="modal-icerik" onClick={(etkinlik) => etkinlik.stopPropagation()}>

            <h2 className="modal-baslik">📖 Kitap Ödünç Ver</h2>

            <form onSubmit={oduncVer}>


              <div className="form-grup">
                <label className="form-etiket">Kitap *</label>
                <select
                  className="form-girdi"
                  value={form.kitapId}
                  onChange={(etkinlik) => formAyarla({ ...form, kitapId: etkinlik.target.value })}
                  required
                >
                  <option value="">Kitap seçiniz...</option>

                  {kitaplar.map((kitap) => (
                    <option key={kitap.id} value={kitap.id}>
                      {kitap.kitapAdi} ({kitap.mevcutAdet} adet mevcut)
                    </option>
                  ))}
                </select>
              </div>


              <div className="form-grup">
                <label className="form-etiket">Üye *</label>
                <select
                  className="form-girdi"
                  value={form.uyeId}
                  onChange={(etkinlik) => formAyarla({ ...form, uyeId: etkinlik.target.value })}
                  required
                >
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
                <input
                  type="date"
                  className="form-girdi"
                  value={form.iadeTarihi}
                  onChange={(etkinlik) => formAyarla({ ...form, iadeTarihi: etkinlik.target.value })}
                />
              </div>


              <div className="modal-butonlar">
                <button type="button" className="btn btn-ikincil" onClick={() => modalAcikAyarla(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-birincil">
                  Ödünç Ver
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OduncIslemleri;
