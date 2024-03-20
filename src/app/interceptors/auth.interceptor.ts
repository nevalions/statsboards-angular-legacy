import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const token: string | null = '12345';
  let serverIP = environment.url;
  let serverPort = environment.port;
  // check for token in storage
  console.log(serverIP, serverIP);
  if (token) {
    const authReq: HttpRequest<any> = req.clone({
      headers: req.headers.set(`Authorization`, `Bearer ${token}`),
      url: `http://${serverIP}:${serverPort}/api/${req.url}`,
    });
    return next(authReq);
  } else {
    const nonAuthReq: HttpRequest<any> = req.clone({
      url: `http://${serverIP}:${serverPort}/api/${req.url}`,
    });
    return next(nonAuthReq);
  }
};
