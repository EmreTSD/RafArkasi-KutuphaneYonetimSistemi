// ============================================
// Üye Rotaları
// Üye yönetimi endpoint'leri (admin gerekli)
// ============================================

const express = require('express');
const router = express.Router();
const { tumUyeleriGetir, tekUyeGetir, uyeGuncelle, uyeSil } = require('../controllers/uyeKontrol');
const { tokenDogrula, adminKontrol } = require('../middleware/yetkilendirme');

// Tüm üye rotaları admin yetkisi gerektirir
router.use(tokenDogrula, adminKontrol);

// GET /api/uyeler - Tüm üyeler
router.get('/', tumUyeleriGetir);

// GET /api/uyeler/:id - Tek üye
router.get('/:id', tekUyeGetir);

// PUT /api/uyeler/:id - Üye güncelle
router.put('/:id', uyeGuncelle);

// DELETE /api/uyeler/:id - Üye sil
router.delete('/:id', uyeSil);

module.exports = router;
