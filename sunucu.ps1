# Yerel test sunucusu (Python/Node gerektirmez). Kullanım: baslat.bat dosyasına çift tıklayın.
# Dosyaları önbelleğe almaz; kodu değiştirince sayfayı yenilemeniz yeterli.
param([int]$Port = 8080)

$code = @'
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public static class MiniServer
{
    static string Mime(string ext)
    {
        switch (ext.ToLowerInvariant())
        {
            case ".html": return "text/html; charset=utf-8";
            case ".css":  return "text/css; charset=utf-8";
            case ".js":   return "application/javascript; charset=utf-8";
            case ".json": return "application/json; charset=utf-8";
            case ".png":  return "image/png";
            case ".jpg":  return "image/jpeg";
            case ".svg":  return "image/svg+xml";
            default:      return "application/octet-stream";
        }
    }

    public static void Run(string root, int port)
    {
        root = Path.GetFullPath(root).TrimEnd(Path.DirectorySeparatorChar);
        var l = new TcpListener(IPAddress.Any, port);
        l.Start();
        while (true)
        {
            var c = l.AcceptTcpClient();
            var t = new Thread(() => Handle(c, root));
            t.IsBackground = true;
            t.Start();
        }
    }

    static void Send(Stream s, int code, string status, string type, byte[] body)
    {
        var head = "HTTP/1.1 " + code + " " + status + "\r\nContent-Type: " + type +
                   "\r\nContent-Length: " + body.Length +
                   "\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n";
        var hb = Encoding.ASCII.GetBytes(head);
        s.Write(hb, 0, hb.Length);
        s.Write(body, 0, body.Length);
    }

    static void Handle(TcpClient c, string root)
    {
        try
        {
            using (c)
            {
                c.ReceiveTimeout = 5000;
                var s = c.GetStream();
                var r = new StreamReader(s, Encoding.ASCII, false, 4096, true);
                string line = r.ReadLine();
                if (string.IsNullOrEmpty(line)) return;
                string h;
                while (!string.IsNullOrEmpty(h = r.ReadLine())) { }
                var parts = line.Split(' ');
                if (parts.Length < 2) return;
                string path = Uri.UnescapeDataString(parts[1].Split('?')[0]);
                if (path == "/") path = "/index.html";
                string full = Path.GetFullPath(Path.Combine(root, path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar)));
                if (!full.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase) || !File.Exists(full))
                {
                    Send(s, 404, "Not Found", "text/plain; charset=utf-8", Encoding.UTF8.GetBytes("404"));
                    return;
                }
                Send(s, 200, "OK", Mime(Path.GetExtension(full)), File.ReadAllBytes(full));
            }
        }
        catch (Exception) { }
    }
}
'@

Add-Type -TypeDefinition $code
Write-Host "Sunucu calisiyor: http://localhost:$Port/  (kapatmak icin bu pencereyi kapatin)"
[MiniServer]::Run($PSScriptRoot, $Port)
