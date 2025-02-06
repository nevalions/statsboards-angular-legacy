// let protocol = 'https';
// let apiUrl = 'statsboard.ru';

let protocol = 'http';
let apiUrl = '213.171.10.112';

export const environment = {
  production: true,
  currentYear: new Date().getFullYear(),
  currentSeasonId: 2,
  url: apiUrl,
  port: ':9000',
  // url: 'statsboard.ru',
  // port: ':9000',
  angular_port: '',
  protocol: protocol,
  wsProtocol: 'wss',
  apiUrl: apiUrl,
  backendUrl: protocol + '://' + apiUrl,
};
