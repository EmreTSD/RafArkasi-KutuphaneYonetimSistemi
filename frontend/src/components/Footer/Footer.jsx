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
        <div className="footer-sutun">
          <h3 className="footer-bolum-baslik">
            <img src="/RafArkasıLogo.png" alt="RafArkası" style={{ height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
            RafArkası Yönetim Sistemi
          </h3>
          <p className="footer-metin">
            Modern ve kullanıcı dostu yönetim sistemi. Kitaplarınızı
            ve üyelerinizi tek bir noktadan, güvenle yönetin.
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
            <li className="footer-link">
              <a href="mailto:info@rafarkasi.com" style={{ color: 'inherit', textDecoration: 'none' }}>📧 info@rafarkasi.com</a>
            </li>
            <li className="footer-link">
              <a href="tel:+905551234567" style={{ color: 'inherit', textDecoration: 'none' }}>📞 +90 555 123 4567</a>
            </li>
            <li className="footer-link">
              <a href="https://maps.google.com/?q=İstanbul, Türkiye" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>📍 İstanbul, Türkiye</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-alt">© {yil} RafArkası Yönetim Sistemi. Tüm hakları saklıdır.</div>
    </footer>
  );
};

export default Footer;
