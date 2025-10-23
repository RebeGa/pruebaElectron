const $ = selector => document.querySelector(selector)
const tabs = document.querySelectorAll('.tab-button')
const sheets = document.querySelectorAll('.sheet-content')

const $count = $('#count')
const $button = $('button')


const { ipcRenderer } = require('electron')
let editIndex = null // Índice del registro que se está editando

document.getElementById('formulario').addEventListener('submit', (e) => {
  e.preventDefault()

  const selecttipo = document.getElementById('tipo')
  const formData = {
    plantilla: document.getElementById('plantilla').value,
    plantillaID: document.getElementById('plantillaID').value,
    nombreLargo: document.getElementById('nombreLargo').value,
    siglas: document.getElementById('siglas').value,
    tipo: selecttipo.value
    // tipo: selecttipo.options[selecttipo.selectedIndex].textContent
    // tipoDocumento: document.getElementById('tipoDocumento').value
    // Dictamen: document.getElementById('Dictamen').value
  }

  if (editIndex !== null) {
    // Modo edición: actualizar registro existente
    ipcRenderer.invoke('load-data').then(rows => {
      rows[editIndex] = Object.values(formData)
      ipcRenderer.send('update-data', rows)
      editIndex = null // Salir del modo edición
      clearForm()
    })
  } else {
    // Modo nuevo: agregar registro
    ipcRenderer.send('save-form', formData)
  }
})

ipcRenderer.on('form-saved', (event, message) => {
  // eslint-disable-next-line no-undef
  alert(message)
  clearForm()
  // eslint-disable-next-line no-undef
  loadTable()
})

ipcRenderer.on('form-error', (event, message) => {
  // eslint-disable-next-line no-undef
  alert(message)
})

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Desactivar pestañas y hojas activas
    tabs.forEach(t => t.classList.remove('active'))
    sheets.forEach(s => s.classList.remove('active'))

    // Activar la pestaña y hoja seleccionadas
    tab.classList.add('active')
    const targetId = tab.getAttribute('data-target')
    document.getElementById(targetId).classList.add('active')
  })
})

$button.addEventListener('click', () => {
  const count = +$count.innerHTML
  $count.innerHTML = (count + 1).toString()
})

function clearForm () {
  document.getElementById('formulario').reset()
  editIndex = null
}


