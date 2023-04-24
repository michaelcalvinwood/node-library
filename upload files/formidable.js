const formidable = require('formidable');

app.post('/fileUpload', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, data) {
        console.log('form data', data);
        if (err) return console.error(err);
        const fileName = data['File[]'].filepath;
        
        let input = fs.readFileSync(fileName, "utf-8");
        if (!input) return res.status(400).json('no input')
        
        /*
         * Process file here
         */
        
        // remove file
        fs.unlinkSync(fileName);
    });
});
