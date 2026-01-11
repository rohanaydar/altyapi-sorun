/**
 * ANLAŞMALI MAHALLELER ALTYAPI SİSTEMİ
 * Ana Uygulama Yönetim Sistemi - Single Page Application (SPA)
 * 
 * @description: Tüm uygulama mantığı, sayfa yönetimi ve kullanıcı etkileşimleri
 * Tek sayfa uygulaması (SPA) olarak çalışır
 */

const App = {
    // KONFİGÜRASYON
    config: {
        appName: 'Anlaşmalı Mahalleler Altyapı Sistemi',
        version: '1.0.0',
        defaultLanguage: 'tr',
        defaultTheme: 'light',
        supportedLanguages: ['tr', 'ku'],
        mapProvider: 'openstreetmap',
        offlineMode: false, // İnternet olmadan çalışmasın
        autoSaveInterval: 30000, // 30 saniye
        maxPhotoSize: 2 * 1024 * 1024, // 2MB
        notificationDuration: 5000 // 5 saniye
    },

    // UYGULAMA DURUMU
    state: {
        currentPage: 'home',
        previousPage: null,
        userPreferences: {},
        isLoading: false,
        currentFilters: {},
        selectedNotifications: [],
        mapInstance: null,
        mapMarkers: [],
        markerCluster: null,
        heatmapLayer: null,
        language: 'tr',
        theme: 'light',
        formDraft: null,
        searchQuery: ''
    },

    // ÇEVİRİLER (Türkçe ve Kürtçe)
    translations: {
        tr: {
            appTitle: 'Anlaşmalı Mahalleler Altyapı Sorun Bildirim Sistemi',
            home: 'Ana Sayfa',
            report: 'Bildirim Yap',
            map: 'Harita',
            admin: 'Admin',
            login: 'Giriş Yap',
            logout: 'Çıkış Yap',
            loading: 'Yükleniyor...',
            success: 'Başarılı!',
            error: 'Hata!',
            warning: 'Uyarı!',
            info: 'Bilgi',
            save: 'Kaydet',
            cancel: 'İptal',
            delete: 'Sil',
            edit: 'Düzenle',
            view: 'Görüntüle',
            filter: 'Filtrele',
            export: 'Dışa Aktar',
            import: 'İçe Aktar',
            search: 'Ara',
            clear: 'Temizle',
            selectCity: 'Şehir Seçin',
            selectDistrict: 'İlçe Seçin',
            selectNeighborhood: 'Mahalle Seçin',
            selectStreet: 'Sokak Seçin',
            problemType: 'Problem Tipi',
            priority: 'Öncelik',
            description: 'Açıklama',
            photo: 'Fotoğraf',
            contactInfo: 'İletişim Bilgisi',
            submit: 'Gönder',
            next: 'İleri',
            back: 'Geri',
            step: 'Adım',
            of: '/',
            requiredField: 'Bu alan zorunludur',
            invalidEmail: 'Geçersiz e-posta adresi',
            invalidPhone: 'Geçersiz telefon numarası',
            fileTooLarge: 'Dosya boyutu çok büyük',
            reportSubmitted: 'Bildiriminiz başarıyla gönderildi',
            trackingCode: 'Takip Kodunuz',
            copyCode: 'Kodu Kopyala',
            status: 'Durum',
            date: 'Tarih',
            actions: 'İşlemler',
            all: 'Tümü',
            pending: 'Beklemede',
            approved: 'Onaylandı',
            inProgress: 'Devam Ediyor',
            completed: 'Tamamlandı',
            rejected: 'Reddedildi',
            highPriority: 'Yüksek Öncelik',
            mediumPriority: 'Orta Öncelik',
            lowPriority: 'Düşük Öncelik',
            urgent: 'Acil',
            statistics: 'İstatistikler',
            totalReports: 'Toplam Bildirim',
            solvedReports: 'Çözülen Bildirim',
            averageTime: 'Ortalama Çözüm Süresi',
            exportToExcel: 'Excel\'e Aktar',
            exportSelected: 'Seçilenleri Aktar',
            exportFiltered: 'Filtrelenmiş Veriyi Aktar',
            selectDateRange: 'Tarih Aralığı Seçin',
            fromDate: 'Başlangıç Tarihi',
            toDate: 'Bitiş Tarihi',
            applyFilters: 'Filtreleri Uygula',
            resetFilters: 'Filtreleri Sıfırla',
            mapView: 'Harita Görünümü',
            listView: 'Liste Görünümü',
            fullscreen: 'Tam Ekran',
            exitFullscreen: 'Tam Ekrandan Çık',
            clusterView: 'Küme Görünümü',
            heatmap: 'Isı Haritası',
            satellite: 'Uydu Görünümü',
            streetView: 'Sokak Görünümü',
            darkTheme: 'Koyu Tema',
            lightTheme: 'Açık Tema',
            language: 'Dil',
            settings: 'Ayarlar',
            help: 'Yardım',
            about: 'Hakkında',
            contact: 'İletişim',
            privacy: 'Gizlilik',
            terms: 'Kullanım Koşulları'
        },
        ku: {
            appTitle: 'Sîstema Ragihandina Pirsgirêkên Avahîsaziya Taxên Lihevkirî',
            home: 'Serê Malê',
            report: 'Ragihandin Bikin',
            map: 'Xerîte',
            admin: 'Admin',
            login: 'Têkeve',
            logout: 'Derkeve',
            loading: 'Tê barkirin...',
            success: 'Serkeftin!',
            error: 'Çewtî!',
            warning: 'Hişyarî!',
            info: 'Agahî',
            save: 'Tomar bike',
            cancel: 'Betal bike',
            delete: 'Jê bibe',
            edit: 'Sererast bike',
            view: 'Dîtin',
            filter: 'Parzûn bike',
            export: 'Derxe',
            import: 'Têxe',
            search: 'Lêgerîn',
            clear: 'Paqij bike',
            selectCity: 'Bajarekî hilbijêre',
            selectDistrict: 'Navçeyekî hilbijêre',
            selectNeighborhood: 'Taxekî hilbijêre',
            selectStreet: 'Kolekî hilbijêre',
            problemType: 'Cureyê Pirsgirêkê',
            priority: 'Pêşî',
            description: 'Danasîn',
            photo: 'Wêne',
            contactInfo: 'Agahiyên Têkilî',
            submit: 'Bişîne',
            next: 'Pêşve',
            back: 'Paşve',
            step: 'Gav',
            of: '/',
            requiredField: 'Ev qada pêwîst e',
            invalidEmail: 'Navnîşana e-nameyê nederbasdar e',
            invalidPhone: 'Hejmara telefonê nederbasdar e',
            fileTooLarge: 'Mezinahiya dosyayê pir mezin e',
            reportSubmitted: 'Ragihandina we bi serkeftî hate şandin',
            trackingCode: 'Koda Teşwîqkirina We',
            copyCode: 'Kodê Kopî bike',
            status: 'Rewş',
            date: 'Dîrok',
            actions: 'Çalakî',
            all: 'Hemû',
            pending: 'Li bendê',
            approved: 'Hat pejirandin',
            inProgress: 'Di pêşveçûnê de',
            completed: 'Qediya',
            rejected: 'Hat redkirin',
            highPriority: 'Pêşiya Bilind',
            mediumPriority: 'Pêşiya Navîn',
            lowPriority: 'Pêşiya Nizm',
            urgent: 'Acîl',
            statistics: 'Statîstîk',
            totalReports: 'Tevahiya Ragihandinan',
            solvedReports: 'Ragihandinên Çareserkirî',
            averageTime: 'Navîna Dema Çareseriyê',
            exportToExcel: 'Ber bi Excelê',
            exportSelected: 'Yên Hilbijartî Derxe',
            exportFiltered: 'Dane Parzûnkirî Derxe',
            selectDateRange: 'Kembera Dîrokê Hilbijêre',
            fromDate: 'Dîroka Destpêkê',
            toDate: 'Dîroka Dawî',
            applyFilters: 'Parzûnan Bikar Bîne',
            resetFilters: 'Parzûnan Sifir Bike',
            mapView: 'Dîtina Xerîteyê',
            listView: 'Dîtina Lîsteyê',
            fullscreen: 'Tevê Ekranê',
            exitFullscreen: 'Ji Tevê Ekranê Derkeve',
            clusterView: 'Dîtina Koman',
            heatmap: 'Xerîta Germahiyê',
            satellite: 'Dîtina Peykeyê',
            streetView: 'Dîtina Koleyan',
            darkTheme: 'Tema Tarî',
            lightTheme: 'Tema Ronî',
            language: 'Ziman',
            settings: 'Mîheng',
            help: 'Alîkarî',
            about: 'Derbarê',
            contact: 'Têkilî',
            privacy: 'Nihênî',
            terms: 'Şertên Bikaranînê'
        }
    },

    // BİLEŞENLER
    components: {
        header: null,
        mainContent: null,
        footer: null,
        notificationContainer: null,
        loadingOverlay: null,
        modals: {}
    },

    // HARİTA DEĞİŞKENLERİ
    map: {
        instance: null,
        markers: [],
        cluster: null,
        heatmap: null,
        layers: {
            osm: null,
            satellite: null
        }
    },

    /**
     * UYGULAMAYI BAŞLAT
     */
    init: function() {
        console.log('🚀 Uygulama başlatılıyor...');
        
        try {
            // 1. Kullanıcı tercihlerini yükle
            this._loadUserPreferences();
            
            // 2. Dil ve tema ayarla
            this._applyLanguage(this.state.language);
            this._applyTheme(this.state.theme);
            
            // 3. DOM bileşenlerini bul
            this._initComponents();
            
            // 4. Event listener'ları kur
            this._setupEventListeners();
            
            // 5. Varsayılan sayfayı yükle
            this.navigateTo('home');
            
            // 6. Offline kontrolü
            this._checkOnlineStatus();
            
            // 7. Auto-save başlat
            this._startAutoSave();
            
            console.log('✅ Uygulama başlatıldı!');
            this.showNotification('Uygulama başlatıldı', 'success');
            
        } catch (error) {
            console.error('Uygulama başlatılırken hata:', error);
            this.showNotification('Uygulama başlatılırken hata oluştu', 'error');
        }
    },

    /**
     * SAYFAYA GİT (SPA Navigasyon)
     */
    navigateTo: function(page, params = {}) {
        try {
            // Loading göster (sadece içerik alanında)
            this.showLoading('.main-content');
            
            // Önceki sayfayı kaydet
            this.state.previousPage = this.state.currentPage;
            this.state.currentPage = page;
            
            // URL hash'ini güncelle
            window.location.hash = page;
            
            // Sayfa içeriğini yükle
            setTimeout(() => {
                this._loadPageContent(page, params);
                this.hideLoading();
            }, 300);
            
            // Aktif menü öğesini güncelle
            this._updateActiveNavItem(page);
            
        } catch (error) {
            console.error(`Sayfa yüklenirken hata (${page}):`, error);
            this.showNotification('Sayfa yüklenirken hata oluştu', 'error');
            this.hideLoading();
        }
    },

    /**
     * BİLDİRİM GÖSTER (Üstte kaybolan banner)
     */
    showNotification: function(message, type = 'info') {
        try {
            const container = this.components.notificationContainer;
            if (!container) return;
            
            const notificationId = 'notification-' + Date.now();
            const typeClass = `notification-${type}`;
            
            const notificationHTML = `
                <div id="${notificationId}" class="notification ${typeClass}">
                    <div class="notification-content">
                        <i class="fas ${this._getNotificationIcon(type)}"></i>
                        <span>${message}</span>
                    </div>
                    <button class="notification-close" onclick="App._closeNotification('${notificationId}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Eski bildirimleri temizle
            const existingNotifications = container.querySelectorAll('.notification');
            existingNotifications.forEach(notification => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            });
            
            // Yeni bildirimi ekle
            container.innerHTML = notificationHTML + container.innerHTML;
            
            // Otomatik kapanma
            setTimeout(() => {
                this._closeNotification(notificationId);
            }, this.config.notificationDuration);
            
        } catch (error) {
            console.error('Bildirim gösterilirken hata:', error);
        }
    },

    /**
     * LOADING GÖSTER (Sadece belirtilen alanda)
     */
    showLoading: function(selector = '.main-content') {
        try {
            this.state.isLoading = true;
            
            const targetElement = document.querySelector(selector);
            if (!targetElement) return;
            
            // Loading container oluştur
            const loadingId = 'loading-' + Date.now();
            const loadingHTML = `
                <div id="${loadingId}" class="loading-container">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>${this.translate('loading')}</p>
                    </div>
                </div>
            `;
            
            // Mevcut loading varsa kaldır
            const existingLoading = targetElement.querySelector('.loading-container');
            if (existingLoading) {
                existingLoading.remove();
            }
            
            // Yeni loading ekle
            targetElement.style.position = 'relative';
            targetElement.insertAdjacentHTML('afterbegin', loadingHTML);
            
        } catch (error) {
            console.error('Loading gösterilirken hata:', error);
        }
    },

    /**
     * LOADING GİZLE
     */
    hideLoading: function() {
        try {
            this.state.isLoading = false;
            
            // Tüm loading container'larını kaldır
            document.querySelectorAll('.loading-container').forEach(loading => {
                loading.classList.add('fade-out');
                setTimeout(() => loading.remove(), 300);
            });
            
        } catch (error) {
            console.error('Loading gizlenirken hata:', error);
        }
    },

    /**
     * FORM VALIDATION (Real-time + kırmızı çerçeve)
     */
    setupFormValidation: function(formId) {
        try {
            const form = document.getElementById(formId);
            if (!form) return;
            
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('input', (e) => {
                    this._validateField(e.target);
                });
                
                // Blur event'inde validation
                input.addEventListener('blur', (e) => {
                    this._validateField(e.target);
                });
                
                // Form submit'inde validation
                form.addEventListener('submit', (e) => {
                    if (!this._validateForm(form)) {
                        e.preventDefault();
                        this.showNotification('Lütfen tüm zorunlu alanları doldurun', 'error');
                    }
                });
            });
            
        } catch (error) {
            console.error('Form validation kurulurken hata:', error);
        }
    },

    /**
     * HARİTA BAŞLAT (OpenStreetMap + Cluster + Heatmap)
     */
    initializeMap: function(containerId = 'map') {
        try {
            const mapContainer = document.getElementById(containerId);
            if (!mapContainer) {
                console.error('Harita container bulunamadı:', containerId);
                return;
            }
            
            // OpenStreetMap tile layer
            const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            });
            
            // Uydu görünümü (isteğe bağlı)
            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles © Esri',
                maxZoom: 19
            });
            
            // Harita oluştur
            this.map.instance = L.map(containerId, {
                center: [39.9208, 32.8541], // Türkiye merkez
                zoom: 6,
                layers: [osmLayer],
                fullscreenControl: true
            });
            
            // Layer'ları kaydet
            this.map.layers.osm = osmLayer;
            this.map.layers.satellite = satelliteLayer;
            
            // Layer kontrolü
            const baseLayers = {
                "OpenStreetMap": osmLayer,
                "Uydu Görünümü": satelliteLayer
            };
            
            L.control.layers(baseLayers).addTo(this.map.instance);
            
            // Marker cluster grubu oluştur
            this.map.cluster = L.markerClusterGroup({
                maxClusterRadius: 50,
                iconCreateFunction: function(cluster) {
                    const count = cluster.getChildCount();
                    let size = 'small';
                    
                    if (count > 100) size = 'large';
                    else if (count > 10) size = 'medium';
                    
                    return L.divIcon({
                        html: `<div class="cluster-${size}">${count}</div>`,
                        className: 'marker-cluster',
                        iconSize: L.point(40, 40)
                    });
                }
            });
            
            this.map.instance.addLayer(this.map.cluster);
            
            // Heatmap layer (başlangıçta gizli)
            this.map.heatmap = L.heatLayer([], {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
            });
            
            console.log('✅ Harita başlatıldı');
            
        } catch (error) {
            console.error('Harita başlatılırken hata:', error);
            this.showNotification('Harita yüklenirken hata oluştu', 'error');
        }
    },

    /**
     * HARİTAYA MARKER EKLE
     */
    addMarkerToMap: function(bildirim) {
        try {
            if (!this.map.instance || !bildirim.koordinatlar) return;
            
            const lat = bildirim.koordinatlar.lat || 39.9208;
            const lng = bildirim.koordinatlar.lng || 32.8541;
            
            // Marker icon'u (probleme göre renk)
            const iconColor = this._getPriorityColor(bildirim.oncelik);
            const icon = L.divIcon({
                html: `<div class="custom-marker" style="background-color: ${iconColor}">
                         <i class="fas ${this._getProblemIcon(bildirim.problemTipi)}"></i>
                       </div>`,
                className: 'custom-marker-container',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });
            
            // Marker oluştur
            const marker = L.marker([lat, lng], { icon: icon })
                .addTo(this.map.cluster)
                .bindPopup(this._createMarkerPopup(bildirim));
            
            // Marker'ı kaydet
            marker.bildirimId = bildirim.id;
            this.map.markers.push(marker);
            
            // Heatmap için veri ekle
            if (this.map.heatmap) {
                const heatPoints = this.map.heatmap.getLatLngs();
                heatPoints.push([lat, lng, 0.5]); // Yoğunluk değeri
                this.map.heatmap.setLatLngs(heatPoints);
            }
            
            return marker;
            
        } catch (error) {
            console.error('Marker eklenirken hata:', error);
        }
    },

    /**
     * HEATMAP GÖSTER/GİZLE
     */
    toggleHeatmap: function(show = true) {
        try {
            if (!this.map.instance || !this.map.heatmap) return;
            
            if (show) {
                this.map.instance.addLayer(this.map.heatmap);
            } else {
                this.map.instance.removeLayer(this.map.heatmap);
            }
            
        } catch (error) {
            console.error('Heatmap değiştirilirken hata:', error);
        }
    },

    /**
     * EXCEL EXPORT (Tek tıkla + filtreleme + tarih aralığı)
     */
    exportToExcel: function(options = {}) {
        try {
            this.showLoading();
            
            let bildirimler = [];
            
            // Filtreleme seçeneklerine göre veri getir
            if (options.filtered && this.state.currentFilters) {
                bildirimler = Database.filtreliBildirimGetir(this.state.currentFilters);
            } else if (options.selectedIds && options.selectedIds.length > 0) {
                const allBildirimler = Database.tumBildirimleriGetir();
                bildirimler = allBildirimler.filter(b => options.selectedIds.includes(b.id));
            } else if (options.dateRange && options.dateRange.from && options.dateRange.to) {
                bildirimler = Database.filtreliBildirimGetir({
                    baslangicTarihi: options.dateRange.from,
                    bitisTarihi: options.dateRange.to
                });
            } else {
                // Tüm veriler
                bildirimler = Database.tumBildirimleriGetir();
            }
            
            // Excel verisini hazırla
            const excelData = Database.excelIcinHazirla();
            
            // Worksheet oluştur
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            
            // Workbook oluştur
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bildirimler");
            
            // Dosya adı
            const fileName = options.fileName || `altyapi-bildirimler-${new Date().toISOString().split('T')[0]}.xlsx`;
            
            // Excel dosyasını indir
            XLSX.writeFile(workbook, fileName);
            
            this.hideLoading();
            this.showNotification(`${bildirimler.length} bildirim Excel'e aktarıldı`, 'success');
            
            return {
                success: true,
                count: bildirimler.length,
                fileName: fileName
            };
            
        } catch (error) {
            console.error('Excel export hatası:', error);
            this.hideLoading();
            this.showNotification('Excel aktarımı başarısız', 'error');
            
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * FİLTRELEME SİSTEMİ
     */
    setupFilterSystem: function() {
        try {
            // Şehir filtreleme
            const citySelect = document.getElementById('filter-city');
            if (citySelect) {
                citySelect.innerHTML = '<option value="">Tüm Şehirler</option>';
                const sehirler = VeriYoneticisi.sehirleriGetir();
                sehirler.forEach(sehir => {
                    citySelect.innerHTML += `<option value="${sehir}">${sehir}</option>`;
                });
                
                citySelect.addEventListener('change', (e) => {
                    this.state.currentFilters.il = e.target.value || null;
                    this._applyFilters();
                });
            }
            
            // Tarih aralığı filtreleme
            const dateFrom = document.getElementById('filter-date-from');
            const dateTo = document.getElementById('filter-date-to');
            
            if (dateFrom && dateTo) {
                // Bugünün tarihini varsayılan yap
                const today = new Date().toISOString().split('T')[0];
                dateFrom.max = today;
                dateTo.max = today;
                
                dateFrom.addEventListener('change', () => this._updateDateFilters());
                dateTo.addEventListener('change', () => this._updateDateFilters());
            }
            
            // Durum filtreleme
            const statusSelect = document.getElementById('filter-status');
            if (statusSelect) {
                statusSelect.addEventListener('change', (e) => {
                    this.state.currentFilters.durum = e.target.value || null;
                    this._applyFilters();
                });
            }
            
            // Öncelik filtreleme
            const prioritySelect = document.getElementById('filter-priority');
            if (prioritySelect) {
                prioritySelect.addEventListener('change', (e) => {
                    this.state.currentFilters.oncelik = e.target.value || null;
                    this._applyFilters();
                });
            }
            
            // Filtreleri uygula butonu
            const applyFiltersBtn = document.getElementById('apply-filters');
            if (applyFiltersBtn) {
                applyFiltersBtn.addEventListener('click', () => this._applyFilters());
            }
            
            // Filtreleri sıfırla butonu
            const resetFiltersBtn = document.getElementById('reset-filters');
            if (resetFiltersBtn) {
                resetFiltersBtn.addEventListener('click', () => this._resetFilters());
            }
            
        } catch (error) {
            console.error('Filtre sistemi kurulurken hata:', error);
        }
    },

    /**
     * BİLDİRİM TAKİP SİSTEMİ
     */
    setupTrackingSystem: function() {
        try {
            // Takip kodu arama
            const trackInput = document.getElementById('tracking-code');
            const trackButton = document.getElementById('track-button');
            
            if (trackInput && trackButton) {
                trackButton.addEventListener('click', () => {
                    const code = trackInput.value.trim();
                    if (!code) {
                        this.showNotification('Lütfen takip kodu girin', 'warning');
                        return;
                    }
                    
                    this.trackReport(code);
                });
                
                // Enter tuşu ile arama
                trackInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        trackButton.click();
                    }
                });
            }
            
            // QR kod oluşturma
            const generateQRBtn = document.getElementById('generate-qr');
            if (generateQRBtn) {
                generateQRBtn.addEventListener('click', () => {
                    const code = document.getElementById('report-id').value;
                    if (code) {
                        this.generateQRCode(code, 'qrcode-container');
                    }
                });
            }
            
        } catch (error) {
            console.error('Takip sistemi kurulurken hata:', error);
        }
    },

    /**
     * BİLDİRİM TAKİP ET
     */
    trackReport: function(trackingCode) {
        try {
            const bildirimler = Database.tumBildirimleriGetir();
            const bildirim = bildirimler.find(b => 
                b.id === trackingCode || b.takipKodu === trackingCode
            );
            
            if (!bildirim) {
                this.showNotification('Takip kodu bulunamadı', 'error');
                return null;
            }
            
            // Görüntülenme sayısını artır
            Database.goruntulenmeArtir(bildirim.id);
            
            // Bildirim detayını göster
            this.showReportDetails(bildirim);
            
            return bildirim;
            
        } catch (error) {
            console.error('Bildirim takip edilirken hata:', error);
            this.showNotification('Takip işlemi başarısız', 'error');
            return null;
        }
    },

    /**
     * BİLDİRİM DETAYLARINI GÖSTER
     */
    showReportDetails: function(bildirim) {
        try {
            const modalHTML = `
                <div class="report-details-modal">
                    <div class="modal-header">
                        <h3>Bildirim Detayları</h3>
                        <button class="close-modal" onclick="App.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="report-info">
                            <div class="info-row">
                                <span class="label">Takip Kodu:</span>
                                <span class="value">${bildirim.id}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Tarih:</span>
                                <span class="value">${this._formatDate(bildirim.olusturmaTarihi)}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Konum:</span>
                                <span class="value">${bildirim.il} > ${bildirim.ilce} > ${bildirim.mahalle} > ${bildirim.sokak}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Problem:</span>
                                <span class="value">${bildirim.problemTipi} ${bildirim.problemEmoji}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Öncelik:</span>
                                <span class="value priority-${bildirim.oncelik.toLowerCase()}">${bildirim.oncelik}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Durum:</span>
                                <span class="value status-${bildirim.durum}">${this._getStatusName(bildirim.durum)}</span>
                            </div>
                            ${bildirim.aciklama ? `
                            <div class="info-row">
                                <span class="label">Açıklama:</span>
                                <span class="value">${bildirim.aciklama}</span>
                            </div>` : ''}
                            
                            ${bildirim.fotograf ? `
                            <div class="info-row">
                                <span class="label">Fotoğraf:</span>
                                <div class="photo-preview">
                                    <img src="${bildirim.fotograf}" alt="Bildirim Fotoğrafı">
                                </div>
                            </div>` : ''}
                            
                            <div class="status-history">
                                <h4>Durum Geçmişi</h4>
                                <div class="timeline">
                                    ${bildirim.durumGecmisi.map((item, index) => `
                                        <div class="timeline-item">
                                            <div class="timeline-marker"></div>
                                            <div class="timeline-content">
                                                <span class="timeline-status">${this._getStatusName(item.durum)}</span>
                                                <span class="timeline-date">${this._formatDate(item.tarih)}</span>
                                                ${item.aciklama ? `<p class="timeline-desc">${item.aciklama}</p>` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.closeModal()">Kapat</button>
                        <button class="btn btn-primary" onclick="App.generateQRCode('${bildirim.id}', 'modal-qrcode')">
                            <i class="fas fa-qrcode"></i> QR Kod Oluştur
                        </button>
                    </div>
                    <div id="modal-qrcode" class="qrcode-container"></div>
                </div>
            `;
            
            this.showModal('reportDetails', modalHTML);
            
        } catch (error) {
            console.error('Bildirim detayları gösterilirken hata:', error);
        }
    },

    /**
     * QR KOD OLUŞTUR
     */
    generateQRCode: function(text, containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // QRCode.js kütüphanesi yüklü mü kontrol et
            if (typeof QRCode === 'undefined') {
                console.error('QRCode kütüphanesi yüklenmedi');
                this.showNotification('QR kod oluşturulamadı', 'error');
                return;
            }
            
            // Eski QR kodu temizle
            container.innerHTML = '';
            
            // Yeni QR kodu oluştur
            new QRCode(container, {
                text: text,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // İndirme bağlantısı ekle
            const downloadLink = document.createElement('a');
            downloadLink.href = container.querySelector('img').src;
            downloadLink.download = `qrcode-${text}.png`;
            downloadLink.innerHTML = '<i class="fas fa-download"></i> QR Kodu İndir';
            downloadLink.className = 'btn btn-secondary qr-download';
            downloadLink.style.marginTop = '10px';
            downloadLink.style.display = 'block';
            
            container.appendChild(downloadLink);
            
        } catch (error) {
            console.error('QR kod oluşturulurken hata:', error);
            this.showNotification('QR kod oluşturulamadı', 'error');
        }
    },

    /**
     * TEMA DEĞİŞTİR (Koyu/Açık)
     */
    toggleTheme: function() {
        try {
            const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
            this.state.theme = newTheme;
            
            // DOM'a uygula
            this._applyTheme(newTheme);
            
            // Local Storage'a kaydet
            this._saveUserPreferences();
            
            this.showNotification(`Tema ${newTheme === 'light' ? 'açık' : 'koyu'} moda geçirildi`, 'success');
            
        } catch (error) {
            console.error('Tema değiştirilirken hata:', error);
        }
    },

    /**
     * DİL DEĞİŞTİR (Türkçe/Kürtçe)
     */
    changeLanguage: function(lang) {
        try {
            if (!this.config.supportedLanguages.includes(lang)) {
                console.error('Desteklenmeyen dil:', lang);
                return;
            }
            
            this.state.language = lang;
            
            // Çevirileri uygula
            this._applyLanguage(lang);
            
            // Local Storage'a kaydet
            this._saveUserPreferences();
            
            this.showNotification(`Dil ${lang === 'tr' ? 'Türkçe' : 'Kürtçe'} olarak değiştirildi`, 'success');
            
        } catch (error) {
            console.error('Dil değiştirilirken hata:', error);
        }
    },

    /**
     * ÇEVİRİ YAP
     */
    translate: function(key) {
        try {
            const lang = this.state.language;
            const translation = this.translations[lang];
            
            if (!translation) {
                console.error('Çeviri bulunamadı:', lang);
                return key;
            }
            
            return translation[key] || this.translations.tr[key] || key;
            
        } catch (error) {
            console.error('Çeviri yapılırken hata:', error);
            return key;
        }
    },

    /**
     * MODAL GÖSTER
     */
    showModal: function(modalId, content) {
        try {
            // Modal container oluştur veya bul
            let modalContainer = document.getElementById('modal-container');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'modal-container';
                modalContainer.className = 'modal-container';
                document.body.appendChild(modalContainer);
            }
            
            // Modal içeriğini ayarla
            modalContainer.innerHTML = content;
            modalContainer.style.display = 'flex';
            
            // ESC tuşu ile kapatma
            document.addEventListener('keydown', this._handleEscKey);
            
            // Dışarı tıklayarak kapatma
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    this.closeModal();
                }
            });
            
            this.components.modals[modalId] = modalContainer;
            
        } catch (error) {
            console.error('Modal gösterilirken hata:', error);
        }
    },

    /**
     * MODAL KAPAT
     */
    closeModal: function() {
        try {
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.style.display = 'none';
                modalContainer.innerHTML = '';
            }
            
            // ESC tuşu listener'ını kaldır
            document.removeEventListener('keydown', this._handleEscKey);
            
        } catch (error) {
            console.error('Modal kapatılırken hata:', error);
        }
    },

    // ========== PRIVATE METHODS ==========

    /**
     * BİLEŞENLERİ BAŞLAT
     * @private
     */
    _initComponents: function() {
        try {
            this.components = {
                header: document.querySelector('.main-header'),
                mainContent: document.querySelector('.main-content'),
                footer: document.querySelector('.main-footer'),
                notificationContainer: document.querySelector('.notification-container'),
                loadingOverlay: document.querySelector('.loading-overlay')
            };
            
            // Notification container yoksa oluştur
            if (!this.components.notificationContainer) {
                const notificationContainer = document.createElement('div');
                notificationContainer.className = 'notification-container';
                document.body.insertBefore(notificationContainer, document.body.firstChild);
                this.components.notificationContainer = notificationContainer;
            }
            
        } catch (error) {
            console.error('Bileşenler başlatılırken hata:', error);
        }
    },

    /**
     * EVENT LISTENER'LARI KUR
     * @private
     */
    _setupEventListeners: function() {
        try {
            // Menü tıklamaları
            document.addEventListener('click', (e) => {
                const navLink = e.target.closest('[data-page]');
                if (navLink) {
                    e.preventDefault();
                    const page = navLink.getAttribute('data-page');
                    this.navigateTo(page);
                }
            });
            
            // Geri tuşu (SPA için)
            window.addEventListener('popstate', () => {
                const page = window.location.hash.replace('#', '') || 'home';
                this.navigateTo(page);
            });
            
            // Online/offline durumu
            window.addEventListener('online', () => {
                this.showNotification('İnternet bağlantısı sağlandı', 'success');
                this.config.offlineMode = false;
            });
            
            window.addEventListener('offline', () => {
                this.showNotification('İnternet bağlantısı kesildi', 'warning');
                this.config.offlineMode = true;
            });
            
            // Tema değiştirme butonu
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }
            
            // Dil değiştirme butonları
            document.querySelectorAll('[data-language]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.target.getAttribute('data-language');
                    this.changeLanguage(lang);
                });
            });
            
            // Otomatik doldurma formları
            this._setupAutoComplete();
            
        } catch (error) {
            console.error('Event listener\'lar kurulurken hata:', error);
        }
    },

    /**
     * SAYFA İÇERİĞİ YÜKLE (SPA)
     * @private
     */
    _loadPageContent: function(page, params) {
        try {
            const mainContent = this.components.mainContent;
            if (!mainContent) return;
            
            let pageHTML = '';
            
            switch (page) {
                case 'home':
                    pageHTML = this._getHomePageHTML();
                    break;
                    
                case 'report':
                    pageHTML = this._getReportPageHTML();
                    break;
                    
                case 'map':
                    pageHTML = this._getMapPageHTML();
                    break;
                    
                case 'admin':
                    pageHTML = this._getAdminPageHTML();
                    break;
                    
                default:
                    pageHTML = this._getHomePageHTML();
            }
            
            // İçeriği güncelle
            mainContent.innerHTML = pageHTML;
            
            // Sayfaya özel JS'yi çalıştır
            setTimeout(() => {
                this._initPageSpecificFunctions(page, params);
            }, 100);
            
        } catch (error) {
            console.error('Sayfa içeriği yüklenirken hata:', error);
            throw error;
        }
    },

    /**
     * ANA SAYFA HTML
     * @private
     */
    _getHomePageHTML: function() {
        return `
            <section class="hero">
                <div class="container">
                    <h1>${this.translate('appTitle')}</h1>
                    <p>Doğu ve Güneydoğu bölgelerindeki anlaşmalı mahallelerdeki altyapı sorunlarını bildirin</p>
                    
                    <div class="hero-buttons">
                        <button class="btn btn-primary" data-page="report">
                            <i class="fas fa-plus-circle"></i> ${this.translate('report')}
                        </button>
                        <button class="btn btn-secondary" data-page="map">
                            <i class="fas fa-map"></i> ${this.translate('mapView')}
                        </button>
                    </div>
                </div>
            </section>
            
            <section class="stats">
                <div class="container">
                    <h2>${this.translate('statistics')}</h2>
                    <div class="stats-grid" id="statsContainer">
                        <!-- JS ile doldurulacak -->
                    </div>
                </div>
            </section>
            
            <section class="recent-reports">
                <div class="container">
                    <div class="section-header">
                        <h2>${this.translate('recentReports')}</h2>
                        <a href="#" data-page="map">${this.translate('viewAll')}</a>
                    </div>
                    <div class="reports-list" id="recentReportsContainer">
                        <!-- JS ile doldurulacak -->
                    </div>
                </div>
            </section>
        `;
    },

    /**
     * BİLDİRİM SAYFASI HTML
     * @private
     */
    _getReportPageHTML: function() {
        return `
            <section class="report-form-section">
                <div class="container">
                    <div class="section-header">
                        <h1>${this.translate('report')}</h1>
                        <p>7 adımda bildiriminizi tamamlayın</p>
                    </div>
                    
                    <div class="form-wizard">
                        <!-- Adım göstergesi -->
                        <div class="wizard-steps" id="wizardSteps">
                            <!-- JS ile doldurulacak -->
                        </div>
                        
                        <!-- Form içeriği -->
                        <div class="wizard-content" id="wizardContent">
                            <!-- JS ile doldurulacak -->
                        </div>
                        
                        <!-- Navigasyon butonları -->
                        <div class="wizard-navigation">
                            <button class="btn btn-secondary" id="prevStep">${this.translate('back')}</button>
                            <button class="btn btn-primary" id="nextStep">${this.translate('next')}</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    /**
     * HARİTA SAYFASI HTML
     * @private
     */
    _getMapPageHTML: function() {
        return `
            <section class="map-section">
                <div class="container">
                    <div class="map-header">
                        <h1>${this.translate('mapView')}</h1>
                        
                        <div class="map-controls">
                            <div class="filter-controls">
                                <select id="filter-city" class="form-select">
                                    <option value="">${this.translate('selectCity')}</option>
                                </select>
                                
                                <select id="filter-status" class="form-select">
                                    <option value="">${this.translate('all')}</option>
                                    <option value="pending">${this.translate('pending')}</option>
                                    <option value="approved">${this.translate('approved')}</option>
                                    <option value="in_progress">${this.translate('inProgress')}</option>
                                    <option value="completed">${this.translate('completed')}</option>
                                </select>
                                
                                <button class="btn btn-secondary" id="apply-filters">
                                    ${this.translate('applyFilters')}
                                </button>
                            </div>
                            
                            <div class="map-tools">
                                <button class="btn btn-icon" id="toggle-cluster" title="${this.translate('clusterView')}">
                                    <i class="fas fa-layer-group"></i>
                                </button>
                                <button class="btn btn-icon" id="toggle-heatmap" title="${this.translate('heatmap')}">
                                    <i class="fas fa-fire"></i>
                                </button>
                                <button class="btn btn-icon" id="toggle-fullscreen" title="${this.translate('fullscreen')}">
                                    <i class="fas fa-expand"></i>
                                </button>
                                <button class="btn btn-primary" id="export-map-data">
                                    <i class="fas fa-download"></i> ${this.translate('export')}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="map-container">
                        <div class="map-sidebar">
                            <div class="search-box">
                                <input type="text" id="map-search" placeholder="${this.translate('search')}...">
                                <button class="btn btn-icon">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                            
                            <div class="reports-list" id="mapReportsList">
                                <!-- JS ile doldurulacak -->
                            </div>
                        </div>
                        
                        <div class="map-view">
                            <div id="map"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    /**
     * SAYFAYA ÖZEL FONKSİYONLAR
     * @private
     */
    _initPageSpecificFunctions: function(page, params) {
        try {
            switch (page) {
                case 'home':
                    this._loadHomePageData();
                    break;
                    
                case 'report':
                    this._initReportWizard();
                    break;
                    
                case 'map':
                    this._initMapPage();
                    break;
                    
                case 'admin':
                    this._initAdminPage();
                    break;
            }
        } catch (error) {
            console.error(`Sayfa fonksiyonları başlatılırken hata (${page}):`, error);
        }
    },

    /**
     * FORM DOĞRULAMA
     * @private
     */
    _validateField: function(field) {
        try {
            const isValid = field.checkValidity();
            
            // Kırmızı çerçeve
            if (!isValid) {
                field.classList.add('invalid');
                
                // Hata mesajı
                let errorMessage = this.translate('requiredField');
                
                if (field.type === 'email' && field.value) {
                    errorMessage = this.translate('invalidEmail');
                }
                
                if (field.type === 'tel' && field.value) {
                    errorMessage = this.translate('invalidPhone');
                }
                
                // Hata mesajını göster
                this._showFieldError(field, errorMessage);
                
            } else {
                field.classList.remove('invalid');
                this._hideFieldError(field);
            }
            
            return isValid;
            
        } catch (error) {
            console.error('Alan doğrulanırken hata:', error);
            return false;
        }
    },

    /**
     * ALAN HATA MESAJI GÖSTER
     * @private
     */
    _showFieldError: function(field, message) {
        try {
            // Mevcut hata mesajını kaldır
            this._hideFieldError(field);
            
            // Hata mesajı oluştur
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.color = '#dc2626';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            
            // Alanın ardına ekle
            field.parentNode.insertBefore(errorElement, field.nextSibling);
            
        } catch (error) {
            console.error('Hata mesajı gösterilirken hata:', error);
        }
    },

    /**
     * ALAN HATA MESAJINI GİZLE
     * @private
     */
    _hideFieldError: function(field) {
        try {
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        } catch (error) {
            console.error('Hata mesajı gizlenirken hata:', error);
        }
    },

    /**
     * OTOMATİK DOLDURMA KUR
     * @private
     */
    _setupAutoComplete: function() {
        try {
            // Şehir seçimine göre ilçeleri doldur
            document.addEventListener('change', (e) => {
                if (e.target.id === 'city-select') {
                    const city = e.target.value;
                    const districtSelect = document.getElementById('district-select');
                    
                    if (districtSelect && city) {
                        const districts = VeriYoneticisi.ilceleriGetir(city);
                        districtSelect.innerHTML = '<option value="">İlçe Seçin</option>';
                        districts.forEach(district => {
                            districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
                        });
                    }
                }
                
                // İlçeye göre mahalleleri doldur
                if (e.target.id === 'district-select') {
                    const city = document.getElementById('city-select').value;
                    const district = e.target.value;
                    const neighborhoodSelect = document.getElementById('neighborhood-select');
                    
                    if (neighborhoodSelect && city && district) {
                        const neighborhoods = VeriYoneticisi.mahalleleriGetir(city, district);
                        neighborhoodSelect.innerHTML = '<option value="">Mahalle Seçin</option>';
                        neighborhoods.forEach(neighborhood => {
                            neighborhoodSelect.innerHTML += `<option value="${neighborhood}">${neighborhood}</option>`;
                        });
                    }
                }
                
                // Mahalleye göre sokakları doldur
                if (e.target.id === 'neighborhood-select') {
                    const city = document.getElementById('city-select').value;
                    const district = document.getElementById('district-select').value;
                    const neighborhood = e.target.value;
                    const streetSelect = document.getElementById('street-select');
                    
                    if (streetSelect && city && district && neighborhood) {
                        const streets = VeriYoneticisi.sokaklariGetir(city, district, neighborhood);
                        streetSelect.innerHTML = '<option value="">Sokak Seçin</option>';
                        streets.forEach(street => {
                            streetSelect.innerHTML += `<option value="${street}">${street}</option>`;
                        });
                    }
                }
            });
            
        } catch (error) {
            console.error('Otomatik doldurma kurulurken hata:', error);
        }
    },

    /**
     * KULLANICI TERCIHLERINI YÜKLE
     * @private
     */
    _loadUserPreferences: function() {
        try {
            const preferences = localStorage.getItem('user_preferences');
            if (preferences) {
                const parsed = JSON.parse(preferences);
                this.state.userPreferences = parsed;
                
                // Dil
                if (parsed.language && this.config.supportedLanguages.includes(parsed.language)) {
                    this.state.language = parsed.language;
                }
                
                // Tema
                if (parsed.theme === 'light' || parsed.theme === 'dark') {
                    this.state.theme = parsed.theme;
                }
            }
        } catch (error) {
            console.error('Kullanıcı tercihleri yüklenirken hata:', error);
        }
    },

    /**
     * KULLANICI TERCIHLERINI KAYDET
     * @private
     */
    _saveUserPreferences: function() {
        try {
            const preferences = {
                language: this.state.language,
                theme: this.state.theme,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('user_preferences', JSON.stringify(preferences));
            
        } catch (error) {
            console.error('Kullanıcı tercihleri kaydedilirken hata:', error);
        }
    },

    /**
     * DİL UYGULA
     * @private
     */
    _applyLanguage: function(lang) {
        try {
            // Tüm çevrilebilir öğeleri bul
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.translate(key);
                
                if (translation) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            });
            
            // Dil butonlarını güncelle
            document.querySelectorAll('[data-language]').forEach(btn => {
                if (btn.getAttribute('data-language') === lang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
        } catch (error) {
            console.error('Dil uygulanırken hata:', error);
        }
    },

    /**
     * TEMA UYGULA
     * @private
     */
    _applyTheme: function(theme) {
        try {
            document.documentElement.setAttribute('data-theme', theme);
            
            // Tema butonunu güncelle
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                const icon = theme === 'light' ? 'fa-moon' : 'fa-sun';
                themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
                themeToggle.title = theme === 'light' ? 'Koyu Tema' : 'Açık Tema';
            }
            
        } catch (error) {
            console.error('Tema uygulanırken hata:', error);
        }
    },

    /**
     * ONLINE DURUM KONTROLÜ
     * @private
     */
    _checkOnlineStatus: function() {
        this.config.offlineMode = !navigator.onLine;
        
        if (this.config.offlineMode) {
            this.showNotification('İnternet bağlantısı yok. Bazı özellikler kısıtlı olabilir.', 'warning');
        }
    },

    /**
     * OTOMATİK KAYDETMEYİ BAŞLAT
     * @private
     */
    _startAutoSave: function() {
        setInterval(() => {
            if (this.state.formDraft) {
                this._saveFormDraft();
            }
        }, this.config.autoSaveInterval);
    },

    /**
     * FORM TASLAĞINI KAYDET
     * @private
     */
    _saveFormDraft: function() {
        try {
            localStorage.setItem('form_draft', JSON.stringify(this.state.formDraft));
        } catch (error) {
            console.error('Form taslağı kaydedilirken hata:', error);
        }
    },

    /**
     * BİLDİRİM İKONU AL
     * @private
     */
    _getNotificationIcon: function(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        return icons[type] || 'fa-info-circle';
    },

    /**
     * BİLDİRİM KAPAT
     * @private
     */
    _closeNotification: function(notificationId) {
        try {
            const notification = document.getElementById(notificationId);
            if (notification) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Bildirim kapatılırken hata:', error);
        }
    },

    /**
     * ESC TUŞU İLE MODAL KAPATMA
     * @private
     */
    _handleEscKey: function(e) {
        if (e.key === 'Escape') {
            App.closeModal();
        }
    },

    /**
     * ÖNCELİK RENGİ AL
     * @private
     */
    _getPriorityColor: function(priority) {
        const colors = {
            'Acil': '#dc2626',
            'Yüksek': '#f97316',
            'Orta': '#f59e0b',
            'Düşük': '#10b981'
        };
        
        return colors[priority] || '#6b7280';
    },

    /**
     * PROBLEM İKONU AL
     * @private
     */
    _getProblemIcon: function(problemType) {
        const icons = {
            'Yol Bozukluğu': 'fa-road',
            'Su Baskını': 'fa-water',
            'Elektrik Kesintisi': 'fa-bolt',
            'Çöp Toplama': 'fa-trash',
            'Trafik Lambası': 'fa-traffic-light',
            'Aydınlatma': 'fa-lightbulb',
            'Park/Bahçe': 'fa-tree',
            'İnşaat Molozu': 'fa-hard-hat',
            'İçme Suyu': 'fa-tint',
            'Kanalizasyon': 'fa-toilet',
            'Güvenlik': 'fa-shield-alt'
        };
        
        return icons[problemType] || 'fa-exclamation-triangle';
    },

    /**
     * MARKER POPUP OLUŞTUR
     * @private
     */
    _createMarkerPopup: function(bildirim) {
        return `
            <div class="map-popup">
                <h4>${bildirim.problemTipi}</h4>
                <p><strong>Konum:</strong> ${bildirim.mahalle}, ${bildirim.sokak}</p>
                <p><strong>Durum:</strong> <span class="status-${bildirim.durum}">${this._getStatusName(bildirim.durum)}</span></p>
                <p><strong>Tarih:</strong> ${this._formatDate(bildirim.olusturmaTarihi)}</p>
                <button class="btn btn-sm btn-primary" onclick="App.showReportDetails(${JSON.stringify(bildirim).replace(/"/g, '&quot;')})">
                    Detayları Gör
                </button>
            </div>
        `;
    },

    /**
     * DURUM ADI AL
     * @private
     */
    _getStatusName: function(statusCode) {
        const statusMap = {
            'pending': 'Beklemede',
            'approved': 'Onaylandı',
            'in_progress': 'Devam Ediyor',
            'completed': 'Tamamlandı',
            'rejected': 'Reddedildi'
        };
        
        return statusMap[statusCode] || statusCode;
    },

    /**
     * TARİH FORMATLA
     * @private
     */
    _formatDate: function(dateString) {
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        } catch (error) {
            return dateString;
        }
    },

    /**
     * AKTİF MENÜ ÖĞESİNİ GÜNCELLE
     * @private
     */
    _updateActiveNavItem: function(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    /**
     * FİLTRELERİ UYGULA
     * @private
     */
    _applyFilters: function() {
        try {
            const filters = this.state.currentFilters;
            const filteredReports = Database.filtreliBildirimGetir(filters);
            
            // Liste görünümünü güncelle
            this._updateReportsList(filteredReports);
            
            // Harita marker'larını güncelle
            this._updateMapMarkers(filteredReports);
            
            this.showNotification(`${filteredReports.length} bildirim bulundu`, 'info');
            
        } catch (error) {
            console.error('Filtreler uygulanırken hata:', error);
        }
    },

    /**
     * FİLTRELERİ SIFIRLA
     * @private
     */
    _resetFilters: function() {
        try {
            this.state.currentFilters = {};
            
            // Formları sıfırla
            document.querySelectorAll('.filter-controls select').forEach(select => {
                select.value = '';
            });
            
            document.getElementById('filter-date-from').value = '';
            document.getElementById('filter-date-to').value = '';
            
            // Tüm bildirimleri göster
            const allReports = Database.tumBildirimleriGetir();
            this._updateReportsList(allReports);
            this._updateMapMarkers(allReports);
            
            this.showNotification('Filtreler sıfırlandı', 'info');
            
        } catch (error) {
            console.error('Filtreler sıfırlanırken hata:', error);
        }
    },

    /**
     * TARİH FİLTRELERİNİ GÜNCELLE
     * @private
     */
    _updateDateFilters: function() {
        try {
            const dateFrom = document.getElementById('filter-date-from').value;
            const dateTo = document.getElementById('filter-date-to').value;
            
            if (dateFrom || dateTo) {
                this.state.currentFilters.baslangicTarihi = dateFrom || null;
                this.state.currentFilters.bitisTarihi = dateTo || null;
                
                this._applyFilters();
            }
        } catch (error) {
            console.error('Tarih filtreleri güncellenirken hata:', error);
        }
    }
};

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Global erişim
window.App = App;

console.log('✅ app.js yüklendi - SPA Uygulama Sistemi');
