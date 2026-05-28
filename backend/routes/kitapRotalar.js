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
const { tokenDogrula, adminKontrol } = require('../middleware/yetkilendirme');

// GET /api/kitaplar/kategoriler - Kategori listesi (herkese açık)
router.get('/kategoriler', kategorileriGetir);

// GET /api/kitaplar - Tüm kitaplar (herkese açık)
router.get('/', tumKitaplariGetir);

// GET /api/kitaplar/:id - Tek kitap (herkese açık)
router.get('/:id', tekKitapGetir);

// POST /api/kitaplar - Kitap ekle (sadece admin)
router.post('/', tokenDogrula, adminKontrol, kitapEkle);

// PUT /api/kitaplar/:id - Kitap güncelle (sadece admin)
router.put('/:id', tokenDogrula, adminKontrol, kitapGuncelle);

// DELETE /api/kitaplar/:id - Kitap sil (sadece admin)
router.delete('/:id', tokenDogrula, adminKontrol, kitapSil);

module.exports = router;
