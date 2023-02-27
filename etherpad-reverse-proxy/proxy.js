const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

const app = express();

const PORT = 6105;

const API_URL = "<http://127.0.0.1:9001>";

app.get("/status", (req, res, next) => {
    res.send('This is a proxy service');
});

const proxyOptions = {
    target: API_URL,
    changeOrigin: true,
	ssl: {
		key: fs.readFileSync('/home/keys/treepadcloud.com.key', 'utf8'),
    cert: fs.readFileSync('/home/keys/treepadcloud.com.pem', 'utf8')
}}

const proxy = createProxyMiddleware(proxyOptions);

app.use(proxy)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy Started `)
});
