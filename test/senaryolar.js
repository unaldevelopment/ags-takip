/* Davranış testleri. Çalıştırma (proje kökünde):  node test/senaryolar.js
   Başarısız olan bir senaryo varsa çıkış kodu 1 olur. */
const T = require('./harness.js');
const { setNow, boot, click, S, main, sheet, text, ago, dk } = T;

let gecen = 0, kalan = 0;
function ok(kosul, ad, ek) {
  if (kosul) { gecen++; console.log('  ✓ ' + ad); }
  else { kalan++; console.log('  ✗ ' + ad + (ek !== undefined ? '  → ' + ek : '')); }
}
const bolum = ad => console.log('\n' + ad);
const GUN = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const konuGorevleri = (s, g) => (s.plan[g] || []).filter(t => t.tip === 'konu');
const tumKonuGorevleri = s => [0, 1, 2, 3, 4, 5, 6].reduce((a, g) => a.concat(konuGorevleri(s, g)), []);
const konuDurumDone = (s, t) => ((s.durum || {})[t.konuId] || 0) >= 2;

// Sihirbazı açıp seçenekleri uygular, planı oluşturur
function planla(secenek) {
  click('planac');
  const o = secenek || {};
  if (o.dersler) {                           // varsayılan ['eb','ok'] seçiliyse önce onları kapat
    ['eb', 'sz', 'sy', 'mv', 'ta', 'cg', 'ok'].forEach(id => {
      const secili = new RegExp('data-a="wzders" data-id="' + id + '" aria-pressed="true"').test(sheet());
      const ister = o.dersler.includes(id);
      if (secili !== ister) click('wzders', { id });
    });
  }
  if (o.duzen) click('wzduzen', { val: o.duzen });
  if (o.sure) click('wzsure', { val: o.sure });
  if (o.maks !== undefined) click('wzmaks', { val: String(o.maks) });
  if (o.hiz) click('wzhiz', { val: String(o.hiz) });
  if (o.kapsam) click('wzkapsam', { val: o.kapsam });
  (o.sablon || []).forEach((v, g) => click('wzsablon', { g: String(g), val: v }));
  click('wzolustur');
  return S();
}

/* ------------------------------------------------------------------ */
bolum('A · "Bitti" işareti kaybolmuyor');
setNow('2026-10-12T08:00:00');
boot(null);
const kid = main().match(/data-a="toggle" data-id="([^"]+)"/)[1];
const satir = h => { const i = h.indexOf('data-a="toggle" data-id="' + kid + '"'); const s0 = h.lastIndexOf('<li', i); return h.slice(s0, h.indexOf('</li>', i)); };
boot({ durum: { [kid]: 2 }, tekrar: { [kid]: { n: 0, sonraki: ago(3) } } });
let r = satir(main());
ok(/checked/.test(r) && /topic-row-item done/.test(r), 'Tekrar günü geçse de konu işaretli ve üstü çizili kalır');
ok(/tekrar-tag/.test(r), 'Yanında "Tekrar zamanı" etiketi çıkar');
click('tekrarok', { id: kid });
let s = S();
ok(s.durum[kid] === 2 && s.tekrar[kid].n === 1, 'Tekrar yapılınca konu Bitti kalır, tekrar sayısı artar');
boot(null);
click('toggle', { id: kid });
s = S();
ok(s.durum[kid] === 2 && s.bitis[kid] && s.bitis[kid].dk > 0, 'İşaretleyince durum ve bitiş kaydı oluşur', JSON.stringify(s.bitis));
click('toggle', { id: kid });
s = S();
ok(!s.durum[kid] && !s.bitis[kid], 'İşareti kaldırınca bitiş kaydı da silinir');
boot(null);
T.store['ags-takip-v1'] = '{bozuk';
(0, eval)(require('fs').readFileSync(require('path').join(__dirname, '..', 'app.js'), 'utf8'));
ok(T.store['ags-takip-v1-bozuk-yedek'] === '{bozuk', 'Bozuk kayıt ezilmeden yedeklenir');

