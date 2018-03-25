document.addEventListener('DOMContentLoaded', init, false);


const selectGuest = (guestId, guestName) => {
  parent.document.getElementById('subFormAdultResponsable').value = guestName + '|' + guestId;
  parent.document.getElementById('subFormSelectAdult').style.display = 'none';
}

const drawTableElement = (el) => {
  return `<tr onclick="selectGuest('${el.id}', '${el.name + el.surname}')">
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
  textInput.value = '';

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