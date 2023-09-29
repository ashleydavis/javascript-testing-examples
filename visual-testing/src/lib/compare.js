//
// Generate diffs between before and after screenshots.
//

const fs = require("fs-extra");
const { exec } = require('node:child_process');

const MIN_ERROR_THRESHOLD = 100;

//
// Comparess two images.
//
function compare(id, before, after, outputPath) {
    return new Promise(resolve => {
        const diff = `${outputPath}/${id}.png`;

        // https://imagemagick.org/script/compare.php
        // https://imagemagick.org/script/command-line-options.php#metric
        exec(`magick compare -metric mse ${before} ${after} ${diff}`, (error, stdout, stderr) => {
            // console.log(error);
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);

            const meanSquaredError = parseFloat(stderr.split(" ")[0]);

            exec(`magick ${after} -fuzz XX% -fill black +opaque white -fill white -opaque white -format "%[fx:100*mean]" info:`, (error, stdout, stderr) => {

                // console.log(error, stdout, stderr);

                const whiteness = parseFloat(stdout);
                resolve({ meanSquaredError, whiteness });
            });
        });
    });
}

//
// Compares the list of before and after images.
//
async function compareImages(config, outputPath) {

    await fs.ensureDir(outputPath);

    const { pages } = config;

    const diffs = [];
    let total = 0;
    let numOk = 0;
    let numDifferent = 0;

    for (const page of pages) {
        const { id, before, after } = page;
        const stats = await compare(id, before, after, outputPath);
        const ok = !(stats.meanSquaredError > MIN_ERROR_THRESHOLD);
        diffs.push({
            id,
            ok,
            stats,
        });

        total++;
        if (ok) {
            numOk++;
        }
        else {
            numDifferent++;
        }
    }

    let percentDifferent = (numOk/total)*100;

    console.log(`=====================================================`);
    console.log(`All differences:`);
    console.log(diffs);

    console.log(`=====================================================`);
    console.log(`Significant differencews:`);
    console.log(diffs.filter(diff => !diff.ok));

    const whitePages = diffs.filter(diff => diff.stats.whiteness > 99);

    console.log(`Total: ${total}`);
    console.log(`#OK: ${numOk}`);
    console.log(`%OK ${percentDifferent}%`);
    console.log(`Different: ${numDifferent}`);
    console.log(`White pages ${whitePages.length}`);
} 

module.exports = {
    compare,
    compareImages,
};