const { S3, ListObjectsV2Command , PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs').promises;
const mime = require('mime-types');
const axios = require('axios');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { exec } = require("child_process");
const path = require('path');

const {S3_ENDPOINT, S3_ENDPOINT_DOMAIN, S3_REGION, S3_KEY, S3_SECRET, S3_BUCKET} = process.env;

const todayDate = () => {
    let today = new Date();
    let dd = today.getDate();

    let mm = today.getMonth()+1; 
    const yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd=`0${dd}`;
    } 

    if(mm<10) 
    {
        mm=`0${mm}`;
    } 

    return `${yyyy}-${mm}-${dd}`;
}

const s3Client = new S3({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_KEY,
        secretAccessKey: S3_SECRET
    }
});

const upload = async (localFolder, localFileName, bucketFolder, bucketFileName) => {
    console.log(`upload (${localFolder}, ${localFileName}, ${bucketFolder}, ${bucketFileName})`);


    const data = await fsp.readFile(localFolder+localFileName);
    let contentType = '';

    let loc = localFileName.lastIndexOf('.');
    if (loc === -1) {
        console.error(`Invalid extension for ${localFileName}`);
        return false;
    }
    let extension = localFileName.substring(loc+1);

    console.log('extension', extension)

    switch(extension) {
        case 'mp4':
            console.log('setting content type to video/mp4');
            contentType = 'video/mp4';
            break;
    }

    if (!contentType) contentType = mime.lookup(localFileName);

    console.log('mime content type', contentType);

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

exports.uploadFileToS3 = (localFolder, localFileName, bucketFolder, bucketFileName) => {
    return new Promise((resolve, reject) => {
        const uploadResult = upload(localFolder, localFileName, bucketFolder, bucketFileName);
        resolve(uploadResult);
    })
}

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

const executeCommand = command => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                //console.log(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
            resolve(stdout);
        });
    })
}

const changeBackgroundMusic = (inputFile, musicFile) => {
    return new Promise(async (resolve, reject) => {
        let newFileName = `new-${inputFile}`;
        await executeCommand(`ffmpeg -i /home/tmp/${inputFile} -i ./${musicFile} -map 0:v -map 1:a -c:v copy -shortest /home/tmp/${newFileName}`);
        console.log('COMMAND EXECUTED');
        resolve (newFileName);
    })
}

function findFilesInDir(startPath, filter){

    var results = [];

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return results;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            results = results.concat(findFilesInDir(filename,filter)); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            console.log('-- found: ',filename);
            results.push(filename);
        }
    }
    return results;
}

exports.videoUrlToS3 = async (url, bucketFolder, bucketFileName) => {
    console.log(`videoUrlToS3 (${url}, ${bucketFolder}, ${bucketFileName} )`);
    let loc = url.lastIndexOf('/');
    ++loc;
    let fileName = `${uuidv4()}_${url.substring(loc)}`;
    
    console.log(`dwloading ${url} to /home/tmp/${fileName}`);
    await downloadAxiosFile (url, `/home/tmp/${fileName}`);

    const musicFiles = findFilesInDir('.', '.wav');
    const musicIndex = Math.floor(Math.random() * musicFiles.length);
    
    console.log(musicFiles[musicIndex]);

    //fileName = await changeBackgroundMusic(fileName, 'imagine.wav');
    fileName = await changeBackgroundMusic(fileName, musicFiles[musicIndex]);

    let duration = await getVideoDurationInSeconds(`/home/tmp/${fileName}`);
    duration = Math.ceil(duration);
    console.log('duration', duration, fileName);

    const link = await upload('/home/tmp/', fileName, bucketFolder, bucketFileName);
    console.log(link);
    fs.unlink(`/home/tmp/${fileName}`, (err => {
        if (err) console.log(err);
      }));
    return {
        link,
        audio: musicFiles[musicIndex],
        duration,
        date: todayDate()
    }
}