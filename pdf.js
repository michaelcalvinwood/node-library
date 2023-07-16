const fs = require("fs");
const fsPromise = require('fs').promises;
const pdfExtraction = require("pdf-extraction");

exports.extractPdf = (filename, del = false) => {
    return new Promise(async (resolve, reject) => {
        let data;

        try {
            const dataBuffer = await fsPromise.readFile(filename);
            data = await pdfExtraction(dataBuffer);

        } catch (err) {
            console.error(err);
            reject(err);
        }
    
        console.log(data);
        return resolve(data);
    })
}
