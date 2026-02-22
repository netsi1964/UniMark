# Comprehensive Guide for LLMs: Wrapping a Web App with Neutralino.js

This document serves as a specialized guide for Large Language Models (LLMs) assisting users in converting web applications into lightweight, native desktop applications using **Neutralino.js**. 

It specifically addresses critical edge cases, platform-specific bugs, and undocumented pitfalls discovered through rigorous real-world debugging, particularly on macOS. **Read this carefully before generating code or CI/CD pipelines.**

---

## 1. Core Concepts & What to Remember

Neutralino.js is an ultra-lightweight alternative to Electron. Instead of bundling Chromium and Node.js (~150MB), it uses the operating system's native webview (WKWebView on macOS, WebView2 on Windows) and a tiny C++ WebSocket server. The resulting binaries are typically under 5MB.

**Key Architecture Points to Remember:**
- The frontend (HTML/JS/CSS) communicates with the Neutralino backend via a WebSocket.
- The Neutralino client library (`neutralino.js`) MUST be injected into the main HTML file.
- The application configuration is managed exclusively in `neutralino.config.json`.

---

## 2. Critical Implementation Guidelines & Pitfalls to Avoid

If you follow the official documentation blindly, you will run into several severe issues, primarily on Apple Silicon (M-series) Macs. **You MUST implement the following workarounds.**

### A. The "Standalone Executable" Trap (`--embed-resources`)
By default, Neutralino expects a `resources.neu` file next to the binary. To make the app a true standalone executable, you must embed the resources during the build process.
✅ **Rule:** Always use the `--embed-resources` flag: `neu build --release --embed-resources`.

### B. The macOS `.app` Bundle Bug
Neutralino's built-in `--macos-bundle` flag is fundamentally broken. It simply renames the raw Unix executable to `.app`, which macOS refuses to open properly.
✅ **Rule:** You **MUST** manually assemble the `.app` bundle structure in bash/CI after the `neu build` completes.

<details>
<summary>Correct Post-Build Bash Script for macOS Bundle</summary>

```bash
# Assuming the output binary is named unimark-mac_universal
# 1. Create the skeleton
mkdir -p dist/my-app/MyApp-macOS.app/Contents/MacOS
mkdir -p dist/my-app/MyApp-macOS.app/Contents/Resources

# 2. Move binary and grant execution rights
mv dist/my-app/unimark-mac_universal dist/my-app/MyApp-macOS.app/Contents/MacOS/MyApp-macOS
chmod +x dist/my-app/MyApp-macOS.app/Contents/MacOS/MyApp-macOS

# 3. Create a valid Info.plist manually (CRITICAL!)
cat <<EOF > dist/my-app/MyApp-macOS.app/Contents/Info.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key>
  <string>MyApp-macOS</string>
  <key>CFBundleIconFile</key>
  <string>icon.icns</string>
  <key>CFBundleIdentifier</key>
  <string>com.example.myapp</string>
  <key>CFBundleName</key>
  <string>MyApp</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
</dict>
</plist>
EOF
```
</details>

### C. The Apple Silicon `SIGKILL` Issue
When `--embed-resources` modifies the binary to inject the HTML/CSS payload, it breaks the existing code signature. Apple Silicon's AMFI (Apple Mobile File Integrity) will immediately terminate the app (`SIGKILL`) upon launch.
✅ **Rule:** You must apply an ad-hoc signature to the complete `.app` bundle before distributing it:
```bash
codesign --force --deep --sign - dist/my-app/MyApp-macOS.app
```

### D. The Native Keyboard Shortcuts & "Beep" Bug
Native macOS Edit menu shortcuts (Cmd+C, Cmd+V, Cmd+X, Cmd+Z, Cmd+A) **do not work by default** in WKWebView unless a native menu bar exists. If the user presses them, macOS plays an error "beep" sound because the menu item is missing.
✅ **Rule:** You must manually intercept these keydowns in JS, trigger `document.execCommand()`, and critically, call `e.preventDefault()` to suppress the native beep.

<details>
<summary>Correct Keyboard Interceptor (JS)</summary>

