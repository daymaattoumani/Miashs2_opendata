// Require the client
const port = process.env.PORT || 3000;
const Clarifai = require('clarifai');
const fs = require('fs');
const multer = require('multer');
const fetch = require('fetch').fetchUrl;
const json2csv = require('json2csv').parse;
const cors = require('cors');


var titreArticles = null;
var predicted_name2 = null;
var predicted_name3 = null;

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
var bodyParser = require("body-parser");
var app = express();
const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = yaml.load('./api-docs.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static('server'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
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
                predicted_name2 = response.outputs[0].data.regions[0].data.concepts[1].name;
                predicted_name3 = response.outputs[0].data.regions[0].data.concepts[2].name;
                //replace this value with your valid subscription key.
                let serviceKey = "5d4f368b5f6745d0b61c3d9f1f94c9af";

                //instantiate the image search client
                let credentials = new CognitiveServicesCredentials(serviceKey);
                let imageSearchApiClient = new ImageSearchAPIClient(credentials);

                //a helper function to perform an async call to the Bing Image Search API
                const sendQuery = async () => {
                    return await imageSearchApiClient.imagesOperations.search(predicted_name);
                };
                var path =  req.file.path;
                fs.unlink(path, (err) => {
                    if (err) {
                        return res.status(500).json({message: "delete doesn't work", error: true});
                    }
                });
                sendQuery().then(imageResults => {
                    if (imageResults == null) {
                        return res.status(404).json({message: "image not found", error: false});
                    }
                    else {

                        return res.status(200).json({url: imageResults.value[0].contentUrl, name: predicted_name});
                    }
                }).catch(err => {
                    console.error(err);
                });


            },
            function(err) {
                return res.status(500).json({message: err, error: true});
            }
        );
    }else{
        return res.status(400).json({message: "Bad Request: file not found", error: false});

    }
});

app.get('/image/:celebrity',  function (req,res) {
    let serviceKey = "0c10ee92fb0140b58d220bf33f12a68c";
    let predicted_name = req.params.celebrity;
    //instantiate the image search client
    let credentials = new CognitiveServicesCredentials(serviceKey);
    let imageSearchApiClient = new ImageSearchAPIClient(credentials);

    //a helper function to perform an async call to the Bing Image Search API
    const sendQuery = async () => {
        return await imageSearchApiClient.imagesOperations.search(predicted_name);
    };
    sendQuery().then(imageResults => {
        if (imageResults == null) {
            return res.status(404).json({message: "image not found", error: false});
        }
        else {
            res.status(200).json({url: imageResults.value[0].contentUrl, name: predicted_name});
        }
    }).catch(err => res.status(500).json({message: err, error: true}))
});

app.get('/output/:nb_predict',  function (req,res) {
    if (req.params.nb_predict == 1) {
        res.status(200).json({'name':predicted_name2});
    }else {
        res.status(200).json({'name':predicted_name3});
    }

});

app.get('/news/:celebrity', function(req,res) {
    fetch("https://newsapi.org/v2/everything?q=" + req.params.celebrity + "&language=en&apiKey=0738b24ebbfa4397b1857b42aea8bd2e", function (error, meta, body) {
        if(error){
            return res.status(500).json({message:error, error: true});
        }
        var articles = JSON.parse(body.toString()).articles;
        if(articles.length === 0){
            return res.status(404).json({message: "no celebrity found", error: true});
        }
        var news = articles.filter(a => a.urlToImage != null && a.description != null).map(function(a){
            return {title: a.title, image: a.urlToImage, url: a.url, description: a.description};
        });
        titreArticles = news;
        res.status(200).json(news);
    });
});
app.get('/', function(req,res){
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
        res.end();
    })
});

app.get('/materialize.min.css', function(req, res){
    fs.readFile("client/css/materialize.min.css", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
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
        res.end();
    })
});
app.get('/download', function(req,res) {
    res.format({
        'application/json': function () {

            res.status(200).json(titreArticles);

        },

        'application/csv': function () {
            const csvString = json2csv(titreArticles);
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csvString);

        }
    })
});



app.listen(port, function () {
    console.log('Example app listening on http://localhost:' + port )
});


