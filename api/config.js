module.exports = (req, res) => {
    const rawUrl = process.env.SUPABASE_URL || '';
    const normalizedUrl = rawUrl
        ? rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
            ? rawUrl
            : `https://${rawUrl.replace(/^\/+/, '')}`
        : '';

    const config = {
        SUPABASE_URL: normalizedUrl,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(`window.APP_CONFIG = ${JSON.stringify(config)};`);
};