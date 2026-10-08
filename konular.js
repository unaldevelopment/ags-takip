/*
  KONU LİSTESİ
  ------------
  AGS konuları İndeks Akademi MEB-AGS video ders serileri (Zeynep Salman İçli, Bulut Vurdum,
  Bünyamin Atalay, Aydın Yüce, Ali Koç, Gizem Ural, Metin Şimşek, Emrah Vahap Özkaraca)
  ve ÖSYM kapsamına göre ayrıntılı alt başlıklara ayrılmıştır.
  ÖABT Kimya bölümü de ana disiplinler ve alan eğitimi olarak yapılandırılmıştır.
*/
window.DERSLER = [
  {
    id: 'eb', ad: 'Eğitim Bilimleri ve Türk Millî Eğitim Sistemi', kisa: 'Eğitim Bilimleri', soru: 30, sinav: 'ags',
    gruplar: [
      {
        ad: 'Eğitimin Temelleri & Felsefesi (Zeynep Salman İçli)',
        konular: [
          'Eğitimin Temel Kavramları ve İşlevleri',
          'Eğitimin Tarihsel Temelleri (Türk Eğitim Tarihi)',
          'Felsefi Akımlar (İdealizm, Realizm, Pragmatizm, Varoluşçuluk)',
          'Eğitim Felsefeleri (Daimicilik, Esasicilik, İlerlemecilik, Yeniden Kurmacılık)',
          'Eğitimin Toplumsal ve Sosyolojik Temelleri',
          'Eğitimin Ekonomik ve Politik Temelleri',
          'Eğitim ve Öğretimde Etik İlkeler'
        ]
      },
      {
        ad: 'Gelişim Psikolojisi (Bulut Vurdum)',
        konular: [
          'Gelişimin Temel Kavramları (Büyüme, Olgunlaşma, Hazırbulunuşluk, Kritik Dönem)',
          'Gelişimin Temel İlkeleri ve Gelişimi Etkileyen Faktörler',
          'Fiziksel ve Motor Gelişim',
          'Bilişsel Gelişim: Temel Kavramlar (Şema, Özümleme, Uyum, Dengeleme)',
          'Bilişsel Gelişim: Piaget\'nin Bilişsel Gelişim Evreleri',
          'Bilişsel Gelişim: Vygotsky (Yakınsak Gelişim Alanı, Yapı İskelesi)',
          'Bilişsel Gelişim: Bruner ve Dil Gelişimi Kuramları',
          'Kişilik Gelişimi: Freud - Topografik ve Yapısal Kişilik Kuramı',
          'Kişilik Gelişimi: Freud - Psikoseksüel Gelişim ve Savunma Mekanizmaları',
          'Kişilik Gelişimi: Erikson - Psikososyal Gelişim Evreleri',
          'Ahlak Gelişimi: Piaget ve Kohlberg\'in Ahlak Kuramları',
          'Benlik Gelişimi, Bağlanma Stilleri ve Oyun Gelişimi'
        ]
      },
      {
        ad: 'Öğrenme Psikolojisi (Bünyamin Atalay)',
        konular: [
          'Öğrenmenin Tanımı, Temel Kavramlar ve Öğrenmeyi Etkileyen Faktörler',
          'Klasik Koşullanma: Temel Kavramlar ve İlkeler (Pavlov)',
          'Klasik Koşullanma: Süreçler (Gölgeleme, Engelleme, Üst Düzey Koşullanma)',
          'Klasik Koşullanmayı Ortadan Kaldırma (Sistematik Duyarsızlaştırma, Karşıt Koşullanma)',
          'Bitişiklik Kuramları (Watson ve Guthrie)',
          'Bağlaşımcılık Kuramı (Thorndike - Etki Yasası, Hazırbulunuşluk)',
          'Edimsel Koşullanma: Temel Kavramlar ve Premack İlkesi (Skinner)',
          'Pekiştireç Türleri (Olumlu/Olumsuz) ve Ceza Türleri',
          'Pekiştirme Tarifeleri (Sürekli, Aralıklı, Oranlı)',
          'Davranış Kontrolü ve Biçimlendirme (Kademeli Yaklaşma, Sönme)',
          'Sosyal Öğrenme Kuramı: Bandura - Gözlem Yoluyla Öğrenme',
          'Gestalt Kuramı: Algı Yasaları ve İçgörüsel Öğrenme',
          'Bilgiyi İşleme Kuramı: Bellek Türleri (Duyusal, Kısa Süreli, Uzun Süreli)',
          'Bilgiyi İşleme Kuramı: Bilişsel Süreçler (Kodlama, Tekrar, Hatırlama, Unutma)',
          'İnsancıl (Hümanist) Öğrenme Kuramı: Maslow ve Rogers'
        ]
      },
      {
        ad: 'Öğretim Yöntem ve Teknikleri (Zeynep Salman İçli)',
        konular: [
          'Öğretim İlkeleri (Öğrenciye Görelik, Somuttan Soyuta, Hayatilik vb.)',
          'Öğretim Stratejileri: Sunuş Yoluyla Öğretim (Ausubel)',
          'Öğretim Stratejileri: Buluş Yoluyla Öğretim (Bruner)',
          'Öğretim Stratejileri: Araştırma-İnceleme Yoluyla Öğretim (Dewey)',
          'Çağdaş Öğretim Modelleri: Yapılandırmacılık (5E / 7E Modeli)',
          'Çağdaş Öğretim Modelleri: Tam Öğrenme Modeli (Bloom)',
          'Çağdaş Öğretim Modelleri: İşbirlikli (Kupere) Öğrenme Yaklaşımı',
          'Çağdaş Öğretim Modelleri: Probleme Dayalı ve Proje Tabanlı Öğrenme',
          'Çağdaş Öğretim Modelleri: Çoklu Zekâ, Basamaklı ve Kuantum Öğrenme',
          'Temel Öğretim Yöntemleri (Anlatım, Tartışma, Örnek Olay, Gösterip Yaptırma)',
          'Tartışma Teknikleri (Münazara, Panel, Sempozyum, Forum, Çember vb.)',
          'Bireysel ve Grupla Öğretim Teknikleri (Beyin Fırtınası, Altı Şapka, İstasyon)',
          'Görsel ve Grafiksel Teknikler (Balık Kılçığı, Kavram Haritaları, Zihin Haritası, V Diyagramı)',
          'Sınıf Dışı Öğretim Teknikleri (Gözlem, Gezi, Görüşme, Sergi)'
        ]
      },
      {
        ad: 'Sınıf Yönetimi (Zeynep Salman İçli)',
        konular: [
          'Sınıf Yönetiminin Boyutları ve Yaklaşımları (Tepkisel, Önleyici, Gelişimsel, Bütünsel)',
          'Sınıfın Fiziki Ortamının Düzenlenmesi ve Yerleşim Düzenleri',
          'Sınıf Kurallarının Belirlenmesi ve Uygulanması',
          'Sınıf İçi İletişim Süreci ve İletişim Engelleri',
          'Zaman Yönetimi ve İstenmeyen Öğrenci Davranışlarının Yönetimi'
        ]
      },
      {
        ad: 'Program Okuryazarlığı ve Program Geliştirme (Zeynep Salman İçli)',
        konular: [
          'Program Türleri (Resmî, Uygulanan, Örtük, İhmal Edilen, Ekstra)',
          'Program Geliştirmenin Temelleri (Tarihsel, Felsefi, Psikolojik, Toplumsal)',
          'Program Tasarımı Yaklaşımları (Konu, Öğrenen ve Sorun Merkezli)',
          'Hedef (Kazanım) Belirleme ve Taksonomiler (Bloom ve Yenilenmiş Bloom)',
          'İçerik Düzenleme İlkeleri ve Yaklaşımları (Doğrusal, Sarmal, Modüler vb.)',
          'Eğitim Durumlarının Planlanması ve Ders Planı Hazırlama',
          'Program Değerlendirme Modelleri ve Süreci'
        ]
      },
      {
        ad: 'Eğitimde Ölçme ve Değerlendirme',
        konular: [
          'Temel Kavramlar: Ölçme, Ölçüt, Değerlendirme ve Ölçek Türleri',
          'Amacına Göre Değerlendirme (Tanıma-Yerleştirme, Biçimlendirme, Düzey Belirleme)',
          'Ölçme Araçlarında Nitelikler: Geçerlik ve Geçerlik Türleri',
          'Ölçme Araçlarında Nitelikler: Güvenirlik, Güvenirlik Belirleme Yöntemleri',
          'Ölçmenin Standart Hatası ve Hata Türleri (Sabit, Sistemli, Tesadüfi)',
          'Geleneksel Ölçme Araçları (Yazılı, Sözlü, Çoktan Seçmeli, Doğru-Yanlış vb.)',
          'Alternatif Ölçme ve Değerlendirme (Rubrik, Portfolyo, Öz/Akran Değerlendirme)',
          'Test İstatistiği: Aritmetik Ortalama, Mod, Medyan, Standart Sapma, Varyans',
          'Madde İstatistiği: Madde Güçlük ve Madde Ayırt Edicilik İndeksleri',
          'Standart Puanlar: Z ve T Puanları Hesaplama ve Yorumlama'
        ]
      },
      {
        ad: 'Rehberlik ve Özel Eğitim (Bulut Vurdum)',
        konular: [
          'Rehberliğin Tanımı, Amacı, İlkeleri ve Tarihçesi',
          'Hizmet Alanlarına Göre Rehberlik (Doğrudan ve Dolaylı Hizmetler)',
          'Problem Alanlarına Göre Rehberlik (Eğitsel, Mesleki, Kişisel-Sosyal)',
          'Kapsamlı Gelişimsel Rehberlik Programı (PDR)',
          'Bireyi Tanıma Teknikleri: Test ve Test Dışı Teknikler (Sosyometri, Otobiyografi vb.)',
          'Okul Rehberlik Hizmetleri Örgütlenmesi ve Personelin Görevleri',
          'Özel Eğitim: Yetersizlik Türleri, Tanılama ve BEP Hazırlama',
          'Kaynaştırma / Bütünleştirme Eğitimi Esasları'
        ]
      },
      {
        ad: 'Eğitim Teknolojileri & Mesleki Etik',
        konular: [
          'Eğitimde Teknoloji Entegrasyonu ve TPAB Modeli',
          'Dijital Materyal Tasarımı, Telif Hakları ve Güvenli İnternet',
          'Eğitimde Yapay Zekâ Araçları ve Kullanımı',
          'Öğretmenlik Meslek Etiği ve Temel İlkeler'
        ]
      },
      {
        ad: 'Türk Millî Eğitim Sistemi & Teşkilatı (Zeynep Salman İçli)',
        konular: [
          'Türk Millî Eğitiminin Genel Amaçları ve Temel İlkeleri (1739 Sayılı Kanun)',
          'Millî Eğitim Bakanlığı Merkez, Taşra ve Yurt Dışı Teşkilat Yapısı',
          'Eğitim Kademeleri (Erken Çocukluk, İlköğretim, Ortaöğretim, Yükseköğretim)'
        ]
      },
      {
        ad: 'Türkiye Yüzyılı Maarif Modeli (TYMM - Bünyamin Atalay & Zeynep Salman İçli)',
        konular: [
          'TYMM\'nin Felsefi Temelleri ve Bütüncül İnsan Yaklaşımı',
          'Beceriler Çerçevesi: Kavramsal, Alan ve Sosyal-Duygusal Beceriler',
          'Okuryazarlık Becerileri (Bilgi, Dijital, Finansal, Kültürel vb.)',
          'Erdem-Değer-Eylem Çerçevesi ve Programlar Arası Bileşenler',
          'Öğretme-Öğrenme Yaşantıları ve Farklılaştırılmış Öğretim (Zenginleştirme/Destekleme)'
        ]
      }
    ]
  },
  {
    id: 'sz', ad: 'Sözel Yetenek', kisa: 'Sözel Yetenek', soru: 15, sinav: 'ags',
    gruplar: [
      {
        ad: 'Sözcükte Anlam (Gizem Ural)',
        konular: [
          'Gerçek, Mecaz, Yan ve Terim Anlam',
          'Sözcükler Arası Anlam İlişkileri (Eş, Zıt, Eş Sesli, Yakın Anlam)',
          'Söz Öbekleri, Deyimler ve Atasözleri',
          'Anlam Olayları: Dolaylama, Güzel Adlandırma, Somutlaştırma, Soyutlaştırma'
        ]
      },
      {
        ad: 'Cümlede Anlam (Gizem Ural)',
        konular: [
          'Cümlede Kavramlar (Öznel-Nesnel, Tanım, İçerik, Üslup, Ön Yargı, Olasılık)',
          'Cümleler Arası Anlam İlişkileri (Neden-Sonuç, Amaç-Sonuç, Koşul-Sonuç)',
          'Cümle Yorumlama, Cümle Tamamlama ve Örtük Anlam'
        ]
      },
      {
        ad: 'Dil Bilgisi (Gizem Ural)',
        konular: [
          'Ses Bilgisi (Ünlü Düşmesi, Ünsüz Benzeşmesi, Yumuşama vb.)',
          'Yazım Kuralları (Büyük Harfler, Birleşik Kelimeler, "de/ki/mi" Yazımı)',
          'Noktalama İşaretleri',
          'Sözcükte Yapı (Kök, Gövde, Yapım ve Çekim Ekleri)',
          'Sözcük Türleri: İsim, Sıfat, Zamir, Zarf',
          'Sözcük Türleri: Edat, Bağlaç, Ünlem',
          'Fiiller: Kip ve Kişi, Ek Fiil, Fiilimsiler (Eylemsiler)',
          'Fiilde Çatı (Öznesine ve Nesnesine Göre)',
          'Cümlenin Ögeleri (Yüklem, Özne, Nesne, Tümleçler)',
          'Cümle Türleri (Anlamına, Yüklemine ve Yapısına Göre)',
          'Anlatım Bozuklukları (Anlamsal ve Yapısal)'
        ]
      },
      {
        ad: 'Paragrafta Anlam ve Yapı (Gizem Ural)',
        konular: [
          'Paragrafta Ana Düşünce ve Konu',
          'Paragrafta Yardımcı Düşünceler',
          'Paragrafta Yapı (Giriş-Gelişme-Sonuç, Akışı Bozan Cümle, Paragrafı İkiye Bölme)',
          'Paragrafa Cümle Ekleme ve Yer Değiştirme',
          'Anlatım Biçimleri ve Düşünceyi Geliştirme Yolları'
        ]
      },
      {
        ad: 'Sözel Mantık (Gizem Ural)',
        konular: [
          'Sıralama ve Dizilim Problemleri',
          'Tablo Oluşturma ve Gruplama Problemleri',
          'Eşleştirme ve Karma Sözel Mantık Problemleri'
        ]
      }
    ]
  },
  {
    id: 'sy', ad: 'Sayısal Yetenek', kisa: 'Sayısal Yetenek', soru: 15, sinav: 'ags',
    gruplar: [
      {
        ad: 'Temel Matematik (İlyas Güneş)',
        konular: [
          'Temel Kavramlar ve Sayı Kümeleri',
          'Tek-Çift, Pozitif-Negatif ve Asal Sayılar',
          'Ardışık Sayılar ve Sonlu Toplamlar',
          'Sayı Basamakları ve Çözümleme',
          'Bölme ve Bölünebilme Kuralları',
          'Asal Çarpanlara Ayırma, EBOB ve EKOK',
          'Rasyonel Sayılar ve Ondalık Gösterim',
          'Basit Eşitsizlikler ve Sıralama',
          'Mutlak Değer ve Özellikleri',
          'Üslü Sayılar ve İşlemler',
          'Köklü Sayılar ve İşlemler',
          'Çarpanlara Ayırma ve Özdeşlikler',
          'Oran ve Orantı',
          'Birinci Dereceden Denklemler'
        ]
      },
      {
        ad: 'Problemler (İlyas Güneş)',
        konular: [
          'Sayı ve Kesir Problemleri',
          'Yaş Problemleri',
          'İşçi ve Emek Problemleri',
          'Hız ve Hareket Problemleri',
          'Yüzde, Kâr, Zarar ve İskonto Problemleri',
          'Karışım Problemleri',
          'Grafik ve Tablo Yorumlama Problemleri',
          'Günlük Hayat ve Sayısal Muhakeme Problemleri'
        ]
      },
      {
        ad: 'Sayısal Mantık, Kümeler & Olasılık (İlyas Güneş)',
        konular: [
          'Kümeler ve Kartezyen Çarpım',
          'Fonksiyonlar',
          'Sayma Kuralları ve Permütasyon',
          'Kombinasyon ve Binom Açılımı',
          'Olasılık',
          'Sayısal Mantık ve Akıl Yürütme Soruları'
        ]
      },
      {
        ad: 'Temel Geometri',
        konular: [
          'Doğruda ve Üçgende Açılar',
          'Özel Üçgenler (Dik, İkizkenar, Eşkenar)',
          'Üçgende Alan ve Benzerlik',
          'Çokgenler ve Dörtgenler (Kare, Dikdörtgen, Paralelkenar, Yamuk)',
          'Çember ve Daire',
          'Katı Cisimler (Prizma, Silindir, Koni, Küre)'
        ]
      }
    ]
  },
  {
    id: 'mv', ad: 'Mevzuat', kisa: 'Mevzuat', soru: 8, sinav: 'ags',
    gruplar: [
      {
        ad: 'T.C. Anayasası (Emrah Vahap Özkaraca)',
        konular: [
          'Anayasa Hukuku Temel Kavramları ve Devlet Biçimleri',
          'Türk Anayasa Tarihi ve 1982 Anayasası Genel Esaslar',
          'Temel Hak ve Hürriyetler (Kişi, Sosyal-Ekonomik, Siyasi)',
          'Yasama: TBMM Yapısı, Görev ve Yetkileri, Kanunlaşma Süreci',
          'Yürütme: Cumhurbaşkanı, CB Kararnameleri ve İdari Yapı',
          'Yargı: Anayasa Mahkemesi, Yüksek Mahkemeler ve HSK'
        ]
      },
      {
        ad: 'İnsan Hakları Hukuku (Emrah Vahap Özkaraca)',
        konular: [
          'İnsan Hakları Kavramı, Tarihsel Gelişimi ve Kuşakları',
          'İnsan Hakları Evrensel Beyannamesi ve Avrupa İnsan Hakları Sözleşmesi (AİHS)',
          'AİHM Başvuru Usulü ve Ulusal İnsan Hakları Mekanizmaları'
        ]
      },
      {
        ad: 'Millî Eğitim ve Meslek Mevzuatı',
        konular: [
          '1739 Sayılı Millî Eğitim Temel Kanunu: Amaçlar ve Temel İlkeler',
          '1739 Sayılı Kanun: Öğretmenlik Mesleği ve Okul Binaları',
          '222 Sayılı İlköğretim ve Eğitim Kanunu: İlköğretim Çağı ve Mecburiyeti',
          '222 Sayılı Kanun: Devam-Devamsızlık, Okul Gelirleri ve Harcamalar',
          '7528 Sayılı Öğretmenlik Mesleği Kanunu: Hak, Ödev ve Yükümlülükler',
          '7528 Sayılı Kanun: Kariyer Basamakları (Uzman ve Başöğretmenlik)',
          '7528 Sayılı Kanun: Disiplin Hükümleri ve Yaptırımlar',
          '657 Sayılı Devlet Memurları Kanunu: Temel İlkeler, Ödevler, Haklar ve Disiplin Cezaları',
          '4483 Sayılı Memurlar ve Diğer Kamu Görevlilerinin Yargılanması Kanunu'
        ]
      }
    ]
  },
  {
    id: 'ta', ad: 'Tarih', kisa: 'Tarih', soru: 6, sinav: 'ags',
    gruplar: [
      {
        ad: 'Şah Mat 1: İslamiyet Öncesi Türk Tarihi & Kültür Medeniyeti (Erdem Ünal Demirci)',
        konular: [
          'Video 1: İslamiyet Öncesi Türk Tarihi - Siyasi Tarih & Boylar',
          'Video 2: İslamiyet Öncesi Türk Tarihi - Devlet Teşkilatı ve Ordu',
          'Video 3: İslamiyet Öncesi Türk Tarihi - Sosyal Hayat, Hukuk ve Din',
          'Video 4: İslamiyet Öncesi Türk Tarihi - Yazı, Dil, Edebiyat ve Sanat'
        ]
      },
      {
        ad: 'Şah Mat 2: Türk-İslam Tarihi & İlk Devletler (Erdem Ünal Demirci)',
        konular: [
          'Video 5: İlk Türk-İslam Devletleri (Karahanlı, Gazneli, Büyük Selçuklu)',
          'Video 6: Mısır\'da Kurulan Türk Devletleri ve İlk Anadolu Beylikleri',
          'Video 7: Türkiye Selçuklu Devleti Siyasi Tarihi ve Olayları',
          'Video 8: Türk-İslam Kültür ve Medeniyeti (Bilim, Düşünce ve Mimari)'
        ]
      },
      {
        ad: 'Şah Mat 3: Osmanlı Devleti Siyasi Tarihi (Erdem Ünal Demirci)',
        konular: [
          'Video 9: Osmanlı Kuruluş Dönemi (1299-1453)',
          'Video 10: Osmanlı Yükselme Dönemi (Dünya Gücü Osmanlı)',
          'Video 11: Osmanlı Duraklama Dönemi (XVII. Yüzyıl Islahatları)',
          'Video 12: Osmanlı Gerileme Dönemi (XVIII. Yüzyıl Islahatları)',
          'Video 13: Osmanlı Dağılma Dönemi - XIX. Yüzyıl Siyasi Olayları',
          'Video 14: Osmanlı Dağılma Dönemi - Tanzimat, Islahat ve Meşrutiyet'
        ]
      },
      {
        ad: 'Şah Mat 4: Osmanlı Kültür ve Medeniyeti (Erdem Ünal Demirci)',
        konular: [
          'Video 15: Osmanlı Kültür ve Medeniyeti - Merkez & Taşra Teşkilatı',
          'Video 16: Osmanlı Kültür ve Medeniyeti - Hukuk, Ordu, Toplum ve İktisat'
        ]
      },
      {
        ad: 'Şah Mat 5: Milli Mücadele & Kurtuluş Savaşı (Erdem Ünal Demirci)',
        konular: [
          'Video 17: XX. Yüzyıl Başları Osmanlı - Trablusgarp ve Balkan Savaşları',
          'Video 18: I. Dünya Savaşı Cepheler, Mondros ve Cemiyetler',
          'Video 19: Kurtuluş Savaşı Hazırlık Dönemi (Genelgeler ve Kongreler)',
          'Video 20: I. TBMM Dönemi, Ayaklanmalar ve Sevr Antlaşması',
          'Video 21: Kurtuluş Savaşı Muharebeler Dönemi (Doğu, Güney ve Batı Cephesi)',
          'Video 22: Mudanya Ateşkes Antlaşması ve Lozan Barış Antlaşması'
        ]
      },
      {
        ad: 'Şah Mat 6: Atatürk İnkılapları, İlkeleri & Çağdaş Dünya (Erdem Ünal Demirci)',
        konular: [
          'Video 23: Atatürk İnkılapları ve Çok Partili Hayata Geçiş',
          'Video 24: Atatürk İlkeleri, Türk Dış Politikası ve Çağdaş Dünya'
        ]
      }
    ]
  },
  {
    id: 'cg', ad: 'Türkiye Coğrafyası', kisa: 'Türkiye Coğrafyası', soru: 6, sinav: 'ags',
    gruplar: [
      {
        ad: 'Türkiye\'nin Fiziki Coğrafyası (Engin Eraydın)',
        konular: [
          'Türkiye\'nin Coğrafi Konumu: Matematiksel (Mutlak) ve Göreceli Konum',
          'Türkiye\'nin Jeolojik Yapısı ve Jeolojik Zamanlar',
          'Türkiye\'nin Yer Şekilleri: Dağlar (Kıvrım, Kırık, Volkanik)',
          'Türkiye\'nin Yer Şekilleri: Platolar ve Ovalar',
          'Türkiye\'de Dış Kuvvetler: Akarsular, Karstik Şekiller, Rüzgarlar, Buzullar',
          'Türkiye\'nin Kıyı Tipleri, Dalga ve Akıntılar',
          'Türkiye\'nin İklimi: Sıcaklık, Basınç, Rüzgarlar, Nem ve Yağış',
          'Türkiye\'de İklim Tipleri ve Özellikleri',
          'Türkiye\'nin Bitki Örtüsü ve Orman Dağılışı',
          'Türkiye\'nin Toprak Tipleri ve Dağılışı',
          'Türkiye\'nin Su Varlığı: Akarsu Havzaları ve Göller',
          'Türkiye\'de Doğal Afetler: Deprem, Heyelan, Erozyon, Çığ, Yangın'
        ]
      },
      {
        ad: 'Türkiye\'nin Beşerî Coğrafyası (Engin Eraydın)',
        konular: [
          'Türkiye\'de Nüfusun Dağılışı ve Nüfus Yoğunluğu',
          'Türkiye Nüfusunun Yapısal Özellikleri (Yaş, Cinsiyet, Eğitim, Sektörel Dağılım)',
          'Türkiye\'de Göçler: Nedenleri, Türleri ve Sonuçları',
          'Türkiye\'de Yerleşme: Kırsal ve Kentsel Yerleşme Tipleri, Mesken Tipleri'
        ]
      },
      {
        ad: 'Türkiye\'nin Ekonomik Coğrafyası (Engin Eraydın)',
        konular: [
          'Türkiye\'de Tarım: Tarımı Etkileyen Faktörler ve Tarım Ürünleri Dağılışı',
          'Türkiye\'de Hayvancılık Türleri ve Dağılışı',
          'Türkiye\'nin Madenleri ve Dağılışı (Demir, Bakır, Boksit, Bor, Krom vb.)',
          'Türkiye\'nin Enerji Kaynakları: Fosil ve Yenilenebilir Enerji',
          'Türkiye\'de Sanayi: Kuruluş Şartları ve Başlıca Sanayi Kolları',
          'Türkiye\'de Ulaşım Sistemleri (Karayolu, Demiryolu, Denizyolu, Havayolu)',
          'Türkiye\'de İç ve Dış Ticaret (İhracat ve İthalat Yapısı)',
          'Türkiye\'de Turizm Varlıkları ve Çeşitleri',
          'Bölgesel Kalkınma Projeleri (GAP, DAP, DOKAP, ZBK, KOP, YHGP)'
        ]
      }
    ]
  },
  {
    id: 'ok', ad: 'ÖABT Kimya Öğretmenliği', kisa: 'ÖABT Kimya', soru: 50, sinav: 'oabt',
    gruplar: [
      {
        ad: 'Genel Kimya',
        konular: [
          'Temel Kavramlar ve Maddenin Sınıflandırılması',
          'Atom Yapısı ve Periyodik Sistem',
          'Kimyasal Bağlar ve Moleküller Arası Etkileşimler',
          'Mol Kavramı ve Stokiyometri',
          'Kimyasal Tepkimeler ve Tepkime Türleri',
          'Gazlar ve Kinetik Teori',
          'Çözeltiler ve Derişim Birimleri'
        ]
      },
      {
        ad: 'Analitik Kimya',
        konular: [
          'Hata Analizi ve İstatistik',
          'Kimyasal Denge ve Dengeye Etki Eden Faktörler',
          'Asit-Baz Dengeleri ve Tampon Çözeltiler',
          'Çözünürlük Dengeleri (Kçç) ve Çöktürme Titrasyonları',
          'Titrasyon Yöntemleri ve Nötralleşme Eğrileri',
          'Elektroanalitik Yöntemler ve Potansiyometri',
          'Spektroskopik Yöntemler (UV-Vis, AAS, Moleküler Spektroskopi)',
          'Kromatografi ve Ayırma Yöntemleri (GC, HPLC, TLC)'
        ]
      },
      {
        ad: 'Anorganik Kimya',
        konular: [
          'Periyodik Özellikler ve Elektron Dizilimleri',
          'Kimyasal Bağ Teorileri (Değerlik Bağı, Moleküler Orbital Kuramı)',
          'Asit-Baz Teorileri (Lewis, HSAB - Sert/Yumuşak Asit-Bazlar)',
          'Ana Grup Elementleri Kimyası (s ve p Blokları)',
          'Geçiş Elementleri ve Koordinasyon Bileşikleri',
          'Kristal Alan ve Ligand Alan Teorisi',
          'Katı Hâl Kimyası ve Örgü Kusurları',
          'Organometalik Kimyaya Giriş'
        ]
      },
      {
        ad: 'Organik Kimya',
        konular: [
          'Bağlanma, Hibritleşme ve Rezonans Yapıları',
          'IUPAC Adlandırma ve Fonksiyonel Gruplar',
          'Alkanlar, Sikloalkanlar ve Konformasyon Analizi',
          'Stereokimya (Kiralite, Enantiyomer, Diastereomer, R/S, E/Z)',
          'Alkenler ve Alkinler: Katılma Tepkimeleri ve Sentez',
          'Alkil Halojenürler (SN1, SN2, E1, E2 Tepkime Mekanizmaları)',
          'Alkoller, Eterler ve Epoksitler',
          'Aromatik Bileşikler ve Elektrofilik Aromatik Sübstitüsyon',
          'Aldehit ve Ketonlar: Nükleofilik Katılma Tepkimeleri',
          'Karboksilik Asitler ve Türevleri (Açil Klorür, Ester, Amit)',
          'Aminler ve Azotlu Bileşikler',
          'Biyomoleküller (Karbonhidratlar, Amino Asitler, Peptitler, Lipitler)',
          'Organik Spektroskopi (IR, 1H-NMR, 13C-NMR, Kütle Spektrometrisi)'
        ]
      },
      {
        ad: 'Fizikokimya',
        konular: [
          'Gerçek Gazlar ve Durum Denklemleri (Van der Waals)',
          'Termodinamiğin I. Yasası ve Termokimya',
          'Termodinamiğin II. ve III. Yasaları (Entropi, Gibbs Serbest Enerjisi)',
          'Faz Dengeleri, Faz Diyagramları ve Kısmi Molar Büyüklükler',
          'Kimyasal Kinetik, Tepkime Hız İfadeleri ve Hız Sabiti',
          'Elektrokimya, Galvanik Piller ve Nernst Eşitliği',
          'Yüzey Kimyası, Adsorpsiyon ve Kolloidler',
          'Kuantum Kimyasına Giriş ve Atomik Spektrumlar'
        ]
      },
      {
        ad: 'Alan Eğitimi (Kimya Öğretimi)',
        konular: [
          'Kimya Öğretim Programı ve Türkiye Yüzyılı Maarif Modeli',
          'Kimya Öğretiminde Yöntem, Model ve Stratejiler (5E, Kavramsal Değişim vb.)',
          'Kimya Dersinde Sık Karşılaşılan Kavram Yanılgıları ve Giderme Yolları',
          'Laboratuvar Kullanımı, Deney Türleri, İş Sağlığı ve Güvenliği',
          'Kimya Dersinde Ölçme ve Değerlendirme Yaklaşımları',
          'Öğretim Teknolojileri, Moleküler Modelleme ve Simülasyonlar',
          'Kimya Tarihi, Bilimin Doğası ve Önemli Bilim İnsanları'
        ]
      }
    ]
  }
];
