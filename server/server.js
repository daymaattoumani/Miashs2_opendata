// Require the client

const Clarifai = require('clarifai');
const fs = require('fs');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/images")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        }
    });
var upload = multer({ storage: storage });

// The JavaScript client works in both Node.js and the browser.
var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(express.static('server'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/home', upload.single('celebrity'), function(req,res){
        console.log(req.body);
        if(req.file) {
            res.json(req.file);
        }
        else throw 'error';
    });
//
function prediction(){
    const predicteur = new Clarifai.App({
        apiKey: '5cc2e6a2ca6342c8adec0429f0627af3'
    });
    predicteur.models.predict("e466caa0619f444ab97497640cefc4dc", req.body.celebrity).then(
        function(response) {
            //res.json({'message':  'ok'});
            res.json(response.outputs[0].data.regions[0].data.concepts[0]);
        },
        function(err) {
            // there was an error
        }
    );
}


app.get('/index', function(req,res){
    fs.readFile("client/index.html", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end()
    })
});

app.get('/script', function(req, res){
    fs.readFile("client/script.js", function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end()
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});


