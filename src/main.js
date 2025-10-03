const {app, BrowserWindow} = require('electron')  

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600
    })
    window.loadFile('src/index.html')
}

const createcrearFormulario = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600
    })
    window.loadFile('src/crearFormulario.html')
}

const creategenerarEjericicio = () => {
      const window = new BrowserWindow({
        width: 800,
        height: 600
    })
    window.loadFile('src/generarEjercicio.html')

}

const createeliminarFormulario = () => {
    const window = new BrowserWindow ({
        width: 800,
        height: 600
    })

    window.loadFile('src/eliminarFormulario.html')
}

const createagregarFormulario = () => {
    const window = new BrowserWindow ({
        width: 800,
        height: 600
    })
    window.loadFile('src/agregarFormulario.html')
}


app.whenReady().then(() =>{
    createWindow()
    createcrearFormulario()
    creategenerarEjericicio()
    createeliminarFormulario()
    createagregarFormulario()
})