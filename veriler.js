/**
 * ANLAŞMALI MAHALLELER ALTYAPI SORUN BİLDİRİM SİSTEMİ
 * Tüm Şehir, İlçe, Mahalle ve Sokak Verileri
 * 
 * @description: Sistemde kullanılacak tüm konum verileri bu dosyada tanımlanmıştır.
 * Manuel olarak güncellenebilir.
 */

const VERILER = {
    sehirler: {
        'Diyarbakır': {
            ilceler: {
                'Bağlar': {
                    mahalleler: {
                        'Kaynartepe': [
                            '293. Sokak',
                            '5 Nisan Caddesi',
                            'Fırat Sokak',
                            'Dicle Sokak',
                            'Barış Sokak',
                            'Demokrasi Caddesi',
                            'Özgürlük Sokak',
                            'Cumhuriyet Sokak',
                            'Atatürk Bulvarı',
                            'Mehmet Akif Ersoy Caddesi',
                            'İstiklal Sokak',
                            'Zafer Sokak',
                            'Şehitler Caddesi',
                            'Huzur Sokak',
                            'Bahçe Sokak',
                            'Yeni Mahalle Sokak',
                            'Kavaklık Caddesi',
                            'Gül Sokak',
                            'Çınar Sokak',
                            'Irmak Sokak'
                        ]
                    }
                },
                'Kayapınar': {
                    mahalleler: {
                        'Karacadağ': ['Karacadağ Caddesi', 'Cumhuriyet Bulvarı']
                    }
                },
                'Sur': {
                    mahalleler: {
                        'Merkez': ['Ulu Cami Sokak', 'İç Kale Caddesi']
                    }
                },
                'Yenişehir': {
                    mahalleler: {
                        'Ofis': ['Vali Konağı Caddesi', 'Şehitlik Sokak']
                    }
                }
            }
        },

        'Erzurum': {
            ilceler: {
                'Aziziye': {
                    mahalleler: {
                        'Selçuklu': [
                            '100. Yıl Bulvarı',
                            'Atatürk Caddesi',
                            'Cumhuriyet Sokak',
                            'İstiklal Sokak',
                            'Şehitler Caddesi',
                            'Hürriyet Sokak',
                            'Zafer Sokak',
                            'Fuat Sezgin Caddesi',
                            'Nene Hatun Sokak',
                            'Aziziye Şehitleri Caddesi',
                            'Palandöken Caddesi',
                            'Kazım Karabekir Sokak',
                            'Mareşal Fevzi Çakmak Sokak',
                            'Talatpaşa Sokak',
                            'Şair Nef'i Sokak',
                            'Yavuz Sultan Selim Caddesi',
                            'Kanuni Sultan Süleyman Sokak',
                            'Fatih Sultan Mehmet Caddesi',
                            'Osman Gazi Sokak',
                            'Orhan Gazi Caddesi'
                        ]
                    }
                },
                'Yakutiye': {
                    mahalleler: {
                        'Cumhuriyet': ['Erzurum Caddesi', 'Kongre Sokak']
                    }
                },
                'Palandöken': {
                    mahalleler: {
                        'Yıldızkent': ['Palandöken Caddesi', 'Kayak Evi Sokak']
                    }
                }
            }
        },

        'Şanlıurfa': {
            ilceler: {
                'Eyyübiye': {
                    mahalleler: {
                        'Şair Nabi': ['Halilürrahman Caddesi', 'Balıklıgöl Sokak']
                    }
                },
                'Haliliye': {
                    mahalleler: {
                        'Osmanlı': ['Fırat Caddesi', 'Gölbaşı Sokak']
                    }
                }
            }
        },

        'Gaziantep': {
            ilceler: {
                'Şahinbey': {
                    mahalleler: {
                        'Şehitkamil': ['Atatürk Bulvarı', 'Kurtuluş Caddesi']
                    }
                }
            }
        },

        'Mardin': {
            ilceler: {
                'Artuklu': {
                    mahalleler: {
                        'Merkez': ['Birinci Cadde', 'Cumhuriyet Meydanı']
                    }
                }
            }
        },

        'Batman': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Barış': ['Batman Caddesi', 'Petrol Sokak']
                    }
                }
            }
        },

        'Siirt': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Kurtalan': ['Siirt Caddesi', 'Botan Sokak']
                    }
                }
            }
        },

        'Şırnak': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Cizre': ['Şırnak Caddesi', 'Nuh Sokak']
                    }
                }
            }
        },

        'Hakkari': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Yüksekova': ['Hakkari Caddesi', 'Cilo Sokak']
                    }
                }
            }
        },

        'Van': {
            ilceler: {
                'İpekyolu': {
                    mahalleler: {
                        'Tuşba': ['Van Caddesi', 'Göl Kenarı Sokak']
                    }
                }
            }
        },

        'Muş': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Bulancak': ['Muş Caddesi', 'Murat Sokak']
                    }
                }
            }
        },

        'Bitlis': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Tatvan': ['Bitlis Caddesi', 'Nemrut Sokak']
                    }
                }
            }
        },

        'Bingöl': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Solhan': ['Bingöl Caddesi', 'Çapakçur Sokak']
                    }
                }
            }
        },

        'Tunceli': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Pertek': ['Tunceli Caddesi', 'Munzur Sokak']
                    }
                }
            }
        },

        'Elazığ': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Harput': ['Elazığ Caddesi', 'Hazar Sokak']
                    }
                }
            }
        },

        'Malatya': {
            ilceler: {
                'Battalgazi': {
                    mahalleler: {
                        'İnönü': ['Malatya Caddesi', 'Kayısı Sokak']
                    }
                }
            }
        },

        'Adıyaman': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Nemrut': ['Adıyaman Caddesi', 'Kommagene Sokak']
                    }
                }
            }
        },

        'Kilis': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Musabeyli': ['Kilis Caddesi', 'Öncüpınar Sokak']
                    }
                }
            }
        },

        'Osmaniye': {
            ilceler: {
                'Merkez': {
                    mahalleler: {
                        'Kadirli': ['Osmaniye Caddesi', 'Cebelibereket Sokak']
                    }
                }
            }
        },

        'Hatay': {
            ilceler: {
                'Antakya': {
                    mahalleler: {
                        'Şehitler': ['Hatay Caddesi', 'Müze Sokak']
                    }
                }
            }
        }
    },

    // PROBLEM TİPLERİ ve EMOJİLERİ
    problemTipleri: [
        { id: 1, emoji: '🚧', ad: 'Yol Bozukluğu', aciklama: 'Çukur, tümsek, asfalt bozukluğu' },
        { id: 2, emoji: '💧', ad: 'Su Baskını', aciklama: 'Su şebekesi patlaması, sel' },
        { id: 3, emoji: '⚡', ad: 'Elektrik Kesintisi', aciklama: 'Uzun süreli elektrik kesintisi' },
        { id: 4, emoji: '🗑️', ad: 'Çöp Toplama', aciklama: 'Çöp birikmesi, toplanmama' },
        { id: 5, emoji: '🚦', ad: 'Trafik Lambası', aciklama: 'Trafik lambası arızası' },
        { id: 6, emoji: '💡', ad: 'Aydınlatma', aciklama: 'Sokak lambası arızası' },
        { id: 7, emoji: '🌳', ad: 'Park/Bahçe', aciklama: 'Park bakımı, ağaç budama' },
        { id: 8, emoji: '🏗️', ad: 'İnşaat Molozu', aciklama: 'Moloz birikmesi, temizlenmeme' },
        { id: 9, emoji: '🚰', ad: 'İçme Suyu', aciklama: 'İçme suyu kesintisi, kalitesi' },
        { id: 10, emoji: '🚽', ad: 'Kanalizasyon', aciklama: 'Kanalizasyon taşması, tıkanıklık' },
        { id: 11, emoji: '⚜️', ad: 'Güvenlik', aciklama: 'Güvenlik açığı, sokak lambası' }
    ],

    // ÖNCELİK SEVİYELERİ
    oncelikSeviyeleri: [
        { id: 1, ad: 'Düşük', renk: '#10B981', aciklama: '1 hafta içinde çözülebilir' },
        { id: 2, ad: 'Orta', renk: '#F59E0B', aciklama: '3 gün içinde çözülmeli' },
        { id: 3, ad: 'Yüksek', renk: '#EF4444', aciklama: '24 saat içinde çözülmeli' },
        { id: 4, ad: 'Acil', renk: '#DC2626', aciklama: 'Hemen müdahale gerekiyor' }
    ],

    // BİLDİRİM DURUMLARI
    bildirimDurumlari: [
        { id: 'pending', ad: 'Beklemede', renk: '#6B7280', icon: 'fas fa-clock' },
        { id: 'approved', ad: 'Onaylandı', renk: '#3B82F6', icon: 'fas fa-check-circle' },
        { id: 'in_progress', ad: 'Devam Ediyor', renk: '#F59E0B', icon: 'fas fa-tools' },
        { id: 'completed', ad: 'Tamamlandı', renk: '#10B981', icon: 'fas fa-check-double' },
        { id: 'rejected', ad: 'Reddedildi', renk: '#EF4444', icon: 'fas fa-times-circle' }
    ],

    // EXCEL SÜTUN BAŞLIKLARI
    excelSutunlari: [
        'ID',
        'Tarih',
        'İl',
        'İlçe',
        'Mahalle',
        'Sokak/Cadde',
        'Sokak Detayı',
        'Problem Tipi',
        'Öncelik',
        'Durum',
        'Fotoğraf',
        'İletişim Bilgisi',
        'Açıklama',
        'Koordinatlar',
        'Takip Kodu'
    ],

    // HARİTA İÇİN VARSYILAN KOORDİNATLAR (Her şehir için)
    varsayilanKoordinatlar: {
        'Diyarbakır': { lat: 37.9100, lng: 40.2300 },
        'Erzurum': { lat: 39.9000, lng: 41.2700 },
        'Şanlıurfa': { lat: 37.1500, lng: 38.8000 },
        'Gaziantep': { lat: 37.0662, lng: 37.3833 },
        'Mardin': { lat: 37.3212, lng: 40.7245 },
        'Batman': { lat: 37.8812, lng: 41.1351 },
        'Siirt': { lat: 37.9333, lng: 41.9500 },
        'Şırnak': { lat: 37.5167, lng: 42.4667 },
        'Hakkari': { lat: 37.5833, lng: 43.7333 },
        'Van': { lat: 38.4946, lng: 43.3830 },
        'Muş': { lat: 38.9462, lng: 41.7539 },
        'Bitlis': { lat: 38.4000, lng: 42.1167 },
        'Bingöl': { lat: 38.8847, lng: 40.4939 },
        'Tunceli': { lat: 39.3071, lng: 39.4388 },
        'Elazığ': { lat: 38.6810, lng: 39.2264 },
        'Malatya': { lat: 38.3552, lng: 38.3335 },
        'Adıyaman': { lat: 37.7648, lng: 38.2786 },
        'Kilis': { lat: 36.7184, lng: 37.1212 },
        'Osmaniye': { lat: 37.2130, lng: 36.1763 },
        'Hatay': { lat: 36.4018, lng: 36.3498 }
    }
};

