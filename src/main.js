/* eslint-disable */
/**
 * main.js - proceso principal de la aplicación Electron
 *
 * Cambios y por qué:
 * - Se habilita `nodeIntegration: true` y `contextIsolation: false` en las ventanas
 *   para mantener compatibilidad con el código renderer existente que usa
 *   `const { ipcRenderer } = require('electron')` y carga `renderer.js` desde el HTML.
 *   Esto corrige el bug donde el formulario no enviaba datos al proceso principal
 *   (resultado: CSV vacío) cuando `ipcRenderer` no estaba disponible.
 *
 * - Eliminamos el uso incorrecto de `preload: path.join(__dirname, 'renderer.js')`.
 *   El archivo `renderer.js` se debe cargar desde el HTML (mediante <script>) o
 *   bien usar un `preload.js` separado que exponga una API segura vía contextBridge.
 *
 * Riesgos y recomendaciones:
 * - Mantener `nodeIntegration: true` es más inseguro: un XSS en el renderer podría
 *   otorgar acceso al sistema de archivos. Recomendamos migrar a un `preload.js`
 *   que utilice `contextBridge.exposeInMainWorld()` y exponer solo la API necesaria.
 *
 * - CSV: actualmente se concatenan campos con comas. Si los campos contienen comas
 *   se romperá la estructura. Se recomienda usar una librería CSV o envolver/escapar
 *   campos (por ejemplo, entre comillas y escapando comillas internas).
 */


const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const csvPath = path.join(__dirname, 'data.csv')

// Mantener referencia a la ventana principal (buena práctica para eventos y pruebas)
let mainWindow = null

// Crea la ventana principal y habilita las preferencias que el renderer actual espera.
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Nota: habilitado por compatibilidad con el renderer actual.
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.loadFile('src/index.html')

  // Liberar referencia cuando se cierre la ventana
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Handlers IPC: guardar y cargar datos CSV
ipcMain.on('save-form', (event, formData) => {
  try {
    // Escapar comas si fuera necesario o usar una librería CSV en el futuro
    // Construimos la fila CSV con valores seguros; aquí usamos una concatenación simple.
    // Atención: si `formData` puede contener comas o saltos de línea, mejorar escape.
    const row = `${formData.plantilla || ''},${formData.plantillaID || ''},${formData.nombreLargo || ''},${formData.siglas || ''},${formData.tipo || ''}\n`
    fs.appendFileSync(csvPath, row, 'utf8')
    event.reply('form-saved', 'Datos guardados correctamente.')
  } catch (err) {
    console.error('Error guardando CSV:', err)
    event.reply('form-error', 'Error al guardar los datos.')
  }
})

ipcMain.handle('load-data', async () => {
  try {
    const content = fs.existsSync(csvPath) ? fs.readFileSync(csvPath, 'utf8') : ''
    if (!content) return []
    const rows = content.trim().split('\n').map(line => line.split(','))
    return rows
  } catch (err) {
    console.error('Error leyendo CSV:', err)
    return []
  }
})

// Ventanas secundarias (se crean sólo cuando se llaman)
const createcrearFormulario = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  window.loadFile('src/crearFormulario.html')
}

const creategenerarEjericicio = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  window.loadFile('src/generarEjercicio.html')
}

const createeliminarFormulario = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  window.loadFile('src/eliminarFormulario.html')
}

const createagregarFormulario = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // No usar renderer.js como preload; el HTML carga ./renderer.js con <script defer>.
      // Si más adelante se migra a un preload seguro, aquí iría `preload: path.join(...)`.
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  window.loadFile('src/agregarFormulario.html')
}
// Inicialización única: asegurar CSV y crear la ventana principal
app.whenReady().then(() => {
  if (!fs.existsSync(csvPath)) {
    // Creamos el archivo CSV vacío si aún no existe.
    fs.writeFileSync(csvPath, '', 'utf8')
  }
  createWindow()
})

// Comportamiento cross-platform: en macOS normalmente no se sale cuando se cierran
// todas las ventanas. Este listener respeta esa convención (salida sólo fuera de darwin).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})