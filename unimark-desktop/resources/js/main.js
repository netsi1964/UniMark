// This file just initializes Neutralino and sets up the window tray/close behavior.
// The actual UniMark editor is a web component loaded in index.html.

function onTrayMenuItemClicked(event) {
    if (event.detail.id === "QUIT") {
        Neutralino.app.exit();
    }
}

function onWindowClose() {
    Neutralino.app.exit();
}

function setTray() {
    if(NL_MODE != "window") {
        return;
    }
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "QUIT", text: "Quit UniMark"}
        ]
    };
    Neutralino.os.setTray(tray);
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if(NL_OS != "Darwin") { 
    setTray();
}

// macOS disables basic clipboard & undo shortcuts in WKWebView if no native Edit menu exists.
// We can manually intercept these and trigger standard web editor commands.
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
                Neutralino.app.exit();
                e.preventDefault();
                break;
        }
    }
});
