// ============================================
// Veritabanı Kontrol ve Tohum Verisi Ekleme
// 30 Kitap, 15 Kullanıcı (1 Admin + 14 Üye), 5 Ödünç Kaydı
// Çalıştırma: node kayitlari_kontrol_et.js
// ============================================

require('dotenv').config();
const { Uye, Kitap, Odunc } = require('./models');

// ---- Test Kitapları (30 adet) ----
const ornekKitaplar = [
  { baslik: 'Yüzüklerin Efendisi - Yüzük Kardeşliği', yazar: 'J.R.R. Tolkien', isbn: '9789753423473', kategori: 'Fantastik', yayinYili: 1954, sayfaSayisi: 496, stokAdedi: 4, yayinevi: 'Metis Yayınları', aciklama: 'Efsanevi Orta Dünya serisinin ilk kitabı.' },
  { baslik: '1984', yazar: 'George Orwell', isbn: '9789750718533', kategori: 'Bilim Kurgu', yayinYili: 1949, sayfaSayisi: 352, stokAdedi: 5, yayinevi: 'Can Yayınları', aciklama: 'Büyük Birader seni izliyor.' },
  { baslik: 'Suç ve Ceza', yazar: 'Fyodor Dostoyevski', isbn: '9789750720444', kategori: 'Klasik', yayinYili: 1866, sayfaSayisi: 687, stokAdedi: 3, yayinevi: 'İş Bankası Yayınları', aciklama: 'Raskolnikov\'un vicdan azabı ve kurtuluş hikayesi.' },
  { baslik: 'Savaş ve Barış', yazar: 'Lev Tolstoy', isbn: '9789750726392', kategori: 'Klasik', yayinYili: 1869, sayfaSayisi: 1392, stokAdedi: 2, yayinevi: 'İş Bankası Yayınları', aciklama: 'Napolyon savaşları döneminde Rusya\'nın epik romanı.' },
  { baslik: 'Dune', yazar: 'Frank Herbert', isbn: '9789753424713', kategori: 'Bilim Kurgu', yayinYili: 1965, sayfaSayisi: 604, stokAdedi: 4, yayinevi: 'Metis Yayınları', aciklama: 'Arrakis gezegeninde güç, din ve ekoloji üzerine masterpiece.' },
  { baslik: 'Simyacı', yazar: 'Paulo Coelho', isbn: '9789753425414', kategori: 'Roman', yayinYili: 1988, sayfaSayisi: 192, stokAdedi: 6, yayinevi: 'Can Yayınları', aciklama: 'Santiago\'nun kişisel efsanesini bulmak için çıktığı yolculuk.' },
  { baslik: 'Küçük Prens', yazar: 'Antoine de Saint-Exupéry', isbn: '9789750718038', kategori: 'Çocuk / Felsefe', yayinYili: 1943, sayfaSayisi: 112, stokAdedi: 8, yayinevi: 'Can Yayınları', aciklama: 'Yetişkinlere ve çocuklara dair derin bir masal.' },
  { baslik: 'Cesur Yeni Dünya', yazar: 'Aldous Huxley', isbn: '9789750719578', kategori: 'Bilim Kurgu', yayinYili: 1932, sayfaSayisi: 311, stokAdedi: 3, yayinevi: 'İthaki Yayınları', aciklama: 'Teknoloji ve tüketim odaklı distopik gelecek.' },
  { baslik: 'İnce Memed', yazar: 'Yaşar Kemal', isbn: '9789753638012', kategori: 'Türk Edebiyatı', yayinYili: 1955, sayfaSayisi: 388, stokAdedi: 5, yayinevi: 'YKY', aciklama: 'Anadolu efsanesiyle yoğrulan bir isyan hikayesi.' },
  { baslik: 'Tutunamayanlar', yazar: 'Oğuz Atay', isbn: '9789753638135', kategori: 'Türk Edebiyatı', yayinYili: 1971, sayfaSayisi: 724, stokAdedi: 3, yayinevi: 'İletişim Yayınları', aciklama: 'Türk edebiyatının postmodern başyapıtı.' },
  { baslik: 'Şeker Portakalı', yazar: 'José Mauro de Vasconcelos', isbn: '9789753421386', kategori: 'Roman', yayinYili: 1968, sayfaSayisi: 192, stokAdedi: 5, yayinevi: 'Can Yayınları', aciklama: 'Küçük Zeze\'nin büyüyüş ve acı dolu hikayesi.' },
  { baslik: 'Harry Potter ve Felsefe Taşı', yazar: 'J.K. Rowling', isbn: '9789752104792', kategori: 'Fantastik', yayinYili: 1997, sayfaSayisi: 338, stokAdedi: 6, yayinevi: 'YKY', aciklama: 'Hogwarts\'a hoş geldiniz.' },
  { baslik: 'Hayvan Çiftliği', yazar: 'George Orwell', isbn: '9789750712265', kategori: 'Klasik', yayinYili: 1945, sayfaSayisi: 128, stokAdedi: 7, yayinevi: 'Can Yayınları', aciklama: 'Tüm hayvanlar eşittir, ama bazıları daha eşittir.' },
  { baslik: 'Don Kişot', yazar: 'Miguel de Cervantes', isbn: '9789750720161', kategori: 'Klasik', yayinYili: 1605, sayfaSayisi: 1056, stokAdedi: 2, yayinevi: 'İş Bankası Yayınları', aciklama: 'Dünya edebiyatının ilk modern romanı.' },
  { baslik: 'Bülbülü Öldürmek', yazar: 'Harper Lee', isbn: '9789750726446', kategori: 'Roman', yayinYili: 1960, sayfaSayisi: 376, stokAdedi: 4, yayinevi: 'İş Bankası Yayınları', aciklama: 'Amerikan güneyinde ırkçılık ve adalet üzerine.' },
  { baslik: 'Büyük Gatsby', yazar: 'F. Scott Fitzgerald', isbn: '9789753428385', kategori: 'Klasik', yayinYili: 1925, sayfaSayisi: 208, stokAdedi: 4, yayinevi: 'Yapı Kredi Yayınları', aciklama: 'Amerikan rüyasının trajik çöküşü.' },
  { baslik: 'Fareler ve İnsanlar', yazar: 'John Steinbeck', isbn: '9789750726378', kategori: 'Klasik', yayinYili: 1937, sayfaSayisi: 144, stokAdedi: 3, yayinevi: 'İş Bankası Yayınları', aciklama: 'Büyük Buhran döneminde iki göçmen işçinin hikayesi.' },
  { baslik: 'Uçurtma Avcısı', yazar: 'Khaled Hosseini', isbn: '9789750716621', kategori: 'Roman', yayinYili: 2003, sayfaSayisi: 384, stokAdedi: 5, yayinevi: 'Everest Yayınları', aciklama: 'Afganistan\'da ihanet ve kefaret üzerine yürek yakan bir hikaye.' },
  { baslik: 'Bin Muhteşem Güneş', yazar: 'Khaled Hosseini', isbn: '9789750722270', kategori: 'Roman', yayinYili: 2007, sayfaSayisi: 384, stokAdedi: 4, yayinevi: 'Everest Yayınları', aciklama: 'İki Afgan kadının zorlu kaderi.' },
  { baslik: 'Sapiens: İnsan Türünün Kısa Tarihi', yazar: 'Yuval Noah Harari', isbn: '9786050958638', kategori: 'Tarih / Bilim', yayinYili: 2011, sayfaSayisi: 512, stokAdedi: 6, yayinevi: 'Kolektif Kitap', aciklama: 'Homo sapiens\'in dünyayı nasıl fethettiğinin hikayesi.' },
  { baslik: 'Homo Deus', yazar: 'Yuval Noah Harari', isbn: '9786050960006', kategori: 'Tarih / Bilim', yayinYili: 2015, sayfaSayisi: 464, stokAdedi: 4, yayinevi: 'Kolektif Kitap', aciklama: 'İnsanlığın geleceğine dair sorular.' },
  { baslik: 'Düşüncenin Gücü', yazar: 'Norman Vincent Peale', isbn: '9789750729751', kategori: 'Kişisel Gelişim', yayinYili: 1952, sayfaSayisi: 256, stokAdedi: 5, yayinevi: 'Koridor Yayınları', aciklama: 'Pozitif düşüncenin hayatı nasıl dönüştürdüğü.' },
  { baslik: 'Siddhartha', yazar: 'Hermann Hesse', isbn: '9789750715778', kategori: 'Felsefe', yayinYili: 1922, sayfaSayisi: 176, stokAdedi: 4, yayinevi: 'Can Yayınları', aciklama: 'Hint filozofunun aydınlanma yolculuğu.' },
  { baslik: 'Beyaz Diş', yazar: 'Jack London', isbn: '9789750716683', kategori: 'Macera', yayinYili: 1906, sayfaSayisi: 304, stokAdedi: 3, yayinevi: 'Can Yayınları', aciklama: 'Vahşi Kuzey\'de yarı kurt yarı köpeğin hayatta kalma mücadelesi.' },
  { baslik: 'Yeraltından Notlar', yazar: 'Fyodor Dostoyevski', isbn: '9789750721434', kategori: 'Klasik', yayinYili: 1864, sayfaSayisi: 192, stokAdedi: 3, yayinevi: 'İş Bankası Yayınları', aciklama: 'Modern varoluşsal edebiyatın öncüsü.' },
  { baslik: 'Martin Eden', yazar: 'Jack London', isbn: '9789750713605', kategori: 'Roman', yayinYili: 1909, sayfaSayisi: 512, stokAdedi: 3, yayinevi: 'Can Yayınları', aciklama: 'Sıradan bir denizcinin yazar olma hayali.' },
  { baslik: 'Fahrenheit 451', yazar: 'Ray Bradbury', isbn: '9789750728273', kategori: 'Bilim Kurgu', yayinYili: 1953, sayfaSayisi: 256, stokAdedi: 4, yayinevi: 'İthaki Yayınları', aciklama: 'Kitapların yakıldığı bir gelecekte bilginin gücü.' },
  { baslik: 'Kuyucaklı Yusuf', yazar: 'Sabahattin Ali', isbn: '9789753635072', kategori: 'Türk Edebiyatı', yayinYili: 1937, sayfaSayisi: 288, stokAdedi: 4, yayinevi: 'YKY', aciklama: 'Türk edebiyatının en güçlü toplumsal romanlarından biri.' },
  { baslik: 'İçimizden Biri', yazar: 'Graham Greene', isbn: '9789750726286', kategori: 'Roman', yayinYili: 1947, sayfaSayisi: 272, stokAdedi: 2, yayinevi: 'İş Bankası Yayınları', aciklama: 'Ahlaki çatışma ve ihanet üzerine psikolojik gerilim.' },
  { baslik: 'Çocukluğum', yazar: 'Maksim Gorki', isbn: '9789750718700', kategori: 'Klasik', yayinYili: 1913, sayfaSayisi: 288, stokAdedi: 3, yayinevi: 'Can Yayınları', aciklama: 'Gorki\'nin kendi çocukluk yıllarının otobiyografik anlatımı.' }
];

