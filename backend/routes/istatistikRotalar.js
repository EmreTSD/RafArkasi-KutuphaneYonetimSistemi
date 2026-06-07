// ============================================
// İstatistik Rotaları
// Genel ve admin istatistik endpoint'leri
// ============================================

const express = require('express');
const router = express.Router();
const { istatistikleriGetir, adminIstatistikleriGetir } = require('../controllers/istatistikKontrol');
const { tokenDogrula, adminKontrol } = require('../middleware/yetkilendirme');

// GET /api/istatistikler - Genel istatistikler (herkese açık)
router.get('/', istatistikleriGetir);

// GET /api/istatistikler/admin - Admin detaylı istatistikler (sadece admin)
router.get('/admin', tokenDogrula, adminKontrol, adminIstatistikleriGetir);

module.exports = router;
