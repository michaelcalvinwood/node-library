const privateKeyPath = '/etc/letsencrypt/live/node.pymnts.com/privkey.pem';
const fullchainPath = '/etc/letsencrypt/live/node.pymnts.com/fullchain.pem';

const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const httpsServer = https.createServer({
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullchainPath),
  }, app);
  

  httpsServer.listen(5100, () => {
    console.log('HTTPS Server running on port 5100');
});
