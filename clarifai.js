var util = require('util');
//Singleton Clarifai Connection. 
var Clarifai = function() {};

module.exports = Clarifai;

Clarifai.init = function(options) {
    validateConstructor(options, function(validate){
        util.log(validate);
        if (validate === false) {
            return false;
        }   
    });
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

};


// make sure we got what we need in constructor
validateConstructor = function(options, callback) {
    if (!options.clientSecret && !options.clientId) {
        console.error("Please provide a clientId and clientSecret https://developer-alpha.clarifai.com/docs/auth");
        callback(false);
    }
    if (options.clientId && !options.clientSecret) {
        console.error("Please provide a clientSecret https://developer-alpha.clarifai.com/docs/auth");
        callback(false);
    }
    if (options.clientSecret && !options.clientId) {
        console.error("Please provide a clientId https://developer-alpha.clarifai.com/docs/auth");
        callback(false);
    }
    util.log("Done!");
    callback(true);
};


// get an accessToken from localStorage or API
getAccessToken = function(options, callback) {
    var accessTokenString = localStorage.getItem('clarifai-accessToken');
    if (accessTokenString) {
        var now = new Date().getTime();
        var accessToken = JSON.parse(accessTokenString);
        if (now < accessToken.expireTime) {
            this.accessToken = accessToken.access_token;
            deferred.resolve(this.accessToken);
            callback();
        }
    }
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