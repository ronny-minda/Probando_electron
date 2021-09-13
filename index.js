
const { app, BrowserWindow } = require('electron');

// console.dir(app)

app.on('before-quit', () => {
    console.log('saliendo...')
})

app.on('ready', () => {
    let win = new BrowserWindow({
        // frame: false,
        width: 800,
        height: 600,
        // fullscreen: true,
        title: 'Matrix',
        center: true,
        // maximizable: false,
        show: false
    });

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        win = null;
        app.quit();
    })
    win.setMenu(null)// remover menu

    win.loadFile('./src/index.html');

})