// ============================================
// Veritabanı Yapılandırması
// PostgreSQL bağlantısını Sequelize ORM ile kurar
// ============================================

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sequelize örneği oluştur (PostgreSQL bağlantısı)
const veritabani = new Sequelize(
  process.env.VT_AD,
  process.env.VT_KULLANICI,
  process.env.VT_SIFRE,
  {
    host: process.env.VT_HOST,
    port: process.env.VT_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,       // Maksimum bağlantı sayısı
      min: 0,       // Minimum bağlantı sayısı
      acquire: 30000, // Bağlantı zaman aşımı (ms)
      idle: 10000    // Boşta bekleme süresi (ms)
    },
    define: {
      timestamps: true,          // createdAt ve updatedAt otomatik eklensin
      underscored: true,         // snake_case kullanılsın (created_at)
      freezeTableName: true      // Tablo adlarını çoğullaştırma
    }
  }
);

// Bağlantı testi fonksiyonu
const veritabaniBaglantiTesti = async () => {
  try {
    await veritabani.authenticate();
    console.log('✅ PostgreSQL veritabanı bağlantısı başarılı!');
  } catch (hata) {
    console.error('❌ Veritabanı bağlantı hatası:', hata.message);
    process.exit(1);
  }
};

module.exports = { veritabani, veritabaniBaglantiTesti };
