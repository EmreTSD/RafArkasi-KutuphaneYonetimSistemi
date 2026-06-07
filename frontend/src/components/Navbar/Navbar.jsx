// ============================================
// Navbar Bileşeni
// Üst gezinme çubuğu - logo, menü, kullanıcı bilgisi
// ============================================

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useYetkilendirme } from '../../context/YetkilendirmeBaglami';
import './Navbar.css';

const Navbar = () => {
  const { uye, cikisYap, girisYapildiMi, adminMi } = useYetkilendirme();
  const [menuAcik, menuAcikAyarla] = useState(false);
  const yonlendir = useNavigate();

  const cikisIslemi = () => { cikisYap(); yonlendir('/giris'); menuAcikAyarla(false); };
  const menuKapat = () => { menuAcikAyarla(false); };

  return (
    <nav className="navbar" id="ana-navbar">
      <div className="navbar-icerik">
        <Link to="/" className="navbar-logo" onClick={menuKapat}>
          <span className="navbar-logo-ikon">📚</span>
          <span className="navbar-logo-yazi">Kütüphane</span>
        </Link>

        <button className="navbar-hamburger" onClick={() => menuAcikAyarla(!menuAcik)} aria-label="Menü" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>

        <ul className={`navbar-menu ${menuAcik ? 'acik' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'aktif' : ''}`} onClick={menuKapat} end id="nav-anasayfa">
              🏠 Ana Sayfa
            </NavLink>
          </li>
          <li>
            <NavLink to="/kitaplar" className={({ isActive }) => `navbar-link ${isActive ? 'aktif' : ''}`} onClick={menuKapat} id="nav-kitaplar">
              📖 Kitaplar
            </NavLink>
          </li>
          {girisYapildiMi && adminMi && (
            <>
              <li>
                <NavLink to="/admin" className={({ isActive }) => `navbar-link ${isActive ? 'aktif' : ''}`} onClick={menuKapat} id="nav-admin">
                  🛠️ Admin Panel
                </NavLink>
              </li>
              <li>
                <NavLink to="/uyeler" className={({ isActive }) => `navbar-link ${isActive ? 'aktif' : ''}`} onClick={menuKapat} id="nav-uyeler">
                  👥 Üyeler
                </NavLink>
              </li>
              <li>
                <NavLink to="/odunc" className={({ isActive }) => `navbar-link ${isActive ? 'aktif' : ''}`} onClick={menuKapat} id="nav-odunc">
                  🔄 Ödünç İşlemleri
                </NavLink>
              </li>
            </>
          )}
          <li className="navbar-aksiyonlar">
            {girisYapildiMi ? (
              <>
                <div className="navbar-uye-bilgi">
                  <div>
                    <div className="navbar-uye-ad">{uye?.ad} {uye?.soyad}</div>
                    <div className="navbar-uye-rol">{uye?.rol}</div>
                  </div>
                </div>
                <button className="navbar-cikis-btn" onClick={cikisIslemi} id="cikis-btn">Çıkış Yap</button>
              </>
            ) : (
              <>
                <Link to="/giris" className="btn btn-ikincil btn-kucuk" onClick={menuKapat} id="giris-link">Giriş Yap</Link>
                <Link to="/kayit" className="btn btn-birincil btn-kucuk" onClick={menuKapat} id="kayit-link">Kayıt Ol</Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
