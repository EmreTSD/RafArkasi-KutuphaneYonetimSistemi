// ============================================
// KitapKart Bileşeni
// Kitap bilgilerini kart formatında gösterir
// Admin işlemleri için Düzenle/Sil butonları içerir
// ============================================

const KitapKart = ({ kitap, adminMi, onDuzenle, onSil, animasyonGecikmesi }) => {
  return (
    <div
      className="kitap-kart"
      style={{ animationDelay: animasyonGecikmesi || '0s' }}
    >
      {/* Üst Alan: Kategori ve Stok Durumu */}
      <div className="kitap-kart-ust">
        <span className="kitap-kategori">
          {kitap.kategori || 'Genel'}
        </span>
        <span className={`kitap-stok ${kitap.mevcutAdet > 0 ? 'mevcut' : 'tukenmis'}`}>
          {kitap.mevcutAdet > 0 ? `✅ ${kitap.mevcutAdet} mevcut` : '❌ Tükendi'}
        </span>
      </div>

      {/* Kitap Başlığı ve Yazarı */}
      <h3 className="kitap-baslik">{kitap.baslik}</h3>
      <p className="kitap-yazar">✍️ {kitap.yazar}</p>

      {/* Kitap Detayları */}
      <div className="kitap-detaylar">
        <div className="kitap-detay">
          <span className="kitap-detay-etiket">ISBN</span>
          <span className="kitap-detay-deger">{kitap.isbn}</span>
        </div>

        {kitap.yayinevi && (
          <div className="kitap-detay">
            <span className="kitap-detay-etiket">Yayınevi</span>
            <span className="kitap-detay-deger">{kitap.yayinevi}</span>
          </div>
        )}

        {kitap.yayinYili && (
          <div className="kitap-detay">
            <span className="kitap-detay-etiket">Yıl</span>
            <span className="kitap-detay-deger">{kitap.yayinYili}</span>
          </div>
        )}
      </div>

      {/* Admin Butonları */}
      {adminMi && (
        <div className="kitap-kart-butonlar">
          <button
            className="btn btn-ikincil btn-kucuk"
            onClick={() => onDuzenle(kitap)}
          >
            ✏️ Düzenle
          </button>
          <button
            className="btn btn-tehlike btn-kucuk"
            onClick={() => onSil(kitap.id)}
          >
            🗑️ Sil
          </button>
        </div>
      )}
    </div>
  );
};

export default KitapKart;
