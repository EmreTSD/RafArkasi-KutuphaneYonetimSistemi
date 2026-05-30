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

## ADIM 3: Projeyi GitHub'dan İndir

İstediğin klasöre git (örneğin Masaüstü veya Downloads) ve terminalde şunu çalıştır:

```
git clone https://github.com/EmreTSD/RafArkasi-KutuphaneYonetimSistemi.git
```

Bu komut tüm projeyi indirecek. İçine gir:
```
cd RafArkasi-KutuphaneYonetimSistemi
```

---

## ADIM 4: Backend Paketlerini Kur

```
cd backend
npm install
```

Biraz bekle, paketler inecek. Sonunda "added X packages" yazısı gelecek.

---

## ADIM 5: Frontend Paketlerini Kur

```
cd ../frontend
npm install
```

Yine biraz bekle. "added X packages" gelince ✅ tamam.

---

## ADIM 6: .env Dosyasını Oluştur (ÇOK ÖNEMLİ!)

.env dosyası güvenlik sebebiyle GitHub'a gönderilmez.
Diğer bilgisayarda online (Supabase) veritabanına bağlanacağımız için elle oluşturman gerekiyor.

### Yöntem A: Notepad ile
1. `backend` klasörünün içine git
2. Sağ tıkla → Yeni > Metin Belgesi
3. İçine aşağıdakileri yapıştır:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres.atsjtozrzkacqqbxlwjh:ej3GVmKZiga_%23mC@aws-1-eu-central-1.pooler.supabase.com:6543/postgres"
VT_SSL=true
JWT_GIZLI_ANAHTAR="cok_guclu_bir_gizli_anahtar_raf_arkasi_2026_!#"
JWT_SURE="7d"
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

---

## ADIM 7: Backend'i Başlat (Test)

`backend` klasöründeyken:
```
npm run dev
```

Şunları görmelisin:
```
✅ PostgreSQL veritabanı bağlantısı başarılı!
🚀 Sunucu http://localhost:5000 adresinde çalışıyor
```

**Bu terminali KAPATMA, açık bırak!**

---

## ADIM 8: Frontend'i Başlat (Test)

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

Sistem şu an buluttaki veritabanına bağlı ve kullanıma hazır! Herhangi bir veritabanı kurulumu yapmanıza gerek kalmadı.

---

## ❓ Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|-------|-------|
| `node tanınmıyor` | Bilgisayarı yeniden başlat |
| `git tanınmıyor` | Bilgisayarı yeniden başlat |
| Veritabanı bağlantı hatası | İnternet bağlantını kontrol et veya .env dosyasındaki DATABASE_URL'i doğru kopyaladığından emin ol |
| Port 5000 kullanımda | Başka terminal'de backend açık mı kontrol et |
| `npm install` hata veriyor | `npm cache clean --force` yap, tekrar dene |
