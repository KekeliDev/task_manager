import { Injectable } from '@angular/core';
import { WebserviceService } from '../webservice.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor( private webservice: WebserviceService, private router: Router, private http: HttpClient) { }

  login(email: string, password: string){
    return this.webservice.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) =>{
        // authtoken will be in the header of the response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'))
        console.log("Logged In");
       
      })
    )
  }
  register(email: string, firstName: string, lastName: string, password: string){
    return this.webservice.register(email, firstName, lastName, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) =>{
        // authtoken will be in the header of the response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'))
        console.log("Account created");
       
      })
    )
  }


  logout() {
    this.removeSession();
   
    this.router.navigate(['/login']);
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-refresh-token', accessToken)
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }

    getUserId() {
      return localStorage.getItem('user-id');
    }


  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }
  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http.get(`${this.webservice.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) =>{
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }


}
