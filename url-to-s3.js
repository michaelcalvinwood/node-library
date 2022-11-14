const { S3, ListObjectsV2Command , PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs').promises;
const mime = require('mime-types');
const axios = require('axios');

const {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET} = process.env;

const s3Client = new S3({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_KEY,
        secretAccessKey: S3_SECRET
    }
});

const upload = async (localFolder, bucketFolder, data = '') => {
    if (!data) data = await fsp.readFile(localFolder+fileName);
    let contentType = '';

    contentType = mime.lookup(fileName);

    if (!contentType) {
        console.error(`upload: Could not determine mime type for: ${fileName}`);
        return;
    }

    const bucketParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `${bucketFolder}/${fileName}`,
        Body: data,
        ACL: 'public-read',
        'Content-Type': contentType
      };
    
      try {
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        const link = `https://${process.env.S3_BUCKET}.${process.env.S3_ENDPOINT_DOMAIN}/${bucketParams.Key}`;
        return link;
      } catch (err) {
        console.log("Error", err);
        return '';
      }      
};

const downloadAxiosFile = async (url, filePath) => {  
    return new Promise(async (resolve, reject) => {
        const writer = fs.createWriteStream(filePath)
    
        let response;

        try {
            response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
            })
        } catch (e) {
            console.error(e);
            reject(e);
            return false;
        }
        response.data.pipe(writer)
  
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
  }

