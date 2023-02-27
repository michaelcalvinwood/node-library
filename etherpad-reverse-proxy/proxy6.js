var httpProxy = require('http-proxy');
var fs = require('fs');

var proxy = httpProxy.createServer((req, res, proxy) => 
{
    proxy.proxyRequest(req, res, {
      host: '127.0.0.1',
      port: 9001
    });
})


proxy.listen({	ssl: {
    key: fs.readFileSync('/home/keys/treepadcloud.com.key', 'utf8'),
    cert: fs.readFileSync('/home/keys/treepadcloud.com.pem', 'utf8')
  }}, 6105, '0.0.0.0');
