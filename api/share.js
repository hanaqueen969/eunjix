const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
    const id = req.query.id;
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;

    try {
        const filePath = path.join(process.cwd(), 'data.json');
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const romData = JSON.parse(jsonData);

        const rom = romData.find(r => r.md5 === id);

        if (!rom) {
            return res.status(404).send("Error 404: ROM Not Found. Tautan mungkin kadaluarsa.");
        }

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download ${rom.name}</title>

            <meta property="og:title" content="${rom.name}">
            <meta property="og:description" content="📱 Device: ${rom.device} | 📦 Size: ${rom.size} | 👨‍💻 Maintainer: ${rom.maintainer}. Download now!">
            <meta property="og:image" content="${baseUrl}/eunji.png">
            <meta property="og:url" content="${baseUrl}/api/share?id=${id}">
            <meta property="og:type" content="website">

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

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        res.status(500).send("Server Error: " + error.message);
    }
};
