// ============================================
// API Servis Dosyası
// Axios ile backend API isteklerini yönetir
// ============================================

import axios from 'axios';

// Axios örneği oluştur
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// İstek öncesi token ekle (interceptor)
api.interceptors.request.use(
  function (yapilandirma) {
    const token = localStorage.getItem('token');
    if (token) {
      yapilandirma.headers.Authorization = `Bearer ${token}`;
    }
    return yapilandirma;
  },
  function (hata) {
    return Promise.reject(hata);
  }
);

// Yanıt sonrası hata yönetimi
api.interceptors.response.use(
  function (yanit) {
    return yanit;
  },
  function (hata) {
    if (hata.response && hata.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('uye');
      window.location.href = '/giris';
    }
    return Promise.reject(hata);
  }
);

// ---- Yetkilendirme Servisleri ----
export const yetkilendirmeServisi = {
  kayitOl: function (veri) {
    return api.post('/yetkilendirme/kayit', veri);
  },
  girisYap: function (veri) {
    return api.post('/yetkilendirme/giris', veri);
  },
  profilGetir: function () {
    return api.get('/yetkilendirme/profil');
  }
};

// ---- Kitap Servisleri ----
export const kitapServisi = {
  tumunuGetir: function (parametreler) {
    return api.get('/kitaplar', { params: parametreler });
  },
  tekGetir: function (id) {
    return api.get(`/kitaplar/${id}`);
  },
  ekle: function (veri) {
    return api.post('/kitaplar', veri);
  },
  guncelle: function (id, veri) {
    return api.put(`/kitaplar/${id}`, veri);
  },
  sil: function (id) {
    return api.delete(`/kitaplar/${id}`);
  },
  kategorileriGetir: function () {
    return api.get('/kitaplar/kategoriler');
  }
};

// ---- İstatistik Servisleri ----
export const istatistikServisi = {
  getir: function () {
    return api.get('/istatistikler');
  },
  adminGetir: function () {
    return api.get('/istatistikler/admin');
  }
};

// ---- Üye Servisleri ----
export const uyeServisi = {
  tumunuGetir: function (parametreler) {
    return api.get('/uyeler', { params: parametreler });
  },
  tekGetir: function (id) {
    return api.get(`/uyeler/${id}`);
  },
  guncelle: function (id, veri) {
    return api.put(`/uyeler/${id}`, veri);
  },
  sil: function (id) {
    return api.delete(`/uyeler/${id}`);
  }
};

// ---- Ödünç Servisleri ----
export const oduncServisi = {
  tumunuGetir: function (parametreler) {
    return api.get('/odunc', { params: parametreler });
  },
  oduncVer: function (veri) {
    return api.post('/odunc', veri);
  },
  iadeEt: function (id) {
    return api.put(`/odunc/iade/${id}`);
  },
  uyeOduncleri: function (uyeId) {
    return api.get(`/odunc/uye/${uyeId}`);
  }
};

export default api;
