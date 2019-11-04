// Require the client

const Clarifai = require('clarifai');

// The JavaScript client works in both Node.js and the browser.
var express = require('express');
var app = express();

app.get('/home', function(req,res){
        const predicteur = new Clarifai.App({
            apiKey: '5cc2e6a2ca6342c8adec0429f0627af3'
        });

        predicteur.models.predict("e466caa0619f444ab97497640cefc4dc", "https://samples.clarifai.com/celebrity.jpg").then(
            function(response) {
                res.json(response.outputs[0].data.regions[0].data.concepts[0]);
            },
            function(err) {
                // there was an error
            }
        );

    }
    );

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});


