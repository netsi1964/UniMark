# Markdown Formatting Guide

This document provides a comprehensive guide to various Markdown formatting features.

## Text Formatting

You can format text in several ways:

- **Bold text** is created using two asterisks or underscores: `**bold text**` or `__bold text__`.
- *Italic text* is created with a single asterisk or underscore: `*italic text*` or `_italic text_`.
- ***Bold and italic text*** can be combined: `***bold and italic***`.
- Strikethrough text is done with two tildes: `~~strikethrough~~`.
- `Inline code` is wrapped in backticks: `` `inline code` ``.

## Headings

There are six levels of headings in Markdown:

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Lists

You can create both ordered and unordered lists.

### Unordered List

- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
- Item 3

### Ordered List

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2
3. Third item

## Links and Images

- **Links**: You can create a link like this: [Visit GitHub](https://github.com).
- **Images**: Here is an image with alt text:
  ![GitHub Octocat](https://github.githubassets.com/images/modules/logos_page/Octocat.png)

## Blockquotes

Blockquotes are useful for quoting text from another source:

> "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life."
> \- Bill Gates

## Horizontal Rule

You can create a horizontal rule to separate content:

---

## Code Blocks

You can create fenced code blocks with syntax highlighting by specifying the language:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

```python
def hello(name):
    print(f"Hello, {name}!")

hello("World")
```

## Tables

Tables are created using pipes and hyphens:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |
| Row 3, Col 1 | Row 3, Col 2 | Row 3, Col 3 |

## Task Lists

Task lists are a great way to track to-do items:

- [x] Complete feature A
- [ ] Implement feature B
- [ ] Fix bug C

## Emoji

You can also include emojis in your Markdown text! :smile: :rocket:

Enjoy using Markdown!