// Require the client
const port = process.env.PORT || 3000;
const Clarifai = require('clarifai');
const fs = require('fs');
const multer = require('multer');
const fetch = require('fetch').fetchUrl;
var titreArticles = null;

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
                res.json(predicted_name);

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
    fs.readFile("client/script.js", function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/javascript'});
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


