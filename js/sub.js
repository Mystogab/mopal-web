document.addEventListener('DOMContentLoaded', init, false);

const ifChecked = (boolVar) => boolVar ? 'checked' : '';

const drawGuestEditModal = (guest) => {
  let content = parent.document.getElementById('subFormEditGuestContent');
  content.innerHTML = '';
  content.innerHTML += '<p>';
  const translations = {
    name: 'Nombre: ',
    surname: 'Apellido',
    age: 'Edad',
    phone: 'Telefono',
    easters: 'Numero de Pascua',
    tutor: 'Adulto Responsable',
    sex: 'Sexo',
    guestBy: 'Invitado por',
    walkIn: 'Comunidad en la que Camina',
    easterKind: 'Tipo de Pascua que realiza',
    subLocal: 'Barrio',
    local: 'Localidad',
    marital: 'Estado Civil',
    childs: 'Hijos',
    mail: 'Correo electronico',
    subscribedBy: 'Fue inscripto por'
  };

  const translateKeyResult = (keyResult) => {
    if (keyResult === 'male') return 'Hombre';
    else {
      if (keyResult === 'female') return 'Mujer';
      else {
        return keyResult;
      }
    }
  };

  Object.keys(guest).forEach(key => {
    if (key !== 'dayOne' && key !== 'dayTwo' && key !== 'dayThree' && key !== 'contribution' && key !== '_id' && key !== '__v') {
      content.innerHTML += `<b>${translations[key] + '</b>: ' + translateKeyResult(guest[key])}<br>`;
    };
  });
  content.innerHTML += '</p>';

  //aca tengo que meter los checkboxes magicamente

  content.innerHTML += `<form class="w3-container">
  <h4>Actualizar:</h4>
  <p>
    <label>
      <input id="dayOne" class="w3-check" type="checkbox" ${ifChecked(guest.dayOne)}>
      Día 1
    </label>
  </p>
  <p>
    <label>
      <input id="dayTwo" class="w3-check" type="checkbox" ${ifChecked(guest.dayTwo)}>
      Día 2
    </label>
  </p>
  <p>
    <label>
      <input id="dayThree" class="w3-check" type="checkbox" ${ifChecked(guest.dayThree)}>
      Día 3
    </label>
  </p>
  <p>
    <label>
      <input id="TheContrib" class="w3-check" type="checkbox" ${ifChecked(guest.contribution)}>
      Contribución
    </label>
  </p>

</form>`;

  //fin de magia


  content.innerHTML += `<div class="w3-display-container" style="float:right;right:10px">
  <div class="w3-padding-16">
    <button class="w3-button w3-red" onclick="document.getElementById('subFormEditGuest').style.display='none'">Cancelar</button>
    <button class="w3-button w3-green" onclick="updateGuest('${guest._id}')">Actualizar</button>
  </div>
</div>`;
  parent.document.getElementById('subFormEditGuest').style.display='block';
}


const modalStart = (guestId) => {
  parent.apiRequest(`user/info/${guestId}`, 'GET')
    .then(JSON.parse)
    .then(drawGuestEditModal)
    .catch(err => alert(err));
}

const drawTableElement = (el) => {
  return `<tr onclick="modalStart('${el._id}')">
    <td>${el.name}</td>
    <td>${el.surname}</td>
    <td>${el.age}</td>
    <td>${el.local}</td>
  </tr>`;
}

const drawTable = (results) => {
  let table = `<table class="w3-table-all w3-hoverable" style="max-width:650px">
  <thead>
    <tr class="w3-blue">
      <th>Nombre</th>
      <th>Apellido</th>
      <th>Edad</th>
      <th>Localidad</th>
    </tr>
  </thead>`;
  results.forEach(element => {
    table += drawTableElement(element);
  });
  return table + '</table>';
}


function init () {
  // Get the input box
  let textInput = document.getElementById('searchInput');

  // Init a timeout variable to be used below
  let timeout = null;

  // Listen for keystroke events
  textInput.onkeyup = function (e) {

      // Clear the timeout if it has already been set.
      // This will prevent the previous task from executing
      // if it has been less than <MILLISECONDS>
      if (textInput.value.length >= 4){
        clearTimeout(timeout);
        
        // Make a new timeout set to go off in 800ms
        timeout = setTimeout(function () {
          document.getElementById('searchResults').innerHTML = '<h4>Resultados para: ' + textInput.value + '</h4>';
          parent.apiRequest('user/search', 'POST', {search: textInput.value})
            .then(JSON.parse)
            .then(res => document.getElementById('searchResults').innerHTML += drawTable(res));
        }, 500);
      }
      
  };
};