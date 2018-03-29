
function genOne (statObj) {
  return `<h3><b>${statObj.msg}</b> <b class="w3-text-red">${statObj.value}</b></h3><br>`;
}


async function getStats() {
  parent.blockUi();
  const domArea = document.getElementById('stadisticsArea');
  domArea.innerHTML = '';

  const buttom = document.getElementById('doThingBut');

  buttom.disabled = true;

  await parent.apiRequest('stats', 'GET')
    .then(JSON.parse)
    .then(resultSet => resultSet.map(genOne).join(' '))
    .then(parsedResultSet => domArea.innerHTML += parsedResultSet);

  parent.blockUi();

}