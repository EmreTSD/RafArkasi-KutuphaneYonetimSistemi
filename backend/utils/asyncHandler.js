// ============================================
// Asenkron Hata Yakalayıcı (asyncHandler)
// Controller'larda try-catch bloklarını azaltmak ve
// asenkron hataları otomatik hata middleware'ine göndermek için kullanılır.
// ============================================

const asenkronHataYakalayici = (fonksiyon) => {
  return (istek, yanit, sonraki) => {
    Promise.resolve(fonksiyon(istek, yanit, sonraki)).catch(sonraki);
  };
};

module.exports = asenkronHataYakalayici;
