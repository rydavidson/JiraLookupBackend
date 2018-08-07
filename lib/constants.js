module.exports = Object.freeze({
    credentialsIncorrect: {
        message: "Username or password is incorrect",
        httpCode: 403,
        type: "error"
    },
    authError: {
        message: "Unable to authenticate",
        httpCode: 500,
        type: "error"
    },
    genericError: {
        message: "Something went wrong",
        httpCode: 500,
        type: "error"
    },
    emptyResponse: {
        message: "Empty response",
        httpCode: 204,
        type: "warn"
    },
    jiraSearchType: {
        searchType: "jiraKey"
    },
    sfSearchType: {
        searchType: "sfid"
    }
});