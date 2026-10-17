# AGS & ÖABT Kimya Takip: Proje Devir Notu

Bu dosya, projeye sonradan katılan bir geliştiricinin ya da yapay zekâ ajanının **hiçbir şey sormadan** işe başlayabilmesi için yazıldı. Önce 1–4. bölümleri oku, kod değiştirmeden önce 10. bölümdeki testleri çalıştır.

## 1. Proje nedir, kim kullanıyor

- Tek sayfalık, **sunucusuz** bir web uygulaması (PWA). AGS ve ÖABT Kimya sınavlarına hazırlanan bir kişinin konu takibini, haftalık çalışma planını, tekrarlarını ve deneme sonuçlarını tutar.
- **Kullanıcı:** uygulamayı geliştiren kişinin eşi, **tablette** (12" Android/iPad, dokunmatik) kullanıyor. Geliştiren kişi Türkçe konuşur; arayüz ve yorumlar Türkçedir.
- Canlı adres: <https://unaldevelopment.github.io/ags-takip/> (GitHub Pages, depo `unaldevelopment/ags-takip`).
- Veri **yalnızca tarayıcının localStorage'ında** durur (anahtar `ags-takip-v1`). Sunucu, hesap, senkronizasyon yok. Yedek: Ayarlar → "Yedeği indir/yükle" (JSON).
- Saf JavaScript (ES5 tarzı, `var`/`function`), framework ve bağımlılık **yok**. Yazı tipleri Google Fonts'tan gelir.

## 2. Çalışma biçimi (önemli)

- Geliştiricinin bilgisayarında masaüstünde `ags-takip-main` klasörü vardır; **tüm değişiklikler orada yapılır ve oradan GitHub'a push edilir.**
- Yapay zekâ ajanı depoya/klasöre doğrudan erişemez ve push yapamaz. İş akışı: ajan değişen dosyaları zip olarak verir → geliştirici klasöre kopyalar → `git add . && git commit && git push`.
- Ajan oturuma başlarken geliştiriciden **klasörün güncel zip'ini** istemeli (eski kopya üzerinde çalışmamak için).
- Geliştirici ekran görüntüsünü ajana ancak elle iletir; ajan ortamında tarayıcı yoktur. Görsel değişiklikler koddan yapılır, davranış testlerle doğrulanır (bkz. 10). Görsel sonucu kullanıcı onaylar.
- Kullanıcı genel olarak "daha fazla özellik istemiyorum" demişti; ama sonradan açıkça istediği özellikleri (Tamamlananlar sekmesi, plan seçenekleri) birlikte tasarladık. **İstenmeyen özellik ekleme, öneriyi ayrıca yaz.**

## 3. Dosya haritası

| Dosya | Ne işe yarar |
|---|---|
| `index.template.html` | Sayfa iskeleti. `style.css`, `konular.js`, `app.js`'i dış dosya olarak çağırır. |
| `style.css` | Tüm stiller. En altta **"SADE TEMA"** bloğu eskileri ezer (bkz. 9). |
| `konular.js` | `window.DERSLER`: ders → grup → konu listesi. İçerik verisi, mantık yok. |
| `app.js` | Tüm uygulama mantığı (IIFE içinde, ~2700 satır). |
| `sw.js` | Service worker (çevrimdışı önbellek). **Her yayında `CACHE_NAME` sürümünü artır.** |
| `manifest.json`, `icon-*.png` | PWA bilgileri. |
| `index.html` | **Derleme çıktısı** (şablon + css + konular + app tek dosyada). Canlı site bunu açar. **Elle düzenleme.** |
| `ags-takip-tek-dosya.html` | `index.html` ile aynı içerik (tek dosya kopyası). |
| `derle.ps1` / `derle.js` | Çıktıyı üretir (Windows PowerShell / Node). İkisi birebir aynı sonucu verir. |
| `paketle.ps1` | Web paketi zip'i (yayın için gerekmez). |
| `baslat.bat`, `sunucu.ps1` | Yerelde test sunucusu (8080). |
| `test/harness.js`, `test/senaryolar.js` | Tarayıcısız davranış testleri (bkz. 10). |

**Altın kural:** `app.js`/`style.css`/`konular.js`/`index.template.html` kaynak dosyalardır. Değiştirdikten sonra mutlaka `node derle.js` (veya `derle.ps1`) çalıştır; aksi halde canlı site `index.html`'deki **eski** kodu çalıştırmaya devam eder. Sonra `sw.js` içindeki `CACHE_NAME`'i bir artır.

## 4. Yayın (deploy)

1. `node test/senaryolar.js` → hepsi geçmeli.
2. `node derle.js` → `index.html` ve `ags-takip-tek-dosya.html` yenilenir.
3. `sw.js` → `CACHE_NAME = 'ags-takip-vN'` değerini artır.
4. `git add . && git commit -m "..." && git push` → GitHub Pages ~1 dk içinde yayınlar.
5. Tablette siteyi **iki kez** aç (service worker "önce eskiyi göster, arkada yenile" çalışır; ilk açılışta eski sürüm görünebilir).
6. Kullanıcıya yayından önce **Ayarlar → Yedeği indir** önerilir.

## 5. Veri modeli (`S`, localStorage `ags-takip-v1`)

`varsayilan()` fonksiyonu (app.js, "Veri" bölümü) tüm alanları tanımlar; `yukle()` kayıtlı veriyle birleştirir. Bozuk JSON'da ham değer `ags-takip-v1-bozuk-yedek` anahtarına kopyalanır, sonra varsayılana dönülür.

| Alan | Anlam |
|---|---|
| `durum` | `konuId → 1 Çalışılıyor / 2 Bitti / 3 Tekrar gerekli` (0 saklanmaz). **Konu durumunun tek doğruluk kaynağı.** |
| `bitis` | `konuId → { t: 'YYYY-MM-DD' bitiş tarihi, dk: sayılan süre }`. `durumAyarla(id,2)` yazar; Bitti kaldırılınca silinir. Tamamlananlar sekmesi okur. Eski kayıtlarda yoksa tarih `tekrar.baslangic`'tan, süre tahminden gelir (`bitisBilgi`). |
| `tekrar` | `konuId → { n, sonraki, sonTekrar, baslangic }`. Aralıklı tekrar: 7 gün → 21 gün → her 30 gün. |
| `istatistik` | `{ seri, sonTarih, toplamTekrar }` |
| `notlar`, `linkler`, `dersLink`, `ozel` | Konu notları, video bağlantıları, kullanıcının eklediği konular (`ozel[dersId] = [{id, ad}]`). |
| `plan` | `0..6 (Pzt..Paz) → [görev]`. Görev: `{ t, tip, oturum, bas, bit, done, konuId, repeatKonuId, ders, n, manual }`. `tip`: `konu \| tekrar \| serbest \| aksam \| ozel`. |
| `planHafta` | Planın ait olduğu haftanın **Pazartesi tarihi** (`YYYY-MM-DD`). Hafta geçince plan sıfırlanır (`planNormalle`). |
| `planAyarlar` | Sihirbaz tercihleri: `hiz`, `seciliDersler`, `gunSablon[7]` (`yok/tam/sabah/ogle`), `aksamGunler[7]`, `duzen` (`sirali/donusumlu/agirlikli`), `maks` (0 = sınırsız), `sureMod` (`gercek/sabit`), `atla` (`konuId → true`, plana girmeyecek konular), eski `aktifGunler` (türetilir). |
| `denemeler`, `tarih`, `hiz`, `hedef` | Deneme sonuçları; sınav tarihleri (`tarih.ags`, `tarih.oabt`, `tarih.onayli`); eski hız/hedef alanları (hız artık `planAyarlar.hiz` ile eşit tutulur). |

**Konu kimliği:** `dersId + ':' + slug(konu adı)` (örn. `eb:egitimin-temel-kavramlari-ve-islevleri`). Kimlik **başlıktan türer**: `konular.js`'te bir konunun adını değiştirmek, o konunun ilerlemesini ve tekrar kaydını kaybettirir. Başlık düzeltmeden önce kullanıcıya sor / geçiş (migrasyon) yaz.

## 6. Değişmezler (bozma)

1. **"Bitti" kendiliğinden başka bir duruma düşmez.** Tekrar günü gelince konu Bitti kalır; yanında "Tekrar zamanı" etiketi çıkar (`tekrarVakti(id)`). (Eski sürümde `etkinDurum()` bunu otomatik "Tekrar gerekli"ye çeviriyordu; kullanıcı işaretlerin kaybolduğunu söylüyordu.)
2. **Plandaki konu görevleri durumu `S.durum`'dan okur** (`gorevBitti`). Plandan işaretlemek ile Panel'den işaretlemek aynı şeydir.
3. `planUret()` **saf fonksiyondur**: `S`'yi değiştirmez, sonucu döndürür. Sihirbaz önizlemesi bunu çağırır; `wzolustur` sonucu `S.plan`'a yazar.
4. Plan yeniden üretilirken **geçmiş günlerde yalnızca yapılanlar ve elle eklenenler kalır**; kaçırılan otomatik bloklar silinir, o konular havuza döner (eski hatada konular haftaya geri dönmüyordu).
5. Plan dışı bırakılan konu (`atla`) "Bitti" **sayılmaz**; sadece havuza girmez.
6. Tek hız ayarı: `planAyarlar.hiz` (Süre Analizi `surehiz` ve sihirbaz aynı değeri yazar).
7. `index.html` elle düzenlenmez; derleme çıktısıdır.

## 7. Ekranlar ve kod haritası (`app.js`)

Alt menü/sol menü (`NAV`): **Panel**, **Haftalık Plan**, **Tamamlananlar**, **Denemeler**. Görünüm eşlemesi `VIEWS`, çizim `render()`, tıklamalar tek bir olay dinleyicisiyle `ACTIONS[data-a]` fonksiyonlarına gider (`document.addEventListener('click', …)`). Form gönderimleri `data-form` ile ayrılır. Hash (`#panel`, `#plan` …) ile gezinilir.

Bölümler (satır numaraları yaklaşıktır, `grep -n "=====" app.js` ile bul):

- **Yardımcılar / Durumlar / İkonlar / Veri:** `esc`, tarih yardımcıları (`bugunStr`, `gunEkle`), `DURUMLAR`, `IC` (SVG ikonlar), `varsayilan`, `yukle`, `kaydet`, `durumAyarla`, `tekrarYap`, `bugunTekrarlar`, `tekrarVakti`.
- **Panel (`viewPanel`):** genel ilerleme, bugünün tekrarları, ders kartları, sağda konu listesi (konu satırı: onay kutusu, durum hapı, not, link).
- **Haftalık Plan:** `OTURUMLAR`, `SABLONLAR`, `konuSuresi`, `planHavuz`, `planUret`, `wzBaslat/wzGecerli/wzOngoru/wzOnizle`, `wizardHtml`, `kapsamHtml`, `konuSheetHtml`, `viewPlan`, `gorevSatiri`. Alt sayfalar `<dialog>` ile açılır (`sheetAc/sheetCiz`).
- **Tamamlananlar (`viewGecmis`):** özet kartları, son 7 gün çubuk grafiği, derslere göre ilerleme, güne göre biten konular (derse göre filtre, "daha fazla göster").
- **Denemeler (`viewDeneme`):** deneme ekle, net grafiği.
- **Eski/ölü kod:** `planIcinKonular` ve çevresindeki "Akıllı Çalışma & Tekrar Planlayıcı" bölümü ile `viewSureler` (Video Süre Analizi ekranı) menüde yok; `VIDEO_ANALIZ` verisi ise **canlı** (`dersKonuDk1x` gerçek süreyi buradan hesaplar). Ölü kodu silmeden önce `grep` ile kullanım kontrolü yap.

## 8. Plan üreteci (`planUret`) ve sihirbaz

Girdi `ayar = { dersler, sablon[7], aksam[7], hiz, duzen, maks, sureMod }`.

1. **Hangi hafta?** Bu haftada bugünden itibaren çalışılacak gün/oturum kaldıysa bu hafta; kalmadıysa **gelecek hafta** (`hb`). Örn. cumartesi ya da cuma 17:00'den sonra gelecek haftaya yazılır.
2. **Korunanlar:** aynı haftaysa mevcut planda `manual` olanlar ve `gorevBitti` olanlar kalır (geçmiş günler dahil); diğer otomatik bloklar atılır.
3. **Havuz (`planHavuz`):** seçili derslerin Bitti olmayan, `atla`'da olmayan ve korunmayan konuları; AGS ve ÖABT ayrı iki kuyruk. Sıralama `duzen`'e göre (`havuzSirala`): `sirali` (ders ders), `donusumlu` (dersler arasında dönüşümlü), `agirlikli` (ders `soru` sayısına göre ağırlıklı, "smooth weighted round-robin").
4. **Gün şablonu (`SABLONLAR`):** `tam` = s1–s5 + tekrar (09:00–17:00), `sabah` = s1–s3 (09:00–14:00, tekrar yok), `ogle` = s4–s5 + tekrar (14:30–17:00), `yok` = dinlenme. Akşam etüdü (21:00–22:30) ayrı anahtar.
5. **Oturum doldurma:** sabah oturumları (s1–s3) AGS kuyruğundan, öğleden sonra (s4–s5) ÖABT kuyruğundan alır; kuyruk boşsa diğerinden. Her oturumda **imleç tabanlı** yerleştirme: konu süresi kadar blok, sığmayan kalan ≥15 dk süre "Konu sonrası soru çözümü" olur. Oturumdan uzun ilk konu, oturumun ≥%75'i kadarsa oturuma sıkıştırılır. Biten/elle eklenen bloklar imleci atlatır. Günlük `maks` dolunca kalan oturumlar soru çözümüne ayrılır.
6. **Konu süresi (`konuSuresi`):** `gercek` modda dersin toplam video süresi (`VIDEO_ANALIZ`'deki `saat1x`) ÷ konu sayısı ÷ hız, 5 dk'ya yuvarlı (EB ≈ 96 dk/konu @1x, ÖABT ≈ 114); `sabit` modda 45 dk ÷ hız. Ders eşlemesi `dersKonuDk1x` içinde.
7. **Tekrarlar:** `tekrarKuyrugu()` vadesi gelenleri, tekrar oturumuna (16:30–17:00) 10'ar dakikalık bloklar halinde yerleştirir.
8. **Önizleme/tahmin (`wzOnizle`, `wzOngoru`):** hangi haftaya yazılacağı, gün başına konu sayısı, haftalık tempo, tahmini bitiş ve sınav tarihine göre yeterlilik (4 hafta tekrar payı bırakır).

Sihirbaz bölümleri: 1 Dersler (+ "Konuları tek tek ayarla" → `kapsamHtml`), 2 Sıralama, 3 Gün şablonu + akşam, 4 Hız ve süre modu, 5 Günlük sınır, özet + önizleme.

## 9. Tasarım

Koyu, sade, tek vurgu rengi. `style.css`'in **sonundaki "SADE TEMA" bloğu** eski kuralların renklerini ezer (CSS değişkenleri `:root` içinde yeniden tanımlanır: `--bg #0f1216`, `--card #161a20`, `--blue #4a77cf` tek vurgu, `--green`/`--amber` soluk). Eski degrade/mor/yeşil vurgular düz yüzeye çevrildi. Yeni bileşenler `gc-*` (Tamamlananlar) ve `sh-*` (sihirbaz/alt sayfa) önekleriyle yazıldı. Mobil kırılımı ≤820 px (alt menü). Tablet hedefi 768–1280 px. Dokunma hedefleri ≥44 px tutulur.

## 10. Test

Tarayıcı olmadan, DOM'u taklit eden bir düzenekle çalışır (yalnızca Node gerekir, paket yok):

```
node test/senaryolar.js
```

- `test/harness.js`: sahte DOM + `localStorage`, `setNow('2026-10-12T08:00:00')` ile **sahte saat**, `boot(durum)` ile uygulamayı yükler, `click('eylemAdi', {id, g, val…})` ile `data-a` düğmesine tıklar, `main()`/`sheet()` ile çıktıyı okur.
- `test/senaryolar.js`: ~49 doğrulama (Bitti kalıcılığı, plan hafta mantığı, düzen/şablon/sınır/kapsam, süre hesabı, **oturum çakışması/taşması olmaması**, önizleme, hız tekleştirme, Tamamlananlar).
- Yeni davranış eklerken önce buraya senaryo ekle. Plan değişikliklerinde "H · Çakışma ve taşma yok" bölümü en önemli güvencedir.
- Sözdizimi hızlı kontrolü: `node -e "new Function(require('fs').readFileSync('app.js','utf8'))"`.
- Testler gerçek tarayıcıyı, dokunma davranışını ve görünümü **kapsamaz**; bunlar kullanıcıda denenir.

## 11. Değişiklik günlüğü

- **v1 – Bitti kaybolma hatası.** `etkinDurum` artık durumu değiştirmez; `tekrarVakti` ayrı bir uyarı; `toggle` mantığı düzeltildi; kaydırma konumu koruma sınıfı (`.side-topics-scroll`) düzeltildi; not/link simgesi vurgusu; 7 günlük takvimde "bugün" gecikmişleri sayar; bozuk kayıt yedeği.
- **v2 – Plan düzeltmesi.** Geçmiş günlerde kaçırılan konular havuza döner.
- **v3 – Tamamlananlar sekmesi + sade tema.** `S.bitis` eklendi; yeni sekme; koyu sade tema katmanı.
- **v4 – Plan seçenekleri.** Çalışma düzeni (sırayla/dönüşümlü/ağırlıklı), gün şablonları, günlük konu sınırı, konu kapsamı (`atla`, "buradan başla"), gerçek video süresi, sınav hedefi tahmini, önizleme, hız ayarı tekleştirme; imleç tabanlı oturum doldurma; test paketi; `derle.js`; bu belge.
- **v5 – Aylık Görünüm & Bitişe Kadar Tüm Sistem Planlama.** Plan ekranında 3 mod (Haftalık, Aylık, Bitişe Kadar Yol Haritası); haftalar arası gezinme (`◀ Önceki Hafta / Sonraki Hafta ▶`); aylık takvim matrisi ve gün detayına tek dokunuşla gitme; sihirbazda 1 Hafta / 4 Hafta / "Konular Bitene Kadar" kapsam seçeneği; tüm müfredatı tek seferde bitiş tarihine kadar haftalara dağıtma ve aralıklı tekrarları otomatik ilerletme; çok haftalık veri modeli (`S.planlar`).

## 12. Bilinen eksikler / sıradaki iş fikirleri

- Konu kimlikleri başlıktan türüyor (bkz. 5); sabit kimlik + geçiş yazılabilir.
- Plan görevinin tikini kaldırmak konuyu Bitti'den çıkarmaz (Panel'den kaldırılır).
- Sabah = AGS, öğleden sonra = ÖABT eşlemesi sabit kodlu; kullanıcı seçemiyor.
- `sabah` şablonlu günlerde tekrar bloğu yok; yalnızca `sabah` günleri seçilirse vadesi gelen tekrarlar planlanamaz.
- Kullanıcının "Konu başına süre" tahmini video süresidir; soru çözümü/not süresi dahil değil.
- Otomatik yedek hatırlatması yok (veri yalnızca tarayıcıda; asıl risk veri kaybı). Düzenli "Yedeği indir" hatırlatması önerilir.
- Ölü kod (7. bölüm) temizlenebilir.
