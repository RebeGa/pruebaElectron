const $ = selector => document.querySelector(selector)
const tabs = document.querySelectorAll('.tab-button');
const sheets = document.querySelectorAll('.sheet-content');

const $count = $('#count')
const $button = $('button')

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Desactivar pestañas y hojas activas
    tabs.forEach(t => t.classList.remove('active'));
    sheets.forEach(s => s.classList.remove('active'));

    // Activar la pestaña y hoja seleccionadas
    tab.classList.add('active');
    const targetId = tab.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});

$button.addEventListener('click',() => {
    const count = +$count.innerHTML
    $count.innerHTML = (count + 1).toString()
})

