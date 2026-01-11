/**
 * ANLAŞMALI MAHALLELER ALTYAPI SİSTEMİ
 * Local Storage Veritabanı Yönetimi
 * 
 * @description: Tüm bildirim verileri tarayıcının Local Storage'ında saklanır.
 * Veri yapısı: JSON formatında şifrelenmemiş
 * Yedekleme: JSON dosyası olarak indirilebilir/geri yüklenebilir
 */

const Database = {
    // VERİTABANI ANAHTARLARI
    DB_KEYS: {
        BILDIRIMLER: 'altyapi-bildirimler',
        SAYACLAR: 'altyapi-sayaclar',
        ARSIV: 'altyapi-arsiv',
        AYARLAR: 'altyapi-ayarlar'
    },

    // BİLDİRİM DURUMLARI
    DURUMLAR: {
        BEKLIYOR: 'pending',
        ONAYLANDI: 'approved',
        DEVAM_EDIYOR: 'in_progress',
        TAMAMLANDI: 'completed',
        REDDEDILDI: 'rejected'
    },

    // İLİŞKİLİ ŞEHİR KISALTMALARI
    SEHIR_KISALTMALARI: {
        'Diyarbakır': 'DB',
        'Erzurum': 'ERZ',
        'Şanlıurfa': 'URFA',
        'Gaziantep': 'GAZ',
        'Mardin': 'MRD',
        'Batman': 'BTM',
        'Siirt': 'Sİİ',
        'Şırnak': 'SİR',
        'Hakkari': 'HAK',
        'Van': 'VAN',
        'Muş': 'MUŞ',
        'Bitlis': 'BİT',
        'Bingöl': 'BİN',
        'Tunceli': 'TUN',
        'Elazığ': 'ELZ',
        'Malatya': 'MAL',
        'Adıyaman': 'ADY',
        'Kilis': 'KİL',
        'Osmaniye': 'OSM',
        'Hatay': 'HAT'
    },

    /**
     * YENİ BİLDİRİM EKLE
     * @param {Object} bildirimData - Bildirim verisi
     * @returns {Object} - Eklenen bildirim veya hata
     */
    bildirimEkle: function(bildirimData) {
        try {
            // 1. ZORUNLU ALAN KONTROLÜ
            const zorunluAlanlar = ['il', 'ilce', 'mahalle', 'sokak', 'problemTipi'];
            for (const alan of zorunluAlanlar) {
                if (!bildirimData[alan] || bildirimData[alan].trim() === '') {
                    return {
                        success: false,
                        error: `Zorunlu alan eksik: ${alan}`,
                        code: 'MISSING_REQUIRED_FIELD'
                    };
                }
            }

            // 2. BİLDİRİM ID'Sİ OLUŞTUR (Şehir-YılAyGün-SıraNo)
            const tarih = new Date();
            const tarihStr = tarih.toISOString().split('T')[0].replace(/-/g, '');
            const sehirKodu = this.SEHIR_KISALTMALARI[bildirimData.il] || 'GEN';
            
            // Sıra numarasını al/güncelle
            const sayac = this._siraNoAl(sehirKodu, tarihStr);
            const bildirimId = `${sehirKodu}-${tarihStr}-${sayac.toString().padStart(3, '0')}`;

            // 3. TAM BİLDİRİM OBJESİ OLUŞTUR
            const yeniBildirim = {
                // Sistem alanları
                id: bildirimId,
                takipKodu: bildirimId, // ID ile aynı
                olusturmaTarihi: tarih.toISOString(),
                sonGuncelleme: tarih.toISOString(),
                
                // Konum bilgileri
                il: bildirimData.il,
                ilce: bildirimData.ilce,
                mahalle: bildirimData.mahalle,
                sokak: bildirimData.sokak,
                sokakDetayi: bildirimData.sokakDetayi || '',
                
                // Problem bilgileri
                problemTipi: bildirimData.problemTipi,
                problemEmoji: bildirimData.problemEmoji || '⚠️',
                aciklama: bildirimData.aciklama || '',
                oncelik: bildirimData.oncelik || 'Orta',
                
                // İletişim ve medya
                fotograf: bildirimData.fotograf || '', // Base64 string
                fotografBoyut: bildirimData.fotograf ? Math.round(bildirimData.fotograf.length * 3 / 4) : 0,
                iletisimBilgisi: bildirimData.iletisimBilgisi || '',
                eposta: bildirimData.eposta || '',
                
                // Durum ve takip
                durum: this.DURUMLAR.BEKLIYOR,
                durumGecmisi: [{
                    durum: this.DURUMLAR.BEKLIYOR,
                    tarih: tarih.toISOString(),
                    aciklama: 'Bildirim oluşturuldu'
                }],
                
                // Koordinatlar (varsa)
                koordinatlar: bildirimData.koordinatlar || null,
                adres: bildirimData.adres || '',
                
                // Sistem metadata
                goruntulenmeSayisi: 0,
                sonGoruntulenme: null,
                etiketler: bildirimData.etiketler || []
            };

            // 4. FOTOĞRAF BOYUT KONTROLÜ (max 2MB Base64)
            if (yeniBildirim.fotografBoyut > 2 * 1024 * 1024) {
                return {
                    success: false,
                    error: 'Fotoğraf boyutu 2MB sınırını aşıyor',
                    code: 'PHOTO_TOO_LARGE'
                };
            }

            // 5. LOCAL STORAGE'A KAYDET
            const tumBildirimler = this.tumBildirimleriGetir();
            tumBildirimler.push(yeniBildirim);
            localStorage.setItem(this.DB_KEYS.BILDIRIMLER, JSON.stringify(tumBildirimler));

            // 6. SAYACI GÜNCELLE
            this._siraNoGuncelle(sehirKodu, tarihStr, sayac + 1);

            console.log(`✅ Yeni bildirim eklendi: ${bildirimId}`);
            
            return {
                success: true,
                data: yeniBildirim,
                message: 'Bildirim başarıyla kaydedildi'
            };

        } catch (error) {
            console.error('Bildirim eklenirken hata:', error);
            return {
                success: false,
                error: 'Sistem hatası: ' + error.message,
                code: 'SYSTEM_ERROR'
            };
        }
    },

    /**
     * TÜM BİLDİRİMLERİ GETİR (Arşiv hariç)
     * @returns {Array} - Tüm aktif bildirimler
     */
    tumBildirimleriGetir: function() {
        try {
            const bildirimler = localStorage.getItem(this.DB_KEYS.BILDIRIMLER);
            if (!bildirimler) return [];
            
            return JSON.parse(bildirimler);
        } catch (error) {
            console.error('Bildirimler getirilirken hata:', error);
            return [];
        }
    },

    /**
     * FİLTRELİ BİLDİRİM GETİR
     * @param {Object} filtreler - Filtreleme kriterleri
     * @returns {Array} - Filtrelenmiş bildirimler
     */
    filtreliBildirimGetir: function(filtreler = {}) {
        try {
            let bildirimler = this.tumBildirimleriGetir();
            
            // İl filtreleme
            if (filtreler.il) {
                bildirimler = bildirimler.filter(b => b.il === filtreler.il);
            }
            
            // İlçe filtreleme
            if (filtreler.ilce) {
                bildirimler = bildirimler.filter(b => b.ilce === filtreler.ilce);
            }
            
            // Mahalle filtreleme
            if (filtreler.mahalle) {
                bildirimler = bildirimler.filter(b => b.mahalle === filtreler.mahalle);
            }
            
            // Durum filtreleme
            if (filtreler.durum) {
                bildirimler = bildirimler.filter(b => b.durum === filtreler.durum);
            }
            
            // Problem tipi filtreleme
            if (filtreler.problemTipi) {
                bildirimler = bildirimler.filter(b => b.problemTipi === filtreler.problemTipi);
            }
            
            // Öncelik filtreleme
            if (filtreler.oncelik) {
                bildirimler = bildirimler.filter(b => b.oncelik === filtreler.oncelik);
            }
            
            // Tarih aralığı filtreleme
            if (filtreler.baslangicTarihi) {
                const baslangic = new Date(filtreler.baslangicTarihi);
                bildirimler = bildirimler.filter(b => new Date(b.olusturmaTarihi) >= baslangic);
            }
            
            if (filtreler.bitisTarihi) {
                const bitis = new Date(filtreler.bitisTarihi);
                bildirimler = bildirimler.filter(b => new Date(b.olusturmaTarihi) <= bitis);
            }
            
            // Sıralama
            if (filtreler.sirala) {
                switch (filtreler.sirala) {
                    case 'tarih_azalan':
                        bildirimler.sort((a, b) => new Date(b.olusturmaTarihi) - new Date(a.olusturmaTarihi));
                        break;
                    case 'tarih_artan':
                        bildirimler.sort((a, b) => new Date(a.olusturmaTarihi) - new Date(b.olusturmaTarihi));
                        break;
                    case 'oncelik':
                        const oncelikSiralama = { 'Acil': 4, 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };
                        bildirimler.sort((a, b) => oncelikSiralama[b.oncelik] - oncelikSiralama[a.oncelik]);
                        break;
                }
            }
            
            return bildirimler;
            
        } catch (error) {
            console.error('Filtreli bildirim getirilirken hata:', error);
            return [];
        }
    },

    /**
     * BİLDİRİM DURUMU GÜNCELLE
     * @param {string} bildirimId - Bildirim ID
     * @param {string} yeniDurum - Yeni durum
     * @param {string} aciklama - Durum değişikliği açıklaması
     * @returns {Object} - Güncelleme sonucu
     */
    durumGuncelle: function(bildirimId, yeniDurum, aciklama = '') {
        try {
            const bildirimler = this.tumBildirimleriGetir();
            const index = bildirimler.findIndex(b => b.id === bildirimId);
            
            if (index === -1) {
                return {
                    success: false,
                    error: 'Bildirim bulunamadı',
                    code: 'NOT_FOUND'
                };
            }
            
            // Eski durumu kaydet
            const eskiDurum = bildirimler[index].durum;
            
            // Durumu güncelle
            bildirimler[index].durum = yeniDurum;
            bildirimler[index].sonGuncelleme = new Date().toISOString();
            
            // Durum geçmişine ekle
            bildirimler[index].durumGecmisi.push({
                durum: yeniDurum,
                tarih: new Date().toISOString(),
                aciklama: aciklama || `${eskiDurum} → ${yeniDurum}`
            });
            
            // Tamamlandıysa tamamlama tarihini ekle
            if (yeniDurum === this.DURUMLAR.TAMAMLANDI) {
                bildirimler[index].tamamlamaTarihi = new Date().toISOString();
            }
            
            // Local Storage'a kaydet
            localStorage.setItem(this.DB_KEYS.BILDIRIMLER, JSON.stringify(bildirimler));
            
            // 1 yıldan eski tamamlanmış bildirimleri arşivle
            if (yeniDurum === this.DURUMLAR.TAMAMLANDI) {
                this._eskiBildirimleriArsivle();
            }
            
            console.log(`✅ Bildirim durumu güncellendi: ${bildirimId} -> ${yeniDurum}`);
            
            return {
                success: true,
                data: bildirimler[index],
                message: 'Durum başarıyla güncellendi'
            };
            
        } catch (error) {
            console.error('Durum güncellenirken hata:', error);
            return {
                success: false,
                error: 'Sistem hatası: ' + error.message,
                code: 'SYSTEM_ERROR'
            };
        }
    },

    /**
     * BİLDİRİM SİL
     * @param {string} bildirimId - Bildirim ID
     * @param {boolean} arsiveEkle - Arşive eklenip eklenmeyeceği
     * @returns {Object} - Silme sonucu
     */
    bildirimSil: function(bildirimId, arsiveEkle = true) {
        try {
            const bildirimler = this.tumBildirimleriGetir();
            const index = bildirimler.findIndex(b => b.id === bildirimId);
            
            if (index === -1) {
                return {
                    success: false,
                    error: 'Bildirim bulunamadı',
                    code: 'NOT_FOUND'
                };
            }
            
            const silinecekBildirim = bildirimler[index];
            
            // Arşive ekle
            if (arsiveEkle) {
                this._arsiveEkle(silinecekBildirim, 'manuel_silme');
            }
            
            // Diziden çıkar
            bildirimler.splice(index, 1);
            
            // Local Storage'a kaydet
            localStorage.setItem(this.DB_KEYS.BILDIRIMLER, JSON.stringify(bildirimler));
            
            console.log(`🗑️ Bildirim silindi: ${bildirimId}`);
            
            return {
                success: true,
                message: 'Bildirim başarıyla silindi',
                data: { id: bildirimId }
            };
            
        } catch (error) {
            console.error('Bildirim silinirken hata:', error);
            return {
                success: false,
                error: 'Sistem hatası: ' + error.message,
                code: 'SYSTEM_ERROR'
            };
        }
    },

    /**
     * BİLDİRİM İSTATİSTİKLERİ
     * @returns {Object} - Tüm istatistikler
     */
    istatistikleriGetir: function() {
        try {
            const bildirimler = this.tumBildirimleriGetir();
            const arsiv = this._arsiviGetir();
            const tumVeriler = [...bildirimler, ...arsiv];
            
            // Temel istatistikler
            const toplamBildirim = tumVeriler.length;
            const aktifBildirim = bildirimler.length;
            const arsivlenmisBildirim = arsiv.length;
            
            // Duruma göre sayılar
            const durumSayilari = {};
            Object.values(this.DURUMLAR).forEach(durum => {
                durumSayilari[durum] = bildirimler.filter(b => b.durum === durum).length;
            });
            
            // Şehirlere göre dağılım
            const sehirSayilari = {};
            tumVeriler.forEach(bildirim => {
                const sehir = bildirim.il;
                sehirSayilari[sehir] = (sehirSayilari[sehir] || 0) + 1;
            });
            
            // Problem tiplerine göre dağılım
            const problemSayilari = {};
            tumVeriler.forEach(bildirim => {
                const problem = bildirim.problemTipi;
                problemSayilari[problem] = (problemSayilari[problem] || 0) + 1;
            });
            
            // Son 30 günlük aktivite
            const son30Gun = [];
            const bugun = new Date();
            
            for (let i = 29; i >= 0; i--) {
                const gun = new Date(bugun);
                gun.setDate(bugun.getDate() - i);
                const gunStr = gun.toISOString().split('T')[0];
                
                const gunlukBildirim = tumVeriler.filter(b => {
                    const bildirimTarihi = new Date(b.olusturmaTarihi).toISOString().split('T')[0];
                    return bildirimTarihi === gunStr;
                }).length;
                
                son30Gun.push({
                    tarih: gunStr,
                    sayi: gunlukBildirim
                });
            }
            
            // Ortalama çözüm süresi (tamamlananlar için)
            const tamamlananlar = tumVeriler.filter(b => b.durum === this.DURUMLAR.TAMAMLANDI && b.tamamlamaTarihi);
            let ortalamaCozumSuresi = 0;
            
            if (tamamlananlar.length > 0) {
                const toplamGun = tamamlananlar.reduce((toplam, bildirim) => {
                    const baslangic = new Date(bildirim.olusturmaTarihi);
                    const bitis = new Date(bildirim.tamamlamaTarihi);
                    const gunFarki = Math.ceil((bitis - baslangic) / (1000 * 60 * 60 * 24));
                    return toplam + gunFarki;
                }, 0);
                
                ortalamaCozumSuresi = Math.round(toplamGun / tamamlananlar.length);
            }
            
            return {
                toplamBildirim,
                aktifBildirim,
                arsivlenmisBildirim,
                durumSayilari,
                sehirSayilari,
                problemSayilari,
                son30Gun,
                ortalamaCozumSuresi,
                enCokBildirimSehir: Object.keys(sehirSayilari).reduce((a, b) => sehirSayilari[a] > sehirSayilari[b] ? a : b),
                enCokBildirimProblem: Object.keys(problemSayilari).reduce((a, b) => problemSayilari[a] > problemSayilari[b] ? a : b)
            };
            
        } catch (error) {
            console.error('İstatistikler getirilirken hata:', error);
            return {
                toplamBildirim: 0,
                aktifBildirim: 0,
                arsivlenmisBildirim: 0,
                durumSayilari: {},
                sehirSayilari: {},
                problemSayilari: {},
                son30Gun: [],
                ortalamaCozumSuresi: 0,
                enCokBildirimSehir: '',
                enCokBildirimProblem: ''
            };
        }
    },

    /**
     * EXCEL İÇİN VERİ HAZIRLA
     * @returns {Array} - Excel'e uygun format
     */
    excelIcinHazirla: function() {
        try {
            const bildirimler = this.tumBildirimleriGetir();
            const arsiv = this._arsiviGetir();
            const tumVeriler = [...bildirimler, ...arsiv];
            
            return tumVeriler.map(bildirim => ({
                'ID': bildirim.id,
                'Tarih': this._formatTarih(bildirim.olusturmaTarihi),
                'İl': bildirim.il,
                'İlçe': bildirim.ilce,
                'Mahalle': bildirim.mahalle,
                'Sokak/Cadde': bildirim.sokak,
                'Sokak Detayı': bildirim.sokakDetayi || '',
                'Problem Tipi': bildirim.problemTipi,
                'Problem Emoji': bildirim.problemEmoji || '',
                'Öncelik': bildirim.oncelik,
                'Durum': this._durumAdiGetir(bildirim.durum),
                'Fotoğraf': bildirim.fotograf ? 'Var' : 'Yok',
                'Fotoğraf Boyutu': this._formatBoyut(bildirim.fotografBoyut || 0),
                'İletişim Bilgisi': bildirim.iletisimBilgisi || '',
                'E-posta': bildirim.eposta || '',
                'Açıklama': bildirim.aciklama || '',
                'Koordinatlar': bildirim.koordinatlar ? JSON.stringify(bildirim.koordinatlar) : '',
                'Adres': bildirim.adres || '',
                'Takip Kodu': bildirim.takipKodu,
                'Son Güncelleme': this._formatTarih(bildirim.sonGuncelleme),
                'Tamamlama Tarihi': bildirim.tamamlamaTarihi ? this._formatTarih(bildirim.tamamlamaTarihi) : '',
                'Görüntülenme Sayısı': bildirim.goruntulenmeSayisi || 0
            }));
            
        } catch (error) {
            console.error('Excel verisi hazırlanırken hata:', error);
            return [];
        }
    },

    /**
     * VERİ YEDEKLE (JSON İNDİR)
     * @returns {Object} - Yedek veri
     */
    yedekAl: function() {
        try {
            const yedekVeri = {
                meta: {
                    versiyon: '1.0',
                    olusturmaTarihi: new Date().toISOString(),
                    sistem: 'Anlaşmalı Mahalleler Altyapı Sistemi'
                },
                bildirimler: this.tumBildirimleriGetir(),
                arsiv: this._arsiviGetir(),
                sayaclar: this._sayaclariGetir(),
                ayarlar: this._ayarlariGetir(),
                istatistikler: this.istatistikleriGetir()
            };
            
            return {
                success: true,
                data: yedekVeri,
                fileName: `altyapi-yedek-${new Date().toISOString().split('T')[0]}.json`,
                message: 'Yedek başarıyla oluşturuldu'
            };
            
        } catch (error) {
            console.error('Yedek alınırken hata:', error);
            return {
                success: false,
                error: 'Yedek oluşturulamadı: ' + error.message,
                code: 'BACKUP_ERROR'
            };
        }
    },

    /**
     * YEDEKTEN GERİ YÜKLE
     * @param {Object} yedekData - Yedek verisi
     * @param {boolean} mevcutVerileriKoru - Mevcut veriler korunsun mu
     * @returns {Object} - Geri yükleme sonucu
     */
    yedekYukle: function(yedekData, mevcutVerileriKoru = true) {
        try {
            // Yedek veriyi doğrula
            if (!yedekData || typeof yedekData !== 'object') {
                return {
                    success: false,
                    error: 'Geçersiz yedek verisi',
                    code: 'INVALID_BACKUP'
                };
            }
            
            // Mevcut verileri yedekle (isteğe bağlı)
            let mevcutYedek = null;
            if (mevcutVerileriKoru) {
                mevcutYedek = this.yedekAl();
            }
            
            // Bildirimleri geri yükle
            if (yedekData.bildirimler && Array.isArray(yedekData.bildirimler)) {
                if (!mevcutVerileriKoru) {
                    localStorage.setItem(this.DB_KEYS.BILDIRIMLER, JSON.stringify(yedekData.bildirimler));
                } else {
                    const mevcutBildirimler = this.tumBildirimleriGetir();
                    const birlesikBildirimler = [...mevcutBildirimler, ...yedekData.bildirimler];
                    localStorage.setItem(this.DB_KEYS.BILDIRIMLER, JSON.stringify(birlesikBildirimler));
                }
            }
            
            // Arşivi geri yükle
            if (yedekData.arsiv && Array.isArray(yedekData.arsiv)) {
                const mevcutArsiv = this._arsiviGetir();
                const birlesikArsiv = [...mevcutArsiv, ...yedekData.arsiv];
                localStorage.setItem(this.DB_KEYS.ARSIV, JSON.stringify(birlesikArsiv));
            }
            
            // Sayaçları geri yükle
            if (yedekData.sayaclar && typeof yedekData.sayaclar === 'object') {
                const mevcutSayaclar = this._sayaclariGetir();
                const birlesikSayaclar = { ...mevcutSayaclar, ...yedekData.sayaclar };
                localStorage.setItem(this.DB_KEYS.SAYACLAR, JSON.stringify(birlesikSayaclar));
            }
            
            console.log('✅ Yedek başarıyla geri yüklendi');
            
            return {
                success: true,
                data: {
                    bildirimSayisi: yedekData.bildirimler?.length || 0,
                    arsivSayisi: yedekData.arsiv?.length || 0
                },
                message: 'Yedek başarıyla geri yüklendi'
            };
            
        } catch (error) {
            console.error('Yedek yüklenirken hata:', error);
            return {
                success: false,
                error: 'Yedek yüklenemedi: ' + error.message,
                code: 'RESTORE_ERROR'
            };
        }
    },

    /**
     * VERİTABANINI TEMİZLE (Tüm verileri sil)
     * @param {boolean} arsiviKoru - Arşiv korunsun mu
     * @returns {Object} - Temizleme sonucu
     */
    veritabaniniTemizle: function(arsiviKoru = true) {
        try {
            // Onay iste (UI tarafında yapılacak)
            
            if (!arsiviKoru) {
                localStorage.removeItem(this.DB_KEYS.ARSIV);
            }
            
            localStorage.removeItem(this.DB_KEYS.BILDIRIMLER);
            localStorage.removeItem(this.DB_KEYS.SAYACLAR);
            localStorage.removeItem(this.DB_KEYS.AYARLAR);
            
            console.log('🗑️ Veritabanı temizlendi');
            
            return {
                success: true,
                message: 'Veritabanı başarıyla temizlendi'
            };
            
        } catch (error) {
            console.error('Veritabanı temizlenirken hata:', error);
            return {
                success: false,
                error: 'Temizleme başarısız: ' + error.message,
                code: 'CLEANUP_ERROR'
            };
        }
    },

    /**
     * BİLDİRİM ARA (ID, takip kodu veya içerik ile)
     * @param {string} aramaKelimesi - Aranacak kelime
     * @returns {Array} - Bulunan bildirimler
     */
    bildirimAra: function(aramaKelimesi) {
        try {
            if (!aramaKelimesi || aramaKelimesi.trim() === '') {
                return [];
            }
            
            const kelime = aramaKelimesi.toLowerCase().trim();
            const bildirimler = this.tumBildirimleriGetir();
            
            return bildirimler.filter(bildirim => {
                // ID veya takip kodunda ara
                if (bildirim.id.toLowerCase().includes(kelime) || 
                    bildirim.takipKodu.toLowerCase().includes(kelime)) {
                    return true;
                }
                
                // Konum bilgilerinde ara
                if (bildirim.il.toLowerCase().includes(kelime) ||
                    bildirim.ilce.toLowerCase().includes(kelime) ||
                    bildirim.mahalle.toLowerCase().includes(kelime) ||
                    bildirim.sokak.toLowerCase().includes(kelime)) {
                    return true;
                }
                
                // Problem ve açıklamada ara
                if (bildirim.problemTipi.toLowerCase().includes(kelime) ||
                    (bildirim.aciklama && bildirim.aciklama.toLowerCase().includes(kelime))) {
                    return true;
                }
                
                // İletişim bilgisinde ara
                if (bildirim.iletisimBilgisi && bildirim.iletisimBilgisi.toLowerCase().includes(kelime)) {
                    return true;
                }
                
                return false;
            });
            
        } catch (error) {
            console.error('Arama yapılırken hata:', error);
            return [];
        }
    },

    /**
     * BİLDİRİM GÖRÜNTÜLENME SAYISINI ARTIR
     * @param {string} bildirimId - Bildirim ID
     */
    goruntulenmeArtir: function(bildirimId) {
        try {
            const bildirimler = this.tumBildirimleriGetir();
            const index = bildirimler.findIndex(b => b.id === bildirimId);
            
            if (index !== -1) {
                bildirimler[index].goruntulenmeSayisi = (bildirimler[index].goruntulenmeSayisi || 0) + 1;
                bildirimler[index].sonGoruntulenme = new Date().toISOString();
                
                localStorage.setItem(this.DB_KEYS.BILDIRIMLER, JSON.stringify(bildirimler));
            }
        } catch (error) {
            console.error('Görüntülenme sayısı artırılırken hata:', error);
        }
    },

    // ========== PRIVATE METHODS ==========

    /**
     * SIRA NUMARASI AL
     * @private
     */
    _siraNoAl: function(sehirKodu, tarihStr) {
        try {
            const sayaclar = this._sayaclariGetir();
            const anahtar = `${sehirKodu}_${tarihStr}`;
            
            if (sayaclar[anahtar]) {
                return sayaclar[anahtar];
            }
            
            // Yeni tarih için 1'den başla
            return 1;
            
        } catch (error) {
            console.error('Sıra no alınırken hata:', error);
            return 1;
        }
    },

    /**
     * SIRA NUMARASI GÜNCELLE
     * @private
     */
    _siraNoGuncelle: function(sehirKodu, tarihStr, yeniSayac) {
        try {
            const sayaclar = this._sayaclariGetir();
            const anahtar = `${sehirKodu}_${tarihStr}`;
            
            sayaclar[anahtar] = yeniSayac;
            localStorage.setItem(this.DB_KEYS.SAYACLAR, JSON.stringify(sayaclar));
            
        } catch (error) {
            console.error('Sıra no güncellenirken hata:', error);
        }
    },

    /**
     * SAYAÇLARI GETİR
     * @private
     */
    _sayaclariGetir: function() {
        try {
            const sayaclar = localStorage.getItem(this.DB_KEYS.SAYACLAR);
            return sayaclar ? JSON.parse(sayaclar) : {};
        } catch (error) {
            console.error('Sayaçlar getirilirken hata:', error);
            return {};
        }
    },

    /**
     * ARŞİVİ GETİR
     * @private
     */
    _arsiviGetir: function() {
        try {
            const arsiv = localStorage.getItem(this.DB_KEYS.ARSIV);
            return arsiv ? JSON.parse(arsiv) : [];
        } catch (error) {
            console.error('Arşiv getirilirken hata:', error);
            return [];
        }
    },

    /**
     * AYARLARI GETİR
     * @private
     */
    _ayarlariGetir: function() {
        try {
            const ayarlar = localStorage.getItem(this.DB_KEYS.AYARLAR);
            return ayarlar ? JSON.parse(ayarlar) : {};
        } catch (error) {
            console.error('Ayarlar getirilirken hata:', error);
            return {};
        }
    },

    /**
     * ARŞİVE EKLE
     * @private
     */
    _arsiveEkle: function(bildirim, sebep) {
        try {
            const arsiv = this._arsiviGetir();
            
            const arsivKayit = {
                ...bildirim,
                arsivlenmeTarihi: new Date().toISOString(),
                arsivlenmeSebebi: sebep
            };
            
            arsiv.push(arsivKayit);
            localStorage.setItem(this.DB_KEYS.ARSIV, JSON.stringify(arsiv));
            
        } catch (error) {
            console.error('Arşive eklenirken hata:', error);
        }
    },

    /**
     * ESKİ BİLDİRİMLERİ ARŞİVLE (1 yıldan eski tamamlanmışlar)
     * @private
     */
    _eskiBildirimleriArsivle: function() {
        try {
            const birYilOnce = new Date();
            birYilOnce.setFullYear(birYilOnce.getFullYear() - 1);
            
            const bildirimler = this.tumBildirimleriGetir();
            const arsivlenecekler = [];
            
            // 1 yıldan eski tamamlanmış bildirimleri bul
            for (let i = bildirimler.length - 1; i >= 0; i--) {
                const bildirim = bildirimler[i];
                
                if (bildirim.durum === this.DURUMLAR.TAMAMLANDI && bildirim.tamamlamaTarihi) {
                    const tamamlamaTarihi = new Date(bildirim.tamamlamaTarihi);
                    
                    if (tamamlamaTarihi < birYilOnce) {
                        arsivlenecekler.push(bildirim);
                        bildirimler.splice(i, 1);
                    }
                }
            }
            
            // Arşive ekle
            if (arsivlenecekler.length > 0) {
                const arsiv = this._arsiviGetir();
                arsivlenecekler.forEach(bildirim => {
                    const arsivKayit = {
                        ...bildirim,
                        arsivlenmeTarihi: new Date().toISOString(),
                        arsivlenmeSebebi: 'otomatik_arsiv'
                    };
                    arsiv.push(arsivKayit);
                });
                
                localStorage.setItem(this.DB_KEYS.ARSIV, JSON.stringify(arsiv));
                localStorage.setItem(this.DB_KEYS.BILDIRIMLER, JSON.stringify(bildirimler));
                
                console.log(`📦 ${arsivlenecekler.length} bildirim arşivlendi`);
            }
            
        } catch (error) {
            console.error('Eski bildirimler arşivlenirken hata:', error);
        }
    },

    /**
     * TARİH FORMATLA (01.01.2026 22:24)
     * @private
     */
    _formatTarih: function(isoString) {
        try {
            if (!isoString) return '';
            
            const tarih = new Date(isoString);
            const gun = tarih.getDate().toString().padStart(2, '0');
            const ay = (tarih.getMonth() + 1).toString().padStart(2, '0');
            const yil = tarih.getFullYear();
            const saat = tarih.getHours().toString().padStart(2, '0');
            const dakika = tarih.getMinutes().toString().padStart(2, '0');
            
            return `${gun}.${ay}.${yil} ${saat}:${dakika}`;
        } catch (error) {
            return isoString;
        }
    },

    /**
     * DURUM ADINI GETİR
     * @private
     */
    _durumAdiGetir: function(durumKodu) {
        const durumlar = {
            'pending': 'Beklemede',
            'approved': 'Onaylandı',
            'in_progress': 'Devam Ediyor',
            'completed': 'Tamamlandı',
            'rejected': 'Reddedildi'
        };
        
        return durumlar[durumKodu] || durumKodu;
    },

    /**
     * BOYUT FORMATLA
     * @private
     */
    _formatBoyut: function(bytes) {
        if (bytes === 0) return '0 Byte';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Global erişim için export
if (typeof window !== 'undefined') {
    window.Database = Database;
}

// Sayfa yüklendiğinde otomatik temizleme kontrolü
document.addEventListener('DOMContentLoaded', function() {
    // Eski tamamlanmış bildirimleri arşivle
    setTimeout(() => {
        Database._eskiBildirimleriArsivle();
    }, 5000); // 5 saniye sonra çalıştır
    
    console.log('✅ database.js başarıyla yüklendi!');
});
