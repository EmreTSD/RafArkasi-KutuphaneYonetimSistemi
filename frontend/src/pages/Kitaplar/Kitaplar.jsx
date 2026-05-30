// ============================================
// Kitaplar Sayfası
// ============================================

import { useState, useEffect } from 'react';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import { kitapServisi } from '../../services/api';
import './Kitaplar.css';

const Kitaplar = () => {
  const { adminMi } = useYetkilendirme();
  const [kitaplar, kitaplarAyarla] = useState([]);
  const [yukleniyor, yukleniyorAyarla] = useState(true);
  const [arama, aramaAyarla] = useState('');
  const [sayfa, sayfaAyarla] = useState(1);
  const [genelSayi, genelSayiAyarla] = useState({});

  const [mesaj, mesajAyarla] = useState({ tip: '', metin: '' });

  const [modalAcik, modalAcikAyarla] = useState(false);
  const [duzenlenen, duzenlenenAyarla] = useState(null);

  const [form, formAyarla] = useState({
    baslik: '', yazar: '', isbn: '', yayinevi: '',
    yayinYili: '', kategori: '', sayfaSayisi: '', stokAdedi: '1', aciklama: ''
  });

  const kitaplariGetir = async () => {
    yukleniyorAyarla(true);
    try {
      const yanit = await kitapServisi.tumunuGetir({ arama, sayfa, limit: 12 });
      if (yanit.data.basarili) { kitaplarAyarla(yanit.data.kitaplar); genelSayiAyarla(yanit.data.genelSayi); }
    } catch (hata) { mesajAyarla({ tip: 'hata', metin: 'Kitaplar yüklenirken hata oluştu.' }); }
    finally { yukleniyorAyarla(false); }
  };

  useEffect(() => { kitaplariGetir(); }, [sayfa]);
  const aramaYap = (etkinlik) => {
    etkinlik.preventDefault();
    sayfaAyarla(1);
    kitaplariGetir();
  };

  const modalAc = (kitap = null) => {
    if (kitap) {
      duzenlenenAyarla(kitap);
      formAyarla({
        baslik: kitap.baslik || '',
        yazar: kitap.yazar || '',
        isbn: kitap.isbn || '',
        yayinevi: kitap.yayinevi || '',
        yayinYili: kitap.yayinYili || '',
        kategori: kitap.kategori || '',
        sayfaSayisi: kitap.sayfaSayisi || '',
        stokAdedi: kitap.stokAdedi || '1',
        aciklama: kitap.aciklama || ''
      });
    } else {
      duzenlenenAyarla(null);
      formAyarla({
        baslik: '',
        yazar: '',
        isbn: '',
        yayinevi: '',
        yayinYili: '',
        kategori: '',
        sayfaSayisi: '',
        stokAdedi: '1',
        aciklama: ''
      });
    }
    modalAcikAyarla(true);
  };

  const formGonder = async (e) => {
    e.preventDefault();
    try {
      if (duzenlenen) {
        await kitapServisi.guncelle(duzenlenen.id, form);
        mesajAyarla({ tip: 'basari', metin: 'Kitap güncellendi!' });
      } else {
        await kitapServisi.ekle(form);
        mesajAyarla({ tip: 'basari', metin: 'Kitap eklendi!' });
      }
      modalAcikAyarla(false);
      kitaplariGetir();
    } catch (hata) {
      mesajAyarla({ tip: 'hata', metin: hata.response?.data?.mesaj || 'İşlem sırasında hata oluştu.' });
    }
  };

  const kitapSilIslemi = async (id) => {
    if (!window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) return;
    try {
      await kitapServisi.sil(id);
      mesajAyarla({ tip: 'basari', metin: 'Kitap silindi!' });
      kitaplariGetir();
    } catch (hata) {
      mesajAyarla({ tip: 'hata', metin: 'Kitap silinirken hata oluştu.' });
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
    <div className="sayfa-kapsayici" id="kitaplar-sayfa">
      <h1 className="sayfa-baslik">📖 Kitaplar</h1>
      <p className="sayfa-aciklama">Kütüphanedeki tüm kitapları görüntüleyin ve yönetin</p>

      {mesaj.metin !== '' && (
        <div className={`mesaj mesaj-${mesaj.tip}`}>

          {mesaj.tip === 'basari' ? '✅' : '⚠️'}
          {' '}
          {mesaj.metin}
        </div>
      )}


      <div className="kitaplar-ust">

        <form className="kitaplar-arama-kutusu" onSubmit={aramaYap}>
          <input
            type="text"
            className="form-girdi"
            placeholder="🔍 Kitap adı, yazar veya ISBN ara..."
            value={arama}
            onChange={(etkinlik) => aramaAyarla(etkinlik.target.value)}
            id="kitap-arama"
          />
          <button type="submit" className="btn btn-ikincil">Ara</button>
        </form>


        {adminMi === true && (
          <button className="btn btn-birincil" onClick={() => modalAc()} id="kitap-ekle-btn">
            ➕ Yeni Kitap
          </button>
        )}

      </div>


      {yukleniyor === true ? (
        <div className="spinner-kapsayici">
          <div className="spinner"></div>
        </div>
      )


        : kitaplar.length === 0 ? (
          <div className="bos-durum">
            <div className="bos-durum-ikon">📚</div>
            <p className="bos-durum-mesaj">Henüz kitap bulunmuyor</p>
          </div>
        )


          : (
            <>
              <div className="kitaplar-grid">


                {kitaplar.map((kitap, index) => (
                  <div className="kitap-kart" key={kitap.id} style={{ animationDelay: `${index * 0.05}s` }}>


                    <div className="kitap-kart-ust">
                      <span className="kitap-kategori">
                        {kitap.kategori || 'Genel'}
                      </span>


                      <span className={`kitap-stok ${kitap.mevcutAdet > 0 ? 'mevcut' : 'tukenmis'}`}>
                        {kitap.mevcutAdet > 0 ? `✅ ${kitap.mevcutAdet} mevcut` : '❌ Tükendi'}
                      </span>
                    </div>


                    <h3 className="kitap-baslik">{kitap.baslik}</h3>
                    <p className="kitap-yazar">✍️ {kitap.yazar}</p>


                    <div className="kitap-detaylar">

                      <div className="kitap-detay">
                        <span className="kitap-detay-etiket">ISBN</span>
                        <span className="kitap-detay-deger">{kitap.isbn}</span>
                      </div>


                      {kitap.yayinevi && (
                        <div className="kitap-detay">
                          <span className="kitap-detay-etiket">Yayınevi</span>
                          <span className="kitap-detay-deger">{kitap.yayinevi}</span>
                        </div>
                      )}


                      {kitap.yayinYili && (
                        <div className="kitap-detay">
                          <span className="kitap-detay-etiket">Yıl</span>
                          <span className="kitap-detay-deger">{kitap.yayinYili}</span>
                        </div>
                      )}

                    </div>


                    {adminMi === true && (
                      <div className="kitap-kart-butonlar">
                        <button className="btn btn-ikincil btn-kucuk" onClick={() => modalAc(kitap)}>
                          ✏️ Düzenle
                        </button>
                        <button className="btn btn-tehlike btn-kucuk" onClick={() => kitapSilIslemi(kitap.id)}>
                          🗑️ Sil
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>


              {genelSayi.toplamSayfa > 1 && (
                <div className="genelSayi">


                  <button className="genelSayi-btn" onClick={() => sayfaAyarla(sayfa - 1)} disabled={sayfa <= 1}>
                    ← Önceki
                  </button>


                  {[...Array(genelSayi.toplamSayfa)].map((_, index) => {
                    const sayfaNumarasi = index + 1;
                    return (
                      <button
                        key={index}
                        className={`genelSayi-btn ${sayfa === sayfaNumarasi ? 'aktif' : ''}`}
                        onClick={() => sayfaAyarla(sayfaNumarasi)}
                      >
                        {sayfaNumarasi}
                      </button>
                    );
                  })}


                  <button className="genelSayi-btn" onClick={() => sayfaAyarla(sayfa + 1)} disabled={sayfa >= genelSayi.toplamSayfa}>
                    Sonraki →
                  </button>

                  <span className="genelSayi-bilgi">Toplam: {genelSayi.toplamKayit} kitap</span>
                </div>
              )}
            </>
          )}


      {modalAcik === true && (
        <div className="modal-arka-plan" onClick={() => modalAcikAyarla(false)}>

          <div className="modal-icerik" onClick={(etkinlik) => etkinlik.stopPropagation()}>

            <h2 className="modal-baslik">

              {duzenlenen !== null ? '✏️ Kitap Düzenle' : '➕ Yeni Kitap Ekle'}
            </h2>

            <form onSubmit={formGonder}>

              <div className="form-grup">
                <label className="form-etiket">Kitap Adı *</label>
                <input
                  type="text"
                  className="form-girdi"
                  value={form.baslik}
                  onChange={(etkinlik) => formAyarla({ ...form, baslik: etkinlik.target.value })}
                  required
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Yazar *</label>
                <input
                  type="text"
                  className="form-girdi"
                  value={form.yazar}
                  onChange={(etkinlik) => formAyarla({ ...form, yazar: etkinlik.target.value })}
                  required
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">ISBN *</label>
                <input
                  type="text"
                  className="form-girdi"
                  value={form.isbn}
                  onChange={(etkinlik) => formAyarla({ ...form, isbn: etkinlik.target.value })}
                  required
                  disabled={duzenlenen !== null} /* Kitap düzenleniyorsa ISBN değiştirilemez */
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Yayınevi</label>
                <input
                  type="text"
                  className="form-girdi"
                  value={form.yayinevi}
                  onChange={(etkinlik) => formAyarla({ ...form, yayinevi: etkinlik.target.value })}
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Yayın Yılı</label>
                <input
                  type="number"
                  className="form-girdi"
                  value={form.yayinYili}
                  onChange={(etkinlik) => formAyarla({ ...form, yayinYili: etkinlik.target.value })}
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Kategori</label>
                <input
                  type="text"
                  className="form-girdi"
                  value={form.kategori}
                  onChange={(etkinlik) => formAyarla({ ...form, kategori: etkinlik.target.value })}
                  placeholder="Genel"
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Stok Adedi</label>
                <input
                  type="number"
                  className="form-girdi"
                  value={form.stokAdedi}
                  min="1"
                  onChange={(etkinlik) => formAyarla({ ...form, stokAdedi: etkinlik.target.value })}
                />
              </div>

              <div className="form-grup">
                <label className="form-etiket">Açıklama</label>
                <textarea
                  className="form-girdi"
                  value={form.aciklama}
                  rows="3"
                  onChange={(etkinlik) => formAyarla({ ...form, aciklama: etkinlik.target.value })}
                />
              </div>

              <div className="modal-butonlar">
                <button type="button" className="btn btn-ikincil" onClick={() => modalAcikAyarla(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-birincil">
                  {duzenlenen !== null ? 'Güncelle' : 'Ekle'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Kitaplar;
