import * as fs from "fs-extra";
import * as marked from "marked";
import hljs = require("highlightjs");
import trim = require("lodash/trim");
import meta from "comment-meta";

const renderer = new marked.Renderer();
const pin = `<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;

// Render markdown headings.
renderer.heading = function (text: string, level: number): string {
    let isLatin = Buffer.byteLength(text) == text.length,
        _text = text.replace(/\s/g, '-'),
        re = /[~`!@#\$%\^&\*\(\)\+=\{\}\[\]\|:"'<>,\.\?\/]/g,
        id: string;

    if (isLatin) {
        let matches = _text.match(/[\-0-9a-zA-Z]+/g);
        id = matches ? matches.join("_") : _text.replace(re, "_");
    } else {
        id = _text.replace(re, "_");
    }

    id = trim(id, "_");

    return `<h${level} id="${id}"><a class="heading-anchor" href="#${id}">${pin}</a>${text}</h${level}>\n`;
};

// Render markdown codes to be highlighted.
renderer.code = function (code, lang) {
    try {
        code = hljs.highlight(lang, code, true).value;
    } catch (e) { }
    return `<pre><code class="lang-${lang} hljs">${code}</code></pre>\n`;
};

export namespace MarkdownParser {
    /** Parses markdown contents to HTML. */
    export function parse(contents: string): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                resolve(marked(contents, { renderer }));
            } catch (err) {
                reject(err);
            }
        });
    }

    /** Parses a markdown file to HTML. */
    export function parseFile(filename: string, encoding = "utf8"): Promise<string> {
        return fs.readFile(filename, encoding).then(data => parse(data));
    }

    /** Gets the title of a markdown document. */
    export function getTitle(content: string): string {
        let metadata = meta(content);

        if (metadata.length && metadata[0].title)
            return metadata[0].title;

        let start = content.indexOf("#"),
            end = content.indexOf("\n", start);

        return trim(content.slice(start, end), "# \r\n");
    }

    /** Gets the title of a markdown document. */
    export function getFileTitle(filename: string, encoding = "utf8"): Promise<string> {
        return fs.readFile(filename, encoding).then(data => getTitle(data));
    }
}

export default MarkdownParser;