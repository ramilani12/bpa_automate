import { Injectable, NgModule} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import 'rxjs/add/operator/do';
import {USER_CREDENTIALS,URL_API_HOST_BPA} from './app.api'


@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Authorization': USER_CREDENTIALS,
        'Access-Control-Allow-Origin' : URL_API_HOST_BPA,
        'Access-Control-Allow-Headers' : 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json',
        'Access-Control-Allow-Credentials' : 'true' ,
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,OPTIONS'
      }
    });
    
    return next.handle(request);
  }
};
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpsRequestInterceptor, multi: true }
  ]
})
export class InterceptorModule { }