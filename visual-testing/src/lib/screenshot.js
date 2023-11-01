const puppeteer = require('puppeteer');
const fs = require("fs-extra");

//
// Makes a screenshot of the specified web page.
//
// https://www.bannerbear.com/blog/how-to-take-screenshots-with-puppeteer/
//
async function makeScreenshot(url, outputFile) {

    // https://dev.to/sagar/how-to-capture-screenshots-with-puppeteer-3mb2
    // https://stackoverflow.com/a/55302448/25868
    //
    // Note that I've disabled headless mode here just for demonstration purposes.
    // Normally you'd want to run this with headless set to true.
    //
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });

    const page = await browser.newPage();

    // https://pptr.dev/api/puppeteer.page.goto
    // https://stackoverflow.com/a/52163615/25868
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

    //  Give the page a moment longer to finish loading/rendering.
    await sleep(100);

    const body = await page.$('body');
    const scrollHeight = await page.evaluate(body => body.scrollHeight, body);
    const boundingBox = await body.boundingBox();

    const viewport = { width: Math.ceil(Math.max(1024, boundingBox.width)), height: Math.ceil(Math.max(720, scrollHeight + 10)) };

    await page.setViewport(viewport);

    // Allow page to finish adapting to the change in the viewport.
    await sleep(100);

    await page.screenshot({
        path: outputFile,
        fullPage: true,
    });

    const metadata = {
        url,
        boundingBox,
        viewport,
    };
    await fs.writeFile(`${outputFile}.json`, JSON.stringify(metadata, null, 4));

    await browser.close();
}

//
// Records screenshots for a series of pages.
//
async function recordScreenshots(config, outputPath, options) {
    let total = 0;
    let failed = 0;
    const { pages } = config;

    fs.ensureDirSync(outputPath);

    for (const page of pages) {
        const pageId = page.id;
        const pageUrl = page.url;

        console.log(page); //fio:

        const screenshotFile = `./${outputPath}/${pageId}.png`;
        if (!options.overwrite) {
            if (await fs.pathExists(screenshotFile)) {
                console.log(`Already captured ${screenshotFile}, skipping it now.`);
                ++total;
                continue;
            }
        }
        
        try {
            await makeScreenshot(pageUrl, screenshotFile);

            ++total;
        }
        catch (err) {
            console.error(`Failed on ${pageId}`);
            console.error(err);
            ++failed;
        }
    }

    console.log(`Pages:  ${pages.length}`);
    console.log(`Total:  ${total}`);
    console.log(`Failed: ${failed}`);
}

//
// Sleep for the specified number of milliseconds.
//
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    makeScreenshot,
    recordScreenshots,
};