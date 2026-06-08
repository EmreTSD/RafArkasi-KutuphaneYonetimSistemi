// ============================================
// Kitaplar Sayfası
// ============================================

import { useState, useEffect } from 'react';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import { kitapServisi } from '../../services/api';
import KitapKart from '../../components/KitapKart/KitapKart';
import YuklemeSpinner from '../../components/YuklemeSpinner/YuklemeSpinner';
import MesajBildirim from '../../components/MesajBildirim/MesajBildirim';
import BosDurum from '../../components/BosDurum/BosDurum';
import Sayfalama from '../../components/Sayfalama/Sayfalama';
import './Kitaplar.css';

const bosForm = {
  baslik: '', yazar: '', isbn: '', yayinevi: '',
  yayinYili: '', kategori: '', sayfaSayisi: '', stokAdedi: '1', aciklama: ''
};

const Kitaplar = () => {
  const { kitapYetkisi } = useYetkilendirme();
  const [kitaplar, kitaplarAyarla] = useState([]);
  const [yukleniyor, yukleniyorAyarla] = useState(true);
  const [arama, aramaAyarla] = useState('');
  const [sayfa, sayfaAyarla] = useState(1);
  const [genelSayi, genelSayiAyarla] = useState({});
  const [mesaj, mesajAyarla] = useState({ tip: '', metin: '' });
  const [modalAcik, modalAcikAyarla] = useState(false);
  const [silmeOnay, silmeOnayAyarla] = useState({ acik: false, id: null });
  const [duzenlenen, duzenlenenAyarla] = useState(null);
  const [form, formAyarla] = useState(bosForm);

  const kitaplariGetir = async () => {
    yukleniyorAyarla(true);
    try {
      const yanit = await kitapServisi.tumunuGetir({ arama, sayfa, limit: 12 });
      if (yanit.data.basarili) {
        kitaplarAyarla(yanit.data.kitaplar);
        genelSayiAyarla({
          toplamSayfa: yanit.data.sayfaSayisi,
          toplamKayit: yanit.data.toplam
        });
      }
    } catch {
      mesajAyarla({ tip: 'hata', metin: 'Kitaplar yüklenirken hata oluştu.' });
    } finally {
      yukleniyorAyarla(false);
    }
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
        baslik: kitap.baslik || '', yazar: kitap.yazar || '',
        isbn: kitap.isbn || '', yayinevi: kitap.yayinevi || '',
        yayinYili: kitap.yayinYili || '', kategori: kitap.kategori || '',
        sayfaSayisi: kitap.sayfaSayisi || '', stokAdedi: kitap.stokAdedi || '1',
        aciklama: kitap.aciklama || ''
      });
    } else {
      duzenlenenAyarla(null);
      formAyarla(bosForm);
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

  const kitapSilIstek = (id) => {
    silmeOnayAyarla({ acik: true, id });
  };

  const kitapSilOnayla = async () => {
    if (!silmeOnay.id) return;
    try {
      await kitapServisi.sil(silmeOnay.id);
      mesajAyarla({ tip: 'basari', metin: 'Kitap silindi!' });
      silmeOnayAyarla({ acik: false, id: null });
      kitaplariGetir();
    } catch {
      mesajAyarla({ tip: 'hata', metin: 'Kitap silinirken hata oluştu.' });
      silmeOnayAyarla({ acik: false, id: null });
    }
  };

  return (
    <div className="sayfa-kapsayici" id="kitaplar-sayfa">
      <div className="sayfa-ust">
        <div>
          <h1 className="sayfa-baslik">Kitaplar</h1>
          <p className="sayfa-aciklama">RafArkası'ndaki tüm kitapları görüntüleyin ve yönetin</p>
        </div>
      </div>

      {/* Bildirim Mesajı */}
      <MesajBildirim mesaj={mesaj} mesajAyarla={mesajAyarla} />

      {/* Üst Alan: Arama ve Yeni Kitap Butonu */}
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

        {kitapYetkisi && (
          <button className="btn btn-birincil" onClick={() => modalAc()} id="kitap-ekle-btn">
            ➕ Yeni Kitap
          </button>
        )}
      </div>

      {/* İçerik Alanı */}
      {yukleniyor ? (
        <YuklemeSpinner />
      ) : kitaplar.length === 0 ? (
        <BosDurum ikon="📚" mesaj="Henüz kitap bulunmuyor" />
      ) : (
        <>
          <div className="kitaplar-grid">
            {kitaplar.map((kitap, index) => (
              <KitapKart
                key={kitap.id}
                kitap={kitap}
                onSil={kitapSilIstek}
                adminMi={kitapYetkisi}
                onDuzenle={modalAc}
                animasyonGecikmesi={`${index * 0.05}s`}
              />
            ))}
          </div>

          <Sayfalama
            mevcutSayfa={sayfa}
            toplamSayfa={genelSayi.toplamSayfa}
            toplamKayit={genelSayi.toplamKayit}
            sayfaDegistir={sayfaAyarla}
          />
        </>
      )}

      {/* Kitap Ekleme / Düzenleme Modalı */}
      {modalAcik && (
        <div className="modal-arka-plan" onClick={() => modalAcikAyarla(false)}>
          <div className="modal-icerik" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-baslik">
              {duzenlenen ? '✏️ Kitap Düzenle' : '➕ Yeni Kitap Ekle'}
            </h2>
            <form onSubmit={formGonder}>
              <div className="form-grup">
                <label className="form-etiket">Kitap Adı *</label>
                <input type="text" className="form-girdi" value={form.baslik}
                  onChange={(e) => formAyarla({ ...form, baslik: e.target.value })} required />
              </div>
              <div className="form-grup">
                <label className="form-etiket">Yazar *</label>
                <input type="text" className="form-girdi" value={form.yazar}
                  onChange={(e) => formAyarla({ ...form, yazar: e.target.value })} required />
              </div>
              <div className="form-grup">
                <label className="form-etiket">ISBN *</label>
                <input type="text" className="form-girdi" value={form.isbn}
                  onChange={(e) => formAyarla({ ...form, isbn: e.target.value })}
                  required disabled={duzenlenen !== null} />
              </div>
              <div className="form-grup">
                <label className="form-etiket">Yayınevi</label>
                <input type="text" className="form-girdi" value={form.yayinevi}
                  onChange={(e) => formAyarla({ ...form, yayinevi: e.target.value })} />
              </div>
              <div className="form-grup">
                <label className="form-etiket">Yayın Yılı *</label>
                <input type="number" className="form-girdi" value={form.yayinYili}
                  onChange={(e) => formAyarla({ ...form, yayinYili: e.target.value })} required />
              </div>
              <div className="form-grup">
                <label className="form-etiket">Sayfa Sayısı *</label>
                <input type="number" className="form-girdi" value={form.sayfaSayisi} min="1"
                  onChange={(e) => formAyarla({ ...form, sayfaSayisi: e.target.value })} required />
              </div>
              <div className="form-grup">
                <label className="form-etiket">Kategori *</label>
                <input type="text" className="form-girdi" value={form.kategori} placeholder="Genel"
                  onChange={(e) => formAyarla({ ...form, kategori: e.target.value })} required />
              </div>
              <div className="form-grup">
                <label className="form-etiket">Stok Adedi</label>
                <input type="number" className="form-girdi" value={form.stokAdedi} min="1"
                  onChange={(e) => formAyarla({ ...form, stokAdedi: e.target.value })} />
              </div>
              <div className="form-grup">
                <label className="form-etiket">Açıklama</label>
                <textarea className="form-girdi" value={form.aciklama} rows="3"
                  onChange={(e) => formAyarla({ ...form, aciklama: e.target.value })} />
              </div>
              <div className="modal-butonlar">
                <button type="button" className="btn btn-ikincil" onClick={() => modalAcikAyarla(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-birincil">
                  {duzenlenen ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {silmeOnay.acik && (
        <div className="modal-arka-plan" onClick={() => silmeOnayAyarla({ acik: false, id: null })}>
          <div className="modal-icerik" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗑️</div>
            <h2 className="modal-baslik" style={{ marginBottom: '12px' }}>Kitabı Silmek İstediğinize Emin misiniz?</h2>
            <p style={{ color: 'var(--renk-metin-2)', marginBottom: '24px' }}>
              Bu işlem geri alınamaz. Kitap sistemden tamamen silinecektir.
            </p>
            <div className="modal-butonlar" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn btn-ikincil" onClick={() => silmeOnayAyarla({ acik: false, id: null })}>
                İptal
              </button>
              <button type="button" className="btn btn-tehlike" onClick={kitapSilOnayla}>
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kitaplar;
