module.exports = function handler(req, res) {
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
        const romData = require('../data.json');

        let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>EunjiX - Custom ROM &amp; Kernel Repository</title>
    <link>${baseUrl}</link>
    <description>Next-Gen Custom ROM &amp; Kernel Repository by Great Albantani.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />`;

        romData.forEach(rom => {
            const romUrl = `${baseUrl}/api/share?id=${rom.md5}`;
            xml += `
    <item>
        <title>${rom.name}</title>
        <link>${romUrl}</link>
        <guid isPermaLink="true">${romUrl}</guid>
        <description><![CDATA[ 📱 Device: ${rom.device} <br> 📦 Size: ${rom.size} <br> 👨‍💻 Maintainer: ${rom.maintainer} <br> 📂 Category: ${rom.category} ]]></description>
    </item>`;
        });

        xml += `
</channel>
</rss>`;

        res.setHeader('Content-Type', 'text/xml; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).send(xml);

    } catch (error) {
        res.status(500).send("Server Error: Gagal membuat RSS Feed");
    }
};
