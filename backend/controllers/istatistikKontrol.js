// ============================================
// İstatistik Kontrolcüsü
// Admin paneli ve ana sayfa için istatistik verileri
// ============================================

const { Kitap, Uye, Odunc } = require('../models');
const { fn, col, Op } = require('sequelize');

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

    // Rafta mevcut kitap adedi (toplam stok)
    const mevcutKitap = await Kitap.sum('mevcut_adet') || 0;

    // Şu an ödünçte olan kitap sayısı
    const oduncKitap = await Odunc.count({
      where: { durum: 'odunc' }
    });

    // Toplam üye sayısı
    const toplamUye = await Uye.count();

    // Gecikmiş ödünç sayısı
    const gecikmisSayi = await Odunc.count({
      where: { durum: 'gecikti' }
    });

    yanit.json({
      basarili: true,
      toplamKitap,
      toplamKategori,
      mevcutKitap,
      oduncKitap,
      toplamUye,
      gecikmisSayi
    });
  } catch (hata) {
    console.error('İstatistik hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'İstatistikler getirilirken bir hata oluştu.'
    });
  }
};

// ---- Admin Paneli Detaylı İstatistikler ----
const adminIstatistikleriGetir = async (istek, yanit) => {
  try {
    // Genel sayımlar
    const toplamKitap = await Kitap.count();
    const toplamUye = await Uye.count();
    const toplamOdunc = await Odunc.count();
    const aktifOdunc = await Odunc.count({ where: { durum: 'odunc' } });
    const gecikmisSayi = await Odunc.count({ where: { durum: 'gecikti' } });
    const iadeSayi = await Odunc.count({ where: { durum: 'iade_edildi' } });
    const mevcutKitap = await Kitap.sum('mevcut_adet') || 0;

    // Son 5 ödünç işlemi
    const sonOduncler = await Odunc.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        { model: Uye, as: 'uye', attributes: ['ad', 'soyad', 'eposta'] },
        { model: Kitap, as: 'kitap', attributes: ['baslik', 'yazar'] }
      ]
    });

    // Gecikmiş ödünçler (tüm listesi)
    const gecikmisList = await Odunc.findAll({
      where: { durum: 'gecikti' },
      include: [
        { model: Uye, as: 'uye', attributes: ['ad', 'soyad', 'eposta'] },
        { model: Kitap, as: 'kitap', attributes: ['baslik'] }
      ],
      order: [['son_iade_tarihi', 'ASC']]
    });

    // Stokta az kalan kitaplar (mevcutAdet <= 1)
    const azKalanKitaplar = await Kitap.findAll({
      where: { mevcutAdet: { [Op.lte]: 1 } },
      attributes: ['id', 'baslik', 'yazar', 'stokAdedi', 'mevcutAdet'],
      order: [['mevcut_adet', 'ASC']],
      limit: 5
    });

    yanit.json({
      basarili: true,
      ozet: {
        toplamKitap,
        toplamUye,
        toplamOdunc,
        aktifOdunc,
        gecikmisSayi,
        iadeSayi,
        mevcutKitap
      },
      sonOduncler,
      gecikmisList,
      azKalanKitaplar
    });
  } catch (hata) {
    console.error('Admin istatistik hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Admin istatistikleri getirilirken bir hata oluştu.'
    });
  }
};

module.exports = { istatistikleriGetir, adminIstatistikleriGetir };
