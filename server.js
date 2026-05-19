const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const envPath = path.join(rootDir, '.env');

function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    const parsed = {};
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }

        const equalsIndex = trimmed.indexOf('=');
        if (equalsIndex === -1) {
            continue;
        }

        const key = trimmed.slice(0, equalsIndex).trim();
        let value = trimmed.slice(equalsIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        parsed[key] = value;
    }

    return parsed;
}

const env = loadEnv(envPath);
const port = Number(process.env.PORT || 3000);

function send(res, statusCode, content, contentType) {
    res.writeHead(statusCode, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store'
    });
    res.end(content);
}

function serveFile(res, filePath) {
    if (!fs.existsSync(filePath)) {
        send(res, 404, 'Not found', 'text/plain; charset=utf-8');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === '.html' ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8';
    send(res, 200, fs.readFileSync(filePath), contentType);
}

function serveConfig(res) {
    const config = {
        SUPABASE_URL: env.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || ''
    };

    send(
        res,
        200,
        `window.APP_CONFIG = ${JSON.stringify(config)};`,
        'application/javascript; charset=utf-8'
    );
}

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);

    if (requestUrl.pathname === '/config.js' || requestUrl.pathname === '/api/config.js') {
        serveConfig(res);
        return;
    }

    // Serve upload.html as the homepage (root) so the bot can land there
    if (requestUrl.pathname === '/' || requestUrl.pathname === '/upload' || requestUrl.pathname === '/upload.html') {
        serveFile(res, path.join(rootDir, 'upload.html'));
        return;
    }

    // Keep dashboard accessible at /index.html explicitly
    if (requestUrl.pathname === '/index.html') {
        serveFile(res, path.join(rootDir, 'index.html'));
        return;
    }

    const staticPath = path.join(rootDir, requestUrl.pathname.replace(/^\//, ''));
    if (staticPath.startsWith(rootDir) && fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
        serveFile(res, staticPath);
        return;
    }

    send(res, 404, 'Not found', 'text/plain; charset=utf-8');
});

server.listen(port, () => {
    console.log(`Steam Radar server running at http://localhost:${port}`);
});