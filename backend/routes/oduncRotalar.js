// ============================================
// Ödünç Rotaları
// Ödünç verme ve iade endpoint'leri (admin gerekli)
// ============================================

const express = require('express');
const router = express.Router();
const { tumOduncleriGetir, oduncVer, iadeEt } = require('../controllers/oduncKontrol');
const { tokenDogrula, adminKontrol } = require('../middleware/yetkilendirme');

// Tüm ödünç rotaları admin yetkisi gerektirir
router.use(tokenDogrula, adminKontrol);

// GET /api/odunc - Tüm ödünç kayıtları
router.get('/', tumOduncleriGetir);

// POST /api/odunc - Ödünç ver
router.post('/', oduncVer);

// PUT /api/odunc/iade/:id - İade et
router.put('/iade/:id', iadeEt);

module.exports = router;
