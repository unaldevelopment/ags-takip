/* Tarayıcısız test düzeneği: DOM'u taklit eder, app.js + konular.js'i çalıştırır.
   Kullanım: bkz. test/senaryolar.js. Proje kökünden çalıştır:  node test/senaryolar.js */
const fs = require('fs');
const path = require('path');
const kok = path.join(__dirname, '..');
const RealDate = Date;

function setNow(iso) {                       // sahte saat: 'YYYY-MM-DDTHH:MM:SS' (yerel)
  const fixed = new RealDate(iso).getTime();
  global.Date = class extends RealDate {
    constructor(...a) { if (a.length) super(...a); else super(fixed); }
    static now() { return fixed; }
  };
}

const store = {}, els = {};
let handlers = {}, dialog = null;
const mk = () => ({
  innerHTML: '', value: '', hidden: false, dataset: {}, open: false, style: {}, scrollTop: 0,
  classList: { toggle() {}, add() {}, remove() {} },
  addEventListener() {}, appendChild() {}, setAttribute() {}, click() {}, remove() {},
  querySelector() { return null; },
  showModal() { this.open = true; }, close() { this.open = false; }
});
global.window = global;
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
global.document = {
  querySelector: s => els[s] || (els[s] = mk()),
  addEventListener: (t, f) => { (handlers[t] = handlers[t] || []).push(f); },
  createElement: tag => { const e = mk(); if (tag === 'dialog') dialog = e; return e; },
  body: mk()
};
global.location = { hash: '' };
global.navigator = {};
global.scrollTo = () => {};
global.addEventListener = () => {};
global.scrollY = 0;
global.confirm = () => true;
global.prompt = () => null;

const konular = fs.readFileSync(path.join(kok, 'konular.js'), 'utf8');
const app = fs.readFileSync(path.join(kok, 'app.js'), 'utf8');

function boot(state) {                       // state: localStorage'a yazılacak nesne (yoksa temiz başlangıç)
  for (const k in store) delete store[k];
  for (const k in els) delete els[k];
  handlers = {}; dialog = null;
  if (state) store['ags-takip-v1'] = JSON.stringify(state);
  (0, eval)(konular); (0, eval)(app);
}
function click(a, ds) {                      // data-a="..." düğmesine tıklamayı taklit eder
  const el = { dataset: Object.assign({ a }, ds || {}) };
  el.closest = () => el;
  (handlers.click || []).forEach(f => f({ target: el, preventDefault() {} }));
}
const S = () => JSON.parse(store['ags-takip-v1'] || '{}');
const main = () => els['#main'].innerHTML;
const sheet = () => (dialog ? dialog.innerHTML : '');
const text = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const pad = n => (n < 10 ? '0' + n : '' + n);
const ds = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const ago = n => { const d = new Date(); d.setDate(d.getDate() - n); return ds(d); };
const dk = s => +s.split(':')[0] * 60 + +s.split(':')[1];

module.exports = { setNow, boot, click, S, main, sheet, text, ago, dk, store };
