//
// Records screenshots of web pages.
//

const { recordScreenshots } = require("./lib/screenshot");
const config = require("./config");

async function main() {
    
    await recordScreenshots(config, "./existing", {
        overwrite: true,
    });

    console.log("Done");
}

main()
    .catch(err => {
        console.error(`Failed:`);
        console.error(err);
    });