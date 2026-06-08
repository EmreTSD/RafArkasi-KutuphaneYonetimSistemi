// ============================================
// İstatistik Rotaları
// Genel ve admin istatistik endpoint'leri
// ============================================

const express = require('express');
const router = express.Router();
const { istatistikleriGetir, adminIstatistikleriGetir } = require('../controllers/istatistikKontrol');
const { tokenDogrula, adminVeyaModerator } = require('../middleware/yetkilendirme');

// GET /api/istatistikler - Genel istatistikler (herkese açık)
router.get('/', istatistikleriGetir);

// GET /api/istatistikler/admin - Detaylı istatistikler (admin veya moderator)
router.get('/admin', tokenDogrula, adminVeyaModerator, adminIstatistikleriGetir);

module.exports = router;
