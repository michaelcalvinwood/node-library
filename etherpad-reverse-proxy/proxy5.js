var http = require('http'),
    httpProxy = require('http-proxy');
var fs = require('fs');

const proxy = httpProxy.createServer({});

http.createServer(function(req, res) {
  console.log(req);
	proxy.web(req, res, { 
		ssl: {
    key: fs.readFileSync('/home/keys/treepadcloud.com.key', 'utf8'),
    cert: fs.readFileSync('/home/keys/treepadcloud.com.pem', 'utf8')
  },
		target: 'https://127.0.0.1:9001' });
}).listen(6105, '0.0.0.0');
