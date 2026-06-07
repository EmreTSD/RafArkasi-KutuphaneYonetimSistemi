// ============================================
// Kitap Kontrolcüsü
// Kitap CRUD işlemleri, arama ve sayfalama
// ============================================

const { Op, fn, col } = require('sequelize');
const { Kitap } = require('../models');

// ---- Tüm Kitapları Getir (Arama + Sayfalama) ----
const tumKitaplariGetir = async (istek, yanit) => {
  try {
    const sayfa = istek.query.sayfa || 1;
    const limit = istek.query.limit || 10;
    const arama = istek.query.arama || '';
    const kategori = istek.query.kategori || '';

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
    // Toplam filtrelere uyan kitap sayısını sayalım
    const toplam = await Kitap.count({
      where: kosullar
    });

    // Sadece bu sayfadaki kitapların listesini getirelim
    const kitaplar = await Kitap.findAll({
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
    const { baslik, yazar, isbn, kategori, yayinYili, sayfaSayisi, stokAdedi, yayinevi, aciklama } = istek.body;

    if (!baslik || !yazar || !isbn || !yayinYili || !sayfaSayisi) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Kitap başlığı, yazar, ISBN, yayın yılı ve sayfa sayısı alanları zorunludur.'
      });
    }

    const yeniKitap = await Kitap.create({
      baslik,
      yazar,
      isbn: isbn === '' ? null : isbn,
      kategori: kategori || 'Genel',
      yayinYili: yayinYili === '' ? null : yayinYili,
      sayfaSayisi: sayfaSayisi === '' ? null : sayfaSayisi,
      stokAdedi: stokAdedi || 1,
      mevcutAdet: stokAdedi || 1,
      yayinevi: yayinevi === '' ? null : yayinevi,
      aciklama: aciklama === '' ? null : aciklama
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

    // İstek gövdesindeki boş string değerlerini veritabanı kısıtlamaları için null yapalım
    const guncellenecekVeriler = { ...istek.body };
    const bosOlabilecekAlanlar = ['isbn', 'yayinYili', 'sayfaSayisi', 'yayinevi', 'aciklama'];

    bosOlabilecekAlanlar.forEach(function (alan) {
      if (guncellenecekVeriler[alan] === '') {
        guncellenecekVeriler[alan] = null;
      }
    });

    // Stok adedi güncellendiyse, aradaki farkı hesaplayıp mevcut adedi (raftaki) güncelleyelim
    if (guncellenecekVeriler.stokAdedi !== undefined) {
      const yeniStok = parseInt(guncellenecekVeriler.stokAdedi);
      const eskiStok = parseInt(kitap.stokAdedi);

      if (!isNaN(yeniStok) && !isNaN(eskiStok)) {
        const fark = yeniStok - eskiStok;
        const eskiMevcut = parseInt(kitap.mevcutAdet) || 0;

        // Sayısal toplama yapılmasını garanti altına alıp mevcut adeti güncelleyelim
        guncellenecekVeriler.mevcutAdet = Math.max(0, eskiMevcut + fark);
      }
    }

    await kitap.update(guncellenecekVeriler);

    yanit.json({
      basarili: true,
      mesaj: 'Kitap başarıyla güncellendi!',
      kitap
    });
  } catch (hata) {
    console.error('Kitap güncelleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Kitap güncellenirken bir hata oluştu.',
      hata: hata.message
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
      attributes: [[fn('DISTINCT', col('kategori')), 'kategori']],
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
