require('dotenv').config();
const { veritabani } = require('./config/veritabani');
require('./models'); // Bütün modelleri yükle ki tablolar oluşturulabilsin

const sifirla = async () => {
  try {
    console.log('⚠️ Veritabanı sıfırlanıyor. Tüm veriler silinecek...');
    // force: true mevcut tabloları silip yeniden oluşturur
    await veritabani.sync({ force: true });
    console.log('✅ Veritabanı başarıyla sıfırlandı ve tablolar yeniden oluşturuldu!');
  } catch (err) {
    console.error('❌ Sıfırlama sırasında hata oluştu:', err.message);
  } finally {
    process.exit();
  }
};

sifirla();
