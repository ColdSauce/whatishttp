#!/usr/bin/env node
const fs = require('fs');

function getUsageMessage() {
    return "Usage: wih <http code>\n\tExample: wih 500";
}

function getFileReadErrorMessage() {
    return "Error! Could not read the config file. Please report this to https://github.com/ColdSauce/whatishttp/issues";
}

function getHTTPCodeFromArgs() {
    const HTTPIndex = 2;
    if(process.argv.length != 3) {
        throw new Error("Command line args not passed in.");
    } else {
        return process.argv[HTTPIndex];
    }
}

function getHttpCodeInfo(httpCode, httpCodes) {
    const httpCodeName = httpCodes[httpCode]["name"];
    const httpCodeDescription = httpCodes[httpCode]["description"];
    return [httpCodeName, httpCodeDescription]
}

function getHttpInfoFromFile(fileName, httpCode, callback) {
    fs.readFile(fileName, function (err, data) {
        if(err) {
            const fileErrorMessage = getFileReadErrorMessage();
            callback(new Error("Could not read file."));
        } else {
            const httpCodes = JSON.parse(data);
            callback(null, getHttpCodeInfo(httpCode, httpCodes));
        }
    });
}

const httpCode = getHTTPCodeFromArgs(); 
if(httpCode instanceof Error) {
    console.log(getUsageMessage());
} else {
    getHttpInfoFromFile('./status_codes.json', httpCode, function(err, httpInfo) {
        if(err !== null) {
            console.log(fileErrorMessage);
        } else {
            const [httpCodeName, httpCodeDescription] = httpInfo;
            console.log(httpCodeName);
            console.log(httpCodeDescription);
        }
    });
}
