require('dotenv').config();

const { S3, ListObjectsV2Command , PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs').promises;
const mime = require('mime-types');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET} = process.env;

exports.client = (S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET) => new S3({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_KEY,
        secretAccessKey: S3_SECRET
    }
});