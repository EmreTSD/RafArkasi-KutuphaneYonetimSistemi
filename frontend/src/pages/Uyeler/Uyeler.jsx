
import { useState, useEffect } from 'react';
import { uyeServisi } from '../../services/api';
import './Uyeler.css';

const Uyeler = () => {
  const [uyeler, uyelerAyarla] = useState([]);
  const [yukleniyor, yukleniyorAyarla] = useState(true);
  const [arama, aramaAyarla] = useState('');
  const [mesaj, mesajAyarla] = useState({ tip: '', metin: '' });

  // Üyeleri getiren fonksiyon (artık dışarıdan 'arananKelime' alabiliyor)
  const uyeleriGetir = async (arananKelime = arama) => {
    yukleniyorAyarla(true);

    try {
      const yanit = await uyeServisi.tumunuGetir({
        arama: arananKelime,
        limit: 100
      });


      if (yanit.data.basarili) {
        uyelerAyarla(yanit.data.uyeler);
      }
    } catch (hata) {

      mesajAyarla({
        tip: 'hata',
        metin: 'Üyeler yüklenirken hata oluştu.'
      });
    } finally {

      yukleniyorAyarla(false);
    }
  };


  useEffect(() => {
    uyeleriGetir();
  }, []);


  function aramaYap(etkinlik) {

    etkinlik.preventDefault();


    const aramaKutusu = document.getElementById("uye-arama");


    const icindekiYazi = aramaKutusu.value;


    aramaAyarla(icindekiYazi);

    uyeleriGetir(icindekiYazi);
  }




  const uyeSilIslemi = async (id) => {

    if (!window.confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) {
      return;
    }



    try {

      await uyeServisi.sil(id);


      mesajAyarla({
        tip: 'basari',
        metin: 'Üye silindi!'
      });
      uyeleriGetir();
    } catch (hata) {

      mesajAyarla({
        tip: 'hata',
        metin: 'Üye silinirken hata oluştu.'
      });
    }
  };


  useEffect(() => {
    if (mesaj.metin) {
      const zamanlayici = setTimeout(() => {
        mesajAyarla({
          tip: '',
          metin: ''
        });
      }, 4000);

      return () => {
        clearTimeout(zamanlayici);
      };
    }
  }, [mesaj]);


  return (
    <div className="sayfa-kapsayici" id="uyeler-sayfa">
      <h1 className="sayfa-baslik">👥 Üyeler</h1>
      <p className="sayfa-aciklama">Kütüphane üyelerini görüntüleyin ve yönetin</p>


      {mesaj.metin !== '' && (
        <div className={`mesaj mesaj-${mesaj.tip}`}>
          {mesaj.tip === 'basari' ? '✅' : '⚠️'}
          {' '}
          {mesaj.metin}
        </div>
      )}



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
          <button type="submit" className="btn btn-ikincil">
            Ara
          </button>
        </form>
      </div>



      {yukleniyor === true ? (
        <div className="spinner-kapsayici">
          <div className="spinner"></div>
        </div>
      )


        : uyeler.length === 0 ? (
          <div className="bos-durum">
            <div className="bos-durum-ikon">👥</div>
            <p className="bos-durum-mesaj">Henüz üye bulunmuyor</p>
          </div>
        )


          : (
            <div className="tablo-kapsayici">
              <table className="tablo">

                {/* Tablo Başlıkları */}
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


                      <td>
                        <strong>{uye.ad} {uye.soyad}</strong>
                      </td>


                      <td>{uye.eposta}</td>


                      <td>{uye.telefon !== null && uye.telefon !== '' ? uye.telefon : '-'}</td>


                      <td>
                        <span className={`rozet ${uye.rol === 'admin' ? 'rozet-uyari' : 'rozet-bilgi'}`}>
                          {uye.rol === 'admin' ? '👑 Admin' : '👤 Üye'}
                        </span>
                      </td>


                      <td>
                        <span className={`rozet ${uye.aktifMi === true ? 'rozet-basari' : 'rozet-tehlike'}`}>
                          {uye.aktifMi === true ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>


                      <td>
                        <button
                          className="btn btn-tehlike btn-kucuk"
                          onClick={() => uyeSilIslemi(uye.id)}
                        >
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
