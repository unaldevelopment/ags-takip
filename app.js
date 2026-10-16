(function () {
  'use strict';

  /* ================= Yardımcılar ================= */
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var slug = function (s) {
    return String(s || '').replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
      .replace(/ç/g, 'c').replace(/Ç/g, 'c')
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
      .replace(/ö/g, 'o').replace(/Ö/g, 'o')
      .replace(/ş/g, 's').replace(/Ş/g, 's')
      .replace(/ü/g, 'u').replace(/Ü/g, 'u')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  var bugunStr = function () {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  };
  var fmtTarih = function (s) {
    var p = String(s).split('-');
    return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : s;
  };
  var fmtKisa = function (s) {
    var p = String(s).split('-');
    return p.length === 3 ? p[2] + '.' + p[1] : s;
  };
  var gunEkle = function (str, n) {
    var p = str.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2] + n);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  };
  // Sadece http/https adreslerine izin ver (javascript: gibi şemaları reddet)
  var urlDuzelt = function (s) {
    s = String(s || '').trim();
    if (!s) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = 'https://' + s;
    try {
      var u = new URL(s);
      return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '';
    } catch (e) { return ''; }
  };
  var urlHost = function (s) {
    try { return new URL(s).hostname.replace(/^www\./, ''); } catch (e) { return s; }
  };

  /* ================= Durumlar ================= */
  // p: ilerleme katkısı. Bitti = tam, Çalışılıyor ve Tekrar gerekli = yarım.
  var DURUMLAR = [
    { k: 0, ad: 'Başlanmadı', p: 0 },
    { k: 1, ad: 'Çalışılıyor', p: 0.5 },
    { k: 2, ad: 'Bitti', p: 1 },
    { k: 3, ad: 'Tekrar gerekli', p: 0.5 }
  ];
  var GUNLER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  /* ================= İkonlar ================= */
  var svg = function (p) {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  };
  var IC = {
    panel: svg('<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>'),
    ags: svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    oabt: svg('<path d="M9 3h6M10 3v6L4.5 19a1.6 1.6 0 0 0 1.4 2.4h12.2a1.6 1.6 0 0 0 1.4-2.4L14 9V3"/><path d="M7.5 15h9"/>'),
    deneme: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
    plan: svg('<rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    sureler: svg('<circle cx="12" cy="12" r="9"/><polygon points="10 8 16 12 10 16 10 8"/>'),
    settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    cal: svg('<rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    flask: svg('<path d="M10 2v6.5L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 8.5V2h-4z"/><path d="M8.5 2h7M7 16h10"/>'),
    pen: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'),
    check: svg('<polyline points="20 6 9 17 4 12"/>'),
    trash: svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
    play: svg('<polygon points="5 3 19 12 5 21 5 3"/>'),
    x: svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
    plus: svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>')
  };

  /* ================= Veri ================= */
  var STORE = 'ags-takip-v1';

  function varsayilan() {
    var plan = {};
    for (var i = 0; i < 7; i++) plan[i] = [];
    return {
      durum: {},      // konuId -> 0..3 (0 saklanmaz)
      notlar: {},     // konuId -> metin
      ozel: {},       // dersId -> [{id, ad}]
      linkler: {},    // konuId -> video/kaynak adresi
      dersLink: {},   // dersId -> oynatma listesi / kanal adresi
      tekrar: {},     // konuId -> { n: kaçıncı tekrar, sonraki: 'YYYY-MM-DD', sonTekrar: 'YYYY-MM-DD' }
      istatistik: { seri: 0, sonTarih: '', toplamTekrar: 0 },
      denemeler: [],  // {id, tur, ad, tarih, d, y, b, net}
      plan: plan,     // gün indeksi -> [{t, done}]
      tarih: { ags: '2027-07-10', oabt: '2027-07-11', onayli: false },
      hiz: 2.0,       // varsayılan video oynatma hızı (2.0x)
      hedef: 2.0,     // günlük hedef izleme/çalışma süresi (saat)
      planHafta: '',  // planın ait olduğu haftanın Pazartesi tarihi (YYYY-MM-DD)
      planAyarlar: {  // akıllı planlayıcı tercihleri
        v2: true,
        hiz: 1.5,
        aktifGunler: [true, true, true, true, true, false, false], // Pzt-Cuma kütüphane
        aksamGunler: [true, true, true, true, false, false, false], // 21:00-22:30 akşam etüdü (Pzt-Per)
        seciliDersler: ['eb', 'ok']
      }
    };
  }

  function yukle() {
    var d = varsayilan();
    try {
      var r = JSON.parse(localStorage.getItem(STORE));
      if (r && typeof r === 'object') {
        Object.keys(d).forEach(function (k) { if (r[k] !== undefined) d[k] = r[k]; });
        for (var i = 0; i < 7; i++) if (!Array.isArray(d.plan[i])) d.plan[i] = [];
        if (!d.istatistik) d.istatistik = { seri: 0, sonTarih: '', toplamTekrar: 0 };
        if (!d.planAyarlar) d.planAyarlar = varsayilan().planAyarlar;
      }
    } catch (e) {
      /* bozuk veri: ezmeden önce ham kaydı yedekle, sonra varsayılana dön */
      try { localStorage.setItem(STORE + '-bozuk-yedek', localStorage.getItem(STORE)); } catch (e2) {}
    }
    return d;
  }

  var S = yukle();
  var ui = {
    view: 'panel',
    ders: 'eb',
    agsDers: 'eb',
    denemeTur: 'ags',
    acikNot: {},
    sadeceTekrar: false,
    takvimAcik: false,
    sureHiz: S.hiz || 2.0,
    sureHedef: S.hedef || 2.0,
    sureKat: 'eb',
    planWizardAcik: false,
    planPaket: (S.planAyarlar && S.planAyarlar.paket) || 'kutuphane_tam',
    planHiz: (S.planAyarlar && S.planAyarlar.hiz) || (S.hiz || 2.0),
    planGunlukSaat: (S.planAyarlar && S.planAyarlar.gunlukSaat) || 7.0,
    planAktifGunler: ((S.planAyarlar && S.planAyarlar.aktifGunler) || [true, true, true, true, true, false, false]).slice(),
    planAksamGunler: ((S.planAyarlar && S.planAyarlar.aksamGunler) || [true, true, true, true, false, false, false]).slice(),
    planTekrarModu: (S.planAyarlar && S.planAyarlar.tekrarModu) || 'gunluk1saat',
    planSaatler: ((S.planAyarlar && S.planAyarlar.saatler) || [7, 7, 7, 7, 7, 0, 0]).slice(),
    planSeciliDersler: ((S.planAyarlar && S.planAyarlar.seciliDersler) || ['eb', 'ok']).slice(),
    planTab: 'cizelge' // 'cizelge' veya 'projeksiyon'
  };

  function kaydet() {
    try { localStorage.setItem(STORE, JSON.stringify(S)); }
    catch (e) { toast('Kaydedilemedi: tarayıcı depolaması dolu ya da kapalı.'); }
  }

  function dersBul(id) {
    for (var i = 0; i < DERSLER.length; i++) if (DERSLER[i].id === id) return DERSLER[i];
    return DERSLER[0];
  }

  // Bir dersin gruplarını (özel eklenen konularla birlikte) döndürür
  function gruplar(d) {
    var g = d.gruplar.map(function (gr) {
      return {
        ad: gr.ad,
        konular: gr.konular.map(function (k) { return { id: d.id + ':' + slug(k), ad: k, ozel: false }; })
      };
    });
    var oz = S.ozel[d.id] || [];
    if (oz.length) {
      g.push({
        ad: 'Eklediğim Konular',
        konular: oz.map(function (k) { return { id: k.id, ad: k.ad, ozel: true }; })
      });
    }
    return g;
  }

  function tumKonular(d) {
    var out = [];
    gruplar(d).forEach(function (g) { out = out.concat(g.konular); });
    return out;
  }

  // Konunun gerçek durumu. 'Bitti' işareti, kullanıcı kendisi değiştirmedikçe değişmez.
  function etkinDurum(id) {
    return S.durum[id] || 0;
  }

  // Tekrar vakti geldi mi? (durumdan bağımsız: Bitti konu bitti kalır, yanında uyarı çıkar)
  function tekrarVakti(id) {
    var tk = S.tekrar[id];
    var st = S.durum[id] || 0;
    return !!(tk && tk.sonraki && tk.sonraki <= bugunStr() && (st === 2 || st === 3));
  }

  function puan(id) {
    var st = etkinDurum(id);
    return DURUMLAR[st].p;
  }

  function ilerleme(konular) {
    if (!konular.length) return 0;
    var t = 0;
    konular.forEach(function (k) { t += puan(k.id); });
    return Math.round((t / konular.length) * 100);
  }

  function sayilar(konular) {
    var c = [0, 0, 0, 0];
    konular.forEach(function (k) { c[etkinDurum(k.id)]++; });
    return c;
  }

  /* ================= Bilimsel Aralıklı Tekrar Sistemi =================
     Kullanıcı Kuralı:
     1. Konu tamamlandığında (Bitti): 1 Hafta sonra (7 gün) ilk tekrar!
     2. İlk tekrardan sonra: 3 Hafta sonra (21 gün) pekiştirme tekrarı!
     3. İkinci tekrardan sonra: Her ay (30 gün) periyodik kalıcı hafıza tekrarı!
  ======================================================================= */
  function asamaBilgisi(id) {
    var tk = S.tekrar[id];
    if (!tk) return null;
    var bugun = bugunStr();
    var n = tk.n || 0;
    var gunFarki = kalanGun(tk.sonraki);
    var asamaMetin = '';
    if (n === 0) {
      asamaMetin = '1. Hafta Tekrarı';
    } else if (n === 1) {
      asamaMetin = '3. Hafta Tekrarı';
    } else {
      asamaMetin = (n + 1) + '. Tekrar (Aylık)';
    }
    var vaktGeldi = (tk.sonraki <= bugun);
    return {
      n: n,
      asamaMetin: asamaMetin,
      sonraki: tk.sonraki,
      gunFarki: gunFarki,
      vaktGeldi: vaktGeldi
    };
  }

  function durumAyarla(id, v) {
    if (v) S.durum[id] = v; else delete S.durum[id];
    var bugun = bugunStr();
    if (v === 2) {
      // Bitti yapıldığında: İlk tekrar tam 1 hafta (7 gün) sonraya kurulur!
      if (!S.tekrar[id]) {
        S.tekrar[id] = { n: 0, sonraki: gunEkle(bugun, 7), baslangic: bugun };
      }
    } else if (v === 3) {
      // Manuel tekrar gerekli dendiğinde: Hemen bugüne planlanır
      S.tekrar[id] = { n: S.tekrar[id] ? S.tekrar[id].n : 0, sonraki: bugun };
    } else {
      delete S.tekrar[id];
    }
  }

  function tekrarYap(id) {
    var tk = S.tekrar[id] || { n: 0 };
    var bugun = bugunStr();
    var suankiN = tk.n || 0;
    var yeniN = suankiN + 1;
    // 1. tekrar bittiyse -> 3 hafta sonra (21 gün)
    // 2. ve sonraki tekrarlar bittiyse -> her ay (30 gün)
    var sonrakiGunler = (yeniN === 1 ? 21 : 30);

    // Geri alma için önceki durumu sakla
    ui.geriAl = {
      id: id,
      tekrar: S.tekrar[id] ? JSON.parse(JSON.stringify(S.tekrar[id])) : null,
      durum: S.durum[id] || 0,
      ist: JSON.parse(JSON.stringify(S.istatistik || { seri: 0, sonTarih: '', toplamTekrar: 0 })),
      gorevler: []
    };

    S.tekrar[id] = {
      n: yeniN,
      sonraki: gunEkle(bugun, sonrakiGunler),
      sonTekrar: bugun
    };
    S.durum[id] = 2; // Tekrar Bitti (Taze Hafıza) durumuna yükselir

    // Haftalık plandaki bu konunun bekleyen tekrar blokları da tamamlanır
    for (var pg = 0; pg < 7; pg++) {
      (S.plan[pg] || []).forEach(function (t) {
        if (t.tip === 'tekrar' && t.repeatKonuId === id && !t.done) {
          t.done = true;
          ui.geriAl.gorevler.push(t);
        }
      });
    }

    // Seri & İstatistik yönetimi
    if (!S.istatistik) S.istatistik = { seri: 0, sonTarih: '', toplamTekrar: 0 };
    S.istatistik.toplamTekrar = (S.istatistik.toplamTekrar || 0) + 1;

    var dun = gunEkle(bugun, -1);
    if (S.istatistik.sonTarih === bugun) {
      // Bugün zaten tekrar yapılmış, seri korunuyor
    } else if (S.istatistik.sonTarih === dun) {
      S.istatistik.seri = (S.istatistik.seri || 0) + 1;
      S.istatistik.sonTarih = bugun;
    } else {
      S.istatistik.seri = 1;
      S.istatistik.sonTarih = bugun;
    }

    kaydet();
    renderKorumali();

    var msg = '';
    if (yeniN === 1) {
      msg = '1. tekrar tamamlandı. Sonraki tekrar 3 hafta sonra.';
    } else if (yeniN === 2) {
      msg = '2. tekrar tamamlandı. Konu aylık kalıcı hafıza döngüsüne girdi.';
    } else {
      msg = yeniN + '. tekrar tamamlandı. Sonraki tekrar 1 ay sonra.';
    }
    toast(msg, true);
  }

  function bugunTekrarlar() {
    var bugun = bugunStr(), out = [];
    DERSLER.forEach(function (d) {
      tumKonular(d).forEach(function (k) {
        var tk = S.tekrar[k.id];
        if (tk && tekrarVakti(k.id)) {
          out.push({ k: k, d: d, tk: tk, info: asamaBilgisi(k.id) });
        }
      });
    });
    out.sort(function (a, b) { return a.tk.sonraki < b.tk.sonraki ? -1 : a.tk.sonraki > b.tk.sonraki ? 1 : 0; });
    return out;
  }

  function gelecek7GunTekrarlari() {
    var bugun = bugunStr();
    var gunler = [];
    var gunKisaAdlari = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    for (var i = 0; i < 7; i++) {
      var tStr = gunEkle(bugun, i);
      var parts = tStr.split('-');
      var dt = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      var sayi = 0;
      DERSLER.forEach(function (ders) {
        tumKonular(ders).forEach(function (k) {
          var tk = S.tekrar[k.id];
          var st0 = S.durum[k.id];
          if (tk && (st0 === 2 || st0 === 3) && (i === 0 ? tk.sonraki <= tStr : tk.sonraki === tStr)) {
            sayi++;
          }
        });
      });
      gunler.push({
        tarih: tStr,
        kisaTarih: fmtKisa(tStr),
        etiket: (i === 0 ? 'Bugün' : (i === 1 ? 'Yarın' : gunKisaAdlari[dt.getDay()])),
        sayi: sayi
      });
    }
    return gunler;
  }

  function tekrarKarti() {
    var liste = bugunTekrarlar();
    var tumBitenler = 0;
    var kaliciHafiza = 0;

    DERSLER.forEach(function (d) {
      tumKonular(d).forEach(function (k) {
        var tk = S.tekrar[k.id];
        if (tk) {
          tumBitenler++;
          if (tk.n >= 2) kaliciHafiza++;
        }
      });
    });

    if (liste.length > 0) {
      var h = '<div class="card-station due-active">' +
        '<div class="station-header">' +
          '<div class="station-title-box">' +
            '<h2 class="station-title">Bugün Tekrar Zamanı Gelen Konular (' + liste.length + ')</h2>' +
            '<span class="station-subtitle">10-15 dakikalık aralıklı tekrarını yap, hafızanda kalıcı kalsın:</span>' +
          '</div>' +
          '<span class="badge-pill badge-amber">' + liste.length + ' tekrar bekliyor</span>' +
        '</div>' +
        '<div class="ti-list-due">';
      liste.forEach(function (x) {
        var gecText = (x.info && x.info.gunFarki < 0) ? ' <b class="gecikme">(' + Math.abs(x.info.gunFarki) + ' gün gecikti)</b>' : '';
        h += '<div class="ti-item-due">' +
          '<div class="ti-item-left">' +
            '<div class="ti-item-meta">' + esc(x.d.kisa) + ' · ' + (x.info ? x.info.asamaMetin : 'Tekrar') + gecText + '</div>' +
            '<div class="ti-item-title">' + esc(x.k.ad) + '</div>' +
          '</div>' +
          '<div class="ti-item-actions">' +
            '<button class="btn-repeat-ok" data-a="tekrarok" data-id="' + esc(x.k.id) + '">✓ Tekrar Ettim</button>' +
            '<button class="btn-repeat-defer" data-a="tekrarertele" data-id="' + esc(x.k.id) + '">Yarına Ertele</button>' +
          '</div>' +
        '</div>';
      });
      h += '</div></div>';
      return h;
    } else {
      // Tekrar bekleyen yoksa: Minimal, temiz, yer kaplamayan onay kartı
      var h = '<div class="card-station clean-status">' +
        '<div class="station-clean-row">' +
          '<div class="station-clean-left">' +
            '<span class="station-check-ico">' + IC.check + '</span>' +
            '<div>' +
              '<b class="clean-title">Tüm Tekrarlar Güncel</b>' +
              '<span class="clean-sub">Bugün bekleyen tekrarın yok. Tamamlanan ' + tumBitenler + ' konun hafızanda güvende (' + kaliciHafiza + ' konu kalıcı bellekte).</span>' +
            '</div>' +
          '</div>' +
          '<button class="btn-toggle-7day" data-a="toggle7day">' +
            (ui.takvimAcik ? 'Takvimi Gizle' : '7 Günlük Tekrar Takvimi') +
          '</button>' +
        '</div>';

      if (ui.takvimAcik) {
        var gelecekGunler = gelecek7GunTekrarlari();
        h += '<div class="schedule-section" style="margin-top:16px;">' +
          '<div class="schedule-heading">Önümüzdeki 7 günün tekrar dağılımı:</div>' +
          '<div class="schedule-grid-7">';
        gelecekGunler.forEach(function (g, idx) {
          var isToday = (idx === 0);
          h += '<div class="day-box' + (isToday ? ' is-today' : '') + '">' +
            '<span class="day-lbl">' + g.etiket + '</span>' +
            '<b class="day-count">' + g.sayi + '</b>' +
            '<small class="day-date">' + g.kisaTarih + '</small>' +
          '</div>';
        });
        h += '</div></div>';
      }

      h += '</div>';
      return h;
    }
  }

  /* ================= Geri sayım ================= */
  function kalanGun(tarih) {
    if (!tarih) return null;
    var p = tarih.split('-');
    var hedef = new Date(+p[0], +p[1] - 1, +p[2]);
    var simdi = new Date();
    var bugun = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());
    return Math.round((hedef - bugun) / 86400000);
  }

  function sayacChip(ad, tarih) {
    var n = kalanGun(tarih);
    var yazi;
    if (n === null || isNaN(n) || !tarih) {
      yazi = ad + ': Tarih gir';
    } else if (n < 0) {
      yazi = ad + ' tarihi geçti';
    } else if (n === 0) {
      yazi = ad + ' bugün!';
    } else {
      yazi = ad + '\'ye <span class="days-num">' + n + ' gün</span>';
    }
    return '<button class="chip-countdown" data-a="settings" aria-label="' + esc(ad) + ' sınav tarihi ayarları">' +
      IC.cal + '<span>' + yazi + '</span></button>';
  }

  function head(baslik) {
    return '<div class="head"><h1>' + esc(baslik) + '</h1>' +
      '<div class="head-badges">' +
      sayacChip('AGS', S.tarih.ags) +
      sayacChip('ÖABT', S.tarih.oabt) +
      '</div></div>';
  }

  /* ================= Konu listesi bileşeni ================= */
  function dersKaynak(d) {
    var u = S.dersLink[d.id];
    var tekrarSayisi = 0;
    tumKonular(d).forEach(function (k) {
      if (tekrarVakti(k.id)) tekrarSayisi++;
    });

    var kaynakHtml = u
      ? '<a class="side-resource-link" href="' + esc(urlDuzelt(u)) + '" target="_blank" rel="noopener noreferrer">Ders kaynağı: ' + esc(urlHost(u)) + '</a>'
      : '<span class="side-resource-empty">Ders kaynağı (YouTube listesi vb.) eklenmemiş</span>';

    return '<div class="side-resource-row">' +
        kaynakHtml +
        '<button class="btn-icon-44" data-a="derslink" data-id="' + d.id + '" aria-label="Ders kaynağını düzenle" title="Ders kaynağı linkini düzenle">' + IC.pen + '</button>' +
      '</div>' +
      '<button class="btn-filter-repeat' + (ui.sadeceTekrar ? ' active' : '') + '" data-a="tekrarfiltre">' +
        (ui.sadeceTekrar ? 'Tüm Konuları Göster' : 'Sadece tekrar bekleyenler' + (tekrarSayisi ? ' (' + tekrarSayisi + ')' : '')) +
      '</button>';
  }

  function konuListesi(d, opts) {
    opts = opts || {};
    var html = '';
    gruplar(d).forEach(function (g) {
      var filtrelenmis = g.konular.filter(function (k) {
        if (!ui.sadeceTekrar) return true;
        return tekrarVakti(k.id);
      });

      if (filtrelenmis.length > 0 || !ui.sadeceTekrar) {
        if (g.ad) {
          html += '<div class="topic-group-header">' +
            '<span class="topic-group-title">' + esc(g.ad) + '</span>' +
            '<span class="topic-group-pct">%' + ilerleme(g.konular) + '</span>' +
          '</div>';
        }
        html += '<ul class="topic-list-ul">';
        filtrelenmis.forEach(function (k) {
          var st = etkinDurum(k.id);
          var notVar = !!S.notlar[k.id];
          var vakit = tekrarVakti(k.id);
          var link = S.linkler[k.id];

          html += '<li class="topic-row-item' + (st === 2 ? ' done' : '') + '">' +
            '<input type="checkbox" class="chk-box-custom" data-a="toggle" data-id="' + esc(k.id) + '"' + (st === 2 ? ' checked' : '') + ' aria-label="Bitti olarak işaretle">' +
            '<span class="topic-name-text" title="' + esc(k.ad) + '">' + esc(k.ad) + '</span>' +
            (vakit ? '<span class="tekrar-tag">Tekrar zamanı</span>' : '') +
            '<button class="topic-status-pill s' + st + '" data-a="cycle" data-id="' + esc(k.id) + '">' + DURUMLAR[st].ad + '</button>' +
            '<button class="btn-icon-44' + (notVar || link ? ' has-note' : '') + '" data-a="not" data-id="' + esc(k.id) + '" aria-label="Düzenle" title="Not ve video linki">' + IC.pen + '</button>' +
            (k.ozel ? '<button class="btn-icon-44" data-a="delkonu" data-ders="' + d.id + '" data-id="' + esc(k.id) + '" aria-label="Konuyu sil" title="Konuyu sil">' + IC.trash + '</button>' : '') +
            '</li>';

          if (ui.acikNot[k.id]) {
            html += '<li class="topic-note-editor">' +
              '<input class="input-dark-48 linkin" type="url" inputmode="url" data-link="' + esc(k.id) + '" value="' + esc(link || '') + '" placeholder="Video / kaynak linki (YouTube vb.)">' +
              '<textarea class="note-textarea" data-note="' + esc(k.id) + '" placeholder="Notlarınız, video adı, dakika bilgisi...">' + esc(S.notlar[k.id] || '') + '</textarea>' +
              '</li>';
          }
        });
        html += '</ul>';
      }
    });

    if (ui.sadeceTekrar && tumKonular(d).filter(function (k) { return tekrarVakti(k.id); }).length === 0) {
      html += '<div class="ti-empty" style="margin-top:14px; text-align:center; padding:20px; color:#9aa7ba;">Bu derste şu an tekrar bekleyen konu yok.</div>';
    }

    html += '<form class="add-form" data-form="konuekle" data-ders="' + d.id + '" style="margin-top:16px; display:flex; gap:8px;">' +
      '<input name="ad" class="input-dark-48" style="margin-bottom:0;" placeholder="Yeni konu ekle..." autocomplete="off" required>' +
      '<button class="btn-backup" style="width:auto; padding:0 20px; background:#2563eb; border-color:#2563eb; color:#fff;" type="submit">Ekle</button></form>';
    return html;
  }

  /* ================= Görünümler ================= */
  function halka(yuzde) {
    var r = 56, c = 2 * Math.PI * r, off = c * (1 - yuzde / 100);
    return '<div class="ring-wrap">' +
      '<svg width="140" height="140" viewBox="0 0 140 140">' +
      '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="#1f2938" stroke-width="14"/>' +
      '<circle cx="70" cy="70" r="' + r + '" fill="none" stroke="#2563eb" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '" transform="rotate(-90 70 70)"/>' +
      '<text x="70" y="70" dy="0.36em" text-anchor="middle" font-family="\'Bricolage Grotesque\', sans-serif" font-size="30" font-weight="700" fill="#e8edf5">%' + yuzde + '</text>' +
      '</svg></div>';
  }

  function viewPanel() {
    var tum = [], ags = [], oabt = [];
    DERSLER.forEach(function (d) {
      var k = tumKonular(d);
      tum = tum.concat(k);
      if (d.sinav === 'ags') ags = ags.concat(k); else oabt = oabt.concat(k);
    });
    var c = sayilar(tum);
    var genel = ilerleme(tum);

    var h = head('Panel') + '<div class="panel-grid-v3">';

    // Sol Sütun (Esnek Geniş)
    h += '<div class="col-left">';

    // a) Genel ilerleme kartı
    h += '<div class="card-overall">' +
      '<div class="overall-top">' +
        halka(genel) +
        '<div class="overall-details">' +
          '<div class="overall-big-num">%' + genel + '</div>' +
          '<div class="overall-sub-text">Genel ilerleme · ' + tum.length + ' konu</div>' +
          '<div class="overall-sub-exams">AGS %' + ilerleme(ags) + ' · ÖABT Kimya %' + ilerleme(oabt) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="badge-row">' +
        '<span class="badge-pill badge-green">Bitti ' + c[2] + '</span>' +
        '<span class="badge-pill badge-blue">Çalışıyor ' + c[1] + '</span>' +
        '<span class="badge-pill badge-amber">Tekrar zamanı ' + bugunTekrarlar().length + '</span>' +
        '<span class="badge-pill badge-neutral">Başlanmadı ' + c[0] + '</span>' +
      '</div>' +
    '</div>';

    // b) Akıllı Hafıza & Tekrar İstasyonu kartı
    h += tekrarKarti();

    // c) Ders kartları: 4 sütunlu ızgara, 16 px boşluk
    h += '<div class="course-grid-4">';
    DERSLER.forEach(function (d) {
      var p = ilerleme(tumKonular(d));
      var isSelected = (ui.ders === d.id);
      h += '<button class="course-card-v3' + (isSelected ? ' active' : '') + '" data-a="ders" data-id="' + d.id + '">' +
        '<div class="course-top-info">' +
          '<div class="course-title-text">' + esc(d.kisa) + '</div>' +
          '<div class="course-questions-text">' + d.soru + ' soru · ' + (d.sinav === 'ags' ? 'AGS' : 'ÖABT') + '</div>' +
        '</div>' +
        '<div class="course-bar-wrap">' +
          '<div class="course-progress-bar"><div class="course-progress-fill" style="width:' + p + '%"></div></div>' +
          '<span class="course-progress-pct">%' + p + '</span>' +
        '</div>' +
      '</button>';
    });
    h += '</div>'; // end course-grid-4
    h += '</div>'; // end col-left

    // Sağ Sütun (440 px Konu Paneli)
    var sd = dersBul(ui.ders);
    h += '<div class="col-right-side">' +
      '<div class="side-header-sticky">' +
        '<h2 class="side-header-title">' + esc(sd.kisa) + '</h2>' +
        dersKaynak(sd) +
      '</div>' +
      '<div class="side-topics-scroll">' +
        konuListesi(sd) +
      '</div>' +
    '</div>';

    h += '</div>'; // end panel-grid-v3
    return h;
  }

  function viewAgs() {
    var agsDersler = DERSLER.filter(function (d) { return d.sinav === 'ags'; });
    var sd = dersBul(ui.agsDers);
    if (sd.sinav !== 'ags') sd = agsDersler[0];
    var h = head('AGS Dersleri') + '<div class="tabs">';
    agsDersler.forEach(function (d) {
      h += '<button class="tab' + (d.id === sd.id ? ' active' : '') + '" data-a="agsders" data-id="' + d.id + '">' +
        esc(d.kisa) + ' <small>' + d.soru + '</small></button>';
    });
    h += '</div>';
    var p = ilerleme(tumKonular(sd));
    h += '<div class="card"><div class="list-head"><h2>' + esc(sd.ad) + '</h2><div class="bar"><i style="width:' + p + '%"></i></div><b>%' + p + '</b></div>' +
      konuListesi(sd) + '</div>';
    return h;
  }

  function viewOabt() {
    var sd = dersBul('ok');
    var p = ilerleme(tumKonular(sd));
    return head('ÖABT Kimya') +
      '<div class="card"><div class="list-head"><h2>' + esc(sd.ad) + '</h2><div class="bar indigo"><i style="width:' + p + '%"></i></div><b>%' + p + '</b></div>' +
      '<p class="muted">Alan bilgisi yaklaşık 40, alan eğitimi yaklaşık 10 soru. 4 yanlış 1 doğruyu götürür.</p>' +
      konuListesi(sd) + '</div>';
  }

  /* ---- Denemeler ---- */
  var TOPLAM_SORU = { ags: 80, oabt: 50 };

  function grafik(liste, tur) {
    var max = TOPLAM_SORU[tur];
    var W = 600, H = 230, L = 36, R = 12, T = 14, B = 28;
    var iw = W - L - R, ih = H - T - B;
    var s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '">';
    for (var i = 0; i <= 4; i++) {
      var y = T + ih - (ih * i / 4);
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="#ece8e0"/>' +
        '<text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="#7b7889">' + Math.round(max * i / 4) + '</text>';
    }
    var renk = tur === 'ags' ? '#463f9a' : '#1fa39a';
    var n = liste.length;
    var pts = liste.map(function (d, i) {
      var x = n === 1 ? L + iw / 2 : L + iw * i / (n - 1);
      var y = T + ih - (Math.max(0, Math.min(max, d.net)) / max) * ih;
      return { x: x, y: y, d: d };
    });
    if (n > 1) {
      s += '<polyline fill="none" stroke="' + renk + '" stroke-width="3" stroke-linejoin="round" points="' +
        pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') + '"/>';
    }
    pts.forEach(function (p) {
      s += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5" fill="#fff" stroke="' + renk + '" stroke-width="3"/>' +
        '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 10).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + renk + '">' + p.d.net.toFixed(1) + '</text>';
    });
    return s + '</svg>';
  }

  function viewDeneme() {
    var tur = ui.denemeTur;
    var liste = S.denemeler.filter(function (d) { return d.tur === tur; })
      .sort(function (a, b) { return a.tarih < b.tarih ? -1 : a.tarih > b.tarih ? 1 : a.id - b.id; });
    var h = head('Deneme Sınavları') + '<div class="two"><div class="card"><h2>Yeni deneme</h2>' +
      '<form class="form" data-form="denemeekle" style="margin-top:12px">' +
      '<label>Sınav<select name="tur"><option value="ags"' + (tur === 'ags' ? ' selected' : '') + '>AGS (80 soru)</option><option value="oabt"' + (tur === 'oabt' ? ' selected' : '') + '>ÖABT Kimya (50 soru)</option></select></label>' +
      '<label>Deneme adı<input name="ad" placeholder="Örn. Yayın X - Deneme 3" autocomplete="off"></label>' +
      '<label>Tarih<input type="date" name="tarih" value="' + bugunStr() + '" required></label>' +
      '<div class="g3"><label>Doğru<input type="number" name="d" min="0" value="0" required inputmode="numeric"></label>' +
      '<label>Yanlış<input type="number" name="y" min="0" value="0" required inputmode="numeric"></label>' +
      '<label>Boş<input type="number" name="b" value="" disabled placeholder="otomatik"></label></div>' +
      '<div class="hint">Net = Doğru − Yanlış ÷ 4</div>' +
      '<button class="btn btn-primary" type="submit">Kaydet</button></form></div>';

    h += '<div class="card"><div class="tabs" style="margin-bottom:12px">' +
      '<button class="tab' + (tur === 'ags' ? ' active' : '') + '" data-a="denemetur" data-id="ags">AGS</button>' +
      '<button class="tab' + (tur === 'oabt' ? ' active' : '') + '" data-a="denemetur" data-id="oabt">ÖABT Kimya</button></div>';
    if (!liste.length) {
      h += '<div class="empty">Henüz ' + (tur === 'ags' ? 'AGS' : 'ÖABT') + ' denemesi yok.</div>';
    } else {
      var netler = liste.map(function (d) { return d.net; });
      var ort = netler.reduce(function (a, b) { return a + b; }, 0) / netler.length;
      h += '<div class="kpis"><div class="kpi"><b>' + netler[netler.length - 1].toFixed(1) + '</b><span>Son net</span></div>' +
        '<div class="kpi"><b>' + Math.max.apply(null, netler).toFixed(1) + '</b><span>En yüksek</span></div>' +
        '<div class="kpi"><b>' + ort.toFixed(1) + '</b><span>Ortalama</span></div></div>' +
        grafik(liste, tur) +
        '<table class="tbl"><thead><tr><th>Tarih</th><th>Deneme</th><th>D</th><th>Y</th><th>B</th><th>Net</th><th></th></tr></thead><tbody>';
      liste.slice().reverse().forEach(function (d) {
        h += '<tr><td>' + fmtTarih(d.tarih) + '</td><td>' + esc(d.ad || '-') + '</td><td>' + d.d + '</td><td>' + d.y + '</td><td>' + d.b + '</td><td><b>' + d.net.toFixed(2) + '</b></td>' +
          '<td><button class="ico" data-a="delden" data-id="' + d.id + '" title="Sil">✕</button></td></tr>';
      });
      h += '</tbody></table>';
    }
    return h + '</div></div>';
  }

  /* ================= Akıllı Çalışma & Tekrar Planlayıcı ================= */
  function planIcinKonular(paket, seciliDersler) {
    var havuz = [];
    if (paket === 'eb_kalan' || paket === 'eb_tumu') {
      var d = dersBul('eb');
      if (d) {
        gruplar(d).forEach(function (gr) {
          gr.konular.forEach(function (k) {
            var bitti = (etkinDurum(k.id) === 2);
            if (paket === 'eb_tumu' || !bitti) {
              havuz.push({
                dersAd: 'Eğitim Bilimleri',
                grupAd: gr.ad.split('(')[0].trim(),
                konuAd: k.ad,
                id: k.id,
                bitti: bitti
              });
            }
          });
        });
      }
    } else if (paket === 'ta') {
      var dTa = dersBul('ta');
      if (dTa) {
        gruplar(dTa).forEach(function (gr) {
          gr.konular.forEach(function (k) {
            havuz.push({
              dersAd: 'Şah Mat Tarih',
              grupAd: gr.ad.split('(')[0].trim(),
              konuAd: k.ad,
              id: k.id,
              bitti: (etkinDurum(k.id) === 2)
            });
          });
        });
      }
    } else if (paket === 'cg') {
      var dCg = dersBul('cg');
      if (dCg) {
        gruplar(dCg).forEach(function (gr) {
          gr.konular.forEach(function (k) {
            havuz.push({
              dersAd: 'Coğrafya (Engin Eraydın)',
              grupAd: gr.ad.split('(')[0].trim(),
              konuAd: k.ad,
              id: k.id,
              bitti: (etkinDurum(k.id) === 2)
            });
          });
        });
      }
    } else if (paket === 'sy') {
      var dSy = dersBul('sy');
      if (dSy) {
        gruplar(dSy).forEach(function (gr) {
          gr.konular.forEach(function (k) {
            havuz.push({
              dersAd: 'Matematik (İlyas Güneş)',
              grupAd: gr.ad.split('(')[0].trim(),
              konuAd: k.ad,
              id: k.id,
              bitti: (etkinDurum(k.id) === 2)
            });
          });
        });
      }
    } else if (paket === 'ok') {
      var dOk = dersBul('ok');
      if (dOk) {
        gruplar(dOk).forEach(function (gr) {
          gr.konular.forEach(function (k) {
            havuz.push({
              dersAd: 'ÖABT Kimya',
              grupAd: gr.ad,
              konuAd: k.ad,
              id: k.id,
              bitti: (etkinDurum(k.id) === 2)
            });
          });
        });
      }
    } else if (paket === 'gygk') {
      ['ta', 'cg', 'tr', 'sy', 'mv'].forEach(function (did) {
        var dg = dersBul(did);
        if (dg) {
          gruplar(dg).forEach(function (gr) {
            gr.konular.forEach(function (k) {
              havuz.push({
                dersAd: dg.kisa,
                grupAd: gr.ad.split('(')[0].trim(),
                konuAd: k.ad,
                id: k.id,
                bitti: (etkinDurum(k.id) === 2)
              });
            });
          });
        }
      });
    } else if (paket === 'kutuphane_tam') {
      var ebP = planIcinKonular('eb_kalan', []);
      var okP = planIcinKonular('ok', []);
      var eI = 0, oI = 0;
      while (eI < ebP.length || oI < okP.length) {
        for (var b1 = 0; b1 < 5 && eI < ebP.length; b1++) {
          var item1 = ebP[eI++];
          item1.blok = 'eb';
          havuz.push(item1);
        }
        for (var b2 = 0; b2 < 3 && oI < okP.length; b2++) {
          var item2 = okP[oI++];
          item2.blok = 'oabt';
          havuz.push(item2);
        }
      }
    } else if (paket === 'karisik') {
      var ebP = planIcinKonular('eb_kalan', []);
      var gyP = planIcinKonular('gygk', []);
      var eI = 0, gI = 0;
      while (eI < ebP.length || gI < gyP.length) {
        if (eI < ebP.length) havuz.push(ebP[eI++]);
        if (eI < ebP.length) havuz.push(ebP[eI++]);
        if (gI < gyP.length) havuz.push(gyP[gI++]);
      }
    } else if (paket === 'ozel') {
      (seciliDersler || []).forEach(function (did) {
        var d = dersBul(did);
        if (d) {
          gruplar(d).forEach(function (gr) {
            gr.konular.forEach(function (k) {
              havuz.push({
                dersAd: d.kisa,
                grupAd: gr.ad.split('(')[0].trim(),
                konuAd: k.ad,
                id: k.id,
                bitti: (etkinDurum(k.id) === 2)
              });
            });
          });
        }
      });
    }
    return havuz;
  }

  /* ================= İnteraktif Haftalık Plan =================
     Günlük kütüphane akışı (sabit): 3 oturum Eğitim Bilimleri (09:00-14:00),
     öğle yemeği, 2 oturum ÖABT Kimya (14:30-16:30), 16:30-17:00 aralıklı tekrar,
     isteğe bağlı 21:00-22:30 akşam etüdü. Bir konu ≈ 45 dk video / hız.
     Plan görevleri: { t, done, tip: konu|tekrar|serbest|aksam|ozel, oturum, bas, bit,
                       konuId, repeatKonuId, ders, n, manual } */
  var OTURUMLAR = [
    { id: 's1', ad: '1. Oturum', bas: '09:00', bit: '10:30', grup: 'sabah' },
    { id: 's2', ad: '2. Oturum', bas: '10:45', bit: '12:15', grup: 'sabah' },
    { id: 's3', ad: '3. Oturum', bas: '12:30', bit: '14:00', grup: 'sabah' },
    { id: 's4', ad: '4. Oturum', bas: '14:30', bit: '16:00', grup: 'ogle' },
    { id: 's5', ad: '5. Oturum', bas: '16:00', bit: '16:30', grup: 'ogle' },
    { id: 'tk', ad: 'Aralıklı Tekrar', bas: '16:30', bit: '17:00', grup: 'tekrar' },
    { id: 'ak', ad: 'Akşam Etüdü', bas: '21:00', bit: '22:30', grup: 'aksam' }
  ];
  var MOLALAR = [
    { sonra: 's1', bas: '10:30', bit: '10:45', ad: 'Mola · 15 dk' },
    { sonra: 's2', bas: '12:15', bit: '12:30', ad: 'Mola · 15 dk' },
    { sonra: 's3', bas: '14:00', bit: '14:30', ad: 'Öğle yemeği · 30 dk' }
  ];
  var GUN_OTURUMLARI = ['s1', 's2', 's3', 's4', 's5'];
  var TEKRAR_DK = 10;
  var GUN_KISA = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  var AY_ADLARI = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var HIZLAR = [1, 1.25, 1.5, 1.75, 2];

  function dkOku(s) { var p = String(s).split(':'); return (+p[0]) * 60 + (+p[1]); }
  function saatYaz(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function simdiDk() { var n = new Date(); return n.getHours() * 60 + n.getMinutes(); }
  function bugunIdx() { return (new Date().getDay() + 6) % 7; }
  function haftaBasi() { return gunEkle(bugunStr(), -bugunIdx()); }
  function tarihEtiket(str) { var p = str.split('-'); return (+p[2]) + ' ' + AY_ADLARI[+p[1] - 1]; }
  function konuSuresi(hiz) { return Math.max(10, Math.round(45 / hiz)); }
  function hizYaz(h) { return String(h).replace('.', ',') + 'x'; }

  // Eski/yarım kayıtları yeni yapıya uyarlar, hafta değiştiyse planı sıfırlar. Değişiklik olduysa true döner.
  function planNormalle() {
    var degisti = false, i, toplam = 0;
    if (!S.plan || typeof S.plan !== 'object') { S.plan = {}; degisti = true; }
    for (i = 0; i < 7; i++) {
      if (!Array.isArray(S.plan[i])) { S.plan[i] = []; degisti = true; }
      var onceki = S.plan[i].length;
      S.plan[i] = S.plan[i].filter(function (t) { return t && !t.rest; });
      if (S.plan[i].length !== onceki) degisti = true;
      S.plan[i].forEach(function (t) {
        if (t.tip) return;
        degisti = true;
        if (t.repeatKonuId) t.tip = 'tekrar';
        else if (t.isEvening) { t.tip = 'aksam'; t.oturum = 'ak'; t.bas = '21:00'; t.bit = '22:30'; }
        else if (t.isRepeat) { t.tip = 'serbest'; t.oturum = 'tk'; t.bas = '16:30'; t.bit = '17:00'; }
        else if (t.konuId) t.tip = 'konu';
        else { t.tip = 'ozel'; t.manual = true; }
      });
      toplam += S.plan[i].length;
    }
    var hb = haftaBasi();
    if (S.planHafta && S.planHafta < hb) {
      for (i = 0; i < 7; i++) S.plan[i] = [];
      S.planHafta = '';
      degisti = true;
    } else if (!S.planHafta && toplam > 0) {
      S.planHafta = hb;
      degisti = true;
    }
    if (!S.planAyarlar || typeof S.planAyarlar !== 'object') { S.planAyarlar = {}; degisti = true; }
    if (!S.planAyarlar.v2) { S.planAyarlar.v2 = true; S.planAyarlar.hiz = 1.5; degisti = true; }
    return degisti;
  }

  function planToplam() {
    var n = 0;
    for (var i = 0; i < 7; i++) n += (S.plan[i] || []).length;
    return n;
  }

  function konuBul(id) {
    for (var a = 0; a < DERSLER.length; a++) {
      var ks = tumKonular(DERSLER[a]);
      for (var b = 0; b < ks.length; b++) if (ks[b].id === id) return { k: ks[b], d: DERSLER[a] };
    }
    return null;
  }

  // Konu görevleri doğrudan konunun gerçek durumundan okunur (Panel ile tek doğruluk kaynağı)
  function gorevBitti(t) {
    if (t.tip === 'konu' && t.konuId) return (S.durum[t.konuId] || 0) >= 2;
    return !!t.done;
  }

  function planHavuz(dersIds, haric) {
    var q = { ags: [], oabt: [] };
    DERSLER.forEach(function (d) {
      if (dersIds.indexOf(d.id) === -1) return;
      tumKonular(d).forEach(function (k) {
        if (etkinDurum(k.id) >= 2 || haric[k.id]) return;
        q[d.sinav === 'ags' ? 'ags' : 'oabt'].push({ id: k.id, konuAd: k.ad, dersAd: d.kisa });
      });
    });
    return q;
  }

  // Sabah oturumları AGS derslerinden, öğleden sonra ÖABT'den; biri boşsa diğerinden alır
  function havuzdanAl(q, grup) {
    var bir = grup === 'sabah' ? q.ags : q.oabt;
    var iki = grup === 'sabah' ? q.oabt : q.ags;
    if (bir.length) return bir.shift();
    if (iki.length) return iki.shift();
    return null;
  }

  function planKapasite(hiz) {
    var d = konuSuresi(hiz), top = 0;
    OTURUMLAR.forEach(function (o) {
      if (o.grup === 'sabah' || o.grup === 'ogle') top += Math.floor((dkOku(o.bit) - dkOku(o.bas)) / d);
    });
    return top;
  }

  function tekrarKuyrugu() {
    var out = [];
    DERSLER.forEach(function (d) {
      tumKonular(d).forEach(function (k) {
        var tk = S.tekrar[k.id], st = S.durum[k.id] || 0;
        if (tk && tk.sonraki && (st === 2 || st === 3)) out.push({ id: k.id, ad: k.ad, ders: d.kisa, n: tk.n || 0, due: tk.sonraki });
      });
    });
    out.sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : 0; });
    return out;
  }

  function zamanSirala(a, b) {
    var x = a.bas ? dkOku(a.bas) : 2000, y = b.bas ? dkOku(b.bas) : 2000;
    return x - y;
  }

  // Planı bugünden itibaren yeniden dağıtır. Korunanlar: geçmiş günler, biten bloklar, elle eklenenler.
  function planUret(ayar) {
    var buHafta = haftaBasi(), bi = bugunIdx(), simdi = simdiDk();
    var dkSure = konuSuresi(ayar.hiz);
    var yeniPlan = {}, korunan = {}, say = { konu: 0, tekrar: 0 };
    var i;

    // Bu haftada bugünden itibaren yerleştirilecek gün kaldı mı? Kalmadıysa gelecek haftayı planla.
    var kalanVar = (ayar.gunler[bi] && simdi < dkOku('17:00')) || (ayar.aksam[bi] && simdi < dkOku('22:30'));
    for (i = bi + 1; i < 7; i++) { if (ayar.gunler[i] || ayar.aksam[i]) kalanVar = true; }
    var hb, basla, bugunSira;
    if (kalanVar) { hb = buHafta; basla = bi; bugunSira = bi; }
    else { hb = (S.planHafta && S.planHafta > buHafta) ? S.planHafta : gunEkle(buHafta, 7); basla = 0; bugunSira = -1; }
    var ayniHafta = (S.planHafta === hb);

    for (i = 0; i < 7; i++) {
      yeniPlan[i] = ayniHafta ? (S.plan[i] || []).filter(function (t) { return i < bugunSira || t.manual || gorevBitti(t); }) : [];
      yeniPlan[i].forEach(function (t) { if (t.konuId) korunan[t.konuId] = true; });
    }

    var q = planHavuz(ayar.dersler, korunan);
    var kuyruk = tekrarKuyrugu();

    function gunUret(g) {
      var kept = yeniPlan[g], yeni = [], dolu = {}, tkVar = false, akVar = false;
      kept.forEach(function (t) {
        if (t.bas) dolu[t.bas] = true;
        if (t.oturum === 'tk') tkVar = true;
        if (t.tip === 'aksam') akVar = true;
      });
      var gtarih = gunEkle(hb, g), bugunmu = (g === bugunSira);

      if (ayar.gunler[g]) {
        OTURUMLAR.forEach(function (o) {
          var ob = dkOku(o.bas), oe = dkOku(o.bit);
          if (o.grup === 'sabah' || o.grup === 'ogle') {
            var adet = Math.floor((oe - ob) / dkSure);
            if (adet < 1) {
              if (!dolu[o.bas] && !(bugunmu && oe <= simdi)) {
                yeni.push({ t: 'Soru çözümü & kısa tekrar', tip: 'serbest', oturum: o.id, bas: o.bas, bit: o.bit, done: false });
              }
              return;
            }
            for (var s = 0; s < adet; s++) {
              var b = ob + s * dkSure, e = b + dkSure;
              if (bugunmu && e <= simdi) continue;
              if (dolu[saatYaz(b)]) continue;
              var konu = havuzdanAl(q, o.grup);
              if (!konu) {
                yeni.push({ t: 'Serbest çalışma & soru çözümü', tip: 'serbest', oturum: o.id, bas: saatYaz(b), bit: o.bit, done: false });
                break;
              }
              yeni.push({ t: konu.konuAd, ders: konu.dersAd, tip: 'konu', konuId: konu.id, oturum: o.id, bas: saatYaz(b), bit: saatYaz(e), done: false });
              say.konu++;
            }
          } else if (o.grup === 'tekrar') {
            if (bugunmu && oe <= simdi) return;
            var eklendi = 0, adetT = Math.floor((oe - ob) / TEKRAR_DK);
            for (var r = 0; r < adetT; r++) {
              var bt = ob + r * TEKRAR_DK;
              if (bugunmu && bt + TEKRAR_DK <= simdi) continue;
              if (dolu[saatYaz(bt)]) continue;
              var bulunan = -1;
              for (var x = 0; x < kuyruk.length; x++) { if (kuyruk[x].due <= gtarih) { bulunan = x; break; } }
              if (bulunan < 0) break;
              var rp = kuyruk.splice(bulunan, 1)[0];
              yeni.push({ t: rp.ders + ' · ' + rp.ad, tip: 'tekrar', repeatKonuId: rp.id, n: rp.n, oturum: 'tk', bas: saatYaz(bt), bit: saatYaz(bt + TEKRAR_DK), done: false });
              eklendi++; say.tekrar++;
            }
            if (!eklendi && !tkVar) {
              yeni.push({ t: 'Genel tekrar & soru çözümü', tip: 'serbest', oturum: 'tk', bas: o.bas, bit: o.bit, done: false });
            }
          }
        });
      }

      if (ayar.aksam[g] && !akVar && !(bugunmu && dkOku('22:30') <= simdi)) {
        yeni.push({ t: 'Soru çözümü & deneme', tip: 'aksam', oturum: 'ak', bas: '21:00', bit: '22:30', done: false });
      }
      yeniPlan[g] = kept.concat(yeni).sort(zamanSirala);
    }

    for (i = basla; i < 7; i++) gunUret(i);
    var sonGun = gunEkle(hb, 6);
    return {
      hafta: hb,
      plan: yeniPlan,
      say: say,
      kalanTekrar: kuyruk.filter(function (x) { return x.due <= sonGun; }).length
    };
  }

  /* ---- Sihirbaz durumu ---- */
  function wzBaslat() {
    var pa = S.planAyarlar || {};
    var gecerli = function (id) { return DERSLER.some(function (d) { return d.id === id; }); };
    var dersler = (pa.seciliDersler || []).filter(gecerli);
    if (!dersler.length) dersler = ['eb', 'ok'].filter(gecerli);
    var dizi7 = function (a, v) { return (Array.isArray(a) && a.length === 7) ? a.map(function (x) { return !!x; }) : v; };
    return {
      dersler: dersler,
      gunler: dizi7(pa.aktifGunler, [true, true, true, true, true, false, false]),
      aksam: dizi7(pa.aksamGunler, [true, true, true, true, false, false, false]),
      hiz: HIZLAR.indexOf(pa.hiz) !== -1 ? pa.hiz : 1.5
    };
  }

  function wzGecerli(w) {
    if (!w.dersler.length) return 'En az bir ders seç.';
    if (!w.gunler.some(Boolean) && !w.aksam.some(Boolean)) return 'En az bir kütüphane günü ya da akşam etüdü günü seç.';
    return '';
  }

  /* ---- Görünümler ---- */
  function gorevSatiri(t, g, j) {
    var bitti = gorevBitti(t);
    var kilit = (t.tip === 'tekrar' && bitti);
    var zaman = t.bas ? t.bas + '–' + t.bit : '';
    var etiket = '';
    if (t.tip === 'konu') etiket = t.ders || 'Konu';
    else if (t.tip === 'tekrar') etiket = (typeof t.n === 'number') ? (t.n + 1) + '. tekrar' : 'Tekrar';
    else if (t.tip === 'serbest') etiket = 'Serbest';
    else if (t.tip === 'aksam') etiket = 'Akşam etüdü';
    else etiket = 'Özel görev';
    var durum = bitti ? (t.tip === 'tekrar' ? 'Yapıldı' : 'Bitti') : 'Bekliyor';
    var ad = (bitti ? (t.tip === 'tekrar' ? 'Yapıldı: ' : 'Tamamlandı: ') : 'Tamamla: ') + t.t;
    var h = '<div class="pl-row pl-' + t.tip + (bitti ? ' done' : '') + '">' +
      '<button class="pl-chk' + (bitti ? ' on' : '') + '" role="checkbox" aria-checked="' + bitti + '" aria-label="' + esc(ad) + '" data-a="gtoggle" data-g="' + g + '" data-j="' + j + '"' + (kilit ? ' disabled' : '') + '>' + (bitti ? IC.check : '') + '</button>' +
      '<div class="pl-row-body">' +
        (zaman ? '<div class="pl-row-time">' + zaman + '</div>' : '') +
        '<div class="pl-row-title">' + esc(t.t) + '</div>' +
        '<div class="pl-row-meta"><span class="pl-tag">' + esc(etiket) + '</span><span class="pl-state' + (bitti ? ' ok' : '') + '">' + durum + '</span></div>' +
      '</div>' +
      '<div class="pl-row-act">';
    if (t.tip === 'konu' && !bitti) {
      h += '<button class="pl-ico" data-a="gdegis" data-g="' + g + '" data-j="' + j + '" aria-label="Konuyu değiştir: ' + esc(t.t) + '">' + IC.pen + '</button>';
    }
    h += '<button class="pl-ico" data-a="gdel" data-g="' + g + '" data-j="' + j + '" aria-label="Bloğu sil: ' + esc(t.t) + '">' + IC.trash + '</button>' +
      '</div></div>';
    return h;
  }

  function viewPlan() {
    if (planNormalle()) kaydet();
    var buHafta = haftaBasi();
    var hb = S.planHafta || buHafta, i;
    var bi = (hb === buHafta) ? bugunIdx() : -1;
    if (typeof ui.planGun !== 'number' || ui.planGun < 0 || ui.planGun > 6) ui.planGun = Math.max(bi, 0);

    var toplam = 0, biten = 0, gunSay = [];
    for (i = 0; i < 7; i++) {
      var tl = 0, bt = 0;
      S.plan[i].forEach(function (t) { tl++; if (gorevBitti(t)) bt++; });
      gunSay.push([bt, tl]);
      toplam += tl; biten += bt;
    }
    var yuzde = toplam ? Math.round(biten / toplam * 100) : 0;

    var h = head('Haftalık Plan') + '<div class="pl-wrap">';

    h += '<div class="pl-top"><div class="pl-top-info"><div class="pl-range">' + tarihEtiket(hb) + ' – ' + tarihEtiket(gunEkle(hb, 6)) + '</div>' +
      (toplam
        ? '<div class="pl-prog"><div class="pl-bar"><i style="width:' + yuzde + '%"></i></div><span>' + biten + ' / ' + toplam + ' tamamlandı · %' + yuzde + '</span></div>'
        : '<div class="pl-sub">Bu hafta için henüz plan yok</div>') +
      (toplam && hb > buHafta ? '<div class="pl-sub">Gelecek haftanın planı</div>' : '') +
      '</div>';
    if (toplam) {
      h += '<div class="pl-top-act">' +
        '<button class="pl-btn pl-btn-primary" data-a="planac">' + IC.plan + '<span>Yeniden planla</span></button>' +
        '<button class="pl-btn" data-a="planbosalt">Haftayı boşalt</button></div>';
    }
    h += '</div>';

    if (!toplam) {
      h += '<div class="pl-empty"><div class="pl-empty-ico">' + IC.plan + '</div>' +
        '<h2>Haftanı birkaç dokunuşla planla</h2>' +
        '<p>Çalışacağın dersleri ve kütüphane günlerini seç. Konular saatlere, bekleyen tekrarlar 16:30’daki tekrar bloğuna otomatik yerleşir.</p>' +
        '<button class="pl-btn pl-btn-primary pl-btn-lg" data-a="planac">Haftamı planla</button></div></div>';
      return h;
    }

    // Gün çubuğu
    h += '<div class="pl-strip" role="group" aria-label="Haftanın günleri">';
    for (i = 0; i < 7; i++) {
      var sec = (i === ui.planGun), bug = (i === bi), gt = gunEkle(hb, i);
      h += '<button class="pl-day' + (sec ? ' sel' : '') + (bug ? ' today' : '') + (gunSay[i][1] === 0 ? ' bos' : '') + '" data-a="plgun" data-g="' + i + '" aria-pressed="' + sec + '" aria-label="' +
        GUNLER[i] + ' ' + tarihEtiket(gt) + (bug ? ', bugün' : '') + (gunSay[i][1] ? ', ' + gunSay[i][0] + ' / ' + gunSay[i][1] + ' tamamlandı' : ', blok yok') + '">' +
        '<span class="pl-day-ad">' + GUN_KISA[i] + '</span><b class="pl-day-no">' + (+gt.split('-')[2]) + '</b>' +
        '<span class="pl-day-ct">' + (gunSay[i][1] ? gunSay[i][0] + '/' + gunSay[i][1] : '—') + '</span></button>';
    }
    h += '</div>';

    // Seçili gün
    var g = ui.planGun, tasks = S.plan[g];
    var aksamVar = tasks.some(function (t) { return t.tip === 'aksam'; });
    h += '<div class="pl-day-card"><div class="pl-day-head"><div>' +
      '<h2 class="pl-day-title">' + (g === bi ? 'Bugün · ' : '') + GUNLER[g] + '</h2>' +
      '<div class="pl-day-date">' + tarihEtiket(gunEkle(hb, g)) + '</div></div>' +
      '<div class="pl-sw-row"><span id="pl-sw-lbl">Akşam etüdü 21:00</span>' +
      '<button class="pl-switch' + (aksamVar ? ' on' : '') + '" role="switch" aria-checked="' + aksamVar + '" aria-labelledby="pl-sw-lbl" data-a="aksamsw" data-g="' + g + '"><i></i></button></div></div>';

    var sesDolu = {}, digerleri = [];
    tasks.forEach(function (t, j) {
      var ok = t.oturum && OTURUMLAR.some(function (o) { return o.id === t.oturum; });
      if (ok) (sesDolu[t.oturum] = sesDolu[t.oturum] || []).push([t, j]);
      else digerleri.push([t, j]);
    });

    if (!tasks.length) {
      h += '<div class="pl-bos">Bu gün için blok yok. Dinlenme günü olabilir; istersen aşağıdan blok ekleyebilirsin.</div>';
    }

    OTURUMLAR.forEach(function (o) {
      var rows = sesDolu[o.id];
      if (!rows) return;
      h += '<section class="pl-ses"><div class="pl-ses-head"><span class="pl-ses-ad">' + o.ad + '</span><span class="pl-ses-saat">' + o.bas + '–' + o.bit + '</span></div>';
      rows.forEach(function (r) { h += gorevSatiri(r[0], g, r[1]); });
      h += '</section>';
      var m = null;
      MOLALAR.forEach(function (x) { if (x.sonra === o.id) m = x; });
      if (m) {
        var sira = GUN_OTURUMLARI.indexOf(o.id), sonraVar = false;
        for (var k = sira + 1; k < GUN_OTURUMLARI.length; k++) if (sesDolu[GUN_OTURUMLARI[k]]) sonraVar = true;
        if (sonraVar) h += '<div class="pl-mola">' + m.bas + '–' + m.bit + ' · ' + m.ad + '</div>';
      }
    });

    if (digerleri.length) {
      h += '<section class="pl-ses"><div class="pl-ses-head"><span class="pl-ses-ad">Eklediklerim</span></div>';
      digerleri.forEach(function (r) { h += gorevSatiri(r[0], g, r[1]); });
      h += '</section>';
    }

    h += '<button class="pl-add" data-a="gekle" data-g="' + g + '">' + IC.plus + '<span>Blok ekle</span></button></div></div>';
    return h;
  }

  function wizardHtml() {
    var w = ui.wz, i;
    var h = '<div class="sh-wrap"><div class="sh-head"><h2 class="sh-title">Haftamı planla</h2>' +
      '<button class="sh-x" data-a="sheetkapat" aria-label="Kapat">' + IC.x + '</button></div><div class="sh-body">';

    h += '<section class="sh-sec"><h3>1 · Hangi dersleri çalışacaksın?</h3><div class="sh-chips">';
    DERSLER.forEach(function (d) {
      var on = w.dersler.indexOf(d.id) !== -1;
      var kalan = tumKonular(d).filter(function (k) { return etkinDurum(k.id) < 2; }).length;
      h += '<button class="sh-chip' + (on ? ' on' : '') + '" data-a="wzders" data-id="' + d.id + '" aria-pressed="' + on + '"><span>' + esc(d.kisa) + '</span><small>' + kalan + ' konu kaldı</small></button>';
    });
    h += '</div><p class="sh-hint">Sabah oturumlarına AGS dersleri, öğleden sonra oturumlarına ÖABT dersleri yerleşir. Bir grup seçmezsen tüm oturumlar seçtiğin gruptan dolar.</p></section>';

    h += '<section class="sh-sec"><h3>2 · Hangi günler kütüphanedesin?</h3><div class="sh-days">';
    for (i = 0; i < 7; i++) {
      h += '<button class="sh-gun' + (w.gunler[i] ? ' on' : '') + '" data-a="wzgun" data-g="' + i + '" aria-pressed="' + w.gunler[i] + '" aria-label="' + GUNLER[i] + '">' + GUN_KISA[i] + '</button>';
    }
    h += '</div><p class="sh-hint">Seçmediğin günler dinlenme günü olur. İstersen o güne sonradan blok ekleyebilirsin.</p></section>';

    h += '<section class="sh-sec"><h3>3 · Akşam etüdü hangi günler? (21:00–22:30)</h3><div class="sh-days">';
    for (i = 0; i < 7; i++) {
      h += '<button class="sh-gun' + (w.aksam[i] ? ' on' : '') + '" data-a="wzaksam" data-g="' + i + '" aria-pressed="' + w.aksam[i] + '" aria-label="' + GUNLER[i] + ' akşam etüdü">' + GUN_KISA[i] + '</button>';
    }
    h += '</div></section>';

    h += '<section class="sh-sec"><h3>4 · Video izleme hızı</h3><div class="sh-seg" role="group" aria-label="Video izleme hızı">';
    HIZLAR.forEach(function (x) {
      h += '<button class="sh-seg-b' + (w.hiz === x ? ' on' : '') + '" data-a="wzhiz" data-val="' + x + '" aria-pressed="' + (w.hiz === x) + '">' + hizYaz(x) + '</button>';
    });
    h += '</div></section>';

    var q = planHavuz(w.dersler, {});
    var kalanKonu = q.ags.length + q.oabt.length;
    var gunSayi = w.gunler.filter(Boolean).length, kap = planKapasite(w.hiz);
    var hafta = (gunSayi && kap && kalanKonu) ? Math.ceil(kalanKonu / (kap * gunSayi)) : 0;
    var hata = wzGecerli(w);
    h += '<div class="sh-ozet"><b>' + hizYaz(w.hiz) + ' hızda bir konu ≈ ' + konuSuresi(w.hiz) + ' dk.</b> Günde en fazla ' + kap + ' konu · ' + gunSayi + ' kütüphane günü · ' + kalanKonu + ' konu kaldı' +
      (hafta ? ' · yaklaşık ' + hafta + ' hafta' : '') + '.</div>';
    h += '<p class="sh-hint">Tekrarlar (1. hafta → 3. hafta → aylık) her gün 16:30–17:00 arasına, 10 dakikalık bloklar halinde yerleşir. ' +
      (planToplam() > 0 ? 'Biten ve elle eklediğin bloklar korunur; bitmeyen otomatik bloklar bugünden itibaren yeniden dağıtılır. Geçmiş günlere dokunulmaz.' : '') + '</p>';
    if (hata) h += '<p class="sh-uyari" role="alert">' + hata + '</p>';

    h += '</div><div class="sh-foot"><button class="pl-btn" data-a="sheetkapat">Vazgeç</button>' +
      '<button class="pl-btn pl-btn-primary" data-a="wzolustur"' + (hata ? ' disabled' : '') + '>Planı oluştur</button></div></div>';
    return h;
  }

  function planKonuHaritasi(haric) {
    var m = {};
    for (var i = 0; i < 7; i++) {
      (S.plan[i] || []).forEach(function (t) {
        if (t !== haric && t.tip === 'konu' && t.konuId && !gorevBitti(t)) m[t.konuId] = GUNLER[i] + (t.bas ? ' ' + t.bas : '');
      });
    }
    return m;
  }

  function konuSheetHtml() {
    var s = ui.sheet, d = dersBul(s.ders);
    var eski = (s.mod === 'degis') ? (S.plan[s.g] || [])[s.j] : null;
    var harita = planKonuHaritasi(eski);
    var h = '<div class="sh-wrap"><div class="sh-head"><div><h2 class="sh-title">' + (s.mod === 'degis' ? 'Konuyu değiştir' : 'Blok ekle') + '</h2>' +
      '<div class="sh-sub">' + GUNLER[s.g] + (eski && eski.bas ? ' · ' + eski.bas + '–' + eski.bit : '') + '</div></div>' +
      '<button class="sh-x" data-a="sheetkapat" aria-label="Kapat">' + IC.x + '</button></div>';
    h += '<div class="sh-chips sh-chips-row">';
    DERSLER.forEach(function (x) {
      h += '<button class="sh-chip sm' + (x.id === d.id ? ' on' : '') + '" data-a="sheetders" data-id="' + x.id + '" aria-pressed="' + (x.id === d.id) + '">' + esc(x.kisa) + '</button>';
    });
    h += '</div><div class="sh-body sh-list">';
    var say = 0;
    gruplar(d).forEach(function (gr) {
      var ks = gr.konular.filter(function (k) { return etkinDurum(k.id) < 2; });
      if (!ks.length) return;
      h += '<div class="sh-grup">' + esc(gr.ad) + '</div>';
      ks.forEach(function (k) {
        say++;
        var st = etkinDurum(k.id);
        h += '<button class="sh-konu" data-a="sheetsec" data-id="' + esc(k.id) + '"><span class="sh-konu-ad">' + esc(k.ad) + '</span><span class="sh-konu-meta">' +
          (harita[k.id] ? '<span class="sh-tag plan">Planlı: ' + esc(harita[k.id]) + '</span>' : '') +
          '<span class="sh-tag">' + (st === 1 ? 'Çalışılıyor' : 'Başlanmadı') + '</span></span></button>';
      });
    });
    if (!say) h += '<div class="sh-bos">Bu derste bekleyen konu yok.</div>';
    h += '</div><form class="sh-foot sh-ozel" data-form="sheetozel">' +
      '<input class="sh-input" name="ad" placeholder="Veya özel görev yaz (örn. deneme çöz)" autocomplete="off" aria-label="Özel görev adı" required>' +
      '<button class="pl-btn pl-btn-primary" type="submit">Ekle</button></form></div>';
    return h;
  }

  /* ---- Alt sayfa (dialog) ---- */
  var sheetEl = null;
  function sheetAc() {
    if (!sheetEl) {
      sheetEl = document.createElement('dialog');
      sheetEl.id = 'sheet';
      sheetEl.className = 'sheet';
      document.body.appendChild(sheetEl);
      sheetEl.addEventListener('close', function () { ui.sheet = null; });
      sheetEl.addEventListener('click', function (e) { if (e.target === sheetEl) sheetEl.close(); });
    }
    sheetCiz();
    if (!sheetEl.open) sheetEl.showModal();
  }
  function sheetCiz(sifirla) {
    if (!ui.sheet || !sheetEl) return;
    var eskiBody = sheetEl.querySelector('.sh-body');
    var top = (eskiBody && !sifirla) ? eskiBody.scrollTop : 0;
    sheetEl.innerHTML = ui.sheet.tip === 'wz' ? wizardHtml() : konuSheetHtml();
    var yeniBody = sheetEl.querySelector('.sh-body');
    if (yeniBody) yeniBody.scrollTop = top;
  }
  function sheetKapat() {
    if (sheetEl && sheetEl.open) sheetEl.close();
    ui.sheet = null;
  }
  function sheetUygula(yeni) {
    var s = ui.sheet;
    if (!s) return;
    var eski = (s.mod === 'degis') ? (S.plan[s.g] || [])[s.j] : null;
    var i;
    if (yeni.konuId) {
      for (i = 0; i < 7; i++) {
        S.plan[i] = S.plan[i].filter(function (t) {
          return t === eski || !(t.tip === 'konu' && t.konuId === yeni.konuId && !gorevBitti(t));
        });
      }
    }
    var ix = eski ? S.plan[s.g].indexOf(eski) : -1;
    if (ix >= 0) {
      yeni.oturum = eski.oturum; yeni.bas = eski.bas; yeni.bit = eski.bit;
      S.plan[s.g][ix] = yeni;
    } else {
      S.plan[s.g].push(yeni);
    }
    if (!S.planHafta) S.planHafta = haftaBasi();
    kaydet(); sheetKapat(); render();
  }

  /* ================= Video Süre Analizi (İndeks Akademi & 2x Hız) ================= */
  var VIDEO_ANALIZ = {
    eb: [
      {
        id: 'eb_felsefe',
        ad: 'Eğitim Felsefesi ve Sosyolojisi',
        hoca: 'Bulut Vurdum (İndeks Akademi)',
        video: 10,
        saat1x: 7.5,
        soru: '3 - 4 Soru',
        sira: 1,
        aciklama: 'Eğitimin temelleri, eğitim felsefeleri (İdealizm, Realizm, Pragmatizm, Varoluşçuluk vb.) ve Türk milli eğitim felsefesi.',
        tavsiye: 'Pedagojik kavramların temelini oluşturduğu için İLK sırada izlenmesi önerilir.'
      },
      {
        id: 'eb_gelisim',
        ad: 'Gelişim Psikolojisi',
        hoca: 'Zeynep Salman İçli (İndeks Akademi)',
        video: 20,
        saat1x: 16.0,
        soru: '10 - 12 Soru',
        sira: 2,
        aciklama: 'Bilişsel gelişim (Piaget, Vygotsky), kişilik gelişimi (Freud, Erikson), ahlak gelişimi (Kohlberg) ve temel kavramlar.',
        tavsiye: 'Zeynep Hoca kavram haritalarıyla anlatır. Öğrenme Psikolojisi’nden ÖNCE bitirilmelidir.'
      },
      {
        id: 'eb_ogrenme',
        ad: 'Öğrenme Psikolojisi',
        hoca: 'Zeynep Salman İçli (İndeks Akademi)',
        video: 26,
        saat1x: 21.0,
        soru: '10 - 12 Soru',
        sira: 3,
        aciklama: 'Klasik koşullanma, edimsel koşullanma, sosyal öğrenme, bilişsel ağırlıklı kuramlar ve bilgiyi işleme modeli.',
        tavsiye: 'Gelişim Psikolojisi hemen peşine izlendiğinde kavramsal taşlar yerine oturur.'
      },
      {
        id: 'eb_oyt',
        ad: 'Öğretim Yöntem ve Teknikleri (ÖYT)',
        hoca: 'Bulut Vurdum (İndeks Akademi)',
        video: 32,
        saat1x: 25.0,
        soru: '18 - 20 Soru (En Çok Soru!)',
        sira: 4,
        aciklama: 'Öğretim stratejileri (Sunuş, Buluş, Araştırma), modeller (Tam Öğrenme, İşbirlikli vb.), yöntem ve çağdaş teknikler.',
        tavsiye: 'Eğitim Bilimleri sınavının omurgasıdır. 2x hızda dinlerken kavram yanılgılarına dikkat!'
      },
      {
        id: 'eb_program',
        ad: 'Program Geliştirme',
        hoca: 'Bulut Vurdum (İndeks Akademi)',
        video: 16,
        saat1x: 12.0,
        soru: '4 - 5 Soru',
        sira: 5,
        aciklama: 'Program türleri, Bloom taksonomisi (hedef yazma), içerik düzenleme modelleri ve program tasarımı/değerlendirme.',
        tavsiye: 'ÖYT ile doğrudan bağlantılıdır, peş peşe izlenmesi verimi ikiye katlar.'
      },
      {
        id: 'eb_tymm',
        ad: 'Türkiye Yüzyılı Maarif Modeli (TYMM)',
        hoca: 'Bulut Vurdum (İndeks Akademi)',
        video: 6,
        saat1x: 4.5,
        soru: '3 - 4 Soru (Yeni Müfredat)',
        sira: 6,
        aciklama: 'Bütüncül eğitim yaklaşımı, erdem-değer-eylem çerçevesi, kavramsal beceriler ve yeni maarif modeli felsefesi.',
        tavsiye: 'ÖSYM’nin yeni MEB-AGS sınavındaki en sıcak ve ayırt edici soru kaynağıdır.'
      },
      {
        id: 'eb_sinif_tekno',
        ad: 'Sınıf Yönetimi & Öğretim Teknolojileri',
        hoca: 'Bulut Vurdum (İndeks Akademi)',
        video: 12,
        saat1x: 8.5,
        soru: '5 - 6 Soru',
        sira: 7,
        aciklama: 'Sınıf içi disiplin modelleri, zaman yönetimi, iletişim engelleri ve eğitimde teknoloji/materyal entegrasyonu.',
        tavsiye: 'Kısa ve net konulardır; 2.0x hızda sadece ~4 saatte tamamlanıp cebe atılabilir.'
      },
      {
        id: 'eb_olcme',
        ad: 'Ölçme ve Değerlendirme',
        hoca: 'Bünyamin Atalay (İndeks Akademi)',
        video: 24,
        saat1x: 20.0,
        soru: '10 - 12 Soru',
        sira: 8,
        aciklama: 'Ölçme türleri ve hatalar, güvenirlik & geçerlik, test istatistiği, madde güçlük/ayırt edicilik, standart puanlar (Z, T).',
        tavsiye: 'Bünyamin Hoca formülleri mantığıyla anlatır. Soru çözümüyle pekiştirilmesi şarttır.'
      },
      {
        id: 'eb_rehberlik',
        ad: 'Rehberlik ve Özel Eğitim',
        hoca: 'Zeynep Salman İçli (İndeks Akademi)',
        video: 28,
        saat1x: 22.0,
        soru: '10 - 12 Soru',
        sira: 9,
        aciklama: 'Rehberliğin ilkeleri, hizmet alanları, rehberlik modelleri, örgüt yapısı ve BEP / kaynaştırma / özel eğitim.',
        tavsiye: 'Bol vaka ve senaryo sorusu gelir. Zeynep Hoca’nın örnek olay vurguları çok değerlidir.'
      },
      {
        id: 'eb_tmes',
        ad: 'Türk Milli Eğitim Sistemi ve Mevzuat (TMES)',
        hoca: 'Emrah Vahap Özkaraca / İndeks Akademi',
        video: 10,
        saat1x: 7.5,
        soru: '4 - 5 Soru',
        sira: 10,
        aciklama: '1739 Sayılı Kanun, MEB Teşkilat yapısı (Bakanlık, Kurullar, Genel Müdürlükler), Öğretmenlik Meslek Kanunu.',
        tavsiye: 'Hafıza tazelemeye yöneliktir; tekrar periyotlarıyla birlikte çalışılması önerilir.'
      }
    ],
    gygk: [
      {
        id: 'gygk_tarih',
        ad: 'Tarih (Şah Mat)',
        hoca: 'Erdem Ünal Demirci',
        video: 24,
        saat1x: 18.0,
        soru: '6 Soru (AGS)',
        sira: 1,
        aciklama: '24 videoluk Şah Mat Tarih tam seti: İslamiyet Öncesi, Selçuklu, Osmanlı Siyasi/Kültür, İnkılap Tarihi ve Çağdaş Dünya.',
        tavsiye: 'Erdem Hoca’nın 24 videoluk Şah Mat serisi nokta atışı analizdir; 2.0x hızda sadece 9 saatte tamamlanır!'
      },
      {
        id: 'gygk_cografya',
        ad: 'Coğrafya',
        hoca: 'Engin Eraydın (Hocawebde / Benim Hocam)',
        video: 36,
        saat1x: 26.0,
        soru: '6 Soru (AGS)',
        sira: 2,
        aciklama: 'Türkiye Fiziki, Beşeri ve Ekonomik Coğrafyası (Engin Hoca hafıza haritaları ve kodlamaları).',
        tavsiye: 'Engin Eraydın görsel hafıza haritaları ve akılda kalıcı kodlamalarıyla netleri hızla artırır.'
      },
      {
        id: 'gygk_turkce',
        ad: 'Türkçe',
        hoca: 'Gizem Ural (İndeks Akademi)',
        video: 32,
        saat1x: 22.0,
        soru: '15 Soru (AGS Sözel Yetenek)',
        sira: 3,
        aciklama: 'Sözcük/Cümle Anlamı, Paragraf taktikleri, Yazım & Noktalama, Dil Bilgisi ve Sözel Mantık.',
        tavsiye: 'Gizem Ural pratik soru çözüm taktikleri verir; günde 20 paragraf çözümüyle destekleyin.'
      },
      {
        id: 'gygk_mat',
        ad: 'Matematik & Sayısal Mantık',
        hoca: 'İlyas Güneş (Benim Hocam)',
        video: 65,
        saat1x: 45.0,
        soru: '15 Soru (AGS Sayısal Yetenek)',
        sira: 4,
        aciklama: 'Temel kavramlar, Problemler (Sayı, Kesir, Yaş, Yüzde), Kümeler ve Sayısal Mantık.',
        tavsiye: 'İlyas Hoca tane tane ve soru kalıplarıyla anlatır; temelden zirveye taşır.'
      },
      {
        id: 'gygk_vatandaslik',
        ad: 'Mevzuat & Hukuk',
        hoca: 'Emrah Vahap Özkaraca (İndeks Akademi)',
        video: 25,
        saat1x: 18.0,
        soru: '8 Soru (AGS Mevzuat)',
        sira: 5,
        aciklama: 'Temel Hukuk Bilgisi, Anayasa Hukuku (1982 Anayasası), Yasama, Yürütme, Yargı ve İdare Hukuku.',
        tavsiye: 'Kavramlar nettir; düzenli aralıklı tekrarla ful çekilebilir.'
      }
    ],
    oabt: [
      {
        id: 'oabt_genel',
        ad: 'Genel Kimya',
        hoca: 'Doğan Hoca (Hocadan Al Akademi) & İndeks',
        video: 24,
        saat1x: 18.0,
        soru: '10 Soru',
        sira: 1,
        aciklama: 'Madde ve Özellikleri, Atom Modelleri, Periyodik Cetvel, Kimyasal Bağlar, Mol/Stokiyometri, Gazlar, Çözeltiler.',
        tavsiye: 'Kimyanın temelidir; kavram oturtulduğunda diğer derslerin de temelini oluşturur.'
      },
      {
        id: 'oabt_analitik',
        ad: 'Analitik Kimya',
        hoca: 'Doğan Hoca (Hocadan Al Akademi)',
        video: 22,
        saat1x: 17.0,
        soru: '8 Soru',
        sira: 2,
        aciklama: 'Hata Analizi, Kimyasal Denge, Asit-Baz Titrasyonları, Çökme Dengeleri, Elektrokimya ve Spektroskopi.',
        tavsiye: 'Soru tipleri şablonludur; titrasyon eğrilerini iyi kavramak tam net getirir.'
      },
      {
        id: 'oabt_anorganik',
        ad: 'Anorganik Kimya',
        hoca: 'Doğan Hoca (Hocadan Al Akademi)',
        video: 18,
        saat1x: 14.0,
        soru: '7 Soru',
        sira: 3,
        aciklama: 'Periyodik Eğilimler, Moleküler Orbital Kuramı, HSAB Asit-Bazlar, Koordinasyon Bileşikleri ve Kristal Alan Teorisi.',
        tavsiye: 'Kristal alan ve d orbitali yarılmalarından her yıl banko soru gelir.'
      },
      {
        id: 'oabt_organik',
        ad: 'Organik Kimya',
        hoca: 'Doğan Hoca (Hocadan Al Akademi)',
        video: 28,
        saat1x: 22.0,
        soru: '9 Soru',
        sira: 4,
        aciklama: 'IUPAC Adlandırma, Stereokimya, Alkan-Alken-Alkin, SN1-SN2-E1-E2 Reaksiyon Mekanizmaları, Aromatik Bileşikler, Karbonil ve Türevleri.',
        tavsiye: 'Mekanizma mantığı kavranmalıdır; elektron hareketleri takip edilmelidir.'
      },
      {
        id: 'oabt_fizikokimya',
        ad: 'Fizikokimya',
        hoca: 'Doğan Hoca (Hocadan Al Akademi)',
        video: 20,
        saat1x: 16.0,
        soru: '8 Soru',
        sira: 5,
        aciklama: 'Termodinamik (1., 2. ve 3. Yasa), Termokimya, Faz Dengeleri, Kimyasal Kinetik ve Galvanik Piller.',
        tavsiye: 'Formül kalıpları nettir; çıkmış sorulara paralel pratik yapmak yeterlidir.'
      },
      {
        id: 'oabt_alan_egt',
        ad: 'Kimya Alan Eğitimi',
        hoca: 'Doğan Hoca & İndeks Akademi',
        video: 14,
        saat1x: 10.0,
        soru: '8 Soru',
        sira: 6,
        aciklama: 'MEB Kimya Dersi Öğretim Programı, Kavram Yanılgıları, Laboratuvar Güvenliği ve Deney Tasarımı, Ölçme-Değerlendirme.',
        tavsiye: 'ÖABT’de en yüksek net getirisi olan ve en az süre alan bölümdür. Kesinlikle ihmal edilmemelidir.'
      }
    ]
  };

  function viewSureler() {
    var hiz = ui.sureHiz || 2.0;
    var hedef = ui.sureHedef || 2.0;
    var kat = ui.sureKat || 'eb';
    var liste = VIDEO_ANALIZ[kat] || VIDEO_ANALIZ.eb;

    var toplamVideo = 0;
    var toplam1x = 0;
    liste.forEach(function (d) {
      toplamVideo += d.video;
      toplam1x += d.saat1x;
    });
    var toplamHizli = toplam1x / hiz;
    var tasarrufSaat = toplam1x - toplamHizli;
    var gunSayisi = Math.ceil(toplamHizli / hedef);
    var gunlukVideo = (toplamVideo / (gunSayisi || 1)).toFixed(1);
    var bitisTarihi = gunEkle(bugunStr(), gunSayisi);

    var h = head('Video Süreleri & Analiz');

    // Hero Kartı
    h += '<div class="sure-hero card">' +
      '<div class="sure-hero-top">' +
        '<div class="sure-hero-badge">⚡ 2.0x HIZLANDIRILMIŞ ÇALIŞMA PLANI</div>' +
        '<h2>' + (kat === 'eb' ? 'Eğitim Bilimleri & TMES Süre Analizi' : (kat === 'gygk' ? 'AGS GY-GK Süre Analizi' : 'ÖABT Kimya Süre Analizi')) + '</h2>' +
        '<p class="muted">Normal hızda <b>' + toplam1x.toFixed(1) + ' saat</b> süren videolar, <b>' + hiz + 'x hızda sadece ' + toplamHizli.toFixed(1) + ' saate</b> iniyor! ' +
        'Günde <b>' + hedef + ' saat</b> çalışarak bu paketi <b>' + gunSayisi + ' günde</b> tamamlayabilirsiniz.</p>' +
      '</div>' +

      // Ayarlar Barı (Hız ve Hedef Seçici)
      '<div class="sure-ctrl-bar">' +
        '<div class="ctrl-group">' +
          '<span class="ctrl-label">İzleme Hızı:</span>' +
          '<div class="chips-row">' +
            [1.0, 1.25, 1.5, 1.75, 2.0].map(function (s) {
              return '<button class="chip-btn' + (hiz === s ? ' active' : '') + '" data-a="surehiz" data-val="' + s + '">' +
                (s === 2.0 ? '⚡ 2.0x (Aktif)' : s + 'x') + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="ctrl-group">' +
          '<span class="ctrl-label">Günlük İzleme Hedefi:</span>' +
          '<div class="chips-row">' +
            [1.0, 1.5, 2.0, 2.5, 3.0, 4.0].map(function (hd) {
              return '<button class="chip-btn' + (hedef === hd ? ' active' : '') + '" data-a="surehedef" data-val="' + hd + '">' +
                (hd === 2.0 ? '🎯 2.0 Sa/Gün' : hd + ' Sa/Gün') + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    // Kategori Sekmeleri
    h += '<div class="sure-tabs">' +
      '<button class="tab-btn' + (kat === 'eb' ? ' active' : '') + '" data-a="surekat" data-val="eb">🎓 Eğitim Bilimleri &amp; TMES (' + VIDEO_ANALIZ.eb.length + ' Ders)</button>' +
      '<button class="tab-btn' + (kat === 'gygk' ? ' active' : '') + '" data-a="surekat" data-val="gygk">📚 AGS GY-GK &amp; Mevzuat (' + VIDEO_ANALIZ.gygk.length + ' Ders)</button>' +
      '<button class="tab-btn' + (kat === 'oabt' ? ' active' : '') + '" data-a="surekat" data-val="oabt">⚗ ÖABT Kimya (Alan Bilgisi)</button>' +
    '</div>';

    // Canlı KPI Metrikleri
    h += '<div class="sure-kpi-grid">' +
      '<div class="sure-kpi"><div class="sk-val">' + toplamVideo + '</div><div class="sk-lbl">Toplam Video</div><div class="sk-sub">İndeks Akademi</div></div>' +
      '<div class="sure-kpi"><div class="sk-val">' + toplam1x.toFixed(1) + ' <small>saat</small></div><div class="sk-lbl">1.0x Normal Süre</div><div class="sk-sub">Orijinal liste</div></div>' +
      '<div class="sure-kpi highlight"><div class="sk-val">⚡ ' + toplamHizli.toFixed(1) + ' <small>saat</small></div><div class="sk-lbl">' + hiz + 'x İzleme Süresi</div><div class="sk-sub">Net dinleme süresi</div></div>' +
      '<div class="sure-kpi success"><div class="sk-val">🎉 ' + tasarrufSaat.toFixed(1) + ' <small>saat</small></div><div class="sk-lbl">Kazanılan Zaman</div><div class="sk-sub">Hız farkı kazancı</div></div>' +
      '<div class="sure-kpi"><div class="sk-val">📅 ' + gunSayisi + ' <small>gün</small></div><div class="sk-lbl">Tamamlanma Süresi</div><div class="sk-sub">Günde ~' + gunlukVideo + ' video</div></div>' +
      '<div class="sure-kpi"><div class="sk-val">' + fmtTarih(bitisTarihi) + '</div><div class="sk-lbl">Tahmini Bitiş Tarihi</div><div class="sk-sub">' + hedef + ' sa/gün ile</div></div>' +
    '</div>';

    // Eğitim Bilimleri için Pedagojik Çalışma Sırası Yol Haritası (Roadmap)
    if (kat === 'eb') {
      h += '<div class="card sure-roadmap">' +
        '<div class="rm-head">' +
          '<h3>🧭 Pedagojik Önerilen Çalışma Sırası (Yol Haritası)</h3>' +
          '<span class="muted">Kavramların birbirini desteklemesi için İndeks Akademi hocalarının önerdiği ideal sıralama:</span>' +
        '</div>' +
        '<div class="rm-flow">' +
          '<div class="rm-step"><span class="rm-num">1</span><b>Eğitim Felsefesi</b><small>Kavramsal zemin</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step"><span class="rm-num">2</span><b>Gelişim Psikolojisi</b><small>Çocuk &amp; evreler</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step"><span class="rm-num">3</span><b>Öğrenme Psikolojisi</b><small>Kuramlar &amp; pekiştireç</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step highlight"><span class="rm-num">4</span><b>ÖYT</b><small>18-20 Soru (Omurga)</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step"><span class="rm-num">5</span><b>Program Geliştirme</b><small>Müfredat tasarımı</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step highlight"><span class="rm-num">6</span><b>TYMM</b><small>Yeni Maarif Modeli</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step"><span class="rm-num">7</span><b>Sınıf &amp; Teknoloji</b><small>Pratik &amp; materyal</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step"><span class="rm-num">8</span><b>Ölçme &amp; Değ.</b><small>İstatistik &amp; formüller</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step"><span class="rm-num">9</span><b>Rehberlik</b><small>Özel eğitim &amp; vaka</small></div>' +
          '<div class="rm-arrow">→</div>' +
          '<div class="rm-step"><span class="rm-num">10</span><b>TMES &amp; Mevzuat</b><small>Milli Eğitim yapısı</small></div>' +
        '</div>' +
      '</div>';
    }

    // Ders Ders Detay Kartları
    h += '<div class="sure-cards-header">' +
      '<h3>📋 Ders Bazında Süre ve Video Dağılımı</h3>' +
      '<span class="muted">Tüm süreler ' + hiz + 'x hız ve ' + hedef + ' sa/gün hedefine göre anlık hesaplanmıştır:</span>' +
    '</div>';

    h += '<div class="sure-cards-grid">';
    liste.forEach(function (d) {
      var dersHizli = d.saat1x / hiz;
      var dersGun = (dersHizli / hedef).toFixed(1);
      h += '<div class="card sure-card">' +
        '<div class="sc-head">' +
          '<div class="sc-sira">' + (d.sira ? '#' + d.sira : '•') + '</div>' +
          '<div class="sc-title-wrap">' +
            '<div class="sc-title">' + esc(d.ad) + '</div>' +
            '<div class="sc-hoca">👤 ' + esc(d.hoca) + '</div>' +
          '</div>' +
          '<div class="sc-soru-badge">' + esc(d.soru) + '</div>' +
        '</div>' +

        '<div class="sc-metrics">' +
          '<div class="sc-metric">' +
            '<span class="sm-lbl">Video Sayısı</span>' +
            '<b class="sm-val">' + d.video + ' Video</b>' +
            '<small class="sm-sub">ort. ~' + Math.round((d.saat1x * 60) / d.video) + ' dk</small>' +
          '</div>' +
          '<div class="sc-metric">' +
            '<span class="sm-lbl">1.0x Normal Süre</span>' +
            '<span class="sm-val">' + d.saat1x.toFixed(1) + ' Saat</span>' +
            '<small class="sm-sub">normal hız</small>' +
          '</div>' +
          '<div class="sc-metric highlight">' +
            '<span class="sm-lbl">⚡ ' + hiz + 'x Süresi</span>' +
            '<b class="sm-val">' + dersHizli.toFixed(1) + ' Saat</b>' +
            '<small class="sm-sub">net dinleme</small>' +
          '</div>' +
          '<div class="sc-metric">' +
            '<span class="sm-lbl">Bitiş Süresi</span>' +
            '<b class="sm-val">' + dersGun + ' Gün</b>' +
            '<small class="sm-sub">' + hedef + ' sa/gün ile</small>' +
          '</div>' +
        '</div>' +

        '<div class="sc-desc">' + esc(d.aciklama) + '</div>' +
        (d.tavsiye ? '<div class="sc-tavsiye">💡 <b>Tavsiye:</b> ' + esc(d.tavsiye) + '</div>' : '') +

        '<div class="sc-footer">' +
          '<span class="spacer"></span>' +
          '<button class="btn btn-primary btn-plan-ekle" data-a="sureplanekle" data-ad="' + esc(d.ad) + '" data-sure="' + dersHizli.toFixed(1) + '">' +
            '📅 Haftalık Plana Görev Ekle' +
          '</button>' +
        '</div>' +
      '</div>';
    });
    h += '</div>';

    // Alt Bilgi / Planlama Eylem Kartı
    h += '<div class="card sure-info-card active-cta">' +
      '<div class="sic-icon">⚡</div>' +
      '<div class="sic-content">' +
        '<b>Akıllı Haftalık Plan Dağıtıcı Hazır!</b>' +
        '<p class="muted">Seçtiğiniz <b>' + hiz + 'x izleme hızı</b> ve <b>' + hedef + ' saat/gün</b> temposuyla haftalık çalışma programınızı tek dokunuşla otomatik oluşturup günlere paylaştırabilirsiniz.</p>' +
      '</div>' +
      '<button class="btn btn-primary btn-cta-go" data-a="gitplansihirbaz">🚀 Bu Tempoyla Haftalık Planı Oluştur</button>' +
    '</div>';

    return h;
  }

  /* ================= Çizim ================= */
  var NAV = [
    { id: 'panel', ad: 'Panel', ic: IC.panel },
    { id: 'plan', ad: 'Haftalık Plan', ic: IC.plan },
    { id: 'deneme', ad: 'Denemeler', ic: IC.deneme }
  ];
  var VIEWS = {
    panel: viewPanel,
    plan: viewPlan,
    deneme: viewDeneme,
    ags: viewPanel,
    sureler: viewPlan,
    oabt: viewPanel
  };

  function render() {
    var bekleyen = bugunTekrarlar().length;
    $('#nav').innerHTML = NAV.map(function (n) {
      var rozet = (n.id === 'panel' && bekleyen) ? '<span class="rozet">' + bekleyen + '</span>' : '';
      return '<button class="nav-item' + (ui.view === n.id ? ' active' : '') + '" data-a="nav" data-id="' + n.id + '"><span class="ni">' + n.ic + '</span><span>' + n.ad + '</span>' + rozet + '</button>';
    }).join('');
    $('#main').innerHTML = VIEWS[ui.view]();
  }

  // Sol paneldeki kaydırma konumunu koruyarak çiz (tıklayınca liste başa sarmasın)
  function renderKorumali() {
    var sc = document.querySelector('.side-topics-scroll');
    var top = sc ? sc.scrollTop : 0;
    var win = window.scrollY;
    render();
    sc = document.querySelector('.side-topics-scroll');
    if (sc) sc.scrollTop = top;
    window.scrollTo(0, win);
  }

  var toastT;
  function toast(msg, geriAl) {
    var t = $('#toast');
    t.innerHTML = '';
    var s = document.createElement('span');
    s.textContent = msg;
    t.appendChild(s);
    if (geriAl) {
      var b = document.createElement('button');
      b.className = 'toast-undo';
      b.setAttribute('data-a', 'geriAl');
      b.textContent = 'Geri al';
      t.appendChild(b);
    }
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, geriAl ? 7000 : 2600);
  }

  /* ================= Olaylar ================= */
  function yedekIndir() {
    var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ags-takip-yedek-' + bugunStr() + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  var ACTIONS = {
    nav: function (el) { ui.view = el.dataset.id; location.hash = el.dataset.id; window.scrollTo(0, 0); render(); },
    ders: function (el) { ui.ders = el.dataset.id; renderKorumali(); },
    agsders: function (el) { ui.agsDers = el.dataset.id; render(); },
    denemetur: function (el) { ui.denemeTur = el.dataset.id; render(); },
    toggle: function (el) {
      var id = el.dataset.id;
      var st = S.durum[id] || 0;
      if (st === 3) { tekrarYap(id); return; }
      if (st === 2) {
        var tk = S.tekrar[id];
        if (tk && tk.n > 0 && !confirm('Bu konunun tekrar geçmişi silinecek. "Bitti" işareti kaldırılsın mı?')) {
          renderKorumali(); return;
        }
        durumAyarla(id, 0);
      } else {
        durumAyarla(id, 2);
      }
      kaydet(); renderKorumali();
    },
    cycle: function (el) {
      var id = el.dataset.id;
      durumAyarla(id, ((S.durum[id] || 0) + 1) % 4);
      kaydet(); renderKorumali();
    },
    not: function (el) {
      var id = el.dataset.id;
      ui.acikNot[id] = !ui.acikNot[id];
      renderKorumali();
      var ta = document.querySelector('textarea[data-note="' + id.replace(/"/g, '\\"') + '"]');
      if (ta) ta.focus();
    },
    delkonu: function (el) {
      var dId = el.dataset.ders, id = el.dataset.id;
      if (!confirm('Bu konu silinsin mi?')) return;
      S.ozel[dId] = (S.ozel[dId] || []).filter(function (k) { return k.id !== id; });
      delete S.durum[id]; delete S.notlar[id]; delete S.linkler[id]; delete S.tekrar[id];
      kaydet(); renderKorumali();
    },
    delden: function (el) {
      if (!confirm('Bu deneme silinsin mi?')) return;
      var id = +el.dataset.id;
      S.denemeler = S.denemeler.filter(function (d) { return d.id !== id; });
      kaydet(); render();
    },
    toggle7day: function () {
      ui.takvimAcik = !ui.takvimAcik;
      renderKorumali();
    },
    plgun: function (el) { ui.planGun = +el.dataset.g; render(); },
    gtoggle: function (el) {
      var g = +el.dataset.g, j = +el.dataset.j, t = (S.plan[g] || [])[j];
      if (!t) return;
      if (t.tip === 'konu' && t.konuId) {
        var id = t.konuId, st = S.durum[id] || 0;
        if (st >= 2) {
          var tk = S.tekrar[id];
          if (tk && tk.n > 0 && !confirm('Bu konunun tekrar geçmişi silinecek. "Bitti" işareti kaldırılsın mı?')) return;
          durumAyarla(id, 0);
        } else {
          durumAyarla(id, 2);
          if (S.tekrar[id]) toast('Bitti olarak işaretlendi. İlk tekrar ' + fmtTarih(S.tekrar[id].sonraki) + ' tarihinde.');
        }
      } else if (t.tip === 'tekrar') {
        if (t.done) return;
        if (!S.tekrar[t.repeatKonuId]) {
          S.plan[g].splice(j, 1); kaydet(); render();
          toast('Bu konunun tekrar kaydı kalmamış, blok kaldırıldı.');
          return;
        }
        tekrarYap(t.repeatKonuId);
        return;
      } else {
        t.done = !t.done;
      }
      kaydet(); render();
    },
    gdel: function (el) {
      var g = +el.dataset.g, j = +el.dataset.j;
      if (!S.plan[g] || !S.plan[g][j]) return;
      S.plan[g].splice(j, 1);
      kaydet(); render();
    },
    gdegis: function (el) {
      var g = +el.dataset.g, j = +el.dataset.j, t = (S.plan[g] || [])[j];
      if (!t) return;
      var kb = t.konuId ? konuBul(t.konuId) : null;
      ui.sheet = { tip: 'konu', mod: 'degis', g: g, j: j, ders: kb ? kb.d.id : DERSLER[0].id };
      sheetAc();
    },
    gekle: function (el) {
      var sd = (S.planAyarlar && S.planAyarlar.seciliDersler && S.planAyarlar.seciliDersler[0]) || DERSLER[0].id;
      ui.sheet = { tip: 'konu', mod: 'ekle', g: +el.dataset.g, ders: dersBul(sd).id };
      sheetAc();
    },
    aksamsw: function (el) {
      var g = +el.dataset.g, tasks = S.plan[g] || [], var_ = false, i;
      for (i = tasks.length - 1; i >= 0; i--) {
        if (tasks[i].tip === 'aksam') { tasks.splice(i, 1); var_ = true; }
      }
      if (!var_) tasks.push({ t: 'Soru çözümü & deneme', tip: 'aksam', oturum: 'ak', bas: '21:00', bit: '22:30', done: false, manual: true });
      S.plan[g] = tasks.sort(zamanSirala);
      if (!Array.isArray(S.planAyarlar.aksamGunler) || S.planAyarlar.aksamGunler.length !== 7) S.planAyarlar.aksamGunler = [false, false, false, false, false, false, false];
      S.planAyarlar.aksamGunler[g] = !var_;
      kaydet(); render();
    },
    planac: function () {
      planNormalle();
      ui.wz = wzBaslat();
      ui.sheet = { tip: 'wz' };
      sheetAc();
    },
    gitplansihirbaz: function () {
      ui.view = 'plan'; location.hash = 'plan';
      window.scrollTo(0, 0); render();
      ACTIONS.planac();
    },
    planbosalt: function () {
      if (!confirm('Bu haftanın tüm planı boşaltılsın mı? Konuların durumu ve tekrar kayıtların değişmez.')) return;
      for (var i = 0; i < 7; i++) S.plan[i] = [];
      S.planHafta = '';
      kaydet(); render(); toast('Haftalık plan boşaltıldı.');
    },
    wzders: function (el) {
      var id = el.dataset.id, a = ui.wz.dersler, ix = a.indexOf(id);
      if (ix === -1) a.push(id); else a.splice(ix, 1);
      sheetCiz();
    },
    wzgun: function (el) { var g = +el.dataset.g; ui.wz.gunler[g] = !ui.wz.gunler[g]; sheetCiz(); },
    wzaksam: function (el) { var g = +el.dataset.g; ui.wz.aksam[g] = !ui.wz.aksam[g]; sheetCiz(); },
    wzhiz: function (el) { ui.wz.hiz = parseFloat(el.dataset.val) || 1.5; sheetCiz(); },
    wzolustur: function () {
      var w = ui.wz;
      if (!w || wzGecerli(w)) return;
      var r = planUret({ dersler: w.dersler, gunler: w.gunler, aksam: w.aksam, hiz: w.hiz });
      S.plan = r.plan;
      S.planHafta = r.hafta;
      S.planAyarlar = { v2: true, hiz: w.hiz, seciliDersler: w.dersler.slice(), aktifGunler: w.gunler.slice(), aksamGunler: w.aksam.slice() };
      ui.planGun = (r.hafta === haftaBasi()) ? bugunIdx() : 0;
      kaydet(); sheetKapat(); render();
      toast((r.hafta > haftaBasi() ? 'Bu haftada kalan gün olmadığı için gelecek haftanın planı hazırlandı. ' : '') + r.say.konu + ' konu ve ' + r.say.tekrar + ' tekrar yerleştirildi.' +
        (r.kalanTekrar ? ' ' + r.kalanTekrar + ' tekrar bu haftaya sığmadı; Panel’de görünür.' : ''));
    },
    sheetkapat: function () { sheetKapat(); },
    sheetders: function (el) { if (ui.sheet) { ui.sheet.ders = el.dataset.id; sheetCiz(true); } },
    sheetsec: function (el) {
      var kb = konuBul(el.dataset.id);
      if (!kb || !ui.sheet) return;
      sheetUygula({ t: kb.k.ad, ders: kb.d.kisa, tip: 'konu', konuId: kb.k.id, done: false, manual: true });
    },
    geriAl: function () {
      var u = ui.geriAl;
      if (!u) return;
      if (u.tekrar) S.tekrar[u.id] = u.tekrar; else delete S.tekrar[u.id];
      if (u.durum) S.durum[u.id] = u.durum; else delete S.durum[u.id];
      S.istatistik = u.ist;
      u.gorevler.forEach(function (t) { t.done = false; });
      ui.geriAl = null;
      kaydet(); renderKorumali(); toast('Tekrar geri alındı.');
    },
    settings: function () {
      $('#d-ags').value = S.tarih.ags || '';
      $('#d-oabt').value = S.tarih.oabt || '';
      $('#settings').showModal();
    },
    closeSettings: function () { $('#settings').close(); },
    export: function () { yedekIndir(); },
    reset: function () {
      if (!confirm('Tüm ilerleme, deneme ve plan verileri silinecek. Emin misiniz?')) return;
      if (!confirm('Bu işlem geri alınamaz. Devam edilsin mi?')) return;
      S = varsayilan(); ui.acikNot = {}; kaydet();
      $('#settings').close(); render(); toast('Veriler sıfırlandı.');
    },
    tekrarok: function (el) {
      tekrarYap(el.dataset.id);
    },
    tekrarertele: function (el) {
      var id = el.dataset.id;
      var t = S.tekrar[id];
      if (!t) return;
      t.sonraki = gunEkle(bugunStr(), 1);
      kaydet(); renderKorumali();
      toast('Tekrar yarına ertelendi. En kısa sürede göz atın! ⏳');
    },
    tekrarfiltre: function () {
      ui.sadeceTekrar = !ui.sadeceTekrar;
      renderKorumali();
    },
    derslink: function (el) {
      var id = el.dataset.id;
      var ham = prompt('Bu ders için YouTube listesi / kanal / kaynak adresi (boş bırakırsanız silinir):', S.dersLink[id] || '');
      if (ham === null) return;
      var u = urlDuzelt(ham);
      if (ham.trim() && !u) { toast('Geçerli bir http/https adresi girin.'); return; }
      if (u) S.dersLink[id] = u; else delete S.dersLink[id];
      kaydet(); renderKorumali();
    },
    surehiz: function (el) {
      var h = parseFloat(el.dataset.val) || 2.0;
      ui.sureHiz = h;
      S.hiz = h;
      kaydet();
      render();
      toast('İzleme hızı ' + h + 'x olarak güncellendi ⚡');
    },
    surehedef: function (el) {
      var hd = parseFloat(el.dataset.val) || 2.0;
      ui.sureHedef = hd;
      S.hedef = hd;
      kaydet();
      render();
      toast('Günlük hedef ' + hd + ' saat olarak ayarlandı 🎯');
    },
    surekat: function (el) {
      ui.sureKat = el.dataset.val;
      render();
    },
    sureplanekle: function (el) {
      var ad = el.dataset.ad;
      var sure = el.dataset.sure;
      planNormalle();
      var gorev = ad + ' (' + hizYaz(ui.sureHiz || 2.0) + ': ~' + sure + ' sa)';
      S.plan[bugunIdx()].push({ t: gorev, tip: 'ozel', done: false, manual: true });
      if (!S.planHafta) S.planHafta = haftaBasi();
      kaydet();
      toast('"' + ad + '" bugünkü Haftalık Plan\'a eklendi.');
    }
  };

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-a]');
    if (!el) return;
    var f = ACTIONS[el.dataset.a];
    if (f) f(el);
  });

  document.addEventListener('submit', function (e) {
    var f = e.target.dataset.form;
    if (!f) return;
    e.preventDefault();
    var fd = new FormData(e.target);

    if (f === 'konuekle') {
      var ad = String(fd.get('ad') || '').trim();
      if (!ad) return;
      var dId = e.target.dataset.ders;
      (S.ozel[dId] = S.ozel[dId] || []).push({ id: dId + ':ozel-' + Date.now(), ad: ad });
      kaydet(); renderKorumali();
    } else if (f === 'sheetozel') {
      var oad = String(fd.get('ad') || '').trim();
      if (!oad || !ui.sheet) return;
      sheetUygula({ t: oad, tip: 'ozel', done: false, manual: true });
    } else if (f === 'denemeekle') {
      var tur = fd.get('tur');
      var d = parseInt(fd.get('d'), 10) || 0, y = parseInt(fd.get('y'), 10) || 0;
      var max = TOPLAM_SORU[tur];
      if (d + y > max) { toast('Doğru + yanlış ' + max + ' soruyu geçemez.'); return; }
      S.denemeler.push({
        id: Date.now(), tur: tur, ad: String(fd.get('ad') || '').trim(),
        tarih: fd.get('tarih'), d: d, y: y, b: max - d - y, net: d - y / 4
      });
      ui.denemeTur = tur;
      kaydet(); render(); toast('Deneme kaydedildi.');
    }
  });

  // Notları yazarken tekrar çizmeden kaydet
  document.addEventListener('input', function (e) {
    var id = e.target.dataset && e.target.dataset.note;
    if (!id) return;
    var v = e.target.value;
    if (v.trim()) S.notlar[id] = v; else delete S.notlar[id];
    kaydet();
  });

  // Not alanından çıkınca işaret (✎ vurgusu) güncellensin
  document.addEventListener('focusout', function (e) {
    if (e.target.dataset && e.target.dataset.note) {
      var id = e.target.dataset.note;
      var btn = document.querySelector('[data-a="not"][data-id="' + id.replace(/"/g, '\\"') + '"]');
      if (btn) btn.classList.toggle('has-note', !!S.notlar[id] || !!S.linkler[id]);
    }
  });

  // Video/kaynak linki: alandan çıkınca doğrula ve kaydet (yeniden çizmeden, böylece not alanına geçiş bozulmaz)
  document.addEventListener('change', function (e) {
    var id = e.target.dataset && e.target.dataset.link;
    if (!id) return;
    var ham = e.target.value.trim();
    var u = urlDuzelt(ham);
    if (ham && !u) { toast('Geçerli bir http/https adresi girin.'); return; }
    if (u) { S.linkler[id] = u; e.target.value = u; } else { delete S.linkler[id]; }
    kaydet();
    var btn = document.querySelector('[data-a="not"][data-id="' + id.replace(/"/g, '\\"') + '"]');
    if (btn) btn.classList.toggle('has-note', !!S.notlar[id] || !!S.linkler[id]);
  });

  $('#d-ags').addEventListener('change', function (e) { S.tarih.ags = e.target.value; S.tarih.onayli = true; kaydet(); render(); });
  $('#d-oabt').addEventListener('change', function (e) { S.tarih.oabt = e.target.value; S.tarih.onayli = true; kaydet(); render(); });

  $('#import').addEventListener('change', function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var r = JSON.parse(fr.result);
        if (!r || typeof r !== 'object' || !r.durum) throw new Error('geçersiz');
        var d = varsayilan();
        Object.keys(d).forEach(function (k) { if (r[k] !== undefined) d[k] = r[k]; });
        S = d; kaydet(); $('#settings').close(); render(); toast('Yedek yüklendi.');
      } catch (err) { toast('Bu dosya geçerli bir yedek değil.'); }
    };
    fr.readAsText(f);
    e.target.value = '';
  });

  /* ================= Başlat ================= */
  $('#ico-settings').innerHTML = IC.settings;
  var hash = (location.hash || '').replace('#', '');
  if (hash === 'plan-sihirbaz') {
    ui.view = 'plan';
    ui.planWizardAcik = true;
  } else if (hash && VIEWS[hash]) {
    ui.view = hash;
  }
  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    if (h === 'plan-sihirbaz') {
      ui.view = 'plan';
      window.scrollTo(0, 0);
      render();
      ACTIONS.planac();
    } else if (h && VIEWS[h]) {
      ui.view = h;
      window.scrollTo(0, 0);
      render();
    }
  });
  if (planNormalle()) kaydet();
  render();
  if (ui.planWizardAcik) { ui.planWizardAcik = false; ACTIONS.planac(); }
  if (navigator.storage && navigator.storage.persist) { navigator.storage.persist(); }
})();
