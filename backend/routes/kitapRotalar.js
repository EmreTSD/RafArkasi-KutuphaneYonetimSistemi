// ============================================
// Kitap Rotaları
// Kitap CRUD endpoint'leri
// ============================================

const express = require('express');
const router = express.Router();
const {
  tumKitaplariGetir,
  tekKitapGetir,
  kitapEkle,
  kitapGuncelle,
  kitapSil,
  kategorileriGetir
} = require('../controllers/kitapKontrol');
const { tokenDogrula, adminVeyaModerator } = require('../middleware/yetkilendirme');

// GET /api/kitaplar/kategoriler - Kategori listesi (herkese açık)
router.get('/kategoriler', kategorileriGetir);

// GET /api/kitaplar - Tüm kitaplar (herkese açık)
router.get('/', tumKitaplariGetir);

// GET /api/kitaplar/:id - Tek kitap (herkese açık)
router.get('/:id', tekKitapGetir);

// POST /api/kitaplar - Kitap ekle (admin veya moderator)
router.post('/', tokenDogrula, adminVeyaModerator, kitapEkle);

// PUT /api/kitaplar/:id - Kitap güncelle (admin veya moderator)
router.put('/:id', tokenDogrula, adminVeyaModerator, kitapGuncelle);

// DELETE /api/kitaplar/:id - Kitap sil (admin veya moderator)
router.delete('/:id', tokenDogrula, adminVeyaModerator, kitapSil);

module.exports = router;