// ---- Test Üyeleri (14 üye + 1 admin = 15) ----
const ornekUyeler = [
  { ad: 'Sistem', soyad: 'Yöneticisi', eposta: 'admin@rafarkasi.com', sifre: 'Admin1234!', rol: 'admin', telefon: '05555555555' },
  { ad: 'Ayşe', soyad: 'Kaya', eposta: 'ayse.kaya@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05301112233' },
  { ad: 'Mehmet', soyad: 'Demir', eposta: 'mehmet.demir@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05412223344' },
  { ad: 'Fatma', soyad: 'Çelik', eposta: 'fatma.celik@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05323334455' },
  { ad: 'Ali', soyad: 'Şahin', eposta: 'ali.sahin@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05514445566' },
  { ad: 'Zeynep', soyad: 'Yıldız', eposta: 'zeynep.yildiz@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05325556677' },
  { ad: 'Emre', soyad: 'Arslan', eposta: 'emre.arslan@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05416667788' },
  { ad: 'Selin', soyad: 'Öztürk', eposta: 'selin.ozturk@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05527778899' },
  { ad: 'Burak', soyad: 'Koç', eposta: 'burak.koc@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05308889900' },
  { ad: 'Elif', soyad: 'Aydın', eposta: 'elif.aydin@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05419990011' },
  { ad: 'Can', soyad: 'Polat', eposta: 'can.polat@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05320001122' },
  { ad: 'Neslihan', soyad: 'Güneş', eposta: 'neslihan.gunes@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05531112233' },
  { ad: 'Tarık', soyad: 'Doğan', eposta: 'tarik.dogan@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05532223344' },
  { ad: 'Gizem', soyad: 'Yılmaz', eposta: 'gizem.yilmaz@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05423334455' },
  { ad: 'Volkan', soyad: 'Şimşek', eposta: 'volkan.simsek@example.com', sifre: 'Uye12345!', rol: 'uye', telefon: '05314445566' }
];

