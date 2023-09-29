//
// Records screenshots of web pages and compares them to existing screenshots.
//

const fs = require("fs-extra");
const { recordScreenshots } = require("./lib/screenshot");
const { compareImages } = require("./lib/compare");
const config = require("./config");

async function main() {
    
    await fs.remove("./latest");
    await fs.remove("./diff`");

    await recordScreenshots(config, "./latest", {
        overwrite: true,
    });

    const pages = config.pages.map(page => ({
        id: page.id,
        before: `./existing/${page.id}.png`,
        after: `./latest/${page.id}.png`,
    }));

    await compareImages({ pages }, "./diff");

    console.log("Done");
}

main()
    .catch(err => {
        console.error(`Failed:`);
        console.error(err);
    });