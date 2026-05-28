// ============================================
// İstatistik Kontrolcüsü
// Ana sayfa için genel istatistikleri sağlar
// ============================================

const { Kitap, Uye, Odunc } = require('../models');
const { fn, col } = require('sequelize');

// ---- Genel İstatistikleri Getir ----
const istatistikleriGetir = async (istek, yanit) => {
  try {
    // Toplam kitap sayısı
    const toplamKitap = await Kitap.count();

    // Toplam kategori sayısı (benzersiz)
    const kategoriler = await Kitap.findAll({
      attributes: [[fn('DISTINCT', col('kategori')), 'kategori']]
    });
    const toplamKategori = kategoriler.length;

    // Mevcut (ödünçte olmayan) kitap sayısı
    const mevcutKitap = await Kitap.sum('mevcut_adet') || 0;

    // Ödünçteki kitap sayısı
    const oduncKitap = await Odunc.count({
      where: { durum: 'odunc' }
    });

    // Toplam üye sayısı
    const toplamUye = await Uye.count();

    yanit.json({
      basarili: true,
      toplamKitap,
      toplamKategori,
      mevcutKitap,
      oduncKitap,
      toplamUye
    });
  } catch (hata) {
    console.error('İstatistik hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'İstatistikler getirilirken bir hata oluştu.'
    });
  }
};

module.exports = { istatistikleriGetir };