/* ------------------------------------------------------------------ */
bolum('B · Haftalık plan temelleri');
setNow('2026-10-12T08:00:00');
boot(null);
s = planla({ duzen: 'sirali', sure: 'sabit' });
ok(konuGorevleri(s, 0).length >= 10, 'Pazartesi sabit süreyle çok sayıda konu yerleşir', konuGorevleri(s, 0).length);
['Cmt', 'Paz'].forEach((g, i) => ok((s.plan[5 + i] || []).length === 0 || s.plan[5 + i].every(t => t.tip === 'aksam'), g + ' dinlenme günü boş'));
// kaçırılan konular
const ilk = konuGorevleri(s, 0).map(t => t.konuId);
for (const j of [0, 1, 2]) click('gtoggle', { g: '0', j: String(j) });
setNow('2026-10-14T13:00:00');
boot(S());
s = planla({ duzen: 'sirali', sure: 'sabit' });
const kac = ilk.slice(3, 6);
const yeniYer = tumKonuGorevleri(s).filter(t => kac.includes(t.konuId));
ok(yeniYer.length === 3 && yeniYer.every(t => !konuDurumDone(s, t)), 'Kaçırılan 3 konu çarşamba yeniden planlandı', yeniYer.length);
ok(konuGorevleri(s, 0).every(t => konuDurumDone(s, t)), 'Pazartesi’de yalnızca yapılanlar kaldı');
const idler = tumKonuGorevleri(s).map(t => t.konuId);
ok(idler.length === new Set(idler).size, 'Aynı konu planda iki kez yok');
const carIlk = konuGorevleri(s, 2).find(t => !konuDurumDone(s, t));
ok(carIlk && dk(carIlk.bas) >= 13 * 60, 'Çarşamba 13:00 sonrası ilk blok', carIlk && carIlk.bas);
// cumartesi → gelecek hafta
setNow('2026-10-17T10:00:00');
boot(null);
s = planla();
ok(s.planHafta === '2026-10-19', 'Cumartesi planı gelecek haftaya yazılır', s.planHafta);
setNow('2026-10-19T09:30:00');
boot(S());
ok(S().plan[0].length > 0 && S().planHafta === '2026-10-19', 'Pazartesi gelince plan yerinde durur');
// tekrar
setNow('2026-10-05T09:00:00');
boot(null);
planla({ sure: 'sabit', duzen: 'sirali' });
click('gtoggle', { g: '0', j: '0' });
setNow('2026-10-12T08:00:00');
boot(S());
s = planla({ sure: 'sabit', duzen: 'sirali' });
ok([0, 1, 2, 3, 4].some(g => (s.plan[g] || []).some(t => t.tip === 'tekrar')), '7 gün sonra tekrar bloğu planda çıkar');

/* ------------------------------------------------------------------ */
bolum('C · Çalışma düzeni (ders sıralaması)');
setNow('2026-10-12T08:00:00');
const dersOf = (s, g) => konuGorevleri(s, g).map(t => t.ders);
boot(null);
s = planla({ dersler: ['eb', 'sz', 'sy'], duzen: 'sirali', sure: 'sabit' });
ok(new Set(dersOf(s, 0).slice(0, 6)).size === 1, 'Sırayla: ilk 6 konu aynı dersten', dersOf(s, 0).slice(0, 6).join(','));
boot(null);
s = planla({ dersler: ['eb', 'sz', 'sy'], duzen: 'donusumlu', sure: 'sabit' });
ok(new Set(dersOf(s, 0).slice(0, 3)).size === 3, 'Dönüşümlü: ilk 3 konu 3 farklı dersten', dersOf(s, 0).slice(0, 3).join(','));
boot(null);
s = planla({ dersler: ['eb', 'sz', 'sy'], duzen: 'agirlikli', sure: 'sabit' });
const say = {}; tumKonuGorevleri(s).forEach(t => { say[t.ders] = (say[t.ders] || 0) + 1; });
ok(say['Eğitim Bilimleri'] >= say['Sözel Yetenek'] * 1.5 && Math.abs(say['Sözel Yetenek'] - say['Sayısal Yetenek']) <= 2, 'Ağırlıklı: EB (30 soru) SY/SZ’den (15) belirgin sık gelir', JSON.stringify(say));

