// ============================================
// Yetkilendirme Rotaları
// Kayıt, giriş ve profil endpoint'leri
// ============================================

const express = require('express');
const router = express.Router();
const { kayitOl, girisYap, profilGetir } = require('../controllers/yetkilendirmeKontrol');
const { tokenDogrula } = require('../middleware/yetkilendirme');

// POST /api/yetkilendirme/kayit - Yeni üye kaydı
router.post('/kayit', kayitOl);

// POST /api/yetkilendirme/giris - Üye girişi
router.post('/giris', girisYap);

// GET /api/yetkilendirme/profil - Profil bilgisi (token gerekli)
router.get('/profil', tokenDogrula, profilGetir);

module.exports = router;
