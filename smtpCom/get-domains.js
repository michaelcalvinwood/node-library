const baseURL = 'https://api.smtp.com/v4/';
const axios = require('axios');

require('dotenv').config();

const getDomains = async () => {
    let request = {
        url: baseURL + 'domains/&api_key=' + process.env.SMTP_COM_API_KEY,
        method: 'get'
    }
    let domains = null;
    console.log(request);
    try {
        domains = await axios(request);
        console.log(domains);
    } catch (e) {
        console.error(e);
    }

}

getDomains();