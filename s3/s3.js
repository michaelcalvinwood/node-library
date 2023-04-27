require('dotenv').config();

const { S3, ListObjectsV2Command , PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs').promises;
const mime = require('mime-types');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
var path = require('path');

const {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET} = process.env;

exports.client = (S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET) => new S3({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_KEY,
        secretAccessKey: S3_SECRET
    }
});

exports.uploadFile = async (s3Client, filename, bucketFolder, bucketFileName) => {
    const data = await fsp.readFile(filename);
    let contentType = '';

    const localFileName = path.basename(filename);

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