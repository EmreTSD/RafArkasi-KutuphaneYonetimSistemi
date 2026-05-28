Yapılması Gerekenler - Raf Arkası Kütüphane Yönetim Sistemi
=============================================================

1. ✅ GitHub'a yollandı (git init + commit + push yapıldı)
   → Repo: https://github.com/EmreTSD/RafArkasi-KutuphaneYonetimSistemi

2. ❌ Backend dosyalarını GitHub'a gönder (yeni eklenen dosyalar)
   → git add .
   → git commit -m "Backend tamamlandı: server, model, controller, route, middleware"
   → git push origin main

3. ❌ PostgreSQL veritabanını oluştur
   → pgAdmin veya psql aç
   → CREATE DATABASE kutuphane_db; komutunu çalıştır

4. ❌ Backend .env dosyasındaki şifreyi güncelle
   → backend/.env dosyasını aç
   → VT_SIFRE=sifrenizi_buraya_yazin kısmına gerçek PostgreSQL şifreni yaz

5. ❌ Backend sunucusunu test et
   → cd backend
   → npm run gelistirme
   → Konsolda "Sunucu çalışıyor" ve "Veritabanı bağlantısı başarılı" yazmalı
   → Tarayıcıda http://localhost:5000 açarak API sağlık kontrolü yap

6. ❌ Frontend sunucusunu test et
   → cd frontend
   → npm run dev
   → Tarayıcıda http://localhost:3000 aç
   → Ana sayfa açılmalı

7. ❌ İlk admin hesabını oluştur
   → Frontend'den kayıt ol (http://localhost:3000/kayit)
   → Sonra pgAdmin veya psql ile:
   → UPDATE uye SET rol = 'admin' WHERE eposta = 'senin@eposta.com';

8. ❌ postgresqpl.txt dosyasını doldur
   → PostgreSQL hakkında açıklayıcı rapor yazılacak
   → Tüm SQL komutları ve kod açıklamaları eklenecek

9. ❌ Logo dosyasını düzelt
   → Logo şu anda: frontend/public/RafArkasıLogo.png
   → Ama genel.md'de yazılan konum: frontend/src/data/görseller/
   → Logoyu doğru klasöre kopyala veya referansları güncelle

10. ❌ Vercel'e frontend deploy et
    → https://vercel.com adresine git
    → GitHub reposunu bağla
    → Framework: Vite seç
    → Root directory: frontend olarak ayarla
    → Deploy et

11. ❌ Render'a backend deploy et
    → https://render.com adresine git
    → New Web Service oluştur
    → GitHub reposunu bağla
    → Root directory: backend
    → Build command: npm install
    → Start command: node server.js
    → Environment variables ekle (.env içindekiler)

12. ❌ Uzak PostgreSQL veritabanı kur (deploy için)
    → Render veya ElephantSQL'den ücretsiz PostgreSQL al
    → Bağlantı bilgilerini Render'daki environment variables'a ekle
