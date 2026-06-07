# 📚 Raf Arkası — Kütüphane Yönetim Sistemi

<div align="center">

**Modern, güvenli ve kullanıcı dostu bir kütüphane yönetim sistemi.**

React · Node.js · Express · PostgreSQL · JWT

</div>

---

## 🎯 Proje Hakkında

**Raf Arkası**, kütüphanelerin kitap, üye ve ödünç işlemlerini dijital ortamda kolayca yönetebilmesi için geliştirilmiş tam yığın (full-stack) bir web uygulamasıdır.

### Öne Çıkan Özellikler

- 🔍 **Kitap Yönetimi** — Ekleme, düzenleme, silme, arama ve kategori filtreleme
- 👥 **Üye Yönetimi** — Üye kaydı, listeleme ve yönetim paneli
- 🔄 **Ödünç İşlemleri** — Kitap ödünç verme ve iade takibi
- 🔐 **Güvenli Erişim** — JWT tabanlı kimlik doğrulama ve rol bazlı yetkilendirme
- 📊 **İstatistikler** — Anlık kitap, kategori ve ödünç durum bilgileri
- 🌙 **Koyu Tema** — Göz yormayan şık ve modern arayüz
- 📱 **Responsive Tasarım** — Mobil, tablet ve masaüstü uyumlu

---

## 🚀 Teknolojiler

