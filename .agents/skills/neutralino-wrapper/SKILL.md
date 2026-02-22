---
name: neutralino-wrapper
description: Wraps an existing web application (HTML/JS/CSS or dist folder) into a lightweight native desktop app using Neutralino.js, with macOS crash prevention and automated GitHub Actions CI/CD. Use when the user wants to package a web app as a desktop app, create a Neutralino.js wrapper, ship a cross-platform desktop build, or bundle a frontend as a standalone executable.
---

# Neutralino Web App Wrapper Skill

You are an expert desktop application engineering AI. Your goal is to guide the user in securely wrapping their existing web application (HTML/JS/CSS or built dist folder) into a lightweight native desktop app using Neutralino.js.

## 🚨 MANDATORY WORKFLOW 🚨
You **MUST** follow these 5 phases in order. **DO NOT** execute the next phase until the user explicitly approves the plan in Phase 2.

### Phase 1: Discovery
Prompt the user for the following information to adapt the templates:
- What is the existing build output folder (e.g., `dist`, `build`, root directory)?
- What is the exact repository name for GitHub Actions (e.g., `github.repository`)?
- What should the desktop application be named (e.g., `MyApp`)?

### Phase 2: Planning & Approval 🛑
Present a step-by-step implementation plan explaining what changes you will make. 
**Critically:** Explicitly ask the user if they accept this plan before you touch any code.
Once they say yes or "Go ahead", you may proceed to Phase 3.

### Phase 3: Project Scaffolding
Initialize the Neutralino project using the `@neutralinojs/neu` CLI.
Then, implement the critical fixes to avoid macOS crashes.

**Rules for main.js implementation:**
Replace the default `main.js` with the provided `templates/main.js` which includes:
1. **The Native Beep Bug Fix:** An event listener utilizing `document.execCommand()` and `e.preventDefault()` to stop macOS from beeping when native shortcuts like Cmd+C are pressed.
2. **The SIGTRAP Crash Fix:** A custom `quitApp()` function using `kill -15` to gracefully shutdown the macOS app, avoiding the `_dispatch_assert_queue_fail` crash caused by `Neutralino.app.exit()`.

**Rules for neutralino.config.json & scripts:**
1. Ensure the `neutralino:build` script uses the `--embed-resources` flag (e.g., `neu build --release --embed-resources`) so it creates a standalone executable.

### Phase 4: CI/CD Pipeline
Add the GitHub Actions workflow using `templates/release.yml`. 
**Critical CI rules for macOS:**
- Before building, run `npx @neutralinojs/neu update` to fetch client libraries that `.gitignore` removes.
- Do NOT use the built-in `--macos-bundle` flag in Neutralino, as it creates an invalid macOS bundle. Follow the bash script in the template to manually restructure the `Contents/MacOS` and `Contents/Resources`.
- You MUST ad-hoc sign the bundle (`codesign --force --deep --sign -`) to avoid Apple Silicon's AMFI `SIGKILL`.
- You MUST archive the macOS bundle using `ditto -c -k --keepParent` instead of `zip` to preserve Unix execution rights (`chmod +x`).

### Phase 5: Documentation
Update the project's README.md with the contents of `templates/README_MAC_INSTRUCTIONS.md` to instruct end-users how to resolve the Apple Gatekeeper "Quarantine" warning (`xattr -cr`). 

***

## 🧩 TEMPLATES

Use the `Read` tool to load the template files from the `templates/` directory relative to this SKILL.md file before implementing each phase.

| Template | Purpose |
|---|---|
| `templates/main.js` | Drop-in replacement for Neutralino's default `main.js`. Contains both macOS fixes. |
| `templates/release.yml` | GitHub Actions workflow. Contains all CI/CD steps with the 4 critical macOS fixes. |
| `templates/README_MAC_INSTRUCTIONS.md` | End-user Gatekeeper instructions to paste into the project README. |

### APP_NAME Substitution
All templates use `MyApp` as a placeholder. When implementing, **replace every occurrence of `MyApp`** in `release.yml` with the actual app name the user provided in Phase 1. There are 8 occurrences:
- 3× `APP_NAME="MyApp"` variable declarations
- 5× `MyApp` in paths and filenames (`dist/MyApp`, `MyApp-macOS.app`, `MyApp-macOS.zip`, etc.)

In `main.js`, update the `About` message box text to reflect the actual app name.
