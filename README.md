# SFN-Markdown-Parser

**Simple markdown parser for SFN framework.**

This module uses [marked](https://marked.js.org), 
[highlightjs](https://highlightjs.org/) and
[comment-meta](https://github.com/hyurl/comment-meta)
to parse and render markdown files.

## API

```typescript
namespace MarkdownParser {
    /** Parses markdown contents to HTML. */
    function parse(contents: string): Promise<string>;
    /** Parses a markdown file to HTML. */
    function parseFile(filename: string, encoding = "utf8"): Promise<string>;
    /** Gets the title of a markdown document. */
    function getTitle(content: string): string;
    /** Gets the title of a markdown document. */
    function getFileTitle(filename: string, encoding = "utf8"): Promise<string>
}
```