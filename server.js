// Require the client

const Clarifai = require('clarifai');

const fs = require('fs');

const fetch = require('fetch').fetchUrl;


// The JavaScript client works in both Node.js and the browser.
var express = require('express');
var app = express();

app.get('/home', function(req,res){
        const predicteur = new Clarifai.App({
            apiKey: '5cc2e6a2ca6342c8adec0429f0627af3'
        });

        predicteur.models.predict("e466caa0619f444ab97497640cefc4dc", "https://samples.clarifai.com/celebrity.jpg").then(
            function(response) {
                //res.json({'message':  'ok'});
                res.json(response.outputs[0].data.regions[0].data.concepts[0]);
            },
            function(err) {
                // there was an error
            }
        );

    }
    );
app.get('/index', function(req,res){
    fs.readFile("client/index.html", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end()
    })
});

app.get('/script', function(req, res){
    fs.readFile("client/script.js", function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end()
    })
});

app.get('/news', function(req,res){
    var trump = 'Trump';
    fetch("https://newsapi.org/v2/everything?q="+trump+"&apiKey=0738b24ebbfa4397b1857b42aea8bd2e", function(error, meta, body){
        console.log(body.toString());
        res.json(body.toString());
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});