/* ------------------------------------------------------------------ */
bolum('D · Günlük konu sınırı');
boot(null);
s = planla({ maks: 2, sure: 'sabit' });
ok([0, 1, 2, 3, 4].every(g => konuGorevleri(s, g).length <= 2), 'Hiçbir gün 2 konuyu aşmaz', [0, 1, 2, 3, 4].map(g => konuGorevleri(s, g).length).join(','));
ok((s.plan[1] || []).filter(t => t.tip === 'serbest').length >= 3, 'Kalan oturumlar soru çözümüne ayrılır');

/* ------------------------------------------------------------------ */
bolum('E · Gün şablonları');
boot(null);
s = planla({ sablon: ['sabah', 'ogle', 'tam', 'yok', 'yok', 'yok', 'yok'], sure: 'sabit' });
const oturumlar = g => new Set((s.plan[g] || []).map(t => t.oturum));
ok([...oturumlar(0)].every(o => ['s1', 's2', 's3', 'ak'].includes(o)) && !oturumlar(0).has('tk'), 'Sabah günü: yalnızca s1–s3, tekrar bloğu yok', [...oturumlar(0)].join(','));
ok([...oturumlar(1)].every(o => ['s4', 's5', 'tk', 'ak'].includes(o)) && !oturumlar(1).has('s1'), 'Öğleden sonra günü: yalnızca s4, s5, tekrar', [...oturumlar(1)].join(','));
ok(oturumlar(2).has('s1') && oturumlar(2).has('s5') && oturumlar(2).has('tk'), 'Tam gün: tüm oturumlar');
ok((s.plan[3] || []).every(t => t.tip === 'aksam'), 'Dinlenme gününde yalnızca akşam etüdü olabilir');

/* ------------------------------------------------------------------ */
bolum('F · Konu kapsamı (plana girecek konular)');
boot(null);
click('planac'); click('kapsamac');
const eb = /data-a="kaptoggle" data-id="(eb:[^"]+)"/g; let m, ebIds = [];
while ((m = eb.exec(sheet()))) ebIds.push(m[1]);
ok(ebIds.length > 50, 'Kapsam sayfasında Eğitim Bilimleri konuları listelenir', ebIds.length);
click('kaptoggle', { id: ebIds[0] });
ok(S().planAyarlar.atla[ebIds[0]] === true, 'Konu kapatılınca atla listesine girer');
click('kapbasla', { id: ebIds[4] });
let a = S().planAyarlar.atla;
ok([0, 1, 2, 3].every(i => a[ebIds[i]]) && !a[ebIds[4]], '"Buradan başla": öncekiler kapanır, seçilen açık');
click('kapsamkapat'); click('wzolustur');
s = S();
const planIds = tumKonuGorevleri(s).map(t => t.konuId);
ok(!planIds.some(id => [0, 1, 2, 3].map(i => ebIds[i]).includes(id)), 'Kapalı konular plana yazılmaz');
ok(konuGorevleri(s, 0).find(t => t.ders === 'Eğitim Bilimleri').konuId === ebIds[4], 'Plan seçilen konudan başlar');
ok(!S().durum[ebIds[0]], 'Plan dışı konu "Bitti" sayılmaz');
click('planac'); click('kapsamac'); click('kapsifirla');
ok(Object.keys(S().planAyarlar.atla).filter(k => k.startsWith('eb:')).length === 0, '"Hepsini planla" dersin kapalı konularını açar');

/* ------------------------------------------------------------------ */
bolum('G · Süre hesabı');
boot(null);
s = planla({ dersler: ['eb'], sure: 'gercek', hiz: 1.5, duzen: 'sirali' });
const ebBlok = konuGorevleri(s, 0)[0];
ok(dk(ebBlok.bit) - dk(ebBlok.bas) === 65, 'Gerçek süre: EB konusu 1,5x’te 65 dk', ebBlok.bas + '–' + ebBlok.bit);
boot(null);
s = planla({ dersler: ['eb'], sure: 'sabit', hiz: 1.5, duzen: 'sirali' });
const ebSabit = konuGorevleri(s, 0)[0];
ok(dk(ebSabit.bit) - dk(ebSabit.bas) === 30, 'Sabit süre: 1,5x’te 30 dk');
boot(null);
click('toggle', { id: 'eb:egitimin-temel-kavramlari-ve-islevleri' });
ok(S().bitis['eb:egitimin-temel-kavramlari-ve-islevleri'].dk === 65, 'Bitiş kaydı dersin gerçek süresiyle tutulur');

