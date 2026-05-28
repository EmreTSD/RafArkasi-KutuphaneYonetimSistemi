// ============================================
// İstatistik Rotaları
// Ana sayfa istatistik endpoint'i
// ============================================

const express = require('express');
const router = express.Router();
const { istatistikleriGetir } = require('../controllers/istatistikKontrol');

// GET /api/istatistikler - Genel istatistikler (herkese açık)
router.get('/', istatistikleriGetir);

module.exports = router;
