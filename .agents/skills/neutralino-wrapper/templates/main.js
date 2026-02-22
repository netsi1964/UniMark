function setTray() {
    if (NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            { id: "ABOUT", text: "About" },
            { text: "-" },
            { id: "QUIT", text: "Quit" }
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch (event.detail.id) {
        case "ABOUT":
            Neutralino.os.showMessageBox("About", "App is running Neutralino.js", "OK", "INFO");
            break;
        case "QUIT":
            quitApp();
            break;
    }
}

// -------------------------------------------------------------
// [CRITICAL MACOS FIX]: SIGTRAP Crash Prevention 
// -------------------------------------------------------------
// On macOS, Neutralino.app.exit() causes the app to crash heavily
// (SIGTRAP / _dispatch_assert_queue_fail) because it attempts to
// close a native UI window from an asynchronous WebSocket thread.
// We circumvent this by executing a native OS kill command.
function quitApp() {
    if (NL_OS === 'Darwin') {
        Neutralino.os.execCommand('kill -15 ' + NL_PID);
    } else {
        Neutralino.app.exit();
    }
}

function onWindowClose() {
    quitApp();
}

Neutralino.init();
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if (NL_OS && NL_OS.toLowerCase() === "darwin") {
    setTray();
}

// -------------------------------------------------------------
// [CRITICAL MACOS FIX]: Native Keyboard "Beep" Prevention 
// -------------------------------------------------------------
// macOS default WebViews do not have Edit menus mapped natively without
// a native application menu. Pressing Cmd+C/V/X causes the OS to "beep" an error.
// Intercept these keys, manually execute the commands, and prevent default.
document.addEventListener('keydown', (e) => {
    if (NL_OS === 'Darwin' && e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'c':
                document.execCommand('copy');
                e.preventDefault();
                break;
            case 'v':
                document.execCommand('paste');
                e.preventDefault();
                break;
            case 'x':
                document.execCommand('cut');
                e.preventDefault();
                break;
            case 'a':
                document.execCommand('selectAll');
                e.preventDefault();
                break;
            case 'z':
                if (e.shiftKey) {
                    document.execCommand('redo');
                } else {
                    document.execCommand('undo');
                }
                e.preventDefault();
                break;
            case 'q':
                quitApp();
                e.preventDefault();
                break;
        }
    }
});
