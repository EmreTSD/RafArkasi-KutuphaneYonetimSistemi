// ============================================
// Merkezi Hata Yönetimi Middleware
// Uygulamadaki tüm hataları yakalar ve formatlar
// ============================================

// Sequelize ve JWT hatalarını yöneten ana fonksiyon
const hataYonetici = (hata, istek, yanit, sonraki) => {
  let hataKodu = hata.status || hata.statusCode || 500;
  let hataMesaji = hata.message || 'Sunucu hatası oluştu.';
  let detaylar = null;

  // Hatanın detayını konsola yazdır (geliştirme aşaması için)
  console.error('🔥 Yakalanan Hata:', {
    isim: hata.name,
    mesaj: hata.message,
    stack: hata.stack
  });

  // 1. Sequelize Doğrulama Hataları (Validation Errors)
  if (hata.name === 'SequelizeValidationError') {
    hataKodu = 400;
    hataMesaji = 'Veri doğrulama hatası.';
    detaylar = hata.errors.map(e => ({
      alan: e.path,
      mesaj: e.message
    }));
  }

  // 2. Sequelize Benzersizlik Hataları (Unique Constraint Errors - Örn: Aynı e-posta veya ISBN)
  else if (hata.name === 'SequelizeUniqueConstraintError') {
    hataKodu = 400;
    hataMesaji = 'Zaten kayıtlı veri girildi.';
    detaylar = hata.errors.map(e => ({
      alan: e.path,
      mesaj: e.message
    }));
  }

  // 3. JWT Geçersiz Token Hatası
  else if (hata.name === 'JsonWebTokenError') {
    hataKodu = 401;
    hataMesaji = 'Geçersiz veya bozuk oturum anahtarı (token).';
  }

  // 4. JWT Süresi Dolmuş Token Hatası
  else if (hata.name === 'TokenExpiredError') {
    hataKodu = 401;
    hataMesaji = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
  }

  // Yanıt döndür
  yanit.status(hataKodu).json({
    basarili: false,
    mesaj: hataMesaji,
    detaylar: detaylar,
    // Geliştirme ortamında hata yığınını (stack) de gösterelim
    hataYigini: process.env.NODE_ENV === 'development' ? hata.stack : undefined
  });
};

// 404 Sayfa Bulunamadı Middleware
const bulunamadiYonetici = (istek, yanit, sonraki) => {
  yanit.status(404).json({
    basarili: false,
    mesaj: `Aradığınız rota (${istek.originalUrl}) bu sunucuda bulunamadı.`
  });
};

module.exports = { hataYonetici, bulunamadiYonetici };
