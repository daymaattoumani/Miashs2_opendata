// The JavaScript client works in both Node.js and the browser.


// Require the client

const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
    apiKey: '5cc2e6a2ca6342c8adec0429f0627af3'
});


app.models.predict("c0c0ac362b03416da06ab3fa36fb58e3", "https://samples.clarifai.com/demographics.jpg").then(
    function(response) {
        console.log(response);
    },
    function(err) {
        // there was an error
    }
);