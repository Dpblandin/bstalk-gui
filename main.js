const {app, BrowserWindow, Menu, globalShortcut} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Settings',
                accelerator: 'CmdOrCtrl+S'
            },
            {
                label: 'Exit',
                role: 'quit'
            },
        ]
    }
]

function init() {
    createWindow();
    setupGlobalShortcuts();
}

function setupGlobalShortcuts() {
    globalShortcut.register('ctrl+P', () => {
        win.webContents.send('shortcut-command', 0);
    });

    globalShortcut.register('Esc', () => {
        win.webContents.send('exit-command', 0);
    });
}

function createWindow() {
 /*   const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
*/
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/index.html`)

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})
