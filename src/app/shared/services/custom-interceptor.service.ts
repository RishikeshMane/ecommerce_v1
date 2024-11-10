import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let cookie ='XSRF-TOKEN=CfDJ8L-AexaE2iVJq8qGuF9qHX2zWy3fs8va7lLPr5PUGS6wk6L86MqEOsgmRoHT4ZMZMvjXmpOMFgCG2mXtGWAOTIFqjTKULSypYvdrcx1DFECh2vZ5AQcDYoXqI5zxWoksEOKZ_VuBrIk4MqfigF8Ukww'
    const req = request.clone({
        setHeaders: {
            'Content-Type': 'application/json',
            'cookie':cookie
        },
        withCredentials: true,
      });
  
      return next.handle(req);
  }
}