// let protocol = 'https';
// let apiUrl = 'statsboard.ru';

// export const environment = {
//   production: true,
//   currentYear: new Date().getFullYear(),
//   currentSeasonId: 2,
//   url: 'statsboard.ru',
//   port: ':9000',
//   angular_port: '',
//   protocol: protocol,
//   wsProtocol: 'wss',
//   apiUrl: apiUrl,
//   backendUrl: protocol + '://' + apiUrl,
// };
let protocol = 'https';
let apiUrl = 'localhost:9000';

export const environment = {
  production: false,
  currentYear: new Date().getFullYear(),
  currentSeasonId: 2,
  url: 'localhost',
  port: ':9000',
  angular_port: '',
  protocol: protocol,
  wsProtocol: 'ws',
  apiUrl: apiUrl,
  backendUrl: protocol + '://' + apiUrl,
};
