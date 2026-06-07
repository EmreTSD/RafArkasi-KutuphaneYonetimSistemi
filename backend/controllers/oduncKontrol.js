// ============================================
// Ödünç İşlemleri Kontrolcüsü
// Kitap ödünç verme, iade etme ve listeleme
// ============================================

const { Op } = require('sequelize');
const { Odunc, Uye, Kitap } = require('../models');

// ---- Tüm Ödünç Kayıtlarını Getir ----
const tumOduncleriGetir = async (istek, yanit) => {
  try {
    const durum = istek.query.durum || '';
    const sayfa = istek.query.sayfa || 1;
    const limit = istek.query.limit || 10;


    const kosullar = {};
    if (durum) {
      kosullar.durum = durum;
    }

    const ofset = (parseInt(sayfa) - 1) * parseInt(limit);

    const toplam = await Odunc.count({
      where: kosullar
    });

    const oduncler = await Odunc.findAll({
      where: kosullar,
      include: [
        {
          model: Uye,
          as: 'uye',
          attributes: ['id', 'ad', 'soyad', 'eposta']
        },
        {
          model: Kitap,
          as: 'kitap',
          attributes: ['id', 'baslik', 'yazar', 'isbn']
        }
      ],
      limit: parseInt(limit),
      offset: ofset,
      order: [['created_at', 'DESC']]
    });

    yanit.json({
      basarili: true,
      oduncler,
      toplam,
      sayfaSayisi: Math.ceil(toplam / parseInt(limit)),
      mevcutSayfa: parseInt(sayfa)
    });
  } catch (hata) {
    console.error('Ödünç listeleme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Ödünç kayıtları getirilirken bir hata oluştu.'
    });
  }
};

// ---- Ödünç Ver ----
const oduncVer = async (istek, yanit) => {
  try {
    const { uyeId, kitapId } = istek.body;

    if (!uyeId || !kitapId) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Üye ID ve Kitap ID zorunludur.'
      });
    }

    // Üye kontrolü
    const uye = await Uye.findByPk(uyeId);
    if (!uye) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Üye bulunamadı.'
      });
    }

    // Kitap kontrolü
    const kitap = await Kitap.findByPk(kitapId);
    if (!kitap) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Kitap bulunamadı.'
      });
    }

    // Stok kontrolü
    if (kitap.mevcutAdet <= 0) {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Bu kitabın stokta mevcut kopyası bulunmuyor.'
      });
    }

    // Son iade tarihi (15 gün sonra)
    const sonIadeTarihi = new Date();
    sonIadeTarihi.setDate(sonIadeTarihi.getDate() + 15);

    // Ödünç kaydı oluştur
    const odunc = await Odunc.create({
      uyeId,
      kitapId,
      sonIadeTarihi,
      durum: 'odunc'
    });

    // Kitap mevcut adedini azalt
    await kitap.update({
      mevcutAdet: kitap.mevcutAdet - 1
    });

    // İlişkili verileri yükle
    const detayliOdunc = await Odunc.findByPk(odunc.id, {
      include: [
        { model: Uye, as: 'uye', attributes: ['id', 'ad', 'soyad', 'eposta'] },
        { model: Kitap, as: 'kitap', attributes: ['id', 'baslik', 'yazar'] }
      ]
    });

    yanit.status(201).json({
      basarili: true,
      mesaj: 'Kitap ödünç verildi!',
      odunc: detayliOdunc
    });
  } catch (hata) {
    console.error('Ödünç verme hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Ödünç işlemi sırasında bir hata oluştu.'
    });
  }
};

// ---- İade Et ----
const iadeEt = async (istek, yanit) => {
  try {
    const odunc = await Odunc.findByPk(istek.params.id, {
      include: [
        { model: Uye, as: 'uye', attributes: ['id', 'ad', 'soyad'] },
        { model: Kitap, as: 'kitap', attributes: ['id', 'baslik', 'yazar', 'mevcutAdet'] }
      ]
    });

    if (!odunc) {
      return yanit.status(404).json({
        basarili: false,
        mesaj: 'Ödünç kaydı bulunamadı.'
      });
    }

    if (odunc.durum === 'iade_edildi') {
      return yanit.status(400).json({
        basarili: false,
        mesaj: 'Bu kitap zaten iade edilmiş.'
      });
    }

    // Ödünç durumunu güncelle
    await odunc.update({
      durum: 'iade_edildi',
      iadeTarihi: new Date()
    });

    // Kitap mevcut adedini artır
    const kitap = await Kitap.findByPk(odunc.kitapId);
    await kitap.update({
      mevcutAdet: kitap.mevcutAdet + 1
    });

    yanit.json({
      basarili: true,
      mesaj: 'Kitap başarıyla iade edildi!',
      odunc
    });
  } catch (hata) {
    console.error('İade hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'İade işlemi sırasında bir hata oluştu.'
    });
  }
};

// ---- Üyenin Ödünç Kayıtlarını Getir ----
const uyeOduncleriniGetir = async (istek, yanit) => {
  try {
    const oduncler = await Odunc.findAll({
      where: { uyeId: istek.params.uyeId },
      include: [
        { model: Kitap, as: 'kitap', attributes: ['id', 'baslik', 'yazar'] }
      ],
      order: [['created_at', 'DESC']]
    });

    yanit.json({
      basarili: true,
      oduncler
    });
  } catch (hata) {
    console.error('Üye ödünçleri hatası:', hata);
    yanit.status(500).json({
      basarili: false,
      mesaj: 'Üyenin ödünç kayıtları getirilirken bir hata oluştu.'
    });
  }
};

module.exports = { tumOduncleriGetir, oduncVer, iadeEt, uyeOduncleriniGetir };
