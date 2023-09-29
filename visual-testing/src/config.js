//
// The web pages to capture.
//

const urls = [
    "https://www.google.com",
    "https://openai.com",
];

//
// Remove invalid characters (for most file systems).
//
function urlToFileName(url) {
    return url.replace(/[\.<>:"\/\\|?*\x00-\x1F]/g, '_');
}

const pages = urls
    .map(url => ({
        id: urlToFileName(url),
        url,
    }));

module.exports = {
    pages,
};