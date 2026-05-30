require('dotenv').config();
const { Uye, Kitap, Odunc } = require('./models');

const kontrolEtVeEkle = async () => {
  try {
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
      console.log('ℹ️ Veritabanı boş. Test verileri (1 Admin, 1 Üye, 3 Kitap, 1 Ödünç İşlemi) ekleniyor...\n');

      // 1. Admin Ekle
      const admin = await Uye.create({
        ad: 'Sistem',
        soyad: 'Yöneticisi',
        eposta: 'admin@rafarkasi.com',
        sifre: 'admin123',
        rol: 'admin',
        telefon: '05555555555'
      });

      // 2. Normal Üye Ekle
      const testUye = await Uye.create({
        ad: 'Ahmet',
        soyad: 'Yılmaz',
        eposta: 'ahmet@example.com',
        sifre: 'uye123456',
        rol: 'uye',
        telefon: '05321112233'
      });

      // 3. Kitaplar Ekle
      const kitap1 = await Kitap.create({
        baslik: 'Yüzüklerin Efendisi - Yüzük Kardeşliği',
        yazar: 'J.R.R. Tolkien',
        isbn: '9789753423473',
        kategori: 'Fantastik',
        yayin_yili: 1954,
        sayfa_sayisi: 496,
        stok_adedi: 3,
        mevcut_adet: 2, // Birini ödünç vereceğiz
        aciklama: 'Efsanevi Orta Dünya serisinin ilk kitabı.'
      });

      const kitap2 = await Kitap.create({
        baslik: '1984',
        yazar: 'George Orwell',
        isbn: '9789750718533',
        kategori: 'Bilim Kurgu / Distopya',
        yayin_yili: 1949,
        sayfa_sayisi: 352,
        stok_adedi: 5,
        mevcut_adet: 5,
        aciklama: 'Büyük Birader seni izliyor.'
      });

      const kitap3 = await Kitap.create({
        baslik: 'Suç ve Ceza',
        yazar: 'Fyodor Dostoyevski',
        isbn: '9789750720444',
        kategori: 'Klasik',
        yayin_yili: 1866,
        sayfa_sayisi: 687,
        stok_adedi: 2,
        mevcut_adet: 2,
        aciklama: 'Raskolnikov un vicdan azabı ve kurtuluş hikayesi.'
      });

      // 4. Ödünç İşlemi Ekle (Ahmet, Yüzüklerin Efendisi'ni almış olsun)
      // Tarihleri hesapla
      const bugun = new Date();
      const onGunSonra = new Date(bugun);
      onGunSonra.setDate(bugun.getDate() + 10);

      await Odunc.create({
        uyeId: testUye.id,
        kitapId: kitap1.id,
        alim_tarihi: bugun,
        son_iade_tarihi: onGunSonra,
        durum: 'odunc'
      });

      console.log('✅ BÜTÜN TEST VERİLERİ BAŞARIYLA EKLENDİ!');

      // Yeni sayımları alıp gösterelim
      uyeSayisi = await Uye.count();
      kitapSayisi = await Kitap.count();
      oduncSayisi = await Odunc.count();

      console.log('\n📊 YENİ VERİTABANI DURUMU 📊');
      console.log('------------------------------');
      console.log(`👤 Üye Sayısı: ${uyeSayisi}`);
      console.log(`📚 Kitap Sayısı: ${kitapSayisi}`);
      console.log(`🔄 Ödünç İşlemi Sayısı: ${oduncSayisi}`);
      console.log('------------------------------\n');

    } else {
      console.log('ℹ️ Veritabanında zaten kayıt var. Mevcut kayıtları bozmamak için ekleme yapılmadı.');
    }
  } catch (err) {
    console.error('❌ Hata oluştu:', err.message);
  } finally {
    process.exit();
  }
};

kontrolEtVeEkle();
