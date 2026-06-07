// ============================================
// MesajBildirim Bileşeni (Toast)
// Başarı ve hata bildirimlerini gösterir
// 4 saniye sonra otomatik kaybolur
// ============================================

import { useEffect } from 'react';

const MesajBildirim = ({ mesaj, mesajAyarla }) => {
  // 4 saniye sonra mesajı otomatik kapat
  useEffect(() => {
    if (mesaj && mesaj.metin) {
      const zamanlayici = setTimeout(() => {
        mesajAyarla({ tip: '', metin: '' });
      }, 4000);

      return () => clearTimeout(zamanlayici);
    }
  }, [mesaj, mesajAyarla]);

  // Mesaj yoksa hiçbir şey render etme
  if (!mesaj || !mesaj.metin) return null;

  return (
    <div className={`mesaj mesaj-${mesaj.tip}`}>
      {mesaj.tip === 'basari' ? '✅' : '⚠️'}
      {' '}
      {mesaj.metin}
    </div>
  );
};

export default MesajBildirim;
