//
// A proxy server that records all requests and responses.
//

const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { Transform } = require('stream');
const { v4: uuid } = require('uuid');

const protocols = {
    "http:": http,
    "https:": https,
};

//
// The port number for this proxy server.
// You probably want to set this from an environment variable or command line parameter.
//
const PORT = 3100;

//
// The file where we write recorded requests and repsonses.
//
const REQUEST_LOG = '../data/request.log';

//
// Replace with the URL for the target server. 
// You probably want to set this from an environment variable or command line parameter.
//
const TARGET_URL = 'http://localhost:3000';

const app = express();

app.use(cors());

//
// Appends JSON data to the output file.
//
function appendToFile(data) {
    fs.appendFileSync(REQUEST_LOG, JSON.stringify(data, null, 2) + '\n======\n');
}

//
// Forwards a HTTP or HTTPs the request to the target URL.
//
function forwardRequest(targetDomain, req, responseCallback) {
    const targetUrl = new URL(targetDomain);
    const protocol = protocols[targetUrl.protocol];
    return  protocol.request(
        {
            host: targetUrl.hostname,
            port: targetUrl.port,
            method: req.method,
            path: req.url,
            headers: req.headers,
        }, 
        responseCallback,
    );
}

//
// Record and proxy incoming requests.
// Record outgoing responses.
//
app.use((req, res) => {
    const requestId = uuid();
    
    const requestChunks = [];

    //
    // Proxy the request forward to the target.
    //
    const targetRequest = forwardRequest(TARGET_URL, req, targetResponse => {
        const responseChunks = [];

        const responseRecorder = new Transform({
            transform(chunk, encoding, callback) {
                responseChunks.push(chunk); // Record the chunk.
                callback(null, chunk); // Pass the chunk along without modifying it
            }
        });

        //
        // Sends the proxy response to the browser.
        //
        targetResponse
            .pipe(responseRecorder)
            .pipe(res)
            .on('finish', () => {
                //
                // Records the details of the response.
                //
                const responseDetails = { 
                    type: 'response',
                    requestId: requestId, // Correllates the response with the request.
                    timestamp: new Date(),
                    method: req.method,
                    url: req.url,
                    status: targetResponse.statusCode,
                    headers: targetResponse.headers,
                    body: Buffer.concat(responseChunks).toString(),
                };
                appendToFile(responseDetails);
            });
    });

    const requestRecorder = new Transform({
        transform(chunk, encoding, callback) {
            requestChunks.push(chunk); // Record the chunk.
            callback(null, chunk); // Pass the chunk along without modifying it
        }
    });

    //
    // Sends the request to the target.
    //
    req.pipe(requestRecorder)
        .pipe(targetRequest)
        .on('finish', () => {
            //
            // Records the details of the request.
            //
            const requestDetails = { 
                type: 'request',
                requestId: requestId,
                timestamp: new Date(),
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: Buffer.concat(requestChunks).toString(),
            };
            appendToFile(requestDetails);
        });
});

//
// Starts the otuput file.
//
fs.writeFileSync(REQUEST_LOG, ''); 

//
// Start the proxy server.
//
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
