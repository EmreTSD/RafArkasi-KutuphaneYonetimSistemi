// ============================================
// Kayıt Ol Sayfası
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import '../GirisYap/GirisYap.css';

const KayitOl = () => {
  const [form, formAyarla] = useState({ ad: '', soyad: '', eposta: '', sifre: '', telefon: '' });
  const [hata, hataAyarla] = useState('');
  const [yukleniyor, yukleniyorAyarla] = useState(false);
  const { kayitOl } = useYetkilendirme();
  const yonlendir = useNavigate();

  const formDegistir = (e) => { formAyarla({ ...form, [e.target.name]: e.target.value }); hataAyarla(''); };

  const formGonder = async (e) => {
    e.preventDefault();
    yukleniyorAyarla(true); hataAyarla('');
    if (form.sifre.length < 6) { hataAyarla('Şifre en az 6 karakter olmalıdır.'); yukleniyorAyarla(false); return; }
    try {
      await kayitOl(form);
      yonlendir('/');
    } catch (hataObj) {
      hataAyarla(hataObj.response?.data?.mesaj || 'Kayıt olurken bir hata oluştu.');
    } finally { yukleniyorAyarla(false); }
  };

  return (
    <div className="yetkilendirme-sayfa">
      <div className="yetkilendirme-kart" id="kayit-kart">
        <div className="yetkilendirme-ikon">✨</div>
        <h1 className="yetkilendirme-baslik">Kayıt Ol</h1>
        <p className="yetkilendirme-aciklama">Yeni bir hesap oluşturun</p>
        {hata && <div className="mesaj mesaj-hata">⚠️ {hata}</div>}
        <form className="yetkilendirme-form" onSubmit={formGonder}>
          <div className="form-grup">
            <label className="form-etiket" htmlFor="kayit-ad">Ad</label>
            <input type="text" id="kayit-ad" name="ad" className="form-girdi" placeholder="Adınız" value={form.ad} onChange={formDegistir} required />
          </div>
          <div className="form-grup">
            <label className="form-etiket" htmlFor="kayit-soyad">Soyad</label>
            <input type="text" id="kayit-soyad" name="soyad" className="form-girdi" placeholder="Soyadınız" value={form.soyad} onChange={formDegistir} required />
          </div>
          <div className="form-grup">
            <label className="form-etiket" htmlFor="kayit-eposta">E-posta</label>
            <input type="email" id="kayit-eposta" name="eposta" className="form-girdi" placeholder="ornek@eposta.com" value={form.eposta} onChange={formDegistir} required />
          </div>
          <div className="form-grup">
            <label className="form-etiket" htmlFor="kayit-sifre">Şifre</label>
            <input type="password" id="kayit-sifre" name="sifre" className="form-girdi" placeholder="En az 6 karakter" value={form.sifre} onChange={formDegistir} required />
          </div>
          <div className="form-grup">
            <label className="form-etiket" htmlFor="kayit-telefon">Telefon (Opsiyonel)</label>
            <input type="tel" id="kayit-telefon" name="telefon" className="form-girdi" placeholder="+90 555 123 4567" value={form.telefon} onChange={formDegistir} />
          </div>
          <button type="submit" className="btn btn-birincil" disabled={yukleniyor} id="kayit-gonder-btn">
            {yukleniyor ? '⏳ Kayıt yapılıyor...' : '🚀 Kayıt Ol'}
          </button>
        </form>
        <p className="yetkilendirme-alt">Zaten hesabınız var mı? <Link to="/giris">Giriş Yap</Link></p>
      </div>
    </div>
  );
};

export default KayitOl;
