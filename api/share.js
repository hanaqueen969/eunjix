module.exports = function handler(req, res) {
    const id = req.query.id;
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;

    try {
        // 1. CARA SUPER AMAN: Memaksa Vercel mengimpor data.json langsung ke jantung server
        const romData = require('../data.json');

        // Cari ROM berdasarkan MD5
        const rom = romData.find(r => r.md5 === id);

        if (!rom) {
            return res.status(404).send("Error 404: ROM Not Found. Tautan mungkin kadaluarsa.");
        }

        // 2. JEBAKAN BOT: Buang meta refresh, biarkan JS bekerja untuk manusia!
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download ${rom.name}</title>

            <meta property="og:title" content="Download ${rom.name}">
            <meta property="og:description" content="📱 Device: ${rom.device} | 📦 Size: ${rom.size} | 👨‍💻 Maintainer: ${rom.maintainer}">
            <meta property="og:image" content="${baseUrl}/eunji.png">
            <meta property="og:url" content="${baseUrl}/api/share?id=${id}">
            <meta property="og:type" content="website">
            <meta name="theme-color" content="#BC9CFF">

            <script>
                window.location.replace('/#' + '${id}');
            </script>
        </head>
        <body style="background-color: #0A0A0C; color: #BC9CFF; font-family: monospace; text-align: center; padding-top: 20vh;">
            <h2>⚡ Intercepting Cyber-Link...</h2>
            <p>Routing secure connection to ${rom.name}...</p>
            <p>If you are not redirected, <a href="/#${id}" style="color: #00c6ff;">click here</a>.</p>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        res.status(500).send("Server Error: Gagal memuat data.json");
    }
};
