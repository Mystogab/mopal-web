document.addEventListener('DOMContentLoaded', init, false);
let data = {};

function toOption(oneLocal) {
  return `<option value="${oneLocal.name}|${oneLocal.id}">${oneLocal.name}</option>`;
}

//Initial function to load default data on page
async function init () {
  //Load to headers of all API request
  data.headers = {};
  data.headers.token = localStorage.mopalToken;
  //Load API URL:
  data.apiUrl = 'http://192.168.0.121:3000/';

  //Load horizontal bar items
  data.views = {};
  data.views.bar = {
    barHome: document.getElementById("barHome"),
    barPersons: document.getElementById("barPersons"),
    barSuscrib: document.getElementById("barSuscrib"),
    barEvents: document.getElementById("barEvents"),
    barConfig: document.getElementById("barConfig"),
    barExit: document.getElementById("barExit"),
    barStats: document.getElementById("barStats")
  };
  //Set current selected page:
  data.views.currentSection = 'barHome';

  //Promises, start async work
  //first block ui:
  blockUi();

  //creates locales for data
  data.locales = {};

  //Load user corner
  data.views.userCorner = document.getElementById("userSpace");
  const userCorenerP = request({ headers: data.headers, url: data.apiUrl + 'user/info'})
    .then(JSON.parse)
    .then((user) => data.views.userCorner.innerHTML = user.name)
    .then((user) => data.user = user);
  
  //load to subform the locations
  data.views.subsLocations = document.getElementById("subFormLocation");
  const locationsP = request({ headers: data.headers, url: data.apiUrl + 'local/BsAs'})
    .then(JSON.parse)
    .then(res => res.map(toOption).join(' '))
    .then(parsedRes => {
      data.views.subsLocations.innerHTML = '<option value="" disabled="" selected="">seleccione</option>' + parsedRes;
    });

  //load on DATA the CABA and JCP's locales:
  const localCabaP =request({ headers: data.headers, url: data.apiUrl + 'local/Caba'})
    .then(JSON.parse)
    .then(res => res.map(toOption).join(' '))
    .then(res => { data.locales.caba = res; });

  //load on DATA the CABA and JCP's locales:
  const localJcpP =request({ headers: data.headers, url: data.apiUrl + 'local/Jcp'})
    .then(JSON.parse)
    .then(res => res.map(toOption).join(' '))
    .then(res => { data.locales.jcp = res; });


  //wait for promises to end, and unlock UI
  await Promise.all([userCorenerP, locationsP, localCabaP, localJcpP]);
  blockUi();

};

//Create apirequest for simplify:
async function apiRequest (path, method, body) {
  let req = {};
  req.headers = data.headers;
  if (path) req.url = data.apiUrl + path;
  if (method) req.method = method;
  if (body) req.body = JSON.stringify(body);
  return request(req);
};

//Call to modal subscribe:
function modalSubOpen() {
  document.getElementById('subFormMain').reset();
  document.getElementById('subFormWalkIn').reset();
  document.getElementById('subFormAge').value = '';
  document.getElementById('subFormPhone').value = '';
  document.getElementById('subFormEasters').value = 1;
  document.getElementById('sexMale').checked = true;
  document.getElementById('subFormGuestBy').value = '';
  document.getElementById('subFormEasterKind').reset();
  document.getElementById('subFormContribution').checked = false;
  document.getElementById('subFormAdultResponsable').disabled = true;
  document.getElementById('subFormAdultResponsable').value = '';
  document.getElementById('subFormSubLocation').value = '';
  document.getElementById('subFormEmail').value = '';
  document.getElementById('subFormSubLocation').disabled = true;
  document.getElementById('subModal').style.display='block';
  document.getElementById('subFormChilds').value = 0;
  document.getElementById('subFormMaritalStatus').value = '';
};

//Call to modal tutor:
function modalTutorOpen() {
  document.getElementById('tutorFrame').contentWindow.location.reload();
  document.getElementById('subFormSelectAdult').style.display='block';
}

function blockUi() {
  const blockDiv = document.getElementById('blockUI');
  if (blockDiv.style.display == 'block') blockDiv.style.display = 'none';
  else blockDiv.style.display = 'block';
};

