// ============================================
// JWT Yetkilendirme Middleware
// Token doğrulama ve admin kontrolü yapar
// ============================================

const jwt = require('jsonwebtoken');
const { Uye } = require('../models');

// Token doğrulama middleware'i
const tokenDogrula = async (istek, yanit, sonraki) => {
  try {
    // Authorization header'dan token'ı al
    const authBaslik = istek.headers.authorization;

    if (!authBaslik || !authBaslik.startsWith('Bearer ')) {
      return yanit.status(401).json({
        basarili: false,
        mesaj: 'Erişim reddedildi. Token bulunamadı.'
      });
    }

    // Token'ı ayıkla
    const token = authBaslik.split(' ')[1];

    // Token'ı doğrula
    const cozulmus = jwt.verify(token, process.env.JWT_GIZLI_ANAHTAR);

    // Kullanıcıyı veritabanından bul (şifre hariç)
    const uye = await Uye.findByPk(cozulmus.id, {
      attributes: { exclude: ['sifre'] }
    });

    if (!uye) {
      return yanit.status(401).json({
        basarili: false,
        mesaj: 'Geçersiz token. Kullanıcı bulunamadı.'
      });
    }

    // Kullanıcı bilgisini isteğe ekle
    istek.uye = uye;
    sonraki();
  } catch (hata) {
    console.error('Token doğrulama hatası:', hata.message);
    return yanit.status(401).json({
      basarili: false,
      mesaj: 'Geçersiz veya süresi dolmuş token.'
    });
  }
};

// Admin kontrolü middleware'i
const adminKontrol = (istek, yanit, sonraki) => {
  if (istek.uye && istek.uye.rol === 'admin') {
    sonraki();
  } else {
    return yanit.status(403).json({
      basarili: false,
      mesaj: 'Bu işlem için admin yetkisi gereklidir.'
    });
  }
};

// Moderator kontrolü middleware'i
// Admin'den bağımsızdır; yalnızca 'moderator' rolünü kontrol eder.
const moderatorKontrol = (istek, yanit, sonraki) => {
  if (istek.uye && istek.uye.rol === 'moderator') {
    sonraki();
  } else {
    return yanit.status(403).json({
      basarili: false,
      mesaj: 'Bu işlem için moderator yetkisi gereklidir.'
    });
  }
};

// Kitap işlemleri ve istatistikler için yetki kapısı
// Admin her şeyi yapar; moderator yalnızca kitap işlemlerini yapar.
// Bu yüzden bu rotalara admin VEYA moderator erişebilir.
const adminVeyaModerator = (istek, yanit, sonraki) => {
  if (istek.uye && (istek.uye.rol === 'admin' || istek.uye.rol === 'moderator')) {
    sonraki();
  } else {
    return yanit.status(403).json({
      basarili: false,
      mesaj: 'Bu işlem için admin veya moderator yetkisi gereklidir.'
    });
  }
};

module.exports = { tokenDogrula, adminKontrol, moderatorKontrol, adminVeyaModerator };
