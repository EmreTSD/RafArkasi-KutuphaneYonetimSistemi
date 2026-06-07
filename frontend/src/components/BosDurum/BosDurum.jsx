// ============================================
// BosDurum Bileşeni
// Veri bulunamadığında gösterilen boş durum ekranı
// ============================================

const BosDurum = ({ ikon, mesaj }) => {
  return (
    <div className="bos-durum">
      <div className="bos-durum-ikon">{ikon}</div>
      <p className="bos-durum-mesaj">{mesaj}</p>
    </div>
  );
};

export default BosDurum;
