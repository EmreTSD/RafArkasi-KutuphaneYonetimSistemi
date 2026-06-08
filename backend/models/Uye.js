// ============================================
// Üye Modeli (Sequelize)
// Kullanıcı bilgilerini ve şifre hashleme işlemini yönetir
// ============================================

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { veritabani } = require('../config/veritabani');

const Uye = veritabani.define('uye', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ad: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Ad alanı boş bırakılamaz' },
      len: { args: [2, 50], msg: 'Ad 2-50 karakter arasında olmalıdır' }
    }
  },
  soyad: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Soyad alanı boş bırakılamaz' },
      len: { args: [2, 50], msg: 'Soyad 2-50 karakter arasında olmalıdır' }
    }
  },
  eposta: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: { msg: 'Bu e-posta adresi zaten kayıtlı' },
    validate: {
      isEmail: { msg: 'Geçerli bir e-posta adresi giriniz' }
    }
  },
  sifre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Şifre en az 6 karakter olmalıdır' }
    }
  },
  rol: {
    type: DataTypes.ENUM('uye', 'admin', 'moderator'),
    defaultValue: 'uye'
  },
  telefon: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  aktifMi: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'aktif_mi'
  }
}, {
  tableName: 'uye',
  // Kaydetmeden önce şifreyi hashle
  hooks: {
    beforeCreate: async (uye) => {
      if (uye.sifre) {
        const tuz = await bcrypt.genSalt(10);
        uye.sifre = await bcrypt.hash(uye.sifre, tuz);
      }
    },
    beforeUpdate: async (uye) => {
      if (uye.changed('sifre')) {
        const tuz = await bcrypt.genSalt(10);
        uye.sifre = await bcrypt.hash(uye.sifre, tuz);
      }
    }
  }
});

// Şifre karşılaştırma metodu
Uye.prototype.sifreKarsilastir = async function (girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre);
};

module.exports = Uye;
