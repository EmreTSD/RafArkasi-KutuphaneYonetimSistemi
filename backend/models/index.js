// ============================================
// Model İlişkileri
// Tüm modelleri yükler ve aralarındaki ilişkileri tanımlar
// ============================================

const Uye = require('./Uye');
const Kitap = require('./Kitap');
const Odunc = require('./Odunc');

// ---- İlişkileri Tanımla ----

// Bir üyenin birçok ödünç kaydı olabilir
Uye.hasMany(Odunc, {
  foreignKey: 'uye_id',
  as: 'odunclar'
});

// Her ödünç kaydı bir üyeye aittir
Odunc.belongsTo(Uye, {
  foreignKey: 'uye_id',
  as: 'uye'
});

// Bir kitabın birçok ödünç kaydı olabilir
Kitap.hasMany(Odunc, {
  foreignKey: 'kitap_id',
  as: 'odunclar'
});

// Her ödünç kaydı bir kitaba aittir
Odunc.belongsTo(Kitap, {
  foreignKey: 'kitap_id',
  as: 'kitap'
});

module.exports = { Uye, Kitap, Odunc };
