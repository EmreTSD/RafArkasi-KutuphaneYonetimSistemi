// ============================================
// Ödünç Modeli (Sequelize)
// Kitap ödünç alma ve iade işlemlerini yönetir
// ============================================

const { DataTypes } = require('sequelize');
const { veritabani } = require('../config/veritabani');

const Odunc = veritabani.define('odunc', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uyeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'uye_id',
    references: {
      model: 'uye',
      key: 'id'
    }
  },
  kitapId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'kitap_id',
    references: {
      model: 'kitap',
      key: 'id'
    }
  },
  alimTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'alim_tarihi'
  },
  iadeTarihi: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'iade_tarihi'
  },
  sonIadeTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'son_iade_tarihi',
    defaultValue: () => {
      // Varsayılan olarak 15 gün sonra iade edilmeli
      const tarih = new Date();
      tarih.setDate(tarih.getDate() + 15);
      return tarih;
    }
  },
  durum: {
    type: DataTypes.ENUM('odunc', 'iade_edildi', 'gecikti'),
    defaultValue: 'odunc'
  }
}, {
  tableName: 'odunc'
});

module.exports = Odunc;
