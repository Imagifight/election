const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs-extra');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

const voter = require('../models/voter');
const candidate = require('../models/candidate');

router.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    // Pass to next layer of middleware
    next();
});

router.use(cors({
    origin: '*'
}));
router.get('/upload', (req, res, next) => {
    res.sendFile(path.resolve('./public/upload.html'));
})
router.post('/upload', (req, res, next) => {
    var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "./public/imgs"; //set upload directory
    form.keepExtensions = true; //keep file extension

    form.parse(req, function (err, fields, files) {
        fields.votes = 0;
        let newCandidate = new candidate(fields);
        candidate.register(newCandidate, (err, c) => {
            if (err)
                throw err;

            console.log("form.bytesReceived");
            //TESTING
            console.log("file size: " + JSON.stringify(files.fileUploaded.size));
            console.log("file path: " + JSON.stringify(files.fileUploaded.path));
            console.log("file name: " + JSON.stringify(files.fileUploaded.name));
            console.log("file type: " + JSON.stringify(files.fileUploaded.type));
            console.log("astModifiedDate: " + JSON.stringify(files.fileUploaded.lastModifiedDate));

            //Formidable changes the name of the uploaded file
            //Rename the file to its original name
            fs.rename(files.fileUploaded.path, './public/imgs/' + String(c._id) + '.' + files.fileUploaded.name.split('.')[1], function (err) {
                if (err)
                    throw err;
                console.log('renamed complete',  String(c._id) + files.fileUploaded.name.split('.')[1]);
                res.end("<script>window.location.replace('http://localhost:8080/console')</script>");
                // res.end(JSON.stringify({
                //     success: true,
                //     message: "Added successfully.",
                //     c: c
                // }));
            });
            console.log({
                fields: fields,
                files: files
            });
        });

    });
});

module.exports = router;