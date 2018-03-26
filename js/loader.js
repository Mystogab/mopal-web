const uri = '/home?token=';
const temp_token = typeof localStorage.mopalToken === "undefined" ? 'invalid' : localStorage.mopalToken;
window.location = uri + temp_token;
