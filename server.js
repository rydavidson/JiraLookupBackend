// modules

require('dotenv').config();
var express = require("express");
var bodyParser = require('body-parser');

// my libs

var auth = require('./lib/auth.js');
var jira = require('./lib/jiraclient.js');
const constants = require('./lib/constants');

// express config

var app = express();
var port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var router = new express.Router();
app.use(router);

// other vars

var jwtArray = [];

// middleware

router.use("/search/:id", function (req, res, next) {

    // if (process.env.NODE_ENV.indexOf("dev") !== -1) {
    //     console.log("Running in dev move, authentication bypassed for " + req.connection.remoteAddress);
    //     next();
    // } else {
        if (jwtArray.length === 0) {
            res.sendStatus(403);
        } else if (!req.get("Authorization")) {
            res.sendStatus(403);
        } else {
            var token = req.get("Authorization");
            var authenticated = function (e) {
                return e.ip === req.connection.remoteAddress && e.token === token;
            }
            if (jwtArray.some(authenticated)) {
                next();
            } else {
                res.sendStatus(401);
            }
        }
    //}

})

// routes

router.post('/auth', function (req, res) {

    var username = req.body.username;
    var hashedPassword = req.body.password;

    console.debug(req.body);

    res.set("Access-Control-Allow-Origin", req.get("Origin"));
    try {
        auth.authenticateUser(username, hashedPassword, function (jwt) {

            if (jwt === constants.credentialsIncorrect) {
                res.status(jwt.httpCode).json(jwt.message);
            } else if (jwt === constants.authError) {
                res.status(jwt.httpCode).json(jwt.message);
            } else {
                try {
                    jwtArray.push({
                        ip: req.connection.remoteAddress,
                        token: jwt
                    });
                    jwtArray.forEach(function (e) {
                        console.log(JSON.stringify(e));
                    })
                    res.json(jwt);
                }
                catch (err) {
                    res.status(500).json(jwt);
                }
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(constants.genericError.httpCode).json(constants.genericError.message);
    }
});

router.get('/search/:id', function (req, res) {

    var sfid = req.params.id;

    if (sfid === undefined) {
        res.sendStatus(400);
    }

    var reg1 = /[a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]/gmi
    var reg2 = /[0-9][0-9][0-9][0-9][0-9][0-9]/gmi

    var m

    if (sfid.length > 0) {

        if (reg1.exec(sfid) != null) {
            jira.getItemByCaseId(sfid, function (err, result) {
                if (isErr(err)) {
                    handleErr(err, res);
                } else if (err == constants.emptyResponse) {
                    res.status(err.httpCode).json(err.message);
                } else {
                    res.status(200).json(result);
                }
            });
        } else if (reg2.exec(sfid) != null) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }

});

function isErr(err) {

    if (err == null) {
        return false;
    }
    if (err instanceof Error) {
        return true;
    }
    if (typeof err.type !== undefined) {
        if (err.type === "error") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function handleErr(err, res) {

    if (typeof err.type !== undefined) {
        res.status(err.httpCode).json(err.message);
    } else {
        res.sendStatus(500);
    }

    try {
        console.error(JSON.stringify(err));
    } catch (error) {
        console.log(err);
    }
}

app.listen(port);

console.log("Running at Port " + port);
console.log("Dumping environment variables");
console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);
console.log("process.env.ACCELAUSER: " + process.env.ACCELAUSER);
console.log("process.env.PASSWORD: " + process.env.PASSWORD);
console.log("process.env.SECRET: " + process.env.SECRET);