const request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};


const saySomething = () => alert("Funca");

const getUser = () => document.getElementById("user").value;
const getPass = () => document.getElementById("pass").value;
const getButton = () => document.getElementById("logButton");

const api = 'http://localhost:3000/'


const doLogin = () => {
  let user = getUser();
  let pass = getPass();
  let buttom = getButton();
  //alert(`Intentando login con usuario: ${user} y password: ${pass}`);

  buttom.disabled = true;

  const body = {user, pass};

  request({method: "POST", body: JSON.stringify(body), url: api + "user/login"})
    .then(res => {
      localStorage.mopalToken = res.token;
      window.location = '/home';
    })
    .catch(err => {
      let errorPlace = document.getElementById("errorPlace");
      let obj;
      try {
        obj = JSON.parse(err);
        buttom.disabled = false;
      } catch(e) {
        obj = { msg: 'Server conection error.' };
        buttom.disabled = false;
      }
      errorPlace.style.visibility = "visible";
      errorPlace.innerHTML = "<h3>Error:</h3><p>" + obj.msg + "</p>";
    });

};
