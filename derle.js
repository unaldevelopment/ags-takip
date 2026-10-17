/* derle.ps1'in Node karşılığı (Windows dışında / PowerShell olmadan derlemek için).
   Kullanım (proje kökünde):  node derle.js
   index.template.html + style.css + konular.js + app.js  →  index.html ve ags-takip-tek-dosya.html */
const fs = require('fs');
const oku = f => fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '');
const html = oku(fs.existsSync('index.template.html') ? 'index.template.html' : 'index.html');
const css = oku('style.css'), konular = oku('konular.js'), app = oku('app.js');
const bundle = html
  .replace('<link rel="stylesheet" href="style.css">', () => '<style>\n' + css + '\n</style>')
  .replace('<script src="konular.js"></script>', () => '')
  .replace('<script src="app.js"></script>', () => '<script>\n' + konular + '\n' + app + '\n</script>');
['index.html', 'ags-takip-tek-dosya.html'].forEach(f => fs.writeFileSync(f, '\uFEFF' + bundle, 'utf8'));
console.log('Bundle oluşturuldu (index.html & ags-takip-tek-dosya.html). Boyut: ' + Buffer.byteLength('\uFEFF' + bundle) + ' bayt');
