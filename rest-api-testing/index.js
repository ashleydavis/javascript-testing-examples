const express = require('express')
const port = 3000;

//
// Creates the express app.
//
function createApp() {
    const app = express();

    app.get('/an-example-api', (req, res) => {
        res.json({
            message: 'Hello World!',
        });
    });

    return app;    
}

//
// Main entry point, when not running under automated tests.
//
function main() {
    const app = createApp();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });    
}

if (require.main === module) {
    //
    // When not running under automated tests, start the HTTP server normally.
    //
    main();
}
else {
    module.exports = {
        createApp, // Export for use in automated tests.
    };
}