//Function that extract data from the subscription modal form:
const extractDataFromSubForm = () => {
  //get sex:
  let sex = document.getElementById('sexMale').checked ? "male" : document.getElementById('sexFemale').checked ? "female" : "";
  return {
    name: document.getElementById('subFormName').value,
    surname: document.getElementById('subFormSurname').value,
    age: parseInt(document.getElementById('subFormAge').value),
    phone: parseInt(document.getElementById('subFormPhone').value),
    easters: parseInt(document.getElementById('subFormEasters').value),
    contribution: document.getElementById('subFormContribution').checked,
    subLocal: document.getElementById('subFormSubLocation').value,
    sex: sex,
    mail: document.getElementById('subFormEmail').value,
    tutor: document.getElementById('subFormAdultResponsable').value,
    guestBy: document.getElementById('subFormGuestBy').value,
    walkIn: document.getElementById('subFormWalkIn').option.value,
    easterKind: document.getElementById('subFormEasterKind').option.value, 
    local: document.getElementById('subFormLocation').value,
    marital: document.getElementById('subFormMaritalStatus').value,
    childs: parseInt(document.getElementById('subFormChilds').value)
  };
};

const verifySubData = (newGuest) => {
  //validate if a child has a tutor
  if (newGuest.age < 15 && newGuest.tutor === '') return false;

  //verify if local is required:
  if (!document.getElementById('subFormSubLocation').disabled) {
    if (newGuest.subLocal === '') return false;
  }

  if (newGuest.phone === null) return false;

  if (newGuest.childs === null || isNaN(newGuest.childs)) return false;
  //verify if have necesary data
  if (newGuest.name === '' || newGuest.surname === '' || newGuest.local === '' || isNaN(newGuest.phone) || newGuest.easters < 1 || newGuest.easterKind === '' || newGuest.guestBy === '' || newGuest.childs < 0 || isNaN(newGuest.age) || newGuest.marital === '') {
    return false;
  };
  return true;
}

//Subscribe Handler:
async function subscribeGuest() {
  //first block UI:
  blockUi();
  //then fetch data:
  const dataFormSubsc = extractDataFromSubForm();
  if (!verifySubData(dataFormSubsc)) {
    alert('Verifique los datos por favor');
    blockUi();
  }
  else {
    apiRequest('user/guest', 'POST', dataFormSubsc)
      .then(JSON.parse)
      .then(res => alert(res.msg))
      .then(document.getElementById('subModal').style.display='none')
      .then(blockUi())
      .catch(err => alert('Error: No se pudo guardar, contactar administrador: tipo de error: ' + err));
  }
  //alert(JSON.stringify(dataFormSubsc));
  //unlockUI
  //blockUi();
}

function subFomrAgeToggleTutor() {
  let value = document.getElementById('subFormAge').value;
  if (parseInt(value) < 15) document.getElementById('subFormAdultResponsable').disabled = false;
  else document.getElementById('subFormAdultResponsable').disabled = true;
}

function subFormLocationChange() {
  let locationId = document.getElementById('subFormLocation').value.split('|')[1];
  let subLocat = document.getElementById('subFormSubLocation');
  if (locationId === '1' || locationId === '1665') {
    subLocat.innerHTML = `<option value="" disabled selected>seleccione</option>
    <option value="OTRO">OTRO</option>`;
    if (locationId === '1') subLocat.innerHTML += data.locales.caba;
    else {
      subLocat.innerHTML += data.locales.jcp;
    }
    subLocat.disabled = false;
  } else {
    subLocat.innerHTML = `<option value="" disabled selected>seleccione</option>
        <option value="OTRO">OTRO</option>`;
    subLocat.disabled = true;
  }
}

function updateGuest(guestId) {
  blockUi();
  let body = {
    dayOne: document.getElementById('dayOne').checked,
    dayTwo: document.getElementById('dayTwo').checked,
    dayThree: document.getElementById('dayThree').checked,
    contribution: document.getElementById('TheContrib').checked
  };
  body.id = guestId;
  apiRequest('user/guest', 'PUT', body)
    .then(JSON.parse)
    .then(res => {
      alert(res.msg);
      document.getElementById('subFormEditGuest').style.display='none';
    })
    .then(blockUi());
}

//set handlers for bar click trigger:
const handlers = {
  barSuscrib: () => {
    document.getElementById("mainFrame").src = '/subscribe';
    document.getElementById("fmHeader")
      .innerHTML = '<h5><b><i class="fa fa-user-plus"></i> Inscripciones</b></h5>';
  },
  barHome: () => {
    document.getElementById("mainFrame").src = '/mainhome';
    document.getElementById("fmHeader")
    .innerHTML = '<h5><b><i class="fa fa-dashboard"></i> My Dashboard</b></h5>';
  },
  barExit: () => {
    localStorage.clear();
    window.location = '/login';
  },
  barStats: () => {
    document.getElementById("mainFrame").src = '/stats';
    document.getElementById("fmHeader")
    .innerHTML = '<h5><b><i class="fa fa-bar-chart fa-fw"></i> Estadisticas</b></h5>';
  }
};

const barClick = (selectedId) => {
  data.views.bar[data.views.currentSection].classList.remove('w3-blue');
  data.views.bar[selectedId].classList.add('w3-blue');
  data.views.currentSection = selectedId;
  handlers[selectedId]();
}