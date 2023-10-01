// 
// Runs recorded requests against the backend and compare its responses to the expected responses.
//

const fs = require('fs');
const axios = require('axios');

//
// The file that contains recorded requests and repsonses.
//
const REQUEST_LOG = '../data/request.log';

//
// Replace with your target domain. 
// You probably want to set this from an environment variable or command line parameter.
//
const TARGET_DOMAIN = 'http://localhost:3000';

//
// Loads the request log from disk.
//
async function loadRequestLog() {
    let rawData = await fs.promises.readFile(REQUEST_LOG, 'utf-8');
    const requestLog = rawData.split('======')
        .map(section => section.trim())
        .filter(section => section.length > 0)
        .map(section => JSON.parse(section));
    
    const requests = [];
    const requestMap = new Map();
    
    for (const item of requestLog) {
        if (item.type === 'request') {
            requests.push(item);
            requestMap.set(item.requestId, item);
        }
        else if (item.type === 'response') {
            const request = requestMap.get(item.requestId);
            if (!request) {
                throw new Error(`Have response for request ${item.requestId}, but cannot find this request.`);
            }
            request.response = item;
        }
        else {
            throw new Error(`Unknown type ${item.type}\r\n${JSON.stringify(item, null, 2)}`);
        }
    }

    return requests;
}

//
// Replays a request.
//
async function replayRequest(requestDetails) {
    const { url, method, headers, body } = requestDetails;

    const modifiedHeaders = Object.assign({}, headers);

    // Disables cached responses.
    delete modifiedHeaders["etag"]; 
    delete modifiedHeaders["if-none-match"];
    delete modifiedHeaders["if-modified-since"];
    delete modifiedHeaders["last-modified"];

    const response = await axios({
        method: method,
        url: `${TARGET_DOMAIN}${url}`,
        headers: modifiedHeaders,
        data: body,
        responseType: 'text',

        // Always resolves the promise, regardless of the status code. Doesn't throw exceptions.
        validateStatus: status => true, 
    });

    return {
        status: response.status,
        headers: response.headers,
        data: response.data
    };
}

//
//
// Replays all requests in the log and checks the responses.
//
async function replayRequests() {
    
    const requests = await loadRequestLog();

    for (const request of requests) {
        const response = await replayRequest(request);

        if (request.response.status !== response.status) {
            throw new Error(`Status code mismatch. Expected ${request.status}, but got ${response.status}. For request ${request.requestId}.`);
        }

        if (request.response.body !== response.data) {
            throw new Error(`Body mismatch. Expected "${request.response.body}", but got "${response.data}". For request ${request.requestId}.`);
        }
    }
}

//
// Main entry point when run directly from the termimal.
//
async function main() {
    
    const requests = await loadRequestLog();

    for (const request of requests) {
        const response = await replayRequest(request);
        console.log(`Got response:`);
        console.log(response);

        console.log(`Expected response:`);
        console.log(request.response);

        if (request.response.status !== response.status) {
            throw new Error(`Status code mismatch. Expected ${request.status}, but got ${response.status}. For request ${request.requestId}.`);
        }

        if (request.response.body !== response.data) {
            throw new Error(`Body mismatch. Expected "${request.response.body}", but got "${response.data}". For request ${request.requestId}.`);
        }
    }
}

if (require.main === module) {

    //
    // Run it directly.
    //
    main()
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
else {
    // 
    // Export it as a code library.
    //
    module.exports = {
        replayRequests,
    };
}
