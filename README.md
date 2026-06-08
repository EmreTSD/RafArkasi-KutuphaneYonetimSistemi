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
- 👥 **Üye Yönetimi** — Üye kaydı, listeleme, rol atama ve yönetim paneli
- 🔄 **Ödünç İşlemleri** — Kitap ödünç verme ve iade takibi
- 🔐 **Güvenli Erişim** — JWT tabanlı kimlik doğrulama ve **3 seviyeli rol bazlı yetkilendirme** (admin / moderator / üye)
- 📊 **İstatistikler** — Anlık kitap, kategori ve ödünç durum bilgileri + yönetim paneli
- 🌙 **Koyu Tema** — Göz yormayan şık ve modern arayüz
- 📱 **Responsive Tasarım** — Mobil, tablet ve masaüstü uyumlu

---

## 🔐 Roller ve Yetkiler

Sistemde üç kullanıcı rolü bulunur. Yetkiler hem backend middleware'i hem de frontend rotalarıyla iki katmanlı olarak korunur.

| Yetki | 👑 Admin | 🛡️ Moderator | 👤 Üye |
|-------|:-------:|:-----------:|:------:|
| Kitapları görüntüleme / arama | ✅ | ✅ | ✅ |
| Kitap ekleme / güncelleme / silme | ✅ | ✅ | ❌ |
| İstatistik panelini görüntüleme | ✅ | ✅ | ❌ |
| Üye yönetimi (listeleme / rol / silme) | ✅ | ❌ | ❌ |
| Ödünç verme / iade işlemleri | ✅ | ❌ | ❌ |

> **Özetle:** Admin her şeyi yapar. **Moderator yalnızca kitap işlemleri yapar ve istatistikleri görür** — üye ve ödünç yönetimine erişemez. Üye ise yalnızca kitapları görüntüleyebilir.

---

## 🚀 Teknolojiler

