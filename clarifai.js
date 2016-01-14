var util = require('util');
var request = require('request');
//Singleton Clarifai Connection. 
var Clarifai = function() {};

module.exports = Clarifai;

Clarifai.init = function(options) {
    validateConstructor(options, function(valid) {
        util.log(valid);
        if (valid === false) {
            return false;
        }
        this.collectionCreated = false;
        this.addDocumentQueue = [];
        this.baseUrl = options.baseUrl || 'https://api-alpha.clarifai.com/v1/';
        this.debug = true;
        if (options.debug === false) {
            this.debug = false;
        }
        this.collectionId = options.collectionId || 'default';
        this.nameSpace = options.nameSpace || 'default';
        getAccessToken(options);
        //          .then(
        //               this.createCollection.bind(this),
        //              this.onError.bind(this)
        //           );

    });
};


// make sure we got what we need in constructor
validateConstructor = function(options, isValid) {
    if (!options.clientSecret && !options.clientId) {
        console.error("Please provide a clientId and clientSecret https://developer-alpha.clarifai.com/docs/auth");
        isValid(false);
    }
    if (options.clientId && !options.clientSecret) {
        console.error("Please provide a clientSecret https://developer-alpha.clarifai.com/docs/auth");
        isValid(false);
    }
    if (options.clientSecret && !options.clientId) {
        console.error("Please provide a clientId https://developer-alpha.clarifai.com/docs/auth");
        isValid(false);
    }
    util.log("Done!");
    isValid(true);
};


// get an accessToken from localStorage or API
getAccessToken = function(options, callback) {
    if (options.clientId && options.clientSecret) {
        fetchAccessToken(options.clientId, options.clientSecret, function(err, response, json) {
            if (err) {
                console.error(err[0]);
                return;
            }
            var now = new Date().getTime();
            json.expireTime = now + json.expires_in;
            this.accessToken = json.access_token;
        });
    } else {
        console.error("need a clientId and clientSecret");

    }
}

fetchAccessToken = function(clientId, clientSecret, returnAccessToken) {
    var tokenUrl = this.baseUrl + 'token';

    var data = {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret
    }
    util.log(tokenUrl);
    util.log(data);
    request.post({
        url: tokenUrl,
        form: data
    }, returnAccessToken);
}