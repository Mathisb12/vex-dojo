const { app, BrowserWindow, shell, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const logPath = path.join(app.getPath('userData'), 'crash.log')

function log(msg) {
  try {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`)
  } catch { /* ignore */ }
}

// Avoid silent crashes on machines with buggy/older GPU drivers —
// this is the #1 cause of "I click the exe and nothing happens".
app.disableHardwareAcceleration()

// Chromium's sandboxed renderer fails to launch when the app runs from a
// network/UNC path (school servers, mapped drives) — "launch-failed", exitCode 18.
// --no-sandbox is the standard fix for this exact failure mode.
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-gpu-sandbox')

process.on('uncaughtException', (err) => {
  log(`Uncaught exception: ${err.stack || err}`)
  dialog.showErrorBox('VEX Dojo crashed', `${err.message}\n\nLog: ${logPath}`)
})

function createWindow() {
  log('Creating window...')

  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // allow Monaco web workers from file://
    },
    title: 'VEX Dojo',
    backgroundColor: '#0d1117',
    show: false,
  })

  const indexPath = path.join(__dirname, '../dist/index.html')
  log(`Loading: ${indexPath} (exists: ${fs.existsSync(indexPath)})`)

  win.loadFile(indexPath).catch(err => log(`loadFile failed: ${err}`))

  win.webContents.on('did-fail-load', (_e, code, desc) => {
    log(`did-fail-load: ${code} ${desc}`)
  })

  win.webContents.on('render-process-gone', (_e, details) => {
    log(`render-process-gone: ${JSON.stringify(details)}`)
    dialog.showErrorBox('VEX Dojo crashed', `Renderer process gone: ${details.reason}\n\nLog: ${logPath}`)
  })

  win.once('ready-to-show', () => {
    log('Window ready, showing.')
    win.show()
  })

  win.setMenuBarVisibility(false)

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  log(`App ready. Electron ${process.versions.electron}, Node ${process.versions.node}, Platform ${process.platform} ${process.arch}`)
  createWindow()
}).catch(err => {
  log(`whenReady failed: ${err.stack || err}`)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
