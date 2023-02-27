var http = require('http'),
    httpProxy = require('http-proxy');
var fs = require('fs');

//
// Create a proxy server with latency
//
var proxy = httpProxy.createProxyServer();
 
//
// Create your server that makes an operation that waits a while
// and then proxies the request
//
http.createServer(function (req, res) {
  // This simulates an operation that takes 500ms to execute
    proxy.web(req, res, {
      target: 'http://127.0.0.1:9001',
    ssl: {
    	key: fs.readFileSync('/home/keys/treepadcloud.com.key', 'utf8'),
    	cert: fs.readFileSync('/home/keys/treepadcloud.com.pem', 'utf8')
  	}
   });
}).listen(6105, '0.0.0.0');
 