/* ------------------------------------------------------------------ */
bolum('H · Çakışma ve taşma yok (farklı ayarlarla)');
const ayarlar = [
  { sure: 'gercek', hiz: 1 }, { sure: 'gercek', hiz: 2 }, { sure: 'sabit', hiz: 1.25 },
  { sure: 'gercek', hiz: 1.5, maks: 3, duzen: 'agirlikli', dersler: ['eb', 'sz', 'sy', 'mv', 'ta', 'cg', 'ok'] }
];
ayarlar.forEach((ay, ix) => {
  setNow('2026-10-12T08:00:00'); boot(null);
  const sp = planla(ay);
  let hata = '';
  [0, 1, 2, 3, 4].forEach(g => {
    const liste = (sp.plan[g] || []).filter(t => t.bas && t.bit && t.tip !== 'aksam').sort((x, y) => dk(x.bas) - dk(y.bas));
    liste.forEach((t, i) => {
      const o = ({ s1: ['09:00', '10:30'], s2: ['10:45', '12:15'], s3: ['12:30', '14:00'], s4: ['14:30', '16:00'], s5: ['16:00', '16:30'], tk: ['16:30', '17:00'] })[t.oturum];
      if (o && (dk(t.bas) < dk(o[0]) || dk(t.bit) > dk(o[1]))) hata += GUN[g] + ' ' + t.bas + '–' + t.bit + ' oturum dışı; ';
      if (i && dk(t.bas) < dk(liste[i - 1].bit)) hata += GUN[g] + ' çakışma ' + liste[i - 1].bit + '/' + t.bas + '; ';
    });
  });
  ok(!hata, 'Ayar ' + (ix + 1) + ': bloklar oturum sınırları içinde ve çakışmıyor', hata);
});
// gün ortasında yeniden planlama + elle eklenen blok
setNow('2026-10-13T10:00:00'); boot(null);
planla({ sure: 'gercek' });
click('gtoggle', { g: '1', j: '0' });
setNow('2026-10-13T11:00:00'); boot(S());
s = planla({ sure: 'gercek' });
const sal = (s.plan[1] || []).filter(t => t.bas && t.bit && t.tip !== 'aksam').sort((x, y) => dk(x.bas) - dk(y.bas));
let cak = ''; sal.forEach((t, i) => { if (i && dk(t.bas) < dk(sal[i - 1].bit)) cak += sal[i - 1].bit + '/' + t.bas + ' '; });
ok(!cak, 'Gün içinde yeniden planlayınca biten blokla yeni bloklar çakışmaz', cak);

/* ------------------------------------------------------------------ */
bolum('I · Sihirbaz: önizleme ve sınav hedefi');
setNow('2026-10-17T10:00:00'); boot(null);
click('planac');
let w = sheet();
ok(/Önizleme/.test(w) && /gelecek haftaya/.test(w), 'Cumartesi önizleme planın gelecek haftaya yazılacağını söyler');
ok(/Haftada yaklaşık \d+ konu/.test(w), 'Haftalık tempo özeti var');
ok(/AGS sınavına \d+ hafta/.test(w) || /AGS sınavından yaklaşık/.test(w), 'Sınav hedefi tahmini var', text(w).slice(text(w).indexOf('Haftada'), text(w).indexOf('Haftada') + 300));
setNow('2026-10-14T13:00:00'); boot(null);
click('planac');
ok(/kalan günleri planlanır/.test(sheet()), 'Hafta içi önizleme "bu haftanın kalan günleri" der');
click('wzders', { id: 'eb' }); click('wzders', { id: 'ok' });
ok(/En az bir ders seç/.test(sheet()) && /disabled/.test(sheet().slice(sheet().indexOf('wzolustur') - 40, sheet().indexOf('wzolustur') + 80)), 'Ders seçilmezse oluşturma kapalı');

