# Neutralino Minimal App Plan

## /neutralino-app/resources/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neutralino Minimal App</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div class="container">
      <h1>Neutralino.js App</h1>
      
      <div class="actions">
        <button id="btn-select-file">Select File</button>
        <button id="btn-read-file">Read File</button>
        <button id="btn-write-file">Write File</button>
        <button id="btn-exec-cmd">Execute Command</button>
        <button id="btn-show-notif">Show Notification</button>
        <button id="btn-toggle-top">Toggle Always on Top</button>
        <button id="btn-minimize-tray">Minimize to Tray</button>
        <button id="btn-restore">Restore Window</button>
        <button id="btn-exit">Exit App</button>
      </div>

      <div class="output">
        <h3>Output:</h3>
        <pre id="output-area">Ready...</pre>
      </div>
    </div>

    <script src="neutralino.js"></script>
    <script src="main.js"></script>
  </body>
</html>
```

## /neutralino-app/resources/styles.css

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 20px;
  line-height: 1.5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #ffffff;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

button {
  background-color: #3a3a3a;
  color: #ffffff;
  border: 1px solid #555;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #4a4a4a;
}

button:active {
  background-color: #2a2a2a;
}

.output {
  background-color: #252526;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 15px;
}

h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #cccccc;
}

#output-area {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  color: #9cdcfe;
}
```

## /neutralino-app/resources/main.js

```javascript
let alwaysOnTop = false;
let selectedFilePath = '';

function logOutput(msg) {
  document.getElementById('output-area').textContent = msg;
}

async function onWindowClose() {
  await Neutralino.app.exit();
}

async function setTray() {
  if (NL_OS !== 'Darwin') {
    let tray = {
      icon: '/resources/icons/trayIcon.png',
      menuItems: [
        { id: 'restore', text: 'Restore' },
        { id: 'exit', text: 'Exit' }
      ]
    };
    await Neutralino.os.setTray(tray);
  }
}

async function onTrayMenuItemClicked(event) {
  if (event.detail.id === 'restore') {
    await Neutralino.window.show();
  } else if (event.detail.id === 'exit') {
    await Neutralino.app.exit();
  }
}

document.getElementById('btn-select-file').addEventListener('click', async () => {
  try {
    let entries = await Neutralino.os.showOpenDialog('Select a file', {
      multiSelections: false
    });
    if (entries && entries.length > 0) {
      selectedFilePath = entries[0];
      logOutput(`Selected file:\n${selectedFilePath}`);
    } else {
      logOutput('File selection cancelled.');
    }
  } catch (err) {
    logOutput(`Error selecting file: ${err.message}`);
  }
});

document.getElementById('btn-read-file').addEventListener('click', async () => {
  if (!selectedFilePath) {
    logOutput('Please select a file first.');
    return;
  }
  try {
    let content = await Neutralino.filesystem.readFile(selectedFilePath);
    logOutput(`File Content:\n\n${content}`);
  } catch (err) {
    logOutput(`Error reading file: ${err.message}`);
  }
});

document.getElementById('btn-write-file').addEventListener('click', async () => {
  try {
    const filename = 'test_output.txt';
    const content = `Test file generated at ${new Date().toISOString()}`;
    await Neutralino.filesystem.writeFile(filename, content);
    logOutput(`Successfully wrote to:\n${filename}\n\nContent:\n${content}`);
  } catch (err) {
    logOutput(`Error writing file: ${err.message}`);
  }
});

document.getElementById('btn-exec-cmd').addEventListener('click', async () => {
  try {
    let cmd = NL_OS === 'Windows' ? 'dir' : 'ls -la';
    let info = await Neutralino.os.execCommand(cmd);
    logOutput(`Command Executed: ${cmd}\n\nStandard Output:\n${info.stdOut}\n\nStandard Error:\n${info.stdErr}`);
  } catch (err) {
    logOutput(`Error executing command: ${err.message}`);
  }
});

document.getElementById('btn-show-notif').addEventListener('click', async () => {
  try {
    await Neutralino.os.showNotification('Hello', 'This is a native notification from Neutralino.js', 'INFO');
    logOutput('Notification shown.');
  } catch (err) {
    logOutput(`Error showing notification: ${err.message}`);
  }
});

document.getElementById('btn-toggle-top').addEventListener('click', async () => {
  try {
    alwaysOnTop = !alwaysOnTop;
    await Neutralino.window.setAlwaysOnTop(alwaysOnTop);
    logOutput(`Always on top set to: ${alwaysOnTop}`);
  } catch (err) {
    logOutput(`Error toggling always on top: ${err.message}`);
  }
});

document.getElementById('btn-minimize-tray').addEventListener('click', async () => {
  try {
    await Neutralino.window.hide();
    logOutput('Window minimized to tray.');
  } catch (err) {
    logOutput(`Error minimizing to tray: ${err.message}`);
  }
});

document.getElementById('btn-restore').addEventListener('click', async () => {
  try {
    await Neutralino.window.show();
    logOutput('Window restored.');
  } catch (err) {
    logOutput(`Error restoring window: ${err.message}`);
  }
});

document.getElementById('btn-exit').addEventListener('click', async () => {
  await Neutralino.app.exit();
});

Neutralino.init();
Neutralino.events.on('windowClose', onWindowClose);
Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked);

if (NL_OS !== 'Darwin') {
  setTray();
}
```

