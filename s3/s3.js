require('dotenv').config();

const { S3, ListObjectsV2Command , PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs').promises;
const mime = require('mime-types');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
var path = require('path');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET} = process.env;

exports.contentType = filename => {
    const baseFilename = path.basename(filename);

    const contentType = mime.lookup(baseFilename);

    return contentType ? contentType : 'application/octet-stream';
}

exports.presignedUploadUrl = async (s3Client, Key, expiresIn = 900) => {
    const Bucket = s3Client.meta.S3_BUCKET;
    const ContentType = this.contentType(Key);
    const bucketParams = {Bucket, Key, ContentType};

    console.log(bucketParams);

    try {
      const url = await getSignedUrl(s3Client, new PutObjectCommand({Bucket, Key, ContentType}), { expiresIn }); // Adjustable expiration.
      console.log("URL:", url);
      return url;
    } catch (err) {
      console.log("Error", err);
      return false;
    }
}

exports.eraseFolder = async (s3Client, folder) => {
    const Bucket = s3Client.meta.S3_BUCKET;
    const listParams = {
        Bucket,
        Prefix: `${folder}/`
    };

    const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams));

    if (!listedObjects.Contents) return;
    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3Client.send(new DeleteObjectsCommand(deleteParams));

    if (listedObjects.IsTruncated) await this.eraseFolder(folder);
}

exports.client = (S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET) => {
    const client = new S3({
        endpoint: S3_ENDPOINT,
        region: S3_REGION,
        credentials: {
            accessKeyId: S3_KEY,
            secretAccessKey: S3_SECRET
        }
    });
    client.meta = {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET}
    return client;
}


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

exports.fileSize = (s3Client, Key) => {
    return new Promise((resolve, reject) => {
        s3Client.headObject({Bucket: s3Client.meta.S3_BUCKET, Key}, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            console.log(data);
            resolve(data.ContentLength);
            return;
        })
    })
}