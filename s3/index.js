require('dotenv').config();
const s3 = require('./s3');

const {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET} = process.env;

const s3Client = s3.client(S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET);



async function doStuff() {
    //await s3.uploadFile(s3Client, './test.txt', 'test', 'testtest.txt');

    const fileSize = await s3.fileSize(s3Client, 'test/testtest.txt');
    
    console.log('fileSize', fileSize);
}

doStuff();


