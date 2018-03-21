document.addEventListener('DOMContentLoaded', init, false);
let data = {};

//Initial function to load default data on page
function init () {
  //Load to headers of all API request
  data.headers = {};
  data.headers.token = localStorage.mopalToken;
  //Load API URL:
  data.apiUrl = 'http://localhost:3000/';

  //Load horizontal bar items
  data.views = {};
  data.views.bar = {
    barHome: document.getElementById("barHome"),
    barPersons: document.getElementById("barPersons"),
    barSuscrib: document.getElementById("barSuscrib"),
    barEvents: document.getElementById("barEvents"),
    barConfig: document.getElementById("barConfig"),
    barExit: document.getElementById("barExit")
  };
  //Set current selected page:
  data.views.currentSection = 'barHome';
  //Load user corner
  data.views.userCorner = document.getElementById("userSpace");
  userCorenerP = request({ headers: data.headers, url: data.apiUrl + 'user/info'})
    .then(JSON.parse)
    .then((user) => data.views.userCorner.innerHTML = user.name)
    .then((user) => data.user = user);
  
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
  document.getElementById('subModal').style.display='block';
};

const blockUi = () => {
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
    age: document.getElementById('subFormAge').value,
    phone: document.getElementById('subFormPhone').value,
    easters: document.getElementById('subFormEasters').value,
    contribution: document.getElementById('subFormContribution').checked,
    sex: sex,
    guestBy: document.getElementById('subFormGuestBy').value,
    walkIn: document.getElementById('subFormWalkIn').option.value,
    easterKind: document.getElementById('subFormEasterKind').option.value
  };
};

//Subscribe Handler:
async function subscribeGuest() {
  //first block UI:
  //blockUi();
  //then fetch data:
  const dataFormSubsc = extractDataFromSubForm();
  alert(JSON.stringify(dataFormSubsc));
}

//set handlers for bar click trigger:
const handlers = {
  barSuscrib: () => {
    document.getElementById("mainFrame").src = '/subscribe';
    document.getElementById("fmHeader")
      .innerHTML = '<h5><b><i class="fa fa-user-plus"></i> Inscripciones</b></h5>';
  },
  barHome: () => {
    document.getElementById("mainFrame").src = '/zaraza';
    document.getElementById("fmHeader")
    .innerHTML = '<h5><b><i class="fa fa-dashboard"></i> My Dashboard</b></h5>';
  },
  barExit: () => {
    localStorage.clear();
    window.location = '/login';
  }
};

const barClick = (selectedId) => {
  data.views.bar[data.views.currentSection].classList.remove('w3-blue');
  data.views.bar[selectedId].classList.add('w3-blue');
  data.views.currentSection = selectedId;
  handlers[selectedId]();
}