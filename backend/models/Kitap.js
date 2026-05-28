// ============================================
// Kitap Modeli (Sequelize)
// Kitap bilgilerini ve stok takibini yönetir
// ============================================

const { DataTypes } = require('sequelize');
const { veritabani } = require('../config/veritabani');

const Kitap = veritabani.define('kitap', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  baslik: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Kitap başlığı boş bırakılamaz' }
    }
  },
  yazar: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Yazar adı boş bırakılamaz' }
    }
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: { msg: 'Bu ISBN numarası zaten kayıtlı' }
  },
  kategori: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Genel',
    validate: {
      notEmpty: { msg: 'Kategori boş bırakılamaz' }
    }
  },
  yayinYili: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'yayin_yili',
    validate: {
      isInt: { msg: 'Yayın yılı sayı olmalıdır' },
      min: { args: [1000], msg: 'Geçerli bir yıl giriniz' },
      max: { args: [new Date().getFullYear()], msg: 'Yayın yılı gelecekte olamaz' }
    }
  },
  sayfaSayisi: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'sayfa_sayisi',
    validate: {
      isInt: { msg: 'Sayfa sayısı sayı olmalıdır' },
      min: { args: [1], msg: 'Sayfa sayısı en az 1 olmalıdır' }
    }
  },
  stokAdedi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'stok_adedi',
    validate: {
      isInt: { msg: 'Stok adedi sayı olmalıdır' },
      min: { args: [0], msg: 'Stok adedi negatif olamaz' }
    }
  },
  mevcutAdet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'mevcut_adet',
    validate: {
      isInt: { msg: 'Mevcut adet sayı olmalıdır' },
      min: { args: [0], msg: 'Mevcut adet negatif olamaz' }
    }
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'kitap'
});

module.exports = Kitap;
