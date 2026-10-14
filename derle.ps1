$template = if (Test-Path "index.template.html") { "index.template.html" } else { "index.html" }
$html = Get-Content -Raw -Encoding UTF8 $template
$css = Get-Content -Raw -Encoding UTF8 "style.css"
$konular = Get-Content -Raw -Encoding UTF8 "konular.js"
$app = Get-Content -Raw -Encoding UTF8 "app.js"

$bundle = $html.Replace('<link rel="stylesheet" href="style.css">', "<style>`n$css`n</style>")
$bundle = $bundle.Replace('<script src="konular.js"></script>', '')
$bundle = $bundle.Replace('<script src="app.js"></script>', "<script>`n$konular`n$app`n</script>")

[System.IO.File]::WriteAllText("ags-takip-tek-dosya.html", $bundle, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("index.html", $bundle, [System.Text.Encoding]::UTF8)
Write-Output ("Bundle olusturuldu (index.html & ags-takip-tek-dosya.html). Boyut: " + (Get-Item "index.html").Length + " bayt")
