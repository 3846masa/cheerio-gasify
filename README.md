# cheerio-gasify
cheerio working on Google Apps Script.

## Usage
```js
var cheerio = cheerio_gasify.require('cheerio');

var response = UrlFetchApp.fetch("http://example.com/");
var $ = cheerio.load(response.getContentText());

Logger.log($('title').text());
```

## Project Key
``MU756IKHJ2hAYP1glQmzgA4ZBvzIux02r``

## LICENSE
|module| name|license|
|:--:|:--:|:--:|
|boolbase@1.0.0|ISC|git+https://github.com/fb55/boolbase|
|cheerio@0.19.0|MIT|https://github.com/cheeriojs/cheerio|
|core-util-is@1.0.1|MIT|https://github.com/isaacs/core-util-is|
|css-select@1.0.0|BSD-like|https://github.com/fb55/css-select|
|css-what@1.0.0|BSD-like|git+https://github.com/fb55/css-what|
|dom-serializer@0.1.0|MIT|https://github.com/cheeriojs/dom-renderer|
|domelementtype@1.1.3|BSD*|https://github.com/FB55/domelementtype|
|domelementtype@1.3.0|BSD*|https://github.com/FB55/domelementtype|
|domhandler@2.3.0|BSD*|https://github.com/fb55/DomHandler|
|domutils@1.4.3|BSD*|https://github.com/FB55/domutils|
|domutils@1.5.1|BSD*|https://github.com/FB55/domutils|
|entities@1.0.0|BSD-like|https://github.com/fb55/node-entities|
|entities@1.1.1|BSD-like|https://github.com/fb55/node-entities|
|events@1.0.2|MIT|https://github.com/Gozala/events|
|htmlparser2@3.8.3|MIT|https://github.com/fb55/htmlparser2|
|inherits@2.0.1|ISC|https://github.com/isaacs/inherits|
|isarray@0.0.1|MIT|https://github.com/juliangruber/isarray|
|lodash@3.10.0|MIT|git+https://github.com/lodash/lodash|
|nth-check@1.0.1|BSD|git+https://github.com/fb55/nth-check|
|readable-stream@1.1.13|MIT|https://github.com/isaacs/readable-stream|
|string_decoder@0.10.31|MIT|https://github.com/rvagg/string_decoder|
|util@0.10.3|MIT|https://github.com/defunctzombie/node-util|

