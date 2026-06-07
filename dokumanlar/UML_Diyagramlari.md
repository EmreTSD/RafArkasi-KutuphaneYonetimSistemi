# RafArkası Kütüphane Yönetim Sistemi - UML Diyagramları

Projenin mimarisini ve süreçlerini anlatan temel UML diyagramları aşağıda yer almaktadır. Bu diyagramlar **Mermaid** sözdizimi ile hazırlanmıştır. Github üzerinde doğrudan görsel olarak render edilir.

## 1. Use-Case (Kullanım Durumu) Diyagramı
Sistemin farklı aktörler (Üye ve Admin) tarafından nasıl kullanıldığını gösterir.

```mermaid
usecaseDiagram
    actor Üye as "Standart Üye"
    actor Admin as "Sistem Yöneticisi"
    
    package "RafArkası Kütüphane Sistemi" {
        usecase UC1 as "Sisteme Giriş/Kayıt"
        usecase UC2 as "Kitapları Listeleme & Arama"
        usecase UC3 as "Ödünç Alma"
        usecase UC4 as "Ödünç İade Etme"
        usecase UC5 as "Kendi İşlemlerini Görme"
        
        usecase UC6 as "Kitap Ekle/Düzenle/Sil"
        usecase UC7 as "Üye Yönetimi"
        usecase UC8 as "Tüm Ödünçleri Yönetme"
        usecase UC9 as "İstatistik & Rapor Görüntüleme"
    }
    
    Üye --> UC1
    Üye --> UC2
    Üye --> UC3
    Üye --> UC4
    Üye --> UC5
    
    Admin --> UC1
    Admin --> UC2
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
```

*(Not: Mermaid Use-Case desteğini yeni standartlarında kısıtlı verebilir, alternatif olarak akış ile Use-Case senaryoları simüle edilebilir)*

## 2. Activity (Aktivite) Diyagramı
Bir üyenin sisteme girip kitap ödünç alma sürecinin adım adım akışını gösterir.

```mermaid
stateDiagram-v2
    [*] --> Anasayfa
    Anasayfa --> GirisEkrani: "Giriş Yap"a Tıklar
    
    state GirisDurumu <<choice>>
    GirisEkrani --> GirisDurumu: Bilgileri Gir & Onayla
    
    GirisDurumu --> Anasayfa: Hata (Geçersiz Şifre)
    GirisDurumu --> KitaplarSayfasi: Başarılı (Token Alınır)
    
    KitaplarSayfasi --> AramaYap: Kitap Ara
    AramaYap --> KitapSec
    
    state StokDurumu <<choice>>
    KitapSec --> StokDurumu: Ödünç Al İsteği
    
    StokDurumu --> HataMesaji: Stok Yetersiz
    HataMesaji --> KitaplarSayfasi
    
    StokDurumu --> IslemBasarili: Stok Var
    IslemBasarili --> OduncIslemleriSayfasi: Veritabanı Kaydı
    
    OduncIslemleriSayfasi --> [*]: İşlem Tamamlandı
```

## 3. ER (Veritabanı İlişki) Diyagramı
PostgreSQL veritabanındaki tabloları ve birbirleriyle olan ilişkilerini gösterir.

```mermaid
erDiagram
    UYELER {
        int id PK
        string ad
        string soyad
        string eposta
        string sifre
        string rol
        datetime created_at
    }
    
    KITAPLAR {
        int id PK
        string baslik
        string yazar
        string isbn
        string yayinevi
        int yayin_yili
        int sayfa_sayisi
        string kategori
        int mevcut_adet
        text aciklama
        datetime created_at
    }
    
    ODUNCLER {
        int id PK
        int uye_id FK
        int kitap_id FK
        date odunc_tarihi
        date son_iade_tarihi
        date iade_edildigi_tarih
        string durum
    }

    UYELER ||--o{ ODUNCLER : "yapar"
    KITAPLAR ||--o{ ODUNCLER : "içerir"
```

## 4. Component (Bileşen İlişkileri) Diyagramı
Frontend (React) ve Backend (Express) arasındaki mimari bileşenlerin veri akışını gösterir.

```mermaid
graph TD
    subgraph "Frontend (React Uygulaması)"
        UI[Kullanıcı Arayüzü / Sayfalar]
        Ctx[Yetkilendirme Context API]
        Axios[Axios API İstemcisi]
        
        UI <--> Ctx
        UI <--> Axios
    }

    subgraph "Backend (Node.js & Express)"
        Router[Express Rotaları]
        AuthMid[Yetkilendirme Middleware]
        Controllers[İş Mantığı / Controllers]
        
        Router --> AuthMid
        AuthMid --> Controllers
    }

    subgraph "Veritabanı"
        Seq[Sequelize ORM]
        DB[(PostgreSQL)]
        
        Controllers <--> Seq
        Seq <--> DB
    }

    Axios <-->|HTTP REST İsteği & JWT Token| Router
```
