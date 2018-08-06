var request = require('request');
var constants = require('./constants.js');
var mappings = require('./jiraStatusMappings.js');
// require('request').debug = true

exports.getItemByCaseId = function (caseID, callback) {

    var options = {
        uri: process.env.JIRA_CASE_URL + caseID,
        method: 'GET',
        headers: {
            "Authorization": "Basic " + process.env.JIRA_AUTH_TOKEN,
            "Content-Type": "application/json"
        }
    };


    console.log("Requesting " + caseID + " at " + options.uri);

    request(options, function (err, res, body) {

        //console.log("Res" + JSON.stringify(res));
        //console.log("Body: " +  JSON.stringify(body));

        body = JSON.parse(body);

        if (!err && res.statusCode == 200) {
            if (body.total > 0) {

                var resultArray = {results: []};

                var resultsProcessed = 0;

                body.issues.forEach(function (issue) {
                    var jira_item = {};

                    jira_item.key = issue.key;
                    jira_item.title = issue.fields.description;
                    jira_item.priority = issue.fields.priority.name;
                    jira_item.sfid = issue.fields.customfield_10600;
                    jira_item.sfuri = issue.fields.customfield_10906;
                    jira_item.jirauri = process.env.JIRA_ROOT_URL + "browse/" + issue.key;
                    jira_item.updated = new Date(issue.fields.updated).toDateString();
                    if (issue.fields.fixVersions.length > 0) {
                        jira_item.fixtarget = issue.fields.fixVersions[0].name;
                        jira_item.released = issue.fields.fixVersions[0].released;
                    }
                    else {
                        jira_item.fixtarget = "TBD";
                        jira_item.released = false;
                    }
                    mapStatus(issue, function (stat) {
                        jira_item.status = stat;
                        resultArray.results.push(jira_item);
                    });

                    resultsProcessed++;

                    if (resultsProcessed === body.issues.length)
                        callback(null, resultArray);
                });


                //console.log(JSON.stringify(issue));
            }
            else {
                //console.log(body);
                callback(constants.emptyResponse, constants.emptyResponse.message);
            }
        } else {
            console.error(err);
            try {
                callback(err, err.message);
            } catch (error) {
                console.error(error);
                try {
                    callback(err, "");
                } catch (error2) {
                    console.error(error2);
                    callback(new Error("Everything went null all of a sudden"), constants.genericError);
                }
            }
        }
    })

}

function mapStatus(issue, callback) {

    for (var stat in mappings) {
        if (issue.fields.status.name === mappings[stat].name) {
            if (issue.fields.project.key === "ENGSUPP") {
                callback(mappings["ENGSUPP"]);
                return;
            }
            callback(mappings[stat]);
            return;
        } else {
            if (issue.fields.project.key === "ENGSUPP") {
                callback(mappings["ENGSUPP"]);
                return;
            }
        }
    }

    callback({
        name: issue.fields.status.name,
        publicStatus: issue.fields.status.name,
        description: ""
    });

}
