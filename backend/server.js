// ============================================
// Ana Sunucu Dosyası (Express.js)
// Tüm rotaları yükler ve sunucuyu başlatır
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { veritabani, veritabaniBaglantiTesti } = require('./config/veritabani');

// Modelleri yükle (ilişkileri kurmak için)
require('./models');

// Rota dosyalarını içe aktar
const yetkilendirmeRotalar = require('./routes/yetkilendirmeRotalar');
const kitapRotalar = require('./routes/kitapRotalar');
const uyeRotalar = require('./routes/uyeRotalar');
const oduncRotalar = require('./routes/oduncRotalar');
const istatistikRotalar = require('./routes/istatistikRotalar');

// Express uygulamasını oluştur
const uygulama = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware'ler ----
uygulama.use(cors());                          // CORS izni
uygulama.use(express.json());                  // JSON gövde ayrıştırma
uygulama.use(express.urlencoded({ extended: true })); // URL-encoded veri

// ---- API Rotaları ----
uygulama.use('/api/yetkilendirme', yetkilendirmeRotalar);
uygulama.use('/api/kitaplar', kitapRotalar);
uygulama.use('/api/uyeler', uyeRotalar);
uygulama.use('/api/odunc', oduncRotalar);
uygulama.use('/api/istatistikler', istatistikRotalar);

// ---- Kök Rota (API Sağlık Kontrolü) ----
uygulama.get('/', (istek, yanit) => {
  yanit.json({
    mesaj: '📚 Raf Arkası - Kütüphane Yönetim Sistemi API',
    durum: 'Aktif',
    surum: '1.0.0',
    endpoints: {
      yetkilendirme: '/api/yetkilendirme',
      kitaplar: '/api/kitaplar',
      uyeler: '/api/uyeler',
      odunc: '/api/odunc',
      istatistikler: '/api/istatistikler'
    }
  });
});

// ---- 404 Hata Yönetimi ----
uygulama.use((istek, yanit) => {
  yanit.status(404).json({
    basarili: false,
    mesaj: `${istek.originalUrl} bulunamadı.`
  });
});

// ---- Genel Hata Yönetimi ----
uygulama.use((hata, istek, yanit, sonraki) => {
  console.error('Sunucu hatası:', hata.stack);
  yanit.status(500).json({
    basarili: false,
    mesaj: 'Sunucu hatası oluştu.',
    hata: process.env.NODE_ENV === 'development' ? hata.message : undefined
  });
});

// ---- Sunucuyu Başlat ----
const sunucuBaslat = async () => {
  try {
    // Veritabanı bağlantısını test et
    await veritabaniBaglantiTesti();

    // Tabloları otomatik oluştur (geliştirme modunda)
    await veritabani.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Veritabanı tabloları senkronize edildi!');

    // Sunucuyu dinlemeye başla
    uygulama.listen(PORT, () => {
      console.log(`\n🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
      console.log(`📋 API Belgeleri: http://localhost:${PORT}`);
      console.log(`🌍 Ortam: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (hata) {
    console.error('❌ Sunucu başlatılamadı:', hata.message);
    process.exit(1);
  }
};

sunucuBaslat();
