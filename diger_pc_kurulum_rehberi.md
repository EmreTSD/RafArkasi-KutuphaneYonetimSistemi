# 🖥️ Diğer PC'de Proje Kurulum Rehberi
## Raf Arkası — Kütüphane Yönetim Sistemi

Bu rehberi sıfır bir bilgisayarda adım adım takip et.
Her adımı yaptıktan sonra ✅ işaretle ve sonrakine geç.

---

## ADIM 1: Node.js Kur

1. Tarayıcıyı aç → https://nodejs.org adresine git
2. **LTS (Uzun Süreli Destek)** sürümünü indir (yeşil buton)
3. İndirilen .exe dosyasını çalıştır
4. Kurulumda her şeyi varsayılan bırak (Next > Next > Install)
5. Kurulum bittikten sonra bilgisayarı **yeniden başlat**

### ✔️ Doğrulama:
PowerShell veya CMD aç ve şunu yaz:
```
node --version
npm --version
```
İkisinden de versiyon numarası geliyorsa ✅ başarılı.

---

## ADIM 2: Git Kur

1. Tarayıcıyı aç → https://git-scm.com/download/win adresine git
2. **"64-bit Git for Windows Setup"** butonuna tıkla ve indir
3. İndirilen .exe dosyasını çalıştır
4. Kurulumda her şeyi varsayılan bırak (Next > Next > Install)
5. Kurulum bittikten sonra terminali **kapat ve tekrar aç**

### ✔️ Doğrulama:
```
git --version
```
`git version 2.x.x` geliyorsa ✅ başarılı.

---

## ADIM 3: PostgreSQL Kur

1. Tarayıcıyı aç → https://www.postgresql.org/download/windows/ adresine git
2. **"Download the installer"** linkine tıkla
3. En son sürümü indir (Windows x86-64)
4. İndirilen .exe dosyasını çalıştır
5. Kurulumda:
   - ✅ PostgreSQL Server → işaretli kalsın
   - ✅ pgAdmin 4 → işaretli kalsın
   - ✅ Command Line Tools → işaretli kalsın
6. **Şifre belirleme ekranı gelecek → BU ŞİFREYİ UNUTMA!**
   (Bu şifreyi .env dosyasına yazacaksın)
7. Port: 5432 (varsayılan, değiştirme)
8. Kurulumu tamamla

### ✔️ Doğrulama:
```
psql --version
```
Versiyon numarası geliyorsa ✅ başarılı.

⚠️ Eğer "psql tanınmıyor" hatası alırsan:
- Bilgisayarı yeniden başlat
- Hâlâ olmuyorsa pgAdmin uygulamasını kullan (masaüstünde olmalı)

---

## ADIM 4: Veritabanını Oluştur

### Yöntem A: pgAdmin ile (kolay)
1. Başlat menüsünden **pgAdmin 4** uygulamasını aç
2. Sol panelde **Servers > PostgreSQL** tıkla
3. PostgreSQL kurulumunda belirlediğin şifreyi gir
4. **Databases** üzerine sağ tıkla → **Create > Database**
5. Name kısmına şunu yaz: `kutuphane_db`
6. **Save** butonuna bas

### Yöntem B: Terminal ile
```
psql -U postgres
```
Şifreni gir, sonra:
```sql
CREATE DATABASE kutuphane_db;
```
Çıkmak için: `\q`

---

## ADIM 5: Projeyi GitHub'dan İndir

İstediğin klasöre git (örneğin Masaüstü veya Downloads) ve terminalde şunu çalıştır:

```
git clone https://github.com/EmreTSD/RafArkasi-KutuphaneYonetimSistemi.git
```

Bu komut tüm projeyi indirecek. İçine gir:
```
cd RafArkasi-KutuphaneYonetimSistemi
```

---

## ADIM 6: Backend Paketlerini Kur

```
cd backend
npm install
```

Biraz bekle, paketler inecek. Sonunda "added X packages" yazısı gelecek.

---

## ADIM 7: Frontend Paketlerini Kur

```
cd ../frontend
npm install
```

Yine biraz bekle. "added X packages" gelince ✅ tamam.

---

## ADIM 8: .env Dosyasını Oluştur (ÇOK ÖNEMLİ!)

.env dosyası güvenlik sebebiyle GitHub'a gönderilmez.
Bu yüzden elle oluşturman gerekiyor.

### Yöntem A: Notepad ile
1. `backend` klasörünün içine git
2. Sağ tıkla → Yeni > Metin Belgesi
3. İçine aşağıdakileri yapıştır:

```
PORT=5000
VT_HOST=localhost
VT_PORT=5432
VT_AD=kutuphane_db
VT_KULLANICI=postgres
VT_SIFRE=BURAYA_POSTGRESQL_SIFRENI_YAZ
JWT_GIZLI_ANAHTAR=kutuphane-gizli-anahtar-2024
JWT_SURE=24h
NODE_ENV=development
```

4. **Dosya > Farklı Kaydet** de:
   - Dosya adı: `.env` (nokta ile başlamalı!)
   - Kayıt türü: **Tüm Dosyalar** (*.*)
   - Kaydet

### Yöntem B: Terminal ile
`backend` klasörünün içindeyken:
```
notepad .env
```
Yukarıdaki içeriği yapıştır ve kaydet.

⚠️ **VT_SIFRE** kısmına ADIM 3'te belirlediğin PostgreSQL şifresini yaz!

---

## ADIM 9: Backend'i Başlat (Test)

`backend` klasöründeyken:
```
npm run gelistirme
```

Şunları görmelisin:
```
✅ Veritabanı bağlantısı başarılı!
✅ Veritabanı tabloları senkronize edildi!
🚀 Sunucu http://localhost:5000 adresinde çalışıyor
```

⚠️ Hata alırsan kontrol et:
- PostgreSQL çalışıyor mu? (Windows Servisleri'nden kontrol et)
- .env dosyasındaki şifre doğru mu?
- kutuphane_db veritabanı oluşturulmuş mu?

**Bu terminali KAPATMA, açık bırak!**

---

## ADIM 10: Frontend'i Başlat (Test)

**YENİ BİR TERMİNAL AÇ** ve `frontend` klasörüne git:
```
cd frontend
npm run dev
```

Şunu görmelisin:
```
  VITE v8.x.x  ready in XXX ms
  ➜  Local:   http://localhost:3000/
```

Tarayıcıda http://localhost:3000 adresini aç.
Ana sayfa açılıyorsa ✅ HER ŞEY HAZIR!

---

## 🎉 TAMAMLANDI!

Her şey çalışıyorsa artık:
1. http://localhost:3000/kayit adresinden bir hesap oluştur
2. pgAdmin'den o hesabı admin yap:
   ```sql
   UPDATE uye SET rol = 'admin' WHERE eposta = 'senin@eposta.com';
   ```
3. Giriş yap ve sistemi kullan!

---

## ❓ Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|-------|-------|
| `node tanınmıyor` | Bilgisayarı yeniden başlat |
| `git tanınmıyor` | Bilgisayarı yeniden başlat |
| `psql tanınmıyor` | pgAdmin kullan veya PATH'e ekle |
| Veritabanı bağlantı hatası | .env şifresi doğru mu kontrol et |
| Port 5000 kullanımda | Başka terminal'de backend açık mı kontrol et |
| `npm install` hata veriyor | `npm cache clean --force` yap, tekrar dene |
