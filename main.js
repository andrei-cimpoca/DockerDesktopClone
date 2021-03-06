const { app, BrowserWindow, ipcMain } = require("electron");
const url = require('url')
const path = require("path");
const spawn = require("child_process").spawn;

function runCommand(command) {
    const promise = new Promise((resolve, reject) => {
        let process = spawn('cmd.exe', ['/c', ...command]);
        let output = '';

        process.stdout.on("data", (data) => {
            output += data.toString();
        });
        
        process.stderr.on("data", (data) => {
            output += data.toString();
        });
        
        process.on("exit", (code) => resolve(output));
      });

    return promise;

}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });

  ipcMain.on("run-command", (event, command) => {
    console.log("Command: " + command);
    runCommand(command)
        .then((output) => event.reply('command-output', output))
  });

  // win.loadFile("frontend/build/index.html");
  win.loadURL("http://localhost:3000");

  // win.loadFile("index.html");

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
