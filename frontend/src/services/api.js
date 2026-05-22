// ============================================
// API Servis Dosyası
// Axios ile backend API isteklerini yönetir
// ============================================

import axios from 'axios';

// Axios örneği oluştur
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// İstek öncesi token ekle (interceptor)
api.interceptors.request.use(
  (yapilandirma) => {
    const token = localStorage.getItem('token');
    if (token) {
      yapilandirma.headers.Authorization = `Bearer ${token}`;
    }
    return yapilandirma;
  },
  (hata) => {
    return Promise.reject(hata);
  }
);

// Yanıt sonrası hata yönetimi
api.interceptors.response.use(
  (yanit) => yanit,
  (hata) => {
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
  kayitOl: (veri) => api.post('/yetkilendirme/kayit', veri),
  girisYap: (veri) => api.post('/yetkilendirme/giris', veri),
  profilGetir: () => api.get('/yetkilendirme/profil')
};

// ---- Kitap Servisleri ----
export const kitapServisi = {
  tumunuGetir: (parametreler) => api.get('/kitaplar', { params: parametreler }),
  tekGetir: (id) => api.get(`/kitaplar/${id}`),
  ekle: (veri) => api.post('/kitaplar', veri),
  guncelle: (id, veri) => api.put(`/kitaplar/${id}`, veri),
  sil: (id) => api.delete(`/kitaplar/${id}`),
  kategorileriGetir: () => api.get('/kitaplar/kategoriler')
};

// ---- İstatistik Servisleri ----
export const istatistikServisi = {
  getir: () => api.get('/istatistikler')
};

// ---- Üye Servisleri ----
export const uyeServisi = {
  tumunuGetir: (parametreler) => api.get('/uyeler', { params: parametreler }),
  tekGetir: (id) => api.get(`/uyeler/${id}`),
  guncelle: (id, veri) => api.put(`/uyeler/${id}`, veri),
  sil: (id) => api.delete(`/uyeler/${id}`)
};

// ---- Ödünç Servisleri ----
export const oduncServisi = {
  tumunuGetir: (parametreler) => api.get('/odunc', { params: parametreler }),
  oduncVer: (veri) => api.post('/odunc', veri),
  iadeEt: (id) => api.put(`/odunc/iade/${id}`),
  uyeOduncleri: (uyeId) => api.get(`/odunc/uye/${uyeId}`)
};

export default api;
