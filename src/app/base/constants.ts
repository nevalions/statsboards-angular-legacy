// export const currentYear = new Date().getFullYear();
// export const currentSeasonId = 6;
// export const staticUrl = 'http://0.0.0.0:9000';

import { environment } from '../../environments/environment';

let serverIP = environment.url;
let serverPort = environment.port;
let serverProtocol = environment.protocol;

export let urlWithProtocolAndPort =
  serverProtocol + '://' + serverIP + serverPort;
export let urlWithProtocol = serverProtocol + '://' + serverIP;
