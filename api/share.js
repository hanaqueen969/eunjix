export default async function handler(req, res) {
    const { id } = req.query; // Mengambil MD5 Hash dari URL
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;

    try {
        // 1. Server membaca data.json milikmu
        const dataRes = await fetch(`${baseUrl}/data.json`);
        const romData = await dataRes.json();

        // 2. Mencari ROM yang sesuai dengan id (MD5)
        const rom = romData.find(r => r.md5 === id);

        if (!rom) {
            // Jika ROM dihapus/tidak ada, kembalikan ke halaman utama
            return res.redirect(302, '/');
        }

        // 3. Jika ketemu, ciptakan HTML instan dengan Meta Tag khusus ROM tersebut!
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Download ${rom.name} - EunjiX</title>

                <meta property="og:title" content="${rom.name}">
                <meta property="og:description" content="📱 Device: ${rom.device} | 📦 Size: ${rom.size} | 👨‍💻 Maintainer: ${rom.maintainer}. Download now at EunjiX Repository!">
                <meta property="og:image" content="${baseUrl}/eunji.png">
                <meta property="og:url" content="${baseUrl}/api/share?id=${id}">
                <meta property="og:type" content="website">

                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="${rom.name}">
                <meta name="twitter:description" content="Download ${rom.type} for ${rom.device}.">
                <meta name="twitter:image" content="${baseUrl}/eunji.png">

                <meta http-equiv="refresh" content="0;url=/#${id}">
                <script>
                    window.location.replace('/#' + '${id}');
                </script>
            </head>
            <body style="background-color: #0A0A0C; color: #BC9CFF; font-family: monospace; text-align: center; padding-top: 20vh;">
                <h2>⚡ Intercepting Cyber-Link...</h2>
                <p>Redirecting to ${rom.name}...</p>
            </body>
            </html>
        `;

        // 5. Kirim hasilnya ke bot / browser
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        // Jika terjadi error pada server, selamatkan pengunjung ke halaman utama
        res.redirect(302, '/');
    }
}
