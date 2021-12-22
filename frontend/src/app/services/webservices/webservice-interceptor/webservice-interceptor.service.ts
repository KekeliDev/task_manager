import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, throwError } from 'rxjs';
import { ObserveOnOperator } from 'rxjs/internal/operators/observeOn';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthserviceService } from '../authservices/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class WebserviceInterceptorService implements HttpInterceptor{

  constructor(private authservice: AuthserviceService) { }

  refreshingAccessToken: boolean;

  accessTokenReshreshed: Subject<any> = new Subject();
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Hnadle the requests
    request = this.addAuthHeader(request);

    // call next and handle the response
    return next.handle(request).pipe((
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if(error.status === 401) {
          // 401: unathorised

          // refreshing token
          return this.refreshAccessToken().pipe(
            switchMap(() =>{
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) =>{
              console.log(err);
              this.authservice.logout();
              return EMPTY;
            })
          )
          
          
        }
        return throwError(error);
      })
    ))
  }

  refreshAccessToken() {
     if(this.refreshingAccessToken) {
      return new Observable(observer => {
        this.accessTokenReshreshed.subscribe(() => {
          // this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
     } else {
      this.refreshingAccessToken = true;
    // call a method in auth service to send a request for a new refreshToken
    return this.authservice.getNewAccessToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        this.accessTokenReshreshed.next();
        console.log('token refreshed!');   
      })
    )
     }
    
  }

  addAuthHeader(request: HttpRequest<any>) {
    // get access token
    const  token = this.authservice.getAccessToken();

    if(token) {
      return request.clone({
        // append access token to request header
        setHeaders:{
          'x-access-token': token
        }
      })
    }

    return request;
    
  }

}
