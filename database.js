// Diyarbakır Altyapı Bildirim Sistemi - Database
const AltyapiDatabase = {
    // Database anahtarları
    STORAGE_KEYS: {
        REPORTS: 'diyarbakir_altyapi_reports',
        SETTINGS: 'diyarbakir_altyapi_settings'
    },

    // Database'i başlat
    init() {
        console.log('Altyapı Database başlatılıyor...');
        
        // Eğer reports yoksa, boş array oluştur
        if (!this.getAllReports()) {
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify([]));
        }
        
        // Örnek veriler (test için)
        this.initializeSampleData();
        
        return this;
    },

    // Örnek veriler ekle (sadece boşsa)
    initializeSampleData() {
        const reports = this.getAllReports();
        if (reports.length === 0) {
            const sampleReports = [
                {
                    id: 'DB-20240001',
                    ilce: 'Bağlar',
                    mahalle: 'Kaynartepe',
                    sokak: '293. Sokak',
                    problemTipi: 'Yol Bozukluğu',
                    oncelik: 'high',
                    aciklama: 'Yolda derin çukur oluşmuş, araçların geçişini engelliyor.',
                    isim: 'Ahmet Yılmaz',
                    telefon: '0532 123 4567',
                    tarih: '01.01.2024 10:30',
                    durum: 'approved',
                    adminNot: 'Yol bakım ekibi yönlendirildi.'
                },
                {
                    id: 'DB-20240002',
                    ilce: 'Kayapınar',
                    mahalle: 'Yenimahalle',
                    sokak: 'Atatürk Caddesi',
                    problemTipi: 'Aydınlatma',
                    oncelik: 'medium',
                    aciklama: 'Cadde aydınlatması çalışmıyor, gece karanlık kalıyor.',
                    isim: 'Mehmet Demir',
                    telefon: '0533 234 5678',
                    tarih: '02.01.2024 14:15',
                    durum: 'pending',
                    adminNot: ''
                },
                {
                    id: 'DB-20240003',
                    ilce: 'Sur',
                    mahalle: 'Alipaşa',
                    sokak: 'Dicle Sokak',
                    problemTipi: 'Su Baskını',
                    oncelik: 'high',
                    aciklama: 'Su şebekesi patlamış, sokak sular altında kaldı.',
                    isim: 'Ayşe Kaya',
                    telefon: '0534 345 6789',
                    tarih: '03.01.2024 09:45',
                    durum: 'completed',
                    adminNot: 'Su ekipleri müdahale etti, sorun çözüldü.'
                }
            ];
            
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(sampleReports));
            console.log('Örnek veriler eklendi.');
        }
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
            
            // Raporu ekle
            reports.unshift(reportData); // En üste ekle
            
            // Kaydet
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(reports));
            
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
        
        // Durum filtreleme
        if (filters.durum) {
            reports = reports.filter(r => r.durum === filters.durum);
        }
        
        // İlçe filtreleme
        if (filters.ilce) {
            reports = reports.filter(r => r.ilce === filters.ilce);
        }
        
        // Mahalle filtreleme
        if (filters.mahalle) {
            reports = reports.filter(r => r.mahalle === filters.mahalle);
        }
        
        // Öncelik filtreleme
        if (filters.oncelik) {
            reports = reports.filter(r => r.oncelik === filters.oncelik);
        }
        
        // Tarih aralığı filtreleme
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
            
            ilceBazinda: reports.reduce((acc, report) => {
                acc[report.ilce] = (acc[report.ilce] || 0) + 1;
                return acc;
            }, {}),
            
            problemBazinda: reports.reduce((acc, report) => {
                acc[report.problemTipi] = (acc[report.problemTipi] || 0) + 1;
                return acc;
            }, {}),
            
            oncelikBazinda: reports.reduce((acc, report) => {
                acc[report.oncelik] = (acc[report.oncelik] || 0) + 1;
                return acc;
            }, {})
        };
    },

    // Database'i temizle (tüm verileri sil)
    clearDatabase() {
        try {
            localStorage.removeItem(this.STORAGE_KEYS.REPORTS);
            localStorage.removeItem(this.STORAGE_KEYS.SETTINGS);
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
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diyarbakir-altyapi-backup-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
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
    }
};

// Database'i başlat ve global yap
window.database = AltyapiDatabase.init();

// Kullanım örnekleri:
console.log(`
KULLANIM ÖRNEKLERİ:

1. Yeni bildirim ekle:
   window.database.saveReport({
       ilce: "Bağlar",
       mahalle: "Kaynartepe",
       sokak: "293. Sokak",
       problemTipi: "Yol Bozukluğu",
       oncelik: "high",
       aciklama: "Yolda çukur var",
       isim: "Ahmet Yılmaz",
       telefon: "0532 123 4567"
   });

2. Tüm bildirimleri getir:
   window.database.getAllReports();

3. Bildirim durumunu güncelle:
   window.database.updateReportStatus("DB-20240001", "approved", "Admin onayı");

4. İstatistikleri getir:
   window.database.getStatistics();

5. Database'i yedekle:
   window.database.backupDatabase();
`);

console.log('Database başlatıldı. Toplam bildirim:', window.database.getAllReports().length);