// SİSTEM FONKSİYONLARI
const VeriYoneticisi = {
    // Şehir listesini alma
    sehirleriGetir: function() {
        return Object.keys(VERILER.sehirler);
    },

    // İlçe listesini alma
    ilceleriGetir: function(sehirAdi) {
        if (!sehirAdi || !VERILER.sehirler[sehirAdi]) return [];
        return Object.keys(VERILER.sehirler[sehirAdi].ilceler);
    },

    // Mahalle listesini alma
    mahalleleriGetir: function(sehirAdi, ilceAdi) {
        if (!sehirAdi || !ilceAdi || 
            !VERILER.sehirler[sehirAdi] || 
            !VERILER.sehirler[sehirAdi].ilceler[ilceAdi]) return [];
        
        return Object.keys(VERILER.sehirler[sehirAdi].ilceler[ilceAdi].mahalleler);
    },

    // Sokak listesini alma
    sokaklariGetir: function(sehirAdi, ilceAdi, mahalleAdi) {
        if (!sehirAdi || !ilceAdi || !mahalleAdi || 
            !VERILER.sehirler[sehirAdi] || 
            !VERILER.sehirler[sehirAdi].ilceler[ilceAdi] || 
            !VERILER.sehirler[sehirAdi].ilceler[ilceAdi].mahalleler[mahalleAdi]) return [];
        
        return VERILER.sehirler[sehirAdi].ilceler[ilceAdi].mahalleler[mahalleAdi];
    },

    // Problem tiplerini alma
    problemTipleriniGetir: function() {
        return VERILER.problemTipleri;
    },

    // Öncelik seviyelerini alma
    oncelikSeviyeleriniGetir: function() {
        return VERILER.oncelikSeviyeleri;
    },

    // Şehir koordinatlarını alma
    koordinatGetir: function(sehirAdi) {
        return VERILER.varsayilanKoordinatlar[sehirAdi] || { lat: 39.9208, lng: 32.8541 }; // Ankara varsayılan
    },

    // Yeni sokak ekleme (manuel veri güncelleme için)
    sokakEkle: function(sehirAdi, ilceAdi, mahalleAdi, sokakAdi) {
        try {
            if (!VERILER.sehirler[sehirAdi] || 
                !VERILER.sehirler[sehirAdi].ilceler[ilceAdi] || 
                !VERILER.sehirler[sehirAdi].ilceler[ilceAdi].mahalleler[mahalleAdi]) {
                console.error('Geçersiz konum bilgisi');
                return false;
            }

            const sokaklar = VERILER.sehirler[sehirAdi].ilceler[ilceAdi].mahalleler[mahalleAdi];
            
            // Sokak zaten varsa ekleme
            if (sokaklar.includes(sokakAdi)) {
                return false;
            }

            sokaklar.push(sokakAdi);
            console.log(`${sokakAdi} sokağı başarıyla eklendi.`);
            return true;
        } catch (error) {
            console.error('Sokak eklenirken hata:', error);
            return false;
        }
    },

    // Sokak silme
    sokakSil: function(sehirAdi, ilceAdi, mahalleAdi, sokakAdi) {
        try {
            if (!VERILER.sehirler[sehirAdi] || 
                !VERILER.sehirler[sehirAdi].ilceler[ilceAdi] || 
                !VERILER.sehirler[sehirAdi].ilceler[ilceAdi].mahalleler[mahalleAdi]) {
                console.error('Geçersiz konum bilgisi');
                return false;
            }

            const sokaklar = VERILER.sehirler[sehirAdi].ilceler[ilceAdi].mahalleler[mahalleAdi];
            const index = sokaklar.indexOf(sokakAdi);
            
            if (index === -1) {
                return false;
            }

            sokaklar.splice(index, 1);
            console.log(`${sokakAdi} sokağı başarıyla silindi.`);
            return true;
        } catch (error) {
            console.error('Sokak silinirken hata:', error);
            return false;
        }
    }
};

// Global erişim için export
if (typeof window !== 'undefined') {
    window.VERILER = VERILER;
    window.VeriYoneticisi = VeriYoneticisi;
}

console.log('✅ veriler.js başarıyla yüklendi!');
console.log(`📊 Toplam ${VeriYoneticisi.sehirleriGetir().length} şehir yüklendi.`);