const kontrolEtVeEkle = async () => {
  try {
    // Mevcut durumu göster
    let uyeSayisi = await Uye.count();
    let kitapSayisi = await Kitap.count();
    let oduncSayisi = await Odunc.count();

    console.log('\n📊 MEVCUT VERİTABANI DURUMU 📊');
    console.log('------------------------------');
    console.log(`👤 Üye Sayısı: ${uyeSayisi}`);
    console.log(`📚 Kitap Sayısı: ${kitapSayisi}`);
    console.log(`🔄 Ödünç İşlemi Sayısı: ${oduncSayisi}`);
    console.log('------------------------------\n');

    if (uyeSayisi === 0 && kitapSayisi === 0 && oduncSayisi === 0) {
      console.log('ℹ️ Veritabanı boş. 15 üye, 30 kitap ve 5 ödünç kaydı ekleniyor...\n');

      // 1. Üyeleri Ekle (toplu)
      const olusturulanUyeler = [];
      for (const uyeVerisi of ornekUyeler) {
        const uye = await Uye.create(uyeVerisi);
        olusturulanUyeler.push(uye);
        console.log(`  ✅ Üye eklendi: ${uye.ad} ${uye.soyad} (${uye.rol})`);
      }

      // 2. Kitapları Ekle (toplu)
      console.log('');
      const olusturulanKitaplar = [];
      for (const kitapVerisi of ornekKitaplar) {
        const kitap = await Kitap.create({ ...kitapVerisi, mevcutAdet: kitapVerisi.stokAdedi });
        olusturulanKitaplar.push(kitap);
        console.log(`  📚 Kitap eklendi: ${kitap.baslik}`);
      }

      // 3. Ödünç Kayıtları Ekle (5 adet, farklı üye ve kitaplar)
      console.log('');
      const bugun = new Date();

      const oduncKayitlari = [
        // Aktif ödünç (10 gün kaldı)
        { uyeIdx: 1, kitapIdx: 0, gunFarki: 10, durum: 'odunc' },
        // Aktif ödünç (5 gün kaldı)
        { uyeIdx: 2, kitapIdx: 4, gunFarki: 5, durum: 'odunc' },
        // Aktif ödünç (1 gün kaldı)
        { uyeIdx: 3, kitapIdx: 11, gunFarki: 1, durum: 'odunc' },
        // İade edilmiş kayıt
        { uyeIdx: 4, kitapIdx: 6, gunFarki: -7, durum: 'iade_edildi' },
        // Gecikmiş ödünç
        { uyeIdx: 5, kitapIdx: 19, gunFarki: -3, durum: 'gecikti' }
      ];

      for (const kayit of oduncKayitlari) {
        const iadeTarihi = new Date(bugun);
        iadeTarihi.setDate(bugun.getDate() + kayit.gunFarki);

        await Odunc.create({
          uyeId: olusturulanUyeler[kayit.uyeIdx].id,
          kitapId: olusturulanKitaplar[kayit.kitapIdx].id,
          alimTarihi: bugun,
          sonIadeTarihi: iadeTarihi,
          durum: kayit.durum
        });

        // Ödünç verilen kitabın stok sayısını güncelle
        if (kayit.durum === 'odunc' || kayit.durum === 'gecikti') {
          await olusturulanKitaplar[kayit.kitapIdx].decrement('mevcutAdet');
        }

        console.log(`  🔄 Ödünç eklendi: ${olusturulanUyeler[kayit.uyeIdx].ad} → ${olusturulanKitaplar[kayit.kitapIdx].baslik} (${kayit.durum})`);
      }

      // 4. Yeni durumu göster
      uyeSayisi = await Uye.count();
      kitapSayisi = await Kitap.count();
      oduncSayisi = await Odunc.count();

      console.log('\n✅ BÜTÜN VERİLER BAŞARIYLA EKLENDİ!\n');
      console.log('📊 YENİ VERİTABANI DURUMU 📊');
      console.log('------------------------------');
      console.log(`👤 Üye Sayısı  : ${uyeSayisi}`);
      console.log(`📚 Kitap Sayısı: ${kitapSayisi}`);
      console.log(`🔄 Ödünç Sayısı: ${oduncSayisi}`);
      console.log('------------------------------');
      console.log('\n🔑 GİRİŞ BİLGİLERİ:');
      console.log('  Admin  → admin@rafarkasi.com / Admin1234!');
      console.log('  Üye    → ayse.kaya@example.com / Uye12345!\n');

    } else {
      console.log('ℹ️ Veritabanında zaten kayıt var. Mevcut kayıtları bozmamak için ekleme yapılmadı.');
      console.log('  Sıfırlamak için önce tabloları temizleyin (veritabanında TRUNCATE).\n');
    }

  } catch (err) {
    console.error('\n❌ Hata oluştu:', err.message);
    if (err.errors) {
      err.errors.forEach(e => console.error('  -', e.message));
    }
  } finally {
    process.exit();
  }
};

kontrolEtVeEkle();
