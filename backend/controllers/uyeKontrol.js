// ============================================
// Üye Kontrolcüsü
// Üye CRUD işlemleri (admin tarafından)
// ============================================

const { Op } = require('sequelize');
const { Uye } = require('../models');

// ---- Tüm Üyeleri Getir ----
const tumUyeleriGetir = async (istek, yanit) => {
  try {
    const arama = istek.query.arama || '';
    const sayfa = istek.query.sayfa || 1;
    const limit = istek.query.limit || 10;

    // Filtreleme koşulları
    const kosullar = {};

    if (arama) {
      kosullar[Op.or] = [
        { ad: { [Op.iLike]: `%${arama}%` } },
        { soyad: { [Op.iLike]: `%${arama}%` } },
        { eposta: { [Op.iLike]: `%${arama}%` } }
      ];
    }

    const ofset = (parseInt(sayfa) - 1) * parseInt(limit);

    const { count: toplam, rows: uyeler } = await Uye.findAndCountAll({
      where: kosullar,
      attributes: { exclude: ['sifre'] }, // Şifreyi gönderme
      limit: parseInt(limit),
      offset: ofset,
      order: [['created_at', 'DESC']]
    });

    yanit.json({
      basarili: true,
      uyeler,
      toplam,
      sayfaSayisi: Math.ceil(toplam / parseInt(limit)),
      mevcutSayfa: parseInt(sayfa)
    });
  } catch (hata) {
    console.error('Üye listeleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Üyeler getirilirken bir hata oluştu.'
    });
  }
};

// ---- Tek Üye Getir ----
const tekUyeGetir = async (istek, yanit) => {
  try {
    const uye = await Uye.findByPk(istek.params.id, {
      attributes: { exclude: ['sifre'] }
    });

    if (!uye) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Üye bulunamadı.'
      });
    }

    yanit.json({ basarili: true, uye });
  } catch (hata) {
    console.error('Üye getirme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Üye getirilirken bir hata oluştu.'
    });
  }
};

// ---- Üye Güncelle ----
const uyeGuncelle = async (istek, yanit) => {
  try {
    const uye = await Uye.findByPk(istek.params.id);

    if (!uye) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Üye bulunamadı.'
      });
    }

    const { rol } = istek.body;

    await uye.update({ rol });

    yanit.json({
      basarili: true,
      mesaj: 'Üye rolü güncellendi!',
      uye: { id: uye.id, ad: uye.ad, soyad: uye.soyad, rol: uye.rol }
    });
  } catch (hata) {
    console.error('Üye güncelleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Üye güncellenirken bir hata oluştu.'
    });
  }
};

// ---- Üye Sil ----
const uyeSil = async (istek, yanit) => {
  try {
    const uye = await Uye.findByPk(istek.params.id);

    if (!uye) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Üye bulunamadı.'
      });
    }

    // Admin kendini silemesin
    if (uye.id === istek.uye.id) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Kendinizi silemezsiniz!'
      });
    }

    await uye.destroy();

    yanit.json({
      basarili: true,
      mesaj: 'Üye başarıyla silindi!'
    });
  } catch (hata) {
    console.error('Üye silme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Üye silinirken bir hata oluştu.'
    });
  }
};

module.exports = { tumUyeleriGetir, tekUyeGetir, uyeGuncelle, uyeSil };
