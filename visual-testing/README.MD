# visual-testing

An example of automated visual testing using Puppeteer to capture screenshots of web pages and Image Magick to compare them.

## Requirements

You need Image Magick installed and in your path to use this:
https://imagemagick.org/ 

## Setting the page list

Edit the file [./src/config.js](./src/config.js) to change the list of web pages that are captured and tested:

```javascript
const urls = [
    "https://www.google.com",
    "https://openai.com",
];
```

## Setup

Open a terminal, change to the `visual-testing` directory and installed dependencies:

```bash
cd visual-testing
npm install
```

## Capture screenshots from listed web pages

Invoke this command:

```bash
npm run capture
```

The screenshots are saved to the `existing` subdirectory.

Terminal output shows you the pages that were captured:

```bash
> npm run capture

{ id: 'https___www_google_com', url: 'https://www.google.com' }
{ id: 'https___openai_com', url: 'https://openai.com' }
Pages:  2
Total:  2
Failed: 0
Done
```

## Test latest screenshots against existing ones

Invoke this command:

```bash
npm test
```

New screenshots are saved to the `latest` subdirectory.

The differences are saved to the `diff` subdirectory.

Terminal output lists the pages that have changed, for example when all pages are the same:

```bash
> npm test

{ id: 'https___www_google_com', url: 'https://www.google.com' }
{ id: 'https___openai_com', url: 'https://openai.com' }
Pages:  2
Total:  2
Failed: 0
=====================================================
All differences:
[
  {
    id: 'https___www_google_com',
    ok: true,
    stats: { meanSquaredError: 0, whiteness: 86.0724 }
  },
  {
    id: 'https___openai_com',
    ok: true,
    stats: { meanSquaredError: 5.5026, whiteness: 26.9714 }
  }
]
=====================================================
Significant differencews:
[]
Total: 2
#OK: 2
%OK 100%
Different: 0
White pages 0
Done
```