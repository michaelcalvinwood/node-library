// https://www.npmjs.com/package/http-proxy
// https://www.npmjs.com/package/ep_headerauth
//
var http = require('http'),
    httpProxy = require('http-proxy');
var fs = require('fs');
var https = require('https');

var keys = {
    key: fs.readFileSync('/home/keys/treepadcloud.com.key', 'utf8'),
    cert: fs.readFileSync('/home/keys/treepadcloud.com.pem', 'utf8')
  }

var proxy = httpProxy.createServer({ws : true})


https.createServer(keys, (req, res) => {
	console.log(req.url);
	//if (req.url.startsWith('/p')) return;
	proxy.web(req, res, { 
		target: 'https://127.0.0.1:9001'});	
}).listen(443, '0.0.0.0');
