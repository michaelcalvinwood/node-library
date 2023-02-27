var http = require('http'),
    httpProxy = require('http-proxy');
var fs = require('fs');

httpProxy.createServer({
  ssl: {
    key: fs.readFileSync('/home/keys/treepadcloud.com.key', 'utf8'),
    cert: fs.readFileSync('/home/keys/treepadcloud.com.pem', 'utf8')
  },
  target: 'https://127.0.0.1:9001',
  secure: true // Depends on your needs, could be false.
}, (req, res) => console.log(req)).listen(6105, '0.0.0.0');
