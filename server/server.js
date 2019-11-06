// Require the client
const port = process.env.PORT || 3000;
const Clarifai = require('clarifai');
const fs = require('fs');
const multer = require('multer');
const fetch = require('fetch').fetchUrl;
var titreArticles = null;

'use strict';
const ImageSearchAPIClient = require('azure-cognitiveservices-imagesearch');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

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
var csv = require('csv-express')/* npm install csv-express*/
var bodyParser = require("body-parser");
var app = express();
app.use(express.static('server'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}

app.post('/predict', upload.single('celebrity'), function(req,res){
    if(req.file) {
        const predicteur = new Clarifai.App({
            apiKey: '5cc2e6a2ca6342c8adec0429f0627af3'
        });
        var encoded = base64_encode(req.file.path);
        predicteur.models.predict("e466caa0619f444ab97497640cefc4dc", {base64: encoded}).then(
            function(response) {
                let predicted_name = response.outputs[0].data.regions[0].data.concepts[0].name;
                //replace this value with your valid subscription key.
                let serviceKey = "0c10ee92fb0140b58d220bf33f12a68c";

//instantiate the image search client
                let credentials = new CognitiveServicesCredentials(serviceKey);
                let imageSearchApiClient = new ImageSearchAPIClient(credentials);

//a helper function to perform an async call to the Bing Image Search API
                const sendQuery = async () => {
                    return await imageSearchApiClient.imagesOperations.search(predicted_name);
                };

                sendQuery().then(imageResults => {
                    if (imageResults == null) {
                        console.log("No image results were found.");
                    }
                    else {
                        console.log(imageResults.value[0]);
                        res.json({url: imageResults.value[0].contentUrl, name: predicted_name});
                    }
                })
                    .catch(err => console.error(err))

                //res.json(predicted_name);

            },
            function(err) {
                console.log(err);
            }
        );
    }
    else throw 'error';
});
app.get('/news/:celebrity', function(req,res) {
    fetch("https://newsapi.org/v2/everything?q=" + req.query.celebrity + "&apiKey=0738b24ebbfa4397b1857b42aea8bd2e", function (error, meta, body) {
        var articles = JSON.parse(body.toString()).articles;
        var news = articles.filter(a => a.urlToImage != null).map(function(a){
            return {title: a.title, image: a.urlToImage, url: a.url};
        });
        titreArticles = news;
        res.json(news);
    });
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

app.get('/download', function(req,res) {

    res.format({
        'application/json': function () {
            var tempoj = titreArticles;

            res.json(tempoj);

        },

        'application/csv': function () {
            var tempoc = titreArticles;
            res.csv(tempoc, true);
        }
    })
})


app.listen(port, function () {
    console.log('Example app listening on port 3000!')
});


