// ============================================
// Yetkilendirme Kontrolcüsü
// Kayıt olma, giriş yapma ve profil işlemleri
// ============================================

const jwt = require('jsonwebtoken');
const { Uye } = require('../models');

// JWT token oluştur
const tokenOlustur = (id) => {
  return jwt.sign({ id }, process.env.JWT_GIZLI_ANAHTAR, {
    expiresIn: process.env.JWT_SURE || '24h'
  });
};

// ---- Kayıt Ol ----
const kayitOl = async (istek, yanit) => {
  try {
    const { ad, soyad, eposta, sifre, telefon } = istek.body;

    // Zorunlu alan kontrolü
    if (!ad || !soyad || !eposta || !sifre) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Ad, soyad, e-posta ve şifre alanları zorunludur.'
      });
    }

    // E-posta daha önce kullanılmış mı?
    const mevcutUye = await Uye.findOne({ where: { eposta } });
    if (mevcutUye) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Bu e-posta adresi zaten kayıtlı.'
      });
    }

    // Yeni üye oluştur
    const yeniUye = await Uye.create({ ad, soyad, eposta, sifre, telefon });

    // Token oluştur
    const token = tokenOlustur(yeniUye.id);

    // Yanıt döndür (şifre hariç)
    yanit.status(201).json({
      basarili: true,
      mesaj: 'Kayıt başarılı!',
      token,
      uye: {
        id: yeniUye.id,
        ad: yeniUye.ad,
        soyad: yeniUye.soyad,
        eposta: yeniUye.eposta,
        rol: yeniUye.rol
      }
    });
  } catch (hata) {
    console.error('Kayıt hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kayıt sırasında bir hata oluştu.',
      hata: hata.message
    });
  }
};

// ---- Giriş Yap ----
const girisYap = async (istek, yanit) => {
  try {
    const { eposta, sifre } = istek.body;

    // Zorunlu alan kontrolü
    if (!eposta || !sifre) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'E-posta ve şifre alanları zorunludur.'
      });
    }

    // Üyeyi bul
    const uye = await Uye.findOne({ where: { eposta } });
    if (!uye) {
      return yanit.status(401).json({
        basarili: false,
        mesaj: 'E-posta veya şifre hatalı.'
      });
    }

    // Şifre kontrolü
    const sifreDogruMu = await uye.sifreKarsilastir(sifre);
    if (!sifreDogruMu) {
      return yanit.status(401).json({
        basarili: false,
        mesaj: 'E-posta veya şifre hatalı.'
      });
    }

    // Token oluştur
    const token = tokenOlustur(uye.id);

    // Yanıt döndür
    yanit.json({
      basarili: true,
      mesaj: 'Giriş başarılı!',
      token,
      uye: {
        id: uye.id,
        ad: uye.ad,
        soyad: uye.soyad,
        eposta: uye.eposta,
        rol: uye.rol
      }
    });
  } catch (hata) {
    console.error('Giriş hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Giriş sırasında bir hata oluştu.'
    });
  }
};

// ---- Profil Getir ----
const profilGetir = async (istek, yanit) => {
  try {
    yanit.json({
      basarili: true,
      uye: {
        id: istek.uye.id,
        ad: istek.uye.ad,
        soyad: istek.uye.soyad,
        eposta: istek.uye.eposta,
        rol: istek.uye.rol,
        telefon: istek.uye.telefon
      }
    });
  } catch (hata) {
    console.error('Profil hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Profil bilgisi alınamadı.'
    });
  }
};

module.exports = { kayitOl, girisYap, profilGetir };
