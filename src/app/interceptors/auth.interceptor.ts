import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  const token: string | null = '12345';
  // check for token in storage
  if (token) {
    const authReq: HttpRequest<any> = req.clone({
      headers: req.headers.set(`Authorization`, `Bearer ${token}`),
      url: `http://127.0.0.1:9000/api/${req.url}`,
    });
    return next(authReq);
  } else {
    const nonAuthReq: HttpRequest<any> = req.clone({
      url: `http://127.0.0.1:9000/api/${req.url}`,
    });
    return next(nonAuthReq);
  }
};
