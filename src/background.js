import {app, BrowserWindow, Menu, ipcMain} from 'electron'
import electronLocalshortcut from 'electron-localshortcut'
import fs from 'fs'
import config from './services/config'
import env from './env'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Settings',
                accelerator: 'CmdOrCtrl+S',
                click(item, focusedWindow) {
                   if(focusedWindow) focusedWindow.webContents.send('toggle-view', 'settings')
                }
            },
            {
                label: 'Exit',
                role: 'quit'
            }
        ]
    },
    {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Refresh',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                    if(focusedWindow) focusedWindow.reload()
                }
            },
            {
                label: 'Open search bar',
                accelerator: 'CmdOrCtrl+P',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.send('shortcut-command', 0)
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                label: 'Fullscreen',
                role: 'togglefullscreen'
            },
            {
                label: 'Hide',
                role: 'hide'
            }

        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
]

function init() {
    buildMenu()
    createWindow()
    setUpConfigFile()
    setUpUiFile()
    listenForConfigChanges()
    listenForUiChanges()
    readRepositoriesCache()
    cacheRepositories()
    removeRepositoriesCache()
    setupGlobalShortcuts()
}

function buildMenu() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function setUpConfigFile() {
    ipcMain.on('vue-ready', (event) => {
        if(!config.configExists()) {
           config.createConfigFile()
        }
        fs.readFile(config.configFile(), 'utf-8', (err, data) => {
            event.sender.send('config-file-ready', data)
        })

    })
}

function setUpUiFile() {
    ipcMain.on('vue-ready', (event) => {
        if (!config.uiExists()) {
            config.createUiFile()
        }
        fs.readFile(config.uiFile(), 'utf-8', (err, data) => {
            event.sender.send('ui-file-ready', data)
        })
    })
}

function listenForConfigChanges() {
    ipcMain.on('config-file-changed', (event, arg) =>  {
        config.removeReposFile((err) => {
            event.sender.send('repos-cache-removed', err)
        });
        config.updateConfigFile(arg, () => {
            event.sender.send('config-file-saved')
        })
    })
}

function listenForUiChanges() {
    ipcMain.on('ui-file-changed', (event, arg) =>  {
        config.updateUiFile(arg, () => {
            event.sender.send('ui-file-saved')
        })
    })
}

function cacheRepositories() {
    ipcMain.on('save-repos-cache', (event, repos) => {
        config.createReposFile(repos)
    })
}

function readRepositoriesCache() {
    ipcMain.on('load-repos-cache', (event) => {
        config.loadReposFile((err, data) => {
            event.sender.send('repos-cache-loaded', err, data)  
        })
        
    })
}

function removeRepositoriesCache() {
    ipcMain.on('remove-repos-cache', (event) => {
        config.removeReposFile((err) => {
            event.sender.send('repos-cache-removed', err)
        })
    })
}

function setupGlobalShortcuts() {
    electronLocalshortcut.register(win, 'ctrl+P', () => {
        win.webContents.send('shortcut-command', 0)
    });

    electronLocalshortcut.register(win, 'Esc', () => {
        win.webContents.send('exit-command', 0)
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
    if(env.name === 'development') {
        win.webContents.openDevTools()
    }
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

app.on('will-quit', () => {
    // Unregister all shortcuts.
    electronLocalshortcut.unregisterAll(win)
})
