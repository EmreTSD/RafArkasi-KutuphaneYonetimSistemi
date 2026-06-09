const bulunamadiYonetici = (istek, yanit, sonraki) => {
  yanit.status(404).json({
    basarili: false,
    mesaj: `Aradığınız rota (${istek.originalUrl}) bu sunucuda bulunamadı.`
  });
};

module.exports = { bulunamadiYonetici };