### Frontend
| Teknoloji | Açıklama |
|-----------|----------|
| [React](https://react.dev/) | Kullanıcı arayüzü |
| [Vite](https://vite.dev/) | Geliştirme sunucusu ve paketleyici |
| [React Router](https://reactrouter.com/) | Sayfa yönlendirme |
| [Axios](https://axios-http.com/) | HTTP istemcisi |
| Klasik CSS | Özel tasarım (framework yok) |

### Backend
| Teknoloji | Açıklama |
|-----------|----------|
| [Node.js](https://nodejs.org/) | Sunucu ortamı |
| [Express.js](https://expressjs.com/) | Web çatısı |
| [PostgreSQL](https://www.postgresql.org/) | Veritabanı |
| [Sequelize](https://sequelize.org/) | ORM |
| [JWT](https://jwt.io/) | Token tabanlı kimlik doğrulama |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Şifre hashleme |

---

## 📁 Proje Yapısı

```
📦 WebDönem2Projesi/
├── 📂 backend/
│   ├── config/                    → Veritabanı yapılandırması (Sequelize/PostgreSQL)
│   ├── controllers/               → İş mantığı (kitap, üye, ödünç, istatistik, yetkilendirme)
│   ├── middleware/                → JWT doğrulama, rol kontrolü, hata yönetimi
│   ├── models/                    → Sequelize modelleri (Uye, Kitap, Odunc)
│   ├── routes/                    → API rota tanımları
│   ├── kayitlari_kontrol_et.js    → Tohum (seed) verisi: 30 kitap, 17 kullanıcı, 5 ödünç
│   ├── sifirla.js                 → Veritabanını sıfırlama betiği
│   ├── server.js                  → Express sunucu giriş noktası
│   └── package.json
│
├── 📂 frontend/
│   ├── src/
│   │   ├── context/               → YetkilendirmeBaglami (Auth Context)
│   │   ├── components/            → Navbar, Footer, KitapKart, KorumaliRota,
│   │   │                            Sayfalama, MesajBildirim, YuklemeSpinner, BosDurum
│   │   ├── pages/                 → AnaSayfa, Kitaplar, Uyeler, OduncIslemleri,
│   │   │                            AdminPanel, GirisYap, KayitOl
│   │   ├── services/              → api.js (Axios servis katmanı)
│   │   ├── assets/                → Görseller ve statik dosyalar
│   │   ├── App.jsx                → Router ve korumalı rotalar
│   │   ├── main.jsx               → React giriş noktası
│   │   └── index.css              → Global stiller (koyu tema)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── 📂 dokumanlar/
│   └── UML_Diyagramlari.md        → UML (Use-Case, Activity, ER, Component) diyagramları
├── .gitignore
└── README.md                      → Bu dosya
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
- **PostgreSQL** v14 veya üzeri (yerel ya da Supabase/Neon gibi bulut veritabanı)
- **npm** paket yöneticisi

### 1️⃣ Repoyu Klonla

```bash
git clone https://github.com/EmreTSD/RafArkasi-KutuphaneYonetimSistemi.git
cd RafArkasi-KutuphaneYonetimSistemi
```

### 2️⃣ Backend Kurulumu

```bash
cd backend
npm install
```

`backend/.env` dosyasını oluşturun. İki yöntemden birini kullanabilirsiniz:

**A) Bulut veritabanı (Supabase/Neon) — tek satır bağlantı (önerilen):**

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://kullanici:sifre@host:5432/veritabani"
VT_SSL=true

JWT_GIZLI_ANAHTAR=gizli-anahtar-degistirin
JWT_SURE=7d
```

**B) Yerel PostgreSQL — ayrı alanlar:**

```env
PORT=5000
NODE_ENV=development

VT_HOST=localhost
VT_PORT=5432
VT_AD=kutuphane_db
VT_KULLANICI=postgres
VT_SIFRE=sifrenizi_buraya_yazin
VT_SSL=false

JWT_GIZLI_ANAHTAR=gizli-anahtar-degistirin
JWT_SURE=7d
```

> Tablolar sunucu ilk açılışta otomatik oluşturulur (`sequelize.sync`). Yerel kullanımda önce veritabanını oluşturmanız gerekir: `CREATE DATABASE kutuphane_db;`

### 3️⃣ Frontend Kurulumu

```bash
cd frontend
npm install
```

### 4️⃣ Uygulamayı Başlat

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 5️⃣ Tarayıcıda Aç

| Servis | Adres |
|--------|-------|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000 |

---

## 🌱 Örnek Veri (Seed) ve Sıfırlama

Hızlı başlangıç için hazır tohum verisi (30 kitap, 17 kullanıcı, 5 ödünç kaydı) yükleyebilirsiniz.

```bash
cd backend

# Veritabanını tamamen sıfırla (tüm tabloları siler ve yeniden oluşturur)
npm run sifirla

# Örnek verileri yükle (yalnızca veritabanı boşken çalışır)
node kayitlari_kontrol_et.js
```

Seed sonrası hazır gelen örnek hesaplar:

| Rol | E-posta | Şifre |
|-----|---------|-------|
| 👑 Admin | `admin@rafarkasi.com` | `Admin1234!` |
| 🛡️ Moderator | `moderator1@rafarkasi.com` | `Moderator1234!` |
| 🛡️ Moderator | `moderator2@rafarkasi.com` | `Moderator1234!` |
| 👤 Üye | `ayse.kaya@example.com` | `Uye12345!` |

> Bir üyeyi moderator/admin yapmak için Admin hesabıyla **Üyeler** sayfasındaki rol açılır menüsünü kullanabilirsiniz.

---

## 📌 API Endpoints

### Yetkilendirme

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `POST` | `/api/yetkilendirme/kayit` | Yeni üye kaydı | 🌐 Herkese açık |
| `POST` | `/api/yetkilendirme/giris` | Üye girişi | 🌐 Herkese açık |
| `GET` | `/api/yetkilendirme/profil` | Profil bilgisi | 🔒 Giriş yapan |

### Kitaplar

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/kitaplar` | Kitap listesi (arama + sayfalama) | 🌐 Herkese açık |
| `GET` | `/api/kitaplar/kategoriler` | Kategori listesi | 🌐 Herkese açık |
| `GET` | `/api/kitaplar/:id` | Tek kitap detayı | 🌐 Herkese açık |
| `POST` | `/api/kitaplar` | Kitap ekle | 👑 Admin · 🛡️ Moderator |
| `PUT` | `/api/kitaplar/:id` | Kitap güncelle | 👑 Admin · 🛡️ Moderator |
| `DELETE` | `/api/kitaplar/:id` | Kitap sil | 👑 Admin · 🛡️ Moderator |

### Üyeler

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/uyeler` | Üye listesi | 👑 Admin |
| `GET` | `/api/uyeler/:id` | Tek üye detayı | 👑 Admin |
| `PUT` | `/api/uyeler/:id` | Üye güncelle (rol değiştirme dahil) | 👑 Admin |
| `DELETE` | `/api/uyeler/:id` | Üye sil | 👑 Admin |

### Ödünç İşlemleri

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/odunc` | Ödünç listesi | 👑 Admin |
| `POST` | `/api/odunc` | Ödünç ver | 👑 Admin |
| `PUT` | `/api/odunc/iade/:id` | İade et | 👑 Admin |
| `GET` | `/api/odunc/uye/:uyeId` | Üyenin ödünç kayıtları | 👑 Admin |

### İstatistikler

| Metod | Endpoint | Açıklama | Yetki |
|-------|----------|----------|-------|
| `GET` | `/api/istatistikler` | Genel istatistikler | 🌐 Herkese açık |
| `GET` | `/api/istatistikler/admin` | Yönetim paneli detaylı istatistikler | 👑 Admin · 🛡️ Moderator |

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
| Ana Sayfa | `/` | Karşılama + genel istatistikler | Herkese açık |
| Kitaplar | `/kitaplar` | Kitap listesi + CRUD | Görüntüleme herkese; CRUD admin & moderator |
| Yönetim Paneli | `/admin` | Dashboard ve istatistikler | Admin & moderator |
| Üyeler | `/uyeler` | Üye tablosu + rol yönetimi | Sadece admin |
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