/* ------------------------------------------------------------------ */
bolum('J · Hız ayarı tek yerde');
setNow('2026-10-12T08:00:00'); boot(null);
click('surehiz', { val: '1.75' });
ok(S().planAyarlar.hiz === 1.75, 'Süre Analizi hızı plan ayarını da değiştirir');
planla({ hiz: 1.25 });
ok(S().hiz === 1.25 && S().planAyarlar.hiz === 1.25, 'Sihirbaz hızı Süre Analizi ile eşitlenir');

/* ------------------------------------------------------------------ */
bolum('K · Tamamlananlar sekmesi');
setNow('2026-10-14T13:00:00'); boot(null);
click('nav', { id: 'gecmis' });
ok(/Henüz bitirilen konu yok/.test(main()), 'Boşken açıklayıcı mesaj gösterir');
boot(null);
click('toggle', { id: 'eb:egitimin-temel-kavramlari-ve-islevleri' });
click('nav', { id: 'gecmis' });
ok(/gc-row/.test(main()) && /1 sa 5 dk/.test(text(main())), 'Biten konu ve süresi listelenir (65 dk = 1 sa 5 dk)', text(main()).slice(0, 200));

/* ------------------------------------------------------------------ */
bolum('L · Çok haftalık ve bitene kadar planlama');
setNow('2026-10-12T08:00:00'); boot(null);
s = planla({ dersler: ['eb', 'ok'], kapsam: 'hepsi', duzen: 'sirali', sure: 'sabit' });
ok(s.planlar && typeof s.planlar === 'object', 'Planlar nesnesi oluşur');
const haftalar = Object.keys(s.planlar);
ok(haftalar.length > 1, 'Konular bitene kadar seçilince birden fazla hafta üretilir (' + haftalar.length + ' hafta)', haftalar.length);
ok(haftalar[0] === '2026-10-12', 'İlk hafta bu haftadır', haftalar[0]);
let toplamK = 0;
haftalar.forEach(wk => {
  for (let g = 0; g < 7; g++) (s.planlar[wk][g] || []).forEach(t => { if (t.tip === 'konu') toplamK++; });
});
ok(toplamK >= 50, 'Tüm müfredattaki konular haftalara dağıtıldı (' + toplamK + ' konu)', toplamK);

// 4 haftalık plan testi
boot(null);
s = planla({ dersler: ['eb', 'ok'], kapsam: '4h', duzen: 'sirali', sure: 'sabit' });
const hf4 = Object.keys(s.planlar);
ok(hf4.length === 4, '4 haftalık plan seçilince tam 4 hafta üretilir', hf4.length);

/* ------------------------------------------------------------------ */
bolum('M · Aylık ve Yol Haritası (Bitişe Kadar) görünümleri');
click('nav', { id: 'plan' });
ok(/pl-mod-bar/.test(main()), 'Görünüm modu sekmesi görüntülenir');
click('plmod', { m: 'ay' });
ok(/pl-cal-wrap/.test(main()), 'Aylık takvim görünümüne geçilir');
ok(/pl-cal-day/.test(main()), 'Aylık takvimde gün hücreleri vardır');
ok(/pl-cal-summary/.test(main()), 'Ay özeti istatistikleri görüntülenir');
click('plmod', { m: 'bitis' });
ok(/pl-road-wrap/.test(main()), 'Yol haritası (Bitişe Kadar) görünümüne geçilir');
ok(/Bitiş Hedefi/.test(main()) && /pl-road-card/.test(main()), 'Bitiş hedefi ve hafta kartları görüntülenir');

/* ------------------------------------------------------------------ */
bolum('N · Hafta ve Gün gezinmeleri');
click('plmod', { m: 'hafta' });
const ilkHb = S().planHafta;
click('plhafta', { d: '1' });
ok(S().planHafta > ilkHb, 'Sonraki haftaya geçildi', S().planHafta);
click('plbuhafta');
ok(S().planHafta === '2026-10-12', 'Bu haftaya dönüldü', S().planHafta);
click('plmod', { m: 'ay' });
click('plgunagit', { tarih: '2026-10-15' });
ok(S().planHafta === '2026-10-12', 'Güne tıklayınca o haftaya ve haftalık görünüme dönülür');

console.log('\n' + gecen + ' geçti, ' + kalan + ' kaldı');
process.exit(kalan ? 1 : 0);
