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
    .then((res) => data.views.userCorner.innerHTML = res.name);
  
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

//set handlers for bar click trigger:
const handlers = {
  barSuscrib: () => {
    document.getElementById("prueba").src = '/subscribe';
    document.getElementById("fmHeader")
      .innerHTML = '<h5><b><i class="fa fa-user-plus"></i> Inscripciones</b></h5>';
  },
  barHome: () => {
    document.getElementById("prueba").src = '/zaraza';
    document.getElementById("fmHeader")
    .innerHTML = '<h5><b><i class="fa fa-dashboard"></i> My Dashboard</b></h5>';
  }
};

const barClick = (selectedId) => {
  data.views.bar[data.views.currentSection].classList.remove('w3-blue');
  data.views.bar[selectedId].classList.add('w3-blue');
  data.views.currentSection = selectedId;
  handlers[selectedId]();
}