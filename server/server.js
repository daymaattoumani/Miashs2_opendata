// Require the client

const Clarifai = require('clarifai');
const fs = require('fs');
const multer = require('multer');

const fetch = require('fetch').fetchUrl;

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


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

app.post('/home', upload.single('celebrity'), function(req,res){
        if(req.file) {
            const predicteur = new Clarifai.App({
                apiKey: '5cc2e6a2ca6342c8adec0429f0627af3'
            });
            var encoded = base64_encode(req.file.path);
            predicteur.models.predict("e466caa0619f444ab97497640cefc4dc", {base64: encoded}).then(
                function(response) {
                    var q = response.outputs[0].data.regions[0].data.concepts[0];
                    fetch("https://newsapi.org/v2/everything?q="+ q.name + "&apiKey=0738b24ebbfa4397b1857b42aea8bd2e", function(error, meta, body){
                        console.log();
                        var articles = JSON.parse(body.toString()).articles;
                        var titles = articles.map(a => { return a.title;});
                        console.log(titles);
                        res.json(titles);
                    });
                    },
                function(err) {
                    console.log(err);
                }
            );
        }
        else throw 'error';
    });


app.get('/index', function(req,res){
    fs.readFile("client/index.html", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end()
    })
});

app.get('/script', function(req, res){
    fs.readFile("client/js/script.js", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end()
    })
});

app.get('/materialize.min.css', function(req, res){
    fs.readFile("client/css/materialize.min.css", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end()
    })
});

app.get('/style.css', function(req, res){
    fs.readFile("client/css/style.css", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end()
    })
});

app.get('/materialize.min.js', function(req, res){
    fs.readFile("client/js/materialize.min.js", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/js'});
        res.write(data);
        res.end()
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});


