const { convert } = require('html-to-text');

let html = "<p>This is some html.</p>";

let text = convert(html);