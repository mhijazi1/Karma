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
        /*   getAccessToken(options).then(
               this.createCollection.bind(this),
               this.onError.bind(this)
           );*/

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
        this.fetchAccessToken(options.clientId, options.clientSecret).then(
            function(json) {
                var now = new Date().getTime();
                json.expireTime = now + json.expires_in;
                localStorage.setItem('clarifai-accessToken', JSON.stringify(json));
                this.accessToken = json.access_token;
                deferred.resolve(this.accessToken);
            }.bind(this),
            function(e) {
                deferred.reject(e);
            }
        );
    } else {
        deferred.reject('need a clientId and clientSecret');
    }
    return deferred;

}

fetchAccessToken = function(clientId, clientSecret) {
    var tokenUrl = this.baseUrl + 'token';

    var data = {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret
    }
    util.log(tokenUrl);
    util.log(data);
    return request.post({
        url: tokenUrl,
        form: data
    }, function(err, response, body) {
        util.log(body);
    });
}