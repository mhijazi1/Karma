//'use strict';

var util = require('util');
var request = require('request');
//Singleton Clarifai Connection.
var Clarifai = function() {};

module.exports = Clarifai;

Clarifai.init = function(options) {
    validateConstructor(options, function(valid) {
        if (valid === false) {
            return false;
        }
        log("15: validated");
        this.accessToken = "";
        this.collectionCreated = false;
        this.addDocumentQueue = [];
        this.baseUrl = options.baseUrl || 'https://api-alpha.clarifai.com/v1/';
        this.debug = true;
        if (options.debug === false) {
            this.debug = false;
        }
        this.collectionId = options.collectionId || 'default';
        this.nameSpace = options.nameSpace || 'default';
        getAccessToken(options, createCollection.bind(this));
        //          .then(
        //               this.createCollection.bind(this),
        //              this.onError.bind(this)
        //           );

    });
};

Clarifai.predict = function(url, concept, callback) {
    var data = {
        urls: [url]
    };

    request.post({
        url: this.baseUrl + 'curator/concepts/' + this.nameSpace + '/' + concept + '/predict',
        contentType: 'application/json; charset=utf-8',
        processData: false,
        data: JSON.stringify(data),
        headers: {
            Authorization: 'Bearer ' + this.accessToken
        }
    }, function(err, response, body) {
        if (err) {
            log("Clarifai: Predict on " + concept + " failed", e);
            var result = {
                'success': false
            }
            if (callback) {
                callback.call(this, result);
            }
        }

        if (json.status.status === "OK") {
            log("Clarifai: Predict on " + concept + " success");
            var result = json.urls[0];
            result.success = true;
            if (callback) {
                callback.call(this, result);
            }
        } else if (json.status.status === 'ERROR') {
            log("Clarifai: Predict on " + concept + " failed", json);
            var result = {
                'success': false
            }
            if (callback) {
                callback.call(this, result);
            }
        }

    });
};

// make sure we got what we need in constructor
var validateConstructor = function(options, isValid) {
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
    log("50: Done!");
    isValid(true);
};


// get an accessToken from localStorage or API
var getAccessToken = function(options, callback) {
    log("57: getAT");
    if (options.clientId && options.clientSecret) {
        fetchAccessToken(options.clientId, options.clientSecret, function(err, response, body) {
            if (err) {
                console.error("ERROR: " + err.syscall + " - " + err.code);
                return;
            }
            var json = JSON.parse(body);
            var now = new Date().getTime();
            json.expireTime = now + json.expires_in;
            this.accessToken = json.access_token;
            log("AT: " + this.accessToken);
            log("AToken Reg: " + json.access_token);
            callback();
        }.bind(this));
    } else {
        console.error("need a clientId and clientSecret");
        return;
    }
};

var fetchAccessToken = function(clientId, clientSecret, returnAccessToken) {
    log("79: Fetch AT");
    var tokenUrl = this.baseUrl + 'token';

    var data = {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret
    };
    //    log(tokenUrl);
    //    log(data);
    request.post({
        url: tokenUrl,
        form: data
    }, returnAccessToken);
};

var createCollection = function() {
    log("96: Create Collection");
    listCollections(function(collectionCreated) {
        if (collectionCreated === true) {
            var result = {
                success: true
            };
        } else {
            var data = {
                collection: {
                    id: this.collectionId,
                    settings: {
                        max_num_docs: 100000
                    }
                }
            };
            log("Data: " + data);
            request.post({
                url: this.baseUrl + 'curator/collections',
                data: JSON.stringify(data),
                processData: false,
                contentType: 'application/json; charset=utf-8',
                headers: {
                    Authorization: 'Bearer ' + this.accessToken
                }
            }, function(err, response, body) {
                log("err2: " + err + "\n response: " + response + "\n body: " + body);
            });
        }
    });
};

var listCollections = function(callback) {
    var collectionCreated = false;
    log("129: List Collections");
    log("Access Token: " + this.accessToken);
    request.get({
        'url': this.baseUrl + 'curator/collections',
        'headers': {
            'Authorization': 'Bearer ' + this.accessToken
        }
    }, function(err, response, body) {
        if (err) {
            return;
        }

        if (body.status === 'OK') {
            for (var i = 0; i < json.collections.length; i++) {
                var collectionId = json.collections[i].id;
                if (collectionId === this.collectionId) {
                    this.collectionCreated = true;
                    break;
                }
            }
        }
        return callback(collectionCreated);
    });
}

// Turn logging on or off
log = function(obj){
    if(this.debug === true){
        util.log(obj);
    }
}
