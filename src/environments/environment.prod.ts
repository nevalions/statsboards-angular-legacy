let protocol = 'http';
let apiUrl = 'statsboard.ru';

export const environment = {
  production: true,
  currentYear: new Date().getFullYear(),
  currentSeasonId: 2,
  url: 'statsboard.ru',
  port: ':9000',
  angular_port: '',
  protocol: protocol,
  wsProtocol: 'wss',
  apiUrl: apiUrl,
  backendUrl: protocol + '://' + apiUrl + ':9000',
};