## /neutralino-app/neutralino.config.json

```json
{
  "applicationId": "js.neutralino.minimal",
  "version": "1.0.0",
  "defaultMode": "window",
  "port": 0,
  "documentRoot": "/resources/",
  "url": "/",
  "enableServer": true,
  "enableNativeAPI": true,
  "tokenSecurity": "one-time",
  "logging": {
    "enabled": true,
    "writeToLogFile": true
  },
  "nativeAllowList": [
    "app.*",
    "os.*",
    "filesystem.*",
    "window.*",
    "events.*"
  ],
  "modes": {
    "window": {
      "title": "Neutralino Minimal App",
      "width": 800,
      "height": 600,
      "minWidth": 400,
      "minHeight": 300,
      "fullScreen": false,
      "alwaysOnTop": false,
      "icon": "/resources/icons/appIcon.png",
      "enableInspector": false,
      "borderless": false,
      "maximize": false,
      "hidden": false,
      "resizable": true,
      "exitProcessOnClose": true
    }
  },
  "cli": {
    "binaryName": "neutralino-app",
    "resourcesPath": "/resources/",
    "extensionsPath": "/extensions/",
    "clientLibrary": "/resources/neutralino.js",
    "binaryVersion": "4.15.0",
    "clientVersion": "3.10.0"
  }
}
```

## /neutralino-app/.gitignore

```
# Neutralino build output
/dist/
/.tmp/
bin/*
!bin/.gitkeep
# Log files
neutralinojs.log
# OS generated files
.DS_Store
Thumbs.db
```

## /neutralino-app/README.md

```markdown
# Neutralino Minimal App

A minimal, production-ready desktop application using Neutralino.js and Vanilla web technologies. Requirements fulfilled: small footprint, native APIs, HTML/CSS/JS, no frontend frameworks, and no node runtime bundled.

## Prerequisites

Install Neutralino CLI globally:

```bash
npm install -g @neutralinojs/neu
```

## Project Init Steps

If re-initializing or updating binaries:

```bash
neu update
```

## Formatting & Assets

Place an icon at `/resources/icons/appIcon.png` and `/resources/icons/trayIcon.png` for tray and window representation.

## Run Command

To run the application in development mode:

```bash
neu run
```

## Build Command

To package the application for production (all platforms):

```bash
neu build
```

## Build Output Locations

Once built, output binaries for Windows, macOS, and Linux are located in:

```
./dist/neutralino-app/
```
```

## Git Instructions

```bash
git branch neutralino-impl
git switch neutralino-impl
git add neutralino-app/
git commit -m "feat: implement minimal neutralinojs desktop application"
git push -u origin neutralino-impl
```
