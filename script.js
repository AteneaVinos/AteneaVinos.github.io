const url = 'vinos.json';

// Función para obtener los datos de los vinos
async function obtenerVinos() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error al obtener los datos de los vinos:', error);
      }
  }
  
  // Función para mostrar los vinos en sus categorías, filtrados por denominación de origen
  async function mostrarVinosPorCategoria() {
    const blancoWines = document.getElementById('blanco-wines');
    const tintoWines = document.getElementById('tinto-wines');
    const rosadoWines = document.getElementById('rosado-wines');
    const espumosoWines = document.getElementById('espumoso-wines');
    const cavaWines = document.getElementById('cava-wines');
  
    blancoWines.innerHTML = '';
    tintoWines.innerHTML = '';
    rosadoWines.innerHTML = '';
    espumosoWines.innerHTML = '';
    cavaWines.innerHTML = '';
  
    const vinos = await obtenerVinos();
  
    vinos.tintos.forEach(vino => mostrarVino(vino, tintoWines));
    vinos.blancos.forEach(vino => mostrarVino(vino, blancoWines));
    vinos.rosados.forEach(vino => mostrarVino(vino, rosadoWines));
    vinos.espumosos.forEach(vino => mostrarVino(vino, espumosoWines));
    vinos.cavas.forEach(vino => mostrarVino(vino, cavaWines));
  
    // Crear la lista desplegable de denominaciones de origen
    const denominaciones = obtenerDenominacionesUnicas(vinos);
    const select = document.getElementById('filter-select');
    select.innerHTML = ''; // Limpiar opciones existentes
    denominaciones.forEach(denominacion => {
      const option = document.createElement('option');
      option.value = denominacion;
      option.textContent = denominacion;
      select.appendChild(option);
    });
  
    select.addEventListener('change', () => {
        const selectedDenomination = select.value.toLowerCase();
        const allWines = document.querySelectorAll('.wine');
        allWines.forEach(wine => {
          const wineDenomination = wine.querySelector('p:first-of-type').textContent.toLowerCase();
          if (selectedDenomination === 'todos' || wineDenomination.includes(selectedDenomination)) {
            wine.style.display = 'block'; // Mostrar el vino si coincide o si se selecciona "todos"
          } else {
            wine.style.display = 'none'; // Ocultar el vino si no coincide
          }
        });
        // Ocultar las categorías que no tengan vinos visibles
        ocultarCategoriasSinVinos();
      });
    
      // Ocultar las categorías que no tengan vinos visibles inicialmente
      ocultarCategoriasSinVinos();

    
  }
  
  // Función para obtener denominaciones de origen únicas del JSON de vinos
  function obtenerDenominacionesUnicas(vinos) {
    const denominaciones = [];
    vinos.tintos.forEach(vino => {
      if (!denominaciones.includes(vino.denominacionOrigen)) {
        denominaciones.push(vino.denominacionOrigen);
      }
    });
    vinos.blancos.forEach(vino => {
      if (!denominaciones.includes(vino.denominacionOrigen)) {
        denominaciones.push(vino.denominacionOrigen);
      }
    });
    vinos.rosados.forEach(vino => {
      if (!denominaciones.includes(vino.denominacionOrigen)) {
        denominaciones.push(vino.denominacionOrigen);
      }
    });
    vinos.espumosos.forEach(vino => {
      if (!denominaciones.includes(vino.denominacionOrigen)) {
        denominaciones.push(vino.denominacionOrigen);
      }
    });
    vinos.cavas.forEach(vino => {
      if (!denominaciones.includes(vino.denominacionOrigen)) {
        denominaciones.push(vino.denominacionOrigen);
      }
    });
    denominaciones.sort(); // Opcional: ordenar las denominaciones alfabéticamente
    denominaciones.unshift('Todos'); // Agregar la opción "Todos" al principio
    return denominaciones;
  }

  // Función para ocultar las categorías que no tengan vinos visibles
function ocultarCategoriasSinVinos() {
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
      const wines = category.querySelectorAll('.wine');
      let hasVisibleWines = false;
      wines.forEach(wine => {
        if (wine.style.display !== 'none') {
          hasVisibleWines = true;
        }
      });
      if (!hasVisibleWines) {
        category.style.display = 'none'; // Ocultar la categoría si no tiene vinos visibles
      } else {
        category.style.display = 'block'; // Mostrar la categoría si tiene vinos visibles
      }
    });
  }

  // Mostrar todos los vinos al cargar la página
  mostrarVinosPorCategoria();
  

// Función auxiliar para mostrar un vino en un contenedor específico
function mostrarVino(vino, container) {
  const wineDiv = document.createElement('div');
  wineDiv.classList.add('wine');
  wineDiv.innerHTML = `
    <h3>${vino.name}</h3>
    <p><strong>${vino.denominacionOrigen.includes('D.O.') ? 'D.O' : 'Origen'}:</strong> ${vino.denominacionOrigen}</p>
    <p><strong>Ubicación:</strong> ${vino.ubicacion}</p>
    <p><strong>Precio:</strong> ${vino.precio}</p>
    <img src="${vino.foto}" alt="${vino.name}">
  `;

  // Añadir evento de clic al div del vino
  wineDiv.addEventListener('click', () => {
      // Generar el HTML del modal con información adicional del vino
      const modalHTML = `
        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${vino.name}</h2>
            <hr>
            <p><strong>${vino.denominacionOrigen.includes('D.O.') ? 'Denominación Origen' : 'Origen'}:</strong> ${vino.denominacionOrigen}</p>
            <p><strong>Tipo de Uva:</strong> ${vino.tipoUva}</p>
            <p><strong>Nota de Cata:</strong></p>
            <ul>
            <li><p><strong>Vista:</strong>${vino.notaCataVisual}</p></li>
            <li><p><strong>Nariz:</strong>${vino.notaCataNariz}</p></li>
            <li><p><strong>Boca:</strong>${vino.notaCataBoca}</p></li>
            </ul>
            <p><strong>Ubicación:</strong> ${vino.ubicacion}</p>
            <p><strong>Crianza:</strong> ${vino.crianza}</p>
            <p><strong>Precio:</strong> ${vino.precio}</p>
            <img src="${vino.foto}" alt="${vino.name}">
          </div>
        </div>
      `;

      // Agregar el modal al documento
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Mostrar el modal
      document.getElementById('myModal').style.display = "block";

      // Cuando se hace clic en el botón de cerrar del modal, cerrar el modal
      document.querySelector('.close').addEventListener('click', () => {
          document.getElementById('myModal').remove();
      });
  });

  container.appendChild(wineDiv);
}


