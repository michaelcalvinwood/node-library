const { S3, ListObjectsV2Command , PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs').promises;
const mime = require('mime-types');
const axios = require('axios');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { getVideoDurationInSeconds } = require('get-video-duration');



const {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET} = process.env;

const s3Client = new S3({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_KEY,
        secretAccessKey: S3_SECRET
    }
});

const upload = async (localFolder, localFileName, bucketFolder, bucketFileName) => {
    const data = await fsp.readFile(localFolder+localFileName);
    let contentType = '';

    contentType = mime.lookup(localFileName);

    if (!contentType) contentType = 'application/octet-stream';

    const bucketParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `${bucketFolder}/${bucketFileName}`,
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

exports.urlToS3 = async (url, bucketFolder, bucketFileName) => {
    const loc = url.lastIndexOf('/');
    const fileName = `${uuidv4()}_${url.substring(loc+1)}`;
    await downloadAxiosFile (url, `/home/tmp/${fileName}`);
    const link = await upload('/home/tmp/', fileName, bucketFolder, bucketFileName);
    fs.unlink(`/home/tmp/${fileName}`);
    return link;
}

exports.videoUrlToS3 = async (url, bucketFolder, bucketFileName) => {
    let loc = url.lastIndexOf('/');
    ++loc;
    const fileName = `${uuidv4()}_${url.substring(loc)}`;
    
    await downloadAxiosFile (url, `/home/tmp/${fileName}`);
    const duration = await getVideoDurationInSeconds(`/home/tmp/${fileName}`);
    const link = await upload('/home/tmp/', fileName, bucketFolder, bucketFileName);
    fs.unlink(`/home/tmp/${fileName}`, (err => {
        if (err) console.log(err);
      }));
    return {
        link,
        duration
    }
}