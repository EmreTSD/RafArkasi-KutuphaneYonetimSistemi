// ============================================
// Footer Bileşeni
// ============================================

import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const yil = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-icerik">
        <div>
          <h3 className="footer-bolum-baslik">📚 Kütüphane Yönetim Sistemi</h3>
          <p className="footer-aciklama">
            Modern ve kullanıcı dostu kütüphane yönetim sistemi. Kitaplarınızı
            kolayca yönetin, üyelerinizi takip edin ve ödünç işlemlerini hızlıca gerçekleştirin.
          </p>
        </div>
        <div>
          <h3 className="footer-bolum-baslik">Hızlı Bağlantılar</h3>
          <ul className="footer-linkler">
            <li><Link to="/" className="footer-link">Ana Sayfa</Link></li>
            <li><Link to="/kitaplar" className="footer-link">Kitaplar</Link></li>
            <li><Link to="/giris" className="footer-link">Giriş Yap</Link></li>
            <li><Link to="/kayit" className="footer-link">Kayıt Ol</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-bolum-baslik">İletişim</h3>
          <ul className="footer-linkler">
            <li className="footer-link">📧 info@kutuphane.com</li>
            <li className="footer-link">📞 +90 555 123 4567</li>
            <li className="footer-link">📍 İstanbul, Türkiye</li>
          </ul>
        </div>
      </div>
      <div className="footer-alt">© {yil} Kütüphane Yönetim Sistemi. Tüm hakları saklıdır.</div>
    </footer>
  );
};

export default Footer;
