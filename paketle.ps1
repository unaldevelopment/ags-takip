$outputZip = "ags-takip-web.zip"
if (Test-Path $outputZip) { Remove-Item $outputZip }

$files = @(
    "index.html",
    "style.css",
    "konular.js",
    "app.js",
    "manifest.json",
    "sw.js",
    "icon-192.png",
    "icon-512.png"
)

Compress-Archive -Path $files -DestinationPath $outputZip
Write-Output "Web paketi hazirlandi: $outputZip (Boyut: $((Get-Item $outputZip).Length) bayt)"
