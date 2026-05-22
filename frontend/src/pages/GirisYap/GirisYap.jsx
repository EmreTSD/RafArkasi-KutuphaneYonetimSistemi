// ============================================
// Giriş Yap Sayfası
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import './GirisYap.css';

const GirisYap = () => {
  const [form, formAyarla] = useState({ eposta: '', sifre: '' });
  const [hata, hataAyarla] = useState('');
  const [yukleniyor, yukleniyorAyarla] = useState(false);
  const { girisYap } = useYetkilendirme();
  const yonlendir = useNavigate();

  const formDegistir = (e) => { formAyarla({ ...form, [e.target.name]: e.target.value }); hataAyarla(''); };

  const formGonder = async (e) => {
    e.preventDefault();
    yukleniyorAyarla(true); hataAyarla('');
    try {
      await girisYap(form.eposta, form.sifre);
      yonlendir('/');
    } catch (hataObj) {
      hataAyarla(hataObj.response?.data?.mesaj || 'Giriş yapılırken bir hata oluştu.');
    } finally { yukleniyorAyarla(false); }
  };

  return (
    <div className="yetkilendirme-sayfa">
      <div className="yetkilendirme-kart" id="giris-kart">
        <div className="yetkilendirme-ikon">🔑</div>
        <h1 className="yetkilendirme-baslik">Giriş Yap</h1>
        <p className="yetkilendirme-aciklama">Hesabınıza giriş yapın</p>
        {hata && <div className="mesaj mesaj-hata">⚠️ {hata}</div>}
        <form className="yetkilendirme-form" onSubmit={formGonder}>
          <div className="form-grup">
            <label className="form-etiket" htmlFor="giris-eposta">E-posta</label>
            <input type="email" id="giris-eposta" name="eposta" className="form-girdi" placeholder="ornek@eposta.com" value={form.eposta} onChange={formDegistir} required />
          </div>
          <div className="form-grup">
            <label className="form-etiket" htmlFor="giris-sifre">Şifre</label>
            <input type="password" id="giris-sifre" name="sifre" className="form-girdi" placeholder="••••••••" value={form.sifre} onChange={formDegistir} required />
          </div>
          <button type="submit" className="btn btn-birincil" disabled={yukleniyor} id="giris-gonder-btn">
            {yukleniyor ? '⏳ Giriş yapılıyor...' : '🚀 Giriş Yap'}
          </button>
        </form>
        <p className="yetkilendirme-alt">Hesabınız yok mu? <Link to="/kayit">Kayıt Ol</Link></p>
      </div>
    </div>
  );
};

export default GirisYap;
