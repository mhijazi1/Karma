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
        getAccessToken(options, listCollections(function(){}));
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
                console.error("ERROR: "+err.syscall +" - "+ err.code);
                return;
            }
            var now = new Date().getTime();
            json.expireTime = now + json.expires_in;
            this.accessToken = json.access_token;
            callback;
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

/*createCollection = function(){
    var deferred = $.Deferred();
    this.listCollections().then(
        function(collectionCreated){
            if(collectionCreated === true){
                var result = {
                    'success': true
                }
                deferred.resolve(result);   
            }
            else{
                var data = {
                    'collection': {
                        'id': this.collectionId,
                        'settings': {
                            'max_num_docs': 100000
                        }
                    }
                }
                $.ajax(
                    {
                        'type': 'POST',
                        'url': this.baseUrl + 'curator/collections',
                        'data': JSON.stringify(data),
                        'processData': false,
                        'contentType': 'application/json; charset=utf-8',
                        'headers': {
                            'Authorization': 'Bearer ' + this.accessToken
                        }
                    }  
                ).then(
                    function(json){
                        if(json.status.status === "OK"){
                            this.log("Clarifai: Collection: '" + this.collectionId + "' created");
                            this.collectionCreated = true;
                            var result = {
                                'success': true
                            }
                            deferred.resolve(result);
                        }
                        if(json.status.status === 'ERROR'){
                            if(json.status.message.indexOf('Bad request: Collection "' + this.collectionId + '" already exists for user') !== -1){
                                this.collectionCreated = true;
                                var result = {
                                    'success': true
                                }
                                deferred.resolve(result);
                            }
                            else{
                                console.error("Clarifai: Error instantiating Clarifai object", json);
                                var result = {
                                    'success': false
                                }
                                deferred.resolve(result);
                            }
                        }
                    }.bind(this),
                    function(e){
                        if(e.status === 409){
                            var result = {
                                'success': true
                            }
                            deferred.resolve(result);
                        }
                        else{
                            console.error("Clarifai: Error instantiating Clarifai object", e);
                            console.error(e.responseJSON.status_msg);
                            if(e.responseJSON.status_msg === 'Token is not valid. Please use valid tokens for a application in your account.'){
                                console.info("Please make sure you are using a valid accessToken https://developer-alpha.clarifai.com/docs/auth");
                            }
                            var result = {
                                'success': false
                            }
                            deferred.resolve(result);
                        }
                    }.bind(this)
                );
            }
        }.bind(this),
        function(e){
            deferred.reject(e);        
        }.bind(this)
    );
    return deferred;
}*/

listCollections = function(callback){
    var collectionCreated = false;
    util.log("List Collections")
    request.get(
        {
            'url': this.baseUrl + 'curator/collections',
            'contentType': 'application/json; charset=utf-8',
            'headers': {
                'Authorization': 'Bearer ' + this.accessToken
            }
        }, function(err, response, body){
            if(err){
                return;
            }
            util.log("Body: " + body);
        }  
    )
    /*.then(
        function(json){
            if(json.status.status === 'OK'){
                for(var i = 0; i < json.collections.length; i++){
                    var collectionId = json.collections[i].id;
                    if(collectionId === this.collectionId){
                        collectionCreated = true;
                        break;
                    }
                }
            }
            deferred.resolve(collectionCreated);
        }.bind(this),
        function(e){
            console.error(e);
            deferred.reject();
        }.bind(this)
    );
    return deferred;*/
}