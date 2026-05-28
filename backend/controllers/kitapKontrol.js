// ============================================
// Kitap Kontrolcüsü
// Kitap CRUD işlemleri, arama ve sayfalama
// ============================================

const { Op } = require('sequelize');
const { Kitap } = require('../models');

// ---- Tüm Kitapları Getir (Arama + Sayfalama) ----
const tumKitaplariGetir = async (istek, yanit) => {
  try {
    const {
      sayfa = 1,
      limit = 10,
      arama = '',
      kategori = ''
    } = istek.query;

    // Filtreleme koşulları
    const kosullar = {};

    // Arama filtresi (başlık, yazar veya ISBN)
    if (arama) {
      kosullar[Op.or] = [
        { baslik: { [Op.iLike]: `%${arama}%` } },
        { yazar: { [Op.iLike]: `%${arama}%` } },
        { isbn: { [Op.iLike]: `%${arama}%` } }
      ];
    }

    // Kategori filtresi
    if (kategori) {
      kosullar.kategori = kategori;
    }

    // Sayfalama hesabı
    const ofset = (parseInt(sayfa) - 1) * parseInt(limit);

    // Kitapları getir
    const { count: toplam, rows: kitaplar } = await Kitap.findAndCountAll({
      where: kosullar,
      limit: parseInt(limit),
      offset: ofset,
      order: [['created_at', 'DESC']]
    });

    yanit.json({
      basarili: true,
      kitaplar,
      toplam,
      sayfaSayisi: Math.ceil(toplam / parseInt(limit)),
      mevcutSayfa: parseInt(sayfa)
    });
  } catch (hata) {
    console.error('Kitap listeleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kitaplar getirilirken bir hata oluştu.'
    });
  }
};

// ---- Tek Kitap Getir ----
const tekKitapGetir = async (istek, yanit) => {
  try {
    const kitap = await Kitap.findByPk(istek.params.id);

    if (!kitap) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Kitap bulunamadı.'
      });
    }

    yanit.json({ basarili: true, kitap });
  } catch (hata) {
    console.error('Kitap getirme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kitap getirilirken bir hata oluştu.'
    });
  }
};

// ---- Kitap Ekle ----
const kitapEkle = async (istek, yanit) => {
  try {
    const { baslik, yazar, isbn, kategori, yayinYili, sayfaSayisi, stokAdedi, aciklama } = istek.body;

    if (!baslik || !yazar) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Kitap başlığı ve yazar alanları zorunludur.'
      });
    }

    const yeniKitap = await Kitap.create({
      baslik,
      yazar,
      isbn,
      kategori: kategori || 'Genel',
      yayinYili,
      sayfaSayisi,
      stokAdedi: stokAdedi || 1,
      mevcutAdet: stokAdedi || 1,
      aciklama
    });

    yanit.status(201).json({
      basarili: true,
      mesaj: 'Kitap başarıyla eklendi!',
      kitap: yeniKitap
    });
  } catch (hata) {
    console.error('Kitap ekleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kitap eklenirken bir hata oluştu.',
      hata: hata.message
    });
  }
};

// ---- Kitap Güncelle ----
const kitapGuncelle = async (istek, yanit) => {
  try {
    const kitap = await Kitap.findByPk(istek.params.id);

    if (!kitap) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Kitap bulunamadı.'
      });
    }

    await kitap.update(istek.body);

    yanit.json({
      basarili: true,
      mesaj: 'Kitap başarıyla güncellendi!',
      kitap
    });
  } catch (hata) {
    console.error('Kitap güncelleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kitap güncellenirken bir hata oluştu.'
    });
  }
};

// ---- Kitap Sil ----
const kitapSil = async (istek, yanit) => {
  try {
    const kitap = await Kitap.findByPk(istek.params.id);

    if (!kitap) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Kitap bulunamadı.'
      });
    }

    await kitap.destroy();

    yanit.json({
      basarili: true,
      mesaj: 'Kitap başarıyla silindi!'
    });
  } catch (hata) {
    console.error('Kitap silme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kitap silinirken bir hata oluştu.'
    });
  }
};

// ---- Kategorileri Getir ----
const kategorileriGetir = async (istek, yanit) => {
  try {
    const kategoriler = await Kitap.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('kategori')), 'kategori']],
      order: [['kategori', 'ASC']]
    });

    yanit.json({
      basarili: true,
      kategoriler: kategoriler.map(k => k.kategori)
    });
  } catch (hata) {
    console.error('Kategori listeleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kategoriler getirilirken bir hata oluştu.'
    });
  }
};

module.exports = {
  tumKitaplariGetir,
  tekKitapGetir,
  kitapEkle,
  kitapGuncelle,
  kitapSil,
  kategorileriGetir
};
