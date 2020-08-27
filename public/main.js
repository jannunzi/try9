const {app, BrowserWindow} = require('electron')
const path = require('path')
require('./server/server')
function createWindow () {
  const win = new BrowserWindow({width: 800, height: 600})
  // win.loadURL('http://localhost:3000/')
  win.loadURL(
    `file://${path.join(__dirname, '../build/index.html')}`)
}
app.on('ready', createWindow)
