// Anlaşmalı Mahalleler Altyapı Bildirim Sistemi - Database
const DoguGuneydoguDatabase = {
    // Database anahtarları
    STORAGE_KEYS: {
        REPORTS: 'dogu_guneydogu_altyapi_reports_v2',
        SETTINGS: 'dogu_guneydogu_altyapi_settings_v2'
    },
        // Admin kullanıcı bilgileri
        const ADMIN_CREDENTIALS = {
            username: 'mardinli',
            password: 'amed2147'
        };

        // Gizli admin butonu
        document.getElementById('secretAdminBtn').addEventListener('click', function() {
            document.getElementById('passwordModal').classList.add('active');
        });

        // Admin login formu
        document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // Giriş başarılı
                closePasswordModal();
                toggleAdminPanel();
            } else {
                // Giriş başarısız
                document.getElementById('loginError').style.display = 'block';
                document.getElementById('adminPassword').value = '';
                document.getElementById('adminPassword').focus();
                
                // 3 saniye sonra hata mesajını gizle
                setTimeout(() => {
                    document.getElementById('loginError').style.display = 'none';
                }, 3000);
            }
        });

        // Password modal'ı kapat
        function closePasswordModal() {
            document.getElementById('passwordModal').classList.remove('active');
            document.getElementById('adminLoginForm').reset();
            document.getElementById('loginError').style.display = 'none';
        }

        // Admin panelini aç/kapa
        function toggleAdminPanel() {
            const panel = document.getElementById('adminPanel');
            panel.classList.toggle('active');
            
            if (panel.classList.contains('active')) {
                loadAdminReports();
            }
        }
    // Database'i başlat
    init() {
        console.log('Doğu & Güneydoğu Database başlatılıyor...');
        
        // Eğer reports yoksa, boş array oluştur
        if (!this.getAllReports()) {
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify([]));
        }
        
        // Settings yoksa oluştur
        if (!this.getSettings()) {
            this.saveSettings({
                version: '2.0.0',
                lastBackup: null,
                totalReports: 0
            });
        }
        
        return this;
    },

    // Tüm raporları getir
    getAllReports() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.REPORTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Raporlar yüklenirken hata:', error);
            return [];
        }
    },

    // ID'ye göre rapor getir
    getReport(id) {
        const reports = this.getAllReports();
        return reports.find(report => report.id === id);
    },

    // Yeni rapor kaydet
    saveReport(reportData) {
        try {
            const reports = this.getAllReports();
            
            // Rapor ID kontrolü (eğer yoksa oluştur)
            if (!reportData.id) {
                reportData.id = 'DB-' + Date.now().toString().slice(-8);
            }
            
            // Tarih ekle (eğer yoksa)
            if (!reportData.tarih) {
                reportData.tarih = new Date().toLocaleString('tr-TR');
            }
            
            // Durum ekle (eğer yoksa)
            if (!reportData.durum) {
                reportData.durum = 'pending';
            }
            
            // Koordinat ekle (eğer yoksa rastgele)
            if (!reportData.koordinat) {
                const illerKoordinat = {
                    'Diyarbakır': [37.9144, 40.2306],
                    'Şanlıurfa': [37.1591, 38.7969],
                    'Gaziantep': [37.0662, 37.3833],
                    'Mardin': [37.3122, 40.7356],
                    'Batman': [37.8812, 41.1351],
                    'Siirt': [37.9443, 41.9329],
                    'Şırnak': [37.5184, 42.4549],
                    'Hakkari': [37.5744, 43.7408],
                    'Van': [38.5011, 43.3730],
                    'Muş': [38.9462, 41.7539],
                    'Bitlis': [38.3938, 42.1232],
                    'Bingöl': [38.8853, 40.4986],
                    'Tunceli': [39.1061, 39.5482],
                    'Elazığ': [38.6810, 39.2264],
                    'Malatya': [38.3552, 38.3095],
                    'Adıyaman': [37.7648, 38.2786],
                    'Kilis': [36.7184, 37.1212],
                    'Osmaniye': [37.0746, 36.2464],
                    'Hatay': [36.4018, 36.3498]
                };
                
                const ilKoordinat = illerKoordinat[reportData.il] || [38.9637, 35.2433];
                reportData.koordinat = {
                    lat: ilKoordinat[0] + (Math.random() - 0.5) * 0.1,
                    lng: ilKoordinat[1] + (Math.random() - 0.5) * 0.1
                };
            }
            
            // Raporu ekle
            reports.unshift(reportData);
            
            // Kaydet
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(reports));
            
            // İstatistikleri güncelle
            this.updateStatistics();
            
            console.log('Rapor kaydedildi:', reportData.id);
            return true;
            
        } catch (error) {
            console.error('Rapor kaydedilirken hata:', error);
            return false;
        }
    },

    // Rapor durumunu güncelle
    updateReportStatus(reportId, newStatus, adminNote = '') {
        try {
            const reports = this.getAllReports();
            const reportIndex = reports.findIndex(r => r.id === reportId);
            
            if (reportIndex !== -1) {
                reports[reportIndex].durum = newStatus;
                
                // Admin notu ekle
                if (adminNote) {
                    reports[reportIndex].adminNot = adminNote;
                }
                
                // Güncelleme tarihi ekle
                reports[reportIndex].guncellemeTarihi = new Date().toLocaleString('tr-TR');
                
                // Kaydet
                localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(reports));
                
                console.log(`Rapor ${reportId} durumu güncellendi: ${newStatus}`);
                return true;
            }
            
            console.warn('Rapor bulunamadı:', reportId);
            return false;
            
        } catch (error) {
            console.error('Rapor güncellenirken hata:', error);
            return false;
        }
    },

    // Rapor sil
    deleteReport(reportId) {
        try {
            const reports = this.getAllReports();
            const filteredReports = reports.filter(r => r.id !== reportId);
            
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(filteredReports));
            
            console.log('Rapor silindi:', reportId);
            return true;
            
        } catch (error) {
            console.error('Rapor silinirken hata:', error);
            return false;
        }
    },

    // Filtrelenmiş raporları getir
    getFilteredReports(filters = {}) {
        let reports = this.getAllReports();
        
        // Tüm filtreler
        if (filters.durum) {
            reports = reports.filter(r => r.durum === filters.durum);
        }
        if (filters.il) {
            reports = reports.filter(r => r.il === filters.il);
        }
        if (filters.ilce) {
            reports = reports.filter(r => r.ilce === filters.ilce);
        }
        if (filters.oncelik) {
            reports = reports.filter(r => r.oncelik === filters.oncelik);
        }
        if (filters.problemTipi) {
            reports = reports.filter(r => r.problemTipi === filters.problemTipi);
        }
        if (filters.baslangicTarihi && filters.bitisTarihi) {
            reports = reports.filter(r => {
                const reportDate = new Date(r.tarih.split(' ')[0].split('.').reverse().join('-'));
                const startDate = new Date(filters.baslangicTarihi);
                const endDate = new Date(filters.bitisTarihi);
                return reportDate >= startDate && reportDate <= endDate;
            });
        }
        
        return reports;
    },

    // İstatistikleri getir
    getStatistics() {
        const reports = this.getAllReports();
        const today = new Date().toLocaleDateString('tr-TR');
        
        return {
            toplam: reports.length,
            bekleyen: reports.filter(r => r.durum === 'pending').length,
            onaylanan: reports.filter(r => r.durum === 'approved').length,
            reddedilen: reports.filter(r => r.durum === 'rejected').length,
            tamamlanan: reports.filter(r => r.durum === 'completed').length,
            bugunku: reports.filter(r => r.tarih.includes(today.split(' ')[0])).length,
            
            ilBazinda: reports.reduce((acc, report) => {
                acc[report.il] = (acc[report.il] || 0) + 1;
                return acc;
            }, {}),
            
            ilceBazinda: reports.reduce((acc, report) => {
                const key = `${report.il} - ${report.ilce}`;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {}),
            
            problemBazinda: reports.reduce((acc, report) => {
                acc[report.problemTipi] = (acc[report.problemTipi] || 0) + 1;
                return acc;
            }, {}),
            
            oncelikBazinda: reports.reduce((acc, report) => {
                acc[report.oncelik] = (acc[report.oncelik] || 0) + 1;
                return acc;
            }, {}),
            
            gunlukTrend: reports.reduce((acc, report) => {
                const date = report.tarih.split(' ')[0];
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {})
        };
    },

    // İstatistikleri güncelle
    updateStatistics() {
        const reports = this.getAllReports();
        const settings = this.getSettings();
        
        settings.totalReports = reports.length;
        settings.lastUpdate = new Date().toISOString();
        
        this.saveSettings(settings);
    },

    // Database'i temizle (tüm verileri sil)
    clearDatabase() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify([]));
            
            const settings = this.getSettings();
            settings.totalReports = 0;
            this.saveSettings(settings);
            
            console.log('Database temizlendi.');
            return true;
        } catch (error) {
            console.error('Database temizlenirken hata:', error);
            return false;
        }
    },

    // Database'i yedekle (indir)
    backupDatabase() {
        try {
            const data = {
                reports: this.getAllReports(),
                settings: this.getSettings(),
                timestamp: new Date().toISOString(),
                version: '2.0.0',
                totalReports: this.getAllReports().length
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dogu-guneydogu-altyapi-backup-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Backup tarihini kaydet
            const settings = this.getSettings();
            settings.lastBackup = new Date().toISOString();
            this.saveSettings(settings);
            
            return true;
        } catch (error) {
            console.error('Backup alınırken hata:', error);
            return false;
        }
    },

    // Database'i geri yükle
    restoreDatabase(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.reports && Array.isArray(data.reports)) {
                localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(data.reports));
                
                if (data.settings) {
                    this.saveSettings(data.settings);
                }
                
                console.log('Database geri yüklendi.');
                return true;
            }
            
            throw new Error('Geçersiz backup verisi');
        } catch (error) {
            console.error('Database geri yüklenirken hata:', error);
            return false;
        }
    },

    // Ayarları kaydet
    saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Ayarlar kaydedilirken hata:', error);
            return false;
        }
    },

    // Ayarları getir
    getSettings() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Ayarlar yüklenirken hata:', error);
            return {};
        }
    },

    // Raporları coğrafi olarak filtrele
    getReportsByLocation(lat, lng, radiusKm = 10) {
        const reports = this.getAllReports();
        
        return reports.filter(report => {
            if (!report.koordinat || !report.koordinat.lat || !report.koordinat.lng) {
                return false;
            }
            
            const distance = this.calculateDistance(
                lat, lng,
                report.koordinat.lat, report.koordinat.lng
            );
            
            return distance <= radiusKm;
        });
    },

    // İki koordinat arasındaki mesafeyi hesapla (km)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    // Dereceyi radyana çevir
    deg2rad(deg) {
        return deg * (Math.PI/180);
    },

    // Harita için marker verilerini getir
    getMapMarkers() {
        const reports = this.getAllReports();
        
        return reports.map(report => {
            if (!report.koordinat) return null;
            
            let color;
            switch(report.durum) {
                case 'pending': color = '#ffc107'; break; // Sarı
                case 'approved': color = '#17a2b8'; break; // Mavi
                case 'completed': color = '#28a745'; break; // Yeşil
                case 'rejected': color = '#dc3545'; break; // Kırmızı
                default: color = '#6c757d'; // Gri
            }
            
            return {
                id: report.id,
                lat: report.koordinat.lat,
                lng: report.koordinat.lng,
                color: color,
                title: `${report.il} - ${report.ilce}`,
                content: `
                    <strong>${report.il} - ${report.ilce}</strong><br>
                    ${report.mahalle} ${report.sokak}<br>
                    <strong>Problem:</strong> ${report.problemTipi}<br>
                    <strong>Durum:</strong> ${report.durum === 'pending' ? 'Bekliyor' : 
                                             report.durum === 'approved' ? 'Onaylandı' : 
                                             report.durum === 'completed' ? 'Tamamlandı' : 'Reddedildi'}<br>
                    <strong>Tarih:</strong> ${report.tarih}
                `
            };
        }).filter(marker => marker !== null);
    }
};

// Database'i başlat ve global yap
window.database = DoguGuneydoguDatabase.init();

// Kullanım örnekleri:
console.log(`
DOĞU & GÜNEYDOĞU ALTYAPI DATABASE KULLANIMI:

1. Yeni bildirim ekle:
   window.database.saveReport({
       il: "Diyarbakır",
       ilce: "Bağlar",
       mahalle: "Kaynartepe",
       sokak: "293. Sokak",
       problemTipi: "Yol Bozukluğu",
       oncelik: "high",
       aciklama: "Yolda çukur var",
       isim: "Ahmet Yılmaz",
       telefon: "0532 123 4567",
       koordinat: { lat: 37.9144, lng: 40.2306 }
   });

2. Tüm bildirimleri getir:
   window.database.getAllReports();

3. Filtreli arama:
   window.database.getFilteredReports({
       il: "Diyarbakır",
       durum: "pending",
       oncelik: "high"
   });

4. İstatistikleri getir:
   window.database.getStatistics();

5. Harita marker'ları:
   window.database.getMapMarkers();

6. Database yedekle:
   window.database.backupDatabase();
`);

console.log('Database başlatıldı. Toplam bildirim:', window.database.getAllReports().length);
