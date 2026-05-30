// ============================================
// Veritabanı Yapılandırması
// PostgreSQL bağlantısını Sequelize ORM ile kurar
// ============================================

const { Sequelize } = require('sequelize');
require('dotenv').config();

// SSL ayarını belirle
let ssl;
if (process.env.VT_SSL === 'true') {
  ssl = {
    require: true,
    rejectUnauthorized: false
  };
} else {
  ssl = false;
}

// Sequelize örneği oluştur (PostgreSQL bağlantısı)
const veritabani = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  })
  : new Sequelize(
    process.env.VT_AD,
    process.env.VT_KULLANICI,
    process.env.VT_SIFRE,
    {
      host: process.env.VT_HOST,
      port: process.env.VT_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        // Bulut veritabanları (Neon, Supabase vs.) genellikle SSL gerektirir
        ssl
      },
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
