process.env.APP_TYPE = 'electron';
console.log(process.env.APP_TYPE);
const server = require('../server');
const clientServer = require('./client-server');
const {app, protocol, BrowserWindow, globalShortcut} = require('electron')
const path = require('path');


// Module to create native browser window.
const os = require('os');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600,kiosk: false})
  let webContents = mainWindow.webContents;
  webContents.once('did-start-loading', () => {
    mainWindow.webContents.executeJavaScript("localStorage.setItem('thorium_clientId','" + os.hostname() + "');");
  })
  
  protocol.registerFileProtocol('thorium', (request, callback) => {
    const url = request.url.substr(7)
    callback({path: path.normalize(`${__dirname}/${url}`)})
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${process.resourcesPath}/app/index-server.html`)
  globalShortcut.register('CommandOrControl+Alt+E', function () {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.