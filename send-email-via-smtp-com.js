require('dotenv').config();

const sendEmaiViaSMTPcom = (recipientEmailAddress, senderEmailAddress, subject, html, channel, fromName = '') => {
   return new Promise((resolve, reject) => {
       let request = {
           url: `https://api.smtp.com/v4/messages?api_key=${process.env.SMTP_COM_API_KEY}`,
           method: 'post',
           data: {
               "channel": channel,
               "recipients": {
                 "to": [
                   {
                     "address": recipientEmailAddress
                   }
                 ]
               },
               "originator": {
                 "from": {
                   "name": fromName ? fromName : senderEmailAddress,
                   "address": senderEmailAddress
                 }
               },
               "subject": subject,
               "body": {
                 "parts": [
                   {
                     "type": "text/html",
                     "content": html
                   }
                 ]
               }
             }
       }
    
       axios(request)
       .then(result => {
           //console.log ("hello result");
            resolve(result.data)       
           return;
       })
       .catch(err => {
           // TODO: add error function that not only sends errors to customers but logs them in the error database as well
           // TODO: use this error function for all res errors.
    
           console.log('error', JSON.stringify(err));
           reject(err)
           return;
       })
    
       return;
   })
}