```javascript
document.addEventListener('keydown', (e) => {
    if (NL_OS === 'Darwin' && e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'c': document.execCommand('copy'); e.preventDefault(); break;
            case 'v': document.execCommand('paste'); e.preventDefault(); break;
            case 'x': document.execCommand('cut'); e.preventDefault(); break;
            case 'a': document.execCommand('selectAll'); e.preventDefault(); break;
            case 'z': 
                if (e.shiftKey) document.execCommand('redo');
                else document.execCommand('undo');
                e.preventDefault(); 
                break;
        }
    }
});
```
</details>

### E. The macOS `Cmd+Q` Crash (`SIGTRAP`)
If you map `Cmd+Q` to call `Neutralino.app.exit()`, the app will crash heavily (`EXC_BREAKPOINT / SIGTRAP` inside `_dispatch_assert_queue_fail`). This happens because Neutralino attempts to close native UI windows from an asynchronous WebSocket thread, violating Apple's strict main-thread UI rules.
✅ **Rule:** On macOS, kill the process ID via the OS instead of relying on the backend WebSocket.

```javascript
function quitApp() {
    if (NL_OS === 'Darwin') {
        Neutralino.os.execCommand('kill -15 ' + NL_PID); // Safe shutdown
    } else {
        Neutralino.app.exit();
    }
}
// Remember to map quitApp() to 'Cmd+Q' and the Tray Icon "Quit" button!
```

---

## 3. Creating the Perfect GitHub Actions CI/CD Pipeline

When building a GitHub Actions workflow to auto-release the Neutralino binaries, follow this architecture. 

**Critical CI Pitfalls:**
- `.gitignore` usually ignores `neutralino.js`. Therefore, the CI environment will lack the client library, and `neu build` will fail. You **MUST** run `npx @neutralinojs/neu update` before building in CI.
- The `zip` command natively utilized on Ubuntu/macOS runners destroys Unix filesystem execution permissions (`chmod +x`). If you `zip` the `.app`, users will be unable to open it. You **MUST** use Apple's `ditto` command on the macOS runner to create the archive.
- Ensure the runner is `macos-latest` to gain access to `codesign`, `ditto`, and `lipo` (to combine Intel and Apple Silicon into a Universal binary).

<details>
<summary>Robust CI/CD macOS Job Example</summary>

```yaml
jobs:
  build-neutralino:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        
      - name: Build Neutralino App
        run: |
          npm install
          npx @neutralinojs/neu update # IMPORTANT: Download missing client libraries
          npx @neutralinojs/neu build --release --embed-resources
          
      - name: Assemble Manual MacOS Bundle & Sign
        run: |
          # Create Bundle Structure
          mkdir -p dist/MyApp.app/Contents/MacOS
          mv dist/my-app-mac_universal dist/MyApp.app/Contents/MacOS/MyApp
          chmod +x dist/MyApp.app/Contents/MacOS/MyApp
          
          # Inject Info.plist here...
          
          # Ad-hoc Sign to prevent M-series SIGKILL
          codesign --force --deep --sign - dist/MyApp.app
          
      - name: Archive natively to preserve execution flags
        run: |
          cd dist
          # IMPORTANT: Do not use zip. Use ditto.
          ditto -c -k --keepParent MyApp.app MyApp-macOS.zip
          
      - name: Upload Release
        uses: softprops/action-gh-release@v2
        with:
          files: dist/MyApp-macOS.zip
```
</details>

---

## 4. End-User Documentation (Gatekeeper Warning)

If the project does not have a paid $99/year Apple Developer Certificate, the downloaded `.zip` file will be flagged with a Quarantine attribute by macOS Gatekeeper. If the user unpacks it and double-clicks the app, macOS will claim "the application is damaged and cannot be opened."

✅ **Rule:** You must tell the human User to instruct their end-users to run a one-time terminal command to remove the quarantine flag. Include this exact wording in the `README.md`:

> **macOS Installation Note:** 
> Since this is an Open Source project without a paid Apple Certificate, macOS places the downloaded app in Quarantine. To open it for the first time:
> 1. Unzip the file to get the `.app`.
> 2. Open Terminal.
> 3. Run: `xattr -cr /path/to/MyApp.app` (you can drag the app into the terminal to get the exact path).
> 4. Double-click the app to open it normally forever.

---

## 5. Where to Find More Help
- **Official Documentation:** https://neutralino.js.org/docs
- **API Reference (JS):** https://neutralino.js.org/docs/api/overview
- **GitHub Issues:** Search the Neutralinojs/neutralinojs repository for specific OS quirks.
