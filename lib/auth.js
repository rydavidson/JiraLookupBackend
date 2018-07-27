const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const constants = require('./constants');


exports.authenticateUser = function(username, hashedPassword, callback){

    const hasher = crypto.createHash('sha256');

    try{
        if(username === process.env.ACCELAUSER){
            console.debug("Attempting password validation");
            if(hashedPassword === hasher.update(process.env.PASSWORD).digest('hex')){
                callback(jwt.sign({"user": username}, process.env.SECRET));
            }
            else{
                callback(constants.credentialsIncorrect);
            }
        }
        else{
            console.debug("username: " + username + " is incorrect, expected " + process.env.ACCELAUSER)
            callback(constants.credentialsIncorrect);
        }
    }
    catch(err){
        callback(constants.authError);
    }



}
