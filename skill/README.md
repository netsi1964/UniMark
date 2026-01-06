# UniMark Skill - Markdown to Unicode Converter

Convert Markdown to Unicode-styled text for use in plain text environments like Slack, Twitter, SMS, and emails.

## Table of Contents

- [UniMark Skill - Markdown to Unicode Converter](#unimark-skill---markdown-to-unicode-converter)
  - [Table of Contents](#table-of-contents)
  - [What is UniMark?](#what-is-unimark)
  - [Installation](#installation)
    - [Claude.ai (Web Interface)](#claudeai-web-interface)
    - [Claude Code (CLI)](#claude-code-cli)
      - [Personal Skill (For you only)](#personal-skill-for-you-only)
      - [Project Skill (Share with team)](#project-skill-share-with-team)
      - [Verify Installation](#verify-installation)
    - [Codex CLI](#codex-cli)
      - [Personal Skill (For you only)](#personal-skill-for-you-only-1)
      - [Project Skill (Share with team)](#project-skill-share-with-team-1)
      - [Verify Installation](#verify-installation-1)
  - [Usage](#usage)
    - [Basic Examples](#basic-examples)
    - [Claude.ai Examples](#claudeai-examples)
      - [Convert Text](#convert-text)
      - [Social Media Post](#social-media-post)
      - [Email Signature](#email-signature)
    - [Claude Code Examples](#claude-code-examples)
    - [Standalone Scripts](#standalone-scripts)
      - [Node.js](#nodejs)
      - [TypeScript/Deno](#typescriptdeno)
      - [In Your Code](#in-your-code)
  - [Supported Markdown Syntax](#supported-markdown-syntax)
    - [Special Characters](#special-characters)
    - [Tips](#tips)
  - [What's Included](#whats-included)
  - [Troubleshooting](#troubleshooting)
    - [Skill doesn't appear in skills list](#skill-doesnt-appear-in-skills-list)
    - [Skill doesn't activate](#skill-doesnt-activate)
    - [Garbled output](#garbled-output)
    - [Installation Locations Reference](#installation-locations-reference)
  - [Limitations](#limitations)
  - [Support](#support)

---

## What is UniMark?

UniMark is an AI skill that converts Markdown to Unicode-styled text, allowing you to have formatted text (bold, italic, etc.) everywhere - even in plain text environments.

**Example:**
```
Input:  **bold** and *italic*
Output: 𝗯𝗼𝗹𝗱 and 𝘪𝘵𝘢𝘭𝘪𝘤
```

The formatted text works in any plain text environment without markdown support!

---

## Installation

### Claude.ai (Web Interface)

1. Locate the skill file: `skill/unimark.skill`
2. In Claude.ai, click ⚙️ (Settings) → Skills
3. Click "Install skill" and upload `skill/unimark.skill`
4. Ready to use!

### Claude Code (CLI)

#### Personal Skill (For you only)

**Quick install (one-liner):**
```bash
unzip skill/unimark.skill -d /tmp && mkdir -p ~/.claude/skills && cp -r /tmp/unimark ~/.claude/skills/ && rm -rf /tmp/unimark && echo "✅ UniMark installed!"
```

<details>
<summary>📋 Step-by-step installation</summary>

```bash
# 1. Unzip to temporary location
unzip skill/unimark.skill -d /tmp

# 2. Copy to your personal skills folder
mkdir -p ~/.claude/skills/
cp -r /tmp/unimark ~/.claude/skills/

# 3. Verify installation
ls ~/.claude/skills/unimark/SKILL.md

# 4. Clean up
rm -rf /tmp/unimark

# 5. Restart Claude Code
```
</details>

#### Project Skill (Share with team)

**Quick install (one-liner from project root):**
```bash
unzip skill/unimark.skill -d /tmp && mkdir -p .claude/skills && cp -r /tmp/unimark .claude/skills/ && rm -rf /tmp/unimark && echo "✅ UniMark installed!"
```

<details>
<summary>📋 Step-by-step installation</summary>

```bash
# 1. Navigate to your project
cd /path/to/your/project

# 2. Create skills directory
mkdir -p .claude/skills

# 3. Unzip to temporary location
unzip skill/unimark.skill -d /tmp

# 4. Copy to project skills folder
cp -r /tmp/unimark .claude/skills/

# 5. Verify installation
ls .claude/skills/unimark/SKILL.md

# 6. Clean up
rm -rf /tmp/unimark

# 7. Commit to git (team gets it automatically)
git add .claude/skills/unimark
git commit -m "Add UniMark skill for markdown to unicode conversion"
git push
```
</details>

#### Verify Installation

```bash
# Check file structure
ls -la ~/.claude/skills/unimark/
# Should show: SKILL.md, scripts/, references/

# Check YAML frontmatter
head -10 ~/.claude/skills/unimark/SKILL.md

# Test in Claude Code
claude
"What Skills are available?"
```

### Codex CLI

#### Personal Skill (For you only)

**Quick install (one-liner):**
```bash
SKILL_PATH=skill/unimark.skill && mkdir -p ~/.codex/skills/unimark && unzip -o $SKILL_PATH -d ~/.codex/skills/unimark && echo 'UniMark installed!'
```

<details>
<summary>📋 Step-by-step installation</summary>

```bash
# 1. Confirm the file exists (use an absolute path if needed)
ls -la skill/unimark.skill

# 2. Check the file type (zip is most common)
file skill/unimark.skill

# 3. Unzip directly to Codex skills folder
mkdir -p ~/.codex/skills/unimark
unzip -o skill/unimark.skill -d ~/.codex/skills/unimark

# 4. Verify installation
ls ~/.codex/skills/unimark/SKILL.md

# 5. Restart Codex
```
</details>

#### Project Skill (Share with team)

**Quick install (one-liner from project root):**
```bash
SKILL_PATH="skill/unimark.skill" && mkdir -p .codex/skills/unimark && unzip -o "$SKILL_PATH" -d .codex/skills/unimark && echo "✅ UniMark installed!"
```

<details>
<summary>📋 Step-by-step installation</summary>

```bash
# 1. Navigate to project
cd /path/to/your/project

# 2. Create skills directory
mkdir -p .codex/skills/unimark

# 3. Confirm the file exists (use an absolute path if needed)
ls -la skill/unimark.skill

# 4. Unzip directly to project skills folder
unzip -o skill/unimark.skill -d .codex/skills/unimark

# 5. Verify installation
ls .codex/skills/unimark/SKILL.md

# 6. Commit to git
git add .codex/skills/unimark
git commit -m "Add UniMark skill"
git push
```
</details>

#### Verify Installation

```bash
# Check file structure
ls -la ~/.codex/skills/unimark/
# Should show: SKILL.md, scripts/, references/

# Check YAML frontmatter
head -10 ~/.codex/skills/unimark/SKILL.md
```

---

## Usage

### Basic Examples

**Convert text:**
```
Input:  **bold** and *italic*
Output: 𝗯𝗼𝗹𝗱 and 𝘪𝘵𝘢𝘭𝘪𝘤
```

**Social media post:**
```
Input:  # New Feature! 🚀
        **Excited** to announce *version 2.0*
        
Output: 𝗡𝗲𝘄 𝗙𝗲𝗮𝘁𝘂𝗿𝗲! 🚀
        𝗘𝘅𝗰𝗶𝘁𝗲𝗱 to announce 𝘷𝘦𝘳𝘴𝘪𝘰𝘯 2.0
```

### Claude.ai Examples

#### Convert Text
```
You: "Convert this text to unicode: **bold text** and *italic text*"

Claude: [uses UniMark skill]
𝗯𝗼𝗹𝗱 𝘁𝗲𝘅𝘁 and 𝘪𝘵𝘢𝘭𝘪𝘤 𝘵𝘦𝘹𝘵
```

#### Social Media Post
```
You: "Create a LinkedIn post about our new product with unicode formatting"

Claude:
𝗡𝗲𝘄 𝗣𝗿𝗼𝗱𝘂𝗰𝘁! 🚀

𝙀𝙭𝙘𝙞𝙩𝙚𝙙 to announce 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 𝟮.𝟬

Features:
• 𝗙𝗮𝘀𝘁𝗲𝗿 performance
• 𝗕𝗲𝘁𝘁𝗲𝗿 UX
• 𝙽𝚎𝚠 API
```

#### Email Signature
```
You: "Create an email signature with unicode formatting"

Claude:
𝗝𝗼𝗵𝗻 𝗗𝗼𝗲
𝘚𝘰𝘧𝘵𝘸𝘢𝘳𝘦 𝘌𝘯𝘨𝘪𝘯𝘦𝘦𝘳
📧 john@company.com
```

### Claude Code Examples

Claude Code automatically activates UniMark when you mention unicode or markdown formatting.

```bash
# Start Claude Code
claude

# Convert a file
"Convert this README.md to unicode format"

# Create formatted Slack message
"Create a Slack message with bold and italic announcing our new feature"

# Generate release notes
"Generate release notes with unicode formatting for plain text email"

# Check available skills
"What Skills are available?"
```

**💡 Tip:** You don't need to say "use unimark skill" - Claude activates it automatically!

### Standalone Scripts

Use the converters without AI:

#### Node.js
```bash
node scripts/unimark-converter.js "**bold** and *italic*"
```

#### TypeScript/Deno
```bash
deno run --allow-read scripts/unimark-converter.ts "**bold** and *italic*"
```

#### In Your Code
```javascript
const { convertMarkdownToUnicode } = require('./unimark-converter.js');
const result = convertMarkdownToUnicode('**Hello** *World*');
console.log(result); // → 𝗛𝗲𝗹𝗹𝗼 𝘞𝘰𝘳𝘭𝘥
```

---

## Supported Markdown Syntax

| Markdown | Output Style | Example |
|----------|-------------|---------|
| `**text**` | Bold Sans | 𝗯𝗼𝗹𝗱 |
| `__text__` | Bold Serif | 𝐛𝐨𝐥𝐝 |
| `*text*` | Italic Sans | 𝘪𝘵𝘢𝘭𝘪𝘤 |
| `_text_` | Italic Serif | 𝑖𝑡𝑎𝑙𝑖𝑐 |
| `***text***` | Bold Italic Sans | 𝙗𝙤𝙡𝙙 𝙞𝙩𝙖𝙡𝙞𝙘 |
| `___text___` | Bold Italic Serif | 𝒃𝒐𝒍𝒅 𝒊𝒕𝒂𝒍𝒊𝒄 |
| `~~text~~` | Strikethrough | t̶e̶x̶t̶ |
| `` `code` `` | Monospace | 𝚌𝚘𝚍𝚎 |
| `# Header` | Bold Header | 𝗛𝗲𝗮𝗱𝗲𝗿 |
| `- Item` | Bullet List | • Item |
| `- [x] Task` | Checked | ☑ Task |
| `- [ ] Task` | Unchecked | ☐ Task |
| `> Quote` | Blockquote | ▎ Quote |
| `---` | Horizontal Rule | ━━━━━━━━━━━━━━━━ |

### Special Characters

UniMark supports special characters including Danish (æ, ø, å), German (ä, ö, ü), and other Latin characters:

```
Input:  **København** is *beautiful*
Output: 𝗞ø𝗯𝗲𝗻𝗵𝗮𝘃𝗻 is 𝘣𝘦𝘢𝘶𝘵𝘪𝘧𝘶𝘭
```

### Tips

✅ **Test first** - Not all fonts display all Unicode characters correctly  
✅ **Use Sans Serif** - `**bold**` has better support than `__bold__`  
✅ **Keep it simple** - Bold and italic work best everywhere  
⚠️ **Accessibility** - Screen readers may have problems with Unicode styling

---

## What's Included

```
skill/unimark.skill (ZIP file)
├── SKILL.md                      # Skill documentation
├── scripts/
│   ├── unimark-converter.ts      # TypeScript/Deno version
│   └── unimark-converter.js      # JavaScript/Node.js version
└── references/
    └── examples.md               # Comprehensive examples
```

---

## Troubleshooting

### Skill doesn't appear in skills list

**Problem:** AI doesn't show unimark in available skills.

**Solution - Check directory structure:**

```bash
# ✅ Correct structure:
~/.claude/skills/unimark/SKILL.md

# ❌ Wrong (nested):
~/.claude/skills/unimark/unimark/SKILL.md

# Check your structure:
ls -la ~/.claude/skills/unimark/

# Fix nested structure:
mv ~/.claude/skills/unimark/unimark/* ~/.claude/skills/unimark/
rmdir ~/.claude/skills/unimark/unimark

# Verify:
ls ~/.claude/skills/unimark/SKILL.md
```

### Skill doesn't activate

**Solution:**
```bash
# 1. Verify installation
ls ~/.claude/skills/unimark/SKILL.md

# 2. Check YAML frontmatter
head -20 ~/.claude/skills/unimark/SKILL.md

# 3. Restart Claude Code/Codex
```

### Garbled output

**Problem:** Output looks like: 𝚓𝚊𝚝𝚊𝚚𝚌𝚙𝚒𝚗𝚛 instead of 𝚓𝚊𝚟𝚊𝚜𝚌𝚛𝚒𝚙𝚝

**Solution:** This was a bug in older versions. Use the latest `skill/unimark.skill` and reinstall.

### Installation Locations Reference

| AI System | Personal Skills | Project Skills |
|-----------|----------------|----------------|
| Claude.ai | Web upload only | N/A |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.codex/skills/` |

---

## Limitations

1. **Font Support** - Not all fonts display all Unicode characters
2. **Searchability** - Unicode-styled text is not always searchable
3. **Copy-Paste** - Some platforms may modify characters
4. **Accessibility** - Screen readers may have difficulties
5. **Codex Support** - Experimental; requires Agent Skills standard support

---

## Support

- **Repository:** https://github.com/netsi1964/UniMark
- **Issues:** Report bugs via GitHub issues
- **License:** Same as original UniMark project

---

**Made with ❤️ for everyone who needs formatted text everywhere**
