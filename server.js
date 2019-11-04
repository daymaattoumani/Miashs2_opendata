// The JavaScript client works in both Node.js and the browser.


// Require the client

const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
    apiKey: '5cc2e6a2ca6342c8adec0429f0627af3'
});


app.models.predict("e466caa0619f444ab97497640cefc4dc", "https://samples.clarifai.com/celebrity.jpg").then(
    function(response) {

        console.log(response.outputs[0].data.regions[0].data.concepts[0]);
    },
    function(err) {
        // there was an error
    }
);