### Frontend
| Teknoloji | Sürüm | Açıklama |
|-----------|-------|----------|
| [React](https://react.dev/) | 19.x | Kullanıcı arayüzü |
| [Vite](https://vite.dev/) | 8.x | Geliştirme sunucusu ve paketleyici |
| [React Router](https://reactrouter.com/) | 7.x | Sayfa yönlendirme |
| [Axios](https://axios-http.com/) | 1.x | HTTP istemcisi |
| Klasik CSS | — | Özel tasarım (framework yok) |

### Backend
| Teknoloji | Sürüm | Açıklama |
|-----------|-------|----------|
| [Node.js](https://nodejs.org/) | 18+ | Sunucu ortamı |
| [Express.js](https://expressjs.com/) | 5.x | Web çatısı |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Veritabanı |
| [Sequelize](https://sequelize.org/) | 6.x | ORM |
| [JWT](https://jwt.io/) | — | Token tabanlı auth |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | 3.x | Şifre hashleme |

---

## 📁 Proje Yapısı

```
📦 WebDönem2Projesi/
├── 📂 backend/
│   ├── config/              → Veritabanı yapılandırması
│   ├── controllers/         → İş mantığı katmanı
│   ├── middleware/           → JWT doğrulama, admin kontrolü
│   ├── models/              → Sequelize veri modelleri
│   ├── routes/              → API rota tanımları
│   ├── server.js            → Express sunucu giriş noktası
│   └── package.json
│
├── 📂 frontend/
│   ├── src/
│   │   ├── context/         → Auth Context (durum yönetimi)
│   │   ├── components/      → Navbar, Footer
│   │   ├── pages/           → AnaSayfa, Kitaplar, Uyeler, Ödünç, Giriş, Kayıt
│   │   ├── services/        → API istemci servisleri
│   │   ├── data/            → Görseller ve statik veriler
│   │   ├── App.jsx          → Router ve korumalı rotalar
│   │   ├── main.jsx         → React giriş noktası
│   │   └── index.css        → Global stiller (koyu tema)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── 📂 dokumanlar/
│   └── UML_Diyagramlari.md  → Projenin UML (Use-Case, Activity, ER, Component) diyagramları
├── .gitignore
├── genel.md                 → Proje genel bakış dokümanı
├── postgresqpl.txt          → PostgreSQL açıklama raporu
└── README.md                → Bu dosya
```

---

## 📊 UML ve Tasarım Dokümantasyonu

Projenin altyapısını ve iş akışlarını daha iyi anlamak için hazırlanan UML diyagramlarına aşağıdaki bağlantıdan ulaşabilirsiniz:

👉 **[UML Diyagramlarını Görüntüle](./dokumanlar/UML_Diyagramlari.md)**
- Use-Case (Kullanım Durumu) Diyagramı
- Activity (Aktivite) Diyagramı
- ER (Veritabanı İlişki) Diyagramı
- Component (Bileşen İlişkileri) Diyagramı

---

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler

- **Node.js** v18 veya üzeri
- **PostgreSQL** v14 veya üzeri
- **npm** paket yöneticisi

### 1️⃣ Repoyu Klonla

```bash
git clone https://github.com/emrep/WebDonem2Projesi.git
cd WebDonem2Projesi
```

### 2️⃣ Veritabanını Oluştur

```sql
CREATE DATABASE kutuphane_db;
```

### 3️⃣ Backend Kurulumu

```bash
cd backend
npm install
```

`backend/.env` dosyasını düzenleyin:

```env
# Sunucu Portu
PORT=5000

# PostgreSQL Veritabanı Ayarları
VT_HOST=localhost
VT_PORT=5432
VT_AD=kutuphane_db
VT_KULLANICI=postgres
VT_SIFRE=sifrenizi_buraya_yazin

# JWT Ayarları
JWT_GIZLI_ANAHTAR=gizli-anahtar-degistirin
JWT_SURE=24h

# Uygulama Ortamı
NODE_ENV=development
```

### 4️⃣ Frontend Kurulumu

```bash
cd frontend
npm install
```

### 5️⃣ Uygulamayı Başlat

```bash
# Terminal 1 — Backend
cd backend
npm run gelistirme

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 6️⃣ Tarayıcıda Aç

| Servis | Adres |
|--------|-------|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000 |

---

## 📌 API Endpoints

### Yetkilendirme

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `POST` | `/api/yetkilendirme/kayit` | Yeni üye kaydı | 🌐 Herkese açık |
| `POST` | `/api/yetkilendirme/giris` | Üye girişi | 🌐 Herkese açık |
| `GET` | `/api/yetkilendirme/profil` | Profil bilgisi | 🔒 Üye |

### Kitaplar

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/kitaplar` | Kitap listesi (arama + sayfalama) | 🌐 Herkese açık |
| `GET` | `/api/kitaplar/kategoriler` | Kategori listesi | 🌐 Herkese açık |
| `POST` | `/api/kitaplar` | Kitap ekle | 🔑 Admin |
| `PUT` | `/api/kitaplar/:id` | Kitap güncelle | 🔑 Admin |
| `DELETE` | `/api/kitaplar/:id` | Kitap sil | 🔑 Admin |

### Üyeler

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/uyeler` | Üye listesi | 🔑 Admin |
| `DELETE` | `/api/uyeler/:id` | Üye sil | 🔑 Admin |

### Ödünç İşlemleri

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/odunc` | Ödünç listesi | 🔑 Admin |
| `POST` | `/api/odunc` | Ödünç ver | 🔑 Admin |
| `PUT` | `/api/odunc/iade/:id` | İade et | 🔑 Admin |

### İstatistikler

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/istatistikler` | Genel istatistikler | 🌐 Herkese açık |

---

## 👤 İlk Admin Hesabı Oluşturma

1. `/api/yetkilendirme/kayit` endpoint'i ile bir hesap oluşturun
2. PostgreSQL'de rolü admin olarak güncelleyin:

```sql
UPDATE uye SET rol = 'admin' WHERE eposta = 'admin@kutuphane.com';
```

---

## 🎨 Tasarım Detayları

| Özellik | Değer |
|---------|-------|
| **Tema** | Koyu (Dark Mode) |
| **Ana Arkaplan** | `#0a0a14` |
| **Vurgu Rengi** | `#e2b714` (altın) |
| **Font** | Inter (Google Fonts) |
| **CSS Yaklaşımı** | CSS Değişkenleri + Klasik CSS |
| **Efektler** | Glassmorphism, gradient'ler, mikro-animasyonlar |
| **Responsive** | 768px (tablet), 480px (mobil) |

---

## 📂 Sayfalar

| Sayfa | Yol | Açıklama | Erişim |
|-------|-----|----------|--------|
| Ana Sayfa | `/` | Karşılama + istatistikler | Herkese açık |
| Kitaplar | `/kitaplar` | Kitap listesi + CRUD | Görüntüleme herkese; CRUD admin |
| Üyeler | `/uyeler` | Üye tablosu | Sadece admin |
| Ödünç İşlemleri | `/odunc` | Ödünç ver / iade et | Sadece admin |
| Giriş Yap | `/giris` | Üye giriş formu | Giriş yapmamışlar |
| Kayıt Ol | `/kayit` | Yeni üye kayıt formu | Giriş yapmamışlar |

---

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir dal (branch) oluşturun: `git checkout -b ozellik/yeni-ozellik`
3. Değişikliklerinizi commit edin: `git commit -m 'Yeni özellik eklendi'`
4. Dalınıza push edin: `git push origin ozellik/yeni-ozellik`
5. Pull Request açın

---

## 📝 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır.

---

<div align="center">

**Raf Arkası** ile kütüphanenizi dijitale taşıyın 📚✨

</div>
