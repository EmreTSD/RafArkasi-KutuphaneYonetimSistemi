// ============================================
// Sayfalama Bileşeni
// Kitap ve Üye listelerinde kullanılan sayfa navigasyonu
// ============================================

const Sayfalama = ({ mevcutSayfa, toplamSayfa, toplamKayit, sayfaDegistir }) => {
  // Tek sayfa varsa sayfalamayı gösterme
  if (toplamSayfa <= 1) return null;

  return (
    <div className="genelSayi">

      {/* Önceki Sayfa Butonu */}
      <button
        className="genelSayi-btn"
        onClick={() => sayfaDegistir(mevcutSayfa - 1)}
        disabled={mevcutSayfa <= 1}
      >
        ← Önceki
      </button>

      {/* Sayfa Numaraları */}
      {[...Array(toplamSayfa)].map((_, index) => {
        const sayfaNumarasi = index + 1;
        return (
          <button
            key={sayfaNumarasi}
            className={`genelSayi-btn ${mevcutSayfa === sayfaNumarasi ? 'aktif' : ''}`}
            onClick={() => sayfaDegistir(sayfaNumarasi)}
          >
            {sayfaNumarasi}
          </button>
        );
      })}

      {/* Sonraki Sayfa Butonu */}
      <button
        className="genelSayi-btn"
        onClick={() => sayfaDegistir(mevcutSayfa + 1)}
        disabled={mevcutSayfa >= toplamSayfa}
      >
        Sonraki →
      </button>

      {/* Toplam Kayıt Bilgisi */}
      {toplamKayit !== undefined && (
        <span className="genelSayi-bilgi">Toplam: {toplamKayit} kayıt</span>
      )}

    </div>
  );
};

export default Sayfalama;
